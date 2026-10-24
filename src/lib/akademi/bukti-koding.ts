// Bukti kompetensi dari game Coding Agam (Langkah, Ulangi, Kalau…) ke RINOYA Academy.
// - kompetensiLevel(): pemetaan posisi level → id kompetensi di content/kurikulum/KODE-*.json.
// - catatMenangKoding()/catatGagalKoding(): satu event "attempt" tiap kali tombol Jalankan berakhir (menang / gagal).
// - imporProgresKoding(): sekali per anak, bintang lama di localStorage (`rumila-koding-<id>`, `rumila-koding-ulangi-<id>`,
//   `rumila-koding-kalau-<id>`) menjadi event attempt `imported: true` supaya anak tidak mulai dari nol.
// Tidak menyentuh tampilan game. Anggota demo (id bukan UUID) tidak dicatat.

import { catatEvent } from "@/lib/akademi/jejak";
import { KALAU } from "@/lib/koding/kalau";
import { LANGKAH } from "@/lib/koding/langkah";
import { ULANGI } from "@/lib/koding/ulangi";
import { uuid } from "@/lib/uuid";

export type GameKoding = "langkah" | "ulangi" | "kalau";

const MECHANIC = "navigasi";
const PENANDA_IMPOR = (learnerId: string) => `rumila-akademi-impor-koding-${learnerId}`;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** satu sesi per muat halaman: semua event koding di tab ini memakai sessionId yang sama */
let sesi: string | null = null;
const sessionId = () => (sesi ??= uuid());

export const adalahUuid = (id: string) => UUID_RE.test(id);

/** kunci localStorage progres lama tiap game (bentuk `Progress {stars: {levelId: n}}` dari components/koding/shared.tsx) */
export const kunciProgres = (game: GameKoding, learnerId: string) => (game === "langkah" ? `rumila-koding-${learnerId}` : `rumila-koding-${game}-${learnerId}`);

/** daftar level tiap game, urutan = index yang dipakai pemetaan kompetensi */
export const daftarLevel = (game: GameKoding): { id: string }[] => (game === "langkah" ? LANGKAH : game === "ulangi" ? ULANGI : KALAU);

/**
 * Kompetensi yang dibuktikan satu level. `index` = posisi level di daftar gamenya (0..99).
 * Langkah: 0–9 hanya maju; 10–19 maju + satu belok; 20–49 grid lebih besar, kiri+kanan; ≥50 program panjang.
 */
export function kompetensiLevel(game: GameKoding, _levelId: string, index: number): string[] {
  if (game === "langkah") {
    if (index < 10) return ["KODE.PAUD.PERINTAH.01", "KODE.TKA.NAVIGASI.01"];
    if (index < 20) return ["KODE.TKA.NAVIGASI.02", "KODE.TKA.NAVIGASI.03"];
    if (index < 50) return ["KODE.TKA.NAVIGASI.03", "KODE.TKB.PROGRAM-5-8.01"];
    return ["KODE.TKB.PROGRAM-5-8.01"];
  }
  if (game === "ulangi") {
    const ids = ["KODE.TKB.ULANGI.01", "KODE.TKB.ULANGI.02"];
    if (index >= 30) ids.push("KODE.TKB.ULANGI.03");
    return ids;
  }
  return ["KODE.TKB.KONDISI.01"];
}

export interface PercobaanKoding {
  learnerId: string;
  game: GameKoding;
  levelId: string;
  index: number;
  /** bintang yang didapat (0 bila gagal) */
  stars: number;
  /** jumlah blok program saat dijalankan */
  blocks: number;
  /** pernah menekan Bantuan di level ini */
  hintUsed: boolean;
  /** waktu sejak level dibuka */
  latencyMs: number;
}

function catatPercobaan(o: PercobaanKoding, correct: boolean) {
  if (!adalahUuid(o.learnerId)) return;
  catatEvent({
    learnerId: o.learnerId,
    sessionId: sessionId(),
    activityId: `koding-${o.game}`,
    mechanic: MECHANIC,
    type: "attempt",
    payload: {
      itemId: o.levelId,
      correct,
      hintUsed: o.hintUsed,
      latencyMs: Math.max(0, Math.round(o.latencyMs)),
      competencyIds: kompetensiLevel(o.game, o.levelId, o.index),
      detail: { stars: o.stars, blocks: o.blocks, levelId: o.levelId },
    },
  });
}

/** Level dimenangkan (tempat withStars dipanggil). */
export function catatMenangKoding(o: PercobaanKoding) {
  catatPercobaan(o, true);
}

/** Jalankan berakhir gagal: menabrak, meleset, macet, atau program habis sebelum sampai. */
export function catatGagalKoding(o: Omit<PercobaanKoding, "stars"> & { stars?: number }) {
  catatPercobaan({ ...o, stars: o.stars ?? 0 }, false);
}

const GAMES: GameKoding[] = ["langkah", "ulangi", "kalau"];

function bacaBintang(key: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(key);
    const p = raw ? JSON.parse(raw) : null;
    const stars = p?.stars;
    return stars && typeof stars === "object" ? (stars as Record<string, number>) : {};
  } catch {
    return {};
  }
}

/**
 * Impor progres lama sekali per anak: tiap level dengan bintang ≥1 jadi satu event attempt `imported: true`.
 * Mengembalikan jumlah event yang dicatat (0 bila sudah pernah / bukan UUID / tidak ada window).
 */
export function imporProgresKoding(learnerId: string): number {
  if (typeof window === "undefined" || !adalahUuid(learnerId)) return 0;
  const penanda = PENANDA_IMPOR(learnerId);
  try {
    if (localStorage.getItem(penanda)) return 0;
  } catch {
    return 0;
  }
  let n = 0;
  const sid = sessionId();
  for (const game of GAMES) {
    const stars = bacaBintang(kunciProgres(game, learnerId));
    const daftar = daftarLevel(game);
    daftar.forEach((l, index) => {
      const st = stars[l.id] ?? 0;
      if (!(st >= 1)) return;
      catatEvent({
        learnerId,
        sessionId: sid,
        activityId: "import",
        mechanic: MECHANIC,
        type: "attempt",
        payload: {
          itemId: l.id,
          correct: true,
          hintUsed: false,
          latencyMs: 0,
          competencyIds: kompetensiLevel(game, l.id, index),
          detail: { stars: st, levelId: l.id, game },
          imported: true,
        },
      });
      n++;
    });
  }
  try {
    localStorage.setItem(penanda, new Date().toISOString());
  } catch {}
  return n;
}
