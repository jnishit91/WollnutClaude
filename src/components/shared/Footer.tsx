import Link from "next/link";
import Image from "next/image";
import { footerNav } from "@/config/nav";

export function Footer() {
  return (
    <footer className="border-t border-surface-800/50 bg-surface-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Wollnut Labs"
                width={160}
                height={50}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-surface-400">
              Enterprise GPU cloud for AI/ML workloads. Deploy H100, H200, and
              B200 GPUs on-demand with per-minute billing.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="mt-4 space-y-2.5">
              {footerNav.product.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-surface-400 transition-colors hover:text-white"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-sm font-semibold text-white">Developers</h3>
            <ul className="mt-4 space-y-2.5">
              {footerNav.developers.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-surface-400 transition-colors hover:text-white"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-surface-400 transition-colors hover:text-white"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-800 pt-8 sm:flex-row">
          <p className="text-xs text-surface-500">
            &copy; {new Date().getFullYear()} Wollnut Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-xs text-surface-500 hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-surface-500 hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/status"
              className="text-xs text-surface-500 hover:text-white"
            >
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
