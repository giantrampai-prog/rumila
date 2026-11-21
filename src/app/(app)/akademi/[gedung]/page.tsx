"use client";

import { notFound, useParams } from "next/navigation";
import { GedungView } from "@/components/kampus";
import { getGedung } from "@/lib/kampus";

export default function GedungPage() {
  const { gedung } = useParams<{ gedung: string }>();
  const g = getGedung(gedung);
  if (!g) notFound();
  return <GedungView g={g} />;
}
