// src/app/api/v1/profile/route.ts
// Get and update user profile

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { updateProfileSchema } from "@/lib/validators/auth.schema";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async () => {
  const user = await requireAuth();

  const profile = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      creditsBalance: true,
      autoRecharge: true,
      emailVerified: true,
      onboardedAt: true,
      createdAt: true,
    },
  });

  return apiSuccess({
    ...profile,
    creditsBalance: Number(profile.creditsBalance),
  });
});

export const PATCH = withErrorHandler(async (req) => {
  const user = await requireAuth();

  const body = await req.json();
  const data = updateProfileSchema.parse(body);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      creditsBalance: true,
    },
  });

  return apiSuccess({
    ...updated,
    creditsBalance: Number(updated.creditsBalance),
  });
});
