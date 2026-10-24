import type { Metadata } from "next";

// Halaman publik (tanpa login, tanpa AppShell): metadata khusus verifikasi sertifikat.
export const metadata: Metadata = {
  title: "Verifikasi Sertifikat — RINOYA Academy",
  description: "Periksa keaslian sertifikat jenjang RINOYA Academy lewat kode verifikasi.",
  robots: { index: false, follow: false },
};

export default function SertifikatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
