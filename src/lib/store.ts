"use client";

import { create } from "zustand";
import { useEffect, useState } from "react";
import { persist } from "zustand/middleware";
import { uuid } from "./uuid";
import { ALL_PERMS, ALL_TOOLS, KID_PRESET, type ColorKey, type PermKey } from "./catalog";

// Data lokal (fase 1). Bentuknya mengikuti usulan tabel di README:
// member(id, name, color_key, is_admin) · member_permission(member_id, key) · activity_log(...)
// Saat pindah ke Supabase, ganti isi action di sini dengan panggilan API.

export interface Member {
  id: string;
  name: string;
  c: ColorKey;
  admin: boolean;
  perms: PermKey[];
  /** PIN 4 angka (demo, disimpan polos). Fase Supabase: simpan pin_hash, verifikasi di server. */
  pin?: string;
}

export type Theme = "playful" | "modern";

export interface Activity {
  id: string;
  memberId: string;
  toolId: string;
  at: number; // epoch ms
  durationSec: number;
  event?: "session" | "material_complete" | "exercise_complete";
  partId?: string;
}

const SEED_MEMBERS: Member[] = [
  { id: "m1", name: "Ayah", c: "indigo", admin: true, perms: ALL_PERMS, pin: "1234" },
  { id: "m2", name: "Ibu", c: "orange", admin: false, perms: ALL_PERMS, pin: "1234" },
  { id: "m3", name: "Kak Raka", c: "teal", admin: false, perms: KID_PRESET },
  { id: "m4", name: "Dek Nara", c: "gold", admin: false, perms: ["game", "doa", "edukasi", "angkasa"] },
  { id: "m5", name: "Nenek", c: "pink", admin: false, perms: ["doa", "ibadah", "keluarga", "kesehatan"] },
];

// Pola pemakaian demo per anggota: toolId → jumlah buka minggu ini
const SEED_USAGE: Record<string, Record<string, number>> = {
  m1: { keuangan0: 14, ibadah0: 11, ibadah1: 10, keuangan3: 9, keluarga0: 8, game1: 6 },
  m2: { keluarga3: 12, keuangan0: 10, doa7: 8, kesehatan0: 7, keluarga0: 5, keluarga2: 4 },
  m3: { coding0: 22, angkasa0: 14, ibadah1: 12, edukasi0: 9, coding1: 7, game1: 5 },
  m4: { game0: 12, edukasi3: 11, doa1: 10, game6: 8, doa9: 6, edukasi4: 5 },
  m5: { ibadah0: 13, doa0: 8, ibadah3: 6, kesehatan1: 5, keluarga2: 3 },
};

function seedActivity(): Activity[] {
  const now = Date.now();
  const out: Activity[] = [];
  let n = 0;
  for (const [memberId, tools] of Object.entries(SEED_USAGE)) {
    for (const [toolId, count] of Object.entries(tools)) {
      for (let i = 0; i < count; i++) {
        n++;
        const daysAgo = n % 7; // sebar merata ke 7 hari terakhir
        out.push({
          id: `a${n}`,
          memberId,
          toolId,
          at: now - daysAgo * 86400000 - ((n * 37) % 600) * 60000,
          durationSec: 300 + ((n * 131) % 900),
        });
      }
    }
  }
  return out;
}

interface State {
  familyName: string;
  members: Member[];
  meId: string;
  signedIn: boolean;
  theme: Theme;
  activity: Activity[];
  setTheme: (t: Theme) => void;
  signIn: (id: string) => void;
  signOut: () => void;
  switchMember: (id: string) => void;
  addMember: (name: string, c: ColorKey) => string;
  togglePerm: (id: string, key: PermKey) => void;
  setPerms: (id: string, perms: PermKey[]) => void;
  makeAdmin: (id: string) => void;
  removeMember: (id: string) => void;
  logOpen: (toolId: string) => void;
  beginAnatomySession: (memberId: string) => string | null;
  addAnatomyTime: (memberId: string, sessionId: string, seconds: number) => void;
  completeAnatomy: (memberId: string, partId: string, exercise?: boolean) => void;
  /** Sesi belajar umum untuk modul alat (waktu aktif + materi/latihan selesai), per anggota. */
  beginToolSession: (memberId: string, toolId: string, perm: PermKey) => string | null;
  addToolTime: (memberId: string, sessionId: string, toolId: string, seconds: number) => void;
  completeToolItem: (memberId: string, toolId: string, perm: PermKey, itemId: string, exercise?: boolean) => void;
  resetDemo: () => void;
}

const initial = () => ({
  familyName: "Pratama",
  members: SEED_MEMBERS,
  meId: "m1",
  signedIn: false,
  theme: "playful" as Theme,
  activity: seedActivity(),
});

export const useRumila = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),
      setTheme: (theme) => set({ theme }),
      signIn: (id) => set({ meId: id, signedIn: true }),
      signOut: () => set({ signedIn: false }),
      switchMember: (id) => set({ meId: id }),
      addMember: (name, c) => {
        const id = uuid(); // UUID: sama dengan id baris di Supabase
        set((s) => ({ members: [...s.members, { id, name, c, admin: false, perms: KID_PRESET }] }));
        return id;
      },
      togglePerm: (id, key) =>
        set((s) => ({
          members: s.members.map((m) =>
            m.id === id ? { ...m, perms: m.perms.includes(key) ? m.perms.filter((p) => p !== key) : [...m.perms, key] } : m,
          ),
        })),
      setPerms: (id, perms) => set((s) => ({ members: s.members.map((m) => (m.id === id ? { ...m, perms } : m)) })),
      // Tepat satu Admin per rumah: admin lama otomatis jadi User (tetap akses penuh via perms).
      makeAdmin: (id) =>
        set((s) => ({
          members: s.members.map((m) => (m.admin && m.id !== id ? { ...m, admin: false, perms: ALL_PERMS } : { ...m, admin: m.id === id })),
        })),
      removeMember: (id) =>
        set((s) => {
          const target = s.members.find((m) => m.id === id);
          if (!target || target.admin) return s;
          return {
            members: s.members.filter((m) => m.id !== id),
            activity: s.activity.filter((a) => a.memberId !== id),
            meId: s.meId === id ? s.members.find((m) => m.admin)!.id : s.meId,
          };
        }),
      logOpen: (toolId) => {
        if (!ALL_TOOLS.some((t) => t.id === toolId)) return;
        const a: Activity = { id: uuid(), memberId: get().meId, toolId, at: Date.now(), durationSec: 0 };
        set((s) => ({ activity: [...s.activity, a] }));
      },
      beginAnatomySession: (memberId) => {
        const s = get(), member = s.members.find(m => m.id === memberId);
        if (!s.signedIn || s.meId !== memberId || !can(member, "edukasi")) return null;
        const id = uuid();
        set(s => ({ activity: [...s.activity, { id, memberId, toolId: "edukasi6", at: Date.now(), durationSec: 0, event: "session" }] }));
        return id;
      },
      addAnatomyTime: (memberId, sessionId, seconds) => {
        const s = get();
        if (!s.members.some(m => m.id === memberId) || !Number.isFinite(seconds) || seconds <= 0) return;
        set(s => ({ activity: s.activity.map(a => a.id === sessionId && a.memberId === memberId && a.toolId === "edukasi6" ? { ...a, durationSec: a.durationSec + Math.min(seconds, 60) } : a) }));
      },
      completeAnatomy: (memberId, partId, exercise = false) => {
        const s = get(), member = s.members.find(m => m.id === memberId);
        if (!s.signedIn || s.meId !== memberId || !can(member, "edukasi")) return;
        const event = exercise ? "exercise_complete" as const : "material_complete" as const;
        if (s.activity.some(a => a.memberId === memberId && a.toolId === "edukasi6" && a.event === event && a.partId === partId)) return;
        set(s => ({ activity: [...s.activity, { id: uuid(), memberId, toolId: "edukasi6", at: Date.now(), durationSec: 0, event, partId }] }));
      },
      beginToolSession: (memberId, toolId, perm) => {
        const s = get(),
          member = s.members.find((m) => m.id === memberId);
        if (!s.signedIn || s.meId !== memberId || !can(member, perm)) return null;
        const id = uuid();
        set((st) => ({ activity: [...st.activity, { id, memberId, toolId, at: Date.now(), durationSec: 0, event: "session" }] }));
        return id;
      },
      addToolTime: (memberId, sessionId, toolId, seconds) => {
        if (!Number.isFinite(seconds) || seconds <= 0) return;
        set((st) => ({
          activity: st.activity.map((a) =>
            a.id === sessionId && a.memberId === memberId && a.toolId === toolId ? { ...a, durationSec: a.durationSec + Math.min(seconds, 60) } : a,
          ),
        }));
      },
      completeToolItem: (memberId, toolId, perm, itemId, exercise = false) => {
        const s = get(),
          member = s.members.find((m) => m.id === memberId);
        if (!s.signedIn || s.meId !== memberId || !can(member, perm)) return;
        const event = exercise ? ("exercise_complete" as const) : ("material_complete" as const);
        if (s.activity.some((a) => a.memberId === memberId && a.toolId === toolId && a.event === event && a.partId === itemId)) return;
        set((st) => ({
          activity: [...st.activity, { id: uuid(), memberId, toolId, at: Date.now(), durationSec: 0, event, partId: itemId }],
        }));
      },
      resetDemo: () => set({ ...initial(), signedIn: get().signedIn, theme: get().theme, meId: "m1" }),
    }),
    { name: "rumila-v3", skipHydration: true },
  ),
);

/** Muat data tersimpan sekali di klien; render baru setelah siap agar tidak kedip / mismatch SSR. */
export function useHydrated() {
  // Mulai false di server & render pertama klien; cek penyimpanan hanya di effect (klien).
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (useRumila.persist.hasHydrated()) return setReady(true);
    const unsub = useRumila.persist.onFinishHydration(() => setReady(true));
    useRumila.persist.rehydrate();
    return unsub;
  }, []);
  return ready;
}

/** true bila layar ≥880px (breakpoint `desk`) — versi website pakai tampilan launcher. */
export function useIsDesktop() {
  const [desk, setDesk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 55rem)");
    const on = () => setDesk(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desk;
}

export const can = (m: Member | undefined, key: PermKey) => !!m && (m.admin || m.perms.includes(key));

export function useMe() {
  return useRumila((s) => s.members.find((m) => m.id === s.meId) ?? s.members[0]);
}

// ---------- UI (tidak dipersist) ----------

export type SheetState =
  { kind: "members" } | { kind: "add" } | { kind: "edit"; memberId: string } | { kind: "app"; toolId: string } | null;

interface UIState {
  sheet: SheetState;
  toast: string;
  /** kata kunci pencarian launcher (dipakai di Beranda & halaman folder) */
  query: string;
  setQuery: (q: string) => void;
  openSheet: (s: SheetState) => void;
  closeSheet: () => void;
  showToast: (t: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useUI = create<UIState>()((set) => ({
  sheet: null,
  toast: "",
  query: "",
  setQuery: (query) => set({ query }),
  openSheet: (sheet) => set({ sheet }),
  closeSheet: () => set({ sheet: null }),
  showToast: (toast) => {
    clearTimeout(toastTimer);
    set({ toast });
    toastTimer = setTimeout(() => set({ toast: "" }), 2200);
  },
}));
