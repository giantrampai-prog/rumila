"use client";

// Animasi pembuka RINOYA Academy: tampil sekali per sesi browser saat website pertama dibuka.
// Logo dipecah jadi 5 lapisan (public/brand/intro): ikon R naik ("Rise"), bintang berkelip,
// RINO lalu YA memantul masuk, ACADEMY terbuka dari tengah, lalu bilah progres biru.
// Markup ikut SSR agar animasi jalan sebelum hidrasi; skrip di <head> (INTRO_SKRIP) menyembunyikannya
// bila sesi ini sudah pernah melihat intro.

import { useEffect, useState } from "react";
import "./intro.css";

const KUNCI = "rinoya-intro";
const DURASI = 2700;
const DURASI_RINGKAS = 900;

/** Dipasang di <head>: tandai <html> sebelum paint bila intro sudah tampil di sesi ini. */
export const INTRO_SKRIP = `try{if(sessionStorage.getItem("${KUNCI}"))document.documentElement.classList.add("intro-selesai")}catch(e){}`;

// Posisi tiap lapisan dalam bingkai logo (persen), diukur dari logo asli 1144×806.
const LAPIS = {
  mark: { left: 27.88, top: 0.12, width: 39.69 },
  star: { left: 63.11, top: 8.93, width: 13.29 },
  rino: { left: 0.09, top: 59.18, width: 65.73 },
  ya: { left: 64.77, top: 59.55, width: 35.23 },
  academy: { left: 16.17, top: 90.2, width: 67.31 },
} as const;

export function IntroRinoya() {
  const [tahap, setTahap] = useState<"main" | "keluar" | "selesai">("main");

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-selesai")) {
      setTahap("selesai");
      return;
    }
    try {
      sessionStorage.setItem(KUNCI, "1");
    } catch {}
    const ringkas = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setTahap("keluar"), ringkas ? DURASI_RINGKAS : DURASI);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (tahap !== "keluar") return;
    const t = window.setTimeout(() => setTahap("selesai"), 480);
    return () => window.clearTimeout(t);
  }, [tahap]);

  if (tahap === "selesai") return null;

  const gaya = (k: keyof typeof LAPIS) => ({ left: `${LAPIS[k].left}%`, top: `${LAPIS[k].top}%`, width: `${LAPIS[k].width}%` });

  return (
    <div
      className={`rn-intro${tahap === "keluar" ? " rn-intro--keluar" : ""}`}
      role="presentation"
      onClick={() => setTahap("keluar")}
    >
      <div className="rn-intro__isi">
        <div className="rn-intro__logo" role="img" aria-label="RINOYA Academy">
          <span className="rn-intro__cahaya" aria-hidden />
          {/* eslint-disable @next/next/no-img-element -- lapisan logo harus tampil sebelum hidrasi */}
          <img src="/brand/intro/mark.png" alt="" className="rn-intro__lapis rn-intro__mark" style={gaya("mark")} />
          <img src="/brand/intro/rino.png" alt="" className="rn-intro__lapis rn-intro__rino" style={gaya("rino")} />
          <img src="/brand/intro/ya.png" alt="" className="rn-intro__lapis rn-intro__ya" style={gaya("ya")} />
          <img src="/brand/intro/academy.png" alt="" className="rn-intro__lapis rn-intro__academy" style={gaya("academy")} />
          <img src="/brand/intro/star.png" alt="" className="rn-intro__lapis rn-intro__star" style={gaya("star")} />
          {[0, 1, 2].map((i) => (
            <img key={i} src="/brand/intro/star.png" alt="" className={`rn-intro__lapis rn-intro__percik rn-intro__percik--${i}`} style={gaya("star")} />
          ))}
          {/* eslint-enable @next/next/no-img-element */}
        </div>
        <p className="rn-intro__tagline">Rise Into Your Own Adventure</p>
        <span className="rn-intro__bilah" aria-hidden>
          <span />
        </span>
      </div>
      <button type="button" className="rn-intro__lewati" onClick={() => setTahap("keluar")}>
        Lewati
      </button>
    </div>
  );
}
