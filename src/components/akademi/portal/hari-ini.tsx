"use client";

// Tab "Hari ini": sapaan maskot + streak, 3 misi adaptif, stiker terbaru, tautan Rapor untuk wali.

import Link from "next/link";
import { useMemo } from "react";
import type { ContentPack, LevelId } from "@akademi/schema";
import { MascotBubble } from "@/components/kid";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { judulPaket } from "@/components/akademi/runner";
import { useEvents } from "@/lib/akademi/jejak";
import { pilihMisi } from "@/lib/akademi/misi";
import type { Member } from "@/lib/store";
import { IkonMekanik, INK, hitungStreak, kalimatKompetensi, labelMekanik, levelMeta, stikerTerbaru } from "./bersama";

export function HariIni({ me, level }: { me: Member; level: LevelId }) {
  const events = useEvents(me.id);
  const misi = useMemo(() => pilihMisi(me.id, events, level), [me.id, events, level]);
  const streak = useMemo(() => hitungStreak(events), [events]);
  const stiker = useMemo(() => stikerTerbaru(events), [events]);
  const nama = me.name.replace(/^(Kak|Dek) /, "");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <MascotBubble>
          {nama} sudah siap! Pilih misimu.
        </MascotBubble>
        <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 shadow-[0_3px_0_rgba(43,29,78,.08)]" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800, color: INK }} aria-label={`Streak ${streak} hari`}>
          <span aria-hidden>🔥</span> {streak} hari
        </span>
      </div>

      <section className="flex flex-col gap-3">
        <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>Misi hari ini</h2>
        {misi.length === 0 ? (
          <p className="rounded-[22px] bg-white p-4 text-[15px] font-bold text-ink-3">Misi belum tersedia. Coba lagi sebentar lagi, ya.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {misi.map((p) => (
              <KartuMisi key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {stiker.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>Stiker terbaru</h2>
          <div className="flex flex-wrap gap-2.5">
            {stiker.map((p) => (
              <Link key={p.id} href={`/akademi/main/${p.id}`} className="flex min-h-[56px] items-center gap-2 rounded-[18px] bg-white py-2 pr-3.5 pl-2 transition-transform active:scale-95" style={{ boxShadow: "0 3px 0 rgba(43,29,78,.08)" }}>
                <span className="relative flex size-11 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(155deg,#ffe46b,#ffbe0b 65%)", boxShadow: "0 2px 0 #d99400" }}>
                  <Icon name="star" size={24} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-extrabold" style={{ color: INK }}>
                    {judulPaket(p)}
                  </span>
                  <span className="block text-[11px] font-extrabold text-ink-3">{labelMekanik(p.mechanic)}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {me.admin && (
        <div className="mt-2 flex justify-center">
          <Link href="/akademi/rapor" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-ink-3 shadow-[0_2px_0_rgba(43,29,78,.08)] transition-transform active:scale-95">
            <Icon name="assignment" size={18} /> Rapor untuk Ayah/Ibu
          </Link>
        </div>
      )}
    </>
  );
}

function KartuMisi({ p }: { p: ContentPack }) {
  const lv = levelMeta(p.level);
  return (
    <article className="flex flex-col gap-3 rounded-[22px] bg-white p-3.5 shadow-[0_4px_0_rgba(43,29,78,.08)]">
      <div className="flex items-start gap-3">
        <IkonMekanik mekanik={p.mechanic} size={56} />
        <div className="min-w-0 flex-1">
          <h3 className="leading-tight" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>
            {judulPaket(p)}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="inline-block rounded-full bg-[#ecebff] px-2 py-0.5 text-[11px] font-black text-[#5b4bff]">{labelMekanik(p.mechanic)}</span>
            <span className="text-[11px] font-extrabold text-ink-3">
              {lv.nama} · {lv.lokal}
            </span>
          </div>
        </div>
      </div>
      <p className="min-h-[2.6em] text-[14px] leading-snug font-bold text-ink-2">{kalimatKompetensi(p)}</p>
      <Link
        href={`/akademi/main/${p.id}`}
        className="flex h-12 items-center justify-center gap-1.5 rounded-[16px] text-white transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] active:scale-[.96]"
        style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, background: "linear-gradient(155deg,#ffb347,#ff7a1a 60%)", boxShadow: "0 4px 0 #c85400" }}
      >
        <Icon name="play_arrow" size={26} /> Main
      </Link>
    </article>
  );
}
