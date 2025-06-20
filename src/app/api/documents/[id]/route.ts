import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const document = await Document.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);

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
