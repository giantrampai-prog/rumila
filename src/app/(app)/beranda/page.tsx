"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LauncherHome } from "@/components/launcher";
import { useOpenTool } from "@/components/shell";
import { Card, Icon, SectionTitle, Tile, listRow } from "@/components/ui";
import { ALL_TOOLS, FOLDERS, canonicalToolId, getTool, matchesTool } from "@/lib/catalog";
import { can, useIsDesktop, useMe, useRumila } from "@/lib/store";

const WEEK = 7 * 86400000;

export default function Beranda() {
  const desk = useIsDesktop();
  const openTool = useOpenTool();
  return desk ? <LauncherHome open={openTool} /> : <BerandaMobile />;
}

function BerandaMobile() {
  const me = useMe();
  const activity = useRumila((s) => s.activity);
  const openTool = useOpenTool();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const allowed = FOLDERS.filter((f) => can(me, f.id));
  const results = query ? ALL_TOOLS.filter((t) => can(me, t.folder) && matchesTool(t, query)) : [];

  // Sering dibuka: top-5 activity_log milik member aktif, 7 hari, hanya modul yang diizinkan.
  const suggest = useMemo(() => {
    const since = Date.now() - WEEK;
    const counts = new Map<string, number>();
    for (const a of activity) if (a.memberId === me.id && a.at >= since) {
      const id = canonicalToolId(a.toolId);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return [...counts]
      .map(([id, n]) => ({ t: getTool(id)!, n }))
      .filter((x) => x.t && can(me, x.t.folder))
      .sort((a, b) => b.n - a.n)
      .slice(0, 5);
  }, [activity, me]);

  return (
    <>
      <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 focus-within:border-ink-4 desk:max-w-[640px]">
        <Icon name="search" className="text-ink-3" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari game, doa, pelajaran…"
          aria-label="Cari alat"
          className="min-w-0 flex-1 bg-transparent py-3.5 text-[15px] font-medium outline-none"
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Hapus pencarian" className="text-ink-4">
            <Icon name="close" size={20} />
          </button>
        )}
      </div>

      {query ? (
        <Card className="px-3.5 py-1 desk:max-w-[640px]">
          {results.map((t) => (
            <button key={t.id} onClick={() => openTool(t)} className={listRow}>
              <span className={t.planned ? 'grayscale' : undefined}><Tile c={t.g} icon={t.icon} size={42} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold">{t.name}</span>
                <span className="text-xs text-ink-3">{t.planned ? 'Segera hadir' : t.folderName}</span>
              </span>
            </button>
          ))}
          {results.length === 0 && <div className="py-4 text-sm text-ink-3">Belum ketemu. Coba kata lain, ya.</div>}
        </Card>
      ) : (
        <>
          {suggest.length > 0 && (
            <section className="flex flex-col gap-3">
              <SectionTitle right="minggu ini">Sering dibuka</SectionTitle>
              <div className="-mx-[18px] flex gap-2.5 overflow-x-auto px-[18px] pb-0.5 desk:mx-0 desk:grid desk:grid-cols-5 desk:gap-3 desk:overflow-visible desk:px-0">
                {suggest.map(({ t, n }) => (
                  <button
                    key={t.id}
                    onClick={() => openTool(t)}
                    className="flex w-[118px] shrink-0 flex-col items-start gap-2 rounded-[18px] border border-line bg-white p-3 transition-transform hover:-translate-y-0.5 active:scale-[.97] desk:w-auto desk:p-4"
                  >
                    <span className={t.planned ? 'grayscale' : undefined}><Tile c={t.g} icon={t.icon} size={40} /></span>
                    <span className="text-left text-[13px] leading-tight font-bold">{t.name}</span>
                    <span className="text-[11px] font-medium text-ink-3">{n}× dibuka</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <SectionTitle>Menu</SectionTitle>
            <div className="grid grid-cols-3 gap-2.5 desk:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] desk:gap-3">
              {allowed.map((f) => (
                <Link
                  key={f.id}
                  href={`/beranda/${f.id}`}
                  className="flex flex-col items-center gap-2.5 rounded-[20px] border border-line bg-white px-2 pt-4 pb-3.5 transition-transform hover:-translate-y-0.5 active:scale-[.97] desk:pt-6 desk:pb-5"
                >
                  <Tile c={f.c} icon={f.icon} size={52} radius={0.32} />
                  <span className="text-center text-[13px] leading-tight font-bold">{f.name}</span>
                </Link>
              ))}
            </div>
            {allowed.length < FOLDERS.length && (
              <p className="text-center text-xs text-ink-4">{FOLDERS.length - allowed.length} menu disembunyikan oleh Admin</p>
            )}
          </section>
        </>
      )}
    </>
  );
}
