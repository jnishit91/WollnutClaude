// src/app/api/v1/billing/webhook/route.ts
// Razorpay webhook handler — NO auth required (Razorpay calls this directly)

import { NextResponse } from "next/server";
import { razorpayService } from "@/lib/services/razorpay.service";
import { billingService } from "@/lib/services/billing.service";
import prisma from "@/lib/prisma";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("razorpay-webhook");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = razorpayService.verifyWebhookSignature(body, signature);
    if (!isValid) {
      log.warn("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.event as string;

    log.info("Received webhook event", {
      type: eventType,
      paymentId: event.payload?.payment?.entity?.id,
    });

    switch (eventType) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        const notes = payment.notes as Record<string, string> | undefined;
        const userId = notes?.userId;
        const amount = parseFloat(notes?.amount ?? "0");

        if (userId && amount > 0) {
          // Check if we already processed this payment (idempotency)
          const existing = await prisma.transaction.findFirst({
            where: { razorpayPaymentId: payment.id },
          });

          if (!existing) {
            await billingService.addCredits(
              userId,
              amount,
              payment.id,
              payment.order_id,
              "CREDIT_PURCHASE"
            );

            await prisma.notification.create({
              data: {
                userId,
                type: "credits_added",
                title: "Credits Added",
                message: `$${amount.toFixed(2)} credits have been added to your account.`,
                actionUrl: "/dashboard/billing",
              },
            });

            log.info("Credits added via webhook", { userId, amount });
          }
        }
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        const notes = payment.notes as Record<string, string> | undefined;
        const userId = notes?.userId;

        log.warn("Payment failed", {
          paymentId: payment.id,
          userId,
          reason: payment.error_description,
        });
        break;
      }

      default:
        log.info("Unhandled webhook event", { type: eventType });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    log.error(
      "Webhook processing failed",
      error instanceof Error ? error : new Error(String(error))
    );
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
