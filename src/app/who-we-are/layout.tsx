import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Our story and mission: guided Florida PIP claim filing tools—not a law firm. You are the filer; ClaimSaver+ provides software and education.",
  openGraph: {
    title: "Who We Are | ClaimSaver+",
    description:
      "Learn why we built ClaimSaver+ for Florida drivers and how we stay clear about what software can and cannot do.",
  },
};

export default function WhoWeAreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
