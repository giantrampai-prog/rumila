// Detail dunia modul Roket: kompleks peluncuran (pohon, kelapa, pantai & laut, bukit, gedung perakitan,
// gedung kontrol, menara air, tangki, tiang petir, pagar, jalan, mobil, bendera), tekstur roket, burung,
// satelit, Bulan, dan Stasiun Luar Angkasa yang lebih lengkap. Semua prosedural (tanpa berkas model).

import * as THREE from "three";

export const TAU = Math.PI * 2;
export const EARTH_R = 1000;
/** turunkan titik (x,z) mengikuti lengkung Bumi agar objek menempel di tanah */
export const groundY = (x: number, z: number) => -(x * x + z * z) / (2 * EARTH_R);

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const std = (color: number, rough = 0.8, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

/* ---------------- tanah kompleks peluncuran ---------------- */

/** Arah laut (pantai di sisi +X): Biak dikelilingi laut. */
const SEA_X = 13;

function groundTexture() {
  return canvasTex(2048, 2048, (g, w, h) => {
    const r = rng(4);
    const S = w / 60; // piksel per unit (piringan radius 30)
    const X = (x: number) => w / 2 + x * S;
    const Z = (z: number) => h / 2 + z * S;
    // rumput berbintik beberapa warna
    g.fillStyle = "#6aa84f";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 26000; i++) {
      const c = [
        [80, 150, 60],
        [96, 168, 72],
        [70, 132, 52],
        [120, 170, 80],
      ][Math.floor(r() * 4)];
      g.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.5)`;
      g.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 4);
    }
    // pantai & laut di sisi +X (garis pantai sedikit berombak)
    g.beginPath();
    g.moveTo(X(SEA_X), 0);
    for (let z = -30; z <= 30; z += 1) g.lineTo(X(SEA_X + Math.sin(z * 0.35) * 0.8), Z(z));
    g.lineTo(w, h);
    g.lineTo(w, 0);
    g.closePath();
    g.fillStyle = "#e9d8a6";
    g.fill();
    g.beginPath();
    g.moveTo(X(SEA_X + 2), 0);
    for (let z = -30; z <= 30; z += 1) g.lineTo(X(SEA_X + 2 + Math.sin(z * 0.35) * 0.8), Z(z));
    g.lineTo(w, h);
    g.lineTo(w, 0);
    g.closePath();
    const sea = g.createLinearGradient(X(SEA_X + 2), 0, w, 0);
    sea.addColorStop(0, "#5fc9d6");
    sea.addColorStop(0.15, "#2b98c4");
    sea.addColorStop(1, "#15609a");
    g.fillStyle = sea;
    g.fill();
    // buih ombak
    g.strokeStyle = "rgba(255,255,255,0.7)";
    g.lineWidth = 3;
    g.beginPath();
    for (let z = -30; z <= 30; z += 0.5) g.lineTo(X(SEA_X + 2.1 + Math.sin(z * 0.35) * 0.8), Z(z));
    g.stroke();
    // jalan aspal
    g.strokeStyle = "#5b5e66";
    g.lineCap = "round";
    g.lineWidth = 1.4 * S;
    g.beginPath();
    g.moveTo(X(0), Z(3));
    g.lineTo(X(0), Z(9));
    g.lineTo(X(-10), Z(9));
    g.lineTo(X(-10), Z(30));
    g.moveTo(X(-10), Z(9));
    g.lineTo(X(-22), Z(9));
    g.stroke();
    g.strokeStyle = "#f5f1e6";
    g.lineWidth = 0.08 * S;
    g.setLineDash([0.6 * S, 0.6 * S]);
    g.stroke();
    g.setLineDash([]);
    // landasan beton segi delapan + marka
    g.fillStyle = "#cfccc4";
    g.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + TAU / 16;
      g.lineTo(X(Math.cos(a) * 5.2), Z(Math.sin(a) * 5.2));
    }
    g.fill();
    for (let i = 0; i < 1500; i++) {
      g.fillStyle = `rgba(${150 + r() * 40},${150 + r() * 40},${145 + r() * 40},0.35)`;
      g.fillRect(X((r() - 0.5) * 9), Z((r() - 0.5) * 9), 2, 2);
    }
    g.strokeStyle = "#f2c230";
    g.lineWidth = 0.1 * S;
    g.beginPath();
    g.arc(X(0), Z(0), 1.2 * S, 0, TAU);
    g.stroke();
    // parit api (hitam, gosong)
    const tr = g.createLinearGradient(X(-4.5), 0, X(4.5), 0);
    tr.addColorStop(0, "#3b3b3f");
    tr.addColorStop(0.5, "#1c1c20");
    tr.addColorStop(1, "#3b3b3f");
    g.fillStyle = tr;
    g.fillRect(X(-4.5), Z(-0.45), 9 * S, 0.9 * S);
    // parkir
    g.fillStyle = "#6b6e76";
    g.fillRect(X(-14), Z(11), 6 * S, 3 * S);
    g.strokeStyle = "#ffffff";
    g.lineWidth = 0.06 * S;
    for (let i = 0; i <= 6; i++) {
      g.beginPath();
      g.moveTo(X(-14 + i), Z(11));
      g.lineTo(X(-14 + i), Z(12.2));
      g.stroke();
    }
  });
}

function buildGround() {
  const geo = new THREE.RingGeometry(0.001, 30, 96, 32);
  geo.rotateX(-Math.PI / 2);
  const p = geo.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) p.setY(i, 0.02 + groundY(p.getX(i), p.getZ(i)));
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: groundTexture(), roughness: 0.95 }));
}

/* ---------------- pepohonan ---------------- */

function buildTrees(n: number, seed: number) {
  const r = rng(seed);
  const g = new THREE.Group();
  const trunkGeo = new THREE.CylinderGeometry(0.06, 0.09, 1, 6);
  trunkGeo.translate(0, 0.5, 0);
  const trunks = new THREE.InstancedMesh(trunkGeo, std(0x6b4a2f, 0.95), n);
  // Tajuk: 3 gumpalan per pohon (bulat, lebat)
  const leafGeo = new THREE.IcosahedronGeometry(0.42, 1);
  const leaves = new THREE.InstancedMesh(leafGeo, new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }), n * 3);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const col = new THREE.Color();
  let k = 0;
  let placed = 0;
  for (let i = 0; placed < n && i < n * 4; i++) {
    const a = r() * TAU;
    const d = 10.5 + r() * 18.5; // di luar pagar landasan
    const x = Math.cos(a) * d,
      z = Math.sin(a) * d;
    if (x > SEA_X - 1.5) continue; // bukan di pantai/laut
    if (Math.abs(x + 10) < 1.2 && z > 8) continue; // bukan di jalan
    if (Math.abs(z - 9) < 1.2 && x < 1 && x > -23) continue;
    if (x < -2 && x > -16 && z > 3 && z < 15) continue; // area gedung
    const s = 0.45 + r() * 0.45;
    const h = 0.9 + r() * 0.7;
    const y = groundY(x, z);
    m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(s, h * s, s));
    trunks.setMatrixAt(placed, m);
    const base = [0x2f7d3a, 0x3c8f3f, 0x4a9a3a, 0x2c6e36, 0x5aa640][Math.floor(r() * 5)];
    for (let j = 0; j < 3; j++) {
      const ox = (r() - 0.5) * 0.35 * s,
        oz = (r() - 0.5) * 0.35 * s;
      const oy = h * s + (0.15 + j * 0.22) * s;
      const ls = s * (1 - j * 0.18) * (0.9 + r() * 0.3);
      m.compose(new THREE.Vector3(x + ox, y + oy, z + oz), q, new THREE.Vector3(ls, ls * 0.85, ls));
      leaves.setMatrixAt(k, m);
      leaves.setColorAt(k, col.setHex(base).offsetHSL(0, 0, (r() - 0.5) * 0.08));
      k++;
    }
    placed++;
  }
  trunks.count = placed;
  leaves.count = k;
  g.add(trunks, leaves);
  return g;
}

function buildPalms(n: number, seed: number) {
  const r = rng(seed);
  const g = new THREE.Group();
  const trunkMat = std(0x8a6a45, 0.95);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f9a3a, roughness: 0.85, side: THREE.DoubleSide });
  const coco = std(0x5a3d22, 0.9);
  const leafGeo = new THREE.PlaneGeometry(0.22, 1.1, 1, 4);
  leafGeo.translate(0, 0.55, 0);
  // lengkungkan daun ke bawah
  const lp = leafGeo.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < lp.count; i++) {
    const y = lp.getY(i);
    lp.setZ(i, -0.35 * y * y);
  }
  leafGeo.computeVertexNormals();
  for (let i = 0; i < n; i++) {
    const z = -26 + r() * 52;
    const x = SEA_X - 1 + (r() - 0.3) * 2.5 + Math.sin(z * 0.35) * 0.8;
    if (Math.hypot(x, z) > 29) continue;
    const palm = new THREE.Group();
    const h = 1.6 + r() * 1.2;
    const lean = (r() - 0.3) * 0.35;
    const segs = 5;
    let px = 0,
      py = 0;
    for (let s = 0; s < segs; s++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, h / segs, 6), trunkMat);
      const bend = lean * (s / segs) * 1.5;
      seg.position.set(px, py + h / segs / 2, 0);
      seg.rotation.z = -bend;
      palm.add(seg);
      px += Math.sin(bend) * (h / segs);
      py += Math.cos(bend) * (h / segs);
    }
    for (let l = 0; l < 7; l++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(px, py, 0);
      leaf.rotation.set(1.1 + r() * 0.4, (l / 7) * TAU, 0, "YXZ");
      palm.add(leaf);
    }
    for (let c = 0; c < 3; c++) {
      const cc = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), coco);
      cc.position.set(px + Math.cos(c * 2) * 0.08, py - 0.08, Math.sin(c * 2) * 0.08);
      palm.add(cc);
    }
    palm.position.set(x, groundY(x, z), z);
    palm.rotation.y = r() * TAU;
    g.add(palm);
  }
  return g;
}

function buildHills() {
  const r = rng(21);
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x4f8f45, roughness: 1, flatShading: true });
  for (let i = 0; i < 16; i++) {
    const a = Math.PI * 0.55 + r() * Math.PI * 0.9; // sisi darat (−X)
    const d = 24 + r() * 5;
    const x = Math.cos(a) * d,
      z = Math.sin(a) * d;
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const p = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let k = 0; k < p.count; k++) {
      const n = 0.85 + r() * 0.3;
      p.setXYZ(k, p.getX(k) * n, Math.max(0, p.getY(k)) * n, p.getZ(k) * n);
    }
    geo.computeVertexNormals();
    const hill = new THREE.Mesh(geo, mat);
    const s = 2.5 + r() * 3;
    hill.scale.set(s * 1.6, s * (0.5 + r() * 0.5), s);
    hill.position.set(x, groundY(x, z) - 0.2, z);
    hill.rotation.y = r() * TAU;
    g.add(hill);
  }
  return g;
}

/* ---------------- bangunan ---------------- */

function stripesTex(label: string) {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#eef0f2";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#d6dae0";
    for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 3, h);
    // bendera Merah Putih
    g.fillStyle = "#e0262b";
    g.fillRect(40, 60, 170, 55);
    g.fillStyle = "#ffffff";
    g.fillRect(40, 115, 170, 55);
    g.strokeStyle = "#b9bec6";
    g.lineWidth = 3;
    g.strokeRect(40, 60, 170, 110);
    g.fillStyle = "#2b3a67";
    g.font = "bold 56px system-ui, sans-serif";
    g.fillText(label, 40, 260);
    // pintu raksasa
    g.fillStyle = "#b7bcc5";
    g.fillRect(300, 180, 160, 332);
    g.strokeStyle = "#9aa0aa";
    for (let y = 190; y < 512; y += 24) {
      g.beginPath();
      g.moveTo(300, y);
      g.lineTo(460, y);
      g.stroke();
    }
  });
}

function windowsTex() {
  return canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = "#e7e2d8";
    g.fillRect(0, 0, w, h);
    for (let y = 16; y < h - 10; y += 34)
      for (let x = 12; x < w - 10; x += 28) {
        g.fillStyle = "#6fa8dc";
        g.fillRect(x, y, 18, 20);
        g.fillStyle = "rgba(255,255,255,0.45)";
        g.fillRect(x, y, 6, 20);
      }
  });
}

function flag() {
  const tex = canvasTex(64, 40, (g) => {
    g.fillStyle = "#e0262b";
    g.fillRect(0, 0, 64, 20);
    g.fillStyle = "#ffffff";
    g.fillRect(0, 20, 64, 20);
  });
  const geo = new THREE.PlaneGeometry(0.8, 0.5, 8, 1);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, map: { value: tex } },
    vertexShader: `uniform float uTime; varying vec2 vUv; void main(){ vUv = uv; vec3 p = position; float k = uv.x; p.z += sin(uTime * 3.0 + uv.x * 6.0) * 0.06 * k; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
    fragmentShader: `uniform sampler2D map; varying vec2 vUv; void main(){ gl_FragColor = texture2D(map, vUv); }`,
    side: THREE.DoubleSide,
  });
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 2.4, 8), std(0xdfe3e8, 0.4, 0.6));
  pole.position.y = 1.2;
  const cloth = new THREE.Mesh(geo, mat);
  cloth.position.set(0.4, 2.1, 0);
  g.add(pole, cloth);
  return { group: g, mat };
}

export function buildSite(low: boolean) {
  const g = new THREE.Group();
  g.add(buildGround());
  g.add(buildTrees(low ? 90 : 170, 8));
  g.add(buildPalms(low ? 14 : 26, 5));
  g.add(buildHills());
  const place = (o: THREE.Object3D, x: number, z: number, ry = 0) => {
    o.position.set(x, groundY(x, z), z);
    o.rotation.y = ry;
    g.add(o);
    return o;
  };
  // Gedung perakitan roket (besar, bergaris, berbendera)
  const vab = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 3.4), [
    std(0xeef0f2),
    std(0xeef0f2),
    std(0x9aa0aa),
    std(0xeef0f2),
    new THREE.MeshStandardMaterial({ map: stripesTex("RUMILA"), roughness: 0.7 }),
    std(0xeef0f2),
  ]);
  vab.position.y = 2.5;
  const vabG = new THREE.Group();
  vabG.add(vab);
  place(vabG, -18, 5, 0.3);
  // Gedung kontrol berjendela
  const ctrl = new THREE.Mesh(new THREE.BoxGeometry(3, 1.3, 1.8), new THREE.MeshStandardMaterial({ map: windowsTex(), roughness: 0.7 }));
  ctrl.position.y = 0.65;
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.1, 1.9), std(0x8b93a0));
  roof.position.y = 1.35;
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 10, 0, TAU, 0, Math.PI / 2.6), new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.4, side: THREE.DoubleSide }));
  dish.rotation.x = Math.PI * 0.75;
  dish.position.set(0.9, 1.9, 0);
  const dishPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55), std(0xcccccc));
  dishPole.position.set(0.9, 1.6, 0);
  const ctrlG = new THREE.Group();
  ctrlG.add(ctrl, roof, dish, dishPole);
  place(ctrlG, -7, 12, 0.1);
  // Menara air
  const wt = new THREE.Group();
  const tank = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 14), std(0xe8eef4, 0.5, 0.2));
  tank.position.y = 3.6;
  wt.add(tank);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.3), std(0x9aa3ae));
    leg.position.set(Math.cos(a) * 0.45, 1.65, Math.sin(a) * 0.45);
    wt.add(leg);
  }
  place(wt, 7, -13);
  // Tangki bahan bakar (bola putih) & pipa
  for (const [x, z] of [
    [4, -10],
    [5.6, -11],
  ]) {
    const t = new THREE.Group();
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 16), std(0xf6f7f9, 0.45, 0.15));
    ball.position.y = 1.4;
    t.add(ball);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1), std(0x9aa3ae));
      leg.position.set(Math.cos(a) * 0.75, 0.5, Math.sin(a) * 0.75);
      t.add(leg);
    }
    place(t, x, z);
  }
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 7), std(0xb8bec8, 0.5, 0.4));
  pipe.rotation.z = Math.PI / 2;
  pipe.rotation.y = 1.2;
  pipe.position.set(2.2, 0.12, -6.5);
  g.add(pipe);
  // Tiang penangkal petir di sekeliling landasan
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + TAU / 8;
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 6, 8), std(0xd9483b, 0.6));
    mast.position.y = 3;
    const mg = new THREE.Group();
    mg.add(mast);
    place(mg, Math.cos(a) * 8, Math.sin(a) * 8);
  }
  // Pagar keliling
  const fence = new THREE.Mesh(new THREE.TorusGeometry(9, 0.015, 4, 96), std(0x9aa0aa, 0.6, 0.5));
  fence.rotation.x = Math.PI / 2;
  fence.position.y = 0.35;
  g.add(fence);
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * TAU;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), std(0x9aa0aa));
    const x = Math.cos(a) * 9,
      z = Math.sin(a) * 9;
    post.position.set(x, 0.2 + groundY(x, z), z);
    g.add(post);
  }
  // Mobil & bus kecil di jalan/parkir
  const carColors = [0xff5a4e, 0x2f86ff, 0xffbe0b, 0x3ddc84, 0xffffff];
  const r = rng(33);
  for (let i = 0; i < 6; i++) {
    const car = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.26), std(carColors[i % 5], 0.4, 0.3));
    body.position.y = 0.14;
    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.24), std(0x9fd0f5, 0.2, 0.5));
    cab.position.set(-0.03, 0.29, 0);
    car.add(body, cab);
    place(car, -13.5 + i * 0.95 + r() * 0.1, 11.6, Math.PI / 2);
  }
  // Bendera Merah Putih di depan gedung kontrol & landasan
  const flags: THREE.ShaderMaterial[] = [];
  for (const [x, z] of [
    [-5, 10.6],
    [-3.2, 4.6],
  ]) {
    const f = flag();
    place(f.group, x, z, 0.5);
    flags.push(f.mat);
  }
  return { group: g, flags };
}

/* ---------------- roket: tekstur & perlengkapan ---------------- */

export function rocketBodyTex(stage: 1 | 2) {
  return canvasTex(512, 1024, (g, w, h) => {
    g.fillStyle = "#f4f6fa";
    g.fillRect(0, 0, w, h);
    // garis panel
    g.strokeStyle = "rgba(120,130,150,0.35)";
    g.lineWidth = 2;
    for (let y = 0; y < h; y += 96) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();
    }
    for (let x = 0; x < w; x += 128) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, h);
      g.stroke();
    }
    // paku keling
    g.fillStyle = "rgba(120,130,150,0.4)";
    for (let y = 8; y < h; y += 96) for (let x = 4; x < w; x += 16) g.fillRect(x, y, 3, 3);
    if (stage === 1) {
      // tulisan RUMILA vertikal + bendera
      g.save();
      g.translate(w * 0.25, h * 0.2);
      g.rotate(Math.PI / 2);
      g.fillStyle = "#1f2a4a";
      g.font = "bold 92px system-ui, sans-serif";
      g.fillText("RUMILA", 0, 0);
      g.restore();
      g.fillStyle = "#e0262b";
      g.fillRect(w * 0.62, h * 0.18, 90, 30);
      g.fillStyle = "#ffffff";
      g.fillRect(w * 0.62, h * 0.18 + 30, 90, 30);
      g.strokeStyle = "#aab";
      g.strokeRect(w * 0.62, h * 0.18, 90, 60);
      // bunga es di bagian bawah (tangki oksigen cair sangat dingin)
      const frost = g.createLinearGradient(0, h * 0.55, 0, h);
      frost.addColorStop(0, "rgba(255,255,255,0)");
      frost.addColorStop(1, "rgba(225,238,250,0.9)");
      g.fillStyle = frost;
      g.fillRect(0, h * 0.55, w, h * 0.45);
    } else {
      g.fillStyle = "#ff7a1a";
      g.fillRect(0, h * 0.1, w, 26);
      g.fillStyle = "#1f2a4a";
      g.font = "bold 60px system-ui, sans-serif";
      g.fillText("MISI 01", w * 0.1, h * 0.5);
    }
  });
}

/** Sirip kisi (grid fin) di puncak tahap pertama. */
export function gridFin() {
  const g = new THREE.Group();
  const m = std(0x3a3f4a, 0.5, 0.6);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.02), m);
  g.add(frame);
  for (let i = -2; i <= 2; i++) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.16, 0.05), m);
    v.position.x = i * 0.045;
    g.add(v);
  }
  return g;
}

/** Kaki pendarat terlipat di dasar tahap pertama. */
export function landingLeg() {
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.08), std(0x2a2f3a, 0.6, 0.4));
  leg.position.y = 0.6;
  const g = new THREE.Group();
  g.add(leg);
  return g;
}

/** Nosel mesin logam (gradasi gelap-panas). */
export function nozzleMaterial() {
  return new THREE.MeshStandardMaterial({
    map: canvasTex(16, 64, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "#8a5a3a");
      gr.addColorStop(0.4, "#4a4e58");
      gr.addColorStop(1, "#23262d");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    }),
    roughness: 0.35,
    metalness: 0.8,
    side: THREE.DoubleSide,
  });
}

/* ---------------- langit & angkasa ---------------- */

export function buildBirds(n: number) {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: 0x2b2b35, side: THREE.DoubleSide });
  const r = rng(71);
  const birds: { l: THREE.Mesh; rr: THREE.Mesh; o: THREE.Group; ph: number }[] = [];
  for (let i = 0; i < n; i++) {
    const o = new THREE.Group();
    const wing = new THREE.PlaneGeometry(0.28, 0.07);
    wing.translate(0.14, 0, 0);
    const l = new THREE.Mesh(wing, mat);
    const rr = new THREE.Mesh(wing, mat);
    rr.rotation.y = Math.PI;
    o.add(l, rr);
    o.position.set((r() - 0.5) * 6, (r() - 0.5) * 1.5, (r() - 0.5) * 4);
    g.add(o);
    birds.push({ l, rr, o, ph: r() * TAU });
  }
  return {
    group: g,
    update(t: number) {
      for (const b of birds) {
        const f = Math.sin(t * 8 + b.ph) * 0.6;
        b.l.rotation.x = f;
        b.rr.rotation.x = f;
      }
      g.position.set(((t * 1.2) % 80) - 40, g.position.y, 10);
    },
  };
}

export function buildSatellite(seed: number) {
  const r = rng(seed);
  const g = new THREE.Group();
  const bodyColor = [0xd4af37, 0xc0c4cc, 0xe9e9e9][seed % 3];
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 1.1),
    new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.4, metalness: 0.5, emissive: bodyColor, emissiveIntensity: 0.25 }),
  );
  g.add(body);
  const panel = new THREE.MeshStandardMaterial({ color: 0x2456c8, roughness: 0.3, metalness: 0.5, emissive: 0x16357a, emissiveIntensity: 0.6 });
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8), std(0xcccccc));
    arm.rotation.z = Math.PI / 2;
    arm.position.x = s * 0.8;
    const p = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.03, 0.9), panel);
    p.position.x = s * 2.2;
    g.add(arm, p);
  }
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 8, 0, TAU, 0, Math.PI / 2.5), new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
  dish.position.z = 0.7;
  dish.rotation.x = -Math.PI / 2;
  g.add(dish);
  g.rotation.set(r() * TAU, r() * TAU, 0);
  g.scale.setScalar(1.6);
  return g;
}

export function buildMoon() {
  const tex = new THREE.TextureLoader().load("/angkasa/tex/2k_moon.jpg");
  tex.colorSpace = THREE.SRGBColorSpace;
  const moon = new THREE.Mesh(new THREE.SphereGeometry(120, 48, 32), new THREE.MeshStandardMaterial({ map: tex, roughness: 1, fog: false }));
  moon.position.set(-2600, 1400, -3400);
  return moon;
}

/** Stasiun Luar Angkasa: rangka, modul, radiator, 8 sayap panel surya, lubang merapat di bawah. */
export function buildStation() {
  const g = new THREE.Group();
  const metal = std(0xdfe3e8, 0.4, 0.6);
  const gold = new THREE.MeshStandardMaterial({ color: 0xc98a2e, roughness: 0.35, metalness: 0.8, emissive: 0x3a2308 });
  const white = std(0xf2f2f2, 0.6);
  const truss = new THREE.Mesh(new THREE.BoxGeometry(9, 0.22, 0.22), metal);
  g.add(truss);
  for (let x = -4.2; x <= 4.2; x += 0.6) {
    const d = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.3), metal);
    d.position.x = x;
    d.rotation.x = Math.PI / 4;
    g.add(d);
  }
  // sayap surya: 4 di tiap ujung
  for (const x of [-4, -3.1, 3.1, 4]) {
    for (const s of [-1, 1]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 3.2), gold);
      p.position.set(x, 0, s * 1.75);
      g.add(p);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 3.3), metal);
      mast.rotation.x = Math.PI / 2;
      mast.position.set(x, 0.02, s * 1.75);
      g.add(mast);
    }
  }
  // radiator putih
  for (const x of [-1.6, 1.6]) {
    const rad = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 1.4), white);
    rad.position.set(x, -0.25, -0.9);
    rad.rotation.x = 0.3;
    g.add(rad);
  }
  // modul bertekanan (tabung) menyilang di tengah
  for (let i = 0; i < 4; i++) {
    const mod = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.1, 20), white);
    mod.rotation.x = Math.PI / 2;
    mod.position.set(0, -0.45, -1.2 + i * 1.05);
    g.add(mod);
  }
  for (const x of [-0.9, 0.9]) {
    const mod = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.9, 20), white);
    mod.rotation.z = Math.PI / 2;
    mod.position.set(x, -0.45, 0.4);
    g.add(mod);
  }
  // lubang merapat menghadap bawah (tempat kapsul menempel)
  const port = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.35, 20), metal);
  port.position.set(0, -0.85, 0.4);
  g.add(port);
  g.userData.portOffset = new THREE.Vector3(0, -1.03, 0.4); // titik sambung relatif pusat stasiun
  g.userData.panelPoint = new THREE.Vector3(3.1, 0.1, 1.2); // panel yang diperiksa saat berjalan di luar
  return g;
}
