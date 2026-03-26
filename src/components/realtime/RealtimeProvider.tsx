"use client";

import { createContext, useContext } from "react";
import { useRealtimeEvents } from "@/lib/hooks/use-realtime";

interface RealtimeContextValue {
  connectionState: "connecting" | "connected" | "disconnected" | "error";
  disconnect: () => void;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  connectionState: "disconnected",
  disconnect: () => {},
});

export function useRealtime() {
  return useContext(RealtimeContext);
}

/**
 * Wraps the dashboard to establish one SSE connection for all real-time updates.
 * Automatically invalidates React Query caches when server events arrive.
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { connectionState, disconnect } = useRealtimeEvents({
    enabled: true,
    showToasts: true,
  });

  return (
    <RealtimeContext.Provider value={{ connectionState, disconnect }}>
      {children}
    </RealtimeContext.Provider>
  );
}
