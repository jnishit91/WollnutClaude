"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HardDrive,
  ArrowRight,
  Check,
  Database,
  Shield,
  Zap,
  Server,
  Cloud,
  Terminal,
  Lock,
} from "lucide-react";

const STORAGE_TIERS = [
  {
    name: "NVMe SSD",
    price: "₹3–5",
    unit: "/GB/month",
    description: "Ultra-fast NVMe storage for active datasets, model checkpoints, and training runs.",
    features: [
      "Up to 3.5 GB/s read throughput",
      "Sub-millisecond latency",
      "Automatic snapshots",
      "Mount on any GPU instance",
    ],
    highlight: true,
  },
  {
    name: "HDD Archive",
    price: "₹1–2",
    unit: "/GB/month",
    description: "Cost-effective storage for infrequently accessed datasets and long-term archival.",
    features: [
      "Up to 500 MB/s throughput",
      "Ideal for cold data & backups",
      "Automatic snapshots",
      "Upgrade to NVMe anytime",
    ],
    highlight: false,
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Create a Volume",
    description: "Create a persistent volume from the dashboard or CLI. Choose NVMe SSD or HDD and set your size.",
    icon: Database,
  },
  {
    step: "2",
    title: "Attach to Any Instance",
    description: "Mount your volume on any GPU instance. Near-zero latency over InfiniBand internal network.",
    icon: Server,
  },
  {
    step: "3",
    title: "Data Persists Forever",
    description: "Terminate your GPU instance — your data stays. Launch a new GPU and re-mount instantly.",
    icon: Cloud,
  },
];

const API_EXAMPLES = [
  {
    title: "CLI",
    code: `# Create a 500GB NVMe volume
wollnut storage create --size 500gb --name my-data --type nvme

# List your volumes
wollnut storage ls

# Attach to a running instance
wollnut storage attach --volume my-data --instance i-abc123`,
  },
  {
    title: "REST API",
    code: `// Create a volume
POST /v1/storage/create
{
  "name": "training-data",
  "sizeGb": 500,
  "type": "nvme"
}

// Attach to instance
POST /v1/storage/attach
{
  "volumeId": "vol_abc123",
  "instanceId": "i-xyz789"
}`,
  },
];

export default function StoragePage() {
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
            <HardDrive className="h-3 w-3" /> Persistent Storage
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Your Data Stays. Always.
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            High-speed persistent volumes that exist independently of GPU instances.
            Stop re-uploading terabytes. Mount your data on any instance in seconds.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            First 50GB free for all accounts
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Get Started with 50GB Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-semibold text-gray-300 hover:border-white/30 hover:text-white"
            >
              View API Docs
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Pricing Tiers */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Simple, Predictable Pricing</h2>
          <p className="mt-3 text-gray-400">
            No egress fees. No hidden charges. Pay only for what you store.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {STORAGE_TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-6 ${
                tier.highlight
                  ? "border-indigo-500/30 bg-indigo-500/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {tier.highlight && (
                <span className="mb-3 inline-block rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
                  Recommended
                </span>
              )}
              <h3 className="text-xl font-semibold">{tier.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className="text-sm text-gray-400">{tier.unit}</span>
              </div>
              <p className="mt-3 text-sm text-gray-400">{tier.description}</p>
              <ul className="mt-5 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="h-4 w-4 flex-shrink-0 text-green-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-gray-400">
              Three steps to persistent, high-speed storage for all your AI workloads.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <item.icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API & CLI Examples */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              <Terminal className="h-3 w-3" /> Developer-First
            </div>
            <h2 className="text-3xl font-bold">Manage Storage from Anywhere</h2>
            <p className="mt-3 text-gray-400">
              Use the dashboard, CLI, or REST API — whatever fits your workflow.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {API_EXAMPLES.map((ex) => (
              <div
                key={ex.title}
                className="overflow-hidden rounded-xl border border-white/10"
              >
                <div className="border-b border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-400">
                  {ex.title}
                </div>
                <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-gray-300">
                  <code>{ex.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sovereignty */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Lock className="h-6 w-6 text-green-400" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Data Sovereignty by Default</h2>
          <p className="mt-3 text-gray-400">
            All storage resides in GIFT City, Gandhinagar — India&apos;s premier financial hub.
            DPDP Act compliant. Your data never leaves India.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Shield, label: "DPDP Act Compliant" },
              { icon: Zap, label: "InfiniBand Interconnect" },
              { icon: HardDrive, label: "Automatic Snapshots" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
              >
                <Icon className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-16 text-center">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="text-2xl font-bold">Start with 50GB Free</h2>
          <p className="mt-3 text-gray-400">
            Every Wollnut account includes 50GB of free NVMe storage. No credit card required.
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
              View GPU Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
