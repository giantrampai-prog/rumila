"use client";

// Aplikasi web (PWA): daftar service worker, tawaran "Pasang aplikasi" (Android: prompt bawaan Chrome;
// iOS: panduan Bagikan → Tambah ke Layar Utama), dan tarik-untuk-memuat-ulang saat dibuka dari layar utama
// (mode aplikasi di Android & iOS tidak punya pull-to-refresh bawaan).

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { Icon } from "@/components/ui";

const BALOO = "var(--ff-baloo), system-ui, sans-serif";
const INK = "#2b1d4e";

interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaState {
  prompt: InstallPrompt | null;
  standalone: boolean;
  ios: boolean;
  iosHelp: boolean;
}

export const usePwa = create<PwaState>(() => ({ prompt: null, standalone: false, ios: false, iosHelp: false }));

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);

/** Bisa ditawari pemasangan (belum terpasang, dan Android punya prompt / perangkat iOS). */
export function useCanInstall() {
  const { prompt, standalone, ios } = usePwa();
  return !standalone && (!!prompt || ios);
}

export async function installApp() {
  const { prompt, ios } = usePwa.getState();
  if (prompt) {
    await prompt.prompt();
    const { outcome } = await prompt.userChoice.catch(() => ({ outcome: "dismissed" as const }));
    usePwa.setState({ prompt: null, standalone: outcome === "accepted" || isStandalone() });
  } else if (ios) usePwa.setState({ iosHelp: true });
}

/** Dipasang sekali di root layout. */
export function PwaSetup() {
  const iosHelp = usePwa((s) => s.iosHelp);
  useEffect(() => {
    const ua = navigator.userAgent;
    // iPadOS 13+ mengaku "Macintosh"; bedakan lewat layar sentuh.
    const ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    usePwa.setState({ standalone: isStandalone(), ios });
    const onPrompt = (e: Event) => {
      e.preventDefault(); // simpan, tampilkan lewat tombol kita sendiri
      usePwa.setState({ prompt: e as InstallPrompt });
    };
    const onInstalled = () => usePwa.setState({ prompt: null, standalone: true });
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  return iosHelp ? <IosHelp /> : null;
}

function IosHelp() {
  const close = () => usePwa.setState({ iosHelp: false });
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[rgba(43,29,78,.45)] p-4 sm:items-center" onClick={close}>
      <div className="w-full max-w-[420px] rounded-[28px] bg-white p-5" onClick={(e) => e.stopPropagation()} style={{ color: INK }}>
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800 }}>Pasang Rumila</h2>
          <button onClick={close} aria-label="Tutup" className="flex size-10 items-center justify-center rounded-xl bg-[#f5f0fa]">
            <Icon name="close" />
          </button>
        </div>
        <ol className="mt-3 flex flex-col gap-3 text-[16px] font-bold">
          <li className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#2f86ff]">
              <Icon name="ios_share" />
            </span>
            Ketuk tombol Bagikan di bilah browser.
          </li>
          <li className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#2f86ff]">
              <Icon name="add_box" />
            </span>
            Pilih &ldquo;Tambah ke Layar Utama&rdquo;, lalu &ldquo;Tambah&rdquo;.
          </li>
          <li className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2d9] text-[#ff7a1a]">
              <Icon name="rocket_launch" />
            </span>
            Buka Rumila dari ikon di layar utama.
          </li>
        </ol>
        <p className="mt-3 text-[13px] font-semibold text-[#8a7a9c]">Di Chrome iPad/iPhone, tombol Bagikan ada di kanan atas bilah alamat.</p>
      </div>
    </div>
  );
}

/** Kartu ajakan pasang di beranda (bisa ditutup, diingat di perangkat ini). */
export function InstallBanner() {
  const can = useCanInstall();
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      setHidden(localStorage.getItem("rumila-install-dismissed") === "1");
    } catch {
      setHidden(false);
    }
  }, []);
  if (!can || hidden) return null;
  return (
    <div className="flex items-center gap-3 rounded-[22px] bg-white p-2.5 pr-3 shadow-[0_4px_0_rgba(43,29,78,.06)]">
      <Image src="/icons/icon-192.png" alt="" width={48} height={48} className="size-12 rounded-[14px]" />
      <span className="min-w-0 flex-1">
        <span className="block" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, color: INK, lineHeight: 1.15 }}>
          Pasang Rumila di layar utama
        </span>
        <span className="block text-[12px] font-bold text-[#8a7a9c]">Buka seperti aplikasi, layar penuh.</span>
      </span>
      <button onClick={() => void installApp()} className="rounded-full px-4 py-2 text-[14px] font-extrabold text-white" style={{ background: "linear-gradient(155deg,#ffb347,#ff7a1a 60%)", boxShadow: "0 3px 0 #c85400" }}>
        Pasang
      </button>
      <button
        onClick={() => {
          setHidden(true);
          try {
            localStorage.setItem("rumila-install-dismissed", "1");
          } catch {}
        }}
        aria-label="Tutup"
        className="flex size-9 items-center justify-center rounded-full text-[#8a7a9c]"
      >
        <Icon name="close" size={20} />
      </button>
    </div>
  );
}

/** Tarik ke bawah dari puncak halaman untuk memuat ulang — hanya saat dibuka sebagai aplikasi. */
export function PullToRefresh() {
  const standalone = usePwa((s) => s.standalone);
  const [pull, setPull] = useState(0);
  const [loading, setLoading] = useState(false);
  const start = useRef<number | null>(null);
  const pullRef = useRef(0);
  const TRIGGER = 80;

  useEffect(() => {
    if (!standalone) return;
    const onStart = (e: TouchEvent) => {
      start.current = window.scrollY <= 0 && e.touches.length === 1 ? e.touches[0].clientY : null;
    };
    const onMove = (e: TouchEvent) => {
      if (start.current === null) return;
      const d = e.touches[0].clientY - start.current;
      if (d <= 0 || window.scrollY > 0) {
        pullRef.current = 0;
        setPull(0);
        return;
      }
      const eased = Math.min(130, d * 0.5); // makin jauh makin berat
      pullRef.current = eased;
      setPull(eased);
      if (e.cancelable) e.preventDefault(); // cegah pantulan bawaan saat menarik
    };
    const onEnd = () => {
      if (pullRef.current >= TRIGGER) {
        setLoading(true);
        setPull(TRIGGER);
        window.setTimeout(() => location.reload(), 150);
      } else setPull(0);
      pullRef.current = 0;
      start.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [standalone]);

  if (!standalone || (pull === 0 && !loading)) return null;
  const ready = pull >= TRIGGER || loading;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center" style={{ transform: `translateY(${Math.max(0, pull - 44)}px)`, paddingTop: "env(safe-area-inset-top)" }}>
      <span
        className="mt-2 flex size-11 items-center justify-center rounded-full bg-white text-[#ff7a1a] shadow-[0_4px_14px_rgba(43,29,78,.2)]"
        style={{ transform: `rotate(${loading ? 0 : pull * 3}deg)`, opacity: Math.min(1, pull / 40 + (loading ? 1 : 0)) }}
      >
        <Icon name={ready ? "refresh" : "arrow_downward"} size={26} className={loading ? "animate-spin" : ""} />
      </span>
    </div>
  );
}
