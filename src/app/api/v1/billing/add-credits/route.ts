// src/app/api/v1/billing/add-credits/route.ts
// Create Stripe checkout session for credit top-up

import { requireAuth } from "@/lib/auth-helpers";
import { stripeService } from "@/lib/services/stripe.service";
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

  const checkoutUrl = await stripeService.createCheckoutSession(
    user.id,
    user.email!,
    user.name ?? null,
    amount,
    currency
  );

  return apiSuccess({ checkoutUrl });
});
