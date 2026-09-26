'use client';

// Jelajah Tubuh versi anak: 3D penuh layar, sedikit tombol besar, sedikit teks.
// Deretan organ di bawah (ketuk → organ diperbesar sendirian) · kartu singkat · 4 tombol lapisan
// (Kulit, Otot, Tulang, Organ). Mesin 3D, data, dan progres sama dengan Explorer lengkap.

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer, useRef } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { PLAY, type ColorKey } from '@/lib/catalog';
import { initialState, reducer } from '@/lib/anatomy/state';
import { useAnatomySession } from '@/lib/anatomy/use-session';
import type { LayerId, Manifest, Part } from '@/lib/anatomy/types';
import { useRumila } from '@/lib/store';
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

export function KidBody({ manifest, memberId }: { manifest: Manifest; memberId: string }) {
  useAnatomySession(memberId);
  const router = useRouter();
  const complete = useRumila((s) => s.completeAnatomy);
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState());
  const viewer = useRef<ViewerHandle>(null);
  const organs = ORGANS.filter(([id]) => manifest.parts.some((p) => p.id === id));
  const selected = manifest.parts.find((p) => p.id === state.selectedId);
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
    router.push('/beranda/edukasi');
  };
  const busy = !!state.isolation || !!selected;

  return (
    <div className="anatomy-kid theme-play fixed inset-0 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 42%, #fffefa 0%, #f6f1ea 50%, #e3e6fb 100%)' }}>
      <div className="absolute inset-0">
        <Viewer
          ref={viewer}
          manifest={manifest}
          state={state}
          onSelect={pick}
          onDetach={(id, amount) => dispatch({ type: 'patch', patch: { detached: { ...state.detached, [id]: amount } } })}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {/* atas: kembali · tubuh utuh */}
        <div className="flex items-start justify-between gap-2">
          <RoundBtn icon={busy ? 'arrow_back' : 'home'} label={busy ? 'Kembali' : 'Keluar'} onClick={back} />
          {busy && <RoundBtn icon="accessibility_new" label="Utuh lagi" tone="purple" onClick={whole} />}
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
          <div className="pointer-events-auto -mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:justify-center">
            {organs.map(([id, name, icon, c]) => {
              const on = state.isolation === id || state.selectedId === id;
              const [l, m, d] = PLAY[c];
              return (
                <button
                  key={id}
                  onClick={() => open(id)}
                  aria-pressed={on}
                  className="flex w-[74px] shrink-0 flex-col items-center gap-1.5 rounded-[20px] py-2 transition-transform active:scale-90"
                  style={on ? { background: 'rgba(255,255,255,.75)', boxShadow: 'inset 0 0 0 3px #ffbe0b' } : undefined}
                >
                  <span className="flex size-12 items-center justify-center rounded-full text-white" style={{ background: `linear-gradient(155deg, ${l}, ${m} 65%)`, boxShadow: `0 3px 0 ${d}` }}>
                    <Icon name={icon} size={26} />
                  </span>
                  <span style={{ fontFamily: BALOO, fontSize: 13, fontWeight: 800, color: INK, lineHeight: 1 }}>{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
