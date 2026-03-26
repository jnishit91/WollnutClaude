// src/app/api/v1/instances/[id]/stop/route.ts
// Stop a running instance

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess, apiError } from "@/lib/utils/api-response";
import { ResourceNotFoundError } from "@/lib/utils/errors";
import { e2eService } from "@/lib/services/e2e-networks";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("instances");

export const POST = withErrorHandler(async (_req, context) => {
  const user = await requireAuth();
  const params = await context.params;
  const id = params.id as string;

  const instance = await prisma.instance.findFirst({
    where: { id, userId: user.id },
  });

  if (!instance) {
    throw new ResourceNotFoundError("Instance", id);
  }

  if (instance.status !== "RUNNING") {
    return apiError(
      "Instance must be running to stop it",
      400,
      "INVALID_STATE"
    );
  }

  // Call E2E to power off
  if (instance.e2eNodeId) {
    await e2eService.performAction(instance.e2eNodeId, "power_off");
  }

  const now = new Date();

  // Calculate final billing for unbilled time
  if (instance.lastBilledAt) {
    const unbilledMinutes = Math.ceil(
      (now.getTime() - instance.lastBilledAt.getTime()) / 60_000
    );

    if (unbilledMinutes > 0) {
      const charge = unbilledMinutes * Number(instance.pricePerMinute);

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { creditsBalance: { decrement: charge } },
        select: { creditsBalance: true },
      });

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
        prisma.transaction.create({
          data: {
            userId: user.id,
            type: "USAGE_DEDUCTION",
            amount: -charge,
            balance: Number(updatedUser.creditsBalance),
            description: `Usage: ${instance.name} (${unbilledMinutes} min)`,
            instanceId: instance.id,
          },
        }),
      ]);

      log.info("Billed for instance stop", {
        instanceId: id,
        minutes: unbilledMinutes,
        charge,
      });
    }
  }

  await prisma.instance.update({
    where: { id },
    data: {
      status: "STOPPED",
      stoppedAt: now,
    },
  });

  return apiSuccess({ status: "STOPPED" });
});
