"use client";

// Pembacaan instruksi dengan speechSynthesis peramban. No-op bila tidak tersedia (SSR, WebView lama).

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return null;
  return window.speechSynthesis;
}

function pilihVoice(s: SpeechSynthesis, lang: string): SpeechSynthesisVoice | null {
  const voices = s.getVoices();
  if (!voices.length) return null;
  const l = lang.toLowerCase();
  const dasar = l.split("-")[0];
  return (
    voices.find((v) => v.lang.toLowerCase() === l && v.default) ??
    voices.find((v) => v.lang.toLowerCase() === l) ??
    voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(dasar + "-")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(dasar)) ??
    null
  );
}

/** Bacakan teks (membatalkan ucapan sebelumnya). */
export function ucapkan(teks: string, lang = "id-ID") {
  const s = synth();
  if (!s || !teks.trim()) return;
  try {
    s.cancel();
    const u = new SpeechSynthesisUtterance(teks);
    u.lang = lang;
    u.rate = 0.95;
    const v = pilihVoice(s, lang);
    if (v) u.voice = v;
    s.speak(u);
  } catch {}
}

/** Hentikan ucapan yang sedang berjalan. */
export function diamkan() {
  const s = synth();
  if (!s) return;
  try {
    s.cancel();
  } catch {}
}
