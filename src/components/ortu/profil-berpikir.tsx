"use client";

// Profil Kemampuan Berpikir: layar tes (4 bagian) + tampilan hasil untuk orang tua. BUKAN tes IQ — lihat
// lib/akademi/berpikir.ts. Hasil disimpan di localStorage["rumila-berpikir-<memberId>"] (ikut sinkron game_save).

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import {
  ARTI_ASPEK, ASPEK, DURASI_KECEPATAN_MS, KUNCI_BERPIKIR, NAMA_ASPEK, SARAN_ASPEK, SPAN_AWAL, SPAN_MAKS,
  indeks, pasanganCepat, ringkasProfil, soalPola, soalSpasial, urutanMemori, type HasilBerpikir, type Sel, type Ubin,
} from "@/lib/akademi/berpikir";
import { levelAnak } from "@/lib/akademi/konten";
import { LEVELS } from "@akademi/schema";
import type { Member } from "@/lib/store";

const INK = "#0b2545";
const KARTU = "rounded-[22px] bg-white shadow-[0_4px_0_rgba(11,37,69,.06)]";
const EVENT = "rumila:berpikir";

/* ---------------- penyimpanan ---------------- */

export function hasilBerpikir(memberId: string): HasilBerpikir[] {
  try {
    const v = JSON.parse(localStorage.getItem(KUNCI_BERPIKIR(memberId)) ?? "[]") as unknown;
    return Array.isArray(v) ? (v as HasilBerpikir[]).filter((h) => h && typeof h.at === "string" && h.pola && h.memori) : [];
  } catch {
    return [];
  }
}
function simpanHasil(memberId: string, h: HasilBerpikir) {
  try {
    localStorage.setItem(KUNCI_BERPIKIR(memberId), JSON.stringify([...hasilBerpikir(memberId), h].slice(-20)));
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: memberId }));
}
function useHasilBerpikir(memberId: string) {
  const [xs, setXs] = useState<HasilBerpikir[]>([]);
  useEffect(() => {
    const segar = () => setXs(hasilBerpikir(memberId));
    segar();
    window.addEventListener(EVENT, segar);
    window.addEventListener("rumila:saves", segar);
    return () => {
      window.removeEventListener(EVENT, segar);
      window.removeEventListener("rumila:saves", segar);
    };
  }, [memberId]);
  return xs;
}

const usiaPerkiraan = (memberId: string) => {
  const l = LEVELS.find((x) => x.id === levelAnak(memberId));
  return l ? l.usia[0] : 5;
};

/* ---------------- tampilan orang tua ---------------- */

const WARNA_PITA = { "Perlu latihan": "#fd861d", "Sesuai usia": "#0786eb", Menonjol: "#22a06b" } as const;

export function ProfilBerpikirOrtu({ anak }: { anak: Member }) {
  const xs = useHasilBerpikir(anak.id);
  const akhir = xs.at(-1);
  const idx = useMemo(() => (akhir ? indeks(akhir) : []), [akhir]);
  return (
    <div className="flex flex-col gap-4">
      <section className={`${KARTU} flex flex-wrap items-center gap-3 p-5`}>
        <div className="min-w-0 flex-1">
          <h2 style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 800 }}>Profil Kemampuan Berpikir</h2>
          <p className="text-[13px] font-bold text-ink-3">4 permainan singkat (±10 menit): pola, memori, spasial, kecepatan. Dampingi anak, jangan bantu menjawab.</p>
        </div>
        <Link href={`/orang-tua/berpikir?anak=${anak.id}`} className="inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-white" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800, background: "linear-gradient(155deg,#5fb8ff,#0786eb 60%)", boxShadow: "0 3px 0 #0567c2" }}>
          <Icon name="play_arrow" size={20} /> {akhir ? "Tes ulang" : "Mulai tes"}
        </Link>
      </section>

      {akhir ? (
        <>
          <section className={`${KARTU} p-5`}>
            <p className="text-[12px] font-extrabold tracking-wide text-ink-3 uppercase">
              Hasil {new Date(akhir.at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · dibanding target usia {akhir.usia} tahun
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {idx.map((x) => (
                <div key={x.aspek}>
                  <div className="flex items-baseline justify-between gap-2">
                    <b className="text-[15px]">{NAMA_ASPEK[x.aspek]}</b>
                    <span className="text-[13px] font-extrabold" style={{ color: WARNA_PITA[x.pita] }}>
                      {x.pita}
                    </span>
                  </div>
                  <div className="relative mt-1 h-3 overflow-hidden rounded-full bg-[#f1e6d6]" aria-label={`${NAMA_ASPEK[x.aspek]}: ${x.nilai} dari target 100`}>
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(x.nilai / 150) * 100}%`, background: WARNA_PITA[x.pita] }} />
                    <span aria-hidden className="absolute inset-y-0 w-0.5 bg-[#0b2545]" style={{ left: `${(100 / 150) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-[12.5px] font-bold text-ink-3">{ARTI_ASPEK[x.aspek]}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] font-bold text-ink-3">Garis gelap = target usia. Batang melewati garis berarti di atas target.</p>
          </section>
          <Saran h={akhir} />
          {xs.length > 1 && (
            <section className={`${KARTU} p-5`}>
              <h3 style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800 }}>Riwayat tes</h3>
              <ul className="mt-2 flex flex-col gap-1 text-[13.5px]">
                {xs
                  .slice()
                  .reverse()
                  .map((h) => (
                    <li key={h.at} className="flex flex-wrap justify-between gap-2 border-t border-[#f1e6d6] py-1.5">
                      <span>{new Date(h.at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="font-bold text-ink-3">
                        {indeks(h)
                          .map((x) => `${NAMA_ASPEK[x.aspek].split(" ")[0]} ${x.pita.toLowerCase()}`)
                          .join(" · ")}
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <p className={`${KARTU} p-5 text-[14px] font-bold text-ink-3`}>Belum ada hasil. Mulai tes saat anak segar (bukan saat mengantuk atau lapar).</p>
      )}

      <p className="rounded-[18px] bg-[#fff7e6] p-4 text-[12.5px] font-bold text-[#7a5200]">
        Ini bukan tes IQ. Skor IQ yang sah hanya bisa diberikan psikolog lewat tes baku yang dinormakan (misalnya WPPSI/WISC). Profil ini membandingkan dengan target usia perkiraan internal RINOYA untuk melihat kekuatan relatif dan arah latihan. Bila ada kekhawatiran perkembangan, konsultasikan ke psikolog anak.
      </p>
    </div>
  );
}

function Saran({ h }: { h: HasilBerpikir }) {
  const { kuat, latih } = ringkasProfil(h);
  return (
    <section className={`${KARTU} grid gap-4 p-5 sm:grid-cols-2`}>
      <div>
        <p className="text-[12px] font-extrabold tracking-wide text-[#13794a] uppercase">Paling menonjol</p>
        <p style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>{NAMA_ASPEK[kuat]}</p>
        <p className="text-[13px] font-bold text-ink-3">Beri tantangan lebih: {SARAN_ASPEK[kuat]}</p>
      </div>
      <div>
        <p className="text-[12px] font-extrabold tracking-wide text-[#c2410c] uppercase">Paling perlu dilatih</p>
        <p style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>{NAMA_ASPEK[latih]}</p>
        <p className="text-[13px] font-bold text-ink-3">{SARAN_ASPEK[latih]}</p>
      </div>
    </section>
  );
}

/* ---------------- layar tes ---------------- */

type Tahap = "mulai" | (typeof ASPEK)[number] | "selesai";

export function TesBerpikir({ anak, kembaliKe }: { anak: Member; kembaliKe: string }) {
  const [tahap, setTahap] = useState<Tahap>("mulai");
  const [usia, setUsia] = useState(() => usiaPerkiraan(anak.id));
  const [seed] = useState(() => Math.floor(Math.random() * 1e9));
  const hasil = useRef<Partial<HasilBerpikir>>({});
  const lanjut = (dari: Tahap) => setTahap(dari === "mulai" ? "pola" : dari === "pola" ? "memori" : dari === "memori" ? "spasial" : dari === "spasial" ? "kecepatan" : "selesai");

  useEffect(() => {
    if (tahap !== "selesai") return;
    const h = { at: new Date().toISOString(), usia, ...hasil.current } as HasilBerpikir;
    if (h.pola && h.memori && h.spasial && h.kecepatan) simpanHasil(anak.id, h);
  }, [tahap, usia, anak.id]);

  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-5" style={{ background: "linear-gradient(180deg,#e4f1fd,#fff6e8)", color: INK, fontFamily: BALOO }}>
      <div className="flex w-full max-w-[560px] items-center gap-2">
        <Link href={kembaliKe} aria-label="Keluar" className="flex size-10 items-center justify-center rounded-full bg-white">
          <Icon name="close" size={22} />
        </Link>
        <div className="flex flex-1 gap-1">
          {ASPEK.map((a, i) => (
            <span key={a} className="h-2 flex-1 rounded-full" style={{ background: ASPEK.indexOf(tahap as never) > i || tahap === "selesai" ? "#22a06b" : tahap === a ? "#0786eb" : "rgba(11,37,69,.15)" }} />
          ))}
        </div>
      </div>
      <div className="flex w-full max-w-[560px] flex-1 flex-col justify-center py-4">
        {tahap === "mulai" && (
          <div className={`${KARTU} p-6 text-center`}>
            <Icon name="psychology" size={48} className="text-[#0786eb]" />
            <h1 className="mt-2 text-[26px] font-extrabold">Profil Berpikir {anak.name}</h1>
            <p className="mt-1 text-[15px] font-bold text-[#6b7a90]" style={{ fontFamily: "var(--ff-nunito), system-ui" }}>
              4 permainan: pola, memori, bentuk diputar, dan sama-beda cepat. Orang tua mendampingi, anak yang menjawab.
            </p>
            <label className="mt-4 flex items-center justify-center gap-2 text-[15px] font-bold" htmlFor="usia-anak">
              Usia anak
              <select id="usia-anak" value={usia} onChange={(e) => setUsia(Number(e.target.value))} className="rounded-[12px] border border-[#dbe4ef] bg-white px-3 py-1.5">
                {Array.from({ length: 10 }, (_, i) => i + 3).map((u) => (
                  <option key={u} value={u}>
                    {u} tahun
                  </option>
                ))}
              </select>
            </label>
            <TombolUtama onClick={() => lanjut("mulai")}>Mulai</TombolUtama>
          </div>
        )}
        {tahap === "pola" && <BagianPola seed={seed} onSelesai={(benar, total) => ((hasil.current.pola = { benar, total }), lanjut("pola"))} />}
        {tahap === "memori" && <BagianMemori seed={seed} onSelesai={(span) => ((hasil.current.memori = { span }), lanjut("memori"))} />}
        {tahap === "spasial" && <BagianSpasial seed={seed} onSelesai={(benar, total) => ((hasil.current.spasial = { benar, total }), lanjut("spasial"))} />}
        {tahap === "kecepatan" && <BagianKecepatan seed={seed} onSelesai={(benar, salah) => ((hasil.current.kecepatan = { benar, salah }), lanjut("kecepatan"))} />}
        {tahap === "selesai" && (
          <div className={`${KARTU} p-6 text-center`}>
            <Icon name="celebration" size={52} className="text-[#fd861d]" />
            <h1 className="mt-2 text-[26px] font-extrabold">Selesai, hebat!</h1>
            <p className="mt-1 text-[15px] font-bold text-[#6b7a90]">Hasil lengkap ada di Ruang Orang Tua.</p>
            <Link href={kembaliKe} className="mt-5 block rounded-[18px] bg-[#22b573] py-3.5 text-[19px] font-extrabold text-white shadow-[0_5px_0_#16804f]">
              Lihat hasil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function TombolUtama({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="mt-5 w-full rounded-[18px] py-3.5 text-[20px] font-extrabold text-white active:translate-y-0.5 disabled:opacity-50" style={{ background: "linear-gradient(155deg,#5fb8ff,#0786eb 65%)", boxShadow: "0 5px 0 #0567c2" }}>
      {children}
    </button>
  );
}

function Judul({ teks, sub }: { teks: string; sub: string }) {
  return (
    <div className="mb-4 text-center">
      <h2 className="text-[24px] leading-tight font-extrabold">{teks}</h2>
      <p className="text-[14px] font-bold text-[#6b7a90]">{sub}</p>
    </div>
  );
}

/* pola */
function GambarUbin({ u, ukuran = 52 }: { u: Ubin; ukuran?: number }) {
  const titik = Array.from({ length: u.n }, (_, i) => i);
  const r = 9;
  const bentuk = (cx: number, cy: number, s: number) =>
    u.bentuk === "lingkaran" ? <circle cx={cx} cy={cy} r={s} fill={u.warna} /> : u.bentuk === "kotak" ? <rect x={cx - s} y={cy - s} width={s * 2} height={s * 2} rx={2} fill={u.warna} /> : u.bentuk === "segitiga" ? <polygon points={`${cx},${cy - s} ${cx + s},${cy + s} ${cx - s},${cy + s}`} fill={u.warna} /> : <polygon points={bintang(cx, cy, s)} fill={u.warna} />;
  const pos = u.n === 1 ? [[26, 26]] : u.n === 2 ? [[16, 26], [36, 26]] : u.n === 3 ? [[26, 15], [15, 36], [37, 36]] : [[16, 16], [36, 16], [16, 36], [36, 36]];
  return (
    <svg viewBox="0 0 52 52" width={ukuran} height={ukuran} aria-hidden>
      {titik.map((i) => (
        <g key={i}>{bentuk(pos[i][0], pos[i][1], u.n === 1 ? 18 : r)}</g>
      ))}
    </svg>
  );
}
function bintang(cx: number, cy: number, s: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? s * 0.45 : s;
    return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ");
}

function BagianPola({ seed, onSelesai }: { seed: number; onSelesai: (benar: number, total: number) => void }) {
  const soal = useMemo(() => soalPola(seed), [seed]);
  const [i, setI] = useState(0);
  const benar = useRef(0);
  const q = soal[i];
  const jawab = (k: number) => {
    if (k === q.benar) benar.current++;
    if (i + 1 < soal.length) setI(i + 1);
    else onSelesai(benar.current, soal.length);
  };
  return (
    <div>
      <Judul teks="Apa selanjutnya?" sub={`Pola ${i + 1} dari ${soal.length}`} />
      <div className={`${KARTU} flex flex-wrap items-center justify-center gap-2 p-4`}>
        {q.deret.map((u, k) => (
          <GambarUbin key={k} u={u} ukuran={44} />
        ))}
        <span className="flex size-11 items-center justify-center rounded-[12px] border-2 border-dashed border-[#0786eb] text-[24px] font-extrabold text-[#0786eb]">?</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {q.pilihan.map((u, k) => (
          <button key={`${i}-${k}`} onClick={() => jawab(k)} aria-label={`Pilihan ${k + 1}`} className={`${KARTU} flex h-24 items-center justify-center active:scale-95`}>
            <GambarUbin u={u} ukuran={64} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* memori */
function BagianMemori({ seed, onSelesai }: { seed: number; onSelesai: (span: number) => void }) {
  const [span, setSpan] = useState(SPAN_AWAL);
  const [coba, setCoba] = useState(0);
  const [gagal, setGagal] = useState(0);
  const [terbaik, setTerbaik] = useState(SPAN_AWAL - 1);
  const [nyala, setNyala] = useState<number | null>(null);
  const [fase, setFase] = useState<"siap" | "lihat" | "ulangi">("siap");
  const [isian, setIsian] = useState<number[]>([]);
  const urutan = useMemo(() => urutanMemori(seed + span * 31 + coba * 7, span), [seed, span, coba]);

  const putar = useCallback(() => {
    setFase("lihat");
    setIsian([]);
    urutan.forEach((k, i) => {
      setTimeout(() => setNyala(k), 300 + i * 900);
      setTimeout(() => setNyala(null), 300 + i * 900 + 650);
    });
    setTimeout(() => setFase("ulangi"), 300 + urutan.length * 900);
  }, [urutan]);

  const ketuk = (k: number) => {
    if (fase !== "ulangi") return;
    const isi = [...isian, k];
    setIsian(isi);
    setNyala(k);
    setTimeout(() => setNyala(null), 180);
    if (isi.length < urutan.length) return;
    const ok = isi.every((x, i) => x === urutan[i]);
    setFase("siap");
    if (ok) {
      setTerbaik(span);
      if (span >= SPAN_MAKS) return onSelesai(span);
      setSpan(span + 1);
      setCoba(0);
      setGagal(0);
    } else if (gagal + 1 >= 2) {
      onSelesai(terbaik);
    } else {
      setGagal(gagal + 1);
      setCoba(coba + 1);
    }
  };

  return (
    <div>
      <Judul teks="Ingat urutannya" sub={fase === "lihat" ? "Perhatikan kotak yang menyala…" : fase === "ulangi" ? `Ketuk ${urutan.length} kotak dengan urutan yang sama` : `Panjang ${span} kotak`} />
      <div className="mx-auto grid w-full max-w-[320px] grid-cols-3 gap-3">
        {Array.from({ length: 9 }, (_, k) => (
          <button key={k} onClick={() => ketuk(k)} aria-label={`Kotak ${k + 1}`} className="aspect-square rounded-[18px] transition-colors" style={{ background: nyala === k ? "#fdb724" : "#fff", boxShadow: "0 4px 0 rgba(11,37,69,.1)" }} />
        ))}
      </div>
      {fase === "siap" && <TombolUtama onClick={putar}>{gagal ? "Coba lagi" : "Lihat urutan"}</TombolUtama>}
    </div>
  );
}

/* spasial */
function GambarSel({ s, ukuran = 80, warna = "#0786eb" }: { s: Sel[]; ukuran?: number; warna?: string }) {
  const w = Math.max(...s.map((c) => c[0])) + 1;
  const h = Math.max(...s.map((c) => c[1])) + 1;
  const n = Math.max(w, h);
  return (
    <svg viewBox={`-0.2 -0.2 ${n + 0.4} ${n + 0.4}`} width={ukuran} height={ukuran} aria-hidden>
      {s.map(([x, y]) => (
        <rect key={`${x},${y}`} x={x + (n - w) / 2} y={y + (n - h) / 2} width={0.94} height={0.94} rx={0.12} fill={warna} />
      ))}
    </svg>
  );
}

function BagianSpasial({ seed, onSelesai }: { seed: number; onSelesai: (benar: number, total: number) => void }) {
  const soal = useMemo(() => soalSpasial(seed), [seed]);
  const [i, setI] = useState(0);
  const benar = useRef(0);
  const q = soal[i];
  const jawab = (k: number) => {
    if (k === q.benar) benar.current++;
    if (i + 1 < soal.length) setI(i + 1);
    else onSelesai(benar.current, soal.length);
  };
  return (
    <div>
      <Judul teks="Mana yang sama kalau diputar?" sub={`Bentuk ${i + 1} dari ${soal.length} · bukan yang dibalik seperti di cermin`} />
      <div className={`${KARTU} mx-auto flex w-40 items-center justify-center p-4`}>
        <GambarSel s={q.contoh} ukuran={110} warna="#135385" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {q.pilihan.map((p, k) => (
          <button key={`${i}-${k}`} onClick={() => jawab(k)} aria-label={`Pilihan ${k + 1}`} className={`${KARTU} flex h-28 items-center justify-center active:scale-95`}>
            <GambarSel s={p} ukuran={84} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* kecepatan */
function BagianKecepatan({ seed, onSelesai }: { seed: number; onSelesai: (benar: number, salah: number) => void }) {
  const soal = useMemo(() => pasanganCepat(seed), [seed]);
  const [mulai, setMulai] = useState<number | null>(null);
  const [sisa, setSisa] = useState(DURASI_KECEPATAN_MS);
  const [i, setI] = useState(0);
  const skor = useRef({ benar: 0, salah: 0 });
  useEffect(() => {
    if (mulai === null) return;
    const t = setInterval(() => {
      const s = Math.max(0, DURASI_KECEPATAN_MS - (Date.now() - mulai));
      setSisa(s);
      if (s === 0) {
        clearInterval(t);
        onSelesai(skor.current.benar, skor.current.salah);
      }
    }, 200);
    return () => clearInterval(t);
  }, [mulai, onSelesai]);
  const jawab = (sama: boolean) => {
    if (mulai === null) return;
    if (soal[i % soal.length].sama === sama) skor.current.benar++;
    else skor.current.salah++;
    setI(i + 1);
  };
  const q = soal[i % soal.length];
  return (
    <div>
      <Judul teks="Sama atau beda?" sub={mulai === null ? "Jawab secepat dan seteliti mungkin selama 40 detik" : `${Math.ceil(sisa / 1000)} detik`} />
      {mulai === null ? (
        <TombolUtama onClick={() => setMulai(Date.now())}>Mulai</TombolUtama>
      ) : (
        <>
          <div className={`${KARTU} flex items-center justify-around p-5 text-[40px] tracking-[0.15em]`} style={{ fontFamily: "system-ui" }}>
            <span>{q.kiri}</span>
            <span className="text-[20px] text-[#6b7a90]">|</span>
            <span>{q.kanan}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button onClick={() => jawab(true)} className="h-20 rounded-[20px] bg-[#22b573] text-[24px] font-extrabold text-white shadow-[0_5px_0_#16804f] active:translate-y-0.5">
              Sama
            </button>
            <button onClick={() => jawab(false)} className="h-20 rounded-[20px] bg-[#ff5a6e] text-[24px] font-extrabold text-white shadow-[0_5px_0_#c0334a] active:translate-y-0.5">
              Beda
            </button>
          </div>
        </>
      )}
    </div>
  );
}
