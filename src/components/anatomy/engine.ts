import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { belongsTo, poseAt, visiblePart, type CameraPose, type ExplorerState } from '@/lib/anatomy/state';
import { tissueLook } from '@/lib/anatomy/materials';
import { createTissueMaterial, initTissueQuality, setTissueQuality, setTissueUnit } from './tissue-material';
import { clusterSimplify, detectQuality, mergeWorldGeometry, pixelRatioFor, type Quality } from './perf';
import type { Asset, Manifest, Part, Vec3 } from '@/lib/anatomy/types';
export type LoadStatus = { state: 'loading' | 'ready' | 'error'; progress: number; message?: string };
export interface EngineEvents { select: (id: string) => void; detach: (id: string, amount: number) => void; status: (id: string, status: LoadStatus) => void; lost: () => void; direction: (name: string) => void }
type Node = { part: Part; meshes: THREE.Mesh[]; rests: THREE.Vector3[]; materials: THREE.MeshStandardMaterial[] };
export class AnatomyEngine {
  renderer: THREE.WebGLRenderer;
  camera = new THREE.PerspectiveCamera(34, 1, .005, 30);
  scene = new THREE.Scene(); controls: OrbitControls;
  private environment: THREE.WebGLRenderTarget; private studioKey: THREE.DirectionalLight; private pedestal: THREE.Mesh;
  private focusedId: string | null = null; private bodyFraming = true; private detailed = new Set<string>();
  private model = new THREE.Group(); private nodes = new Map<string, Node>(); private roots = new Map<string, THREE.Group>();
  private loads = new Map<string, AbortController>(); private failed = new Set<string>(); private disposed = false;
  private state: ExplorerState; private resize: ResizeObserver; private frame = 0; private raf = 0; private last = 0;
  private ray = new THREE.Raycaster(); private pointer = new THREE.Vector2(); private plane = new THREE.Plane();
  private labels = new Map<string, HTMLButtonElement>(); private pointers = new Map<number, { x: number; y: number }>();
  private moved = false; private pinched = false; private drag: { id: string; x: number; y: number; amount: number; dx: number; dy: number; length: number } | null = null;
  private cameraGoal: CameraPose | null = null; private pendingFocus: string | null = null;
  private simTime = 0; private marker: THREE.Mesh; private flow: THREE.Line; private flowPoints: THREE.Vector3[] = [];
  private capGroup = new THREE.Group(); private capResources: THREE.Material[] = [];
  private sectionKey = ''; private directionName = ''; private slowFrames = 0; private dpr: number;
  // Performa: gambar hanya bila ada perubahan; kualitas menyesuaikan perangkat; tulang digabung + versi jauh.
  private needsFrames = 3; private quality: Quality = 2; private slowWindow: number[] = [];
  private boneLod: THREE.LOD | null = null; private boneMat: THREE.MeshPhysicalMaterial | null = null; private boneBatchOn = false;
  readonly metrics = { frames: 0, elapsedMs: 0, drawCalls: 0, triangles: 0, packages: {} as Record<string, { bytes: number; loadMs: number }> };
  constructor(private host: HTMLElement, private labelHost: HTMLElement, private manifest: Manifest, initial: ExplorerState, private events: EngineEvents) {
    this.state = initial;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, stencil: true, powerPreference: 'high-performance' });
    this.quality = detectQuality(); initTissueQuality(this.quality); this.dpr = pixelRatioFor(this.quality); this.renderer.setPixelRatio(this.dpr);
    this.renderer.localClippingEnabled = true; this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    const room=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(this.renderer);this.environment=pmrem.fromScene(room,.04);this.scene.environment=this.environment.texture;room.dispose();pmrem.dispose();
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xfaf8f4, 0); this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.12;
    this.renderer.domElement.setAttribute('aria-label', 'Model anatomi 3D. Gunakan daftar bagian dan tombol sudut pandang sebagai alternatif keyboard.');
    this.renderer.domElement.setAttribute('role', 'img');
    host.appendChild(this.renderer.domElement);
    this.ray.layers.enableAll();
    this.camera.position.set(0, .88, 3.05);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, .89, 0); this.controls.enableDamping = !initial.reducedMotion;
    this.controls.minDistance = .25; this.controls.maxDistance = 5; this.controls.maxPolarAngle = Math.PI * .93;
    this.controls.addEventListener('start', () => { this.cameraGoal = null; this.bodyFraming = false;this.focusedId=null; });
    this.controls.addEventListener('change', () => this.invalidate());
    this.scene.add(this.model, this.capGroup, new THREE.HemisphereLight(0xffffff, 0x756D60, .75));
    const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(-2, 3, 4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.00015;key.shadow.normalBias=.0001;key.shadow.radius=4;this.studioKey=key;this.scene.add(key,key.target);
    this.pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1,1.03,.045,96),new THREE.MeshStandardMaterial({color:0xe6dfd6,roughness:.9,envMapIntensity:.25}));this.pedestal.receiveShadow=true;this.pedestal.visible=false;this.scene.add(this.pedestal);
    const fill = new THREE.DirectionalLight(0xffffff, .9); fill.position.set(3, 1.5, -2); this.scene.add(fill);
    // cahaya tepi dari belakang: garis tubuh & organ lebih tegas di atas latar gelap
    const rim = new THREE.DirectionalLight(0xcfe0ff, 1.1); rim.position.set(0, 2.5, -4); this.scene.add(rim);
    this.marker = new THREE.Mesh(new THREE.SphereGeometry(.003, 14, 10), new THREE.MeshBasicMaterial({ color: 0x318e80 }));
    this.flow = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x318e80, transparent: true, opacity: .65 }));
    this.marker.visible = this.flow.visible = false; this.scene.add(this.marker, this.flow);
    this.resize = new ResizeObserver(() => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.renderer.setSize(width, height); if(this.bodyFraming)this.fitBody();else if(this.focusedId)this.focus(this.focusedId); this.invalidate(3);
    }); this.resize.observe(host);
    const el = this.renderer.domElement;
    // Capture ensures OrbitControls never starts during a directed disassembly gesture.
    el.addEventListener('pointerdown', this.down, true); el.addEventListener('pointermove', this.move, true);
    el.addEventListener('pointerup', this.up, true); el.addEventListener('pointercancel', this.cancel, true); el.addEventListener('lostpointercapture', this.cancel);
    el.addEventListener('webglcontextlost', this.contextLost);
    document.addEventListener('visibilitychange', this.onVisible);
    if (process.env.NODE_ENV === 'development') (window as unknown as { __anatomy?: AnatomyEngine }).__anatomy = this;
    this.sync(initial); this.raf = requestAnimationFrame(this.render);
  }
  /** Tab kembali terlihat: isi kanvas bisa dibuang browser, gambar ulang. */
  private onVisible = () => { if (!document.hidden) this.invalidate(3); };
  private contextLost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(this.raf); this.events.lost(); };
  getCamera(): CameraPose { return { position: this.camera.position.toArray() as Vec3, target: this.controls.target.toArray() as Vec3, minDistance:this.controls.minDistance,maxDistance:this.controls.maxDistance }; }
  restoreCamera(pose: CameraPose) { this.bodyFraming=false;this.focusedId=null;this.setCamera(pose); }
  private setCamera(pose: CameraPose) {
    if(pose.minDistance!==undefined)this.controls.minDistance=pose.minDistance;if(pose.maxDistance!==undefined)this.controls.maxDistance=pose.maxDistance;
    if (this.state.reducedMotion) { this.camera.position.fromArray(pose.position); this.controls.target.fromArray(pose.target); this.controls.update(); this.invalidate(); }
    else this.cameraGoal = pose;
  }
  private fitBody() {
    const box=new THREE.Box3();for(const p of this.manifest.parts)if(p.layer==='bone'){box.expandByPoint(new THREE.Vector3(...p.bounds.min));box.expandByPoint(new THREE.Vector3(...p.bounds.max));}
    const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
    const distance=Math.max(size.y,size.x/this.camera.aspect)/2/Math.tan(THREE.MathUtils.degToRad(this.camera.fov)/2)*1.10;
    this.cameraGoal=null;this.camera.position.set(center.x,center.y,distance);this.controls.target.copy(center);this.controls.update();this.invalidate();
  }
  preset(view: 'front' | 'back' | 'left' | 'right') {
    const target = this.controls.target.clone(), distance = this.camera.position.distanceTo(target);
    const offset = new THREE.Vector3(view === 'left' ? distance : view === 'right' ? -distance : 0, 0, view === 'back' ? -distance : view === 'front' ? distance : 0);
    this.setCamera({ position: target.clone().add(offset).toArray() as Vec3, target: target.toArray() as Vec3 });
  }
  zoom(factor: number) { this.bodyFraming=false;const v = this.camera.position.clone().sub(this.controls.target); v.setLength(THREE.MathUtils.clamp(v.length() * factor, this.controls.minDistance, this.controls.maxDistance)); this.setCamera({ position: v.add(this.controls.target).toArray() as Vec3, target: this.controls.target.toArray() as Vec3 }); }
  focus(id: string) {
    const part = this.manifest.parts.find(p => p.id === id); if (!part) return;this.bodyFraming=false;this.focusedId=id;
    if (!this.nodes.has(id)) { this.pendingFocus = id; this.load(this.manifest.assets.find(a => a.id === part.assetId)!); return; }
    const asset=this.manifest.assets.find(a=>a.id===part.assetId)!;if(asset.detailUrl)this.load(asset,true);
    const box = new THREE.Box3();
    for (const node of this.nodes.values()) if (belongsTo(node.part, id, this.manifest.parts)) for (const mesh of node.meshes) box.expandByObject(mesh);
    if (box.isEmpty()) return;
    const center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
    const fov = THREE.MathUtils.degToRad(this.camera.fov), radius = Math.max(size.y, size.x / this.camera.aspect, size.z) / 2;
    const distance = Math.max(.015, radius / Math.tan(fov / 2) * 1.28);
    this.controls.minDistance = Math.max(.003, size.length() * .6); this.controls.maxDistance = Math.max(2, distance * 3);
    this.setCamera({ position: center.clone().add(new THREE.Vector3(.12, .04, 1).normalize().multiplyScalar(distance)).toArray() as Vec3, target: center.toArray() as Vec3 });
  }
  retry(id: string) { this.failed.delete(id);const detail=id.endsWith('-detail');const a=this.manifest.assets.find(a=>a.id===(detail?id.slice(0,-7):id));if(a)this.load(a,detail); }
  private async load(asset: Asset, detail=false) {
    if(!asset)return;const key=asset.id+(detail?'-detail':'');
    if ((detail ? this.detailed.has(asset.id) : this.roots.has(asset.id)) || this.loads.has(key) || this.failed.has(key) || this.disposed) return;
    const controller = new AbortController(); this.loads.set(key, controller); this.events.status(key, { state: 'loading', progress: 0 });
    const started = performance.now();
    try {
      const response = await fetch(detail?asset.detailUrl!:asset.url, { signal: controller.signal }); if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const total = Number(response.headers.get('content-length')) || (detail?asset.detailBytes!:asset.bytes);
      const reader = response.body?.getReader(); let buffer: ArrayBuffer;
      if (reader) { const chunks: Uint8Array[] = []; let bytes = 0; for (;;) { const r = await reader.read(); if (r.done) break; chunks.push(r.value); bytes += r.value.byteLength; this.events.status(key, { state: 'loading', progress: Math.min(95, Math.round(bytes / total * 95)) }); } const joined = new Uint8Array(bytes); let offset = 0; for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.length; } buffer = joined.buffer; }
      else buffer = await response.arrayBuffer();
      const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.parseAsync(buffer, '');
      if (this.disposed) { this.disposeObject(gltf.scene); return; }
      const assetParts = this.manifest.parts.filter(p => p.assetId === asset.id);
      const missing = assetParts.filter(p => p.meshNodeNames.some(n => !gltf.scene.getObjectByName(n)));
      if (missing.length) { this.disposeObject(gltf.scene); throw new Error('Node aset tidak cocok: ' + missing.map(p => p.id).join(', ')); }
      if(detail){const old=this.roots.get(asset.id);if(old){this.model.remove(old);this.disposeObject(old);}this.detailed.add(asset.id);}
      gltf.scene.updateMatrixWorld(true);
      for (const part of assetParts) {
        const meshes: THREE.Mesh[] = [];
        for (const name of part.meshNodeNames) gltf.scene.getObjectByName(name)!.traverse(o => { if (o instanceof THREE.Mesh) meshes.push(o); });
        const mats: THREE.MeshStandardMaterial[] = [];
        for (const mesh of meshes) {
          const mat = createTissueMaterial(tissueLook(part)); // warna & permukaan jaringan realistis
          const ws = mesh.getWorldScale(new THREE.Vector3()); setTissueUnit(mat, (ws.x + ws.y + ws.z) / 3);
          mesh.castShadow=true;mesh.receiveShadow=true;
          mesh.material = mat; mesh.userData.partId = part.id; mats.push(mat);
        }
        this.nodes.set(part.id, { part, meshes, rests: meshes.map(m => m.position.clone()), materials: mats });
      }
      // Siapkan shader sebelum tampil (tanpa patah-patah saat pertama diputar/dipilih).
      // batas 4 dtk: beberapa browser menunda kompilasi paralel saat tab tidak aktif
      try { await Promise.race([this.renderer.compileAsync(gltf.scene, this.camera, this.scene), new Promise(r => setTimeout(r, 4000))]); } catch { /* lanjut: dikompilasi saat render */ }
      if (this.disposed) { this.disposeObject(gltf.scene); return; }
      this.roots.set(asset.id, gltf.scene); this.model.add(gltf.scene);
      if (asset.id === 'bone' && !detail) this.buildBoneBatch(); this.metrics.packages[key] = { bytes: buffer.byteLength, loadMs: Math.round(performance.now() - started) };
      this.events.status(key, { state: 'ready', progress: 100 }); this.sync(this.state);
      if (this.pendingFocus && this.nodes.has(this.pendingFocus)) { const id = this.pendingFocus; this.pendingFocus = null; this.focus(id); }
    } catch (e) {
      if (!this.disposed && !controller.signal.aborted) { this.failed.add(key); this.events.status(key, { state: 'error', progress: 0, message: e instanceof Error ? e.message : 'Unduhan tidak selesai' }); }
    } finally { this.loads.delete(key); }
  }
  sync(state: ExplorerState) {
    const before = this.state; this.state = state;
    this.controls.enableDamping = !state.reducedMotion;
    const needed = new Set(this.manifest.parts.filter(p => visiblePart(p, state, this.manifest.parts) && (!this.manifest.assets.find(a=>a.id===p.assetId)?.deferred || state.region===p.regionId || state.selectedId===p.id || !!state.isolation&&belongsTo(p,state.isolation,this.manifest.parts)) && (p.assetId !== 'reproductive' || state.selectedId === p.id || state.isolation === p.id)).map(p => p.assetId));
    if (state.selectedId) { const p = this.manifest.parts.find(p => p.id === state.selectedId); if (p) needed.add(p.assetId); }
    needed.forEach(id => this.load(this.manifest.assets.find(a => a.id === id)!));
    let boneVis: boolean | null = null, boneUniform = true;
    for (const [id, node] of this.nodes) {
      const visible = visiblePart(node.part, state, this.manifest.parts);
      const inRegion = state.region !== 'all' && node.part.regionId === state.region;
      const inGroup = state.isolation ? belongsTo(node.part, state.isolation, this.manifest.parts) : inRegion;
      const amount = state.detached[id] ?? ((id === state.interior) ? Math.max(80, state.explode) : inGroup ? state.explode : 0);
      node.meshes.forEach((mesh, i) => {
        mesh.visible = visible;
        const position = poseAt(node.rests[i].toArray() as Vec3, node.part.explodePath, amount); mesh.position.fromArray(position);
        const mat = node.materials[i], alpha = state.layers[node.part.layer].opacity*(node.part.materialOpacity??1);
        mat.opacity = alpha; mat.transparent = alpha < .99; mat.depthWrite = alpha >= .45;
        const highlighted = state.selectedId && belongsTo(node.part, state.selectedId, this.manifest.parts);
        mat.emissive.set(highlighted ? 0xffffff : 0x000000); mat.emissiveIntensity = highlighted ? .012 : 0;
        mat.clippingPlanes = state.section ? [this.plane] : []; mat.needsUpdate = true;
        if (node.part.assetId === 'bone') { if (boneVis === null) boneVis = visible; else if (boneVis !== visible) boneUniform = false; if (amount > 0) boneUniform = false; } // sorotan emissive 1,2% tak kasatmata: tetap boleh digabung
      });
    }
    this.model.updateMatrixWorld(true);
    if (state.revision !== before.revision) {
      this.cameraGoal = null; this.pendingFocus = null;this.bodyFraming=!state.cameraRestore;this.focusedId=null;
      if (state.cameraRestore) { this.controls.minDistance=.25;this.controls.maxDistance=5;this.setCamera(state.cameraRestore); }
      else { this.controls.minDistance = .25; this.controls.maxDistance = 5; this.fitBody(); }
    }
    this.updateStudio();this.updateSection(); this.updateLabels(); this.updateFlow();
    this.updateBoneBatch(boneUniform && boneVis === true); this.invalidate(3);
  }
  private updateStudio() {
    this.pedestal.visible=!!this.state.isolation;
    this.renderer.shadowMap.enabled=!!this.state.isolation&&this.quality===2;
    if(!this.state.isolation)return;
    const box=new THREE.Box3();
    for(const n of this.nodes.values())if(belongsTo(n.part,this.state.isolation,this.manifest.parts))for(const mesh of n.meshes)if(mesh.visible)box.expandByObject(mesh);
    if(box.isEmpty())return;
    const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3()),span=Math.max(size.x,size.y,size.z,.03);
    this.pedestal.position.set(center.x,box.min.y-span*.14,center.z);this.pedestal.scale.setScalar(span*.52);
    const key=this.studioKey;key.position.copy(center).add(new THREE.Vector3(-1.2,2.4,3).multiplyScalar(span));key.target.position.copy(center);key.target.updateMatrixWorld();
    const shadow=key.shadow.camera;shadow.left=shadow.bottom=-span*1.7;shadow.right=shadow.top=span*1.7;shadow.near=span*.1;shadow.far=span*9;shadow.updateProjectionMatrix();
  }
  private updateSection() {
    const s = this.state.section;
    if (!s) { this.capGroup.visible = false; return; }
    const root = this.state.isolation || 'heart', box = new THREE.Box3();
    for (const n of this.nodes.values()) if (belongsTo(n.part, root, this.manifest.parts)) for (const mesh of n.meshes) if(mesh.visible) box.expandByObject(mesh);
    if (box.isEmpty()) return;
    const axis = s.axis === 'axial' ? 1 : s.axis === 'sagittal' ? 0 : 2;
    const normal = new THREE.Vector3(); normal.setComponent(axis, -1);
    const coord = THREE.MathUtils.lerp(box.min.getComponent(axis) - .002, box.max.getComponent(axis) + .002, s.position / 100);
    this.plane.set(normal, coord);
    // The source contains open boundaries at the removable teaching cover. Do not
    // create a solid cap across cavities. Section is explicitly an uncapped study view.
    this.capGroup.visible = false;
  }
  private pick(clientX: number, clientY: number): { id: string; point: THREE.Vector3 } | null {
    const rect = this.renderer.domElement.getBoundingClientRect(); this.pointer.set((clientX-rect.left)/rect.width*2-1, -(clientY-rect.top)/rect.height*2+1);
    this.ray.setFromCamera(this.pointer, this.camera);
    const meshes = [...this.nodes.values()].flatMap(n=>n.meshes.filter(m=>m.visible));
    const hits = this.ray.intersectObjects(meshes, false).filter(hit => !this.state.section || this.plane.distanceToPoint(hit.point) >= 0);
    const opaque = hits.find(hit => (hit.object as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>).material.opacity >= .45);
    const hit = opaque || hits[0]; return hit ? { id: hit.object.userData.partId, point: hit.point } : null;
  }
  private down = (e: PointerEvent) => {
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size > 1) { this.pinched = true; this.drag = null; this.controls.enabled = true; return; }
    this.moved = false; this.pinched = false;
    if (this.state.mode === 'disassemble' && !this.state.section) {
      const hit = this.pick(e.clientX, e.clientY), node = hit && this.nodes.get(hit.id);
      if (hit && node?.part.capabilities.disassemble) {
        const start = hit.point.clone().project(this.camera), end = hit.point.clone().add(new THREE.Vector3(...node.part.explodePath)).project(this.camera);
        const dx = (end.x-start.x)*this.host.clientWidth/2, dy = -(end.y-start.y)*this.host.clientHeight/2, length = dx*dx+dy*dy;
        this.drag = { id: hit.id, x: e.clientX, y: e.clientY, amount: this.state.detached[hit.id] ?? this.state.explode, dx, dy, length: Math.max(100, length) };
        this.controls.enabled = false; this.renderer.domElement.setPointerCapture(e.pointerId); e.stopImmediatePropagation();
      }
    }
  };
  private move = (e: PointerEvent) => {
    const start = this.pointers.get(e.pointerId); if (start && Math.hypot(e.clientX-start.x, e.clientY-start.y)>7) this.moved=true;
    if (this.drag && this.pointers.size === 1) { const d=this.drag; const t = Math.max(0,Math.min(100,d.amount+100*((e.clientX-d.x)*d.dx+(e.clientY-d.y)*d.dy)/d.length));this.events.detach(d.id,t);e.stopImmediatePropagation(); }
  };
  private up = (e: PointerEvent) => {
    const wasDrag = !!this.drag;
    if (!wasDrag && !this.moved && !this.pinched && this.pointers.size === 1 && e.button === 0) { const hit=this.pick(e.clientX,e.clientY); if(hit)this.events.select(hit.id); }
    this.pointers.delete(e.pointerId); this.drag=null;this.controls.enabled=true;
    if(wasDrag)e.stopImmediatePropagation();
  };
  private cancel = () => { this.pointers.clear();this.drag=null;this.moved=true;this.pinched=true;this.controls.enabled=true; };
  private updateLabels() {
    const desired = this.state.labels ? [...new Set([this.state.selectedId, ...(this.state.isolation ? [] : ['heart','brain_l','lung_r'])].filter(Boolean) as string[])] : [];
    for(const [id,el] of this.labels)if(!desired.includes(id)){el.remove();this.labels.delete(id);}
    for(const id of desired)if(!this.labels.has(id)) {
      const p=this.manifest.parts.find(p=>p.id===id);if(!p)continue;
      const el=document.createElement('button');el.type='button';el.className='anatomy-label';el.textContent=p.nameId;el.setAttribute('aria-label','Pilih '+p.nameId);el.addEventListener('click',()=>this.events.select(id));this.labelHost.appendChild(el);this.labels.set(id,el);
    }
  }
  private positionLabels() {
    const used: { x: number; y: number; w: number }[] = [];
    for(const [id,el] of this.labels){
      const node=this.nodes.get(id);if(!node||!node.meshes.some(m=>m.visible)){el.hidden=true;continue;}
      const offset=node.meshes[0].position.clone().sub(node.rests[0]);
      const anchor=new THREE.Vector3(...node.part.labelAnchor).add(offset);
      if(this.state.section&&this.plane.distanceToPoint(anchor)<0){el.hidden=true;continue;}
      const projected=anchor.clone().project(this.camera);
      if(projected.z>1||projected.z< -1||Math.abs(projected.x)>.96||Math.abs(projected.y)>.93){el.hidden=true;continue;}
      const direction=anchor.clone().sub(this.camera.position),distance=direction.length();this.ray.set(this.camera.position,direction.normalize());
      const blockers=this.ray.intersectObjects([...this.nodes.values()].flatMap(n=>n.materials[0]?.opacity>=.45?n.meshes.filter(m=>m.visible):[]),false).filter(h=>!this.state.section||this.plane.distanceToPoint(h.point)>=0);
      if(blockers[0]&&blockers[0].distance<distance-.008&&blockers[0].object.userData.partId!==id){el.hidden=true;continue;}
      const w=el.offsetWidth||130,x=THREE.MathUtils.clamp((projected.x+1)*this.host.clientWidth/2+18,4,this.host.clientWidth-w-4),y=(1-projected.y)*this.host.clientHeight/2-22;
      if(used.some(u=>Math.abs(u.y-y)<46&&x<u.x+u.w&&x+w>u.x)){el.hidden=true;continue;}
      el.hidden=false;el.style.transform=`translate(${x}px,${y}px)`;used.push({x,y,w});
    }
  }
  private updateFlow() {
    const allowed = this.state.isolation === 'heart' && this.state.interior === 'heart';
    this.flow.visible = this.marker.visible = allowed && this.state.playing;
    if(!allowed)return;
    const ids=['atrium_r','valve_tricuspid','ventricle_r','valve_pulmonary','pulmonary_trunk','atrium_l','valve_mitral','ventricle_l','valve_aortic','aorta'];
    this.flowPoints=ids.flatMap(id=>{const p=this.manifest.parts.find(p=>p.id===id);return p?[new THREE.Vector3(...p.labelAnchor)]:[];});
    this.flow.geometry.dispose();this.flow.geometry=new THREE.BufferGeometry().setFromPoints(this.flowPoints);
  }
  /** Minta beberapa frame digambar (kamera/state/aset berubah). */
  invalidate(frames = 2) { this.needsFrames = Math.max(this.needsFrames, frames); }
  private render = (time: number) => {
    if(this.disposed)return;this.raf=requestAnimationFrame(this.render);
    if(document.hidden){this.last=time;return;}
    const actualDt=this.last?time-this.last:16;const dt=Math.min(100,actualDt);this.last=time;
    const animating=!!this.cameraGoal||(this.state.playing&&!this.state.reducedMotion&&this.flowPoints.length>1)||!!this.drag;
    if(this.cameraGoal){const a=this.state.reducedMotion?1:Math.min(1,dt/110);this.camera.position.lerp(new THREE.Vector3(...this.cameraGoal.position),a);this.controls.target.lerp(new THREE.Vector3(...this.cameraGoal.target),a);if(this.camera.position.distanceTo(new THREE.Vector3(...this.cameraGoal.position))<.0001)this.cameraGoal=null;}
    const moved=this.controls.update();
    if(moved)this.invalidate(2);
    // Diam: tidak menggambar apa pun (GPU & baterai istirahat).
    if(!animating&&this.needsFrames<=0){this.slowWindow.length=0;return;}
    if(this.needsFrames>0)this.needsFrames--;
    if(this.state.playing&&!this.state.reducedMotion&&this.flowPoints.length>1){this.simTime+=dt/1000*this.state.speed;const t=(this.simTime*.8)%(this.flowPoints.length-1),i=Math.floor(t);this.marker.position.copy(this.flowPoints[i]).lerp(this.flowPoints[i+1],t-i);}
    this.renderer.render(this.scene,this.camera);this.frame++;
    if(this.frame%4===0||this.needsFrames===0)this.positionLabels();
    if(this.frame%30===0){const angle=this.controls.getAzimuthalAngle(),name=Math.abs(angle)<.7?'Depan':Math.abs(angle)>2.4?'Belakang':angle>0?'Sisi kiri tubuh':'Sisi kanan tubuh';if(name!==this.directionName){this.directionName=name;this.events.direction(name);}}
    if(this.frame>30){this.metrics.frames++;this.metrics.elapsedMs+=actualDt;this.metrics.drawCalls=this.renderer.info.render.calls;this.metrics.triangles=this.renderer.info.render.triangles;this.adapt(actualDt);}
    this.host.dataset.metrics=JSON.stringify({...this.metrics,pixelRatio:this.dpr});
  };
  /** Turunkan kualitas otomatis bila rata-rata frame saat bergerak > 30 ms (di bawah ±33 fps). */
  private adapt(frameMs: number) {
    if (frameMs > 250) { this.slowWindow.length = 0; return; } // jeda (tab/idle), bukan beban render
    this.slowWindow.push(frameMs); if (this.slowWindow.length < 90) return;
    const avg = this.slowWindow.reduce((a, b) => a + b, 0) / this.slowWindow.length; this.slowWindow.length = 0;
    if (avg > 30 && this.quality > 0) this.setQuality((this.quality - 1) as Quality);
  }
  private setQuality(q: Quality) {
    this.quality = q; this.dpr = pixelRatioFor(q); this.renderer.setPixelRatio(this.dpr);
    const all: THREE.Material[] = [...this.nodes.values()].flatMap(n => n.materials); if (this.boneMat) all.push(this.boneMat);
    setTissueQuality(q, all); this.updateStudio(); this.invalidate(3);
  }
  /** Gabungkan 200 tulang jadi satu draw call (+ versi sederhana untuk tampilan jauh). */
  private buildBoneBatch() {
    const bones = [...this.nodes.values()].filter(n => n.part.assetId === 'bone');
    if (!bones.length || this.boneLod) return;
    const full = mergeWorldGeometry(bones.flatMap(n => n.meshes));
    const far = clusterSimplify(full, .006);
    const look = tissueLook(bones[0].part);
    const mat = createTissueMaterial(look); setTissueUnit(mat, 1); this.boneMat = mat;
    const near = new THREE.Mesh(full, mat), low = new THREE.Mesh(far, mat);
    for (const m of [near, low]) { m.castShadow = true; m.receiveShadow = true; }
    const lod = new THREE.LOD(); lod.addLevel(near, 0); lod.addLevel(low, 1.9); lod.visible = false;
    this.boneLod = lod; this.model.add(lod);
    void this.renderer.compileAsync(lod, this.camera, this.scene).catch(() => {});
  }
  /** Pakai tulang gabungan bila semua tulang tampil seragam (tidak dipilih/dibongkar/disembunyikan sebagian). */
  private updateBoneBatch(uniform: boolean) {
    if (!this.boneLod || !this.boneMat) return;
    const on = uniform; this.boneBatchOn = on; this.boneLod.visible = on;
    const layer = this.state.layers.bone, alpha = layer.opacity;
    const m = this.boneMat; m.opacity = alpha; m.transparent = alpha < .99; m.depthWrite = alpha >= .45;
    m.clippingPlanes = this.state.section ? [this.plane] : []; m.needsUpdate = true;
    for (const n of this.nodes.values()) if (n.part.assetId === 'bone') for (const mesh of n.meshes) mesh.layers.set(on ? 1 : 0);
  }
  private disposeObject(root: THREE.Object3D) {const geometry=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();root.traverse(o=>{if(o instanceof THREE.Mesh){geometry.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}
  destroy() {
    this.disposed=true;cancelAnimationFrame(this.raf);this.loads.forEach(c=>c.abort());this.resize.disconnect();this.controls.dispose();
    const el=this.renderer.domElement;el.removeEventListener('pointerdown',this.down,true);el.removeEventListener('pointermove',this.move,true);el.removeEventListener('pointerup',this.up,true);el.removeEventListener('pointercancel',this.cancel,true);el.removeEventListener('lostpointercapture',this.cancel);el.removeEventListener('webglcontextlost',this.contextLost);document.removeEventListener('visibilitychange',this.onVisible);
    this.disposeObject(this.scene);this.flow.geometry.dispose();(this.flow.material as THREE.Material).dispose();this.environment.dispose();this.renderer.dispose();el.remove();this.labels.forEach(l=>l.remove());this.labels.clear();
  }
}
