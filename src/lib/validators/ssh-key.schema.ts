// src/lib/validators/ssh-key.schema.ts
// Zod schemas for SSH key management

import { z } from "zod";

const SSH_KEY_PATTERN =
  /^(ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521)\s+[A-Za-z0-9+/=]+(\s+.*)?$/;

export const createSSHKeySchema = z.object({
  name: z
    .string()
    .min(1, "Key name is required")
    .max(100, "Key name must be at most 100 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Key name can only contain letters, numbers, hyphens, and underscores"
    )
    .trim(),
  publicKey: z
    .string()
    .min(20, "Invalid SSH public key")
    .max(16384, "SSH key is too long")
    .trim()
    .refine(
      (key) => SSH_KEY_PATTERN.test((key.split("\n")[0] ?? "").trim()),
      "Invalid SSH public key format. Must start with ssh-rsa, ssh-ed25519, or ecdsa-sha2-*"
    ),
  isDefault: z.boolean().default(false),
});

export type CreateSSHKeyInput = z.infer<typeof createSSHKeySchema>;
