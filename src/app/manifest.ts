import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rumila — Rumah digital keluarga",
    short_name: "Rumila",
    description: "Rumah digital untuk keluarga bertumbuh bersama.",
    start_url: "/beranda",
    display: "standalone",
    background_color: "#FAF8F4",
    theme_color: "#FAF8F4",
    lang: "id",
    icons: [{ src: "/brand/rumila-mark.png", sizes: "380x350", type: "image/png" }],
  };
}
