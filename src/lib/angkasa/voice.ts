"use client";

// Suara edukasi rekaman per objek (diputar otomatis saat objek dibuka, bisa dimatikan per profil).
// Sumber utama: potongan narasi Tur terbang — tiap persinggahan (planet) punya titik mulai sendiri,
// jadi saat objek diketuk yang diputar hanya bagian narasi objek itu. Rekaman khusus (VOICE) dipakai
// bila objek tidak punya persinggahan di tur.

import { useEffect, useState } from "react";
import { TOUR } from "./tour";
import { TOUR_AUDIO } from "./tourVoice";
import { sharedAudio } from "@/lib/audio-unlock";

/** id objek → berkas audio khusus di /public/angkasa/voice (cadangan bila tidak ada di narasi tur) */
export const VOICE: Record<string, string> = {
  sun: "/angkasa/voice/sun.m4a",
};

interface Clip {
  src: string;
  start: number;
  /** detik berhenti (null = sampai habis) */
  end: number | null;
}

/** Potongan narasi tur untuk objek `id` (persinggahan dengan id yang sama). */
function tourClip(id: string): Clip | null {
  const i = TOUR.findIndex((s) => s.id === id);
  if (i < 0) return null;
  const part = TOUR_AUDIO.find((p) => i >= p.first && i < p.first + p.cues.length);
  if (!part) return null;
  const k = i - part.first;
  return { src: part.src, start: part.cues[k], end: part.cues[k + 1] ?? null };
}

function clipFor(id: string): Clip | null {
  return tourClip(id) ?? (VOICE[id] ? { src: VOICE[id], start: 0, end: null } : null);
}

let audio: HTMLAudioElement | null = null;
let current: string | null = null;
let clip: Clip | null = null;
/** sedang berpindah/memulai potongan: abaikan event pause lama */
let starting = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const hasVoice = (id: string | null | undefined) => !!id && !!clipFor(id);

function getAudio() {
  if (!audio) {
    audio = sharedAudio("voice"); // elemen bersama yang sudah dibuka kuncinya (iPad/iPhone)
    audio.onended = audio.onpause = () => {
      if (starting) return;
      current = null;
      emit();
    };
    // Berhenti tepat di akhir potongan (awal persinggahan berikutnya).
    audio.ontimeupdate = () => {
      if (audio && clip?.end != null && audio.currentTime >= clip.end - 0.05) audio.pause();
    };
  }
  return audio;
}

/** Tunggu metadata audio siap agar bisa dilompatkan ke titik mulai. */
function ready(a: HTMLAudioElement) {
  if (a.readyState >= 1) return Promise.resolve();
  return new Promise<void>((res, rej) => {
    const ok = () => {
      a.removeEventListener("loadedmetadata", ok);
      a.removeEventListener("error", bad);
      res();
    };
    const bad = () => {
      a.removeEventListener("loadedmetadata", ok);
      a.removeEventListener("error", bad);
      rej(new Error("audio gagal dimuat"));
    };
    a.addEventListener("loadedmetadata", ok);
    a.addEventListener("error", bad);
  });
}

/** Putar rekaman objek; mengembalikan false bila diblokir browser (belum ada interaksi) atau gagal. */
export async function playVoice(id: string) {
  const c = clipFor(id);
  if (!c) return false;
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  const a = getAudio();
  starting = true;
  if (!a.paused) a.pause();
  const abs = new URL(c.src, location.href).href;
  if (a.src !== abs) a.src = c.src;
  clip = c;
  current = id;
  emit();
  try {
    await ready(a);
    if (current !== id) return false; // sudah pindah objek selagi memuat
    a.currentTime = c.start;
    await a.play();
    return true;
  } catch {
    if (current === id) current = null;
    emit();
    return false;
  } finally {
    starting = false;
  }
}

export function stopVoice() {
  if (audio && !audio.paused) audio.pause();
  clip = null;
  current = null;
  emit();
}

/** id objek yang rekamannya sedang diputar (null bila tidak ada) */
export function usePlayingVoice() {
  const [id, setId] = useState<string | null>(current);
  useEffect(() => {
    const on = () => setId(current);
    listeners.add(on);
    return () => {
      listeners.delete(on);
    };
  }, []);
  return id;
}
