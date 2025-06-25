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
    const { userId } = await auth();

    if (!userId) {
      return { isAuthorized: false, error: "Unauthorized", status: 401 };
    }

    await dbConnect();

    // Try to create user if missing
    const user = await createUserIfMissing();

    if (!user) {
      return {
        isAuthorized: false,
        error: "User not found. Please sign up first or contact support.",
        status: 404,
      };
    }

    // Check if user has admin role
    if (user.role !== "admin" && user.role !== "super_admin") {
      return {
        isAuthorized: false,
        error: "Insufficient permissions. Admin access required.",
        status: 403,
      };
    }

    return { isAuthorized: true, user };
  } catch (error) {
    console.error("Error checking admin auth:", error);
    return {
      isAuthorized: false,
      error: "Internal server error. Please try again.",
      status: 500,
    };
  }
}
