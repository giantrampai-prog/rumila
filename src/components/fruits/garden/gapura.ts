// Gapura khas Indonesia di gerbang kebun: dua tiang bata merah bertingkat bermahkota batu, balok kayu
// beratap genteng joglo, papan "Selamat Datang di Kebun Rinoya", penjor janur melengkung, lampion, dan pot bunga.

import * as T from 'three';

function tex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

/** Bata merah tersusun berselang dengan nat abu-abu. */
function brickTex() {
  return tex(
    256,
    256,
    (g) => {
      g.fillStyle = '#cfc6b8';
      g.fillRect(0, 0, 256, 256);
      const bh = 32,
        bw = 64;
      for (let row = 0; row < 8; row++)
        for (let col = -1; col < 5; col++) {
          const x = col * bw + (row % 2 ? bw / 2 : 0);
          const y = row * bh;
          const l = 0.85 + Math.random() * 0.3;
          g.fillStyle = `rgb(${Math.round(168 * l)},${Math.round(72 * l)},${Math.round(44 * l)})`;
          g.fillRect(x + 3, y + 3, bw - 6, bh - 6);
          for (let k = 0; k < 18; k++) {
            g.fillStyle = `rgba(${Math.random() < 0.5 ? '60,20,10' : '230,160,120'},0.18)`;
            g.fillRect(x + 3 + Math.random() * (bw - 8), y + 3 + Math.random() * (bh - 8), 2, 2);
          }
        }
    },
    [1, 2],
  );
}

function stoneTex() {
  return tex(128, 128, (g) => {
    g.fillStyle = '#b9b2a4';
    g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 900; i++) {
      const l = 140 + Math.random() * 80;
      g.fillStyle = `rgba(${l},${l - 6},${l - 14},0.5)`;
      g.fillRect(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
  });
}

function signBoard(top: string, bottom: string) {
  return tex(1024, 256, (g) => {
    const wood = g.createLinearGradient(0, 0, 0, 256);
    wood.addColorStop(0, '#6d4526');
    wood.addColorStop(1, '#4e2f17');
    g.fillStyle = wood;
    g.beginPath();
    g.roundRect(4, 4, 1016, 248, 30);
    g.fill();
    for (let i = 0; i < 60; i++) {
      g.strokeStyle = 'rgba(30,15,5,.22)';
      g.lineWidth = 1 + Math.random() * 2;
      const y = 10 + Math.random() * 236;
      g.beginPath();
      g.moveTo(12, y);
      g.bezierCurveTo(300, y + 4, 700, y - 4, 1012, y + (Math.random() - 0.5) * 6);
      g.stroke();
    }
    g.strokeStyle = '#d9a441';
    g.lineWidth = 8;
    g.beginPath();
    g.roundRect(24, 24, 976, 208, 22);
    g.stroke();
    g.fillStyle = '#ffe08a';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '800 64px system-ui, sans-serif';
    g.shadowColor = 'rgba(0,0,0,.45)';
    g.shadowOffsetY = 4;
    g.shadowBlur = 6;
    g.fillText(top, 512, 92);
    let fs = 78;
    g.font = `900 ${fs}px system-ui, sans-serif`;
    while (g.measureText(bottom).width > 930 && fs > 30) g.font = `900 ${(fs -= 4)}px system-ui, sans-serif`;
    g.fillStyle = '#ffffff';
    g.fillText(bottom, 512, 176);
  });
}

export function buildGapura(textures: T.Texture[], roofMap: T.Texture) {
  const g = new T.Group();
  const bt = brickTex(),
    st = stoneTex(),
    // sisi luar (dilihat saat masuk) menyambut; sisi dalam (saat keluar) berpamitan
    welcome = signBoard('SELAMAT DATANG', 'di Kebun Rinoya'),
    bye = signBoard('SAMPAI JUMPA', 'Terima kasih sudah berkunjung!');
  textures.push(bt, st, welcome, bye);
  const brick = new T.MeshStandardMaterial({ map: bt, roughness: 0.9 });
  const stone = new T.MeshStandardMaterial({ map: st, roughness: 0.95, color: '#e8e2d6' });
  const wood = new T.MeshStandardMaterial({ color: '#5e3a1f', roughness: 0.75 });
  const roof = new T.MeshStandardMaterial({ map: roofMap, color: '#b44a2a', roughness: 0.7 });
  const gold = new T.MeshStandardMaterial({ color: '#d9a441', roughness: 0.35, metalness: 0.6 });
  const add = (geo: T.BufferGeometry, m: T.Material, x: number, y: number, z: number) => {
    const mesh = new T.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  };
  // dua tiang bata bertingkat (gaya candi) bermahkota batu
  for (const s of [-1, 1]) {
    const x = s * 3.6;
    add(new T.BoxGeometry(1.6, 0.35, 1.6), stone, x, 0.17, 0);
    add(new T.BoxGeometry(1.3, 4.2, 1.3), brick, x, 2.45, 0);
    add(new T.BoxGeometry(1.5, 0.22, 1.5), stone, x, 4.66, 0);
    add(new T.BoxGeometry(1.2, 0.45, 1.2), brick, x, 5.0, 0);
    add(new T.BoxGeometry(1.35, 0.18, 1.35), stone, x, 5.3, 0);
    add(new T.BoxGeometry(0.9, 0.4, 0.9), brick, x, 5.58, 0);
    const crown = add(new T.ConeGeometry(0.62, 0.9, 4), stone, x, 6.23, 0);
    crown.rotation.y = Math.PI / 4;
    add(new T.SphereGeometry(0.14, 12, 10), gold, x, 6.75, 0);
    // relief panel & lampu
    const panel = add(new T.BoxGeometry(0.7, 1.4, 0.05), stone, x, 2.6, 0.66);
    panel.material = stone;
    const lamp = add(new T.CylinderGeometry(0.16, 0.12, 0.34, 8), new T.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffc85a', emissiveIntensity: 0.8 }), x - s * 0.95, 3.6, 0.3);
    lamp.castShadow = false;
    add(new T.BoxGeometry(0.5, 0.05, 0.05), wood, x - s * 0.72, 3.85, 0.3);
    // pot bunga di kaki tiang
    for (const zz of [0.95, -0.95]) {
      add(new T.CylinderGeometry(0.34, 0.24, 0.5, 14), new T.MeshStandardMaterial({ color: '#9c5a36', roughness: 0.9 }), x + s * 0.2, 0.25, zz);
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2;
        const bloom = add(new T.SphereGeometry(0.09, 8, 6), new T.MeshStandardMaterial({ color: ['#ff4f7b', '#ffd23f', '#ff8a3d', '#ffffff'][k % 4], roughness: 0.6 }), x + s * 0.2 + Math.cos(a) * 0.18, 0.62 + (k % 2) * 0.08, zz + Math.sin(a) * 0.18);
        bloom.castShadow = false;
      }
      add(new T.SphereGeometry(0.26, 10, 8), new T.MeshStandardMaterial({ color: '#3f8a36', roughness: 0.9 }), x + s * 0.2, 0.55, zz);
    }
  }
  // balok kayu melintang + atap genteng joglo
  add(new T.BoxGeometry(8.6, 0.45, 0.7), wood, 0, 5.25, 0);
  add(new T.BoxGeometry(8.2, 0.16, 0.9), wood, 0, 5.55, 0);
  const roofMesh = add(new T.ConeGeometry(1, 1, 4, 1), roof, 0, 6.35, 0);
  roofMesh.rotation.y = Math.PI / 4;
  roofMesh.scale.set(6.4, 1.5, 1.35);
  add(new T.BoxGeometry(2.2, 0.12, 0.12), gold, 0, 7.1, 0);
  add(new T.SphereGeometry(0.16, 12, 10), gold, 0, 7.25, 0);
  // papan nama tergantung: depan (+z) menghadap ke dalam kebun, belakang menghadap ke luar
  for (const back of [false, true]) {
    const board = new T.Mesh(new T.PlaneGeometry(5.6, 1.4), new T.MeshStandardMaterial({ map: back ? welcome : bye, roughness: 0.7 }));
    board.position.set(0, 4.25, back ? -0.07 : 0.07);
    if (back) board.rotation.y = Math.PI;
    board.castShadow = true;
    g.add(board);
  }
  for (const s of [-1, 1]) add(new T.CylinderGeometry(0.02, 0.02, 0.6), gold, s * 2.4, 4.95, 0);
  // penjor janur: tiang bambu melengkung dengan hiasan daun kelapa muda
  const bamboo = new T.MeshStandardMaterial({ color: '#c9b36a', roughness: 0.7 });
  const janur = new T.MeshStandardMaterial({ color: '#e8d98a', roughness: 0.7, side: T.DoubleSide });
  const penjors: T.Object3D[] = [];
  for (const s of [-1, 1]) {
    const pts: T.Vector3[] = [];
    for (let k = 0; k <= 12; k++) {
      const u = k / 12;
      pts.push(new T.Vector3(s * (5.2 + u * u * 1.4), u * 8.2 - u * u * u * 1.2, 0.6 + u * u * 0.8));
    }
    const curve = new T.CatmullRomCurve3(pts);
    add(new T.TubeGeometry(curve, 40, 0.07, 8), bamboo, 0, 0, 0);
    const hang = new T.Group();
    for (let k = 0; k < 14; k++) {
      const p = curve.getPoint(0.35 + k * 0.045);
      const leaf = new T.Mesh(new T.PlaneGeometry(0.1, 0.55), janur);
      leaf.position.copy(p).add(new T.Vector3(0, -0.28, 0));
      leaf.rotation.y = k * 0.7;
      hang.add(leaf);
    }
    const tip = curve.getPoint(1);
    const tassel = new T.Group();
    for (let k = 0; k < 8; k++) {
      const leaf = new T.Mesh(new T.PlaneGeometry(0.12, 1.1), janur);
      leaf.position.set(0, -0.55, 0);
      leaf.rotation.y = (k / 8) * Math.PI;
      tassel.add(leaf);
    }
    tassel.position.copy(tip);
    hang.add(tassel);
    g.add(hang);
    penjors.push(tassel);
  }
  g.userData.update = (t: number) => penjors.forEach((p, i) => (p.rotation.z = Math.sin(t * 1.4 + i) * 0.12));
  return g;
}
