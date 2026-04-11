import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "License & Credentials",
  description:
    "Transparency about ClaimSaver+ licensing and credentials. Guided software—not a law firm or your representative with insurers.",
  openGraph: {
    title: "License & Credentials | ClaimSaver+",
    description:
      "How we present Florida credentials and optional future services—clearly separated from standard platform access.",
  },
};

export default function LicenseCredentialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
