"use client";

import Link from "next/link";
import { AppIcon, BALOO } from "@/components/launcher";
import { useOpenTool } from "@/components/shell";
import { Icon } from "@/components/ui";
import { PLAY, type Folder } from "@/lib/catalog";

/** Halaman satu dunia: judul besar + petak permainan. */
export function WorldView({ f }: { f: Folder }) {
  const openTool = useOpenTool();
  const [l, m, d] = PLAY[f.c];

  return (
    <>
      <div
        className="relative flex items-center gap-3 overflow-hidden rounded-[24px] p-3.5 text-white sm:p-4"
        style={{ background: `linear-gradient(155deg, ${l} 0%, ${m} 60%)`, boxShadow: `0 5px 0 ${d}` }}
      >
        <div aria-hidden className="absolute -right-12 -bottom-16 size-48 rounded-full bg-white/20" />
        <Link
          href="/beranda"
          aria-label="Kembali"
          className="relative flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-white transition-transform active:scale-95"
          style={{ color: d, boxShadow: `0 4px 0 ${d}55` }}
        >
          <Icon name="arrow_back" size={24} />
        </Link>
        <div className="relative min-w-0 flex-1">
          <h1 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, lineHeight: 1.05, color: "#fff", textShadow: "0 2px 0 rgba(0,0,0,.12)" }}>{f.name}</h1>
          <p className="mt-0.5 text-[13px] font-extrabold text-white/90">{f.desc}</p>
        </div>
        <span className="relative hidden size-14 items-center justify-center rounded-[18px] bg-white sm:flex" style={{ boxShadow: `0 3px 0 ${d}55` }}>
          <span className="ms" style={{ fontSize: 34, color: m }}>
            {f.icon}
          </span>
        </span>
      </div>

      <section className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-5 md:grid-cols-6">
        {f.items.map((t) => (
          <button
            key={t.id}
            onClick={() => openTool(t)}
            className="flex flex-col items-center gap-1.5 rounded-[20px] p-1.5 transition-transform active:scale-95"
          >
            <span className="relative">
              <span className="sm:hidden">
                <AppIcon t={t} size={60} theme="playful" />
              </span>
              <span className="hidden sm:block">
                <AppIcon t={t} size={70} theme="playful" />
              </span>
              {t.planned && (
                <span className="absolute -top-2 -right-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-ink-3 shadow-[0_2px_0_rgba(43,29,78,.1)]">
                  Segera
                </span>
              )}
            </span>
            <span className="text-center leading-tight" style={{ fontFamily: BALOO, fontSize: 13, fontWeight: 800, color: "#2b1d4e" }}>
              {t.name}
            </span>
          </button>
        ))}
      </section>
    </>
  );
}
