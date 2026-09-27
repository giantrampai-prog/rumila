// Pembuat benda langit: globe prosedural bertekstur (UV equirectangular), sumbu miring, bentuk pepat,
// awan/atmosfer/lampu malam Bumi, cincin Saturnus beranulus dengan bayangan dua arah, Matahari emisif,
// serta objek prosedural berlabel ilustrasi (Titan, Pluto, contoh asteroid, contoh komet).
//
// Hierarki (instruksi §2): orbitAnchor → axisFrame (kemiringan, arah tetap) → spin (putaran harian).
// Satelit & cincin TIDAK menjadi anak dari mesh yang berputar harian.

import * as THREE from "three";
import type { AngkasaObject } from "@/lib/angkasa/types";
import type { EngineCtx } from "./core";

const DEG = Math.PI / 180;

export interface Body {
  id: string;
  obj: AngkasaObject;
  /** diposisikan oleh view (orbit) */
  orbitAnchor: THREE.Group;
  /** kemiringan sumbu (arah tetap terhadap kerangka acuan) */
  axisFrame: THREE.Group;
  /** putaran pada sumbu */
  spin: THREE.Group;
  surface: THREE.Mesh;
  radius: number;
  /** radius terluar termasuk cincin (untuk framing kamera) */
  frameRadius: number;
  clouds?: THREE.Mesh;
  atmosphere?: THREE.Mesh;
  rings?: THREE.Mesh;
  proxy: THREE.Mesh;
  /** peta warna permukaan sudah tampil (bukan bola polos) */
  mapReady?: boolean;
  /** perbarui arah/posisi Matahari (dunia) untuk shader */
  setSun(world: THREE.Vector3): void;
  /** muat tekstur detail 2K (lazy) */
  loadDetail(ctx: EngineCtx): Promise<void>;
  /** ganti tampilan Venus: "awan" | "radar" */
  setVariant?(v: string, ctx: EngineCtx): Promise<void>;
  dispose(): void;
}

/* ---------------- tekstur prosedural (deterministik) ---------------- */

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function canvasTex(
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Titan: kabut jingga dengan pita samar — ILUSTRASI (permukaan tertutup kabut). */
function titanTexture() {
  return canvasTex(512, 256, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#b8783a");
    grad.addColorStop(0.5, "#d99a4a");
    grad.addColorStop(1, "#a86a33");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    const r = rng(7);
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(255,220,160,${0.03 + r() * 0.05})`;
      g.fillRect(0, r() * h, w, 2 + r() * 8);
    }
  });
}

/** Pluto: dataran terang berbentuk hati & wilayah gelap di ekuator — ILUSTRASI menyerupai citra New Horizons secara umum. */
function plutoTexture() {
  return canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = "#c9b29a";
    g.fillRect(0, 0, w, h);
    const r = rng(11);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(${90 + r() * 60},${60 + r() * 40},${40 + r() * 30},${0.08 + r() * 0.12})`;
      g.beginPath();
      g.arc(r() * w, h * 0.35 + r() * h * 0.3, 2 + r() * 8, 0, Math.PI * 2);
      g.fill();
    }
    // wilayah terang berbentuk hati (ilustratif)
    g.fillStyle = "rgba(245,236,222,0.92)";
    const cx = w * 0.55,
      cy = h * 0.52,
      s = h * 0.18;
    g.beginPath();
    g.moveTo(cx, cy + s * 1.1);
    g.bezierCurveTo(
      cx - s * 1.6,
      cy,
      cx - s * 0.9,
      cy - s * 1.1,
      cx,
      cy - s * 0.35,
    );
    g.bezierCurveTo(
      cx + s * 0.9,
      cy - s * 1.1,
      cx + s * 1.6,
      cy,
      cx,
      cy + s * 1.1,
    );
    g.fill();
  });
}

function rockTexture(seed: number, base = [128, 120, 110]) {
  return canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = `rgb(${base.join(",")})`;
    g.fillRect(0, 0, w, h);
    const r = rng(seed);
    for (let i = 0; i < 500; i++) {
      const v = r() * 60 - 30;
      g.fillStyle = `rgba(${base[0] + v},${base[1] + v},${base[2] + v},0.5)`;
      g.beginPath();
      g.arc(r() * w, r() * h, 1 + r() * 5, 0, Math.PI * 2);
      g.fill();
    }
  });
}

/** Geometri tak beraturan (asteroid/inti komet) dari icosahedron yang diganggu secara deterministik. */
export function lumpyGeometry(seed: number, amount = 0.35, detail = 3) {
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const r = rng(seed);
  const bumps = Array.from({ length: 7 }, () => ({
    d: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(),
    a: (r() - 0.4) * amount,
  }));
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let k = 1;
    for (const b of bumps) k += b.a * Math.max(0, v.dot(b.d)) ** 3;
    k *=
      1 +
      Math.sin(v.x * 9 + seed) * Math.sin(v.y * 7) * Math.sin(v.z * 8) * 0.04;
    v.multiplyScalar(k);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/* ---------------- shader tambahan ---------------- */

/**
 * Lampu malam Bumi hanya tampak di sisi malam: emissive dikalikan faktor (1 - terang),
 * dihitung dari arah Matahari saat render (bukan dipanggang ke tekstur).
 */
function patchNightLights(
  mat: THREE.MeshStandardMaterial,
  sunWorld: { value: THREE.Vector3 },
) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uSunWorld = sunWorld;
    sh.vertexShader = sh.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vWorldNormalN;\nvarying vec3 vWorldPosN;",
      )
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvWorldNormalN = normalize(mat3(modelMatrix) * objectNormal);\nvWorldPosN = (modelMatrix * vec4(transformed,1.0)).xyz;",
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec3 uSunWorld;\nvarying vec3 vWorldNormalN;\nvarying vec3 vWorldPosN;",
      )
      .replace(
        "#include <roughnessmap_fragment>",
        // Laut memantulkan Matahari (kilau), daratan & awan tetap kusam: laut dikenali dari warna peta (biru gelap).
        `#include <roughnessmap_fragment>
         float oceanMask = smoothstep(0.02, 0.10, diffuseColor.b - max(diffuseColor.r, diffuseColor.g * 0.9)) * (1.0 - smoothstep(0.35, 0.6, diffuseColor.g));
         roughnessFactor = mix(roughnessFactor, 0.32, oceanMask);`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
         float lit = dot(normalize(vWorldNormalN), normalize(uSunWorld - vWorldPosN));
         totalEmissiveRadiance *= smoothstep(0.15, -0.2, lit);`,
      );
  };
}

/**
 * Permukaan Matahari hidup: peta citra dicampur dua kali dengan geseran berlawanan (plasma bergolak), bintik
 * granulasi halus berdenyut, dan tepi lebih gelap (limb darkening) seperti foto Matahari sungguhan.
 */
/** benda berbatu yang diberi relief (kekuatan bump) */
const BUMPY: Record<string, number> = { mercury: 2.2, moon: 2.2, mars: 1.4, pluto: 1 };

function patchSunSurface(mat: THREE.MeshBasicMaterial, time: { value: number }) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = time;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vLimb;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLimb = abs(normalize(normalMatrix * normal).z);");
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform float uTime;
         varying float vLimb;
         float sunHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
         float sunNoise(vec2 p) {
           vec2 i = floor(p), f = fract(p);
           f = f * f * (3.0 - 2.0 * f);
           return mix(mix(sunHash(i), sunHash(i + vec2(1.0, 0.0)), f.x), mix(sunHash(i + vec2(0.0, 1.0)), sunHash(i + vec2(1.0, 1.0)), f.x), f.y);
         }`,
      )
      .replace(
        "#include <map_fragment>",
        `#ifdef USE_MAP
           vec2 uvA = vec2(vMapUv.x + uTime * 0.0021, clamp(vMapUv.y + sin(uTime * 0.05) * 0.002, 0.001, 0.999));
           // lapisan kedua: hanya arah bujur yang diskalakan (2×, bulat → tanpa sambungan; peta diulang di arah itu).
           // Arah lintang tidak boleh keluar 0..1: di luar itu tepi peta "meleleh" menjadi garis-garis.
           vec2 uvB = vec2(vMapUv.x * 2.0 - uTime * 0.0016, clamp(vMapUv.y + sin(uTime * 0.03) * 0.004, 0.001, 0.999));
           vec4 a = texture2D(map, uvA);
           vec4 b = texture2D(map, uvB);
           vec4 sampledDiffuseColor = mix(a, b, 0.4);
           // granulasi: sel-sel konveksi kecil (derau nilai 2 oktaf, berdenyut pelan), bukan pola garis
           vec2 gp = vMapUv * vec2(520.0, 260.0);
           float gran = mix(sunNoise(gp + uTime * 0.15), sunNoise(gp * 2.1 - uTime * 0.23), 0.4);
           sampledDiffuseColor.rgb *= 0.86 + 0.26 * gran;
           diffuseColor *= sampledDiffuseColor;
         #endif
         // limb darkening: tepi piringan lebih gelap & lebih jingga
         diffuseColor.rgb *= mix(vec3(0.6, 0.36, 0.15), vec3(1.12, 1.05, 0.96), pow(vLimb, 0.5));`,
      );
  };
}

/** Atmosfer: pendar tepi (fresnel) yang hanya kuat di sisi siang — batas bukan tepi fisik yang tajam. */
export function atmosphereMaterial(
  color: THREE.Color,
  sunWorld: { value: THREE.Vector3 },
  strength = 1,
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uSunWorld: sunWorld,
      uStrength: { value: strength },
    },
    vertexShader: `varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform vec3 uColor; uniform vec3 uSunWorld; uniform float uStrength; varying vec3 vN; varying vec3 vW;
      void main(){ vec3 V = normalize(cameraPosition - vW); float d = max(dot(normalize(vN), V), 0.0);
        // paling terang tepat di tepi planet, memudar lembut ke luar (tanpa garis tepi cangkang yang tajam)
        float fr = pow(1.0 - d, 2.6) * smoothstep(0.0, 0.26, d);
        float day = smoothstep(-0.25, 0.4, dot(normalize(vN), normalize(uSunWorld - vW)));
        gl_FragColor = vec4(uColor, fr * day * 0.9 * uStrength); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
  });
}

/**
 * Bayangan cincin di planet: dari titik permukaan ke Matahari, hitung perpotongan dengan bidang cincin
 * dan ambil opasitas cincin pada radius itu.
 */
function patchRingShadowOnPlanet(
  mat: THREE.MeshStandardMaterial,
  u: {
    uSunWorld: { value: THREE.Vector3 };
    uRingNormal: { value: THREE.Vector3 };
    uCenter: { value: THREE.Vector3 };
    uInner: { value: number };
    uOuter: { value: number };
    uRingTex: { value: THREE.Texture | null };
  },
) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vWorldPosR;",
      )
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvWorldPosR = (modelMatrix * vec4(transformed,1.0)).xyz;",
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec3 uSunWorld; uniform vec3 uRingNormal; uniform vec3 uCenter; uniform float uInner; uniform float uOuter; uniform sampler2D uRingTex; varying vec3 vWorldPosR;",
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
         vec3 L = normalize(uSunWorld - vWorldPosR);
         float denom = dot(L, uRingNormal);
         if (abs(denom) > 1e-4) {
           float t = dot(uCenter - vWorldPosR, uRingNormal) / denom;
           if (t > 0.0) {
             vec3 hit = vWorldPosR + L * t;
             float r = length(hit - uCenter);
             if (r > uInner && r < uOuter) {
               float a = texture2D(uRingTex, vec2((r - uInner) / (uOuter - uInner), 0.5)).a;
               gl_FragColor.rgb *= 1.0 - a * 0.75;
             }
           }
         }`,
      );
  };
}

/** Material cincin: tekstur radial (warna+alpha), bayangan planet di cincin, dua sisi, cahaya sisi depan/belakang. */
function ringMaterial(
  tex: THREE.Texture | null,
  u: {
    uSunWorld: { value: THREE.Vector3 };
    uCenter: { value: THREE.Vector3 };
    uPlanetR: { value: number };
  },
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTex: { value: tex },
      uHasTex: { value: tex ? 1 : 0 },
      ...u,
      uRingN: { value: new THREE.Vector3(0, 1, 0) },
    },
    vertexShader: `varying vec2 vUv; varying vec3 vW; varying vec3 vN; void main(){ vUv = uv; vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix)*vec3(0.0,0.0,1.0)); gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform sampler2D uTex; uniform float uHasTex; uniform vec3 uSunWorld; uniform vec3 uCenter; uniform float uPlanetR; varying vec2 vUv; varying vec3 vW; varying vec3 vN;
      void main(){
        vec4 c = uHasTex > 0.5 ? texture2D(uTex, vec2(vUv.x, 0.5)) : vec4(0.85,0.8,0.7, 0.7);
        if (c.a < 0.02) discard;
        vec3 L = normalize(uSunWorld - vW);
        // bayangan planet: sinar dari titik cincin ke Matahari memotong bola planet?
        vec3 oc = vW - uCenter; float b = dot(oc, L); float cc = dot(oc,oc) - uPlanetR*uPlanetR; float disc = b*b - cc;
        float shadow = (disc > 0.0 && -b - sqrt(disc) > 0.0) ? 0.12 : 1.0;
        // sisi tak tersinari (dilihat dari bawah bidang yang tidak kena Matahari) lebih redup: cahaya tembus
        vec3 V = normalize(cameraPosition - vW);
        float sameSide = sign(dot(vN, L)) * sign(dot(vN, V));
        float lit = sameSide > 0.0 ? 1.0 : 0.45;
        gl_FragColor = vec4(c.rgb * shadow * lit, c.a * 0.95);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

/** RingGeometry dengan UV radial: u = 0 di tepi dalam → 1 di tepi luar. */
function annulus(inner: number, outer: number, segs = 180) {
  const geo = new THREE.RingGeometry(inner, outer, segs, 1);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
  }
  return geo;
}

/** "/angkasa/tex/2k_x.jpg" → "/angkasa/lo/lo_x.jpg" (versi 1K untuk paket pembuka). */
const loOf = (url: string) =>
  url.replace("/angkasa/tex/2k_", "/angkasa/lo/lo_");

/* ---------------- pembuat Body ---------------- */

export interface BodyOptions {
  radius: number;
  /** segmen bola */
  segments?: number;
  /** tampilkan atmosfer, awan, dll. */
  detailLayers?: boolean;
  /** pakai tekstur hi langsung */
  hi?: boolean;
}

export function createBody(
  o: AngkasaObject,
  ctx: EngineCtx,
  opt: BodyOptions,
): Body {
  const orbitAnchor = new THREE.Group();
  orbitAnchor.name = `${o.id}.orbit`;
  const axisFrame = new THREE.Group();
  axisFrame.name = `${o.id}.axis`;
  // Kemiringan sumbu: diputar pada sumbu Z kerangka orbit → arah sumbu tetap di ruang (tidak menoleh ke Matahari).
  axisFrame.rotation.z = -(o.spinModel?.tilt ?? 0) * DEG;
  const spin = new THREE.Group();
  spin.name = `${o.id}.spin`;
  orbitAnchor.add(axisFrame);
  axisFrame.add(spin);

  const r = opt.radius;
  const segs = opt.segments ?? (ctx.lowPower ? 48 : 72);
  const sunWorld = { value: new THREE.Vector3() };
  const disposables: { dispose(): void }[] = [];

  let geo: THREE.BufferGeometry;
  if (o.texture.procedural === "asteroid")
    geo = lumpyGeometry(23, 0.45, ctx.lowPower ? 2 : 3);
  else if (o.texture.procedural === "comet") geo = lumpyGeometry(41, 0.55, 2);
  else geo = new THREE.SphereGeometry(1, segs, Math.round(segs * 0.66));
  disposables.push(geo);

  let mat: THREE.Material;
  let sunTimeRef: { value: number } | null = null;
  if (o.id === "sun") {
    mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sunTime = { value: 0 };
    patchSunSurface(mat as THREE.MeshBasicMaterial, sunTime);
    sunTimeRef = sunTime;
  } else {
    mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(o.texture.base),
      roughness: o.classification.startsWith("Raksasa") ? 0.95 : 0.9,
      metalness: 0,
    });
  }
  disposables.push(mat);
  const surface = new THREE.Mesh(geo, mat);
  surface.name = `${o.id}.surface`;
  if (sunTimeRef) {
    const t = sunTimeRef;
    surface.onBeforeRender = () => (t.value = performance.now() / 1000);
  }
  surface.userData.pickId = o.id;
  surface.scale.setScalar(r);
  if (o.flattening) surface.scale.y = r * (1 - o.flattening);
  spin.add(surface);

  // Tekstur prosedural (ilustrasi)
  const std = mat as THREE.MeshStandardMaterial;
  if (o.texture.procedural === "titan") std.map = titanTexture();
  if (o.texture.procedural === "pluto") std.map = plutoTexture();
  if (o.texture.procedural === "asteroid") std.map = rockTexture(5);
  if (o.texture.procedural === "comet") std.map = rockTexture(9, [80, 76, 72]);
  if (std.map) {
    disposables.push(std.map);
    std.color.set(0xffffff);
  }

  const body: Body = {
    id: o.id,
    obj: o,
    orbitAnchor,
    axisFrame,
    spin,
    surface,
    radius: r,
    frameRadius: r,
    proxy: null as unknown as THREE.Mesh,
    setSun(w) {
      sunWorld.value.copy(w);
      for (const u of sunUniformTargets) u.value.copy(w);
    },
    async loadDetail() {},
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
  const sunUniformTargets: { value: THREE.Vector3 }[] = [];

  // Tekstur peta: lo dulu (ringan), hi saat didekati (lazy).
  const applyMap = async (url: string) => {
    const t = await ctx.loadTexture(url);
    if (o.id === "sun") {
      t.wrapS = THREE.RepeatWrapping; // permukaan bergeser memutar (lihat patchSunSurface)
      t.needsUpdate = true;
      (mat as THREE.MeshBasicMaterial).map = t;
    }
    else {
      std.map = t;
      // Relief permukaan berbatu (kawah, lembah) dari terang-gelap peta warna: terlihat di dekat terminator.
      if (BUMPY[o.id]) {
        std.bumpMap = t;
        std.bumpScale = BUMPY[o.id];
      }
    }
    (mat as THREE.MeshStandardMaterial).color?.set(0xffffff);
    mat.needsUpdate = true;
    body.mapReady = true;
  };
  const lo = opt.hi ? o.texture.hi : o.texture.lo;
  if (lo) applyMap(lo).catch(() => {});
  let detailLoaded = !!opt.hi;
  /** lapisan tambahan yang juga punya versi detail (awan/malam Bumi) */
  const detailExtras: (() => Promise<void>)[] = [];
  body.loadDetail = async () => {
    if (detailLoaded || !o.texture.hi) return;
    detailLoaded = true;
    try {
      await Promise.all([
        applyMap(o.texture.hi),
        ...detailExtras.map((f) => f()),
      ]);
    } catch (e) {
      detailLoaded = false;
      throw e;
    }
  };

  // Venus: dua jenis citra (awan vs radar permukaan), dicatat sebagai varian.
  if (o.texture.alt) {
    body.setVariant = async (v) => {
      await applyMap(
        v === "radar" ? o.texture.alt! : (o.texture.hi ?? o.texture.lo!),
      );
    };
  }

  // Matahari: pendar terbatas (sprite aditif) — tidak menutupi orbit/label.
  if (o.id === "sun") {
    const glowTex = canvasTex(128, 128, (g, w, h) => {
      const grad = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      grad.addColorStop(0, "rgba(255,210,120,0.9)");
      grad.addColorStop(0.25, "rgba(255,170,60,0.35)");
      grad.addColorStop(1, "rgba(255,140,40,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
    });
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      }),
    );
    glow.scale.setScalar(r * 4.2);
    glow.renderOrder = -1;
    axisFrame.add(glow);
    disposables.push(glowTex, glow.material);
  }

  // Bumi: awan, lampu malam, atmosfer — lapisan terpisah yang dapat dikendalikan.
  if (o.id === "earth" && opt.detailLayers !== false) {
    if (o.texture.night) {
      const night = o.texture.night;
      const setNight = (url: string) =>
        ctx.loadTexture(url).then((t) => {
          std.emissiveMap = t;
          std.emissive = new THREE.Color(0xffd9a0);
          std.emissiveIntensity = 1.1;
          std.needsUpdate = true;
        });
      setNight(opt.hi ? night : loOf(night)).catch(() => {});
      if (!opt.hi) detailExtras.push(() => setNight(night));
      patchNightLights(std, sunWorld);
    }
    if (o.texture.clouds) {
      const cGeo = new THREE.SphereGeometry(
        1.012,
        segs,
        Math.round(segs * 0.66),
      );
      const cMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        roughness: 1,
      });
      const clouds = new THREE.Mesh(cGeo, cMat);
      clouds.visible = false; // tanpa peta awan, lapisan ini hanya bola putih: tampil setelah peta dimuat
      const cloudsUrl = o.texture.clouds;
      const setClouds = (url: string) =>
        ctx.loadTexture(url, { color: false }).then((t) => {
          cMat.alphaMap = t;
          cMat.needsUpdate = true;
          clouds.visible = true;
        });
      setClouds(opt.hi ? cloudsUrl : loOf(cloudsUrl)).catch(() => {});
      if (!opt.hi) detailExtras.push(() => setClouds(cloudsUrl));
      clouds.name = "earth.clouds";
      clouds.scale.setScalar(r);
      spin.add(clouds);
      body.clouds = clouds;
      disposables.push(cGeo, cMat);
    }
    const aGeo = new THREE.SphereGeometry(1.045, segs, Math.round(segs * 0.66));
    const aUniform = { value: new THREE.Vector3() };
    sunUniformTargets.push(aUniform);
    const aMat = atmosphereMaterial(new THREE.Color(0x7db6ff), aUniform, 1.25);
    const atm = new THREE.Mesh(aGeo, aMat);
    atm.name = "earth.atmosphere";
    atm.scale.setScalar(r);
    axisFrame.add(atm);
    body.atmosphere = atm;
    disposables.push(aGeo, aMat);
  }
  if ((o.id === "venus" || o.id === "titan") && opt.detailLayers !== false) {
    const aGeo = new THREE.SphereGeometry(1.03, segs, Math.round(segs * 0.66));
    const aUniform = { value: new THREE.Vector3() };
    sunUniformTargets.push(aUniform);
    const aMat = atmosphereMaterial(
      new THREE.Color(o.id === "venus" ? 0xffe2a8 : 0xffb060),
      aUniform,
      0.8,
    );
    const atm = new THREE.Mesh(aGeo, aMat);
    atm.scale.setScalar(r);
    axisFrame.add(atm);
    body.atmosphere = atm;
    disposables.push(aGeo, aMat);
  }

  // Saturnus: cincin annular di bidang ekuator (ikut kerangka sumbu, bukan putaran awan).
  if (o.id === "saturn") {
    const eqR = o.equatorialRadius?.value ?? 60250;
    const inner = (74500 / eqR) * r;
    const outer = (140220 / eqR) * r; // tepi luar tekstur cincin (sampai cincin F, perkiraan)
    const center = { value: new THREE.Vector3() };
    const ringU = {
      uSunWorld: { value: new THREE.Vector3() },
      uCenter: center,
      uPlanetR: { value: r * 0.97 },
    };
    sunUniformTargets.push(ringU.uSunWorld);
    const rGeo = annulus(inner, outer, ctx.lowPower ? 128 : 220);
    const rMat = ringMaterial(null, ringU);
    const rings = new THREE.Mesh(rGeo, rMat);
    rings.name = "saturn.rings";
    rings.rotation.x = -Math.PI / 2; // RingGeometry di bidang XY → bidang ekuator (XZ lokal)
    rings.userData.pickId = "saturn.rings";
    rings.renderOrder = 2;
    axisFrame.add(rings);
    body.rings = rings;
    body.frameRadius = outer;
    disposables.push(rGeo, rMat);

    const planetU = {
      uSunWorld: { value: new THREE.Vector3() },
      uRingNormal: { value: new THREE.Vector3(0, 1, 0) },
      uCenter: center,
      uInner: { value: inner },
      uOuter: { value: outer },
      uRingTex: { value: null as THREE.Texture | null },
    };
    sunUniformTargets.push(planetU.uSunWorld);
    if (o.texture.ring) {
      ctx
        .loadTexture(o.texture.ring)
        .then((t) => {
          rMat.uniforms.uTex.value = t;
          rMat.uniforms.uHasTex.value = 1;
          planetU.uRingTex.value = t;
          patchRingShadowOnPlanet(std, planetU);
          std.needsUpdate = true;
        })
        .catch(() => {});
    }
    // perbarui pusat & normal cincin tiap frame (dunia)
    const prevSetSun = body.setSun;
    const n = new THREE.Vector3();
    body.setSun = (w) => {
      prevSetSun(w);
      axisFrame.getWorldPosition(center.value);
      n.set(0, 1, 0).applyQuaternion(
        axisFrame.getWorldQuaternion(new THREE.Quaternion()),
      );
      planetU.uRingNormal.value.copy(n);
    };
  }

  // Komet: koma + ekor ilustratif yang MENJAUHI Matahari (bukan knalpot arah gerak).
  if (o.texture.procedural === "comet") {
    const tailTex = canvasTex(64, 256, (g, w, h) => {
      const grad = g.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(190,220,255,0.75)");
      grad.addColorStop(1, "rgba(190,220,255,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(w * 0.35, 0);
      g.lineTo(w * 0.65, 0);
      g.lineTo(w, h);
      g.lineTo(0, h);
      g.fill();
    });
    const tail = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: tailTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    );
    tail.name = "comet.tail";
    tail.scale.set(r * 3, r * 14, 1);
    const tailPivot = new THREE.Group();
    tailPivot.add(tail);
    tail.position.y = r * 7;
    orbitAnchor.add(tailPivot);
    disposables.push(tail.geometry, tail.material as THREE.Material, tailTex);
    const coma = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: canvasTex(64, 64, (g, w, h) => {
          const grad = g.createRadialGradient(
            w / 2,
            h / 2,
            0,
            w / 2,
            h / 2,
            w / 2,
          );
          grad.addColorStop(0, "rgba(210,230,255,0.7)");
          grad.addColorStop(1, "rgba(210,230,255,0)");
          g.fillStyle = grad;
          g.fillRect(0, 0, w, h);
        }),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      }),
    );
    coma.scale.setScalar(r * 5);
    orbitAnchor.add(coma);
    disposables.push(coma.material.map!, coma.material);
    const prev = body.setSun;
    const away = new THREE.Vector3();
    const here = new THREE.Vector3();
    body.setSun = (w) => {
      prev(w);
      orbitAnchor.getWorldPosition(here);
      away.copy(here).sub(w).normalize();
      tailPivot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), away);
    };
  }

  // Proxy pemilihan ramah sentuh (tak terlihat, tidak menulis warna/kedalaman).
  const proxyGeo = new THREE.SphereGeometry(1, 12, 8);
  const proxyMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    colorWrite: false,
  });
  const proxy = new THREE.Mesh(proxyGeo, proxyMat);
  proxy.userData.proxyFor = o.id;
  proxy.scale.setScalar(Math.max(body.frameRadius * 1.25, 0.45));
  orbitAnchor.add(proxy);
  body.proxy = proxy;
  disposables.push(proxyGeo, proxyMat);

  return body;
}

/** Latar bintang halus (dekoratif, deterministik, tanpa nama/koordinat bintang nyata). */
export function starfield(count = 1800, radius = 900, seed = 3) {
  const r = rng(seed);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = r() * 2 - 1;
    const th = r() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    pos.set(
      [radius * s * Math.cos(th), radius * u, radius * s * Math.sin(th)],
      i * 3,
    );
    const b = 0.35 + r() * 0.5;
    const warm = r();
    col.set([b * (0.85 + warm * 0.15), b * 0.9, b * (1 - warm * 0.15)], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 1.6,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });
  const pts = new THREE.Points(geo, mat);
  pts.name = "starfield";
  pts.renderOrder = -2;
  return pts;
}

/** Garis orbit lingkaran tipis. */
export function orbitLine(
  radius: number,
  color = 0x6f86b8,
  opacity = 0.28,
  segs = 256,
) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, -Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  return new THREE.LineLoop(geo, mat);
}
