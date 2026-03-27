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
import {
  Server,
  DollarSign,
  Clock,
  Zap,
  KeyRound,
  Cpu,
  Rocket,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

/* ── Animation helpers ─────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

/* ── Stats cards (existing) ────────────────── */
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

/* ── Usage chart (existing) ────────────────── */
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

/* ── Recent activity (existing) ────────────── */
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

/* ── Welcome / onboarding for new users ────── */
function WelcomeSection({
  stats,
}: {
  stats: {
    activeInstances: number;
    creditsBalance: number;
    monthSpend: number;
    totalGpuHours: number;
  };
}) {
  const quickStartSteps = [
    {
      icon: KeyRound,
      title: "Add SSH Key",
      description: "Upload your public key for secure instance access",
      href: "/dashboard/settings",
      color: "text-brand-400",
      bg: "bg-brand-400/10",
    },
    {
      icon: Cpu,
      title: "Choose GPU",
      description: "Pick the right GPU for your AI/ML workload",
      href: "/dashboard/instances/new",
      color: "text-accent-amber",
      bg: "bg-accent-amber/10",
    },
    {
      icon: Rocket,
      title: "Launch Instance",
      description: "Deploy in seconds with your preferred config",
      href: "/dashboard/instances/new",
      color: "text-accent-green",
      bg: "bg-accent-green/10",
    },
  ];

  const featuredGpus = [
    {
      name: "H100",
      spec: "80GB SXM",
      price: "From $2.49/hr",
      color: "text-accent-green",
      bg: "bg-accent-green/10",
      borderHover: "hover:border-accent-green/40",
    },
    {
      name: "H200",
      spec: "141GB SXM",
      price: "From $3.99/hr",
      color: "text-brand-400",
      bg: "bg-brand-400/10",
      borderHover: "hover:border-brand-400/40",
    },
    {
      name: "B200",
      spec: "192GB SXM",
      price: "From $4.99/hr",
      color: "text-accent-purple",
      bg: "bg-accent-purple/10",
      borderHover: "hover:border-accent-purple/40",
    },
  ];

  const checklist = [
    {
      label: "Add SSH key",
      done: false,
      href: "/dashboard/settings",
    },
    {
      label: "Add credits",
      done: stats.creditsBalance > 0,
      href: "/dashboard/billing",
    },
    {
      label: "Launch first instance",
      done: stats.totalGpuHours > 0,
      href: "/dashboard/instances/new",
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* Welcome card */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-xl border border-surface-800 bg-gradient-to-br from-surface-900 via-surface-900 to-brand-600/10 p-8"
      >
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-600/5 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-400" />
            <h2 className="text-2xl font-bold text-white">
              Welcome to Wollnut Labs
            </h2>
          </div>
          <p className="mt-2 max-w-lg text-sm text-surface-400">
            Your on-demand GPU cloud for AI and ML workloads. Get started in
            three simple steps — you can be running your first training job in
            under 60 seconds.
          </p>
        </div>
      </motion.div>

      {/* Quick start guide — 3 steps */}
      <motion.div variants={fadeUp}>
        <h3 className="mb-3 text-sm font-semibold text-surface-300">
          Quick Start
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickStartSteps.map((step, i) => (
            <Link
              key={step.title}
              href={step.href}
              className="group rounded-xl border border-surface-800 bg-surface-900 p-5 transition-all hover:border-surface-700 hover:bg-surface-900/80"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${step.bg}`}>
                  <step.icon className={`h-5 w-5 ${step.color}`} />
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-800 text-xs font-bold text-surface-400">
                  {i + 1}
                </span>
              </div>
              <p className="mt-3 font-semibold text-white">{step.title}</p>
              <p className="mt-1 text-xs text-surface-500">
                {step.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
                Get started <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Featured GPU quick-launch */}
      <motion.div variants={fadeUp}>
        <h3 className="mb-3 text-sm font-semibold text-surface-300">
          Featured GPUs
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featuredGpus.map((gpu) => (
            <Link
              key={gpu.name}
              href={`/dashboard/instances/new?gpu=${gpu.name}`}
              className={`group flex items-center gap-4 rounded-xl border border-surface-800 bg-surface-900 p-4 transition-all ${gpu.borderHover}`}
            >
              <div className={`rounded-lg p-3 ${gpu.bg}`}>
                <Zap className={`h-5 w-5 ${gpu.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">NVIDIA {gpu.name}</p>
                <p className="text-xs text-surface-500">{gpu.spec}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-surface-300">
                  {gpu.price}
                </p>
                <ArrowRight className="ml-auto mt-1 h-3.5 w-3.5 text-surface-600 transition-colors group-hover:text-brand-400" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Getting Started checklist */}
      <motion.div variants={fadeUp}>
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h3 className="text-sm font-semibold text-white">
            Getting Started Checklist
          </h3>
          <p className="mt-1 text-xs text-surface-500">
            Complete these steps to get the most out of Wollnut
          </p>
          <div className="mt-4 space-y-3">
            {checklist.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-800"
              >
                {item.done ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent-green" />
                ) : (
                  <Circle className="h-5 w-5 flex-shrink-0 text-surface-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    item.done
                      ? "text-surface-500 line-through"
                      : "text-surface-200"
                  }`}
                >
                  {item.label}
                </span>
                {!item.done && (
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-surface-600" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Detect if user is "new" (no usage data) ── */
function isNewUser(stats: {
  activeInstances: number;
  monthSpend: number;
  totalGpuHours: number;
  recentTransactions: unknown[];
  dailyUsage: { cost: number }[];
}): boolean {
  return (
    stats.activeInstances === 0 &&
    stats.totalGpuHours === 0 &&
    stats.monthSpend === 0 &&
    stats.recentTransactions.length === 0 &&
    stats.dailyUsage.every((d) => d.cost === 0)
  );
}

/* ── Main dashboard page ───────────────────── */
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

  const showWelcome = isNewUser(stats);

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

      {showWelcome ? (
        /* ── New-user welcome experience ─── */
        <WelcomeSection stats={stats} />
      ) : (
        /* ── Normal dashboard with data ──── */
        <>
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
        </>
      )}
    </div>
  );
}
