import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import I18nProvider from "@/components/i18n-provider";
import SessionManager from "@/components/session-manager";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claimsaverplus.net"),
  title: "ClaimSaver+ — Self-help Florida PIP claim tools",
  description:
    "Guided no-fault (PIP) forms, document storage, and tracking so you can file your own Florida motor vehicle claim. Not a law firm; not legal advice.",
  openGraph: {
    title: "ClaimSaver+ — Self-help Florida PIP claim tools",
    description:
      "Guided no-fault (PIP) forms, document storage, and tracking so you can file your own Florida motor vehicle claim. Not a law firm; not legal advice.",
    url: "https://claimsaverplus.net",
    siteName: "ClaimSaver+",
    images: [
      {
        url: "/images/brand/claimsaver-social-banner-concept-01.png",
        width: 1200,
        height: 630,
        alt: "ClaimSaver+ — Self-help Florida PIP claim tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimSaver+ — Self-help Florida PIP claim tools",
    description:
      "Guided no-fault (PIP) forms, document storage, and tracking so you can file your own Florida motor vehicle claim.",
    images: ["/images/brand/claimsaver-social-banner-concept-01.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no publishable key is available (like during static generation), render without Clerk
  if (!publishableKey) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <I18nProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
              <Navbar />
              <main className="pt-16">{children}</main>
              <Footer />
            </div>
          </I18nProvider>
        </body>
      </html>
    );
  }

  // Render with Clerk when publishable key is available
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        elements: {
          formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-white",
          card: "shadow-lg border border-gray-200 dark:border-gray-700",
          headerTitle: "text-gray-900 dark:text-white",
          headerSubtitle: "text-gray-600 dark:text-gray-300",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <I18nProvider>
            <SessionManager />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
              <Navbar />
              <main className="pt-16">{children}</main>
              <Footer />
            </div>
          </I18nProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
