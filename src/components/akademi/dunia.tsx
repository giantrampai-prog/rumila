"use client";

// Dunia 2D "Kebun & Pasar": latar semua aktivitas Slice 1. Langit → kebun → lapak pasar, digambar CSS + emoji.
// Satu komponen latar + kerangka layar aktivitas (header kembali, progres ronde, tombol dengar instruksi).

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { TEMA, type BentukWadah, type DuniaId, type Tema } from "@/lib/akademi/tema-dunia";
import { LatarDunia } from "./latar-dunia";
import { Icon } from "@/components/ui";
import { diamkan } from "@/lib/akademi/suara";
import { PUJIAN, PUJIAN_BERUNTUN, SEMANGAT, acakKata } from "@/lib/sfx-akademi";
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
export interface Panggung { tema: Tema; w: number; h: number; skala: number; /** emoji petak rintangan soal robot */ rintangan: string }
const PanggungCtx = createContext<Panggung>({ tema: TEMA.kebun, w: 0, h: 0, skala: 1, rintangan: "🌳" });
export const usePanggung = () => useContext(PanggungCtx);

/** Skala isi dari ukuran panggung; patokan desain ±880×500 px. */
export function skalaPanggung(w: number, h: number): number {
  if (!w || !h) return 1;
  return Math.round(Math.max(1, Math.min(1.6, w / 880, h / 500)) * 100) / 100;
}

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function LayarAktivitas({
  judul, ronde, total, instruksi, onUcap, children, kembaliKe = "/akademi", dunia = "kebun", wadah, rintangan = "🌳", musik,
}: {
  judul: string; ronde: number; total: number; instruksi: string; onUcap: () => void; children: ReactNode; kembaliKe?: string; dunia?: DuniaId;
  /** bentuk wadah yang disebut paket (mis. "rak"); kosong = bawaan dunia */
  wadah?: BentukWadah;
  /** emoji rintangan soal robot (mis. 🗄️ bila soal menyebut rak) */
  rintangan?: string;
  /** backsound: tombol musik nyala/mati di kepala layar (kosong = tanpa tombol, mis. ujian) */
  musik?: { nyala: boolean; alih: () => void };
}) {
  const router = useRouter();
  useSkalaTablet();
  const tema = wadah ? { ...TEMA[dunia], wadah } : TEMA[dunia];
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
  const panggung: Panggung = { tema, w: ukuran.w, h: ukuran.h, skala: skalaPanggung(ukuran.w, ukuran.h), rintangan };
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
          {musik && (
            <button
              type="button"
              onClick={musik.alih}
              aria-label={musik.nyala ? "Matikan musik" : "Nyalakan musik"}
              aria-pressed={musik.nyala}
              className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-white shadow-[0_4px_0_rgba(11,37,69,.12)] active:scale-95"
              style={{ color: musik.nyala ? "#e06d00" : "#5e5548" }}
            >
              <Icon name={musik.nyala ? "music_note" : "music_off"} size={24} />
            </button>
          )}
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
const WARNA_KONFETI = ["#ffd23f", "#fd861d", "#22b573", "#0786eb", "#ff5a6e", "#b197fc"];

/** Ledakan konfeti kecil dari tengah layar (posisi & warna acak, dibuat sekali per tampil). */
function Konfeti({ jumlah }: { jumlah: number }) {
  const [potong] = useState(() =>
    Array.from({ length: jumlah }, (_, i) => {
      const sudut = (i / jumlah) * Math.PI * 2 + Math.random() * 0.4;
      const jauh = 120 + Math.random() * 160;
      return { dx: Math.cos(sudut) * jauh, dy: Math.sin(sudut) * jauh - 60, r: Math.random() * 540 - 270, w: 7 + Math.random() * 7, h: 10 + Math.random() * 8, warna: WARNA_KONFETI[i % WARNA_KONFETI.length], t: 750 + Math.random() * 450 };
    }),
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {potong.map((p, i) => (
        <span key={i} className="akademi-konfeti" style={{ width: p.w, height: p.h, background: p.warna, ["--dx" as string]: `${p.dx}px`, ["--dy" as string]: `${p.dy}px`, ["--r" as string]: `${p.r}deg`, ["--t" as string]: `${p.t}ms` } as React.CSSProperties} />
      ))}
    </div>
  );
}

/** Umpan balik setelah menjawab: pujian/penyemangat diacak, konfeti saat benar (lebih meriah bila beruntun). */
/** Salah → ajakan coba lagi (soal diulang sampai benar); mulai salah kedua (`pakaiBantu`) → arahkan ke tombol Bantu. */
export function UmpanBalik({ benar, beruntun = 1, pakaiBantu: lanjut = false }: { benar: boolean; beruntun?: number; pakaiBantu?: boolean }) {
  const [teks] = useState(() => (benar ? acakKata(beruntun >= 3 ? PUJIAN_BERUNTUN : PUJIAN) : lanjut ? "Coba lagi, pakai Bantu ya" : acakKata(SEMANGAT)));
  const [ikon] = useState(() => (benar ? acakKata(beruntun >= 3 ? ["🔥", "🏆", "🚀"] : ["🌟", "⭐", "🎉", "👏", "😄"]) : lanjut ? "💡" : acakKata(["💪", "🙂", "🤔"])));
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
      {benar && <Konfeti jumlah={beruntun >= 3 ? 34 : 20} />}
      <div
        className="akademi-pop flex flex-col items-center rounded-[28px] px-8 py-5 text-white"
        style={{ background: benar ? "#22b573" : lanjut ? "#e0a100" : "#ff8a5c", boxShadow: `0 6px 0 ${benar ? "#16804f" : lanjut ? "#a87600" : "#d4622f"}` }}
      >
        <span className={benar ? "akademi-bintang" : "akademi-goyang"} style={{ fontSize: 64, lineHeight: 1, display: "inline-block" }}>{ikon}</span>
        <span style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 900 }}>{teks}</span>
        {benar && beruntun >= 3 && <span style={{ fontFamily: BALOO, fontSize: 15, fontWeight: 800, opacity: 0.9 }}>{beruntun} benar berturut-turut</span>}
      </div>
    </div>
  );
}

/** Hujan konfeti dari atas (layar selesai). */
export function HujanKonfeti({ jumlah = 40 }: { jumlah?: number }) {
  const [potong] = useState(() =>
    Array.from({ length: jumlah }, (_, i) => ({ x: Math.random() * 100, dx: Math.random() * 120 - 60, r: Math.random() * 720 - 360, w: 7 + Math.random() * 7, h: 10 + Math.random() * 9, warna: WARNA_KONFETI[i % WARNA_KONFETI.length], t: 2.2 + Math.random() * 1.6, d: Math.random() * 1.2 })),
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {potong.map((p, i) => (
        <span key={i} className="akademi-hujan" style={{ left: `${p.x}%`, width: p.w, height: p.h, background: p.warna, ["--dx" as string]: `${p.dx}px`, ["--r" as string]: `${p.r}deg`, ["--t" as string]: `${p.t}s`, ["--d" as string]: `${p.d}s` } as React.CSSProperties} />
      ))}
    </div>
  );
}
