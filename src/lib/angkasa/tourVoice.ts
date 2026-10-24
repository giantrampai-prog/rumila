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
    src: "/angkasa/voice/tur-andi.m4a",
    first: 0,
    cues: [0.00, 43.10, 72.38, 102.00, 138.22, 219.24, 255.52, 287.04, 310.76, 342.18, 371.33, 389.85, 408.45, 430.59, 450.47],
    lineCues: [
      [0.00, 6.50, 14.74, 22.34, 33.51],
      [43.10, 46.76, 55.46, 60.60, 67.68],
      [72.38, 77.22, 83.70, 91.84, 97.70],
      [102.00, 106.32, 117.06, 124.20, 131.82],
      [138.22, 143.52, 150.46, 157.00, 163.60, 172.72, 182.24, 190.10, 202.72, 207.68, 215.02],
      [219.24, 227.70, 234.82, 241.64, 250.74],
      [255.52, 261.48, 269.36, 274.54, 281.64],
      [287.04, 292.46, 299.14, 305.94],
      [310.76, 318.96, 323.28, 329.32, 338.46],
      [342.18, 346.52, 352.36, 358.71, 365.45],
      [371.33, 376.35, 382.75, 386.03],
      [389.85, 394.19, 400.47, 404.73],
      [408.45, 415.11, 420.55, 426.83],
      [430.59, 436.49, 441.93, 445.35],
      [450.47, 456.49, 463.55],
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
