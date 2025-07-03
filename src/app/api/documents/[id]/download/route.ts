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
    return NextResponse.json(
      { error: "Failed to download document" },
      { status: 500 }
    );
  }
}
