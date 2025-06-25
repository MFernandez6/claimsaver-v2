import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Admin claims API called");

    const authResult = await checkAdminAuth();

    if (!authResult.isAuthorized) {
      console.log("❌ Admin auth failed:", authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    console.log("✅ Admin auth successful for user:", authResult.user.email);

    await dbConnect();
    console.log("✅ Database connected");

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    console.log("📋 Query params:", { status, search, page, limit });

    // Build query
    const query: Record<string, unknown> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { claimNumber: { $regex: search, $options: "i" } },
        { claimantName: { $regex: search, $options: "i" } },
        { claimantEmail: { $regex: search, $options: "i" } },
      ];
    }

    console.log("🔍 Executing database query...");
    const claims = await Claim.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Claim.countDocuments(query);

    console.log(`✅ Found ${claims.length} claims out of ${total} total`);

    return NextResponse.json({
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error in admin claims API:", error);

    // Provide more specific error information
    let errorMessage = "Internal server error. Please try again.";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("MongoDB")) {
        errorMessage = "Database connection error. Please try again.";
      } else if (error.message.includes("authentication")) {
        errorMessage = "Authentication error. Please sign in again.";
        statusCode = 401;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: statusCode }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();

    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();
    const body = await request.json();

    const claim = new Claim({
      ...body,
      userId: authResult.user.clerkId,
    });

    await claim.save();

    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    console.error("Error creating claim:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
