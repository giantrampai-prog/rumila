// Tambah peta robot (navigasi) sampai tiap paket punya ≥ TARGET soal berbeda untuk 10 ronde.
// Peta baru diturunkan dari peta yang ada lewat transformasi yang menjaga makna program relatif
// (cermin/putar: kiri↔kanan ditukar bila dicerminkan; geser/perbesar papan), plus variasi jarak bintang
// untuk peta lurus tanpa program awal. Arah awal robot hanya boleh arah yang sudah dipakai paket itu.
// Tiap peta baru diverifikasi dengan optimal() dan jalankan() dari @akademi/mechanics.
//   npx tsx scripts/akademi-tambah-peta.ts [--tulis]

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ContentPack, type NavBlockJson, type NavGrid, type PaketNavigasi } from "../packages/schema/src/index";
import { dariJson, jalankan, optimal } from "../packages/mechanics/src/index";

const TARGET = 16;
/** Minimal soal berbeda pada nilai knob bawaan (distance/rocks/walls) — sesi pertama memakai knob bawaan. */
const TARGET_KNOB = 12;
const DIR = "content/paket/navigasi";
const tulis = process.argv.includes("--tulis");

type Arah = "N" | "E" | "S" | "W";
type Sel = { x: number; y: number };

const tukarProgram = (p: NavBlockJson[]): NavBlockJson[] =>
  p.map((b) => (b.cmd === "ulangi" ? { ...b, body: tukarProgram(b.body) } : b.cmd === "kiri" ? { cmd: "kanan" } : b.cmd === "kanan" ? { cmd: "kiri" } : b));

interface Ubah {
  nama: string;
  w: (g: NavGrid) => number;
  h: (g: NavGrid) => number;
  sel: (g: NavGrid, c: Sel) => Sel;
  arah: (d: Arah) => Arah;
  tukar: boolean;
}

const UBAH: Ubah[] = [
  { nama: "cermin-datar", w: (g) => g.w, h: (g) => g.h, sel: (g, c) => ({ x: g.w - 1 - c.x, y: c.y }), arah: (d) => ({ N: "N", S: "S", E: "W", W: "E" })[d] as Arah, tukar: true },
  { nama: "cermin-tegak", w: (g) => g.w, h: (g) => g.h, sel: (g, c) => ({ x: c.x, y: g.h - 1 - c.y }), arah: (d) => ({ N: "S", S: "N", E: "E", W: "W" })[d] as Arah, tukar: true },
  { nama: "putar-balik", w: (g) => g.w, h: (g) => g.h, sel: (g, c) => ({ x: g.w - 1 - c.x, y: g.h - 1 - c.y }), arah: (d) => ({ N: "S", S: "N", E: "W", W: "E" })[d] as Arah, tukar: false },
  { nama: "putar-kanan", w: (g) => g.h, h: (g) => g.w, sel: (g, c) => ({ x: g.h - 1 - c.y, y: c.x }), arah: (d) => ({ N: "E", E: "S", S: "W", W: "N" })[d] as Arah, tukar: false },
  { nama: "putar-kiri", w: (g) => g.h, h: (g) => g.w, sel: (g, c) => ({ x: c.y, y: g.w - 1 - c.x }), arah: (d) => ({ N: "W", W: "S", S: "E", E: "N" })[d] as Arah, tukar: false },
];

function terapkan(g: NavGrid, u: Ubah): NavGrid {
  const s = u.sel(g, g.start);
  return {
    ...g,
    id: `${g.id}-${u.nama}`,
    w: u.w(g),
    h: u.h(g),
    start: { ...s, dir: u.arah(g.start.dir) },
    goal: u.sel(g, g.goal),
    walls: g.walls.map((c) => u.sel(g, c)),
    rocks: g.rocks.map((c) => u.sel(g, c)),
    ...(g.program ? { program: u.tukar ? tukarProgram(g.program) : g.program } : {}),
  };
}

/** Papan diperbesar `tw`×`th` dan isi digeser (`dx`,`dy`). */
function geser(g: NavGrid, tw: number, th: number, dx: number, dy: number): NavGrid {
  const m = (c: Sel) => ({ x: c.x + dx, y: c.y + dy });
  return { ...g, id: `${g.id}-papan-${g.w + tw}x${g.h + th}-${dx}${dy}`, w: g.w + tw, h: g.h + th, start: { ...g.start, ...m(g.start) }, goal: m(g.goal), walls: g.walls.map(m), rocks: g.rocks.map(m) };
}

const DELTA: Record<Arah, Sel> = { N: { x: 0, y: -1 }, E: { x: 1, y: 0 }, S: { x: 0, y: 1 }, W: { x: -1, y: 0 } };

/** Jalur lurus tanpa belokan: bintang dipindah maju/mundur sepanjang arah robot. */
function variasiJarak(g: NavGrid, n: number): NavGrid {
  const d = DELTA[g.start.dir];
  return { ...g, id: `${g.id}-bintang${n > 0 ? "-jauh" : "-dekat"}${Math.abs(n)}`, goal: { x: g.goal.x + d.x * n, y: g.goal.y + d.y * n } };
}

const kunciGrid = (g: NavGrid) => JSON.stringify([g.w, g.h, g.start, g.goal, [...g.walls].sort((a, b) => a.x - b.x || a.y - b.y), [...g.rocks].sort((a, b) => a.x - b.x || a.y - b.y), g.program ?? null]);
const dalam = (g: NavGrid, c: Sel) => c.x >= 0 && c.y >= 0 && c.x < g.w && c.y < g.h;
const sama = (a: Sel, b: Sel) => a.x === b.x && a.y === b.y;

/** Peta sah & setara dengan templatnya untuk paket ini. */
function sah(p: PaketNavigasi, t: NavGrid, g: NavGrid, rentang: [number, number], arahBoleh: Set<string>, ukuranMaks: [number, number]): boolean {
  if (g.w < 2 || g.h < 1 || g.w > Math.min(10, ukuranMaks[0]) || g.h > Math.min(10, ukuranMaks[1])) return false;
  if (!arahBoleh.has(g.start.dir)) return false;
  const sel = [g.start, g.goal, ...g.walls, ...g.rocks];
  if (!sel.every((c) => dalam(g, c))) return false;
  if (sama(g.start, g.goal) || [...g.walls, ...g.rocks].some((c) => sama(c, g.goal) || sama(c, g.start))) return false;
  const opt = optimal(g, p.commands);
  if (opt === null || opt < rentang[0] || opt > rentang[1]) return false;
  if (opt !== g.optimal) return false;
  if (g.rackSlots !== undefined && g.rackSlots < 1) return false;
  if (g.program) {
    const a = jalankan(t, dariJson(t.program!));
    const b = jalankan(g, dariJson(g.program));
    if (a.outcome !== b.outcome || a.executed !== b.executed) return false;
  }
  return true;
}

let ringkas = 0;
for (const f of readdirSync(DIR).filter((x) => x.endsWith(".json")).sort()) {
  const path = join(DIR, f);
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const p = ContentPack.parse(raw) as PaketNavigasi;
  const knob = (raw.knobs?.distance ?? {}) as { min?: number; max?: number };
  const opts = p.grids.map((g) => g.optimal);
  const rentang: [number, number] = [Math.min(knob.min ?? Infinity, ...opts), Math.max(knob.max ?? -Infinity, ...opts)];
  const arahBoleh = new Set(p.grids.map((g) => g.start.dir));
  const ukuranMaks: [number, number] = [Math.max(...p.grids.map((g) => Math.max(g.w, g.h))) + 1, Math.max(...p.grids.map((g) => Math.max(g.w, g.h))) + 1];
  const lurusBebas = !p.debug && !p.semuaGrid && !p.prediksi && p.commands.every((c) => c === "maju" || c === "ulangi" || c === "lompat");

  // satuan soal: grid biasa, atau satu kelompok (semuaGrid)
  const kelompok: NavGrid[][] = p.semuaGrid ? [...new Map(p.grids.map((g) => [g.group!, p.grids.filter((x) => x.group === g.group)])).values()] : p.grids.map((g) => [g]);
  const sudah = new Set(kelompok.map((k) => k.map(kunciGrid).join("|")));
  const idDipakai = new Set(p.grids.map((g) => g.id));
  const baru: NavGrid[][] = [];

  // kandidat per templat, diselang-seling antartemplat supaya variasi merata
  const turunan = (k: NavGrid[]): NavGrid[][] => {
    const out: NavGrid[][] = [];
    for (const u of UBAH) out.push(k.map((g) => terapkan(g, u)));
    const g0 = k[0];
    for (const [tw, th] of [[1, 0], [0, 1], [1, 1], [2, 0], [0, 2]])
      for (let dx = 0; dx <= tw; dx++) for (let dy = 0; dy <= th; dy++) if (dx || dy || tw || th) out.push(k.map((g) => geser(g, tw, th, dx, dy)));
    if (lurusBebas && k.length === 1 && !g0.walls.length) for (const n of [1, -1, 2, -2]) out.push([variasiJarak(g0, n)].map((g) => ({ ...g, optimal: optimal(g, p.commands) ?? 0 })));
    // kombinasi: transform lalu geser
    for (const u of UBAH) for (const [tw, th] of [[1, 0], [0, 1]]) out.push(k.map((g) => geser(terapkan(g, u), tw, th, tw, th)));
    return out;
  };
  // knob bawaan: saringan sama dengan buatRondeNavigasi (tiap saringan dipakai hanya bila menyisakan kandidat)
  const bawaan = Object.fromEntries(Object.entries((raw.knobs ?? {}) as Record<string, { default?: number }>).map(([k, v]) => [k, v.default]));
  const saringan: Array<(g: NavGrid) => boolean> = [];
  if (bawaan.distance !== undefined) saringan.push((g) => (optimal(g, p.commands) ?? g.optimal) === bawaan.distance);
  if (bawaan.rocks !== undefined) saringan.push((g) => g.rocks.length === bawaan.rocks);
  if (bawaan.walls !== undefined) saringan.push((g) => g.walls.length === bawaan.walls);
  const aktif: Array<(g: NavGrid) => boolean> = [];
  for (const f of saringan) if (kelompok.some((k) => [...aktif, f].every((h) => h(k[0])))) aktif.push(f);
  const cocokKnob = (g: NavGrid) => aktif.every((h) => h(g));
  const diKnob = aktif.length ? kelompok.filter((k) => cocokKnob(k[0])) : [];
  const isi = (templat: NavGrid[][], butuh: number, syarat: (k: NavGrid[]) => boolean) => {
    const antrean = templat.map(turunan);
    const awal = baru.length;
    for (let i = 0; baru.length - awal < butuh && antrean.some((a) => i < a.length); i++)
      for (let t = 0; t < antrean.length && baru.length - awal < butuh; t++) {
        const k = antrean[t][i];
        if (!k || !syarat(k)) continue;
        if (!k.every((g, j) => sah(p, templat[t][j], g, rentang, arahBoleh, ukuranMaks))) continue;
      const kunci = k.map(kunciGrid).join("|");
      if (sudah.has(kunci)) continue;
      sudah.add(kunci);
      const grup = p.semuaGrid ? `${k[0].group}-v${baru.length + 1}` : undefined;
        baru.push(
          k.map((g) => {
            let id = g.id.replace(/[^a-z0-9-]/g, "").slice(0, 60);
            while (idDipakai.has(id)) id = `${id}-b`;
            idDipakai.add(id);
            return { ...g, id, ...(grup ? { group: grup } : {}) };
          }),
        );
      }
  };
  // 1) stok knob bawaan dulu (turunan dari peta di knob itu, lalu turunan tingkat dua), 2) stok total
  if (diKnob.length) {
    isi(diKnob, Math.max(0, TARGET_KNOB - diKnob.length), (k) => cocokKnob(k[0]));
    const kurang = TARGET_KNOB - diKnob.length - baru.length;
    if (kurang > 0) isi([...baru], kurang, (k) => cocokKnob(k[0]));
  }
  isi(kelompok, Math.max(0, TARGET - kelompok.length - baru.length), () => true);
  const nKnob = diKnob.length ? [...kelompok, ...baru].filter((k) => cocokKnob(k[0])).length : -1;

  const total = kelompok.length + baru.length;
  const kurangKnob = nKnob >= 0 && nKnob < TARGET_KNOB;
  console.log(`${p.id.padEnd(34)} ${kelompok.length} → ${total}  knob ${diKnob.length} → ${nKnob}${total < TARGET || kurangKnob ? "  ⚠ kurang" : ""}`);
  if (total < TARGET || kurangKnob) ringkas++;
  if (tulis && baru.length) {
    raw.grids = [...raw.grids, ...baru.flat()];
    writeFileSync(path, JSON.stringify(raw, null, 2) + "\n");
  }
}
console.log(ringkas ? `${ringkas} paket belum mencapai ${TARGET}` : `semua paket ≥ ${TARGET} soal`);
