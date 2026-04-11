import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Center",
  description:
    "General education about Florida PIP—not legal advice. Topic overviews; consult a licensed attorney for your situation.",
  openGraph: {
    title: "Learning Center | ClaimSaver+",
    description:
      "Educational topics on Florida no-fault claims. For general information only.",
  },
};

export default function LearningCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
