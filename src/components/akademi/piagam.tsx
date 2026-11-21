"use client";

// Kartu penghargaan tingkat 1 & 2 + transkrip jenjang (Sekolah Tahap 4).
//   PiagamModulKartu        : ceria, rasio 16:10 (layar & Story), tanpa QR
//   SertifikatSemesterKartu : A4 landscape, nilai per pelajaran, dua tanda tangan, QR verifikasi sesi
//   TranskripJenjang        : halaman 2 Sertifikat Kenaikan — kompetensi inti + nilai ujian, A4 portrait

import { NAMA_GEDUNG_PRAKTIK } from "@/lib/akademi/praktik-kampus";
import Image from "next/image";
import { LEVELS, TRACKS, levelMeta, type LevelId } from "@akademi/schema";
import { KOMPETENSI } from "@/lib/akademi/katalog";
import { nomorSemester, tahunAjaran, type PiagamModul, type SertifikatSemester } from "@/lib/akademi/piagam";
import { URL_VERIFIKASI_SEMESTER, type SnapshotSertifikat } from "@/lib/akademi/sertifikat-inti";
import { predikat } from "@/lib/akademi/ujian";
import { PENANDATANGAN } from "@/lib/brand";
import { KELAS_FONT_SERTIFIKAT } from "./font-sertifikat";
import { KodeQR } from "./qr";
import { tanggalPanjang } from "./sertifikat";

const NAVY = "#14233f";
const GOLD = "#b8892b";
const MUTED = "#7a7466";
const SERIF = 'var(--ff-sert-serif), Baskerville, Georgia, serif';
const SCRIPT = 'var(--ff-sert-skrip), "Snell Roundhand", cursive';
const SANS = '"Avenir Next", Avenir, "Helvetica Neue", "Segoe UI", Arial, sans-serif';
const BALOO = "var(--ff-baloo), system-ui, sans-serif";
const namaTrack = (id: string) => TRACKS.find((t) => t.id === id)?.nama.id ?? id;

/* ---------------- tingkat 1 · piagam modul ---------------- */

export function PiagamModulKartu({ nama, p, className = "" }: { nama: string; p: PiagamModul; className?: string }) {
  const lv = levelMeta(p.level);
  return (
    <div className={`relative w-full max-w-[640px] overflow-hidden ${className}`} style={{ aspectRatio: "16 / 10", containerType: "inline-size", background: "linear-gradient(160deg,#ffffff,#eef6ff)", color: "#10304f", borderRadius: "3cqw", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
      <div aria-hidden className="absolute" style={{ inset: "2.4%", border: "1.3cqw solid #0786eb", borderRadius: "2.4cqw" }} />
      <div aria-hidden className="absolute" style={{ inset: "5.6%", border: "0.35cqw dashed #fdb724", borderRadius: "1.8cqw" }} />
      <div className="absolute grid items-center" style={{ inset: "9% 9%", gridTemplateColumns: "1fr 27%", gap: "3cqw" }}>
        <div className="min-w-0">
          <p style={{ fontFamily: SANS, fontWeight: 800, fontSize: "1.9cqw", letterSpacing: "0.2em", color: "#fd861d" }}>PIAGAM MODUL · {namaTrack(p.track).toUpperCase()}</p>
          <p style={{ fontFamily: BALOO, fontWeight: 800, fontSize: "6cqw", lineHeight: 1.02, color: "#135385", marginTop: "0.8cqw" }}>{p.nama.id}</p>
          <p style={{ fontFamily: BALOO, fontWeight: 800, fontSize: "5cqw", lineHeight: 1.05, color: "#0786eb", marginTop: "1.4cqw" }}>{nama}</p>
          <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: "2.2cqw", color: "#4b6178", marginTop: "1cqw", lineHeight: 1.35 }}>
            berhasil menuntaskan Modul {p.ke} jenjang {lv.lokal} dengan nilai kuis <b style={{ color: "#10304f" }}>{p.nilai}</b>.
          </p>
          <div className="flex items-center" style={{ gap: "1.6cqw", marginTop: "2.4cqw", fontFamily: SANS, fontSize: "1.8cqw", fontWeight: 700, color: "#5b6f86" }}>
            <Image src="/brand/rinoya-mark-r.png" alt="" width={40} height={40} style={{ width: "4.4cqw", height: "auto" }} />
            <span>RINOYA Academy</span>
            <span>·</span>
            <span>{tanggalPanjang(p.at)}</span>
          </div>
        </div>
        <div className="flex aspect-square flex-col items-center justify-center rounded-full text-center" style={{ background: "radial-gradient(circle at 35% 30%,#ffe08a,#fdb724 55%,#d98a00)", boxShadow: "0 1.2cqw 0 #c67a00", color: "#5a3b00", fontFamily: BALOO, fontWeight: 800, lineHeight: 1 }}>
          <span style={{ fontSize: "2.2cqw", letterSpacing: "0.12em" }}>MODUL</span>
          <span style={{ fontSize: "9cqw" }}>{p.ke}</span>
          <span style={{ fontSize: "2.4cqw", letterSpacing: "0.12em" }}>LULUS</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- tingkat 2 · sertifikat semester ---------------- */

export function SertifikatSemesterKartu({ nama, s, terverifikasi, className = "" }: { nama: string; s: SertifikatSemester; terverifikasi?: boolean; className?: string }) {
  const lv = levelMeta(s.level);
  const pred = predikat(s.nilaiAkhir, "semester");
  const url = URL_VERIFIKASI_SEMESTER(s.sessionId);
  return (
    <div
      className={`sertifikat-card relative w-full max-w-[1000px] overflow-hidden rounded-[6px] shadow-[0_18px_50px_rgba(20,35,63,.22)] ${KELAS_FONT_SERTIFIKAT} ${className}`}
      style={{ aspectRatio: "297 / 210", containerType: "inline-size", background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 58%, rgba(201,168,106,.22) 100%), linear-gradient(135deg,#fdfaf2,#f3ead3)", color: "#3a4356", fontFamily: SERIF, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      <div aria-hidden className="absolute" style={{ inset: "1.8%", border: `min(10px,1cqw) solid ${NAVY}` }} />
      <div aria-hidden className="absolute" style={{ inset: "4.2%", border: `1.5px solid ${GOLD}` }} />
      <div aria-hidden className="absolute" style={{ inset: "5.4%", border: `0.5px solid ${GOLD}` }} />
      {terverifikasi && (
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-white" style={{ top: "3.2%", background: "#12904a", fontFamily: SANS, fontSize: "clamp(9px, 1.2cqw, 13px)", fontWeight: 700, letterSpacing: 2 }}>
          SERTIFIKAT SAH · TERVERIFIKASI
        </div>
      )}
      <div className="absolute flex flex-col items-center text-center" style={{ inset: "8% 9% 10% 9%" }}>
        <div className="flex items-center gap-[1.2cqw]" style={{ fontFamily: SANS, fontWeight: 600, fontSize: "1.35cqw", letterSpacing: "0.5em", color: NAVY }}>
          <Image src="/brand/rinoya-mark-r.png" alt="" width={56} height={56} style={{ width: "4cqw", height: "auto" }} />
          RINOYA ACADEMY
        </div>
        <h1 style={{ fontWeight: 700, fontSize: "4.6cqw", lineHeight: 1, letterSpacing: "0.14em", color: NAVY, marginTop: "1.2cqw" }}>SERTIFIKAT SEMESTER</h1>
        <p style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.25cqw", letterSpacing: "0.34em", color: GOLD, marginTop: "0.6cqw" }}>
          {lv.lokal.toUpperCase()} · SEMESTER {s.ke} · {tahunAjaran(s.at)}
        </p>
        <p style={{ fontStyle: "italic", fontSize: "1.7cqw", color: MUTED, marginTop: "1.6cqw" }}>Diberikan kepada</p>
        <p style={{ fontFamily: SCRIPT, fontSize: "5cqw", lineHeight: 1.05, color: NAVY }}>{nama}</p>
        <div style={{ width: "44%", height: 1, background: GOLD, marginTop: "0.4cqw" }} />
        <p style={{ fontSize: "1.6cqw", marginTop: "1cqw" }}>
          atas kelulusan Ujian Semester {s.ke} {lv.nama} ({lv.lokal}) dengan rincian nilai berikut.
        </p>
        <div className="grid w-[86%]" style={{ gridTemplateColumns: `repeat(${Math.max(1, s.perPelajaran.length + 1)}, 1fr)`, gap: "1.4cqw", marginTop: "1.4cqw", fontFamily: SANS }}>
          {s.perPelajaran.map((p) => (
            <div key={p.track} style={{ border: `1px solid ${GOLD}80`, borderRadius: "0.6cqw", padding: "0.9cqw", background: "rgba(255,255,255,.55)" }}>
              <p style={{ fontSize: "1cqw", fontWeight: 700, letterSpacing: "0.14em", color: GOLD }}>{namaTrack(p.track).toUpperCase()}</p>
              <p style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "3cqw", lineHeight: 1.1, color: NAVY, fontVariantNumeric: "lining-nums" }}>{p.nilai}</p>
              <p style={{ fontSize: "1cqw", color: MUTED }}>{p.modul} modul lulus</p>
            </div>
          ))}
          <div style={{ border: `1px solid ${NAVY}55`, borderRadius: "0.6cqw", padding: "0.9cqw", background: "rgba(20,35,63,.05)" }}>
            <p style={{ fontSize: "1cqw", fontWeight: 700, letterSpacing: "0.14em", color: NAVY }}>UJIAN SEMESTER</p>
            <p style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "3cqw", lineHeight: 1.1, color: NAVY, fontVariantNumeric: "lining-nums" }}>{s.nilai}</p>
            <p style={{ fontSize: "1cqw", color: MUTED }}>bobot 60%</p>
          </div>
        </div>
        <p className="rounded-full text-white" style={{ marginTop: "1.2cqw", padding: "0.45cqw 1.6cqw", background: NAVY, fontFamily: SANS, fontSize: "1.15cqw", fontWeight: 700, letterSpacing: "0.22em" }}>
          {pred.toUpperCase()} · NILAI AKHIR {s.nilaiAkhir}
        </p>
        <div className="mt-auto grid w-full items-end" style={{ gridTemplateColumns: "1fr 1fr", gap: "8cqw", padding: "0 6%" }}>
          {PENANDATANGAN.map((p) => (
            <div key={p.jabatan} className="flex flex-col items-center" style={{ fontFamily: SANS }}>
              <div style={{ height: "3.2cqw" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.ttd && <img src={p.ttd} alt="" style={{ maxHeight: "100%" }} />}
              </div>
              <div style={{ width: "80%", height: 1, background: NAVY }} />
              {p.nama && <p style={{ fontSize: "1.1cqw", fontWeight: 700, color: NAVY, marginTop: "0.4cqw" }}>{p.nama}</p>}
              <p style={{ fontSize: "0.95cqw", fontWeight: 700, color: MUTED, letterSpacing: "0.14em", marginTop: "0.3cqw" }}>{p.jabatan.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute flex items-center justify-between" style={{ left: "8%", right: "8%", bottom: "2.6%", fontFamily: SANS, fontSize: "0.95cqw", fontWeight: 600, color: MUTED, letterSpacing: "0.05em" }}>
        <span>
          No. {nomorSemester(s)} · Terbit {tanggalPanjang(s.at)}
        </span>
        <span className="flex items-center gap-[0.8cqw]">
          <span className="text-right">Pindai untuk verifikasi</span>
          <KodeQR teks={url} ukuran="5cqw" />
        </span>
      </div>
    </div>
  );
}

/* ---------------- transkrip jenjang (halaman 2 sertifikat kenaikan) ---------------- */

const LABEL_STATUS: Record<string, string> = { dikuasai: "Dikuasai", berkembang: "Berkembang", belum: "Belum" };

export function TranskripJenjang({ nama, level, kode, nomor, issuedAt, snapshot }: { nama: string; level: LevelId; kode: string; nomor?: string | null; issuedAt: string; snapshot: SnapshotSertifikat }) {
  const lv = LEVELS.find((l) => l.id === level)!;
  const namaUnit = (id: string) => KOMPETENSI.find((c) => c.level === level && c.unit.id === id)?.unit.nama.id ?? id;
  const ujian = snapshot.ujian ?? [];
  const kuis = ujian.filter((u) => u.jenis === "kuis");
  const lain = ujian.filter((u) => u.jenis !== "kuis").sort((a, b) => (a.jenis + a.ruang).localeCompare(b.jenis + b.ruang));
  const perTrack = TRACKS.map((t) => ({ t, k: snapshot.kompetensi.filter((k) => k.track === t.id) })).filter((g) => g.k.length);
  return (
    <div className={`transkrip-card relative mx-auto w-full max-w-[794px] bg-white ${KELAS_FONT_SERTIFIKAT}`} style={{ color: "#2b3446", fontFamily: SANS, padding: "40px 44px", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
      <header className="flex items-start justify-between gap-4" style={{ borderBottom: `2px solid ${NAVY}`, paddingBottom: 12 }}>
        <div className="flex items-center gap-3">
          <Image src="/brand/rinoya-mark-r.png" alt="" width={44} height={44} />
          <div>
            <p style={{ fontWeight: 700, letterSpacing: "0.3em", fontSize: 12, color: NAVY }}>RINOYA ACADEMY</p>
            <p style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: NAVY, lineHeight: 1.1 }}>Transkrip Kenaikan Jenjang</p>
          </div>
        </div>
        <div className="text-right" style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>
          <p>{nomor ? `No. ${nomor}` : `Kode ${kode}`}</p>
          <p>Terbit {tanggalPanjang(issuedAt)}</p>
        </div>
      </header>
      <section className="grid gap-x-6 gap-y-1" style={{ gridTemplateColumns: "auto 1fr auto 1fr", fontSize: 12.5, marginTop: 14 }}>
        <span style={{ color: MUTED }}>Nama</span>
        <b>{nama}</b>
        <span style={{ color: MUTED }}>Jenjang</span>
        <b>
          {lv.nama} ({lv.lokal})
        </b>
        <span style={{ color: MUTED }}>Pangkat</span>
        <b>{snapshot.pangkat || lv.pangkat}</b>
        <span style={{ color: MUTED }}>Nilai akhir</span>
        <b>{typeof snapshot.nilai === "number" ? `${snapshot.nilai} · ${snapshot.predikat ?? ""}` : "—"}</b>
      </section>

      <h2 style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.14em", color: GOLD, marginTop: 20 }}>NILAI UJIAN</h2>
      <table className="w-full" style={{ borderCollapse: "collapse", fontSize: 12, marginTop: 6 }}>
        <tbody>
          {lain.map((u) => (
            <tr key={u.jenis + u.ruang} style={{ borderBottom: "1px solid #ece6d8" }}>
              <td style={{ padding: "5px 0" }}>{u.jenis === "semester" ? `Ujian Semester ${u.ruang.slice(1)}` : "Ujian Akhir"}</td>
              <td className="text-right" style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{u.nilai}</td>
            </tr>
          ))}
          {kuis.map((u) => (
            <tr key={u.ruang} style={{ borderBottom: "1px solid #ece6d8" }}>
              <td style={{ padding: "5px 0" }}>Ulangan Modul · {namaUnit(u.ruang)}</td>
              <td className="text-right" style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{u.nilai}</td>
            </tr>
          ))}
          {!ujian.length && (
            <tr>
              <td style={{ padding: "5px 0", color: MUTED }}>Sertifikat ini terbit sebelum sistem ujian berlaku.</td>
            </tr>
          )}
        </tbody>
      </table>

      {snapshot.praktik && (
        <>
          <h2 style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.14em", color: GOLD, marginTop: 20 }}>PRAKTIK KAMPUS · {snapshot.praktik.nilai} · {snapshot.praktik.predikat.toUpperCase()}</h2>
          <table className="w-full" style={{ borderCollapse: "collapse", fontSize: 12, marginTop: 6 }}>
            <tbody>
              {snapshot.praktik.komponen.map((k) => (
                <tr key={k.gedung} style={{ borderBottom: "1px solid #ece6d8" }}>
                  <td style={{ padding: "5px 0" }}>{NAMA_GEDUNG_PRAKTIK[k.gedung]?.nama ?? k.gedung}</td>
                  <td className="text-right" style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{k.nilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2 style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.14em", color: GOLD, marginTop: 20 }}>
        KOMPETENSI INTI · {snapshot.dikuasai} DARI {snapshot.total} DIKUASAI
      </h2>
      {perTrack.map(({ t, k }) => (
        <div key={t.id} style={{ marginTop: 8, breakInside: "avoid" }}>
          <p style={{ fontWeight: 700, fontSize: 12, color: NAVY }}>{t.nama.id}</p>
          <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none", fontSize: 11.5 }}>
            {k.map((x) => (
              <li key={x.id} className="flex justify-between gap-3" style={{ padding: "3px 0", borderBottom: "1px dotted #e3dccb" }}>
                <span>{x.statement.id}</span>
                <span style={{ flexShrink: 0, fontWeight: 700, color: x.status === "dikuasai" ? "#13794a" : MUTED }}>{LABEL_STATUS[x.status] ?? x.status}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p style={{ fontSize: 10.5, color: MUTED, marginTop: 18, lineHeight: 1.5 }}>
        Kurikulum mengacu pada {lv.acuan}. RINOYA Academy adalah program belajar non-formal pendamping sekolah; dokumen ini bukan ijazah. Keaslian dapat diperiksa dengan kode {kode}.
      </p>
    </div>
  );
}
