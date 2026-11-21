"use client";

// Kartu Penilaian Praktik Kampus: nilai akhir dari gedung kampus (Lab Komputer, Laboratorium 3D) untuk jenjang anak.
// Pelengkap Ruang Kelas: tidak membuka misi, tidak menjadi syarat naik jenjang; dibekukan di transkrip saat sertifikat terbit.

import Link from "next/link";
import { useMemo } from "react";
import type { GameEvent, LevelId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { KOMPETENSI } from "@/lib/akademi/konten";
import { NAMA_GEDUNG_PRAKTIK, penilaianKampus, type KompetensiPraktik } from "@/lib/akademi/praktik-kampus";
import { INK } from "./bersama";

const WARNA_STATUS: Record<KompetensiPraktik["status"], { teks: string; bg: string; fg: string }> = {
  dikuasai: { teks: "Dikuasai", bg: "#e4f8ec", fg: "#12904a" },
  berkembang: { teks: "Berkembang", bg: "#fff4d1", fg: "#b07a00" },
  belum: { teks: "Belum", bg: "#f3ece2", fg: "#76695a" },
};

/** `rinci` = tampilkan daftar kompetensi per gedung (Rapor orang tua). */
export function KartuPraktikKampus({ events, level, rinci = false }: { events: GameEvent[]; level: LevelId; rinci?: boolean }) {
  const p = useMemo(() => penilaianKampus(events, KOMPETENSI, level), [events, level]);
  if (p.nilai === null) return null;
  return (
    <section aria-label={`Penilaian Praktik Kampus: nilai ${p.nilai}`} className="rapor-card rounded-[24px] bg-white p-4 shadow-[0_4px_0_rgba(11,37,69,.08)] sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] text-white" style={{ background: "linear-gradient(155deg,#8fd16a,#3a9b3a 65%)", boxShadow: "0 3px 0 #2c7a2c" }}>
          <Icon name="domain" size={28} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block leading-tight" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, color: INK }}>
            Penilaian Praktik Kampus
          </span>
          <span className="block text-[12px] font-extrabold text-ink-3">Nilai dari main di gedung kampus · ikut tercatat di transkrip</span>
        </span>
        <span className="flex shrink-0 flex-col items-end leading-none">
          <span style={{ fontFamily: BALOO, fontSize: 30, fontWeight: 800, color: INK }}>{p.nilai}</span>
          <span className="mt-1 text-[11px] font-black text-ink-3">{p.komponen.some((k) => k.kompetensi.some((x) => x.percobaan > 0)) ? p.predikat : "Belum dimulai"}</span>
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {p.komponen.map((k) => {
          const g = NAMA_GEDUNG_PRAKTIK[k.gedung];
          const belumDicoba = k.kompetensi.filter((x) => x.percobaan === 0).length;
          return (
            <li key={k.gedung} className="rounded-[18px] bg-[#fffaf2] p-3" style={{ boxShadow: "inset 0 0 0 1.5px #fff0da" }}>
              <div className="flex items-center gap-2.5">
                <Icon name={g.icon} size={22} className="shrink-0 text-[#3a4670]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-extrabold" style={{ color: INK }}>{g.nama}</span>
                  <span className="block text-[12px] font-bold text-ink-3">
                    {belumDicoba ? `${belumDicoba} dari ${k.kompetensi.length} tugas praktik belum dicoba` : "Semua tugas praktik sudah dicoba"}
                  </span>
                </span>
                <span className="shrink-0 text-[17px] font-black tabular-nums" style={{ color: INK }}>{k.nilai}</span>
                <Link href={g.href} aria-label={`Buka ${g.nama}`} className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-transform active:scale-95" style={{ background: "linear-gradient(155deg,#1f94f0,#0567c2 60%)", boxShadow: "0 2px 0 #0567c2" }}>
                  <Icon name="arrow_forward" size={22} />
                </Link>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f3ece2]">
                <div style={{ width: `${k.nilai}%`, background: "#3a9b3a", height: "100%" }} />
              </div>
              {rinci && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {k.kompetensi.map((x) => {
                    const w = WARNA_STATUS[x.status];
                    return (
                      <li key={x.id} className="flex items-start justify-between gap-3 text-[13px] font-bold" style={{ color: INK }}>
                        <span className="min-w-0">{x.pernyataan}</span>
                        <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black" style={{ background: w.bg, color: w.fg }}>
                          {x.percobaan ? w.teks : "Belum dicoba"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
