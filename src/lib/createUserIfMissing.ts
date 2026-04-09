import { auth } from "@clerk/nextjs/server";
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

export async function createUserIfMissing() {
  try {
    const { userId } = await auth();

    if (!userId || !isSupabaseConfigured()) {
      return null;
    }

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

    const clerkUser = await fetch(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());

    if (!clerkUser?.id) return null;

    const email = clerkUser.email_addresses?.[0]?.email_address;
    const firstName = clerkUser.first_name || "Unknown";
    const lastName = clerkUser.last_name || "User";

    if (!email) return null;

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
