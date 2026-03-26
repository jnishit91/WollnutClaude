"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { API_ROUTES } from "@/lib/constants/routes";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-accent-red">
          Invalid reset link. Please request a new password reset.
        </p>
        <a
          href="/auth/forgot-password"
          className="inline-block text-sm text-brand-400 hover:text-brand-300"
        >
          Request new reset link
        </a>
      </div>
    );
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!password || password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      errors.password =
        "Must contain uppercase, lowercase, and a number";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await fetch(API_ROUTES.AUTH.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error?.message || "Failed to reset password");
        return;
      }

      toast.success("Password reset successfully! Please sign in.");
      router.push("/auth/signin");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-surface-400">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-surface-300"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus-ring"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-accent-red">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-surface-300"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus-ring"
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-xs text-accent-red">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {isLoading ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </div>
  );
}
