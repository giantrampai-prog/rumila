// Tokoh & benda Petualangan Bawah Laut: penyelam cilik (baju selam hitam-oranye, masker toska, tabung,
// sirip), kapal selam mini "Ocean Explorer" kuning berkubah kaca, kapal penyelam, dan isi dasar laut
// (karang, lamun, batu, cerobong hidrotermal).

import * as T from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { AgamModel, type AgamPose } from '../roket/agam-model';
import { canvasTex, glow, glowSprite } from './creatures';
import { surfaceMaterial, mergeSpecimen, reefGeometry } from './realism';

const std = (color: T.ColorRepresentation, rough = 0.6, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color, roughness: rough, ...extra });

export const rng = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

/** Soft scattering, with both the edge and far end fading instead of visible solid cones. */
function beamMaterial() {
  const m=new T.MeshBasicMaterial({color:'#b4d8e1',transparent:true,opacity:0.055,blending:T.AdditiveBlending,depthWrite:false,side:T.FrontSide});
  m.onBeforeCompile=s=>{
    s.vertexShader=s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 beamUV; varying vec3 beamNormal; varying vec3 beamView;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nbeamUV=uv;beamNormal=normalize(normalMatrix*normal);beamView=-(modelViewMatrix*vec4(position,1.0)).xyz;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec2 beamUV; varying vec3 beamNormal; varying vec3 beamView;')
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= pow(sin(clamp(beamUV.y,0.0,1.0)*3.1415926),2.0)*pow(abs(dot(normalize(beamNormal),normalize(beamView))),1.5);');
  };
  m.customProgramCacheKey=()=> 'sea-soft-scatter-v2';return m;
}

/* ---------------- penyelam cilik ---------------- */

export function diver() {
  const g = new T.Group(); // badan menghadap +x saat berenang (mendatar)
  const suit = std('#1d1f26', 0.55),
    orange = std('#ff8a1f', 0.5),
    teal = std('#18b6b0', 0.45),
    skin = std('#e9b98a', 0.6),
    hair = std('#4a2c18', 0.7),
    metal = std('#c9cfd6', 0.25, { metalness: 0.8 }),
    black = std('#101114', 0.5);

  const torso = new T.Mesh(new T.CapsuleGeometry(0.2, 0.42, 8, 16), suit);
  torso.rotation.z = Math.PI / 2;
  g.add(torso);
  for (const s of [-1, 1]) {
    const stripe = new T.Mesh(new T.BoxGeometry(0.5, 0.05, 0.02), orange);
    stripe.position.set(0.02, 0.02, s * 0.2);
    g.add(stripe);
  }
  // tabung & rompi
  const tank = new T.Mesh(new T.CapsuleGeometry(0.1, 0.5, 6, 14), metal);
  tank.rotation.z = Math.PI / 2;
  tank.position.set(-0.02, 0.24, 0);
  const valve = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.08, 8), black);
  valve.rotation.z = Math.PI / 2;
  valve.position.set(0.36, 0.24, 0);
  const vest = new T.Mesh(new T.BoxGeometry(0.44, 0.1, 0.44), black);
  vest.position.set(0.05, 0.12, 0);
  g.add(tank, valve, vest);

  // kepala, masker, rambut ikal — dalam satu grup berporos di leher (bisa menoleh saat berdiri)
  const headG = new T.Group();
  headG.position.set(0.36, 0, 0);
  g.add(headG);
  const addH = (...o: T.Object3D[]) => o.forEach((x) => (x.position.x -= 0.36, headG.add(x)));
  const head = new T.Mesh(new T.SphereGeometry(0.17, 22, 16), skin);
  head.position.set(0.5, 0.06, 0);
  addH(head);
  const hairG = new T.Group();
  for (let i = 0; i < 14; i++) {
    const c = new T.Mesh(new T.SphereGeometry(0.075, 10, 8), hair);
    const a = (i / 14) * 6.28;
    c.position.set(0.45 + Math.cos(a) * 0.05, 0.16 + Math.abs(Math.sin(a * 2)) * 0.03, Math.sin(a) * 0.12);
    hairG.add(c);
  }
  addH(hairG);
  const mask = new T.Mesh(new T.TorusGeometry(0.1, 0.028, 8, 20), teal);
  mask.position.set(0.64, 0.08, 0);
  mask.rotation.y = Math.PI / 2;
  mask.scale.set(1, 0.75, 1.5);
  const glass = new T.Mesh(new T.CircleGeometry(0.1, 20), new T.MeshPhysicalMaterial({ color: '#bfefff', roughness: 0.05, transparent: true, opacity: 0.35 }));
  glass.position.set(0.655, 0.08, 0);
  glass.rotation.y = Math.PI / 2;
  glass.scale.set(1.45, 0.72, 1);
  const eyesG = new T.Group();
  for (const s of [-1, 1]) {
    const e = new T.Mesh(new T.SphereGeometry(0.03, 10, 8), std('#1a1a1a', 0.2));
    e.position.set(0.635, 0.09, s * 0.05);
    eyesG.add(e);
  }
  const reg = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.06, 10), black);
  reg.rotation.z = Math.PI / 2;
  reg.position.set(0.66, -0.05, 0);

  addH(mask, glass, eyesG, reg);

  // lengan & kaki (bersendi di bahu/pinggul)
  const limb = (x: number, z: number, len: number, rad: number, m: T.Material, hand: boolean) => {
    const piv = new T.Group();
    piv.position.set(x, -0.02, z);
    const l = new T.Mesh(new T.CapsuleGeometry(rad, len, 6, 10), m);
    l.rotation.z = Math.PI / 2;
    l.position.x = hand ? len / 2 + 0.05 : -len / 2 - 0.05;
    piv.add(l);
    if (hand) {
      const h = new T.Mesh(new T.SphereGeometry(rad * 1.2, 10, 8), black);
      h.position.x = len + 0.12;
      piv.add(h);
    } else {
      const fin = new T.Mesh(new T.BoxGeometry(0.42, 0.02, 0.17), teal);
      fin.position.x = -len - 0.3;
      piv.add(fin);
    }
    g.add(piv);
    return piv;
  };
  const armL = limb(0.28, 0.22, 0.34, 0.06, suit, true),
    armR = limb(0.28, -0.22, 0.34, 0.06, suit, true);
  const legL = limb(-0.3, 0.1, 0.44, 0.075, suit, false),
    legR = limb(-0.3, -0.1, 0.44, 0.075, suit, false);

  // senter (dinyalakan di laut redup)
  const torch = new T.SpotLight('#fff3d6', 0, 14, 0.42, 0.5, 1.2);
  torch.position.set(0.8, 0, 0.22);
  torch.target.position.set(4, -0.6, 0.3);
  const beam = new T.Mesh(
    new T.ConeGeometry(0.9, 4, 20, 1, true),
    beamMaterial(),
  );
  beam.rotation.z = Math.PI / 2;
  beam.position.set(2.8, -0.2, 0.25);
  g.add(torch, torch.target, beam);

  g.userData.setTorch = (k: number) => {
    torch.intensity = k * 30;
    (beam.material as T.MeshBasicMaterial).opacity = k * 0.12;
  };
  /** berdiri: kepala menoleh ke arah perut (depan tubuh saat tegak) */
  let standing = false;
  g.userData.stand = (on: boolean) => {
    standing = on;
    headG.rotation.z = on ? -Math.PI / 2 : 0;
    // lengan menggantung di sisi tubuh saat berdiri
    armL.rotation.z = armR.rotation.z = on ? Math.PI * 0.95 : 0;
  };

  // Model 3D Agam penyelam (Higgsfield: baju selam, BCD, tabung, masker, fin; 24 tulang). GLB tegak (kepala +y,
  // wajah +z) diputar ke rangka penyelam ini: kepala ke +x, punggung/tabung ke +y, perut ke −y; panjang ±2 unit.
  const rig = new AgamModel(
    g,
    () => {
      // senter tetap dipakai
      torch.visible = true;
      torch.target.visible = true;
      beam.visible = true;
    },
    {
      url: '/laut/agam-penyelam-v2.glb',
      fit: (root) => {
        const k = 2.0 / 1.2;
        root.scale.setScalar(k);
        root.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(new T.Vector3(0, 0, -1), new T.Vector3(1, 0, 0), new T.Vector3(0, -1, 0)));
        root.position.set(-1.25, 0, 0);
      },
    },
  );
  g.userData.update = (t: number, kick = 1) => {
    const f = Math.sin(t * 5) * 0.45 * kick;
    legL.rotation.z = f;
    legR.rotation.z = -f;
    armL.rotation.y = 0.25 + Math.sin(t * 1.2) * 0.1;
    armR.rotation.y = -0.25 - Math.sin(t * 1.2) * 0.1;
    // model bertulang: berdiri tegak di kapal, atau berenang dengan kepakan fin bergantian & lengan rapat di badan
    const flutter = Math.sin(t * 5) * 0.32 * kick;
    const pose: AgamPose = standing
      ? { legL: 0, legR: 0, armL: 0, armR: 0, lower: 1 }
      : { legL: flutter, legR: -flutter, armL: 0.35 + Math.sin(t * 1.2) * 0.05, armR: 0.35 - Math.sin(t * 1.2) * 0.05, lower: 1 };
    rig.pose(pose);
  };
  g.scale.setScalar(1.1);
  return g;
}

/* ---------------- kapal selam riset ---------------- */

/**
 * Kapal selam riset (mengikuti kapal selam eksplorasi sungguhan): lambung silinder panjang abu-grafit dengan
 * ujung depan kaca bening (pilot cilik terlihat), ujung belakang berkubah tembaga, rangka pelindung kuning
 * (rel memanjang + cincin), deretan lampu kerja di punggung, dua pod samping berlampu, palka atas dengan cincin
 * kuning, sirip depan kecil, pendorong buritan bercahaya + baling-baling, lampu sorot depan, dan jejak
 * gelembung yang naik dari buritan. Menghadap +x; panjang ±4,6 unit.
 */
export function submersible() {
  const g = new T.Group();
  const hullTex = canvasTex(512, 128, (c, w, h) => {
    const grd = c.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#6b737e');
    grd.addColorStop(0.5, '#4a5059');
    grd.addColorStop(1, '#343941');
    c.fillStyle = grd;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(0,0,0,0.45)';
    c.lineWidth = 3;
    for (let x = 0; x <= w; x += 64) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, h);
      c.stroke();
    }
    c.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 90; i++) c.fillRect(Math.random() * w, Math.random() * h, 3, 3);
  });
  const hullM = std('#ffffff', 0.45, { map: hullTex, metalness: 0.35 });
  const yellow = std('#f2b705', 0.35, { metalness: 0.3 });
  const copper = std('#c8702a', 0.35, { metalness: 0.6 });
  const white = std('#e9edf1', 0.4, { metalness: 0.2 });
  const grey = std('#8d949c', 0.35, { metalness: 0.7 });
  const black = std('#121418', 0.5);
  const glass = new T.MeshPhysicalMaterial({ color: '#cdefff', roughness: 0.04, metalness: 0, transmission: 0.9, transparent: true, opacity: 0.28, depthWrite: false });
  const lampM = new T.MeshBasicMaterial({ color: '#fff4c8' });

  const R = 0.55,
    L = 3.3; // lambung: x −1.65..1.65
  const hull = new T.Mesh(new T.CylinderGeometry(R, R, L, 40, 1, true), hullM);
  hull.rotation.z = Math.PI / 2;
  g.add(hull);
  // buritan berkubah tembaga
  const stern = new T.Mesh(new T.SphereGeometry(R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), copper);
  stern.rotation.z = Math.PI / 2;
  stern.scale.set(1, 0.75, 1);
  stern.position.x = -L / 2;
  g.add(stern);
  // haluan: kubah kaca bening (jendela pandang) dengan bingkai
  const bow = new T.Mesh(new T.SphereGeometry(R * 0.98, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), glass);
  bow.rotation.z = -Math.PI / 2;
  bow.position.x = L / 2;
  g.add(bow);
  const bowRing = new T.Mesh(new T.TorusGeometry(R, 0.05, 10, 40), yellow);
  bowRing.rotation.y = Math.PI / 2;
  bowRing.position.x = L / 2;
  g.add(bowRing);

  // pilot cilik di balik kaca haluan
  const pilot = new T.Group();
  const head = new T.Mesh(new T.SphereGeometry(0.17, 20, 14), std('#e9b98a', 0.6));
  const hair = new T.Mesh(new T.SphereGeometry(0.182, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), std('#4a2c18', 0.7));
  hair.rotation.z = -0.4;
  const body = new T.Mesh(new T.CapsuleGeometry(0.15, 0.16, 6, 12), std('#1d1f26', 0.5));
  body.position.y = -0.3;
  const stripe = new T.Mesh(new T.TorusGeometry(0.15, 0.022, 6, 20), std('#ff8a1f'));
  stripe.rotation.x = Math.PI / 2;
  stripe.position.y = -0.26;
  pilot.add(head, hair, body, stripe);
  for (const s of [-1, 1]) {
    const w = new T.Mesh(new T.SphereGeometry(0.043, 10, 8), std('#fff', 0.2));
    w.position.set(0.13, 0.03, s * 0.06);
    const e = new T.Mesh(new T.SphereGeometry(0.03, 10, 8), std('#111', 0.2));
    e.position.set(0.15, 0.03, s * 0.06);
    pilot.add(w, e);
  }
  pilot.position.set(L / 2 + 0.05, 0.02, 0);
  g.add(pilot);

  // rangka pelindung kuning: 4 rel memanjang + cincin
  const RR = R + 0.12;
  for (const a of [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4]) {
    const rail = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, L + 0.3, 8), yellow);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(-0.05, Math.sin(a) * RR, Math.cos(a) * RR);
    g.add(rail);
  }
  for (const x of [-1.35, -0.55, 0.35, 1.25]) {
    const ring = new T.Mesh(new T.TorusGeometry(RR, 0.028, 8, 40), yellow);
    ring.rotation.y = Math.PI / 2;
    ring.position.x = x;
    g.add(ring);
  }

  // lampu kerja berpasangan di punggung (seperti deretan lampu di atas kapal)
  const glows: T.Sprite[] = [];
  const addLamp = (x: number, y: number, z: number, size = 0.5) => {
    const base = new T.Mesh(new T.CylinderGeometry(0.05, 0.065, 0.08, 12), black);
    base.position.set(x, y, z);
    base.lookAt(x, y * 3, z * 3);
    base.rotateX(Math.PI / 2);
    const bulb = new T.Mesh(new T.SphereGeometry(0.045, 10, 8), lampM);
    bulb.position.set(x, y + Math.sign(y || 1) * 0.04, z + Math.sign(z) * 0.02);
    const gl = glowSprite('#ffe9a8', size, 0.9);
    gl.position.copy(bulb.position);
    g.add(base, bulb, gl);
    glows.push(gl);
  };
  for (const x of [1.05, 0.7, -1.1]) for (const s of [-1, 1]) addLamp(x, R * 0.85, s * R * 0.5);

  // pod samping (tabung putih) dengan lampu di kedua ujung + penyangga
  for (const s of [-1, 1]) {
    const pod = new T.Mesh(new T.CapsuleGeometry(0.17, 0.62, 8, 16), white);
    pod.rotation.z = Math.PI / 2;
    pod.position.set(-0.05, -0.05, s * (RR + 0.26));
    const band = new T.Mesh(new T.CylinderGeometry(0.18, 0.18, 0.08, 16), grey);
    band.rotation.z = Math.PI / 2;
    band.position.copy(pod.position);
    const strut = new T.Mesh(new T.BoxGeometry(0.5, 0.05, 0.3), yellow);
    strut.position.set(-0.05, -0.05, s * (RR + 0.06));
    g.add(pod, band, strut);
    addLamp(0.42, -0.05, s * (RR + 0.44), 0.55);
    addLamp(-0.52, -0.05, s * (RR + 0.44), 0.55);
  }

  // palka atas: kubah kecil + cincin kuning
  const hatch = new T.Mesh(new T.SphereGeometry(0.2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), white);
  hatch.position.set(-0.1, R - 0.02, 0);
  const hatchRing = new T.Mesh(new T.TorusGeometry(0.22, 0.03, 8, 24), yellow);
  hatchRing.rotation.x = Math.PI / 2;
  hatchRing.position.set(-0.1, R, 0);
  g.add(hatch, hatchRing);

  // sirip depan kecil kuning
  for (const s of [-1, 1]) {
    const fin = new T.Mesh(new T.BoxGeometry(0.34, 0.03, 0.26), yellow);
    fin.position.set(1.15, 0.05, s * (R + 0.18));
    g.add(fin);
  }

  // pendorong buritan: selubung + baling-baling + cahaya
  const shroud = new T.Mesh(new T.CylinderGeometry(0.26, 0.26, 0.26, 24, 1, true), black);
  shroud.rotation.z = Math.PI / 2;
  shroud.position.x = -L / 2 - 0.5;
  const shaft = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.35, 8), grey);
  shaft.rotation.z = Math.PI / 2;
  shaft.position.x = -L / 2 - 0.3;
  g.add(shroud, shaft);
  const prop = new T.Group();
  for (let i = 0; i < 4; i++) {
    const b = new T.Mesh(new T.BoxGeometry(0.03, 0.4, 0.09), grey);
    b.rotation.x = (i * Math.PI) / 2;
    prop.add(b);
  }
  prop.position.x = -L / 2 - 0.5;
  g.add(prop);
  const thrustGlow = glowSprite('#ffd27a', 1.4, 0.55);
  thrustGlow.position.x = -L / 2 - 0.75;
  g.add(thrustGlow);

  // lampu sorot depan + berkas cahaya
  const lights: T.SpotLight[] = [];
  const beams: T.Mesh[] = [];
  for (const s of [-1, 1]) {
    const lamp = new T.Mesh(new T.CylinderGeometry(0.1, 0.12, 0.16, 16), black);
    lamp.rotation.z = Math.PI / 2;
    lamp.position.set(1.55, -0.5, s * 0.45);
    const lens = new T.Mesh(new T.CircleGeometry(0.085, 16), lampM);
    lens.position.set(1.64, -0.5, s * 0.45);
    lens.rotation.y = Math.PI / 2;
    const sp = new T.SpotLight('#eaf6ff', 60, 26, 0.45, 0.45, 1.3);
    sp.position.set(1.7, -0.5, s * 0.45);
    sp.target.position.set(9, -2, s * 0.8);
    const beam = new T.Mesh(
      new T.ConeGeometry(1.8, 8, 24, 1, true),
      beamMaterial(),
    );
    beam.rotation.z = Math.PI / 2 + 0.12;
    beam.position.set(5.7, -1.0, s * 0.5);
    const halo = glowSprite('#fff8e0', 0.8, 0.9);
    halo.position.copy(lens.position);
    g.add(lamp, lens, sp, sp.target, beam, halo);
    lights.push(sp);
    beams.push(beam);
  }

  // jejak gelembung dari buritan (naik & melebar, lalu muncul lagi)
  const NB = 60;
  const bubPos = new Float32Array(NB * 3);
  const bubSeed = Array.from({ length: NB }, (_, i) => ({ t: (i / NB) * 3, dz: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.2 }));
  const bubGeo = new T.BufferGeometry();
  bubGeo.setAttribute('position', new T.BufferAttribute(bubPos, 3));
  const bubbles = new T.Points(bubGeo, new T.PointsMaterial({ color: '#eaf8ff', size: 0.12, map: glow(), transparent: true, opacity: 0.8, depthWrite: false }));
  bubbles.frustumCulled = false;
  g.add(bubbles);

  g.userData.setLights = (k: number) => {
    lights.forEach((l) => (l.intensity = 60 * k));
    beams.forEach((b) => ((b.material as T.MeshBasicMaterial).opacity = 0.08 * k));
    glows.forEach((s) => (s.material.opacity = 0.35 + 0.55 * k));
    thrustGlow.material.opacity = 0.2 + 0.4 * k;
  };
  let last = 0;
  g.userData.update = (t: number) => {
    const dt = Math.min(0.1, Math.max(0, t - last));
    last = t;
    prop.rotation.x = t * 12;
    pilot.rotation.y = Math.sin(t * 0.4) * 0.3;
    thrustGlow.scale.setScalar(1.3 + Math.sin(t * 9) * 0.1);
    for (let i = 0; i < NB; i++) {
      const b = bubSeed[i];
      b.t = (b.t + dt) % 3;
      const k = b.t / 3;
      bubPos[i * 3] = -L / 2 - 0.7 - k * 2.6;
      bubPos[i * 3 + 1] = b.dy + k * k * 1.6 + Math.sin(t * 3 + i) * 0.03;
      bubPos[i * 3 + 2] = b.dz * (1 + k * 3);
    }
    bubGeo.attributes.position.needsUpdate = true;
  };
  return g;
}

/* ---------------- kapal penyelam di permukaan ---------------- */

export function boat() {
  const g = new T.Group();
  const white = std('#f4f6f8', 0.4),
    blue = std('#1d5fa8', 0.4),
    wood = std('#b98a5a', 0.7),
    orange = std('#ff6a1a', 0.5);
  const s = new T.Shape();
  s.moveTo(-4, 0.6);
  s.lineTo(3.2, 0.6);
  s.quadraticCurveTo(4.6, 0.6, 5, 1.6);
  s.lineTo(-4.2, 1.6);
  s.closePath();
  const hull = new T.ExtrudeGeometry(s, { depth: 3, bevelEnabled: true, bevelSize: 0.2, bevelThickness: 0.2, bevelSegments: 3 });
  hull.translate(0, -0.9, -1.5);
  g.add(new T.Mesh(hull, white));
  const stripe = new T.Mesh(new T.BoxGeometry(8.6, 0.18, 3.45), blue);
  stripe.position.set(0.3, 0.2, 0);
  g.add(stripe);
  const deck = new T.Mesh(new T.BoxGeometry(8.4, 0.08, 3), wood);
  deck.position.set(0.2, 0.72, 0);
  g.add(deck);
  const cabin = new T.Mesh(new T.BoxGeometry(2.6, 1.6, 2.4), white);
  cabin.position.set(-2.2, 1.55, 0);
  const roof = new T.Mesh(new T.BoxGeometry(3, 0.12, 2.8), blue);
  roof.position.set(-2.2, 2.4, 0);
  g.add(cabin, roof);
  const sign = canvasTex(512, 256, (c, w, h) => {
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, w, h);
    c.fillStyle = '#1d3f7a';
    c.font = '900 50px system-ui, sans-serif';
    c.textAlign = 'center';
    c.fillText('EKSPLORASI', w / 2, 70);
    c.fillText('EDUKASI', w / 2, 135);
    c.fillText('KONSERVASI', w / 2, 200);
  });
  const pl = new T.Mesh(new T.PlaneGeometry(1.4, 0.7), std('#fff', 0.5, { map: sign }));
  pl.position.set(-2.2, 1.6, 1.21);
  g.add(pl);
  for (const s2 of [-1, 1]) {
    const win = new T.Mesh(new T.PlaneGeometry(0.7, 0.5), std('#6fb7e6', 0.1, { metalness: 0.3 }));
    win.position.set(-0.89, 1.8, s2 * 0.6);
    win.rotation.y = Math.PI / 2;
    g.add(win);
  }
  const ring = new T.Mesh(new T.TorusGeometry(0.3, 0.09, 10, 24), orange);
  ring.position.set(-0.85, 1.4, 0);
  ring.rotation.y = Math.PI / 2;
  g.add(ring);
  // tangga selam & perlengkapan di dek
  for (let i = 0; i < 4; i++) {
    const rung = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.5, 6), std('#c9cfd6', 0.3, { metalness: 0.8 }));
    rung.rotation.x = Math.PI / 2;
    rung.position.set(-4.3, 0.5 - i * 0.3, 0);
    g.add(rung);
  }
  for (let i = 0; i < 2; i++) {
    const tank = new T.Mesh(new T.CapsuleGeometry(0.1, 0.5, 6, 12), std('#c9cfd6', 0.25, { metalness: 0.8 }));
    tank.position.set(1 + i * 0.3, 1.1, -1.1);
    g.add(tank);
  }
  const box = new T.Mesh(new T.BoxGeometry(0.7, 0.4, 0.5), std('#2a2c33', 0.6));
  box.position.set(2, 0.96, 1);
  g.add(box);
  // tiang & bendera Merah Putih
  const pole = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 2.6, 8), std('#dfe3e8', 0.3, { metalness: 0.6 }));
  pole.position.set(-3.6, 2.1, 0);
  const flagTex = canvasTex(64, 40, (c) => {
    c.fillStyle = '#e0262b';
    c.fillRect(0, 0, 64, 20);
    c.fillStyle = '#fff';
    c.fillRect(0, 20, 64, 20);
  });
  const flag = new T.Mesh(new T.PlaneGeometry(0.9, 0.56, 10, 1), new T.MeshStandardMaterial({ map: flagTex, side: T.DoubleSide, roughness: 0.8 }));
  flag.position.set(-4.08, 3.1, 0);
  g.add(pole, flag);
  // Clean geometry replaces the baked reconstruction: deck boards, rails and pressure cylinders.
  const steel = surfaceMaterial('#b8c7cc', 'metal');
  const rubber = std('#25343a', 0.9);
  const ropeM = std('#cbbda0', 0.9);
  const bar = (a: T.Vector3, b: T.Vector3, radius: number, material: T.Material) => {
    const d=b.clone().sub(a); const o=new T.Mesh(new T.CylinderGeometry(radius,radius,d.length(),12),material);
    o.position.copy(a).lerp(b,0.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());g.add(o);
  };
  for(const side of [-1,1]) {
    for(let x=-4;x<4.7;x+=0.85) bar(new T.Vector3(x,0.8,side*1.45),new T.Vector3(x,1.52,side*1.45),0.026,steel);
    for(const y of [1.13,1.52]) bar(new T.Vector3(-4,y,side*1.45),new T.Vector3(4.5,y,side*1.45),0.024,steel);
    for(let x=-3.8;x<4;x+=1.9) {
      const f=new T.Mesh(new T.CapsuleGeometry(0.13,0.5,8,16),rubber);f.position.set(x,0.1,side*1.75);g.add(f);
      bar(new T.Vector3(x,0.35,side*1.75),new T.Vector3(x,1.13,side*1.45),0.015,ropeM);
    }
    for(let x=-3.1;x<-1;x+=0.8) {
      const frame=new T.Mesh(new T.BoxGeometry(0.69,0.68,0.065),steel);frame.position.set(x,1.65,side*1.24);g.add(frame);
      const glass=new T.Mesh(new T.BoxGeometry(0.6,0.59,0.075),new T.MeshPhysicalMaterial({color:'#123d4f',roughness:0.12,metalness:0.15,clearcoat:1}));glass.position.copy(frame.position);glass.position.z+=side*0.025;g.add(glass);
    }
  }
  for(let i=0;i<5;i++) {
    const x=0.1+i*0.32;
    const tank=new T.Mesh(new T.CapsuleGeometry(0.115,0.6,10,20),std('#dfc466',0.34,{metalness:0.4}));tank.position.set(x,1.12,-1.12);g.add(tank);
    for(const y of [0.9,1.27]) {const strap=new T.Mesh(new T.TorusGeometry(0.118,0.015,6,20),rubber);strap.rotation.x=Math.PI/2;strap.position.set(x,y,-1.12);g.add(strap);}
    bar(new T.Vector3(x,1.52,-1.12),new T.Vector3(x,1.65,-1.12),0.028,steel);
  }
  for(let i=0;i<8;i++){const coil=new T.Mesh(new T.TorusGeometry(0.15+i*0.018,0.018,8,40),ropeM);coil.rotation.x=Math.PI/2;coil.position.set(3.6,0.81,0.7);g.add(coil);}
  const deckM=surfaceMaterial('#9d8260');
  for(let z=-1.36;z<1.4;z+=0.16){const board=new T.Mesh(new T.BoxGeometry(8.2,0.022,0.146),deckM);board.position.set(0.2,0.776,z);g.add(board);}
  g.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});
  g.userData.update = (t: number) => {
    const p = flag.geometry.attributes.position as T.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      p.setZ(i, Math.sin(t * 4 + x * 5) * 0.06 * (0.45 - x));
    }
    p.needsUpdate = true;
    g.rotation.z = Math.sin(t * 0.8) * 0.02;
    g.rotation.x = Math.sin(t * 0.6) * 0.015;
    g.position.y = Math.sin(t * 0.9) * 0.05;
  };
  return g;
}

/* ---------------- dasar laut ---------------- */

/** Karang warna-warni (bercabang, otak, meja, kipas, jari). */
export function coral(kind: number, color: string, r: () => number) {
  const g = new T.Group();
  const m = surfaceMaterial(color, 'coral');
  if (kind === 0) {
    // bercabang
    const branch = (p: T.Vector3, dir: T.Vector3, len: number, depth: number) => {
      const end = p.clone().addScaledVector(dir, len);
      const b = new T.Mesh(new T.CylinderGeometry(0.035 * (depth + 1) * 0.5, 0.05 * (depth + 1) * 0.5, len, 10), m);
      b.position.copy(p).lerp(end, 0.5);
      b.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
      g.add(b);
      if (depth > 0)
        for (let i = 0; i < 2; i++) {
          const d = dir.clone().add(new T.Vector3((r() - 0.5) * 1.2, 0.3, (r() - 0.5) * 1.2)).normalize();
          branch(end, d, len * 0.75, depth - 1);
        }
      else {
        const tip = new T.Mesh(new T.SphereGeometry(0.035, 10, 8), m);
        tip.position.copy(end);
        g.add(tip);
      }
    };
    branch(new T.Vector3(), new T.Vector3(0, 1, 0), 0.35, 3);
  } else if (kind === 1) {
    // karang otak
    const geo = reefGeometry(0.5, 3);
    m.vertexColors = true;
    g.add(new T.Mesh(geo, m));
  } else if (kind === 2) {
    // karang meja
    const stem = new T.Mesh(new T.CylinderGeometry(0.06, 0.1, 0.5, 8), m);
    stem.position.y = 0.25;
    const top = new T.Mesh(new T.CylinderGeometry(0.7, 0.45, 0.07, 48, 3), m);
    top.position.y = 0.52;
    g.add(stem, top);
  } else if (kind === 3) {
    // kipas laut
    const fan = new T.Mesh(
      new T.CircleGeometry(0.6, 20, 0, Math.PI),
      new T.MeshStandardMaterial({
        color,
        side: T.DoubleSide,
        roughness: 0.7,
        alphaTest: 0.5,
        alphaMap: canvasTex(128, 128, (c) => {
          c.fillStyle = '#000';
          c.fillRect(0, 0, 128, 128);
          c.strokeStyle = '#fff';
          c.lineWidth = 3;
          for (let i = 0; i < 60; i++) {
            c.beginPath();
            c.moveTo(64, 128);
            c.lineTo(64 + Math.cos(Math.PI + (i / 60) * Math.PI) * 64, 128 + Math.sin(Math.PI + (i / 60) * Math.PI) * 128);
            c.stroke();
          }
          for (let k = 1; k < 8; k++) {
            c.beginPath();
            c.arc(64, 128, k * 16, Math.PI, 0);
            c.stroke();
          }
        }),
      }),
    );
    g.add(fan);
  } else {
    // karang jari / tabung
    for (let i = 0; i < 9; i++) {
      const h = 0.2 + r() * 0.4;
      const f = new T.Mesh(new T.CapsuleGeometry(0.05, h, 4, 8), m);
      f.position.set((r() - 0.5) * 0.35, h / 2 + 0.05, (r() - 0.5) * 0.35);
      f.rotation.set((r() - 0.5) * 0.5, 0, (r() - 0.5) * 0.5);
      g.add(f);
    }
  }
  return mergeSpecimen(g);
}

/** jumlah "pendorong" lamun: biota/penyelam/kamera + jejak geraknya (lihat engine.pushSeagrass) */
export const SEAGRASS_PUSHERS = 16;

/**
 * Hamparan lamun (satu InstancedMesh helai, bergoyang di shader). Helai merespon benda yang lewat: tiap
 * pendorong (xyz dunia, w = jari-jari) menyibakkan helai menjauh & sedikit merunduk, makin kuat makin dekat;
 * helai yang ujungnya tidak sampai ke ketinggian benda tidak ikut tersibak. Jejak posisi lama dengan jari-jari
 * mengecil membuat helai tegak kembali perlahan setelah benda lewat.
 */
export function seagrass(count: number, radius: number, uTime: { value: number }, seed = 3) {
  const r = rng(seed);
  const blade = new T.PlaneGeometry(0.07, 1.4, 1, 6);
  blade.translate(0, 0.5, 0);
  const push = Array.from({ length: SEAGRASS_PUSHERS }, () => new T.Vector4(0, -9999, 0, 0));
  const m = new T.MeshStandardMaterial({ color: '#4f9a3a', roughness: 0.6, side: T.DoubleSide });
  m.onBeforeCompile = (s) => {
    s.uniforms.uTime = uTime;
    s.uniforms.uPush = { value: push };
    s.vertexShader = s.vertexShader
      .replace('#include <common>', `#include <common>\nuniform float uTime;\nuniform vec4 uPush[${SEAGRASS_PUSHERS}];`)
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
      float ph = instanceMatrix[3].x * 0.9 + instanceMatrix[3].z * 0.7;
      transformed.x += sin(uTime * 1.3 + ph) * position.y * position.y * 0.25;
      transformed.z += cos(uTime * 1.0 + ph) * position.y * position.y * 0.12;`,
      )
      .replace(
        '#include <project_vertex>',
        `vec4 mvPosition = instanceMatrix * vec4(transformed, 1.0);
      vec4 wpos = modelMatrix * mvPosition;
      vec3 root = (modelMatrix * instanceMatrix * vec4(0.0, -0.2, 0.0, 1.0)).xyz;
      float topY = (modelMatrix * instanceMatrix * vec4(0.0, 1.2, 0.0, 1.0)).y;
      float bend = clamp((position.y + 0.2) / 1.4, 0.0, 1.0);
      bend *= bend;
      vec3 shove = vec3(0.0);
      for (int i = 0; i < ${SEAGRASS_PUSHERS}; i++) {
        vec4 P = uPush[i];
        if (P.w <= 0.0) continue;
        vec2 d = root.xz - P.xz;
        float dist = length(d);
        float k = 1.0 - smoothstep(P.w * 0.25, P.w * 1.15, dist);
        k *= smoothstep(P.y - P.w - 0.25, P.y - P.w * 0.2, topY); // ujung helai mencapai benda?
        vec2 dir = dist > 0.0001 ? d / dist : vec2(1.0, 0.0);
        shove.xz += dir * k * P.w * 0.95;
        shove.y -= k * P.w * 0.45;
      }
      float sl = length(shove.xz);
      if (sl > 1.1) shove *= 1.1 / sl;
      wpos.xyz += shove * bend;
      mvPosition = viewMatrix * wpos;
      gl_Position = projectionMatrix * mvPosition;`,
      );
  };
  const im = new T.InstancedMesh(blade, m, count);
  const d = new T.Object3D();
  const c = new T.Color();
  for (let i = 0; i < count; i++) {
    const a = r() * 6.28,
      rr = Math.sqrt(r()) * radius;
    d.position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr);
    d.rotation.set(0, r() * 6.28, 0);
    d.scale.set(1, 0.6 + r() * 1.1, 1);
    d.updateMatrix();
    im.setMatrixAt(i, d.matrix);
    im.setColorAt(i, c.setHSL(0.26 + r() * 0.06, 0.5, 0.3 + r() * 0.15));
  }
  im.userData.push = push;
  im.frustumCulled = false; // helai yang tersibak bisa keluar dari kotak batas awal
  return im;
}

/** Dasar laut: pasir berombak / lumpur / batuan gelap, dengan kilau kaustik (cahaya dari permukaan). */
export function seabed(size: number, color: string, uTime: { value: number }, caustic: number, rough = 0.15, seed = 5) {
  const r = rng(seed);
  const geo = new T.PlaneGeometry(size, size, 80, 80);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  const ph = [r() * 6, r() * 6, r() * 6];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      z = p.getZ(i);
    const h = Math.sin(x * 0.25 + ph[0]) * Math.cos(z * 0.21 + ph[1]) * 0.6 + Math.sin(x * 1.3 + z * 0.4) * 0.05 + Math.sin((x + z) * 0.08 + ph[2]) * 1.2;
    p.setY(i, h * rough * 3);
  }
  geo.computeVertexNormals();
  const sand = new T.TextureLoader().load('/laut/realism/seabed-sand.webp');
  sand.colorSpace = T.SRGBColorSpace; sand.wrapS = sand.wrapT = T.RepeatWrapping;
  sand.repeat.set(size / 4.5, size / 4.5); sand.anisotropy = 8;
  const m = new T.MeshStandardMaterial({ color, map: sand, bumpMap: sand, bumpScale: 0.028, roughness: 0.93 });
  m.onBeforeCompile = (s) => {
    s.uniforms.uTime = uTime;
    s.uniforms.uCaustic = { value: caustic };
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWp = (modelMatrix * vec4(transformed,1.0)).xyz;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWp; uniform float uTime; uniform float uCaustic;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        // kaustik: dua lapis pola cahaya bergerak (besar & halus), lembut, memudar di kejauhan
        vec2 cp = vWp.xz * 0.9;
        float c1 = sin(cp.x * 1.7 + uTime * 1.1 + sin(cp.y * 1.3 + uTime * 0.7));
        float c2 = sin(cp.y * 1.9 - uTime * 0.9 + sin(cp.x * 1.1 - uTime * 0.6));
        float ca = pow(max(0.0, 1.0 - abs(c1 + c2) * 0.7), 3.0);
        vec2 cq = vWp.xz * 2.3;
        float c3 = sin(cq.x * 1.3 - uTime * 1.4 + sin(cq.y * 1.7 + uTime * 0.9));
        float c4 = sin(cq.y * 1.1 + uTime * 1.2 + sin(cq.x * 1.5 - uTime * 0.8));
        float cb = pow(max(0.0, 1.0 - abs(c3 + c4) * 0.8), 3.0);
        float far = 1.0 - smoothstep(8.0, 40.0, distance(vWp, cameraPosition));
        totalEmissiveRadiance += vec3(0.7, 0.93, 1.0) * (ca * 0.6 + cb * 0.35) * uCaustic * far;`,
      );
  };
  const mesh = new T.Mesh(geo, m);
  return mesh;
}

/** Batu/bongkah laut. */
export function rock(size: number, color: string, r: () => number) {
  const geo = new T.IcosahedronGeometry(size, 3);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const v = new T.Vector3().fromBufferAttribute(p, i);
    v.multiplyScalar(1 + (Math.sin(v.x * 5 + v.y * 3) * 0.08 + Math.sin(v.z * 7) * 0.06));
    p.setXYZ(i, v.x, v.y * 0.7, v.z);
  }
  // IcosahedronGeometry is non-indexed; weld shared positions before averaging normals.
  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  const smoothGeo = mergeVertices(geo);
  geo.dispose();
  smoothGeo.computeVertexNormals();
  const m = new T.Mesh(smoothGeo, surfaceMaterial(color, 'rock'));
  m.rotation.set(r(), r() * 6, r());
  return m;
}

/** Cerobong hidrotermal ("perokok hitam") dengan semburan asap gelap. */
export function blackSmoker(h: number, uTime: { value: number }) {
  const g = new T.Group();
  const geo = new T.CylinderGeometry(0.35, 0.9, h, 14, 10);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const v = new T.Vector3().fromBufferAttribute(p, i);
    const k = 1 + Math.sin(v.y * 3 + Math.atan2(v.z, v.x) * 3) * 0.15;
    p.setXYZ(i, v.x * k, v.y, v.z * k);
  }
  geo.computeVertexNormals();
  const tex = canvasTex(128, 256, (c, w, hh) => {
    c.fillStyle = '#2a2622';
    c.fillRect(0, 0, w, hh);
    for (let i = 0; i < 400; i++) {
      c.fillStyle = ['#4a3f33', '#6b5a3a', '#1a1714', '#8a6a2a'][i % 4];
      c.fillRect((i * 37) % w, (i * 61) % hh, 4 + (i % 5), 3 + (i % 4));
    }
  });
  const chim = new T.Mesh(geo, std('#ffffff', 0.95, { map: tex }));
  chim.position.y = h / 2;
  g.add(chim);
  const glowTip = glowSprite('#ff7a2a', 0.8, 0.5);
  glowTip.position.y = h;
  g.add(glowTip);
  // asap: partikel naik
  const n = 90;
  const pos = new Float32Array(n * 3),
    seed = new Float32Array(n);
  for (let i = 0; i < n; i++) seed[i] = i / n;
  const pg = new T.BufferGeometry();
  pg.setAttribute('position', new T.BufferAttribute(pos, 3));
  pg.setAttribute('aSeed', new T.BufferAttribute(seed, 1));
  const pm = new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime, uH: { value: h } },
    vertexShader: `attribute float aSeed; uniform float uTime; uniform float uH; varying float vA;
      void main(){ float t = fract(aSeed + uTime * 0.12);
        vec3 p = vec3(sin(aSeed*91.0 + uTime*0.8) * t * 1.2, uH + t * 6.0, cos(aSeed*57.0 + uTime*0.7) * t * 1.2);
        vA = (1.0 - t) * smoothstep(0.0, 0.1, t);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (40.0 + t * 220.0) / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
        gl_FragColor = vec4(0.09, 0.08, 0.07, vA * (1.0 - d * 2.0) * 0.8); }`,
  });
  const smoke = new T.Points(pg, pm);
  smoke.frustumCulled = false;
  g.add(smoke);
  return g;
}
