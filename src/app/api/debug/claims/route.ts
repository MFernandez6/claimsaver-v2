import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";

export async function GET() {
  try {
    console.log("🔍 Debug claims API called");

    await dbConnect();
    console.log("✅ Database connected");

    const claims = await Claim.find({}).lean();
    console.log(`✅ Found ${claims.length} claims`);

    return NextResponse.json({
      claims: claims.map((claim) => ({
        id: claim._id,
        claimNumber: claim.claimNumber,
        claimantName: claim.claimantName,
        claimantEmail: claim.claimantEmail,
        status: claim.status,
        priority: claim.priority,
        estimatedValue: claim.estimatedValue,
        accidentDate: claim.accidentDate,
        submittedAt: claim.submittedAt,
        userId: claim.userId,
      })),
    });
  } catch (error) {
    console.error("❌ Error in debug claims API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
