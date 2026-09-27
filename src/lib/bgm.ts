'use client';

// Musik latar yang berulang tanpa putus. Lagu yang punya bagian awal membesar & akhir mengecil tidak diputar
// sampai habis: sebelum bagian akhir mengecil, putaran berikutnya dimulai dari setelah bagian awal sambil
// dua putaran saling-silang (crossfade), jadi musik tidak pernah terdengar berhenti.
// Volume diatur lewat Web Audio (GainNode) karena iPhone/iPad mengabaikan audio.volume. Dua elemen <audio>
// bersama (lihat audio-unlock) bergantian memutar lagu.

import { sharedAudio } from './audio-unlock';

interface Opts {
  /** 0–1, jauh di bawah suara narasi */
  volume: number;
  /** detik awal putaran ulang (lewati bagian awal yang membesar) */
  loopStart: number;
  /** detik saat putaran berikutnya mulai menyilang (sebelum bagian akhir mengecil) */
  loopEnd: number;
  /** lama silang (detik) */
  fade: number;
}

let ctx: AudioContext | null = null;
const routed = new WeakMap<HTMLAudioElement, GainNode>();

function context() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/** sambungkan elemen ke GainNode sekali saja (satu elemen hanya boleh punya satu MediaElementSource) */
function gainFor(a: HTMLAudioElement) {
  const have = routed.get(a);
  if (have) return have;
  const c = context();
  if (!c) return null;
  try {
    const g = c.createGain();
    g.gain.value = 0;
    c.createMediaElementSource(a).connect(g).connect(c.destination);
    routed.set(a, g);
    return g;
  } catch {
    return null;
  }
}

export class LoopMusic {
  private els: [HTMLAudioElement, HTMLAudioElement];
  private cur = 0;
  private on = false;
  private crossing = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private stopTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private src: string,
    keys: [string, string],
    private o: Opts,
  ) {
    this.els = [sharedAudio(keys[0]), sharedAudio(keys[1])];
  }

  private prepare(a: HTMLAudioElement) {
    if (!a.src.endsWith(this.src)) {
      a.src = this.src;
      a.currentTime = 0;
    }
    a.loop = false;
  }

  /** atur volume satu elemen menuju v dalam s detik */
  private ramp(a: HTMLAudioElement, v: number, s: number) {
    const g = gainFor(a);
    const c = context();
    if (g && c) {
      a.volume = 1;
      const now = c.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(v, now + Math.max(0.02, s));
      return;
    }
    // cadangan tanpa Web Audio (volume elemen)
    const from = a.volume,
      t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / (s * 1000 || 1));
      a.volume = Math.max(0, Math.min(1, from + (v - from) * k));
      if (k < 1) requestAnimationFrame(step);
    };
    step();
  }

  /** mulai / lanjutkan (panggil dari ketukan pengguna bila bisa) */
  play() {
    if (this.stopTimer) clearTimeout(this.stopTimer);
    this.stopTimer = null;
    if (this.on) return;
    this.on = true;
    void context()?.resume();
    this.els.forEach((x) => this.prepare(x)); // elemen kedua ikut dimuat, siap menyilang
    const a = this.els[this.cur];
    a.play().catch(() => {});
    this.ramp(a, this.o.volume, 1.2);
    this.timer ??= setInterval(() => this.tick(), 250);
  }

  /** jeda sebentar (lagu melanjutkan dari posisi yang sama) */
  pause() {
    if (!this.on) return;
    this.on = false;
    this.crossing = false;
    for (const a of this.els) this.ramp(a, 0, 0.4);
    this.stopTimer = setTimeout(() => this.els.forEach((a) => a.pause()), 450);
  }

  /** berhenti pelan & kembali ke awal lagu */
  stop(fade = 2) {
    this.on = false;
    this.crossing = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    for (const a of this.els) this.ramp(a, 0, fade);
    if (this.stopTimer) clearTimeout(this.stopTimer);
    this.stopTimer = setTimeout(
      () =>
        this.els.forEach((a) => {
          a.pause();
          if (a.src.endsWith(this.src)) a.currentTime = 0;
        }),
      fade * 1000 + 60,
    );
    this.cur = 0;
  }

  private tick() {
    if (!this.on || this.crossing) return;
    const a = this.els[this.cur];
    // lagu habis tanpa sempat menyilang (mis. tab di latar): mulai lagi dari titik ulang
    if (a.ended) {
      a.currentTime = this.o.loopStart;
      a.play().catch(() => {});
      return;
    }
    if (a.currentTime < this.o.loopEnd) return;
    // silang ke elemen lain yang mulai dari setelah bagian awal
    this.crossing = true;
    const n = 1 - this.cur;
    const b = this.els[n];
    this.prepare(b);
    b.currentTime = this.o.loopStart;
    b.play().catch(() => {});
    this.ramp(b, this.o.volume, this.o.fade);
    this.ramp(a, 0, this.o.fade);
    setTimeout(() => {
      a.pause();
      this.cur = n;
      this.crossing = false;
    }, this.o.fade * 1000 + 100);
  }
}
