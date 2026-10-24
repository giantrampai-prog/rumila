"use client";

// Presenter mekanik navigasi (Agam ke bintang) — tiga mode eksekusi:
//   langsung : tiap tombol palet dijalankan seketika (PAUD), tanpa rak
//   program  : blok disusun di rak berslot, lalu "Jalan ▶" (TK A ke atas; debug = rak terisi, perbaiki tepat N blok;
//              bendera = dekomposisi dua rak; semuaGrid = satu program lolos semua grid satu group)
//   langkah  : rak terisi, anak menebak petak tujuan lalu "Langkah" menjalankan satu blok (prediksi)
// Semantik blok mengikuti docs/akademi/mekanik-navigasi.md; eksekusi memakai jalankan() dari mesin, presenter hanya
// menganimasikan NavStep dan mengirim jawaban. Penilaian dilakukan runner lewat `hasil`.

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { NavCommand, PaketNavigasi } from "@akademi/schema";
import { hitungBlok, jalankan, type Arah, type JawabanNavigasi, type NavBlock, type NavGrid, type NavRun, type NavState, type NavStep, type RondeNavigasi } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import { COMMON_DEFS } from "@/components/koding/art";
import { AgamTop } from "@/components/koding/stage";
import { sfx } from "@/lib/sfx";
import { BALOO, BENAR, INK, SALAH, type PresenterProps } from "./jenis";
import "@/components/koding/koding.css";

type Props = PresenterProps<RondeNavigasi, JawabanNavigasi, PaketNavigasi>;

/* ---------------- konstanta tampilan ---------------- */

const SEL = 100; // satuan petak di viewBox
const PETAK_MIN = 44;
const PETAK_MAKS = 112;
const SLOT_DEFAULT = 8;
const DEG: Record<Arah, number> = { N: 0, E: 90, S: 180, W: 270 };
const DELTA: Record<Arah, { dx: number; dy: number }> = { N: { dx: 0, dy: -1 }, E: { dx: 1, dy: 0 }, S: { dx: 0, dy: 1 }, W: { dx: -1, dy: 0 } };
const PUTAR: Record<Arah, { kiri: Arah; kanan: Arah }> = { N: { kiri: "W", kanan: "E" }, E: { kiri: "N", kanan: "S" }, S: { kiri: "E", kanan: "W" }, W: { kiri: "S", kanan: "N" } };

const BLOK: Record<NavCommand, { label: string; ikon: ReactNode; c: string; d: string }> = {
  maju: { label: "maju", ikon: <Icon name="arrow_upward" size={30} />, c: "#3a86ff", d: "#2463c9" },
  lompat: { label: "lompat", ikon: <span style={{ fontSize: 28, lineHeight: 1 }}>🦘</span>, c: "#22b573", d: "#16804f" },
  kiri: { label: "kiri", ikon: <Icon name="turn_left" size={30} />, c: "#8b5cf6", d: "#6a3fd1" },
  kanan: { label: "kanan", ikon: <Icon name="turn_right" size={30} />, c: "#8b5cf6", d: "#6a3fd1" },
  ulangi: { label: "ulangi", ikon: <span style={{ fontSize: 26, lineHeight: 1 }}>🔁</span>, c: "#fd861d", d: "#c25a0c" },
  kalau: { label: "🪨? lompat : maju", ikon: <span style={{ fontSize: 26, lineHeight: 1 }}>🤔</span>, c: "#0ea5a4", d: "#0b7f7e" },
  bendera: { label: "bendera", ikon: <span style={{ fontSize: 26, lineHeight: 1 }}>🚩</span>, c: "#e04f5f", d: "#a8323f" },
};

const tunggu = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const samaSel = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x === b.x && a.y === b.y;
const putarKe = (rot: number, dari: Arah, ke: Arah) => rot + ((((DEG[ke] - DEG[dari]) % 360) + 540) % 360) - 180;

/** Jumlah posisi yang berbeda dari program awal + selisih panjang (mode debug). */
function hitungEdits(awal: NavBlock[], akhir: NavBlock[]): number {
  const n = Math.min(awal.length, akhir.length);
  let e = Math.abs(awal.length - akhir.length);
  for (let i = 0; i < n; i++) if (JSON.stringify(awal[i]) !== JSON.stringify(akhir[i])) e++;
  return e;
}

/** BFS sederhana (maju/lompat/belok yang tersedia) dari `dari` ke bintang; mengembalikan petak yang dilewati. */
function jalurBantuan(g: NavGrid, dari: NavState, commands: NavCommand[]): Array<{ x: number; y: number }> {
  const aksi: Array<"maju" | "lompat" | "kiri" | "kanan"> = [];
  if (commands.includes("maju") || commands.includes("kalau")) aksi.push("maju");
  if (commands.includes("lompat") || commands.includes("kalau")) aksi.push("lompat");
  if (commands.includes("kiri")) aksi.push("kiri");
  if (commands.includes("kanan")) aksi.push("kanan");
  const diLuar = (c: { x: number; y: number }) => c.x < 0 || c.y < 0 || c.x >= g.w || c.y >= g.h;
  const dinding = (c: { x: number; y: number }) => g.walls.some((w) => samaSel(w, c));
  const batu = (c: { x: number; y: number }) => g.rocks.some((b) => samaSel(b, c));
  const kunci = (s: NavState) => `${s.x},${s.y},${s.dir}`;
  const induk = new Map<string, string | null>([[kunci(dari), null]]);
  const simpan = new Map<string, NavState>([[kunci(dari), dari]]);
  let lapis: NavState[] = [dari];
  let temu: NavState | null = samaSel(dari, g.goal) ? dari : null;
  while (lapis.length && !temu) {
    const berikut: NavState[] = [];
    for (const s of lapis) {
      for (const a of aksi) {
        let ke: NavState | null = null;
        if (a === "kiri" || a === "kanan") ke = { ...s, dir: PUTAR[s.dir][a] };
        else {
          const n = a === "maju" ? 1 : 2;
          const c = { x: s.x + DELTA[s.dir].dx * n, y: s.y + DELTA[s.dir].dy * n };
          if (diLuar(c) || dinding(c) || batu(c)) continue;
          ke = { ...s, ...c };
        }
        const k = kunci(ke);
        if (induk.has(k)) continue;
        induk.set(k, kunci(s));
        simpan.set(k, ke);
        if (samaSel(ke, g.goal)) { temu = ke; break; }
        berikut.push(ke);
      }
      if (temu) break;
    }
    lapis = berikut;
  }
  if (!temu) {
    // tak terjangkau: sorot petak di depan Agam saja
    const depan = { x: dari.x + DELTA[dari.dir].dx, y: dari.y + DELTA[dari.dir].dy };
    return diLuar(depan) ? [] : [depan];
  }
  const jalur: Array<{ x: number; y: number }> = [];
  let k: string | null = kunci(temu);
  while (k) {
    const s = simpan.get(k)!;
    if (!jalur.length || !samaSel(jalur[0], s)) jalur.unshift({ x: s.x, y: s.y });
    k = induk.get(k) ?? null;
  }
  return jalur.slice(1);
}

/* ---------------- komponen utama ---------------- */

interface Agam extends NavState {
  rot: number;
  lompat: boolean;
  goyang: number; // kunci ulang animasi goyang
  wajah: string | null; // 😵 / 💥 / 🎉
  senang: boolean;
}

export function PresenterNavigasi({ ronde, onJawab, onHint, hasil }: Props) {
  const grids = ronde.grids;
  const slotMaks = ronde.rackSlots ?? SLOT_DEFAULT;
  const modeBendera = ronde.execMode === "program" && ronde.commands.includes("bendera");
  const palet = useMemo(() => ronde.commands.filter((c) => c !== "bendera"), [ronde.commands]);

  const awalAgam = useCallback((g: NavGrid): Agam => ({ x: g.start.x, y: g.start.y, dir: g.start.dir, rot: DEG[g.start.dir], lompat: false, goyang: 0, wajah: null, senang: false }), []);

  const [aktif, setAktif] = useState(0);
  const [agam, setAgam] = useState<Agam>(() => awalAgam(grids[0]));
  const [statusGrid, setStatusGrid] = useState<Array<"✓" | "✗" | null>>(() => grids.map(() => null));
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState<string>("");
  const [sorot, setSorot] = useState<Array<{ x: number; y: number }>>([]);
  const [runs, setRuns] = useState(0);
  const jalanId = useRef(0);
  const selesai = useRef(false);

  // mode langsung
  const [efektif, setEfektif] = useState<NavBlock[]>([]);
  const [gagal, setGagal] = useState(0);

  // mode program
  const [rak, setRak] = useState<NavBlock[]>(() => ronde.program.map((b) => ({ ...b })));
  const [rak2, setRak2] = useState<NavBlock[]>([]);
  const [rakAktif, setRakAktif] = useState<0 | 1>(0);
  const [sel, setSel] = useState<{ rak: 0 | 1; i: number } | null>(null);
  const [bendera, setBendera] = useState<{ x: number; y: number } | null>(null);

  // mode langkah
  const lariLangkah = useMemo<NavRun | null>(() => (ronde.execMode === "langkah" ? jalankan(grids[0], ronde.program) : null), [ronde, grids]);
  const [langkahKe, setLangkahKe] = useState(0);
  const [tebakan, setTebakan] = useState<{ x: number; y: number } | null>(null);
  const [prediksi, setPrediksi] = useState<boolean[]>([]);

  const terkunci = !!hasil || selesai.current;
  const grid = grids[aktif];

  /* ---------- animasi langkah ---------- */

  const animasikan = useCallback(async (steps: NavStep[], id: number, mulai: NavState): Promise<boolean> => {
    let dirKini = mulai.dir;
    for (const s of steps) {
      if (jalanId.current !== id) return false;
      if (s.kind === "turn") {
        const dari = dirKini;
        dirKini = s.after.dir;
        setAgam((a) => ({ ...a, dir: s.after.dir, rot: putarKe(a.rot, dari, s.after.dir), wajah: null }));
        sfx.whoosh();
        await tunggu(300);
      } else if (s.kind === "move") {
        setAgam((a) => ({ ...a, x: s.after.x, y: s.after.y, wajah: null }));
        sfx.step();
        await tunggu(320);
      } else if (s.kind === "jump") {
        setAgam((a) => ({ ...a, lompat: true }));
        sfx.hop(1);
        await tunggu(90);
        setAgam((a) => ({ ...a, x: s.after.x, y: s.after.y }));
        await tunggu(330);
        setAgam((a) => ({ ...a, lompat: false }));
        await tunggu(120);
      } else if (s.kind === "flag") {
        sfx.arrive();
        await tunggu(260);
      } else {
        // tersandung / tabrak: maju setengah petak lalu terpental & goyang
        const d = DELTA[dirKini];
        setAgam((a) => ({ ...a, x: s.after.x + d.dx * 0.3, y: s.after.y + d.dy * 0.3 }));
        await tunggu(150);
        sfx.thud();
        setAgam((a) => ({ ...a, x: s.after.x, y: s.after.y, goyang: a.goyang + 1, wajah: s.kind === "stumble" ? "😵" : "💥" }));
        await tunggu(520);
      }
    }
    return jalanId.current === id;
  }, []);

  const pesanGagal = (outcome: NavRun["outcome"]) =>
    outcome === "tersandung" ? "Agam tersandung batu 😵" : outcome === "tabrak" ? "Agam menabrak 💥" : outcome === "kosong" ? "Susun perintah dulu, ya" : "Agam belum sampai bintang 🤷";

  const kirim = (j: JawabanNavigasi) => {
    if (selesai.current) return;
    selesai.current = true;
    onJawab(j);
  };

  /* ---------- mode langsung ---------- */

  const tekanLangsung = async (cmd: NavCommand) => {
    if (sibuk || terkunci || cmd === "ulangi" || cmd === "bendera") return;
    const program: NavBlock[] = [...efektif, { cmd }];
    const lari = jalankan(grid, program);
    const idx = efektif.length;
    const baru = lari.steps.filter((s) => s.path[0] === idx);
    const id = ++jalanId.current;
    setSibuk(true);
    setSorot([]);
    setPesan("");
    const sebelum: NavState = { x: agam.x, y: agam.y, dir: agam.dir };
    const ok = await animasikan(baru, id, sebelum);
    if (!ok) return;
    if (lari.outcome === "tersandung" || lari.outcome === "tabrak") {
      setGagal((g) => g + 1);
      setPesan(pesanGagal(lari.outcome));
      // posisi Agam dipulihkan ke sebelum blok gagal (mesin sudah mengembalikan after = sebelum)
      setAgam((a) => ({ ...a, ...sebelum }));
    } else {
      setEfektif(program);
      if (lari.outcome === "bintang") {
        sfx.arrive();
        setAgam((a) => ({ ...a, senang: true, wajah: "🎉" }));
        kirim({ program, langsung: program, runs: gagal });
      }
    }
    setSibuk(false);
  };

  const ulangLangsung = () => {
    if (sibuk || terkunci) return;
    jalanId.current++;
    setEfektif([]);
    setPesan("");
    setSorot([]);
    setAgam(awalAgam(grid));
  };

  /* ---------- mode program: rak ---------- */

  const rakDari = (k: 0 | 1) => (k === 0 ? rak : rak2);
  const setRakKe = (k: 0 | 1, f: (r: NavBlock[]) => NavBlock[]) => (k === 0 ? setRak(f) : setRak2(f));

  const tekanPalet = (cmd: NavCommand) => {
    if (sibuk || terkunci) return;
    const k = modeBendera ? rakAktif : 0;
    const daftar = rakDari(k);
    const blokBaru: NavBlock = cmd === "ulangi" ? { cmd: "ulangi", n: 2, body: [] } : { cmd };
    // isi keping ulangi yang sedang "dimasuki"
    if (sel && sel.rak === k) {
      const target = daftar[sel.i];
      if (target?.cmd === "ulangi" && cmd !== "ulangi") {
        if (target.body.length >= 2 || hitungBlok(daftar) + 1 > slotMaks) { sfx.thud(); setPesan(target.body.length >= 2 ? "Isi ulangi paling banyak 2 blok" : "Rak tidak muat"); return; }
        sfx.pick();
        setRakKe(k, (r) => r.map((b, i) => (i === sel.i && b.cmd === "ulangi" ? { ...b, body: [...b.body, { cmd } as NavBlock] } : b)));
        return;
      }
      if (ronde.debug) {
        // debug: ganti blok yang dipilih
        if (hitungBlok(daftar) - hitungBlok([target]) + hitungBlok([blokBaru]) > slotMaks) { sfx.thud(); setPesan("Rak tidak muat"); return; }
        sfx.pick();
        setRakKe(k, (r) => r.map((b, i) => (i === sel.i ? blokBaru : b)));
        setSel(null);
        return;
      }
    }
    if (hitungBlok(daftar) + 1 > slotMaks) { sfx.thud(); setPesan("Rak tidak muat"); return; }
    sfx.pick();
    setRakKe(k, (r) => [...r, blokBaru]);
    setSel(cmd === "ulangi" ? { rak: k, i: daftar.length } : null);
    setPesan("");
  };

  const ketukRak = (k: 0 | 1, i: number) => {
    if (sibuk || terkunci) return;
    const daftar = rakDari(k);
    const b = daftar[i];
    const dipilih = sel && sel.rak === k && sel.i === i;
    if (b.cmd === "ulangi" || ronde.debug) {
      if (dipilih) { sfx.close(); setRakKe(k, (r) => r.filter((_, j) => j !== i)); setSel(null); }
      else { sfx.tap(); setSel({ rak: k, i }); setRakAktif(k); }
      return;
    }
    sfx.close();
    setRakKe(k, (r) => r.filter((_, j) => j !== i));
    setSel(null);
  };

  const putarN = (k: 0 | 1, i: number) => {
    if (sibuk || terkunci) return;
    sfx.tap();
    setRakKe(k, (r) => r.map((b, j) => (j === i && b.cmd === "ulangi" ? { ...b, n: b.n >= 6 ? 2 : b.n + 1 } : b)));
  };

  const hapusIsiUlangi = (k: 0 | 1, i: number, j: number) => {
    if (sibuk || terkunci) return;
    sfx.close();
    setRakKe(k, (r) => r.map((b, x) => (x === i && b.cmd === "ulangi" ? { ...b, body: b.body.filter((_, y) => y !== j) } : b)));
  };

  /* ---------- mode program: jalan ---------- */

  const jalan = async () => {
    if (sibuk || terkunci) return;
    const program: NavBlock[] = modeBendera ? [...rak, { cmd: "bendera" }, ...rak2] : rak;
    if (!program.length || (modeBendera && !rak.length && !rak2.length)) { sfx.thud(); setPesan("Susun perintah dulu: ketuk blok di bawah"); return; }
    if (modeBendera && !bendera) { sfx.thud(); setPesan("Ketuk petak di kebun untuk menaruh 🚩 dulu"); return; }
    const id = ++jalanId.current;
    const r = runs + 1;
    setRuns(r);
    setSibuk(true);
    setSel(null);
    setSorot([]);
    setPesan("");
    setStatusGrid(grids.map(() => null));
    sfx.open();

    for (let gi = 0; gi < grids.length; gi++) {
      const g = grids[gi];
      setAktif(gi);
      setAgam(awalAgam(g));
      await tunggu(gi === 0 ? 250 : 500);
      if (jalanId.current !== id) return;

      let outcome: NavRun["outcome"];
      let pesanKhusus: string | null = null;
      if (modeBendera && bendera) {
        const lari1 = jalankan(g, [...rak, { cmd: "bendera" }], { stopAtFlag: true });
        if (!(await animasikan(lari1.steps, id, { x: g.start.x, y: g.start.y, dir: g.start.dir }))) return;
        if (lari1.outcome !== "bendera" || !samaSel(lari1.final, bendera)) {
          outcome = lari1.outcome === "bendera" || lari1.outcome === "bintang" ? "meleset" : lari1.outcome;
          pesanKhusus = lari1.outcome === "bendera" || lari1.outcome === "bintang" ? "Bagian 1 belum berhenti di 🚩" : null;
        } else {
          sfx.coin();
          await tunggu(300);
          const lari2 = jalankan({ ...g, start: { x: bendera.x, y: bendera.y, dir: lari1.final.dir } }, rak2);
          if (!(await animasikan(lari2.steps, id, lari1.final))) return;
          outcome = lari2.outcome;
        }
      } else {
        const lari = jalankan(g, program);
        if (!(await animasikan(lari.steps, id, { x: g.start.x, y: g.start.y, dir: g.start.dir }))) return;
        outcome = lari.outcome;
      }

      if (outcome !== "bintang") {
        setStatusGrid((s) => s.map((v, i) => (i === gi ? "✗" : v)));
        setPesan(pesanKhusus ?? pesanGagal(outcome));
        if (outcome === "meleset") sfx.bounceBack();
        setSibuk(false);
        return;
      }
      sfx.arrive();
      setStatusGrid((s) => s.map((v, i) => (i === gi ? "✓" : v)));
      setAgam((a) => ({ ...a, wajah: "⭐" }));
      await tunggu(gi < grids.length - 1 ? 450 : 150);
    }
    if (jalanId.current !== id) return;
    setAgam((a) => ({ ...a, senang: true, wajah: "🎉" }));
    setSibuk(false);
    if (modeBendera && bendera) kirim({ program, bendera: { x: bendera.x, y: bendera.y, bagian: [rak, rak2] }, runs: r });
    else kirim({ program, edits: ronde.debug ? hitungEdits(ronde.program, rak) : undefined, runs: r });
  };

  /* ---------- mode langkah / prediksi ---------- */

  const langkah = async () => {
    if (sibuk || terkunci || !lariLangkah) return;
    const s = lariLangkah.steps[langkahKe];
    if (!s) { kirim({ program: ronde.program, prediksi, runs: 1 }); return; }
    if (ronde.prediksi && !tebakan) { sfx.thud(); setPesan("Ketuk petak tujuan Agam dulu, ya"); return; }
    const id = ++jalanId.current;
    setSibuk(true);
    setSorot([]);
    const benar = tebakan ? samaSel(tebakan, s.after) : true;
    const daftar = ronde.prediksi ? [...prediksi, benar] : prediksi;
    if (ronde.prediksi) { setPrediksi(daftar); setPesan(benar ? "Tebakanmu benar! ⭐" : "Hmm, Agam ke sini ternyata"); }
    if (!(await animasikan([s], id, { x: agam.x, y: agam.y, dir: agam.dir }))) return;
    setTebakan(null);
    setLangkahKe(langkahKe + 1);
    setSibuk(false);
    const habis = langkahKe + 1 >= lariLangkah.steps.length;
    if (habis) {
      if (lariLangkah.outcome === "bintang") setAgam((a) => ({ ...a, senang: true, wajah: "🎉" }));
      else setPesan(pesanGagal(lariLangkah.outcome));
      await tunggu(400);
      kirim({ program: ronde.program, prediksi: daftar, runs: 1 });
    }
  };

  /* ---------- petak diketuk ---------- */

  const ketukPetak = (x: number, y: number) => {
    if (sibuk || terkunci) return;
    if (ronde.execMode === "langkah" && ronde.prediksi) {
      sfx.tap();
      setTebakan({ x, y });
      setPesan("");
    } else if (modeBendera) {
      if (grid.walls.some((w) => samaSel(w, { x, y })) || grid.rocks.some((b) => samaSel(b, { x, y }))) { sfx.thud(); return; }
      sfx.pick();
      setBendera({ x, y });
      setPesan("");
    }
  };

  /* ---------- bantuan ---------- */

  const bantu = () => {
    if (terkunci) return;
    onHint?.();
    const dari: NavState = { x: agam.x, y: agam.y, dir: agam.dir };
    const jalur = jalurBantuan(grid, dari, ronde.commands);
    setSorot(jalur);
    if (ronde.execMode === "langsung") setPesan(jalur.length ? "Ikuti petak yang menyala" : "Coba putar Agam dulu");
    else if (ronde.execMode === "langkah") setPesan("Lihat blok berikutnya, ke mana Agam akan pergi?");
    else setPesan(modeBendera && !bendera ? "Taruh 🚩 di tengah jalur, lalu susun dua bagian" : ronde.debug ? `Ubah tepat ${ronde.fixes ?? 1} blok supaya Agam lewat petak yang menyala` : "Susun blok supaya Agam lewat petak yang menyala");
    window.setTimeout(() => setSorot([]), 3500);
  };

  /* ---------- hasil dari runner ---------- */

  useEffect(() => {
    if (!hasil) return;
    jalanId.current++;
    setSibuk(false);
    if (hasil.benar) {
      setAgam((a) => ({ ...a, senang: true, wajah: "🎉" }));
      setPesan("");
      return;
    }
    const d = hasil.detail as { outcome?: NavRun["outcome"]; edits?: number; blocks?: number };
    if (ronde.debug && ronde.fixes !== undefined && d.edits !== undefined && d.edits !== ronde.fixes) setPesan(`Ubah tepat ${ronde.fixes} blok ya`);
    else if (ronde.rackSlots !== undefined && (d.blocks ?? 0) > ronde.rackSlots) setPesan("Rak tidak muat");
    else if (d.outcome) setPesan(pesanGagal(d.outcome));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasil]);

  useEffect(() => () => { jalanId.current++; }, []);

  /* ---------- render ---------- */

  const petakSorot = useMemo(() => {
    const s = new Set(sorot.map((c) => `${c.x},${c.y}`));
    if (tebakan) s.add(`${tebakan.x},${tebakan.y}`);
    return s;
  }, [sorot, tebakan]);
  const bisaKetukPetak = !sibuk && !terkunci && ((ronde.execMode === "langkah" && ronde.prediksi) || modeBendera);
  const blokLangkah = ronde.execMode === "langkah" ? lariLangkah?.steps[langkahKe] : undefined;

  return (
    <div className="flex flex-col gap-3" style={{ fontFamily: BALOO, color: INK }} data-mode={ronde.execMode}>
      {/* panggung */}
      <div className="relative rounded-[24px] bg-white/70 p-2 shadow-[0_4px_0_rgba(11,37,69,.1)]">
        <Panggung
          grid={grid}
          agam={agam}
          bendera={modeBendera ? bendera : null}
          sorot={petakSorot}
          tebakan={tebakan}
          bisaKetuk={bisaKetukPetak}
          onKetuk={ketukPetak}
          menang={!!hasil?.benar}
        />
        {grids.length > 1 && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2" aria-label="Semua kebun">
            {grids.map((g, i) => (
              <button
                key={g.id}
                onClick={() => { if (!sibuk && !terkunci) { sfx.tap(); setAktif(i); setAgam(awalAgam(g)); } }}
                className="relative rounded-[12px] bg-white p-1 shadow-[0_3px_0_rgba(11,37,69,.1)] active:translate-y-0.5"
                style={{ outline: i === aktif ? "3px solid #fd861d" : "3px solid transparent", minWidth: 56, minHeight: 56 }}
                aria-label={`Kebun ${i + 1}${statusGrid[i] ? `, ${statusGrid[i] === "✓" ? "berhasil" : "gagal"}` : ""}`}
              >
                <Mini grid={g} />
                {statusGrid[i] && (
                  <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full text-[13px] font-black text-white" style={{ background: statusGrid[i] === "✓" ? BENAR : SALAH }}>
                    {statusGrid[i]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={bantu}
          disabled={terkunci}
          aria-label="Bantu"
          className="absolute top-3 right-3 flex size-14 items-center justify-center rounded-full bg-[#fffaf0] shadow-[0_4px_0_#d8ccb4] active:translate-y-0.5 disabled:opacity-40"
        >
          <Icon name="lightbulb" size={28} className="text-[#e0a100]" />
        </button>
      </div>

      {/* pesan */}
      <div className="min-h-[28px] text-center text-[17px] font-extrabold" style={{ color: hasil ? (hasil.benar ? BENAR : SALAH) : INK, opacity: pesan ? 1 : 0 }} aria-live="polite">
        {pesan || "·"}
      </div>

      {/* ---------- mode langsung ---------- */}
      {ronde.execMode === "langsung" && (
        <>
          <div className="flex items-center justify-center gap-2 text-[14px] font-bold opacity-70">
            <span>{efektif.length} langkah</span>
            <button onClick={ulangLangsung} disabled={sibuk || terkunci || !efektif.length} className="rounded-full bg-white px-3 py-1.5 shadow-[0_3px_0_rgba(11,37,69,.12)] active:translate-y-0.5 disabled:opacity-40" style={{ minHeight: 36 }}>
              ↺ Ulang dari awal
            </button>
          </div>
          <Palet commands={palet} onTekan={tekanLangsung} nonaktif={sibuk || terkunci} besar />
        </>
      )}

      {/* ---------- mode program ---------- */}
      {ronde.execMode === "program" && (
        <>
          {modeBendera ? (
            <div className="flex flex-col gap-2">
              <Rak judul="Bagian 1 · sampai 🚩" blok={rak} slot={slotMaks} aktif={rakAktif === 0} sel={sel?.rak === 0 ? sel.i : null} onPilihRak={() => setRakAktif(0)} onKetuk={(i) => ketukRak(0, i)} onN={(i) => putarN(0, i)} onHapusIsi={(i, j) => hapusIsiUlangi(0, i, j)} />
              <Rak judul="Bagian 2 · dari 🚩 ke ⭐" blok={rak2} slot={slotMaks} aktif={rakAktif === 1} sel={sel?.rak === 1 ? sel.i : null} onPilihRak={() => setRakAktif(1)} onKetuk={(i) => ketukRak(1, i)} onN={(i) => putarN(1, i)} onHapusIsi={(i, j) => hapusIsiUlangi(1, i, j)} />
            </div>
          ) : (
            <Rak
              judul={ronde.debug ? `Perbaiki tepat ${ronde.fixes ?? 1} blok` : `Program Agam · ${hitungBlok(rak)}/${slotMaks} blok`}
              blok={rak} slot={slotMaks} aktif sel={sel?.rak === 0 ? sel.i : null}
              onKetuk={(i) => ketukRak(0, i)} onN={(i) => putarN(0, i)} onHapusIsi={(i, j) => hapusIsiUlangi(0, i, j)}
            />
          )}
          <Palet commands={palet} onTekan={tekanPalet} nonaktif={sibuk || terkunci} />
          <div className="flex gap-2">
            <button
              onClick={jalan}
              disabled={sibuk || terkunci}
              className="flex-1 rounded-[20px] bg-[#22b573] py-4 text-white shadow-[0_6px_0_#16804f] active:translate-y-1 disabled:opacity-50"
              style={{ fontSize: 24, fontWeight: 900, minHeight: 64 }}
            >
              Jalan ▶
            </button>
            <button
              onClick={() => { if (sibuk || terkunci) return; sfx.close(); setRak(ronde.program.map((b) => ({ ...b }))); setRak2([]); setSel(null); setBendera(null); setPesan(""); setAgam(awalAgam(grid)); setStatusGrid(grids.map(() => null)); }}
              disabled={sibuk || terkunci}
              aria-label="Ulang dari awal"
              className="flex w-16 items-center justify-center rounded-[20px] bg-[#fffaf0] shadow-[0_6px_0_#d8ccb4] active:translate-y-1 disabled:opacity-40"
            >
              <Icon name="restart_alt" size={28} />
            </button>
          </div>
        </>
      )}

      {/* ---------- mode langkah ---------- */}
      {ronde.execMode === "langkah" && lariLangkah && (
        <>
          <Rak judul={`Program Agam · blok ${Math.min(langkahKe + 1, Math.max(1, hitungBlok(ronde.program)))} dari ${hitungBlok(ronde.program)}`} blok={ronde.program} slot={Math.max(hitungBlok(ronde.program), 1)} aktif sel={null} bacaSaja />
          <div className="flex items-center gap-2">
            <div className="flex-1 text-[15px] font-bold opacity-75">
              {ronde.prediksi
                ? blokLangkah
                  ? `Blok berikutnya: ${BLOK[blokLangkah.cmd === "bendera" ? "bendera" : blokLangkah.cmd].label}. Ketuk petak tujuannya, lalu tekan Langkah.`
                  : "Program habis."
                : "Tekan Langkah untuk menjalankan satu blok."}
              {ronde.prediksi && prediksi.length > 0 && <span className="ml-1 opacity-80">({prediksi.filter(Boolean).length}/{prediksi.length} tebakan benar)</span>}
            </div>
            <button
              onClick={langkah}
              disabled={sibuk || terkunci || (ronde.prediksi && !tebakan && !!blokLangkah)}
              className="rounded-[20px] bg-[#3a86ff] px-6 py-4 text-white shadow-[0_6px_0_#2463c9] active:translate-y-1 disabled:opacity-50"
              style={{ fontSize: 22, fontWeight: 900, minHeight: 64, minWidth: 140 }}
            >
              Langkah ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- panggung ---------------- */

function Panggung({ grid, agam, bendera, sorot, tebakan, bisaKetuk, onKetuk, menang }: {
  grid: NavGrid; agam: Agam; bendera: { x: number; y: number } | null; sorot: Set<string>; tebakan: { x: number; y: number } | null;
  bisaKetuk: boolean; onKetuk: (x: number, y: number) => void; menang: boolean;
}) {
  const sel: ReactNode[] = [];
  for (let y = 0; y < grid.h; y++) {
    for (let x = 0; x < grid.w; x++) {
      const X = x * SEL, Y = y * SEL;
      const dinding = grid.walls.some((w) => samaSel(w, { x, y }));
      const batu = grid.rocks.some((b) => samaSel(b, { x, y }));
      const goal = samaSel(grid.goal, { x, y });
      const nyala = sorot.has(`${x},${y}`);
      const tebak = tebakan && samaSel(tebakan, { x, y });
      sel.push(
        <g key={`${x}-${y}`} onClick={bisaKetuk && !dinding ? () => onKetuk(x, y) : undefined} style={{ cursor: bisaKetuk && !dinding ? "pointer" : "default" }} role={bisaKetuk && !dinding ? "button" : undefined} aria-label={bisaKetuk ? `Petak ${x + 1}, ${y + 1}` : undefined}>
          <rect x={X + 3} y={Y + 3} width={SEL - 6} height={SEL - 6} rx={16} fill={(x + y) % 2 ? "#a9dc8a" : "#bde79f"} />
          <rect x={X + 3} y={Y + 3} width={SEL - 6} height={SEL - 6} rx={16} fill="url(#ka-bevel)" />
          {nyala && <rect x={X + 6} y={Y + 6} width={SEL - 12} height={SEL - 12} rx={14} fill={tebak ? "#3a86ff" : "#ffd23f"} opacity={tebak ? 0.45 : 0.55} className="goal-pulse" />}
          {nyala && <rect x={X + 6} y={Y + 6} width={SEL - 12} height={SEL - 12} rx={14} fill="none" stroke={tebak ? "#3a86ff" : "#ffb000"} strokeWidth={5} />}
          {dinding && <text x={X + SEL / 2} y={Y + SEL / 2 + 24} textAnchor="middle" fontSize={66}>🌳</text>}
          {batu && <text x={X + SEL / 2} y={Y + SEL / 2 + 20} textAnchor="middle" fontSize={56}>🪨</text>}
          {goal && (
            <g transform={`translate(${X + SEL / 2} ${Y + SEL / 2})`}>
              <circle r={40} fill="#ffd23f" opacity={0.3} className="goal-pulse" />
              <text y={22} textAnchor="middle" fontSize={menang ? 78 : 60} style={{ transition: "font-size 400ms" }}>⭐</text>
            </g>
          )}
          {bendera && samaSel(bendera, { x, y }) && <text x={X + SEL / 2 + 14} y={Y + 34} textAnchor="middle" fontSize={44}>🚩</text>}
        </g>,
      );
    }
  }
  const lebarMin = grid.w * PETAK_MIN;
  const lebarMaks = grid.w * PETAK_MAKS;
  return (
    <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <svg
        viewBox={`0 0 ${grid.w * SEL} ${grid.h * SEL}`}
        className="mx-auto block"
        style={{ width: "100%", minWidth: lebarMin, maxWidth: lebarMaks, touchAction: "manipulation" }}
        role="img"
        aria-label={`Kebun ${grid.w} kali ${grid.h} petak`}
      >
        <defs>{COMMON_DEFS}</defs>
        {sel}
        <circle cx={grid.start.x * SEL + SEL / 2} cy={grid.start.y * SEL + SEL / 2} r={30} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={5} strokeDasharray="8 8" />
        <g className="akademi-agam" style={{ transform: `translate(${agam.x * SEL + SEL / 2}px, ${agam.y * SEL + SEL / 2}px)` }}>
          <g key={agam.goyang} className={agam.goyang ? "akademi-shake" : undefined}>
            <g className={agam.senang ? "akademi-bounce" : undefined}>
              <g style={{ transform: `scale(${agam.lompat ? 1.3 : 0.82})`, transition: "transform 220ms cubic-bezier(0.3, 1.4, 0.5, 1)" }}>
                <g style={{ transform: `rotate(${agam.rot}deg)`, transition: "transform 300ms ease-in-out" }}>
                  <AgamTop bump={false} />
                </g>
              </g>
              {agam.wajah && (
                <text y={-38} textAnchor="middle" fontSize={40} className="akademi-pop">{agam.wajah}</text>
              )}
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

/** Thumbnail grid lain (semuaGrid). */
function Mini({ grid }: { grid: NavGrid }) {
  const s = 12;
  return (
    <svg viewBox={`0 0 ${grid.w * s} ${grid.h * s}`} width={Math.min(72, grid.w * s)} height={Math.min(72, grid.h * s)} aria-hidden style={{ display: "block" }}>
      {Array.from({ length: grid.h }, (_, y) => Array.from({ length: grid.w }, (_, x) => {
        const c = { x, y };
        const f = grid.walls.some((w) => samaSel(w, c)) ? "#2c6a1d" : grid.rocks.some((b) => samaSel(b, c)) ? "#9aa1a8" : samaSel(grid.goal, c) ? "#ffd23f" : samaSel(grid.start, c) ? "#2ec4a6" : (x + y) % 2 ? "#a9dc8a" : "#bde79f";
        return <rect key={`${x}-${y}`} x={x * s + 0.5} y={y * s + 0.5} width={s - 1} height={s - 1} rx={2} fill={f} />;
      }))}
    </svg>
  );
}

/* ---------------- palet & rak ---------------- */

function Palet({ commands, onTekan, nonaktif, besar }: { commands: NavCommand[]; onTekan: (c: NavCommand) => void; nonaktif: boolean; besar?: boolean }) {
  return (
    <div className="grid justify-center gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(commands.length, 4)}, minmax(0, ${besar ? 160 : 140}px))` }}>
      {commands.map((c) => (
        <button
          key={c}
          onClick={() => onTekan(c)}
          disabled={nonaktif}
          className="koding-block flex flex-col items-center justify-center gap-0.5 px-2 py-2 text-white disabled:opacity-50"
          style={{ background: BLOK[c].c, boxShadow: `0 5px 0 ${BLOK[c].d}`, minHeight: besar ? 76 : 64 }}
          aria-label={BLOK[c].label}
        >
          {BLOK[c].ikon}
          <span style={{ fontFamily: BALOO, fontSize: c === "kalau" ? 13 : 15, fontWeight: 800, lineHeight: 1.1, textAlign: "center" }}>{BLOK[c].label}</span>
        </button>
      ))}
    </div>
  );
}

function Rak({ judul, blok, slot, aktif, sel, bacaSaja, onPilihRak, onKetuk, onN, onHapusIsi }: {
  judul: string; blok: NavBlock[]; slot: number; aktif: boolean; sel: number | null; bacaSaja?: boolean;
  onPilihRak?: () => void; onKetuk?: (i: number) => void; onN?: (i: number) => void; onHapusIsi?: (i: number, j: number) => void;
}) {
  const terpakai = hitungBlok(blok);
  const kosong = Math.max(0, slot - terpakai);
  return (
    <div onClick={onPilihRak} className="rounded-[20px] p-2" style={{ background: aktif ? "rgba(11,37,69,.08)" : "rgba(11,37,69,.04)", outline: aktif && onPilihRak ? "3px solid #fd861d" : "3px solid transparent", boxShadow: "inset 0 3px 0 rgba(0,0,0,.06)" }}>
      <div className="mb-1 px-1 text-[13px] font-extrabold opacity-70">{judul}</div>
      <div className="flex flex-wrap items-center gap-1.5">
        {blok.map((b, i) => (
          <Keping key={i} blok={b} nomor={i + 1} dipilih={sel === i} bacaSaja={bacaSaja} onKetuk={() => onKetuk?.(i)} onN={() => onN?.(i)} onHapusIsi={(j) => onHapusIsi?.(i, j)} />
        ))}
        {Array.from({ length: kosong }, (_, k) => (
          <span key={`k${k}`} className="rounded-[12px]" style={{ width: 56, height: 56, border: "3px dashed rgba(11,37,69,.25)" }} aria-hidden />
        ))}
        {blok.length === 0 && !bacaSaja && <span className="ml-1 self-center text-[14px] font-bold opacity-60">Ketuk blok di bawah</span>}
      </div>
    </div>
  );
}

function Keping({ blok, nomor, dipilih, bacaSaja, onKetuk, onN, onHapusIsi }: {
  blok: NavBlock; nomor: number; dipilih: boolean; bacaSaja?: boolean; onKetuk: () => void; onN: () => void; onHapusIsi: (j: number) => void;
}) {
  const b = BLOK[blok.cmd];
  const gaya = { background: b.c, boxShadow: `0 3px 0 ${b.d}`, outline: dipilih ? "4px solid #ffd23f" : "4px solid transparent", outlineOffset: 1 } as const;
  if (blok.cmd === "ulangi") {
    return (
      <div className="relative flex items-center gap-1 rounded-[14px] p-1 pl-2 text-white" style={gaya} aria-label={`Blok ${nomor}: ulangi ${blok.n} kali`}>
        <button onClick={(e) => { e.stopPropagation(); onKetuk(); }} disabled={bacaSaja} className="flex items-center gap-1 self-stretch" style={{ minWidth: 44, minHeight: 48 }} aria-label={dipilih ? "Hapus blok ulangi" : "Isi blok ulangi"}>
          <span className="text-[22px]">🔁</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onN(); }} disabled={bacaSaja} className="rounded-[10px] bg-white/90 px-2 font-black text-[#c25a0c] active:scale-95" style={{ minWidth: 44, minHeight: 44, fontSize: 20 }} aria-label={`Ulangi ${blok.n} kali, ketuk untuk mengubah`}>
          {blok.n}×
        </button>
        <div className="flex items-center gap-1 rounded-[10px] bg-black/15 p-1" style={{ minWidth: 48, minHeight: 48 }}>
          {blok.body.map((c, j) => {
            const k = BLOK[c.cmd];
            return (
              <button key={j} onClick={(e) => { e.stopPropagation(); onHapusIsi(j); }} disabled={bacaSaja} className="flex items-center justify-center rounded-[10px] text-white" style={{ background: k.c, boxShadow: `0 2px 0 ${k.d}`, width: 44, height: 44 }} aria-label={`${k.label}, ketuk untuk menghapus`}>
                {c.cmd === "maju" ? <Icon name="arrow_upward" size={22} /> : c.cmd === "kiri" ? <Icon name="turn_left" size={22} /> : c.cmd === "kanan" ? <Icon name="turn_right" size={22} /> : <span style={{ fontSize: 20 }}>{c.cmd === "lompat" ? "🦘" : c.cmd === "kalau" ? "🤔" : "🚩"}</span>}
              </button>
            );
          })}
          {blok.body.length === 0 && <span className="text-[12px] font-bold opacity-80">isi…</span>}
        </div>
        <span className="absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full bg-white text-[11px] font-black" style={{ color: INK }}>{nomor}</span>
      </div>
    );
  }
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onKetuk(); }}
      disabled={bacaSaja}
      className="relative flex items-center justify-center rounded-[14px] text-white active:translate-y-0.5"
      style={{ ...gaya, width: blok.cmd === "kalau" ? 88 : 56, height: 56 }}
      aria-label={`Blok ${nomor}: ${b.label}${bacaSaja ? "" : dipilih ? ", ketuk lagi untuk menghapus" : ", ketuk untuk menghapus"}`}
    >
      {blok.cmd === "kalau" ? <span style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.1 }}>🪨? lompat<br />: maju</span> : b.ikon}
      <span className="absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full bg-white text-[11px] font-black" style={{ color: INK }}>{nomor}</span>
    </button>
  );
}
