import type * as T from 'three';

export type MaterialName = 'marble' | 'limestone' | 'plaster' | 'gold' | 'darkGold' | 'glass' | 'wood' | 'black' | 'kiswa' | 'green' | 'paving' | 'sand' | 'fabric' | 'metal' | 'asphalt' | 'carpet' | 'white' | 'darkStone';
export type Position = [number, number, number];
export interface Rect { minX: number; maxX: number; minZ: number; maxZ: number }
export interface Landmark { id: string; label: string; position: Position; lookAt: Position }
export interface UmrohWorld {
  group: T.Group;
  spawn: Position;
  lookAt: Position;
  overview: Position;
  bounds: Rect;
  blockers: Rect[];
  landmarks: Landmark[];
  indoor?: boolean;
  /** Static vehicle interior with scenery translated by journey progress. */
  motion?: { group: T.Group; axis: 'x' | 'z'; distance: number; loop?: boolean };
  crowd?: { kind: 'tawaf' | 'walk' | 'sai'; count: number; radius?: number; area?: Rect };
}
export interface WorldResources {
  mat: Record<MaterialName, T.MeshStandardMaterial>;
  keep<G extends T.BufferGeometry | T.Material | T.Texture>(resource: G): G;
  box(parent: T.Object3D, size: Position, at: Position, material: T.Material): T.Mesh;
  cylinder(parent: T.Object3D, top: number, bottom: number, height: number, at: Position, material: T.Material, segments?: number): T.Mesh;
  sphere(parent: T.Object3D, size: Position, at: Position, material: T.Material): T.Mesh;
  mesh(parent: T.Object3D, geometry: T.BufferGeometry, material: T.Material, at?: Position): T.Mesh;
  floor(parent: T.Object3D, width: number, depth: number, material?: T.Material): T.Mesh;
  sign(parent: T.Object3D, title: string, subtitle: string, at: Position, width?: number): T.Mesh;
}
