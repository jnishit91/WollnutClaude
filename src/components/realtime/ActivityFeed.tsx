"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Server,
  CreditCard,
  AlertTriangle,
  Bell,
  Trash2,
  Play,
  Square,
  Plus,
} from "lucide-react";

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

function activityIcon(type: string) {
  switch (type) {
    case "instance:created":
      return <Plus className="h-3.5 w-3.5 text-accent-green" />;
    case "instance:status_changed":
      return <Server className="h-3.5 w-3.5 text-brand-400" />;
    case "instance:started":
      return <Play className="h-3.5 w-3.5 text-accent-green" />;
    case "instance:stopped":
      return <Square className="h-3.5 w-3.5 text-accent-amber" />;
    case "instance:destroyed":
      return <Trash2 className="h-3.5 w-3.5 text-accent-red" />;
    case "billing:credits_added":
      return <CreditCard className="h-3.5 w-3.5 text-accent-green" />;
    case "billing:credits_deducted":
      return <CreditCard className="h-3.5 w-3.5 text-surface-400" />;
    case "billing:low_balance":
      return <AlertTriangle className="h-3.5 w-3.5 text-accent-red" />;
    default:
      return <Bell className="h-3.5 w-3.5 text-surface-400" />;
  }
}

function timeAgo(timestamp: string): string {
  const ms = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(ms / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface ActivityFeedProps {
  maxItems?: number;
  className?: string;
}

/**
 * Real-time activity feed that listens to the SSE event stream.
 * Accumulates events and displays them in reverse-chronological order.
 */
export function ActivityFeed({
  maxItems = 20,
  className = "",
}: ActivityFeedProps) {
  const [items, setItems] = useState<ActivityItem[]>([]);

  const addItem = useCallback(
    (item: ActivityItem) => {
      setItems((prev) => {
        const next = [item, ...prev];
        return next.slice(0, maxItems);
      });
    },
    [maxItems]
  );

  useEffect(() => {
    const es = new EventSource("/api/v1/events/stream");

    const handleEvent = (type: string) => (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (type === "instance:status_changed" && !data.initial) {
          for (const inst of data.instances ?? []) {
            const statusLabel = (inst.status as string)
              .toLowerCase()
              .replace("_", " ");
            addItem({
              id: `${inst.id}-${Date.now()}`,
              type:
                inst.status === "RUNNING"
                  ? "instance:started"
                  : inst.status === "STOPPED"
                    ? "instance:stopped"
                    : "instance:status_changed",
              title: inst.name ?? "Instance",
              description: inst.previousStatus
                ? `Status: ${inst.previousStatus.toLowerCase()} → ${statusLabel}`
                : `Status: ${statusLabel}`,
              timestamp: new Date().toISOString(),
            });
          }
        }

        if (type === "instance:destroyed") {
          addItem({
            id: `destroyed-${data.id}-${Date.now()}`,
            type: "instance:destroyed",
            title: "Instance destroyed",
            description: `Instance ${data.id.slice(0, 8)}... was deleted`,
            timestamp: new Date().toISOString(),
          });
        }

        if (type === "billing:credits_added") {
          addItem({
            id: `credit-${Date.now()}`,
            type: "billing:credits_added",
            title: "Credits added",
            description: `+$${Number(data.change).toFixed(2)} — Balance: $${Number(data.balance).toFixed(2)}`,
            timestamp: new Date().toISOString(),
          });
        }

        if (type === "billing:low_balance") {
          addItem({
            id: `low-${Date.now()}`,
            type: "billing:low_balance",
            title: "Low balance warning",
            description: `Balance is $${Number(data.balance).toFixed(2)}`,
            timestamp: new Date().toISOString(),
          });
        }

        if (type === "notification:new") {
          for (const n of data.notifications ?? []) {
            addItem({
              id: n.id,
              type: `notification:${n.type}`,
              title: n.title,
              description: n.message,
              timestamp: n.createdAt,
            });
          }
        }
      } catch {
        // Ignore
      }
    };

    es.addEventListener("instance:status_changed", handleEvent("instance:status_changed"));
    es.addEventListener("instance:destroyed", handleEvent("instance:destroyed"));
    es.addEventListener("billing:credits_added", handleEvent("billing:credits_added"));
    es.addEventListener("billing:low_balance", handleEvent("billing:low_balance"));
    es.addEventListener("notification:new", handleEvent("notification:new"));

    return () => es.close();
  }, [addItem]);

  if (items.length === 0) {
    return (
      <div className={`rounded-xl border border-surface-800 bg-surface-900 p-6 ${className}`}>
        <h3 className="text-sm font-semibold text-white">Live Activity</h3>
        <p className="mt-4 text-center text-sm text-surface-500">
          No recent activity. Events will appear here in real time.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-surface-800 bg-surface-900 ${className}`}>
      <div className="border-b border-surface-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Live Activity</h3>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-green" />
            <span className="text-[10px] text-accent-green">Live</span>
          </span>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto scrollbar-thin">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 border-b border-surface-800/50 px-4 py-3 last:border-0"
          >
            <div className="mt-0.5 flex-shrink-0 rounded-md bg-surface-800 p-1.5">
              {activityIcon(item.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-0.5 truncate text-xs text-surface-400">
                {item.description}
              </p>
            </div>
            <span className="flex-shrink-0 text-[10px] text-surface-600">
              {timeAgo(item.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
