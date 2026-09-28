import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  distDir: process.env.RUMILA_DIST_DIR || ".next",
  // Izinkan membuka dev server dari perangkat lain di jaringan lokal (tablet/HP), mis. http://192.168.1.8:3000
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  // Aset besar (model 3D, tekstur, rekaman suara, gambar): disimpan di cache browser & CDN 1 hari, lalu
  // diperbarui diam-diam di latar hingga 30 hari — dibuka ulang tanpa unduh/cek ulang ke server.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=86400, stale-while-revalidate=2592000" }];
    const assets = ["anatomy", "angkasa", "brand", "bumi", "fruits", "icons", "laut", "roket"].map((dir) => ({ source: `/${dir}/:path*`, headers: cache }));
    return [...assets, { source: "/laut/voice/v2/manifest.json", headers: [{ key: "Cache-Control", value: "no-store" }] }];
  },
};

export default nextConfig;
