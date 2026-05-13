import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { profileRowToLegacy } from "@/lib/supabase/mappers";

const defaultAdminPerms = {
  canViewClaims: false,
  canEditClaims: false,
  canDeleteClaims: false,
  canManageUsers: false,
  canViewAnalytics: false,
};

const defaultStats = {
  totalClaims: 0,
  activeClaims: 0,
  completedClaims: 0,
  totalSettlements: 0,
};

/**
 * Ensures a `profiles` row exists for the current Supabase Auth user.
 * Stores auth user id in `clerk_id` (legacy column name).
 */
export async function createUserIfMissing() {
  try {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const authClient = await createSupabaseServerClient();
    const {
      data: { user },
      error: authErr,
    } = await authClient.auth.getUser();

    if (authErr || !user) {
      return null;
    }

    const userId = user.id;
    const supabase = getSupabaseAdmin();

    const { data: existing, error: readErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_id", userId)
      .maybeSingle();

    if (readErr) {
      console.error("createUserIfMissing read error:", readErr);
      return null;
    }

    if (existing) {
      return profileRowToLegacy(existing as Record<string, unknown>);
    }

    const meta = (user.user_metadata || {}) as Record<string, unknown>;
    const email =
      user.email ||
      (typeof meta.email === "string" ? meta.email : "") ||
      "";
    const firstName =
      (typeof meta.first_name === "string" && meta.first_name) ||
      (typeof meta.full_name === "string"
        ? meta.full_name.split(" ")[0]
        : null) ||
      email.split("@")[0] ||
      "Unknown";
    const lastName =
      (typeof meta.last_name === "string" && meta.last_name) ||
      (typeof meta.full_name === "string"
        ? meta.full_name.split(" ").slice(1).join(" ")
        : "") ||
      "User";

    if (!email) {
      console.warn("createUserIfMissing: no email on auth user", userId);
      return null;
    }

    const now = new Date().toISOString();

    const { data: inserted, error: insertErr } = await supabase
      .from("profiles")
      .insert({
        clerk_id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        role: "user",
        is_active: true,
        admin_permissions: defaultAdminPerms,
        stats: defaultStats,
        last_login: now,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("createUserIfMissing insert error:", insertErr);
      return null;
    }

    console.log("Created missing profile for:", email);
    return profileRowToLegacy(inserted as Record<string, unknown>);
  } catch (error) {
    console.error("Error creating user if missing:", error);
    return null;
  }
}
