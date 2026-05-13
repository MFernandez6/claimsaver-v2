import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { claimRowToLegacy } from "@/lib/supabase/mappers";
import { generateDraftClaimNumber } from "@/lib/claims/build-claim-payload";

/** Latest worksheet draft for the signed-in user (for claim form resume). */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 503 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("claims")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ draft: null });
    }

    return NextResponse.json({
      draft: claimRowToLegacy(data as Record<string, unknown>),
    });
  } catch (e) {
    console.error("GET /api/claims/draft:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Create a new draft claim row (in-progress worksheet). Further updates use PATCH /api/claims/[id].
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();
    const claim_data = {
      noFaultWorksheet: body,
      draftSavedAt: now,
    };

    const supabase = getSupabaseAdmin();
    const { data: inserted, error } = await supabase
      .from("claims")
      .insert({
        user_id: userId,
        claim_number: generateDraftClaimNumber(),
        status: "draft",
        priority: "low",
        claim_data,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error || !inserted) {
      console.error("draft POST:", error);
      return NextResponse.json(
        { error: error?.message || "Failed to save draft" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { claim: claimRowToLegacy(inserted as Record<string, unknown>) },
      { status: 201 },
    );
  } catch (e) {
    console.error("POST /api/claims/draft:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
