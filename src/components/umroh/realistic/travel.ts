import * as T from 'three';
import type { Position, UmrohWorld, WorldResources } from './types';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { createSeatedPassengers, StandingPeople } from './pilgrims';
import { animateAircraft, createGarudaAircraft, type AircraftParts } from './aircraft';
import { applyAttitude, createFlightEnvironment, flightTelemetry, updateTelemetry } from './flight-env';
import { getFlightState } from '../flight-profile';

function seat(r: WorldResources, parent: T.Object3D, x: number, z: number, fabric: T.Material) {
  r.box(parent, [.49, .12, .52], [x, .5, z], fabric);
  const back = r.box(parent, [.5, .75, .14], [x, .94, z + .25], fabric); back.rotation.x = -.08;
  r.sphere(parent, [.24, .16, .085], [x, 1.33, z + .29], fabric);
  r.box(parent, [.4, .08, .38], [x, .4, z], r.mat.metal);
  r.box(parent, [.065, .35, .065], [x, .21, z], r.mat.metal);
  for (const dx of [-.28, .28]) r.box(parent, [.065, .075, .45], [x + dx, .72, z + .02], r.mat.black);
  r.box(parent, [.21, .13, .015], [x, .98, z + .34], r.mat.black);
}

/** Window seat 32A, over the wing on the left side; the learner's own seat stays free. */
export const CABIN_SEAT = { x: -2.18, z: 1.92 } as const;
// Leaning slightly toward the window, as anyone in a window seat does.
const SEAT_EYE: Position = [CABIN_SEAT.x - .12, 1.3, CABIN_SEAT.z + .02];
const SEAT_VIEW: Position = [CABIN_SEAT.x - 1.4, 1.02, CABIN_SEAT.z - .95];

export function createCabinWorld(r: WorldResources, destination?: 'jeddah' | 'jakarta', options: { boarding?: boolean } = {}): UmrohWorld {
  const group = new T.Group(); group.name = 'Kabin penumpang Garuda Indonesia';
  const flying = Boolean(destination) && !options.boarding, boarding = Boolean(options.boarding);
  // Everything inside the fuselage lives in one group so the whole cabin can pitch and bank.
  const cabin = new T.Group(); cabin.name = 'Kabin'; group.add(cabin);
  const blue = r.keep(new T.MeshStandardMaterial({ color: '#263d62', roughness: .89 }));
  const shell = r.keep(new T.MeshStandardMaterial({ color: '#9aa5ad', roughness: .65 }));
  const ivory = r.keep(new T.MeshStandardMaterial({ color: '#f2f0e9', roughness: .83, side: T.DoubleSide }));
  const softGrey = r.keep(new T.MeshStandardMaterial({ color: '#d4d8d8', roughness: .72 }));
  const trim = r.keep(new T.MeshStandardMaterial({ color: '#555e67', roughness: .66 }));
  const batik = cabinBatikMaterial(r);
  const carpet = r.keep(r.mat.carpet.clone()); carpet.color.set('#353e50');
  const rounded = r.keep(new RoundedBoxGeometry(1, 1, 1, 1, .075));
  const cushioned = (size: Position, at: Position, material: T.Material) => { const mesh = r.mesh(cabin, rounded, material, at); mesh.scale.set(...size); return mesh; };
  r.floor(cabin, 6.25, 42, carpet);
  // Aisle runner and floor-path lighting strips.
  r.box(cabin, [.62, .006, 40], [0, .004, 0], r.keep(new T.MeshStandardMaterial({ color: '#2b3344', roughness: 1 })));
  const pathLight = r.keep(new T.MeshStandardMaterial({ color: '#ffe6b0', emissive: '#ffd27a', emissiveIntensity: .7 }));
  for (const x of [-.34, .34]) r.box(cabin, [.02, .012, 38], [x, .01, 0], pathLight);
  const windowShape = new T.Shape();
  windowShape.moveTo(-.75, 0); windowShape.lineTo(.75, 0); windowShape.lineTo(.75, .92); windowShape.lineTo(-.75, .92); windowShape.closePath();
  const opening = new T.Path(); opening.absellipse(0, .43, .23, .32, 0, Math.PI * 2, true); windowShape.holes.push(opening);
  const windowBay = r.keep(new T.ExtrudeGeometry(windowShape, { depth: .13, bevelEnabled: false, curveSegments: 24 }));
  const pane = r.keep(new T.MeshStandardMaterial({ color: '#b2d8ed', roughness: .09, transparent: Boolean(destination), opacity: destination ? .08 : .8, side: T.DoubleSide }));
  const lightMat = r.keep(new T.MeshStandardMaterial({ color: '#fff4e3', emissive: '#fff0dc', emissiveIntensity: 1.4 }));
  const screen = r.keep(new T.MeshStandardMaterial({ color: '#122942', emissive: '#173758', emissiveIntensity: .25, roughness: .3 }));
  const shade = r.keep(new T.MeshStandardMaterial({ color: '#e7e3d8', roughness: .8, side: T.DoubleSide }));
  const passengerSeats: { position: Position; angle: number }[] = [];
  const DOOR = { from: -19.45, to: -18.35 };
  const doorGap = (side: number) => boarding && side < 0;
  const wallRun = (side: number, size: [number, number], x: number, y: number) => {
    if (!doorGap(side)) { r.box(cabin, [size[0], size[1], 42], [x, y, 0], ivory); return; }
    r.box(cabin, [size[0], size[1], DOOR.from + 21], [x, y, (-21 + DOOR.from) / 2], ivory);
    r.box(cabin, [size[0], size[1], 21 - DOOR.to], [x, y, (DOOR.to + 21) / 2], ivory);
  };
  // Windows sit at seated eye height (~1.2 m), as on real airliners; standing passengers look down to them.
  const SILL = .95;
  for (const side of [-1, 1]) {
    wallRun(side, [.18, SILL], side * 3.05, SILL / 2);
    r.box(cabin, [.18, .04, 42], [side * 2.95, SILL, 0], softGrey);
    wallRun(side, [.12, 2.3 - SILL - .9], side * 3.0, (SILL + .9 + 2.3) / 2);
    r.box(cabin, [.35, .16, 42], [side * 2.89, 2.3, 0], ivory);
    // Angled luggage bins have individual doors and recessed handles.
    for (let z = -18.75; z < 20; z += 2.5) {
      const bin = cushioned([1.03, .49, 2.47], [side * 2.45, 2.69, z], ivory); bin.rotation.z = side * .14;
      r.box(cabin, [.045, .038, .2], [side * 1.93, 2.58, z], trim);
      r.box(cabin, [.022, .012, 2.47], [side * 1.94, 2.52, z], softGrey);
      // Seat-row numbers under the bins.
      r.box(cabin, [.012, .05, .08], [side * 1.94, 2.47, z + .9], trim);
    }
    r.box(cabin, [.11, .02, 40], [side * 2.86, 2.43, 0], lightMat);
    for (let z = -18; z <= 18; z += 1.5) {
      if (doorGap(side) && z < -17) {
        // Door surround in place of the first window.
        r.box(cabin, [.2, 2.12, .1], [side * 3.0, 1.06, DOOR.from - .05], softGrey);
        r.box(cabin, [.2, 2.12, .1], [side * 3.0, 1.06, DOOR.to + .05], softGrey);
        r.box(cabin, [.2, .14, 1.3], [side * 3.0, 2.1, (DOOR.from + DOOR.to) / 2], softGrey);
        r.box(cabin, [.2, .2, .55], [side * 3.0, 2.24, DOOR.to + .4], ivory);
        continue;
      }
      const wall = r.mesh(cabin, windowBay, ivory, [side * 2.98, SILL, z]); wall.rotation.y = side * Math.PI / 2;
      const frame = r.mesh(cabin, new T.TorusGeometry(.29, .025, 8, 32), softGrey, [side * 2.96, SILL + .43, z]); frame.rotation.y = Math.PI / 2; frame.scale.set(.82, 1.16, 1);
      r.sphere(cabin, [.025, .3, .21], [side * 2.99, SILL + .43, z], pane);
      r.box(cabin, [.025, .035, .1], [side * 2.93, SILL + .735, z], ivory);
      // A few blinds are half drawn, as on any long flight (never the learner's own window).
      const blind = (Math.round(z / 1.5) * 7 + side * 3) % 5;
      const ownWindow = side < 0 && Math.abs(z - CABIN_SEAT.z) < 1;
      if (!ownWindow && (blind === 0 || blind === 3)) r.box(cabin, [.012, blind ? .26 : .5, .44], [side * 2.945, SILL + (blind ? .63 : .52), z], shade);
    }
    for (const z of [-19.875, 19.875]) if (!(doorGap(side) && z < 0)) r.box(cabin, [.13, .92, 2.25], [side * 3.045, 1.76, z], ivory);
    let row = 0;
    for (let z = -16; z <= 16; z += 1.12, row++) for (const [column, x] of [1.02, 1.6, 2.18].entries()) {
      const sx = side * x;
      cushioned([.5, .12, .53], [sx, .5, z], blue);
      const backShell = cushioned([.52, .75, .13], [sx, .94, z + .28], shell); backShell.rotation.x = -.09;
      const back = cushioned([.47, .71, .1], [sx, .95, z + .205], blue); back.rotation.x = -.09;
      cushioned([.4, .25, .14], [sx, 1.26, z + .285], blue);
      r.box(cabin, [.29, .2, .019], [sx, 1.285, z + .365], batik);
      r.box(cabin, [.41, .07, .4], [sx, .4, z], trim);
      for (const dx of [-.17, .17]) r.box(cabin, [.035, .34, .06], [sx + dx, .2, z + .1], r.mat.metal);
      for (const dx of [-.275, .275]) cushioned([.055, .06, .46], [sx + dx, .73, z], trim);
      r.box(cabin, [.3, .21, .025], [sx, 1.06, z + .365], trim);
      r.box(cabin, [.265, .17, .026], [sx, 1.065, z + .381], screen);
      r.box(cabin, [.31, .21, .025], [sx, .77, z + .36], softGrey);
      r.box(cabin, [.035, .022, .027], [sx, .865, z + .379], trim);
      // Seat-belt buckles resting on each cushion.
      r.box(cabin, [.07, .012, .05], [sx, .57, z - .02], r.mat.metal);
      const own = side < 0 && column === 2 && Math.abs(z - CABIN_SEAT.z) < .01;
      // Vary occupancy, leaving some free seats and a clear aisle. Nearby
      // passengers are included so heads, shoulders and hands read at eye level.
      if (destination && !own && (column === (row + (side > 0 ? 1 : 0)) % 3 || (row >= 13 && row <= 27 && column === (row + 1 + (side > 0 ? 1 : 0)) % 3))) passengerSeats.push({ position: [sx, .56, z], angle: Math.PI });
    }
  }
  if (passengerSeats.length) cabin.add(createSeatedPassengers(r, passengerSeats));
  // A continuous curved ceiling begins above the real window openings.
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const shoulder = Math.asin((2.22 - 1.55) / 1.9);
  for (let j = 0; j <= 1; j++) for (let i = 0; i <= 32; i++) {
    const theta = shoulder + i / 32 * (Math.PI - shoulder * 2);
    positions.push(Math.cos(theta) * 3.12, 1.55 + Math.sin(theta) * 1.9, j ? 21 : -21); uvs.push(i / 32, j);
  }
  for (let i = 0; i < 32; i++) { const a = i, b = i + 33; indices.push(a, b, a + 1, b, b + 1, a + 1); }
  const roof = new T.BufferGeometry(); roof.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); roof.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2)); roof.setIndex(indices); roof.computeVertexNormals(); r.mesh(cabin, roof, ivory);
  for (const x of [-.82, .82]) r.box(cabin, [.11, .025, 39], [x, 3.25, 0], lightMat);
  // Passenger service units: reading lights, air vents and the seat-belt / no-smoking signs.
  const signs = flying || boarding ? seatbeltSignMaterial(r) : null;
  for (let z = -18; z <= 18; z += 1.12) for (const x of [-1.5, 1.5]) {
    r.box(cabin, [.43, .03, .31], [x, 3.01, z], softGrey);
    for (const dx of [-.11, .11]) { const vent = r.cylinder(cabin, .035, .035, .025, [x + dx, 2.985, z], trim, 10); vent.rotation.x = Math.PI; }
    if (signs && Math.round((z + 18) / 1.12) % 3 === 0) { const sign = r.box(cabin, [.16, .006, .08], [x, 2.992, z + .12], signs); sign.castShadow = false; }
  }
  // Closed bulkheads at both ends keep the sky outside the passenger cabin.
  for (const end of [-1, 1]) {
    r.box(cabin, [6.25, 3.5, .2], [0, 1.75, end * 20], ivory);
    r.box(cabin, [.82, 2.05, .23], [0, 1.025, end * 19.85], trim);
    r.box(cabin, [.065, .17, .04], [.25, 1, end * 19.715], r.mat.metal);
    for (const side of [-1, 1]) {
      r.box(cabin, [1.25, 2.15, .4], [side * 2.04, 1.08, end * 19.6], softGrey);
      for (let y = .4; y < 2; y += .44) r.box(cabin, [1.08, .025, .015], [side * 2.04, y, end * 19.39], trim);
    }
    // A batik panel on each bulkhead.
    r.box(cabin, [1.8, .9, .02], [0, 2.6, end * 19.88], batik);
  }
  if (signs) { const big = r.box(cabin, [.5, .25, .02], [-1.25, 2.55, -19.86], signs); big.castShadow = false; }
  r.sign(cabin, destination ? 'GARUDA INDONESIA' : 'BERSIAP SEBELUM MIQAT', destination ? destination === 'jeddah' ? 'Jakarta → Jeddah' : 'Jeddah → Jakarta' : 'Ikuti pengumuman awak pesawat', [0, 2.65, -19.7], 2.8);

  const world: UmrohWorld = { group, spawn: [0, 1.63, 11], lookAt: [0, 1.61, -10], overview: [0, 2.05, 18], indoor: true,
    bounds: { minX: -.5, maxX: .5, minZ: -18.5, maxZ: 18.5 }, blockers: [],
    seat: { position: SEAT_EYE, lookAt: SEAT_VIEW },
    landmarks: [{ id: 'cabin-front', label: 'Depan kabin', position: [0, 1.63, -15], lookAt: [0, 1.55, 14] }, { id: 'cabin-aisle', label: 'Kabin dan penumpang', position: [0, 1.63, 12], lookAt: [0, 1.6, -12] }] };
  if (destination && !boarding) Object.assign(world, flightCabin(r, group, cabin, destination, lightMat, signs));
  return world;
}

/** Wing, crew, signs and the moving sky outside the windows for a flying cabin. */
function flightCabin(r: WorldResources, group: T.Group, cabin: T.Group, destination: 'jeddah' | 'jakarta', lightMat: T.MeshStandardMaterial, signs: T.MeshStandardMaterial | null): Partial<UmrohWorld> {
  cabin.userData.dynamic = true;
  // The real wing and engines sit outside the fuselage, visible from the over-wing seats.
  // The wing box passes under the cabin floor, so from a window seat the wing is seen from above.
  const wings = createGarudaAircraft(r, { wingsOnly: true, animated: true }); wings.position.y = .2;
  cabin.userData.baseY = -1.2;
  const parts = wings.userData.parts as AircraftParts;
  delete wings.userData.dynamic; cabin.add(wings);
  // Two crew members give the safety briefing in the aisle before take-off.
  const uniform = { dress: '#106c78', scarf: '#c27b3a', shirt: '#106c78', trousers: '#173d4a' };
  const crew = new StandingPeople(r, [
    { position: [0, 0, -6.6], angle: 0, female: true, colors: uniform },
    { position: [0, 0, 8.4], angle: Math.PI, female: false, colors: uniform },
  ]);
  crew.group.userData.dynamic = true; cabin.add(crew.group);
  const env = createFlightEnvironment(r, destination); group.add(env.group);
  const telemetry = flightTelemetry(env);
  return {
    vehicle: cabin, telemetry,
    landmarks: [
      { id: 'cabin-window', label: 'Jendela kursi 32A', position: SEAT_EYE, lookAt: SEAT_VIEW },
      { id: 'cabin-wing', label: 'Sayap dan mesin', position: SEAT_EYE, lookAt: [CABIN_SEAT.x - 6, .2, CABIN_SEAT.z - 1] },
      { id: 'cabin-aisle', label: 'Lorong kabin', position: SEAT_EYE, lookAt: [0, 1.5, -12] },
    ],
    animate(frame) {
      const state = getFlightState(frame.travel);
      env.update(frame, state); updateTelemetry(telemetry, state);
      applyAttitude(cabin, state, frame);
      animateAircraft(parts, {
        gear: state.gearDown ? 1 : 0, flaps: state.flaps, spoilers: state.spoilers, thrust: state.thrust,
        landingLights: state.altitude < 3000 && (state.phase.id !== 'cruise'), contrail: 0,
      }, frame.time, frame.delta);
      lightMat.emissiveIntensity = state.cabinDim ? .35 : 1.4;
      if (signs) signs.emissiveIntensity = state.seatbelt ? 1.6 : .05;
      // Safety demonstration: point to the exits, show the belt, then walk away.
      const briefing = state.phase.id === 'pushback' || state.phase.id === 'taxi';
      crew.group.visible = briefing || state.phase.id === 'cruise';
      const beat = Math.floor(frame.time / 2.2) % 4, cruise = state.phase.id === 'cruise';
      for (let i = 0; i < 2; i++) {
        const arms: [number, number] = cruise || frame.reducedMotion ? [-.05, -.05] : beat === 0 ? [-1.5, -.05] : beat === 1 ? [-.05, -1.5] : beat === 2 ? [-.9, -.9] : [-2.6, -2.6];
        const z = cruise ? (i ? 12 - state.local * 20 : -10 + state.local * 18) : i ? 8.4 : -6.6;
        crew.pose(i, { arms, forearms: beat === 2 && !cruise ? [-1.2, -1.2] : undefined, position: [0, 0, z], angle: cruise ? (i ? Math.PI : 0) : i ? Math.PI : 0, walking: cruise && frame.running, gait: frame.time * 4 });
      }
      crew.flush();
    },
  };
}

function seatbeltSignMaterial(r: WorldResources): T.MeshStandardMaterial {
  const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Tanda sabuk tidak tersedia.');
  ctx.fillStyle = '#20262c'; ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#fff3d6'; ctx.fillStyle = '#fff3d6'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  // Seat-belt pictogram.
  ctx.beginPath(); ctx.arc(64, 34, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(64, 50); ctx.lineTo(64, 84); ctx.lineTo(86, 84); ctx.lineTo(90, 108); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40, 72); ctx.lineTo(90, 72); ctx.stroke();
  // No-smoking pictogram.
  ctx.beginPath(); ctx.arc(190, 64, 40, 0, Math.PI * 2); ctx.stroke();
  ctx.fillRect(160, 58, 52, 12);
  ctx.beginPath(); ctx.moveTo(162, 36); ctx.lineTo(218, 92); ctx.stroke();
  const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace;
  const material = r.keep(new T.MeshStandardMaterial({ map, emissiveMap: map, emissive: '#ffffff', emissiveIntensity: 1.6, roughness: .5 }));
  material.userData.keepUV = true; return material;
}

/** An original batik-inspired kawung pattern for headrest covers and bulkheads. */
function cabinBatikMaterial(r: WorldResources): T.MeshStandardMaterial {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Motif kabin tidak tersedia.');
  ctx.fillStyle = '#efe9dc'; ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 64) for (let x = 0; x < 256; x += 64) for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2 + Math.PI / 4;
    ctx.fillStyle = (x + y) % 128 ? '#2d6d79' : '#9a6a3a';
    ctx.beginPath(); ctx.ellipse(x + 32 + Math.cos(a) * 14, y + 32 + Math.sin(a) * 14, 13, 7, a, 0, Math.PI * 2); ctx.fill();
  }
  const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; map.wrapS = map.wrapT = T.RepeatWrapping;
  const material = r.keep(new T.MeshStandardMaterial({ map, roughness: .9 })); material.userData.keepUV = true; return material;
}

export function createJourneyWorld(r: WorldResources, returning = false): UmrohWorld {
  const group = new T.Group();
  const scenery = new T.Group(); scenery.userData.dynamic = true; group.add(scenery);
  r.floor(scenery, 1500, 1500, r.mat.sand);
  r.box(scenery, [14, .03, 1200], [0, .02, -420], r.mat.asphalt);
  for (const x of [-6.5, 6.5]) r.box(scenery, [.12, .02, 1200], [x, .05, -420], r.mat.white);
  for (let z = 0; z > -800; z -= 12) r.box(scenery, [.15, .02, 5], [0, .055, z], r.mat.white);
  for (let side = -1; side <= 1; side += 2) {
    const terrain = new T.PlaneGeometry(400, 1100, 48, 80); terrain.rotateX(-Math.PI / 2);
    const p = terrain.getAttribute('position');
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const ridge = Math.max(0, 1 - Math.abs(x / 210));
      const folds = Math.sin(x * .031 + z * .019) * .45 + Math.cos(z * .025 - x * .04) * .3 + Math.sin(z * .081 + x * .059) * .12;
      p.setY(i, Math.max(0, (folds + .48) * 115 * ridge));
    }
    terrain.computeVertexNormals();
    const rock = r.keep(new T.MeshStandardMaterial({ color: side > 0 ? '#8c7963' : '#a18b6f', roughness: 1 }));
    r.mesh(scenery, terrain, rock, [side * 255, -.1, -430]);
  }
  // Bus interior opens onto a long desert highway through the windscreen.
  r.box(group, [2.6, .14, 8], [0, .15, 1], r.mat.darkStone);
  r.box(group, [2.7, .17, 8.2], [0, 2.65, 1], r.mat.plaster);
  for (const side of [-1, 1]) {
    r.box(group, [.13, .9, 8], [side * 1.3, .65, 1], r.mat.plaster);
    for (let z = -2.5; z <= 4.5; z += 1.2) r.box(group, [.08, 1.5, .1], [side * 1.3, 1.8, z], r.mat.black);
  }
  const upholstery = r.keep(new T.MeshStandardMaterial({ color: '#504a40', roughness: .92 }));
  for (let z = 0; z < 4; z += 1.1) for (const x of [-.76, .76]) seat(r, group, x, z, upholstery);
  r.box(group, [2.5, .35, .8], [0, .9, -2.8], r.mat.black);
  for (const x of [-1.25, 1.25]) r.box(group, [.12, 1.5, .18], [x, 1.85, -2.8], r.mat.black);
  const wheel = r.mesh(group, new T.TorusGeometry(.23, .025, 8, 24), r.mat.black, [-.73, 1.2, -2.45]); wheel.rotation.x = .6;
  r.sign(scenery, returning ? 'JEDDAH · KING ABDULAZIZ AIRPORT' : 'مكة المكرمة  ·  MAKKAH', returning ? 'Perjalanan pulang setelah umroh' : 'Perjalanan setelah miqat', [-5, 5, -70], 11);
  r.cylinder(scenery, .11, .11, 5, [-5, 2.5, -70], r.mat.metal);
  return { group, motion: { group: scenery, axis: 'z', distance: 240 }, spawn: [0, 1.9, -.6], lookAt: [0, 1.8, -80], overview: [7, 4, 8], indoor: true,
    bounds: { minX: -.34, maxX: .34, minZ: -1.6, maxZ: 4 }, blockers: [],
    landmarks: [{ id: 'bus-front', label: 'Pemandangan perjalanan', position: [0, 1.9, -1], lookAt: [0, 2, -80] }, { id: 'bus-aisle', label: 'Dalam bus', position: [0, 1.9, 3.6], lookAt: [0, 1.7, -5] }] };
}

export function createTahallulWorld(r: WorldResources): UmrohWorld {
  const group = new T.Group();
  r.floor(group, 18, 15);
  r.box(group, [18, 4, .22], [0, 2, -7], r.mat.plaster);
  for (const side of [-1, 1]) r.box(group, [.22, 4, 15], [side * 9, 2, 0], r.mat.plaster);
  r.box(group, [18, .2, 15], [0, 4.05, 0], r.mat.plaster);
  const mirror = r.keep(new T.MeshStandardMaterial({ color: '#8faaa7', metalness: .9, roughness: .13 }));
  const seatMat = r.keep(new T.MeshStandardMaterial({ color: '#3c3230', roughness: .55 }));
  for (const x of [-5, 0, 5]) {
    r.box(group, [3.4, 2, .12], [x, 2, -6.8], r.mat.darkGold);
    r.box(group, [3.16, 1.76, .14], [x, 2, -6.72], mirror);
    r.box(group, [3.7, .1, .7], [x, .9, -6.5], r.mat.darkStone);
    r.cylinder(group, .55, .55, .08, [x, .07, -4.4], r.mat.metal);
    r.cylinder(group, .12, .14, .5, [x, .34, -4.4], r.mat.metal);
    r.box(group, [.8, .17, .8], [x, .68, -4.4], seatMat);
    r.box(group, [.8, .85, .17], [x, 1.12, -4.74], seatMat);
    for (const side of [-1, 1]) r.box(group, [.1, .12, .7], [x + side * .48, .96, -4.4], seatMat);
    r.box(group, [.5, .06, .3], [x, .28, -3.85], r.mat.metal);
    for (let k = 0; k < 3; k++) r.box(group, [.4, .09, .3], [x - 1.1, 1 + k * .09, -6.4], r.mat.white);
    r.cylinder(group, .07, .07, .25, [x + .8, 1.07, -6.4], r.mat.white);
  }
  r.sign(group, 'TAHALLUL', 'Memendekkan atau mencukur rambut setelah sa’i', [0, 3.45, -6.7], 7);
  const lamp = r.keep(new T.MeshStandardMaterial({ color: '#fff4d8', emissive: '#fff0d1', emissiveIntensity: 1.2 }));
  for (const x of [-5, 0, 5]) r.box(group, [1.7, .04, .3], [x, 3.89, -2], lamp);
  return { group, spawn: [2.5, 1.67, 3], lookAt: [0, 1.2, -4.4], overview: [7, 3.5, 6], indoor: true,
    bounds: { minX: -8, maxX: 8, minZ: -2.9, maxZ: 6 }, blockers: [],
    landmarks: [{ id: 'haircut', label: 'Tempat tahallul', position: [1.7, 1.67, -1.7], lookAt: [0, 1.2, -4.4] }, { id: 'room', label: 'Lihat ruangan', position: [6.5, 1.67, 4.5], lookAt: [0, 1.6, -5] }] };
}
