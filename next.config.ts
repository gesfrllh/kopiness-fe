import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverRuntimeConfig: {
    secretKey: process.env.NEXT_SUPABASE_SECRET
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  },
  webpack(config) {
    config.resolve.extensions.push('.mjs')
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      new URL("https://tdlbsxwhiusuobvszxvg.storage.supabase.co/**"),
      new URL("https://tdlbsxwhiusuobvszxvg.supabase.co/**")
    ]
  },
  devIndicators: false,
};

export default nextConfig;
