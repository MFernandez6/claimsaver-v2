"use client";

import { useState } from "react";
import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";

export default function TestStripeClient() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testStripeLoad = async () => {
    setLoading(true);
    setStatus("Testing Stripe client...");

    try {
      const stripe = await getStripe();
      if (stripe) {
        setStatus("✅ Stripe loaded successfully!");
        console.log("Stripe object:", stripe);
      } else {
        setStatus("❌ Stripe failed to load");
      }
    } catch (error) {
      setStatus(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      console.error("Stripe test error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testCheckout = async () => {
    setLoading(true);
    setStatus("Testing checkout...");

    try {
      // First create a session
      const response = await fetch("/api/test-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create session");
      }

      setStatus("✅ Session created, testing redirect...");

      // Then test redirect
      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          throw new Error(error.message);
        }

        setStatus("✅ Redirect initiated successfully!");
      } else {
        throw new Error("Stripe not available");
      }
    } catch (error) {
      setStatus(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      console.error("Checkout test error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Stripe Client Test
        </h1>

        <div className="space-y-4">
          <Button
            onClick={testStripeLoad}
            disabled={loading}
            className="w-full"
          >
            Test Stripe Load
          </Button>

          <Button
            onClick={testCheckout}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            Test Checkout
          </Button>

          {status && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">{status}</div>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>
            Stripe Key:{" "}
            {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Set" : "Missing"}
          </p>
        </div>
      </div>
    </div>
  );
}
