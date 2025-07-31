import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Document from "@/models/Document";
import { storeFile } from "@/lib/fileStorage";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching documents for user:", userId);
    await dbConnect();
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
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
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

    // Check if we're in a serverless environment
    const isServerless =
      process.env.VERCEL || process.env.NODE_ENV === "production";

    if (isServerless) {
      console.warn(
        "File uploads are not fully supported in serverless environments. Consider implementing cloud storage."
      );

      // For now, create a document record without actual file storage
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
      await dbConnect();
      console.log("Connected to MongoDB successfully");

      const document = new Document({
        userId,
        name,
        type,
        fileType,
        size: `${fileSize} MB`,
        uploadDate,
        description: description || "",
        url: `https://placeholder.com/files/${Date.now()}-${file.name}`,
        fileName: file.name,
        mimeType: file.type,
      });

      console.log("Saving document to MongoDB...");
      await document.save();
      console.log("Document saved successfully");

      return NextResponse.json({
        ...document.toObject(),
        message:
          "Document metadata saved. File storage not available in serverless environment.",
      });
    }

    // Store the actual file (only in development)
    const filePath = await storeFile(file, file.name);
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
    await dbConnect();
    console.log("Connected to MongoDB successfully");

    const document = new Document({
      userId,
      name,
      type,
      fileType,
      size: `${fileSize} MB`,
      uploadDate,
      description: description || "",
      url: filePath, // Store the actual file path
      fileName: file.name,
      mimeType: file.type,
    });

    console.log("Saving document to MongoDB...");
    await document.save();
    console.log("Document saved successfully");

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating document:", error);

    // Provide specific error messages for common MongoDB issues
    if (error instanceof Error) {
      if (error.message.includes("whitelist")) {
        return NextResponse.json(
          {
            error: "Database connection error",
            details:
              "MongoDB Atlas IP whitelist issue. Please contact support or check your MongoDB Atlas configuration.",
            code: "IP_WHITELIST_ERROR",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("authentication")) {
        return NextResponse.json(
          {
            error: "Database authentication error",
            details:
              "MongoDB credentials are invalid. Please check your connection string.",
            code: "AUTH_ERROR",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("ENOTFOUND")) {
        return NextResponse.json(
          {
            error: "Database connection error",
            details:
              "MongoDB host not found. Please check your connection string.",
            code: "HOST_NOT_FOUND",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("serverless environment")) {
        return NextResponse.json(
          {
            error: "File storage not available",
            details:
              "File uploads are not supported in serverless environments. Please implement cloud storage.",
            code: "SERVERLESS_STORAGE_ERROR",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
