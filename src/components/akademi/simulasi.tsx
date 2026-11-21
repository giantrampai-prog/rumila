"use client";

// Presenter mekanik simulasi: tiga belas mode (jam-baca, jam-putar, timbangan, jengkal, kubus, turus, taksir, tombol, alat, bagi,
// menara, bantuan, telusur) lewat switch `ronde.mode` → sub-komponen. Presenter hanya menampilkan dan mengirim jawaban; kebenaran dinilai runner
// (nilaiSimulasi). Setelah `hasil` terisi interaksi dikunci dan jawaban benar ditunjukkan.

import { sfxAkademi } from "@/lib/sfx-akademi";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import type { PaketSimulasi } from "@akademi/schema";
import type { JawabanSimulasi, RondeSimulasi } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import { KALIMAT_SIMULASI as KS, kalimatSimulasi as ks } from "@/lib/akademi/kalimat-suara";
import { ucapkan } from "@/lib/akademi/suara";
import { sfx } from "@/lib/sfx";
import { Benda, KartuBenda, type VisualSpec } from "./benda";
import { usePanggung } from "./dunia";
import { TombolBantu } from "./bantu";
import { Wadah } from "./wadah";
import { BALOO, BENAR, INK, SALAH, type PresenterProps, bayangKartu } from "./jenis";

type Props = PresenterProps<RondeSimulasi, JawabanSimulasi, PaketSimulasi>;
type Item = PaketSimulasi["items"][number];

const UNGU = "#0786eb";
const KUNING = "#ffd23f";
const MERAH_JARUM = "#ff5a6e";
const BIRU_JARUM = "#3b82f6";

/* ---------------- kerangka bersama ---------------- */

const Tebal: CSSProperties = { fontFamily: BALOO, fontWeight: 900, color: INK };
const BAYANG = "0 4px 0 rgba(11,37,69,.12)";

/** Skala teks: ikut panggung tetapi tidak sebesar adegan supaya kalimat tidak terlipat. */
function useSkalaTeks() {
  const { skala } = usePanggung();
  return Math.min(skala, 1.35);
}

/** Panggung mendatar luas (tablet/desktop): adegan di kiri, kendali di kanan. */
function useSamping() {
  const { w, h } = usePanggung();
  return w >= 760 && w >= h * 1.25;
}

function visualItem(x: Item | undefined, label?: string): VisualSpec {
  if (!x) return { emoji: "❓", label };
  return { emoji: x.emoji, color: x.color, scale: x.scale, count: x.count, shape: x.shape, width: x.width, angka: x.angka, latar: x.latar, label };
}

/** Robot pemandu + balon kalimat (ketuk untuk dibacakan). */
function Instruksi({ teks, anak, hasil }: { teks: string; anak?: ReactNode; hasil: Props["hasil"] }) {
  const muka = hasil ? (hasil.benar ? "🤖✨" : "🤖💭") : "🤖";
  const st = useSkalaTeks();
  return (
    <div className="flex items-end gap-2">
      <div className={`shrink-0 ${hasil?.benar ? "akademi-bounce" : ""}`} style={{ fontSize: 52 * st, lineHeight: 1, filter: "drop-shadow(0 4px 0 rgba(11,37,69,.15))" }} aria-hidden>
        {muka}
      </div>
      <button
        type="button"
        onClick={() => { sfx.tap(); ucapkan(teks); }}
        aria-label={`Dengar: ${teks}`}
        className="relative min-h-14 flex-1 rounded-[20px] bg-white px-3 py-2 text-left active:scale-[.98]"
        style={{ boxShadow: BAYANG, color: INK }}
      >
        <span aria-hidden className="absolute bottom-4" style={{ left: -9, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderRight: "9px solid #fff" }} />
        <span className="absolute top-1.5 right-2" style={{ color: UNGU }}><Icon name="volume_up" size={Math.round(18 * st)} /></span>
        <div className="pr-6" style={{ ...Tebal, fontSize: 18 * st, lineHeight: 1.2 }}>{anak ?? teks}</div>
      </button>
    </div>
  );
}

/** Umpan balik setelah hasil: benar/salah + jawaban yang benar. */
function Umpan({ hasil, benar }: { hasil: Props["hasil"]; benar: ReactNode }) {
  const st = useSkalaTeks();
  if (!hasil) return null;
  return (
    <div className="akademi-pop flex items-center justify-center gap-2 rounded-[16px] px-3 py-2" style={{ background: hasil.benar ? "#e4f8ee" : "#ffe9ec", fontFamily: BALOO, fontWeight: 800, fontSize: 17 * st, color: hasil.benar ? "#11804f" : "#c0334a", boxShadow: `inset 0 0 0 2px ${hasil.benar ? BENAR : SALAH}` }} role="status">
      <Icon name={hasil.benar ? "check_circle" : "info"} size={Math.round(22 * st)} />
      <span>{hasil.benar ? "Benar! " : "Jawabannya: "}{benar}</span>
    </div>
  );
}

/** Papan/panggung tempat simulasi digambar: panel terang bertema dunia (tetap terang di dunia gelap), mengisi sisa panggung. */
function Papan({ children, style, className = "" }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  const { skala } = usePanggung();
  return (
    <div
      className={`relative flex flex-1 flex-col rounded-[24px] ${className}`}
      style={{ padding: 12 * skala, background: "#ffffff", boxShadow: bayangKartu(), ...style }}
    >
      {children}
    </div>
  );
}

/** Teks petunjuk di dalam papan: tinta penuh di atas pita terang supaya mudah dibaca. */
function Petunjuk({ children, className = "" }: { children: ReactNode; className?: string }) {
  const st = useSkalaTeks();
  return (
    <div className={`akademi-fade mx-auto rounded-[14px] bg-white px-3 py-1 text-center ${className}`} style={{ ...Tebal, fontSize: 15 * st, boxShadow: `inset 0 0 0 2px ${KUNING}` }}>
      {children}
    </div>
  );
}

/** Ukuran elemen (ResizeObserver). */
function useUkuran<T extends HTMLElement>(): [React.RefObject<T | null>, { w: number; h: number }] {
  const ref = useRef<T | null>(null);
  const [u, setU] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ukur = () => setU((p) => (p.w === el.clientWidth && p.h === el.clientHeight ? p : { w: el.clientWidth, h: el.clientHeight }));
    ukur();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, u];
}

/**
 * Wilayah adegan: mengisi sisa tinggi (flex-1) dan memberi ukurannya ke isi lewat render-prop.
 * Isi wajib dihitung ≤ ukuran wilayah (dikurangi sedikit) supaya tidak saling membesarkan; `min` = tinggi di HP.
 */
function Adegan({ min, children, className = "", style }: { min: number; children: (u: { w: number; h: number }) => ReactNode; className?: string; style?: CSSProperties }) {
  const [ref, u] = useUkuran<HTMLDivElement>();
  return (
    <div ref={ref} className={`relative flex w-full min-w-0 flex-1 flex-col items-center justify-center ${className}`} style={{ minHeight: min, ...style }}>
      {children({ w: u.w, h: Math.max(u.h, min) })}
    </div>
  );
}

/** Tata letak mode: instruksi di atas; adegan + kendali bertumpuk (HP) atau berdampingan (tablet mendatar). */
function Tata({ atas, adegan, kendali, samping: boleh = true, lebar = 0.36 }: { atas: ReactNode; adegan: ReactNode; kendali: ReactNode; samping?: boolean; lebar?: number }) {
  const { w, skala } = usePanggung();
  const samping = useSamping() && boleh;
  if (!samping) return <>{atas}{adegan}{kendali}</>;
  return (
    <>
      {atas}
      <div className="flex flex-1" style={{ gap: 14 * skala }}>
        <div className="flex min-w-0 flex-1 flex-col">{adegan}</div>
        <div className="flex shrink-0 flex-col justify-center" style={{ width: Math.round(Math.min(480, w * lebar)), gap: 12 * skala }}>{kendali}</div>
      </div>
    </>
  );
}

function TombolBesar({ children, onClick, disabled, warna = "#22b573", bayang = "#16804f", className = "" }: { children: ReactNode; onClick: () => void; disabled?: boolean; warna?: string; bayang?: string; className?: string }) {
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-16 flex-1 items-center justify-center gap-2 rounded-[20px] px-4 text-white transition-transform active:translate-y-1 disabled:opacity-50 ${className}`}
      style={{ minHeight: 64 * skala, background: warna, boxShadow: `0 5px 0 ${bayang}`, fontFamily: BALOO, fontWeight: 900, fontSize: 20 * st }}
    >
      {children}
    </button>
  );
}

/** Tombol bantuan; disembunyikan di mode ujian. */

/** Tombol ikon kecil putih (ambil/ulang). */
function TombolIkon({ ikon, onClick, disabled, label }: { ikon: string; onClick: () => void; disabled?: boolean; label: string }) {
  const { skala } = usePanggung();
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className="flex min-h-14 min-w-14 shrink-0 items-center justify-center self-center rounded-[20px] bg-white px-3 active:scale-95 disabled:opacity-50" style={{ minHeight: 56 * skala, minWidth: 56 * skala, boxShadow: `${BAYANG}, inset 0 0 0 2px rgba(11,37,69,.18)`, color: INK }}>
      <Icon name={ikon} size={Math.round(26 * Math.min(skala, 1.35))} />
    </button>
  );
}

/** Strip angka: tombol bulat besar min..max. */
/** Angka tertinggi minimal di strip jawaban. */
const PILIHAN_MINIMAL = 10;

function StripAngka({ min, max, dipilih, sorot, onPilih, disabled }: { min: number; max: number; dipilih?: number | null; sorot?: number | null; onPilih: (n: number) => void; disabled?: boolean }) {
  const { skala, tema } = usePanggung();
  // Pilihan selalu sampai minimal 10 agar anak tidak bisa menebak dari sedikit tombol; soal tetap mengikuti jenjang.
  const atas = Math.max(max, PILIHAN_MINIMAL);
  const angka = useMemo(() => Array.from({ length: Math.max(0, atas - min + 1) }, (_, k) => min + k), [min, atas]);
  const d = Math.round(64 * Math.min(skala, 1.4));
  return (
    <div className="flex flex-wrap justify-center gap-2 rounded-[20px] p-2" style={{ background: tema.panel, boxShadow: "inset 0 0 0 2px #e3e7ef", gap: 8 * skala }} role="group" aria-label="Pilih angka">
      {angka.map((n) => {
        const aktif = dipilih === n;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onPilih(n)}
            className={`flex size-16 items-center justify-center rounded-full transition-transform active:scale-90 disabled:opacity-60 ${sorot === n ? "akademi-bounce" : ""}`}
            style={{ ...Tebal, width: d, height: d, fontSize: Math.round(d * 0.44), background: aktif ? UNGU : "#fff", color: aktif ? "#fff" : INK, boxShadow: `0 4px 0 ${aktif ? "#0567c2" : "rgba(11,37,69,.2)"}, inset 0 0 0 2px ${aktif ? UNGU : "rgba(11,37,69,.22)"}${sorot === n ? `, 0 0 0 4px ${KUNING}` : ""}` }}
            aria-label={`Angka ${n}`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

/** Pembungkus tiap mode: mengunci interaksi saat hasil terisi; mengisi panggung. */
function Kunci({ terkunci, children }: { terkunci: boolean; children: ReactNode }) {
  const { skala } = usePanggung();
  return <div className="flex flex-1 flex-col gap-3" style={{ gap: 12 * skala, ...(terkunci ? { pointerEvents: "none" } : undefined) }} aria-busy={terkunci}>{children}</div>;
}

/** Bantuan: memanggil onHint lalu menandai hint lokal. */
function useBantu(onHint?: () => void) {
  const [hint, setHint] = useState(false);
  const bantu = useCallback(() => { onHint?.(); setHint(true); }, [onHint]);
  return { hint, bantu, setHint };
}

/** Lebar elemen (ResizeObserver) untuk tata letak yang bergantung piksel. */
function useLebar<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const [ref, u] = useUkuran<T>();
  return [ref, u.w];
}

/** Posisi acak-stabil dari indeks: grid + jitter, tidak bertumpuk. */
function kisiBenda(n: number) {
  const cols = Math.max(1, Math.ceil(Math.sqrt(n * 1.8)));
  return { cols, rows: Math.max(1, Math.ceil(n / cols)) };
}
function posisiBenda(n: number): { left: string; top: string }[] {
  const { cols, rows } = kisiBenda(n);
  const noise = (i: number, s: number) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
  return Array.from({ length: n }, (_, i) => {
    const cx = (i % cols + 0.5) / cols, cy = (Math.floor(i / cols) + 0.5) / rows;
    const jx = (noise(i, 1) - 0.5) * 0.5 / cols, jy = (noise(i, 2) - 0.5) * 0.5 / rows;
    return { left: `${(cx + jx) * 100}%`, top: `${(cy + jy) * 100}%` };
  });
}

/* ---------------- presenter utama ---------------- */

export function PresenterSimulasi(props: Props) {
  const { paket, ronde, t } = props;
  const itemById = useCallback((id: string) => ronde.items.find((i) => i.id === id) ?? paket.items.find((i) => i.id === id), [ronde.items, paket.items]);
  const nama = useCallback((id: string) => { const i = itemById(id); return i ? t(i.labelKey) : id; }, [itemById, t]);
  const visual = useCallback((id: string) => visualItem(itemById(id)), [itemById]);
  const knob = useCallback((k: string) => paket.knobs[k]?.default, [paket.knobs]);
  const ctx: Ctx = { ...props, itemById, nama, visual, knob, terkunci: !!props.hasil };

  switch (ronde.mode) {
    case "jam-baca": return <ModeJamBaca {...ctx} />;
    case "jam-putar": return <ModeJamPutar {...ctx} />;
    case "timbangan": return <ModeTimbangan {...ctx} />;
    case "jengkal": return <ModeJengkal {...ctx} />;
    case "kubus": return <ModeKubus {...ctx} />;
    case "turus": return <ModeTurus {...ctx} />;
    case "taksir": return <ModeTaksir {...ctx} />;
    case "tombol": return <ModeTombol {...ctx} />;
    case "alat": return <ModeAlat {...ctx} />;
    case "bagi": return <ModeBagi {...ctx} />;
    case "menara": return <ModeMenara {...ctx} />;
    case "bantuan": return <ModeBantuan {...ctx} />;
    case "telusur": return <ModeTelusur {...ctx} />;
  }
  return null;
}

interface Ctx extends Props {
  itemById: (id: string) => Item | undefined;
  nama: (id: string) => string;
  visual: (id: string) => VisualSpec;
  /** nilai default knob paket (undefined bila knob tidak ada) */
  knob: (k: string) => number | undefined;
  terkunci: boolean;
}

/* ---------------- jam dinding ---------------- */

/** Jam dinding: SVG muka jam + angka 1–12 sebagai tombol HTML (≥56px) bila `onKetukAngka` ada. `ukuran` (px) dari adegan; tanpa itu ikut lebar. */
function JamDinding({
  jam, warna, onKetukAngka, sorotAngka, bayangJam, sorotJarum, terkunci, ukuran: ukuranTetap,
}: {
  jam: number; warna: boolean; onKetukAngka?: (n: number) => void; sorotAngka?: number | null; bayangJam?: number | null; sorotJarum?: boolean; terkunci?: boolean; ukuran?: number;
}) {
  const [ref, lebar] = useLebar<HTMLDivElement>();
  const ukuran = ukuranTetap ?? Math.max(240, Math.min(340, lebar || 300));
  const k = Math.max(1, ukuran / 300); // skala angka & tombol
  const r = ukuran / 2;
  const rAngka = r - 34 * k;
  const sudutJam = ((jam % 12) * 30) % 360;
  const pendek = warna ? MERAH_JARUM : INK;
  const panjang = warna ? BIRU_JARUM : INK;
  return (
    <div ref={ref} className="flex w-full justify-center">
      <div className="relative" style={{ width: ukuran, height: ukuran }}>
        <svg viewBox="0 0 200 200" width={ukuran} height={ukuran} aria-label={`Jam menunjukkan pukul ${jam}`} role="img" style={{ filter: "drop-shadow(0 6px 0 rgba(11,37,69,.14))" }}>
          <circle cx="100" cy="100" r="96" fill="#fff" stroke="#7d6bf0" strokeWidth="6" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="#e3f1fd" strokeWidth="2" />
          {Array.from({ length: 60 }, (_, i) => {
            const a = (i * 6 - 90) * Math.PI / 180;
            const besar = i % 5 === 0;
            const r1 = besar ? 80 : 84, r2 = 88;
            return <line key={i} x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)} x2={100 + r2 * Math.cos(a)} y2={100 + r2 * Math.sin(a)} stroke={besar ? INK : "#8f86b3"} strokeWidth={besar ? 3 : 1.5} strokeLinecap="round" />;
          })}
          {bayangJam != null && (
            <line x1="100" y1="100" x2="100" y2="58" stroke={BENAR} strokeWidth="7" strokeLinecap="round" strokeDasharray="4 6" style={{ transform: `rotate(${((bayangJam % 12) * 30) % 360}deg)`, transformOrigin: "100px 100px", transformBox: "view-box" }} />
          )}
          {/* jarum panjang di 12 */}
          <line x1="100" y1="106" x2="100" y2="34" stroke={panjang} strokeWidth="5" strokeLinecap="round" />
          {/* jarum pendek */}
          <line
            x1="100" y1="108" x2="100" y2="56" stroke={pendek} strokeWidth="9" strokeLinecap="round"
            className={sorotJarum ? "akademi-bounce" : ""}
            style={{ transform: `rotate(${sudutJam}deg)`, transformOrigin: "100px 100px", transformBox: "view-box", transition: "transform 420ms cubic-bezier(.3,1.3,.5,1)", filter: sorotJarum ? `drop-shadow(0 0 4px ${KUNING})` : undefined }}
          />
          <circle cx="100" cy="100" r="7" fill={INK} />
          <circle cx="100" cy="100" r="3" fill="#fff" />
        </svg>
        {Array.from({ length: 12 }, (_, i) => {
          const n = i + 1;
          const a = (n * 30 - 90) * Math.PI / 180;
          const x = r + rAngka * Math.cos(a), y = r + rAngka * Math.sin(a);
          const aktif = jam === n;
          const sorot = sorotAngka === n;
          const d = 52 * k;
          const gaya: CSSProperties = {
            ...Tebal, fontSize: 24 * k, left: x, top: y, width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2,
            background: aktif && onKetukAngka ? UNGU : sorot ? KUNING : "transparent", color: aktif && onKetukAngka ? "#fff" : INK,
            boxShadow: sorot ? `0 0 0 4px ${KUNING}` : undefined,
          };
          if (!onKetukAngka) return <span key={n} aria-hidden className={`absolute flex items-center justify-center rounded-full ${sorot ? "akademi-bounce" : ""}`} style={gaya}>{n}</span>;
          const dt = 56 * k;
          return (
            <button key={n} type="button" disabled={terkunci} onClick={() => onKetukAngka(n)} aria-label={`Angka ${n}`} className={`absolute flex items-center justify-center rounded-full active:scale-90 ${sorot ? "akademi-bounce" : ""}`} style={{ ...gaya, width: dt, height: dt, marginLeft: -dt / 2, marginTop: -dt / 2 }}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Diameter jam yang muat di adegan. */
const ukuranJam = (w: number, h: number) => Math.round(Math.max(240, Math.min(w - 8, h - 8, 640)));

/* ---------------- jam-baca ---------------- */

function ModeJamBaca(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, knob } = c;
  const [dipilih, setDipilih] = useState<number | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const samping = useSamping();
  const warna = (knob("bantuanWarna") ?? 0) === 1;
  const teks = KS.jamBaca;

  return (
    <Kunci terkunci={terkunci}>
      <Tata
        atas={<><Instruksi teks={teks} hasil={hasil} /><Umpan hasil={hasil} benar={`Pukul ${ronde.target}`} /></>}
        adegan={
          <Papan>
            <Adegan min={240}>{({ w, h }) => <JamDinding ukuran={ukuranJam(w, h)} jam={ronde.target} warna={warna} sorotJarum={hint} sorotAngka={hint ? ronde.target : null} />}</Adegan>
            {hint && <Petunjuk className="mt-2">Lihat jarum yang pendek. Ia menunjuk angka berapa?</Petunjuk>}
          </Papan>
        }
        kendali={
          <div className={`flex gap-2 ${samping ? "flex-col" : ""}`} style={{ gap: 8 * skala }}>
            <TombolBantu onClick={() => { bantu(); ucapkan(KS.jamBacaBantu); }} disabled={terkunci} />
            <div className={`grid flex-1 grid-cols-2 gap-2 ${samping ? "" : "sm:grid-cols-4"}`} style={{ gap: 8 * skala }}>
              {ronde.options.map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={terkunci}
                  onClick={() => { setDipilih(n); sfx.tap(); ucapkan(ks.pukul(n)); onJawab({ angka: n }); }}
                  className="flex min-h-16 flex-col items-center justify-center overflow-hidden rounded-[18px] bg-white px-2 active:scale-95 disabled:opacity-80"
                  style={{ minHeight: (samping ? 104 : 64) * skala, boxShadow: `${BAYANG}, 0 0 0 3px ${hasil && n === ronde.target ? BENAR : hasil && n === dipilih ? SALAH : dipilih === n ? UNGU : "rgba(11,37,69,.16)"}` }}
                  aria-label={`Pukul ${n}`}
                >
                  <span style={{ ...Tebal, fontSize: 13 * st }}>Pukul</span>
                  <span style={{ ...Tebal, fontSize: 30 * skala, lineHeight: 1 }}>{n}</span>
                </button>
              ))}
            </div>
          </div>
        }
      />
    </Kunci>
  );
}

/* ---------------- jam-putar ---------------- */

function ModeJamPutar(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, knob, itemById, t } = c;
  const kegiatan = useMemo(() => { const i = ronde.correctId ? itemById(ronde.correctId) : undefined; return i ? t(i.labelKey) : "beraktivitas"; }, [ronde.correctId, itemById, t]);
  const [jam, setJam] = useState(() => (ronde.target === 12 ? 6 : 12));
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const warna = (knob("bantuanWarna") ?? 0) === 1;
  const teks = ks.jamPutar(kegiatan, ronde.target);

  useEffect(() => {
    const id = setTimeout(() => ucapkan(teks), 900);
    return () => clearTimeout(id);
  }, [teks]);

  const ubah = (n: number) => { sfx.clink(); setJam(((n - 1 + 12) % 12) + 1); };
  const bulat = Math.round(64 * skala);
  const tinggiPutar = bulat + 8 * skala;

  return (
    <Kunci terkunci={terkunci}>
      <Tata
        atas={<><Instruksi teks={teks} hasil={hasil} anak={<span>Robot <span style={{ color: UNGU }}>{kegiatan}</span> pukul <span className="rounded-full px-2" style={{ background: "#fff1c2" }}>{ronde.target}</span></span>} /><Umpan hasil={hasil} benar={`Pukul ${ronde.target}`} /></>}
        adegan={
          <Papan>
            <Adegan min={240 + 72}>
              {({ w, h }) => (
                <>
                  <JamDinding ukuran={ukuranJam(w, h - tinggiPutar)} jam={jam} warna={warna} onKetukAngka={ubah} terkunci={terkunci} sorotAngka={hint && !hasil ? ronde.target : null} bayangJam={hasil && !hasil.benar ? ronde.target : null} />
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <button type="button" disabled={terkunci} onClick={() => ubah(jam - 1)} aria-label="Mundur satu jam" className="flex size-16 items-center justify-center rounded-full bg-white active:scale-90" style={{ width: bulat, height: bulat, boxShadow: `${BAYANG}, inset 0 0 0 2px rgba(11,37,69,.18)`, color: INK }}><Icon name="chevron_left" size={Math.round(34 * st)} /></button>
                    <div className="flex flex-col items-center rounded-[16px] bg-white px-4 py-1" style={{ minWidth: 120 * st, boxShadow: `${BAYANG}, inset 0 0 0 2px ${UNGU}55` }}>
                      <span style={{ ...Tebal, fontSize: 13 * st }}>Pukul</span>
                      <span style={{ ...Tebal, fontSize: 36 * st, lineHeight: 1, color: UNGU }}>{jam}</span>
                    </div>
                    <button type="button" disabled={terkunci} onClick={() => ubah(jam + 1)} aria-label="Maju satu jam" className="flex size-16 items-center justify-center rounded-full bg-white active:scale-90" style={{ width: bulat, height: bulat, boxShadow: `${BAYANG}, inset 0 0 0 2px rgba(11,37,69,.18)`, color: INK }}><Icon name="chevron_right" size={Math.round(34 * st)} /></button>
                  </div>
                </>
              )}
            </Adegan>
          </Papan>
        }
        kendali={
          <div className="flex gap-2" style={{ gap: 8 * skala }}>
            <TombolBantu onClick={() => { bantu(); ucapkan(ks.jamPutarBantu(ronde.target)); }} disabled={terkunci} />
            <TombolBesar onClick={() => { sfx.tap(); onJawab({ angka: jam }); }} disabled={terkunci}><Icon name="check" size={26} /> Sudah</TombolBesar>
          </div>
        }
      />
    </Kunci>
  );
}

/* ---------------- timbangan ---------------- */

/** Nampan timbangan (tali + piring) di ujung papan; bergeser halus saat papan miring. */
function Pan({ x, y }: { x: number; y: number }) {
  return (
    <g style={{ transform: `translate(${x}px, ${y}px)`, transition: "transform 900ms cubic-bezier(.3,1.3,.5,1)" }}>
      <line x1="0" y1="0" x2="-36" y2="44" stroke="#4a3f8a" strokeWidth="3" />
      <line x1="0" y1="0" x2="36" y2="44" stroke="#4a3f8a" strokeWidth="3" />
      <path d="M-44 44 Q0 70 44 44 Z" fill="#c9b8ff" stroke="#4a3f8a" strokeWidth="3" />
      <circle cx="0" cy="0" r="4" fill="#4a3f8a" />
    </g>
  );
}

function ModeTimbangan(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, visual } = c;
  const benda = useMemo(() => ronde.items.filter((i) => i.role === "benda").slice(0, 2), [ronde.items]);
  const [kiri, kanan] = benda;
  const [fase, setFase] = useState<"taruh" | "miring">("taruh");
  const [dipilih, setDipilih] = useState<string | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const samping = useSamping();
  useEffect(() => {
    const id = setTimeout(() => { setFase("miring"); sfx.thud(); }, 900);
    return () => clearTimeout(id);
  }, []);
  const beratKiri = (kiri?.value ?? 0) > (kanan?.value ?? 0);
  const sudut = fase === "miring" ? (beratKiri ? 11 : -11) : 0; // positif = kiri turun
  const rad = sudut * Math.PI / 180;
  const L = 150, PX = 200, PY = 150;
  const ujung = (sisi: -1 | 1) => ({ x: PX + sisi * L * Math.cos(rad), y: PY - sisi * L * Math.sin(rad) });
  const uk = ujung(-1), uka = ujung(1);
  const teks = KS.timbangan;
  const berat = ronde.correctId ?? (beratKiri ? kiri?.id : kanan?.id);

  const posBenda = (p: { x: number; y: number }): CSSProperties => ({ left: `${p.x / 400 * 100}%`, top: `${(p.y + 46) / 260 * 100}%`, transform: "translate(-50%,-100%)", transition: "left 900ms cubic-bezier(.3,1.3,.5,1), top 900ms cubic-bezier(.3,1.3,.5,1)" });

  return (
    <Kunci terkunci={terkunci}>
      <Tata
        atas={<><Instruksi teks={teks} hasil={hasil} /><Umpan hasil={hasil} benar={berat ? `${nama(berat)} lebih berat` : "-"} /></>}
        adegan={
          <Papan>
            <Adegan min={200}>
              {({ w, h }) => {
                // lebar timbangan: muat lebar & tinggi adegan (rasio 400:260); benda ikut membesar
                const lebar = Math.max(260, Math.min(w - 8, ((h - 8) * 400) / 260, 1000));
                const ub = Math.round(56 * Math.max(1, lebar / 440));
                return (
                  <div className="relative" style={{ width: lebar, aspectRatio: "400 / 260" }} role="img" aria-label={fase === "miring" ? `Timbangan miring ke ${beratKiri ? "kiri" : "kanan"}` : "Benda diletakkan di timbangan"}>
                    <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" aria-hidden>
                      <path d="M160 250 L200 160 L240 250 Z" fill="#8a7ac9" stroke="#4a3f8a" strokeWidth="3" strokeLinejoin="round" />
                      <rect x="120" y="248" width="160" height="10" rx="5" fill="#4a3f8a" />
                      <line x1={uk.x} y1={uk.y} x2={uka.x} y2={uka.y} stroke="#4a3f8a" strokeWidth="12" strokeLinecap="round" style={{ transition: "all 900ms cubic-bezier(.3,1.3,.5,1)" }} />
                      <circle cx={PX} cy={PY} r="10" fill="#2d2560" />
                      <Pan x={uk.x} y={uk.y} />
                      <Pan x={uka.x} y={uka.y} />
                    </svg>
                    {kiri && <div className={`absolute ${fase === "taruh" ? "akademi-pop" : ""}`} style={posBenda(uk)}><Benda v={visual(kiri.id)} size={ub} /></div>}
                    {kanan && <div className={`absolute ${fase === "taruh" ? "akademi-pop" : ""}`} style={{ ...posBenda(uka), animationDelay: "200ms" }}><Benda v={visual(kanan.id)} size={ub} /></div>}
                  </div>
                );
              }}
            </Adegan>
            {hint && <Petunjuk>Sisi yang turun ke bawah itu yang lebih berat.</Petunjuk>}
          </Papan>
        }
        kendali={
          <div className={`flex gap-2 ${samping ? "flex-col" : ""}`} style={{ gap: 8 * skala }}>
            <TombolBantu onClick={() => { bantu(); ucapkan(KS.timbanganBantu); }} disabled={terkunci} />
            <div className="grid flex-1 grid-cols-2 gap-2" style={{ gap: 8 * skala }}>
              {benda.map((b) => (
                <KartuBenda
                  key={b.id}
                  v={visual(b.id)}
                  size={Math.round(56 * skala * (samping ? 1.15 : 1))}
                  labelSize={Math.round(13 * st)}
                  label={nama(b.id)}
                  selected={dipilih === b.id}
                  right={!!hasil && b.id === berat}
                  wrong={!!hasil && b.id === dipilih && b.id !== berat}
                  onClick={() => { if (terkunci || fase !== "miring") return; setDipilih(b.id); sfx.tap(); onJawab({ pilih: b.id }); }}
                  className={`min-h-24 ${hint && b.id === berat ? "akademi-bounce" : ""}`}
                  style={{ minHeight: 96 * skala * (samping ? 1.4 : 1), ...(fase !== "miring" ? { opacity: 0.6 } : undefined) }}
                />
              ))}
            </div>
          </div>
        }
      />
    </Kunci>
  );
}

/* ---------------- jengkal ---------------- */

const J = 64; // lebar dasar satu jengkal (px); di tablet membesar mengikuti adegan

function ModeJengkal(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, knob, nama } = c;
  const benda = useMemo(() => ronde.items.find((i) => i.role === "benda") ?? ronde.items[0], [ronde.items]);
  const maxSpans = Math.max(ronde.target + 1, Math.round(knob("maxSpans") ?? 8));
  const bayang = knob("bayang") === 1;
  // posisi telapak dalam satuan jengkal (bukan px) supaya tetap benar saat ukuran jengkal berubah
  const [telapak, setTelapak] = useState<number[]>([]);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const seret = useRef<{ awal: number; x0: number } | null>(null);
  const jPx = useRef(J);
  const teks = ks.jengkal(benda ? nama(benda.id) : "bendanya");

  const tambah = () => {
    if (telapak.length >= maxSpans) return;
    sfxAkademi.taruh();
    setTelapak((tp) => {
      const akhir = tp.length ? tp[tp.length - 1] + 1 : 0;
      return [...tp, ronde.snap ? tp.length : Math.min(akhir, maxSpans - 1)];
    });
  };
  const ambil = () => { sfxAkademi.tolak(); setTelapak((tp) => tp.slice(0, -1)); };

  const mulaiSeret = (e: RPointerEvent<HTMLButtonElement>) => {
    if (ronde.snap || terkunci) return;
    const i = telapak.length - 1;
    seret.current = { awal: telapak[i], x0: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const gerakSeret = (e: RPointerEvent<HTMLButtonElement>) => {
    const s = seret.current;
    if (!s) return;
    const x = Math.max(0, Math.min(maxSpans - 1, s.awal + (e.clientX - s.x0) / jPx.current));
    setTelapak((tp) => tp.map((v, k) => (k === tp.length - 1 ? x : v)));
  };
  const selesaiSeret = () => { seret.current = null; };

  // celah / tumpang tindih antar telapak berurutan (ditampilkan merah setelah hasil), dalam satuan jengkal
  const cacat = useMemo(() => {
    if (!hasil) return [] as { x: number; w: number; jenis: "celah" | "tumpang" }[];
    const out: { x: number; w: number; jenis: "celah" | "tumpang" }[] = [];
    const urut = [...telapak].sort((a, b) => a - b);
    for (let i = 0; i + 1 < urut.length; i++) {
      const selisih = urut[i + 1] - (urut[i] + 1);
      if (selisih > 0.2) out.push({ x: urut[i] + 1, w: selisih, jenis: "celah" });
      else if (selisih < -0.2) out.push({ x: urut[i + 1], w: -selisih, jenis: "tumpang" });
    }
    return out;
  }, [hasil, telapak]);

  return (
    <Kunci terkunci={terkunci}>
      <Tata
        lebar={0.4}
        atas={<><Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={`${ronde.target} jengkal${cacat.length ? ` · ada ${cacat.some((k) => k.jenis === "celah") ? "celah" : ""}${cacat.some((k) => k.jenis === "celah") && cacat.some((k) => k.jenis === "tumpang") ? " dan " : ""}${cacat.some((k) => k.jenis === "tumpang") ? "tumpang tindih" : ""}` : ""}`} /></>}
        adegan={
      <Papan>
        <Adegan min={150}>
          {({ w, h }) => {
            // lebar jengkal: muat lebar (di HP boleh 64 px dengan gulir mendatar), tetapi selalu muat tinggi adegan supaya panggung tidak meluap
            const jp = Math.max(44, Math.min(Math.max(J, Math.floor((w - 36) / maxSpans)), Math.floor(((h - 12) * J) / 200), 130));
            jPx.current = jp;
            const f = jp / J;
            const lebarJalur = maxSpans * jp;
            const kiri = 12;
            return (
              <div className="w-full overflow-x-auto pb-1" style={{ touchAction: "pan-x" }}>
                <div className="relative mx-auto" style={{ width: lebarJalur + 24, height: 200 * f, paddingLeft: 12 }}>
                  {/* benda memanjang */}
                  <div className="absolute flex items-center" style={{ left: kiri, top: 8 * f, width: ronde.target * jp, height: 72 * f, overflow: "visible" }} aria-label={`${benda ? nama(benda.id) : "benda"} sepanjang ${ronde.target} jengkal`}>
                    <span style={{ fontSize: 60 * f, lineHeight: 1, display: "inline-block", transform: `scaleX(${(ronde.target * jp) / (60 * f)})`, transformOrigin: "left center" }} aria-hidden>{benda?.emoji ?? "🥖"}</span>
                  </div>
                  {/* garis dasar */}
                  <div className="absolute" style={{ left: kiri, top: 88 * f, width: lebarJalur, height: 4 * f, background: INK, borderRadius: 2 }} />
                  <div className="absolute" style={{ left: kiri, top: 80 * f, width: 4 * f, height: 20 * f, background: INK, borderRadius: 2 }} />
                  <div className="absolute" style={{ left: kiri + ronde.target * jp - 2 * f, top: 80 * f, width: 4 * f, height: 20 * f, background: INK, borderRadius: 2 }} />
                  {/* garis bayang tiap jengkal */}
                  {bayang && Array.from({ length: ronde.target + 1 }, (_, k) => (
                    <div key={k} className="absolute" style={{ left: kiri + k * jp, top: 96 * f, height: 88 * f, borderLeft: "2px dashed rgba(7,134,235,.65)" }} aria-hidden />
                  ))}
                  {/* celah / tumpang tindih */}
                  {cacat.map((k, i) => (
                    <div key={i} className="akademi-pop absolute rounded-[6px]" style={{ left: kiri + k.x * jp, top: 100 * f, width: k.w * jp, height: 80 * f, background: k.jenis === "celah" ? "rgba(255,90,110,.25)" : "rgba(255,90,110,.45)", border: `2px dashed ${SALAH}` }} aria-label={k.jenis} />
                  ))}
                  {/* telapak */}
                  {telapak.map((x, i) => {
                    const terakhir = i === telapak.length - 1;
                    const bisaSeret = !ronde.snap && terakhir && !terkunci;
                    return (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Jengkal ke-${i + 1}${bisaSeret ? ", geser untuk memindahkan" : ""}`}
                        onPointerDown={bisaSeret ? mulaiSeret : undefined}
                        onPointerMove={bisaSeret ? gerakSeret : undefined}
                        onPointerUp={bisaSeret ? selesaiSeret : undefined}
                        onPointerCancel={bisaSeret ? selesaiSeret : undefined}
                        className={`absolute flex items-end justify-center rounded-[14px] ${terakhir && !ronde.snap ? "" : "akademi-pop"}`}
                        style={{ left: kiri + x * jp, top: 100 * f, width: jp, height: 80 * f, touchAction: "none", cursor: bisaSeret ? "grab" : "default", background: bisaSeret ? "rgba(255,210,63,.45)" : "rgba(255,255,255,.75)", boxShadow: bisaSeret ? `0 0 0 3px ${KUNING}` : "inset 0 0 0 2px rgba(11,37,69,.18)", transition: seret.current ? "none" : "left 160ms ease" }}
                      >
                        <span style={{ fontSize: 56 * f, lineHeight: 1 }} aria-hidden>🖐️</span>
                        <span className="absolute top-1 left-1/2 -translate-x-1/2 rounded-full bg-white px-2" style={{ ...Tebal, fontSize: 14 * f, boxShadow: "inset 0 0 0 1.5px rgba(11,37,69,.3)" }}>{i + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }}
        </Adegan>
        {hint && <Petunjuk className="mt-1">Taruh telapak rapat-rapat dari ujung kiri sampai ujung kanan, lalu hitung.</Petunjuk>}
      </Papan>
        }
        kendali={<>
      <div className="flex gap-2" style={{ gap: 8 * skala }}>
        <TombolBantu onClick={() => { bantu(); ucapkan(KS.jengkalBantu); }} disabled={terkunci} />
        <TombolIkon ikon="undo" onClick={ambil} disabled={terkunci || telapak.length === 0} label="Ambil jengkal terakhir" />
        <TombolBesar onClick={tambah} disabled={terkunci || telapak.length >= maxSpans} warna={UNGU} bayang="#0567c2" className={hint && telapak.length < ronde.target ? "akademi-bounce" : ""}>
          Tambah jengkal ✋
        </TombolBesar>
      </div>
      <StripAngka min={1} max={maxSpans} dipilih={hasil ? ronde.target : dipilih} sorot={hint && telapak.length >= ronde.target ? telapak.length : null} disabled={terkunci || telapak.length === 0} onPilih={(n) => { setDipilih(n); sfx.tap(); onJawab({ posisi: telapak, angka: n }); }} />
        </>}
      />
    </Kunci>
  );
}

/* ---------------- kubus ---------------- */

function ModeKubus(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, visual, nama } = c;
  const benda = useMemo(() => ronde.items.find((i) => i.role === "benda") ?? ronde.items[0], [ronde.items]);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const N = 12;
  const warna = ["#ff8fa3", "#ffd23f", "#7ec8a0", "#6ab0e8", "#c59be8", "#ffb86b"];
  const teks = ks.kubus(benda ? nama(benda.id) : "bendanya");
  const awal = ronde.offset, akhir = ronde.offset + ronde.target;

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={`${ronde.target} kubus`} />
      <Papan>
        <Adegan min={128}>
          {({ w, h }) => {
            // sisi kubus: muat 12 kubus selebar adegan, dan tinggi benda + penggaris muat tinggi adegan
            const K = Math.max(40, Math.min(Math.floor((w - 48) / N), Math.floor((h - 12) / (1 + 84 / 64)), 120));
            const f = K / 64;
            return (
              <div className="w-full overflow-x-auto" style={{ touchAction: "pan-x" }}>
                <div className="relative mx-auto" style={{ width: N * K + 24, paddingLeft: 12, paddingRight: 12 }}>
                  <div className="relative" style={{ height: 84 * f }}>
                    <div className="absolute flex items-center justify-center rounded-[14px]" style={{ left: awal * K, width: ronde.target * K, height: 80 * f, background: hint || hasil ? "rgba(7,134,235,.12)" : "transparent", border: hint || hasil ? `3px dashed ${UNGU}` : "3px dashed transparent" }} aria-label={`${benda ? nama(benda.id) : "benda"} sepanjang ${ronde.target} kubus`}>
                      {benda?.emoji ? (
                        <span style={{ fontSize: 56 * f, lineHeight: 1, display: "inline-block", transform: `scaleX(${(ronde.target * K - 8) / (56 * f)})` }} aria-hidden>{benda.emoji}</span>
                      ) : (
                        <Benda v={{ ...visual(benda?.id ?? ""), shape: benda?.shape ?? "rect", width: 1 }} size={Math.round(56 * f)} style={{ width: "100%" }} />
                      )}
                    </div>
                  </div>
                  <div className="flex" role="img" aria-label={`Penggaris kubus 1 sampai ${N}`} style={{ borderRadius: 10, boxShadow: "0 0 0 2px rgba(11,37,69,.35)" }}>
                    {Array.from({ length: N }, (_, k) => {
                      const dibawah = k >= awal && k < akhir;
                      return (
                        <div key={k} className="flex items-center justify-center" style={{ width: K, height: K, background: warna[k % warna.length], borderRight: k === N - 1 ? undefined : "2px solid rgba(11,37,69,.35)", borderRadius: k === 0 ? "10px 0 0 10px" : k === N - 1 ? "0 10px 10px 0" : 0, boxShadow: dibawah && (hint || hasil) ? `inset 0 0 0 4px ${UNGU}` : "inset 0 -5px 0 rgba(0,0,0,.12)", ...Tebal, fontSize: K >= 52 ? Math.round(K * 0.4) : 18 }}>
                          {k + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }}
        </Adegan>
        {hint && <Petunjuk className="mt-2">Hitung kubus yang ada tepat di bawah benda, bukan angka di ujungnya.</Petunjuk>}
      </Papan>
      <div className="flex items-center gap-2" style={{ gap: 8 * skala }}>
        <TombolBantu onClick={() => { bantu(); ucapkan(KS.kubusBantu); }} disabled={terkunci} />
        <span className="flex-1 rounded-full bg-white px-3 py-1 text-center" style={{ ...Tebal, fontSize: 16 * st, boxShadow: BAYANG }}>Berapa kubus?</span>
      </div>
      <StripAngka min={1} max={N} dipilih={hasil ? ronde.target : dipilih} disabled={terkunci} onPilih={(n) => { setDipilih(n); sfx.tap(); onJawab({ angka: n }); }} />
    </Kunci>
  );
}

/* ---------------- turus ---------------- */

/** Turus gaya 卌: tiap 5 = 4 garis + coret. */
function Lima({ jumlah, coret, warna, s = 1 }: { jumlah: number; coret: boolean; warna: string; s?: number }) {
  return (
    <svg width={40 * s} height={32 * s} viewBox="0 0 40 32" aria-hidden className="akademi-pop">
      {Array.from({ length: jumlah }, (_, k) => <line key={k} x1={6 + k * 9} y1="4" x2={6 + k * 9} y2="28" stroke={warna} strokeWidth="3.5" strokeLinecap="round" />)}
      {coret && <line x1="2" y1="27" x2="38" y2="5" stroke={warna} strokeWidth="3.5" strokeLinecap="round" />}
    </svg>
  );
}
function Turus({ n, warna = INK, s = 1 }: { n: number; warna?: string; s?: number }) {
  const kelompok = Math.floor(n / 5), sisa = n % 5;
  return (
    <span className="inline-flex flex-wrap items-center gap-1" aria-label={`${n} turus`}>
      {Array.from({ length: kelompok }, (_, k) => <Lima key={k} jumlah={4} coret warna={warna} s={s} />)}
      {sisa > 0 && <Lima key="sisa" jumlah={sisa} coret={false} warna={warna} s={s} />}
    </span>
  );
}

/** Benda/hewan melintas kanan → kiri; dipasang ulang (key) tiap giliran. */
function Lewat({ v, durasi, size = 56 }: { v: VisualSpec; durasi: number; size?: number }) {
  const [x, setX] = useState(100);
  useEffect(() => {
    const id = requestAnimationFrame(() => setX(-18));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="absolute" style={{ top: "60%", left: `${x}%`, transition: `left ${durasi}ms linear`, transform: "translateY(-50%) scaleX(-1)" }} aria-hidden>
      <Benda v={v} size={size} />
    </div>
  );
}

function ModeTurus(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, visual, nama, paket, t } = c;
  const hewan = useMemo(() => ronde.items.filter((i) => i.role === "hewan"), [ronde.items]);
  const [giliran, setGiliran] = useState(0); // indeks hewan yang sedang lewat
  const [turus, setTurus] = useState<Record<string, number>>(() => Object.fromEntries(hewan.map((h) => [h.id, 0])));
  const { hint, bantu } = useBantu(c.onHint);
  const { skala, tema } = usePanggung();
  const st = useSkalaTeks();
  const samping = useSamping();
  const jeda = Math.max(600, ronde.flashMs || 1500);
  const selesaiLewat = giliran >= ronde.urutan.length;
  const benar = useMemo(() => { const m: Record<string, number> = {}; for (const id of ronde.urutan) m[id] = (m[id] ?? 0) + 1; return m; }, [ronde.urutan]);

  useEffect(() => {
    if (selesaiLewat) return;
    const id = setTimeout(() => setGiliran((g) => g + 1), jeda);
    return () => clearTimeout(id);
  }, [giliran, selesaiLewat, jeda]);

  const sedang = selesaiLewat ? null : ronde.urutan[giliran];
  // Instruksi milik paket (tema bisa hewan, serangga, pengunjung, kendaraan…); cadangan netral.
  const instruksi = paket.instructionKey ? t(paket.instructionKey) : "";
  const teks = instruksi && instruksi !== paket.instructionKey ? instruksi : KS.turusCadangan;
  // di tablet baris tabel lebih tinggi; bila baris banyak & bertumpuk, jangan sampai mendesak jalur
  const sb = samping ? Math.min(skala * 1.1, 1.6) : skala;

  const jalur = (
    <Adegan min={80} className="overflow-hidden rounded-[16px]" style={{ background: "linear-gradient(180deg,#d6f0ff 0 45%,#bfe8a6 45% 78%,#8fcf6d 78%)", boxShadow: "inset 0 0 0 3px rgba(11,37,69,.18)" }}>
      {({ h }) => (
        <div className="absolute inset-0" aria-live="polite" aria-label={sedang ? `${nama(sedang)} lewat` : "Semua sudah lewat"}>
          {sedang && <Lewat key={giliran} v={visual(sedang)} durasi={jeda * 0.9} size={Math.round(Math.max(56, Math.min(h * 0.62, 200)))} />}
          {selesaiLewat && !hasil && (
            <div className="akademi-fade absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-white px-4 py-1" style={{ ...Tebal, fontSize: 16 * st, boxShadow: BAYANG }}>Semua sudah lewat. Tekan Selesai.</span>
            </div>
          )}
        </div>
      )}
    </Adegan>
  );

  const tabel = (
    <div className="flex flex-col gap-2 rounded-[20px] p-2" style={{ gap: 8 * skala, background: tema.panel, boxShadow: bayangKartu() }} role="group" aria-label="Tabel turus">
      {hewan.map((h) => {
        const n = turus[h.id] ?? 0;
        const sorot = hint && sedang === h.id;
        return (
          <button
            key={h.id}
            type="button"
            disabled={terkunci}
            onClick={() => { sfx.tap(); setTurus((tr) => ({ ...tr, [h.id]: (tr[h.id] ?? 0) + 1 })); }}
            className={`flex min-h-16 items-center gap-3 rounded-[16px] bg-white px-3 py-1 text-left active:scale-[.98] ${sorot ? "akademi-bounce" : ""}`}
            style={{ minHeight: 64 * sb, boxShadow: `${BAYANG}, inset 0 0 0 2px rgba(11,37,69,.16)${sorot ? `, 0 0 0 4px ${KUNING}` : ""}` }}
            aria-label={`${nama(h.id)}: ${n} turus, ketuk untuk menambah`}
          >
            <Benda v={visual(h.id)} size={Math.round(44 * sb)} />
            <span className="shrink-0" style={{ ...Tebal, fontSize: 15 * st, width: 64 * st }}>{nama(h.id)}</span>
            <span className="flex-1 overflow-x-auto"><Turus n={n} s={Math.min(sb, 1.4)} /></span>
            <span className="rounded-full px-2" style={{ ...Tebal, fontSize: 18 * st, background: "#fff1c2", boxShadow: "inset 0 0 0 2px #e0b400" }}>{n}</span>
            {hasil && (
              <span className="rounded-full px-2 text-white" style={{ ...Tebal, fontSize: 15 * st, color: "#fff", background: n === (benar[h.id] ?? 0) ? BENAR : SALAH }}>{benar[h.id] ?? 0}</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const tombol = (
    <div className="flex gap-2" style={{ gap: 8 * skala }}>
      <TombolBantu onClick={() => { bantu(); ucapkan(KS.turusBantu); }} disabled={terkunci} />
      <TombolBesar onClick={() => { sfx.tap(); onJawab({ turus }); }} disabled={terkunci || !selesaiLewat}><Icon name="check" size={26} /> Selesai</TombolBesar>
    </div>
  );

  return (
    <Kunci terkunci={terkunci}>
      <Tata
        lebar={0.44}
        atas={<><Instruksi teks={teks} hasil={hasil} /><Umpan hasil={hasil} benar={hewan.map((h) => `${nama(h.id)} ${benar[h.id] ?? 0}`).join(", ")} /></>}
        adegan={samping ? <Papan>{jalur}</Papan> : <Papan>{jalur}<div className="mt-3">{tabel}</div></Papan>}
        kendali={samping ? <>{tabel}{tombol}</> : tombol}
      />
    </Kunci>
  );
}

/* ---------------- taksir ---------------- */

/** Garis bilangan dengan penanda yang bisa digeser atau diketuk. */
function GarisBilangan({ min, max, nilai, onUbah, disabled, benar }: { min: number; max: number; nilai: number; onUbah: (n: number) => void; disabled?: boolean; benar?: number | null }) {
  const [ref, lebar] = useLebar<HTMLDivElement>();
  const s = Math.min(usePanggung().skala, 1.4);
  const pad = 28 * s;
  const span = Math.max(1, max - min);
  const pos = (n: number) => pad + ((n - min) / span) * Math.max(0, lebar - 2 * pad);
  const dariX = (clientX: number) => {
    const el = ref.current; if (!el) return nilai;
    const x = clientX - el.getBoundingClientRect().left;
    return Math.max(min, Math.min(max, Math.round(min + ((x - pad) / Math.max(1, lebar - 2 * pad)) * span)));
  };
  const seret = useRef(false);
  const turun = (e: RPointerEvent<HTMLDivElement>) => { if (disabled) return; seret.current = true; e.currentTarget.setPointerCapture(e.pointerId); onUbah(dariX(e.clientX)); };
  const gerak = (e: RPointerEvent<HTMLDivElement>) => { if (seret.current) { const n = dariX(e.clientX); if (n !== nilai) onUbah(n); } };
  const lepas = () => { seret.current = false; };
  const rapat = lebar > 0 && lebar / (span + 1) < 22 * s;
  const bulat = 64 * s;
  return (
    <div ref={ref} className="relative w-full select-none rounded-[20px] bg-white" style={{ height: 120 * s, touchAction: "none", boxShadow: `${BAYANG}, inset 0 0 0 2px rgba(11,37,69,.16)` }} onPointerDown={turun} onPointerMove={gerak} onPointerUp={lepas} onPointerCancel={lepas} role="slider" aria-valuemin={min} aria-valuemax={max} aria-valuenow={nilai} aria-label="Garis bilangan" tabIndex={0}
      onKeyDown={(e) => { if (disabled) return; if (e.key === "ArrowRight") onUbah(Math.min(max, nilai + 1)); if (e.key === "ArrowLeft") onUbah(Math.max(min, nilai - 1)); }}>
      {lebar > 0 && (
        <>
          <div className="absolute" style={{ left: pad, right: pad, top: 76 * s, height: 4 * s, background: INK, borderRadius: 2 }} />
          {Array.from({ length: span + 1 }, (_, k) => {
            const n = min + k;
            const besar = n % 5 === 0;
            return (
              <div key={n} className="absolute" style={{ left: pos(n), top: (besar ? 68 : 72) * s, transform: "translateX(-50%)" }} aria-hidden>
                <div style={{ width: besar ? 3 : 2, height: (besar ? 20 : 12) * s, background: INK, margin: "0 auto", borderRadius: 2 }} />
                {(!rapat || besar) && <div className="mt-0.5 text-center" style={{ ...Tebal, fontSize: (rapat ? 12 : 14) * s, opacity: n === nilai ? 1 : 0.85 }}>{n}</div>}
              </div>
            );
          })}
          {benar != null && (
            <div className="akademi-pop absolute flex items-center justify-center rounded-full text-white" style={{ width: 40 * s, height: 40 * s, left: pos(benar), top: 26 * s, transform: "translateX(-50%)", background: BENAR, ...Tebal, color: "#fff", fontSize: 18 * s }} aria-label={`Jawaban benar ${benar}`}>{benar}</div>
          )}
          <div className="absolute flex items-center justify-center rounded-full text-white" style={{ width: bulat, height: bulat, left: pos(nilai), top: 8 * s, transform: "translateX(-50%)", background: UNGU, boxShadow: "0 4px 0 #0567c2", ...Tebal, color: "#fff", fontSize: 28 * s, transition: seret.current ? "none" : "left 120ms ease" }} aria-hidden>
            {nilai}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2" style={{ borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: `10px solid ${UNGU}` }} />
          </div>
        </>
      )}
    </div>
  );
}

function ModeTaksir(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, visual } = c;
  const benda = useMemo(() => ronde.items.find((i) => i.role === "benda") ?? ronde.items[0], [ronde.items]);
  const [min, max] = ronde.options.length >= 2 ? [ronde.options[0], ronde.options[1]] : [0, 20];
  const [nilai, setNilai] = useState(Math.round((min + max) / 2));
  const [tampil, setTampil] = useState(true);
  const [terhitung, setTerhitung] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pos = useMemo(() => posisiBenda(ronde.target), [ronde.target]);
  const v = visual(benda?.id ?? "");
  const { skala } = usePanggung();
  const st = useSkalaTeks();

  const flash = useCallback(() => {
    setTampil(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setTampil(false), Math.max(400, ronde.flashMs || 1500));
  }, [ronde.flashMs]);
  useEffect(() => { flash(); return () => { if (timer.current) clearTimeout(timer.current); }; }, [flash]);

  // setelah hasil: buka kain, hitung bersama satu per satu
  useEffect(() => {
    if (!hasil) return;
    if (timer.current) clearTimeout(timer.current);
    setTampil(true);
    let k = 0;
    const id = setInterval(() => {
      k++;
      sfxAkademi.koin();
      setTerhitung(k);
      if (k >= ronde.target) clearInterval(id);
    }, 380);
    return () => clearInterval(id);
  }, [hasil, ronde.target]);

  const lihatLagi = () => { c.onHint?.(); flash(); };
  const teks = KS.taksir;
  const tinggi = ronde.target <= 8 ? 160 : ronde.target <= 14 ? 200 : 240;
  const { cols, rows } = kisiBenda(ronde.target);

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={`${ronde.target}${hasil && !hasil.benar ? ` (kamu bilang ${nilai})` : ""}`} />
      <Papan>
        <Adegan min={tinggi} className="overflow-hidden rounded-[18px]" style={{ background: "linear-gradient(180deg,#f7e2b6,#e9c98a)", boxShadow: "inset 0 3px 0 rgba(0,0,0,.08), inset 0 0 0 3px #b48a4e" }}>
          {({ w, h }) => {
            // benda membesar mengikuti sel kisi di keranjang yang lebih luas
            const ub = Math.round(Math.max(40, Math.min((w / cols) * 0.6, (h / rows) * 0.6, 110)));
            const lencana = Math.round(28 * Math.max(1, ub / 56));
            return (
              <div className="absolute inset-0" aria-label={tampil ? `${ronde.target} benda di keranjang` : "Keranjang tertutup kain"}>
                {Array.from({ length: ronde.target }, (_, i) => (
                  <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={pos[i]}>
                    <Benda v={v} size={ub} />
                    {hasil && i < terhitung && <span className="akademi-pop absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white" style={{ ...Tebal, width: lencana, height: lencana, color: "#fff", fontSize: lencana / 2, background: UNGU }}>{i + 1}</span>}
                  </span>
                ))}
                {hasil && terhitung > 0 && <span className="akademi-pop absolute right-3 bottom-2 rounded-full bg-white px-3" style={{ ...Tebal, fontSize: 24 * st, boxShadow: BAYANG }}>{terhitung}</span>}
                <div className="absolute inset-0 transition-transform duration-500 ease-in-out" style={{ transform: tampil ? "translateY(-104%)" : "translateY(0)", background: "repeating-linear-gradient(135deg,#f0a7b8 0 14px,#f6c6d1 14px 28px)", boxShadow: "0 6px 0 rgba(0,0,0,.1)", borderRadius: 18 }} aria-hidden>
                  <div className="flex h-full items-center justify-center">
                    <span className="rounded-full bg-white px-4 py-1" style={{ ...Tebal, fontSize: 20 * st, color: "#7a2b3f", boxShadow: BAYANG }}>🧣 Kira-kira berapa?</span>
                  </div>
                </div>
              </div>
            );
          }}
        </Adegan>
      </Papan>
      <GarisBilangan min={min} max={max} nilai={nilai} onUbah={(n) => { if (n !== nilai) { sfx.tap(); setNilai(n); } }} disabled={terkunci || tampil} benar={hasil ? ronde.target : null} />
      <div className="flex gap-2" style={{ gap: 8 * skala }}>
        <TombolBantu onClick={lihatLagi} disabled={terkunci || tampil} label="Lihat lagi" />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ angka: nilai }); }} disabled={terkunci || tampil}><Icon name="front_hand" size={26} /> Segini!</TombolBesar>
      </div>
    </Kunci>
  );
}

/* ---------------- tombol ---------------- */

const EMOJI_ALAT: Record<string, string> = { lampu: "💡", kipas: "🌀", radio: "📻", "penggaris-kubus": "📏", timbangan: "⚖️" };

function emojiAlat(it: Item | undefined, id: string) {
  return it?.emoji ?? EMOJI_ALAT[id] ?? EMOJI_ALAT[Object.keys(EMOJI_ALAT).find((k) => id.includes(k)) ?? ""] ?? "🔌";
}

function ModeTombol(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, itemById } = c;
  const tombol = useMemo(() => ronde.items.filter((i) => i.role === "tombol"), [ronde.items]);
  const alat = useMemo(() => ronde.items.filter((i) => i.role === "alat"), [ronde.items]);
  const [fase, setFase] = useState<"coba" | "tebak">("coba");
  const [dicoba, setDicoba] = useState<Set<string>>(() => new Set());
  const [nyala, setNyala] = useState<Record<string, boolean>>({});
  const [giliran, setGiliran] = useState(0);
  const [langkah, setLangkah] = useState<"tunjuk" | "tekan" | "nyala">("tunjuk");
  const [tebakan, setTebakan] = useState<Record<string, string>>({});
  const tebakanRef = useRef<Record<string, string>>({});
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const nyalakan = (alatId: string) => {
    const a = itemById(alatId);
    const e = emojiAlat(a, alatId);
    if (e === "📻") sfx.beep(); else if (e === "🌀") sfx.whoosh(); else sfx.sparkle();
    setNyala((n) => ({ ...n, [alatId]: true }));
    timers.current.push(setTimeout(() => setNyala((n) => ({ ...n, [alatId]: false })), 1000));
  };

  const tekan = (tombolId: string) => {
    if (terkunci) return;
    const tujuan = ronde.peta[tombolId];
    if (fase === "coba") {
      sfx.tap();
      if (tujuan) nyalakan(tujuan);
      setDicoba((d) => new Set(d).add(tombolId));
      return;
    }
    if (langkah !== "tekan" || tombolId !== ronde.urutan[giliran]) { sfxAkademi.tolak(); return; }
    sfx.tap();
    if (tujuan) nyalakan(tujuan);
    setLangkah("nyala");
    timers.current.push(setTimeout(() => {
      const g = giliran + 1;
      if (g >= ronde.urutan.length) onJawab({ tebakan: tebakanRef.current });
      else { setGiliran(g); setLangkah("tunjuk"); }
    }, 1100));
  };

  const tunjuk = (alatId: string) => {
    if (fase !== "tebak" || langkah !== "tunjuk" || terkunci) return;
    sfxAkademi.ambil();
    const tb = ronde.urutan[giliran];
    const baru = { ...tebakanRef.current, [tb]: alatId };
    tebakanRef.current = baru;
    setTebakan(baru);
    setLangkah("tekan");
  };

  const semuaDicoba = tombol.every((b) => dicoba.has(b.id));
  const sedang = fase === "tebak" ? ronde.urutan[giliran] : null;
  const teks = fase === "coba" ? KS.tombolCoba : langkah === "tunjuk" ? ks.tombolTebak(nama(sedang ?? "")) : langkah === "tekan" ? ks.tombolTekan(nama(sedang ?? "")) : KS.tombolLihat;
  const kiriKanan = (id: string, alatId: string) => tebakan[id] === alatId;
  const bulat = Math.round(56 * skala);

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={ronde.urutan.map((tb) => `${nama(tb)} → ${nama(ronde.peta[tb] ?? "")}`).join(", ")} />
      <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Putaran">
        {(["coba", "tebak"] as const).map((f, i) => (
          <span key={f} className="rounded-full px-3 py-1" style={{ ...Tebal, fontSize: 14 * st, background: fase === f ? UNGU : "#fff", color: fase === f ? "#fff" : INK, boxShadow: BAYANG }} role="tab" aria-selected={fase === f}>{i + 1}. {f === "coba" ? "Coba dulu" : "Tebak dulu"}</span>
        ))}
        {fase === "tebak" && <span className="rounded-full bg-white px-3 py-1" style={{ ...Tebal, fontSize: 14 * st, boxShadow: BAYANG }}>{Math.min(giliran + 1, ronde.urutan.length)}/{ronde.urutan.length}</span>}
      </div>
      <Papan>
        {/* alat: mengisi sisa tinggi; emoji ikut tinggi kartu */}
        <Adegan min={112}>
          {({ w, h }) => {
            const ue = Math.round(Math.max(56, Math.min(h * 0.5, (w / Math.max(1, alat.length)) * 0.45, 150)));
            return (
              <div className="grid h-full w-full gap-2" style={{ gap: 10 * skala, gridTemplateColumns: `repeat(${Math.max(1, alat.length)}, minmax(0,1fr))` }} role="group" aria-label="Alat">
                {alat.map((a) => {
                  const e = emojiAlat(a, a.id);
                  const on = !!nyala[a.id];
                  const ditunjuk = sedang ? kiriKanan(sedang, a.id) : false;
                  const bisa = fase === "tebak" && langkah === "tunjuk" && !terkunci;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      disabled={!bisa}
                      onClick={() => tunjuk(a.id)}
                      aria-label={`${nama(a.id)}${on ? " menyala" : ""}${ditunjuk ? ", ditebak" : ""}`}
                      className={`relative flex min-h-28 flex-col items-center justify-center gap-1 rounded-[20px] bg-white transition-all ${bisa ? "active:scale-95" : ""} ${bisa && hint ? "akademi-bounce" : ""}`}
                      style={{ boxShadow: `${BAYANG}${ditunjuk ? `, 0 0 0 4px ${UNGU}` : bisa ? `, 0 0 0 3px ${KUNING}` : ", inset 0 0 0 2px rgba(11,37,69,.16)"}`, background: on ? "linear-gradient(180deg,#fff9d6,#ffe98a)" : "#fff", filter: on ? "drop-shadow(0 0 14px rgba(255,210,63,.9))" : undefined }}
                    >
                      <span className={`${on && e === "🌀" ? "animate-spin" : ""} ${on && e === "📻" ? "akademi-shake" : ""}`} style={{ fontSize: ue, lineHeight: 1, filter: on && e === "💡" ? "brightness(1.3) drop-shadow(0 0 10px #ffd23f)" : on ? undefined : "grayscale(.5)", display: "inline-block" }} aria-hidden>{e}</span>
                      <span style={{ ...Tebal, fontSize: 14 * st }}>{nama(a.id)}</span>
                      {ditunjuk && <span className="akademi-pop absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full text-white" style={{ ...Tebal, color: "#fff", background: UNGU, fontSize: 16 }}>?</span>}
                      {on && e === "📻" && <span className="akademi-pop absolute top-2 right-3" style={{ fontSize: 20 * skala }} aria-hidden>🎵</span>}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </Adegan>
        {/* kabel tersembunyi */}
        <div className="my-2 flex justify-center gap-6" aria-hidden>{alat.map((a) => <span key={a.id} style={{ ...Tebal, fontSize: 18 * st, opacity: 0.55 }}>?</span>)}</div>
        {/* tombol */}
        <div className="grid gap-2" style={{ gap: 10 * skala, gridTemplateColumns: `repeat(${Math.max(1, tombol.length)}, minmax(0,1fr))` }} role="group" aria-label="Tombol">
          {tombol.map((b) => {
            const warna = b.color ?? "#0786eb";
            const sudah = dicoba.has(b.id);
            const aktifTebak = sedang === b.id;
            const bisa = !terkunci && (fase === "coba" || (aktifTebak && langkah === "tekan"));
            return (
              <button
                key={b.id}
                type="button"
                disabled={!bisa && fase === "tebak"}
                onClick={() => tekan(b.id)}
                aria-label={`Tombol ${nama(b.id)}${sudah && fase === "coba" ? ", sudah dicoba" : ""}`}
                className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-[20px] transition-transform active:translate-y-1 ${aktifTebak && langkah !== "nyala" ? "akademi-bounce" : ""} ${fase === "coba" && hint && !sudah ? "akademi-bounce" : ""}`}
                style={{ minHeight: 80 * skala, background: "#fff", boxShadow: `${BAYANG}${aktifTebak ? `, 0 0 0 4px ${KUNING}` : ", inset 0 0 0 2px rgba(11,37,69,.16)"}`, opacity: fase === "tebak" && !aktifTebak ? 0.55 : 1 }}
              >
                <span className="flex items-center justify-center rounded-full" style={{ width: bulat, height: bulat, background: warna, boxShadow: `0 5px 0 rgba(0,0,0,.25), inset 0 -4px 0 rgba(0,0,0,.15)`, border: "4px solid #fff", outline: `3px solid ${warna}` }} aria-hidden>
                  {sudah && fase === "coba" && <Icon name="check" size={Math.round(24 * skala)} style={{ color: "#fff" }} />}
                </span>
                <span style={{ ...Tebal, fontSize: 13 * st }}>{nama(b.id)}</span>
              </button>
            );
          })}
        </div>
      </Papan>
      <div className="flex gap-2" style={{ gap: 8 * skala }}>
        <TombolBantu onClick={() => { bantu(); ucapkan(fase === "coba" ? KS.tombolBantuCoba : KS.tombolBantuTebak); }} disabled={terkunci} />
        {fase === "coba" ? (
          <TombolBesar onClick={() => { sfx.open(); setFase("tebak"); }} disabled={terkunci || !semuaDicoba} warna={UNGU} bayang="#0567c2">
            <Icon name="arrow_forward" size={26} /> {semuaDicoba ? "Lanjut: Tebak dulu" : `Coba semua tombol (${dicoba.size}/${tombol.length})`}
          </TombolBesar>
        ) : (
          <div className="flex min-h-16 flex-1 items-center justify-center rounded-[20px] bg-white px-3 text-center" style={{ ...Tebal, minHeight: 64 * skala, fontSize: 15 * st, boxShadow: BAYANG }}>
            {langkah === "tunjuk" ? "Ketuk alat yang akan menyala" : langkah === "tekan" ? "Lalu tekan tombolnya" : "Lihat hasilnya!"}
          </div>
        )}
      </div>
    </Kunci>
  );
}

/* ---------------- alat ---------------- */

function ModeAlat(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, visual, itemById } = c;
  const hewan = useMemo(() => ronde.items.find((i) => i.role === "hewan") ?? ronde.items[0], [ronde.items]);
  const alat = useMemo(() => ronde.items.filter((i) => i.role === "alat"), [ronde.items]);
  const [dipilih, setDipilih] = useState<string | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const samping = useSamping();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const tanyaBerat = hewan?.value === 2;
  const tanya = ks.alatTanya(tanyaBerat);
  const teks = ks.alat(hewan ? nama(hewan.id) : "Hewan", tanyaBerat);
  const jenisAlat = (a: Item) => (emojiAlat(a, a.id) === "⚖️" || a.id.includes("timbang") ? "timbangan" : "penggaris");
  const dipakai = dipilih ? itemById(dipilih) : undefined;
  const jenisDipakai = dipakai ? jenisAlat(dipakai) : null;

  const pilih = (id: string) => {
    if (terkunci || dipilih) return;
    setDipilih(id);
    sfxAkademi.ambil();
    timer.current = setTimeout(() => onJawab({ pilih: id }), 1500);
  };

  return (
    <Kunci terkunci={terkunci}>
      <Tata
        atas={<><Instruksi teks={teks} hasil={hasil} anak={<span><span style={{ color: UNGU }}>{hewan ? nama(hewan.id) : "Hewan"}</span>: {tanya}</span>} /><Umpan hasil={hasil} benar={ronde.correctId ? `${nama(ronde.correctId)} untuk ${tanyaBerat ? "berat" : "panjang"}` : "-"} /></>}
        adegan={
          <Papan>
            <Adegan min={208}>
              {({ w, h }) => {
                // f = pembesaran adegan (1 di HP): hewan, penggaris kubus, timbangan ikut
                const f = Math.max(1, Math.min((h - 8) / 208, (w - 8) / 420, 2.4));
                return (
                  <div className="relative flex w-full flex-col items-center justify-end" style={{ height: 208 * f, maxWidth: 420 * f }}>
                    {/* balon pertanyaan */}
                    <div className="absolute top-0 right-2 rounded-[14px] bg-white px-3 py-1 akademi-pop" style={{ ...Tebal, fontSize: 15 * Math.min(f, 1.6), boxShadow: `${BAYANG}, inset 0 0 0 2px rgba(11,37,69,.16)` }}>{tanyaBerat ? "⚖️ berat?" : "📏 panjang?"}</div>
                    {/* hewan */}
                    <div className="relative z-10 transition-transform duration-700 ease-in-out" style={{ transform: jenisDipakai === "timbangan" ? "translateY(-6px)" : "none" }}>
                      <Benda v={visual(hewan?.id ?? "")} size={Math.round(96 * f)} />
                    </div>
                    {/* penggaris kubus masuk di bawah hewan */}
                    <div className="flex overflow-hidden transition-all duration-700 ease-out" style={{ height: 36 * f, width: jenisDipakai === "penggaris" ? 240 * f : 0, opacity: jenisDipakai === "penggaris" ? 1 : 0 }} aria-hidden>
                      {Array.from({ length: 6 }, (_, k) => <div key={k} className="flex shrink-0 items-center justify-center" style={{ width: 36 * f, height: 36 * f, background: ["#ff8fa3", "#ffd23f", "#7ec8a0", "#6ab0e8", "#c59be8", "#ffb86b"][k], ...Tebal, fontSize: 14 * f, borderRight: "2px solid rgba(11,37,69,.35)" }}>{k + 1}</div>)}
                    </div>
                    {/* timbangan naik dari bawah */}
                    <div className="transition-all duration-700 ease-out" style={{ height: jenisDipakai === "timbangan" ? 44 * f : 0, opacity: jenisDipakai === "timbangan" ? 1 : 0, overflow: "hidden" }} aria-hidden>
                      <div className="mx-auto rounded-full" style={{ height: 12 * f, width: 160 * f, background: "#6d5fb3" }} />
                      <div className="mx-auto mt-1 flex items-center justify-center rounded-b-[14px] text-white" style={{ height: 28 * f, width: 96 * f, background: "#4a3f8a", ...Tebal, color: "#fff", fontSize: 13 * f }}>{hewan?.value === 2 ? "berat" : "…"}</div>
                    </div>
                  </div>
                );
              }}
            </Adegan>
            {hint && <Petunjuk>{tanyaBerat ? "Berat diukur dengan timbangan." : "Panjang diukur dengan penggaris."}</Petunjuk>}
          </Papan>
        }
        kendali={
          <div className={`flex gap-2 ${samping ? "flex-col" : ""}`} style={{ gap: 8 * skala }}>
            <TombolBantu onClick={() => { bantu(); ucapkan(tanyaBerat ? KS.alatBantuBerat : KS.alatBantuPanjang); }} disabled={terkunci || !!dipilih} />
            <div className={`grid flex-1 gap-2 ${samping ? "grid-cols-1" : "grid-cols-2"}`} style={{ gap: 8 * skala }}>
              {alat.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  disabled={terkunci || !!dipilih}
                  onClick={() => pilih(a.id)}
                  aria-label={nama(a.id)}
                  className={`flex min-h-24 flex-col items-center justify-center gap-1 overflow-hidden rounded-[20px] bg-white active:scale-95 ${hint && a.id === ronde.correctId ? "akademi-bounce" : ""}`}
                  style={{ minHeight: 96 * skala * (samping ? 1.35 : 1), boxShadow: `${BAYANG}, 0 0 0 3px ${hasil && a.id === ronde.correctId ? BENAR : hasil && a.id === dipilih ? SALAH : dipilih === a.id ? UNGU : "rgba(11,37,69,.16)"}`, opacity: dipilih && dipilih !== a.id ? 0.55 : 1 }}
                >
                  <span style={{ fontSize: 52 * skala * (samping ? 1.2 : 1), lineHeight: 1 }} aria-hidden>{emojiAlat(a, a.id)}</span>
                  <span style={{ ...Tebal, fontSize: 14 * st }}>{nama(a.id)}</span>
                </button>
              ))}
            </div>
          </div>
        }
      />
    </Kunci>
  );
}

/* ---------------- bagi ---------------- */

type Tempat = "keranjang" | "kiri" | "kanan";

function ModeBagi(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, visual } = c;
  const benda = useMemo(() => ronde.items.find((i) => i.role === "benda") ?? ronde.items[0], [ronde.items]);
  const v = benda ? visual(benda.id) : { emoji: "🐟" };
  const [tempat, setTempat] = useState<Tempat[]>(() => Array.from({ length: ronde.target }, () => "keranjang"));
  const [aktif, setAktif] = useState<"kiri" | "kanan">("kiri");
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const jumlah = (tp: Tempat) => tempat.filter((x) => x === tp).length;
  const kiri = jumlah("kiri"), kanan = jumlah("kanan"), sisa = jumlah("keranjang");
  const teks = KS.bagi;

  const pindah = (i: number) => {
    if (terkunci) return;
    setTempat((tp) => tp.map((x, k) => (k !== i ? x : x === "keranjang" ? aktif : "keranjang")));
    if (tempat[i] === "keranjang") sfxAkademi.ambil(); else sfxAkademi.taruh();
  };

  const piring = (sisi: "kiri" | "kanan") => {
    const n = jumlah(sisi);
    const aktifIni = aktif === sisi;
    const kurang = hint && n < (sisi === "kiri" ? kanan : kiri);
    return (
      <Wadah
        className={kurang ? "akademi-bounce" : ""}
        ring={aktifIni ? KUNING : "transparent"}
        minIsi={72}
        style={{ minHeight: 150 * skala }}
        label={
          <button type="button" disabled={terkunci} onClick={() => { sfx.tap(); setAktif(sisi); }} aria-label={`Pilih piring ${sisi}${aktifIni ? " (aktif)" : ""}, ${n} ikan`} aria-pressed={aktifIni} className="flex min-h-14 items-center justify-center gap-2 rounded-full px-2 active:scale-95" style={{ minHeight: 52 * skala, background: aktifIni ? "#fff1c2" : undefined }}>
            <span style={{ fontSize: 40 * st, lineHeight: 1 }} aria-hidden>{sisi === "kiri" ? "🐱" : "🐈"}</span>
            <span style={{ ...Tebal, fontSize: 15 * st }}>Kucing {sisi}</span>
            <span className="rounded-full px-2" style={{ ...Tebal, fontSize: 20 * st, background: hasil ? (kiri === kanan && kiri + kanan === ronde.target ? "#e4f8ee" : "#ffe9ec") : "#fff1c2", boxShadow: "inset 0 0 0 2px rgba(11,37,69,.2)" }}>{n}</span>
          </button>
        }
      >
        <div className="flex w-full flex-1 flex-wrap content-center items-center justify-center gap-1 self-stretch rounded-[999px]" style={{ minHeight: 72 * skala, background: "radial-gradient(ellipse at center,#fff 58%,#e3e6f3 59%,#fff 64%)", boxShadow: "inset 0 0 0 3px #b9bfd6" }} aria-label={`Piring ${sisi}: ${n} ikan`}>
          {tempat.map((tp, i) => tp === sisi && <KartuBenda key={i} v={v} size={Math.round(36 * skala)} keterangan={false} onClick={() => pindah(i)} className="min-h-14 min-w-14 akademi-pop" style={{ minHeight: 56 * skala, minWidth: 56 * skala }} />)}
          {n === 0 && <span className="font-bold" style={{ fontSize: 13 * st, color: INK }}>kosong</span>}
        </div>
      </Wadah>
    );
  };

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={`${ronde.target / 2} dan ${ronde.target / 2}`} />
      <Papan>
        <div className="rounded-[22px] p-3" style={{ background: "linear-gradient(180deg,#f7e2b6,#e9c98a)", boxShadow: "0 5px 0 #b48a4e, inset 0 0 0 3px #b48a4e" }}>
          <div className="mb-1 flex items-center gap-2" style={{ ...Tebal, fontSize: 16 * st }}>
            <span style={{ fontSize: 28 * st, lineHeight: 1 }}>🧺</span>
            <span className="rounded-full bg-white px-3">Keranjang</span>
            <span className="ml-auto rounded-full bg-white px-3" style={{ fontSize: 18 * st }}>{sisa}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2" style={{ minHeight: 72 * skala, gap: 8 * skala }}>
            {sisa === 0 && <span className="w-full text-center font-bold" style={{ fontSize: 14 * st, color: INK }}>Keranjang kosong</span>}
            {tempat.map((tp, i) => tp === "keranjang" && <KartuBenda key={i} v={v} size={Math.round(40 * skala)} onClick={() => pindah(i)} className={`min-h-14 min-w-14 ${hint ? "akademi-bounce" : ""}`} style={{ minHeight: 56 * skala, minWidth: 56 * skala }} />)}
          </div>
        </div>
        <div className="mt-3 grid flex-1 grid-cols-2 gap-2" style={{ gap: 12 * skala }}>
          {piring("kiri")}
          {piring("kanan")}
        </div>
        {hint && <Petunjuk className="mt-2">Satu untuk kiri, satu untuk kanan, bergantian sampai habis.</Petunjuk>}
      </Papan>
      <div className="flex gap-2" style={{ gap: 8 * skala }}>
        <TombolBantu onClick={() => { bantu(); ucapkan(KS.bagiBantu); }} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ kiri, kanan }); }} disabled={terkunci || kiri + kanan === 0}><Icon name="balance" size={26} /> Sudah adil</TombolBesar>
      </div>
    </Kunci>
  );
}

/* ---------------- menara ---------------- */

const B = 58; // tinggi dasar satu tingkat menara (px); di tablet membesar mengikuti adegan

function ModeMenara(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, visual, nama, itemById } = c;
  const [tumpukan, setTumpukan] = useState<string[]>([]);
  const [jatuh, setJatuh] = useState<{ id: string; fase: "atas" | "gelinding" } | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const samping = useSamping();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const nilaiBenda = (id: string) => itemById(id)?.value ?? 1;
  const lantai = ronde.items.filter((i) => !tumpukan.includes(i.id) && jatuh?.id !== i.id);
  const penuh = tumpukan.length >= ronde.target;
  const BMIN = 42; // tinggi tingkat terkecil (HP sempit) supaya panggung tidak perlu digulir
  const tinggiPapan = (ronde.target + 1) * BMIN + 36;
  const teks = ks.menara(ronde.target);

  const ketukLantai = (id: string) => {
    if (terkunci || jatuh || penuh) return;
    if (nilaiBenda(id) === 0) {
      // bola: naik sebentar, lalu menggelinding jatuh — tumpukan tidak berubah, boleh coba lagi
      sfxAkademi.tolak();
      setJatuh({ id, fase: "atas" });
      timers.current.push(setTimeout(() => { setJatuh({ id, fase: "gelinding" }); sfx.whoosh(); }, 420));
      timers.current.push(setTimeout(() => setJatuh(null), 1400));
      return;
    }
    if (nilaiBenda(id) === 2) sfx.sparkle(); else sfxAkademi.taruh();
    setTumpukan((tp) => [...tp, id]);
  };
  const ambilAtas = () => { if (terkunci || !tumpukan.length || jatuh) return; sfx.whoosh(); setTumpukan((tp) => tp.slice(0, -1)); };

  const kartuLantai = Math.round(48 * skala * (samping ? 1.1 : 1));
  const benLantai = (
    <div className="flex flex-wrap justify-center gap-2" style={{ gap: 8 * skala }} role="group" aria-label="Benda di lantai">
      {lantai.map((b) => (
        <KartuBenda
          key={b.id}
          v={visual(b.id)}
          size={kartuLantai}
          labelSize={Math.round(13 * st)}
          label={nama(b.id)}
          onClick={() => ketukLantai(b.id)}
          className={`min-h-20 min-w-20 ${hint && (b.value ?? 1) !== 0 && !penuh ? "akademi-bounce" : ""}`}
          style={{ minHeight: 80 * skala, minWidth: 80 * skala, opacity: penuh || jatuh ? 0.6 : 1, boxShadow: hint && (b.value ?? 1) !== 0 ? `${BAYANG}, 0 0 0 4px ${KUNING}` : undefined }}
        />
      ))}
      {!lantai.length && <span className="rounded-full bg-white px-3 py-1 font-bold" style={{ fontSize: 14 * st, color: INK }}>Lantai kosong</span>}
    </div>
  );

  const tombol = (
    <div className="flex gap-2" style={{ gap: 8 * skala }}>
      <TombolBantu onClick={() => { bantu(); ucapkan(KS.menaraBantu); }} disabled={terkunci} />
      <TombolIkon ikon="undo" onClick={ambilAtas} disabled={terkunci || !tumpukan.length} label="Turunkan benda teratas" />
      <TombolBesar onClick={() => { sfx.tap(); onJawab({ tumpukan }); }} disabled={terkunci || !penuh}><Icon name="check" size={26} /> Selesai</TombolBesar>
    </div>
  );

  const petunjuk = hint && <Petunjuk className="mt-2">Bola menggelinding. Pilih benda yang rata bawahnya.</Petunjuk>;

  return (
    <Kunci terkunci={terkunci}>
      <Tata
        lebar={0.4}
        atas={<><Instruksi teks={teks} hasil={hasil} /><Umpan hasil={hasil} benar={hasil?.benar ? `menara ${ronde.target} tingkat berdiri!` : "pakai benda yang rata bawahnya, bola menggelinding"} /></>}
        adegan={
          <Papan>
            <Adegan min={tinggiPapan}>
              {({ w, h }) => {
                // tinggi tingkat mengisi tinggi adegan; lebar balok & benda ikut
                const b = Math.max(BMIN, Math.min(Math.floor((h - 8 - 36) / (ronde.target + 1)), Math.floor(B * 1.8)));
                const f = b / B;
                const tinggi = (ronde.target + 1) * b + 36;
                // posisi memakai left/calc (bukan translateX) supaya tidak bentrok dengan transform animasi akademi-pop/shake
                const posBola: CSSProperties = jatuh?.fase === "gelinding"
                  ? { left: `calc(50% + ${128 * f}px)`, bottom: 0, transform: "rotate(720deg)" }
                  : { left: `calc(50% - ${22 * f}px)`, bottom: tumpukan.length * b + 8, transform: "rotate(0deg)" };
                return (
                  <div className="relative w-full overflow-hidden" style={{ height: tinggi, maxWidth: Math.min(w, 420 * f) }} role="img" aria-label={`Menara ${tumpukan.length} dari ${ronde.target} tingkat`}>
                    {/* garis target */}
                    <div className="absolute right-0 left-0 flex items-center gap-2" style={{ bottom: ronde.target * b + 6, borderTop: `3px dashed ${hint || penuh ? BENAR : "rgba(7,134,235,.7)"}` }} aria-hidden>
                      <span className="ml-1 rounded-full bg-white px-2" style={{ ...Tebal, fontSize: 14 * st, transform: "translateY(-50%)", boxShadow: "inset 0 0 0 2px rgba(7,134,235,.5)" }}>{ronde.target} tingkat</span>
                    </div>
                    {/* lantai */}
                    <div className="absolute right-0 bottom-0 left-0" style={{ height: 8, background: "#4a3f8a", borderRadius: 4 }} aria-hidden />
                    {/* tingkat menara */}
                    {tumpukan.map((id, i) => {
                      const tabung = nilaiBenda(id) === 2;
                      const teratas = i === tumpukan.length - 1;
                      return (
                        <button
                          key={`${id}-${i}`}
                          type="button"
                          disabled={terkunci || !teratas}
                          onClick={ambilAtas}
                          aria-label={`Tingkat ${i + 1}: ${nama(id)}${teratas ? ", ketuk untuk menurunkan" : ""}`}
                          className="akademi-pop absolute flex items-center justify-center rounded-[14px] bg-white"
                          style={{ left: `calc(50% - ${38 * f}px)`, bottom: i * b + 8, width: 76 * f, height: b - 4, boxShadow: `${BAYANG}, inset 0 0 0 2px rgba(11,37,69,.18)`, transition: "bottom 300ms ease" }}
                        >
                          <Benda v={visual(id)} size={Math.round(44 * f)} />
                          {tabung && <span className="akademi-pop absolute -top-2 -right-2 rounded-full bg-white px-1.5" style={{ ...Tebal, fontSize: 11 * st, boxShadow: BAYANG }} aria-label="tabung tegak bisa ditumpuk">tegak ✨</span>}
                        </button>
                      );
                    })}
                    {/* bola yang jatuh */}
                    {jatuh && (
                      <div className="absolute" style={{ ...posBola, transition: jatuh.fase === "gelinding" ? "left 900ms cubic-bezier(.4,0,.7,1), bottom 900ms cubic-bezier(.6,0,.9,.4), transform 900ms linear" : "none" }} aria-hidden>
                        <Benda v={visual(jatuh.id)} size={Math.round(44 * f)} />
                      </div>
                    )}
                    {/* penghitung */}
                    <span className="absolute top-1 right-1 rounded-full bg-white px-3 py-1" style={{ ...Tebal, fontSize: 18 * st, boxShadow: BAYANG }} aria-live="polite">{tumpukan.length}/{ronde.target}</span>
                  </div>
                );
              }}
            </Adegan>
            {!samping && <div className="mt-2">{benLantai}</div>}
            {!samping && petunjuk}
          </Papan>
        }
        kendali={samping ? <><div className="rounded-[20px] bg-white/90 p-3" style={{ boxShadow: BAYANG }}>{benLantai}</div>{petunjuk}{tombol}</> : tombol}
      />
    </Kunci>
  );
}

/* ---------------- bantuan ---------------- */

/** Reaksi alat saat sudah diperbaiki robot (emoji tambahan di sebelah alat). */
const REAKSI_ALAT: Record<string, string> = { "🚰": "💦", "💡": "✨", "🚪": "🌤️", "🔌": "⚡" };

function ModeBantuan(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, itemById, paket, t } = c;
  const macet = useMemo(() => (ronde.correctId ? itemById(ronde.correctId) : undefined) ?? ronde.items[0], [ronde.correctId, ronde.items, itemById]);
  const [ketukan, setKetukan] = useState(0);
  const ketukanRef = useRef(0);
  const [goyang, setGoyang] = useState(0);
  const [fase, setFase] = useState<"macet" | "datang" | "beres">("macet");
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const samping = useSamping();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
  const emoji = macet?.emoji ?? "🔌";
  const teks = t(paket.instructionKey);

  const ketuk = () => {
    if (terkunci || fase !== "macet") return;
    sfx.clunk();
    ketukanRef.current += 1;
    setKetukan(ketukanRef.current);
    setGoyang((g) => g + 1);
  };
  const tolong = () => {
    if (terkunci || fase !== "macet") return;
    sfx.tap();
    ucapkan(KS.tolong);
    setFase("datang");
    timers.current.push(setTimeout(() => { setFase("beres"); sfx.sparkle(); }, 1500));
    timers.current.push(setTimeout(() => onJawab({ ketukanSiaSia: ketukanRef.current, mintaTolong: true }), 2600));
  };

  return (
    <Kunci terkunci={terkunci}>
      <Tata
        lebar={0.32}
        atas={<><Instruksi teks={teks} hasil={hasil} /><Umpan hasil={hasil} benar={hasil?.benar ? "minta tolong itu pintar!" : `kamu mengetuk ${ketukan} kali; kalau macet, langsung minta tolong ya`} /></>}
        adegan={
          <Papan>
            <Adegan min={240}>
              {({ w, h }) => {
                const f = Math.max(1, Math.min((h - 8) / 240, (w - 8) / 420, 2.2));
                return (
                  <div className="relative w-full overflow-hidden" style={{ height: 240 * f, maxWidth: 420 * f }}>
                    {/* alat besar: tidak bereaksi, hanya bergoyang kecil */}
                    <button
                      type="button"
                      onClick={ketuk}
                      disabled={terkunci || fase !== "macet"}
                      aria-label={`${macet ? nama(macet.id) : "Alat"}${fase === "beres" ? " sudah bekerja" : " tidak bereaksi"}`}
                      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28px] bg-white active:scale-[.98]"
                      style={{ width: 160 * f, height: 160 * f, boxShadow: `${BAYANG}, inset 0 0 0 3px rgba(11,37,69,.16)` }}
                    >
                      <span key={goyang} className={goyang > 0 && fase === "macet" ? "akademi-shake" : fase === "beres" ? "akademi-pop" : ""} style={{ fontSize: 104 * f, lineHeight: 1, display: "inline-block", filter: fase === "beres" ? "drop-shadow(0 0 12px #ffd23f)" : "grayscale(.7)" }} aria-hidden>{emoji}</span>
                      {fase === "beres" && <span className="akademi-pop absolute -top-3 -right-3" style={{ fontSize: 44 * f, lineHeight: 1 }} aria-hidden>{REAKSI_ALAT[emoji] ?? "✨"}</span>}
                    </button>
                    {/* robot datang dari kiri */}
                    <div className="absolute bottom-2 flex items-end" style={{ left: fase === "macet" ? -110 * f : `calc(50% - ${150 * f}px)`, transition: "left 1300ms cubic-bezier(.3,1,.4,1)" }} aria-hidden>
                      <span style={{ fontSize: 64 * f, lineHeight: 1 }}>🤖</span>
                      <span className={fase === "datang" ? "akademi-bounce" : ""} style={{ fontSize: 34 * f, lineHeight: 1, marginLeft: -12 * f }}>🔧</span>
                    </div>
                    {fase !== "macet" && <div className="akademi-fade absolute top-2 left-2 rounded-[14px] bg-white px-3 py-1" style={{ ...Tebal, fontSize: 15 * st, boxShadow: BAYANG }} aria-live="polite">{fase === "datang" ? "Robot datang…" : "Sudah diperbaiki!"}</div>}
                  </div>
                );
              }}
            </Adegan>
          </Papan>
        }
        kendali={
          <div className={`flex gap-2 ${samping ? "flex-col" : ""}`} style={{ gap: 8 * skala }}>
            {/* tombol tolong: selalu tampil, tidak berkedip, tidak dipandu */}
            <TombolBesar onClick={tolong} disabled={terkunci || fase !== "macet"} warna={UNGU} bayang="#0567c2" className={samping ? "" : "max-w-[220px]"}>
              Tolong 🙋
            </TombolBesar>
            <div className="flex min-h-16 flex-1 items-center justify-center rounded-[20px] bg-white px-3 text-center" style={{ ...Tebal, minHeight: 64 * skala, fontSize: 15 * st, boxShadow: BAYANG }}>
              {macet ? nama(macet.id) : "Alat"}
            </div>
          </div>
        }
      />
    </Kunci>
  );
}

/* ---------------- telusur ---------------- */

type Titik = [number, number];
/** Jalur angka 0–9 di viewBox 100×140: daftar goresan (polyline) berurutan; panah = awal tiap goresan. */
const JALUR_ANGKA: Record<number, Titik[][]> = {
  0: [[[50, 21], [34, 28], [27, 50], [26, 72], [29, 96], [38, 113], [50, 119], [62, 113], [71, 96], [74, 72], [73, 50], [66, 28], [50, 21]]],
  6: [[[66, 26], [52, 21], [38, 28], [30, 48], [28, 74], [30, 98], [40, 114], [54, 119], [68, 112], [73, 96], [68, 80], [54, 73], [40, 77], [30, 90]]],
  7: [[[28, 22], [74, 22], [44, 120]]],
  8: [[[50, 21], [34, 28], [30, 42], [38, 56], [50, 62], [64, 70], [72, 86], [68, 106], [50, 119], [32, 106], [28, 86], [36, 70], [50, 62], [62, 56], [70, 42], [66, 28], [50, 21]]],
  9: [[[70, 36], [60, 24], [46, 21], [32, 30], [28, 44], [34, 58], [48, 63], [62, 57], [70, 36], [70, 120]]],
  1: [[[32, 44], [54, 22], [54, 120]]],
  2: [[[28, 46], [32, 32], [44, 22], [58, 22], [68, 30], [72, 44], [68, 58], [56, 76], [28, 118], [76, 118]]],
  3: [[[28, 36], [38, 24], [52, 21], [66, 26], [71, 40], [65, 55], [50, 62], [66, 70], [73, 86], [69, 104], [56, 118], [40, 118], [28, 106]]],
  4: [[[62, 22], [26, 86], [78, 86]], [[62, 22], [62, 120]]],
  5: [[[34, 22], [29, 66], [46, 59], [62, 63], [72, 80], [70, 100], [58, 116], [40, 119], [27, 108]], [[34, 22], [72, 22]]],
};
const TINGGI_ANGKA = 100; // 22 → 120
const TOL = TINGGI_ANGKA * 0.25; // toleransi ±25% tinggi angka
const LANGKAH_SAMPEL = 6;

/** Titik sampel di sepanjang jalur, setiap ~6 satuan viewBox. */
function sampelJalur(goresan: Titik[][]): Titik[] {
  const out: Titik[] = [];
  for (const g of goresan) {
    for (let i = 0; i + 1 < g.length; i++) {
      const [x0, y0] = g[i], [x1, y1] = g[i + 1];
      const d = Math.hypot(x1 - x0, y1 - y0);
      const n = Math.max(1, Math.round(d / LANGKAH_SAMPEL));
      for (let k = 0; k < n; k++) out.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
    }
    out.push(g[g.length - 1]);
  }
  return out;
}

function ModeTelusur(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, visual } = c;
  const peti = useMemo(() => ronde.items.find((i) => i.role === "benda") ?? ronde.items[0], [ronde.items]);
  const jalur = JALUR_ANGKA[ronde.target] ?? JALUR_ANGKA[1];
  const titik = useMemo(() => sampelJalur(jalur), [jalur]);
  const [goresan, setGoresan] = useState<Titik[][]>([]);
  const [ukuran, setUkuran] = useState({ kena: 0, sampel: 0, keluar: 0 });
  const kena = useRef<boolean[]>([]);
  const hitung = useRef({ kena: 0, sampel: 0, keluar: 0 });
  const menggores = useRef(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const { skala } = usePanggung();
  const st = useSkalaTeks();
  const samping = useSamping();
  const tampilPanah = ronde.offset === 1 || hint;

  const ulang = useCallback(() => {
    kena.current = new Array(titik.length).fill(false);
    hitung.current = { kena: 0, sampel: 0, keluar: 0 };
    setUkuran({ kena: 0, sampel: 0, keluar: 0 });
    setGoresan([]);
  }, [titik.length]);
  useEffect(() => { ulang(); }, [ulang]);

  const keViewBox = (e: RPointerEvent<SVGSVGElement>): Titik | null => {
    const el = svgRef.current; if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return [((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 140];
  };
  const catat = (p: Titik) => {
    let terdekat = Infinity;
    titik.forEach(([x, y], i) => {
      const d = Math.hypot(x - p[0], y - p[1]);
      if (d < terdekat) terdekat = d;
      if (d <= TOL && !kena.current[i]) { kena.current[i] = true; hitung.current.kena++; }
    });
    hitung.current.sampel++;
    if (terdekat > TOL) hitung.current.keluar++;
    setUkuran({ ...hitung.current });
  };
  const turun = (e: RPointerEvent<SVGSVGElement>) => {
    if (terkunci) return;
    const p = keViewBox(e); if (!p) return;
    menggores.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer sudah lepas: abaikan */ }
    sfx.brush();
    setGoresan((g) => [...g, [p]]);
    catat(p);
  };
  const gerak = (e: RPointerEvent<SVGSVGElement>) => {
    if (!menggores.current) return;
    const p = keViewBox(e); if (!p) return;
    setGoresan((g) => { const v = g.slice(); v[v.length - 1] = [...v[v.length - 1], p]; return v; });
    catat(p);
  };
  const lepas = () => { menggores.current = false; };

  const cakupan = titik.length ? ukuran.kena / titik.length : 0;
  const keluar = ukuran.sampel ? ukuran.keluar / ukuran.sampel : 0;
  const terbuka = !!hasil?.benar;
  const teks = ks.telusur(ronde.target, ronde.offset === 1);
  /** Penanda goresan ke-i ditaruh 15·i satuan di sepanjang goresannya sendiri, supaya dua goresan yang berawal di titik sama (4, 5) tidak saling menutup. */
  const panahDi = (g: Titik[], i: number) => {
    let sisa = 15 * i;
    for (let k = 0; k + 1 < g.length; k++) {
      const [a, b] = [g[k], g[k + 1]];
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const sudut = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      if (sisa <= d || k + 2 === g.length) { const f = Math.min(1, sisa / Math.max(1e-6, d)); return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, sudut }; }
      sisa -= d;
    }
    return { x: g[0][0], y: g[0][1], sudut: 0 };
  };

  const ukPeti = Math.round(52 * skala * (samping ? 1.5 : 1));
  const kotakPeti = (
    <div className="flex flex-col items-center justify-center gap-1 rounded-[20px] bg-white" style={{ width: samping ? "100%" : 96 * skala, minHeight: samping ? 180 * skala : undefined, padding: 8, boxShadow: `${BAYANG}, inset 0 0 0 2px rgba(11,37,69,.16)` }} aria-label={terbuka ? "Peti terbuka" : "Peti tertutup"}>
      <span className={terbuka ? "akademi-bounce" : ""} style={{ fontSize: ukPeti, lineHeight: 1, filter: terbuka ? "drop-shadow(0 0 12px #ffd23f)" : undefined }} aria-hidden>{terbuka ? "✨" : peti?.emoji ?? "🧰"}</span>
      {terbuka && <span className="akademi-pop" style={{ fontSize: ukPeti * 0.77, lineHeight: 1 }} aria-hidden>{visual(peti?.id ?? "").emoji ?? "🧰"}💎</span>}
      <span style={{ ...Tebal, fontSize: 13 * st }}>{terbuka ? "terbuka!" : "terkunci"}</span>
    </div>
  );
  const kemajuan = (
    <div className="mt-2 flex items-center justify-center gap-2" aria-hidden>
      <div className="overflow-hidden rounded-full bg-white" style={{ height: 12 * st, width: 160 * st, boxShadow: "inset 0 0 0 2px rgba(11,37,69,.22)" }}><div style={{ width: `${Math.round(cakupan * 100)}%`, height: "100%", background: cakupan >= 0.85 ? BENAR : UNGU, transition: "width 150ms" }} /></div>
      <span className="rounded-full bg-white px-2" style={{ ...Tebal, fontSize: 14 * st }}>{Math.round(cakupan * 100)}%</span>
    </div>
  );
  const tombol = (
    <div className="flex gap-2" style={{ gap: 8 * skala }}>
      <TombolBantu onClick={() => { bantu(); ucapkan(KS.telusurBantu); }} disabled={terkunci} />
      <TombolIkon ikon="undo" onClick={() => { sfx.whoosh(); ulang(); }} disabled={terkunci || !goresan.length} label="Hapus goresan" />
      <TombolBesar onClick={() => { sfx.tap(); onJawab({ angka: ronde.target, cakupan, keluar }); }} disabled={terkunci || ukuran.sampel === 0}><Icon name="check" size={26} /> Selesai</TombolBesar>
    </div>
  );
  const petunjuk = hint && <Petunjuk className="mt-1">Mulai dari panah nomor 1, ikuti jalur sampai ujung.</Petunjuk>;

  return (
    <Kunci terkunci={terkunci}>
      <Tata
        lebar={0.3}
        atas={<><Instruksi teks={teks} hasil={hasil} /><Umpan hasil={hasil} benar={terbuka ? "peti terbuka!" : `telusuri angka ${ronde.target} pelan-pelan di dalam jalurnya`} /></>}
        adegan={
          <Papan>
            <Adegan min={samping ? 280 : 200}>
              {({ w, h }) => {
                // kartu angka setinggi adegan (rasio 100:140), menyisakan tempat peti di HP
                const sisaLebar = samping ? w - 8 : w - 96 * skala - 12;
                const lebar = Math.round(Math.max(140, Math.min(sisaLebar, ((h - 8) * 100) / 140, samping ? 520 : 260 * skala)));
                return (
                  <div className="flex items-stretch justify-center gap-3">
                    <svg
                      ref={svgRef}
                      viewBox="0 0 100 140"
                      className="rounded-[20px] bg-white select-none"
                      style={{ width: lebar, height: "auto", aspectRatio: "100 / 140", touchAction: "none", boxShadow: `${BAYANG}, inset 0 0 0 2px rgba(11,37,69,.16)`, cursor: "crosshair" }}
                      role="img"
                      aria-label={`Jalur angka ${ronde.target}, ${Math.round(cakupan * 100)} persen sudah ditelusuri`}
                      onPointerDown={turun}
                      onPointerMove={gerak}
                      onPointerUp={lepas}
                      onPointerCancel={lepas}
                    >
                      {/* jalur tebal (toleransi) */}
                      {jalur.map((g, i) => <polyline key={`t${i}`} points={g.map((p) => p.join(",")).join(" ")} fill="none" stroke={hasil ? (hasil.benar ? "#dff5e9" : "#ffe9ec") : "#d7ecfc"} strokeWidth={TOL * 2} strokeLinecap="round" strokeLinejoin="round" />)}
                      {/* garis tengah */}
                      {jalur.map((g, i) => <polyline key={`g${i}`} points={g.map((p) => p.join(",")).join(" ")} fill="none" stroke="#6f6896" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />)}
                      {/* goresan anak */}
                      {goresan.map((g, i) => <polyline key={`a${i}`} points={g.map((p) => p.join(",")).join(" ")} fill="none" stroke={UNGU} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />)}
                      {/* panah urutan goresan */}
                      {tampilPanah && jalur.map((g, i) => {
                        const { x, y, sudut } = panahDi(g, i);
                        return (
                          <g key={`p${i}`} className={hint ? "akademi-bounce" : ""}>
                            <g transform={`rotate(${sudut} ${x} ${y})`}>
                              <polygon points={`${x + 9},${y} ${x + 1},${y - 5} ${x + 1},${y + 5}`} fill={KUNING} stroke={INK} strokeWidth="1" />
                            </g>
                            <circle cx={x} cy={y} r="7" fill={KUNING} stroke={INK} strokeWidth="1.5" />
                            <text x={x} y={y + 3.2} textAnchor="middle" fontSize="9" fontWeight="900" fill={INK} style={{ fontFamily: BALOO }}>{i + 1}</text>
                          </g>
                        );
                      })}
                    </svg>
                    {/* peti harta */}
                    {!samping && kotakPeti}
                  </div>
                );
              }}
            </Adegan>
            {!samping && kemajuan}
            {!samping && petunjuk}
          </Papan>
        }
        kendali={samping ? <>{kotakPeti}{kemajuan}{petunjuk}{tombol}</> : tombol}
      />
    </Kunci>
  );
}
