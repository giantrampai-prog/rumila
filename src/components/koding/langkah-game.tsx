'use client';

// Coding Agam · Langkah — anak menyusun perintah (maju, belok kiri, belok kanan) supaya robot Agam sampai ke
// bintang. Usia 3–8 tahun: 10 Level bertema (Kebun … Bulan) × 10 soal coding, makin tinggi makin sulit
// (soal 10 tiap Level paling sulit); selesai semua → sertifikat. Layar level: panggung diorama, strip program (ketuk blok untuk
// menambah, ketuk blok di program untuk menghapus, seret untuk mengubah urutan), Jalankan → Agam bergerak
// langkah demi langkah dengan blok aktif menyala; menabrak → terguncang + nomor blok; tombol Bantuan menunjuk
// blok berikutnya / blok yang salah. Bintang 1–3 (3 bila sehemat solusi terpendek). Progres per anak & Laporan.

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { DX, DY, nextHint, parse, run, starsFor, type Cmd, type Dir, type Level } from '@/lib/koding/engine';
import { LANGKAH } from '@/lib/koding/langkah';
import { sfx } from '@/lib/sfx';
import { useMe } from '@/lib/store';
import { completeTool, useToolSession } from '@/lib/tool-session';
import { Certificate } from './certificate';
import { BALOO, fmtDate, INK, LevelMap, PER_WORLD, summarize, useProgress, wait, WinDialog, withStars } from './shared';
import { AgamFront, Stage, WORLD } from './stage';
import './koding.css';

const TOOL = 'koding-langkah';
const TOTAL = LANGKAH.length;

const BLOCK: Record<Cmd, { label: string; icon: string; c: string; d: string }> = {
  maju: { label: 'maju', icon: 'arrow_upward', c: '#3a86ff', d: '#2463c9' },
  kiri: { label: 'belok kiri', icon: 'turn_left', c: '#8b5cf6', d: '#6a3fd1' },
  kanan: { label: 'belok kanan', icon: 'turn_right', c: '#8b5cf6', d: '#6a3fd1' },
};

/* ---------------- permainan ---------------- */

export function LangkahGame() {
  const me = useMe();
  const memberId = me?.id ?? 'dev';
  useToolSession(memberId, TOOL, 'coding');
  const router = useRouter();
  const [prog, saveProg] = useProgress(`rumila-koding-${memberId}`);

  const [li, setLi] = useState<number | null>(null);
  const level = li === null ? null : LANGKAH[li];
  const [code, setCode] = useState<Cmd[]>([]);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rot, setRot] = useState(0);
  const [bump, setBump] = useState(false);
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const [say, setSay] = useState('');
  const [win, setWin] = useState<number | null>(null);
  const [cert, setCert] = useState(false);
  /** bantuan: blok palet yang disarankan / nomor blok program yang salah */
  const [tipCmd, setTipCmd] = useState<Cmd | null>(null);
  const [tipBad, setTipBad] = useState<number | null>(null);
  const [fails, setFails] = useState(0);
  const runId = useRef(0);

  const { doneCount, starTotal, allDone, current } = summarize(LANGKAH, prog);

  const clearTip = () => {
    setTipCmd(null);
    setTipBad(null);
  };

  const resetAgam = useCallback((l: Level) => {
    const p = parse(l);
    setPos(p.start);
    setRot(l.dir * 90);
    setBump(false);
    setActive(-1);
  }, []);

  const openLevel = (i: number) => {
    sfx.open();
    const l = LANGKAH[i];
    setLi(i);
    setCode([]);
    setWin(null);
    setFails(0);
    clearTip();
    setSay(l.hint);
    resetAgam(l);
  };

  const stop = () => {
    runId.current++;
    setRunning(false);
    if (level) resetAgam(level);
  };

  const help = () => {
    if (!level || running) return;
    const h = nextHint(level, code);
    sfx.pick();
    if (h.kind === 'next') {
      setTipBad(null);
      setTipCmd(h.cmd);
      setSay(`Coba tambahkan blok "${BLOCK[h.cmd].label}" berikutnya.`);
    } else if (h.kind === 'wrong') {
      setTipCmd(null);
      setTipBad(h.i);
      setSay(`Blok nomor ${h.i + 1} sepertinya kurang tepat. Ketuk untuk menghapusnya.`);
    } else setSay('Programnya sudah benar! Tekan Jalankan.');
  };

  const go = async () => {
    if (!level || running) return;
    if (!code.length) {
      sfx.thud();
      setSay('Susun perintah dulu: ketuk blok di bawah.');
      return;
    }
    const id = ++runId.current;
    clearTip();
    setRunning(true);
    resetAgam(level);
    sfx.open();
    await wait(250);
    const r = run(level, code);
    let turn = level.dir * 90;
    let lastDir: Dir = level.dir;
    for (const s of r.steps) {
      if (runId.current !== id) return;
      setActive(s.i);
      if (s.kind === 'turn') {
        turn += (s.dir - lastDir + 4) % 4 === 1 ? 90 : -90;
        lastDir = s.dir;
        setRot(turn);
        sfx.whoosh();
        await wait(380);
      } else if (s.kind === 'move') {
        setPos({ x: s.x, y: s.y });
        sfx.hop(s.i);
        await wait(420);
      } else {
        // setengah langkah ke depan lalu terpental
        setPos({ x: s.x + DX[s.dir] * 0.28, y: s.y + DY[s.dir] * 0.28 });
        await wait(160);
        sfx.thud();
        setBump(true);
        setPos({ x: s.x, y: s.y });
        await wait(520);
        setBump(false);
      }
    }
    if (runId.current !== id) return;
    setRunning(false);
    if (r.result === 'win') {
      const st = starsFor(level, code.length);
      sfx.celebrate();
      setWin(st);
      if (!(prog.stars[level.id] ?? 0)) completeTool(memberId, TOOL, 'coding', `level:${level.id}`);
      saveProg(withStars(LANGKAH, prog, level.id, st));
      return;
    }
    const f = fails + 1;
    setFails(f);
    const nudge = f >= 2 ? ' Butuh bantuan? Ketuk lampu.' : '';
    if (r.result === 'bump') {
      const n = r.steps[r.steps.length - 1].i + 1;
      setSay(`Aduh, Agam menabrak! Cek blok nomor ${n}.${nudge}`);
    } else {
      setActive(-1);
      sfx.bounceBack();
      setSay(`Agam belum sampai di bintang. Tambah perintah lagi, ya.${nudge}`);
    }
  };

  /* ---------- strip program: ketuk = hapus, seret = pindah urutan ---------- */
  const drag = useRef<{ from: number; x: number; y: number; moved: boolean } | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const onBlockDown = (i: number) => (e: React.PointerEvent) => {
    if (running) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { from: i, x: e.clientX, y: e.clientY, moved: false };
  };
  const onBlockMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10) {
      d.moved = true;
      setDragFrom(d.from);
    }
    if (!d.moved) return;
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-slot]') as HTMLElement | null;
    setDragOver(el ? Number(el.dataset.slot) : null);
  };
  const onBlockUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      sfx.close();
      setCode((c) => c.filter((_, k) => k !== d.from));
    } else if (dragOver !== null && dragOver !== d.from) {
      sfx.pick();
      setCode((c) => {
        const n = [...c];
        const [b] = n.splice(d.from, 1);
        n.splice(dragOver, 0, b);
        return n;
      });
    }
    clearTip();
    setDragOver(null);
    setDragFrom(null);
    if (level && !running) resetAgam(level);
  };

  const add = (c: Cmd) => {
    if (running || code.length >= 30) return;
    sfx.pick();
    clearTip();
    setCode((x) => [...x, c]);
    if (level) resetAgam(level);
  };

  // blok yang sedang dijalankan selalu terlihat di strip program (strip bisa digulir)
  useEffect(() => {
    if (active < 0) return;
    document.querySelector(`[data-slot="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (cert)
    return (
      <Certificate
        game="Langkah"
        name={me?.name ?? 'Programmer Cilik'}
        stars={starTotal}
        date={allDone ? fmtDate(prog.certAt ?? new Date().toISOString()) : 'Tanggal selesai'}
        remaining={TOTAL - doneCount}
        onClose={() => setCert(false)}
      />
    );

  if (!level) {
    return (
      <LevelMap
        title="Langkah"
        list={LANGKAH}
        prog={prog}
        onBack={() => router.back()}
        onOpen={openLevel}
        onCert={() => setCert(true)}
        greeting={
          doneCount === 0
            ? 'Halo, aku Agam! Aku cuma bisa bergerak kalau diberi perintah. Susun perintahnya supaya aku sampai di bintang. Selesaikan 10 level (100 coding), kamu dapat Sertifikat Programmer Cilik!'
            : allDone
              ? 'Hebat! Kamu sudah menyelesaikan 10 level. Ini sertifikatmu!'
              : `Ayo lanjut ke Level ${Math.floor(current / PER_WORLD) + 1}, coding ${(current % PER_WORLD) + 1}! Tinggal ${TOTAL - doneCount} coding lagi untuk mendapat Sertifikat Programmer Cilik.`
        }
      />
    );
  }

  /* ---------- layar level ---------- */
  const W = WORLD[level.theme];
  const dark = !!W.dark;
  const lvNo = Math.floor(li! / PER_WORLD) + 1,
    codeNo = (li! % PER_WORLD) + 1;
  const worldEnd = codeNo === PER_WORLD;
  const pulseFirst = li! < 3 && code.length === 0 && !running;
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden landscape:flex-row" style={{ background: W.bg, color: INK, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <button onClick={() => (stop(), setLi(null))} aria-label="Peta level" className="koding-round flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5">
            <Icon name="arrow_back" size={24} />
          </button>
          <div className="koding-round min-w-0 truncate rounded-full px-4 py-2 font-extrabold" style={{ fontFamily: BALOO, fontSize: 17 }}>
            Level {lvNo} · {W.name} · coding {codeNo}
          </div>
          <button onClick={help} disabled={running} aria-label="Bantuan" className={`koding-round ml-auto flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5 disabled:opacity-50 ${fails >= 2 && !tipCmd && tipBad === null ? 'koding-pulse' : ''}`}>
            <Icon name="lightbulb" size={24} className="text-[#e0a100]" />
          </button>
        </div>
        {/* gelembung ucapan Agam */}
        <div className="flex items-end gap-2">
          <AgamFront size={44} />
          <div className="koding-say mb-1 rounded-[18px] px-4 py-2.5 text-[15px] font-bold" style={{ maxWidth: 560 }}>
            {say}
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="koding-diorama h-full w-full">
            <Stage level={level} pos={pos} rot={rot} bump={bump} won={win !== null} />
          </div>
        </div>
      </div>
      <div className="koding-panel flex w-full shrink-0 flex-col gap-2 self-center p-3 pt-0 landscape:justify-center landscape:self-stretch landscape:pt-3">
        <div className="text-[13px] font-extrabold" style={{ color: dark ? '#e7e4ff' : INK, opacity: 0.75 }}>
          Program Agam · {code.length} blok
        </div>
        <div className={`koding-rail ${dark ? 'koding-rail-dark' : ''} flex flex-wrap content-start gap-1.5 rounded-[18px] p-2`} onPointerMove={onBlockMove} onPointerUp={onBlockUp} onPointerCancel={onBlockUp}>
          {code.length === 0 && <span className="self-center px-2 text-[14px] font-bold opacity-60">Ketuk blok di bawah untuk menyusun perintah</span>}
          {code.map((c, i) => (
            <button
              key={i}
              data-slot={i}
              onPointerDown={onBlockDown(i)}
              className={`koding-block koding-block-sm touch-none select-none ${active === i ? 'koding-active' : ''} ${dragFrom === i ? 'opacity-40' : ''} ${dragOver === i && dragFrom !== i ? 'koding-drop' : ''} ${tipBad === i ? 'koding-bad' : ''}`}
              style={{ background: BLOCK[c].c, boxShadow: `0 3px 0 ${BLOCK[c].d}` }}
              aria-label={`Blok ${i + 1}: ${BLOCK[c].label}. Ketuk untuk menghapus`}
            >
              <span className="koding-num">{i + 1}</span>
              <Icon name={BLOCK[c].icon} size={20} />
            </button>
          ))}
        </div>
        <div className="grid justify-center gap-2" style={{ gridTemplateColumns: `repeat(${level.blocks.length}, minmax(0, 150px))` }}>
          {level.blocks.map((c) => (
            <button
              key={c}
              onClick={() => add(c)}
              disabled={running}
              className={`koding-block flex flex-col items-center gap-0.5 py-2 text-white disabled:opacity-50 ${tipCmd === c || (pulseFirst && c === 'maju') ? 'koding-pulse' : ''}`}
              style={{ background: BLOCK[c].c, boxShadow: `0 5px 0 ${BLOCK[c].d}` }}
            >
              <Icon name={BLOCK[c].icon} size={28} />
              <span style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800 }}>{BLOCK[c].label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {running ? (
            <button onClick={stop} className="flex-1 rounded-[18px] bg-[#e04f5f] py-3.5 text-white shadow-[0_5px_0_#a8323f] active:translate-y-1" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 900 }}>
              Berhenti
            </button>
          ) : (
            <button onClick={go} className="flex-1 rounded-[18px] bg-[#22b573] py-3.5 text-white shadow-[0_5px_0_#16804f] active:translate-y-1" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 900 }}>
              ▶ Jalankan
            </button>
          )}
          <button onClick={() => (sfx.close(), setCode([]), clearTip(), resetAgam(level))} disabled={running} aria-label="Hapus semua blok" className="koding-round flex w-14 items-center justify-center rounded-[18px] disabled:opacity-40">
            <Icon name="delete" size={24} />
          </button>
        </div>
      </div>

      {win !== null && (
        <WinDialog
          stars={win}
          title={allDone && li === TOTAL - 1 ? '10 level selesai!' : worldEnd ? `Level ${lvNo} selesai!` : 'Agam sampai!'}
          message={win === 3 ? `Hebat! Cuma ${code.length} blok, paling hemat.` : `Pakai ${code.length} blok. Bisa lebih hemat untuk 3 bintang?`}
          unlockNote={worldEnd && li! < TOTAL - 1 ? `Level ${lvNo + 1} · ${WORLD[LANGKAH[li! + 1].theme].name} sekarang terbuka!` : undefined}
          onRetry={() => (setWin(null), resetAgam(level))}
          next={
            allDone && li === TOTAL - 1
              ? { label: 'Ambil sertifikat', gold: true, onClick: () => (setWin(null), setLi(null), setCert(true)) }
              : li! < TOTAL - 1
                ? { label: worldEnd ? `Ke Level ${lvNo + 1}` : 'Coding berikutnya', onClick: () => openLevel(li! + 1) }
                : { label: 'Selesai', onClick: () => (setWin(null), setLi(null)) }
          }
        />
      )}
    </div>
  );
}
