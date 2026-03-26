export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="mt-3 h-8 w-32 rounded" />
      <Skeleton className="mt-2 h-3 w-20 rounded" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-surface-800 bg-surface-900/50 px-4 py-4">
      <Skeleton className="h-4 w-32 rounded" />
      <Skeleton className="h-4 w-20 rounded" />
      <Skeleton className="h-4 w-16 rounded" />
      <Skeleton className="ml-auto h-4 w-24 rounded" />
    </div>
  );
}
