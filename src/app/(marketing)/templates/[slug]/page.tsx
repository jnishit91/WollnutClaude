"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Cpu,
  HardDrive,
  Package,
  Layers,
  Star,
  Rocket,
  Tag,
} from "lucide-react";
import { useTemplate } from "@/lib/hooks/use-plans";
import { Spinner } from "@/components/shared/Spinner";

export default function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const slug = resolvedParams.slug;
  const { data: template, isLoading } = useTemplate(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-950">
        <Layers className="h-12 w-12 text-surface-600" />
        <h2 className="mt-4 text-lg font-medium text-white">
          Template not found
        </h2>
        <Link
          href="/templates"
          className="mt-4 text-sm text-brand-400 hover:text-brand-300"
        >
          Back to Templates
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="border-b border-surface-800/50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <Link
            href="/templates"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All Templates
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">
                    {template.name}
                  </h1>
                  {template.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-accent-amber/10 px-2.5 py-1 text-xs font-bold text-accent-amber">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-surface-400">
                  {template.category}
                </p>
              </div>
              <Link
                href={`/dashboard/instances/new?template=${template.slug}`}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                <Rocket className="h-4 w-4" />
                Deploy Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-lg font-semibold text-white">Description</h2>
              <p className="mt-3 leading-relaxed text-surface-300">
                {template.description}
              </p>
            </section>

            {/* Included Packages */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-white">
                Included Packages
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {template.includedPackages.map((pkg) => (
                  <div
                    key={pkg}
                    className="flex items-center gap-2 rounded-lg border border-surface-800 bg-surface-900 px-4 py-3"
                  >
                    <Package className="h-4 w-4 text-brand-400" />
                    <span className="text-sm text-surface-200">{pkg}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Tags */}
            {template.tags.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-white">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-surface-700 px-3 py-1 text-xs text-surface-300"
                    >
                      <Tag className="h-3 w-3 text-surface-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-surface-800 bg-surface-900 p-5">
              <h3 className="text-sm font-semibold text-white">Requirements</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Cpu className="h-4 w-4 text-surface-500" />
                  <span className="text-surface-400">Recommended GPU:</span>
                  <span className="text-white">
                    {template.recommendedGpu ?? "Any"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <HardDrive className="h-4 w-4 text-surface-500" />
                  <span className="text-surface-400">Min VRAM:</span>
                  <span className="text-white">
                    {template.minVram ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/dashboard/instances/new?template=${template.slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Rocket className="h-4 w-4" />
              Deploy with this Template
            </Link>

            <Link
              href="/pricing"
              className="block w-full rounded-lg border border-surface-700 py-3 text-center text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-white"
            >
              View GPU Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
