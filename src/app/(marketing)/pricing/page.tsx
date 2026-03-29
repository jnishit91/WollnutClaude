"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Bell, Calculator } from "lucide-react";
import { usePlans, type GPUPlanData } from "@/lib/hooks/use-plans";
import { Spinner } from "@/components/shared/Spinner";

const GPU_GEN: Record<string, string> = {
  B200: "NVIDIA Blackwell",
  H200: "NVIDIA Hopper",
  H100: "NVIDIA Hopper",
  A100: "NVIDIA Ampere",
  L40S: "NVIDIA Ada Lovelace",
  A6000: "NVIDIA Ampere",
  RTX: "NVIDIA Ada Lovelace",
};

function getGen(name: string) {
  const key = Object.keys(GPU_GEN).find((k) => name.includes(k));
  return key ? GPU_GEN[key] : "NVIDIA";
}

function GPUTable({ plans, unit }: { plans: GPUPlanData[]; unit: "hour" | "minute" }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">GPU Type</th>
            <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 lg:table-cell">Generation</th>
            <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">VRAM</th>
            <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">RAM</th>
            <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">vCPUs</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              {unit === "hour" ? "$/hour" : "$/min"}
            </th>
            <th className="px-3 py-3.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {plans.map((plan, i) => {
            const price = unit === "hour" ? plan.wollnutPricePerHour : plan.wollnutPricePerMinute;
            return (
              <motion.tr
                key={plan.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`group transition-colors hover:bg-white/5 ${!plan.available ? "opacity-40" : ""}`}
              >
                <td className="px-5 py-4 font-medium text-white">{plan.gpuName}</td>
                <td className="hidden px-5 py-4 text-gray-400 lg:table-cell">{getGen(plan.gpuName)}</td>
                <td className="hidden px-5 py-4 text-gray-300 sm:table-cell">{plan.vram}</td>
                <td className="hidden px-5 py-4 text-gray-300 md:table-cell">{plan.ram}</td>
                <td className="hidden px-5 py-4 text-gray-300 md:table-cell">{plan.vcpus}</td>
                <td className="px-5 py-4 text-right font-semibold text-white">
                  ${price.toFixed(unit === "minute" ? 4 : 2)}
                </td>
                <td className="px-3 py-4">
                  {plan.available ? (
                    <Link
                      href="/auth/signup"
                      className="invisible rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 group-hover:visible"
                    >
                      Start
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-600">Sold out</span>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function PricingPage() {
  const { data: plans, isLoading } = usePlans();
  const [unit, setUnit] = useState<"hour" | "minute">("hour");
  const all = plans ?? [];

  // ── Live Availability mock data ──
  const [availability] = useState([
    { gpu: "H100 SXM 80GB", available: 14, total: 20, price: 225 },
    { gpu: "H200 SXM 141GB", available: 8, total: 20, price: 350 },
    { gpu: "A100 SXM 80GB", available: 22, total: 30, price: 140 },
    { gpu: "L4 24GB", available: 32, total: 40, price: 55 },
    { gpu: "B200 SXM", available: 0, total: 10, price: 500 },
  ]);

  // ── Cost Calculator state ──
  const [calcGpu, setCalcGpu] = useState("H100");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerMonth, setDaysPerMonth] = useState(22);
  const [gpuCount, setGpuCount] = useState(1);
  const [reserved, setReserved] = useState(false);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const gpuPrices: Record<string, { wollnut: number; aws: number; e2e: number }> = {
    H100: { wollnut: 225, aws: 400, e2e: 280 },
    H200: { wollnut: 350, aws: 550, e2e: 420 },
    B200: { wollnut: 500, aws: 750, e2e: 600 },
    L4: { wollnut: 55, aws: 95, e2e: 70 },
  };

  const calcPrices = (gpuPrices[calcGpu] ?? gpuPrices.H100) as { wollnut: number; aws: number; e2e: number };
  const reservedDiscount = reserved ? 0.7 : 1;
  const totalHours = hoursPerDay * daysPerMonth * gpuCount;
  const wollnutCost = totalHours * calcPrices.wollnut * reservedDiscount;
  const awsCost = totalHours * calcPrices.aws;
  const e2eCost = totalHours * calcPrices.e2e;
  const savings = awsCost - wollnutCost;
  const usdRate = 85;
  const fmt = (v: number) =>
    currency === "INR" ? `₹${v.toLocaleString("en-IN")}` : `$${Math.round(v / usdRate).toLocaleString()}`;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="border-b border-white/10 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl px-4">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            <Zap className="h-3 w-3" /> Minute-level billing — stop waste
          </div>
          <h1 className="text-5xl font-bold tracking-tight">GPU Pricing</h1>
          <p className="mt-4 text-lg text-gray-400">
            Spin up managed workbenches or raw VMs in under 60 seconds — billed to the minute, no commitments.
          </p>
          <p className="mt-2 text-sm text-gray-500">Prices shown per GPU · Up to 8 GPUs per instance</p>

          <div className="mt-8 inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
            <button onClick={() => setUnit("hour")} className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${unit === "hour" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}>
              Per Hour
            </button>
            <button onClick={() => setUnit("minute")} className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${unit === "minute" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}>
              Per Minute
            </button>
          </div>
        </motion.div>
      </section>

      {/* Tables */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>
        ) : all.length > 0 ? (
          <div className="space-y-14">
            <div>
              <h2 className="mb-1 text-xl font-semibold">Managed Workbench Instances</h2>
              <p className="mb-5 text-sm text-gray-400">Pre-built stacks: JupyterLab, VS Code, API endpoint & SSH included</p>
              <GPUTable plans={all} unit={unit} />
            </div>
            <div>
              <h2 className="mb-1 text-xl font-semibold">On-Demand VMs</h2>
              <p className="mb-5 text-sm text-gray-400">Raw VM access with full root control. Same pricing, more flexibility.</p>
              <GPUTable plans={all} unit={unit} />
              <p className="mt-3 text-xs text-gray-600">
                Storage billed separately at ₹0.10/GB/hour ·{" "}
                <Link href="/contact" className="text-indigo-400 hover:underline">Contact us</Link> for 25+ GPUs or multi-month reservations
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 py-20 text-center">
            <p className="text-gray-400">GPU plans will appear here once your E2E Networks API is connected.</p>
            <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Live GPU Availability */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" /> Live Availability
            </div>
            <h2 className="text-3xl font-bold">GPU Stock — Right Now</h2>
            <p className="mt-3 text-sm text-gray-400">
              Real-time availability across our fleet. Auto-refreshes every 30 seconds.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {availability.map((gpu) => {
              const pct = (gpu.available / gpu.total) * 100;
              const status = gpu.available === 0 ? "red" : gpu.available < 5 ? "yellow" : "green";
              const statusColor = { green: "bg-green-500", yellow: "bg-yellow-500", red: "bg-red-500" }[status];
              const barColor = { green: "bg-green-500/60", yellow: "bg-yellow-500/60", red: "bg-red-500/60" }[status];
              return (
                <div key={gpu.gpu} className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 px-5 py-3.5">
                  <div className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${statusColor}`} />
                  <div className="min-w-[160px] text-sm font-medium text-white">{gpu.gpu}</div>
                  <div className="flex-1">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="min-w-[100px] text-right text-sm">
                    {gpu.available > 0 ? (
                      <span className="text-gray-300">{gpu.available} available</span>
                    ) : (
                      <span className="text-red-400">Sold out</span>
                    )}
                  </div>
                  <div className="min-w-[80px] text-right text-sm font-semibold text-white">₹{gpu.price}/hr</div>
                  <div className="min-w-[100px] text-right">
                    {gpu.available > 0 ? (
                      <Link
                        href="/auth/signup"
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        Launch Now
                      </Link>
                    ) : (
                      <button className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white">
                        <Bell className="h-3 w-3" /> Notify Me
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-gray-600">
            Availability is indicative and updates in real time. GPUs are allocated on a first-come basis.
          </p>
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              <Calculator className="h-3 w-3" /> Cost Calculator
            </div>
            <h2 className="text-3xl font-bold">Estimate Your Monthly Cost</h2>
            <p className="mt-3 text-sm text-gray-400">
              Configure your workload and see how much you save vs AWS and E2E Networks.
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">GPU Type</label>
                <select
                  value={calcGpu}
                  onChange={(e) => setCalcGpu(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-gray-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  {Object.keys(gpuPrices).map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Number of GPUs</label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={gpuCount}
                  onChange={(e) => setGpuCount(Number(e.target.value))}
                  className="mt-2 w-full accent-indigo-600"
                />
                <div className="mt-1 text-right text-sm text-gray-400">{gpuCount} GPU{gpuCount > 1 ? "s" : ""}</div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Hours per Day</label>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="mt-1 text-right text-sm text-gray-400">{hoursPerDay}h / day</div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Days per Month</label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={daysPerMonth}
                  onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="mt-1 text-right text-sm text-gray-400">{daysPerMonth} days / month</div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={reserved}
                    onChange={(e) => setReserved(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 accent-indigo-600"
                  />
                  Reserved (30% off)
                </label>
              </div>
              <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5">
                <button onClick={() => setCurrency("INR")} className={`rounded-md px-3 py-1 text-xs font-medium ${currency === "INR" ? "bg-indigo-600 text-white" : "text-gray-400"}`}>
                  INR
                </button>
                <button onClick={() => setCurrency("USD")} className={`rounded-md px-3 py-1 text-xs font-medium ${currency === "USD" ? "bg-indigo-600 text-white" : "text-gray-400"}`}>
                  USD
                </button>
              </div>
            </div>
            {/* Results */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Wollnut</p>
                <p className="mt-2 text-2xl font-bold text-white">{fmt(wollnutCost)}</p>
                <p className="text-xs text-gray-500">/month</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">AWS</p>
                <p className="mt-2 text-2xl font-bold text-gray-400 line-through">{fmt(awsCost)}</p>
                <p className="text-xs text-gray-500">/month</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">E2E Networks</p>
                <p className="mt-2 text-2xl font-bold text-gray-400 line-through">{fmt(e2eCost)}</p>
                <p className="text-xs text-gray-500">/month</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 text-center">
              <span className="text-sm font-semibold text-green-400">
                You save {fmt(savings)}/month with Wollnut vs AWS
              </span>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Start with ₹500 Free Credit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Included */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold">Everything included. No add-ons.</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {["SSH & full root access", "Pre-built ML templates", "Persistent volume storage", "REST API access", "Real-time monitoring", "Per-minute billing", "Up to 8 GPUs per instance", "InfiniBand on select nodes", "$5 free credits on signup"].map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left">
                <Check className="h-4 w-4 flex-shrink-0 text-green-400" />
                <span className="text-sm text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-16 text-center">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="text-2xl font-bold">Start with $5 free credits</h2>
          <p className="mt-3 text-gray-400">No credit card required. New accounts get $5 automatically.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth/signup" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/developers" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-semibold text-gray-300 hover:border-white/30 hover:text-white">
              View API Docs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
