/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Tắt Turbopack để dùng Webpack ổn định (bắt buộc với config fallback fs)
    turbopack: false,
  },

  transpilePackages: ["magni", "viem", "@rainbow-me/rainbowkit"],

  // Fix lỗi fs fallback cho các package chạy trên client
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
