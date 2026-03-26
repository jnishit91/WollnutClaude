"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-950 px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-accent-red">500</p>
        <h1 className="mt-4 text-2xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="mt-2 max-w-md text-surface-400">
          An unexpected error occurred. Our team has been notified. Please try
          again.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-surface-600">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Try Again
          </button>
          <a
            href="/"
            className="rounded-lg border border-surface-700 px-5 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-white"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
