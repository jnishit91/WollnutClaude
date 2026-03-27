"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Layers, Star, Package, Cpu, ArrowRight, Rocket } from "lucide-react";
import { useTemplates, type TemplateData } from "@/lib/hooks/use-plans";
import { TEMPLATE_CATEGORIES } from "@/lib/constants/gpu-plans";
import { Spinner } from "@/components/shared/Spinner";

const ICON_MAP: Record<string, string> = {
  pytorch: "🔥",
  tensorflow: "🧠",
  vllm: "⚡",
  comfyui: "🎨",
  jax: "🔬",
  whisper: "🎙️",
  ubuntu: "🐧",
  finetune: "🎯",
};

function TemplateCard({ template }: { template: TemplateData }) {
  const icon = ICON_MAP[template.icon ?? ""] ?? "📦";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 hover:bg-white/8"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xl">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{template.name}</h3>
            <span className="text-xs text-gray-500">{template.category}</span>
          </div>
        </div>
        {template.featured && (
          <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-400">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">
        {template.description.length > 100 ? template.description.slice(0, 100) + "…" : template.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {template.includedPackages.slice(0, 3).map((pkg) => (
          <span key={pkg} className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-gray-300">
            <Package className="h-3 w-3 text-gray-500" />{pkg}
          </span>
        ))}
        {template.includedPackages.length > 3 && (
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-gray-500">
            +{template.includedPackages.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Cpu className="h-3.5 w-3.5" />
          {template.recommendedGpu ?? "Any GPU"}
        </div>
        <Link
          href={`/auth/signup`}
          className="flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          <Rocket className="h-3.5 w-3.5" />
          Deploy
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
    return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="border-b border-white/10 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            <Layers className="h-3 w-3" /> Ready-to-deploy
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">ML Templates</h1>
          <p className="mt-4 text-lg text-gray-400">
            Pre-configured environments with all dependencies installed. Launch in under 60 seconds.
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
              placeholder="Search templates…"
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
            {TEMPLATE_CATEGORIES.map((cat) => (
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
              {filtered.map((t) => <TemplateCard key={t.id} template={t} />)}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Layers className="mx-auto h-12 w-12 text-gray-700" />
              <h3 className="mt-4 text-lg font-medium text-white">No templates found</h3>
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
