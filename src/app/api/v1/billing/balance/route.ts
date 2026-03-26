// src/app/api/v1/billing/balance/route.ts
// Get user's credits balance and auto-recharge settings

import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { apiSuccess, withErrorHandler } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async () => {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: {
      creditsBalance: true,
      autoRecharge: true,
      autoRechargeAmt: true,
      autoRechargeAt: true,
    },
  });

  return apiSuccess({
    balance: Number(dbUser.creditsBalance),
    autoRecharge: dbUser.autoRecharge,
    autoRechargeAmount: dbUser.autoRechargeAmt ? Number(dbUser.autoRechargeAmt) : null,
    autoRechargeThreshold: dbUser.autoRechargeAt ? Number(dbUser.autoRechargeAt) : null,
  });
});
