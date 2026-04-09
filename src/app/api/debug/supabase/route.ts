import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

/**
 * Smoke test: server → Supabase (tables + storage bucket).
 * Optional: if signed in with Clerk, checks whether a profile row exists for this user.
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
      timestamp: new Date().toISOString(),
    });
  }

  const supabase = getSupabaseAdmin();
  const tables = [
    "profiles",
    "claims",
    "claim_documents",
    "calendar_events",
  ] as const;

  const tableResults: Record<
    string,
    { ok: boolean; count?: number; error?: string }
  > = {};

  for (const table of tables) {
    const { error, count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    tableResults[table] = error
      ? { ok: false, error: error.message }
      : { ok: true, count: count ?? 0 };
  }

  const { data: bucketList, error: bucketError } =
    await supabase.storage.listBuckets();

  const bucketNames = bucketList?.map((b) => b.name) ?? [];
  const storageOk = !bucketError;
  const hasClaimDocumentsBucket = bucketNames.includes("claim-documents");

  const { userId } = await auth();
  let profileCheck:
    | { signedIn: false }
    | {
        signedIn: true;
        clerkId: string;
        profileRow: "found" | "missing";
        email?: string;
        error?: string;
      } = { signedIn: false };

  if (userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("clerk_id", userId)
      .maybeSingle();

    if (error) {
      profileCheck = {
        signedIn: true,
        clerkId: userId,
        profileRow: "missing",
        error: error.message,
      };
    } else if (data) {
      profileCheck = {
        signedIn: true,
        clerkId: userId,
        profileRow: "found",
        email: data.email as string,
      };
    } else {
      profileCheck = {
        signedIn: true,
        clerkId: userId,
        profileRow: "missing",
      };
    }
  }

  const tablesOk = Object.values(tableResults).every((r) => r.ok);
  const ok = tablesOk && storageOk && hasClaimDocumentsBucket;

  let host: string | null = null;
  try {
    host = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
      : null;
  } catch {
    host = null;
  }

  return NextResponse.json({
    ok,
    configured: true,
    supabaseUrlHost: host,
    tables: tableResults,
    storage: {
      ok: storageOk,
      error: bucketError?.message,
      buckets: bucketNames,
      claimDocumentsBucketPresent: hasClaimDocumentsBucket,
    },
    clerk: profileCheck,
    timestamp: new Date().toISOString(),
  });
}
