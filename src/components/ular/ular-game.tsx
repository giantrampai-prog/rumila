'use client';

// Ular Tangga untuk 2–6 pemain (orang atau komputer). Papan diacak setiap permainan, dadu acak kriptografis
// yang adil (pemenang tidak bisa ditebak), urutan giliran diacak. Animasi: dadu 3D berputar, pion melompat
// petak demi petak, memanjat tangga, meluncur mengikuti badan ular, memantul di 100; semua bersuara.

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { sfx } from '@/lib/sfx';
import { useMe } from '@/lib/store';
import { completeTool, useToolSession } from '@/lib/tool-session';
import { cellXY, makeBoard, playTurn, rollDie, shuffle, type Board, type Player } from '@/lib/ular/game';
import './ular.css';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';
const TOOL = 'game-ular';

const AVATARS = ['🦁', '🐯', '🐼', '🐸', '🐰', '🐵', '🐶', '🐱', '🦊', '🐨', '🐷', '🐧'];
const COLORS = ['#ff4d6d', '#3a86ff', '#ffbe0b', '#2ec27e', '#9b5de5', '#ff8c42'];
const SNAKE_COLORS: [string, string][] = [
  ['#3fa34d', '#b7e36b'],
  ['#e8743b', '#ffd166'],
  ['#8e44ad', '#e0aaff'],
  ['#d62839', '#ffb3c1'],
  ['#118ab2', '#9be7ff'],
  ['#5c7c2b', '#e9f5a0'],
];

interface Saved {
  v: 1;
  board: Board;
  players: Player[];
  turn: number;
  sixAgain: boolean;
  winner: string | null;
}

/* ---------------- geometri papan (viewBox 1000 × 1090; baris "MULAI" di bawah) ---------------- */

const center = (n: number) => {
  if (n <= 0) return { x: 50, y: 1045 };
  const { col, row } = cellXY(n);
  return { x: col * 100 + 50, y: (9 - row) * 100 + 50 };
};

/** Titik-titik badan ular dari kepala ke ekor (meliuk), dipakai untuk menggambar & jalur meluncur. */
function snakePoints(from: number, to: number, seed: number) {
  const a = center(from),
    b = center(to);
  const dx = b.x - a.x,
    dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len,
    ny = dx / len;
  const waves = Math.max(1.5, Math.round(len / 170) + 0.5);
  const amp = 18 + (Math.abs(Math.round(seed)) % 3) * 4;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    const env = Math.sin(Math.PI * Math.min(1, t * 1.15)); // tenang di kepala & ekor
    const off = Math.sin(t * Math.PI * 2 * waves + seed) * amp * env;
    pts.push({ x: a.x + dx * t + nx * off, y: a.y + dy * t + ny * off });
  }
  return pts;
}

const pathOf = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

function BoardSvg({ board, tokens, players, moving }: { board: Board; tokens: Record<string, { x: number; y: number; lift: number }>; players: Player[]; moving: string | null }) {
  const snakes = useMemo(() => board.jumps.filter((j) => j.kind === 'snake').map((j, i) => ({ j, i, pts: snakePoints(j.from, j.to, i * 1.7 + j.from) })), [board]);
  const ladders = board.jumps.filter((j) => j.kind === 'ladder');
  // pion yang berada di petak yang sama digeser sedikit agar semua terlihat
  const groups = new Map<string, string[]>();
  for (const p of players) {
    const t = tokens[p.id];
    if (!t) continue;
    const key = `${Math.round(t.x / 20)}:${Math.round(t.y / 20)}`;
    groups.set(key, [...(groups.get(key) ?? []), p.id]);
  }
  const offset = (id: string) => {
    const t = tokens[id];
    const g = groups.get(`${Math.round(t.x / 20)}:${Math.round(t.y / 20)}`) ?? [id];
    if (g.length < 2 || id === moving) return { x: 0, y: 0 };
    const k = g.indexOf(id);
    const a = (k / g.length) * Math.PI * 2;
    return { x: Math.cos(a) * 22, y: Math.sin(a) * 22 };
  };
  const tone = ['#fff3c4', '#ffe0ec', '#d8f3ff', '#e2f7d6', '#efe2ff'];
  return (
    <svg viewBox="0 0 1000 1090" className="h-full w-full select-none" role="img" aria-label="Papan ular tangga">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.35" />
        </filter>
      </defs>
      <rect x="0" y="0" width="1000" height="1000" rx="18" fill="#fff" />
      {Array.from({ length: 100 }, (_, i) => {
        const n = i + 1;
        const { col, row } = cellXY(n);
        const x = col * 100,
          y = (9 - row) * 100;
        const fill = (col + row) % 2 ? tone[row % tone.length] : '#ffffff';
        return (
          <g key={n}>
            <rect x={x + 2} y={y + 2} width="96" height="96" rx="12" fill={fill} stroke="#f1e4cf" strokeWidth="2" />
            <text x={x + 10} y={y + 26} fontSize="22" fontWeight="800" fill="#7a6a8a" fontFamily="system-ui">
              {n}
            </text>
          </g>
        );
      })}
      <text x="50" y="60" fontSize="30" textAnchor="middle" dominantBaseline="middle">
        🏆
      </text>
      {/* tangga kayu */}
      {ladders.map((j) => {
        const a = center(j.from),
          b = center(j.to);
        const dx = b.x - a.x,
          dy = b.y - a.y,
          len = Math.hypot(dx, dy);
        const nx = (-dy / len) * 20,
          ny = (dx / len) * 20;
        const rungs = Math.floor(len / 42);
        return (
          <g key={`l${j.from}`} filter="url(#shadow)">
            {[-1, 1].map((s) => (
              <line key={s} x1={a.x + nx * s} y1={a.y + ny * s} x2={b.x + nx * s} y2={b.y + ny * s} stroke="#9a6532" strokeWidth="11" strokeLinecap="round" />
            ))}
            {Array.from({ length: rungs }, (_, k) => {
              const t = (k + 0.7) / (rungs + 0.4);
              const cx = a.x + dx * t,
                cy = a.y + dy * t;
              return <line key={k} x1={cx - nx} y1={cy - ny} x2={cx + nx} y2={cy + ny} stroke="#b07a3e" strokeWidth="8" strokeLinecap="round" />;
            })}
          </g>
        );
      })}
      {/* ular meliuk berpola */}
      {snakes.map(({ j, i, pts }) => {
        const [c1, c2] = SNAKE_COLORS[i % SNAKE_COLORS.length];
        const body = pathOf(pts);
        const tail = pathOf(pts.slice(34));
        const h = pts[0],
          h2 = pts[3];
        const ang = (Math.atan2(h.y - h2.y, h.x - h2.x) * 180) / Math.PI;
        return (
          <g key={`s${j.from}`} filter="url(#shadow)">
            <path d={body} fill="none" stroke="#1d3b1d" strokeOpacity="0.55" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
            <path d={body} fill="none" stroke={c1} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
            <path d={tail} fill="none" stroke={c1} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <path d={body} fill="none" stroke={c2} strokeWidth="9" strokeDasharray="10 16" strokeLinecap="round" strokeLinejoin="round" />
            <g transform={`translate(${h.x} ${h.y}) rotate(${ang})`}>
              <path d="M18 0 l14 -5 M18 0 l14 5" stroke="#e63946" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="0" cy="0" rx="24" ry="18" fill={c1} stroke="#1d3b1d" strokeOpacity="0.55" strokeWidth="3" />
              <circle cx="6" cy="-8" r="6" fill="#fff" />
              <circle cx="6" cy="8" r="6" fill="#fff" />
              <circle cx="8" cy="-8" r="3" fill="#111" />
              <circle cx="8" cy="8" r="3" fill="#111" />
            </g>
          </g>
        );
      })}
      {/* garis mulai */}
      <rect x="0" y="1008" width="1000" height="78" rx="16" fill="#ffe8a3" stroke="#f1c85a" strokeWidth="3" />
      <text x="990" y="1056" fontSize="30" fontWeight="900" textAnchor="end" fill="#a86a00" fontFamily="system-ui">
        MULAI →
      </text>
      {/* pion */}
      {players.map((p) => {
        const t = tokens[p.id];
        if (!t) return null;
        const o = offset(p.id);
        return (
          <g key={p.id} transform={`translate(${t.x + o.x} ${t.y + o.y - t.lift})`} className={p.id === moving ? 'ular-token-moving' : ''}>
            <ellipse cx="0" cy={30 + t.lift} rx="22" ry="7" fill="#000" opacity={0.2} />
            <circle r="30" fill={p.color} stroke="#fff" strokeWidth="6" />
            <text y="11" fontSize="32" textAnchor="middle">
              {p.avatar}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- dadu 3D ---------------- */

const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
  6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
};
const FACE_ROT: Record<number, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateY(-90deg)',
  3: 'rotateX(-90deg)',
  4: 'rotateX(90deg)',
  5: 'rotateY(90deg)',
  6: 'rotateY(180deg)',
};

function Dice({ value, rolling, shaking = false, size = 84 }: { value: number; rolling: boolean; shaking?: boolean; size?: number }) {
  const faces: [number, string][] = [
    [1, `translateZ(${size / 2}px)`],
    [2, `rotateY(90deg) translateZ(${size / 2}px)`],
    [3, `rotateX(90deg) translateZ(${size / 2}px)`],
    [4, `rotateX(-90deg) translateZ(${size / 2}px)`],
    [5, `rotateY(-90deg) translateZ(${size / 2}px)`],
    [6, `rotateY(180deg) translateZ(${size / 2}px)`],
  ];
  return (
    <div className="ular-dice-scene" style={{ width: size, height: size }}>
      <div className={`ular-dice ${rolling ? 'ular-dice-rolling' : shaking ? 'ular-dice-shake' : ''}`} style={{ transform: rolling || shaking ? undefined : FACE_ROT[value] }}>
        {faces.map(([n, tr]) => (
          <div key={n} className="ular-dice-face" style={{ transform: tr, width: size, height: size }}>
            <svg viewBox="0 0 100 100" width={size} height={size}>
              {PIPS[n].map(([x, y], k) => (
                <circle key={k} cx={x} cy={y} r="9" fill={n === 1 ? '#e63946' : INK} />
              ))}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- permainan ---------------- */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function UlarGame() {
  const me = useMe();
  const memberId = me?.id ?? 'dev';
  useToolSession(memberId, TOOL, 'game');
  const router = useRouter();
  const key = `rumila-ular-${memberId}`;

  const [game, setGame] = useState<Saved | null>(null);
  const [resume, setResume] = useState<Saved | null>(null);
  // pengaturan
  const [mode, setMode] = useState<null | 'cpu' | 'orang'>(null);
  const [count, setCount] = useState(2);
  const [cpuCount, setCpuCount] = useState(1);
  const [slots, setSlots] = useState(() => Array.from({ length: 6 }, (_, i) => ({ name: i === 0 ? 'Aku' : '', avatar: AVATARS[i] })));
  const [shaking, setShaking] = useState(false);
  const shakeRef = useRef<{ t: number; timer: number } | null>(null);
  const boardBox = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(0);
  const [sixAgain, setSixAgain] = useState(true);
  // animasi
  const [tokens, setTokens] = useState<Record<string, { x: number; y: number; lift: number }>>({});
  const [moving, setMoving] = useState<string | null>(null);
  const [dice, setDice] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const gameRef = useRef<Saved | null>(null);
  gameRef.current = game;

  useEffect(() => {
    if (me?.name) setSlots((s) => s.map((x, i) => (i === 0 && x.name === 'Aku' ? { ...x, name: me.name } : x)));
  }, [me?.name]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const g = JSON.parse(raw) as Saved;
        if (g.v === 1 && !g.winner) setResume(g);
      }
    } catch {}
  }, [key]);

  const save = useCallback(
    (g: Saved) => {
      try {
        localStorage.setItem(key, JSON.stringify(g));
      } catch {}
    },
    [key],
  );

  const placeAll = (g: Saved) => {
    const t: Record<string, { x: number; y: number; lift: number }> = {};
    for (const p of g.players) t[p.id] = { ...center(p.pos), lift: 0 };
    setTokens(t);
  };

  const start = (g: Saved) => {
    setGame(g);
    placeAll(g);
    save(g);
    setMsg(`Giliran ${g.players[g.turn].avatar} ${g.players[g.turn].name}`);
  };

  const newGame = () => {
    sfx.celebrate(0.4);
    const CPU_NAMES = ['Robo', 'Bip', 'Kiko', 'Zeta', 'Nano'];
    const ps: Player[] =
      mode === 'cpu'
        ? [
            { id: 'p0', name: slots[0].name.trim() || 'Aku', avatar: slots[0].avatar, color: COLORS[0], cpu: false, pos: 0 },
            ...Array.from({ length: cpuCount }, (_, i) => ({ id: `p${i + 1}`, name: `🤖 ${CPU_NAMES[i]}`, avatar: AVATARS[i + 1], color: COLORS[i + 1], cpu: true, pos: 0 })),
          ]
        : slots.slice(0, count).map((s, i) => ({ id: `p${i}`, name: s.name.trim(), avatar: s.avatar, color: COLORS[i], cpu: false, pos: 0 }));
    start({ v: 1, board: makeBoard(), players: shuffle(ps), turn: 0, sixAgain, winner: null });
  };

  /** Gerakkan pion dari a ke b dengan lompatan melengkung. */
  const tween = (id: string, a: { x: number; y: number }, b: { x: number; y: number }, ms: number, arc: number) =>
    new Promise<void>((res) => {
      const t0 = performance.now();
      const f = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        setTokens((t) => ({ ...t, [id]: { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, lift: Math.sin(Math.PI * k) * arc } }));
        if (k < 1) requestAnimationFrame(f);
        else res();
      };
      requestAnimationFrame(f);
    });
  /** Gerakkan pion menyusuri titik-titik (tangga / badan ular). */
  const follow = (id: string, pts: { x: number; y: number }[], ms: number) =>
    new Promise<void>((res) => {
      const t0 = performance.now();
      const seg = pts.length - 1;
      const f = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        const e = k * k * (3 - 2 * k);
        const u = e * seg,
          i = Math.min(seg - 1, Math.floor(u)),
          fr = u - i;
        const p = { x: pts[i].x + (pts[i + 1].x - pts[i].x) * fr, y: pts[i].y + (pts[i + 1].y - pts[i].y) * fr };
        setTokens((t) => ({ ...t, [id]: { ...p, lift: 4 } }));
        if (k < 1) requestAnimationFrame(f);
        else res();
      };
      requestAnimationFrame(f);
    });

  const roll = useCallback(async (thrown = false) => {
    const g = gameRef.current;
    if (!g || busy || g.winner) return;
    setBusy(true);
    const p = g.players[g.turn];
    // kocok dadu
    setRolling(true);
    sfx.diceRoll();
    await wait(thrown ? 520 : 750);
    const r = rollDie();
    setDice(r);
    setRolling(false);
    sfx.diceLand();
    await wait(350);
    const res = playTurn(g.board, p.pos, r, g.sixAgain);
    setMsg(`${p.avatar} ${p.name} dapat ${r}!`);
    setMoving(p.id);
    // melangkah petak demi petak (memantul di 100)
    let cur = center(p.pos);
    for (let i = 0; i < res.steps.length; i++) {
      const n = res.steps[i];
      const nx = center(n);
      sfx.hop(i);
      await tween(p.id, cur, nx, 230, 28);
      cur = nx;
      if (n === 100 && i < res.steps.length - 1) {
        sfx.bounceBack();
        setMsg('Kelebihan! Mundur lagi…');
      }
    }
    // tangga atau ular
    if (res.jump) {
      await wait(200);
      if (res.jump.kind === 'ladder') {
        sfx.ladder();
        setMsg(`🪜 ${p.name} naik tangga ${res.jump.from} → ${res.jump.to}!`);
        await follow(p.id, [cur, center(res.jump.to)], 950);
      } else {
        sfx.snake();
        setMsg(`🐍 Ups! ${p.name} dimakan ular ${res.jump.from} → ${res.jump.to}`);
        const idx = g.board.jumps.filter((j) => j.kind === 'snake').findIndex((j) => j.from === res.jump!.from);
        await follow(p.id, snakePoints(res.jump.from, res.jump.to, idx * 1.7 + res.jump.from), 1300);
      }
    }
    setMoving(null);
    const players = g.players.map((x) => (x.id === p.id ? { ...x, pos: res.final } : x));
    if (res.won) {
      sfx.celebrate();
      setMsg(`🏆 ${p.name} MENANG!`);
      const done = { ...g, players, winner: p.id };
      setGame(done);
      save(done);
      completeTool(memberId, TOOL, 'game', `menang:${p.cpu ? 'komputer' : 'orang'}:${Date.now()}`);
      setBusy(false);
      return;
    }
    const nextTurn = res.again ? g.turn : (g.turn + 1) % g.players.length;
    const next = { ...g, players, turn: nextTurn };
    setGame(next);
    save(next);
    await wait(250);
    const np = next.players[nextTurn];
    setMsg(res.again ? `🎲 Dapat 6! ${np.name} lempar lagi` : `Giliran ${np.avatar} ${np.name}`);
    setBusy(false);
  }, [busy, memberId, save]);

  // pemain komputer melempar sendiri
  useEffect(() => {
    if (!game || game.winner || busy) return;
    if (!game.players[game.turn].cpu) return;
    const t = setTimeout(() => void roll(), 1100);
    return () => clearTimeout(t);
  }, [game, busy, roll]);

  // papan selebar & setinggi mungkin (layar penuh)
  const playing = !!game;
  useEffect(() => {
    const el = boardBox.current;
    if (!el) return;
    const fit = () => setBoardSize(Math.max(200, Math.min(el.clientWidth - 12, (el.clientHeight - 12) / 1.09)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [playing]);

  // dadu manual: tahan → dadu berguncang & berbunyi; lepas → dadu dilempar
  const canThrow = !!game && !game.winner && !busy && !game.players[game.turn].cpu;
  const shakeStart = () => {
    if (!canThrow || shakeRef.current) return;
    setShaking(true);
    sfx.diceRoll();
    shakeRef.current = { t: performance.now(), timer: window.setInterval(() => sfx.diceRoll(), 480) };
  };
  const shakeEnd = () => {
    const sh = shakeRef.current;
    if (!sh) return;
    window.clearInterval(sh.timer);
    shakeRef.current = null;
    setShaking(false);
    void roll(true);
  };
  const throwHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      shakeStart();
    },
    onPointerUp: shakeEnd,
    onPointerCancel: shakeEnd,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (canThrow) void roll();
      }
    },
  };

  /* ---------- tampilan ---------- */

  const namesOk = mode !== 'orang' || slots.slice(0, count).every((x) => x.name.trim().length > 0);
  const avatarBtn = (i: number) => (
    <button
      onClick={() => (sfx.pick(), setSlots((x) => x.map((y, k) => (k === i ? { ...y, avatar: AVATARS[(AVATARS.indexOf(y.avatar) + 1) % AVATARS.length] } : y))))}
      aria-label="Ganti avatar"
      className="flex size-14 shrink-0 items-center justify-center rounded-full text-[32px] active:scale-90"
      style={{ background: `${COLORS[i]}33` }}
    >
      {slots[i].avatar}
    </button>
  );
  const nameInput = (i: number, ph: string) => (
    <input
      value={slots[i].name}
      maxLength={14}
      placeholder={ph}
      onChange={(e) => setSlots((x) => x.map((y, k) => (k === i ? { ...y, name: e.target.value } : y)))}
      className="min-w-0 flex-1 rounded-[12px] bg-[#f6f2fb] px-3 py-2.5 text-[18px] font-extrabold outline-none placeholder:font-bold placeholder:opacity-40"
      style={{ fontFamily: BALOO, boxShadow: slots[i].name.trim() ? undefined : 'inset 0 0 0 2px #ffb3b3' }}
    />
  );
  const countBtns = (vals: number[], cur: number, set: (n: number) => void) => (
    <div className="flex gap-2">
      {vals.map((n) => (
        <button
          key={n}
          onClick={() => (sfx.tap(), set(n))}
          className="flex-1 rounded-[16px] py-3 active:scale-95"
          style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 900, background: cur === n ? '#ff8c42' : '#fff3e0', color: cur === n ? '#fff' : INK, boxShadow: cur === n ? '0 4px 0 #c2621d' : '0 3px 0 #f1d7b5' }}
        >
          {n}
        </button>
      ))}
    </div>
  );

  if (!game)
    return (
      <div className="ular-bg fixed inset-0 overflow-y-auto" style={{ color: INK }}>
        <div className="mx-auto flex min-h-full w-full max-w-[620px] flex-col gap-4 p-4" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => (mode ? (sfx.close(), setMode(null)) : router.back())} aria-label="Kembali" className="flex size-12 items-center justify-center rounded-full bg-white shadow-[0_4px_0_rgba(0,0,0,.12)] active:scale-90">
              <Icon name="arrow_back" size={26} />
            </button>
            <h1 className="flex-1 text-center" style={{ fontFamily: BALOO, fontSize: 34, fontWeight: 900 }}>
              🐍 Ular Tangga 🪜
            </h1>
            <span className="size-12" />
          </div>
          {!mode && (
            <>
              {resume && (
                <button onClick={() => (sfx.open(), start(resume))} className="rounded-[20px] bg-[#2ec27e] p-3 text-white shadow-[0_5px_0_#1e8a58] active:translate-y-1" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800 }}>
                  ▶ Lanjutkan permainan tadi
                </button>
              )}
              <div className="text-center text-[20px] font-extrabold" style={{ fontFamily: BALOO }}>
                Mau main dengan siapa?
              </div>
              {(
                [
                  ['cpu', '🤖', 'Lawan Komputer', 'Main sendiri melawan 1–5 robot pintar', '#3a86ff', '#1f5fc2'],
                  ['orang', '👨‍👩‍👧', 'Main bareng Orang', '2–6 pemain bergantian di satu layar', '#ff4d6d', '#c2334f'],
                ] as const
              ).map(([m, e, t, d, c, dc]) => (
                <button
                  key={m}
                  onClick={() => (sfx.open(), setMode(m))}
                  className="flex items-center gap-4 rounded-[26px] p-5 text-left text-white active:translate-y-1"
                  style={{ background: `linear-gradient(150deg, ${c}, ${dc})`, boxShadow: `0 6px 0 ${dc}` }}
                >
                  <span className="text-[56px] leading-none">{e}</span>
                  <span>
                    <span className="block" style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 900 }}>
                      {t}
                    </span>
                    <span className="block text-[15px] font-bold opacity-90">{d}</span>
                  </span>
                </button>
              ))}
              <div className="rounded-[20px] bg-white/70 p-3 text-[14px] leading-snug font-bold opacity-90">
                🎲 Dadu dilempar sendiri: tahan dadunya, lalu lepas! Hasilnya benar-benar acak & adil · 🗺️ letak ular & tangga diacak setiap permainan · 🎯 harus pas di 100 — kalau lebih, pion mundur (99 dapat 5 → 100, 99, 98, 97, 96).
              </div>
            </>
          )}
          {mode === 'cpu' && (
            <>
              <div className="rounded-[24px] bg-white/90 p-4 shadow-[0_6px_0_rgba(0,0,0,.08)]">
                <div className="mb-2 text-[16px] font-extrabold">Namamu</div>
                <div className="flex items-center gap-2">
                  {avatarBtn(0)}
                  {nameInput(0, 'Tulis namamu')}
                </div>
              </div>
              <div className="rounded-[24px] bg-white/90 p-4 shadow-[0_6px_0_rgba(0,0,0,.08)]">
                <div className="mb-2 text-[16px] font-extrabold">Berapa lawan komputer?</div>
                {countBtns([1, 2, 3, 4, 5], cpuCount, setCpuCount)}
              </div>
            </>
          )}
          {mode === 'orang' && (
            <>
              <div className="rounded-[24px] bg-white/90 p-4 shadow-[0_6px_0_rgba(0,0,0,.08)]">
                <div className="mb-2 text-[16px] font-extrabold">Berapa pemain?</div>
                {countBtns([2, 3, 4, 5, 6], count, setCount)}
              </div>
              <div className="flex flex-col gap-2">
                {slots.slice(0, count).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-[20px] bg-white/90 p-2 shadow-[0_4px_0_rgba(0,0,0,.08)]" style={{ borderLeft: `8px solid ${COLORS[i]}` }}>
                    {avatarBtn(i)}
                    {nameInput(i, `Nama pemain ${i + 1}`)}
                  </div>
                ))}
              </div>
              {!namesOk && <div className="text-center text-[14px] font-extrabold text-[#c2334f]">Tulis nama setiap pemain dulu ya ✏️</div>}
            </>
          )}
          {mode && (
            <>
              <label className="flex items-center gap-3 rounded-[20px] bg-white/90 p-3 text-[16px] font-extrabold shadow-[0_4px_0_rgba(0,0,0,.08)]">
                <input type="checkbox" checked={sixAgain} onChange={(e) => setSixAgain(e.target.checked)} className="size-6 accent-[#ff8c42]" />
                Dapat angka 6 → lempar lagi
              </label>
              <button
                onClick={newGame}
                disabled={!namesOk}
                className="mt-auto rounded-[24px] bg-[#ff8c42] py-4 text-white shadow-[0_6px_0_#c2621d] active:translate-y-1 disabled:opacity-40"
                style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 900 }}
              >
                Mulai main! 🎲
              </button>
            </>
          )}
        </div>
      </div>
    );

  const cur = game.players[game.turn];
  const winner = game.players.find((p) => p.id === game.winner);
  const ranking = [...game.players].sort((a, b) => b.pos - a.pos);
  return (
    <div className="ular-bg fixed inset-0 flex flex-col overflow-hidden lg:flex-row" style={{ color: INK, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* papan */}
      <div ref={boardBox} className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden p-1.5">
        <div className="ular-board-wrap rounded-[18px] bg-[#fff8ec] p-1 shadow-[0_8px_0_rgba(0,0,0,.12)]" style={{ width: boardSize, height: boardSize * 1.09 }}>
          <BoardSvg board={game.board} tokens={tokens} players={game.players} moving={moving} />
        </div>
      </div>
      {/* panel */}
      <div className="flex shrink-0 flex-col gap-1.5 px-2 pb-2 lg:w-[340px] lg:justify-center lg:py-2">
        <div className="flex items-center gap-2">
          <button onClick={() => (sfx.close(), setGame(null))} aria-label="Menu" className="flex size-11 items-center justify-center rounded-full bg-white shadow-[0_3px_0_rgba(0,0,0,.12)] active:scale-90">
            <Icon name="arrow_back" size={24} />
          </button>
          <div className="flex flex-1 gap-1.5 overflow-x-auto">
            {game.players.map((p, i) => (
              <div
                key={p.id}
                className={`flex shrink-0 items-center gap-1 rounded-full py-1 pr-2.5 pl-1 ${i === game.turn && !game.winner ? 'ular-turn' : ''}`}
                style={{ background: i === game.turn && !game.winner ? p.color : '#ffffffcc', color: i === game.turn && !game.winner ? '#fff' : INK }}
              >
                <span className="flex size-8 items-center justify-center rounded-full text-[20px]" style={{ background: '#ffffff55' }}>
                  {p.avatar}
                </span>
                <span className="text-[13px] font-extrabold" style={{ fontFamily: BALOO }}>
                  {p.name} · {p.pos || '–'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[22px] bg-white/90 p-2.5 shadow-[0_5px_0_rgba(0,0,0,.08)]">
          <button {...throwHandlers} disabled={!canThrow && !shaking} aria-label="Tahan lalu lepas untuk melempar dadu" className="shrink-0 touch-none disabled:opacity-100">
            <Dice value={dice} rolling={rolling} shaking={shaking} size={76} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-[17px] leading-tight font-extrabold" style={{ fontFamily: BALOO }}>
              {msg}
            </div>
            {!game.winner && (
              <button
                {...throwHandlers}
                disabled={(busy || cur.cpu) && !shaking}
                className="mt-2 w-full touch-none rounded-[16px] py-2.5 text-white shadow-[0_4px_0_rgba(0,0,0,.2)] select-none disabled:opacity-50"
                style={{ background: cur.color, fontFamily: BALOO, fontSize: 19, fontWeight: 900, transform: shaking ? 'scale(0.97)' : undefined }}
              >
                {cur.cpu ? `${cur.name} melempar…` : busy ? '…' : shaking ? '🫳 Lepas untuk melempar!' : `✊ ${cur.name}, tahan dadu lalu lepas!`}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* pemenang */}
      {winner && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/45 p-4">
          <div className="ular-confetti" aria-hidden>
            {Array.from({ length: 40 }, (_, i) => (
              <span key={i} style={{ left: `${(i * 37) % 100}%`, background: COLORS[i % COLORS.length], animationDelay: `${(i % 10) * 0.18}s`, animationDuration: `${2.4 + (i % 5) * 0.4}s` }} />
            ))}
          </div>
          <div className="ular-win relative w-full max-w-[420px] rounded-[28px] bg-white p-5 text-center shadow-[0_10px_0_rgba(0,0,0,.15)]">
            <div className="text-[64px] leading-none">{winner.avatar}</div>
            <div style={{ fontFamily: BALOO, fontSize: 32, fontWeight: 900 }}>{winner.name} menang! 🏆</div>
            <div className="mt-3 flex flex-col gap-1.5 text-left">
              {ranking.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2 rounded-[14px] px-3 py-1.5" style={{ background: `${p.color}22` }}>
                  <span className="w-6 font-extrabold">{i + 1}.</span>
                  <span className="text-[22px]">{p.avatar}</span>
                  <span className="flex-1 font-extrabold">{p.name}</span>
                  <span className="font-extrabold">{p.pos}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => (sfx.close(), setGame(null))} className="flex-1 rounded-[16px] bg-[#f1ecf7] py-3 font-extrabold active:scale-95">
                Menu
              </button>
              <button
                onClick={() => {
                  const ps = shuffle(game.players.map((p) => ({ ...p, pos: 0 })));
                  start({ v: 1, board: makeBoard(), players: ps, turn: 0, sixAgain: game.sixAgain, winner: null });
                  setDice(1);
                }}
                className="flex-1 rounded-[16px] bg-[#ff8c42] py-3 font-extrabold text-white shadow-[0_4px_0_#c2621d] active:translate-y-0.5"
              >
                Main lagi 🎲
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
