// src/app/api/v1/ssh-keys/route.ts
// List and create SSH keys

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { createSSHKeySchema } from "@/lib/validators/ssh-key.schema";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { computeSSHFingerprint } from "@/lib/utils/crypto";
import { ConflictError } from "@/lib/utils/errors";

export const GET = withErrorHandler(async () => {
  const user = await requireAuth();

  const keys = await prisma.sSHKey.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      fingerprint: true,
      publicKey: true,
      isDefault: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(keys);
});

export const POST = withErrorHandler(async (req) => {
  const user = await requireAuth();

  const body = await req.json();
  const data = createSSHKeySchema.parse(body);

  // Check for duplicate name
  const existing = await prisma.sSHKey.findFirst({
    where: { userId: user.id, name: data.name },
  });
  if (existing) {
    throw new ConflictError(`SSH key with name "${data.name}" already exists`);
  }

  const fingerprint = computeSSHFingerprint(data.publicKey);

  // If this is set as default, unset all others
  if (data.isDefault) {
    await prisma.sSHKey.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const key = await prisma.sSHKey.create({
    data: {
      userId: user.id,
      name: data.name,
      publicKey: data.publicKey,
      fingerprint,
      isDefault: data.isDefault,
    },
    select: {
      id: true,
      name: true,
      fingerprint: true,
      publicKey: true,
      isDefault: true,
      createdAt: true,
    },
  });

  return apiSuccess(key, 201);
});
