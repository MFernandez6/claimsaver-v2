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
