// Client-side Stripe configuration only
export const getStripe = async () => {
  if (typeof window !== "undefined") {
    const { loadStripe } = await import("@stripe/stripe-js");
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.warn("Stripe publishable key not found");
      return null;
    }

    return loadStripe(publishableKey);
  }
  return null;
};

export const formatAmountForDisplay = (
  amount: number,
  currency: string
): string => {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  return numberFormat.format(amount);
};

export const formatAmountForStripe = (
  amount: number,
  currency: string
): number => {
  const currencies = ["USD", "EUR", "GBP"];
  const multiplier = currencies.includes(currency) ? 100 : 1;
  return Math.round(amount * multiplier);
};
