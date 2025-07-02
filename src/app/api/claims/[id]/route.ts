import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id: claimId } = await params;

    console.log(`Fetching claim ${claimId} for user ${userId}`);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(claimId)) {
      console.log(`Invalid ObjectId format: ${claimId}`);
      return NextResponse.json(
        { error: "Invalid claim ID format" },
        { status: 400 }
      );
    }

    // Find the claim by ID and ensure it belongs to the authenticated user
    const claim = await Claim.findOne({
      _id: new mongoose.Types.ObjectId(claimId),
      userId: userId,
    }).lean(); // Use lean() for better performance

    if (!claim) {
      console.log(`Claim ${claimId} not found for user ${userId}`);
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    console.log(`Successfully fetched claim ${claimId}`);

    // Convert ObjectId to string for JSON serialization
    const claimData = {
      ...claim,
      _id: claimId, // Use the original claimId since we know it's valid
    };

    return NextResponse.json(claimData);
  } catch (error) {
    console.error("Error fetching claim:", error);

    // Provide more specific error messages
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { error: "Invalid claim ID format" },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
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
