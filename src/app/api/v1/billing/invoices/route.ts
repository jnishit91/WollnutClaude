// src/app/api/v1/billing/invoices/route.ts
// List monthly invoices for the authenticated user

import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { apiSuccess, withErrorHandler } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async () => {
  const user = await requireAuth();

  // Aggregate usage logs by month to generate invoice summaries
  const usageLogs = await prisma.usageLog.findMany({
    where: { userId: user.id },
    select: {
      startTime: true,
      amountCharged: true,
      durationMin: true,
    },
    orderBy: { startTime: "desc" },
  });

  // Group by month
  const monthMap = new Map<
    string,
    { totalAmount: number; totalHours: number; instanceCount: Set<string> }
  >();

  // Also get instance counts per month
  const allLogs = await prisma.usageLog.findMany({
    where: { userId: user.id },
    select: {
      startTime: true,
      amountCharged: true,
      durationMin: true,
      instanceId: true,
    },
    orderBy: { startTime: "desc" },
  });

  for (const log of allLogs) {
    const month = `${log.startTime.getFullYear()}-${String(log.startTime.getMonth() + 1).padStart(2, "0")}`;
    const existing = monthMap.get(month) ?? {
      totalAmount: 0,
      totalHours: 0,
      instanceCount: new Set<string>(),
    };
    existing.totalAmount += Number(log.amountCharged ?? 0);
    existing.totalHours += (log.durationMin ?? 0) / 60;
    existing.instanceCount.add(log.instanceId);
    monthMap.set(month, existing);
  }

  const invoices = Array.from(monthMap.entries()).map(([month, data]) => ({
    month,
    totalAmount: Math.round(data.totalAmount * 100) / 100,
    totalHours: Math.round(data.totalHours * 100) / 100,
    instanceCount: data.instanceCount.size,
    pdfUrl: null, // Placeholder — invoice PDF generation is Part 9
  }));

  return apiSuccess(invoices);
});
