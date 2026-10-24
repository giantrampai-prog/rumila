"use client";

// Halaman satu pelajaran: jalur belajar vertikal — jenjang → unit bernomor → kompetensi berurutan → tombol aktivitas.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { levelIndex, type Competency, type ContentPack, type LevelId, type TrackId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { judulPaket } from "@/components/akademi/runner";
import { PLAY } from "@/lib/catalog";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI, levelAnak, paketUntuk, useBahasaAnak, type BahasaAnak } from "@/lib/akademi/konten";
import { proyeksi, ringkasTrack, type Penguasaan } from "@/lib/akademi/mastery";
import { useMe } from "@/lib/store";
import { questUntuk } from "@/lib/akademi/quest";
import { IkonStatus, INK, KepalaWarna, LEVEL_SLICE, TRACK_IKON, TRACK_SLICE, TRACK_WARNA, TombolAktivitas, isTrackId, levelMeta, paketSelesai, trackMeta } from "./bersama";

export interface UnitGrup {
  id: string;
  nama: string;
  kompetensi: Competency[];
  paket: ContentPack[];
}

/** Kelompokkan kompetensi track×level per unit (urutan kemunculan); kompetensi urut id (.01, .02 …), paket unik per unit. */
export function unitUntuk(track: TrackId, level: LevelId, kompetensi: Competency[] = KOMPETENSI, bahasa: BahasaAnak = "id"): UnitGrup[] {
  const map = new Map<string, UnitGrup>();
  for (const c of kompetensi) {
    if (c.track !== track || c.level !== level) continue;
    const g = map.get(c.unit.id) ?? map.set(c.unit.id, { id: c.unit.id, nama: c.unit.nama[bahasa] ?? c.unit.nama.id, kompetensi: [], paket: [] }).get(c.unit.id)!;
    g.kompetensi.push(c);
    for (const p of paketUntuk(c.id)) if (!g.paket.some((x) => x.id === p.id)) g.paket.push(p);
  }
  for (const g of map.values()) g.kompetensi.sort((a, b) => a.id.localeCompare(b.id));
  return [...map.values()];
}

/** Aktivitas satu kompetensi, urut judul. */
const paketKompetensi = (c: Competency, bahasa: BahasaAnak) => [...paketUntuk(c.id)].sort((a, b) => judulPaket(a, bahasa).localeCompare(judulPaket(b, bahasa), bahasa));

export function TrackView({ track }: { track: string }) {
  const me = useMe();
  const events = useEvents(me.id);
  const bahasa = useBahasaAnak(me.id);
  const [level, setLevel] = useState<LevelId>("PAUD");
  useEffect(() => setLevel(levelAnak(me.id)), [me.id]);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const selesai = useMemo(() => paketSelesai(events), [events]);

  if (!isTrackId(track) || !TRACK_SLICE.includes(track)) {
    return (
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-3 rounded-[22px] bg-white p-6 text-center shadow-[0_4px_0_rgba(11,37,69,.08)]">
        <Icon name="hourglass_top" size={40} style={{ color: "#5b6b85" }} />
        <p style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>Pelajaran ini segera hadir</p>
        <Link href="/akademi" className="rounded-full px-5 py-2.5 text-white" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800, background: "linear-gradient(155deg,#4fb3ff,#0786eb 60%)", boxShadow: "0 3px 0 #0567c2" }}>
          Kembali
        </Link>
      </div>
    );
  }

  const t = trackMeta(track);
  const warna = TRACK_WARNA[track];
  const idxAnak = levelIndex(level);
  const ringkas = ringkasTrack(peng, KOMPETENSI, track, level);
  const sub = ringkas.total ? `${ringkas.dikuasai} dari ${ringkas.total} kompetensi dikuasai di jenjangmu` : "Konten jenjangmu segera hadir";

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5">
      <KepalaWarna c={warna} icon={TRACK_IKON[track]} judul={t.nama[bahasa]} sub={sub} />
      {LEVEL_SLICE.map((lv) => (
        <Jenjang key={lv} lv={lv} track={track} jenjangAnak={lv === level} tantangan={levelIndex(lv) > idxAnak} peng={peng} selesai={selesai} bahasa={bahasa} />
      ))}
    </div>
  );
}

/* ---------------- jenjang ---------------- */

function JudulJenjang({ lv, jenjangAnak }: { lv: LevelId; jenjangAnak: boolean }) {
  const meta = levelMeta(lv);
  return (
    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <h2 className="leading-none" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK }}>
        {meta.nama}
      </h2>
      <span className="text-[13px] font-extrabold text-ink-3">
        {meta.lokal}
        {meta.pangkat ? ` · ${meta.pangkat}` : ""}
      </span>
      {jenjangAnak && <span className="rounded-full bg-[#e4f8ec] px-2.5 py-0.5 text-[11px] font-black text-[#12904a]">Jenjangmu</span>}
    </div>
  );
}

function Jenjang({ lv, track, jenjangAnak, tantangan, peng, selesai, bahasa }: { lv: LevelId; track: TrackId; jenjangAnak: boolean; tantangan: boolean; peng: Record<string, Penguasaan>; selesai: Set<string>; bahasa: BahasaAnak }) {
  const unit = unitUntuk(track, lv, KOMPETENSI, bahasa);
  const [, m] = PLAY[TRACK_WARNA[track]];

  const isi =
    unit.length === 0 ? (
      <p className="rounded-[20px] bg-white/70 p-3.5 text-[14px] font-bold text-ink-3">Konten jenjang ini segera hadir.</p>
    ) : (
      <ol className="flex flex-col gap-4">
        {unit.map((u, i) => (
          <KartuUnit key={u.id} u={u} nomor={i + 1} peng={peng} selesai={selesai} warna={m} bahasa={bahasa} />
        ))}
      </ol>
    );

  if (!tantangan) {
    return (
      <section className="flex flex-col gap-3">
        <JudulJenjang lv={lv} jenjangAnak={jenjangAnak} />
        {isi}
      </section>
    );
  }

  return (
    <details className="group">
      <summary className="flex min-h-[64px] cursor-pointer list-none items-center gap-3 rounded-[22px] bg-white px-3.5 py-3 shadow-[0_4px_0_rgba(11,37,69,.08)] transition-transform active:scale-[.99] [&::-webkit-details-marker]:hidden">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(155deg,#c78bff,#8b45f5 65%)", boxShadow: "0 2px 0 #6421c9" }}>
          <Icon name="bolt" size={24} />
        </span>
        <span className="min-w-0 flex-1">
          <JudulJenjang lv={lv} jenjangAnak={false} />
          <span className="mt-0.5 block text-[12px] font-extrabold text-ink-3">Tantangan — ketuk untuk buka</span>
        </span>
        <Icon name="expand_more" size={28} className="shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3">{isi}</div>
    </details>
  );
}

/* ---------------- unit ---------------- */

function KartuUnit({ u, nomor, peng, selesai, warna, bahasa }: { u: UnitGrup; nomor: number; peng: Record<string, Penguasaan>; selesai: Set<string>; warna: string; bahasa: BahasaAnak }) {
  return (
    <li className="flex flex-col gap-3 rounded-[24px] bg-white p-3.5 shadow-[0_4px_0_rgba(11,37,69,.08)] sm:p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full text-white" style={{ background: warna, fontFamily: BALOO, fontSize: 22, fontWeight: 800, boxShadow: "0 3px 0 rgba(11,37,69,.15)" }}>
          {nomor}
        </span>
        <h3 className="min-w-0 flex-1 leading-tight" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, color: INK }}>
          {u.nama}
        </h3>
        <CincinProgres u={u} peng={peng} warna={warna} size={40} />
      </div>
      <ol className="flex flex-col gap-3">
        {u.kompetensi.map((c, i) => (
          <BarisKompetensi key={c.id} c={c} peng={peng} selesai={selesai} terakhir={i === u.kompetensi.length - 1} bahasa={bahasa} />
        ))}
      </ol>
    </li>
  );
}

function BarisKompetensi({ c, peng, selesai, terakhir, bahasa }: { c: Competency; peng: Record<string, Penguasaan>; selesai: Set<string>; terakhir: boolean; bahasa: BahasaAnak }) {
  const status = peng[c.id]?.status ?? "belum";
  const paket = paketKompetensi(c, bahasa);
  const quest = questUntuk(c.id);
  const prasyaratBelum = c.prereq.some((id) => (peng[id]?.status ?? "belum") === "belum");
  return (
    <li className={`flex flex-col gap-2 ${terakhir ? "" : "border-b border-[#fff0da] pb-3"}`}>
      <div className="flex items-start gap-2.5">
        <IkonStatus status={status} />
        <p className="min-w-0 flex-1 pt-[3px] text-[15px] leading-snug font-bold" style={{ color: INK }}>
          {c.statement[bahasa] ?? c.statement.id}
          {c.core && <span className="ml-1.5 inline-block rounded-full bg-[#fff4d1] px-2 py-px align-middle text-[11px] font-black text-[#b07a00]">inti</span>}
          {prasyaratBelum && <span aria-label="Ada kompetensi sebelumnya yang belum berkembang" title="Ada kompetensi sebelumnya yang belum berkembang" className="ml-1.5 inline-block size-2 rounded-full bg-[#c9bfd8] align-middle" />}
        </p>
      </div>
      {paket.length === 0 && quest.length === 0 ? (
        <span className="pl-[38px] text-[13px] font-extrabold text-[#b3a6c4]">Aktivitas segera</span>
      ) : (
        <div className="flex flex-col gap-2 sm:pl-[38px]">
          {paket.map((p) => (
            <TombolAktivitas key={p.id} p={p} selesai={selesai.has(p.id)} />
          ))}
          {quest.map((q) => (
            <Link
              key={q.toolId + q.competencyId}
              href={q.href}
              className="flex min-h-[60px] items-center gap-3 rounded-[18px] bg-white px-3 py-2 shadow-[0_4px_0_rgba(11,37,69,.08)] transition-transform active:scale-[.98]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full" style={{ background: "#e4e7f0", color: "#3a4670" }}>
                <Icon name="explore" size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800, color: INK }}>{q.judul[bahasa] ?? q.judul.id}</span>
                <span className="block text-[12px] font-extrabold text-ink-3">Quest · Dunia 3D</span>
              </span>
              <Icon name="play_arrow" size={26} className="text-[#fd861d]" />
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

/** Cincin: busur hijau (dikuasai) + kuning (berkembang) di atas abu. Tanpa angka; bintang bila semua dikuasai. */
export function CincinProgres({ u, peng, warna, size = 52 }: { u: UnitGrup; peng: Record<string, Penguasaan>; warna: string; size?: number }) {
  const n = u.kompetensi.length || 1;
  const dik = u.kompetensi.filter((k) => peng[k.id]?.status === "dikuasai").length;
  const ber = u.kompetensi.filter((k) => peng[k.id]?.status === "berkembang").length;
  const c = size / 2;
  const tebal = Math.max(5, Math.round(size * 0.135));
  const r = c - tebal / 2 - 1;
  const keliling = 2 * Math.PI * r;
  const segmen = (jumlah: number) => `${(jumlah / n) * keliling} ${keliling}`;
  const putar = (jumlah: number) => `rotate(${-90 + (jumlah / n) * 360} ${c} ${c})`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="shrink-0">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#fff0da" strokeWidth={tebal} />
      {ber > 0 && <circle cx={c} cy={c} r={r} fill="none" stroke="#ffbe0b" strokeWidth={tebal} strokeDasharray={segmen(ber)} transform={putar(dik)} strokeLinecap="round" />}
      {dik > 0 && <circle cx={c} cy={c} r={r} fill="none" stroke="#1fbf62" strokeWidth={tebal} strokeDasharray={segmen(dik)} transform={putar(0)} strokeLinecap="round" />}
      <text x={c} y={c} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.32} fill={warna} fontFamily="Material Symbols Rounded">
        {dik === u.kompetensi.length && dik > 0 ? "star" : ""}
      </text>
    </svg>
  );
}
