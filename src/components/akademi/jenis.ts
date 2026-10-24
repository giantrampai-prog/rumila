// Kontrak presenter mekanik Academy (lihat docs/akademi/slice-1-kontrak.md §4).
// Presenter hanya menampilkan ronde dan mengirim jawaban; penilaian dan pencatatan bukti dilakukan runner.

import type { ContentPack } from "@akademi/schema";
import type { Hasil } from "@akademi/mechanics";

export interface PresenterProps<R, J, P extends ContentPack = ContentPack> {
  paket: P;
  ronde: R;
  /** teks dwibahasa: t(key) → locale.id[key] */
  t: (key: string) => string;
  /** kirim jawaban; sekali per ronde */
  onJawab: (j: J) => void;
  /** anak minta bantuan (dicatat sebagai event hint) */
  onHint?: () => void;
  /** null = belum dijawab; terisi = tampilkan umpan balik benar/salah (runner lanjut sendiri ±1,4 dtk kemudian) */
  hasil: Hasil | null;
}

export const BALOO = "var(--ff-baloo), system-ui, sans-serif";
export const NUNITO = "var(--ff-nunito), system-ui, sans-serif";
export const INK = "#0b2545";

/** Warna umpan balik */
export const BENAR = "#22b573";
export const SALAH = "#ff5a6e";
