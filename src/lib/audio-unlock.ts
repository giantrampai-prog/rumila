"use client";

// Audio di iPad/iPhone (Safari & Chrome iOS = WebKit): elemen <audio> hanya boleh diputar oleh kode bila
// pernah diputar langsung dari ketukan pengguna. Karena itu semua suara memakai elemen BERSAMA yang
// "dibuka kuncinya" pada ketukan pertama (memutar klip hening sangat singkat), lalu boleh diputar kapan saja.

const pool = new Map<string, HTMLAudioElement>();
let silent: string | null = null;
let unlocked = false;
let installed = false;

/** Klip WAV hening 0,05 detik (dibuat sekali, tanpa berkas). */
function silentUrl() {
  if (silent) return silent;
  const rate = 8000,
    n = 400;
  const buf = new ArrayBuffer(44 + n);
  const v = new DataView(buf);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF");
  v.setUint32(4, 36 + n, true);
  w(8, "WAVE");
  w(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  w(36, "data");
  v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  silent = URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
  return silent;
}

/** Elemen audio bersama per kegunaan (mis. "voice", "tour", "roket"). */
export function sharedAudio(key: string) {
  let a = pool.get(key);
  if (!a) {
    a = new Audio();
    a.preload = "auto";
    a.setAttribute("playsinline", "");
    pool.set(key, a);
  }
  return a;
}

const KEYS = ["voice", "tour", "roket", "roket-clip", "tubuh", "fruit"];

/** Buka kunci semua elemen audio bersama. Harus dipanggil di dalam penanganan ketukan pengguna. */
export function unlockAudio() {
  if (unlocked || typeof window === "undefined") return;
  unlocked = true;
  for (const key of KEYS) {
    const a = sharedAudio(key);
    // Elemen yang sudah punya suara (sudah pernah diputar dari ketukan) tidak disentuh,
    // agar tidak memutar ulang suara lama secara tidak sengaja.
    if (!a.paused || a.getAttribute("src")) continue;
    a.src = silentUrl();
    const p = a.play();
    if (p)
      p.then(() => {
        if (a.src === silent) a.pause(); // jangan hentikan suara sungguhan yang baru dimulai
      }).catch(() => {
        unlocked = false; // coba lagi pada ketukan berikutnya
      });
  }
}

/** Pasang pembuka kunci sekali: ketukan pertama di mana pun membuka audio. */
export function installAudioUnlock() {
  if (installed || typeof document === "undefined") return;
  installed = true;
  const h = () => unlockAudio();
  for (const ev of ["touchend", "click", "keydown", "pointerup"]) document.addEventListener(ev, h, { capture: true, passive: true });
}
