"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { installUiSounds } from "@/lib/sfx";
import { pasangQuestBukti } from "@/lib/akademi/quest";
import { type PermKey, type Tool } from "@/lib/catalog";
import { RUTE_ALAT } from "@/lib/kampus";
import { profilTerbuka, sentuhProfil, tutupProfil } from "@/lib/profil";
import { useCloudBoot } from "@/lib/supabase/family";
import { can, useHydrated, useMe, useRumila, useUI } from "@/lib/store";
import { KidFrame, KidHeader } from "./kid";
import { SheetHost } from "./sheets";

/** Izin yang dibutuhkan sebuah route (guard sisi klien; fase Supabase ditambah RLS). */
function requiredPerm(path: string): PermKey | null {
  // semua modul 3D ada di dunia Petualangan 3D (izin "angkasa")
  if (["/jelajah-tubuh", "/buah-buahan", "/jelajah-angkasa", "/roket", "/laut", "/bumi", "/umroh-virtual"].some((r) => path.startsWith(r))) return "angkasa";
  if (path.startsWith("/resto") || path.startsWith("/ular-tangga")) return "game";
  if (path.startsWith("/koding")) return "coding";
  // gedung kampus: izin menu lama tetap berlaku (Musala memeriksa izinnya sendiri: Doa, Ibadah, atau Lab 3D)
  if (path.startsWith("/akademi/lab")) return "angkasa";
  if (path.startsWith("/akademi/komputer")) return "coding";
  if (path.startsWith("/akademi/taman")) return "game";
  if (path.startsWith("/akademi/musala")) return null;
  if (path.startsWith("/akademi")) return "edukasi";
  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const cloud = useCloudBoot();
  const signedIn = useRumila((s) => s.signedIn);
  const router = useRouter();
  const ready = hydrated && cloud.status === "ready";

  // semua tombol di aplikasi berbunyi "tap" (modul baru otomatis ikut)
  useEffect(() => installUiSounds(), []);
  // item dunia 3D yang selesai dipelajari → bukti kompetensi Sains (peta QUEST)
  useEffect(() => pasangQuestBukti(), []);

  // Belum masuk akun / belum punya rumah / belum pilih profil → ke layar masuk.
  useEffect(() => {
    if (!hydrated || cloud.status === "loading") return;
    if (cloud.status !== "ready" || !signedIn) router.replace("/masuk");
  }, [hydrated, cloud.status, signedIn, router]);

  return ready && signedIn ? <Ready>{children}</Ready> : null;
}

function Ready({ children }: { children: ReactNode }) {
  const me = useMe();
  const path = usePathname();
  const router = useRouter();
  const showToast = useUI((s) => s.showToast);
  const need = requiredPerm(path);
  const allowed = !need || can(me, need);
  const lastMe = useRef(me.id);
  // Kunci profil: belum memilih profil + PIN di tab ini, atau 30 menit diam → kembali ke "Siapa yang belajar?".
  const terbuka = profilTerbuka(me.id);
  useEffect(() => {
    const cek = () => {
      if (!profilTerbuka(me.id)) {
        tutupProfil();
        router.replace("/masuk");
      }
    };
    cek();
    let terakhir = 0;
    const sentuh = () => {
      if (Date.now() - terakhir < 15_000) return;
      terakhir = Date.now();
      sentuhProfil();
    };
    const t = setInterval(cek, 60_000);
    window.addEventListener("pointerdown", sentuh);
    window.addEventListener("keydown", sentuh);
    return () => {
      clearInterval(t);
      window.removeEventListener("pointerdown", sentuh);
      window.removeEventListener("keydown", sentuh);
    };
  }, [me.id, router]);

  useEffect(() => {
    const switched = lastMe.current !== me.id;
    lastMe.current = me.id;
    if (!allowed) {
      // Habis ganti profil cukup pindah diam-diam; toast hanya untuk akses langsung.
      if (!switched) showToast("Menu ini belum dibuka untukmu");
      router.replace("/beranda");
    }
  }, [allowed, me.id, router, showToast]);

  const page = allowed && terbuka ? children : null;

  // Modul layar penuh (3D & katalog buah) punya kerangka sendiri, di desktop maupun mobile.
  if (["/buah-buahan", "/jelajah-tubuh", "/jelajah-angkasa", "/roket", "/laut", "/bumi", "/umroh-virtual", "/resto", "/ular-tangga", "/koding", "/akademi/main", "/akademi/ujian", "/akademi/penempatan", "/akademi/piagam", "/orang-tua", "/akademi/rapor", "/akademi/telemetri", "/akademi/sertifikat"].some((r) => path.startsWith(r)))
    return (
      <>
        {page}
        <Toast />
        <SheetHost />
      </>
    );

  // Tampilan anak: satu kerangka untuk HP, tablet, dan desktop.
  return (
    <KidFrame overlay={<><Toast /><SheetHost /></>}>
      <KidHeader />
      {page}
    </KidFrame>
  );
}

function Toast() {
  const toast = useUI((s) => s.toast);
  if (!toast) return null;
  return (
    <div
      role="status"
      className="anim-toast fixed bottom-24 left-1/2 desk:bottom-10 z-[70] -translate-x-1/2 whitespace-nowrap rounded-[14px] bg-ink px-[18px] py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(31,48,68,.3)]"
    >
      {toast}
    </div>
  );
}

/** Buka alat: modul 3D langsung ke halamannya, lainnya lewat sheet detail. */
export function useOpenTool() {
  const router = useRouter();
  const openSheet = useUI((s) => s.openSheet);
  const me = useMe();
  return (t: Tool) => {
    if (!can(me, t.folder)) return;
    const rute = RUTE_ALAT[t.id];
    if (rute) {
      router.push(rute);
      return;
    }
    openSheet({ kind: "app", toolId: t.id });
  };
}
