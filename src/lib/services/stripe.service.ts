// src/lib/services/stripe.service.ts
// Stripe integration — checkout, webhooks, customer management

import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { createLogger } from "@/lib/utils/logger";
import type Stripe from "stripe";

const log = createLogger("stripe");

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

class StripeService {
  /**
   * Get or create a Stripe customer for a user.
   */
  async getOrCreateCustomer(
    userId: string,
    email: string,
    name?: string | null
  ): Promise<string> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await stripe.customers.create({
      email,
      name: name ?? undefined,
      metadata: { wollnutUserId: userId },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    log.info("Created Stripe customer", {
      userId,
      stripeCustomerId: customer.id,
    });

    return customer.id;
  }

  /**
   * Create a Stripe Checkout Session for credit top-up.
   */
  async createCheckoutSession(
    userId: string,
    email: string,
    name: string | null,
    amount: number,
    currency: "USD" | "INR" = "USD"
  ): Promise<string> {
    const customerId = await this.getOrCreateCustomer(userId, email, name);

    const unitAmount =
      currency === "USD" ? Math.round(amount * 100) : Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Wollnut Labs Credits — $${amount}`,
              description: `Add $${amount} credits to your Wollnut Labs account`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        amount: amount.toString(),
        currency,
      },
      success_url: `${APP_URL}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${APP_URL}/dashboard/billing?cancelled=true`,
    });

    log.info("Created checkout session", {
      userId,
      amount,
      currency,
      sessionId: session.id,
    });

    return session.url!;
  }

  /**
   * Verify and process a Stripe webhook event.
   */
  async handleWebhookEvent(
    payload: string,
    signature: string
  ): Promise<{ type: string; processed: boolean }> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    log.info("Received webhook event", {
      type: event.type,
      id: event.id,
    });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        return {
          type: event.type,
          processed: true,
          ...this.extractSessionMetadata(session),
        };
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        log.warn("Payment failed", {
          paymentIntentId: intent.id,
          userId: intent.metadata?.userId,
        });
        return {
          type: event.type,
          processed: true,
          userId: intent.metadata?.userId,
        } as { type: string; processed: boolean };
      }

      default:
        return { type: event.type, processed: false };
    }
  }

  private extractSessionMetadata(session: Stripe.Checkout.Session) {
    return {
      userId: session.metadata?.userId,
      amount: parseFloat(session.metadata?.amount ?? "0"),
      currency: session.metadata?.currency ?? "USD",
      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
      sessionId: session.id,
    };
  }
}

export const stripeService = new StripeService();
