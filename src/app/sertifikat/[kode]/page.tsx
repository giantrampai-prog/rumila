"use client";

// Verifikasi publik sertifikat jenjang: /sertifikat/<kode> — tanpa login, di luar (app).
// Memanggil RPC security definer verify_certificate; server hanya mengembalikan nama depan anak + isi snapshot beku.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LEVELS, type LevelId } from "@akademi/schema";
import { SERTIFIKAT_PRINT_CSS, SertifikatKartu } from "@/components/akademi/sertifikat";
import { bacaSnapshot, rapikanKode, type SnapshotSertifikat } from "@/lib/akademi/sertifikat";
import { supabase } from "@/lib/supabase/client";

const INK = "#0b2545";
const BALOO = "var(--ff-baloo), system-ui, sans-serif";
const NUNITO = "var(--ff-nunito), system-ui, sans-serif";

type Hasil =
  | { status: "memuat" }
  | { status: "tidak-ada" }
  | { status: "galat"; pesan: string }
  | { status: "sah"; firstName: string; level: LevelId; issuedAt: string; snapshot: SnapshotSertifikat };

export default function VerifikasiSertifikatPage() {
  const { kode: raw } = useParams<{ kode: string }>();
  const kode = rapikanKode(raw ?? "");
  const [hasil, setHasil] = useState<Hasil>({ status: "memuat" });

  useEffect(() => {
    let batal = false;
    if (kode.length !== 8) {
      setHasil({ status: "tidak-ada" });
      return;
    }
    setHasil({ status: "memuat" });
    (async () => {
      try {
        const { data, error } = await supabase().rpc("verify_certificate", { p_code: kode });
        if (batal) return;
        if (error) throw error;
        const baris = Array.isArray(data) ? data[0] : null;
        const snapshot = baris ? bacaSnapshot(baris.snapshot) : null;
        if (!baris || !snapshot) {
          setHasil({ status: "tidak-ada" });
          return;
        }
        setHasil({ status: "sah", firstName: baris.first_name, level: baris.level as LevelId, issuedAt: baris.issued_at, snapshot });
      } catch (e) {
        if (batal) return;
        const pesan = typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : String(e);
        setHasil({ status: "galat", pesan });
      }
    })();
    return () => {
      batal = true;
    };
  }, [kode]);

  const meta = hasil.status === "sah" ? LEVELS.find((l) => l.id === hasil.level) : undefined;

  return (
    <main className="sertifikat-root min-h-dvh" style={{ background: "#fff0da", fontFamily: NUNITO, color: INK }}>
      <style>{SERTIFIKAT_PRINT_CSS}</style>
      <div className="mx-auto flex max-w-[1040px] flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
        <header className="no-print flex flex-col items-center gap-1 text-center">
          <p className="text-[12px] font-extrabold tracking-[0.2em] text-ink-3">RINOYA ACADEMY</p>
          <h1 style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: INK, lineHeight: 1.05 }}>Verifikasi sertifikat</h1>
          <p className="text-[13px] font-bold text-ink-3">
            Kode <span className="font-black tracking-[0.15em]" style={{ color: INK }}>{kode || "—"}</span>
          </p>
        </header>

        {hasil.status === "memuat" && <Kotak ikon="⏳" judul="Memeriksa kode…" />}
        {hasil.status === "tidak-ada" && <Kotak ikon="❌" judul="Kode tidak ditemukan" isi="Periksa kembali 8 karakter kodenya (tanpa 0, O, 1, I). Sertifikat yang asli selalu punya kode yang terdaftar." />}
        {hasil.status === "galat" && <Kotak ikon="⚠️" judul="Tidak bisa memeriksa sekarang" isi={`Coba muat ulang halaman. (${hasil.pesan})`} />}
        {hasil.status === "sah" && meta && (
          <>
            <div className="no-print mx-auto flex items-center gap-2 rounded-full px-4 py-2 text-white" style={{ background: "#12904a", fontFamily: BALOO, fontSize: 17, fontWeight: 800, boxShadow: "0 3px 0 #0c6b36" }}>
              ✓ Sertifikat sah
            </div>
            <p className="no-print text-center text-[14px] font-bold text-ink-3">
              <b style={{ color: INK }}>{hasil.firstName}</b> menuntaskan {meta.nama} ({meta.lokal}) — pangkat {hasil.snapshot.pangkat || meta.pangkat} · diterbitkan {new Date(hasil.issuedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}.
            </p>
            <div className="flex justify-center">
              <SertifikatKartu nama={hasil.firstName} level={hasil.level} kode={kode} issuedAt={hasil.issuedAt} snapshot={hasil.snapshot} terverifikasi />
            </div>
            <p className="no-print text-center text-[12px] font-bold text-ink-3">
              Demi privasi anak, halaman ini hanya menampilkan nama depan, jenjang, pangkat, dan daftar kompetensi yang dikuasai saat sertifikat terbit.
            </p>
          </>
        )}

        <footer className="no-print flex justify-center">
          <Link href="/" className="text-[13px] font-extrabold text-ink-3 underline-offset-4 hover:underline">
            Tentang RINOYA Academy
          </Link>
        </footer>
      </div>
    </main>
  );
}

function Kotak({ ikon, judul, isi }: { ikon: string; judul: string; isi?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-[460px] flex-col items-center gap-2 rounded-[24px] bg-white p-8 text-center shadow-[0_4px_0_rgba(11,37,69,.06)]">
      <span style={{ fontSize: 40 }} aria-hidden>
        {ikon}
      </span>
      <p style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK }}>{judul}</p>
      {isi && <p className="text-[14px] font-bold text-ink-3">{isi}</p>}
    </div>
  );
}
