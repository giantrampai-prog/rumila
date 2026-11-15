"use client";

// Verifikasi publik Sertifikat Semester: /sertifikat/s/<id sesi Ujian Semester> — tanpa login.
// RPC verify_semester hanya mengembalikan nama depan, jenjang, semester, nilai, tanggal, dan nilai Kuis Modul.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LevelId } from "@akademi/schema";
import { SertifikatSemesterKartu } from "@/components/akademi/piagam";
import { SERTIFIKAT_PRINT_CSS } from "@/components/akademi/sertifikat";
import { KOMPETENSI } from "@/lib/akademi/katalog";
import { sertifikatSemester, type SertifikatSemester } from "@/lib/akademi/piagam";
import type { HasilUjian } from "@/lib/akademi/ujian";
import { supabase } from "@/lib/supabase/client";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function VerifikasiSemesterPage() {
  const { sesi } = useParams<{ sesi: string }>();
  const [hasil, setHasil] = useState<{ nama: string; s: SertifikatSemester } | "memuat" | "tidak-ada" | "galat">("memuat");

  useEffect(() => {
    if (!UUID.test(sesi ?? "")) return setHasil("tidak-ada");
    let batal = false;
    (async () => {
      const { data, error } = await supabase().rpc("verify_semester", { p_session: sesi });
      if (batal) return;
      if (error) return setHasil("galat");
      const r = Array.isArray(data) ? data[0] : null;
      const lv = LevelId.safeParse(r?.level);
      if (!r || !lv.success) return setHasil("tidak-ada");
      const kuis = (Array.isArray(r.kuis) ? r.kuis : []) as { ruang: string; nilai: number }[];
      const daftar: HasilUjian[] = [
        { jenis: "semester", level: lv.data, ruang: r.ruang, sessionId: sesi, benar: 0, total: 1, nilai: r.nilai, lulus: true, at: r.created_at },
        ...kuis.map((k, i) => ({ jenis: "kuis" as const, level: lv.data, ruang: k.ruang, sessionId: `k${i}`, benar: 0, total: 1, nilai: k.nilai, lulus: true, at: r.created_at })),
      ];
      const s = sertifikatSemester(daftar, KOMPETENSI)[0];
      setHasil(s ? { nama: r.first_name, s } : "tidak-ada");
    })();
    return () => {
      batal = true;
    };
  }, [sesi]);

  return (
    <main className="sertifikat-root min-h-dvh" style={{ background: "#fff0da", color: "#0b2545" }}>
      <style>{SERTIFIKAT_PRINT_CSS}</style>
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-4 px-4 py-6">
        <header className="no-print text-center">
          <p className="text-[12px] font-extrabold tracking-[0.2em] text-ink-3">RINOYA ACADEMY</p>
          <h1 style={{ fontFamily: "var(--ff-baloo), system-ui", fontSize: 26, fontWeight: 800 }}>Verifikasi sertifikat semester</h1>
        </header>
        {hasil === "memuat" && <p className="font-bold">Memeriksa…</p>}
        {hasil === "tidak-ada" && <p className="rounded-[20px] bg-white p-6 text-center font-bold">Sertifikat tidak ditemukan. Periksa kembali tautan atau QR-nya.</p>}
        {hasil === "galat" && <p className="rounded-[20px] bg-white p-6 text-center font-bold">Tidak bisa memeriksa sekarang. Coba muat ulang.</p>}
        {typeof hasil === "object" && <SertifikatSemesterKartu nama={hasil.nama} s={hasil.s} terverifikasi />}
        <Link href="/" className="no-print text-[13px] font-extrabold text-ink-3">
          Tentang RINOYA Academy
        </Link>
      </div>
    </main>
  );
}
