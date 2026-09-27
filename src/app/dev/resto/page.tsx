"use client";

// Pratinjau KHUSUS DEVELOPMENT game Rinoya Resto tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { RestoGame } from "@/components/resto/resto-game";

export default function DevResto() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <RestoGame />;
}
