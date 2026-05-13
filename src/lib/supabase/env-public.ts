/** Browser + middleware + server routes: Supabase project URL and anon/publishable key. */

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ""
  );
}

/** Supports legacy `ANON_KEY` and newer publishable keys. */
export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    ""
  );
}

export function isSupabaseBrowserConfigured(): boolean {
  return !!(getSupabaseUrl() && getSupabaseAnonKey());
}
