// Model 3D astronaut Agam (GLB dari Higgsfield/Meshy: bertekstur, bertulang 24 sendi, pose A, tinggi 1,2 m).
// Dimuat ke dalam grup astronaut yang sudah ada: tinggi disamakan dengan astronaut prosedural lama (yang lalu
// disembunyikan), jadi semua posisi adegan tetap berlaku. Gerak (jalan, melayang) memutar tulang di sekitar
// sumbu ruang model (x = samping, z = depan), dihitung dari pose istirahat tiap tulang.

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const URL = "/roket/agam-astronot.glb";

export interface AgamModelOpts {
  /** berkas GLB bertulang (bawaan: astronaut Agam) */
  url?: string;
  /** atur skala/posisi/orientasi akar model sendiri; bila tidak ada, tinggi disamakan dengan isi `host` */
  fit?: (root: THREE.Object3D) => void;
}
const X = new THREE.Vector3(1, 0, 0);
const Z = new THREE.Vector3(0, 0, 1);

interface Joint {
  b: THREE.Bone;
  rest: THREE.Quaternion;
  /** kebalikan rotasi istirahat tulang di ruang model (untuk menerjemahkan sumbu model → sumbu lokal) */
  inv: THREE.Quaternion;
  /** +1 bila tulang di sisi +x model */
  side: number;
}

export interface AgamPose {
  /** ayunan paha kiri/kanan (radian, di sekitar sumbu samping) */
  legL: number;
  legR: number;
  /** ayunan lengan kiri/kanan */
  armL: number;
  armR: number;
  /** turunkan lengan dari pose A (0 = tetap terbuka, ±0,75 = menggantung di sisi badan) */
  lower: number;
}

export class AgamModel {
  ready = false;
  private joints = new Map<string, Joint>();
  private q = new THREE.Quaternion();
  private v = new THREE.Vector3();

  /** muat model ke dalam `host`; `onReady` dipanggil dengan akar model (mis. untuk penanda ketuk & bayangan) */
  constructor(host: THREE.Group, onReady?: (root: THREE.Object3D) => void, opts: AgamModelOpts = {}) {
    // tinggi astronaut prosedural dalam satuan grup (dipanggil saat grup masih di titik asal tanpa rotasi)
    host.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(host);
    const height = Math.max(0.3, (box.max.y - box.min.y) / (host.scale.y || 1));

    new GLTFLoader().load(
      opts.url ?? URL,
      (g) => {
        const root = g.scene;
        if (opts.fit) opts.fit(root);
        else root.scale.setScalar(height / 1.2);
        root.traverse((o) => {
          const m = o as THREE.SkinnedMesh;
          if (m.isMesh) {
            m.castShadow = true;
            m.frustumCulled = false; // mesh bertulang: kotak batas bawaan tidak ikut bergerak
          }
        });
        host.children.forEach((c) => (c.visible = false)); // sembunyikan astronaut prosedural
        host.add(root);
        root.updateMatrixWorld(true);
        // ruang model = ruang GLB sebelum rotasi `fit` (sumbu x samping, y atas, z depan tokoh)
        const rootInv = root.getWorldQuaternion(new THREE.Quaternion()).invert();
        root.traverse((o) => {
          const b = o as THREE.Bone;
          if (!b.isBone) return;
          const wq = b.getWorldQuaternion(new THREE.Quaternion()).premultiply(rootInv);
          const p = b.getWorldPosition(new THREE.Vector3());
          root.worldToLocal(p);
          this.joints.set(b.name, { b, rest: b.quaternion.clone(), inv: wq.invert(), side: p.x >= 0 ? 1 : -1 });
        });
        this.ready = true;
        this.pose(this.last); // pose terakhir yang diminta sebelum model siap
        onReady?.(root);
      },
      undefined,
      () => {
        /* gagal memuat: astronaut prosedural tetap dipakai */
      },
    );
  }

  /** putar tulang di sekitar beberapa sumbu ruang model, dimulai dari pose istirahat */
  private bend(name: string, parts: [THREE.Vector3, number][]) {
    const j = this.joints.get(name);
    if (!j) return;
    j.b.quaternion.copy(j.rest);
    for (const [axis, angle] of parts) {
      if (!angle) continue;
      this.v.copy(axis).applyQuaternion(j.inv).normalize();
      j.b.quaternion.multiply(this.q.setFromAxisAngle(this.v, angle));
    }
  }

  private last: AgamPose = { legL: 0, legR: 0, armL: 0, armR: 0, lower: 0.75 };

  pose(p: AgamPose) {
    this.last = p;
    if (!this.ready) return;
    this.bend("LeftUpLeg", [[X, p.legL]]);
    this.bend("RightUpLeg", [[X, p.legR]]);
    // lutut menekuk saat kaki terayun ke belakang (langkah terasa alami)
    this.bend("LeftLeg", [[X, -Math.max(0, p.legL) * 0.9]]);
    this.bend("RightLeg", [[X, -Math.max(0, p.legR) * 0.9]]);
    for (const [name, swing] of [
      ["LeftArm", p.armL],
      ["RightArm", p.armR],
    ] as const) {
      const side = this.joints.get(name)?.side ?? 1;
      this.bend(name, [
        [Z, -side * p.lower],
        [X, swing],
      ]);
    }
  }
}
