// Buah asli di tanaman kebun: model 3D katalog (versi ringan, kulit bertekstur) dipasang sebagai
// InstancedMesh di setiap titik buah — satu model per jenis, beberapa salinan hanya menambah sedikit beban.
// Dibangun bertahap (terdekat dulu) supaya kebun langsung tampil tanpa tersendat.

import * as T from 'three';
import type { Fruit } from '@/lib/fruits/catalog';
import type { PlantKind } from '@/lib/fruits/garden';
import { createFruitModel } from '@/lib/fruits/models';
import type { Spot } from './build';

/** Ukuran tampil (meter). Sedikit dibesarkan dari aslinya agar jelas terlihat dari kamera atas. */
export function fruitSize(f: Fruit): number {
  const byId: Record<string, number> = { 'jeruk-bali': 0.36, cempedak: 0.55, blewah: 0.46, lemon: 0.22, 'jeruk-nipis': 0.16, markisa: 0.22, 'terong-belanda': 0.2 };
  if (byId[f.id]) return byId[f.id];
  switch (f.shape) {
    case 'watermelon':
      return 0.72;
    case 'jackfruit':
      return 0.8;
    case 'melon':
      return 0.46;
    case 'durian':
      return 0.46;
    case 'papaya':
    case 'soursop':
      return 0.42;
    case 'pineapple':
      return 0.62;
    case 'coconut':
      return 0.4;
    case 'banana':
      return 0.3;
    case 'grapes':
      return 0.36;
    case 'cherries':
      return 0.16;
    case 'strawberry':
      return 0.13;
    case 'date':
    case 'lychee':
    case 'gooseberry':
      return 0.1;
    case 'round':
      return 0.14;
    case 'dragonfruit':
    case 'mango':
    case 'avocado':
      return 0.28;
    case 'custard':
    case 'salak':
    case 'rambutan':
    case 'mangosteen':
      return 0.2;
    default:
      return 0.24;
  }
}

/** Cara buah menempel: menggantung (ujung atas di titik), tergeletak (dasar di titik), atau tepat di tengah. */
const anchorFor = (kind: PlantKind, f: Fruit): 'hang' | 'ground' | 'center' =>
  kind === 'vine' || kind === 'pineapple' || kind === 'spiky' ? 'ground' : kind === 'banana' || kind === 'trunk' || f.shape === 'coconut' ? 'center' : 'hang';

export class FruitHanger {
  private meshes = new Map<string, T.InstancedMesh[]>();
  constructor(private scene: T.Scene) {}

  has(id: string) {
    return this.meshes.has(id);
  }

  build(f: Fruit, kind: PlantKind, spots: Spot[]) {
    if (this.meshes.has(f.id) || !spots.length) return;
    const model = createFruitModel(f, 'lite');
    model.updateMatrixWorld(true);
    const box = new T.Box3().setFromObject(model);
    const anchor = anchorFor(kind, f);
    const shift = new T.Matrix4().makeTranslation(0, anchor === 'hang' ? -box.max.y : anchor === 'ground' ? -box.min.y : 0, 0);
    const k = fruitSize(f) / 2.6;
    const spotM = spots.map((s) => new T.Matrix4().compose(s.p, s.q, new T.Vector3().setScalar(k * (s.s ?? 1))).multiply(shift));
    const out: T.InstancedMesh[] = [];
    const local = new T.Matrix4(),
      m = new T.Matrix4();
    model.traverse((o) => {
      if (!(o instanceof T.Mesh)) return;
      const base = o.matrixWorld;
      const inner = o instanceof T.InstancedMesh ? o.count : 1;
      const im = new T.InstancedMesh(o.geometry, o.material, spotM.length * inner);
      let n = 0;
      for (const sm of spotM)
        for (let j = 0; j < inner; j++) {
          if (o instanceof T.InstancedMesh) o.getMatrixAt(j, local);
          else local.identity();
          m.multiplyMatrices(sm, base).multiply(local);
          im.setMatrixAt(n++, m);
        }
      im.castShadow = true;
      im.receiveShadow = true;
      im.computeBoundingSphere();
      this.scene.add(im);
      out.push(im);
    });
    this.meshes.set(f.id, out);
  }

  dispose() {
    const geos = new Set<T.BufferGeometry>(),
      mats = new Set<T.Material>();
    this.meshes.forEach((list) =>
      list.forEach((im) => {
        this.scene.remove(im);
        geos.add(im.geometry);
        (Array.isArray(im.material) ? im.material : [im.material]).forEach((x) => mats.add(x));
        im.dispose();
      }),
    );
    geos.forEach((g) => g.dispose());
    mats.forEach((mm) => {
      const s = mm as T.MeshStandardMaterial;
      s.map?.dispose();
      s.bumpMap?.dispose();
      s.roughnessMap?.dispose();
      mm.dispose();
    });
    this.meshes.clear();
  }
}
