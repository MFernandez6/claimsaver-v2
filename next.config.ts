import type { NextConfig } from "next";

/** CSP + security headers are applied in src/middleware.ts (nonce-based). */

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
  async redirects() {
    return [
      { source: "/signin", destination: "/login", permanent: true },
      { source: "/sign-in", destination: "/login", permanent: true },
      { source: "/sign-up", destination: "/signup", permanent: true },
      {
        source: "/need-professional-help",
        destination: "/when-to-call-an-attorney",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
