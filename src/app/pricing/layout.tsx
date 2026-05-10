import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Florida PIP claim software | ClaimSaver+",
  description:
    "Flat $500 access to ClaimSaver+ guided PIP tools—not legal services. Optional DocuSign notarization sold separately. Illustrative fee comparisons only.",
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
