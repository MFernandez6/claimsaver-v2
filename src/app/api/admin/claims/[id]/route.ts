import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { claimRowToLegacy, isUuid } from "@/lib/supabase/mappers";
import {
  getDocumentsForClaimAdmin,
  getSubmitterForClaim,
} from "@/lib/adminClaims";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!isUuid(id)) {
      return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("claims")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!row) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    const claim = claimRowToLegacy(row as Record<string, unknown>);
    const userClerkId = String(claim.userId ?? "");

    const [submitter, documents] = await Promise.all([
      userClerkId ? getSubmitterForClaim(supabase, userClerkId) : null,
      userClerkId
        ? getDocumentsForClaimAdmin(supabase, id, userClerkId)
        : [],
    ]);

    return NextResponse.json({
      data: claim,
      submitter,
      documents,
    });
  } catch (error) {
    console.error("Error fetching claim:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!isUuid(id)) {
      return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
    }

    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: row, error: fetchErr } = await supabase
      .from("claims")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !row) {
      return NextResponse.json(
        { error: "Claim not found" },
        { status: fetchErr ? 500 : 404 }
      );
    }

    const prevData =
      typeof row.claim_data === "object" && row.claim_data !== null
        ? (row.claim_data as Record<string, unknown>)
        : {};

    const omitTop = new Set(["userId", "claimNumber", "_id", "status", "priority"]);
    const bodyRest = Object.fromEntries(
      Object.entries(body as Record<string, unknown>).filter(
        ([k]) => !omitTop.has(k)
      )
    ) as Record<string, unknown>;

    const mergedClaimData = { ...prevData, ...bodyRest };
    const now = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from("claims")
      .update({
        claim_data: mergedClaimData,
        status: (body.status as string) ?? row.status,
        priority: (body.priority as string) ?? row.priority,
        updated_at: now,
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json(
        { error: error?.message || "Update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: claimRowToLegacy(updated as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Error updating claim:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!isUuid(id)) {
      return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("claims").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Claim deleted successfully" });
  } catch (error) {
    console.error("Error deleting claim:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
