// src/app/api/v1/admin/revenue/route.ts
// Admin: platform-wide revenue and stats

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async () => {
  await requireAdmin();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalUsers,
    totalInstances,
    runningInstances,
    totalRevenue,
    monthRevenue,
    lastMonthRevenue,
    totalGpuMinutes,
    recentSignups,
    topUsers,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.instance.count(),

    prisma.instance.count({
      where: { status: { in: ["RUNNING", "PROVISIONING"] } },
    }),

    prisma.transaction.aggregate({
      where: { type: "CREDIT_PURCHASE" },
      _sum: { amount: true },
    }),

    prisma.transaction.aggregate({
      where: { type: "CREDIT_PURCHASE", createdAt: { gte: monthStart } },
      _sum: { amount: true },
    }),

    prisma.transaction.aggregate({
      where: {
        type: "CREDIT_PURCHASE",
        createdAt: { gte: lastMonthStart, lt: monthStart },
      },
      _sum: { amount: true },
    }),

    prisma.usageLog.aggregate({
      _sum: { durationMin: true },
    }),

    prisma.user.count({
      where: { createdAt: { gte: monthStart } },
    }),

    prisma.user.findMany({
      orderBy: { creditsBalance: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        creditsBalance: true,
        _count: { select: { instances: true } },
      },
    }),
  ]);

  // Daily revenue for last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dailyTransactions = await prisma.transaction.findMany({
    where: {
      type: "CREDIT_PURCHASE",
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { amount: true, createdAt: true },
  });

  const dailyMap = new Map<string, number>();
  for (let d = 0; d < 30; d++) {
    const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    dailyMap.set(date.toISOString().split("T")[0]!, 0);
  }
  for (const tx of dailyTransactions) {
    const key = tx.createdAt.toISOString().split("T")[0]!;
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + Number(tx.amount));
  }

  const dailyRevenue = Array.from(dailyMap.entries())
    .map(([date, amount]) => ({ date, amount: Math.round(amount * 100) / 100 }))
    .reverse();

  return apiSuccess({
    totalUsers,
    totalInstances,
    runningInstances,
    totalRevenue: Number(totalRevenue._sum.amount ?? 0),
    monthRevenue: Number(monthRevenue._sum.amount ?? 0),
    lastMonthRevenue: Number(lastMonthRevenue._sum.amount ?? 0),
    totalGpuHours: Math.round(((totalGpuMinutes._sum.durationMin ?? 0) / 60) * 100) / 100,
    recentSignups,
    dailyRevenue,
    topUsers: topUsers.map((u) => ({
      ...u,
      creditsBalance: Number(u.creditsBalance),
      instanceCount: u._count.instances,
      _count: undefined,
    })),
  });
});
