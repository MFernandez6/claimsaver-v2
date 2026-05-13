/** Extra context when Supabase returns a bad browser key (Vercel env). */
export function formatSupabaseClientAuthError(e: unknown, fallback: string): string {
  const raw = e instanceof Error ? e.message : fallback;
  if (/invalid api key/i.test(raw)) {
    return `${raw} In Vercel, set NEXT_PUBLIC_SUPABASE_URL and the public anon or publishable key (e.g. NEXT_PUBLIC_SUPABASE_ANON_KEY) from Supabase → Settings → API. Use the same project for URL and key; never put service_role in a NEXT_PUBLIC_ variable.`;
  }
  return raw;
}
