"use client";

// Pratinjau KHUSUS DEVELOPMENT Umroh Virtual tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { UmrohVirtual } from "@/components/umroh/umroh-virtual";

export default function DevUmroh() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <UmrohVirtual />;
}
