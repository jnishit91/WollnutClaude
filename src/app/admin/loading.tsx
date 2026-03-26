import { SkeletonCard } from "@/components/shared/Skeleton";

export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl border border-surface-800 bg-surface-900" />
    </div>
  );
}
