import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // basePath: "/bigbuck", // Odkomentuj jeśli repo nie jest w root
  // assetPrefix: "/bigbuck", // Odkomentuj jeśli repo nie jest w root
};

export default nextConfig;
