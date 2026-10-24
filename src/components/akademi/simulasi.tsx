"use client";

// Presenter mekanik simulasi: sepuluh mode (jam-baca, jam-putar, timbangan, jengkal, kubus, turus, taksir, tombol, alat, bagi)
// lewat switch `ronde.mode` → sub-komponen. Presenter hanya menampilkan dan mengirim jawaban; kebenaran dinilai runner
// (nilaiSimulasi). Setelah `hasil` terisi interaksi dikunci dan jawaban benar ditunjukkan.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import type { PaketSimulasi } from "@akademi/schema";
import type { JawabanSimulasi, RondeSimulasi } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import { ucapkan } from "@/lib/akademi/suara";
import { sfx } from "@/lib/sfx";
import { Benda, KartuBenda, type VisualSpec } from "./benda";
import { BALOO, BENAR, INK, SALAH, type PresenterProps } from "./jenis";

type Props = PresenterProps<RondeSimulasi, JawabanSimulasi, PaketSimulasi>;
type Item = PaketSimulasi["items"][number];

const UNGU = "#5b4bff";
const KUNING = "#ffd23f";
const MERAH_JARUM = "#ff5a6e";
const BIRU_JARUM = "#3b82f6";

/* ---------------- kerangka bersama ---------------- */

const Tebal: CSSProperties = { fontFamily: BALOO, fontWeight: 900, color: INK };
const BAYANG = "0 4px 0 rgba(43,29,78,.12)";

function visualItem(x: Item | undefined, label?: string): VisualSpec {
  if (!x) return { emoji: "❓", label };
  return { emoji: x.emoji, color: x.color, scale: x.scale, count: x.count, shape: x.shape, width: x.width, label };
}

/** Robot pemandu + balon kalimat (ketuk untuk dibacakan). */
function Instruksi({ teks, anak, hasil }: { teks: string; anak?: ReactNode; hasil: Props["hasil"] }) {
  const muka = hasil ? (hasil.benar ? "🤖✨" : "🤖💭") : "🤖";
  return (
    <div className="flex items-end gap-2">
      <div className={`shrink-0 ${hasil?.benar ? "akademi-bounce" : ""}`} style={{ fontSize: 52, lineHeight: 1, filter: "drop-shadow(0 4px 0 rgba(43,29,78,.15))" }} aria-hidden>
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
        <span className="absolute top-1.5 right-2" style={{ color: UNGU }}><Icon name="volume_up" size={18} /></span>
        <div className="pr-6" style={{ ...Tebal, fontSize: 18, lineHeight: 1.2 }}>{anak ?? teks}</div>
      </button>
    </div>
  );
}

/** Umpan balik setelah hasil: benar/salah + jawaban yang benar. */
function Umpan({ hasil, benar }: { hasil: Props["hasil"]; benar: ReactNode }) {
  if (!hasil) return null;
  return (
    <div className="akademi-pop flex items-center justify-center gap-2 rounded-[16px] px-3 py-2" style={{ background: hasil.benar ? "#e4f8ee" : "#ffe9ec", fontFamily: BALOO, fontWeight: 800, fontSize: 17, color: hasil.benar ? BENAR : SALAH }} role="status">
      <Icon name={hasil.benar ? "check_circle" : "info"} size={22} />
      <span>{hasil.benar ? "Benar! " : "Jawabannya: "}{benar}</span>
    </div>
  );
}

/** Papan/panggung tempat simulasi digambar. */
function Papan({ children, style, className = "" }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div className={`relative rounded-[24px] p-3 ${className}`} style={{ background: "linear-gradient(180deg,#eef0ff,#dfe3ff)", boxShadow: "0 6px 0 #b9bff0, inset 0 2px 0 rgba(255,255,255,.6)", ...style }}>
      {children}
    </div>
  );
}

function TombolBesar({ children, onClick, disabled, warna = "#22b573", bayang = "#16804f", className = "" }: { children: ReactNode; onClick: () => void; disabled?: boolean; warna?: string; bayang?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-16 flex-1 items-center justify-center gap-2 rounded-[20px] px-4 text-white transition-transform active:translate-y-1 disabled:opacity-50 ${className}`}
      style={{ background: warna, boxShadow: `0 5px 0 ${bayang}`, fontFamily: BALOO, fontWeight: 900, fontSize: 20 }}
    >
      {children}
    </button>
  );
}

function TombolBantu({ onClick, disabled, label = "Bantu" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex min-h-14 min-w-14 items-center justify-center gap-1 rounded-[20px] bg-white px-3 text-[#b8860b] active:scale-95 disabled:opacity-50"
      style={{ boxShadow: BAYANG, fontFamily: BALOO, fontWeight: 800, fontSize: 15 }}
    >
      <Icon name="lightbulb" size={26} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/** Strip angka: tombol bulat besar min..max. */
function StripAngka({ min, max, dipilih, sorot, onPilih, disabled }: { min: number; max: number; dipilih?: number | null; sorot?: number | null; onPilih: (n: number) => void; disabled?: boolean }) {
  const angka = useMemo(() => Array.from({ length: Math.max(0, max - min + 1) }, (_, k) => min + k), [min, max]);
  return (
    <div className="flex flex-wrap justify-center gap-2 rounded-[20px] bg-white/80 p-2" role="group" aria-label="Pilih angka">
      {angka.map((n) => {
        const aktif = dipilih === n;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onPilih(n)}
            className={`flex size-16 items-center justify-center rounded-full transition-transform active:scale-90 disabled:opacity-60 ${sorot === n ? "akademi-bounce" : ""}`}
            style={{ ...Tebal, fontSize: 28, background: aktif ? UNGU : "#fff", color: aktif ? "#fff" : INK, boxShadow: `0 4px 0 ${aktif ? "#3b2fc0" : "rgba(43,29,78,.15)"}${sorot === n ? `, 0 0 0 4px ${KUNING}` : ""}` }}
            aria-label={`Angka ${n}`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

/** Pembungkus tiap mode: mengunci interaksi saat hasil terisi. */
function Kunci({ terkunci, children }: { terkunci: boolean; children: ReactNode }) {
  return <div className="flex flex-col gap-3" style={terkunci ? { pointerEvents: "none" } : undefined} aria-busy={terkunci}>{children}</div>;
}

/** Bantuan: memanggil onHint lalu menandai hint lokal. */
function useBantu(onHint?: () => void) {
  const [hint, setHint] = useState(false);
  const bantu = useCallback(() => { onHint?.(); setHint(true); }, [onHint]);
  return { hint, bantu, setHint };
}

/** Lebar elemen (ResizeObserver) untuk tata letak yang bergantung piksel. */
function useLebar<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [lebar, setLebar] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ukur = () => setLebar(el.clientWidth);
    ukur();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, lebar];
}

/** Posisi acak-stabil dari indeks: grid + jitter, tidak bertumpuk. */
function posisiBenda(n: number): { left: string; top: string }[] {
  const cols = Math.max(1, Math.ceil(Math.sqrt(n * 1.8)));
  const rows = Math.max(1, Math.ceil(n / cols));
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

/** Jam dinding: SVG muka jam + angka 1–12 sebagai tombol HTML (≥56px) bila `onKetukAngka` ada. */
function JamDinding({
  jam, warna, onKetukAngka, sorotAngka, bayangJam, sorotJarum, terkunci,
}: {
  jam: number; warna: boolean; onKetukAngka?: (n: number) => void; sorotAngka?: number | null; bayangJam?: number | null; sorotJarum?: boolean; terkunci?: boolean;
}) {
  const [ref, lebar] = useLebar<HTMLDivElement>();
  const ukuran = Math.max(240, Math.min(340, lebar || 300));
  const r = ukuran / 2;
  const rAngka = r - 34;
  const sudutJam = ((jam % 12) * 30) % 360;
  const pendek = warna ? MERAH_JARUM : INK;
  const panjang = warna ? BIRU_JARUM : INK;
  return (
    <div ref={ref} className="flex w-full justify-center">
      <div className="relative" style={{ width: ukuran, height: ukuran }}>
        <svg viewBox="0 0 200 200" width={ukuran} height={ukuran} aria-label={`Jam menunjukkan pukul ${jam}`} role="img">
          <circle cx="100" cy="100" r="96" fill="#fff" stroke="#c9b8ff" strokeWidth="6" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="#efeaff" strokeWidth="2" />
          {Array.from({ length: 60 }, (_, i) => {
            const a = (i * 6 - 90) * Math.PI / 180;
            const besar = i % 5 === 0;
            const r1 = besar ? 80 : 84, r2 = 88;
            return <line key={i} x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)} x2={100 + r2 * Math.cos(a)} y2={100 + r2 * Math.sin(a)} stroke={besar ? INK : "#b9b1d6"} strokeWidth={besar ? 3 : 1.5} strokeLinecap="round" />;
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
        {Array.from({ length: 12 }, (_, k) => {
          const n = k + 1;
          const a = (n * 30 - 90) * Math.PI / 180;
          const x = r + rAngka * Math.cos(a), y = r + rAngka * Math.sin(a);
          const aktif = jam === n;
          const sorot = sorotAngka === n;
          const gaya: CSSProperties = {
            ...Tebal, fontSize: 24, left: x, top: y, width: 52, height: 52, marginLeft: -26, marginTop: -26,
            background: aktif && onKetukAngka ? UNGU : sorot ? KUNING : "transparent", color: aktif && onKetukAngka ? "#fff" : INK,
            boxShadow: sorot ? `0 0 0 4px ${KUNING}` : undefined,
          };
          if (!onKetukAngka) return <span key={n} aria-hidden className={`absolute flex items-center justify-center rounded-full ${sorot ? "akademi-bounce" : ""}`} style={gaya}>{n}</span>;
          return (
            <button key={n} type="button" disabled={terkunci} onClick={() => onKetukAngka(n)} aria-label={`Angka ${n}`} className={`absolute flex items-center justify-center rounded-full active:scale-90 ${sorot ? "akademi-bounce" : ""}`} style={{ ...gaya, width: 56, height: 56, marginLeft: -28, marginTop: -28 }}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- jam-baca ---------------- */

function ModeJamBaca(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, knob } = c;
  const [dipilih, setDipilih] = useState<number | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const warna = (knob("bantuanWarna") ?? 0) === 1;
  const teks = "Jam berapa sekarang? Pilih kartunya.";

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={`Pukul ${ronde.target}`} />
      <Papan>
        <JamDinding jam={ronde.target} warna={warna} sorotJarum={hint} sorotAngka={hint ? ronde.target : null} />
        {hint && <div className="akademi-fade mt-2 text-center" style={{ ...Tebal, fontSize: 15, opacity: 0.75 }}>Lihat jarum yang pendek. Ia menunjuk angka berapa?</div>}
      </Papan>
      <div className="flex gap-2">
        <TombolBantu onClick={() => { bantu(); ucapkan("Lihat jarum yang pendek. Ia menunjuk angka berapa?"); }} disabled={terkunci} />
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          {ronde.options.map((n) => (
            <button
              key={n}
              type="button"
              disabled={terkunci}
              onClick={() => { setDipilih(n); sfx.tap(); ucapkan(`Pukul ${n}`); onJawab({ angka: n }); }}
              className="flex min-h-16 flex-col items-center justify-center rounded-[18px] bg-white px-2 active:scale-95 disabled:opacity-80"
              style={{ boxShadow: `${BAYANG}, 0 0 0 3px ${hasil && n === ronde.target ? BENAR : hasil && n === dipilih ? SALAH : dipilih === n ? UNGU : "transparent"}` }}
              aria-label={`Pukul ${n}`}
            >
              <span style={{ ...Tebal, fontSize: 13, opacity: 0.7 }}>Pukul</span>
              <span style={{ ...Tebal, fontSize: 30, lineHeight: 1 }}>{n}</span>
            </button>
          ))}
        </div>
      </div>
    </Kunci>
  );
}

/* ---------------- jam-putar ---------------- */

function ModeJamPutar(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, knob, itemById, t } = c;
  const kegiatan = useMemo(() => { const i = ronde.correctId ? itemById(ronde.correctId) : undefined; return i ? t(i.labelKey) : "beraktivitas"; }, [ronde.correctId, itemById, t]);
  const [jam, setJam] = useState(() => (ronde.target === 12 ? 6 : 12));
  const { hint, bantu } = useBantu(c.onHint);
  const warna = (knob("bantuanWarna") ?? 0) === 1;
  const teks = `Robot ${kegiatan} pukul ${ronde.target}. Putar jarum pendeknya!`;

  useEffect(() => {
    const id = setTimeout(() => ucapkan(teks), 900);
    return () => clearTimeout(id);
  }, [teks]);

  const ubah = (n: number) => { sfx.clink(); setJam(((n - 1 + 12) % 12) + 1); };

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} anak={<span>Robot <span style={{ color: UNGU }}>{kegiatan}</span> pukul <span className="rounded-full px-2" style={{ background: "#fff1c2" }}>{ronde.target}</span></span>} />
      <Umpan hasil={hasil} benar={`Pukul ${ronde.target}`} />
      <Papan>
        <JamDinding jam={jam} warna={warna} onKetukAngka={ubah} terkunci={terkunci} sorotAngka={hint && !hasil ? ronde.target : null} bayangJam={hasil && !hasil.benar ? ronde.target : null} />
        <div className="mt-2 flex items-center justify-center gap-3">
          <button type="button" disabled={terkunci} onClick={() => ubah(jam - 1)} aria-label="Mundur satu jam" className="flex size-16 items-center justify-center rounded-full bg-white active:scale-90" style={{ boxShadow: BAYANG, color: INK }}><Icon name="chevron_left" size={34} /></button>
          <div className="flex min-w-[120px] flex-col items-center rounded-[16px] bg-white px-4 py-1" style={{ boxShadow: BAYANG }}>
            <span style={{ ...Tebal, fontSize: 13, opacity: 0.7 }}>Pukul</span>
            <span style={{ ...Tebal, fontSize: 36, lineHeight: 1, color: UNGU }}>{jam}</span>
          </div>
          <button type="button" disabled={terkunci} onClick={() => ubah(jam + 1)} aria-label="Maju satu jam" className="flex size-16 items-center justify-center rounded-full bg-white active:scale-90" style={{ boxShadow: BAYANG, color: INK }}><Icon name="chevron_right" size={34} /></button>
        </div>
      </Papan>
      <div className="flex gap-2">
        <TombolBantu onClick={() => { bantu(); ucapkan(`Cari angka ${ronde.target} di jam, lalu ketuk.`); }} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ angka: jam }); }} disabled={terkunci}><Icon name="check" size={26} /> Sudah</TombolBesar>
      </div>
    </Kunci>
  );
}

/* ---------------- timbangan ---------------- */

/** Nampan timbangan (tali + piring) di ujung papan; bergeser halus saat papan miring. */
function Pan({ x, y }: { x: number; y: number }) {
  return (
    <g style={{ transform: `translate(${x}px, ${y}px)`, transition: "transform 900ms cubic-bezier(.3,1.3,.5,1)" }}>
      <line x1="0" y1="0" x2="-36" y2="44" stroke="#8a7ac9" strokeWidth="3" />
      <line x1="0" y1="0" x2="36" y2="44" stroke="#8a7ac9" strokeWidth="3" />
      <path d="M-44 44 Q0 70 44 44 Z" fill="#c9b8ff" stroke="#8a7ac9" strokeWidth="3" />
      <circle cx="0" cy="0" r="4" fill="#8a7ac9" />
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
  const teks = "Mana yang lebih berat?";
  const berat = ronde.correctId ?? (beratKiri ? kiri?.id : kanan?.id);

  const posBenda = (p: { x: number; y: number }): CSSProperties => ({ left: `${p.x / 400 * 100}%`, top: `${(p.y + 46) / 260 * 100}%`, transform: "translate(-50%,-100%)", transition: "left 900ms cubic-bezier(.3,1.3,.5,1), top 900ms cubic-bezier(.3,1.3,.5,1)" });

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={berat ? `${nama(berat)} lebih berat` : "-"} />
      <Papan>
        <div className="relative mx-auto w-full max-w-[520px]" style={{ aspectRatio: "400 / 260" }} role="img" aria-label={fase === "miring" ? `Timbangan miring ke ${beratKiri ? "kiri" : "kanan"}` : "Benda diletakkan di timbangan"}>
          <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M160 250 L200 160 L240 250 Z" fill="#8a7ac9" />
            <rect x="120" y="248" width="160" height="10" rx="5" fill="#6d5fb3" />
            <line x1={uk.x} y1={uk.y} x2={uka.x} y2={uka.y} stroke="#6d5fb3" strokeWidth="12" strokeLinecap="round" style={{ transition: "all 900ms cubic-bezier(.3,1.3,.5,1)" }} />
            <circle cx={PX} cy={PY} r="10" fill="#4a3f8a" />
            <Pan x={uk.x} y={uk.y} />
            <Pan x={uka.x} y={uka.y} />
          </svg>
          {kiri && <div className={`absolute ${fase === "taruh" ? "akademi-pop" : ""}`} style={posBenda(uk)}><Benda v={visual(kiri.id)} size={56} /></div>}
          {kanan && <div className={`absolute ${fase === "taruh" ? "akademi-pop" : ""}`} style={{ ...posBenda(uka), animationDelay: "200ms" }}><Benda v={visual(kanan.id)} size={56} /></div>}
        </div>
        {hint && <div className="akademi-fade text-center" style={{ ...Tebal, fontSize: 15, opacity: 0.75 }}>Sisi yang turun ke bawah itu yang lebih berat.</div>}
      </Papan>
      <div className="flex gap-2">
        <TombolBantu onClick={() => { bantu(); ucapkan("Lihat papannya. Sisi yang turun ke bawah, itu yang lebih berat."); }} disabled={terkunci} />
        <div className="grid flex-1 grid-cols-2 gap-2">
          {benda.map((b) => (
            <KartuBenda
              key={b.id}
              v={visual(b.id)}
              size={56}
              label={nama(b.id)}
              selected={dipilih === b.id}
              right={!!hasil && b.id === berat}
              wrong={!!hasil && b.id === dipilih && b.id !== berat}
              onClick={() => { if (terkunci || fase !== "miring") return; setDipilih(b.id); sfx.tap(); onJawab({ pilih: b.id }); }}
              className={`min-h-24 ${hint && b.id === berat ? "akademi-bounce" : ""}`}
              style={fase !== "miring" ? { opacity: 0.6 } : undefined}
            />
          ))}
        </div>
      </div>
    </Kunci>
  );
}

/* ---------------- jengkal ---------------- */

const J = 64; // lebar satu jengkal (px)

function ModeJengkal(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, knob, nama } = c;
  const benda = useMemo(() => ronde.items.find((i) => i.role === "benda") ?? ronde.items[0], [ronde.items]);
  const maxSpans = Math.max(ronde.target + 1, Math.round(knob("maxSpans") ?? 8));
  const bayang = knob("bayang") === 1;
  const [telapak, setTelapak] = useState<number[]>([]);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const seret = useRef<{ awal: number; x0: number } | null>(null);
  const lebarJalur = maxSpans * J;
  const teks = `Ukur ${benda ? nama(benda.id) : "bendanya"} dengan jengkal. Berapa jengkal panjangnya?`;

  const tambah = () => {
    if (telapak.length >= maxSpans) return;
    sfx.plop();
    setTelapak((tp) => {
      const akhir = tp.length ? tp[tp.length - 1] + J : 0;
      return [...tp, ronde.snap ? tp.length * J : Math.min(akhir, lebarJalur - J)];
    });
  };
  const ambil = () => { sfx.thud(); setTelapak((tp) => tp.slice(0, -1)); };

  const mulaiSeret = (e: RPointerEvent<HTMLButtonElement>) => {
    if (ronde.snap || terkunci) return;
    const i = telapak.length - 1;
    seret.current = { awal: telapak[i], x0: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const gerakSeret = (e: RPointerEvent<HTMLButtonElement>) => {
    const s = seret.current;
    if (!s) return;
    const x = Math.max(0, Math.min(lebarJalur - J, s.awal + e.clientX - s.x0));
    setTelapak((tp) => tp.map((v, k) => (k === tp.length - 1 ? x : v)));
  };
  const selesaiSeret = () => { seret.current = null; };

  // celah / tumpang tindih antar telapak berurutan (ditampilkan merah setelah hasil)
  const cacat = useMemo(() => {
    if (!hasil) return [] as { x: number; w: number; jenis: "celah" | "tumpang" }[];
    const out: { x: number; w: number; jenis: "celah" | "tumpang" }[] = [];
    const urut = [...telapak].sort((a, b) => a - b);
    for (let i = 0; i + 1 < urut.length; i++) {
      const selisih = urut[i + 1] - (urut[i] + J);
      if (selisih > 0.2 * J) out.push({ x: urut[i] + J, w: selisih, jenis: "celah" });
      else if (selisih < -0.2 * J) out.push({ x: urut[i + 1], w: -selisih, jenis: "tumpang" });
    }
    return out;
  }, [hasil, telapak]);

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={`${ronde.target} jengkal${cacat.length ? ` · ada ${cacat.some((k) => k.jenis === "celah") ? "celah" : ""}${cacat.some((k) => k.jenis === "celah") && cacat.some((k) => k.jenis === "tumpang") ? " dan " : ""}${cacat.some((k) => k.jenis === "tumpang") ? "tumpang tindih" : ""}` : ""}`} />
      <Papan>
        <div className="overflow-x-auto pb-1" style={{ touchAction: "pan-x" }}>
          <div className="relative" style={{ width: lebarJalur + 24, height: 200, paddingLeft: 12 }}>
            {/* benda memanjang */}
            <div className="absolute flex items-center" style={{ left: 12, top: 8, width: ronde.target * J, height: 72, overflow: "visible" }} aria-label={`${benda ? nama(benda.id) : "benda"} sepanjang ${ronde.target} jengkal`}>
              <span style={{ fontSize: 60, lineHeight: 1, display: "inline-block", transform: `scaleX(${(ronde.target * J) / 60})`, transformOrigin: "left center" }} aria-hidden>{benda?.emoji ?? "🥖"}</span>
            </div>
            {/* garis dasar */}
            <div className="absolute" style={{ left: 12, top: 88, width: lebarJalur, height: 4, background: INK, borderRadius: 2 }} />
            <div className="absolute" style={{ left: 12, top: 80, width: 4, height: 20, background: INK, borderRadius: 2 }} />
            <div className="absolute" style={{ left: 12 + ronde.target * J - 2, top: 80, width: 4, height: 20, background: INK, borderRadius: 2 }} />
            {/* garis bayang tiap jengkal */}
            {bayang && Array.from({ length: ronde.target + 1 }, (_, k) => (
              <div key={k} className="absolute" style={{ left: 12 + k * J, top: 96, height: 88, borderLeft: "2px dashed rgba(91,75,255,.4)" }} aria-hidden />
            ))}
            {/* celah / tumpang tindih */}
            {cacat.map((k, i) => (
              <div key={i} className="akademi-pop absolute rounded-[6px]" style={{ left: 12 + k.x, top: 100, width: k.w, height: 80, background: k.jenis === "celah" ? "rgba(255,90,110,.25)" : "rgba(255,90,110,.45)", border: `2px dashed ${SALAH}` }} aria-label={k.jenis} />
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
                  style={{ left: 12 + x, top: 100, width: J, height: 80, touchAction: "none", cursor: bisaSeret ? "grab" : "default", background: bisaSeret ? "rgba(255,210,63,.35)" : "rgba(255,255,255,.5)", boxShadow: bisaSeret ? `0 0 0 3px ${KUNING}` : "none", transition: seret.current ? "none" : "left 160ms ease" }}
                >
                  <span style={{ fontSize: 56, lineHeight: 1 }} aria-hidden>🖐️</span>
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 rounded-full bg-white px-2" style={{ ...Tebal, fontSize: 14 }}>{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
        {hint && <div className="akademi-fade mt-1 text-center" style={{ ...Tebal, fontSize: 15, opacity: 0.75 }}>Taruh telapak rapat-rapat dari ujung kiri sampai ujung kanan, lalu hitung.</div>}
      </Papan>
      <div className="flex gap-2">
        <TombolBantu onClick={() => { bantu(); ucapkan("Taruh telapak rapat rapat dari ujung kiri sampai ujung kanan, lalu hitung berapa telapaknya."); }} disabled={terkunci} />
        <button type="button" onClick={ambil} disabled={terkunci || telapak.length === 0} aria-label="Ambil jengkal terakhir" className="flex min-h-14 min-w-14 items-center justify-center rounded-[20px] bg-white px-3 active:scale-95 disabled:opacity-50" style={{ boxShadow: BAYANG, color: INK }}><Icon name="undo" size={26} /></button>
        <TombolBesar onClick={tambah} disabled={terkunci || telapak.length >= maxSpans} warna={UNGU} bayang="#3b2fc0" className={hint && telapak.length < ronde.target ? "akademi-bounce" : ""}>
          Tambah jengkal ✋
        </TombolBesar>
      </div>
      <StripAngka min={1} max={maxSpans} dipilih={hasil ? ronde.target : dipilih} sorot={hint && telapak.length >= ronde.target ? telapak.length : null} disabled={terkunci || telapak.length === 0} onPilih={(n) => { setDipilih(n); sfx.tap(); onJawab({ posisi: telapak.map((x) => x / J), angka: n }); }} />
    </Kunci>
  );
}

/* ---------------- kubus ---------------- */

function ModeKubus(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, visual, nama } = c;
  const benda = useMemo(() => ronde.items.find((i) => i.role === "benda") ?? ronde.items[0], [ronde.items]);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const [ref, lebar] = useLebar<HTMLDivElement>();
  const N = 12;
  const K = Math.max(40, Math.min(64, Math.floor((lebar - 24) / N)));
  const warna = ["#ff8fa3", "#ffd23f", "#7ec8a0", "#6ab0e8", "#c59be8", "#ffb86b"];
  const teks = `Berapa kubus panjang ${benda ? nama(benda.id) : "bendanya"}?`;
  const awal = ronde.offset, akhir = ronde.offset + ronde.target;

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={`${ronde.target} kubus`} />
      <Papan>
        <div ref={ref} className="w-full overflow-x-auto" style={{ touchAction: "pan-x" }}>
          <div className="relative" style={{ width: N * K + 24, paddingLeft: 12, paddingRight: 12 }}>
            <div className="relative" style={{ height: 84 }}>
              <div className="absolute flex items-center justify-center rounded-[14px]" style={{ left: 12 + awal * K, width: ronde.target * K, height: 80, background: hint || hasil ? "rgba(91,75,255,.1)" : "transparent", border: hint || hasil ? `2px dashed ${UNGU}` : "2px dashed transparent" }} aria-label={`${benda ? nama(benda.id) : "benda"} sepanjang ${ronde.target} kubus`}>
                {benda?.emoji ? (
                  <span style={{ fontSize: 56, lineHeight: 1, display: "inline-block", transform: `scaleX(${(ronde.target * K - 8) / 56})` }} aria-hidden>{benda.emoji}</span>
                ) : (
                  <Benda v={{ ...visual(benda?.id ?? ""), shape: benda?.shape ?? "rect", width: 1 }} size={56} style={{ width: "100%" }} />
                )}
              </div>
            </div>
            <div className="flex" role="img" aria-label={`Penggaris kubus 1 sampai ${N}`}>
              {Array.from({ length: N }, (_, k) => {
                const dibawah = k >= awal && k < akhir;
                return (
                  <div key={k} className="flex items-center justify-center" style={{ width: K, height: K, background: warna[k % warna.length], borderRight: "2px solid rgba(255,255,255,.7)", borderRadius: k === 0 ? "10px 0 0 10px" : k === N - 1 ? "0 10px 10px 0" : 0, boxShadow: dibawah && (hint || hasil) ? `inset 0 0 0 4px ${UNGU}` : "inset 0 -5px 0 rgba(0,0,0,.12)", ...Tebal, fontSize: K >= 52 ? 24 : 18 }}>
                    {k + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {hint && <div className="akademi-fade mt-2 text-center" style={{ ...Tebal, fontSize: 15, opacity: 0.75 }}>Hitung kubus yang ada tepat di bawah benda, bukan angka di ujungnya.</div>}
      </Papan>
      <div className="flex items-center gap-2">
        <TombolBantu onClick={() => { bantu(); ucapkan("Hitung kubus yang ada tepat di bawah benda, satu per satu."); }} disabled={terkunci} />
        <span className="flex-1 text-center text-[14px] font-bold opacity-70">Berapa kubus?</span>
      </div>
      <StripAngka min={1} max={N} dipilih={hasil ? ronde.target : dipilih} disabled={terkunci} onPilih={(n) => { setDipilih(n); sfx.tap(); onJawab({ angka: n }); }} />
    </Kunci>
  );
}

/* ---------------- turus ---------------- */

/** Turus gaya 卌: tiap 5 = 4 garis + coret. */
function Lima({ jumlah, coret, warna }: { jumlah: number; coret: boolean; warna: string }) {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" aria-hidden className="akademi-pop">
      {Array.from({ length: jumlah }, (_, k) => <line key={k} x1={6 + k * 9} y1="4" x2={6 + k * 9} y2="28" stroke={warna} strokeWidth="3.5" strokeLinecap="round" />)}
      {coret && <line x1="2" y1="27" x2="38" y2="5" stroke={warna} strokeWidth="3.5" strokeLinecap="round" />}
    </svg>
  );
}
function Turus({ n, warna = INK }: { n: number; warna?: string }) {
  const kelompok = Math.floor(n / 5), sisa = n % 5;
  return (
    <span className="inline-flex flex-wrap items-center gap-1" aria-label={`${n} turus`}>
      {Array.from({ length: kelompok }, (_, k) => <Lima key={k} jumlah={4} coret warna={warna} />)}
      {sisa > 0 && <Lima key="sisa" jumlah={sisa} coret={false} warna={warna} />}
    </span>
  );
}

/** Hewan melintas kanan → kiri; dipasang ulang (key) tiap giliran. */
function Lewat({ v, durasi }: { v: VisualSpec; durasi: number }) {
  const [x, setX] = useState(100);
  useEffect(() => {
    const id = requestAnimationFrame(() => setX(-18));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${x}%`, transition: `left ${durasi}ms linear`, transform: "translateY(-50%) scaleX(-1)" }} aria-hidden>
      <Benda v={v} size={56} />
    </div>
  );
}

function ModeTurus(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, visual, nama } = c;
  const hewan = useMemo(() => ronde.items.filter((i) => i.role === "hewan"), [ronde.items]);
  const [giliran, setGiliran] = useState(0); // indeks hewan yang sedang lewat
  const [turus, setTurus] = useState<Record<string, number>>(() => Object.fromEntries(hewan.map((h) => [h.id, 0])));
  const { hint, bantu } = useBantu(c.onHint);
  const jeda = Math.max(600, ronde.flashMs || 1500);
  const selesaiLewat = giliran >= ronde.urutan.length;
  const benar = useMemo(() => { const m: Record<string, number> = {}; for (const id of ronde.urutan) m[id] = (m[id] ?? 0) + 1; return m; }, [ronde.urutan]);

  useEffect(() => {
    if (selesaiLewat) return;
    const id = setTimeout(() => setGiliran((g) => g + 1), jeda);
    return () => clearTimeout(id);
  }, [giliran, selesaiLewat, jeda]);

  const sedang = selesaiLewat ? null : ronde.urutan[giliran];
  const teks = "Hewan lewat satu-satu. Ketuk barisnya untuk mencatat turus!";

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={hewan.map((h) => `${nama(h.id)} ${benar[h.id] ?? 0}`).join(", ")} />
      <Papan>
        <div className="relative h-20 overflow-hidden rounded-[16px]" style={{ background: "linear-gradient(180deg,#bfe8a6 0 70%,#8fcf6d 70%)" }} aria-live="polite" aria-label={sedang ? `${nama(sedang)} lewat` : "Semua hewan sudah lewat"}>
          {sedang && <Lewat key={giliran} v={visual(sedang)} durasi={jeda * 0.9} />}
          {selesaiLewat && !hasil && <div className="akademi-fade absolute inset-0 flex items-center justify-center" style={{ ...Tebal, fontSize: 16, opacity: 0.75 }}>Semua sudah lewat. Tekan Selesai.</div>}
        </div>
        <div className="mt-3 flex flex-col gap-2" role="group" aria-label="Tabel turus">
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
                style={{ boxShadow: `${BAYANG}${sorot ? `, 0 0 0 4px ${KUNING}` : ""}` }}
                aria-label={`${nama(h.id)}: ${n} turus, ketuk untuk menambah`}
              >
                <Benda v={visual(h.id)} size={44} />
                <span className="w-16 shrink-0" style={{ ...Tebal, fontSize: 15 }}>{nama(h.id)}</span>
                <span className="flex-1 overflow-x-auto"><Turus n={n} /></span>
                <span className="rounded-full px-2" style={{ ...Tebal, fontSize: 18, background: "#fff1c2" }}>{n}</span>
                {hasil && (
                  <span className="rounded-full px-2 text-white" style={{ ...Tebal, fontSize: 15, color: "#fff", background: n === (benar[h.id] ?? 0) ? BENAR : SALAH }}>{benar[h.id] ?? 0}</span>
                )}
              </button>
            );
          })}
        </div>
      </Papan>
      <div className="flex gap-2">
        <TombolBantu onClick={() => { bantu(); ucapkan("Lihat hewan yang lewat, lalu ketuk baris hewan yang sama."); }} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ turus }); }} disabled={terkunci || !selesaiLewat}><Icon name="check" size={26} /> Selesai</TombolBesar>
      </div>
    </Kunci>
  );
}

/* ---------------- taksir ---------------- */

/** Garis bilangan dengan penanda yang bisa digeser atau diketuk. */
function GarisBilangan({ min, max, nilai, onUbah, disabled, benar }: { min: number; max: number; nilai: number; onUbah: (n: number) => void; disabled?: boolean; benar?: number | null }) {
  const [ref, lebar] = useLebar<HTMLDivElement>();
  const pad = 28;
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
  const rapat = lebar > 0 && lebar / (span + 1) < 22;
  return (
    <div ref={ref} className="relative w-full select-none rounded-[20px] bg-white" style={{ height: 120, touchAction: "none", boxShadow: BAYANG }} onPointerDown={turun} onPointerMove={gerak} onPointerUp={lepas} onPointerCancel={lepas} role="slider" aria-valuemin={min} aria-valuemax={max} aria-valuenow={nilai} aria-label="Garis bilangan" tabIndex={0}
      onKeyDown={(e) => { if (disabled) return; if (e.key === "ArrowRight") onUbah(Math.min(max, nilai + 1)); if (e.key === "ArrowLeft") onUbah(Math.max(min, nilai - 1)); }}>
      {lebar > 0 && (
        <>
          <div className="absolute" style={{ left: pad, right: pad, top: 76, height: 4, background: INK, borderRadius: 2 }} />
          {Array.from({ length: span + 1 }, (_, k) => {
            const n = min + k;
            const besar = n % 5 === 0;
            return (
              <div key={n} className="absolute" style={{ left: pos(n), top: besar ? 68 : 72, transform: "translateX(-50%)" }} aria-hidden>
                <div style={{ width: besar ? 3 : 2, height: besar ? 20 : 12, background: INK, margin: "0 auto", borderRadius: 2 }} />
                {(!rapat || besar) && <div className="mt-0.5 text-center" style={{ ...Tebal, fontSize: rapat ? 12 : 14, opacity: n === nilai ? 1 : 0.7 }}>{n}</div>}
              </div>
            );
          })}
          {benar != null && (
            <div className="akademi-pop absolute flex size-10 items-center justify-center rounded-full text-white" style={{ left: pos(benar), top: 26, transform: "translateX(-50%)", background: BENAR, ...Tebal, color: "#fff", fontSize: 18 }} aria-label={`Jawaban benar ${benar}`}>{benar}</div>
          )}
          <div className="absolute flex size-16 items-center justify-center rounded-full text-white" style={{ left: pos(nilai), top: 8, transform: "translateX(-50%)", background: UNGU, boxShadow: "0 4px 0 #3b2fc0", ...Tebal, color: "#fff", fontSize: 28, transition: seret.current ? "none" : "left 120ms ease" }} aria-hidden>
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
      sfx.coin();
      setTerhitung(k);
      if (k >= ronde.target) clearInterval(id);
    }, 380);
    return () => clearInterval(id);
  }, [hasil, ronde.target]);

  const lihatLagi = () => { c.onHint?.(); flash(); };
  const teks = "Kira-kira ada berapa? Geser penandanya.";
  const tinggi = ronde.target <= 8 ? 160 : ronde.target <= 14 ? 200 : 240;

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={`${ronde.target}${hasil && !hasil.benar ? ` (kamu bilang ${nilai})` : ""}`} />
      <Papan>
        <div className="relative overflow-hidden rounded-[18px]" style={{ height: tinggi, background: "linear-gradient(180deg,#f7e2b6,#e9c98a)", boxShadow: "inset 0 3px 0 rgba(0,0,0,.08)" }} aria-label={tampil ? `${ronde.target} benda di keranjang` : "Keranjang tertutup kain"}>
          {Array.from({ length: ronde.target }, (_, i) => (
            <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={pos[i]}>
              <Benda v={v} size={40} />
              {hasil && i < terhitung && <span className="akademi-pop absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full text-white" style={{ ...Tebal, color: "#fff", fontSize: 14, background: UNGU }}>{i + 1}</span>}
            </span>
          ))}
          {hasil && terhitung > 0 && <span className="akademi-pop absolute right-3 bottom-2 rounded-full bg-white px-3" style={{ ...Tebal, fontSize: 24 }}>{terhitung}</span>}
          <div className="absolute inset-0 transition-transform duration-500 ease-in-out" style={{ transform: tampil ? "translateY(-104%)" : "translateY(0)", background: "repeating-linear-gradient(135deg,#f0a7b8 0 14px,#f6c6d1 14px 28px)", boxShadow: "0 6px 0 rgba(0,0,0,.1)", borderRadius: 18 }} aria-hidden>
            <div className="flex h-full items-center justify-center" style={{ ...Tebal, fontSize: 20, color: "#7a2b3f", opacity: 0.8 }}>🧣 Kira-kira berapa?</div>
          </div>
        </div>
      </Papan>
      <GarisBilangan min={min} max={max} nilai={nilai} onUbah={(n) => { if (n !== nilai) { sfx.tap(); setNilai(n); } }} disabled={terkunci || tampil} benar={hasil ? ronde.target : null} />
      <div className="flex gap-2">
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
    if (langkah !== "tekan" || tombolId !== ronde.urutan[giliran]) { sfx.thud(); return; }
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
    sfx.pick();
    const tb = ronde.urutan[giliran];
    const baru = { ...tebakanRef.current, [tb]: alatId };
    tebakanRef.current = baru;
    setTebakan(baru);
    setLangkah("tekan");
  };

  const semuaDicoba = tombol.every((b) => dicoba.has(b.id));
  const sedang = fase === "tebak" ? ronde.urutan[giliran] : null;
  const teks = fase === "coba" ? "Coba dulu: ketuk setiap tombol, lihat alat mana yang menyala." : langkah === "tunjuk" ? `Tebak dulu: tombol ${nama(sedang ?? "")} menyalakan alat mana? Ketuk alatnya.` : langkah === "tekan" ? `Sekarang tekan tombol ${nama(sedang ?? "")}.` : "Lihat, alat mana yang menyala?";
  const kiriKanan = (id: string, alatId: string) => tebakan[id] === alatId;

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={ronde.urutan.map((tb) => `${nama(tb)} → ${nama(ronde.peta[tb] ?? "")}`).join(", ")} />
      <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Putaran">
        {(["coba", "tebak"] as const).map((f, i) => (
          <span key={f} className="rounded-full px-3 py-1" style={{ ...Tebal, fontSize: 14, background: fase === f ? UNGU : "#fff", color: fase === f ? "#fff" : INK, boxShadow: BAYANG }} role="tab" aria-selected={fase === f}>{i + 1}. {f === "coba" ? "Coba dulu" : "Tebak dulu"}</span>
        ))}
        {fase === "tebak" && <span className="rounded-full bg-white px-3 py-1" style={{ ...Tebal, fontSize: 14, boxShadow: BAYANG }}>{Math.min(giliran + 1, ronde.urutan.length)}/{ronde.urutan.length}</span>}
      </div>
      <Papan>
        {/* alat */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, alat.length)}, minmax(0,1fr))` }} role="group" aria-label="Alat">
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
                style={{ boxShadow: `${BAYANG}${ditunjuk ? `, 0 0 0 4px ${UNGU}` : bisa ? `, 0 0 0 3px ${KUNING}` : ""}`, background: on ? "linear-gradient(180deg,#fff9d6,#ffe98a)" : "#fff", filter: on ? "drop-shadow(0 0 14px rgba(255,210,63,.9))" : undefined }}
              >
                <span className={`${on && e === "🌀" ? "animate-spin" : ""} ${on && e === "📻" ? "akademi-shake" : ""}`} style={{ fontSize: 56, lineHeight: 1, filter: on && e === "💡" ? "brightness(1.3) drop-shadow(0 0 10px #ffd23f)" : on ? undefined : "grayscale(.6) opacity(.75)", display: "inline-block" }} aria-hidden>{e}</span>
                <span style={{ ...Tebal, fontSize: 14 }}>{nama(a.id)}</span>
                {ditunjuk && <span className="akademi-pop absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full text-white" style={{ ...Tebal, color: "#fff", background: UNGU, fontSize: 16 }}>?</span>}
                {on && e === "📻" && <span className="akademi-pop absolute top-2 right-3" style={{ fontSize: 20 }} aria-hidden>🎵</span>}
              </button>
            );
          })}
        </div>
        {/* kabel tersembunyi */}
        <div className="my-2 flex justify-center gap-6" aria-hidden>{alat.map((a) => <span key={a.id} style={{ ...Tebal, fontSize: 18, opacity: 0.35 }}>?</span>)}</div>
        {/* tombol */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, tombol.length)}, minmax(0,1fr))` }} role="group" aria-label="Tombol">
          {tombol.map((b) => {
            const warna = b.color ?? "#5b4bff";
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
                style={{ background: "#fff", boxShadow: `${BAYANG}${aktifTebak ? `, 0 0 0 4px ${KUNING}` : ""}`, opacity: fase === "tebak" && !aktifTebak ? 0.5 : 1 }}
              >
                <span className="flex size-14 items-center justify-center rounded-full" style={{ background: warna, boxShadow: `0 5px 0 rgba(0,0,0,.25), inset 0 -4px 0 rgba(0,0,0,.15)`, border: "4px solid #fff", outline: `3px solid ${warna}` }} aria-hidden>
                  {sudah && fase === "coba" && <Icon name="check" size={24} style={{ color: "#fff" }} />}
                </span>
                <span style={{ ...Tebal, fontSize: 13 }}>{nama(b.id)}</span>
              </button>
            );
          })}
        </div>
      </Papan>
      <div className="flex gap-2">
        <TombolBantu onClick={() => { bantu(); ucapkan(fase === "coba" ? "Ketuk semua tombol satu per satu, lalu lihat alat mana yang menyala." : "Ingat ingat. Waktu kamu coba tadi, tombol ini menyalakan alat yang mana?"); }} disabled={terkunci} />
        {fase === "coba" ? (
          <TombolBesar onClick={() => { sfx.open(); setFase("tebak"); }} disabled={terkunci || !semuaDicoba} warna={UNGU} bayang="#3b2fc0">
            <Icon name="arrow_forward" size={26} /> {semuaDicoba ? "Lanjut: Tebak dulu" : `Coba semua tombol (${dicoba.size}/${tombol.length})`}
          </TombolBesar>
        ) : (
          <div className="flex min-h-16 flex-1 items-center justify-center rounded-[20px] bg-white/70 px-3 text-center" style={{ ...Tebal, fontSize: 15, opacity: 0.8 }}>
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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const tanyaBerat = hewan?.value === 2;
  const tanya = tanyaBerat ? "Seberapa berat?" : "Seberapa panjang?";
  const teks = `${hewan ? nama(hewan.id) : "Hewan"} bertanya: ${tanya} Pilih alat yang tepat.`;
  const jenisAlat = (a: Item) => (emojiAlat(a, a.id) === "⚖️" || a.id.includes("timbang") ? "timbangan" : "penggaris");
  const dipakai = dipilih ? itemById(dipilih) : undefined;
  const jenisDipakai = dipakai ? jenisAlat(dipakai) : null;

  const pilih = (id: string) => {
    if (terkunci || dipilih) return;
    setDipilih(id);
    sfx.pick();
    timer.current = setTimeout(() => onJawab({ pilih: id }), 1500);
  };

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} anak={<span><span style={{ color: UNGU }}>{hewan ? nama(hewan.id) : "Hewan"}</span>: {tanya}</span>} />
      <Umpan hasil={hasil} benar={ronde.correctId ? `${nama(ronde.correctId)} untuk ${tanyaBerat ? "berat" : "panjang"}` : "-"} />
      <Papan>
        <div className="relative mx-auto flex h-52 w-full max-w-[420px] flex-col items-center justify-end">
          {/* balon pertanyaan */}
          <div className="absolute top-0 right-2 rounded-[14px] bg-white px-3 py-1 akademi-pop" style={{ ...Tebal, fontSize: 15, boxShadow: BAYANG }}>{tanyaBerat ? "⚖️ berat?" : "📏 panjang?"}</div>
          {/* hewan */}
          <div className="relative z-10 transition-transform duration-700 ease-in-out" style={{ transform: jenisDipakai === "timbangan" ? "translateY(-6px)" : "none" }}>
            <Benda v={visual(hewan?.id ?? "")} size={96} />
          </div>
          {/* penggaris kubus masuk di bawah hewan */}
          <div className="flex h-9 overflow-hidden transition-all duration-700 ease-out" style={{ width: jenisDipakai === "penggaris" ? 240 : 0, opacity: jenisDipakai === "penggaris" ? 1 : 0 }} aria-hidden>
            {Array.from({ length: 6 }, (_, k) => <div key={k} className="flex size-9 shrink-0 items-center justify-center" style={{ background: ["#ff8fa3", "#ffd23f", "#7ec8a0", "#6ab0e8", "#c59be8", "#ffb86b"][k], ...Tebal, fontSize: 14, borderRight: "2px solid #fff" }}>{k + 1}</div>)}
          </div>
          {/* timbangan naik dari bawah */}
          <div className="transition-all duration-700 ease-out" style={{ height: jenisDipakai === "timbangan" ? 44 : 0, opacity: jenisDipakai === "timbangan" ? 1 : 0, overflow: "hidden" }} aria-hidden>
            <div className="mx-auto h-3 w-40 rounded-full" style={{ background: "#8a7ac9" }} />
            <div className="mx-auto mt-1 flex h-7 w-24 items-center justify-center rounded-b-[14px] text-white" style={{ background: "#6d5fb3", ...Tebal, color: "#fff", fontSize: 13 }}>{hewan?.value === 2 ? "berat" : "…"}</div>
          </div>
        </div>
        {hint && <div className="akademi-fade text-center" style={{ ...Tebal, fontSize: 15, opacity: 0.75 }}>{tanyaBerat ? "Berat diukur dengan timbangan." : "Panjang diukur dengan penggaris."}</div>}
      </Papan>
      <div className="flex gap-2">
        <TombolBantu onClick={() => { bantu(); ucapkan(tanyaBerat ? "Kalau mau tahu berat, pakai timbangan." : "Kalau mau tahu panjang, pakai penggaris."); }} disabled={terkunci || !!dipilih} />
        <div className="grid flex-1 grid-cols-2 gap-2">
          {alat.map((a) => (
            <button
              key={a.id}
              type="button"
              disabled={terkunci || !!dipilih}
              onClick={() => pilih(a.id)}
              aria-label={nama(a.id)}
              className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-[20px] bg-white active:scale-95 ${hint && a.id === ronde.correctId ? "akademi-bounce" : ""}`}
              style={{ boxShadow: `${BAYANG}, 0 0 0 3px ${hasil && a.id === ronde.correctId ? BENAR : hasil && a.id === dipilih ? SALAH : dipilih === a.id ? UNGU : "transparent"}`, opacity: dipilih && dipilih !== a.id ? 0.5 : 1 }}
            >
              <span style={{ fontSize: 52, lineHeight: 1 }} aria-hidden>{emojiAlat(a, a.id)}</span>
              <span style={{ ...Tebal, fontSize: 14 }}>{nama(a.id)}</span>
            </button>
          ))}
        </div>
      </div>
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
  const jumlah = (tp: Tempat) => tempat.filter((x) => x === tp).length;
  const kiri = jumlah("kiri"), kanan = jumlah("kanan"), sisa = jumlah("keranjang");
  const teks = "Bagi ikan untuk dua kucing sama banyak. Ketuk piring, lalu ketuk ikan.";

  const pindah = (i: number) => {
    if (terkunci) return;
    setTempat((tp) => tp.map((x, k) => (k !== i ? x : x === "keranjang" ? aktif : "keranjang")));
    if (tempat[i] === "keranjang") sfx.pick(); else sfx.plop();
  };

  const piring = (sisi: "kiri" | "kanan") => {
    const n = jumlah(sisi);
    const aktifIni = aktif === sisi;
    const kurang = hint && n < (sisi === "kiri" ? kanan : kiri);
    return (
      <div className={`flex flex-col items-center gap-1 rounded-[22px] p-2 ${kurang ? "akademi-bounce" : ""}`} style={{ background: aktifIni ? "rgba(255,210,63,.35)" : "rgba(255,255,255,.4)", boxShadow: aktifIni ? `0 0 0 4px ${KUNING}` : "none" }}>
        <button type="button" disabled={terkunci} onClick={() => { sfx.tap(); setAktif(sisi); }} aria-label={`Pilih piring ${sisi}${aktifIni ? " (aktif)" : ""}, ${n} ikan`} aria-pressed={aktifIni} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[16px] bg-white active:scale-95" style={{ boxShadow: BAYANG }}>
          <span style={{ fontSize: 40, lineHeight: 1 }} aria-hidden>{sisi === "kiri" ? "🐱" : "🐈"}</span>
          <span style={{ ...Tebal, fontSize: 15 }}>Kucing {sisi}</span>
          <span className="rounded-full px-2" style={{ ...Tebal, fontSize: 20, background: hasil ? (kiri === kanan && kiri + kanan === ronde.target ? "#e4f8ee" : "#ffe9ec") : "#fff1c2" }}>{n}</span>
        </button>
        <div className="flex min-h-[72px] w-full flex-wrap items-center justify-center gap-1 rounded-[18px]" style={{ background: "radial-gradient(ellipse at center,#fff 55%,#e3e6f3 56%,#fff 60%)", boxShadow: "inset 0 0 0 3px #d4d8ea" }} aria-label={`Piring ${sisi}: ${n} ikan`}>
          {tempat.map((tp, i) => tp === sisi && <KartuBenda key={i} v={v} size={36} onClick={() => pindah(i)} className="min-h-14 min-w-14 akademi-pop" />)}
          {n === 0 && <span className="text-[13px] font-bold opacity-50">kosong</span>}
        </div>
      </div>
    );
  };

  return (
    <Kunci terkunci={terkunci}>
      <Instruksi teks={teks} hasil={hasil} />
      <Umpan hasil={hasil} benar={`${ronde.target / 2} dan ${ronde.target / 2}`} />
      <Papan>
        <div className="rounded-[22px] p-3" style={{ background: "linear-gradient(180deg,#f7e2b6,#e9c98a)", boxShadow: "0 5px 0 #b48a4e" }}>
          <div className="mb-1 flex items-center gap-2" style={{ ...Tebal, fontSize: 16 }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>🧺</span>
            <span>Keranjang</span>
            <span className="ml-auto rounded-full bg-white/80 px-3" style={{ fontSize: 18 }}>{sisa}</span>
          </div>
          <div className="flex min-h-[72px] flex-wrap items-center justify-center gap-2">
            {sisa === 0 && <span className="w-full text-center text-[14px] font-bold opacity-60">Keranjang kosong</span>}
            {tempat.map((tp, i) => tp === "keranjang" && <KartuBenda key={i} v={v} size={40} onClick={() => pindah(i)} className={`min-h-14 min-w-14 ${hint ? "akademi-bounce" : ""}`} />)}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {piring("kiri")}
          {piring("kanan")}
        </div>
        {hint && <div className="akademi-fade mt-2 text-center" style={{ ...Tebal, fontSize: 15, opacity: 0.75 }}>Satu untuk kiri, satu untuk kanan, bergantian sampai habis.</div>}
      </Papan>
      <div className="flex gap-2">
        <TombolBantu onClick={() => { bantu(); ucapkan("Satu untuk kucing kiri, satu untuk kucing kanan, bergantian sampai keranjang kosong."); }} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ kiri, kanan }); }} disabled={terkunci || kiri + kanan === 0}><Icon name="balance" size={26} /> Sudah adil</TombolBesar>
      </div>
    </Kunci>
  );
}
