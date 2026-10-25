"use client";

// Dunia 2D "Kebun & Pasar": latar semua aktivitas Slice 1. Langit → kebun → lapak pasar, digambar CSS + emoji.
// Satu komponen latar + kerangka layar aktivitas (header kembali, progres ronde, tombol dengar instruksi).

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import { diamkan } from "@/lib/akademi/suara";
import { BALOO, INK, NUNITO } from "./jenis";

export function LatarKebunPasar() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ background: "linear-gradient(180deg,#bfe9ff 0%,#e9f7ff 38%,#d8f3c4 60%,#b6e39a 100%)" }}>
      <div className="absolute top-[6%] left-[8%] text-[64px] opacity-90" style={{ filter: "drop-shadow(0 6px 0 rgba(0,0,0,.05))" }}>☀️</div>
      <div className="absolute top-[12%] right-[10%] text-[48px] opacity-80">☁️</div>
      <div className="absolute top-[22%] left-[32%] text-[36px] opacity-70">☁️</div>
      <div className="absolute bottom-[26%] left-[-10px] text-[96px] opacity-90">🌳</div>
      <div className="absolute bottom-[28%] right-[-6px] text-[84px] opacity-90">🌳</div>
      <div className="absolute bottom-[23%] left-[22%] text-[40px]">🌻</div>
      <div className="absolute bottom-[22%] right-[26%] text-[36px]">🌷</div>
      {/* lapak pasar */}
      <div className="absolute inset-x-0 bottom-0 h-[22%]" style={{ background: "linear-gradient(180deg,#9ed07c,#7fbf63)" }} />
      <div className="absolute inset-x-[6%] bottom-[18%] h-5 rounded-t-[10px]" style={{ background: "repeating-linear-gradient(90deg,#fd861d 0 28px,#ffd23f 28px 56px)" }} />
    </div>
  );
}

/** Kerangka layar aktivitas: kembali · judul & progres · instruksi (bisa diputar ulang) · isi. */
export function LayarAktivitas({
  judul, ronde, total, instruksi, onUcap, children, kembaliKe = "/akademi",
}: {
  judul: string; ronde: number; total: number; instruksi: string; onUcap: () => void; children: ReactNode; kembaliKe?: string;
}) {
  const router = useRouter();
  // Tombol kembali: hentikan suara dulu (ketukan pertama di HP bisa membuka ucapan yang tertahan),
  // lalu kembali lewat riwayat bila datang dari aplikasi ini (instan dari cache), selain itu ke kembaliKe.
  const kembali = () => {
    diamkan();
    const dariSini = typeof document !== "undefined" && document.referrer.startsWith(location.origin);
    if (dariSini && window.history.length > 1) router.back();
    else router.push(kembaliKe);
  };
  return (
    <div className="relative min-h-dvh" style={{ fontFamily: NUNITO, color: INK }}>
      <LatarKebunPasar />
      <div
        className="relative mx-auto flex max-w-[960px] flex-col gap-3 px-3 sm:px-5"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))", paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-center gap-2">
          <button type="button" onClick={kembali} aria-label="Kembali" className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-white text-[#0567c2] shadow-[0_4px_0_rgba(11,37,69,.12)] active:scale-95">
            <Icon name="arrow_back" size={24} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{judul}</div>
            <div className="mt-1 flex gap-1" aria-label={`Ronde ${ronde} dari ${total}`}>
              {Array.from({ length: total }, (_, k) => (
                <span key={k} className="h-2 flex-1 rounded-full" style={{ background: k < ronde ? "#fd861d" : "rgba(11,37,69,.15)" }} />
              ))}
            </div>
          </div>
        </header>
        <button
          onClick={onUcap}
          className="flex items-center gap-3 rounded-[20px] bg-white px-3 py-2.5 text-left shadow-[0_4px_0_rgba(11,37,69,.1)] active:scale-[.99]"
          aria-label="Dengarkan instruksi"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ffd23f] text-[#0b2545]">
            <Icon name="volume_up" size={22} />
          </span>
          <span style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{instruksi}</span>
        </button>
        {children}
      </div>
    </div>
  );
}

/** Stiker umpan balik besar di tengah layar (benar / coba lagi). */
export function UmpanBalik({ benar }: { benar: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
      <div
        className="akademi-pop flex flex-col items-center rounded-[28px] px-8 py-5 text-white"
        style={{ background: benar ? "#22b573" : "#ff5a6e", boxShadow: `0 6px 0 ${benar ? "#16804f" : "#c0334a"}` }}
      >
        <span style={{ fontSize: 64, lineHeight: 1 }}>{benar ? "🌟" : "💪"}</span>
        <span style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 900 }}>{benar ? "Hebat!" : "Coba lagi, ya"}</span>
      </div>
    </div>
  );
}
