"use client";

// Tampilan anak Rumila: satu kerangka untuk HP, tablet, dan desktop.
// Tombol besar, sedikit teks, dunia (folder) sebagai kartu. Khusus anak: tanpa area orang tua.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BALOO, LauncherBackdrop, MemberAvatar, NUNITO } from "@/components/launcher";
import { Icon, PlayCtx } from "@/components/ui";
import { PLAY, canonicalToolId, getTool, type Folder, type Tool } from "@/lib/catalog";
import { greeting } from "@/lib/format";
import { can, useMe, useRumila, useUI } from "@/lib/store";

const INK = "#2b1d4e";

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

/* ---------------- kerangka ---------------- */

export function KidFrame({ children, overlay }: { children: ReactNode; overlay?: ReactNode }) {
  return (
    <PlayCtx.Provider value={true}>
      <div className="theme-play bg-dots relative min-h-dvh" style={{ fontFamily: NUNITO }}>
        <LauncherBackdrop />
        <div
          className="relative mx-auto flex max-w-[1080px] flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-5"
          style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}
        >
          {children}
        </div>
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
    </header>
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
