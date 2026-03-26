export default function InstancesLoading() {
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-800" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-surface-800" />
      </div>

      {/* Instance cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-xl border border-surface-800 bg-surface-900"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}
