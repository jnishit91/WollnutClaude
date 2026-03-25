// src/types/instance.types.ts
// Instance-related types for frontend components and API responses

export type InstanceStatus =
  | "PROVISIONING"
  | "RUNNING"
  | "STOPPED"
  | "PAUSED"
  | "FAILED"
  | "DESTROYING"
  | "DESTROYED";

export interface InstanceSummary {
  id: string;
  name: string;
  status: InstanceStatus;
  gpuType: string;
  gpuCount: number;
  vram: string;
  ipAddress: string | null;
  pricePerHour: number;
  totalBilledAmount: number;
  startedAt: string | null;
  createdAt: string;
  region: string;
}

export interface InstanceDetail extends InstanceSummary {
  userId: string;
  e2eNodeId: string | null;
  e2ePlanId: string;
  e2eImageId: string;
  vcpus: number;
  ram: string;
  storageGb: number;
  pricePerMinute: number;
  sshPort: number | null;
  jupyterUrl: string | null;
  jupyterToken: string | null;
  autoShutdownMin: number | null;
  stoppedAt: string | null;
  lastBilledAt: string | null;
  failReason: string | null;
  sshKey: {
    id: string;
    name: string;
    fingerprint: string;
  } | null;
  volumes: {
    id: string;
    name: string;
    sizeGb: number;
    status: string;
  }[];
}

export interface GPUPlan {
  id: string;
  e2ePlanId: string;
  gpuName: string;
  gpuShortName: string;
  vram: string;
  vcpus: number;
  ram: string;
  storage: string;
  infiniband: string | null;
  wollnutPricePerHour: number;
  wollnutPricePerMinute: number;
  available: boolean;
  availableCount: string | null;
  category: string;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string | null;
  tags: string[];
  includedPackages: string[];
  recommendedGpu: string | null;
  minVram: string | null;
  featured: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  slug: string;
  provider: string;
  category: string;
  description: string;
  parameters: string | null;
  contextLength: string | null;
  vramRequired: string;
  recommendedGpu: string;
  templateSlug: string | null;
  huggingFaceId: string | null;
  licenseType: string | null;
  featured: boolean;
}

/** Status colors for UI rendering */
export const INSTANCE_STATUS_CONFIG: Record<
  InstanceStatus,
  { label: string; color: string; dotClass: string; bgClass: string }
> = {
  PROVISIONING: {
    label: "Provisioning",
    color: "amber",
    dotClass: "bg-accent-amber",
    bgClass: "status-provisioning",
  },
  RUNNING: {
    label: "Running",
    color: "green",
    dotClass: "bg-accent-green",
    bgClass: "status-running",
  },
  STOPPED: {
    label: "Stopped",
    color: "gray",
    dotClass: "bg-surface-500",
    bgClass: "status-stopped",
  },
  PAUSED: {
    label: "Paused",
    color: "amber",
    dotClass: "bg-accent-amber",
    bgClass: "status-provisioning",
  },
  FAILED: {
    label: "Failed",
    color: "red",
    dotClass: "bg-accent-red",
    bgClass: "status-failed",
  },
  DESTROYING: {
    label: "Destroying",
    color: "red",
    dotClass: "bg-accent-red",
    bgClass: "status-failed",
  },
  DESTROYED: {
    label: "Destroyed",
    color: "gray",
    dotClass: "bg-surface-600",
    bgClass: "status-stopped",
  },
};
