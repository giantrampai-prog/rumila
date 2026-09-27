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
import { preloadAnimalSounds, sfx, startGardenAmbience, stopGardenAmbience } from '@/lib/sfx';
import { FRUITS, FRUIT_BY_ID } from '@/lib/fruits/catalog';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import { PERM, TOOL_ID } from '@/lib/fruits/progress';
import { useMe, useRumila } from '@/lib/store';
import type { GardenEngine } from './engine';
import { GardenTour, type TourHandle } from './tour';
import { CutView } from './cut-view';
import { Album, MissionSheet, NearAction, SeedPicker, Toast, bedAction, missionById, nextMission, useFarm } from './farm-ui';
import { bedStatus, missionMatches, plantBed, waterBed, emptyBed } from '@/lib/fruits/farm';

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

/** Foto buah yang "hidup": nongol memantul, melayang pelan, berkilau; diketuk → melompat (boing!). */
function AnimatedFruit({ src, alt }: { src: string; alt: string }) {
  const [boing, setBoing] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => sfx.sparkle(), 350);
    return () => window.clearTimeout(t);
  }, [src]);
  const stars: [string, string, string, number][] = [
    ['8%', '12%', '0s', 16],
    ['80%', '6%', '.5s', 12],
    ['88%', '62%', '1s', 18],
    ['4%', '70%', '1.4s', 12],
    ['46%', '-4%', '.9s', 10],
  ];
  return (
    <button
      type="button"
      aria-label={`Ketuk ${alt}`}
      onClick={() => {
        setBoing((b) => b + 1);
        sfx.pick();
      }}
      className="relative size-[132px] shrink-0 sm:size-[160px]"
    >
      <span className="fruit-glow absolute inset-2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,214,120,.75), rgba(255,214,120,0) 70%)' }} />
      <span className="absolute inset-0 overflow-hidden rounded-[24px] bg-[#fff6e4]">
        <span className="fruit-shine pointer-events-none absolute -inset-y-6 left-0 z-10 w-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent)' }} />
      </span>
      <span className="fruit-nongol absolute inset-0 block">
        <span className="fruit-float absolute inset-0 block">
          <span key={boing} className={`absolute inset-0 block ${boing ? 'fruit-boing' : ''}`}>
            <Image src={src} alt={alt} fill sizes="160px" unoptimized className="object-contain p-1.5 drop-shadow-[0_8px_8px_rgba(80,40,0,.25)]" />
          </span>
        </span>
      </span>
      {stars.map(([l, t, d, sz], i) => (
        <span key={i} className="fruit-twinkle pointer-events-none absolute z-20 text-[#ffbe0b]" style={{ left: l, top: t, animationDelay: d, fontSize: sz, lineHeight: 1 }}>
          ✦
        </span>
      ))}
    </button>
  );
}

function FruitCard({ id, isNew, url, onClose, onCut }: { id: string; isNew: boolean; url?: string; onClose: () => void; onCut: () => void }) {
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
          {art && <AnimatedFruit src={art.src} alt={art.alt} />}
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
            onClick={onCut}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[18px] text-white active:scale-95"
            style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, background: 'linear-gradient(155deg,#ffb347,#ff7a1a 60%)', boxShadow: '0 4px 0 #c85400' }}
          >
            <Icon name="content_cut" size={26} />
            Belah
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KidGarden({ active, tour, onCatalog, onTour, onTourEnd }: { active: boolean; tour: boolean; onCatalog: () => void; onTour: () => void; onTourEnd: () => void }) {
  const tourHandle = useRef<TourHandle | null>(null);
  const router = useRouter();
  const me = useMe();
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<GardenEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState<string | null>(null);
  const [goatsOut, setGoatsOut] = useState(false);
  const [card, setCard] = useState<{ id: string; isNew: boolean } | null>(null);
  const [found, addFound] = useDiscovered(me.id);
  const tracks = useTracks();
  const foundRef = useRef(found);
  foundRef.current = found;
  const [farm, setFarm] = useFarm(me.id);
  const farmRef = useRef(farm);
  farmRef.current = farm;
  const [sheet, setSheet] = useState<null | { kind: 'seed'; bed: number } | { kind: 'mission' } | { kind: 'album' }>(null);
  const [cut, setCut] = useState<{ id: string; harvested: boolean } | null>(null);
  const [toast, setToast] = useState<{ text: string; good?: boolean } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [offer, setOffer] = useState<string>(() => nextMission([]).id);
  const say = (text: string, good?: boolean) => {
    setToast({ text, good });
    window.setTimeout(() => setToast((t) => (t?.text === text ? null : t)), 3200);
  };
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  const openCard = (id: string) => {
    unlockAudio();
    const isNew = !foundRef.current.has(id);
    // misi Pak Tani: buah yang dipetik cocok?
    const m = missionById(farmRef.current.mission);
    const fruit = FRUIT_BY_ID.get(id)!;
    if (m) {
      if (missionMatches(m, fruit)) {
        setFarm((s) => ({ ...s, mission: null, done: s.done + 1, recent: [m.id, ...s.recent].slice(0, 4), stars: s.stars.includes(id) ? s.stars : [...s.stars, id] }));
        setOffer(nextMission([m.id, ...farmRef.current.recent]).id);
        sfx.celebrate(0.2);
        say(`Hore! ${fruit.name} cocok. Misi Pak Tani selesai! 🤝`, true);
      } else say(`Hmm, ${fruit.name} belum cocok. ${m.text}`);
    }
    sfx.pick();
    if (isNew) {
      addFound(id);
      engine.current?.pick(id);
      // buah terbang ke keranjang → berdenting → jingle temuan baru
      sfx.whoosh();
      sfx.coin(0.75);
      sfx.celebrate(0.95);
    } else sfx.open();
    setCard({ id, isNew });
  };
  const openRef = useRef(openCard);
  openRef.current = openCard;

  /** Aksi bedengan: tanam / siram / panen (dari tombol atau saat tiba di bedengan). */
  const bedAct = (i: number) => {
    unlockAudio();
    const b = farmRef.current.beds[i];
    const st = bedStatus(b, Date.now());
    if (st.empty) {
      sfx.open();
      setSheet({ kind: 'seed', bed: i });
    } else if (st.thirsty) {
      sfx.water();
      engine.current?.waterFx(i);
      setFarm((s) => ({ ...s, beds: s.beds.map((x, k) => (k === i ? waterBed(x, Date.now()) : x)) }));
    } else if (st.ripe) {
      const id = b.fruit!;
      sfx.pick();
      sfx.whoosh();
      sfx.coin(0.75);
      sfx.celebrate(0.95);
      engine.current?.harvestFx(i, FRUIT_BY_ID.get(id)!.color);
      if (!foundRef.current.has(id)) addFound(id);
      setFarm((s) => ({ ...s, beds: s.beds.map((x, k) => (k === i ? emptyBed() : x)) }));
      setCut({ id, harvested: true });
    } else say('Tanamannya sedang tumbuh. Tunggu sebentar, ya!');
  };
  const arriveKey = (key: string) => {
    if (key.startsWith('bed:')) bedAct(+key.slice(4));
    else if (key === 'npc') openMission();
    else if (key === 'goats') setGoatsOut(engine.current?.toggleGoats() ?? false);
    else if (key === 'tower') engine.current?.climbTower();
    else openRef.current(key);
  };
  const arriveRef = useRef(arriveKey);
  arriveRef.current = arriveKey;
  const openMission = () => {
    sfx.open();
    if (farmRef.current.mission) say(`Misi: ${missionById(farmRef.current.mission)!.text}`);
    else setSheet({ kind: 'mission' });
  };

  useEffect(() => {
    let alive = true;
    import('./engine').then(({ GardenEngine }) => {
      if (!alive || !host.current) return;
      engine.current = new GardenEngine(host.current, {
        onNear: (id) => {
          setNear(id);
          if (id && !id.includes(':') && id !== 'npc' && !foundRef.current.has(id) && !tourHandle.current) sfx.sparkle();
        },
        onArrive: (key) => (tourHandle.current ? tourHandle.current.arrived(key) : arriveRef.current(key)),
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
  useEffect(() => engine.current?.setActive(active && !card && !cut), [active, card, cut, ready]);
  // bedengan & tanda misi di dunia 3D
  useEffect(() => {
    engine.current?.setBeds(farm.beds.map((b) => ({ fruit: b.fruit, stage: b.stage, ...bedStatus(b, now) })));
  }, [farm.beds, now, ready]);
  useEffect(() => engine.current?.setMissionAvailable(!farm.mission && !tour), [farm.mission, tour, ready]);
  // suasana kebun (kicau burung & angin) selama kebun tampil
  useEffect(() => {
    if (!active) return;
    preloadAnimalSounds();
    startGardenAmbience();
    return () => stopGardenAmbience();
  }, [active]);

  // ketuk layar (bukan geser) → jalan ke titik / tanaman
  const down = useRef<{ x: number; y: number; t: number } | null>(null);
  const nearFruit = near ? FRUIT_BY_ID.get(near) : undefined;
  const nearBed = near?.startsWith('bed:') ? +near.slice(4) : null;
  const activeMission = missionById(farm.mission);
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
          <RoundBtn icon="auto_stories" label="Album" onClick={() => setSheet({ kind: 'album' })} />
          <RoundBtn icon="play_circle" label="Tur" tone="orange" onClick={onTour} />
        </div>
      </div>

      {activeMission && (
        <div className="pointer-events-none absolute inset-x-0 top-[84px] flex justify-center px-3 sm:top-[96px]">
          <span className="flex max-w-[560px] items-center gap-1.5 rounded-full bg-[#fff8dc]/95 px-3 py-1.5 text-[13px] font-extrabold text-[#5a4410] shadow-[0_3px_0_rgba(43,29,78,.1)] sm:text-[14px]">
            <span>👨‍🌾</span>
            {activeMission.text}
          </span>
        </div>
      )}
      {toast && <Toast text={toast.text} good={toast.good} />}
      {/* istirahat: layar meredup seperti malam, lalu terang kembali */}
      {near === 'resting' && (
        <div className="garden-pop pointer-events-none absolute inset-0 z-10 flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, rgba(20,24,70,.35), rgba(10,12,40,.7))' }}>
          <span className="rounded-full bg-white/90 px-5 py-2" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK }}>
            Zzz… istirahat sebentar 😴
          </span>
        </div>
      )}

      {/* kanan: zoom & kembalikan sudut kamera (bisa juga cubit dua jari / geser layar) */}
      {!tour && (
        <div className="pointer-events-auto absolute right-3 flex flex-col gap-2 sm:right-5" style={{ top: '38%' }}>
          {(
            [
              ['add', 'Perbesar', () => engine.current?.zoomStep(1)],
              ['remove', 'Perkecil', () => engine.current?.zoomStep(-1)],
              ['explore', 'Sudut awal', () => engine.current?.resetView()],
            ] as const
          ).map(([icon, label, fn]) => (
            <button key={icon} aria-label={label} onClick={fn} className="flex size-12 items-center justify-center rounded-full bg-white/90 text-[#2b1d4e] shadow-[0_4px_0_rgba(0,0,0,.18)] active:scale-90">
              <span className="ms text-[26px]">{icon}</span>
            </button>
          ))}
        </div>
      )}

      {/* bawah: joystick · tombol lihat buah terdekat */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6" style={{ paddingBottom: 'max(18px, env(safe-area-inset-bottom))' }}>
        {near === 'tower-top' ? <span /> : <Joystick onMove={(x, y) => engine.current?.setStick(x, y)} />}
        {nearBed !== null && !card && !sheet && !cut && (() => {
          const a = bedAction(farm.beds[nearBed], now);
          return <NearAction {...a} onClick={() => bedAct(nearBed)} />;
        })()}
        {near === 'bed' && !card && !sheet && (
          <NearAction icon="bedtime" label="Istirahat" sub="Tempat tidur" tone="linear-gradient(155deg,#9a93ff,#5b4bff 60%)" onClick={() => engine.current?.rest()} />
        )}
        {near === 'tower' && !card && !sheet && (
          <NearAction icon="stairs" label="Naik menara" sub="Kincir angin" tone="linear-gradient(155deg,#ffb347,#ff7a1a 60%)" onClick={() => engine.current?.climbTower()} />
        )}
        {near === 'tower-top' && (
          <NearAction
            icon="south"
            label="Turun"
            sub="Geser layar untuk melihat sekeliling"
            tone="linear-gradient(155deg,#7cc0ff,#2f86ff 60%)"
            onClick={() => {
              engine.current?.leaveTower();
              setNear('tower');
            }}
          />
        )}
        {near === 'goats' && !card && !sheet && (
          <NearAction
            icon={goatsOut ? 'home' : 'door_open'}
            label={goatsOut ? 'Panggil pulang' : 'Buka kandang'}
            sub="Kandang kambing"
            tone={goatsOut ? 'linear-gradient(155deg,#7cc0ff,#2f86ff 60%)' : 'linear-gradient(155deg,#c08a4a,#8a5a2a 60%)'}
            onClick={() => setGoatsOut(engine.current?.toggleGoats() ?? false)}
          />
        )}
        {near === 'npc' && !card && !sheet && (
          <NearAction icon="campaign" label={activeMission ? 'Lihat misi' : 'Misi baru!'} sub="Pak Tani" tone="linear-gradient(155deg,#ffe46b,#ffbe0b 60%)" onClick={openMission} />
        )}
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
              sfx.whoosh();
              sfx.coin(0.75);
            }
          }}
          onClose={onTourEnd}
        />
      )}
      {card && (
        <FruitCard
          id={card.id}
          isNew={card.isNew}
          url={tracks[card.id]}
          onClose={() => {
            sfx.close();
            setCard(null);
          }}
          onCut={() => {
            setCut({ id: card.id, harvested: false });
            setCard(null);
          }}
        />
      )}
      {cut && (
        <CutView
          id={cut.id}
          harvested={cut.harvested}
          onClose={() => {
            sfx.close();
            setCut(null);
          }}
        />
      )}
      {cut?.harvested && <Confetti key={`h-${cut.id}`} />}
      {sheet?.kind === 'seed' && (
        <SeedPicker
          found={found}
          onClose={() => setSheet(null)}
          onPick={(id) => {
            const i = sheet.bed;
            sfx.plant();
            setFarm((s) => ({ ...s, beds: s.beds.map((x, k) => (k === i ? plantBed(id) : x)) }));
            setSheet(null);
            say(`Benih ${FRUIT_BY_ID.get(id)!.name} ditanam. Sekarang siram, ya! 💧`, true);
          }}
        />
      )}
      {sheet?.kind === 'mission' && (
        <MissionSheet
          mission={missionById(offer)!}
          done={farm.done}
          onClose={() => setSheet(null)}
          onSwap={() => {
            sfx.tap();
            setOffer(nextMission([offer, ...farm.recent]).id);
          }}
          onAccept={() => {
            sfx.celebrate();
            setFarm((s) => ({ ...s, mission: offer }));
            setSheet(null);
          }}
        />
      )}
      {sheet?.kind === 'album' && (
        <Album
          found={found}
          stars={farm.stars}
          onClose={() => setSheet(null)}
          onCatalog={() => {
            setSheet(null);
            onCatalog();
          }}
          onOpen={(f) => {
            setSheet(null);
            sfx.open();
            setCard({ id: f.id, isNew: false });
          }}
        />
      )}
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
