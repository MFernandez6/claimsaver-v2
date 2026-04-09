import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "When to Call an Attorney | ClaimSaver+",
  description:
    "Standard Florida PIP claims vs. situations that may need a licensed attorney—complex liability, denials, serious injury, and more.",
};

export default function WhenToCallAttorneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
