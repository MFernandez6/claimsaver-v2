import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

interface DebugInfo {
  timestamp: string;
  environment: string | undefined;
  clerkKeys: {
    hasPublishableKey: boolean;
    publishableKeyType: string;
    hasSecretKey: boolean;
    secretKeyType: string;
  };
  database: {
    hasMongoUri: boolean;
    mongoUriLength: number;
  };
  authentication: {
    clerkUserId: string | null;
    userFound: boolean;
    userRole: string | null;
    error?: string;
  };
  databaseConnection: {
    connected: boolean;
    error: string | null;
  };
}

export async function GET() {
  try {
    const debugInfo: DebugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      clerkKeys: {
        hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        publishableKeyType:
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_live_")
            ? "production"
            : "development",
        hasSecretKey: !!process.env.CLERK_SECRET_KEY,
        secretKeyType: process.env.CLERK_SECRET_KEY?.startsWith("sk_live_")
          ? "production"
          : "development",
      },
      database: {
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriLength: process.env.MONGODB_URI?.length || 0,
      },
      authentication: {
        clerkUserId: null,
        userFound: false,
        userRole: null,
      },
      databaseConnection: {
        connected: false,
        error: null,
      },
    };

    // Check Clerk authentication
    try {
      const { userId } = await auth();
      debugInfo.authentication.clerkUserId = userId;

      if (userId) {
        // Try to connect to database
        try {
          await dbConnect();
          debugInfo.databaseConnection.connected = true;

          // Check if user exists in database
          const user = await User.findOne({ clerkId: userId });
          if (user) {
            debugInfo.authentication.userFound = true;
            debugInfo.authentication.userRole = user.role;
          }
        } catch (dbError) {
          debugInfo.databaseConnection.error =
            dbError instanceof Error
              ? dbError.message
              : "Unknown database error";
        }
      }
    } catch (authError) {
      debugInfo.authentication.error =
        authError instanceof Error ? authError.message : "Unknown auth error";
    }

    return NextResponse.json(debugInfo);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug endpoint error",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
