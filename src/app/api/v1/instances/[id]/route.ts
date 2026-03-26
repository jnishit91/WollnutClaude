// src/app/api/v1/instances/[id]/route.ts
// Get instance detail and destroy instance

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { ResourceNotFoundError } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";
import { e2eService } from "@/lib/services/e2e-networks";

const log = createLogger("instances");

async function findUserInstance(id: string, userId: string) {
  const instance = await prisma.instance.findFirst({
    where: { id, userId },
    include: {
      sshKey: {
        select: { id: true, name: true, fingerprint: true },
      },
      volumes: {
        select: { id: true, name: true, sizeGb: true, status: true },
      },
    },
  });

  if (!instance) {
    throw new ResourceNotFoundError("Instance", id);
  }

  return instance;
}

export const GET = withErrorHandler(async (_req, context) => {
  const user = await requireAuth();
  const params = await context.params;
  const id = params.id as string;

  const instance = await findUserInstance(id, user.id);

  return apiSuccess({
    ...instance,
    pricePerHour: Number(instance.pricePerHour),
    pricePerMinute: Number(instance.pricePerMinute),
    totalBilledAmount: Number(instance.totalBilledAmount),
  });
});

export const DELETE = withErrorHandler(async (_req, context) => {
  const user = await requireAuth();
  const params = await context.params;
  const id = params.id as string;

  const instance = await findUserInstance(id, user.id);

  // Call E2E to delete node if it exists
  if (instance.e2eNodeId) {
    try {
      await e2eService.deleteNode(instance.e2eNodeId);
    } catch (error) {
      log.error("Failed to delete E2E node", error, {
        instanceId: id,
        e2eNodeId: instance.e2eNodeId,
      });
      // Continue with local cleanup even if E2E fails
    }
  }

  const now = new Date();

  // Calculate final billing for unbilled time
  if (
    instance.status === "RUNNING" &&
    instance.lastBilledAt
  ) {
    const unbilledMinutes = Math.ceil(
      (now.getTime() - instance.lastBilledAt.getTime()) / 60_000
    );
    if (unbilledMinutes > 0) {
      const charge =
        unbilledMinutes * Number(instance.pricePerMinute);

      await prisma.$transaction([
        prisma.usageLog.create({
          data: {
            instanceId: instance.id,
            userId: user.id,
            startTime: instance.lastBilledAt,
            endTime: now,
            durationMin: unbilledMinutes,
            amountCharged: charge,
            gpuType: instance.gpuType,
            pricePerMin: instance.pricePerMinute,
          },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { creditsBalance: { decrement: charge } },
        }),
        prisma.transaction.create({
          data: {
            userId: user.id,
            type: "USAGE_DEDUCTION",
            amount: -charge,
            balance: 0, // Will be recalculated
            description: `Final billing: ${instance.name} (${unbilledMinutes} min)`,
            instanceId: instance.id,
          },
        }),
      ]);
    }
  }

  // Update instance status
  await prisma.instance.update({
    where: { id },
    data: {
      status: "DESTROYING",
      destroyedAt: now,
      stoppedAt: instance.stoppedAt ?? now,
    },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "instance_destroyed",
      title: "Instance destroyed",
      message: `Instance "${instance.name}" has been destroyed.`,
    },
  });

  log.info("Instance destroyed", { userId: user.id, instanceId: id });

  return apiSuccess({ deleted: true });
});
