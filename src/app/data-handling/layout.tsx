import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data handling & security",
  description:
    "How ClaimSaver+ handles claim-related data: HIPAA scope, encryption, vendors, Stripe payments, and authentication.",
};

export default function DataHandlingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
