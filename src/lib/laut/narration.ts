import { lineDuration, type LautStop } from './misi';
import { sharedAudio } from '../audio-unlock';
import manifest from '../../../public/laut/voice/v2/manifest.json';

export interface NarrationTrack { src: string; cues: number[]; start?: number; end?: number }
export type NarrationSource = 'rekaman' | 'perangkat' | 'teks';
export const SEA_TRACKS: Record<string, NarrationTrack> = manifest.tracks;
export const SEA_RECORDING = manifest.recording;

/** Legacy separate chapters and continuous recordings share chapter-relative paragraph cues. */
export function validTrack(value: unknown, lines: number): value is NarrationTrack {
  if (!value || typeof value !== 'object') return false;
  const t = value as NarrationTrack;
  const segmented = t.start !== undefined || t.end !== undefined;
  return typeof t.src === 'string' && /^\/laut\/voice\/v2\/[a-z0-9/_-]+\.(mp3|m4a|wav|ogg)$/.test(t.src)
    && Array.isArray(t.cues) && t.cues.length === lines && t.cues[0] === 0
    && t.cues.every((n, i) => Number.isFinite(n) && n >= 0 && (i === 0 || n > t.cues[i - 1]))
    && (!segmented || (Number.isFinite(t.start) && Number.isFinite(t.end) && t.start! >= 0
      && t.end! > t.start! && t.cues.at(-1)! < t.end! - t.start!));
}

export function lineAtTime(cues: number[], seconds: number) {
  let i = 0;
  while (i + 1 < cues.length && seconds >= cues[i + 1]) i++;
  return i;
}

/** Audio currentTime is authoritative: buffering and low FPS cannot move the story ahead of speech. */
export class SeaNarration {
  private stop: LautStop | null = null;
  private track: NarrationTrack | null = null;
  private audio: HTMLAudioElement | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private active = false;
  private muted = false;
  private token = 0;
  private stalled = 0;
  private line = 0;
  private lineTime = 0;
  private progress = 0;
  private pendingSeek: number | null = null;
  private time = 0;
  source: NarrationSource = 'teks';
  ended = false;

  constructor(private tracks: Record<string, NarrationTrack> = SEA_TRACKS,
    private makeAudio: () => HTMLAudioElement = () => sharedAudio('laut')) {
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  }
  private cancelSpeech() {
    this.token++;
    if (this.utterance && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    this.utterance = null;
  }
  private releaseAudio() {
    if (this.audio) {
      this.audio.pause(); this.audio.onended = this.audio.onerror = this.audio.onloadedmetadata = null;
      this.audio.removeAttribute('src'); this.audio.load(); this.audio.remove();
    }
    this.audio = null; this.pendingSeek = null;
  }
  load(stop: LautStop, sequential = false) {
    const candidate = this.tracks[stop.id];
    const track = validTrack(candidate, stop.lines.length) ? candidate : null;
    const reuse = !!this.audio && !!track && this.track?.src === track.src;
    const continuous = reuse && sequential && this.audio!.currentTime >= (track!.start ?? 0)
      && this.audio!.currentTime < (track!.end ?? Infinity);
    this.cancelSpeech();
    if (!reuse) this.releaseAudio();
    else if (!continuous) this.audio!.pause();
    this.stop = stop; this.track = track; this.line = 0; this.lineTime = 0; this.progress = 0;
    this.stalled = 0; this.ended = false; this.time = track?.start ?? 0;
    const voice = 'speechSynthesis' in window && window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('id'));
    this.source = voice ? 'perangkat' : 'teks';
    if (track) {
      const audio = this.audio ?? this.makeAudio();
      this.audio = audio; audio.preload = 'auto'; audio.muted = this.muted;
      audio.hidden = true; audio.dataset.seaNarration = 'algenib';
      if (typeof document !== 'undefined' && !audio.isConnected) document.body.appendChild(audio);
      if (!reuse) audio.src = track.src;
      this.source = 'rekaman';
      audio.onerror = () => { if (this.audio === audio) this.fallback(); };
      audio.onended = () => { if (this.audio === audio) this.ended = true; };
      audio.onloadedmetadata = () => {
        if (this.audio !== audio) return;
        const current = this.track!;
        if ((current.start ?? 0) + current.cues.at(-1)! >= audio.duration || (current.end ?? 0) > audio.duration + 0.1) this.fallback();
        else this.applySeek();
      };
      if (!continuous) this.seek(track.start ?? 0);
      else { this.pendingSeek = null; this.time = audio.currentTime; }
    }
    if (this.active) this.play();
  }
  private applySeek() {
    if (!this.audio || this.pendingSeek === null || this.audio.readyState < 1) return;
    try { this.audio.currentTime = this.pendingSeek; this.pendingSeek = null; } catch { /* Retry at loadedmetadata. */ }
  }
  seek(seconds: number) {
    if (!this.track || !Number.isFinite(seconds)) return;
    const start = this.track.start ?? 0, end = this.track.end ?? this.audio?.duration ?? start;
    this.time = Math.max(start, Math.min(end, seconds));
    this.pendingSeek = this.time; this.ended = false; this.progress = 0; this.stalled = 0;
    this.applySeek();
  }
  private fallback() {
    this.cancelSpeech(); this.releaseAudio(); this.source = 'teks'; this.lineTime = 0;
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
    if (this.audio) { const token = this.token; this.audio.play().catch(() => { if (token === this.token) this.fallback(); }); }
    else this.speak();
  }
  pause() {
    this.active = false; this.audio?.pause(); this.cancelSpeech();
  }
  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.audio) this.audio.muted = muted;
    if (this.source === 'perangkat') { this.cancelSpeech(); if (!muted) this.speak(); }
  }
  tick(dt: number) {
    if (!this.stop) return { progress: 0, line: 0, ended: false, source: this.source, time: 0, seconds: 0, duration: 0, loading: false };
    const start = this.track?.start ?? 0;
    // Some AAC decoders expose encoder padding in duration. Let the final word finish on that
    // decoder's media clock rather than cutting the recording at the original PCM frame count.
    const finalRecording = this.track?.src === SEA_RECORDING.src && this.track?.end === SEA_RECORDING.duration;
    const duration = finalRecording && Number.isFinite(this.audio?.duration) ? this.audio!.duration - start
      : this.track?.end !== undefined ? this.track.end - start
      : Number.isFinite(this.audio?.duration) ? this.audio!.duration : this.stop.lines.reduce((n,l)=>n+lineDuration(l),0);
    if (this.audio && this.track) {
      this.applySeek();
      this.time = this.pendingSeek ?? this.audio.currentTime;
      const seconds = Math.max(0, this.time - start);
      this.line = lineAtTime(this.track.cues, seconds);
      this.progress = Math.min(1, seconds / duration);
      this.ended = this.audio.ended || seconds >= duration;
      if (this.active && !this.ended) {
        this.stalled = this.audio.readyState < 2 ? this.stalled + dt : 0;
        if (this.stalled > 15) this.fallback();
      }
    } else {
      if (this.active && !this.ended) {
        this.lineTime += dt;
        const lineSeconds = lineDuration(this.stop.lines[this.line]);
        if (this.source === 'teks' || this.muted) { if (this.lineTime >= lineSeconds) this.nextLine(); }
        else if (this.lineTime > lineSeconds * 2 + 8) this.fallback();
      }
      const p = (this.line + Math.min(0.98, this.lineTime / lineDuration(this.stop.lines[this.line]))) / this.stop.lines.length;
      this.progress = this.ended ? 1 : Math.max(this.progress, Math.min(1, p));
      this.time = start + this.progress * duration;
    }
    return { progress: this.progress, line: this.line, ended: this.ended, source: this.source,
      time: this.time, seconds: Math.max(0,this.time-start), duration,
      loading: !!this.audio && this.active && (this.pendingSeek !== null || this.audio.readyState < 2) };
  }
  dispose() { this.active = false; this.cancelSpeech(); this.releaseAudio(); }
}
