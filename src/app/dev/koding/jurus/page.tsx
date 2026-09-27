"use client";

// Pratinjau KHUSUS DEVELOPMENT Coding Agam · Jurus tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { JurusGame } from "@/components/koding/jurus-game";

export default function DevKodingJurus() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <JurusGame />;
}
