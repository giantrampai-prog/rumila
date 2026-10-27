import * as T from 'three';
import { addGarudaAircraft, beam, bench, color, kit, luggage, palm, textPlate, type Kit } from './itinerary';
import { createSeatedPassengers, StandingPeople } from './pilgrims';
import { createCabinWorld, CABIN_SEAT } from './travel';
import type { CameraPose, Position, Rect, UmrohWorld, WorldFrame, WorldResources } from './types';

/**
 * International terminals at human scale. Departures walk from the kerb (+Z) through
 * check-in, immigration and security to the gate (-Z); arrivals walk the other way to
 * baggage claim. Props for the learner react to the checklist steps of each chapter.
 * Layout, gate numbers and signage are illustrative, not a survey of the real airports.
 */
type Animator = (frame: WorldFrame) => void;
interface Names { code: string; title: string; subtitle: string; desert: boolean }
const NAMES: Record<'cgk' | 'jed', Names> = {
  cgk: { code: 'CGK', title: 'SOEKARNO–HATTA', subtitle: 'Terminal 3 · Jakarta', desert: false },
  jed: { code: 'JED', title: 'KING ABDULAZIZ · JEDDAH', subtitle: 'Terminal 1 · مطار الملك عبدالعزيز', desert: true },
};
const COUNTER_Z = 29.2;
const GATE_LABEL = 'GERBANG 7';

function steps(frame: WorldFrame, chapter: string): number { return frame.chapter === chapter ? frame.step : 0; }
const ease = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };

/** Remembers when a step was reached so props can animate from that moment. */
function stepClock(): (frame: WorldFrame, chapter: string, step: number) => number {
  const reached = new Map<string, number>();
  return (frame, chapter, step) => {
    const key = chapter + ':' + step;
    if (steps(frame, chapter) < step) { reached.delete(key); return -1; }
    if (!reached.has(key)) reached.set(key, frame.time);
    return frame.time - reached.get(key)!;
  };
}

function wayfinding(k: Kit, parent: T.Object3D, title: string, subtitle: string, at: Position, width: number, rotation = 0): T.Mesh {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 256;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Papan petunjuk tidak tersedia.');
  ctx.fillStyle = '#2b3036'; ctx.fillRect(0, 0, 1024, 256);
  ctx.fillStyle = '#f2c230'; ctx.fillRect(0, 0, 18, 256);
  ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff'; ctx.font = '600 78px Arial, sans-serif'; ctx.fillText(title, 56, subtitle ? 92 : 128, 930);
  if (subtitle) { ctx.fillStyle = '#f2c230'; ctx.font = '44px Arial, sans-serif'; ctx.fillText(subtitle, 58, 186, 930); }
  const map = k.r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 4;
  const material = k.r.keep(new T.MeshStandardMaterial({ map, emissiveMap: map, emissive: '#ffffff', emissiveIntensity: .45, roughness: .6, side: T.DoubleSide }));
  material.userData.keepUV = true;
  const sign = k.r.mesh(parent, k.r.keep(new T.PlaneGeometry(width, width / 4)), material, at); sign.rotation.y = rotation; sign.castShadow = false;
  return sign;
}

/** A canvas-backed screen whose picture can be swapped between prepared states. */
function screen(k: Kit, parent: T.Object3D, at: Position, size: [number, number], states: ((ctx: CanvasRenderingContext2D, w: number, h: number) => void)[], rotation = 0, resolution = 512): { mesh: T.Mesh; show(index: number): void } {
  const maps = states.map((draw) => {
    const canvas = document.createElement('canvas'); canvas.width = resolution; canvas.height = Math.round(resolution * size[1] / size[0]);
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Layar tidak tersedia.');
    draw(ctx, canvas.width, canvas.height);
    const map = k.r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 4; return map;
  });
  const material = k.r.keep(new T.MeshStandardMaterial({ map: maps[0], emissiveMap: maps[0], emissive: '#ffffff', emissiveIntensity: .9, roughness: .3 }));
  material.userData.keepUV = true;
  const holder = new T.Group(); holder.userData.dynamic = true; parent.add(holder);
  const mesh = k.r.mesh(holder, k.r.keep(new T.PlaneGeometry(...size)), material, at); mesh.rotation.y = rotation; mesh.castShadow = false;
  let current = 0;
  return { mesh, show(index) { if (index === current || !maps[index]) return; current = index; material.map = maps[index]; material.emissiveMap = maps[index]; material.needsUpdate = true; } };
}

function dynamicGroup(parent: T.Object3D, at: Position = [0, 0, 0]): T.Group {
  const group = new T.Group(); group.userData.dynamic = true; group.position.set(...at); parent.add(group); return group;
}

function passport(k: Kit, parent: T.Object3D): T.Group {
  const book = new T.Group();
  k.r.box(book, [.088, .012, .125], [0, 0, 0], color(k, 'passport-green', '#1f5a3c', { roughness: .7 }));
  k.r.box(book, [.05, .013, .05], [0, .001, 0], color(k, 'passport-crest', '#c9a24a', { metalness: .6, roughness: .4 }));
  parent.add(book); return book;
}
function boardingPass(k: Kit, parent: T.Object3D): T.Group {
  const card = new T.Group();
  k.r.box(card, [.2, .003, .08], [0, 0, 0], color(k, 'pass-paper', '#fbfbf6', { roughness: .9 }));
  k.r.box(card, [.2, .004, .016], [0, .001, -.03], color(k, 'pass-band', '#0f6b8a', { roughness: .8 }));
  parent.add(card); return card;
}
function trolley(k: Kit, parent: T.Object3D, at: Position, rotation = 0): T.Group {
  const group = new T.Group(); group.position.set(...at); group.rotation.y = rotation;
  const frame = color(k, 'trolley', '#9aa1a6', { metalness: .7, roughness: .35 });
  k.r.box(group, [.6, .04, 1], [0, .3, 0], frame);
  beam(k, group, [-.28, .3, .5], [-.28, 1.05, .62], .018, frame); beam(k, group, [.28, .3, .5], [.28, 1.05, .62], .018, frame);
  beam(k, group, [-.3, 1.05, .62], [.3, 1.05, .62], .02, color(k, 'trolley-handle', '#c43c35'));
  for (const x of [-.26, .26]) for (const z of [-.42, .42]) k.r.sphere(group, [.06, .06, .06], [x, .07, z], k.r.mat.black);
  parent.add(group); return group;
}
function stanchions(k: Kit, parent: T.Object3D, x0: number, x1: number, z0: number, z1: number, lanes: number, tape: T.Material): void {
  const post = (x: number, z: number) => { k.r.cylinder(parent, .03, .03, .95, [x, .48, z], k.r.mat.metal, 8); k.r.cylinder(parent, .18, .18, .04, [x, .02, z], k.r.mat.metal, 12); };
  for (let i = 0; i <= lanes; i++) {
    const x = x0 + (x1 - x0) * i / lanes;
    for (let z = z0; z <= z1 + .01; z += (z1 - z0) / 4) post(x, z);
    // Alternate lane ends stay open to form the serpentine queue.
    const open = i % 2 ? z0 : z1;
    k.r.box(parent, [.025, .05, Math.abs(z1 - z0) - 1.2], [x, .9, (z0 + z1) / 2 + (open === z0 ? .6 : -.6)], tape);
  }
}

/** Shell: polished floor, tall slatted ceiling with skylights, tree columns and glass facades. */
function hall(k: Kit, group: T.Group, blockers: Rect[], names: Names): void {
  const { r } = k;
  const floor = r.floor(group, 92, 190, r.mat.marble); floor.position.z = -30;
  // Inlaid floor bands guide the eye along the passenger flow.
  for (const x of [-12, 12]) r.box(group, [.35, .01, 186], [x, .006, -30], color(k, 'floor-inlay', names.desert ? '#b79d74' : '#8d98a0', { roughness: .4 }));
  const ceiling = color(k, 'ceiling-slat', names.desert ? '#efe7da' : '#f3f1ea', { roughness: .8 });
  r.box(group, [92, .3, 190], [0, 16.4, -30], ceiling);
  for (let x = -45; x <= 45; x += 1.1) r.box(group, [.18, .45, 190], [x, 15.95, -30], ceiling);
  const skylight = color(k, 'skylight', '#fffaf0', { emissive: '#fff5e0', emissiveIntensity: .9 });
  for (let z = 50; z >= -110; z -= 20) r.box(group, [70, .05, 3], [0, 15.7, z], skylight);
  // Columns branch out to the roof like trees.
  const column = color(k, 'column', names.desert ? '#e2d8c6' : '#e9ebec', { roughness: .5, metalness: .1 });
  for (const x of [-30, 30]) for (let z = 46; z >= -106; z -= 24) {
    r.cylinder(group, .55, .75, 13, [x, 6.5, z], column, 20);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; beam(k, group, [x, 12.6, z], [x + Math.cos(a) * 5, 15.8, z + Math.sin(a) * 5], .18, column); }
    blockers.push({ minX: x - .9, maxX: x + .9, minZ: z - .9, maxZ: z + .9 });
  }
  // Side walls with clerestory glass; full glass at the kerb and the apron.
  for (const side of [-1, 1]) {
    r.box(group, [.3, 16.4, 190], [side * 46, 8.2, -30], r.mat.plaster);
    for (let z = 55; z >= -115; z -= 10) r.box(group, [.32, 3, 8], [side * 45.9, 13, z], r.mat.glass);
  }
  for (const z of [64, -124]) {
    for (let x = -45; x <= 45; x += 3) { r.box(group, [.1, 16, .14], [x, 8, z], r.mat.metal); if (x < 45) r.box(group, [2.9, 15.8, .05], [x + 1.5, 8, z], r.mat.glass); }
    for (const y of [3.2, 8, 12.4]) r.box(group, [92, .1, .16], [0, y, z], r.mat.metal);
  }
  blockers.push({ minX: -46, maxX: 46, minZ: 63, maxZ: 66 }, { minX: -46, maxX: 46, minZ: -126, maxZ: -122 });
  // Indoor gardens, a hallmark of Indonesian terminals; palms in Jeddah.
  for (const [x, z] of [[-38, 52], [38, 52], [-38, -60], [38, -60]]) {
    r.box(group, [6, .6, 6], [x, .3, z], r.mat.limestone);
    r.box(group, [5.6, .62, 5.6], [x, .31, z], color(k, 'planter-soil', names.desert ? '#8c7356' : '#3b4a2c'));
    palm(k, group, x, z, names.desert ? 7 : 5.5);
    blockers.push({ minX: x - 3.2, maxX: x + 3.2, minZ: z - 3.2, maxZ: z + 3.2 });
  }
}

function checkIn(k: Kit, group: T.Group, blockers: Rect[], animators: Animator[], names: Names, chapter: string): void {
  const { r } = k;
  const garuda = color(k, 'garuda-blue', '#0d5f7e', { roughness: .5 });
  const desk = color(k, 'counter-desk', '#e8e4dc', { roughness: .45 }), top = color(k, 'counter-top', '#3a3f44', { roughness: .35 });
  const belt = color(k, 'belt', '#202325', { roughness: .9 });
  // Backlit airline fascia high above the counter screens, so neither covers the other.
  const fascia = airlineFascia(k, group, [-13.05, 4.55, COUNTER_Z - 1], 26); fascia.rotation.y = Math.PI / 2;
  r.box(group, [.4, 3.4, 30], [-17.3, 1.7, 28], garuda);
  r.box(group, [1, .55, 29], [-15.6, .45, 28], belt);
  for (let z = 14; z <= 42; z += .9) { const roller = r.cylinder(group, .05, .05, .9, [-15.6, .74, z], r.mat.metal, 8); roller.rotation.z = Math.PI / 2; }
  blockers.push({ minX: -17.6, maxX: -12.8, minZ: 13, maxZ: 43 });
  const agents: { position: Position; angle: number; female: boolean; colors: Record<string, string> }[] = [];
  for (let i = 0; i < 6; i++) {
    const z = 16 + i * 4.4;
    r.box(group, [1.1, 1.05, 2], [-13.4, .53, z], desk);
    r.box(group, [1.2, .05, 2.1], [-13.4, 1.08, z], top);
    r.box(group, [.05, .32, .5], [-13.9, 1.3, z - .3], r.mat.black);
    // Counter screen: flight, destination and counter number.
    const plate = counterScreen(k, group, i + 3, [-13.1, 2.7, z]); plate.rotation.y = Math.PI / 2;
    r.box(group, [.06, .9, .06], [-13.16, 3.3, z], k.r.mat.metal);
    // Baggage scale feeding an inclined belt into the collector.
    r.box(group, [.95, .22, .8], [-12.35, .11, z + 1.3], r.mat.metal);
    r.box(group, [.9, .03, .75], [-12.35, .235, z + 1.3], belt);
    const injector = r.box(group, [2.4, .1, .78], [-14.1, .45, z + 1.3], belt); injector.rotation.z = -.14;
    r.box(group, [.25, .12, .03], [-12.05, .9, z + .75], color(k, 'scale-display', '#18242c', { emissive: '#2a9d6c', emissiveIntensity: .5 }));
    agents.push({ position: [-14.1, 0, z], angle: Math.PI / 2, female: i % 2 === 0, colors: { shirt: '#f2f2ef', dress: '#0d5f7e', scarf: '#0d5f7e', trousers: '#1d2b36' } });
  }
  // A second island for other airlines.
  r.box(group, [.4, 3.4, 30], [17.3, 1.7, 28], color(k, 'island-grey', '#59636b'));
  for (let i = 0; i < 6; i++) {
    const z = 16 + i * 4.4;
    r.box(group, [1.1, 1.05, 2], [13.4, .53, z], desk); r.box(group, [1.2, .05, 2.1], [13.4, 1.08, z], top);
    agents.push({ position: [14.1, 0, z], angle: -Math.PI / 2, female: i % 2 === 1, colors: { shirt: '#ffffff', dress: '#7a2f3a', scarf: '#7a2f3a', trousers: '#2b2f36' } });
  }
  blockers.push({ minX: 12.8, maxX: 17.6, minZ: 13, maxZ: 43 });
  const other = textPlate(k, group, 'CHECK-IN · MASKAPAI LAIN', [13.05, 3.7, 27], 12, '#ffffff', '#3b434a'); other.rotation.y = -Math.PI / 2;
  // Serpentine queue and the travellers waiting in it.
  stanchions(k, group, -10.5, -4.5, 15, 41, 4, color(k, 'queue-tape', '#0d5f7e'));
  const travellers: { position: Position; angle: number }[] = [];
  for (let i = 0; i < 9; i++) travellers.push({ position: [-9.75 + (i % 4) * 1.5, 0, 17 + i * 2.6], angle: i % 2 ? 0 : Math.PI });
  for (const t of travellers.slice(0, 7)) luggage(k, group, [t.position[0] + .35, 0, t.position[2] + .3], .9, i2c(k, t.position[2]));
  const people = new StandingPeople(r, [...agents, ...travellers]); group.add(people.group);
  // Self check-in kiosks near the entrance.
  for (let x = -6; x <= 6; x += 2.4) {
    r.box(group, [.7, 1.5, .5], [x, .75, 48], desk);
    r.box(group, [.55, .4, .03], [x, 1.32, 47.73], color(k, 'kiosk-screen', '#1a3a52', { emissive: '#2a6d94', emissiveIntensity: .7 }));
    blockers.push({ minX: x - .45, maxX: x + .45, minZ: 47.6, maxZ: 48.4 });
  }
  wayfinding(k, group, 'KEBERANGKATAN INTERNASIONAL', 'International departure · Check-in', [0, 6.2, 44], 12);
  wayfinding(k, group, 'Pemeriksaan awal  ·  Pintu masuk', 'Semua tas melewati mesin X-ray', [24, 3.4, 58], 6);
  // Entrance screening lane just inside the doors.
  xray(k, group, 24, 54, 'z');
  blockers.push({ minX: 22.8, maxX: 25.2, minZ: 50, maxZ: 58 });
  // Learner props: suitcase on a trolley, passport and boarding pass at counter 6.
  trolley(k, group, [-10.9, 0, COUNTER_Z - 1.1], .3);
  const bag = dynamicGroup(group); luggage(k, bag, [0, 0, 0], 1.05, color(k, 'own-bag', '#1d6a52', { roughness: .45, metalness: .1 }));
  const tag = r.box(dynamicGroup(bag), [.12, .2, .01], [.1, .75, .16], color(k, 'bag-tag', '#f4d03f'));
  const doc = dynamicGroup(group); passport(k, doc);
  const pass = dynamicGroup(group); boardingPass(k, pass);
  const scaleReading = screen(k, group, [-12.04, .9, COUNTER_Z + .74], [.24, .11], [
    (c, w, h) => { c.fillStyle = '#10181c'; c.fillRect(0, 0, w, h); c.fillStyle = '#3fe08d'; c.font = 'bold 120px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('0.0', w / 2, h / 2); },
    (c, w, h) => { c.fillStyle = '#10181c'; c.fillRect(0, 0, w, h); c.fillStyle = '#3fe08d'; c.font = 'bold 120px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('18.4 kg', w / 2, h / 2); },
  ], Math.PI / 2, 256);
  const since = stepClock();
  const onTrolley = new T.Vector3(-10.85, .36, COUNTER_Z - .95), onScale = new T.Vector3(-12.35, .25, COUNTER_Z + 1.3), intoBelt = new T.Vector3(-15.6, .78, COUNTER_Z + 1.3);
  animators.push((frame) => {
    const s = steps(frame, chapter);
    const weighed = since(frame, chapter, 3);
    if (weighed < 0) bag.position.copy(onTrolley);
    else if (weighed < 1.2) bag.position.lerpVectors(onTrolley, onScale, ease(weighed / 1.2)).setY(T.MathUtils.lerp(onTrolley.y, onScale.y, ease(weighed / 1.2)) + Math.sin(Math.min(1, weighed / 1.2) * Math.PI) * .35);
    else if (weighed < 3.2) bag.position.copy(onScale);
    else bag.position.lerpVectors(onScale, intoBelt, ease((weighed - 3.2) / 2.2));
    bag.rotation.y = weighed > 3.2 ? Math.PI / 2 : .2;
    bag.visible = weighed < 5.4 || frame.chapter !== chapter;
    if (frame.chapter !== chapter && frame.chapter !== undefined) bag.visible = false;
    tag.visible = weighed > 2.2;
    scaleReading.show(weighed > 1.3 && weighed < 3.4 ? 1 : 0);
    doc.visible = s >= 2 && frame.chapter === chapter;
    doc.position.set(s >= 4 ? -12.98 : -13.3, 1.115, COUNTER_Z + (s >= 4 ? -.15 : -.05));
    doc.rotation.y = s >= 4 ? .3 : 1.2;
    pass.visible = s >= 4 && frame.chapter === chapter;
    pass.position.set(-12.96, 1.12, COUNTER_Z + .18); pass.rotation.y = Math.PI / 2 + .15;
  });
}
function i2c(k: Kit, z: number): T.MeshStandardMaterial {
  const palette = ['#2d3a4a', '#7b2e2e', '#2f5d50', '#4a4a4a', '#6a5236'];
  return color(k, 'bag-' + Math.abs(Math.round(z)) % 5, palette[Math.abs(Math.round(z)) % 5], { roughness: .5 });
}

/**
 * An original, stylised bird emblem in the airline's blue and teal. It is a simplified
 * illustration for learning, not a reproduction of the registered logo.
 */
function drawEmblem(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
  const g = ctx.createLinearGradient(cx - size, cy + size, cx + size, cy - size);
  g.addColorStop(0, '#005b86'); g.addColorStop(.55, '#0093a8'); g.addColorStop(1, '#6cc9d1');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  // Five sweeping feathers rising to the right.
  for (let i = 0; i < 5; i++) {
    const t = i / 4, w = size * (.95 - t * .38);
    ctx.beginPath();
    ctx.moveTo(cx - size * .62, cy + size * (.42 - t * .1));
    ctx.quadraticCurveTo(cx - size * .05, cy + size * (.3 - t * .42), cx - size * .62 + w * 1.25, cy - size * (.15 + t * .2));
    ctx.quadraticCurveTo(cx - size * .1, cy + size * (.12 - t * .4) + size * .14, cx - size * .62, cy + size * (.42 - t * .1) + size * .1);
    ctx.fill();
  }
}

function airlineFascia(k: Kit, parent: T.Object3D, at: Position, width: number): T.Mesh {
  const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 220;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Papan maskapai tidak tersedia.');
  ctx.fillStyle = '#0d5f7e'; ctx.fillRect(0, 0, 2048, 220);
  ctx.fillStyle = '#0a4f69'; ctx.fillRect(0, 196, 2048, 24);
  drawEmblem(ctx, 120, 108, 78);
  ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 600 104px Arial, sans-serif'; ctx.fillText('Garuda Indonesia', 230, 100);
  ctx.textAlign = 'right'; ctx.font = '600 66px Arial, sans-serif'; ctx.fillStyle = '#d7f1f4';
  ctx.fillText('CHECK-IN  ·  INTERNASIONAL', 1990, 104);
  const map = k.r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 8;
  const material = k.r.keep(new T.MeshStandardMaterial({ map, emissiveMap: map, emissive: '#ffffff', emissiveIntensity: .55, roughness: .5 }));
  material.userData.keepUV = true;
  const sign = k.r.mesh(parent, k.r.keep(new T.PlaneGeometry(width, width * 220 / 2048)), material, at); sign.castShadow = false;
  return sign;
}

function counterScreen(k: Kit, parent: T.Object3D, counter: number, at: Position): T.Mesh {
  const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 240;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Layar konter tidak tersedia.');
  ctx.fillStyle = '#0b2233'; ctx.fillRect(0, 0, 640, 240);
  drawEmblem(ctx, 70, 70, 44);
  ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff'; ctx.font = 'italic 600 44px Arial, sans-serif'; ctx.fillText('Garuda Indonesia', 130, 70);
  ctx.font = 'bold 58px Arial, sans-serif'; ctx.fillText('JEDDAH (JED)', 26, 160);
  ctx.textAlign = 'right'; ctx.fillStyle = '#f2c230'; ctx.font = 'bold 96px Arial, sans-serif'; ctx.fillText(String(counter), 616, 150);
  ctx.textAlign = 'left'; ctx.fillStyle = '#9fc0d2'; ctx.font = '30px Arial, sans-serif'; ctx.fillText('Ekonomi · Umroh', 26, 214);
  const map = k.r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 4;
  const material = k.r.keep(new T.MeshStandardMaterial({ map, emissiveMap: map, emissive: '#ffffff', emissiveIntensity: .7, roughness: .3 }));
  material.userData.keepUV = true;
  const plate = k.r.mesh(parent, k.r.keep(new T.PlaneGeometry(1.6, .6)), material, at); plate.castShadow = false;
  return plate;
}

/** X-ray tunnel with roller tables; `axis` is the belt direction. */
function xray(k: Kit, parent: T.Object3D, x: number, z: number, axis: 'z' | 'x' = 'z'): T.Group {
  const { r } = k, group = new T.Group(); group.position.set(x, 0, z); if (axis === 'x') group.rotation.y = Math.PI / 2;
  const body = color(k, 'xray-body', '#d9dcde', { roughness: .4, metalness: .2 });
  r.box(group, [1.5, 1.75, 3], [0, .88, 0], body);
  r.box(group, [1.0, .7, 3.05], [0, .95, 0], color(k, 'xray-tunnel', '#151719'));
  for (const end of [-1, 1]) for (let i = -3; i <= 3; i++) r.box(group, [.13, .66, .01], [i * .14, .97, end * 1.53], color(k, 'lead-curtain', '#2c2f31', { roughness: .95 }));
  r.box(group, [1.55, .2, 3.05], [0, 1.85, 0], color(k, 'xray-cap', '#1e5f7a'));
  for (const end of [-1, 1]) {
    r.box(group, [.85, .7, 2.6], [0, .35, end * 2.85], k.r.mat.metal);
    for (let i = 0; i < 13; i++) { const roller = r.cylinder(group, .045, .045, .8, [0, .72, end * (1.65 + i * .2)], k.r.mat.metal, 8); roller.rotation.z = Math.PI / 2; }
  }
  parent.add(group); return group;
}

function walkThrough(k: Kit, parent: T.Object3D, x: number, z: number): T.MeshStandardMaterial {
  const { r } = k, frame = color(k, 'arch', '#cfd3d6', { roughness: .4 });
  for (const side of [-1, 1]) r.box(parent, [.18, 2.25, .55], [x + side * .48, 1.12, z], frame);
  r.box(parent, [1.14, .22, .55], [x, 2.3, z], frame);
  const led = k.r.keep(new T.MeshStandardMaterial({ color: '#2a2a2a', emissive: '#3dff7a', emissiveIntensity: 0 }));
  const lamp = new T.Group(); lamp.userData.dynamic = true; parent.add(lamp);
  r.box(lamp, [.5, .06, .58], [x, 2.43, z], led);
  return led;
}

function immigration(k: Kit, group: T.Group, blockers: Rect[], animators: Animator[], departure: boolean, chapter: string): void {
  const { r } = k;
  const z = -6, facing = departure ? 0 : Math.PI;
  const booth = color(k, 'booth', '#dfe2e3', { roughness: .45 }), glassy = k.r.mat.glass;
  // Partition with signage between the zones.
  r.box(group, [36, 3.2, .25], [-28, 1.6, departure ? 6 : -18], color(k, 'partition', '#c9cdd0'));
  r.box(group, [36, 3.2, .25], [28, 1.6, departure ? 6 : -18], color(k, 'partition', '#c9cdd0'));
  blockers.push({ minX: -46, maxX: -10, minZ: (departure ? 6 : -18) - .3, maxZ: (departure ? 6 : -18) + .3 }, { minX: 10, maxX: 46, minZ: (departure ? 6 : -18) - .3, maxZ: (departure ? 6 : -18) + .3 });
  wayfinding(k, group, departure ? 'IMIGRASI · KEBERANGKATAN' : 'IMIGRASI · KEDATANGAN', departure ? 'Immigration · siapkan paspor dan boarding pass' : 'Immigration · siapkan paspor', [0, 5.4, departure ? 5.8 : -17.8], 11, departure ? 0 : Math.PI);
  const officers: { position: Position; angle: number }[] = [];
  for (const x of [-30, -25, -20, -15]) {
    r.box(group, [2.4, 1.15, 2.2], [x, .58, z], booth);
    r.box(group, [2.4, .9, .06], [x, 1.6, z + (departure ? 1.1 : -1.1)], glassy);
    r.box(group, [.42, .3, .03], [x - .6, 1.32, z + (departure ? 1.12 : -1.12)], color(k, 'booth-number', '#1f2c36', { emissive: '#3a7bd5', emissiveIntensity: .5 }));
    officers.push({ position: [x + .3, .56, z - (departure ? .55 : -.55)], angle: facing });
    blockers.push({ minX: x - 1.25, maxX: x + 1.25, minZ: z - 1.15, maxZ: z + 1.15 });
  }
  group.add(createSeatedPassengers(r, officers));
  wayfinding(k, group, 'AUTOGATE', 'Paspor elektronik · satu orang per pintu', [6, 3.6, z + (departure ? 2.6 : -2.6)], 7, departure ? 0 : Math.PI);
  // Automatic gates: side cabinets, passport reader, face camera and two pairs of glass doors.
  const cabinet = color(k, 'egate-cabinet', '#e9ecee', { roughness: .35, metalness: .15 });
  const doorGlass = k.r.keep(new T.MeshStandardMaterial({ color: '#9fc3cf', transparent: true, opacity: .45, roughness: .1, metalness: .2 }));
  const lanes: { front: T.Object3D[]; exit: T.Object3D[]; light: T.MeshStandardMaterial; screen: ReturnType<typeof screen> }[] = [];
  for (const x of [-3, 3, 9]) {
    for (const side of [-1, 1]) {
      r.box(group, [.32, 1.05, 2.6], [x + side * .62, .53, z], cabinet);
      blockers.push({ minX: x + side * .62 - .2, maxX: x + side * .62 + .2, minZ: z - 1.3, maxZ: z + 1.3 });
    }
    const near = departure ? 1 : -1;
    r.box(group, [.26, .03, .3], [x + .62, 1.07, z + near * .7], color(k, 'reader-pad', '#101418', { emissive: '#1b6fd1', emissiveIntensity: .45 }));
    r.cylinder(group, .04, .04, .9, [x + .62, 1.5, z + near * .2], k.r.mat.metal, 8);
    const panel = screen(k, group, [x + .62 - .2 * 0, 1.95, z + near * .2 + near * .02], [.3, .22], [
      (c, w, h) => { c.fillStyle = '#0d2238'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = 'bold 44px Arial'; c.textAlign = 'center'; c.fillText('Pindai paspor', w / 2, h * .42); c.font = '34px Arial'; c.fillText('Scan passport', w / 2, h * .72); },
      (c, w, h) => { c.fillStyle = '#0d2238'; c.fillRect(0, 0, w, h); c.strokeStyle = '#7fd4ff'; c.lineWidth = 8; c.beginPath(); c.arc(w / 2, h * .42, h * .22, 0, Math.PI * 2); c.stroke(); c.fillStyle = '#fff'; c.font = 'bold 36px Arial'; c.textAlign = 'center'; c.fillText('Lihat kamera', w / 2, h * .86); },
      (c, w, h) => { c.fillStyle = '#0f5a2c'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = 'bold 120px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('✓', w / 2, h * .4); c.font = 'bold 36px Arial'; c.fillText('Silakan lewat', w / 2, h * .8); },
    ], departure ? 0 : Math.PI, 384);
    r.box(group, [.12, .08, .06], [x + .62, 2.12, z + near * .2], k.r.mat.black);
    const light = k.r.keep(new T.MeshStandardMaterial({ color: '#202020', emissive: '#ff3b30', emissiveIntensity: 1.2 }));
    r.box(dynamicGroup(group), [.08, .08, .08], [x - .62, 1.12, z + near * 1.2], light);
    const doors = (offset: number) => [-1, 1].map((side) => {
      const pivot = dynamicGroup(group, [x + side * .46, 0, z + offset]);
      r.box(pivot, [.42, 1.15, .03], [-side * .21, .85, 0], doorGlass); return pivot;
    });
    lanes.push({ front: doors(near * 1.1), exit: doors(-near * 1.1), light, screen: panel });
  }
  // The learner uses the middle lane; a traveller ahead goes through first.
  const ahead = new StandingPeople(r, [{ position: [3, 0, z + 2.6], angle: departure ? Math.PI : 0, female: true }]);
  ahead.group.userData.dynamic = true; group.add(ahead.group);
  const book = dynamicGroup(group); passport(k, book);
  const since = stepClock(), lane = lanes[1];
  animators.push((frame) => {
    const s = steps(frame, chapter), active = frame.chapter === chapter;
    const queued = since(frame, chapter, 2), scanned = since(frame, chapter, 3), cleared = since(frame, chapter, 4);
    // Traveller ahead walks through the lane once the learner joins the queue.
    const walk = queued < 0 ? 0 : Math.min(1, queued / 3.2);
    const pz = z + 2.6 - walk * 6;
    ahead.pose(0, { position: [3, 0, departure ? pz : z - 2.6 + walk * 6], walking: walk > 0 && walk < 1, gait: frame.time * 4.5 });
    ahead.flush(); ahead.group.visible = walk < 1;
    const throughFront = walk > .2 && walk < .55, throughExit = walk > .5 && walk < .85;
    const frontOpen = throughFront || scanned >= 0, exitOpen = throughExit || cleared >= 0;
    lane.front.forEach((door, i) => { door.rotation.y = T.MathUtils.lerp(door.rotation.y, frontOpen ? (i ? -1.45 : 1.45) : 0, .12); });
    lane.exit.forEach((door, i) => { door.rotation.y = T.MathUtils.lerp(door.rotation.y, exitOpen ? (i ? -1.45 : 1.45) : 0, .12); });
    lane.light.emissive.set(cleared >= 0 || throughExit ? '#3dff7a' : '#ff3b30');
    lane.screen.show(cleared >= 0 ? 2 : scanned >= 0 ? 1 : 0);
    // Passport held ready, then laid on the reader.
    book.visible = active && s >= 1;
    if (scanned >= 0 && cleared < 0) { book.position.set(3.62, 1.1, z + (departure ? .7 : -.7)); book.rotation.set(0, 0, 0); }
    else { book.position.set(3.28, 1.22, z + (departure ? 3.45 : -3.45)); book.rotation.set(-.6, .25, 0); }
  });
}

function security(k: Kit, group: T.Group, blockers: Rect[], animators: Animator[], chapter: string): void {
  const { r } = k;
  wayfinding(k, group, 'PEMERIKSAAN KEAMANAN', 'Security check · tas, jaket, ikat pinggang, ponsel ke nampan', [-8, 5, -19.6], 11);
  const officers: { position: Position; angle: number; female: boolean; colors: Record<string, string> }[] = [];
  const uniform = { shirt: '#2f3b4a', trousers: '#1f2630', dress: '#2f3b4a', scarf: '#1f2630' };
  const leds: T.MeshStandardMaterial[] = [];
  for (const x of [-16, -8, 0]) {
    xray(k, group, x, -29, 'z');
    leds.push(walkThrough(k, group, x - 1.7, -29));
    r.box(group, [.8, .9, .6], [x + 1.45, .45, -28.6], color(k, 'monitor-desk', '#5b636a'));
    r.box(group, [.5, .34, .04], [x + 1.4, 1.15, -28.4], color(k, 'xray-monitor-off', '#121418'));
    officers.push({ position: [x + 1.5, 0, -27.8], angle: -Math.PI / 2 - .4, female: x === -8, colors: uniform });
    officers.push({ position: [x - 1.7, 0, -31], angle: 0, female: x !== -8, colors: uniform });
    blockers.push({ minX: x - .8, maxX: x + .8, minZ: -33.5, maxZ: -24.5 }, { minX: x + 1, maxX: x + 1.9, minZ: -29, maxZ: -28.2 });
    // Tray stack at the start of each belt.
    for (let i = 0; i < 6; i++) r.box(group, [.62, .07, .44], [x, .76 + i * .07, -25.6], color(k, 'tray', '#8a9096', { roughness: .6 }));
  }
  const people = new StandingPeople(r, officers); group.add(people.group);
  // Liquids and prohibited-items information stand.
  const stand = textPlate(k, group, 'Cairan maks. 100 ml per wadah', [-12.2, 1.6, -21.5], 2.1, '#1d2730', '#f5f1e6'); stand.rotation.y = .3;
  r.cylinder(group, .03, .03, 1.4, [-12.2, .7, -21.52], k.r.mat.metal, 8);
  // The learner's tray: backpack, phone and belt.
  const tray = dynamicGroup(group);
  r.box(tray, [.62, .07, .44], [0, 0, 0], color(k, 'own-tray', '#8a9096', { roughness: .6 }));
  const contents = dynamicGroup(tray);
  r.box(contents, [.36, .2, .24], [-.08, .14, 0], color(k, 'backpack', '#3c4b63', { roughness: .8 }));
  r.box(contents, [.08, .012, .15], [.2, .045, -.08], k.r.mat.black);
  const beltLoop = r.mesh(contents, k.r.keep(new T.TorusGeometry(.07, .012, 6, 18)), color(k, 'belt-leather', '#4a3426'), [.2, .05, .1]); beltLoop.rotation.x = Math.PI / 2;
  const monitor = screen(k, group, [-6.6, 1.15, -28.37], [.48, .32], [
    (c, w, h) => { c.fillStyle = '#05070a'; c.fillRect(0, 0, w, h); },
    (c, w, h) => {
      c.fillStyle = '#e9f0f4'; c.fillRect(0, 0, w, h);
      // False-colour X-ray image: organic orange, metal blue, mixed green.
      c.fillStyle = '#e8963a'; c.beginPath(); c.roundRect(w * .18, h * .2, w * .5, h * .58, 24); c.fill();
      c.fillStyle = '#3f7ac9'; c.fillRect(w * .7, h * .3, w * .1, h * .3);
      c.strokeStyle = '#3f7ac9'; c.lineWidth = 10; c.beginPath(); c.arc(w * .78, h * .75, h * .1, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#5fb36c'; c.fillRect(w * .28, h * .32, w * .22, h * .18);
    },
  ], 0, 384);
  const since = stepClock();
  animators.push((frame) => {
    const placed = since(frame, chapter, 1), scanned = since(frame, chapter, 2), walked = since(frame, chapter, 3), collected = since(frame, chapter, 4);
    const active = frame.chapter === chapter;
    tray.visible = active && placed >= 0;
    const zStart = -24.6, zEnd = -35;
    const zPos = scanned < 0 ? zStart : T.MathUtils.lerp(zStart, zEnd, ease(scanned / 5));
    tray.position.set(-8, .78, zPos);
    contents.visible = collected < .8;
    monitor.show(scanned > 1.6 && scanned < 4.4 ? 1 : 0);
    const led = leds[1];
    led.emissive.set('#3dff7a'); led.emissiveIntensity = walked >= 0 && walked < 2.5 ? 2.5 : .15;
  });
}

function concourse(k: Kit, group: T.Group, blockers: Rect[], animators: Animator[], names: Names, chapter: string, departure: boolean): void {
  const { r } = k;
  // Shopfronts along both sides, including the prayer room.
  const shops = departure ? ['DUTY FREE', 'KOPI NUSANTARA', 'BATIK & OLEH-OLEH', 'MUSALA', 'TOKO BUKU', 'APOTEK'] : ['MUSALA', 'TOILET', 'PENUKARAN UANG', 'SIM CARD', 'INFORMASI', 'KAFE'];
  shops.forEach((name, i) => {
    const side = i % 2 ? 1 : -1, z = -48 - Math.floor(i / 2) * 14;
    r.box(group, [8, 4.4, 12], [side * 41.5, 2.2, z], color(k, 'shop-' + i, ['#f5efe4', '#3d2f28', '#6b2f2b', '#1f5a4a', '#28405a', '#e9e9e9'][i], { roughness: .6 }));
    r.box(group, [.1, 3.2, 10.4], [side * 37.45, 1.7, z], k.r.mat.glass);
    const sign = textPlate(k, group, name, [side * 37.38, 4.05, z], 6, '#ffffff', name === 'MUSALA' ? '#1f6b4f' : '#2b3036'); sign.rotation.y = -side * Math.PI / 2;
    blockers.push({ minX: side > 0 ? 37.3 : -46, maxX: side > 0 ? 46 : -37.3, minZ: z - 6, maxZ: z + 6 });
  });
  // Moving walkways down the middle.
  for (const x of [-4, 4]) {
    r.box(group, [1.4, .12, 30], [x, .06, -62], color(k, 'travelator', '#30363b', { roughness: .7 }));
    for (const side of [-1, 1]) {
      r.box(group, [.12, .9, 30], [x + side * .8, .55, -62], k.r.mat.glass);
      r.box(group, [.1, .08, 30], [x + side * .8, 1.05, -62], color(k, 'handrail', '#1a1c1e'));
    }
    blockers.push({ minX: x - .9, maxX: x + .9, minZ: -77, maxZ: -47 });
  }
  // Departure board facing the arriving passengers.
  const board = departureBoard(k, group, [14, 4, -45], departure);
  r.box(group, [6.6, 3.9, .2], [14, 4, -45.12], k.r.mat.black);
  beam(k, group, [12, 6, -45.2], [12, 16, -45.2], .05); beam(k, group, [16, 6, -45.2], [16, 16, -45.2], .05);
  if (!departure) return;
  // Gate lounge: carpet, seat rows, podium and the apron window.
  const carpet = r.floor(group, 62, 28, color(k, 'gate-carpet', '#5d6b78', { roughness: 1 })); carpet.position.set(0, .01, -98);
  const seated: { position: Position; angle: number }[] = [];
  for (const z of [-88, -91.5, -95, -98.5]) for (const x of [-20, -11, 11, 20]) {
    bench(k, group, x, z, 6);
    blockers.push({ minX: x - 2, maxX: x + 2, minZ: z - .55, maxZ: z + .65 });
    for (let i = 0; i < 6; i++) if ((i * 7 + x + z) % 3 === 0) seated.push({ position: [x + (i - 2.5) * .63, .56, z], angle: Math.PI });
  }
  group.add(createSeatedPassengers(r, seated));
  r.box(group, [3, 1.1, .9], [0, .55, -106], color(k, 'podium', '#0d5f7e', { roughness: .45 }));
  r.box(group, [3.1, .05, 1], [0, 1.12, -106], color(k, 'podium-top', '#2c3238'));
  blockers.push({ minX: -1.6, maxX: 1.6, minZ: -106.5, maxZ: -105.5 });
  const gateStaff = new StandingPeople(r, [
    { position: [-.6, 0, -106.8], angle: 0, female: true, colors: { dress: '#0d5f7e', scarf: '#c27b3a', shirt: '#0d5f7e', trousers: '#173d4a' } },
    { position: [.8, 0, -106.8], angle: 0, female: false, colors: { shirt: '#0d5f7e', trousers: '#173d4a', dress: '#0d5f7e', scarf: '#173d4a' } },
  ]);
  group.add(gateStaff.group);
  const gateScreen = screen(k, group, [0, 3.4, -107.4], [3.2, 1.2], [
    (c, w, h) => gateCanvas(c, w, h, false),
    (c, w, h) => gateCanvas(c, w, h, true),
  ], 0, 768);
  r.box(group, [3.4, 1.4, .12], [0, 3.4, -107.5], k.r.mat.black);
  // Boarding e-gate to the jet bridge.
  r.box(group, [.4, 1.1, .6], [-4, .55, -107.2], color(k, 'egate-cabinet', '#e9ecee'));
  r.box(group, [1.8, 2.4, .2], [-4.9, 1.2, -111.8], color(k, 'bridge-door', '#41484f'));
  wayfinding(k, group, GATE_LABEL, 'Garuda Indonesia · JEDDAH (JED) · contoh', [-4.9, 3.1, -111.6], 4.4);
  // Apron outside: the aircraft at the gate, its jet bridge, vehicles and the airfield.
  const apron = r.floor(group, 400, 260, color(k, 'apron', names.desert ? '#b3aa9a' : '#9b9d9a', { roughness: .95 })); apron.position.set(0, -4.6, -250);
  for (let x = -60; x <= 60; x += 30) r.box(group, [.3, .02, 80], [x, -4.57, -175], color(k, 'apron-line', '#e8b52e'));
  addGarudaAircraft(k.r, group, [4, -4.6, -150], 1.667, Math.PI / 2);
  r.box(group, [3.2, 3, 32], [-17.5, -.2, -129], color(k, 'jetbridge', '#c8ccd0', { metalness: .3, roughness: .5 }));
  r.box(group, [3.3, 1.2, 30], [-17.5, .2, -129], k.r.mat.glass);
  r.cylinder(group, .5, .6, 4.6, [-17.5, -2.3, -138], k.r.mat.metal, 12);
  for (const [x, z] of [[20, -132], [-34, -150]]) {
    r.box(group, [2.2, 1.5, 3.6], [x, -3.85, z], color(k, 'tug', '#f0c419'));
    for (let i = 1; i <= 2; i++) r.box(group, [1.8, 1.1, 3], [x, -4.05, z + i * 3.8], color(k, 'baggage-cart', '#7f8a92'));
  }
  const since = stepClock();
  animators.push((frame) => {
    const s = steps(frame, chapter), boarding = s >= 3 || frame.chapter !== chapter;
    gateScreen.show(boarding && Math.floor(frame.time * 1.6) % 4 !== 3 ? 1 : boarding ? 0 : 0);
    if (s >= 3) gateScreen.show(Math.floor(frame.time * 1.6) % 4 === 3 ? 0 : 1);
    board.show(s >= 3 ? 1 : 0);
    void since;
  });
}

function gateCanvas(c: CanvasRenderingContext2D, w: number, h: number, boarding: boolean): void {
  c.fillStyle = '#0b1d2c'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#0d5f7e'; c.fillRect(0, 0, w, h * .26);
  c.fillStyle = '#fff'; c.font = `bold ${Math.round(h * .16)}px Arial`; c.textBaseline = 'middle';
  c.fillText(GATE_LABEL, w * .03, h * .13);
  c.textAlign = 'right'; c.fillText('Garuda Indonesia', w * .97, h * .13); c.textAlign = 'left';
  c.font = `bold ${Math.round(h * .2)}px Arial`; c.fillText('JEDDAH (JED)', w * .03, h * .45);
  c.font = `${Math.round(h * .11)}px Arial`; c.fillStyle = '#c9d6df'; c.fillText('Umroh · nomor penerbangan contoh', w * .03, h * .65);
  c.fillStyle = boarding ? '#2ecc71' : '#f2c230'; c.fillRect(w * .03, h * .76, w * .5, h * .18);
  c.fillStyle = '#0b1d2c'; c.font = `bold ${Math.round(h * .13)}px Arial`; c.fillText(boarding ? 'BOARDING' : 'MENUNGGU', w * .06, h * .85);
  c.fillStyle = '#fff'; c.textAlign = 'right'; c.font = `${Math.round(h * .1)}px Arial`; c.fillText(boarding ? 'Kelompok 3 dipersilakan' : 'Boarding segera dimulai', w * .97, h * .85);
}

function departureBoard(k: Kit, group: T.Group, at: Position, departure: boolean): ReturnType<typeof screen> {
  const rows = departure
    ? [['09.55', 'SINGAPURA', '3', 'Berangkat'], ['10.20', 'KUALA LUMPUR', '12', 'Tutup'], ['10.40', 'JEDDAH', '7', '#'], ['11.05', 'TOKYO', '15', 'Check-in'], ['11.30', 'MADINAH', '9', 'Check-in'], ['12.10', 'DENPASAR', 'D2', 'Jadwal']]
    : [['10.05', 'DOHA', '—', 'Mendarat'], ['10.35', 'JAKARTA', '—', 'Mendarat'], ['11.00', 'KAIRO', '—', 'Jadwal'], ['11.20', 'ISTANBUL', '—', 'Jadwal']];
  const draw = (boarding: boolean) => (c: CanvasRenderingContext2D, w: number, h: number) => {
    c.fillStyle = '#0a1622'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#f2c230'; c.font = `bold ${Math.round(h * .07)}px Arial`; c.textBaseline = 'middle';
    c.fillText(departure ? 'KEBERANGKATAN · DEPARTURES' : 'KEDATANGAN · ARRIVALS', w * .03, h * .07);
    c.fillStyle = '#7f94a5'; c.font = `${Math.round(h * .045)}px Arial`;
    ['Jam', 'Tujuan', 'Gerbang', 'Status'].forEach((label, i) => c.fillText(label, w * [.03, .2, .62, .76][i], h * .17));
    rows.forEach((row, n) => {
      const y = h * (.27 + n * .12);
      if (row[1] === 'JEDDAH') { c.fillStyle = 'rgba(242,194,48,.14)'; c.fillRect(0, y - h * .055, w, h * .11); }
      c.font = `bold ${Math.round(h * .06)}px Arial`;
      row.forEach((cell, i) => {
        const status = cell === '#' ? (boarding ? 'BOARDING' : 'Menunggu') : cell;
        c.fillStyle = i === 3 ? (status === 'BOARDING' ? '#2ecc71' : status === 'Tutup' ? '#ff6b5e' : '#ffffff') : '#ffffff';
        c.fillText(status, w * [.03, .2, .64, .76][i], y);
      });
    });
    c.fillStyle = '#7f94a5'; c.font = `${Math.round(h * .04)}px Arial`; c.fillText('Contoh tampilan untuk belajar · bukan jadwal sebenarnya', w * .03, h * .96);
  };
  return screen(k, group, at, [6.4, 3.6], [draw(false), draw(true)], 0, 1024);
}

function baggageClaim(k: Kit, group: T.Group, blockers: Rect[], animators: Animator[]): void {
  const { r } = k;
  const belt = color(k, 'carousel-belt', '#25282b', { roughness: .85 }), steel = k.r.mat.metal;
  const carousel = (cx: number, cz: number) => {
    r.box(group, [3, .5, 18], [cx, .25, cz], steel);
    for (const side of [-1, 1]) r.box(group, [1, .08, 18], [cx + side * 2, .5, cz], belt);
    for (const end of [-1, 1]) { const curve = r.cylinder(group, 2.5, 2.5, .08, [cx, .5, cz + end * 9], belt, 24); void curve; r.cylinder(group, 1.5, 1.5, .5, [cx, .25, cz + end * 9], steel, 20); }
    blockers.push({ minX: cx - 2.6, maxX: cx + 2.6, minZ: cz - 11.6, maxZ: cz + 11.6 });
    const bags = dynamicGroup(group);
    const items: T.Object3D[] = [];
    for (let i = 0; i < 12; i++) { const holder = new T.Group(); bags.add(holder); luggage(k, holder, [0, 0, 0], .9, i2c(k, i * 3)); holder.rotation.x = -Math.PI / 2 + .25; items.push(holder); }
    const loop = 2 * 18 + Math.PI * 2 * 2;
    animators.push((frame) => {
      items.forEach((item, i) => {
        const s = ((frame.time * .55 + i * loop / 12) % loop + loop) % loop;
        let x: number, z: number;
        if (s < 18) { x = cx + 2; z = cz - 9 + s; }
        else if (s < 18 + Math.PI * 2) { const a = (s - 18) / 2; x = cx + Math.cos(a) * 2; z = cz + 9 + Math.sin(a) * 2; }
        else if (s < 36 + Math.PI * 2) { x = cx - 2; z = cz + 9 - (s - 18 - Math.PI * 2); }
        else { const a = Math.PI + (s - 36 - Math.PI * 2) / 2; x = cx + Math.cos(a) * 2; z = cz - 9 + Math.sin(a) * 2; }
        item.position.set(x, .62, z);
      });
    });
    const sign = screen(k, group, [cx, 3.2, cz - 11], [2.4, .9], [(c, w, h) => {
      c.fillStyle = '#0a1622'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2c230'; c.font = `bold ${Math.round(h * .5)}px Arial`; c.textBaseline = 'middle'; c.fillText(cx < 0 ? '1' : '2', w * .06, h / 2);
      c.fillStyle = '#fff'; c.font = `bold ${Math.round(h * .22)}px Arial`; c.fillText('Garuda Indonesia', w * .26, h * .36); c.fillStyle = '#c9d6df'; c.font = `${Math.round(h * .18)}px Arial`; c.fillText('Bagasi tiba', w * .26, h * .68);
    }], 0, 512);
    void sign;
  };
  carousel(-12, 28); carousel(12, 28);
  wayfinding(k, group, 'PENGAMBILAN BAGASI', 'Baggage claim · periksa label koper', [0, 6, 14], 10, Math.PI);
  for (let x = -24; x <= 24; x += 6) if (Math.abs(x) > 4) trolley(k, group, [x, 0, 46], Math.PI);
  // Customs check before the exit.
  wayfinding(k, group, 'BEA CUKAI · CUSTOMS', 'Jalur hijau: tidak ada barang yang perlu dilaporkan', [0, 4.2, 52], 9, Math.PI);
}

export function createTerminalWorld(r: WorldResources, airport: 'cgk' | 'jed', mode: 'departure' | 'arrival'): UmrohWorld {
  const k = kit(r), group = new T.Group(), blockers: Rect[] = [], animators: Animator[] = [];
  const names = NAMES[airport], departure = mode === 'departure';
  group.name = `Bandara ${names.title} — ${departure ? 'keberangkatan' : 'kedatangan'}`;
  hall(k, group, blockers, names);
  r.sign(group, `${names.title} · ${names.code}`, departure ? `${names.subtitle} · Keberangkatan internasional` : `${names.subtitle} · Kedatangan internasional`, [0, 9.5, 62], 22);
  const lobbyChapter = airport === 'cgk' ? 'cgk' : 'jeddah_pulang';
  if (departure) {
    checkIn(k, group, blockers, animators, names, lobbyChapter);
    immigration(k, group, blockers, animators, true, 'cgk_imigrasi');
    security(k, group, blockers, animators, 'cgk_keamanan');
    concourse(k, group, blockers, animators, names, 'cgk_gate', true);
  } else {
    baggageClaim(k, group, blockers, animators);
    immigration(k, group, blockers, animators, false, '');
    concourse(k, group, blockers, animators, names, '', false);
    if (airport === 'jed') {
      wayfinding(k, group, 'HARAMAIN  →', 'Koneksi kereta di Terminal 1 · menuju Madinah', [30, 4.2, 56], 9, Math.PI);
      for (const x of [26, 29, 32, 35]) { r.box(group, [.42, 1, 1.4], [x, .5, 58], r.mat.metal); blockers.push({ minX: x - .3, maxX: x + .3, minZ: 57.1, maxZ: 58.9 }); }
    } else wayfinding(k, group, 'PENJEMPUTAN · TAKSI  →', 'Lanjutkan perjalanan pulang', [30, 4.2, 56], 9, Math.PI);
  }
  const counter: CameraPose = { position: [-8.6, 1.68, COUNTER_Z - 1.2], lookAt: [-13.3, 1.0, COUNTER_Z + .3] };
  const stations: Partial<Record<string, CameraPose>> = departure ? {
    cgk: counter, jeddah_pulang: counter,
    cgk_imigrasi: { position: [3.15, 1.68, -2.6], lookAt: [3.25, 1.25, -7] },
    cgk_keamanan: { position: [-6.4, 1.68, -22.4], lookAt: [-8.2, 1.0, -29] },
    cgk_gate: { position: [9, 1.68, -85.5], lookAt: [1.5, 2.4, -108] },
  } : {
    jeddah: { position: [-6.5, 1.68, 19], lookAt: [-12, .8, 28] },
    cgk_pulang: { position: [6.5, 1.68, 19], lookAt: [12, .8, 28] },
  };
  return {
    group, stations, spawn: departure ? [2, 1.68, 56] : [2, 1.68, 40], lookAt: departure ? [-6, 2.4, 30] : [0, 2.4, 20], overview: [36, 14, 60], indoor: true,
    bounds: { minX: -44.5, maxX: 44.5, minZ: departure ? -110 : -110, maxZ: 61 }, blockers,
    landmarks: departure ? [
      { id: 'airport-hall', label: 'Pintu masuk terminal', position: [2, 1.68, 56], lookAt: [-6, 2.4, 30] },
      { id: 'airport-checkin', label: 'Konter check-in Garuda', position: counter.position, lookAt: counter.lookAt },
      { id: 'airport-immigration', label: 'Imigrasi dan autogate', position: [3.15, 1.68, -1.2], lookAt: [3.25, 1.25, -7] },
      { id: 'airport-security', label: 'Pemeriksaan keamanan', position: [-6.4, 1.68, -21.5], lookAt: [-8.2, 1, -29] },
      { id: 'airport-board', label: 'Layar keberangkatan', position: [14, 1.68, -38], lookAt: [14, 3.6, -45] },
      { id: 'airport-gate', label: 'Ruang tunggu gerbang', position: [9, 1.68, -85.5], lookAt: [1.5, 2.4, -108] },
      { id: 'airport-aircraft', label: 'Pesawat di gerbang', position: [-2, 1.68, -110.5], lookAt: [4, 0, -150] },
    ] : [
      { id: 'airport-hall', label: 'Aula kedatangan', position: [2, 1.68, 40], lookAt: [0, 2.4, 20] },
      { id: 'airport-baggage', label: 'Ambil bagasi', position: [-6.5, 1.68, 19], lookAt: [-12, .8, 28] },
      { id: 'airport-immigration', label: 'Imigrasi kedatangan', position: [3, 1.68, -12], lookAt: [3, 1.2, -6] },
      { id: 'airport-next', label: airport === 'jed' ? 'Koneksi Haramain' : 'Penjemputan taksi', position: [24, 1.68, 50], lookAt: [30, 3.4, 56] },
    ],
    crowd: { kind: 'walk', count: 60, area: departure ? { minX: -26, maxX: 26, minZ: -80, maxZ: -48 } : { minX: -26, maxX: 26, minZ: 2, maxZ: 12 } },
    animate(frame) { for (const animate of animators) animate(frame); },
  };
}

/**
 * Gate e-scanner, the covered jet bridge and the cabin, joined at the forward left door.
 * The camera walks the whole way and sits down in 32A, the seat used during the flight.
 */
export function createBoardingWorld(r: WorldResources): UmrohWorld {
  const k = kit(r);
  const cabinWorld = createCabinWorld(r, 'jeddah', { boarding: true });
  const group = cabinWorld.group; group.name = 'Boarding Garuda Indonesia';
  const DOOR_Z = -18.9, bridgeEnd = -3.2, bridgeStart = -33;
  const panel = color(k, 'bridge-panel', '#d5d9dc', { roughness: .55, metalness: .2 });
  const floorMat = color(k, 'bridge-floor', '#4b5258', { roughness: .95 });
  const length = bridgeEnd - bridgeStart, mid = (bridgeEnd + bridgeStart) / 2;
  r.box(group, [length, .12, 2.7], [mid, -.06, DOOR_Z], floorMat);
  r.box(group, [length, .1, 2.9], [mid, 2.6, DOOR_Z], panel);
  for (const side of [-1, 1]) {
    r.box(group, [length, 2.6, .1], [mid, 1.3, DOOR_Z + side * 1.4], panel);
    for (let x = bridgeStart + 2; x < bridgeEnd - 1; x += 3) r.box(group, [1.6, .8, .12], [x, 1.55, DOOR_Z + side * 1.4], r.mat.glass);
    for (let x = bridgeStart; x < bridgeEnd; x += .9) r.box(group, [.06, 2.6, .14], [x, 1.3, DOOR_Z + side * 1.36], color(k, 'bridge-rib', '#bfc4c8'));
  }
  const light = color(k, 'bridge-light', '#fff7e6', { emissive: '#fff1d6', emissiveIntensity: 1.1 });
  for (let x = bridgeStart + 1.5; x < bridgeEnd; x += 3) r.box(group, [1.2, .03, .25], [x, 2.53, DOOR_Z], light);
  // Rubber canopy and the painted fuselage skin around the open door.
  const canopy = color(k, 'canopy', '#2a2d30', { roughness: 1 });
  for (const side of [-1, 1]) r.box(group, [.5, 2.7, .9], [-3.45, 1.3, DOOR_Z + side * 1.05], canopy);
  r.box(group, [.5, .5, 3], [-3.45, 2.45, DOOR_Z], canopy);
  const skinShape = new T.Shape(); skinShape.moveTo(-3, -.8); skinShape.lineTo(3, -.8); skinShape.lineTo(3, 3.6); skinShape.lineTo(-3, 3.6); skinShape.closePath();
  const hole = new T.Path(); hole.moveTo(-.55, 0); hole.lineTo(.55, 0); hole.lineTo(.55, 1.95); hole.quadraticCurveTo(.55, 2.1, .4, 2.1); hole.lineTo(-.4, 2.1); hole.quadraticCurveTo(-.55, 2.1, -.55, 1.95); hole.closePath();
  skinShape.holes.push(hole);
  const skin = r.mesh(group, r.keep(new T.ShapeGeometry(skinShape)), color(k, 'fuselage-skin', '#f4f5f5', { roughness: .3, metalness: .2, side: T.DoubleSide }), [-3.2, 0, DOOR_Z]);
  skin.rotation.y = -Math.PI / 2;
  // Gate end: e-gate scanner, gate agent and the window wall of the terminal.
  const gateFloor = r.floor(group, 14, 14, color(k, 'gate-carpet', '#5d6b78', { roughness: 1 })); gateFloor.position.set(-40, .005, DOOR_Z);
  for (const side of [-1, 1]) r.box(group, [14, 3.4, .2], [-40, 1.7, DOOR_Z + side * 7], r.mat.plaster);
  r.box(group, [.2, 3.4, 14], [-47, 1.7, DOOR_Z], r.mat.glass);
  r.box(group, [.2, 3.4, 5.2], [-33.1, 1.7, DOOR_Z - 4.4], r.mat.plaster); r.box(group, [.2, 3.4, 5.2], [-33.1, 1.7, DOOR_Z + 4.4], r.mat.plaster);
  r.box(group, [14, .2, 14], [-40, 3.5, DOOR_Z], r.mat.plaster);
  wayfinding(k, group, GATE_LABEL, 'Pindai boarding pass · lalu masuk garbarata', [-33.25, 2.75, DOOR_Z], 3.2, -Math.PI / 2);
  const cabinet = color(k, 'egate-cabinet', '#e9ecee', { roughness: .35 });
  for (const side of [-1, 1]) r.box(group, [1.2, 1.05, .28], [-39.4, .53, DOOR_Z + side * .62], cabinet);
  const pad = k.r.keep(new T.MeshStandardMaterial({ color: '#0f1418', emissive: '#1b6fd1', emissiveIntensity: .4 }));
  r.box(dynamicGroup(group), [.3, .03, .2], [-39.7, 1.07, DOOR_Z - .62], pad);
  const flaps = [-1, 1].map((side) => { const pivot = dynamicGroup(group, [-39, 0, DOOR_Z + side * .5]); r.box(pivot, [.03, .9, .44], [0, .85, -side * .22], k.r.mat.glass); return pivot; });
  r.box(group, [1, 1.1, .7], [-41.5, .55, DOOR_Z + 2.4], color(k, 'podium', '#0d5f7e'));
  const staff = new StandingPeople(r, [
    { position: [-41.2, 0, DOOR_Z + 1.6], angle: -Math.PI / 2 - .5, female: true, colors: { dress: '#0d5f7e', scarf: '#c27b3a', shirt: '#0d5f7e', trousers: '#173d4a' } },
    // Cabin crew greeting at the door.
    { position: [-1.75, 0, DOOR_Z - .55], angle: -Math.PI / 2 + .35, female: true, colors: { dress: '#106c78', scarf: '#c27b3a', shirt: '#106c78', trousers: '#173d4a' } },
  ]);
  staff.group.userData.dynamic = true; group.add(staff.group);
  // The apron below and a neighbouring aircraft through the bridge windows.
  const apron = r.floor(group, 500, 500, color(k, 'apron', '#9b9d9a', { roughness: .95 })); apron.position.set(-20, -4.87, -40);
  addGarudaAircraft(r, group, [-55, -4.87, -60], 1.667, 0);
  // The aircraft's own wing beyond the windows on the left side.
  const path: [number, Position, Position][] = [
    [0, [-45.5, 1.68, DOOR_Z], [-39, 1.3, DOOR_Z]],
    [.08, [-40.4, 1.68, DOOR_Z], [-39.6, .95, DOOR_Z - .5]],
    [.14, [-40.2, 1.68, DOOR_Z], [-39.6, .95, DOOR_Z - .5]],
    [.18, [-37.6, 1.68, DOOR_Z], [-20, 1.6, DOOR_Z]],
    [.44, [-6.2, 1.68, DOOR_Z], [-2, 1.6, DOOR_Z]],
    [.5, [-3.6, 1.68, DOOR_Z], [-1.75, 1.55, DOOR_Z - .5]],
    [.56, [-.3, 1.68, DOOR_Z + .3], [0, 1.6, -8]],
    [.84, [0, 1.68, CABIN_SEAT.z - .9], [0, 1.6, CABIN_SEAT.z + 6]],
    [.9, [0, 1.68, CABIN_SEAT.z], [-3, 1.2, CABIN_SEAT.z - .2]],
    [.95, [-1.4, 1.58, CABIN_SEAT.z + .05], [-3, 1.15, CABIN_SEAT.z - .6]],
    [1, cabinWorld.seat!.position, cabinWorld.seat!.lookAt],
  ];
  const lerp3 = (a: Position, b: Position, t: number): Position => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rail = (progress: number): CameraPose => {
    const p = Math.max(0, Math.min(1, progress));
    const i = Math.max(0, path.findIndex(([at]) => at > p) - 1), next = path[Math.min(path.length - 1, i + 1)], current = path[i];
    const t = next[0] === current[0] ? 1 : ease((p - current[0]) / (next[0] - current[0]));
    const position = lerp3(current[1], next[1], t), lookAt = lerp3(current[2], next[2], t);
    // A gentle step rhythm while walking.
    const walking = (p > .14 && p < .44) || (p > .56 && p < .84);
    if (walking) position[1] += Math.sin(p * 520) * .018;
    return { position, lookAt };
  };
  return {
    ...cabinWorld, group, rail, indoor: true,
    spawn: path[0][1], lookAt: path[0][2], overview: [-20, 9, -4],
    landmarks: [
      { id: 'boarding-gate', label: 'Pemindai boarding pass', position: [-42, 1.68, DOOR_Z + 1.5], lookAt: [-39.5, 1, DOOR_Z] },
      { id: 'boarding-bridge', label: 'Garbarata', position: [-30, 1.68, DOOR_Z], lookAt: [-3, 1.6, DOOR_Z] },
      { id: 'boarding-seat', label: 'Kursi 32A', position: cabinWorld.seat!.position, lookAt: cabinWorld.seat!.lookAt },
    ],
    animate(frame) {
      const p = frame.travel;
      pad.emissive.set(p > .07 && p < .16 ? '#2ecc71' : '#1b6fd1'); pad.emissiveIntensity = p > .07 && p < .16 ? 1.6 : .4;
      flaps.forEach((flap, i) => { flap.rotation.y = (p > .11 && p < .22 ? 1.4 : 0) * (i ? 1 : -1); });
      staff.pose(1, { arms: p > .44 && p < .56 ? [-.15, -1.2] : [-.05, -.05], forearms: p > .44 && p < .56 ? [-.4, -1.6] : undefined, headTurn: p > .44 && p < .56 ? -.3 : 0 });
      staff.flush();
    },
  };
}
