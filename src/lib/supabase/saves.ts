"use client";

// Sinkron progres game antarperangkat (tabel game_save).
// Game tetap menyimpan ke localStorage seperti biasa; lapisan ini:
// - saat rumah dimuat (sebelum halaman game tampil): tarik simpanan dari server & tulis ke localStorage,
//   lalu kirim simpanan lokal yang lebih baru / belum ada di server;
// - setiap game menulis kunci yang disinkron: kirim ke server (ditunda sebentar, digabung per kunci).
// Kunci yang disinkron hanya progres per anggota (id anggota di server berupa UUID) + progres milik rumah.
// Preferensi perangkat (suara mati, banner pasang, intro) tidak ikut.

import { supabase } from "./client";

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const MEMBER_KEYS = [
  new RegExp(`^rumila-(?:koding|ular|resto|kebun|kebun-main)-(${UUID})$`, "i"),
  new RegExp(`^rumila-angkasa:(${UUID})$`, "i"),
];
const FAMILY_KEYS = [/^rumila-bumi-fosil$/];
const META = "rumila-sync-meta";

/** anggota pemilik kunci (null = milik rumah); undefined = kunci tidak disinkron */
export function savedKeyOwner(key: string): string | null | undefined {
  for (const re of MEMBER_KEYS) {
    const m = re.exec(key);
    if (m) return m[1].toLowerCase();
  }
  if (FAMILY_KEYS.some((re) => re.test(key))) return null;
  return undefined;
}

let familyId: string | null = null;
let rawSet: ((k: string, v: string) => void) | null = null;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function readMeta(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(META) ?? "{}");
  } catch {
    return {};
  }
}
function writeMeta(m: Record<string, number>) {
  try {
    (rawSet ?? localStorage.setItem.bind(localStorage))(META, JSON.stringify(m));
  } catch {}
}
const parse = (v: string) => {
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

async function upload(key: string) {
  const fid = familyId;
  const raw = localStorage.getItem(key);
  if (!fid || raw == null) return;
  const owner = savedKeyOwner(key);
  if (owner === undefined) return;
  const at = readMeta()[key] ?? Date.now();
  const { error } = await supabase()
    .from("game_save")
    .upsert({ family_id: fid, key, member_id: owner, data: parse(raw), updated_at: new Date(at).toISOString() }, { onConflict: "family_id,key" });
  if (error) console.error("[rumila] simpan progres gagal", key, error);
}

/*
 * Beberapa game menyimpan hampir tiap detik (mis. kebun). Kiriman ke server dibatasi: simpanan pertama
 * terkirim ±2 dtk kemudian, berikutnya paling sering tiap 20 dtk per game (selalu isi terbaru), dan
 * semuanya langsung terkirim saat aplikasi ditutup / ke latar.
 */
const MIN_GAP = 20000;
const lastSent = new Map<string, number>();
function schedule(key: string) {
  if (timers.has(key)) return; // kiriman sudah dijadwalkan; saat itu isi terbaru yang dikirim
  const wait = Math.max(2000, MIN_GAP - (Date.now() - (lastSent.get(key) ?? 0)));
  timers.set(
    key,
    setTimeout(() => {
      timers.delete(key);
      lastSent.set(key, Date.now());
      void upload(key);
    }, wait),
  );
}

/** Pasang sekali: tulisan game ke kunci yang disinkron ikut dikirim ke server. */
export function installSaveSync() {
  if (rawSet || typeof window === "undefined") return;
  const orig = Storage.prototype.setItem;
  rawSet = (k, v) => orig.call(window.localStorage, k, v);
  Storage.prototype.setItem = function (this: Storage, k: string, v: string) {
    orig.call(this, k, v);
    if (this !== window.localStorage || savedKeyOwner(k) === undefined) return;
    const m = readMeta();
    m[k] = Date.now();
    writeMeta(m);
    if (familyId) schedule(k);
  };
  // kirim yang masih tertunda sebelum halaman ditutup / aplikasi ke latar
  const flush = () => {
    for (const [k, t] of timers) {
      clearTimeout(t);
      timers.delete(k);
      lastSent.set(k, Date.now());
      void upload(k);
    }
  };
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
  window.addEventListener("pagehide", flush);
}

/**
 * Tarik simpanan rumah dari server ke perangkat ini (dipanggil saat rumah dimuat, sebelum halaman tampil),
 * lalu kirim simpanan lokal yang lebih baru. Mengembalikan kunci yang berubah di perangkat ini.
 */
export async function pullSaves(fid: string, memberIds: Set<string>): Promise<string[]> {
  installSaveSync();
  familyId = fid;
  const { data, error } = await supabase().from("game_save").select("key, data, updated_at").eq("family_id", fid);
  if (error) throw error;
  const meta = readMeta();
  const changed: string[] = [];
  const push: string[] = [];
  const onServer = new Set<string>();
  for (const row of data ?? []) {
    onServer.add(row.key);
    const server = typeof row.data === "string" ? row.data : JSON.stringify(row.data);
    const st = Date.parse(row.updated_at);
    const local = localStorage.getItem(row.key);
    const lm = meta[row.key];
    let take = false;
    if (local == null) take = true;
    else if (local === server) meta[row.key] = st;
    else if (lm == null) {
      // simpanan lama di perangkat (sebelum ada sinkron): ambil yang isinya lebih banyak
      if (server.length >= local.length) take = true;
      else push.push(row.key);
    } else if (st > lm) take = true;
    else if (lm > st + 1000) push.push(row.key);
    if (take) {
      rawSet!(row.key, server);
      meta[row.key] = st;
      changed.push(row.key);
    }
  }
  // simpanan lokal yang belum ada di server (anggota rumah ini saja)
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    if (onServer.has(k)) continue;
    const owner = savedKeyOwner(k);
    if (owner === undefined || (owner !== null && !memberIds.has(owner))) continue;
    push.push(k);
  }
  writeMeta(meta);
  for (const k of push) void upload(k);
  if (changed.length) window.dispatchEvent(new CustomEvent("rumila:saves", { detail: changed }));
  return changed;
}

/** Keluar akun: berhenti mengirim. */
export function stopSaveSync() {
  familyId = null;
}
