"use client";

// Presenter mekanik "urutkan": susun (kartu → slot bernomor), perbaiki (tukar dua kartu), dulu (pilih yang lebih dulu),
// label (tempel pertama/lalu/terakhir di bawah gambar, lalu tokoh bercerita mengikuti label).
// Hanya menampilkan ronde dan mengirim jawaban; penilaian oleh runner (lihat docs/akademi/slice-1-kontrak.md §4).

import { useEffect, useRef, useState } from "react";
import type { PaketUrutkan } from "@akademi/schema";
import type { JawabanUrutkan, LabelUrutan, RondeUrutkan } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import { diamkan, ucapkan } from "@/lib/akademi/suara";
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

/** Judul urutan + tombol bantu dalam satu baris. */
function Kepala({ judul, onBantu, kunci, tanpaBantu }: { judul: string; onBantu: () => void; kunci: boolean; tanpaBantu?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-[22px] bg-white px-4 py-3 text-center shadow-[0_4px_0_rgba(11,37,69,.1)]" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 900, lineHeight: 1.15 }}>
        {judul}
      </div>
      {!tanpaBantu && <TombolBantu onClick={onBantu} disabled={kunci} />}
    </div>
  );
}

/** Nomor slot bulat besar. */
function Nomor({ n, warna }: { n: number; warna?: string }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-full text-white" style={{ background: warna ?? "#0786eb", fontFamily: BALOO, fontSize: 20, fontWeight: 900, boxShadow: "0 3px 0 rgba(11,37,69,.18)" }}>
      {n}
    </span>
  );
}

export function PresenterUrutkan(props: Props) {
  if (props.ronde.mode === "dulu") return <Dulu {...props} />;
  if (props.ronde.mode === "perbaiki") return <Perbaiki {...props} />;
  if (props.ronde.mode === "label") return <Label {...props} />;
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
      <div className="flex flex-wrap justify-center gap-2 rounded-[24px] bg-white/70 p-3 shadow-[0_4px_0_rgba(11,37,69,.08)]">
        {slot.map((id, i) => {
          const benar = kunci && id === correct[i];
          const salah = kunci && id !== correct[i];
          const disorot = hint?.slot === i;
          const siap = !!terpilih && !id && !kunci;
          const ring = benar ? BENAR : salah ? SALAH : disorot ? SOROT : siap ? "#0786eb" : "rgba(11,37,69,.3)";
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
                boxShadow: id ? "0 4px 0 rgba(11,37,69,.12)" : undefined,
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
                boxShadow: disorot ? `0 4px 0 rgba(11,37,69,.12), 0 0 0 4px ${SOROT}` : undefined,
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
      <div className="rounded-[24px] bg-white/70 p-3 text-center shadow-[0_4px_0_rgba(11,37,69,.08)]">
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
                    boxShadow: disorot ? `0 4px 0 rgba(11,37,69,.12), 0 0 0 4px ${SOROT}` : undefined,
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
      {/* judul kegiatan; dilewati bila paket memakai judul umum yang sama dengan pertanyaan di bawah */}
      {!/^mana yang lebih dulu/i.test(t(ronde.titleKey)) && <Kepala judul={t(ronde.titleKey)} onBantu={() => {}} kunci={kunci} tanpaBantu />}
      <div className="rounded-[22px] bg-white px-4 py-3 text-center shadow-[0_4px_0_rgba(11,37,69,.1)]" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 900, lineHeight: 1.15 }}>
        Mana yang lebih dulu? <span style={{ color: "#0567c2" }}>?</span>
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
              label={t(s.labelKey)}
              labelSize={18}
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

/* ---------------- mode label ---------------- */

/** Label = ikon + suara (bukan tulisan yang harus dibaca); kata dibacakan saat keping diketuk dan saat cerita. */
const LABEL: Record<LabelUrutan, { ikon: string; kata: string }> = {
  pertama: { ikon: "🥇", kata: "pertama" },
  lalu: { ikon: "➡️", kata: "lalu" },
  terakhir: { ikon: "🏁", kata: "terakhir" },
};
const URUTAN_LABEL: LabelUrutan[] = ["pertama", "lalu", "terakhir"];
const JEDA_ADEGAN = 1800;

function Label({ ronde, t, onJawab, onHint, hasil }: Props) {
  const { shown, labels: benar = [] } = ronde;
  const n = shown.length;
  const [slot, setSlot] = useState<(LabelUrutan | null)[]>(() => Array(n).fill(null));
  const [terpilih, setTerpilih] = useState<LabelUrutan | null>(null);
  const [cerita, setCerita] = useState<{ aktif: number; berhenti: number | null; selesai: boolean } | null>(null);
  const [hint, setHint] = useState<{ slot: number; label: LabelUrutan } | null>(null);
  const [terkirim, setTerkirim] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const kunci = !!hasil || terkirim || (!!cerita && !cerita.selesai);

  useEffect(() => {
    setSlot(Array(shown.length).fill(null));
    setTerpilih(null);
    setCerita(null);
    setHint(null);
    setTerkirim(false);
    const tm = timers.current;
    return () => { tm.forEach(clearTimeout); tm.length = 0; diamkan(); };
  }, [ronde, shown.length]);

  // jatah keping: pertama 1, lalu n−2, terakhir 1
  const jatah = (l: LabelUrutan) => (l === "lalu" ? Math.max(0, n - 2) : 1);
  const sisa = (l: LabelUrutan) => jatah(l) - slot.filter((s) => s === l).length;
  const lengkap = slot.every(Boolean);

  const ketukLabel = (l: LabelUrutan) => {
    if (kunci || sisa(l) <= 0) return;
    sfx.tap();
    ucapkan(LABEL[l].kata);
    setTerpilih((x) => (x === l ? null : l));
  };
  const ketukSlot = (i: number) => {
    if (kunci) return;
    if (slot[i]) {
      sfx.whoosh();
      setSlot((s) => s.map((v, k) => (k === i ? null : v)));
      setTerpilih(null);
      return;
    }
    if (!terpilih || sisa(terpilih) <= 0) return;
    sfx.plop();
    setSlot((s) => s.map((v, k) => (k === i ? terpilih : v)));
    setTerpilih(null);
    if (hint?.slot === i) setHint(null);
  };
  const bantu = () => {
    if (kunci) return;
    onHint?.();
    const i = slot.findIndex((v, k) => v !== benar[k]);
    if (i >= 0 && benar[i]) { setHint({ slot: i, label: benar[i] }); ucapkan(`Gambar ini yang ${LABEL[benar[i]].kata}.`); }
  };

  /** Tokoh bercerita mengikuti label yang dipasang: "terakhir" sebelum gambar terakhir menghentikan cerita, sisanya meredup. */
  const ceritakan = () => {
    if (kunci || !lengkap) return;
    sfx.open();
    const labels = slot as LabelUrutan[];
    let berhenti: number | null = null;
    const adegan: number[] = [];
    for (let i = 0; i < n; i++) {
      adegan.push(i);
      if (labels[i] === "terakhir" && i < n - 1) { berhenti = i; break; }
    }
    adegan.forEach((i, k) => {
      timers.current.push(setTimeout(() => {
        setCerita({ aktif: i, berhenti: null, selesai: false });
        ucapkan(`${LABEL[labels[i]].kata}, ${t(shown[i].labelKey)}.`);
      }, k * JEDA_ADEGAN));
    });
    const akhir = adegan.length * JEDA_ADEGAN;
    timers.current.push(setTimeout(() => {
      setCerita({ aktif: -1, berhenti, selesai: true });
      if (berhenti !== null) { sfx.thud(); ucapkan("Lho, ceritanya berhenti di sini."); }
      else sfx.celebrate();
    }, akhir));
    timers.current.push(setTimeout(() => {
      setTerkirim(true);
      onJawab({ labels });
    }, akhir + (berhenti !== null ? 1600 : 700)));
  };

  const ukuran = n <= 3 ? 72 : 60;

  return (
    <div className="flex flex-col gap-3" style={{ color: INK }}>
      <Kepala judul={t(ronde.titleKey)} onBantu={bantu} kunci={kunci} />

      {/* gambar berjajar + slot label di bawah tiap gambar */}
      <div className="flex flex-wrap justify-center gap-2 rounded-[24px] bg-white/70 p-3 shadow-[0_4px_0_rgba(11,37,69,.08)]">
        {shown.map((s, i) => {
          const l = slot[i];
          const aktif = cerita?.aktif === i;
          const redup = cerita?.selesai && cerita.berhenti !== null && i > cerita.berhenti;
          const benarKah = !!hasil && l === benar[i];
          const salahKah = !!hasil && l !== benar[i];
          const disorot = hint?.slot === i;
          const siap = !!terpilih && !l && !kunci;
          const ring = benarKah ? BENAR : salahKah ? SALAH : disorot ? SOROT : siap ? "#0786eb" : "rgba(11,37,69,.3)";
          return (
            <div key={s.id} className="flex flex-1 flex-col items-center gap-2 transition-opacity duration-700" style={{ minWidth: 92, maxWidth: 150, opacity: redup ? 0.3 : 1 }}>
              <KartuBenda
                v={visual(s, t)}
                size={ukuran}
                label={t(s.labelKey)}
                className={`w-full min-h-[108px] ${aktif ? "akademi-bounce" : ""}`}
                style={{ boxShadow: aktif ? `0 4px 0 rgba(11,37,69,.12), 0 0 0 4px ${SOROT}` : undefined, pointerEvents: "none" }}
              />
              <button
                type="button"
                onClick={() => ketukSlot(i)}
                disabled={kunci}
                aria-label={`Label gambar ${i + 1}${l ? `: ${LABEL[l].kata}` : ", kosong"}`}
                className={`flex min-h-16 w-full items-center justify-center gap-1 rounded-[18px] transition-transform active:scale-95 ${salahKah ? "akademi-shake" : ""} ${disorot ? "akademi-bounce" : ""}`}
                style={{ border: `3px ${l ? "solid" : "dashed"} ${ring}`, background: benarKah ? "#e6f8ef" : salahKah ? "#ffe9ec" : l ? "#fff" : "rgba(255,255,255,.5)", boxShadow: l ? "0 4px 0 rgba(11,37,69,.12)" : undefined }}
              >
                {l ? (
                  <>
                    <span style={{ fontSize: 30, lineHeight: 1 }} aria-hidden>{LABEL[l].ikon}</span>
                    <span style={{ fontFamily: BALOO, fontSize: 15, fontWeight: 800 }}>{LABEL[l].kata}</span>
                  </>
                ) : (
                  <span style={{ fontSize: 24, opacity: 0.3 }}>?</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* palet label: ikon + suara */}
      <div className="flex justify-center gap-2" role="group" aria-label="Keping label">
        {URUTAN_LABEL.map((l) => {
          const tersisa = sisa(l);
          const dipilih = terpilih === l;
          const disorot = hint?.label === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => ketukLabel(l)}
              disabled={kunci || tersisa <= 0}
              aria-label={`Label ${LABEL[l].kata}, sisa ${tersisa}`}
              className={`relative flex min-h-20 min-w-[92px] flex-col items-center justify-center gap-0.5 rounded-[18px] bg-white px-3 transition-transform active:scale-95 disabled:opacity-40 ${disorot ? "akademi-bounce" : ""}`}
              style={{ boxShadow: `0 4px 0 rgba(11,37,69,.12), 0 0 0 3px ${dipilih ? "#0786eb" : disorot ? SOROT : "transparent"}`, transform: dipilih ? "scale(1.08)" : undefined }}
            >
              <span style={{ fontSize: 34, lineHeight: 1 }} aria-hidden>{LABEL[l].ikon}</span>
              <span style={{ fontFamily: BALOO, fontSize: 14, fontWeight: 800 }}>{LABEL[l].kata}</span>
              {jatah(l) > 1 && <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full text-white" style={{ background: "#0786eb", fontFamily: BALOO, fontSize: 14, fontWeight: 900 }}>{tersisa}</span>}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={ceritakan}
        disabled={kunci || !lengkap}
        className="flex min-h-[60px] items-center justify-center gap-2 rounded-[20px] bg-[#22b573] py-3 text-white shadow-[0_5px_0_#16804f] active:translate-y-1 disabled:opacity-60"
        style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 900 }}
      >
        {cerita && !cerita.selesai ? <><Icon name="volume_up" size={26} /> Robot bercerita…</> : <>Ceritakan <Icon name="play_arrow" size={28} /></>}
      </button>
    </div>
  );
}
