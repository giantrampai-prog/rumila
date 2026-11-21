// Film 3D "Berangkat": rumah → bandara → pesawat → Jeddah, diputar di mesin 3D yang sama dengan modul.
// Setiap adegan memakai bab perjalanan yang sudah ada; teks bawah di sini sekaligus naskah VO (menyusul).
// Fungsi murni supaya garis waktu, lompat, dan teks bisa diuji tanpa WebGL.

import type { JourneyChapterId } from "./journey";

export interface AdeganFilm {
  bab: JourneyChapterId;
  /** lama adegan (detik film). Adegan perjalanan sama dengan durasi bab perjalanannya. */
  detik: number;
  /** Teks bawah. Untuk adegan perjalanan: beberapa baris, masing-masing tampil mulai `pada` (0–1). */
  teks: { pada: number; isi: string }[];
  /** jumlah langkah bab yang sudah selesai selama adegan (menggerakkan koper, autogate, X-ray, layar gerbang) */
  langkah?: number;
  /** sudut kamera: titik landmark adegan, atau stasiun bab bila kosong */
  landmark?: string;
  /** gerak kamera pelan selama adegan */
  gerak?: "maju" | "geser" | "naik";
  /** adegan perjalanan: kamera otomatis bawaan (kursi kendaraan, garbarata, penerbangan) */
  perjalanan?: boolean;
}

const satu = (isi: string) => [{ pada: 0, isi }];

export const FILM_BERANGKAT: readonly AdeganFilm[] = [
  { bab: "rumah", detik: 6, langkah: 0, landmark: "home-porch", gerak: "maju", teks: satu("Perjalanan umroh kita dimulai dari rumah, di Indonesia.") },
  { bab: "rumah", detik: 6, langkah: 1, landmark: "home-luggage", gerak: "geser", teks: satu("Paspor dan dokumen perjalanan diperiksa bersama keluarga.") },
  { bab: "rumah", detik: 5, langkah: 2, landmark: "home-luggage", gerak: "maju", teks: satu("Koper sudah siap. Pamit dan berdoa sebelum berangkat.") },
  { bab: "rumah", detik: 5, langkah: 3, landmark: "home-taxi", gerak: "naik", teks: satu("Taksi sudah datang. Saatnya berangkat ke bandara!") },
  { bab: "taxi_cgk", detik: 14, perjalanan: true, teks: [
    { pada: 0, isi: "Taksi melaju menuju Bandara Soekarno–Hatta." },
    { pada: 0.5, isi: "Dokumen disimpan di tas kecil supaya mudah diambil." },
  ] },
  { bab: "cgk", detik: 6, langkah: 1, gerak: "maju", teks: satu("Di terminal keberangkatan, kita antre di konter check-in.") },
  { bab: "cgk", detik: 6, langkah: 2, gerak: "geser", teks: satu("Paspor diserahkan kepada petugas maskapai.") },
  { bab: "cgk", detik: 6, langkah: 3, gerak: "maju", teks: satu("Koper ditimbang, diberi label JED, lalu masuk sabuk bagasi.") },
  { bab: "cgk", detik: 6, langkah: 4, gerak: "naik", teks: satu("Kita menerima boarding pass. Cek nama, tujuan, dan kursi.") },
  { bab: "cgk_imigrasi", detik: 6, langkah: 1, gerak: "maju", teks: satu("Di imigrasi, siapkan paspor dan boarding pass.") },
  { bab: "cgk_imigrasi", detik: 6, langkah: 2, gerak: "geser", teks: satu("Antre dengan tertib di jalur imigrasi.") },
  { bab: "cgk_imigrasi", detik: 6, langkah: 3, gerak: "maju", teks: satu("Paspor dipindai, lalu tatap kamera.") },
  { bab: "cgk_imigrasi", detik: 6, langkah: 4, gerak: "naik", teks: satu("Paspor dikembalikan, gerbang pun terbuka.") },
  { bab: "cgk_keamanan", detik: 6, langkah: 1, gerak: "maju", teks: satu("Tas, jaket, dan barang logam ditaruh di nampan.") },
  { bab: "cgk_keamanan", detik: 6, langkah: 2, gerak: "geser", teks: satu("Nampan masuk mesin X-ray untuk diperiksa.") },
  { bab: "cgk_keamanan", detik: 6, langkah: 3, gerak: "maju", teks: satu("Kita berjalan melewati gerbang pemeriksaan.") },
  { bab: "cgk_keamanan", detik: 6, langkah: 4, gerak: "naik", teks: satu("Ambil kembali semua barang dari nampan.") },
  { bab: "cgk_gate", detik: 6, langkah: 1, gerak: "maju", teks: satu("Cocokkan nomor gerbang di layar keberangkatan.") },
  { bab: "cgk_gate", detik: 6, langkah: 2, gerak: "geser", teks: satu("Duduk tenang di ruang tunggu dekat gerbang.") },
  { bab: "cgk_gate", detik: 6, langkah: 3, gerak: "maju", teks: satu("Panggilan boarding! Siapkan boarding pass dan paspor.") },
  { bab: "cgk_boarding", detik: 20, perjalanan: true, teks: [
    { pada: 0, isi: "Boarding pass dipindai di gerbang." },
    { pada: 0.25, isi: "Kita berjalan melewati garbarata." },
    { pada: 0.5, isi: "Awak kabin menyambut di pintu pesawat." },
    { pada: 0.72, isi: "Duduk di kursi 32A, lalu pasang sabuk pengaman." },
  ] },
  { bab: "garuda_jed", detik: 48, perjalanan: true, teks: [
    { pada: 0, isi: "Awak kabin memperagakan petunjuk keselamatan." },
    { pada: 0.14, isi: "Pesawat meluncur ke landasan, lalu lepas landas!" },
    { pada: 0.3, isi: "Kita menembus awan. Lampu sabuk masih menyala." },
    { pada: 0.45, isi: "Terbang jelajah sekitar sembilan jam menuju Arab Saudi." },
    { pada: 0.74, isi: "Pesawat mulai turun. Roda dikeluarkan." },
    { pada: 0.9, isi: "Alhamdulillah, kita mendarat di Jeddah." },
  ] },
  { bab: "jeddah", detik: 7, gerak: "maju", teks: satu("Selamat datang di Bandara King Abdulaziz, Jeddah. Perjalanan berlanjut ke Madinah!") },
];

/** Bab yang dilalui film (berurutan, tanpa duplikat). */
export const BAB_FILM: readonly JourneyChapterId[] = FILM_BERANGKAT.map((a) => a.bab).filter((b, i, xs) => xs.indexOf(b) === i);

export const durasiFilm = (film: readonly AdeganFilm[] = FILM_BERANGKAT) => film.reduce((s, a) => s + a.detik, 0);

/** Waktu mulai tiap adegan (detik film). */
export const mulaiAdegan = (film: readonly AdeganFilm[] = FILM_BERANGKAT) => film.reduce<number[]>((acc, a, i) => [...acc, i ? acc[i - 1] + film[i - 1].detik : 0], []);

/** Adegan & detik di dalamnya untuk waktu film `t`. Waktu di luar batas dipotong. */
export function posisiFilm(t: number, film: readonly AdeganFilm[] = FILM_BERANGKAT): { i: number; dalam: number } {
  const total = durasiFilm(film);
  const w = Math.max(0, Math.min(Number.isFinite(t) ? t : 0, total));
  let awal = 0;
  for (let i = 0; i < film.length; i++) {
    if (w < awal + film[i].detik || i === film.length - 1) return { i, dalam: Math.min(w - awal, film[i].detik) };
    awal += film[i].detik;
  }
  return { i: 0, dalam: 0 };
}

/** Teks bawah yang tampil pada detik `dalam` sebuah adegan. */
export function teksAdegan(a: AdeganFilm, dalam: number): string {
  const f = a.detik ? dalam / a.detik : 0;
  let isi = a.teks[0]?.isi ?? "";
  for (const baris of a.teks) if (f >= baris.pada) isi = baris.isi;
  return isi;
}

/** Penanda tahap di garis waktu: awal tiap bab, dengan nama singkat. */
export const PENANDA_FILM: Partial<Record<JourneyChapterId, string>> = {
  rumah: "Rumah", taxi_cgk: "Taksi", cgk: "Check-in", cgk_imigrasi: "Imigrasi", cgk_keamanan: "Keamanan",
  cgk_gate: "Gerbang", cgk_boarding: "Boarding", garuda_jed: "Terbang", jeddah: "Jeddah",
};

export function penandaFilm(film: readonly AdeganFilm[] = FILM_BERANGKAT): { bab: JourneyChapterId; nama: string; mulai: number }[] {
  const awal = mulaiAdegan(film);
  return film.flatMap((a, i) => (i === 0 || film[i - 1].bab !== a.bab ? [{ bab: a.bab, nama: PENANDA_FILM[a.bab] ?? a.bab, mulai: awal[i] }] : []));
}

export const formatWaktuFilm = (detik: number) => {
  const s = Math.max(0, Math.round(detik));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
