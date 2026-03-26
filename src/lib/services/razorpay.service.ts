// src/lib/services/razorpay.service.ts
// Razorpay integration — order creation, payment verification

import razorpay from "@/lib/razorpay";
import { createLogger } from "@/lib/utils/logger";
import crypto from "crypto";

const log = createLogger("razorpay");

class RazorpayService {
  /**
   * Create a Razorpay order for credit top-up.
   * Returns orderId + key for client-side checkout.
   */
  async createOrder(
    userId: string,
    amount: number,
    currency: "INR" | "USD" = "INR"
  ): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  }> {
    // Razorpay expects amount in smallest currency unit (paise for INR, cents for USD)
    const amountInSmallestUnit = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInSmallestUnit,
      currency: currency,
      receipt: `wollnut_${userId}_${Date.now()}`,
      notes: {
        userId,
        amount: amount.toString(),
        currency,
        purpose: "credit_topup",
      },
    });

    log.info("Created Razorpay order", {
      userId,
      amount,
      currency,
      orderId: order.id,
    });

    return {
      orderId: order.id,
      amount: amountInSmallestUnit,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID ?? "",
    };
  }

  /**
   * Verify Razorpay payment signature.
   * Must be called after client-side payment completion.
   */
  verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error("RAZORPAY_KEY_SECRET is not configured");
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  }

  /**
   * Verify Razorpay webhook signature.
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured");
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  }

  /**
   * Fetch payment details from Razorpay.
   */
  async getPaymentDetails(paymentId: string) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      log.error("Failed to fetch payment details", error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
}

export const razorpayService = new RazorpayService();
