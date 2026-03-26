"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Request failed");
  }
  return data.data;
}

export function useInstances() {
  return useQuery({
    queryKey: ["instances"],
    queryFn: () => fetchJson<Record<string, unknown>[]>("/api/v1/instances"),
  });
}

export function useInstance(id: string) {
  return useQuery({
    queryKey: ["instances", id],
    queryFn: () =>
      fetchJson<Record<string, unknown>>(`/api/v1/instances/${id}`),
    enabled: !!id,
  });
}

export function useCreateInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetchJson<Record<string, unknown>>("/api/v1/instances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instances"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useInstanceAction(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "start" | "stop" | "reboot") =>
      fetchJson<Record<string, unknown>>(
        `/api/v1/instances/${id}/${action}`,
        { method: "POST" }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instances"] });
      queryClient.invalidateQueries({ queryKey: ["instances", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDestroyInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<Record<string, unknown>>(`/api/v1/instances/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instances"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
