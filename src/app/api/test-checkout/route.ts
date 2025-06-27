import { NextRequest, NextResponse } from "next/server";
import { stripe, formatAmountForStripe } from "@/lib/stripe-server";

// Force dynamic rendering to prevent build-time analysis
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    console.log("Testing minimal checkout session creation...");

    // Create a minimal test session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card" as const],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Test Service",
              description: "Test service for debugging",
            },
            unit_amount: formatAmountForStripe(10, "USD"), // $10.00
          },
          quantity: 1,
        },
      ],
      mode: "payment" as const,
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/pricing`,
    });

    console.log("Test session created successfully:", session.id);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      message: "Test checkout session created successfully",
    });
  } catch (error) {
    console.error("Test checkout error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 }
    );
  }
}
