"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Book,
  ChevronRight,
  Copy,
  Check,
  Lock,
  Server,
  CreditCard,
  Key,
  Layers,
  Brain,
  Bell,
  Cpu,
  Shield,
  Sparkles,
} from "lucide-react";

// ── Helpers ──────────────────────────────────

function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
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

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-accent-green/10 text-accent-green",
    POST: "bg-brand-500/10 text-brand-400",
    DELETE: "bg-accent-red/10 text-accent-red",
    PATCH: "bg-accent-amber/10 text-accent-amber",
    PUT: "bg-accent-purple/10 text-accent-purple",
  };
  return (
    <span
      className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${colors[method] ?? "bg-surface-800 text-surface-300"}`}
    >
      {method}
    </span>
  );
}

function Endpoint({
  method,
  path,
  description,
  auth = true,
  body,
  response,
  params,
}: {
  method: string;
  path: string;
  description: string;
  auth?: boolean;
  body?: string;
  response: string;
  params?: { name: string; type: string; desc: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-surface-800 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-900/50"
      >
        <MethodBadge method={method} />
        <code className="flex-1 text-sm text-white">{path}</code>
        {auth && <Lock className="h-3 w-3 text-surface-500" />}
        <ChevronRight
          className={`h-4 w-4 text-surface-500 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-surface-800/50 bg-surface-950/50 px-4 py-4 space-y-4">
          <p className="text-sm text-surface-300">{description}</p>
          {auth && (
            <p className="text-xs text-surface-500">
              Requires: <code className="text-accent-amber">Authorization: Bearer &lt;api_key&gt;</code>
            </p>
          )}
          {params && params.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500">
                Parameters
              </h4>
              <div className="space-y-1">
                {params.map((p) => (
                  <div key={p.name} className="flex items-baseline gap-2 text-sm">
                    <code className="text-brand-400">{p.name}</code>
                    <span className="text-xs text-surface-500">{p.type}</span>
                    <span className="text-surface-400">— {p.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {body && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500">
                Request Body
              </h4>
              <CodeBlock code={body} />
            </div>
          )}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500">
              Response
            </h4>
            <CodeBlock code={response} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── API Sections ─────────────────────────────

const SECTIONS = [
  {
    id: "auth",
    title: "Authentication",
    icon: Lock,
    description: "Sign up, sign in, and manage sessions",
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/signup",
        description: "Create a new user account. Returns the user object on success.",
        auth: false,
        body: `{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}`,
        response: `{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}`,
      },
      {
        method: "GET",
        path: "/api/auth/session",
        description: "Get the current authenticated session.",
        auth: true,
        response: `{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "creditsBalance": 25.50
  }
}`,
      },
    ],
  },
  {
    id: "instances",
    title: "Instances",
    icon: Server,
    description: "Create, manage, and control GPU instances",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/instances",
        description: "List all instances owned by the authenticated user.",
        response: `{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "training-run-01",
      "status": "Running",
      "gpuType": "H100",
      "gpuCount": 1,
      "pricePerHour": 2.25,
      "ipAddress": "203.0.113.42",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}`,
      },
      {
        method: "POST",
        path: "/api/v1/instances",
        description: "Create a new GPU instance. Verifies credit balance before provisioning.",
        body: `{
  "name": "my-training-run",
  "planId": "GPU.H100.1x",
  "templateSlug": "pytorch-cuda",
  "sshKeyId": "clx...",
  "autoShutdownMin": 60
}`,
        response: `{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "my-training-run",
    "status": "Provisioning",
    "gpuType": "H100",
    "e2eNodeId": "12345"
  }
}`,
      },
      {
        method: "GET",
        path: "/api/v1/instances/:id",
        description: "Get detailed information about a specific instance.",
        response: `{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "my-training-run",
    "status": "Running",
    "gpuType": "H100",
    "gpuCount": 1,
    "vcpus": 26,
    "ram": "250GB",
    "storage": "500GB NVMe",
    "ipAddress": "203.0.113.42",
    "jupyterUrl": "https://...",
    "pricePerHour": 2.25,
    "totalBilledAmount": 4.50,
    "startedAt": "2025-01-15T10:30:00Z"
  }
}`,
      },
      {
        method: "POST",
        path: "/api/v1/instances/:id/start",
        description: "Power on a stopped instance.",
        response: `{
  "success": true,
  "data": { "status": "Starting" }
}`,
      },
      {
        method: "POST",
        path: "/api/v1/instances/:id/stop",
        description: "Power off a running instance. Billing stops immediately.",
        response: `{
  "success": true,
  "data": { "status": "Stopping" }
}`,
      },
      {
        method: "DELETE",
        path: "/api/v1/instances/:id",
        description: "Permanently destroy an instance. This action cannot be undone.",
        response: `{
  "success": true,
  "data": { "deleted": true }
}`,
      },
    ],
  },
  {
    id: "plans",
    title: "GPU Plans",
    icon: Cpu,
    description: "List available GPU configurations and pricing",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/plans",
        description: "List all available GPU plans with pricing. This is a public endpoint.",
        auth: false,
        response: `{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "gpuName": "NVIDIA H100",
      "gpuShortName": "H100",
      "vram": "80GB SXM",
      "vcpus": 26,
      "ram": "250GB",
      "storage": "500GB NVMe",
      "wollnutPricePerHour": 2.25,
      "wollnutPricePerMinute": 0.0375
    }
  ]
}`,
      },
    ],
  },
  {
    id: "templates",
    title: "Templates",
    icon: Layers,
    description: "Pre-configured environments for ML workloads",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/templates",
        description: "List all active templates. Optionally filter by category.",
        auth: false,
        params: [
          { name: "category", type: "string?", desc: "Filter by category (e.g., 'LLM Training')" },
        ],
        response: `{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "PyTorch 2.2 + CUDA 12.4",
      "slug": "pytorch-cuda",
      "category": "General ML",
      "tags": ["pytorch", "cuda"],
      "includedPackages": ["PyTorch 2.2", "CUDA 12.4"],
      "recommendedGpu": "H100 or A100",
      "featured": true
    }
  ]
}`,
      },
      {
        method: "GET",
        path: "/api/v1/templates/:slug",
        description: "Get full details of a template by its slug.",
        auth: false,
        response: `{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "PyTorch 2.2 + CUDA 12.4",
    "slug": "pytorch-cuda",
    "description": "Full production ML environment...",
    "e2eImageId": "img-12345",
    "includedPackages": ["PyTorch 2.2", "CUDA 12.4", "cuDNN 8.9"],
    "recommendedGpu": "H100 or A100",
    "minVram": "40GB"
  }
}`,
      },
    ],
  },
  {
    id: "models",
    title: "AI Models",
    icon: Brain,
    description: "Browse and deploy AI models",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/models",
        description: "List all active AI models. Filter by category or search.",
        auth: false,
        params: [
          { name: "category", type: "string?", desc: "Filter by category (e.g., 'Text-to-Text')" },
          { name: "search", type: "string?", desc: "Search by name, provider, or description" },
        ],
        response: `{
  "success": true,
  "data": [
    {
      "name": "DeepSeek R1",
      "slug": "deepseek-r1",
      "provider": "DeepSeek",
      "parameters": "671B",
      "contextLength": "128K",
      "vramRequired": "80GB minimum",
      "recommendedGpu": "H100 8x or H200 4x",
      "templateSlug": "deepseek-r1-vllm"
    }
  ]
}`,
      },
      {
        method: "GET",
        path: "/api/v1/models/:slug",
        description: "Get full details of a model by its slug.",
        auth: false,
        response: `{
  "success": true,
  "data": {
    "name": "DeepSeek R1",
    "slug": "deepseek-r1",
    "provider": "DeepSeek",
    "description": "State-of-the-art reasoning model...",
    "parameters": "671B",
    "vramRequired": "80GB minimum",
    "huggingFaceId": "deepseek-ai/DeepSeek-R1",
    "licenseType": "MIT"
  }
}`,
      },
    ],
  },
  {
    id: "billing",
    title: "Billing",
    icon: CreditCard,
    description: "Credits, balance, usage, and transactions",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/billing/balance",
        description: "Get current credit balance for the authenticated user.",
        response: `{
  "success": true,
  "data": {
    "balance": 25.50,
    "currency": "USD"
  }
}`,
      },
      {
        method: "POST",
        path: "/api/v1/billing/add-credits",
        description: "Create a Stripe checkout session to add credits.",
        body: `{
  "amount": 50,
  "currency": "USD"
}`,
        response: `{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
}`,
      },
      {
        method: "GET",
        path: "/api/v1/billing/usage",
        description: "Get usage summary for a date range.",
        params: [
          { name: "startDate", type: "string", desc: "ISO date string" },
          { name: "endDate", type: "string", desc: "ISO date string" },
        ],
        response: `{
  "success": true,
  "data": {
    "totalSpend": 45.75,
    "totalHours": 20.5,
    "byGpu": [
      { "gpuType": "H100", "hours": 15.0, "cost": 33.75 }
    ],
    "byDay": [
      { "date": "2025-01-15", "cost": 12.50, "hours": 5.5 }
    ]
  }
}`,
      },
      {
        method: "GET",
        path: "/api/v1/billing/transactions",
        description: "List transaction history for the authenticated user.",
        response: `{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "type": "CREDIT_PURCHASE",
      "amount": 50.00,
      "balance": 75.50,
      "description": "Credits purchased: $50.00",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}`,
      },
    ],
  },
  {
    id: "ssh-keys",
    title: "SSH Keys",
    icon: Key,
    description: "Manage SSH keys for instance access",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/ssh-keys",
        description: "List all SSH keys for the authenticated user.",
        response: `{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "my-laptop",
      "fingerprint": "aa:bb:cc:dd:...",
      "createdAt": "2025-01-10T08:00:00Z"
    }
  ]
}`,
      },
      {
        method: "POST",
        path: "/api/v1/ssh-keys",
        description: "Add a new SSH public key.",
        body: `{
  "name": "my-laptop",
  "publicKey": "ssh-rsa AAAAB3NzaC1yc2..."
}`,
        response: `{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "my-laptop",
    "fingerprint": "aa:bb:cc:dd:..."
  }
}`,
      },
      {
        method: "DELETE",
        path: "/api/v1/ssh-keys/:id",
        description: "Delete an SSH key.",
        response: `{
  "success": true,
  "data": { "deleted": true }
}`,
      },
    ],
  },
  {
    id: "api-keys",
    title: "API Keys",
    icon: Shield,
    description: "Create and manage API keys for programmatic access",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/api-keys",
        description: "List all API keys for the authenticated user.",
        response: `{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "CI/CD Pipeline",
      "keyPrefix": "wn_ak_a1b2c3d4",
      "scopes": ["instances", "billing"],
      "lastUsedAt": "2025-01-15T12:00:00Z",
      "expiresAt": null,
      "createdAt": "2025-01-10T08:00:00Z"
    }
  ]
}`,
      },
      {
        method: "POST",
        path: "/api/v1/api-keys",
        description: "Create a new API key. The plaintext key is returned only once.",
        body: `{
  "name": "CI/CD Pipeline",
  "scopes": ["instances", "billing"],
  "expiresAt": "2025-12-31T23:59:59Z"
}`,
        response: `{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "CI/CD Pipeline",
    "keyPrefix": "wn_ak_a1b2c3d4",
    "plaintextKey": "wn_ak_a1b2c3d4e5f6...",
    "scopes": ["instances", "billing"]
  }
}`,
      },
      {
        method: "DELETE",
        path: "/api/v1/api-keys/:id",
        description: "Revoke an API key. This action is immediate and irreversible.",
        response: `{
  "success": true,
  "data": { "revoked": true }
}`,
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    description: "User notifications for instance events and billing alerts",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/notifications",
        description: "List notifications for the authenticated user.",
        response: `{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "type": "instance_started",
      "title": "Instance Started",
      "message": "Your instance 'training-01' is now running.",
      "read": false,
      "actionUrl": "/dashboard/instances/clx...",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}`,
      },
      {
        method: "POST",
        path: "/api/v1/notifications/:id/read",
        description: "Mark a notification as read.",
        response: `{
  "success": true,
  "data": { "read": true }
}`,
      },
    ],
  },
];

// ── Error codes reference ────────────────────

const ERROR_CODES = [
  { code: "VALIDATION_ERROR", status: 422, desc: "Request body failed validation (Zod). Check error.details for field-level messages." },
  { code: "AUTHENTICATION_ERROR", status: 401, desc: "Missing or invalid authentication credentials." },
  { code: "AUTHORIZATION_ERROR", status: 403, desc: "Authenticated but not authorized for this resource." },
  { code: "NOT_FOUND", status: 404, desc: "The requested resource does not exist." },
  { code: "INSUFFICIENT_CREDITS", status: 402, desc: "Not enough credits to perform the operation." },
  { code: "RATE_LIMITED", status: 429, desc: "Too many requests. Retry after the rate limit window." },
  { code: "E2E_API_ERROR", status: 502, desc: "Upstream E2E Networks API error." },
  { code: "INTERNAL_ERROR", status: 500, desc: "Unexpected server error." },
];

// ── Page ─────────────────────────────────────

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("auth");

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-surface-800/50">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-sm text-brand-400">
              <Book className="h-4 w-4" />
              API Reference
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              API Documentation
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-400">
              Complete reference for the Wollnut Labs REST API. Manage GPU
              instances, billing, and more programmatically.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <nav className="space-y-1 lg:sticky lg:top-8 lg:self-start">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
              Endpoints
            </h3>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document
                    .getElementById(section.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-brand-600/10 text-brand-400"
                    : "text-surface-400 hover:bg-surface-900 hover:text-white"
                }`}
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </button>
            ))}
            <div className="pt-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
                Reference
              </h3>
              <button
                onClick={() => {
                  setActiveSection("errors");
                  document
                    .getElementById("errors")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeSection === "errors"
                    ? "bg-brand-600/10 text-brand-400"
                    : "text-surface-400 hover:bg-surface-900 hover:text-white"
                }`}
              >
                Error Codes
              </button>
            </div>
          </nav>

          {/* Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Base URL */}
            <section className="rounded-xl border border-surface-800 bg-surface-900 p-6">
              <h2 className="text-lg font-semibold text-white">Base URL</h2>
              <CodeBlock
                code="https://your-domain.com/api/v1"
                lang="text"
              />
              <div className="mt-4 space-y-2">
                <p className="text-sm text-surface-400">
                  All API requests require an API key passed via the{" "}
                  <code className="text-brand-400">Authorization</code> header
                  unless marked as public.
                </p>
                <CodeBlock
                  code={`curl -H "Authorization: Bearer wn_ak_your_key_here" \\
  https://your-domain.com/api/v1/instances`}
                  lang="bash"
                />
              </div>
              <div className="mt-4 rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-3">
                <p className="text-sm text-accent-amber">
                  API keys are shown only once at creation. Store them securely.
                  Endpoints marked with a <Lock className="inline h-3 w-3" />{" "}
                  icon require authentication.
                </p>
              </div>
            </section>

            {/* Response format */}
            <section className="rounded-xl border border-surface-800 bg-surface-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                Response Format
              </h2>
              <p className="mt-2 text-sm text-surface-400">
                All responses follow a consistent JSON format:
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-xs font-semibold text-accent-green">
                    Success
                  </h4>
                  <CodeBlock
                    code={`{
  "success": true,
  "data": { ... }
}`}
                  />
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-semibold text-accent-red">
                    Error
                  </h4>
                  <CodeBlock
                    code={`{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Instance not found"
  }
}`}
                  />
                </div>
              </div>
            </section>

            {/* Endpoint sections */}
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800">
                    <section.icon className="h-4 w-4 text-brand-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {section.title}
                    </h2>
                    <p className="text-sm text-surface-400">
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-surface-800 bg-surface-900">
                  {section.endpoints.map((ep, i) => (
                    <Endpoint key={i} {...ep} />
                  ))}
                </div>
              </section>
            ))}

            {/* Error codes */}
            <section id="errors">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Error Codes
              </h2>
              <div className="overflow-x-auto rounded-xl border border-surface-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-800 bg-surface-900/50">
                      <th className="px-4 py-3 text-left font-medium text-surface-400">
                        Code
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-surface-400">
                        HTTP Status
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-surface-400">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ERROR_CODES.map((err) => (
                      <tr
                        key={err.code}
                        className="border-b border-surface-800/50"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-brand-400">
                          {err.code}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-white">
                          {err.status}
                        </td>
                        <td className="px-4 py-3 text-surface-300">
                          {err.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Developer link */}
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-6 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-brand-400" />
              <h3 className="mt-3 text-lg font-semibold text-white">
                Ready to build?
              </h3>
              <p className="mt-1 text-sm text-surface-400">
                Check out the Developer page for quickstart guides and SDK
                examples.
              </p>
              <Link
                href="/developers"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                Developer Guide
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
