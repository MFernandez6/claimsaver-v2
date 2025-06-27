import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-05-28.basil",
});

export const formatAmountForStripe = (
  amount: number,
  currency: string
): number => {
  const currencies = ["USD", "EUR", "GBP"];
  const multiplier = currencies.includes(currency) ? 100 : 1;
  return Math.round(amount * multiplier);
};
