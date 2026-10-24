"use client";

// Tab "Pelajaran": peta jenjang — kartu Matematika & Coding (gaya WorldCard) + pelajaran lain "Segera".

import Link from "next/link";
import { useMemo } from "react";
import { TRACKS, type LevelId, type TrackId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { PLAY } from "@/lib/catalog";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI } from "@/lib/akademi/konten";
import { proyeksi, ringkasTrack } from "@/lib/akademi/mastery";
import type { Member } from "@/lib/store";
import { INK, TRACK_IKON, TRACK_SLICE, TRACK_WARNA, levelMeta } from "./bersama";

export function PetaPelajaran({ me, level }: { me: Member; level: LevelId }) {
  const events = useEvents(me.id);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const lv = levelMeta(level);
  const lain = TRACKS.filter((t) => !TRACK_SLICE.includes(t.id));

  return (
    <>
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>Pelajaranmu</h2>
          <span className="text-[13px] font-extrabold text-ink-3">
            {lv.nama} · {lv.pangkat}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TRACK_SLICE.map((id) => {
            const r = ringkasTrack(peng, KOMPETENSI, id, level);
            return <KartuTrack key={id} id={id} dikuasai={r.dikuasai} total={r.total} />;
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>Segera hadir</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {lain.map((t) => {
            const [l, m] = PLAY[TRACK_WARNA[t.id]];
            return (
              <div key={t.id} aria-disabled className="relative flex min-h-[104px] flex-col justify-between overflow-hidden rounded-[22px] p-3 text-white opacity-55 saturate-50" style={{ background: `linear-gradient(155deg, ${l} 0%, ${m} 65%)` }}>
                <span className="flex size-9 items-center justify-center rounded-[12px] bg-white">
                  <span className="ms" style={{ fontSize: 22, color: m }}>
                    {TRACK_IKON[t.id]}
                  </span>
                </span>
                <div>
                  <div style={{ fontFamily: BALOO, fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>{t.nama.id}</div>
                  <div className="mt-0.5 text-[11px] font-extrabold text-white/90">Segera</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function KartuTrack({ id, dikuasai, total }: { id: TrackId; dikuasai: number; total: number }) {
  const t = TRACKS.find((x) => x.id === id)!;
  const [l, m, d] = PLAY[TRACK_WARNA[id]];
  const pct = total ? Math.round((dikuasai / total) * 100) : 0;
  return (
    <Link
      href={`/akademi/pelajaran/${id}`}
      className="relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-[22px] p-4 text-white transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] active:scale-[.97]"
      style={{ background: `linear-gradient(155deg, ${l} 0%, ${m} 65%)`, boxShadow: `0 5px 0 ${d}` }}
    >
      <div aria-hidden className="absolute -right-8 -bottom-12 size-36 rounded-full bg-white/18" />
      <div className="relative flex items-center justify-between">
        <span className="flex size-12 items-center justify-center rounded-[15px] bg-white" style={{ boxShadow: `0 3px 0 ${d}44` }}>
          <span className="ms" style={{ fontSize: 28, color: m }}>
            {TRACK_IKON[id]}
          </span>
        </span>
        <span className="rounded-full bg-white/25 px-2.5 py-1 text-[12px] font-black">{t.nama.en}</span>
      </div>
      <div className="relative">
        <div style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, lineHeight: 1.1, textShadow: "0 1px 0 rgba(0,0,0,.12)" }}>{t.nama.id}</div>
        <div className="mt-1 text-[13px] font-extrabold text-white/90">
          {total ? `${dikuasai} dari ${total} kompetensi dikuasai` : "Konten segera"}
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/30">
          <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Link>
  );
}
