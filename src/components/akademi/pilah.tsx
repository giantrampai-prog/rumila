"use client";

// Presenter mekanik "pilah": kelompok (ketuk/seret item ke bin) dan pilih (sentuh satu pilihan benar).
// Hanya menampilkan ronde dan mengirim jawaban; penilaian oleh runner (lihat docs/akademi/slice-1-kontrak.md §4).

import { bentukDariTeks } from "@/lib/akademi/tema-dunia";
import { sfxAkademi } from "@/lib/sfx-akademi";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import { createPortal } from "react-dom";
import { levelIndex, type PaketPilah } from "@akademi/schema";
import type { JawabanPilah, RondePilah, RondePilahKelompok, RondePilahPilih } from "@akademi/mechanics";
import { useModeUjian } from "./mode-ujian";
import { Icon } from "@/components/ui";
import { sfx } from "@/lib/sfx";
import { Benda, KartuBenda, type VisualSpec } from "./benda";
import { usePanggung } from "./dunia";
import { Wadah } from "./wadah";
import { BALOO, BENAR, INK, type PresenterProps } from "./jenis";

type Props = PresenterProps<RondePilah, JawabanPilah, PaketPilah>;
type ItemPilah = PaketPilah["items"][number];
type BinPilah = PaketPilah["bins"][number];

const SOROT = "#ffd23f";
const UNGU = "#0786eb";

/** Visual dari field paket; label dipakai Benda hanya bila tidak ada emoji/bentuk (mis. kartu angka). */
function visual(x: { emoji?: string; color?: string; scale?: number; count?: number; kolom?: number; shape?: VisualSpec["shape"]; width?: number; angka?: string; labelKey: string }, t: (k: string) => string): VisualSpec {
  return { emoji: x.emoji, color: x.color, scale: x.scale, count: x.count, kolom: x.kolom, shape: x.shape, width: x.width, angka: x.angka, label: t(x.labelKey) };
}

/** Tombol "Bantu" kecil (≥56px) di pojok kanan area permainan. */
function TombolBantu({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  if (useModeUjian()) return null;
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
  const { tema, skala: sk } = usePanggung();

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
    sfxAkademi.taruh();
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
      else sfxAkademi.tolak();
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
  // kartu bergambar berlabel panjang (deskripsi) dibuat lebih lebar supaya teksnya tidak terlipat terlalu banyak
  const lebarKartu = Math.round((items.some((i) => (i.emoji || i.shape) && t(i.labelKey).length > 18) ? 132 : 76) * sk);

  return (
    <div className="flex flex-1 flex-col gap-3" style={{ color: INK }}>
      {/* tombol Bantu di atas area benda, tidak menutupi kartu di layar sempit */}
      <div className="-mb-1 flex justify-end">
        <TombolBantu onClick={bantu} disabled={kunci} />
      </div>
      {/* item yang belum dipilah */}
      <div className="relative rounded-[24px] p-3 shadow-[0_5px_0_rgba(11,37,69,.12)]" style={{ minHeight: 120 * sk, background: `${tema.panel}e6`, boxShadow: `0 5px 0 rgba(11,37,69,.12), inset 0 0 0 3px ${tema.aksen}33` }}>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${lebarKartu}px, 1fr))` }}>
          {lepasDiAtas.map((i) => {
            const dipilih = terpilih === i.id;
            const disorot = hint?.item === i.id;
            const sedangDiseret = seret?.aktif && seret.id === i.id;
            return (
              // pointer capture di tombol; move/up menggelembung ke pembungkus ini
              <div key={i.id} className="flex" onPointerMove={(e) => gerak(e, i.id)} onPointerUp={(e) => lepas(e, i.id)} onPointerCancel={batal}>
                <KartuBenda
                  v={visual(i, t)}
                  size={Math.round(64 * sk)}
                  labelSize={Math.round(13 * sk)}
                  selected={dipilih}
                  onPointerDown={(e) => turun(e, i.id)}
                  className={`w-full touch-none select-none ${disorot ? "akademi-bounce" : ""}`}
                  style={{
                    minHeight: 76 * sk,
                    minWidth: 76 * sk,
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

      {/* wadah berjajar, mengisi sisa tinggi panggung */}
      <div className={`grid flex-1 gap-3 ${kolomBin}`} style={{ ["--n" as string]: n, gap: 12 * sk } as CSSProperties}>
        {bins.map((b) => {
          const isi = items.filter((i) => peta[i.id] === b.id);
          const hover = seret?.binHover === b.id;
          const disorot = hint?.bin === b.id;
          const hijau = benarBin(b);
          const siap = !!terpilih && !kunci;
          const ring = hijau ? BENAR : hover ? "#ffd23f" : disorot ? SOROT : siap ? "rgba(255,255,255,.85)" : "transparent";
          return (
            <Wadah
              key={b.id}
              ref={(el) => {
                binRefs.current[b.id] = el;
              }}
              role="button"
              tabIndex={0}
              onClick={() => ketukBin(b.id)}
              onKeyDown={(e) => e.key === "Enter" && ketukBin(b.id)}
              className={`${hover ? "scale-[1.04]" : ""} ${disorot ? "akademi-bounce" : ""}`}
              style={{ minHeight: 132 * sk }}
              ring={ring}
              hijau={hijau}
              bentuk={bentukDariTeks(t(b.labelKey)) ?? undefined}
              label={
                <>
                  <Benda v={visual(b, t)} size={Math.round(34 * sk)} />
                  <span className="text-center break-words">{t(b.labelKey)}</span>
                </>
              }
            >
              {isi.map((i) => (
                <KartuBenda
                  key={i.id}
                  v={visual(i, t)}
                  size={Math.round(34 * sk)}
                  keterangan={false}
                  wrong={salah(i)}
                  right={kunci && !salah(i)}
                  onClick={() => ambil(i.id)}
                  className={`shrink-0 ${salah(i) ? "akademi-shake" : ""}`}
                  style={{ minHeight: 46 * sk, minWidth: 46 * sk, pointerEvents: kunci ? "none" : undefined }}
                />
              ))}
              {isi.length === 0 && <span aria-hidden className="w-full text-center" style={{ fontFamily: BALOO, fontSize: 30 * sk, fontWeight: 900, lineHeight: 1, color: tema.wadahGelap }}>↓</span>}
            </Wadah>
          );
        })}
      </div>

      {/* di-portal ke body: leluhur ber-transform/filter membuat "fixed" melenceng dari jari */}
      {itemSeret && seret && typeof document !== "undefined" && createPortal(
        <div className="pointer-events-none fixed z-[100]" style={{ left: seret.x, top: seret.y, transform: "translate(-50%,-60%) scale(1.15)" }}>
          <span className="flex items-center justify-center rounded-[18px] bg-white p-2" style={{ boxShadow: `0 8px 0 rgba(11,37,69,.18), 0 0 0 3px ${UNGU}` }}>
            <Benda v={visual(itemSeret, t)} size={64} />
          </span>
        </div>,
        document.body,
      )}
    </div>
  );
}

/* ---------------- mode pilih ---------------- */

function Pilih({ paket, ronde, t, onJawab, onHint, hasil }: Omit<Props, "ronde"> & { ronde: RondePilahPilih }) {
  const { choices, correct, promptKey } = ronde;
  // Teks di bawah gambar pilihan mulai SD 1; di PAUD–TK (belum membaca) kata di kartu bisa membocorkan jawaban soal "tunjuk X".
  const tulisLabel = levelIndex(paket.level) >= levelIndex("SD1");
  const [dipilih, setDipilih] = useState<string | null>(null);
  const [redup, setRedup] = useState<string | null>(null);
  const kunci = !!hasil || dipilih !== null;
  const { tema, skala: sk, h } = usePanggung();

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
  const baris = Math.ceil(n / (n === 2 ? 2 : n === 3 ? 3 : n === 4 ? 4 : 3));
  // gambar pilihan ikut tinggi kartu: di tablet kartu tinggi, jadi emoji kecil di tengah kartu besar terasa kosong
  const tinggiBaris = h > 0 ? (h - 90 * sk - 14 * sk * (baris - 1)) / baris : 0;
  const ukuran = Math.round(Math.min(200, Math.max((n <= 2 ? 110 : n <= 4 ? 92 : 76) * sk, tinggiBaris * (tulisLabel ? 0.4 : 0.5))));

  return (
    <div className="flex flex-1 flex-col gap-3" style={{ color: INK }}>
      <div className="flex items-start gap-2">
        <div className="flex-1 rounded-[22px] bg-white px-4 py-3 text-center shadow-[0_4px_0_rgba(11,37,69,.1)]" style={{ fontFamily: BALOO, fontSize: 24 * Math.min(sk, 1.3), fontWeight: 900, lineHeight: 1.15, boxShadow: `0 4px 0 rgba(11,37,69,.1), inset 0 0 0 3px ${tema.aksen}33` }}>
          {t(promptKey)}
        </div>
        <TombolBantu onClick={bantu} disabled={kunci} />
      </div>
      {/* pilihan mengisi sisa panggung: kartu besar di tablet, tetap rapat di HP */}
      <div className={`grid flex-1 ${kolom}`} style={{ gap: 14 * sk, gridAutoRows: sk > 1 ? `minmax(${Math.round(120 * sk)}px, 1fr)` : undefined }}>
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
              keterangan={tulisLabel}
              labelSize={Math.round(14 * sk)}
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
