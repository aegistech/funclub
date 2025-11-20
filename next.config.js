/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,
  },

  // Disable SWC minify to force webpack for better control over deps
  swcMinify: false,

  transpilePackages: [
    'viem',
    '@rainbow-me/rainbowkit',
    '@walletconnect/universal-provider',
    'thread-stream',
    '@tanstack/react-query',
  ],

  // Force webpack for transpile (overrides SWC for these packages)
  webpack: (config, { isServer, dev, buildId }) => {
    // Externalize test files to skip them entirely (fixes module not found)
    config.externals = [
      ...(config.externals || []),
      (context, request, callback) => {
        if (/\/(test|__tests__)\/.*$/.test(request)) {
          return callback(null, `commonjs ${request}`);  // Treat test files as external
        }
        callback();
      },
    ];

    // Exclude specific test paths in module resolution
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        ...{
          '(thread-stream|viem|@walletconnect)/.*test.*': false,  // Alias test to false (skip)
        },
      };
    }

    // Fallback for node modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        stream: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
