'use client';

// Belah buah: model 3D buah utuh berputar pelan → ketuk "Belah!" → terbelah dua dan kedua belahan membuka
// menghadap anak, memperlihatkan penampang (daging, biji, siung, rongga) sesuai jenis buahnya.

import { useEffect, useRef, useState } from 'react';
import * as T from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Icon } from '@/components/ui';
import { FRUIT_BY_ID, type Fruit } from '@/lib/fruits/catalog';
import { sectionOf, type Section } from '@/lib/fruits/farm';
import { createFruitModel, disposeFruit } from '@/lib/fruits/models';
import { sfx } from '@/lib/sfx';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';

/** Lukis penampang buah (lingkaran 512²) menurut gaya isinya. */
function sectionTexture(f: Fruit, s: Section) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d')!;
  const R = 250,
    C = 256;
  let seed = f.id.length * 97;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  g.fillStyle = f.color;
  g.beginPath();
  g.arc(C, C, R, 0, 7);
  g.fill();
  g.fillStyle = s.rind;
  g.beginPath();
  g.arc(C, C, R * 0.93, 0, 7);
  g.fill();
  const fleshR = s.style === 'segments' ? R * 0.84 : s.style === 'hollow' ? R * 0.86 : R * 0.9;
  const grad = g.createRadialGradient(C, C, 0, C, C, fleshR);
  grad.addColorStop(0, s.flesh);
  grad.addColorStop(1, shade(s.flesh, -0.08));
  g.fillStyle = grad;
  g.beginPath();
  g.arc(C, C, fleshR, 0, 7);
  g.fill();
  const seedAt = (x: number, y: number, w: number, h: number, a = 0, col = s.seed) => {
    g.fillStyle = col;
    g.beginPath();
    g.ellipse(x, y, w, h, a, 0, 7);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.25)';
    g.beginPath();
    g.ellipse(x - w * 0.3, y - h * 0.3, w * 0.35, h * 0.3, a, 0, 7);
    g.fill();
  };
  switch (s.style) {
    case 'pit':
      seedAt(C, C, fleshR * 0.42, fleshR * 0.55);
      break;
    case 'core':
      g.fillStyle = shade(s.flesh, 0.08);
      star(g, C, C, 5, fleshR * 0.28, fleshR * 0.12);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
        seedAt(C + Math.cos(a) * fleshR * 0.16, C + Math.sin(a) * fleshR * 0.16, 9, 16, a + Math.PI / 2);
      }
      break;
    case 'segments': {
      const n = f.id === 'manggis' ? 6 : f.id === 'salak' ? 3 : f.id === 'duku' || f.id === 'langsat' ? 5 : 10;
      g.strokeStyle = 'rgba(255,255,255,.85)';
      g.lineWidth = 7;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        g.beginPath();
        g.moveTo(C, C);
        g.lineTo(C + Math.cos(a) * fleshR, C + Math.sin(a) * fleshR);
        g.stroke();
      }
      // kantong-kantong sari buah
      g.fillStyle = 'rgba(255,255,255,.18)';
      for (let k = 0; k < 160; k++) {
        const a = rnd() * Math.PI * 2,
          d = (0.2 + rnd() * 0.75) * fleshR;
        g.beginPath();
        g.ellipse(C + Math.cos(a) * d, C + Math.sin(a) * d, 5, 12, a, 0, 7);
        g.fill();
      }
      g.fillStyle = '#ffffff';
      g.beginPath();
      g.arc(C, C, fleshR * 0.1, 0, 7);
      g.fill();
      if (f.id !== 'lemon' && f.id !== 'jeruk-nipis') for (let k = 0; k < 3; k++) seedAt(C + Math.cos(k * 2.1) * fleshR * 0.35, C + Math.sin(k * 2.1) * fleshR * 0.35, 9, 15, k * 2.1, s.seed === '#5a3a1e' ? '#f2e6c8' : s.seed);
      break;
    }
    case 'cavity': {
      g.fillStyle = shade(s.flesh, f.id === 'pepaya' ? -0.25 : 0.1);
      g.beginPath();
      g.ellipse(C, C, fleshR * 0.42, fleshR * 0.5, 0, 0, 7);
      g.fill();
      for (let k = 0; k < 70; k++) {
        const a = rnd() * Math.PI * 2,
          d = rnd() ** 0.6 * fleshR * 0.4;
        seedAt(C + Math.cos(a) * d, C + Math.sin(a) * d * 1.15, 8, 10, a);
      }
      break;
    }
    case 'specks':
      for (let k = 0; k < 420; k++) {
        const a = rnd() * Math.PI * 2,
          d = Math.sqrt(rnd()) * fleshR * 0.92;
        g.fillStyle = s.seed;
        g.beginPath();
        g.ellipse(C + Math.cos(a) * d, C + Math.sin(a) * d, 3.5, 5, a, 0, 7);
        g.fill();
      }
      break;
    case 'ring':
      g.fillStyle = '#f4f7d8';
      g.beginPath();
      g.ellipse(C, C, fleshR * 0.22, fleshR * 0.3, 0, 0, 7);
      g.fill();
      for (let k = 0; k < 60; k++) {
        const a = (k / 60) * Math.PI * 2;
        const d = fleshR * (0.36 + (k % 2) * 0.05);
        g.fillStyle = s.seed;
        g.beginPath();
        g.ellipse(C + Math.cos(a) * d, C + Math.sin(a) * d * 1.3, 4, 7, a, 0, 7);
        g.fill();
      }
      // garis memancar halus
      g.strokeStyle = 'rgba(255,255,255,.25)';
      g.lineWidth = 2;
      for (let k = 0; k < 40; k++) {
        const a = (k / 40) * Math.PI * 2;
        g.beginPath();
        g.moveTo(C + Math.cos(a) * fleshR * 0.3, C + Math.sin(a) * fleshR * 0.39);
        g.lineTo(C + Math.cos(a) * fleshR * 0.95, C + Math.sin(a) * fleshR * 0.95);
        g.stroke();
      }
      break;
    case 'arils':
      for (let k = 0; k < 260; k++) {
        const a = rnd() * Math.PI * 2,
          d = Math.sqrt(rnd()) * fleshR * 0.85;
        const x = C + Math.cos(a) * d,
          y = C + Math.sin(a) * d;
        g.fillStyle = s.seed;
        g.beginPath();
        g.arc(x, y, 11, 0, 7);
        g.fill();
        g.fillStyle = 'rgba(255,255,255,.35)';
        g.beginPath();
        g.arc(x - 3, y - 3, 4, 0, 7);
        g.fill();
      }
      break;
    case 'bulbs':
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2;
        const x = C + Math.cos(a) * fleshR * 0.55,
          y = C + Math.sin(a) * fleshR * 0.55;
        g.fillStyle = shade(s.flesh, 0.05);
        g.beginPath();
        g.ellipse(x, y, fleshR * 0.22, fleshR * 0.3, a + Math.PI / 2, 0, 7);
        g.fill();
        seedAt(x, y, 12, 18, a + Math.PI / 2);
      }
      break;
    case 'star':
      g.fillStyle = shade(s.flesh, 0.1);
      star(g, C, C, 5, fleshR * 0.95, fleshR * 0.45);
      g.fillStyle = s.flesh;
      star(g, C, C, 5, fleshR * 0.8, fleshR * 0.38);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
        seedAt(C + Math.cos(a) * fleshR * 0.2, C + Math.sin(a) * fleshR * 0.2, 7, 13, a + Math.PI / 2);
      }
      break;
    case 'hollow':
      g.fillStyle = s.flesh;
      g.beginPath();
      g.arc(C, C, fleshR * 0.82, 0, 7);
      g.fill();
      g.fillStyle = '#dfeef2';
      g.beginPath();
      g.arc(C, C, fleshR * 0.62, 0, 7);
      g.fill();
      g.fillStyle = 'rgba(255,255,255,.6)';
      g.beginPath();
      g.ellipse(C - 40, C - 50, 60, 30, -0.5, 0, 7);
      g.fill();
      break;
    case 'banana':
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2;
        g.fillStyle = '#e8d6a0';
        g.beginPath();
        g.ellipse(C + Math.cos(a) * 18, C + Math.sin(a) * 18, 22, 10, a, 0, 7);
        g.fill();
      }
      for (let k = 0; k < 12; k++) {
        const a = rnd() * Math.PI * 2;
        g.fillStyle = s.seed;
        g.beginPath();
        g.arc(C + Math.cos(a) * 26, C + Math.sin(a) * 26, 3, 0, 7);
        g.fill();
      }
      break;
    case 'pineapple':
      g.strokeStyle = 'rgba(255,255,255,.35)';
      g.lineWidth = 3;
      for (let k = 0; k < 60; k++) {
        const a = (k / 60) * Math.PI * 2;
        g.beginPath();
        g.moveTo(C + Math.cos(a) * fleshR * 0.2, C + Math.sin(a) * fleshR * 0.2);
        g.lineTo(C + Math.cos(a) * fleshR * 0.95, C + Math.sin(a) * fleshR * 0.95);
        g.stroke();
      }
      g.fillStyle = '#fff4c0';
      g.beginPath();
      g.arc(C, C, fleshR * 0.2, 0, 7);
      g.fill();
      break;
    case 'scattered':
      for (let k = 0; k < (f.id === 'semangka' ? 40 : 30); k++) {
        const a = rnd() * Math.PI * 2,
          d = (0.35 + rnd() * 0.45) * fleshR;
        seedAt(C + Math.cos(a) * d, C + Math.sin(a) * d, 7, 13, a);
      }
      break;
  }
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  return t;
}

function star(g: CanvasRenderingContext2D, x: number, y: number, n: number, R: number, r: number) {
  g.beginPath();
  for (let k = 0; k < n * 2; k++) {
    const a = (k / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = k % 2 ? r : R;
    g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  g.closePath();
  g.fill();
}

function shade(hex: string, k: number) {
  const c = new T.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + k)));
  return `#${c.getHexString()}`;
}

export function CutView({ id, harvested, onClose }: { id: string; harvested?: boolean; onClose: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const cutRef = useRef<() => void>(() => {});
  const [cut, setCut] = useState(false);
  const f = FRUIT_BY_ID.get(id)!;

  useEffect(() => {
    const el = host.current!;
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);
    const scene = new T.Scene();
    const pm = new T.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.add(new T.DirectionalLight('#ffffff', 1.4).translateX(2).translateY(3).translateZ(4));
    const cam = new T.PerspectiveCamera(35, 1, 0.1, 50);
    cam.position.set(0, 0.6, 7);
    cam.lookAt(0, 0, 0);

    const model = createFruitModel(f);
    model.updateMatrixWorld(true);
    const box = new T.Box3().setFromObject(model);
    const size = box.getSize(new T.Vector3());
    const tex = sectionTexture(f, sectionOf(f));

    // dua belahan: klon model dengan bidang potong masing-masing + tutup penampang
    const halves = [-1, 1].map((side) => {
      const grp = new T.Group();
      const m = model.clone(true);
      const plane = new T.Plane(new T.Vector3(side, 0, 0), 0); // simpan bagian x·side ≥ 0 (belahan kiri: x ≤ 0)
      const planeWorld = plane.clone();
      m.traverse((o) => {
        const mesh = o as T.Mesh;
        if (!mesh.isMesh && !(o as T.LineSegments).isLineSegments) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const cl = mats.map((mt) => {
          const c2 = (mt as T.Material).clone();
          c2.clippingPlanes = [planeWorld];
          c2.side = T.DoubleSide;
          return c2;
        });
        mesh.material = Array.isArray(mesh.material) ? cl : cl[0];
      });
      const cap = new T.Mesh(new T.CircleGeometry(1, 48), new T.MeshStandardMaterial({ map: tex, roughness: 0.5, side: T.DoubleSide }));
      cap.scale.set(size.z * 0.49, size.y * 0.49, 1);
      cap.rotation.y = (-side * Math.PI) / 2;
      cap.visible = false;
      grp.add(m, cap);
      scene.add(grp);
      return { side, grp, plane, planeWorld, cap };
    });

    let t0 = performance.now(),
      cutAt = -1,
      raf = 0;
    cutRef.current = () => {
      if (cutAt >= 0) return;
      cutAt = performance.now();
      halves.forEach((h) => (h.cap.visible = true));
      sfx.chop();
    };
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = (now - t0) / 1000;
      const k = cutAt < 0 ? 0 : Math.min(1, (now - cutAt) / 700);
      const e = 1 - Math.pow(1 - k, 3);
      halves.forEach((h) => {
        // sebelum dibelah: satu buah utuh berputar pelan; sesudahnya: membuka ke kiri-kanan
        h.grp.rotation.y = cutAt < 0 ? t * 0.5 : h.side * 0.95 * e;
        h.grp.position.x = h.side * e * size.x * 0.55;
        h.grp.updateMatrixWorld(true);
        h.planeWorld.copy(h.plane).applyMatrix4(h.grp.matrixWorld);
      });
      renderer.render(scene, cam);
    };
    raf = requestAnimationFrame(loop);
    t0 = performance.now();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      halves.forEach((h) => {
        h.grp.traverse((o) => {
          const m = o as T.Mesh;
          if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
        });
        (h.cap.material as T.Material).dispose();
      });
      disposeFruit(model);
      tex.dispose();
      scene.environment?.dispose();
      pm.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [f]);

  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-end justify-center bg-[rgba(43,29,78,.45)] p-3 sm:items-center" onClick={onClose}>
      <div className="garden-pop relative w-full max-w-[560px] rounded-[30px] bg-white p-4 shadow-[0_8px_0_rgba(43,29,78,.15)]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Tutup" className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-full bg-[#f5f0fa] text-[#2b1d4e] active:scale-90">
          <Icon name="close" size={26} />
        </button>
        <div style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: INK, lineHeight: 1 }}>{harvested ? `Panen ${f.name}!` : f.name}</div>
        <p className="mt-1 text-[14px] font-extrabold text-[#8a7a9c]">{cut ? 'Lihat isinya!' : 'Ayo kita belah buahnya.'}</p>
        <div ref={host} className="relative mx-auto mt-2 aspect-[4/3] w-full overflow-hidden rounded-[22px]" style={{ background: 'radial-gradient(circle at 50% 45%, #fffaf0, #f3e7d2)' }} />
        {cut ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p className="flex items-start gap-2 rounded-[16px] bg-[#fff4e0] p-2.5 text-[14px] leading-snug font-bold text-[#7a5b12]">
              <Icon name="nutrition" size={20} className="shrink-0" />
              <span>
                <b>Daging buah:</b> {f.flesh}
              </span>
            </p>
            <p className="flex items-start gap-2 rounded-[16px] bg-[#eef6ea] p-2.5 text-[14px] leading-snug font-bold text-[#2f6b3a]">
              <Icon name="grain" size={20} className="shrink-0" />
              <span>
                <b>Biji:</b> {f.seed}
              </span>
            </p>
          </div>
        ) : (
          <button
            onClick={() => {
              cutRef.current();
              setCut(true);
            }}
            className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-[18px] text-white active:scale-95"
            style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 800, background: 'linear-gradient(155deg,#ffb347,#ff7a1a 60%)', boxShadow: '0 4px 0 #c85400' }}
          >
            <Icon name="content_cut" size={28} />
            Belah!
          </button>
        )}
      </div>
    </div>
  );
}
