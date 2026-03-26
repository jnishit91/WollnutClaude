// src/app/api/v1/notifications/route.ts
// List user notifications

import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { apiSuccess, withErrorHandler } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async (req) => {
  const user = await requireAuth();

  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unreadOnly") === "true";

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      ...(unreadOnly ? { read: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      actionUrl: true,
      read: true,
      createdAt: true,
    },
  });

  return apiSuccess(notifications);
});
