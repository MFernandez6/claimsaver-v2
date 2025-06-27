import { NextRequest, NextResponse } from "next/server";
import { downloadDocument } from "@/lib/docusign";

// Force dynamic rendering to prevent build-time analysis
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { envelopeId, documentId = "1" } = await req.json();

    // Validate required fields
    if (!envelopeId) {
      return NextResponse.json(
        { error: "Missing required field: envelopeId" },
        { status: 400 }
      );
    }

    // Check if DocuSign is configured
    if (!process.env.DOCUSIGN_ACCOUNT_ID || !process.env.DOCUSIGN_CLIENT_ID) {
      return NextResponse.json(
        {
          error:
            "DocuSign is not configured. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    console.log("Downloading DocuSign document:", envelopeId, documentId);

    // Download document
    const documentBuffer = await downloadDocument(envelopeId, documentId);

    console.log("Document downloaded successfully");

    // Convert buffer to base64
    const documentBase64 = documentBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      documentBase64,
      message: "Document downloaded successfully",
    });
  } catch (error) {
    console.error("Error downloading document:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to download document",
      },
      { status: 500 }
    );
  }
}
