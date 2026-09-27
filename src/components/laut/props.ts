// Tokoh & benda Petualangan Bawah Laut: penyelam cilik (baju selam hitam-oranye, masker toska, tabung,
// sirip), kapal selam mini "Ocean Explorer" kuning berkubah kaca, kapal penyelam, dan isi dasar laut
// (karang, lamun, batu, cerobong hidrotermal).

import * as T from 'three';
import { canvasTex, glowSprite } from './creatures';

const std = (color: T.ColorRepresentation, rough = 0.6, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color, roughness: rough, ...extra });

export const rng = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

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
    new T.MeshBasicMaterial({ color: '#fff4d0', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }),
  );
  beam.rotation.z = Math.PI / 2;
  beam.position.set(2.8, -0.2, 0.25);
  g.add(torch, torch.target, beam);

  g.userData.setTorch = (k: number) => {
    torch.intensity = k * 30;
    (beam.material as T.MeshBasicMaterial).opacity = k * 0.12;
  };
  /** berdiri: kepala menoleh ke arah perut (depan tubuh saat tegak) */
  g.userData.stand = (on: boolean) => {
    headG.rotation.z = on ? -Math.PI / 2 : 0;
    // lengan menggantung di sisi tubuh saat berdiri
    armL.rotation.z = armR.rotation.z = on ? Math.PI * 0.95 : 0;
  };
  g.userData.update = (t: number, kick = 1) => {
    const f = Math.sin(t * 5) * 0.45 * kick;
    legL.rotation.z = f;
    legR.rotation.z = -f;
    armL.rotation.y = 0.25 + Math.sin(t * 1.2) * 0.1;
    armR.rotation.y = -0.25 - Math.sin(t * 1.2) * 0.1;
  };
  g.scale.setScalar(1.1);
  return g;
}

/* ---------------- kapal selam mini ---------------- */

export function submersible() {
  const g = new T.Group(); // menghadap +x
  const yellow = std('#f5b914', 0.35, { metalness: 0.2 }),
    black = std('#15161a', 0.5),
    grey = std('#8d949c', 0.4, { metalness: 0.6 });
  const hull = new T.Mesh(new T.CapsuleGeometry(0.75, 1.4, 10, 24), yellow);
  hull.rotation.z = Math.PI / 2;
  hull.position.x = -0.4; // ujung depan terbuka untuk kubah kaca
  g.add(hull);
  const label = canvasTex(512, 128, (c, w, h) => {
    c.fillStyle = '#f5b914';
    c.fillRect(0, 0, w, h);
    c.fillStyle = '#15161a';
    c.font = '900 58px system-ui, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('OCEAN EXPLORER', w / 2, h / 2);
  });
  for (const s of [-1, 1]) {
    const pl = new T.Mesh(new T.PlaneGeometry(1.3, 0.32), std('#ffffff', 0.4, { map: label }));
    pl.position.set(-0.2, 0.25, s * 0.755);
    if (s < 0) pl.rotation.y = Math.PI;
    g.add(pl);
  }
  // kubah kaca di depan (kepala penjelajah terlihat)
  const dome = new T.Mesh(
    new T.SphereGeometry(0.72, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new T.MeshStandardMaterial({ color: '#dff6ff', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.18, depthWrite: false }),
  );
  dome.rotation.z = -Math.PI / 2;
  dome.position.x = 1.05;
  g.add(dome);
  const ring = new T.Mesh(new T.TorusGeometry(0.73, 0.06, 10, 32), black);
  ring.rotation.y = Math.PI / 2;
  ring.position.x = 1.05;
  g.add(ring);
  // pilot cilik di dalam kubah
  const pilot = new T.Group();
  const head = new T.Mesh(new T.SphereGeometry(0.2, 20, 14), std('#e9b98a', 0.6));
  const hair = new T.Mesh(new T.SphereGeometry(0.215, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), std('#4a2c18', 0.7));
  hair.rotation.z = -0.4;
  const body = new T.Mesh(new T.CapsuleGeometry(0.17, 0.2, 6, 12), std('#1d1f26', 0.5));
  body.position.y = -0.35;
  const stripe = new T.Mesh(new T.TorusGeometry(0.17, 0.025, 6, 20), std('#ff8a1f'));
  stripe.rotation.x = Math.PI / 2;
  stripe.position.y = -0.3;
  pilot.add(head, hair, body, stripe);
  for (const s of [-1, 1]) {
    const e = new T.Mesh(new T.SphereGeometry(0.035, 10, 8), std('#111', 0.2));
    e.position.set(0.17, 0.03, s * 0.07);
    const w = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), std('#fff', 0.2));
    w.position.set(0.15, 0.03, s * 0.07);
    pilot.add(w, e);
  }
  pilot.position.set(1.25, 0.12, 0);
  g.add(pilot);
  // pendorong & rangka
  for (const s of [-1, 1]) {
    const th = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.45, 18, 1, true), black);
    th.rotation.z = Math.PI / 2;
    th.position.set(-0.9, -0.45, s * 0.85);
    const skid = new T.Mesh(new T.BoxGeometry(2.6, 0.08, 0.1), grey);
    skid.position.set(0.1, -0.85, s * 0.5);
    g.add(th, skid);
  }
  const tail = new T.Mesh(new T.CylinderGeometry(0.25, 0.25, 0.3, 18, 1, true), black);
  tail.rotation.z = Math.PI / 2;
  tail.position.x = -1.95;
  g.add(tail);
  const prop = new T.Group();
  for (let i = 0; i < 3; i++) {
    const b = new T.Mesh(new T.BoxGeometry(0.03, 0.4, 0.08), grey);
    b.rotation.x = (i * Math.PI * 2) / 3;
    prop.add(b);
  }
  prop.position.x = -2.05;
  g.add(prop);
  // lampu depan + berkas cahaya
  const lights: T.SpotLight[] = [];
  const beams: T.Mesh[] = [];
  for (const s of [-1, 1]) {
    const lamp = new T.Mesh(new T.CylinderGeometry(0.12, 0.14, 0.18, 16), black);
    lamp.rotation.z = Math.PI / 2;
    lamp.position.set(0.95, -0.55, s * 0.6);
    const lens = new T.Mesh(new T.CircleGeometry(0.1, 16), new T.MeshBasicMaterial({ color: '#fffbe8' }));
    lens.position.set(1.05, -0.55, s * 0.6);
    lens.rotation.y = Math.PI / 2;
    const sp = new T.SpotLight('#eaf6ff', 60, 26, 0.45, 0.45, 1.3);
    sp.position.set(1.1, -0.55, s * 0.6);
    sp.target.position.set(8, -2, s * 0.8);
    const beam = new T.Mesh(
      new T.ConeGeometry(1.8, 8, 24, 1, true),
      new T.MeshBasicMaterial({ color: '#dff1ff', transparent: true, opacity: 0.08, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }),
    );
    beam.rotation.z = Math.PI / 2 + 0.12;
    beam.position.set(5.1, -1.05, s * 0.68);
    const halo = glowSprite('#fff8e0', 0.9, 0.9);
    halo.position.copy(lens.position);
    g.add(lamp, lens, sp, sp.target, beam, halo);
    lights.push(sp);
    beams.push(beam);
  }
  // lengan robot
  const arm = new T.Group();
  const a1 = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.6, 8), grey);
  a1.rotation.z = Math.PI / 2 - 0.5;
  a1.position.set(0.25, 0, 0);
  const a2 = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.45, 8), grey);
  a2.rotation.z = Math.PI / 2 + 0.4;
  a2.position.set(0.6, -0.12, 0);
  arm.add(a1, a2);
  arm.position.set(0.8, -0.8, 0);
  g.add(arm);

  g.userData.setLights = (k: number) => {
    lights.forEach((l) => (l.intensity = 60 * k));
    beams.forEach((b) => ((b.material as T.MeshBasicMaterial).opacity = 0.07 * k));
  };
  g.userData.update = (t: number) => {
    prop.rotation.x = t * 12;
    arm.rotation.z = Math.sin(t * 0.5) * 0.1;
    pilot.rotation.y = Math.sin(t * 0.4) * 0.3;
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
  const m = std(color, 0.75, { emissive: color, emissiveIntensity: 0.05 });
  if (kind === 0) {
    // bercabang
    const branch = (p: T.Vector3, dir: T.Vector3, len: number, depth: number) => {
      const end = p.clone().addScaledVector(dir, len);
      const b = new T.Mesh(new T.CylinderGeometry(0.035 * (depth + 1) * 0.5, 0.05 * (depth + 1) * 0.5, len, 6), m);
      b.position.copy(p).lerp(end, 0.5);
      b.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
      g.add(b);
      if (depth > 0)
        for (let i = 0; i < 2; i++) {
          const d = dir.clone().add(new T.Vector3((r() - 0.5) * 1.2, 0.3, (r() - 0.5) * 1.2)).normalize();
          branch(end, d, len * 0.75, depth - 1);
        }
      else {
        const tip = new T.Mesh(new T.SphereGeometry(0.035, 6, 5), m);
        tip.position.copy(end);
        g.add(tip);
      }
    };
    branch(new T.Vector3(), new T.Vector3(0, 1, 0), 0.35, 3);
  } else if (kind === 1) {
    // karang otak
    const geo = new T.SphereGeometry(0.5, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const v = new T.Vector3().fromBufferAttribute(p, i);
      const a = Math.atan2(v.z, v.x),
        e = Math.acos(Math.min(1, v.y / 0.5));
      v.multiplyScalar(1 + Math.sin(a * 14 + Math.sin(e * 9) * 2) * 0.04);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    g.add(new T.Mesh(geo, m));
  } else if (kind === 2) {
    // karang meja
    const stem = new T.Mesh(new T.CylinderGeometry(0.06, 0.1, 0.5, 8), m);
    stem.position.y = 0.25;
    const top = new T.Mesh(new T.CylinderGeometry(0.7, 0.45, 0.07, 16), m);
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
  return g;
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
  const m = new T.MeshStandardMaterial({ color, roughness: 0.95 });
  m.onBeforeCompile = (s) => {
    s.uniforms.uTime = uTime;
    s.uniforms.uCaustic = { value: caustic };
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWp = (modelMatrix * vec4(transformed,1.0)).xyz;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWp; uniform float uTime; uniform float uCaustic;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        vec2 cp = vWp.xz * 0.9;
        float c1 = sin(cp.x * 1.7 + uTime * 1.1 + sin(cp.y * 1.3 + uTime * 0.7));
        float c2 = sin(cp.y * 1.9 - uTime * 0.9 + sin(cp.x * 1.1 - uTime * 0.6));
        float ca = pow(max(0.0, 1.0 - abs(c1 + c2) * 0.9), 4.0);
        totalEmissiveRadiance += vec3(0.75, 0.95, 1.0) * ca * uCaustic;`,
      );
  };
  const mesh = new T.Mesh(geo, m);
  return mesh;
}

/** Batu/bongkah laut. */
export function rock(size: number, color: string, r: () => number) {
  const geo = new T.DodecahedronGeometry(size, 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const v = new T.Vector3().fromBufferAttribute(p, i);
    v.multiplyScalar(1 + (Math.sin(v.x * 5 + v.y * 3) * 0.08 + Math.sin(v.z * 7) * 0.06));
    p.setXYZ(i, v.x, v.y * 0.7, v.z);
  }
  geo.computeVertexNormals();
  const m = new T.Mesh(geo, std(color, 0.95));
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
