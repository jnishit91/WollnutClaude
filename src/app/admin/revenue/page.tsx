"use client";

import { useQuery } from "@tanstack/react-query";
import { SkeletonCard } from "@/components/shared/Skeleton";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

async function fetchRevenue() {
  const res = await fetch("/api/v1/admin/revenue");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to load");
  return data.data;
}

export default function AdminRevenuePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: fetchRevenue,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-6">
        <h1 className="text-2xl font-bold text-white">Revenue</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="skeleton h-80 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const growth =
    data.lastMonthRevenue > 0
      ? ((data.monthRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100
      : 0;
  const isPositiveGrowth = growth >= 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-white">Revenue</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-surface-400">
              Total Revenue
            </span>
            <div className="rounded-lg bg-accent-green/10 p-2">
              <DollarSign className="h-4 w-4 text-accent-green" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            ${data.totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border border-surface-800 bg-surface-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-surface-400">
              This Month
            </span>
            <div className={`rounded-lg p-2 ${isPositiveGrowth ? "bg-accent-green/10" : "bg-accent-red/10"}`}>
              {isPositiveGrowth ? (
                <TrendingUp className="h-4 w-4 text-accent-green" />
              ) : (
                <TrendingDown className="h-4 w-4 text-accent-red" />
              )}
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            ${data.monthRevenue.toFixed(2)}
          </p>
          <p className={`mt-1 text-xs ${isPositiveGrowth ? "text-accent-green" : "text-accent-red"}`}>
            {isPositiveGrowth ? "+" : ""}
            {growth.toFixed(1)}% vs last month
          </p>
        </div>

        <div className="rounded-xl border border-surface-800 bg-surface-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-surface-400">
              Last Month
            </span>
            <div className="rounded-lg bg-surface-700/50 p-2">
              <DollarSign className="h-4 w-4 text-surface-400" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            ${data.lastMonthRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
        <h3 className="text-sm font-semibold text-white">
          Daily Revenue — Last 30 Days
        </h3>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.dailyRevenue}>
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
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                }
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
              />
              <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top users */}
      <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
        <h3 className="text-sm font-semibold text-white">
          Top Users by Credit Balance
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="pb-2 text-left font-medium text-surface-400">User</th>
                <th className="pb-2 text-right font-medium text-surface-400">Balance</th>
                <th className="pb-2 text-right font-medium text-surface-400">Instances</th>
              </tr>
            </thead>
            <tbody>
              {data.topUsers.map(
                (user: {
                  id: string;
                  name: string | null;
                  email: string;
                  creditsBalance: number;
                  instanceCount: number;
                }) => (
                  <tr key={user.id} className="border-b border-surface-800/50">
                    <td className="py-3">
                      <p className="font-medium text-white">{user.name ?? "—"}</p>
                      <p className="text-xs text-surface-500">{user.email}</p>
                    </td>
                    <td className="py-3 text-right font-mono text-accent-green">
                      ${user.creditsBalance.toFixed(2)}
                    </td>
                    <td className="py-3 text-right text-surface-300">
                      {user.instanceCount}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
