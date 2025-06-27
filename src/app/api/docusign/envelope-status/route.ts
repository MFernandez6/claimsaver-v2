import { NextRequest, NextResponse } from "next/server";
import { getEnvelopeStatus } from "@/lib/docusign";

// Force dynamic rendering to prevent build-time analysis
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { envelopeId } = await req.json();

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

    console.log("Checking DocuSign envelope status:", envelopeId);

    // Get envelope status
    const status = await getEnvelopeStatus(envelopeId);

    console.log("Envelope status retrieved:", status);

    return NextResponse.json({
      success: true,
      envelopeId: status.envelopeId,
      status: status.status,
      statusChangedDateTime: status.statusChangedDateTime,
      documentsUri: status.documentsUri,
    });
  } catch (error) {
    console.error("Error getting envelope status:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get envelope status",
      },
      { status: 500 }
    );
  }
}
