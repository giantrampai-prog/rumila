"use client";

// Tab "Koleksi": stiker (paket yang pernah selesai), lencana unit (perunggu/perak/emas), pangkat jenjang (Tunas/Kadet/Navigator).
// Tanpa angka nilai/peringkat — anak 3–6 tahun. Konfeti ringan saat ada stiker baru sejak terakhir dibuka.

import { tintaPada } from "@/lib/brand";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LevelId, TrackId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { judulPaket } from "@/components/akademi/runner";
import { PLAY } from "@/lib/catalog";
import { useEvents } from "@/lib/akademi/jejak";
import { lencana, pangkat, stiker, type Lencana, type Pangkat, type StatusLencana, type Stiker } from "@/lib/akademi/koleksi";
import { KOMPETENSI, PAKET, paketById } from "@/lib/akademi/konten";
import { proyeksi } from "@/lib/akademi/mastery";
import type { Member } from "@/lib/store";
import { IkonMekanik, INK, LEVEL_SLICE, TRACK_IKON, TRACK_SLICE, TRACK_WARNA, labelMekanik, levelMeta, trackMeta } from "./bersama";
import { unitUntuk } from "./track";

const KUNCI_KOLEKSI = (memberId: string) => `rumila-akademi-koleksi-${memberId}`;
const KARTU = "rounded-[22px] bg-white shadow-[0_4px_0_rgba(11,37,69,.08)]";

const LENCANA_WARNA: Record<StatusLencana, { bg: string; tepi: string; fg: string; label: string }> = {
  terkunci: { bg: "#fff0da", tepi: "#f0e4d2", fg: "#b3a6c4", label: "Terkunci" },
  perunggu: { bg: "#cd7f32", tepi: "#a9652a", fg: "#fff", label: "Perunggu" },
  perak: { bg: "#b8c0cc", tepi: "#8f99a8", fg: "#fff", label: "Perak" },
  emas: { bg: "#f2b705", tepi: "#c99200", fg: "#fff", label: "Emas" },
};

function bacaJumlah(memberId: string): number | null {
  try {
    const raw = localStorage.getItem(KUNCI_KOLEKSI(memberId));
    if (!raw) return null;
    const v = JSON.parse(raw) as { stiker?: unknown };
    return typeof v?.stiker === "number" ? v.stiker : null;
  } catch {
    return null;
  }
}
function simpanJumlah(memberId: string, n: number) {
  try {
    localStorage.setItem(KUNCI_KOLEKSI(memberId), JSON.stringify({ stiker: n }));
  } catch {}
}

export function Koleksi({ me, level, onKeMisi }: { me: Member; level: LevelId; onKeMisi?: () => void }) {
  const events = useEvents(me.id);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const daftarStiker = useMemo(() => stiker(events, PAKET), [events]);
  const daftarLencana = useMemo(() => lencana(peng, KOMPETENSI), [peng]);
  const daftarPangkat = useMemo(() => pangkat(peng, KOMPETENSI), [peng]);

  // Stiker baru sejak terakhir dibuka → konfeti + sorot. Jumlah terakhir disimpan per anak.
  const [baru, setBaru] = useState(0);
  useEffect(() => {
    const n = daftarStiker.length;
    const lama = bacaJumlah(me.id);
    if (lama !== null && n > lama) setBaru(n - lama);
    simpanJumlah(me.id, n);
  }, [me.id, daftarStiker.length]);
  useEffect(() => {
    if (!baru) return;
    const t = setTimeout(() => setBaru(0), 2600);
    return () => clearTimeout(t);
  }, [baru]);

  return (
    <>
      {baru > 0 && <Konfeti />}

      <section className="flex flex-col gap-3">
        <Judul ikon="star" teks="Stiker" sub={daftarStiker.length ? "Setiap misi yang kamu selesaikan jadi stiker" : undefined} />
        {daftarStiker.length === 0 ? (
          <AjakanStiker onKeMisi={onKeMisi} />
        ) : (
          <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {daftarStiker.map((s, i) => (
              <KartuStiker key={s.paketId} s={s} baru={i < baru} />
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <Judul ikon="military_tech" teks="Lencana" sub="Kuasai satu unit untuk dapat lencana emas" />
        {TRACK_SLICE.map((t) => (
          <LencanaTrack key={t} track={t} semua={daftarLencana} />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <Judul ikon="emoji_events" teks="Pangkat" sub="Naik pangkat saat semua kompetensi inti jenjang dikuasai" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {daftarPangkat.map((p) => (
            <KartuPangkat key={p.level} p={p} jenjangAnak={p.level === level} />
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------------- potongan ---------------- */

function Judul({ ikon, teks, sub }: { ikon: string; teks: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon name={ikon} size={24} style={{ color: "#0567c2" }} />
      <h2 className="leading-none" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK }}>
        {teks}
      </h2>
      {sub && <span className="hidden text-[12px] font-extrabold text-ink-3 sm:inline">· {sub}</span>}
    </div>
  );
}

function Konfeti() {
  const potongan = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${4 + ((i * 53) % 92)}%`,
        top: `${6 + ((i * 29) % 40)}%`,
        delay: `${(i % 6) * 70}ms`,
        warna: ["#ffbe0b", "#fd861d", "#1fbf62", "#0786eb", "#ff5fa2", "#2bc4ff"][i % 6],
        putar: `${(i * 37) % 360}deg`,
        bulat: i % 3 === 0,
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {potongan.map((k, i) => (
        <span
          key={i}
          className="akademi-pop absolute block"
          style={{
            left: k.left,
            top: k.top,
            width: k.bulat ? 12 : 9,
            height: k.bulat ? 12 : 16,
            borderRadius: k.bulat ? 999 : 3,
            background: k.warna,
            transform: `rotate(${k.putar})`,
            animationDelay: k.delay,
            boxShadow: "0 2px 0 rgba(11,37,69,.12)",
          }}
        />
      ))}
      <span className="akademi-pop absolute left-1/2 top-[18%] -translate-x-1/2 rounded-full bg-white px-5 py-2.5" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK, boxShadow: "0 4px 0 rgba(11,37,69,.12)" }}>
        🎉 Stiker baru!
      </span>
    </div>
  );
}

function AjakanStiker({ onKeMisi }: { onKeMisi?: () => void }) {
  return (
    <div className={`${KARTU} flex flex-col items-center gap-3 p-5 text-center`}>
      <span className="flex size-20 items-center justify-center rounded-full" style={{ background: "#fff4d1", color: "#f2b705" }}>
        <Icon name="star" size={44} />
      </span>
      <p className="max-w-[280px] leading-tight" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>
        Mainkan satu misi untuk stiker pertamamu
      </p>
      <Link
        href="/akademi"
        onClick={(e) => {
          if (!onKeMisi) return;
          e.preventDefault();
          onKeMisi();
        }}
        className="flex h-14 min-w-[200px] items-center justify-center gap-1.5 rounded-[18px] px-6 text-[#0b2545] transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] active:scale-[.96]"
        style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, background: "linear-gradient(155deg,#ffb347,#fd861d 60%)", boxShadow: "0 4px 0 #c85400" }}
      >
        <Icon name="play_arrow" size={26} /> Ke peta
      </Link>
    </div>
  );
}

function KartuStiker({ s, baru }: { s: Stiker; baru: boolean }) {
  const p = paketById(s.paketId);
  if (!p) return null;
  return (
    <li className={baru ? "akademi-pop" : ""}>
      <Link href={`/akademi/main/${p.id}`} className={`${KARTU} flex min-h-[132px] flex-col items-center gap-1.5 px-2 pt-3 pb-2.5 transition-transform active:scale-95`} style={baru ? { boxShadow: "0 4px 0 rgba(11,37,69,.08), 0 0 0 3px #ffe46b" } : undefined}>
        <span className="relative">
          <span className="flex size-[72px] items-center justify-center rounded-full" style={{ background: "linear-gradient(155deg,#ffe46b,#ffbe0b 65%)", boxShadow: "0 3px 0 #d99400" }}>
            <IkonMekanik mekanik={p.mechanic} size={56} />
          </span>
          {s.kali > 1 && (
            <span aria-label={`${s.kali} kali`} className="absolute -right-1.5 -bottom-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#0567c2] px-1.5 text-white" style={{ fontFamily: BALOO, fontSize: 14, fontWeight: 900, boxShadow: "0 2px 0 #0567c2" }}>
              ×{s.kali}
            </span>
          )}
        </span>
        <span className="line-clamp-2 w-full text-center text-[13px] leading-tight font-extrabold" style={{ color: INK }}>
          {judulPaket(p)}
        </span>
        <span className="text-[11px] font-extrabold text-ink-3">{labelMekanik(p.mechanic)}</span>
      </Link>
    </li>
  );
}

function LencanaTrack({ track, semua }: { track: TrackId; semua: Lencana[] }) {
  const t = trackMeta(track);
  const [l, m, d] = PLAY[TRACK_WARNA[track]];
  const tinta = tintaPada(TRACK_WARNA[track]);
  const baris = LEVEL_SLICE.map((lv) => ({ lv, unit: unitUntuk(track, lv) })).filter((b) => b.unit.length > 0);
  const statusDari = (lv: LevelId, unitId: string) => semua.find((x) => x.track === track && x.level === lv && x.unitId === unitId)?.status ?? "terkunci";
  return (
    <div className={`${KARTU} flex flex-col gap-3 p-3.5`}>
      <div className="flex items-center gap-2.5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full" style={{ color: tinta, background: `linear-gradient(155deg, ${l}, ${m} 65%)`, boxShadow: `0 2px 0 ${d}` }}>
          <Icon name={TRACK_IKON[track]} size={24} />
        </span>
        <h3 className="min-w-0 flex-1 leading-tight" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, color: INK }}>
          {t.nama.id}
        </h3>
      </div>
      {baris.length === 0 ? (
        <p className="text-[13px] font-extrabold text-ink-3">Lencana segera hadir.</p>
      ) : (
        baris.map(({ lv, unit }) => (
          <div key={lv} className="flex flex-col gap-1.5">
            <span className="text-[12px] font-extrabold text-ink-3">
              {levelMeta(lv).nama} · {levelMeta(lv).lokal}
            </span>
            <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
              {unit.map((u) => (
                <li key={u.id} className="shrink-0">
                  <KoinLencana track={track} nama={u.nama} status={statusDari(lv, u.id)} />
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

function KoinLencana({ track, nama, status }: { track: TrackId; nama: string; status: StatusLencana }) {
  const w = LENCANA_WARNA[status];
  const terkunci = status === "terkunci";
  return (
    <Link href={`/akademi/pelajaran/${track}`} aria-label={`${nama}: ${w.label}`} className="flex w-[88px] flex-col items-center gap-1.5 rounded-[16px] py-1.5 transition-transform active:scale-95">
      <span
        className="flex size-16 items-center justify-center rounded-full"
        style={{
          background: terkunci ? w.bg : `radial-gradient(circle at 35% 30%, #ffffffaa, transparent 45%), ${w.bg}`,
          color: w.fg,
          boxShadow: `0 3px 0 ${w.tepi}, inset 0 0 0 3px ${w.tepi}55`,
          filter: status === "emas" ? "drop-shadow(0 0 6px #f2b70588)" : undefined,
        }}
      >
        <Icon name={terkunci ? "lock" : "military_tech"} size={terkunci ? 26 : 34} />
      </span>
      <span className="line-clamp-2 w-full text-center text-[11px] leading-tight font-extrabold" style={{ color: terkunci ? "#b3a6c4" : INK }}>
        {nama}
      </span>
    </Link>
  );
}

function KartuPangkat({ p, jenjangAnak }: { p: Pangkat; jenjangAnak: boolean }) {
  const meta = levelMeta(p.level);
  const [l, m, d] = PLAY[p.tercapai ? "gold" : "blue"];
  return (
    <article
      className={`${KARTU} relative flex items-center gap-3 overflow-hidden p-3.5 ${p.tercapai ? "akademi-pop" : ""}`}
      style={p.tercapai ? { boxShadow: `0 4px 0 ${d}, 0 0 0 3px #ffe46b, 0 0 24px #f2b70566` } : undefined}
    >
      {p.tercapai && <span aria-hidden className="absolute -right-8 -top-10 size-28 rounded-full" style={{ background: `${l}55` }} />}
      <CincinPangkat progres={p.progres} tercapai={p.tercapai} warna={[l, m, d]} />
      <div className="relative min-w-0 flex-1">
        <p className="leading-none" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK }}>
          {p.nama} {p.tercapai && <span aria-label="Tercapai">🎖️</span>}
        </p>
        <p className="mt-1 text-[13px] font-extrabold text-ink-3">
          {meta.nama} · {meta.lokal}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {jenjangAnak && <span className="rounded-full bg-[#e4f8ec] px-2.5 py-0.5 text-[11px] font-black text-[#12904a]">Jenjangmu</span>}
          {p.tercapai ? (
            <span className="rounded-full bg-[#fff4d1] px-2.5 py-0.5 text-[11px] font-black text-[#b07a00]">Tercapai</span>
          ) : p.progres > 0 ? (
            <span className="rounded-full bg-[#e3f1fd] px-2.5 py-0.5 text-[11px] font-black text-[#0567c2]">Sedang dikejar</span>
          ) : null}
        </div>
        {p.tercapai && (
          <Link href={`/akademi/sertifikat/${p.level}`} className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[#0b2545] transition-transform active:scale-95" style={{ fontFamily: BALOO, fontSize: 14, fontWeight: 800, background: "linear-gradient(155deg,#ffb347,#fd861d 60%)", boxShadow: "0 3px 0 #c85400" }}>
            Lihat sertifikat 🎓
          </Link>
        )}
      </div>
    </article>
  );
}

/** Cincin progres tanpa angka: busur berwarna di atas abu; bintang bila tercapai. */
function CincinPangkat({ progres, tercapai, warna, size = 64 }: { progres: number; tercapai: boolean; warna: [string, string, string]; size?: number }) {
  const [, m, d] = warna;
  const c = size / 2;
  const tebal = 8;
  const r = c - tebal / 2 - 1;
  const keliling = 2 * Math.PI * r;
  const isi = Math.max(0, Math.min(1, progres)) * keliling;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="relative shrink-0">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#fff0da" strokeWidth={tebal} />
      {isi > 0 && <circle cx={c} cy={c} r={r} fill="none" stroke={tercapai ? "#f2b705" : m} strokeWidth={tebal} strokeDasharray={`${isi} ${keliling}`} transform={`rotate(-90 ${c} ${c})`} strokeLinecap="round" />}
      <text x={c} y={c + 1} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.42} fill={tercapai ? d : "#c9bfd8"} fontFamily="Material Symbols Rounded">
        {tercapai ? "star" : "military_tech"}
      </text>
    </svg>
  );
}
