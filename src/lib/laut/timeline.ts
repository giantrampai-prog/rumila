import { TUR_LAUT } from './misi';
import { SEA_RECORDING, SEA_TRACKS } from './narration';

export { SEA_RECORDING };
export function chapterAtTime(seconds: number) {
  return Math.max(0, TUR_LAUT.findLastIndex(s => seconds >= SEA_TRACKS[s.id].start!));
}

export interface SeaShot { at: number; target: string; distance: number; elevation?: number }
/** Absolute seconds in the Andi recording (laut-andi), from ElevenLabs Scribe word timestamps. Targets are registered objects in the actual scene. */
export const SEA_SHOTS: Record<string, SeaShot[]> = {
  'persiapan': [], 'masuk-laut': [],
  'terumbu-karang': [
    { at: 90.69, target: 'ikan-badut', distance: 2.8 },
    { at: 95.01, target: 'blue-tang', distance: 3.2 },
    { at: 99.43, target: 'penyu-hijau', distance: 6.5 },
  ],
  'padang-lamun': [{ at: 118.01, target: 'kuda-laut', distance: 3.2, elevation: 3 }, { at: 130.93, target: 'pari', distance: 5, elevation: 4 }],
  'batas-aman': [],
  'dinding-karang': [{ at: 180.89, target: 'barakuda', distance: 12 }, { at: 184.71, target: 'hiu-karang', distance: 9 }],
  'laut-biru': [{ at: 206.59, target: 'manta', distance: 8 }, { at: 216.51, target: 'tuna', distance: 14 }, { at: 222.69, target: 'ubur-biru', distance: 3 }],
  'makin-redup': [{ at: 255.59, target: 'cumi-cumi', distance: 5 }],
  'zona-senja': [{ at: 278.01, target: 'ikan-lentera', distance: 13 }],
  'bioluminesensi': [{ at: 314.57, target: 'ikan-pemancing', distance: 5 }, { at: 328.03, target: 'hewan-sisir', distance: 3.3 }],
  'ventilasi': [{ at: 349.58, target: 'cerobong', distance: 11 }, { at: 381.03, target: 'cacing-tabung', distance: 6 }],
  'dataran-abisal': [{ at: 420.63, target: 'ikan-tripod', distance: 4 }, { at: 423.33, target: 'teripang', distance: 4 }],
  'palung-laut': [],
  'biota-palung': [{ at: 460.55, target: 'ikan-siput-hadal', distance: 4.5 }, { at: 489.27, target: 'amfipoda', distance: 3.5 }],
  'challenger-deep': [], 'misi-selesai': [], 'ringkasan': [],
};
export function shotAtTime(stopId: string, time: number) {
  return SEA_SHOTS[stopId]?.findLast(s => time >= s.at) ?? null;
}

/** Chapter-relative second of “byur” in masuk-laut, and the “Lihat ke atas” paragraph window. */
export const DIVE_AT = 5.48;
export const LOOK_UP: [number, number] = [12.46, 21.12];

export function diveAtTime(seconds: number) {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const smooth = (v: number) => { const k=clamp(v); return k*k*(3-2*k); };
  return { walk: smooth(seconds/(DIVE_AT-2)), jump: clamp((seconds-(DIVE_AT-2))/2), sink: smooth((seconds-DIVE_AT)/7), standing: seconds < DIVE_AT };
}

export function subLightAtTime(stopId: string, time: number) {
  // “Kita nyalakan lampu kapal” in the Andi recording, rather than lighting it at chapter entry.
  return stopId === 'makin-redup' ? Math.max(0, Math.min(1, time-251.5)) : 1;
}
