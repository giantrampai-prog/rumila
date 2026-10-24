"use client";

// Presenter mekanik "pilah": kelompok (ketuk/seret item ke bin) dan pilih (sentuh satu pilihan benar).
// Hanya menampilkan ronde dan mengirim jawaban; penilaian oleh runner (lihat docs/akademi/slice-1-kontrak.md §4).

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import type { PaketPilah } from "@akademi/schema";
import type { JawabanPilah, RondePilah, RondePilahKelompok, RondePilahPilih } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import { sfx } from "@/lib/sfx";
import { Benda, KartuBenda, type VisualSpec } from "./benda";
import { BALOO, BENAR, INK, type PresenterProps } from "./jenis";

type Props = PresenterProps<RondePilah, JawabanPilah, PaketPilah>;
type ItemPilah = PaketPilah["items"][number];
type BinPilah = PaketPilah["bins"][number];

const SOROT = "#ffd23f";
const UNGU = "#0786eb";

/** Visual dari field paket; label dipakai Benda hanya bila tidak ada emoji/bentuk (mis. kartu angka). */
function visual(x: { emoji?: string; color?: string; scale?: number; count?: number; shape?: VisualSpec["shape"]; width?: number; labelKey: string }, t: (k: string) => string): VisualSpec {
  return { emoji: x.emoji, color: x.color, scale: x.scale, count: x.count, shape: x.shape, width: x.width, label: t(x.labelKey) };
}

/** Tombol "Bantu" kecil (≥56px) di pojok kanan area permainan. */
function TombolBantu({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Bantu"
      className="flex h-14 shrink-0 items-center gap-1.5 rounded-full bg-white pr-4 pl-3 text-[#0b2545] shadow-[0_4px_0_rgba(11,37,69,.12)] active:translate-y-0.5 disabled:opacity-40"
      style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800 }}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-[#ffd23f]">
        <Icon name="lightbulb" size={22} />
      </span>
      Bantu
    </button>
  );
}

export function PresenterPilah(props: Props) {
  if (props.ronde.mode === "pilih") return <Pilih {...props} ronde={props.ronde} />;
  return <Kelompok {...props} ronde={props.ronde} />;
}

/* ---------------- mode kelompok ---------------- */

interface Seret {
  id: string;
  x: number;
  y: number;
  sx: number;
  sy: number;
  /** sudah bergerak cukup jauh → dianggap seret, bukan ketuk */
  aktif: boolean;
  binHover: string | null;
}

function Kelompok({ ronde, t, onJawab, onHint, hasil }: Omit<Props, "ronde"> & { ronde: RondePilahKelompok }) {
  const { bins, items } = ronde;
  const [peta, setPeta] = useState<Record<string, string>>({});
  const [terpilih, setTerpilih] = useState<string | null>(null);
  const [hint, setHint] = useState<{ item: string; bin: string } | null>(null);
  const [seret, setSeret] = useState<Seret | null>(null);
  const seretRef = useRef<Seret | null>(null);
  const binRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const terkirim = useRef(false);
  const kunci = !!hasil;

  // reset saat ronde berganti
  useEffect(() => {
    setPeta({});
    setTerpilih(null);
    setHint(null);
    setSeret(null);
    seretRef.current = null;
    terkirim.current = false;
  }, [ronde]);

  // semua item sudah di bin → kirim jawaban otomatis
  useEffect(() => {
    if (kunci || terkirim.current) return;
    if (items.length > 0 && items.every((i) => peta[i.id])) {
      terkirim.current = true;
      onJawab(peta);
    }
  }, [peta, items, kunci, onJawab]);

  const taruh = (itemId: string, binId: string) => {
    if (kunci) return;
    sfx.plop();
    setPeta((p) => ({ ...p, [itemId]: binId }));
    setTerpilih(null);
    if (hint?.item === itemId) setHint(null);
  };
  const ambil = (itemId: string) => {
    if (kunci) return;
    sfx.whoosh();
    setPeta((p) => {
      const q = { ...p };
      delete q[itemId];
      return q;
    });
    setTerpilih(itemId);
  };
  const ketukItem = (itemId: string) => {
    if (kunci) return;
    sfx.tap();
    setTerpilih((s) => (s === itemId ? null : itemId));
  };
  const ketukBin = (binId: string) => {
    if (kunci || !terpilih) return;
    taruh(terpilih, binId);
  };

  const binDi = (x: number, y: number): string | null => {
    for (const b of bins) {
      const el = binRefs.current[b.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return b.id;
    }
    return null;
  };

  const turun = (e: RPointerEvent<Element>, id: string) => {
    if (kunci) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const s: Seret = { id, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, aktif: false, binHover: null };
    seretRef.current = s;
    setSeret(s);
  };
  const gerak = (e: RPointerEvent<HTMLElement>, id: string) => {
    const s = seretRef.current;
    if (!s || s.id !== id) return;
    const aktif = s.aktif || Math.hypot(e.clientX - s.sx, e.clientY - s.sy) > 10;
    const n: Seret = { ...s, x: e.clientX, y: e.clientY, aktif, binHover: aktif ? binDi(e.clientX, e.clientY) : null };
    seretRef.current = n;
    setSeret(n);
  };
  const lepas = (e: RPointerEvent<HTMLElement>, id: string) => {
    const s = seretRef.current;
    seretRef.current = null;
    setSeret(null);
    if (!s || s.id !== id) return;
    if (s.aktif) {
      const b = binDi(e.clientX, e.clientY);
      if (b) taruh(id, b);
      else sfx.thud();
    } else ketukItem(id);
  };
  const batal = () => {
    seretRef.current = null;
    setSeret(null);
  };

  const bantu = () => {
    if (kunci) return;
    onHint?.();
    // item yang belum di bin, atau yang salah tempat
    const target = items.find((i) => !peta[i.id]) ?? items.find((i) => peta[i.id] !== i.bin);
    if (target) setHint({ item: target.id, bin: target.bin });
  };

  const lepasDiAtas = items.filter((i) => !peta[i.id]);
  const salah = (i: ItemPilah) => kunci && peta[i.id] !== i.bin;
  const benarBin = (b: BinPilah) => kunci && items.some((i) => peta[i.id] === b.id) && items.filter((i) => peta[i.id] === b.id).every((i) => i.bin === b.id);
  const n = bins.length;
  const kolomBin = n <= 3 ? ["", "grid-cols-1", "grid-cols-2", "grid-cols-3"][n] : "grid-cols-2 sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]";
  const itemSeret = seret?.aktif ? items.find((i) => i.id === seret.id) : undefined;

  return (
    <div className="flex flex-col gap-3" style={{ color: INK }}>
      {/* item yang belum dipilah */}
      <div className="relative rounded-[24px] bg-white/70 p-3 shadow-[0_4px_0_rgba(11,37,69,.08)]" style={{ minHeight: 120 }}>
        <div className="absolute top-2 right-2 z-10">
          <TombolBantu onClick={bantu} disabled={kunci} />
        </div>
        <div className="grid gap-2 pr-0 sm:pr-32" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))"}}>
          {lepasDiAtas.map((i) => {
            const dipilih = terpilih === i.id;
            const disorot = hint?.item === i.id;
            const sedangDiseret = seret?.aktif && seret.id === i.id;
            return (
              // pointer capture di tombol; move/up menggelembung ke pembungkus ini
              <div key={i.id} className="flex" onPointerMove={(e) => gerak(e, i.id)} onPointerUp={(e) => lepas(e, i.id)} onPointerCancel={batal}>
                <KartuBenda
                  v={visual(i, t)}
                  size={64}
                  selected={dipilih}
                  onPointerDown={(e) => turun(e, i.id)}
                  className={`w-full min-h-[76px] min-w-[76px] touch-none select-none ${disorot ? "akademi-bounce" : ""}`}
                  style={{
                    transform: dipilih ? "scale(1.12)" : undefined,
                    opacity: sedangDiseret ? 0.25 : 1,
                    boxShadow: disorot ? `0 4px 0 rgba(11,37,69,.12), 0 0 0 4px ${SOROT}` : undefined,
                    zIndex: dipilih ? 2 : undefined,
                  }}
                />
              </div>
            );
          })}
          {lepasDiAtas.length === 0 && (
            <div className="col-span-full flex h-[76px] items-center justify-center" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, opacity: 0.6 }}>
              Semua sudah dipilah
            </div>
          )}
        </div>
      </div>

      {/* bin berjajar */}
      <div className={`grid gap-2 ${kolomBin}`} style={{ ["--n" as string]: n } as CSSProperties}>
        {bins.map((b) => {
          const isi = items.filter((i) => peta[i.id] === b.id);
          const hover = seret?.binHover === b.id;
          const disorot = hint?.bin === b.id;
          const hijau = benarBin(b);
          const siap = !!terpilih && !kunci;
          const ring = hijau ? BENAR : hover ? UNGU : disorot ? SOROT : siap ? "rgba(91,75,255,.35)" : "transparent";
          return (
            <div
              key={b.id}
              ref={(el) => {
                binRefs.current[b.id] = el;
              }}
              role="button"
              tabIndex={0}
              onClick={() => ketukBin(b.id)}
              onKeyDown={(e) => e.key === "Enter" && ketukBin(b.id)}
              className={`flex min-h-[112px] flex-col rounded-[22px] bg-white p-2 transition-transform ${hover ? "scale-[1.04]" : ""} ${disorot ? "akademi-bounce" : ""}`}
              style={{ boxShadow: `0 5px 0 rgba(11,37,69,.12), 0 0 0 4px ${ring}`, background: hijau ? "#e6f8ef" : undefined }}
            >
              <div className="flex items-center justify-center gap-2 px-1">
                <Benda v={visual(b, t)} size={40} />
                <span className="truncate" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, lineHeight: 1.1 }}>
                  {t(b.labelKey)}
                </span>
              </div>
              <div className="mt-1 flex min-h-[52px] flex-1 items-center gap-1 overflow-x-auto rounded-[14px] bg-[#f4efe6] px-1.5 py-1" style={{ scrollbarWidth: "none" }}>
                {isi.map((i) => (
                  <KartuBenda
                    key={i.id}
                    v={visual(i, t)}
                    size={30}
                    wrong={salah(i)}
                    right={kunci && !salah(i)}
                    onClick={() => ambil(i.id)}
                    className={`min-h-[44px] min-w-[44px] shrink-0 ${salah(i) ? "akademi-shake" : ""}`}
                    style={{ pointerEvents: kunci ? "none" : undefined }}
                  />
                ))}
                {isi.length === 0 && <span className="w-full text-center" style={{ fontSize: 22, opacity: 0.35 }}>⬇</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* bayangan item yang sedang diseret */}
      {itemSeret && seret && (
        <div className="pointer-events-none fixed z-50" style={{ left: seret.x, top: seret.y, transform: "translate(-50%,-60%) scale(1.15)" }}>
          <span className="flex items-center justify-center rounded-[18px] bg-white p-2" style={{ boxShadow: `0 8px 0 rgba(11,37,69,.18), 0 0 0 3px ${UNGU}` }}>
            <Benda v={visual(itemSeret, t)} size={64} />
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------------- mode pilih ---------------- */

function Pilih({ ronde, t, onJawab, onHint, hasil }: Omit<Props, "ronde"> & { ronde: RondePilahPilih }) {
  const { choices, correct, promptKey } = ronde;
  const [dipilih, setDipilih] = useState<string | null>(null);
  const [redup, setRedup] = useState<string | null>(null);
  const kunci = !!hasil || dipilih !== null;

  useEffect(() => {
    setDipilih(null);
    setRedup(null);
  }, [ronde]);

  const pilih = (id: string) => {
    if (kunci) return;
    sfx.tap();
    setDipilih(id);
    onJawab(id);
  };
  const bantu = () => {
    if (kunci) return;
    onHint?.();
    const s = choices.find((c) => c.id !== correct && c.id !== redup);
    if (s) setRedup(s.id);
  };

  const n = choices.length;
  const kolom = n === 2 ? "grid-cols-2" : n === 3 ? "grid-cols-3" : n === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3";
  const ukuran = n <= 2 ? 96 : n <= 4 ? 84 : 72;

  return (
    <div className="flex flex-col gap-3" style={{ color: INK }}>
      <div className="flex items-start gap-2">
        <div className="flex-1 rounded-[22px] bg-white px-4 py-3 text-center shadow-[0_4px_0_rgba(11,37,69,.1)]" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 900, lineHeight: 1.15 }}>
          {t(promptKey)}
        </div>
        <TombolBantu onClick={bantu} disabled={kunci} />
      </div>
      <div className={`grid gap-3 ${kolom}`}>
        {choices.map((c) => {
          const benar = !!hasil && c.id === correct;
          const salah = !!hasil && dipilih === c.id && c.id !== correct;
          return (
            <KartuBenda
              key={c.id}
              v={visual(c, t)}
              size={ukuran}
              selected={!hasil && dipilih === c.id}
              right={benar}
              wrong={salah}
              dim={redup === c.id && !hasil}
              onClick={() => pilih(c.id)}
              className={`min-h-[120px] ${salah ? "akademi-shake" : ""} ${benar ? "akademi-pop" : ""}`}
              style={{ background: benar ? "#e6f8ef" : salah ? "#ffe9ec" : undefined, pointerEvents: kunci ? "none" : undefined }}
            />
          );
        })}
      </div>
    </div>
  );
}
