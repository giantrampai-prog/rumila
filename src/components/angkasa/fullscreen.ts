"use client";

// Layar penuh untuk Jelajah Angkasa (Fullscreen API pada akar modul, seperti Jelajah Tubuh).
// Bila browser menolak (iframe, iOS Safari), modul tetap memenuhi jendela lewat mode imersif CSS.
// Tur terbang dibuka langsung layar penuh karena dipicu klik pengguna (syarat browser).

import { unlockAudio } from "@/lib/audio-unlock";
import { useEffect, useState } from "react";
import { useAngkasa } from "@/lib/angkasa/state";
import { stopVoice } from "@/lib/angkasa/voice";

let root: HTMLElement | null = null;
let pseudo = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const setFullRoot = (el: HTMLElement | null) => {
  root = el;
};

const isReal = () => !!root && document.fullscreenElement === root;
export const isFull = () => isReal() || pseudo;

export async function enterFull() {
  if (isFull()) return;
  try {
    if (!root?.requestFullscreen) throw new Error("unsupported");
    // Beberapa webview tidak pernah menyelesaikan permintaan: anggap gagal setelah 800 ms.
    await Promise.race([
      root.requestFullscreen(),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 800)),
    ]);
  } catch {
    if (isReal()) return;
    pseudo = true;
    emit();
  }
}

export async function exitFull() {
  if (pseudo) {
    pseudo = false;
    emit();
  }
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {
    /* abaikan */
  }
}

export const toggleFull = () => (isFull() ? exitFull() : enterFull());

export function useIsFull() {
  const [full, setFull] = useState(false);
  useEffect(() => {
    const on = () => setFull(isFull());
    on();
    listeners.add(on);
    document.addEventListener("fullscreenchange", on);
    return () => {
      listeners.delete(on);
      document.removeEventListener("fullscreenchange", on);
    };
  }, []);
  return full;
}

/** Mulai tur terbang dalam layar penuh. */
export function beginTour(from = 0) {
  unlockAudio(); // dipanggil dari ketukan tombol: buka kunci audio iPad/iPhone
  stopVoice();
  useAngkasa.getState().startTour(from);
  void enterFull();
}

/** Keluar tur: kembali ke tampilan sebelumnya dan tutup layar penuh. */
export function endTour() {
  useAngkasa.getState().back();
  void exitFull();
}
