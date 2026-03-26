// src/app/api/v1/billing/auto-recharge/route.ts
// Update auto-recharge settings

import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { autoRechargeSchema } from "@/lib/validators/billing.schema";
import { apiSuccess, withErrorHandler } from "@/lib/utils/api-response";

export const PUT = withErrorHandler(async (req) => {
  const user = await requireAuth();
  const body = await req.json();
  const { enabled, amount, threshold } = autoRechargeSchema.parse(body);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      autoRecharge: enabled,
      autoRechargeAmt: enabled && amount ? amount : null,
      autoRechargeAt: enabled && threshold ? threshold : null,
    },
    select: {
      autoRecharge: true,
      autoRechargeAmt: true,
      autoRechargeAt: true,
    },
  });

  return apiSuccess({
    autoRecharge: updated.autoRecharge,
    autoRechargeAmount: updated.autoRechargeAmt ? Number(updated.autoRechargeAmt) : null,
    autoRechargeThreshold: updated.autoRechargeAt ? Number(updated.autoRechargeAt) : null,
  });
});
