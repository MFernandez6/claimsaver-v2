import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Flat $500 guided platform access for Florida PIP—compare to typical contingency fees. Illustrative math only; not a guarantee of outcome.",
  openGraph: {
    title: "Pricing | ClaimSaver+",
    description:
      "Transparent pricing for ClaimSaver+ platform access. You are the filer; no contingency fee to ClaimSaver+.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
