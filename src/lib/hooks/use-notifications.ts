// src/lib/hooks/use-notifications.ts
// React Query hooks for notifications

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "@/lib/constants/routes";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  read: boolean;
  createdAt: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data;
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => fetchJson(API_ROUTES.NOTIFICATIONS.LIST),
    refetchInterval: 60_000, // Slow poll — SSE handles real-time invalidation
  });
}

export function useUnreadCount() {
  return useQuery<number>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const data = await fetchJson<Notification[]>(
        `${API_ROUTES.NOTIFICATIONS.LIST}?unreadOnly=true`
      );
      return data.length;
    },
    refetchInterval: 60_000, // Slow poll — SSE handles real-time invalidation
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(API_ROUTES.NOTIFICATIONS.MARK_READ(id), {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to mark notification as read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) =>
          fetch(API_ROUTES.NOTIFICATIONS.MARK_READ(id), { method: "POST" })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
