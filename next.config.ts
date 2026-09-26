import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  distDir: process.env.RUMILA_DIST_DIR || ".next",
  // Izinkan membuka dev server dari perangkat lain di jaringan lokal (tablet/HP), mis. http://192.168.1.8:3000
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
};

export default nextConfig;
