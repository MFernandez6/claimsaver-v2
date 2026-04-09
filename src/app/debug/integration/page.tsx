"use client";

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SupabaseDebugPayload {
  ok: boolean;
  configured?: boolean;
  message?: string;
  supabaseUrlHost?: string | null;
  tables?: Record<string, { ok: boolean; count?: number; error?: string }>;
  storage?: {
    ok: boolean;
    error?: string;
    buckets?: string[];
    claimDocumentsBucketPresent?: boolean;
  };
  clerk?:
    | { signedIn: false }
    | {
        signedIn: true;
        clerkId: string;
        profileRow: "found" | "missing";
        email?: string;
        error?: string;
      };
  timestamp?: string;
}

export default function IntegrationDebugPage() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<SupabaseDebugPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setErr(null);
    fetch("/api/debug/supabase")
      .then((res) => res.json())
      .then((json: SupabaseDebugPayload) => {
        setData(json);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Request failed"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (isLoaded) load();
  }, [isLoaded, user?.id]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Integration check
          </h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Verifies env, Supabase tables, storage bucket, and (when signed in)
          whether your Clerk user has a row in{" "}
          <code className="text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">
            profiles
          </code>
          . Open this page signed out, then sign in and refresh or click
          Re-run.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={load} disabled={loading}>
            {loading ? "Loading…" : "Re-run checks"}
          </Button>
          {!user && (
            <SignInButton mode="modal">
              <Button size="sm" variant="secondary">
                Sign in
              </Button>
            </SignInButton>
          )}
          {user && (
            <SignOutButton>
              <Button size="sm" variant="secondary">
                Sign out
              </Button>
            </SignOutButton>
          )}
        </div>

        {err && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/40 p-4 text-red-800 dark:text-red-200 text-sm">
            {err}
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div
              className={`rounded-lg border p-4 ${
                data.ok
                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800"
                  : "border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800"
              }`}
            >
              <p className="font-semibold text-slate-900 dark:text-white">
                Overall: {data.ok ? "All checks passed" : "Some checks failed"}
              </p>
              {!data.configured && (
                <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">
                  {data.message}
                </p>
              )}
              {data.supabaseUrlHost && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Host: {data.supabaseUrlHost}
                </p>
              )}
            </div>

            {data.tables && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                <h2 className="font-medium text-slate-900 dark:text-white mb-2">
                  Tables (row counts)
                </h2>
                <ul className="text-sm space-y-1 font-mono">
                  {Object.entries(data.tables).map(([name, t]) => (
                    <li key={name} className="flex justify-between gap-4">
                      <span>{name}</span>
                      <span
                        className={
                          t.ok ? "text-emerald-600" : "text-red-600"
                        }
                      >
                        {t.ok
                          ? `${t.count ?? 0} rows`
                          : t.error ?? "error"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.storage && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                <h2 className="font-medium text-slate-900 dark:text-white mb-2">
                  Storage
                </h2>
                <p className="text-sm">
                  claim-documents bucket:{" "}
                  <strong>
                    {data.storage.claimDocumentsBucketPresent
                      ? "present"
                      : "missing"}
                  </strong>
                </p>
                {data.storage.error && (
                  <p className="text-sm text-red-600 mt-1">
                    {data.storage.error}
                  </p>
                )}
                {!!data.storage.buckets?.length && (
                  <p className="text-xs text-slate-500 mt-2">
                    Buckets: {data.storage.buckets.join(", ")}
                  </p>
                )}
              </div>
            )}

            {data.clerk && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                <h2 className="font-medium text-slate-900 dark:text-white mb-2">
                  Clerk + profiles
                </h2>
                {!data.clerk.signedIn && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Not signed in — sign in to test whether your user exists in
                    Supabase <code>profiles</code>.
                  </p>
                )}
                {data.clerk.signedIn && (
                  <ul className="text-sm space-y-1">
                    <li>
                      Profile row:{" "}
                      <strong
                        className={
                          data.clerk.profileRow === "found"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }
                      >
                        {data.clerk.profileRow === "found"
                          ? "found"
                          : "missing (open app after sign-in or hit /api/webhooks/clerk)"}
                      </strong>
                    </li>
                    {data.clerk.email && (
                      <li>Email on profile: {data.clerk.email}</li>
                    )}
                    {data.clerk.error && (
                      <li className="text-red-600">{data.clerk.error}</li>
                    )}
                  </ul>
                )}
              </div>
            )}

            {data.timestamp && (
              <p className="text-xs text-slate-400">{data.timestamp}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
