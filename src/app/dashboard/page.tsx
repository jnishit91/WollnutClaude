"use client";

import Link from "next/link";
import { useDashboardStats } from "@/lib/hooks/use-billing";
import { SkeletonCard } from "@/components/shared/Skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Server, DollarSign, Clock, Zap } from "lucide-react";

function StatsCards({
  stats,
}: {
  stats: {
    activeInstances: number;
    creditsBalance: number;
    monthSpend: number;
    totalGpuHours: number;
  };
}) {
  const cards = [
    {
      label: "Active Instances",
      value: stats.activeInstances.toString(),
      icon: Server,
      color: "text-accent-green",
      bg: "bg-accent-green/10",
    },
    {
      label: "Credits Balance",
      value: `$${stats.creditsBalance.toFixed(2)}`,
      icon: DollarSign,
      color: "text-brand-400",
      bg: "bg-brand-400/10",
    },
    {
      label: "This Month",
      value: `$${stats.monthSpend.toFixed(2)}`,
      icon: Zap,
      color: "text-accent-amber",
      bg: "bg-accent-amber/10",
    },
    {
      label: "Total GPU Hours",
      value: stats.totalGpuHours.toFixed(1),
      icon: Clock,
      color: "text-accent-purple",
      bg: "bg-accent-purple/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-surface-800 bg-surface-900 p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-surface-400">
              {card.label}
            </span>
            <div className={`rounded-lg p-2 ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function UsageChart({
  data,
}: {
  data: { date: string; hours: number; cost: number }[];
}) {
  return (
    <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
      <h3 className="text-sm font-semibold text-white">
        GPU Usage — Last 30 Days
      </h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
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
              formatter={(value: number, name: string) => [
                name === "cost" ? `$${value.toFixed(2)}` : `${value.toFixed(1)}h`,
                name === "cost" ? "Spend" : "GPU Hours",
              ]}
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="#5c7cfa"
              fillOpacity={1}
              fill="url(#colorCost)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecentActivity({
  transactions,
}: {
  transactions: {
    id: string;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
  }[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        <p className="mt-4 text-center text-sm text-surface-500">
          No recent activity
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
      <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
      <div className="mt-4 space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between border-b border-surface-800 pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="text-sm text-surface-200">{tx.description}</p>
              <p className="text-xs text-surface-500">
                {new Date(tx.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`text-sm font-medium ${
                tx.amount >= 0 ? "text-accent-green" : "text-accent-red"
              }`}
            >
              {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="skeleton h-72 rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link
          href="/dashboard/instances/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Launch Instance
        </Link>
      </div>

      <StatsCards stats={stats} />

      {/* Quick launch */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/instances/new?gpu=H100"
          className="gpu-card flex items-center gap-4"
        >
          <div className="rounded-lg bg-accent-green/10 p-3">
            <Zap className="h-6 w-6 text-accent-green" />
          </div>
          <div>
            <p className="font-semibold text-white">Launch H100</p>
            <p className="text-sm text-surface-400">
              80GB SXM, up to 8x GPU
            </p>
          </div>
        </Link>
        <Link
          href="/dashboard/instances/new?gpu=H200"
          className="gpu-card flex items-center gap-4"
        >
          <div className="rounded-lg bg-brand-500/10 p-3">
            <Zap className="h-6 w-6 text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Launch H200</p>
            <p className="text-sm text-surface-400">
              141GB SXM, up to 8x GPU
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UsageChart data={stats.dailyUsage} />
        </div>
        <RecentActivity transactions={stats.recentTransactions} />
      </div>
    </div>
  );
}
