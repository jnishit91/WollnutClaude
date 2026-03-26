"use client";

// src/lib/hooks/use-realtime.ts
// Real-time event hooks using Server-Sent Events with auto-reconnect

import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

interface RealtimeOptions {
  /** Enable/disable the connection */
  enabled?: boolean;
  /** Show toast notifications for instance changes */
  showToasts?: boolean;
}

interface InstanceUpdate {
  id: string;
  name?: string;
  status: string;
  previousStatus: string | null;
  gpuType?: string;
}

/**
 * Hook for the main event stream — covers instances, billing, and notifications.
 * Automatically invalidates React Query caches when changes are detected.
 */
export function useRealtimeEvents(options: RealtimeOptions = {}) {
  const { enabled = true, showToasts = true } = options;
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttemptsRef = useRef(0);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionState("connecting");

    const es = new EventSource("/api/v1/events/stream");
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnectionState("connected");
      reconnectAttemptsRef.current = 0;
    };

    es.onerror = () => {
      setConnectionState("error");
      es.close();
      eventSourceRef.current = null;

      // Exponential backoff reconnect
      const delay = Math.min(
        1000 * 2 ** reconnectAttemptsRef.current,
        30_000
      );
      reconnectAttemptsRef.current++;

      reconnectTimeoutRef.current = setTimeout(() => {
        if (enabled) connect();
      }, delay);
    };

    // Instance status changes
    es.addEventListener("instance:status_changed", (event) => {
      try {
        const payload = JSON.parse(event.data);
        queryClient.invalidateQueries({ queryKey: ["instances"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

        if (!payload.initial && showToasts && payload.instances) {
          for (const inst of payload.instances as InstanceUpdate[]) {
            if (inst.previousStatus && inst.status !== inst.previousStatus) {
              const statusLabel = inst.status
                .toLowerCase()
                .replace("_", " ");
              toast.info(
                `${inst.name ?? "Instance"}: ${statusLabel}`,
                { duration: 4000 }
              );
            }
          }
        }
      } catch {
        // Ignore parse errors
      }
    });

    // Instance destroyed
    es.addEventListener("instance:destroyed", (event) => {
      try {
        const payload = JSON.parse(event.data);
        queryClient.invalidateQueries({ queryKey: ["instances"] });
        queryClient.invalidateQueries({
          queryKey: ["instances", payload.id],
        });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      } catch {
        // Ignore
      }
    });

    // Billing events
    es.addEventListener("billing:credits_added", (event) => {
      try {
        const payload = JSON.parse(event.data);
        queryClient.invalidateQueries({ queryKey: ["billing-balance"] });
        queryClient.invalidateQueries({ queryKey: ["billing-transactions"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

        if (showToasts) {
          toast.success(
            `Credits added: +$${Number(payload.change).toFixed(2)}`
          );
        }
      } catch {
        // Ignore
      }
    });

    es.addEventListener("billing:credits_deducted", () => {
      queryClient.invalidateQueries({ queryKey: ["billing-balance"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    });

    es.addEventListener("billing:low_balance", (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (showToasts) {
          toast.warning(
            `Low balance: $${Number(payload.balance).toFixed(2)} remaining`,
            { duration: 8000 }
          );
        }
      } catch {
        // Ignore
      }
    });

    // Notification events
    es.addEventListener("notification:new", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    // Heartbeat — just keep alive
    es.addEventListener("heartbeat", () => {
      setConnectionState("connected");
    });
  }, [enabled, showToasts, queryClient]);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [enabled, connect]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setConnectionState("disconnected");
  }, []);

  return { connectionState, disconnect };
}

/**
 * Hook for instance-specific status streaming.
 * Lighter-weight, polls every 3 seconds for instance status only.
 */
export function useInstanceStatusStream(instanceId?: string) {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [latestStatuses, setLatestStatuses] = useState<
    Map<string, { status: string; updatedAt: string }>
  >(new Map());
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const queryClient = useQueryClient();

  useEffect(() => {
    const url = instanceId
      ? `/api/v1/instances/status-stream?instanceId=${instanceId}`
      : "/api/v1/instances/status-stream";

    setConnectionState("connecting");

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => setConnectionState("connected");

    es.onerror = () => {
      setConnectionState("error");
      es.close();
      eventSourceRef.current = null;

      reconnectTimeoutRef.current = setTimeout(() => {
        // Will re-run effect on next render
        setConnectionState("disconnected");
      }, 5000);
    };

    es.addEventListener("status", (event) => {
      try {
        const payload = JSON.parse(event.data);
        const newStatuses = new Map(latestStatuses);

        for (const inst of payload.instances as Array<{
          id: string;
          status: string;
          updatedAt: string;
          previousStatus: string | null;
        }>) {
          newStatuses.set(inst.id, {
            status: inst.status,
            updatedAt: inst.updatedAt,
          });

          // If status actually changed (not initial), invalidate queries
          if (inst.previousStatus !== null) {
            queryClient.invalidateQueries({
              queryKey: ["instances", inst.id],
            });
            queryClient.invalidateQueries({ queryKey: ["instances"] });
          }
        }

        setLatestStatuses(newStatuses);
      } catch {
        // Ignore
      }
    });

    es.addEventListener("close", () => {
      es.close();
      eventSourceRef.current = null;
      setConnectionState("disconnected");
    });

    return () => {
      es.close();
      eventSourceRef.current = null;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceId, queryClient]);

  return { connectionState, latestStatuses };
}
