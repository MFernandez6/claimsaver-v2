import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { NavbarLoader } from "@/components/navbar-loader";
import I18nProvider from "@/components/i18n-provider";
import Footer from "@/components/footer";
import { getPublicSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Display / marketing wordmark only — pairs with Geist for UI (Stripe-style pairing). */
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClaimSaver+ — Florida PIP claim software",
    template: "%s | ClaimSaver+",
  },
  description:
    "Self-service software for Florida no-fault (PIP) claims: guided forms, secure storage, and tracking.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "ClaimSaver+ — Florida PIP claim software",
    description:
      "Self-service software for Florida no-fault (PIP) claims: guided forms, secure storage, and tracking.",
    url: siteUrl,
    siteName: "ClaimSaver+",
    images: [
      {
        url: "/images/brand/claimsaver-og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "ClaimSaver+ — Florida PIP claim software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimSaver+ — Florida PIP claim software",
    description:
      "Self-service software for Florida no-fault (PIP) claims: guided forms, secure storage, and tracking.",
    images: ["/images/brand/claimsaver-og-share-1200x630.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} antialiased`}
      >
        <I18nProvider>
          <div className="min-h-screen min-w-0 bg-gradient-to-br from-gray-50 via-white to-emerald-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
            <NavbarLoader />
            <main className="min-w-0 w-full overflow-x-hidden pt-16 pb-[max(0px,env(safe-area-inset-bottom))]">
              {children}
            </main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
