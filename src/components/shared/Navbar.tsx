"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { mainNav } from "@/config/nav";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-wollnut.png"
            alt="Wollnut Labs"
            width={220}
            height={70}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-surface-400 hover:text-white"
                }`}
              >
                {item.title}
                {item.badge && (
                  <span className="ml-1.5 inline-flex rounded-full bg-brand-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-lg px-4 py-2 text-sm font-medium text-surface-300 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-surface-400 hover:text-white lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-surface-800 bg-surface-950 lg:hidden">
          <nav className="space-y-1 px-4 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-surface-300 hover:bg-surface-800 hover:text-white"
              >
                {item.title}
                {item.badge && (
                  <span className="ml-2 rounded-full bg-brand-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="border-t border-surface-800 pt-4">
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-center text-sm font-medium text-surface-300 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
