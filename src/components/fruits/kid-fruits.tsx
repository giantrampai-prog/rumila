'use client';

// Kebun Buah versi anak: katalog ringkas (tombol kelompok + kartu buah kecil) dan detail 3D penuh layar
// dengan kartu singkat (nama, satu kalimat, ciri-ciri bergambar), panah ganti buah, dan tombol Dengar
// bila rekaman buah tersedia. Data, model 3D, dan progres sama dengan tampilan lengkap.

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { installAudioUnlock, sharedAudio, unlockAudio } from '@/lib/audio-unlock';
import { TUR_BUAH, TUR_BUAH_AUDIO, buahDwell } from '@/lib/fruits/tur';
import { FRUITS, FRUIT_BY_ID, FRUIT_GROUPS, type Fruit } from '@/lib/fruits/catalog';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import { readAudioManifest } from '@/lib/fruits/audio';
import { useFruitSession } from '@/lib/fruits/progress';
import { useMe } from '@/lib/store';
import './fruits.css';

const Viewer = dynamic(() => import('./fruit-viewer'), { ssr: false, loading: () => <div className="absolute inset-0" /> });

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';
const GROUP_ICON: Record<string, string> = { all: 'apps', sehari: 'home', nusantara: 'forest', toko: 'storefront' };

/** URL rekaman buah (dari manifest suara), bila ada. */
function useFruitAudio(id: string | null) {
  const [tracks, setTracks] = useState<Record<string, string>>({});
  useEffect(() => {
    fetch('/fruits/audio/manifest.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => m && setTracks(readAudioManifest(m).tracks))
      .catch(() => {});
  }, []);
  return id ? tracks[id] : undefined;
}

function Catalog({ onOpen, onTour }: { onOpen: (id: string) => void; onTour: () => void }) {
  const router = useRouter();
  const [group, setGroup] = useState('all');
  const list = useMemo(() => FRUITS.filter((f) => group === 'all' || f.group === group), [group]);
  return (
    <div className="theme-play bg-dots min-h-dvh" style={{ fontFamily: 'var(--ff-nunito), system-ui, sans-serif' }}>
      <div className="mx-auto flex max-w-[1080px] flex-col gap-4 px-4 pb-10 sm:px-6" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <header className="flex items-center gap-3">
          <RoundBtn icon="arrow_back" label="Kembali" onClick={() => router.push('/beranda/edukasi')} />
          <h1 style={{ fontFamily: BALOO, fontSize: 28, fontWeight: 800, color: INK, lineHeight: 1 }}>Kebun Buah</h1>
          <span className="ml-auto" />
          <RoundBtn icon="play_circle" label="Tur" tone="orange" onClick={onTour} />
        </header>
        {/* kelompok buah: geser bila tidak muat */}
        <div className="-mx-4 overflow-x-auto px-4 pb-1">
          <div className="flex w-max gap-2">
            {FRUIT_GROUPS.map((g) => {
              const on = group === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setGroup(g.id)}
                  aria-pressed={on}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-extrabold transition-transform active:scale-95"
                  style={on ? { background: 'linear-gradient(155deg,#9a93ff,#5b4bff 60%)', color: '#fff', boxShadow: '0 3px 0 #3a2cd1' } : { background: '#fff', color: INK, boxShadow: '0 3px 0 rgba(43,29,78,.08)' }}
                >
                  <Icon name={GROUP_ICON[g.id] ?? 'nutrition'} size={18} />
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {list.map((f, i) => (
            <button key={f.id} onClick={() => onOpen(f.id)} className="flex flex-col items-center gap-1 rounded-[22px] bg-white p-2 pb-2.5 shadow-[0_4px_0_rgba(43,29,78,.07)] transition-transform active:scale-95">
              <Image src={FRUIT_ARTWORK[f.id].thumb} alt="" width={256} height={256} unoptimized priority={i < 8} className="aspect-square w-full rounded-[16px] bg-[#fff8ee] object-contain" />
              <span className="text-center" style={{ fontFamily: BALOO, fontSize: 15, fontWeight: 800, color: INK, lineHeight: 1.1 }}>
                {f.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Detail({ fruit, onBack, onOpen }: { fruit: Fruit; onBack: () => void; onOpen: (id: string) => void }) {
  const url = useFruitAudio(fruit.id);
  const [playing, setPlaying] = useState(false);
  const i = FRUITS.findIndex((f) => f.id === fruit.id);
  const go = (d: number) => onOpen(FRUITS[(i + d + FRUITS.length) % FRUITS.length].id);

  // Rekaman diputar otomatis saat buah dibuka (elemen audio bersama yang sudah dibuka kuncinya).
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
    ['palette', fruit.skin],
    ['nutrition', fruit.flesh],
    ['sentiment_satisfied', fruit.taste],
  ];
  return (
    <div className="fruit-kid fixed inset-0 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 42%, #fffdf6 0%, #fdf0d8 55%, #f6d9b8 100%)' }}>
      <Viewer fruit={fruit} />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="flex items-start justify-between gap-2">
          <RoundBtn icon="grid_view" label="Semua buah" onClick={onBack} />
          <RoundBtn icon="shuffle" label="Pilihkan" tone="orange" onClick={() => go(1 + Math.floor(Math.random() * (FRUITS.length - 1)))} />
        </div>
        <div className="pointer-events-auto mx-auto flex w-full max-w-[640px] items-center gap-2 rounded-[26px] bg-white/95 p-3 shadow-[0_6px_0_rgba(43,29,78,.12)] sm:gap-3 sm:p-4">
          <button onClick={() => go(-1)} aria-label="Buah sebelumnya" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f5f0fa] text-[#2b1d4e] active:scale-90">
            <Icon name="chevron_left" size={30} />
          </button>
          <div className="min-w-0 flex-1">
            <div style={{ fontFamily: BALOO, fontSize: 30, fontWeight: 800, color: INK, lineHeight: 1 }}>{fruit.name}</div>
            <p className="mt-1 text-[15px] leading-snug font-extrabold text-[#6b5d80] sm:text-[17px]">{fruit.description.split('. ')[0].replace(/\.$/, '')}.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chips.map(([icon, text]) => (
                <span key={icon} className="flex items-center gap-1 rounded-full bg-[#fff4e0] px-2.5 py-1 text-[12px] font-extrabold text-[#8a5a12]">
                  <Icon name={icon} size={15} />
                  {text}
                </span>
              ))}
            </div>
          </div>
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
              aria-label={playing ? 'Berhenti' : 'Dengarkan'}
              className="flex size-[58px] shrink-0 items-center justify-center rounded-full text-white active:scale-90"
              style={{ background: 'linear-gradient(155deg,#5ce8d6,#12b8a6 60%)', boxShadow: '0 4px 0 #0a8a7c' }}
            >
              <Icon name={playing ? 'stop' : 'volume_up'} size={32} />
            </button>
          )}
          <button onClick={() => go(1)} aria-label="Buah berikutnya" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f5f0fa] text-[#2b1d4e] active:scale-90">
            <Icon name="chevron_right" size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Tur bernarasi: semua buah tampil satu per satu (berputar pelan) mengikuti narasi. */
function Tour({ onClose }: { onClose: () => void }) {
  const [ui, setUi] = useState({ i: 0, playing: true, finished: false, progress: 0 });
  const r = useRef({ i: 0, t: 0, playing: true });
  const part = (i: number) => TUR_BUAH_AUDIO.find((p) => i >= p.first && i < p.first + p.cues.length);

  const go = (i: number) => {
    r.current.i = i;
    r.current.t = 0;
    const p = part(i);
    if (p) {
      const a = sharedAudio('fruit-tur');
      if (!a.src.endsWith(p.src)) a.src = p.src;
      const seek = () => (a.currentTime = p.cues[i - p.first]);
      if (a.readyState >= 1) seek();
      else a.onloadedmetadata = seek;
    }
    setUi((x) => ({ ...x, i, finished: false, progress: 0 }));
  };
  const play = (on: boolean) => {
    r.current.playing = on;
    if (!on) sharedAudio('fruit-tur').pause();
    setUi((x) => ({ ...x, playing: on }));
  };

  useEffect(() => {
    go(0);
    let raf = 0,
      last = performance.now(),
      lastUi = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = r.current;
      if (!s.playing) return;
      const p = part(s.i);
      let dur = buahDwell(TUR_BUAH[s.i]);
      if (p) {
        const a = sharedAudio('fruit-tur');
        if (a.paused && !a.ended) a.play().catch(() => {});
        const k = s.i - p.first;
        const ct = a.currentTime;
        const end = p.cues[k + 1] ?? a.duration;
        dur = Math.max(1, (Number.isFinite(end) ? end : ct + 1) - p.cues[k]);
        s.t = ct - p.cues[k];
        if (p.cues[k + 1] !== undefined && ct >= p.cues[k + 1]) return go(s.i + 1);
        if (a.ended) s.t = dur;
      } else s.t += dt;
      if (s.t >= dur) {
        if (s.i < TUR_BUAH.length - 1) return go(s.i + 1);
        s.playing = false;
        sharedAudio('fruit-tur').pause();
        setUi((x) => ({ ...x, playing: false, finished: true, progress: 1 }));
        return;
      }
      if (now - lastUi > 250) {
        lastUi = now;
        setUi((x) => ({ ...x, progress: Math.min(1, s.t / dur) }));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      sharedAudio('fruit-tur').pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stop = TUR_BUAH[ui.i];
  const fruit = FRUIT_BY_ID.get(stop.fruit)!;
  const caption = TUR_BUAH_AUDIO.length === 0 ? stop.lines[Math.min(stop.lines.length - 1, Math.floor(ui.progress * stop.lines.length))] : null;
  return (
    <div className="fruit-kid fixed inset-0 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 42%, #fffdf6 0%, #fdf0d8 55%, #f6d9b8 100%)' }}>
      <Viewer fruit={fruit} spin />
      <div className="absolute inset-0" onClick={() => !ui.finished && play(!ui.playing)}>
        {/* progres: satu garis panjang (50 adegan terlalu banyak untuk segmen) */}
        <div className="absolute inset-x-0 top-0 px-3" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }} aria-hidden>
          <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(43,29,78,.12)]">
            <div className="h-full rounded-full bg-[#ff7a1a] transition-[width] duration-300" style={{ width: `${((ui.i + ui.progress) / TUR_BUAH.length) * 100}%` }} />
          </div>
        </div>
        <div className="absolute left-3 flex items-center gap-2 sm:left-5" style={{ top: 'max(22px, calc(env(safe-area-inset-top) + 14px))' }}>
          <span className="rounded-full bg-white/90 px-4 py-2 shadow-[0_3px_0_rgba(43,29,78,.08)]" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK }}>
            {stop.title}
          </span>
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-[12px] font-extrabold text-[#8a7a9c]">
            {ui.i + 1}/{TUR_BUAH.length}
          </span>
        </div>
        <div className="absolute right-3 sm:right-5" style={{ top: 'max(20px, calc(env(safe-area-inset-top) + 12px))' }} onClick={(e) => e.stopPropagation()}>
          <RoundBtn icon="close" label="Keluar tur" onClick={onClose} />
        </div>
        {!ui.playing && (
          <div className="absolute inset-0 flex items-center justify-center gap-6" onClick={(e) => e.stopPropagation()}>
            {ui.finished ? (
              <>
                <RoundBtn
                  icon="replay"
                  label="Ulangi"
                  tone="orange"
                  onClick={() => {
                    play(true);
                    go(0);
                  }}
                />
                <RoundBtn icon="check" label="Selesai" tone="purple" onClick={onClose} />
              </>
            ) : (
              <RoundBtn icon="play_arrow" label="Lanjut" tone="orange" onClick={() => play(true)} />
            )}
          </div>
        )}
        {caption && ui.playing && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center px-4" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
            <p className="max-w-[640px] rounded-2xl bg-[rgba(43,29,78,.65)] px-4 py-2 text-center text-[15px] font-bold text-white sm:text-[17px]">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KidFruits() {
  const me = useMe();
  useFruitSession(me.id);
  const [selected, setSelected] = useState<string | null>(null);
  const [tour, setTour] = useState(false);
  const fruit = selected ? FRUIT_BY_ID.get(selected) : undefined;

  // ?buah=id di alamat: tombol kembali browser/HP menutup detail.
  useEffect(() => {
    installAudioUnlock();
    const read = () => {
      const id = new URL(window.location.href).searchParams.get('buah');
      setSelected(id && FRUIT_BY_ID.has(id) ? id : null);
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  const open = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('buah', id);
    if (!selected) window.history.pushState({ fruitDetail: true }, '', url);
    else window.history.replaceState(null, '', url);
    setSelected(id);
  };
  const back = () => {
    if (window.history.state?.fruitDetail) window.history.back();
    else {
      const url = new URL(window.location.href);
      url.searchParams.delete('buah');
      window.history.replaceState(null, '', url);
      setSelected(null);
    }
  };

  if (tour) return <Tour onClose={() => setTour(false)} />;
  return fruit ? (
    <Detail fruit={fruit} onBack={back} onOpen={open} />
  ) : (
    <Catalog
      onOpen={open}
      onTour={() => {
        unlockAudio(); // dari ketukan tombol: buka kunci audio iPad/iPhone
        setTour(true);
      }}
    />
  );
}
