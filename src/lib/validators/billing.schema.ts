// src/lib/validators/billing.schema.ts
// Zod schemas for billing and credit operations

import { z } from "zod";

export const addCreditsSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(5, "Minimum top-up is $5")
    .max(10000, "Maximum top-up is $10,000"),
  currency: z.enum(["USD", "INR"]).default("USD"),
  returnUrl: z.string().url().optional(),
});

export type AddCreditsInput = z.infer<typeof addCreditsSchema>;

export const autoRechargeSchema = z.object({
  enabled: z.boolean(),
  amount: z
    .number()
    .positive("Recharge amount must be positive")
    .min(10, "Minimum auto-recharge is $10")
    .max(5000, "Maximum auto-recharge is $5,000")
    .optional()
    .nullable(),
  threshold: z
    .number()
    .min(1, "Threshold must be at least $1")
    .max(1000)
    .optional()
    .nullable(),
});

export type AutoRechargeInput = z.infer<typeof autoRechargeSchema>;

export const usageQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  instanceId: z.string().optional(),
  gpuType: z.string().optional(),
  groupBy: z.enum(["day", "week", "month", "instance", "gpu"]).default("day"),
});

export type UsageQueryInput = z.infer<typeof usageQuerySchema>;

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  type: z
    .enum([
      "CREDIT_PURCHASE",
      "USAGE_DEDUCTION",
      "REFUND",
      "BONUS",
      "PROMO",
    ])
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;

/** Stripe webhook event validation */
export const stripeWebhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.unknown()),
  }),
});

/** Admin credit adjustment */
export const adminCreditAdjustSchema = z.object({
  amount: z.number().refine((val) => val !== 0, "Amount cannot be zero"),
  type: z.enum(["BONUS", "REFUND", "PROMO"]),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500),
});

export type AdminCreditAdjustInput = z.infer<typeof adminCreditAdjustSchema>;
