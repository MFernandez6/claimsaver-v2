"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

function NavbarShell({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <Link href="/" className="flex items-center">
            <BrandLogo variant="navbar" />
          </Link>
        </div>
        <div className="hidden flex-1 lg:block" aria-hidden />
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          {children ?? (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-9 min-w-[5.5rem] px-4"
              >
                <Link href="/login?next=%2Fdashboard">Sign in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="h-9 min-w-[6.5rem] bg-gradient-to-r from-teal-600 to-teal-700 px-4 font-semibold text-white"
              >
                <Link href="/signup?next=%2Fclaim-form">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const Navbar = dynamic(
  () =>
    import("./navbar").catch(() => ({
      default: () => <NavbarShell />,
    })),
  {
    ssr: false,
    loading: () => <NavbarShell />,
  },
);

export function NavbarLoader() {
  return <Navbar />;
}
