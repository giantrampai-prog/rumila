'use client';
import { useEffect, useRef } from 'react';
import { useRumila } from '@/lib/store';
/** Time is accrued only while visible, focused and within 60 seconds of an input. */
export function useAnatomySession(memberId: string) {
  const activeSession = useRef<string | null>(null);
  useEffect(() => {
    const store = useRumila.getState();
    const session = activeSession.current ?? store.beginAnatomySession(memberId);
    activeSession.current = session;
    if (!session) return;
    let lastInput = performance.now(), lastTick = lastInput, pending = 0;
    let visible = document.visibilityState === 'visible', focused = document.hasFocus();
    const tick = () => {
      const now = performance.now();
      if (visible && focused) pending += Math.max(0, Math.min(now, lastInput + 60000) - lastTick) / 1000;
      lastTick = now;
      if (pending >= 5) { store.addAnatomyTime(memberId, session, pending); pending = 0; }
    };
    const input = () => { tick(); lastInput = performance.now(); };
    const visibility = () => { tick(); visible = document.visibilityState === 'visible'; lastTick = performance.now(); };
    const focus = () => { tick(); focused = true; lastInput = performance.now(); };
    const blur = () => { tick(); focused = false; };
    const flush = () => { tick(); if (pending) { store.addAnatomyTime(memberId, session, pending); pending = 0; } };
    const events = ['pointerdown', 'pointermove', 'keydown', 'wheel'];
    events.forEach(e => window.addEventListener(e, input, { passive: true }));
    document.addEventListener('visibilitychange', visibility); window.addEventListener('focus', focus); window.addEventListener('blur', blur); window.addEventListener('pagehide', flush);
    const timer = setInterval(tick, 1000);
    return () => { flush(); clearInterval(timer); events.forEach(e => window.removeEventListener(e, input)); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('focus', focus); window.removeEventListener('blur', blur); window.removeEventListener('pagehide', flush); };
  }, [memberId]);
}
