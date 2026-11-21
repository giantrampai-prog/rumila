"use client";

// Wadah tujuan seret berbentuk benda sesuai dunia (keranjang di pasar, pot di kebun, peti di laut, dst.),
// menggantikan kotak pucat yang sama di semua soal. Dipakai bin pilah, rak urutkan, dan presenter lain.

import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import type { BentukWadah } from "@/lib/akademi/tema-dunia";
import { usePanggung } from "./dunia";
import { BALOO } from "./jenis";

function badan(bentuk: BentukWadah, w: string, g: string): CSSProperties {
  switch (bentuk) {
    case "keranjang":
      return {
        borderRadius: "16px 16px 40px 40px",
        background: `repeating-linear-gradient(90deg,rgba(0,0,0,.09) 0 3px,transparent 3px 18px), repeating-linear-gradient(0deg,${w} 0 11px,${g}33 11px 22px), ${w}`,
        boxShadow: `inset 0 10px 0 ${g}, 0 6px 0 ${g}`,
      };
    case "pot":
      return {
        borderRadius: "10px 10px 46% 46% / 10px 10px 26% 26%",
        background: `linear-gradient(180deg,${g} 0 14px,${w} 14px)`,
        boxShadow: `inset -14px 0 0 rgba(0,0,0,.08), 0 6px 0 ${g}`,
      };
    case "ember":
      return {
        borderRadius: "12px 12px 30px 30px",
        background: `linear-gradient(90deg,rgba(255,255,255,.28) 0 14%,transparent 14%), linear-gradient(180deg,${w},${w})`,
        boxShadow: `inset 0 8px 0 ${g}, 0 6px 0 ${g}`,
      };
    case "peti":
      return {
        borderRadius: "18px 18px 10px 10px",
        background: `linear-gradient(90deg,transparent 0 14%,#f2c230 14% 18%,transparent 18% 82%,#f2c230 82% 86%,transparent 86%), linear-gradient(180deg,${g} 0 12px,${w} 12px)`,
        boxShadow: `0 6px 0 ${g}`,
      };
    case "laci":
      return {
        borderRadius: 14,
        background: `linear-gradient(180deg,rgba(255,255,255,.18),transparent 40%), ${w}`,
        boxShadow: `inset 0 0 0 6px ${g}55, 0 6px 0 ${g}`,
      };
    case "papan":
      return {
        borderRadius: 16,
        background: `repeating-linear-gradient(0deg,rgba(0,0,0,.06) 0 2px,transparent 2px 26px), ${w}`,
        boxShadow: `0 6px 0 ${g}`,
      };
    case "kapsul":
      return {
        borderRadius: 28,
        background: `linear-gradient(160deg,rgba(255,255,255,.45) 0 18%,transparent 34%), ${w}`,
        boxShadow: `0 6px 0 ${g}`,
      };
    case "sarang":
      return {
        borderRadius: "22px 22px 50% 50% / 22px 22px 34% 34%",
        background: `repeating-linear-gradient(35deg,rgba(0,0,0,.14) 0 3px,transparent 3px 10px), repeating-linear-gradient(-35deg,rgba(255,255,255,.12) 0 3px,transparent 3px 12px), ${w}`,
        boxShadow: `0 6px 0 ${g}`,
      };
    case "kotak-mainan":
      return {
        borderRadius: 16,
        background: `repeating-linear-gradient(135deg,rgba(255,255,255,.22) 0 14px,transparent 14px 28px), ${w}`,
        boxShadow: `inset 0 10px 0 ${g}, 0 6px 0 ${g}`,
      };
    case "kotak":
    default:
      return {
        borderRadius: 14,
        background: `linear-gradient(180deg,${g} 0 10px,${w} 10px)`,
        boxShadow: `0 6px 0 ${g}`,
      };
  }
}

export interface WadahProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** gambar + nama wadah (mis. ikon mata + "mata") */
  label: ReactNode;
  /** isi yang sudah ditaruh */
  children?: ReactNode;
  /** warna cincin sorot (hover/benar/petunjuk); transparan bila kosong */
  ring?: string;
  /** latar isi hijau saat semua isinya benar */
  hijau?: boolean;
  /** tinggi minimum area isi (px, sebelum skala) */
  minIsi?: number;
}

/** Wadah bertema dunia: label di atas, area isi terang di dalam badan wadah. */
export const Wadah = forwardRef<HTMLDivElement, WadahProps>(function Wadah({ label, children, ring, hijau, minIsi = 56, className = "", style, ...rest }, ref) {
  const { tema, skala } = usePanggung();
  const b = badan(tema.wadah, tema.wadahWarna, tema.wadahGelap);
  return (
    <div
      ref={ref}
      {...rest}
      className={`relative flex flex-col p-2 transition-transform ${className}`}
      style={{ ...b, boxShadow: `${b.boxShadow}${ring && ring !== "transparent" ? `, 0 0 0 4px ${ring}` : ""}`, padding: `${10 * skala}px ${12 * skala}px ${16 * skala}px`, gap: 8 * skala, ...style }}
    >
      <div className="flex items-center justify-center gap-2 self-center rounded-full bg-white/95 px-3 py-1 shadow-[0_3px_0_rgba(0,0,0,.12)]" style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 16 * skala, lineHeight: 1.1, maxWidth: "100%" }}>
        {label}
      </div>
      <div
        className="flex flex-1 flex-wrap content-center items-center justify-center gap-1 rounded-[14px] px-1.5 py-1"
        style={{ minHeight: minIsi * skala, background: hijau ? "rgba(230,248,239,.92)" : "rgba(255,255,255,.34)", boxShadow: "inset 0 4px 10px rgba(0,0,0,.14)" }}
      >
        {children}
      </div>
    </div>
  );
});
