"use client";

import dynamic from "next/dynamic";

/**
 * Navbar is not SSR’d so auth hooks never run during static prerender (e.g. `/_not-found`).
 * Avoids crashes if an older deploy or cache still referenced Clerk’s `useUser` without a provider.
 */
const Navbar = dynamic(() => import("./navbar"), {
  ssr: false,
  loading: () => (
    <nav
      className="fixed top-0 left-0 right-0 z-[60] h-16 border-b border-gray-200 bg-white/95 dark:border-gray-800 dark:bg-gray-900/95"
      aria-hidden
    />
  ),
});

export function NavbarLoader() {
  return <Navbar />;
}
