// Audit menyeluruh konten Academy: dobel & bug.
//   npx tsx scripts/akademi-audit.ts            → ringkasan + daftar temuan (exit 1 bila ada ERROR)
//   npx tsx scripts/akademi-audit.ts --json f   → tulis semua temuan ke berkas JSON
//
// ERROR (wajib nol):
//   kurikulum  : id kompetensi ganda, pernyataan kompetensi kembar, prasyarat tak dikenal/ke jenjang lebih tinggi,
//                kompetensi tanpa paket utama (misi tak bisa dimainkan)
//   paket      : id ganda, judul kembar (id/en), kompetensi tak dikenal, item id ganda, label item kembar dalam satu
//                paket, ronde gagal dibuat, soal yang tak bisa dijawab benar (jawaban kunci dinilai salah),
//                pilihan kembar dalam satu soal, peta robot tak terpecahkan / melebihi slot,
//                soal berulang dalam satu sesi (10 ronde)
//   ujian      : modul/semester/jenjang yang soal ujiannya tidak bisa disusun
// WARNING     : paket hampir kembar (isi ≥ 80% sama untuk kompetensi sama), instruksi kembar, kompetensi dengan
//                1 paket saja (Ulangan Modul jadi monoton), paket lintas jenjang.

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ContentPack, KurikulumFile, LEVEL_IDS, levelIndex, type Competency } from "../packages/schema/src/index";
import { buatRonde, buatRondeBaru, dariJson, jalankan, knobDefaults, kunciRonde, nilai, optimal, type Jawaban, type NavBlock, type NavGrid, type Ronde } from "../packages/mechanics/src/index";
import type { NavCommand } from "../packages/schema/src/index";

/**
 * Program terpendek (jumlah keping rak, ulangi = 1 + isi) yang membawa robot ke bintang, maksimal `batas` keping.
 * Pencarian bertingkat (iterative deepening) atas keping: perintah dasar + ulangi(n, 1–2 perintah). null = tidak ada.
 */
const cacheNav = new Map<string, number | null>();
function minKeping(grid: NavGrid, commands: NavCommand[], batas: number): number | null {
  const kunciCache = `${JSON.stringify(grid)}|${commands.join()}|${batas}`;
  if (cacheNav.has(kunciCache)) return cacheNav.get(kunciCache)!;
  const dasar = commands.filter((c) => c === "maju" || c === "lompat" || c === "kiri" || c === "kanan" || c === "kalau") as Exclude<NavCommand, "ulangi" | "bendera">[];
  const keping: { blok: NavBlock; biaya: number }[] = dasar.map((c) => ({ blok: { cmd: c } as NavBlock, biaya: 1 }));
  if (commands.includes("ulangi")) {
    for (let n = 2; n <= 9; n++) for (const a of dasar) keping.push({ blok: { cmd: "ulangi", n, body: [{ cmd: a } as NavBlock] }, biaya: 2 });
    for (let n = 2; n <= 6; n++) for (const a of dasar) for (const b of dasar) keping.push({ blok: { cmd: "ulangi", n, body: [{ cmd: a } as NavBlock, { cmd: b } as NavBlock] }, biaya: 3 });
  }
  const terbaik = new Map<string, number>();
  let hasil: number | null = null;
  const cari = (state: { x: number; y: number; dir: NavGrid["start"]["dir"] }, dipakai: number) => {
    if (hasil !== null && dipakai >= hasil) return;
    const k = `${state.x},${state.y},${state.dir}`;
    if ((terbaik.get(k) ?? Infinity) <= dipakai) return;
    terbaik.set(k, dipakai);
    for (const { blok, biaya } of keping) {
      if (dipakai + biaya > batas || (hasil !== null && dipakai + biaya >= hasil)) continue;
      const run = jalankan({ ...grid, start: { ...grid.start, ...state } }, [blok]);
      if (run.outcome === "bintang") { hasil = dipakai + biaya; continue; }
      if (run.outcome === "tabrak" || run.outcome === "tersandung") continue;
      cari(run.final, dipakai + biaya);
    }
  };
  cari({ x: grid.start.x, y: grid.start.y, dir: grid.start.dir }, 0);
  cacheNav.set(kunciCache, hasil);
  return hasil;
}

type Temuan = { tingkat: "ERROR" | "WARNING"; jenis: string; target: string; pesan: string };
const temuan: Temuan[] = [];
const lapor = (tingkat: Temuan["tingkat"], jenis: string, target: string, pesan: string) => temuan.push({ tingkat, jenis, target, pesan });

const semua = (d: string): string[] => readdirSync(d).flatMap((n) => { const f = join(d, n); return statSync(f).isDirectory() ? semua(f) : f.endsWith(".json") ? [f] : []; });
/** Tanda tampilan item: semua atribut visual + teks label, tanpa id & bin. */
function tampakItem(p: ContentPack, it: Record<string, unknown>): string {
  const { id: _i, bin: _b, labelKey, ...visual } = it as Record<string, unknown> & { labelKey?: string };
  void _i; void _b;
  // teks persis (tanda −, +, kutip, ° ikut dibandingkan); hanya huruf besar/kecil & spasi yang disamakan
  const teks = labelKey ? (p.locale.id[labelKey as string] ?? String(labelKey)).trim().toLowerCase().replace(/\s+/g, " ") : "";
  return JSON.stringify({ label: teks, ...visual });
}
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();

/* ---------------- kurikulum ---------------- */

const kompetensi: Competency[] = [];
for (const f of semua("content/kurikulum")) {
  const r = KurikulumFile.safeParse(JSON.parse(readFileSync(f, "utf8")));
  if (!r.success) { lapor("ERROR", "kurikulum-skema", f, r.error.issues.map((i) => i.message).join("; ")); continue; }
  kompetensi.push(...r.data.kompetensi);
}
const kIdx = new Map<string, Competency>();
for (const c of kompetensi) {
  if (kIdx.has(c.id)) lapor("ERROR", "kompetensi-id-ganda", c.id, "id kompetensi dipakai dua kali");
  kIdx.set(c.id, c);
}
const pernyataan = new Map<string, string>();
for (const c of kompetensi) {
  for (const bhs of ["id", "en"] as const) {
    const k = `${bhs}|${norm(c.statement[bhs])}`;
    const ada = pernyataan.get(k);
    if (ada) lapor("ERROR", "kompetensi-kembar", c.id, `pernyataan ${bhs} sama persis dengan ${ada}: "${c.statement[bhs]}"`);
    else pernyataan.set(k, c.id);
  }
  for (const p of c.prereq) {
    const q = kIdx.get(p) ?? kompetensi.find((x) => x.id === p);
    if (!q) lapor("ERROR", "prasyarat-tak-dikenal", c.id, `prasyarat ${p} tidak ada`);
    else if (levelIndex(q.level) > levelIndex(c.level)) lapor("ERROR", "prasyarat-terbalik", c.id, `prasyarat ${p} ada di jenjang lebih tinggi (${q.level})`);
  }
}
// nama unit kembar dalam satu jenjang & pelajaran (dua modul berbeda bernama sama)
const unitNama = new Map<string, string>();
for (const c of kompetensi) {
  const k = `${c.level}|${c.track}|${norm(c.unit.nama.id)}`;
  const ada = unitNama.get(k);
  if (ada && ada !== c.unit.id) lapor("ERROR", "modul-nama-kembar", `${c.level}.${c.track}`, `modul ${ada} dan ${c.unit.id} sama-sama bernama "${c.unit.nama.id}"`);
  else unitNama.set(k, c.unit.id);
}

/* ---------------- paket ---------------- */

type Muat = { file: string; p: ContentPack };
const paket: Muat[] = [];
for (const f of semua("content/paket")) {
  const raw = JSON.parse(readFileSync(f, "utf8"));
  const r = ContentPack.safeParse(raw);
  if (!r.success) { lapor("ERROR", "paket-skema", f, r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")); continue; }
  paket.push({ file: f, p: r.data });
}

const pIdx = new Map<string, Muat>();
const judul = new Map<string, string>();
const instruksi = new Map<string, string[]>();
for (const m of paket) {
  const { p } = m;
  if (pIdx.has(p.id)) lapor("ERROR", "paket-id-ganda", p.id, `${m.file} & ${pIdx.get(p.id)!.file}`);
  pIdx.set(p.id, m);
  for (const bhs of ["id", "en"] as const) {
    const j = p.locale[bhs]?.judul;
    if (!j) { lapor("ERROR", "judul-hilang", p.id, `judul ${bhs} kosong`); continue; }
    const k = `${bhs}|${norm(j)}`;
    if (judul.has(k)) lapor("ERROR", "judul-kembar", p.id, `judul ${bhs} "${j}" sama dengan paket ${judul.get(k)}`);
    else judul.set(k, p.id);
  }
  const ins = norm(p.locale.id[p.instructionKey] ?? "");
  if (ins) instruksi.set(ins, [...(instruksi.get(ins) ?? []), p.id]);
  for (const cid of p.competencyIds) {
    const c = kIdx.get(cid);
    if (!c) lapor("ERROR", "kompetensi-tak-dikenal", p.id, `menunjuk ${cid}`);
    else if (c.level !== p.level) lapor("WARNING", "paket-lintas-jenjang", p.id, `paket ${p.level} untuk kompetensi ${c.level} (${cid})`);
  }
  if (new Set(p.competencyIds).size !== p.competencyIds.length) lapor("ERROR", "kompetensi-dobel-di-paket", p.id, "competencyIds berisi id yang sama");
  // item dalam paket: id unik; dua item yang TAMPAK sama persis (label, emoji, warna, ukuran, jumlah, aset) tidak boleh
  // punya jawaban (bin) berbeda — anak tidak mungkin membedakannya.
  const items = ((p as { items?: Record<string, unknown>[] }).items ?? []) as (Record<string, unknown> & { id: string; labelKey?: string; bin?: string })[];
  const ids = new Set<string>();
  const tampak = new Map<string, { id: string; bin?: string }>();
  for (const it of items) {
    if (ids.has(it.id)) lapor("ERROR", "item-id-ganda", p.id, `item ${it.id} muncul dua kali`);
    ids.add(it.id);
    if (it.labelKey && !p.locale.id[it.labelKey]) lapor("ERROR", "label-hilang", p.id, `labelKey ${it.labelKey} tidak ada di locale.id`);
    const t = tampakItem(p, it);
    const ada = tampak.get(t);
    if (ada && ada.bin !== it.bin) lapor("ERROR", "item-sama-beda-jawaban", p.id, `item ${ada.id} (${ada.bin}) & ${it.id} (${it.bin}) tampak sama persis tetapi jawabannya beda`);
    else if (!ada) tampak.set(t, { id: it.id, bin: it.bin });
  }
}
for (const [teks, ids] of instruksi) if (ids.length > 1) lapor("WARNING", "instruksi-kembar", ids.join(", "), `instruksi sama: "${teks.slice(0, 80)}"`);

// paket hampir kembar: kompetensi utama sama + isi (label item / langkah) ≥ 80% sama
const sidik = (p: ContentPack): Set<string> => {
  const s = new Set<string>();
  const any = p as unknown as Record<string, unknown>;
  const teks = (o: Record<string, unknown>) => {
    const lk = typeof o.labelKey === "string" ? p.locale.id[o.labelKey] : undefined;
    return (lk ?? (typeof o.id === "string" ? o.id : JSON.stringify(o).slice(0, 120))).trim().toLowerCase();
  };
  for (const kunci of ["items", "goods"]) {
    const arr = any[kunci];
    if (Array.isArray(arr)) for (const x of arr) { const o = x as Record<string, unknown>; s.add(`${tampakItem(p, o)}${typeof o.bin === "string" ? `>${o.bin}` : ""}`); }
  }
  // urutkan: isi = teks semua langkah tiap urutan (bukan id urutan)
  if (Array.isArray(any.sequences))
    for (const sq of any.sequences as { steps?: Record<string, unknown>[] }[]) s.add((sq.steps ?? []).map((st) => tampakItem(p, st)).join(" > "));
  // pilih: isi = pertanyaan + pilihan
  if (Array.isArray(any.pilihan))
    for (const r of any.pilihan as { promptKey?: string; choices?: string[]; correct?: string }[]) s.add(`${p.locale.id[r.promptKey ?? ""] ?? r.promptKey}|${r.correct}`);
  return s;
};
const perKomp = new Map<string, ContentPack[]>();
for (const { p } of paket) (perKomp.get(p.competencyIds[0]) ?? perKomp.set(p.competencyIds[0], []).get(p.competencyIds[0])!).push(p);
for (const [cid, list] of perKomp) {
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      // tugas berbeda (mis. urutkan "susun" vs "perbaiki") dengan bahan sama bukan dobel
      if (a.mechanic !== b.mechanic || (a as { mode?: string }).mode !== (b as { mode?: string }).mode) continue;
      // tingkat kesulitan berbeda (rentang knob / aturan pembeli) = latihan berjenjang, bukan dobel
      const tingkat = (x: ContentPack) => JSON.stringify([Object.entries(x.knobs ?? {}).map(([k, v]) => [k, v.min, v.max]), (x as { customerRule?: unknown }).customerRule ?? null]);
      if (tingkat(a) !== tingkat(b)) continue;
      const sa = sidik(a), sb = sidik(b);
      if (!sa.size || !sb.size) continue;
      const irisan = [...sa].filter((x) => sb.has(x)).length;
      const jac = irisan / (sa.size + sb.size - irisan);
      if (jac >= 0.8) lapor("WARNING", "paket-hampir-kembar", `${a.id} ~ ${b.id}`, `kompetensi ${cid}, isi ${Math.round(jac * 100)}% sama`);
    }
}

/* ---------------- kompetensi ↔ paket ---------------- */

for (const c of kompetensi) {
  const semuaP = paket.filter((m) => m.p.competencyIds.includes(c.id));
  if (!semuaP.length) lapor("ERROR", "kompetensi-tanpa-paket", c.id, `tidak ada permainan untuk "${c.statement.id}"`);
  else if (semuaP.length === 1) lapor("WARNING", "kompetensi-satu-paket", c.id, `hanya 1 paket (${semuaP[0].p.id}); ulangan modul & pemantapan memakai permainan yang sama`);
}

/* ---------------- ronde: bisa dibuat, bisa dijawab, tidak kembar ---------------- */

/** Susun jawaban benar dari ronde (kunci). null = mode yang tidak bisa diperiksa otomatis. */
function kunci(r: Ronde): Jawaban | null {
  switch (r.mechanic) {
    case "pilah": {
      const x = r.ronde;
      return x.mode === "pilih" ? x.correct : Object.fromEntries(x.items.map((i) => [i.id, i.bin]));
    }
    case "urutkan": {
      const x = r.ronde;
      if (x.mode === "dulu") return x.correct[0];
      if (x.mode === "label") return { labels: x.labels ?? [] };
      return x.correct;
    }
    case "pola": {
      const x = r.ronde;
      if (x.mode === "cipta") {
        const n = x.shown.length, u = x.pilih ?? x.unitLen;
        const ids = [...new Set(x.palette.map((i) => i.id))].slice(0, u);
        return Array.from({ length: n }, (_, i) => ids[i % u]);
      }
      return x.correct;
    }
    case "dagang": {
      const x = r.ronde;
      const susunUang = (target: number): number[] | null => {
        // pecahan laci boleh dipakai berulang; cari kombinasi (DP)
        const laci = [...new Set(x.laci)].sort((a, b) => b - a);
        const dp = new Map<number, number[]>([[0, []]]);
        for (let v = 1; v <= target; v++)
          for (const c of laci) if (v - c >= 0 && dp.has(v - c)) { dp.set(v, [...dp.get(v - c)!, c]); break; }
        return dp.get(target) ?? null;
      };
      switch (x.mode) {
        case "ambil": return { keranjang: Object.fromEntries(x.pesanan.map((p) => [p.goodId, p.qty])) };
        case "subitasi": case "sisa": { const id = Object.keys(x.tersedia)[0] ?? x.pesanan[0]?.goodId ?? "x"; return { keranjang: { [id]: x.target } }; }
        case "hitung": case "gabung": return { angka: x.target };
        case "bayar": { const u = susunUang(x.harga); return u ? { uang: u } : { uang: [-1] }; }
        case "kembalian": { const u = susunUang(x.dibayar - x.harga); return u ? { uang: u } : { uang: [-1] }; }
        case "tukar": { const u = susunUang(x.dibayar); return u ? { uang: u } : { uang: [-1] }; }
        case "lengkapi": { const u = susunUang(x.harga - x.dibayar); return u ? { uang: u } : { uang: [-1] }; }
      }
      return null;
    }
    case "simulasi": {
      const x = r.ronde;
      switch (x.mode) {
        case "jam-baca": case "jam-putar": case "kubus": case "taksir": return { angka: x.target };
        case "timbangan": case "alat": return { pilih: x.correctId ?? "" };
        case "jengkal": return { posisi: Array.from({ length: x.target }, (_, i) => i + x.offset), angka: x.target };
        case "turus": { const t: Record<string, number> = {}; for (const id of x.urutan) t[id] = (t[id] ?? 0) + 1; return { turus: t }; }
        case "tombol": return { tebakan: { ...x.peta } };
        case "bagi": return { kiri: x.target / 2, kanan: x.target / 2 };
        default: return null; // menara, bantuan, telusur: diperiksa lewat aturan khusus di bawah / presenter
      }
    }
    case "navigasi": return null; // diperiksa dengan pemecah optimal()
  }
  return null;
}

const SEED = 400;
let rondeDiuji = 0;
for (const { p } of paket) {
  const k = knobDefaults(p);
  const masalah = new Map<string, string>();
  const catat = (jenis: string, pesan: string) => { if (!masalah.has(jenis)) masalah.set(jenis, pesan); };
  for (let s = 0; s < SEED; s++) {
    let r: Ronde;
    try { r = buatRonde(p, k, s * 2654435761 >>> 0); } catch (e) { catat("ronde-gagal-dibuat", `seed ${s}: ${(e as Error).message}`); continue; }
    rondeDiuji++;
    // pilihan kembar dalam satu soal
    if (r.mechanic === "pilah" && r.ronde.mode === "pilih") {
      const ids = r.ronde.choices.map((c) => c.id);
      if (new Set(ids).size !== ids.length) catat("pilihan-kembar", `seed ${s}: ${ids.join(",")}`);
      const lab = r.ronde.choices.map((c) => tampakItem(p, c as unknown as Record<string, unknown>));
      if (new Set(lab).size !== lab.length) catat("pilihan-tampak-kembar", `seed ${s}: pilihan ${ids.join(",")} ada yang tampak sama persis`);
      if (!ids.includes(r.ronde.correct)) catat("jawaban-tak-tersedia", `seed ${s}: jawaban ${r.ronde.correct} tidak ada di pilihan`);
    }
    if (r.mechanic === "simulasi" && r.ronde.mode === "jam-baca" && !r.ronde.options.includes(r.ronde.target)) catat("jawaban-tak-tersedia", `seed ${s}: jam ${r.ronde.target} tidak ada di pilihan`);
    if (r.mechanic === "simulasi" && r.ronde.mode === "jam-baca" && new Set(r.ronde.options).size !== r.ronde.options.length) catat("pilihan-kembar", `seed ${s}: ${r.ronde.options.join(",")}`);
    if (r.mechanic === "dagang" && ["hitung", "gabung"].includes(r.ronde.mode) && (r.ronde.target < r.ronde.strip[0] || r.ronde.target > r.ronde.strip[1])) catat("jawaban-di-luar-strip", `seed ${s}: ${r.ronde.target} ∉ [${r.ronde.strip.join(",")}]`);
    if (r.mechanic === "dagang" && r.ronde.mode === "ambil") for (const x of r.ronde.pesanan) if ((r.ronde.tersedia[x.goodId] ?? 0) < x.qty) catat("stok-kurang", `seed ${s}: pesan ${x.qty} ${x.goodId}, tersedia ${r.ronde.tersedia[x.goodId] ?? 0}`);
    if (r.mechanic === "urutkan" && (r.ronde.mode === "susun") && r.ronde.shown.map((x) => x.id).join() === r.ronde.correct.join()) catat("soal-sudah-terjawab", `seed ${s}: urutan tampil sudah benar`);
    if (r.mechanic === "navigasi") {
      for (const g of r.ronde.grids) {
        const o = optimal(g, r.ronde.commands);
        if (o === null) catat("peta-tak-terpecahkan", `seed ${s}: grid tidak bisa diselesaikan dengan ${r.ronde.commands.join("/")}`);
        else if (r.ronde.rackSlots !== undefined) {
          // mode bendera: dua program terpisah, masing-masing sepanjang rak
          const batas = r.ronde.commands.includes("bendera") ? r.ronde.rackSlots * 2 : r.ronde.rackSlots;
          const m = minKeping(g, r.ronde.commands, batas);
          if (m === null) catat("peta-melebihi-slot", `seed ${s}: grid ${g.id} tidak bisa diselesaikan dalam ${batas} keping (perintah ${r.ronde.commands.join("/")})`);
        }
      }
      if (r.ronde.debug && r.ronde.program.length === 0) catat("debug-tanpa-program", `seed ${s}`);
    }
    const j = kunci(r);
    if (j !== null) {
      try {
        const h = nilai(p, r, j);
        if (!h.benar) catat("kunci-dinilai-salah", `seed ${s}: jawaban kunci ${JSON.stringify(j).slice(0, 120)} → salah (${JSON.stringify(h.detail).slice(0, 160)})`);
      } catch (e) { catat("nilai-error", `seed ${s}: ${(e as Error).message}`); }
    }
  }
  // soal tidak berulang dalam satu sesi
  let terburuk = 99;
  for (let s = 0; s < 6; s++) {
    const riw: string[] = [];
    try {
      for (let i = 0; i < p.rounds; i++) riw.push(kunciRonde(buatRondeBaru(p, k, (s * 7919 + i * 104729) >>> 0, riw)));
    } catch { break; }
    terburuk = Math.min(terburuk, new Set(riw).size);
  }
  if (terburuk < p.rounds) catat("soal-berulang-satu-sesi", `hanya ${terburuk} soal berbeda dari ${p.rounds} ronde`);
  for (const [jenis, pesan] of masalah) lapor("ERROR", jenis, p.id, pesan);
}
// dariJson dipakai agar impor tidak dihapus linter (program debug JSON → blok)
void dariJson;

/* ---------------- ujian bisa disusun ---------------- */

for (const lv of LEVEL_IDS) {
  const ks = kompetensi.filter((c) => c.level === lv);
  if (!ks.length) continue;
  const units = new Map<string, Competency[]>();
  for (const c of ks) (units.get(`${c.track}|${c.unit.id}`) ?? units.set(`${c.track}|${c.unit.id}`, []).get(`${c.track}|${c.unit.id}`)!).push(c);
  for (const [u, isi] of units) if (!isi.some((c) => paket.some((m) => m.p.competencyIds.includes(c.id)))) lapor("ERROR", "ulangan-tanpa-soal", `${lv}.${u}`, "modul tanpa satu pun paket, Ulangan Modul tidak bisa disusun");
}

/* ---------------- laporan ---------------- */

const e = temuan.filter((t) => t.tingkat === "ERROR");
const w = temuan.filter((t) => t.tingkat === "WARNING");
const ringkas = (xs: Temuan[]) => Object.entries(xs.reduce<Record<string, number>>((a, t) => ((a[t.jenis] = (a[t.jenis] ?? 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
console.log(`Kompetensi ${kompetensi.length} · paket ${paket.length} · ronde diuji ${rondeDiuji}`);
console.log(`\nERROR ${e.length}`); for (const [j, n] of ringkas(e)) console.log(`  ${n.toString().padStart(4)}  ${j}`);
console.log(`WARNING ${w.length}`); for (const [j, n] of ringkas(w)) console.log(`  ${n.toString().padStart(4)}  ${j}`);
const iJson = process.argv.indexOf("--json");
if (iJson > 0) writeFileSync(process.argv[iJson + 1], JSON.stringify(temuan, null, 1));
else for (const t of e) console.log(`✗ [${t.jenis}] ${t.target}: ${t.pesan}`);
process.exit(e.length ? 1 : 0);
