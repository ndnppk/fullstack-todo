import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ข้ามการตรวจ TypeScript ตอน Build บน Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // ข้ามการตรวจ ESLint ตอน Build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;