// Kontrak data modul Jelajah Angkasa 3D (lihat module_specs/jelajah-angkasa-3d/02-instruksi-implementasi.md §9).

export type ReviewStatus = "draft" | "sumber-dicek";

/** Satu nilai fisik bersumber. `value: null` = tidak diketahui/tidak berlaku (bukan 0). */
export interface Quantity {
  value: number | null;
  unit: string;
  /** apa yang diukur, mis. "radius rata-rata", "periode rotasi sidereal" */
  quantityDefinition: string;
  sourceId: string;
  /** tanggal data di sumber (bila dicantumkan sumber) */
  sourceUpdatedAt?: string;
  reviewedAt: string;
  approx?: string;
  reviewStatus: ReviewStatus;
}

export type Classification =
  | "Bintang"
  | "Planet berbatu"
  | "Raksasa gas"
  | "Raksasa es"
  | "Satelit alami"
  | "Planet katai"
  | "Ilustrasi benda kecil"
  | "Galaksi (model ilustratif)";

export type Capability =
  | "inspect"
  | "rings"
  | "moons"
  | "interior"
  | "explode"
  | "compare"
  | "simulation";

/** Model orbit pedagogis: lingkaran berperiode nyata, fase awal ilustratif (bukan ephemeris). */
export interface OrbitModel {
  modelType: "circular-pedagogical";
  /** epoch simulasi: t = 0 hari */
  epoch: "sim-day-0";
  frame: "ekliptika (ilustratif)";
  validity: string;
  parameters: {
    semiMajorAxisAU?: number;
    parentDistanceKm?: number;
    periodDays: number;
    phaseDeg: number;
    inclinationDeg: number;
  };
}

export interface SpinModel {
  poleConvention: "IAU (kutub utara mengikuti aturan tangan kanan, retrograde = periode negatif)";
  /** kemiringan sumbu terhadap bidang orbit (derajat) */
  tilt: number;
  direction: "prograde" | "retrograde" | "sinkron";
  periodDefinition: string;
  /** jam; negatif = retrograde */
  periodHours: number;
}

export interface TextureSet {
  /** peta warna 1K untuk tata surya (paket pembuka) */
  lo?: string;
  /** peta warna 2K untuk inspeksi (dimuat saat didekati) */
  hi?: string;
  clouds?: string;
  night?: string;
  /** peta alternatif (Venus: permukaan radar) */
  alt?: string;
  ring?: string;
  /** keterangan jenis citra, wajib tampil */
  representation: string;
  /** warna dasar untuk globe prosedural / fallback */
  base: string;
  /** procedural generator id bila tanpa tekstur */
  procedural?: "titan" | "pluto" | "asteroid" | "comet";
  credit: string;
}

export interface KeyFact {
  label: string;
  qty: Quantity;
  /** tampilkan angka dengan format khusus */
  format?: "int" | "1" | "2" | "hours-days" | "compact";
}

export interface AngkasaObject {
  id: string;
  parentId: string | null;
  nameId: string;
  aliases: string[];
  classification: Classification;
  subtitle: string;
  definitionSimple: string;
  explanationDetailed: string;
  /** catatan eksplorasi, mis. tidak ada permukaan padat */
  surfaceNote?: string;
  hasSolidSurface: boolean | null;
  keyFacts: KeyFact[];
  radius: Quantity; // radius rata-rata (km)
  equatorialRadius?: Quantity;
  orbitModel?: OrbitModel;
  spinModel?: SpinModel;
  texture: TextureSet;
  childObjectIds: string[];
  partIds: string[];
  capabilities: Capability[];
  /** oblateness (1 - polar/equatorial) untuk bentuk pepat */
  flattening?: number;
  confidenceNote?: string;
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

export interface AngkasaPart {
  id: string;
  objectId: string;
  nameId: string;
  definitionSimple: string;
  explanationDetailed: string;
  /** radius luar & dalam (fraksi radius objek) untuk shell interior */
  outerFrac?: number;
  innerFrac?: number;
  /** warna kode pendidikan */
  color?: string;
  representation:
    | "lapisan visual"
    | "kode warna pendidikan"
    | "model interpretasi"
    | "ilustrasi";
  facts?: KeyFact[];
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
  checkedAt: string;
}

export interface LessonDef {
  id:
    | "rotation-revolution"
    | "day-night"
    | "moon-phases"
    | "eclipses"
    | "seasons";
  title: string;
  concept: string;
  misconception: string;
  sourceIds: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  /** jawaban berupa objek (pilih dari daftar/scene) atau pilihan teks */
  kind: "object" | "choice";
  options?: string[];
  answer: string;
  explanation: string;
  lesson?: LessonDef["id"];
}

export interface AngkasaManifest {
  version: string;
  reviewedAt: string;
  objects: AngkasaObject[];
  parts: AngkasaPart[];
  sources: Source[];
  lessons: LessonDef[];
  quiz: QuizQuestion[];
}
