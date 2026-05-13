import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Auth user id (UUID) matching `profiles.clerk_id` and claim `user_id` for Supabase Auth. */
export async function getAuthUserId(): Promise<string | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user.id;
  } catch {
    return null;
  }
}
