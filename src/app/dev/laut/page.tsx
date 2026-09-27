"use client";

// Pratinjau KHUSUS DEVELOPMENT modul Petualangan Bawah Laut tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { LautSpace } from "@/components/laut/laut-space";

export default function DevLaut() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <LautSpace />;
}
