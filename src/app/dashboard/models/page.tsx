"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Brain,
  Star,
  Cpu,
  MemoryStick,
  Scale,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { useModels, type ModelData } from "@/lib/hooks/use-plans";
import { MODEL_CATEGORIES } from "@/lib/constants/gpu-plans";
import { Spinner } from "@/components/shared/Spinner";

const PROVIDER_COLORS: Record<string, string> = {
  DeepSeek: "bg-blue-500/10 text-blue-400",
  Meta: "bg-indigo-500/10 text-indigo-400",
  "Stability AI": "bg-purple-500/10 text-purple-400",
  OpenAI: "bg-green-500/10 text-green-400",
  Mistral: "bg-orange-500/10 text-orange-400",
  Google: "bg-cyan-500/10 text-cyan-400",
  Microsoft: "bg-teal-500/10 text-teal-400",
  NousResearch: "bg-rose-500/10 text-rose-400",
  "Sarvam AI": "bg-amber-500/10 text-amber-400",
  "Cognitive Computations": "bg-pink-500/10 text-pink-400",
};

function ModelCard({ model }: { model: ModelData }) {
  const providerStyle =
    PROVIDER_COLORS[model.provider] ?? "bg-surface-700/50 text-surface-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col rounded-xl border border-surface-800 bg-surface-900 p-5 transition-colors hover:border-surface-700"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{model.name}</h3>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${providerStyle}`}
          >
            {model.provider}
          </span>
        </div>
        {model.featured && (
          <span className="flex items-center gap-1 rounded-full bg-accent-amber/10 px-2 py-0.5 text-[10px] font-bold text-accent-amber">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-surface-400">
        {model.description.length > 90
          ? model.description.slice(0, 90) + "..."
          : model.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {model.parameters && (
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <Scale className="h-3.5 w-3.5 text-surface-500" />
            {model.parameters}
          </div>
        )}
        {model.contextLength && (
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <MemoryStick className="h-3.5 w-3.5 text-surface-500" />
            {model.contextLength}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-surface-400">
          <Cpu className="h-3.5 w-3.5 text-surface-500" />
          {model.vramRequired}
        </div>
        {model.licenseType && (
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <Scale className="h-3.5 w-3.5 text-surface-500" />
            {model.licenseType}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-800 pt-4">
        <span className="rounded-md bg-surface-800 px-2 py-0.5 text-[11px] text-surface-400">
          {model.category}
        </span>
        {model.templateSlug ? (
          <Link
            href={`/dashboard/instances/new?template=${model.templateSlug}`}
            className="flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
          >
            <Rocket className="h-3.5 w-3.5" />
            Deploy
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <Link
            href={`/models/${model.slug}`}
            className="flex items-center gap-1 text-sm font-medium text-surface-400 transition-colors hover:text-white"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function DashboardModelsPage() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const { data: models, isLoading } = useModels(activeCategory);

  const filtered = models?.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.provider.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Models</h1>
          <p className="mt-1 text-sm text-surface-400">
            Deploy state-of-the-art models on enterprise GPUs
          </p>
        </div>
        <Link
          href="/dashboard/instances/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          New Instance
        </Link>
      </div>

      {/* Search & filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models..."
            className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2 pl-10 pr-4 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory(undefined)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-brand-600 text-white"
                : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            All
          </button>
          {MODEL_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() =>
                setActiveCategory(
                  activeCategory === cat.value ? undefined : cat.value
                )
              }
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-brand-600 text-white"
                  : "bg-surface-800 text-surface-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Brain className="mx-auto h-12 w-12 text-surface-600" />
            <h3 className="mt-4 text-lg font-medium text-white">
              No models found
            </h3>
            <p className="mt-1 text-sm text-surface-400">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
