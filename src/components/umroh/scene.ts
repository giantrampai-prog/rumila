import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import type { UmrohStage } from '@/lib/umroh';
import { Resources } from './realistic/resources';
import { createNabawiWorld, createBirAliWorld } from './realistic/madinah';
import { createHaramWorld, createSaiWorld } from './realistic/haram';
import { createCabinWorld, createJourneyWorld, createTahallulWorld } from './realistic/travel';
import { Pilgrims } from './realistic/pilgrims';
import type { UmrohWorld, Position } from './realistic/types';
import { moveWithinWorld } from './realistic/navigation';

export type { UmrohStage };
export interface UmrohSceneState {
  stage: UmrohStage;
  route: 'madinah' | 'pesawat';
  pilgrim: 'putra' | 'putri';
  progress: number;
  running: boolean;
  view?: 'walk' | 'follow' | 'overview';
  timeOfDay?: 'day' | 'sunset';
  visit?: 'nabawi' | null;
  paused?: boolean;
}
type WorldKey = 'nabawi' | 'birali' | 'cabin' | 'journey' | 'haram' | 'sai' | 'tahallul';
const EYE_HEIGHT = 1.68, TAWAF_RADIUS = 22, SAI_END = 75;

/** Walkable human-scale reconstruction; architecture and PBR textures share GPU resources. */
export class UmrohScene {
  private renderer: T.WebGLRenderer;
  private scene = new T.Scene();
  private camera = new T.PerspectiveCamera(64, 1, .065, 2600);
  private orbit: OrbitControls;
  private resources: Resources;
  private sky = new Sky();
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
  private state: UmrohSceneState = { stage: 'persiapan', route: 'madinah', pilgrim: 'putra', progress: 0, running: false, view: 'walk', timeOfDay: 'day', visit: null };
  private frame = 0;
  private lastTime = 0;
  private crowdTime = 0;
  private disposed = false;
  private contextLost = false;
  private yaw = 0;
  private pitch = 0;
  private pointer: { id: number; x: number; y: number } | null = null;
  private pressed = new Set<string>();
  private forward = 0;
  private right = 0;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private compact = window.matchMedia('(max-width: 800px)').matches;
  private lastFollow = new T.Vector3();
  private tmp = new T.Vector3();

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
    this.sky.scale.setScalar(1800); this.scene.add(this.sky);
    Object.assign(this.sky.material.uniforms.turbidity, { value: 3 });
    this.sky.material.uniforms.rayleigh.value = 1.7;
    this.sky.material.uniforms.mieCoefficient.value = .005;
    this.sky.material.uniforms.mieDirectionalG.value = .8;
    this.setTime('day'); this.makeEnvironment();
    this.orbit = new OrbitControls(this.camera, canvas);
    this.orbit.enableDamping = true; this.orbit.dampingFactor = .09; this.orbit.enablePan = false;
    this.orbit.minDistance = 2.2; this.orbit.maxDistance = 220; this.orbit.maxPolarAngle = Math.PI / 2 - .025; this.orbit.enabled = false;
    this.guide = new Pilgrims(this.resources, { kind: 'walk', count: 1 }, true); this.scene.add(this.guide.group);
    this.observer = new ResizeObserver(this.resize); this.observer.observe(container);
    canvas.addEventListener('pointerdown', this.pointerDown); canvas.addEventListener('pointermove', this.pointerMove);
    canvas.addEventListener('pointerup', this.pointerUp); canvas.addEventListener('pointercancel', this.pointerUp);
    canvas.addEventListener('webglcontextlost', this.onContextLost); canvas.addEventListener('webglcontextrestored', this.onContextRestored);
    window.addEventListener('keydown', this.keyDown); window.addEventListener('keyup', this.keyUp);
    window.addEventListener('blur', this.pauseInput); document.addEventListener('visibilitychange', this.pauseInput);
    try { this.resize(); this.update(this.state); this.frame = requestAnimationFrame(this.tick); }
    catch (error) { this.dispose(); throw error; }
  }
  private makeEnvironment(): void {
    const pmrem = new T.PMREMGenerator(this.renderer);
    const env = new T.Scene(); env.add(this.sky.clone());
    this.environment = pmrem.fromScene(env, .04, .1, 2200);
    this.scene.environment = this.environment.texture; this.scene.environmentIntensity = .15; pmrem.dispose();
  }
  private setTime(time: 'day' | 'sunset'): void {
    const sunset = time === 'sunset';
    const direction = new T.Vector3(-.45, sunset ? .13 : .75, .45).normalize();
    this.sky.material.uniforms.sunPosition.value.copy(direction);
    this.sky.material.uniforms.turbidity.value = sunset ? 5 : 3;
    this.sun.color.set(sunset ? '#ffd2a2' : '#fff2dc'); this.sun.intensity = sunset ? 1.8 : 2.8;
    this.sun.position.copy(direction).multiplyScalar(170);
    this.hemisphere.intensity = this.world?.indoor ? 1.45 : sunset ? .55 : .7;
    this.hemisphere.color.set(sunset ? '#d7c8c1' : '#dbe7ef');
    this.renderer.toneMappingExposure = sunset ? .66 : .7;
    this.scene.fog = new T.Fog(sunset ? '#d6bba0' : '#c6d2d4', 170, 1100);
  }
  private keyFor(state: UmrohSceneState): WorldKey {
    if (state.visit === 'nabawi') return 'nabawi';
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
    };
    let world = this.worlds.get(key);
    if (!world) { world = factories[key](); this.resources.batch(world.group); this.worlds.set(key, world); }
    this.world = world; this.worldKey = key; this.scene.add(world.group);
    if (world.crowd) {
      this.crowd = this.crowds.get(key) ?? new Pilgrims(this.resources, { ...world.crowd, count: Math.min(world.crowd.count, this.compact ? 90 : 220) });
      this.crowds.set(key, this.crowd); this.scene.add(this.crowd.group);
    }
    this.setTime(this.state.timeOfDay ?? 'day');
    this.container.dispatchEvent(new CustomEvent('umroh-landmarks-changed', { bubbles: true }));
  }
  update(next: UmrohSceneState): void {
    if (this.disposed) return;
    const old = this.state;
    this.state = { ...next, view: next.view ?? 'walk', timeOfDay: next.timeOfDay ?? 'day', visit: next.visit ?? null };
    const key = this.keyFor(this.state), changed = key !== this.worldKey;
    if (changed) this.loadWorld(key);
    if (old.timeOfDay !== this.state.timeOfDay) this.setTime(this.state.timeOfDay!);
    this.placeGuide();
    if (changed || old.stage !== next.stage || old.view !== this.state.view) { this.pauseInput(); this.resetCamera(); }
    this.orbit.enabled = this.state.view !== 'walk' && !this.state.paused;
    if (this.state.paused) this.pauseInput();
    const place = key === 'nabawi' ? 'Pelataran Masjid Nabawi' : key === 'birali' ? 'Masjid miqat Bir Ali' : key === 'haram' ? 'Masjidil Haram dan Kaabah' : key === 'sai' ? 'Koridor Safa dan Marwah' : key === 'cabin' ? 'Kabin pesawat sebelum miqat' : key === 'journey' ? 'Perjalanan menuju Makkah' : 'Tempat tahallul';
    this.renderer.domElement.setAttribute('aria-label', `${place}. Rekonstruksi tiga dimensi. Geser untuk melihat; WASD atau tombol arah untuk berjalan setelah memilih area 3D.`);
  }
  private placeGuide(): void {
    const { stage, route, progress, visit } = this.state;
    const p = Math.max(0, Math.min(7, progress));
    if (visit === 'nabawi') { this.avatar.set(1, 0, 63); this.heading = Math.PI; }
    else if (stage === 'tawaf') { const angle = Math.PI / 4 - p * Math.PI * 2; this.avatar.set(Math.cos(angle) * TAWAF_RADIUS, 0, Math.sin(angle) * TAWAF_RADIUS); this.heading = Math.PI - angle; }
    else if (stage === 'sai') { const leg = p >= 7 ? 6 : Math.floor(p), amount = p >= 7 ? 1 : p - leg, outbound = leg % 2 === 0; this.avatar.set(0, 0, -SAI_END + SAI_END * 2 * (outbound ? amount : 1 - amount)); this.heading = outbound ? 0 : Math.PI; }
    else if (stage === 'salat') { this.avatar.set(14, 0, 15); this.heading = Math.atan2(-14, -15); }
    else if (stage === 'zamzam') { this.avatar.set(61, 0, 28); this.heading = Math.PI / 2; }
    else if (stage === 'masuk' || stage === 'selesai') { this.avatar.set(19, 0, 25); this.heading = Math.atan2(-19, -25); }
    else if (stage === 'tahallul') { this.avatar.set(0, 0, -2.5); this.heading = Math.PI; }
    else if (stage === 'perjalanan') { this.avatar.set(.77, .16, -.8); this.heading = Math.PI; }
    else if (route === 'pesawat') { this.avatar.set(0, 0, 5); this.heading = Math.PI; }
    else { this.avatar.set(0, 0, 15); this.heading = Math.PI; }
    this.guide.group.visible = this.worldKey !== 'journey';
    this.guide.pose(this.avatar, this.heading, this.state.running && !this.state.paused, this.state.pilgrim === 'putri');
  }
  getLandmarks(): { id: string; label: string }[] { return this.world?.landmarks.map(({ id, label }) => ({ id, label })) ?? []; }
  jumpToLandmark(id: string): void {
    const landmark = this.world.landmarks.find((l) => l.id === id); if (!landmark) return;
    this.pauseInput(); this.camera.position.set(...landmark.position);
    if (this.state.view === 'walk') this.lookAt(landmark.lookAt); else { this.orbit.target.set(...landmark.lookAt); this.orbit.update(); }
  }
  setMovement(forward: number, right: number): void { this.forward = T.MathUtils.clamp(forward, -1, 1); this.right = T.MathUtils.clamp(right, -1, 1); }
  resetCamera(): void {
    if (!this.world) return;
    if (this.state.view === 'walk') {
      this.camera.position.set(...this.world.spawn); let at = this.world.lookAt;
      if (!this.state.visit) {
        if (this.state.stage === 'salat') { this.camera.position.set(18, EYE_HEIGHT, 22); at = [0, 5, 0]; }
        if (this.state.stage === 'zamzam') { this.camera.position.set(58, EYE_HEIGHT, 32); at = [64, 1.1, 28]; }
      }
      this.lookAt(at);
    } else if (this.state.view === 'follow') {
      this.orbit.target.copy(this.avatar).add(new T.Vector3(0, 1.3, 0));
      this.camera.position.copy(this.avatar).add(new T.Vector3(-Math.sin(this.heading) * 4.8, 2.6, -Math.cos(this.heading) * 4.8));
      this.lastFollow.copy(this.avatar); this.orbit.minDistance = 2.2; this.orbit.maxDistance = this.world.indoor ? 12 : 38; this.orbit.update();
    } else {
      this.camera.position.set(...this.world.overview); this.orbit.target.set(...this.world.lookAt);
      this.orbit.minDistance = this.world.indoor ? 2 : 18; this.orbit.maxDistance = this.world.indoor ? 45 : 240; this.orbit.update();
    }
  }
  private lookAt(at: Position): void {
    this.tmp.set(...at).sub(this.camera.position).normalize();
    this.yaw = Math.atan2(-this.tmp.x, -this.tmp.z); this.pitch = Math.asin(T.MathUtils.clamp(this.tmp.y, -.95, .95));
    this.camera.rotation.order = 'YXZ'; this.camera.rotation.set(this.pitch, this.yaw, 0);
  }
  private pointerDown = (e: PointerEvent): void => {
    if (this.state.view !== 'walk' || this.state.paused || this.pointer || e.button !== 0) return;
    this.renderer.domElement.focus({ preventScroll: true }); this.pointer = { id: e.pointerId, x: e.clientX, y: e.clientY }; this.renderer.domElement.setPointerCapture(e.pointerId);
  };
  private pointerMove = (e: PointerEvent): void => {
    if (!this.pointer || this.pointer.id !== e.pointerId || this.state.paused) return;
    const scale = 2.8 / Math.max(420, this.container.clientWidth);
    this.yaw -= (e.clientX - this.pointer.x) * scale; this.pitch = T.MathUtils.clamp(this.pitch - (e.clientY - this.pointer.y) * scale, -1.25, 1.3);
    this.pointer.x = e.clientX; this.pointer.y = e.clientY; this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  };
  private pointerUp = (e: PointerEvent): void => { if (this.pointer?.id === e.pointerId) this.pointer = null; };
  private keyDown = (e: KeyboardEvent): void => {
    if (this.state.view !== 'walk' || this.state.paused || document.activeElement !== this.renderer.domElement) return;
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) { e.preventDefault(); this.pressed.add(e.code); }
  };
  private keyUp = (e: KeyboardEvent): void => { this.pressed.delete(e.code); };
  private pauseInput = (): void => { this.pressed.clear(); this.forward = this.right = 0; this.pointer = null; };
  private walk(delta: number): void {
    const f = this.forward + Number(this.pressed.has('KeyW') || this.pressed.has('ArrowUp')) - Number(this.pressed.has('KeyS') || this.pressed.has('ArrowDown'));
    const r = this.right + Number(this.pressed.has('KeyD') || this.pressed.has('ArrowRight')) - Number(this.pressed.has('KeyA') || this.pressed.has('ArrowLeft'));
    const length = Math.max(1, Math.hypot(f, r));
    const dx = (-Math.sin(this.yaw) * f + Math.cos(this.yaw) * r) / length * delta * 3.2;
    const dz = (-Math.cos(this.yaw) * f - Math.sin(this.yaw) * r) / length * delta * 3.2;
    const position = moveWithinWorld(this.camera.position.x, this.camera.position.z, dx, dz, this.world.bounds, this.world.blockers);
    this.camera.position.x = position.x; this.camera.position.z = position.z;
  }
  private resize = (): void => { const width = Math.max(1, this.container.clientWidth), height = Math.max(1, this.container.clientHeight); this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.renderer.setSize(width, height, false); };
  private tick = (time: number): void => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.tick);
    const delta = this.lastTime ? Math.min((time - this.lastTime) / 1000, .05) : 0; this.lastTime = time;
    if (this.contextLost || document.visibilityState !== 'visible') return;
    if (!this.state.paused) {
      if (this.state.view === 'walk') this.walk(delta);
      if (this.state.view === 'follow') { this.tmp.copy(this.avatar).sub(this.lastFollow); this.camera.position.add(this.tmp); this.orbit.target.add(this.tmp); this.lastFollow.copy(this.avatar); }
    }
    if (this.state.view !== 'walk') this.orbit.update();
    if (this.state.view === 'follow') {
      const safe = moveWithinWorld(this.avatar.x, this.avatar.z, this.camera.position.x - this.avatar.x, this.camera.position.z - this.avatar.z, this.world.bounds, this.world.blockers, .35);
      this.camera.position.x = safe.x; this.camera.position.z = safe.z; this.camera.lookAt(this.orbit.target);
    }
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
    this.crowds.forEach((crowd) => crowd.dispose()); this.crowds.clear(); this.guide.dispose(); this.resources.dispose(); this.environment?.dispose(); this.sky.geometry.dispose(); this.sky.material.dispose(); this.sun.shadow.dispose();
    this.renderer.dispose(); this.renderer.forceContextLoss(); canvas.remove(); this.worlds.clear();
  }
}
