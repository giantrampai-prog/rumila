"use client";

// Panel Struktur (Bumi / Saturnus-model): daftar lapisan (legenda warna kode), bagian terpilih,
// slider pisah absolut 0–100%, potongan, isolasi, susun kembali, Dengarkan.
// RingInset: inset "Cincin dari dekat" dengan renderer kecil sendiri (dibuat saat dibuka, di-dispose saat ditutup).

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Icon } from "@/components/ui";
import { OBJ, PART } from "@/lib/angkasa/manifest";
import { markDone } from "@/lib/angkasa/progress";
import { useAngkasa } from "@/lib/angkasa/state";
import {
  CONTEXT_PARTS,
  LAYERS,
  crustExaggeration,
  type StructureObj,
} from "@/lib/angkasa/structure";
import { lumpyGeometry } from "../engine/bodies";
import { webglAvailable } from "../engine/core";
import { StructureView } from "../engine/structureView";
import { Btn, FactRow, Note, Pill, Slider, SourceList, useSpeak } from "../ui";
import { getEngine } from "../viewer";

const RING_SWATCH = "#d9c9a3";

export function StructurePanel() {
  const st = useAngkasa();
  const obj: StructureObj = st.structureObj;
  const o = OBJ.get(obj)!;
  const layers = LAYERS[obj];
  const listIds = [...layers, ...CONTEXT_PARTS[obj]];
  const part =
    st.partId && listIds.includes(st.partId) ? PART.get(st.partId) : null;
  const { speak, speaking, supported } = useSpeak();
  const seen = useRef(new Set<string>());

  // Materi struktur selesai: lapisan sudah dipisahkan (≥50%) atau semua lapisan sudah dipilih.
  useEffect(() => {
    seen.current = new Set();
  }, [obj, st.memberId]);
  useEffect(() => {
    if (!st.memberId) return;
    if (st.partId && layers.includes(st.partId)) seen.current.add(st.partId);
    if (st.explode >= 50 || layers.every((id) => seen.current.has(id)))
      markDone(st.memberId, `struktur:${obj}`);
  }, [st.partId, st.explode, st.memberId, obj, layers]);

  const switchObj = (next: StructureObj) => {
    if (next === obj) return;
    st.set({ structureObj: next, explode: 0, isolated: null, cutaway: true });
    st.select(next, { mode: "struktur", push: false });
  };
  const focus = (id: string) => {
    const v = getEngine()?.getView();
    if (v instanceof StructureView) v.focusPart(id);
  };
  const reassemble = () => st.set({ explode: 0, isolated: null });
  const title = obj === "earth" ? "Struktur Bumi" : "Struktur Saturnus (model)";
  const sourceIds = [
    ...new Set([
      ...listIds.flatMap((id) => PART.get(id)?.sourceIds ?? []),
      ...o.sourceIds,
    ]),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em] text-ink">
            {title}
          </h2>
          <Pill tone={obj === "earth" ? "teal" : "coral"}>
            {obj === "earth" ? "Model pendidikan" : "Model interpretasi"}
          </Pill>
        </div>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-2">
          {obj === "earth"
            ? "Bumi dipotong seperempat bagian atasnya supaya lapisan di dalamnya terlihat. Ketuk lapisan untuk mempelajarinya."
            : "Gambaran ilmuwan tentang bagian dalam Saturnus. Tidak ada yang pernah melihatnya langsung."}
        </p>
      </div>

      {/* ganti objek */}
      <div
        role="radiogroup"
        aria-label="Pilih planet"
        className="grid grid-cols-2 gap-1.5 rounded-xl bg-fill p-1"
      >
        {(
          [
            ["earth", "Bumi"],
            ["saturn", "Saturnus"],
          ] as [StructureObj, string][]
        ).map(([id, t]) => (
          <button
            key={id}
            role="radio"
            aria-checked={obj === id}
            onClick={() => switchObj(id)}
            className={`min-h-11 rounded-lg text-sm font-semibold transition-colors ${obj === id ? "bg-white text-ink shadow-sm" : "text-ink-3 hover:text-ink"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* pemisahan & potongan */}
      <div className="flex flex-col gap-2 rounded-2xl border border-line p-3">
        <Slider
          label="Pisahkan lapisan"
          value={st.explode}
          min={0}
          max={100}
          suffix="%"
          marks={[0, 50, 100]}
          onChange={(v) =>
            st.set(st.cutaway ? { explode: v } : { explode: v, cutaway: true })
          }
        />
        <button
          type="button"
          aria-pressed={st.cutaway}
          onClick={() =>
            st.set(
              st.cutaway ? { cutaway: false, explode: 0 } : { cutaway: true },
            )
          }
          className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-1 text-left text-sm font-semibold text-ink-2"
        >
          <span className="flex items-center gap-2">
            <Icon name="content_cut" size={20} className="text-ink-3" />
            Potongan (wedge)
          </span>
          <span
            aria-hidden
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${st.cutaway ? "bg-teal" : "bg-line"}`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${st.cutaway ? "left-[22px]" : "left-0.5"}`}
            />
          </span>
        </button>
        {(st.explode > 0 || st.isolated) && (
          <Btn icon="restart_alt" onClick={reassemble}>
            Susun kembali
          </Btn>
        )}
      </div>

      {/* daftar lapisan = legenda warna kode */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold tracking-wide text-ink-3 uppercase">
          {obj === "earth" ? "Lapisan" : "Bagian model"}
        </div>
        {listIds.map((id) => {
          const p = PART.get(id)!;
          const on = st.partId === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => st.selectPart(on ? null : id)}
              className={`flex min-h-14 items-start gap-3 rounded-xl border p-3 text-left transition-colors ${on ? "border-coral bg-coral-tint/40" : "border-line hover:border-ink-4"}`}
            >
              <span
                aria-hidden
                className={`mt-0.5 size-4 shrink-0 ${id === "saturn.rings" ? "rounded-full border-[3px] bg-transparent" : "rounded-full"}`}
                style={
                  id === "saturn.rings"
                    ? { borderColor: RING_SWATCH }
                    : { background: p.color }
                }
              />
              <span className="flex-1">
                <span className="block text-sm font-bold text-ink">
                  {p.nameId}
                  {id === "saturn.rings" && (
                    <span className="font-medium text-ink-3"> · konteks</span>
                  )}
                  {st.isolated === id && (
                    <span className="ml-1.5 text-xs font-semibold text-coral-deep">
                      (diisolasi)
                    </span>
                  )}
                </span>
                <span className="text-xs leading-snug text-ink-2">
                  {p.definitionSimple}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* bagian terpilih */}
      {part && (
        <div className="flex flex-col gap-2 rounded-2xl border border-coral/40 bg-coral-tint/40 p-3">
          <div className="text-xs font-bold tracking-wide text-coral-deep uppercase">
            Bagian terpilih
          </div>
          <div className="flex items-center gap-2">
            {part.color && (
              <span
                aria-hidden
                className="size-3.5 rounded-full"
                style={{ background: part.color }}
              />
            )}
            <span className="text-lg font-bold text-ink">{part.nameId}</span>
          </div>
          <p className="text-sm text-ink">{part.definitionSimple}</p>
          <p className="text-sm leading-relaxed text-ink-2">
            {part.explanationDetailed}
          </p>
          {part.facts && part.facts.length > 0 && (
            <div className="rounded-xl bg-white px-3">
              {part.facts.map((f) => (
                <FactRow key={f.label} f={f} />
              ))}
            </div>
          )}
          {part.id === "earth.crust" && (
            <Note icon="zoom_in">
              Di model ini kerak digambar ±{Math.round(crustExaggeration())}×
              lebih tebal agar terlihat.
            </Note>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Btn icon="center_focus_strong" onClick={() => focus(part.id)}>
              Fokus
            </Btn>
            <Btn
              icon="filter_center_focus"
              pressed={st.isolated === part.id}
              onClick={() =>
                st.set({ isolated: st.isolated === part.id ? null : part.id })
              }
            >
              {st.isolated === part.id ? "Tampilkan semua" : "Isolasi"}
            </Btn>
            <Btn icon="restart_alt" onClick={reassemble}>
              Susun kembali
            </Btn>
            {supported && (
              <Btn
                icon={speaking ? "stop_circle" : "volume_up"}
                pressed={speaking}
                onClick={() =>
                  speak(
                    `${part.nameId}. ${part.definitionSimple} ${part.explanationDetailed}`,
                  )
                }
              >
                {speaking ? "Berhenti" : "Dengarkan"}
              </Btn>
            )}
          </div>
        </div>
      )}

      {/* cincin dari dekat (Saturnus) */}
      {obj === "saturn" &&
        (st.ringInset ? (
          <RingInset />
        ) : (
          <Btn
            icon="blur_circular"
            onClick={() => {
              st.set({ ringInset: true });
              markDone(st.memberId, "part:saturn.ring_particles");
            }}
          >
            Cincin dari dekat
          </Btn>
        ))}

      {/* catatan skala & sumber */}
      <Note icon="palette">
        Warna lapisan adalah kode pendidikan, bukan warna asli bahan di dalam{" "}
        {o.nameId}.
      </Note>
      {obj === "earth" ? (
        <Note icon="straighten">
          Ketebalan kerak diperbesar agar terlihat (±
          {Math.round(crustExaggeration())}×). Aslinya kerak hanya sekitar 0,5%
          dari jari-jari Bumi. Lapisan lain mengikuti ukuran data.
        </Note>
      ) : (
        <>
          <Note icon="help">
            {o.confidenceNote ??
              "Model interpretasi: batas lapisan tidak tajam dan tidak diamati langsung."}
          </Note>
          <Note icon="science">
            {PART.get("saturn.interior")!.explanationDetailed}
          </Note>
        </>
      )}
      <SourceList ids={sourceIds} />
    </div>
  );
}

/* ---------------- Cincin dari dekat ---------------- */

/** RNG deterministik kecil (susunan inset selalu sama). */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function RingInset() {
  const set = useAngkasa((s) => s.set);
  const reduced = useAngkasa((s) => s.prefs.reducedMotion);
  const host = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(reduced);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (!webglAvailable()) {
      setFailed(true);
      return;
    }
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      return;
    }
    const lowPower =
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      /Android|iPhone|iPad/i.test(navigator.userAgent);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x0b1426, 1);
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b1426, 9, 22);
    const camera = new THREE.PerspectiveCamera(38, 2, 0.05, 60);
    camera.position.set(0, 1.1, 4.2);
    camera.lookAt(0, -0.2, -3);
    const sun = new THREE.DirectionalLight(0xfff3e0, 2.6);
    sun.position.set(-4, 3, 2);
    scene.add(sun, new THREE.AmbientLight(0x8fa3c8, 0.35));

    // Partikel: beberapa bentuk tak beraturan, ukuran beragam (banyak kecil, sedikit besar), es & batuan.
    const geos = [
      lumpyGeometry(11, 0.45, 1),
      lumpyGeometry(29, 0.35, 1),
      lumpyGeometry(47, 0.55, 1),
    ];
    const mat = new THREE.MeshStandardMaterial({
      roughness: 0.92,
      metalness: 0,
    });
    const total = lowPower ? 240 : 390;
    const r = rng(5);
    const icy = [
      new THREE.Color("#eef2f6"),
      new THREE.Color("#d9dee6"),
      new THREE.Color("#c9cfd8"),
    ];
    const rocky = [new THREE.Color("#9c9387"), new THREE.Color("#7d766d")];
    type P = {
      x: number;
      y: number;
      z: number;
      s: number;
      rx: number;
      ry: number;
      spin: number;
      v: number;
    };
    const parts: P[][] = geos.map(() => []);
    const meshes = geos.map((g, gi) => {
      const n = Math.floor(total / geos.length);
      const m = new THREE.InstancedMesh(g, mat, n);
      for (let i = 0; i < n; i++) {
        const z = -16 + r() * 19;
        const big = r() < 0.06;
        const s = big ? 0.22 + r() * 0.35 : 0.025 + Math.pow(r(), 2.2) * 0.14;
        parts[gi].push({
          x: -9 + r() * 18,
          y: (r() - 0.5) * 0.35 - 0.3,
          z,
          s,
          rx: r() * 6.28,
          ry: r() * 6.28,
          spin: (r() - 0.5) * 0.6,
          // geser berbeda per jarak (ilustrasi: partikel mengorbit dengan laju sedikit berbeda)
          v: 0.12 + (z + 16) * 0.012,
        });
        const c =
          r() < 0.8
            ? icy[Math.floor(r() * icy.length)]
            : rocky[Math.floor(r() * rocky.length)];
        m.setColorAt(i, c);
      }
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      scene.add(m);
      return m;
    });

    const dummy = new THREE.Object3D();
    const place = (t: number) => {
      meshes.forEach((m, gi) => {
        parts[gi].forEach((p, i) => {
          let x = p.x + p.v * t;
          x = ((((x + 9) % 18) + 18) % 18) - 9;
          dummy.position.set(x, p.y, p.z);
          dummy.rotation.set(p.rx + p.spin * t, p.ry + p.spin * 0.7 * t, 0);
          dummy.scale.setScalar(p.s);
          dummy.updateMatrix();
          m.setMatrixAt(i, dummy.matrix);
        });
        m.instanceMatrix.needsUpdate = true;
      });
    };

    const resize = () => {
      const w = Math.max(1, el.clientWidth);
      const h = Math.max(1, el.clientHeight);
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px";
      renderer.domElement.style.height = h + "px";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let raf = 0;
    let t = 0;
    let last = performance.now();
    place(0);
    renderer.render(scene, camera);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // gerakan berkurang atau tab tersembunyi → diam (gambar terakhir tetap)
      if (reducedRef.current || document.visibilityState !== "visible") return;
      t += dt;
      place(t);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      meshes.forEach((m) => m.dispose());
      geos.forEach((g) => g.dispose());
      mat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <figure className="flex flex-col gap-1.5">
      <div className="relative h-44 overflow-hidden rounded-2xl bg-[#0b1426]">
        {failed ? (
          <p className="flex h-full items-center justify-center p-4 text-center text-sm text-white/85">
            Tampilan 3D tidak tersedia di perangkat ini. Bayangkan ribuan
            bongkah es dan batuan, dari sebesar butir debu sampai sebesar rumah,
            yang masing-masing mengorbit Saturnus.
          </p>
        ) : (
          <div ref={host} className="absolute inset-0" />
        )}
        <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-[#0b1426]/75 px-2.5 py-1 text-[11px] font-semibold text-white/90">
          Ilustrasi diperbesar — bukan susunan partikel sebenarnya
        </span>
        <button
          type="button"
          onClick={() => set({ ringInset: false })}
          aria-label="Tutup cincin dari dekat"
          title="Tutup"
          className="absolute top-1.5 right-1.5 flex size-11 items-center justify-center rounded-full bg-[#0b1426]/70 text-white hover:bg-[#0b1426]"
        >
          <Icon name="close" size={20} />
        </button>
      </div>
      <figcaption className="text-sm font-semibold text-ink-2">
        Cincin dari dekat
      </figcaption>
    </figure>
  );
}
