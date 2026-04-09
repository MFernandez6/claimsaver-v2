import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { downloadClaimDocumentBytes } from "@/lib/storage/claimDocuments";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { data: doc, error } = await supabase
      .from("claim_documents")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const fileBuffer = await downloadClaimDocumentBytes(
      doc.storage_path as string
    );

    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", doc.mime_type as string);
    response.headers.set("Content-Disposition", "inline");
    response.headers.set("Cache-Control", "private, max-age=3600");

    return response;
  } catch (error) {
    console.error("Error viewing document:", error);
    return NextResponse.json(
      { error: "Failed to view document" },
      { status: 500 }
    );
  }
}
