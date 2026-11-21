"use client";

// Mode app toko (Play Store / App Store): kebijakan toko melarang pembelian konten digital di luar billing toko
// dan larangan mengarahkan ke sana. Jadi di dalam app, halaman harga/paket/rekening/riwayat bayar disembunyikan;
// pembayaran tetap lewat web (kampus.pulaurinoya.com di browser).
//
// Deteksi: app Android (TWA) membuka halaman pertama dengan referrer `android-app://com.pulaurinoya.academy`.
// Hanya halaman pertama yang membawa referrer itu, jadi tandanya disimpan di sessionStorage (per sesi app; TWA berbagi
// localStorage dengan Chrome, jadi localStorage TIDAK dipakai supaya Chrome biasa tidak ikut tersembunyi).
// `?mode=app` / `?mode=web` untuk uji coba dan build app lain (mis. iOS) di kemudian hari.

import { useEffect, useState } from "react";

const KUNCI = "rinoya-mode-app";
const PAKET_ANDROID = "android-app://com.pulaurinoya.academy";

export function modeApp(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search).get("mode");
    if (q === "web") sessionStorage.removeItem(KUNCI);
    else if (q === "app" || document.referrer.startsWith(PAKET_ANDROID)) sessionStorage.setItem(KUNCI, "1");
    return sessionStorage.getItem(KUNCI) === "1";
  } catch {
    return document.referrer.startsWith(PAKET_ANDROID);
  }
}

/** true bila dibuka dari app toko. Selalu false saat render server / render pertama (hindari beda hidrasi). */
export function useModeApp(): boolean {
  const [app, setApp] = useState(false);
  useEffect(() => setApp(modeApp()), []);
  return app;
}
