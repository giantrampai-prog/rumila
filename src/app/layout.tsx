import type { Metadata, Viewport } from "next";
import { Baloo_2, Inter, Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PwaSetup } from "@/components/pwa";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Tema Playful (Family Launcher v2): Baloo 2 untuk judul, Nunito untuk teks.
const baloo = Baloo_2({ variable: "--ff-baloo", subsets: ["latin"], weight: ["700", "800"] });
const nunito = Nunito({ variable: "--ff-nunito", subsets: ["latin"], weight: ["600", "700", "800", "900"] });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rinoya Academy — Jelajahi, belajar, bermain",
  description: "Rinoya Academy — petualangan 3D, game, dan edukasi untuk anak.",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  // iOS: buka layar penuh seperti aplikasi saat dipasang dari "Tambah ke Layar Utama"
  appleWebApp: { capable: true, title: "Rinoya", statusBarStyle: "default" },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF6E8",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${inter.variable} ${baloo.variable} ${nunito.variable}`}>
      <head>
        {/* display=block: cegah nama ikon tampil sebagai teks saat font belum siap */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0&display=block"
        />
      </head>
      <body>
        {children}
        <PwaSetup />
      </body>
    </html>
  );
}
