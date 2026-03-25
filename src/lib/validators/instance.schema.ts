// src/lib/validators/instance.schema.ts
// Zod schemas for instance creation and management

import { z } from "zod";

export const createInstanceSchema = z.object({
  name: z
    .string()
    .min(3, "Instance name must be at least 3 characters")
    .max(63, "Instance name must be at most 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Name must start/end with alphanumeric and contain only lowercase letters, numbers, and hyphens"
    ),
  planId: z.string().min(1, "GPU plan is required"),
  templateSlug: z.string().min(1, "Template is required"),
  sshKeyId: z.string().optional(),
  storageGb: z
    .number()
    .int()
    .min(50, "Minimum storage is 50GB")
    .max(2000, "Maximum storage is 2TB")
    .default(100),
  autoShutdownMin: z
    .number()
    .int()
    .min(30, "Minimum auto-shutdown is 30 minutes")
    .max(10080, "Maximum auto-shutdown is 7 days (10080 minutes)")
    .optional()
    .nullable(),
  region: z.string().default("Delhi"),
  gpuCount: z
    .number()
    .int()
    .min(1)
    .max(8)
    .default(1),
});

export type CreateInstanceInput = z.infer<typeof createInstanceSchema>;

export const instanceActionSchema = z.object({
  action: z.enum(["start", "stop", "reboot"]),
});

export type InstanceActionInput = z.infer<typeof instanceActionSchema>;
