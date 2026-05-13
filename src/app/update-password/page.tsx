"use client";

import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    const { data: sub } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      },
    );
    void supabase.auth
      .getSession()
      .then((res: { data: { session: Session | null } }) => {
        if (res.data.session) setReady(true);
      });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getBrowserSupabase();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.replace("/dashboard");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <Card className="border-slate-200 shadow-xl dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            New password
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Open this page from the link in your reset email. Sessions stay
            refreshed in the background so you stay signed in on trusted
            devices.
          </p>
        </CardHeader>
        <CardContent>
          {!ready && (
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Waiting for a valid reset session… If this hangs, open the link
              from your email again or request a new reset from{" "}
              <Link href="/forgot-password" className="text-teal-700 underline">
                forgot password
              </Link>
              .
            </p>
          )}
          <form onSubmit={submit} className="space-y-4">
            {message && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {message}
              </p>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                New password
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
            </div>
            <Button
              type="submit"
              disabled={loading || !ready}
              className="h-11 w-full bg-gradient-to-r from-teal-600 to-teal-700"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Update password"
              )}
            </Button>
            <p className="text-center text-sm">
              <Link
                href="/login"
                className="font-medium text-teal-700 hover:underline dark:text-teal-400"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
