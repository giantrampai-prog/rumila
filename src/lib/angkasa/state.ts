"use client";

// State UI Jelajah Angkasa 3D (terpisah dari data ilmiah & state simulasi).
// Preferensi & objek terakhir disimpan per anggota (localStorage berkunci memberId); materi selesai
// dicatat ke activity_log Rumila (tersinkron Supabase) lewat store utama.

import { create } from "zustand";
import type { LessonDef } from "./types";

export type Mode =
  | "tata-surya"
  | "planet"
  | "bandingkan"
  | "struktur"
  | "fenomena"
  | "galaksi"
  | "latihan"
  | "tur";
export type LessonId = LessonDef["id"];
export type SheetSize = "ringkas" | "setengah" | "penuh";

export interface LessonState {
  /** rotasi–revolusi */
  orbitOn: boolean;
  spinOn: boolean;
  /** sudut orbit Bulan (derajat, 0 = bulan baru: Bulan di antara Matahari dan Bumi) */
  moonAngle: number;
  /** gerhana: preset & sudut */
  eclipsePreset: "matahari" | "bulan" | "tanpa";
  /** musim: posisi Bumi di orbit (derajat) */
  earthOrbitAngle: number;
  /** siang-malam: sudut rotasi Bumi (derajat) */
  earthSpin: number;
  /** tampilan fase: dari luar angkasa atau dari Bumi */
  phaseView: "angkasa" | "bumi";
}

export const LESSON_DEFAULT: LessonState = {
  orbitOn: true,
  spinOn: true,
  moonAngle: 0,
  eclipsePreset: "matahari",
  earthOrbitAngle: 0,
  earthSpin: 0,
  phaseView: "angkasa",
};

export interface Prefs {
  reducedMotion: boolean;
  /** putar suara edukasi rekaman otomatis saat objek dibuka */
  autoVoice: boolean;
  labels: boolean;
}

interface Snapshot {
  mode: Mode;
  selectedId: string | null;
  partId: string | null;
}

export interface AngkasaState {
  memberId: string;
  mode: Mode;
  /** objek terpilih (id objek) */
  selectedId: string | null;
  /** bagian terpilih (earth.mantle, saturn.rings, …) */
  partId: string | null;
  history: Snapshot[];

  compareIds: string[];
  compareKind: "ukuran" | "jarak";
  distScale: "linear" | "log";

  lesson: LessonId;
  lessonState: LessonState;
  /** versi reset: view membaca ini untuk kembali ke keadaan awal yang dikenal */
  resetNonce: number;

  structureObj: "earth" | "saturn";
  /** pemisahan lapisan 0–100 (absolut) */
  explode: number;
  cutaway: boolean;
  isolated: string | null;
  ringInset: boolean;
  venusView: "awan" | "radar";

  /** mirror jam simulasi */
  playing: boolean;
  speed: number;
  orbitOn: boolean;
  spinOn: boolean;
  showOrbits: boolean;

  sheet: SheetSize;
  drawerOpen: boolean;
  prefs: Prefs;
  engineStatus: "loading" | "ok" | "no-webgl" | "context-lost";
  assetErrors: string[];
  /** permintaan fokus ulang (kembali ke framing) */
  refocusNonce: number;
  quizIndex: number;
  /** Tur terbang: persinggahan aktif, jalan/jeda, kalimat yang tampil, narasi suara (opt-in) */
  tourIndex: number;
  tourPlaying: boolean;
  tourLine: number;
  tourNarration: boolean;
  /** Tur sinematik (tampilan anak): tanpa teks & label, objek dibingkai di tengah layar */
  tourCinematic: boolean;
  /** lebar (px) viewer yang tertutup panel mengambang kiri/kanan (layar penuh) */
  frameInset: [number, number];
  startTour: (from?: number) => void;

  init: (memberId: string) => void;
  select: (
    id: string | null,
    opts?: { mode?: Mode; part?: string | null; push?: boolean },
  ) => void;
  selectPart: (partId: string | null) => void;
  setMode: (m: Mode) => void;
  back: () => void;
  set: (patch: Partial<AngkasaState>) => void;
  setLesson: (l: LessonId) => void;
  patchLesson: (p: Partial<LessonState>) => void;
  resetLesson: () => void;
  toggleCompare: (id: string) => void;
  setPrefs: (p: Partial<Prefs>) => void;
}

const PREF_KEY = (m: string) => `rumila-angkasa:${m}`;

function loadMember(memberId: string): {
  lastObject: string | null;
  prefs: Prefs;
} {
  const def = {
    lastObject: null,
    prefs: { reducedMotion: false, autoVoice: true, labels: true },
  };
  try {
    const raw = localStorage.getItem(PREF_KEY(memberId));
    if (!raw) {
      const rm =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
        false;
      return { ...def, prefs: { ...def.prefs, reducedMotion: rm } };
    }
    const v = JSON.parse(raw);
    return {
      lastObject: v.lastObject ?? null,
      prefs: { ...def.prefs, ...v.prefs },
    };
  } catch {
    return def;
  }
}

function saveMember(s: AngkasaState) {
  if (!s.memberId) return;
  try {
    localStorage.setItem(
      PREF_KEY(s.memberId),
      JSON.stringify({ lastObject: s.selectedId, prefs: s.prefs }),
    );
  } catch {
    /* penyimpanan penuh/diblokir: abaikan */
  }
}

export const useAngkasa = create<AngkasaState>()((set, get) => ({
  memberId: "",
  mode: "tata-surya",
  selectedId: null,
  partId: null,
  history: [],
  compareIds: ["earth", "saturn"],
  compareKind: "ukuran",
  distScale: "linear",
  lesson: "rotation-revolution",
  lessonState: LESSON_DEFAULT,
  resetNonce: 0,
  structureObj: "earth",
  explode: 0,
  cutaway: true,
  isolated: null,
  ringInset: false,
  venusView: "awan",
  playing: false,
  speed: 5,
  orbitOn: true,
  spinOn: true,
  showOrbits: true,
  sheet: "setengah",
  drawerOpen: false,
  prefs: { reducedMotion: false, autoVoice: true, labels: true },
  engineStatus: "loading",
  assetErrors: [],
  refocusNonce: 0,
  quizIndex: 0,
  tourIndex: 0,
  tourPlaying: false,
  tourLine: 0,
  tourNarration: true,
  tourCinematic: false,
  frameInset: [0, 0],
  startTour: (from = 0) => {
    const s = get();
    if (s.mode !== "tur")
      set({
        history: [
          ...s.history,
          { mode: s.mode, selectedId: s.selectedId, partId: s.partId },
        ].slice(-20),
      });
    set({
      mode: "tur",
      tourIndex: from,
      tourLine: 0,
      tourPlaying: true,
      drawerOpen: false,
      selectedId: null,
      partId: null,
    });
  },

  init: (memberId) => {
    const { lastObject, prefs } = loadMember(memberId);
    // Data belajar tidak tercampur antar profil: reset seluruh state saat profil berganti.
    set({
      memberId,
      prefs,
      mode: "tata-surya",
      selectedId: null,
      partId: null,
      history: [],
      explode: 0,
      isolated: null,
      ringInset: false,
      lessonState: LESSON_DEFAULT,
      playing: false,
      quizIndex: 0,
      // objek terakhir disarankan di UI ("Lanjutkan ke …"), tidak langsung dibuka
      assetErrors: [],
      ...(lastObject ? { lastObject } : {}),
    } as Partial<AngkasaState>);
  },

  select: (id, opts = {}) => {
    const s = get();
    const push = opts.push ?? true;
    const nextMode =
      opts.mode ??
      (id ? (s.mode === "tata-surya" ? "planet" : s.mode) : "tata-surya");
    if (push && (s.selectedId !== id || s.mode !== nextMode)) {
      set({
        history: [
          ...s.history,
          { mode: s.mode, selectedId: s.selectedId, partId: s.partId },
        ].slice(-20),
      });
    }
    set({
      selectedId: id,
      partId: opts.part ?? null,
      mode: nextMode,
      drawerOpen: false,
      ringInset: false,
      isolated: null,
    });
    if (id && typeof window !== "undefined" && window.innerWidth < 880)
      set({ sheet: "setengah" });
    saveMember(get());
  },

  selectPart: (partId) => set({ partId }),

  setMode: (m) => {
    const s = get();
    if (s.mode === m) return;
    if (m === "tur") return s.startTour(0);
    set({
      history: [
        ...s.history,
        { mode: s.mode, selectedId: s.selectedId, partId: s.partId },
      ].slice(-20),
      mode: m,
      drawerOpen: false,
    });
  },

  back: () => {
    const s = get();
    const prev = s.history[s.history.length - 1];
    if (!prev)
      return set({ mode: "tata-surya", selectedId: null, partId: null });
    set({
      history: s.history.slice(0, -1),
      mode: prev.mode,
      selectedId: prev.selectedId,
      partId: prev.partId,
      refocusNonce: s.refocusNonce + 1,
    });
  },

  set: (patch) => {
    set(patch);
    if ("prefs" in patch) saveMember(get());
  },

  setLesson: (l) =>
    set({
      lesson: l,
      lessonState: LESSON_DEFAULT,
      resetNonce: get().resetNonce + 1,
      playing: false,
    }),
  patchLesson: (p) => set({ lessonState: { ...get().lessonState, ...p } }),
  resetLesson: () =>
    set({
      lessonState: LESSON_DEFAULT,
      resetNonce: get().resetNonce + 1,
      playing: false,
    }),

  toggleCompare: (id) => {
    const cur = get().compareIds;
    if (cur.includes(id)) {
      if (cur.length > 2) set({ compareIds: cur.filter((x) => x !== id) });
    } else if (cur.length < 4) set({ compareIds: [...cur, id] });
  },

  setPrefs: (p) => {
    set({ prefs: { ...get().prefs, ...p } });
    saveMember(get());
  },
}));

export function lastObjectOf(memberId: string) {
  return loadMember(memberId).lastObject;
}
