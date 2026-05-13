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
      <div className="h-10 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isSignedIn && user ? (
        <>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/90 px-2 py-1 dark:border-gray-700 dark:bg-gray-800/80">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                {display.slice(0, 1).toUpperCase()}
              </div>
            )}
            <span className="hidden max-w-[10rem] truncate text-sm text-gray-800 dark:text-gray-100 sm:inline">
              {display}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => void signOut()}
            className="border-red-300 px-3 py-1.5 text-xs text-red-600 hover:border-red-400 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link href="/login?next=%2Fdashboard">
            <Button size="sm" variant="outline" className="px-3">
              {t("navigation.signIn")}
            </Button>
          </Link>
          <Link href="/signup?next=%2Fdashboard">
            <Button
              size="sm"
              className="bg-gradient-to-r from-teal-500 to-teal-700 px-4 text-white shadow-lg hover:from-teal-600 hover:to-teal-800"
            >
              {t("navigation.getStarted")}
            </Button>
          </Link>
        </div>
      )}
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
    <div className="hover:-translate-y-0.5 transition-all duration-300">
      <Link
        href={isAdmin ? "/admin" : "/dashboard"}
        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
          pathname === "/admin" || pathname === "/dashboard"
            ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
            : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
        }`}
      >
        {isAdmin ? "Admin" : t("navigation.dashboard")}
        {(pathname === "/admin" || pathname === "/dashboard") && (
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-teal-700/10 rounded-lg" />
        )}
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
        <div className="space-y-2">
          <Link
            href="/login?next=%2Fdashboard"
            className="block w-full"
            onClick={onNavigate}
          >
            <Button size="sm" variant="outline" className="w-full">
              {t("navigation.signIn")}
            </Button>
          </Link>
          <Link
            href="/signup?next=%2Fdashboard"
            className="block w-full"
            onClick={onNavigate}
          >
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-lg"
            >
              {t("navigation.getStarted")}
            </Button>
          </Link>
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
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-teal-300 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-teal-600 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
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
      <nav className="fixed top-0 left-0 right-0 z-[60] transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo placeholder */}
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>

            {/* Navigation placeholder */}
            <div className="hidden md:flex items-center space-x-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>

            {/* Mobile menu button placeholder */}
            <div className="md:hidden w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-[60]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 hover:opacity-90 transition-opacity duration-300">
              <Link href="/" className="flex items-center">
                <BrandLogo variant="navbar" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Direct Navigation Links */}
              <Link
                href="/who-we-are"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  pathname === "/who-we-are"
                    ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                    : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                }`}
              >
                {t("navigation.whoWeAre")}
              </Link>

              <Link
                href="/what-we-do"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  pathname === "/what-we-do"
                    ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                    : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                }`}
              >
                {t("navigation.whatWeDo")}
              </Link>

              <Link
                href="/how-it-works"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  pathname === "/how-it-works"
                    ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                    : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                }`}
              >
                {t("navigation.howItWorks")}
              </Link>

              <Link
                href="/when-to-call-an-attorney"
                className={`hidden xl:inline-flex px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  pathname === "/when-to-call-an-attorney"
                    ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                    : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                }`}
              >
                {t("navigation.needHelpShort")}
              </Link>

              <Link
                href="/pricing"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  pathname === "/pricing"
                    ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30"
                    : "text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800/50"
                }`}
              >
                {t("navigation.pricing")}
              </Link>

              {/* File Claim CTA — hidden when signed in (use Dashboard / claim flow from there) */}
              {!isSignedIn && (
                <Link
                  href="/claim-form"
                  className="ml-2 px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {t("navigation.submitClaim")}
                </Link>
              )}

              {/* Dashboard Link */}
              <DashboardLink pathname={pathname} />

              {/* Divider */}
              <div
                className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"
                aria-hidden
              />

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Authentication */}
              <AuthSection />

              {/* Theme Toggle */}
              <div className="hover:scale-105 transition-all duration-300 ml-2">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-teal-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-800 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
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

                {/* File Claim CTA — hidden when signed in */}
                {!isSignedIn && (
                  <Link
                    href="/claim-form"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 px-3 py-3 rounded-lg text-base font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md transition-all duration-300"
                  >
                    {t("navigation.submitClaim")}
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
        </div>
      </nav>
    </>
  );
}
