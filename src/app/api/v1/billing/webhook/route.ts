// src/app/api/v1/billing/webhook/route.ts
// Stripe webhook handler — NO auth required (Stripe calls this directly)

import { NextResponse } from "next/server";
import { stripeService } from "@/lib/services/stripe.service";
import { billingService } from "@/lib/services/billing.service";
import prisma from "@/lib/prisma";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("stripe-webhook");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const result = await stripeService.handleWebhookEvent(body, signature);

    if (
      result.type === "checkout.session.completed" &&
      result.processed
    ) {
      const data = result as {
        type: string;
        processed: boolean;
        userId?: string;
        amount?: number;
        paymentIntentId?: string;
        sessionId?: string;
      };

      if (data.userId && data.amount) {
        // Add credits to user wallet
        await billingService.addCredits(
          data.userId,
          data.amount,
          data.paymentIntentId ?? undefined,
          data.sessionId ?? undefined,
          "CREDIT_PURCHASE"
        );

        // Create notification
        await prisma.notification.create({
          data: {
            userId: data.userId,
            type: "credits_added",
            title: "Credits Added",
            message: `$${data.amount.toFixed(2)} credits have been added to your account.`,
            actionUrl: "/dashboard/billing",
          },
        });

        log.info("Credits added via webhook", {
          userId: data.userId,
          amount: data.amount,
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    log.error("Webhook processing failed", error instanceof Error ? error : new Error(String(error)));
    // Return 200 to prevent Stripe from retrying (we logged the error)
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
