// Efek suara ala game, disintesis langsung dengan Web Audio (tanpa file, tanpa lisensi, ringan):
// ketuk tombol, pop petik buah, wus terbang, koin/ding temuan baru, jingle perayaan, langkah di rumput,
// kilau saat mendekati buah, cipratan & gelembung laut, gemuruh roket, serta suasana kebun (burung, angin).
// Semua lewat satu gain utama agar lembut dan tidak menutupi narasi.

import { audioContext } from './segment-player';

let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
const OFF_KEY = 'rumila-sfx-off';
let muted = (() => {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(OFF_KEY) === '1';
  } catch {
    return false;
  }
})();

/** Efek suara nyala/mati (disimpan di perangkat ini). Narasi tidak terpengaruh. */
export const sfxEnabled = () => !muted;
export function setSfxEnabled(on: boolean) {
  muted = !on;
  try {
    localStorage.setItem(OFF_KEY, on ? '0' : '1');
  } catch {}
  if (!on) stopGardenAmbience();
}
/** waktu bunyi terakhir: tombol yang sudah berbunyi khusus tidak ditambah bunyi 'tap' otomatis */
let lastPlay = 0;

function out() {
  const c = audioContext();
  if (!c) return null;
  lastPlay = performance.now();
  if (c.state !== 'running') void c.resume();
  if (!master) {
    master = c.createGain();
    master.gain.value = 0.55;
    master.connect(c.destination);
  }
  return c;
}

function noise(c: AudioContext) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource();
  s.buffer = noiseBuf;
  return s;
}

/** Nada pendek dengan selubung volume (attack–decay) dan glide frekuensi opsional. */
function tone(freq: number, dur: number, opts: { type?: OscillatorType; vol?: number; to?: number; at?: number; attack?: number } = {}) {
  const c = out();
  if (!c || muted) return;
  const t = c.currentTime + (opts.at ?? 0);
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = opts.type ?? 'sine';
  o.frequency.setValueAtTime(freq, t);
  if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
  const v = opts.vol ?? 0.3;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + (opts.attack ?? 0.008));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master!);
  o.start(t);
  o.stop(t + dur + 0.02);
}

/** Desis tersaring (langkah, wus, cipratan, angin). */
function hiss(dur: number, opts: { freq?: number; to?: number; q?: number; vol?: number; at?: number; type?: BiquadFilterType } = {}) {
  const c = out();
  if (!c || muted) return;
  const t = c.currentTime + (opts.at ?? 0);
  const s = noise(c);
  const f = c.createBiquadFilter();
  f.type = opts.type ?? 'bandpass';
  f.frequency.setValueAtTime(opts.freq ?? 1200, t);
  if (opts.to) f.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
  f.Q.value = opts.q ?? 1;
  const g = c.createGain();
  const v = opts.vol ?? 0.2;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.03, dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(master!);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.02);
}

export const sfx = {
  setMuted(m: boolean) {
    setSfxEnabled(!m);
  },
  /** ketuk tombol: "pop" kecil yang empuk */
  tap() {
    tone(620, 0.09, { type: 'triangle', to: 880, vol: 0.18 });
  },
  /** buka kartu / panel */
  open() {
    tone(520, 0.12, { type: 'sine', to: 780, vol: 0.18 });
    tone(780, 0.14, { type: 'sine', to: 1040, vol: 0.12, at: 0.06 });
  },
  close() {
    tone(700, 0.1, { type: 'sine', to: 440, vol: 0.14 });
  },
  /** petik buah: "plop" + gemerisik daun */
  pick() {
    tone(260, 0.14, { type: 'sine', to: 620, vol: 0.35, attack: 0.004 });
    hiss(0.18, { freq: 2500, q: 0.8, vol: 0.08 });
  },
  /** membelah buah: "cres!" */
  chop() {
    hiss(0.12, { freq: 3200, q: 0.9, vol: 0.28 });
    tone(180, 0.12, { type: 'triangle', to: 90, vol: 0.3, attack: 0.003 });
  },
  /** menyiram tanaman */
  water() {
    hiss(1.1, { freq: 2200, to: 1400, q: 0.5, vol: 0.12 });
    for (let i = 0; i < 5; i++) tone(900 + Math.random() * 700, 0.05, { vol: 0.04, at: 0.15 + i * 0.16 });
  },
  /** menanam biji */
  plant() {
    hiss(0.18, { freq: 700, q: 0.6, vol: 0.15, type: 'lowpass' });
    tone(420, 0.12, { vol: 0.14, to: 560, at: 0.08 });
  },
  /** tanaman naik tahap */
  grow() {
    [392, 523, 659].forEach((f, i) => tone(f, 0.16, { vol: 0.08, type: 'triangle', at: i * 0.07 }));
  },
  /** buah terbang ke keranjang */
  whoosh() {
    hiss(0.45, { freq: 500, to: 2600, q: 1.5, vol: 0.12 });
  },
  /** buah masuk keranjang: koin berdenting */
  coin(at = 0) {
    tone(988, 0.09, { type: 'square', vol: 0.08, at });
    tone(1319, 0.28, { type: 'square', vol: 0.08, at: at + 0.08 });
  },
  /** jingle "buah baru ditemukan" (arpeggio naik) */
  celebrate(at = 0) {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: 'triangle', vol: 0.16, at: at + i * 0.09 }));
    tone(1568, 0.45, { type: 'sine', vol: 0.1, at: at + 0.36 });
  },
  /** kilau lembut saat mendekati tanaman berbuah */
  sparkle() {
    [1760, 2349, 2794].forEach((f, i) => tone(f, 0.16, { vol: 0.05, at: i * 0.06 }));
  },
  /** langkah di rumput */
  step() {
    hiss(0.07, { freq: 1800 + Math.random() * 900, q: 0.7, vol: 0.05 });
  },
  /** tiba di tanaman saat tur */
  arrive() {
    tone(660, 0.18, { vol: 0.08 });
    tone(990, 0.22, { vol: 0.06, at: 0.08 });
  },
  /** cebur ke laut */
  splash() {
    hiss(0.9, { freq: 900, to: 300, q: 0.6, vol: 0.35, type: 'lowpass' });
    hiss(0.35, { freq: 3000, q: 0.8, vol: 0.12 });
  },
  /** gelembung naik */
  bubble() {
    const f = 380 + Math.random() * 500;
    tone(f, 0.08, { vol: 0.07, to: f * 1.9 });
  },
  /** tetes air di gua: "plink" bergema */
  drip() {
    const f = 1300 + Math.random() * 900;
    tone(f, 0.14, { vol: 0.07, to: f * 0.55, attack: 0.002 });
    tone(f * 0.55, 0.3, { vol: 0.025, at: 0.12 });
  },
  /** sikat menggosok tanah (game Gali Fosil) */
  brush() {
    hiss(0.12, { freq: 2600 + Math.random() * 1400, q: 0.6, vol: 0.06 });
  },
  /** ketukan batu / salah pilih yang lembut */
  thud() {
    tone(160, 0.16, { type: 'triangle', to: 110, vol: 0.22, attack: 0.003 });
  },
  /** kristal berdenting */
  clink() {
    [2093, 2637].forEach((f, i) => tone(f, 0.35, { vol: 0.05, at: i * 0.05 }));
  },
  /** bip hitung mundur (angka terakhir lebih tinggi) */
  beep(high = false) {
    tone(high ? 1320 : 880, 0.16, { type: 'square', vol: 0.07 });
  },
  /** roket lepas landas: deru naik + gemuruh */
  liftoff() {
    hiss(2.2, { freq: 200, to: 1400, q: 0.6, vol: 0.3, type: 'lowpass' });
    hiss(1.4, { freq: 90, q: 0.5, vol: 0.35, type: 'lowpass', at: 0.1 });
    tone(70, 1.6, { type: 'sawtooth', vol: 0.08, to: 140 });
  },
  /** logam terkunci: pisah tahap / merapat */
  clunk() {
    tone(140, 0.2, { type: 'square', vol: 0.12, to: 70, attack: 0.002 });
    hiss(0.15, { freq: 2400, q: 1.2, vol: 0.12, at: 0.02 });
    tone(620, 0.25, { vol: 0.05, at: 0.12 });
  },
  /** sonar kapal selam */
  ping() {
    tone(1480, 1.2, { vol: 0.08, to: 1380, attack: 0.003 });
  },
  /** pindah tempat jauh (layar meredup / terbang ke planet) */
  warp() {
    hiss(0.8, { freq: 300, to: 3200, q: 2, vol: 0.12 });
    tone(220, 0.7, { vol: 0.06, to: 880 });
  },
  /** memilih objek untuk dilihat dari dekat (organ, biota, karakter) */
  scan() {
    [660, 990, 1320].forEach((f, i) => tone(f, 0.12, { type: 'triangle', vol: 0.07, at: i * 0.05 }));
  },
  /** kambing mengembik "mbeee…" (getaran suara khas kambing); vol 0–1 mengikuti jarak */
  goat(vol = 1) {
    const c = out();
    if (!c || muted || vol <= 0.02) return;
    const t = c.currentTime;
    const dur = 0.75 + Math.random() * 0.35;
    const f0 = 330 + Math.random() * 90;
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f0 * 0.9, t);
    o.frequency.linearRampToValueAtTime(f0, t + 0.08);
    o.frequency.linearRampToValueAtTime(f0 * 0.86, t + dur);
    // getaran "e-e-e-e" (modulasi amplitudo ±20 Hz)
    const trem = c.createGain();
    trem.gain.value = 0.55;
    const lfo = c.createOscillator();
    lfo.frequency.value = 18 + Math.random() * 6;
    const lg = c.createGain();
    lg.gain.value = 0.45;
    lfo.connect(lg).connect(trem.gain);
    // dua formant vokal "e"
    const f1 = c.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.value = 650;
    f1.Q.value = 3;
    const f2 = c.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.value = 1900;
    f2.Q.value = 5;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5 * vol, t + 0.05);
    g.gain.setValueAtTime(0.5 * vol, t + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(trem);
    trem.connect(f1).connect(g);
    trem.connect(f2).connect(g);
    g.connect(master!);
    o.start(t);
    lfo.start(t);
    o.stop(t + dur + 0.05);
    lfo.stop(t + dur + 0.05);
    // hembusan "mb" di awal
    hiss(0.08, { freq: 500, q: 1, vol: 0.05 * vol, type: 'lowpass' });
  },
  /** ayam berkotek "petok-petok-petooook" */
  cluck(vol = 1) {
    if (vol <= 0.02) return;
    const n = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const f = 520 + Math.random() * 120;
      tone(f, 0.07, { type: 'triangle', vol: 0.16 * vol, to: f * 0.7, at: i * 0.16, attack: 0.004 });
      hiss(0.05, { freq: 1500, q: 2, vol: 0.04 * vol, at: i * 0.16 });
    }
    const e = n * 0.16 + 0.05;
    tone(600, 0.32, { type: 'triangle', vol: 0.15 * vol, to: 900, at: e });
    tone(880, 0.2, { type: 'triangle', vol: 0.1 * vol, to: 520, at: e + 0.3 });
  },
  /** kicau burung: trill cepat & siulan meluncur */
  birdSong(vol = 1) {
    if (vol <= 0.02) return;
    const base = 2600 + Math.random() * 1400;
    const kind = Math.random();
    if (kind < 0.4) {
      for (let i = 0; i < 8; i++) tone(base * (i % 2 ? 1.18 : 1), 0.05, { vol: 0.04 * vol, at: i * 0.06 });
    } else if (kind < 0.75) {
      tone(base, 0.35, { vol: 0.045 * vol, to: base * 1.6 });
      tone(base * 1.5, 0.3, { vol: 0.04 * vol, to: base * 0.9, at: 0.4 });
    } else {
      for (let i = 0; i < 3; i++) tone(base * (1 + i * 0.12), 0.12, { vol: 0.04 * vol, to: base * (1.3 + i * 0.1), at: i * 0.18 });
    }
  },
  /** gerit engsel pintu kayu */
  creak() {
    tone(180, 0.45, { type: 'sawtooth', vol: 0.05, to: 260 });
    hiss(0.4, { freq: 900, q: 6, vol: 0.05 });
  },
  /** gemuruh mesin roket (panggil berkali-kali selama menyala) */
  rumble(strength = 1) {
    hiss(0.6, { freq: 120, q: 0.5, vol: 0.28 * strength, type: 'lowpass' });
  },
};

/* ---------------- suasana kebun: kicau burung & angin ---------------- */

let ambientTimer = 0;
let windNode: { stop: () => void } | null = null;

function chirp() {
  const base = 2200 + Math.random() * 1600;
  const n = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) tone(base * (1 + Math.random() * 0.1), 0.07, { vol: 0.035, to: base * 1.35, at: i * 0.11 });
}

export function startGardenAmbience() {
  if (muted) return;
  const c = out();
  if (!c || ambientTimer) return;
  // angin: desis sangat pelan yang naik-turun
  const s = noise(c);
  s.loop = true;
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 500;
  const g = c.createGain();
  g.gain.value = 0.018;
  const lfo = c.createOscillator();
  const lg = c.createGain();
  lfo.frequency.value = 0.12;
  lg.gain.value = 0.012;
  lfo.connect(lg).connect(g.gain);
  s.connect(f).connect(g).connect(master!);
  s.start();
  lfo.start();
  windNode = {
    stop: () => {
      try {
        s.stop();
        lfo.stop();
      } catch {}
      g.disconnect();
    },
  };
  const loop = () => {
    if (!muted && Math.random() < 0.7) chirp();
    ambientTimer = window.setTimeout(loop, 2500 + Math.random() * 5000);
  };
  ambientTimer = window.setTimeout(loop, 1500);
}

export function stopGardenAmbience() {
  window.clearTimeout(ambientTimer);
  ambientTimer = 0;
  windNode?.stop();
  windNode = null;
}

/* ---------------- bunyi otomatis untuk semua tombol ---------------- */

let uiInstalled = false;

/**
 * Pasang sekali di kerangka aplikasi: setiap ketukan tombol/tautan/kartu berbunyi "tap" lembut — termasuk di
 * modul yang dibuat nanti. Tombol yang sudah memutar bunyi khususnya sendiri (mis. panen, buka kartu) tidak
 * ditambah bunyi. Tandai elemen dengan data-sfx="off" bila memang harus sunyi.
 */
export function installUiSounds() {
  if (uiInstalled || typeof document === 'undefined') return;
  uiInstalled = true;
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest?.('button, a[href], [role="button"], [role="tab"], [data-sfx]') as HTMLElement | null;
      if (!el || el.closest('[data-sfx="off"]') || (el as HTMLButtonElement).disabled) return;
      const before = performance.now();
      // tunggu penangan klik elemen itu selesai; bila ia sudah berbunyi sendiri, lewati
      setTimeout(() => {
        if (lastPlay >= before - 5) return;
        sfx.tap();
      }, 0);
    },
    true,
  );
}
