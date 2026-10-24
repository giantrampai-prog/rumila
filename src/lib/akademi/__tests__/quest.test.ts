import { beforeEach, describe, expect, it, vi } from "vitest";

const catat = vi.fn();
vi.mock("@/lib/akademi/jejak", () => ({ catatEvent: (e: unknown) => catat(e) }));

const aktivitas: unknown[] = [];
vi.mock("@/lib/store", () => ({ useRumila: { getState: () => ({ activity: aktivitas }), subscribe: () => () => {} } }));

const store = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) },
  configurable: true,
});
Object.defineProperty(globalThis, "window", { value: globalThis, configurable: true });

import { prosesAktivitas } from "../quest";

const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const akt = (over: Record<string, unknown>) => ({ id: uuid(Math.floor(Math.random() * 1e9)), memberId: uuid(1), toolId: "edukasi6", at: Date.now(), durationSec: 0, event: "material_complete" as const, partId: "heart", ...over });

describe("quest dunia 3D → bukti", () => {
  beforeEach(() => { catat.mockClear(); store.clear(); aktivitas.length = 0; });

  it("organ yang dipelajari di Jelajah Tubuh jadi bukti TULANG-OTOT-ORGAN.01", () => {
    const a = akt({ partId: "lung_r" });
    aktivitas.push(a);
    expect(prosesAktivitas(a as never, uuid(9))).toBe(1);
    const e = catat.mock.calls[0][0];
    expect(e.payload.competencyIds).toEqual(["SAINS.TKB.TULANG-OTOT-ORGAN.01"]);
    expect(e.payload.imported).toBe(false);
    expect(e.mechanic).toBe("cari");
  });

  it("item di luar peta (kulit) tidak jadi bukti; aktivitas yang sama tidak diproses dua kali", () => {
    const a = akt({ partId: "skin" });
    aktivitas.push(a);
    expect(prosesAktivitas(a as never, uuid(9))).toBe(0);
    const b = akt({ partId: "heart" });
    aktivitas.push(b);
    expect(prosesAktivitas(b as never, uuid(9))).toBe(1);
    expect(prosesAktivitas(b as never, uuid(9))).toBe(0);
  });

  it("Kebun Buah: bukti tiap 3 buah berbeda", () => {
    const ids = ["pisang", "mangga", "jeruk", "apel"];
    const hasil = ids.map((partId) => { const a = akt({ toolId: "edukasi-buah", partId }); aktivitas.push(a); return prosesAktivitas(a as never, uuid(9)); });
    expect(hasil).toEqual([0, 0, 1, 0]);
  });

  it("aktivitas lama (dari server) ditandai imported", () => {
    const a = akt({ toolId: "angkasa6", partId: "obj:earth", at: Date.now() - 3600_000 });
    aktivitas.push(a);
    prosesAktivitas(a as never, uuid(9));
    expect(catat.mock.calls[0][0].payload.imported).toBe(true);
  });
});
