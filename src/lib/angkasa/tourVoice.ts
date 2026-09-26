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
  // Narasi lengkap (EduVoice_Materi_Playful (1).wav, 5:43) — titik mulai dari scripts/angkasa-cue-tur.py
  {
    src: "/angkasa/voice/tur-01.m4a",
    first: 0,
    cues: [
      0.0, 44.01, 68.75, 90.2, 118.01, 138.87, 163.18, 182.52, 204.17, 224.16,
      242.91, 262.04, 277.74, 296.86, 317.47,
    ],
    lineCues: [
      [0.0, 8.24, 18.08, 25.47, 38.41],
      [44.01, 51.44, 57.87],
      [68.75, 75.98, 82.52],
      [90.2, 97.52, 108.69],
      [118.01, 127.19, 131.95],
      [138.87, 144.73, 152.19],
      [163.18, 170.12, 178.68],
      [182.52, 191.74, 196.29],
      [204.17, 210.33, 216.55],
      [224.16, 228.63, 234.91],
      [242.91, 248.29, 257.01],
      [262.04, 267.53, 272.4],
      [277.74, 283.04, 289.17],
      [296.86, 305.93, 311.72],
      [317.47, 324.8, 332.77],
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
