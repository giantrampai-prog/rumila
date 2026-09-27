"use client";

// Pratinjau KHUSUS DEVELOPMENT Coding Agam · Kalau… tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { KalauGame } from "@/components/koding/kalau-game";

export default function DevKodingKalau() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <KalauGame />;
}
