import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "commondatastorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "media.gettyimages.com",
      },
      {
        protocol: "https",
        hostname: "cdn.lexai.com",
      },
      {
        protocol: "https",
        hostname: "loudicon.in",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
    ],
  },
  // Proxy API requests to backend to avoid CORS/cookie issues with HTTP
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://207-180-211-24.nip.io:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
