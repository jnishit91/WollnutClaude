"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Server } from "lucide-react";
import { Spinner } from "@/components/shared/Spinner";

interface InstanceData {
  id: string;
  name: string;
  status: string;
  gpuType: string;
  gpuCount: number;
  pricePerHour: number;
  totalBilledAmount: number;
  ipAddress: string | null;
  createdAt: string;
  startedAt: string | null;
  user: { id: string; name: string | null; email: string };
}

const STATUS_STYLES: Record<string, string> = {
  Running: "bg-accent-green/10 text-accent-green",
  Stopped: "bg-surface-500/10 text-surface-500",
  Provisioning: "bg-accent-amber/10 text-accent-amber",
  Stopping: "bg-accent-amber/10 text-accent-amber",
  Starting: "bg-accent-amber/10 text-accent-amber",
  Failed: "bg-accent-red/10 text-accent-red",
  Destroyed: "bg-surface-600/10 text-surface-600",
};

async function fetchInstances(status: string) {
  const url = status
    ? `/api/v1/admin/instances?status=${status}`
    : "/api/v1/admin/instances";
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to load");
  return data.data as InstanceData[];
}

export default function AdminInstancesPage() {
  const [statusFilter, setStatusFilter] = useState("");

  const { data: instances, isLoading } = useQuery({
    queryKey: ["admin-instances", statusFilter],
    queryFn: () => fetchInstances(statusFilter),
    staleTime: 15_000,
  });

  const statuses = ["", "Running", "Stopped", "Provisioning", "Failed", "Destroyed"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">All Instances</h1>
        <span className="text-sm text-surface-400">
          {instances?.length ?? 0} instances
        </span>
      </div>

      {/* Status filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-brand-600 text-white"
                : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-8 flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-surface-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800 bg-surface-900/50">
                <th className="px-4 py-3 text-left font-medium text-surface-400">Instance</th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">Owner</th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">GPU</th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">IP</th>
                <th className="px-4 py-3 text-right font-medium text-surface-400">$/hr</th>
                <th className="px-4 py-3 text-right font-medium text-surface-400">Total Billed</th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">Created</th>
              </tr>
            </thead>
            <tbody>
              {instances?.map((inst) => (
                <tr
                  key={inst.id}
                  className="border-b border-surface-800/50 transition-colors hover:bg-surface-900/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-surface-500" />
                      <span className="font-medium text-white">{inst.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-surface-200">{inst.user.name ?? "—"}</p>
                      <p className="text-xs text-surface-500">{inst.user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        STATUS_STYLES[inst.status] ?? "bg-surface-700/50 text-surface-300"
                      }`}
                    >
                      {inst.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-surface-300">
                    {inst.gpuType} {inst.gpuCount > 1 ? `x${inst.gpuCount}` : ""}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-surface-400">
                    {inst.ipAddress ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-white">
                    ${inst.pricePerHour.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-surface-300">
                    ${inst.totalBilledAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-surface-400">
                    {new Date(inst.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {instances?.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-surface-500">
                    No instances found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
