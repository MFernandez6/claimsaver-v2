import { NextResponse } from "next/server";

export async function GET() {
  const clerkConfig = {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      ? "Set"
      : "Not Set",
    secretKey: process.env.CLERK_SECRET_KEY ? "Set" : "Not Set",
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  };

  return NextResponse.json({
    status: "Clerk Configuration Check",
    config: clerkConfig,
    timestamp: new Date().toISOString(),
  });
}
