"use client";

// Pratinjau KHUSUS DEVELOPMENT Coding Agam · Pola tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { PolaGame } from "@/components/koding/pola-game";

export default function DevKodingPola() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <PolaGame />;
}
