import { NextResponse } from "next/server";

export async function GET() {
  const clerkConfig = {
    timestamp: new Date().toISOString(),
    hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20) + "..."
      : "Not set",
    keyType: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith(
      "pk_live_"
    )
      ? "production"
      : "development",
    hasSecretKey: !!process.env.CLERK_SECRET_KEY,
    secretKey: process.env.CLERK_SECRET_KEY
      ? process.env.CLERK_SECRET_KEY.substring(0, 20) + "..."
      : "Not set",
    secretKeyType: process.env.CLERK_SECRET_KEY?.startsWith("sk_live_")
      ? "production"
      : "development",
    nodeEnv: process.env.NODE_ENV,
    isConfigured: !!(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY
    ),
  };

  return NextResponse.json(clerkConfig);
}
