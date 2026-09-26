import { describe, expect, it } from "vitest";
import { PART } from "../manifest";
import {
  CONTEXT_PARTS,
  CRUST_MIN_FRAC,
  EXPLODE_DIR,
  LAYERS,
  crustExaggeration,
  explodeDistances,
  explodeOffset,
  labelAnchor,
  layerColorAt,
  partPosition,
  ringFracs,
  structureOf,
  visualShells,
  type StructureObj,
  type Vec3,
} from "../structure";

const OBJS: StructureObj[] = ["earth", "saturn"];
const ALL = OBJS.flatMap((o) => [...LAYERS[o], ...CONTEXT_PARTS[o]]);
const len = (v: Vec3) => Math.hypot(v[0], v[1], v[2]);

describe("struktur: data bagian", () => {
  it("setiap partId punya PART dengan objek yang cocok", () => {
    for (const o of OBJS)
      for (const id of [...LAYERS[o], ...CONTEXT_PARTS[o]]) {
        const p = PART.get(id);
        expect(p, id).toBeDefined();
        expect(p!.objectId).toBe(o);
        expect(structureOf(id)).toBe(o);
      }
  });
  it("lapisan punya warna kode pendidikan & radius", () => {
    for (const o of OBJS)
      for (const id of LAYERS[o]) {
        const p = PART.get(id)!;
        expect(p.color).toMatch(/^#[0-9a-f]{6}$/i);
        expect(p.outerFrac).toBeGreaterThan(p.innerFrac!);
      }
  });
  it("Saturnus tidak memakai penamaan kerak/mantel Bumi dan berlabel model", () => {
    for (const id of LAYERS.saturn) {
      expect(id).not.toMatch(/crust|mantle/);
      expect(PART.get(id)!.representation).toBe("model interpretasi");
    }
  });
  it("cangkang visual bersambung dari 1 ke 0 tanpa celah", () => {
    for (const o of OBJS) {
      const s = visualShells(o);
      expect(s[0].outer).toBe(1);
      expect(s[s.length - 1].inner).toBe(0);
      for (let i = 1; i < s.length; i++)
        expect(s[i].outer).toBe(s[i - 1].inner);
    }
  });
  it("kerak diperbesar dan faktornya tercatat", () => {
    const c = visualShells("earth")[0];
    expect(c.outer - c.inner).toBeCloseTo(CRUST_MIN_FRAC, 6);
    expect(crustExaggeration()).toBeGreaterThan(5);
    // lapisan lain memakai radius data
    const oc = visualShells("earth")[2];
    expect(oc.outer).toBe(PART.get("earth.outer_core")!.outerFrac);
  });
  it("warna tersedia untuk setiap radius", () => {
    for (const o of OBJS)
      for (let r = 0; r <= 1; r += 0.05) {
        const c = layerColorAt(o, r);
        for (const x of c) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(1);
        }
      }
  });
  it("radius cincin di luar globe", () => {
    const r = ringFracs();
    expect(r.inner).toBeGreaterThan(1);
    expect(r.outer).toBeGreaterThan(r.inner);
  });
});

describe("struktur: pemisahan absolut", () => {
  it("0% sama persis dengan rest", () => {
    for (const id of ALL) expect(explodeOffset(id, 0)).toEqual([0, 0, 0]);
  });
  it("siklus 0→50→100→0 berulang tanpa drift", () => {
    for (const id of ALL) {
      const rest = partPosition(id, 0, null);
      let last: Vec3 = rest;
      for (let cycle = 0; cycle < 25; cycle++)
        for (const pct of [0, 50, 100, 73.2, 0])
          last = partPosition(id, pct, null);
      expect(last).toEqual(rest);
      expect(partPosition(id, 50, null)).toEqual(explodeOffset(id, 50));
    }
  });
  it("offset monoton terhadap persen & searah jalur terkurasi", () => {
    for (const id of ALL) {
      let prev = -1;
      for (let pct = 0; pct <= 100; pct += 5) {
        const v = explodeOffset(id, pct);
        const l = len(v);
        expect(l).toBeGreaterThanOrEqual(prev - 1e-12);
        prev = l;
        if (l > 0) {
          const dot = Math.abs(
            v[0] * EXPLODE_DIR[0] +
              v[1] * EXPLODE_DIR[1] +
              v[2] * EXPLODE_DIR[2],
          );
          expect(dot / l).toBeCloseTo(1, 9);
        }
      }
    }
  });
  it("nilai di luar rentang dijepit ke 0–100", () => {
    expect(explodeOffset("earth.mantle", -20)).toEqual([0, 0, 0]);
    expect(explodeOffset("earth.mantle", 250)).toEqual(
      explodeOffset("earth.mantle", 100),
    );
    expect(explodeOffset("earth.mantle", NaN)).toEqual([0, 0, 0]);
  });
  it("pada 100% lapisan dalam berada utuh di bukaan lapisan luarnya (tidak menembus)", () => {
    for (const o of OBJS) {
      const s = visualShells(o);
      const d = explodeDistances(o);
      for (let i = 1; i < s.length; i++) {
        const rel = d[s[i].id] - d[s[i - 1].id];
        expect(rel / Math.sqrt(3)).toBeGreaterThanOrEqual(s[i].outer);
      }
    }
  });
  it("bagian terisolasi ditaruh di rest; id asing tidak bergerak", () => {
    expect(partPosition("earth.mantle", 100, "earth.mantle")).toEqual([
      0, 0, 0,
    ]);
    expect(explodeOffset("mars.core", 100)).toEqual([0, 0, 0]);
    expect(explodeOffset("earth.surface", 100)).toEqual([0, 0, 0]);
  });
  it("anchor label berada di dalam lapisannya", () => {
    for (const o of OBJS)
      for (const s of visualShells(o)) {
        const r = len(labelAnchor(s.id));
        expect(r).toBeGreaterThanOrEqual(s.inner);
        expect(r).toBeLessThanOrEqual(s.outer);
      }
  });
});
