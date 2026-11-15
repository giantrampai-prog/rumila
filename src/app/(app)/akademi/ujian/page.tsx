"use client";

// /akademi/ujian?jenis=kuis|semester|kenaikan&ruang=<unit|S1|S2> — ujian jenjang aktif anak.
// Tes Penempatan punya halaman sendiri (/akademi/penempatan).

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { LevelId } from "@akademi/schema";
import { LayarUjian } from "@/components/akademi/ujian";
import { KOMPETENSI, levelAnak } from "@/lib/akademi/konten";
import { cakupanUjian } from "@/lib/akademi/ruang-ujian";
import { JENIS_UJIAN } from "@/lib/akademi/ujian";
import { useMe } from "@/lib/store";

function Isi() {
  const q = useSearchParams();
  const me = useMe();
  const [level, setLevel] = useState<LevelId | null>(null);
  useEffect(() => setLevel(levelAnak(me.id)), [me.id]);
  const jenis = JENIS_UJIAN.find((j) => j === q.get("jenis") && j !== "penempatan");
  const ruang = q.get("ruang") ?? "";
  const ids = useMemo(() => (jenis && level ? cakupanUjian(jenis, level, ruang, KOMPETENSI) : null), [jenis, level, ruang]);
  if (!level) return null;
  if (!jenis || !ids?.length) return <p className="p-6 text-center text-[16px] font-bold">Ujian tidak ditemukan.</p>;
  const unit = jenis === "kuis" ? KOMPETENSI.find((c) => c.level === level && c.unit.id === ruang)?.unit.nama.id : undefined;
  const judul = jenis === "kuis" ? (unit ?? "Modul") : jenis === "semester" ? `Semester ${ruang.slice(1)}` : "Seluruh jenjang";
  return <LayarUjian key={`${jenis}|${ruang}|${level}`} jenis={jenis} level={level} ruang={ruang} kompetensiIds={ids} judul={judul} />;
}

export default function UjianPage() {
  return (
    <Suspense>
      <Isi />
    </Suspense>
  );
}
