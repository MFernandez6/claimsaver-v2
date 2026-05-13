"use client";

import { useState } from "react";
import Link from "next/link";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getBrowserSupabase();
      const site = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${site}/update-password`,
        },
      );
      if (error) throw error;
      setMessage(
        "If an account exists for that email, we sent reset instructions.",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <Card className="border-slate-200 shadow-xl dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Reset password
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We&apos;ll email you a link to choose a new password. Template
            wording and branding are edited in Supabase Auth → Email templates.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {message && (
              <p
                className={`text-sm ${message.startsWith("If an") ? "text-teal-700 dark:text-teal-300" : "text-red-600"}`}
              >
                {message}
              </p>
            )}
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
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-gradient-to-r from-teal-600 to-teal-700"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send reset link"
              )}
            </Button>
            <p className="text-center text-sm">
              <Link
                href="/login"
                className="font-medium text-teal-700 hover:underline dark:text-teal-400"
              >
                Back to sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
