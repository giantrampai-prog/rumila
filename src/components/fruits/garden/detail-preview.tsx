'use client';

import { useEffect, useRef, useState } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildGardenBird, birdFlightPose } from './birds';
import { feathers } from './textures';

/** Development-only inspection of the same geometry/animation used by GardenLife. */
export default function GardenDetailPreview() {
  const host = useRef<HTMLDivElement>(null), playing = useRef(true);
  const [paused, setPaused] = useState(false), [variant, setVariant] = useState(0);
  useEffect(() => {
    if (!host.current) return;
    const node = host.current, renderer = new T.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
    const scene = new T.Scene(); scene.background = new T.Color('#e7ece8');
    const camera = new T.PerspectiveCamera(38, 1, 0.01, 30); camera.position.set(1.1, 0.65, 1.2);
    const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.minDistance = 0.65; controls.maxDistance = 3;
    const sun = new T.DirectionalLight('#fff1dd', 3); sun.position.set(2, 4, 3); scene.add(sun, new T.HemisphereLight('#d5e9ff', '#756a53', 2));
    const plumage = feathers(), bird = buildGardenBird(variant, plumage); scene.add(bird.g); node.appendChild(renderer.domElement);
    const resize = () => { camera.aspect = node.clientWidth / node.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(node.clientWidth, node.clientHeight); };
    const ro = new ResizeObserver(resize); ro.observe(node); resize();
    let raf = 0, t = 0, last = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame); const now = performance.now();
      if (playing.current && !document.hidden) t += Math.min((now - last) / 1000, 0.05); last = now;
      const pose = birdFlightPose(t, 1.6); bird.wl.rotation.z = -pose.flap; bird.wr.rotation.z = pose.flap;
      bird.tipL.rotation.z = bird.tipR.rotation.z = pose.flex; bird.tail.rotation.x = pose.tail;
      controls.update(); renderer.render(scene, camera);
    }; frame();
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); controls.dispose();
      const materials = new Set<T.Material>();
      scene.traverse(o => { if (o instanceof T.Mesh) { o.geometry.dispose(); for (const m of Array.isArray(o.material) ? o.material : [o.material]) materials.add(m); } });
      materials.forEach(m => m.dispose()); plumage.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [variant]);
  return <main className="fixed inset-0 bg-[#e7ece8] text-[#283b31]">
    <div ref={host} className="absolute inset-0" aria-label="Pratinjau detail burung 3D" />
    <div className="absolute left-6 top-6 max-w-sm rounded-3xl bg-white/90 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest">Pratinjau pengembangan</p>
      <h1 className="mt-1 text-2xl font-bold">Burung Kebun Buah</h1>
      <p className="mt-2 text-sm">Geser untuk melihat bulu sayap, ekor, mata, paruh, dan kaki dari dekat.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl bg-[#d5e3d8] px-4 py-2" onClick={() => { playing.current = !playing.current; setPaused(!playing.current); }}>{paused ? 'Lanjutkan gerak' : 'Jeda gerak'}</button>
        <button className="rounded-xl bg-[#d5e3d8] px-4 py-2" onClick={() => setVariant(v => (v + 1) % 2)}>Ganti bulu</button>
        <a className="rounded-xl px-4 py-2 underline" href="/dev/buah">Kembali ke kebun</a>
      </div>
    </div>
  </main>;
}
