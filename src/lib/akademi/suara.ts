"use client";

// Pembacaan suara Academy.
// Bahasa Indonesia (lang id-*): HANYA rekaman manusia (MP3 suara Aoede) dari manifes SUARA (hasil scripts/akademi-suara.ts),
//   diputar lewat satu elemen audio bersama ("akademi", dibuka kuncinya oleh installAudioUnlock pada ketukan pertama di iOS).
//   Tidak pernah jatuh ke speechSynthesis: teks tanpa rekaman → diam (di dev: console.warn "[suara hilang]" dan dicatat di
//   window.__suaraHilang); berkas gagal dimuat (offline) → diam juga.
//   Kalimat dari kode dibangun lewat src/lib/akademi/kalimat-suara.ts supaya teksnya sama persis dengan yang direkam.
// Bahasa lain (en-US): speechSynthesis peramban. No-op bila tidak tersedia (SSR, WebView lama).

import { sharedAudio } from "@/lib/audio-unlock";
import { angkaKata } from "./kalimat-suara";
import { SUARA } from "./suara-manifest.generated";

export { angkaKata };

const KUNCI_AUDIO = "akademi";
/** Jeda antar potongan saat memutar berurutan (ms). */
const JEDA_POTONGAN = 120;

/* ---------------- speechSynthesis ---------------- */

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

function ucapkanSintesis(teks: string, lang: string) {
  const s = synth();
  if (!s) return;
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

function diamkanSintesis() {
  const s = synth();
  if (!s) return;
  try {
    s.cancel();
  } catch {}
}

/* ---------------- audio pra-rekam ---------------- */

/** Satu elemen audio bersama untuk semua suara Academy (hanya satu yang berbunyi pada satu waktu). */
function audio(): HTMLAudioElement | null {
  if (typeof window === "undefined" || typeof Audio === "undefined") return null;
  return sharedAudio(KUNCI_AUDIO);
}

/** Token urutan yang sedang diputar; urutan lama berhenti bila token sudah berganti. */
let urutanAktif = 0;
/** Menyelesaikan promise `putar` yang sedang menunggu (dipanggil saat dihentikan). */
let batalkanPutar: (() => void) | null = null;

function diamkanAudio() {
  urutanAktif++;
  batalkanPutar?.();
  const a = audio();
  if (!a) return;
  try {
    a.pause();
    a.currentTime = 0;
  } catch {}
}

/** Putar satu berkas; selesai (resolve true) saat habis, false bila gagal atau dihentikan. */
function putar(src: string): Promise<boolean> {
  const a = audio();
  if (!a) return Promise.resolve(false);
  return new Promise((selesai) => {
    const beres = (ok: boolean) => {
      a.onended = null;
      a.onerror = null;
      if (batalkanPutar === batal) batalkanPutar = null;
      selesai(ok);
    };
    const batal = () => beres(false);
    batalkanPutar = batal;
    try {
      a.onended = () => beres(true);
      a.onerror = () => beres(false);
      if (a.getAttribute("src") !== src) a.src = src;
      a.currentTime = 0;
      const p = a.play();
      if (p) p.catch(() => beres(false));
    } catch {
      beres(false);
    }
  });
}

/* ---------------- API ---------------- */

/** Apakah suara narasi (rekaman atau sintesis) sedang berbunyi? Dipakai backsound untuk mengecil saat VO bicara. */
export function sedangBicara(): boolean {
  const a = typeof window === "undefined" ? null : audio();
  if (a && !a.paused && !a.ended) return true;
  return !!synth()?.speaking;
}


/** Apakah teks punya rekaman suara manusia di manifes? */
export function adaSuara(teks: string): boolean {
  return Object.prototype.hasOwnProperty.call(SUARA, teks.trim());
}

/** Catat teks Indonesia yang belum punya rekaman (hanya di dev). */
function catatHilang(teks: string) {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") return;
  console.warn("[suara hilang]", teks);
  const w = window as Window & { __suaraHilang?: string[] };
  (w.__suaraHilang ??= []).push(teks);
}

/** Rekaman manifes semuanya berbahasa Indonesia; hanya dipakai bila lang Indonesia. */
function pakaiRekaman(lang: string) {
  return lang.toLowerCase().split("-")[0] === "id";
}

/**
 * Bacakan teks (membatalkan ucapan sebelumnya).
 * lang id-*: putar MP3 dari manifes; tanpa rekaman atau gagal dimuat → diam (tidak pernah suara robot).
 * lang lain (mis. en-US): speechSynthesis dengan voice sesuai lang.
 */
export function ucapkan(teks: string, lang = "id-ID") {
  const t = teks.trim();
  if (!t) return;
  diamkanAudio();
  diamkanSintesis();
  if (!pakaiRekaman(lang)) {
    ucapkanSintesis(t, lang);
    return;
  }
  const src = SUARA[t];
  if (!src) {
    catatHilang(t);
    return;
  }
  if (audio()) void putar(src);
}

/**
 * Bacakan beberapa potongan berurutan, mis. ["Aku mau", "tiga", "jeruk"].
 * Bila `utuh` (kalimat lengkapnya) punya rekaman, itu yang diputar. Bila tidak, potongan diputar berurutan asalkan
 * semuanya punya MP3; kalau ada yang belum, kalimat utuh diteruskan ke `ucapkan` (yang diam bila tak ada rekaman).
 * Bahasa selain Indonesia: kalimat utuh dibacakan speechSynthesis.
 */
export function ucapkanBerurutan(potongan: string[], lang = "id-ID", utuh?: string) {
  const daftar = potongan.map((p) => p.trim()).filter(Boolean);
  const kalimat = utuh?.trim() || daftar.join(" ");
  if (!kalimat) return;
  if (!pakaiRekaman(lang) || adaSuara(kalimat) || !daftar.length || !daftar.every(adaSuara) || !audio()) {
    if (pakaiRekaman(lang) && !adaSuara(kalimat)) for (const p of daftar) if (!adaSuara(p)) catatHilang(p);
    ucapkan(kalimat, lang);
    return;
  }
  diamkanAudio();
  diamkanSintesis();
  const token = urutanAktif;
  void (async () => {
    for (let i = 0; i < daftar.length; i++) {
      if (token !== urutanAktif) return;
      const ok = await putar(SUARA[daftar[i]]);
      // potongan gagal dimuat (offline) atau dihentikan → berhenti, diam
      if (!ok || token !== urutanAktif) return;
      if (i < daftar.length - 1) await new Promise((r) => setTimeout(r, JEDA_POTONGAN));
    }
  })();
}

/** Hentikan ucapan yang sedang berjalan (MP3 maupun speechSynthesis). */
export function diamkan() {
  diamkanAudio();
  diamkanSintesis();
}
