import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ClaimSaver+ for platform, billing, and technical support. Not legal advice.",
  openGraph: {
    title: "Contact | ClaimSaver+",
    description: "Reach our team for support using ClaimSaver+.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
