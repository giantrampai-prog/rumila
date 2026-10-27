import * as T from 'three';
import { createGarudaAircraft } from './aircraft';
import type { UmrohWorld, WorldResources } from './types';

/** Cruising over a cloud deck; no ground plane and no cabin shell in this world. */
export function createFlightWorld(r: WorldResources, destination: 'jeddah' | 'jakarta'): UmrohWorld {
  const group = new T.Group(); group.name = `Penerbangan Garuda · ${destination}`;
  const aircraft = createGarudaAircraft(r); group.add(aircraft);
  group.add(createFlightSky(r));
  const clouds = createCloudLayer(r); clouds.userData.dynamic = true; group.add(clouds);
  return {
    group, flight: { aircraft }, motion: { group: clouds, axis: 'z', distance: 640 },
    spawn: [58, 18, -62], lookAt: [0, 1, -2], overview: [58, 18, -62],
    bounds: { minX: -150, maxX: 150, minZ: -160, maxZ: 160 }, blockers: [],
    landmarks: [
      { id: 'flight-front', label: 'Pesawat di atas awan', position: [58, 18, -62], lookAt: [0, 1, -2] },
      { id: 'flight-wing', label: 'Sayap dan langit', position: [-53, 10, 47], lookAt: [0, 1, 0] },
    ],
  };
}

export function createFlightSky(r: WorldResources): T.Mesh {
  const canvas = document.createElement('canvas'); canvas.width = 16; canvas.height = 512;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Langit penerbangan tidak tersedia.');
  // A restrained blue zenith, pale horizon and a cool cloud deck below.
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#1168ae'); gradient.addColorStop(.3, '#4996cc'); gradient.addColorStop(.5, '#b8d9eb'); gradient.addColorStop(.58, '#e3edf2'); gradient.addColorStop(1, '#82aac5');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 16, 512);
  const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace;
  const material = r.keep(new T.MeshBasicMaterial({ map, side: T.BackSide, depthWrite: false, fog: false, toneMapped: false })); material.userData.keepUV = true;
  const sky = r.mesh(new T.Group(), new T.SphereGeometry(2200, 32, 24), material); sky.castShadow = sky.receiveShadow = false; sky.renderOrder = -100;
  return sky;
}

/** Original translucent cloud textures use lit, soft-edged
 * billboards. Their irregular silhouettes avoid the previous solid disk shapes. */
export function createCloudLayer(r: WorldResources, cabin = false): T.Group {
  const clouds = new T.Group(); clouds.name = 'Lapisan awan bergerak';
  const materials = Array.from({ length: 3 }, (_, variant) => cloudMaterial(r, variant));
  // Broad, lower clouds form a continuous deck; isolated cumulus gives parallax.
  for (let i = 0; i < (cabin ? 22 : 32); i++) {
    const random = seeded(i + 51);
    const near = i % 3 === 0;
    const sprite = new T.Sprite(materials[i % materials.length]);
    const side = i % 2 ? 1 : -1;
    sprite.position.set(side * (cabin ? 65 + random() * 180 : 120 + random() * 790), (cabin ? -20 : -58) - random() * (near ? 50 : 140), -750 + random() * 1300);
    const width = (cabin ? 65 : 115) + random() * (near ? 100 : 230);
    sprite.scale.set(width, width * (.3 + random() * .12), 1);
    sprite.renderOrder = 0; clouds.add(sprite);
  }
  if (!cabin) for (let i = 0; i < 8; i++) {
    const sprite = new T.Sprite(materials[i % 3]);
    sprite.position.set((i % 4 - 1.5) * 520, -250 - i % 3 * 45, -850 + Math.floor(i / 4) * 1000);
    sprite.scale.set(580, 165, 1); clouds.add(sprite);
  }
  return clouds;
}
function cloudMaterial(r: WorldResources, variant: number): T.SpriteMaterial {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Tekstur awan tidak tersedia.');
  const random = seeded(variant * 937 + 81);
  // Build one opaque cloud silhouette, then shade that entire volume. Coloring
  // the rim of every separate puff creates artificial rings, so only the outer
  // silhouette is softened; overlapping lobes never introduce dark outlines.
  const mask = document.createElement('canvas'); mask.width = 1024; mask.height = 512;
  const m = mask.getContext('2d'); if (!m) throw new Error('Siluet awan tidak tersedia.');
  m.filter = 'blur(8px)'; m.fillStyle = '#ffffff';
  m.beginPath(); m.ellipse(512, 342, 385, 82, 0, 0, Math.PI * 2); m.fill();
  for (let i = 0; i < 13; i++) {
    const t = i / 12, x = 140 + t * 740;
    const y = 312 - Math.sin(t * Math.PI) * (80 + random() * 90);
    m.beginPath(); m.ellipse(x, y, 67 + random() * 44, 57 + random() * 56, -.1 + random() * .2, 0, Math.PI * 2); m.fill();
  }
  const shade = ctx.createLinearGradient(0, 95, 75, 435);
  shade.addColorStop(0, '#ffffff'); shade.addColorStop(.38, '#fcfdff'); shade.addColorStop(.7, '#eaf1f7'); shade.addColorStop(1, '#bfcfdd');
  ctx.fillStyle = shade; ctx.fillRect(0, 0, 1024, 512);
  // Broad, almost white highlights suggest rounded cumulus without separate
  // concentric halos or repeated disk geometry.
  for (let i = 0; i < 14; i++) {
    const x = 170 + random() * 690, y = 170 + random() * 150, radius = 60 + random() * 105;
    const light = ctx.createRadialGradient(x, y, 0, x, y, radius);
    light.addColorStop(0, 'rgba(255,255,255,.54)'); light.addColorStop(.45, 'rgba(255,255,255,.26)'); light.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = light; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(mask, 0, 0); ctx.globalCompositeOperation = 'source-over';
  const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace;
  return r.keep(new T.SpriteMaterial({ map, transparent: true, depthWrite: false, opacity: .96, fog: true, toneMapped: false, alphaTest: .006 }));
}
function seeded(seed: number): () => number {
  let value = seed >>> 0;
  return () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; };
}
