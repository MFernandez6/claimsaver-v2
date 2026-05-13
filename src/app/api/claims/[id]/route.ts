import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { claimRowToLegacy, isUuid } from "@/lib/supabase/mappers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { id: claimId } = await params;

    if (!isUuid(claimId)) {
      return NextResponse.json(
        { error: "Invalid claim ID format" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: row, error } = await supabase
      .from("claims")
      .select("*")
      .eq("id", claimId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!row) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    return NextResponse.json(claimRowToLegacy(row as Record<string, unknown>));
  } catch (error) {
    console.error("Error fetching claim:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/** Update an in-progress draft worksheet (debounced autosave from the claim form). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { id: claimId } = await params;

    if (!isUuid(claimId)) {
      return NextResponse.json(
        { error: "Invalid claim ID format" },
        { status: 400 }
      );
    }

    const worksheet = (await request.json()) as Record<string, unknown>;
    const supabase = getSupabaseAdmin();

    const { data: existing, error: fetchErr } = await supabase
      .from("claims")
      .select("id,status,claim_data")
      .eq("id", claimId)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    if (existing.status !== "draft") {
      return NextResponse.json(
        { error: "Only draft worksheets can be updated here" },
        { status: 400 }
      );
    }

    const prior =
      typeof existing.claim_data === "object" && existing.claim_data !== null
        ? (existing.claim_data as Record<string, unknown>)
        : {};

    const now = new Date().toISOString();
    const claim_data = {
      ...prior,
      noFaultWorksheet: worksheet,
      draftSavedAt: now,
    };

    const { data: updated, error } = await supabase
      .from("claims")
      .update({ claim_data, updated_at: now })
      .eq("id", claimId)
      .select()
      .single();

    if (error || !updated) {
      console.error("PATCH claim draft:", error);
      return NextResponse.json(
        { error: error?.message || "Failed to save draft" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      claimRowToLegacy(updated as Record<string, unknown>)
    );
  } catch (error) {
    console.error("Error updating draft claim:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
