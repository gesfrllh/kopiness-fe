import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.extensions.push('.mjs')
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tdlbsxwhiusuobvszxvg.storage.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tdlbsxwhiusuobvszxvg.supabase.co',
        pathname: '/**',
      }
    ]
  },
  devIndicators: false,
};

export default nextConfig;
