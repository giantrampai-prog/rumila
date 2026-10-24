"use client";

// Tab "Pelajaran": peta jenjang — kartu Matematika & Coding + pratinjau 3 unit jenjang anak, pelajaran lain "Segera".

import { tintaPada } from "@/lib/brand";
import Link from "next/link";
import { useMemo } from "react";
import { TRACKS, type LevelId, type TrackId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { PLAY } from "@/lib/catalog";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI, useBahasaAnak, type BahasaAnak } from "@/lib/akademi/konten";
import { proyeksi, ringkasTrack, type Penguasaan } from "@/lib/akademi/mastery";
import type { Member } from "@/lib/store";
import { INK, TRACK_IKON, TRACK_SLICE, TRACK_WARNA, levelMeta } from "./bersama";
import { CincinProgres, unitUntuk } from "./track";

export function PetaPelajaran({ me, level }: { me: Member; level: LevelId }) {
  const events = useEvents(me.id);
  const bahasa = useBahasaAnak(me.id);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const lv = levelMeta(level);
  const lain = TRACKS.filter((t) => !TRACK_SLICE.includes(t.id));

  return (
    <>
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>Pelajaranmu</h2>
          <span className="text-[13px] font-extrabold text-ink-3">
            {lv.nama} · {lv.lokal}
            {lv.pangkat ? ` · ${lv.pangkat}` : ""}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TRACK_SLICE.map((id) => {
            const r = ringkasTrack(peng, KOMPETENSI, id, level);
            return <KartuTrack key={id} id={id} level={level} peng={peng} dikuasai={r.dikuasai} total={r.total} bahasa={bahasa} />;
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>Segera hadir</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {lain.map((t) => {
            const [l, m] = PLAY[TRACK_WARNA[t.id]];
            const tinta = tintaPada(TRACK_WARNA[t.id]);
            return (
              <div key={t.id} aria-disabled className="relative flex min-h-[104px] flex-col justify-between overflow-hidden rounded-[22px] p-3 opacity-55 saturate-50" style={{ color: tinta, background: `linear-gradient(155deg, ${l} 0%, ${m} 65%)` }}>
                <span className="flex size-9 items-center justify-center rounded-[12px] bg-white">
                  <span className="ms" style={{ fontSize: 22, color: m }}>
                    {TRACK_IKON[t.id]}
                  </span>
                </span>
                <div>
                  <div style={{ fontFamily: BALOO, fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>{t.nama[bahasa]}</div>
                  <div className="mt-0.5 text-[11px] font-extrabold opacity-90">Segera</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function KartuTrack({ id, level, peng, dikuasai, total, bahasa }: { id: TrackId; level: LevelId; peng: Record<string, Penguasaan>; dikuasai: number; total: number; bahasa: BahasaAnak }) {
  const t = TRACKS.find((x) => x.id === id)!;
  const [l, m, d] = PLAY[TRACK_WARNA[id]];
  const tinta = tintaPada(TRACK_WARNA[id]);
  const pct = total ? Math.round((dikuasai / total) * 100) : 0;
  const unit = unitUntuk(id, level, KOMPETENSI, bahasa);
  const pratinjau = unit.slice(0, 3);
  const sisa = unit.length - pratinjau.length;
  return (
    <Link
      href={`/akademi/pelajaran/${id}`}
      className="flex flex-col overflow-hidden rounded-[24px] bg-white transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] active:scale-[.97]"
      style={{ boxShadow: `0 5px 0 ${d}` }}
    >
      <div className="relative flex min-h-[150px] flex-col justify-between overflow-hidden p-4" style={{ color: tinta, background: `linear-gradient(155deg, ${l} 0%, ${m} 65%)` }}>
        <div aria-hidden className="absolute -right-8 -bottom-12 size-36 rounded-full bg-white/18" />
        <div className="relative flex items-center justify-between">
          <span className="flex size-12 items-center justify-center rounded-[15px] bg-white" style={{ boxShadow: `0 3px 0 ${d}44` }}>
            <span className="ms" style={{ fontSize: 28, color: m }}>
              {TRACK_IKON[id]}
            </span>
          </span>
          <span className="rounded-full bg-white/25 px-2.5 py-1 text-[12px] font-black">{t.nama[bahasa === "en" ? "id" : "en"]}</span>
        </div>
        <div className="relative">
          <div style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, lineHeight: 1.1, textShadow: "0 1px 0 rgba(0,0,0,.12)" }}>{t.nama[bahasa]}</div>
          <div className="mt-1 text-[13px] font-extrabold opacity-90">{total ? `${dikuasai} dari ${total} kompetensi dikuasai` : "Konten segera"}</div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/30">
            <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {pratinjau.length > 0 && (
        <ol className="flex flex-col px-3 py-1.5">
          {pratinjau.map((u, i) => (
            <li key={u.id} className={`flex min-h-[52px] items-center gap-2.5 ${i < pratinjau.length - 1 ? "border-b border-[#fff0da]" : ""}`}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full" style={{ color: tinta, background: m, fontFamily: BALOO, fontSize: 15, fontWeight: 800 }}>
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-extrabold" style={{ color: INK }}>
                {u.nama}
              </span>
              <CincinProgres u={u} peng={peng} warna={m} size={28} />
            </li>
          ))}
          {sisa > 0 && (
            <li className="flex min-h-[40px] items-center justify-center gap-1 text-[12px] font-extrabold text-ink-3">
              {sisa} unit lagi <Icon name="chevron_right" size={16} />
            </li>
          )}
        </ol>
      )}
    </Link>
  );
}
