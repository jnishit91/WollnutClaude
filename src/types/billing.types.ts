// src/types/billing.types.ts
// Billing, credits, and transaction types

export type TransactionType =
  | "CREDIT_PURCHASE"
  | "USAGE_DEDUCTION"
  | "REFUND"
  | "BONUS"
  | "PROMO";

export interface CreditBalance {
  balance: number;
  currency: string;
  autoRecharge: boolean;
  autoRechargeAmt: number | null;
  autoRechargeAt: number | null;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  balance: number;
  description: string;
  stripePaymentId: string | null;
  instanceId: string | null;
  createdAt: string;
}

export interface UsageSummary {
  totalSpend: number;
  totalHours: number;
  byGpu: {
    gpuType: string;
    hours: number;
    cost: number;
  }[];
  byDay: {
    date: string;
    cost: number;
    hours: number;
  }[];
  byInstance: {
    instanceId: string;
    instanceName: string;
    gpuType: string;
    hours: number;
    cost: number;
  }[];
}

export interface Invoice {
  id: string;
  month: string;
  totalAmount: number;
  currency: string;
  pdfUrl: string | null;
  createdAt: string;
  breakdown: InvoiceBreakdown;
}

export interface InvoiceBreakdown {
  instances: {
    instanceId: string;
    name: string;
    gpuType: string;
    totalHours: number;
    totalCost: number;
  }[];
  totalCreditsUsed: number;
  totalCreditsPurchased: number;
}

/** Stripe checkout options for credit top-up */
export interface CreditTopUpOption {
  amount: number;
  currency: "USD" | "INR";
  label: string;
  popular?: boolean;
}

export const CREDIT_TOPUP_OPTIONS_USD: CreditTopUpOption[] = [
  { amount: 10, currency: "USD", label: "$10" },
  { amount: 25, currency: "USD", label: "$25" },
  { amount: 50, currency: "USD", label: "$50", popular: true },
  { amount: 100, currency: "USD", label: "$100" },
  { amount: 250, currency: "USD", label: "$250" },
  { amount: 500, currency: "USD", label: "$500" },
];

export const CREDIT_TOPUP_OPTIONS_INR: CreditTopUpOption[] = [
  { amount: 500, currency: "INR", label: "₹500" },
  { amount: 1000, currency: "INR", label: "₹1,000" },
  { amount: 2500, currency: "INR", label: "₹2,500", popular: true },
  { amount: 5000, currency: "INR", label: "₹5,000" },
  { amount: 10000, currency: "INR", label: "₹10,000" },
  { amount: 25000, currency: "INR", label: "₹25,000" },
];
