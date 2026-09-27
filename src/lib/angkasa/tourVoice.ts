// Narasi rekaman Tur terbang. Naskah: docs/angkasa/naskah-tur-terbang.txt.
// Rekaman boleh dipecah jadi beberapa file (aplikasi suara sering membatasi panjang teks): tiap bagian
// mencakup persinggahan berurutan mulai dari `first`. Audio menjadi jam utama untuk persinggahan yang dicakup;
// persinggahan tanpa rekaman memakai waktu baca teks.
// Tambah bagian: python3 scripts/angkasa-cue-tur.py <audio> --first <nomor persinggahan pertama, mulai 1>

export interface TourAudioPart {
  src: string;
  /** indeks persinggahan pertama yang dicakup (0 = Briefing misi) */
  first: number;
  /** detik mulai tiap persinggahan yang dicakup, relatif ke file ini */
  cues: number[];
  /** opsional: detik mulai tiap kalimat, per persinggahan yang dicakup */
  lineCues?: number[][];
}

export const TOUR_AUDIO: TourAudioPart[] = [
  // Narasi lengkap Rinoya (suara Fenrir, 5:12) — batas kalimat diselaraskan ke jeda hening asli rekaman
  {
    src: "/angkasa/voice/tur-02.m4a",
    first: 0,
    cues: [0, 41.59, 64.37, 82.42, 106.69, 125.99, 148.87, 166.02, 186.06, 204.6, 220.54, 237.06, 250.55, 267.25, 286.76],
    lineCues: [
      [0, 7.24, 17.16, 23.97, 36.12],
      [41.59, 45.98, 54.75],
      [64.37, 70.03, 76.22],
      [82.42, 88.49, 99.92],
      [106.69, 113.29, 117.81],
      [125.99, 131.22, 139.46],
      [148.87, 154.12, 162.44],
      [166.02, 174.16, 178.95],
      [186.06, 191.1, 197.14],
      [204.6, 207.72, 213.23],
      [220.54, 225.25, 233.55],
      [237.06, 241.33, 246.06],
      [250.55, 253.86, 260.68],
      [267.25, 275.47, 281.36],
      [286.76, 292.86, 301.27],
    ],
  },
];

/** Bagian rekaman yang mencakup persinggahan i (kecuali yang gagal dimuat). */
export function partFor(i: number, failed?: Set<string>) {
  return (
    TOUR_AUDIO.find(
      (p) => i >= p.first && i < p.first + p.cues.length && !failed?.has(p.src),
    ) ?? null
  );
}

/** Posisi pada daftar waktu mulai (cue terakhir yang sudah lewat). */
export function stopAt(cues: number[], t: number) {
  let i = 0;
  while (i + 1 < cues.length && t >= cues[i + 1]) i++;
  return i;
}

/** Kalimat ke berapa pada posisi `frac` (0–1) dalam satu persinggahan: dibagi sebanding panjang kalimat. */
export function lineAtFraction(lines: string[], frac: number) {
  const total = lines.reduce((a, l) => a + l.length, 0) || 1;
  let acc = 0;
  for (let i = 0; i < lines.length; i++) {
    acc += lines[i].length / total;
    if (frac < acc) return i;
  }
  return lines.length - 1;
}

/** Kalimat aktif persinggahan ke-k dalam bagian `part` pada detik t. */
export function lineAtTime(
  part: TourAudioPart,
  lines: string[],
  k: number,
  t: number,
  duration: number,
) {
  const exact = part.lineCues?.[k];
  if (exact?.length === lines.length) return stopAt(exact, t);
  const start = part.cues[k];
  const end = part.cues[k + 1] ?? duration;
  return lineAtFraction(lines, (t - start) / Math.max(0.1, end - start));
}
