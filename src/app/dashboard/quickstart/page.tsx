"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Rocket,
  Terminal,
  Key,
  CreditCard,
  Server,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Zap,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Add SSH Key",
    description: "Upload your public SSH key for secure instance access.",
    icon: Key,
    href: "/dashboard/ssh-keys",
    code: 'ssh-keygen -t ed25519 -C "your@email.com"\ncat ~/.ssh/id_ed25519.pub',
    tip: "If you already have an SSH key, skip the keygen step and just copy your public key.",
  },
  {
    id: 2,
    title: "Add Credits",
    description: "Top up your account balance to start launching GPUs.",
    icon: CreditCard,
    href: "/dashboard/billing",
    code: null,
    tip: "New accounts start with $0 balance. Add at least $5 to get started.",
  },
  {
    id: 3,
    title: "Launch an Instance",
    description: "Choose a GPU plan and spin up your first instance.",
    icon: Server,
    href: "/dashboard/instances/new",
    code: null,
    tip: "Start with an A100 for deep learning, or an RTX 4090 for lighter workloads.",
  },
  {
    id: 4,
    title: "Connect via SSH",
    description: "SSH into your running instance and start working.",
    icon: Terminal,
    href: null,
    code: "ssh -i ~/.ssh/id_ed25519 root@<instance-ip>",
    tip: "Your instance IP will be shown on the instances page once it's running.",
  },
];

const CODE_EXAMPLES = [
  {
    title: "Launch via API",
    language: "bash",
    code: `curl -X POST https://api.wollnutlabs.com/v1/instances \\
  -H "Authorization: Bearer wl_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "planId": "a100-80gb",
    "templateSlug": "pytorch-2.3",
    "sshKeyIds": ["key_abc123"]
  }'`,
  },
  {
    title: "Python SDK",
    language: "python",
    code: `import wollnut

client = wollnut.Client(api_key="wl_your_api_key")

instance = client.instances.create(
    plan="a100-80gb",
    template="pytorch-2.3",
    ssh_keys=["key_abc123"]
)

print(f"Instance {instance.id} is {instance.status}")`,
  },
  {
    title: "List Instances",
    language: "bash",
    code: `curl https://api.wollnutlabs.com/v1/instances \\
  -H "Authorization: Bearer wl_your_api_key"`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded p-1 text-surface-500 hover:text-white"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-accent-green" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export default function QuickStartPage() {
  const [activeExample, setActiveExample] = useState(0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10">
          <Rocket className="h-5 w-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Quick Start</h1>
          <p className="text-sm text-surface-400">
            Get up and running with Wollnut Labs in minutes
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="mt-8 space-y-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="rounded-xl border border-surface-800 bg-surface-900 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {step.id}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-brand-400" />
                      <h3 className="font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    {step.href && (
                      <Link
                        href={step.href}
                        className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300"
                      >
                        Go
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-surface-400">
                    {step.description}
                  </p>

                  {step.code && (
                    <div className="mt-3 rounded-lg border border-surface-700 bg-surface-950 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-surface-500">
                          Terminal
                        </span>
                        <CopyButton text={step.code} />
                      </div>
                      <pre className="mt-1 overflow-x-auto text-xs text-surface-300">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}

                  {step.tip && (
                    <p className="mt-2 text-xs text-surface-500">
                      <Zap className="mr-1 inline h-3 w-3 text-accent-amber" />
                      {step.tip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* API Examples */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-white">API Examples</h2>
        <p className="mt-1 text-sm text-surface-400">
          Automate your workflows with the Wollnut Labs API
        </p>

        <div className="mt-4 flex gap-2">
          {CODE_EXAMPLES.map((example, i) => (
            <button
              key={example.title}
              onClick={() => setActiveExample(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeExample === i
                  ? "bg-brand-600 text-white"
                  : "bg-surface-800 text-surface-400 hover:text-white"
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-xl border border-surface-700 bg-surface-950 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-surface-500">
              {CODE_EXAMPLES[activeExample]?.language}
            </span>
            <CopyButton text={CODE_EXAMPLES[activeExample]?.code ?? ''} />
          </div>
          <pre className="mt-2 overflow-x-auto text-xs leading-relaxed text-surface-300">
            <code>{CODE_EXAMPLES[activeExample]?.code}</code>
          </pre>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/api-keys"
          className="group flex items-center gap-4 rounded-xl border border-surface-800 bg-surface-900 p-5 transition-colors hover:border-surface-700"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800">
            <Key className="h-5 w-5 text-brand-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">Get API Key</h3>
            <p className="text-xs text-surface-400">
              Create an API key for programmatic access
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-surface-500 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/docs"
          className="group flex items-center gap-4 rounded-xl border border-surface-800 bg-surface-900 p-5 transition-colors hover:border-surface-700"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800">
            <BookOpen className="h-5 w-5 text-brand-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">API Documentation</h3>
            <p className="text-xs text-surface-400">
              Full API reference and guides
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-surface-500" />
        </Link>
      </div>
    </div>
  );
}
