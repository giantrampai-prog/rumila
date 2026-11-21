"use client";

// Backsound belajar Academy: satu lagu instrumental per kelompok jenjang, diulang tanpa putus.
//   PAUD–TK B : ceria.m4a   (lagu anak ceria: ukulele, xilofon, tepuk tangan ±100 BPM)
//   SD 1–3    : sd-awal.m4a (upbeat: gitar akustik, piano ±95 BPM)
//   SD 4–6    : fokus.m4a   (lo-fi santai untuk fokus ±80 BPM)
// Berkas dibuat dari lagu Suno: badan lagu dipotong tepat kelipatan birama, ujungnya disilang ke awalnya, lalu diberi
// bantalan BANTAL detik di kedua ujung. Loop diputar dengan AudioBufferSourceNode (loopStart/loopEnd) di bagian dalam,
// jadi sambungannya presisi per sampel dan tidak terkena celah encoder AAC.
// Saat narasi (VO) bicara, volume diredam ke REDAM × volume dasar, lalu naik lagi setelah VO selesai.
// Musik bisa dimatikan per anak (disimpan di profil Academy, ikut sinkron). Tidak dipakai di Ruang Ujian.

import { useCallback, useEffect, useState } from "react";
import { levelIndex, type LevelId } from "@akademi/schema";
import { LEVEL_ANAK_KEY } from "./konten";
import { sedangBicara } from "./suara";

/** bantalan di kedua ujung berkas (detik), lihat komentar di atas */
const BANTAL = 0.5;
/** volume dasar (0–1): jauh di bawah suara narasi */
const VOLUME = 0.22;
/** pengali volume saat narasi bicara */
export const REDAM = 0.25;

export interface LaguLatar {
  src: string;
  /** panjang loop (detik) tanpa bantalan */
  panjang: number;
}

export const LAGU: Record<"ceria" | "sd-awal" | "fokus", LaguLatar> = {
  ceria: { src: "/akademi/musik/ceria.m4a", panjang: 77.10249433106576 },
  "sd-awal": { src: "/akademi/musik/sd-awal.m4a", panjang: 95.98743764172336 },
  fokus: { src: "/akademi/musik/fokus.m4a", panjang: 123.00204081632653 },
};

/** Lagu latar untuk jenjang: PAUD–TK B ceria, SD 1–3 sd-awal, SD 4–6 fokus. */
export function laguUntuk(level: LevelId): LaguLatar {
  const i = levelIndex(level);
  if (i <= levelIndex("TKB")) return LAGU.ceria;
  if (i <= levelIndex("SD3")) return LAGU["sd-awal"];
  return LAGU.fokus;
}

/* ---------------- preferensi per anak (objek profil Academy yang sama) ---------------- */

export function musikNyala(memberId: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = JSON.parse(localStorage.getItem(LEVEL_ANAK_KEY(memberId)) ?? "{}") as { musik?: unknown };
    return v?.musik !== false;
  } catch {
    return true;
  }
}

export function setMusikNyala(memberId: string, nyala: boolean) {
  if (typeof window === "undefined") return;
  try {
    let prev: Record<string, unknown> = {};
    try {
      prev = JSON.parse(localStorage.getItem(LEVEL_ANAK_KEY(memberId)) ?? "{}") ?? {};
    } catch {}
    localStorage.setItem(LEVEL_ANAK_KEY(memberId), JSON.stringify({ ...prev, musik: nyala }));
  } catch {}
}

/* ---------------- pemutar ---------------- */

let ctx: AudioContext | null = null;
const cache = new Map<string, Promise<AudioBuffer>>();

function konteks(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function muat(c: AudioContext, src: string): Promise<AudioBuffer> {
  let p = cache.get(src);
  if (!p) {
    p = fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`backsound ${src}: ${r.status}`);
        return r.arrayBuffer();
      })
      .then((b) => new Promise<AudioBuffer>((ok, gagal) => c.decodeAudioData(b, ok, gagal)));
    p.catch(() => cache.delete(src));
    cache.set(src, p);
  }
  return p;
}

class PemutarLatar {
  private sumber: AudioBufferSourceNode | null = null;
  private gain: GainNode | null = null;
  private faktor = 1;
  private hidup = false;
  constructor(private lagu: LaguLatar) {}

  async mulai() {
    const c = konteks();
    if (!c || this.hidup) return;
    this.hidup = true;
    void c.resume().catch(() => {});
    let buf: AudioBuffer;
    try {
      buf = await muat(c, this.lagu.src);
    } catch (e) {
      console.error("[akademi] backsound gagal dimuat", e);
      this.hidup = false;
      return;
    }
    if (!this.hidup) return;
    const g = c.createGain();
    g.gain.value = 0;
    g.connect(c.destination);
    const s = c.createBufferSource();
    s.buffer = buf;
    s.loop = true;
    s.loopStart = BANTAL;
    s.loopEnd = Math.min(buf.duration, BANTAL + this.lagu.panjang);
    s.connect(g);
    s.start(0, BANTAL);
    this.sumber = s;
    this.gain = g;
    this.ramp(VOLUME * this.faktor, 1.5);
  }

  /** coba lanjutkan konteks audio yang ditahan peramban (panggil dari ketukan) */
  bangunkan() {
    const c = konteks();
    if (c && c.state !== "running") void c.resume().catch(() => {});
  }

  redam(f: number) {
    if (f === this.faktor) return;
    this.faktor = f;
    this.ramp(VOLUME * f, f < 1 ? 0.25 : 0.8);
  }

  berhenti() {
    this.hidup = false;
    const s = this.sumber, g = this.gain, c = konteks();
    this.sumber = null;
    this.gain = null;
    if (!s || !g || !c) return;
    const t = c.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(0, t + 0.6);
    try {
      s.stop(t + 0.65);
    } catch {}
    setTimeout(() => g.disconnect(), 800);
  }

  private ramp(v: number, s: number) {
    const g = this.gain, c = konteks();
    if (!g || !c) return;
    const t = c.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(v, t + s);
  }
}

/**
 * Hook backsound untuk layar belajar. `aktif` false = tidak diputar (mis. ujian, layar selesai).
 * Mengembalikan status nyala & pengalih untuk tombol musik.
 */
export function useBacksound(memberId: string, level: LevelId, aktif: boolean) {
  const [nyala, setNyala] = useState(true);
  useEffect(() => setNyala(musikNyala(memberId)), [memberId]);
  const lagu = laguUntuk(level);

  useEffect(() => {
    if (!aktif || !nyala) return;
    const p = new PemutarLatar(lagu);
    void p.mulai();
    // VO bicara → redam; ketukan pertama → bangunkan konteks yang ditahan kebijakan autoplay
    const tik = setInterval(() => p.redam(sedangBicara() ? REDAM : 1), 150);
    const ketuk = () => p.bangunkan();
    window.addEventListener("pointerdown", ketuk);
    const sembunyi = () => (document.hidden ? p.redam(0) : p.redam(sedangBicara() ? REDAM : 1));
    document.addEventListener("visibilitychange", sembunyi);
    return () => {
      clearInterval(tik);
      window.removeEventListener("pointerdown", ketuk);
      document.removeEventListener("visibilitychange", sembunyi);
      p.berhenti();
    };
  }, [aktif, nyala, lagu]);

  const alih = useCallback(() => {
    setNyala((v) => {
      setMusikNyala(memberId, !v);
      return !v;
    });
  }, [memberId]);

  return { nyala, alih };
}
