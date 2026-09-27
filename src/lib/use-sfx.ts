'use client';

import { useEffect, useRef } from 'react';

/** Putar efek suara setiap kali `value` berubah (tidak berbunyi saat pertama kali tampil). */
export function useSfxOnChange<T>(value: T, play: (v: T, prev: T) => void) {
  const prev = useRef(value);
  const cb = useRef(play);
  cb.current = play;
  useEffect(() => {
    if (Object.is(prev.current, value)) return;
    const p = prev.current;
    prev.current = value;
    cb.current(value, p);
  }, [value]);
}
