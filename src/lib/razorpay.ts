// src/lib/razorpay.ts
// Razorpay client singleton — server-side only

import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set — Razorpay operations will fail"
  );
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
});

export default razorpay;
