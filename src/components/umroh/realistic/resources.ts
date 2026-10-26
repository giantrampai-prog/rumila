import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MaterialName, Position, WorldResources } from './types';

/** Shared GPU resources; all environment meshes are batched once after construction. */
export class Resources implements WorldResources {
  mat: Record<MaterialName, T.MeshStandardMaterial>;
  private resources = new Set<T.BufferGeometry | T.Material | T.Texture>();
  private cache = new Map<string, T.BufferGeometry>();
  private disposed = false;

  constructor(anisotropy = 4) {
    const texture = (path: string, color = false) => {
      const t = this.keep(new T.TextureLoader().load(path, (loaded) => { if (this.disposed) loaded.dispose(); }));
      t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = anisotropy;
      if (color) t.colorSpace = T.SRGBColorSpace;
      return t;
    };
    const map = texture('/umroh/textures/marble-diff.jpg', true);
    const normalMap = texture('/umroh/textures/marble-nor_gl.jpg');
    const roughnessMap = texture('/umroh/textures/marble-rough.jpg');
    const fabric = this.makeWeave();
    const material = (options: T.MeshStandardMaterialParameters) => this.keep(new T.MeshStandardMaterial(options));
    this.mat = {
      marble: material({ color: '#f5f4ee', map, normalMap, normalScale: new T.Vector2(.22, .22), roughnessMap, roughness: .38 }),
      limestone: material({ color: '#d6c6a7', map, normalMap, normalScale: new T.Vector2(.14, .14), roughness: .75 }),
      plaster: material({ color: '#eee6d7', roughness: .88 }),
      gold: material({ color: '#bb8731', metalness: .72, roughness: .28 }),
      darkGold: material({ color: '#87602e', metalness: .56, roughness: .42 }),
      glass: material({ color: '#8baba9', metalness: .3, roughness: .12, transparent: true, opacity: .36 }),
      wood: material({ color: '#593c26', roughness: .65 }),
      black: material({ color: '#131414', roughness: .7 }),
      kiswa: material({ color: '#111211', bumpMap: fabric, bumpScale: .025, roughness: .9 }),
      green: material({ color: '#176044', roughness: .46, metalness: .12 }),
      paving: material({ color: '#a59b89', map, roughness: .9 }),
      sand: material({ color: '#c1a47c', roughness: 1 }),
      fabric: material({ color: '#ede9db', bumpMap: fabric, bumpScale: .009, roughness: .98, side: T.DoubleSide }),
      metal: material({ color: '#b1b3b0', metalness: .8, roughness: .3 }),
      asphalt: material({ color: '#45433e', roughness: .95 }),
      carpet: material({ color: '#384c43', bumpMap: fabric, bumpScale: .02, roughness: 1 }),
      white: material({ color: '#f3f2ed', roughness: .68 }),
      darkStone: material({ color: '#59544b', map, roughness: .85 }),
    };
  }

  keep<G extends T.BufferGeometry | T.Material | T.Texture>(resource: G): G { this.resources.add(resource); return resource; }
  private geometry(key: string, make: () => T.BufferGeometry): T.BufferGeometry {
    let geo = this.cache.get(key);
    if (!geo) { geo = this.keep(make()); this.cache.set(key, geo); }
    return geo;
  }
  mesh(parent: T.Object3D, geometry: T.BufferGeometry, material: T.Material, at: Position = [0, 0, 0]): T.Mesh {
    this.keep(geometry); this.keep(material);
    const mesh = new T.Mesh(geometry, material);
    mesh.position.set(...at); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
    return mesh;
  }
  box(parent: T.Object3D, size: Position, at: Position, material: T.Material): T.Mesh {
    const mesh = this.mesh(parent, this.geometry('box', () => new T.BoxGeometry(1, 1, 1)), material, at);
    mesh.scale.set(...size); return mesh;
  }
  cylinder(parent: T.Object3D, top: number, bottom: number, height: number, at: Position, material: T.Material, segments = 24): T.Mesh {
    return this.mesh(parent, this.geometry(`c${top}/${bottom}/${height}/${segments}`, () => new T.CylinderGeometry(top, bottom, height, segments)), material, at);
  }
  sphere(parent: T.Object3D, size: Position, at: Position, material: T.Material): T.Mesh {
    const mesh = this.mesh(parent, this.geometry('sphere', () => new T.SphereGeometry(1, 24, 16)), material, at);
    mesh.scale.set(...size); return mesh;
  }
  floor(parent: T.Object3D, width: number, depth: number, material: T.Material = this.mat.marble): T.Mesh {
    const floor = this.mesh(parent, this.geometry(`floor${width}/${depth}`, () => new T.PlaneGeometry(width, depth)), material);
    floor.rotation.x = -Math.PI / 2; floor.castShadow = false; return floor;
  }
  sign(parent: T.Object3D, title: string, subtitle: string, at: Position, width = 4): T.Mesh {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#163d39'; ctx.fillRect(0, 0, 1024, 256);
    ctx.strokeStyle = '#beaa74'; ctx.lineWidth = 8; ctx.strokeRect(7, 7, 1010, 242);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fffdf3';
    ctx.font = '600 70px Arial,sans-serif'; ctx.fillText(title, 512, subtitle ? 91 : 128, 950);
    if (subtitle) { ctx.font = '38px Arial,sans-serif'; ctx.fillStyle = '#ddd7bf'; ctx.fillText(subtitle, 512, 183, 940); }
    const map = this.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 4;
    const mat = this.keep(new T.MeshStandardMaterial({ map, roughness: .65, side: T.DoubleSide }));
    mat.userData.keepUV = true;
    return this.mesh(parent, this.keep(new T.PlaneGeometry(width, width / 4)), mat, at);
  }
  private makeWeave(): T.CanvasTexture {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#777'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 4) {
      ctx.fillStyle = i % 8 ? '#727272' : '#858585'; ctx.fillRect(i, 0, 1, 256);
      ctx.fillStyle = i % 8 ? '#808080' : '#696969'; ctx.fillRect(0, i, 256, 1);
    }
    const t = this.keep(new T.CanvasTexture(canvas)); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(4, 4);
    return t;
  }
  /** Collapse static architecture to one draw per material/shadow class. */
  batch(group: T.Group): void {
    group.updateMatrixWorld(true);
    const buckets = new Map<string, { material: T.Material; geometries: T.BufferGeometry[]; shadow: boolean }>();
    const remove: T.Object3D[] = [];
    group.traverse((o) => {
      if (!(o instanceof T.Mesh) || o instanceof T.InstancedMesh || Array.isArray(o.material)) return;
      for (let parent = o.parent; parent && parent !== group; parent = parent.parent) if (parent.userData.dynamic) return;
      const geometry = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      geometry.applyMatrix4(o.matrixWorld);
      if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
      const positions = geometry.getAttribute('position');
      const normals = geometry.getAttribute('normal');
      if (!o.material.userData.keepUV) {
        const uv = new Float32Array(positions.count * 2);
        for (let i = 0; i < positions.count; i++) {
          const nx = Math.abs(normals.getX(i)), ny = Math.abs(normals.getY(i)), nz = Math.abs(normals.getZ(i));
          uv[i * 2] = (nx > nz && nx > ny ? positions.getZ(i) : positions.getX(i)) / 3;
          uv[i * 2 + 1] = (ny > nx && ny > nz ? positions.getZ(i) : positions.getY(i)) / 3;
        }
        geometry.setAttribute('uv', new T.BufferAttribute(uv, 2));
      } else if (!geometry.getAttribute('uv')) geometry.setAttribute('uv', new T.BufferAttribute(new Float32Array(positions.count * 2), 2));
      for (const key of Object.keys(geometry.attributes)) if (!['position', 'normal', 'uv'].includes(key)) geometry.deleteAttribute(key);
      const key = o.material.uuid + '/' + o.castShadow;
      let bucket = buckets.get(key);
      if (!bucket) { bucket = { material: o.material, geometries: [], shadow: o.castShadow }; buckets.set(key, bucket); }
      bucket.geometries.push(geometry); remove.push(o);
    });
    remove.forEach((o) => o.removeFromParent());
    for (const bucket of buckets.values()) {
      const merged = mergeGeometries(bucket.geometries);
      if (merged) { const mesh = this.mesh(group, this.keep(merged), bucket.material); mesh.castShadow = bucket.shadow; }
      bucket.geometries.forEach((g) => g.dispose());
    }
  }
  dispose(): void { this.disposed = true; this.resources.forEach((r) => r.dispose()); this.resources.clear(); this.cache.clear(); }
}
