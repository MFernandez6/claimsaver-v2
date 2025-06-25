import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    console.log("🔍 Debug users API called");

    await dbConnect();
    console.log("✅ Database connected");

    const users = await User.find({}).lean();
    console.log(`✅ Found ${users.length} users`);

    return NextResponse.json({
      users: users.map((user) => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        clerkId: user.clerkId,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ Error in debug users API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
