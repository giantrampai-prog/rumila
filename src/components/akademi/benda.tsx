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
  shape?: "circle" | "square" | "triangle" | "rect" | "star" | "berudu";
  width?: number;
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

function Bentuk({ shape, color, size, width = 1 }: { shape: NonNullable<VisualSpec["shape"]>; color: string; size: number; width?: number }) {
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
      const font = n > 1 ? Math.max(18, s / Math.ceil(Math.sqrt(n)) * 0.9) : s * 0.86;
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
    if (v.shape) return <Bentuk key={k} shape={v.shape} color={v.color ?? "#0786eb"} size={n > 1 ? Math.max(14, s / Math.ceil(Math.sqrt(n))) : s} width={v.width} />;
    return (
      <span key={k} style={{ fontFamily: BALOO, fontSize: s * 0.6, fontWeight: 900, color: v.color ?? INK, lineHeight: 1 }}>
        {v.label ?? "?"}
      </span>
    );
  };
  if (n === 1)
    return (
      <span className={`inline-flex items-center justify-center ${className}`} style={{ minWidth: s, minHeight: s, ...style }}>
        {satu(0)}
      </span>
    );
  const cols = Math.ceil(Math.sqrt(n));
  return (
    <span className={`inline-grid place-items-center ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, auto)`, gap: Math.max(2, s * 0.06), minWidth: s, minHeight: s, ...style }}>
      {Array.from({ length: n }, (_, k) => satu(k))}
    </span>
  );
}

/** Kartu benda yang bisa disentuh/diseret: latar putih, bayangan tebal gaya Rumila. */
export function KartuBenda({
  v, size = 56, label, labelSize = 13, selected, dim, wrong, right, onClick, style, draggable, onDragStart, onPointerDown, className = "",
}: {
  v: VisualSpec; size?: number; label?: string; labelSize?: number; selected?: boolean; dim?: boolean; wrong?: boolean; right?: boolean;
  onClick?: () => void; style?: CSSProperties; draggable?: boolean; onDragStart?: React.DragEventHandler; onPointerDown?: React.PointerEventHandler; className?: string;
}) {
  const ring = right ? "#22b573" : wrong ? "#ff5a6e" : selected ? "#0786eb" : "transparent";
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
      {label && (
        <span style={{ fontFamily: BALOO, fontSize: labelSize, fontWeight: 800, color: INK, lineHeight: 1.1 }} className="text-center">
          {label}
        </span>
      )}
    </button>
  );
}
