// Pemutar potongan rekaman yang tepat sampel (Web Audio API).
// <audio> di HP menelan ±0,1–0,2 dtk pertama setiap kali diputar ulang setelah jeda ("Ini" terdengar "Ni"),
// dan currentTime-nya diperbarui tersendat. Untuk tur yang berhenti-lanjut di setiap adegan, rekaman
// di-decode sekali ke memori lalu tiap adegan diputar sebagai AudioBufferSourceNode(start, offset, durasi).

type Ctx = AudioContext;
let ctx: Ctx | null = null;
const buffers = new Map<string, Promise<AudioBuffer | null>>();

export function audioContext(): Ctx | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      // rekaman TTS 24 kHz: konteks 24 kHz menghemat memori (rekaman 10 menit ≈ 58 MB, bukan 115 MB)
      ctx = new AC({ sampleRate: 24000 });
    } catch {
      ctx = new AC();
    }
  }
  return ctx;
}

/** Panggil dari ketukan pengguna (iPhone/iPad/Chrome mewajibkannya sebelum suara boleh keluar). */
export function unlockAudioContext() {
  const c = audioContext();
  if (!c) return;
  if (c.state !== 'running') void c.resume();
  // bunyi hening 1 sampel "membangunkan" jalur audio di iOS
  const b = c.createBuffer(1, 1, c.sampleRate);
  const s = c.createBufferSource();
  s.buffer = b;
  s.connect(c.destination);
  s.start();
}

export function loadBuffer(src: string): Promise<AudioBuffer | null> {
  let p = buffers.get(src);
  if (!p) {
    const c = audioContext();
    p = !c
      ? Promise.resolve(null)
      : fetch(src)
          .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
          .then((ab) => new Promise<AudioBuffer>((res, rej) => c.decodeAudioData(ab, res, rej)))
          .catch(() => null);
    buffers.set(src, p);
  }
  return p;
}

/** Satu potongan yang sedang diputar; bisa dijeda & dilanjutkan tanpa kehilangan suku kata. */
export class SegmentPlayer {
  private src: AudioBufferSourceNode | null = null;
  private gain: GainNode | null = null;
  private startedAt = 0;
  private offset = 0;
  private end = 0;
  private buf: AudioBuffer | null = null;
  private onEnd: (() => void) | null = null;
  playing = false;

  /** Putar buffer dari `from` sampai `to` (detik). */
  play(buf: AudioBuffer, from: number, to: number, onEnd: () => void) {
    this.stop();
    this.buf = buf;
    this.offset = Math.max(0, from);
    this.end = Math.min(buf.duration, to);
    this.onEnd = onEnd;
    this.resume();
  }

  resume() {
    const c = audioContext();
    if (!c || !this.buf || this.playing || this.offset >= this.end) return;
    if (c.state !== 'running') void c.resume();
    const s = c.createBufferSource();
    s.buffer = this.buf;
    const g = c.createGain();
    // pudar sangat singkat (8 ms) agar tidak ada bunyi "klik" di tepi potongan
    const t0 = c.currentTime + 0.02;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(1, t0 + 0.008);
    const dur = this.end - this.offset;
    g.gain.setValueAtTime(1, t0 + Math.max(0.01, dur - 0.012));
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    s.connect(g).connect(c.destination);
    s.onended = () => {
      // dihentikan manual (jeda/berhenti) → src sudah diganti; selain itu berarti potongan selesai diputar
      if (this.src !== s) return;
      this.src = null;
      this.playing = false;
      this.offset = this.end;
      const cb = this.onEnd;
      this.onEnd = null;
      cb?.();
    };
    s.start(t0, this.offset, dur);
    this.src = s;
    this.gain = g;
    this.startedAt = t0 - this.offset;
    this.playing = true;
  }

  /** Posisi saat ini di dalam rekaman (detik). */
  position() {
    const c = audioContext();
    if (!c || !this.playing) return this.offset;
    return Math.min(this.end, Math.max(this.offset, c.currentTime - this.startedAt));
  }

  pause() {
    if (!this.playing) return;
    this.offset = this.position();
    this.halt();
  }

  stop() {
    this.onEnd = null;
    this.halt();
  }

  private halt() {
    const s = this.src;
    this.src = null;
    this.playing = false;
    try {
      s?.stop();
    } catch {}
    s?.disconnect();
    this.gain?.disconnect();
    this.gain = null;
  }
}
