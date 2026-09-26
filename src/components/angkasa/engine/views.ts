// Kontrak view per mode. Setiap view mengimplementasikan View (core.ts) + apply(state) yang dipanggil
// setiap kali state UI berubah. View tidak boleh mengubah data ilmiah; hanya membaca manifest & state.

import type { AngkasaState } from "@/lib/angkasa/state";
import type { View } from "./core";

export interface ModeView extends View {
  /** sinkronkan scene dengan state UI (dipanggil saat state berubah & sekali setelah start) */
  apply(state: AngkasaState): void;
  /** keterangan skala/waktu yang WAJIB tampil untuk transform yang dipakai view ini */
  scaleNote(state: AngkasaState): string;
}
