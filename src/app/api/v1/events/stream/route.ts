// src/app/api/v1/events/stream/route.ts
// Server-Sent Events endpoint for real-time updates

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserInstanceStatuses,
  getNewNotifications,
  getUserBalance,
  encodeSSE,
  encodeHeartbeat,
} from "@/lib/services/event-stream.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POLL_INTERVAL = 5_000; // 5 seconds
const HEARTBEAT_INTERVAL = 30_000; // 30 seconds
const MAX_DURATION = 5 * 60_000; // 5 minutes max per connection

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const encoder = new TextEncoder();
  let cancelled = false;

  const stream = new ReadableStream({
    async start(controller) {
      // Track previous state to detect changes
      let previousStatuses = new Map<string, string>();
      let previousBalance: number | null = null;
      let lastNotificationCheck = new Date();
      let lastHeartbeat = Date.now();
      const startTime = Date.now();

      // Initial state fetch
      try {
        const instances = await getUserInstanceStatuses(userId);
        for (const inst of instances) {
          previousStatuses.set(inst.id, inst.status);
        }
        previousBalance = Number(await getUserBalance(userId));

        // Send initial state
        controller.enqueue(
          encoder.encode(
            encodeSSE({
              type: "instance:status_changed",
              data: {
                instances: instances.map((i) => ({
                  id: i.id,
                  name: i.name,
                  status: i.status,
                  gpuType: i.gpuType,
                })),
                initial: true,
              },
              timestamp: new Date().toISOString(),
            })
          )
        );
      } catch {
        // If initial fetch fails, close gracefully
        controller.close();
        return;
      }

      // Poll for changes
      const poll = async () => {
        if (cancelled || Date.now() - startTime > MAX_DURATION) {
          controller.close();
          return;
        }

        try {
          // Check instance status changes
          const instances = await getUserInstanceStatuses(userId);
          const changedInstances: Array<{
            id: string;
            name: string;
            status: string;
            gpuType: string;
            previousStatus: string | undefined;
          }> = [];

          const currentStatuses = new Map<string, string>();

          for (const inst of instances) {
            currentStatuses.set(inst.id, inst.status);
            const prev = previousStatuses.get(inst.id);

            if (prev !== undefined && prev !== inst.status) {
              changedInstances.push({
                id: inst.id,
                name: inst.name,
                status: inst.status,
                gpuType: inst.gpuType,
                previousStatus: prev,
              });
            } else if (prev === undefined) {
              // New instance
              changedInstances.push({
                id: inst.id,
                name: inst.name,
                status: inst.status,
                gpuType: inst.gpuType,
                previousStatus: undefined,
              });
            }
          }

          // Check for destroyed instances
          for (const id of Array.from(previousStatuses.keys())) {
            if (!currentStatuses.has(id)) {
              controller.enqueue(
                encoder.encode(
                  encodeSSE({
                    type: "instance:destroyed",
                    data: { id },
                    timestamp: new Date().toISOString(),
                  })
                )
              );
            }
          }

          previousStatuses = currentStatuses;

          if (changedInstances.length > 0) {
            controller.enqueue(
              encoder.encode(
                encodeSSE({
                  type: "instance:status_changed",
                  data: { instances: changedInstances },
                  timestamp: new Date().toISOString(),
                })
              )
            );
          }

          // Check balance changes
          const balance = Number(await getUserBalance(userId));
          if (previousBalance !== null && balance !== previousBalance) {
            const type =
              balance > previousBalance
                ? "billing:credits_added"
                : "billing:credits_deducted";

            controller.enqueue(
              encoder.encode(
                encodeSSE({
                  type,
                  data: {
                    balance,
                    previousBalance,
                    change: balance - previousBalance,
                  },
                  timestamp: new Date().toISOString(),
                })
              )
            );

            // Low balance warning
            if (balance < 5 && previousBalance >= 5) {
              controller.enqueue(
                encoder.encode(
                  encodeSSE({
                    type: "billing:low_balance",
                    data: { balance },
                    timestamp: new Date().toISOString(),
                  })
                )
              );
            }
          }
          previousBalance = balance;

          // Check new notifications
          const newNotifications = await getNewNotifications(
            userId,
            lastNotificationCheck
          );
          if (newNotifications.length > 0) {
            controller.enqueue(
              encoder.encode(
                encodeSSE({
                  type: "notification:new",
                  data: {
                    notifications: newNotifications.map((n) => ({
                      id: n.id,
                      type: n.type,
                      title: n.title,
                      message: n.message,
                      actionUrl: n.actionUrl,
                      createdAt: n.createdAt.toISOString(),
                    })),
                  },
                  timestamp: new Date().toISOString(),
                })
              )
            );
          }
          lastNotificationCheck = new Date();

          // Heartbeat
          if (Date.now() - lastHeartbeat > HEARTBEAT_INTERVAL) {
            controller.enqueue(encoder.encode(encodeHeartbeat()));
            lastHeartbeat = Date.now();
          }
        } catch {
          // Swallow polling errors to keep the connection alive
        }

        if (!cancelled) {
          setTimeout(poll, POLL_INTERVAL);
        }
      };

      setTimeout(poll, POLL_INTERVAL);
    },
    cancel() {
      cancelled = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
