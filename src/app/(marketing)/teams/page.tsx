"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  ArrowRight,
  Shield,
  CreditCard,
  Eye,
  Bell,
  Lock,
  UserCheck,
  ClipboardList,
  Building2,
} from "lucide-react";

const ROLES = [
  { name: "Owner", description: "Full control. Billing, members, and all resources.", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { name: "Admin", description: "Manage members, instances, and storage. No billing.", color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  { name: "Developer", description: "Launch instances, manage storage, deploy endpoints.", color: "text-green-400 border-green-500/30 bg-green-500/10" },
  { name: "Billing", description: "View and manage invoices, credits, and payments.", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  { name: "Viewer", description: "Read-only access to dashboards and usage reports.", color: "text-gray-400 border-white/10 bg-white/5" },
];

const FEATURES = [
  {
    icon: CreditCard,
    title: "Per-Team GPU Budgets",
    description: "Set monthly GPU spending limits per team. Get alerts at 50%, 80%, and 100% of budget via email or Slack.",
  },
  {
    icon: ClipboardList,
    title: "Audit Logs",
    description: "Full audit trail of who launched, stopped, or modified what instance, when. Exportable for compliance.",
  },
  {
    icon: Eye,
    title: "Usage Dashboard",
    description: "See which team member used which GPU, for how long, running what. Complete cost attribution.",
  },
  {
    icon: Building2,
    title: "Single Invoice",
    description: "One consolidated invoice for the entire organization. No more expense report chaos.",
  },
  {
    icon: Lock,
    title: "SSO via Google Workspace",
    description: "One-click login with Google Workspace. Most Indian startups already use it.",
  },
  {
    icon: Bell,
    title: "Budget Alerts",
    description: "Configurable alerts via email and Slack when teams approach their GPU spending limits.",
  },
];

export default function TeamsPage() {
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
            <Users className="h-3 w-3" /> Wollnut Teams
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Built for AI Teams
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Organization-level accounts with team management, GPU budgets,
            role-based access control, and consolidated billing.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Free for up to 3 members. Then ₹500/member/month.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Create Your Organization <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-semibold text-gray-300 hover:border-white/30 hover:text-white"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Role-Based Access Control</h2>
          <p className="mt-3 text-gray-400">
            Five roles designed for AI teams. Give everyone exactly the access they need.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-400" />
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${role.color}`}>
                  {role.name}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-400">{role.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Everything Your Team Needs</h2>
            <p className="mt-3 text-gray-400">
              GPU budgets, audit logs, usage dashboards, and more — built for teams running AI at scale.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <feature.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="mt-3 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">Simple Team Pricing</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-left">
              <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-green-400">
                Free
              </span>
              <h3 className="mt-3 text-2xl font-bold">Starter</h3>
              <p className="mt-1 text-sm text-gray-400">Up to 3 team members</p>
              <ul className="mt-5 space-y-2">
                {["3 members included", "Basic roles (Owner, Developer)", "Shared billing", "Usage dashboard"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Shield className="h-3.5 w-3.5 text-green-400" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-6 text-left">
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
                Pro
              </span>
              <h3 className="mt-3 text-2xl font-bold">
                ₹500<span className="text-base font-normal text-gray-400">/member/month</span>
              </h3>
              <p className="mt-1 text-sm text-gray-400">Unlimited team members</p>
              <ul className="mt-5 space-y-2">
                {["Unlimited members", "All 5 roles", "Per-team GPU budgets", "Audit logs & SSO", "Budget alerts (email/Slack)", "API access for teams"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Shield className="h-3.5 w-3.5 text-indigo-400" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-16 text-center">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="text-2xl font-bold">Get Your Team on Wollnut</h2>
          <p className="mt-3 text-gray-400">
            Start free with up to 3 members. No credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Create Organization <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
