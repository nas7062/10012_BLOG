import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler :false,
  images: {
    qualities: [70, 75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shopping-phinf.pstatic.net",
      },
      {
        protocol: "http",
        hostname: "shopping-phinf.pstatic.net",
      },

      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },

      {
        protocol: "https",
        hostname: "kauoiizupgmbaysdnmce.supabase.co",
      },
      {
        protocol: "http",
        hostname: "kauoiizupgmbaysdnmce.supabase.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280],   
  imageSizes: [160, 240, 320, 384], 
    minimumCacheTTL: 60 * 60,
    dangerouslyAllowSVG: false,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "lucide-react",
      "dayjs",
    ],
  },
  // 웹팩 최적화
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트 번들 최적화
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // 큰 라이브러리들을 별도 청크로 분리
            chartjs: {
              name: "chartjs",
              test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
              priority: 30,
            },
            mdeditor: {
              name: "mdeditor",
              test: /[\\/]node_modules[\\/]@uiw[\\/]react-md-editor[\\/]/,
              priority: 30,
            },
            reactVendor: {
              name: "react-vendor",
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 40,
            },
            common: {
              name: "common",
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
