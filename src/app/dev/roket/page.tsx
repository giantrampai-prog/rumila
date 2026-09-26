"use client";

// Pratinjau KHUSUS DEVELOPMENT modul Roket & Astronot tanpa akun. Di produksi halaman ini 404.

import { notFound } from "next/navigation";
import { RocketSpace } from "@/components/roket/rocket-space";

export default function DevRoket() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <RocketSpace />;
}
