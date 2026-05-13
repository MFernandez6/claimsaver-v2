import type { NextConfig } from "next";

/**
 * Production Content-Security-Policy: Stripe + Supabase + Google OAuth + fonts.
 * Set DISABLE_CSP=1 to skip (debugging only). Tighten `unsafe-inline` when migrating to nonces.
 */
function buildContentSecurityPolicy(): string {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    [
      "script-src",
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://js.stripe.com",
      "https://*.stripe.com",
      "https://challenges.cloudflare.com",
      "https://accounts.google.com",
    ].join(" "),
    [
      "style-src",
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
    ].join(" "),
    [
      "img-src",
      "'self'",
      "data:",
      "blob:",
      "https:",
    ].join(" "),
    [
      "font-src",
      "'self'",
      "data:",
      "https://fonts.gstatic.com",
    ].join(" "),
    [
      "connect-src",
      "'self'",
      "https://*.supabase.co",
      "wss://*.supabase.co",
      "https://api.stripe.com",
      "https://*.stripe.com",
      "https://*.claimsaverplus.com",
      "https://accounts.google.com",
      "https://oauth2.googleapis.com",
      "https://www.googleapis.com",
      "https://challenges.cloudflare.com",
    ].join(" "),
    [
      "frame-src",
      "'self'",
      "https://js.stripe.com",
      "https://hooks.stripe.com",
      "https://*.stripe.com",
      "https://accounts.google.com",
      "https://*.google.com",
      "https://challenges.cloudflare.com",
    ].join(" "),
    "form-action 'self' https://checkout.stripe.com https://*.stripe.com",
    "upgrade-insecure-requests",
  ];
  return directives.join("; ");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // Tree-shake icon and Radix barrels so unused modules stay out of client bundles.
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-slot",
    ],
  },
  async headers() {
    if (
      process.env.DISABLE_CSP === "1" ||
      process.env.NODE_ENV !== "production"
    ) {
      return [];
    }
    const csp = buildContentSecurityPolicy();
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/need-professional-help",
        destination: "/when-to-call-an-attorney",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
