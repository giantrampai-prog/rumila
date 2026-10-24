"use client";

// Kartu Sertifikat Jenjang Rumila Kids Academy — A4 landscape ramah cetak. Gaya mengikuti sertifikat Coding Agam:
// kertas gading, bingkai navy + garis emas, hiasan sudut, segel emas. Dirender HTML/CSS (bukan SVG) supaya daftar
// unit yang dikuasai bisa mengalir. Dipakai di halaman murid (/akademi/sertifikat/<level>) dan halaman verifikasi
// publik (/sertifikat/<kode>) — di halaman publik hanya nama depan yang ditampilkan (sudah disaring server).

import Image from "next/image";
import { LEVELS, TRACKS, type LevelId } from "@akademi/schema";
import { URL_VERIFIKASI, type SnapshotSertifikat } from "@/lib/akademi/sertifikat";

const DISPLAY = 'Didot, "Bodoni 72", "Bodoni MT", "Playfair Display", Georgia, "Times New Roman", serif';
const SERIF = 'Baskerville, "Baskerville Old Face", Georgia, "Times New Roman", serif';
const SCRIPT = '"Snell Roundhand", "Apple Chancery", "Great Vibes", "Brush Script MT", Georgia, serif';
const SANS = '"Avenir Next", Avenir, "Helvetica Neue", "Segoe UI", Arial, sans-serif';

const NAVY = "#14233f";
const INK = "#3a4356";
const MUTED = "#7a7466";
const GOLD = "#b8892b";
const GOLD_GRAD = "linear-gradient(135deg,#a8761d 0%,#e9c46a 35%,#f7e3a1 55%,#c9962f 75%,#9a6a17 100%)";

/** CSS cetak: A4 landscape tanpa margin, sembunyikan elemen .no-print, kartu mengisi satu halaman. */
export const SERTIFIKAT_PRINT_CSS = `
@page { size: A4 landscape; margin: 0; }
@media print {
  html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
  .no-print { display: none !important; }
  .sertifikat-root { background: #fff !important; padding: 0 !important; margin: 0 !important; min-height: 0 !important; }
  .sertifikat-card { width: 297mm !important; height: 210mm !important; max-width: none !important; border-radius: 0 !important; box-shadow: none !important; break-inside: avoid; page-break-after: avoid; }
  a { text-decoration: none; color: inherit; }
}`;

export function tanggalPanjang(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function Sudut({ posisi }: { posisi: "kiri-atas" | "kanan-atas" | "kiri-bawah" | "kanan-bawah" }) {
  const sx = posisi.includes("kanan") ? -1 : 1;
  const sy = posisi.includes("bawah") ? -1 : 1;
  const style: React.CSSProperties = {
    position: "absolute",
    width: "9%",
    maxWidth: 96,
    ...(sx === 1 ? { left: "5.2%" } : { right: "5.2%" }),
    ...(sy === 1 ? { top: "7.4%" } : { bottom: "7.4%" }),
    transform: `scale(${sx}, ${sy})`,
  };
  return (
    <svg viewBox="0 0 110 110" style={style} aria-hidden>
      <defs>
        <linearGradient id="sj-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8761d" />
          <stop offset="0.35" stopColor="#e9c46a" />
          <stop offset="0.55" stopColor="#f7e3a1" />
          <stop offset="0.75" stopColor="#c9962f" />
          <stop offset="1" stopColor="#9a6a17" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#sj-gold)" strokeLinecap="round" transform="translate(4 4)">
        <path d="M0 70 L0 0 L70 0" strokeWidth="2.4" />
        <path d="M10 56 L10 10 L56 10" strokeWidth="1" />
        <path d="M10 10 C 30 14, 38 30, 26 38 C 16 44, 8 32, 18 26" strokeWidth="1.6" />
        <path d="M70 0 C 86 0, 92 10, 104 6 M0 70 C 0 86, 10 92, 6 104" strokeWidth="1.2" />
        <polygon points="0,-7 7,0 0,7 -7,0" fill="url(#sj-gold)" stroke="none" />
        <circle cx="10" cy="10" r="2.6" fill="url(#sj-gold)" stroke="none" />
      </g>
    </svg>
  );
}

function Segel({ pangkat }: { pangkat: string }) {
  const gigi: string[] = [];
  for (let k = 0; k < 72; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 36;
    const rr = k % 2 ? 63 : 70;
    gigi.push(`${(70 + Math.cos(a) * rr).toFixed(1)},${(70 + Math.sin(a) * rr).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 140 190" style={{ width: "100%", height: "100%" }} aria-hidden>
      <defs>
        <radialGradient id="sj-seal" cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#fbe7a6" />
          <stop offset="0.45" stopColor="#e2b04a" />
          <stop offset="1" stopColor="#9a6a17" />
        </radialGradient>
        <linearGradient id="sj-gold2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8761d" />
          <stop offset="0.5" stopColor="#f7e3a1" />
          <stop offset="1" stopColor="#9a6a17" />
        </linearGradient>
        <path id="sj-ring" d="M23,70 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
      </defs>
      <path d="M40 110 L18 188 L40 174 L54 196 L70 122 Z" fill={NAVY} />
      <path d="M100 110 L122 188 L100 174 L86 196 L70 122 Z" fill="#1f3560" />
      <polygon points={gigi.join(" ")} fill="url(#sj-seal)" stroke="#8a5d12" strokeWidth="1" />
      <circle cx="70" cy="70" r="57" fill="none" stroke="#8a5d12" strokeWidth="1.5" />
      <circle cx="70" cy="70" r="37" fill="url(#sj-gold2)" stroke="#8a5d12" strokeWidth="1.5" />
      <text fontFamily={SANS} fontSize="9.5" fontWeight="700" fill="#6b470c">
        <textPath href="#sj-ring" textLength="292" lengthAdjust="spacing">
          RUMILA KIDS ACADEMY ★ SERTIFIKAT JENJANG ★
        </textPath>
      </text>
      <text x="70" y="66" textAnchor="middle" fontFamily={SANS} fontSize="22" fill="#5a3b08">
        🎓
      </text>
      <text x="70" y="86" textAnchor="middle" fontFamily={SANS} fontSize={pangkat.length > 8 ? 8 : 9.5} fontWeight="800" fill="#5a3b08" letterSpacing="1.5">
        {pangkat.toUpperCase()}
      </text>
    </svg>
  );
}

export interface SertifikatKartuProps {
  /** Nama anak (halaman murid: nama lengkap; halaman publik: nama depan saja). */
  nama: string;
  level: LevelId;
  kode: string;
  issuedAt: string;
  snapshot: SnapshotSertifikat;
  /** Belum tersimpan di server (offline) → cap kecil "menunggu sinkron". */
  pending?: boolean;
  /** Tampilkan pita "Sertifikat sah · terverifikasi" (halaman publik). */
  terverifikasi?: boolean;
  className?: string;
}

/** Unit yang semua kompetensi intinya dikuasai, dikelompokkan per track (urutan TRACKS). */
export function unitDikuasai(snapshot: SnapshotSertifikat) {
  const perUnit = new Map<string, { track: string; nama: string; semua: boolean }>();
  for (const k of snapshot.kompetensi) {
    const key = `${k.track}|${k.unit?.id ?? k.id.split(".")[2]}`;
    const g = perUnit.get(key) ?? perUnit.set(key, { track: k.track, nama: k.unit?.nama?.id ?? k.id.split(".")[2], semua: true }).get(key)!;
    if (k.status !== "dikuasai") g.semua = false;
  }
  return TRACKS.map((t) => ({
    track: t,
    unit: [...perUnit.values()].filter((u) => u.track === t.id && u.semua).map((u) => u.nama),
  })).filter((g) => g.unit.length > 0);
}

export function SertifikatKartu({ nama, level, kode, issuedAt, snapshot, pending, terverifikasi, className = "" }: SertifikatKartuProps) {
  const meta = LEVELS.find((l) => l.id === level);
  const namaJenjang = meta ? `${meta.nama} (${meta.lokal})` : level;
  const pangkat = snapshot.pangkat || meta?.pangkat || "";
  const acuan = meta?.acuan ?? "";
  const url = URL_VERIFIKASI(kode);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=${encodeURIComponent(url)}`;
  const kelompok = unitDikuasai(snapshot);
  const nameSize = nama.length > 24 ? "clamp(22px, 3.6cqw, 44px)" : nama.length > 16 ? "clamp(26px, 4.6cqw, 56px)" : "clamp(30px, 5.6cqw, 68px)";

  return (
    <div
      className={`sertifikat-card relative w-full max-w-[1000px] overflow-hidden rounded-[6px] shadow-[0_18px_50px_rgba(20,35,63,.22)] ${className}`}
      style={{
        aspectRatio: "297 / 210",
        containerType: "inline-size",
        background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 60%, rgba(201,168,106,.22) 100%), linear-gradient(135deg,#fdfaf2,#f5eddb)",
        color: INK,
        fontFamily: SERIF,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* bingkai navy luar + dua garis emas + garis tipis dalam */}
      <div aria-hidden className="pointer-events-none absolute" style={{ inset: "1.6%", border: "0.9cqw solid " + NAVY, borderWidth: "min(12px, 1cqw)" }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ inset: "4.2%", border: "2px solid transparent", borderImage: `${GOLD_GRAD} 1` }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ inset: "6.2%", border: "2px solid transparent", borderImage: `${GOLD_GRAD} 1` }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ inset: "7.6%", border: `1px solid ${NAVY}59` }} />
      <Sudut posisi="kiri-atas" />
      <Sudut posisi="kanan-atas" />
      <Sudut posisi="kiri-bawah" />
      <Sudut posisi="kanan-bawah" />

      {terverifikasi && (
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-white" style={{ top: "3.2%", background: "#12904a", fontFamily: SANS, fontSize: "clamp(9px, 1.2cqw, 13px)", fontWeight: 700, letterSpacing: 2 }}>
          SERTIFIKAT SAH · TERVERIFIKASI
        </div>
      )}
      {pending && (
        <div className="no-print absolute right-[9%] rounded-full px-3 py-1" style={{ top: "9%", background: "#fff4d1", color: "#b07a00", fontFamily: SANS, fontSize: "clamp(8px, 1.1cqw, 12px)", fontWeight: 700, letterSpacing: 1.5 }}>
          MENUNGGU SINKRON
        </div>
      )}

      {/* isi */}
      <div className="absolute flex flex-col items-center text-center" style={{ inset: "9.5% 11% 9% 11%" }}>
        <div className="flex items-center gap-[1.2cqw]">
          <Image src="/brand/rinoya-mark.png" alt="" width={64} height={64} priority style={{ width: "clamp(28px, 5cqw, 64px)", height: "auto" }} />
          <span style={{ fontFamily: SANS, fontSize: "clamp(9px, 1.45cqw, 17px)", fontWeight: 600, color: NAVY, letterSpacing: "0.55em" }}>RUMILA KIDS ACADEMY</span>
        </div>

        <h1 className="leading-none" style={{ marginTop: "1.6cqw", fontFamily: DISPLAY, fontSize: "clamp(28px, 6.2cqw, 76px)", fontWeight: 700, color: NAVY, letterSpacing: "0.18em" }}>
          SERTIFIKAT
        </h1>
        <div className="flex items-center gap-[1cqw]" style={{ marginTop: "0.8cqw" }}>
          <span style={{ width: "8cqw", height: 1.5, background: GOLD_GRAD }} />
          <span style={{ fontFamily: SANS, fontSize: "clamp(9px, 1.5cqw, 18px)", fontWeight: 700, color: GOLD, letterSpacing: "0.4em" }}>JENJANG</span>
          <span style={{ width: "8cqw", height: 1.5, background: GOLD_GRAD }} />
        </div>

        <p style={{ marginTop: "2.2cqw", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(11px, 1.8cqw, 22px)", color: MUTED }}>Dengan bangga diberikan kepada</p>
        <p className="leading-none" style={{ marginTop: "0.8cqw", fontFamily: SCRIPT, fontSize: nameSize, color: NAVY }}>
          {nama}
        </p>
        <div className="relative" style={{ marginTop: "0.9cqw", width: "50%", height: 4 }}>
          <span className="absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2" style={{ background: GOLD_GRAD, maskImage: "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)" }} />
          <span className="absolute left-1/2 top-1/2 block size-[9px] -translate-x-1/2 -translate-y-1/2 rotate-45" style={{ background: GOLD_GRAD }} />
        </div>

        <p style={{ marginTop: "1.6cqw", fontSize: "clamp(11px, 1.75cqw, 21px)", color: INK, lineHeight: 1.35 }}>
          telah menuntaskan <b style={{ color: NAVY }}>{namaJenjang}</b>
          {pangkat && (
            <>
              {" "}
              — pangkat <b style={{ color: NAVY }}>{pangkat}</b>
            </>
          )}
          <br />
          dengan menguasai {snapshot.dikuasai} dari {snapshot.total} kompetensi inti jenjang.
        </p>
        {acuan && acuan !== "dicadangkan" && (
          <p style={{ marginTop: "0.6cqw", fontFamily: SANS, fontSize: "clamp(8px, 1.1cqw, 13px)", color: MUTED, letterSpacing: "0.12em" }}>
            Mengacu pada {acuan}
          </p>
        )}

        {/* unit yang dikuasai per pelajaran */}
        {kelompok.length > 0 && (
          <div className="flex w-full flex-wrap justify-center" style={{ marginTop: "1.6cqw", gap: "0.6cqw 2.4cqw", fontFamily: SANS, fontSize: "clamp(7.5px, 1.05cqw, 12.5px)", color: INK }}>
            {kelompok.map((g) => (
              <div key={g.track.id} className="flex items-baseline gap-[0.6cqw]">
                <span style={{ color: GOLD, fontWeight: 700, letterSpacing: "0.1em" }}>{g.track.nama.id.toUpperCase()}</span>
                <span>{g.unit.join(" · ")}</span>
              </div>
            ))}
          </div>
        )}

        {/* baris bawah: tanggal · segel · verifikasi */}
        <div className="mt-auto grid w-full items-end" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
          <div className="text-center" style={{ paddingBottom: "1cqw" }}>
            <p style={{ fontFamily: SERIF, fontSize: "clamp(10px, 1.7cqw, 21px)", color: NAVY }}>{tanggalPanjang(issuedAt)}</p>
            <div className="mx-auto" style={{ width: "70%", height: 1.2, background: NAVY, marginTop: "0.5cqw" }} />
            <p style={{ fontFamily: SANS, fontSize: "clamp(7px, 1cqw, 12px)", fontWeight: 700, color: MUTED, letterSpacing: "0.25em", marginTop: "0.5cqw" }}>TANGGAL TERBIT</p>
            <p style={{ fontFamily: SANS, fontSize: "clamp(7px, 0.95cqw, 11px)", fontWeight: 600, color: MUTED, letterSpacing: "0.12em", marginTop: "0.4cqw" }}>No. RA/SJ/{level}/{kode}</p>
          </div>
          <div style={{ width: "clamp(56px, 9.5cqw, 120px)", height: "clamp(76px, 12.9cqw, 163px)", marginBottom: "-1.4cqw" }}>
            <Segel pangkat={pangkat} />
          </div>
          <div className="flex items-end justify-center gap-[1cqw]" style={{ paddingBottom: "1cqw" }}>
            <div className="text-left" style={{ fontFamily: SANS, color: MUTED }}>
              <p style={{ fontSize: "clamp(7px, 1cqw, 12px)", fontWeight: 700, letterSpacing: "0.2em", color: NAVY }}>KODE VERIFIKASI</p>
              <p style={{ fontFamily: DISPLAY, fontSize: "clamp(14px, 2.4cqw, 30px)", fontWeight: 700, color: NAVY, letterSpacing: "0.18em", lineHeight: 1.1 }}>{kode}</p>
              <p style={{ fontSize: "clamp(6.5px, 0.9cqw, 11px)", marginTop: "0.3cqw", wordBreak: "break-all" }}>{url.replace(/^https:\/\//, "")}</p>
            </div>
            {/* QR dari layanan luar (tanpa library) — bukan next/image karena domain tidak terdaftar di next.config */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt={`QR verifikasi ${kode}`} width={120} height={120} loading="eager" style={{ width: "clamp(48px, 8cqw, 100px)", height: "auto", background: "#fff", padding: 3, border: `1px solid ${NAVY}33` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
