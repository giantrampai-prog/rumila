"use client";

// Roket & Astronot 3D (tampilan anak): mode Jelajah (lihat roket di landasan, ketuk bagiannya, pilih lapisan
// atmosfer) dan mode Terbang (misi dari landasan sampai orbit, 3D penuh, narasi suara).

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RoundBtn } from "@/components/angkasa/kid-space";
import { Icon } from "@/components/ui";
import { COUNT_ONSETS, COUNTDOWN, JELAJAH, JELAJAH_AUDIO, MISI, MISI_AUDIO } from "@/lib/roket/misi";
import { missionCueAt } from "@/lib/roket/timeline";
import { installAudioUnlock, sharedAudio } from "@/lib/audio-unlock";
import { sfx } from "@/lib/sfx";
import { useSfxOnChange } from "@/lib/use-sfx";
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
  stasiun: "satellite_alt",
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
  const { stop, seconds, duration, playing, finished, audioError } = useRoket();
  const [showCaption, setShowCaption] = useState(false);
  const cue = missionCueAt(stop, seconds, duration);
  const said = COUNT_ONSETS.filter(o => o <= seconds).length;
  const count = stop === COUNTDOWN && said > 0 ? 11 - said : null;
  useSfxOnChange(count !== null && playing ? count : null, c => c !== null && sfx.beep(c <= 3));
  const stamp = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  const control = "pointer-events-auto flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-extrabold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffbe0b] disabled:opacity-30";
  return (
    <section className="pointer-events-none absolute inset-0" aria-label="Misi roket">
      <div className="absolute inset-x-0 top-0 flex gap-1 px-3" style={{ paddingTop: "max(8px, env(safe-area-inset-top))" }} aria-hidden>
        {MISI.map((m, i) => <span key={m.id} className="h-1 flex-1 rounded-full" style={{ background: i < stop ? "rgba(255,255,255,.85)" : i === stop ? "#ffbe0b" : "rgba(255,255,255,.2)" }} />)}
      </div>
      <div className="absolute left-3 right-24 top-6 max-w-sm rounded-2xl bg-[#112b40]/85 p-3 text-white shadow-lg backdrop-blur-md sm:left-5">
        <label htmlFor="rocket-chapter" className="block text-[10px] font-extrabold tracking-[.16em] text-[#9de4eb]">MISI ROKET · {String(stop + 1).padStart(2, "0")} / {MISI.length}</label>
        <select id="rocket-chapter" aria-label="Pilih bagian misi" value={stop} onChange={e => engine.go(Number(e.target.value))} className="pointer-events-auto mt-1 min-h-8 w-full rounded-lg bg-transparent text-base font-extrabold focus-visible:outline-2 focus-visible:outline-[#ffbe0b] sm:text-lg" style={{ fontFamily: BALOO }}>
          {MISI.map((m, i) => <option key={m.id} value={i} className="bg-[#112b40]">{i + 1}. {m.title}</option>)}
        </select>
      </div>
      <div className="absolute right-3 top-6 sm:right-5">
        <RoundBtn icon="close" label="Keluar dari misi" onClick={() => engine.setMode("jelajah")} />
      </div>
      {count !== null && playing && (
        <div key={count} className="anim-fade absolute inset-x-0 top-[24%] text-center motion-reduce:animate-none">
          <span style={{ fontFamily: BALOO, fontSize: 110, fontWeight: 800, color: "#fff", textShadow: "0 6px 0 rgba(0,0,0,.25), 0 0 40px rgba(255,190,11,.6)" }}>{count}</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[700px] flex-col gap-2 px-3 sm:px-5" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div key={cue.key} role="status" aria-live="polite" aria-atomic="true" data-mission-cue={cue.key} className="anim-fade flex items-start gap-3 rounded-[24px] border-2 border-white bg-white/95 p-3 shadow-[0_5px_0_rgba(43,29,78,.25)] backdrop-blur-md motion-reduce:animate-none sm:p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#eee7ff] text-[#6c45e8] sm:size-12"><Icon name={cue.icon} size={27} /></span>
          <div className="min-w-0">
            <p className="text-[9px] font-extrabold tracking-[.14em] text-[#7b62b5] sm:text-[10px]">{finished ? "MISI SELESAI" : "YANG SEDANG KITA JELAJAHI"}</p>
            <h2 className="mt-0.5 text-xl leading-tight font-extrabold text-[#2b1d4e] sm:text-2xl" style={{ fontFamily: BALOO }}>{cue.title}</h2>
            <p className="mt-1 text-[13px] leading-snug font-bold text-[#675a7e] sm:text-[15px]">{cue.info}</p>
          </div>
        </div>
        {showCaption && <p className="pointer-events-auto max-h-[16vh] overflow-y-auto rounded-2xl bg-[#092537]/95 px-4 py-3 text-center text-xs leading-relaxed font-bold text-white sm:text-sm" aria-label="Teks narasi">{cue.caption}</p>}
        {audioError && <p role="alert" className="rounded-xl bg-white px-3 py-2 text-center text-xs font-bold text-[#973b19]">Suara belum bisa diputar. Tekan Lanjut untuk mencoba lagi.</p>}
        <div className="pointer-events-auto rounded-[24px] border border-white/20 bg-[#112b40]/95 px-3 pb-2 pt-2 text-white backdrop-blur-md">
          <div className="flex items-center gap-2 px-2 text-[10px] font-bold tabular-nums text-[#b6e0e6]">
            <span>{stamp(seconds)}</span>
            <input type="range" aria-label="Posisi narasi bagian ini" aria-valuetext={`${stamp(seconds)} dari ${stamp(duration)}`} min={0} max={duration} step={0.1} value={Math.min(seconds, duration)} onChange={e => engine.seek(Number(e.target.value))} className="h-6 min-w-0 flex-1 cursor-pointer accent-[#ffbe0b]" />
            <span>{stamp(duration)}</span>
          </div>
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <button className={control} aria-label="Bagian sebelumnya" disabled={stop === 0} onClick={() => engine.go(stop - 1)}><Icon name="chevron_left" size={24} /></button>
            <button className={`${control} min-w-28 bg-[#ff8616] hover:bg-[#f0780a]`} aria-label={finished ? "Ulangi misi" : playing ? "Jeda narasi" : "Lanjutkan narasi"} onClick={() => engine.setPlaying(!playing)}><Icon name={finished ? "replay" : playing ? "pause" : "play_arrow"} size={25} />{finished ? "Ulangi" : playing ? "Jeda" : "Lanjut"}</button>
            <button className={control} aria-label="Bagian berikutnya" disabled={stop === MISI.length - 1} onClick={() => engine.go(stop + 1)}><Icon name="chevron_right" size={24} /></button>
            <span className="mx-1 h-6 w-px bg-white/20" />
            <button className={control} aria-label={showCaption ? "Sembunyikan teks narasi" : "Tampilkan teks narasi"} aria-pressed={showCaption} onClick={() => setShowCaption(!showCaption)}><Icon name="subtitles" size={24} /><span className="hidden sm:inline">Teks</span></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- halaman ---------------- */

export function RocketSpace() {
  const host = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<RocketEngine | null>(null);
  const mode = useRoket((s) => s.mode);
  const focus = useRoket((s) => s.focus);
  useSfxOnChange(focus, (f) => (f ? sfx.scan() : sfx.close()));
  const router = useRouter();

  useEffect(() => {
    installAudioUnlock();
    useRoket.setState({ mode: "jelajah", focus: null, playing: false, finished: false, stop: 0, progress: 0, seconds: 0, duration: MISI_AUDIO[0]?.cues[1] ?? 28.74, cueKey: "landasan:0", audioError: false });
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
              <div className="pointer-events-auto flex flex-wrap justify-center gap-1 rounded-2xl bg-[#142825]/70 p-1.5 text-white shadow-lg backdrop-blur-md sm:gap-2" aria-label="Sudut pandang lingkungan">
                {([['landasan', 'rocket_launch', 'Landasan'], ['pesisir', 'waves', 'Pesisir'], ['hutan', 'forest', 'Hutan']] as const).map(([id, icon, label]) => (
                  <button key={id} onClick={() => engine.viewSite(id)} className="flex min-h-10 items-center gap-1.5 rounded-xl px-2 text-xs font-extrabold transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white sm:px-3 sm:text-sm">
                    <Icon name={icon} size={18} /><span>{label}</span>
                  </button>
                ))}
              </div>
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
