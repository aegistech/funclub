/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,  // Disable Turbopack to fix build errors with deps
  },

  transpilePackages: [
    "magni",
    "viem",
    "@rainbow-me/rainbowkit"
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false
      };
    }
    return config;
  },
};

export default nextConfig;
