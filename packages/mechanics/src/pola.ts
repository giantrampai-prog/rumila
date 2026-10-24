// Mekanik pola: lanjut (isi slot kosong di ujung), perbaiki (satu unsur tertukar, ganti tepat satu), cipta (susun pola berulang sendiri).
// Knob yang dibaca bila ada: shown (ulangan penuh yang ditampilkan, default 3), blanks (slot kosong 1–3, default 1),
// distractor (0/1 pengecoh di palette, default 1), slots (cipta: 4–9, default 6), posisi (perbaiki: 0 = tengah, 1 = ujung).
// Unit pola: salah satu `patterns` bila ada, kalau tidak `unitLen` benda berbeda acak dari items.

import type { PaketPola } from "@akademi/schema";
import { acak, acakInt, pilihSatu, rng } from "./rng";
import type { Hasil, JawabanPola, Knobs, RondePola } from "./types";

type Item = PaketPola["items"][number];

const PANJANG_PERBAIKI = 8;

function jepit(n: number | undefined, min: number, max: number, def: number): number {
  if (n === undefined || !Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

/** Satuan pola (id benda): dari patterns bila terisi, kalau tidak dari items acak. */
function pilihUnit(p: PaketPola, r: () => number): string[] {
  const ada = new Set(p.items.map(i => i.id));
  const sah = p.patterns.filter(pt => pt.unit.every(id => ada.has(id)));
  if (sah.length) return pilihSatu(sah, r).unit.slice();
  const n = Math.min(p.unitLen, p.items.length);
  return acak(p.items, r).slice(0, n).map(i => i.id);
}

/** Palette = benda unit + `distractor` pengecoh (benda di luar unit), diacak. */
function buatPalette(p: PaketPola, unit: string[], distractor: number, r: () => number): Item[] {
  const byId = new Map(p.items.map(i => [i.id, i] as const));
  const dalam = unit.map(id => byId.get(id)).filter((i): i is Item => !!i);
  const luar = acak(p.items.filter(i => !unit.includes(i.id)), r).slice(0, Math.max(0, distractor));
  return acak([...dalam, ...luar], r);
}

export function buatRondePola(p: PaketPola, knobs: Knobs, seed: number): RondePola {
  const r = rng(seed);
  const unit = pilihUnit(p, r);
  const unitLen = unit.length;
  const periodik = (n: number) => Array.from({ length: n }, (_, i) => unit[i % unitLen]);

  if (p.mode === "cipta") {
    const slots = Math.max(jepit(knobs.slots, 4, 9, 6), 2 * unitLen);
    return {
      mode: "cipta", unitLen, palette: acak(p.items, r), correct: [],
      shown: new Array<string | null>(slots).fill(null), pilih: unitLen,
    };
  }

  if (p.mode === "perbaiki") {
    const n = PANJANG_PERBAIKI;
    const correct = periodik(n);
    const diTengah = jepit(knobs.posisi, 0, 1, 0) === 0;
    const wrongIndex = diTengah ? pilihSatu([3, 4], r) : pilihSatu([0, 1, n - 2, n - 1], r);
    const asli = correct[wrongIndex];
    const tetangga = new Set([correct[wrongIndex - 1], correct[wrongIndex + 1]].filter((x): x is string => !!x));
    let kandidat = p.items.filter(i => i.id !== asli && !tetangga.has(i.id));
    if (!kandidat.length) kandidat = p.items.filter(i => i.id !== asli);
    const pengganti = pilihSatu(kandidat, r).id;
    const shown: (string | null)[] = correct.slice();
    shown[wrongIndex] = pengganti;
    return { mode: "perbaiki", unitLen, palette: acak(p.items, r), correct, shown, wrongIndex };
  }

  // lanjut
  const shownUlang = jepit(knobs.shown, 1, 6, 3);
  const blanks = jepit(knobs.blanks, 1, 3, 1);
  const distractor = jepit(knobs.distractor, 0, p.items.length, 1);
  const correct = periodik(shownUlang * unitLen + blanks);
  const shown: (string | null)[] = correct.map((id, i) => (i >= correct.length - blanks ? null : id));
  return { mode: "lanjut", unitLen, palette: buatPalette(p, unit, distractor, r), correct, shown };
}

export function nilaiPola(r: RondePola, j: JawabanPola): Hasil {
  const jawab = Array.isArray(j) ? j : [];

  if (r.mode === "lanjut") {
    const salah: number[] = [];
    for (let i = 0; i < r.correct.length; i++) if (jawab[i] !== r.correct[i]) salah.push(i);
    return { benar: salah.length === 0 && jawab.length === r.correct.length, detail: { salah } };
  }

  if (r.mode === "perbaiki") {
    const diubah: number[] = [];
    for (let i = 0; i < r.shown.length; i++) if (jawab[i] !== r.shown[i]) diubah.push(i);
    const samaDenganBenar = jawab.length === r.correct.length && r.correct.every((id, i) => jawab[i] === id);
    return { benar: samaDenganBenar && diubah.length === 1, detail: { diubah, wrongIndex: r.wrongIndex ?? -1 } };
  }

  // cipta: pola berulang boleh mulai dari unsur mana pun (BABABA sah)
  const n = r.shown.length;
  const unitLen = r.pilih ?? r.unitLen;
  const diPalette = new Set(r.palette.map(i => i.id));
  const bendaBerbeda = new Set(jawab).size;
  const panjangPas = jawab.length === n;
  const semuaSah = jawab.every(id => diPalette.has(id));
  const periodik = panjangPas && jawab.every((id, i) => id === jawab[i % unitLen]);
  const ulanganPenuh = Math.floor(n / unitLen);
  const benar = panjangPas && semuaSah && bendaBerbeda === unitLen && periodik && ulanganPenuh >= 2;
  return { benar, detail: { periodik, jumlahBenda: bendaBerbeda, panjang: jawab.length, ulanganPenuh } };
}
