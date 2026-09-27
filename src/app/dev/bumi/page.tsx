"use client";

// Pratinjau KHUSUS DEVELOPMENT modul Petualangan ke Dalam Bumi tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { BumiSpace } from "@/components/bumi/bumi-space";

export default function DevBumi() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <BumiSpace />;
}
