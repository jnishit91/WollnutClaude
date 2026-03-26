// src/lib/jobs/auto-shutdown.ts
// Per-instance auto-stop timers

import prisma from "@/lib/prisma";
import { billingService } from "@/lib/services/billing.service";
import { notificationService } from "@/lib/services/notification.service";
import { createLogger } from "@/lib/utils/logger";
import { getQueue, createWorker, QUEUE_NAMES } from "./queue";

const log = createLogger("auto-shutdown");

interface AutoShutdownData {
  instanceId: string;
}

async function processAutoShutdown(data: AutoShutdownData) {
  const { instanceId } = data;

  const instance = await prisma.instance.findUnique({
    where: { id: instanceId },
  });

  if (!instance) {
    log.warn("Instance not found for auto-shutdown", { instanceId });
    return;
  }

  // Only stop if still running
  if (instance.status !== "RUNNING") {
    log.info("Instance not running, skipping auto-shutdown", {
      instanceId,
      status: instance.status,
    });
    return;
  }

  // Final billing
  try {
    await billingService.billRunningInstance(instance);
  } catch (error) {
    log.error(
      "Failed to bill instance before auto-shutdown",
      error instanceof Error ? error : new Error(String(error)),
      { instanceId }
    );
  }

  // Power off via E2E
  try {
    if (instance.e2eNodeId) {
      const { e2eService } = await import("@/lib/services/e2e-networks");
      await e2eService.performAction(instance.e2eNodeId, "power_off");
    }
  } catch (error) {
    log.error(
      "Failed to power off instance via E2E",
      error instanceof Error ? error : new Error(String(error)),
      { instanceId }
    );
  }

  // Update instance
  await prisma.instance.update({
    where: { id: instanceId },
    data: {
      status: "STOPPED",
      stoppedAt: new Date(),
    },
  });

  await notificationService.createInstanceNotification(
    instance.userId,
    instance.name,
    "auto_stopped"
  );

  log.info("Instance auto-shutdown complete", { instanceId });
}

export function startAutoShutdownWorker() {
  const worker = createWorker<AutoShutdownData>(
    QUEUE_NAMES.AUTO_SHUTDOWN,
    async (job) => {
      await processAutoShutdown(job.data);
    }
  );

  log.info("Auto-shutdown worker started");
  return worker;
}

/**
 * Schedule an auto-shutdown for an instance.
 */
export async function scheduleAutoShutdown(
  instanceId: string,
  minutes: number
) {
  const queue = getQueue(QUEUE_NAMES.AUTO_SHUTDOWN);
  if (!queue) {
    log.warn("Cannot schedule auto-shutdown — Redis not available");
    return;
  }

  await queue.add(
    "auto-shutdown",
    { instanceId },
    {
      delay: minutes * 60 * 1000,
      jobId: `auto-shutdown-${instanceId}`,
    }
  );

  log.info("Auto-shutdown scheduled", { instanceId, minutes });
}

/**
 * Cancel a pending auto-shutdown for an instance.
 */
export async function cancelAutoShutdown(instanceId: string) {
  const queue = getQueue(QUEUE_NAMES.AUTO_SHUTDOWN);
  if (!queue) return;

  try {
    const job = await queue.getJob(`auto-shutdown-${instanceId}`);
    if (job) {
      await job.remove();
      log.info("Auto-shutdown cancelled", { instanceId });
    }
  } catch (error) {
    log.error(
      "Failed to cancel auto-shutdown",
      error instanceof Error ? error : new Error(String(error)),
      { instanceId }
    );
  }
}
