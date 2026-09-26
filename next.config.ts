import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  distDir: process.env.RUMILA_DIST_DIR || ".next",
  // Allow previewing the dev server from phones on the local network.
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
