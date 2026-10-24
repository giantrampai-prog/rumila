"use client";

// Rekam jejak belajar per anak: event append-only, disimpan lokal dulu, dikirim ke tabel learner_event.
// - localStorage["rumila-akademi-events-<memberId>"]: array GameEvent (maks 3000 terbaru) — cache server + lokal.
// - localStorage["rumila-akademi-antrean"]: array id event yang belum terkirim.
// - catatEvent(): isi id + clientAt, validasi, simpan, jadwalkan kirim (debounce 2 dtk, upsert batch idempoten).
//   Belum ada familyId / gagal → tetap di antrean; dicoba lagi saat `online`, dan dikirim langsung saat
//   visibilitychange hidden / pagehide.
// - tarikEvents(): dipanggil loadFamily — event rumah dari server digabung dengan lokal (dedupe id).
// Hook useEvents() memakai React; fungsi lain tidak menyentuh React saat dipanggil.

import { useEffect, useState } from "react";
import { GameEvent } from "@akademi/schema";
import { uuid } from "@/lib/uuid";
import { supabase } from "@/lib/supabase/client";
import { useCloud } from "@/lib/supabase/family";
import type { Json } from "@/lib/supabase/types";

const PREFIX = "rumila-akademi-events-";
const KEY = (memberId: string) => PREFIX + memberId;
const ANTREAN = "rumila-akademi-antrean";
const MAKS_LOKAL = 3000;
const DEBOUNCE = 2000;
const BATCH = 200;
export const EVENT_NAMA = "rumila:akademi";

const adaWindow = () => typeof window !== "undefined";

/* ---------------- penyimpanan lokal ---------------- */

function bacaJson<T>(key: string, fallback: T): T {
  if (!adaWindow()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function tulisJson(key: string, v: unknown) {
  if (!adaWindow()) return;
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch (e) {
    console.error("[akademi] simpan lokal gagal", key, e);
  }
}

const urutWaktu = (a: GameEvent, b: GameEvent) => (a.clientAt < b.clientAt ? -1 : a.clientAt > b.clientAt ? 1 : 0);

function simpanAnak(memberId: string, events: GameEvent[]) {
  const urut = events.slice().sort(urutWaktu);
  tulisJson(KEY(memberId), urut.length > MAKS_LOKAL ? urut.slice(-MAKS_LOKAL) : urut);
}

/** Event anak dari cache lokal (server + lokal yang sudah digabung), urut clientAt. */
export function eventsAnak(learnerId: string): GameEvent[] {
  const arr = bacaJson<unknown>(KEY(learnerId), []);
  return Array.isArray(arr) ? (arr as GameEvent[]) : [];
}

function bacaAntrean(): string[] {
  const a = bacaJson<unknown>(ANTREAN, []);
  return Array.isArray(a) ? a.filter((x): x is string => typeof x === "string") : [];
}
function tulisAntrean(ids: string[]) {
  tulisJson(ANTREAN, ids);
}

/** Semua kunci cache anak di perangkat ini (untuk mencari event antrean setelah muat ulang). */
function semuaMemberLokal(): string[] {
  if (!adaWindow()) return [];
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length));
    }
  } catch {}
  return out;
}

/* ---------------- emitter internal + hook ---------------- */

type Pendengar = (memberIds: string[]) => void;
const pendengar = new Set<Pendengar>();
function umumkan(memberIds: string[]) {
  for (const fn of pendengar) {
    try {
      fn(memberIds);
    } catch (e) {
      console.error("[akademi] pendengar event gagal", e);
    }
  }
}

/** Hook: event anak, ikut berubah saat catatEvent()/tarikEvents(). */
export function useEvents(learnerId: string): GameEvent[] {
  const [events, setEvents] = useState<GameEvent[]>(() => eventsAnak(learnerId));
  useEffect(() => {
    setEvents(eventsAnak(learnerId));
    const segar = (ids: string[]) => {
      if (!ids.length || ids.includes(learnerId)) setEvents(eventsAnak(learnerId));
    };
    const dariWindow = (e: Event) => segar(Array.isArray((e as CustomEvent).detail) ? ((e as CustomEvent).detail as string[]) : []);
    pendengar.add(segar);
    window.addEventListener(EVENT_NAMA, dariWindow);
    return () => {
      pendengar.delete(segar);
      window.removeEventListener(EVENT_NAMA, dariWindow);
    };
  }, [learnerId]);
  return events;
}

/* ---------------- kirim ke server ---------------- */

/** id → learnerId untuk event yang dicatat di sesi ini (setelah muat ulang: dicari di cache tiap anak). */
const pemilik = new Map<string, string>();
let timer: ReturnType<typeof setTimeout> | null = null;
let sedangKirim = false;
let ulangSetelahnya = false;

function jadwalkanKirim() {
  if (!adaWindow() || timer) return;
  timer = setTimeout(() => {
    timer = null;
    void kirimAntrean();
  }, DEBOUNCE);
}

function flush() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  void kirimAntrean();
}

function cariEvent(ids: Set<string>): GameEvent[] {
  const out: GameEvent[] = [];
  const sisa = new Set(ids);
  // 1) yang pemiliknya diketahui
  const perAnak = new Map<string, GameEvent[]>();
  const ambil = (memberId: string) => perAnak.get(memberId) ?? perAnak.set(memberId, eventsAnak(memberId)).get(memberId)!;
  for (const id of ids) {
    const m = pemilik.get(id);
    if (!m) continue;
    const e = ambil(m).find((x) => x.id === id);
    if (e) {
      out.push(e);
      sisa.delete(id);
    }
  }
  // 2) sisanya: pindai cache semua anak di perangkat
  if (sisa.size)
    for (const m of semuaMemberLokal()) {
      for (const e of ambil(m))
        if (sisa.has(e.id)) {
          out.push(e);
          sisa.delete(e.id);
          pemilik.set(e.id, m);
        }
      if (!sisa.size) break;
    }
  return out;
}

/** Kirim semua event di antrean (idempoten: upsert onConflict id, ignoreDuplicates). */
export async function kirimAntrean(): Promise<void> {
  if (!adaWindow()) return;
  if (sedangKirim) {
    ulangSetelahnya = true;
    return;
  }
  const fid = useCloud.getState().familyId;
  const antrean = bacaAntrean();
  if (!fid || !antrean.length) return;
  sedangKirim = true;
  try {
    const ids = new Set(antrean);
    const events = cariEvent(ids);
    // id di antrean yang eventnya sudah tidak ada di cache (terpangkas) tidak bisa dikirim: buang
    const hilang = antrean.filter((id) => !events.some((e) => e.id === id));
    const terkirim = new Set<string>(hilang);
    for (let i = 0; i < events.length; i += BATCH) {
      const potong = events.slice(i, i + BATCH);
      const { error } = await supabase()
        .from("learner_event")
        .upsert(
          potong.map((e) => ({
            id: e.id,
            family_id: fid,
            member_id: e.learnerId,
            session_id: e.sessionId,
            activity_id: e.activityId,
            mechanic: e.mechanic,
            type: e.type,
            payload: e.payload as Json,
            client_at: e.clientAt,
          })),
          { onConflict: "id", ignoreDuplicates: true },
        );
      if (error) {
        console.error("[akademi] kirim event gagal", error);
        break;
      }
      for (const e of potong) terkirim.add(e.id);
    }
    if (terkirim.size) tulisAntrean(bacaAntrean().filter((id) => !terkirim.has(id)));
  } finally {
    sedangKirim = false;
    if (ulangSetelahnya) {
      ulangSetelahnya = false;
      jadwalkanKirim();
    }
  }
}

if (adaWindow()) {
  window.addEventListener("online", () => void kirimAntrean());
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
  window.addEventListener("pagehide", flush);
}

/* ---------------- API ---------------- */

/** Catat satu event: isi id + clientAt, simpan lokal, jadwalkan kirim. Event tidak valid tetap disimpan lokal tapi tidak dikirim. */
export function catatEvent(e: Omit<GameEvent, "id" | "clientAt">): GameEvent {
  const lengkap = { ...e, id: uuid(), clientAt: new Date().toISOString() } as GameEvent;
  const r = GameEvent.safeParse(lengkap);
  const valid = r.success;
  // Anggota demo (id bukan UUID) hanya disimpan lokal; bukan kesalahan, cukup catatan debug.
  if (!valid) (r.error.issues.some((i) => i.path[0] === "learnerId") ? console.debug : console.error)("[akademi] event tidak dikirim:", r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "), lengkap);
  const event = valid ? r.data : lengkap;

  const lokal = eventsAnak(event.learnerId);
  lokal.push(event);
  simpanAnak(event.learnerId, lokal);

  if (valid) {
    pemilik.set(event.id, event.learnerId);
    tulisAntrean([...bacaAntrean(), event.id]);
    jadwalkanKirim();
  }
  umumkan([event.learnerId]);
  return event;
}

type Baris = {
  id: string;
  member_id: string;
  session_id: string;
  activity_id: string;
  mechanic: string;
  type: string;
  payload: Json;
  client_at: string;
};

function dariBaris(r: Baris): GameEvent {
  return {
    id: r.id,
    learnerId: r.member_id,
    sessionId: r.session_id,
    activityId: r.activity_id,
    mechanic: r.mechanic,
    type: r.type as GameEvent["type"],
    payload: (r.payload && typeof r.payload === "object" && !Array.isArray(r.payload) ? r.payload : {}) as Record<string, unknown>,
    clientAt: new Date(r.client_at).toISOString(),
  };
}

/**
 * Tarik semua event rumah dari server (maks 5000 terakhir), gabung dengan cache lokal tiap anak (dedupe id),
 * simpan, lalu umumkan `rumila:akademi`. Dipanggil loadFamily setelah pullSaves.
 */
export async function tarikEvents(familyId: string, memberIds: string[]): Promise<void> {
  if (!adaWindow()) return;
  const { data, error } = await supabase()
    .from("learner_event")
    .select("*")
    .eq("family_id", familyId)
    .order("client_at", { ascending: false })
    .limit(5000);
  if (error) throw error;
  const server = (data ?? []).reverse().map((r) => dariBaris(r as Baris));

  const perAnak = new Map<string, GameEvent[]>();
  for (const m of memberIds) perAnak.set(m, []);
  for (const e of server) (perAnak.get(e.learnerId) ?? perAnak.set(e.learnerId, []).get(e.learnerId)!).push(e);

  const tersentuh: string[] = [];
  for (const [m, dariServer] of perAnak) {
    const gabung = new Map<string, GameEvent>();
    for (const e of eventsAnak(m)) gabung.set(e.id, e);
    for (const e of dariServer) gabung.set(e.id, e);
    if (!gabung.size && !dariServer.length) continue;
    simpanAnak(m, [...gabung.values()]);
    tersentuh.push(m);
  }

  // yang sudah ada di server tidak perlu dikirim lagi; sisanya dicoba kirim
  const diServer = new Set(server.map((e) => e.id));
  const antrean = bacaAntrean();
  const sisa = antrean.filter((id) => !diServer.has(id));
  if (sisa.length !== antrean.length) tulisAntrean(sisa);
  if (sisa.length) jadwalkanKirim();

  window.dispatchEvent(new CustomEvent(EVENT_NAMA, { detail: memberIds }));
  umumkan(memberIds);
}
