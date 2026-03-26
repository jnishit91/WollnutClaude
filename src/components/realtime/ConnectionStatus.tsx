"use client";

import { Wifi, WifiOff, Loader2 } from "lucide-react";

interface ConnectionStatusProps {
  state: "connecting" | "connected" | "disconnected" | "error";
  className?: string;
}

const CONFIG = {
  connecting: {
    icon: Loader2,
    label: "Connecting...",
    dot: "bg-accent-amber",
    text: "text-accent-amber",
    animate: true,
  },
  connected: {
    icon: Wifi,
    label: "Live",
    dot: "bg-accent-green",
    text: "text-accent-green",
    animate: false,
  },
  disconnected: {
    icon: WifiOff,
    label: "Offline",
    dot: "bg-surface-500",
    text: "text-surface-500",
    animate: false,
  },
  error: {
    icon: WifiOff,
    label: "Reconnecting...",
    dot: "bg-accent-red",
    text: "text-accent-red",
    animate: false,
  },
};

export function ConnectionStatus({ state, className = "" }: ConnectionStatusProps) {
  const config = CONFIG[state];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-surface-800 bg-surface-900 px-2.5 py-1 ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dot} ${
          state === "connected" ? "animate-pulse" : ""
        }`}
      />
      <Icon
        className={`h-3 w-3 ${config.text} ${
          config.animate ? "animate-spin" : ""
        }`}
      />
      <span className={`text-[10px] font-medium ${config.text}`}>
        {config.label}
      </span>
    </div>
  );
}
