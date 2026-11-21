"use client";

// Dunia 2D "Kebun & Pasar": latar semua aktivitas Slice 1. Langit → kebun → lapak pasar, digambar CSS + emoji.
// Satu komponen latar + kerangka layar aktivitas (header kembali, progres ronde, tombol dengar instruksi).

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { TEMA, type DuniaId, type Tema } from "@/lib/akademi/tema-dunia";
import { LatarDunia } from "./latar-dunia";
import { Icon } from "@/components/ui";
import { diamkan } from "@/lib/akademi/suara";
import { BALOO, INK, NUNITO } from "./jenis";

/**
 * Tablet: layar permainan dirancang selebar HP–960 px, jadi di tablet besar (mis. 13", 1280×800) isinya kecil dan
 * banyak ruang kosong. Lebar viewport diatur ulang supaya peramban sendiri yang memperbesar halaman; koordinat
 * sentuh, drag, dan elemen fixed tetap konsisten (berbeda dengan CSS zoom/transform). HP dan desktop tidak berubah.
 */
export function viewportTablet(layar: { w: number; h: number }, landscape: boolean): string | null {
  const w = landscape ? Math.max(layar.w, layar.h) : Math.min(layar.w, layar.h);
  const h = landscape ? Math.min(layar.w, layar.h) : Math.max(layar.w, layar.h);
  if (Math.min(w, h) < 600) return null;
  // patokan desain: landscape ±900×620, potret ±720×900 CSS px
  const skala = landscape ? Math.min(w / 900, h / 620, 1.6) : Math.min(w / 720, h / 900, 1.6);
  if (skala <= 1.05) return null;
  const lebar = Math.round(w / skala);
  return `width=${lebar}, initial-scale=${(w / lebar).toFixed(3)}, viewport-fit=cover`;
}

function useSkalaTablet() {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!meta) return;
    const asli = meta.content;
    // ukuran layar fisik (CSS px); jendela awal dipakai bila screen.* lebih kecil (mis. WebView/emulator)
    const layar = { w: Math.max(window.screen.width, window.innerWidth), h: Math.max(window.screen.height, window.innerHeight) };
    const atur = () => {
      const isi = viewportTablet(layar, window.matchMedia("(orientation: landscape)").matches);
      meta.content = isi ?? asli;
    };
    atur();
    window.addEventListener("orientationchange", atur);
    return () => {
      window.removeEventListener("orientationchange", atur);
      meta.content = asli;
    };
  }, []);
}

/** Kerangka layar aktivitas: kembali · judul & progres · instruksi (bisa diputar ulang) · isi. */
/**
 * Panggung = area isi di bawah instruksi. Presenter membaca ukurannya untuk membesarkan kartu/wadah di layar lebar
 * dan tema untuk bentuk wadah. `skala` 1 di HP, naik sampai 1,6 di tablet/desktop yang luas.
 */
export interface Panggung { tema: Tema; w: number; h: number; skala: number }
const PanggungCtx = createContext<Panggung>({ tema: TEMA.kebun, w: 0, h: 0, skala: 1 });
export const usePanggung = () => useContext(PanggungCtx);

/** Skala isi dari ukuran panggung; patokan desain ±880×500 px. */
export function skalaPanggung(w: number, h: number): number {
  if (!w || !h) return 1;
  return Math.round(Math.max(1, Math.min(1.6, w / 880, h / 500)) * 100) / 100;
}

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function LayarAktivitas({
  judul, ronde, total, instruksi, onUcap, children, kembaliKe = "/akademi", dunia = "kebun",
}: {
  judul: string; ronde: number; total: number; instruksi: string; onUcap: () => void; children: ReactNode; kembaliKe?: string; dunia?: DuniaId;
}) {
  const router = useRouter();
  useSkalaTablet();
  const tema = TEMA[dunia];
  const panggungRef = useRef<HTMLDivElement>(null);
  const [ukuran, setUkuran] = useState({ w: 0, h: 0 });
  useIsoLayout(() => {
    const el = panggungRef.current;
    if (!el) return;
    const ukur = () => setUkuran((u) => (u.w === el.clientWidth && u.h === el.clientHeight ? u : { w: el.clientWidth, h: el.clientHeight }));
    ukur();
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const panggung: Panggung = { tema, w: ukuran.w, h: ukuran.h, skala: skalaPanggung(ukuran.w, ukuran.h) };
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
      <LatarDunia dunia={dunia} />
      <div
        className="relative mx-auto flex h-dvh max-w-[1280px] flex-col gap-3 px-3 sm:px-6"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))", paddingBottom: "max(14px, env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-center gap-2">
          <button type="button" onClick={kembali} aria-label="Kembali" className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-white text-[#0567c2] shadow-[0_4px_0_rgba(11,37,69,.12)] active:scale-95">
            <Icon name="arrow_back" size={24} />
          </button>
          <div className="min-w-0 flex-1 rounded-[16px] px-3 py-1.5" style={{ background: "rgba(255,255,255,.94)", boxShadow: "0 3px 0 rgba(11,37,69,.08)" }}>
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
        {/* panggung: mengisi sisa tinggi layar; presenter yang sudah "penuh layar" memakai flex-1, sisanya ditengahkan */}
        <div ref={panggungRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden" data-panggung>
          <PanggungCtx.Provider value={panggung}>{children}</PanggungCtx.Provider>
        </div>
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
