'use client';

// Kebun Buah mode jelajah: anak berjalan di kebun 3D (joystick / ketuk tanah), mendekati tanaman,
// lalu mengetuk buahnya → kartu buah (gambar, nama, ciri, "Tahukah kamu?", suara rekaman bila ada).
// Buah yang sudah ditemukan tercatat sebagai progres (activity log) dan mengisi keranjang di punggung.

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { sharedAudio, unlockAudio } from '@/lib/audio-unlock';
import { FRUITS, FRUIT_BY_ID } from '@/lib/fruits/catalog';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import { PERM, TOOL_ID } from '@/lib/fruits/progress';
import { useMe, useRumila } from '@/lib/store';
import type { GardenEngine } from './engine';
import { GardenTour, type TourHandle } from './tour';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';

function useDiscovered(memberId: string) {
  const activity = useRumila((s) => s.activity);
  const key = `rumila-kebun-${memberId}`;
  const [local, setLocal] = useState<string[]>([]);
  useEffect(() => {
    try {
      setLocal(JSON.parse(localStorage.getItem(key) ?? '[]'));
    } catch {
      setLocal([]);
    }
  }, [key]);
  const set = useMemo(() => {
    const s = new Set(local.filter((id) => FRUIT_BY_ID.has(id)));
    for (const a of activity) if (a.memberId === memberId && a.toolId === TOOL_ID && a.event === 'material_complete' && a.partId && FRUIT_BY_ID.has(a.partId)) s.add(a.partId);
    return s;
  }, [activity, local, memberId]);
  const add = (id: string) => {
    useRumila.getState().completeToolItem(memberId, TOOL_ID, PERM, id);
    setLocal((l) => {
      if (l.includes(id)) return l;
      const next = [...l, id];
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  return [set, add] as const;
}

/** URL rekaman buah (dari manifest suara), bila ada. */
function useTracks() {
  const [tracks, setTracks] = useState<Record<string, string>>({});
  useEffect(() => {
    import('@/lib/fruits/audio').then(({ readAudioManifest }) =>
      fetch('/fruits/audio/manifest.json', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((m) => m && setTracks(readAudioManifest(m).tracks))
        .catch(() => {}),
    );
  }, []);
  return tracks;
}

/** Joystick bulat di kiri bawah (jempol kiri). */
function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const id = useRef<number | null>(null);
  const R = 46;
  const update = (e: React.PointerEvent) => {
    const r = base.current!.getBoundingClientRect();
    let x = e.clientX - (r.left + r.width / 2),
      y = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(x, y);
    if (d > R) {
      x = (x / d) * R;
      y = (y / d) * R;
    }
    setKnob({ x, y });
    onMove(x / R, -y / R);
  };
  const end = () => {
    id.current = null;
    setKnob({ x: 0, y: 0 });
    onMove(0, 0);
  };
  return (
    <div
      ref={base}
      className="pointer-events-auto relative size-[132px] touch-none rounded-full select-none"
      style={{ background: 'radial-gradient(circle, rgba(255,255,255,.55), rgba(255,255,255,.25))', boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.8), 0 4px 14px rgba(43,29,78,.15)' }}
      onPointerDown={(e) => {
        id.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e);
      }}
      onPointerMove={(e) => id.current === e.pointerId && update(e)}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="Tombol arah untuk berjalan"
      role="application"
    >
      <span
        className="absolute top-1/2 left-1/2 size-[62px] rounded-full"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`, background: 'linear-gradient(155deg,#ffb347,#ff7a1a 60%)', boxShadow: '0 4px 0 #c85400' }}
      />
    </div>
  );
}

function FruitCard({ id, isNew, url, onClose, on3D }: { id: string; isNew: boolean; url?: string; onClose: () => void; on3D: () => void }) {
  const f = FRUIT_BY_ID.get(id)!;
  const art = FRUIT_ARTWORK[id];
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = sharedAudio('fruit');
    a.onended = a.onpause = () => setPlaying(false);
    a.onplay = () => setPlaying(true);
    if (url) {
      a.src = url;
      a.play().catch(() => setPlaying(false));
    }
    return () => a.pause();
  }, [url]);

  const chips: [string, string][] = [
    ['palette', f.skin],
    ['nutrition', f.flesh],
    ['sentiment_satisfied', f.taste],
  ];
  return (
    <div className="pointer-events-auto absolute inset-0 z-20 flex items-end justify-center bg-[rgba(43,29,78,.35)] p-3 sm:items-center" onClick={onClose}>
      <div className="garden-pop relative w-full max-w-[560px] rounded-[30px] bg-white p-4 pt-3 shadow-[0_8px_0_rgba(43,29,78,.15)] sm:p-5" onClick={(e) => e.stopPropagation()} style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
        {isNew && (
          <span className="absolute inset-x-0 -top-5 flex justify-center">
            <span className="garden-new rounded-full px-4 py-1.5 whitespace-nowrap text-white" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, background: 'linear-gradient(155deg,#6fe39a,#1fbf62 60%)', boxShadow: '0 3px 0 #12904a' }}>
              Buah baru ditemukan!
            </span>
          </span>
        )}
        <button onClick={onClose} aria-label="Tutup" className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-[#f5f0fa] text-[#2b1d4e] active:scale-90">
          <Icon name="close" size={26} />
        </button>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative size-[132px] shrink-0 overflow-hidden rounded-[24px] bg-[#fff6e4] sm:size-[160px]">
            {art && <Image src={art.src} alt={art.alt} fill sizes="160px" unoptimized className="object-contain p-1.5" />}
          </div>
          <div className="min-w-0 flex-1 pr-8">
            <div style={{ fontFamily: BALOO, fontSize: 32, fontWeight: 800, color: INK, lineHeight: 1 }}>{f.name}</div>
            <p className="mt-1.5 text-[15px] leading-snug font-extrabold text-[#6b5d80]">{f.description.split('. ')[0].replace(/\.$/, '')}.</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map(([icon, text]) => (
            <span key={icon} className="flex items-center gap-1 rounded-full bg-[#fff4e0] px-2.5 py-1 text-[13px] font-extrabold text-[#8a5a12]">
              <Icon name={icon} size={16} />
              {text}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2 rounded-[18px] bg-[#fff8dc] p-3">
          <Icon name="lightbulb" size={22} className="shrink-0 text-[#d99400]" />
          <p className="text-[14px] leading-snug font-bold text-[#7a5b12]">
            <b>Tahukah kamu?</b> {f.fact}
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          {url && (
            <button
              onClick={() => {
                const a = sharedAudio('fruit');
                if (playing) a.pause();
                else {
                  a.currentTime = 0;
                  void a.play().catch(() => {});
                }
              }}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[18px] text-white active:scale-95"
              style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, background: 'linear-gradient(155deg,#5ce8d6,#12b8a6 60%)', boxShadow: '0 4px 0 #0a8a7c' }}
            >
              <Icon name={playing ? 'stop' : 'volume_up'} size={28} />
              {playing ? 'Berhenti' : 'Dengar'}
            </button>
          )}
          <button
            onClick={on3D}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[18px] text-white active:scale-95"
            style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, background: 'linear-gradient(155deg,#c78bff,#8b45f5 60%)', boxShadow: '0 4px 0 #5a1fc0' }}
          >
            <Icon name="view_in_ar" size={28} />
            Lihat 3D
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KidGarden({ active, tour, onOpen3D, onCatalog, onTour, onTourEnd }: { active: boolean; tour: boolean; onOpen3D: (id: string) => void; onCatalog: () => void; onTour: () => void; onTourEnd: () => void }) {
  const tourHandle = useRef<TourHandle | null>(null);
  const router = useRouter();
  const me = useMe();
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<GardenEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState<string | null>(null);
  const [card, setCard] = useState<{ id: string; isNew: boolean } | null>(null);
  const [found, addFound] = useDiscovered(me.id);
  const tracks = useTracks();
  const foundRef = useRef(found);
  foundRef.current = found;

  const openCard = (id: string) => {
    unlockAudio();
    const isNew = !foundRef.current.has(id);
    if (isNew) {
      addFound(id);
      engine.current?.pick(id);
    }
    setCard({ id, isNew });
  };
  const openRef = useRef(openCard);
  openRef.current = openCard;

  useEffect(() => {
    let alive = true;
    import('./engine').then(({ GardenEngine }) => {
      if (!alive || !host.current) return;
      engine.current = new GardenEngine(host.current, {
        onNear: (id) => setNear(id),
        onArrive: (key) => (tourHandle.current ? tourHandle.current.arrived(key) : openRef.current(key)),
      });
      engine.current.setDiscovered(foundRef.current);
      if (process.env.NODE_ENV === 'development') (window as unknown as { __garden?: GardenEngine }).__garden = engine.current;
      setReady(true);
    });
    return () => {
      alive = false;
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  useEffect(() => engine.current?.setDiscovered(found), [found, ready]);
  useEffect(() => engine.current?.setActive(active && !card), [active, card, ready]);

  // ketuk layar (bukan geser) → jalan ke titik / tanaman
  const down = useRef<{ x: number; y: number; t: number } | null>(null);
  const nearFruit = near ? FRUIT_BY_ID.get(near) : undefined;
  const nearFound = near ? found.has(near) : false;

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ background: '#bfe6ff', fontFamily: 'var(--ff-nunito), system-ui, sans-serif' }}>
      <div
        ref={host}
        className="absolute inset-0"
        onPointerDown={(e) => (down.current = { x: e.clientX, y: e.clientY, t: performance.now() })}
        onPointerUp={(e) => {
          const d = down.current;
          down.current = null;
          if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 12 && performance.now() - d.t < 500) engine.current?.tap(e.clientX, e.clientY);
        }}
      />
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(#8fd3ff, #d8f3c4)' }}>
          <span className="ms animate-bounce text-[64px] text-[#1fbf62]">park</span>
          <span style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK }}>Menyiapkan kebun…</span>
        </div>
      )}

      {/* atas: kembali · keranjang · tur & katalog */}
      <div className={`pointer-events-none absolute ${tour ? 'hidden' : ''}`} style={{ inset: 0 }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-5" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <RoundBtn icon="arrow_back" label="Kembali" onClick={() => router.push('/beranda/angkasa')} />
        <div className="mt-1 flex items-center gap-2 rounded-full bg-white/95 py-1.5 pr-4 pl-1.5 shadow-[0_4px_0_rgba(43,29,78,.12)]">
          <span className="flex size-10 items-center justify-center rounded-full" style={{ background: 'linear-gradient(155deg,#ffe46b,#ffbe0b 60%)' }}>
            <Icon name="shopping_basket" size={24} className="text-[#8a5a12]" />
          </span>
          <span style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK, lineHeight: 1 }}>
            {found.size}
            <span className="text-[16px] text-[#8a7a9c]">/{FRUITS.length}</span>
          </span>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <RoundBtn icon="grid_view" label="Semua buah" onClick={onCatalog} />
          <RoundBtn icon="play_circle" label="Tur" tone="orange" onClick={onTour} />
        </div>
      </div>

      {/* bawah: joystick · tombol lihat buah terdekat */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6" style={{ paddingBottom: 'max(18px, env(safe-area-inset-bottom))' }}>
        <Joystick onMove={(x, y) => engine.current?.setStick(x, y)} />
        {nearFruit && !card && (
          <button
            onClick={() => openCard(nearFruit.id)}
            className="garden-bob pointer-events-auto flex items-center gap-2 rounded-full bg-white p-2 pr-5 shadow-[0_6px_0_rgba(43,29,78,.18)] active:scale-95"
          >
            <span className="relative flex size-[64px] items-center justify-center overflow-hidden rounded-full" style={{ background: nearFound ? '#fff6e4' : 'linear-gradient(155deg,#ffb347,#ff7a1a 60%)' }}>
              {nearFound ? <Image src={FRUIT_ARTWORK[nearFruit.id].thumb} alt="" width={64} height={64} unoptimized /> : <span className="text-[38px] font-black text-white">?</span>}
            </span>
            <span className="text-left">
              <span className="block text-[13px] font-extrabold text-[#8a7a9c]">{nearFound ? nearFruit.name : 'Ada buah!'}</span>
              <span className="block" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK, lineHeight: 1 }}>
                {nearFound ? 'Lihat lagi' : 'Petik!'}
              </span>
            </span>
          </button>
        )}
        <span className="w-[1px]" />
      </div>

      </div>
      {tour && ready && engine.current && (
        <GardenTour
          engine={engine.current}
          handle={tourHandle}
          onVisit={(id) => {
            if (!foundRef.current.has(id)) {
              addFound(id);
              engine.current?.pick(id);
            }
          }}
          onClose={onTourEnd}
        />
      )}
      {card && <FruitCard id={card.id} isNew={card.isNew} url={tracks[card.id]} onClose={() => setCard(null)} on3D={() => onOpen3D(card.id)} />}
      {card?.isNew && <Confetti key={card.id} />}
    </div>
  );
}

/** Hujan konfeti singkat saat menemukan buah baru. */
function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: (i * 37) % 100,
        delay: (i % 9) * 0.06,
        color: ['#ff7a1a', '#ffbe0b', '#1fbf62', '#2f86ff', '#ff4fa3', '#8b45f5'][i % 6],
        rot: (i * 53) % 360,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden>
      {bits.map((b, i) => (
        <span key={i} className="garden-confetti absolute top-0 block h-3.5 w-2 rounded-[2px]" style={{ left: `${b.left}%`, background: b.color, animationDelay: `${b.delay}s`, transform: `rotate(${b.rot}deg)` }} />
      ))}
    </div>
  );
}
