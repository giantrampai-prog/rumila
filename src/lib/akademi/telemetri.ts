// Telemetri Academy untuk tim/wali admin — fungsi murni, tanpa DOM / React.
// Input: event gabungan semua anak (tiap event punya learnerId) + katalog paket/kompetensi.
// Dipakai halaman /akademi/telemetri untuk menemukan paket yang terlalu mudah/sukar,
// titik berhenti, waktu reaksi (median latensi), dan sebaran penguasaan per kompetensi (slice-1 langkah 11).

import type { Competency, ContentPack, GameEvent, LevelId, TrackId } from "@akademi/schema";
import { proyeksi, type Status } from "./mastery";

export type Bendera = "terlalu-mudah" | "terlalu-sukar" | "sering-berhenti" | "banyak-hint";

export interface RingkasanPaket {
  paketId: string;
  mechanic: string;
  level: LevelId;
  mulai: number;
  selesai: number;
  /** activity_start tanpa activity_end dalam sesi (sessionId) yang sama */
  berhenti: number;
  attempts: number;
  benar: number;
  rasio: number;
  medianLatencyMs: number;
  hintRate: number;
  anakUnik: number;
  knobRataRata: Record<string, number>;
  bendera: Bendera[];
}

export interface RingkasanKompetensi {
  id: string;
  statement: string;
  core: boolean;
  level: LevelId;
  track: TrackId;
  /** jumlah anak pada tiap status */
  belum: number;
  berkembang: number;
  dikuasai: number;
  attempts: number;
  rasio: number;
}

export interface RingkasanAnak {
  /** hari lokal berbeda dengan event apa pun dalam 30 hari terakhir */
  hariAktif: number;
  /** dari activity_end.durationMs, dibulatkan */
  menitMain: number;
  /** activity_end dengan outcome "selesai" */
  aktivitasSelesai: number;
  rasio: number;
  terakhirAt?: string;
}

export interface RingkasanHari {
  /** tanggal lokal YYYY-MM-DD */
  tanggal: string;
  attempts: number;
  benar: number;
  anakUnik: number;
}

/* ---------------- util ---------------- */

const HARI_MS = 86400000;

/** Kunci tanggal lokal YYYY-MM-DD (bukan UTC) agar grafik harian mengikuti hari si pemakai. */
export function kunciHari(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const t = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${t}`;
}

function kunciHariIso(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso.slice(0, 10) : kunciHari(d);
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = xs.slice().sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

const rasioDari = (benar: number, total: number) => (total ? benar / total : 0);

interface Percobaan {
  correct: boolean;
  hintUsed: boolean;
  latencyMs: number | null;
  knobs: Record<string, number> | null;
  competencyIds: string[];
}

function bacaAttempt(e: GameEvent): Percobaan | null {
  if (e.type !== "attempt") return null;
  const p = e.payload as { correct?: unknown; hintUsed?: unknown; latencyMs?: unknown; knobs?: unknown; competencyIds?: unknown };
  const knobs = p.knobs && typeof p.knobs === "object" && !Array.isArray(p.knobs) ? (p.knobs as Record<string, unknown>) : null;
  const knobAngka: Record<string, number> = {};
  if (knobs) for (const [k, v] of Object.entries(knobs)) if (typeof v === "number" && Number.isFinite(v)) knobAngka[k] = v;
  return {
    correct: p.correct === true,
    hintUsed: p.hintUsed === true,
    latencyMs: typeof p.latencyMs === "number" && Number.isFinite(p.latencyMs) ? p.latencyMs : null,
    knobs: knobs ? knobAngka : null,
    competencyIds: Array.isArray(p.competencyIds) ? p.competencyIds.filter((c): c is string => typeof c === "string") : [],
  };
}

function bacaEnd(e: GameEvent): { outcome: string; durationMs: number } | null {
  if (e.type !== "activity_end") return null;
  const p = e.payload as { outcome?: unknown; durationMs?: unknown };
  return {
    outcome: typeof p.outcome === "string" ? p.outcome : "",
    durationMs: typeof p.durationMs === "number" && Number.isFinite(p.durationMs) ? p.durationMs : 0,
  };
}

/* ---------------- per paket ---------------- */

interface AkumPaket {
  paket: ContentPack;
  learner: Set<string>;
  mulai: number;
  selesai: number;
  /** per sesi: jumlah start dan end, untuk menghitung start tanpa end */
  sesi: Map<string, { start: number; end: number }>;
  latency: number[];
  attempts: number;
  benar: number;
  hint: number;
  knobJumlah: Record<string, number>;
  knobN: Record<string, number>;
}

export function bendera(r: Pick<RingkasanPaket, "attempts" | "rasio" | "medianLatencyMs" | "hintRate" | "mulai" | "berhenti">): Bendera[] {
  const out: Bendera[] = [];
  if (r.attempts >= 8 && r.rasio < 0.4) out.push("terlalu-sukar");
  if (r.attempts >= 8 && r.rasio >= 0.9 && r.medianLatencyMs < 4000) out.push("terlalu-mudah");
  if (r.mulai >= 4 && r.berhenti / r.mulai >= 0.5) out.push("sering-berhenti");
  if (r.attempts >= 8 && r.hintRate >= 0.4) out.push("banyak-hint");
  return out;
}

/**
 * Ringkasan tiap paket yang pernah dimainkan (activityId cocok dengan id paket).
 * Urut: yang berbendera dulu, lalu attempts terbanyak.
 */
export function ringkasPaket(events: GameEvent[], paket: ContentPack[]): RingkasanPaket[] {
  const idx = new Map(paket.map((p) => [p.id, p]));
  const akum = new Map<string, AkumPaket>();
  const ambil = (p: ContentPack) =>
    akum.get(p.id) ??
    akum
      .set(p.id, { paket: p, learner: new Set(), mulai: 0, selesai: 0, sesi: new Map(), latency: [], attempts: 0, benar: 0, hint: 0, knobJumlah: {}, knobN: {} })
      .get(p.id)!;

  for (const e of events) {
    const p = idx.get(e.activityId);
    if (!p) continue;
    const a = ambil(p);
    a.learner.add(e.learnerId);
    if (e.type === "activity_start") {
      a.mulai++;
      const s = a.sesi.get(e.sessionId) ?? a.sesi.set(e.sessionId, { start: 0, end: 0 }).get(e.sessionId)!;
      s.start++;
    } else if (e.type === "activity_end") {
      const s = a.sesi.get(e.sessionId) ?? a.sesi.set(e.sessionId, { start: 0, end: 0 }).get(e.sessionId)!;
      s.end++;
      if (bacaEnd(e)?.outcome === "selesai") a.selesai++;
    } else if (e.type === "attempt") {
      const at = bacaAttempt(e);
      if (!at) continue;
      a.attempts++;
      if (at.correct) a.benar++;
      if (at.hintUsed) a.hint++;
      if (at.latencyMs !== null) a.latency.push(at.latencyMs);
      if (at.knobs)
        for (const [k, v] of Object.entries(at.knobs)) {
          a.knobJumlah[k] = (a.knobJumlah[k] ?? 0) + v;
          a.knobN[k] = (a.knobN[k] ?? 0) + 1;
        }
    }
  }

  const out: RingkasanPaket[] = [];
  for (const a of akum.values()) {
    let berhenti = 0;
    for (const s of a.sesi.values()) berhenti += Math.max(0, s.start - s.end);
    const knobRataRata: Record<string, number> = {};
    for (const k of Object.keys(a.knobJumlah)) knobRataRata[k] = Math.round((a.knobJumlah[k] / a.knobN[k]) * 100) / 100;
    const dasar = {
      paketId: a.paket.id,
      mechanic: a.paket.mechanic,
      level: a.paket.level,
      mulai: a.mulai,
      selesai: a.selesai,
      berhenti,
      attempts: a.attempts,
      benar: a.benar,
      rasio: rasioDari(a.benar, a.attempts),
      medianLatencyMs: median(a.latency),
      hintRate: rasioDari(a.hint, a.attempts),
      anakUnik: a.learner.size,
      knobRataRata,
    };
    out.push({ ...dasar, bendera: bendera(dasar) });
  }
  out.sort((x, y) => {
    const fx = x.bendera.length ? 1 : 0;
    const fy = y.bendera.length ? 1 : 0;
    if (fx !== fy) return fy - fx;
    if (x.attempts !== y.attempts) return y.attempts - x.attempts;
    return x.paketId < y.paketId ? -1 : x.paketId > y.paketId ? 1 : 0;
  });
  return out;
}

/* ---------------- per kompetensi ---------------- */

/** Sebaran status penguasaan antar anak + rasio benar gabungan per kompetensi (urutan mengikuti `kompetensi`). */
export function ringkasKompetensi(eventsPerAnak: Record<string, GameEvent[]>, kompetensi: Competency[]): RingkasanKompetensi[] {
  const status = new Map<string, Record<Status, number>>();
  const percobaan = new Map<string, { attempts: number; benar: number }>();
  for (const c of kompetensi) {
    status.set(c.id, { belum: 0, berkembang: 0, dikuasai: 0 });
    percobaan.set(c.id, { attempts: 0, benar: 0 });
  }
  for (const events of Object.values(eventsPerAnak)) {
    const peng = proyeksi(events, kompetensi);
    for (const c of kompetensi) status.get(c.id)![peng[c.id]?.status ?? "belum"]++;
    for (const e of events) {
      const at = bacaAttempt(e);
      if (!at) continue;
      for (const cid of at.competencyIds) {
        const p = percobaan.get(cid);
        if (!p) continue;
        p.attempts++;
        if (at.correct) p.benar++;
      }
    }
  }
  return kompetensi.map((c) => {
    const s = status.get(c.id)!;
    const p = percobaan.get(c.id)!;
    return {
      id: c.id,
      statement: c.statement.id,
      core: c.core,
      level: c.level,
      track: c.track,
      belum: s.belum,
      berkembang: s.berkembang,
      dikuasai: s.dikuasai,
      attempts: p.attempts,
      rasio: rasioDari(p.benar, p.attempts),
    };
  });
}

/* ---------------- per anak ---------------- */

export function ringkasAnak(events: GameEvent[], learnerId: string, now: Date = new Date()): RingkasanAnak {
  const batas = now.getTime() - 30 * HARI_MS;
  const hari = new Set<string>();
  let durasi = 0;
  let selesai = 0;
  let attempts = 0;
  let benar = 0;
  let terakhirAt: string | undefined;
  for (const e of events) {
    if (e.learnerId !== learnerId) continue;
    const t = new Date(e.clientAt).getTime();
    if (!Number.isNaN(t) && t >= batas && t <= now.getTime() + HARI_MS) hari.add(kunciHariIso(e.clientAt));
    if (!terakhirAt || e.clientAt > terakhirAt) terakhirAt = e.clientAt;
    const end = bacaEnd(e);
    if (end) {
      durasi += end.durationMs;
      if (end.outcome === "selesai") selesai++;
      continue;
    }
    const at = bacaAttempt(e);
    if (at) {
      attempts++;
      if (at.correct) benar++;
    }
  }
  return { hariAktif: hari.size, menitMain: Math.round(durasi / 60000), aktivitasSelesai: selesai, rasio: rasioDari(benar, attempts), terakhirAt };
}

/* ---------------- harian ---------------- */

/** `hari` tanggal lokal terakhir (termasuk hari ini), urut lama → baru; hari tanpa percobaan tetap ada dengan 0. */
export function ringkasHarian(events: GameEvent[], hari = 14, now: Date = new Date()): RingkasanHari[] {
  const per = new Map<string, { attempts: number; benar: number; anak: Set<string> }>();
  const out: RingkasanHari[] = [];
  const awal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = hari - 1; i >= 0; i--) {
    const d = new Date(awal.getFullYear(), awal.getMonth(), awal.getDate() - i);
    const k = kunciHari(d);
    per.set(k, { attempts: 0, benar: 0, anak: new Set() });
  }
  for (const e of events) {
    const at = bacaAttempt(e);
    if (!at) continue;
    const b = per.get(kunciHariIso(e.clientAt));
    if (!b) continue;
    b.attempts++;
    if (at.correct) b.benar++;
    b.anak.add(e.learnerId);
  }
  for (const [tanggal, b] of per) out.push({ tanggal, attempts: b.attempts, benar: b.benar, anakUnik: b.anak.size });
  return out;
}

/* ---------------- teks untuk dibagikan ---------------- */

const LABEL_BENDERA: Record<Bendera, string> = {
  "terlalu-mudah": "terlalu mudah",
  "terlalu-sukar": "terlalu sukar",
  "sering-berhenti": "sering berhenti",
  "banyak-hint": "banyak hint",
};
export const labelBendera = (b: Bendera) => LABEL_BENDERA[b];

const pct = (r: number) => `${Math.round(r * 100)}%`;

/** Ringkasan teks polos untuk disalin ke tim (nama paket/anak dipasok pemanggil). */
export function teksRingkasan(o: {
  tanggal: string;
  anakAktif: number;
  totalAnak: number;
  selesaiMingguIni: number;
  rasio: number;
  paket: RingkasanPaket[];
  namaPaket: (id: string) => string;
  kompetensi: RingkasanKompetensi[];
  anak: { nama: string; r: RingkasanAnak }[];
}): string {
  const baris: string[] = [];
  baris.push(`Telemetri Academy — ${o.tanggal}`);
  baris.push(`Anak aktif 7 hari: ${o.anakAktif}/${o.totalAnak} · aktivitas selesai minggu ini: ${o.selesaiMingguIni} · rasio benar: ${pct(o.rasio)}`);
  const berbendera = o.paket.filter((p) => p.bendera.length);
  baris.push("");
  baris.push(berbendera.length ? `Paket berbendera (${berbendera.length}):` : "Paket berbendera: tidak ada");
  for (const p of berbendera.slice(0, 12))
    baris.push(`- ${o.namaPaket(p.paketId)} [${p.mechanic}/${p.level}]: ${p.bendera.map(labelBendera).join(", ")} · ${p.attempts} percobaan · ${pct(p.rasio)} benar · median ${(p.medianLatencyMs / 1000).toFixed(1)} dtk · hint ${pct(p.hintRate)} · berhenti ${p.berhenti}/${p.mulai}`);
  const sukar = o.kompetensi
    .filter((k) => k.attempts > 0)
    .slice()
    .sort((a, b) => a.rasio - b.rasio)
    .slice(0, 5);
  if (sukar.length) {
    baris.push("");
    baris.push("Kompetensi rasio terendah:");
    for (const k of sukar) baris.push(`- ${k.id} (${pct(k.rasio)} dari ${k.attempts}) · dikuasai ${k.dikuasai}, berkembang ${k.berkembang}, belum ${k.belum}`);
  }
  if (o.anak.length) {
    baris.push("");
    baris.push("Per anak (30 hari):");
    for (const a of o.anak) baris.push(`- ${a.nama}: ${a.r.hariAktif} hari aktif · ${a.r.menitMain} menit · ${a.r.aktivitasSelesai} selesai · ${pct(a.r.rasio)} benar`);
  }
  return baris.join("\n");
}
