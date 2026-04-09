import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduces barrel-import bloat and avoids flaky vendor-chunk references for lucide-react
  experimental: {
    optimizePackageImports: ["lucide-react"],
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
