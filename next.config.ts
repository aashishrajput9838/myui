import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 19 features for performance
  reactStrictMode: true,
  
  // Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/demkeuigf/**", // Restrict to your Cloudinary account
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
    ],
    // Reduce image quality slightly for faster load times
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400, // Cache images for 1 day
  },
  
  // SWC optimizations
  swcMinify: true,
  
  // Compression
  compress: true,
  
  // Enable Turbopack for faster builds in dev
  experimental: {
    turbo: {},
  },
  
  // Power of 2 alignments for better compression
  webpack: (config) => {
    config.optimization.minimize = true;
    return config;
  },
};

export default nextConfig;
