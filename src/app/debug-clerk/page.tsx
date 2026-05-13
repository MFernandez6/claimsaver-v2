"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Legacy path — Clerk removed; auth is Supabase. */
export default function DebugClerkPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4 p-8">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
        Auth debugging
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        This app uses <strong>Supabase Auth</strong> (email/password, magic
        link, Google). Use{" "}
        <Link href="/debug/integration" className="text-teal-700 underline">
          Integration check
        </Link>{" "}
        or{" "}
        <Link href="/api/debug/supabase" className="text-teal-700 underline">
          /api/debug/supabase
        </Link>{" "}
        instead.
      </p>
      <Button asChild>
        <Link href="/login">Sign in</Link>
      </Button>
    </div>
  );
}
