'use client';

// Gambar game "Coding Agam · Kalau…" = AGAM PELARI (tampak samping, seperti game lari tanpa ujung).
// 10 tema (satu per Level). Tiap tema: langit diam, lapisan jauh & tengah yang bergulir pelan (paralaks), tanah
// tempat berlari (atas di y = 460), lubang/jurang, rintangan rendah (lompat), rintangan terbang setinggi kepala
// (merunduk), dan gerbang finis. Plus Agam versi pelari (tampak samping, 6 pose) & Agam pelari tampak depan.
// Semua deterministik (tanpa Math.random), id berawalan kr-.

import type { ReactNode } from 'react';
import type { RunnerTheme, RunPose } from './skin-types';

/* ---------- bahan bersama ---------- */

/** bulatkan koordinat hasil hitung (supaya teks SVG pendek & sama di server/klien) */
const R = (v: number) => +v.toFixed(1);
/** angka semu-acak tetap 0..1 per nomor benda */
const hs = (i: number, k = 0) => ((((i * 73856093) ^ ((k + 1) * 19349663)) >>> 0) % 1000) / 1000;
type Pt = [number, number];

/** ulangi gambar sepanjang a..b tiap `step` satuan (untuk lapisan latar; boleh sedikit keluar batas) */
function each(a: number, b: number, step: number, fn: (x: number, i: number) => ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  for (let i = Math.floor(a / step); i * step <= b; i++) out.push(<g key={i}>{fn(i * step, i)}</g>);
  return out;
}
/** ulangi hanya untuk petak yang utuh di dalam a..b (hiasan tanah tidak menjorok ke lubang) */
function eachIn(a: number, b: number, step: number, fn: (x: number, i: number) => ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  for (let i = Math.ceil(a / step); i * step + step <= b; i++) out.push(<g key={i}>{fn(i * step, i)}</g>);
  return out;
}

/** bukit bergelombang halus sepanjang 0..len, bawahnya ditutup di y = 470 */
function ridgeD(len: number, step: number, base: number, amp: number, seed: number) {
  const n = Math.ceil(len / step) + 2;
  const y = (i: number) => R(base - amp * hs(i, seed));
  let d = `M${-step} 470 L${-step} ${y(-1)}`;
  for (let i = -1; i < n; i++) d += ` Q${i * step} ${y(i)} ${R(i * step + step / 2)} ${R((y(i) + y(i + 1)) / 2)}`;
  return `${d} L${n * step} ${y(n)} L${n * step} 470 Z`;
}
/** titik tepat di permukaan bukit ridgeD (tengah antar titik kendali) */
const ridgeAt = (i: number, step: number, base: number, amp: number, seed: number): Pt => [
  R(i * step + step / 2),
  R((R(base - amp * hs(i, seed)) + R(base - amp * hs(i + 1, seed))) / 2),
];

/** gunung runcing sepanjang 0..len */
const valleyY = (i: number, base: number, amp: number, seed: number) => R(base - amp * 0.2 * hs(i, seed + 3));
const peakY = (i: number, base: number, amp: number, seed: number) => R(base - amp * (0.5 + 0.5 * hs(i, seed)));
function peaksD(len: number, step: number, base: number, amp: number, seed: number) {
  const n = Math.ceil(len / step) + 1;
  let d = `M${-step} 470`;
  for (let i = -1; i <= n; i++) d += ` L${i * step} ${valleyY(i, base, amp, seed)} L${i * step + step / 2} ${peakY(i, base, amp, seed)}`;
  return `${d} L${(n + 1) * step} ${valleyY(n + 1, base, amp, seed)} L${(n + 1) * step} 470 Z`;
}
/** tudung salju/cahaya di puncak gunung peaksD */
function peakCaps(len: number, step: number, base: number, amp: number, seed: number, fill: string, depth = 24, op = 1) {
  return each(-step, len, step, (x, i) => {
    const px = x + step / 2,
      py = peakY(i, base, amp, seed);
    const wl = (depth * (step / 2)) / Math.max(1, valleyY(i, base, amp, seed) - py),
      wr = (depth * (step / 2)) / Math.max(1, valleyY(i + 1, base, amp, seed) - py);
    return (
      <path
        d={`M${px} ${py} L${R(px - wl)} ${py + depth} L${R(px - wl * 0.45)} ${py + depth - 7} L${R(px - wl * 0.1)} ${py + depth - 1} L${R(px + wr * 0.35)} ${py + depth - 8} L${R(px + wr)} ${py + depth} Z`}
        fill={fill}
        opacity={op}
      />
    );
  });
}

/** awan gembul */
function puff(x: number, y: number, s: number, fill = '#fff', op = 0.92, shade = '#9fb8d6') {
  return (
    <g opacity={op}>
      <ellipse cx={R(x + 32 * s)} cy={R(y + 12 * s)} rx={R(60 * s)} ry={R(16 * s)} fill={fill} />
      <circle cx={R(x)} cy={R(y + 4 * s)} r={R(22 * s)} fill={fill} />
      <circle cx={R(x + 30 * s)} cy={R(y - 10 * s)} r={R(30 * s)} fill={fill} />
      <circle cx={R(x + 62 * s)} cy={R(y + 2 * s)} r={R(22 * s)} fill={fill} />
      <ellipse cx={R(x + 32 * s)} cy={R(y + 22 * s)} rx={R(54 * s)} ry={R(6 * s)} fill={shade} opacity={0.35} />
      <ellipse cx={R(x + 22 * s)} cy={R(y - 22 * s)} rx={R(12 * s)} ry={R(6 * s)} fill="#fff" opacity={0.7} />
    </g>
  );
}

/** bintang bersudut lima */
function starD(cx: number, cy: number, r: number) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5,
      rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${R(cx + Math.cos(a) * rr)} ${R(cy + Math.sin(a) * rr)} `;
  }
  return `${d}Z`;
}

/** kilau kecil berbintik empat */
const sparkle = (x: number, y: number, s: number, fill: string, delay: number) => (
  <path
    d={`M${x} ${R(y - 8 * s)} Q${x} ${y} ${R(x + 8 * s)} ${y} Q${x} ${y} ${x} ${R(y + 8 * s)} Q${x} ${y} ${R(x - 8 * s)} ${y} Q${x} ${y} ${x} ${R(y - 8 * s)} Z`}
    fill={fill}
    className="ka-twinkle"
    style={{ animationDelay: `${R(-delay)}s` }}
  />
);

/** bingkai rintangan rendah: dipusatkan di x, berdiri di tanah (y = 460), dengan bayangan */
const lowAt = (x: number, body: ReactNode, sh = 38) => (
  <g transform={`translate(${x} 460)`}>
    <ellipse cx={0} cy={2} rx={sh} ry={6} fill="#000" opacity={0.22} />
    {body}
  </g>
);
/** bingkai rintangan terbang: setinggi kepala Agam (y = 368), terayun naik-turun, bayangan samar di tanah */
const flyAt = (x: number, k: number, body: ReactNode, sh = 18) => (
  <g transform={`translate(${x} 368)`}>
    <ellipse cx={0} cy={93} rx={sh} ry={3.5} fill="#000" opacity={0.12} />
    <g className="ka-bob" style={{ animationDelay: `${-(k % 5) * 0.5}s` }}>
      {body}
    </g>
  </g>
);

/** gerbang finis umum: dua tiang, spanduk kotak-kotak di atas kepala Agam, garis kotak-kotak di tanah */
function gate(x: number, post: string, edge: string, extra: ReactNode = null, c1 = '#1b2a4e', c2 = '#ffffff') {
  const sq: ReactNode[] = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 0) sq.push(<rect key={`${r}-${c}`} x={x - 44 + c * 11} y={298 + r * 16} width={11} height={16} fill={c1} />);
  const gr: ReactNode[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) gr.push(<rect key={`g${r}-${c}`} x={x - 6 + c * 6} y={460 + r * 6} width={6} height={6} fill={(r + c) % 2 ? c2 : c1} />);
  return (
    <g>
      {gr}
      {[x - 52, x + 42].map((px) => (
        <g key={px}>
          <ellipse cx={px + 5} cy={462} rx={14} ry={3.5} fill="#000" opacity={0.2} />
          <rect x={px} y={286} width={10} height={176} rx={4} fill={post} stroke={edge} strokeWidth={2} />
          <rect x={px + 2.5} y={292} width={2.5} height={164} rx={1.2} fill="#fff" opacity={0.4} />
        </g>
      ))}
      <rect x={x - 44} y={298} width={88} height={32} fill={c2} />
      {sq}
      <rect x={x - 44} y={298} width={88} height={6} fill="#fff" opacity={0.25} />
      <rect x={x - 44} y={298} width={88} height={32} fill="none" stroke={edge} strokeWidth={2.5} />
      {extra}
    </g>
  );
}

/** kelelawar tampak depan, sayap mengepak */
const bat = (body: string, wing: string, eye: string) => (
  <g>
    <g className="ka-flap">
      <path d="M-4 -2 Q-18 -28 -42 -18 Q-35 -12 -37 -3 Q-29 -8 -25 1 Q-17 -6 -10 5 Z" fill={wing} stroke={body} strokeWidth={2} strokeLinejoin="round" />
      <path d="M4 -2 Q18 -28 42 -18 Q35 -12 37 -3 Q29 -8 25 1 Q17 -6 10 5 Z" fill={wing} stroke={body} strokeWidth={2} strokeLinejoin="round" />
    </g>
    <path d="M-8 -7 L-10 -21 L-2 -11 Z M8 -7 L10 -21 L2 -11 Z" fill={body} />
    <ellipse cx={0} cy={2} rx={11} ry={13} fill={body} />
    <ellipse cx={-3} cy={-4} rx={4} ry={3} fill="#fff" opacity={0.15} />
    <circle cx={-4} cy={-1} r={3.4} fill={eye} />
    <circle cx={4} cy={-1} r={3.4} fill={eye} />
    <circle cx={-4.6} cy={-0.6} r={1.5} fill="#1b1020" />
    <circle cx={3.4} cy={-0.6} r={1.5} fill="#1b1020" />
    <path d="M-3.5 6 l1.5 3.4 l1.5 -3.4 Z M0.5 6 l1.5 3.4 l1.5 -3.4 Z" fill="#fff" />
  </g>
);

/** burung tampak samping menghadap kiri (ke arah Agam) */
const bird = (body: string, belly: string, wing: string, beak = '#ffb000') => (
  <g>
    <path d="M14 -3 L36 -12 L31 0 L38 7 Z" fill={wing} />
    <ellipse cx={2} cy={0} rx={20} ry={13} fill={body} />
    <ellipse cx={-3} cy={5} rx={13} ry={7} fill={belly} />
    <circle cx={-15} cy={-6} r={10} fill={body} />
    <path d="M-24 -9 L-36 -4 L-24 -1 Z" fill={beak} />
    <circle cx={-18} cy={-8} r={3.2} fill="#fff" />
    <circle cx={-19} cy={-8} r={1.7} fill="#1b2a4e" />
    <path d="M-8 -12 Q0 -15 8 -10" stroke="#fff" strokeOpacity={0.4} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    <g className="ka-flap">
      <path d="M-2 -6 Q4 -36 26 -32 Q17 -18 13 -3 Z" fill={wing} stroke={body} strokeWidth={1.5} strokeLinejoin="round" />
    </g>
  </g>
);

/* =====================================================================
 * 1. Padang Bunga
 * ===================================================================== */

const PB_PETAL = ['#ff6f91', '#ffffff', '#ffd23f', '#b58cff', '#ff9f43'];
const flower = (x: number, y: number, c: string, s = 1) => (
  <g>
    <path d={`M${x} ${y} l0 ${R(14 * s)}`} stroke="#3f8a2a" strokeWidth={2} />
    <path d={`M${x} ${R(y + 8 * s)} q5 -4 8 -1 q-4 4 -8 1`} fill="#4f9e32" />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={x} cy={R(y - 4.5 * s)} rx={R(3 * s)} ry={R(4.5 * s)} fill={c} transform={`rotate(${a} ${x} ${y})`} />
    ))}
    <circle cx={x} cy={y} r={R(2.6 * s)} fill="#ffc21a" />
  </g>
);

const bee = (
  <g>
    <g className="ka-flap">
      <ellipse cx={6} cy={-17} rx={9} ry={14} fill="#eaf8ff" fillOpacity={0.85} stroke="#9fc8e0" strokeWidth={1.5} transform="rotate(22 6 -17)" />
      <ellipse cx={-5} cy={-15} rx={7} ry={11} fill="#eaf8ff" fillOpacity={0.7} stroke="#9fc8e0" strokeWidth={1.5} transform="rotate(-12 -5 -15)" />
    </g>
    <path d="M20 -2 L30 0 L20 4 Z" fill="#3b2a1a" />
    <ellipse cx={2} cy={0} rx={21} ry={15} fill="url(#kr-pb-bee)" stroke="#8a5a00" strokeWidth={2} />
    <path d="M-3 -14 Q-8 0 -3 14 M9 -13 Q4 0 9 13" stroke="#3b2a1a" strokeWidth={5} fill="none" />
    <circle cx={-20} cy={-2} r={10} fill="#3b2a1a" />
    <path d="M-22 -11 q-3 -9 -10 -11 M-17 -11 q0 -9 -5 -13" stroke="#3b2a1a" strokeWidth={2} fill="none" strokeLinecap="round" />
    <circle cx={-24} cy={-4} r={3.4} fill="#fff" />
    <circle cx={-25} cy={-4} r={1.8} fill="#1b2a4e" />
    <path d="M-27 3 q3 3 6 0" stroke="#fff" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    <ellipse cx={4} cy={-9} rx={8} ry={3} fill="#fff" opacity={0.45} />
  </g>
);

const padang: RunnerTheme = {
  name: 'Padang Bunga',
  bg: '#eaf7dc',
  ink: '#2f5a14',
  defs: (
    <>
      <linearGradient id="kr-pb-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6fc0f2" />
        <stop offset="0.6" stopColor="#bfe6ff" />
        <stop offset="1" stopColor="#fff3cf" />
      </linearGradient>
      <radialGradient id="kr-pb-sun">
        <stop offset="0" stopColor="#fffbe0" />
        <stop offset="0.35" stopColor="#ffe680" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffe680" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="kr-pb-far" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a3c9e6" />
        <stop offset="1" stopColor="#d6ebf5" />
      </linearGradient>
      <linearGradient id="kr-pb-hill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b2e38c" />
        <stop offset="1" stopColor="#82c460" />
      </linearGradient>
      <linearGradient id="kr-pb-hill2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#92d36c" />
        <stop offset="1" stopColor="#5fa546" />
      </linearGradient>
      <radialGradient id="kr-pb-leaf" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#9ee06a" />
        <stop offset="0.6" stopColor="#4f9e32" />
        <stop offset="1" stopColor="#2c6a1d" />
      </radialGradient>
      <linearGradient id="kr-pb-soil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a8743f" />
        <stop offset="1" stopColor="#643c1f" />
      </linearGradient>
      <linearGradient id="kr-pb-grass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a4e36f" />
        <stop offset="1" stopColor="#5fae3c" />
      </linearGradient>
      <linearGradient id="kr-pb-pit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a2e17" />
        <stop offset="1" stopColor="#0b0603" />
      </linearGradient>
      <radialGradient id="kr-pb-rock" cx="0.38" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#e2e5e8" />
        <stop offset="0.55" stopColor="#a4aab1" />
        <stop offset="1" stopColor="#666d75" />
      </radialGradient>
      <radialGradient id="kr-pb-bee" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#fff27a" />
        <stop offset="0.6" stopColor="#ffd21a" />
        <stop offset="1" stopColor="#e09a00" />
      </radialGradient>
      <pattern id="kr-pb-dirt" width="46" height="40" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="10" r="2.4" fill="#4a2a12" opacity="0.35" />
        <circle cx="30" cy="22" r="1.8" fill="#d9a56a" opacity="0.4" />
        <ellipse cx="20" cy="34" rx="4" ry="2.4" fill="#4a2a12" opacity="0.25" />
        <circle cx="40" cy="6" r="1.4" fill="#fff" opacity="0.2" />
      </pattern>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-pb-sky)" />
      <circle cx={w - 170} cy={115} r={115} fill="url(#kr-pb-sun)" />
      <circle cx={w - 170} cy={115} r={40} fill="#fff6b0" />
      {each(0, w, 420, (x, i) => puff(R(x + 40 + hs(i, 1) * 200), R(70 + hs(i, 2) * 110), R(0.7 + hs(i, 3) * 0.5)))}
    </g>
  ),
  far: (len) => (
    <g>
      <path d={peaksD(len, 520, 400, 150, 11)} fill="url(#kr-pb-far)" />
      {peakCaps(len, 520, 400, 150, 11, '#ffffff', 26, 0.75)}
      <path d={ridgeD(len, 260, 425, 70, 12)} fill="url(#kr-pb-hill)" />
      {each(0, len, 260, (_x, i) => {
        if (hs(i, 13) > 0.55) return null;
        const [px, py] = ridgeAt(i, 260, 425, 70, 12);
        return (
          <g>
            <rect x={px - 1.5} y={py - 12} width={3} height={12} fill="#6b4a2a" />
            <circle cx={px} cy={py - 16} r={8} fill="#5fa546" />
            <circle cx={px - 2} cy={py - 18} r={3} fill="#b2e38c" opacity={0.6} />
          </g>
        );
      })}
      <path d={ridgeD(len, 200, 450, 34, 14)} fill="url(#kr-pb-hill2)" />
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 230, (x, i) => {
        const v = hs(i, 5),
          cx = R(x + 40 + hs(i, 6) * 140),
          t = R(0.85 + hs(i, 7) * 0.35);
        if (v < 0.5)
          return (
            <g>
              <ellipse cx={cx} cy={461} rx={R(42 * t)} ry={6} fill="#000" opacity={0.12} />
              <path d={`M${R(cx - 8 * t)} 460 Q${R(cx - 4 * t)} ${R(430 - 20 * t)} ${R(cx - 5 * t)} ${R(460 - 72 * t)} L${R(cx + 5 * t)} ${R(460 - 72 * t)} Q${R(cx + 4 * t)} ${R(430 - 20 * t)} ${R(cx + 9 * t)} 460 Z`} fill="#8a5a2e" />
              <path d={`M${R(cx - 2 * t)} 455 L${R(cx - 1 * t)} ${R(460 - 60 * t)}`} stroke="#b07a44" strokeWidth={2} />
              <circle cx={R(cx - 24 * t)} cy={R(460 - 80 * t)} r={R(27 * t)} fill="url(#kr-pb-leaf)" />
              <circle cx={R(cx + 24 * t)} cy={R(460 - 82 * t)} r={R(27 * t)} fill="url(#kr-pb-leaf)" />
              <circle cx={cx} cy={R(460 - 106 * t)} r={R(34 * t)} fill="url(#kr-pb-leaf)" />
              <path d={`M${R(cx - 18 * t)} ${R(460 - 122 * t)} q${R(12 * t)} ${R(-12 * t)} ${R(28 * t)} ${R(-6 * t)}`} stroke="#d4f7a8" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
              {hs(i, 8) < 0.6 &&
                [
                  [-22, -86],
                  [14, -100],
                  [26, -76],
                  [-6, -118],
                ].map(([dx, dy]) => <circle key={dx} cx={R(cx + dx * t)} cy={R(460 + dy * t)} r={4.5} fill="#ff4d5e" stroke="#b3202f" strokeWidth={1} />)}
            </g>
          );
        if (v < 0.8)
          return (
            <g>
              <ellipse cx={cx} cy={461} rx={44} ry={5} fill="#000" opacity={0.1} />
              <circle cx={cx - 22} cy={446} r={18} fill="url(#kr-pb-leaf)" />
              <circle cx={cx + 22} cy={446} r={18} fill="url(#kr-pb-leaf)" />
              <circle cx={cx} cy={436} r={24} fill="url(#kr-pb-leaf)" />
              <rect x={cx - 40} y={446} width={80} height={14} fill="#3f8a2a" />
              {[-26, -8, 10, 24].map((dx, j) => (
                <circle key={dx} cx={cx + dx} cy={R(430 + hs(i, 20 + j) * 20)} r={3.6} fill={PB_PETAL[(i + j) % 5]} />
              ))}
            </g>
          );
        // bunga matahari tinggi
        return (
          <g>
            <path d={`M${cx} 460 Q${cx - 6} 420 ${cx} 372`} stroke="#3f8a2a" strokeWidth={5} fill="none" />
            <path d={`M${cx - 2} 420 q-16 -8 -24 2 q12 8 24 -2 M${cx} 400 q16 -8 24 2 q-12 8 -24 -2`} fill="#4f9e32" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
              <ellipse key={a} cx={cx} cy={352} rx={5} ry={11} fill="#ffc21a" transform={`rotate(${a} ${cx} 366)`} />
            ))}
            <circle cx={cx} cy={366} r={11} fill="#7a4a1a" />
            <circle cx={cx - 3} cy={363} r={3} fill="#a8703a" />
          </g>
        );
      })}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    return (
      <g>
        <rect x={x0} y={460} width={w} height={140} fill="url(#kr-pb-soil)" />
        <rect x={x0} y={482} width={w} height={118} fill="url(#kr-pb-dirt)" />
        <rect x={x0} y={484} width={w} height={6} fill="#000" opacity={0.12} />
        <rect x={x0} y={458} width={w} height={26} fill="url(#kr-pb-grass)" />
        {eachIn(x0, x1, 30, (x) => (
          <ellipse cx={x + 15} cy={483} rx={15} ry={5} fill="#5fae3c" />
        ))}
        <rect x={x0} y={458} width={w} height={3} fill="#e2ffc0" opacity={0.8} />
        {eachIn(x0, x1, 34, (x, i) => (
          <path d={`M${x + 4} 461 l3 -9 l2 9 l3 -12 l2 12 l3 -8 l2 8 Z`} fill={hs(i, 1) < 0.5 ? '#6cc043' : '#58a836'} />
        ))}
        {eachIn(x0, x1, 70, (x, i) => (hs(i, 2) < 0.55 ? flower(R(x + 10 + hs(i, 3) * 50), R(448 + hs(i, 4) * 4), PB_PETAL[Math.abs(i) % 5], 0.9) : null))}
        {eachIn(x0, x1, 110, (x, i) => (
          <g>
            <ellipse cx={R(x + 20 + hs(i, 5) * 70)} cy={R(515 + hs(i, 6) * 60)} rx={R(7 + hs(i, 7) * 6)} ry={5} fill="#8b8f95" />
            <ellipse cx={R(x + 18 + hs(i, 5) * 70)} cy={R(513 + hs(i, 6) * 60)} rx={3} ry={1.6} fill="#fff" opacity={0.5} />
          </g>
        ))}
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={456} width={100} height={144} fill="url(#kr-pb-pit)" />
      <path d={`M${x} 456 L${x + 14} 472 L${x + 8} 540 L${x + 16} 600 L${x} 600 Z`} fill="#6b4222" />
      <path d={`M${x + 100} 456 L${x + 86} 474 L${x + 93} 530 L${x + 84} 600 L${x + 100} 600 Z`} fill="#4f3117" />
      <path d={`M${x} 505 l12 4 M${x} 548 l9 -3 M${x + 100} 512 l-11 3 M${x + 100} 565 l-9 -4`} stroke="#2e1a0b" strokeWidth={3} strokeLinecap="round" />
      <path d={`M${x + 11} 480 q9 20 -2 42 M${x + 90} 482 q-10 16 0 32`} stroke="#9a6a3a" strokeWidth={3} fill="none" strokeLinecap="round" />
      <rect x={x} y={540} width={100} height={60} fill="#000" opacity={0.35} />
      <path d={`M${x - 6} 456 L${x + 20} 456 Q${x + 19} 463 ${x + 13} 463 Q${x + 9} 470 ${x + 5} 465 Q${x + 1} 471 ${x - 6} 467 Z`} fill="#5fae3c" />
      <path d={`M${x + 106} 456 L${x + 80} 456 Q${x + 81} 463 ${x + 87} 463 Q${x + 91} 470 ${x + 95} 465 Q${x + 99} 471 ${x + 106} 467 Z`} fill="#5fae3c" />
      <path d={`M${x - 6} 456 h26 M${x + 80} 456 h26`} stroke="#e2ffc0" strokeWidth={3} opacity={0.8} />
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    if (v === 0)
      return lowAt(
        x,
        <g>
          <path d="M-36 0 Q-38 -30 -16 -42 Q4 -52 22 -40 Q40 -28 36 0 Z" fill="url(#kr-pb-rock)" />
          <path d="M-20 -32 Q-8 -43 8 -41" stroke="#fff" strokeOpacity={0.65} strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M10 -20 l7 8 l-3 8" stroke="#5a6068" strokeOpacity={0.55} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <ellipse cx={-18} cy={-6} rx={10} ry={4} fill="#6e9b3a" opacity={0.75} />
        </g>,
      );
    if (v === 1)
      return lowAt(
        x,
        <g>
          <path d="M-34 0 Q-36 -24 -14 -34 Q6 -42 22 -32 Q38 -22 34 0 Z" fill="url(#kr-pb-rock)" />
          <path d="M-18 -26 Q-6 -35 8 -33" stroke="#fff" strokeOpacity={0.6} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          <path d="M-16 -32 q-6 -10 2 -16 q4 8 -2 16 M14 -34 q8 -10 14 -4 q-8 6 -14 4" fill="#4f9e32" />
          {flower(-4, -52, '#ff6f91', 1.1)}
          {flower(10, -44, '#fff', 0.9)}
        </g>,
      );
    return lowAt(
      x,
      <g>
        <path d="M-38 0 Q-40 -22 -22 -28 L22 -28 Q40 -22 38 0 Z" fill="url(#kr-pb-rock)" />
        <path d="M-20 -26 Q-22 -52 -2 -58 Q18 -54 20 -26 Z" fill="url(#kr-pb-rock)" />
        <path d="M-28 -20 Q-10 -26 10 -24 M-10 -46 Q-2 -54 8 -52" stroke="#fff" strokeOpacity={0.6} strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={24} cy={-8} rx={9} ry={4} fill="#6e9b3a" opacity={0.7} />
        {/* kepik kecil */}
        <circle cx={8} cy={-40} r={5} fill="#e8233a" />
        <path d="M8 -45 v10" stroke="#1b1020" strokeWidth={1.2} />
        <circle cx={4} cy={-41} r={2.4} fill="#1b1020" />
        <circle cx={10} cy={-38} r={1} fill="#1b1020" />
      </g>,
      42,
    );
  },
  fly: (x, k) =>
    flyAt(
      x,
      k,
      k % 2 === 0 ? (
        <g transform="scale(1.1)">{bee}</g>
      ) : (
        <g>
          <g transform="translate(-16 -10) scale(0.82)">{bee}</g>
          <g transform="translate(20 12) scale(0.78)">{bee}</g>
        </g>
      ),
    ),
  finish: (x) =>
    gate(
      x,
      '#fff8e8',
      '#c9a66b',
      <g>
        {[-40, -26, -12, 2, 16, 30].map((dx, j) => (
          <g key={dx}>{flower(x + dx + 4, 298, PB_PETAL[j % 5], 1.2)}</g>
        ))}
        <path d={`M${x - 47} 286 l0 -18 l22 7 l-22 7`} fill="#ff6f91" />
        <path d={`M${x + 47} 286 l0 -18 l22 7 l-22 7`} fill="#ffd23f" />
      </g>,
      '#2f5a14',
    ),
  words: { low: 'batu', fly: 'lebah', gap: 'lubang' },
};

/* =====================================================================
 * 2. Lembah Dinosaurus
 * ===================================================================== */

const eggD = 'M0 -58 C16 -58 20 -30 18 -20 C16 -6 -16 -6 -18 -20 C-20 -30 -16 -58 0 -58 Z';
const nest = (
  <g>
    <ellipse cx={0} cy={-8} rx={36} ry={11} fill="#7a4f28" />
    <path d="M-34 -10 q20 -8 40 -2 M-30 -4 q26 6 56 -4 M-20 -14 q18 6 40 -2 M-36 -6 l10 -8 M30 -8 l-8 -8" stroke="#b07a44" strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </g>
);
const egg = (spots: string) => (
  <g>
    <path d={eggD} fill="url(#kr-ld-egg)" stroke="#b89a66" strokeWidth={1.5} />
    <circle cx={-6} cy={-40} r={3.5} fill={spots} />
    <circle cx={7} cy={-30} r={4.5} fill={spots} />
    <circle cx={-8} cy={-22} r={2.5} fill={spots} />
    <circle cx={6} cy={-48} r={2} fill={spots} />
    <path d="M-8 -50 Q-10 -40 -9 -32" stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.8} />
  </g>
);
const ptero = (skin: string, wing: string, crest: string) => (
  <g>
    <g className="ka-flap">
      <path d="M-4 -2 Q-10 -36 24 -42 Q18 -22 20 -2 Z" fill={wing} stroke={skin} strokeWidth={2} strokeLinejoin="round" />
    </g>
    <path d="M14 0 L34 -4 L30 4 Z" fill={skin} />
    <ellipse cx={4} cy={0} rx={17} ry={9} fill={skin} />
    <ellipse cx={2} cy={4} rx={10} ry={4} fill="#fff" opacity={0.25} />
    <path d="M-8 -4 L-42 3 L-10 7 Z" fill="#f7d27a" stroke="#c99a3a" strokeWidth={1.2} />
    <circle cx={-10} cy={-2} r={9} fill={skin} />
    <path d="M-6 -8 L10 -20 L2 -4 Z" fill={crest} />
    <circle cx={-12} cy={-4} r={3} fill="#fff" />
    <circle cx={-13} cy={-4} r={1.6} fill="#1b2a4e" />
    <path d="M2 8 l-3 7 M8 8 l-1 7" stroke="#6b4a2a" strokeWidth={2} strokeLinecap="round" />
    <g className="ka-flap">
      <path d="M-2 0 Q-4 -30 -30 -30 Q-18 -16 -14 4 Z" fill={wing} opacity={0.75} />
    </g>
  </g>
);

const lembah: RunnerTheme = {
  name: 'Lembah Dinosaurus',
  bg: '#f6ecd6',
  ink: '#6b3f12',
  defs: (
    <>
      <linearGradient id="kr-ld-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffae6e" />
        <stop offset="0.5" stopColor="#ffd6a0" />
        <stop offset="1" stopColor="#fff0d2" />
      </linearGradient>
      <radialGradient id="kr-ld-sun">
        <stop offset="0" stopColor="#fff6d8" />
        <stop offset="0.4" stopColor="#ffd08a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffb870" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="kr-ld-vol" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b48064" />
        <stop offset="1" stopColor="#d9ab8c" />
      </linearGradient>
      <linearGradient id="kr-ld-hill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9fb86a" />
        <stop offset="1" stopColor="#7a9c52" />
      </linearGradient>
      <linearGradient id="kr-ld-soil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cf9255" />
        <stop offset="1" stopColor="#7a4a24" />
      </linearGradient>
      <linearGradient id="kr-ld-pit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4b2812" />
        <stop offset="1" stopColor="#120704" />
      </linearGradient>
      <radialGradient id="kr-ld-egg" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#fffcee" />
        <stop offset="0.6" stopColor="#f2e3bb" />
        <stop offset="1" stopColor="#cdb57e" />
      </radialGradient>
      <linearGradient id="kr-ld-lava" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe08a" />
        <stop offset="1" stopColor="#ff6a2a" />
      </linearGradient>
      <pattern id="kr-ld-crack" width="70" height="50" patternUnits="userSpaceOnUse">
        <path d="M6 10 l10 6 l-4 8 M40 30 l8 -6 l10 4 M24 44 l6 -6" stroke="#5a3218" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="58" cy="12" r="2" fill="#f3c890" opacity="0.4" />
        <circle cx="16" cy="36" r="1.6" fill="#5a3218" opacity="0.3" />
      </pattern>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-ld-sky)" />
      <circle cx={R(w * 0.28)} cy={170} r={120} fill="url(#kr-ld-sun)" />
      <circle cx={R(w * 0.28)} cy={170} r={46} fill="#fff1c8" />
      {each(0, w, 460, (x, i) => puff(R(x + 80 + hs(i, 1) * 200), R(60 + hs(i, 2) * 90), R(0.6 + hs(i, 3) * 0.4), '#fff4e2', 0.85, '#e8a070'))}
    </g>
  ),
  far: (len) => (
    <g>
      {each(0, len, 440, (x, i) => {
        const top = R(250 + hs(i, 1) * 60),
          cx = R(x + 60 + hs(i, 2) * 200);
        if (hs(i, 3) < 0.55)
          return (
            <g>
              <path d={`M${cx - 170} 470 L${cx - 30} ${top} L${cx + 30} ${top} L${cx + 170} 470 Z`} fill="url(#kr-ld-vol)" />
              <path d={`M${cx - 30} ${top} L${cx - 42} ${top + 30} L${cx - 22} ${top + 22} L${cx - 10} ${top + 44} L${cx} ${top + 20} L${cx + 14} ${top + 36} L${cx + 30} ${top}`} fill="url(#kr-ld-lava)" opacity={0.85} />
              <ellipse cx={cx} cy={top} rx={30} ry={6} fill="#ff8a3a" opacity={0.9} />
              <circle cx={cx - 6} cy={top - 22} r={16} fill="#a89a94" opacity={0.6} className="ka-smoke" />
              <circle cx={cx + 12} cy={top - 44} r={20} fill="#b9aca6" opacity={0.5} className="ka-smoke" style={{ animationDelay: '-1.5s' }} />
              <circle cx={cx - 4} cy={top - 70} r={24} fill="#c9bdb8" opacity={0.4} className="ka-smoke" style={{ animationDelay: '-3s' }} />
            </g>
          );
        return <path d={`M${cx - 150} 470 L${cx - 20} ${top + 20} L${cx} ${top + 8} L${cx + 26} ${top + 26} L${cx + 150} 470 Z`} fill="#c29273" opacity={0.85} />;
      })}
      <path d={ridgeD(len, 240, 440, 50, 21)} fill="url(#kr-ld-hill)" />
      {each(0, len, 960, (_x, i) => {
        if (hs(i, 22) > 0.6) return null;
        const [px, py] = ridgeAt(i * 4, 240, 440, 50, 21);
        // siluet dino leher panjang
        return (
          <g fill="#5f7a44" opacity={0.85}>
            <ellipse cx={px} cy={py - 22} rx={34} ry={17} />
            <path d={`M${px + 22} ${py - 30} Q${px + 40} ${py - 70} ${px + 50} ${py - 88} l10 -2 l2 8 l-8 2 Q${px + 48} ${py - 60} ${px + 30} ${py - 18} Z`} />
            <path d={`M${px - 30} ${py - 20} Q${px - 56} ${py - 18} ${px - 66} ${py - 6} Q${px - 50} ${py - 12} ${px - 28} ${py - 10} Z`} />
            <rect x={px - 24} y={py - 10} width={9} height={14} rx={3} />
            <rect x={px + 12} y={py - 10} width={9} height={14} rx={3} />
          </g>
        );
      })}
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 250, (x, i) => {
        const v = hs(i, 5),
          cx = R(x + 40 + hs(i, 6) * 160);
        if (v < 0.45) {
          const h = R(110 + hs(i, 7) * 60),
            tx = cx + 14,
            ty = 460 - h;
          return (
            <g>
              <ellipse cx={cx} cy={461} rx={30} ry={5} fill="#000" opacity={0.12} />
              <path d={`M${cx} 460 Q${cx + 4} ${R(460 - h / 2)} ${tx} ${ty}`} stroke="#8a6238" strokeWidth={13} fill="none" strokeLinecap="round" />
              <path d={`M${cx} 460 Q${cx + 4} ${R(460 - h / 2)} ${tx} ${ty}`} stroke="#6b4a2a" strokeWidth={13} fill="none" strokeDasharray="3 9" />
              {[-160, -120, -80, -40, -10, 20].map((a, j) => {
                const rad = (a * Math.PI) / 180,
                  L = 62 - Math.abs(j - 2.5) * 6;
                const ex = R(tx + Math.cos(rad) * L),
                  ey = R(ty + Math.sin(rad) * L + 26);
                const mx = R(tx + Math.cos(rad) * L * 0.55),
                  my = R(ty + Math.sin(rad) * L * 0.55 - 14);
                return (
                  <g key={a}>
                    <path d={`M${tx} ${ty} Q${mx} ${my} ${ex} ${ey}`} stroke="#3f7a2a" strokeWidth={10} fill="none" strokeLinecap="round" />
                    <path d={`M${tx} ${ty} Q${mx} ${my} ${ex} ${ey}`} stroke="#7cc04e" strokeWidth={3} fill="none" strokeLinecap="round" strokeDasharray="4 4" />
                  </g>
                );
              })}
              <circle cx={tx} cy={ty + 4} r={6} fill="#c9542a" />
            </g>
          );
        }
        if (v < 0.8)
          // pakis raksasa
          return (
            <g>
              {[-60, -35, -12, 12, 35, 60].map((dx) => (
                <path
                  key={dx}
                  d={`M${cx} 460 Q${R(cx + dx * 0.5)} ${R(360 + Math.abs(dx) * 0.8)} ${R(cx + dx * 1.2)} ${R(400 + Math.abs(dx) * 0.6)}`}
                  stroke={Math.abs(dx) > 30 ? '#4a8a32' : '#5fa33e'}
                  strokeWidth={9}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="7 3"
                />
              ))}
              <ellipse cx={cx} cy={458} rx={24} ry={6} fill="#3f7a2a" />
            </g>
          );
        return (
          <g>
            <path d={`M${cx - 36} 460 Q${cx - 38} 424 ${cx - 10} 418 Q${cx + 22} 414 ${cx + 34} 440 L${cx + 36} 460 Z`} fill="#a38a72" />
            <path d={`M${cx - 26} 430 Q${cx - 10} 420 ${cx + 8} 422`} stroke="#fff" strokeOpacity={0.4} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={`M${cx - 30} 460 q6 -14 16 -14 q10 0 14 14`} fill="#6e9b3a" />
          </g>
        );
      })}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    return (
      <g>
        <rect x={x0} y={460} width={w} height={140} fill="url(#kr-ld-soil)" />
        <rect x={x0} y={470} width={w} height={130} fill="url(#kr-ld-crack)" />
        <rect x={x0} y={456} width={w} height={10} fill="#d9a064" />
        <rect x={x0} y={456} width={w} height={3} fill="#f7d09a" />
        <rect x={x0} y={466} width={w} height={4} fill="#000" opacity={0.1} />
        {eachIn(x0, x1, 60, (x, i) =>
          hs(i, 1) < 0.5 ? <path d={`M${x + 10} 458 l2 -8 l2 8 l3 -11 l2 11 l3 -7 l2 7 Z`} fill="#7ea846" /> : null,
        )}
        {eachIn(x0, x1, 180, (x, i) => {
          const fx = R(x + 30 + hs(i, 2) * 110);
          return hs(i, 3) < 0.6 ? (
            <g>
              <path d={`M${fx} 458 Q${fx - 8} 440 ${fx - 22} 436 M${fx} 458 Q${fx + 6} 438 ${fx + 18} 432 M${fx} 458 Q${fx} 436 ${fx - 2} 428`} stroke="#4f8f3a" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="4 2" />
            </g>
          ) : null;
        })}
        {eachIn(x0, x1, 260, (x, i) => {
          const px = R(x + 40 + hs(i, 4) * 170),
            py = R(510 + hs(i, 5) * 50);
          return hs(i, 6) < 0.5 ? (
            // fosil kerang spiral
            <g opacity={0.55}>
              <circle cx={px} cy={py} r={11} fill="#e8c28e" />
              <path d={`M${px} ${py} m0 -2 a2 2 0 1 1 -2 2 a5 5 0 0 1 5 -5 a8 8 0 0 1 8 8`} stroke="#8a5a2e" strokeWidth={2} fill="none" />
            </g>
          ) : (
            // tulang
            <g opacity={0.6}>
              <rect x={px - 14} y={py - 2.5} width={28} height={5} rx={2.5} fill="#f3e6c8" />
              <circle cx={px - 14} cy={py - 3} r={3.5} fill="#f3e6c8" />
              <circle cx={px - 14} cy={py + 3} r={3.5} fill="#f3e6c8" />
              <circle cx={px + 14} cy={py - 3} r={3.5} fill="#f3e6c8" />
              <circle cx={px + 14} cy={py + 3} r={3.5} fill="#f3e6c8" />
            </g>
          );
        })}
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={455} width={100} height={145} fill="url(#kr-ld-pit)" />
      <path d={`M${x} 455 L${x + 16} 470 L${x + 10} 505 L${x + 20} 540 L${x + 12} 600 L${x} 600 Z`} fill="#8a5a2e" />
      <path d={`M${x + 100} 455 L${x + 84} 468 L${x + 92} 510 L${x + 82} 560 L${x + 90} 600 L${x + 100} 600 Z`} fill="#6e4422" />
      <path d={`M${x + 16} 470 L${x + 10} 505 M${x + 84} 468 L${x + 92} 510`} stroke="#d9a064" strokeWidth={2} opacity={0.6} />
      <rect x={x} y={535} width={100} height={65} fill="#000" opacity={0.4} />
      <g opacity={0.5}>
        <rect x={x + 36} y={586} width={26} height={5} rx={2.5} fill="#f3e6c8" />
        <circle cx={x + 36} cy={586} r={3.5} fill="#f3e6c8" />
        <circle cx={x + 62} cy={591} r={3.5} fill="#f3e6c8" />
      </g>
      <path d={`M${x - 4} 455 h24 M${x + 80} 455 h24`} stroke="#f7d09a" strokeWidth={3} />
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    if (v === 0)
      return lowAt(
        x,
        <g>
          {nest}
          <g transform="translate(0 -4)">{egg('#8ec07c')}</g>
          <path d="M-30 -10 q20 6 60 0" stroke="#8a5a2e" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>,
      );
    if (v === 1)
      return lowAt(
        x,
        <g>
          {nest}
          <g transform="translate(-13 -4) scale(0.82)">{egg('#e89a6a')}</g>
          <g transform="translate(14 -2) scale(0.74)">{egg('#9ab8e8')}</g>
          <path d="M-32 -9 q22 7 64 0" stroke="#8a5a2e" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>,
      );
    // telur retak, bayi dino mengintip
    return lowAt(
      x,
      <g>
        {nest}
        <circle cx={0} cy={-40} r={14} fill="#7cc04e" />
        <circle cx={-7} cy={-43} r={4.2} fill="#fff" />
        <circle cx={-8} cy={-43} r={2.3} fill="#1b2a4e" />
        <path d="M-12 -34 q5 4 10 1" stroke="#2f5a14" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <path d="M2 -54 l3 -6 l3 5 l4 -4" stroke="#5fa33e" strokeWidth={3} fill="none" strokeLinejoin="round" />
        <path d="M-19 -28 L-12 -34 L-6 -26 L0 -34 L6 -26 L12 -34 L19 -28 C18 -14 12 -8 0 -8 C-12 -8 -18 -14 -19 -28 Z" fill="url(#kr-ld-egg)" stroke="#b89a66" strokeWidth={1.5} />
        <circle cx={8} cy={-18} r={3.5} fill="#8ec07c" />
        <path d="M26 -8 q2 -14 12 -12 l-4 6 l6 2 q-4 8 -14 4 Z" fill="url(#kr-ld-egg)" stroke="#b89a66" strokeWidth={1.2} />
      </g>,
    );
  },
  fly: (x, k) => flyAt(x, k, k % 2 === 0 ? ptero('#e07b4f', '#f4a77a', '#ffd23f') : ptero('#7b6fd6', '#a99ff0', '#ff6f91'), 24),
  finish: (x) =>
    gate(
      x,
      '#f3e6c8',
      '#b89a66',
      <g>
        {[x - 47, x + 47].map((px) => (
          <g key={px}>
            <path d={`M${px} 286 q-26 -4 -34 10 M${px} 286 q26 -4 34 10 M${px} 286 q-14 -18 -30 -18 M${px} 286 q14 -18 30 -18`} stroke="#4f8f3a" strokeWidth={7} fill="none" strokeLinecap="round" />
            <circle cx={px} cy={286} r={6} fill="#c9542a" />
          </g>
        ))}
      </g>,
      '#6b3f12',
    ),
  words: { low: 'telur dino', fly: 'dino terbang', gap: 'jurang' },
};

/* =====================================================================
 * 3. Jembatan Gantung
 * ===================================================================== */

/** tinggi tali pegangan (melengkung di antara tiang tiap 300 satuan) */
const sagY = (x: number) => R(414 + 24 * Math.sin((Math.PI * (((x % 300) + 300) % 300)) / 300));
const crate = (w: number, h: number) => (
  <g>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={3} fill="url(#kr-jg-crate)" stroke="#7a4f28" strokeWidth={3} />
    <path d={`M${-w / 2 + 4} ${R(-h / 3)} h${w - 8} M${-w / 2 + 4} ${R((-h * 2) / 3)} h${w - 8}`} stroke="#9a6a36" strokeWidth={2} />
    <path d={`M${-w / 2 + 5} -5 L${w / 2 - 5} ${-h + 5}`} stroke="#7a4f28" strokeWidth={5} strokeLinecap="round" />
    <rect x={-w / 2} y={-h} width={w} height={5} rx={2} fill="#fff" opacity={0.3} />
    {[-1, 1].map((s) => (
      <g key={s}>
        <circle cx={R((s * w) / 2 - s * 6)} cy={-h + 7} r={1.8} fill="#4a3a2a" />
        <circle cx={R((s * w) / 2 - s * 6)} cy={-7} r={1.8} fill="#4a3a2a" />
      </g>
    ))}
  </g>
);

const jembatan: RunnerTheme = {
  name: 'Jembatan Gantung',
  bg: '#e2f2f7',
  ink: '#1d4e5f',
  defs: (
    <>
      <linearGradient id="kr-jg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5cb8ef" />
        <stop offset="0.7" stopColor="#bfe8ff" />
        <stop offset="1" stopColor="#e8f8ff" />
      </linearGradient>
      <radialGradient id="kr-jg-sun">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.3" stopColor="#fff5b8" stopOpacity="0.9" />
        <stop offset="1" stopColor="#fff5b8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="kr-jg-mtn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fb8cc" />
        <stop offset="1" stopColor="#c6dfe8" />
      </linearGradient>
      <linearGradient id="kr-jg-mtn2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5f9a7c" />
        <stop offset="1" stopColor="#8fbfa4" />
      </linearGradient>
      <linearGradient id="kr-jg-mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.75" />
      </linearGradient>
      <linearGradient id="kr-jg-valley" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bfe3dc" />
        <stop offset="0.45" stopColor="#5f9f84" />
        <stop offset="0.85" stopColor="#2f6d5a" />
        <stop offset="1" stopColor="#2f6d8a" />
      </linearGradient>
      <linearGradient id="kr-jg-river" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6fd3f0" />
        <stop offset="1" stopColor="#2c8fc0" />
      </linearGradient>
      <linearGradient id="kr-jg-crate" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e2b273" />
        <stop offset="1" stopColor="#b07a3e" />
      </linearGradient>
      <radialGradient id="kr-jg-leaf" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#6fc07a" />
        <stop offset="0.6" stopColor="#2f7d4a" />
        <stop offset="1" stopColor="#1c5332" />
      </radialGradient>
      <pattern id="kr-jg-plank" x="0" y="458" width="26" height="16" patternUnits="userSpaceOnUse">
        <rect x="1" y="0" width="24" height="14" rx="2" fill="#c38e53" />
        <rect x="1" y="0" width="24" height="3" rx="1.5" fill="#e8bb7f" />
        <rect x="1" y="11" width="24" height="3" fill="#8a5a2e" opacity="0.6" />
        <path d="M5 7 h10" stroke="#9a6a36" strokeWidth="1.2" opacity="0.7" />
        <circle cx="4.5" cy="7" r="1.3" fill="#4a3a2a" />
        <circle cx="21.5" cy="7" r="1.3" fill="#4a3a2a" />
      </pattern>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-jg-sky)" />
      <circle cx={R(w * 0.72)} cy={100} r={100} fill="url(#kr-jg-sun)" />
      <circle cx={R(w * 0.72)} cy={100} r={34} fill="#fffbe6" />
      {each(0, w, 380, (x, i) => puff(R(x + 30 + hs(i, 1) * 200), R(60 + hs(i, 2) * 120), R(0.6 + hs(i, 3) * 0.5)))}
      {each(0, w, 520, (x, i) => (
        <path d={`M${R(x + 120 + hs(i, 4) * 200)} ${R(200 + hs(i, 5) * 60)} q6 -6 12 0 q6 -6 12 0`} stroke="#2f5a6a" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.6} />
      ))}
    </g>
  ),
  far: (len) => (
    <g>
      <path d={peaksD(len, 460, 420, 190, 31)} fill="url(#kr-jg-mtn)" />
      {peakCaps(len, 460, 420, 190, 31, '#ffffff', 30, 0.85)}
      <path d={peaksD(len, 300, 450, 110, 32)} fill="url(#kr-jg-mtn2)" opacity={0.9} />
      {each(0, len, 900, (x, i) =>
        hs(i, 33) < 0.6 ? (
          // air terjun kecil
          <g>
            <rect x={R(x + 200 + hs(i, 34) * 400)} y={360} width={10} height={100} fill="#e8f8ff" opacity={0.8} />
            <rect x={R(x + 202 + hs(i, 34) * 400)} y={360} width={3} height={100} fill="#fff" className="ka-shimmer" />
          </g>
        ) : null,
      )}
      <rect x={-50} y={380} width={len + 100} height={90} fill="url(#kr-jg-mist)" />
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 260, (x, i) => {
        const cx = R(x + 50 + hs(i, 5) * 150),
          h = R(150 + hs(i, 6) * 80);
        return (
          <g>
            <path d={`M${cx - 7} 460 L${cx - 4} ${460 - h} L${cx + 4} ${460 - h} L${cx + 7} 460 Z`} fill="#5a3d24" />
            {[0, 1, 2].map((j) => (
              <ellipse key={j} cx={R(cx + (j - 1) * 20)} cy={R(460 - h + j * 8 - 4)} rx={R(34 - j * 4)} ry={20} fill="url(#kr-jg-leaf)" />
            ))}
            <ellipse cx={cx} cy={R(460 - h - 20)} rx={30} ry={20} fill="url(#kr-jg-leaf)" />
            <path d={`M${cx + 20} ${R(460 - h + 10)} q6 40 -2 80 M${cx - 22} ${R(460 - h + 8)} q-6 30 2 60`} stroke="#3f8a4a" strokeWidth={3} fill="none" strokeLinecap="round" />
            <ellipse cx={cx - 18} cy={450} rx={24} ry={12} fill="#2f7d4a" />
            <ellipse cx={cx + 20} cy={452} rx={20} ry={10} fill="#3f8f55" />
          </g>
        );
      })}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    let rope = '';
    for (let x = x0; x <= x1; x += 25) rope += `${rope ? ' L' : 'M'}${x} ${sagY(x)}`;
    rope += ` L${x1} ${sagY(x1)}`;
    return (
      <g>
        {/* lembah di bawah jembatan */}
        <rect x={x0} y={466} width={w} height={134} fill="url(#kr-jg-valley)" />
        <rect x={x0} y={574} width={w} height={26} fill="url(#kr-jg-river)" />
        {eachIn(x0, x1, 120, (x, i) => (
          <path d={`M${x + 14} ${R(582 + hs(i, 1) * 10)} q10 -5 20 0 t20 0`} stroke="#e6f7ff" strokeWidth={3} fill="none" strokeLinecap="round" className="ka-shimmer" />
        ))}
        {eachIn(x0, x1, 160, (x, i) => (
          <ellipse cx={R(x + 40 + hs(i, 2) * 80)} cy={R(540 + hs(i, 3) * 20)} rx={40} ry={14} fill="#2f6d4a" opacity={0.6} />
        ))}
        {/* tali pegangan & tali gantung */}
        <path d={rope} stroke="#6b4a2a" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d={rope} stroke="#d4b27a" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="6 3" />
        {eachIn(x0, x1, 50, (x) => (
          <path d={`M${x + 25} ${sagY(x + 25)} L${x + 25} 460`} stroke="#b89260" strokeWidth={2} />
        ))}
        {eachIn(x0 - 150, x1 + 150, 300, (x) =>
          x >= x0 && x <= x1 ? (
            <g>
              <rect x={x - 5} y={404} width={10} height={72} rx={3} fill="#7a4f28" />
              <rect x={x - 3} y={406} width={3} height={66} fill="#b07a44" />
              <path d={`M${x - 7} 416 h14 M${x - 7} 421 h14`} stroke="#d4b27a" strokeWidth={3} />
            </g>
          ) : null,
        )}
        {/* lantai papan */}
        <rect x={x0} y={470} width={w} height={6} fill="#5a3d24" />
        <path d={`M${x0} 480 L${x1} 480`} stroke="#c9a66b" strokeWidth={4} />
        <rect x={x0} y={458} width={w} height={16} fill="url(#kr-jg-plank)" />
        {eachIn(x0, x1, 26, (x, i) => (hs(i, 4) < 0.25 ? <rect x={x + 1} y={458} width={24} height={14} rx={2} fill="#6b4222" opacity={0.25} /> : null))}
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={456} width={100} height={144} fill="url(#kr-jg-valley)" />
      <rect x={x} y={574} width={100} height={26} fill="url(#kr-jg-river)" />
      <path d={`M${x + 20} 586 q10 -5 20 0 t20 0`} stroke="#e6f7ff" strokeWidth={3} fill="none" strokeLinecap="round" className="ka-shimmer" />
      {/* papan patah menggantung */}
      <rect x={x - 2} y={456} width={24} height={13} rx={2} fill="#b07a44" stroke="#6b4222" strokeWidth={1.5} transform={`rotate(38 ${x} 460)`} />
      <rect x={x + 6} y={470} width={20} height={12} rx={2} fill="#9a6a36" stroke="#6b4222" strokeWidth={1.5} transform={`rotate(70 ${x + 6} 470)`} />
      <rect x={x + 78} y={456} width={24} height={13} rx={2} fill="#b07a44" stroke="#6b4222" strokeWidth={1.5} transform={`rotate(-42 ${x + 100} 460)`} />
      {/* ujung tali putus */}
      <path d={`M${x} 470 q6 18 -2 40 M${x + 100} 470 q-8 22 2 46`} stroke="#c9a66b" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={`M${x - 2} 510 l-3 6 M${x - 2} 510 l3 6 M${x + 102} 516 l-3 6 M${x + 102} 516 l3 6`} stroke="#c9a66b" strokeWidth={2} strokeLinecap="round" />
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    if (v === 0) return lowAt(x, crate(56, 50), 34);
    if (v === 1)
      return lowAt(
        x,
        <g>
          {crate(46, 34)}
          <g transform="translate(4 -34)">{crate(32, 28)}</g>
        </g>,
        30,
      );
    return lowAt(
      x,
      <g>
        {crate(56, 42)}
        {/* setandan pisang */}
        {[-14, -6, 2, 10].map((dx) => (
          <path key={dx} d={`M${dx} -42 q-2 -18 10 -24 q-6 10 -4 24 Z`} fill="#ffd23f" stroke="#c99a1a" strokeWidth={1.2} />
        ))}
        <path d="M-2 -64 l6 -4" stroke="#6b4a2a" strokeWidth={3} strokeLinecap="round" />
      </g>,
      34,
    );
  },
  fly: (x, k) => flyAt(x, k, k % 2 === 0 ? bird('#e8384f', '#ffd23f', '#3b82f6') : bird('#2f9e5a', '#ffe680', '#ffb000', '#ff7a3a'), 20),
  finish: (x) =>
    gate(
      x,
      '#c8d27a',
      '#7f8f3a',
      <g>
        {[x - 47, x + 47].map((px) => (
          <path key={px} d={`M${px - 5} 320 h10 M${px - 5} 360 h10 M${px - 5} 400 h10 M${px - 5} 440 h10`} stroke="#7f8f3a" strokeWidth={2.5} />
        ))}
        <path d={`M${x - 47} 288 Q${x} 272 ${x + 47} 288`} stroke="#6b4a2a" strokeWidth={2} fill="none" />
        {[-34, -17, 0, 17, 34].map((dx, j) => (
          <path key={dx} d={`M${x + dx - 6} ${R(283 - (1 - (dx / 47) ** 2) * 8)} l6 12 l6 -12 Z`} fill={['#e8384f', '#ffd23f', '#3b82f6', '#2f9e5a', '#ff7a3a'][j]} />
        ))}
      </g>,
      '#1d4e5f',
    ),
  words: { low: 'peti', fly: 'burung', gap: 'jembatan putus' },
};

/* =====================================================================
 * 4. Candi Kuno
 * ===================================================================== */

const candi: RunnerTheme = {
  name: 'Candi Kuno',
  bg: '#f3ead8',
  ink: '#5e4a2a',
  defs: (
    <>
      <linearGradient id="kr-ck-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f2b35e" />
        <stop offset="0.55" stopColor="#fbdca0" />
        <stop offset="1" stopColor="#fff3dc" />
      </linearGradient>
      <radialGradient id="kr-ck-sun">
        <stop offset="0" stopColor="#fff8e0" />
        <stop offset="0.35" stopColor="#ffc66a" stopOpacity="0.85" />
        <stop offset="1" stopColor="#ffb040" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="kr-ck-stone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#dcc8a4" />
        <stop offset="1" stopColor="#a88e66" />
      </linearGradient>
      <linearGradient id="kr-ck-col" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9a8058" />
        <stop offset="0.35" stopColor="#e2d0ae" />
        <stop offset="1" stopColor="#8a714c" />
      </linearGradient>
      <linearGradient id="kr-ck-pit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a3b28" />
        <stop offset="1" stopColor="#0e0a05" />
      </linearGradient>
      <radialGradient id="kr-ck-rock" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#e8d8b8" />
        <stop offset="0.6" stopColor="#b9a078" />
        <stop offset="1" stopColor="#7e6644" />
      </radialGradient>
      <pattern id="kr-ck-slab" x="0" y="460" width="80" height="28" patternUnits="userSpaceOnUse">
        <rect x="1" y="1" width="78" height="26" rx="3" fill="#cdb68e" />
        <rect x="1" y="1" width="78" height="4" rx="2" fill="#f0e2c4" />
        <rect x="1" y="23" width="78" height="4" fill="#7e6644" opacity="0.5" />
        <circle cx="40" cy="15" r="6" fill="none" stroke="#9a8058" strokeWidth="1.6" />
        <path d="M40 9 v12 M34 15 h12" stroke="#9a8058" strokeWidth="1.2" />
        <circle cx="14" cy="18" r="1.4" fill="#7e6644" opacity="0.5" />
      </pattern>
      <pattern id="kr-ck-course" x="40" y="488" width="80" height="36" patternUnits="userSpaceOnUse">
        <rect x="1" y="1" width="78" height="34" rx="2" fill="#b39a72" />
        <rect x="1" y="1" width="78" height="3" fill="#d9c49c" />
        <path d="M10 22 l8 4 M52 12 l6 6" stroke="#7e6644" strokeWidth="1.5" opacity="0.6" />
      </pattern>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-ck-sky)" />
      <circle cx={R(w * 0.66)} cy={210} r={130} fill="url(#kr-ck-sun)" />
      <circle cx={R(w * 0.66)} cy={210} r={52} fill="#fff3c8" />
      {each(0, w, 480, (x, i) => puff(R(x + 60 + hs(i, 1) * 200), R(70 + hs(i, 2) * 80), R(0.5 + hs(i, 3) * 0.4), '#fff4dc', 0.8, '#e8a860'))}
      {each(0, w, 600, (x, i) => (
        <path d={`M${R(x + 100 + hs(i, 4) * 300)} ${R(160 + hs(i, 5) * 60)} q6 -6 12 0 q6 -6 12 0`} stroke="#6b4a2a" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.5} />
      ))}
    </g>
  ),
  far: (len) => (
    <g>
      <path d={ridgeD(len, 300, 430, 60, 41)} fill="#d8b48a" opacity={0.7} />
      {each(0, len, 520, (x, i) => {
        const cx = R(x + 80 + hs(i, 1) * 320),
          s = R(0.7 + hs(i, 2) * 0.5);
        const tiers: ReactNode[] = [];
        for (let t = 0; t < 5; t++) {
          const hw = R((70 - t * 12) * s),
            y = R(470 - (t + 1) * 28 * s);
          tiers.push(<rect key={t} x={R(cx - hw)} y={y} width={R(hw * 2)} height={R(28 * s + 1)} fill="#b8966f" />);
          tiers.push(<rect key={`h${t}`} x={R(cx - hw)} y={y} width={R(hw * 2)} height={3} fill="#e0c49a" opacity={0.6} />);
        }
        const top = R(470 - 5 * 28 * s);
        return (
          <g opacity={0.85}>
            {tiers}
            <path d={`M${R(cx - 12 * s)} ${top} Q${cx} ${R(top - 34 * s)} ${R(cx + 12 * s)} ${top} Z`} fill="#b8966f" />
            <rect x={cx - 1.5} y={R(top - 52 * s)} width={3} height={R(22 * s)} fill="#b8966f" />
            <rect x={R(cx - 8 * s)} y={R(470 - 34 * s)} width={R(16 * s)} height={R(34 * s)} rx={R(8 * s)} fill="#8a6a48" />
          </g>
        );
      })}
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 240, (x, i) => {
        const cx = R(x + 40 + hs(i, 3) * 160),
          v = hs(i, 4);
        if (v < 0.7) {
          const broken = hs(i, 5) < 0.45,
            h = broken ? R(70 + hs(i, 6) * 50) : 150;
          return (
            <g>
              <ellipse cx={cx} cy={461} rx={30} ry={5} fill="#000" opacity={0.12} />
              <rect x={cx - 26} y={446} width={52} height={14} rx={2} fill="url(#kr-ck-stone)" />
              <rect x={cx - 18} y={460 - h} width={36} height={h - 14} fill="url(#kr-ck-col)" />
              <path d={`M${cx - 8} ${460 - h + 4} V446 M${cx + 2} ${460 - h + 4} V446 M${cx + 11} ${460 - h + 4} V446`} stroke="#7e6644" strokeOpacity={0.35} strokeWidth={2} />
              {broken ? (
                <path d={`M${cx - 18} ${460 - h} l8 -10 l6 6 l8 -12 l6 8 l8 -4 v12 Z`} fill="url(#kr-ck-col)" />
              ) : (
                <g>
                  <rect x={cx - 26} y={296} width={52} height={14} rx={2} fill="url(#kr-ck-stone)" />
                  <rect x={cx - 22} y={306} width={44} height={6} fill="#9a8058" />
                </g>
              )}
              {hs(i, 7) < 0.5 && (
                <g>
                  <path d={`M${cx - 18} ${460 - h + 10} q16 20 0 40 q-12 20 6 40`} stroke="#4f8f3a" strokeWidth={3} fill="none" />
                  {[0, 1, 2, 3].map((j) => (
                    <ellipse key={j} cx={cx - 14 + (j % 2) * 8} cy={460 - h + 20 + j * 18} rx={5} ry={3} fill="#6fb04a" transform={`rotate(${j % 2 ? 30 : -30} ${cx - 14 + (j % 2) * 8} ${460 - h + 20 + j * 18})`} />
                  ))}
                </g>
              )}
            </g>
          );
        }
        // stupa kecil berlubang
        return (
          <g>
            <ellipse cx={cx} cy={461} rx={34} ry={5} fill="#000" opacity={0.12} />
            <rect x={cx - 32} y={440} width={64} height={20} rx={2} fill="url(#kr-ck-stone)" />
            <path d={`M${cx - 28} 440 Q${cx - 30} 384 ${cx} 380 Q${cx + 30} 384 ${cx + 28} 440 Z`} fill="url(#kr-ck-rock)" />
            {[-14, 0, 14].map((dx) => (
              <path key={dx} d={`M${cx + dx} 402 l5 7 l-5 7 l-5 -7 Z M${cx + dx + 7} 420 l5 7 l-5 7 l-5 -7 Z`} fill="#5e4a2a" opacity={0.7} />
            ))}
            <rect x={cx - 4} y={362} width={8} height={20} rx={2} fill="url(#kr-ck-col)" />
          </g>
        );
      })}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    return (
      <g>
        <rect x={x0} y={460} width={w} height={140} fill="#8a714c" />
        <rect x={x0} y={460} width={w} height={28} fill="url(#kr-ck-slab)" />
        <rect x={x0} y={488} width={w} height={36} fill="url(#kr-ck-course)" />
        <rect x={x0} y={524} width={w} height={76} fill="url(#kr-ck-slab)" opacity={0.55} />
        <rect x={x0} y={524} width={w} height={76} fill="#5e4a2a" opacity={0.35} />
        <rect x={x0} y={459} width={w} height={3} fill="#fff4dc" opacity={0.8} />
        {eachIn(x0, x1, 140, (x, i) =>
          hs(i, 1) < 0.45 ? <path d={`M${R(x + 20 + hs(i, 2) * 90)} 461 q3 -10 7 -2 q3 -9 6 0`} stroke="#6fb04a" strokeWidth={2.5} fill="none" strokeLinecap="round" /> : null,
        )}
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={456} width={100} height={144} fill="url(#kr-ck-pit)" />
      {[0, 1, 2, 3, 4].map((j) => (
        <g key={j}>
          <rect x={x} y={462 + j * 28} width={14} height={26} fill="#8a714c" opacity={1 - j * 0.15} />
          <rect x={x + 86} y={476 + j * 26} width={14} height={24} fill="#6b5638" opacity={1 - j * 0.15} />
        </g>
      ))}
      <rect x={x} y={540} width={100} height={60} fill="#000" opacity={0.4} />
      {/* sarang laba-laba di sudut */}
      <path d={`M${x + 14} 464 l22 0 M${x + 14} 464 l0 22 M${x + 14} 464 l16 16 M${x + 24} 464 q-2 8 -10 10 M${x + 32} 464 q-4 14 -18 18`} stroke="#fff" strokeOpacity={0.45} strokeWidth={1} fill="none" />
      <path d={`M${x + 84} 462 q4 20 -2 36 q-4 14 2 26`} stroke="#4f8f3a" strokeWidth={3} fill="none" />
      <rect x={x - 4} y={456} width={20} height={6} fill="#cdb68e" />
      <rect x={x + 84} y={456} width={20} height={6} fill="#cdb68e" />
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    if (v === 0)
      return lowAt(
        x,
        <g>
          <rect x={-30} y={-50} width={60} height={50} rx={4} fill="url(#kr-ck-stone)" stroke="#7e6644" strokeWidth={2} />
          <rect x={-30} y={-50} width={60} height={6} rx={3} fill="#f0e2c4" />
          <rect x={-22} y={-38} width={44} height={28} rx={3} fill="none" stroke="#8a714c" strokeWidth={2} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx={0} cy={-30} rx={3} ry={7} fill="#9a8058" transform={`rotate(${a} 0 -24)`} />
          ))}
          <circle cx={0} cy={-24} r={3.5} fill="#7e6644" />
          <path d="M20 -6 l-6 -8 l4 -6" stroke="#7e6644" strokeWidth={1.5} fill="none" />
        </g>,
        36,
      );
    if (v === 1)
      return lowAt(
        x,
        <g>
          <rect x={-28} y={-12} width={56} height={12} rx={2} fill="url(#kr-ck-stone)" stroke="#6b5638" strokeWidth={2} />
          <path d="M-20 -12 V-56 l8 -8 l6 6 l10 -12 l6 10 l10 -4 V-12 Z" fill="url(#kr-ck-col)" stroke="#6b5638" strokeWidth={2} strokeLinejoin="round" />
          <path d="M-10 -14 V-54 M0 -14 V-58 M10 -14 V-56" stroke="#7e6644" strokeOpacity={0.35} strokeWidth={2} />
          <path d="M-20 -30 q-10 -4 -12 -16 q10 4 12 16" fill="#6fb04a" />
        </g>,
        32,
      );
    return lowAt(
      x,
      <g>
        <path d="M-36 0 Q-38 -32 -12 -44 Q12 -52 28 -36 Q40 -22 36 0 Z" fill="url(#kr-ck-rock)" stroke="#6b5638" strokeWidth={2} />
        <path d="M-24 -32 Q-10 -44 8 -42" stroke="#fff" strokeOpacity={0.55} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M-36 0 Q-30 -14 -14 -10 Q0 -20 14 -12 Q26 -18 36 0 Z" fill="#6e9b3a" opacity={0.75} />
        <path d="M12 -44 q-2 -14 8 -18 M14 -44 q8 -10 16 -6" stroke="#4f8f3a" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>,
    );
  },
  fly: (x, k) => flyAt(x, k, k % 2 === 0 ? bat('#5b4a7a', '#8a78b0', '#ffd23f') : bat('#6b4a3a', '#a07a5a', '#ffe680'), 26),
  finish: (x) =>
    gate(
      x,
      '#cdb68e',
      '#7e6644',
      <g>
        {[x - 47, x + 47].map((px) => (
          <g key={px}>
            <rect x={px - 11} y={276} width={22} height={12} rx={2} fill="url(#kr-ck-stone)" />
            <rect x={px - 8} y={266} width={16} height={10} rx={2} fill="url(#kr-ck-stone)" />
            <path d={`M${px - 6} 266 Q${px} 248 ${px + 6} 266 Z`} fill="#cdb68e" />
          </g>
        ))}
        {[-36, -24, -12, 0, 12, 24, 36].map((dx) => (
          <circle key={dx} cx={x + dx} cy={R(334 + (1 - (dx / 44) ** 2) * 8)} r={4} fill="#ff9f1a" stroke="#e07a00" strokeWidth={1} />
        ))}
      </g>,
      '#5e4a2a',
    ),
  words: { low: 'batu candi', fly: 'kelelawar', gap: 'lubang' },
};

/* =====================================================================
 * 5. Sirkuit Balap
 * ===================================================================== */

const tire = (y: number, band?: string) => (
  <g>
    <rect x={-30} y={y} width={60} height={20} rx={9} fill="url(#kr-sb-tire)" />
    {band && <rect x={-30} y={y + 7} width={60} height={6} fill={band} />}
    <path d={`M-22 ${y + 2} v16 M-12 ${y + 2} v16 M-2 ${y + 2} v16 M8 ${y + 2} v16 M18 ${y + 2} v16`} stroke="#000" strokeOpacity={0.35} strokeWidth={2} />
    <rect x={-26} y={y + 2} width={52} height={3.5} rx={1.7} fill="#fff" opacity={0.18} />
  </g>
);
const drone = (accent: string) => (
  <g>
    <path d="M-16 -2 L-28 -10 M16 -2 L28 -10" stroke="#5b6578" strokeWidth={4} strokeLinecap="round" />
    <rect x={-30} y={-14} width={4} height={6} fill="#5b6578" />
    <rect x={26} y={-14} width={4} height={6} fill="#5b6578" />
    <ellipse cx={-28} cy={-15} rx={17} ry={3} fill="#9fb3c8" opacity={0.75} className="ka-flap" />
    <ellipse cx={28} cy={-15} rx={17} ry={3} fill="#9fb3c8" opacity={0.75} className="ka-flap" />
    <rect x={-18} y={-8} width={36} height={14} rx={6} fill="#eef2f7" stroke="#7b8594" strokeWidth={2} />
    <rect x={-18} y={-8} width={36} height={4} rx={2} fill={accent} />
    <circle cx={-8} cy={10} r={5} fill="#2b3040" />
    <circle cx={-9.5} cy={8.5} r={1.8} fill="#7df9ff" />
    <circle cx={12} cy={0} r={2.4} fill="#ff4d4d" className="robi-led" />
  </g>
);

const sirkuit: RunnerTheme = {
  name: 'Sirkuit Balap',
  bg: '#e9eef5',
  ink: '#1f2a44',
  defs: (
    <>
      <linearGradient id="kr-sb-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4aa8ff" />
        <stop offset="0.7" stopColor="#bde0ff" />
        <stop offset="1" stopColor="#eaf5ff" />
      </linearGradient>
      <linearGradient id="kr-sb-asph" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a505c" />
        <stop offset="1" stopColor="#262a33" />
      </linearGradient>
      <linearGradient id="kr-sb-hill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9bd07a" />
        <stop offset="1" stopColor="#6fae52" />
      </linearGradient>
      <radialGradient id="kr-sb-tire" cx="0.5" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#5a5f68" />
        <stop offset="1" stopColor="#15171b" />
      </radialGradient>
      <linearGradient id="kr-sb-pit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6b4a2a" />
        <stop offset="1" stopColor="#1a0f06" />
      </linearGradient>
      <linearGradient id="kr-sb-cone" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ff9a3a" />
        <stop offset="1" stopColor="#d9600a" />
      </linearGradient>
      <pattern id="kr-sb-grain" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="7" r="1.2" fill="#fff" opacity="0.12" />
        <circle cx="19" cy="15" r="1" fill="#000" opacity="0.25" />
        <circle cx="12" cy="25" r="1.3" fill="#fff" opacity="0.08" />
        <circle cx="26" cy="4" r="0.9" fill="#000" opacity="0.2" />
      </pattern>
      <pattern id="kr-sb-kerb" x="0" y="456" width="80" height="12" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="40" height="12" fill="#e8384f" />
        <rect x="40" y="0" width="40" height="12" fill="#ffffff" />
        <rect x="0" y="0" width="80" height="3" fill="#fff" opacity="0.35" />
        <rect x="0" y="9" width="80" height="3" fill="#000" opacity="0.18" />
      </pattern>
      <pattern id="kr-sb-crowd" width="18" height="16" patternUnits="userSpaceOnUse">
        <rect width="18" height="16" fill="#cfd6e0" />
        <circle cx="4.5" cy="5" r="3.2" fill="#ff6b6b" />
        <circle cx="13.5" cy="5" r="3.2" fill="#4dabf7" />
        <circle cx="9" cy="12" r="3.2" fill="#ffd43b" />
        <circle cx="4.5" cy="3.8" r="1.6" fill="#f2c9a0" />
        <circle cx="13.5" cy="3.8" r="1.6" fill="#8a5a3a" />
        <circle cx="9" cy="10.8" r="1.6" fill="#f2c9a0" />
      </pattern>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-sb-sky)" />
      {each(0, w, 400, (x, i) => puff(R(x + 50 + hs(i, 1) * 200), R(60 + hs(i, 2) * 90), R(0.6 + hs(i, 3) * 0.4)))}
      {/* balon udara panjang (blimp) */}
      <g className="ka-swim">
        <ellipse cx={R(w * 0.35)} cy={120} rx={70} ry={24} fill="#eef2f7" stroke="#9aa6b4" strokeWidth={2} />
        <rect x={R(w * 0.35 - 70)} y={114} width={140} height={10} fill="#e8384f" />
        <path d={`M${R(w * 0.35 + 60)} 112 l22 -14 l0 44 l-22 -14 Z`} fill="#c9d2e0" />
        <rect x={R(w * 0.35 - 14)} y={142} width={28} height={9} rx={4} fill="#5b6578" />
        <ellipse cx={R(w * 0.35 - 20)} cy={108} rx={30} ry={6} fill="#fff" opacity={0.6} />
      </g>
    </g>
  ),
  far: (len) => (
    <g>
      {each(0, len, 70, (x, i) => {
        const h = R(60 + hs(i, 1) * 140),
          bw = R(46 + hs(i, 2) * 24);
        return (
          <g>
            <rect x={x} y={470 - h} width={bw} height={h} fill="#a9bdd6" />
            <rect x={x} y={470 - h} width={bw} height={4} fill="#c9d8ea" />
            {hs(i, 3) < 0.3 && <rect x={R(x + bw / 2 - 1)} y={R(470 - h - 24)} width={2} height={24} fill="#a9bdd6" />}
          </g>
        );
      })}
      <path d={ridgeD(len, 280, 450, 40, 51)} fill="url(#kr-sb-hill)" />
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 560, (x, i) => (
        <g>
          {/* tribun penonton */}
          <rect x={x} y={372} width={300} height={88} fill="#e4e8ee" />
          <rect x={x + 6} y={378} width={288} height={60} fill="url(#kr-sb-crowd)" />
          <path d={`M${x} 438 H${x + 300}`} stroke="#9aa6b4" strokeWidth={2} />
          <path d={`M${x - 14} 372 L${x + 314} 372 L${x + 300} 346 L${x} 346 Z`} fill={hs(i, 1) < 0.5 ? '#e8384f' : '#2f80ed'} />
          <path d={`M${x - 14} 372 L${x + 314} 372`} stroke="#fff" strokeWidth={3} opacity={0.6} />
          {[0, 1, 2, 3, 4].map((j) => (
            <g key={j}>
              <rect x={x + j * 60} y={440} width={60} height={20} fill={['#ffd23f', '#3b82f6', '#22c55e', '#f97316', '#a855f7'][(j + i) % 5]} />
              <path d={`M${x + j * 60 + 10} 450 h40`} stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
            </g>
          ))}
          {/* menara lampu */}
          <rect x={x + 420} y={260} width={8} height={200} fill="#8a96a8" />
          <path d={`M${x + 424} 460 L${x + 408} 460 L${x + 420} 400 Z`} fill="#8a96a8" />
          <rect x={x + 398} y={242} width={52} height={22} rx={3} fill="#5b6578" />
          {[0, 1, 2, 3].map((j) => (
            <circle key={j} cx={x + 406 + j * 12} cy={253} r={4.5} fill="#fff8c4" className="ka-glow" />
          ))}
        </g>
      ))}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    return (
      <g>
        <rect x={x0} y={460} width={w} height={140} fill="url(#kr-sb-asph)" />
        <rect x={x0} y={466} width={w} height={134} fill="url(#kr-sb-grain)" />
        <rect x={x0} y={456} width={w} height={12} fill="url(#kr-sb-kerb)" />
        <rect x={x0} y={468} width={w} height={5} fill="#000" opacity={0.25} />
        {eachIn(x0, x1, 120, (x) => (
          <rect x={x + 20} y={528} width={60} height={6} rx={2} fill="#fff" opacity={0.85} />
        ))}
        {eachIn(x0, x1, 500, (x, i) =>
          hs(i, 1) < 0.5 ? <path d={`M${x + 60} ${R(500 + hs(i, 2) * 50)} q120 -10 260 4`} stroke="#000" strokeOpacity={0.25} strokeWidth={6} fill="none" strokeLinecap="round" /> : null,
        )}
        <rect x={x0} y={580} width={w} height={4} fill="#fff" opacity={0.7} />
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={456} width={100} height={144} fill="url(#kr-sb-pit)" />
      <path d={`M${x} 456 L${x + 10} 456 L${x + 6} 470 L${x + 12} 478 L${x + 4} 490 L${x} 490 Z`} fill="#3a3f4a" />
      <path d={`M${x + 100} 456 L${x + 90} 456 L${x + 95} 468 L${x + 88} 476 L${x + 96} 492 L${x + 100} 492 Z`} fill="#3a3f4a" />
      <rect x={x} y={540} width={100} height={60} fill="#000" opacity={0.35} />
      <ellipse cx={x + 50} cy={590} rx={34} ry={6} fill="#3b6a8a" opacity={0.6} />
      {/* pagar pembatas di kedua tepi */}
      {[x - 6, x + 92].map((bx) => (
        <g key={bx}>
          <rect x={bx} y={430} width={14} height={28} rx={2} fill="#fff" stroke="#9aa6b4" strokeWidth={1.5} />
          <path d={`M${bx} 440 l14 -8 M${bx} 452 l14 -8 M${bx} 458 l8 -4`} stroke="#e8384f" strokeWidth={4} />
          <circle cx={bx + 7} cy={426} r={4} fill="#ffb000" className="robi-led" />
        </g>
      ))}
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    if (v === 0)
      return lowAt(
        x,
        <g>
          {tire(-20)}
          {tire(-40)}
        </g>,
        34,
      );
    if (v === 1)
      return lowAt(
        x,
        <g>
          {tire(-20)}
          {tire(-40)}
          {tire(-60)}
        </g>,
        34,
      );
    return lowAt(
      x,
      <g>
        {tire(-20, '#e8384f')}
        {tire(-40, '#ffffff')}
        {tire(-60, '#e8384f')}
      </g>,
      34,
    );
  },
  fly: (x, k) => flyAt(x, k, drone(k % 2 === 0 ? '#ff6b3d' : '#2f80ed'), 26),
  finish: (x) =>
    gate(
      x,
      '#dfe6ee',
      '#6b7788',
      <g>
        <rect x={x - 30} y={270} width={60} height={20} rx={5} fill="#2b3040" />
        {[-20, -10, 0, 10, 20].map((dx) => (
          <circle key={dx} cx={x + dx} cy={280} r={4} fill="#3ddc6b" className="ka-glow" />
        ))}
        <g transform={`translate(${x + 60} 460)`}>
          <rect x={-2} y={-150} width={4} height={150} fill="#6b7788" />
          <g className="ka-sway">
            {[0, 1, 2, 3].map((c) =>
              [0, 1, 2].map((r) => <rect key={`${c}${r}`} x={2 + c * 9} y={-150 + r * 9} width={9} height={9} fill={(c + r) % 2 ? '#fff' : '#1f2a44'} />),
            )}
          </g>
        </g>
      </g>,
      '#1f2a44',
    ),
  words: { low: 'ban', fly: 'drone', gap: 'parit' },
};

/* =====================================================================
 * 6. Atap Gedung
 * ===================================================================== */

const pigeon = (body: string, neck: string) => (
  <g>
    <path d="M14 -2 L34 -8 L32 4 Z" fill={body} />
    <ellipse cx={2} cy={0} rx={20} ry={12} fill={body} />
    <ellipse cx={-10} cy={-4} rx={9} ry={9} fill={neck} />
    <circle cx={-15} cy={-10} r={8} fill={body} />
    <path d="M-22 -11 L-30 -8 L-22 -6 Z" fill="#e8a060" />
    <circle cx={-17} cy={-12} r={2.6} fill="#ff7a3a" />
    <circle cx={-17.4} cy={-12} r={1.2} fill="#1b1020" />
    <path d="M4 10 l-2 6 M10 10 l0 6" stroke="#e86a6a" strokeWidth={2} strokeLinecap="round" />
    <g className="ka-flap">
      <path d="M-4 -4 Q6 -34 28 -26 Q18 -14 14 0 Z" fill={body} stroke="#6b7488" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M12 -20 l8 2 M8 -14 l8 2" stroke="#6b7488" strokeWidth={1.5} />
    </g>
  </g>
);

const atap: RunnerTheme = {
  name: 'Atap Gedung',
  bg: '#f1e8ee',
  ink: '#2b3550',
  defs: (
    <>
      <linearGradient id="kr-ag-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7a8fd6" />
        <stop offset="0.45" stopColor="#ff9f86" />
        <stop offset="1" stopColor="#ffe3bf" />
      </linearGradient>
      <radialGradient id="kr-ag-sun">
        <stop offset="0" stopColor="#fff4d0" />
        <stop offset="0.35" stopColor="#ffb86a" stopOpacity="0.85" />
        <stop offset="1" stopColor="#ff8a5a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="kr-ag-bldg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6e6794" />
        <stop offset="1" stopColor="#4f4872" />
      </linearGradient>
      <linearGradient id="kr-ag-roof" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d6d9e0" />
        <stop offset="1" stopColor="#a3a8b4" />
      </linearGradient>
      <linearGradient id="kr-ag-alley" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a4262" />
        <stop offset="1" stopColor="#15121f" />
      </linearGradient>
      <linearGradient id="kr-ag-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffe9a8" />
        <stop offset="1" stopColor="#ffb85a" />
      </linearGradient>
      <linearGradient id="kr-ag-metal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8a93a6" />
        <stop offset="0.4" stopColor="#e6ebf2" />
        <stop offset="1" stopColor="#6b7488" />
      </linearGradient>
      <pattern id="kr-ag-brick" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect width="40" height="20" fill="#a95a44" />
        <path d="M0 10 H40 M0 20 H40 M20 0 V10 M0 10 V20 M40 10 V20" stroke="#7a3a2a" strokeWidth="1.6" />
        <rect x="2" y="2" width="16" height="2" fill="#fff" opacity="0.12" />
        <rect x="22" y="12" width="16" height="2" fill="#fff" opacity="0.1" />
      </pattern>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-ag-sky)" />
      <circle cx={R(w * 0.22)} cy={340} r={150} fill="url(#kr-ag-sun)" />
      <circle cx={R(w * 0.22)} cy={340} r={58} fill="#ffe7a8" />
      {each(0, w, 360, (x, i) => (
        <g opacity={0.7}>
          <ellipse cx={R(x + 80 + hs(i, 1) * 200)} cy={R(150 + hs(i, 2) * 120)} rx={R(70 + hs(i, 3) * 40)} ry={8} fill="#ffc7b8" />
          <ellipse cx={R(x + 110 + hs(i, 1) * 200)} cy={R(142 + hs(i, 2) * 120)} rx={40} ry={6} fill="#ffe0d6" />
        </g>
      ))}
      {each(0, w, 140, (x, i) => (hs(i, 4) < 0.35 ? <circle cx={R(x + hs(i, 5) * 120)} cy={R(20 + hs(i, 6) * 80)} r={1.6} fill="#fff" className="ka-twinkle" style={{ animationDelay: `${R(-hs(i, 7) * 2)}s` }} /> : null))}
    </g>
  ),
  far: (len) => (
    <g>
      {each(0, len, 90, (x, i) => {
        const h = R(110 + hs(i, 1) * 150),
          bw = R(64 + hs(i, 2) * 22);
        const wins: ReactNode[] = [];
        for (let j = 0; j < 6; j++)
          if (hs(i * 7 + j, 3) < 0.35)
            wins.push(<rect key={j} x={R(x + 8 + (j % 3) * 18)} y={R(470 - h + 16 + Math.floor(j / 3) * 30 + hs(i, 4) * 40)} width={9} height={12} fill="#ffe29a" opacity={0.75} />);
        return (
          <g>
            <rect x={x} y={470 - h} width={bw} height={h} fill="#8a7eae" />
            <rect x={x} y={470 - h} width={bw} height={5} fill="#a99fcc" />
            {hs(i, 5) < 0.35 && <path d={`M${R(x + bw / 2)} ${470 - h} v-34`} stroke="#8a7eae" strokeWidth={3} />}
            {hs(i, 5) < 0.35 && <circle cx={R(x + bw / 2)} cy={R(470 - h - 34)} r={3} fill="#ff4d5e" className="robi-led" />}
            {wins}
          </g>
        );
      })}
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 340, (x, i) => {
        const h = R(80 + hs(i, 1) * 70),
          bx = R(x + hs(i, 2) * 100);
        const wins: ReactNode[] = [];
        for (let r = 0; r < 2; r++)
          for (let c = 0; c < 4; c++)
            wins.push(<rect key={`${r}${c}`} x={bx + 16 + c * 40} y={R(460 - h + 20 + r * 34)} width={22} height={22} rx={2} fill={hs(i * 9 + r * 4 + c, 6) < 0.45 ? 'url(#kr-ag-glass)' : '#3a3458'} />);
        return (
          <g>
            <rect x={bx} y={460 - h} width={176} height={h} fill="url(#kr-ag-bldg)" />
            <rect x={bx - 4} y={460 - h - 6} width={184} height={8} fill="#7c75a4" />
            {wins}
            {hs(i, 3) < 0.55 ? (
              // tangki air di atas kaki
              <g>
                <path d={`M${bx + 120} ${460 - h - 6} l6 -30 M${bx + 156} ${460 - h - 6} l-6 -30`} stroke="#4f4872" strokeWidth={4} />
                <rect x={bx + 112} y={R(460 - h - 76)} width={52} height={42} rx={6} fill="#8a6a5a" />
                <path d={`M${bx + 108} ${R(460 - h - 76)} L${bx + 138} ${R(460 - h - 96)} L${bx + 168} ${R(460 - h - 76)} Z`} fill="#6b4a3a" />
                <path d={`M${bx + 112} ${R(460 - h - 62)} h52 M${bx + 112} ${R(460 - h - 48)} h52`} stroke="#6b4a3a" strokeWidth={2} />
              </g>
            ) : (
              <g>
                <path d={`M${bx + 30} ${460 - h - 6} v-60 M${bx + 20} ${460 - h - 50} h20 M${bx + 22} ${460 - h - 36} h16`} stroke="#4f4872" strokeWidth={3} />
                <circle cx={bx + 30} cy={460 - h - 66} r={3.5} fill="#ff4d5e" className="robi-led" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    return (
      <g>
        <rect x={x0} y={472} width={w} height={128} fill="url(#kr-ag-brick)" />
        {eachIn(x0, x1, 110, (x, i) => (
          <g>
            <rect x={x + 28} y={500} width={50} height={56} rx={3} fill="#5a3a30" />
            <rect x={x + 32} y={504} width={42} height={48} fill={hs(i, 1) < 0.5 ? 'url(#kr-ag-glass)' : '#3a3458'} />
            <path d={`M${x + 53} 504 v48 M${x + 32} 528 h42`} stroke="#5a3a30" strokeWidth={3} />
            <rect x={x + 24} y={556} width={58} height={6} rx={2} fill="#d6d9e0" />
            <path d={`M${x + 36} 508 l10 -2`} stroke="#fff" strokeWidth={2} opacity={0.5} />
          </g>
        ))}
        {eachIn(x0, x1, 440, (x) => (
          <g>
            <rect x={x + 94} y={472} width={7} height={128} fill="#7b8594" />
            <rect x={x + 92} y={520} width={11} height={4} fill="#5b6578" />
          </g>
        ))}
        <rect x={x0} y={456} width={w} height={16} fill="url(#kr-ag-roof)" />
        <rect x={x0} y={456} width={w} height={3} fill="#fff" opacity={0.8} />
        <rect x={x0} y={472} width={w} height={6} fill="#000" opacity={0.25} />
        {eachIn(x0, x1, 60, (x) => (
          <path d={`M${x + 30} 458 v12`} stroke="#8a93a6" strokeWidth={1.5} opacity={0.6} />
        ))}
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={456} width={100} height={144} fill="url(#kr-ag-alley)" />
      <rect x={x} y={456} width={10} height={144} fill="#7a3a2a" opacity={0.8} />
      <rect x={x + 90} y={456} width={10} height={144} fill="#5a2a1e" opacity={0.8} />
      {/* jemuran melintang */}
      <path d={`M${x + 10} 492 Q${x + 50} 506 ${x + 90} 492`} stroke="#d6d9e0" strokeWidth={1.5} fill="none" />
      <path d={`M${x + 24} 497 h14 v14 h-3 v-8 h-2 v14 h-6 v-14 h-2 v8 h-3 Z`} fill="#ff6b6b" />
      <rect x={x + 50} y={500} width={12} height={16} rx={2} fill="#4dabf7" />
      <path d={`M${x + 70} 498 h10 l-2 14 h-6 Z`} fill="#ffd43b" />
      {/* jalan jauh di bawah */}
      <rect x={x + 10} y={580} width={80} height={20} fill="#2a2535" />
      <path d={`M${x + 16} 590 h12 M${x + 44} 590 h12 M${x + 72} 590 h12`} stroke="#ffd23f" strokeWidth={2} opacity={0.6} />
      <circle cx={x + 30} cy={584} r={2.4} fill="#fff8c4" className="ka-glow" />
      <circle cx={x + 38} cy={584} r={2.4} fill="#fff8c4" className="ka-glow" />
      <rect x={x - 4} y={456} width={16} height={16} fill="url(#kr-ag-roof)" />
      <rect x={x + 88} y={456} width={16} height={16} fill="url(#kr-ag-roof)" />
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    if (v === 0)
      return lowAt(
        x,
        <g>
          <rect x={-18} y={-58} width={36} height={58} fill="url(#kr-ag-brick)" stroke="#6b2a1e" strokeWidth={2} />
          <rect x={-22} y={-64} width={44} height={9} rx={2} fill="#8a4a37" />
          <rect x={-22} y={-64} width={44} height={3} fill="#fff" opacity={0.3} />
          <circle cx={-2} cy={-78} r={9} fill="#d6d9e0" opacity={0.7} className="ka-smoke" />
          <circle cx={6} cy={-94} r={12} fill="#e6ebf2" opacity={0.6} className="ka-smoke" style={{ animationDelay: '-2s' }} />
        </g>,
        28,
      );
    if (v === 1)
      return lowAt(
        x,
        <g>
          <rect x={-12} y={-44} width={24} height={44} fill="url(#kr-ag-metal)" />
          <path d="M-12 -30 h24 M-12 -14 h24" stroke="#5b6578" strokeWidth={1.5} />
          <path d="M-22 -44 Q0 -64 22 -44 Z" fill="url(#kr-ag-metal)" stroke="#5b6578" strokeWidth={1.5} />
          <rect x={-2} y={-52} width={4} height={8} fill="#5b6578" />
        </g>,
        26,
      );
    return lowAt(
      x,
      <g>
        <rect x={-30} y={-40} width={60} height={40} fill="url(#kr-ag-brick)" stroke="#6b2a1e" strokeWidth={2} />
        <rect x={-34} y={-46} width={68} height={8} rx={2} fill="#8a4a37" />
        <rect x={-20} y={-60} width={12} height={16} rx={2} fill="#c96a4a" />
        <rect x={8} y={-56} width={12} height={12} rx={2} fill="#c96a4a" />
        <rect x={-34} y={-46} width={68} height={3} fill="#fff" opacity={0.3} />
      </g>,
      36,
    );
  },
  fly: (x, k) => flyAt(x, k, k % 2 === 0 ? pigeon('#9aa3b5', '#6fae8a') : pigeon('#f3f5fa', '#d6dcef'), 22),
  finish: (x) =>
    gate(
      x,
      '#dfe3ea',
      '#6b7080',
      <g>
        <path d={`M${x - 47} 288 Q${x} 318 ${x + 47} 288`} stroke="#3a3458" strokeWidth={1.5} fill="none" />
        {[-36, -24, -12, 0, 12, 24, 36].map((dx, j) => (
          <circle key={dx} cx={x + dx} cy={R(288 + (1 - (dx / 47) ** 2) * 15 + 4)} r={4} fill={['#ffd23f', '#ff6b6b', '#4dabf7', '#3ddc6b'][j % 4]} className="ka-twinkle" style={{ animationDelay: `${-j * 0.3}s` }} />
        ))}
        <path d={`M${x + 47} 286 v-30 l24 8 l-24 8`} fill="#ff6b6b" stroke="#6b7080" strokeWidth={1.5} />
      </g>,
      '#2b3550',
    ),
  words: { low: 'cerobong', fly: 'merpati', gap: 'celah' },
};

/* =====================================================================
 * 7. Negeri Awan
 * ===================================================================== */

const RAINBOW = ['#ff5a5a', '#ff9f1a', '#ffd23f', '#3ddc6b', '#3b9cff', '#9b6bff'];
const plane = (body: string, wing: string) => (
  <g>
    <path d="M30 -4 L44 -22 L48 -22 L44 -2 Z" fill={wing} />
    <path d="M-30 0 Q-30 -12 -14 -12 L30 -8 Q42 -6 42 0 Q42 6 30 6 L-14 8 Q-30 8 -30 0 Z" fill={body} stroke="#1f2a44" strokeOpacity={0.3} strokeWidth={1.5} />
    <path d="M-20 -8 Q0 -12 26 -6" stroke="#fff" strokeWidth={2.5} opacity={0.5} fill="none" strokeLinecap="round" />
    <path d="M-10 -12 Q-4 -24 8 -22 L10 -11 Z" fill="#bfefff" stroke="#1f2a44" strokeOpacity={0.3} strokeWidth={1} />
    <circle cx={0} cy={-15} r={4} fill="#2ec4a6" />
    <path d="M-8 2 L14 2 L6 16 L-4 16 Z" fill={wing} />
    <circle cx={-31} cy={0} r={4} fill="#5b6578" />
    <g transform="rotate(90 -34 0)">
      <ellipse cx={-34} cy={0} rx={17} ry={3} fill="#5b6578" opacity={0.7} className="ka-flap" />
    </g>
  </g>
);

const awan: RunnerTheme = {
  name: 'Negeri Awan',
  bg: '#eef2ff',
  ink: '#3a4a8a',
  defs: (
    <>
      <linearGradient id="kr-na-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fb8ff" />
        <stop offset="0.55" stopColor="#cfe0ff" />
        <stop offset="1" stopColor="#ffe3f1" />
      </linearGradient>
      <linearGradient id="kr-na-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#ece8fc" />
        <stop offset="1" stopColor="#c9c2ef" />
      </linearGradient>
      <linearGradient id="kr-na-hole" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8ab6f5" />
        <stop offset="1" stopColor="#d8ecff" />
      </linearGradient>
      <linearGradient id="kr-na-castle" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fbf8ff" />
        <stop offset="1" stopColor="#dcd4f7" />
      </linearGradient>
      <clipPath id="kr-na-cube">
        <rect x="-28" y="-56" width="56" height="56" rx="9" />
      </clipPath>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-na-sky)" />
      <g opacity={0.4}>
        {RAINBOW.map((c, j) => (
          <path key={c} d={`M${R(w * 0.5 - 360 + j * 12)} 520 A${360 - j * 12} ${360 - j * 12} 0 0 1 ${R(w * 0.5 + 360 - j * 12)} 520`} stroke={c} strokeWidth={12} fill="none" />
        ))}
      </g>
      {each(0, w, 340, (x, i) => puff(R(x + 40 + hs(i, 1) * 200), R(70 + hs(i, 2) * 140), R(0.6 + hs(i, 3) * 0.5), '#fff', 0.95, '#b9b0ea'))}
      {each(0, w, 110, (x, i) => (hs(i, 4) < 0.5 ? sparkle(R(x + hs(i, 5) * 90), R(30 + hs(i, 6) * 260), 0.8, '#fff', hs(i, 7) * 2) : null))}
    </g>
  ),
  far: (len) => (
    <g>
      <path d={ridgeD(len, 120, 440, 50, 71)} fill="#ffffff" opacity={0.7} />
      {each(0, len, 720, (x, i) => {
        if (hs(i, 1) > 0.65) return null;
        const cx = R(x + 150 + hs(i, 2) * 400);
        return (
          <g opacity={0.9}>
            {puff(cx - 110, 420, 1.3, '#fbf8ff', 1, '#b9b0ea')}
            {[
              [-60, 90, 24],
              [0, 140, 30],
              [60, 100, 24],
            ].map(([dx, h, hw]) => (
              <g key={dx}>
                <rect x={cx + dx - hw} y={430 - h} width={hw * 2} height={h} fill="url(#kr-na-castle)" />
                <path d={`M${cx + dx - hw - 6} ${430 - h} L${cx + dx} ${430 - h - 40} L${cx + dx + hw + 6} ${430 - h} Z`} fill="#ff9ec7" />
                <rect x={cx + dx - 6} y={430 - h + 20} width={12} height={18} rx={6} fill="#b9b0ea" />
                <path d={`M${cx + dx} ${430 - h - 40} v-16 l14 5 l-14 5`} stroke="#9b6bff" strokeWidth={1.5} fill="#ffd23f" />
              </g>
            ))}
            {puff(cx - 80, 440, 1.1, '#ffffff', 1, '#b9b0ea')}
          </g>
        );
      })}
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 300, (x, i) => (
        <g>
          {puff(R(x + hs(i, 1) * 120), R(420 + hs(i, 2) * 10), R(0.9 + hs(i, 3) * 0.5), '#ffffff', 1, '#b9b0ea')}
          {hs(i, 4) < 0.3 && (
            <g className="ka-bob" style={{ animationDelay: `${R(-hs(i, 5) * 2)}s` }}>
              <path d={`M${x + 200} 250 Q${x + 170} 210 ${x + 200} 190 Q${x + 230} 210 ${x + 200} 250 Z`} fill={RAINBOW[Math.abs(i) % 6]} />
              <ellipse cx={x + 200} cy={225} rx={30} ry={34} fill={RAINBOW[Math.abs(i) % 6]} />
              <path d={`M${x + 200} 191 V259 M${x + 185} 196 Q${x + 180} 225 ${x + 190} 256 M${x + 215} 196 Q${x + 220} 225 ${x + 210} 256`} stroke="#fff" strokeOpacity={0.5} strokeWidth={2} fill="none" />
              <path d={`M${x + 190} 258 l2 14 M${x + 210} 258 l-2 14`} stroke="#6b4a2a" strokeWidth={1.5} />
              <rect x={x + 191} y={272} width={18} height={12} rx={2} fill="#b07a44" />
            </g>
          )}
        </g>
      ))}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    return (
      <g>
        <rect x={x0} y={468} width={w} height={132} fill="url(#kr-na-floor)" />
        {eachIn(x0, x1, 36, (x, i) => (
          <circle cx={x + 18} cy={474} r={R(15 + hs(i, 1) * 2)} fill="#fff" />
        ))}
        {eachIn(x0, x1, 36, (x) => (
          <ellipse cx={x + 12} cy={466} rx={6} ry={3} fill="#fff" opacity={0.9} />
        ))}
        {eachIn(x0, x1, 60, (x, i) => (
          <circle cx={x + 30} cy={R(530 + hs(i, 2) * 30)} r={R(18 + hs(i, 3) * 10)} fill="#d6cff5" opacity={0.6} />
        ))}
        {eachIn(x0, x1, 150, (x, i) => sparkle(R(x + 20 + hs(i, 4) * 110), R(500 + hs(i, 5) * 60), 0.7, '#ffd23f', hs(i, 6) * 2))}
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={454} width={100} height={146} fill="url(#kr-na-hole)" />
      {puff(x + 26, 560, 0.35, '#fff', 0.8, '#b9b0ea')}
      <path d={`M${x + 56} 520 q4 -4 8 0 q4 -4 8 0`} stroke="#3a4a8a" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.6} />
      {[0, 1, 2, 3, 4, 5, 6].map((j) => (
        <g key={j}>
          <circle cx={x + 2} cy={466 + j * 22} r={13} fill="#fff" />
          <circle cx={x + 98} cy={470 + j * 22} r={13} fill="#f3f0ff" />
        </g>
      ))}
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    const cube = (
      <g>
        <g clipPath="url(#kr-na-cube)">
          {RAINBOW.map((c, j) => (
            <rect key={c} x={-28} y={R(-56 + (j * 56) / 6)} width={56} height={R(56 / 6 + 0.5)} fill={c} />
          ))}
        </g>
        <rect x={-28} y={-56} width={56} height={56} rx={9} fill="none" stroke="#fff" strokeWidth={3} />
        <rect x={-22} y={-52} width={20} height={6} rx={3} fill="#fff" opacity={0.55} />
      </g>
    );
    if (v === 0) return lowAt(x, cube, 34);
    if (v === 1)
      return lowAt(
        x,
        <g>
          {RAINBOW.map((c, j) => (
            <path key={c} d={`M${-40 + j * 5} 0 A${40 - j * 5} ${40 - j * 5} 0 0 1 ${40 - j * 5} 0 Z`} fill={c} />
          ))}
          <path d="M-10 0 A10 10 0 0 1 10 0 Z" fill="#fff" />
          {puff(-56, -6, 0.3, '#fff', 1, '#b9b0ea')}
          {puff(38, -6, 0.3, '#fff', 1, '#b9b0ea')}
        </g>,
        44,
      );
    return lowAt(
      x,
      <g>
        {cube}
        {puff(-20, -56, 0.35, '#fff', 1, '#b9b0ea')}
        <path d={starD(0, -28, 9)} fill="#fff" opacity={0.9} />
      </g>,
      34,
    );
  },
  fly: (x, k) => flyAt(x, k, k % 2 === 0 ? plane('#ff6b6b', '#ffd23f') : plane('#ffb000', '#3b9cff'), 30),
  finish: (x) => (
    <g>
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => <rect key={`${r}${c}`} x={x - 6 + c * 6} y={460 + r * 6} width={6} height={6} fill={(r + c) % 2 ? '#fff' : '#3a4a8a'} />),
      )}
      {RAINBOW.map((c, j) => (
        <path key={c} d={`M${x - 118 + j * 7} 462 A${118 - j * 7} ${118 - j * 7} 0 0 1 ${x + 118 - j * 7} 462`} stroke={c} strokeWidth={7.5} fill="none" />
      ))}
      <path d={`M${x - 112} 462 A112 112 0 0 1 ${x - 70} 374`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.5} strokeLinecap="round" />
      {puff(x - 150, 450, 0.7, '#fff', 1, '#b9b0ea')}
      {puff(x + 70, 450, 0.7, '#fff', 1, '#b9b0ea')}
      <path d={starD(x, 336, 16)} fill="#ffd23f" stroke="#e0a100" strokeWidth={2.5} strokeLinejoin="round" className="ka-glow" />
    </g>
  ),
  words: { low: 'balok pelangi', fly: 'pesawat', gap: 'lubang awan' },
};

/* =====================================================================
 * 8. Negeri Es Krim
 * ===================================================================== */

const SPRINKLE = ['#ff5a8a', '#ffd23f', '#3b9cff', '#3ddc6b', '#ffffff', '#9b6bff'];
const scoopD = 'M-32 0 Q-38 -18 -26 -32 Q-12 -48 8 -46 Q30 -42 34 -20 Q36 -8 32 0 Z';
const scoopRim = 'M-34 0 q4 -8 8 0 q4 -9 9 -1 q4 -8 9 0 q4 -9 9 -1 q5 -8 9 0 q4 -9 8 -1 q4 -6 6 2 Z';
const cherryD = (cx: number, cy: number, r: number) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="url(#kr-ek-cherry)" />
    <ellipse cx={R(cx - r * 0.35)} cy={R(cy - r * 0.35)} rx={R(r * 0.28)} ry={R(r * 0.2)} fill="#fff" opacity={0.7} />
  </g>
);
const flyCherry = (pair: boolean) => (
  <g>
    <g className="ka-flap">
      <ellipse cx={-14} cy={-6} rx={12} ry={6} fill="#fff" stroke="#f3b6cf" strokeWidth={1.5} transform="rotate(-30 -14 -6)" />
      <ellipse cx={16} cy={-6} rx={12} ry={6} fill="#fff" stroke="#f3b6cf" strokeWidth={1.5} transform="rotate(30 16 -6)" />
    </g>
    {pair ? (
      <g>
        <path d="M-9 4 Q-4 -18 4 -22 Q8 -14 11 6" stroke="#3f8a2a" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M4 -22 q10 -6 16 0 q-8 6 -16 0" fill="#4f9e32" />
        {cherryD(-9, 10, 11)}
        {cherryD(11, 12, 11)}
        <circle cx={-12} cy={9} r={1.6} fill="#1b1020" />
        <circle cx={-6} cy={9} r={1.6} fill="#1b1020" />
        <path d="M-11 14 q2 2 4 0" stroke="#1b1020" strokeWidth={1.2} fill="none" />
      </g>
    ) : (
      <g>
        <path d="M0 -8 Q2 -24 10 -28" stroke="#3f8a2a" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M10 -28 q10 -6 16 0 q-8 6 -16 0" fill="#4f9e32" />
        {cherryD(0, 6, 16)}
        <circle cx={-5} cy={4} r={3} fill="#fff" />
        <circle cx={5} cy={4} r={3} fill="#fff" />
        <circle cx={-5.5} cy={4.5} r={1.6} fill="#1b1020" />
        <circle cx={4.5} cy={4.5} r={1.6} fill="#1b1020" />
        <path d="M-4 11 q4 3 8 0" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </g>
    )}
  </g>
);

const esKrim: RunnerTheme = {
  name: 'Negeri Es Krim',
  bg: '#fff0f5',
  ink: '#8a2f5a',
  defs: (
    <>
      <linearGradient id="kr-ek-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffb8d4" />
        <stop offset="0.55" stopColor="#ffe0ea" />
        <stop offset="1" stopColor="#fff6e8" />
      </linearGradient>
      <linearGradient id="kr-ek-waffle" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ecb86e" />
        <stop offset="1" stopColor="#c4843a" />
      </linearGradient>
      <linearGradient id="kr-ek-choc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7a4222" />
        <stop offset="1" stopColor="#3a1d0c" />
      </linearGradient>
      <radialGradient id="kr-ek-pink" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#ffe0ee" />
        <stop offset="0.55" stopColor="#ffa3c8" />
        <stop offset="1" stopColor="#e86a9e" />
      </radialGradient>
      <radialGradient id="kr-ek-mint" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#e0fff2" />
        <stop offset="0.55" stopColor="#a3ecca" />
        <stop offset="1" stopColor="#5cc49b" />
      </radialGradient>
      <radialGradient id="kr-ek-van" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#fffdf0" />
        <stop offset="0.55" stopColor="#fbeabc" />
        <stop offset="1" stopColor="#e2c27a" />
      </radialGradient>
      <radialGradient id="kr-ek-cherry" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ff8a8a" />
        <stop offset="0.6" stopColor="#e8233a" />
        <stop offset="1" stopColor="#9a0d1f" />
      </radialGradient>
      <pattern id="kr-ek-grid" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0 H22 M0 0 V22" stroke="#a86a2a" strokeWidth="3" opacity="0.55" />
        <rect x="3" y="3" width="6" height="6" fill="#fff" opacity="0.12" />
      </pattern>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-ek-sky)" />
      <g transform={`translate(${R(w * 0.78)} 120)`}>
        <circle r={60} fill="#fff3c8" opacity={0.5} />
        <circle r={40} fill="#ffe680" />
        <path d="M0 0 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 0 1 10 -10 a16 16 0 0 1 16 16 a22 22 0 0 1 -22 22" stroke="#ffb000" strokeWidth={3} fill="none" opacity={0.6} />
      </g>
      {each(0, w, 380, (x, i) => puff(R(x + 40 + hs(i, 1) * 200), R(70 + hs(i, 2) * 120), R(0.6 + hs(i, 3) * 0.5), i % 2 ? '#ffe0f0' : '#e0efff', 0.95, '#ff9ec7'))}
    </g>
  ),
  far: (len) => (
    <g>
      {each(0, len, 300, (x, i) => {
        const py = R(300 + hs(i, 1) * 60),
          top = R(470 - (470 - py) / 0.75),
          choc = hs(i, 2) < 0.5;
        return (
          <g opacity={0.9}>
            <path d={`M${x - 20} 470 C${x + 40} ${top} ${x + 260} ${top} ${x + 320} 470 Z`} fill={choc ? '#b77a52' : '#f7a8c8'} />
            <path d={`M${x + 64} ${py + 44} Q${x + 150} ${py - 44} ${x + 236} ${py + 44} q-8 14 -16 0 q-10 20 -22 0 q-10 10 -20 0 q-10 22 -24 0 q-10 12 -22 0 q-8 16 -20 0 q-10 10 -20 0 q-8 18 -18 0 Z`} fill={choc ? '#fff4fa' : '#fff9e6'} />
            <circle cx={x + 150} cy={py - 8} r={10} fill="#e8233a" />
            <path d={`M${x + 150} ${py - 18} q4 -10 12 -12`} stroke="#3f8a2a" strokeWidth={2.5} fill="none" />
          </g>
        );
      })}
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 240, (x, i) => {
        const cx = R(x + 40 + hs(i, 1) * 160),
          v = hs(i, 2);
        if (v < 0.4) {
          const h = R(110 + hs(i, 3) * 60),
            c = SPRINKLE[Math.abs(i) % 4];
          return (
            <g>
              <rect x={cx - 4} y={460 - h} width={8} height={h} rx={3} fill="#fffaf0" stroke="#e6d6c0" strokeWidth={1.5} />
              <circle cx={cx} cy={460 - h} r={34} fill={c} />
              <path d={`M${cx} ${460 - h} m0 -4 a4 4 0 1 1 -4 4 a10 10 0 0 1 10 -10 a17 17 0 0 1 17 17 a24 24 0 0 1 -24 24`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.8} />
              <ellipse cx={cx - 12} cy={460 - h - 16} rx={8} ry={5} fill="#fff" opacity={0.5} />
            </g>
          );
        }
        if (v < 0.75) {
          // es krim contong raksasa tertanam
          return (
            <g>
              <path d={`M${cx - 30} 400 L${cx} 460 L${cx + 30} 400 Z`} fill="url(#kr-ek-waffle)" />
              <path d={`M${cx - 30} 400 L${cx} 460 L${cx + 30} 400 Z`} fill="url(#kr-ek-grid)" />
              <circle cx={cx} cy={384} r={32} fill={hs(i, 4) < 0.5 ? 'url(#kr-ek-pink)' : 'url(#kr-ek-mint)'} />
              <path d={`M${cx - 32} 398 q6 10 12 0 q6 14 14 0 q6 10 12 0 q6 12 14 0 Z`} fill={hs(i, 4) < 0.5 ? '#f78ab8' : '#7cd9b0'} />
              {cherryD(cx, 350, 8)}
            </g>
          );
        }
        // pohon permen karet
        return (
          <g>
            <path d={`M${cx} 460 L${cx} 380`} stroke="#c9a2e8" strokeWidth={8} strokeLinecap="round" />
            <circle cx={cx - 20} cy={378} r={20} fill="#ff9ec7" />
            <circle cx={cx + 20} cy={380} r={20} fill="#9fd8ff" />
            <circle cx={cx} cy={356} r={24} fill="#ffe680" />
            {[0, 1, 2, 3, 4].map((j) => (
              <rect key={j} x={R(cx - 22 + hs(i * 5 + j, 5) * 44)} y={R(350 + hs(i * 5 + j, 6) * 36)} width={7} height={2.5} rx={1.2} fill={SPRINKLE[j]} transform={`rotate(${j * 40} ${R(cx - 22 + hs(i * 5 + j, 5) * 44)} ${R(350 + hs(i * 5 + j, 6) * 36)})`} />
            ))}
          </g>
        );
      })}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    return (
      <g>
        <rect x={x0} y={462} width={w} height={138} fill="url(#kr-ek-waffle)" />
        <rect x={x0} y={462} width={w} height={138} fill="url(#kr-ek-grid)" />
        <rect x={x0} y={456} width={w} height={14} fill="#ffa3c8" />
        {eachIn(x0, x1, 40, (x, i) => (
          <path d={`M${x} 469 q5 ${R(8 + hs(i, 1) * 14)} 10 0 q6 ${R(4 + hs(i, 2) * 8)} 12 0 Z`} fill="#ffa3c8" />
        ))}
        <rect x={x0} y={456} width={w} height={4} fill="#ffe0ee" />
        {eachIn(x0, x1, 28, (x, i) => (
          <rect x={R(x + hs(i, 3) * 20)} y={R(459 + hs(i, 4) * 6)} width={7} height={2.6} rx={1.3} fill={SPRINKLE[Math.abs(i) % 6]} transform={`rotate(${R(hs(i, 5) * 180)} ${R(x + hs(i, 3) * 20 + 3)} ${R(460 + hs(i, 4) * 6)})`} />
        ))}
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={456} width={100} height={144} fill="#8a5a2a" />
      <rect x={x + 8} y={456} width={84} height={144} fill="url(#kr-ek-choc)" />
      <rect x={x} y={456} width={8} height={144} fill="url(#kr-ek-grid)" />
      <rect x={x + 92} y={456} width={8} height={144} fill="url(#kr-ek-grid)" />
      {/* cokelat leleh di dasar */}
      <path d={`M${x + 8} 540 q21 -8 42 0 t42 0 V600 H${x + 8} Z`} fill="#5a2e14" />
      <path d={`M${x + 20} 546 q10 -4 20 0`} stroke="#b77a52" strokeWidth={3} fill="none" strokeLinecap="round" className="ka-shimmer" />
      <circle cx={x + 66} cy={560} r={4} fill="#7a4222" stroke="#b77a52" strokeWidth={1} className="ka-hop" />
      {/* lelehan krim dari tepi */}
      <path d={`M${x - 4} 456 h18 v10 q-3 24 -7 0 q-3 10 -6 0 q-3 6 -5 -2 Z`} fill="#ffa3c8" />
      <path d={`M${x + 104} 456 h-18 v10 q3 30 7 0 q3 12 6 0 q2 8 5 -2 Z`} fill="#ffa3c8" />
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    if (v === 0)
      return lowAt(
        x,
        <g>
          <path d={scoopD} fill="url(#kr-ek-pink)" />
          <path d={scoopRim} fill="#f78ab8" />
          <path d="M-18 -34 Q-6 -44 8 -42" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
          <path d="M-2 -52 q2 -10 10 -14" stroke="#3f8a2a" strokeWidth={2.5} fill="none" />
          {cherryD(-2, -48, 8)}
        </g>,
      );
    if (v === 1)
      return lowAt(
        x,
        <g>
          <path d={scoopD} fill="url(#kr-ek-mint)" />
          <path d={scoopRim} fill="#7cd9b0" />
          {[
            [-16, -28],
            [0, -38],
            [14, -22],
            [-4, -16],
            [20, -34],
          ].map(([cx, cy]) => (
            <ellipse key={cx} cx={cx} cy={cy} rx={3.5} ry={2.4} fill="#5a2e14" transform={`rotate(${cx * 3} ${cx} ${cy})`} />
          ))}
          <path d="M-18 -34 Q-6 -44 8 -42" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>,
      );
    return lowAt(
      x,
      <g>
        <path d={scoopD} fill="url(#kr-ek-van)" />
        <path d={scoopRim} fill="#f0d48e" />
        <g transform="translate(2 -38) scale(0.62)">
          <path d={scoopD} fill="url(#kr-ek-pink)" />
          <path d={scoopRim} fill="#f78ab8" />
        </g>
        {[0, 1, 2, 3, 4, 5].map((j) => (
          <rect key={j} x={-14 + j * 6} y={j % 2 ? -52 : -58} width={6} height={2.4} rx={1.2} fill={SPRINKLE[j]} transform={`rotate(${j * 50} ${-11 + j * 6} ${j % 2 ? -51 : -57})`} />
        ))}
        <path d="M-18 -30 Q-8 -38 4 -36" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
      </g>,
    );
  },
  fly: (x, k) => flyAt(x, k, flyCherry(k % 2 === 0), 20),
  finish: (x) =>
    gate(
      x,
      '#ffffff',
      '#e8233a',
      <g>
        {[x - 52, x + 42].map((px) => (
          <g key={px}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
              <path key={j} d={`M${px} ${300 + j * 16} l10 -8 v6 l-10 8 Z`} fill="#e8233a" />
            ))}
            <circle cx={px + 5} cy={272} r={16} fill="#ff9ec7" stroke="#fff" strokeWidth={2} />
            <path d={`M${px + 5} 272 m0 -3 a3 3 0 1 1 -3 3 a8 8 0 0 1 8 -8 a13 13 0 0 1 13 13`} stroke="#fff" strokeWidth={3} fill="none" />
          </g>
        ))}
      </g>,
      '#e8233a',
    ),
  words: { low: 'es krim', fly: 'ceri terbang', gap: 'kolam cokelat' },
};

/* =====================================================================
 * 9. Terowongan Lava (gelap)
 * ===================================================================== */

const crystal = (grad: string, glow: string) => (
  <g>
    <ellipse cx={0} cy={-18} rx={34} ry={26} fill={glow} opacity={0.35} className="ka-glow" />
    <path d="M-34 0 Q-36 -14 -22 -16 L22 -16 Q36 -14 34 0 Z" fill="#2e2220" />
    <path d="M-18 -10 L-26 -40 L-16 -52 L-8 -12 Z" fill={`url(#${grad})`} />
    <path d="M-8 -10 L-4 -66 L6 -70 L10 -10 Z" fill={`url(#${grad})`} />
    <path d="M8 -12 L20 -44 L28 -40 L20 -10 Z" fill={`url(#${grad})`} />
    <path d="M-2 -60 L1 -18 M-20 -44 L-14 -16 M20 -38 L16 -16" stroke="#fff" strokeWidth={2} opacity={0.6} strokeLinecap="round" />
  </g>
);

const lava: RunnerTheme = {
  name: 'Terowongan Lava',
  bg: '#2a1512',
  ink: '#ffe2c4',
  dark: true,
  defs: (
    <>
      <linearGradient id="kr-tl-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#120605" />
        <stop offset="0.6" stopColor="#2d120c" />
        <stop offset="1" stopColor="#6a2a12" />
      </linearGradient>
      <linearGradient id="kr-tl-rock" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3e2622" />
        <stop offset="1" stopColor="#1f1210" />
      </linearGradient>
      <linearGradient id="kr-tl-col" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a1814" />
        <stop offset="0.8" stopColor="#3e2018" />
        <stop offset="1" stopColor="#8a3a18" />
      </linearGradient>
      <linearGradient id="kr-tl-lava" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff08a" />
        <stop offset="0.3" stopColor="#ffa21f" />
        <stop offset="1" stopColor="#e2410f" />
      </linearGradient>
      <linearGradient id="kr-tl-fall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#e2410f" />
        <stop offset="0.5" stopColor="#ffd05a" />
        <stop offset="1" stopColor="#e2410f" />
      </linearGradient>
      <radialGradient id="kr-tl-glow">
        <stop offset="0" stopColor="#ffb347" stopOpacity="0.7" />
        <stop offset="1" stopColor="#ff6a1a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="kr-tl-basalt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3f3430" />
        <stop offset="1" stopColor="#171210" />
      </linearGradient>
      <linearGradient id="kr-tl-crysA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffe08a" />
        <stop offset="0.5" stopColor="#ff8a2a" />
        <stop offset="1" stopColor="#b8360a" />
      </linearGradient>
      <linearGradient id="kr-tl-crysB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffb3c8" />
        <stop offset="0.5" stopColor="#ff3a5a" />
        <stop offset="1" stopColor="#8a0a2a" />
      </linearGradient>
      <linearGradient id="kr-tl-crysC" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fffbd0" />
        <stop offset="0.5" stopColor="#ffd23f" />
        <stop offset="1" stopColor="#c98a0a" />
      </linearGradient>
      <pattern id="kr-tl-hex" x="0" y="462" width="36" height="42" patternUnits="userSpaceOnUse">
        <path d="M9 0 L27 0 L36 21 L27 42 L9 42 L0 21 Z" fill="none" stroke="#000" strokeWidth="2" opacity="0.35" />
        <path d="M11 3 L25 3" stroke="#7a5a4a" strokeWidth="1.5" opacity="0.5" />
      </pattern>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-tl-sky)" />
      <rect width={w} height={36} fill="#1a0c0a" />
      {each(0, w, 90, (x, i) => {
        const L = R(40 + hs(i, 1) * 90),
          cx = R(x + hs(i, 2) * 40);
        return (
          <g>
            <path d={`M${cx - 18} 30 L${cx} ${30 + L} L${cx + 18} 30 Z`} fill="#241310" />
            <path d={`M${cx - 4} 34 L${cx} ${R(30 + L * 0.8)}`} stroke="#6a2a18" strokeWidth={2} strokeLinecap="round" />
            <circle cx={cx} cy={R(34 + L)} r={2.2} fill="#ffb347" className="ka-glow" />
          </g>
        );
      })}
      {each(0, w, 130, (x, i) => (
        <circle cx={R(x + hs(i, 3) * 120)} cy={R(170 + hs(i, 4) * 250)} r={R(1.6 + hs(i, 5) * 2)} fill="#ffb347" className="ka-twinkle" style={{ animationDelay: `${R(-hs(i, 6) * 2)}s` }} />
      ))}
    </g>
  ),
  far: (len) => (
    <g>
      {each(0, len, 150, (x, i) => {
        const top = R(170 + hs(i, 1) * 150),
          bw = R(50 + hs(i, 2) * 40);
        return <path d={`M${x} 470 L${x + 6} ${top + 20} Q${R(x + bw / 2)} ${top - 10} ${R(x + bw - 6)} ${top + 16} L${R(x + bw)} 470 Z`} fill="url(#kr-tl-col)" />;
      })}
      {each(0, len, 620, (x, i) =>
        hs(i, 3) < 0.6 ? (
          <g>
            <rect x={R(x + 100 + hs(i, 4) * 300)} y={150} width={6} height={320} fill="#ff8a2a" opacity={0.55} />
            <ellipse cx={R(x + 103 + hs(i, 4) * 300)} cy={460} rx={40} ry={16} fill="url(#kr-tl-glow)" />
          </g>
        ) : null,
      )}
      <rect x={-50} y={400} width={len + 100} height={70} fill="#ff6a1a" opacity={0.12} />
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 420, (x, i) => {
        const cx = R(x + 60 + hs(i, 1) * 260);
        if (hs(i, 2) < 0.5)
          return (
            <g>
              <path d={`M${cx - 60} 240 Q${cx - 50} 214 ${cx - 10} 220 L${cx + 50} 226 Q${cx + 64} 236 ${cx + 40} 248 Z`} fill="url(#kr-tl-rock)" />
              <rect x={cx - 14} y={236} width={28} height={224} fill="url(#kr-tl-fall)" />
              <path d={`M${cx - 6} 250 v200 M${cx + 6} 270 v180`} stroke="#fff4a0" strokeWidth={2.5} opacity={0.7} className="ka-shimmer" />
              <ellipse cx={cx} cy={458} rx={70} ry={24} fill="url(#kr-tl-glow)" className="ka-glow" />
              <ellipse cx={cx} cy={458} rx={28} ry={6} fill="#ffd05a" />
            </g>
          );
        return (
          <g>
            {[-40, -12, 20, 44].map((dx, j) => {
              const h = R(60 + hs(i * 4 + j, 3) * 90);
              return <path key={dx} d={`M${cx + dx - 16} 460 L${cx + dx - 2} ${460 - h} L${cx + dx + 4} ${460 - h + 6} L${cx + dx + 16} 460 Z`} fill="url(#kr-tl-rock)" />;
            })}
            <path d={`M${cx - 8} 460 L${cx - 2} 430 L${cx + 4} 460 Z M${cx + 6} 460 L${cx + 12} 440 L${cx + 16} 460 Z`} fill="url(#kr-tl-crysA)" className="ka-glow" />
          </g>
        );
      })}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    return (
      <g>
        <rect x={x0} y={460} width={w} height={140} fill="url(#kr-tl-basalt)" />
        <rect x={x0} y={462} width={w} height={138} fill="url(#kr-tl-hex)" />
        <rect x={x0} y={456} width={w} height={8} fill="#4a3a35" />
        <rect x={x0} y={456} width={w} height={2.5} fill="#ff9a4a" opacity={0.55} />
        {eachIn(x0, x1, 130, (x, i) => {
          const cx = R(x + 20 + hs(i, 1) * 90);
          const d = `M${cx} 464 l${R(-6 + hs(i, 2) * 12)} 18 l${R(8 - hs(i, 3) * 6)} 14 l-6 20 l${R(10 * hs(i, 4))} 18`;
          return (
            <g>
              <path d={d} stroke="#ff6a1a" strokeWidth={8} fill="none" opacity={0.25} strokeLinecap="round" strokeLinejoin="round" />
              <path d={d} stroke="#ffb347" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" className="ka-glow" />
            </g>
          );
        })}
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={456} width={100} height={144} fill="#1a0f0d" />
      <ellipse cx={x + 50} cy={512} rx={70} ry={50} fill="url(#kr-tl-glow)" className="ka-glow" />
      <path d={`M${x} 456 L${x + 12} 470 L${x + 8} 600 L${x} 600 Z`} fill="#3e2622" />
      <path d={`M${x + 100} 456 L${x + 88} 472 L${x + 92} 600 L${x + 100} 600 Z`} fill="#2e1c18" />
      <path d={`M${x + 12} 470 L${x + 8} 520 M${x + 88} 472 L${x + 92} 520`} stroke="#ff8a2a" strokeWidth={2} opacity={0.7} />
      <path d={`M${x + 6} 520 q11 -6 22 0 t22 0 t22 0 t22 0 V600 H${x + 6} Z`} fill="url(#kr-tl-lava)" />
      <path d={`M${x + 14} 530 q8 -4 16 0 M${x + 56} 536 q8 -4 16 0`} stroke="#fff4a0" strokeWidth={3} fill="none" strokeLinecap="round" className="ka-shimmer" />
      <circle cx={x + 40} cy={522} r={5} fill="#ffd05a" stroke="#e2410f" strokeWidth={1.5} className="ka-hop" />
      <circle cx={x + 70} cy={524} r={3.5} fill="#ffd05a" stroke="#e2410f" strokeWidth={1.5} className="ka-hop" style={{ animationDelay: '-1.1s' }} />
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    return lowAt(x, v === 0 ? crystal('kr-tl-crysA', '#ff8a2a') : v === 1 ? crystal('kr-tl-crysB', '#ff3a5a') : crystal('kr-tl-crysC', '#ffd23f'));
  },
  fly: (x, k) =>
    flyAt(
      x,
      k,
      <g>
        <path d="M18 4 Q34 0 44 10 Q36 8 34 16 Q28 8 18 10 Z" fill="#ffb347" opacity={0.8} className="ka-glow" />
        <circle cx={0} cy={0} r={30} fill="url(#kr-tl-glow)" />
        <g transform={k % 2 === 0 ? undefined : 'scale(1.15)'}>{bat('#2a1414', k % 2 === 0 ? '#ff7a2a' : '#ff3a3a', '#ffe680')}</g>
      </g>,
      26,
    ),
  finish: (x) =>
    gate(
      x,
      '#2a1e1e',
      '#ff8a2a',
      <g>
        {[x - 47, x + 47].map((px) => (
          <g key={px}>
            <path d={`M${px - 8} 286 L${px + 8} 286 L${px + 5} 276 L${px - 5} 276 Z`} fill="#4a3a35" />
            <circle cx={px} cy={262} r={16} fill="url(#kr-tl-glow)" />
            <path d={`M${px} 276 Q${px - 10} 264 ${px - 2} 250 Q${px} 260 ${px + 4} 252 Q${px + 10} 266 ${px} 276 Z`} fill="#ffb347" className="ka-glow" />
            <path d={`M${px} 276 Q${px - 4} 268 ${px} 260 Q${px + 4} 268 ${px} 276 Z`} fill="#fff4a0" />
            <path d={`M${px - 2} 330 l4 10 l-4 10 M${px - 2} 380 h4 M${px - 2} 410 l4 6`} stroke="#ff8a2a" strokeWidth={2} fill="none" className="ka-glow" />
          </g>
        ))}
      </g>,
      '#1a0f0e',
      '#ffcf7a',
    ),
  words: { low: 'kristal', fly: 'kelelawar api', gap: 'kolam lava' },
};

/* =====================================================================
 * 10. Planet Mars
 * ===================================================================== */

const ufo = (light: string, alien: string) => (
  <g>
    <path d="M-12 -6 Q-12 -26 0 -26 Q12 -26 12 -6 Z" fill="url(#kr-pm-dome)" stroke="#9fd8f0" strokeWidth={1.5} />
    <circle cx={0} cy={-12} r={7} fill={alien} />
    <circle cx={-2.5} cy={-13} r={2} fill="#1b1020" />
    <circle cx={2.5} cy={-13} r={2} fill="#1b1020" />
    <path d="M-3 -21 l-3 -5 M3 -21 l3 -5" stroke={alien} strokeWidth={1.5} />
    <path d="M-7 -20 Q-4 -24 0 -24" stroke="#fff" strokeWidth={2} fill="none" opacity={0.8} />
    <ellipse cx={0} cy={0} rx={34} ry={10} fill="url(#kr-pm-ufo)" stroke="#6b7688" strokeWidth={1.5} />
    <ellipse cx={0} cy={4} rx={20} ry={5} fill="#5b6578" />
    {[-24, -12, 0, 12, 24].map((dx, j) => (
      <circle key={dx} cx={dx} cy={1} r={2.6} fill={light} className="ka-twinkle" style={{ animationDelay: `${-j * 0.3}s` }} />
    ))}
  </g>
);
const marsRock = (d: string) => (
  <g>
    <path d={d} fill="url(#kr-pm-rock)" stroke="#5a1f12" strokeWidth={2.5} strokeLinejoin="round" />
  </g>
);

const mars: RunnerTheme = {
  name: 'Planet Mars',
  bg: '#f7e3d6',
  ink: '#7a2e14',
  defs: (
    <>
      <linearGradient id="kr-pm-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d1633" />
        <stop offset="0.45" stopColor="#5a2a4a" />
        <stop offset="0.8" stopColor="#d9744a" />
        <stop offset="1" stopColor="#f2a36b" />
      </linearGradient>
      <radialGradient id="kr-pm-earth" cx="0.35" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#bfe8ff" />
        <stop offset="0.6" stopColor="#3b82f6" />
        <stop offset="1" stopColor="#1e3a8a" />
      </radialGradient>
      <linearGradient id="kr-pm-mtn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a8513a" />
        <stop offset="1" stopColor="#d07650" />
      </linearGradient>
      <linearGradient id="kr-pm-mtn2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a3a2a" />
        <stop offset="1" stopColor="#b0553d" />
      </linearGradient>
      <linearGradient id="kr-pm-soil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d86f42" />
        <stop offset="1" stopColor="#8a3a1e" />
      </linearGradient>
      <linearGradient id="kr-pm-pit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5a1f12" />
        <stop offset="1" stopColor="#140604" />
      </linearGradient>
      <radialGradient id="kr-pm-rock" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#ee9a70" />
        <stop offset="0.55" stopColor="#b8583c" />
        <stop offset="1" stopColor="#6e2c1a" />
      </radialGradient>
      <radialGradient id="kr-pm-ufo" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#f3f6fb" />
        <stop offset="0.6" stopColor="#b9c3d1" />
        <stop offset="1" stopColor="#6b7688" />
      </radialGradient>
      <linearGradient id="kr-pm-dome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e6f9ff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#6ad1ff" stopOpacity="0.7" />
      </linearGradient>
      <pattern id="kr-pm-dust" width="40" height="34" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="8" r="2" fill="#5a1f12" opacity="0.3" />
        <circle cx="26" cy="18" r="1.5" fill="#ffc9a8" opacity="0.35" />
        <circle cx="16" cy="28" r="2.6" fill="#5a1f12" opacity="0.2" />
        <circle cx="36" cy="4" r="1" fill="#fff" opacity="0.25" />
      </pattern>
    </>
  ),
  sky: (w) => (
    <g>
      <rect width={w} height={600} fill="url(#kr-pm-sky)" />
      {each(0, w, 45, (x, i) => (
        <circle cx={R(x + hs(i, 1) * 40)} cy={R(10 + hs(i, 2) * 230)} r={R(0.8 + hs(i, 3) * 1.6)} fill="#fff" className={hs(i, 4) < 0.4 ? 'ka-twinkle' : undefined} style={hs(i, 4) < 0.4 ? { animationDelay: `${R(-hs(i, 5) * 2)}s` } : undefined} opacity={0.85} />
      ))}
      <circle cx={R(w * 0.15)} cy={90} r={22} fill="url(#kr-pm-earth)" />
      <path d={`M${R(w * 0.15 - 10)} 82 q6 -6 12 0 q-2 8 -10 6 Z M${R(w * 0.15 + 4)} 96 q6 -2 8 4 q-6 2 -8 -4 Z`} fill="#4fae3b" opacity={0.85} />
      <circle cx={R(w * 0.15)} cy={90} r={30} fill="#8fd3ff" opacity={0.15} />
      <circle cx={R(w * 0.7)} cy={70} r={14} fill="#c9b8a8" />
      <circle cx={R(w * 0.7 - 4)} cy={66} r={3} fill="#a8948a" />
      <circle cx={R(w * 0.82)} cy={150} r={8} fill="#b8a898" />
    </g>
  ),
  far: (len) => (
    <g>
      {each(0, len, 1200, (x, i) => (
        <path d={`M${R(x + hs(i, 1) * 400)} 470 Q${R(x + 200 + hs(i, 1) * 400)} 300 ${R(x + 400 + hs(i, 1) * 400)} 300 Q${R(x + 600 + hs(i, 1) * 400)} 300 ${R(x + 800 + hs(i, 1) * 400)} 470 Z`} fill="url(#kr-pm-mtn)" opacity={0.7} />
      ))}
      <path d={peaksD(len, 340, 440, 110, 91)} fill="url(#kr-pm-mtn2)" opacity={0.9} />
      {peakCaps(len, 340, 440, 110, 91, '#e89a78', 18, 0.6)}
    </g>
  ),
  mid: (len) => (
    <g>
      {each(0, len, 380, (x, i) => {
        const cx = R(x + 60 + hs(i, 1) * 240),
          v = hs(i, 2);
        if (v < 0.5) {
          const h = R(70 + hs(i, 3) * 50);
          return (
            <g>
              <path d={`M${cx - 80} 460 L${cx - 56} ${460 - h} L${cx + 56} ${460 - h} L${cx + 80} 460 Z`} fill="#b0553d" />
              <path d={`M${cx - 70} ${R(460 - h * 0.66)} H${cx + 70} M${cx - 64} ${R(460 - h * 0.33)} H${cx + 74}`} stroke="#8a3a2a" strokeWidth={4} opacity={0.6} />
              <rect x={cx - 56} y={460 - h} width={112} height={5} fill="#e08a62" />
            </g>
          );
        }
        if (v < 0.8)
          return (
            <g>
              <path d={`M${cx - 40} 460 Q${cx - 42} 430 ${cx - 20} 424 Q${cx} 416 ${cx + 12} 430 Q${cx + 30} 420 ${cx + 44} 440 L${cx + 46} 460 Z`} fill="url(#kr-pm-rock)" />
              <path d={`M${cx - 30} 432 Q${cx - 18} 424 ${cx - 6} 426`} stroke="#ffc9a8" strokeWidth={3} fill="none" opacity={0.5} strokeLinecap="round" />
            </g>
          );
        // pangkalan kubah
        return (
          <g>
            <path d={`M${cx - 46} 460 A46 46 0 0 1 ${cx + 46} 460 Z`} fill="#e6ebf2" opacity={0.9} />
            <path d={`M${cx - 46} 460 A46 46 0 0 1 ${cx + 46} 460 M${cx - 30} 460 A30 46 0 0 1 ${cx + 30} 460 M${cx} 414 V460 M${cx - 44} 446 H${cx + 44}`} stroke="#9aa6b4" strokeWidth={2} fill="none" />
            <path d={`M${cx - 30} 430 Q${cx - 20} 420 ${cx - 6} 418`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={`M${cx + 34} 432 L${cx + 50} 390`} stroke="#9aa6b4" strokeWidth={3} />
            <path d={`M${cx + 40} 384 Q${cx + 52} 380 ${cx + 60} 392 Z`} fill="#dfe6ee" stroke="#9aa6b4" strokeWidth={1.5} />
            <circle cx={cx + 50} cy={388} r={2.5} fill="#ff4d4d" className="robi-led" />
          </g>
        );
      })}
    </g>
  ),
  ground: (x0, x1) => {
    const w = x1 - x0;
    return (
      <g>
        <rect x={x0} y={460} width={w} height={140} fill="url(#kr-pm-soil)" />
        <rect x={x0} y={466} width={w} height={134} fill="url(#kr-pm-dust)" />
        <rect x={x0} y={456} width={w} height={10} fill="#e0784a" />
        <rect x={x0} y={456} width={w} height={3} fill="#ffb58a" />
        <rect x={x0} y={466} width={w} height={4} fill="#000" opacity={0.12} />
        {eachIn(x0, x1, 90, (x, i) => (
          <g>
            <path d={`M${R(x + 10 + hs(i, 1) * 60)} 458 q6 -8 12 0 Z`} fill="#b0553d" />
            <ellipse cx={R(x + 20 + hs(i, 2) * 60)} cy={R(500 + hs(i, 3) * 80)} rx={R(8 + hs(i, 4) * 8)} ry={4} fill="#7a2e14" opacity={0.4} />
          </g>
        ))}
      </g>
    );
  },
  gap: (x) => (
    <g>
      <rect x={x} y={456} width={100} height={144} fill="url(#kr-pm-pit)" />
      <path d={`M${x} 456 Q${x + 18} 470 ${x + 12} 520 L${x + 16} 600 L${x} 600 Z`} fill="#8a3a1e" />
      <path d={`M${x + 100} 456 Q${x + 82} 472 ${x + 88} 520 L${x + 84} 600 L${x + 100} 600 Z`} fill="#6e2c1a" />
      <ellipse cx={x + 50} cy={590} rx={40} ry={16} fill="#9b6bff" opacity={0.25} className="ka-glow" />
      {/* bibir kawah yang menonjol */}
      <path d={`M${x - 20} 458 Q${x - 6} 446 ${x + 8} 456 L${x + 4} 462 Z`} fill="#e0784a" />
      <path d={`M${x + 120} 458 Q${x + 106} 446 ${x + 92} 456 L${x + 96} 462 Z`} fill="#e0784a" />
      <path d={`M${x - 14} 452 Q${x - 4} 446 ${x + 4} 452`} stroke="#ffb58a" strokeWidth={2} fill="none" />
    </g>
  ),
  low: (x, k) => {
    const v = k % 3;
    if (v === 0)
      return lowAt(
        x,
        <g>
          {marsRock('M-36 0 Q-38 -30 -14 -42 Q8 -50 24 -38 Q40 -26 36 0 Z')}
          <ellipse cx={-10} cy={-24} rx={6} ry={4} fill="#6e2c1a" opacity={0.5} />
          <ellipse cx={14} cy={-14} rx={4} ry={3} fill="#6e2c1a" opacity={0.5} />
          <path d="M-22 -32 Q-10 -42 6 -40" stroke="#ffc9a8" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
        </g>,
      );
    if (v === 1)
      return lowAt(
        x,
        <g>
          {marsRock('M-34 0 L-26 -36 L-14 -30 L-4 -58 L10 -34 L22 -44 L34 0 Z')}
          <path d="M-4 -56 L-8 -14 M-24 -32 L-20 -8" stroke="#ffc9a8" strokeWidth={2.5} opacity={0.5} strokeLinecap="round" />
        </g>,
        36,
      );
    return lowAt(
      x,
      <g>
        {marsRock('M-34 0 Q-36 -24 -14 -32 Q8 -38 24 -28 Q38 -18 34 0 Z')}
        <path d="M-18 -24 Q-8 -32 6 -30" stroke="#ffc9a8" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
        <path d="M10 -30 V-66" stroke="#e6ebf2" strokeWidth={2.5} />
        <path d="M10 -66 h22 v14 h-22 Z" fill="#2ec4a6" />
        <path d={starD(21, -59, 5)} fill="#ffd23f" />
      </g>,
    );
  },
  fly: (x, k) => flyAt(x, k, k % 2 === 0 ? ufo('#ffd23f', '#7ee06a') : ufo('#ff6bd6', '#9fd8ff'), 30),
  finish: (x) =>
    gate(
      x,
      '#e6ebf2',
      '#6b7688',
      <g>
        {[x - 47, x + 47].map((px, j) => (
          <g key={px}>
            <path d={`M${px} 286 v-10`} stroke="#6b7688" strokeWidth={3} />
            <path d={`M${px - 14} 266 Q${px} 290 ${px + 14} 266 Z`} fill="#dfe6ee" stroke="#6b7688" strokeWidth={1.5} transform={`rotate(${j ? 20 : -20} ${px} 276)`} />
            <circle cx={px} cy={270} r={2.5} fill="#ff4d4d" className="robi-led" />
          </g>
        ))}
      </g>,
      '#7a2e14',
    ),
  words: { low: 'batu mars', fly: 'ufo', gap: 'kawah' },
};

export const KALAU_THEMES: RunnerTheme[] = [padang, lembah, jembatan, candi, sirkuit, atap, awan, esKrim, lava, mars];

/* =====================================================================
 * Agam Pelari (tampak samping, menghadap kanan). Kaki di (0,0), tinggi ±110.
 * ===================================================================== */

const TEAL = '#2ec4a6',
  TEAL_D = '#178f78';

/** tangan/kaki: garis bersendi dengan garis tepi gelap */
function Limb({ p, w, c }: { p: Pt[]; w: number; c: string }) {
  const d = `M${p.map((q) => q.join(' ')).join(' L')}`;
  return (
    <g>
      <path d={d} fill="none" stroke={TEAL_D} strokeWidth={w + 3.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** sepatu lari, titik asal = pergelangan kaki; sol di y ±11 */
function Shoe({ at, a = 0, back = false }: { at: Pt; a?: number; back?: boolean }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${a})`}>
      <path d="M-9 8 L-9 1 Q-9 -3 -4 -3 L3 -3 Q6 1 12 2 Q17 3 17 7 L17 8 Z" fill={back ? '#dfe5ee' : '#ffffff'} stroke="#8a93a6" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M-4 4 L5 1 L11 5" fill="none" stroke="#ff4f6d" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={-10} y={7} width={28} height={4} rx={2} fill="#3b4256" />
    </g>
  );
}

/** kepala tampak samping; titik asal = leher (tengah bawah kepala) */
function Head({ face, fold }: { face: 'normal' | 'dizzy' | 'happy'; fold?: boolean }) {
  return (
    <g>
      {/* antena (menunduk: dilipat ke belakang) */}
      {fold ? (
        <g>
          <path d="M-14 -34 L-30 -36" stroke={TEAL_D} strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={-33} cy={-36} r={4} fill="#ff6b5b" className="robi-led" />
        </g>
      ) : (
        <g>
          <path d="M-6 -40 L-9 -49" stroke={TEAL_D} strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={-9} cy={-52} r={4} fill="#ff6b5b" className="robi-led" />
        </g>
      )}
      {/* ekor ikat kepala berkibar */}
      <path d="M-23 -35 Q-33 -38 -42 -32 L-39 -28 Q-31 -32 -23 -31 Z" fill="#e8385a" />
      <path d="M-23 -32 Q-31 -28 -35 -20 L-31 -19 Q-28 -25 -22 -29 Z" fill="#c9304c" />
      <rect x={-4} y={-4} width={8} height={7} fill={TEAL_D} />
      <rect x={-25} y={-40} width={50} height={40} rx={17} fill="url(#kr-agam-g)" stroke={TEAL_D} strokeWidth={3.5} />
      <circle cx={-10} cy={-18} r={5.5} fill={TEAL_D} opacity={0.35} />
      <circle cx={-10} cy={-18} r={2.4} fill="#fff" opacity={0.55} />
      <rect x={3} y={-31} width={26} height={19} rx={9.5} fill="#1b2a4e" />
      {face === 'normal' && (
        <g>
          <circle cx={18} cy={-21.5} r={5.4} fill="#7df9ff" className="robi-eye" />
          <circle cx={16.4} cy={-23.2} r={1.6} fill="#fff" />
        </g>
      )}
      {face === 'happy' && <path d="M12.5 -19 Q18 -28 23.5 -19" stroke="#7df9ff" strokeWidth={3.4} fill="none" strokeLinecap="round" />}
      {face === 'dizzy' && <path d="M18 -21.5 m0 -1 a1.5 1.5 0 1 1 -1.5 1.5 a3.5 3.5 0 0 1 3.5 -3.5 a5 5 0 0 1 5 5 a6.5 6.5 0 0 1 -6.5 6.5" stroke="#7df9ff" strokeWidth={1.8} fill="none" strokeLinecap="round" />}
      {face === 'happy' ? (
        <path d="M11 -9 Q18 -1 24 -9 Z" fill="#1b2a4e" stroke={TEAL_D} strokeWidth={1.5} strokeLinejoin="round" />
      ) : face === 'dizzy' ? (
        <path d="M12 -7 q3 -3 6 0 t6 0" stroke={TEAL_D} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M13 -8 Q18 -4 23 -8" stroke={TEAL_D} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      )}
      {/* ikat kepala */}
      <rect x={-26} y={-37} width={52} height={7} rx={3.5} fill="#ff4f6d" stroke="#c9304c" strokeWidth={1.4} />
      <path d="M-20 -33.5 H18" stroke="#fff" strokeWidth={1.4} opacity={0.6} />
      <path d="M-18 -38 Q-12 -42 -2 -42" stroke="#fff" strokeOpacity={0.5} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** badan; titik asal = pinggul (tengah bawah badan) */
function Torso() {
  return (
    <g>
      <rect x={-17} y={-32} width={34} height={32} rx={12} fill="url(#kr-agam-g)" stroke={TEAL_D} strokeWidth={3.5} />
      <circle cx={9} cy={-17} r={8} fill="#ffd23f" opacity={0.35} />
      <circle cx={9} cy={-17} r={4.8} fill="#ffd23f" stroke="#e0a100" strokeWidth={1.5} />
      <path d="M-11 -24 Q-12 -15 -10 -7" stroke="#fff" strokeOpacity={0.4} strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
  );
}

type PoseDef = {
  legs: [Pt[], Pt[]];
  shoes: [number, number];
  arms: [Pt[], Pt[]];
  torso: Pt;
  head: Pt;
  tilt?: number;
  face?: 'normal' | 'dizzy' | 'happy';
  fold?: boolean;
};

const POSES: Record<RunPose, PoseDef> = {
  idle: {
    legs: [
      [[-8, -28], [-8, -19], [-9, -11]],
      [[4, -28], [4, -19], [5, -11]],
    ],
    shoes: [0, 0],
    arms: [
      [[-4, -50], [-8, -40], [-6, -31]],
      [[0, -50], [2, -40], [6, -32]],
    ],
    torso: [-2, -26],
    head: [0, -58],
  },
  run: {
    legs: [
      [[-8, -28], [-16, -20], [-26, -18]],
      [[4, -28], [16, -22], [20, -11]],
    ],
    shoes: [35, -10],
    arms: [
      [[-4, -50], [6, -44], [14, -52]],
      [[0, -50], [-10, -42], [-16, -33]],
    ],
    torso: [-2, -26],
    head: [0, -58],
    tilt: 8,
  },
  jump: {
    legs: [
      [[-8, -28], [2, -18], [-8, -12]],
      [[4, -28], [16, -24], [12, -12]],
    ],
    shoes: [20, 10],
    arms: [
      [[-4, -50], [-14, -64], [-20, -78]],
      [[0, -50], [18, -58], [34, -68]],
    ],
    torso: [-2, -26],
    head: [0, -58],
  },
  duck: {
    legs: [
      [[-12, -12], [2, -16], [-8, -11]],
      [[-2, -12], [14, -16], [8, -11]],
    ],
    shoes: [0, 0],
    arms: [
      [[-12, -34], [-6, -22], [4, -20]],
      [[-8, -34], [0, -22], [10, -18]],
    ],
    torso: [-8, -8],
    head: [12, -18],
    face: 'normal',
    fold: true,
  },
  bump: {
    legs: [
      [[-8, -28], [-12, -19], [-14, -11]],
      [[4, -28], [10, -20], [14, -11]],
    ],
    shoes: [0, -15],
    arms: [
      [[-4, -50], [-16, -58], [-26, -54]],
      [[0, -50], [12, -60], [20, -72]],
    ],
    torso: [-2, -26],
    head: [0, -58],
    tilt: -14,
    face: 'dizzy',
  },
  win: {
    legs: [
      [[-8, -28], [-9, -19], [-11, -11]],
      [[4, -28], [5, -19], [7, -11]],
    ],
    shoes: [0, 0],
    arms: [
      [[-4, -50], [-16, -66], [-24, -84]],
      [[0, -50], [22, -60], [34, -80]],
    ],
    torso: [-2, -26],
    head: [0, -58],
    face: 'happy',
  },
};

/** Agam pelari tampak samping, menghadap kanan; kaki di (0,0), tinggi ±110 (merunduk ±60). */
export function AgamRunner({ pose }: { pose: RunPose }) {
  const P = POSES[pose];
  const [back, front] = P.legs;
  const [farArm, nearArm] = P.arms;
  const tilt = P.tilt ? `rotate(${P.tilt} ${P.torso[0]} ${P.torso[1]})` : undefined;
  const hand = (p: Pt[], c: string) => <circle cx={p[2][0]} cy={p[2][1]} r={5} fill={c} stroke={TEAL_D} strokeWidth={2} />;
  return (
    <g>
      <defs>
        <radialGradient id="kr-agam-g" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#7ff0d6" />
          <stop offset="0.55" stopColor="#2ec4a6" />
          <stop offset="1" stopColor="#15907a" />
        </radialGradient>
      </defs>
      {pose !== 'jump' && <ellipse cx={0} cy={1} rx={pose === 'duck' ? 30 : 24} ry={4.5} fill="#000" opacity={0.2} />}
      {pose === 'run' && (
        <g stroke="#9fb3c8" strokeWidth={3} strokeLinecap="round" opacity={0.7}>
          <path d="M-36 -84 h-22 M-40 -64 h-28 M-34 -44 h-18" />
        </g>
      )}
      <g className={pose === 'run' ? 'ka-bob' : pose === 'win' ? 'ka-hop' : undefined}>
        {/* kaki belakang & lengan jauh (lebih gelap) */}
        <Limb p={back} w={8} c="#4f586b" />
        <Shoe at={back[2]} a={P.shoes[0]} back />
        <g transform={tilt}>
          <Limb p={farArm} w={7} c="#23a88e" />
          {hand(farArm, '#23a88e')}
          <g transform={`translate(${P.torso[0]} ${P.torso[1]})`}>
            <Torso />
          </g>
        </g>
        {/* kaki depan */}
        <Limb p={front} w={8} c="#6b7488" />
        <Shoe at={front[2]} a={P.shoes[1]} />
        <g transform={tilt}>
          <Limb p={nearArm} w={7} c={TEAL} />
          {hand(nearArm, TEAL)}
          <g transform={`translate(${P.head[0]} ${P.head[1]})`}>
            <Head face={P.face ?? 'normal'} fold={P.fold} />
          </g>
        </g>
        {pose === 'bump' &&
          [
            [-26, -118, 0],
            [2, -128, 0.6],
            [28, -116, 1.2],
          ].map(([sx, sy, dl]) => <path key={sx} d={starD(sx, sy, 7)} fill="#ffd23f" stroke="#e0a100" strokeWidth={1.5} className="ka-twinkle" style={{ animationDelay: `${-dl}s` }} />)}
        {pose === 'win' && (
          <g>
            {sparkle(-38, -100, 1, '#ffd23f', 0)}
            {sparkle(44, -104, 1.2, '#ffd23f', 0.8)}
            {sparkle(4, -126, 0.8, '#ffffff', 0.4)}
          </g>
        )}
      </g>
    </g>
  );
}

/** Agam pelari tampak depan (ikat kepala, nomor dada, sepatu lari), melambai. */
export function AgamRunnerFront({ size = 84, wave = true }: { size?: number; wave?: boolean }) {
  return (
    <svg viewBox="0 0 120 130" width={size} height={size * 1.08} aria-hidden className={wave ? 'robi-wave' : undefined}>
      <line x1="60" y1="22" x2="60" y2="8" stroke="#178f78" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="8" r="7" fill="#ff6b5b" className="robi-led" />
      <rect x="18" y="20" width="84" height="66" rx="30" fill="#2ec4a6" stroke="#178f78" strokeWidth="5" />
      {/* ikat kepala + simpul di samping */}
      <path d="M19 30 Q60 22 101 30 L101 38 Q60 30 19 38 Z" fill="#ff4f6d" stroke="#c9304c" strokeWidth="1.5" />
      <path d="M26 32 Q60 26 94 32" stroke="#fff" strokeWidth="1.5" opacity="0.6" fill="none" />
      <path d="M100 32 q10 -6 14 2 q-8 2 -14 2 Z M100 35 q8 4 8 12 q-6 -4 -9 -9 Z" fill="#e8385a" />
      <rect x="30" y="40" width="60" height="32" rx="16" fill="#1b2a4e" />
      <circle cx="47" cy="56" r="7" fill="#7df9ff" className="robi-eye" />
      <circle cx="73" cy="56" r="7" fill="#7df9ff" className="robi-eye" />
      <circle cx="45" cy="54" r="2" fill="#fff" />
      <circle cx="71" cy="54" r="2" fill="#fff" />
      <path d="M50 78 Q60 84 70 78" fill="none" stroke="#178f78" strokeWidth="4" strokeLinecap="round" />
      <rect x="36" y="88" width="48" height="30" rx="12" fill="#2ec4a6" stroke="#178f78" strokeWidth="5" />
      {/* nomor dada */}
      <rect x="49" y="92" width="26" height="21" rx="3" fill="#fffaf0" stroke="#c9d2e0" strokeWidth="1.2" />
      <circle cx="52" cy="95" r="1.2" fill="#8a93a6" />
      <circle cx="72" cy="95" r="1.2" fill="#8a93a6" />
      <text x="62" y="109" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1b2a4e" fontFamily="system-ui, sans-serif">
        1
      </text>
      <circle cx="43" cy="103" r="3.6" fill="#ffd23f" stroke="#e0a100" strokeWidth="1" />
      <rect x="8" y="90" width="24" height="12" rx="6" fill="#2ec4a6" stroke="#178f78" strokeWidth="4" transform="rotate(-35 20 96)" />
      <rect x="88" y="90" width="24" height="12" rx="6" fill="#2ec4a6" stroke="#178f78" strokeWidth="4" />
      {/* sepatu lari */}
      {[36, 64].map((sx) => (
        <g key={sx}>
          <path d={`M${sx} 128 L${sx} 121 Q${sx} 117 ${sx + 5} 117 L${sx + 15} 117 Q${sx + 20} 117 ${sx + 20} 122 L${sx + 20} 128 Z`} fill="#ffffff" stroke="#8a93a6" strokeWidth="1.5" />
          <path d={`M${sx + 4} 123 L${sx + 10} 120 L${sx + 16} 123`} stroke="#ff4f6d" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x={sx - 1} y="126" width="22" height="3.5" rx="1.7" fill="#3b4256" />
        </g>
      ))}
    </svg>
  );
}
