// Profil Kemampuan Berpikir RINOYA Academy — fungsi murni (pembuat soal, penilaian, perbandingan dengan target usia).
//
// BUKAN tes IQ. Skor IQ yang sah hanya dari tes baku yang dinormakan dan dijalankan psikolog (mis. WPPSI/WISC).
// Profil ini memakai target usia perkiraan internal RINOYA (belum dinormakan pada populasi), untuk melihat
// kekuatan relatif anak di empat aspek dan memberi saran latihan. Tidak menghasilkan satu angka gabungan.
//
// Empat aspek:
//   pola      penalaran pola: lanjutkan deret (8 soal)
//   memori    memori kerja: ulangi urutan kotak menyala, panjang naik (rentang terpanjang)
//   spasial   spasial: pilih bentuk yang sama dengan contoh setelah diputar, bukan dicerminkan (8 soal)
//   kecepatan kecepatan memproses: sama/beda secepatnya selama 40 detik (benar − salah)

export const ASPEK = ["pola", "memori", "spasial", "kecepatan"] as const;
export type Aspek = (typeof ASPEK)[number];

export const NAMA_ASPEK: Record<Aspek, string> = { pola: "Penalaran Pola", memori: "Memori Kerja", spasial: "Kemampuan Spasial", kecepatan: "Kecepatan Memproses" };
export const ARTI_ASPEK: Record<Aspek, string> = {
  pola: "Melihat aturan dan menebak kelanjutannya (dasar matematika & coding).",
  memori: "Menyimpan beberapa hal sekaligus di kepala sambil mengerjakannya (dasar membaca & berhitung bersusun).",
  spasial: "Membayangkan benda diputar atau dipindah (dasar geometri, peta, dan sains).",
  kecepatan: "Membandingkan dengan cepat dan teliti (kelancaran mengerjakan soal).",
};
export const SARAN_ASPEK: Record<Aspek, string> = {
  pola: "Main menyusun pola manik/warna, misi Pola di Coding, dan teka-teki 'apa selanjutnya'.",
  memori: "Permainan Simon/ulangi urutan, menghafal belanjaan 3–5 barang, cerita berantai.",
  spasial: "Puzzle, tangram, lego mengikuti gambar, membaca peta sederhana, misi Robot di Coding.",
  kecepatan: "Permainan cari perbedaan, kartu cepat sama/beda, latihan singkat 5 menit tapi rutin.",
};

export const DURASI_KECEPATAN_MS = 40_000;
export const JUMLAH_POLA = 8;
export const JUMLAH_SPASIAL = 8;
export const SPAN_AWAL = 2;
export const SPAN_MAKS = 8;

/* ---------------- acak deterministik ---------------- */

export function rngDari(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}
const pilih = <T,>(r: () => number, xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
function acak<T>(r: () => number, xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------- pola ---------------- */

export const WARNA = ["#ef4444", "#0786eb", "#fdb724", "#22a06b", "#8b5cf6", "#fd861d"] as const;
export const BENTUK = ["lingkaran", "kotak", "segitiga", "bintang"] as const;
export interface Ubin {
  warna: string;
  bentuk: (typeof BENTUK)[number];
  /** 1..4 (ukuran/jumlah titik) */
  n: number;
}
export interface SoalPola {
  deret: Ubin[];
  pilihan: Ubin[];
  benar: number;
}
const samaUbin = (a: Ubin, b: Ubin) => a.warna === b.warna && a.bentuk === b.bentuk && a.n === b.n;

/** 8 soal pola, makin sulit: AB, ABC, AAB, ABB, jumlah naik, dua atribut, jumlah turun, ABCD. */
export function soalPola(seed: number): SoalPola[] {
  const r = rngDari(seed);
  const out: SoalPola[] = [];
  const jenis = ["ab", "abc", "aab", "abb", "naik", "dua", "turun", "abcd"] as const;
  for (const j of jenis) {
    const w = acak(r, [...WARNA]);
    const b = acak(r, [...BENTUK]);
    const dasar = (i: number): Ubin => ({ warna: w[i], bentuk: b[i % b.length], n: 1 });
    let seq: Ubin[] = [];
    if (j === "ab") seq = Array.from({ length: 6 }, (_, i) => dasar(i % 2));
    if (j === "abc") seq = Array.from({ length: 7 }, (_, i) => dasar(i % 3));
    if (j === "aab") seq = Array.from({ length: 7 }, (_, i) => dasar([0, 0, 1][i % 3]));
    if (j === "abb") seq = Array.from({ length: 7 }, (_, i) => dasar([0, 1, 1][i % 3]));
    if (j === "naik") seq = Array.from({ length: 4 }, (_, i) => ({ warna: w[0], bentuk: b[0], n: i + 1 }));
    if (j === "dua") seq = Array.from({ length: 6 }, (_, i) => ({ warna: w[i % 2], bentuk: b[i % 3], n: 1 }));
    if (j === "turun") seq = Array.from({ length: 4 }, (_, i) => ({ warna: w[1], bentuk: b[1], n: 4 - i }));
    if (j === "abcd") seq = Array.from({ length: 8 }, (_, i) => dasar(i % 4));
    const jawab = seq[seq.length - 1];
    const deret = seq.slice(0, -1);
    const pengecoh: Ubin[] = [];
    const calon: Ubin[] = [
      { ...jawab, warna: w.find((x) => x !== jawab.warna)! },
      { ...jawab, bentuk: b.find((x) => x !== jawab.bentuk)! },
      { ...jawab, n: jawab.n === 1 ? 2 : jawab.n - 1 },
      deret[deret.length - 1],
      { warna: pilih(r, w), bentuk: pilih(r, b), n: 1 },
    ];
    for (const c of calon) if (!samaUbin(c, jawab) && !pengecoh.some((p) => samaUbin(p, c)) && pengecoh.length < 3) pengecoh.push(c);
    const pilihan = acak(r, [jawab, ...pengecoh]);
    out.push({ deret, pilihan, benar: pilihan.findIndex((p) => samaUbin(p, jawab)) });
  }
  return out;
}

/* ---------------- memori ---------------- */

/** Urutan kotak (0..8 di grid 3×3) sepanjang `span`, tanpa kotak sama berturut-turut. */
export function urutanMemori(seed: number, span: number): number[] {
  const r = rngDari(seed);
  const out: number[] = [];
  while (out.length < span) {
    const k = Math.floor(r() * 9);
    if (k !== out[out.length - 1]) out.push(k);
  }
  return out;
}

/* ---------------- spasial ---------------- */

/** Bentuk asimetris (tidak sama dengan cerminannya) sebagai daftar sel [x,y]. */
export const BENTUK_SPASIAL: readonly (readonly [number, number])[][] = [
  [[0, 0], [0, 1], [0, 2], [1, 2]], // L
  [[0, 0], [1, 0], [1, 1], [2, 1]], // S
  [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2]], // F kecil
  [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]], // W
  [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]], // Z panjang
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 2]], // F
];
export type Sel = [number, number];
const normal = (s: Sel[]): Sel[] => {
  const mx = Math.min(...s.map((c) => c[0]));
  const my = Math.min(...s.map((c) => c[1]));
  return s.map(([x, y]) => [x - mx, y - my] as Sel).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
};
export const putar = (s: Sel[], kali: number): Sel[] => {
  let out = s;
  for (let i = 0; i < ((kali % 4) + 4) % 4; i++) out = out.map(([x, y]) => [-y, x] as Sel);
  return normal(out);
};
export const cermin = (s: Sel[]): Sel[] => normal(s.map(([x, y]) => [-x, y] as Sel));
export const kunciBentuk = (s: Sel[]) => normal(s).map((c) => c.join(",")).join(";");
/** Sama bila salah satu putarannya identik. */
export const samaDiputar = (a: Sel[], b: Sel[]) => [0, 1, 2, 3].some((k) => kunciBentuk(putar(a, k)) === kunciBentuk(b));

export interface SoalSpasial {
  contoh: Sel[];
  pilihan: Sel[][];
  benar: number;
}

export function soalSpasial(seed: number): SoalSpasial[] {
  const r = rngDari(seed);
  const out: SoalSpasial[] = [];
  for (let i = 0; i < JUMLAH_SPASIAL; i++) {
    const dasar = normal(BENTUK_SPASIAL[i % BENTUK_SPASIAL.length].map((c) => [c[0], c[1]] as Sel));
    const contoh = putar(dasar, Math.floor(r() * 4));
    const jawab = putar(contoh, 1 + Math.floor(r() * 3));
    // pengecoh: cerminan contoh (sulit) + bentuk lain (soal awal) atau cerminan lain (soal akhir); semua unik
    const lain = normal(BENTUK_SPASIAL[(i + 1 + Math.floor(r() * 4)) % BENTUK_SPASIAL.length].map((c) => [c[0], c[1]] as Sel));
    const calon: Sel[][] = [putar(cermin(contoh), Math.floor(r() * 4))];
    for (let k = 0; k < 4; k++) calon.push(i < 4 ? putar(lain, k) : putar(cermin(contoh), k));
    for (let k = 0; k < 4; k++) calon.push(putar(cermin(lain), k), putar(lain, k));
    const kandidat: Sel[][] = [];
    const dipakai = new Set([kunciBentuk(jawab)]);
    for (const c of calon) {
      if (kandidat.length === 2) break;
      if (samaDiputar(contoh, c) || dipakai.has(kunciBentuk(c))) continue;
      dipakai.add(kunciBentuk(c));
      kandidat.push(c);
    }
    const pilihan = acak(r, [jawab, ...kandidat.slice(0, 2)]);
    out.push({ contoh, pilihan, benar: pilihan.findIndex((p) => kunciBentuk(p) === kunciBentuk(jawab)) });
  }
  return out;
}

/* ---------------- kecepatan ---------------- */

export const SIMBOL = ["★", "●", "▲", "■", "♥", "◆", "✚", "☾"] as const;
export interface PasanganCepat {
  kiri: string;
  kanan: string;
  sama: boolean;
}
export function pasanganCepat(seed: number, n = 80): PasanganCepat[] {
  const r = rngDari(seed);
  return Array.from({ length: n }, () => {
    const a = [pilih(r, SIMBOL), pilih(r, SIMBOL), pilih(r, SIMBOL)];
    const sama = r() < 0.5;
    const b = a.slice();
    if (!sama) {
      const k = Math.floor(r() * 3);
      b[k] = SIMBOL.find((s) => s !== a[k] && s !== b[k]) ?? "✚";
    }
    return { kiri: a.join(""), kanan: b.join(""), sama };
  });
}

/* ---------------- hasil & target usia ---------------- */

export interface HasilBerpikir {
  at: string;
  /** usia anak (tahun) saat tes, dipakai untuk target */
  usia: number;
  pola: { benar: number; total: number };
  memori: { span: number };
  spasial: { benar: number; total: number };
  kecepatan: { benar: number; salah: number };
}

/** Target usia perkiraan internal (bukan norma baku). */
const TARGET: Record<Aspek, (usia: number) => number> = {
  pola: (u) => Math.min(0.85, 0.25 + 0.08 * (u - 3)) * JUMLAH_POLA,
  memori: (u) => Math.min(6, 2 + 0.5 * (u - 3)),
  spasial: (u) => Math.min(0.85, 0.3 + 0.07 * (u - 3)) * JUMLAH_SPASIAL,
  kecepatan: (u) => Math.min(24, 4 + 2 * (u - 3)),
};

export function nilaiMentah(h: HasilBerpikir, a: Aspek): number {
  if (a === "pola") return h.pola.benar;
  if (a === "spasial") return h.spasial.benar;
  if (a === "memori") return h.memori.span;
  return Math.max(0, h.kecepatan.benar - h.kecepatan.salah);
}

export type Pita = "Perlu latihan" | "Sesuai usia" | "Menonjol";
export interface Indeks {
  aspek: Aspek;
  /** 100 = tepat target usia; dibatasi 0–150 */
  nilai: number;
  pita: Pita;
}

export function indeks(h: HasilBerpikir): Indeks[] {
  const usia = Math.min(12, Math.max(3, Math.round(h.usia)));
  return ASPEK.map((a) => {
    const target = TARGET[a](usia);
    const n = Math.max(0, Math.min(150, Math.round((100 * nilaiMentah(h, a)) / target)));
    return { aspek: a, nilai: n, pita: n >= 120 ? "Menonjol" : n >= 80 ? "Sesuai usia" : "Perlu latihan" };
  });
}

export function ringkasProfil(h: HasilBerpikir): { kuat: Aspek; latih: Aspek } {
  const xs = indeks(h).slice().sort((a, b) => b.nilai - a.nilai);
  return { kuat: xs[0].aspek, latih: xs[xs.length - 1].aspek };
}

export const KUNCI_BERPIKIR = (memberId: string) => `rumila-berpikir-${memberId}`;
