// src/lib/services/notification.service.ts
// Simple notification creator

import prisma from "@/lib/prisma";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("notifications");

class NotificationService {
  /**
   * Create a notification for a user.
   */
  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    actionUrl?: string
  ) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionUrl: actionUrl ?? null,
      },
    });

    log.info("Notification created", { userId, type, title });
    return notification;
  }

  /**
   * Create a low credits warning (with spam protection — max once per hour).
   */
  async createLowCreditsNotification(userId: string, balance: number) {
    const oneHourAgo = new Date(Date.now() - 3600_000);

    const recent = await prisma.notification.findFirst({
      where: {
        userId,
        type: "low_credits",
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recent) return null;

    return this.createNotification(
      userId,
      "low_credits",
      "Low Credits Warning",
      `Your balance is $${balance.toFixed(2)}. Add credits to avoid instance auto-stop.`,
      "/dashboard/billing"
    );
  }

  /**
   * Create an instance status change notification.
   */
  async createInstanceNotification(
    userId: string,
    instanceName: string,
    event:
      | "provisioning"
      | "running"
      | "stopped"
      | "failed"
      | "destroyed"
      | "auto_stopped"
  ) {
    const messages: Record<string, { title: string; message: string }> = {
      provisioning: {
        title: "Instance Provisioning",
        message: `Your instance "${instanceName}" is being provisioned.`,
      },
      running: {
        title: "Instance Running",
        message: `Your instance "${instanceName}" is now running and ready to use.`,
      },
      stopped: {
        title: "Instance Stopped",
        message: `Your instance "${instanceName}" has been stopped.`,
      },
      failed: {
        title: "Instance Failed",
        message: `Your instance "${instanceName}" has failed. Please check the details.`,
      },
      destroyed: {
        title: "Instance Destroyed",
        message: `Your instance "${instanceName}" has been destroyed.`,
      },
      auto_stopped: {
        title: "Instance Auto-Stopped",
        message: `Your instance "${instanceName}" was automatically stopped due to insufficient credits.`,
      },
    };

    const { title, message } = messages[event]!;

    return this.createNotification(
      userId,
      `instance_${event}`,
      title,
      message,
      "/dashboard/instances"
    );
  }
}

export const notificationService = new NotificationService();
