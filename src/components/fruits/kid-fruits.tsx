'use client';

// Kebun Buah versi anak: kebun 3D untuk dijelajahi (garden/), katalog ringkas (tombol kelompok + kartu buah kecil) dan detail 3D penuh layar
// dengan kartu singkat (nama, satu kalimat, ciri-ciri bergambar), panah ganti buah, dan tombol Dengar
// bila rekaman buah tersedia. Data, model 3D, dan progres sama dengan tampilan lengkap.

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { installAudioUnlock, sharedAudio, unlockAudio } from '@/lib/audio-unlock';
import { unlockAudioContext } from '@/lib/segment-player';
import { FRUITS, FRUIT_BY_ID, FRUIT_GROUPS, type Fruit } from '@/lib/fruits/catalog';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import { readAudioManifest } from '@/lib/fruits/audio';
import { useFruitSession } from '@/lib/fruits/progress';
import { useMe } from '@/lib/store';
import './fruits.css';

const Viewer = dynamic(() => import('./fruit-viewer'), { ssr: false, loading: () => <div className="absolute inset-0" /> });
const Garden = dynamic(() => import('./garden/kid-garden'), { ssr: false, loading: () => <div className="fixed inset-0 bg-[#bfe6ff]" /> });

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

function Catalog({ onOpen, onTour, onBack }: { onOpen: (id: string) => void; onTour: () => void; onBack: () => void }) {
  const [group, setGroup] = useState('all');
  const list = useMemo(() => FRUITS.filter((f) => group === 'all' || f.group === group), [group]);
  return (
    <div className="theme-play bg-dots min-h-dvh" style={{ fontFamily: 'var(--ff-nunito), system-ui, sans-serif' }}>
      <div className="mx-auto flex max-w-[1080px] flex-col gap-4 px-4 pb-10 sm:px-6" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <header className="flex items-center gap-3">
          <RoundBtn icon="arrow_back" label="Kembali ke kebun" onClick={onBack} />
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
          <RoundBtn icon="park" label="Kembali ke kebun" onClick={onBack} />
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

export default function KidFruits() {
  const me = useMe();
  useFruitSession(me.id);
  const [selected, setSelected] = useState<string | null>(null);
  const [tour, setTour] = useState(false);
  const [catalog, setCatalog] = useState(false);
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

  const startTour = () => {
    unlockAudio(); // dari ketukan tombol: buka kunci audio iPad/iPhone
    unlockAudioContext(); // tur kebun memutar potongan narasi lewat Web Audio
    setCatalog(false);
    setTour(true);
  };
  const view = fruit ? 'detail' : catalog ? 'katalog' : 'kebun';
  return (
    <>
      {/* kebun tetap terpasang (posisi & dunia 3D tidak dibangun ulang), hanya disembunyikan */}
      <div className={view === 'kebun' ? undefined : 'hidden'}>
        <Garden active={view === 'kebun'} tour={tour} onOpen3D={open} onCatalog={() => setCatalog(true)} onTour={startTour} onTourEnd={() => setTour(false)} />
      </div>
      {view === 'detail' && fruit && <Detail fruit={fruit} onBack={back} onOpen={open} />}
      {view === 'katalog' && <Catalog onOpen={open} onTour={startTour} onBack={() => setCatalog(false)} />}
    </>
  );
}
