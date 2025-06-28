"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function DebugClerk() {
  const { openSignIn, openSignUp, loaded } = useClerk();
  const { user, isLoaded } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Get debug info from API
    fetch("/api/debug")
      .then((res) => res.json())
      .then((data) => setDebugInfo(data))
      .catch((err) => console.error("Debug API error:", err));
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      console.log("Attempting to open sign in...");
      await openSignIn({
        redirectUrl: "/",
        afterSignInUrl: "/",
      });
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleSignUp = async () => {
    try {
      setError(null);
      console.log("Attempting to open sign up...");
      await openSignUp({
        redirectUrl: "/",
        afterSignUpUrl: "/",
      });
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Clerk Debug Information
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client-side Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Client-Side Status
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Clerk Loaded:</span>
                <span className={loaded ? "text-green-600" : "text-red-600"}>
                  {loaded ? "✅ Yes" : "❌ No"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>User Loaded:</span>
                <span className={isLoaded ? "text-green-600" : "text-red-600"}>
                  {isLoaded ? "✅ Yes" : "❌ No"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>User Signed In:</span>
                <span className={user ? "text-green-600" : "text-red-600"}>
                  {user ? "✅ Yes" : "❌ No"}
                </span>
              </div>

              {user && (
                <div className="flex justify-between">
                  <span>User Email:</span>
                  <span className="text-blue-600">
                    {user.emailAddresses[0]?.emailAddress}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium">Error:</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Test Sign In
              </Button>
              <Button
                onClick={handleSignUp}
                variant="outline"
                className="w-full"
              >
                Test Sign Up
              </Button>
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Environment & Configuration
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Publishable Key:</span>
                <span
                  className={
                    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                    ? "✅ Set"
                    : "❌ Missing"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Key Type:</span>
                <span className="text-blue-600">
                  {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith(
                    "pk_test_"
                  )
                    ? "Development"
                    : "Production"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>App URL:</span>
                <span className="text-blue-600">
                  {process.env.NEXT_PUBLIC_APP_URL || "Not set"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Node Environment:</span>
                <span className="text-blue-600">{process.env.NODE_ENV}</span>
              </div>
            </div>

            {debugInfo && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Server-Side Debug:
                </h3>
                <div className="bg-gray-50 rounded p-3 text-xs">
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Troubleshooting Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Troubleshooting Steps
          </h2>

          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="font-semibold">1.</span>
              <span>
                Go to{" "}
                <a
                  href="https://dashboard.clerk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Clerk Dashboard
                </a>{" "}
                and select your application
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold">2.</span>
              <span>
                Check "User & Authentication" → "Email, Phone, Username" -
                ensure Email is enabled
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold">3.</span>
              <span>
                Go to "Domains" and add{" "}
                <code className="bg-blue-100 px-1 rounded">localhost:3000</code>{" "}
                if not present
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold">4.</span>
              <span>
                Check "Paths" settings - ensure sign-in/sign-up URLs are
                configured
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold">5.</span>
              <span>Clear browser cache and cookies, then try again</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
