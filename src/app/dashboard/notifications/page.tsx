"use client";

import { useState } from "react";
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
} from "@/lib/hooks/use-notifications";
import { SkeletonRow } from "@/components/shared/Skeleton";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Server,
  CreditCard,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Mail,
  MailOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Helpers ───────────────────────────────── */
type NotificationType = "info" | "warning" | "success" | "error" | string;

function typeConfig(type: string): {
  icon: React.ElementType;
  color: string;
  bg: string;
  label: string;
} {
  // Map specific notification types to visual categories
  if (type === "low_credits" || type === "warning")
    return {
      icon: AlertTriangle,
      color: "text-accent-amber",
      bg: "bg-accent-amber/10",
      label: "Warning",
    };
  if (
    type === "credits_added" ||
    type === "success" ||
    type === "instance_ready"
  )
    return {
      icon: CheckCircle2,
      color: "text-accent-green",
      bg: "bg-accent-green/10",
      label: "Success",
    };
  if (
    type === "instance_failed" ||
    type === "error" ||
    type === "instance_error"
  )
    return {
      icon: XCircle,
      color: "text-accent-red",
      bg: "bg-accent-red/10",
      label: "Error",
    };
  if (type.startsWith("instance_"))
    return {
      icon: Server,
      color: "text-brand-400",
      bg: "bg-brand-400/10",
      label: "Instance",
    };
  if (type.startsWith("billing") || type.startsWith("credit"))
    return {
      icon: CreditCard,
      color: "text-accent-amber",
      bg: "bg-accent-amber/10",
      label: "Billing",
    };
  return {
    icon: Info,
    color: "text-brand-400",
    bg: "bg-brand-400/10",
    label: "Info",
  };
}

function timeAgo(date: string): string {
  const ms = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

type FilterTab = "all" | "unread";

/* ── Empty state ───────────────────────────── */
function EmptyNotifications() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 ring-1 ring-surface-700"
      >
        <BellOff className="h-8 w-8 text-surface-500" />
      </motion.div>
      <h2 className="mt-6 text-lg font-semibold text-white">
        No notifications yet
      </h2>
      <p className="mt-2 max-w-sm text-sm text-surface-500">
        We&apos;ll let you know when something important happens — like instance
        status changes, billing updates, or system alerts.
      </p>
    </motion.div>
  );
}

/* ── Notification row ──────────────────────── */
function NotificationRow({
  notification,
  onToggleRead,
}: {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
    actionUrl: string | null;
    read: boolean;
    createdAt: string;
  };
  onToggleRead: (id: string, currentlyRead: boolean) => void;
}) {
  const cfg = typeConfig(notification.type);
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2 }}
      className={`group flex items-start gap-4 rounded-xl border px-5 py-4 transition-colors ${
        notification.read
          ? "border-surface-800/60 bg-surface-900/40"
          : "border-surface-800 bg-surface-900"
      }`}
    >
      {/* Type icon */}
      <div
        className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}
      >
        <Icon className={`h-4 w-4 ${cfg.color}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`truncate text-sm ${
              notification.read
                ? "text-surface-400"
                : "font-medium text-white"
            }`}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
          )}
          <span className="ml-auto flex-shrink-0 text-[11px] text-surface-600">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p
          className={`mt-0.5 text-xs ${
            notification.read ? "text-surface-600" : "text-surface-500"
          }`}
        >
          {notification.message}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bg} ${cfg.color}`}
          >
            {cfg.label}
          </span>
          {notification.actionUrl && (
            <a
              href={notification.actionUrl}
              className="text-[11px] font-medium text-brand-400 hover:text-brand-300"
            >
              View details
            </a>
          )}
        </div>
      </div>

      {/* Mark read / unread button */}
      <button
        onClick={() => onToggleRead(notification.id, notification.read)}
        title={notification.read ? "Mark as unread" : "Mark as read"}
        className="mt-1 flex-shrink-0 rounded-lg p-1.5 text-surface-600 opacity-0 transition-all hover:bg-surface-800 hover:text-surface-300 group-hover:opacity-100"
      >
        {notification.read ? (
          <Mail className="h-4 w-4" />
        ) : (
          <MailOpen className="h-4 w-4" />
        )}
      </button>
    </motion.div>
  );
}

/* ── Main page ─────────────────────────────── */
export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const [filter, setFilter] = useState<FilterTab>("all");

  const handleToggleRead = (id: string, currentlyRead: boolean) => {
    // For now, only mark-as-read is supported by the API
    if (!currentlyRead) {
      markRead.mutate(id);
    }
  };

  const handleMarkAllRead = () => {
    const unreadIds = (notifications ?? [])
      .filter((n) => !n.read)
      .map((n) => n.id);
    if (unreadIds.length > 0) markAllRead.mutate(unreadIds);
  };

  const filtered =
    filter === "unread"
      ? (notifications ?? []).filter((n) => !n.read)
      : (notifications ?? []);

  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 rounded-lg bg-surface-800 px-3 py-1.5 text-xs font-medium text-surface-300 transition-colors hover:bg-surface-700 hover:text-white"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="mt-4 flex gap-1 rounded-lg bg-surface-900 p-1">
        {(["all", "unread"] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === tab
                ? "bg-surface-800 text-white"
                : "text-surface-500 hover:text-surface-300"
            }`}
          >
            {tab}
            {tab === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 text-brand-400">({unreadCount})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 space-y-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          filter === "unread" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-16 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-900 ring-1 ring-surface-800">
                <Check className="h-6 w-6 text-accent-green" />
              </div>
              <p className="mt-4 text-sm font-medium text-white">
                All caught up!
              </p>
              <p className="mt-1 text-xs text-surface-500">
                No unread notifications
              </p>
            </motion.div>
          ) : (
            <EmptyNotifications />
          )
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onToggleRead={handleToggleRead}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
