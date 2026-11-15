import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PwaSetup } from "@/components/pwa";
import { INTRO_SKRIP, IntroRinoya } from "@/components/intro";

// Font ditanam dari repo (src/fonts/app, subset latin, lisensi SIL OFL) — build tidak bergantung pada unduhan
// Google Fonts yang beberapa kali gagal di Vercel (15 Nov 2026). Semua berkas variabel.
const jakarta = localFont({ src: "../fonts/app/PlusJakartaSans.woff2", weight: "200 800", variable: "--font-jakarta", display: "swap" });

// Tema Playful (Family Launcher v2): Baloo 2 untuk judul, Nunito untuk teks.
const baloo = localFont({ src: "../fonts/app/Baloo2.woff2", weight: "400 800", variable: "--ff-baloo", display: "swap" });
const nunito = localFont({ src: "../fonts/app/Nunito.woff2", weight: "200 1000", variable: "--ff-nunito", display: "swap" });

const inter = localFont({ src: "../fonts/app/Inter.woff2", weight: "100 900", variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "RINOYA Academy — Rise Into Your Own Adventure",
  description: "RINOYA Academy — Every Child. Every Discovery. Every Possibility. Petualangan belajar 3D, game, dan edukasi untuk anak.",
  icons: {
    icon: [
      { url: "/icons/r-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/r-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/r-apple-touch-icon.png", sizes: "180x180" }],
  },
  // iOS: buka layar penuh seperti aplikasi saat dipasang dari "Tambah ke Layar Utama"
  appleWebApp: { capable: true, title: "RINOYA", statusBarStyle: "default" },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8ee",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${jakarta.variable} ${inter.variable} ${baloo.variable} ${nunito.variable}`}>
      <head>
        {/* lewati animasi pembuka bila sesi ini sudah melihatnya (sebelum paint, tanpa kedip) */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SKRIP }} />
        {/* display=block: cegah nama ikon tampil sebagai teks saat font belum siap */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0&display=block"
        />
      </head>
      <body>
        <IntroRinoya />
        {children}
        <PwaSetup />
      </body>
    </html>
  );
}
