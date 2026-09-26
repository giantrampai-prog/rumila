import palette from './material-palette.json';
import type { Part } from './types';
/** Naturalistic tissue materials are independent of Rumila's interface palette. */
export function tissueColor(p: Part): string {
 const id=p.id;
 const color=id.startsWith('valve_')?palette.valve:id.startsWith('atrium_')?palette.atrium:id.startsWith('coronary_')&&id!=='coronary_sinus'?palette.coronary:id.startsWith('cardiac_vein')||id.startsWith('vena_')||id.includes('pulmonary_vein')||id==='coronary_sinus'?palette.vein:id==='aorta'||id.startsWith('pulmonary_artery')||id==='pulmonary_trunk'?palette.artery:p.assetId==='heart'?palette.heart:id.startsWith('lung_')?palette.lung:id.startsWith('brain')?palette.brain:id.startsWith('kidney')?palette.kidney:id==='liver'?palette.liver:id==='stomach'?palette.stomach:id==='pancreas'?palette.pancreas:/jejunum|ileum|duodenum|colon|intestin/.test(id)?palette.intestine:id.startsWith('eye_')||id.startsWith('cornea_')||id.startsWith('lens_')||id.startsWith('vitreous_')?palette.eye:id.startsWith('iris_')?palette.iris:id.startsWith('retina_')?palette.retina:id.startsWith('hair_')?palette.hair:id.startsWith('auricle_')?palette.layers.skin:palette.layers[p.layer];
 return '#'+color;
}
