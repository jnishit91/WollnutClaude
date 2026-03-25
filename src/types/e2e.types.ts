// src/types/e2e.types.ts
// Complete TypeScript interfaces for E2E Networks API

// ─────────────────────────────────────────────
// API RESPONSE WRAPPER
// ─────────────────────────────────────────────

export interface E2EApiResponse<T> {
  code: number;
  data: T;
  message: string;
  errors: Record<string, string[]> | null;
}

// ─────────────────────────────────────────────
// NODES (GPU INSTANCES)
// ─────────────────────────────────────────────

export interface E2ENode {
  id: number;
  name: string;
  label: string;
  created_at: string;
  status: E2ENodeStatus;
  public_ip_address: string | null;
  private_ip_address: string | null;
  vcpus: number;
  memory: number; // in MB
  disk: number; // in GB
  region: E2ERegion;
  plan: string;
  image: E2ENodeImage;
  backup_enabled: boolean;
  is_bitninja_license_active: boolean;
  zfs_enabled: boolean;
  is_saved: boolean;
  gpu_card: string | null;
  gpu_card_count: number;
  price: number;
}

export type E2ENodeStatus =
  | "Creating"
  | "Running"
  | "Stopped"
  | "Starting"
  | "Stopping"
  | "Rebooting"
  | "Pending"
  | "Deleting"
  | "Deleted"
  | "Error";

export interface E2ENodeImage {
  id: number;
  name: string;
  distribution: string;
  version: string;
}

export interface E2ERegion {
  id: number;
  name: string;
  slug: string;
  available: boolean;
}

export interface CreateNodeParams {
  name: string;
  plan: string; // E2E plan slug
  image: number; // E2E image ID
  region: string; // region slug, e.g. "Delhi"
  ssh_keys: number[]; // E2E SSH key IDs
  backups: boolean;
  saved_image?: number;
  vpc_id?: string;
  security_group_id?: string;
  enable_bitninja?: boolean;
  reserve_ip?: string;
  disable_password?: boolean;
  is_ipv6_availed?: boolean;
  default_gateway?: string;
  label?: string;
}

export interface NodeActionParams {
  type: "power_on" | "power_off" | "reboot" | "rebuild" | "resize" | "rename";
  image?: number;
  plan?: string;
  name?: string;
}

// ─────────────────────────────────────────────
// GPU PLANS
// ─────────────────────────────────────────────

export interface E2EPlan {
  id: number;
  name: string;
  slug: string;
  vcpus: number;
  memory: number; // MB
  disk: number; // GB
  bandwidth: number;
  price_per_hour: number;
  price_per_month: number;
  gpu: string | null; // "NVIDIA H100"
  gpu_count: number;
  gpu_memory: string | null; // "80GB"
  available: boolean;
  regions: string[];
  category: string;
  infiniband: string | null;
}

// ─────────────────────────────────────────────
// IMAGES / TEMPLATES
// ─────────────────────────────────────────────

export interface E2EImage {
  id: number;
  name: string;
  distribution: string;
  version: string;
  description: string;
  public: boolean;
  slug: string;
  minimum_disk_size: number;
  type: string; // "base", "gpu", "ml"
  regions: string[];
  created_at: string;
}

// ─────────────────────────────────────────────
// SSH KEYS
// ─────────────────────────────────────────────

export interface E2ESSHKey {
  id: number;
  name: string;
  public_key: string;
  fingerprint: string;
  created_at: string;
}

export interface CreateSSHKeyParams {
  name: string;
  public_key: string;
}

// ─────────────────────────────────────────────
// VOLUMES (EBS)
// ─────────────────────────────────────────────

export interface E2EVolume {
  id: number;
  name: string;
  size_gb: number;
  status: string; // "available", "in-use", "creating", "deleting"
  created_at: string;
  attached_to_node_id: number | null;
  region: string;
  iops: number | null;
}

export interface CreateVolumeParams {
  name: string;
  size: number; // GB
  region: string;
  iops?: number;
}

export interface AttachVolumeParams {
  node_id: number;
}

// ─────────────────────────────────────────────
// BILLING / ACCOUNT
// ─────────────────────────────────────────────

export interface E2EBalance {
  balance: number;
  currency: string;
}

export interface E2EBilling {
  total_due: number;
  current_month_usage: number;
  billing_period: string;
  currency: string;
  line_items: E2EBillingLineItem[];
}

export interface E2EBillingLineItem {
  resource_type: string;
  resource_name: string;
  hours_used: number;
  cost: number;
}

// ─────────────────────────────────────────────
// NORMALIZED TYPES (what Wollnut uses internally)
// ─────────────────────────────────────────────

/** Normalized node status for Wollnut's internal representation */
export type WollnutNodeStatus =
  | "provisioning"
  | "running"
  | "stopped"
  | "starting"
  | "stopping"
  | "rebooting"
  | "failed"
  | "destroying"
  | "destroyed";

/** Maps E2E status strings to Wollnut's internal status */
export const E2E_STATUS_MAP: Record<E2ENodeStatus, WollnutNodeStatus> = {
  Creating: "provisioning",
  Running: "running",
  Stopped: "stopped",
  Starting: "starting",
  Stopping: "stopping",
  Rebooting: "rebooting",
  Pending: "provisioning",
  Deleting: "destroying",
  Deleted: "destroyed",
  Error: "failed",
};

/** Maps Wollnut status to the Prisma InstanceStatus enum */
export const WOLLNUT_TO_PRISMA_STATUS: Record<WollnutNodeStatus, string> = {
  provisioning: "PROVISIONING",
  running: "RUNNING",
  stopped: "STOPPED",
  starting: "PROVISIONING",
  stopping: "STOPPED",
  rebooting: "RUNNING",
  failed: "FAILED",
  destroying: "DESTROYING",
  destroyed: "DESTROYED",
};
