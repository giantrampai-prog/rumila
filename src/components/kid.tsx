"use client";

// Tampilan anak Rumila: satu kerangka untuk HP, tablet, dan desktop.
// Tombol besar, sedikit teks, dunia (folder) sebagai kartu. Khusus anak: tanpa area orang tua.

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BALOO, LauncherBackdrop, MemberAvatar, NUNITO } from "@/components/launcher";
import { Icon, PlayCtx } from "@/components/ui";
import { canonicalToolId, getTool, type Tool } from "@/lib/catalog";
import { greeting } from "@/lib/format";
import { PullToRefresh } from "@/components/pwa";
import { can, useMe, useRumila, useUI } from "@/lib/store";
import { alatSiap } from "@/lib/kampus";

const INK = "#0b2545";

/** Alat yang terakhir dimainkan anggota aktif (yang masih boleh dibuka). */
export function useLastTool(): Tool | null {
  const me = useMe();
  const activity = useRumila((s) => s.activity);
  return useMemo(() => {
    for (let i = activity.length - 1; i >= 0; i--) {
      const a = activity[i];
      if (a.memberId !== me.id) continue;
      const t = getTool(canonicalToolId(a.toolId));
      if (t && alatSiap(t) && can(me, t.folder)) return t;
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
        <PullToRefresh />
      </div>
    </PlayCtx.Provider>
  );
}

export function KidHeader() {
  const me = useMe();
  const openSheet = useUI((s) => s.openSheet);
  const [hello, setHello] = useState("Halo");
  useEffect(() => setHello(greeting()), []);
  const diBeranda = usePathname() === "/beranda";
  return (
    <header className="flex items-center gap-3">
      {/* jalan pulang ke beranda dari halaman mana pun */}
      {!diBeranda && (
        <Link
          href="/beranda"
          aria-label="Kembali ke kampus"
          className="flex h-[46px] shrink-0 items-center gap-1.5 rounded-full bg-white pr-4 pl-3 text-[#0567c2] shadow-[0_4px_0_rgba(11,37,69,.1)] transition-transform active:translate-y-0.5 active:scale-95"
          style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800 }}
        >
          <Icon name="home" size={26} />
          <span>Kampus</span>
        </Link>
      )}
      {/* salam (bukan tombol) */}
      <div className="min-w-0 flex-1">
        <span className="block text-[12px] font-extrabold text-ink-3">{hello},</span>
        <span className="block truncate" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 800, color: INK, lineHeight: 1.05 }}>
          {me.name}
        </span>
      </div>
      {/* profil & pengaturan: kanan atas, terpisah dari konten */}
      <button onClick={() => openSheet({ kind: "members" })} className="relative shrink-0 transition-transform active:scale-90" aria-label="Profil dan pengaturan">
        <MemberAvatar m={me} size={46} theme="playful" />
        <span className="absolute -right-1 -bottom-1 flex size-[22px] items-center justify-center rounded-full bg-white text-[#0567c2] shadow-[0_2px_0_rgba(11,37,69,.15)]">
          <Icon name="settings" size={15} />
        </span>
      </button>
    </header>
  );
}

/* ---------------- sapaan maskot ---------------- */

export function MascotBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex size-[52px] shrink-0 items-center justify-center rounded-[18px] bg-white shadow-[0_3px_0_rgba(11,37,69,.08)]">
        <Image src="/brand/rinoya-mark-r.png" alt="" width={38} height={38} />
      </div>
      <div
        className="relative rounded-[18px] rounded-bl-md bg-white px-3.5 py-2.5 shadow-[0_3px_0_rgba(11,37,69,.08)]"
        style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 700, color: INK, lineHeight: 1.2 }}
      >
        {children}
      </div>
    </div>
  );
}

