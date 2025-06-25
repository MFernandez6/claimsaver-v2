import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createUserIfMissing } from "@/lib/createUserIfMissing";

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

    // Try to create user if missing
    const user = await createUserIfMissing();

    if (!user) {
      return NextResponse.json({
        authenticated: true,
        clerkId: userId,
        userCreated: false,
        message: "Failed to create user record. Please contact support.",
        action: "Try signing out and signing back in, or contact support.",
      });
    }

    return NextResponse.json({
      authenticated: true,
      clerkId: userId,
      userCreated: true,
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
          : "You don't have admin privileges. Contact support to get admin access.",
      nextSteps:
        user.role === "admin" || user.role === "super_admin"
          ? "You can now access the admin dashboard at /admin"
          : "Contact support to get admin privileges",
    });
  } catch (error) {
    console.error("Debug user info error:", error);
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
