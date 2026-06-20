import type { NextConfig } from "next";

const apiBaseUrl = process.env.API_BASE_URL ?? '';
const apiUrl = apiBaseUrl ? new URL(apiBaseUrl) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      ...(apiUrl
        ? [
            {
              protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
              hostname: apiUrl.hostname,
              port: apiUrl.port,
              pathname: '/uploads/**',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
