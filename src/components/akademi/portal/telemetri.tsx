"use client";

// Portal tim/wali admin: Telemetri — bukti belajar semua anak di rumah, layar penuh, gaya tenang seperti Rapor.
// Data dibaca dari cache lokal tiap anak (eventsAnak) dan dihitung ulang saat `rumila:akademi` terpancar / tab kembali fokus.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { GameEvent } from "@akademi/schema";
import { BALOO, MemberAvatar, NUNITO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { judulPaket } from "@/components/akademi/runner";
import { EVENT_NAMA, eventsAnak } from "@/lib/akademi/jejak";
import { KOMPETENSI, PAKET, paketById } from "@/lib/akademi/konten";
import { labelBendera, ringkasAnak, ringkasHarian, ringkasKompetensi, ringkasPaket, teksRingkasan, type Bendera, type RingkasanAnak, type RingkasanPaket } from "@/lib/akademi/telemetri";
import { useMe, useRumila, type Member } from "@/lib/store";
import { INK, labelMekanik, tanggalJam, tanggalLokal } from "./bersama";

const KARTU = "rounded-[24px] bg-white p-4 shadow-[0_4px_0_rgba(43,29,78,.06)] sm:p-5";
const HARI_MS = 86400000;

const WARNA_BENDERA: Record<Bendera, { bg: string; fg: string }> = {
  "terlalu-sukar": { bg: "#ffe8e8", fg: "#c92a3a" },
  "terlalu-mudah": { bg: "#e3f0ff", fg: "#1f5fbf" },
  "sering-berhenti": { bg: "#fff0dc", fg: "#c0611a" },
  "banyak-hint": { bg: "#f1e8ff", fg: "#7a3fc9" },
};

const pct = (r: number) => `${Math.round(r * 100)}%`;
const detik = (ms: number) => (ms ? (ms / 1000).toFixed(1) : "-");

/** Event semua anak dari cache lokal; dihitung ulang saat ada event baru / tab kembali aktif. */
function useSemuaEvents(anak: Member[]): { perAnak: Record<string, GameEvent[]>; semua: GameEvent[]; siap: boolean; now: Date } {
  const [tick, setTick] = useState(0);
  const [siap, setSiap] = useState(false);
  useEffect(() => {
    setSiap(true);
    const segar = () => setTick((t) => t + 1);
    const fokus = () => document.visibilityState === "visible" && segar();
    window.addEventListener(EVENT_NAMA, segar);
    window.addEventListener("focus", segar);
    document.addEventListener("visibilitychange", fokus);
    return () => {
      window.removeEventListener(EVENT_NAMA, segar);
      window.removeEventListener("focus", segar);
      document.removeEventListener("visibilitychange", fokus);
    };
  }, []);
  const ids = anak.map((m) => m.id).join("|");
  return useMemo(() => {
    const perAnak: Record<string, GameEvent[]> = {};
    const semua: GameEvent[] = [];
    if (siap)
      for (const id of ids ? ids.split("|") : []) {
        const ev = eventsAnak(id);
        perAnak[id] = ev;
        semua.push(...ev);
      }
    return { perAnak, semua, siap, now: new Date() };
    // tick memaksa baca ulang localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, siap, tick]);
}

export function TelemetriView() {
  const me = useMe();
  const members = useRumila((s) => s.members);
  const anak = useMemo(() => members.filter((m) => !m.admin), [members]);
  const { perAnak, semua, siap, now } = useSemuaEvents(anak);
  const [filter, setFilter] = useState<string>("semua");
  const [tersalin, setTersalin] = useState(false);

  const paketR = useMemo(() => ringkasPaket(semua, PAKET), [semua]);
  const kompetensiR = useMemo(
    () =>
      ringkasKompetensi(perAnak, KOMPETENSI)
        .filter((k) => k.attempts > 0 || k.berkembang + k.dikuasai > 0)
        .sort((a, b) => a.rasio - b.rasio || b.attempts - a.attempts),
    [perAnak],
  );
  const harian = useMemo(() => ringkasHarian(semua, 14, now), [semua, now]);
  const perAnakR = useMemo(() => anak.map((m) => ({ m, r: ringkasAnak(perAnak[m.id] ?? [], m.id, now) })), [anak, perAnak, now]);

  const atas = useMemo(() => {
    const batas7 = now.getTime() - 7 * HARI_MS;
    const aktif = new Set<string>();
    let selesai = 0;
    let attempts = 0;
    let benar = 0;
    for (const e of semua) {
      const t = new Date(e.clientAt).getTime();
      const baru = !Number.isNaN(t) && t >= batas7;
      if (baru) aktif.add(e.learnerId);
      if (e.type === "activity_end" && baru && (e.payload as { outcome?: unknown }).outcome === "selesai") selesai++;
      if (e.type === "attempt") {
        attempts++;
        if ((e.payload as { correct?: unknown }).correct === true) benar++;
      }
    }
    return { anakAktif: aktif.size, selesaiMingguIni: selesai, rasio: attempts ? benar / attempts : 0, attempts };
  }, [semua, now]);

  const mekanik = useMemo(() => Array.from(new Set(paketR.map((p) => p.mechanic))).sort(), [paketR]);
  const paketTampil = useMemo(
    () => (filter === "semua" ? paketR : filter === "berbendera" ? paketR.filter((p) => p.bendera.length) : paketR.filter((p) => p.mechanic === filter)),
    [paketR, filter],
  );

  const namaPaket = (id: string) => {
    const p = paketById(id);
    return p ? judulPaket(p) : id;
  };

  const salin = async () => {
    const teks = teksRingkasan({
      tanggal: tanggalLokal(now.toISOString()),
      anakAktif: atas.anakAktif,
      totalAnak: anak.length,
      selesaiMingguIni: atas.selesaiMingguIni,
      rasio: atas.rasio,
      paket: paketR,
      namaPaket,
      kompetensi: kompetensiR,
      anak: perAnakR.map(({ m, r }) => ({ nama: m.name, r })),
    });
    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1800);
    } catch (e) {
      console.error("[akademi] salin ringkasan gagal", e);
      window.prompt("Salin teks berikut:", teks);
    }
  };

  if (!me.admin) {
    return (
      <Kerangka>
        <div className="mx-auto mt-10 flex max-w-[420px] flex-col items-center gap-4 rounded-[24px] bg-white p-8 text-center shadow-[0_4px_0_rgba(43,29,78,.06)]">
          <Icon name="lock" size={44} style={{ color: "#8a7a9c" }} />
          <p style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK }}>Halaman ini khusus wali admin</p>
          <p className="text-[14px] font-bold text-ink-3">Telemetri hanya untuk tim dan orang tua yang mengelola Academy.</p>
          <TombolKembali />
        </div>
      </Kerangka>
    );
  }

  return (
    <Kerangka>
      <header className="flex items-center gap-3">
        <TombolKembali ikon />
        <div className="min-w-0 flex-1">
          <h1 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK, lineHeight: 1.05 }}>Telemetri</h1>
          <p className="text-[13px] font-bold text-ink-3">Bukti belajar semua anak · Rumila Kids Academy</p>
        </div>
        <button onClick={salin} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#e5e0ee] bg-white px-4 text-[13px] font-extrabold transition-transform active:scale-95" style={{ color: tersalin ? "#12904a" : INK }}>
          <Icon name={tersalin ? "check" : "content_copy"} size={18} /> {tersalin ? "Tersalin" : "Salin ringkasan"}
        </button>
      </header>

      {anak.length === 0 ? (
        <p className={`${KARTU} text-[14px] font-bold text-ink-3`}>Belum ada profil anak. Tambahkan anggota non-admin dulu.</p>
      ) : !siap ? (
        <p className={`${KARTU} text-[14px] font-bold text-ink-3`}>Membaca jejak belajar…</p>
      ) : (
        <>
          {/* 1. ringkasan atas */}
          <section className="grid grid-cols-3 gap-2 sm:gap-3">
            <Kpi label="Anak aktif · 7 hari" n={`${atas.anakAktif}/${anak.length}`} c="#1f5fbf" bg="#e3f0ff" />
            <Kpi label="Selesai minggu ini" n={String(atas.selesaiMingguIni)} c="#12904a" bg="#e4f8ec" />
            <Kpi label={`Benar · ${atas.attempts} coba`} n={atas.attempts ? pct(atas.rasio) : "-"} c="#b07a00" bg="#fff4d1" />
          </section>

          {/* 2. grafik 14 hari */}
          <section className={KARTU}>
            <div className="flex items-baseline justify-between gap-2">
              <h2 style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>Percobaan 14 hari</h2>
              <span className="text-[11px] font-extrabold text-ink-3">
                <span className="mr-1 inline-block size-2.5 rounded-sm align-middle" style={{ background: "#1fbf62" }} /> benar
                <span className="mr-1 ml-3 inline-block size-2.5 rounded-sm align-middle" style={{ background: "#ddd5e8" }} /> salah
              </span>
            </div>
            <GrafikHarian data={harian} />
          </section>

          {/* 3. paket */}
          <section className={KARTU}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>Paket</h2>
              <span className="text-[12px] font-bold text-ink-3">{paketTampil.length} dari {paketR.length} paket dimainkan</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Saring paket">
              <Chip on={filter === "semua"} onClick={() => setFilter("semua")}>
                Semua
              </Chip>
              <Chip on={filter === "berbendera"} onClick={() => setFilter("berbendera")}>
                Berbendera · {paketR.filter((p) => p.bendera.length).length}
              </Chip>
              {mekanik.map((m) => (
                <Chip key={m} on={filter === m} onClick={() => setFilter(m)}>
                  {labelMekanik(m)}
                </Chip>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-extrabold">
              {(Object.keys(WARNA_BENDERA) as Bendera[]).map((b) => (
                <span key={b} style={{ color: WARNA_BENDERA[b].fg }}>
                  <span className="mr-1 inline-block size-2.5 rounded-full align-middle" style={{ background: WARNA_BENDERA[b].fg }} />
                  {labelBendera(b)}
                </span>
              ))}
            </div>
            {paketTampil.length === 0 ? (
              <p className="mt-3 text-[14px] font-bold text-ink-3">{paketR.length ? "Tidak ada paket pada saringan ini." : "Belum ada paket yang dimainkan."}</p>
            ) : (
              <TabelPaket rows={paketTampil} namaPaket={namaPaket} />
            )}
          </section>

          {/* 4. kompetensi */}
          <section className={KARTU}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>Kompetensi</h2>
              <span className="text-[12px] font-bold text-ink-3">urut % benar terendah · jumlah anak per status</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 text-[11px] font-extrabold text-ink-3">
              <span>
                <span className="mr-1 inline-block size-2.5 rounded-sm align-middle" style={{ background: "#ddd5e8" }} /> belum
              </span>
              <span>
                <span className="mr-1 inline-block size-2.5 rounded-sm align-middle" style={{ background: "#ffbe0b" }} /> berkembang
              </span>
              <span>
                <span className="mr-1 inline-block size-2.5 rounded-sm align-middle" style={{ background: "#1fbf62" }} /> dikuasai
              </span>
            </div>
            {kompetensiR.length === 0 ? (
              <p className="mt-3 text-[14px] font-bold text-ink-3">Belum ada bukti kompetensi.</p>
            ) : (
              <ul className="mt-2 divide-y divide-[#f1edf6]">
                {kompetensiR.map((k) => {
                  const total = k.belum + k.berkembang + k.dikuasai || 1;
                  return (
                    <li key={k.id} className="flex flex-col gap-1.5 py-2.5 sm:flex-row sm:items-center sm:gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-extrabold" title={k.statement}>
                          {k.statement}
                        </p>
                        <p className="text-[11px] font-bold text-ink-3">
                          {k.id}
                          {k.core ? " · inti" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:w-[300px] sm:shrink-0">
                        <div className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-[#f1edf6]" aria-label={`belum ${k.belum}, berkembang ${k.berkembang}, dikuasai ${k.dikuasai}`}>
                          <div style={{ width: `${(k.belum / total) * 100}%`, background: "#ddd5e8" }} />
                          <div style={{ width: `${(k.berkembang / total) * 100}%`, background: "#ffbe0b" }} />
                          <div style={{ width: `${(k.dikuasai / total) * 100}%`, background: "#1fbf62" }} />
                        </div>
                        <span className="w-[86px] shrink-0 text-right text-[12px] font-extrabold tabular-nums" style={{ color: "#8a7a9c" }}>
                          {k.belum}·{k.berkembang}·{k.dikuasai}
                        </span>
                        <span className="w-[44px] shrink-0 text-right text-[13px] font-black tabular-nums" style={{ color: k.attempts ? (k.rasio < 0.4 ? "#c92a3a" : INK) : "#b9acc9" }}>
                          {k.attempts ? pct(k.rasio) : "-"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* 5. per anak */}
          <section>
            <h2 className="mb-2" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>
              Per anak · 30 hari
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {perAnakR.map(({ m, r }) => (
                <KartuAnak key={m.id} m={m} r={r} />
              ))}
            </div>
          </section>

          <p className="text-center text-[11px] font-bold text-ink-3">
            Dihitung {tanggalJam(now.toISOString())} dari event yang tersimpan di perangkat ini (server + lokal). Angka untuk tim, bukan untuk ditunjukkan ke anak.
          </p>
        </>
      )}
    </Kerangka>
  );
}

/* ---------------- bagian ---------------- */

function GrafikHarian({ data }: { data: { tanggal: string; attempts: number; benar: number; anakUnik: number }[] }) {
  const maks = Math.max(1, ...data.map((d) => d.attempts));
  const total = data.reduce((s, d) => s + d.attempts, 0);
  return (
    <div className="mt-3">
      <div className="flex h-[120px] items-end gap-1 sm:gap-1.5">
        {data.map((d) => {
          const tinggi = (d.attempts / maks) * 100;
          const benar = d.attempts ? (d.benar / d.attempts) * 100 : 0;
          const tgl = new Date(d.tanggal + "T00:00:00");
          return (
            <div key={d.tanggal} className="flex min-w-0 flex-1 flex-col items-center gap-1" title={`${tanggalLokal(tgl.toISOString())}: ${d.attempts} percobaan, ${d.benar} benar, ${d.anakUnik} anak`}>
              <span className="text-[10px] font-extrabold tabular-nums text-ink-3">{d.attempts || ""}</span>
              <div className="flex w-full max-w-[28px] flex-1 items-end">
                <div className="flex w-full flex-col justify-end overflow-hidden rounded-t-[6px] bg-[#ddd5e8]" style={{ height: `${Math.max(tinggi, d.attempts ? 6 : 2)}%`, background: d.attempts ? "#ddd5e8" : "#f1edf6" }}>
                  <div style={{ height: `${benar}%`, background: "#1fbf62" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-1 sm:gap-1.5">
        {data.map((d, i) => {
          const tgl = new Date(d.tanggal + "T00:00:00");
          const tampil = i === 0 || i === data.length - 1 || i % 3 === 0;
          return (
            <span key={d.tanggal} className="min-w-0 flex-1 text-center text-[10px] font-bold text-ink-3 tabular-nums">
              {tampil ? tgl.getDate() : ""}
            </span>
          );
        })}
      </div>
      {total === 0 && <p className="mt-2 text-center text-[12px] font-bold text-ink-3">Belum ada percobaan dalam 14 hari terakhir.</p>}
    </div>
  );
}

function TabelPaket({ rows, namaPaket }: { rows: RingkasanPaket[]; namaPaket: (id: string) => string }) {
  return (
    <div className="mt-3">
      {/* kepala kolom (≥ sm) */}
      <div className="hidden grid-cols-[minmax(0,1fr)_72px_56px_56px_56px_56px_56px] gap-2 border-b border-[#f1edf6] pb-1.5 text-[11px] font-extrabold text-ink-3 uppercase sm:grid">
        <span>Judul · mekanik · level</span>
        <span className="text-right">Coba</span>
        <span className="text-right">% benar</span>
        <span className="text-right">Median dtk</span>
        <span className="text-right">% hint</span>
        <span className="text-right">Berhenti</span>
        <span className="text-right">Anak</span>
      </div>
      <ul className="divide-y divide-[#f1edf6]">
        {rows.map((p) => {
          const b0 = p.bendera[0];
          const aksen = b0 ? WARNA_BENDERA[b0].fg : "transparent";
          return (
            <li key={p.paketId} className="py-2.5">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[minmax(0,1fr)_72px_56px_56px_56px_56px_56px] sm:items-center sm:gap-2">
                <div className="flex min-w-0 items-start gap-2">
                  <span className="mt-1 inline-block size-2.5 shrink-0 rounded-full" style={{ background: aksen, outline: b0 ? "none" : "1px solid #e5e0ee" }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-extrabold" title={p.paketId}>
                      {namaPaket(p.paketId)}
                    </p>
                    <p className="text-[11px] font-bold text-ink-3">
                      {labelMekanik(p.mechanic)} · {p.level}
                      {Object.keys(p.knobRataRata).length > 0 && (
                        <span title="rata-rata knob">
                          {" · "}
                          {Object.entries(p.knobRataRata)
                            .map(([k, v]) => `${k} ${v}`)
                            .join(", ")}
                        </span>
                      )}
                    </p>
                    {p.bendera.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {p.bendera.map((b) => (
                          <span key={b} className="rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: WARNA_BENDERA[b].bg, color: WARNA_BENDERA[b].fg }}>
                            {labelBendera(b)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* angka: baris chip di ponsel, kolom di ≥ sm */}
                <Sel label="coba" v={String(p.attempts)} />
                <Sel label="benar" v={p.attempts ? pct(p.rasio) : "-"} c={p.attempts && p.rasio < 0.4 ? "#c92a3a" : p.attempts && p.rasio >= 0.9 ? "#1f5fbf" : undefined} />
                <Sel label="median" v={p.medianLatencyMs ? `${detik(p.medianLatencyMs)} dtk` : "-"} />
                <Sel label="hint" v={p.attempts ? pct(p.hintRate) : "-"} c={p.attempts && p.hintRate >= 0.4 ? "#7a3fc9" : undefined} />
                <Sel label="berhenti" v={p.mulai ? `${p.berhenti}/${p.mulai}` : "-"} c={p.mulai >= 4 && p.berhenti / p.mulai >= 0.5 ? "#c0611a" : undefined} />
                <Sel label="anak" v={String(p.anakUnik)} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Satu angka paket: di ponsel tampil sebagai chip berlabel, di ≥ sm hanya angka rata kanan. */
function Sel({ label, v, c }: { label: string; v: string; c?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1 text-[12px] font-extrabold tabular-nums sm:block sm:text-right sm:text-[13px]" style={{ color: c ?? INK }}>
      <span className="text-[10px] font-bold text-ink-3 uppercase sm:hidden">{label}</span>
      {v}
    </span>
  );
}

function KartuAnak({ m, r }: { m: Member; r: RingkasanAnak }) {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-[0_4px_0_rgba(43,29,78,.06)]">
      <div className="flex items-center gap-3">
        <MemberAvatar m={m} size={44} theme="playful" />
        <div className="min-w-0 flex-1">
          <p className="truncate" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK, lineHeight: 1.1 }}>
            {m.name}
          </p>
          <p className="text-[12px] font-bold text-ink-3">{r.terakhirAt ? `Terakhir main ${tanggalJam(r.terakhirAt)}` : "Belum pernah main"}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
        <Mini label="Hari aktif" n={String(r.hariAktif)} />
        <Mini label="Menit" n={String(r.menitMain)} />
        <Mini label="Selesai" n={String(r.aktivitasSelesai)} />
        <Mini label="Benar" n={r.terakhirAt ? pct(r.rasio) : "-"} />
      </div>
    </div>
  );
}

function Mini({ label, n }: { label: string; n: string }) {
  return (
    <div className="rounded-[12px] bg-[#f7f4fb] py-1.5">
      <div className="tabular-nums" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK, lineHeight: 1 }}>
        {n}
      </div>
      <div className="mt-0.5 text-[10px] font-extrabold text-ink-3">{label}</div>
    </div>
  );
}

function Kpi({ label, n, c, bg }: { label: string; n: string; c: string; bg: string }) {
  return (
    <div className="rounded-[20px] px-2 py-3 text-center sm:px-3" style={{ background: bg }}>
      <div className="tabular-nums" style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: c, lineHeight: 1 }}>
        {n}
      </div>
      <div className="mt-1 text-[11px] font-extrabold" style={{ color: c }}>
        {label}
      </div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      role="tab"
      aria-selected={on}
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-[12px] font-extrabold transition-transform active:scale-95"
      style={{ borderColor: on ? INK : "#e5e0ee", background: on ? INK : "#fff", color: on ? "#fff" : INK }}
    >
      {children}
    </button>
  );
}

/* ---------------- kerangka ---------------- */

function Kerangka({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ background: "#faf8fc", fontFamily: NUNITO, color: INK }}>
      <div className="mx-auto flex max-w-[1100px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}>
        {children}
      </div>
    </div>
  );
}

function TombolKembali({ ikon }: { ikon?: boolean }) {
  return ikon ? (
    <Link href="/akademi/rapor" aria-label="Kembali ke Rapor" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#e5e0ee] bg-white transition-transform active:scale-95" style={{ color: INK }}>
      <Icon name="arrow_back" size={22} />
    </Link>
  ) : (
    <Link href="/akademi" className="inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-[14px] font-extrabold text-white" style={{ background: INK }}>
      <Icon name="arrow_back" size={18} /> Kembali
    </Link>
  );
}
