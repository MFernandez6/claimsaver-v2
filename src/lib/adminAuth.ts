import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import { createUserIfMissing } from "./createUserIfMissing";

interface UserDocument {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
}

type AuthResult =
  | { isAuthorized: true; user: UserDocument }
  | { isAuthorized: false; error: string; status: number };

export async function checkAdminAuth(): Promise<AuthResult> {
  try {
    console.log("🔍 Checking admin authentication...");

    const { userId } = await auth();
    console.log("📋 Clerk user ID:", userId);

    if (!userId) {
      console.log("❌ No Clerk user ID found");
      return { isAuthorized: false, error: "Unauthorized", status: 401 };
    }

    console.log("🔗 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected");

    // Try to create user if missing
    console.log("👤 Checking if user exists in database...");
    const user = await createUserIfMissing();

    if (!user) {
      console.log("❌ User not found and could not be created");
      return {
        isAuthorized: false,
        error: "User not found. Please sign up first or contact support.",
        status: 404,
      };
    }

    console.log("✅ User found:", user.email, "Role:", user.role);

    // Check if user has admin role
    if (user.role !== "admin" && user.role !== "super_admin") {
      console.log("❌ User does not have admin privileges:", user.role);
      return {
        isAuthorized: false,
        error: "Insufficient permissions. Admin access required.",
        status: 403,
      };
    }

    console.log("✅ Admin authentication successful");
    return { isAuthorized: true, user };
  } catch (error) {
    console.error("❌ Error in admin authentication:", error);

    // Provide more specific error information
    let errorMessage = "Internal server error. Please try again.";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("MongoDB")) {
        errorMessage = "Database connection error. Please try again.";
      } else if (error.message.includes("authentication")) {
        errorMessage = "Authentication error. Please sign in again.";
        statusCode = 401;
      } else if (error.message.includes("CLERK")) {
        errorMessage = "Authentication service error. Please try again.";
        statusCode = 503;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      isAuthorized: false,
      error: errorMessage,
      status: statusCode,
    };
  }
}
