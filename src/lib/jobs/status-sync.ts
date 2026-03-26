// src/lib/jobs/status-sync.ts
// Polls E2E for instance status changes every 30 seconds

import prisma from "@/lib/prisma";
import { notificationService } from "@/lib/services/notification.service";
import { createLogger } from "@/lib/utils/logger";
import { getQueue, createWorker, QUEUE_NAMES } from "./queue";

const log = createLogger("status-sync");

// Map E2E statuses to Wollnut statuses
const E2E_STATUS_MAP: Record<string, string> = {
  Running: "RUNNING",
  Stopped: "STOPPED",
  "Shutoff": "STOPPED",
  Creating: "PROVISIONING",
  Deleting: "DESTROYING",
  Error: "FAILED",
};

async function processStatusSync() {
  const instances = await prisma.instance.findMany({
    where: {
      status: { in: ["PROVISIONING", "RUNNING", "DESTROYING"] },
      e2eNodeId: { not: null },
    },
  });

  log.info(`Syncing status for ${instances.length} instances`);

  for (const instance of instances) {
    try {
      const { e2eService } = await import("@/lib/services/e2e-networks");
      const node = await e2eService.getNode(instance.e2eNodeId!);

      const e2eStatus = (node as { status?: string })?.status ?? "";
      const mappedStatus = E2E_STATUS_MAP[e2eStatus] ?? instance.status;

      if (mappedStatus !== instance.status) {
        const now = new Date();
        const updateData: Record<string, unknown> = { status: mappedStatus };

        // Extract IP and connection info when newly running
        if (mappedStatus === "RUNNING" && instance.status !== "RUNNING") {
          updateData.startedAt = now;
          updateData.lastBilledAt = now;

          const nodeData = node as {
            public_ip_address?: { address?: string };
            private_ip_address?: { address?: string };
          };
          const ip =
            nodeData.public_ip_address?.address ??
            nodeData.private_ip_address?.address;
          if (ip) updateData.ipAddress = ip;
        }

        // Mark stop time when transitioning to stopped/failed
        if (
          (mappedStatus === "STOPPED" || mappedStatus === "FAILED") &&
          instance.status === "RUNNING"
        ) {
          updateData.stoppedAt = now;
        }

        await prisma.instance.update({
          where: { id: instance.id },
          data: updateData,
        });

        // Send notification for status change
        const eventMap: Record<string, string> = {
          PROVISIONING: "provisioning",
          RUNNING: "running",
          STOPPED: "stopped",
          FAILED: "failed",
          DESTROYING: "destroyed",
        };

        const event = eventMap[mappedStatus];
        if (event) {
          await notificationService.createInstanceNotification(
            instance.userId,
            instance.name,
            event as "provisioning" | "running" | "stopped" | "failed" | "destroyed"
          );
        }

        log.info("Instance status updated", {
          instanceId: instance.id,
          from: instance.status,
          to: mappedStatus,
        });
      }
    } catch (error) {
      log.error(
        "Failed to sync instance status",
        error instanceof Error ? error : new Error(String(error)),
        { instanceId: instance.id }
      );
    }
  }
}

export function startStatusSync() {
  const queue = getQueue(QUEUE_NAMES.STATUS_SYNC);
  if (!queue) return null;

  queue.add("status-sync", {}, { repeat: { every: 30_000 } });

  const worker = createWorker(QUEUE_NAMES.STATUS_SYNC, async () => {
    return processStatusSync();
  });

  log.info("Status sync worker started (every 30s)");
  return worker;
}
