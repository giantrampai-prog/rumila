"use client";

// Jembatan store lokal (useRumila) ⇄ Supabase.
// - loadFamily(): isi store dari database setelah akun masuk.
// - Sinkronisasi: setiap perubahan anggota / izin / aktivitas di store ditulis ke database,
//   jadi komponen (termasuk modul lain seperti anatomi) cukup memanggil action store seperti biasa.

import { useEffect } from "react";
import { create } from "zustand";
import type { ColorKey, PermKey } from "@/lib/catalog";
import { useRumila, useUI, type Activity, type Member } from "@/lib/store";
import { friendlyError, supabase } from "./client";

export type CloudStatus = "loading" | "noSession" | "noFamily" | "ready" | "error";

interface CloudState {
  status: CloudStatus;
  familyId: string | null;
  email: string | null;
  error: string | null;
}

export const useCloud = create<CloudState>()(() => ({ status: "loading", familyId: null, email: null, error: null }));

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Penanda "anggota ini pakai PIN" di store (PIN asli hanya ada sebagai hash di server). */
export const PIN_SET = "server";

let paused = false;
let queue: Promise<void> = Promise.resolve();

/** Muat rumah milik akun yang sedang masuk ke store. */
export async function loadFamily(): Promise<CloudStatus> {
  const sb = supabase();
  try {
    const { data: sess } = await sb.auth.getSession();
    const user = sess.session?.user;
    if (!user) {
      useCloud.setState({ status: "noSession", familyId: null, email: null, error: null });
      return "noSession";
    }
    const { data: fu, error: e1 } = await sb.from("family_user").select("family_id").eq("user_id", user.id).limit(1).maybeSingle();
    if (e1) throw e1;
    if (!fu) {
      useCloud.setState({ status: "noFamily", familyId: null, email: user.email ?? null, error: null });
      return "noFamily";
    }
    const fid = fu.family_id;
    const since = new Date(Date.now() - 60 * 86400000).toISOString();
    const [fam, mem, perm, act] = await Promise.all([
      sb.from("family").select("name").eq("id", fid).single(),
      sb
        .from("member")
        .select("id, name, color_key, is_admin, has_pin, sort, created_at")
        .eq("family_id", fid)
        .order("sort")
        .order("created_at"),
      sb.from("member_permission").select("member_id, key"),
      sb
        .from("activity_log")
        .select("id, member_id, tool_id, started_at, duration_sec, event, part_id")
        .eq("family_id", fid)
        .gte("started_at", since)
        .order("started_at")
        .limit(5000),
    ]);
    for (const r of [fam, mem, perm, act]) if (r.error) throw r.error;

    const members: Member[] = (mem.data ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      c: m.color_key as ColorKey,
      admin: m.is_admin,
      perms: (perm.data ?? []).filter((p) => p.member_id === m.id).map((p) => p.key as PermKey),
      pin: m.has_pin ? PIN_SET : undefined,
    }));
    const activity: Activity[] = (act.data ?? []).map((a) => ({
      id: a.id,
      memberId: a.member_id,
      toolId: a.tool_id,
      at: new Date(a.started_at).getTime(),
      durationSec: a.duration_sec,
      event: (a.event ?? undefined) as Activity["event"],
      partId: a.part_id ?? undefined,
    }));

    paused = true;
    const cur = useRumila.getState();
    const meOk = members.some((m) => m.id === cur.meId);
    useRumila.setState({
      familyName: fam.data!.name,
      members,
      activity,
      meId: meOk ? cur.meId : (members.find((m) => m.admin)?.id ?? members[0]?.id ?? ""),
      signedIn: meOk ? cur.signedIn : false,
    });
    paused = false;
    useCloud.setState({ status: "ready", familyId: fid, email: user.email ?? null, error: null });
    return "ready";
  } catch (e) {
    paused = false;
    useCloud.setState({ status: "error", error: friendlyError(e) });
    return "error";
  }
}

/** Buat rumah baru; pembuat jadi Admin. */
export async function createFamily(familyName: string, adminName: string, color: ColorKey, pin: string | null) {
  const { error } = await supabase().rpc("create_family", {
    p_family_name: familyName,
    p_admin_name: adminName,
    p_color: color,
    ...(pin ? { p_pin: pin } : {}),
  });
  if (error) throw new Error(friendlyError(error));
  // Anggota dari data demo lama tidak boleh ikut tersinkron ke rumah baru.
  paused = true;
  useRumila.setState({ members: [], activity: [], signedIn: false });
  paused = false;
  return loadFamily();
}

export async function verifyPin(memberId: string, pin: string): Promise<boolean> {
  const { data, error } = await supabase().rpc("verify_member_pin", { p_member: memberId, p_pin: pin });
  if (error) throw new Error(friendlyError(error));
  return !!data;
}

/** Pasang/ganti PIN (null = hapus PIN). */
export async function setPin(memberId: string, pin: string | null) {
  const { error } = await supabase().rpc("set_member_pin", { p_member: memberId, p_pin: pin });
  if (error) throw new Error(friendlyError(error));
  paused = true;
  useRumila.setState((s) => ({ members: s.members.map((m) => (m.id === memberId ? { ...m, pin: pin ? PIN_SET : undefined } : m)) }));
  paused = false;
}

export async function signOutAccount() {
  await supabase().auth.signOut();
  paused = true;
  useRumila.setState({ members: [], activity: [], signedIn: false, meId: "" });
  paused = false;
  useCloud.setState({ status: "noSession", familyId: null, email: null });
}

/* ---------------- sinkronisasi store → database ---------------- */

function enqueue(job: () => Promise<void>) {
  queue = queue.then(job).catch((e) => {
    console.error("[rumila] sinkron gagal", e);
    useUI.getState().showToast("Perubahan belum tersimpan ke server. Cek koneksi, ya.");
  });
}

const must = <T extends { error: unknown }>(r: T) => {
  if (r.error) throw r.error;
  return r;
};

function syncMembers(next: Member[], prev: Member[], fid: string) {
  const sb = supabase();
  const byId = new Map(prev.map((m) => [m.id, m]));
  const nextIds = new Set(next.map((m) => m.id));

  // 1) peran Admin berpindah → RPC atomik dulu (indeks unik: satu Admin per rumah)
  const newAdmin = next.find((m) => m.admin && byId.get(m.id) && !byId.get(m.id)!.admin);
  if (newAdmin && UUID.test(newAdmin.id)) enqueue(async () => void must(await sb.rpc("make_admin", { p_member: newAdmin.id })));

  next.forEach((m, i) => {
    if (!UUID.test(m.id)) return;
    const old = byId.get(m.id);
    if (!old) {
      enqueue(async () => {
        must(await sb.from("member").insert({ id: m.id, family_id: fid, name: m.name, color_key: m.c, sort: i }));
        if (m.perms.length) must(await sb.from("member_permission").insert(m.perms.map((key) => ({ member_id: m.id, key }))));
      });
      return;
    }
    if (old.name !== m.name || old.c !== m.c) {
      enqueue(async () => void must(await sb.from("member").update({ name: m.name, color_key: m.c }).eq("id", m.id)));
    }
    const add = m.perms.filter((k) => !old.perms.includes(k));
    const del = old.perms.filter((k) => !m.perms.includes(k));
    if (add.length)
      enqueue(
        async () =>
          void must(
            await sb.from("member_permission").upsert(
              add.map((key) => ({ member_id: m.id, key })),
              { ignoreDuplicates: true },
            ),
          ),
      );
    if (del.length) enqueue(async () => void must(await sb.from("member_permission").delete().eq("member_id", m.id).in("key", del)));
  });

  prev.forEach((m) => {
    if (!nextIds.has(m.id) && UUID.test(m.id)) enqueue(async () => void must(await sb.from("member").delete().eq("id", m.id)));
  });
}

function syncActivity(next: Activity[], prev: Activity[], fid: string) {
  if (next === prev) return;
  const sb = supabase();
  const byId = new Map(prev.map((a) => [a.id, a]));
  const inserts = next.filter((a) => !byId.has(a.id) && UUID.test(a.id) && UUID.test(a.memberId));
  if (inserts.length)
    enqueue(async () => {
      must(
        await sb.from("activity_log").insert(
          inserts.map((a) => ({
            id: a.id,
            family_id: fid,
            member_id: a.memberId,
            tool_id: a.toolId,
            started_at: new Date(a.at).toISOString(),
            duration_sec: Math.max(0, Math.round(a.durationSec)),
            event: a.event ?? null,
            part_id: a.partId ?? null,
          })),
        ),
      );
    });
  for (const a of next) {
    const old = byId.get(a.id);
    if (old && old.durationSec !== a.durationSec && UUID.test(a.id)) {
      enqueue(
        async () =>
          void must(
            await sb
              .from("activity_log")
              .update({ duration_sec: Math.max(0, Math.round(a.durationSec)) })
              .eq("id", a.id),
          ),
      );
    }
  }
}

let started = false;

/** Pasang sekali: muat data + dengarkan perubahan akun & store. */
export function useCloudBoot() {
  useEffect(() => {
    if (started) return;
    started = true;
    // Urutan penting: pulihkan cache lokal dulu, baru timpa dengan data server
    // (kalau terbalik, cache lama bisa menimpa data asli lalu ikut tersinkron).
    (async () => {
      if (!useRumila.persist.hasHydrated()) await useRumila.persist.rehydrate();
      await loadFamily();
    })();
    const { data: sub } = supabase().auth.onAuthStateChange((event) => {
      if ((event === "SIGNED_IN" || event === "SIGNED_OUT") && useRumila.persist.hasHydrated()) loadFamily();
    });
    const unsub = useRumila.subscribe((s, p) => {
      const { status, familyId } = useCloud.getState();
      if (paused || status !== "ready" || !familyId) return;
      if (s.members !== p.members) syncMembers(s.members, p.members, familyId);
      if (s.activity !== p.activity) syncActivity(s.activity, p.activity, familyId);
    });
    return () => {
      started = false;
      sub.subscription.unsubscribe();
      unsub();
    };
  }, []);
  return useCloud();
}
