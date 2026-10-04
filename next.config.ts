import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  async redirects() {
    return [{ source: "/discover-pg-in-thane/pg-in-thane-station-thane", destination: "/discover-pg-in-thane/pg-near-railway-station-thane", permanent: true }];
  }
};

export default nextConfig;