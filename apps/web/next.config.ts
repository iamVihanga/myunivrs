import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/ui",
    "@nextplate/api",
    "@nextplate/rpc",
    "@repo/eslint-config",
    "@repo/typescript-config",
    "@repo/database",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "donext.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        // You can optionally add `port: ''` or `pathname: '/:path*'` if needed,
        // but for simple placeholder images, just hostname should be enough.
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
