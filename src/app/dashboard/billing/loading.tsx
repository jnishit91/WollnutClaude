import { SkeletonCard } from "@/components/shared/Skeleton";

export default function BillingLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Balance cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Transactions table */}
      <div className="rounded-xl border border-surface-800 bg-surface-900 p-4 space-y-3">
        <div className="h-6 w-40 animate-pulse rounded bg-surface-800" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-lg bg-surface-800/50"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
