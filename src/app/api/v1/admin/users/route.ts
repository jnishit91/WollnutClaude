// src/app/api/v1/admin/users/route.ts
// Admin: list all users with stats

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async (req) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const role = searchParams.get("role");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = parseInt(searchParams.get("perPage") ?? "50", 10);

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        creditsBalance: true,
        createdAt: true,
        _count: { select: { instances: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return apiSuccess(
    users.map((u) => ({
      ...u,
      creditsBalance: Number(u.creditsBalance),
      instanceCount: u._count.instances,
      _count: undefined,
    })),
    200,
    { page, perPage, total, totalPages: Math.ceil(total / perPage) }
  );
});
