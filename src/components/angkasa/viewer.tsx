"use client";

// Jembatan React ⇄ mesin 3D: membuat engine sekali, mengganti view saat mode berubah,
// meneruskan state UI ke view (apply), serta status engine/aset ke UI.

import { useEffect, useRef } from "react";
import { useAngkasa, type AngkasaState, type Mode } from "@/lib/angkasa/state";
import { AngkasaEngine } from "./engine/core";
import { CompareView } from "./engine/compareView";
import { GalaxyView } from "./engine/galaxyView";
import { LessonView } from "./engine/lessonView";
import { SolarView } from "./engine/solarView";
import { StructureView } from "./engine/structureView";
import type { ModeView } from "./engine/views";

/** view mana yang dipakai tiap mode (Tata Surya & Planet berbagi scene yang sama) */
const VIEW_OF: Record<Mode, string> = {
  "tata-surya": "solar",
  planet: "solar",
  latihan: "solar",
  tur: "solar",
  bandingkan: "compare",
  struktur: "structure",
  fenomena: "lesson",
  galaksi: "galaxy",
};

function makeView(kind: string): ModeView {
  switch (kind) {
    case "compare":
      return new CompareView();
    case "structure":
      return new StructureView();
    case "lesson":
      return new LessonView();
    case "galaxy":
      return new GalaxyView();
    default:
      return new SolarView();
  }
}

let engineRef: AngkasaEngine | null = null;
/** akses engine untuk kontrol (zoom, reset, ukur fps) dari komponen UI */
export const getEngine = () => engineRef;

export function Viewer() {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const viewRef = useRef<ModeView | null>(null);
  const kindRef = useRef("");
  const set = useAngkasa((s) => s.set);

  useEffect(() => {
    const engine = new AngkasaEngine(host.current!, labels.current!, {
      onPick: (id) => {
        const st = useAngkasa.getState();
        if (st.mode === "tur") return; // ketukan selama tur hanya menjeda (ditangani controller)
        if (st.mode === "latihan")
          return window.dispatchEvent(
            new CustomEvent("angkasa:pick", { detail: id }),
          );
        if (id.includes(".")) {
          // bagian (saturn.rings, earth.mantle, …)
          if (st.mode === "struktur") st.selectPart(id);
          else
            st.select(id.split(".")[0], {
              part: id,
              push: st.selectedId !== id.split(".")[0],
            });
          return;
        }
        if (
          st.mode === "bandingkan" ||
          st.mode === "fenomena" ||
          st.mode === "galaksi" ||
          st.mode === "struktur"
        )
          return;
        st.select(id, { mode: "planet" });
      },
      onStatus: (s) => set({ engineStatus: s }),
      onAsset: (key, status) => {
        const cur = useAngkasa.getState().assetErrors;
        if (status === "error" && !cur.includes(key))
          set({ assetErrors: [...cur, key] });
        if (status === "ready" && cur.includes(key))
          set({ assetErrors: cur.filter((k) => k !== key) });
      },
    });
    if (!engine.init()) return;
    engineRef = engine;
    // pintu debug khusus development (inspeksi view aktif, ukur fps)
    if (process.env.NODE_ENV === "development")
      (window as unknown as { __akEngine?: AngkasaEngine }).__akEngine = engine;

    const sync = (st: AngkasaState) => {
      engine.reducedMotion = st.prefs.reducedMotion;
      const c = engine.clock;
      // Tur terbang & mode Planet: objek tetap berputar pada porosnya walau simulasi dijeda;
      // posisi orbit dibekukan (kecuali pengguna menjalankan simulasi di mode Planet).
      const tur = st.mode === "tur";
      const inspect = st.mode === "planet";
      c.playing = tur || inspect || st.playing;
      c.speed = st.speed;
      c.orbitOn = tur || (inspect && !st.playing) ? false : st.orbitOn;
      c.spinOn = tur ? true : st.spinOn;
      const kind = VIEW_OF[st.mode];
      engine.setFrameInset(st.frameInset[0], st.frameInset[1]);
      if (kind !== kindRef.current) {
        kindRef.current = kind;
        const v = makeView(kind);
        viewRef.current = v;
        engine.setView(v);
        // render ulang UI agar keterangan skala dari view baru langsung tampil
        queueMicrotask(() => set({}));
      }
      viewRef.current?.apply(st);
    };
    sync(useAngkasa.getState());
    const unsub = useAngkasa.subscribe(sync);
    return () => {
      unsub();
      engine.dispose();
      engineRef = null;
      viewRef.current = null;
      kindRef.current = "";
    };
  }, [set]);

  return (
    <div className="ak-viewport absolute inset-0 overflow-hidden">
      <div ref={host} className="absolute inset-0" />
      <div
        ref={labels}
        className="ak-labels pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
    </div>
  );
}

/** Keterangan skala dari view aktif (dipakai overlay). */
export function useScaleNote() {
  const st = useAngkasa();
  const v = engineRef?.getView() as ModeView | null;
  return v?.scaleNote ? v.scaleNote(st) : "";
}
