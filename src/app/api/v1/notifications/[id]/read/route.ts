// src/app/api/v1/notifications/[id]/read/route.ts
// Mark a notification as read

import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/utils/api-response";

export const POST = withErrorHandler(async (_req, context) => {
  const user = await requireAuth();
  const { id } = await context.params;

  const notification = await prisma.notification.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!notification) {
    return apiError("Notification not found", 404, "NOT_FOUND");
  }

  if (notification.userId !== user.id) {
    return apiError("Not authorized", 403, "FORBIDDEN");
  }

  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  return apiSuccess({ success: true });
});
