"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Brain, Star, Cpu, MemoryStick, Scale, ArrowRight, Rocket } from "lucide-react";
import { useModels, type ModelData } from "@/lib/hooks/use-plans";
import { MODEL_CATEGORIES } from "@/lib/constants/gpu-plans";
import { Spinner } from "@/components/shared/Spinner";

const PROVIDER_COLORS: Record<string, string> = {
  DeepSeek: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Meta: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Stability AI": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  OpenAI: "bg-green-500/10 text-green-400 border-green-500/20",
  Mistral: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Google: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Microsoft: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  NousResearch: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Sarvam AI": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function ModelCard({ model }: { model: ModelData }) {
  const providerStyle = PROVIDER_COLORS[model.provider] ?? "bg-white/5 text-gray-300 border-white/10";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{model.name}</h3>
          <span className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${providerStyle}`}>
            {model.provider}
          </span>
        </div>
        {model.featured && (
          <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-400">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">
        {model.description.length > 90 ? model.description.slice(0, 90) + "…" : model.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {model.parameters && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Scale className="h-3.5 w-3.5 text-gray-600" />{model.parameters}
          </div>
        )}
        {model.contextLength && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MemoryStick className="h-3.5 w-3.5 text-gray-600" />{model.contextLength}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Cpu className="h-3.5 w-3.5 text-gray-600" />{model.vramRequired} VRAM
        </div>
        {model.licenseType && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Scale className="h-3.5 w-3.5 text-gray-600" />{model.licenseType}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-gray-400">
          {model.category}
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/endpoints"
            className="flex items-center gap-1 text-xs font-medium text-green-400 transition-colors hover:text-green-300"
          >
            <Rocket className="h-3 w-3" />
            Endpoint
          </Link>
          {model.templateSlug ? (
            <Link
              href={`/auth/signup`}
              className="flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Deploy
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link href={`/models/${model.slug}`} className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-colors hover:text-white">
              Details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ModelsPage() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const { data: models, isLoading } = useModels(activeCategory);

  const filtered = models?.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="border-b border-white/10 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            <Brain className="h-3 w-3" /> Models Hub
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">AI Models</h1>
          <p className="mt-4 text-lg text-gray-400">
            Deploy state-of-the-art open-source models on enterprise GPUs. One click to launch.
          </p>
        </motion.div>
      </section>

      {/* Search + Filters + Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search models…"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(undefined)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${!activeCategory ? "bg-indigo-600 text-white" : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"}`}
            >
              All
            </button>
            {MODEL_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(activeCategory === cat.value ? undefined : cat.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeCategory === cat.value ? "bg-indigo-600 text-white" : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((m) => <ModelCard key={m.id} model={m} />)}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Brain className="mx-auto h-12 w-12 text-gray-700" />
              <h3 className="mt-4 text-lg font-medium text-white">No models found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
              <Link href="/auth/signup" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
