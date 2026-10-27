import * as T from 'three';
import { GREEN_MARKER_RADIUS, HAJAR_CORNER, KAABA, MAQAM_POSITION, TAWAF_START_ANGLE } from './kaaba-layout';
import type { Landmark, Position, Rect, WorldResources } from './types';

/** Locally authored reconstruction. Ornament is geometric rather than invented sacred text.
 * Dimensions/orientation follow the Grand Mosque references in the module's source notes. */
function canvasMap(r: WorldResources, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx);
  const map = r.keep(new T.CanvasTexture(canvas));
  map.colorSpace = T.SRGBColorSpace; map.anisotropy = 4;
  return map;
}

function rosette(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, petals = 8) {
  ctx.beginPath();
  for (let i = 0; i <= 160; i++) {
    const a = i / 160 * Math.PI * 2;
    const d = radius * (.72 + .28 * Math.cos(a * petals));
    const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, radius * .28, 0, Math.PI * 2); ctx.stroke();
}

function embroideredMap(r: WorldResources) {
  return canvasMap(r, 2048, 256, (ctx) => {
    ctx.fillStyle = '#171713'; ctx.fillRect(0, 0, 2048, 256);
    for (let y = 0; y < 256; y += 3) {
      ctx.fillStyle = y % 2 ? '#22211b' : '#121310'; ctx.fillRect(0, y, 2048, 1);
    }
    ctx.strokeStyle = '#b78d40'; ctx.lineWidth = 5;
    for (const y of [8, 22, 46, 210, 234, 248]) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(2048, y); ctx.stroke();
    }
    for (let x = 0; x <= 2048; x += 32) {
      ctx.lineWidth = 2;
      for (const y of [34, 222]) rosette(ctx, x, y, 9, 4);
    }
    for (let i = 0; i < 8; i++) {
      const x = i * 256 + 128;
      ctx.strokeStyle = '#dec17d'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(x - 113, 62, 226, 131, 58); ctx.stroke();
      ctx.strokeStyle = '#9e772e'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x - 106, 69, 212, 117, 52); ctx.stroke();
      rosette(ctx, x, 128, 41); rosette(ctx, x - 70, 128, 25, 6); rosette(ctx, x + 70, 128, 25, 6);
      ctx.strokeStyle = '#d8b66c';
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(x + s * 30, 128);
        ctx.bezierCurveTo(x + s * 45, 80, x + s * 87, 87, x + s * 95, 128);
        ctx.bezierCurveTo(x + s * 87, 168, x + s * 45, 176, x + s * 30, 128); ctx.stroke();
      }
      // Individual thread strokes catch the light instead of a flat yellow band.
      ctx.strokeStyle = '#e6cc90'; ctx.lineWidth = .7;
      for (let p = 0; p < 92; p++) {
        const a = p / 92 * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 40, 128 + Math.sin(a) * 40);
        ctx.lineTo(x + Math.cos(a) * 43, 128 + Math.sin(a) * 43); ctx.stroke();
      }
    }
  });
}

function kaabaMaterials(r: WorldResources) {
  const silk = canvasMap(r, 1024, 1024, (ctx) => {
    ctx.fillStyle = '#151617'; ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 1024; i += 3) {
      ctx.fillStyle = i % 2 ? '#191a1b' : '#101112'; ctx.fillRect(i, 0, 1, 1024);
      ctx.fillStyle = i % 2 ? '#18191a' : '#121314'; ctx.fillRect(0, i, 1024, 1);
    }
    ctx.strokeStyle = '#222324'; ctx.lineWidth = 2;
    for (let y = -64; y < 1100; y += 128) for (let x = -64; x < 1100; x += 128) {
      const cx = x + (y % 256 ? 64 : 0);
      ctx.beginPath(); ctx.moveTo(cx, y - 58); ctx.quadraticCurveTo(cx + 52, y, cx, y + 58);
      ctx.quadraticCurveTo(cx - 52, y, cx, y - 58); ctx.stroke();
      rosette(ctx, cx, y, 22, 4);
    }
  });
  silk.wrapS = silk.wrapT = T.RepeatWrapping; silk.repeat.set(3, 3);
  const cloth = r.keep(new T.MeshStandardMaterial({ map: silk, bumpMap: silk, bumpScale: .026, roughness: .91, color: '#c3c3c3' }));
  cloth.userData.keepUV = true;
  const embroidery = r.keep(new T.MeshStandardMaterial({ map: embroideredMap(r), metalness: .45, roughness: .53 }));
  embroidery.userData.keepUV = true;
  const gold = r.keep(new T.MeshStandardMaterial({ color: '#c99b46', roughness: .29, metalness: .72 }));
  const silver = r.keep(new T.MeshStandardMaterial({ color: '#e6e6e1', roughness: .2, metalness: .86 }));
  const stone = r.keep(new T.MeshStandardMaterial({ color: '#211d1b', roughness: .22, metalness: .12 }));
  return { cloth, embroidery, gold, silver, stone };
}

/** Curved strips make the cloth hang in soft vertical folds rather than box ribs. */
function clothWall(r: WorldResources, width: number, height: number) {
  const geometry = r.keep(new T.PlaneGeometry(width, height, 100, 60));
  const positions = geometry.getAttribute('position');
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i) + height / 2;
    const hang = Math.pow(1 - y / height, .7);
    const folds = .032 * Math.sin(x * 14.7) + .017 * Math.sin(x * 27.3 + .5) + .024 * Math.sin(x * 4.7);
    positions.setZ(i, .03 + hang * (folds + .032) + .006 * Math.sin(y * 5 + x * 2));
  }
  geometry.computeVertexNormals();
  return geometry;
}

function addDoor(r: WorldResources, parent: T.Group, gold: T.Material, embroidery: T.Material) {
  const door = new T.Group();
  door.name = 'Kaaba-elevated-gold-door';
  door.position.set(-2.15, 2.22, KAABA.depth / 2 + .095); parent.add(door);
  r.box(door, [1.95, 3.46, .19], [0, 1.59, 0], r.mat.darkGold);
  r.box(door, [1.71, 3.18, .2], [0, 1.59, .07], gold);
  // Sitarah: a hanging textile panel and embroidered surrounds above the door.
  r.box(door, [2.9, 5.95, .08], [0, 3.05, -.01], r.mat.kiswa);
  for (const x of [-1.31, 1.31]) {
    const band = r.mesh(door, r.keep(new T.PlaneGeometry(.23, 5.8)), embroidery, [x, 3.05, .05]);
    band.rotation.z = Math.PI / 2; band.scale.set(5.8 / .23, .23 / 5.8, 1);
  }
  r.mesh(door, r.keep(new T.PlaneGeometry(2.74, .51)), embroidery, [0, 5.86, .055]);
  r.mesh(door, r.keep(new T.PlaneGeometry(2.74, .41)), embroidery, [0, 4.8, .055]);
  const crest = r.mesh(door, r.keep(new T.TorusGeometry(.46, .018, 6, 60)), gold, [0, 4.08, .075]);
  crest.scale.set(1.55, .82, 1);
  for (const x of [-.89, .89]) r.box(door, [.075, 3.31, .06], [x, 1.59, .2], gold);
  for (const y of [-.025, 3.2]) r.box(door, [1.85, .08, .07], [0, y, .2], gold);
  r.box(door, [.035, 3.16, .025], [0, 1.59, .185], r.mat.darkGold);
  const medallion = r.keep(new T.TorusGeometry(.16, .014, 6, 32));
  const engravingMap = canvasMap(r, 512, 512, (ctx) => {
    const gleam = ctx.createLinearGradient(0, 0, 512, 512);
    gleam.addColorStop(0, '#d3ad62'); gleam.addColorStop(.48, '#b78232'); gleam.addColorStop(1, '#d8b979');
    ctx.fillStyle = gleam; ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#855622'; ctx.lineWidth = 2;
    for (const margin of [12, 20, 38]) ctx.strokeRect(margin, margin, 512 - margin * 2, 512 - margin * 2);
    rosette(ctx, 256, 256, 148, 12); rosette(ctx, 256, 256, 108, 8);
    for (const x of [84, 428]) for (const y of [84, 428]) rosette(ctx, x, y, 34, 6);
    for (let i = 0; i < 24; i++) {
      const a = i * Math.PI / 12;
      const x = 256 + Math.cos(a) * 182, y = 256 + Math.sin(a) * 182;
      ctx.beginPath(); ctx.ellipse(x, y, 14, 7, a, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.strokeStyle = '#edd198'; ctx.lineWidth = 1;
    rosette(ctx, 255, 255, 150, 12);
  });
  const engraving = r.keep(new T.MeshStandardMaterial({ map: engravingMap, bumpMap: engravingMap, bumpScale: .007, metalness: .6, roughness: .39 }));
  engraving.userData.keepUV = true;
  for (const x of [-.42, .42]) for (const y of [.37, 1.12, 1.87, 2.63]) {
    r.box(door, [.7, .65, .045], [x, y, .19], r.mat.darkGold);
    r.box(door, [.64, .59, .055], [x, y, .215], gold);
    r.mesh(door, r.keep(new T.PlaneGeometry(.615, .565)), engraving, [x, y, .245]);
    r.mesh(door, medallion, r.mat.darkGold, [x, y, .249]);
    const center = r.mesh(door, medallion, gold, [x, y, .259]); center.scale.set(.78, .78, 1);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const boss = r.sphere(door, [.027, .027, .016], [x + sx * .25, y + sy * .23, .255], gold);
      boss.castShadow = false;
    }
  }
  for (const x of [-.12, .12]) {
    const handle = r.mesh(door, r.keep(new T.TorusGeometry(.067, .018, 8, 24)), r.mat.darkGold, [x, 1.3, .31]);
    handle.scale.y = 1.6;
  }
  r.box(door, [2.06, .15, .6], [0, -.075, .04], r.mat.marble);
}

function addBlackStone(r: WorldResources, parent: T.Group, silver: T.Material, stone: T.Material) {
  const hajar = new T.Group(); hajar.name = 'Hajar-Aswad';
  hajar.position.set(HAJAR_CORNER.x - .015, 1.5, HAJAR_CORNER.z + .015);
  hajar.rotation.y = -Math.PI / 4; parent.add(hajar);
  const outer = r.keep(new T.TorusGeometry(.285, .078, 14, 64));
  const position = outer.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const a = Math.atan2(position.getY(i), position.getX(i));
    position.setZ(i, position.getZ(i) + .012 * Math.sin(a * 3));
  }
  outer.computeVertexNormals();
  const frame = r.mesh(hajar, outer, silver, [0, 0, .018]); frame.scale.set(.9, 1.32, 1);
  r.sphere(hajar, [.225, .327, .044], [0, 0, .015], r.mat.black);
  const rim = r.mesh(hajar, r.keep(new T.TorusGeometry(.239, .014, 8, 48)), silver, [0, 0, .052]);
  rim.scale.set(.9, 1.33, 1);
  // Individual polished fragments sit inside the dark oval, rather than one round ball.
  const pieces: Position[] = [[-.065, .18, .04], [.085, .14, .05], [-.1, .025, .04], [.065, -.025, .04], [-.045, -.12, .04], [.075, -.19, .035], [-.08, -.235, .03]];
  pieces.forEach(([x, y, z], i) => {
    const fragment = r.mesh(hajar, r.keep(new T.IcosahedronGeometry(1, 1)), stone, [x, y, z]);
    fragment.scale.set(.07 + (i % 3) * .012, .066 + (i % 2) * .021, .022);
    fragment.rotation.z = i * .83;
  });
}

const HIJR_CENTER_OFFSET = 1.8;
const HIJR_OUTER_RADIUS = 7.55;

function arcWall(r: WorldResources, outerRadius: number, innerRadius: number, height: number, material: T.Material, group: T.Group, y: number) {
  const shape = new T.Shape(); const start = -.5 * Math.PI + .18, end = .5 * Math.PI - .18;
  shape.absarc(0, 0, outerRadius, start, end, false);
  shape.absarc(0, 0, innerRadius, end, start, true); shape.closePath();
  const geometry = r.keep(new T.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelThickness: .025, bevelSize: .025, bevelSegments: 2, curveSegments: 64 }));
  const mesh = r.mesh(group, geometry, material, [KAABA.width / 2 + HIJR_CENTER_OFFSET, y, 0]);
  mesh.rotation.x = -Math.PI / 2;
}

function addHijr(r: WorldResources, group: T.Group, gold: T.Material): Rect[] {
  const radius = HIJR_OUTER_RADIUS, halfX = KAABA.width / 2;
  const centerX = halfX + HIJR_CENTER_OFFSET;
  // The north-facing arc deliberately leaves an entrance at each end.
  arcWall(r, radius, radius - .9, 1.2, r.mat.marble, group, .03);
  arcWall(r, radius + .035, radius - .935, .1, r.mat.marble, group, 1.23);
  arcWall(r, radius + .025, radius - .925, .09, r.mat.limestone, group, .14);
  const blockers: Rect[] = [];
  for (let i = 0; i < 36; i++) {
    const a = -.5 * Math.PI + .18 + i / 35 * (Math.PI - .36);
    const x = centerX + Math.cos(a) * (radius - .45), z = Math.sin(a) * (radius - .45);
    // Small overlapping collision sections retain both entrances and the open interior.
    blockers.push({ minX: x - .52, maxX: x + .52, minZ: z - .52, maxZ: z + .52 });
    if (i % 2 === 0) {
      for (const rr of [radius + .028, radius - .928]) {
        const seam = r.box(group, [.012, 1.04, .018], [centerX + Math.cos(a) * rr, .72, Math.sin(a) * rr], r.mat.limestone);
        seam.rotation.y = Math.PI / 2 - a;
      }
    }
  }
  // Three small gold lanterns on the marble wall.
  for (const a of [-.9, 0, .9]) {
    const x = centerX + Math.cos(a) * (radius - .45), z = Math.sin(a) * (radius - .45);
    r.cylinder(group, .15, .19, .1, [x, 1.4, z], gold, 8);
    r.cylinder(group, .11, .11, .28, [x, 1.57, z], r.mat.glass, 8);
    r.cylinder(group, .025, .17, .16, [x, 1.79, z], gold, 8);
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      r.cylinder(group, .012, .012, .3, [x + Math.cos(angle) * .12, 1.57, z + Math.sin(angle) * .12], gold, 4);
    }
  }
  // Mizab: open gold channel at the roof edge, with a dropped lip toward Hijr.
  const gutterY = KAABA.height - .2;
  r.box(group, [1.65, .09, .32], [halfX + .67, gutterY, 0], gold);
  for (const z of [-.19, .19]) r.box(group, [1.65, .24, .055], [halfX + .67, gutterY + .13, z], gold);
  r.box(group, [.08, .4, .43], [halfX + 1.51, gutterY - .09, 0], gold);
  return blockers;
}

function addMaqam(r: WorldResources, group: T.Group, gold: T.Material) {
  const kiosk = new T.Group(); kiosk.name = 'Maqam-Ibrahim';
  kiosk.position.set(MAQAM_POSITION.x, 0, MAQAM_POSITION.z); group.add(kiosk);
  r.cylinder(kiosk, .94, 1.02, .14, [0, .07, 0], r.mat.marble, 6);
  r.cylinder(kiosk, .77, .88, .17, [0, .225, 0], gold, 6);
  r.cylinder(kiosk, .68, .75, .19, [0, .4, 0], r.mat.darkGold, 6);
  // The preserved stone is enclosed by glass; no human figure is represented.
  r.box(kiosk, [.63, .27, .64], [0, .65, 0], r.mat.limestone);
  for (const x of [-.14, .14]) r.sphere(kiosk, [.085, .009, .17], [x, .79, 0], r.mat.darkStone);
  const glass = r.keep(new T.MeshStandardMaterial({ color: '#dbe7e5', transparent: true, opacity: .2, roughness: .13, metalness: .08, side: T.DoubleSide, depthWrite: false }));
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    const x = Math.sin(a) * .72, z = Math.cos(a) * .72;
    r.cylinder(kiosk, .036, .05, 1.58, [x, 1.25, z], gold, 8);
    for (const y of [.53, .67, 1.81, 1.97]) r.sphere(kiosk, [.06, .035, .06], [x, y, z], gold);
    const panel = new T.Group(); panel.rotation.y = a + Math.PI / 6; kiosk.add(panel);
    r.box(panel, [.68, 1.38, .015], [0, 1.25, .624], glass).castShadow = false;
    for (const y of [.58, 1.85]) r.box(panel, [.72, .034, .035], [0, y, .64], gold);
    for (const sx of [-.285, .285]) r.box(panel, [.021, 1.27, .025], [sx, 1.22, .64], gold);
    const arch = r.mesh(panel, r.keep(new T.TorusGeometry(.225, .014, 6, 32, Math.PI)), gold, [0, 1.56, .65]);
    arch.scale.y = 1.35;
    const ornament = r.mesh(panel, r.keep(new T.TorusGeometry(.095, .011, 6, 24)), gold, [0, .87, .65]);
    ornament.scale.y = 1.7;
  }
  for (const [y, radius, h] of [[2.04, .78, .1], [2.14, .81, .08], [2.23, .75, .09]])
    r.cylinder(kiosk, radius, radius, h, [0, y, 0], gold, 6);
  const dome = r.mesh(kiosk, r.keep(new T.SphereGeometry(.71, 36, 20, 0, Math.PI * 2, 0, Math.PI / 2)), gold, [0, 2.27, 0]);
  dome.scale.y = .72;
  r.cylinder(kiosk, .018, .055, .23, [0, 2.86, 0], gold, 10);
  r.sphere(kiosk, [.068, .068, .068], [0, 3, 0], gold);
}

export function addKaabaSanctuary(r: WorldResources, group: T.Group): { blockers: Rect[]; landmarks: Landmark[] } {
  const { cloth, embroidery, gold, silver, stone } = kaabaMaterials(r);
  const halfX = KAABA.width / 2, halfZ = KAABA.depth / 2;
  r.box(group, [KAABA.width, KAABA.height, KAABA.depth], [0, KAABA.height / 2, 0], r.mat.black);
  for (let side = 0; side < 4; side++) {
    const wall = new T.Group();
    const width = side % 2 ? KAABA.depth : KAABA.width;
    wall.rotation.y = side * Math.PI / 2;
    wall.position.set(side === 1 ? halfX : side === 3 ? -halfX : 0, 0, side === 0 ? halfZ : side === 2 ? -halfZ : 0);
    group.add(wall);
    // Bevelled shadhrawan on three faces; the Hijr face has no projecting footing.
    if (side !== 1) {
      const section = new T.Shape();
      section.moveTo(0, 0); section.lineTo(-.44, 0); section.lineTo(-.04, .36); section.lineTo(0, .36); section.closePath();
      const geometry = r.keep(new T.ExtrudeGeometry(section, { depth: width, bevelEnabled: false }));
      const footing = r.mesh(wall, geometry, r.mat.marble, [-width / 2, 0, 0]);
      footing.rotation.y = Math.PI / 2;
    }

    r.mesh(wall, clothWall(r, width, KAABA.height - .35), cloth, [0, (KAABA.height + .35) / 2, .02]);
    r.mesh(wall, r.keep(new T.PlaneGeometry(width, .89)), embroidery, [0, 9.5, .112]);
    for (const y of [9.045, 9.955]) r.box(wall, [width, .018, .022], [0, y, .112], gold);
    // Embroidered teardrop medallions below the belt.
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * width / 5.5;
      const outer = r.mesh(wall, r.keep(new T.TorusGeometry(.145, .016, 6, 32)), gold, [x, 7.95, .11]);
      outer.scale.set(.95, 1.7, 1);
      const inner = r.mesh(wall, r.keep(new T.TorusGeometry(.095, .009, 6, 28)), gold, [x, 7.95, .13]);
      inner.scale.set(.95, 1.7, 1);
      r.sphere(wall, [.035, .06, .012], [x, 7.95, .145], gold);
    }
    // Fine ties and sloped marble joins near the textile hem.
    for (let x = -width / 2 + .5; x < width / 2; x += .75) {
      r.mesh(wall, r.keep(new T.TorusGeometry(.025, .006, 5, 12)), silver, [x, .42, .12]);
      r.box(wall, [.008, .22, .018], [x, .22, .22], r.mat.limestone);
    }
  }
  r.box(group, [KAABA.width + .045, .09, KAABA.depth + .045], [0, KAABA.height + .025, 0], r.mat.black);
  addDoor(r, group, gold, embroidery);
  addBlackStone(r, group, silver, stone);
  const blockers: Rect[] = [{ minX: -halfX - .35, maxX: halfX + .35, minZ: -halfZ - .35, maxZ: halfZ + .35 }, ...addHijr(r, group, gold)];
  addMaqam(r, group, gold);
  blockers.push({ minX: MAQAM_POSITION.x - 1.06, maxX: MAQAM_POSITION.x + 1.06, minZ: MAQAM_POSITION.z - 1.06, maxZ: MAQAM_POSITION.z + 1.06 });
  const markerX = Math.cos(TAWAF_START_ANGLE) * GREEN_MARKER_RADIUS;
  const markerZ = Math.sin(TAWAF_START_ANGLE) * GREEN_MARKER_RADIUS;
  const marker = new T.Group(); marker.name = 'Tawaf-green-light'; marker.position.set(markerX, 0, markerZ);
  marker.rotation.y = Math.atan2(-markerX, -markerZ); group.add(marker);
  const green = r.keep(new T.MeshStandardMaterial({ color: '#24e761', emissive: '#13ef55', emissiveIntensity: 1.6, roughness: .4 }));
  // Elevated light on the colonnade, aligned with Hajar Aswad. No painted floor line.
  r.box(marker, [1.55, 3.2, .22], [0, 8.55, 0], r.mat.darkStone);
  r.box(marker, [.46, 2.8, .12], [0, 8.55, .18], green);
  for (const x of [-.63, .63]) r.box(marker, [.055, 3.05, .1], [x, 8.55, .16], silver);
  return { blockers, landmarks: [
    { id: 'kaaba', label: 'Ka’bah', position: [-18, 1.7, 22], lookAt: [0, 6, 0] },
    { id: 'kaaba-door', label: 'Pintu Ka’bah', position: [-2.15, 1.7, halfZ + 8], lookAt: [-2.15, 5.05, halfZ] },
    { id: 'hajar-aswad', label: 'Hajar Aswad', position: [HAJAR_CORNER.x - 2.8, 1.7, HAJAR_CORNER.z + 2.8], lookAt: [HAJAR_CORNER.x, 1.5, HAJAR_CORNER.z] },
    { id: 'hijr', label: 'Hijr Ismail & Mizab', position: [halfX + 19, 1.7, -10], lookAt: [halfX + 2, 5.8, 0] },
    { id: 'maqam', label: 'Maqam Ibrahim', position: [MAQAM_POSITION.x + 3.2, 1.7, MAQAM_POSITION.z + 3.2], lookAt: [MAQAM_POSITION.x, 1.35, MAQAM_POSITION.z] },
    { id: 'tawaf-green-marker', label: 'Lampu hijau tawaf', position: [markerX * .72, 1.7, markerZ * .72], lookAt: [markerX, 8.55, markerZ] },
  ] };
}
