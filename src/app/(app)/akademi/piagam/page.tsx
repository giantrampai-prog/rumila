"use client";

// Lemari Piagam (Sekolah Tahap 4): semua penghargaan anak yang sedang masuk — Sertifikat Kenaikan Jenjang,
// Sertifikat Semester, Piagam Modul. ?lihat=semester:<sesi> | modul:<sesi> membuka satu dokumen.
// Dipakai juga oleh Ruang Orang Tua lewat komponen LemariPiagam (anak bisa dipilih).

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LemariPiagam } from "@/components/akademi/lemari";
import { useMe } from "@/lib/store";

function Isi() {
  const me = useMe();
  const q = useSearchParams();
  const router = useRouter();
  return <LemariPiagam anak={me} lihat={q.get("lihat")} onLihat={(v) => router.push(v ? `/akademi/piagam?lihat=${encodeURIComponent(v)}` : "/akademi/piagam")} kembali={<Link href="/akademi">Kembali</Link>} />;
}

export default function PiagamPage() {
  return (
    <Suspense>
      <Isi />
    </Suspense>
  );
}
