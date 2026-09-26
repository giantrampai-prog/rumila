"use client";

// Pratinjau KHUSUS DEVELOPMENT untuk tampilan anak tanpa akun (pakai data demo lokal).
// ?p=beranda | koleksi | gerbang | <id dunia>. Di produksi halaman ini 404.

import { notFound, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Beranda from "@/app/(app)/beranda/page";
import Koleksi from "@/app/(app)/koleksi/page";
import { KidFrame, KidHeader, ParentGate } from "@/components/kid";
import { SheetHost } from "@/components/sheets";
import { WorldView } from "@/components/world";
import { getFolder } from "@/lib/catalog";

function Preview() {
  const p = useSearchParams().get("p") ?? "beranda";
  if (p === "gerbang") return <KidFrame><ParentGate /></KidFrame>;
  return (
    <KidFrame overlay={<SheetHost />}>
      <KidHeader />
      {p === "beranda" ? <Beranda /> : p === "koleksi" ? <Koleksi /> : <WorldView f={getFolder(p) ?? getFolder("game")!} />}
    </KidFrame>
  );
}

export default function DevKid() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}
