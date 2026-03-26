// src/lib/services/billing.service.ts
// Core billing engine — all credit operations go through here

import prisma from "@/lib/prisma";
import { InsufficientCreditsError } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";
import type { Instance } from "@prisma/client";

const log = createLogger("billing");

const LOW_CREDITS_THRESHOLD = 2; // $2

class BillingService {
  /**
   * Add credits to a user's balance atomically.
   */
  async addCredits(
    userId: string,
    amount: number,
    stripePaymentId?: string,
    stripeSessionId?: string,
    type: "CREDIT_PURCHASE" | "BONUS" | "PROMO" | "REFUND" = "CREDIT_PURCHASE"
  ): Promise<number> {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { creditsBalance: { increment: amount } },
        select: { creditsBalance: true },
      });

      const newBalance = Number(user.creditsBalance);

      await tx.transaction.create({
        data: {
          userId,
          type,
          amount,
          balance: newBalance,
          description:
            type === "CREDIT_PURCHASE"
              ? `Credits purchased: $${amount.toFixed(2)}`
              : `${type}: $${amount.toFixed(2)}`,
          stripePaymentId: stripePaymentId ?? null,
          stripeSessionId: stripeSessionId ?? null,
        },
      });

      return newBalance;
    });

    log.info("Credits added", { userId, amount, type, newBalance: result });
    return result;
  }

  /**
   * Deduct credits atomically. Throws if insufficient balance.
   */
  async deductCredits(
    userId: string,
    amount: number,
    instanceId: string,
    description: string
  ): Promise<number> {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { creditsBalance: true },
      });

      const balance = Number(user.creditsBalance);

      if (balance < amount) {
        throw new InsufficientCreditsError(amount, balance);
      }

      const updated = await tx.user.update({
        where: { id: userId },
        data: { creditsBalance: { decrement: amount } },
        select: { creditsBalance: true },
      });

      const newBalance = Number(updated.creditsBalance);

      await tx.transaction.create({
        data: {
          userId,
          type: "USAGE_DEDUCTION",
          amount: -amount,
          balance: newBalance,
          description,
          instanceId,
        },
      });

      return newBalance;
    });

    return result;
  }

  /**
   * Calculate cost for a time range.
   */
  calculateInstanceCost(
    pricePerMinute: number,
    fromTime: Date,
    toTime: Date
  ): { minutes: number; cost: number } {
    const minutes = Math.ceil(
      (toTime.getTime() - fromTime.getTime()) / 60_000
    );
    return { minutes: Math.max(minutes, 0), cost: minutes * pricePerMinute };
  }

  /**
   * Bill a running instance for time since last billing.
   * Returns billing result including whether auto-stop was triggered.
   */
  async billRunningInstance(instance: Instance): Promise<{
    amountCharged: number;
    remainingBalance: number;
    autoStopped: boolean;
  }> {
    const now = new Date();
    const billFrom = instance.lastBilledAt ?? instance.startedAt ?? now;
    const pricePerMinute = Number(instance.pricePerMinute);

    const { minutes, cost } = this.calculateInstanceCost(
      pricePerMinute,
      billFrom,
      now
    );

    if (minutes <= 0 || cost <= 0) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: instance.userId },
        select: { creditsBalance: true },
      });
      return {
        amountCharged: 0,
        remainingBalance: Number(user.creditsBalance),
        autoStopped: false,
      };
    }

    // Deduct and create records in a single transaction
    let newBalance: number;
    let autoStopped = false;

    try {
      newBalance = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
          where: { id: instance.userId },
          select: { creditsBalance: true },
        });

        const balance = Number(user.creditsBalance);

        // Deduct what we can, even if partial
        const chargeAmount = Math.min(cost, balance);

        const updated = await tx.user.update({
          where: { id: instance.userId },
          data: { creditsBalance: { decrement: chargeAmount } },
          select: { creditsBalance: true },
        });

        const updatedBalance = Number(updated.creditsBalance);

        await tx.transaction.create({
          data: {
            userId: instance.userId,
            type: "USAGE_DEDUCTION",
            amount: -chargeAmount,
            balance: updatedBalance,
            description: `Usage: ${instance.name} (${minutes} min)`,
            instanceId: instance.id,
          },
        });

        await tx.usageLog.create({
          data: {
            instanceId: instance.id,
            userId: instance.userId,
            startTime: billFrom,
            endTime: now,
            durationMin: minutes,
            amountCharged: chargeAmount,
            gpuType: instance.gpuType,
            pricePerMin: instance.pricePerMinute,
          },
        });

        await tx.instance.update({
          where: { id: instance.id },
          data: {
            lastBilledAt: now,
            totalBilledAmount: { increment: chargeAmount },
          },
        });

        return updatedBalance;
      });
    } catch (error) {
      log.error("Failed to bill instance", error, {
        instanceId: instance.id,
      });
      throw error;
    }

    // Auto-stop if credits depleted
    if (newBalance <= 0) {
      autoStopped = true;
      log.warn("Auto-stopping instance due to zero credits", {
        instanceId: instance.id,
        userId: instance.userId,
      });
    }

    // Low credits warning
    if (newBalance > 0 && newBalance < LOW_CREDITS_THRESHOLD) {
      // Check if we already sent a warning in the last hour
      const recentWarning = await prisma.notification.findFirst({
        where: {
          userId: instance.userId,
          type: "low_credits",
          createdAt: { gte: new Date(now.getTime() - 3600_000) },
        },
      });

      if (!recentWarning) {
        await prisma.notification.create({
          data: {
            userId: instance.userId,
            type: "low_credits",
            title: "Low Credits Warning",
            message: `Your balance is $${newBalance.toFixed(2)}. Add credits to avoid instance auto-stop.`,
            actionUrl: "/dashboard/billing",
          },
        });
      }
    }

    return {
      amountCharged: cost,
      remainingBalance: newBalance,
      autoStopped,
    };
  }

  /**
   * Aggregate usage summary for a user in a date range.
   */
  async getUsageSummary(
    userId: string,
    startDate: Date,
    endDate: Date,
    groupBy: "day" | "week" | "month" | "instance" | "gpu" = "day"
  ) {
    const logs = await prisma.usageLog.findMany({
      where: {
        userId,
        startTime: { gte: startDate, lte: endDate },
      },
      include: {
        instance: { select: { id: true, name: true, gpuType: true } },
      },
      orderBy: { startTime: "asc" },
    });

    const totalSpend = logs.reduce(
      (sum, l) => sum + Number(l.amountCharged ?? 0),
      0
    );
    const totalMinutes = logs.reduce(
      (sum, l) => sum + (l.durationMin ?? 0),
      0
    );

    // Group by GPU
    const gpuMap = new Map<string, { hours: number; cost: number }>();
    for (const l of logs) {
      const key = l.gpuType;
      const existing = gpuMap.get(key) ?? { hours: 0, cost: 0 };
      existing.hours += (l.durationMin ?? 0) / 60;
      existing.cost += Number(l.amountCharged ?? 0);
      gpuMap.set(key, existing);
    }

    // Group by day
    const dayMap = new Map<string, { cost: number; hours: number }>();
    for (const l of logs) {
      const key = l.startTime.toISOString().split("T")[0]!;
      const existing = dayMap.get(key) ?? { cost: 0, hours: 0 };
      existing.cost += Number(l.amountCharged ?? 0);
      existing.hours += (l.durationMin ?? 0) / 60;
      dayMap.set(key, existing);
    }

    // Group by instance
    const instanceMap = new Map<
      string,
      { name: string; gpuType: string; hours: number; cost: number }
    >();
    for (const l of logs) {
      const key = l.instanceId;
      const existing = instanceMap.get(key) ?? {
        name: l.instance.name,
        gpuType: l.instance.gpuType,
        hours: 0,
        cost: 0,
      };
      existing.hours += (l.durationMin ?? 0) / 60;
      existing.cost += Number(l.amountCharged ?? 0);
      instanceMap.set(key, existing);
    }

    return {
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      byGpu: Array.from(gpuMap.entries()).map(([gpuType, data]) => ({
        gpuType,
        hours: Math.round(data.hours * 100) / 100,
        cost: Math.round(data.cost * 100) / 100,
      })),
      byDay: Array.from(dayMap.entries()).map(([date, data]) => ({
        date,
        cost: Math.round(data.cost * 100) / 100,
        hours: Math.round(data.hours * 100) / 100,
      })),
      byInstance: Array.from(instanceMap.entries()).map(
        ([instanceId, data]) => ({
          instanceId,
          instanceName: data.name,
          gpuType: data.gpuType,
          hours: Math.round(data.hours * 100) / 100,
          cost: Math.round(data.cost * 100) / 100,
        })
      ),
    };
  }

  /**
   * Get monthly breakdown for invoice generation.
   */
  async getMonthlyBreakdown(userId: string, month: string) {
    const [year, mon] = month.split("-").map(Number);
    const startDate = new Date(year!, mon! - 1, 1);
    const endDate = new Date(year!, mon!, 0, 23, 59, 59);

    return this.getUsageSummary(userId, startDate, endDate, "instance");
  }
}

export const billingService = new BillingService();
