import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendEmail, generateDocumentShareEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recipientEmail, message, document } = body;

    if (!recipientEmail || !document) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Generate email content
    console.log("Generating email for document:", {
      id: document._id,
      name: document.name,
      url: document.url,
      fileName: document.fileName,
      mimeType: document.mimeType,
    });

    const emailData = await generateDocumentShareEmail(
      recipientEmail,
      document,
      message
    );

    // Send the email
    const emailSent = await sendEmail(emailData);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document shared successfully",
    });
  } catch (error) {
    console.error("Error sharing document:", error);
    return NextResponse.json(
      { error: "Failed to share document" },
      { status: 500 }
    );
  }
}
