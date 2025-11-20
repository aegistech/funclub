/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,
    swcMinify: true,
  },

  transpilePackages: [
    'viem',
    '@rainbow-me/rainbowkit',
    '@walletconnect/universal-provider',
    'thread-stream',
    '@tanstack/react-query',
  ],

  webpack: (config, { isServer, dev }) => {
    // Exclude test files from specific packages (fixes thread-stream/test/helper.js error)
    if (!dev && !isServer) {
      config.module.rules.push({
        oneOf: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            enforce: 'pre',
            exclude: /node_modules\/(thread-stream|viem|@walletconnect|rainbowkit).*\/(test|__tests__)/,
            use: [],
          },
          // Preserve existing rules
          ...(config.module.rules.find(rule => rule.oneOf)?.oneOf || []),
        ],
      });
    }

    // Polyfill fallbacks for browser (required by viem/rainbowkit)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        stream: false,
        crypto
