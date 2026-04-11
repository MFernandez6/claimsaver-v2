import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Guided PIP forms, secure document storage, and tracking so you can prepare and submit your own Florida no-fault claim—not representation or negotiation.",
  openGraph: {
    title: "What We Do | ClaimSaver+",
    description:
      "What the ClaimSaver+ platform includes: guided workflows, validation, and organization—without acting as your adjuster or attorney.",
  },
};

export default function WhatWeDoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
