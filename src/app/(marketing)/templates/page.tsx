"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Layers,
  Star,
  Package,
  Cpu,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useTemplates, type TemplateData } from "@/lib/hooks/use-plans";
import { TEMPLATE_CATEGORIES } from "@/lib/constants/gpu-plans";
import { Spinner } from "@/components/shared/Spinner";

const ICON_MAP: Record<string, React.ReactNode> = {
  pytorch: <span className="text-xl">🔥</span>,
  tensorflow: <span className="text-xl">🧠</span>,
  vllm: <span className="text-xl">⚡</span>,
  comfyui: <span className="text-xl">🎨</span>,
  jax: <span className="text-xl">🔬</span>,
  whisper: <span className="text-xl">🎙️</span>,
  ubuntu: <span className="text-xl">🐧</span>,
  finetune: <span className="text-xl">🎯</span>,
};

function TemplateCard({ template }: { template: TemplateData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="gpu-card group flex flex-col"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800">
            {ICON_MAP[template.icon ?? ""] ?? (
              <Layers className="h-5 w-5 text-brand-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{template.name}</h3>
            <span className="text-xs text-surface-400">{template.category}</span>
          </div>
        </div>
        {template.featured && (
          <span className="flex items-center gap-1 rounded-full bg-accent-amber/10 px-2 py-0.5 text-[10px] font-bold text-accent-amber">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-surface-400">
        {template.description.length > 120
          ? template.description.slice(0, 120) + "..."
          : template.description}
      </p>

      {/* Packages */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {template.includedPackages.slice(0, 4).map((pkg) => (
          <span
            key={pkg}
            className="inline-flex items-center gap-1 rounded-md bg-surface-800 px-2 py-0.5 text-[11px] text-surface-300"
          >
            <Package className="h-3 w-3 text-surface-500" />
            {pkg}
          </span>
        ))}
        {template.includedPackages.length > 4 && (
          <span className="rounded-md bg-surface-800 px-2 py-0.5 text-[11px] text-surface-500">
            +{template.includedPackages.length - 4} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-surface-800 pt-4">
        <div className="flex items-center gap-1 text-xs text-surface-500">
          <Cpu className="h-3.5 w-3.5" />
          {template.recommendedGpu ?? "Any GPU"}
        </div>
        <Link
          href={`/templates/${template.slug}`}
          className="flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const { data: templates, isLoading } = useTemplates(activeCategory);

  const filtered = templates?.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

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
              <Sparkles className="h-4 w-4" />
              Pre-configured Environments
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              GPU Templates
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-400">
              Launch pre-configured environments for ML training, LLM inference,
              image generation, and more. One-click deploy on any GPU.
            </p>
          </motion.div>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(undefined)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !activeCategory
                ? "bg-brand-600 text-white"
                : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            All Templates
          </button>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() =>
                setActiveCategory(
                  activeCategory === cat.value ? undefined : cat.value
                )
              }
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-brand-600 text-white"
                  : "bg-surface-800 text-surface-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Layers className="mx-auto h-12 w-12 text-surface-600" />
            <h3 className="mt-4 text-lg font-medium text-white">
              No templates found
            </h3>
            <p className="mt-1 text-sm text-surface-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
