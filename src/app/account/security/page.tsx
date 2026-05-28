"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountSecurityPage() {
  const { user, isLoaded } = useSupabaseUser();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refreshFactors = useCallback(async () => {
    const supabase = getBrowserSupabase();
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      setMessage(error.message);
      return;
    }
    const verified = data.totp.filter(
      (f: { status: string }) => f.status === "verified",
    );
    setEnrolled(verified.length > 0);
  }, []);

  useEffect(() => {
    if (!isLoaded || !user) return;
    void refreshFactors();
  }, [isLoaded, user, refreshFactors]);

  const startEnroll = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getBrowserSupabase();
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator app",
      });
      if (error) throw error;
      setFactorId(data.id);
      setQr(data.totp.qr_code);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not start MFA setup");
    } finally {
      setLoading(false);
    }
  };

  const verifyEnroll = async () => {
    if (!factorId || !verifyCode.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getBrowserSupabase();
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verifyCode.trim(),
      });
      if (verifyError) throw verifyError;

      setQr(null);
      setFactorId(null);
      setVerifyCode("");
      setEnrolled(true);
      setMessage("Multi-factor authentication is now enabled.");
      void refreshFactors();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-center text-slate-600">
          <Link href="/login?next=/account/security" className="text-teal-700 underline">
            Sign in
          </Link>{" "}
          to manage account security.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-12 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <PageHeroBackdrop />
        <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
          <ShieldCheck className="w-12 h-12 mx-auto text-teal-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Account security
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Protect medical records and claim documents with an authenticator app.
          </p>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-4 pb-20">
        <Card>
          <CardHeader>
            <CardTitle>Multi-factor authentication (MFA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolled ? (
              <p className="text-sm text-teal-700 dark:text-teal-300">
                MFA is enabled on your account. Use your authenticator app when
                signing in.
              </p>
            ) : qr && factorId ? (
              <>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Scan this QR code with Google Authenticator, 1Password, or
                  similar, then enter the 6-digit code.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr}
                  alt="MFA QR code"
                  className="mx-auto h-48 w-48 rounded-lg border border-slate-200"
                />
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6-digit code"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                />
                <Button
                  onClick={() => void verifyEnroll()}
                  disabled={loading || verifyCode.length < 6}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify and enable MFA"
                  )}
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We strongly recommend MFA for accounts storing police reports,
                  medical records, and insurance documents.
                </p>
                <Button
                  onClick={() => void startEnroll()}
                  disabled={loading}
                  className="w-full bg-teal-700 hover:bg-teal-800"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Set up authenticator app"
                  )}
                </Button>
              </>
            )}
            {message && (
              <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
            )}
            <p className="text-xs text-slate-500">
              Enable TOTP in Supabase Dashboard → Authentication → MFA if this
              flow is disabled for your project.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
