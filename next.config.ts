import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduces barrel-import bloat and avoids flaky vendor-chunk references for lucide-react
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
