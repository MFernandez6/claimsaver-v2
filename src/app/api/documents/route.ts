import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching documents for user:", userId);
    await connectDB();
    console.log("Connected to MongoDB successfully");

    const documents = await Document.find({ userId }).sort({ createdAt: -1 });
    console.log("Found documents:", documents.length);

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

    // Check if MongoDB URI is configured
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    console.log("Received document upload:", {
      name,
      type,
      description,
      fileName: file?.name,
    });

    if (!name || !type || !file) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          received: { name, type, hasFile: !!file },
        },
        { status: 400 }
      );
    }

    // For now, we'll store file info without actual file upload
    // In production, you'd want to upload to a service like AWS S3
    const fileSize = (file.size / (1024 * 1024)).toFixed(1);
    const uploadDate = new Date().toISOString().split("T")[0];

    const fileType = file.type.includes("pdf")
      ? "pdf"
      : file.type.includes("image")
      ? "image"
      : file.type.includes("video")
      ? "video"
      : file.type.includes("audio")
      ? "audio"
      : "document";

    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected to MongoDB successfully");

    const document = new Document({
      userId,
      name,
      type,
      fileType,
      size: `${fileSize} MB`,
      uploadDate,
      description: description || "",
      url: "#", // In production, this would be the actual file URL
      fileName: file.name,
      mimeType: file.type,
    });

    console.log("Saving document to MongoDB...");
    await document.save();
    console.log("Document saved successfully");

    return NextResponse.json(document);
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
