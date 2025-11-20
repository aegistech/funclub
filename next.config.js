/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,  // Disable Turbopack to fix build conflicts with viem/rainbowkit deps
  },

  transpilePackages: [
    "viem",
    "@rainbow-me/rainbowkit"
  ],  // Transpile web3 packages to avoid module type errors

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false
      };  // Fallback for node-like modules in browser (common with viem)
    }
    return config;
  },
};

export default nextConfig;
