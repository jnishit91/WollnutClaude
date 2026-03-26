"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePlans } from "@/lib/hooks/use-plans";
import { Spinner } from "@/components/shared/Spinner";
import { RefreshCw, Check, X as XIcon } from "lucide-react";
import { GPU_BADGES } from "@/lib/constants/gpu-plans";

export default function AdminPlansPage() {
  const { data: plans, isLoading } = usePlans();
  const queryClient = useQueryClient();

  const syncPlans = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/admin/plans/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Sync failed");
      return data.data;
    },
    onSuccess: (data) => {
      toast.success(`Synced ${data.planCount} plans`);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">GPU Plans</h1>
        <button
          onClick={() => syncPlans.mutate()}
          disabled={syncPlans.isPending}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {syncPlans.isPending ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Sync from E2E
        </button>
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
                <th className="px-4 py-3 text-left font-medium text-surface-400">GPU</th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">VRAM</th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">vCPUs</th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">RAM</th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">Storage</th>
                <th className="px-4 py-3 text-right font-medium text-surface-400">Wollnut $/hr</th>
                <th className="px-4 py-3 text-right font-medium text-surface-400">$/min</th>
                <th className="px-4 py-3 text-center font-medium text-surface-400">Available</th>
              </tr>
            </thead>
            <tbody>
              {plans?.map((plan) => {
                const badge = GPU_BADGES[plan.gpuShortName];
                return (
                  <tr
                    key={plan.id}
                    className="border-b border-surface-800/50 transition-colors hover:bg-surface-900/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 bg-gradient-to-r ${badge.gradient} text-[10px] font-bold text-white`}
                          >
                            {plan.gpuShortName}
                          </span>
                        )}
                        <span className="font-medium text-white">{plan.gpuName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-300">{plan.vram}</td>
                    <td className="px-4 py-3 text-surface-300">{plan.vcpus}</td>
                    <td className="px-4 py-3 text-surface-300">{plan.ram}</td>
                    <td className="px-4 py-3 text-surface-300">{plan.storage}</td>
                    <td className="px-4 py-3 text-right font-mono text-white">
                      ${plan.wollnutPricePerHour.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-surface-400">
                      ${plan.wollnutPricePerMinute.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {plan.available ? (
                        <Check className="mx-auto h-4 w-4 text-accent-green" />
                      ) : (
                        <XIcon className="mx-auto h-4 w-4 text-accent-red" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
