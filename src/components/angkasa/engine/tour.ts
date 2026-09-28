// Pengendali "Tur terbang" (POV penjelajah) di scene tata surya.
// Fase: terbang (kamera menghadap arah gerak, lalu berbelok ke tujuan) → singgah (melayang pelan mengitari objek
// sambil teks edukatif berganti) → persinggahan berikutnya. Input pengguna menjeda tur dan mengembalikan kontrol kamera.
// Bila ada narasi rekaman (satu file untuk seluruh tur), audio menjadi jam utama: pindah persinggahan & ganti kalimat
// mengikuti posisi audio; tanpa rekaman, lama singgah mengikuti waktu baca teks.

import * as THREE from "three";
import { useAngkasa } from "@/lib/angkasa/state";
import { TOUR, dwellSeconds, lineAt } from "@/lib/angkasa/tour";
import {
  lineAtTime,
  partFor,
  stopAt,
  type TourAudioPart,
} from "@/lib/angkasa/tourVoice";
import { sharedAudio } from "@/lib/audio-unlock";
import type { Body } from "./bodies";
import type { EngineCtx } from "./core";

/** detik hening setelah narasi satu persinggahan selesai, sebelum terbang */
const LEAVE_QUIET = 1.6;
/** detik hening setelah tiba, sebelum narasi persinggahan dimulai */
const ARRIVE_QUIET = 1.2;

const smooth = (t: number) => t * t * (3 - 2 * t);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface Host {
  camera: THREE.PerspectiveCamera;
  bodies: Map<string, Body>;
}

export class TourController {
  /** objek yang sedang disinggahi (untuk label) */
  targetId: string | null = null;
  private index = -1;
  private phase: "travel" | "dwell" | "idle" = "idle";
  private curve: THREE.CatmullRomCurve3 | null = null;
  private travelT = 0;
  private travelDur = 1;
  private dwellT = 0;
  private dwellDur = 10;
  private orbitAngle = 0;
  private orbitRadius = 3;
  private orbitHeight = 0.5;
  private lookFrom = new THREE.Vector3();
  private lastLine = -1;
  private playing = false;
  private saved: { min: number; max: number; enabled: boolean } | null = null;
  private tmp = new THREE.Vector3();
  /** geser titik pandang ke bawah agar objek tampil di atas teks keterangan */
  private lift = 0;
  /** 0–1: mode Mata Agam (kokpit) — planet dibingkai di jendela di atas dasbor, tidak terpotong */
  private povK = 0;
  private vp = new THREE.Vector2();

  /**
   * Bingkai jendela kokpit: gambar kokpit (1672×941, object-fit cover, rata bawah) — dasbor mulai ±y 560.
   * Kembalikan {lift, zoom}: geser titik pandang ke bawah agar planet naik ke tengah jendela, dan mundurkan
   * kamera secukupnya agar planet muat utuh.
   */
  private povFrame(dist: number) {
    if (this.povK < 0.001) return { lift: 0, zoom: 1 };
    this.ctx.renderer.getSize(this.vp);
    const W = this.vp.x,
      H = this.vp.y;
    if (!(W > 0 && H > 0)) return { lift: 0, zoom: 1 }; // kanvas belum berukuran (tab di latar)
    const k = Math.max(W / 1672, H / 941);
    const f = THREE.MathUtils.clamp((H - 941 * k + 560 * k) / H, 0.35, 0.95); // bagian layar di atas dasbor
    const tanH = Math.tan((this.host.camera.fov * Math.PI) / 360);
    const zoom = Math.max(1, 0.37 / (0.78 * f));
    return { lift: dist * zoom * (1 - f) * tanH * this.povK, zoom: 1 + (zoom - 1) * this.povK };
  }
  /* Narasi rekaman (satu file) */
  private part: TourAudioPart | null = null;
  private failed = new Set<string>();
  /** lompatan persinggahan dari pengguna: posisikan audio ke awal narasinya */
  private forceSeek = false;
  private audio: HTMLAudioElement | null = null;
  private playRequested = false;
  private voiceWait = 0;
  private pendingSeek: number | null = null;
  /** true = perpindahan persinggahan berasal dari audio/lanjut-jeda (jangan lompatkan audio) */
  private followAudio = false;
  /* Sinematik (tampilan anak): efek warp FOV, kemiringan saat berbelok, melayang & mendekat saat singgah */
  private baseFov = 45;
  /** arah belokan jalur terbang (-1 kiri … 1 kanan) untuk memiringkan kamera */
  private turn = 0;
  private upTmp = new THREE.Vector3();
  /** ≥0: sedang diam setelah narasi persinggahan selesai (detik) */
  private linger = -1;
  /** pusat tujuan saat perjalanan dimulai (tujuan terus mengorbit; jalur ikut bergeser sebesar perpindahannya) */
  private center0 = new THREE.Vector3();
  /** arah & jarak pandang saat berangkat (pandangan berbelok mulus dari sini) */
  private dir0 = new THREE.Vector3();
  private look0 = 1;
  /** titik pandang yang diperhalus (menghilangkan sentakan kecil arah kamera) */
  private lookSmooth = new THREE.Vector3();
  private v1 = new THREE.Vector3();
  private qTmp = new THREE.Quaternion();
  private qId = new THREE.Quaternion();

  constructor(
    private host: Host,
    private ctx: EngineCtx,
  ) {
    this.saved = {
      min: ctx.controls.minDistance,
      max: ctx.controls.maxDistance,
      enabled: ctx.controls.enabled,
    };
    this.baseFov = host.camera.fov;
    ctx.controls.minDistance = 0.02;
    ctx.controls.maxDistance = 400;
    ctx.renderer.domElement.addEventListener("pointerdown", this.onUserInput);
    ctx.renderer.domElement.addEventListener("wheel", this.onUserInput, {
      passive: true,
    });
  }

  /** Input pengguna (geser/zoom) menjeda tur; kamera bebas dipakai. */
  private onUserInput = () => {
    if (this.playing) useAngkasa.getState().set({ tourPlaying: false });
  };

  private get cinematic() {
    return useAngkasa.getState().tourCinematic && !this.ctx.reducedMotion();
  }

  /** Kembalikan FOV & arah atas kamera ke normal (atau mendekatinya perlahan bila k < 1). */
  private settleCamera(k = 1) {
    const cam = this.host.camera;
    if (Math.abs(cam.fov - this.baseFov) > 0.01) {
      cam.fov += (this.baseFov - cam.fov) * k;
      cam.updateProjectionMatrix();
    }
    cam.up.lerp(this.upTmp.set(0, 1, 0), k).normalize();
  }

  /** Posisi dunia pusat objek persinggahan. */
  private centerOf(id: string, out: THREE.Vector3) {
    if (id === "intro" || id === "outro") return out.set(0, 0, 0);
    return this.host.bodies.get(id)!.orbitAnchor.getWorldPosition(out);
  }

  /** Titik tiba: sisi yang tersinari Matahari, sedikit di atas bidang, jarak cukup untuk membingkai objek. */
  private arrival(id: string) {
    const center = this.centerOf(id, new THREE.Vector3());
    if (id === "intro")
      return { center, pos: new THREE.Vector3(0, 16, 62), radius: 62 };
    if (id === "outro")
      return { center, pos: new THREE.Vector3(-20, 46, 88), radius: 100 };
    const b = this.host.bodies.get(id)!;
    const half = this.ctx.fitHalfFov();
    // Komet dibidik dari samping & lebih jauh agar ekornya (menjauhi Matahari) terlihat utuh.
    const comet = id === "comet-example";
    const dist =
      (b.frameRadius / Math.sin(half)) *
      (comet ? 9 : b.rings ? 1.6 : id === "sun" ? 2 : 2.7);
    const toSun = center.clone().negate().normalize();
    if (toSun.lengthSq() < 0.5) toSun.set(0, 0, 1);
    const side = new THREE.Vector3(0, 1, 0).cross(toSun).normalize();
    // Bumi: datang dari sisi yang jauh dari Bulan agar Bulan tidak menutupi Bumi
    if (id === "earth") {
      const mp = this.host.bodies.get("moon")?.orbitAnchor.getWorldPosition(new THREE.Vector3());
      if (mp && mp.sub(center).dot(side) > 0) side.negate();
    }
    const dir = toSun
      .multiplyScalar(comet ? 0.35 : 0.8)
      .add(side.multiplyScalar(comet ? 1 : 0.55))
      .add(new THREE.Vector3(0, 0.3, 0))
      .normalize();
    return {
      center,
      pos: center.clone().add(dir.multiplyScalar(dist)),
      radius: dist,
    };
  }

  /** Mulai perjalanan ke persinggahan i dari posisi kamera sekarang. */
  go(i: number) {
    this.index = Math.max(0, Math.min(TOUR.length - 1, i));
    const stop = TOUR[this.index];
    this.targetId = stop.id === "intro" || stop.id === "outro" ? null : stop.id;
    if (this.targetId)
      this.host.bodies
        .get(this.targetId)
        ?.loadDetail(this.ctx)
        .catch(() => {});
    const { center, pos, radius } = this.arrival(stop.id);
    const start = this.host.camera.position.clone();
    const span = start.distanceTo(pos);
    // Jalur melengkung: naik sedikit di tengah perjalanan, lalu mendekat dari arah tiba.
    const mid = start
      .clone()
      .lerp(pos, 0.5)
      .add(new THREE.Vector3(0, Math.min(8, span * 0.18), 0));
    const wide = stop.id === "intro" || stop.id === "outro";
    const approach = wide
      ? start.clone().lerp(pos, 0.8)
      : pos.clone().add(
          pos
            .clone()
            .sub(center)
            .normalize()
            .multiplyScalar(radius * 0.6),
        );
    this.curve = new THREE.CatmullRomCurve3(
      [start, mid, approach, pos],
      false,
      "centripetal",
    );
    this.curve.arcLengthDivisions = 1500; // tabel panjang busur rapat: laju terbang rata, tanpa getaran kecil
    this.travelDur = this.ctx.reducedMotion()
      ? 0
      : Math.max(3, Math.min(8, 2 + span / 9)) * (this.cinematic ? 1.3 : 1);
    this.travelT = 0;
    this.phase = this.travelDur > 0 && span > 0.05 ? "travel" : "dwell";
    this.setArrived(this.phase === "dwell");
    this.lookFrom.copy(this.ctx.controls.target);
    this.lookSmooth.copy(this.ctx.controls.target);
    this.center0.copy(center);
    this.dir0.subVectors(this.lookFrom, start);
    this.look0 = Math.max(0.5, this.dir0.length());
    this.dir0.normalize();
    this.dwellT = 0;
    this.dwellDur = dwellSeconds(stop);
    const rel = pos.clone().sub(center);
    this.orbitRadius = Math.hypot(rel.x, rel.z);
    this.orbitHeight = rel.y;
    this.orbitAngle = Math.atan2(rel.z, rel.x);
    // Tanpa kartu teks (sinematik), objek dibingkai tepat di tengah layar.
    this.lift = this.cinematic ? 0 : radius * (wide ? 0.16 : 0.2);
    // Arah belokan: sisi mana tujuan berada relatif terhadap arah pandang sekarang.
    const fwd = this.ctx.controls.target.clone().sub(start).setY(0).normalize();
    const to = pos.clone().sub(start).setY(0).normalize();
    this.turn = THREE.MathUtils.clamp(fwd.x * to.z - fwd.z * to.x, -1, 1);
    this.lastLine = -1;
    // Lompat ke persinggahan (tombol/rute): posisikan audio ke awal narasi persinggahan itu.
    if (!this.followAudio) this.forceSeek = true;
    this.followAudio = false;
    if (this.phase === "dwell") this.placeDwell(0);
  }

  private setArrived(v: boolean) {
    if (useAngkasa.getState().tourArrived !== v) useAngkasa.getState().set({ tourArrived: v });
  }

  /** 0–1 kencang terbang (untuk api mesin pesawat) & arah belokan saat ini */
  get thrust() {
    if (!this.playing) return 0.1;
    return this.phase === "travel" ? Math.sin(Math.PI * Math.min(1, this.travelT)) * 0.8 + 0.2 : 0.15;
  }
  get flying() {
    return this.phase === "travel";
  }
  get banking() {
    if (this.phase === "travel") return this.turn * Math.sin(Math.PI * this.travelT);
    // singgah: pesawat miring ke dalam lingkaran, tanda sedang berkeliling
    return this.phase === "dwell" ? 0.35 * smooth(Math.min(1, this.dwellT / 3)) : 0;
  }

  setPlaying(p: boolean) {
    const was = this.playing;
    this.playing = p;
    // Saat dijeda, kontrol kamera diserahkan ke pengguna; saat lanjut, terbang lagi dari posisi sekarang.
    this.ctx.controls.enabled = !p;
    if (!p) {
      this.settleCamera();
      this.audio?.pause();
      this.playRequested = false;
    }
    if (p && !was && this.index >= 0) {
      const keepDwell = this.phase === "dwell" ? this.dwellT : 0;
      this.followAudio = true; // lanjut dari jeda: audio meneruskan posisinya
      this.go(this.index);
      if (this.phase === "dwell") this.dwellT = keepDwell;
    }
  }

  /** Kamera melayang mengitari objek selama singgah (satu putaran lambat), menghadap objek. */
  private placeDwell(dt: number) {
    const stop = TOUR[this.index];
    const center = this.centerOf(stop.id, this.tmp);
    const wide = stop.id === "intro" || stop.id === "outro";
    // rad/detik; dinaikkan perlahan setelah tiba agar tidak ada sentakan dari diam → mengitari
    // tampilan anak: mengitari cukup terasa (±7°/detik) — pesawat terlihat berkeliling, tidak diam
    const speed = this.ctx.reducedMotion() ? 0 : (wide ? 0.035 : 0.09) * (this.cinematic ? 1.4 : 1) * smooth(Math.min(1, this.dwellT / 3));
    this.orbitAngle += speed * dt;
    const cam = this.host.camera;
    let r = this.orbitRadius,
      h = this.orbitHeight;
    if (this.cinematic) {
      // Mendekat pelan selama singgah + melayang naik-turun halus.
      const p = smooth(Math.min(1, this.dwellT / Math.max(4, this.dwellDur)));
      r *= wide ? 1 - 0.04 * p : 1 - 0.1 * p;
      // naik-turun perlahan seperti pesawat yang berkeliling (bukan lintasan datar)
      h += Math.sin(this.dwellT * 0.35) * this.orbitRadius * 0.07 * smooth(Math.min(1, this.dwellT / 3));
      this.settleCamera(Math.min(1, dt * 1.5));
    }
    const pv = this.povFrame(r);
    const zin = 1 + (pv.zoom - 1) * smooth(Math.min(1, this.dwellT / 2.5));
    r *= zin;
    h *= zin;
    cam.position.set(
      center.x + Math.cos(this.orbitAngle) * r,
      center.y + h,
      center.z + Math.sin(this.orbitAngle) * r,
    );
    this.ctx.controls.target.copy(center).y -= this.lift + pv.lift;
  }

  update(dt: number) {
    if (this.index < 0 || !this.playing) return;
    const st = useAngkasa.getState();
    this.povK += ((this.cinematic && st.tourCam === "mata" ? 1 : 0) - this.povK) * (1 - Math.exp(-dt * 2));
    if (this.syncAudio(dt)) return; // audio memindahkan persinggahan (go() sudah dipanggil)
    const stop = TOUR[this.index];
    const cam = this.host.camera;
    if (this.phase === "travel" && this.curve) {
      this.travelT = Math.min(1, this.travelT + dt / this.travelDur);
      const k = easeInOut(this.travelT);
      const center = this.centerOf(stop.id, this.tmp);
      // Tujuan bergerak di orbitnya selama perjalanan: jalur ikut bergeser bertahap → tiba tepat di titik singgah.
      const drift = this.v1.subVectors(center, this.center0).multiplyScalar(k);
      cam.position.copy(this.curve.getPointAt(k)).add(drift);
      // Arah pandang: berputar mulus (slerp) dari arah semula ke objek tujuan. Tidak menghadap arah gerak lebih dulu:
      // bila tujuan ada di belakang, itu memaksa putaran ±180° yang cepat dan memusingkan.
      const b = smooth(Math.min(1, this.travelT / 0.7));
      const toC = center.clone().setY(center.y - this.lift - this.povFrame(cam.position.distanceTo(center)).lift / Math.max(1, this.povFrame(1).zoom)).sub(cam.position);
      const dC = toC.length();
      toC.divideScalar(Math.max(1e-4, dC));
      if (this.dir0.dot(toC) < -0.999) this.dir0.applyAxisAngle(this.upTmp.set(0, 1, 0), 0.01); // hindari sumbu tak tentu
      this.qTmp.setFromUnitVectors(this.dir0, toC);
      const dir = this.dir0.clone().applyQuaternion(this.qId.slerp(this.qTmp, b));
      this.qId.identity();
      const dist = this.look0 + (dC - this.look0) * b;
      const look = cam.position.clone().addScaledVector(dir, Math.max(0.3, dist));
      // Peredam: titik pandang mengejar sasaran dengan pegas kritis (sisa sentakan hilang), menyatu di akhir.
      const damp = 1 - Math.exp(-dt * (6 + 18 * b * b));
      this.lookSmooth.lerp(look, this.travelT >= 1 ? 1 : damp);
      this.ctx.controls.target.copy(this.lookSmooth);
      if (this.cinematic) {
        // Warp: pandangan melebar saat melesat, kembali normal saat tiba.
        const pulse = Math.sin(Math.PI * k);
        cam.fov = this.baseFov + 5 * pulse * pulse;
        cam.updateProjectionMatrix();
        // Miring ke arah belokan, seperti pesawat.
        const roll = -this.turn * 0.05 * Math.sin(Math.PI * this.travelT);
        const fwd = this.lookSmooth.clone().sub(cam.position).normalize();
        cam.up.set(0, 1, 0).applyAxisAngle(fwd, roll).normalize();
      }
      if (this.travelT >= 1) {
        this.phase = "dwell";
        this.setArrived(true);
      }
      return;
    }
    if (this.phase === "dwell") {
      this.dwellT += dt;
      this.placeDwell(dt);
      if (partFor(this.index, this.failed)) return; // kalimat & perpindahan diatur audio
      const line = lineAt(stop, this.dwellT);
      if (line !== this.lastLine) {
        this.lastLine = line;
        useAngkasa.getState().set({ tourLine: line });
      }
      if (this.dwellT >= this.dwellDur) {
        const st = useAngkasa.getState();
        if (this.index < TOUR.length - 1)
          st.set({ tourIndex: this.index + 1, tourLine: 0 });
        else {
          this.phase = "idle";
          st.set({ tourPlaying: false });
        }
      }
    }
  }

  private getAudio() {
    if (!this.audio) {
      this.audio = sharedAudio("tour"); // elemen bersama yang sudah dibuka kuncinya (iPad/iPhone)
      this.audio.onerror = () => this.dropPart();
    }
    return this.audio;
  }

  /** Bagian rekaman gagal dimuat/diblokir: persinggahannya memakai waktu baca teks. */
  private dropPart() {
    if (this.part) this.failed.add(this.part.src);
    this.part = null;
    this.audio?.pause();
    this.dwellT = 0;
  }

  /** Jalankan audio bagian yang mencakup persinggahan aktif & ikuti posisinya. true bila persinggahan berpindah. */
  private syncAudio(dt: number) {
    const part = partFor(this.index, this.failed);
    const a = this.getAudio();
    if (!part) {
      if (!a.paused) a.pause();
      this.part = null;
      return false;
    }
    const k = this.index - part.first;
    if (part !== this.part) {
      // pindah bagian: muat file & mulai dari narasi persinggahan ini
      this.part = part;
      a.src = part.src;
      this.pendingSeek = part.cues[k] ?? 0;
      this.playRequested = false;
      this.voiceWait = 0;
      this.forceSeek = false;
    } else if (this.forceSeek) {
      this.pendingSeek = part.cues[k] ?? 0;
      this.forceSeek = false;
    }
    a.muted = !useAngkasa.getState().tourNarration; // "Narasi" mati = bisu, waktunya tetap mengikuti rekaman
    if (a.readyState >= 1 && this.pendingSeek !== null) {
      a.currentTime = this.pendingSeek;
      this.pendingSeek = null;
    }
    // Jeda antarpersinggahan: narasi diam selama terbang dan sesaat setelah tiba (hanya musik), baru mulai bicara.
    // Tanpa ini narasi planet berikutnya langsung menyambung saat kamera masih di planet sebelumnya.
    const flying = this.phase === "travel" || (this.phase === "dwell" && this.dwellT < ARRIVE_QUIET);
    if (flying && this.index > 0) {
      if (!a.paused) a.pause();
      this.playRequested = false;
      return false;
    }
    if (a.paused && !a.ended && !this.playRequested && this.linger < 0) {
      this.playRequested = true;
      a.play().catch((e: DOMException) => {
        // Diblokir browser (belum ada ketukan): coba lagi nanti, jangan tandai gagal selamanya.
        if (e?.name === "NotAllowedError" || e?.name === "AbortError") this.playRequested = false;
        else this.dropPart();
      });
    }
    if (a.readyState < 1 || !Number.isFinite(a.duration)) {
      this.voiceWait += dt;
      if (this.voiceWait > 6) this.dropPart();
      return false;
    }
    const st = useAngkasa.getState();
    if (a.ended) {
      // narasi bagian ini habis: lanjut ke persinggahan berikutnya (bagian lain atau waktu baca teks)
      if (this.index < TOUR.length - 1) {
        this.followAudio = true;
        this.playRequested = false;
        st.set({ tourIndex: this.index + 1, tourLine: 0 });
        return true;
      }
      this.phase = "idle";
      st.set({
        tourPlaying: false,
        tourLine: TOUR[this.index].lines.length - 1,
      });
      return false;
    }
    const t = a.currentTime;
    const at = part.first + stopAt(part.cues, t);
    if (at > this.index) {
      // narasi persinggahan ini selesai: diam sejenak (anak sempat melihat), lalu terbang ke berikutnya
      if (this.linger < 0) {
        this.linger = 0;
        a.pause();
      }
      this.linger += dt;
      if (this.linger < LEAVE_QUIET) return false;
      this.linger = -1;
      this.followAudio = true;
      this.pendingSeek = part.cues[at - part.first];
      st.set({ tourIndex: at, tourLine: 0 });
      return true;
    }
    const line = lineAtTime(part, TOUR[this.index].lines, k, t, a.duration);
    if (line !== this.lastLine) {
      this.lastLine = line;
      st.set({ tourLine: line });
    }
    return false;
  }

  dispose() {
    if (this.audio) {
      this.audio.pause();
      this.audio.onerror = null;
      this.audio = null;
    }
    const el = this.ctx.renderer.domElement;
    el.removeEventListener("pointerdown", this.onUserInput);
    el.removeEventListener("wheel", this.onUserInput);
    this.settleCamera();
    this.ctx.controls.enabled = true;
    if (this.saved) {
      this.ctx.controls.minDistance = this.saved.min;
      this.ctx.controls.maxDistance = this.saved.max;
    }
  }
}
