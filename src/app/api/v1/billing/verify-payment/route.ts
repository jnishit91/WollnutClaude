// src/app/api/v1/billing/verify-payment/route.ts
// Verify Razorpay payment after client-side checkout

import { requireAuth } from "@/lib/auth-helpers";
import { razorpayService } from "@/lib/services/razorpay.service";
import { billingService } from "@/lib/services/billing.service";
import prisma from "@/lib/prisma";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/utils/api-response";
import { createLogger } from "@/lib/utils/logger";
import { z } from "zod";

const log = createLogger("razorpay-verify");

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export const POST = withErrorHandler(async (req) => {
  const user = await requireAuth();

  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    verifySchema.parse(body);

  // Verify signature
  const isValid = razorpayService.verifyPayment(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValid) {
    log.warn("Payment signature verification failed", {
      userId: user.id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
    return apiError("Payment verification failed", 400, "PAYMENT_VERIFICATION_FAILED");
  }

  // Fetch payment details from Razorpay
  const payment = await razorpayService.getPaymentDetails(razorpay_payment_id);
  const amountInCurrency = Number(payment.amount) / 100;
  const notes = payment.notes as Record<string, string> | undefined;
  const creditAmount = parseFloat(notes?.amount ?? amountInCurrency.toString());

  // Add credits
  const newBalance = await billingService.addCredits(
    user.id,
    creditAmount,
    razorpay_payment_id,
    razorpay_order_id,
    "CREDIT_PURCHASE"
  );

  // Create notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "credits_added",
      title: "Credits Added",
      message: `$${creditAmount.toFixed(2)} credits have been added to your account.`,
      actionUrl: "/dashboard/billing",
    },
  });

  log.info("Payment verified and credits added", {
    userId: user.id,
    amount: creditAmount,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });

  return apiSuccess({
    verified: true,
    amount: creditAmount,
    newBalance,
    paymentId: razorpay_payment_id,
  });
});
