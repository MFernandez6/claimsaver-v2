import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { profileRowToLegacy } from "@/lib/supabase/mappers";
import { isDesignatedAdminEmail } from "@/lib/adminAccess";

interface UserDocument {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  adminPermissions?: Record<string, boolean>;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getCurrentUser(): Promise<UserDocument | null> {
  try {
    const { userId } = await auth();

    if (!userId || !isSupabaseConfigured()) {
      return null;
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_id", userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return profileRowToLegacy(data as Record<string, unknown>) as UserDocument;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;
    if (user.role === "admin" || user.role === "super_admin") return true;
    return isDesignatedAdminEmail(user.email);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    if (!user) return false;

    if (user.role === "super_admin") return true;

    return user.adminPermissions?.[permission] || false;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  /** Structured address or a single line (e.g. from claim form) */
  address?: string | {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

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

function normalizeAddress(
  address: UserData["address"]
): Record<string, string> {
  if (!address) return {};
  if (typeof address === "string") {
    return { street: address };
  }
  return {
    street: address.street ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    zipCode: address.zipCode ?? "",
    country: address.country ?? "USA",
  };
}

export async function createOrUpdateUser(clerkId: string, userData: UserData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const supabase = getSupabaseAdmin();
  const addr = normalizeAddress(userData.address);

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", clerkId)
    .maybeSingle();

  const now = new Date().toISOString();

  if (existing) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone ?? "",
        address: addr,
        last_login: now,
        updated_at: now,
      })
      .eq("clerk_id", clerkId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return profileRowToLegacy(data as Record<string, unknown>);
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      clerk_id: clerkId,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone ?? "",
      address: addr,
      role: "user",
      is_active: true,
      admin_permissions: defaultAdminPerms,
      stats: defaultStats,
      last_login: now,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return profileRowToLegacy(data as Record<string, unknown>);
}
