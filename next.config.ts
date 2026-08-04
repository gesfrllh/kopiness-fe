import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async rewrites() {
    const backendUrl = process.env.API_PROXY_TARGET ?? 'http://localhost:7243'

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
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
