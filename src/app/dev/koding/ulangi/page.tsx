"use client";

// Pratinjau KHUSUS DEVELOPMENT Coding Agam · Ulangi tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { UlangiGame } from "@/components/koding/ulangi-game";

export default function DevKodingUlangi() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <UlangiGame />;
}
