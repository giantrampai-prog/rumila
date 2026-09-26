"use client";

import { useMemo } from "react";
import { BALOO } from "@/components/launcher";
import { MascotBubble, starsOf } from "@/components/kid";
import { Icon } from "@/components/ui";
import { FOLDERS, PLAY, canonicalToolId, getTool, type ColorKey } from "@/lib/catalog";
import { can, useMe, useRumila } from "@/lib/store";

const INK = "#2b1d4e";

interface Badge {
  icon: string;
  name: string;
  hint: string;
  c: ColorKey;
  got: boolean;
}

export default function Koleksi() {
  const me = useMe();
  const activity = useRumila((s) => s.activity);

  const { stars, tried, badges } = useMemo(() => {
    const mine = activity.filter((a) => a.memberId === me.id);
    const stars = starsOf(activity, me.id);
    // Permainan berbeda yang pernah dicoba, per dunia.
    const tried = new Map<string, Set<string>>();
    for (const a of mine) {
      const t = getTool(canonicalToolId(a.toolId));
      if (!t) continue;
      if (!tried.has(t.folder)) tried.set(t.folder, new Set());
      tried.get(t.folder)!.add(t.id);
    }
    const done = (toolId: string) => mine.filter((a) => a.toolId === toolId && a.event === "material_complete").length;
    const worldsTried = [...tried.values()].filter((s) => s.size > 0).length;
    const badges: Badge[] = [
      { icon: "flag", name: "Penjelajah", hint: "Main pertama kali", c: "orange", got: mine.length > 0 },
      { icon: "star", name: "10 Bintang", hint: "Kumpulkan 10 bintang", c: "gold", got: stars >= 10 },
      { icon: "auto_awesome", name: "50 Bintang", hint: "Kumpulkan 50 bintang", c: "pink", got: stars >= 50 },
      { icon: "public", name: "Keliling Dunia", hint: "Main di 3 dunia", c: "sky", got: worldsTried >= 3 },
      { icon: "cardiology", name: "Dokter Cilik", hint: "Pelajari 5 bagian tubuh", c: "red", got: done("edukasi6") >= 5 },
      { icon: "rocket_launch", name: "Astronot", hint: "Pelajari 5 materi angkasa", c: "indigo", got: done("angkasa6") >= 5 },
    ];
    return { stars, tried, badges };
  }, [activity, me.id]);

  const worlds = FOLDERS.filter((f) => can(me, f.id));
  const got = badges.filter((b) => b.got).length;

  return (
    <>
      <h1 style={{ fontFamily: BALOO, fontSize: 32, fontWeight: 800, color: INK, lineHeight: 1 }}>Koleksiku</h1>

      <MascotBubble>
        {stars === 0 ? <>Selesaikan materi untuk dapat bintang pertamamu!</> : <>Hebat! Kamu sudah punya {stars} bintang.</>}
      </MascotBubble>

      <section className="flex flex-col gap-3">
        <h2 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK }}>
          Lencana <span className="text-ink-3">{got}/{badges.length}</span>
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {badges.map((b) => {
            const [l, m, d] = b.got ? PLAY[b.c] : ["#e4e0ea", "#cfc8da", "#b3aabf"];
            return (
              <div key={b.name} className="flex flex-col items-center gap-2 rounded-[24px] bg-white p-3 text-center shadow-[0_4px_0_rgba(43,29,78,.06)]">
                <span
                  className="flex size-16 items-center justify-center rounded-full text-white"
                  style={{ background: `linear-gradient(155deg, ${l}, ${m} 65%)`, boxShadow: `0 4px 0 ${d}` }}
                >
                  <Icon name={b.got ? b.icon : "lock"} size={34} />
                </span>
                <span style={{ fontFamily: BALOO, fontSize: 15, fontWeight: 800, color: b.got ? INK : "#8a7a9c", lineHeight: 1.1 }}>{b.name}</span>
                <span className="text-[12px] leading-tight font-bold text-ink-3">{b.hint}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK }}>Dunia yang dijelajahi</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {worlds.map((f) => {
            const total = f.items.filter((t) => !t.planned).length;
            const n = Math.min(tried.get(f.id)?.size ?? 0, total);
            const pct = total ? Math.round((n / total) * 100) : 0;
            const [l, m, d] = PLAY[f.c];
            return (
              <div key={f.id} className="flex items-center gap-3 rounded-[24px] bg-white p-3 shadow-[0_4px_0_rgba(43,29,78,.06)]">
                <span
                  className="flex size-14 shrink-0 items-center justify-center rounded-[18px] text-white"
                  style={{ background: `linear-gradient(155deg, ${l}, ${m} 65%)`, boxShadow: `0 3px 0 ${d}` }}
                >
                  <Icon name={f.icon} size={30} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>{f.name}</span>
                    <span className="shrink-0 text-[13px] font-extrabold text-ink-3">
                      {n}/{total}
                    </span>
                  </span>
                  <span className="mt-1.5 block h-3 overflow-hidden rounded-full bg-[#f5f0fa]">
                    <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: m }} />
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
