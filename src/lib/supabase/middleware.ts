import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env-public";

const SESSION_LOOKUP_MS = 4_000;

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<{ ok: true; value: T } | { ok: false }> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const value = await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("timeout")), ms);
      }),
    ]);
    return { ok: true, value };
  } catch {
    return { ok: false };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Refreshes the Auth session and returns the user + response carrying Set-Cookie headers.
 */
export async function updateSession(request: NextRequest): Promise<{
  supabaseResponse: NextResponse;
  user: User | null;
  timedOut: boolean;
}> {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    return {
      supabaseResponse: NextResponse.next({ request }),
      user: null,
      timedOut: false,
    };
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const result = await withTimeout(supabase.auth.getUser(), SESSION_LOOKUP_MS);

  if (!result.ok) {
    return { supabaseResponse, user: null, timedOut: true };
  }

  return {
    supabaseResponse,
    user: result.value.data.user ?? null,
    timedOut: false,
  };
}
