import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claim Form",
  description:
    "Florida no-fault application worksheet—guided fields and secure save. You are the filer; not legal advice.",
  openGraph: {
    title: "Claim Form | ClaimSaver+",
    description:
      "Step-by-step PIP worksheet to organize your information before you file with your insurer.",
  },
};

export default function ClaimFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
