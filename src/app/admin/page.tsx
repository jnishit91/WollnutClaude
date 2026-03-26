"use client";

import { useQuery } from "@tanstack/react-query";
import { SkeletonCard } from "@/components/shared/Skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Server,
  DollarSign,
  Clock,
  TrendingUp,
  UserPlus,
} from "lucide-react";

async function fetchAdminRevenue() {
  const res = await fetch("/api/v1/admin/revenue");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to load");
  return data.data;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-surface-800 bg-surface-900 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-surface-400">{label}</span>
        <div className={`rounded-lg p-2 ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-surface-500">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: fetchAdminRevenue,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="skeleton h-72 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const revenueGrowth =
    data.lastMonthRevenue > 0
      ? (
          ((data.monthRevenue - data.lastMonthRevenue) /
            data.lastMonthRevenue) *
          100
        ).toFixed(0)
      : "—";

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Users"
          value={data.totalUsers.toString()}
          sub={`${data.recentSignups} this month`}
          icon={Users}
          color="text-brand-400"
          bg="bg-brand-400/10"
        />
        <StatCard
          label="Total Instances"
          value={data.totalInstances.toString()}
          sub={`${data.runningInstances} running`}
          icon={Server}
          color="text-accent-green"
          bg="bg-accent-green/10"
        />
        <StatCard
          label="Total Revenue"
          value={`$${data.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="text-accent-amber"
          bg="bg-accent-amber/10"
        />
        <StatCard
          label="This Month"
          value={`$${data.monthRevenue.toFixed(2)}`}
          sub={revenueGrowth !== "—" ? `${revenueGrowth}% vs last month` : undefined}
          icon={TrendingUp}
          color="text-accent-purple"
          bg="bg-accent-purple/10"
        />
        <StatCard
          label="GPU Hours"
          value={data.totalGpuHours.toFixed(1)}
          icon={Clock}
          color="text-accent-cyan"
          bg="bg-accent-cyan/10"
        />
        <StatCard
          label="New Signups"
          value={data.recentSignups.toString()}
          sub="This month"
          icon={UserPlus}
          color="text-accent-green"
          bg="bg-accent-green/10"
        />
      </div>

      {/* Revenue chart + Top users */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h3 className="text-sm font-semibold text-white">
            Revenue — Last 30 Days
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#868e96", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: string) =>
                    new Date(v).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#868e96", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid #2a2a4a",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  labelFormatter={(v: string) =>
                    new Date(v).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })
                  }
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top users */}
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h3 className="text-sm font-semibold text-white">
            Top Users by Balance
          </h3>
          <div className="mt-4 space-y-3">
            {data.topUsers.map(
              (user: {
                id: string;
                name: string | null;
                email: string;
                creditsBalance: number;
                instanceCount: number;
              }) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b border-surface-800 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name ?? "—"}
                    </p>
                    <p className="truncate text-xs text-surface-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-accent-green">
                      ${user.creditsBalance.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-surface-500">
                      {user.instanceCount} instances
                    </p>
                  </div>
                </div>
              )
            )}
            {data.topUsers.length === 0 && (
              <p className="text-center text-sm text-surface-500">No users yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
