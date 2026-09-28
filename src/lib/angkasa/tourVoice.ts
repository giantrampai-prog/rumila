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
  // Narasi v3 suara Agam (Algenib, 8:00; docs/angkasa/naskah-tur-terbang-v3.txt) — batas persinggahan & kalimat
  // diselaraskan ke jeda hening asli rekaman (scripts/angkasa-cue-tur.py), dicek terhadap timestamp per kata.
  {
    src: "/angkasa/voice/tur-03.m4a",
    first: 0,
    cues: [0.0, 46.54, 78.61, 106.66, 143.25, 228.91, 264.85, 297.91, 321.89, 355.39, 384.08, 401.07, 418.45, 441.29, 460.32],
    lineCues: [
      [0.0, 7.26, 16.54, 24.8, 36.43],
      [46.54, 50.8, 60.12, 65.39, 73.26],
      [78.61, 83.33, 89.83, 97.78, 102.8],
      [106.66, 110.66, 120.92, 127.27, 134.93],
      [143.25, 147.51, 154.64, 161.22, 168.11, 178.81, 189.44, 197.96, 210.93, 216.93, 224.36],
      [228.91, 236.34, 243.09, 249.84, 259.62],
      [264.85, 270.61, 279.07, 284.89, 293.07],
      [297.91, 303.55, 310.35, 317.08],
      [321.89, 328.84, 334.61, 341.13, 351.59],
      [355.39, 359.64, 365.66, 372.5, 379.2],
      [384.08, 388.26, 394.22, 397.43],
      [401.07, 404.51, 409.89, 414.33],
      [418.45, 425.04, 430.57, 437.16],
      [441.29, 446.92, 452.05, 455.24],
      [460.32, 465.55, 472.55],
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
