"use client";

// Pratinjau KHUSUS DEVELOPMENT Koding Robi · Langkah tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { LangkahGame } from "@/components/koding/langkah-game";

export default function DevKoding() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <LangkahGame />;
}
