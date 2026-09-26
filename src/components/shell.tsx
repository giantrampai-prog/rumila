"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getFolder, type PermKey, type Tool } from "@/lib/catalog";
import { greeting } from "@/lib/format";
import { useCloudBoot } from "@/lib/supabase/family";
import { can, useHydrated, useIsDesktop, useMe, useRumila, useUI } from "@/lib/store";
import { LauncherFrame } from "./launcher";
import { SheetHost } from "./sheets";
import { Avatar, Icon } from "./ui";

const NAV: { href: string; icon: string; label: string; perm?: PermKey }[] = [
  { href: "/beranda", icon: "home", label: "Beranda" },
  { href: "/laporan", icon: "insights", label: "Laporan", perm: "laporan" },
  { href: "/finance", icon: "account_balance", label: "Finance", perm: "finance" },
  { href: "/saya", icon: "person", label: "Saya" },
];

/** Izin yang dibutuhkan sebuah route (guard sisi klien; fase Supabase ditambah RLS). */
function requiredPerm(path: string): PermKey | null {
  if (path.startsWith("/jelajah-tubuh") || path.startsWith("/buah-buahan")) return "edukasi";
  if (path.startsWith("/jelajah-angkasa")) return "angkasa";
  if (path.startsWith("/laporan")) return "laporan";
  if (path.startsWith("/finance")) return "finance";
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
  const desk = useIsDesktop();
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

  // Modul Finance punya kerangka sendiri (sidebar Keuangan), di desktop maupun mobile.
  if (path.startsWith("/buah-buahan") || path.startsWith("/finance") || path.startsWith("/jelajah-tubuh") || path.startsWith("/jelajah-angkasa"))
    return (
      <>
        {page}
        <Toast />
        <SheetHost />
      </>
    );

  // Website (≥880px): tampilan launcher ala Family Launcher v2.
  if (desk)
    return (
      <>
        <LauncherFrame
          overlay={
            <>
              <Toast />
              <SheetHost />
            </>
          }
        >
          {page}
        </LauncherFrame>
      </>
    );

  // Mobile: kolom 440px + bottom nav (acuan "Rumila App").
  return (
    <div className="flex min-h-dvh justify-center">
      <div className="relative min-h-dvh w-full max-w-[440px] bg-page shadow-[0_0_60px_rgba(31,48,68,.1)]">
        <main className="flex flex-col gap-5 px-[18px] pt-[18px] pb-28">
          <Header />
          {page}
        </main>
        <BottomNav />
        <Toast />
        <SheetHost />
      </div>
    </div>
  );
}

function Header() {
  const me = useMe();
  const openSheet = useUI((s) => s.openSheet);
  const [hello, setHello] = useState("Halo");
  useEffect(() => setHello(greeting()), []);

  return (
    <header className="flex items-center gap-3">
      <button
        onClick={() => openSheet({ kind: "members" })}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-label="Ganti profil"
      >
        <Avatar c={me.c} name={me.name} size={46} />
        <span className="min-w-0">
          <span className="block text-[13px] font-medium text-ink-3">{hello}</span>
          <span className="flex items-center gap-0.5 truncate text-xl font-extrabold tracking-[-0.02em]">
            {me.name}
            <Icon name="expand_more" className="text-ink-3" />
          </span>
        </span>
      </button>
      <Image src="/brand/rumila-mark.png" alt="Rumila" width={38} height={35} priority />
    </header>
  );
}

function BottomNav() {
  const me = useMe();
  const path = usePathname();
  const items = NAV.filter((n) => !n.perm || can(me, n.perm));

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 px-3 pb-3"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div
        className="grid rounded-3xl border border-line bg-white p-1.5 shadow-[0_12px_30px_rgba(31,48,68,.12)]"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}
      >
        {items.map((n) => {
          const on = isOn(path, n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={on ? "page" : undefined}
              className={`flex h-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${on ? "text-ink" : "text-ink-4"}`}
            >
              <Icon
                name={n.icon}
                size={24}
                className="rounded-full px-4 py-0.5 transition-all duration-200"
                style={{ background: on ? "var(--coral-tint)" : "transparent", color: on ? "var(--coral-deep)" : "var(--ink-4)" }}
              />
              {n.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const isOn = (path: string, href: string) => path === href || path.startsWith(href + "/");
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

/** Buka alat: alat Keuangan langsung ke Finance, lainnya lewat sheet detail. */
export function useOpenTool() {
  const router = useRouter();
  const openSheet = useUI((s) => s.openSheet);
  const logOpen = useRumila((s) => s.logOpen);
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
      angkasa5: "/jelajah-angkasa?mode=latihan",
    };
    if (angkasa[t.id]) {
      router.push(angkasa[t.id]);
      return;
    }
    if (t.folder === "keuangan" && can(me, "finance")) {
      logOpen(t.id);
      router.push("/finance");
      return;
    }
    openSheet({ kind: "app", toolId: t.id });
  };
}
