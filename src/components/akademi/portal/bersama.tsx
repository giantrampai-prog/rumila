"use client";

// Potongan bersama portal Akademi (murid & wali): warna track, ikon mekanik, label status, helper event.

import { tintaPada } from "@/lib/brand";
import Link from "next/link";
import type { ReactNode } from "react";
import { LEVELS, TRACKS, type ContentPack, type GameEvent, type LevelId, type TrackId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { judulPaket } from "@/components/akademi/runner";
import { PLAY, type ColorKey } from "@/lib/catalog";
import { kompetensiUntuk, paketById, useBahasaAnak, type BahasaAnak } from "@/lib/akademi/konten";
import type { Status } from "@/lib/akademi/mastery";
import { useMe } from "@/lib/store";

export const INK = "#0b2545";

/** Jenjang & pelajaran yang sudah punya konten di Slice 1. */
export const LEVEL_SLICE: readonly LevelId[] = ["PAUD", "TKA", "TKB"];
export const TRACK_SLICE: readonly TrackId[] = ["MAT", "KODE", "SAINS"];

/** Warna pelajaran mengikuti pilar desain sistem RINOYA (pilar-mat indigo, pilar-teknologi ungu, pilar-sains teal, pilar-bahasa pink, pilar-kreativitas merah, pilar-karakter hijau). */
export const TRACK_WARNA: Record<TrackId, ColorKey> = {
  MAT: "indigo",
  KODE: "purple",
  SAINS: "teal",
  BIND: "blue",
  BING: "pink",
  DUNIA: "sky",
  SENI: "red",
  KARAKTER: "green",
};
export const TRACK_IKON: Record<TrackId, string> = {
  MAT: "calculate",
  KODE: "smart_toy",
  SAINS: "science",
  BIND: "menu_book",
  BING: "translate",
  DUNIA: "public",
  SENI: "palette",
  KARAKTER: "volunteer_activism",
};

const MEKANIK_IKON: Record<string, string> = { pilah: "category", urutkan: "low_priority", dagang: "storefront", navigasi: "smart_toy", pola: "pattern", simulasi: "science" };
const MEKANIK_LABEL: Record<string, string> = { pilah: "Pilah", urutkan: "Urutkan", dagang: "Pasar", navigasi: "Robot", pola: "Pola", simulasi: "Coba" };
export const ikonMekanik = (m: string) => MEKANIK_IKON[m] ?? "extension";
export const labelMekanik = (m: string) => MEKANIK_LABEL[m] ?? "Main";
/** Satu warna netral untuk semua ikon mekanik (indigo lembut) — mekanik bukan makna, jadi tidak diberi warna berbeda. */
export const MEKANIK_NETRAL = { bg: "#e3f1fd", fg: "#0786eb" };

export const trackMeta = (id: TrackId) => TRACKS.find((t) => t.id === id)!;
export const levelMeta = (id: LevelId) => LEVELS.find((l) => l.id === id)!;
export const isTrackId = (s: string): s is TrackId => TRACKS.some((t) => t.id === s);

export const STATUS_WARNA: Record<Status, string> = { dikuasai: "#1fbf62", berkembang: "#ffbe0b", belum: "#f0e4d2" };
export const STATUS_LABEL: Record<Status, string> = { dikuasai: "Dikuasai", berkembang: "Berkembang", belum: "Belum" };
export const STATUS_SIMBOL: Record<Status, string> = { dikuasai: "✓", berkembang: "●", belum: "○" };

const FRAMEWORK_NAMA: Record<string, string> = {
  CAMBRIDGE_EY: "Cambridge Early Years",
  CAMBRIDGE_PRIMARY_MATHS: "Cambridge Primary Maths",
  CAMBRIDGE_PRIMARY_COMPUTING: "Cambridge Primary Computing",
  CAMBRIDGE_PRIMARY_SCIENCE: "Cambridge Primary Science",
  CAMBRIDGE_PRIMARY_ENGLISH: "Cambridge Primary English",
  CAMBRIDGE_GLOBAL_PERSPECTIVES: "Cambridge Global Perspectives",
  EYFS: "EYFS",
  COMMON_CORE: "Common Core",
  CEFR: "CEFR",
  KURMER: "Kurikulum Merdeka",
};
export const namaFramework = (f: string) => FRAMEWORK_NAMA[f] ?? f;

/* ---------------- tanggal & event ---------------- */

export function tanggalLokal(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
export function tanggalJam(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
const hariLokal = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso.slice(0, 10) : d.toLocaleDateString("id-ID");
};

/** Jumlah hari berbeda dengan event attempt dalam `hari` hari terakhir. */
export function hitungStreak(events: GameEvent[], hari = 7): number {
  const batas = Date.now() - hari * 86400000;
  const set = new Set<string>();
  for (const e of events) {
    if (e.type !== "attempt") continue;
    const t = new Date(e.clientAt).getTime();
    if (Number.isNaN(t) || t < batas) continue;
    set.add(hariLokal(e.clientAt));
  }
  return set.size;
}

/** Paket yang terakhir diselesaikan dengan sukses ≥ 60% (unik, terbaru dulu). */
export function stikerTerbaru(events: GameEvent[], n = 3): ContentPack[] {
  const out: ContentPack[] = [];
  const lihat = new Set<string>();
  const urut = events.filter((e) => e.type === "activity_end").sort((a, b) => (a.clientAt < b.clientAt ? 1 : -1));
  for (const e of urut) {
    const r = rasioSukses(e);
    if (r === null || r < 0.6 || lihat.has(e.activityId)) continue;
    const paket = paketById(e.activityId);
    if (!paket) continue;
    lihat.add(e.activityId);
    out.push(paket);
    if (out.length >= n) break;
  }
  return out;
}

/** Rasio sukses satu event activity_end; null bila tidak ada hitungan. */
function rasioSukses(e: GameEvent): number | null {
  const p = e.payload as { successCount?: unknown; failCount?: unknown };
  const s = typeof p.successCount === "number" ? p.successCount : 0;
  const f = typeof p.failCount === "number" ? p.failCount : 0;
  return s + f === 0 ? null : s / (s + f);
}

/** Id paket yang pernah diselesaikan dengan sukses ≥ 60% (untuk tanda ⭐). */
export function paketSelesai(events: GameEvent[]): Set<string> {
  const out = new Set<string>();
  for (const e of events) {
    if (e.type !== "activity_end") continue;
    const r = rasioSukses(e);
    if (r !== null && r >= 0.6) out.add(e.activityId);
  }
  return out;
}

/** Satu kalimat "Aku bisa …" dari kompetensi pertama paket (bahasa konten anak, default id). */
export function kalimatKompetensi(p: ContentPack, bahasa: BahasaAnak = "id"): string {
  const c = kompetensiUntuk(p.id)[0];
  return c ? (c.statement[bahasa] ?? c.statement.id) : "";
}

/* ---------------- potongan UI ---------------- */

/** Tab besar gaya Playful (pengganti Segmented kecil). */
export function TabBesar<T extends string>({ value, options, onChange, c = "blue" }: { value: T; options: [T, string, string?][]; onChange: (v: T) => void; c?: ColorKey }) {
  const [l, m, d] = PLAY[c];
  return (
    <div role="tablist" className="flex gap-1 rounded-[20px] bg-white p-1.5 shadow-[0_4px_0_rgba(11,37,69,.06)]">
      {options.map(([id, label, icon]) => {
        const on = id === value;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[15px] py-2.5 transition-transform active:scale-[.97]"
            style={{
              fontFamily: BALOO,
              fontSize: 17,
              fontWeight: 800,
              color: on ? tintaPada(c) : INK,
              background: on ? `linear-gradient(155deg, ${l}, ${m} 65%)` : "transparent",
              boxShadow: on ? `0 3px 0 ${d}` : "none",
            }}
          >
            {icon && <Icon name={icon} size={20} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function TitikStatus({ status, size = 12 }: { status: Status; size?: number }) {
  return <span aria-label={STATUS_LABEL[status]} className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, background: STATUS_WARNA[status] }} />;
}

export function BadgeStatus({ status }: { status: Status }) {
  const bg = status === "dikuasai" ? "#e4f8ec" : status === "berkembang" ? "#fff4d1" : "#fff0da";
  const fg = status === "dikuasai" ? "#12904a" : status === "berkembang" ? "#b07a00" : "#5b6b85";
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-extrabold" style={{ background: bg, color: fg }}>
      <span aria-hidden>{STATUS_SIMBOL[status]}</span>
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Ikon status kompetensi: ○ belum (abu), ● berkembang (kuning), ✓ dikuasai (hijau). */
export function IkonStatus({ status, size = 28 }: { status: Status; size?: number }) {
  const bg = status === "dikuasai" ? "#127a43" : status === "berkembang" ? "#ffbe0b" : "#fff";
  const border = status === "belum" ? "2.5px solid #d6cde4" : "none";
  return (
    <span
      aria-label={STATUS_LABEL[status]}
      className="flex shrink-0 items-center justify-center rounded-full text-white"
      style={{ width: size, height: size, background: bg, border, fontFamily: BALOO, fontSize: size * 0.6, fontWeight: 800, lineHeight: 1 }}
    >
      {status === "dikuasai" ? <Icon name="check" size={size * 0.68} /> : status === "berkembang" ? <span aria-hidden className="block rounded-full bg-white" style={{ width: size * 0.32, height: size * 0.32 }} /> : null}
    </span>
  );
}

/** Lingkaran ikon mekanik, warna netral indigo lembut. */
export function IkonMekanik({ mekanik, size = 44 }: { mekanik: string; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size, background: MEKANIK_NETRAL.bg, color: MEKANIK_NETRAL.fg }}>
      <Icon name={ikonMekanik(mekanik)} size={Math.round(size * 0.55)} />
    </span>
  );
}

/** Tombol aktivitas besar (≥56px): ikon mekanik netral, judul, label mekanik, ⭐ bila pernah selesai, ▶ di kanan. */
export function TombolAktivitas({ p, selesai = false }: { p: ContentPack; selesai?: boolean }) {
  const me = useMe();
  const bahasa = useBahasaAnak(me.id);
  return (
    <Link
      href={`/akademi/main/${p.id}`}
      className="flex min-h-[60px] items-center gap-3 rounded-[18px] bg-white py-2 pr-2.5 pl-2.5 transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] active:scale-[.98]"
      style={{ boxShadow: "0 3px 0 rgba(11,37,69,.08), inset 0 0 0 1.5px #fff0da" }}
    >
      <IkonMekanik mekanik={p.mechanic} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate leading-tight" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, color: INK }}>
            {judulPaket(p, bahasa)}
          </span>
          {selesai && (
            <span aria-label="Pernah diselesaikan" className="shrink-0 text-[14px] leading-none">
              ⭐
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[12px] font-extrabold text-ink-3">{labelMekanik(p.mechanic)}</span>
      </span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(155deg,#1f94f0,#0567c2 60%)", boxShadow: "0 2px 0 #0567c2" }}>
        <Icon name="play_arrow" size={24} />
      </span>
    </Link>
  );
}

/** Kepala halaman berwarna (gaya WorldView) dengan tombol kembali. */
export function KepalaWarna({ c, icon, judul, sub, kembali = "/akademi", right }: { c: ColorKey; icon: string; judul: string; sub?: string; kembali?: string; right?: ReactNode }) {
  const [l, m, d] = PLAY[c];
  return (
    <div className="relative flex items-center gap-3 overflow-hidden rounded-[24px] p-3.5 sm:p-4" style={{ color: tintaPada(c), background: `linear-gradient(155deg, ${l} 0%, ${m} 60%)`, boxShadow: `0 5px 0 ${d}` }}>
      <div aria-hidden className="absolute -right-12 -bottom-16 size-48 rounded-full bg-white/20" />
      <Link href={kembali} aria-label="Kembali" className="relative flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-white transition-transform active:scale-95" style={{ color: d, boxShadow: `0 4px 0 ${d}55` }}>
        <Icon name="arrow_back" size={24} />
      </Link>
      <div className="relative min-w-0 flex-1">
        <h1 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, lineHeight: 1.05, textShadow: tintaPada(c) === "#fff" ? "0 2px 0 rgba(0,0,0,.12)" : undefined }}>{judul}</h1>
        {sub && <p className="mt-0.5 text-[13px] font-extrabold opacity-90">{sub}</p>}
      </div>
      {right}
      <span className="relative hidden size-14 items-center justify-center rounded-[18px] bg-white sm:flex" style={{ boxShadow: `0 3px 0 ${d}55` }}>
        <span className="ms" style={{ fontSize: 34, color: m }}>
          {icon}
        </span>
      </span>
    </div>
  );
}
