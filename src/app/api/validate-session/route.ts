import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the session to check its status
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const now = Math.floor(Date.now() / 1000);
    const isValid =
      session.status === "open" &&
      (!session.expires_at || session.expires_at > now);

    return NextResponse.json({
      valid: isValid,
      status: session.status,
      expiresAt: session.expires_at,
      currentTime: now,
      session: {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);

    return NextResponse.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
