// src/app/api/v1/ssh-keys/[id]/route.ts
// Delete SSH key

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { ResourceNotFoundError } from "@/lib/utils/errors";

export const DELETE = withErrorHandler(async (_req, context) => {
  const user = await requireAuth();
  const params = await context.params;
  const id = params.id as string;

  const key = await prisma.sSHKey.findFirst({
    where: { id, userId: user.id },
  });

  if (!key) {
    throw new ResourceNotFoundError("SSH key", id);
  }

  await prisma.sSHKey.delete({ where: { id } });

  return apiSuccess({ deleted: true });
});
