"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Cpu,
  MemoryStick,
  Scale,
  Star,
  Rocket,
  ExternalLink,
  FileText,
  Shield,
} from "lucide-react";
import { useModel } from "@/lib/hooks/use-plans";
import { Spinner } from "@/components/shared/Spinner";

export default function ModelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const slug = resolvedParams.slug;
  const { data: model, isLoading } = useModel(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-950">
        <Brain className="h-12 w-12 text-surface-600" />
        <h2 className="mt-4 text-lg font-medium text-white">
          Model not found
        </h2>
        <Link
          href="/models"
          className="mt-4 text-sm text-brand-400 hover:text-brand-300"
        >
          Back to Models Hub
        </Link>
      </div>
    );
  }

  const specs = [
    {
      icon: Scale,
      label: "Parameters",
      value: model.parameters ? `${model.parameters}` : null,
    },
    {
      icon: MemoryStick,
      label: "Context Length",
      value: model.contextLength,
    },
    {
      icon: Cpu,
      label: "VRAM Required",
      value: model.vramRequired,
    },
    {
      icon: Cpu,
      label: "Recommended GPU",
      value: model.recommendedGpu,
    },
    {
      icon: Shield,
      label: "License",
      value: model.licenseType,
    },
    {
      icon: FileText,
      label: "Category",
      value: model.category,
    },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="border-b border-surface-800/50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <Link
            href="/models"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Models Hub
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">
                    {model.name}
                  </h1>
                  {model.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-accent-amber/10 px-2.5 py-1 text-xs font-bold text-accent-amber">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-surface-400">
                  by {model.provider}
                </p>
              </div>
              <div className="flex gap-3">
                {model.huggingFaceId && (
                  <a
                    href={`https://huggingface.co/${model.huggingFaceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-surface-700 px-4 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-white"
                  >
                    HuggingFace
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {model.templateSlug ? (
                  <Link
                    href={`/dashboard/instances/new?template=${model.templateSlug}`}
                    className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    <Rocket className="h-4 w-4" />
                    Deploy Now
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/instances/new"
                    className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    <Rocket className="h-4 w-4" />
                    Launch Instance
                  </Link>
                )}
              </div>
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
              <h2 className="text-lg font-semibold text-white">About</h2>
              <p className="mt-3 leading-relaxed text-surface-300">
                {model.description}
              </p>
            </section>

            {/* HuggingFace Info */}
            {model.huggingFaceId && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-white">
                  HuggingFace
                </h2>
                <div className="rounded-lg border border-surface-800 bg-surface-900 p-4">
                  <code className="text-sm text-brand-400">
                    {model.huggingFaceId}
                  </code>
                  <p className="mt-2 text-xs text-surface-500">
                    Use this model ID to download weights or reference the model
                    on HuggingFace.
                  </p>
                </div>
              </section>
            )}

            {/* Deploy Info */}
            {model.templateSlug && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-white">
                  One-Click Deploy
                </h2>
                <div className="rounded-lg border border-brand-500/20 bg-brand-500/5 p-4">
                  <p className="text-sm text-surface-300">
                    This model has a pre-configured template for one-click
                    deployment. Click &quot;Deploy Now&quot; to launch an
                    instance with everything set up automatically.
                  </p>
                  <Link
                    href={`/templates/${model.templateSlug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-400 hover:text-brand-300"
                  >
                    View template details
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-surface-800 bg-surface-900 p-5">
              <h3 className="text-sm font-semibold text-white">
                Specifications
              </h3>
              <div className="mt-4 space-y-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-start gap-3">
                    <spec.icon className="mt-0.5 h-4 w-4 text-surface-500" />
                    <div>
                      <p className="text-xs text-surface-500">{spec.label}</p>
                      <p className="text-sm text-white">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {model.templateSlug ? (
              <Link
                href={`/dashboard/instances/new?template=${model.templateSlug}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                <Rocket className="h-4 w-4" />
                Deploy this Model
              </Link>
            ) : (
              <Link
                href="/dashboard/instances/new"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                <Rocket className="h-4 w-4" />
                Launch GPU Instance
              </Link>
            )}

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
