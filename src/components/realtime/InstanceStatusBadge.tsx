"use client";

import { useInstanceStatusStream } from "@/lib/hooks/use-realtime";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  RUNNING: {
    bg: "bg-accent-green/10",
    text: "text-accent-green",
    dot: "bg-accent-green",
    label: "Running",
  },
  STOPPED: {
    bg: "bg-surface-800",
    text: "text-surface-400",
    dot: "bg-surface-500",
    label: "Stopped",
  },
  STARTING: {
    bg: "bg-accent-amber/10",
    text: "text-accent-amber",
    dot: "bg-accent-amber",
    label: "Starting",
  },
  STOPPING: {
    bg: "bg-accent-amber/10",
    text: "text-accent-amber",
    dot: "bg-accent-amber",
    label: "Stopping",
  },
  PROVISIONING: {
    bg: "bg-brand-500/10",
    text: "text-brand-400",
    dot: "bg-brand-400",
    label: "Provisioning",
  },
  ERROR: {
    bg: "bg-accent-red/10",
    text: "text-accent-red",
    dot: "bg-accent-red",
    label: "Error",
  },
  DESTROYED: {
    bg: "bg-surface-800",
    text: "text-surface-500",
    dot: "bg-surface-600",
    label: "Destroyed",
  },
};

const DEFAULT_STYLE = {
  bg: "bg-surface-800",
  text: "text-surface-400",
  dot: "bg-surface-500",
  label: "Unknown",
};

interface InstanceStatusBadgeProps {
  instanceId: string;
  /** Fallback status if SSE hasn't received an update yet */
  fallbackStatus: string;
  /** Enable live streaming (default true) */
  live?: boolean;
}

/**
 * A status badge that updates in real time via SSE.
 * Falls back to the provided status until the first SSE update arrives.
 */
export function InstanceStatusBadge({
  instanceId,
  fallbackStatus,
  live = true,
}: InstanceStatusBadgeProps) {
  const { latestStatuses } = useInstanceStatusStream(
    live ? instanceId : undefined
  );

  const currentStatus =
    latestStatuses.get(instanceId)?.status ?? fallbackStatus;
  const style = STATUS_STYLES[currentStatus] ?? DEFAULT_STYLE;
  const isTransitioning = ["STARTING", "STOPPING", "PROVISIONING"].includes(
    currentStatus
  );

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot} ${
          isTransitioning ? "animate-pulse" : ""
        }`}
      />
      {style.label}
    </span>
  );
}
