// Model-model prosedural Petualangan ke Dalam Bumi: Agam si penjelajah gua (helm kuning berlampu, rompi
// oranye, ransel & tali), kapsul bor "Geo Explorer", perahu karet, hewan tanah & gua, fosil, kristal.

import * as T from 'three';

const TAU = Math.PI * 2;

export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!, w, h);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

let glowTex: T.Texture | null = null;
export function glow() {
  if (!glowTex)
    glowTex = canvasTex(64, 64, (g, w) => {
      const q = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      q.addColorStop(0, 'rgba(255,255,255,1)');
      q.addColorStop(0.35, 'rgba(255,255,255,.5)');
      q.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = q;
      g.fillRect(0, 0, w, w);
    });
  return glowTex;
}

export function glowSprite(color: string, size: number, opacity = 1) {
  const s = new T.Sprite(new T.SpriteMaterial({ map: glow(), color, transparent: true, opacity, blending: T.AdditiveBlending, depthWrite: false }));
  s.scale.setScalar(size);
  return s;
}

const std = (color: T.ColorRepresentation, o: Partial<T.MeshStandardMaterialParameters> = {}) => new T.MeshStandardMaterial({ color, roughness: 0.7, ...o });

/** Batu bergelombang (icosahedron yang diacak). */
export function rock(size: number, color: string, r: () => number, flat = 0.6) {
  const g = new T.IcosahedronGeometry(size, 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const k = 0.86 + r() * 0.22;
    p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * flat, p.getZ(i) * k);
  }
  g.computeVertexNormals();
  const m = new T.Mesh(g, std(color, { roughness: 1, flatShading: true }));
  return m;
}

/* ---------------- Agam, penjelajah gua ---------------- */

export interface Explorer {
  root: T.Group;
  armL: T.Group;
  armR: T.Group;
  legL: T.Group;
  legR: T.Group;
  lamp: T.SpotLight | null;
  /** titik lampu kepala (untuk memosisikan lampu sorot di luar grup) */
  lens: T.Object3D;
  beam: T.Mesh;
  /** 0 = diam, 1 = berjalan */
  update: (t: number, walk: number) => void;
  setLamp: (on: number) => void;
}

export function explorer(withLamp = true): Explorer {
  const a = new T.Group();
  const skin = std(0xe8b48a, { roughness: 0.55 });
  const hair = std(0x3b2414, { roughness: 0.6 });
  const shirt = std(0x1f2f7a, { roughness: 0.8 });
  const vest = std(0xf07a1f, { roughness: 0.6 });
  const refl = std(0xf2f2e8, { roughness: 0.3, metalness: 0.4, emissive: 0x333322 });
  const pants = std(0x8a7350, { roughness: 0.9 });
  const boot = std(0x5a3a22, { roughness: 0.8 });
  const helm = std(0xffc21a, { roughness: 0.35 });
  const dark = std(0x2c2f38, { roughness: 0.6 });

  // badan: kaus dongker + rompi oranye bergaris pemantul
  const torso = new T.Mesh(new T.CapsuleGeometry(0.13, 0.16, 8, 24), shirt);
  torso.position.y = 0.42;
  const vestM = new T.Mesh(new T.CylinderGeometry(0.142, 0.15, 0.24, 24, 1, true), vest);
  vestM.position.y = 0.43;
  vestM.material.side = T.DoubleSide;
  a.add(torso, vestM);
  for (const y of [0.38, 0.46]) {
    const band = new T.Mesh(new T.CylinderGeometry(0.152 - (y - 0.38) * 0.1, 0.152 - (y - 0.38) * 0.1, 0.018, 24, 1, true), refl);
    band.position.y = y;
    a.add(band);
  }
  const belt = new T.Mesh(new T.CylinderGeometry(0.14, 0.14, 0.03, 24), dark);
  belt.position.y = 0.31;
  a.add(belt);

  // kepala
  const headY = 0.69;
  const head = new T.Mesh(new T.SphereGeometry(0.1, 28, 20), skin);
  head.position.y = headY;
  head.scale.set(1, 1.02, 0.95);
  a.add(head);
  for (let i = 0; i < 6; i++) {
    const tuft = new T.Mesh(new T.SphereGeometry(0.03, 10, 8), hair);
    tuft.position.set(-0.06 + i * 0.024, headY + 0.055 - Math.abs(i - 2.5) * 0.006, 0.072 - Math.abs(i - 2.5) * 0.008);
    tuft.scale.set(1, 0.6, 0.8);
    a.add(tuft);
  }
  const back = new T.Mesh(new T.SphereGeometry(0.103, 24, 14, 0, TAU, 0, Math.PI * 0.6), hair);
  back.position.set(0, headY, -0.012);
  back.rotation.x = -0.9;
  a.add(back);
  const white = std(0xffffff, { roughness: 0.2 });
  const iris = std(0x6b3a1a, { roughness: 0.25 });
  const pupil = std(0x120a06, { roughness: 0.2 });
  const shine = new T.MeshBasicMaterial({ color: 0xffffff });
  for (const sx of [-1, 1]) {
    const eye = new T.Group();
    const w = new T.Mesh(new T.SphereGeometry(0.026, 16, 12), white);
    w.scale.set(1, 1.15, 0.55);
    const ir = new T.Mesh(new T.SphereGeometry(0.019, 16, 12), iris);
    ir.position.z = 0.009;
    ir.scale.set(1, 1.1, 0.5);
    const pu = new T.Mesh(new T.SphereGeometry(0.01, 12, 8), pupil);
    pu.position.z = 0.016;
    pu.scale.set(1, 1.1, 0.5);
    const hl = new T.Mesh(new T.SphereGeometry(0.005, 8, 6), shine);
    hl.position.set(0.006, 0.009, 0.02);
    eye.add(w, ir, pu, hl);
    eye.position.set(sx * 0.037, headY + 0.0, 0.083);
    a.add(eye);
    const brow = new T.Mesh(new T.CapsuleGeometry(0.005, 0.026, 3, 6), hair);
    brow.rotation.z = Math.PI / 2 + sx * 0.18;
    brow.position.set(sx * 0.037, headY + 0.036, 0.09);
    const cheek = new T.Mesh(new T.CircleGeometry(0.014, 12), new T.MeshBasicMaterial({ color: 0xf0907a, transparent: true, opacity: 0.55 }));
    cheek.position.set(sx * 0.058, headY - 0.034, 0.083);
    cheek.rotation.y = sx * 0.5;
    const ear = new T.Mesh(new T.SphereGeometry(0.02, 10, 8), skin);
    ear.position.set(sx * 0.098, headY - 0.01, 0);
    ear.scale.set(0.6, 1, 0.8);
    a.add(brow, cheek, ear);
  }
  const nose = new T.Mesh(new T.SphereGeometry(0.011, 10, 8), skin);
  nose.position.set(0, headY - 0.018, 0.096);
  const smile = new T.Mesh(new T.TorusGeometry(0.022, 0.004, 6, 16, Math.PI), std(0x8a3a2a));
  smile.rotation.z = Math.PI;
  smile.position.set(0, headY - 0.042, 0.088);
  a.add(nose, smile);

  // helm proyek kuning dengan lampu kepala
  const dome = new T.Mesh(new T.SphereGeometry(0.118, 32, 16, 0, TAU, 0, Math.PI / 2), helm);
  dome.position.y = headY + 0.035;
  dome.scale.set(1, 0.85, 1.05);
  const brim = new T.Mesh(new T.CylinderGeometry(0.14, 0.145, 0.014, 32), helm);
  brim.position.set(0, headY + 0.035, 0.012);
  brim.scale.set(1, 1, 1.12);
  const ridge = new T.Mesh(new T.TorusGeometry(0.1, 0.012, 6, 24, Math.PI), helm);
  ridge.rotation.y = Math.PI / 2;
  ridge.position.y = headY + 0.035;
  a.add(dome, brim, ridge);
  const lampBody = new T.Mesh(new T.CylinderGeometry(0.028, 0.03, 0.035, 18), dark);
  lampBody.rotation.x = Math.PI / 2;
  lampBody.position.set(0, headY + 0.085, 0.112);
  const lens = new T.Mesh(new T.CircleGeometry(0.024, 18), new T.MeshBasicMaterial({ color: 0xfff6d0 }));
  lens.position.set(0, headY + 0.085, 0.131);
  a.add(lampBody, lens);
  const halo = glowSprite('#fff2c0', 0.18);
  halo.position.copy(lens.position).add(new T.Vector3(0, 0, 0.01));
  a.add(halo);
  // lampu sorot sungguhan dibuat terpisah (mesin menaruhnya di adegan agar jumlah lampu tetap)
  const lamp = withLamp ? new T.SpotLight(0xfff0cc, 0, 16, 0.5, 0.6, 1) : null;
  // berkas cahaya lembut (kerucut aditif) agar lampu kepala terlihat di gua berdebu
  const beamMat = new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
    side: T.DoubleSide,
    uniforms: { uO: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform float uO; varying vec2 vUv; void main(){ float a = pow(vUv.y, 2.0) * (0.6 + 0.4 * sin(vUv.x * 6.2831)); gl_FragColor = vec4(1.0, 0.93, 0.75, a * uO); }',
  });
  const beam = new T.Mesh(new T.CylinderGeometry(0.02, 0.6, 2.4, 24, 1, true), beamMat);
  beam.geometry.translate(0, -1.2, 0);
  beam.rotation.x = -Math.PI / 2 + 0.12;
  beam.position.copy(lens.position);
  a.add(beam);

  // papan nama AGAM di rompi + bendera Merah Putih di lengan
  const tag = new T.Mesh(
    new T.PlaneGeometry(0.09, 0.032),
    new T.MeshStandardMaterial({
      map: canvasTex(256, 96, (g, w, h) => {
        g.fillStyle = '#ffffff';
        g.fillRect(0, 0, w, h);
        g.fillStyle = '#1f2f7a';
        g.font = '900 58px system-ui, sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('AGAM', w / 2, h / 2 + 3);
      }),
    }),
  );
  tag.position.set(0.055, 0.49, 0.147);
  tag.rotation.y = 0.35;
  a.add(tag);

  // ransel cokelat + gulungan tali oranye
  const pack = new T.Mesh(new T.BoxGeometry(0.22, 0.26, 0.11), std(0x6b4a2a, { roughness: 0.9 }));
  pack.position.set(0, 0.45, -0.16);
  const pocket = new T.Mesh(new T.BoxGeometry(0.15, 0.1, 0.03), std(0x57391e));
  pocket.position.set(0, 0.4, -0.225);
  const rope = new T.Mesh(new T.TorusGeometry(0.07, 0.018, 8, 24), std(0xff9a2a, { roughness: 0.9 }));
  rope.position.set(0, 0.62, -0.17);
  rope.rotation.x = Math.PI / 2;
  a.add(pack, pocket, rope);
  for (const sx of [-1, 1]) {
    const strap = new T.Mesh(new T.BoxGeometry(0.024, 0.2, 0.012), dark);
    strap.position.set(sx * 0.09, 0.47, 0.135);
    a.add(strap);
  }

  const limb = (r: number, len: number, mat: T.Material, end: T.Object3D) => {
    const g = new T.Group();
    const m = new T.Mesh(new T.CapsuleGeometry(r, len, 4, 14), mat);
    m.position.y = -0.1;
    g.add(m);
    end.position.y = -0.1 - len / 2 - r * 0.8;
    g.add(end);
    return g;
  };
  const glove = () => {
    const gl = new T.Mesh(new T.SphereGeometry(0.036, 12, 10), std(0x8a5a2a, { roughness: 0.9 }));
    gl.scale.set(1, 1.1, 0.85);
    return gl;
  };
  const shoe = () => {
    const b = new T.Mesh(new T.BoxGeometry(0.085, 0.06, 0.13), boot);
    b.geometry.translate(0, 0, 0.02);
    return b;
  };
  const armL = limb(0.038, 0.16, shirt, glove());
  const armR = limb(0.038, 0.16, shirt, glove());
  armL.position.set(-0.17, 0.53, 0);
  armR.position.set(0.17, 0.53, 0);
  // senter di tangan kanan
  const torch = new T.Mesh(new T.CylinderGeometry(0.014, 0.018, 0.11, 12), dark);
  torch.rotation.x = Math.PI / 2;
  torch.position.set(0, -0.3, 0.05);
  armR.add(torch);
  const legL = limb(0.052, 0.12, pants, shoe());
  const legR = limb(0.052, 0.12, pants, shoe());
  legL.position.set(-0.065, 0.27, 0);
  legR.position.set(0.065, 0.27, 0);
  a.add(armL, armR, legL, legR);
  a.traverse((o) => ((o as T.Mesh).castShadow = true));

  const bodyParts = [torso, vestM];
  return {
    root: a,
    armL,
    armR,
    legL,
    legR,
    lamp,
    lens,
    beam,
    update(t, walk) {
      const s = Math.sin(t * 7) * 0.55 * walk;
      legL.rotation.x = s;
      legR.rotation.x = -s;
      armL.rotation.x = -s * 0.8;
      armR.rotation.x = s * 0.8 - (1 - walk) * 0.1;
      armL.rotation.z = -0.12;
      armR.rotation.z = 0.12;
      const bob = Math.abs(Math.cos(t * 7)) * 0.02 * walk + Math.sin(t * 1.6) * 0.004;
      for (const b of bodyParts) b.position.y = (b === torso ? 0.42 : 0.43) + bob * 0.3;
    },
    setLamp(on) {
      if (lamp) lamp.intensity = on * 30;
      beamMat.uniforms.uO.value = on * 0.22;
      halo.visible = on > 0.05;
      (lens.material as T.MeshBasicMaterial).color.set(on > 0.05 ? 0xfff6d0 : 0x777066);
    },
  };
}

/* ---------------- kapsul bor Geo Explorer ---------------- */

export function capsule() {
  const g = new T.Group();
  const white = std(0xf4f2ec, { roughness: 0.35, metalness: 0.2 });
  const orange = std(0xf07a1f, { roughness: 0.45, metalness: 0.2 });
  const steel = std(0x9aa3ad, { roughness: 0.3, metalness: 0.85 });
  const glass = new T.MeshPhysicalMaterial({ color: 0x1a3a5a, roughness: 0.08, metalness: 0.3, clearcoat: 1, emissive: 0x0a2a4a, side: T.DoubleSide });

  // badan tegak: tabung dengan kepala bor di bawah
  const body = new T.Mesh(new T.CylinderGeometry(0.75, 0.75, 1.5, 40), white);
  body.position.y = 0.2;
  const top = new T.Mesh(new T.SphereGeometry(0.75, 40, 16, 0, TAU, 0, Math.PI / 2), white);
  top.position.y = 0.95;
  const stripe = new T.Mesh(new T.CylinderGeometry(0.76, 0.76, 0.22, 40), orange);
  stripe.position.y = -0.3;
  const ring = new T.Mesh(new T.TorusGeometry(0.76, 0.04, 8, 40), steel);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.55;
  g.add(body, top, stripe, ring);
  // jendela besar berbingkai (kaca gelap mengilap memantulkan cahaya)
  const win = new T.Mesh(new T.CylinderGeometry(0.765, 0.765, 0.5, 32, 1, true, -0.65, 1.3), glass);
  win.position.y = 0.45;
  const winTop = new T.Mesh(new T.TorusGeometry(0.766, 0.03, 6, 32, 1.3), steel);
  winTop.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.65);
  g.add(win);
  for (const y of [0.2, 0.7]) {
    const rim = winTop.clone();
    rim.position.y = y;
    g.add(rim);
  }
  // tulisan GEO EXPLORER
  const label = new T.Mesh(
    new T.CylinderGeometry(0.762, 0.762, 0.2, 40, 1, true, -0.9, 1.8),
    new T.MeshStandardMaterial({
      transparent: true,
      map: canvasTex(512, 64, (c, w, h) => {
        c.fillStyle = '#1f2f7a';
        c.font = '900 44px system-ui, sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('GEO EXPLORER', w / 2, h / 2 + 2);
      }),
    }),
  );
  label.position.y = -0.05;
  g.add(label);
  // kepala bor berputar
  const drill = new T.Group();
  const cone = new T.Mesh(new T.ConeGeometry(0.7, 1.1, 32, 4), steel);
  cone.rotation.x = Math.PI;
  cone.position.y = -1.1;
  drill.add(cone);
  for (let i = 0; i < 3; i++) {
    const blade = new T.Mesh(new T.TorusGeometry(0.5 - i * 0.14, 0.05, 6, 24, Math.PI * 1.4), orange);
    blade.rotation.set(Math.PI / 2, 0, i * 2);
    blade.position.y = -0.75 - i * 0.28;
    drill.add(blade);
  }
  g.add(drill);
  // lampu depan & kaki penyangga
  const lights: T.Sprite[] = [];
  for (const a of [-0.5, 0.5]) {
    const l = glowSprite('#fff0b0', 0.5);
    l.position.set(Math.sin(a) * 0.78, -0.45, Math.cos(a) * 0.78);
    lights.push(l);
    g.add(l);
  }
  const beacon = glowSprite('#ff5a2a', 0.35);
  beacon.position.y = 1.72;
  const ant = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.35), steel);
  ant.position.y = 1.55;
  g.add(ant, beacon);


  g.traverse((o) => ((o as T.Mesh).castShadow = true));
  g.userData.update = (t: number, drilling: number) => {
    drill.rotation.y = t * 8 * drilling;
    beacon.material.opacity = 0.5 + Math.sin(t * 5) * 0.5;
    g.position.x += 0; // posisi diatur mesin
  };
  return g;
}

/* ---------------- perahu karet oranye ---------------- */

export function raft() {
  const g = new T.Group();
  const orange = std(0xff7a1a, { roughness: 0.5 });
  const tube = new T.Mesh(new T.TorusGeometry(0.9, 0.22, 14, 40), orange);
  tube.rotation.x = Math.PI / 2;
  tube.scale.set(1, 0.6, 1);
  const floor = new T.Mesh(new T.CylinderGeometry(0.85, 0.85, 0.06, 30), std(0x2c2f38));
  floor.scale.set(1, 1, 0.6);
  floor.position.y = -0.08;
  g.add(tube, floor);
  tube.scale.set(1.3, 0.8, 1);
  const label = new T.Mesh(
    new T.PlaneGeometry(0.9, 0.14),
    new T.MeshBasicMaterial({
      transparent: true,
      map: canvasTex(512, 80, (c, w, h) => {
        c.fillStyle = '#ffffff';
        c.font = '900 50px system-ui, sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('GEO EXPLORER', w / 2, h / 2);
      }),
    }),
  );
  label.position.set(0, 0.02, 0.83);
  g.add(label);
  const paddle = new T.Group();
  const shaft = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 1.1), std(0x333333));
  const blade = new T.Mesh(new T.BoxGeometry(0.14, 0.3, 0.02), std(0xffc21a));
  blade.position.y = -0.6;
  paddle.add(shaft, blade);
  paddle.position.set(0.9, 0.25, 0.2);
  paddle.rotation.z = 0.9;
  g.add(paddle);
  g.userData.paddle = paddle;
  return g;
}

/* ---------------- hewan ---------------- */

export function worm() {
  const pts: T.Vector3[] = [];
  for (let i = 0; i < 12; i++) pts.push(new T.Vector3(i * 0.06, Math.sin(i * 0.8) * 0.04, Math.cos(i * 0.6) * 0.05));
  const curve = new T.CatmullRomCurve3(pts);
  const g = new T.TubeGeometry(curve, 48, 0.028, 10);
  const m = new T.Mesh(g, std(0xd98a8a, { roughness: 0.4 }));
  const band = new T.Mesh(new T.SphereGeometry(0.034, 10, 8), std(0xe9a0a0));
  band.position.copy(curve.getPoint(0.3));
  band.scale.set(1.6, 1, 1);
  const root = new T.Group();
  root.add(m, band);
  root.userData.update = (t: number, ph: number) => {
    m.scale.x = 1 + Math.sin(t * 2 + ph) * 0.12;
    root.rotation.y = Math.sin(t * 0.4 + ph) * 0.4;
  };
  return root;
}

export function ant() {
  const g = new T.Group();
  const m = std(0x2a150a, { roughness: 0.4 });
  for (const [x, r] of [
    [-0.05, 0.03],
    [0, 0.02],
    [0.045, 0.024],
  ] as const) {
    const s = new T.Mesh(new T.SphereGeometry(r, 10, 8), m);
    s.position.x = x;
    s.scale.set(1.2, 0.9, 1);
    g.add(s);
  }
  for (let i = 0; i < 3; i++)
    for (const sz of [-1, 1]) {
      const l = new T.Mesh(new T.CylinderGeometry(0.004, 0.004, 0.06), m);
      l.position.set(-0.012 + i * 0.012, -0.015, sz * 0.025);
      l.rotation.x = sz * 0.9;
      g.add(l);
    }
  return g;
}

export function mushroom(color: string, r: () => number) {
  const g = new T.Group();
  const h = 0.1 + r() * 0.12;
  const stem = new T.Mesh(new T.CylinderGeometry(0.018, 0.025, h, 10), std(0xf4ead8));
  stem.position.y = h / 2;
  const cap = new T.Mesh(new T.SphereGeometry(0.06 + r() * 0.04, 16, 8, 0, TAU, 0, Math.PI / 2), std(color, { roughness: 0.5 }));
  cap.position.y = h;
  cap.scale.y = 0.6;
  g.add(stem, cap);
  return g;
}

export function bat() {
  const g = new T.Group();
  const fur = std(0x3a2e2a, { roughness: 0.9 });
  const body = new T.Mesh(new T.CapsuleGeometry(0.06, 0.1, 4, 10), fur);
  const head = new T.Mesh(new T.SphereGeometry(0.05, 12, 10), fur);
  head.position.y = -0.11; // tidur terbalik
  for (const sx of [-1, 1]) {
    const ear = new T.Mesh(new T.ConeGeometry(0.018, 0.05, 6), fur);
    ear.position.set(sx * 0.025, -0.16, 0);
    ear.rotation.z = Math.PI;
    g.add(ear);
    const eye = new T.Mesh(new T.SphereGeometry(0.008, 6, 6), new T.MeshBasicMaterial({ color: 0x111111 }));
    eye.position.set(sx * 0.02, -0.12, 0.043);
    g.add(eye);
  }
  const wing = std(0x4a3a36, { roughness: 0.8, side: T.DoubleSide });
  const wings: T.Mesh[] = [];
  for (const sx of [-1, 1]) {
    const w = new T.Mesh(new T.CircleGeometry(0.12, 12, 0, Math.PI), wing);
    w.position.set(sx * 0.03, 0.0, 0);
    w.rotation.set(0, sx * 1.2, sx * Math.PI / 2);
    wings.push(w);
    g.add(w);
  }
  const feet = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 0.06), fur);
  feet.position.y = 0.09;
  g.add(body, head, feet);
  g.userData.update = (t: number, ph: number) => {
    g.rotation.z = Math.sin(t * 0.8 + ph) * 0.06;
    wings.forEach((w, i) => (w.rotation.y = (i ? 1 : -1) * (1.2 + Math.sin(t * 1.3 + ph) * 0.08)));
  };
  return g;
}

/** Kelelawar terbang (untuk kawanan yang melintas). */
export function flyingBat() {
  const g = new T.Group();
  const fur = std(0x2e2522);
  const body = new T.Mesh(new T.CapsuleGeometry(0.05, 0.08, 4, 8), fur);
  body.rotation.z = Math.PI / 2;
  g.add(body);
  const wings: T.Mesh[] = [];
  for (const sz of [-1, 1]) {
    const w = new T.Mesh(new T.PlaneGeometry(0.2, 0.12), std(0x3a2e2a, { side: T.DoubleSide }));
    w.geometry.translate(0, 0, 0);
    w.position.z = sz * 0.1;
    w.rotation.x = Math.PI / 2;
    wings.push(w);
    g.add(w);
  }
  g.userData.flap = (t: number) => wings.forEach((w, i) => (w.rotation.x = Math.PI / 2 + (i ? 1 : -1) * Math.sin(t * 18) * 0.7));
  return g;
}

export function salamander() {
  const g = new T.Group();
  const m = std(0xf2d6cf, { roughness: 0.35 });
  const pts = [new T.Vector3(-0.25, 0, 0), new T.Vector3(-0.1, 0, 0.02), new T.Vector3(0.05, 0, -0.01), new T.Vector3(0.2, 0, 0)];
  const body = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 24, 0.035, 10), m);
  const head = new T.Mesh(new T.SphereGeometry(0.05, 14, 10), m);
  head.position.set(0.23, 0, 0);
  head.scale.set(1.3, 0.7, 1);
  const tail = new T.Mesh(new T.ConeGeometry(0.03, 0.22, 8), m);
  tail.rotation.z = Math.PI / 2;
  tail.position.set(-0.35, 0, 0);
  g.add(body, head, tail);
  // insang merah muda berbulu
  for (const sz of [-1, 1])
    for (let i = 0; i < 3; i++) {
      const gl = new T.Mesh(new T.CapsuleGeometry(0.006, 0.05, 2, 6), std(0xff7f9a, { emissive: 0x401020 }));
      gl.position.set(0.2, 0.01 + i * 0.012, sz * 0.05);
      gl.rotation.set(sz * 1.2, 0, -0.6 + i * 0.3);
      g.add(gl);
    }
  for (const [x, sz] of [
    [0.12, 1],
    [0.12, -1],
    [-0.12, 1],
    [-0.12, -1],
  ])
    {
      const leg = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, 0.07), m);
      leg.position.set(x, -0.025, sz * 0.045);
      leg.rotation.x = sz * 1;
      g.add(leg);
    }
  g.userData.update = (t: number, ph: number) => {
    tail.rotation.y = Math.sin(t * 2 + ph) * 0.3;
    g.rotation.y += 0;
  };
  return g;
}

/* ---------------- fosil & mineral ---------------- */

export function ammonite(color = 0xc9a27a) {
  const pts: T.Vector3[] = [];
  for (let i = 0; i <= 140; i++) {
    const a = (i / 140) * TAU * 3;
    const r = 0.02 * Math.exp(a * 0.17);
    pts.push(new T.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  const curve = new T.CatmullRomCurve3(pts);
  const g = new T.Group();
  const geo = new T.TubeGeometry(curve, 200, 1, 12);
  // ketebalan tabung mengikuti jari-jari spiral
  const p = geo.attributes.position;
  const c = new T.Vector3();
  for (let i = 0; i < p.count; i++) {
    const seg = Math.floor(i / 13) / 200;
    curve.getPoint(Math.min(1, seg), c);
    const k = 0.012 + c.length() * 0.42;
    const v = new T.Vector3(p.getX(i), p.getY(i), p.getZ(i)).sub(c).multiplyScalar(k);
    p.setXYZ(i, c.x + v.x, c.y + v.y, c.z + v.z * 0.7);
  }
  geo.computeVertexNormals();
  const cols: number[] = [];
  const base = new T.Color(color);
  for (let i = 0; i < p.count; i++) {
    const ring = Math.floor(i / 13);
    const k = ring % 6 < 1 ? 0.72 : 1;
    cols.push(base.r * k, base.g * k, base.b * k);
  }
  geo.setAttribute('color', new T.Float32BufferAttribute(cols, 3));
  g.add(new T.Mesh(geo, new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 })));
  return g;
}

export function trilobite(color = 0x6d5a48) {
  const g = new T.Group();
  const m = std(color, { roughness: 0.7 });
  const head = new T.Mesh(new T.SphereGeometry(0.12, 20, 10, 0, TAU, 0, Math.PI / 2), m);
  head.scale.set(1.2, 0.35, 0.8);
  head.position.z = 0.12;
  g.add(head);
  for (let i = 0; i < 9; i++) {
    const w = 0.12 * (1 - i * 0.07);
    const seg = new T.Mesh(new T.CapsuleGeometry(0.016, w * 2, 3, 8), m);
    seg.rotation.z = Math.PI / 2;
    seg.position.set(0, 0.015, 0.05 - i * 0.032);
    g.add(seg);
    const ax = new T.Mesh(new T.SphereGeometry(0.025, 8, 6), m);
    ax.position.set(0, 0.03, 0.05 - i * 0.032);
    ax.scale.set(1, 0.6, 0.8);
    g.add(ax);
  }
  const tail = new T.Mesh(new T.SphereGeometry(0.07, 14, 8, 0, TAU, 0, Math.PI / 2), m);
  tail.scale.set(1, 0.3, 0.8);
  tail.position.z = -0.25;
  g.add(tail);
  for (const sx of [-1, 1]) {
    const eye = new T.Mesh(new T.SphereGeometry(0.018, 8, 6), std(0x3a2e24));
    eye.position.set(sx * 0.06, 0.04, 0.14);
    g.add(eye);
  }
  return g;
}

/** Tugu kristal heksagonal (kuarsa/ametis). */
export function crystal(color: string, h: number, glowy = 0.25) {
  const g = new T.CylinderGeometry(0.1, 0.1, h, 6);
  g.translate(0, h / 2, 0);
  const tip = new T.ConeGeometry(0.1, 0.16, 6);
  tip.translate(0, h + 0.08, 0);
  const mat = new T.MeshPhysicalMaterial({ color, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.88, emissive: new T.Color(color).multiplyScalar(glowy), clearcoat: 1, flatShading: true });
  const grp = new T.Group();
  grp.add(new T.Mesh(g, mat), new T.Mesh(tip, mat));
  return grp;
}

export function cluster(color: string, n: number, r: () => number, scale = 1) {
  const g = new T.Group();
  for (let i = 0; i < n; i++) {
    const c = crystal(color, (0.3 + r() * 0.8) * scale, 0.35);
    c.scale.setScalar(scale * (0.6 + r() * 0.8));
    c.rotation.set((r() - 0.5) * 1.2, r() * 6, (r() - 0.5) * 1.2);
    c.position.set((r() - 0.5) * 0.3 * scale, 0, (r() - 0.5) * 0.3 * scale);
    g.add(c);
  }
  return g;
}

export function pyrite(r: () => number) {
  const g = new T.Group();
  const m = std(0xd9b44a, { roughness: 0.25, metalness: 1 });
  for (let i = 0; i < 5; i++) {
    const s = 0.08 + r() * 0.1;
    const b = new T.Mesh(new T.BoxGeometry(s, s, s), m);
    b.position.set((r() - 0.5) * 0.2, s / 2, (r() - 0.5) * 0.2);
    b.rotation.set(r() * 0.4, r() * 3, r() * 0.4);
    g.add(b);
  }
  return g;
}

/** Geoda terbelah: kulit batu dengan rongga penuh kristal ungu. */
export function geode(r: () => number) {
  const g = new T.Group();
  const shell = new T.Mesh(new T.SphereGeometry(0.5, 28, 16, 0, TAU, 0, Math.PI / 2), std(0x8a7e72, { roughness: 1, side: T.DoubleSide }));
  shell.rotation.x = -Math.PI / 2;
  g.add(shell);
  const rim = new T.Mesh(new T.RingGeometry(0.38, 0.5, 32), std(0xe8e2f0, { side: T.DoubleSide }));
  g.add(rim);
  for (let i = 0; i < 70; i++) {
    const a = r() * TAU,
      e = r() * 1.2;
    const d = 0.4;
    const c = crystal(i % 3 ? '#9b5cf0' : '#c9a2ff', 0.05 + r() * 0.06, 0.5);
    c.scale.setScalar(0.5);
    const p = new T.Vector3(Math.cos(a) * Math.sin(e) * d, Math.sin(a) * Math.sin(e) * d, -Math.cos(e) * d);
    c.position.copy(p);
    c.lookAt(0, 0, 0);
    c.rotateX(Math.PI / 2);
    g.add(c);
  }
  return g;
}

/** Stalaktit/stalagmit: kerucut bergelombang kekuningan. */
export function dripstone(h: number, r: () => number, down: boolean) {
  const geo = new T.ConeGeometry(0.12 + h * 0.12, h, 10, 6);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const k = 1 + Math.sin(y * 9 + i) * 0.08 + (r() - 0.5) * 0.06;
    p.setX(i, p.getX(i) * k);
    p.setZ(i, p.getZ(i) * k);
  }
  geo.computeVertexNormals();
  geo.translate(0, h / 2, 0);
  const m = new T.Mesh(geo, std(down ? 0xe8d3a8 : 0xd8c092, { roughness: 0.55, emissive: 0x1a1206 }));
  if (down) m.rotation.x = Math.PI;
  m.castShadow = true;
  return m;
}

export function bone() {
  const g = new T.Group();
  const m = std(0xe8dcc0, { roughness: 0.7 });
  const shaft = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.5, 12), m);
  shaft.rotation.z = Math.PI / 2;
  g.add(shaft);
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      const k = new T.Mesh(new T.SphereGeometry(0.05, 12, 10), m);
      k.position.set(sx * 0.26, 0, sz * 0.035);
      g.add(k);
    }
  return g;
}

export function leafFossil() {
  const g = new T.Group();
  const shape = new T.Shape();
  shape.moveTo(0, -0.25);
  shape.quadraticCurveTo(0.14, 0, 0, 0.25);
  shape.quadraticCurveTo(-0.14, 0, 0, -0.25);
  const m = new T.Mesh(new T.ShapeGeometry(shape, 16), std(0x4a4034, { roughness: 0.9 }));
  g.add(m);
  const vein = new T.Mesh(new T.PlaneGeometry(0.008, 0.48), std(0x2e271f));
  vein.position.z = 0.002;
  g.add(vein);
  for (let i = 0; i < 6; i++)
    for (const s of [-1, 1]) {
      const v = new T.Mesh(new T.PlaneGeometry(0.005, 0.1), std(0x2e271f));
      v.position.set(s * 0.035, -0.15 + i * 0.06, 0.002);
      v.rotation.z = s * -0.9;
      g.add(v);
    }
  return g;
}
