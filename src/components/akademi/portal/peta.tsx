"use client";

// Peta Petualangan: satu jalur misi BERURUTAN per jenjang (Misi 1, 2, 3, …), tanpa lompat.
// Kartu jenjang (+ tangga mini 9 jenjang) → tombol Lanjut (selalu misi "kamu di sini") → jalur unit & misi → Gerbang Naik Pangkat.
// Logika di src/lib/akademi/peta.ts; di sini hanya tampilan + naik jenjang otomatis.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { type LevelId } from "@akademi/schema";
import { LAMBANG, TanggaMini } from "./tangga";
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

type Events = ReturnType<typeof useEvents>;

export function PetaPetualangan({ me, level, onHadiah }: { me: Member; level: LevelId; onHadiah: () => void }) {
  const events = useEvents(me.id);
  const bahasa = useBahasaAnak(me.id);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const selesaiSet = useMemo(() => kompetensiSelesai(events, PAKET), [events]);
  const peta = useMemo(() => petaJenjang(peng, selesaiSet, KOMPETENSI, level, TRACK_SLICE), [peng, selesaiSet, level]);
  const streak = useMemo(() => hitungStreak(events), [events]);
  const berikut = jenjangBerikut(level, KOMPETENSI);

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
      <KartuJenjang peta={peta} streak={streak} onHadiah={onHadiah} />

      {target && targetPaket && (
        <Link
          href={`/akademi/main/${targetPaket.id}`}
          aria-label={`${peta.sekarang ? `Lanjut Misi ${target.nomor}` : "Latihan pemantapan"}: ${pernyataan(target, bahasa)}`}
          className="flex items-center gap-3 rounded-[28px] p-3 pr-5 text-[#0b2545] transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] active:scale-[.98]"
          style={{ background: "linear-gradient(155deg,#ffb347,#fd861d 60%)", boxShadow: "0 6px 0 #c85400" }}
        >
          <span className="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-white">
            <span aria-hidden className="akademi-denyut absolute inset-0 rounded-full" />
            <Icon name="play_arrow" size={44} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block leading-none" style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800 }}>
              {peta.sekarang ? `Misi ${target.nomor}` : "Pemantapan"}
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-[15px] font-extrabold opacity-90">
              <Icon name={TRACK_IKON[target.kompetensi.track]} size={18} />
              <span className="truncate">{target.kompetensi.unit.nama[bahasa] ?? target.kompetensi.unit.nama.id}</span>
            </span>
          </span>
          <Icon name="arrow_forward" size={30} />
        </Link>
      )}

      <div className="flex flex-col gap-3">
        {peta.unit.map((u) => (
          <Unit key={`${u.track}-${u.id}`} u={u} bahasa={bahasa} events={events} level={level} sekarang={peta.sekarang} />
        ))}
        <Gerbang peta={peta} berikut={berikut} />
      </div>

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

/* ---------------- kartu jenjang: medali + cincin progres, tanpa kalimat penjelas ---------------- */

function KartuJenjang({ peta, streak, onHadiah }: { peta: PetaJenjang; streak: number; onHadiah: () => void }) {
  const lv = levelMeta(peta.level);
  const { ikon, warna } = LAMBANG[peta.level];
  const progres = peta.total ? peta.selesai / peta.total : 0;
  const R = 44;
  const kel = 2 * Math.PI * R;
  return (
    <section className={`${KARTU} relative flex flex-col gap-3 overflow-hidden p-4`} aria-label={`Jenjang ${lv.nama}, misi ${peta.selesai} dari ${peta.total}, target pangkat ${lv.pangkat}`}>
      <div className="relative flex items-center gap-4">
        <span aria-hidden className="absolute -left-10 -top-12 size-40 rounded-full" style={{ background: `${warna[0]}33` }} />
        <span className="relative shrink-0" style={{ width: 104, height: 104 }}>
          <svg width={104} height={104} viewBox="0 0 104 104" aria-hidden className="absolute inset-0 -rotate-90">
            <circle cx={52} cy={52} r={R} fill="none" stroke="#fff0da" strokeWidth={9} />
            {progres > 0 && <circle cx={52} cy={52} r={R} fill="none" stroke={warna[1]} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${Math.max(progres * kel, 6)} ${kel}`} />}
          </svg>
          <span
            className="absolute inset-[15px] flex items-center justify-center rounded-full border-4 border-white text-white"
            style={{ background: `radial-gradient(circle at 32% 28%, ${warna[0]}, ${warna[1]})`, boxShadow: `0 4px 0 ${warna[1]}99` }}
          >
            <Icon name={ikon} size={38} />
          </span>
        </span>
        <div className="relative min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3d1] px-2.5 py-0.5 text-[12px] font-black text-[#7a5200]">
            <Icon name="military_tech" size={16} /> {lv.pangkat}
          </span>
          <h2 className="mt-1 leading-none" style={{ fontFamily: BALOO, fontSize: 28, fontWeight: 800, color: INK }}>
            {lv.lokal}
          </h2>
          <p className="mt-1 text-[13px] font-extrabold text-ink-3">{lv.nama}</p>
          <p className="mt-1.5 leading-none" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: warna[1] }}>
            {peta.selesai}/{peta.total} <span className="text-[13px] text-ink-3">misi</span>
          </p>
        </div>
        <div className="relative flex shrink-0 flex-col gap-2">
          <span className="flex h-11 min-w-11 items-center justify-center gap-1 rounded-full bg-[#fff1e6] px-3" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, color: "#c2410c" }} aria-label={`Rajin ${streak} hari`} title={`Rajin ${streak} hari`}>
            <span aria-hidden>🔥</span>
            {streak}
          </span>
          <button onClick={onHadiah} aria-label="Hadiah" title="Hadiah" className="flex size-11 items-center justify-center rounded-full bg-[#fff3d1] text-[#a34a00] transition-transform active:scale-90">
            <Icon name="redeem" size={24} />
          </button>
        </div>
      </div>
      <TanggaMini level={peta.level} />
    </section>
  );
}

/* ---------------- jalur: spanduk unit + titik misi berkelok, tanpa teks pernyataan ---------------- */

const WARNA_LENCANA: Record<StatusLencana, { bg: string; fg: string; label: string }> = {
  emas: { bg: "#fdb724", fg: "#0b2545", label: "Lencana emas" },
  perak: { bg: "#e8edf4", fg: "#0b2545", label: "Lencana perak" },
  perunggu: { bg: "#e7a46a", fg: "#0b2545", label: "Lencana perunggu" },
  terkunci: { bg: "rgba(255,255,255,.25)", fg: "#fff", label: "Lencana belum didapat" },
};
/** Geser horizontal titik misi (px), berulang mengikuti nomor misi supaya jalur berkelok tanpa putus antar-unit. */
const KELOK = [0, 56, 84, 56, 0, -56, -84, -56];

function Unit({ u, bahasa, events, level, sekarang }: { u: UnitPeta; bahasa: BahasaAnak; events: Events; level: LevelId; sekarang?: MisiPeta }) {
  const c = TRACK_WARNA[u.track];
  const [l, m, d] = PLAY[c];
  const w = WARNA_LENCANA[u.lencana];
  const selesai = u.misi.filter((x) => x.selesai).length;
  const semuaKunci = u.misi.every((x) => x.terkunci);
  const tinta = tintaPada(c);
  const geserRata = u.misi.reduce((t, x) => t + KELOK[(x.nomor - 1) % KELOK.length], 0) / Math.max(1, u.misi.length);
  const sisiHias = geserRata > 0 ? "left" : "right";
  return (
    <section aria-label={`${trackMeta(u.track).nama.id}: ${u.nama.id}, ${selesai} dari ${u.misi.length} misi`}>
      <div
        className="flex items-center gap-3 rounded-[22px] px-4 py-3"
        style={{ background: `linear-gradient(135deg, ${l}, ${m} 70%)`, boxShadow: `0 4px 0 ${d}`, color: tinta, filter: semuaKunci ? "grayscale(.55) opacity(.75)" : undefined }}
      >
        <Icon name={TRACK_IKON[u.track]} size={30} />
        <span className="line-clamp-2 min-w-0 flex-1 leading-tight" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800 }}>
          {u.nama[bahasa] ?? u.nama.id}
        </span>
        <span className="flex gap-1" aria-hidden>
          {u.misi.map((x) => (
            <span key={x.kompetensi.id} className="size-2 rounded-full" style={{ background: x.selesai ? "#fff" : "rgba(255,255,255,.35)" }} />
          ))}
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full" style={{ background: w.bg, color: w.fg }} aria-label={w.label} title={w.label}>
          <Icon name="workspace_premium" size={20} />
        </span>
      </div>
      <ol className="relative flex flex-col items-center gap-3 py-4">
        {/* hiasan: lambang pelajaran besar di sisi yang tidak dilewati jalur */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 flex size-[76px] -translate-y-1/2 items-center justify-center rounded-full"
          style={{ [sisiHias]: 4, background: `${l}30`, color: m, filter: semuaKunci ? "grayscale(.7)" : undefined, opacity: semuaKunci ? 0.6 : 1 }}
        >
          <Icon name={TRACK_IKON[u.track]} size={40} />
        </span>
        {u.misi.map((x) => {
          const href = !x.terkunci ? paketMisi(x.kompetensi.id, PAKET, events, level) : undefined;
          return (
            <li key={x.kompetensi.id} className="relative focus-within:z-10 hover:z-10" style={{ transform: `translateX(${KELOK[(x.nomor - 1) % KELOK.length]}px)` }}>
              <TitikMisi m={x} warna={[l, m, d]} href={href ? `/akademi/main/${href.id}` : undefined} sekarang={sekarang} bahasa={bahasa} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function TitikMisi({ m, warna, href, sekarang, bahasa }: { m: MisiPeta; warna: [string, string, string]; href?: string; sekarang?: MisiPeta; bahasa: BahasaAnak }) {
  const [goyang, setGoyang] = useState(0);
  const [l, mm, d] = warna;
  const ukuran = m.sekarang ? 80 : 64;
  const gaya: React.CSSProperties = m.selesai
    ? { background: "linear-gradient(155deg,#ffe46b,#fdb724 65%)", boxShadow: "0 6px 0 #c88a00", color: INK }
    : m.sekarang
      ? { background: `linear-gradient(155deg, ${l}, ${mm} 65%)`, boxShadow: `0 7px 0 ${d}`, color: "#fff" }
      : { background: "#ece4d8", boxShadow: "0 5px 0 #d6cbbb", color: "#a99c8a" };
  const ikon = m.selesai ? "star" : m.sekarang ? "play_arrow" : "lock";
  const label = `Misi ${m.nomor}: ${pernyataan(m, bahasa)}. ${m.selesai ? "Selesai, main lagi" : m.sekarang ? "Mainkan sekarang" : "Terkunci"}`;
  const isi = (
    <>
      {m.sekarang && <span aria-hidden className="akademi-denyut absolute inset-0 rounded-full" />}
      <Icon name={ikon} size={m.sekarang ? 46 : 32} />
    </>
  );
  const kelas = "relative flex items-center justify-center rounded-full transition-transform active:translate-y-1 active:scale-95";
  const gayaPenuh = { width: ukuran, height: ukuran, ...gaya };
  return (
    <div className="relative flex flex-col items-center">
      {m.sekarang && (
        <span className="akademi-bounce mb-2 rounded-[12px] bg-white px-3 py-1 text-[13px] font-black tracking-wide uppercase shadow-md" style={{ color: d }}>
          Mulai
        </span>
      )}
      {goyang > 0 && sekarang && (
        <span key={`pesan-${goyang}`} className="anim-fade absolute -top-9 z-20 whitespace-nowrap rounded-[12px] bg-[#0b2545] px-3 py-1 text-[12px] font-extrabold text-white">
          Misi {sekarang.nomor} dulu, ya
        </span>
      )}
      {href ? (
        <Link href={href} aria-label={label} title={pernyataan(m, bahasa)} className={kelas} style={gayaPenuh}>
          {isi}
        </Link>
      ) : (
        <button type="button" key={`titik-${goyang}`} onClick={() => setGoyang((g) => g + 1)} aria-label={label} className={`${kelas} ${goyang ? "akademi-shake" : ""}`} style={gayaPenuh}>
          {isi}
        </button>
      )}
    </div>
  );
}

/* ---------------- gerbang naik pangkat: benteng di ujung jalur ---------------- */

function Gerbang({ peta, berikut }: { peta: PetaJenjang; berikut?: LevelId }) {
  const lv = levelMeta(peta.level);
  const terbuka = !peta.sekarang;
  const sisa = peta.inti.total - peta.inti.dikuasai;
  const gaya: React.CSSProperties = peta.tercapai
    ? { background: "linear-gradient(155deg,#ffe46b,#fdb724 65%)", boxShadow: "0 7px 0 #c88a00", color: INK }
    : terbuka
      ? { background: "linear-gradient(155deg,#5fb8ff,#0786eb 65%)", boxShadow: "0 7px 0 #0567c2", color: "#fff" }
      : { background: "#ece4d8", boxShadow: "0 6px 0 #d6cbbb", color: "#a99c8a" };
  const isi = (
    <>
      <span className="flex size-24 items-center justify-center rounded-[30px]" style={gaya}>
        <Icon name={peta.tercapai ? "military_tech" : "fort"} size={56} />
      </span>
      <span className="mt-2 flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] font-black shadow-sm" style={{ color: INK }}>
        {!terbuka && <Icon name="lock" size={16} />}
        {lv.pangkat}
        {berikut && (
          <>
            <Icon name="arrow_forward" size={16} /> {levelMeta(berikut).lokal}
          </>
        )}
      </span>
      {terbuka && !peta.tercapai && sisa > 0 && <span className="mt-1 text-[12px] font-extrabold text-ink-3">{sisa} latihan lagi</span>}
    </>
  );
  const label = peta.tercapai ? "Gerbang naik pangkat: tercapai, lihat sertifikat" : terbuka ? `Gerbang naik pangkat: kuasai ${sisa} kemampuan inti lagi` : `Gerbang naik pangkat: terbuka setelah Misi ${peta.total}`;
  return peta.tercapai ? (
    <Link href={`/akademi/sertifikat/${peta.level}`} aria-label={label} className="flex flex-col items-center py-2 transition-transform active:scale-95">
      {isi}
    </Link>
  ) : (
    <section aria-label={label} className="flex flex-col items-center py-2">
      {isi}
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
