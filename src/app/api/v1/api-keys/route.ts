// src/app/api/v1/api-keys/route.ts
// List and create API keys

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { generateApiKey } from "@/lib/utils/crypto";
import { z } from "zod";

const createApiKeySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  scopes: z
    .array(z.enum(["instances", "billing", "ssh-keys", "all"]))
    .min(1, "At least one scope is required")
    .default(["all"]),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const GET = withErrorHandler(async () => {
  const user = await requireAuth();

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      scopes: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(keys);
});

export const POST = withErrorHandler(async (req) => {
  const user = await requireAuth();

  const body = await req.json();
  const data = createApiKeySchema.parse(body);

  const { plaintextKey, keyHash, keyPrefix } = generateApiKey();

  const apiKey = await prisma.apiKey.create({
    data: {
      userId: user.id,
      name: data.name,
      keyHash,
      keyPrefix,
      scopes: data.scopes,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      scopes: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  // Return plaintext key only once
  return apiSuccess(
    {
      ...apiKey,
      plaintextKey,
    },
    201
  );
});
