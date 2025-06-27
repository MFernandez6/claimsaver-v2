import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";

// Force dynamic rendering to prevent build-time analysis
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const stripeInstance = !!stripe;

    return NextResponse.json({
      status: "ok",
      environment: {
        hasSecretKey,
        hasPublishableKey,
        stripeInstance,
        secretKeyPrefix: hasSecretKey
          ? process.env.STRIPE_SECRET_KEY?.substring(0, 7) + "..."
          : null,
        publishableKeyPrefix: hasPublishableKey
          ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) +
            "..."
          : null,
      },
      message:
        hasSecretKey && hasPublishableKey && stripeInstance
          ? "Stripe is properly configured"
          : "Stripe environment variables are missing or invalid",
    });
  } catch (error) {
    console.error("Stripe debug endpoint error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check Stripe configuration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
