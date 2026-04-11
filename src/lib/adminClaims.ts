import type { SupabaseClient } from "@supabase/supabase-js";
import type { SubmitterSummary } from "@/lib/api";
import { documentRowToLegacy, profileRowToLegacy } from "@/lib/supabase/mappers";

export async function getSubmitterForClaim(
  supabase: SupabaseClient,
  clerkId: string
): Promise<SubmitterSummary | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", clerkId)
    .maybeSingle();

  if (error || !data) return null;

  const p = profileRowToLegacy(data as Record<string, unknown>);
  return {
    clerkId: p.clerkId,
    email: p.email,
    firstName: p.firstName,
    lastName: p.lastName,
    phone: p.phone,
  };
}

/** Documents for this claim plus unlinked uploads from the same account (oversight). */
export async function getDocumentsForClaimAdmin(
  supabase: SupabaseClient,
  claimId: string,
  userClerkId: string
) {
  const { data: linked, error: e1 } = await supabase
    .from("claim_documents")
    .select("*")
    .eq("claim_id", claimId)
    .order("created_at", { ascending: false });

  if (e1) console.error("admin claim documents (linked):", e1);

  const { data: unlinked, error: e2 } = await supabase
    .from("claim_documents")
    .select("*")
    .eq("user_id", userClerkId)
    .is("claim_id", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (e2) console.error("admin claim documents (unlinked):", e2);

  const byId = new Map<string, Record<string, unknown>>();
  for (const row of [...(linked || []), ...(unlinked || [])]) {
    byId.set(String((row as { id: string }).id), row as Record<string, unknown>);
  }

  return [...byId.values()].map((row) => {
    const legacy = documentRowToLegacy(row);
    return {
      ...legacy,
      linkedToClaimId: row.claim_id as string | null,
    };
  });
}

export async function mapSubmittersForUserIds(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<Map<string, { email: string; name: string }>> {
  const unique = [...new Set(userIds.filter(Boolean))];
  const out = new Map<string, { email: string; name: string }>();
  if (unique.length === 0) return out;

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("clerk_id,email,first_name,last_name")
    .in("clerk_id", unique);

  if (error) {
    console.error("mapSubmittersForUserIds:", error);
    return out;
  }

  for (const row of profiles || []) {
    const r = row as {
      clerk_id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
    const name = `${r.first_name || ""} ${r.last_name || ""}`.trim();
    out.set(r.clerk_id, { email: r.email || "", name: name || "—" });
  }
  return out;
}
