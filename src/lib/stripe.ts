// src/lib/stripe.ts
// Stripe client singleton — server-side only

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set — Stripe operations will fail");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
  typescript: true,
});

export default stripe;
