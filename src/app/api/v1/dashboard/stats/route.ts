// src/app/api/v1/dashboard/stats/route.ts
// Dashboard overview stats

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async () => {
  const user = await requireAuth();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    activeInstances,
    dbUser,
    monthTransactions,
    usageLogs,
    recentTransactions,
  ] = await Promise.all([
    // Active instance count
    prisma.instance.count({
      where: {
        userId: user.id,
        status: { in: ["RUNNING", "PROVISIONING"] },
      },
    }),

    // Credits balance
    prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { creditsBalance: true },
    }),

    // This month's spend
    prisma.transaction.aggregate({
      where: {
        userId: user.id,
        type: "USAGE_DEDUCTION",
        createdAt: { gte: monthStart },
      },
      _sum: { amount: true },
    }),

    // Total GPU hours from usage logs
    prisma.usageLog.aggregate({
      where: { userId: user.id },
      _sum: { durationMin: true },
    }),

    // Recent transactions (last 5)
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        createdAt: true,
      },
    }),
  ]);

  // Daily usage for last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dailyUsageLogs = await prisma.usageLog.findMany({
    where: {
      userId: user.id,
      startTime: { gte: thirtyDaysAgo },
    },
    select: {
      startTime: true,
      durationMin: true,
      amountCharged: true,
    },
  });

  // Aggregate by day
  const dailyMap = new Map<string, { hours: number; cost: number }>();
  for (let d = 0; d < 30; d++) {
    const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const key = date.toISOString().split("T")[0];
    dailyMap.set(key!, { hours: 0, cost: 0 });
  }

  for (const log of dailyUsageLogs) {
    const key = log.startTime.toISOString().split("T")[0]!;
    const existing = dailyMap.get(key);
    if (existing) {
      existing.hours += (log.durationMin ?? 0) / 60;
      existing.cost += Number(log.amountCharged ?? 0);
    }
  }

  const dailyUsage = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      hours: Math.round(data.hours * 100) / 100,
      cost: Math.round(data.cost * 100) / 100,
    }))
    .reverse();

  return apiSuccess({
    activeInstances,
    creditsBalance: Number(dbUser.creditsBalance),
    monthSpend: Math.abs(Number(monthTransactions._sum.amount ?? 0)),
    totalGpuHours:
      Math.round(((usageLogs._sum.durationMin ?? 0) / 60) * 100) / 100,
    recentTransactions: recentTransactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })),
    dailyUsage,
  });
});
