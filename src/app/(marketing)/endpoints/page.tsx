"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  ArrowRight,
  Check,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Code,
  Layers,
  Activity,
} from "lucide-react";

const SUPPORTED_MODELS = [
  { name: "Llama 3.1 8B", provider: "Meta", price8: "₹15", price70: null, category: "Text Generation", vram: "16GB" },
  { name: "Llama 3.1 70B", provider: "Meta", price8: null, price70: "₹120", category: "Text Generation", vram: "140GB" },
  { name: "Llama 3.1 405B", provider: "Meta", price8: null, price70: "₹400", category: "Text Generation", vram: "800GB" },
  { name: "Mistral 7B / Mixtral", provider: "Mistral", price8: "₹12", price70: "₹90", category: "Text Generation", vram: "16–90GB" },
  { name: "DeepSeek V3 / R1", provider: "DeepSeek", price8: "₹15", price70: "₹150", category: "Text + Reasoning", vram: "16–140GB" },
  { name: "Qwen 2.5", provider: "Alibaba", price8: "₹12", price70: "₹100", category: "Text Generation", vram: "16–140GB" },
  { name: "Whisper Large V3", provider: "OpenAI", price8: "₹8", price70: null, category: "Audio Transcription", vram: "10GB" },
  { name: "Stable Diffusion XL / Flux", provider: "Stability AI", price8: "₹20", price70: null, category: "Image Generation", vram: "16GB" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "One-Click Deploy",
    description: "Deploy any HuggingFace or custom model as a production API in seconds. We handle vLLM, TGI, and GPU allocation.",
  },
  {
    icon: Globe,
    title: "OpenAI-Compatible API",
    description: "Use the same OpenAI SDK you already know. Change the base URL and API key — that's it.",
  },
  {
    icon: Activity,
    title: "Auto-Scaling",
    description: "Scale from 1 to N replicas automatically based on request queue depth. Pay only for what you use.",
  },
  {
    icon: Shield,
    title: "API Key Management",
    description: "Generate API keys for your endpoints. Give your users access to your Wollnut-hosted models securely.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Monitor request count, latency (p50/p95/p99), token throughput, and cost — all in real time.",
  },
  {
    icon: Layers,
    title: "Multi-Model Support",
    description: "Run text generation, image generation, audio transcription, and embeddings — all on the same platform.",
  },
];

export default function EndpointsPage() {
  const [activeTab, setActiveTab] = useState<"python" | "curl" | "node">("python");

  const codeExamples: Record<string, string> = {
    python: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.wollnut.ai/v1",
    api_key="wn_ek_your_key_here"
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-70B",
    messages=[
        {"role": "user", "content": "Explain transformers in 3 sentences."}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)`,
    curl: `curl https://api.wollnut.ai/v1/chat/completions \\
  -H "Authorization: Bearer wn_ek_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "meta-llama/Llama-3.1-70B",
    "messages": [
      {"role": "user", "content": "Explain transformers in 3 sentences."}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'`,
    node: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.wollnut.ai/v1",
  apiKey: "wn_ek_your_key_here",
});

const response = await client.chat.completions.create({
  model: "meta-llama/Llama-3.1-70B",
  messages: [
    { role: "user", content: "Explain transformers in 3 sentences." }
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);`,
  };

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
            <Rocket className="h-3 w-3" /> Wollnut Endpoints
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Deploy AI Models as APIs
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            One click to deploy any open-source model as a production-ready, auto-scaling API endpoint.
            OpenAI-compatible. Pay per token.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Deploy Your First Model <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/models"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-semibold text-gray-300 hover:border-white/30 hover:text-white"
            >
              Browse Models
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>

      {/* OpenAI-Compatible API */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              <Code className="h-3 w-3" /> OpenAI-Compatible
            </div>
            <h2 className="text-3xl font-bold">Drop-In Replacement</h2>
            <p className="mt-3 text-gray-400">
              Use any OpenAI SDK. Change two lines — base URL and API key. Your existing code just works.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
            <div className="flex border-b border-white/10 bg-white/5">
              {(["python", "curl", "node"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-semibold transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-indigo-500 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab === "node" ? "Node.js" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-gray-300">
              <code>{codeExamples[activeTab]}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Per-Token Pricing</h2>
            <p className="mt-3 text-gray-400">
              Pay per 1M tokens. No minimum spend. Scale to zero when idle.
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Model</th>
                  <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">Provider</th>
                  <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">Category</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Per 1M Tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {SUPPORTED_MODELS.map((model, i) => (
                  <motion.tr
                    key={model.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="px-5 py-4 font-medium text-white">{model.name}</td>
                    <td className="hidden px-5 py-4 text-gray-400 sm:table-cell">{model.provider}</td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-gray-400">
                        {model.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-white">
                      {model.price8 && model.price70
                        ? `${model.price8}–${model.price70}`
                        : model.price8 ?? model.price70}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-xs text-gray-600">
            Custom models and fine-tuned weights supported. Pricing varies by model size.
          </p>
        </div>
      </section>

      {/* Auto-scaling Visual */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold">Automatic Scaling</h2>
          <p className="mt-3 text-gray-400">
            Your endpoint scales from 1 to N GPU replicas based on request queue depth.
            Scale to zero during quiet hours. No configuration needed.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Min 1 replica", desc: "Always-on baseline" },
              { label: "Auto-scale up", desc: "Based on queue depth" },
              { label: "Scale to zero", desc: "Pay nothing when idle" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-4"
              >
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="mt-1 text-xs text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-16 text-center">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="text-2xl font-bold">Deploy Your First Endpoint</h2>
          <p className="mt-3 text-gray-400">
            Go from model to production API in under 60 seconds. Start with ₹500 free credit.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-semibold text-gray-300 hover:border-white/30 hover:text-white"
            >
              Try the Playground
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
