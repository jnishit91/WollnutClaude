"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  Plus,
  Activity,
  Clock,
  Zap,
  ExternalLink,
  MoreVertical,
  Circle,
} from "lucide-react";

// Mock data — in production, this would come from the API
const MOCK_ENDPOINTS = [
  {
    id: "ep_1",
    name: "llama-3-70b-prod",
    model: "meta-llama/Llama-3.1-70B",
    status: "running",
    replicas: 2,
    requestsToday: 12_450,
    avgLatency: 142,
    costToday: 1_280,
    createdAt: "2026-03-15",
  },
  {
    id: "ep_2",
    name: "whisper-transcription",
    model: "openai/whisper-large-v3",
    status: "running",
    replicas: 1,
    requestsToday: 3_200,
    avgLatency: 890,
    costToday: 420,
    createdAt: "2026-03-20",
  },
  {
    id: "ep_3",
    name: "deepseek-r1-staging",
    model: "deepseek-ai/DeepSeek-R1-8B",
    status: "scaling",
    replicas: 1,
    requestsToday: 890,
    avgLatency: 95,
    costToday: 180,
    createdAt: "2026-03-25",
  },
];

const statusStyles: Record<string, { dot: string; label: string; bg: string }> = {
  running: { dot: "bg-green-400", label: "Running", bg: "bg-green-500/10 text-green-400" },
  scaling: { dot: "bg-yellow-400", label: "Scaling", bg: "bg-yellow-500/10 text-yellow-400" },
  stopped: { dot: "bg-gray-500", label: "Stopped", bg: "bg-gray-500/10 text-gray-400" },
  error: { dot: "bg-red-400", label: "Error", bg: "bg-red-500/10 text-red-400" },
};

export default function EndpointsDashboardPage() {
  const [endpoints] = useState(MOCK_ENDPOINTS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Endpoints</h1>
          <p className="mt-1 text-sm text-gray-400">
            Deploy and manage AI model API endpoints.
          </p>
        </div>
        <Link
          href="/dashboard/models"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Deploy Model
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Active Endpoints", value: endpoints.filter((e) => e.status === "running").length.toString(), icon: Rocket },
          { label: "Total Requests Today", value: endpoints.reduce((sum, e) => sum + e.requestsToday, 0).toLocaleString(), icon: Activity },
          { label: "Avg Latency", value: `${Math.round(endpoints.reduce((sum, e) => sum + e.avgLatency, 0) / endpoints.length)}ms`, icon: Clock },
          { label: "Cost Today", value: `₹${endpoints.reduce((sum, e) => sum + e.costToday, 0).toLocaleString()}`, icon: Zap },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <stat.icon className="h-3.5 w-3.5" />
              {stat.label}
            </div>
            <p className="mt-2 text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Endpoints List */}
      {endpoints.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Endpoint</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">Model</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th className="hidden px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">Requests</th>
                <th className="hidden px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 lg:table-cell">Latency</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Cost Today</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {endpoints.map((ep, i) => {
                const st = (statusStyles[ep.status] ?? statusStyles.stopped) as { dot: string; label: string; bg: string };
                return (
                  <motion.tr
                    key={ep.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{ep.name}</div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {ep.replicas} replica{ep.replicas > 1 ? "s" : ""}
                      </div>
                    </td>
                    <td className="hidden px-5 py-4 text-gray-400 md:table-cell">
                      <code className="text-xs">{ep.model}</code>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.bg}`}>
                        <Circle className={`h-1.5 w-1.5 fill-current`} />
                        {st.label}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-right text-gray-300 sm:table-cell">
                      {ep.requestsToday.toLocaleString()}
                    </td>
                    <td className="hidden px-5 py-4 text-right text-gray-300 lg:table-cell">
                      {ep.avgLatency}ms
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-white">
                      ₹{ep.costToday.toLocaleString()}
                    </td>
                    <td className="px-3 py-4">
                      <button className="rounded-lg p-1.5 text-gray-500 hover:bg-white/10 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 py-16 text-center">
          <Rocket className="mx-auto h-12 w-12 text-gray-700" />
          <h3 className="mt-4 text-lg font-medium text-white">No endpoints yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Deploy your first AI model as a production API endpoint.
          </p>
          <Link
            href="/dashboard/models"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Deploy a Model
          </Link>
        </div>
      )}

      {/* API Info */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-semibold text-white">API Base URL</h3>
        <p className="mt-1 text-sm text-gray-400">
          All endpoints are OpenAI-compatible. Use any OpenAI SDK — just change the base URL.
        </p>
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/10 bg-gray-950 px-4 py-2.5">
          <code className="flex-1 text-sm text-indigo-400">https://api.wollnut.ai/v1</code>
          <Link
            href="/developers"
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white"
          >
            API Docs <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
