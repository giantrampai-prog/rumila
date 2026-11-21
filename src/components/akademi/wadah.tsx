"use client";

// Wadah tujuan seret berbentuk benda sesuai dunia (keranjang di pasar, pot di kebun, peti di laut, dst.),
// menggantikan kotak pucat yang sama di semua soal. Dipakai bin pilah, rak urutkan, dan presenter lain.

import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import type { BentukWadah } from "@/lib/akademi/tema-dunia";
import { usePanggung } from "./dunia";
import { BALOO, INK, NUNITO } from "./jenis";

/** "mamalia (berambut, menyusui)" → nama "mamalia" + ciri "berambut, menyusui"; tanpa kurung → ciri kosong. */
export function pecahLabel(teks: string): { nama: string; ciri?: string } {
  const m = /^(.+?)\s*\(([^()]+)\)\s*$/.exec(teks.trim());
  return m ? { nama: m[1], ciri: m[2] } : { nama: teks };
}

/** Isi label wadah: gambar kecil + nama tebal + ciri kecil di bawahnya. `rata` kiri untuk wadah baris. */
export function LabelWadah({ teks, gambar, rata = "tengah" }: { teks: string; gambar?: ReactNode; rata?: "tengah" | "kiri" }) {
  const { skala } = usePanggung();
  const { nama, ciri } = pecahLabel(teks);
  const kiri = rata === "kiri";
  return (
    <span className={`flex min-w-0 items-center gap-2 ${kiri ? "flex-row text-left" : "flex-col text-center"}`} style={{ gap: (kiri ? 8 : 2) * skala }}>
      {gambar && <span className="flex shrink-0 items-center justify-center">{gambar}</span>}
      <span className="flex min-w-0 flex-col" style={{ alignItems: kiri ? "flex-start" : "center" }}>
        <span style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 16.5 * skala, lineHeight: 1.1, color: INK, textWrap: "balance", overflowWrap: "break-word" }}>{nama}</span>
        {ciri && <span style={{ fontFamily: NUNITO, fontWeight: 700, fontSize: 12.5 * skala, lineHeight: 1.2, color: INK, opacity: 0.72, marginTop: 2, textWrap: "balance" }}>{ciri}</span>}
      </span>
    </span>
  );
}

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
    case "rak": {
      // rak selalu kayu (apa pun dunianya): rangka gelap dengan papan-papan melintang
      const [w, g] = ["#c9935a", "#7d5428"];
      return {
        borderRadius: 10,
        background: `repeating-linear-gradient(180deg,transparent 0 40px,${g} 40px 48px), ${w}`,
        boxShadow: `inset 8px 0 0 ${g}, inset -8px 0 0 ${g}, inset 0 8px 0 ${g}, 0 6px 0 ${g}`,
      };
    }
    case "kardus":
      return {
        borderRadius: 8,
        background: `linear-gradient(90deg,transparent 46%,rgba(0,0,0,.12) 46% 54%,transparent 54%), linear-gradient(180deg,${g}aa 0 12px,${w} 12px)`,
        boxShadow: `0 6px 0 ${g}`,
      };
    case "es":
      return {
        borderRadius: 22,
        background: `linear-gradient(150deg,rgba(255,255,255,.7) 0 16%,transparent 30%), ${w}`,
        boxShadow: `inset 0 0 0 4px rgba(255,255,255,.7), 0 6px 0 ${g}`,
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
  /** paksa bentuk wadah (mis. label menyebut "rak"); kosong = bentuk dari panggung */
  bentuk?: BentukWadah;
  /** "baris" = label di kiri, isi di kanan (HP dengan ≥ 3 wadah: kolom terlalu sempit untuk nama + ciri) */
  arah?: "kolom" | "baris";
}

/** Wadah bertema dunia: label di atas, area isi terang di dalam badan wadah. */
export const Wadah = forwardRef<HTMLDivElement, WadahProps>(function Wadah({ label, children, ring, hijau, minIsi = 56, bentuk, arah = "kolom", className = "", style, ...rest }, ref) {
  const { tema, skala } = usePanggung();
  const b = badan(bentuk ?? tema.wadah, tema.wadahWarna, tema.wadahGelap);
  const baris = arah === "baris";
  return (
    <div
      ref={ref}
      {...rest}
      className={`relative flex transition-transform ${baris ? "flex-row items-stretch" : "flex-col"} ${className}`}
      style={{
        ...b,
        // bentuk melengkung (keranjang, pot, sarang) dirancang tegak; versi baris memakai sudut membulat biasa
        ...(baris ? { borderRadius: 18 } : {}),
        boxShadow: `${b.boxShadow}${ring && ring !== "transparent" ? `, 0 0 0 4px ${ring}` : ""}`,
        padding: baris ? `${8 * skala}px ${8 * skala}px ${11 * skala}px` : `${10 * skala}px ${10 * skala}px ${16 * skala}px`,
        gap: 8 * skala,
        ...style,
      }}
    >
      <div
        className={`flex items-center rounded-[14px] bg-white px-2.5 py-1.5 text-[#0b2545] shadow-[0_3px_0_rgba(0,0,0,.12)] ${baris ? "w-[42%] max-w-[180px] shrink-0 justify-start" : "max-w-full justify-center self-center"}`}
        style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 16 * skala, lineHeight: 1.1 }}
      >
        {label}
      </div>
      <div
        className="flex min-w-0 flex-1 flex-wrap content-center items-center justify-center gap-1.5 rounded-[14px] px-1.5 py-1"
        style={{ minHeight: minIsi * skala, background: hijau ? "#e6f8ef" : "rgba(255,255,255,.88)", border: `2.5px dashed ${hijau ? "#22b573" : tema.wadahGelap}`, boxShadow: "inset 0 3px 8px rgba(0,0,0,.10)" }}
      >
        {children}
      </div>
    </div>
  );
});
