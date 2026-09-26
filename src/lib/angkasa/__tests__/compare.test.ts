import { describe, expect, it } from "vitest";
import {
  buildGalaxyPoints,
  GALAXY,
  solarLocation,
} from "@/components/angkasa/engine/galaxyView";
import {
  AU_KM,
  COMPARE_IDS,
  asReference,
  axisPositions,
  axisTicks,
  distRows,
  distScaleLabel,
  fmtRatio,
  meanDistanceAU,
  ratioSentence,
  sizeLayout,
  sizeRows,
  toggleId,
} from "../compare";
import { OBJ } from "../manifest";
import { distanceMap } from "../sim";
import { useAngkasa } from "../state";

describe("bandingkan ukuran", () => {
  it("rasio diameter dihitung dari data radius rata-rata", () => {
    const rows = sizeRows(["earth", "saturn", "moon"]);
    const e = OBJ.get("earth")!.radius.value!;
    const s = OBJ.get("saturn")!.radius.value!;
    expect(rows[0].ratio).toBe(1);
    expect(rows[1].ratio).toBeCloseTo(s / e, 10);
    expect(rows[1].diameterKm).toBe(2 * s);
    expect(ratioSentence(rows[1], rows[0].name)).toBe(
      "Saturnus ≈ 9,1 × diameter Bumi",
    );
    expect(fmtRatio(695700 / 6371)).toBe("109");
    expect(fmtRatio(1737.4 / 6371)).toBe("0,27");
  });

  it("satu faktor & basis sama untuk semua objek", () => {
    const rows = sizeRows(["sun", "jupiter", "earth", "pluto"]);
    const k = rows.map((r) => r.render / r.radiusKm);
    for (const x of k) expect(x).toBeCloseTo(k[0], 12);
    for (const r of rows) expect(r.basis).toMatch(/radius/);
    // rasio render = rasio data
    expect(rows[2].render / rows[0].render).toBeCloseTo(6371 / 695700, 12);
  });

  it("layout tidak mengubah radius dan tidak menumpuk globe", () => {
    const items = sizeRows(["sun", "earth", "moon"]).map((r) => ({
      id: r.id,
      radius: r.render,
    }));
    const { slots } = sizeLayout(items);
    slots.forEach((s, i) => expect(s.radius).toBe(items[i].radius));
    for (let i = 1; i < slots.length; i++)
      expect(slots[i].x - slots[i - 1].x).toBeGreaterThan(
        slots[i].frame + slots[i - 1].frame,
      );
  });

  it("semua objek pilihan punya radius dari data", () => {
    for (const id of COMPARE_IDS)
      expect(OBJ.get(id)!.radius.value).toBeGreaterThan(0);
  });
});

describe("bandingkan jarak", () => {
  it("jarak rata-rata dari data (AU & km); satelit mengikuti induk", () => {
    const rows = distRows(["earth", "saturn", "moon"]);
    expect(rows[0].au).toBe(1);
    expect(rows[0].km).toBeCloseTo(AU_KM, 3);
    expect(rows[1].au).toBe(
      OBJ.get("saturn")!.orbitModel!.parameters.semiMajorAxisAU,
    );
    expect(rows[2]).toMatchObject({ au: 1, viaParent: "earth" });
    expect(meanDistanceAU("sun").au).toBe(0);
  });

  it("skala linear proporsional terhadap jarak", () => {
    const pos = axisPositions(
      ["mercury", "earth", "jupiter", "neptune"],
      "linear",
    );
    const au = pos.map((p) => meanDistanceAU(p.id).au);
    for (let i = 0; i < pos.length; i++)
      expect(pos[i].t / au[i]).toBeCloseTo(pos[0].t / au[0], 12);
    expect(pos[3].t).toBeCloseTo(1, 12);
  });

  it("skala log monoton dan wajib berlabel", () => {
    const m = distanceMap("log", 40);
    const xs = [0.3, 0.7, 1, 1.5, 5, 9.5, 19, 30, 39.5].map(m);
    for (let i = 1; i < xs.length; i++)
      expect(xs[i]).toBeGreaterThan(xs[i - 1]);
    expect(distScaleLabel("log")).toBe("Skala logaritmik");
    expect(distScaleLabel("linear")).toBe("Skala linear");
    const ticks = axisTicks("log", 30.07);
    expect(ticks[0]).toBeCloseTo(0.2);
    expect(ticks).toContain(1);
    expect(ticks).toContain(20);
  });

  it("tanda sumbu linear berjarak sama", () => {
    const t = axisTicks("linear", 9.537);
    const d = t[1] - t[0];
    for (let i = 1; i < t.length; i++)
      expect(t[i] - t[i - 1]).toBeCloseTo(d, 9);
    expect(t[0]).toBe(0);
  });
});

describe("pilihan objek 2–4", () => {
  it("helper murni menjaga batas", () => {
    expect(toggleId(["earth", "saturn"], "earth")).toEqual(["earth", "saturn"]);
    expect(toggleId(["earth", "saturn"], "mars")).toEqual([
      "earth",
      "saturn",
      "mars",
    ]);
    expect(toggleId(["a", "b", "c", "d"], "e")).toEqual(["a", "b", "c", "d"]);
    expect(toggleId(["a", "b", "c"], "b")).toEqual(["a", "c"]);
    expect(asReference(["earth", "saturn", "moon"], "moon")).toEqual([
      "moon",
      "earth",
      "saturn",
    ]);
  });

  it("store toggleCompare menjaga 2–4", () => {
    const s = useAngkasa.getState();
    s.set({ compareIds: ["earth", "saturn"] });
    useAngkasa.getState().toggleCompare("earth");
    expect(useAngkasa.getState().compareIds).toHaveLength(2);
    for (const id of ["mars", "venus", "jupiter"])
      useAngkasa.getState().toggleCompare(id);
    expect(useAngkasa.getState().compareIds).toHaveLength(4);
    useAngkasa.getState().toggleCompare("mars");
    useAngkasa.getState().toggleCompare("sun");
    expect(useAngkasa.getState().compareIds).toEqual([
      "earth",
      "saturn",
      "venus",
      "sun",
    ]);
  });
});

describe("ilustrasi galaksi", () => {
  it("deterministik, piringan tipis, tata surya ±26.000 tc dari pusat", () => {
    const a = buildGalaxyPoints(5000);
    const b = buildGalaxyPoints(5000);
    expect(a.main.pos).toEqual(b.main.pos);
    let maxR = 0,
      sumAbsY = 0,
      n = 0;
    for (let i = 0; i < a.main.pos.length; i += 3) {
      const r = Math.hypot(a.main.pos[i], a.main.pos[i + 2]);
      maxR = Math.max(maxR, r);
      if (r > 15) {
        sumAbsY += Math.abs(a.main.pos[i + 1]);
        n++;
      }
    }
    expect(maxR).toBeLessThan(GALAXY.radius * 1.1);
    expect(sumAbsY / n).toBeLessThan(1); // piringan luar jauh lebih tipis daripada diameternya
    expect(solarLocation().length()).toBeCloseTo(26, 6);
  });
});
