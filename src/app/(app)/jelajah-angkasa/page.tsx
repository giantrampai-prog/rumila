"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Explorer } from "@/components/angkasa/explorer";
import { MANIFEST } from "@/lib/angkasa/manifest";
import type { Mode } from "@/lib/angkasa/state";
import { validateManifest } from "@/lib/angkasa/validate";
import { useMe } from "@/lib/store";

function Page() {
  const me = useMe();
  const params = useSearchParams();
  const errors = useMemo(() => validateManifest(MANIFEST), []);
  if (errors.length)
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold">Katalog Jelajah Angkasa belum valid</h1>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </main>
    );
  // key = anggota: berganti profil → state & progres terpisah
  return (
    <Explorer
      key={me.id}
      memberId={me.id}
      initial={{ obj: params.get("obj") ?? undefined, mode: (params.get("mode") as Mode) ?? undefined }}
    />
  );
}

export default function JelajahAngkasaPage() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}
