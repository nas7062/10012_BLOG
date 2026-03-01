import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,

  turbopack: {},

  images: {
    qualities: [70, 75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "shopping-phinf.pstatic.net" },
      { protocol: "http", hostname: "shopping-phinf.pstatic.net" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
      { protocol: "http", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "kauoiizupgmbaysdnmce.supabase.co" },
      { protocol: "http", hostname: "kauoiizupgmbaysdnmce.supabase.co" },
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
};

export default nextConfig;
