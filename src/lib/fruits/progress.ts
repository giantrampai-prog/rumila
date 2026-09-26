"use client";

// Progres belajar Kebun Buah per anggota: waktu aktif (bukan idle/tab tersembunyi),
// materi selesai, dan latihan selesai → activity_log Rumila (tersinkron Supabase). Tanpa poin/bintang.

import { useEffect } from "react";
import { useRumila } from "@/lib/store";

export const TOOL_ID = "edukasi-buah";
export const PERM = "edukasi" as const;

/** Waktu dihitung hanya saat tab terlihat, fokus, dan ada input dalam 60 detik terakhir. */
export function useFruitSession(memberId: string) {
  useEffect(() => {
    const store = useRumila.getState();
    const session = store.beginToolSession(memberId, TOOL_ID, PERM);
    if (!session) return;
    let lastInput = performance.now(),
      lastTick = lastInput,
      pending = 0;
    let visible = document.visibilityState === "visible",
      focused = document.hasFocus();
    const tick = () => {
      const now = performance.now();
      if (visible && focused)
        pending +=
          Math.max(0, Math.min(now, lastInput + 60000) - lastTick) / 1000;
      lastTick = now;
      if (pending >= 5) {
        store.addToolTime(memberId, session, TOOL_ID, pending);
        pending = 0;
      }
    };
    const input = () => {
      tick();
      lastInput = performance.now();
    };
    const visibility = () => {
      tick();
      visible = document.visibilityState === "visible";
      lastTick = performance.now();
    };
    const focus = () => {
      tick();
      focused = true;
      lastInput = performance.now();
    };
    const blur = () => {
      tick();
      focused = false;
    };
    const flush = () => {
      tick();
      if (pending) {
        store.addToolTime(memberId, session, TOOL_ID, pending);
        pending = 0;
      }
    };
    const events = ["pointerdown", "keydown", "wheel"];
    events.forEach((e) => window.addEventListener(e, input, { passive: true }));
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("focus", focus);
    window.addEventListener("blur", blur);
    window.addEventListener("pagehide", flush);
    const timer = setInterval(tick, 1000);
    return () => {
      flush();
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, input));
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("focus", focus);
      window.removeEventListener("blur", blur);
      window.removeEventListener("pagehide", flush);
    };
  }, [memberId]);
}
