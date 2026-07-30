import type { NextConfig } from "next";
import {
  buildContentSecurityPolicy,
  SECURITY_HEADERS,
} from "./src/lib/security/csp";

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
          ...SECURITY_HEADERS,
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
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
