"use client";

// Pembacaan instruksi Academy.
// 1) Bila teks ada di manifes SUARA (hasil scripts/akademi-suara.ts, ElevenLabs) → putar MP3 lewat satu elemen
//    audio bersama ("akademi", dibuka kuncinya oleh installAudioUnlock pada ketukan pertama di iOS).
// 2) Bila tidak → speechSynthesis peramban. No-op bila tidak tersedia (SSR, WebView lama).

import { sharedAudio } from "@/lib/audio-unlock";
import { SUARA } from "./suara-manifest.generated";

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

/** Apakah teks punya suara pra-rekam (ElevenLabs)? */
export function adaSuara(teks: string): boolean {
  return Object.prototype.hasOwnProperty.call(SUARA, teks.trim());
}

/** Kata bilangan 1–20 (cocok dengan potongan angka di manifes); di luar itu kembalikan angkanya sebagai teks. */
export function angkaKata(n: number): string {
  const K = [
    "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
    "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas", "delapan belas", "sembilan belas", "dua puluh",
  ];
  return K[n - 1] ?? String(n);
}

/** Rekaman manifes semuanya berbahasa Indonesia; hanya dipakai bila lang Indonesia. */
function pakaiRekaman(lang: string) {
  return lang.toLowerCase().split("-")[0] === "id";
}

/** Bacakan teks (membatalkan ucapan sebelumnya). Pakai MP3 bila ada di manifes (hanya lang id-ID), bila tidak speechSynthesis (voice sesuai lang, mis. en-US). */
export function ucapkan(teks: string, lang = "id-ID") {
  const t = teks.trim();
  if (!t) return;
  diamkanAudio();
  diamkanSintesis();
  const src = pakaiRekaman(lang) ? SUARA[t] : undefined;
  if (src && audio()) {
    const token = urutanAktif;
    void putar(src).then((ok) => {
      // berkas gagal dimuat (mis. offline) → jangan bisu, bacakan dengan sintesis
      if (!ok && token === urutanAktif && audio()?.error) ucapkanSintesis(t, lang);
    });
    return;
  }
  ucapkanSintesis(t, lang);
}

/**
 * Bacakan beberapa potongan berurutan, mis. ["Aku mau", "tiga", "jeruk"].
 * Semua potongan harus punya MP3; bila ada yang tidak, seluruhnya digabung jadi satu kalimat lalu dibacakan speechSynthesis.
 */
export function ucapkanBerurutan(potongan: string[], lang = "id-ID") {
  const daftar = potongan.map((p) => p.trim()).filter(Boolean);
  if (!daftar.length) return;
  const gabungan = daftar.join(" ");
  if (!pakaiRekaman(lang) || !audio() || !daftar.every(adaSuara)) {
    ucapkan(gabungan, lang);
    return;
  }
  diamkanAudio();
  diamkanSintesis();
  const token = urutanAktif;
  void (async () => {
    for (let i = 0; i < daftar.length; i++) {
      if (token !== urutanAktif) return;
      const ok = await putar(SUARA[daftar[i]]);
      if (token !== urutanAktif) return;
      if (!ok) {
        // satu potongan gagal → bacakan sisa kalimat dengan sintesis
        if (audio()?.error) ucapkanSintesis(daftar.slice(i).join(" "), lang);
        return;
      }
      if (i < daftar.length - 1) await new Promise((r) => setTimeout(r, JEDA_POTONGAN));
    }
  })();
}

/** Hentikan ucapan yang sedang berjalan (MP3 maupun speechSynthesis). */
export function diamkan() {
  diamkanAudio();
  diamkanSintesis();
}
