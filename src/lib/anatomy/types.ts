export type Vec3 = [number, number, number];
export type LayerId = 'skin' | 'muscle' | 'bone' | 'organ' | 'vessel' | 'nerve';
export type RegionId = 'head' | 'neck' | 'thorax' | 'abdomen' | 'pelvis' | 'shoulder' | 'arm' | 'elbow' | 'forearm' | 'wrist' | 'hand' | 'thigh' | 'knee' | 'leg' | 'ankle' | 'foot';
export interface Part {
  kind?: "assembly" | "inset"; insetId?: string; materialOpacity?: number;
  id: string; parentId: string | null; regionId: RegionId; systemIds: string[];
  laterality: 'left' | 'right' | 'midline' | 'none'; layer: LayerId;
  nameId: string; anatomicalName: string; aliases: string[];
  definitionSimple: string; definitionDetailed: string; functions: string[]; locationText: string;
  relatedIds: string[]; sources: { title: string; url: string }[]; reviewedAt: string | null;
  reviewStatus: 'pending' | 'reviewed'; assetId: string; meshNodeNames: string[]; pickNodeNames: string[];
  labelAnchor: Vec3; restTransform: { position: Vec3; rotation: Vec3; scale: Vec3 };
  explodePath: Vec3; childIds: string[]; bounds: { min: Vec3; max: Vec3 };
  capabilities: { disassemble: boolean; interior: boolean; section: boolean; animation: boolean; microInset: boolean };
}
export interface Asset {
  deferred?: boolean;
  id: string; url: string; bytes: number; triangles: number; sha256: string;
  detailUrl?: string; detailBytes?: number; detailTriangles?: number; detailSha256?: string;
  license: string; source: string; attribution: string; reviewStatus: 'pending' | 'reviewed';
}
export interface Manifest { version: string; status: 'development' | 'release'; assets: Asset[]; parts: Part[]; missing: string[] }
export const LAYERS: { id: LayerId; name: string; icon: string; color: string }[] = [
  { id: 'skin', name: 'Kulit', icon: 'fingerprint', color: '#deb799' },
  { id: 'muscle', name: 'Otot', icon: 'fitness_center', color: '#c5776e' },
  { id: 'bone', name: 'Tulang', icon: 'orthopedics', color: '#dbd0b7' },
  { id: 'organ', name: 'Organ', icon: 'pulmonology', color: '#da9189' },
  { id: 'vessel', name: 'Pembuluh', icon: 'cardiology', color: '#b86763' },
  { id: 'nerve', name: 'Saraf', icon: 'neurology', color: '#d8ae64' },
];
export const REGIONS: Record<RegionId, string> = { head: 'Kepala dan wajah', neck: 'Leher', thorax: 'Dada', abdomen: 'Perut', pelvis: 'Panggul', shoulder: 'Bahu', arm: 'Lengan atas', elbow: 'Siku', forearm: 'Lengan bawah', wrist: 'Pergelangan tangan', hand: 'Telapak dan jari tangan', thigh: 'Paha', knee: 'Lutut', leg: 'Tungkai bawah', ankle: 'Pergelangan kaki', foot: 'Telapak dan jari kaki' };
export const SYSTEMS: Record<string, string> = { integument: 'Integumen', skeletal: 'Rangka dan sendi', muscular: 'Otot', nervous: 'Saraf', cardiovascular: 'Kardiovaskular', respiratory: 'Pernapasan', digestive: 'Pencernaan', urinary: 'Urinaria', lymphatic: 'Limfatik / imun', endocrine: 'Endokrin', reproductive: 'Reproduksi' };
