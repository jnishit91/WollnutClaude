"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CreditCard, Server, AlertTriangle, Check } from "lucide-react";
import {
  useNotifications,
  useUnreadCount,
  useMarkRead,
  useMarkAllRead,
} from "@/lib/hooks/use-notifications";

function timeAgo(date: string): string {
  const ms = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function notificationIcon(type: string) {
  if (type.startsWith("instance_")) return <Server className="h-4 w-4" />;
  if (type === "credits_added") return <CreditCard className="h-4 w-4" />;
  if (type === "low_credits") return <AlertTriangle className="h-4 w-4" />;
  return <Bell className="h-4 w-4" />;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleNotificationClick = (n: {
    id: string;
    actionUrl: string | null;
    read: boolean;
  }) => {
    if (!n.read) markRead.mutate(n.id);
    if (n.actionUrl) router.push(n.actionUrl);
    setOpen(false);
  };

  const handleMarkAllRead = () => {
    const unreadIds = (notifications ?? [])
      .filter((n) => !n.read)
      .map((n) => n.id);
    if (unreadIds.length > 0) markAllRead.mutate(unreadIds);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {(unreadCount ?? 0) > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent-red px-1 text-[10px] font-bold text-white">
            {unreadCount! > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-surface-700 bg-surface-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-700 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {(unreadCount ?? 0) > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {!notifications || notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-surface-500">
                No notifications
              </p>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-700/50 ${
                    !n.read ? "bg-surface-800/80" : ""
                  }`}
                >
                  <div
                    className={`mt-0.5 flex-shrink-0 ${
                      !n.read ? "text-brand-400" : "text-surface-500"
                    }`}
                  >
                    {notificationIcon(n.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`truncate text-sm ${
                          !n.read
                            ? "font-medium text-white"
                            : "text-surface-300"
                        }`}
                      >
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-surface-500">
                      {n.message}
                    </p>
                    <p className="mt-1 text-[10px] text-surface-600">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
