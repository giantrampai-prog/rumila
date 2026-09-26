"use client";

// Jelajah Angkasa versi anak: 3D memenuhi layar, sedikit tombol besar, sedikit teks.
// Deretan planet di bawah · kartu singkat + tombol Dengar · tombol Terbang & Kuis.
// Mesin 3D, tur, suara, dan progres sama dengan Explorer lengkap.

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui";
import { OBJ, PLANET_IDS } from "@/lib/angkasa/manifest";
import { useAngkasa, type Mode } from "@/lib/angkasa/state";
import { hasVoice, playVoice, stopVoice, usePlayingVoice } from "@/lib/angkasa/voice";
import { markDone, useAngkasaSession } from "@/lib/angkasa/progress";
import { installAudioUnlock } from "@/lib/audio-unlock";
import { beginTour, endTour, setFullRoot } from "./fullscreen";
import { useNarration } from "./panels/tour";
import { TOUR } from "@/lib/angkasa/tour";
import { Viewer } from "./viewer";
import "./angkasa.css";

const BALOO = "var(--ff-baloo), system-ui, sans-serif";
const DOCK = ["sun", ...PLANET_IDS, "moon", "pluto"].filter((id) => OBJ.has(id));

function Ball({ id, size }: { id: string; size: number }) {
  const o = OBJ.get(id)!;
  const url = o.texture.lo;
  return (
    <span
      aria-hidden
      className="relative inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: url ? `url(${url}) center/200% 100%` : o.texture.base,
        boxShadow: id === "sun" ? "0 0 24px rgba(255,170,40,.7), inset -8px -6px 14px rgba(0,0,0,.25)" : "inset -10px -8px 16px rgba(0,0,0,.55)",
      }}
    >
      {id === "saturn" && (
        <span className="absolute top-1/2 left-1/2 h-[30%] w-[165%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border-[3px] border-[#e2d3a8]/90" />
      )}
    </span>
  );
}

/** Tombol bulat besar mengambang di atas 3D. */
export function RoundBtn({ icon, label, onClick, tone = "white" }: { icon: string; label: string; onClick: () => void; tone?: "white" | "orange" | "purple" }) {
  const bg =
    tone === "orange"
      ? { background: "linear-gradient(155deg,#ffb347,#ff7a1a 60%)", boxShadow: "0 5px 0 #c85400", color: "#fff" }
      : tone === "purple"
        ? { background: "linear-gradient(155deg,#c78bff,#8b45f5 60%)", boxShadow: "0 5px 0 #5a1fc0", color: "#fff" }
        : { background: "#fff", boxShadow: "0 5px 0 rgba(0,0,0,.25)", color: "#2b1d4e" };
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="pointer-events-auto flex flex-col items-center gap-1 transition-transform active:scale-90"
    >
      <span className="flex size-[62px] items-center justify-center rounded-full sm:size-[70px]" style={bg}>
        <Icon name={icon} size={34} />
      </span>
      {tone !== "white" && (
        <span className="rounded-full bg-black/45 px-2.5 py-0.5 text-white" style={{ fontFamily: BALOO, fontSize: 15, fontWeight: 800 }}>
          {label}
        </span>
      )}
    </button>
  );
}

function Dock() {
  const st = useAngkasa();
  return (
    <div className="pointer-events-auto -mx-3 overflow-x-auto px-3 pb-1">
      {/* w-max + mx-auto: di tengah bila muat, bisa digeser penuh (termasuk ujung kiri) bila tidak */}
      <div className="mx-auto flex w-max gap-2">
      {DOCK.map((id) => {
        const on = st.mode === "planet" && st.selectedId === id;
        return (
          <button
            key={id}
            onClick={() => st.select(id, { mode: "planet" })}
            aria-label={OBJ.get(id)!.nameId}
            aria-pressed={on}
            className="flex w-[78px] shrink-0 flex-col items-center gap-1.5 rounded-[22px] py-2 transition-transform active:scale-90"
            style={on ? { background: "rgba(255,255,255,.18)", boxShadow: "inset 0 0 0 3px #ffbe0b" } : undefined}
          >
            <Ball id={id} size={50} />
            <span className="text-white" style={{ fontFamily: BALOO, fontSize: 14, fontWeight: 800, lineHeight: 1, textShadow: "0 1px 3px rgba(0,0,0,.6)" }}>
              {OBJ.get(id)!.nameId}
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}

/** Kartu singkat objek terpilih: nama besar, satu kalimat, tombol Dengar, panah ganti planet. */
function ObjCard({ id }: { id: string }) {
  const st = useAngkasa();
  const o = OBJ.get(id)!;
  // Hanya rekaman suara asli; tanpa suara sintesis (terdengar robot).
  const recorded = hasVoice(id);
  const playing = usePlayingVoice() === id;
  const i = DOCK.indexOf(id);
  const go = (d: number) => st.select(DOCK[(i + d + DOCK.length) % DOCK.length], { mode: "planet" });

  // Dianggap sudah dipelajari setelah dilihat ±8 detik (dapat bintang).
  useEffect(() => {
    const t = setTimeout(() => markDone(st.memberId, `obj:${id}`), 8000);
    return () => clearTimeout(t);
  }, [id, st.memberId]);

  const listen = () => (playing ? stopVoice() : void playVoice(id));

  return (
    <div className="pointer-events-auto mx-auto flex w-full max-w-[620px] items-center gap-2 rounded-[28px] bg-white/95 p-3 shadow-[0_6px_0_rgba(0,0,0,.25)] sm:gap-3 sm:p-4">
      <button onClick={() => go(-1)} aria-label="Sebelumnya" className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-[#f5f0fa] text-[#2b1d4e] active:scale-90 sm:flex">
        <Icon name="chevron_left" size={32} />
      </button>
      <div className="min-w-0 flex-1">
        <div style={{ fontFamily: BALOO, fontSize: 30, fontWeight: 800, color: "#2b1d4e", lineHeight: 1 }}>{o.nameId}</div>
        <p className="mt-1 text-[16px] leading-snug font-extrabold text-[#6b5d80] sm:text-[18px]">{o.definitionSimple}</p>
      </div>
      {recorded && (
        <button
          onClick={listen}
          aria-label={playing ? "Berhenti" : "Dengarkan"}
          className="flex size-[62px] shrink-0 items-center justify-center rounded-full text-white active:scale-90"
          style={{ background: "linear-gradient(155deg,#5ce8d6,#12b8a6 60%)", boxShadow: "0 4px 0 #0a8a7c" }}
        >
          <Icon name={playing ? "stop" : "volume_up"} size={34} />
        </button>
      )}
      <button onClick={() => go(1)} aria-label="Berikutnya" className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-[#f5f0fa] text-[#2b1d4e] active:scale-90 sm:flex">
        <Icon name="chevron_right" size={32} />
      </button>
    </div>
  );
}

/** Tur terbang sinematik: 3D penuh, tanpa teks. Ketuk untuk jeda; narasi suara tetap jalan. */
function KidTour() {
  const st = useAngkasa();
  useNarration();
  const last = TOUR.length - 1;
  const stop = TOUR[st.tourIndex];
  const finished = st.tourIndex === last && !st.tourPlaying && st.tourLine >= stop.lines.length - 1;
  useEffect(() => {
    if (st.tourIndex === last) markDone(st.memberId, "tur:tata-surya");
  }, [st.tourIndex, st.memberId, last]);

  return (
    <div className="pointer-events-none absolute inset-0" style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
      {/* progres tipis */}
      <div className="absolute inset-x-0 top-0 flex gap-1 px-3 pt-2" style={{ paddingTop: "max(8px, env(safe-area-inset-top))" }} aria-hidden>
        {TOUR.map((t, i) => (
          <span key={t.id} className="h-1 flex-1 rounded-full" style={{ background: i < st.tourIndex ? "rgba(255,255,255,.85)" : i === st.tourIndex ? "#ffbe0b" : "rgba(255,255,255,.2)" }} />
        ))}
      </div>
      <div className="absolute top-5 right-3 sm:right-5" style={{ top: "max(20px, calc(env(safe-area-inset-top) + 12px))" }}>
        <RoundBtn icon="close" label="Keluar tur" onClick={endTour} />
      </div>

      {/* dijeda / selesai: tombol besar di tengah */}
      {!st.tourPlaying && (
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          {finished ? (
            <>
              <RoundBtn icon="replay" label="Ulangi" tone="orange" onClick={() => st.set({ tourIndex: 0, tourLine: 0, tourPlaying: true })} />
              <RoundBtn icon="check" label="Selesai" tone="purple" onClick={endTour} />
            </>
          ) : (
            <RoundBtn icon="play_arrow" label="Lanjut" tone="orange" onClick={() => st.set({ tourPlaying: true })} />
          )}
        </div>
      )}
    </div>
  );
}

export function KidSpace({ memberId, initial }: { memberId: string; initial?: { obj?: string; mode?: Mode } }) {
  const st = useAngkasa();
  const router = useRouter();
  const appRef = useRef<HTMLDivElement>(null);
  useAngkasaSession(memberId);

  useEffect(() => {
    installAudioUnlock();
    setFullRoot(appRef.current);
    useAngkasa.getState().set({ tourCinematic: true, fx: true });
    return () => {
      setFullRoot(null);
      useAngkasa.getState().set({ tourCinematic: false, fx: false });
    };
  }, []);

  useEffect(() => {
    const s = useAngkasa.getState();
    s.init(memberId);
    if (initial?.obj && OBJ.get(initial.obj)) s.select(initial.obj, { mode: "planet", push: false });
    else s.select(null, { mode: "tata-surya" });
    // Planet langsung bergerak begitu halaman dibuka (orbit + rotasi), dengan tempo santai.
    s.set({ playing: true, speed: 8, orbitOn: true, spinOn: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  // Tempo kalem: tampilan tata surya 8 hari/detik; saat satu objek dilihat hampir diam
  // (kamera mengikuti objek, jadi orbit cepat membuat layar ikut berputar & memusingkan).
  useEffect(() => {
    useAngkasa.getState().set({ speed: st.mode === "planet" ? 0.5 : 8 });
  }, [st.mode]);

  // Rekaman suara diputar otomatis saat objek dibuka.
  const voiceObj = st.mode === "planet" ? st.selectedId : null;
  useEffect(() => {
    if (voiceObj && st.prefs.autoVoice && hasVoice(voiceObj)) void playVoice(voiceObj);
    else stopVoice();
  }, [voiceObj, st.prefs.autoVoice]);
  useEffect(() => () => stopVoice(), []);

  const home = () => st.select(null, { mode: "tata-surya" });
  const back = () => {
    if (st.mode === "tur") return endTour();
    if (st.mode !== "tata-surya") return home();
    router.push("/beranda/angkasa");
  };

  const tour = st.mode === "tur";
  const planet = st.mode === "planet" && st.selectedId;

  return (
    <div ref={appRef} className="ak-app ak-kid theme-play fixed inset-0 overflow-hidden bg-[#05070f]">
      <section aria-label="Tampilan 3D" className="absolute inset-0">
        {st.engineStatus === "no-webgl" || st.engineStatus === "context-lost" ? (
          <div className="flex h-full items-center justify-center p-6 text-center text-white" style={{ fontFamily: BALOO, fontSize: 22 }}>
            Perangkat ini belum bisa menampilkan 3D.
          </div>
        ) : (
          <Viewer />
        )}
      </section>

      {tour ? (
        <KidTour />
      ) : (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5" style={{ paddingTop: "max(12px, env(safe-area-inset-top))", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          {/* atas: kembali · terbang */}
          <div className="flex items-start justify-between gap-2">
            <RoundBtn icon={st.mode === "tata-surya" ? "home" : "arrow_back"} label={st.mode === "tata-surya" ? "Keluar" : "Kembali"} onClick={back} />
            <RoundBtn icon="rocket_launch" label="Terbang" tone="orange" onClick={() => beginTour(0)} />
          </div>

          {/* bawah */}
          <div className="flex flex-col gap-3">
            {planet && <ObjCard id={st.selectedId!} />}
            <Dock />
          </div>
        </div>
      )}
    </div>
  );
}
