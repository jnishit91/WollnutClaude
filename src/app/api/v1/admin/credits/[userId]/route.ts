// src/app/api/v1/admin/credits/[userId]/route.ts
// Admin: adjust user credits

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { ResourceNotFoundError } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";
import { z } from "zod";

const log = createLogger("admin-credits");

const adjustCreditsSchema = z.object({
  amount: z.number().min(-10000).max(10000),
  reason: z.string().min(1).max(500),
});

export const POST = withErrorHandler(async (req, context) => {
  const admin = await requireAdmin();
  const params = await context.params;
  const userId = params.userId as string;

  const body = await req.json();
  const { amount, reason } = adjustCreditsSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new ResourceNotFoundError("User", userId);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId },
      data: { creditsBalance: { increment: amount } },
      select: { creditsBalance: true },
    });

    const newBalance = Number(updated.creditsBalance);

    await tx.transaction.create({
      data: {
        userId,
        type: amount >= 0 ? "BONUS" : "USAGE_DEDUCTION",
        amount,
        balance: newBalance,
        description: `Admin adjustment: ${reason}`,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: admin.id,
        action: "admin.credit_adjust",
        resource: "user",
        resourceId: userId,
        details: {
          targetEmail: user.email,
          amount,
          reason,
          newBalance,
        },
      },
    });

    return newBalance;
  });

  log.info("Admin credit adjustment", {
    adminId: admin.id,
    targetUserId: userId,
    amount,
    reason,
    newBalance: result,
  });

  return apiSuccess({ userId, newBalance: result });
});
