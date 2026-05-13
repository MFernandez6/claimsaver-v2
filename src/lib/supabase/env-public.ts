/** Browser + middleware + server routes: Supabase project URL and anon/publishable key. */

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ""
  );
}

/**
 * Public client key only (anon / publishable). Never use `service_role` here.
 * Vercel: must be prefixed `NEXT_PUBLIC_` or it will be missing in the browser.
 *
 * Tries several names used in Supabase “Connect” snippets and dashboards.
 */
export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY?.trim() ||
    ""
  );
}

export function isSupabaseBrowserConfigured(): boolean {
  return !!(getSupabaseUrl() && getSupabaseAnonKey());
}
