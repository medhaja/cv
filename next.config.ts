import type { NextConfig } from "next";

// Static export for GitHub Pages (custom domain medhaja.me, served from root).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
