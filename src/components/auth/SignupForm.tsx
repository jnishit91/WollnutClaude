"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { OAuthButtons } from "./OAuthButtons";
import { API_ROUTES } from "@/lib/constants/routes";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!name || name.length < 2)
      errors.name = "Name must be at least 2 characters";
    if (!email) errors.email = "Email is required";
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
      const res = await fetch(API_ROUTES.AUTH.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.toLowerCase().trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.details) {
          const mapped: FieldErrors = {};
          for (const [key, msgs] of Object.entries(data.error.details)) {
            mapped[key as keyof FieldErrors] = (msgs as string[])[0];
          }
          setFieldErrors(mapped);
        } else {
          toast.error(data.error?.message || "Registration failed");
        }
        return;
      }

      toast.success("Account created! Signing you in...");

      // Auto sign-in after successful registration
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        // Sign-in failed, redirect to sign-in page
        router.push("/auth/signin");
      } else {
        router.push("/dashboard");
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
      <OAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-surface-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface-900 px-2 text-surface-500">
            or create with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-surface-300"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus-ring"
            placeholder="Your name"
            autoComplete="name"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-accent-red">{fieldErrors.name}</p>
          )}
        </div>

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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-surface-300"
          >
            Password
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
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-surface-500">
        Already have an account?{" "}
        <a
          href="/auth/signin"
          className="text-brand-400 hover:text-brand-300"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
