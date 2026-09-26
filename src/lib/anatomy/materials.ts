import palette from './material-palette.json';
import type { Part } from './types';

/**
 * Tampilan jaringan realistis (terpisah dari palet antarmuka Rumila).
 * Warna mengikuti jaringan segar pada atlas fotografi anatomi; "wet" = lapisan basah mengilap (clearcoat),
 * "detail" = pola permukaan prosedural di shader (tanpa tekstur tambahan).
 */
export type TissueDetail = 'skin' | 'muscle' | 'organ' | 'lobule' | 'bone' | 'vessel' | 'nerve' | 'brain' | 'lung' | 'smooth' | 'none';
export interface TissueLook {
  color: string;
  roughness: number;
  /** 0–1: kilap basah (mukosa, organ, mata) */
  wet: number;
  /** kilau lembut di tepi (kulit/otot: kesan tembus cahaya) */
  sheen: number;
  sheenColor?: string;
  /** 0–1: bening (kornea, lensa, badan kaca) */
  transmission: number;
  detail: TissueDetail;
  /** kekuatan variasi warna & tonjolan permukaan */
  detailStrength: number;
  /** skala pola (per meter model); makin besar makin halus */
  detailScale: number;
  /** warna urat/bercak yang dicampurkan tipis */
  tint?: string;
}

const P = palette as unknown as Record<string, string> & { layers: Record<string, string> };
const c = (k: string) => '#' + (P[k] ?? P.layers[k]);

const LOOK = {
  skin: { color: c('skin'), roughness: 0.52, wet: 0.08, sheen: 0.55, sheenColor: '#ffc9ae', transmission: 0, detail: 'skin', detailStrength: 0.5, detailScale: 420, tint: '#b06a55' },
  hair: { color: c('hair'), roughness: 0.62, wet: 0.2, sheen: 0.6, sheenColor: '#6a4a36', transmission: 0, detail: 'muscle', detailStrength: 0.6, detailScale: 900 },
  nail: { color: c('nail'), roughness: 0.3, wet: 0.5, sheen: 0, transmission: 0, detail: 'smooth', detailStrength: 0.2, detailScale: 600 },
  bone: { color: c('bone'), roughness: 0.62, wet: 0.12, sheen: 0, transmission: 0, detail: 'bone', detailStrength: 0.55, detailScale: 260, tint: '#b99f74' },
  tooth: { color: c('tooth'), roughness: 0.22, wet: 0.7, sheen: 0, transmission: 0, detail: 'smooth', detailStrength: 0.2, detailScale: 500, tint: '#d9c9a2' },
  cartilage: { color: c('cartilage'), roughness: 0.3, wet: 0.6, sheen: 0.2, sheenColor: '#e8f0ff', transmission: 0, detail: 'smooth', detailStrength: 0.25, detailScale: 300 },
  ligament: { color: c('ligament'), roughness: 0.35, wet: 0.55, sheen: 0.4, sheenColor: '#ffffff', transmission: 0, detail: 'muscle', detailStrength: 0.45, detailScale: 700 },
  tendon: { color: c('tendon'), roughness: 0.33, wet: 0.55, sheen: 0.45, sheenColor: '#ffffff', transmission: 0, detail: 'muscle', detailStrength: 0.45, detailScale: 700 },
  muscle: { color: c('muscle'), roughness: 0.42, wet: 0.45, sheen: 0.35, sheenColor: '#ff8a7a', transmission: 0, detail: 'muscle', detailStrength: 0.75, detailScale: 520, tint: '#5e1614' },
  heart: { color: c('heart'), roughness: 0.4, wet: 0.6, sheen: 0.25, sheenColor: '#ff9a88', transmission: 0, detail: 'muscle', detailStrength: 0.6, detailScale: 380, tint: c('fat') },
  atrium: { color: c('atrium'), roughness: 0.4, wet: 0.6, sheen: 0.25, sheenColor: '#ff9a88', transmission: 0, detail: 'muscle', detailStrength: 0.55, detailScale: 380, tint: '#5a1714' },
  valve: { color: c('valve'), roughness: 0.35, wet: 0.65, sheen: 0.3, sheenColor: '#ffffff', transmission: 0, detail: 'smooth', detailStrength: 0.25, detailScale: 500 },
  artery: { color: c('artery'), roughness: 0.34, wet: 0.65, sheen: 0.2, sheenColor: '#ff9d90', transmission: 0, detail: 'vessel', detailStrength: 0.4, detailScale: 600, tint: '#6d1512' },
  vein: { color: c('vein'), roughness: 0.34, wet: 0.65, sheen: 0.2, sheenColor: '#a79ad0', transmission: 0, detail: 'vessel', detailStrength: 0.4, detailScale: 600, tint: '#2c2140' },
  nerve: { color: c('nerve'), roughness: 0.4, wet: 0.45, sheen: 0.45, sheenColor: '#fff3cc', transmission: 0, detail: 'nerve', detailStrength: 0.5, detailScale: 900, tint: '#cdb277' },
  brain: { color: c('brain'), roughness: 0.38, wet: 0.55, sheen: 0.35, sheenColor: '#ffd6d0', transmission: 0, detail: 'brain', detailStrength: 0.7, detailScale: 140, tint: '#a05b58' },
  lung: { color: c('lung'), roughness: 0.46, wet: 0.45, sheen: 0.35, sheenColor: '#ffd0d0', transmission: 0, detail: 'lung', detailStrength: 0.8, detailScale: 260, tint: '#7b4a55' },
  liver: { color: c('liver'), roughness: 0.3, wet: 0.75, sheen: 0.1, transmission: 0, detail: 'lobule', detailStrength: 0.55, detailScale: 300, tint: '#3b100d' },
  kidney: { color: c('kidney'), roughness: 0.32, wet: 0.7, sheen: 0.1, transmission: 0, detail: 'organ', detailStrength: 0.5, detailScale: 320, tint: '#431310' },
  spleen: { color: c('spleen'), roughness: 0.32, wet: 0.7, sheen: 0.1, transmission: 0, detail: 'organ', detailStrength: 0.5, detailScale: 320, tint: '#351523' },
  stomach: { color: c('stomach'), roughness: 0.36, wet: 0.65, sheen: 0.25, sheenColor: '#ffd8cc', transmission: 0, detail: 'organ', detailStrength: 0.6, detailScale: 240, tint: '#b05a50' },
  intestine: { color: c('intestine'), roughness: 0.36, wet: 0.65, sheen: 0.25, sheenColor: '#ffd8cc', transmission: 0, detail: 'organ', detailStrength: 0.6, detailScale: 260, tint: '#b86a5a' },
  colon: { color: c('colon'), roughness: 0.38, wet: 0.6, sheen: 0.2, sheenColor: '#ffd8cc', transmission: 0, detail: 'organ', detailStrength: 0.6, detailScale: 240, tint: '#9a5a46' },
  pancreas: { color: c('pancreas'), roughness: 0.4, wet: 0.55, sheen: 0.2, sheenColor: '#fff0d0', transmission: 0, detail: 'lobule', detailStrength: 0.5, detailScale: 360, tint: '#b88550' },
  gallbladder: { color: c('gallbladder'), roughness: 0.28, wet: 0.75, sheen: 0.1, transmission: 0, detail: 'organ', detailStrength: 0.4, detailScale: 300, tint: '#233f20' },
  bladder: { color: c('bladder'), roughness: 0.34, wet: 0.65, sheen: 0.2, sheenColor: '#ffe6dc', transmission: 0, detail: 'organ', detailStrength: 0.45, detailScale: 260, tint: '#a8736a' },
  gland: { color: c('gland'), roughness: 0.36, wet: 0.6, sheen: 0.2, sheenColor: '#fff0d0', transmission: 0, detail: 'lobule', detailStrength: 0.35, detailScale: 260, tint: '#9a6a3a' },
  thyroid: { color: c('thyroid'), roughness: 0.34, wet: 0.65, sheen: 0.15, transmission: 0, detail: 'lobule', detailStrength: 0.5, detailScale: 600, tint: '#561c18' },
  mucosa: { color: c('mucosa'), roughness: 0.3, wet: 0.8, sheen: 0.2, sheenColor: '#ffd6d6', transmission: 0, detail: 'organ', detailStrength: 0.3, detailScale: 220, tint: '#8e3a3e' },
  gum: { color: c('gum'), roughness: 0.3, wet: 0.8, sheen: 0.2, sheenColor: '#ffd6d6', transmission: 0, detail: 'organ', detailStrength: 0.4, detailScale: 600, tint: '#a8454a' },
  tongue: { color: c('tongue'), roughness: 0.45, wet: 0.8, sheen: 0.3, sheenColor: '#ffd6d6', transmission: 0, detail: 'lung', detailStrength: 0.6, detailScale: 900, tint: '#8e3a3e' },
  sclera: { color: c('eye'), roughness: 0.2, wet: 0.95, sheen: 0.15, sheenColor: '#ffffff', transmission: 0, detail: 'vessel', detailStrength: 0.18, detailScale: 700, tint: '#d88a80' },
  cornea: { color: '#2c343c', roughness: 0.03, wet: 1, sheen: 0, transmission: 0.95, detail: 'none', detailStrength: 0, detailScale: 1 },
  lens: { color: '#4a3e30', roughness: 0.06, wet: 0.95, sheen: 0, transmission: 0.85, detail: 'none', detailStrength: 0, detailScale: 1 },
  vitreous: { color: '#1c2026', roughness: 0.1, wet: 0.6, sheen: 0, transmission: 0.95, detail: 'none', detailStrength: 0, detailScale: 1 },
  iris: { color: c('iris'), roughness: 0.4, wet: 0.5, sheen: 0, transmission: 0, detail: 'nerve', detailStrength: 0.9, detailScale: 1600, tint: '#2e1a0e' },
  retina: { color: c('retina'), roughness: 0.35, wet: 0.6, sheen: 0.1, transmission: 0, detail: 'vessel', detailStrength: 0.6, detailScale: 500, tint: '#7a1d14' },
  ossicle: { color: c('ossicle'), roughness: 0.45, wet: 0.35, sheen: 0, transmission: 0, detail: 'bone', detailStrength: 0.4, detailScale: 900, tint: '#b99f74' },
  organ: { color: c('organ'), roughness: 0.36, wet: 0.6, sheen: 0.2, sheenColor: '#ffd8cc', transmission: 0, detail: 'organ', detailStrength: 0.5, detailScale: 300, tint: '#6a2a22' },
} satisfies Record<string, TissueLook>;

type LookKey = keyof typeof LOOK;

function lookKey(p: Part): LookKey {
  const id = p.id;
  if (id.startsWith('valve_')) return 'valve';
  if (id.startsWith('atrium_')) return 'atrium';
  if (id.startsWith('cardiac_vein') || id.startsWith('vena_') || id.includes('pulmonary_vein') || id === 'coronary_sinus') return 'vein';
  if (id.startsWith('coronary_') || id === 'aorta' || id.startsWith('pulmonary_artery') || id === 'pulmonary_trunk') return 'artery';
  if (p.assetId === 'heart') return 'heart';
  if (id.startsWith('lung_')) return 'lung';
  if (id.startsWith('brain')) return 'brain';
  if (id.startsWith('kidney')) return 'kidney';
  if (id === 'liver') return 'liver';
  if (id === 'spleen') return 'spleen';
  if (id === 'stomach' || id === 'esophagus') return 'stomach';
  if (id === 'pancreas') return 'pancreas';
  if (id === 'gallbladder') return 'gallbladder';
  if (id === 'bladder' || id === 'urethra' || id.startsWith('ureter')) return 'bladder';
  if (/colon/.test(id)) return 'colon';
  if (/jejunum|ileum|duodenum|intestin/.test(id)) return 'intestine';
  if (id === 'thyroid' || id.startsWith('thymus')) return 'thyroid';
  if (/adrenal|pituitary|prostate|seminal|testis|lacrimal_gland/.test(id)) return 'gland';
  if (id === 'trachea' || id.startsWith('alar_cartilage') || id === 'nasal_septum' || id.startsWith('meniscus')) return 'cartilage';
  if (id.startsWith('cornea_')) return 'cornea';
  if (id.startsWith('lens_')) return 'lens';
  if (id.startsWith('vitreous_')) return 'vitreous';
  if (id.startsWith('iris_')) return 'iris';
  if (id.startsWith('retina_')) return 'retina';
  if (id.startsWith('eye_') || id.startsWith('ciliary_')) return 'sclera';
  if (id.startsWith('malleus') || id.startsWith('incus') || id.startsWith('stapes') || id === 'cochlea_study') return 'ossicle';
  if (id.startsWith('tooth_')) return 'tooth';
  if (id === 'gingiva') return 'gum';
  if (id === 'tongue') return 'tongue';
  if (/nasal_mucosa|soft_palate|uvula|mouth|oral_surface|lacrimal_duct|eardrum/.test(id)) return 'mucosa';
  if (id.startsWith('hair_')) return 'hair';
  if (id.startsWith('nails_')) return 'nail';
  if (/achilles|plantar_fascia/.test(id)) return 'tendon';
  if (/ligament|knee_acl|knee_pcl/.test(id)) return 'ligament';
  if (id.startsWith('auricle_') || id === 'nose' || id.startsWith('nose_surface') || /^(hand|foot)_/.test(id) || id.startsWith('ear_')) return 'skin';
  switch (p.layer) {
    case 'skin':
      return 'skin';
    case 'bone':
      return 'bone';
    case 'muscle':
      return 'muscle';
    case 'vessel':
      return 'artery';
    case 'nerve':
      return 'nerve';
    default:
      return 'organ';
  }
}

export function tissueLook(p: Part): TissueLook {
  return LOOK[lookKey(p)];
}

/** Warna dasar jaringan (dipertahankan untuk kompatibilitas). */
export function tissueColor(p: Part): string {
  return tissueLook(p).color;
}
