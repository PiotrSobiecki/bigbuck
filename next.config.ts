import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/bigbuck",
  assetPrefix: "/bigbuck",
};

export default nextConfig;
