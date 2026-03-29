"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, Minus } from "lucide-react";

export interface ComparisonFeature {
  category: string;
  features: {
    name: string;
    wollnut: boolean | string;
    competitor: boolean | string;
  }[];
}

export interface ComparisonPageProps {
  competitorName: string;
  competitorDescription: string;
  tagline: string;
  features: ComparisonFeature[];
  pricingExample: {
    workload: string;
    wollnutCost: string;
    competitorCost: string;
    savings: string;
  };
  advantages: string[];
}

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-gray-300">{value}</span>;
  }
  return value ? (
    <Check className="h-4 w-4 text-green-400" />
  ) : (
    <X className="h-4 w-4 text-gray-600" />
  );
}

export function ComparisonPage({
  competitorName,
  competitorDescription,
  tagline,
  features,
  pricingExample,
  advantages,
}: ComparisonPageProps) {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="border-b border-white/10 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl px-4"
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            Comparison
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Wollnut vs {competitorName}
          </h1>
          <p className="mt-4 text-lg text-gray-400">{tagline}</p>
          <p className="mt-2 text-sm text-gray-500">{competitorDescription}</p>
        </motion.div>
      </section>

      {/* Feature Comparison Table */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold">Feature-by-Feature Comparison</h2>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Feature</th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-indigo-400">Wollnut</th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">{competitorName}</th>
              </tr>
            </thead>
            <tbody>
              {features.map((group) => (
                <tbody key={group.category}>
                  <tr className="border-t border-white/10 bg-white/[0.02]">
                    <td colSpan={3} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                      {group.category}
                    </td>
                  </tr>
                  {group.features.map((f) => (
                    <tr key={f.name} className="border-t border-white/5 transition-colors hover:bg-white/5">
                      <td className="px-5 py-3 text-gray-300">{f.name}</td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex justify-center"><FeatureCell value={f.wollnut} /></div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex justify-center"><FeatureCell value={f.competitor} /></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-center text-xs text-gray-600">
          Comparison based on publicly available information. Last updated March 2026.
        </p>
      </section>

      {/* Pricing Example */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold">Real-World Pricing Example</h2>
          <p className="mt-3 text-sm text-gray-400">{pricingExample.workload}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Wollnut</p>
              <p className="mt-2 text-3xl font-bold">{pricingExample.wollnutCost}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{competitorName}</p>
              <p className="mt-2 text-3xl font-bold text-gray-400 line-through">{pricingExample.competitorCost}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3">
            <span className="text-sm font-semibold text-green-400">
              You save {pricingExample.savings} with Wollnut
            </span>
          </div>
        </div>
      </section>

      {/* Wollnut Advantages */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold">Why Developers Choose Wollnut</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {advantages.map((adv) => (
              <div key={adv} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left">
                <Check className="h-4 w-4 flex-shrink-0 text-green-400" />
                <span className="text-sm text-gray-300">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-16 text-center">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="text-2xl font-bold">Try Wollnut Free</h2>
          <p className="mt-3 text-gray-400">
            Start with ₹500 free credit. No credit card required.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-semibold text-gray-300 hover:border-white/30 hover:text-white"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
