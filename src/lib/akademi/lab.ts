// Laboratorium 3D (Sekolah Tahap 5): dunia Petualangan 3D terbuka sesuai modul Sains yang sudah dituntaskan.
// Fungsi murni. Dunia terbuka bila salah satu:
//   - modul syaratnya tuntas (semua misi selesai) atau Kuis Modulnya lulus,
//   - jenjang anak sudah di atas jenjang modul syarat (mis. ditempatkan lewat Tes Penempatan),
//   - anak pernah membuka dunia itu sebelumnya (tidak mengambil yang sudah dinikmati),
//   - dunia tanpa syarat (Umroh Virtual: pelajaran Karakter & Agama belum berisi).

import { levelIndex, levelMeta, type Competency, type LevelId } from "@akademi/schema";
import { sudahLulus, type HasilUjian } from "./ujian";

export interface SyaratLab {
  level: LevelId;
  unit: string;
}

/** id alat Petualangan 3D → modul Sains yang membukanya */
export const SYARAT_LAB: Record<string, SyaratLab> = {
  edukasi6: { level: "PAUD", unit: "TUBUH-PANCAINDRA" },
  "edukasi-buah": { level: "TKA", unit: "BAGIAN-TUMBUHAN" },
  "petualangan-laut": { level: "TKA", unit: "HEWAN-DARAT-AIR-UDARA" },
  angkasa6: { level: "TKB", unit: "MATAHARI-BUMI-BULAN" },
  angkasa3: { level: "SD1", unit: "GAYA" },
  "petualangan-bumi": { level: "SD2", unit: "BATUAN" },
};

export interface KeadaanLab {
  terbuka: boolean;
  /** teks syarat untuk dunia yang masih terkunci, mis. "Sains · TK A · Bagian tumbuhan" */
  syarat?: string;
}

export function keadaanLab(
  toolId: string,
  o: { level: LevelId; selesai: Set<string>; ujian: HasilUjian[]; pernah: boolean; kompetensi: Competency[] },
): KeadaanLab {
  const s = SYARAT_LAB[toolId];
  if (!s || o.pernah) return { terbuka: true };
  if (levelIndex(o.level) > levelIndex(s.level)) return { terbuka: true };
  const isi = o.kompetensi.filter((c) => c.track === "SAINS" && c.level === s.level && c.unit.id === s.unit);
  if (!isi.length) return { terbuka: true };
  const tuntas = isi.every((c) => o.selesai.has(c.id)) || sudahLulus(o.ujian, "kuis", s.level, s.unit);
  return tuntas ? { terbuka: true } : { terbuka: false, syarat: `Sains · ${levelMeta(s.level).lokal} · ${isi[0].unit.nama.id}` };
}
