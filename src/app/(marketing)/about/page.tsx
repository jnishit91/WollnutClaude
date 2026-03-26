"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Shield, Clock, Globe, ArrowRight } from "lucide-react";

const VALUES = [
  {
    icon: Zap,
    title: "Instant Access",
    description:
      "No sales calls. No procurement. Sign up, add credits, and deploy GPUs in under a minute.",
  },
  {
    icon: Clock,
    title: "Fair Billing",
    description:
      "Per-minute billing with no minimums. You only pay for the compute you actually use.",
  },
  {
    icon: Shield,
    title: "Enterprise Grade",
    description:
      "NVIDIA H100, H200, and B200 GPUs with InfiniBand — the same hardware powering frontier AI labs.",
  },
  {
    icon: Globe,
    title: "Open Ecosystem",
    description:
      "Full REST API, pre-configured templates, and one-click model deployment. Build however you want.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-surface-800/50">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              About Wollnut Labs
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-surface-400">
              We&apos;re building the simplest way to access enterprise GPUs.
              Our mission is to democratize AI infrastructure so every team —
              from solo researchers to large enterprises — can train and deploy
              models without friction.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-20">
        {/* Story */}
        <section>
          <h2 className="text-2xl font-bold text-white">Our Story</h2>
          <div className="mt-6 space-y-4 text-surface-300 leading-relaxed">
            <p>
              Wollnut Labs was born from a simple frustration: getting access to
              high-end GPUs for ML work shouldn&apos;t require enterprise contracts,
              week-long procurement processes, or hourly billing that penalizes
              experimentation.
            </p>
            <p>
              We partnered with E2E Networks to provide direct access to NVIDIA&apos;s
              latest datacenter GPUs — H100, H200, and B200 — through a modern
              platform with per-minute billing, pre-configured templates, and a
              full REST API.
            </p>
            <p>
              Whether you&apos;re fine-tuning a 7B model for a weekend project or
              running distributed training across 8x H200s, Wollnut Labs gives
              you the compute you need, when you need it.
            </p>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="mb-8 text-2xl font-bold text-white">What We Believe</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-surface-800 bg-surface-900 p-6"
              >
                <v.icon className="h-6 w-6 text-brand-400" />
                <h3 className="mt-3 font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-surface-400">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-8 text-center">
          <h3 className="text-xl font-bold text-white">Ready to build?</h3>
          <p className="mt-2 text-surface-400">
            Sign up free and get $5 in GPU credits to get started.
          </p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
