"use client";

import { INSTANCE_STATUS_CONFIG, type InstanceStatus } from "@/types/instance.types";

export function StatusBadge({ status }: { status: InstanceStatus }) {
  const config = INSTANCE_STATUS_CONFIG[status];
  if (!config) return <span className="text-xs text-surface-500">{status}</span>;

  return (
    <span className={config.bgClass}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
