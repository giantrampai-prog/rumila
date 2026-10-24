// Mekanik navigasi (Agam ke bintang): interpreter blok, BFS optimal, pemilihan grid, dan penilaian.
// Semantik blok dikunci di docs/akademi/mekanik-navigasi.md. Arah: N = y−1, E = x+1, S = y+1, W = x−1.

import type { NavBlockJson, NavCommand, PaketNavigasi } from "@akademi/schema";
import { pilihSatu, rng } from "./rng";
import type { Arah, Hasil, JawabanNavigasi, Knobs, NavBlock, NavGrid, NavRun, NavState, NavStep, RondeNavigasi } from "./types";

const DELTA: Record<Arah, { dx: number; dy: number }> = { N: { dx: 0, dy: -1 }, E: { dx: 1, dy: 0 }, S: { dx: 0, dy: 1 }, W: { dx: -1, dy: 0 } };
const PUTAR: Record<Arah, { kiri: Arah; kanan: Arah }> = {
  N: { kiri: "W", kanan: "E" }, E: { kiri: "N", kanan: "S" }, S: { kiri: "E", kanan: "W" }, W: { kiri: "S", kanan: "N" },
};

type Dasar = "maju" | "lompat" | "kiri" | "kanan" | "kalau";

const samaSel = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x === b.x && a.y === b.y;
const diLuar = (g: NavGrid, c: { x: number; y: number }) => c.x < 0 || c.y < 0 || c.x >= g.w || c.y >= g.h;
const adaDinding = (g: NavGrid, c: { x: number; y: number }) => g.walls.some(w => samaSel(w, c));
const adaBatu = (g: NavGrid, c: { x: number; y: number }) => g.rocks.some(b => samaSel(b, c));
const maju = (s: NavState, n: number) => ({ x: s.x + DELTA[s.dir].dx * n, y: s.y + DELTA[s.dir].dy * n });

/** Satu blok dasar dari keadaan `s`. `berhenti` = program harus berhenti (tersandung/tabrak). */
function langkahDasar(g: NavGrid, s: NavState, cmd: Dasar): { cmd: NavStep["cmd"]; kind: NavStep["kind"]; after: NavState; berhenti: boolean } {
  if (cmd === "kiri" || cmd === "kanan") return { cmd, kind: "turn", after: { ...s, dir: PUTAR[s.dir][cmd] }, berhenti: false };
  const nyata: "maju" | "lompat" = cmd === "kalau" ? (adaBatu(g, maju(s, 1)) ? "lompat" : "maju") : cmd;
  if (nyata === "maju") {
    const ke = maju(s, 1);
    if (diLuar(g, ke) || adaDinding(g, ke)) return { cmd: "maju", kind: "bump", after: s, berhenti: true };
    if (adaBatu(g, ke)) return { cmd: "maju", kind: "stumble", after: s, berhenti: true };
    return { cmd: "maju", kind: "move", after: { ...s, ...ke }, berhenti: false };
  }
  const ke = maju(s, 2);
  if (diLuar(g, ke) || adaDinding(g, ke) || adaBatu(g, ke)) return { cmd: "lompat", kind: "bump", after: s, berhenti: true };
  return { cmd: "lompat", kind: "jump", after: { ...s, ...ke }, berhenti: false };
}

/** Jalankan program di grid. Berhenti saat sampai bintang, tersandung, tabrak, atau (stopAtFlag) bendera. */
export function jalankan(grid: NavGrid, program: NavBlock[], opts: { stopAtFlag?: boolean } = {}): NavRun {
  const steps: NavStep[] = [];
  let state: NavState = { x: grid.start.x, y: grid.start.y, dir: grid.start.dir };
  let outcome: NavRun["outcome"] | null = program.length ? null : "kosong";
  let executed = 0;

  const eksekusi = (blok: NavBlock[], awalan: number[]): boolean => {
    for (let i = 0; i < blok.length; i++) {
      const b = blok[i];
      const path = [...awalan, i];
      if (b.cmd === "ulangi") {
        for (let k = 0; k < b.n; k++) if (!eksekusi(b.body, path)) return false;
        continue;
      }
      executed++;
      if (b.cmd === "bendera") {
        steps.push({ path, cmd: "bendera", after: state, kind: "flag" });
        if (opts.stopAtFlag) { outcome = "bendera"; return false; }
        continue;
      }
      const l = langkahDasar(grid, state, b.cmd);
      state = l.after;
      steps.push({ path, cmd: l.cmd, after: state, kind: l.kind });
      if (l.berhenti) { outcome = l.kind === "stumble" ? "tersandung" : "tabrak"; return false; }
      if (samaSel(state, grid.goal)) { outcome = "bintang"; return false; }
    }
    return true;
  };
  eksekusi(program, []);
  if (outcome === null) outcome = samaSel(state, grid.goal) ? "bintang" : "meleset";
  return { steps, outcome, final: state, executed };
}

/** Panjang program terpendek (blok dasar: maju/lompat/kiri/kanan/kalau yang tersedia) ke bintang; null bila tak terjangkau. */
export function optimal(grid: NavGrid, commands: NavCommand[]): number | null {
  const aksi = commands.filter((c): c is Dasar => c === "maju" || c === "lompat" || c === "kiri" || c === "kanan" || c === "kalau");
  const kunci = (s: NavState) => `${s.x},${s.y},${s.dir}`;
  const awal: NavState = { x: grid.start.x, y: grid.start.y, dir: grid.start.dir };
  if (samaSel(awal, grid.goal)) return 0;
  const dilihat = new Set<string>([kunci(awal)]);
  let lapis: NavState[] = [awal];
  for (let jarak = 1; lapis.length; jarak++) {
    const berikut: NavState[] = [];
    for (const s of lapis) for (const a of aksi) {
      const l = langkahDasar(grid, s, a);
      if (l.berhenti) continue;
      if (samaSel(l.after, grid.goal)) return jarak;
      const k = kunci(l.after);
      if (!dilihat.has(k)) { dilihat.add(k); berikut.push(l.after); }
    }
    lapis = berikut;
  }
  return null;
}

/** Jumlah keping di rak: ulangi = 1 keping + isinya. */
export function hitungBlok(program: NavBlock[]): number {
  return program.reduce((n, b) => n + (b.cmd === "ulangi" ? 1 + hitungBlok(b.body) : 1), 0);
}

/** Konversi program JSON paket → NavBlock (bentuknya sama; disalin supaya aman diubah presenter). */
export function dariJson(blok: NavBlockJson[]): NavBlock[] {
  return blok.map(b => (b.cmd === "ulangi" ? { cmd: "ulangi", n: b.n, body: dariJson(b.body) } : { cmd: b.cmd }));
}

/** Saring bertahap: tiap saringan hanya dipakai bila masih menyisakan kandidat. */
function saring<T>(daftar: T[], ...saringan: Array<((x: T) => boolean) | null>): T[] {
  let hasil = daftar;
  for (const f of saringan) {
    if (!f) continue;
    const sisa = hasil.filter(f);
    if (sisa.length) hasil = sisa;
  }
  return hasil;
}

export function buatRondeNavigasi(p: PaketNavigasi, knobs: Knobs, seed: number): RondeNavigasi {
  const r = rng(seed);
  const jarak = (g: NavGrid) => optimal(g, p.commands) ?? g.optimal;
  const kandidat = saring(
    p.grids,
    knobs.distance !== undefined ? g => jarak(g) === knobs.distance : null,
    knobs.rocks !== undefined ? g => g.rocks.length === knobs.rocks : null,
    knobs.walls !== undefined ? g => g.walls.length === knobs.walls : null,
  );
  const utama = pilihSatu(kandidat, r);
  const grids = p.semuaGrid && utama.group ? p.grids.filter(g => g.group === utama.group) : [utama];
  return {
    execMode: p.execMode,
    commands: p.commands,
    grids,
    program: dariJson(utama.program ?? []),
    rackSlots: utama.rackSlots,
    fixes: utama.fixes,
    debug: p.debug,
    prediksi: p.prediksi,
  };
}

export function nilaiNavigasi(r: RondeNavigasi, j: JawabanNavigasi): Hasil {
  const program = r.execMode === "langsung" ? (j.langsung ?? j.program ?? []) : (j.program ?? []);
  const runs = r.grids.map(g => jalankan(g, program));
  const outcomes = runs.map(x => x.outcome);
  const utama = r.grids[0];
  const blocks = hitungBlok(program);
  const opt = utama ? optimal(utama, r.commands) : null;
  const lompat = runs[0]?.steps.filter(s => s.kind === "jump").length ?? 0;
  const prediksiTotal = j.prediksi?.length ?? 0;
  const prediksiBenar = j.prediksi?.filter(Boolean).length ?? 0;

  // dekomposisi: bagian 1 harus berakhir tepat di bendera yang dipilih anak
  let benderaTepat: boolean | undefined;
  if (j.bendera && utama) {
    const lari = jalankan(utama, j.bendera.bagian[0], { stopAtFlag: true });
    benderaTepat = samaSel(lari.final, j.bendera) && lari.outcome !== "tersandung" && lari.outcome !== "tabrak";
  }

  const semuaBintang = outcomes.length > 0 && outcomes.every(o => o === "bintang");
  const debugBeres = !r.debug || r.fixes === undefined || j.edits === r.fixes;
  const rakBeres = r.rackSlots === undefined || blocks <= r.rackSlots;
  const benar = semuaBintang && debugBeres && rakBeres && benderaTepat !== false;

  return {
    benar,
    detail: {
      outcome: outcomes[0] ?? "kosong",
      outcomes,
      blocks,
      optimal: opt,
      efisien: opt !== null && blocks <= opt,
      lompat,
      batu: utama?.rocks.length ?? 0,
      edits: j.edits,
      runs: j.runs,
      prediksiBenar,
      prediksiTotal,
      ...(benderaTepat !== undefined ? { benderaTepat } : {}),
    },
  };
}
