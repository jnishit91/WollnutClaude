"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Request failed");
  return data.data;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () =>
      fetchJson<{
        activeInstances: number;
        creditsBalance: number;
        monthSpend: number;
        totalGpuHours: number;
        recentTransactions: {
          id: string;
          type: string;
          amount: number;
          description: string;
          createdAt: string;
        }[];
        dailyUsage: { date: string; hours: number; cost: number }[];
      }>("/api/v1/dashboard/stats"),
    refetchInterval: 60_000,
  });
}
