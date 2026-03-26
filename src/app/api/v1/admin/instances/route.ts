// src/app/api/v1/admin/instances/route.ts
// Admin: list all instances across all users

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async (req) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const userId = searchParams.get("userId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (userId) where.userId = userId;

  const instances = await prisma.instance.findMany({
    where,
    select: {
      id: true,
      name: true,
      status: true,
      gpuType: true,
      gpuCount: true,
      pricePerHour: true,
      totalBilledAmount: true,
      ipAddress: true,
      createdAt: true,
      startedAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return apiSuccess(
    instances.map((i) => ({
      ...i,
      pricePerHour: Number(i.pricePerHour),
      totalBilledAmount: Number(i.totalBilledAmount),
    }))
  );
});
