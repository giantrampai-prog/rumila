"use client";

// Pratinjau KHUSUS DEVELOPMENT untuk menguji modul 3D tanpa akun (tidak ada data/progres yang ditulis:
// sesi belajar hanya dicatat untuk anggota yang sudah masuk). Di produksi halaman ini 404.

import { notFound, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Explorer } from "@/components/angkasa/explorer";
import type { Mode } from "@/lib/angkasa/state";

function Preview() {
  const p = useSearchParams();
  return <Explorer memberId="dev-preview" initial={{ obj: p.get("obj") ?? undefined, mode: (p.get("mode") as Mode) ?? undefined }} />;
}

export default function DevAngkasa() {
  // Hanya development, atau build ukur lokal dengan NEXT_PUBLIC_ANGKASA_PREVIEW=1 (jangan dipakai untuk deploy).
  if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_ANGKASA_PREVIEW !== "1") notFound();
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}
