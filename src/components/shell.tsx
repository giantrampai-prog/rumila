"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { getFolder, type PermKey, type Tool } from "@/lib/catalog";
import { useCloudBoot } from "@/lib/supabase/family";
import { can, useHydrated, useMe, useRumila, useUI } from "@/lib/store";
import { KidFrame, KidHeader } from "./kid";
import { SheetHost } from "./sheets";

/** Izin yang dibutuhkan sebuah route (guard sisi klien; fase Supabase ditambah RLS). */
function requiredPerm(path: string): PermKey | null {
  // semua modul 3D ada di dunia Petualangan 3D (izin "angkasa")
  if (["/jelajah-tubuh", "/buah-buahan", "/jelajah-angkasa", "/roket", "/laut"].some((r) => path.startsWith(r))) return "angkasa";
  const m = path.match(/^\/beranda\/([^/]+)/);
  if (m) return (getFolder(m[1])?.id as PermKey) ?? null;
  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const cloud = useCloudBoot();
  const signedIn = useRumila((s) => s.signedIn);
  const router = useRouter();
  const ready = hydrated && cloud.status === "ready";

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

  useEffect(() => {
    const switched = lastMe.current !== me.id;
    lastMe.current = me.id;
    if (!allowed) {
      // Habis ganti profil cukup pindah diam-diam; toast hanya untuk akses langsung.
      if (!switched) showToast("Menu ini belum dibuka untukmu");
      router.replace("/beranda");
    }
  }, [allowed, me.id, router, showToast]);

  const page = allowed ? children : null;

  // Modul layar penuh (3D & katalog buah) punya kerangka sendiri, di desktop maupun mobile.
  if (["/buah-buahan", "/jelajah-tubuh", "/jelajah-angkasa", "/roket", "/laut"].some((r) => path.startsWith(r)))
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
    if (t.id === "edukasi-buah") {
      router.push("/buah-buahan");
      return;
    }
    if (t.id === "edukasi6" || t.id === "edukasi2") {
      router.push("/jelajah-tubuh");
      return;
    }
    // Jelajah Angkasa 3D + pintasan dari alat Angkasa lama (progres tetap satu: angkasa6, tidak diduplikasi).
    const angkasa: Record<string, string> = {
      angkasa6: "/jelajah-angkasa",
      angkasa0: "/jelajah-angkasa",
      angkasa1: "/jelajah-angkasa?obj=moon",
      angkasa3: "/roket",
      "petualangan-laut": "/laut",
    };
    if (angkasa[t.id]) {
      router.push(angkasa[t.id]);
      return;
    }
    openSheet({ kind: "app", toolId: t.id });
  };
}
