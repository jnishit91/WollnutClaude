// src/lib/services/event-stream.service.ts
// Server-Sent Events service for real-time updates

import { prisma } from "@/lib/prisma";

export type EventType =
  | "instance:status_changed"
  | "instance:created"
  | "instance:destroyed"
  | "billing:credits_added"
  | "billing:credits_deducted"
  | "billing:low_balance"
  | "notification:new"
  | "system:maintenance"
  | "heartbeat";

export interface StreamEvent {
  type: EventType;
  data: Record<string, unknown>;
  timestamp: string;
}

/**
 * Fetch the latest instance statuses for a user.
 * Used by the SSE endpoint to detect changes.
 */
export async function getUserInstanceStatuses(userId: string) {
  const instances = await prisma.instance.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      status: true,
      gpuType: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return instances;
}

/**
 * Fetch recent notifications for a user since a given timestamp.
 */
export async function getNewNotifications(userId: string, since: Date) {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      createdAt: { gt: since },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return notifications;
}

/**
 * Get the current credit balance for a user.
 */
export async function getUserBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsBalance: true },
  });

  return user?.creditsBalance ?? 0;
}

/**
 * Encode a server-sent event.
 */
export function encodeSSE(event: StreamEvent): string {
  const lines = [
    `event: ${event.type}`,
    `data: ${JSON.stringify(event.data)}`,
    `id: ${Date.now()}`,
    "",
    "",
  ];
  return lines.join("\n");
}

/**
 * Encode a heartbeat event to keep the connection alive.
 */
export function encodeHeartbeat(): string {
  return encodeSSE({
    type: "heartbeat",
    data: { time: new Date().toISOString() },
    timestamp: new Date().toISOString(),
  });
}
