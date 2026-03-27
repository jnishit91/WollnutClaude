"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight, Cpu, Clock, Users, Activity, Shield } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { usePlans } from "@/lib/hooks/use-plans";
import { Spinner } from "@/components/shared/Spinner";

const GPU_TIER_COLORS: Record<string, string> = {
  B200: "text-emerald-400",
  H200: "text-violet-400",
  H100: "text-blue-400",
  A100: "text-cyan-400",
  L40S: "text-amber-400",
};

const GPU_TIER_DOT: Record<string, string> = {
  B200: "bg-emerald-400",
  H200: "bg-violet-400",
  H100: "bg-blue-400",
  A100: "bg-cyan-400",
  L40S: "bg-amber-400",
};

const PLATFORM_FEATURES = [
  "Per-minute billing — stop paying for idle time",
  "SSH & full root access",
  "Pre-built ML environment templates",
  "Persistent volume storage",
  "REST API for programmatic control",
  "Real-time usage monitoring",
  "Launch up to 8 GPUs per instance",
  "InfiniBand networking on HPC nodes",
];

const TRUST_STATS = [
  { label: "Developers", value: "10,000+", icon: Users },
  { label: "GPU Hours Served", value: "1M+", icon: Activity },
  { label: "Uptime", value: "99.9%", icon: Shield },
  { label: "Deploy Time", value: "<60s", icon: Zap },
];

function getShortName(gpuName: string): string {
  return gpuName.replace("NVIDIA ", "").replace("GPU", "").trim();
}

function getTierKey(gpuName: string): string {
  const keys = ["B200", "H200", "H100", "A100", "L40S"];
  return keys.find((k) => gpuName.includes(k)) ?? "";
}

export default function PricingPage() {
  const { data: plans, isLoading } = usePlans();
  const [billingUnit, setBillingUnit] = useState<"hour" | "minute">("hour");

  const availablePlans = plans?.filter((p) => p.available) ?? [];
  const allPlans = plans ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-950">
        {/* Hero */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl px-4"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-5 text-lg text-surface-400">
              Spin up enterprise GPUs in under 60 seconds.{" "}
              <span className="text-white font-medium">Pay by the minute</span> — stop waste.
            </p>

            {/* Trust stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
              {TRUST_STATS.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-brand-400" />
                  <span className="text-sm font-semibold text-white">{value}</span>
                  <span className="text-sm text-surface-500">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* GPU Table */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                GPU Instances
              </h2>
              <p className="mt-1 text-sm text-surface-400">
                Managed workbench + raw VM access. All plans include SSH, API, and pre-built templates.
              </p>
            </div>
            {/* Billing toggle */}
            <div className="inline-flex self-start rounded-lg border border-surface-700 bg-surface-900 p-1 sm:self-auto">
              <button
                onClick={() => setBillingUnit("hour")}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  billingUnit === "hour"
                    ? "bg-brand-600 text-white"
                    : "text-surface-400 hover:text-white"
                }`}
              >
                Per Hour
              </button>
              <button
                onClick={() => setBillingUnit("minute")}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  billingUnit === "minute"
                    ? "bg-brand-600 text-white"
                    : "text-surface-400 hover:text-white"
                }`}
              >
                Per Minute
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : allPlans.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-surface-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-800 bg-surface-900/80">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-400">
                      GPU
                    </th>
                    <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-400 sm:table-cell">
                      VRAM
                    </th>
                    <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-400 md:table-cell">
                      vCPUs
                    </th>
                    <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-400 lg:table-cell">
                      RAM
                    </th>
                    <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-400 lg:table-cell">
                      Storage
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-surface-400">
                      {billingUnit === "hour" ? "$/hour" : "$/min"}
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-surface-400">
                      &nbsp;
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800/60 bg-surface-950">
                  {allPlans.map((plan, i) => {
                    const shortName = getShortName(plan.gpuName);
                    const tierKey = getTierKey(plan.gpuName);
                    const colorClass = GPU_TIER_COLORS[tierKey] ?? "text-white";
                    const dotClass = GPU_TIER_DOT[tierKey] ?? "bg-surface-400";
                    const price =
                      billingUnit === "hour"
                        ? plan.wollnutPricePerHour
                        : plan.wollnutPricePerMinute;

                    return (
                      <motion.tr
                        key={plan.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className={`group transition-colors hover:bg-surface-900/60 ${
                          !plan.available ? "opacity-50" : ""
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className={`h-2 w-2 flex-shrink-0 rounded-full ${dotClass}`} />
                            <span className={`font-semibold ${colorClass}`}>
                              {shortName}
                            </span>
                            {plan.infiniband && (
                              <span className="hidden rounded bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-400 sm:inline">
                                IB
                              </span>
                            )}
                            {!plan.available && (
                              <span className="rounded bg-surface-800 px-1.5 py-0.5 text-[10px] text-surface-500">
                                Sold out
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="hidden px-5 py-4 text-surface-300 sm:table-cell">
                          {plan.vram}
                        </td>
                        <td className="hidden px-5 py-4 text-surface-300 md:table-cell">
                          {plan.vcpus}
                        </td>
                        <td className="hidden px-5 py-4 text-surface-300 lg:table-cell">
                          {plan.ram}
                        </td>
                        <td className="hidden px-5 py-4 text-surface-300 lg:table-cell">
                          {plan.storage}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="font-semibold text-white">
                            ${price.toFixed(billingUnit === "minute" ? 4 : 2)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {plan.available ? (
                            <Link
                              href="/dashboard/instances/new"
                              className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-brand-700"
                            >
                              Deploy <ArrowRight className="h-3 w-3" />
                            </Link>
                          ) : (
                            <span className="text-xs text-surface-600">—</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-surface-800 bg-surface-900 py-20 text-center">
              <Cpu className="mx-auto h-12 w-12 text-surface-600" />
              <h3 className="mt-4 text-lg font-medium text-white">
                GPU plans loading…
              </h3>
              <p className="mt-1 text-sm text-surface-400">
                Connect your E2E Networks API key to see live pricing.
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          <p className="mt-4 text-xs text-surface-500">
            * Storage is billed separately at ₹0.10/GB/hour.{" "}
            <Link href="/developers" className="underline hover:text-surface-300">
              View full API docs
            </Link>
          </p>
        </section>

        {/* What's Included */}
        <section className="border-y border-surface-800/50 bg-surface-900/30 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-white">
              Everything included. No hidden add-ons.
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PLATFORM_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-lg border border-surface-800 bg-surface-900 px-4 py-3"
                >
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-green" />
                  <span className="text-sm text-surface-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-white">
              Up and running in 4 steps
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "Add Credits", desc: "Top up your account with any amount. Start with $5 free." },
                { step: "02", title: "Choose a Template", desc: "Pick a pre-built ML stack — PyTorch, vLLM, ComfyUI, and more." },
                { step: "03", title: "Select GPU", desc: "H100, H200, or B200 — pick the right GPU for your workload." },
                { step: "04", title: "Deploy & SSH", desc: "Instance is live in under 60 seconds. Connect via SSH or browser." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="relative rounded-xl border border-surface-800 bg-surface-900 p-5">
                  <span className="text-4xl font-black text-surface-800">{step}</span>
                  <h3 className="mt-2 font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm text-surface-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-surface-800/50 py-16 text-center">
          <div className="mx-auto max-w-xl px-4">
            <h2 className="text-2xl font-bold text-white">
              Start with $5 free credits
            </h2>
            <p className="mt-3 text-surface-400">
              New accounts get $5 in credits automatically. No credit card required to sign up.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/developers"
                className="inline-flex items-center gap-2 rounded-lg border border-surface-700 px-6 py-3 font-semibold text-surface-300 transition-colors hover:border-surface-500 hover:text-white"
              >
                View API Docs
              </Link>
            </div>
            <p className="mt-4 text-xs text-surface-500">
              Need 25+ GPUs or multi-month reservations?{" "}
              <Link href="/contact" className="text-brand-400 hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
