// src/app/api/v1/instances/route.ts
// List and create GPU instances

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { createInstanceSchema } from "@/lib/validators/instance.schema";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import {
  InsufficientCreditsError,
  ResourceNotFoundError,
} from "@/lib/utils/errors";
import { instanceCreateLimiter, getRateLimitKey } from "@/lib/utils/rate-limiter";
import { RateLimitError } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";
import { e2eService } from "@/lib/services/e2e-networks";

const log = createLogger("instances");

export const GET = withErrorHandler(async (req) => {
  const user = await requireAuth();
  const { searchParams } = new URL(req.url);
  const includeDestroyed = searchParams.get("includeDestroyed") === "true";

  const where: Record<string, unknown> = { userId: user.id };
  if (!includeDestroyed) {
    where.status = { not: "DESTROYED" };
  }

  const instances = await prisma.instance.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      sshKey: {
        select: { id: true, name: true, fingerprint: true },
      },
      volumes: {
        select: { id: true, name: true, sizeGb: true, status: true },
      },
    },
  });

  return apiSuccess(
    instances.map((i) => ({
      ...i,
      pricePerHour: Number(i.pricePerHour),
      pricePerMinute: Number(i.pricePerMinute),
      totalBilledAmount: Number(i.totalBilledAmount),
    }))
  );
});

export const POST = withErrorHandler(async (req) => {
  const user = await requireAuth();

  // Rate limit
  const key = getRateLimitKey(req, user.id);
  const limit = instanceCreateLimiter.check(key);
  if (!limit.allowed) {
    throw new RateLimitError(Math.ceil(limit.retryAfterMs / 1000));
  }

  const body = await req.json();
  const data = createInstanceSchema.parse(body);

  // Look up GPU plan
  const plan = await prisma.gPUPlan.findUnique({
    where: { id: data.planId },
  });
  if (!plan || !plan.available) {
    throw new ResourceNotFoundError("GPU Plan", data.planId);
  }

  // Look up template
  const template = await prisma.template.findUnique({
    where: { slug: data.templateSlug },
  });
  if (!template || !template.active) {
    throw new ResourceNotFoundError("Template", data.templateSlug);
  }

  // Check credits (at least 1 hour worth)
  const dbUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { creditsBalance: true },
  });
  const balance = Number(dbUser.creditsBalance);
  const hourlyRate = Number(plan.wollnutPricePerHour);

  if (balance < hourlyRate) {
    throw new InsufficientCreditsError(hourlyRate, balance);
  }

  // Get SSH key E2E ID if provided
  let sshKeyIds: number[] = [];
  let sshKeyId: string | null = null;
  if (data.sshKeyId) {
    const sshKey = await prisma.sSHKey.findFirst({
      where: { id: data.sshKeyId, userId: user.id },
    });
    if (sshKey) {
      sshKeyId = sshKey.id;
      if (sshKey.e2eKeyId) sshKeyIds = [parseInt(sshKey.e2eKeyId, 10)];
    }
  }

  // Call E2E Networks to create node
  const e2eNode = await e2eService.createNode({
    name: data.name,
    plan: plan.e2ePlanId,
    image: parseInt(template.e2eImageId, 10),
    ssh_keys: sshKeyIds,
    region: data.region || "Delhi",
    backups: false,
  });

  // Create instance record
  const instance = await prisma.instance.create({
    data: {
      userId: user.id,
      name: data.name,
      status: "PROVISIONING",
      e2eNodeId: e2eNode.id?.toString() ?? null,
      e2ePlanId: plan.e2ePlanId,
      e2eImageId: template.e2eImageId,
      e2eRegion: data.region || "Delhi",
      gpuType: plan.gpuShortName,
      gpuCount: data.gpuCount,
      vram: plan.vram,
      vcpus: plan.vcpus,
      ram: plan.ram,
      storageGb: data.storageGb,
      pricePerHour: plan.wollnutPricePerHour,
      pricePerMinute: plan.wollnutPricePerMinute,
      sshKeyId,
      autoShutdownMin: data.autoShutdownMin ?? null,
      startedAt: new Date(),
      lastBilledAt: new Date(),
    },
    include: {
      sshKey: {
        select: { id: true, name: true, fingerprint: true },
      },
      volumes: {
        select: { id: true, name: true, sizeGb: true, status: true },
      },
    },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "instance_provisioning",
      title: "Instance provisioning started",
      message: `Your ${plan.gpuShortName} instance "${data.name}" is being provisioned.`,
      actionUrl: `/dashboard/instances/${instance.id}`,
    },
  });

  // Schedule auto-shutdown if configured
  if (data.autoShutdownMin) {
    try {
      const { scheduleAutoShutdown } = await import("@/lib/jobs/auto-shutdown");
      await scheduleAutoShutdown(instance.id, data.autoShutdownMin);
    } catch {
      // Non-critical — Redis may not be available
    }
  }

  log.info("Instance created", {
    userId: user.id,
    instanceId: instance.id,
    gpu: plan.gpuShortName,
  });

  return apiSuccess(
    {
      ...instance,
      pricePerHour: Number(instance.pricePerHour),
      pricePerMinute: Number(instance.pricePerMinute),
      totalBilledAmount: Number(instance.totalBilledAmount),
    },
    201
  );
});
