"use client";

// Portal wali: Rapor per anak — layar penuh, gaya tenang (putih, ink #0b2545), bisa dicetak.

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type Competency, type LevelId, type TrackId } from "@akademi/schema";
import { BALOO, MemberAvatar, NUNITO } from "@/components/launcher";
import { Icon, Segmented } from "@/components/ui";
import { judulPaket } from "@/components/akademi/runner";
import { PLAY } from "@/lib/catalog";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI, levelAnak, paketById, setBahasaAnak, setLevelAnak, useBahasaAnak, type BahasaAnak, anakRumah, useProfilAkademiVersi } from "@/lib/akademi/konten";
import { proyeksi, ringkasTrack, type Penguasaan } from "@/lib/akademi/mastery";
import { useMe, useRumila, type Member } from "@/lib/store";
import { BadgeStatus, INK, LEVEL_SLICE, TRACK_IKON, TRACK_SLICE, TRACK_WARNA, levelMeta, namaFramework, tanggalJam, tanggalLokal, trackMeta } from "./bersama";
import { unitUntuk } from "./track";

const PRINT_CSS = `
@media print {
  .no-print { display: none !important; }
  .rapor-root { background: #fff !important; padding: 0 !important; }
  .rapor-card { box-shadow: none !important; border: 1px solid #f0e4d2; break-inside: avoid; }
  a { text-decoration: none; color: inherit; }
}`;

export function RaporView() {
  const me = useMe();
  const members = useRumila((s) => s.members);
  const versiProfil = useProfilAkademiVersi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const anak = useMemo(() => anakRumah(members), [members, versiProfil]);
  const router = useRouter();
  const sp = useSearchParams();
  const qAnak = sp.get("anak");
  const terpilih = anak.find((m) => m.id === qAnak) ?? anak[0];

  if (!me.admin) {
    return (
      <Kerangka>
        <div className="rapor-card mx-auto mt-10 flex max-w-[420px] flex-col items-center gap-4 rounded-[24px] bg-white p-8 text-center shadow-[0_4px_0_rgba(11,37,69,.06)]">
          <Icon name="lock" size={44} style={{ color: "#5b6b85" }} />
          <p style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK }}>Minta Ayah/Ibu membuka Rapor</p>
          <p className="text-[14px] font-bold text-ink-3">Halaman ini khusus untuk wali.</p>
          <TombolKembali />
        </div>
      </Kerangka>
    );
  }

  return (
    <Kerangka>
      <header className="no-print flex items-center gap-3">
        <TombolKembali ikon />
        <div className="min-w-0 flex-1">
          <h1 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK, lineHeight: 1.05 }}>Rapor</h1>
          <p className="text-[13px] font-bold text-ink-3">Portal wali · RINOYA Academy</p>
        </div>
        <Link href="/akademi/telemetri" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#f0e4d2] bg-white px-4 text-[13px] font-extrabold transition-transform active:scale-95" style={{ color: INK }}>
          <Icon name="monitoring" size={18} /> Telemetri
        </Link>
        <button onClick={() => window.print()} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#f0e4d2] bg-white px-4 text-[13px] font-extrabold transition-transform active:scale-95" style={{ color: INK }}>
          <Icon name="print" size={18} /> Cetak
        </button>
      </header>

      {anak.length === 0 ? (
        <p className="rapor-card rounded-[20px] bg-white p-5 text-[14px] font-bold text-ink-3">Belum ada profil anak. Tambahkan anggota, lalu tandai sebagai anak di pengaturan profil.</p>
      ) : (
        <>
          <div className="no-print flex flex-wrap gap-2" role="tablist" aria-label="Pilih anak">
            {anak.map((m) => {
              const on = m.id === terpilih?.id;
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => router.replace(`/akademi/rapor?anak=${m.id}`)}
                  className="flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-[14px] font-extrabold transition-transform active:scale-95"
                  style={{ borderColor: on ? INK : "#f0e4d2", background: on ? INK : "#fff", color: on ? "#fff" : INK }}
                >
                  <MemberAvatar m={m} size={30} theme="playful" />
                  {m.name}
                </button>
              );
            })}
          </div>
          {terpilih && <RaporAnak key={terpilih.id} anak={terpilih} />}
        </>
      )}
    </Kerangka>
  );
}

function Kerangka({ children }: { children: React.ReactNode }) {
  return (
    <div className="rapor-root min-h-dvh" style={{ background: "#fff0da", fontFamily: NUNITO, color: INK }}>
      <style>{PRINT_CSS}</style>
      <div className="mx-auto flex max-w-[960px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}>
        {children}
      </div>
    </div>
  );
}

function TombolKembali({ ikon }: { ikon?: boolean }) {
  return ikon ? (
    <Link href="/akademi" aria-label="Kembali" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#f0e4d2] bg-white transition-transform active:scale-95" style={{ color: INK }}>
      <Icon name="arrow_back" size={22} />
    </Link>
  ) : (
    <Link href="/akademi" className="inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-white" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800, background: "linear-gradient(155deg,#4fb3ff,#0786eb 60%)", boxShadow: "0 3px 0 #0567c2" }}>
      <Icon name="arrow_back" size={20} /> Kembali
    </Link>
  );
}

/* ---------------- isi per anak ---------------- */

function RaporAnak({ anak }: { anak: Member }) {
  const events = useEvents(anak.id);
  const bahasa = useBahasaAnak(anak.id);
  const [level, setLevel] = useState<LevelId>("PAUD");
  useEffect(() => setLevel(levelAnak(anak.id)), [anak.id]);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const lv = levelMeta(level);

  const gantiLevel = (l: LevelId) => {
    setLevelAnak(anak.id, l);
    setLevel(l);
  };

  const buktiTerakhir = useMemo(
    () =>
      events
        .filter((e) => e.type === "attempt")
        .slice()
        .sort((a, b) => (a.clientAt < b.clientAt ? 1 : -1))
        .slice(0, 10),
    [events],
  );

  return (
    <>
      {/* identitas */}
      <section className="rapor-card flex flex-wrap items-center gap-4 rounded-[24px] bg-white p-4 shadow-[0_4px_0_rgba(11,37,69,.06)] sm:p-5">
        <MemberAvatar m={anak} size={56} theme="playful" />
        <div className="min-w-0 flex-1">
          <h2 style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK, lineHeight: 1.1 }}>{anak.name}</h2>
          <p className="text-[13px] font-bold text-ink-3">
            Jenjang {lv.nama} ({lv.lokal}) · pangkat {lv.pangkat} · {lv.acuan}
          </p>
        </div>
        <div className="no-print flex flex-col gap-1">
          <span className="text-[11px] font-extrabold text-ink-3 uppercase">Jenjang anak</span>
          <Segmented<LevelId> value={level} options={LEVEL_SLICE.map((l) => [l, levelMeta(l).nama] as [LevelId, string])} onChange={gantiLevel} />
        </div>
        <div className="no-print flex flex-col gap-1">
          <span className="text-[11px] font-extrabold text-ink-3 uppercase">Bahasa konten</span>
          <Segmented<BahasaAnak> value={bahasa} options={[["id", "Indonesia"], ["en", "English"]]} onChange={(b) => setBahasaAnak(anak.id, b)} />
        </div>
      </section>

      {/* ringkasan dua track */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TRACK_SLICE.map((t) => {
          const r = ringkasTrack(peng, KOMPETENSI, t, level);
          const [, m] = PLAY[TRACK_WARNA[t]];
          return (
            <div key={t} className="rapor-card rounded-[24px] bg-white p-4 shadow-[0_4px_0_rgba(11,37,69,.06)]">
              <div className="flex items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-[13px] text-white" style={{ background: m }}>
                  <Icon name={TRACK_IKON[t]} size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>{trackMeta(t).nama[bahasa]}</h3>
                  <p className="text-[12px] font-bold text-ink-3">
                    Inti dikuasai {r.coreDikuasai}/{r.coreTotal}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Angka label="Dikuasai" n={r.dikuasai} c="#12904a" bg="#e4f8ec" />
                <Angka label="Berkembang" n={r.berkembang} c="#b07a00" bg="#fff4d1" />
                <Angka label="Belum" n={r.belum} c="#5b6b85" bg="#fff0da" />
              </div>
              {r.total > 0 && (
                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[#fff0da]">
                  <div style={{ width: `${(r.dikuasai / r.total) * 100}%`, background: "#1fbf62" }} />
                  <div style={{ width: `${(r.berkembang / r.total) * 100}%`, background: "#ffbe0b" }} />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* daftar kompetensi per track × unit */}
      {TRACK_SLICE.map((t) => (
        <DaftarTrack key={t} track={t} level={level} peng={peng} bahasa={bahasa} />
      ))}

      {/* bukti terakhir */}
      <section className="rapor-card rounded-[24px] bg-white p-4 shadow-[0_4px_0_rgba(11,37,69,.06)] sm:p-5">
        <h3 style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>Bukti terakhir</h3>
        {buktiTerakhir.length === 0 ? (
          <p className="mt-2 text-[14px] font-bold text-ink-3">Belum ada percobaan tercatat.</p>
        ) : (
          <ul className="mt-2 divide-y divide-[#fff0da]">
            {buktiTerakhir.map((e) => {
              const p = paketById(e.activityId);
              const benar = (e.payload as { correct?: unknown }).correct === true;
              return (
                <li key={e.id} className="flex items-center gap-3 py-2 text-[13px]">
                  <span className="w-[120px] shrink-0 font-bold text-ink-3 tabular-nums">{tanggalJam(e.clientAt)}</span>
                  <span className="min-w-0 flex-1 truncate font-extrabold">{p ? judulPaket(p, bahasa) : e.activityId}</span>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[12px] font-extrabold" style={{ background: benar ? "#e4f8ec" : "#ffe8e8", color: benar ? "#12904a" : "#c92a3a" }}>
                    {benar ? "Benar" : "Salah"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="text-center text-[11px] font-bold text-ink-3">
        Dicetak {tanggalLokal(new Date().toISOString())} · Status penguasaan dihitung dari bukti bermain, bukan nilai ujian.
      </p>
    </>
  );
}

function Angka({ label, n, c, bg }: { label: string; n: number; c: string; bg: string }) {
  return (
    <div className="rounded-[14px] py-2" style={{ background: bg }}>
      <div style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: c, lineHeight: 1 }}>{n}</div>
      <div className="mt-0.5 text-[11px] font-extrabold" style={{ color: c }}>
        {label}
      </div>
    </div>
  );
}

function DaftarTrack({ track, level, peng, bahasa }: { track: TrackId; level: LevelId; peng: Record<string, Penguasaan>; bahasa: BahasaAnak }) {
  const unit = unitUntuk(track, level, KOMPETENSI, bahasa);
  const [, m] = PLAY[TRACK_WARNA[track]];
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>
        <span className="inline-block size-3 rounded-full" style={{ background: m }} />
        {trackMeta(track).nama[bahasa]} · {levelMeta(level).nama} ({levelMeta(level).lokal})
      </h3>
      {unit.length === 0 ? (
        <p className="rapor-card rounded-[20px] bg-white p-4 text-[14px] font-bold text-ink-3">Kurikulum jenjang ini belum tersedia.</p>
      ) : (
        unit.map((u) => (
          <div key={u.id} className="rapor-card rounded-[24px] bg-white p-4 shadow-[0_4px_0_rgba(11,37,69,.06)] sm:p-5">
            <h4 className="text-[15px] font-black" style={{ color: INK }}>
              {u.nama}
            </h4>
            <ul className="mt-2 divide-y divide-[#fff0da]">
              {u.kompetensi.map((c) => (
                <BarisKompetensi key={c.id} c={c} p={peng[c.id]} bahasa={bahasa} />
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}

function BarisKompetensi({ c, p, bahasa }: { c: Competency; p?: Penguasaan; bahasa: BahasaAnak }) {
  const status = p?.status ?? "belum";
  const refs = c.refs.map((r) => `${namaFramework(r.framework)} ${r.code}`).join(" · ");
  return (
    <li className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-start sm:gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-snug font-extrabold" style={{ color: INK }}>
          {c.statement[bahasa] ?? c.statement.id}
          {c.core && <span className="ml-1.5 rounded-full bg-[#fff0da] px-1.5 py-0.5 align-middle text-[10px] font-black text-ink-3">INTI</span>}
        </p>
        {refs && <p className="mt-0.5 text-[12px] font-bold text-ink-3">{refs}</p>}
        <p className="mt-0.5 text-[12px] font-bold text-ink-3">
          {p && p.success > 0 ? `${p.success} bukti · terakhir ${tanggalLokal(p.lastAt)}` : "Belum ada bukti"}
        </p>
      </div>
      <BadgeStatus status={status} />
    </li>
  );
}
