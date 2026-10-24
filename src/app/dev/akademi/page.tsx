"use client";

// Pratinjau KHUSUS DEVELOPMENT Academy tanpa akun: daftar semua paket, ?paket=<id> menjalankan aktivitasnya.
// Bukti tersimpan hanya lokal (anggota demo bukan UUID, tidak dikirim ke server). Di produksi halaman ini 404.

import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ActivityRunner, judulPaket } from "@/components/akademi/runner";
import { PAKET, kompetensiUntuk } from "@/lib/akademi/konten";

function Daftar() {
  const byMek = new Map<string, typeof PAKET>();
  for (const p of PAKET) byMek.set(p.mechanic, [...(byMek.get(p.mechanic) ?? []), p]);
  return (
    <div className="mx-auto max-w-[900px] p-4 font-sans text-[#2b1d4e]">
      <h1 className="text-2xl font-black">Academy — {PAKET.length} paket</h1>
      <p className="mb-4 text-sm opacity-70">
        Portal: <Link className="underline" href="/akademi">/akademi</Link> (butuh akun). Klik paket untuk memainkannya tanpa akun.
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
  const paket = useSearchParams().get("paket");
  return paket ? <ActivityRunner paketId={paket} /> : <Daftar />;
}

export default function DevAkademi() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}
