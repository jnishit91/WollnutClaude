// src/app/api/v1/api-keys/[id]/route.ts
// Delete API key

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { ResourceNotFoundError } from "@/lib/utils/errors";

export const DELETE = withErrorHandler(async (_req, context) => {
  const user = await requireAuth();
  const params = await context.params;
  const id = params.id as string;

  const key = await prisma.apiKey.findFirst({
    where: { id, userId: user.id },
  });

  if (!key) {
    throw new ResourceNotFoundError("API key", id);
  }

  await prisma.apiKey.delete({ where: { id } });

  return apiSuccess({ deleted: true });
});
