import { describe, expect, it } from "vitest";
import { MANIFEST, OBJ, PLANET_IDS } from "../manifest";
import {
  LEARNING,
  SimClock,
  diameterRatio,
  distanceMap,
  orbitAngle,
  sizeScale,
  visualSpinPeriodSec,
} from "../sim";
import { validateManifest } from "../validate";

describe("manifest", () => {
  it("valid: ID unik, referensi, satuan, kapabilitas berkonten", () => {
    expect(validateManifest(MANIFEST)).toEqual([]);
  });
  it("delapan planet + Pluto terpisah sebagai planet katai", () => {
    expect(PLANET_IDS).toHaveLength(8);
    for (const id of PLANET_IDS)
      expect(OBJ.get(id)!.classification).not.toBe("Planet katai");
    expect(OBJ.get("pluto")!.classification).toBe("Planet katai");
  });
  it("raksasa tidak menawarkan permukaan padat", () => {
    for (const id of ["jupiter", "saturn", "uranus", "neptune"])
      expect(OBJ.get(id)!.hasSolidSurface).toBe(false);
  });
  it("benda contoh tidak punya ukuran rekaan", () => {
    expect(OBJ.get("asteroid-example")!.radius.value).toBeNull();
    expect(OBJ.get("comet-example")!.radius.value).toBeNull();
  });
});

describe("jam simulasi", () => {
  it("pause membekukan waktu; langkah besar dibatasi", () => {
    const c = new SimClock();
    c.speed = 10;
    c.playing = true;
    c.tick(0.05);
    expect(c.days).toBeCloseTo(0.5);
    c.playing = false;
    c.tick(1);
    expect(c.days).toBeCloseTo(0.5);
    c.playing = true;
    c.tick(30); // kembali dari tab tersembunyi
    expect(c.days).toBeCloseTo(1.5);
  });
  it("pose dihitung dari waktu absolut: reset/scrub tidak mengakumulasi", () => {
    const e = OBJ.get("earth")!;
    const a1 = orbitAngle(e, 100);
    orbitAngle(e, 5000);
    expect(orbitAngle(e, 100)).toBeCloseTo(a1);
    expect(orbitAngle(e, 365.256)).toBeCloseTo(orbitAngle(e, 0));
  });
  it("rotasi diperlambat mempertahankan arah retrograde & urutan", () => {
    expect(visualSpinPeriodSec(OBJ.get("venus")!)).toBeLessThan(0);
    expect(visualSpinPeriodSec(OBJ.get("uranus")!)).toBeLessThan(0);
    expect(Math.abs(visualSpinPeriodSec(OBJ.get("jupiter")!))).toBeLessThan(
      Math.abs(visualSpinPeriodSec(OBJ.get("earth")!)),
    );
  });
});

describe("skala", () => {
  it("bandingkan ukuran: satu faktor, rasio dari data", () => {
    const s = sizeScale(["earth", "saturn"]);
    const ratio = s.render("saturn") / s.render("earth");
    expect(ratio).toBeCloseTo(diameterRatio("saturn", "earth")!, 6);
    expect(diameterRatio("saturn", "earth")).toBeCloseTo(58232 / 6371, 6);
  });
  it("bandingkan jarak linear sebanding dengan AU", () => {
    const f = distanceMap("linear", 30.07);
    expect(f(1) / f(5.203)).toBeCloseTo(1 / 5.203);
  });
  it("tampilan belajar menjaga urutan jarak & ukuran", () => {
    const d = PLANET_IDS.map((id) =>
      LEARNING.distance(OBJ.get(id)!.orbitModel!.parameters.semiMajorAxisAU!),
    );
    expect([...d].sort((a, b) => a - b)).toEqual(d);
    expect(LEARNING.radius(OBJ.get("jupiter")!)).toBeGreaterThan(
      LEARNING.radius(OBJ.get("saturn")!),
    );
  });
});
