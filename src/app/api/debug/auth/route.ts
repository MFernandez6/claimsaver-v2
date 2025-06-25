import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

interface UserDocument {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        error: "No user ID found",
        message: "You need to sign in first",
      });
    }

    await dbConnect();

    // Find user by Clerk ID
    const user = (await User.findOne({
      clerkId: userId,
    }).lean()) as UserDocument | null;

    if (!user) {
      return NextResponse.json({
        authenticated: true,
        clerkId: userId,
        userFound: false,
        message:
          "User exists in Clerk but not in our database. You need to sign up first.",
        action: "Go to /sign-up to create your account",
      });
    }

    return NextResponse.json({
      authenticated: true,
      clerkId: userId,
      userFound: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
      isAdmin: user.role === "admin" || user.role === "super_admin",
      message:
        user.role === "admin" || user.role === "super_admin"
          ? "You have admin access"
          : "You don't have admin privileges",
    });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
