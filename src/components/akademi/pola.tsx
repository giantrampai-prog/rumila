"use client";

// Presenter mekanik "pola": lanjut (isi slot kosong di ujung), perbaiki (ganti satu unsur yang tertukar),
// cipta (pilih benda lalu susun pola berulang sendiri). Deret tampil sebagai kalung/pagar kotak berjajar dan
// juga dibunyikan sebagai nada (paket.nada) supaya kesalahan "terdengar".
// Presenter hanya menampilkan ronde dan mengirim jawaban; penilaian oleh runner (docs/akademi/slice-1-kontrak.md §4–5).

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { PaketPola } from "@akademi/schema";
import type { JawabanPola, RondePola } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import { sfx } from "@/lib/sfx";
import { Benda, KartuBenda, type VisualSpec } from "./benda";
import { BALOO, BENAR, INK, SALAH, type PresenterProps } from "./jenis";

type Props = PresenterProps<RondePola, JawabanPola, PaketPola>;
type ItemPola = PaketPola["items"][number];

const SOROT = "#ffd23f";
const UNGU = "#0786eb";
const EMAS = "#f5b942";

/* ---------------- nada (WebAudio sederhana) ---------------- */

const FREK: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5,
};
/** nada cadangan bila paket.nada tidak menyebut benda itu (urut indeks palette) */
const NADA_CADANGAN = ["C4", "E4", "G4", "C5", "D4", "A4", "F4", "E5"];
const NADA_MS = 220;
const JARAK_MS = 260;

let audioCtx: AudioContext | null = null;
function ambilAudio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") void audioCtx.resume().catch(() => {});
  return audioCtx;
}

function bunyikan(ctx: AudioContext, freq: number, mulai: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const dur = NADA_MS / 1000;
  gain.gain.setValueAtTime(0.0001, mulai);
  gain.gain.exponentialRampToValueAtTime(0.35, mulai + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, mulai + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(mulai);
  osc.stop(mulai + dur + 0.02);
}

/**
 * Mainkan urutan benda sebagai nada; `onLangkah(i)` dipanggil saat unsur ke-i berbunyi (null = selesai).
 * Mengembalikan fungsi pembatal (hentikan sorotan; bunyi yang sudah terjadwal tetap selesai, pendek).
 */
function mainkanNada(urutan: (string | null)[], frek: (id: string) => number, onLangkah?: (i: number | null) => void): () => void {
  const ctx = ambilAudio();
  const t0 = ctx ? ctx.currentTime + 0.03 : 0;
  const timer: ReturnType<typeof setTimeout>[] = [];
  let n = 0;
  urutan.forEach((id, i) => {
    if (id === null) return;
    const k = n++;
    if (ctx) bunyikan(ctx, frek(id), t0 + (k * JARAK_MS) / 1000);
    timer.push(setTimeout(() => onLangkah?.(i), k * JARAK_MS));
  });
  timer.push(setTimeout(() => onLangkah?.(null), n * JARAK_MS + 40));
  return () => timer.forEach(clearTimeout);
}

/* ---------------- util ---------------- */

/** Visual dari field paket; label dipakai Benda hanya bila tidak ada emoji/bentuk. */
function visual(x: ItemPola, t: (k: string) => string): VisualSpec {
  return { emoji: x.emoji, color: x.color, scale: x.scale, count: x.count, shape: x.shape, width: x.width, label: t(x.labelKey) };
}

/** Tombol "Bantu" kecil (≥56px), sama gayanya dengan presenter lain. */
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

/** Tombol aksi besar (≥56px) warna ungu/hijau. */
function TombolBesar({ children, onClick, disabled, warna = UNGU, className = "" }: { children: ReactNode; onClick: () => void; disabled?: boolean; warna?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-14 min-w-[56px] items-center justify-center gap-2 rounded-full px-6 text-white transition-transform active:translate-y-0.5 disabled:opacity-40 ${className}`}
      style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 900, background: warna, boxShadow: "0 5px 0 rgba(11,37,69,.18)" }}
    >
      {children}
    </button>
  );
}

/* ---------------- presenter ---------------- */

export function PresenterPola({ paket, ronde, t, onJawab, onHint, hasil }: Props) {
  const { mode, palette, correct, shown, wrongIndex, unitLen } = ronde;
  const butuhPilih = ronde.pilih ?? unitLen;

  const [urutan, setUrutan] = useState<(string | null)[]>(shown);
  const [slotPilih, setSlotPilih] = useState<number | null>(null);
  const [bendaCipta, setBendaCipta] = useState<string[]>([]);
  const [ubah, setUbah] = useState(0);
  const [hint, setHint] = useState<{ slot?: number; item?: string } | null>(null);
  const [bunyiIdx, setBunyiIdx] = useState<number | null>(null);
  const [sedangMain, setSedangMain] = useState(false);
  const terkirim = useRef(false);
  const batalNada = useRef<(() => void) | null>(null);
  const kunci = !!hasil || terkirim.current;

  const frek = useCallback(
    (id: string) => {
      const nama = paket.nada[id] ?? NADA_CADANGAN[Math.max(0, palette.findIndex((p) => p.id === id)) % NADA_CADANGAN.length];
      return FREK[nama] ?? FREK.C4;
    },
    [paket.nada, palette],
  );

  const putar = useCallback(
    (u: (string | null)[]) => {
      batalNada.current?.();
      if (u.every((x) => x === null)) return;
      setSedangMain(true);
      batalNada.current = mainkanNada(u, frek, (i) => {
        setBunyiIdx(i);
        if (i === null) setSedangMain(false);
      });
    },
    [frek],
  );

  // reset saat ronde berganti + mainkan unsur yang terlihat
  useEffect(() => {
    setUrutan(shown);
    setSlotPilih(null);
    setBendaCipta([]);
    setUbah(0);
    setHint(null);
    setBunyiIdx(null);
    terkirim.current = false;
    const id = setTimeout(() => putar(shown), 350);
    return () => {
      clearTimeout(id);
      batalNada.current?.();
      batalNada.current = null;
      setSedangMain(false);
    };
  }, [ronde, shown, putar]);

  const kirim = useCallback(
    (u: (string | null)[]) => {
      if (terkirim.current || u.some((x) => x === null)) return;
      terkirim.current = true;
      setSlotPilih(null);
      setHint(null);
      putar(u);
      onJawab(u as string[]);
    },
    [onJawab, putar],
  );

  // lanjut: semua slot terisi → kirim otomatis
  useEffect(() => {
    if (mode !== "lanjut" || hasil || terkirim.current) return;
    if (urutan.length > 0 && urutan.every((x) => x !== null)) kirim(urutan);
  }, [mode, urutan, hasil, kirim]);

  const fasePilih = mode === "cipta" && bendaCipta.length < butuhPilih;
  const slotAsli = (i: number) => mode === "lanjut" && shown[i] !== null;
  const slotKosongPertama = urutan.findIndex((x) => x === null);

  const isi = (i: number, id: string) => {
    sfx.plop();
    setUrutan((u) => u.map((x, k) => (k === i ? id : x)));
    setSlotPilih(null);
    if (hint?.slot === i) setHint(null);
  };

  const ketukSlot = (i: number) => {
    if (kunci) return;
    if (slotAsli(i) || fasePilih) {
      sfx.thud();
      return;
    }
    if (mode === "perbaiki") {
      sfx.tap();
      setSlotPilih((s) => (s === i ? null : i));
      return;
    }
    // lanjut / cipta: slot terisi → kosongkan; slot kosong → pilih
    if (urutan[i] !== null) {
      sfx.pick();
      setUrutan((u) => u.map((x, k) => (k === i ? null : x)));
      setSlotPilih(i);
    } else {
      sfx.tap();
      setSlotPilih((s) => (s === i ? null : i));
    }
  };

  const ketukPalette = (id: string) => {
    if (kunci) return;
    if (mode === "cipta" && fasePilih) {
      sfx.tap();
      setBendaCipta((b) => (b.includes(id) ? b.filter((x) => x !== id) : b.length < butuhPilih ? [...b, id] : b));
      return;
    }
    if (mode === "cipta" && !bendaCipta.includes(id)) {
      sfx.thud();
      return;
    }
    if (mode === "perbaiki") {
      if (slotPilih === null) {
        sfx.thud();
        return;
      }
      if (urutan[slotPilih] !== id) setUbah((n) => n + 1);
      isi(slotPilih, id);
      return;
    }
    const target = slotPilih !== null && urutan[slotPilih] === null ? slotPilih : slotKosongPertama;
    if (target < 0) {
      sfx.thud();
      return;
    }
    isi(target, id);
  };

  const lepasBendaCipta = (id: string) => {
    if (kunci) return;
    sfx.pick();
    setBendaCipta((b) => b.filter((x) => x !== id));
    setUrutan((u) => u.map((x) => (x === id ? null : x)));
    setSlotPilih(null);
  };

  const bantu = () => {
    if (kunci) return;
    onHint?.();
    if (mode === "lanjut") {
      const i = slotKosongPertama;
      if (i >= 0) setHint({ slot: i, item: correct[i] });
      else setHint(null);
    } else if (mode === "perbaiki") {
      if (wrongIndex !== undefined) setHint({ slot: wrongIndex });
    } else {
      // cipta: putar ulang apa yang sudah tersusun (atau benda terpilih bila belum ada)
      const ada = urutan.some((x) => x !== null);
      putar(ada ? urutan : bendaCipta);
    }
  };

  /* ---- status slot setelah hasil ---- */
  const slotBenar = (i: number): boolean | null => {
    if (!hasil) return null;
    const j = urutan[i];
    if (j === null) return false;
    if (mode === "cipta") return hasil.benar || j === urutan[i % unitLen];
    return j === correct[i];
  };

  const semuaTerisi = urutan.length > 0 && urutan.every((x) => x !== null);
  const hiasan = mode === "cipta" && !!hasil?.benar;
  const slotPx = urutan.length > 9 ? 56 : urutan.length > 6 ? 64 : 72;
  const kartuPx = palette.length > 5 ? 64 : 72;

  const judul =
    mode === "lanjut" ? "Lanjutkan polanya!" : mode === "perbaiki" ? "Ada yang tertukar. Betulkan satu!" : fasePilih ? `Pilih ${butuhPilih} benda untuk polamu` : "Susun polamu berulang-ulang";

  return (
    <div className="flex flex-col gap-3" style={{ color: INK }}>
      {/* judul + bantu */}
      <div className="flex items-start gap-2">
        <div className="flex-1 rounded-[22px] bg-white px-4 py-3 text-center shadow-[0_4px_0_rgba(11,37,69,.1)]" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 900, lineHeight: 1.15 }}>
          {judul}
        </div>
        <TombolBantu onClick={bantu} disabled={kunci} />
      </div>

      {/* kalung / pagar */}
      <div
        className={`relative rounded-[26px] px-3 py-4 ${hiasan ? "akademi-pop" : ""}`}
        style={{
          background: hiasan ? "linear-gradient(180deg,#fff6d6,#ffe7a3)" : "rgba(255,255,255,.7)",
          boxShadow: hiasan ? `0 6px 0 rgba(11,37,69,.12), 0 0 0 4px ${EMAS}` : "0 4px 0 rgba(11,37,69,.08)",
        }}
      >
        {/* tali kalung di belakang kotak */}
        <div aria-hidden className="pointer-events-none absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full" style={{ background: hiasan ? EMAS : "rgba(11,37,69,.12)" }} />
        <div className="relative flex flex-wrap items-center justify-center gap-2">
          {urutan.map((id, i) => {
            const item = id !== null ? palette.find((p) => p.id === id) : undefined;
            const asli = slotAsli(i);
            const dipilih = slotPilih === i && !kunci;
            const disorot = hint?.slot === i && !kunci;
            const berbunyi = bunyiIdx === i;
            const benar = slotBenar(i);
            const kosong = id === null;
            const ring = benar === true ? BENAR : benar === false ? SALAH : berbunyi ? EMAS : dipilih ? UNGU : disorot ? SOROT : "transparent";
            const bisaKetuk = !kunci && !asli && !fasePilih;
            return (
              <button
                key={i}
                type="button"
                onClick={() => ketukSlot(i)}
                aria-label={kosong ? `Slot kosong ${i + 1}` : `Slot ${i + 1}`}
                className={`flex items-center justify-center transition-transform ${bisaKetuk ? "active:scale-95" : ""} ${benar === false ? "akademi-shake" : ""} ${disorot ? "akademi-bounce" : ""} ${hiasan ? "akademi-pop" : ""}`}
                style={{
                  width: slotPx,
                  height: slotPx,
                  borderRadius: 18,
                  background: kosong ? "rgba(255,255,255,.55)" : benar === true ? "#e6f8ef" : benar === false ? "#ffe9ec" : "#fff",
                  border: kosong ? `3px dashed ${dipilih ? UNGU : disorot ? SOROT : "rgba(11,37,69,.3)"}` : "3px solid transparent",
                  boxShadow: kosong ? (ring !== "transparent" && !dipilih && !disorot ? `0 0 0 3px ${ring}` : undefined) : `0 4px 0 rgba(11,37,69,.12), 0 0 0 3px ${ring}`,
                  transform: berbunyi ? "scale(1.14)" : dipilih ? "scale(1.08)" : undefined,
                  opacity: asli ? 0.92 : 1,
                  cursor: bisaKetuk ? "pointer" : "default",
                  animationDelay: hiasan ? `${i * 60}ms` : undefined,
                  touchAction: "manipulation",
                }}
              >
                {item ? (
                  <Benda v={visual(item, t)} size={slotPx * 0.68} />
                ) : (
                  <span style={{ fontFamily: BALOO, fontSize: slotPx * 0.5, fontWeight: 900, color: dipilih ? UNGU : "rgba(11,37,69,.4)", lineHeight: 1 }}>?</span>
                )}
              </button>
            );
          })}
        </div>
        {hiasan && (
          <div className="akademi-fade mt-3 text-center" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 900 }}>
            Hiasanmu jadi! 🎉
          </div>
        )}
      </div>

      {/* palette */}
      <div className="rounded-[24px] bg-white/70 p-3 shadow-[0_4px_0_rgba(11,37,69,.08)]">
        {mode === "cipta" && !fasePilih && !kunci && (
          <div className="mb-2 text-center" style={{ fontFamily: BALOO, fontSize: 15, fontWeight: 800, opacity: 0.7 }}>
            Ketuk benda terpilih untuk mengisi · ketuk kotak untuk mengosongkan
          </div>
        )}
        <div className="flex flex-wrap items-stretch justify-center gap-2">
          {palette.map((p) => {
            const terpilihCipta = mode === "cipta" && bendaCipta.includes(p.id);
            const redup = mode === "cipta" && !fasePilih && !terpilihCipta;
            const disorot = hint?.item === p.id && !kunci;
            return (
              <KartuBenda
                key={p.id}
                v={visual(p, t)}
                size={kartuPx}
                selected={terpilihCipta && fasePilih}
                dim={redup}
                onClick={() => ketukPalette(p.id)}
                className={`min-h-[72px] min-w-[72px] ${disorot ? "akademi-bounce" : ""}`}
                style={{
                  boxShadow: disorot
                    ? `0 4px 0 rgba(11,37,69,.12), 0 0 0 4px ${SOROT}`
                    : terpilihCipta && !fasePilih
                      ? `0 4px 0 rgba(11,37,69,.12), 0 0 0 3px ${UNGU}`
                      : undefined,
                  pointerEvents: kunci ? "none" : undefined,
                }}
              />
            );
          })}
        </div>
        {mode === "cipta" && !fasePilih && !kunci && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            <span style={{ fontFamily: BALOO, fontSize: 14, fontWeight: 800, opacity: 0.6 }}>Terpilih:</span>
            {bendaCipta.map((id) => {
              const item = palette.find((p) => p.id === id);
              return item ? (
                <button
                  key={id}
                  type="button"
                  onClick={() => lepasBendaCipta(id)}
                  aria-label="Lepas benda"
                  className="flex h-10 items-center gap-1 rounded-full bg-white px-2 shadow-[0_3px_0_rgba(11,37,69,.1)] active:translate-y-0.5"
                  style={{ fontFamily: BALOO, fontSize: 14, fontWeight: 800 }}
                >
                  <Benda v={visual(item, t)} size={24} /> ✕
                </button>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* baris aksi */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {mode === "perbaiki" && (
          <>
            <span className="flex h-10 items-center rounded-full bg-white/80 px-3" style={{ fontFamily: BALOO, fontSize: 14, fontWeight: 800, opacity: 0.8 }}>
              Diubah: {ubah}
            </span>
            <TombolBesar onClick={() => kirim(urutan)} disabled={kunci} warna={BENAR}>
              Sudah benar ✓
            </TombolBesar>
          </>
        )}
        {mode === "cipta" && (
          <>
            <TombolBesar onClick={() => putar(urutan)} disabled={sedangMain || urutan.every((x) => x === null)} warna={UNGU}>
              Mainkan ♪
            </TombolBesar>
            {semuaTerisi && !kunci && (
              <TombolBesar onClick={() => kirim(urutan)} warna={BENAR} className="akademi-pop">
                Selesai
              </TombolBesar>
            )}
          </>
        )}
        {mode === "lanjut" && (
          <button
            type="button"
            onClick={() => putar(urutan)}
            disabled={sedangMain}
            aria-label="Dengar pola"
            className="flex h-14 items-center gap-2 rounded-full bg-white px-5 shadow-[0_4px_0_rgba(11,37,69,.12)] active:translate-y-0.5 disabled:opacity-40"
            style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800 }}
          >
            Dengar ♪
          </button>
        )}
      </div>
    </div>
  );
}
