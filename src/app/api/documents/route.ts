import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  buildStoragePath,
  uploadClaimDocument,
} from "@/lib/storage/claimDocuments";
import { documentRowToLegacy } from "@/lib/supabase/mappers";
import { randomUUID } from "crypto";

function classifyFileType(mime: string): string {
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("image")) return "image";
  if (mime.includes("video")) return "video";
  if (mime.includes("audio")) return "audio";
  return "document";
}

export async function GET() {
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

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("claim_documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("documents GET:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const documents = (data || []).map((row) =>
      documentRowToLegacy(row as Record<string, unknown>)
    );

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = (formData.get("description") as string) || "";
    const claimIdRaw = formData.get("claimId") as string | null;
    const file = formData.get("file") as File;

    if (!name || !type || !file) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          received: { name, type, hasFile: !!file },
        },
        { status: 400 }
      );
    }

    const allowed = ["medical", "legal", "insurance", "evidence", "other"];
    if (!allowed.includes(type)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    const documentId = randomUUID();
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const uploadDate = new Date().toISOString().split("T")[0];
    const fileType = classifyFileType(file.type);
    const bytes = Buffer.from(await file.arrayBuffer());
    const storagePath = buildStoragePath(userId, documentId, file.name);

    let claimId: string | null = null;
    if (claimIdRaw && claimIdRaw.length > 0) {
      const supabase = getSupabaseAdmin();
      const { data: claim } = await supabase
        .from("claims")
        .select("id")
        .eq("id", claimIdRaw)
        .eq("user_id", userId)
        .maybeSingle();
      if (claim) claimId = claimIdRaw;
    }

    await uploadClaimDocument(storagePath, bytes, file.type || "application/octet-stream");

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const { data: inserted, error } = await supabase
      .from("claim_documents")
      .insert({
        id: documentId,
        user_id: userId,
        claim_id: claimId,
        name,
        type,
        file_type: fileType,
        size_display: `${fileSizeMb} MB`,
        upload_date: uploadDate,
        description,
        file_name: file.name,
        mime_type: file.type || "application/octet-stream",
        storage_path: storagePath,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error || !inserted) {
      console.error("document insert:", error);
      return NextResponse.json(
        { error: error?.message || "Failed to save document" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      documentRowToLegacy(inserted as Record<string, unknown>),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
