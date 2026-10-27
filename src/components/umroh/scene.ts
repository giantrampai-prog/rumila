import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import type { UmrohStage, JourneyChapterId } from '@/lib/umroh';
import { Resources } from './realistic/resources';
import { createNabawiWorld, createBirAliWorld } from './realistic/madinah';
import { createHaramWorld, createSaiWorld } from './realistic/haram';
import { createCabinWorld, createJourneyWorld, createTahallulWorld } from './realistic/travel';
import { createHomeWorld, createTaxiWorld, createHaramainWorld, createMadinahStationWorld } from './realistic/itinerary';
import { createRawdahWorld, createSalamWorld } from './realistic/nabawi-interior';
import { createFlightWorld } from './realistic/flight';
import { getFlightPov, isFlightChapter, type FlightCameraMode } from './flight-camera';
import { getTawafCameraFrame, getTawafRoutePose, getTawafView, isGuidedTawaf, isTawafScene } from './tawaf-camera';
import { MAQAM_POSITION } from './realistic/kaaba-layout';
import { Pilgrims } from './realistic/pilgrims';
import type { UmrohWorld, Position, WorldFrame } from './realistic/types';
import { createBoardingWorld, createTerminalWorld } from './realistic/airport';
import { FlightAudio } from './flight-audio';
import { cloudMaterial } from './realistic/flight-env';
import { moveWithinWorld } from './realistic/navigation';

export type { UmrohStage };
export interface UmrohSceneState {
  stage: UmrohStage;
  chapter?: JourneyChapterId;
  travelProgress?: number;
  route: 'madinah' | 'pesawat';
  pilgrim: 'putra' | 'putri';
  progress: number;
  running: boolean;
  view?: 'walk' | 'follow' | 'overview';
  flightCamera?: FlightCameraMode;
  reducedMotion?: boolean;
  guideOpen?: boolean;
  timeOfDay?: 'day' | 'sunset';
  visit?: 'nabawi' | null;
  paused?: boolean;
  /** Completed checklist steps in the current lesson chapter. */
  step?: number;
}
type WorldKey = 'nabawi' | 'birali' | 'cabin' | 'journey' | 'haram' | 'sai' | 'tahallul' | 'home' | 'taxi-cgk' | 'taxi-home' | 'uber' | 'cgk' | 'cgk-return' | 'jed' | 'jed-return' | 'garuda-jed' | 'garuda-cgk' | 'flight-jed' | 'flight-cgk' | 'haramain' | 'madinah-station' | 'rawdah' | 'salam' | 'jeddah-bus' | 'boarding';
const EYE_HEIGHT = 1.68, SAI_END = 75;
const UP = new T.Vector3(0, 1, 0);

/** Walkable human-scale reconstruction; architecture and PBR textures share GPU resources. */
export class UmrohScene {
  private renderer: T.WebGLRenderer;
  private scene = new T.Scene();
  private camera = new T.PerspectiveCamera(64, 1, .065, 2600);
  private orbit: OrbitControls;
  private resources: Resources;
  private sky = new Sky();
  /** Fair-weather cumulus around the horizon for every ground-level scene. */
  private cumulus = new T.Group();
  /** Ground-level sky: a clean blue gradient with a sun glow; Sky.js stays for flights. */
  private dome = new T.Mesh(new T.SphereGeometry(2000, 48, 24), new T.ShaderMaterial({
    side: T.BackSide, depthWrite: false, fog: false, toneMapped: false,
    uniforms: { uZenith: { value: new T.Color('#2f78c8') }, uHorizon: { value: new T.Color('#bfdcf2') }, uGround: { value: new T.Color('#9fb7c8') }, uSun: { value: new T.Vector3(0, 1, 0) }, uGlow: { value: new T.Color('#fff4dc') } },
    vertexShader: 'varying vec3 vDir; void main() { vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz - cameraPosition); gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); gl_Position.z = gl_Position.w; }',
    fragmentShader: `uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uGround; uniform vec3 uSun; uniform vec3 uGlow; varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir); float h = d.y;
        vec3 sky = h > 0.0 ? mix(uHorizon, uZenith, pow(h, 0.55)) : mix(uHorizon, uGround, clamp(-h * 6.0, 0.0, 1.0));
        float s = max(dot(d, normalize(uSun)), 0.0);
        sky += uGlow * (pow(s, 6.0) * 0.18 + pow(s, 64.0) * 0.35 + smoothstep(0.9993, 0.9997, s) * 1.4);
        gl_FragColor = vec4(sky, 1.0);
        #include <colorspace_fragment>
      }`,
  }));
  private sun = new T.DirectionalLight('#fff2da', 3.4);
  private hemisphere = new T.HemisphereLight('#dbe7ef', '#938471', 1.1);
  private environment: T.WebGLRenderTarget | null = null;
  private observer: ResizeObserver;
  private worlds = new Map<WorldKey, UmrohWorld>();
  private world!: UmrohWorld;
  private worldKey: WorldKey | null = null;
  private crowd: Pilgrims | null = null;
  private crowds = new Map<WorldKey, Pilgrims>();
  private guide: Pilgrims;
  private avatar = new T.Vector3();
  private heading = Math.PI;
  private state: UmrohSceneState = { chapter: 'rumah', stage: 'persiapan', route: 'madinah', pilgrim: 'putra', progress: 0, running: false, view: 'walk', timeOfDay: 'day', visit: null };
  private frame = 0;
  private lastTime = 0;
  private crowdTime = 0;
  private disposed = false;
  private contextLost = false;
  private yaw = 0;
  private pitch = 0;
  private tawafLookYaw = 0;
  private tawafLookPitch = 0;
  private pointer: { id: number; x: number; y: number } | null = null;
  private pressed = new Set<string>();
  private forward = 0;
  private right = 0;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private compact = window.matchMedia('(max-width: 800px)').matches;
  private lastFollow = new T.Vector3();
  private tmp = new T.Vector3();
  private flightFramingScale = 1;
  private surge = 0;
  /** Travel progress eased between the 25 Hz journey updates so motion stays fluid. */
  private travel = 0;
  private elapsed = 0;
  private railYaw = 0;
  private railPitch = 0;
  private shot = -1;
  private shotPosition = new T.Vector3();
  private seatQuaternion = new T.Quaternion();
  private worldQuaternion = new T.Quaternion();
  private euler = new T.Euler(0, 0, 0, 'YXZ');
  private sunDirection = new T.Vector3();
  private frameInfo: WorldFrame = { step: 0, travel: 0, time: 0, delta: 0, running: false, reducedMotion: false, sunDirection: this.sunDirection, sunset: false };
  private audio: FlightAudio | null = null;
  private soundOn = true;

  constructor(private container: HTMLElement) {
    this.renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.compact ? 1.35 : 1.7));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = T.PCFShadowMap;
    const canvas = this.renderer.domElement;
    canvas.style.width = canvas.style.height = '100%'; canvas.style.display = 'block'; canvas.style.touchAction = 'none';
    canvas.tabIndex = 0; canvas.setAttribute('role', 'img'); container.appendChild(canvas);
    this.resources = new Resources(Math.min(this.renderer.capabilities.getMaxAnisotropy(), 8));
    this.scene.add(this.hemisphere, this.sun, this.sun.target);
    this.sun.castShadow = true; this.sun.shadow.mapSize.setScalar(this.compact ? 1024 : 2048);
    Object.assign(this.sun.shadow.camera, { left: -85, right: 85, top: 85, bottom: -85, near: 1, far: 350 });
    this.sun.shadow.normalBias = .045; this.sun.shadow.bias = -.00012;
    this.sky.scale.setScalar(1800); this.sky.renderOrder = -100; this.scene.add(this.sky);
    this.dome.renderOrder = -101; this.dome.frustumCulled = false; this.dome.name = 'Kubah langit'; this.scene.add(this.dome);
    Object.assign(this.sky.material.uniforms.turbidity, { value: 3 });
    this.sky.material.uniforms.rayleigh.value = 1.7;
    this.sky.material.uniforms.mieCoefficient.value = .005;
    this.sky.material.uniforms.mieDirectionalG.value = .8;
    this.setTime('day'); this.makeEnvironment();
    this.orbit = new OrbitControls(this.camera, canvas);
    this.orbit.enableDamping = true; this.orbit.dampingFactor = .09; this.orbit.enablePan = false;
    this.orbit.minDistance = 2.2; this.orbit.maxDistance = 220; this.orbit.maxPolarAngle = Math.PI / 2 - .025; this.orbit.enabled = false;
    this.guide = new Pilgrims(this.resources, { kind: 'walk', count: 1 }, true); this.scene.add(this.guide.group);
    this.buildCumulus();
    this.observer = new ResizeObserver(this.resize); this.observer.observe(container);
    canvas.addEventListener('pointerdown', this.pointerDown); canvas.addEventListener('pointermove', this.pointerMove);
    canvas.addEventListener('pointerup', this.pointerUp); canvas.addEventListener('pointercancel', this.pointerUp);
    canvas.addEventListener('webglcontextlost', this.onContextLost); canvas.addEventListener('webglcontextrestored', this.onContextRestored);
    window.addEventListener('keydown', this.keyDown); window.addEventListener('keyup', this.keyUp);
    window.addEventListener('blur', this.pauseInput); document.addEventListener('visibilitychange', this.pauseInput);
    try { this.resize(); this.update(this.state); this.frame = requestAnimationFrame(this.tick); }
    catch (error) { this.dispose(); throw error; }
  }
  private buildCumulus(): void {
    const materials = [0, 1, 2].map((variant) => {
      // Clouds sit beyond the scene fog, so they keep their own colour.
      const material = this.resources.keep(cloudMaterial(this.resources, variant).clone()); material.fog = false; return material;
    });
    let seed = 1913;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < 46; i++) {
      const sprite = new T.Sprite(materials[i % 3]);
      const angle = random() * Math.PI * 2, distance = 700 + random() * 900, width = 220 + random() * 420;
      sprite.position.set(Math.cos(angle) * distance, 180 + random() * 360 + distance * .08, Math.sin(angle) * distance);
      sprite.scale.set(width, width * (.36 + random() * .16), 1);
      sprite.renderOrder = -90; this.cumulus.add(sprite);
    }
    this.cumulus.name = 'Awan cumulus'; this.scene.add(this.cumulus);
  }
  private makeEnvironment(): void {
    const pmrem = new T.PMREMGenerator(this.renderer);
    // The atmosphere lights the scene even when the gradient dome is what you see.
    const env = new T.Scene(), atmosphere = this.sky.clone(); atmosphere.visible = true; env.add(atmosphere);
    this.environment = pmrem.fromScene(env, .04, .1, 2200);
    this.scene.environment = this.environment.texture; this.scene.environmentIntensity = .15; pmrem.dispose();
  }
  private setTime(time: 'day' | 'sunset'): void {
    const sunset = time === 'sunset';
    const flying = Boolean(this.world?.flight);
    const aloft = Boolean(this.world?.telemetry);
    this.sky.visible = aloft;
    this.dome.visible = !aloft;
    // Flights keep the sun ahead-left of the aircraft so the window seat catches its light.
    const direction = aloft ? new T.Vector3(-.62, sunset ? .1 : .55, -.5).normalize() : new T.Vector3(-.45, sunset ? .13 : .75, .45).normalize();
    this.sunDirection.copy(direction);
    this.sky.material.uniforms.sunPosition.value.copy(direction);
    this.sky.material.uniforms.turbidity.value = sunset ? 5 : 1.5;
    this.sun.color.set(sunset ? '#ffd2a2' : '#fff2dc'); this.sun.intensity = sunset ? 1.8 : 2.8;
    this.sun.position.copy(direction).multiplyScalar(170);
    this.hemisphere.intensity = this.world?.indoor ? (aloft ? 1.05 : 1.45) : flying ? 1.2 : sunset ? .55 : .7;
    this.hemisphere.color.set(sunset ? '#d7c8c1' : '#dbe7ef');
    this.renderer.toneMappingExposure = aloft ? (sunset ? .62 : .68) : flying ? .95 : sunset ? .66 : .7;
    this.scene.fog = new T.Fog(sunset ? '#d6bba0' : aloft ? '#d4e1e8' : '#c6d2d4', aloft ? 1500 : 170, aloft ? 45000 : 1100);
    // Bright sky reflections suit the painted aircraft; the cabin interior stays matte.
    this.scene.environmentIntensity = aloft && !this.world?.indoor ? .55 : .15;
    // Flight worlds retune the atmosphere for altitude every frame; restore ground level here.
    // A clear tropical blue at ground level, warmer and hazier at sunset.
    this.sky.material.uniforms.rayleigh.value = sunset ? 1.7 : 3; this.sky.material.uniforms.mieCoefficient.value = sunset ? .005 : .0022;
    this.cumulus.visible = !aloft;
    const dome = this.dome.material.uniforms;
    dome.uSun.value.copy(direction);
    dome.uZenith.value.set(sunset ? '#3c5f9c' : '#2f78c8'); dome.uHorizon.value.set(sunset ? '#f3b986' : '#c3def2');
    dome.uGround.value.set(sunset ? '#b8998a' : '#a6bccb'); dome.uGlow.value.set(sunset ? '#ffb070' : '#fff4dc');
  }
  private keyFor(state: UmrohSceneState): WorldKey {
    if (state.visit === 'nabawi') return 'nabawi';
    if (isFlightChapter(state.chapter) && getFlightPov(state.travelProgress ?? 0, state.flightCamera, this.reducedMotion) === 'exterior') return state.chapter === 'garuda_jed' ? 'flight-jed' : 'flight-cgk';
    const chapters: Partial<Record<JourneyChapterId, WorldKey>> = {
      rumah: 'home', taxi_cgk: 'taxi-cgk', cgk: 'cgk', cgk_imigrasi: 'cgk', cgk_keamanan: 'cgk', cgk_gate: 'cgk', cgk_boarding: 'boarding', garuda_jed: 'garuda-jed', jeddah: 'jed', haramain: 'haramain',
      madinah_station: 'madinah-station', uber_nabawi: 'uber', nabawi: 'nabawi', rawdah: 'rawdah', salam: 'salam',
      makkah_jed: 'jeddah-bus', jeddah_pulang: 'jed-return', garuda_cgk: 'garuda-cgk', cgk_pulang: 'cgk-return', taxi_rumah: 'taxi-home', rumah_selesai: 'home',
    };
    if (state.chapter && chapters[state.chapter]) return chapters[state.chapter]!;
    if (state.stage === 'persiapan' || state.stage === 'miqat') return state.route === 'madinah' ? 'birali' : 'cabin';
    if (state.stage === 'perjalanan') return 'journey';
    if (state.stage === 'sai') return 'sai';
    if (state.stage === 'tahallul') return 'tahallul';
    return 'haram';
  }
  private loadWorld(key: WorldKey): void {
    if (this.world) this.scene.remove(this.world.group);
    this.crowd?.group.removeFromParent(); this.crowd = null;
    const factories: Record<WorldKey, () => UmrohWorld> = {
      nabawi: () => createNabawiWorld(this.resources), birali: () => createBirAliWorld(this.resources),
      cabin: () => createCabinWorld(this.resources), journey: () => createJourneyWorld(this.resources),
      haram: () => createHaramWorld(this.resources), sai: () => createSaiWorld(this.resources), tahallul: () => createTahallulWorld(this.resources),
      home: () => createHomeWorld(this.resources), 'taxi-cgk': () => createTaxiWorld(this.resources, 'taxi'), 'taxi-home': () => createTaxiWorld(this.resources, 'taxi', true),
      uber: () => createTaxiWorld(this.resources, 'uber'), cgk: () => createTerminalWorld(this.resources, 'cgk', 'departure'), 'cgk-return': () => createTerminalWorld(this.resources, 'cgk', 'arrival'),
      jed: () => createTerminalWorld(this.resources, 'jed', 'arrival'), 'jed-return': () => createTerminalWorld(this.resources, 'jed', 'departure'),
      boarding: () => createBoardingWorld(this.resources),
      'garuda-jed': () => createCabinWorld(this.resources, 'jeddah'), 'garuda-cgk': () => createCabinWorld(this.resources, 'jakarta'),
      'flight-jed': () => createFlightWorld(this.resources, 'jeddah'), 'flight-cgk': () => createFlightWorld(this.resources, 'jakarta'),
      haramain: () => createHaramainWorld(this.resources), 'madinah-station': () => createMadinahStationWorld(this.resources),
      rawdah: () => createRawdahWorld(this.resources), salam: () => createSalamWorld(this.resources), 'jeddah-bus': () => createJourneyWorld(this.resources, true),
    };
    let world = this.worlds.get(key);
    if (!world) {
      world = factories[key]();
      if (world.motion) this.resources.batch(world.motion.group);
      if (world.vehicle) this.resources.batch(world.vehicle); else if (world.flight) this.resources.batch(world.flight.aircraft);
      this.resources.batch(world.group); this.worlds.set(key, world);
    }
    this.world = world; this.worldKey = key; this.scene.add(world.group);
    if (world.crowd) {
      this.crowd = this.crowds.get(key) ?? new Pilgrims(this.resources, { ...world.crowd, count: Math.min(world.crowd.count, this.compact ? 90 : 220) });
      this.crowds.set(key, this.crowd); this.crowd.setAttire(['haram', 'sai', 'birali', 'tahallul'].includes(key) ? 'ihram' : 'travel'); this.scene.add(this.crowd.group);
    }
    this.setTime(this.state.timeOfDay ?? 'day');
    this.camera.fov = world.flight ? 50 : isFlightChapter(this.state.chapter) ? 68 : 64;
    // Flights see the ground to the horizon; the cabin still needs a close near plane.
    this.camera.near = world.flight ? .5 : .05; this.camera.far = world.telemetry ? 400000 : 2600;
    this.shot = -1;
    this.updateProjection();
    this.orbit.maxPolarAngle = world.flight ? Math.PI * .85 : Math.PI / 2 - .025;
    this.container.dispatchEvent(new CustomEvent('umroh-landmarks-changed', { bubbles: true }));
  }
  update(next: UmrohSceneState): void {
    if (this.disposed) return;
    const old = this.state;
    this.reducedMotion = next.reducedMotion ?? this.reducedMotion;
    this.state = { ...next, reducedMotion: this.reducedMotion, view: next.view ?? 'walk', flightCamera: next.flightCamera ?? 'auto', timeOfDay: next.timeOfDay ?? 'day', visit: next.visit ?? null };
    this.state.view = getTawafView(this.state);
    if (!next.visit && isFlightChapter(next.chapter)) this.state.view = getFlightPov(next.travelProgress ?? 0, this.state.flightCamera, this.reducedMotion) === 'exterior' ? 'overview' : 'follow';
    const key = this.keyFor(this.state), changed = key !== this.worldKey;
    if (changed) this.loadWorld(key);
    if (old.timeOfDay !== this.state.timeOfDay) this.setTime(this.state.timeOfDay!);
    if (this.world.motion) this.world.motion.group.position[this.world.motion.axis] = Math.max(0, Math.min(1, this.state.travelProgress ?? 0)) * this.world.motion.distance;
    if (changed || Math.abs((this.state.travelProgress ?? 0) - this.travel) > .03) this.travel = Math.max(0, Math.min(1, this.state.travelProgress ?? 0));
    if (changed) this.animateWorld(0);
    this.audio?.setEnabled(this.soundOn && Boolean(this.world.telemetry) && this.state.running && !this.state.paused);
    this.placeGuide();
    const framingChanged = old.guideOpen !== next.guideOpen && Boolean(this.world.flight);
    if (framingChanged) this.updateProjection();
    const progressRestored = isTawafScene(this.state) && old.progress !== this.state.progress && !old.running && !this.state.running && !this.state.paused;
    if (changed || framingChanged || progressRestored || old.stage !== next.stage || old.chapter !== next.chapter || old.view !== this.state.view || old.flightCamera !== this.state.flightCamera) { this.pauseInput(); this.resetCamera(); }
    if (isTawafScene(this.state) && old.running !== this.state.running) this.pauseInput();
    this.orbit.enabled = this.state.view !== 'walk' && !this.isSeatedView() && !this.isAutomaticFlightView() && !isGuidedTawaf(this.state) && !this.state.paused;
    if (isGuidedTawaf(this.state)) { this.pressed.clear(); this.forward = this.right = 0; this.frameTawaf(); }
    else if (isGuidedTawaf(old) && isTawafScene(this.state) && !this.state.paused && old.progress !== this.state.progress) this.frameTawaf();
    if (this.state.paused) this.pauseInput();
    const places: Record<WorldKey, string> = {
      nabawi: 'Pelataran Masjid Nabawi', birali: 'Masjid miqat Bir Ali', haram: 'Masjidil Haram dan Kaabah', sai: 'Koridor Safa dan Marwah', cabin: 'Kabin pesawat sebelum miqat', journey: 'Perjalanan menuju Makkah', tahallul: 'Tempat tahallul',
      home: 'Rumah di Indonesia dan taksi', 'taxi-cgk': 'Taksi menuju Soekarno–Hatta', 'taxi-home': 'Taksi menuju rumah', uber: 'Uber dari stasiun Madinah menuju Nabawi',
      cgk: 'Bandara Soekarno–Hatta, keberangkatan', 'cgk-return': 'Bandara Soekarno–Hatta, kedatangan', jed: 'Bandara King Abdulaziz Jeddah, kedatangan', 'jed-return': 'Bandara King Abdulaziz Jeddah, keberangkatan',
      'garuda-jed': 'Kabin Garuda Indonesia menuju Jeddah', 'garuda-cgk': 'Kabin Garuda Indonesia menuju Jakarta', haramain: 'Kereta cepat Haramain menuju Madinah', 'madinah-station': 'Stasiun Haramain Madinah',
      'flight-jed': 'Pesawat Garuda Indonesia terbang di atas awan menuju Jeddah', 'flight-cgk': 'Pesawat Garuda Indonesia terbang di atas awan menuju Jakarta',
      boarding: 'Gerbang keberangkatan, garbarata, dan kabin Garuda Indonesia',
      rawdah: 'Gambaran area Raudhah di Masjid Nabawi', salam: 'Koridor ziarah salam di luar pembatas ruang makam', 'jeddah-bus': 'Perjalanan pulang dari Makkah menuju bandara Jeddah',
    };
    const place = places[key];
    const tawafHint = this.state.view === 'walk' ? 'Kamera mengikuti putaran tawaf. Geser untuk melihat; jeda untuk berjalan bebas.' : 'Kamera mengikuti jamaah saat tawaf. Jeda untuk mengubah sudut pandang.';
    this.renderer.domElement.setAttribute('aria-label', `${place}. Rekonstruksi tiga dimensi. ${isGuidedTawaf(this.state) ? tawafHint : isTawafScene(this.state) && this.reducedMotion ? 'Gerak dikurangi: kamera kawasan tetap selama tawaf. Geser untuk melihat kawasan.' : isFlightChapter(this.state.chapter) ? 'Pilih POV otomatis, dalam kabin, atau luar pesawat.' : 'Geser untuk melihat; WASD atau tombol arah untuk berjalan setelah memilih area 3D.'}`);
  }
  private isRide(): boolean { return ['taxi-cgk', 'taxi-home', 'uber', 'haramain', 'garuda-jed', 'garuda-cgk', 'flight-jed', 'flight-cgk', 'journey', 'jeddah-bus', 'boarding'].includes(this.worldKey ?? ''); }
  private isSeatedView(): boolean { return this.state.view === 'follow' && this.isRide(); }
  private isAutomaticFlightView(): boolean { return Boolean(this.world?.flight) && this.state.flightCamera === 'auto' && !this.reducedMotion; }
  /** Cinematic outside shots chosen by flight phase: chase, runway spotter, belly, cruise orbit, approach. */
  private frameFlight(delta: number): void {
    const telemetry = this.world.telemetry; if (!telemetry) return;
    const p = this.travel, scale = this.flightFramingScale, heading = telemetry.heading;
    const offset = (x: number, y: number, z: number) => new T.Vector3(x * scale, y * scale, z * scale).applyAxisAngle(UP, heading);
    let shot: number, target: T.Vector3, fixed = false;
    if (p < .215) { shot = 0; target = offset(-24, 4.5, 46); }
    else if (p < .27) { shot = 1; target = telemetry.toScene(-68, 1.7, -470); fixed = true; }
    else if (p < .34) { shot = 2; target = offset(16, -12, 66); }
    else if (p < .66) { shot = 3; const a = -.7 + Math.max(0, (p - .5) / .16) * 2.6; target = offset(Math.sin(a) * 80, 13 + 5 * Math.sin(a * .7), Math.cos(a) * 80); }
    else if (p < .905) { shot = 4; target = offset(62, 9, -74); }
    else if (p < .957) { shot = 5; target = telemetry.toScene(-72, 1.7, -230, true); fixed = true; }
    else { shot = 6; target = offset(-30, 5, 42); }
    if (shot !== this.shot) { this.shot = shot; this.shotPosition.copy(target); }
    else if (fixed) this.shotPosition.copy(target);
    else this.shotPosition.lerp(target, Math.min(1, delta * 2.5));
    this.camera.position.copy(this.shotPosition);
    if (!this.reducedMotion && telemetry.shake > 0) {
      const t = this.elapsed, k = telemetry.shake * (fixed ? .02 : .12);
      this.camera.position.x += Math.sin(t * 41) * k; this.camera.position.y += Math.sin(t * 53 + 1) * k;
    }
    this.camera.lookAt(this.tmp.set(0, 0, -6).applyAxisAngle(UP, heading));
  }
  /** Seated eye point fixed to the cabin, so pitch, bank and bumps are felt through the window. */
  private placeSeated(delta: number): void {
    const seat = this.world.seat!, vehicle = this.world.vehicle!, telemetry = this.world.telemetry;
    vehicle.updateWorldMatrix(true, false);
    this.tmp.set(...seat.position);
    if (telemetry && !this.reducedMotion) {
      // Pressed back into the seat on the take-off roll, pulled forward by reverse thrust.
      const surge = telemetry.phase === 'takeoff' ? .06 : telemetry.phase === 'rotate' ? .04 : telemetry.phase === 'rollout' && telemetry.thrust < 0 ? -.05 : 0;
      this.surge += (surge - this.surge) * Math.min(1, delta * 3);
      const t = this.elapsed, k = telemetry.shake;
      this.tmp.z += this.surge; this.tmp.y += k * (.006 * Math.sin(t * 37) + .004 * Math.sin(t * 61)); this.tmp.x += k * .003 * Math.sin(t * 29);
    }
    this.camera.position.copy(this.tmp).applyMatrix4(vehicle.matrixWorld);
    this.euler.set(this.pitch, this.yaw, 0, 'YXZ'); this.seatQuaternion.setFromEuler(this.euler);
    vehicle.getWorldQuaternion(this.worldQuaternion);
    this.camera.quaternion.copy(this.worldQuaternion).multiply(this.seatQuaternion);
  }
  private placeOnRail(): void {
    const pose = this.world.rail!(this.travel);
    this.camera.position.set(...pose.position);
    this.tmp.set(...pose.lookAt).sub(this.camera.position).normalize();
    this.yaw = Math.atan2(-this.tmp.x, -this.tmp.z) + this.railYaw; this.pitch = Math.asin(T.MathUtils.clamp(this.tmp.y, -.95, .95)) + this.railPitch;
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }
  private animateWorld(delta: number): void {
    const world = this.world; if (!world?.animate) return;
    const frame = this.frameInfo;
    frame.chapter = this.state.chapter; frame.step = this.state.step ?? 0; frame.travel = this.travel; frame.time = this.elapsed; frame.delta = delta;
    frame.running = this.state.running && !this.state.paused; frame.reducedMotion = this.reducedMotion; frame.sunset = this.state.timeOfDay === 'sunset';
    frame.sky = world.telemetry ? this.sky : undefined;
    world.animate(frame);
    const telemetry = world.telemetry; if (!telemetry) return;
    // Inside the cloud layer the view closes in to a bright grey.
    const fog = this.scene.fog as T.Fog;
    if (telemetry.inCloud > .01) { fog.color.set('#e4eaee'); fog.near = 2; fog.far = T.MathUtils.lerp(45000, 90, telemetry.inCloud); }
    else { fog.color.set(frame.sunset ? '#e9b993' : '#d4e1e8'); fog.near = 1500; fog.far = 45000; }
    this.audio?.update(telemetry, this.isSeatedView(), delta);
  }
  private frameTawaf(): void {
    if (this.state.view === 'overview') return;
    const frame = getTawafCameraFrame(this.state.progress, this.state.view ?? 'walk', this.tawafLookYaw, this.tawafLookPitch, this.camera.aspect);
    this.camera.position.set(...frame.position);
    this.yaw = frame.yaw; this.pitch = frame.pitch;
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    this.orbit.target.set(...frame.target); this.lastFollow.copy(this.avatar);
  }
  private placeGuide(): void {
    const { stage, route, progress, visit } = this.state;
    const p = Math.max(0, Math.min(7, progress));
    if (visit === 'nabawi' || this.state.chapter === 'nabawi') { this.avatar.set(1, 0, 63); this.heading = Math.PI; }
    else if (this.state.chapter && this.state.chapter !== 'umroh') {
      const station = this.world.stations?.[this.state.chapter];
      const from = station?.position ?? this.world.spawn, to = station?.lookAt ?? this.world.lookAt;
      const [x, , z] = from;
      const direction = new T.Vector3(...to).sub(new T.Vector3(...from)); direction.y = 0; direction.normalize();
      const position = moveWithinWorld(x, z, direction.x * 3.5, direction.z * 3.5, this.world.bounds, this.world.blockers);
      this.avatar.set(position.x, 0, position.z); this.heading = Math.atan2(direction.x, direction.z);
    }
    else if (stage === 'tawaf') { const pose = getTawafRoutePose(p); this.avatar.set(...pose.position); this.heading = pose.heading; }
    else if (stage === 'sai') { const leg = p >= 7 ? 6 : Math.floor(p), amount = p >= 7 ? 1 : p - leg, outbound = leg % 2 === 0; this.avatar.set(0, 0, -SAI_END + SAI_END * 2 * (outbound ? amount : 1 - amount)); this.heading = outbound ? 0 : Math.PI; }
    else if (stage === 'salat') { this.avatar.set(MAQAM_POSITION.x, 0, MAQAM_POSITION.z + 6); this.heading = Math.atan2(-this.avatar.x, -this.avatar.z); }
    else if (stage === 'zamzam') { this.avatar.set(61, 0, 28); this.heading = Math.PI / 2; }
    else if (stage === 'masuk' || stage === 'selesai') { this.avatar.set(19, 0, 25); this.heading = Math.atan2(-19, -25); }
    else if (stage === 'tahallul') { this.avatar.set(0, 0, -2.5); this.heading = Math.PI; }
    else if (stage === 'perjalanan') { this.avatar.set(.77, .16, -.8); this.heading = Math.PI; }
    else if (route === 'pesawat') { this.avatar.set(0, 0, 5); this.heading = Math.PI; }
    else { this.avatar.set(0, 0, 15); this.heading = Math.PI; }
    // First-person stations (check-in, immigration, security, gate) need a clear view ahead.
    const station = this.state.chapter && !visit ? this.world.stations?.[this.state.chapter] : undefined;
    this.guide.group.visible = !this.isRide() && !(isTawafScene(this.state) && this.state.view === 'walk') && !(station && this.state.view === 'walk');
    this.guide.setAttire(!visit && (!this.state.chapter || this.state.chapter === 'umroh') && stage !== 'selesai' ? 'ihram' : 'travel');
    this.guide.pose(this.avatar, this.heading, this.state.running && !this.state.paused, this.state.pilgrim === 'putri');
  }
  /** Call from a click or key handler: browsers only start audio after a user gesture. */
  unlockAudio(): void {
    if (!this.soundOn) return;
    this.audio ??= FlightAudio.create();
    this.audio?.resume();
    this.audio?.setEnabled(Boolean(this.world?.telemetry) && this.state.running && !this.state.paused);
  }
  /** Never creates the audio context itself; that waits for unlockAudio from a gesture. */
  setSound(on: boolean): void {
    this.soundOn = on;
    this.audio?.setEnabled(on && Boolean(this.world?.telemetry) && this.state.running && !this.state.paused);
  }
  getLandmarks(): { id: string; label: string }[] { return this.world?.landmarks.map(({ id, label }) => ({ id, label })) ?? []; }
  jumpToLandmark(id: string): void {
    const landmark = this.world.landmarks.find((l) => l.id === id); if (!landmark) return;
    this.pauseInput(); this.camera.position.set(...landmark.position);
    if (this.state.view === 'walk' || this.isSeatedView()) this.lookAt(landmark.lookAt); else {
      this.orbit.target.set(...landmark.lookAt);
      if (this.world.flight) this.camera.position.sub(this.orbit.target).multiplyScalar(this.flightFramingScale).add(this.orbit.target);
      this.orbit.update();
    }
  }
  setMovement(forward: number, right: number): void { if (isGuidedTawaf(this.state)) return; this.forward = T.MathUtils.clamp(forward, -1, 1); this.right = T.MathUtils.clamp(right, -1, 1); }
  resetCamera(): void {
    if (!this.world) return;
    if (isTawafScene(this.state) && this.state.view !== 'overview') {
      // Discard any residual orbit inertia before handing control to the guided camera.
      this.orbit.enableDamping = false; this.orbit.update(); this.orbit.enableDamping = true;
      this.tawafLookYaw = this.tawafLookPitch = 0; this.frameTawaf();
      this.orbit.minDistance = 2.2; this.orbit.maxDistance = 38;
      return;
    }
    if (this.world.rail && this.state.view !== 'overview') {
      this.railYaw = this.railPitch = 0; this.placeOnRail(); return;
    }
    if (this.state.view === 'walk') {
      const station = this.state.chapter ? this.world.stations?.[this.state.chapter] : undefined;
      this.camera.position.set(...(station?.position ?? this.world.spawn)); let at = station?.lookAt ?? this.world.lookAt;
      if (!this.state.visit && (!this.state.chapter || this.state.chapter === 'umroh')) {
        if (this.state.stage === 'salat') { this.camera.position.set(MAQAM_POSITION.x, EYE_HEIGHT, MAQAM_POSITION.z + 9); at = [0, 5, 0]; }
        if (this.state.stage === 'zamzam') { this.camera.position.set(58, EYE_HEIGHT, 32); at = [64, 1.1, 28]; }
      }
      this.lookAt(at);
    } else if (this.world.rail) {
      this.railYaw = this.railPitch = 0; this.placeOnRail();
    } else if (this.state.view === 'follow' && this.isRide() && this.world.seat) {
      const [x, y, z] = this.world.seat.position, [lx, ly, lz] = this.world.seat.lookAt;
      this.tmp.set(lx - x, ly - y, lz - z).normalize();
      this.yaw = Math.atan2(-this.tmp.x, -this.tmp.z); this.pitch = Math.asin(T.MathUtils.clamp(this.tmp.y, -.95, .95));
      this.surge = 0; if (this.world.vehicle) this.placeSeated(0);
    } else if (this.state.view === 'follow' && this.isRide()) {
      this.camera.position.set(...this.world.spawn); this.lookAt(this.world.lookAt);
    } else if (this.state.view === 'follow') {
      this.orbit.target.copy(this.avatar).add(new T.Vector3(0, 1.3, 0));
      this.camera.position.copy(this.avatar).add(new T.Vector3(-Math.sin(this.heading) * 4.8, 2.6, -Math.cos(this.heading) * 4.8));
      this.lastFollow.copy(this.avatar); this.orbit.minDistance = 2.2; this.orbit.maxDistance = this.world.indoor ? 12 : 38; this.orbit.update();
    } else {
      this.camera.position.set(...this.world.overview); this.orbit.target.set(...this.world.lookAt);
      if (this.world.flight) this.camera.position.sub(this.orbit.target).multiplyScalar(this.flightFramingScale).add(this.orbit.target);
      this.orbit.minDistance = this.world.flight ? 55 * this.flightFramingScale : this.world.indoor ? 2 : 18; this.orbit.maxDistance = this.world.flight ? 170 * this.flightFramingScale : this.world.indoor ? 45 : 240; this.orbit.update();
    }
  }
  private lookAt(at: Position): void {
    this.tmp.set(...at).sub(this.camera.position).normalize();
    this.yaw = Math.atan2(-this.tmp.x, -this.tmp.z); this.pitch = Math.asin(T.MathUtils.clamp(this.tmp.y, -.95, .95));
    this.camera.rotation.order = 'YXZ'; this.camera.rotation.set(this.pitch, this.yaw, 0);
  }
  private pointerDown = (e: PointerEvent): void => {
    if ((this.state.view !== 'walk' && !this.isSeatedView()) || this.state.paused || this.pointer || e.button !== 0) return;
    this.renderer.domElement.focus({ preventScroll: true }); this.pointer = { id: e.pointerId, x: e.clientX, y: e.clientY }; this.renderer.domElement.setPointerCapture(e.pointerId);
  };
  private pointerMove = (e: PointerEvent): void => {
    if (!this.pointer || this.pointer.id !== e.pointerId || this.state.paused) return;
    const scale = 2.8 / Math.max(420, this.container.clientWidth);
    const dx = (e.clientX - this.pointer.x) * scale, dy = (e.clientY - this.pointer.y) * scale;
    if (this.world.rail && this.state.view !== 'overview') {
      // Look around while the boarding walk continues along its path.
      this.railYaw -= dx; this.railPitch = T.MathUtils.clamp(this.railPitch - dy, -.9, .9);
      this.pointer.x = e.clientX; this.pointer.y = e.clientY; return;
    }
    this.yaw -= dx; this.pitch = T.MathUtils.clamp(this.pitch - dy, -1.25, 1.3);
    if (isTawafScene(this.state) && this.state.view === 'walk') {
      // Store the glance relative to the route, not as a fixed world direction.
      const baseFrame = getTawafCameraFrame(this.state.progress, 'walk', 0, 0, this.camera.aspect);
      this.tawafLookYaw = this.yaw - baseFrame.yaw;
      this.tawafLookPitch = this.pitch - baseFrame.pitch;
    }
    this.pointer.x = e.clientX; this.pointer.y = e.clientY; this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  };
  private pointerUp = (e: PointerEvent): void => { if (this.pointer?.id === e.pointerId) this.pointer = null; };
  private keyDown = (e: KeyboardEvent): void => {
    if (this.state.view !== 'walk' || this.state.paused || isGuidedTawaf(this.state) || document.activeElement !== this.renderer.domElement) return;
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) { e.preventDefault(); this.pressed.add(e.code); }
  };
  private keyUp = (e: KeyboardEvent): void => { this.pressed.delete(e.code); };
  private pauseInput = (): void => { this.pressed.clear(); this.forward = this.right = 0; this.pointer = null; };
  private walk(delta: number): void {
    if (this.world.rail) return;
    const f = this.forward + Number(this.pressed.has('KeyW') || this.pressed.has('ArrowUp')) - Number(this.pressed.has('KeyS') || this.pressed.has('ArrowDown'));
    const r = this.right + Number(this.pressed.has('KeyD') || this.pressed.has('ArrowRight')) - Number(this.pressed.has('KeyA') || this.pressed.has('ArrowLeft'));
    const length = Math.max(1, Math.hypot(f, r));
    const dx = (-Math.sin(this.yaw) * f + Math.cos(this.yaw) * r) / length * delta * 3.2;
    const dz = (-Math.cos(this.yaw) * f - Math.sin(this.yaw) * r) / length * delta * 3.2;
    const position = moveWithinWorld(this.camera.position.x, this.camera.position.z, dx, dz, this.world.bounds, this.world.blockers);
    this.camera.position.x = position.x; this.camera.position.z = position.z;
  }
  private updateProjection(): void {
    const width = Math.max(1, this.container.clientWidth), height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.clearViewOffset();
    this.flightFramingScale = 1;
    if (this.world?.flight) {
      const panel = this.state.guideOpen ? this.container.closest('.umroh-app')?.querySelector<HTMLElement>('.umroh-panel') : null;
      const bounds = panel?.getBoundingClientRect();
      // Reserve the actual desktop guide width; the mobile guide is an overlay.
      const inset = bounds && bounds.width < width * .55 ? Math.max(0, this.container.getBoundingClientRect().right - bounds.left + 18) : 0;
      this.flightFramingScale = Math.max(1, 1.25 * height / Math.max(1, width - inset));
      if (inset) this.camera.setViewOffset(width, height, inset / 2, 0, width, height);
    }
    this.camera.updateProjectionMatrix();
  }
  private resize = (): void => {
    this.updateProjection();
    this.renderer.setSize(Math.max(1, this.container.clientWidth), Math.max(1, this.container.clientHeight), false);
    if (this.world?.flight) { this.resetCamera(); this.shot = -1; }
  };
  private updateCamera(delta: number): void {
    if (this.world.rail && this.state.view !== 'overview') { this.placeOnRail(); return; }
    if (this.world.seat && this.world.vehicle && this.isSeatedView()) { this.placeSeated(delta); return; }
    if (this.isAutomaticFlightView()) { if (!this.state.paused) this.frameFlight(delta); return; }
    if (!this.state.paused) {
      if (isGuidedTawaf(this.state)) this.frameTawaf();
      else {
        if (this.state.view === 'walk') this.walk(delta);
        if (this.state.view === 'follow' && !this.isRide()) { this.tmp.copy(this.avatar).sub(this.lastFollow); this.camera.position.add(this.tmp); this.orbit.target.add(this.tmp); this.lastFollow.copy(this.avatar); }
      }
    }
    if (this.state.view !== 'walk' && !this.isSeatedView() && !this.isAutomaticFlightView() && !isGuidedTawaf(this.state) && !this.state.paused) this.orbit.update();
    if (this.state.view === 'follow' && !this.isRide() && !isGuidedTawaf(this.state) && !this.state.paused) {
      const safe = moveWithinWorld(this.avatar.x, this.avatar.z, this.camera.position.x - this.avatar.x, this.camera.position.z - this.avatar.z, this.world.bounds, this.world.blockers, .35);
      this.camera.position.x = safe.x; this.camera.position.z = safe.z; this.camera.lookAt(this.orbit.target);
    }
  }
  private tick = (time: number): void => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.tick);
    const delta = this.lastTime ? Math.min((time - this.lastTime) / 1000, .05) : 0; this.lastTime = time;
    if (this.contextLost || document.visibilityState !== 'visible') return;
    this.elapsed += delta;
    if (this.cumulus.visible && !this.reducedMotion) this.cumulus.rotation.y += delta * .004;
    const target = Math.max(0, Math.min(1, this.state.travelProgress ?? 0));
    this.travel += (target - this.travel) * Math.min(1, delta * 7);
    this.animateWorld(delta);
    this.updateCamera(delta);
    this.crowdTime += delta;
    if (this.crowdTime > (this.compact ? 1 / 20 : 1 / 30)) { const animate = !this.reducedMotion && !this.state.paused; this.crowd?.update(this.crowdTime, animate, this.camera.position); this.guide.update(this.crowdTime, animate); this.crowdTime = 0; }
    this.renderer.render(this.scene, this.camera);
  };
  private onContextLost = (event: Event): void => { event.preventDefault(); this.contextLost = true; this.pauseInput(); this.container.dispatchEvent(new CustomEvent('umroh-context-lost', { bubbles: true })); };
  private onContextRestored = (): void => { this.contextLost = false; this.lastTime = 0; this.container.dispatchEvent(new CustomEvent('umroh-context-restored', { bubbles: true })); };
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true; cancelAnimationFrame(this.frame); this.observer.disconnect(); this.orbit.dispose();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.pointerDown); canvas.removeEventListener('pointermove', this.pointerMove); canvas.removeEventListener('pointerup', this.pointerUp); canvas.removeEventListener('pointercancel', this.pointerUp);
    canvas.removeEventListener('webglcontextlost', this.onContextLost); canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
    window.removeEventListener('keydown', this.keyDown); window.removeEventListener('keyup', this.keyUp); window.removeEventListener('blur', this.pauseInput); document.removeEventListener('visibilitychange', this.pauseInput);
    this.crowds.forEach((crowd) => crowd.dispose()); this.crowds.clear(); this.guide.dispose();
    this.worlds.forEach((world) => {
      const characterDisposers: (() => void)[] = [];
      world.group.traverse((object) => {
        if (typeof object.userData.disposeCharacters === 'function') characterDisposers.push(object.userData.disposeCharacters);
        if (object instanceof T.InstancedMesh) object.dispose();
      });
      characterDisposers.forEach((dispose) => dispose());
    });
    this.audio?.dispose(); this.audio = null;
    this.resources.dispose(); this.environment?.dispose(); this.sky.geometry.dispose(); this.sky.material.dispose(); this.sun.shadow.dispose();
    this.dome.geometry.dispose(); this.dome.material.dispose();
    this.renderer.dispose(); this.renderer.forceContextLoss(); canvas.remove(); this.worlds.clear();
  }
}
