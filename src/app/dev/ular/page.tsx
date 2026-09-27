"use client";

// Pratinjau KHUSUS DEVELOPMENT game Ular Tangga tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { UlarGame } from "@/components/ular/ular-game";

export default function DevUlar() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <UlarGame />;
}
