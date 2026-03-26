// src/lib/jobs/billing-cron.ts
// Per-minute billing engine — bills all running instances

import prisma from "@/lib/prisma";
import { billingService } from "@/lib/services/billing.service";
import { notificationService } from "@/lib/services/notification.service";
import { createLogger } from "@/lib/utils/logger";
import { getQueue, createWorker, QUEUE_NAMES } from "./queue";

const log = createLogger("billing-cron");

interface BillingCronResult {
  instancesBilled: number;
  totalCharged: number;
  autoStopped: number;
  errors: number;
}

async function processBillingCron(): Promise<BillingCronResult> {
  const result: BillingCronResult = {
    instancesBilled: 0,
    totalCharged: 0,
    autoStopped: 0,
    errors: 0,
  };

  // Find all running instances that need billing
  const runningInstances = await prisma.instance.findMany({
    where: {
      status: "RUNNING",
      lastBilledAt: { not: null },
    },
  });

  log.info(`Billing ${runningInstances.length} running instances`);

  for (const instance of runningInstances) {
    try {
      const billing = await billingService.billRunningInstance(instance);

      result.instancesBilled++;
      result.totalCharged += billing.amountCharged;

      if (billing.autoStopped) {
        result.autoStopped++;

        // Update instance status
        await prisma.instance.update({
          where: { id: instance.id },
          data: {
            status: "STOPPED",
            stoppedAt: new Date(),
          },
        });

        // Try to power off via E2E
        try {
          const { e2eService } = await import("@/lib/services/e2e-networks");
          if (instance.e2eNodeId) {
            await e2eService.performAction(instance.e2eNodeId, "power_off");
          }
        } catch (e2eError) {
          log.error("Failed to power off instance via E2E", e2eError instanceof Error ? e2eError : new Error(String(e2eError)), {
            instanceId: instance.id,
          });
        }

        await notificationService.createInstanceNotification(
          instance.userId,
          instance.name,
          "auto_stopped"
        );
      }
    } catch (error) {
      result.errors++;
      log.error(
        "Failed to bill instance",
        error instanceof Error ? error : new Error(String(error)),
        { instanceId: instance.id }
      );
    }
  }

  log.info("Billing cron complete", { ...result });
  return result;
}

export function startBillingCron() {
  const queue = getQueue(QUEUE_NAMES.BILLING);
  if (!queue) return null;

  // Schedule repeatable job every 60 seconds
  queue.add("billing-cron", {}, { repeat: { every: 60_000 } });

  const worker = createWorker(QUEUE_NAMES.BILLING, async () => {
    return processBillingCron();
  });

  log.info("Billing cron worker started (every 60s)");
  return worker;
}
