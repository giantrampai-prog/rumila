"use client";

// Peta Petualangan: satu jalur misi BERURUTAN per jenjang (Misi 1, 2, 3, …), tanpa lompat.
// Kartu jenjang → tombol Lanjut (selalu misi "kamu di sini") → jalur unit & misi → Gerbang Naik Pangkat → tangga 9 jenjang.
// Logika di src/lib/akademi/peta.ts; di sini hanya tampilan + naik jenjang otomatis.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LEVELS, levelIndex, type LevelId } from "@akademi/schema";
import { MascotBubble } from "@/components/kid";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { tintaPada } from "@/lib/brand";
import { PLAY } from "@/lib/catalog";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI, PAKET, setLevelAnak, useBahasaAnak, type BahasaAnak } from "@/lib/akademi/konten";
import { proyeksi } from "@/lib/akademi/mastery";
import { jenjangBerikut, kompetensiSelesai, paketMisi, petaJenjang, type MisiPeta, type PetaJenjang, type UnitPeta } from "@/lib/akademi/peta";
import type { StatusLencana } from "@/lib/akademi/koleksi";
import type { Member } from "@/lib/store";
import { INK, TRACK_IKON, TRACK_SLICE, TRACK_WARNA, hitungStreak, levelMeta, trackMeta } from "./bersama";
import "../akademi.css";

const KARTU = "rounded-[24px] bg-white shadow-[0_4px_0_rgba(11,37,69,.08)]";
const KUNCI_RAYAKAN = (memberId: string, level: LevelId) => `rinoya-naik-${memberId}-${level}`;
/** Pola zig-zag jalur misi (persen lebar jalur). */
const ZIGZAG = [0, 9, 18, 9];
const BIRU = { l: "#4fb3ff", m: "#0786eb", d: "#0567c2" };

type Events = ReturnType<typeof useEvents>;

export function PetaPetualangan({ me, level, onHadiah }: { me: Member; level: LevelId; onHadiah: () => void }) {
  const events = useEvents(me.id);
  const bahasa = useBahasaAnak(me.id);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const selesaiSet = useMemo(() => kompetensiSelesai(events, PAKET), [events]);
  const peta = useMemo(() => petaJenjang(peng, selesaiSet, KOMPETENSI, level, TRACK_SLICE), [peng, selesaiSet, level]);
  const streak = useMemo(() => hitungStreak(events), [events]);
  const berikut = jenjangBerikut(level, KOMPETENSI);
  const nama = me.name.replace(/^(Kak|Dek) /, "");

  // Naik jenjang otomatis: pangkat tercapai → jenjang berikutnya dibuka, perayaan tampil sekali.
  const [rayakan, setRayakan] = useState<{ dari: LevelId; ke: LevelId } | null>(null);
  useEffect(() => {
    if (!peta.tercapai || !berikut) return;
    try {
      if (localStorage.getItem(KUNCI_RAYAKAN(me.id, level))) return;
      localStorage.setItem(KUNCI_RAYAKAN(me.id, level), new Date().toISOString());
    } catch {}
    setRayakan({ dari: level, ke: berikut });
    setLevelAnak(me.id, berikut);
  }, [peta.tercapai, berikut, me.id, level]);

  const target = peta.sekarang ?? peta.pemantapan;
  const targetPaket = target ? paketMisi(target.kompetensi.id, PAKET, events, level) : undefined;

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

      <KartuJenjang peta={peta} berikut={berikut} />

      {target && targetPaket && (
        <Link
          href={`/akademi/main/${targetPaket.id}`}
          className="flex items-center gap-3 rounded-[24px] px-4 py-3.5 text-[#0b2545] transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] active:scale-[.98]"
          style={{ background: "linear-gradient(155deg,#ffb347,#fd861d 60%)", boxShadow: "0 5px 0 #c85400" }}
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/85">
            <Icon name="play_arrow" size={36} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block leading-tight" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800 }}>
              {peta.sekarang ? `Lanjut Misi ${target.nomor}` : "Latihan pemantapan"}
            </span>
            <span className="mt-0.5 line-clamp-2 text-[14px] leading-snug font-extrabold opacity-85">
              {namaPelajaran(target, bahasa)} · {pernyataan(target, bahasa)}
            </span>
          </span>
        </Link>
      )}

      <div className="flex flex-col gap-4">
        {peta.unit.map((u) => (
          <KartuUnit key={`${u.track}-${u.id}`} u={u} bahasa={bahasa} events={events} level={level} sekarang={peta.sekarang} />
        ))}
        <Gerbang peta={peta} berikut={berikut} />
      </div>

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
const namaPelajaran = (m: MisiPeta, bahasa: BahasaAnak) => trackMeta(m.kompetensi.track).nama[bahasa] ?? trackMeta(m.kompetensi.track).nama.id;

/* ---------------- kartu jenjang ---------------- */

function KartuJenjang({ peta, berikut }: { peta: PetaJenjang; berikut?: LevelId }) {
  const lv = levelMeta(peta.level);
  const persen = peta.total ? Math.round((peta.selesai / peta.total) * 100) : 0;
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
      <div className="h-4 overflow-hidden rounded-full bg-[#fff0da]" role="progressbar" aria-valuemin={0} aria-valuemax={peta.total} aria-valuenow={peta.selesai} aria-label="Misi selesai">
        <div className="anim-bar-x h-full rounded-full" style={{ width: `${Math.max(persen, peta.selesai ? 4 : 0)}%`, background: "linear-gradient(90deg,#1f94f0,#0567c2)" }} />
      </div>
      <p className="text-[15px] leading-snug font-bold text-ink-2">
        <b style={{ color: INK }}>
          Misi {peta.selesai} dari {peta.total}
        </b>{" "}
        selesai.{" "}
        {peta.tercapai
          ? berikut
            ? `Pangkat ${lv.pangkat} tercapai!`
            : "Semua selesai. Jenjang berikutnya segera hadir."
          : `Selesaikan semua misi berurutan, lalu lewati Gerbang Naik Pangkat${berikut ? ` menuju ${levelMeta(berikut).lokal}` : ""}.`}
      </p>
    </section>
  );
}

/* ---------------- jalur unit & misi ---------------- */

const WARNA_LENCANA: Record<StatusLencana, { bg: string; fg: string; label: string }> = {
  emas: { bg: "#fdb724", fg: "#0b2545", label: "Lencana emas" },
  perak: { bg: "#d5dde8", fg: "#0b2545", label: "Lencana perak" },
  perunggu: { bg: "#e7a46a", fg: "#0b2545", label: "Lencana perunggu" },
  terkunci: { bg: "#fff0da", fg: "#5b6b85", label: "Lencana belum didapat" },
};

function KartuUnit({ u, bahasa, events, level, sekarang }: { u: UnitPeta; bahasa: BahasaAnak; events: Events; level: LevelId; sekarang?: MisiPeta }) {
  const [kunci, setKunci] = useState<number | null>(null);
  const c = TRACK_WARNA[u.track];
  const [l, m, d] = PLAY[c];
  const w = WARNA_LENCANA[u.lencana];
  const selesai = u.misi.filter((x) => x.selesai).length;
  const semuaKunci = u.misi.every((x) => x.terkunci);
  return (
    <section className={`${KARTU} p-4 ${semuaKunci ? "opacity-75" : ""}`} aria-label={`${trackMeta(u.track).nama.id} unit ${u.ke}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px]" style={{ background: `linear-gradient(155deg, ${l}, ${m} 65%)`, boxShadow: `0 3px 0 ${d}`, color: tintaPada(c) }}>
          <Icon name={TRACK_IKON[u.track]} size={28} />
        </span>
        <div className="min-w-0 flex-1">
          <span className="block text-[12px] font-extrabold text-ink-3">
            {trackMeta(u.track).nama[bahasa] ?? trackMeta(u.track).nama.id} · Unit {u.ke} · {selesai}/{u.misi.length} misi
          </span>
          <span className="block leading-tight" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, color: INK }}>
            {u.nama[bahasa] ?? u.nama.id}
          </span>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full" style={{ background: w.bg, color: w.fg }} aria-label={w.label} title={w.label}>
          <Icon name="workspace_premium" size={22} />
        </span>
      </div>
      <ol className="mt-3 flex max-w-[720px] flex-col gap-2.5">
        {u.misi.map((x) => {
          const href = !x.terkunci ? paketMisi(x.kompetensi.id, PAKET, events, level) : undefined;
          return (
            <li key={x.kompetensi.id} className="flex items-center gap-3" style={{ paddingLeft: `${ZIGZAG[(x.nomor - 1) % ZIGZAG.length]}%` }}>
              <TitikMisi m={x} href={href ? `/akademi/main/${href.id}` : undefined} onKunci={() => setKunci(x.nomor)} />
              <span className="min-w-0 flex-1">
                <span className={`block text-[12px] font-black tracking-wide uppercase ${x.sekarang ? "text-[#0567c2]" : "text-ink-3"}`}>
                  Misi {x.nomor}
                  {x.sekarang ? " · Kamu di sini" : x.selesai ? " · Selesai" : ""}
                </span>
                <span className={`line-clamp-2 text-[14px] leading-snug font-extrabold ${x.terkunci ? "text-ink-3" : "text-ink-2"}`}>{pernyataan(x, bahasa)}</span>
                {kunci === x.nomor && sekarang && <span className="mt-1 block text-[12px] font-extrabold text-[#a34a00]">Selesaikan Misi {sekarang.nomor} dulu, ya.</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function TitikMisi({ m, href, onKunci }: { m: MisiPeta; href?: string; onKunci: () => void }) {
  const ukuran = m.sekarang ? 70 : 56;
  const gaya: React.CSSProperties = m.selesai
    ? { background: "linear-gradient(155deg,#ffe46b,#fdb724 65%)", boxShadow: "0 4px 0 #c88a00", color: INK }
    : m.sekarang
      ? { background: `linear-gradient(155deg, ${BIRU.l}, ${BIRU.m} 65%)`, boxShadow: `0 5px 0 ${BIRU.d}`, color: "#fff" }
      : { background: "#f3ece1", boxShadow: "0 3px 0 rgba(11,37,69,.08)", color: "#5b6b85" };
  const ikon = m.selesai ? "star" : m.sekarang ? "play_arrow" : "lock";
  const label = `Misi ${m.nomor}, ${m.selesai ? "selesai, main lagi" : m.sekarang ? "mainkan sekarang" : "terkunci"}`;
  const isi = (
    <>
      {m.sekarang && <span aria-hidden className="akademi-denyut absolute inset-0 rounded-full" />}
      <Icon name={ikon} size={m.sekarang ? 40 : 28} />
    </>
  );
  const kelas = "relative flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-90";
  const gayaPenuh = { width: ukuran, height: ukuran, ...gaya };
  return href ? (
    <Link href={href} aria-label={label} className={kelas} style={gayaPenuh}>
      {isi}
    </Link>
  ) : (
    <button type="button" onClick={onKunci} aria-label={label} className={kelas} style={gayaPenuh}>
      {isi}
    </button>
  );
}

/* ---------------- gerbang naik pangkat ---------------- */

function Gerbang({ peta, berikut }: { peta: PetaJenjang; berikut?: LevelId }) {
  const lv = levelMeta(peta.level);
  const terbuka = !peta.sekarang;
  const sisa = peta.inti.total - peta.inti.dikuasai;
  return (
    <section
      className={`${KARTU} flex items-center gap-3 p-4`}
      style={peta.tercapai ? { boxShadow: "0 4px 0 #c88a00, 0 0 0 3px #ffe46b" } : undefined}
      aria-label="Gerbang naik pangkat"
    >
      <span
        className="flex size-16 shrink-0 items-center justify-center rounded-[20px]"
        style={peta.tercapai ? { background: "linear-gradient(155deg,#ffe46b,#fdb724 65%)", color: INK } : terbuka ? { background: "#e3f1fd", color: "#0567c2" } : { background: "#f3ece1", color: "#5b6b85" }}
      >
        <Icon name={peta.tercapai ? "military_tech" : terbuka ? "fort" : "lock"} size={36} />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-[12px] font-black tracking-wide text-ink-3 uppercase">Gerbang naik pangkat</span>
        <span className="block leading-tight" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>
          Pangkat {lv.pangkat}
          {berikut ? ` → ${levelMeta(berikut).lokal}` : ""}
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug font-bold text-ink-2">
          {peta.tercapai
            ? "Tercapai! Sertifikat jenjang ini siap diambil."
            : terbuka
              ? `Semua misi selesai. Kuasai ${sisa} kemampuan inti lagi lewat latihan pemantapan.`
              : `Terbuka setelah Misi ${peta.total} selesai.`}
        </span>
      </div>
      {peta.tercapai && (
        <Link href={`/akademi/sertifikat/${peta.level}`} className="shrink-0 rounded-full bg-[#0567c2] px-3.5 py-2 text-[13px] font-extrabold text-white">
          Sertifikat
        </Link>
      )}
    </section>
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
