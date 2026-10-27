import type * as T from 'three';

export type MaterialName = 'marble' | 'limestone' | 'plaster' | 'gold' | 'darkGold' | 'glass' | 'wood' | 'black' | 'kiswa' | 'green' | 'paving' | 'sand' | 'fabric' | 'metal' | 'asphalt' | 'carpet' | 'white' | 'darkStone';
export type Position = [number, number, number];
export interface Rect { minX: number; maxX: number; minZ: number; maxZ: number }
export interface Landmark { id: string; label: string; position: Position; lookAt: Position }
export interface CameraPose { position: Position; lookAt: Position }
/** Per-frame context handed to animated worlds; progress values are smoothed by the scene. */
export interface WorldFrame {
  chapter?: string;
  /** Completed checklist steps in the current lesson chapter. */
  step: number;
  /** Smoothed travel progress, 0–1. */
  travel: number;
  time: number;
  delta: number;
  running: boolean;
  reducedMotion: boolean;
  sunDirection: T.Vector3;
  sunset: boolean;
  /** Active camera mode, for worlds that show different geometry from outside. */
  view?: 'walk' | 'follow' | 'overview';
  /** Atmosphere shader shared by the scene; flight worlds tune it for altitude. */
  sky?: { material: T.ShaderMaterial; visible: boolean };
}
/** Live flight values a world publishes for cameras, lights and sound. */
export interface FlightTelemetry {
  altitude: number; speed: number; thrust: number; onGround: boolean; shake: number; inCloud: number;
  seatbelt: boolean; phase: string; local: number; heading: number; pitch: number; bank: number;
  /** Converts a point in the active runway frame to scene coordinates. */
  toScene(x: number, y: number, z: number, arrival?: boolean): T.Vector3;
}
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
  /** Complete aircraft used only by exterior flight cameras. */
  flight?: { aircraft: T.Group };
  crowd?: { kind: 'tawaf' | 'walk' | 'sai'; count: number; radius?: number; area?: Rect };
  /** Walking viewpoints keyed by journey chapter, for worlds shared by several chapters. */
  stations?: Partial<Record<string, CameraPose>>;
  /** Scripted camera path following travel progress (for example boarding the aircraft). */
  rail?: (progress: number) => CameraPose;
  /** Seated eye point inside `vehicle`, in its local coordinates. */
  seat?: CameraPose;
  /** Moves with flight attitude; batched separately so it can rotate as one object. */
  vehicle?: T.Group;
  telemetry?: FlightTelemetry;
  animate?: (frame: WorldFrame) => void;
  /** Scripted aerial camera used in place of the orbit view (for example a drone over a train). */
  drone?: (time: number, travel: number) => CameraPose;
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
  /** Collapses static descendants into one mesh per material. */
  batch(group: T.Group): void;
}
