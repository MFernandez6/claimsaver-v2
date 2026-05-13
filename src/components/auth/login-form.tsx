"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const err = searchParams.get("error");
  const { isSignedIn, isLoaded } = useSupabaseUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const dest = next.startsWith("/") ? next : "/dashboard";
    router.replace(dest);
    router.refresh();
  }, [isLoaded, isSignedIn, next, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const callbackUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?next=${encodeURIComponent(next.startsWith("/") ? next : "/dashboard")}`;

  const signInPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getBrowserSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.replace(next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getBrowserSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });
      if (error) throw error;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Google sign-in failed");
      setLoading(false);
    }
  };

  const sendMagicLink = async () => {
    if (!email.trim()) {
      setMessage("Enter your email for a magic link.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getBrowserSupabase();
      const site = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${site}/auth/confirm?next=${encodeURIComponent(next.startsWith("/") ? next : "/dashboard")}`,
        },
      });
      if (error) throw error;
      setMessage("Check your email for the sign-in link.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not send link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-xl dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Sign in
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Access your dashboard, documents, and milestones.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {(err === "auth" || err === "confirm") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {err === "confirm"
              ? "That confirmation link is invalid or expired. Request a new one from sign-in."
              : "Sign-in could not be completed. Try again."}
          </p>
        )}
        {message && (
          <p
            className={`text-sm ${message.startsWith("Check") ? "text-teal-700 dark:text-teal-300" : "text-red-600 dark:text-red-400"}`}
          >
            {message}
          </p>
        )}

        <form onSubmit={signInPassword} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign in with password"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full"
          disabled={loading}
          onClick={() => void signInGoogle()}
        >
          Google
        </Button>

        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <p className="mb-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            Magic link (passwordless)
          </p>
          <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
            We&apos;ll email you a one-time link. Same email field as above.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={loading}
            onClick={() => void sendMagicLink()}
          >
            Email me a sign-in link
          </Button>
        </div>

        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Forgot password?
          </Link>
          <Link
            href={`/signup${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Create an account
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Verify your email if prompted — check spam. Password reset and
          confirmations use templates you configure in the Supabase dashboard.
        </p>
      </CardContent>
    </Card>
  );
}
