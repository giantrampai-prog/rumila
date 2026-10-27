import * as T from 'three';
import type { Position, WorldResources } from './types';

/** Moving parts animated by flight state; each sits in a dynamic group so batching keeps it separate. */
export interface AircraftParts {
  fans: T.Object3D[];
  gear: { pivot: T.Object3D; axis: 'x' | 'z'; angle: number }[];
  flaps: { pivot: T.Object3D; side: number }[];
  spoilers: T.Object3D[];
  strobes: T.MeshStandardMaterial[];
  beacons: T.MeshStandardMaterial[];
  landingLights: T.Object3D[];
  contrails: T.Mesh[];
}
export interface AircraftAnimation { gear: number; flaps: number; spoilers: number; thrust: number; landingLights: boolean; contrail: number }
/** Distance from the fuselage axis to the ground with the gear extended. */
export const GEAR_HEIGHT = 6.42;

/** Original wide-body twinjet, drawn in metres with the nose pointing along -Z. */
export function createGarudaAircraft(r: WorldResources, options: { wingsOnly?: boolean; animated?: boolean } = {}): T.Group {
  const plane = new T.Group(); plane.name = 'Garuda Indonesia — aircraft'; plane.userData.dynamic = true;
  const parts: AircraftParts = { fans: [], gear: [], flaps: [], spoilers: [], strobes: [], beacons: [], landingLights: [], contrails: [] };
  plane.userData.parts = parts;
  const body = options.wingsOnly ? new T.Group() : plane;
  const paint = r.keep(new T.MeshStandardMaterial({ color: '#f7f8f8', metalness: .24, roughness: .28 }));
  const alloy = r.keep(new T.MeshStandardMaterial({ color: '#cad2db', metalness: .62, roughness: .29 }));
  const dark = r.keep(new T.MeshStandardMaterial({ color: '#18232b', metalness: .35, roughness: .36 }));
  const glass = r.keep(new T.MeshStandardMaterial({ color: '#213d50', metalness: .55, roughness: .15, side: T.DoubleSide }));
  const teal = r.keep(new T.MeshStandardMaterial({ color: '#087f9b', metalness: .25, roughness: .32 }));
  // A rounded, tapering body; these closely spaced nose/tail stations keep the
  // silhouette smooth even at a low three-quarter camera angle.
  const profile: [number, number][] = [[-33, 0], [-32.6, .55], [-31.8, 1.25], [-30.6, 1.95], [-29, 2.55], [-27, 2.94], [-24, 3.1], [-20, 3.13], [18, 3.13], [21, 2.98], [24, 2.55], [27, 1.7], [30, .75], [32, .15], [32.5, 0]];
  const fuselage = new T.LatheGeometry(profile.map(([z, radius]) => new T.Vector2(radius, z)), 72); fuselage.rotateX(Math.PI / 2); fuselage.scale(1, .94, 1);
  r.mesh(body, fuselage, paint);
  // The darker underside stays below the livery and follows the rounded body.
  const belly = new T.LatheGeometry(profile.map(([z, radius]) => new T.Vector2(radius + .008, z)), 40, Math.PI * .64, Math.PI * .72);
  belly.rotateX(Math.PI / 2); belly.rotateZ(Math.PI); belly.scale(1, .94, 1);
  r.mesh(body, belly, r.keep(new T.MeshStandardMaterial({ color: '#d2dce2', metalness: .22, roughness: .36 })));

  const wordmark = wordmarkMaterial(r), doorInk = doorMaterial(r), flagInk = flagMaterial(r), ribbon = ribbonMaterial(r), tailInk = tailMaterial(r);
  // Wing sections include camber, thickness and dihedral instead of a flat slab.
  const wingStations = [[2.7, -.55, -8, 9], [7, -.35, -5, 10], [14, .2, 0, 13], [23, 1.1, 7.5, 16.3], [30.5, 2.8, 14.5, 18.1]];
  const tailStations = [[1.5, 1.05, 20.5, 28.3], [6, 1.5, 24.5, 29.7], [11.8, 2.6, 29, 31.6]];
  for (const side of [-1, 1]) {
    r.mesh(plane, airfoil(wingStations, side, .53), paint);
    r.mesh(body, airfoil(tailStations, side, .2), alloy);
    // Flap and spoiler divisions, navigation lights, and engine pylons.
    for (let i = 0; i < 3; i++) {
      const x = side * (7 + i * 5.6), z = 9 + i * 2.15;
      const fairing = r.sphere(plane, [.2, .3, 2.65], [x, -.62 + i * .18, z + .8], alloy); fairing.rotation.y = -side * .12;
      const line = r.box(plane, [5.4, .018, .045], [x, -.11 + i * .36, z], alloy); line.rotation.y = -side * .27;
    }
    const light = r.keep(new T.MeshStandardMaterial({ color: side < 0 ? '#dd4745' : '#62d68c', emissive: side < 0 ? '#ee1818' : '#26b556', emissiveIntensity: 2 }));
    r.sphere(plane, [.16, .11, .22], [side * 30.35, 2.83, 15.1], light);
    const pylon = r.box(plane, [.38, 2.2, 3.6], [side * 10.8, -1.25, -1], alloy); pylon.rotation.x = -.18;
    addEngine(r, plane, side * 10.8, -2.75, -3.3, paint, alloy, dark, options.animated ? parts : undefined);
    // A row of inset cabin windows and door outlines curves with the fuselage.
    for (let z = -22.7; z < 21.5; z += .96) {
      if ([-21.5, -6, 9, 21].some((door) => Math.abs(z - door) < 1.25)) continue;
      const radius = z > 18 ? 3.08 - (z - 18) * .045 : 3.135;
      const w = r.sphere(body, [.025, .24, .16], [side * Math.sqrt(radius * radius - 1.12 * 1.12), 1.05, z], glass); w.rotation.z = -side * .35;
    }
    for (const z of [-21.5, -6, 9, 21]) {
      const x = side * (z > 18 ? 2.94 : 3.1);
      const door = r.mesh(body, new T.PlaneGeometry(1.08, 1.95), doorInk, [x + side * .025, .18, z]); door.rotation.y = side * Math.PI / 2;
    }
    const title = r.mesh(body, new T.PlaneGeometry(17, 1.9), wordmark, [side * 2.77, 1.59, -12]);
    title.rotation.y = side * Math.PI / 2; title.rotation.x = side > 0 ? -.025 : .025;
    // Cockpit glazing is a set of sharply framed, swept panes around the nose.
    for (let j = 0; j < 3; j++) {
      r.mesh(body, cockpitPane(j, side, profile), glass);
    }
    const flag = r.mesh(body, new T.PlaneGeometry(.82, .45), flagInk, [side * 3.01, .9, -24.5]); flag.rotation.y = side * Math.PI / 2;
    const tailBand = r.mesh(body, new T.PlaneGeometry(12.2, 3.8), ribbon, [side * 2.75, -.25, 20.2]); tailBand.rotation.y = side * Math.PI / 2;
  }
  const fin = new T.Shape(); fin.moveTo(0, 0); fin.lineTo(13.8, 0); fin.lineTo(12.1, 11.8); fin.lineTo(9.1, 12.8); fin.lineTo(0, 0);
  const finGeometry = new T.ExtrudeGeometry(fin, { depth: .5, bevelEnabled: true, bevelSize: .12, bevelThickness: .09, bevelSegments: 2, steps: 1 });
  // Shape X is longitudinal; shape Y is altitude. Root at rear fuselage.
  finGeometry.rotateY(-Math.PI / 2); finGeometry.translate(.25, 2, 15.2);
  r.mesh(body, finGeometry, teal);
  for (const side of [-1, 1]) {
    const decoration = r.mesh(body, finDecal(side), tailInk); decoration.position.set(side * .36, 2, 15.2);
  }
  r.sphere(body, [.2, .12, .37], [0, 3.04, 2], alloy);
  if (options.animated) addMovingParts(r, plane, parts, paint, alloy, dark, Boolean(options.wingsOnly));
  else {
    const beacon = r.keep(new T.MeshStandardMaterial({ color: '#d84b41', emissive: '#e52116', emissiveIntensity: 1.5 }));
    r.sphere(body, [.1, .1, .1], [0, 3.11, -4], beacon);
  }
  return plane;
}

function dynamicGroup(parent: T.Object3D, name: string, at: Position = [0, 0, 0]): T.Group {
  const group = new T.Group(); group.name = name; group.userData.dynamic = true; group.position.set(...at); parent.add(group); return group;
}

/** Retractable gear, flaps, spoilers, lights and contrails for the flying aircraft. */
function addMovingParts(r: WorldResources, plane: T.Group, parts: AircraftParts, paint: T.Material, alloy: T.Material, dark: T.Material, wingsOnly: boolean): void {
  const tyre = r.keep(new T.MeshStandardMaterial({ color: '#1d2125', roughness: .95 }));
  const hub = r.keep(new T.MeshStandardMaterial({ color: '#b8c0c6', metalness: .7, roughness: .38 }));
  const strut = (parent: T.Object3D, a: Position, b: Position, radius: number) => {
    const from = new T.Vector3(...a), to = new T.Vector3(...b), delta = to.clone().sub(from);
    const rod = r.cylinder(parent, radius, radius, 1, [0, 0, 0], alloy, 12);
    rod.position.copy(from).add(to).multiplyScalar(.5); rod.scale.y = delta.length();
    rod.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
  };
  const wheel = (parent: T.Object3D, x: number, y: number, z: number, radius: number, width: number) => {
    const rubber = r.cylinder(parent, radius, radius, width, [x, y, z], tyre, 28); rubber.rotation.z = Math.PI / 2;
    const rim = r.cylinder(parent, radius * .55, radius * .55, width + .02, [x, y, z], hub, 18); rim.rotation.z = Math.PI / 2;
  };
  if (!wingsOnly) {
    // Nose gear folds forward into the fuselage; mains fold inboard into the wing root.
    const nose = dynamicGroup(plane, 'Roda depan', [0, -2.75, -24.5]);
    strut(nose, [0, 0, 0], [0, -3.05, 0], .16); strut(nose, [0, -.6, 0], [0, -.2, 1.6], .07);
    for (const x of [-.32, .32]) wheel(nose, x, -3.15, 0, .63, .32);
    parts.gear.push({ pivot: nose, axis: 'x', angle: -1.6 });
    for (const side of [-1, 1]) {
      const main = dynamicGroup(plane, 'Roda utama', [side * 5.2, -1.6, 7]);
      strut(main, [0, 0, 0], [0, -3.95, 0], .24); strut(main, [-side * 1.6, -.4, -.8], [0, -2.4, 0], .1);
      r.box(main, [.36, .3, 2.6], [0, -3.95, 0], hub);
      for (const dx of [-.42, .42]) for (const dz of [-.95, .95]) wheel(main, dx, -3.95, dz, .88, .44);
      parts.gear.push({ pivot: main, axis: 'z', angle: side * 1.55 });
    }
    // Red beacons above and below the fuselage.
    for (const y of [3.11, -2.98]) {
      const beacon = r.keep(new T.MeshStandardMaterial({ color: '#d84b41', emissive: '#ff2414', emissiveIntensity: 0 }));
      r.sphere(dynamicGroup(plane, 'Lampu suar'), [.13, .1, .13], [0, y, -4], beacon); parts.beacons.push(beacon);
    }
    // Faint condensation trails, visible only at cruise altitude.
    const trailMap = trailTexture(r);
    for (const side of [-1, 1]) {
      const trailMaterial = r.keep(new T.MeshBasicMaterial({ map: trailMap, transparent: true, depthWrite: false, opacity: 0, side: T.DoubleSide, fog: false }));
      trailMaterial.userData.keepUV = true;
      const geometry = new T.CylinderGeometry(3.2, .35, 420, 16, 1, true); geometry.rotateX(-Math.PI / 2);
      const trail = r.mesh(dynamicGroup(plane, 'Jejak kondensasi'), geometry, trailMaterial, [side * 10.8, -2.75, 1.2 + 210]);
      trail.castShadow = trail.receiveShadow = false; trail.renderOrder = 5; parts.contrails.push(trail);
    }
  }
  for (const side of [-1, 1]) {
    // Trailing-edge flaps hinge downward from the inboard wing.
    for (let i = 0; i < 2; i++) {
      const x = side * (4.2 + i * 6.2), z = 9.6 + i * 2.5;
      const flap = dynamicGroup(plane, 'Flap', [x, -.35 + i * .35, z]);
      const panel = r.box(flap, [6, .14, 1.55], [0, 0, .75], paint); panel.rotation.y = -side * .24;
      parts.flaps.push({ pivot: flap, side });
      const spoiler = dynamicGroup(plane, 'Spoiler', [x, -.05 + i * .4, z - .6]);
      const plate = r.box(spoiler, [5.6, .05, 1.1], [0, 0, -.55], alloy); plate.rotation.y = -side * .24;
      parts.spoilers.push(spoiler);
    }
    // White strobes at the wingtips; landing lights in the wing roots.
    const strobe = r.keep(new T.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0 }));
    r.sphere(dynamicGroup(plane, 'Strobo'), [.13, .1, .18], [side * 30.4, 2.85, 15.6], strobe); parts.strobes.push(strobe);
    const glow = new T.Sprite(glowMaterial(r)); glow.position.set(side * 4.4, -.9, -6.4); glow.scale.setScalar(5); glow.visible = false;
    dynamicGroup(plane, 'Lampu pendaratan').add(glow); parts.landingLights.push(glow);
  }
  void dark;
}

/** Applies flight state to the moving parts. `time` drives the strobe and beacon cycle. */
export function animateAircraft(parts: AircraftParts, state: AircraftAnimation, time: number, delta: number): void {
  const retract = 1 - state.gear;
  for (const leg of parts.gear) {
    leg.pivot.rotation[leg.axis] = leg.angle * retract;
    leg.pivot.visible = retract < .995;
  }
  for (const flap of parts.flaps) flap.pivot.rotation.x = .55 * state.flaps;
  for (const spoiler of parts.spoilers) spoiler.rotation.x = -.85 * state.spoilers;
  const spin = (2 + Math.abs(state.thrust) * 26) * delta;
  for (const fan of parts.fans) fan.rotation.z += spin;
  const beat = time % 1.2;
  for (const strobe of parts.strobes) strobe.emissiveIntensity = beat < .05 || (beat > .14 && beat < .19) ? 9 : 0;
  for (const beacon of parts.beacons) beacon.emissiveIntensity = (time + .5) % 1.1 < .12 ? 6 : .2;
  for (const light of parts.landingLights) light.visible = state.landingLights;
  for (const trail of parts.contrails) (trail.material as T.MeshBasicMaterial).opacity = .55 * state.contrail;
}

function trailTexture(r: WorldResources): T.CanvasTexture {
  const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 512;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Tekstur jejak tidak tersedia.');
  for (let y = 0; y < 512; y++) {
    // V runs along the trail: dense near the engine, dissolving behind it.
    const along = y / 511, fade = Math.min(1, along * 14) * (1 - along) ** 1.4;
    for (let x = 0; x < 64; x++) {
      const across = Math.sin(x / 63 * Math.PI);
      ctx.fillStyle = `rgba(255,255,255,${(fade * across * (.75 + .25 * Math.sin(y * .21 + x * .3))).toFixed(3)})`; ctx.fillRect(x, y, 1, 1);
    }
  }
  const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; return map;
}
function glowMaterial(r: WorldResources): T.SpriteMaterial {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Tekstur lampu tidak tersedia.');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,245,1)'); g.addColorStop(.18, 'rgba(255,250,225,.75)'); g.addColorStop(1, 'rgba(255,240,200,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace;
  return r.keep(new T.SpriteMaterial({ map, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, toneMapped: false }));
}

function airfoil(stations: number[][], side: number, thickness: number): T.BufferGeometry {
  const points: number[] = [], indices: number[] = [], segments = 16;
  for (const [x, y, leading, trailing] of stations) for (let i = 0; i <= segments; i++) {
    const theta = i / segments * Math.PI * 2;
    const chord = (1 - Math.cos(theta)) / 2, taper = 1 - x / 37;
    points.push(side * x, y + Math.sin(theta) * thickness * taper + Math.sin(chord * Math.PI) * .14, leading + (trailing - leading) * chord);
  }
  for (let s = 0; s < stations.length - 1; s++) for (let i = 0; i < segments; i++) {
    const a = s * (segments + 1) + i, b = a + segments + 1;
    if (side > 0) indices.push(a, b, a + 1, b, b + 1, a + 1); else indices.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(points, 3)); g.setIndex(indices); g.computeVertexNormals(); return g;
}
function addEngine(r: WorldResources, parent: T.Group, x: number, y: number, z: number, paint: T.Material, alloy: T.Material, dark: T.Material, parts?: AircraftParts): void {
  const nacelle = new T.LatheGeometry([[1.33, -2.25], [1.52, -2.15], [1.65, -1.5], [1.7, -.2], [1.55, 1.8], [1.1, 3.2], [.85, 3.8]].map(([radius, along]) => new T.Vector2(radius, along)), 48); nacelle.rotateX(Math.PI / 2);
  r.mesh(parent, nacelle, paint, [x, y, z]);
  const rim = r.mesh(parent, new T.TorusGeometry(1.43, .12, 12, 48), alloy, [x, y, z - 2.18]);
  rim.castShadow = true;
  const tunnel = new T.CylinderGeometry(1.34, 1.2, 1.1, 40, 1, true); tunnel.rotateX(Math.PI / 2);
  const inside = r.keep(new T.MeshStandardMaterial({ color: '#192632', roughness: .7, side: T.DoubleSide }));
  r.mesh(parent, tunnel, inside, [x, y, z - 1.65]);
  const fanDisk = r.mesh(parent, new T.CircleGeometry(1.2, 40), dark, [x, y, z - 1.09]); fanDisk.rotation.y = Math.PI;
  // The fan spins as one dynamic group when the aircraft is animated.
  const fan = new T.Group(); fan.position.set(x, y, z - 1.13); parent.add(fan);
  if (parts) { fan.userData.dynamic = true; parts.fans.push(fan); }
  const bladeShape = new T.Shape(); bladeShape.moveTo(.2, -.07); bladeShape.quadraticCurveTo(.7, -.2, 1.18, .01); bladeShape.lineTo(1.16, .16); bladeShape.quadraticCurveTo(.65, .02, .2, .07);
  const bladeGeometry = r.keep(new T.ShapeGeometry(bladeShape));
  for (let i = 0; i < 22; i++) {
    const mesh = r.mesh(fan, bladeGeometry, alloy); mesh.rotation.z = i * Math.PI * 2 / 22; mesh.rotation.y = Math.PI;
  }
  const spinner = r.sphere(fan, [.27, .27, .48], [0, 0, -.05], alloy);
  // A painted swirl makes rotation readable, as on real spinners.
  const swirl = r.box(fan, [.04, .2, .02], [0, .14, -.5], r.keep(new T.MeshStandardMaterial({ color: '#f2f4f5', roughness: .4 })));
  void spinner; void swirl;
  const nozzle = r.cylinder(parent, .7, .98, 1.25, [x, y, z + 3.45], dark, 32); nozzle.rotation.x = Math.PI / 2;
  r.sphere(parent, [.42, .42, .95], [x, y, z + 3.9], alloy);
}
function canvasMaterial(r: WorldResources, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): T.MeshStandardMaterial {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas pesawat tidak tersedia.'); draw(ctx);
  const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 8;
  const material = r.keep(new T.MeshStandardMaterial({ map, transparent: true, depthWrite: false, roughness: .45, side: T.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1 })); material.userData.keepUV = true; return material;
}
function wordmarkMaterial(r: WorldResources): T.MeshStandardMaterial {
  return canvasMaterial(r, 2048, 256, (ctx) => {
    ctx.fillStyle = '#123c60'; ctx.font = 'italic 500 170px Arial,sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; ctx.fillText('Garuda Indonesia', 1024, 137, 2000);
  });
}
function doorMaterial(r: WorldResources): T.MeshStandardMaterial {
  return canvasMaterial(r, 128, 256, (ctx) => {
    ctx.strokeStyle = '#98a6ad'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(8, 5, 112, 244, 18); ctx.stroke();
    ctx.fillStyle = '#55646c'; ctx.fillRect(84, 118, 19, 5); ctx.fillStyle = '#b84137'; ctx.fillRect(53, 17, 24, 3);
  });
}
function flagMaterial(r: WorldResources): T.MeshStandardMaterial {
  return canvasMaterial(r, 128, 64, (ctx) => { ctx.fillStyle = '#da3438'; ctx.fillRect(0, 0, 128, 32); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 32, 128, 32); });
}
function ribbonMaterial(r: WorldResources): T.MeshStandardMaterial {
  return canvasMaterial(r, 1024, 256, (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 1024, 0); gradient.addColorStop(0, '#005f88'); gradient.addColorStop(.65, '#00a0af'); gradient.addColorStop(1, '#76c7cd');
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.moveTo(0, 255); ctx.bezierCurveTo(420, 250, 500, 50, 1024, 0); ctx.lineTo(1024, 256); ctx.fill();
    for (let i = 0; i < 5; i++) { ctx.strokeStyle = `rgba(222,248,248,${.4 - i * .045})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(i * 55, 256); ctx.bezierCurveTo(510, 220, 650, 60 + i * 21, 1024, i * 23); ctx.stroke(); }
  });
}
function tailMaterial(r: WorldResources): T.MeshStandardMaterial {
  return canvasMaterial(r, 512, 512, (ctx) => {
    const gradient = ctx.createLinearGradient(0, 512, 512, 0); gradient.addColorStop(0, '#004b78'); gradient.addColorStop(.5, '#0087a4'); gradient.addColorStop(1, '#67c5d2'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 512);
    // Original feather-like flowing ribbons, inspired by the airline's blue/teal livery.
    for (let i = 0; i < 9; i++) {
      ctx.strokeStyle = i % 2 ? '#8bd8de' : '#d7f2f1'; ctx.lineWidth = 9 + i * 2; ctx.beginPath(); ctx.moveTo(70 + i * 13, 500); ctx.bezierCurveTo(75 + i * 12, 350, 400 + i * 7, 240 - i * 20, 510, 70 - i * 9); ctx.stroke();
    }
  });
}
function finDecal(side: number): T.BufferGeometry {
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute([0, .1, .3, 0, .1, 13.6, 0, 11.7, 12, 0, 12.6, 9.1], 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(side > 0 ? [0, 0, 1, 0, 1, 1, .65, 1] : [1, 0, 0, 0, 0, 1, .35, 1], 2)); g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals(); return g;
}
function cockpitPane(index: number, side: number, profile: [number, number][]): T.BufferGeometry {
  const positions: number[] = [], indices: number[] = [];
  const radiusAt = (z: number) => {
    const segment = profile.findIndex(([station]) => station > z);
    const a = profile[Math.max(0, segment - 1)], b = profile[Math.max(1, segment)];
    return a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0]) + .035;
  };
  // Glazing hugs the actual curved nose surface so it cannot vanish inside the
  // body when viewed from the opposite side or at a different camera altitude.
  for (let row = 0; row <= 4; row++) for (let column = 0; column <= 6; column++) {
    const theta = .18 + index * .34 + column / 6 * .29;
    const z = -30.75 + index * .39 + row / 4 * 1.45;
    const radius = radiusAt(z);
    positions.push(side * Math.sin(theta) * radius, Math.cos(theta) * radius * .94, z);
  }
  for (let row = 0; row < 4; row++) for (let column = 0; column < 6; column++) {
    const a = row * 7 + column, b = a + 7;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); return g;
}
