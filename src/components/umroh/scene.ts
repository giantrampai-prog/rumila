import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type UmrohStage = 'persiapan' | 'miqat' | 'perjalanan' | 'masuk' | 'tawaf' | 'salat' | 'zamzam' | 'sai' | 'tahallul' | 'selesai';
export interface UmrohSceneState {
  stage: UmrohStage;
  route: 'madinah' | 'pesawat';
  pilgrim: 'putra' | 'putri';
  /** Completed laps/traversals plus the fraction currently travelled. The UI owns this value. */
  progress: number;
  running: boolean;
}

const COLORS = {
  sand: '#e7cba1', cream: '#fff6df', white: '#fffdf3', stone: '#d7b98e',
  teal: '#087c77', darkTeal: '#075956', gold: '#d7a847', ink: '#24282e',
  green: '#4ad9a2', sky: '#d3ebed', skin: '#c98d65', leaf: '#548f68',
};
const TAWAF_RADIUS = 10.7;
const START_ANGLE = Math.PI / 4;
const SAI_END = 14;
const Y_AXIS = new T.Vector3(0, 1, 0);

/** Original schematic geometry: no downloaded models, images, or audio. */
export class UmrohScene {
  private renderer: T.WebGLRenderer;
  private scene = new T.Scene();
  private camera = new T.PerspectiveCamera(42, 1, 0.1, 220);
  private controls: OrbitControls;
  private observer: ResizeObserver | null = null;
  private frame = 0;
  private disposed = false;
  private contextLost = false;
  private time = 0;
  private previousTime = 0;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private state: UmrohSceneState = { stage: 'persiapan', route: 'madinah', pilgrim: 'putra', progress: 0, running: false };
  private materials = new Map<string, T.MeshStandardMaterial>();
  private geometries = new Map<string, T.BufferGeometry>();
  private mosque = new T.Group();
  private cabin = new T.Group();
  private desert = new T.Group();
  private haram = new T.Group();
  private sai = new T.Group();
  private trim = new T.Group();
  private avatar = new T.Group();
  private male = new T.Group();
  private female = new T.Group();
  private shadow = new T.Mesh();
  private halo = new T.Group();
  private routeRing = new T.Group();
  private routeArc!: T.Line;
  private bus = new T.Group();
  private clouds: T.Group[] = [];
  private destination = new T.Vector3();
  private cameraPosition = new T.Vector3();

  constructor(private container: HTMLElement) {
    this.renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    const canvas = this.renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.touchAction = 'none';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Simulasi tiga dimensi perjalanan umroh. Geser untuk memutar sudut pandang dan cubit untuk memperbesar.');
    canvas.addEventListener('webglcontextlost', this.onContextLost);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored);
    container.appendChild(canvas);
    this.scene.background = new T.Color(COLORS.sky);
    this.scene.fog = new T.Fog(COLORS.sky, 65, 130);
    this.scene.add(new T.HemisphereLight('#fff9e9', '#96b6ab', 2.3));
    const sun = new T.DirectionalLight('#fff4dc', 3.2);
    sun.position.set(-18, 34, 24);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -28;
    sun.shadow.camera.right = 28;
    sun.shadow.camera.top = 25;
    sun.shadow.camera.bottom = -25;
    sun.shadow.camera.far = 110;
    sun.shadow.normalBias = 0.035;
    sun.shadow.bias = -0.00015;
    this.scene.add(sun);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.enablePan = false;
    this.controls.minPolarAngle = 0.15;
    this.controls.maxPolarAngle = Math.PI / 2.12;
    this.controls.minDistance = 14;
    this.controls.maxDistance = 62;
    this.controls.rotateSpeed = 0.65;
    this.controls.zoomSpeed = 0.7;
    try {
      this.makeMosque();
      this.makeCabin();
      this.makeDesert();
      this.makeHaram();
      this.makeSai();
      this.makeTrim();
      this.makeAvatar();
      this.scene.add(this.mosque, this.cabin, this.desert, this.haram, this.sai, this.trim, this.avatar, this.halo);
      this.observer = new ResizeObserver(this.resize);
      this.observer.observe(container);
      this.resize();
      this.update(this.state);
      this.resetCamera();
      this.frame = requestAnimationFrame(this.tick);
    } catch (error) {
      this.observer?.disconnect();
      this.controls.dispose();
      this.releaseResources();
      canvas.removeEventListener('webglcontextlost', this.onContextLost);
      canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
      this.renderer.dispose();
      canvas.remove();
      throw error;
    }
  }

  private material(color: string, metalness = 0): T.MeshStandardMaterial {
    const key = `${color}/${metalness}`;
    let material = this.materials.get(key);
    if (!material) {
      material = new T.MeshStandardMaterial({ color, roughness: metalness ? 0.43 : 0.8, metalness });
      this.materials.set(key, material);
    }
    return material;
  }

  private geometry(key: string, create: () => T.BufferGeometry): T.BufferGeometry {
    let result = this.geometries.get(key);
    if (!result) {
      result = create();
      this.geometries.set(key, result);
    }
    return result;
  }

  private box(parent: T.Object3D, size: [number, number, number], at: [number, number, number], color: string, metalness = 0): T.Mesh {
    const object = new T.Mesh(this.geometry('box', () => new T.BoxGeometry(1, 1, 1)), this.material(color, metalness));
    object.scale.set(...size);
    object.position.set(...at);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  private cylinder(parent: T.Object3D, top: number, bottom: number, height: number, at: [number, number, number], color: string, segments = 16): T.Mesh {
    const key = `cylinder-${top}-${bottom}-${height}-${segments}`;
    const object = new T.Mesh(this.geometry(key, () => new T.CylinderGeometry(top, bottom, height, segments)), this.material(color));
    object.position.set(...at);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  private sphere(parent: T.Object3D, radius: number, at: [number, number, number], color: string, scale: [number, number, number] = [1, 1, 1]): T.Mesh {
    const object = new T.Mesh(this.geometry('sphere', () => new T.SphereGeometry(1, 16, 12)), this.material(color));
    object.position.set(...at);
    object.scale.set(radius * scale[0], radius * scale[1], radius * scale[2]);
    object.castShadow = true;
    parent.add(object);
    return object;
  }

  private label(parent: T.Object3D, title: string, subtitle: string, at: [number, number, number], width = 5.4): T.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 216;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Tidak dapat membuat label simulasi 3D.');
    ctx.fillStyle = '#075956';
    ctx.beginPath();
    ctx.roundRect(5, 5, 758, 206, 40);
    ctx.fill();
    ctx.strokeStyle = '#e3c880';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#fff9e9';
    ctx.font = 'bold 66px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 384, subtitle ? 83 : 110, 710);
    if (subtitle) {
      ctx.fillStyle = '#e2d8b7';
      ctx.font = '34px system-ui, sans-serif';
      ctx.fillText(subtitle, 384, 151, 710);
    }
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    const label = new T.Sprite(new T.SpriteMaterial({ map: texture, depthWrite: false, toneMapped: false }));
    label.position.set(...at);
    label.scale.set(width, width * 216 / 768, 1);
    parent.add(label);
    return label;
  }

  private floor(parent: T.Group, width: number, depth: number, color = COLORS.cream): void {
    this.box(parent, [width, 0.7, depth], [0, -0.4, 0], COLORS.stone);
    this.box(parent, [width - 0.35, 0.12, depth - 0.35], [0, 0.01, 0], color);
    this.box(parent, [width + 1.2, 0.25, depth + 1.2], [0, -0.86, 0], COLORS.sand);
  }

  private palm(parent: T.Group, x: number, z: number, size = 1): void {
    const palm = new T.Group();
    palm.position.set(x, 0, z);
    palm.scale.setScalar(size);
    this.cylinder(palm, 0.16, 0.27, 3.5, [0, 1.75, 0], '#aa815a');
    for (let index = 0; index < 6; index += 1) {
      const angle = index / 6 * Math.PI * 2;
      const leaf = this.sphere(palm, 1, [Math.sin(angle) * 0.8, 3.65, Math.cos(angle) * 0.8], COLORS.leaf, [0.35, 0.16, 1.4]);
      leaf.rotation.y = angle;
      leaf.rotation.x = -0.22;
    }
    parent.add(palm);
  }

  /** A semicircular arch in the XY plane, opening toward the viewer. */
  private arch(parent: T.Group, x: number, y: number, z: number, radius: number, color = COLORS.cream): void {
    const arc = this.geometry(`arch-${radius}`, () => new T.TorusGeometry(radius, 0.17, 5, 16, Math.PI));
    const arch = new T.Mesh(arc, this.material(color));
    arch.position.set(x, y, z);
    parent.add(arch);
  }

  private minaret(parent: T.Group, x: number, z: number, height = 11): void {
    this.box(parent, [1.7, 1.1, 1.7], [x, 0.55, z], COLORS.cream);
    this.cylinder(parent, 0.42, 0.62, height, [x, height / 2, z], COLORS.cream);
    this.cylinder(parent, 0.85, 0.85, 0.3, [x, height * 0.65, z], COLORS.gold);
    this.cylinder(parent, 0.72, 0.72, 0.25, [x, height * 0.88, z], COLORS.cream);
    this.cylinder(parent, 0, 0.48, 1.5, [x, height + 0.6, z], COLORS.teal);
    this.sphere(parent, 0.18, [x, height + 1.55, z], COLORS.gold);
  }

  private makeMosque(): void {
    this.floor(this.mosque, 34, 26);
    this.box(this.mosque, [23, 5.2, 7], [0, 2.6, -7.5], COLORS.sand);
    this.box(this.mosque, [24, 0.3, 7.6], [0, 5.3, -7.5], COLORS.cream);
    for (let index = -3; index <= 3; index += 1) {
      this.box(this.mosque, [2.05, 2.7, 0.12], [index * 3.05, 1.4, -3.94], COLORS.darkTeal);
      this.arch(this.mosque, index * 3.05, 2.7, -3.75, 1.08);
      this.box(this.mosque, [0.26, 2.8, 0.5], [index * 3.05 - 1.13, 1.4, -3.75], COLORS.cream);
      this.box(this.mosque, [0.26, 2.8, 0.5], [index * 3.05 + 1.13, 1.4, -3.75], COLORS.cream);
    }
    const dome = new T.Mesh(this.geometry('mosque-dome', () => new T.SphereGeometry(3.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2)), this.material(COLORS.teal));
    dome.position.set(0, 5.35, -7.5);
    dome.scale.y = 0.72;
    this.mosque.add(dome);
    this.cylinder(this.mosque, 0.05, 0.05, 0.8, [0, 7.9, -7.5], COLORS.gold);
    this.minaret(this.mosque, -12.5, -8, 10);
    this.minaret(this.mosque, 12.5, -8, 10);
    this.palm(this.mosque, -12, 5, 1.15);
    this.palm(this.mosque, 12, 5, 1.15);
    this.label(this.mosque, 'MIQAT BIR ALI', 'Dzulhulaifah · dari Madinah', [0, 8.5, -4], 10);
    this.box(this.mosque, [5.2, 0.035, 7.5], [0, 0.09, 4], '#b8d8c7');
    for (const x of [-2.45, 2.45]) this.box(this.mosque, [0.09, 0.045, 7.5], [x, 0.12, 4], COLORS.gold);
    const bag = this.box(this.mosque, [0.9, 1.15, 0.5], [2, 0.65, 5], COLORS.teal);
    bag.rotation.y = -0.2;
    this.box(this.mosque, [0.38, 0.1, 0.14], [2, 1.45, 5], COLORS.gold);
    for (const x of [1.75, 2.25]) this.sphere(this.mosque, 0.1, [x, 0.15, 5], COLORS.ink);
  }

  private makeCabin(): void {
    this.floor(this.cabin, 27, 13, '#e5e8e4');
    this.box(this.cabin, [25, 4.5, 0.4], [0, 2.2, -5.6], '#f7faf6');
    this.box(this.cabin, [25, 0.55, 1.7], [0, 4.6, -4.9], '#d4e4df');
    this.box(this.cabin, [24, 0.04, 2.3], [0, 0.1, 0], '#b7d0ce');
    for (let row = -2; row <= 2; row += 1) {
      const x = row * 4.2;
      this.box(this.cabin, [1.3, 1.45, 0.08], [x, 2.8, -5.35], '#a5d9e9');
      for (const z of [-3.1, 3.1]) {
        this.box(this.cabin, [1.55, 0.25, 1.5], [x, 1, z], COLORS.teal);
        const seat = this.box(this.cabin, [0.3, 1.7, 1.5], [x - 0.7, 1.7, z], COLORS.darkTeal);
        seat.rotation.z = -0.1;
        this.box(this.cabin, [0.17, 0.44, 1.25], [x - 0.54, 2.3, z], '#f0ede0');
        for (const armZ of [z - 0.87, z + 0.87]) this.box(this.cabin, [1.4, 0.15, 0.16], [x, 1.5, armZ], '#b2bdb9');
        this.box(this.cabin, [0.16, 0.9, 1], [x, 0.5, z], '#8d9d99');
      }
    }
    this.label(this.cabin, 'MIQAT DI PESAWAT', 'Bersiap sebelum melewati batas miqat', [0, 6, -4.5], 11);
    for (let index = 0; index < 3; index += 1) {
      const cloud = new T.Group();
      for (let part = 0; part < 3; part += 1) this.sphere(cloud, 1.5, [part * 1.5, part % 2 * 0.5, 0], COLORS.white, [1.3, 0.6, 0.7]);
      cloud.position.set(-12 + index * 10, 3 + index * 1.7, -12 - index);
      this.cabin.add(cloud);
      this.clouds.push(cloud);
    }
  }

  private makeDesert(): void {
    this.floor(this.desert, 47, 32, '#edd5ac');
    this.box(this.desert, [45, 0.05, 6], [0, 0.1, 1.5], '#99a8a1');
    for (let index = -7; index <= 7; index += 1) this.box(this.desert, [1.5, 0.02, 0.13], [index * 3.1, 0.14, 1.5], COLORS.white);
    for (let index = -2; index <= 2; index += 1) {
      const rock = this.sphere(this.desert, 4.5, [index * 10, 0.3, -11 - index % 2 * 2], '#ccad82', [1.5, 0.75, 0.8]);
      rock.rotation.y = index * 0.6;
    }
    this.palm(this.desert, -16, -3, 1.2);
    this.palm(this.desert, 14, 8, 1.1);
    this.box(this.bus, [7, 2.7, 2.9], [0, 2, 0], COLORS.cream);
    this.box(this.bus, [7.1, 0.55, 2.95], [0, 0.95, 0], COLORS.teal);
    this.box(this.bus, [0.08, 1.4, 2.5], [3.55, 2.4, 0], '#5d989c');
    for (const z of [-1.48, 1.48]) {
      for (let index = -2; index <= 2; index += 1) this.box(this.bus, [1, 1.25, 0.05], [index * 1.18, 2.45, z], '#83b4b7');
      for (const x of [-2.25, 2.25]) {
        const wheel = this.cylinder(this.bus, 0.65, 0.65, 0.28, [x, 0.65, z], COLORS.ink);
        wheel.rotation.x = Math.PI / 2;
      }
    }
    this.bus.position.set(0, 0, 1.5);
    this.desert.add(this.bus);
    this.label(this.desert, 'MENUJU MAKKAH', 'Bertalbiyah sepanjang perjalanan', [0, 7, -2], 11);
  }

  private makeHaram(): void {
    this.floor(this.haram, 45, 43, '#f4edda');
    // Instanced columns keep the courtyard light enough for mobile devices.
    const columns = new T.InstancedMesh(this.geometry('pillar', () => new T.CylinderGeometry(0.22, 0.3, 4.2, 10)), this.material(COLORS.white), 44);
    const matrix = new T.Matrix4();
    let column = 0;
    for (const side of [-1, 1]) {
      for (let index = -5; index <= 5; index += 1) {
        matrix.makeTranslation(index * 3.7, 2.1, side * 18.8);
        columns.setMatrixAt(column++, matrix);
        matrix.makeTranslation(side * 20.3, 2.1, index * 3.35);
        columns.setMatrixAt(column++, matrix);
      }
      this.box(this.haram, [42, 0.65, 2.2], [0, 5.4, side * 19.2], COLORS.cream);
      this.box(this.haram, [2.2, 0.65, 38.5], [side * 20.3, 5.4, 0], COLORS.cream);
      this.box(this.haram, [41.7, 0.16, 2.15], [0, 5.8, side * 19.2], COLORS.gold);
      for (let index = -5; index < 5; index += 1) this.arch(this.haram, index * 3.7 + 1.85, 3.55, side * 18.8, 1.63);
      for (let index = -5; index < 5; index += 1) {
        const arcade = new T.Group();
        this.arch(arcade, 0, 3.55, 0, 1.47);
        arcade.position.set(side * 20.3, 0, index * 3.35 + 1.675);
        arcade.rotation.y = Math.PI / 2;
        this.haram.add(arcade);
      }
    }
    columns.castShadow = true;
    this.haram.add(columns);
    for (const x of [-20.3, 20.3]) this.minaret(this.haram, x, -19, 12);
    // The Kaabah is deliberately schematic; its landmarks stay visually distinct.
    this.box(this.haram, [6.3, 0.28, 6.3], [0, 0.22, 0], '#b1a391');
    this.box(this.haram, [5.8, 6.6, 5.8], [0, 3.6, 0], '#22252b');
    this.box(this.haram, [5.9, 0.55, 5.9], [0, 5.3, 0], COLORS.gold, 0.5);
    this.box(this.haram, [5.92, 0.09, 5.92], [0, 5.02, 0], '#f3d78c', 0.45);
    this.box(this.haram, [5.88, 0.12, 5.88], [0, 6.85, 0], '#b58f45', 0.4);
    this.box(this.haram, [0.08, 2.25, 1.3], [2.96, 2.5, -0.65], COLORS.gold, 0.6);
    this.box(this.haram, [0.1, 1.8, 0.9], [3.01, 2.5, -0.65], '#b07e27', 0.5);
    this.sphere(this.haram, 0.2, [2.96, 1.3, 2.96], '#bbb6a8', [1, 1.4, 0.65]);
    // Hijr Ismail extends to the north (negative Z). Tawaf radius encloses its complete wall.
    const hijr = new T.Mesh(this.geometry('hijr', () => new T.TorusGeometry(3.9, 0.32, 6, 32, Math.PI)), this.material(COLORS.white));
    hijr.rotation.x = -Math.PI / 2;
    hijr.position.set(0, 0.65, -3.5);
    this.haram.add(hijr);
    this.label(this.haram, 'KA’BAH', 'Masjidil Haram', [0, 9, 0], 6.4);
    // A gold, glass-like enclosure marks Maqam Ibrahim, separate from the Kaabah.
    this.cylinder(this.haram, 0.85, 0.95, 0.2, [6.5, 0.2, -1.9], COLORS.cream, 8);
    this.cylinder(this.haram, 0.57, 0.64, 1.4, [6.5, 1, -1.9], '#d3bc79', 8);
    this.cylinder(this.haram, 0, 0.8, 0.65, [6.5, 2, -1.9], COLORS.gold, 8);
    for (let index = 0; index < 8; index += 1) {
      const angle = index / 8 * Math.PI * 2;
      this.cylinder(this.haram, 0.035, 0.035, 1.4, [6.5 + Math.cos(angle) * 0.65, 1, -1.9 + Math.sin(angle) * 0.65], '#ffe9a1', 5);
    }
    this.label(this.haram, 'MAQAM IBRAHIM', '', [8.3, 3.5, -3.6], 5);
    this.box(this.haram, [3.7, 0.03, 2.1], [12.5, 0.12, -4.3], '#b8d5c3');
    // A modern drinking-water station, away from the tawaf route.
    this.box(this.haram, [3.3, 1.55, 1.5], [-15.5, 0.86, 8], COLORS.white);
    this.box(this.haram, [3.5, 0.15, 1.7], [-15.5, 1.65, 8], COLORS.teal);
    for (const x of [-16.3, -14.7]) {
      this.cylinder(this.haram, 0.3, 0.3, 0.8, [x, 2.12, 8], '#d0e6dd');
      this.box(this.haram, [0.2, 0.2, 0.25], [x, 1.3, 8.88], COLORS.gold);
    }
    this.label(this.haram, 'AIR ZAMZAM', '', [-15.5, 3.55, 8], 5);
    const ring = new T.Mesh(this.geometry('tawaf-ring', () => new T.RingGeometry(TAWAF_RADIUS - 0.16, TAWAF_RADIUS + 0.16, 96)), this.material('#a8d9c9'));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.13;
    this.routeRing.add(ring);
    const points: T.Vector3[] = [];
    for (let index = 0; index <= 128; index += 1) {
      const theta = START_ANGLE - index / 128 * Math.PI * 2;
      points.push(new T.Vector3(Math.cos(theta) * TAWAF_RADIUS, 0.2, Math.sin(theta) * TAWAF_RADIUS));
    }
    this.routeArc = new T.Line(new T.BufferGeometry().setFromPoints(points), new T.LineBasicMaterial({ color: COLORS.teal, linewidth: 2 }));
    this.routeRing.add(this.routeArc);
    for (let index = 0; index < 8; index += 1) {
      const theta = START_ANGLE - (index + 0.35) / 8 * Math.PI * 2;
      const arrow = new T.Mesh(this.geometry('path-arrow', () => new T.ConeGeometry(0.25, 0.65, 3)), this.material(COLORS.teal));
      arrow.position.set(Math.cos(theta) * TAWAF_RADIUS, 0.19, Math.sin(theta) * TAWAF_RADIUS);
      arrow.quaternion.setFromUnitVectors(Y_AXIS, new T.Vector3(Math.sin(theta), 0, -Math.cos(theta)));
      this.routeRing.add(arrow);
    }
    const start = this.box(this.routeRing, [2.4, 0.04, 0.13], [Math.cos(START_ANGLE) * TAWAF_RADIUS, 0.16, Math.sin(START_ANGLE) * TAWAF_RADIUS], COLORS.gold);
    start.rotation.y = -START_ANGLE;
    this.label(this.routeRing, 'GARIS MULAI', 'Sejajar sudut Hajar Aswad', [10.2, 2.4, 10.2], 6);
    this.haram.add(this.routeRing);
    // Quiet, stationary fellow pilgrims communicate scale without inflating draw calls.
    const crowd = new T.InstancedMesh(this.geometry('crowd-body', () => new T.CylinderGeometry(0.17, 0.28, 0.95, 8)), this.material('#e9e9db'), 20);
    const heads = new T.InstancedMesh(this.geometry('crowd-head', () => new T.SphereGeometry(0.18, 8, 6)), this.material('#b78e72'), 20);
    for (let index = 0; index < 20; index += 1) {
      const theta = index / 20 * Math.PI * 2 + 0.15;
      const radius = index % 2 ? 13.6 : 15;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      crowd.setMatrixAt(index, new T.Matrix4().makeTranslation(x, 0.6, z));
      heads.setMatrixAt(index, new T.Matrix4().makeTranslation(x, 1.25, z));
    }
    this.haram.add(crowd, heads);
  }

  private makeSai(): void {
    this.floor(this.sai, 39, 13, '#f5efe0');
    this.box(this.sai, [32, 0.035, 3], [0, 0.13, 0], '#b9d6c8');
    for (const z of [-1.65, 1.65]) this.box(this.sai, [32, 0.04, 0.12], [0, 0.15, z], COLORS.gold);
    for (const z of [-5.25, 5.25]) {
      this.box(this.sai, [38, 0.5, 1.2], [0, 5.35, z], COLORS.cream);
      for (let index = -4; index <= 4; index += 1) {
        this.cylinder(this.sai, 0.2, 0.3, 3.8, [index * 4.1, 1.95, z], COLORS.white);
        if (index < 4) this.arch(this.sai, index * 4.1 + 2.05, 3.3, z, 1.9);
      }
    }
    for (const x of [-3.6, 3.6]) {
      for (const z of [-4.7, 4.7]) {
        const marker = this.box(this.sai, [0.28, 4.7, 0.28], [x, 2.45, z], COLORS.green);
        marker.material = new T.MeshStandardMaterial({ color: COLORS.green, emissive: COLORS.green, emissiveIntensity: 0.3 });
      }
      this.box(this.sai, [0.32, 0.05, 9.4], [x, 0.16, 0], '#7ac7a4');
    }
    for (const side of [-1, 1]) {
      const x = side * 16.1;
      this.sphere(this.sai, 1.4, [x, 0.3, -3.2], '#b69b7c', [1.65, 0.68, 1]);
      this.sphere(this.sai, 0.85, [x + side * 0.8, 0.4, -2.9], '#c7ae8b', [1.1, 0.85, 1]);
      const disc = new T.Mesh(this.geometry('sai-end', () => new T.CircleGeometry(1.45, 32)), this.material('#d7e6d2'));
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(side * SAI_END, 0.18, 0);
      this.sai.add(disc);
    }
    this.label(this.sai, 'SAFA', 'Mulai · hitungan 0', [-14, 6.4, -2], 6.5);
    this.label(this.sai, 'MARWAH', 'Selesai · hitungan 7', [14, 6.4, -2], 6.5);
    this.label(this.sai, 'SA’I', 'Satu arah = satu perjalanan', [0, 7.7, -5.5], 8);
  }

  private makeTrim(): void {
    this.floor(this.trim, 24, 20, '#f2e8d4');
    this.box(this.trim, [20, 4.7, 0.45], [0, 2.35, -6], COLORS.sand);
    this.box(this.trim, [7, 3.3, 0.15], [0, 2.6, -5.7], COLORS.gold);
    this.box(this.trim, [6.6, 2.9, 0.18], [0, 2.6, -5.56], '#b4d1cc');
    this.box(this.trim, [9, 0.2, 1.8], [0, 0.95, -4.8], COLORS.cream);
    for (const x of [-3.6, 3.6]) this.box(this.trim, [0.25, 0.9, 1.2], [x, 0.45, -4.8], COLORS.gold);
    this.box(this.trim, [2.4, 0.32, 2.1], [3.5, 0.9, -1.8], COLORS.teal);
    this.box(this.trim, [2.4, 2, 0.3], [3.5, 1.8, -2.8], COLORS.darkTeal);
    this.cylinder(this.trim, 0.13, 0.13, 0.8, [3.5, 0.45, -1.8], COLORS.gold);
    this.cylinder(this.trim, 0.9, 0.9, 0.12, [3.5, 0.12, -1.8], '#9ca7a2');
    this.palm(this.trim, -8.5, -4, 1.2);
    this.palm(this.trim, 8.5, -4, 1.2);
    // Oversized tool illustration conveys trimming without animating blades near a head.
    const scissors = new T.Group();
    for (const side of [-1, 1]) {
      const handle = new T.Mesh(this.geometry('scissors-loop', () => new T.TorusGeometry(0.38, 0.09, 6, 20)), this.material(COLORS.teal));
      handle.position.set(side * 0.42, -0.55, 0);
      scissors.add(handle);
      const blade = this.box(scissors, [0.13, 1.45, 0.08], [side * 0.2, 0.4, 0], '#e7edf0', 0.6);
      blade.rotation.z = side * 0.42;
    }
    this.sphere(scissors, 0.12, [0, 0, 0.1], COLORS.gold);
    scissors.position.set(-3, 3.1, -3.6);
    this.trim.add(scissors);
    this.label(this.trim, 'TAHALLUL', 'Mencukur atau memendekkan rambut', [0, 6.2, -4], 11);
    this.box(this.trim, [5, 0.04, 4.5], [-1.5, 0.12, 2.2], '#bdd6c4');
  }

  private makeAvatar(): void {
    // Both avatars remain modestly dressed; appearance does not change the ritual rules.
    const skin = COLORS.skin;
    this.cylinder(this.male, 0.45, 0.54, 1.1, [0, 0.82, 0], COLORS.white);
    this.cylinder(this.male, 0.43, 0.4, 0.9, [0, 1.68, 0], '#f5f2e6');
    this.sphere(this.male, 0.34, [0, 2.42, 0], skin, [0.95, 1.08, 0.95]);
    this.sphere(this.male, 0.32, [0, 2.59, -0.03], '#58463d', [1, 0.55, 1]);
    for (const x of [-0.48, 0.48]) {
      this.cylinder(this.male, 0.12, 0.12, 0.66, [x, 1.45, 0], skin, 10);
      this.sphere(this.male, 0.14, [x, 1.13, 0], skin);
    }
    this.cylinder(this.female, 0.35, 0.63, 1.6, [0, 1.03, 0], '#f5f1df');
    this.sphere(this.female, 0.48, [0, 2.12, 0], '#eee8d3', [1, 1.28, 1]);
    this.sphere(this.female, 0.27, [0, 2.23, 0.28], skin, [0.82, 1, 0.36]);
    for (const x of [-0.48, 0.48]) {
      this.cylinder(this.female, 0.13, 0.16, 0.8, [x, 1.4, 0], '#f5f1df', 10);
      this.sphere(this.female, 0.12, [x, 1.03, 0], skin);
    }
    for (const group of [this.male, this.female]) {
      for (const x of [-0.21, 0.21]) this.sphere(group, 0.17, [x, 0.18, 0.11], '#665b4c', [0.8, 0.4, 1.3]);
      for (const x of [-0.1, 0.1]) this.sphere(group, 0.022, [x, group === this.male ? 2.43 : 2.25, group === this.male ? 0.326 : 0.38], '#423d34');
    }
    this.avatar.add(this.male, this.female);
    this.shadow = new T.Mesh(this.geometry('avatar-shadow', () => new T.CircleGeometry(0.72, 32)), new T.MeshBasicMaterial({ color: '#32695f', transparent: true, opacity: 0.18, depthWrite: false }));
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.13;
    this.halo.add(this.shadow);
    const ring = new T.Mesh(this.geometry('avatar-halo', () => new T.RingGeometry(0.86, 1.04, 36)), new T.MeshBasicMaterial({ color: COLORS.teal, transparent: true, opacity: 0.75, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.14;
    this.halo.add(ring);
  }

  update(state: UmrohSceneState): void {
    if (this.disposed) return;
    const previous = this.state;
    const stageChanged = previous.stage !== state.stage || previous.route !== state.route;
    this.state = { ...state, progress: Number.isFinite(state.progress) ? T.MathUtils.clamp(state.progress, 0, 7) : 0 };
    const { stage, route, pilgrim, progress } = this.state;
    this.mosque.visible = (stage === 'persiapan' || stage === 'miqat') && route === 'madinah';
    this.cabin.visible = (stage === 'persiapan' || stage === 'miqat') && route === 'pesawat';
    this.desert.visible = stage === 'perjalanan';
    this.haram.visible = ['masuk', 'tawaf', 'salat', 'zamzam', 'selesai'].includes(stage);
    this.sai.visible = stage === 'sai';
    this.trim.visible = stage === 'tahallul';
    this.routeRing.visible = stage === 'tawaf';
    this.male.visible = pilgrim === 'putra';
    this.female.visible = pilgrim === 'putri';
    this.avatar.visible = stage !== 'perjalanan';
    this.halo.visible = this.avatar.visible;
    this.avatar.scale.setScalar(stage === 'sai' || stage === 'tawaf' ? 1.2 : 1.35);
    this.avatar.position.y = 0.1;
    switch (stage) {
      case 'tawaf': {
        // Negative angular motion is counterclockwise from above with north at -Z.
        // The circle encloses both the Kaabah and Hijr; the Kaabah stays on the walker's left.
        const angle = START_ANGLE - Math.PI * 2 * progress;
        this.avatar.position.set(Math.cos(angle) * TAWAF_RADIUS, 0.1, Math.sin(angle) * TAWAF_RADIUS);
        this.avatar.rotation.y = Math.atan2(Math.sin(angle), -Math.cos(angle));
        const fraction = progress === 7 ? 1 : progress % 1;
        this.routeArc.geometry.setDrawRange(0, Math.max(0, Math.floor(fraction * 128) + 1));
        break;
      }
      case 'sai': {
        // 0 = Safa, 1 = Marwah, 2 = Safa ... 7 = Marwah. Never wrap the finish to zero.
        const completed = Math.min(6, Math.floor(progress));
        const amount = progress === 7 ? 1 : progress - completed;
        const towardMarwah = completed % 2 === 0;
        const position = towardMarwah ? amount : 1 - amount;
        this.avatar.position.set(-SAI_END + SAI_END * 2 * position, 0.1, 0);
        this.avatar.rotation.y = towardMarwah ? Math.PI / 2 : -Math.PI / 2;
        break;
      }
      case 'salat':
        this.avatar.position.set(12.5, 0.1, -4.3);
        this.avatar.rotation.y = Math.atan2(-12.5, 4.3);
        break;
      case 'zamzam':
        this.avatar.position.set(-15.5, 0.1, 10.2);
        this.avatar.rotation.y = Math.PI;
        break;
      case 'masuk':
      case 'selesai':
        this.avatar.position.set(0, 0.1, 14.3);
        this.avatar.rotation.y = stage === 'selesai' ? 0 : Math.PI;
        break;
      case 'tahallul':
        this.avatar.position.set(-1.5, 0.1, 2.2);
        this.avatar.rotation.y = 0.25;
        break;
      default:
        this.avatar.position.set(0, 0.1, route === 'pesawat' ? 0 : 4.8);
        this.avatar.rotation.y = route === 'pesawat' ? Math.PI / 2 : Math.PI;
    }
    this.halo.position.set(this.avatar.position.x, 0, this.avatar.position.z);
    const descriptions: Record<UmrohStage, string> = {
      persiapan: 'Persiapan umroh dan pakaian ihram', miqat: route === 'madinah' ? 'Miqat Bir Ali di rute Madinah' : 'Persiapan miqat di kabin pesawat',
      perjalanan: 'Perjalanan ke Makkah', masuk: 'Memasuki Masjidil Haram', tawaf: `Latihan tawaf mengelilingi Kaabah berlawanan arah jarum jam, ${Math.floor(progress)} dari tujuh putaran`,
      salat: 'Tempat salat sesudah tawaf di belakang Maqam Ibrahim', zamzam: 'Tempat minum air Zamzam', sai: `Latihan sai dari Safa ke Marwah, ${Math.floor(progress)} dari tujuh perjalanan`,
      tahallul: 'Tahallul, mencukur atau memendekkan rambut', selesai: 'Rangkaian latihan umroh selesai',
    };
    this.renderer.domElement.setAttribute('aria-label', `${descriptions[stage]}. Model 3D skematis. Geser untuk memutar dan cubit untuk memperbesar.`);
    if (stageChanged) this.resetCamera();
  }

  resetCamera(): void {
    const { stage, route } = this.state;
    const view: Record<UmrohStage, { position: [number, number, number]; target: [number, number, number] }> = {
      persiapan: { position: [22, 19, 30], target: [0, 2, -2] },
      miqat: { position: [22, 19, 30], target: [0, 2, -2] },
      perjalanan: { position: [26, 20, 31], target: [0, 1, -1] },
      masuk: { position: [32, 30, 38], target: [0, 1.6, 0] },
      tawaf: { position: [26, 32, 29], target: [0, 0.8, 0] },
      salat: { position: [25, 16, 17], target: [6.4, 1.7, -1.5] },
      zamzam: { position: [2, 13, 28], target: [-11, 1.3, 6] },
      sai: { position: [12, 21, 35], target: [0, 1.4, 0] },
      tahallul: { position: [17, 13, 23], target: [0, 1.5, -1] },
      selesai: { position: [26, 28, 35], target: [0, 1.5, 0] },
    };
    const chosen = view[stage];
    this.cameraPosition.set(...chosen.position);
    this.destination.set(...chosen.target);
    if ((stage === 'miqat' || stage === 'persiapan') && route === 'pesawat') {
      this.cameraPosition.set(20, 16, 25);
      this.destination.set(0, 1.5, 0);
    }
    // Maintain the complete landscape on narrow screens rather than clipping the route.
    if (this.camera.aspect < 1.3) {
      this.cameraPosition.sub(this.destination).multiplyScalar(Math.min(1.5, 1.3 / Math.max(this.camera.aspect, 0.65))).add(this.destination);
    }
    this.controls.maxDistance = Math.max(70, this.cameraPosition.distanceTo(this.destination) + 5);
    this.camera.position.copy(this.cameraPosition);
    this.controls.target.copy(this.destination);
    this.controls.update();
    this.controls.saveState();
  }

  private resize = (): void => {
    if (this.disposed) return;
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    const previousAspect = this.camera.aspect;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if ((previousAspect < 1.3) !== (this.camera.aspect < 1.3)) this.resetCamera();
  };

  private tick = (now: number): void => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.tick);
    if (this.contextLost) return;
    const delta = this.previousTime ? Math.min((now - this.previousTime) / 1000, 0.05) : 0;
    this.previousTime = now;
    this.time += delta;
    if (!this.reducedMotion) {
      // Atmosphere only: ritual progress is never advanced by the renderer.
      this.halo.children[1].scale.setScalar(1 + Math.sin(this.time * 2) * 0.04);
      this.avatar.position.y = 0.1 + (this.state.running ? Math.abs(Math.sin(this.time * 7)) * 0.06 : 0);
      this.bus.position.x = Math.sin(this.time * 0.17) * 2.2;
      this.clouds.forEach((cloud, index) => { cloud.position.x = -12 + index * 10 + Math.sin(this.time * 0.1 + index) * 0.8; });
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private onContextLost = (event: Event): void => {
    event.preventDefault();
    this.contextLost = true;
    this.container.dispatchEvent(new CustomEvent('umroh-context-lost', { bubbles: true }));
  };

  private onContextRestored = (): void => {
    this.contextLost = false;
    this.previousTime = 0;
    this.container.dispatchEvent(new CustomEvent('umroh-context-restored', { bubbles: true }));
  };

  private releaseResources(): void {
    const geometries = new Set<T.BufferGeometry>(this.geometries.values());
    const materials = new Set<T.Material>(this.materials.values());
    const textures = new Set<T.Texture>();
    const instances = new Set<T.InstancedMesh>();
    // Include groups not yet attached to scene if construction failed halfway through.
    for (const root of [this.scene, this.mosque, this.cabin, this.desert, this.haram, this.sai, this.trim, this.avatar, this.halo]) {
      root.traverse((object) => {
        if (object instanceof T.InstancedMesh) instances.add(object);
        if (object instanceof T.Mesh || object instanceof T.Line || object instanceof T.Sprite) {
          if ('geometry' in object && object.geometry) geometries.add(object.geometry);
          const entries = Array.isArray(object.material) ? object.material : [object.material];
          entries.forEach((material) => materials.add(material));
        }
      });
    }
    materials.forEach((material) => {
      for (const value of Object.values(material)) if (value instanceof T.Texture) textures.add(value);
    });
    textures.forEach((texture) => texture.dispose());
    instances.forEach((instance) => instance.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    this.scene.traverse((object) => { if (object instanceof T.Light && 'shadow' in object && object.shadow instanceof T.LightShadow) object.shadow.dispose(); });
    this.materials.clear();
    this.geometries.clear();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    this.controls.dispose();
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onContextLost);
    this.renderer.domElement.removeEventListener('webglcontextrestored', this.onContextRestored);
    this.releaseResources();
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
