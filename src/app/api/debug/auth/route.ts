import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    console.log("🔍 Debug auth API called");

    const { userId } = await auth();
    console.log("📋 Clerk user ID:", userId);

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        error: "No user ID found",
      });
    }

    await dbConnect();
    console.log("✅ Database connected");

    const user = await User.findOne({ clerkId: userId }).lean();
    console.log("👤 User from database:", user);

    return NextResponse.json({
      authenticated: true,
      clerkId: userId,
      user: user,
    });
  } catch (error) {
    console.error("❌ Error in debug auth API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
