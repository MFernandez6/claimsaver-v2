import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { removeClaimDocument } from "@/lib/storage/claimDocuments";
import { documentRowToLegacy } from "@/lib/supabase/mappers";

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

    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data: row, error } = await supabase
      .from("claim_documents")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!row) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({
      document: documentRowToLegacy(row as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Error fetching document:", error);
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

    const { id } = await params;
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from("claim_documents")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.description === "string") patch.description = body.description;
    if (
      typeof body.type === "string" &&
      ["medical", "legal", "insurance", "evidence", "other"].includes(body.type)
    ) {
      patch.type = body.type;
    }

    const { data: updated, error } = await supabase
      .from("claim_documents")
      .update(patch)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json(
        { error: error?.message || "Update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      document: documentRowToLegacy(updated as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Error updating document:", error);
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

    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data: row, error: fetchErr } = await supabase
      .from("claim_documents")
      .select("storage_path")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchErr || !row) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: fetchErr ? 500 : 404 }
      );
    }

    try {
      await removeClaimDocument(row.storage_path as string);
    } catch (e) {
      console.warn("Storage delete warning:", e);
    }

    const { error: delErr } = await supabase
      .from("claim_documents")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
