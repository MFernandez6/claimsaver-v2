import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";

export async function GET() {
  try {
    console.log("🔍 Test admin claims API called");

    await dbConnect();
    console.log("✅ Database connected");

    const claims = await Claim.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const total = await Claim.countDocuments({});

    console.log(`✅ Found ${claims.length} claims out of ${total} total`);

    return NextResponse.json({
      data: claims,
      pagination: {
        page: 1,
        limit: 50,
        total,
        pages: Math.ceil(total / 50),
      },
    });
  } catch (error) {
    console.error("❌ Error in test admin claims API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
