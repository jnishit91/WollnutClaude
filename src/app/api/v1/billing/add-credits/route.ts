// src/app/api/v1/billing/add-credits/route.ts
// Create Razorpay order for credit top-up

import { requireAuth } from "@/lib/auth-helpers";
import { razorpayService } from "@/lib/services/razorpay.service";
import { addCreditsSchema } from "@/lib/validators/billing.schema";
import { apiSuccess, withErrorHandler } from "@/lib/utils/api-response";
import { billingLimiter } from "@/lib/utils/rate-limiter";
import { apiError } from "@/lib/utils/api-response";

export const POST = withErrorHandler(async (req) => {
  const user = await requireAuth();

  const limit = billingLimiter.check(user.id);
  if (!limit.allowed) {
    return apiError("Too many requests. Please try again later.", 429, "RATE_LIMITED");
  }

  const body = await req.json();
  const { amount, currency } = addCreditsSchema.parse(body);

  const order = await razorpayService.createOrder(
    user.id,
    amount,
    currency
  );

  return apiSuccess({
    orderId: order.orderId,
    amount: order.amount,
    currency: order.currency,
    keyId: order.keyId,
    prefill: {
      name: user.name ?? "",
      email: user.email ?? "",
    },
  });
});
