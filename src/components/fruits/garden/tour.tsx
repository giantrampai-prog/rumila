'use client';

// Tur Kebun Buah: anak berjalan sendiri menyusuri kebun 3D. Di setiap tanaman ia berhenti, kamera mendekat,
// dan kartu info buah muncul selama narasi (satu file suara + timestamp; tanpa rekaman memakai waktu baca
// dan teks tampil). Ketuk jeda untuk berhenti; buah yang dilewati otomatis masuk keranjang.

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { audioUrl, preloadAudio } from '@/lib/audio-clock';
import { sharedAudio } from '@/lib/audio-unlock';
import { FRUIT_BY_ID } from '@/lib/fruits/catalog';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import { TUR_BUAH, TUR_BUAH_AUDIO, buahDwell } from '@/lib/fruits/tur';
import type { GardenEngine } from './engine';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';

const part = (i: number) => TUR_BUAH_AUDIO.find((p) => i >= p.first && i < p.first + p.cues.length);

export interface TourHandle {
  arrived: (key: string) => void;
}

export function GardenTour({ engine, handle, onVisit, onClose }: { engine: GardenEngine; handle: { current: TourHandle | null }; onVisit: (id: string) => void; onClose: () => void }) {
  const [ui, setUi] = useState({ i: 0, talk: false, playing: true, finished: false, progress: 0 });
  const r = useRef({ i: 0, talk: false, t: 0, playing: true, seekTo: null as number | null, timer: 0, done: false, ct: 0, ctAt: 0 });
  const visitRef = useRef(onVisit);
  visitRef.current = onVisit;

  const audio = () => sharedAudio('fruit-tur');

  const go = (i: number) => {
    const s = r.current;
    s.i = i;
    s.talk = false;
    s.t = 0;
    window.clearTimeout(s.timer);
    s.timer = 0;
    s.done = false;
    audio().pause();
    engine.tourTo(TUR_BUAH[i].at);
    setUi((x) => ({ ...x, i, talk: false, finished: false, progress: 0 }));
  };

  const startTalk = () => {
    const s = r.current;
    const stop = TUR_BUAH[s.i];
    s.talk = true;
    s.t = 0;
    engine.focus(stop.fruit ?? stop.at);
    if (stop.fruit) visitRef.current(stop.fruit);
    const p = part(s.i);
    if (p) {
      const a = audio();
      const url = audioUrl(p.src);
      if (a.dataset.src !== url) {
        a.src = url;
        a.dataset.src = url;
      }
      s.seekTo = p.cues[s.i - p.first];
      const seek = () => {
        a.currentTime = p.cues[s.i - p.first];
        if (r.current.playing) a.play().catch(() => {});
      };
      if (a.readyState >= 1) seek();
      else a.onloadedmetadata = seek;
    }
    setUi((x) => ({ ...x, talk: true, progress: 0 }));
  };

  handle.current = {
    arrived: (key) => {
      if (key === TUR_BUAH[r.current.i].at && !r.current.talk) startTalk();
    },
  };

  const play = (on: boolean) => {
    r.current.playing = on;
    engine.setWalkPaused(!on);
    if (!on) audio().pause();
    else if (r.current.talk && part(r.current.i)) audio().play().catch(() => {});
    setUi((x) => ({ ...x, playing: on }));
  };

  useEffect(() => {
    TUR_BUAH_AUDIO.forEach((p) => void preloadAudio(p.src));
    engine.setTour(true);
    go(0);
    let raf = 0,
      last = performance.now(),
      lastUi = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = r.current;
      if (!s.playing || !s.talk) return;
      const p = part(s.i);
      let dur = buahDwell(TUR_BUAH[s.i]);
      if (p) {
        const a = audio();
        const k = s.i - p.first;
        const cue = p.cues[k];
        // berhenti sedikit sebelum awal adegan berikutnya (masih di dalam jeda hening) — tidak kebablasan
        const stopAt = p.cues[k + 1] !== undefined ? p.cues[k + 1] - 0.15 : Number.isFinite(a.duration) ? a.duration : cue + 60;
        dur = Math.max(1, stopAt - cue);
        // posisi suara ASLI (bukan jam halus); selama lompat-posisi belum selesai anggap di awal
        if (s.seekTo !== null && Math.abs(a.currentTime - s.seekTo) < 0.6) s.seekTo = null;
        // currentTime di HP bisa "macet" ±0,25 dtk di antara pembaruan → tambahkan waktu yang sudah berlalu
        if (a.currentTime !== s.ct) {
          s.ct = a.currentTime;
          s.ctAt = now;
        }
        const est = a.paused ? a.currentTime : s.ct + Math.min(0.3, (now - s.ctAt) / 1000);
        s.t = s.seekTo !== null ? 0 : est - cue;
        if (a.ended) s.t = dur;
        // di HP currentTime diperbarui tersendat → jadwalkan jeda tepat waktu saat sudah dekat akhir
        const rem = dur - s.t;
        if (!a.paused && rem < 0.35 && !s.timer)
          s.timer = window.setTimeout(() => {
            a.pause();
            s.timer = 0;
            s.done = true;
          }, Math.max(0, rem * 1000));
        if (s.done || (a.paused && s.seekTo === null && rem < 0.4)) s.t = dur;
      } else s.t += dt;
      if (s.t >= dur) {
        if (s.i < TUR_BUAH.length - 1) return go(s.i + 1);
        s.playing = false;
        audio().pause();
        engine.focus(null);
        setUi((x) => ({ ...x, playing: false, finished: true, progress: 1 }));
        return;
      }
      if (now - lastUi > 200) {
        lastUi = now;
        setUi((x) => ({ ...x, progress: Math.min(1, s.t / dur) }));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      audio().pause();
      engine.setTour(false);
      handle.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  const stop = TUR_BUAH[ui.i];
  const fruit = stop.fruit ? FRUIT_BY_ID.get(stop.fruit) : undefined;
  const noAudio = !part(ui.i);
  const caption = noAudio ? stop.lines[Math.min(stop.lines.length - 1, Math.floor(ui.progress * stop.lines.length))] : null;
  const total = TUR_BUAH.length;

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* progres */}
      <div className="absolute inset-x-0 top-0 px-3" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }} aria-hidden>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/50">
          <div className="h-full rounded-full bg-[#ff7a1a] transition-[width] duration-300" style={{ width: `${((ui.i + (ui.talk ? ui.progress : 0)) / total) * 100}%` }} />
        </div>
      </div>
      <div className="absolute inset-x-0 flex items-start justify-between gap-2 px-3 sm:px-5" style={{ top: 'max(18px, calc(env(safe-area-inset-top) + 12px))' }}>
        <span className="flex items-center gap-2 rounded-full bg-white/95 py-1.5 pr-4 pl-2 shadow-[0_4px_0_rgba(43,29,78,.12)]">
          <span className="ms text-[26px] text-[#1fbf62]">park</span>
          <span style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, color: INK }}>Tur Kebun</span>
          <span className="text-[12px] font-extrabold text-[#8a7a9c]">
            {ui.i + 1}/{total}
          </span>
        </span>
        <RoundBtn icon="close" label="Keluar tur" onClick={onClose} />
      </div>

      {/* bawah: jeda + kartu info */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-3 sm:px-5" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        {ui.talk ? (
          <div className="garden-pop pointer-events-auto flex w-full max-w-[620px] items-center gap-3 rounded-[26px] bg-white/95 p-3 shadow-[0_6px_0_rgba(43,29,78,.14)]">
            {fruit ? (
              <div className="relative size-[96px] shrink-0 overflow-hidden rounded-[20px] bg-[#fff6e4] sm:size-[112px]">
                <Image src={FRUIT_ARTWORK[fruit.id].thumb} alt="" fill sizes="112px" unoptimized className="object-contain p-1" />
              </div>
            ) : (
              <span className="flex size-[64px] shrink-0 items-center justify-center rounded-[20px] text-white" style={{ background: 'linear-gradient(155deg,#6fe39a,#1fbf62 60%)' }}>
                <Icon name={stop.at === 'plaza' ? 'park' : 'signpost'} size={36} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: INK, lineHeight: 1.05 }}>{fruit?.name ?? stop.title}</div>
              {caption ? (
                <p className="mt-1 text-[14px] leading-snug font-bold text-[#5b4d70] sm:text-[15px]">{caption}</p>
              ) : fruit ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {[
                    ['palette', fruit.skin],
                    ['sentiment_satisfied', fruit.taste],
                  ].map(([icon, text]) => (
                    <span key={icon} className="flex items-center gap-1 rounded-full bg-[#fff4e0] px-2.5 py-1 text-[12px] font-extrabold text-[#8a5a12]">
                      <Icon name={icon} size={15} />
                      {text}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          !ui.finished && (
            <span className="garden-bob rounded-full bg-white/90 px-4 py-2 shadow-[0_4px_0_rgba(43,29,78,.12)]" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, color: INK }}>
              {ui.playing ? 'Ayo jalan ke tanaman berikutnya…' : 'Tur berhenti sebentar'}
            </span>
          )
        )}
        <div className="pointer-events-auto flex w-full max-w-[620px] justify-start">
          {!ui.finished && <RoundBtn icon={ui.playing ? 'pause' : 'play_arrow'} label={ui.playing ? 'Jeda' : 'Lanjut'} tone="orange" onClick={() => play(!ui.playing)} />}
        </div>
      </div>

      {ui.finished && (
        <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[rgba(43,29,78,.3)]">
          <span className="rounded-full bg-white px-5 py-2" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK }}>
            Tur kebun selesai!
          </span>
          <div className="flex gap-6">
            <RoundBtn
              icon="replay"
              label="Ulangi"
              tone="orange"
              onClick={() => {
                r.current.playing = true;
                engine.setWalkPaused(false);
                setUi((x) => ({ ...x, playing: true }));
                go(0);
              }}
            />
            <RoundBtn icon="check" label="Selesai" tone="purple" onClick={onClose} />
          </div>
        </div>
      )}
    </div>
  );
}
