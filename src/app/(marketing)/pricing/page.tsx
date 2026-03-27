"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Zap,
  Check,
  ArrowRight,
  Sparkles,
  Network,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePlans, type GPUPlanData } from "@/lib/hooks/use-plans";
import { GPU_BADGES, GPU_USE_CASES } from "@/lib/constants/gpu-plans";
import { Spinner } from "@/components/shared/Spinner";

function GPUPricingCard({ plan }: { plan: GPUPlanData }) {
  const badge = GPU_BADGES[plan.gpuShortName];
  const useCases = GPU_USE_CASES[plan.gpuShortName] ?? [];
  const isFlagship = badge?.tier === "flagship";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`gpu-card flex flex-col ${
        isFlagship ? "border-brand-500/30 ring-1 ring-brand-500/10" : ""
      }`}
    >
      {isFlagship && (
        <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{plan.gpuName}</h3>
            {isFlagship && (
              <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-400">
                FLAGSHIP
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-surface-400">{plan.vram}</p>
        </div>
        {badge && (
          <div
            className={`rounded-lg bg-gradient-to-r ${badge.gradient} px-3 py-1 text-xs font-bold text-white`}
          >
            {plan.gpuShortName}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">
          ${plan.wollnutPricePerHour.toFixed(2)}
        </span>
        <span className="text-sm text-surface-400">/hr</span>
      </div>
      <p className="mt-0.5 text-xs text-surface-500">
        ${plan.wollnutPricePerMinute.toFixed(4)}/min — billed per minute
      </p>

      {/* Specs */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Cpu className="h-4 w-4 text-surface-500" />
          <span className="text-surface-300">{plan.vcpus} vCPUs</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MemoryStick className="h-4 w-4 text-surface-500" />
          <span className="text-surface-300">{plan.ram} RAM</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <HardDrive className="h-4 w-4 text-surface-500" />
          <span className="text-surface-300">{plan.storage}</span>
        </div>
        {plan.infiniband && (
          <div className="flex items-center gap-2 text-sm">
            <Network className="h-4 w-4 text-surface-500" />
            <span className="text-surface-300">{plan.infiniband}</span>
          </div>
        )}
      </div>

      {/* Use cases */}
      {useCases.length > 0 && (
        <div className="mt-5 space-y-2 border-t border-surface-800 pt-4">
          {useCases.map((uc) => (
            <div
              key={uc}
              className="flex items-start gap-2 text-sm text-surface-400"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" />
              {uc}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-5">
        <Link
          href="/dashboard/instances/new"
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            isFlagship
              ? "bg-brand-600 text-white hover:bg-brand-700"
              : "border border-surface-700 text-surface-300 hover:border-surface-600 hover:text-white"
          }`}
        >
          Deploy Now
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

const FAQ_ITEMS = [
  {
    q: "How does per-minute billing work?",
    a: "You're billed by the minute for the time your GPU instance is running. When you stop or delete an instance, billing stops immediately. No minimum commitment required.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, credit/debit cards, net banking, and wallets via Razorpay. You top up your credit balance and usage is deducted from it automatically.",
  },
  {
    q: "Can I switch GPU types?",
    a: "You can launch instances on any available GPU type. To switch, simply stop the current instance and create a new one with a different GPU. Your data persists on attached volumes.",
  },
  {
    q: "What happens if my credits run out?",
    a: "If your balance reaches zero, running instances are automatically stopped to prevent unexpected charges. You'll receive a low-balance warning beforehand.",
  },
  {
    q: "Is there a minimum top-up amount?",
    a: "The minimum credit top-up is $5. There is no minimum commitment or monthly fee — you only pay for what you use.",
  },
  {
    q: "Do you offer volume discounts?",
    a: "For high-volume usage or reserved instances, contact our sales team for custom pricing. We offer significant discounts for committed usage.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-surface-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-surface-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-surface-400" />
        )}
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-surface-400">{a}</p>
      )}
    </div>
  );
}

export default function PricingPage() {
  const { data: plans, isLoading } = usePlans();

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-surface-800/50">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-sm text-brand-400">
              <Sparkles className="h-4 w-4" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              GPU Cloud Pricing
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-400">
              Pay per minute. No commitments, no hidden fees. Deploy H100, H200,
              and B200 GPUs on-demand.
            </p>
          </motion.div>

          {/* Highlights */}
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-6">
            {[
              { icon: Zap, text: "Per-minute billing" },
              { icon: Check, text: "No minimum commitment" },
              { icon: Check, text: "Auto-stop on zero balance" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-sm text-surface-300"
              >
                <Icon className="h-4 w-4 text-accent-green" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Available GPUs
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <GPUPricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-surface-400">
            No GPU plans available at the moment.
          </p>
        )}

        {/* Comparison table */}
        {plans && plans.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-center text-2xl font-bold text-white">
              Full Comparison
            </h2>
            <div className="overflow-x-auto rounded-xl border border-surface-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-800 bg-surface-900/50">
                    <th className="px-4 py-3 text-left font-medium text-surface-400">
                      GPU
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-surface-400">
                      VRAM
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-surface-400">
                      vCPUs
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-surface-400">
                      RAM
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-surface-400">
                      Storage
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-surface-400">
                      Interconnect
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-surface-400">
                      $/hr
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-surface-400">
                      $/min
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr
                      key={plan.id}
                      className="border-b border-surface-800/50 transition-colors hover:bg-surface-900/30"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {plan.gpuName}
                      </td>
                      <td className="px-4 py-3 text-surface-300">
                        {plan.vram}
                      </td>
                      <td className="px-4 py-3 text-surface-300">
                        {plan.vcpus}
                      </td>
                      <td className="px-4 py-3 text-surface-300">
                        {plan.ram}
                      </td>
                      <td className="px-4 py-3 text-surface-300">
                        {plan.storage}
                      </td>
                      <td className="px-4 py-3 text-surface-300">
                        {plan.infiniband ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-white">
                        ${plan.wollnutPricePerHour.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-surface-400">
                        ${plan.wollnutPricePerMinute.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <div className="rounded-xl border border-surface-800 bg-surface-900/50 px-6">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mt-2 text-surface-400">
            Sign up and get $5 in free credits to try any GPU.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-surface-700 px-6 py-3 text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-white"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
