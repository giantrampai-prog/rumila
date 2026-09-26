// Validasi manifest: ID unik, referensi parent/child/part, unit, rentang, kapabilitas punya konten.

import type { AngkasaManifest } from "./types";

export function validateManifest(m: AngkasaManifest): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  for (const o of m.objects) {
    if (ids.has(o.id)) errs.push(`ID objek ganda: ${o.id}`);
    ids.add(o.id);
  }
  const partIds = new Set<string>();
  for (const p of m.parts) {
    if (partIds.has(p.id)) errs.push(`ID bagian ganda: ${p.id}`);
    partIds.add(p.id);
    if (!ids.has(p.objectId))
      errs.push(`Bagian ${p.id} menunjuk objek tak dikenal ${p.objectId}`);
    if (
      p.outerFrac !== undefined &&
      p.innerFrac !== undefined &&
      !(p.outerFrac > p.innerFrac)
    )
      errs.push(`Bagian ${p.id}: radius luar harus > dalam`);
  }
  const srcIds = new Set(m.sources.map((s) => s.id));
  for (const o of m.objects) {
    if (o.parentId && !ids.has(o.parentId))
      errs.push(`${o.id}: parent ${o.parentId} tidak ada`);
    for (const c of o.childObjectIds)
      if (!ids.has(c)) errs.push(`${o.id}: child ${c} tidak ada`);
    for (const p of o.partIds) {
      if (!partIds.has(p)) errs.push(`${o.id}: part ${p} tidak ada`);
      else if (m.parts.find((x) => x.id === p)!.objectId !== o.id)
        errs.push(`${o.id}: part ${p} milik objek lain`);
    }
    for (const s of o.sourceIds)
      if (!srcIds.has(s)) errs.push(`${o.id}: sumber ${s} tidak ada`);
    for (const f of o.keyFacts) {
      if (!f.qty.unit) errs.push(`${o.id}/${f.label}: satuan kosong`);
      if (!srcIds.has(f.qty.sourceId))
        errs.push(`${o.id}/${f.label}: sumber ${f.qty.sourceId} tidak ada`);
      if (
        /satelit/i.test(f.label) &&
        f.qty.value !== null &&
        !f.qty.sourceUpdatedAt
      )
        errs.push(`${o.id}: jumlah satelit tanpa tanggal sumber`);
    }
    if (o.radius.value !== null && o.radius.value <= 0)
      errs.push(`${o.id}: radius harus > 0 atau null`);
    if (
      o.equatorialRadius?.value &&
      o.radius.value &&
      o.equatorialRadius.value < o.radius.value
    )
      errs.push(`${o.id}: radius ekuator < radius rata-rata`);
    const p = o.orbitModel?.parameters;
    if (p && !(p.periodDays > 0)) errs.push(`${o.id}: periode orbit harus > 0`);
    // Kapabilitas harus didukung konten
    if (
      o.capabilities.includes("rings") &&
      !o.partIds.some((x) => x.endsWith(".rings"))
    )
      errs.push(`${o.id}: kapabilitas cincin tanpa bagian cincin`);
    if (
      o.capabilities.includes("interior") &&
      !m.parts.some((x) => x.objectId === o.id && x.outerFrac !== undefined)
    )
      errs.push(`${o.id}: kapabilitas struktur tanpa lapisan`);
    if (o.capabilities.includes("moons") && !o.childObjectIds.length)
      errs.push(`${o.id}: kapabilitas satelit tanpa satelit`);
    if (
      !o.hasSolidSurface &&
      o.classification.startsWith("Raksasa") &&
      !o.surfaceNote
    )
      errs.push(`${o.id}: raksasa tanpa catatan 'tidak ada permukaan padat'`);
  }
  for (const qz of m.quiz) {
    if (qz.kind === "object" && !ids.has(qz.answer))
      errs.push(`Soal ${qz.id}: jawaban objek ${qz.answer} tidak ada`);
    if (qz.kind === "choice" && !qz.options?.includes(qz.answer))
      errs.push(`Soal ${qz.id}: jawaban tidak ada di pilihan`);
  }
  return errs;
}
