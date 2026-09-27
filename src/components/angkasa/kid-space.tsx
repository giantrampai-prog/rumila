"use client";

// Jelajah Angkasa versi anak: 3D memenuhi layar, sedikit tombol besar, sedikit teks.
// Deretan planet di bawah · kartu singkat + tombol Dengar · tombol Terbang & Kuis.
// Mesin 3D, tur, suara, dan progres sama dengan Explorer lengkap.

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { sfx } from "@/lib/sfx";
import { useSfxOnChange } from "@/lib/use-sfx";
import { OBJ, PLANET_IDS } from "@/lib/angkasa/manifest";
import { useAngkasa, type Mode } from "@/lib/angkasa/state";
import { hasVoice, playVoice, stopVoice, usePlayingVoice } from "@/lib/angkasa/voice";
import { markDone, TOOL_ID, useAngkasaSession, useDoneItems } from "@/lib/angkasa/progress";
import { useMe, useRumila } from "@/lib/store";
import { Certificate, type CertSpec } from "@/components/koding/certificate";
import { fmtDate } from "@/components/koding/shared";
import "@/components/koding/koding.css";
import { installAudioUnlock } from "@/lib/audio-unlock";
import { LoopMusic } from "@/lib/bgm";
import { beginTour, endTour, setFullRoot } from "./fullscreen";
import { useNarration } from "./panels/tour";
import { TOUR } from "@/lib/angkasa/tour";
import { TOUR_POPS } from "@/lib/angkasa/tour-pops";
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
      onClick={() => {
        sfx.tap();
        onClick();
      }}
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

// Musik latar tur = musik misi Roket, pelan di bawah narasi, berulang tanpa putus (satu instans: elemen audio bersama).
let tourMusic: LoopMusic | null = null;
const music = () => (tourMusic ??= new LoopMusic("/roket/musik-roket.m4a", ["roket-bgm-a", "roket-bgm-b"], { volume: 0.23, loopStart: 3, loopEnd: 229, fade: 4 }));

/** Nama persinggahan + kartu fakta yang muncul bergantian mengikuti narasi, berwarna sesuai objek. */
function TourPops() {
  const st = useAngkasa();
  const stop = TOUR[st.tourIndex];
  const look = TOUR_POPS[stop.id];
  const shown = st.tourArrived && look ? look.pops.filter((p) => p.at <= st.tourLine) : [];
  useSfxOnChange(shown.length, (n, prev) => {
    if (n > prev) sfx.pick();
  });
  if (!look || !st.tourArrived) return null;
  const [light, dark] = look.accent;
  return (
    <>
      <div
        key={`t${st.tourIndex}`}
        className="ak-pop absolute left-3 flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-white sm:left-5"
        style={{ top: "max(22px, calc(env(safe-area-inset-top) + 14px))", background: `linear-gradient(135deg, ${light}, ${dark})`, boxShadow: `0 4px 0 ${dark}66, 0 8px 24px rgba(0,0,0,.35)` }}
      >
        {stop.id in OBJ_IDS ? <Ball id={stop.id} size={34} /> : <span className="flex size-[34px] items-center justify-center rounded-full bg-white/25"><Icon name="rocket_launch" size={20} /></span>}
        <span style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 800, textShadow: "0 1px 2px rgba(0,0,0,.35)" }}>{stop.title}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-center gap-2.5 px-3 sm:gap-3" style={{ paddingBottom: "max(18px, env(safe-area-inset-bottom))" }}>
        {shown.map((p) => (
          <div
            key={`${st.tourIndex}-${p.at}`}
            className="ak-popcard flex w-[min(31vw,230px)] min-w-[150px] items-center gap-2.5 rounded-[22px] p-2.5 pr-3 text-white"
            style={{ background: `linear-gradient(150deg, ${light}f2, ${dark}f2)`, boxShadow: `0 5px 0 ${dark}, 0 12px 28px rgba(0,0,0,.35)`, border: "2px solid rgba(255,255,255,.35)" }}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/25">
              <Icon name={p.icon} size={26} />
            </span>
            <span className="min-w-0">
              <span className="block truncate" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, lineHeight: 1.05, textShadow: "0 1px 2px rgba(0,0,0,.3)" }}>
                {p.big}
              </span>
              <span className="block text-[13px] leading-tight font-extrabold opacity-95">{p.label}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
const OBJ_IDS = Object.fromEntries(DOCK.map((id) => [id, 1]));

/** Tur terbang sinematik: 3D penuh, tanpa teks. Ketuk untuk jeda; narasi suara tetap jalan. */
function KidTour() {
  const st = useAngkasa();
  useNarration();
  const last = TOUR.length - 1;
  const stop = TOUR[st.tourIndex];
  useSfxOnChange(st.tourIndex, () => sfx.warp());
  const finished = st.tourIndex === last && !st.tourPlaying && st.tourLine >= stop.lines.length - 1;
  useEffect(() => {
    if (st.tourIndex === last) markDone(st.memberId, "tur:tata-surya");
  }, [st.tourIndex, st.memberId, last]);
  // ikut jeda/lanjut; mengecil pelan saat tur selesai; berhenti saat keluar tur
  useEffect(() => {
    if (finished) music().stop(3);
    else if (st.tourPlaying) music().play();
    else music().pause();
  }, [st.tourPlaying, finished]);
  useEffect(() => () => music().stop(1), []);

  const pov = st.tourCam === "mata";
  return (
    <div className="pointer-events-none absolute inset-0" style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
      {/* pandangan mata Agam: bingkai kokpit (jendela transparan) di atas angkasa 3D */}
      {pov && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/angkasa/kapal/kokpit.webp"
          alt=""
          aria-hidden
          draggable={false}
          className="ak-cockpit absolute inset-0 h-full w-full select-none"
          style={{ objectFit: "cover", objectPosition: "50% 100%", background: "transparent", border: 0, borderRadius: 0, boxShadow: "none" }}
        />
      )}
      {/* progres tipis */}
      <div className="absolute inset-x-0 top-0 flex gap-1 px-3 pt-2" style={{ paddingTop: "max(8px, env(safe-area-inset-top))" }} aria-hidden>
        {TOUR.map((t, i) => (
          <span key={t.id} className="h-1 flex-1 rounded-full" style={{ background: i < st.tourIndex ? "rgba(255,255,255,.85)" : i === st.tourIndex ? "#ffbe0b" : "rgba(255,255,255,.2)" }} />
        ))}
      </div>
      <div className="absolute top-5 right-3 sm:right-5" style={{ top: "max(20px, calc(env(safe-area-inset-top) + 12px))" }}>
        <div className="flex items-start gap-3">
          <RoundBtn
            icon={pov ? "rocket" : "visibility"}
            label={pov ? "Pesawat" : "Mata Agam"}
            tone="purple"
            onClick={() => st.set({ tourCam: pov ? "belakang" : "mata" })}
          />
          <RoundBtn icon="close" label="Keluar tur" onClick={endTour} />
        </div>
      </div>

      <TourPops />

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

const AGAM = "/angkasa/agam-astronot.png";

/** Sapaan Agam selama kamera mundur dari Bumi ke tata surya. */
const INTRO_LINES = ["Halo! Aku Agam. Ini Bumi, rumah kita.", "Bumi punya banyak tetangga. Yuk, kita lihat tata surya!"];

function Bubble({ children, tail = "left" }: { children: React.ReactNode; tail?: "left" | "bottom" }) {
  return (
    <div className="ak-pop relative rounded-[24px] bg-white px-4 py-3 text-[#2b1d4e] shadow-[0_5px_0_rgba(0,0,0,.22)]" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 800, lineHeight: 1.15 }}>
      {children}
      <span
        aria-hidden
        className="absolute size-4 rotate-45 bg-white"
        style={tail === "left" ? { left: -7, bottom: 22 } : { left: 34, bottom: -7 }}
      />
    </div>
  );
}

function AgamFig({ h }: { h: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={AGAM} alt="Agam si astronaut" draggable={false} className="ak-float shrink-0 select-none" style={{ height: h, width: "auto", background: "transparent", border: 0, borderRadius: 0, boxShadow: "none", filter: "drop-shadow(0 8px 14px rgba(0,0,0,.5))" }} />;
}

function IntroOverlay() {
  const st = useAngkasa();
  const [line, setLine] = useState(0);
  useEffect(() => {
    sfx.sparkle();
    const t = setTimeout(() => {
      setLine(1);
      sfx.whoosh();
    }, 3600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-3 sm:p-5" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
      <div className="absolute right-3 sm:right-5" style={{ top: "max(14px, calc(env(safe-area-inset-top) + 8px))" }}>
        <button
          onClick={() => {
            sfx.tap();
            st.set({ intro: "choose" });
          }}
          className="pointer-events-auto flex items-center gap-1 rounded-full bg-black/45 py-2 pr-3 pl-4 text-white backdrop-blur active:scale-95"
          style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800 }}
        >
          Lewati <Icon name="skip_next" size={24} />
        </button>
      </div>
      <div className="flex items-end gap-2">
        <AgamFig h={170} />
        <div key={line} className="mb-16 max-w-[330px]">
          <Bubble>{INTRO_LINES[line]}</Bubble>
        </div>
      </div>
    </div>
  );
}

function ChooseOverlay({ stamped }: { stamped: number }) {
  const st = useAngkasa();
  useEffect(() => sfx.open(), []);
  const tile = (icon: string, title: string, sub: string, grad: string, shade: string, onClick: () => void) => (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-1 rounded-[26px] px-3 pt-4 pb-3 text-white transition-transform active:scale-95"
      style={{ background: grad, boxShadow: `0 6px 0 ${shade}` }}
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-white/25">
        <Icon name={icon} size={40} />
      </span>
      <span style={{ fontFamily: BALOO, fontSize: 23, fontWeight: 800, lineHeight: 1.05 }}>{title}</span>
      <span className="text-[14px] leading-tight font-extrabold opacity-90">{sub}</span>
    </button>
  );
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#05070f]/35 p-4">
      <div className="ak-pop flex w-full max-w-[520px] flex-col items-stretch gap-3">
        <div className="flex items-end gap-1">
          <AgamFig h={120} />
          <div className="mb-8 flex-1">
            <Bubble>Mau menjelajah dengan cara apa?</Bubble>
          </div>
        </div>
        <div className="flex gap-3">
          {tile("rocket_launch", "Tur Tata Surya", "Terbang bersama Agam, dengar ceritanya", "linear-gradient(155deg,#ffb347,#ff7a1a 60%)", "#c85400", () => {
            st.set({ intro: "done" });
            beginTour(0);
          })}
          {tile("travel_explore", "Jelajah Bebas", "Pilih sendiri planet yang mau dikunjungi", "linear-gradient(155deg,#6fb8ff,#2f6fe8 60%)", "#1d47a8", () => {
            sfx.whoosh();
            st.set({ intro: "done" });
          })}
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-full bg-black/45 px-4 py-1.5 text-white" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800 }}>
          <Icon name="badge" size={20} /> Paspor Antariksa: {stamped}/{DOCK.length} cap
        </div>
      </div>
    </div>
  );
}

const SPACE_CERT: CertSpec = {
  title: "PENJELAJAH TATA SURYA",
  emblem: "✦",
  lines: ["atas keberhasilannya mengunjungi Matahari, delapan planet, Bulan, dan Pluto", "dalam Jelajah Angkasa, dengan rasa ingin tahu seorang penjelajah sejati."],
  stats: [
    [String(DOCK.length), "OBJEK"],
    ["8", "PLANET"],
    ["1", "BINTANG"],
  ],
  seal: [String(DOCK.length), "OBJEK"],
  ring: "RINOYA ACADEMY ★ JELAJAH ANGKASA ★ TATA SURYA ★",
  signer: "KAPTEN ANTARIKSA",
  lockNote: `PRATINJAU · KUNJUNGI ${DOCK.length} OBJEK`,
  unit: "objek",
  file: "Penjelajah-Tata-Surya",
  serial: "JA-TS",
  robot: false,
};

/** Paspor Antariksa: cap untuk tiap objek yang sudah dikunjungi; lengkap → sertifikat. */
function Passport({ done, onClose }: { done: Set<string>; onClose: () => void }) {
  const st = useAngkasa();
  const kid = useRumila((s) => s.members.find((m) => m.id === st.memberId));
  const self = useMe();
  const me = kid ?? self;
  const [cert, setCert] = useState(false);
  const count = DOCK.filter((id) => done.has(id)).length;
  const all = count === DOCK.length;
  const lastAt = useRumila((s) => {
    let m = 0;
    for (const a of s.activity) if (a.memberId === st.memberId && a.toolId === TOOL_ID && a.partId?.startsWith("obj:") && a.at > m) m = a.at;
    return m;
  });
  if (cert)
    return (
      <Certificate
        game="Jelajah Angkasa"
        name={me?.name ?? "Penjelajah Cilik"}
        stars={count}
        date={all ? fmtDate(new Date(lastAt || Date.now()).toISOString()) : "Tanggal selesai"}
        remaining={DOCK.length - count}
        spec={SPACE_CERT}
        onClose={() => setCert(false)}
      />
    );
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05070f]/60 p-3 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="ak-pop ak-passport relative flex max-h-full w-full max-w-[600px] flex-col overflow-y-auto rounded-[28px] p-4 sm:p-5"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-[#1d2f6f] text-[#f4d27a]">
            <Icon name="public" size={30} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-extrabold tracking-[.18em] text-[#8a7a5c]">PASPOR ANTARIKSA</div>
            <div className="truncate" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: "#2b1d4e", lineHeight: 1.05 }}>
              {me?.name ?? "Penjelajah Cilik"}
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#2b1d4e]/10 text-[#2b1d4e] active:scale-90">
            <Icon name="close" size={26} />
          </button>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#2b1d4e]/10">
          <div className="h-full rounded-full bg-gradient-to-r from-[#ffbe0b] to-[#ff7a1a] transition-[width] duration-700" style={{ width: `${(count / DOCK.length) * 100}%` }} />
        </div>
        <div className="mt-1 text-[14px] font-extrabold text-[#6b5d80]">
          {all ? "Semua cap terkumpul! Kamu Penjelajah Tata Surya." : `${count} dari ${DOCK.length} cap · ketuk objek untuk berkunjung`}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {DOCK.map((id, i) => {
            const got = done.has(id);
            return (
              <button
                key={id}
                onClick={() => {
                  onClose();
                  st.select(id, { mode: "planet" });
                }}
                className="relative flex flex-col items-center gap-1.5 rounded-[18px] border-2 border-dashed border-[#c9b98f] py-3 active:scale-95"
                style={{ background: got ? "rgba(255,255,255,.55)" : "transparent" }}
              >
                <span style={{ filter: got ? undefined : "grayscale(1) brightness(.8)", opacity: got ? 1 : 0.45 }}>
                  <Ball id={id} size={46} />
                </span>
                <span className="text-[14px] font-extrabold" style={{ color: got ? "#2b1d4e" : "#9b8f7c" }}>
                  {OBJ.get(id)!.nameId}
                </span>
                {got && (
                  <span aria-label="sudah dikunjungi" className="ak-stamp absolute top-1 right-1" style={{ rotate: `${((i * 37) % 30) - 18}deg` }}>
                    <Icon name="check" size={18} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (all) sfx.celebrate();
            else sfx.tap();
            setCert(true);
          }}
          className="koding-certcard mt-4 flex items-center gap-3 rounded-[20px] p-3 text-left active:scale-[.98]"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full text-white" style={{ background: all ? "linear-gradient(155deg,#ffd54a,#e0a100)" : "#b9ad96" }}>
            <Icon name={all ? "workspace_premium" : "lock"} size={28} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, color: "#2b1d4e", lineHeight: 1.1 }}>
              Sertifikat Penjelajah Tata Surya
            </span>
            <span className="block text-[13px] font-extrabold text-[#6b5d80]">{all ? "Lihat & simpan sertifikatmu" : `Kunjungi ${DOCK.length - count} objek lagi · lihat contohnya`}</span>
          </span>
          <Icon name="chevron_right" size={28} className="text-[#6b5d80]" />
        </button>
      </div>
    </div>
  );
}

export function KidSpace({ memberId, initial }: { memberId: string; initial?: { obj?: string; mode?: Mode } }) {
  const st = useAngkasa();
  const router = useRouter();
  const appRef = useRef<HTMLDivElement>(null);
  useAngkasaSession(memberId);

  // layout effect: `intro` sudah "play" sebelum bingkai 3D pertama (mesin berjalan lewat requestAnimationFrame)
  useLayoutEffect(() => {
    installAudioUnlock();
    setFullRoot(appRef.current);
    const deep = !!(initial?.obj && OBJ.get(initial.obj));
    useAngkasa.getState().set({ tourCinematic: true, fx: true, intro: deep ? "done" : "play" });
    return () => {
      setFullRoot(null);
      useAngkasa.getState().set({ tourCinematic: false, fx: false, intro: "done" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Tur: planet bergeser pelan (2 hari/detik) agar kamera yang terbang & mengitari tetap tenang.
    // Pembuka dekat Bumi: hampir diam (Bulan mengorbit Bumi ±27 hari; pada 8 hari/detik ia melesat & menutupi Bumi).
    useAngkasa.getState().set({ speed: st.intro === "play" ? 0.3 : st.mode === "planet" ? 0.5 : st.mode === "tur" ? 2 : 8 });
  }, [st.mode, st.intro]);

  // Rekaman suara diputar otomatis saat objek dibuka.
  const voiceObj = st.mode === "planet" ? st.selectedId : null;
  // terbang ke planet / kembali ke tata surya
  useSfxOnChange(voiceObj, (v) => (v ? sfx.warp() : sfx.whoosh()));
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

  // Paspor: cap dari objek yang sudah dipelajari (dilihat ±8 detik)
  const doneItems = useDoneItems(memberId);
  const stamps = new Set(doneItems.filter((p) => p.startsWith("obj:")).map((p) => p.slice(4)));
  const stampCount = DOCK.filter((id) => stamps.has(id)).length;
  useSfxOnChange(stampCount, (n, prev) => {
    if (n === prev + 1) sfx.coin();
  });
  const [passport, setPassport] = useState(false);
  // petunjuk "ketuk planet" sampai anak membuka objek pertamanya di sesi ini
  const [visited, setVisited] = useState(false);
  useEffect(() => {
    if (voiceObj) setVisited(true);
  }, [voiceObj]);

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

      {st.intro === "play" && !tour ? (
        <IntroOverlay />
      ) : st.intro === "choose" && !tour ? (
        <ChooseOverlay stamped={stampCount} />
      ) : tour ? (
        <KidTour />
      ) : (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5" style={{ paddingTop: "max(12px, env(safe-area-inset-top))", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          {/* atas: kembali · terbang */}
          <div className="flex items-start justify-between gap-2">
            <RoundBtn icon={st.mode === "tata-surya" ? "home" : "arrow_back"} label={st.mode === "tata-surya" ? "Keluar" : "Kembali"} onClick={back} />
            <div className="flex items-start gap-3">
              <RoundBtn icon="badge" label={`Paspor ${stampCount}/${DOCK.length}`} tone="purple" onClick={() => setPassport(true)} />
              <RoundBtn icon="rocket_launch" label="Terbang" tone="orange" onClick={() => beginTour(0)} />
            </div>
          </div>

          {/* bawah */}
          <div className="flex flex-col items-center gap-3">
            {!planet && !visited && (
              <div className="ak-hint flex items-center gap-2 rounded-full bg-white/95 py-2 pr-4 pl-3 text-[#2b1d4e] shadow-[0_4px_0_rgba(0,0,0,.25)]" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800 }}>
                <Icon name="touch_app" size={26} className="text-[#ff7a1a]" /> Ketuk planet untuk berkunjung!
              </div>
            )}
            {planet && <ObjCard id={st.selectedId!} />}
            <div className="w-full">
              <Dock />
            </div>
          </div>
        </div>
      )}
      {passport && <Passport done={stamps} onClose={() => setPassport(false)} />}
    </div>
  );
}
