/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,           // Force use Webpack instead of Turbopack
  },

  transpilePackages: ["magni", "viem", "@rainbow-me/rainbowkit"],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },
};

export default nextConfig;
