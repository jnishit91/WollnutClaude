// src/app/auth/layout.tsx
// Auth pages layout — centered card with branding

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-950 px-4">
      {/* Background grid pattern */}
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-30" />

      <div className="relative w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 font-bold text-white">
              W
            </div>
            <span className="text-xl font-bold text-white">Wollnut Labs</span>
          </Link>
          <p className="text-sm text-surface-500">
            Enterprise GPU Cloud for AI/ML
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-surface-800 bg-surface-900 p-8 shadow-xl">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-surface-600">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-surface-400 underline-offset-2 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-surface-400 underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
