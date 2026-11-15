"use client";

// Ruang Orang Tua: dibuka dengan PIN admin rumah. Per anak: Ringkasan · Rapor · Ujian & Tes · Sertifikat ·
// Profil Berpikir. Terkunci lagi otomatis setelah 15 menit atau lewat tombol Kunci.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { levelMeta } from "@akademi/schema";
import { BALOO, MemberAvatar, NUNITO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { LemariPiagam, usePenghargaan } from "@/components/akademi/lemari";
import { hitungStreak, tanggalJam, TRACK_SLICE } from "@/components/akademi/portal/bersama";
import { RaporAnak } from "@/components/akademi/portal/rapor";
import { ProfilBerpikirOrtu } from "@/components/ortu/profil-berpikir";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI, PAKET, anakRumah, levelAnak, useProfilAkademiVersi } from "@/lib/akademi/konten";
import { proyeksi } from "@/lib/akademi/mastery";
import { kompetensiSelesai, petaJenjang, progresMisi } from "@/lib/akademi/peta";
import { sinkronSiswa } from "@/lib/akademi/siswa";
import { NAMA_UJIAN, predikat, type HasilUjian } from "@/lib/akademi/ujian";
import { adminBerPin, bukaDenganPin, ruangTerbuka, sisaKunci, tutupRuang } from "@/lib/ortu";
import { useRumila, type Member } from "@/lib/store";

const INK = "#0b2545";
const KARTU = "rounded-[22px] bg-white shadow-[0_4px_0_rgba(11,37,69,.06)]";
const TAB = [
  ["ringkasan", "Ringkasan", "dashboard"],
  ["rapor", "Rapor", "assignment"],
  ["ujian", "Ujian & Tes", "quiz"],
  ["sertifikat", "Sertifikat", "workspace_premium"],
  ["berpikir", "Profil Berpikir", "psychology"],
] as const;
type Tab = (typeof TAB)[number][0];

export function RuangOrangTua() {
  const members = useRumila((s) => s.members);
  const [buka, setBuka] = useState(false);
  useEffect(() => setBuka(ruangTerbuka()), []);
  // kunci otomatis saat waktu habis
  useEffect(() => {
    if (!buka) return;
    const t = setInterval(() => !ruangTerbuka() && setBuka(false), 30_000);
    return () => clearInterval(t);
  }, [buka]);
  return (
    <div className="rapor-root min-h-dvh" style={{ background: "#fff0da", fontFamily: NUNITO, color: INK }}>
      <div className="mx-auto flex max-w-[980px] flex-col gap-5 px-4 py-4 sm:px-6" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}>
        {buka ? <Isi members={members} onKunci={() => (tutupRuang(), setBuka(false))} /> : <PinPad members={members} onBuka={() => setBuka(true)} />}
      </div>
    </div>
  );
}

/* ---------------- PIN ---------------- */

function PinPad({ members, onBuka }: { members: Member[]; onBuka: () => void }) {
  const [pin, setPin] = useState("");
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const adaPin = adminBerPin(members).length > 0;

  useEffect(() => {
    if (pin.length !== 4) return;
    setSibuk(true);
    void bukaDenganPin(members, pin).then((r) => {
      setSibuk(false);
      setPin("");
      if (r.ok) return onBuka();
      setPesan(r.alasan === "salah" ? `PIN salah. Sisa ${r.sisa} kali percobaan.` : r.alasan === "terkunci" ? `Terlalu banyak percobaan. Coba lagi ${Math.ceil((r.sisa ?? sisaKunci()) / 60000)} menit lagi.` : r.alasan === "tanpa_pin" ? "Belum ada PIN orang tua." : "PIN belum bisa diperiksa. Periksa koneksi.");
    });
  }, [pin, members, onBuka]);

  const tekan = (d: string) => !sibuk && setPin((p) => (p.length < 4 ? p + d : p));
  return (
    <div className="mx-auto mt-6 flex w-full max-w-[360px] flex-col items-center gap-5 text-center">
      <Link href="/beranda" className="self-start text-[14px] font-extrabold text-ink-3">
        ← Kembali
      </Link>
      <span className="flex size-16 items-center justify-center rounded-[20px] bg-white text-[#0567c2] shadow-[0_4px_0_rgba(11,37,69,.08)]">
        <Icon name="lock" size={34} />
      </span>
      <div>
        <h1 style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, lineHeight: 1.05 }}>Ruang Orang Tua</h1>
        <p className="mt-1 text-[14px] font-bold text-ink-3">{adaPin ? "Masukkan PIN Ayah/Ibu" : "PIN orang tua belum dibuat"}</p>
      </div>
      {adaPin ? (
        <>
          <div className="flex gap-3" aria-label={`${pin.length} dari 4 angka`}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="size-4 rounded-full" style={{ background: i < pin.length ? INK : "#e6dccd" }} />
            ))}
          </div>
          <p className="min-h-5 text-[13px] font-bold text-[#c2410c]" aria-live="polite">
            {pesan}
          </p>
          <div className="grid w-full grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((d, i) =>
              d === "" ? (
                <span key={i} />
              ) : (
                <button
                  key={i}
                  onClick={() => (d === "⌫" ? setPin((p) => p.slice(0, -1)) : tekan(d))}
                  aria-label={d === "⌫" ? "Hapus" : d}
                  className="h-16 rounded-[20px] bg-white text-[26px] font-extrabold shadow-[0_4px_0_rgba(11,37,69,.08)] active:translate-y-0.5"
                  style={{ fontFamily: BALOO }}
                >
                  {d}
                </button>
              ),
            )}
          </div>
        </>
      ) : (
        <p className={`${KARTU} p-4 text-[14px] font-bold text-ink-3`}>Buka Pengaturan → pilih profil Ayah/Ibu (admin) → pasang PIN 4 angka. Setelah itu Ruang Orang Tua bisa dibuka dengan PIN tersebut.</p>
      )}
    </div>
  );
}

/* ---------------- isi ---------------- */

function Isi({ members, onKunci }: { members: Member[]; onKunci: () => void }) {
  const versi = useProfilAkademiVersi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const anak = useMemo(() => anakRumah(members), [members, versi]);
  const [anakId, setAnakId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("ringkasan");
  const terpilih = anak.find((m) => m.id === anakId) ?? anak[0];

  return (
    <>
      <header className="no-print flex flex-wrap items-center gap-3">
        <Link href="/beranda" aria-label="Kembali" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
          <Icon name="arrow_back" size={22} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, lineHeight: 1.05 }}>Ruang Orang Tua</h1>
          <p className="text-[13px] font-bold text-ink-3">RINOYA Academy · laporan belajar anak</p>
        </div>
        <button onClick={onKunci} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-extrabold">
          <Icon name="lock" size={18} /> Kunci
        </button>
      </header>
      {!terpilih ? (
        <p className={`${KARTU} p-5 text-[14px] font-bold text-ink-3`}>Belum ada profil anak. Tambahkan anggota rumah lalu tandai sebagai anak di Pengaturan.</p>
      ) : (
        <>
          <div className="no-print flex flex-wrap gap-2" role="tablist" aria-label="Pilih anak">
            {anak.map((m) => {
              const on = m.id === terpilih.id;
              return (
                <button key={m.id} role="tab" aria-selected={on} onClick={() => setAnakId(m.id)} className="flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-[14px] font-extrabold" style={{ borderColor: on ? INK : "#f0e4d2", background: on ? INK : "#fff", color: on ? "#fff" : INK }}>
                  <MemberAvatar m={m} size={30} theme="playful" />
                  {m.name}
                </button>
              );
            })}
          </div>
          <nav className="no-print -mx-1 flex gap-1 overflow-x-auto px-1" aria-label="Bagian laporan">
            {TAB.map(([id, label, ikon]) => (
              <button key={id} onClick={() => setTab(id)} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-extrabold" style={{ background: tab === id ? "#0786eb" : "#fff", color: tab === id ? "#fff" : INK }}>
                <Icon name={ikon} size={18} /> {label}
              </button>
            ))}
          </nav>
          <Bagian key={`${terpilih.id}-${tab}`} anak={terpilih} tab={tab} />
        </>
      )}
    </>
  );
}

function Bagian({ anak, tab }: { anak: Member; tab: Tab }) {
  const [lihat, setLihat] = useState<string | null>(null);
  useEffect(() => void sinkronSiswa(anak.id), [anak.id]);
  if (tab === "rapor") return <RaporAnak anak={anak} />;
  if (tab === "sertifikat") return <LemariPiagam anak={anak} lihat={lihat} onLihat={setLihat} tertanam />;
  if (tab === "ujian") return <DaftarUjian anak={anak} />;
  if (tab === "berpikir") return <ProfilBerpikirOrtu anak={anak} />;
  return <Ringkasan anak={anak} />;
}

/* ---------------- ringkasan ---------------- */

function Ringkasan({ anak }: { anak: Member }) {
  const events = useEvents(anak.id);
  const { hasil, jenjang, modul, semester } = usePenghargaan(anak.id);
  const level = levelAnak(anak.id);
  const lv = levelMeta(level);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const peta = useMemo(() => petaJenjang(peng, kompetensiSelesai(events, PAKET), KOMPETENSI, level, TRACK_SLICE, progresMisi(events, PAKET), hasil), [peng, events, level, hasil]);
  const seminggu = Date.now() - 7 * 86400_000;
  const pekan = events.filter((e) => Date.parse(e.clientAt) >= seminggu);
  const menit = Math.round(pekan.filter((e) => e.type === "activity_end").reduce((n, e) => n + (Number((e.payload as { durationMs?: number }).durationMs) || 0), 0) / 60000);
  const jawab = pekan.filter((e) => e.type === "attempt");
  const benar = jawab.filter((e) => (e.payload as { correct?: boolean }).correct).length;
  const terakhir = [...hasil].sort((a, b) => (a.at < b.at ? 1 : -1))[0];

  const angka: [string, string][] = [
    ["Jenjang", `${lv.lokal} · Semester ${peta.semesterAktif}`],
    ["Misi selesai", `${peta.selesai} dari ${peta.total}`],
    ["Kompetensi inti dikuasai", `${peta.inti.dikuasai} dari ${peta.inti.total}`],
    ["Belajar 7 hari terakhir", `${menit} menit · ${hitungStreak(events)} hari aktif`],
    ["Jawaban 7 hari terakhir", jawab.length ? `${benar}/${jawab.length} benar (${Math.round((benar / jawab.length) * 100)}%)` : "belum ada"],
    ["Penghargaan", `${jenjang.length} jenjang · ${semester.length} semester · ${modul.length} modul`],
  ];
  return (
    <div className="flex flex-col gap-4">
      <section className={`${KARTU} grid grid-cols-1 gap-x-6 gap-y-3 p-5 sm:grid-cols-2`}>
        {angka.map(([k, v]) => (
          <div key={k}>
            <p className="text-[12px] font-extrabold tracking-wide text-ink-3 uppercase">{k}</p>
            <p style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>{v}</p>
          </div>
        ))}
      </section>
      <section className={`${KARTU} p-5`}>
        <p className="text-[12px] font-extrabold tracking-wide text-ink-3 uppercase">Langkah berikutnya</p>
        <p className="mt-1 text-[15px] font-bold">
          {peta.sekarang
            ? `Misi ${peta.sekarang.nomor}: ${peta.sekarang.kompetensi.statement.id}`
            : peta.ujian
              ? `${NAMA_UJIAN[peta.ujian.jenis]} ${peta.ujian.unit ? `· ${peta.ujian.unit.nama.id}` : peta.ujian.semester ? `· Semester ${peta.ujian.semester}` : ""}`
              : peta.lulusJenjang
                ? "Jenjang ini tuntas. Sertifikat Kenaikan Jenjang siap."
                : peta.pemantapan
                  ? `Latihan pemantapan: ${peta.pemantapan.kompetensi.statement.id}`
                  : "—"}
        </p>
        {terakhir && (
          <p className="mt-2 text-[13px] font-bold text-ink-3">
            Ujian terakhir: {NAMA_UJIAN[terakhir.jenis]} · nilai {terakhir.nilai} ({terakhir.lulus ? "lulus" : "belum lulus"}) · {tanggalJam(terakhir.at)}
          </p>
        )}
      </section>
    </div>
  );
}

/* ---------------- ujian & tes ---------------- */

function namaRuang(h: HasilUjian) {
  if (h.jenis === "kuis") return KOMPETENSI.find((c) => c.level === h.level && c.unit.id === h.ruang)?.unit.nama.id ?? h.ruang;
  if (h.jenis === "semester") return `Semester ${h.ruang.slice(1)}`;
  return levelMeta(h.level).nama;
}

function DaftarUjian({ anak }: { anak: Member }) {
  const { hasil } = usePenghargaan(anak.id);
  const urut = [...hasil].sort((a, b) => (a.at < b.at ? 1 : -1));
  const lulus = hasil.filter((h) => h.lulus);
  const rata = lulus.length ? Math.round(lulus.reduce((n, h) => n + h.nilai, 0) / lulus.length) : 0;
  return (
    <section className={`${KARTU} p-5`}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800 }}>Riwayat ujian & tes</h2>
        <p className="text-[13px] font-bold text-ink-3">
          {hasil.length} percobaan · {lulus.length} lulus{lulus.length ? ` · rata-rata nilai lulus ${rata}` : ""}
        </p>
      </div>
      {urut.length === 0 ? (
        <p className="text-[14px] font-bold text-ink-3">Belum ada ujian. Kuis Modul pertama muncul setelah semua misi satu modul selesai.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[13.5px]">
            <thead>
              <tr className="text-[11px] tracking-wide text-ink-3 uppercase">
                <th className="py-2 pr-3">Tanggal</th>
                <th className="py-2 pr-3">Ujian</th>
                <th className="py-2 pr-3">Jenjang</th>
                <th className="py-2 pr-3 text-right">Benar</th>
                <th className="py-2 pr-3 text-right">Nilai</th>
                <th className="py-2">Hasil</th>
              </tr>
            </thead>
            <tbody>
              {urut.map((h) => (
                <tr key={h.sessionId} className="border-t border-[#f1e6d6]">
                  <td className="py-2 pr-3 whitespace-nowrap">{tanggalJam(h.at)}</td>
                  <td className="py-2 pr-3">
                    <b>{NAMA_UJIAN[h.jenis]}</b> · {namaRuang(h)}
                  </td>
                  <td className="py-2 pr-3">{levelMeta(h.level).lokal}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {h.benar}/{h.total}
                  </td>
                  <td className="py-2 pr-3 text-right font-extrabold tabular-nums">{h.nilai}</td>
                  <td className="py-2">
                    <span className="rounded-full px-2.5 py-0.5 text-[12px] font-extrabold" style={{ background: h.lulus ? "#e3f6ec" : "#fff1e0", color: h.lulus ? "#13794a" : "#a34a00" }}>
                      {h.lulus ? predikat(h.nilai, h.jenis) : "Belum lulus"}
                      {h.pending ? " · menunggu sinkron" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
