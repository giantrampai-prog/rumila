"use client";

// Halaman satu pelajaran: tiga jenjang (PAUD / TK A / TK B) → kartu unit → chip aktivitas.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { levelIndex, type Competency, type ContentPack, type LevelId, type TrackId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { PLAY } from "@/lib/catalog";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI, levelAnak, paketUntuk } from "@/lib/akademi/konten";
import { proyeksi, type Penguasaan } from "@/lib/akademi/mastery";
import { useMe } from "@/lib/store";
import { ChipAktivitas, INK, KepalaWarna, LEVEL_SLICE, TRACK_IKON, TRACK_SLICE, TRACK_WARNA, TitikStatus, isTrackId, levelMeta, trackMeta } from "./bersama";

export interface UnitGrup {
  id: string;
  nama: string;
  kompetensi: Competency[];
  paket: ContentPack[];
}

/** Kelompokkan kompetensi track×level per unit (urutan kemunculan), paket unik per unit. */
export function unitUntuk(track: TrackId, level: LevelId, kompetensi: Competency[] = KOMPETENSI): UnitGrup[] {
  const map = new Map<string, UnitGrup>();
  for (const c of kompetensi) {
    if (c.track !== track || c.level !== level) continue;
    const g = map.get(c.unit.id) ?? map.set(c.unit.id, { id: c.unit.id, nama: c.unit.nama.id, kompetensi: [], paket: [] }).get(c.unit.id)!;
    g.kompetensi.push(c);
    for (const p of paketUntuk(c.id)) if (!g.paket.some((x) => x.id === p.id)) g.paket.push(p);
  }
  return [...map.values()];
}

export function TrackView({ track }: { track: string }) {
  const me = useMe();
  const events = useEvents(me.id);
  const [level, setLevel] = useState<LevelId>("PAUD");
  useEffect(() => setLevel(levelAnak(me.id)), [me.id]);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);

  if (!isTrackId(track) || !TRACK_SLICE.includes(track)) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[22px] bg-white p-6 text-center shadow-[0_4px_0_rgba(43,29,78,.06)]">
        <Icon name="hourglass_top" size={40} style={{ color: "#8a7a9c" }} />
        <p style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>Pelajaran ini segera hadir</p>
        <Link href="/akademi" className="rounded-full px-5 py-2.5 text-white" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800, background: "linear-gradient(155deg,#9a93ff,#5b4bff 60%)", boxShadow: "0 3px 0 #3a2cd1" }}>
          Kembali
        </Link>
      </div>
    );
  }

  const t = trackMeta(track);
  const warna = TRACK_WARNA[track];
  const idxAnak = levelIndex(level);

  return (
    <>
      <KepalaWarna c={warna} icon={TRACK_IKON[track]} judul={t.nama.id} sub={`Jenjangmu: ${levelMeta(level).nama} · ${levelMeta(level).pangkat}`} />
      {LEVEL_SLICE.map((lv) => {
        const meta = levelMeta(lv);
        const unit = unitUntuk(track, lv);
        const tantangan = levelIndex(lv) > idxAnak;
        return (
          <section key={lv} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>
                {meta.nama} <span className="text-ink-3">· {meta.pangkat}</span>
              </h2>
              {lv === level && <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black text-[#12904a] shadow-[0_2px_0_rgba(43,29,78,.08)]">Jenjangmu</span>}
              {tantangan && (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black text-white" style={{ background: "linear-gradient(155deg,#c78bff,#8b45f5 65%)" }}>
                  <Icon name="bolt" size={13} /> Tantangan
                </span>
              )}
            </div>
            {unit.length === 0 ? (
              <p className="rounded-[20px] bg-white/70 p-3.5 text-[14px] font-bold text-ink-3">Konten jenjang ini segera hadir.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {unit.map((u) => (
                  <KartuUnit key={u.id} u={u} peng={peng} c={warna} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}

function KartuUnit({ u, peng, c }: { u: UnitGrup; peng: Record<string, Penguasaan>; c: keyof typeof PLAY }) {
  const [, m] = PLAY[c];
  return (
    <article className="flex flex-col gap-3 rounded-[22px] bg-white p-3.5 shadow-[0_4px_0_rgba(43,29,78,.06)]">
      <div className="flex items-start gap-3">
        <CincinProgres u={u} peng={peng} warna={m} />
        <div className="min-w-0 flex-1">
          <h3 className="leading-tight" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, color: INK }}>
            {u.nama}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {u.kompetensi.map((k) => (
              <TitikStatus key={k.id} status={peng[k.id]?.status ?? "belum"} />
            ))}
          </div>
        </div>
      </div>
      {u.paket.length === 0 ? (
        <span className="text-[12px] font-extrabold text-ink-3">Aktivitas segera</span>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {u.paket.map((p) => (
            <ChipAktivitas key={p.id} p={p} />
          ))}
        </div>
      )}
    </article>
  );
}

/** Cincin: busur hijau (dikuasai) + kuning (berkembang) di atas abu. Tanpa angka. */
function CincinProgres({ u, peng, warna }: { u: UnitGrup; peng: Record<string, Penguasaan>; warna: string }) {
  const n = u.kompetensi.length || 1;
  const dik = u.kompetensi.filter((k) => peng[k.id]?.status === "dikuasai").length;
  const ber = u.kompetensi.filter((k) => peng[k.id]?.status === "berkembang").length;
  const r = 20;
  const keliling = 2 * Math.PI * r;
  const segmen = (jumlah: number) => `${(jumlah / n) * keliling} ${keliling}`;
  const putar = (jumlah: number) => `rotate(${-90 + (jumlah / n) * 360} 26 26)`;
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" aria-hidden className="shrink-0">
      <circle cx={26} cy={26} r={r} fill="none" stroke="#efeaf5" strokeWidth={7} />
      {ber > 0 && <circle cx={26} cy={26} r={r} fill="none" stroke="#ffbe0b" strokeWidth={7} strokeDasharray={segmen(ber)} transform={putar(dik)} strokeLinecap="round" />}
      {dik > 0 && <circle cx={26} cy={26} r={r} fill="none" stroke="#1fbf62" strokeWidth={7} strokeDasharray={segmen(dik)} transform={putar(0)} strokeLinecap="round" />}
      <text x={26} y={26} textAnchor="middle" dominantBaseline="central" fontSize={16} fill={warna} fontFamily="Material Symbols Rounded">
        {dik === u.kompetensi.length && dik > 0 ? "star" : ""}
      </text>
    </svg>
  );
}
