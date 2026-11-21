"use client";

// Presenter mekanik "pola": lanjut (isi slot kosong di ujung), perbaiki (ganti satu unsur yang tertukar),
// cipta (pilih benda lalu susun pola berulang sendiri). Deret tampil sebagai kalung/pagar kotak berjajar dan
// juga dibunyikan sebagai nada (paket.nada) supaya kesalahan "terdengar".
// Presenter hanya menampilkan ronde dan mengirim jawaban; penilaian oleh runner (docs/akademi/slice-1-kontrak.md §4–5).

import { sfxAkademi } from "@/lib/sfx-akademi";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { PaketPola } from "@akademi/schema";
import type { JawabanPola, RondePola } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import { sfx } from "@/lib/sfx";
import { Benda, KartuBenda, type VisualSpec } from "./benda";
import { usePanggung } from "./dunia";
import { useModeUjian , useSisaBantu, LencanaSisa } from "./mode-ujian";
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
  return { emoji: x.emoji, color: x.color, scale: x.scale, count: x.count, shape: x.shape, width: x.width, angka: x.angka, label: t(x.labelKey) };
}

/** Tombol "Bantu" kecil (≥56px), sama gayanya dengan presenter lain; disembunyikan di mode ujian. */
function TombolBantu({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  const sisa = useSisaBantu();
  if (useModeUjian()) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || sisa === 0}
      aria-label={sisa === null ? "Bantu" : `Bantu, sisa ${sisa}`}
      className="relative flex h-14 shrink-0 items-center gap-1.5 rounded-full bg-white pr-4 pl-3 text-[#0b2545] shadow-[0_4px_0_rgba(11,37,69,.12)] active:translate-y-0.5 disabled:opacity-40"
      style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800 }}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-[#ffd23f]">
        <Icon name="lightbulb" size={22} />
      </span>
      Bantu
      <LencanaSisa sisa={sisa} />
    </button>
  );
}

/** Tombol aksi besar (≥56px) warna ungu/hijau. */
function TombolBesar({ children, onClick, disabled, warna = UNGU, className = "" }: { children: ReactNode; onClick: () => void; disabled?: boolean; warna?: string; className?: string }) {
  const sk = Math.min(usePanggung().skala, 1.3);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-w-[56px] items-center justify-center gap-2 rounded-full px-6 text-white transition-transform active:translate-y-0.5 disabled:opacity-40 ${className}`}
      style={{ height: 56 * sk, fontFamily: BALOO, fontSize: 20 * sk, fontWeight: 900, background: warna, boxShadow: "0 5px 0 rgba(11,37,69,.18)" }}
    >
      {children}
    </button>
  );
}

/* ---------------- tata letak ---------------- */

/**
 * Sisi kotak persegi terbesar (base..maks) untuk `n` kotak ber-wrap dalam lebar×tinggi, tanpa menambah jumlah baris
 * dibanding kotak seukuran `base`. Di HP (sempit) praktis sama dengan ukuran lama; di tablet kotak membesar.
 */
function sisiMuat(lebar: number, tinggi: number, n: number, base: number, maks: number, gap: number, bebasBaris = false): number {
  if (lebar <= 0 || n <= 0) return base;
  // layar tegak: boleh tambah baris asal kotak lebih besar dan muat di tinggi yang tersedia
  if (bebasBaris && tinggi > 0) {
    for (let s = Math.floor(maks); s > base; s -= 2) {
      const pb = Math.max(1, Math.min(n, Math.floor((lebar + gap) / (s + gap))));
      const b = Math.ceil(n / pb);
      if (pb * s + gap * (pb - 1) <= lebar && b * s + gap * (b - 1) <= tinggi) return s;
    }
  }
  const perBaris = Math.max(1, Math.min(n, Math.floor((lebar + gap) / (base + gap))));
  const baris = Math.ceil(n / perBaris);
  const dariLebar = (lebar - gap * (perBaris - 1)) / perBaris;
  const dariTinggi = tinggi > 0 ? (tinggi - gap * (baris - 1)) / baris : base;
  return Math.round(Math.max(base, Math.min(maks, dariLebar, dariTinggi)));
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
    sfxAkademi.taruh();
    setUrutan((u) => u.map((x, k) => (k === i ? id : x)));
    setSlotPilih(null);
    if (hint?.slot === i) setHint(null);
  };

  const ketukSlot = (i: number) => {
    if (kunci) return;
    if (slotAsli(i) || fasePilih) {
      sfxAkademi.tolak();
      return;
    }
    if (mode === "perbaiki") {
      sfx.tap();
      setSlotPilih((s) => (s === i ? null : i));
      return;
    }
    // lanjut / cipta: slot terisi → kosongkan; slot kosong → pilih
    if (urutan[i] !== null) {
      sfxAkademi.ambil();
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
      sfxAkademi.tolak();
      return;
    }
    if (mode === "perbaiki") {
      if (slotPilih === null) {
        sfxAkademi.tolak();
        return;
      }
      if (urutan[slotPilih] !== id) setUbah((n) => n + 1);
      isi(slotPilih, id);
      return;
    }
    const target = slotPilih !== null && urutan[slotPilih] === null ? slotPilih : slotKosongPertama;
    if (target < 0) {
      sfxAkademi.tolak();
      return;
    }
    isi(target, id);
  };

  const lepasBendaCipta = (id: string) => {
    if (kunci) return;
    sfxAkademi.ambil();
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
  const { tema, skala: sk, w, h } = usePanggung();
  const gap = Math.round(8 * sk);
  const lebarDalam = w > 0 ? w - 24 * sk - 6 : 0;
  // palet: benda membesar mengikuti lebar & tinggi panggung (±16% tinggi), tanpa pindah baris
  const basePalet = palette.length > 5 ? 64 : 72;
  const lebarKartu = sisiMuat(lebarDalam, 0, palette.length, (basePalet + 16) * sk, 200 * sk, gap);
  const kartuPx = Math.round(Math.max(basePalet * sk, Math.min((lebarKartu - 16 * sk) * 0.8, h > 0 ? h * 0.16 : 0, 130)));
  const barisPalet = Math.ceil(palette.length / Math.max(1, Math.floor((lebarDalam + gap) / (lebarKartu + gap)) || 1));
  const tinggiPalet = barisPalet * (kartuPx + 16 + 20 * sk) + 24 * sk + (mode === "cipta" ? 60 * sk : 0);
  // kalung mengisi sisa tinggi: panggung − judul − palet − baris aksi − jarak − padding kalung
  const tinggiKalung = h > 0 ? h - 58 * Math.min(sk, 1.3) - tinggiPalet - 56 * Math.min(sk, 1.3) - 3 * 12 - 32 * sk - (hiasan ? 36 * sk : 0) : 0;
  const baseSlot = urutan.length > 9 ? 56 : urutan.length > 6 ? 64 : 72;
  const tegak = w > 0 && h > w;
  const slotPx = sisiMuat(lebarDalam, tegak ? tinggiKalung - 16 : tinggiKalung, urutan.length, baseSlot * sk, 150, gap, tegak);

  const judul =
    mode === "lanjut" ? "Lanjutkan polanya!" : mode === "perbaiki" ? "Ada yang tertukar. Betulkan satu!" : fasePilih ? `Pilih ${butuhPilih} benda untuk polamu` : "Susun polamu berulang-ulang";

  return (
    <div className="flex flex-1 flex-col gap-3" style={{ color: INK }}>
      {/* judul + bantu */}
      <div className="flex items-start gap-2">
        <div className="flex-1 rounded-[22px] bg-white px-4 py-3 text-center" style={{ fontFamily: BALOO, fontSize: 22 * Math.min(sk, 1.3), fontWeight: 900, lineHeight: 1.15, boxShadow: `0 4px 0 rgba(11,37,69,.1), inset 0 0 0 3px ${tema.aksen}33` }}>
          {judul}
        </div>
        <TombolBantu onClick={bantu} disabled={kunci} />
      </div>

      {/* kalung / pagar: rak bertema dunia, mengisi sisa tinggi panggung */}
      <div
        className={`relative flex flex-1 flex-col justify-center ${hiasan ? "akademi-pop" : ""}`}
        style={{
          borderRadius: 26 * sk,
          padding: `${16 * sk}px ${12 * sk}px`,
          background: hiasan ? "linear-gradient(180deg,#fff6d6,#ffe7a3)" : `linear-gradient(180deg,rgba(255,255,255,.2),transparent 40%), ${tema.wadahWarna}`,
          boxShadow: hiasan ? `0 6px 0 rgba(11,37,69,.12), 0 0 0 4px ${EMAS}` : `inset 0 -${Math.round(10 * sk)}px 0 ${tema.wadahGelap}66, 0 6px 0 ${tema.wadahGelap}`,
        }}
      >
        {/* tali kalung di belakang kotak */}
        <div aria-hidden className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-full" style={{ height: Math.max(4, 5 * sk), background: hiasan ? EMAS : tema.wadahGelap }} />
        <div className="relative flex flex-wrap items-center justify-center" style={{ gap }}>
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
                  borderRadius: 18 * sk,
                  // slot kosong tetap nyaris putih bergaris putus tegas supaya terlihat jelas di dunia gelap
                  background: kosong ? "rgba(255,255,255,.9)" : benar === true ? "#e6f8ef" : benar === false ? "#ffe9ec" : "#fff",
                  border: kosong ? `3px dashed ${dipilih ? UNGU : disorot ? SOROT : tema.wadahGelap}` : "3px solid transparent",
                  boxShadow: kosong
                    ? `inset 0 4px 10px rgba(0,0,0,.14)${ring !== "transparent" && !dipilih && !disorot ? `, 0 0 0 3px ${ring}` : ""}`
                    : `0 4px 0 rgba(0,0,0,.18), 0 0 0 3px ${ring}`,
                  transform: berbunyi ? "scale(1.14)" : dipilih ? "scale(1.08)" : undefined,

                  cursor: bisaKetuk ? "pointer" : "default",
                  animationDelay: hiasan ? `${i * 60}ms` : undefined,
                  touchAction: "manipulation",
                }}
              >
                {item ? (
                  <Benda v={visual(item, t)} size={slotPx * 0.68} />
                ) : (
                  <span style={{ fontFamily: BALOO, fontSize: slotPx * 0.5, fontWeight: 900, color: dipilih ? UNGU : tema.wadahGelap, lineHeight: 1 }}>?</span>
                )}
              </button>
            );
          })}
        </div>
        {hiasan && (
          <div className="akademi-fade mt-3 text-center" style={{ fontFamily: BALOO, fontSize: 20 * Math.min(sk, 1.3), fontWeight: 900, color: INK }}>
            Hiasanmu jadi! 🎉
          </div>
        )}
      </div>

      {/* palette */}
      <div style={{ borderRadius: 24 * sk, padding: 12 * sk, background: tema.panel, boxShadow: `0 5px 0 rgba(11,37,69,.12), inset 0 0 0 3px ${tema.aksen}33` }}>
        {mode === "cipta" && !fasePilih && !kunci && (
          <div className="mb-2 text-center" style={{ fontFamily: BALOO, fontSize: 15 * Math.min(sk, 1.3), fontWeight: 800, color: INK }}>
            Ketuk benda terpilih untuk mengisi · ketuk kotak untuk mengosongkan
          </div>
        )}
        <div className="flex flex-wrap items-stretch justify-center" style={{ gap }}>
          {palette.map((p) => {
            const terpilihCipta = mode === "cipta" && bendaCipta.includes(p.id);
            const redup = mode === "cipta" && !fasePilih && !terpilihCipta;
            const disorot = hint?.item === p.id && !kunci;
            return (
              <KartuBenda
                key={p.id}
                v={visual(p, t)}
                size={kartuPx}
                labelSize={Math.round(Math.min(20, 13 * Math.max(sk, kartuPx / 72)))}
                selected={terpilihCipta && fasePilih}
                dim={redup}
                onClick={() => ketukPalette(p.id)}
                className={disorot ? "akademi-bounce" : ""}
                style={{
                  minWidth: 72 * sk,
                  minHeight: 72 * sk,
                  boxShadow: disorot
                    ? `0 4px 0 rgba(11,37,69,.12), 0 0 0 4px ${SOROT}`
                    : terpilihCipta && !fasePilih
                      ? `0 4px 0 rgba(11,37,69,.12), 0 0 0 3px ${UNGU}`
                      : `0 4px 0 rgba(11,37,69,.12), 0 0 0 2px ${tema.aksen}44`,
                  pointerEvents: kunci ? "none" : undefined,
                }}
              />
            );
          })}
        </div>
        {mode === "cipta" && !fasePilih && !kunci && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            <span style={{ fontFamily: BALOO, fontSize: 14 * Math.min(sk, 1.3), fontWeight: 800, color: INK }}>Terpilih:</span>
            {bendaCipta.map((id) => {
              const item = palette.find((p) => p.id === id);
              return item ? (
                <button
                  key={id}
                  type="button"
                  onClick={() => lepasBendaCipta(id)}
                  aria-label="Lepas benda"
                  className="flex items-center gap-1 rounded-full bg-white px-2 active:translate-y-0.5"
                  style={{ height: 40 * Math.min(sk, 1.3), fontFamily: BALOO, fontSize: 14 * Math.min(sk, 1.3), fontWeight: 800, color: INK, boxShadow: `0 3px 0 rgba(11,37,69,.1), 0 0 0 2px ${tema.aksen}44` }}
                >
                  <Benda v={visual(item, t)} size={24 * Math.min(sk, 1.3)} /> ✕
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
            <span className="flex items-center rounded-full bg-white px-3 shadow-[0_3px_0_rgba(11,37,69,.1)]" style={{ height: 40 * Math.min(sk, 1.3), fontFamily: BALOO, fontSize: 14 * Math.min(sk, 1.3), fontWeight: 800, color: INK }}>
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
            className="flex items-center gap-2 rounded-full bg-white px-5 shadow-[0_4px_0_rgba(11,37,69,.12)] active:translate-y-0.5 disabled:opacity-40"
            style={{ height: 56 * Math.min(sk, 1.3), fontFamily: BALOO, fontSize: 18 * Math.min(sk, 1.3), fontWeight: 800, color: INK }}
          >
            Dengar ♪
          </button>
        )}
      </div>
    </div>
  );
}
