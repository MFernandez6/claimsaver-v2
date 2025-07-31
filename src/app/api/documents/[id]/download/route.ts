import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Document from "@/models/Document";
import { getFileBuffer } from "@/lib/fileStorage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const document = await Document.findOne({ _id: id, userId });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Check if we're in a serverless environment
    const isServerless =
      process.env.VERCEL || process.env.NODE_ENV === "production";

    if (isServerless) {
      // In serverless environments, we can't read files from local filesystem
      return NextResponse.json(
        {
          error: "File download not available",
          details:
            "File downloads are not supported in serverless environments. Please implement cloud storage.",
          code: "SERVERLESS_DOWNLOAD_ERROR",
        },
        { status: 500 }
      );
    }

    // Get the file buffer
    const fileBuffer = await getFileBuffer(document.url);

    // Create response with file
    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", document.mimeType);
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${document.fileName}"`
    );

    return response;
  } catch (error) {
    console.error("Error downloading document:", error);

    if (
      error instanceof Error &&
      error.message.includes("serverless environment")
    ) {
      return NextResponse.json(
        {
          error: "File download not available",
          details:
            "File downloads are not supported in serverless environments. Please implement cloud storage.",
          code: "SERVERLESS_DOWNLOAD_ERROR",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to download document" },
      { status: 500 }
    );
  }
}
