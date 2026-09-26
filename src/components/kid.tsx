"use client";

// Tampilan anak Rumila: satu kerangka untuk HP, tablet, dan desktop.
// Tombol besar, sedikit teks, dunia (folder) sebagai kartu besar, nav bawah Main / Koleksi / Orang Tua.

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BALOO, LauncherBackdrop, MemberAvatar, NUNITO } from "@/components/launcher";
import { Icon, PlayCtx } from "@/components/ui";
import { PLAY, canonicalToolId, getTool, type Folder, type Tool } from "@/lib/catalog";
import { greeting } from "@/lib/format";
import { can, useMe, useRumila, useUI, type Activity } from "@/lib/store";

const INK = "#2b1d4e";

/** Rute khusus orang tua (dibuka lewat gerbang hitungan). */
export const isParentPath = (path: string) => path.startsWith("/saya") || path.startsWith("/laporan");

/* ---------------- bintang ---------------- */

/** Bintang = 1 per materi selesai, 3 per latihan selesai. */
export const starsOf = (activity: Activity[], memberId: string) =>
  activity.reduce(
    (n, a) => n + (a.memberId !== memberId ? 0 : a.event === "material_complete" ? 1 : a.event === "exercise_complete" ? 3 : 0),
    0,
  );

export function useMyStars() {
  const me = useMe();
  const activity = useRumila((s) => s.activity);
  return useMemo(() => starsOf(activity, me.id), [activity, me.id]);
}

/** Alat yang terakhir dimainkan anggota aktif (yang masih boleh dibuka). */
export function useLastTool(): Tool | null {
  const me = useMe();
  const activity = useRumila((s) => s.activity);
  return useMemo(() => {
    for (let i = activity.length - 1; i >= 0; i--) {
      const a = activity[i];
      if (a.memberId !== me.id) continue;
      const t = getTool(canonicalToolId(a.toolId));
      if (t && !t.planned && can(me, t.folder)) return t;
    }
    return null;
  }, [activity, me]);
}

export function StarPill() {
  const stars = useMyStars();
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full"
      style={{
        background: "linear-gradient(155deg,#ffe46b,#ffbe0b)",
        boxShadow: "0 3px 0 #d99400",
        color: "#6b4300",
        fontFamily: BALOO,
        fontWeight: 800,
        fontSize: 15,
        padding: "3px 11px",
      }}
      aria-label={`${stars} bintang`}
    >
      <Icon name="star" size={17} />
      {stars}
    </span>
  );
}

/* ---------------- kerangka ---------------- */

export function KidFrame({ children, overlay, nav = true }: { children: ReactNode; overlay?: ReactNode; nav?: boolean }) {
  return (
    <PlayCtx.Provider value={true}>
      <div className="theme-play bg-dots relative min-h-dvh" style={{ fontFamily: NUNITO }}>
        <LauncherBackdrop />
        <div
          className="relative mx-auto flex max-w-[1080px] flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-5"
          style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: nav ? 108 : 40 }}
        >
          {children}
        </div>
        {nav && <KidNav />}
        {overlay}
      </div>
    </PlayCtx.Provider>
  );
}

export function KidHeader() {
  const me = useMe();
  const openSheet = useUI((s) => s.openSheet);
  const [hello, setHello] = useState("Halo");
  useEffect(() => setHello(greeting()), []);
  return (
    <header className="flex items-center gap-3">
      <button onClick={() => openSheet({ kind: "members" })} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label="Ganti pemain">
        <MemberAvatar m={me} size={44} theme="playful" />
        <span className="min-w-0">
          <span className="block text-[12px] font-extrabold text-ink-3">{hello},</span>
          <span className="flex items-center gap-0.5 truncate" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 800, color: INK, lineHeight: 1.05 }}>
            {me.name}
            <Icon name="expand_more" className="text-ink-3" />
          </span>
        </span>
      </button>
      <StarPill />
    </header>
  );
}

const KID_NAV = [
  { href: "/beranda", icon: "home", label: "Main", c: "orange" as const },
  { href: "/koleksi", icon: "emoji_events", label: "Koleksi", c: "gold" as const },
  { href: "/saya", icon: "lock", label: "Orang Tua", c: "indigo" as const },
];

function KidNav() {
  const path = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 px-3"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      aria-label="Menu utama"
    >
      <div className="grid grid-cols-3 gap-1 rounded-[24px] bg-white p-1.5 shadow-[0_4px_0_rgba(43,29,78,.06),0_12px_28px_rgba(43,29,78,.12)]">
        {KID_NAV.map((n) => {
          const on = n.href === "/saya" ? isParentPath(path) : path === n.href || path.startsWith(n.href + "/");
          const [l, m, d] = PLAY[n.c];
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={on ? "page" : undefined}
              className="flex h-[52px] flex-col items-center justify-center gap-0.5 rounded-[18px] transition-transform active:scale-95"
              style={
                on
                  ? { background: `linear-gradient(155deg, ${l}, ${m} 70%)`, boxShadow: `0 3px 0 ${d}`, color: "#fff" }
                  : { color: "#8a7a9c" }
              }
            >
              <Icon name={n.icon} size={23} />
              <span style={{ fontFamily: BALOO, fontSize: 12, fontWeight: 800, lineHeight: 1 }}>{n.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------------- sapaan maskot ---------------- */

export function MascotBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex size-[52px] shrink-0 items-center justify-center rounded-[18px] bg-white shadow-[0_3px_0_rgba(43,29,78,.08)]">
        <Image src="/brand/rumila-mark.png" alt="" width={36} height={33} />
      </div>
      <div
        className="relative rounded-[18px] rounded-bl-md bg-white px-3.5 py-2.5 shadow-[0_3px_0_rgba(43,29,78,.08)]"
        style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 700, color: INK, lineHeight: 1.2 }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------- kartu dunia ---------------- */

export function WorldCard({ f }: { f: Folder }) {
  const [l, m, d] = PLAY[f.c];
  const ready = f.items.filter((t) => !t.planned);
  return (
    <Link
      href={`/beranda/${f.id}`}
      className="relative flex min-h-[124px] flex-col justify-between overflow-hidden rounded-[22px] p-3.5 text-white transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] active:scale-[.97] sm:min-h-[136px]"
      style={{ background: `linear-gradient(155deg, ${l} 0%, ${m} 65%)`, boxShadow: `0 5px 0 ${d}` }}
    >
      <div aria-hidden className="absolute -right-8 -bottom-10 size-28 rounded-full bg-white/18" />
      <span className="relative flex size-11 items-center justify-center rounded-[14px] bg-white" style={{ boxShadow: `0 3px 0 ${d}44` }}>
        <span className="ms" style={{ fontSize: 26, color: m }}>
          {f.icon}
        </span>
      </span>
      <div className="relative">
        <div style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, lineHeight: 1.1, textShadow: "0 1px 0 rgba(0,0,0,.12)" }}>{f.name}</div>
        <div className="mt-0.5 text-[12px] font-extrabold text-white/85">{ready.length} permainan</div>
      </div>
    </Link>
  );
}

/* ---------------- gerbang orang tua ---------------- */

function question() {
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  const ans = a + b;
  const opts = new Set([ans]);
  while (opts.size < 3) opts.add(ans + (Math.floor(Math.random() * 7) - 3 || 4));
  return { a, b, ans, opts: [...opts].sort(() => Math.random() - 0.5) };
}

export function ParentGate() {
  const router = useRouter();
  const unlockParent = useUI((s) => s.unlockParent);
  const [q, setQ] = useState<ReturnType<typeof question> | null>(null);
  const [wrong, setWrong] = useState(false);
  useEffect(() => setQ(question()), []);

  const pick = (n: number) => {
    if (!q) return;
    if (n === q.ans) return unlockParent();
    setWrong(true);
    setQ(question());
  };

  return (
    <div className="flex min-h-[70dvh] items-center justify-center">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-4 rounded-[32px] bg-white p-6 text-center shadow-[0_8px_0_rgba(43,29,78,.08),0_24px_48px_rgba(43,29,78,.12)]">
        <span className="flex size-16 items-center justify-center rounded-[22px]" style={{ background: "linear-gradient(155deg,#9a93ff,#5b4bff)", boxShadow: "0 4px 0 #3a2cd1" }}>
          <Icon name="lock" size={36} className="text-white" />
        </span>
        <h1 style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: INK, lineHeight: 1.1 }}>Khusus orang tua</h1>
        <p className="text-[15px] text-ink-2">Jawab dulu untuk membuka pengaturan dan laporan.</p>
        {q && (
          <>
            <div style={{ fontFamily: BALOO, fontSize: 40, fontWeight: 800, color: INK }}>
              {q.a} + {q.b} = ?
            </div>
            <div className={`grid w-full grid-cols-3 gap-2.5 ${wrong ? "animate-[shake_.35s]" : ""}`} onAnimationEnd={() => setWrong(false)}>
              {q.opts.map((n) => (
                <button
                  key={n}
                  onClick={() => pick(n)}
                  className="h-16 rounded-[20px] bg-[#f5f0fa] transition-transform active:scale-95"
                  style={{ fontFamily: BALOO, fontSize: 28, fontWeight: 800, color: INK }}
                >
                  {n}
                </button>
              ))}
            </div>
          </>
        )}
        <button onClick={() => router.replace("/beranda")} className="mt-1 h-12 text-[15px] font-extrabold text-ink-3">
          Kembali main
        </button>
      </div>
    </div>
  );
}

/** Bar atas area orang tua: pindah Rumah & anggota / Laporan, atau kunci lagi. */
export function ParentBar() {
  const me = useMe();
  const path = usePathname();
  const router = useRouter();
  const lockParent = useUI((s) => s.lockParent);
  const tabs = [
    { href: "/saya", label: "Rumah & anggota", show: true },
    { href: "/laporan", label: "Laporan", show: can(me, "laporan") },
  ].filter((t) => t.show);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1 rounded-[18px] bg-white p-1 shadow-[0_3px_0_rgba(43,29,78,.06)]">
        {tabs.map((t) => {
          const on = path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-[14px] px-4 py-2.5 text-[14px] font-extrabold"
              style={on ? { background: "#efeaff", color: "#3a2cd1" } : { color: "#8a7a9c" }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <button
        onClick={() => {
          lockParent();
          router.replace("/beranda");
        }}
        className="ml-auto flex h-11 items-center gap-1.5 rounded-[16px] bg-white px-4 text-[14px] font-extrabold text-ink-2 shadow-[0_3px_0_rgba(43,29,78,.06)]"
      >
        <Icon name="lock" size={20} />
        Kunci &amp; kembali main
      </button>
    </div>
  );
}
