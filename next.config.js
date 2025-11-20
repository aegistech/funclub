/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,  // Disable Turbopack để tránh conflict ESM
    swcMinify: true,   // Optimize build, skip unused files
  },

  transpilePackages: [
    'viem',
    '@rainbow-me/rainbowkit',
    '@walletconnect/universal-provider',
    'thread-stream',
    '@tanstack/react-query'  // Nếu dùng QueryClient
  ],

  webpack: (config, { isServer, dev }) => {
    // Thêm rule để exclude test paths theo webpack docs (pre-enforce để skip sớm)
    if (!dev && !isServer) {  // Chỉ production client build
      config.module.rules.push({
        oneOf: [  // Best practice: Short-circuit matching cho performance
          {
            test: /\.(js|jsx|ts|tsx)$/,
            enforce: 'pre',  // Pre-loader để ignore trước khi process
            exclude: /node_modules\/(thread-stream|viem|@walletconnect|rainbowkit).*\/(test|__tests__)/,  // RegExp exclude test dirs (specific packages)
            use: [],  // Không dùng loader nào cho excluded files
          },
          // Fallback cho các rule khác (giữ nguyên webpack default)
          ...config.module.rules.find(rule => rule.oneOf)?.oneOf || [],
        ],
      });
    }

    // Fallback cho node modules (giữ nguyên)
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
