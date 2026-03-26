import { SkeletonCard } from "@/components/shared/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="h-72 animate-pulse rounded-xl border border-surface-800 bg-surface-900" />

      {/* Table placeholder */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-surface-900"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
