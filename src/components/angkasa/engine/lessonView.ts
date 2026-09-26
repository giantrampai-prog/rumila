// View Fenomena: lima simulasi belajar (rotasi–revolusi, siang–malam, fase Bulan, gerhana, musim).
// Scene dibangun ulang per pelajaran. Semua pose dihitung dari jam lokal pelajaran + nilai kontrol
// lewat lessonPose() (lib/angkasa/lessons.ts) — sumber yang sama dengan teks panel. Tidak ada sudut
// yang ditambahkan per frame. Cahaya berasal dari Matahari di scene (tidak ikut kamera).

import * as THREE from "three";
import { getObj } from "@/lib/angkasa/manifest";
import {
  DAYNIGHT_SUN_DIR,
  JAKARTA,
  LessonClock,
  MOON_LESSON_SUN_DIR,
  PHASE_SCENE,
  SCENE_ECLIPSE_GEOM,
  SEASON_MARKS,
  eclipseMoonPos,
  eclipseSunPos,
  lessonPose,
  lessonScaleNote,
  orbitPoint,
  partOfDay,
  phaseMoonPos,
  rotY,
  seasonPose,
  shadowRadii,
  surfaceNormal,
  type LessonPose,
  type LessonTime,
  type V3,
} from "@/lib/angkasa/lessons";
import {
  LESSON_DEFAULT,
  type AngkasaState,
  type LessonId,
  type LessonState,
} from "@/lib/angkasa/state";
import { createBody, orbitLine, starfield, type Body } from "./bodies";
import { disposeTree, type EngineCtx, type LabelSpec } from "./core";
import type { ModeView } from "./views";

const DEG = Math.PI / 180;
const HELPER_LAYER = 1; // garis bantu/diagram: terlihat di kamera utama, tidak di inset "Dilihat dari Bumi"
const v3 = (a: V3) => new THREE.Vector3(a[0], a[1], a[2]);

interface LessonScene {
  root: THREE.Group;
  bodies: Body[];
  home: { pos: THREE.Vector3; target: THREE.Vector3; min: number; max: number };
  update(pose: LessonPose, ls: LessonState): void;
  labels(): LabelSpec[];
  occluders(): THREE.Object3D[];
  afterRender?(renderer: THREE.WebGLRenderer): void;
}

/* ---------------- helper geometri ---------------- */

function onHelperLayer(o: THREE.Object3D) {
  o.traverse((c) => c.layers.set(HELPER_LAYER));
  return o;
}

function segment(
  a: THREE.Vector3,
  b: THREE.Vector3,
  color: number,
  opacity = 0.9,
) {
  const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
  return new THREE.Line(
    geo,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
}

/** Garis sumbu kutub (anak axisFrame → arah tetap di ruang). */
function axisLine(r: number, color = 0x52b8a8) {
  return segment(
    new THREE.Vector3(0, -r * 1.6, 0),
    new THREE.Vector3(0, r * 1.6, 0),
    color,
    1,
  );
}

function dot3(r: number, color: number) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(r, 16, 12),
    new THREE.MeshBasicMaterial({ color }),
  );
}

/** Penanda lokasi di permukaan (anak kelompok spin agar ikut berputar bersama Bumi). */
function surfaceMarker(body: Body, lat: number, lon: number) {
  const n = v3(surfaceNormal(lat, lon, 0, 0));
  const g = new THREE.Group();
  const dot = dot3(body.radius * 0.045, 0xff7f67);
  dot.position.copy(n).multiplyScalar(body.radius * 1.03);
  const stick = segment(
    n.clone().multiplyScalar(body.radius),
    n.clone().multiplyScalar(body.radius * 1.12),
    0xff7f67,
    1,
  );
  g.add(dot, stick);
  body.spin.add(g);
  return dot;
}

/** Berkas sinar Matahari (panah sejajar) yang datang dari arah `toSun`. */
function sunRays(
  toSun: THREE.Vector3,
  start: number,
  length: number,
  spread: number,
) {
  const g = new THREE.Group();
  const dir = toSun.clone().normalize().negate();
  const side = new THREE.Vector3(0, 1, 0).cross(dir).normalize();
  const up = dir.clone().cross(side).normalize();
  for (const [a, b] of [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const origin = toSun
      .clone()
      .normalize()
      .multiplyScalar(start)
      .add(side.clone().multiplyScalar(a * spread))
      .add(up.clone().multiplyScalar(b * spread));
    g.add(
      new THREE.ArrowHelper(
        dir,
        origin,
        length,
        0xffd27a,
        length * 0.12,
        length * 0.06,
      ),
    );
  }
  return onHelperLayer(g);
}

/** Kerucut/silinder terpotong dari r0 (di pangkal) ke r1 (sejauh len) sepanjang +Y, pangkal di origin. */
function shadowCone(
  r0: number,
  r1: number,
  length: number,
  color: number,
  opacity: number,
) {
  const geo = new THREE.CylinderGeometry(
    Math.max(r1, 0),
    r0,
    length,
    48,
    1,
    true,
  );
  geo.translate(0, length / 2, 0);
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  mesh.renderOrder = 3;
  return mesh;
}

/**
 * Bayangan benda bulat (umbra lembut + penumbra) di shader, dari posisi & jari-jari Matahari dan
 * penghalang di scene. Dipakai hanya pada pelajaran gerhana — fase Bulan TIDAK memakai bayangan Bumi.
 */
function patchEclipseShadow(
  mat: THREE.Material,
  u: {
    uEclSun: { value: THREE.Vector3 };
    uEclSunR: { value: number };
    uEclOcc: { value: THREE.Vector3 };
    uEclOccR: { value: number };
  },
  red: number,
  key: string,
) {
  const prev = mat.onBeforeCompile.bind(mat);
  const uRed = { value: red };
  mat.onBeforeCompile = (sh, renderer) => {
    prev(sh, renderer);
    Object.assign(sh.uniforms, u, { uEclRed: uRed });
    sh.vertexShader = sh.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vEclW;\nvarying vec3 vEclN;",
      )
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvEclW = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvEclN = normalize(mat3(modelMatrix) * objectNormal);",
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform vec3 uEclSun; uniform float uEclSunR; uniform vec3 uEclOcc; uniform float uEclOccR; uniform float uEclRed;
        varying vec3 vEclW; varying vec3 vEclN;
        float eclVis(vec3 p) {
          vec3 toS = uEclSun - p; float dS = length(toS); vec3 sd = toS / dS;
          vec3 toO = uEclOcc - p; float dO = max(length(toO), 1e-4);
          if (dot(toO, sd) <= 0.0) return 1.0;
          float aS = asin(clamp(uEclSunR / dS, 0.0, 1.0));
          float aO = asin(clamp(uEclOccR / dO, 0.0, 1.0));
          float sep = acos(clamp(dot(sd, toO / dO), -1.0, 1.0));
          if (sep >= aS + aO) return 1.0;
          float full = aO >= aS ? 0.0 : 1.0 - (aO * aO) / (aS * aS);
          float inner = abs(aS - aO);
          if (sep <= inner) return full;
          float t = (sep - inner) / max(aS + aO - inner, 1e-5);
          return mix(full, 1.0, smoothstep(0.0, 1.0, t));
        }`,
      )
      .replace(
        "#include <aomap_fragment>",
        `float eclV = eclVis(vEclW);
        reflectedLight.directDiffuse *= eclV;
        reflectedLight.directSpecular *= eclV;
        float eclFace = smoothstep(-0.1, 0.3, dot(normalize(vEclN), normalize(uEclSun - vEclW)));
        totalEmissiveRadiance += uEclRed * smoothstep(0.35, 0.95, 1.0 - eclV) * eclFace * vec3(0.55, 0.17, 0.07) * diffuseColor.rgb;
        #include <aomap_fragment>`,
      );
  };
  mat.customProgramCacheKey = () => `ak-eclipse-${key}`;
  mat.needsUpdate = true;
}

/* ---------------- pelajaran: rotasi & revolusi ---------------- */

function buildRotRev(ctx: EngineCtx): LessonScene {
  const root = new THREE.Group();
  const ORBIT_R = 7;
  const sun = createBody(getObj("sun"), ctx, { radius: 1.6 });
  const earth = createBody(getObj("earth"), ctx, { radius: 0.7, hi: true });
  root.add(sun.orbitAnchor, earth.orbitAnchor);
  root.add(
    new THREE.PointLight(0xfff4e6, 3.2, 0, 0),
    new THREE.AmbientLight(0x8899bb, 0.04),
  );
  root.add(onHelperLayer(orbitLine(ORBIT_R, 0x6f86b8, 0.35)));
  earth.axisFrame.add(onHelperLayer(axisLine(earth.radius)));
  surfaceMarker(earth, JAKARTA.lat, JAKARTA.lon);
  const origin = new THREE.Vector3();

  return {
    root,
    bodies: [sun, earth],
    home: {
      pos: new THREE.Vector3(0, 13.5, 21.5),
      target: new THREE.Vector3(0, 0, 0),
      min: 2.5,
      max: 40,
    },
    update(p) {
      if (p.lesson !== "rotation-revolution") return;
      earth.orbitAnchor.position.copy(v3(orbitPoint(p.rr.orbitDeg, ORBIT_R)));
      earth.spin.rotation.y = p.rr.spinDeg * DEG;
      sun.setSun(origin);
      earth.setSun(origin);
    },
    labels: () => [
      {
        id: "rr.sun",
        text: "Matahari",
        priority: 8,
        kind: "object",
        world: (v) => v.set(0, 2.1, 0),
      },
      {
        id: "rr.earth",
        text: "Bumi",
        priority: 9,
        kind: "object",
        world: (v) =>
          earth.orbitAnchor
            .getWorldPosition(v)
            .add(new THREE.Vector3(0, 1.35, 0)),
      },
      {
        id: "rr.axis",
        text: "Sumbu Bumi (miring 23,4°)",
        priority: 6,
        kind: "note",
        world: (v) =>
          earth.axisFrame.localToWorld(v.set(0, earth.radius * 1.65, 0)),
      },
      {
        id: "rr.orbit",
        text: "Jalur revolusi",
        priority: 3,
        kind: "note",
        world: (v) => v.set(-ORBIT_R * 0.72, 0, ORBIT_R * 0.72),
      },
    ],
    occluders: () => [sun.surface, earth.surface],
  };
}

/* ---------------- pelajaran: siang & malam ---------------- */

function buildDayNight(ctx: EngineCtx): LessonScene {
  const root = new THREE.Group();
  const R = 1.6;
  const toSun = v3(DAYNIGHT_SUN_DIR).normalize();
  const sunPos = toSun.clone().multiplyScalar(30);
  const earth = createBody(getObj("earth"), ctx, { radius: R, hi: true });
  const sun = createBody(getObj("sun"), ctx, { radius: 1.3 });
  sun.orbitAnchor.position.copy(sunPos);
  root.add(earth.orbitAnchor, sun.orbitAnchor);
  // Cahaya dari arah tetap di scene (bukan dari kamera).
  const light = new THREE.DirectionalLight(0xffffff, 2.8);
  light.position.copy(sunPos);
  root.add(light, new THREE.AmbientLight(0x8899bb, 0.03));
  root.add(sunRays(toSun, 7.5, 4, 0.9));
  earth.axisFrame.add(onHelperLayer(axisLine(R)));
  const marker = surfaceMarker(earth, JAKARTA.lat, JAKARTA.lon);
  let status = "";

  return {
    root,
    bodies: [earth, sun],
    home: {
      pos: new THREE.Vector3(6.2, 1.8, 1.6),
      target: new THREE.Vector3(0, 0, 0.3),
      min: 2.6,
      max: 22,
    },
    update(p) {
      if (p.lesson !== "day-night") return;
      earth.spin.rotation.y = p.spinDeg * DEG;
      earth.setSun(sunPos);
      sun.setSun(sunPos);
      status = partOfDay(p.marker);
    },
    labels: () => [
      {
        id: "dn.marker",
        text: `${JAKARTA.name} · ${status}`,
        priority: 10,
        kind: "part",
        world: (v) => marker.getWorldPosition(v),
      },
      {
        id: "dn.sun",
        text: "Cahaya Matahari",
        priority: 6,
        kind: "note",
        world: (v) =>
          v
            .copy(toSun)
            .multiplyScalar(8)
            .add(new THREE.Vector3(0, 1.3, 0)),
      },
      {
        id: "dn.day",
        text: "Sisi siang",
        priority: 5,
        kind: "note",
        world: (v) =>
          v
            .copy(toSun)
            .multiplyScalar(R * 0.8)
            .add(new THREE.Vector3(0, R * 1.3, 0)),
      },
      {
        id: "dn.night",
        text: "Sisi malam",
        priority: 5,
        kind: "note",
        world: (v) =>
          v
            .copy(toSun)
            .multiplyScalar(-R * 0.8)
            .add(new THREE.Vector3(0, R * 1.3, 0)),
      },
    ],
    occluders: () => [earth.surface],
  };
}

/* ---------------- pelajaran: fase Bulan (+ inset dilihat dari Bumi) ---------------- */

function buildMoonPhases(ctx: EngineCtx, view: LessonView): LessonScene {
  const root = new THREE.Group();
  const S = PHASE_SCENE;
  const toSun = v3(MOON_LESSON_SUN_DIR).normalize();
  const sunPos = toSun.clone().multiplyScalar(S.sunDist);
  const earth = createBody(getObj("earth"), ctx, {
    radius: S.earthR,
    hi: true,
  });
  const moon = createBody(getObj("moon"), ctx, { radius: S.moonR, hi: true });
  const sun = createBody(getObj("sun"), ctx, { radius: 3 });
  sun.orbitAnchor.position.copy(sunPos);
  onHelperLayer(sun.orbitAnchor); // Matahari tidak ikut digambar di inset (tidak menimbulkan kesan gerhana)
  root.add(earth.orbitAnchor, moon.orbitAnchor, sun.orbitAnchor);
  // Satu cahaya berarah dari Matahari: separuh Bulan yang menghadap Matahari selalu terang.
  const light = new THREE.DirectionalLight(0xffffff, 2.8);
  light.position.copy(toSun).multiplyScalar(50);
  root.add(light, new THREE.AmbientLight(0x8899bb, 0.015));
  root.add(onHelperLayer(orbitLine(S.moonDist, 0x8fa3c8, 0.35, 160)));
  root.add(sunRays(toSun, 9, 3.2, 1.3));
  const sight = segment(
    new THREE.Vector3(),
    new THREE.Vector3(1, 0, 0),
    0x52b8a8,
    0.8,
  );
  root.add(onHelperLayer(sight));
  const sightPos = sight.geometry.getAttribute(
    "position",
  ) as THREE.BufferAttribute;

  // Kamera pengamat di permukaan Bumi yang menghadap Bulan; utara ekliptika = atas.
  const eye = new THREE.PerspectiveCamera(18, 1, 0.05, 2000);
  eye.up.set(0, 1, 0);
  const moonPos = new THREE.Vector3();
  let bigInset = false;
  const prevClear = new THREE.Color();
  const size = new THREE.Vector2();

  const insetRect = (w: number, h: number) => {
    if (bigInset) {
      const s = Math.round(Math.min(w, h) * 0.62);
      return { x: Math.round((w - s) / 2), yTop: Math.round((h - s) / 2), s };
    }
    const s = Math.round(Math.max(110, Math.min(210, Math.min(w, h) * 0.3)));
    return { x: 12, yTop: 104, s };
  };

  return {
    root,
    bodies: [earth, moon, sun],
    home: {
      pos: new THREE.Vector3(2.5, 8.5, 8.5),
      target: new THREE.Vector3(0, 0, 0),
      min: 2,
      max: 30,
    },
    update(p, ls) {
      if (p.lesson !== "moon-phases") return;
      bigInset = ls.phaseView === "bumi";
      moonPos.copy(v3(phaseMoonPos(p.moonAngleDeg)));
      moon.orbitAnchor.position.copy(moonPos);
      moon.spin.rotation.y = p.moonAngleDeg * DEG; // rotasi sinkron: sisi yang sama menghadap Bumi
      for (const b of [earth, moon, sun]) b.setSun(sunPos);
      const dir = moonPos.clone().normalize();
      sightPos.setXYZ(0, dir.x * S.earthR, 0, dir.z * S.earthR);
      sightPos.setXYZ(
        1,
        moonPos.x - dir.x * S.moonR,
        0,
        moonPos.z - dir.z * S.moonR,
      );
      sightPos.needsUpdate = true;
      eye.position.copy(dir).multiplyScalar(S.earthR * 1.06);
      eye.lookAt(moonPos);
    },
    afterRender(renderer) {
      renderer.getSize(size);
      const { x, yTop, s } = insetRect(size.x, size.y);
      const y = size.y - yTop - s;
      renderer.getClearColor(prevClear);
      const prevAlpha = renderer.getClearAlpha();
      renderer.setScissorTest(true);
      // bingkai
      renderer.setScissor(x - 2, y - 2, s + 4, s + 4);
      renderer.setViewport(x - 2, y - 2, s + 4, s + 4);
      renderer.setClearColor(0x52b8a8, 1);
      renderer.clear();
      renderer.setScissor(x, y, s, s);
      renderer.setViewport(x, y, s, s);
      renderer.setClearColor(0x03050b, 1);
      eye.aspect = 1;
      eye.updateProjectionMatrix();
      renderer.render(view.scene, eye);
      renderer.setClearColor(prevClear, prevAlpha);
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, size.x, size.y);
    },
    labels: () => {
      const out: LabelSpec[] = [
        {
          id: "mp.earth",
          text: "Bumi",
          priority: 8,
          kind: "object",
          world: (v) => v.set(0, S.earthR + 0.5, 0),
        },
        {
          id: "mp.moon",
          text: "Bulan",
          priority: 9,
          kind: "object",
          world: (v) => v.copy(moonPos).add(new THREE.Vector3(0, 0.6, 0)),
        },
        {
          id: "mp.sun",
          text: "Cahaya Matahari",
          priority: 6,
          kind: "note",
          world: (v) =>
            v
              .copy(toSun)
              .multiplyScalar(9)
              .add(new THREE.Vector3(0, 1.8, 0)),
        },
        {
          id: "mp.inset",
          text: "Dilihat dari Bumi",
          priority: 20,
          kind: "note",
          alwaysVisible: true,
          world: (v) => {
            const { w, h } = view.viewport();
            const r = insetRect(w, h);
            return v
              .set(((r.x + 10) / w) * 2 - 1, -((r.yTop + 12) / h) * 2 + 1, 0.5)
              .unproject(view.camera);
          },
        },
      ];
      for (const [a, text] of [
        [0, "Bulan baru"],
        [90, "Kuartal awal"],
        [180, "Purnama"],
        [270, "Kuartal akhir"],
      ] as const)
        out.push({
          id: `mp.m${a}`,
          text,
          priority: 2,
          kind: "note",
          world: (v) => v.copy(v3(phaseMoonPos(a, S.moonDist + 1.1))),
        });
      return out;
    },
    occluders: () => [earth.surface, moon.surface],
  };
}

/* ---------------- pelajaran: gerhana ---------------- */

function buildEclipses(ctx: EngineCtx): LessonScene {
  const root = new THREE.Group();
  const g = SCENE_ECLIPSE_GEOM;
  const sunPos = v3(eclipseSunPos(g));
  const earth = createBody(getObj("earth"), ctx, {
    radius: g.earthR,
    hi: true,
  });
  const moon = createBody(getObj("moon"), ctx, { radius: g.moonR, hi: true });
  const sun = createBody(getObj("sun"), ctx, { radius: g.sunR });
  sun.orbitAnchor.position.copy(sunPos);
  root.add(earth.orbitAnchor, moon.orbitAnchor, sun.orbitAnchor);
  root.add(
    new THREE.PointLight(0xffffff, 3, 0, 0).translateX(sunPos.x),
    new THREE.AmbientLight(0x8899bb, 0.008),
  );
  root.add(sunRays(sunPos.clone().normalize(), 10, 3, 1.4));

  // Bayangan dihitung dari geometri Matahari–Bumi–Bulan di scene (umbra & penumbra lembut).
  const moonPos = new THREE.Vector3();
  const onEarth = {
    uEclSun: { value: sunPos },
    uEclSunR: { value: g.sunR },
    uEclOcc: { value: moonPos },
    uEclOccR: { value: g.moonR },
  };
  const onMoon = {
    uEclSun: { value: sunPos },
    uEclSunR: { value: g.sunR },
    uEclOcc: { value: new THREE.Vector3() },
    uEclOccR: { value: g.earthR },
  };
  patchEclipseShadow(
    earth.surface.material as THREE.Material,
    onEarth,
    0,
    "earth",
  );
  if (earth.clouds)
    patchEclipseShadow(
      earth.clouds.material as THREE.Material,
      onEarth,
      0,
      "clouds",
    );
  patchEclipseShadow(
    moon.surface.material as THREE.Material,
    onMoon,
    1,
    "moon",
  );

  // Bidang orbit Bumi (ekliptika) & orbit Bulan yang miring.
  const plane = new THREE.Mesh(
    new THREE.CircleGeometry(8.5, 96),
    new THREE.MeshBasicMaterial({
      color: 0x6f86b8,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  plane.rotation.x = -Math.PI / 2;
  root.add(onHelperLayer(plane));
  const moonOrbit = new THREE.Group();
  moonOrbit.add(orbitLine(g.moonDist, 0x8fa3c8, 0.55, 160));
  const nodeA = dot3(0.07, 0xffd27a);
  const nodeB = dot3(0.07, 0xffd27a);
  root.add(
    onHelperLayer(moonOrbit),
    onHelperLayer(nodeA),
    onHelperLayer(nodeB),
  );

  // Diagram kerucut bayangan (berlabel): umbra = bayangan inti, penumbra = bayangan kabur.
  const LEN = 9;
  const eR = shadowRadii(g.sunR, g.sunDist, g.earthR, LEN);
  const earthUmbra = shadowCone(g.earthR, eR.umbra, LEN, 0x8a6bff, 0.26);
  const earthPen = shadowCone(g.earthR, eR.penumbra, LEN, 0x9fb4ff, 0.08);
  const mR = shadowRadii(g.sunR, g.sunDist, g.moonR, 7);
  const moonUmbra = shadowCone(g.moonR, 0, mR.umbraLength, 0x8a6bff, 0.3);
  const moonPen = shadowCone(g.moonR, mR.penumbra, 7, 0x9fb4ff, 0.09);
  const earthAxis = new THREE.Vector3().sub(sunPos).normalize();
  const upY = new THREE.Vector3(0, 1, 0);
  for (const c of [earthUmbra, earthPen])
    c.quaternion.setFromUnitVectors(upY, earthAxis);
  root.add(
    onHelperLayer(earthUmbra),
    onHelperLayer(earthPen),
    onHelperLayer(moonUmbra),
    onHelperLayer(moonPen),
  );
  const moonAxis = new THREE.Vector3();
  let nodeDeg = 0;

  return {
    root,
    bodies: [earth, moon, sun],
    home: {
      pos: new THREE.Vector3(4, 10.5, 19.5),
      target: new THREE.Vector3(-1, 0, 0),
      min: 2,
      max: 60,
    },
    update(p) {
      if (p.lesson !== "eclipses") return;
      nodeDeg = p.nodeDeg;
      moonPos.copy(v3(eclipseMoonPos(g, p.moonAngleDeg, p.nodeDeg)));
      moon.orbitAnchor.position.copy(moonPos);
      moon.spin.rotation.y = Math.atan2(moonPos.z, -moonPos.x); // sisi yang sama menghadap Bumi
      const nodeDir = v3(rotY(MOON_LESSON_SUN_DIR, p.nodeDeg));
      moonOrbit.quaternion.setFromAxisAngle(nodeDir, g.inclinationDeg * DEG);
      nodeA.position.copy(nodeDir).multiplyScalar(g.moonDist);
      nodeB.position.copy(nodeDir).multiplyScalar(-g.moonDist);
      moonAxis.copy(moonPos).sub(sunPos).normalize();
      for (const c of [moonUmbra, moonPen]) {
        c.position.copy(moonPos);
        c.quaternion.setFromUnitVectors(upY, moonAxis);
      }
      for (const b of [earth, moon, sun]) b.setSun(sunPos);
    },
    labels: () => [
      {
        id: "ec.earth",
        text: "Bumi",
        priority: 8,
        kind: "object",
        world: (v) => v.set(0, g.earthR + 0.45, 0),
      },
      {
        id: "ec.moon",
        text: "Bulan",
        priority: 9,
        kind: "object",
        world: (v) => v.copy(moonPos).add(new THREE.Vector3(0, 0.5, 0)),
      },
      {
        id: "ec.sun",
        text: "Cahaya Matahari",
        priority: 6,
        kind: "note",
        world: (v) => v.set(-9, 2, 0),
      },
      {
        id: "ec.eu",
        text: "Umbra Bumi",
        priority: 5,
        kind: "part",
        world: (v) =>
          v
            .copy(earthAxis)
            .multiplyScalar(8)
            .add(new THREE.Vector3(0, 0.2, 0)),
      },
      {
        id: "ec.ep",
        text: "Penumbra Bumi",
        priority: 4,
        kind: "note",
        world: (v) =>
          v
            .copy(earthAxis)
            .multiplyScalar(8.5)
            .add(new THREE.Vector3(0, 1.5, 0)),
      },
      {
        id: "ec.mu",
        text: "Umbra Bulan",
        priority: 5,
        kind: "part",
        world: (v) =>
          v
            .copy(moonAxis)
            .multiplyScalar(2.2)
            .add(moonPos)
            .add(new THREE.Vector3(0, 0.25, 0)),
      },
      {
        id: "ec.mp",
        text: "Penumbra Bulan",
        priority: 4,
        kind: "note",
        world: (v) =>
          v
            .copy(moonAxis)
            .multiplyScalar(3)
            .add(moonPos)
            .add(new THREE.Vector3(0, -0.6, 0)),
      },
      {
        id: "ec.plane",
        text: "Bidang orbit Bumi",
        priority: 2,
        kind: "note",
        world: (v) => v.set(-2, 0, 7.8),
      },
      {
        id: "ec.node",
        text: "Simpul orbit Bulan",
        priority: 3,
        kind: "note",
        world: (v) =>
          v
            .copy(v3(rotY(MOON_LESSON_SUN_DIR, nodeDeg + 180)))
            .multiplyScalar(g.moonDist)
            .add(new THREE.Vector3(0, -0.35, 0)),
      },
    ],
    occluders: () => [earth.surface, moon.surface],
  };
}

/* ---------------- pelajaran: kemiringan sumbu & musim ---------------- */

function buildSeasons(ctx: EngineCtx): LessonScene {
  const root = new THREE.Group();
  const ORBIT_R = 8;
  const R = 0.9;
  const sun = createBody(getObj("sun"), ctx, { radius: 1.8 });
  const earth = createBody(getObj("earth"), ctx, { radius: R, hi: true });
  root.add(sun.orbitAnchor, earth.orbitAnchor);
  root.add(
    new THREE.PointLight(0xfff4e6, 3.2, 0, 0),
    new THREE.AmbientLight(0x8899bb, 0.03),
  );
  root.add(onHelperLayer(orbitLine(ORBIT_R, 0x6f86b8, 0.35)));
  earth.spin.rotation.y = -Math.PI / 2; // tampilkan Asia–Australia menghadap kamera awal (ilustratif, tidak berputar)
  earth.axisFrame.add(onHelperLayer(axisLine(R)));
  earth.axisFrame.add(onHelperLayer(orbitLine(R * 1.012, 0xffffff, 0.45, 96))); // ekuator
  const subsolarRing = orbitLine(1, 0xff7f67, 0.95, 96);
  earth.axisFrame.add(onHelperLayer(subsolarRing));
  const subsolarDot = dot3(0.06, 0xff7f67);
  earth.orbitAnchor.add(subsolarDot);

  // Empat posisi bayangan dengan sumbu yang arahnya SAMA (sumbu tidak menoleh ke Matahari).
  const axisDir = v3(seasonPose(0).axis);
  const ghostMat = new THREE.MeshBasicMaterial({
    color: 0x7e93c0,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const ghostGeo = new THREE.SphereGeometry(R * 0.35, 20, 14);
  const ghosts = SEASON_MARKS.map((m) => {
    const pos = v3(seasonPose(m.angle).earthDir).multiplyScalar(ORBIT_R);
    const g = new THREE.Group();
    g.position.copy(pos);
    g.add(new THREE.Mesh(ghostGeo, ghostMat));
    g.add(
      segment(
        axisDir.clone().multiplyScalar(-R * 0.75),
        axisDir.clone().multiplyScalar(R * 0.75),
        0x52b8a8,
        0.9,
      ),
    );
    root.add(onHelperLayer(g));
    return { pos, label: m.label, angle: m.angle };
  });
  const origin = new THREE.Vector3();
  let month = "";

  return {
    root,
    bodies: [sun, earth],
    home: {
      pos: new THREE.Vector3(0, 23, 23),
      target: new THREE.Vector3(0, 0, 0),
      min: 3,
      max: 45,
    },
    update(p) {
      if (p.lesson !== "seasons") return;
      const s = p.season;
      earth.orbitAnchor.position.copy(v3(s.earthDir)).multiplyScalar(ORBIT_R);
      const d = s.subsolarLatDeg * DEG;
      subsolarRing.scale.setScalar(R * 1.015 * Math.cos(d));
      subsolarRing.position.y = R * 1.015 * Math.sin(d);
      subsolarDot.position.copy(v3(s.sunDir)).multiplyScalar(R * 1.03);
      month = s.month;
      sun.setSun(origin);
      earth.setSun(origin);
    },
    labels: () => [
      {
        id: "se.sun",
        text: "Matahari",
        priority: 7,
        kind: "object",
        world: (v) => v.set(0, 2.4, 0),
      },
      {
        id: "se.earth",
        text: `Bumi · sekitar ${month}`,
        priority: 10,
        kind: "object",
        world: (v) =>
          earth.orbitAnchor
            .getWorldPosition(v)
            .add(new THREE.Vector3(0, R * 2.2, 0)),
      },
      {
        id: "se.pole",
        text: "Kutub Utara",
        priority: 8,
        kind: "note",
        world: (v) => earth.axisFrame.localToWorld(v.set(0, R * 1.65, 0)),
      },
      {
        id: "se.sub",
        text: "Sinar paling tegak",
        priority: 9,
        kind: "part",
        world: (v) => subsolarDot.getWorldPosition(v),
      },
      ...ghosts.map((gh): LabelSpec => ({
        id: `se.g${gh.angle}`,
        text: gh.label,
        priority: 3,
        kind: "note",
        world: (v) =>
          v
            .copy(gh.pos)
            .multiplyScalar(1.12)
            .add(new THREE.Vector3(0, -0.6, 0)),
      })),
    ],
    occluders: () => [sun.surface, earth.surface],
  };
}

/* ---------------- view ---------------- */

export class LessonView implements ModeView {
  name = "lesson";
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, 0.02, 2000);
  controlsConfig = { minDistance: 2, maxDistance: 60, enablePan: false };
  private ctx!: EngineCtx;
  private clock = new LessonClock();
  private cur: LessonScene | null = null;
  private curLesson: LessonId | null = null;
  private ls: LessonState = LESSON_DEFAULT;
  private playing = false;
  private appliedNonce = -1;
  private baseKey = "";
  private w = 1;
  private h = 1;

  constructor() {
    this.camera.layers.enable(HELPER_LAYER);
  }

  start(ctx: EngineCtx) {
    this.ctx = ctx;
    this.scene.add(starfield());
  }

  /** Waktu lokal pelajaran (detik nyata sejak Reset / sejak kontrol terakhir digeser). Dibaca panel. */
  time(): LessonTime {
    return { orbitSec: this.clock.orbitSec, spinSec: this.clock.spinSec };
  }

  lesson() {
    return this.curLesson;
  }

  viewport() {
    return { w: this.w, h: this.h };
  }

  onResize(w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  private build(l: LessonId) {
    this.teardown();
    const b =
      l === "rotation-revolution"
        ? buildRotRev(this.ctx)
        : l === "day-night"
          ? buildDayNight(this.ctx)
          : l === "moon-phases"
            ? buildMoonPhases(this.ctx, this)
            : l === "eclipses"
              ? buildEclipses(this.ctx)
              : buildSeasons(this.ctx);
    this.cur = b;
    this.curLesson = l;
    this.scene.add(b.root);
    this.home();
  }

  private home() {
    if (!this.cur) return;
    const h = this.cur.home;
    const c = this.ctx.controls;
    c.minDistance = h.min;
    c.maxDistance = h.max;
    void this.ctx.flyTo(h.pos, h.target, 0);
  }

  private teardown() {
    if (!this.cur) return;
    this.scene.remove(this.cur.root);
    for (const b of this.cur.bodies) b.dispose();
    disposeTree(this.cur.root);
    this.cur = null;
  }

  apply(st: AngkasaState) {
    this.playing = st.playing;
    this.ls = st.lessonState;
    const ls = st.lessonState;
    const key = `${ls.moonAngle}|${ls.eclipsePreset}|${ls.earthOrbitAngle}|${ls.earthSpin}`;
    if (st.lesson !== this.curLesson) {
      this.build(st.lesson);
      this.clock.reset();
    } else if (st.resetNonce !== this.appliedNonce) {
      this.clock.reset();
      this.home();
    } else if (key !== this.baseKey) {
      // kontrol digeser: pose baru = nilai kontrol; waktu lokal mulai lagi dari 0 (tanpa lompatan)
      this.clock.reset();
    }
    this.appliedNonce = st.resetNonce;
    this.baseKey = key;
    this.pose();
  }

  private pose() {
    if (!this.cur || !this.curLesson) return;
    this.cur.update(lessonPose(this.curLesson, this.ls, this.time()), this.ls);
  }

  update(dt: number) {
    const rr = this.curLesson === "rotation-revolution";
    this.clock.tick(
      dt,
      this.playing,
      rr ? this.ls.orbitOn : true,
      rr ? this.ls.spinOn : true,
    );
    this.pose();
  }

  afterRender(renderer: THREE.WebGLRenderer) {
    this.cur?.afterRender?.(renderer);
  }

  scaleNote(st: AngkasaState) {
    return lessonScaleNote(st.lesson);
  }

  pickables() {
    return [];
  }

  occluders() {
    return this.cur?.occluders() ?? [];
  }

  labels(): LabelSpec[] {
    return this.cur?.labels() ?? [];
  }

  dispose() {
    this.teardown();
    disposeTree(this.scene);
    this.scene.clear();
  }
}
