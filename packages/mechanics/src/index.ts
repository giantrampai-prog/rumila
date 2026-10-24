// Pintu masuk @akademi/mechanics: re-export tiap mekanik + buatRonde/nilai yang memilih lewat mechanic.

import type { ContentPack } from "@akademi/schema";
import { buatRondeDagang, nilaiDagang } from "./dagang";
import { buatRondeNavigasi, nilaiNavigasi } from "./navigasi";
import { buatRondePilah, nilaiPilah } from "./pilah";
import { buatRondePola, nilaiPola } from "./pola";
import { buatRondeSimulasi, nilaiSimulasi } from "./simulasi";
import type {
  Hasil, JawabanDagang, JawabanNavigasi, JawabanPilah, JawabanPola, JawabanSimulasi, JawabanUrutkan, Knobs,
  RondeDagang, RondeNavigasi, RondePilah, RondePola, RondeSimulasi, RondeUrutkan,
} from "./types";
import { buatRondeUrutkan, nilaiUrutkan } from "./urutkan";

export * from "./types";
export * from "./rng";
export * from "./pilah";
export * from "./urutkan";
export * from "./dagang";
export * from "./navigasi";
export * from "./pola";
export * from "./simulasi";
export { knobDefaults } from "./rng";

/** Ronde terbungkus diskriminator `mechanic`, supaya runner bisa memilih presenter dan fungsi nilai. */
export type Ronde =
  | { mechanic: "pilah"; ronde: RondePilah }
  | { mechanic: "urutkan"; ronde: RondeUrutkan }
  | { mechanic: "dagang"; ronde: RondeDagang }
  | { mechanic: "navigasi"; ronde: RondeNavigasi }
  | { mechanic: "pola"; ronde: RondePola }
  | { mechanic: "simulasi"; ronde: RondeSimulasi };
export type Jawaban = JawabanPilah | JawabanUrutkan | JawabanDagang | JawabanNavigasi | JawabanPola | JawabanSimulasi;

export function buatRonde(p: ContentPack, knobs: Knobs, seed: number): Ronde {
  switch (p.mechanic) {
    case "pilah": return { mechanic: "pilah", ronde: buatRondePilah(p, knobs, seed) };
    case "urutkan": return { mechanic: "urutkan", ronde: buatRondeUrutkan(p, knobs, seed) };
    case "dagang": return { mechanic: "dagang", ronde: buatRondeDagang(p, knobs, seed) };
    case "navigasi": return { mechanic: "navigasi", ronde: buatRondeNavigasi(p, knobs, seed) };
    case "pola": return { mechanic: "pola", ronde: buatRondePola(p, knobs, seed) };
    case "simulasi": return { mechanic: "simulasi", ronde: buatRondeSimulasi(p, knobs, seed) };
  }
}

export function nilai(_p: ContentPack, r: Ronde, j: Jawaban): Hasil {
  switch (r.mechanic) {
    case "pilah": return nilaiPilah(r.ronde, j as JawabanPilah);
    case "urutkan": return nilaiUrutkan(r.ronde, j as JawabanUrutkan);
    case "dagang": return nilaiDagang(r.ronde, j as JawabanDagang);
    case "navigasi": return nilaiNavigasi(r.ronde, j as JawabanNavigasi);
    case "pola": return nilaiPola(r.ronde, j as JawabanPola);
    case "simulasi": return nilaiSimulasi(r.ronde, j as JawabanSimulasi);
  }
}
