"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Zap } from "lucide-react";
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
