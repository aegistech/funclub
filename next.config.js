/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "viem",
    "@rainbow-me/rainbowkit",
    "@walletconnect/universal-provider",
    "thread-stream",
    "pino",
    "lokijs"
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Node.js polyfill fallbacks
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        stream: false,
        crypto: false,
      };

      // Completely ignore test files and the "tape" test library
      config.resolve.alias = {
        ...config.resolve.alias,
        tape: false,
        "thread-stream/test": false,
        "pino/test": false,
      };
    }
    return config;
  },
};

export default nextConfig;