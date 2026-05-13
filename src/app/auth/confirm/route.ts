import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env-public";

/**
 * Email confirmation / magic link token_hash flow (set redirect URL in Supabase Auth email templates).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as
    | "signup"
    | "invite"
    | "magiclink"
    | "recovery"
    | "email_change"
    | "email"
    | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login?error=confirm`);
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    return NextResponse.redirect(`${origin}/login?error=config`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=confirm`);
  }

  const dest = next.startsWith("/") ? next : "/dashboard";
  return NextResponse.redirect(`${origin}${dest}`);
}
