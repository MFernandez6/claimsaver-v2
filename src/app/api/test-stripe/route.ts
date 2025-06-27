import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";

// Force dynamic rendering to prevent build-time analysis
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    // Check environment variables
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    // Test Stripe connection
    let stripeTest = null;
    if (hasSecretKey && stripe) {
      try {
        // Try to create a test product to verify Stripe connection
        stripeTest = await stripe.products.list({ limit: 1 });
      } catch (error) {
        console.error("Stripe connection test failed:", error);
      }
    }

    return NextResponse.json({
      status: "ok",
      environment: {
        hasSecretKey,
        hasPublishableKey,
        secretKeyPrefix: hasSecretKey
          ? process.env.STRIPE_SECRET_KEY?.substring(0, 7) + "..."
          : null,
        publishableKeyPrefix: hasPublishableKey
          ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) +
            "..."
          : null,
      },
      stripeConnection: stripeTest ? "success" : "failed",
      message:
        hasSecretKey && hasPublishableKey
          ? "Stripe is properly configured"
          : "Stripe environment variables are missing",
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to test Stripe configuration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
