import type { GameEvent } from "@akademi/schema";

/**
 * Event "attempt" kesempatan kedua (setelah salah pertama, soal diulang sekali). Bukan bukti penguasaan,
 * bukan ronde baru, dan tidak masuk statistik soal: nilai selalu dari percobaan pertama.
 */
export function percobaanUlang(e: GameEvent): boolean {
  const d = (e.payload as { detail?: { percobaan?: unknown } } | undefined)?.detail;
  return typeof d?.percobaan === "number" && d.percobaan > 1;
}
