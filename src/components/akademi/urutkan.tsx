"use client";

// Presenter mekanik "urutkan": susun (kartu → slot bernomor), perbaiki (tukar dua kartu), dulu (pilih yang lebih dulu),
// label (tempel pertama/lalu/terakhir di bawah gambar, lalu tokoh bercerita mengikuti label).
// Hanya menampilkan ronde dan mengirim jawaban; penilaian oleh runner (lihat docs/akademi/slice-1-kontrak.md §4).

import { sfxAkademi } from "@/lib/sfx-akademi";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PaketUrutkan } from "@akademi/schema";
import type { JawabanUrutkan, LabelUrutan, RondeUrutkan } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import type { Tema } from "@/lib/akademi/tema-dunia";
import { diamkan, ucapkan } from "@/lib/akademi/suara";
import { sfx } from "@/lib/sfx";
import { KartuBenda, type VisualSpec } from "./benda";
import { usePanggung } from "./dunia";
import { TombolBantu } from "./bantu";
import { BALOO, BENAR, INK, NUNITO, SALAH, type PresenterProps } from "./jenis";

type Props = PresenterProps<RondeUrutkan, JawabanUrutkan, PaketUrutkan>;
type Langkah = RondeUrutkan["shown"][number];

const SOROT = "#ffd23f";

function visual(x: Langkah, t: (k: string) => string): VisualSpec {
  return { emoji: x.emoji, color: x.color, scale: x.scale, count: x.count, kolom: x.kolom, shape: x.shape, width: x.width, angka: x.angka, latar: x.latar, label: t(x.labelKey) };
}

/** Tombol "Bantu" kecil (≥56px); disembunyikan di mode ujian. */

/* ---------------- tata letak bersama ---------------- */

/** Perkiraan tinggi baris judul (+ tombol Bantu) untuk menghitung sisa tinggi panggung. */
const tinggiKepala = (sk: number) => 58 * Math.min(sk, 1.3);
/** Jarak antarbagian root (gap-3). */
const GAP_ROOT = 12;

/**
 * Lebar sel terbesar (≤ maks) untuk `n` sel yang ber-wrap di lebar `lebar`, tanpa menambah jumlah baris
 * dibanding sel selebar `min`. Di HP (sempit) hasilnya praktis sama dengan tata letak lama; di tablet sel melebar.
 */
function selMuat(lebar: number, n: number, min: number, maks: number, gap: number): { s: number; baris: number } {
  if (lebar <= 0 || n <= 0) return { s: min, baris: 1 };
  const perBaris = Math.max(1, Math.min(n, Math.floor((lebar + gap) / (min + gap))));
  return { s: Math.max(min, Math.min(maks, (lebar - gap * (perBaris - 1)) / perBaris)), baris: Math.ceil(n / perBaris) };
}

const batas = (min: number, x: number, maks: number) => Math.round(Math.min(maks, Math.max(min, x)));

/** Rak tujuan bertema dunia (warna wadah + bibir rak gelap), menggantikan kotak putih pucat. */
function gayaRak(_tema: Tema, sk: number): CSSProperties {
  // gaya bersih: tanpa panel pembungkus; slot & kartu langsung di atas latar layar
  return { padding: 4 * sk };
}

/** Panel benda (kartu yang belum dipakai): tanpa pembungkus, kartu langsung di atas latar. */
function gayaPanel(_tema: Tema, sk: number): CSSProperties {
  return { padding: 4 * sk };
}

/** Lubang slot di rak: kosong = cekung nyaris putih bergaris putus tegas, terisi = kartu putih. Isi selalu di atas latar terang. */
function gayaLubang(terisi: boolean, ring: string, latar?: string): CSSProperties {
  return terisi
    ? { border: `3px solid ${ring}`, background: latar ?? "#fff", boxShadow: "0 4px 0 rgba(0,0,0,.18)" }
    : { border: `3px dashed ${ring}`, background: latar ?? "rgba(255,255,255,.9)", boxShadow: "inset 0 4px 10px rgba(0,0,0,.14)" };
}

/** Judul urutan + tombol bantu dalam satu baris. */
function Kepala({ judul, onBantu, kunci, tanpaBantu }: { judul: string; onBantu: () => void; kunci: boolean; tanpaBantu?: boolean }) {
  const { skala: sk } = usePanggung();
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 px-1 text-center" style={{ fontFamily: BALOO, fontSize: 21 * Math.min(sk, 1.3), fontWeight: 800, lineHeight: 1.15, color: "var(--pilar)" }}>
        {judul}
      </div>
      {!tanpaBantu && <TombolBantu onClick={onBantu} disabled={kunci} />}
    </div>
  );
}

/** Nomor slot bulat besar. */
function Nomor({ n, warna }: { n: number; warna?: string }) {
  const { tema, skala: sk } = usePanggung();
  const d = Math.round(36 * sk);
  return (
    <span
      className="flex items-center justify-center rounded-full text-white"
      style={{ width: d, height: d, background: warna ?? tema.aksen, fontFamily: BALOO, fontSize: 20 * sk, fontWeight: 900, boxShadow: "0 3px 0 rgba(11,37,69,.18), 0 0 0 2px #fff" }}
    >
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
    sfxAkademi.taruh();
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
  const { tema, skala: sk, w, h } = usePanggung();
  // ukuran mengikuti panggung: rak ±55% dan baki kartu ±45% dari sisa tinggi; lebar sel tanpa menambah baris
  const base = n <= 4 ? 64 : 52;
  const gap = Math.round(10 * sk);
  const pad = 12 * sk;
  const lebarDalam = w > 0 ? w - 2 * pad - 6 : 0;
  const tinggi = h > 0 ? h - tinggiKepala(sk) - 2 * GAP_ROOT : 0;
  const lebar = w >= 600 ? 230 : 140;
  const sel = selMuat(lebarDalam, n, 84 * sk, lebar * sk, gap);
  // layar tegak (HP): sel sempit tapi tinggi longgar → slot/kartu boleh lebih jangkung dan bendanya lebih besar
  const tegak = w > 0 && h > w;
  const rasio = tegak ? 1.6 : 1.15;
  const isiLebar = tegak ? 0.68 : 0.6;
  const tinggiSlot = batas(96 * sk, Math.min(sel.s * rasio, (tinggi * 0.55 - 2 * pad - gap * (sel.baris - 1)) / sel.baris), 400);
  // benda berskala (mis. planet besar) dibagi skala terbesarnya supaya tidak meluap dari kartu/slot
  const skalaMaks = Math.max(1, ...shown.map((x) => visual(x, t).scale ?? 1));
  const ukuran = batas(base * sk, Math.min(tinggiSlot * 0.6, sel.s * isiLebar), 170) / skalaMaks;
  const kar = selMuat(lebarDalam, n, 84 * sk, (w >= 600 ? 200 : 140) * sk, gap);
  const tinggiKartu = (tinggi * 0.45 - 2 * pad - gap * (kar.baris - 1)) / kar.baris;
  const ukuranKartu = batas((base + 8) * sk, Math.min(tinggiKartu * 0.5, kar.s * (tegak ? 0.68 : 0.58)), 160) / skalaMaks;
  // di layar tegak kartu ikut meninggi mengisi baki (mendatar tetap setinggi isinya)
  const tinggiMinKartu = tegak ? batas(84 * sk, Math.min(tinggiKartu, kar.s * 1.6), 400) : 84 * sk;

  return (
    <div className="flex flex-1 flex-col gap-3" style={{ color: INK }}>
      <Kepala judul={t(ronde.titleKey)} onBantu={bantu} kunci={kunci} />

      {/* slot bernomor di rak bertema dunia */}
      <div className="flex flex-wrap content-center items-center justify-center" style={{ ...gayaRak(tema, sk), gap, flex: "11 1 0%", paddingTop: 18 * sk }}>
        {slot.map((id, i) => {
          const benar = kunci && id === correct[i];
          const salah = kunci && id !== correct[i];
          const disorot = hint?.slot === i;
          const siap = !!terpilih && !id && !kunci;
          const ring = benar ? BENAR : salah ? SALAH : disorot ? SOROT : siap ? "#0786eb" : tema.wadahGelap;
          return (
            <button
              key={i}
              type="button"
              onClick={() => ketukSlot(i)}
              disabled={kunci}
              aria-label={`Slot ${i + 1}`}
              className={`relative flex flex-col items-center justify-center gap-1 p-1.5 transition-transform active:scale-95 ${salah ? "akademi-shake" : ""} ${disorot ? "akademi-bounce" : ""}`}
              style={{
                width: sel.s,
                minHeight: tinggiSlot,
                borderRadius: 20 * sk,
                ...gayaLubang(!!id, ring, benar ? "#e6f8ef" : salah ? "#ffe9ec" : undefined),
                boxShadow: siap ? "inset 0 4px 10px rgba(0,0,0,.14), 0 0 0 3px #fff" : gayaLubang(!!id, ring).boxShadow,
              }}
            >
              <span className="absolute -top-3 -left-1">
                <Nomor n={i + 1} warna={benar ? BENAR : salah ? SALAH : undefined} />
              </span>
              {id ? (
                <KartuBenda v={visual(langkah(id), t)} size={ukuran} keterangan={false} className="pointer-events-none !shadow-none" />
              ) : (
                <span style={{ fontFamily: BALOO, fontSize: Math.max(30 * sk, ukuran * skalaMaks * 0.55), fontWeight: 900, color: siap ? "#0786eb" : tema.wadahGelap, lineHeight: 1 }}>?</span>
              )}
            </button>
          );
        })}
      </div>

      {/* kartu langkah yang belum dipakai */}
      <div className="flex flex-wrap content-center items-center justify-center" style={{ ...gayaPanel(tema, sk), gap, flex: "9 1 0%", minHeight: 100 * sk }}>
        {sisa.map((s) => {
          const dipilih = terpilih === s.id;
          const disorot = hint?.kartu === s.id;
          return (
            <KartuBenda
              key={s.id}
              v={visual(s, t)}
              size={ukuranKartu}
              labelSize={Math.round(Math.min(20, 13 * Math.max(sk, ukuranKartu / 72)))}
              selected={dipilih}
              onClick={() => ketukKartu(s.id)}
              className={disorot ? "akademi-bounce" : ""}
              style={{
                width: kar.s,
                minHeight: tinggiMinKartu,
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
    sfxAkademi.taruh();
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
  const { tema, skala: sk, w, h } = usePanggung();
  const base = n <= 4 ? 64 : 52;
  const gap = Math.round(10 * sk);
  const pad = 12 * sk;
  const lebarDalam = w > 0 ? w - 2 * pad - 6 : 0;
  // sisa tinggi untuk kartu: panggung − judul − baris aksi − petunjuk teks − jarak
  const tinggi = h > 0 ? h - tinggiKepala(sk) - 64 * Math.min(sk, 1.3) - 2 * GAP_ROOT - 2 * pad - 44 * sk : 0;
  // kartu bertulisan kalimat ("15.15 mengerjakan PR"): sel minimal lebih lebar (2 kolom di HP) supaya hurufnya
  // tetap besar dan kata tidak perlu diperkecil/terpotong
  const teksSaja = urutan.every((id) => { const l = langkah(id); return !l.emoji && !l.shape; });
  const kataPanjang = Math.max(0, ...urutan.flatMap((id) => t(langkah(id).labelKey).split(/\s+/).map((k) => k.length)));
  const sel = selMuat(lebarDalam, n, (teksSaja && kataPanjang > 6 ? 132 : 84) * sk, (w >= 600 ? 230 : 160) * sk, gap);
  const tegak = w > 0 && h > w;
  const tinggiKartu = batas(96 * sk, Math.min(sel.s * (tegak ? 1.9 : 1.2), (tinggi - gap * (sel.baris - 1)) / sel.baris), 420);
  const ukuran = batas(base * sk, Math.min(tinggiKartu * 0.55, sel.s * (tegak ? 0.72 : 0.6)), 170);

  return (
    <div className="flex flex-1 flex-col gap-3" style={{ color: INK }}>
      <Kepala judul={t(ronde.titleKey)} onBantu={bantu} kunci={kunci} />
      <div className="flex flex-1 flex-col items-center justify-center text-center" style={{ ...gayaRak(tema, sk), gap: 14 * sk }}>
        <div style={{ fontFamily: NUNITO, fontSize: 13.5 * Math.min(sk, 1.3), fontWeight: 800, color: "#6b7790" }}>Ketuk dua kartu untuk menukar tempatnya</div>
        <div className="flex flex-wrap justify-center" style={{ gap }}>
          {urutan.map((id, i) => {
            const benar = !!hasil && id === correct[i];
            const salah = !!hasil && id !== correct[i];
            const dipilih = terpilih === id;
            const disorot = hint === id;
            return (
              <div key={id} className="relative flex justify-center" style={{ width: sel.s }}>
                <span className="absolute -top-3 left-1 z-10">
                  <Nomor n={i + 1} warna={benar ? BENAR : salah ? SALAH : undefined} />
                </span>
                <KartuBenda
                  penuh
                  v={visual(langkah(id), t)}
                  size={ukuran}
                  labelSize={Math.round(Math.min(20, 13 * Math.max(sk, ukuran / 64)))}
                  selected={dipilih}
                  right={benar}
                  wrong={salah}
                  onClick={() => ketuk(id)}
                  className={`w-full ${salah ? "akademi-shake" : ""} ${disorot ? "akademi-bounce" : ""}`}
                  style={{
                    minHeight: tinggiKartu,
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
        <span className="rounded-full bg-white px-3 py-1 shadow-[0_3px_0_rgba(11,37,69,.1)]" style={{ fontFamily: BALOO, fontSize: 15 * Math.min(sk, 1.3), fontWeight: 800, color: INK }} aria-label={`Ditukar ${tukar} kali`}>
          🔁 {tukar}
        </span>
        <button
          type="button"
          onClick={selesai}
          disabled={kunci}
          className="flex-1 rounded-[20px] bg-[#22b573] py-4 text-white shadow-[0_5px_0_#16804f] active:translate-y-1 disabled:opacity-60"
          style={{ fontFamily: BALOO, fontSize: 22 * Math.min(sk, 1.3), fontWeight: 900, minHeight: 60 * Math.min(sk, 1.3) }}
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

  const { tema, skala: sk, w, h } = usePanggung();
  const adaJudul = !/^mana yang lebih dulu/i.test(t(ronde.titleKey));
  // dua kartu besar mengisi panggung; tinggi dibatasi agar tidak terlalu jangkung di HP
  const gap = Math.round(12 * sk);
  const lebarKartu = w > 0 ? (w - gap) / 2 : 0;
  const tinggiSisa = h > 0 ? h - (adaJudul ? tinggiKepala(sk) + GAP_ROOT : 0) - 62 * Math.min(sk, 1.3) - GAP_ROOT : 0;
  const tinggiKartu = batas(150 * sk, Math.min(tinggiSisa, lebarKartu * 1.15), 560);
  const ukuran = batas(96 * sk, Math.min(tinggiKartu * 0.5, lebarKartu * 0.5), 210);

  return (
    <div className="flex flex-1 flex-col gap-3" style={{ color: INK }}>
      {/* judul kegiatan; dilewati bila paket memakai judul umum yang sama dengan pertanyaan di bawah */}
      {adaJudul && <Kepala judul={t(ronde.titleKey)} onBantu={() => {}} kunci={kunci} tanpaBantu />}
      <div className="rounded-[22px] bg-white px-4 py-3 text-center" style={{ fontFamily: BALOO, fontSize: 24 * Math.min(sk, 1.3), fontWeight: 900, lineHeight: 1.15, boxShadow: `0 4px 0 rgba(11,37,69,.1), inset 0 0 0 3px ${tema.aksen}33` }}>
        Mana yang lebih dulu? <span style={{ color: "#0567c2" }}>?</span>
      </div>
      <div className="grid flex-1 grid-cols-2 content-center" style={{ gap, gridAutoRows: tinggiKartu }}>
        {shown.map((s) => {
          const benar = !!hasil && s.id === benarId;
          const salah = !!hasil && dipilih === s.id && s.id !== benarId;
          return (
            <KartuBenda
              key={s.id}
              v={visual(s, t)}
              size={ukuran}
              label={t(s.labelKey)}
              labelSize={Math.round(18 * Math.min(Math.max(sk, ukuran / 110), 1.5))}
              selected={!hasil && dipilih === s.id}
              right={benar}
              wrong={salah}
              onClick={() => pilih(s.id)}
              className={`${salah ? "akademi-shake" : ""} ${benar ? "akademi-pop" : ""}`}
              style={{ minHeight: 150 * sk, background: benar ? "#e6f8ef" : salah ? "#ffe9ec" : undefined, pointerEvents: kunci ? "none" : undefined, boxShadow: `0 5px 0 rgba(11,37,69,.12), 0 0 0 3px ${benar ? BENAR : salah ? SALAH : !hasil && dipilih === s.id ? "#0786eb" : `${tema.aksen}55`}` }}
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
    sfxAkademi.taruh();
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
      if (berhenti !== null) { sfxAkademi.tolak(); ucapkan("Lho, ceritanya berhenti di sini."); }
      else sfx.celebrate();
    }, akhir));
    timers.current.push(setTimeout(() => {
      setTerkirim(true);
      onJawab({ labels });
    }, akhir + (berhenti !== null ? 1600 : 700)));
  };

  const { tema, skala: sk, w, h } = usePanggung();
  const base = n <= 3 ? 72 : 60;
  const gap = Math.round(10 * sk);
  const pad = 12 * sk;
  const lebarDalam = w > 0 ? w - 2 * pad - 6 : 0;
  const tinggiSlot = 64 * Math.min(sk, 1.3);
  // sisa tinggi untuk kolom gambar+slot: panggung − judul − palet label − tombol cerita − jarak
  const tinggi = h > 0 ? h - tinggiKepala(sk) - 104 * Math.min(sk, 1.3) - 62 * Math.min(sk, 1.3) - 3 * GAP_ROOT - 2 * pad : 0;
  const sel = selMuat(lebarDalam, n, 92 * sk, (w >= 600 ? 240 : 150) * sk, gap);
  const tinggiKolom = (tinggi - gap * (sel.baris - 1)) / sel.baris;
  const tegak = w > 0 && h > w;
  const tinggiGambar = batas(108 * sk, Math.min(sel.s * (tegak ? 1.6 : 1.2), tinggiKolom - tinggiSlot - 8 * sk), 420);
  const ukuran = batas(base * sk, Math.min(tinggiGambar * 0.5, sel.s * (tegak ? 0.66 : 0.55)), 170);

  return (
    <div className="flex flex-1 flex-col gap-3" style={{ color: INK }}>
      <Kepala judul={t(ronde.titleKey)} onBantu={bantu} kunci={kunci} />

      {/* gambar berjajar + slot label di bawah tiap gambar, di rak bertema dunia */}
      <div className="flex flex-1 flex-wrap content-center items-start justify-center" style={{ ...gayaRak(tema, sk), gap }}>
        {shown.map((s, i) => {
          const l = slot[i];
          const aktif = cerita?.aktif === i;
          const redup = cerita?.selesai && cerita.berhenti !== null && i > cerita.berhenti;
          const benarKah = !!hasil && l === benar[i];
          const salahKah = !!hasil && l !== benar[i];
          const disorot = hint?.slot === i;
          const siap = !!terpilih && !l && !kunci;
          const ring = benarKah ? BENAR : salahKah ? SALAH : disorot ? SOROT : siap ? "#0786eb" : tema.wadahGelap;
          return (
            <div key={s.id} className="flex flex-col items-center gap-2 transition-opacity duration-700" style={{ width: sel.s, opacity: redup ? 0.3 : 1 }}>
              <KartuBenda
                penuh
                v={visual(s, t)}
                size={ukuran}
                label={t(s.labelKey)}
                labelSize={Math.round(Math.min(20, 13 * Math.max(sk, ukuran / 72)))}
                className={`w-full ${aktif ? "akademi-bounce" : ""}`}
                style={{ minHeight: tinggiGambar, boxShadow: aktif ? `0 4px 0 rgba(11,37,69,.12), 0 0 0 4px ${SOROT}` : undefined, pointerEvents: "none" }}
              />
              <button
                type="button"
                onClick={() => ketukSlot(i)}
                disabled={kunci}
                aria-label={`Label gambar ${i + 1}${l ? `: ${LABEL[l].kata}` : ", kosong"}`}
                className={`flex w-full items-center justify-center gap-1 transition-transform active:scale-95 ${salahKah ? "akademi-shake" : ""} ${disorot ? "akademi-bounce" : ""}`}
                style={{
                  minHeight: tinggiSlot,
                  borderRadius: 18 * sk,
                  ...gayaLubang(!!l, ring, benarKah ? "#e6f8ef" : salahKah ? "#ffe9ec" : undefined),
                  boxShadow: siap ? "inset 0 4px 10px rgba(0,0,0,.14), 0 0 0 3px #fff" : gayaLubang(!!l, ring).boxShadow,
                }}
              >
                {l ? (
                  <>
                    <span style={{ fontSize: 30 * Math.min(sk, 1.3), lineHeight: 1 }} aria-hidden>{LABEL[l].ikon}</span>
                    <span style={{ fontFamily: BALOO, fontSize: 15 * Math.min(sk, 1.3), fontWeight: 800, color: INK }}>{LABEL[l].kata}</span>
                  </>
                ) : (
                  <span style={{ fontFamily: BALOO, fontSize: 26 * Math.min(sk, 1.3), fontWeight: 900, lineHeight: 1, color: siap ? "#0786eb" : tema.wadahGelap }}>?</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* palet label: ikon + suara */}
      <div className="flex justify-center" style={{ ...gayaPanel(tema, sk), padding: 10 * sk, gap: 10 * sk }} role="group" aria-label="Keping label">
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
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-[18px] bg-white px-3 transition-transform active:scale-95 disabled:opacity-40 ${disorot ? "akademi-bounce" : ""}`}
              style={{
                minHeight: 80 * Math.min(sk, 1.3),
                minWidth: 92 * Math.min(sk, 1.3),
                boxShadow: `0 4px 0 rgba(11,37,69,.12), 0 0 0 3px ${dipilih ? "#0786eb" : disorot ? SOROT : `${tema.aksen}55`}`,
                transform: dipilih ? "scale(1.08)" : undefined,
              }}
            >
              <span style={{ fontSize: 34 * Math.min(sk, 1.3), lineHeight: 1 }} aria-hidden>{LABEL[l].ikon}</span>
              <span style={{ fontFamily: BALOO, fontSize: 14 * Math.min(sk, 1.3), fontWeight: 800, color: INK }}>{LABEL[l].kata}</span>
              {jatah(l) > 1 && <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full text-white" style={{ background: "#0786eb", fontFamily: BALOO, fontSize: 14, fontWeight: 900, boxShadow: "0 0 0 2px #fff" }}>{tersisa}</span>}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={ceritakan}
        disabled={kunci || !lengkap}
        className="flex items-center justify-center gap-2 rounded-[20px] bg-[#22b573] py-3 text-white shadow-[0_5px_0_#16804f] active:translate-y-1 disabled:opacity-60"
        style={{ fontFamily: BALOO, fontSize: 22 * Math.min(sk, 1.3), fontWeight: 900, minHeight: 60 * Math.min(sk, 1.3) }}
      >
        {cerita && !cerita.selesai ? <><Icon name="volume_up" size={26} /> Robot bercerita…</> : <>Ceritakan <Icon name="play_arrow" size={28} /></>}
      </button>
    </div>
  );
}
