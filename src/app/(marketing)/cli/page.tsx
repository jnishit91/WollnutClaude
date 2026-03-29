"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Terminal,
  Download,
  ArrowRight,
  Code,
  Zap,
  Monitor,
  GitBranch,
} from "lucide-react";

const COMMANDS = [
  { cmd: "wollnut auth login", desc: "Authenticate with your Wollnut account" },
  { cmd: "wollnut gpu list", desc: "List available GPU types and pricing" },
  { cmd: "wollnut gpu launch", desc: "Launch a new GPU instance" },
  { cmd: "wollnut gpu ls", desc: "List your running instances" },
  { cmd: "wollnut gpu ssh", desc: "SSH into a running instance" },
  { cmd: "wollnut gpu stop", desc: "Stop a running instance" },
  { cmd: "wollnut storage create", desc: "Create a new storage volume" },
  { cmd: "wollnut storage ls", desc: "List your storage volumes" },
  { cmd: "wollnut endpoint deploy", desc: "Deploy a model as an API endpoint" },
  { cmd: "wollnut endpoint ls", desc: "List your deployed endpoints" },
  { cmd: "wollnut billing status", desc: "View current balance and usage" },
  { cmd: "wollnut billing history", desc: "View past invoices and charges" },
];

const FEATURES = [
  {
    icon: GitBranch,
    title: "Script Everything",
    description:
      "Integrate Wollnut into your CI/CD pipelines, shell scripts, and automation workflows. Every action available in the dashboard works from your terminal.",
  },
  {
    icon: Zap,
    title: "Instant SSH",
    description:
      "Connect to any running GPU instance with a single command. No manual key management — the CLI handles authentication and tunneling for you.",
  },
  {
    icon: Monitor,
    title: "Real-Time Status",
    description:
      "Monitor instance health, GPU utilization, and billing in real time. Stream logs and get instant feedback without leaving your terminal.",
  },
];

const WORKFLOW = `$ wollnut auth login
✓ Authenticated as user@example.com

$ wollnut gpu list
┌──────────────┬────────┬───────────┐
│ GPU          │ VRAM   │ Price/hr  │
├──────────────┼────────┼───────────┤
│ A100 80GB    │ 80 GB  │ ₹120/hr   │
│ H100 80GB    │ 80 GB  │ ₹200/hr   │
│ RTX 4090     │ 24 GB  │ ₹45/hr    │
└──────────────┴────────┴───────────┘

$ wollnut gpu launch --type a100 --name training-run
✓ Instance training-run launched (id: i-8f3a2b)

$ wollnut gpu ssh training-run
Connected to training-run (A100 80GB)
user@training-run:~$

$ wollnut gpu stop training-run
✓ Instance training-run stopped`;

export default function CliPage() {
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
            <Terminal className="h-3 w-3" /> Wollnut CLI
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            GPU Cloud from Your Terminal
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Manage GPU instances, storage volumes, and model endpoints without
            leaving your terminal. Script deployments, automate workflows, and
            monitor everything from the command line.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              <Download className="h-4 w-4" /> Install Now
            </Link>
            <Link
              href="https://github.com/wollnut/cli"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-semibold text-gray-300 hover:border-white/30 hover:text-white"
            >
              View on GitHub <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Installation */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              <Download className="h-3 w-3" /> Installation
            </div>
            <h2 className="text-3xl font-bold">Get Started in Seconds</h2>
            <p className="mt-3 text-gray-400">
              Install the Wollnut CLI with your preferred package manager.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="border-b border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300">
                npm
              </div>
              <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-gray-300">
                <code>npm install -g @wollnut/cli</code>
              </pre>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="border-b border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300">
                pip
              </div>
              <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-gray-300">
                <code>pip install wollnut-cli</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Command Reference */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              <Code className="h-3 w-3" /> Command Reference
            </div>
            <h2 className="text-3xl font-bold">Every Command You Need</h2>
            <p className="mt-3 text-gray-400">
              A complete set of commands for managing your GPU cloud
              infrastructure.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
            <div className="border-b border-white/10 bg-white/5 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-gray-500">terminal</span>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {COMMANDS.map((item, i) => (
                <motion.div
                  key={item.cmd}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex flex-col gap-1 px-5 py-3 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <code className="text-[13px] font-semibold text-indigo-400">
                    $ {item.cmd}
                  </code>
                  <span className="text-xs text-gray-500">{item.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Demo */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              <Terminal className="h-3 w-3" /> Workflow
            </div>
            <h2 className="text-3xl font-bold">See It in Action</h2>
            <p className="mt-3 text-gray-400">
              From login to a running GPU instance in under a minute.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
            <div className="border-b border-white/10 bg-white/5 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-gray-500">
                  wollnut-workflow
                </span>
              </div>
            </div>
            <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-gray-300">
              <code>{WORKFLOW}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Built for Developers</h2>
            <p className="mt-3 text-gray-400">
              Everything you need to manage GPU infrastructure from the command
              line.
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
                <p className="mt-2 text-sm text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-16 text-center">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="text-2xl font-bold">Install Wollnut CLI</h2>
          <p className="mt-3 text-gray-400">
            Start managing your GPU cloud from the terminal. Free to install,
            pay only for the resources you use.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
