import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverRuntimeConfig: {
    secretKey: process.env.NEXT_SUPABASE_SECRET
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  },
  webpack(config){
    config.resolve.extensions.push('.mjs')
    return config
  },
  
};

export default nextConfig;
