// Tata letak Kebun Buah (mode jelajah): alun-alun di tengah, jalan salib membagi kebun menjadi 4 petak.
// Barat laut: buah sehari-hari · timur laut: buah Nusantara · barat daya: buah di toko buah ·
// tenggara: rumah kebun, kolam, dan kincir angin. Buah di tiap petak berjajar mulai dari dekat alun-alun.

import { FRUITS, type Fruit, type FruitGroup } from './catalog';

/** Jenis tanaman menentukan bentuk 3D-nya (pohon, palem, tanaman merambat, dll.). */
export type PlantKind = 'tree' | 'palm' | 'spiky' | 'banana' | 'vine' | 'pineapple' | 'bush' | 'trellis' | 'papaya' | 'cactus' | 'trunk' | 'shrub';

const BY_ID: Record<string, PlantKind> = {
  markisa: 'trellis',
  'terong-belanda': 'shrub',
  cermai: 'shrub',
  'jeruk-nipis': 'shrub',
  lemon: 'shrub',
};
const BY_SHAPE: Partial<Record<Fruit['shape'], PlantKind>> = {
  banana: 'banana',
  coconut: 'palm',
  date: 'palm',
  salak: 'spiky',
  watermelon: 'vine',
  melon: 'vine',
  pineapple: 'pineapple',
  strawberry: 'bush',
  grapes: 'trellis',
  kiwi: 'trellis',
  papaya: 'papaya',
  dragonfruit: 'cactus',
  jackfruit: 'trunk',
};

export const plantKind = (f: Fruit): PlantKind => BY_ID[f.id] ?? BY_SHAPE[f.shape] ?? 'tree';

/** Jarak antartanaman dan batas kebun (satuan dunia ≈ meter). */
export const GARDEN = { half: 44, plaza: 7.5, step: 7.5, first: 7.5, path: 2.2 } as const;

/** Arah petak per kelompok: [tanda x, tanda z] (z negatif = jauh dari kamera). */
export const ZONE_DIR: Record<FruitGroup, [number, number]> = {
  sehari: [-1, -1],
  nusantara: [1, -1],
  toko: [-1, 1],
};

export const ZONE_NAME: Record<FruitGroup, string> = {
  sehari: 'Buah Sehari-hari',
  nusantara: 'Buah Nusantara',
  toko: 'Buah di Toko',
};

export interface Plot {
  fruit: Fruit;
  kind: PlantKind;
  zone: FruitGroup;
  x: number;
  z: number;
  /** jarak berhenti di depan tanaman saat berjalan ke sana */
  reach: number;
}

const COLS = 5;

/** Semua 48 buah, masing-masing satu tanaman di petak kelompoknya. */
export function buildPlots(fruits: Fruit[] = FRUITS): Plot[] {
  const count: Record<string, number> = {};
  return fruits.map((fruit) => {
    const k = (count[fruit.group] = (count[fruit.group] ?? -1) + 1);
    const [sx, sz] = ZONE_DIR[fruit.group];
    const c = k % COLS,
      r = Math.floor(k / COLS);
    const kind = plantKind(fruit);
    const low = kind === 'vine' || kind === 'pineapple' || kind === 'bush';
    return {
      fruit,
      kind,
      zone: fruit.group,
      x: sx * (GARDEN.first + c * GARDEN.step),
      z: sz * (GARDEN.first + r * GARDEN.step),
      reach: low ? 1.9 : 2.4,
    };
  });
}

/** Jari-jari tabrakan batang/tanaman (anak tidak menembus pohon). */
export const plotRadius = (p: Plot) => (p.kind === 'vine' || p.kind === 'bush' || p.kind === 'pineapple' ? 0.7 : p.kind === 'trellis' ? 1.3 : 0.75);
