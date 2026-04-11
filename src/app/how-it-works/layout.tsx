import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Your claim, your control, our tools—step-by-step guided PIP filing, documents, and reminders. General information only; not legal advice.",
  openGraph: {
    title: "How It Works | ClaimSaver+",
    description:
      "See how ClaimSaver+ walks you through Florida PIP claim preparation while you stay in control.",
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
