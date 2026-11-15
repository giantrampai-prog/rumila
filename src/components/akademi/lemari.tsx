"use client";

// Lemari Piagam: daftar semua penghargaan satu anak + penampil satu dokumen (dengan Cetak/PDF untuk A4).
// Sumber: sertifikat jenjang (akademi_certificate) dan hasil ujian (akademi_ujian) → piagam modul & sertifikat semester.

import { useEffect, useMemo, type ReactNode } from "react";
import { levelMeta } from "@akademi/schema";
import { BALOO, NUNITO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { KOMPETENSI } from "@/lib/akademi/katalog";
import { piagamModul, sertifikatSemester, tahunAjaran } from "@/lib/akademi/piagam";
import { ambilSertifikat, useSertifikat } from "@/lib/akademi/sertifikat";
import { ambilUjian, useUjian } from "@/lib/akademi/ujian-klien";
import type { Member } from "@/lib/store";
import { PiagamModulKartu, SertifikatSemesterKartu, TranskripJenjang } from "./piagam";
import { SERTIFIKAT_PRINT_CSS, SertifikatKartu, tanggalPanjang } from "./sertifikat";

const INK = "#0b2545";
const KARTU = "rounded-[22px] bg-white shadow-[0_4px_0_rgba(11,37,69,.08)]";

export function usePenghargaan(anakId: string) {
  const hasil = useUjian(anakId);
  const jenjang = useSertifikat(anakId);
  useEffect(() => {
    ambilUjian(anakId).catch((e) => console.error("[akademi] ambil ujian gagal", e));
    ambilSertifikat(anakId).catch((e) => console.error("[akademi] ambil sertifikat gagal", e));
  }, [anakId]);
  const modul = useMemo(() => piagamModul(hasil, KOMPETENSI), [hasil]);
  const semester = useMemo(() => sertifikatSemester(hasil, KOMPETENSI), [hasil]);
  return { hasil, jenjang: jenjang.filter((s) => !s.track), modul, semester };
}

export function LemariPiagam({ anak, lihat, onLihat, kembali, tertanam }: { anak: Member; lihat: string | null; onLihat: (v: string | null) => void; kembali?: ReactNode; /** di dalam halaman lain: tanpa latar & tinggi layar penuh */ tertanam?: boolean }) {
  const akar = tertanam ? "" : "min-h-dvh";
  const { jenjang, modul, semester } = usePenghargaan(anak.id);
  const [jenis, sesi] = (lihat ?? "").split(":");
  const satuModul = jenis === "modul" ? modul.find((m) => m.sessionId === sesi) : undefined;
  const satuSemester = jenis === "semester" ? semester.find((m) => m.sessionId === sesi) : undefined;
  const satuJenjang = jenis === "jenjang" ? jenjang.find((m) => m.code === sesi) : undefined;

  if (satuModul || satuSemester || satuJenjang)
    return (
      <div className={`sertifikat-root ${akar}`} style={{ background: tertanam ? undefined : "#fff0da", fontFamily: NUNITO, color: INK }}>
        <style>{SERTIFIKAT_PRINT_CSS}</style>
        <div className="mx-auto flex max-w-[1040px] flex-col gap-4 px-4 py-5">
          <div className="no-print flex items-center gap-2">
            <button onClick={() => onLihat(null)} aria-label="Kembali ke lemari" className="flex size-10 items-center justify-center rounded-full bg-white">
              <Icon name="arrow_back" size={22} />
            </button>
            <h1 style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800 }}>{satuModul ? "Piagam Modul" : satuSemester ? "Sertifikat Semester" : "Sertifikat Kenaikan Jenjang"}</h1>
          </div>
          {satuJenjang ? (
            <>
              <div className="flex justify-center">
                <SertifikatKartu nama={anak.name} level={satuJenjang.level} kode={satuJenjang.code} nomor={satuJenjang.nomor} issuedAt={satuJenjang.issuedAt} snapshot={satuJenjang.snapshot} pending={satuJenjang.pending} />
              </div>
              <div className="flex justify-center">
                <TranskripJenjang nama={anak.name} level={satuJenjang.level} kode={satuJenjang.code} nomor={satuJenjang.nomor} issuedAt={satuJenjang.issuedAt} snapshot={satuJenjang.snapshot} />
              </div>
            </>
          ) : (
            <div className="flex justify-center">{satuModul ? <PiagamModulKartu nama={anak.name} p={satuModul} /> : <SertifikatSemesterKartu nama={anak.name} s={satuSemester!} />}</div>
          )}
          {(satuSemester || satuJenjang) && (
            <div className="no-print flex justify-center">
              <button onClick={() => window.print()} className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-white" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, background: "linear-gradient(155deg,#1f94f0,#0567c2 60%)", boxShadow: "0 3px 0 #0567c2" }}>
                <Icon name="print" size={22} /> Cetak / PDF
              </button>
            </div>
          )}
        </div>
      </div>
    );

  const kosong = !jenjang.length && !semester.length && !modul.length;
  return (
    <div className={akar} style={{ background: tertanam ? undefined : "#fff0da", fontFamily: NUNITO, color: INK }}>
      <div className={`mx-auto flex max-w-[860px] flex-col gap-5 ${tertanam ? "" : "px-4 py-5"}`}>
        <header className="flex items-center gap-3">
          {kembali && <span className="text-[14px] font-extrabold text-ink-3">{kembali}</span>}
          <div className="min-w-0 flex-1">
            <h1 style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, lineHeight: 1.05 }}>Lemari Piagam</h1>
            <p className="text-[13px] font-bold text-ink-3">
              {anak.name} · {jenjang.length} sertifikat jenjang · {semester.length} sertifikat semester · {modul.length} piagam modul
            </p>
          </div>
        </header>
        {kosong && <p className={`${KARTU} p-6 text-center text-[15px] font-bold text-ink-3`}>Belum ada piagam. Piagam pertama terbit saat Kuis Modul pertama lulus.</p>}

        {jenjang.length > 0 && (
          <Rak judul="Sertifikat Kenaikan Jenjang" ikon="workspace_premium">
            {jenjang.map((s) => {
              const lv = levelMeta(s.level);
              return (
                <button key={s.code} onClick={() => onLihat(`jenjang:${s.code}`)} className="text-left">
                  <Baris ikon="military_tech" warna="#fdb724" judul={`${lv.nama} (${lv.lokal}) · ${s.snapshot.pangkat || lv.pangkat}`} sub={`${s.nomor ?? s.code} · ${tanggalPanjang(s.issuedAt)}${typeof s.snapshot.nilai === "number" ? ` · nilai ${s.snapshot.nilai}` : ""}`} />
                </button>
              );
            })}
          </Rak>
        )}
        {semester.length > 0 && (
          <Rak judul="Sertifikat Semester" ikon="school">
            {semester.map((s) => (
              <button key={s.sessionId} onClick={() => onLihat(`semester:${s.sessionId}`)} className="text-left">
                <Baris ikon="verified" warna="#0786eb" judul={`${levelMeta(s.level).lokal} · Semester ${s.ke} · ${tahunAjaran(s.at)}`} sub={`Nilai akhir ${s.nilaiAkhir} · ${tanggalPanjang(s.at)}`} />
              </button>
            ))}
          </Rak>
        )}
        {modul.length > 0 && (
          <Rak judul="Piagam Modul" ikon="emoji_events">
            {modul.map((m) => (
              <button key={m.sessionId} onClick={() => onLihat(`modul:${m.sessionId}`)} className="text-left">
                <Baris ikon="star" warna="#fd861d" judul={m.nama.id} sub={`${levelMeta(m.level).lokal} · Modul ${m.ke} · nilai ${m.nilai}`} />
              </button>
            ))}
          </Rak>
        )}
      </div>
    </div>
  );
}

function Rak({ judul, ikon, children }: { judul: string; ikon: string; children: ReactNode }) {
  return (
    <section className={`${KARTU} flex flex-col gap-1 p-4`}>
      <h2 className="mb-1 flex items-center gap-2" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>
        <Icon name={ikon} size={22} /> {judul}
      </h2>
      <div className="flex flex-col divide-y divide-[#f1e6d6]">{children}</div>
    </section>
  );
}

function Baris({ ikon, warna, judul, sub }: { ikon: string; warna: string; judul: string; sub: string }) {
  return (
    <span className="flex items-center gap-3 py-2.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] text-white" style={{ background: warna }}>
        <Icon name={ikon} size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-extrabold">{judul}</span>
        <span className="block truncate text-[12.5px] font-bold text-ink-3">{sub}</span>
      </span>
      <Icon name="chevron_right" size={22} />
    </span>
  );
}
