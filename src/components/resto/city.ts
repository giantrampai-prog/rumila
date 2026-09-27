// Kota di sekitar Rinoya Resto: jalan dua lajur dengan mobil, motor & bus yang lalu-lalang, trotoar penuh
// pejalan kaki, deretan ruko/gedung berjendela di kedua sisi (jenisnya mengikuti lokasi: sekolah, perkantoran,
// perumahan), lampu jalan, zebra cross, halte, mesin minuman, dan mobil parkir. Lahan restoran di x −6…6, z −5…5.

import * as T from 'three';
import { Merge, backdropTree, swayMaterial, type Kit } from '@/components/fruits/garden/build';
import * as TX from '@/components/fruits/garden/textures';

const std = (c: string, rough = 0.8, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color: c, roughness: rough, ...extra });

function rnd(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function tex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, keep: T.Texture[]) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 4;
  keep.push(t);
  return t;
}

/** Fasad bangunan: dinding berwarna, jendela berderet, pintu/etalase toko dan papan nama. */
function facadeTex(color: string, floors: number, shop: string | null, keep: T.Texture[], r: () => number) {
  return tex(
    256,
    256 * Math.max(1, floors / 2),
    (g) => {
      const W = 256,
        H = 256 * Math.max(1, floors / 2);
      g.fillStyle = color;
      g.fillRect(0, 0, W, H);
      const fh = H / floors;
      for (let f = shop ? 1 : 0; f < floors; f++) {
        const y = H - (f + 1) * fh;
        for (let k = 0; k < 3; k++) {
          const x = 22 + k * 78;
          g.fillStyle = '#2d3e52';
          g.fillRect(x, y + fh * 0.22, 56, fh * 0.52);
          g.fillStyle = r() < 0.35 ? '#ffe7a8' : '#9cc6e8';
          g.fillRect(x + 4, y + fh * 0.22 + 4, 48, fh * 0.52 - 8);
          g.fillStyle = 'rgba(255,255,255,.25)';
          g.fillRect(x + 6, y + fh * 0.22 + 6, 10, fh * 0.52 - 12);
          g.fillStyle = 'rgba(0,0,0,.2)';
          g.fillRect(x - 4, y + fh * 0.74, 64, 6);
        }
      }
      if (shop) {
        const y = H - fh;
        g.fillStyle = '#2d3e52';
        g.fillRect(14, y + fh * 0.28, W - 28, fh * 0.72);
        g.fillStyle = '#bfe0f5';
        g.fillRect(20, y + fh * 0.32, W - 40, fh * 0.6);
        g.fillStyle = '#6a4a3a';
        g.fillRect(W / 2 - 22, y + fh * 0.4, 44, fh * 0.6);
        g.fillStyle = '#ffffff';
        g.fillRect(10, y + 4, W - 20, fh * 0.22);
        g.fillStyle = '#1f2f5a';
        g.font = `900 ${Math.round(fh * 0.15)}px system-ui, sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(shop, W / 2, y + 4 + fh * 0.11);
      }
    },
    keep,
  );
}

function person(r: () => number) {
  const g = new T.Group();
  const shirt = ['#e8504a', '#3f7ac8', '#6aa84f', '#f2b134', '#8a5aa8', '#ffffff', '#2d3e52', '#ff8ab0'][Math.floor(r() * 8)];
  const skin = ['#f0c8a0', '#d9a47a', '#c08a60', '#e8b890'][Math.floor(r() * 4)];
  const body = new T.Mesh(new T.CapsuleGeometry(0.18, 0.4, 4, 10), std(shirt, 0.7));
  body.position.y = 0.95;
  const head = new T.Mesh(new T.SphereGeometry(0.17, 12, 10), std(skin, 0.6));
  head.position.y = 1.5;
  const hair = new T.Mesh(new T.SphereGeometry(0.175, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.1), std(r() < 0.5 ? '#2a1a10' : '#4a3020', 0.7));
  hair.position.y = 1.52;
  g.add(body, head, hair);
  const legs: T.Object3D[] = [];
  for (const s of [-1, 1]) {
    const leg = new T.Group();
    const m = new T.Mesh(new T.CapsuleGeometry(0.07, 0.42, 3, 8), std(r() < 0.5 ? '#2a3a5a' : '#5a4a3a', 0.8));
    m.position.y = -0.3;
    leg.add(m);
    leg.position.set(s * 0.09, 0.72, 0);
    g.add(leg);
    legs.push(leg);
  }
  if (r() < 0.25) {
    // tas / payung kecil
    const bag = new T.Mesh(new T.BoxGeometry(0.2, 0.25, 0.1), std('#8a5a34', 0.8));
    bag.position.set(0.22, 0.9, 0);
    g.add(bag);
  }
  return { g, legs };
}

function car(color: string, kind: 'car' | 'bike' | 'bus') {
  const g = new T.Group();
  const paint = std(color, 0.35, { metalness: 0.4 });
  const glass = std('#2d3e52', 0.1, { metalness: 0.5 });
  const tire = std('#1a1a1a', 0.8);
  if (kind === 'bike') {
    const body = new T.Mesh(new T.BoxGeometry(1.2, 0.35, 0.3), paint);
    body.position.y = 0.55;
    const rider = new T.Mesh(new T.CapsuleGeometry(0.16, 0.35, 4, 8), std('#3f5a8a', 0.7));
    rider.position.set(-0.1, 1.05, 0);
    const helm = new T.Mesh(new T.SphereGeometry(0.17, 10, 8), std(color, 0.3));
    helm.position.set(-0.05, 1.45, 0);
    g.add(body, rider, helm);
    for (const x of [-0.5, 0.5]) {
      const w = new T.Mesh(new T.TorusGeometry(0.22, 0.06, 6, 14), tire);
      w.position.set(x, 0.28, 0);
      g.add(w);
    }
    return g;
  }
  const L = kind === 'bus' ? 7 : 3.6,
    Hh = kind === 'bus' ? 2.4 : 0.8;
  const body = new T.Mesh(new T.BoxGeometry(L, Hh, 1.7), paint);
  body.position.y = 0.35 + Hh / 2;
  g.add(body);
  if (kind === 'bus') {
    const win = new T.Mesh(new T.BoxGeometry(L - 0.6, 0.8, 1.72), glass);
    win.position.y = 2.0;
    const stripe = new T.Mesh(new T.BoxGeometry(L + 0.01, 0.2, 1.71), std('#ffffff', 0.5));
    stripe.position.y = 1.2;
    g.add(win, stripe);
  } else {
    const cab = new T.Mesh(new T.BoxGeometry(L * 0.55, 0.62, 1.5), glass);
    cab.position.set(-0.15, 1.45, 0);
    g.add(cab);
  }
  for (const x of [-L / 2 + 0.7, L / 2 - 0.7])
    for (const z of [-0.85, 0.85]) {
      const w = new T.Mesh(new T.CylinderGeometry(0.35, 0.35, 0.25, 14), tire);
      w.rotation.x = Math.PI / 2;
      w.position.set(x, 0.35, z);
      g.add(w);
    }
  for (const z of [-0.55, 0.55]) {
    const hl = new T.Mesh(new T.BoxGeometry(0.05, 0.16, 0.3), std('#fff6c8', 0.2, { emissive: '#fff0a0', emissiveIntensity: 0.6 }));
    hl.position.set(L / 2, 0.75, z);
    const tl = new T.Mesh(new T.BoxGeometry(0.05, 0.14, 0.3), std('#ff3a2a', 0.3, { emissive: '#ff2010', emissiveIntensity: 0.4 }));
    tl.position.set(-L / 2, 0.75, z);
    g.add(hl, tl);
  }
  return g;
}

const SHOPS: Record<string, string[]> = {
  sekolah: ['TOKO BUKU', 'FOTOKOPI', 'ES TEH', 'ALAT TULIS', 'BAKSO', 'MINIMARKET', 'ROTI', 'LES MUSIK'],
  kantor: ['KOPI', 'BANK', 'APOTEK', 'MINIMARKET', 'LAUNDRY', 'SALON', 'KANTOR POS', 'ROTI'],
  perumahan: ['WARUNG', 'LAUNDRY', 'APOTEK', 'SAYUR', 'BENGKEL', 'ROTI', 'MINIMARKET', 'KLINIK'],
};
const COLORS = ['#f2e2c4', '#e8c8a0', '#cfe0d8', '#f0d0c8', '#d8d8e8', '#f6ecd0', '#c8dce8', '#e8d0e0'];

export class City {
  group = new T.Group();
  private uTime = { value: 0 };
  private textures: T.Texture[] = [];
  private cars: { g: T.Group; x: number; lane: number; speed: number; len: number }[] = [];
  private walkers: { g: T.Group; legs: T.Object3D[]; x: number; z: number; dir: number; speed: number; ph: number }[] = [];

  constructor(loc: string) {
    const r = rnd(loc.length * 977 + 13);
    const keep = this.textures;
    const add = (o: T.Object3D) => (this.group.add(o), o);
    // tanah, jalan, trotoar, zebra cross, jalan samping
    const ground = new T.Mesh(new T.PlaneGeometry(140, 120), std('#8fbf62', 1));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    add(ground);
    const asphalt = tex(
      128,
      128,
      (g) => {
        g.fillStyle = '#55585f';
        g.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 600; i++) {
          g.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.06)';
          g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
        }
      },
      keep,
    );
    asphalt.wrapS = asphalt.wrapT = T.RepeatWrapping;
    asphalt.repeat.set(30, 2);
    const road = new T.Mesh(new T.PlaneGeometry(140, 7), std('#ffffff', 0.95, { map: asphalt }));
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.02, 10);
    road.receiveShadow = true;
    add(road);
    for (let x = -68; x < 70; x += 4) {
      const line = new T.Mesh(new T.PlaneGeometry(2, 0.14), std('#f5f1e6', 0.8));
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.03, 10);
      add(line);
    }
    for (let k = 0; k < 7; k++) {
      const zb = new T.Mesh(new T.PlaneGeometry(0.5, 6.4), std('#f5f5f0', 0.8));
      zb.rotation.x = -Math.PI / 2;
      zb.position.set(-9 + k * 0.9, 0.03, 10);
      add(zb);
    }
    // pelataran paving di depan deretan ruko sampai trotoar
    const pave = new T.Mesh(new T.BoxGeometry(140, 0.1, 1.4), std('#c9c0b0', 0.95));
    pave.position.set(0, 0.05, 3.9);
    pave.receiveShadow = true;
    add(pave);
    for (const z of [5.9, 14.1]) {
      const walk = new T.Mesh(new T.BoxGeometry(140, 0.14, 2.6), std('#d8d0c2', 0.9));
      walk.position.set(0, 0.07, z);
      walk.receiveShadow = true;
      add(walk);
      const curb = new T.Mesh(new T.BoxGeometry(140, 0.16, 0.18), std('#bdb6aa', 0.9));
      curb.position.set(0, 0.08, z + (z < 10 ? 1.3 : -1.3));
      add(curb);
    }

    // deretan bangunan: sisi resto (di kiri & kanan lahan) dan seberang jalan
    const shops = SHOPS[loc] ?? SHOPS.kantor;
    let si = 0;
    const building = (x: number, z: number, w: number, d: number, floors: number, front: 1 | -1, shop: boolean) => {
      const h = floors * 2.6;
      const color = COLORS[Math.floor(r() * COLORS.length)];
      const ft = facadeTex(color, floors, shop ? shops[si++ % shops.length] : null, keep, r);
      const side = std(color, 0.9);
      const mats = [side, side, std('#8a8f96', 0.9), side, side, side];
      mats[front > 0 ? 4 : 5] = new T.MeshStandardMaterial({ map: ft, roughness: 0.85 });
      const b = new T.Mesh(new T.BoxGeometry(w, h, d), mats);
      b.position.set(x, h / 2, z);
      b.castShadow = b.receiveShadow = true;
      add(b);
      // atap datar dengan tandon & AC
      const tank = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 0.9, 12), std('#e8e8e8', 0.5));
      tank.position.set(x + (r() - 0.5) * (w - 1.5), h + 0.45, z + (r() - 0.5) * (d - 1.5));
      add(tank);
      if (shop) {
        // kanopi toko
        const aw = new T.Mesh(new T.BoxGeometry(w - 0.4, 0.12, 1.4), std(['#e8504a', '#3f7ac8', '#f2b134', '#6aa84f'][Math.floor(r() * 4)], 0.7));
        aw.position.set(x, 2.3, z + front * (d / 2 + 0.7));
        aw.rotation.x = front * 0.18;
        add(aw);
      }
    };
    // sisi yang sama dengan restoran: berderet rapat, sisakan lahan resto (x −7…7)
    for (let x = -64; x < 64; ) {
      const w = 5 + Math.floor(r() * 4);
      if (x + w > -7.5 && x < 7.5) {
        x = 7.5;
        continue;
      }
      building(x + w / 2, -1, w - 0.3, 9, 1 + Math.floor(r() * (loc === 'kantor' ? 4 : 3)), 1, true);
      x += w;
    }
    // seberang jalan
    if (loc === 'sekolah') {
      // gedung sekolah panjang, pagar & tiang bendera
      const sch = new T.Mesh(new T.BoxGeometry(26, 6, 8), [std('#f0e8d8', 0.9), std('#f0e8d8', 0.9), std('#b8423a', 0.8), std('#f0e8d8', 0.9), std('#f0e8d8', 0.9), new T.MeshStandardMaterial({ map: facadeTex('#f0e8d8', 2, 'SD RINOYA', keep, r) })]);
      sch.rotation.y = Math.PI;
      sch.position.set(0, 3, 21);
      sch.castShadow = true;
      add(sch);
      for (let x = -14; x <= 14; x += 1) {
        const post = new T.Mesh(new T.BoxGeometry(0.08, 1.2, 0.08), std('#3a5a8a', 0.6));
        post.position.set(x, 0.6, 16);
        add(post);
      }
      const pole = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 6, 8), std('#dddddd', 0.4, { metalness: 0.6 }));
      pole.position.set(-10, 3, 17.5);
      add(pole);
      const flag = new T.Mesh(new T.PlaneGeometry(1.4, 0.9), std('#ffffff', 0.8, { side: T.DoubleSide }));
      const red = new T.Mesh(new T.PlaneGeometry(1.4, 0.45), std('#e0262b', 0.8, { side: T.DoubleSide }));
      flag.position.set(-9.3, 5.4, 17.5);
      red.position.set(-9.3, 5.62, 17.51);
      add(flag);
      add(red);
      for (let x = -60; x < -16; x += 7) building(x, 21, 6.5, 8, 2 + Math.floor(r() * 2), -1, r() < 0.6);
      for (let x = 20; x < 64; x += 7) building(x, 21, 6.5, 8, 2 + Math.floor(r() * 2), -1, r() < 0.6);
    } else if (loc === 'perumahan') {
      // rumah-rumah beratap pelana dengan pagar & halaman
      for (let x = -60; x < 64; x += 8) {
        const c = COLORS[Math.floor(r() * COLORS.length)];
        const house = new T.Mesh(new T.BoxGeometry(6, 3, 6), std(c, 0.9));
        house.position.set(x, 1.5, 21);
        house.castShadow = true;
        add(house);
        const roof = new T.Mesh(new T.ConeGeometry(4.6, 2.2, 4), std(['#b8423a', '#6a4a3a', '#3a5a6a'][Math.floor(r() * 3)], 0.8));
        roof.rotation.y = Math.PI / 4;
        roof.position.set(x, 4.1, 21);
        roof.castShadow = true;
        add(roof);
        const door = new T.Mesh(new T.PlaneGeometry(0.9, 1.8), std('#6a4a3a', 0.8));
        door.position.set(x, 0.9, 17.99);
        door.rotation.y = Math.PI;
        add(door);
        for (const s of [-1, 1]) {
          const w = new T.Mesh(new T.PlaneGeometry(1.1, 0.9), std('#9cc6e8', 0.2));
          w.position.set(x + s * 1.7, 1.7, 17.99);
          w.rotation.y = Math.PI;
          add(w);
        }
        const fence = new T.Mesh(new T.BoxGeometry(7, 0.8, 0.1), std('#f4f4f0', 0.8));
        fence.position.set(x, 0.4, 16.2);
        add(fence);
      }
    } else {
      // perkantoran: gedung tinggi berkaca
      for (let x = -60; x < 64; x += 11) {
        const floors = 4 + Math.floor(r() * 6);
        const h = floors * 3;
        const glass = tex(
          128,
          256,
          (g) => {
            g.fillStyle = '#5a7a9a';
            g.fillRect(0, 0, 128, 256);
            for (let y = 0; y < 256; y += 16)
              for (let k = 0; k < 128; k += 16) {
                g.fillStyle = Math.random() < 0.3 ? '#cfe6ff' : '#7a9aba';
                g.fillRect(k + 1, y + 1, 14, 13);
              }
          },
          keep,
        );
        glass.wrapS = glass.wrapT = T.RepeatWrapping;
        glass.repeat.set(2, floors / 4);
        const b = new T.Mesh(new T.BoxGeometry(9, h, 9), std('#ffffff', 0.2, { map: glass, metalness: 0.4 }));
        b.position.set(x, h / 2, 23);
        b.castShadow = true;
        add(b);
      }
    }

    // perabot jalan: lampu jalan, pohon, halte, mesin minuman, mobil parkir
    const poleM = std('#4a4f57', 0.4, { metalness: 0.7 });
    for (let x = -60; x <= 60; x += 10)
      for (const z of [7, 13]) {
        const p = new T.Mesh(new T.CylinderGeometry(0.07, 0.09, 4.2, 8), poleM);
        p.position.set(x, 2.1, z);
        const arm = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 1.2), poleM);
        arm.position.set(x, 4.15, z + (z < 10 ? 0.55 : -0.55));
        const lamp = new T.Mesh(new T.BoxGeometry(0.4, 0.12, 0.25), std('#fff6c8', 0.3, { emissive: '#ffe8a0', emissiveIntensity: 0.5 }));
        lamp.position.set(x, 4.05, z + (z < 10 ? 1.1 : -1.1));
        add(p);
        add(arm);
        add(lamp);
      }
    // pohon peneduh jalan (model pohon realistis yang sama dengan Kebun Rinoya: batang bertekstur, tajuk daun lebat)
    const kit: Kit = { bark: new Merge(), leaf: new Merge(), plain: new Merge() };
    const S = 0.62;
    let seed = 700;
    for (let x = -56; x <= 56; x += 8) {
      if (Math.abs(x + 4) < 9) continue;
      for (const z of [6.5, 13.5]) backdropTree(kit, (x + 4 + (r() - 0.5)) / S, z / S, 0.14 / S, 1.05 + r() * 0.35, seed++);
    }
    const flora = new T.Group();
    flora.scale.setScalar(S);
    const barkMap = TX.bark(),
      leafMap = TX.foliageAtlas();
    keep.push(barkMap, leafMap);
    for (const m of [
      kit.bark.empty ? null : kit.bark.build(swayMaterial(this.uTime, { map: barkMap, roughness: 0.95 })),
      kit.leaf.empty ? null : kit.leaf.build(swayMaterial(this.uTime, { map: leafMap, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.8 }, true)),
      kit.plain.empty ? null : kit.plain.build(swayMaterial(this.uTime, { roughness: 0.8 })),
    ])
      if (m) {
        m.castShadow = true;
        m.receiveShadow = true;
        flora.add(m);
      }
    add(flora);
    // halte bus di seberang
    const shelter = new T.Group();
    const roofS = new T.Mesh(new T.BoxGeometry(4, 0.12, 1.6), std('#3f7ac8', 0.5));
    roofS.position.y = 2.5;
    const bench = new T.Mesh(new T.BoxGeometry(3, 0.12, 0.5), std('#8a5a34', 0.7));
    bench.position.y = 0.55;
    shelter.add(roofS, bench);
    for (const x of [-1.9, 1.9]) {
      const p = new T.Mesh(new T.BoxGeometry(0.08, 2.5, 0.08), poleM);
      p.position.set(x, 1.25, -0.6);
      shelter.add(p);
    }
    const sign = new T.Mesh(
      new T.PlaneGeometry(1.4, 0.5),
      new T.MeshStandardMaterial({
        map: tex(
          128,
          48,
          (g) => {
            g.fillStyle = '#1f5fd1';
            g.fillRect(0, 0, 128, 48);
            g.fillStyle = '#fff';
            g.font = '900 26px system-ui';
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillText('HALTE', 64, 25);
          },
          keep,
        ),
      }),
    );
    sign.position.set(0, 2.85, 0.2);
    sign.rotation.y = Math.PI;
    shelter.add(sign);
    shelter.position.set(14, 0.14, 14.3);
    shelter.rotation.y = Math.PI;
    add(shelter);
    // mesin minuman khas Jepang di depan resto
    const vend = new T.Mesh(new T.BoxGeometry(0.9, 1.9, 0.7), std('#e8322a', 0.4));
    vend.position.set(6.75, 1.1, 3.9);
    vend.castShadow = true;
    add(vend);
    const vwin = new T.Mesh(new T.PlaneGeometry(0.7, 0.9), std('#cfe6ff', 0.2, { emissive: '#a0c8ff', emissiveIntensity: 0.4 }));
    vwin.position.set(6.75, 1.4, 4.26);
    add(vwin);
    // mobil parkir di tepi jalan
    for (const x of [-20, -28, 22, 34, -44])
      {
        const c = car(['#e8504a', '#ffffff', '#3f7ac8', '#2d2d2d', '#f2b134'][Math.floor(r() * 5)], 'car');
        c.position.set(x, 0.02, 7.6);
        add(c);
      }

    // lalu lintas: mobil, motor, bus (lajur 8,8 ke kanan & 11,2 ke kiri)
    for (let i = 0; i < 16; i++) {
      const kind = i % 7 === 0 ? 'bus' : i % 3 === 0 ? 'bike' : 'car';
      const lane = i % 2;
      const c = car(kind === 'bus' ? '#2e9d4a' : ['#e8504a', '#ffffff', '#3f7ac8', '#2d2d2d', '#f2b134', '#9aa3ae', '#8a5aa8'][Math.floor(r() * 7)], kind);
      c.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
      if (lane === 1) c.rotation.y = Math.PI;
      add(c);
      this.cars.push({ g: c, x: -70 + r() * 140, lane, speed: (kind === 'bus' ? 4 : kind === 'bike' ? 7 : 6) + r() * 3, len: kind === 'bus' ? 7 : 4 });
    }
    // pejalan kaki di kedua trotoar
    for (let i = 0; i < 26; i++) {
      const p = person(r);
      p.g.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
      add(p.g);
      const z = (i % 2 ? 5.5 : 14.4) + (r() - 0.5) * 0.6;
      this.walkers.push({ ...p, x: -60 + r() * 120, z, dir: r() < 0.5 ? 1 : -1, speed: 0.9 + r() * 0.6, ph: r() * 6 });
    }
  }

  update(t: number, dt: number) {
    this.uTime.value = t;
    // mobil menjaga jarak dengan kendaraan di depannya pada lajur yang sama
    for (const c of this.cars) {
      const dir = c.lane === 0 ? 1 : -1;
      let v = c.speed;
      for (const o of this.cars) {
        if (o === c || o.lane !== c.lane) continue;
        const ahead = (o.x - c.x) * dir;
        if (ahead > 0 && ahead < c.len + 3) v = Math.min(v, o.speed * 0.8);
      }
      c.x += dir * v * dt;
      if (c.x > 72) c.x = -72;
      if (c.x < -72) c.x = 72;
      c.g.position.set(c.x, 0.02, c.lane === 0 ? 8.7 : 11.3);
    }
    for (const w of this.walkers) {
      w.x += w.dir * w.speed * dt;
      if (w.x > 64) w.dir = -1;
      if (w.x < -64) w.dir = 1;
      w.g.position.set(w.x, 0.14 + Math.abs(Math.sin(t * 6 * w.speed + w.ph)) * 0.04, w.z);
      w.g.rotation.y = w.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const s = Math.sin(t * 6 * w.speed + w.ph) * 0.5;
      w.legs[0].rotation.x = s;
      w.legs[1].rotation.x = -s;
    }
  }

  dispose() {
    this.group.traverse((o) => {
      const m = o as T.Mesh;
      m.geometry?.dispose();
    });
    this.textures.forEach((t) => t.dispose());
  }
}
