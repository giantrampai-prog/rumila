"use client";

// Buku Sertifikat Kenaikan Jenjang RINOYA Academy — beberapa lembar A4 mendatar, siap cetak/PDF:
//   1. Sampul            2. Sertifikat (dengan foto anak)   3. Hasil Belajar (nilai ujian & ulangan)
//   4+. Transkrip Kompetensi (dipecah per lembar)            terakhir. Lembar Pengesahan (QR, tanda tangan)
// Setiap lembar ber-footer: identitas dokumen, nomor, dan "Lembar x dari y".
// Foto hanya untuk dokumen milik keluarga (halaman murid & Ruang Orang Tua), tidak untuk verifikasi publik.

import Image from "next/image";
import type { ReactNode } from "react";
import { LEVELS, TRACKS, type LevelId } from "@akademi/schema";
import { KOMPETENSI } from "@/lib/akademi/katalog";
import { tahunAjaran } from "@/lib/akademi/piagam";
import { URL_VERIFIKASI, type SnapshotKompetensi, type SnapshotSertifikat } from "@/lib/akademi/sertifikat-inti";
import { NAMA_UJIAN, type JenisUjian } from "@/lib/akademi/ujian";
import { PENANDATANGAN } from "@/lib/brand";
import { KELAS_FONT_SERTIFIKAT } from "./font-sertifikat";
import { KodeQR } from "./qr";
import { tanggalPanjang } from "./sertifikat";

const NAVY = "#14233f";
const NAVY2 = "#1d3157";
const GOLD = "#b8892b";
const GOLD_TERANG = "#e9c46a";
const KERTAS = "#fbf7ec";
const TINTA = "#2f3a4d";
const MUTED = "#7a7466";
const SERIF = 'var(--ff-sert-serif), Baskerville, Georgia, serif';
const SKRIP = 'var(--ff-sert-skrip), "Snell Roundhand", cursive';
const SANS = '"Avenir Next", Avenir, "Helvetica Neue", "Segoe UI", Arial, sans-serif';
const EMAS = "linear-gradient(135deg,#a8761d 0%,#e9c46a 35%,#f7e3a1 55%,#c9962f 75%,#9a6a17 100%)";

export const BUKU_PRINT_CSS = `
@page { size: A4 landscape; margin: 0; }
@media print {
  html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
  .no-print { display: none !important; }
  .sertifikat-root { background: #fff !important; padding: 0 !important; margin: 0 !important; min-height: 0 !important; }
  .buku-sertifikat { gap: 0 !important; }
  .lembar { width: 297mm !important; height: 210mm !important; max-width: none !important; box-shadow: none !important; border-radius: 0 !important; break-after: page; break-inside: avoid; }
  .lembar:last-child { break-after: auto; }
}`;

export interface BukuSertifikatProps {
  nama: string;
  level: LevelId;
  kode: string;
  nomor?: string | null;
  issuedAt: string;
  snapshot: SnapshotSertifikat;
  /** URL foto anak (signed URL / data URL); kosong = bingkai bertuliskan "Pas foto" */
  foto?: string | null;
  pending?: boolean;
}

export function BukuSertifikat(p: BukuSertifikatProps) {
  const halTranskrip = pecahTranskrip(p.snapshot.kompetensi);
  const total = 3 + halTranskrip.length + 1;
  const foot = (ke: number) => <Footer p={p} ke={ke} total={total} />;
  return (
    <div className={`buku-sertifikat flex w-full flex-col items-center gap-6 ${KELAS_FONT_SERTIFIKAT}`}>
      <LembarSampul p={p} footer={foot(1)} />
      <LembarSertifikat p={p} footer={foot(2)} />
      <LembarHasil p={p} footer={foot(3)} />
      {halTranskrip.map((isi, i) => (
        <LembarTranskrip key={i} p={p} isi={isi} ke={i + 1} dari={halTranskrip.length} footer={foot(4 + i)} />
      ))}
      <LembarPengesahan p={p} footer={foot(total)} />
    </div>
  );
}

/* ---------------- kerangka lembar ---------------- */

function Lembar({ children, gelap, label }: { children: ReactNode; gelap?: boolean; label: string }) {
  return (
    <section
      aria-label={label}
      className="lembar relative w-full max-w-[1000px] overflow-hidden rounded-[4px] shadow-[0_16px_44px_rgba(20,35,63,.2)]"
      style={{
        aspectRatio: "297 / 210",
        containerType: "inline-size",
        color: gelap ? "#f6ecd2" : TINTA,
        fontFamily: SERIF,
        background: gelap
          ? `radial-gradient(circle at 50% 42%, ${NAVY2} 0%, ${NAVY} 62%, #0d182e 100%)`
          : `radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 60%, rgba(201,168,106,.2) 100%), linear-gradient(135deg, ${KERTAS}, #f2e8d0)`,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {children}
    </section>
  );
}

/** Bingkai tipis + header kecil untuk lembar isi. */
function BingkaiIsi({ judul, sub }: { judul: string; sub?: string }) {
  return (
    <>
      <div aria-hidden className="absolute" style={{ inset: "2.6%", border: `0.5px solid ${GOLD}` }} />
      <div aria-hidden className="absolute" style={{ left: "2.6%", right: "2.6%", top: "2.6%", height: "0.6cqw", background: NAVY }} />
      <header className="absolute flex items-end justify-between" style={{ left: "6%", right: "6%", top: "6%" }}>
        <div className="flex items-center gap-[1.2cqw]">
          <Image src="/brand/rinoya-mark-r.png" alt="" width={48} height={48} style={{ width: "3.6cqw", height: "auto" }} />
          <div>
            <p style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1cqw", letterSpacing: "0.4em", color: NAVY }}>RINOYA ACADEMY</p>
            <p style={{ fontWeight: 700, fontSize: "2.6cqw", lineHeight: 1.05, color: NAVY }}>{judul}</p>
          </div>
        </div>
        {sub && <p style={{ fontFamily: SANS, fontSize: "1.05cqw", fontWeight: 600, color: MUTED, letterSpacing: "0.08em", textAlign: "right" }}>{sub}</p>}
      </header>
      <div aria-hidden className="absolute" style={{ left: "6%", right: "6%", top: "15.5%", height: 1, background: EMAS }} />
    </>
  );
}

function Footer({ p, ke, total }: { p: BukuSertifikatProps; ke: number; total: number }) {
  const gelap = ke === 1;
  // sampul & sertifikat berbingkai tebal: footer di dalam bingkai; lembar isi: di bawah garis bingkai tipis
  const bawah = ke <= 2 ? "6.6%" : "4.2%";
  return (
    <footer className="absolute flex items-center justify-between" style={{ left: ke <= 2 ? "8%" : "6%", right: ke <= 2 ? "8%" : "6%", bottom: bawah, fontFamily: SANS, fontSize: "0.92cqw", fontWeight: 600, letterSpacing: "0.08em", color: gelap ? "rgba(246,236,210,.7)" : MUTED }}>
      <span>RINOYA ACADEMY · SERTIFIKAT KENAIKAN JENJANG</span>
      <span>{p.nomor ? `No. ${p.nomor}` : `Kode ${p.kode}`}</span>
      <span>
        Lembar {ke} dari {total}
      </span>
    </footer>
  );
}

/* ---------------- 1. sampul ---------------- */

function LembarSampul({ p, footer }: { p: BukuSertifikatProps; footer: ReactNode }) {
  const lv = LEVELS.find((l) => l.id === p.level)!;
  return (
    <Lembar gelap label="Sampul">
      <div aria-hidden className="absolute" style={{ inset: 0, opacity: 0.08, background: `repeating-radial-gradient(circle at 50% 42%, ${GOLD_TERANG} 0 1px, transparent 1px 9px)` }} />
      <div aria-hidden className="absolute" style={{ inset: "3%", border: "2px solid transparent", borderImage: `${EMAS} 1` }} />
      <div aria-hidden className="absolute" style={{ inset: "4.4%", border: `0.5px solid ${GOLD_TERANG}99` }} />
      <div className="absolute flex flex-col items-center text-center" style={{ inset: "11% 10% 12%" }}>
        <span className="flex items-center justify-center rounded-full" style={{ width: "11cqw", height: "11cqw", background: EMAS, boxShadow: "0 0.6cqw 1.6cqw rgba(0,0,0,.35)" }}>
          <span className="flex items-center justify-center rounded-full" style={{ width: "9.2cqw", height: "9.2cqw", background: NAVY }}>
            <Image src="/brand/rinoya-mark-r.png" alt="" width={96} height={96} style={{ width: "5.6cqw", height: "auto" }} />
          </span>
        </span>
        <p style={{ marginTop: "2.2cqw", fontFamily: SANS, fontWeight: 600, fontSize: "1.5cqw", letterSpacing: "0.6em", color: GOLD_TERANG }}>RINOYA ACADEMY</p>
        <h1 style={{ marginTop: "1.6cqw", fontWeight: 700, fontSize: "5.4cqw", lineHeight: 1, letterSpacing: "0.14em", color: "#f6ecd2" }}>SERTIFIKAT</h1>
        <p style={{ marginTop: "0.8cqw", fontFamily: SANS, fontWeight: 700, fontSize: "1.5cqw", letterSpacing: "0.42em", color: GOLD_TERANG }}>KENAIKAN JENJANG</p>
        <div aria-hidden style={{ marginTop: "2cqw", width: "26cqw", height: 1.5, background: EMAS }} />
        <p style={{ marginTop: "2cqw", fontFamily: SKRIP, fontSize: "5.4cqw", lineHeight: 1.05, color: GOLD_TERANG }}>{p.nama}</p>
        <p style={{ marginTop: "1.4cqw", fontSize: "2cqw", color: "#f6ecd2" }}>
          {lv.nama} ({lv.lokal}) · Pangkat {p.snapshot.pangkat || lv.pangkat}
        </p>
        <p style={{ marginTop: "auto", fontFamily: SANS, fontWeight: 600, fontSize: "1.2cqw", letterSpacing: "0.3em", color: "rgba(246,236,210,.8)" }}>TAHUN AJARAN {tahunAjaran(p.issuedAt)}</p>
      </div>
      {footer}
    </Lembar>
  );
}

/* ---------------- 2. sertifikat dengan foto ---------------- */

function Segel({ teks }: { teks: string }) {
  const gigi: string[] = [];
  for (let k = 0; k < 72; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 36;
    const r = k % 2 ? 63 : 69;
    gigi.push(`${(70 + Math.cos(a) * r).toFixed(1)},${(70 + Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 140 190" style={{ width: "100%", height: "100%" }} aria-hidden>
      <defs>
        <radialGradient id="bs-segel" cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#fbe7a6" />
          <stop offset="0.45" stopColor="#e2b04a" />
          <stop offset="1" stopColor="#9a6a17" />
        </radialGradient>
        <path id="bs-cincin" d="M24,70 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <path d="M40 110 L18 188 L40 174 L54 196 L70 122 Z" fill={NAVY} />
      <path d="M100 110 L122 188 L100 174 L86 196 L70 122 Z" fill={NAVY2} />
      <polygon points={gigi.join(" ")} fill="url(#bs-segel)" stroke="#8a5d12" strokeWidth="1" />
      <circle cx="70" cy="70" r="56" fill="none" stroke="#8a5d12" strokeWidth="1.4" />
      <circle cx="70" cy="70" r="36" fill="#d9a840" stroke="#8a5d12" strokeWidth="1.2" />
      <text fontFamily={SANS} fontSize="9" fontWeight="700" fill="#6b470c">
        <textPath href="#bs-cincin" textLength="286" lengthAdjust="spacing">
          RINOYA ACADEMY ★ LULUS JENJANG ★
        </textPath>
      </text>
      <text x="70" y="70" textAnchor="middle" fontFamily={SERIF} fontSize="24" fontWeight="700" fill="#5a3b08">
        R
      </text>
      <text x="70" y="86" textAnchor="middle" fontFamily={SANS} fontSize={teks.length > 8 ? 7.5 : 8.5} fontWeight="800" fill="#5a3b08" letterSpacing="1.2">
        {teks.toUpperCase()}
      </text>
    </svg>
  );
}

function Foto({ url, nama }: { url?: string | null; nama: string }) {
  return (
    <div className="relative" style={{ width: "100%", aspectRatio: "3 / 4", padding: "0.7cqw", background: EMAS, borderRadius: "0.6cqw", boxShadow: "0 0.5cqw 1.4cqw rgba(20,35,63,.25)" }}>
      <div className="flex h-full w-full items-center justify-center overflow-hidden" style={{ background: "#efe6d0", borderRadius: "0.3cqw", border: `0.25cqw solid ${KERTAS}` }}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`Foto ${nama}`} className="h-full w-full object-cover" />
        ) : (
          <span style={{ fontFamily: SANS, fontSize: "1.1cqw", fontWeight: 700, letterSpacing: "0.2em", color: MUTED, textAlign: "center" }}>
            PAS FOTO
            <br />3 × 4
          </span>
        )}
      </div>
    </div>
  );
}

function TandaTangan({ i, terang }: { i: number; terang?: boolean }) {
  const p = PENANDATANGAN[i];
  return (
    <div className="flex flex-col items-center" style={{ fontFamily: SANS }}>
      <div className="flex items-end justify-center" style={{ height: "3.6cqw" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p?.ttd && <img src={p.ttd} alt="" style={{ maxHeight: "100%" }} />}
      </div>
      <div style={{ width: "16cqw", height: 1.2, background: terang ? "#f6ecd2" : NAVY }} />
      {p?.nama && <p style={{ marginTop: "0.4cqw", fontSize: "1.15cqw", fontWeight: 700, color: NAVY }}>{p.nama}</p>}
      <p style={{ marginTop: "0.4cqw", fontSize: "0.95cqw", fontWeight: 700, color: MUTED, letterSpacing: "0.16em" }}>{(p?.jabatan ?? "").toUpperCase()}</p>
    </div>
  );
}

function LembarSertifikat({ p, footer }: { p: BukuSertifikatProps; footer: ReactNode }) {
  const lv = LEVELS.find((l) => l.id === p.level)!;
  const pelajaran = TRACKS.filter((t) => p.snapshot.kompetensi.some((k) => k.track === t.id)).map((t) => t.nama.id);
  const daftar = pelajaran.length < 3 ? pelajaran.join(" dan ") : `${pelajaran.slice(0, -1).join(", ")}, dan ${pelajaran.at(-1)}`;
  return (
    <Lembar label="Sertifikat">
      <div aria-hidden className="absolute" style={{ inset: "1.8%", border: `min(10px,1cqw) solid ${NAVY}` }} />
      <div aria-hidden className="absolute" style={{ inset: "4.2%", border: "2px solid transparent", borderImage: `${EMAS} 1` }} />
      <div aria-hidden className="absolute" style={{ inset: "5.6%", border: `0.5px solid ${GOLD}` }} />
      <div aria-hidden className="absolute" style={{ inset: "5.6%", opacity: 0.05, background: `repeating-radial-gradient(circle at 70% 50%, ${NAVY} 0 1px, transparent 1px 7px)` }} />
      {p.pending && (
        <div className="no-print absolute right-[8%] rounded-full px-3 py-1" style={{ top: "7.4%", background: "#fff4d1", color: "#b07a00", fontFamily: SANS, fontSize: "1cqw", fontWeight: 700, letterSpacing: "0.12em" }}>
          MENUNGGU SINKRON
        </div>
      )}
      <div className="absolute grid" style={{ inset: "9% 8% 11.5%", gridTemplateColumns: "24% 1fr", gap: "4cqw" }}>
        <div className="flex flex-col items-center justify-center gap-[2cqw]">
          <Foto url={p.foto} nama={p.nama} />
          <div style={{ width: "62%", aspectRatio: "140 / 190" }}>
            <Segel teks={p.snapshot.pangkat || lv.pangkat} />
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: "1.3cqw", letterSpacing: "0.5em", color: NAVY }}>RINOYA ACADEMY</p>
          <h1 style={{ marginTop: "1.4cqw", fontWeight: 700, fontSize: "5.8cqw", lineHeight: 1, letterSpacing: "0.14em", color: NAVY }}>SERTIFIKAT</h1>
          <div className="flex items-center gap-[1cqw]" style={{ marginTop: "0.6cqw" }}>
            <span style={{ width: "6cqw", height: 1.5, background: EMAS }} />
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.2cqw", letterSpacing: "0.36em", color: GOLD }}>KENAIKAN JENJANG</span>
            <span style={{ width: "6cqw", height: 1.5, background: EMAS }} />
          </div>
          <p style={{ marginTop: "2.4cqw", fontStyle: "italic", fontSize: "1.9cqw", color: MUTED }}>Dengan bangga diberikan kepada</p>
          <p style={{ marginTop: "0.4cqw", fontFamily: SKRIP, fontSize: p.nama.length > 22 ? "4.8cqw" : "6.2cqw", lineHeight: 1.1, color: NAVY }}>{p.nama}</p>
          <div style={{ width: "60%", height: 1.5, background: EMAS }} />
          <p style={{ marginTop: "2cqw", fontSize: "1.9cqw", lineHeight: 1.5, maxWidth: "94%" }}>
            yang telah menyelesaikan seluruh materi dan Ujian Akhir <b style={{ color: NAVY }}>{lv.nama} ({lv.lokal})</b>, meraih pangkat <b style={{ color: NAVY }}>{p.snapshot.pangkat || lv.pangkat}</b>, dengan menguasai <b style={{ color: NAVY }}>{p.snapshot.dikuasai} dari {p.snapshot.total}</b> kompetensi inti pada pelajaran {daftar}.
          </p>
          {typeof p.snapshot.nilai === "number" && (
            <p className="rounded-full text-white" style={{ marginTop: "2cqw", padding: "0.6cqw 2cqw", background: NAVY, fontFamily: SANS, fontWeight: 700, fontSize: "1.15cqw", letterSpacing: "0.22em" }}>
              {(p.snapshot.predikat ?? "").toUpperCase()} · NILAI UJIAN AKHIR {p.snapshot.nilai}
            </p>
          )}
          <p style={{ marginTop: "1.4cqw", fontFamily: SANS, fontSize: "1.05cqw", color: MUTED, letterSpacing: "0.08em" }}>
            Kurikulum mengacu pada {lv.acuan} · Diterbitkan {tanggalPanjang(p.issuedAt)}
          </p>
          <div className="mt-auto grid w-full items-end" style={{ gridTemplateColumns: "1fr 1fr", gap: "4cqw" }}>
            <TandaTangan i={0} />
            <TandaTangan i={1} />
          </div>
        </div>
      </div>
      {footer}
    </Lembar>
  );
}

/* ---------------- 3. hasil belajar ---------------- */

const LABEL_UJIAN = (jenis: string, ruang: string, level: LevelId) => {
  if (jenis === "kuis") return KOMPETENSI.find((c) => c.level === level && c.unit.id === ruang)?.unit.nama.id ?? ruang;
  if (jenis === "semester") return `Semester ${ruang.slice(1)}`;
  return "Seluruh jenjang";
};

function LembarHasil({ p, footer }: { p: BukuSertifikatProps; footer: ReactNode }) {
  const ujian = p.snapshot.ujian ?? [];
  const besar = ujian.filter((u) => u.jenis !== "kuis").sort((a, b) => (a.jenis === "kenaikan" ? 1 : 0) - (b.jenis === "kenaikan" ? 1 : 0) || a.ruang.localeCompare(b.ruang));
  const trackDari = (ruang: string) => KOMPETENSI.find((c) => c.level === p.level && c.unit.id === ruang)?.track;
  const perPelajaran = TRACKS.map((t) => ({ t, rows: ujian.filter((u) => u.jenis === "kuis" && trackDari(u.ruang) === t.id) })).filter((g) => g.rows.length);
  const rata = (xs: { nilai: number }[]) => Math.round(xs.reduce((n, x) => n + x.nilai, 0) / Math.max(1, xs.length));
  return (
    <Lembar label="Hasil belajar">
      <BingkaiIsi judul="Hasil Belajar" sub={`${p.nama} · ${LEVELS.find((l) => l.id === p.level)!.nama}`} />
      <div className="absolute grid" style={{ left: "6%", right: "6%", top: "19%", bottom: "11%", gridTemplateColumns: "34% 1fr", gap: "3cqw", fontFamily: SANS }}>
        <div className="flex flex-col gap-[1.2cqw]">
          <div style={{ background: NAVY, color: "#f6ecd2", borderRadius: "0.8cqw", padding: "1.6cqw" }}>
            <p style={{ fontSize: "1cqw", fontWeight: 700, letterSpacing: "0.2em", color: GOLD_TERANG }}>NILAI UJIAN AKHIR</p>
            <p style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "6.4cqw", lineHeight: 1, fontVariantNumeric: "lining-nums" }}>{p.snapshot.nilai ?? "—"}</p>
            <p style={{ fontSize: "1.4cqw", fontWeight: 700 }}>{p.snapshot.predikat ?? ""}</p>
          </div>
          {besar
            .filter((u) => u.jenis !== "kenaikan")
            .map((u) => (
              <div key={`${u.jenis}-${u.ruang}`} className="flex items-baseline justify-between" style={{ borderBottom: `1px solid ${GOLD}55`, paddingBottom: "0.6cqw" }}>
                <span style={{ fontSize: "1.25cqw", fontWeight: 600 }}>{NAMA_UJIAN[u.jenis as JenisUjian] ?? u.jenis} · {LABEL_UJIAN(u.jenis, u.ruang, p.level)}</span>
                <b style={{ fontFamily: SERIF, fontSize: "2.2cqw", color: NAVY, fontVariantNumeric: "lining-nums" }}>{u.nilai}</b>
              </div>
            ))}
          <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.max(1, perPelajaran.length)}, 1fr)`, gap: "0.8cqw" }}>
            {perPelajaran.map(({ t, rows }) => (
              <div key={t.id} style={{ border: `1px solid ${GOLD}66`, borderRadius: "0.6cqw", padding: "0.9cqw", background: "rgba(255,255,255,.5)" }}>
                <p style={{ fontSize: "0.9cqw", fontWeight: 700, letterSpacing: "0.14em", color: GOLD }}>{t.nama.id.toUpperCase()}</p>
                <p style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "2.4cqw", lineHeight: 1.1, color: NAVY, fontVariantNumeric: "lining-nums" }}>{rata(rows)}</p>
                <p style={{ fontSize: "0.8cqw", color: MUTED }}>{rows.length} ulangan</p>
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <p style={{ fontSize: "1.05cqw", fontWeight: 700, letterSpacing: "0.18em", color: GOLD }}>NILAI ULANGAN MODUL</p>
          <table className="w-full" style={{ marginTop: "0.6cqw", borderCollapse: "collapse", fontSize: "1.15cqw" }}>
            <thead>
              <tr style={{ color: MUTED, fontSize: "0.9cqw", letterSpacing: "0.12em" }}>
                <th className="text-left" style={{ padding: "0.4cqw 0" }}>PELAJARAN</th>
                <th className="text-left">MODUL</th>
                <th className="text-right">NILAI</th>
              </tr>
            </thead>
            <tbody>
              {perPelajaran.flatMap(({ t, rows }) =>
                rows.map((u, i) => (
                  <tr key={`${u.ruang}-${i}`} style={{ borderTop: `1px solid ${GOLD}33` }}>
                    <td style={{ padding: "0.45cqw 0", fontWeight: 700, color: NAVY }}>{i === 0 ? t.nama.id : ""}</td>
                    <td>{LABEL_UJIAN(u.jenis, u.ruang, p.level)}</td>
                    <td className="text-right" style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{u.nilai}</td>
                  </tr>
                )),
              )}
              {!perPelajaran.length && (
                <tr>
                  <td colSpan={3} style={{ padding: "0.6cqw 0", color: MUTED }}>
                    Sertifikat ini terbit sebelum sistem ulangan berlaku.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p style={{ marginTop: "1.2cqw", fontSize: "0.95cqw", color: MUTED, lineHeight: 1.5 }}>
            Ulangan Modul dan Ujian Semester boleh diulang setelah materi diulang (nilai terbaik dicatat). Ujian Akhir hanya dikerjakan sekali; nilainya dicatat apa adanya. Predikat: 90–100 Dengan Pujian · 80–89 Sangat Baik · 75–79 Baik · di bawah 75 Cukup.
          </p>
        </div>
      </div>
      {footer}
    </Lembar>
  );
}

/* ---------------- 4+. transkrip kompetensi ---------------- */

type BarisTranskrip = { judul?: string; k?: SnapshotKompetensi };

/** Perkiraan tinggi (cqw) tiap baris transkrip: judul pelajaran, kompetensi 1 baris, atau 2 baris teks. */
const TINGGI_KOLOM = 47;
const tinggiBaris = (r: BarisTranskrip) => (r.judul ? 2.5 : r.k!.statement.id.length > 62 ? 3.4 : 2.05);

/** Kompetensi per pelajaran → baris, diisi ke kolom berdasarkan tinggi (2 kolom per lembar). */
export function pecahTranskrip(kompetensi: SnapshotKompetensi[]): BarisTranskrip[][][] {
  const baris: BarisTranskrip[] = [];
  for (const t of TRACKS) {
    const isi = kompetensi.filter((k) => k.track === t.id);
    if (!isi.length) continue;
    baris.push({ judul: t.nama.id });
    for (const k of isi) baris.push({ k });
  }
  const kolom: BarisTranskrip[][] = [[]];
  let tinggi = 0;
  for (const r of baris) {
    const h = tinggiBaris(r);
    // judul pelajaran jangan tertinggal sendirian di dasar kolom
    const butuh = r.judul ? h + 2.05 : h;
    if (tinggi + butuh > TINGGI_KOLOM && kolom[kolom.length - 1].length) {
      kolom.push([]);
      tinggi = 0;
    }
    kolom[kolom.length - 1].push(r);
    tinggi += h;
  }
  const lembar: BarisTranskrip[][][] = [];
  for (let i = 0; i < kolom.length; i += 2) lembar.push(kolom.slice(i, i + 2));
  return lembar.length ? lembar : [[[]]];
}

const STATUS: Record<string, [string, string]> = { dikuasai: ["Dikuasai", "#13794a"], berkembang: ["Berkembang", "#a34a00"], belum: ["Belum", MUTED] };

function LembarTranskrip({ p, isi: kolom, ke, dari, footer }: { p: BukuSertifikatProps; isi: BarisTranskrip[][]; ke: number; dari: number; footer: ReactNode }) {
  return (
    <Lembar label={`Transkrip kompetensi ${ke}`}>
      <BingkaiIsi judul="Transkrip Kompetensi Inti" sub={`${p.snapshot.dikuasai} dari ${p.snapshot.total} dikuasai${dari > 1 ? ` · bagian ${ke}/${dari}` : ""}`} />
      <div className="absolute grid" style={{ left: "6%", right: "6%", top: "19%", bottom: "11%", gridTemplateColumns: "1fr 1fr", gap: "3cqw", fontFamily: SANS }}>
        {kolom.map((rows, c) => (
          <ul key={c} className="m-0 flex list-none flex-col p-0">
            {rows.map((r, i) =>
              r.judul ? (
                <li key={i} style={{ marginTop: i ? "0.8cqw" : 0, fontSize: "1.1cqw", fontWeight: 800, letterSpacing: "0.14em", color: GOLD }}>
                  {r.judul.toUpperCase()}
                </li>
              ) : (
                <li key={i} className="flex justify-between gap-[1cqw]" style={{ padding: "0.32cqw 0", borderBottom: `1px dotted ${GOLD}66`, fontSize: "1.02cqw", lineHeight: 1.3 }}>
                  <span className="line-clamp-2">{r.k!.statement.id}</span>
                  <span style={{ flexShrink: 0, fontWeight: 700, color: STATUS[r.k!.status]?.[1] ?? MUTED }}>{STATUS[r.k!.status]?.[0] ?? r.k!.status}</span>
                </li>
              ),
            )}
          </ul>
        ))}
      </div>
      {footer}
    </Lembar>
  );
}

/* ---------------- terakhir. pengesahan ---------------- */

function LembarPengesahan({ p, footer }: { p: BukuSertifikatProps; footer: ReactNode }) {
  const lv = LEVELS.find((l) => l.id === p.level)!;
  const url = URL_VERIFIKASI(p.kode);
  const data: [string, string][] = [
    ["Nama peserta", p.nama],
    ["Jenjang", `${lv.nama} (${lv.lokal})`],
    ["Pangkat", p.snapshot.pangkat || lv.pangkat],
    ["Nilai Ujian Akhir", typeof p.snapshot.nilai === "number" ? `${p.snapshot.nilai} · ${p.snapshot.predikat ?? ""}` : "—"],
    ["Kompetensi inti", `${p.snapshot.dikuasai} dari ${p.snapshot.total} dikuasai`],
    ["Tahun ajaran", tahunAjaran(p.issuedAt)],
    ["Tanggal terbit", tanggalPanjang(p.issuedAt)],
    ["Nomor sertifikat", p.nomor ?? "terbit setelah sinkron"],
  ];
  return (
    <Lembar label="Lembar pengesahan">
      <BingkaiIsi judul="Lembar Pengesahan" sub="Keterangan & keaslian dokumen" />
      <div className="absolute grid" style={{ left: "6%", right: "6%", top: "19%", bottom: "11%", gridTemplateColumns: "1fr 30%", gap: "4cqw", fontFamily: SANS }}>
        <div className="flex flex-col">
          <dl className="grid" style={{ gridTemplateColumns: "auto 1fr", gap: "0.7cqw 2.4cqw", fontSize: "1.3cqw" }}>
            {data.map(([k, v]) => (
              <div key={k} className="contents">
                <dt style={{ color: MUTED }}>{k}</dt>
                <dd style={{ margin: 0, fontWeight: 700, color: NAVY }}>{v}</dd>
              </div>
            ))}
          </dl>
          <p style={{ marginTop: "1.6cqw", fontSize: "1.02cqw", lineHeight: 1.6, color: TINTA, maxWidth: "95%" }}>
            Sertifikat ini diterbitkan oleh sistem RINOYA Academy setelah peserta menuntaskan seluruh modul, Ujian Semester, dan Ujian Akhir jenjang. Kelulusan dihitung ulang oleh server dari catatan belajar peserta, sehingga isi dokumen tidak dapat diubah. RINOYA Academy adalah program belajar non-formal pendamping sekolah; dokumen ini bukan ijazah. Kurikulum mengacu pada {lv.acuan}.
          </p>
          <div className="mt-auto grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "3cqw" }}>
            <TandaTangan i={0} />
            <TandaTangan i={1} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center" style={{ border: `1px solid ${GOLD}88`, borderRadius: "0.8cqw", padding: "2cqw", background: "rgba(255,255,255,.55)" }}>
          <p style={{ fontSize: "1cqw", fontWeight: 700, letterSpacing: "0.2em", color: GOLD }}>VERIFIKASI KEASLIAN</p>
          <div style={{ marginTop: "1.2cqw" }}>
            <KodeQR teks={url} ukuran="14cqw" />
          </div>
          <p style={{ marginTop: "1cqw", fontSize: "0.95cqw", color: MUTED }}>Kode verifikasi</p>
          <p style={{ fontWeight: 800, fontSize: "2cqw", letterSpacing: "0.2em", color: NAVY, fontVariantNumeric: "lining-nums" }}>{p.kode}</p>
          <p style={{ marginTop: "0.6cqw", fontSize: "0.9cqw", color: MUTED, wordBreak: "break-all" }}>{url.replace(/^https:\/\//, "")}</p>
        </div>
      </div>
      {footer}
    </Lembar>
  );
}
