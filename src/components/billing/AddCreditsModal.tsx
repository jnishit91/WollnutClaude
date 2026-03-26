"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useCreateOrder, useVerifyPayment } from "@/lib/hooks/use-billing";
import {
  CREDIT_TOPUP_OPTIONS_USD,
  CREDIT_TOPUP_OPTIONS_INR,
} from "@/types/billing.types";
import { Spinner } from "@/components/shared/Spinner";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddCreditsModal({ open, onClose }: Props) {
  const [currency, setCurrency] = useState<"USD" | "INR">("INR");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  if (!open) return null;

  const options =
    currency === "USD" ? CREDIT_TOPUP_OPTIONS_USD : CREDIT_TOPUP_OPTIONS_INR;
  const amount = selectedAmount ?? (customAmount ? parseFloat(customAmount) : 0);
  const isValid = amount >= 5 && amount <= 10000;
  const isPending = createOrder.isPending || verifyPayment.isPending;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceed = async () => {
    if (!isValid) return;

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      return;
    }

    createOrder.mutate(
      { amount, currency },
      {
        onSuccess: (data) => {
          const rzp = new window.Razorpay({
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: "Wollnut Labs",
            description: `Add $${amount} credits`,
            order_id: data.orderId,
            prefill: data.prefill,
            theme: {
              color: "#3b5bdb",
            },
            handler: (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              // Verify payment on server
              verifyPayment.mutate(response, {
                onSuccess: (result) => {
                  toast.success(
                    `$${result.amount.toFixed(2)} credits added successfully!`
                  );
                  onClose();
                },
                onError: (error) => {
                  toast.error(
                    error.message || "Payment verification failed"
                  );
                },
              });
            },
            modal: {
              ondismiss: () => {
                toast.info("Payment cancelled");
              },
            },
          });

          rzp.open();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create order");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-surface-700 bg-surface-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add Credits</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-surface-400 hover:bg-surface-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Currency toggle */}
        <div className="mt-4 flex gap-2">
          {(["INR", "USD"] as const).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCurrency(c);
                setSelectedAmount(null);
                setCustomAmount("");
              }}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                currency === c
                  ? "bg-brand-600 text-white"
                  : "bg-surface-800 text-surface-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Preset amounts */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {options.map((opt) => (
            <button
              key={opt.amount}
              onClick={() => {
                setSelectedAmount(opt.amount);
                setCustomAmount("");
              }}
              className={`relative rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                selectedAmount === opt.amount
                  ? "border-brand-500 bg-brand-600/10 text-brand-400"
                  : "border-surface-700 bg-surface-800 text-surface-200 hover:border-surface-600"
              }`}
            >
              {opt.label}
              {opt.popular && (
                <span className="absolute -top-2 right-2 rounded bg-accent-amber px-1.5 text-[10px] font-bold text-black">
                  Popular
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="mt-4">
          <label className="text-xs font-medium text-surface-400">
            Or enter custom amount
          </label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-surface-400">
              {currency === "USD" ? "$" : "\u20B9"}
            </span>
            <input
              type="number"
              min={5}
              max={10000}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              placeholder="Enter amount"
              className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Proceed */}
        <button
          onClick={handleProceed}
          disabled={!isValid || isPending}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Spinner className="h-4 w-4" />
              Processing...
            </>
          ) : (
            `Pay ${currency === "USD" ? "$" : "\u20B9"}${amount || 0}`
          )}
        </button>

        <p className="mt-3 text-center text-[10px] text-surface-500">
          Secured by Razorpay. Supports UPI, cards, and net banking.
        </p>
      </div>
    </div>
  );
}
