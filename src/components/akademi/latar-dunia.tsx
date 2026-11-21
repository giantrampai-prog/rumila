"use client";

// Latar 10 dunia Academy, digambar CSS + emoji (tanpa aset). Hiasan ditaruh di tepi dan dibuat tenang
// supaya area tengah tetap terbaca; tiap dunia punya siluet khas (tenda pasar, bedeng, lapisan laut, dst.).

import type { CSSProperties, ReactNode } from "react";
import type { DuniaId } from "@/lib/akademi/tema-dunia";

const isi: CSSProperties = { position: "absolute", inset: 0 };

function Hias({ e, s, style }: { e: string; s: number; style: CSSProperties }) {
  return <span className="absolute select-none" style={{ fontSize: s, lineHeight: 1, opacity: 0.55, ...style }}>{e}</span>;
}

const LATAR: Record<DuniaId, () => ReactNode> = {
  pasar: () => (
    <>
      <div style={{ ...isi, background: "linear-gradient(180deg,#ffe8c4 0%,#ffd7a1 62%,#e7a96b 62.2%,#d48f56 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-[38%]" style={{ background: "repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 2px,transparent 2px 120px)" }} />
      <Hias e="🧺" s={64} style={{ left: 10, bottom: "30%" }} />
      <Hias e="🍉" s={52} style={{ right: 14, bottom: "31%" }} />
      <Hias e="🏮" s={40} style={{ left: 10, top: "42%" }} />
      <Hias e="🏮" s={40} style={{ right: 10, top: "42%" }} />
    </>
  ),
  kebun: () => (
    <>
      <div style={{ ...isi, background: "linear-gradient(180deg,#bfe9ff 0%,#e8f7ff 34%,#a7da80 34.2%,#8cc767 100%)" }} />
      <div className="absolute right-[10px] top-[34%] size-14 rounded-full" style={{ background: "#ffd23f", boxShadow: "0 0 0 18px rgba(255,210,63,.3)" }} />
      <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: "repeating-linear-gradient(0deg,#7a4f2e 0 22px,#6a4326 22px 44px)", opacity: 0.35 }} />
      <Hias e="🌻" s={60} style={{ left: 8, bottom: "28%" }} />
      <Hias e="🌽" s={54} style={{ right: 10, bottom: "29%" }} />
      <Hias e="🦋" s={34} style={{ right: 12, top: "40%" }} />
      <Hias e="☁️" s={52} style={{ left: 8, top: "38%" }} />
    </>
  ),
  laut: () => (
    <>
      <div style={{ ...isi, background: "linear-gradient(180deg,#8fd8ff 0%,#4fb6e8 26%,#1f6fb0 55%,#123f7a 80%,#0a1f45 100%)" }} />
      <div style={{ ...isi, background: "radial-gradient(ellipse 60% 30% at 50% -5%,rgba(255,255,255,.45),transparent 70%)" }} />
      <Hias e="🪸" s={70} style={{ left: 4, bottom: 0 }} />
      <Hias e="🪸" s={56} style={{ right: 8, bottom: 0 }} />
      <Hias e="🐠" s={34} style={{ right: "9%", top: "30%" }} />
      <Hias e="🫧" s={30} style={{ left: "7%", top: "40%" }} />
      <Hias e="🐙" s={40} style={{ left: "4%", bottom: "26%" }} />
    </>
  ),
  pantai: () => (
    <>
      <div style={{ ...isi, background: "linear-gradient(180deg,#9fe3ff 0%,#d8f4ff 36%,#4cc3d9 36.2%,#2ab0c9 52%,#f6dfa4 52.2%,#efcf87 100%)" }} />
      <div className="absolute inset-x-0" style={{ top: "51%", height: 14, background: "radial-gradient(circle at 20px 0,#ffffff 12px,transparent 13px) 0 0/40px 14px repeat-x", opacity: 0.8 }} />
      <Hias e="⛱️" s={64} style={{ left: 10, bottom: "8%" }} />
      <Hias e="🐚" s={34} style={{ right: 18, bottom: "6%" }} />
      <Hias e="⛵" s={44} style={{ right: "9%", top: "26%" }} />
      <Hias e="☀️" s={50} style={{ left: 8, top: "36%" }} />
    </>
  ),
  kelas: () => (
    <>
      <div style={{ ...isi, background: "linear-gradient(180deg,#fdf6e8 0%,#f9ecd2 68%,#d9b98c 68.2%,#c9a473 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-[32%]" style={{ background: "repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 3px,transparent 3px 90px)" }} />
      <Hias e="📚" s={54} style={{ left: 10, bottom: "30%" }} />
      <Hias e="🌍" s={48} style={{ right: 14, bottom: "31%" }} />
      <Hias e="✏️" s={34} style={{ left: 10, top: "40%" }} />
      <Hias e="🕒" s={36} style={{ right: 10, top: "40%" }} />
    </>
  ),
  rumah: () => (
    <>
      <div style={{ ...isi, background: "linear-gradient(180deg,#fff1e6 0%,#ffe4d1 66%,#d9a27a 66.2%,#c98d63 100%)" }} />
      <div style={{ ...isi, bottom: "34%", background: "repeating-linear-gradient(90deg,rgba(224,115,90,.08) 0 26px,transparent 26px 52px)" }} />
      <div className="absolute left-[10px] top-[38%] h-[90px] w-[70px] rounded-[10px]" style={{ background: "#bfe9ff", boxShadow: "0 0 0 8px #fff, 0 0 0 10px #e7c9b4" }} />
      <Hias e="🪴" s={58} style={{ right: 12, bottom: "32%" }} />
      <Hias e="🛋️" s={56} style={{ left: 8, bottom: "31%" }} />
      <Hias e="🖼️" s={40} style={{ right: 10, top: "40%" }} />
    </>
  ),
  kota: () => (
    <>
      <div style={{ ...isi, background: "linear-gradient(180deg,#cfe6ff 0%,#eef6ff 48%,#9aa6b8 48.2%,#8793a6 100%)" }} />
      <div className="absolute inset-x-0" style={{ top: "34%", height: "14.4%", background: "linear-gradient(90deg,#9fb6d9 0 9%,transparent 9% 11%,#b7c8e6 11% 18%,transparent 18% 82%,#b7c8e6 82% 89%,transparent 89% 91%,#9fb6d9 91%)" }} />
      <div className="absolute inset-x-0 h-[6px]" style={{ top: "73%", background: "repeating-linear-gradient(90deg,#ffffff 0 40px,transparent 40px 80px)", opacity: 0.7 }} />
      <Hias e="🚦" s={48} style={{ left: 10, bottom: "50%" }} />
      <Hias e="🏢" s={56} style={{ right: 10, bottom: "51%" }} />
      <Hias e="🚌" s={40} style={{ left: "5%", bottom: "6%" }} />
    </>
  ),
  hutan: () => (
    <>
      <div style={{ ...isi, background: "linear-gradient(180deg,#a8dcc0 0%,#5fae7d 45%,#2f7a52 72%,#1d5a3a 100%)" }} />
      <div className="absolute inset-x-0 top-0 h-[70px]" style={{ background: "radial-gradient(circle at 40px 0,#2f7a52 46px,transparent 47px) 0 0/80px 70px repeat-x", opacity: 0.3 }} />
      <Hias e="🌳" s={84} style={{ left: -14, bottom: "12%" }} />
      <Hias e="🌲" s={76} style={{ right: -10, bottom: "14%" }} />
      <Hias e="🍄" s={34} style={{ left: "6%", bottom: 10 }} />
      <Hias e="🐒" s={36} style={{ right: "7%", top: "22%" }} />
    </>
  ),
  angkasa: () => (
    <>
      <div style={{ ...isi, background: "radial-gradient(ellipse at 30% 20%,#3a2f7a 0%,#1b1748 45%,#0b0a24 100%)" }} />
      <div style={{ ...isi, backgroundImage: "radial-gradient(1.6px 1.6px at 20px 30px,#fff,transparent),radial-gradient(1.2px 1.2px at 90px 80px,#fff,transparent),radial-gradient(2px 2px at 160px 40px,#ffe9a8,transparent),radial-gradient(1.2px 1.2px at 230px 120px,#fff,transparent)", backgroundSize: "260px 160px", opacity: 0.8 }} />
      <Hias e="🪐" s={70} style={{ right: 12, top: "18%" }} />
      <Hias e="🌙" s={46} style={{ left: 10, top: "38%" }} />
      <Hias e="🚀" s={46} style={{ left: "5%", bottom: "8%" }} />
      <Hias e="✨" s={32} style={{ right: "8%", bottom: "10%" }} />
    </>
  ),
  taman: () => (
    <>
      <div style={{ ...isi, background: "linear-gradient(180deg,#b9e4ff 0%,#eaf7ff 40%,#bfe58f 40.2%,#a3d46f 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-[24%]" style={{ background: "radial-gradient(circle at 30px 0,#94c95f 30px,transparent 31px) 0 0/60px 40px repeat-x", opacity: 0.7 }} />
      <Hias e="🎈" s={44} style={{ left: 8, top: "38%" }} />
      <Hias e="🛝" s={60} style={{ right: 10, bottom: "22%" }} />
      <Hias e="🌳" s={70} style={{ left: -10, bottom: "20%" }} />
      <Hias e="🪁" s={40} style={{ right: 10, top: "38%" }} />
    </>
  ),
};

/** Latar dunia. Bawaan: fixed di belakang layar aktivitas; `isi`: mengisi kotak induknya (mis. pulau modul di peta). */
export function LatarDunia({ dunia, isi: dalamKotak = false }: { dunia: DuniaId; isi?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none ${dalamKotak ? "absolute" : "fixed"} inset-0 overflow-hidden`} data-dunia={dunia}>
      {LATAR[dunia]()}
    </div>
  );
}
