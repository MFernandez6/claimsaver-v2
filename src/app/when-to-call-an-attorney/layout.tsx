import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "When to Call an Attorney",
  description:
    "Standard Florida PIP claims vs. situations that may need a licensed attorney—complex liability, denials, serious injury, and more.",
  openGraph: {
    title: "When to Call an Attorney | ClaimSaver+",
    description:
      "Know when a standard PIP filing is enough and when to involve a licensed attorney.",
  },
};

export default function WhenToCallAttorneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
