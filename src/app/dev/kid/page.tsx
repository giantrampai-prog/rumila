"use client";

// Pratinjau KHUSUS DEVELOPMENT untuk tampilan anak tanpa akun (pakai data demo lokal).
// ?p=beranda | <id gedung> (lab, komputer, taman, musala). Di produksi halaman ini 404.

import { notFound, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Beranda from "@/app/(app)/beranda/page";
import { KidFrame, KidHeader } from "@/components/kid";
import { SheetHost } from "@/components/sheets";
import { GedungView } from "@/components/kampus";
import { GEDUNG, getGedung } from "@/lib/kampus";

function Preview() {
  const p = useSearchParams().get("p") ?? "beranda";
  return (
    <KidFrame overlay={<SheetHost />}>
      <KidHeader />
      {p === "beranda" ? <Beranda /> : <GedungView g={getGedung(p) ?? GEDUNG[0]} />}
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
