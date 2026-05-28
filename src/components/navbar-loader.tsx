"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

function NavbarFallback() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] h-16 border-b border-gray-200 bg-white/95 dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <BrandLogo variant="navbar" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/**
 * Navbar is not SSR’d so auth hooks never run during static prerender (e.g. `/_not-found`).
 */
const Navbar = dynamic(
  () =>
    import("./navbar").catch(() => ({
      default: NavbarFallback,
    })),
  {
    ssr: false,
    loading: () => <NavbarFallback />,
  },
);

export function NavbarLoader() {
  return <Navbar />;
}
