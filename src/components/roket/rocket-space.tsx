"use client";

// Roket & Astronot 3D (tampilan anak): mode Jelajah (lihat roket di landasan, ketuk bagiannya, pilih lapisan
// atmosfer) dan mode Terbang (misi dari landasan sampai orbit, 3D penuh, narasi suara).

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RoundBtn } from "@/components/angkasa/kid-space";
import { Icon } from "@/components/ui";
import { COUNTDOWN, JELAJAH, JELAJAH_AUDIO, MISI, MISI_AUDIO } from "@/lib/roket/misi";
import { installAudioUnlock, sharedAudio } from "@/lib/audio-unlock";
import { RocketEngine, useRoket } from "./engine";

const BALOO = "var(--ff-baloo), system-ui, sans-serif";
const ICON: Record<string, string> = {
  roket: "rocket",
  kapsul: "radio_button_checked",
  "tahap-2": "view_agenda",
  "tahap-1": "view_day",
  mesin: "local_fire_department",
  astronot: "person",
  menara: "cell_tower",
};

/* ---------------- suara item jelajah ---------------- */

let clipAudio: HTMLAudioElement | null = null;
/** Sumber suara item: rekaman khusus (bagian roket) atau potongan narasi misi (lapisan). */
function clipOf(id: string): { src: string; start: number; end: number | null } | null {
  if (JELAJAH_AUDIO[id]) return { src: JELAJAH_AUDIO[id], start: 0, end: null };
  const item = JELAJAH.find((x) => x.id === id);
  const i = item?.stop ? MISI.findIndex((s) => s.id === item.stop) : -1;
  const part = i >= 0 ? MISI_AUDIO.find((p) => i >= p.first && i < p.first + p.cues.length) : undefined;
  if (!part) return null;
  const k = i - part.first;
  return { src: part.src, start: part.cues[k], end: part.cues[k + 1] ?? null };
}
function playClip(id: string, onEnd: () => void) {
  const c = clipOf(id);
  if (!c) return;
  clipAudio?.pause();
  const a = (clipAudio = sharedAudio("roket-clip")); // elemen bersama (iPad/iPhone)
  a.src = c.src;
  const start = () => {
    a.currentTime = c.start;
    a.play().catch(onEnd);
  };
  if (a.readyState >= 1) start();
  else a.onloadedmetadata = start;
  a.ontimeupdate = () => {
    if (c.end != null && a.currentTime >= c.end) a.pause();
  };
  a.onpause = a.onended = onEnd;
}
function stopClip() {
  clipAudio?.pause();
}

/* ---------------- Jelajah ---------------- */

function ItemCard({ id }: { id: string }) {
  const item = JELAJAH.find((x) => x.id === id)!;
  const [playing, setPlaying] = useState(false);
  const has = !!clipOf(id);
  useEffect(() => {
    if (has) {
      setPlaying(true);
      playClip(id, () => setPlaying(false));
    }
    return () => stopClip();
  }, [id, has]);
  return (
    <div className="pointer-events-auto mx-auto flex w-full max-w-[620px] items-center gap-3 rounded-[26px] bg-white/95 p-3 shadow-[0_6px_0_rgba(0,0,0,.25)] sm:p-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full text-white" style={{ background: item.kind === "layer" ? item.color : "#5b4bff" }}>
        <Icon name={item.kind === "layer" ? "layers" : ICON[id]} size={28} />
      </span>
      <div className="min-w-0 flex-1">
        <div style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: "#2b1d4e", lineHeight: 1 }}>{item.name}</div>
        <p className="mt-1 text-[15px] leading-snug font-extrabold text-[#6b5d80] sm:text-[17px]">{item.desc}</p>
      </div>
      {has && (
        <button
          onClick={() => (playing ? stopClip() : (setPlaying(true), playClip(id, () => setPlaying(false))))}
          aria-label={playing ? "Berhenti" : "Dengarkan"}
          className="flex size-[58px] shrink-0 items-center justify-center rounded-full text-white active:scale-90"
          style={{ background: "linear-gradient(155deg,#5ce8d6,#12b8a6 60%)", boxShadow: "0 4px 0 #0a8a7c" }}
        >
          <Icon name={playing ? "stop" : "volume_up"} size={32} />
        </button>
      )}
    </div>
  );
}

function Dock({ onPick }: { onPick: (id: string) => void }) {
  const focus = useRoket((s) => s.focus);
  return (
    <div className="pointer-events-auto -mx-3 overflow-x-auto px-3 pb-1">
      {/* w-max + mx-auto: di tengah bila muat, bisa digeser penuh (termasuk ujung kiri) bila tidak */}
      <div className="mx-auto flex w-max gap-2">
      {JELAJAH.map((it) => {
        const on = focus === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onPick(it.id)}
            aria-pressed={on}
            className="flex w-[80px] shrink-0 flex-col items-center gap-1.5 rounded-[20px] py-2 transition-transform active:scale-90"
            style={on ? { background: "rgba(255,255,255,.2)", boxShadow: "inset 0 0 0 3px #ffbe0b" } : undefined}
          >
            <span
              className="flex size-12 items-center justify-center rounded-full"
              style={
                it.kind === "layer"
                  ? { background: it.color, color: "#fff", boxShadow: `0 3px 0 rgba(0,0,0,.25)` }
                  : { background: "#fff", color: "#3a2cd1", boxShadow: "0 3px 0 rgba(0,0,0,.25)" }
              }
            >
              <Icon name={it.kind === "layer" ? "layers" : ICON[it.id]} size={26} />
            </span>
            <span className="text-center text-white" style={{ fontFamily: BALOO, fontSize: 13, fontWeight: 800, lineHeight: 1.05, textShadow: "0 1px 3px rgba(0,0,0,.7)" }}>
              {it.name}
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}

/* ---------------- Terbang ---------------- */

function FlightOverlay({ engine }: { engine: RocketEngine }) {
  const { stop, progress, playing, finished } = useRoket();
  const s = MISI[stop];
  // Hitung mundur besar: 10 → 1 pada paruh akhir persinggahan "Hitung mundur".
  const count = stop === COUNTDOWN && progress > 0.3 ? 10 - Math.min(9, Math.floor(((progress - 0.3) / 0.7) * 10)) : null;
  // Tanpa rekaman: tampilkan teks kecil sebagai pengganti suara (sementara).
  const caption = MISI_AUDIO.length === 0 ? s.lines[Math.min(s.lines.length - 1, Math.floor(progress * s.lines.length))] : null;
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 flex gap-1 px-3" style={{ paddingTop: "max(8px, env(safe-area-inset-top))" }} aria-hidden>
        {MISI.map((m, i) => (
          <span key={m.id} className="h-1 flex-1 rounded-full" style={{ background: i < stop ? "rgba(255,255,255,.85)" : i === stop ? "#ffbe0b" : "rgba(255,255,255,.2)" }} />
        ))}
      </div>
      <div className="absolute right-3 sm:right-5" style={{ top: "max(20px, calc(env(safe-area-inset-top) + 12px))" }}>
        <RoundBtn icon="close" label="Keluar" onClick={() => engine.setMode("jelajah")} />
      </div>
      {count !== null && playing && (
        <div key={count} className="anim-fade absolute inset-0 flex items-center justify-center">
          <span style={{ fontFamily: BALOO, fontSize: 160, fontWeight: 800, color: "#fff", textShadow: "0 6px 0 rgba(0,0,0,.25), 0 0 40px rgba(255,190,11,.6)" }}>{count}</span>
        </div>
      )}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          {finished ? (
            <>
              <RoundBtn icon="replay" label="Ulangi" tone="orange" onClick={() => (engine.go(0), engine.setPlaying(true))} />
              <RoundBtn icon="check" label="Selesai" tone="purple" onClick={() => engine.setMode("jelajah")} />
            </>
          ) : (
            <RoundBtn icon="play_arrow" label="Lanjut" tone="orange" onClick={() => engine.setPlaying(true)} />
          )}
        </div>
      )}
      {caption && playing && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center px-4" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
          <p className="max-w-[640px] rounded-2xl bg-black/45 px-4 py-2 text-center text-[15px] font-bold text-white sm:text-[17px]">{caption}</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- halaman ---------------- */

export function RocketSpace() {
  const host = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<RocketEngine | null>(null);
  const mode = useRoket((s) => s.mode);
  const focus = useRoket((s) => s.focus);
  const router = useRouter();

  useEffect(() => {
    installAudioUnlock();
    useRoket.setState({ mode: "jelajah", focus: null, playing: false, finished: false, stop: 0, progress: 0 });
    const e = new RocketEngine(host.current!, (id) => e.focus(id));
    setEngine(e);
    // Pratinjau development: akses dari console untuk menguji persinggahan.
    if (process.env.NODE_ENV === "development") (window as unknown as { __roket?: RocketEngine }).__roket = e;
    return () => {
      stopClip();
      e.dispose();
    };
  }, []);

  return (
    <div className="theme-play fixed inset-0 overflow-hidden bg-[#0b1a33]">
      <div ref={host} className="absolute inset-0" />
      {engine &&
        (mode === "terbang" ? (
          <FlightOverlay engine={engine} />
        ) : (
          <div
            className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5"
            style={{ paddingTop: "max(12px, env(safe-area-inset-top))", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-start justify-between gap-2">
              <RoundBtn
                icon={focus ? "arrow_back" : "home"}
                label={focus ? "Kembali" : "Keluar"}
                onClick={() => (focus ? engine.focus(null) : router.push("/beranda/angkasa"))}
              />
              <RoundBtn icon="rocket_launch" label="Luncurkan!" tone="orange" onClick={() => engine.setMode("terbang")} />
            </div>
            <div className="flex flex-col gap-3">
              {focus && <ItemCard id={focus} />}
              <Dock onPick={(id) => engine.focus(id)} />
            </div>
          </div>
        ))}
    </div>
  );
}
