"use client";

import { useState } from "react";
import { toast } from "sonner";
import { API_ROUTES } from "@/lib/constants/routes";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const res = await fetch(API_ROUTES.AUTH.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error?.message || "Something went wrong");
        return;
      }

      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/10">
          <svg
            className="h-6 w-6 text-accent-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">Check your email</h3>
        <p className="text-sm text-surface-400">
          If an account with <span className="text-white">{email}</span> exists,
          we&apos;ve sent a password reset link.
        </p>
        <a
          href="/auth/signin"
          className="inline-block text-sm text-brand-400 hover:text-brand-300"
        >
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-surface-400">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-surface-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus-ring"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-sm text-surface-500">
        <a
          href="/auth/signin"
          className="text-brand-400 hover:text-brand-300"
        >
          Back to sign in
        </a>
      </p>
    </div>
  );
}
