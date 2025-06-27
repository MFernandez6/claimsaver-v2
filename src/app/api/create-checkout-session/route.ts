import { NextRequest, NextResponse } from "next/server";
import { stripe, formatAmountForStripe } from "@/lib/stripe-server";

// Force dynamic rendering to prevent build-time analysis
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface CheckoutItem {
  name: string;
  description: string;
  price: number;
  quantity?: number;
}

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!stripe) {
      console.error("Stripe is not properly configured");
      return NextResponse.json(
        {
          error:
            "Stripe is not configured. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    // Log the request for debugging
    console.log("Creating checkout session...");

    const {
      items,
      successUrl,
      cancelUrl,
    }: { items: CheckoutItem[]; successUrl?: string; cancelUrl?: string } =
      await req.json();

    console.log("Received items:", items);

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items provided:", items);
      return NextResponse.json(
        { error: "Invalid items provided" },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (
        !item.name ||
        !item.description ||
        typeof item.price !== "number" ||
        item.price <= 0
      ) {
        console.error("Invalid item:", item);
        return NextResponse.json(
          { error: `Invalid item: ${JSON.stringify(item)}` },
          { status: 400 }
        );
      }
    }

    // Create line items for Stripe
    const lineItems = items.map((item: CheckoutItem) => {
      const amount = formatAmountForStripe(item.price, "USD");
      console.log(
        `Item: ${item.name}, Price: $${item.price}, Stripe amount: ${amount}`
      );

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: amount,
        },
        quantity: item.quantity || 1,
      };
    });

    console.log("Line items created:", lineItems);

    // Get origin safely
    const headers = req.headers;
    const origin =
      headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    // Create checkout session
    const sessionData = {
      payment_method_types: ["card" as const],
      line_items: lineItems,
      mode: "payment" as const,
      success_url:
        successUrl || `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/pricing`,
      metadata: {
        items: JSON.stringify(
          items.map((item: CheckoutItem) => ({
            name: item.name,
            price: item.price,
          }))
        ),
      },
    };

    console.log("Creating session with data:", sessionData);

    const session = await stripe.checkout.sessions.create(sessionData);

    console.log("Session created successfully:", session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("apiKey")) {
        return NextResponse.json(
          { error: "Stripe API key is invalid or missing" },
          { status: 500 }
        );
      }
      if (error.message.includes("currency")) {
        return NextResponse.json(
          { error: "Invalid currency specified" },
          { status: 400 }
        );
      }
      if (error.message.includes("amount")) {
        return NextResponse.json(
          { error: "Invalid amount specified" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
