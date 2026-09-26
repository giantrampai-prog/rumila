// Matematika murni simulasi fenomena (tanpa Three.js) — satu sumber untuk scene, teks panel, dan tes.
// Konvensi koordinat sama dengan scene: +Y = kutub utara ekliptika; gerak orbit & rotasi prograde =
// berlawanan arah jarum jam dilihat dari +Y (rotasi positif terhadap sumbu Y).
// Bujur peta Bumi (tekstur equirectangular pada SphereGeometry): bujur λ berada pada arah lokal
// (cos φ cos λ, sin φ, −cos φ sin λ).
//
// Waktu: setiap pelajaran punya jam lokal (detik nyata sejak Reset / sejak kontrol terakhir digeser).
// Semua sudut DIHITUNG dari waktu itu + nilai kontrol, tidak pernah ditambahkan sedikit demi sedikit.

import type { LessonId, LessonState } from "./state";

export type V3 = [number, number, number];

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

/* ---------------- konstanta (dibulatkan; sumber: NASA, lihat manifest) ---------------- */

export const EARTH_TILT_DEG = 23.44;
export const MOON_INCLINATION_DEG = 5.14;
export const SYNODIC_MONTH_DAYS = 29.53;
export const YEAR_DAYS = 365.256;

/** Aturan waktu tiap pelajaran (detik nyata → waktu simulasi). Ditampilkan di keterangan skala. */
export const LESSON_TIME = {
  "rotation-revolution": { orbitDaysPerSec: 10, spinSecPerTurn: 3 },
  "day-night": { hoursPerSec: 1 },
  "moon-phases": { daysPerSec: 1 },
  eclipses: { hoursPerSec: 2 },
  seasons: { daysPerSec: 10 },
} as const;

/* ---------------- vektor kecil ---------------- */

export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const add = (a: V3, b: V3): V3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];
export const sub = (a: V3, b: V3): V3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];
export const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a: V3): V3 => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
/** Rotasi terhadap sumbu +Y (sama dengan Object3D.rotation.y di Three.js). */
export function rotY(v: V3, deg: number): V3 {
  const s = Math.sin(deg * DEG),
    c = Math.cos(deg * DEG);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
}
/** Rotasi terhadap sumbu +Z. */
export function rotZ(v: V3, deg: number): V3 {
  const s = Math.sin(deg * DEG),
    c = Math.cos(deg * DEG);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
}
/** Rotasi terhadap sumbu sembarang (Rodrigues). */
export function rotAxis(v: V3, axis: V3, deg: number): V3 {
  const k = norm(axis);
  const c = Math.cos(deg * DEG),
    s = Math.sin(deg * DEG);
  return add(
    add(scale(v, c), scale(cross(k, v), s)),
    scale(k, dot(k, v) * (1 - c)),
  );
}
const angleBetween = (a: V3, b: V3) =>
  Math.acos(Math.max(-1, Math.min(1, dot(norm(a), norm(b))))) * RAD;
export const wrapDeg = (d: number) => ((d % 360) + 360) % 360;

/* ---------------- jam pelajaran ---------------- */

/**
 * Jam lokal pelajaran: dua kanal detik nyata (orbit & rotasi) agar keduanya bisa dihidupkan/dimatikan
 * terpisah. Pause = waktu tetap. Langkah per frame dibatasi (kembali dari tab tersembunyi tidak melompat).
 */
export class LessonClock {
  orbitSec = 0;
  spinSec = 0;
  tick(dtReal: number, playing: boolean, orbitOn = true, spinOn = true) {
    const dt = Math.min(Math.max(dtReal, 0), 0.1);
    if (!playing) return;
    if (orbitOn) this.orbitSec += dt;
    if (spinOn) this.spinSec += dt;
  }
  reset() {
    this.orbitSec = 0;
    this.spinSec = 0;
  }
}

export interface LessonTime {
  orbitSec: number;
  spinSec: number;
}

/* ---------------- rotasi & revolusi ---------------- */

export function rotRevPose(orbitSec: number, spinSec: number) {
  const r = LESSON_TIME["rotation-revolution"];
  const days = orbitSec * r.orbitDaysPerSec;
  const turns = spinSec / r.spinSecPerTurn;
  return {
    days,
    /** sudut orbit (derajat, 0 = posisi awal) */
    orbitDeg: wrapDeg((360 * days) / YEAR_DAYS),
    orbitFraction: (days % YEAR_DAYS) / YEAR_DAYS,
    spinDeg: wrapDeg(360 * turns),
    turns,
  };
}

/** Posisi orbit pada lingkaran (sama dengan orbitLine: (cos a, 0, −sin a)). */
export const orbitPoint = (deg: number, radius: number): V3 => [
  Math.cos(deg * DEG) * radius,
  0,
  -Math.sin(deg * DEG) * radius,
];

/* ---------------- siang & malam ---------------- */

/** Arah sumbu kutub utara setelah kemiringan (axisFrame.rotation.z = −tilt di bodies.ts). */
export const earthAxis = (tiltDeg = EARTH_TILT_DEG): V3 =>
  rotZ([0, 1, 0], -tiltDeg);

/** Normal permukaan (dunia) di lintang/bujur setelah Bumi berputar `spinDeg` dan sumbunya miring `tiltDeg`. */
export function surfaceNormal(
  latDeg: number,
  lonDeg: number,
  spinDeg: number,
  tiltDeg = EARTH_TILT_DEG,
): V3 {
  const phi = latDeg * DEG,
    lam = lonDeg * DEG;
  const local: V3 = [
    Math.cos(phi) * Math.cos(lam),
    Math.sin(phi),
    -Math.cos(phi) * Math.sin(lam),
  ];
  return rotZ(rotY(local, spinDeg), -tiltDeg);
}

/** Contoh lokasi: Jakarta (dibulatkan). */
export const JAKARTA = { name: "Jakarta", lat: -6.2, lon: 106.8 };
/** Arah datang cahaya Matahari (dari Bumi menuju Matahari) di pelajaran siang–malam. Tetap; tidak ikut kamera. */
export const DAYNIGHT_SUN_DIR: V3 = [0, 0, 1];

export function dayNightSpinDeg(baseDeg: number, sec: number) {
  return wrapDeg(baseDeg + 15 * sec * LESSON_TIME["day-night"].hoursPerSec);
}

export interface DayNight {
  /** cos sudut antara normal permukaan dan arah Matahari (>0 = tersinari) */
  cosSun: number;
  isDay: boolean;
  /** dekat garis batas siang–malam (terbit/terbenam) */
  nearTerminator: boolean;
  /** perkiraan jam Matahari setempat (0–24), 12 = Matahari paling tinggi */
  solarHour: number;
}

export function dayNight(
  latDeg: number,
  lonDeg: number,
  spinDeg: number,
  sunDir: V3 = DAYNIGHT_SUN_DIR,
  tiltDeg = EARTH_TILT_DEG,
): DayNight {
  const n = surfaceNormal(latDeg, lonDeg, spinDeg, tiltDeg);
  const s = norm(sunDir);
  const cosSun = dot(n, s);
  // sudut jam: dari arah Matahari ke titik, diukur searah rotasi pada bidang ekuator
  const ax = earthAxis(tiltDeg);
  const sp = sub(s, scale(ax, dot(s, ax)));
  const np = sub(n, scale(ax, dot(n, ax)));
  const H = Math.atan2(dot(ax, cross(sp, np)), dot(sp, np)) * RAD;
  return {
    cosSun,
    isDay: cosSun > 0,
    nearTerminator: Math.abs(cosSun) < 0.08,
    solarHour: wrapDeg(180 + H) / 15,
  };
}

export function fmtHour(h: number) {
  const m = Math.round(h * 60) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}.${String(m % 60).padStart(2, "0")}`;
}

export function partOfDay(d: DayNight) {
  if (d.nearTerminator)
    return d.solarHour < 12 ? "Matahari terbit" : "Matahari terbenam";
  if (!d.isDay) return "Malam";
  if (d.solarHour < 10) return "Pagi";
  if (d.solarHour < 14) return "Siang";
  return "Sore";
}

/* ---------------- fase Bulan ---------------- */

/** Arah Matahari (dari Bumi) di pelajaran fase & gerhana: dari kiri scene. */
export const MOON_LESSON_SUN_DIR: V3 = [-1, 0, 0];
const NORTH: V3 = [0, 1, 0];

export interface MoonPhase {
  /** sudut Matahari–Bulan–pengamat (derajat): 180 = bulan baru, 0 = purnama */
  phaseAngleDeg: number;
  /** elongasi 0–360 dari arah Matahari, searah gerak orbit (0 = bulan baru, 180 = purnama) */
  elongationDeg: number;
  /** bagian piringan yang tampak terang (0–1) */
  fraction: number;
  waxing: boolean;
  name: string;
}

const PHASE_NAMES = [
  "Bulan baru",
  "Sabit awal",
  "Kuartal awal",
  "Cembung awal",
  "Purnama",
  "Cembung akhir",
  "Kuartal akhir",
  "Sabit akhir",
];

export function phaseName(elongationDeg: number) {
  return PHASE_NAMES[Math.floor(wrapDeg(elongationDeg + 22.5) / 45) % 8];
}

/**
 * Fase dari geometri: posisi Matahari, Bulan, dan pengamat (dunia). Bagian terang = separuh Bulan yang
 * menghadap Matahari; yang tampak = irisan separuh itu dengan separuh yang menghadap pengamat.
 * Tidak memakai bayangan Bumi.
 */
export function moonPhaseFromVectors(
  sunPos: V3,
  moonPos: V3,
  observerPos: V3,
): MoonPhase {
  const toSun = sub(sunPos, moonPos);
  const toObs = sub(observerPos, moonPos);
  const phaseAngleDeg = angleBetween(toSun, toObs);
  const fraction = (1 + Math.cos(phaseAngleDeg * DEG)) / 2;
  const fromObsSun = sub(sunPos, observerPos);
  const fromObsMoon = sub(moonPos, observerPos);
  const elong = angleBetween(fromObsSun, fromObsMoon);
  const east = dot(cross(fromObsSun, fromObsMoon), NORTH) >= 0;
  const elongationDeg = east ? elong : wrapDeg(360 - elong);
  return {
    phaseAngleDeg,
    elongationDeg,
    fraction,
    waxing: elongationDeg > 0 && elongationDeg < 180,
    name: phaseName(elongationDeg),
  };
}

/** Pose pelajaran fase: Bumi di pusat, Matahari jauh di arah tetap, Bulan pada sudut `moonAngleDeg`. */
export const PHASE_SCENE = {
  earthR: 1,
  moonR: 0.3,
  moonDist: 4.2,
  sunDist: 60,
};

export function phaseMoonPos(
  moonAngleDeg: number,
  dist = PHASE_SCENE.moonDist,
): V3 {
  return scale(rotY(MOON_LESSON_SUN_DIR, moonAngleDeg), dist);
}

export function moonPhase(
  moonAngleDeg: number,
  sunDist = 1.496e8,
  moonDist = 384400,
): MoonPhase {
  return moonPhaseFromVectors(
    scale(MOON_LESSON_SUN_DIR, sunDist),
    phaseMoonPos(moonAngleDeg, moonDist),
    [0, 0, 0],
  );
}

export function phaseAngleNow(baseDeg: number, sec: number) {
  return wrapDeg(
    baseDeg +
      (360 * sec * LESSON_TIME["moon-phases"].daysPerSec) / SYNODIC_MONTH_DAYS,
  );
}

/* ---------------- gerhana ---------------- */

export interface EclipseGeom {
  sunR: number;
  sunDist: number;
  earthR: number;
  moonR: number;
  moonDist: number;
  inclinationDeg: number;
}

/** Ukuran & jarak sebenarnya (km; rata-rata, dibulatkan). */
export const REAL_ECLIPSE_GEOM: EclipseGeom = {
  sunR: 696000,
  sunDist: 1.496e8,
  earthR: 6371,
  moonR: 1737.4,
  moonDist: 384400,
  inclinationDeg: MOON_INCLINATION_DEG,
};

/** Skala pengajaran: jarak dirapatkan, Bulan dibesarkan, kemiringan orbit digambar ×4 agar terlihat. */
export const ECLIPSE_TILT_EXAGGERATION = 4;
export const SCENE_ECLIPSE_GEOM: EclipseGeom = {
  sunR: 2,
  sunDist: 40,
  earthR: 1,
  moonR: 0.27,
  moonDist: 5.5,
  inclinationDeg: MOON_INCLINATION_DEG * ECLIPSE_TILT_EXAGGERATION,
};

export type EclipsePreset = LessonState["eclipsePreset"];
/** moonAngle: elongasi Bulan (0 = bulan baru); nodeDeg: arah garis simpul orbit Bulan dari arah Matahari. */
export const ECLIPSE_PRESETS: Record<
  EclipsePreset,
  { moonAngle: number; nodeDeg: number; label: string }
> = {
  matahari: { moonAngle: 0, nodeDeg: 0, label: "Gerhana Matahari" },
  bulan: { moonAngle: 180, nodeDeg: 0, label: "Gerhana Bulan" },
  tanpa: { moonAngle: 0, nodeDeg: 90, label: "Bulan baru tanpa gerhana" },
};

export function eclipseSunPos(g: EclipseGeom): V3 {
  return scale(MOON_LESSON_SUN_DIR, g.sunDist);
}

/** Posisi Bulan (Bumi di pusat) pada orbit miring: u = sudut dari simpul naik. */
export function eclipseMoonPos(
  g: EclipseGeom,
  moonAngleDeg: number,
  nodeDeg: number,
): V3 {
  const nodeDir = rotY(MOON_LESSON_SUN_DIR, nodeDeg);
  const q = rotY(MOON_LESSON_SUN_DIR, nodeDeg + 90);
  const u = (moonAngleDeg - nodeDeg) * DEG;
  const i = g.inclinationDeg * DEG;
  const inPlane = add(scale(q, Math.cos(i)), scale(NORTH, Math.sin(i)));
  return scale(
    add(scale(nodeDir, Math.cos(u)), scale(inPlane, Math.sin(u))),
    g.moonDist,
  );
}

/** Lintang ekliptika Bulan (derajat): seberapa jauh Bulan di atas (+) / bawah (−) bidang orbit Bumi. */
export function moonLatitudeDeg(
  g: EclipseGeom,
  moonAngleDeg: number,
  nodeDeg: number,
) {
  const p = eclipseMoonPos(g, moonAngleDeg, nodeDeg);
  return Math.asin(p[1] / len(p)) * RAD;
}

/**
 * Jari-jari bayangan (umbra & penumbra) sebuah benda berjari-jari `occR` pada jarak `x` di belakangnya,
 * untuk sumber cahaya berjari-jari `sunR` sejauh `D`. Umbra negatif = antumbra (gerhana cincin).
 */
export function shadowRadii(sunR: number, D: number, occR: number, x: number) {
  return {
    umbra: occR - ((sunR - occR) / D) * x,
    penumbra: occR + ((sunR + occR) / D) * x,
    umbraLength: (occR * D) / (sunR - occR),
  };
}

export type EclipseKind =
  | "matahari-total"
  | "matahari-cincin"
  | "matahari-sebagian"
  | "bulan-total"
  | "bulan-sebagian"
  | "bulan-penumbra"
  | "tidak";

export interface EclipseResult {
  kind: EclipseKind;
  /** jarak terdekat sumbu bayangan ke pusat benda yang terkena, dibagi batas terjadinya gerhana (<1 = gerhana) */
  missRatio: number;
  moonLatDeg: number;
}

function axisDistance(from: V3, dir: V3, p: V3) {
  const d = norm(dir);
  const v = sub(p, from);
  const along = dot(v, d);
  return { along, perp: len(sub(v, scale(d, along))) };
}

/** Uji alignment: bayangan Bulan mengenai Bumi (gerhana Matahari) atau Bulan masuk bayangan Bumi (gerhana Bulan). */
export function eclipseState(
  g: EclipseGeom,
  moonAngleDeg: number,
  nodeDeg: number,
): EclipseResult {
  const sun = eclipseSunPos(g);
  const moon = eclipseMoonPos(g, moonAngleDeg, nodeDeg);
  const earth: V3 = [0, 0, 0];
  const moonLatDeg = moonLatitudeDeg(g, moonAngleDeg, nodeDeg);

  // Gerhana Matahari: sumbu bayangan Bulan (menjauhi Matahari) melewati Bumi.
  const ms = axisDistance(moon, sub(moon, sun), earth);
  if (ms.along > 0) {
    // jari-jari bayangan dievaluasi di permukaan Bumi yang menghadap Bulan
    const r = shadowRadii(
      g.sunR,
      len(sub(moon, sun)),
      g.moonR,
      Math.max(0, ms.along - g.earthR),
    );
    const limit = g.earthR + r.penumbra;
    if (ms.perp < limit) {
      const kind: EclipseKind =
        ms.perp < g.earthR + Math.abs(r.umbra)
          ? r.umbra > 0
            ? "matahari-total"
            : "matahari-cincin"
          : "matahari-sebagian";
      return { kind, missRatio: ms.perp / limit, moonLatDeg };
    }
  }
  // Gerhana Bulan: Bulan berada di dalam bayangan Bumi.
  const es = axisDistance(earth, sub(earth, sun), moon);
  if (es.along > 0) {
    const r = shadowRadii(g.sunR, g.sunDist, g.earthR, es.along);
    const limit = r.penumbra + g.moonR;
    if (es.perp < limit) {
      const kind: EclipseKind =
        es.perp + g.moonR < r.umbra
          ? "bulan-total"
          : es.perp - g.moonR < r.umbra
            ? "bulan-sebagian"
            : "bulan-penumbra";
      return { kind, missRatio: es.perp / limit, moonLatDeg };
    }
  }
  // tidak ada gerhana: seberapa jauh meleset dari batas terdekat
  const sunSide =
    ms.along > 0
      ? ms.perp /
        (g.earthR + shadowRadii(g.sunR, g.sunDist, g.moonR, ms.along).penumbra)
      : Infinity;
  const earthSide =
    es.along > 0
      ? es.perp /
        (shadowRadii(g.sunR, g.sunDist, g.earthR, es.along).penumbra + g.moonR)
      : Infinity;
  return { kind: "tidak", missRatio: Math.min(sunSide, earthSide), moonLatDeg };
}

export const ECLIPSE_TEXT: Record<EclipseKind, string> = {
  "matahari-total":
    "Gerhana Matahari total: bayangan inti (umbra) Bulan jatuh di Bumi.",
  "matahari-cincin":
    "Gerhana Matahari cincin: Bulan tepat di depan Matahari, tetapi tampak sedikit lebih kecil.",
  "matahari-sebagian":
    "Gerhana Matahari sebagian: hanya bayangan kabur (penumbra) Bulan yang mengenai Bumi.",
  "bulan-total":
    "Gerhana Bulan total: seluruh Bulan masuk umbra Bumi dan tampak kemerahan.",
  "bulan-sebagian": "Gerhana Bulan sebagian: sebagian Bulan masuk umbra Bumi.",
  "bulan-penumbra":
    "Gerhana Bulan penumbra: Bulan hanya melewati bayangan kabur, sedikit meredup.",
  tidak: "Tidak ada gerhana: bayangan meleset.",
};

export function eclipseAngleNow(baseDeg: number, sec: number) {
  return wrapDeg(
    baseDeg +
      (360 * sec * LESSON_TIME.eclipses.hoursPerSec) /
        (SYNODIC_MONTH_DAYS * 24),
  );
}

/* ---------------- musim ---------------- */

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

/**
 * Posisi Bumi pada orbit musim: sudut 0 = ekuinoks Maret, 90 = solstis Juni, 180 = ekuinoks September,
 * 270 = solstis Desember. Kutub utara tetap condong ke arah +X (arah sumbu tidak berubah sepanjang orbit).
 */
export function seasonPose(angleDeg: number, tiltDeg = EARTH_TILT_DEG) {
  const a = angleDeg * DEG;
  const earthDir: V3 = [-Math.sin(a), 0, -Math.cos(a)];
  const sunDir = scale(earthDir, -1);
  const axis = earthAxis(tiltDeg);
  const subsolarLatDeg =
    Math.asin(Math.max(-1, Math.min(1, dot(axis, sunDir)))) * RAD;
  const hemisphere: "utara" | "selatan" | "seimbang" =
    Math.abs(subsolarLatDeg) < 3
      ? "seimbang"
      : subsolarLatDeg > 0
        ? "utara"
        : "selatan";
  // perkiraan bulan kalender (ekuinoks Maret ≈ hari ke-79)
  const doy = Math.floor(79 + (wrapDeg(angleDeg) / 360) * 365.25) % 365;
  let m = 11;
  while (MONTH_START[m] > doy) m--;
  return {
    earthDir,
    sunDir,
    axis,
    subsolarLatDeg,
    hemisphere,
    month: MONTHS[m],
  };
}

export const SEASON_MARKS = [
  { angle: 0, label: "Ekuinoks Maret" },
  { angle: 90, label: "Solstis Juni" },
  { angle: 180, label: "Ekuinoks September" },
  { angle: 270, label: "Solstis Desember" },
];

export function seasonAngleNow(baseDeg: number, sec: number) {
  return wrapDeg(
    baseDeg + (360 * sec * LESSON_TIME.seasons.daysPerSec) / YEAR_DAYS,
  );
}

/* ---------------- pose gabungan (scene + panel memakai fungsi yang sama) ---------------- */

export type LessonPose =
  | {
      lesson: "rotation-revolution";
      rr: ReturnType<typeof rotRevPose>;
      orbitOn: boolean;
      spinOn: boolean;
    }
  | { lesson: "day-night"; spinDeg: number; marker: DayNight }
  | { lesson: "moon-phases"; moonAngleDeg: number; phase: MoonPhase }
  | {
      lesson: "eclipses";
      moonAngleDeg: number;
      nodeDeg: number;
      scene: EclipseResult;
      real: EclipseResult;
      realMoonLatDeg: number;
    }
  | {
      lesson: "seasons";
      angleDeg: number;
      season: ReturnType<typeof seasonPose>;
    };

export function lessonPose(
  lesson: LessonId,
  ls: LessonState,
  t: LessonTime,
): LessonPose {
  switch (lesson) {
    case "rotation-revolution":
      return {
        lesson,
        rr: rotRevPose(t.orbitSec, t.spinSec),
        orbitOn: ls.orbitOn,
        spinOn: ls.spinOn,
      };
    case "day-night": {
      const spinDeg = dayNightSpinDeg(ls.earthSpin, t.spinSec);
      return {
        lesson,
        spinDeg,
        marker: dayNight(JAKARTA.lat, JAKARTA.lon, spinDeg),
      };
    }
    case "moon-phases": {
      const moonAngleDeg = phaseAngleNow(ls.moonAngle, t.orbitSec);
      return { lesson, moonAngleDeg, phase: moonPhase(moonAngleDeg) };
    }
    case "eclipses": {
      const moonAngleDeg = eclipseAngleNow(ls.moonAngle, t.orbitSec);
      const nodeDeg = ECLIPSE_PRESETS[ls.eclipsePreset].nodeDeg;
      return {
        lesson,
        moonAngleDeg,
        nodeDeg,
        scene: eclipseState(SCENE_ECLIPSE_GEOM, moonAngleDeg, nodeDeg),
        real: eclipseState(REAL_ECLIPSE_GEOM, moonAngleDeg, nodeDeg),
        realMoonLatDeg: moonLatitudeDeg(
          REAL_ECLIPSE_GEOM,
          moonAngleDeg,
          nodeDeg,
        ),
      };
    }
    case "seasons": {
      const angleDeg = seasonAngleNow(ls.earthOrbitAngle, t.orbitSec);
      return { lesson, angleDeg, season: seasonPose(angleDeg) };
    }
  }
}

/** Keterangan skala & waktu per pelajaran (selalu diawali "Simulasi belajar"). */
export function lessonScaleNote(lesson: LessonId) {
  switch (lesson) {
    case "rotation-revolution":
      return "Simulasi belajar · 1 detik = 10 hari simulasi untuk revolusi · Rotasi diperlambat (1 putaran = 3 detik) · ukuran & jarak tidak berskala";
    case "day-night":
      return "Simulasi belajar · 1 detik = 1 jam simulasi · revolusi tidak ditampilkan · ukuran & jarak tidak berskala";
    case "moon-phases":
      return "Simulasi belajar · 1 detik = 1 hari simulasi · rotasi Bumi tidak ditampilkan · ukuran & jarak tidak berskala";
    case "eclipses":
      return "Simulasi belajar · 1 detik = 2 jam simulasi · jarak dirapatkan, Bulan dibesarkan, kemiringan orbit Bulan digambar ×4 · kerucut bayangan = diagram";
    case "seasons":
      return "Simulasi belajar · 1 detik = 10 hari simulasi · orbit digambar lingkaran · ukuran & jarak tidak berskala";
  }
}
