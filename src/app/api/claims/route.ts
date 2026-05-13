import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/supabase/auth-session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { claimRowToLegacy, isUuid } from "@/lib/supabase/mappers";
import { createOrUpdateUser } from "@/lib/auth";
import {
  buildClaimDataFromBody,
  generateClaimNumber,
  insertFloridaPipMilestonesForClaim,
  parseAccidentDate,
} from "@/lib/claims/build-claim-payload";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 503 }
      );
    }

    const rawBody = (await request.json()) as Record<string, unknown>;
    const finalizeDraftId =
      typeof rawBody.finalizeDraftId === "string"
        ? rawBody.finalizeDraftId.trim()
        : undefined;
    const body = { ...rawBody };
    delete body.finalizeDraftId;

    const claimantName = String(body.claimantName ?? "");
    await createOrUpdateUser(userId, {
      email: String(body.claimantEmail ?? ""),
      firstName: claimantName.split(" ")[0] || claimantName,
      lastName: claimantName.split(" ").slice(1).join(" ") || "",
      phone: String(body.claimantPhone ?? ""),
      address: String(body.claimantAddress ?? ""),
    });

    const submittedAt = new Date().toISOString();
    const claim_data = buildClaimDataFromBody(body, { submittedAt });

    const priority =
      Number(body.estimatedValue) > 10000 ? "high" : ("medium" as const);

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const runMilestones = async (claimId: string) => {
      const accidentDate = parseAccidentDate(body);
      const milestoneResult = await insertFloridaPipMilestonesForClaim(
        supabase,
        { userId, claimId, accidentDate }
      );
      if (!milestoneResult.ok) {
        console.error(
          "Florida PIP milestones not inserted:",
          milestoneResult.error
        );
      }
    };

    if (finalizeDraftId && isUuid(finalizeDraftId)) {
      const { data: draftRow, error: draftErr } = await supabase
        .from("claims")
        .select("id,status")
        .eq("id", finalizeDraftId)
        .eq("user_id", userId)
        .maybeSingle();

      if (draftErr || !draftRow) {
        return NextResponse.json(
          { error: "Draft not found" },
          { status: 404 }
        );
      }
      if (draftRow.status !== "draft") {
        return NextResponse.json(
          { error: "This worksheet was already submitted." },
          { status: 400 }
        );
      }

      const claimNumber = generateClaimNumber();

      const { data: updated, error } = await supabase
        .from("claims")
        .update({
          claim_number: claimNumber,
          status: "pending",
          priority,
          claim_data,
          updated_at: now,
        })
        .eq("id", finalizeDraftId)
        .select()
        .single();

      if (error || !updated) {
        console.error("Claim finalize error:", error);
        return NextResponse.json(
          { error: error?.message || "Failed to save claim" },
          { status: 500 }
        );
      }

      await runMilestones(finalizeDraftId);

      const claim = claimRowToLegacy(updated as Record<string, unknown>);
      return NextResponse.json(
        { claim, message: "Claim submitted successfully" },
        { status: 201 }
      );
    }

    const claimNumber = generateClaimNumber();

    const { data: inserted, error } = await supabase
      .from("claims")
      .insert({
        user_id: userId,
        claim_number: claimNumber,
        status: "pending",
        priority,
        claim_data,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error || !inserted) {
      console.error("Claim insert error:", error);
      return NextResponse.json(
        { error: error?.message || "Failed to save claim" },
        { status: 500 }
      );
    }

    const insertedId = String((inserted as Record<string, unknown>).id ?? "");
    if (insertedId) {
      await runMilestones(insertedId);
    }

    const claim = claimRowToLegacy(inserted as Record<string, unknown>);

    return NextResponse.json(
      {
        claim,
        message: "Claim submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting claim:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
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

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const statusFilter = searchParams.get("status")?.trim();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("claims")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data: rows, error, count } = await query.range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const claims = (rows || []).map((r) =>
      claimRowToLegacy(r as Record<string, unknown>)
    );
    const total = count ?? 0;

    return NextResponse.json({
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching claims:", error);

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
