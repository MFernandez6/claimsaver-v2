import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import SessionManager from "@/components/session-manager";
import I18nProvider from "@/components/i18n-provider";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClaimSaver+ - Accident Form Filing and Recovery App",
  description:
    "Simplify the process of filing no-fault accident forms and recovering compensation. Currently servicing Florida and New York with additional states to be added in the future.",
  openGraph: {
    title: "ClaimSaver+ - Accident Form Filing and Recovery App",
    description:
      "Simplify the process of filing no-fault accident forms and recovering compensation. Currently servicing Florida and New York with additional states to be added in the future.",
    url: "https://claimsaverplus.net",
    siteName: "ClaimSaver+",
    images: [
      {
        url: "/images/long-logo-ClaimSaver.jpg",
        width: 1200,
        height: 630,
        alt: "ClaimSaver+ - Accident Form Filing and Recovery App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimSaver+ - Accident Form Filing and Recovery App",
    description:
      "Simplify the process of filing no-fault accident forms and recovering compensation. Currently servicing Florida and New York with additional states to be added in the future.",
    images: ["/images/long-logo-ClaimSaver.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no publishable key is available (like during static generation), render without Clerk
  if (!publishableKey) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <I18nProvider>
            <Navbar />
            {children}
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
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
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
            <Navbar />
            {children}
          </I18nProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
