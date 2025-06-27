"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Sun,
  Moon,
  X,
  Menu,
  ChevronDown,
  Users,
  FileText,
  DollarSign,
  UserCheck,
  Settings,
} from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import { useTranslation } from "react-i18next";

// Wrapper component to handle Clerk authentication
function AuthSection() {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    );
  }

  return (
    <div className="hover:scale-105 transition-all duration-300">
      {isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
              userButtonPopoverCard:
                "shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl",
            },
          }}
        />
      ) : (
        <SignInButton mode="modal">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {t("navigation.signIn")}
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

// Dashboard link component
function DashboardLink({ pathname }: { pathname: string }) {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    async function checkAdminRole() {
      if (isLoaded && isSignedIn && user) {
        try {
          const adminEmails = ["claimsaverplus@gmail.com"];
          const userEmail = user.primaryEmailAddress?.emailAddress;
          const adminStatus = adminEmails.includes(userEmail || "");
          setIsAdmin(adminStatus);
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
            ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30"
            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50"
        }`}
      >
        {isAdmin ? "Admin" : t("navigation.dashboard")}
        {(pathname === "/admin" || pathname === "/dashboard") && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg" />
        )}
      </Link>
    </div>
  );
}

// Dropdown Menu Component
function DropdownMenu({
  trigger,
  items,
  isOpen,
  onToggle,
  onClose,
}: {
  trigger: React.ReactNode;
  items: Array<{
    name: string;
    href: string;
    icon?: React.ReactNode;
    description?: string;
  }>;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50 group"
      >
        {trigger}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="p-2">
            {items.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.icon && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {item.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile auth section
function MobileAuthSection() {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    );
  }

  return (
    <>
      {isSignedIn ? (
        <div className="flex justify-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
                userButtonPopoverCard:
                  "shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl",
              },
            }}
          />
        </div>
      ) : (
        <SignInButton mode="modal">
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("navigation.signIn")}
          </Button>
        </SignInButton>
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
  const { isSignedIn, isLoaded, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    async function checkAdminRole() {
      if (isLoaded && isSignedIn && user) {
        try {
          const adminEmails = ["claimsaverplus@gmail.com"];
          const userEmail = user.primaryEmailAddress?.emailAddress;
          const adminStatus = adminEmails.includes(userEmail || "");
          setIsAdmin(adminStatus);
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
        className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
          pathname === "/admin" || pathname === "/dashboard"
            ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30"
            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50"
        }`}
        onClick={onClick}
      >
        {isAdmin ? "Admin" : t("navigation.dashboard")}
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
      "(prefers-color-scheme: dark)"
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
      className="w-9 h-9 p-0 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-blue-300 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-blue-600 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClerkAvailable, setIsClerkAvailable] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Dropdown menu items
  const aboutItems = [
    {
      name: t("navigation.whoWeAre"),
      href: "/who-we-are",
      icon: <Users className="w-4 h-4" />,
      description: "Learn about our mission and values",
    },
    {
      name: t("navigation.whatWeDo"),
      href: "/what-we-do",
      icon: <Settings className="w-4 h-4" />,
      description: "Discover our comprehensive services",
    },
  ];

  const servicesItems = [
    {
      name: t("navigation.attorneyMatching"),
      href: "/attorney-matching",
      icon: <UserCheck className="w-4 h-4" />,
      description: "Find the perfect attorney for your case",
    },
    {
      name: t("navigation.notarization"),
      href: "/notarization",
      icon: <FileText className="w-4 h-4" />,
      description: "Professional notarization services",
    },
  ];

  const actionItems = [
    {
      name: t("navigation.pricing"),
      href: "/pricing",
      icon: <DollarSign className="w-4 h-4" />,
      description: "Transparent pricing and packages",
    },
    {
      name: t("navigation.submitClaim"),
      href: "/claim-form",
      icon: <FileText className="w-4 h-4" />,
      description: "Start your claim process today",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    setIsClerkAvailable(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:bg-gray-950/90 dark:border-gray-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 hover:scale-105 transition-all duration-300">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">C+</span>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ClaimSaver+
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* About Dropdown */}
            <DropdownMenu
              trigger={<span>Our Story</span>}
              items={aboutItems}
              isOpen={activeDropdown === "about"}
              onToggle={() => handleDropdownToggle("about")}
              onClose={closeAllDropdowns}
            />

            {/* Services Dropdown */}
            <DropdownMenu
              trigger={<span>How We Help</span>}
              items={servicesItems}
              isOpen={activeDropdown === "services"}
              onToggle={() => handleDropdownToggle("services")}
              onClose={closeAllDropdowns}
            />

            {/* Actions Dropdown */}
            <DropdownMenu
              trigger={<span>Get Started</span>}
              items={actionItems}
              isOpen={activeDropdown === "actions"}
              onToggle={() => handleDropdownToggle("actions")}
              onClose={closeAllDropdowns}
            />

            {/* Dashboard Link */}
            {isClerkAvailable && <DashboardLink pathname={pathname} />}

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

            {/* Language Switcher */}
            <div className="hover:scale-105 transition-all duration-300">
              <LanguageSwitcher />
            </div>

            {/* Authentication */}
            {isClerkAvailable && <AuthSection />}

            {/* Theme Toggle */}
            <div className="hover:scale-105 transition-all duration-300 ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-all duration-300"
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
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-300 bg-white/95 backdrop-blur-xl dark:bg-gray-950/95 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              {/* About Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                  Our Story
                </h3>
                {aboutItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="animate-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                        pathname === item.href
                          ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <div>
                        <div>{item.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Services Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                  How We Help
                </h3>
                {servicesItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="animate-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${(index + 2) * 100}ms` }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                        pathname === item.href
                          ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <div>
                        <div>{item.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Actions Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                  Get Started
                </h3>
                {actionItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="animate-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                        pathname === item.href
                          ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <div>
                        <div>{item.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Dashboard Link */}
              {isClerkAvailable && (
                <MobileDashboardLink
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                  navItemsLength={
                    aboutItems.length +
                    servicesItems.length +
                    actionItems.length
                  }
                />
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              {/* Settings Section */}
              <div className="space-y-3">
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
                  {isClerkAvailable && <MobileAuthSection />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
