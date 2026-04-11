import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { claimRowToLegacy } from "@/lib/supabase/mappers";
import { mapSubmittersForUserIds } from "@/lib/adminClaims";

function generateClaimNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `CS${year}${month}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();

    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("claims")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(skip, skip + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search && search.trim()) {
      const safe = search.trim().replace(/[%]/g, "");
      const p = `%${safe}%`;

      const { data: emailMatches } = await supabase
        .from("profiles")
        .select("clerk_id")
        .ilike("email", p);

      const clerkIds = (emailMatches || []).map(
        (r: { clerk_id: string }) => r.clerk_id
      );

      const orParts = [
        `claim_number.ilike.${p}`,
        `claim_data->>claimantName.ilike.${p}`,
        `claim_data->>claimantEmail.ilike.${p}`,
      ];
      if (clerkIds.length > 0) {
        orParts.push(`user_id.in.(${clerkIds.join(",")})`);
      }
      query = query.or(orParts.join(","));
    }

    const { data: rows, error, count } = await query;

    if (error) {
      console.error("admin claims GET:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const legacyRows = (rows || []).map((r) =>
      claimRowToLegacy(r as Record<string, unknown>)
    );
    const userIds = legacyRows.map((c) => String(c.userId ?? ""));
    const submitterMap = await mapSubmittersForUserIds(supabase, userIds);

    const data = legacyRows.map((c) => {
      const s = submitterMap.get(String(c.userId ?? ""));
      return {
        ...c,
        submitterEmail: s?.email ?? null,
        submitterName: s?.name ?? null,
      };
    });
    const total = count ?? 0;

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Error in admin claims API:", error);

    return NextResponse.json(
      {
        error: "Internal server error. Please try again.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();

    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const user_id =
      (typeof body.userId === "string" && body.userId) ||
      authResult.user.clerkId;

    const claim_number = body.claimNumber || generateClaimNumber();
    const status = body.status || "pending";
    const priority = body.priority || "medium";

    const omit = new Set(["userId", "claimNumber", "status", "priority"]);
    const claim_data = Object.fromEntries(
      Object.entries(body as Record<string, unknown>).filter(
        ([k]) => !omit.has(k)
      )
    ) as Record<string, unknown>;

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const { data: inserted, error } = await supabase
      .from("claims")
      .insert({
        user_id,
        claim_number,
        status,
        priority,
        claim_data,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error || !inserted) {
      return NextResponse.json(
        { error: error?.message || "Failed to create claim" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { claim: claimRowToLegacy(inserted as Record<string, unknown>) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating claim:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
