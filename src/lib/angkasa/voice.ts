"use client";

// Suara edukasi rekaman per objek (diputar otomatis saat objek dibuka, bisa dimatikan per profil).
// Objek tanpa rekaman memakai "Dengarkan" (suara sintesis) seperti sebelumnya.

import { useEffect, useState } from "react";

/** id objek → berkas audio di /public/angkasa/voice */
export const VOICE: Record<string, string> = {
  sun: "/angkasa/voice/sun.m4a",
};

let audio: HTMLAudioElement | null = null;
let current: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const hasVoice = (id: string | null | undefined) => !!id && id in VOICE;

/** Putar rekaman objek; mengembalikan false bila diblokir browser (belum ada interaksi). */
export async function playVoice(id: string) {
  const src = VOICE[id];
  if (!src) return false;
  if (typeof window !== "undefined" && "speechSynthesis" in window)
    window.speechSynthesis.cancel();
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.onended = audio.onpause = () => {
      current = null;
      emit();
    };
  }
  if (current !== id) {
    audio.src = src;
    audio.currentTime = 0;
  }
  current = id;
  emit();
  try {
    await audio.play();
    return true;
  } catch {
    current = null;
    emit();
    return false;
  }
}

export function stopVoice() {
  if (audio && !audio.paused) audio.pause();
  if (audio) audio.currentTime = 0;
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
