import { LAYERS, type LayerId, type Manifest, type Part, type RegionId, type Vec3 } from './types';
export type CameraPose = { position: Vec3; target: Vec3; minDistance?: number; maxDistance?: number };
export type Layers = Record<LayerId, { visible: boolean; opacity: number }>;
export interface Exploration {
  selectedId: string | null; region: RegionId | 'all'; layers: Layers;
  isolation: string | null; interior: string | null; explode: number;
  detached: Record<string, number>; mode: 'orbit' | 'explode' | 'disassemble' | 'section';
  section: { axis: 'axial' | 'sagittal' | 'coronal'; position: number } | null;
  playing: boolean; speed: number; labels: boolean; reducedMotion: boolean;
}
export interface ExplorerState extends Exploration { snapshot: { exploration: Exploration; camera: CameraPose } | null; cameraRestore: CameraPose | null; revision: number }
export function initialState(reducedMotion = false): ExplorerState {
  return { selectedId: null, region: 'all', layers: Object.fromEntries(LAYERS.map(l => [l.id, { visible: ['bone', 'organ'].includes(l.id), opacity: 1 }])) as Layers,
    isolation: null, interior: null, explode: 0, detached: {}, mode: 'orbit', section: null,
    playing: false, speed: 1, labels: true, reducedMotion, snapshot: null, cameraRestore: null, revision: 0 };
}
export function poseAt(rest: Vec3, path: Vec3, percent: number): Vec3 {
  const t = Math.max(0, Math.min(100, percent)) / 100;
  return rest.map((v, i) => v + path[i] * t) as Vec3;
}
export function belongsTo(part: Part, root: string, parts: Part[]): boolean {
  let p: Part | undefined = part;
  const visited = new Set<string>();
  while (p && !visited.has(p.id)) { if (p.id === root) return true; visited.add(p.id); p = parts.find(a => a.id === p!.parentId); }
  return false;
}
export function visiblePart(p: Part, s: Exploration, parts: Part[]) {
  return (p.kind!=='inset'||s.isolation===p.id) && s.layers[p.layer].visible && s.layers[p.layer].opacity > .02 && (!s.isolation || belongsTo(p, s.isolation, parts));
}
export function searchable(p: Part, query: string) {
  return [p.nameId, p.anatomicalName, ...p.aliases].join(' ').toLocaleLowerCase('id').includes(query.trim().toLocaleLowerCase('id'));
}
export type Action =
  | { type: 'patch'; patch: Partial<Exploration> }
  | { type: 'layer'; id: LayerId; visible?: boolean; opacity?: number }
  | { type: 'select'; part: Part; reveal?: boolean }
  | { type: 'isolate'; id: string; camera: CameraPose }
  | { type: 'back' } | { type: 'reset' } | { type: 'reassemble' };
export function reducer(s: ExplorerState, a: Action): ExplorerState {
  switch (a.type) {
    case 'patch': return { ...s, ...a.patch };
    case 'layer': return { ...s, layers: { ...s.layers, [a.id]: { ...s.layers[a.id], ...(a.visible !== undefined ? { visible: a.visible } : {}), ...(a.opacity !== undefined ? { opacity: Math.max(0, Math.min(1, a.opacity)) } : {}) } } };
    case 'select': {
      let next = s;
      if (a.reveal && s.isolation && a.part.id !== s.isolation && a.part.parentId !== s.isolation) next = reducer(s, { type: 'back' });
      const layers = structuredClone(next.layers);
      if (a.reveal) {
        layers[a.part.layer] = { visible: true, opacity: 1 };
        for (const l of ['skin', 'muscle'] as const) if (l !== a.part.layer) layers[l].visible = false;
        if (a.part.layer !== 'bone') layers.bone.opacity = .22;
      }
      return { ...next, selectedId: a.part.id, region: a.part.regionId, layers, ...(a.reveal ? { section: null, mode: 'orbit' as const } : {}) };
    }
    case 'isolate': {
      const exploration: Exploration = { selectedId:s.selectedId,region:s.region,layers:s.layers,isolation:s.isolation,interior:s.interior,explode:s.explode,detached:s.detached,mode:s.mode,section:s.section,playing:s.playing,speed:s.speed,labels:s.labels,reducedMotion:s.reducedMotion };
      const snapshot=s.snapshot;
      return { ...s, isolation: a.id, explode: 0, detached: {}, playing: false, section: null, mode: 'orbit', snapshot: snapshot ?? { exploration: structuredClone(exploration), camera: a.camera } };
    }
    case 'back': return s.snapshot ? { ...s.snapshot.exploration, snapshot: null, cameraRestore: s.snapshot.camera, revision: s.revision + 1 } : s;
    case 'reset': return { ...initialState(s.reducedMotion), revision: s.revision + 1 };
    case 'reassemble': return { ...s, explode: 0, detached: {}, interior: null, section: null, playing: false, mode: 'orbit' };
  }
}
export function validateManifest(m: Manifest): string[] {
  const errors: string[] = [], ids = new Set<string>(), nodes = new Set<string>();
  if (m.version !== '1.0.0') errors.push('Versi manifest tidak didukung');
  for (const p of m.parts) {
    if (ids.has(p.id)) errors.push(`ID ganda: ${p.id}`); ids.add(p.id);
    if (!m.assets.some(a => a.id === p.assetId)) errors.push(`Aset hilang: ${p.id}`);
    if (!p.sources.length || !p.definitionSimple || !p.meshNodeNames.length) errors.push(`Konten tidak lengkap: ${p.id}`);
    for (const n of p.meshNodeNames) { if (nodes.has(n)) errors.push(`Node ganda: ${n}`); nodes.add(n); }
    if (m.status === 'release' && (p.reviewStatus !== 'reviewed' || !p.reviewedAt)) errors.push(`Belum ditinjau: ${p.id}`);
    if (p.capabilities.interior && !p.childIds.length) errors.push(`Interior tanpa bagian: ${p.id}`);
    if (p.capabilities.disassemble && !p.explodePath.some(Boolean)) errors.push(`Jalur pisah kosong: ${p.id}`);
  }
  const byId = new Map(m.parts.map(p => [p.id, p]));
  for (const p of m.parts) {
    if (p.parentId && !byId.get(p.parentId)?.childIds.includes(p.id)) errors.push(`Parent tidak konsisten: ${p.id}`);
    for (const id of p.childIds) if (byId.get(id)?.parentId !== p.id) errors.push(`Child tidak konsisten: ${id}`);
    for (const id of p.relatedIds) if (!byId.has(id)) errors.push(`Relasi hilang: ${id}`);
    let at: Part | undefined = p; const visited = new Set<string>();
    while (at) { if (visited.has(at.id)) { errors.push(`Siklus: ${p.id}`); break; } visited.add(at.id); at = at.parentId ? byId.get(at.parentId) : undefined; }
  }
  return errors;
}
