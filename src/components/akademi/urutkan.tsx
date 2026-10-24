"use client";

// Presenter mekanik "urutkan": susun (kartu → slot bernomor), perbaiki (tukar dua kartu), dulu (pilih yang lebih dulu).
// Hanya menampilkan ronde dan mengirim jawaban; penilaian oleh runner (lihat docs/akademi/slice-1-kontrak.md §4).

import { useEffect, useRef, useState } from "react";
import type { PaketUrutkan } from "@akademi/schema";
import type { JawabanUrutkan, RondeUrutkan } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import { sfx } from "@/lib/sfx";
import { KartuBenda, type VisualSpec } from "./benda";
import { BALOO, BENAR, INK, SALAH, type PresenterProps } from "./jenis";

type Props = PresenterProps<RondeUrutkan, JawabanUrutkan, PaketUrutkan>;
type Langkah = RondeUrutkan["shown"][number];

const SOROT = "#ffd23f";

function visual(x: Langkah, t: (k: string) => string): VisualSpec {
  return { emoji: x.emoji, color: x.color, scale: x.scale, count: x.count, shape: x.shape, width: x.width, label: t(x.labelKey) };
}

/** Tombol "Bantu" kecil (≥56px). */
function TombolBantu({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Bantu"
      className="flex h-14 shrink-0 items-center gap-1.5 rounded-full bg-white pr-4 pl-3 text-[#2b1d4e] shadow-[0_4px_0_rgba(43,29,78,.12)] active:translate-y-0.5 disabled:opacity-40"
      style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800 }}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-[#ffd23f]">
        <Icon name="lightbulb" size={22} />
      </span>
      Bantu
    </button>
  );
}

/** Judul urutan + tombol bantu dalam satu baris. */
function Kepala({ judul, onBantu, kunci, tanpaBantu }: { judul: string; onBantu: () => void; kunci: boolean; tanpaBantu?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-[22px] bg-white px-4 py-3 text-center shadow-[0_4px_0_rgba(43,29,78,.1)]" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 900, lineHeight: 1.15 }}>
        {judul}
      </div>
      {!tanpaBantu && <TombolBantu onClick={onBantu} disabled={kunci} />}
    </div>
  );
}

/** Nomor slot bulat besar. */
function Nomor({ n, warna }: { n: number; warna?: string }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-full text-white" style={{ background: warna ?? "#5b4bff", fontFamily: BALOO, fontSize: 20, fontWeight: 900, boxShadow: "0 3px 0 rgba(43,29,78,.18)" }}>
      {n}
    </span>
  );
}

export function PresenterUrutkan(props: Props) {
  if (props.ronde.mode === "dulu") return <Dulu {...props} />;
  if (props.ronde.mode === "perbaiki") return <Perbaiki {...props} />;
  return <Susun {...props} />;
}

/* ---------------- mode susun ---------------- */

function Susun({ ronde, t, onJawab, onHint, hasil }: Props) {
  const { shown, correct } = ronde;
  const n = shown.length;
  const [slot, setSlot] = useState<(string | null)[]>(() => Array(n).fill(null));
  const [terpilih, setTerpilih] = useState<string | null>(null);
  const [hint, setHint] = useState<{ kartu: string; slot: number } | null>(null);
  const terkirim = useRef(false);
  const kunci = !!hasil;
  const langkah = (id: string) => shown.find((s) => s.id === id)!;

  useEffect(() => {
    setSlot(Array(shown.length).fill(null));
    setTerpilih(null);
    setHint(null);
    terkirim.current = false;
  }, [ronde, shown.length]);

  useEffect(() => {
    if (kunci || terkirim.current) return;
    if (slot.length === n && slot.every(Boolean)) {
      terkirim.current = true;
      onJawab(slot as string[]);
    }
  }, [slot, n, kunci, onJawab]);

  const isiSlot = (i: number, id: string) => {
    if (kunci || slot[i]) return;
    sfx.plop();
    setSlot((s) => s.map((v, k) => (k === i ? id : v === id ? null : v)));
    setTerpilih(null);
    if (hint?.kartu === id) setHint(null);
  };
  const ketukKartu = (id: string) => {
    if (kunci) return;
    if (terpilih === id) {
      // ketuk lagi kartu yang sama → masuk slot kosong pertama
      const i = slot.findIndex((v) => !v);
      if (i >= 0) isiSlot(i, id);
      else setTerpilih(null);
      return;
    }
    sfx.tap();
    setTerpilih(id);
  };
  const ketukSlot = (i: number) => {
    if (kunci) return;
    const isi = slot[i];
    if (isi) {
      // kembalikan kartu ke bawah
      sfx.whoosh();
      setSlot((s) => s.map((v, k) => (k === i ? null : v)));
      setTerpilih(null);
      return;
    }
    if (terpilih) isiSlot(i, terpilih);
  };
  const bantu = () => {
    if (kunci) return;
    onHint?.();
    const i = slot.findIndex((v, k) => v !== correct[k]);
    if (i >= 0) setHint({ kartu: correct[i], slot: i });
  };

  const sisa = shown.filter((s) => !slot.includes(s.id));
  const ukuran = n <= 4 ? 64 : 52;

  return (
    <div className="flex flex-col gap-3" style={{ color: INK }}>
      <Kepala judul={t(ronde.titleKey)} onBantu={bantu} kunci={kunci} />

      {/* slot bernomor */}
      <div className="flex flex-wrap justify-center gap-2 rounded-[24px] bg-white/70 p-3 shadow-[0_4px_0_rgba(43,29,78,.08)]">
        {slot.map((id, i) => {
          const benar = kunci && id === correct[i];
          const salah = kunci && id !== correct[i];
          const disorot = hint?.slot === i;
          const siap = !!terpilih && !id && !kunci;
          const ring = benar ? BENAR : salah ? SALAH : disorot ? SOROT : siap ? "#5b4bff" : "rgba(43,29,78,.3)";
          return (
            <button
              key={i}
              type="button"
              onClick={() => ketukSlot(i)}
              disabled={kunci}
              aria-label={`Slot ${i + 1}`}
              className={`relative flex min-h-[96px] min-w-[84px] flex-1 flex-col items-center justify-center gap-1 rounded-[20px] p-1.5 transition-transform active:scale-95 ${salah ? "akademi-shake" : ""} ${disorot ? "akademi-bounce" : ""}`}
              style={{
                maxWidth: 140,
                border: `3px ${id ? "solid" : "dashed"} ${ring}`,
                background: benar ? "#e6f8ef" : salah ? "#ffe9ec" : id ? "#fff" : "rgba(255,255,255,.5)",
                boxShadow: id ? "0 4px 0 rgba(43,29,78,.12)" : undefined,
              }}
            >
              <span className="absolute -top-3 -left-1">
                <Nomor n={i + 1} warna={benar ? BENAR : salah ? SALAH : undefined} />
              </span>
              {id ? <KartuBenda v={visual(langkah(id), t)} size={ukuran} className="pointer-events-none !shadow-none" /> : <span style={{ fontSize: 28, opacity: 0.3 }}>?</span>}
            </button>
          );
        })}
      </div>

      {/* kartu langkah yang belum dipakai */}
      <div className="flex flex-wrap justify-center gap-2" style={{ minHeight: 100 }}>
        {sisa.map((s) => {
          const dipilih = terpilih === s.id;
          const disorot = hint?.kartu === s.id;
          return (
            <KartuBenda
              key={s.id}
              v={visual(s, t)}
              size={ukuran + 8}
              selected={dipilih}
              onClick={() => ketukKartu(s.id)}
              className={`min-h-[84px] min-w-[84px] ${disorot ? "akademi-bounce" : ""}`}
              style={{
                transform: dipilih ? "scale(1.12)" : undefined,
                boxShadow: disorot ? `0 4px 0 rgba(43,29,78,.12), 0 0 0 4px ${SOROT}` : undefined,
                pointerEvents: kunci ? "none" : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- mode perbaiki ---------------- */

function Perbaiki({ ronde, t, onJawab, onHint, hasil }: Props) {
  const { shown, correct, swapped } = ronde;
  const [urutan, setUrutan] = useState<string[]>(() => shown.map((s) => s.id));
  const [terpilih, setTerpilih] = useState<string | null>(null);
  const [tukar, setTukar] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [terkirim, setTerkirim] = useState(false);
  const kunci = !!hasil || terkirim;
  const langkah = (id: string) => shown.find((s) => s.id === id)!;

  useEffect(() => {
    setUrutan(shown.map((s) => s.id));
    setTerpilih(null);
    setTukar(0);
    setHint(null);
    setTerkirim(false);
  }, [ronde, shown]);

  const ketuk = (id: string) => {
    if (kunci) return;
    if (!terpilih) {
      sfx.tap();
      setTerpilih(id);
      return;
    }
    if (terpilih === id) {
      setTerpilih(null);
      return;
    }
    sfx.whoosh();
    setUrutan((u) => {
      const a = u.indexOf(terpilih), b = u.indexOf(id);
      const v = [...u];
      [v[a], v[b]] = [v[b], v[a]];
      return v;
    });
    setTukar((k) => k + 1);
    setTerpilih(null);
    setHint(null);
  };
  const selesai = () => {
    if (kunci) return;
    sfx.plop();
    setTerkirim(true);
    onJawab(urutan);
  };
  const bantu = () => {
    if (kunci) return;
    onHint?.();
    // salah satu kartu yang tertukar (dari indeks shown), atau kartu pertama yang tidak di tempatnya
    const id = swapped ? shown[swapped[0]]?.id : undefined;
    const salahPosisi = urutan.find((v, i) => v !== correct[i]);
    setHint(id && urutan.indexOf(id) !== correct.indexOf(id) ? id : (salahPosisi ?? null));
  };

  const n = urutan.length;
  const ukuran = n <= 4 ? 64 : 52;

  return (
    <div className="flex flex-col gap-3" style={{ color: INK }}>
      <Kepala judul={t(ronde.titleKey)} onBantu={bantu} kunci={kunci} />
      <div className="rounded-[24px] bg-white/70 p-3 text-center shadow-[0_4px_0_rgba(43,29,78,.08)]">
        <div style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, opacity: 0.8 }}>Ketuk dua kartu untuk menukar tempatnya</div>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {urutan.map((id, i) => {
            const benar = !!hasil && id === correct[i];
            const salah = !!hasil && id !== correct[i];
            const dipilih = terpilih === id;
            const disorot = hint === id;
            return (
              <div key={id} className="relative flex flex-1 justify-center" style={{ minWidth: 84, maxWidth: 140 }}>
                <span className="absolute -top-3 left-1 z-10">
                  <Nomor n={i + 1} warna={benar ? BENAR : salah ? SALAH : undefined} />
                </span>
                <KartuBenda
                  v={visual(langkah(id), t)}
                  size={ukuran}
                  selected={dipilih}
                  right={benar}
                  wrong={salah}
                  onClick={() => ketuk(id)}
                  className={`w-full min-h-[96px] min-w-[84px] ${salah ? "akademi-shake" : ""} ${disorot ? "akademi-bounce" : ""}`}
                  style={{
                    transform: dipilih ? "scale(1.1)" : undefined,
                    background: benar ? "#e6f8ef" : salah ? "#ffe9ec" : undefined,
                    boxShadow: disorot ? `0 4px 0 rgba(43,29,78,.12), 0 0 0 4px ${SOROT}` : undefined,
                    pointerEvents: kunci ? "none" : undefined,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-white/80 px-3 py-1" style={{ fontFamily: BALOO, fontSize: 15, fontWeight: 800, opacity: 0.75 }} aria-label={`Ditukar ${tukar} kali`}>
          🔁 {tukar}
        </span>
        <button
          type="button"
          onClick={selesai}
          disabled={kunci}
          className="flex-1 rounded-[20px] bg-[#22b573] py-4 text-white shadow-[0_5px_0_#16804f] active:translate-y-1 disabled:opacity-60"
          style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 900, minHeight: 60 }}
        >
          Sudah benar ✓
        </button>
      </div>
    </div>
  );
}

/* ---------------- mode dulu ---------------- */

function Dulu({ ronde, t, onJawab, hasil }: Props) {
  const { shown, correct } = ronde;
  const [dipilih, setDipilih] = useState<string | null>(null);
  const kunci = !!hasil || dipilih !== null;
  const benarId = correct[0];

  useEffect(() => {
    setDipilih(null);
  }, [ronde]);

  const pilih = (id: string) => {
    if (kunci) return;
    sfx.tap();
    setDipilih(id);
    onJawab(id);
  };

  return (
    <div className="flex flex-col gap-3" style={{ color: INK }}>
      <Kepala judul={t(ronde.titleKey)} onBantu={() => {}} kunci={kunci} tanpaBantu />
      <div className="rounded-[22px] bg-white px-4 py-3 text-center shadow-[0_4px_0_rgba(43,29,78,.1)]" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 900, lineHeight: 1.15 }}>
        Mana yang lebih dulu? <span style={{ color: "#5b4bff" }}>?</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {shown.map((s) => {
          const benar = !!hasil && s.id === benarId;
          const salah = !!hasil && dipilih === s.id && s.id !== benarId;
          return (
            <KartuBenda
              key={s.id}
              v={visual(s, t)}
              size={96}
              selected={!hasil && dipilih === s.id}
              right={benar}
              wrong={salah}
              onClick={() => pilih(s.id)}
              className={`min-h-[150px] ${salah ? "akademi-shake" : ""} ${benar ? "akademi-pop" : ""}`}
              style={{ background: benar ? "#e6f8ef" : salah ? "#ffe9ec" : undefined, pointerEvents: kunci ? "none" : undefined }}
            />
          );
        })}
      </div>
    </div>
  );
}
