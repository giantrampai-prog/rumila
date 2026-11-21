"use client";

// Gambar benda dari deskripsi Visual paket (emoji / bentuk / warna / skala / lebar / jumlah) — tanpa aset.
// Dipakai semua presenter supaya item, bin, langkah, dan barang dagangan tampil seragam.

import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";
import { BALOO, INK } from "./jenis";

export interface VisualSpec {
  emoji?: string;
  color?: string;
  scale?: number;
  count?: number;
  /** jumlah kolom kisi saat count > 1; bawaan ⌈√count⌉ */
  kolom?: number;
  shape?: "circle" | "square" | "triangle" | "rect" | "star" | "berudu" | "belah-ketupat" | "koin" | "uang" | "akar";
  width?: number;
  /** teks angka pendek (≤ 8 karakter) di atas bentuk; koin & uang menampilkannya sebagai nominal */
  angka?: string;
  /** teks pendek bila tidak ada emoji/bentuk (mis. angka kartu) */
  label?: string;
  /**
   * gambar `color` sebagai latar di belakang emoji. Bila tidak diisi, latar dipakai hanya untuk emoji yang di paket ini
   * muncul dengan ≥ 2 warna berbeda (mis. 🪙 500 vs 🪙 1000, 💵 per pecahan) — lihat LatarWarnaProvider.
   */
  latar?: boolean;
}

/**
 * Emoji yang di satu paket muncul dengan ≥ 2 `color` berbeda: warnanya pembeda, padahal emoji digambar dengan warna font
 * bawaannya, jadi Benda menggambar `color` sebagai latar di belakang emoji itu. Emoji lain (warna sekadar hiasan) tidak berubah.
 */
export function emojiBedaWarna(sumber: unknown): Set<string> {
  const warna = new Map<string, Set<string>>();
  const jelajah = (o: unknown) => {
    if (Array.isArray(o)) { o.forEach(jelajah); return; }
    if (!o || typeof o !== "object") return;
    const r = o as Record<string, unknown>;
    if (typeof r.emoji === "string" && typeof r.color === "string") {
      const w = warna.get(r.emoji) ?? new Set<string>();
      w.add(r.color.toLowerCase());
      warna.set(r.emoji, w);
    }
    for (const v of Object.values(r)) if (v && typeof v === "object") jelajah(v);
  };
  jelajah(sumber);
  return new Set([...warna].filter(([, w]) => w.size > 1).map(([e]) => e));
}

const LatarWarna = createContext<ReadonlySet<string>>(new Set());

/** Pasang di sekeliling presenter: `paket` dipindai sekali untuk emoji yang perlu latar warna. */
export function LatarWarnaProvider({ paket, children }: { paket: unknown; children: ReactNode }) {
  const set = useMemo(() => emojiBedaWarna(paket), [paket]);
  return <LatarWarna.Provider value={set}>{children}</LatarWarna.Provider>;
}

/** Tinta kontras untuk teks di atas `bg` (hex): gelap di warna terang, putih di warna gelap. */
export function tintaKontras(bg: string): string {
  const m = /^#([0-9a-f]{6})$/i.exec(bg);
  if (!m) return INK;
  const n = parseInt(m[1], 16);
  const lin = (c: number) => { const x = c / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  const L = 0.2126 * lin(n >> 16 & 255) + 0.7152 * lin(n >> 8 & 255) + 0.0722 * lin(n & 255);
  return L > 0.32 ? INK : "#ffffff";
}

/** Ukuran huruf (unit viewBox) supaya `teks` muat selebar `lebar` dan setinggi `tinggi`. */
const hurufMuat = (teks: string, lebar: number, tinggi: number) => Math.min(tinggi, (lebar / Math.max(1, teks.length)) * 1.75);

/** Warna bawaan koin: perak untuk nominal < 1000 (100/200/500), emas untuk lainnya. */
function warnaKoin(angka?: string): string {
  const n = angka ? Number(angka.replace(/[^0-9]/g, "")) : NaN;
  return Number.isFinite(n) && n > 0 && n < 1000 ? "#c9ced6" : "#f2c230";
}

/** Koin rupiah sederhana: cakram bertepi, kilau, nominal di tengah. */
function Koin({ color, size, angka }: { color: string; size: number; angka?: string }) {
  const tinta = tintaKontras(color);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden data-bentuk="koin">
      <circle cx="50" cy="52" r="46" fill="rgba(11,37,69,.22)" />
      <circle cx="50" cy="48" r="46" fill={color} />
      <circle cx="50" cy="48" r="46" fill="none" stroke="rgba(11,37,69,.28)" strokeWidth="4" />
      <circle cx="50" cy="48" r="36" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="3" />
      <ellipse cx="34" cy="28" rx="14" ry="7" fill="rgba(255,255,255,.45)" transform="rotate(-30 34 28)" />
      {angka && (
        <text x="50" y="49" textAnchor="middle" dominantBaseline="central" fill={tinta} style={{ fontFamily: BALOO, fontWeight: 900 }} fontSize={hurufMuat(angka, 62, 38)}>
          {angka}
        </text>
      )}
    </svg>
  );
}

/** Uang kertas rupiah sederhana: lembar mendatar berwarna, bingkai dalam, tanda air, nominal besar. */
function Uang({ color, size, width = 1, angka }: { color: string; size: number; width?: number; angka?: string }) {
  const h = size * 0.92, w = size * 1.9 * width;
  const tinta = tintaKontras(color);
  return (
    <svg width={w} height={h} viewBox="0 0 190 92" preserveAspectRatio="none" aria-hidden data-bentuk="uang">
      <rect x="2" y="5" width="186" height="85" rx="10" fill="rgba(11,37,69,.2)" />
      <rect x="2" y="2" width="186" height="85" rx="10" fill={color} />
      <rect x="9" y="9" width="172" height="71" rx="6" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="3" />
      <circle cx="36" cy="44" r="20" fill="rgba(255,255,255,.35)" />
      <circle cx="36" cy="44" r="12" fill="none" stroke="rgba(11,37,69,.18)" strokeWidth="3" />
      {angka && (
        <text x="118" y="40" textAnchor="middle" dominantBaseline="central" fill={tinta} style={{ fontFamily: BALOO, fontWeight: 900 }} fontSize={hurufMuat(angka, 112, 46)}>
          {angka}
        </text>
      )}
      <text x="118" y="71" textAnchor="middle" dominantBaseline="central" fill={tinta} opacity="0.7" style={{ fontFamily: BALOO, fontWeight: 800, letterSpacing: 2 }} fontSize="12">
        RUPIAH
      </text>
    </svg>
  );
}

function Bentuk({ shape, color, size, width = 1, angka }: { shape: NonNullable<VisualSpec["shape"]>; color?: string; size: number; width?: number; angka?: string }) {
  if (shape === "koin") return <Koin color={color ?? warnaKoin(angka)} size={size * width} angka={angka} />;
  if (shape === "uang") return <Uang color={color ?? "#7ec8a0"} size={size} width={width} angka={angka} />;
  const warna = color ?? (shape === "akar" ? "#8a5a2b" : "#0786eb");
  const w = size * width, h = shape === "rect" ? size * 0.42 : size;
  const gambar = <BentukDasar shape={shape} color={warna} size={size} width={width} />;
  if (!angka) return gambar;
  // angka di atas bentuk lain: lapisan teks di tengah kotak bentuk (segitiga: sedikit ke bawah, ke bagian yang lebar)
  return (
    <span style={{ position: "relative", display: "inline-flex", width: w, height: h, alignItems: "center", justifyContent: "center" }}>
      {gambar}
      <span
        style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: shape === "triangle" ? h * 0.28 : 0,
          fontFamily: BALOO, fontWeight: 900, lineHeight: 1, color: tintaKontras(warna), fontSize: Math.min(h * (shape === "triangle" ? 0.34 : 0.5), (w / angka.length) * 1.6),
        }}
      >
        {angka}
      </span>
    </span>
  );
}

function BentukDasar({ shape, color, size, width = 1 }: { shape: NonNullable<VisualSpec["shape"]>; color: string; size: number; width?: number }) {
  const w = size * width, h = size;
  if (shape === "circle") return <span style={{ width: w, height: h, borderRadius: 9999, background: color, display: "inline-block" }} />;
  if (shape === "square") return <span style={{ width: w, height: h, borderRadius: size * 0.12, background: color, display: "inline-block" }} />;
  if (shape === "rect") return <span style={{ width: w, height: h * 0.42, borderRadius: size * 0.16, background: color, display: "inline-block" }} />;
  if (shape === "triangle")
    return (
      <svg width={w} height={h} viewBox="0 0 100 100" aria-hidden>
        <polygon points="50,6 96,92 4,92" fill={color} />
      </svg>
    );
  // belah ketupat tegak: lebih tinggi daripada lebar, sudut tajam di atas/bawah — jelas beda dari persegi
  if (shape === "belah-ketupat")
    return (
      <svg width={w} height={h} viewBox="0 0 100 100" aria-hidden data-bentuk="belah-ketupat">
        <polygon points="50,2 84,50 50,98 16,50" fill={color} />
      </svg>
    );
  // akar tumbuhan: pangkal batang hijau kecil, akar tunggang meruncing ke bawah, cabang serabut ke kiri-kanan
  if (shape === "akar")
    return (
      <svg width={w} height={h} viewBox="0 0 100 100" aria-hidden data-bentuk="akar">
        <rect x="45" y="0" width="10" height="12" rx="3" fill="#4caf50" />
        <path d="M43 11 Q50 8 57 11 L54 40 Q52 70 50 97 Q48 70 46 40 Z" fill={color} />
        <g stroke={color} strokeLinecap="round" fill="none">
          <path d="M47 24 Q34 28 22 40" strokeWidth="4" />
          <path d="M53 26 Q68 30 80 44" strokeWidth="4" />
          <path d="M47 44 Q36 50 28 64" strokeWidth="3.2" />
          <path d="M53 46 Q64 52 72 66" strokeWidth="3.2" />
          <path d="M48 64 Q42 72 38 82" strokeWidth="2.4" />
          <path d="M52 66 Q58 73 62 84" strokeWidth="2.4" />
          <path d="M30 34 Q24 40 22 50" strokeWidth="2" />
          <path d="M72 38 Q78 44 80 54" strokeWidth="2" />
        </g>
      </svg>
    );
  if (shape === "berudu")
    return (
      <svg width={w} height={h} viewBox="0 0 100 100" aria-hidden>
        <path d="M52 50 C66 38 78 64 96 44 C88 66 70 70 52 58 Z" fill={color} opacity="0.8" />
        <ellipse cx="34" cy="52" rx="26" ry="22" fill={color} />
        <circle cx="26" cy="46" r="6" fill="#fff" />
        <circle cx="25" cy="46" r="3" fill="#0b2545" />
      </svg>
    );
  return (
    <svg width={w} height={h} viewBox="0 0 100 100" aria-hidden>
      <polygon points="50,4 61,36 96,38 68,60 78,94 50,74 22,94 32,60 4,38 39,36" fill={color} />
    </svg>
  );
}

/** Satu benda. `size` = tinggi dasar px (sebelum scale). */
export function Benda({ v, size = 56, style, className = "" }: { v: VisualSpec; size?: number; style?: CSSProperties; className?: string }) {
  const s = size * (v.scale ?? 1);
  const n = v.count ?? 1;
  const bedaWarna = useContext(LatarWarna);
  const berlatar = !!v.emoji && !!v.color && (v.latar ?? bedaWarna.has(v.emoji));
  const satu = (k: number): ReactNode => {
    if (v.emoji) {
      const font = n > 1 ? Math.max(18, s / Math.max(v.kolom ?? 0, Math.ceil(Math.sqrt(n))) * 0.9) : s * 0.86;
      const gambar = (
        <span key={k} style={{ fontSize: berlatar ? font * 0.78 : font, lineHeight: 1, display: "inline-block", transform: v.width && v.width !== 1 ? `scaleX(${v.width})` : undefined, transformOrigin: "center" }}>
          {v.emoji}
        </span>
      );
      if (!berlatar) return gambar;
      // latar berwarna (cincin putih tipis supaya warna gelap tetap terpisah dari kartu/latar)
      return (
        <span key={k} className="inline-flex items-center justify-center" style={{ width: font * 1.1 * (v.width ?? 1), height: font * 1.1, borderRadius: font * 0.32, background: v.color, boxShadow: "inset 0 0 0 2px rgba(255,255,255,.55), 0 2px 0 rgba(11,37,69,.18)" }}>
          {gambar}
        </span>
      );
    }
    if (v.shape) {
      // uang kertas ~1,9× lebar tingginya: kelompok uang disusun lebih sempit supaya kisi tetap muat
      const per = n > 1 ? Math.max(14, s / Math.ceil(Math.sqrt(n)) / (v.shape === "uang" ? 1.4 : 1)) : v.shape === "uang" ? s * 0.8 : s;
      return <Bentuk key={k} shape={v.shape} color={v.color} size={per} width={v.width} angka={v.angka} />;
    }
    return (
      <span key={k} style={{ fontFamily: BALOO, fontSize: s * 0.6, fontWeight: 900, color: v.color ?? INK, lineHeight: 1 }}>
        {v.angka ?? v.label ?? "?"}
      </span>
    );
  };
  if (n === 1)
    return (
      <span className={`inline-flex items-center justify-center ${className}`} style={{ minWidth: s, minHeight: s, ...style }}>
        {satu(0)}
      </span>
    );
  const cols = v.kolom ?? Math.ceil(Math.sqrt(n));
  return (
    <span className={`inline-grid place-items-center ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, auto)`, gap: Math.max(2, s * 0.06), minWidth: s, minHeight: s, ...style }}>
      {Array.from({ length: n }, (_, k) => satu(k))}
    </span>
  );
}

/** Kartu benda yang bisa disentuh/diseret: latar putih, bayangan tebal gaya Rumila. */
export function KartuBenda({
  v, size = 56, label, labelSize = 13, keterangan = true, selected, dim, wrong, right, onClick, style, draggable, onDragStart, onPointerDown, className = "",
}: {
  v: VisualSpec; size?: number; label?: string; labelSize?: number;
  /** tampilkan teks label di bawah gambar bila kartu bergambar (emoji/bentuk); false untuk kartu kecil di dalam rak/slot */
  keterangan?: boolean;
  selected?: boolean; dim?: boolean; wrong?: boolean; right?: boolean;
  onClick?: () => void; style?: CSSProperties; draggable?: boolean; onDragStart?: React.DragEventHandler; onPointerDown?: React.PointerEventHandler; className?: string;
}) {
  const ring = right ? "#22b573" : wrong ? "#ff5a6e" : selected ? "#0786eb" : "transparent";
  // Kartu bergambar: teks label tetap ditulis di bawahnya (tanpa ini kartu bernomor/berdeskripsi tampak kembar).
  // Kartu tanpa gambar sudah menampilkan labelnya sebagai teks besar di dalam Benda.
  const teks = label ?? (keterangan && (v.emoji || v.shape) && v.label && v.label !== v.angka ? v.label : undefined);
  return (
    <button
      type="button"
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onPointerDown={onPointerDown}
      className={`flex flex-col items-center justify-center gap-1 rounded-[18px] bg-white p-2 transition-transform active:scale-95 ${dim ? "opacity-40" : ""} ${className}`}
      style={{ boxShadow: `0 4px 0 rgba(11,37,69,.12), 0 0 0 3px ${ring}`, touchAction: "none", ...style }}
    >
      <Benda v={v} size={size} />
      {teks && (
        <span style={{ fontFamily: BALOO, fontSize: labelSize, fontWeight: 800, color: INK, lineHeight: 1.15, maxWidth: Math.max(96, size * 2.6), overflowWrap: "anywhere" }} className="text-center text-balance">
          {teks}
        </span>
      )}
    </button>
  );
}
