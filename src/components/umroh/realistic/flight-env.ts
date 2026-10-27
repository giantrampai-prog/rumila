import * as T from 'three';
import { CLOUD_BASE, CLOUD_TOP, getArrivalRunway, TAXIWAY_X, type FlightState } from '../flight-profile';
import { GEAR_HEIGHT } from './aircraft';
import { addGarudaAircraft } from './itinerary';
import type { FlightTelemetry, WorldFrame, WorldResources } from './types';

/**
 * Everything outside the aircraft during a flight. The aircraft stays at the scene
 * origin; the ground, airports and cloud layers move underneath it in a runway frame
 * (see flight-profile). Ground and cloud layers are procedural shaders so the view
 * stays detailed from the runway up to cruise altitude without large textures.
 */
export interface FlightEnvironment {
  group: T.Group;
  update(frame: WorldFrame, state: FlightState): void;
  toScene: FlightTelemetry['toScene'];
}

const NOISE = /* glsl */`
float hash(vec2 p) { p = mod(p, 1024.0); p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
float fbm3(vec2 p) {
  float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
// Cloud coverage shared by the deck and its shadow on the ground.
float cloudCover(vec2 g, vec2 wind, float coverage) {
  float n = fbm(g / 3400.0 + wind) * 0.72 + fbm3(g / 760.0 - wind * 1.7) * 0.38;
  return smoothstep(coverage, coverage + 0.2, n);
}
vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }
`;

const VERTEX = /* glsl */`
uniform float uCurve;
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  // Earth curvature drops distant ground below the horizon instead of ending at an edge.
  float d = length(world.xz - cameraPosition.xz);
  world.y -= d * d * uCurve;
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const GROUND_FRAGMENT = /* glsl */`
uniform vec2 uOffset; uniform vec3 uSun; uniform vec3 uSunColor; uniform vec3 uHaze; uniform float uAltitude; uniform float uTime;
uniform vec2 uDest; uniform float uDestHeading; uniform float uOriginDesert; uniform float uDestDesert;
uniform vec2 uWind; uniform float uCoverage;
varying vec3 vWorld;
${NOISE}
float airfield(vec2 local) {
  // Grass strips around the runway, taxiway and apron, in runway-frame metres.
  float across = 1.0 - smoothstep(560.0, 660.0, abs(local.x - 120.0));
  float along = smoothstep(-4300.0, -4100.0, local.y) * (1.0 - smoothstep(1100.0, 1300.0, local.y));
  return across * along;
}
void main() {
  vec2 g = vWorld.xz + uOffset;
  vec2 toDest = g - uDest;
  float c = cos(uDestHeading), s = sin(uDestHeading);
  vec2 destLocal = vec2(c * toDest.x - s * toDest.y, s * toDest.x + c * toDest.y);
  float coast = (fbm(g / 9000.0) - 0.5) * 16000.0;
  float landO = 1.0 - smoothstep(13000.0, 17000.0, length(g) + coast);
  float landD = 1.0 - smoothstep(13000.0, 17000.0, length(toDest) + coast);
  // Fade small plots and street grids into their average colour where they would alias.
  float detail = 1.0 - smoothstep(0.08, 0.6, length(fwidth(g)) / 60.0);
  float land = max(landO, landD);
  float desert = landD > landO ? uDestDesert : uOriginDesert;

  // Tropical lowland: rice paddies in small plots, tree cover and red-roofed villages.
  vec2 plot = floor(g / vec2(70.0, 110.0));
  float r = mix(0.45, hash(plot), detail);
  vec3 paddy = mix(vec3(0.27, 0.40, 0.17), vec3(0.50, 0.53, 0.24), r);
  paddy = mix(paddy, vec3(0.30, 0.36, 0.30), step(0.86, r));
  vec3 tropical = mix(paddy, vec3(0.11, 0.24, 0.10), smoothstep(0.52, 0.64, fbm(g / 1700.0)));
  float town = smoothstep(0.63, 0.7, fbm(g / 1200.0 + 7.0));
  vec3 roofs = mix(vec3(0.62, 0.34, 0.24), vec3(0.66, 0.64, 0.60), mix(0.5, hash(floor(g / 16.0)), detail));
  tropical = mix(tropical, roofs, town * 0.8);
  float river = 1.0 - smoothstep(0.0, 0.012, abs(fbm(g / 6000.0 + 2.0) - 0.5));
  tropical = mix(tropical, vec3(0.32, 0.30, 0.22), river * 0.85);

  // Arid coast: dunes, dark rocky ridges and a grey street grid near the city.
  float dunes = fbm(g / 2100.0) + 0.15 * sin(g.x / 90.0 + fbm(g / 400.0) * 6.0);
  vec3 arid = mix(vec3(0.70, 0.56, 0.40), vec3(0.85, 0.73, 0.55), clamp(dunes, 0.0, 1.0));
  arid = mix(arid, vec3(0.38, 0.31, 0.26), smoothstep(0.58, 0.76, fbm(g / 5200.0 + 3.0)));
  float blocks = mix(0.2, step(0.9, fract(g.x / 140.0)) + step(0.9, fract(g.y / 140.0)), detail);
  float city = smoothstep(0.55, 0.66, fbm(g / 2600.0 + 11.0));
  arid = mix(arid, mix(vec3(0.72, 0.69, 0.64), vec3(0.42, 0.42, 0.42), min(1.0, blocks)), city * 0.75);

  vec3 landColor = mix(tropical, arid, desert);
  // Mown grass or packed sand around both runways.
  float field = max(airfield(vec2(g.x, g.y)), airfield(destLocal));
  landColor = mix(landColor, desert > 0.5 ? vec3(0.66, 0.58, 0.45) : vec3(0.36, 0.50, 0.24), field);
  landColor = toLinear(landColor) * (0.42 + 0.75 * max(uSun.y, 0.0)) * uSunColor;

  // Open sea with wind-driven ripples, Fresnel sky reflection and a sun glint.
  vec2 w = g / 55.0;
  vec3 n = normalize(vec3((fbm3(w + uTime * 0.06) - 0.5) * 0.9 * detail, 1.0, (fbm3(w * 1.3 + 9.0 - uTime * 0.05) - 0.5) * 0.9 * detail));
  vec3 view = normalize(cameraPosition - vWorld);
  vec3 reflected = reflect(-view, n);
  float fresnel = 0.02 + 0.98 * pow(1.0 - max(dot(n, view), 0.0), 5.0);
  vec3 deep = toLinear(vec3(0.03, 0.15, 0.27)), shallow = toLinear(vec3(0.10, 0.44, 0.47));
  vec3 sea = mix(deep, shallow, smoothstep(0.0, 0.9, land * 2.2));
  sea = mix(sea, toLinear(uHaze), fresnel * 0.75);
  float glint = pow(max(dot(reflected, uSun), 0.0), 380.0) * 14.0 + pow(max(dot(reflected, uSun), 0.0), 24.0) * 0.18;
  sea += glint * uSunColor;
  // Surf line along the coast.
  sea = mix(sea, vec3(0.85), smoothstep(0.42, 0.48, land) * (1.0 - smoothstep(0.48, 0.5, land)) * 0.6);

  vec3 color = mix(sea, landColor, smoothstep(0.48, 0.52, land));
  // Cloud shadows travel with the deck above.
  vec2 shadowAt = g + uSun.xz / max(uSun.y, 0.15) * ${((CLOUD_BASE + CLOUD_TOP) / 2).toFixed(1)};
  color *= 1.0 - 0.5 * cloudCover(shadowAt, uWind, uCoverage);
  // Aerial perspective thins with altitude, softening the far ground into haze.
  float dist = length(vWorld - cameraPosition);
  float haze = 1.0 - exp(-dist / (9000.0 + uAltitude * 3.2));
  color = mix(color, toLinear(uHaze) * 1.6, clamp(haze, 0.0, 1.0));
  gl_FragColor = vec4(color * 1.25, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const DECK_FRAGMENT = /* glsl */`
uniform vec2 uOffset; uniform vec3 uSun; uniform vec3 uSunColor; uniform vec3 uHaze; uniform vec2 uWind; uniform float uCoverage; uniform float uSunset;
varying vec3 vWorld;
${NOISE}
void main() {
  vec2 g = vWorld.xz + uOffset;
  float d = cloudCover(g, uWind, uCoverage);
  if (d < 0.01) discard;
  // Approximate puffy relief from the coverage gradient.
  float dx = cloudCover(g + vec2(60.0, 0.0), uWind, uCoverage) - d;
  float dz = cloudCover(g + vec2(0.0, 60.0), uWind, uCoverage) - d;
  vec3 n = normalize(vec3(-dx * 6.0, 1.0, -dz * 6.0));
  bool below = cameraPosition.y < vWorld.y;
  float lit = below ? 0.35 + 0.25 * d : 0.55 + 0.45 * max(dot(n, uSun), 0.0);
  vec3 shadow = mix(vec3(0.55, 0.62, 0.74), vec3(0.62, 0.5, 0.55), uSunset);
  vec3 bright = mix(vec3(1.0), vec3(1.0, 0.82, 0.66), uSunset);
  // HDR white so sunlit tops read as bright as the sky shader around them.
  vec3 color = toLinear(mix(shadow, bright, clamp(lit * (0.55 + 0.45 * d), 0.0, 1.0))) * (0.6 + 0.6 * uSunColor) * 1.9;
  float dist = length(vWorld - cameraPosition);
  color = mix(color, toLinear(uHaze), clamp(1.0 - exp(-dist / 42000.0), 0.0, 1.0));
  float edge = 1.0 - smoothstep(55000.0, 78000.0, length(vWorld.xz));
  gl_FragColor = vec4(color, d * edge * 0.97);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const CIRRUS_FRAGMENT = /* glsl */`
uniform vec2 uOffset; uniform vec3 uHaze; uniform vec2 uWind; uniform float uSunset;
varying vec3 vWorld;
${NOISE}
void main() {
  vec2 g = vWorld.xz + uOffset;
  // Long, wind-combed streaks of high ice cloud.
  float streak = fbm(vec2(g.x / 9000.0, g.y / 1600.0) + uWind * 0.3) * fbm3(vec2(g.x / 2600.0, g.y / 300.0));
  float a = smoothstep(0.2, 0.42, streak) * 0.42;
  float dist = length(vWorld.xz);
  a *= 1.0 - smoothstep(40000.0, 70000.0, dist);
  vec3 color = toLinear(mix(vec3(0.98, 0.99, 1.0), vec3(1.0, 0.8, 0.72), uSunset));
  gl_FragColor = vec4(mix(color, toLinear(uHaze), 0.25) * 1.8, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

interface Airport { group: T.Group; flashers: T.Sprite[] }

function shaderMaterial(r: WorldResources, fragmentShader: string, uniforms: Record<string, T.IUniform>, transparent: boolean): T.ShaderMaterial {
  const material = r.keep(new T.ShaderMaterial({ vertexShader: VERTEX, fragmentShader, uniforms, transparent, depthWrite: false, side: T.DoubleSide }));
  material.userData.keepUV = true; return material;
}

export function createFlightEnvironment(r: WorldResources, destination: 'jeddah' | 'jakarta'): FlightEnvironment {
  const group = new T.Group(); group.name = 'Langit dan daratan penerbangan'; group.userData.dynamic = true;
  const toJeddah = destination === 'jeddah';
  const arrival = getArrivalRunway();
  const sun = new T.Vector3(), haze = new T.Color(), sunColor = new T.Color();
  const shared = {
    uOffset: { value: new T.Vector2() }, uSun: { value: sun }, uSunColor: { value: sunColor }, uHaze: { value: haze },
    uWind: { value: new T.Vector2() }, uCoverage: { value: .5 }, uCurve: { value: 1 / (2 * 6371000 * .55) }, uSunset: { value: 0 },
  };
  const ground = new T.Mesh(r.keep(new T.PlaneGeometry(320000, 320000, 96, 96).rotateX(-Math.PI / 2)), shaderMaterial(r, GROUND_FRAGMENT, {
    ...shared, uAltitude: { value: 0 }, uTime: { value: 0 },
    uDest: { value: new T.Vector2(arrival.x, arrival.z) }, uDestHeading: { value: arrival.heading },
    uOriginDesert: { value: toJeddah ? 0 : 1 }, uDestDesert: { value: toJeddah ? 1 : 0 },
  }, false));
  ground.name = 'Daratan dan laut'; ground.renderOrder = -90; ground.frustumCulled = false; group.add(ground);

  const origin = createAirport(r, !toJeddah, toJeddah ? '25R' : '34R', toJeddah ? 'SOEKARNO–HATTA' : 'KING ABDULAZIZ');
  const destinationAirport = createAirport(r, toJeddah, toJeddah ? '34R' : '25R', toJeddah ? 'KING ABDULAZIZ' : 'SOEKARNO–HATTA');
  group.add(origin.group, destinationAirport.group);

  const deck = new T.Mesh(r.keep(new T.PlaneGeometry(160000, 160000, 48, 48).rotateX(-Math.PI / 2)), shaderMaterial(r, DECK_FRAGMENT, shared, true));
  deck.name = 'Lapisan awan'; deck.renderOrder = -40; deck.frustumCulled = false; group.add(deck);
  const cirrus = new T.Mesh(r.keep(new T.PlaneGeometry(150000, 150000, 24, 24).rotateX(-Math.PI / 2)), shaderMaterial(r, CIRRUS_FRAGMENT, shared, true));
  cirrus.name = 'Awan tinggi'; cirrus.renderOrder = -30; cirrus.frustumCulled = false; group.add(cirrus);

  // Billboard clouds around the aircraft give parallax when climbing through the deck
  // and rush past the wing at cruise. Positions wrap around the aircraft.
  const materials = [0, 1, 2].map((variant) => cloudMaterial(r, variant));
  const random = seeded(9127);
  const puffs: { sprite: T.Sprite; x: number; y: number; z: number; spanX: number; spanZ: number; band: [number, number] }[] = [];
  const addPuffs = (count: number, band: [number, number], spanX: number, spanZ: number, size: [number, number]) => {
    for (let i = 0; i < count; i++) {
      const sprite = new T.Sprite(materials[i % 3]);
      const width = size[0] + random() * (size[1] - size[0]); sprite.scale.set(width, width * (.42 + random() * .2), 1);
      sprite.renderOrder = -20; group.add(sprite);
      puffs.push({ sprite, x: (random() - .5) * spanX, y: band[0] + random() * (band[1] - band[0]), z: (random() - .5) * spanZ, spanX, spanZ, band });
    }
  };
  addPuffs(34, [CLOUD_BASE - 80, CLOUD_TOP + 260], 4200, 7000, [260, 720]);
  addPuffs(12, [CLOUD_TOP + 80, CLOUD_TOP + 900], 30000, 30000, [1400, 3200]);
  addPuffs(10, [8800, 10100], 2600, 9000, [90, 320]);

  // Whiteout while inside the cloud layer.
  const veilMaterial = r.keep(new T.MeshBasicMaterial({ color: '#e9eef2', transparent: true, opacity: 0, side: T.BackSide, depthWrite: false, fog: false }));
  const veil = new T.Mesh(r.keep(new T.SphereGeometry(140, 24, 16)), veilMaterial); veil.renderOrder = 10; veil.name = 'Di dalam awan'; group.add(veil);

  let offsetX = 0, offsetZ = 0, lift = 0, arrivalSide = false;
  const toScene = (x: number, y: number, z: number, atArrival = false) => {
    if (atArrival) {
      const c = Math.cos(arrival.heading), s = Math.sin(arrival.heading);
      const gx = arrival.x + c * x + s * z, gz = arrival.z - s * x + c * z;
      return new T.Vector3(gx - offsetX, y - lift, gz - offsetZ);
    }
    return new T.Vector3(x - offsetX, y - lift, z - offsetZ);
  };
  return {
    group, toScene,
    update(frame, state) {
      offsetX = state.x; offsetZ = state.z; lift = state.altitude + GEAR_HEIGHT;
      arrivalSide = state.phase.start >= .5;
      const sunset = frame.sunset;
      sun.copy(frame.sunDirection).normalize();
      sunColor.set(sunset ? '#ffc898' : '#fff6ea');
      // Haze matches the sky near the horizon: pale blue by day, peach at sunset, whiter in cloud.
      haze.set(sunset ? '#e9b993' : state.altitude > 6000 ? '#c9dcec' : '#d4e1e8');
      shared.uOffset.value.set(offsetX, offsetZ);
      shared.uSunset.value = sunset ? 1 : 0;
      shared.uWind.value.set(frame.time * .004, frame.time * .0015);
      shared.uCoverage.value = arrivalSide ? (toJeddah ? .62 : .48) : (toJeddah ? .5 : .62);
      const groundUniforms = (ground.material as T.ShaderMaterial).uniforms;
      groundUniforms.uAltitude.value = state.altitude; groundUniforms.uTime.value = frame.time;
      ground.position.set(0, -lift, 0);
      origin.group.position.set(-offsetX, -lift, -offsetZ);
      destinationAirport.group.position.set(arrival.x - offsetX, -lift, arrival.z - offsetZ);
      destinationAirport.group.rotation.y = arrival.heading;
      // Only draw the airport you can actually see.
      origin.group.visible = !arrivalSide && state.altitude < 6000;
      destinationAirport.group.visible = arrivalSide && state.altitude < 6000;
      // Twice a second the flashers run from the far end of the approach lights to the runway.
      for (const airport of [origin, destinationAirport]) {
        const lit = Math.floor((frame.time * 2 % 1) * 14);
        airport.flashers.forEach((flash, i) => { flash.visible = airport.group.visible && i === lit; });
      }
      deck.position.y = (CLOUD_BASE + CLOUD_TOP) / 2 - lift;
      cirrus.position.y = 11900 - lift;
      for (const puff of puffs) {
        const rx = wrap(puff.x - offsetX, puff.spanX), rz = wrap(puff.z - offsetZ, puff.spanZ);
        const y = puff.y - lift;
        puff.sprite.position.set(rx, y, rz);
        const near = Math.abs(y) < 2600 || puff.band[0] > CLOUD_TOP + 50 && state.altitude > CLOUD_TOP;
        puff.sprite.visible = near && !(puff.band[0] > 8000 && state.altitude < 7000);
      }
      veilMaterial.opacity = Math.min(.93, state.inCloud * 1.05);
      veil.visible = state.inCloud > .01;
      if (frame.sky) {
        // Thinner air above the cloud deck: a deeper blue zenith and a crisp horizon.
        const high = Math.min(1, state.altitude / 9000);
        const uniforms = frame.sky.material.uniforms;
        uniforms.rayleigh.value = sunset ? 2.4 - high * .8 : 1.9 - high * 1.05;
        uniforms.turbidity.value = sunset ? 6 - high * 3 : 3.2 - high * 2;
        uniforms.mieCoefficient.value = .005 - high * .0025;
      }
    },
  };
}

function wrap(value: number, span: number): number {
  return ((value % span) + span * 1.5) % span - span / 2;
}
function seeded(seed: number): () => number {
  let value = seed >>> 0;
  return () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; };
}

/**
 * A runway with markings and lights, a parallel taxiway, apron, terminal, tower and
 * parked aircraft. Local frame matches the flight profile: threshold at the origin,
 * departures roll toward -Z, the parallel taxiway is at +X.
 */
function createAirport(r: WorldResources, desert: boolean, designator: string, name: string): Airport {
  const group = new T.Group(); group.name = `Bandara ${name}`; group.userData.dynamic = true;
  const flat = (color: string, order: number) => {
    const material = r.keep(new T.MeshStandardMaterial({ color, roughness: .92, depthWrite: false }));
    material.userData.layer = order; return material;
  };
  const asphalt = flat(desert ? '#5d5a55' : '#3e3f40', 1), concrete = flat(desert ? '#a39b8f' : '#8e8e8a', 1);
  const paint = flat('#f4f4ef', 2), yellow = flat('#e8b52e', 2), rubber = flat('#262626', 2);
  const strip = (w: number, l: number, x: number, z: number, material: T.Material, order: number, rotation = 0) => {
    const mesh = r.mesh(group, r.keep(new T.PlaneGeometry(w, l).rotateX(-Math.PI / 2)), material, [x, .02 * order, z]);
    mesh.rotation.y = rotation; mesh.castShadow = false; mesh.renderOrder = -80 + order; return mesh;
  };
  const LENGTH = 3600;
  strip(60, LENGTH + 120, 0, -LENGTH / 2 + 60, asphalt, 1);
  // Threshold piano keys, designator, touchdown-zone bars, aiming points and centreline.
  for (const end of [0, 1]) {
    const z0 = end ? -LENGTH + 30 : -30, dir = end ? 1 : -1;
    for (let i = 0; i < 8; i++) for (const side of [-1, 1]) strip(1.8, 30, side * (3 + i * 3.2), z0 + dir * 15, paint, 2);
    for (let k = 0; k < 3; k++) for (const side of [-1, 1]) strip(1.8, 22, side * (9 + k * 3), z0 + dir * (150 + k * 150), paint, 2);
    for (const side of [-1, 1]) strip(9, 45, side * 11, z0 + dir * 330, paint, 2);
    // Tyre marks where aircraft touch down.
    for (const side of [-1, 1]) strip(5, 380, side * 4, z0 + dir * 420, rubber, 2);
    const label = runwayLabel(r, end ? opposite(designator) : designator);
    strip(18, 30, 0, z0 + dir * 78, label, 3, end ? Math.PI : 0);
  }
  for (let z = -120; z > -LENGTH + 120; z -= 60) strip(.9, 36, 0, z, paint, 2);
  for (const side of [-1, 1]) strip(.9, LENGTH, side * 28.5, -LENGTH / 2, paint, 2);
  // Parallel taxiway with link taxiways and yellow centrelines.
  strip(25, LENGTH + 300, TAXIWAY_X, -LENGTH / 2 + 120, asphalt, 1);
  strip(.5, LENGTH + 300, TAXIWAY_X, -LENGTH / 2 + 120, yellow, 2);
  for (const z of [80, -900, -1800, -2700, -LENGTH + 20]) {
    strip(TAXIWAY_X, 23, TAXIWAY_X / 2, z, asphalt, 1);
    strip(TAXIWAY_X, .45, TAXIWAY_X / 2, z, yellow, 2);
  }
  // Apron and terminal east of the taxiway.
  strip(240, 1300, TAXIWAY_X + 170, -520, concrete, 1);
  const glass = r.keep(new T.MeshStandardMaterial({ color: '#5b7c8f', metalness: .5, roughness: .15 }));
  const wall = r.keep(new T.MeshStandardMaterial({ color: desert ? '#e6dccb' : '#e9ebe7', roughness: .7 }));
  const roofMaterial = r.keep(new T.MeshStandardMaterial({ color: desert ? '#f2efe8' : '#c9cfd2', metalness: .3, roughness: .45 }));
  const tx = TAXIWAY_X + 330;
  r.box(group, [70, 18, 1100], [tx, 9, -520], wall);
  r.box(group, [72, 7, 1096], [tx - 1, 9, -520], glass);
  if (desert) for (let z = -1020; z <= -20; z += 50) { const tent = r.cylinder(group, 0, 26, 12, [tx, 24, z], roofMaterial, 4); tent.rotation.y = Math.PI / 4; }
  else for (let z = -1020; z <= -20; z += 100) { const roof = r.box(group, [80, 3, 90], [tx, 20, z], roofMaterial); roof.rotation.z = .04; }
  // Boarding bridges and parked aircraft at the gates.
  for (let i = 0; i < 4; i++) {
    const z = -180 - i * 230;
    r.box(group, [44, 4, 4], [tx - 57, 6, z], wall);
    addGarudaAircraft(r, group, [tx - 105, 0, z - 30], 1.667, -Math.PI / 2);
  }
  // Control tower.
  r.cylinder(group, 4, 6, 58, [tx + 80, 29, -1200], wall, 16);
  r.cylinder(group, 11, 8, 8, [tx + 80, 62, -1200], glass, 16);
  r.cylinder(group, 12, 12, 1.5, [tx + 80, 66.6, -1200], roofMaterial, 16);
  // Edge, centreline and approach lights merged into a few draw calls.
  const lamp = (color: string) => r.keep(new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.4 }));
  const white = lamp('#fff6dc'), blue = lamp('#3c7bff'), red = lamp('#ff3a2e'), green = lamp('#3cff6a');
  for (let z = 0; z >= -LENGTH; z -= 60) for (const side of [-1, 1]) r.box(group, [.5, .5, .5], [side * 31, .3, z], white);
  for (let z = 100; z >= -LENGTH; z -= 45) for (const side of [-1, 1]) r.box(group, [.35, .35, .35], [TAXIWAY_X + side * 14, .25, z], blue);
  for (let x = -26; x <= 26; x += 4) { r.box(group, [.6, .5, .5], [x, .3, 2], green); r.box(group, [.6, .5, .5], [x, .3, -LENGTH - 2], red); }
  for (let k = 1; k <= 10; k++) {
    for (let x = -10; x <= 10; x += 2.5) r.box(group, [.6, .6, .6], [x, .8, k * 30], white);
    r.box(group, [.12, .8, .12], [0, .4, k * 30], r.mat.metal);
  }
  // Precision approach path indicator boxes beside the touchdown zone.
  for (let i = 0; i < 4; i++) r.box(group, [1.4, 1, 1], [-40 - i * 9, .6, -330], i < 2 ? white : red);
  // Trees or palms dotted around the airfield edges.
  const tree = r.keep(new T.MeshStandardMaterial({ color: desert ? '#6f7a4c' : '#2f5428', roughness: 1 }));
  const trunk = r.keep(new T.MeshStandardMaterial({ color: '#6b5440', roughness: 1 }));
  const random = seeded(desert ? 77 : 33);
  for (let i = 0; i < 70; i++) {
    const side = random() > .5 ? 1 : -1, x = side * (700 + random() * 500) + 80, z = 900 - random() * (LENGTH + 1800);
    r.cylinder(group, .35, .45, 7, [x, 3.5, z], trunk, 6);
    r.sphere(group, [4 + random() * 2, 3 + random() * 1.5, 4 + random() * 2], [x, 8.5, z], tree);
  }
  r.batch(group);
  // Painted layers do not write depth, so draw order keeps markings above the asphalt.
  group.traverse((object) => {
    if (object instanceof T.Mesh && (object.material as T.Material).depthWrite === false) { object.renderOrder = -80 + ((object.material as T.Material).userData.layer ?? 0); object.castShadow = false; }
  });
  // Sequenced flashers race toward the threshold along the approach lights.
  const flashMap = (() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d')!; const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(220,235,255,.7)'); g.addColorStop(1, 'rgba(200,220,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
    const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; return map;
  })();
  const flashMaterial = r.keep(new T.SpriteMaterial({ map: flashMap, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, toneMapped: false }));
  const flashers: T.Sprite[] = [];
  for (let k = 10; k >= 1; k--) {
    const flash = new T.Sprite(flashMaterial); flash.position.set(0, 1.2, k * 30); flash.scale.setScalar(9); flash.visible = false;
    flash.renderOrder = -10; group.add(flash); flashers.push(flash);
  }
  return { group, flashers };
}

function opposite(designator: string): string {
  const number = parseInt(designator, 10), side = designator.slice(-1);
  const flipped = ((number + 18 - 1) % 36) + 1;
  return String(flipped).padStart(2, '0') + (side === 'R' ? 'L' : side === 'L' ? 'R' : '');
}
function runwayLabel(r: WorldResources, text: string): T.MeshStandardMaterial {
  const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 512;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Tekstur landasan tidak tersedia.');
  ctx.fillStyle = '#f4f4ef'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const number = text.replace(/[LRC]$/, ''), side = text.slice(number.length);
  // Painted with the letter nearest the threshold, readable from an approaching aircraft.
  ctx.font = 'bold 190px Arial, sans-serif'; ctx.fillText(number, 128, 135, 240);
  if (side) { ctx.font = 'bold 170px Arial, sans-serif'; ctx.fillText(side, 128, 370, 240); }
  const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 8;
  const material = r.keep(new T.MeshStandardMaterial({ map, transparent: true, depthWrite: false, roughness: .9 }));
  material.userData.keepUV = true; material.userData.layer = 3; return material;
}

/** Attitude from the profile with runway rumble, cloud bumps and a firm touchdown. */
export function applyAttitude(object: T.Object3D, state: FlightState, frame: { time: number; reducedMotion: boolean }): void {
  const shake = frame.reducedMotion ? 0 : state.shake, t = frame.time;
  const bumpPitch = shake * (.0035 * Math.sin(t * 31) + .002 * Math.sin(t * 57.3) + (state.inCloud ? .006 * Math.sin(t * 7.1) : 0));
  const bumpRoll = shake * (.003 * Math.sin(t * 23.7 + 1) + (state.inCloud ? .008 * Math.sin(t * 5.3) : 0));
  object.rotation.set(state.pitch + bumpPitch, state.heading, state.bank + bumpRoll, 'YXZ');
  object.position.y = (object.userData.baseY ?? 0) + shake * (.018 * Math.sin(t * 43) + .012 * Math.sin(t * 71)) + (state.phase.id === 'cruise' && !frame.reducedMotion ? .25 * Math.sin(t * .9) * Math.sin(t * .37) : 0);
}

export function flightTelemetry(env: FlightEnvironment): FlightTelemetry {
  return { altitude: 0, speed: 0, thrust: 0, onGround: true, shake: 0, inCloud: 0, seatbelt: true, phase: 'pushback', local: 0, heading: 0, pitch: 0, bank: 0, toScene: env.toScene };
}
export function updateTelemetry(target: FlightTelemetry, state: FlightState): void {
  Object.assign(target, {
    altitude: state.altitude, speed: state.speed, thrust: state.thrust, onGround: state.onGround, shake: state.shake, inCloud: state.inCloud,
    seatbelt: state.seatbelt, phase: state.phase.id, local: state.local, heading: state.heading, pitch: state.pitch, bank: state.bank,
  });
}

/** Original translucent cloud billboards with soft, irregular silhouettes. */
export function cloudMaterial(r: WorldResources, variant: number): T.SpriteMaterial {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Tekstur awan tidak tersedia.');
  const random = seeded(variant * 937 + 81);
  // Build one opaque cloud silhouette, then shade that entire volume. Coloring
  // the rim of every separate puff creates artificial rings, so only the outer
  // silhouette is softened; overlapping lobes never introduce dark outlines.
  const mask = document.createElement('canvas'); mask.width = 1024; mask.height = 512;
  const m = mask.getContext('2d'); if (!m) throw new Error('Siluet awan tidak tersedia.');
  m.filter = 'blur(8px)'; m.fillStyle = '#ffffff';
  m.beginPath(); m.ellipse(512, 342, 385, 82, 0, 0, Math.PI * 2); m.fill();
  for (let i = 0; i < 13; i++) {
    const t = i / 12, x = 140 + t * 740;
    const y = 312 - Math.sin(t * Math.PI) * (80 + random() * 90);
    m.beginPath(); m.ellipse(x, y, 67 + random() * 44, 57 + random() * 56, -.1 + random() * .2, 0, Math.PI * 2); m.fill();
  }
  const shade = ctx.createLinearGradient(0, 95, 75, 435);
  shade.addColorStop(0, '#ffffff'); shade.addColorStop(.38, '#fcfdff'); shade.addColorStop(.7, '#eaf1f7'); shade.addColorStop(1, '#bfcfdd');
  ctx.fillStyle = shade; ctx.fillRect(0, 0, 1024, 512);
  // Broad, almost white highlights suggest rounded cumulus without separate
  // concentric halos or repeated disk geometry.
  for (let i = 0; i < 14; i++) {
    const x = 170 + random() * 690, y = 170 + random() * 150, radius = 60 + random() * 105;
    const light = ctx.createRadialGradient(x, y, 0, x, y, radius);
    light.addColorStop(0, 'rgba(255,255,255,.54)'); light.addColorStop(.45, 'rgba(255,255,255,.26)'); light.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = light; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(mask, 0, 0); ctx.globalCompositeOperation = 'source-over';
  const map = r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace;
  return r.keep(new T.SpriteMaterial({ map, transparent: true, depthWrite: false, opacity: .96, fog: true, toneMapped: false, alphaTest: .006 }));
}
