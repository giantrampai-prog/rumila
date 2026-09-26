import type { MetadataRoute } from "next";

// Manifest aplikasi web (PWA): bisa dipasang di layar utama Android & iOS.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Rumila — Belajar & bermain",
    short_name: "Rumila",
    description: "Jelajah angkasa, tubuh manusia, dan roket 3D untuk anak.",
    start_url: "/beranda",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#FFF6E8",
    theme_color: "#FFF6E8",
    lang: "id",
    categories: ["education", "kids"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
