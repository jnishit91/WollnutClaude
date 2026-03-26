"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  ArrowRight,
  Zap,
  Clock,
  Shield,
  Code,
  Server,
  CreditCard,
  Terminal,
  ChevronRight,
} from "lucide-react";

const HERO_GPUS = [
  { name: "H100", vram: "80 GB", badge: "Popular" },
  { name: "H200", vram: "141 GB", badge: "" },
  { name: "B200", vram: "192 GB", badge: "New" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Deploy in Under 60 Seconds",
    description:
      "No sales calls, no procurement. Sign up, add credits, and launch a GPU instance instantly.",
  },
  {
    icon: Clock,
    title: "Per-Minute Billing",
    description:
      "Pay only for what you use. No hourly minimums, no long-term commitments. Stop anytime.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Hardware",
    description:
      "NVIDIA H100, H200, and B200 GPUs with InfiniBand networking. The same hardware powering frontier AI labs.",
  },
  {
    icon: Code,
    title: "Full REST API",
    description:
      "Manage instances programmatically. Create, start, stop, and destroy GPUs via our comprehensive API.",
  },
  {
    icon: Server,
    title: "Pre-Configured Templates",
    description:
      "Launch with PyTorch, TensorFlow, vLLM, or Ollama pre-installed. Ready for work in seconds.",
  },
  {
    icon: CreditCard,
    title: "Simple Credit System",
    description:
      "Add credits via Razorpay. Auto-recharge when your balance runs low. Full billing transparency.",
  },
];

const GPU_TIERS = [
  {
    gpu: "H100 SXM",
    vram: "80 GB",
    price: "$2.49",
    gradient: "from-blue-500 to-indigo-600",
    useCases: ["LLM fine-tuning", "Inference at scale", "Distributed training"],
  },
  {
    gpu: "H200 SXM",
    vram: "141 GB",
    price: "$3.99",
    gradient: "from-violet-500 to-purple-600",
    popular: true,
    useCases: [
      "Large LLM training",
      "High-throughput inference",
      "Multi-modal models",
    ],
  },
  {
    gpu: "B200 SXM",
    vram: "192 GB",
    price: "$5.49",
    gradient: "from-emerald-500 to-teal-600",
    useCases: [
      "Frontier model training",
      "Trillion-parameter models",
      "Massive-scale inference",
    ],
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create an Account",
    description: "Sign up with Google, GitHub, or email. Takes 30 seconds.",
  },
  {
    step: "02",
    title: "Add Credits",
    description: "Purchase credits via Razorpay. Start with as little as $5.",
  },
  {
    step: "03",
    title: "Launch a GPU",
    description:
      "Pick a plan, choose a template, and deploy. Your instance is ready in under a minute.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ───────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-600/5 via-transparent to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-32">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              {...fadeUp}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
                <span className="text-xs font-medium text-brand-400">
                  All systems operational
                </span>
                <ChevronRight className="h-3 w-3 text-brand-400" />
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Enterprise GPUs.{" "}
                <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                  On Demand.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-400">
                Deploy NVIDIA H100, H200, and B200 GPUs in under a minute.
                Per-minute billing. No contracts. Full API access. Built for
                teams that ship.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-700 hover:shadow-glow-lg"
                >
                  Start Free — $5 Credit
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="flex items-center gap-2 rounded-lg border border-surface-700 px-6 py-3 text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-white"
                >
                  <Terminal className="h-4 w-4" />
                  View API Docs
                </Link>
              </div>
            </motion.div>

            {/* GPU chips */}
            <motion.div
              className="mx-auto mt-16 flex max-w-lg justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {HERO_GPUS.map((g) => (
                <div
                  key={g.name}
                  className="gpu-card relative flex flex-col items-center rounded-xl border border-surface-800 bg-surface-900 px-6 py-4"
                >
                  {g.badge && (
                    <span className="absolute -top-2.5 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      {g.badge}
                    </span>
                  )}
                  <span className="text-lg font-bold text-white">{g.name}</span>
                  <span className="text-xs text-surface-400">{g.vram} HBM3e</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Features ──────────────────────── */}
        <section className="border-t border-surface-800/50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Everything you need to train and deploy
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-surface-400">
                From solo researchers to enterprise teams, Wollnut Labs gives
                you frictionless access to the best AI hardware.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="rounded-xl border border-surface-800 bg-surface-900 p-6 transition-colors hover:border-surface-700"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10">
                    <f.icon className="h-5 w-5 text-brand-400" />
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-surface-400">
                    {f.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GPU Pricing Preview ───────────── */}
        <section className="border-t border-surface-800/50 bg-surface-900/30 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-surface-400">
                Per-hour pricing with per-minute billing granularity. No hidden
                fees. No commitments.
              </p>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {GPU_TIERS.map((tier) => (
                <div
                  key={tier.gpu}
                  className={`relative rounded-xl border bg-surface-900 p-6 ${
                    tier.popular
                      ? "border-brand-500/40 shadow-glow"
                      : "border-surface-800"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                      Most Popular
                    </span>
                  )}

                  <div
                    className={`inline-flex rounded-lg bg-gradient-to-r ${tier.gradient} px-3 py-1 text-xs font-bold text-white`}
                  >
                    {tier.gpu}
                  </div>

                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">
                      {tier.price}
                    </span>
                    <span className="text-surface-400">/hr per GPU</span>
                  </div>

                  <p className="mt-1 text-sm text-surface-500">
                    {tier.vram} HBM3e VRAM
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {tier.useCases.map((uc) => (
                      <li
                        key={uc}
                        className="flex items-center gap-2 text-sm text-surface-300"
                      >
                        <span className="h-1 w-1 rounded-full bg-brand-400" />
                        {uc}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/pricing"
                    className={`mt-6 block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                      tier.popular
                        ? "bg-brand-600 text-white hover:bg-brand-700"
                        : "border border-surface-700 text-surface-300 hover:border-surface-600 hover:text-white"
                    }`}
                  >
                    View All Plans
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────── */}
        <section className="border-t border-surface-800/50 py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Up and running in 3 steps
              </h2>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand-500/30 bg-brand-500/10 text-sm font-bold text-brand-400">
                    {s.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-surface-400">
                    {s.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────── */}
        <section className="border-t border-surface-800/50 py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to build?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-surface-400">
              Sign up for free and get $5 in GPU credits. No credit card
              required to create an account.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-700 hover:shadow-glow-lg"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-surface-700 px-8 py-3.5 text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-white"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
