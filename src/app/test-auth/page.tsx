"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TestAuth() {
  const { openSignIn, openSignUp } = useClerk();
  const { user, isLoaded } = useUser();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      await openSignIn();
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleSignUp = async () => {
    try {
      setError(null);
      await openSignUp();
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Clerk Authentication Test
        </h1>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Clerk Loaded: {isLoaded ? "✅ Yes" : "❌ No"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              User:{" "}
              {user
                ? `✅ ${user.emailAddresses[0]?.emailAddress}`
                : "❌ Not signed in"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">Error:</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Test Sign In
            </Button>
            <Button onClick={handleSignUp} variant="outline" className="w-full">
              Test Sign Up
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Environment Info:
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                Publishable Key:{" "}
                {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                  ? "✅ Set"
                  : "❌ Missing"}
              </p>
              <p>
                Key Type:{" "}
                {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith(
                  "pk_test_"
                )
                  ? "Development"
                  : "Production"}
              </p>
              <p>App URL: {process.env.NEXT_PUBLIC_APP_URL || "Not set"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
