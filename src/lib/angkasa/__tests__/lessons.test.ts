import { describe, expect, it } from "vitest";
import {
  ECLIPSE_PRESETS,
  JAKARTA,
  LessonClock,
  REAL_ECLIPSE_GEOM,
  SCENE_ECLIPSE_GEOM,
  dayNight,
  dayNightSpinDeg,
  eclipseState,
  lessonPose,
  lessonScaleNote,
  moonLatitudeDeg,
  moonPhase,
  moonPhaseFromVectors,
  phaseMoonPos,
  rotRevPose,
  seasonPose,
} from "../lessons";
import { LESSON_DEFAULT, type LessonId } from "../state";

describe("fase Bulan dari geometri", () => {
  it("bulan baru / kuartal awal / purnama / kuartal akhir", () => {
    const n = moonPhase(0);
    expect(n.fraction).toBeCloseTo(0, 3);
    expect(n.name).toBe("Bulan baru");
    const q1 = moonPhase(90);
    expect(q1.fraction).toBeCloseTo(0.5, 2);
    expect(q1.name).toBe("Kuartal awal");
    expect(q1.waxing).toBe(true);
    const f = moonPhase(180);
    expect(f.fraction).toBeCloseTo(1, 3);
    expect(f.name).toBe("Purnama");
    const q3 = moonPhase(270);
    expect(q3.fraction).toBeCloseTo(0.5, 2);
    expect(q3.name).toBe("Kuartal akhir");
    expect(q3.waxing).toBe(false);
  });
  it("sabit & cembung; fraksi naik monoton sampai purnama", () => {
    expect(moonPhase(45).name).toBe("Sabit awal");
    expect(moonPhase(135).name).toBe("Cembung awal");
    expect(moonPhase(315).name).toBe("Sabit akhir");
    let prev = -1;
    for (let a = 0; a <= 180; a += 15) {
      const k = moonPhase(a).fraction;
      expect(k).toBeGreaterThanOrEqual(prev);
      prev = k;
    }
  });
  it("berlaku juga pada skala scene (Matahari tidak jauh tak hingga)", () => {
    const sun: [number, number, number] = [-60, 0, 0];
    expect(
      moonPhaseFromVectors(sun, phaseMoonPos(0), [0, 0, 0]).fraction,
    ).toBeLessThan(0.01);
    expect(
      moonPhaseFromVectors(sun, phaseMoonPos(90), [0, 0, 0]).fraction,
    ).toBeCloseTo(0.5, 1);
    expect(
      moonPhaseFromVectors(sun, phaseMoonPos(180), [0, 0, 0]).fraction,
    ).toBeGreaterThan(0.99);
  });
});

describe("gerhana: alignment + kemiringan orbit", () => {
  for (const [name, g] of [
    ["ukuran sebenarnya", REAL_ECLIPSE_GEOM],
    ["skala scene", SCENE_ECLIPSE_GEOM],
  ] as const) {
    it(`preset benar (${name})`, () => {
      const m = ECLIPSE_PRESETS.matahari;
      expect(
        eclipseState(g, m.moonAngle, m.nodeDeg).kind.startsWith("matahari"),
      ).toBe(true);
      const b = ECLIPSE_PRESETS.bulan;
      expect(eclipseState(g, b.moonAngle, b.nodeDeg).kind).toBe("bulan-total");
      const t = ECLIPSE_PRESETS.tanpa;
      // bulan baru & purnama tetapi Bulan di atas/bawah bidang orbit → tidak ada gerhana
      expect(eclipseState(g, t.moonAngle, t.nodeDeg).kind).toBe("tidak");
      expect(eclipseState(g, t.moonAngle + 180, t.nodeDeg).kind).toBe("tidak");
    });
  }
  it("preset tanpa: Bulan ±5,1° dari ekliptika; preset gerhana: di simpul (0°)", () => {
    const t = ECLIPSE_PRESETS.tanpa;
    expect(
      Math.abs(moonLatitudeDeg(REAL_ECLIPSE_GEOM, t.moonAngle, t.nodeDeg)),
    ).toBeCloseTo(5.14, 2);
    expect(moonLatitudeDeg(REAL_ECLIPSE_GEOM, 0, 0)).toBeCloseTo(0, 6);
  });
  it("bulan kuartal tidak pernah gerhana", () => {
    expect(eclipseState(REAL_ECLIPSE_GEOM, 90, 0).kind).toBe("tidak");
    expect(eclipseState(SCENE_ECLIPSE_GEOM, 90, 0).kind).toBe("tidak");
  });
  it("batas gerhana Bulan nyata sekitar 1° dari simpul", () => {
    expect(eclipseState(REAL_ECLIPSE_GEOM, 180.5, 0).kind).not.toBe("tidak");
    expect(eclipseState(REAL_ECLIPSE_GEOM, 180 + 25, 0).kind).toBe("tidak");
  });
});

describe("musim: sumbu tetap, belahan bergantian", () => {
  it("dua posisi berlawanan → lintang sinar tegak berlawanan tanda, sumbu sama", () => {
    const june = seasonPose(90);
    const dec = seasonPose(270);
    expect(june.subsolarLatDeg).toBeCloseTo(23.44, 1);
    expect(dec.subsolarLatDeg).toBeCloseTo(-23.44, 1);
    expect(june.hemisphere).toBe("utara");
    expect(dec.hemisphere).toBe("selatan");
    expect(june.axis).toEqual(dec.axis);
    expect(june.month).toBe("Juni");
    expect(dec.month).toBe("Desember");
  });
  it("ekuinoks seimbang; semua posisi memakai sumbu yang sama", () => {
    expect(Math.abs(seasonPose(0).subsolarLatDeg)).toBeLessThan(0.01);
    expect(seasonPose(180).hemisphere).toBe("seimbang");
    const ax = seasonPose(0).axis;
    for (let a = 0; a < 360; a += 30) expect(seasonPose(a).axis).toEqual(ax);
  });
  it("lintang sinar tegak tidak melebihi kemiringan sumbu", () => {
    for (let a = 0; a < 360; a += 10)
      expect(Math.abs(seasonPose(a).subsolarLatDeg)).toBeLessThanOrEqual(
        23.44 + 1e-9,
      );
  });
});

describe("siang & malam", () => {
  it("penanda Jakarta berganti siang/malam setelah setengah putaran", () => {
    for (const s of [0, 40, 100, 200, 300]) {
      const a = dayNight(JAKARTA.lat, JAKARTA.lon, s);
      const b = dayNight(JAKARTA.lat, JAKARTA.lon, s + 180);
      if (Math.abs(a.cosSun) > 0.05) expect(b.isDay).toBe(!a.isDay);
    }
  });
  it("jam Matahari: tengah hari saat normal paling menghadap Matahari", () => {
    let best = { s: 0, c: -2 };
    for (let s = 0; s < 360; s += 0.5) {
      const d = dayNight(JAKARTA.lat, JAKARTA.lon, s);
      if (d.cosSun > best.c) best = { s, c: d.cosSun };
    }
    expect(dayNight(JAKARTA.lat, JAKARTA.lon, best.s).solarHour).toBeCloseTo(
      12,
      0,
    );
    // 90° rotasi kemudian = 6 jam kemudian
    expect(
      dayNight(JAKARTA.lat, JAKARTA.lon, best.s + 90).solarHour,
    ).toBeCloseTo(18, 0);
  });
  it("1 detik = 1 jam simulasi (15°)", () => {
    expect(dayNightSpinDeg(0, 12)).toBeCloseTo(180);
    expect(dayNightSpinDeg(350, 2)).toBeCloseTo(20);
  });
});

describe("rotasi & revolusi + jam pelajaran", () => {
  it("orbit dan rotasi berjalan terpisah", () => {
    const c = new LessonClock();
    for (let i = 0; i < 20; i++) c.tick(0.05, true, true, false);
    expect(c.orbitSec).toBeCloseTo(1);
    expect(c.spinSec).toBe(0);
    for (let i = 0; i < 20; i++) c.tick(0.05, true, false, true);
    expect(c.orbitSec).toBeCloseTo(1);
    expect(c.spinSec).toBeCloseTo(1);
    const p = rotRevPose(c.orbitSec, c.spinSec);
    expect(p.days).toBeCloseTo(10);
    expect(p.spinDeg).toBeCloseTo(120);
  });
  it("pause membekukan; langkah besar dibatasi; reset kembali ke keadaan awal", () => {
    const c = new LessonClock();
    c.tick(0.05, false);
    expect(c.orbitSec).toBe(0);
    c.tick(5, true); // tab kembali aktif
    expect(c.orbitSec).toBeCloseTo(0.1);
    c.reset();
    expect(c.orbitSec).toBe(0);
    expect(c.spinSec).toBe(0);
  });
  it("pose deterministik: waktu sama → hasil sama, tanpa akumulasi", () => {
    const lessons: LessonId[] = [
      "rotation-revolution",
      "day-night",
      "moon-phases",
      "eclipses",
      "seasons",
    ];
    for (const l of lessons) {
      const a = lessonPose(l, LESSON_DEFAULT, { orbitSec: 7.3, spinSec: 4.1 });
      // jalan berulang lalu kembali ke waktu yang sama
      for (let i = 0; i < 50; i++)
        lessonPose(l, LESSON_DEFAULT, { orbitSec: i, spinSec: i });
      expect(
        lessonPose(l, LESSON_DEFAULT, { orbitSec: 7.3, spinSec: 4.1 }),
      ).toEqual(a);
      // waktu 0 = keadaan awal yang dikenal
      expect(
        lessonPose(l, LESSON_DEFAULT, { orbitSec: 0, spinSec: 0 }),
      ).toEqual(lessonPose(l, LESSON_DEFAULT, { orbitSec: 0, spinSec: 0 }));
      expect(lessonScaleNote(l).startsWith("Simulasi belajar")).toBe(true);
    }
  });
  it("keadaan awal default dikenal", () => {
    const mp = lessonPose("moon-phases", LESSON_DEFAULT, {
      orbitSec: 0,
      spinSec: 0,
    });
    expect(mp.lesson === "moon-phases" && mp.phase.name).toBe("Bulan baru");
    const ec = lessonPose("eclipses", LESSON_DEFAULT, {
      orbitSec: 0,
      spinSec: 0,
    });
    expect(ec.lesson === "eclipses" && ec.scene.kind).toBe("matahari-total");
  });
});
