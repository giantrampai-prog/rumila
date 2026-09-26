"use client";

// Progres belajar Jelajah Angkasa per anggota: waktu aktif (bukan idle/tab tersembunyi),
// materi selesai, dan latihan selesai → activity_log Rumila (tersinkron Supabase). Tanpa poin/bintang.

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useRumila } from "@/lib/store";

export const TOOL_ID = "angkasa6";
export const PERM = "angkasa" as const;

/** Waktu dihitung hanya saat tab terlihat, fokus, dan ada input dalam 60 detik terakhir. */
export function useAngkasaSession(memberId: string) {
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

/** Tandai materi/pelajaran selesai (sekali per anggota per item). itemId mis. "obj:saturn", "lesson:moon-phases". */
export function markDone(memberId: string, itemId: string) {
  useRumila.getState().completeToolItem(memberId, TOOL_ID, PERM, itemId);
}

/** Tandai latihan selesai (jawaban benar). */
export function markExercise(memberId: string, itemId: string) {
  useRumila.getState().completeToolItem(memberId, TOOL_ID, PERM, itemId, true);
}

/** Daftar item yang sudah selesai oleh anggota ini. */
export function useDoneItems(memberId: string) {
  return useRumila(
    useShallow((s) =>
      s.activity
        .filter(
          (a) =>
            a.memberId === memberId &&
            a.toolId === TOOL_ID &&
            a.event &&
            a.event !== "session" &&
            a.partId,
        )
        .map((a) => a.partId as string),
    ),
  );
}
