"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { OAuthButtons } from "./OAuthButtons";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!email) {
      setFieldErrors({ email: "Email is required" });
      return;
    }
    if (!password) {
      setFieldErrors({ password: "Password is required" });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error === "OAuthAccountNotLinked" && (
        <div className="rounded-lg border border-accent-red/20 bg-accent-red/10 p-3 text-sm text-accent-red">
          An account with this email already exists. Please sign in with the
          original provider.
        </div>
      )}

      <OAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-surface-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface-900 px-2 text-surface-500">
            or continue with email
          </span>
        </div>
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
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-accent-red">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-surface-300"
            >
              Password
            </label>
            <a
              href="/auth/forgot-password"
              className="text-xs text-brand-400 hover:text-brand-300"
            >
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus-ring"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-accent-red">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-surface-500">
        Don&apos;t have an account?{" "}
        <a
          href="/auth/signup"
          className="text-brand-400 hover:text-brand-300"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}
