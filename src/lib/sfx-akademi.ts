// Palet efek suara Academy: lembut, musikal, dan tidak pernah persis sama dua kali.
// Disintesis dengan Web Audio (tanpa berkas): marimba (sinus + nada atas ×4 yang cepat padam) dan glockenspiel
// (nada atas tak harmonis 1 · 2,76 · 5,4), lewat gema ruang kecil (impuls derau yang meluruh) supaya empuk.
// Semua nada diambil dari tangga pentatonik, jadi selalu enak didengar bersama backsound.
// Ikut saklar efek suara yang sudah ada (sfxEnabled) dan tidak menyentuh narasi.

import { audioContext } from "./segment-player";
import { sfxEnabled } from "./sfx";

const PENTA = [0, 2, 4, 7, 9]; // do re mi sol la
const AKAR = [72, 74, 77, 79]; // C5, D5, F5, G5 (MIDI) — akar acak per bunyi
const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const acak = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];
/** derajat pentatonik ke-n (boleh lebih dari 5 → oktaf berikutnya) di atas akar */
const derajat = (akar: number, n: number) => akar + PENTA[((n % 5) + 5) % 5] + 12 * Math.floor(n / 5);

let keluar: GainNode | null = null;
let gema: ConvolverNode | null = null;

function rantai() {
  const c = audioContext();
  if (!c || !sfxEnabled()) return null;
  if (c.state !== "running") void c.resume();
  if (!keluar) {
    keluar = c.createGain();
    keluar.gain.value = 0.5;
    keluar.connect(c.destination);
    // gema ruang kecil: impuls derau stereo yang meluruh ±1 detik
    const pj = Math.floor(c.sampleRate * 1.1);
    const ir = c.createBuffer(2, pj, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < pj; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / pj) ** 3;
    }
    gema = c.createConvolver();
    gema.buffer = ir;
    const basah = c.createGain();
    basah.gain.value = 0.22;
    gema.connect(basah).connect(keluar);
  }
  return c;
}

/** satu osilator sinus dengan selubung serang–luruh, ke keluaran kering + kirim gema */
function nada(c: AudioContext, f: number, t: number, vol: number, luruh: number, tipe: OscillatorType = "sine") {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = tipe;
  o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + luruh);
  o.connect(g);
  g.connect(keluar!);
  if (gema) g.connect(gema);
  o.start(t);
  o.stop(t + luruh + 0.05);
}

function marimba(c: AudioContext, midi: number, at: number, vol = 0.22) {
  const t = c.currentTime + at;
  const f = hz(midi) * (1 + (Math.random() - 0.5) * 0.004); // sedikit hidup, tidak robotik
  nada(c, f, t, vol, 0.55);
  nada(c, f * 4, t, vol * 0.25, 0.12);
  nada(c, f * 10, t, vol * 0.05, 0.03);
}

function glock(c: AudioContext, midi: number, at: number, vol = 0.1) {
  const t = c.currentTime + at;
  const f = hz(midi);
  nada(c, f, t, vol, 1.2);
  nada(c, f * 2.76, t, vol * 0.4, 0.6);
  nada(c, f * 5.4, t, vol * 0.18, 0.3);
}

/** desis tersaring singkat (tepuk tangan, ketukan kayu) */
function desis(c: AudioContext, at: number, dur: number, frek: number, vol: number, q = 1) {
  const t = c.currentTime + at;
  const n = Math.floor(c.sampleRate * dur);
  const b = c.createBuffer(1, n, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2;
  const s = c.createBufferSource();
  s.buffer = b;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = frek;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(f).connect(g).connect(keluar!);
  s.start(t);
}

/** pola melodi jawaban benar (derajat pentatonik); dipilih acak, akar acak */
const MOTIF_BENAR: number[][] = [
  [0, 2, 4],
  [0, 3, 5],
  [2, 4, 5],
  [0, 1, 2, 5],
  [3, 2, 3, 5],
  [0, 4, 3, 5],
  [1, 3, 5],
  [0, 2, 3, 4],
];
let motifTerakhir = -1;

export const sfxAkademi = {
  /** jawaban benar; `beruntun` = jumlah benar berturut-turut (makin panjang makin meriah) */
  benar(beruntun = 1) {
    const c = rantai();
    if (!c) return;
    let i = Math.floor(Math.random() * MOTIF_BENAR.length);
    if (i === motifTerakhir) i = (i + 1) % MOTIF_BENAR.length;
    motifTerakhir = i;
    const akar = acak(AKAR) - 12;
    const motif = MOTIF_BENAR[i];
    const jeda = 0.085 + Math.random() * 0.02;
    motif.forEach((n, k) => marimba(c, derajat(akar, n), k * jeda, 0.2));
    const akhir = motif.length * jeda;
    glock(c, derajat(akar, motif.at(-1)! + 5), akhir, 0.08);
    if (beruntun >= 3) {
      // beruntun: kilau naik tambahan
      [5, 7, 9, 10].forEach((n, k) => glock(c, derajat(akar, n), akhir + 0.08 + k * 0.06, 0.05));
    }
    if (beruntun >= 5) [0, 0.11, 0.2].forEach((d) => desis(c, akhir + 0.1 + d, 0.05, 2600, 0.12, 0.8));
  },

  /** jawaban belum tepat: dua nada lembut turun, bukan bunyi "salah" yang keras */
  salah() {
    const c = rantai();
    if (!c) return;
    const akar = acak([60, 62, 65]);
    const pola = acak([[4, 2], [3, 1], [2, 0], [4, 3, 1]]);
    pola.forEach((n, k) => marimba(c, derajat(akar, n), k * 0.13, 0.14));
  },

  /** aksi ditolak (kartu ke tempat yang sudah terisi, rak penuh): "bonk" kayu kecil */
  tolak() {
    const c = rantai();
    if (!c) return;
    marimba(c, acak([52, 55]), 0, 0.12);
    desis(c, 0, 0.04, 900, 0.08, 2);
  },

  /** mengambil kartu/benda: ketukan kayu, nada acak */
  ambil() {
    const c = rantai();
    if (!c) return;
    marimba(c, derajat(acak(AKAR), Math.floor(Math.random() * 5)), 0, 0.1);
    desis(c, 0, 0.025, 3000, 0.05, 1.5);
  },

  /** menaruh kartu/benda: "pop" naik dua nada */
  taruh() {
    const c = rantai();
    if (!c) return;
    const akar = acak(AKAR) - 12;
    const n = Math.floor(Math.random() * 3);
    marimba(c, derajat(akar, n), 0, 0.13);
    marimba(c, derajat(akar, n + 2), 0.05, 0.09);
  },

  /** koin/uang masuk */
  koin() {
    const c = rantai();
    if (!c) return;
    const akar = acak(AKAR) + 12;
    glock(c, derajat(akar, 0), 0, 0.07);
    glock(c, derajat(akar, 2), 0.06, 0.06);
  },

  /** layar selesai: fanfare + tepuk tangan; bintang 0–3 */
  selesai(bintang: number) {
    const c = rantai();
    if (!c) return;
    const akar = acak(AKAR) - 12;
    if (bintang < 2) {
      [0, 2, 4].forEach((n, k) => marimba(c, derajat(akar, n), k * 0.12, 0.16));
      return;
    }
    const naik = [0, 2, 3, 4, 5, 7, 8, 10];
    naik.forEach((n, k) => marimba(c, derajat(akar, n), k * 0.07, 0.17));
    const akhir = naik.length * 0.07;
    [10, 12, 14].forEach((n) => glock(c, derajat(akar, n), akhir, 0.07));
    // tepuk tangan: rentetan desis acak 1,2 detik
    const n = bintang >= 3 ? 26 : 16;
    for (let k = 0; k < n; k++) desis(c, akhir + 0.05 + Math.random() * 1.2, 0.03 + Math.random() * 0.03, 1500 + Math.random() * 1800, 0.09, 0.7);
  },

  /** satu bintang muncul di layar selesai (k = urutan 0–2) */
  bintang(k: number) {
    const c = rantai();
    if (!c) return;
    glock(c, derajat(AKAR[0], 5 + k * 2), 0, 0.08);
  },
};

/** Kalimat pujian & penyemangat (teks layar, tidak dibacakan): diacak supaya tidak monoton. */
export const PUJIAN = ["Hebat!", "Pintar!", "Keren!", "Betul sekali!", "Mantap!", "Luar biasa!", "Jempol!", "Kamu bisa!"];
export const PUJIAN_BERUNTUN = ["Beruntun!", "Tidak terhentikan!", "Juara!", "Wah, hebat terus!"];
export const SEMANGAT = ["Hampir!", "Coba lagi, ya", "Tidak apa-apa!", "Pelan-pelan saja", "Ayo, kamu pasti bisa"];
export const acakKata = acak;
