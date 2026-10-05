import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/g1", destination: "/missions/g1", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/expertise-amiable-opposable", destination: "/missions/g5", permanent: true },
      { source: "/newpage1869f112", destination: "/", permanent: true }
    ];
  }
};

export default nextConfig;
