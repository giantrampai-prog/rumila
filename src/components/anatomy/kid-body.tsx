'use client';

// Jelajah Tubuh versi anak: 3D penuh layar, sedikit tombol besar, sedikit teks.
// Deretan organ di bawah (ketuk → organ diperbesar sendirian) · kartu singkat · 4 tombol lapisan
// (Kulit, Otot, Tulang, Organ). Mesin 3D, data, dan progres sama dengan Explorer lengkap.

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { PLAY, type ColorKey } from '@/lib/catalog';
import { initialState, reducer } from '@/lib/anatomy/state';
import { TUR, TUR_AUDIO, turDwell } from '@/lib/anatomy/tur';
import { installAudioUnlock, sharedAudio, unlockAudio } from '@/lib/audio-unlock';
import { useAnatomySession } from '@/lib/anatomy/use-session';
import { LAYERS, type LayerId, type Manifest, type Part } from '@/lib/anatomy/types';
import { sfx } from '@/lib/sfx';
import { useRumila } from '@/lib/store';
import { useSfxOnChange } from '@/lib/use-sfx';
import type { ViewerHandle } from './viewer';

const Viewer = dynamic(() => import('./viewer').then((m) => m.Viewer), {
  ssr: false,
  loading: () => (
    <div className="anatomy-loading" role="status">
      Membuka ruang 3D…
    </div>
  ),
});

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';

/** Organ pilihan untuk anak: [id, nama, ikon, warna] */
const ORGANS: [string, string, string, ColorKey][] = [
  ['heart', 'Jantung', 'favorite', 'red'],
  ['brain_l', 'Otak', 'neurology', 'pink'],
  ['lung_r', 'Paru-paru', 'pulmonology', 'sky'],
  ['stomach', 'Lambung', 'gastroenterology', 'orange'],
  ['liver', 'Hati', 'gastroenterology', 'purple'],
  ['kidney_l', 'Ginjal', 'nephrology', 'teal'],
  ['jejunum', 'Usus', 'gastroenterology', 'gold'],
  ['pancreas', 'Pankreas', 'endocrinology', 'lime'],
  ['eye_l', 'Mata', 'visibility', 'blue'],
  ['ear_l', 'Telinga', 'hearing', 'indigo'],
  ['nose', 'Hidung', 'air', 'green'],
  ['mouth', 'Mulut', 'dentistry', 'red'],
  ['hand_l', 'Tangan', 'back_hand', 'orange'],
  ['foot_l', 'Kaki', 'podiatry', 'purple'],
];

const LAYER_BTNS: [LayerId, string, string, ColorKey][] = [
  ['skin', 'Kulit', 'fingerprint', 'orange'],
  ['muscle', 'Otot', 'fitness_center', 'red'],
  ['bone', 'Tulang', 'orthopedics', 'gold'],
  ['organ', 'Organ', 'pulmonology', 'pink'],
];

function OrganCard({ part, onClose }: { part: Part; onClose: () => void }) {
  return (
    <div className="pointer-events-auto mx-auto flex w-full max-w-[620px] items-center gap-3 rounded-[26px] bg-white/95 p-3 shadow-[0_6px_0_rgba(43,29,78,.15)] sm:p-4">
      <div className="min-w-0 flex-1 pl-1">
        <div style={{ fontFamily: BALOO, fontSize: 28, fontWeight: 800, color: INK, lineHeight: 1 }}>{part.nameId}</div>
        <p className="mt-1 text-[15px] leading-snug font-extrabold text-[#6b5d80] sm:text-[17px]">{part.definitionSimple}</p>
      </div>
      <button onClick={onClose} aria-label="Tutup" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f5f0fa] text-[#2b1d4e] active:scale-90">
        <Icon name="close" size={28} />
      </button>
    </div>
  );
}

function TurOverlay({
  tur,
  onClose,
  onPlay,
  onRestart,
}: {
  tur: { i: number; playing: boolean; finished: boolean; progress: number };
  onClose: () => void;
  onPlay: (p: boolean) => void;
  onRestart: () => void;
}) {
  const s = TUR[tur.i];
  // Tanpa rekaman: teks kecil sebagai pengganti suara (sementara).
  const caption = TUR_AUDIO.length === 0 ? s.lines[Math.min(s.lines.length - 1, Math.floor(tur.progress * s.lines.length))] : null;
  return (
    <div className="absolute inset-0" onClick={() => !tur.finished && onPlay(!tur.playing)}>
      <div className="absolute inset-x-0 top-0 flex gap-1 px-3" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }} aria-hidden>
        {TUR.map((m, i) => (
          <span key={m.id} className="h-1 flex-1 rounded-full" style={{ background: i < tur.i ? 'rgba(255,255,255,.85)' : i === tur.i ? '#ffbe0b' : 'rgba(255,255,255,.25)' }} />
        ))}
      </div>
      <div className="absolute right-3 sm:right-5" style={{ top: 'max(20px, calc(env(safe-area-inset-top) + 12px))' }} onClick={(e) => e.stopPropagation()}>
        <RoundBtn icon="close" label="Keluar tur" onClick={onClose} />
      </div>
      <div className="absolute left-3 sm:left-5" style={{ top: 'max(20px, calc(env(safe-area-inset-top) + 12px))' }}>
        <span className="rounded-full bg-white/90 px-4 py-2" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>
          {s.title}
        </span>
      </div>
      {!tur.playing && (
        <div className="absolute inset-0 flex items-center justify-center gap-6" onClick={(e) => e.stopPropagation()}>
          {tur.finished ? (
            <>
              <RoundBtn icon="replay" label="Ulangi" tone="orange" onClick={onRestart} />
              <RoundBtn icon="check" label="Selesai" tone="purple" onClick={onClose} />
            </>
          ) : (
            <RoundBtn icon="play_arrow" label="Lanjut" tone="orange" onClick={() => onPlay(true)} />
          )}
        </div>
      )}
      {caption && tur.playing && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center px-4" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <p className="max-w-[640px] rounded-2xl bg-black/50 px-4 py-2 text-center text-[15px] font-bold text-white sm:text-[17px]">{caption}</p>
        </div>
      )}
    </div>
  );
}

export function KidBody({ manifest, memberId }: { manifest: Manifest; memberId: string }) {
  useAnatomySession(memberId);
  const router = useRouter();
  const complete = useRumila((s) => s.completeAnatomy);
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState());
  const viewer = useRef<ViewerHandle>(null);
  const organs = ORGANS.filter(([id]) => manifest.parts.some((p) => p.id === id));
  const selected = manifest.parts.find((p) => p.id === state.selectedId);
  useSfxOnChange(state.selectedId, (v) => (v ? sfx.scan() : sfx.close()));
  useSfxOnChange(state.isolation, (v) => v && sfx.whoosh());
  const cam = () => state.snapshot?.camera ?? viewer.current?.camera() ?? { position: [0, 0.9, 3.2] as [number, number, number], target: [0, 0.9, 0] as [number, number, number] };

  // Dianggap sudah dipelajari setelah dilihat ±8 detik.
  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(() => complete(memberId, selected.id), 8000);
    return () => clearTimeout(t);
  }, [selected, memberId, complete]);

  /** Ketuk organ di deretan: organ diperbesar sendirian (lapisan yang perlu dibuka otomatis). */
  const open = (id: string) => {
    const p = manifest.parts.find((x) => x.id === id);
    if (!p) return;
    dispatch({ type: 'isolate', id: p.id, camera: cam() });
    dispatch({ type: 'select', part: p, reveal: true });
    if (p.kind === 'assembly' || p.id.startsWith('eye_')) for (const layer of ['bone', 'organ', 'muscle', 'nerve'] as const) dispatch({ type: 'layer', id: layer, visible: true, opacity: 1 });
    if (p.id === 'heart') dispatch({ type: 'layer', id: 'vessel', visible: true, opacity: 1 });
    window.setTimeout(() => viewer.current?.focus(p.id), 30);
  };
  /** Ketuk bagian di 3D: tampilkan kartunya. */
  const pick = (id: string) => {
    const p = manifest.parts.find((x) => x.id === id);
    if (p) dispatch({ type: 'select', part: p });
  };
  const whole = () => dispatch({ type: 'reset' });
  const back = () => {
    if (state.isolation) return dispatch({ type: 'back' });
    if (selected) return dispatch({ type: 'patch', patch: { selectedId: null } });
    router.push('/beranda/angkasa');
  };
  const busy = !!state.isolation || !!selected;

  /* ---------------- Tur bernarasi ---------------- */
  const [tur, setTur] = useState<{ i: number; playing: boolean; finished: boolean; progress: number } | null>(null);
  const turRef = useRef({ i: 0, t: 0, playing: false });
  useSfxOnChange(tur?.i ?? -1, (i) => i > 0 && sfx.arrive());
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => installAudioUnlock(), []);

  /** Terapkan adegan tur: organ diperbesar sendirian, atau seluruh tubuh dengan lapisan tertentu. */
  const applyStop = useCallback(
    (i: number) => {
      const s = TUR[i];
      dispatch({ type: 'patch', patch: { playing: false } });
      if (s.focus) {
        openRef.current(s.focus);
        if (s.focus === 'heart') dispatch({ type: 'patch', patch: { playing: true } }); // aliran darah bergerak
        return;
      }
      dispatch({ type: 'reset' });
      const show = s.layers ?? (['bone', 'organ'] as LayerId[]);
      for (const l of LAYERS) dispatch({ type: 'layer', id: l.id, visible: show.includes(l.id), opacity: 1 });
      window.setTimeout(() => viewer.current?.preset('front'), 40);
    },
    [],
  );

  const turGo = useCallback(
    (i: number) => {
      turRef.current.i = i;
      turRef.current.t = 0;
      applyStop(i);
      const part = TUR_AUDIO.find((p) => i >= p.first && i < p.first + p.cues.length);
      if (part) {
        const a = sharedAudio('tubuh');
        if (!a.src.endsWith(part.src)) a.src = part.src;
        const seek = () => (a.currentTime = part.cues[i - part.first]);
        if (a.readyState >= 1) seek();
        else a.onloadedmetadata = seek;
      }
      setTur((x) => ({ i, playing: x?.playing ?? true, finished: false, progress: 0 }));
    },
    [applyStop],
  );

  const turStart = () => {
    unlockAudio(); // dari ketukan tombol: buka kunci audio iPad/iPhone
    turRef.current.playing = true;
    setTur({ i: 0, playing: true, finished: false, progress: 0 });
    turGo(0);
  };
  const turStop = () => {
    sharedAudio('tubuh').pause();
    turRef.current.playing = false;
    setTur(null);
    dispatch({ type: 'reset' });
    window.setTimeout(() => viewer.current?.preset('front'), 40);
  };
  const turPlay = (p: boolean) => {
    turRef.current.playing = p;
    const a = sharedAudio('tubuh');
    if (!p) a.pause();
    setTur((x) => (x ? { ...x, playing: p } : x));
  };

  // Jam tur: rekaman (bila ada) menentukan adegan; tanpa rekaman memakai waktu baca.
  useEffect(() => {
    if (!tur) return;
    let raf = 0,
      last = performance.now(),
      lastUi = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const r = turRef.current;
      if (!r.playing) return;
      const part = TUR_AUDIO.find((p) => r.i >= p.first && r.i < p.first + p.cues.length);
      let dur = turDwell(TUR[r.i]);
      if (part) {
        const a = sharedAudio('tubuh');
        if (a.paused && !a.ended) a.play().catch(() => {});
        const k = r.i - part.first;
        const ct = a.currentTime;
        const end = part.cues[k + 1] ?? a.duration;
        dur = Math.max(1, (Number.isFinite(end) ? end : ct + 1) - part.cues[k]);
        r.t = ct - part.cues[k];
        if (part.cues[k + 1] !== undefined && ct >= part.cues[k + 1]) return turGo(r.i + 1);
        if (a.ended) r.t = dur;
      } else r.t += dt;
      if (r.t >= dur) {
        if (r.i < TUR.length - 1) return turGo(r.i + 1);
        r.playing = false;
        sharedAudio('tubuh').pause();
        setTur((x) => (x ? { ...x, playing: false, finished: true, progress: 1 } : x));
        return;
      }
      if (now - lastUi > 250) {
        lastUi = now;
        const progress = Math.min(1, r.t / dur);
        setTur((x) => (x ? { ...x, progress } : x));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!tur, turGo]);

  return (
    <div className="anatomy-kid theme-play fixed inset-0 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 40%, #3b3f8f 0%, #23265e 45%, #12143a 100%)' }}>
      <div className="absolute inset-0">
        <Viewer
          ref={viewer}
          manifest={manifest}
          state={state}
          onSelect={pick}
          onDetach={(id, amount) => dispatch({ type: 'patch', patch: { detached: { ...state.detached, [id]: amount } } })}
        />
      </div>

      {tur ? (
        <TurOverlay tur={tur} onClose={turStop} onPlay={turPlay} onRestart={() => (turPlay(true), turGo(0))} />
      ) : (
      <div
        className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {/* atas: kembali · tubuh utuh */}
        <div className="flex items-start justify-between gap-2">
          <RoundBtn icon={busy ? 'arrow_back' : 'home'} label={busy ? 'Kembali' : 'Keluar'} onClick={back} />
          <div className="flex gap-3">
            {busy && <RoundBtn icon="accessibility_new" label="Utuh lagi" tone="purple" onClick={whole} />}
            <RoundBtn icon="play_circle" label="Tur" tone="orange" onClick={turStart} />
          </div>
        </div>

        {/* kanan: lapisan tubuh */}
        {!state.isolation && (
          <div className="pointer-events-auto absolute top-1/2 right-3 flex -translate-y-1/2 flex-col gap-3 sm:right-5">
            {LAYER_BTNS.map(([id, name, icon, c]) => {
              const on = state.layers[id].visible;
              const [l, m, d] = PLAY[c];
              return (
                <button key={id} onClick={() => dispatch({ type: 'layer', id, visible: !on, opacity: 1 })} aria-pressed={on} className="flex flex-col items-center gap-1 active:scale-90">
                  <span
                    className="flex size-[52px] items-center justify-center rounded-full text-white transition-opacity sm:size-[58px]"
                    style={{ background: `linear-gradient(155deg, ${l}, ${m} 65%)`, boxShadow: `0 4px 0 ${d}`, opacity: on ? 1 : 0.35 }}
                  >
                    <Icon name={icon} size={28} />
                  </span>
                  <span className="rounded-full bg-white/80 px-2 text-[12px] font-extrabold" style={{ color: INK, fontFamily: BALOO }}>
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* bawah: kartu organ + deretan organ */}
        <div className="flex flex-col gap-3">
          {selected && <OrganCard part={selected} onClose={() => (state.isolation ? dispatch({ type: 'back' }) : dispatch({ type: 'patch', patch: { selectedId: null } }))} />}
          <div className="pointer-events-auto -mx-3 overflow-x-auto px-3 pb-1">
      {/* w-max + mx-auto: di tengah bila muat, bisa digeser penuh (termasuk ujung kiri) bila tidak */}
      <div className="mx-auto flex w-max gap-2">
            {organs.map(([id, name, icon, c]) => {
              const on = state.isolation === id || state.selectedId === id;
              const [l, m, d] = PLAY[c];
              return (
                <button
                  key={id}
                  onClick={() => open(id)}
                  aria-pressed={on}
                  className="flex w-[74px] shrink-0 flex-col items-center gap-1.5 rounded-[20px] py-2 transition-transform active:scale-90"
                  style={on ? { background: 'rgba(255,255,255,.18)', boxShadow: 'inset 0 0 0 3px #ffbe0b' } : undefined}
                >
                  <span className="flex size-12 items-center justify-center rounded-full text-white" style={{ background: `linear-gradient(155deg, ${l}, ${m} 65%)`, boxShadow: `0 3px 0 ${d}` }}>
                    <Icon name={icon} size={26} />
                  </span>
                  <span style={{ fontFamily: BALOO, fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1, textShadow: '0 1px 3px rgba(0,0,0,.6)' }}>{name}</span>
                </button>
              );
            })}
      </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
