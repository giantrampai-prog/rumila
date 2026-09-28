import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type Material = THREE.Material;

/** Small, repeatable material maps: relief rather than painted-on panel outlines. */
export function cabinFabric(color: THREE.ColorRepresentation, weave = 40) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const pixels = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const n = 124 + 28 * Math.sin(x * Math.PI / 2) * Math.cos(y * Math.PI / 2) + 7 * Math.sin(x * 17 + y * 31);
    const i = (y * 256 + x) * 4;
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = n;
    pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  const bumpMap = new THREE.CanvasTexture(canvas);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(weave, weave);
  bumpMap.anisotropy = 4;
  const albedo = document.createElement("canvas"); albedo.width = albedo.height = 256;
  const paint = albedo.getContext("2d")!;
  paint.fillStyle = new THREE.Color(color).getStyle(); paint.fillRect(0, 0, 256, 256);
  paint.globalCompositeOperation = "soft-light"; paint.globalAlpha = 0.35; paint.drawImage(canvas, 0, 0);
  const map = new THREE.CanvasTexture(albedo); map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.copy(bumpMap.repeat); map.anisotropy = 4;
  return new THREE.MeshStandardMaterial({ map, bumpMap, bumpScale: 0.001, roughness: 0.87 });
}

export function rounded(parent: THREE.Object3D, size: [number, number, number], pos: [number, number, number], mat: Material, radius = 0.012) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 2, radius), mat);
  mesh.position.set(...pos);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function tube(parent: THREE.Object3D, points: THREE.Vector3[], radius: number, mat: Material, segments = 20) {
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, 6, false), mat);
  parent.add(mesh);
  return mesh;
}

function contour(w: number, h: number, r: number, cy = 0) {
  const path = new THREE.Shape();
  const x = -w / 2, y = cy - h / 2;
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y); path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + h - r); path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  path.lineTo(x + r, y + h); path.quadraticCurveTo(x, y + h, x, y + h - r);
  path.lineTo(x, y + r); path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

function frame(parent: THREE.Object3D, w: number, h: number, edge: number, radius: number, depth: number, mat: Material, y: number, z: number) {
  const shape = contour(w, h, radius);
  shape.holes.push(contour(w - edge * 2, h - edge * 2, Math.max(0.015, radius - edge)));
  const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.003, bevelSegments: 2, curveSegments: 10 }), mat);
  mesh.position.set(0, y, z);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function label(parent: THREE.Object3D, title: string, subtitle: string, width: number, y: number, z: number, dark = false) {
  const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 96;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = dark ? "#172331" : "#d9dddc"; ctx.fillRect(0, 0, 512, 96);
  ctx.fillStyle = dark ? "#dfebe9" : "#36434b";
  ctx.font = "600 30px system-ui"; ctx.fillText(title, 20, 39);
  ctx.fillStyle = dark ? "#94adae" : "#5b686e";
  ctx.font = "20px system-ui"; ctx.fillText(subtitle, 20, 75);
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, width * 96 / 512), new THREE.MeshBasicMaterial({ map, toneMapped: false }));
  m.position.set(0, y, z); parent.add(m);
}

export function buildCabinInterior(scene: THREE.Scene) {
  const enamel = new THREE.MeshStandardMaterial({ color: 0xcdd2d0, roughness: 0.48, metalness: 0.12 });
  const padded = cabinFabric(0xd2d3cd, 2);
  const graphite = new THREE.MeshStandardMaterial({ color: 0x202c35, roughness: 0.48, metalness: 0.35 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x121c24, roughness: 0.88 });
  const aluminum = new THREE.MeshStandardMaterial({ color: 0x9ba8af, roughness: 0.3, metalness: 0.8 });
  const fabric = cabinFabric(0x26343e, 3);
  const webbing = cabinFabric(0xa6b0ad, 2);
  const seam = new THREE.MeshStandardMaterial({ color: 0x64767e, roughness: 0.9 });
  const led = new THREE.MeshStandardMaterial({ color: 0xffeed0, emissive: 0xffdab0, emissiveIntensity: 2.5 });
  const boltGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.003, 8);
  const bolts: THREE.Matrix4[] = [];
  const dummy = new THREE.Object3D();
  const bolt = (parent: THREE.Object3D, x: number, y: number, z: number) => {
    parent.updateWorldMatrix(true, false);
    dummy.position.set(x, y, z); dummy.rotation.set(Math.PI / 2, 0, 0); dummy.updateMatrix();
    bolts.push(new THREE.Matrix4().multiplyMatrices(parent.matrixWorld, dummy.matrix));
  };
  // Three actual apertures, recessed seals and separate structural window reveals.
  for (let i = -1; i <= 1; i++) {
    const panel = new THREE.Group();
    const a = i * 0.53;
    panel.position.set(Math.sin(a) * 1.04, 0.12, Math.cos(a) * 1.04);
    panel.rotation.y = Math.PI + a;
    scene.add(panel);
    const shell = contour(0.64, 1.68, 0.045);
    shell.holes.push(contour(0.435, 0.70, 0.085, 0.28));
    const wall = new THREE.Mesh(new THREE.ExtrudeGeometry(shell, { depth: 0.055, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2, curveSegments: 10 }), enamel);
    wall.receiveShadow = true; panel.add(wall);
    frame(panel, 0.492, 0.756, 0.036, 0.108, 0.025, aluminum, 0.28, 0.073);
    frame(panel, 0.443, 0.707, 0.016, 0.084, 0.030, rubber, 0.28, 0.103);
    frame(panel, 0.415, 0.678, 0.008, 0.077, 0.012, graphite, 0.28, 0.135);
    // Low opacity glazing preserves the world pass behind the cabin.
    const glass = new THREE.Mesh(new THREE.ShapeGeometry(contour(0.411, 0.674, 0.074)), new THREE.MeshPhysicalMaterial({ color: 0xbadfe6, transparent: true, opacity: 0.025, roughness: 0.12, metalness: 0.15, depthWrite: false }));
    glass.position.set(0, 0.28, 0.149); panel.add(glass);
    for (const x of [-0.237, 0.237]) for (const y of [-0.005, 0.18, 0.40, 0.565]) bolt(panel, x, y, 0.103);
    rounded(panel, [0.31, 0.018, 0.02], [0, 0.739, 0.065], rubber, 0.006);
    rounded(panel, [0.285, 0.007, 0.008], [0, 0.729, 0.079], led, 0.003);
    label(panel, i === 0 ? "RINOYA  /  KAPSUL" : `JENDELA  0${i + 2}`, "MODUL AWAK  •  EKSPEDISI ANGKASA", 0.33, -0.132, 0.068);
  }
  // Molded wall pads follow the capsule perimeter. Seams are geometry, not a grid decal.
  for (let i = 0; i < 9; i++) {
    const a = 1.12 + i * (Math.PI * 2 - 2.24) / 8;
    const panel = new THREE.Group(); panel.position.set(Math.sin(a) * 1.055, 0.1, Math.cos(a) * 1.055); panel.rotation.y = Math.PI + a; scene.add(panel);
    rounded(panel, [0.64, 1.64, 0.065], [0, 0, 0], graphite, 0.025);
    for (let row = 0; row < 3; row++) {
      rounded(panel, [0.607, 0.513, 0.055], [0, -0.535 + row * 0.535, 0.042], padded, 0.032);
      for (const x of [-0.2, 0.2]) for (const dy of [-0.215, 0.215]) bolt(panel, x, -0.535 + row * 0.535 + dy, 0.073);
    }
    // Service rail with a recessed ventilation grille and restrained work light.
    rounded(panel, [0.35, 0.079, 0.025], [0, 0.49, 0.077], rubber, 0.012);
    for (let k = 0; k < 13; k++) rounded(panel, [0.012, 0.052, 0.009], [-0.146 + k * 0.0243, 0.49, 0.092], aluminum, 0.003);
    rounded(panel, [0.36, 0.008, 0.018], [0, 0.738, 0.083], led, 0.003);
  }
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.045, 64), rubber); floor.position.y = -0.732; floor.receiveShadow = true; scene.add(floor);
  for (let x = -0.9; x <= 0.9; x += 0.15) rounded(scene, [0.006, 0.006, 1.4], [x, -0.704, 0], graphite, 0.002);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.06, 64), enamel); roof.position.y = 0.97; scene.add(roof);
  const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.04, 48), graphite); hatch.position.y = 0.915; scene.add(hatch);
  const hatchInset = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.05, 48), padded); hatchInset.position.y = 0.905; scene.add(hatchInset);
  rounded(scene, [0.26, 0.025, 0.045], [0, 0.858, 0], aluminum);

  const makeSeat = (x: number, z: number, yaw: number) => {
    const seat = new THREE.Group(); seat.position.set(x, -0.31, z); seat.rotation.y = yaw; scene.add(seat);
    for (const sx of [-1, 1]) {
      rounded(seat, [0.035, 0.22, 0.42], [sx * 0.13, -0.25, 0.02], aluminum);
      rounded(seat, [0.043, 0.018, 0.50], [sx * 0.13, -0.366, 0.02], graphite, 0.005);
    }
    const back = new THREE.Group(); back.position.set(0, 0.15, -0.125); back.rotation.x = -0.17; seat.add(back);
    rounded(back, [0.395, 0.66, 0.095], [0, 0, 0], enamel, 0.043);
    rounded(back, [0.315, 0.48, 0.082], [0, -0.066, 0.057], fabric, 0.04);
    rounded(back, [0.29, 0.153, 0.095], [0, 0.24, 0.075], fabric, 0.04);
    for (const sx of [-1, 1]) {
      rounded(back, [0.064, 0.39, 0.114], [sx * 0.153, -0.073, 0.08], fabric, 0.03);
      tube(back, [new THREE.Vector3(sx * 0.116, 0.16, 0.119), new THREE.Vector3(sx * 0.118, -0.02, 0.115), new THREE.Vector3(sx * 0.115, -0.235, 0.115)], 0.0018, seam);
      const strap = rounded(back, [0.04, 0.415, 0.008], [sx * 0.075, -0.029, 0.123], webbing, 0.004); strap.rotation.z = sx * 0.18;
      rounded(back, [0.048, 0.026, 0.012], [sx * 0.09, 0.107, 0.131], aluminum, 0.005);
    }
    rounded(seat, [0.385, 0.082, 0.40], [0, -0.16, 0.07], enamel, 0.03);
    rounded(seat, [0.326, 0.09, 0.35], [0, -0.103, 0.074], fabric, 0.04);
    for (const sx of [-1, 1]) {
      rounded(seat, [0.06, 0.04, 0.32], [sx * 0.202, -0.008, 0.07], graphite, 0.018);
      const lap = rounded(seat, [0.15, 0.008, 0.041], [sx * 0.082, -0.044, 0.05], webbing, 0.003); lap.rotation.z = sx * 0.15;
    }
    const buckle = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.031, 0.012, 24), aluminum); buckle.position.set(0, -0.027, 0.05); seat.add(buckle);
    rounded(seat, [0.022, 0.01, 0.014], [0, -0.017, 0.05], new THREE.MeshStandardMaterial({ color: 0xae512c, roughness: 0.55 }), 0.003);
    return seat;
  };
  makeSeat(-0.58, -0.02, 0.26); makeSeat(0.58, -0.02, -0.26);
  // Console mounts face the pilot; rounded housings sit behind independent live displays.
  const mounts: THREE.Group[] = [];
  for (let k = 0; k < 3; k++) {
    const mount = new THREE.Group(); mount.position.set((k - 1) * 0.352, -0.185, 0.695 - Math.abs(k - 1) * 0.07); mount.lookAt(0, 0.19, -0.42); scene.add(mount);
    rounded(mount, [0.354, 0.282, 0.060], [0, -0.007, -0.026], aluminum, 0.022);
    rounded(mount, [0.342, 0.27, 0.036], [0, -0.007, 0.005], graphite, 0.019);
    rounded(mount, [0.314, 0.202, 0.008], [0, 0.017, 0.026], rubber, 0.008);
    label(mount, ["NAVIGASI", "PENERBANGAN", "AWAK"][k], "RINOYA  /  SISTEM KAPSUL", 0.21, -0.105, 0.028, true);
    for (const x of [-0.156, 0.156]) for (const y of [-0.12, 0.11]) bolt(mount, x, y, 0.028);
    mounts.push(mount);
  }
  // Lower control shelf: guarded switch, rotary controls, ventilation, handholds.
  const shelf = new THREE.Group(); shelf.position.set(0, -0.365, 0.565); shelf.rotation.x = -0.45; scene.add(shelf);
  rounded(shelf, [1.13, 0.085, 0.255], [0, 0, 0], graphite, 0.035);
  for (const sx of [-1, 1]) {
    tube(scene, [new THREE.Vector3(sx * 0.52, -0.38, 0.61), new THREE.Vector3(sx * 0.56, -0.34, 0.48), new THREE.Vector3(sx * 0.57, -0.22, 0.48), new THREE.Vector3(sx * 0.55, -0.18, 0.64)], 0.013, aluminum);
    for (let k = 0; k < 4; k++) {
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.023, 24), aluminum); dial.position.set(sx * (0.18 + k * 0.075), 0.052, 0.02); shelf.add(dial);
      rounded(shelf, [0.003, 0.003, 0.012], [dial.position.x, 0.065, 0.02], rubber, 0.001);
    }
  }
  rounded(shelf, [0.074, 0.012, 0.065], [0, 0.052, 0.02], rubber, 0.009);
  rounded(shelf, [0.04, 0.018, 0.032], [0, 0.065, 0.02], new THREE.MeshStandardMaterial({ color: 0xad4e2b, metalness: 0.3, roughness: 0.4 }), 0.007);
  for (const sx of [-1, 1]) rounded(shelf, [0.009, 0.034, 0.077], [sx * 0.042, 0.061, 0.02], aluminum, 0.004);
  const fasteners = new THREE.InstancedMesh(boltGeo, aluminum, bolts.length);
  bolts.forEach((matrix, i) => fasteners.setMatrixAt(i, matrix)); scene.add(fasteners);
  // Broad window fill plus warm practical fixtures keep material relief visible.
  const fill = new THREE.PointLight(0xcbe7ff, 0.95, 4, 2); fill.position.set(0, 0.48, 0.67); scene.add(fill);
  const key = new THREE.SpotLight(0xffe6be, 2.8, 4, Math.PI / 2.8, 0.6, 2); key.position.set(-0.36, 0.76, -0.16);
  key.target.position.set(0, -0.3, 0.55); scene.add(key.target);
  key.castShadow = true; key.shadow.mapSize.set(512, 512); key.shadow.bias = -0.00015; key.shadow.normalBias = 0.005; key.shadow.camera.near = 0.05; key.shadow.camera.far = 4; scene.add(key);
  scene.add(new THREE.HemisphereLight(0xcbd8e4, 0x384148, 0.7));
  batchStaticInterior(scene);
  return mounts;
}

export function plushStar() {
  const group = new THREE.Group();
  const outline = new THREE.Shape();
  const vertices = Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; const r = i % 2 ? 0.033 : 0.069; return new THREE.Vector2(Math.sin(a) * r, Math.cos(a) * r); });
  outline.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i <= 10; i++) outline.lineTo(vertices[i % 10].x, vertices[i % 10].y);
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(outline, { depth: 0.018, bevelEnabled: true, bevelSize: 0.009, bevelThickness: 0.011, bevelSegments: 5, curveSegments: 12 }), cabinFabric(0xdbab46, 1));
  body.position.z = -0.009; body.castShadow = true; group.add(body);
  const thread = new THREE.MeshStandardMaterial({ color: 0xf4d58a, roughness: 1 });
  const seamPath = [...vertices, vertices[0]].map(v => new THREE.Vector3(v.x * 0.91, v.y * 0.91, -0.021));
  for (let i = 0; i < seamPath.length - 1; i++) {
    for (let j = 0; j < 6; j++) {
      const a = seamPath[i].clone().lerp(seamPath[i + 1], j / 6);
      const b = seamPath[i].clone().lerp(seamPath[i + 1], (j + 0.45) / 6);
      tube(group, [a, b], 0.00065, thread, 1);
    }
  }
  const ink = new THREE.MeshStandardMaterial({ color: 0x393124, roughness: 0.8 });
  for (const x of [-0.014, 0.014]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.004, 12, 8), ink); eye.scale.z = 0.35; eye.position.set(x, 0.008, -0.022); group.add(eye); }
  tube(group, [new THREE.Vector3(-0.009, -0.005, -0.022), new THREE.Vector3(0, -0.011, -0.023), new THREE.Vector3(0.009, -0.005, -0.022)], 0.0013, ink, 10);
  return group;
}

/** Deduplicated disposal also covers relief maps shared by seats, suits and window trims. */
export function disposeCabin(scene: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
  scene.traverse(object => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    if (mesh.material) for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      materials.add(mat);
      for (const value of Object.values(mat)) if (value instanceof THREE.Texture) textures.add(value);
    }
    if (object instanceof THREE.Light && "shadow" in object) (object.shadow as THREE.LightShadow | undefined)?.dispose();
  });
  geometries.forEach(x => x.dispose()); materials.forEach(x => x.dispose()); textures.forEach(x => x.dispose());
}

// Consolidate stationary panels/trim by material. Displays and animated occupants are added later.
function batchStaticInterior(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  const batches = new Map<string, THREE.Mesh<THREE.BufferGeometry, THREE.Material>[]>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh || Array.isArray(object.material) || object.material.transparent) return;
    const key = `${object.material.uuid}:${object.castShadow}:${object.receiveShadow}`;
    const group = batches.get(key) ?? []; group.push(object); batches.set(key, group);
  });
  const retired = new Set<THREE.BufferGeometry>();
  batches.forEach(meshes => {
    if (meshes.length < 2) return;
    const geometries = meshes.map(mesh => {
      const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      return geometry.applyMatrix4(mesh.matrixWorld);
    });
    const combined = mergeGeometries(geometries, false);
    geometries.forEach(geometry => geometry.dispose());
    if (!combined) return;
    const merged = new THREE.Mesh(combined, meshes[0].material);
    merged.castShadow = meshes[0].castShadow; merged.receiveShadow = meshes[0].receiveShadow;
    root.add(merged);
    meshes.forEach(mesh => { mesh.removeFromParent(); retired.add(mesh.geometry); });
  });
  retired.forEach(geometry => geometry.dispose());
}
