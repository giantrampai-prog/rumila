import { lineDuration, type LautStop } from './misi';

export interface NarrationTrack { src: string; cues: number[] }
export type NarrationSource = 'rekaman' | 'perangkat' | 'teks';

/** Invalid cues or another script version must never silently play against this storyboard. */
export function validTrack(value: unknown, lines: number): value is NarrationTrack {
  if (!value || typeof value !== 'object') return false;
  const t = value as NarrationTrack;
  return typeof t.src === 'string' && /^\/laut\/voice\/v2\/[a-z0-9/_-]+\.(mp3|m4a|wav|ogg)$/.test(t.src)
    && Array.isArray(t.cues) && t.cues.length === lines && t.cues[0] === 0
    && t.cues.every((n, i) => Number.isFinite(n) && n >= 0 && (i === 0 || n > t.cues[i - 1]));
}

export function lineAtTime(cues: number[], seconds: number) {
  let i = 0;
  while (i + 1 < cues.length && seconds >= cues[i + 1]) i++;
  return i;
}

/** One clock for captions, speech and camera. Missing/blocked audio falls back to readable captions. */
export class SeaNarration {
  private tracks: Record<string, NarrationTrack> = {};
  private stop: LautStop | null = null;
  private audio: HTMLAudioElement | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private active = false;
  private muted = false;
  private token = 0;
  private elapsed = 0;
  private line = 0;
  private lineTime = 0;
  private progress = 0;
  private disposed = false;
  private request = new AbortController();
  source: NarrationSource = 'teks';
  ended = false;

  constructor() {
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
    fetch('/laut/voice/v2/manifest.json', { signal: this.request.signal, cache: 'no-cache' })
      .then(r => r.ok ? r.json() : null)
      .then(m => { if (!this.disposed && m?.version === 2 && m.tracks && typeof m.tracks === 'object') this.tracks = m.tracks; })
      .catch(() => {});
  }
  private cancel() {
    this.token++;
    if (this.utterance && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    this.utterance = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = this.audio.onerror = this.audio.onloadedmetadata = null; this.audio.src = ''; }
    this.audio = null;
  }
  load(stop: LautStop) {
    this.cancel(); this.stop = stop; this.line = 0; this.elapsed = 0; this.lineTime = 0; this.progress = 0; this.ended = false;
    const track = this.tracks[stop.id];
    const voice = 'speechSynthesis' in window && window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('id'));
    this.source = voice ? 'perangkat' : 'teks';
    if (validTrack(track, stop.lines.length)) {
      this.audio = new Audio(track.src); this.audio.preload = 'auto'; this.audio.muted = this.muted;
      this.source = 'rekaman';
      this.audio.onerror = () => this.fallback();
      this.audio.onended = () => { this.ended = true; };
      this.audio.onloadedmetadata = () => { if (this.audio && track.cues.at(-1)! >= this.audio.duration) this.fallback(); };
    }
    if (this.active) this.play();
  }
  private fallback() {
    this.cancel(); this.source = 'teks'; this.lineTime = 0;
  }
  private speak() {
    if (!this.stop || this.muted || !this.active || this.ended || this.source !== 'perangkat') return;
    const token = ++this.token;
    const utterance = new SpeechSynthesisUtterance(this.stop.lines[this.line]);
    this.utterance = utterance;
    utterance.lang = 'id-ID'; utterance.rate = 0.94; utterance.pitch = 1.02;
    utterance.voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('id')) ?? null;
    utterance.onend = () => { if (token === this.token && this.active) this.nextLine(); };
    utterance.onerror = () => { if (token === this.token) this.fallback(); };
    window.speechSynthesis.speak(utterance);
  }
  private nextLine() {
    if (!this.stop) return;
    this.lineTime = 0;
    if (this.line + 1 >= this.stop.lines.length) { this.ended = true; return; }
    this.line++; this.speak();
  }
  play() {
    this.active = true;
    if (this.audio) { const token=this.token; this.audio.play().catch(() => {if(token===this.token)this.fallback();}); }
    else this.speak();
  }
  pause() {
    this.active = false; this.audio?.pause(); this.token++;
    if (this.utterance) { window.speechSynthesis.cancel(); this.utterance = null; this.lineTime = 0; }
  }
  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.audio) this.audio.muted = muted;
    if (this.source === 'perangkat') {
      this.token++; window.speechSynthesis.cancel(); this.utterance = null;
      if (!muted) this.speak();
    }
  }
  tick(dt: number) {
    if (!this.stop) return { progress: 0, line: 0, ended: false, source: this.source };
    if (this.active && !this.ended) {
      this.elapsed += dt;
      if (this.audio) {
        const track = this.tracks[this.stop.id];
        this.line = lineAtTime(track.cues, this.audio.currentTime);
        // A unavailable server must not freeze the entire lesson indefinitely.
        if (this.audio.readyState < 2 && this.elapsed > 8) this.fallback();
      } else {
        this.lineTime += dt;
        const duration = lineDuration(this.stop.lines[this.line]);
        if (this.source === 'teks' || this.muted) {
          if (this.lineTime >= duration) this.nextLine();
        } else if (this.lineTime > duration * 2 + 8) this.fallback();
      }
    }
    const duration = lineDuration(this.stop.lines[this.line]);
    let progress = (this.line + Math.min(0.98, this.lineTime / duration)) / this.stop.lines.length;
    if (this.audio && Number.isFinite(this.audio.duration)) progress = this.audio.currentTime / this.audio.duration;
    // Replaying a paused paragraph must not make the expedition camera travel backwards.
    this.progress = this.ended ? 1 : Math.max(this.progress, Math.min(1, progress));
    return { progress: this.progress, line: this.line, ended: this.ended, source: this.source };
  }
  dispose() { this.disposed = true; this.request.abort(); this.active = false; this.cancel(); }
}
