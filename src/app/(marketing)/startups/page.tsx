"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  ArrowRight,
  Check,
  Sparkles,
  TrendingUp,
  Building2,
  GraduationCap,
  Zap,
  Send,
} from "lucide-react";

const TIERS = [
  {
    name: "Seed",
    credits: "₹50,000",
    validity: "3 months",
    color: "border-green-500/30 bg-green-500/5",
    badge: "bg-green-500/10 text-green-400",
    icon: GraduationCap,
    requirements: [
      "DPIIT Startup India registration",
      "OR letter from a recognized incubator",
    ],
    includes: [
      "₹50,000 GPU credits",
      "3 months validity",
      "All GPU types available",
      "Community support",
      "50GB free storage",
    ],
  },
  {
    name: "Growth",
    credits: "₹2,00,000",
    validity: "6 months",
    color: "border-indigo-500/30 bg-indigo-500/5",
    badge: "bg-indigo-500/10 text-indigo-400",
    icon: TrendingUp,
    popular: true,
    requirements: [
      "Membership in recognized accelerator",
      "(100x Engineers, Antler, YC, Techstars, T-Hub, NASSCOM 10K)",
      "OR ₹25L+ raised",
    ],
    includes: [
      "₹2,00,000 GPU credits",
      "6 months validity",
      "Priority GPU access",
      "Dedicated Slack channel",
      "200GB free storage",
      "Wollnut Teams (free)",
    ],
  },
  {
    name: "Scale",
    credits: "₹5,00,000",
    validity: "12 months",
    color: "border-amber-500/30 bg-amber-500/5",
    badge: "bg-amber-500/10 text-amber-400",
    icon: Building2,
    requirements: [
      "Series A+ raised",
      "OR ₹1Cr+ annual revenue",
    ],
    includes: [
      "₹5,00,000 GPU credits",
      "12 months validity",
      "Reserved GPU capacity",
      "Dedicated account manager",
      "500GB free storage",
      "Wollnut Teams Pro (free)",
      "Custom SLAs available",
    ],
  },
];

const PARTNERS = [
  "100x Engineers",
  "Antler India",
  "Y Combinator",
  "Techstars",
  "T-Hub",
  "NASSCOM 10K",
  "Startup India",
];

export default function StartupsPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    foundingDate: "",
    teamSize: "",
    description: "",
    gpuUsage: "",
    tier: "growth",
    email: "",
  });

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
            <Sparkles className="h-3 w-3" /> Wollnut for Startups
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Build the Future of AI in India
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Up to ₹5,00,000 in GPU credits for Indian AI startups.
            Build, train, and deploy on enterprise GPUs — free.
          </p>
          <div className="mt-8">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Three Tiers. One Mission.</h2>
          <p className="mt-3 text-gray-400">
            Choose the tier that matches your stage. Apply in under 5 minutes.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-xl border p-6 ${tier.color}`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-semibold text-white">
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-2">
                <tier.icon className="h-5 w-5 text-indigo-400" />
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tier.badge}`}>
                  {tier.name}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">{tier.credits}</span>
                <span className="text-sm text-gray-400"> credits</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{tier.validity} validity</p>

              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Eligibility</p>
                <ul className="mt-2 space-y-1.5">
                  {tier.requirements.map((req) => (
                    <li key={req} className="text-sm text-gray-400">{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Includes</p>
                <ul className="mt-2 space-y-2">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#apply"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Apply for {tier.name} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Apply", desc: "Fill out the form below with your company details and proof of eligibility." },
              { step: "2", title: "Get Approved", desc: "Our team reviews applications within 48 hours. Most startups are approved." },
              { step: "3", title: "Start Building", desc: "Credits are auto-applied to your account. Launch GPUs and build your product." },
            ].map((item) => (
              <div key={item.step}>
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm font-bold text-indigo-400">
                  {item.step}
                </div>
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Recognized Accelerators & Partners
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {PARTNERS.map((partner) => (
              <span
                key={partner}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Apply Now</h2>
            <p className="mt-3 text-gray-400">
              Tell us about your startup and how you plan to use GPUs. We review applications within 48 hours.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // In production, this would submit to an API
              alert("Application submitted! We'll review within 48 hours.");
            }}
            className="mt-8 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Your startup name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="https://your-startup.com"
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Founding Date</label>
                <input
                  type="date"
                  value={formData.foundingDate}
                  onChange={(e) => setFormData({ ...formData, foundingDate: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Team Size</label>
                <input
                  type="number"
                  min="1"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. 5"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Work Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                placeholder="you@your-startup.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">What are you building?</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                placeholder="Tell us about your AI product or research..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">How will you use GPUs?</label>
              <textarea
                required
                rows={2}
                value={formData.gpuUsage}
                onChange={(e) => setFormData({ ...formData, gpuUsage: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                placeholder="Training, fine-tuning, inference, etc."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="seed">Seed — ₹50,000 credits</option>
                <option value="growth">Growth — ₹2,00,000 credits</option>
                <option value="scale">Scale — ₹5,00,000 credits</option>
              </select>
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              <Send className="h-4 w-4" /> Submit Application
            </button>
            <p className="text-center text-xs text-gray-600">
              We review all applications within 48 hours. You&apos;ll receive an email with the decision.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
