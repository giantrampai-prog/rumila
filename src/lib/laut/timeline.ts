import { TUR_LAUT } from './misi';
import { SEA_RECORDING, SEA_TRACKS } from './narration';

export { SEA_RECORDING };
export function chapterAtTime(seconds: number) {
  return Math.max(0, TUR_LAUT.findLastIndex(s => seconds >= SEA_TRACKS[s.id].start!));
}

export interface SeaShot { at: number; target: string; distance: number; elevation?: number }
/** Absolute seconds from timestamp-dongeng.txt. Targets are registered objects in the actual scene. */
export const SEA_SHOTS: Record<string, SeaShot[]> = {
  'persiapan': [], 'masuk-laut': [],
  'terumbu-karang': [
    { at: 91, target: 'ikan-badut', distance: 2.8 },
    { at: 97, target: 'blue-tang', distance: 3.2 },
    { at: 101, target: 'penyu-hijau', distance: 6.5 },
  ],
  'padang-lamun': [{ at: 122, target: 'kuda-laut', distance: 3.2, elevation: 3 }, { at: 133, target: 'pari', distance: 5, elevation: 4 }],
  'batas-aman': [],
  'dinding-karang': [{ at: 183, target: 'barakuda', distance: 12 }, { at: 186, target: 'hiu-karang', distance: 9 }],
  'laut-biru': [{ at: 207, target: 'manta', distance: 8 }, { at: 215, target: 'tuna', distance: 14 }, { at: 222, target: 'ubur-biru', distance: 3 }],
  'makin-redup': [{ at: 249, target: 'cumi-cumi', distance: 5 }],
  'zona-senja': [{ at: 277, target: 'ikan-lentera', distance: 13 }],
  'bioluminesensi': [{ at: 312, target: 'ikan-pemancing', distance: 5 }, { at: 324, target: 'hewan-sisir', distance: 3.3 }],
  'ventilasi': [{ at: 346, target: 'cerobong', distance: 11 }, { at: 375, target: 'cacing-tabung', distance: 6 }],
  'dataran-abisal': [{ at: 414, target: 'ikan-tripod', distance: 4 }, { at: 417, target: 'teripang', distance: 4 }],
  'palung-laut': [],
  'biota-palung': [{ at: 457, target: 'ikan-siput-hadal', distance: 4.5 }, { at: 488, target: 'amfipoda', distance: 3.5 }],
  'challenger-deep': [], 'misi-selesai': [], 'ringkasan': [],
};
export function shotAtTime(stopId: string, time: number) {
  return SEA_SHOTS[stopId]?.findLast(s => time >= s.at) ?? null;
}

/** Chapter 2 starts at 00:39; the supplied recording says “byur” at 00:44. */
export function diveAtTime(seconds: number) {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const smooth = (v: number) => { const k=clamp(v); return k*k*(3-2*k); };
  return { walk: smooth(seconds/3), jump: clamp((seconds-3)/2), sink: smooth((seconds-5)/7), standing: seconds < 5 };
}

export function subLightAtTime(stopId: string, time: number) {
  // “Kita nyalakan lampu kapal” begins at 04:14, rather than lighting it at chapter entry.
  return stopId === 'makin-redup' ? Math.max(0, Math.min(1, time-254)) : 1;
}
