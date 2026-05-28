"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { Sun, Moon, X, Menu, LayoutDashboard } from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import { BrandLogo } from "./brand-logo";
import { useTranslation } from "react-i18next";
import { isDesignatedAdminEmail } from "@/lib/adminAccess";

// Authentication: Supabase Auth — avatar + name when signed in; Sign in / Get started when not.
function AuthSection() {
  const { t } = useTranslation();
  const { user, isLoaded, isSignedIn } = useSupabaseUser();

  const signOut = async () => {
    if (!isSupabaseBrowserConfigured()) return;
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const display =
    (typeof user?.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name) ||
    (typeof user?.user_metadata?.name === "string" &&
      user.user_metadata.name) ||
    user?.email?.split("@")[0] ||
    "Account";

  const avatarUrl =
    typeof user?.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null;

  if (!isLoaded) {
    return (
      <div className="h-9 w-36 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  if (isSignedIn && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/90 px-2 py-1 dark:border-gray-700 dark:bg-gray-800/80">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
              {display.slice(0, 1).toUpperCase()}
            </div>
          )}
          <span className="hidden max-w-[8rem] truncate text-sm text-gray-800 dark:text-gray-100 xl:inline">
            {display}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={() => void signOut()}
          className="h-9 border-red-200 px-3 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-9 min-w-[5.5rem] border-gray-200 px-4 font-medium dark:border-gray-600"
      >
        <Link href="/login?next=%2Fdashboard">{t("navigation.signIn")}</Link>
      </Button>
      <Button
        size="sm"
        asChild
        className="h-9 min-w-[6.5rem] bg-gradient-to-r from-teal-600 to-teal-700 px-4 font-semibold text-white shadow-sm hover:from-teal-700 hover:to-teal-800"
      >
        <Link href="/signup?next=%2Fclaim-form">
          {t("navigation.getStarted")}
        </Link>
      </Button>
    </div>
  );
}

// Dashboard link component
function DashboardLink({ pathname }: { pathname: string }) {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded, user } = useSupabaseUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    async function checkAdminRole() {
      if (isLoaded && isSignedIn && user) {
        try {
          const userEmail = user.email;
          setIsAdmin(isDesignatedAdminEmail(userEmail ?? undefined));
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } finally {
          setCheckingRole(false);
        }
      } else {
        setCheckingRole(false);
      }
    }

    checkAdminRole();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn || checkingRole) {
    return null;
  }

  return (
    <div className="shrink-0">
      <Link
        href={isAdmin ? "/admin" : "/dashboard"}
        className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          pathname === "/admin" || pathname === "/dashboard"
            ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
            : "text-gray-700 hover:bg-gray-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-teal-400"
        }`}
      >
        {isAdmin ? "Admin" : t("navigation.dashboard")}
      </Link>
    </div>
  );
}

// Dropdown Menu Component

// Mobile auth section
function MobileAuthSection({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded, user } = useSupabaseUser();

  const signOut = async () => {
    if (!isSupabaseBrowserConfigured()) return;
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
    onNavigate?.();
    window.location.href = "/";
  };

  const display =
    (typeof user?.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name) ||
    user?.email?.split("@")[0] ||
    "Account";

  const avatarUrl =
    typeof user?.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null;

  if (!isLoaded) {
    return (
      <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  return (
    <>
      {isSignedIn && user ? (
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 dark:border-gray-700">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                  {display.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {display}
          </p>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => void signOut()}
            className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" asChild className="h-10 w-full">
            <Link href="/login?next=%2Fdashboard" onClick={onNavigate}>
              {t("navigation.signIn")}
            </Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="h-10 w-full bg-gradient-to-r from-teal-600 to-teal-700 font-semibold text-white"
          >
            <Link href="/signup?next=%2Fclaim-form" onClick={onNavigate}>
              {t("navigation.getStarted")}
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}

// Mobile dashboard link
function MobileDashboardLink({
  pathname,
  onClick,
  navItemsLength,
}: {
  pathname: string;
  onClick: () => void;
  navItemsLength: number;
}) {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded, user } = useSupabaseUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    async function checkAdminRole() {
      if (isLoaded && isSignedIn && user) {
        try {
          const userEmail = user.email;
          setIsAdmin(isDesignatedAdminEmail(userEmail ?? undefined));
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } finally {
          setCheckingRole(false);
        }
      } else {
        setCheckingRole(false);
      }
    }

    checkAdminRole();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn || checkingRole) {
    return null;
  }

  return (
    <div
      className="animate-in slide-in-from-left-2 duration-300"
      style={{ animationDelay: `${navItemsLength * 100}ms` }}
    >
      <Link
        href={isAdmin ? "/admin" : "/dashboard"}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
          pathname === "/admin" || pathname === "/dashboard"
            ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
            : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
        }`}
        onClick={onClick}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white">
          <LayoutDashboard className="w-4 h-4" />
        </div>
        <div>
          <div>{isAdmin ? "Admin" : t("navigation.dashboard")}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isAdmin ? "Admin Panel" : "Your Dashboard"}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Theme toggle component
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={toggleTheme}
      className="size-9 shrink-0 rounded-lg border border-gray-200 bg-white/80 text-gray-700 hover:border-teal-300 hover:bg-white dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:border-teal-600"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      )}
    </Button>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const { isSignedIn } = useSupabaseUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle click outside mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[60] border-b border-gray-200 bg-white/95 dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="hidden flex-1 justify-center gap-2 lg:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <div className="h-9 w-[5.5rem] animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-9 w-[6.5rem] animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center hover:opacity-90">
              <BrandLogo variant="navbar" />
            </Link>
          </div>

          {/* Center: primary nav (desktop) */}
          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-0.5">
              <Link
                href="/who-we-are"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/who-we-are"
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                    : "text-gray-700 hover:bg-gray-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-teal-400"
                }`}
              >
                {t("navigation.whoWeAre")}
              </Link>
              <Link
                href="/what-we-do"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/what-we-do"
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                    : "text-gray-700 hover:bg-gray-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-teal-400"
                }`}
              >
                {t("navigation.whatWeDo")}
              </Link>
              <Link
                href="/how-it-works"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/how-it-works"
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                    : "text-gray-700 hover:bg-gray-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-teal-400"
                }`}
              >
                {t("navigation.howItWorks")}
              </Link>
              <Link
                href="/when-to-call-an-attorney"
                className={`hidden rounded-lg px-3 py-2 text-sm font-medium transition-colors xl:inline-flex ${
                  pathname === "/when-to-call-an-attorney"
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                    : "text-gray-700 hover:bg-gray-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-teal-400"
                }`}
              >
                {t("navigation.needHelpShort")}
              </Link>
              <Link
                href="/pricing"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/pricing"
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                    : "text-gray-700 hover:bg-gray-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-teal-400"
                }`}
              >
                {t("navigation.pricing")}
              </Link>
              <DashboardLink pathname={pathname} />
            </div>
          </div>

          {/* Right: utilities + auth (desktop) */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <div
              className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700"
              aria-hidden
            />
            <AuthSection />
          </div>

          {/* Mobile menu toggle */}
          <div className="ml-auto lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-300 bg-white/95 backdrop-blur-xl dark:bg-gray-950/95 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain"
            >
              <div className="px-4 py-6 space-y-2 pb-8">
                {/* Direct Navigation Links */}
                <Link
                  href="/who-we-are"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    pathname === "/who-we-are"
                      ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                      : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {t("navigation.whoWeAre")}
                </Link>

                <Link
                  href="/what-we-do"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    pathname === "/what-we-do"
                      ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                      : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {t("navigation.whatWeDo")}
                </Link>

                <Link
                  href="/how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    pathname === "/how-it-works"
                      ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                      : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {t("navigation.howItWorks")}
                </Link>

                <Link
                  href="/when-to-call-an-attorney"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    pathname === "/when-to-call-an-attorney"
                      ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                      : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {t("navigation.needProfessionalHelp")}
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    pathname === "/pricing"
                      ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                      : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {t("navigation.pricing")}
                </Link>

                {!isSignedIn && (
                  <Link
                    href="/signup?next=%2Fclaim-form"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-3 text-base font-semibold text-white shadow-sm"
                  >
                    {t("navigation.getStarted")}
                  </Link>
                )}

                {/* Dashboard Link */}
                <MobileDashboardLink
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                  navItemsLength={4}
                />

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                {/* Settings Section */}
                <div className="space-y-3 pb-4">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                    Settings
                  </h3>

                  {/* Language Switcher */}
                  <div className="flex justify-center">
                    <LanguageSwitcher />
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>

                  {/* Authentication */}
                  <div className="pt-2">
                    <MobileAuthSection
                      onNavigate={() => setIsMobileMenuOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
      </nav>
    </>
  );
}
