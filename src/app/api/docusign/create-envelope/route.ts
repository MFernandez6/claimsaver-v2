import { NextRequest, NextResponse } from "next/server";
import { createNotarizationEnvelope } from "@/lib/docusign";

// Force dynamic rendering to prevent build-time analysis
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { documentBase64, documentName, signerEmail, signerName } =
      await req.json();

    // Validate required fields
    if (!documentBase64 || !documentName || !signerEmail || !signerName) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: documentBase64, documentName, signerEmail, signerName",
        },
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

    console.log("Creating DocuSign envelope for notarization...");

    // Create envelope
    const envelope = await createNotarizationEnvelope(
      documentBase64,
      documentName,
      signerEmail,
      signerName
    );

    console.log("DocuSign envelope created successfully:", envelope.envelopeId);

    return NextResponse.json({
      success: true,
      envelopeId: envelope.envelopeId,
      status: envelope.status,
      message:
        "Document sent to DocuSign for notarization. You will receive an email with signing instructions.",
    });
  } catch (error) {
    console.error("Error creating DocuSign envelope:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create DocuSign envelope",
      },
      { status: 500 }
    );
  }
}
