// src/app/api/v1/instances/status-stream/route.ts
// Lightweight SSE endpoint for instance status polling only

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POLL_INTERVAL = 3_000; // 3 seconds for faster instance updates
const MAX_DURATION = 3 * 60_000; // 3 minutes max

const INSTANCE_SELECT = {
  id: true,
  name: true,
  status: true,
  gpuType: true,
  gpuCount: true,
  e2eRegion: true,
  ipAddress: true,
  pricePerHour: true,
  updatedAt: true,
} as const;

function mapInstance(
  inst: {
    id: string;
    name: string;
    status: string;
    gpuType: string;
    gpuCount: number;
    e2eRegion: string;
    ipAddress: string | null;
    pricePerHour: unknown;
    updatedAt: Date;
  },
  previousStatus: string | null
) {
  return {
    id: inst.id,
    name: inst.name,
    status: inst.status,
    previousStatus,
    gpuType: inst.gpuType,
    gpuCount: inst.gpuCount,
    region: inst.e2eRegion,
    ipAddress: inst.ipAddress,
    costPerHour: Number(inst.pricePerHour),
    updatedAt: inst.updatedAt.toISOString(),
  };
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const url = new URL(req.url);
  const instanceId = url.searchParams.get("instanceId");

  const encoder = new TextEncoder();
  let cancelled = false;

  const stream = new ReadableStream({
    async start(controller) {
      const startTime = Date.now();
      const previousStatuses = new Map<string, string>();

      const sendEvent = (type: string, data: unknown) => {
        const lines = [
          `event: ${type}`,
          `data: ${JSON.stringify(data)}`,
          `id: ${Date.now()}`,
          "",
          "",
        ];
        controller.enqueue(encoder.encode(lines.join("\n")));
      };

      const buildWhere = () => {
        const where: Record<string, unknown> = { userId };
        if (instanceId) where.id = instanceId;
        return where;
      };

      const poll = async () => {
        if (cancelled || Date.now() - startTime > MAX_DURATION) {
          sendEvent("close", { reason: "timeout" });
          controller.close();
          return;
        }

        try {
          const instances = await prisma.instance.findMany({
            where: buildWhere(),
            select: INSTANCE_SELECT,
            orderBy: { updatedAt: "desc" },
          });

          const updates: Array<Record<string, unknown>> = [];
          const currentIds = new Set<string>();

          for (const inst of instances) {
            currentIds.add(inst.id);
            const prev = previousStatuses.get(inst.id);
            if (prev !== inst.status) {
              updates.push(mapInstance(inst, prev ?? null));
            }
            previousStatuses.set(inst.id, inst.status);
          }

          // Detect removed instances
          for (const id of Array.from(previousStatuses.keys())) {
            if (!currentIds.has(id)) {
              updates.push({
                id,
                status: "DESTROYED",
                previousStatus: previousStatuses.get(id) ?? null,
              });
              previousStatuses.delete(id);
            }
          }

          if (updates.length > 0) {
            sendEvent("status", { instances: updates });
          }
        } catch {
          // Continue polling on error
        }

        if (!cancelled) {
          setTimeout(poll, POLL_INTERVAL);
        }
      };

      // Initial fetch — send all statuses immediately
      try {
        const instances = await prisma.instance.findMany({
          where: buildWhere(),
          select: INSTANCE_SELECT,
          orderBy: { updatedAt: "desc" },
        });

        for (const inst of instances) {
          previousStatuses.set(inst.id, inst.status);
        }

        sendEvent("status", {
          instances: instances.map((i) => mapInstance(i, null)),
          initial: true,
        });
      } catch {
        controller.close();
        return;
      }

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
