import Stripe from "stripe";

// Only create Stripe instance if secret key is available
const createStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.warn("STRIPE_SECRET_KEY is not set");
    return null;
  }

  try {
    return new Stripe(secretKey, {
      apiVersion: "2025-05-28.basil",
    });
  } catch (error) {
    console.error("Failed to create Stripe instance:", error);
    return null;
  }
};

export const stripe = createStripeInstance();

export const formatAmountForStripe = (
  amount: number,
  currency: string
): number => {
  const currencies = ["USD", "EUR", "GBP"];
  const multiplier = currencies.includes(currency) ? 100 : 1;
  return Math.round(amount * multiplier);
};
