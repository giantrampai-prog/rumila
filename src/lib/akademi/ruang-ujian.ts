// Cakupan kompetensi satu ujian (aplikasi & server): kuis = kompetensi satu modul, semester = kompetensi modul
// semester itu, kenaikan & penempatan = seluruh kompetensi jenjang (penempatan: kompetensi inti saja).

import type { Competency, LevelId } from "@akademi/schema";
import { TRACK_AKTIF } from "./katalog";
import { petaJenjang } from "./peta";
import type { JenisUjian } from "./ujian";

/** null = ruang tidak dikenal untuk jenjang itu. */
export function cakupanUjian(jenis: JenisUjian, level: LevelId, ruang: string, kompetensi: Competency[]): string[] | null {
  const peta = petaJenjang({}, new Set(), kompetensi, level, TRACK_AKTIF);
  const ids = (us: typeof peta.unit) => us.flatMap((u) => u.misi.map((m) => m.kompetensi.id));
  if (jenis === "kuis") {
    const u = peta.unit.find((x) => x.id === ruang);
    return u ? ids([u]) : null;
  }
  if (jenis === "semester") {
    const ke = ruang === "S1" ? 1 : ruang === "S2" ? 2 : 0;
    const sm = peta.semester[ke - 1];
    return sm && sm.total ? ids(sm.unit) : null;
  }
  if (ruang !== "") return null;
  if (jenis === "penempatan") return peta.unit.flatMap((u) => u.misi.filter((m) => m.kompetensi.core).map((m) => m.kompetensi.id));
  return ids(peta.unit);
}
