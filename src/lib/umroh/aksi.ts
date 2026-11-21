// Aksi interaktif tiap langkah bab persiapan & bandara: anak mengetuk tombol bergambar yang menyebut
// kegiatannya (bukan sekadar "Sudah"), lalu adegan 3D memperagakannya. Urutan = urutan `steps` bab.

import type { JourneyChapterId } from "./journey";

export type SuaraAksi = "pick" | "scan" | "beep" | "clunk" | "whoosh" | "sparkle" | "clink";

export interface AksiLangkah {
  /** teks tombol: kata kerja singkat */
  aksi: string;
  /** ikon Material Symbols */
  ikon: string;
  suara: SuaraAksi;
}

export const AKSI_LANGKAH: Partial<Record<JourneyChapterId, readonly AksiLangkah[]>> = {
  rumah: [
    { aksi: "Cek paspor", ikon: "badge", suara: "pick" },
    { aksi: "Periksa koper", ikon: "luggage", suara: "clunk" },
    { aksi: "Pamit & berdoa", ikon: "volunteer_activism", suara: "sparkle" },
  ],
  cgk: [
    { aksi: "Antre ke konter", ikon: "groups", suara: "pick" },
    { aksi: "Serahkan paspor", ikon: "badge", suara: "pick" },
    { aksi: "Taruh koper di timbangan", ikon: "luggage", suara: "clunk" },
    { aksi: "Ambil boarding pass", ikon: "confirmation_number", suara: "sparkle" },
  ],
  cgk_imigrasi: [
    { aksi: "Siapkan paspor", ikon: "badge", suara: "pick" },
    { aksi: "Masuk antrean", ikon: "groups", suara: "pick" },
    { aksi: "Pindai paspor", ikon: "qr_code_scanner", suara: "scan" },
    { aksi: "Lewati gerbang", ikon: "door_sliding", suara: "whoosh" },
  ],
  cgk_keamanan: [
    { aksi: "Taruh tas di nampan", ikon: "inventory_2", suara: "clunk" },
    { aksi: "Dorong ke X-ray", ikon: "scanner", suara: "scan" },
    { aksi: "Jalan lewat gerbang", ikon: "sensor_door", suara: "beep" },
    { aksi: "Ambil barangmu", ikon: "back_hand", suara: "clink" },
  ],
  cgk_gate: [
    { aksi: "Cek layar keberangkatan", ikon: "departure_board", suara: "pick" },
    { aksi: "Duduk di ruang tunggu", ikon: "event_seat", suara: "pick" },
    { aksi: "Dengarkan panggilan", ikon: "campaign", suara: "beep" },
  ],
};

/** Aksi langkah ke-`i` (0 = langkah pertama) sebuah bab, bila ada. */
export const aksiLangkah = (bab: JourneyChapterId, i: number): AksiLangkah | undefined => AKSI_LANGKAH[bab]?.[i];

/** Isi boarding pass contoh. Semua nilai ilustrasi untuk belajar, bukan tiket. */
export const TIKET_CONTOH = {
  maskapai: "Garuda Indonesia",
  penerbangan: "GA 980",
  dari: { kode: "CGK", kota: "Jakarta" },
  ke: { kode: "JED", kota: "Jeddah" },
  kelas: "Ekonomi",
  kursi: "32A",
  posisi: "jendela",
  gerbang: "7",
  kelompok: "3",
  boarding: "07.30",
  berangkat: "08.10",
} as const;
