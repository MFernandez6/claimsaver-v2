"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/env-public";

let client: ReturnType<typeof createBrowserClient> | undefined;

/** Singleton browser client for auth and public API calls from client components. */
export function getBrowserSupabase() {
  if (!isSupabaseBrowserConfigured()) {
    throw new Error(
      "Supabase browser env missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (anon/public key from Supabase → Settings → API — not the service_role secret).",
    );
  }
  if (!client) {
    client = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
  }
  return client;
}
