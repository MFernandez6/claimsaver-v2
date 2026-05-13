"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatSupabaseClientAuthError } from "@/lib/supabase/auth-errors";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const callbackUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?next=${encodeURIComponent(next.startsWith("/") ? next : "/dashboard")}`;

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getBrowserSupabase();
      const site = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${site}/auth/confirm?next=${encodeURIComponent(next.startsWith("/") ? next : "/dashboard")}`,
        },
      });
      if (error) throw error;
      if (data.session) {
        router.replace(next.startsWith("/") ? next : "/dashboard");
        router.refresh();
      } else {
        setMessage(
          "Check your email to confirm your address before signing in.",
        );
      }
    } catch (e) {
      setMessage(formatSupabaseClientAuthError(e, "Could not sign up"));
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
        options: { redirectTo: callbackUrl },
      });
      if (error) throw error;
    } catch (e) {
      setMessage(formatSupabaseClientAuthError(e, "Google sign-up failed"));
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-xl dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Create your account
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Then continue to your dashboard and claim tools.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <p
            className={`text-sm ${message.startsWith("Check") ? "text-teal-700 dark:text-teal-300" : "text-red-600 dark:text-red-400"}`}
          >
            {message}
          </p>
        )}

        <form onSubmit={signUp} className="space-y-4">
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="h-11"
            />
            <p className="mt-1 text-xs text-slate-500">
              At least 8 characters. Use a password manager when you can.
            </p>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign up"
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

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href={`/login${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
