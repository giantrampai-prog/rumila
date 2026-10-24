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
import { snapshotSertifikat } from "@/lib/akademi/sertifikat";
import { KOMPETENSI } from "@/lib/akademi/konten";
import type { Penguasaan } from "@/lib/akademi/mastery";
import { PAKET, kompetensiUntuk } from "@/lib/akademi/konten";

function Daftar() {
  const byMek = new Map<string, typeof PAKET>();
  for (const p of PAKET) byMek.set(p.mechanic, [...(byMek.get(p.mechanic) ?? []), p]);
  return (
    <div className="mx-auto max-w-[900px] p-4 font-sans text-[#2b1d4e]">
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
  if (q.get("telemetri")) return <TelemetriView />;
  if (q.get("kartu")) {
    // contoh kartu sertifikat dengan semua kompetensi inti PAUD dianggap dikuasai
    const peng: Record<string, Penguasaan> = Object.fromEntries(KOMPETENSI.map((c) => [c.id, { status: "dikuasai", success: 5, fail: 0, contexts: 2, days: 2, ratioLast10: 1, hintTail: 0 } as Penguasaan]));
    return <div className="mx-auto max-w-[1000px] p-4"><SertifikatKartu nama="Dek Nara" level="PAUD" kode="K7M2P9XA" issuedAt={new Date().toISOString()} snapshot={snapshotSertifikat(peng, KOMPETENSI, "PAUD")} /></div>;
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
