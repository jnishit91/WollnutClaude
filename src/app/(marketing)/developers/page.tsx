"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2,
  Key,
  Terminal,
  Zap,
  Shield,
  Clock,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function CopyableCode({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative rounded-lg border border-surface-800 bg-surface-950">
      <div className="flex items-center justify-between border-b border-surface-800 px-4 py-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-surface-500">
          {lang}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="text-surface-500 transition-colors hover:text-white"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-accent-green" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-surface-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const QUICKSTART_TABS = ["curl", "python", "node"] as const;
type TabId = (typeof QUICKSTART_TABS)[number];

const QUICKSTART_CODE: Record<TabId, { label: string; code: string; lang: string }> = {
  curl: {
    label: "cURL",
    lang: "bash",
    code: `# List your instances
curl -s -H "Authorization: Bearer wn_ak_your_key" \\
  https://your-domain.com/api/v1/instances | jq

# Create a new GPU instance
curl -s -X POST \\
  -H "Authorization: Bearer wn_ak_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "training-run-01",
    "planId": "GPU.H100.1x",
    "templateSlug": "pytorch-cuda",
    "sshKeyId": "your_ssh_key_id"
  }' \\
  https://your-domain.com/api/v1/instances | jq

# Check your credit balance
curl -s -H "Authorization: Bearer wn_ak_your_key" \\
  https://your-domain.com/api/v1/billing/balance | jq

# Stop an instance
curl -s -X POST \\
  -H "Authorization: Bearer wn_ak_your_key" \\
  https://your-domain.com/api/v1/instances/INSTANCE_ID/stop | jq`,
  },
  python: {
    label: "Python",
    lang: "python",
    code: `import requests

API_BASE = "https://your-domain.com/api/v1"
API_KEY = "wn_ak_your_key"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

# List instances
instances = requests.get(f"{API_BASE}/instances", headers=headers).json()
print(f"You have {len(instances['data'])} instances")

# Create a new GPU instance
new_instance = requests.post(
    f"{API_BASE}/instances",
    headers=headers,
    json={
        "name": "training-run-01",
        "planId": "GPU.H100.1x",
        "templateSlug": "pytorch-cuda",
        "sshKeyId": "your_ssh_key_id",
    },
).json()
print(f"Created: {new_instance['data']['id']}")

# Check balance
balance = requests.get(f"{API_BASE}/billing/balance", headers=headers).json()
print(f"Credits: \${balance['data']['balance']}")

# Stop an instance
instance_id = new_instance["data"]["id"]
requests.post(f"{API_BASE}/instances/{instance_id}/stop", headers=headers)`,
  },
  node: {
    label: "Node.js",
    lang: "javascript",
    code: `const API_BASE = "https://your-domain.com/api/v1";
const API_KEY = "wn_ak_your_key";

const headers = {
  Authorization: \`Bearer \${API_KEY}\`,
  "Content-Type": "application/json",
};

// List instances
const instances = await fetch(\`\${API_BASE}/instances\`, { headers })
  .then((r) => r.json());
console.log(\`You have \${instances.data.length} instances\`);

// Create a new GPU instance
const newInstance = await fetch(\`\${API_BASE}/instances\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "training-run-01",
    planId: "GPU.H100.1x",
    templateSlug: "pytorch-cuda",
    sshKeyId: "your_ssh_key_id",
  }),
}).then((r) => r.json());
console.log(\`Created: \${newInstance.data.id}\`);

// Check balance
const balance = await fetch(\`\${API_BASE}/billing/balance\`, { headers })
  .then((r) => r.json());
console.log(\`Credits: $\${balance.data.balance}\`);

// Stop an instance
const id = newInstance.data.id;
await fetch(\`\${API_BASE}/instances/\${id}/stop\`, {
  method: "POST",
  headers,
});`,
  },
};

const FEATURES = [
  {
    icon: Zap,
    title: "Per-Minute Billing",
    description:
      "Only pay for what you use. Instances are billed by the minute with automatic stop when credits run out.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "API keys are SHA-256 hashed, SSH key authentication, and all API calls validated with Zod schemas.",
  },
  {
    icon: Clock,
    title: "Real-Time Status",
    description:
      "Background jobs continuously sync instance status from E2E Networks. Get instant updates on provisioning.",
  },
  {
    icon: Terminal,
    title: "Full REST API",
    description:
      "Manage everything programmatically — instances, billing, SSH keys, templates, and more.",
  },
];

const RATE_LIMITS = [
  { endpoint: "Instance Create", limit: "10 requests / minute" },
  { endpoint: "Instance Actions", limit: "30 requests / minute" },
  { endpoint: "Billing Operations", limit: "10 requests / minute" },
  { endpoint: "Read Operations", limit: "120 requests / minute" },
  { endpoint: "Public Endpoints", limit: "60 requests / minute" },
];

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("curl");

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
              <Code2 className="h-4 w-4" />
              For Developers
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Build with Wollnut Labs
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-400">
              Programmatic access to enterprise GPUs. Spin up H100s, H200s, and
              B200s with a single API call.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/docs"
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                <BookOpen className="h-4 w-4" />
                API Reference
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 rounded-lg border border-surface-700 px-6 py-3 text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-white"
              >
                <Key className="h-4 w-4" />
                Get API Key
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 space-y-20">
        {/* Getting Started */}
        <section>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Get Started in 3 Steps
            </h2>
            <p className="mt-2 text-surface-400">
              From zero to GPU in under a minute.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create an API Key",
                description:
                  "Sign up and generate an API key from your dashboard settings. Keys use the wn_ak_ prefix.",
                link: { label: "Dashboard Settings", href: "/dashboard/settings" },
              },
              {
                step: "2",
                title: "Choose a GPU",
                description:
                  "Browse available GPU plans — H100, H200, B200 — and pick the right one for your workload.",
                link: { label: "View Plans", href: "/pricing" },
              },
              {
                step: "3",
                title: "Launch & Code",
                description:
                  "Create an instance via API, SSH in, and start training. Billing is per-minute, stop anytime.",
                link: { label: "API Docs", href: "/docs" },
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-surface-800 bg-surface-900 p-6"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-surface-400">
                  {item.description}
                </p>
                <Link
                  href={item.link.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-400 hover:text-brand-300"
                >
                  {item.link.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quickstart */}
        <section>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Quickstart</h2>
            <p className="mt-2 text-surface-400">
              Copy-paste examples to get started fast.
            </p>
          </div>

          <div className="mt-8">
            {/* Tab buttons */}
            <div className="flex gap-2 border-b border-surface-800 pb-px">
              {QUICKSTART_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-brand-500 text-white"
                      : "text-surface-400 hover:text-white"
                  }`}
                >
                  {QUICKSTART_CODE[tab].label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="mt-4">
              <CopyableCode
                code={QUICKSTART_CODE[activeTab].code}
                lang={QUICKSTART_CODE[activeTab].lang}
              />
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Authentication</h2>
            <p className="mt-2 text-surface-400">
              All authenticated endpoints require a Bearer token.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
              <h3 className="font-semibold text-white">API Key Format</h3>
              <p className="mt-2 text-sm text-surface-400">
                All Wollnut Labs API keys use the{" "}
                <code className="text-brand-400">wn_ak_</code> prefix followed
                by 64 hex characters. Keys are hashed with SHA-256 before
                storage — we never store plaintext keys.
              </p>
              <CopyableCode
                code={`# Include in every request
Authorization: Bearer wn_ak_a1b2c3d4e5f6...`}
                lang="http"
              />
            </div>

            <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
              <h3 className="font-semibold text-white">API Key Scopes</h3>
              <p className="mt-2 text-sm text-surface-400">
                Restrict what each key can access by assigning scopes:
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  { scope: "all", desc: "Full access to all endpoints" },
                  { scope: "instances", desc: "Create, read, start, stop, delete instances" },
                  { scope: "billing", desc: "Read balance, usage, transactions" },
                  { scope: "ssh-keys", desc: "Manage SSH keys" },
                ].map((s) => (
                  <div
                    key={s.scope}
                    className="flex items-start gap-2 rounded-lg border border-surface-800 px-3 py-2"
                  >
                    <code className="mt-0.5 text-xs text-brand-400">{s.scope}</code>
                    <span className="text-sm text-surface-300">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Rate Limits</h2>
            <p className="mt-2 text-surface-400">
              Requests are rate-limited per user to ensure fair usage.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-lg overflow-hidden rounded-xl border border-surface-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-800 bg-surface-900/50">
                  <th className="px-4 py-3 text-left font-medium text-surface-400">
                    Endpoint Type
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-surface-400">
                    Rate Limit
                  </th>
                </tr>
              </thead>
              <tbody>
                {RATE_LIMITS.map((rl) => (
                  <tr
                    key={rl.endpoint}
                    className="border-b border-surface-800/50"
                  >
                    <td className="px-4 py-3 text-white">{rl.endpoint}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-surface-300">
                      {rl.limit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mx-auto mt-4 max-w-lg rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-3">
            <p className="text-sm text-accent-amber">
              When rate-limited, the API returns{" "}
              <code className="font-mono">429 Too Many Requests</code>. Retry
              after a short delay.
            </p>
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Platform Features
            </h2>
            <p className="mt-2 text-surface-400">
              Built for production ML and AI workloads.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="rounded-xl border border-surface-800 bg-surface-900 p-6"
              >
                <feat.icon className="h-6 w-6 text-brand-400" />
                <h3 className="mt-3 font-semibold text-white">{feat.title}</h3>
                <p className="mt-2 text-sm text-surface-400">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-8 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-brand-400" />
          <h3 className="mt-3 text-xl font-bold text-white">
            Start building today
          </h3>
          <p className="mt-2 text-surface-400">
            Sign up for free and get $5 in credits to explore the API.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700"
            >
              Get Started Free
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 rounded-lg border border-surface-700 px-6 py-3 text-sm font-medium text-surface-300 hover:border-surface-600 hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              Full API Reference
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
