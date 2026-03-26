"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Request failed");
  return data.data;
}

export interface GPUPlanData {
  id: string;
  e2ePlanId: string;
  gpuName: string;
  gpuShortName: string;
  vram: string;
  vcpus: number;
  ram: string;
  storage: string;
  infiniband: string | null;
  wollnutPricePerHour: number;
  wollnutPricePerMinute: number;
  available: boolean;
  availableCount: string | null;
  category: string;
}

export interface TemplateData {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string | null;
  tags: string[];
  includedPackages: string[];
  recommendedGpu: string | null;
  minVram: string | null;
  featured: boolean;
}

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => fetchJson<GPUPlanData[]>("/api/v1/plans"),
    staleTime: 5 * 60_000,
  });
}

export function useTemplates(category?: string) {
  const url = category
    ? `/api/v1/templates?category=${encodeURIComponent(category)}`
    : "/api/v1/templates";

  return useQuery({
    queryKey: ["templates", category ?? "all"],
    queryFn: () => fetchJson<TemplateData[]>(url),
    staleTime: 5 * 60_000,
  });
}
