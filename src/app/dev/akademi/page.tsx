"use client";

// Pratinjau KHUSUS DEVELOPMENT Academy tanpa akun: daftar semua paket, ?paket=<id> menjalankan aktivitasnya.
// Bukti tersimpan hanya lokal (anggota demo bukan UUID, tidak dikirim ke server). Di produksi halaman ini 404.

import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ActivityRunner, judulPaket } from "@/components/akademi/runner";
import { TrackView } from "@/components/akademi/portal/track";
import { KidFrame } from "@/components/kid";
import AkademiPortal from "@/app/(app)/akademi/page";
import { TelemetriView } from "@/components/akademi/portal/telemetri";
import { SertifikatKartu } from "@/components/akademi/sertifikat";
import { PiagamModulKartu, SertifikatSemesterKartu, TranskripJenjang } from "@/components/akademi/piagam";
import { BUKU_PRINT_CSS, BukuSertifikat } from "@/components/akademi/buku-sertifikat";
import { snapshotSertifikat } from "@/lib/akademi/sertifikat";
import { KOMPETENSI } from "@/lib/akademi/konten";
import type { LevelId } from "@akademi/schema";
import { LayarUjian } from "@/components/akademi/ujian";
import { ProfilBerpikirOrtu, TesBerpikir } from "@/components/ortu/profil-berpikir";
import { RuangOrangTua } from "@/components/ortu/ruang";
import { useMe, useRumila, type Member } from "@/lib/store";
import { KartuKampus } from "@/components/kampus";
import { WorldView } from "@/components/world";
import { getFolder } from "@/lib/catalog";

function KampusDev() {
  const me = useMe();
  const q = useSearchParams();
  // ?kampus=m4 → lihat sebagai anggota demo lain (mis. anak) untuk menguji kunci Laboratorium
  useEffect(() => {
    const id = q.get("kampus");
    if (id && id !== "1") useRumila.getState().switchMember(id);
  }, [q]);
  const f = getFolder("angkasa")!;
  return (
    <>
      <KartuKampus me={me} />
      <WorldView f={f} />
    </>
  );
}

const DEMO: Member = { id: "dev-anak", name: "Dek Nara", c: "orange", admin: false, perms: [] } as unknown as Member;
import PenempatanPage from "@/app/(app)/akademi/penempatan/page";
import { cakupanUjian } from "@/lib/akademi/ruang-ujian";
import { JENIS_UJIAN } from "@/lib/akademi/ujian";
import type { Penguasaan } from "@/lib/akademi/mastery";
import { PAKET, kompetensiUntuk } from "@/lib/akademi/konten";

function Daftar() {
  const byMek = new Map<string, typeof PAKET>();
  for (const p of PAKET) byMek.set(p.mechanic, [...(byMek.get(p.mechanic) ?? []), p]);
  return (
    <div className="mx-auto max-w-[900px] p-4 font-sans text-[#0b2545]">
      <h1 className="text-2xl font-black">Academy — {PAKET.length} paket</h1>
      <p className="mb-4 text-sm opacity-70">
        Pratinjau: <Link className="underline" href="/dev/akademi?portal=1">portal</Link> · <Link className="underline" href="/dev/akademi?track=MAT">peta MAT</Link> · <Link className="underline" href="/dev/akademi?track=KODE">peta KODE</Link>. Klik paket untuk memainkannya tanpa akun.
      </p>
      {[...byMek.entries()].map(([mek, list]) => (
        <section key={mek} className="mb-6">
          <h2 className="mb-2 text-lg font-extrabold capitalize">{mek} · {list.length}</h2>
          <ul className="grid gap-1 sm:grid-cols-2">
            {list.map((p) => (
              <li key={p.id} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                <Link href={`/dev/akademi?paket=${p.id}`} className="font-bold underline">{judulPaket(p)}</Link>
                <span className="ml-2 text-xs opacity-60">{p.level} · {(p as { mode?: string }).mode ?? (p as { execMode?: string }).execMode}</span>
                <div className="text-xs opacity-70">{kompetensiUntuk(p.id).map((c) => c.id).join(", ")}</div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Preview() {
  // Portal membaca bukti dari localStorage → render hanya di klien (di aplikasi asli AppShell sudah menjaganya).
  const [siap, setSiap] = useState(false);
  useEffect(() => setSiap(true), []);
  const q = useSearchParams();
  if (!siap) return null;
  const paket = q.get("paket"), track = q.get("track");
  if (paket) return <ActivityRunner paketId={paket} />;
  if (track) return <KidFrame><TrackView track={track} /></KidFrame>;
  if (q.get("portal")) return <KidFrame><AkademiPortal /></KidFrame>;
  if (q.get("penempatan")) return <PenempatanPage />;
  if (q.get("berpikir") === "tes") return <TesBerpikir anak={DEMO} kembaliKe="/dev/akademi?berpikir=hasil" />;
  if (q.get("berpikir")) return <div className="mx-auto max-w-[900px] bg-[#fff0da] p-4"><ProfilBerpikirOrtu anak={DEMO} /></div>;
  if (q.get("ortu")) return <RuangOrangTua />;
  if (q.get("kampus")) return <KidFrame><KampusDev /></KidFrame>;
  const ujian = JENIS_UJIAN.find((j) => j === q.get("ujian"));
  if (ujian) {
    const lv = (q.get("level") ?? "PAUD") as LevelId;
    const ruang = q.get("ruang") ?? "";
    const ids = cakupanUjian(ujian, lv, ruang, KOMPETENSI) ?? [];
    return <LayarUjian jenis={ujian} level={lv} ruang={ruang} kompetensiIds={ids} judul={ruang || lv} kembaliKe="/dev/akademi?portal=1" />;
  }
  if (q.get("telemetri")) return <TelemetriView />;
  if (q.get("kartu")) {
    // contoh kartu sertifikat dengan semua kompetensi inti PAUD dianggap dikuasai
    const peng: Record<string, Penguasaan> = Object.fromEntries(KOMPETENSI.map((c) => [c.id, { status: "dikuasai", success: 5, fail: 0, contexts: 2, days: 2, ratioLast10: 1, hintTail: 0 } as Penguasaan]));
    const snap = { ...snapshotSertifikat(peng, KOMPETENSI, "PAUD"), nilai: 92, predikat: "Dengan Pujian", ujian: [{ jenis: "kenaikan", ruang: "", nilai: 92 }, { jenis: "semester", ruang: "S1", nilai: 88 }, { jenis: "kuis", ruang: "BILANGAN-1-5", nilai: 90 }] };
    const at = new Date().toISOString();
    const contohSemester = { level: "PAUD" as const, ke: 1 as const, nilai: 88, nilaiAkhir: 88, perPelajaran: [{ track: "MAT" as const, nilai: 90, modul: 2 }, { track: "KODE" as const, nilai: 86, modul: 1 }, { track: "SAINS" as const, nilai: 88, modul: 2 }], at, sessionId: "ab12cd34-0000-4000-8000-000000000000" };
    if (q.get("kartu") === "buku")
      return (
        <div className="sertifikat-root bg-[#fff0da] p-4">
          <style>{BUKU_PRINT_CSS}</style>
          <BukuSertifikat nama="Dek Nara Salsabila" level="PAUD" kode="K7M2P9XA" nomor="RA/2026/PAUD/000001" issuedAt={at} snapshot={{ ...snap, ujian: [...snap.ujian, { jenis: "semester", ruang: "S2", nilai: 84 }, ...KOMPETENSI.filter((c) => c.level === "PAUD").map((c) => c.unit.id).filter((u, i, xs) => xs.indexOf(u) === i).map((u, i) => ({ jenis: "kuis", ruang: u, nilai: 78 + ((i * 7) % 22) }))] }} foto={q.get("foto") ?? null} />
        </div>
      );
    return (
      <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-6 bg-[#fff0da] p-4">
        <PiagamModulKartu nama="Dek Nara" p={{ level: "PAUD", unitId: "BILANGAN-1-5", track: "MAT", ke: 1, nama: { id: "Bilangan 1–5", en: "Numbers 1–5" }, nilai: 90, at, sessionId: "x" }} />
        <SertifikatSemesterKartu nama="Dek Nara" s={contohSemester} />
        <SertifikatKartu nama="Dek Nara" level="PAUD" kode="K7M2P9XA" nomor="RA/2026/PAUD/000001" issuedAt={at} snapshot={snap} />
        <TranskripJenjang nama="Dek Nara" level="PAUD" kode="K7M2P9XA" nomor="RA/2026/PAUD/000001" issuedAt={at} snapshot={snap} />
      </div>
    );
  }
  return <Daftar />;
}

export default function DevAkademi() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}
