"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { dashboardNav } from "@/config/nav";
import {
  LayoutDashboard,
  Server,
  PlusCircle,
  CreditCard,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  "layout-dashboard": LayoutDashboard,
  server: Server,
  "plus-circle": PlusCircle,
  "credit-card": CreditCard,
  settings: Settings,
  bell: Bell,
};

function SidebarContent({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-surface-800 px-6">
        <Link href="/" className="flex items-center gap-2" onClick={onLinkClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            W
          </div>
          <span className="text-lg font-bold text-white">Wollnut</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 scrollbar-thin">
        {dashboardNav.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = ICON_MAP[item.icon ?? ""] ?? LayoutDashboard;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-600/10 text-brand-400"
                        : "text-surface-400 hover:bg-surface-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="border-t border-surface-800 px-3 py-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-surface-500">
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <span key={href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {isLast ? (
              <span className="text-surface-300">{label}</span>
            ) : (
              <Link href={href} className="hover:text-white">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-950">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-surface-800 bg-surface-900 lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-surface-800 bg-surface-900 transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          pathname={pathname}
          onLinkClick={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-surface-800 bg-surface-900/50 px-4 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-surface-400 hover:text-white lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Breadcrumbs pathname={pathname} />
          </div>

          <div className="flex items-center gap-4">
            {/* Credits */}
            <div className="hidden items-center gap-1.5 rounded-lg bg-surface-800 px-3 py-1.5 sm:flex">
              <span className="text-xs text-surface-400">Credits</span>
              <span className="text-sm font-semibold text-accent-green">
                ${session?.user?.creditsBalance?.toFixed(2) ?? "0.00"}
              </span>
            </div>

            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="relative rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
            >
              <Bell className="h-5 w-5" />
            </Link>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden text-sm font-medium text-surface-200 md:block">
                {session?.user?.name ?? "User"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
