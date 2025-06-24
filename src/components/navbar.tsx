"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Sun, Moon } from "lucide-react";

const navItems = [
  { name: "Who We Are", href: "/who-we-are" },
  { name: "What We Do", href: "/what-we-do" },
  { name: "Attorney Matching", href: "/attorney-matching" },
  { name: "Pricing", href: "/pricing" },
  { name: "Submit Claim", href: "/claim-form" },
];

// Wrapper component to handle Clerk authentication
function AuthSection() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    );
  }

  return (
    <div className="hover:scale-105 transition-transform duration-200">
      {isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              userButtonPopoverCard:
                "shadow-lg border border-gray-200 dark:border-gray-700",
            },
          }}
        />
      ) : (
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-blue-600 transition-all duration-200"
          >
            Sign In
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

// Fallback auth section when Clerk is not available
function FallbackAuthSection() {
  return (
    <div className="hover:scale-105 transition-transform duration-200">
      <Button
        variant="outline"
        className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-blue-600 transition-all duration-200"
      >
        Sign In
      </Button>
    </div>
  );
}

// Dashboard link component
function DashboardLink({ pathname }: { pathname: string }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    async function checkAdminRole() {
      if (isLoaded && isSignedIn && user) {
        try {
          // Check if the user's email is in the admin emails list
          const adminEmails = [
            "claimsaverplus@gmail.com",
            // Add more admin emails as needed
          ];

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
    <div className="hover:-translate-y-0.5 transition-transform duration-200">
      <Link
        href={isAdmin ? "/admin" : "/dashboard"}
        className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
          pathname === "/admin" || pathname === "/dashboard"
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        }`}
      >
        {isAdmin ? "Admin" : "Dashboard"}
        {(pathname === "/admin" || pathname === "/dashboard") && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full" />
        )}
      </Link>
    </div>
  );
}

// Mobile auth section
function MobileAuthSection() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
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
                  "shadow-lg border border-gray-200 dark:border-gray-700",
              },
            }}
          />
        </div>
      ) : (
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="w-full bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-blue-600"
          >
            Sign In
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
}: {
  pathname: string;
  onClick: () => void;
}) {
  const { isSignedIn, isLoaded, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    async function checkAdminRole() {
      if (isLoaded && isSignedIn && user) {
        try {
          // Check if the user's email is in the admin emails list
          const adminEmails = [
            "claimsaverplus@gmail.com",
            // Add more admin emails as needed
          ];

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
      style={{ animationDelay: `${navItems.length * 100}ms` }}
    >
      <Link
        href={isAdmin ? "/admin" : "/dashboard"}
        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
          pathname === "/admin" || pathname === "/dashboard"
            ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50"
            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
        }`}
        onClick={onClick}
      >
        {isAdmin ? "Admin" : "Dashboard"}
      </Link>
    </div>
  );
}

// Theme toggle component
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme preference or default to light mode
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
      className="w-9 h-9 p-0 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-blue-300 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-blue-600 transition-all duration-200 hover:scale-105"
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClerkAvailable, setIsClerkAvailable] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    // Check if Clerk is available
    try {
      // This will throw if Clerk is not properly initialized
      if (
        typeof window !== "undefined" &&
        !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      ) {
        setIsClerkAvailable(false);
      }
    } catch {
      setIsClerkAvailable(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render authentication components until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:bg-gray-950/80 dark:border-gray-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 hover:scale-105 transition-transform duration-200">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C+</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  ClaimSaver+
                </span>
              </Link>
            </div>

            {/* Right side navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <Link
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      pathname === item.href
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    }`}
                  >
                    {item.name}
                    {pathname === item.href && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full" />
                    )}
                  </Link>
                </div>
              ))}

              {/* Loading state for auth */}
              <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden hover:scale-95 transition-transform duration-200">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`w-6 h-0.5 bg-current block transition-all duration-200 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  />
                  <span
                    className={`w-6 h-0.5 bg-current block mt-1 transition-all duration-200 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`w-6 h-0.5 bg-current block mt-1 transition-all duration-200 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:bg-gray-950/80 dark:border-gray-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 hover:scale-105 transition-transform duration-200">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C+</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ClaimSaver+
              </span>
            </Link>
          </div>

          {/* Right side navigation and sign in */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="hover:-translate-y-0.5 transition-transform duration-200"
              >
                <Link
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full" />
                  )}
                </Link>
              </div>
            ))}

            {/* Dashboard Link - Only show when signed in and Clerk is available */}
            {isClerkAvailable && <DashboardLink pathname={pathname} />}

            {/* Authentication Button */}
            {isClerkAvailable ? <AuthSection /> : <FallbackAuthSection />}

            {/* Theme Toggle - always at the far right */}
            <div className="hover:scale-105 transition-transform duration-200 ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden hover:scale-95 transition-transform duration-200">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`w-6 h-0.5 bg-current block transition-all duration-200 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`w-6 h-0.5 bg-current block mt-1 transition-all duration-200 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-6 h-0.5 bg-current block mt-1 transition-all duration-200 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <div
                  key={item.name}
                  className="animate-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      pathname === item.href
                        ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}

              {/* Dashboard Link in Mobile Menu - Only show when signed in and Clerk is available */}
              {isClerkAvailable && (
                <MobileDashboardLink
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}

              {/* Theme Toggle in Mobile Menu */}
              <div
                className="pt-2 animate-in slide-in-from-left-2 duration-300"
                style={{
                  animationDelay: `${
                    (navItems.length + (isClerkAvailable ? 1 : 0)) * 100
                  }ms`,
                }}
              >
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>

              <div
                className="pt-2 animate-in slide-in-from-left-2 duration-300"
                style={{
                  animationDelay: `${
                    (navItems.length + (isClerkAvailable ? 2 : 1)) * 100
                  }ms`,
                }}
              >
                {isClerkAvailable ? (
                  <MobileAuthSection />
                ) : (
                  // Fallback when Clerk is not available
                  <Button
                    variant="outline"
                    className="w-full bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-blue-600"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
