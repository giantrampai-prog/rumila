"use client";

// Peta Petualangan: satu layar Academy yang berjenjang.
// Kartu jenjang (posisi + target naik pangkat) → tombol Lanjut → chip pelajaran → jalur unit & misi → tangga 9 jenjang.
// Logika di src/lib/akademi/peta.ts; di sini hanya tampilan + naik jenjang otomatis.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LEVELS, levelIndex, type LevelId, type TrackId } from "@akademi/schema";
import { MascotBubble } from "@/components/kid";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { tintaPada } from "@/lib/brand";
import { PLAY } from "@/lib/catalog";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI, PAKET, setLevelAnak, useBahasaAnak, type BahasaAnak } from "@/lib/akademi/konten";
import { proyeksi } from "@/lib/akademi/mastery";
import { jenjangBerikut, paketMisi, petaJenjang, type MisiPeta, type PelajaranPeta, type UnitPeta } from "@/lib/akademi/peta";
import type { StatusLencana } from "@/lib/akademi/koleksi";
import type { Member } from "@/lib/store";
import { INK, TRACK_IKON, TRACK_SLICE, TRACK_WARNA, hitungStreak, levelMeta, trackMeta } from "./bersama";
import "../akademi.css";

const KARTU = "rounded-[24px] bg-white shadow-[0_4px_0_rgba(11,37,69,.08)]";
const KUNCI_RAYAKAN = (memberId: string, level: LevelId) => `rinoya-naik-${memberId}-${level}`;
/** Pola zig-zag jalur misi (persen lebar jalur). */
const ZIGZAG = [0, 18, 36, 18];

export function PetaPetualangan({ me, level, onHadiah }: { me: Member; level: LevelId; onHadiah: () => void }) {
  const events = useEvents(me.id);
  const bahasa = useBahasaAnak(me.id);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const peta = useMemo(() => petaJenjang(peng, KOMPETENSI, level, TRACK_SLICE), [peng, level]);
  const streak = useMemo(() => hitungStreak(events), [events]);
  const berikut = jenjangBerikut(level, KOMPETENSI);
  const nama = me.name.replace(/^(Kak|Dek) /, "");

  const [track, setTrack] = useState<TrackId | null>(null);
  const aktif = peta.pelajaran.find((p) => p.track === (track ?? peta.lanjut?.track)) ?? peta.pelajaran[0];

  // Naik jenjang otomatis: pangkat tercapai → jenjang berikutnya dibuka, perayaan tampil sekali.
  const [rayakan, setRayakan] = useState<{ dari: LevelId; ke: LevelId } | null>(null);
  useEffect(() => {
    if (!peta.tercapai || !berikut) return;
    try {
      if (localStorage.getItem(KUNCI_RAYAKAN(me.id, level))) return;
      localStorage.setItem(KUNCI_RAYAKAN(me.id, level), new Date().toISOString());
    } catch {}
    setRayakan({ dari: level, ke: berikut });
    setTrack(null);
    setLevelAnak(me.id, berikut);
  }, [peta.tercapai, berikut, me.id, level]);

  const lanjutPaket = peta.lanjut ? paketMisi(peta.lanjut.misi.kompetensi.id, PAKET, events, level) : undefined;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <MascotBubble>{nama}, ayo lanjut petualanganmu!</MascotBubble>
        <div className="flex items-center gap-2">
          <span className="flex h-11 items-center gap-1.5 rounded-full bg-white px-3.5 shadow-[0_3px_0_rgba(11,37,69,.08)]" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800, color: INK }} aria-label={`Rajin ${streak} hari`}>
            <span aria-hidden>🔥</span> {streak} hari
          </span>
          <button onClick={onHadiah} className="flex h-11 items-center gap-1.5 rounded-full bg-white px-3.5 text-[#a34a00] shadow-[0_3px_0_rgba(11,37,69,.08)] transition-transform active:scale-95" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800 }}>
            <Icon name="redeem" size={22} /> Hadiah
          </button>
        </div>
      </div>

      <KartuJenjang level={level} inti={peta.inti} tercapai={peta.tercapai} berikut={berikut} />

      {peta.lanjut && lanjutPaket && (
        <Link
          href={`/akademi/main/${lanjutPaket.id}`}
          className="flex items-center gap-3 rounded-[24px] px-4 py-3.5 text-[#0b2545] transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] active:scale-[.98]"
          style={{ background: "linear-gradient(155deg,#ffb347,#fd861d 60%)", boxShadow: "0 5px 0 #c85400" }}
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/85">
            <Icon name="play_arrow" size={36} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block leading-tight" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800 }}>
              {peta.lanjut.misi.ulang ? "Latihan ulang" : "Lanjut"}: {peta.lanjut.misi.kompetensi.unit.nama[bahasa] ?? peta.lanjut.misi.kompetensi.unit.nama.id}
            </span>
            <span className="mt-0.5 line-clamp-2 text-[14px] leading-snug font-extrabold opacity-85">
              {trackMeta(peta.lanjut.track).nama[bahasa] ?? trackMeta(peta.lanjut.track).nama.id} · {pernyataan(peta.lanjut.misi, bahasa)}
            </span>
          </span>
        </Link>
      )}

      {peta.pelajaran.length > 0 && aktif && (
        <section className="flex flex-col gap-3">
          <div role="tablist" aria-label="Pelajaran" className="flex flex-wrap gap-2">
            {peta.pelajaran.map((p) => (
              <ChipPelajaran key={p.track} p={p} on={p.track === aktif.track} bahasa={bahasa} onClick={() => setTrack(p.track)} />
            ))}
          </div>
          <Jalur pelajaran={aktif} bahasa={bahasa} events={events} level={level} />
        </section>
      )}

      <TanggaJenjang level={level} />

      {me.admin && (
        <div className="mt-1 flex justify-center">
          <Link href="/akademi/rapor" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-ink-3 shadow-[0_2px_0_rgba(11,37,69,.08)] transition-transform active:scale-95">
            <Icon name="assignment" size={18} /> Rapor untuk Ayah/Ibu
          </Link>
        </div>
      )}

      {rayakan && <Rayakan dari={rayakan.dari} ke={rayakan.ke} onTutup={() => setRayakan(null)} />}
    </>
  );
}

const pernyataan = (m: MisiPeta, bahasa: BahasaAnak) => m.kompetensi.statement[bahasa] ?? m.kompetensi.statement.id;

/* ---------------- kartu jenjang ---------------- */

function KartuJenjang({ level, inti, tercapai, berikut }: { level: LevelId; inti: { dikuasai: number; total: number }; tercapai: boolean; berikut?: LevelId }) {
  const lv = levelMeta(level);
  const sisa = inti.total - inti.dikuasai;
  const persen = inti.total ? Math.round((inti.dikuasai / inti.total) * 100) : 0;
  const nb = berikut ? levelMeta(berikut) : undefined;
  return (
    <section className={`${KARTU} flex flex-col gap-2.5 p-4`} aria-label="Jenjang kamu">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-extrabold text-ink-3">Jenjang kamu</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3d1] px-2.5 py-1 text-[13px] font-black text-[#7a5200]">
          <Icon name="military_tech" size={18} /> Target: pangkat {lv.pangkat}
        </span>
      </div>
      <h2 className="leading-tight" style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: INK }}>
        {lv.nama} · {lv.lokal}
      </h2>
      <div className="h-4 overflow-hidden rounded-full bg-[#fff0da]" role="progressbar" aria-valuemin={0} aria-valuemax={inti.total} aria-valuenow={inti.dikuasai} aria-label="Kemampuan inti dikuasai">
        <div className="anim-bar-x h-full rounded-full" style={{ width: `${Math.max(persen, inti.dikuasai ? 4 : 0)}%`, background: "linear-gradient(90deg,#1f94f0,#0567c2)" }} />
      </div>
      <p className="text-[15px] leading-snug font-bold text-ink-2">
        <b style={{ color: INK }}>
          {inti.dikuasai} dari {inti.total}
        </b>{" "}
        kemampuan inti dikuasai.{" "}
        {tercapai ? (
          nb ? (
            <>Hebat, kamu naik ke {nb.nama}!</>
          ) : (
            <>Semua selesai. Jenjang berikutnya segera hadir.</>
          )
        ) : nb ? (
          <>
            {sisa} lagi untuk meraih pangkat <b style={{ color: INK }}>{lv.pangkat}</b> dan naik ke {nb.lokal}.
          </>
        ) : (
          <>
            {sisa} lagi untuk meraih pangkat <b style={{ color: INK }}>{lv.pangkat}</b>.
          </>
        )}
      </p>
    </section>
  );
}

/* ---------------- chip pelajaran ---------------- */

function ChipPelajaran({ p, on, bahasa, onClick }: { p: PelajaranPeta; on: boolean; bahasa: BahasaAnak; onClick: () => void }) {
  const c = TRACK_WARNA[p.track];
  const [l, m, d] = PLAY[c];
  const meta = trackMeta(p.track);
  return (
    <button
      role="tab"
      aria-selected={on}
      onClick={onClick}
      className="flex h-12 items-center gap-1.5 rounded-full pr-4 pl-2 transition-transform active:scale-95"
      style={{
        fontFamily: BALOO,
        fontSize: 16,
        fontWeight: 800,
        color: on ? tintaPada(c) : INK,
        background: on ? `linear-gradient(155deg, ${l}, ${m} 65%)` : "#fff",
        boxShadow: on ? `0 4px 0 ${d}` : "0 3px 0 rgba(11,37,69,.08)",
      }}
    >
      <span className="flex size-8 items-center justify-center rounded-full" style={{ background: on ? "rgba(255,255,255,.3)" : `${l}55`, color: on ? undefined : d }}>
        <Icon name={TRACK_IKON[p.track]} size={20} />
      </span>
      {meta.nama[bahasa] ?? meta.nama.id}
      <span className="rounded-full px-1.5 text-[13px] tabular-nums" style={{ background: on ? "rgba(255,255,255,.35)" : "#fff0da" }}>
        {p.inti.dikuasai}/{p.inti.total}
      </span>
    </button>
  );
}

/* ---------------- jalur unit & misi ---------------- */

function Jalur({ pelajaran, bahasa, events, level }: { pelajaran: PelajaranPeta; bahasa: BahasaAnak; events: ReturnType<typeof useEvents>; level: LevelId }) {
  const [kunci, setKunci] = useState<string | null>(null);
  useEffect(() => setKunci(null), [pelajaran.track]);
  let nomor = 0;
  return (
    <div className="flex flex-col gap-4">
      {pelajaran.unit.map((u, i) => {
        const terkunci = u.misi.every((m) => !m.terbuka && m.status === "belum");
        return (
          <div key={u.id} className={`${KARTU} p-4`}>
            <KepalaUnit u={u} nomor={i + 1} bahasa={bahasa} terkunci={terkunci} />
            <ol className="mt-3 flex max-w-[720px] flex-col gap-2.5">
              {u.misi.map((m) => {
                const geser = ZIGZAG[nomor++ % ZIGZAG.length];
                const paket = m.terbuka || m.status !== "belum" ? paketMisi(m.kompetensi.id, PAKET, events, level) : undefined;
                return (
                  <li key={m.kompetensi.id} className="flex items-center gap-3" style={{ paddingLeft: `${geser}%` }}>
                    <TitikMisi m={m} track={pelajaran.track} href={paket ? `/akademi/main/${paket.id}` : undefined} onKunci={() => setKunci(m.kompetensi.id)} />
                    <span className="min-w-0 flex-1">
                      {m.sekarang && <span className="mb-0.5 block text-[12px] font-black tracking-wide text-[#0567c2] uppercase">Kamu di sini</span>}
                      <span className={`line-clamp-2 text-[14px] leading-snug font-extrabold ${m.terbuka || m.status !== "belum" ? "text-ink-2" : "text-ink-3"}`}>{pernyataan(m, bahasa)}</span>
                      {kunci === m.kompetensi.id && <span className="mt-1 block text-[12px] font-extrabold text-[#a34a00]">Selesaikan misi sebelumnya dulu, ya.</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

const WARNA_LENCANA: Record<StatusLencana, { bg: string; fg: string; label: string }> = {
  emas: { bg: "#fdb724", fg: "#0b2545", label: "Lencana emas" },
  perak: { bg: "#d5dde8", fg: "#0b2545", label: "Lencana perak" },
  perunggu: { bg: "#e7a46a", fg: "#0b2545", label: "Lencana perunggu" },
  terkunci: { bg: "#fff0da", fg: "#5b6b85", label: "Lencana belum didapat" },
};

function KepalaUnit({ u, nomor, bahasa, terkunci }: { u: UnitPeta; nomor: number; bahasa: BahasaAnak; terkunci: boolean }) {
  const w = WARNA_LENCANA[u.lencana];
  const selesai = u.misi.filter((m) => m.status === "dikuasai").length;
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px]" style={{ background: w.bg, color: w.fg }} aria-label={w.label} title={w.label}>
        <Icon name={terkunci ? "lock" : "workspace_premium"} size={26} />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-[12px] font-extrabold text-ink-3">
          Unit {nomor} · {selesai}/{u.misi.length} misi
        </span>
        <span className="block truncate" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, color: INK }}>
          {u.nama[bahasa] ?? u.nama.id}
        </span>
      </div>
    </div>
  );
}

function TitikMisi({ m, track, href, onKunci }: { m: MisiPeta; track: TrackId; href?: string; onKunci: () => void }) {
  const c = TRACK_WARNA[track];
  const [l, mm, d] = PLAY[c];
  const ukuran = m.sekarang ? 68 : 58;
  let gaya: React.CSSProperties;
  let ikon: string;
  let label: string;
  if (m.status === "dikuasai") {
    gaya = { background: "linear-gradient(155deg,#ffe46b,#fdb724 65%)", boxShadow: "0 4px 0 #c88a00", color: INK };
    ikon = "star";
    label = "Dikuasai";
  } else if (m.sekarang) {
    gaya = { background: `linear-gradient(155deg, ${l}, ${mm} 65%)`, boxShadow: `0 5px 0 ${d}`, color: tintaPada(c) };
    ikon = "play_arrow";
    label = "Mainkan misi sekarang";
  } else if (m.status === "berkembang") {
    gaya = { background: "#fff", border: `4px solid ${mm}`, boxShadow: "0 4px 0 rgba(11,37,69,.1)", color: d };
    ikon = "trending_up";
    label = "Sedang dilatih";
  } else if (m.terbuka) {
    gaya = { background: "#fff", boxShadow: "0 4px 0 rgba(11,37,69,.1)", color: d };
    ikon = "play_arrow";
    label = "Siap dimainkan";
  } else {
    gaya = { background: "#fff0da", boxShadow: "0 3px 0 rgba(11,37,69,.06)", color: "#5b6b85" };
    ikon = "lock";
    label = "Terkunci";
  }
  const isi = (
    <>
      {m.sekarang && <span aria-hidden className="akademi-denyut absolute inset-0 rounded-full" />}
      <Icon name={ikon} size={m.sekarang ? 38 : 30} />
      {m.ulang && (
        <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-white text-[#0567c2] shadow-[0_2px_0_rgba(11,37,69,.15)]" title="Waktunya latihan ulang">
          <Icon name="refresh" size={16} />
        </span>
      )}
    </>
  );
  const kelas = "relative flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-90";
  const ukuranGaya = { width: ukuran, height: ukuran, ...gaya };
  return href ? (
    <Link href={href} aria-label={`${label}: ${m.kompetensi.statement.id}`} className={kelas} style={ukuranGaya}>
      {isi}
    </Link>
  ) : (
    <button type="button" onClick={onKunci} aria-label={`${label}: ${m.kompetensi.statement.id}`} className={kelas} style={ukuranGaya}>
      {isi}
    </button>
  );
}

/* ---------------- tangga jenjang ---------------- */

function TanggaJenjang({ level }: { level: LevelId }) {
  const ada = useMemo(() => new Set(KOMPETENSI.map((c) => c.level)), []);
  const idx = levelIndex(level);
  return (
    <section className={`${KARTU} p-4`} aria-label="Tangga jenjang">
      <h2 style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, color: INK }}>Tangga jenjang</h2>
      <ol className="mt-2.5 flex flex-col gap-1.5">
        {LEVELS.map((lv) => {
          const i = levelIndex(lv.id);
          const lewat = i < idx;
          const kini = lv.id === level;
          const segera = !ada.has(lv.id);
          return (
            <li key={lv.id} className={`flex items-center gap-2.5 rounded-[14px] px-2.5 py-1.5 ${kini ? "bg-[#e3f1fd]" : ""}`}>
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full"
                style={lewat ? { background: "#fdb724", color: INK } : kini ? { background: "#0567c2", color: "#fff" } : { background: "#fff0da", color: "#5b6b85" }}
              >
                <Icon name={lewat ? "check" : kini ? "flag" : segera ? "hourglass_empty" : "lock"} size={18} />
              </span>
              <span className="min-w-0 flex-1 text-[14px] leading-tight font-extrabold" style={{ color: kini ? INK : "#4a5a75" }}>
                {lv.nama} · {lv.lokal}
                <span className="block text-[12px] font-bold text-ink-3">
                  Pangkat {lv.pangkat}
                  {kini ? " · kamu di sini" : segera ? " · segera hadir" : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------------- perayaan naik jenjang ---------------- */

function Rayakan({ dari, ke, onTutup }: { dari: LevelId; ke: LevelId; onTutup: () => void }) {
  const a = levelMeta(dari);
  const b = levelMeta(ke);
  return (
    <div className="anim-fade fixed inset-0 z-50 flex items-center justify-center bg-[#0b2545]/45 p-4" role="dialog" aria-modal="true" aria-label="Naik pangkat">
      <div className="akademi-pop flex w-full max-w-[420px] flex-col items-center gap-3 rounded-[28px] bg-white p-6 text-center shadow-[0_8px_0_rgba(11,37,69,.15)]">
        <span className="flex size-20 items-center justify-center rounded-full text-[#0b2545]" style={{ background: "linear-gradient(155deg,#ffe46b,#fdb724 65%)", boxShadow: "0 5px 0 #c88a00" }}>
          <Icon name="military_tech" size={48} />
        </span>
        <h2 style={{ fontFamily: BALOO, fontSize: 28, fontWeight: 800, color: INK, lineHeight: 1.05 }}>Naik pangkat!</h2>
        <p className="text-[15px] leading-snug font-bold text-ink-2">
          Semua kemampuan inti {a.nama} sudah dikuasai. Pangkat <b style={{ color: INK }}>{a.pangkat}</b> tercapai, dan petualangan <b style={{ color: INK }}>{b.nama} · {b.lokal}</b> sekarang terbuka.
        </p>
        <Link href={`/akademi/sertifikat/${dari}`} className="flex h-12 w-full items-center justify-center gap-1.5 rounded-[16px] bg-white text-[#0567c2] shadow-[0_4px_0_rgba(11,37,69,.12)]" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800 }}>
          <Icon name="workspace_premium" size={24} /> Ambil sertifikat
        </Link>
        <button onClick={onTutup} className="flex h-12 w-full items-center justify-center gap-1.5 rounded-[16px] text-white" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, background: "linear-gradient(155deg,#1f94f0,#0567c2 60%)", boxShadow: "0 4px 0 #04509a" }}>
          <Icon name="rocket_launch" size={24} /> Mulai {b.lokal}
        </button>
      </div>
    </div>
  );
}
