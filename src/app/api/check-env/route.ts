import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    timestamp: new Date().toISOString(),
    clerk: {
      hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      publishableKeyType:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_live_")
          ? "production"
          : "development",
      hasSecretKey: !!process.env.CLERK_SECRET_KEY,
      secretKeyType: process.env.CLERK_SECRET_KEY?.startsWith("sk_live_")
        ? "production"
        : "development",
      publishableKeyPreview:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + "...",
    },
    database: {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPreview: process.env.MONGODB_URI
        ? process.env.MONGODB_URI.substring(0, 30) + "..."
        : "Not set",
    },
    app: {
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    },
  };

  return NextResponse.json(envCheck);
}
