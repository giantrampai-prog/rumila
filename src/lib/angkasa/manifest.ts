// Manifest berversi Jelajah Angkasa 3D: katalog objek, bagian, sumber, pelajaran, dan latihan.
// Setiap angka punya satuan, definisi besaran, sumber, tanggal tinjau, dan status.
// "sumber-dicek" = angka dicocokkan langsung ke halaman sumber pada REVIEWED;
// "draft" = diisi dari NASA Planetary Fact Sheet (versi yang dikenal) dan belum dicocokkan ulang.

import type {
  AngkasaManifest,
  AngkasaObject,
  AngkasaPart,
  Quantity,
  ReviewStatus,
} from "./types";

export const REVIEWED = "2026-09-26";

const q = (
  value: number | null,
  unit: string,
  quantityDefinition: string,
  sourceId: string,
  reviewStatus: ReviewStatus = "draft",
  extra: Partial<Quantity> = {},
): Quantity => ({
  value,
  unit,
  quantityDefinition,
  sourceId,
  reviewedAt: REVIEWED,
  reviewStatus,
  ...extra,
});

const SSS = "Tekstur: Solar System Scope (CC BY 4.0), berbasis data NASA";
const tex = (name: string) => ({
  lo: `/angkasa/lo/lo_${name}.jpg`,
  hi: `/angkasa/tex/2k_${name}.jpg`,
});

const pedOrbit = (
  semiMajorAxisAU: number,
  periodDays: number,
  phaseDeg: number,
  inclinationDeg = 0,
) => ({
  modelType: "circular-pedagogical" as const,
  epoch: "sim-day-0" as const,
  frame: "ekliptika (ilustratif)" as const,
  validity:
    "Model belajar: orbit lingkaran dengan periode nyata; posisi awal ilustratif, bukan posisi langit hari ini.",
  parameters: { semiMajorAxisAU, periodDays, phaseDeg, inclinationDeg },
});

const spin = (
  tilt: number,
  periodHours: number,
  periodDefinition = "periode rotasi sidereal",
) => ({
  poleConvention:
    "IAU (kutub utara mengikuti aturan tangan kanan, retrograde = periode negatif)" as const,
  tilt,
  direction: (periodHours < 0 ? "retrograde" : "prograde") as
    "retrograde" | "prograde",
  periodDefinition,
  periodHours,
});

const objects: AngkasaObject[] = [
  {
    id: "sun",
    parentId: null,
    nameId: "Matahari",
    aliases: ["sun", "surya", "bintang"],
    classification: "Bintang",
    subtitle: "Bintang di pusat tata surya",
    definitionSimple:
      "Bintang di pusat tata surya yang memancarkan cahaya dan energi.",
    explanationDetailed:
      "Matahari adalah bola gas panas yang sangat besar. Energinya berasal dari reaksi fusi di intinya. Semua planet dalam tata surya bergerak mengelilingi Matahari karena tarikan gravitasinya. Matahari hanyalah satu dari miliaran bintang di galaksi Bima Sakti.",
    hasSolidSurface: false,
    surfaceNote:
      "Matahari tidak punya permukaan padat. Yang tampak adalah lapisan fotosfer yang bersinar.",
    radius: q(695700, "km", "radius nominal Matahari (IAU)", "nasa-sun"),
    keyFacts: [
      {
        label: "Radius",
        qty: q(695700, "km", "radius nominal Matahari (IAU)", "nasa-sun"),
        format: "int",
      },
      {
        label: "Rotasi di ekuator",
        qty: q(
          25.4,
          "hari Bumi",
          "periode rotasi sidereal di ekuator; kutub berputar lebih lambat",
          "nasa-sun",
          "draft",
          {
            approx: "sekitar",
          },
        ),
        format: "1",
      },
    ],
    spinModel: spin(7.25, 609.12, "periode rotasi sidereal di ekuator"),
    texture: {
      ...tex("sun"),
      representation: "Peta ilustratif permukaan (fotosfer), bukan foto sesaat",
      base: "#ffb347",
      credit: SSS,
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare"],
    sourceIds: ["nasa-sun"],
    reviewStatus: "draft",
  },
  {
    id: "mercury",
    parentId: "sun",
    nameId: "Merkurius",
    aliases: ["mercury"],
    classification: "Planet berbatu",
    subtitle: "Planet pertama dari Matahari",
    definitionSimple:
      "Planet berbatu yang orbitnya paling dekat dengan Matahari.",
    explanationDetailed:
      "Merkurius adalah planet terkecil di antara delapan planet. Permukaannya penuh kawah, mirip Bulan. Atmosfernya sangat tipis sehingga panas siang cepat hilang saat malam; perbedaan suhu siang dan malam di permukaannya sangat besar.",
    hasSolidSurface: true,
    radius: q(2439.7, "km", "radius rata-rata", "nasa-mercury"),
    keyFacts: [
      {
        label: "Radius",
        qty: q(2439.7, "km", "radius rata-rata", "nasa-mercury"),
        format: "1",
      },
      {
        label: "Jarak rata-rata",
        qty: q(0.387, "AU", "setengah sumbu panjang orbit", "nasa-mercury"),
        format: "2",
      },
      {
        label: "Satu tahun",
        qty: q(
          88,
          "hari Bumi",
          "periode orbit sidereal",
          "nasa-mercury",
          "draft",
          { approx: "dibulatkan" },
        ),
        format: "int",
      },
      {
        label: "Satelit",
        qty: q(
          0,
          "buah",
          "jumlah satelit alami yang diketahui",
          "nasa-mercury",
          "draft",
          {
            sourceUpdatedAt: REVIEWED,
            approx:
              "tanggal = tanggal tinjau; halaman sumber tidak mencantumkan tanggal data",
          },
        ),
        format: "int",
      },
    ],
    orbitModel: pedOrbit(0.387, 87.97, 20, 7.0),
    spinModel: spin(0.034, 1407.6),
    texture: {
      ...tex("mercury"),
      representation: "Peta warna permukaan (dirangkai dari data misi)",
      base: "#9a948d",
      credit: SSS,
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare"],
    sourceIds: ["nasa-mercury"],
    reviewStatus: "draft",
  },
  {
    id: "venus",
    parentId: "sun",
    nameId: "Venus",
    aliases: ["venus", "bintang kejora"],
    classification: "Planet berbatu",
    subtitle: "Planet kedua dari Matahari",
    definitionSimple: "Planet berbatu dengan atmosfer sangat tebal.",
    explanationDetailed:
      "Atmosfer Venus yang tebal menahan panas sehingga permukaannya menjadi yang terpanas di antara planet-planet, bahkan lebih panas dari Merkurius. Venus berputar sangat lambat dan arahnya berlawanan dengan kebanyakan planet (retrograde). Permukaannya tertutup awan, sehingga peta permukaan dibuat dengan radar.",
    hasSolidSurface: true,
    surfaceNote:
      "Tampilan awan dan peta permukaan radar adalah dua jenis citra yang berbeda.",
    radius: q(6051.8, "km", "radius rata-rata", "nasa-venus"),
    keyFacts: [
      {
        label: "Radius",
        qty: q(6051.8, "km", "radius rata-rata", "nasa-venus"),
        format: "1",
      },
      {
        label: "Suhu permukaan",
        qty: q(
          464,
          "°C",
          "suhu rata-rata di permukaan",
          "nasa-venus",
          "draft",
          { approx: "sekitar" },
        ),
        format: "int",
      },
      {
        label: "Satu hari (rotasi)",
        qty: q(
          -5832.5,
          "jam",
          "periode rotasi sidereal, negatif = retrograde",
          "nasa-venus",
        ),
        format: "hours-days",
      },
      {
        label: "Satelit",
        qty: q(
          0,
          "buah",
          "jumlah satelit alami yang diketahui",
          "nasa-venus",
          "draft",
          {
            sourceUpdatedAt: REVIEWED,
            approx:
              "tanggal = tanggal tinjau; halaman sumber tidak mencantumkan tanggal data",
          },
        ),
        format: "int",
      },
    ],
    orbitModel: pedOrbit(0.723, 224.7, 115, 3.39),
    spinModel: spin(177.4, -5832.5),
    texture: {
      lo: "/angkasa/lo/lo_venus_atmosphere.jpg",
      hi: "/angkasa/tex/2k_venus_atmosphere.jpg",
      alt: "/angkasa/tex/2k_venus_surface.jpg",
      representation:
        "Awan (tampilan atmosfer); alternatif: peta permukaan hasil radar (bukan warna alami)",
      base: "#e8cf9a",
      credit: SSS,
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare"],
    sourceIds: ["nasa-venus"],
    reviewStatus: "draft",
  },
  {
    id: "earth",
    parentId: "sun",
    nameId: "Bumi",
    aliases: ["earth", "bumi kita"],
    classification: "Planet berbatu",
    subtitle: "Planet ketiga dari Matahari",
    definitionSimple:
      "Planet tempat kita tinggal, dengan daratan dan lautan di permukaannya.",
    explanationDetailed:
      "Bumi adalah satu-satunya planet yang diketahui memiliki kehidupan. Sekitar tujuh puluh persen permukaannya tertutup air. Atmosfernya sebagian besar nitrogen dan oksigen. Bumi berputar pada sumbunya sekali sehari dan mengelilingi Matahari sekali setahun.",
    hasSolidSurface: true,
    radius: q(6371, "km", "radius rata-rata", "nasa-earth"),
    equatorialRadius: q(
      6378.1,
      "km",
      "radius ekuator",
      "nasa-earth",
      "sumber-dicek",
    ),
    keyFacts: [
      {
        label: "Diameter ekuator",
        qty: q(
          12756,
          "km",
          "diameter di ekuator",
          "nasa-earth",
          "sumber-dicek",
        ),
        format: "int",
      },
      {
        label: "Satu hari (rotasi)",
        qty: q(
          23.9,
          "jam",
          "periode rotasi sidereal",
          "nasa-earth",
          "sumber-dicek",
        ),
        format: "1",
      },
      {
        label: "Satu tahun",
        qty: q(365.25, "hari", "periode orbit", "nasa-earth", "sumber-dicek"),
        format: "2",
      },
      {
        label: "Kemiringan sumbu",
        qty: q(
          23.4,
          "°",
          "kemiringan sumbu terhadap bidang orbit",
          "nasa-earth",
          "sumber-dicek",
        ),
        format: "1",
      },
    ],
    orbitModel: pedOrbit(1.0, 365.256, 200, 0),
    spinModel: spin(23.44, 23.934),
    texture: {
      ...tex("earth_daymap"),
      clouds: "/angkasa/tex/2k_earth_clouds.jpg",
      night: "/angkasa/tex/2k_earth_nightmap.jpg",
      representation:
        "Peta warna permukaan (mozaik citra satelit); awan dan lampu malam adalah lapisan ilustratif, bukan cuaca saat ini",
      base: "#2f6fb0",
      credit: SSS,
    },
    childObjectIds: ["moon"],
    partIds: [
      "earth.surface",
      "earth.clouds",
      "earth.atmosphere",
      "earth.crust",
      "earth.mantle",
      "earth.outer_core",
      "earth.inner_core",
    ],
    capabilities: [
      "inspect",
      "moons",
      "interior",
      "explode",
      "compare",
      "simulation",
    ],
    sourceIds: ["nasa-earth", "usgs-inside", "usgs-mantle"],
    reviewStatus: "draft",
  },
  {
    id: "moon",
    parentId: "earth",
    nameId: "Bulan",
    aliases: ["moon", "rembulan"],
    classification: "Satelit alami",
    subtitle: "Satelit alami Bumi",
    definitionSimple:
      "Satelit alami Bumi yang tampak bercahaya karena memantulkan cahaya Matahari.",
    explanationDetailed:
      "Bulan tidak menghasilkan cahaya sendiri. Separuh Bulan selalu tersinari Matahari; bagian terang yang kita lihat dari Bumi berubah sepanjang orbit Bulan sehingga muncul fase. Bulan berotasi sekali untuk setiap satu kali mengelilingi Bumi, sehingga sisi yang sama selalu menghadap Bumi.",
    hasSolidSurface: true,
    radius: q(1737.4, "km", "radius rata-rata", "nasa-moon"),
    keyFacts: [
      {
        label: "Radius",
        qty: q(1737.4, "km", "radius rata-rata", "nasa-moon"),
        format: "1",
      },
      {
        label: "Jarak rata-rata ke Bumi",
        qty: q(384400, "km", "setengah sumbu panjang orbit", "nasa-moon"),
        format: "int",
      },
      {
        label: "Satu putaran orbit",
        qty: q(27.3, "hari", "periode orbit sidereal", "nasa-moon"),
        format: "1",
      },
    ],
    orbitModel: {
      modelType: "circular-pedagogical",
      epoch: "sim-day-0",
      frame: "ekliptika (ilustratif)",
      validity:
        "Model belajar: orbit lingkaran mengelilingi pusat Bumi (barisentrum Bumi–Bulan diabaikan).",
      parameters: {
        parentDistanceKm: 384400,
        periodDays: 27.32,
        phaseDeg: 60,
        inclinationDeg: 5.14,
      },
    },
    spinModel: {
      ...spin(6.68, 655.7, "rotasi sinkron: satu rotasi = satu orbit"),
      direction: "sinkron",
    },
    texture: {
      ...tex("moon"),
      representation: "Peta warna permukaan (dirangkai dari data misi)",
      base: "#b8b4ad",
      credit: SSS,
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare", "simulation"],
    sourceIds: ["nasa-moon", "nasa-moon-phases", "nasa-eclipses"],
    reviewStatus: "draft",
  },
  {
    id: "mars",
    parentId: "sun",
    nameId: "Mars",
    aliases: ["mars", "planet merah"],
    classification: "Planet berbatu",
    subtitle: "Planet keempat dari Matahari",
    definitionSimple: "Planet berbatu yang dikenal sebagai planet merah.",
    explanationDetailed:
      "Warna kemerahan Mars berasal dari debu yang mengandung oksida besi. Mars punya gunung berapi terbesar yang diketahui di tata surya, Olympus Mons, dan lembah raksasa Valles Marineris. Atmosfernya tipis dan dingin.",
    hasSolidSurface: true,
    radius: q(3389.5, "km", "radius rata-rata", "nasa-mars"),
    keyFacts: [
      {
        label: "Radius",
        qty: q(3389.5, "km", "radius rata-rata", "nasa-mars"),
        format: "1",
      },
      {
        label: "Satu hari (rotasi)",
        qty: q(24.6, "jam", "periode rotasi sidereal", "nasa-mars"),
        format: "1",
      },
      {
        label: "Suhu permukaan rata-rata",
        qty: q(
          -65,
          "°C",
          "rata-rata perkiraan di permukaan",
          "nasa-mars",
          "draft",
          { approx: "sekitar" },
        ),
        format: "int",
      },
      {
        label: "Satelit",
        qty: q(2, "buah", "Phobos dan Deimos", "nasa-moons", "sumber-dicek", {
          sourceUpdatedAt: "2026-09-14",
        }),
        format: "int",
      },
    ],
    orbitModel: pedOrbit(1.524, 686.98, 300, 1.85),
    spinModel: spin(25.19, 24.623),
    texture: {
      ...tex("mars"),
      representation: "Peta warna permukaan (dirangkai dari data misi)",
      base: "#b8552f",
      credit: SSS,
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare"],
    sourceIds: ["nasa-mars", "nasa-moons"],
    reviewStatus: "draft",
  },
  {
    id: "jupiter",
    parentId: "sun",
    nameId: "Jupiter",
    aliases: ["jupiter", "yupiter"],
    classification: "Raksasa gas",
    subtitle: "Planet kelima dari Matahari",
    definitionSimple: "Planet terbesar di tata surya, dengan atmosfer berpita.",
    explanationDetailed:
      "Jupiter sebagian besar tersusun dari hidrogen dan helium, mirip Matahari. Pita-pita awannya bergerak karena angin yang sangat kencang. Bintik Merah Raksasa adalah badai besar yang sudah teramati selama ratusan tahun. Jupiter punya cincin tipis dari partikel gelap.",
    hasSolidSurface: false,
    surfaceNote:
      "Jupiter tidak punya permukaan padat untuk didarati. Yang terlihat adalah lapisan atas awan.",
    radius: q(69911, "km", "radius rata-rata", "nasa-jupiter", "sumber-dicek"),
    equatorialRadius: q(71492, "km", "radius ekuator", "nasa-jupiter"),
    flattening: 0.0649,
    keyFacts: [
      {
        label: "Radius",
        qty: q(69911, "km", "radius rata-rata", "nasa-jupiter", "sumber-dicek"),
        format: "int",
      },
      {
        label: "Satu hari (rotasi)",
        qty: q(
          9.9,
          "jam",
          "periode rotasi (sistem internal)",
          "nasa-jupiter",
          "sumber-dicek",
        ),
        format: "1",
      },
      {
        label: "Satu tahun",
        qty: q(
          4333,
          "hari Bumi",
          "periode orbit",
          "nasa-jupiter",
          "sumber-dicek",
        ),
        format: "int",
      },
      {
        label: "Satelit",
        qty: q(
          115,
          "buah",
          "satelit yang diakui resmi IAU",
          "nasa-jupiter",
          "sumber-dicek",
          { sourceUpdatedAt: "2026-09-21" },
        ),
        format: "int",
      },
    ],
    orbitModel: pedOrbit(5.203, 4332.59, 60, 1.3),
    spinModel: spin(3.13, 9.925, "periode rotasi (sistem III, internal)"),
    texture: {
      ...tex("jupiter"),
      representation:
        "Peta awan (dirangkai dari citra misi, warna mendekati alami)",
      base: "#c9a97e",
      credit: SSS,
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare"],
    confidenceNote:
      "Inti Jupiter menurut data Juno kemungkinan 'encer' (dilute), bukan bola padat bertepi tajam.",
    sourceIds: ["nasa-jupiter"],
    reviewStatus: "draft",
  },
  {
    id: "saturn",
    parentId: "sun",
    nameId: "Saturnus",
    aliases: ["saturn", "saturnus"],
    classification: "Raksasa gas",
    subtitle: "Planet keenam dari Matahari",
    definitionSimple:
      "Planet raksasa yang dikenal karena sistem cincinnya yang mencolok.",
    explanationDetailed:
      "Saturnus sebagian besar terdiri dari hidrogen dan helium. Cincinnya tersusun dari milyaran bongkah es dan batuan berbagai ukuran, dari butiran debu sampai sebesar rumah, bukan satu piringan padat. Saturnus berputar cepat sehingga bentuknya tampak pepat.",
    hasSolidSurface: false,
    surfaceNote:
      "Tidak ada permukaan padat untuk pendaratan. Tersedia eksplorasi atmosfer, cincin, dan diagram struktur.",
    radius: q(58232, "km", "radius rata-rata", "nasa-saturn"),
    equatorialRadius: q(
      60250,
      "km",
      "radius ekuator (dari diameter ekuator 120.500 km)",
      "nasa-saturn",
      "sumber-dicek",
    ),
    flattening: 0.098,
    keyFacts: [
      {
        label: "Diameter ekuator",
        qty: q(
          120500,
          "km",
          "diameter di ekuator",
          "nasa-saturn",
          "sumber-dicek",
        ),
        format: "int",
      },
      {
        label: "Satu hari (rotasi)",
        qty: q(10.7, "jam", "periode rotasi", "nasa-saturn", "sumber-dicek"),
        format: "1",
      },
      {
        label: "Satu tahun",
        qty: q(
          10756,
          "hari Bumi",
          "periode orbit",
          "nasa-saturn",
          "sumber-dicek",
        ),
        format: "int",
      },
      {
        label: "Satelit terkonfirmasi",
        qty: q(
          274,
          "buah",
          "satelit terkonfirmasi",
          "nasa-saturn",
          "sumber-dicek",
          {
            sourceUpdatedAt: "2025-03",
            approx:
              "per Maret 2025 (NASA); daftar JPL mencantumkan angka berbeda — angka terus bertambah",
          },
        ),
        format: "int",
      },
    ],
    orbitModel: pedOrbit(9.537, 10756, 140, 2.49),
    spinModel: spin(26.73, 10.656),
    texture: {
      ...tex("saturn"),
      ring: "/angkasa/tex/2k_saturn_ring_alpha.png",
      representation:
        "Peta awan (warna mendekati alami, dirangkai dari citra misi); cincin dari profil kecerahan radial",
      base: "#d8c08a",
      credit: SSS,
    },
    childObjectIds: ["titan"],
    partIds: [
      "saturn.rings",
      "saturn.ring_particles",
      "saturn.interior",
      "saturn.molecular_h",
      "saturn.metallic_h",
      "saturn.core",
    ],
    capabilities: ["inspect", "rings", "moons", "interior", "compare"],
    confidenceNote:
      "Struktur dalam Saturnus adalah model interpretasi ilmuwan; batas lapisan tidak tajam dan tidak diamati langsung.",
    sourceIds: ["nasa-saturn"],
    reviewStatus: "draft",
  },
  {
    id: "titan",
    parentId: "saturn",
    nameId: "Titan",
    aliases: ["titan"],
    classification: "Satelit alami",
    subtitle: "Satelit terbesar Saturnus",
    definitionSimple:
      "Satelit Saturnus dengan atmosfer tebal yang menyelubunginya.",
    explanationDetailed:
      "Titan adalah satelit terbesar Saturnus dan satu-satunya satelit yang diketahui punya atmosfer tebal. Kabut jingga menutupi permukaannya. Di permukaan Titan ada danau dan sungai berisi metana dan etana cair.",
    hasSolidSurface: true,
    radius: q(2574.7, "km", "radius rata-rata", "nasa-titan"),
    keyFacts: [
      {
        label: "Radius",
        qty: q(2574.7, "km", "radius rata-rata", "nasa-titan"),
        format: "1",
      },
      {
        label: "Jarak ke Saturnus",
        qty: q(1221870, "km", "setengah sumbu panjang orbit", "nasa-titan"),
        format: "int",
      },
      {
        label: "Satu putaran orbit",
        qty: q(15.9, "hari", "periode orbit", "nasa-titan"),
        format: "1",
      },
    ],
    orbitModel: {
      modelType: "circular-pedagogical",
      epoch: "sim-day-0",
      frame: "ekliptika (ilustratif)",
      validity: "Model belajar: orbit lingkaran di bidang ekuator Saturnus.",
      parameters: {
        parentDistanceKm: 1221870,
        periodDays: 15.945,
        phaseDeg: 30,
        inclinationDeg: 0.35,
      },
    },
    spinModel: {
      ...spin(0.3, 382.68, "rotasi sinkron: satu rotasi = satu orbit"),
      direction: "sinkron",
    },
    texture: {
      representation: "Ilustrasi kabut atmosfer (globe prosedural)",
      base: "#d99a4a",
      procedural: "titan",
      credit: "Ilustrasi prosedural Rinoya Academy",
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare"],
    sourceIds: ["nasa-titan"],
    reviewStatus: "draft",
  },
  {
    id: "uranus",
    parentId: "sun",
    nameId: "Uranus",
    aliases: ["uranus"],
    classification: "Raksasa es",
    subtitle: "Planet ketujuh dari Matahari",
    definitionSimple:
      "Planet raksasa es dengan sumbu rotasi yang sangat miring.",
    explanationDetailed:
      "Uranus berputar hampir 'rebah' karena sumbunya miring hampir 98 derajat. Sebagian besar massanya adalah fluida panas dan padat dari bahan 'es' seperti air, metana, dan amonia. Metana di atmosfer membuatnya tampak biru kehijauan.",
    hasSolidSurface: false,
    surfaceNote:
      "Uranus tidak punya permukaan padat. Yang terlihat adalah atmosfer bagian atas.",
    radius: q(25362, "km", "radius rata-rata", "nasa-uranus"),
    equatorialRadius: q(
      25559,
      "km",
      "radius ekuator (dari diameter 51.118 km)",
      "nasa-uranus",
      "sumber-dicek",
    ),
    flattening: 0.0229,
    keyFacts: [
      {
        label: "Diameter ekuator",
        qty: q(
          51118,
          "km",
          "diameter di ekuator",
          "nasa-uranus",
          "sumber-dicek",
        ),
        format: "int",
      },
      {
        label: "Kemiringan sumbu",
        qty: q(
          97.77,
          "°",
          "kemiringan ekuator terhadap orbit",
          "nasa-uranus",
          "sumber-dicek",
        ),
        format: "2",
      },
      {
        label: "Satu tahun",
        qty: q(
          30687,
          "hari Bumi",
          "periode orbit",
          "nasa-uranus",
          "sumber-dicek",
        ),
        format: "int",
      },
      {
        label: "Satelit",
        qty: q(
          28,
          "buah",
          "satelit yang diketahui",
          "nasa-uranus",
          "sumber-dicek",
          {
            sourceUpdatedAt: "2025-04",
            approx: "angka dapat berubah karena penemuan baru",
          },
        ),
        format: "int",
      },
    ],
    orbitModel: pedOrbit(19.19, 30687, 250, 0.77),
    spinModel: spin(97.77, -17.24),
    texture: {
      ...tex("uranus"),
      representation:
        "Warna rata ilustratif berbasis citra (fitur awan sangat samar)",
      base: "#9fd3d8",
      credit: SSS,
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare"],
    sourceIds: ["nasa-uranus"],
    reviewStatus: "draft",
  },
  {
    id: "neptune",
    parentId: "sun",
    nameId: "Neptunus",
    aliases: ["neptune", "neptunus"],
    classification: "Raksasa es",
    subtitle: "Planet kedelapan dari Matahari",
    definitionSimple:
      "Planet raksasa es yang paling jauh dari Matahari di antara delapan planet.",
    explanationDetailed:
      "Neptunus punya angin tercepat yang diketahui di tata surya. Seperti Uranus, warnanya berasal dari metana di atmosfer. Satu tahun di Neptunus hampir 165 tahun Bumi.",
    hasSolidSurface: false,
    surfaceNote:
      "Neptunus tidak punya permukaan padat. Yang terlihat adalah atmosfer bagian atas.",
    radius: q(24622, "km", "radius rata-rata", "nasa-neptune"),
    keyFacts: [
      {
        label: "Radius",
        qty: q(24622, "km", "radius rata-rata", "nasa-neptune"),
        format: "int",
      },
      {
        label: "Jarak rata-rata",
        qty: q(30.07, "AU", "setengah sumbu panjang orbit", "nasa-neptune"),
        format: "2",
      },
      {
        label: "Satu hari (rotasi)",
        qty: q(16.1, "jam", "periode rotasi", "nasa-neptune"),
        format: "1",
      },
      {
        label: "Satelit",
        qty: q(
          16,
          "buah",
          "satelit yang diketahui",
          "nasa-moons",
          "sumber-dicek",
          { sourceUpdatedAt: "2026-09-14" },
        ),
        format: "int",
      },
    ],
    orbitModel: pedOrbit(30.07, 60190, 330, 1.77),
    spinModel: spin(28.32, 16.11),
    texture: {
      ...tex("neptune"),
      representation: "Warna ilustratif berbasis citra Voyager 2 (disesuaikan)",
      base: "#3f6fd1",
      credit: SSS,
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare"],
    sourceIds: ["nasa-neptune", "nasa-moons"],
    reviewStatus: "draft",
  },
  {
    id: "pluto",
    parentId: "sun",
    nameId: "Pluto",
    aliases: ["pluto"],
    classification: "Planet katai",
    subtitle: "Planet katai di Sabuk Kuiper",
    definitionSimple: "Planet katai di kawasan luar tata surya.",
    explanationDetailed:
      "Sejak 2006, Pluto digolongkan sebagai planet katai, bukan salah satu dari delapan planet. Pluto berada di Sabuk Kuiper, wilayah dingin di luar orbit Neptunus. Wahana New Horizons memotret dataran es berbentuk hati di permukaannya.",
    hasSolidSurface: true,
    radius: q(1188.3, "km", "radius rata-rata", "nasa-pluto"),
    keyFacts: [
      {
        label: "Radius",
        qty: q(1188.3, "km", "radius rata-rata", "nasa-pluto"),
        format: "1",
      },
      {
        label: "Jarak rata-rata",
        qty: q(39.5, "AU", "setengah sumbu panjang orbit", "nasa-pluto"),
        format: "1",
      },
      {
        label: "Satelit",
        qty: q(
          5,
          "buah",
          "satelit yang diketahui",
          "nasa-moons",
          "sumber-dicek",
          { sourceUpdatedAt: "2026-09-14" },
        ),
        format: "int",
      },
    ],
    orbitModel: pedOrbit(39.48, 90560, 20, 17.16),
    spinModel: spin(122.53, -153.29),
    texture: {
      representation:
        "Ilustrasi prosedural (warna mengikuti citra New Horizons secara umum)",
      base: "#c9b29a",
      procedural: "pluto",
      credit: "Ilustrasi prosedural Rinoya Academy",
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect", "compare"],
    sourceIds: ["nasa-pluto", "nasa-planets"],
    reviewStatus: "draft",
  },
  {
    id: "asteroid-example",
    parentId: "sun",
    nameId: "Contoh asteroid",
    aliases: ["asteroid", "sabuk asteroid"],
    classification: "Ilustrasi benda kecil",
    subtitle: "Model contoh, bukan asteroid tertentu",
    definitionSimple: "Model contoh benda berbatu yang mengorbit Matahari.",
    explanationDetailed:
      "Asteroid adalah sisa bahan pembentukan tata surya. Kebanyakan berada di sabuk asteroid antara Mars dan Jupiter. Bentuknya sering tidak bulat karena gravitasinya terlalu lemah untuk membentuk bola. Model ini hanya contoh bentuk, tanpa ukuran atau data benda nyata.",
    hasSolidSurface: true,
    radius: q(
      null,
      "km",
      "tidak berlaku — model contoh tanpa ukuran nyata",
      "nasa-asteroids",
    ),
    keyFacts: [],
    orbitModel: pedOrbit(2.7, 1600, 80, 5),
    spinModel: spin(30, 7),
    texture: {
      representation: "Ilustrasi prosedural bentuk tak beraturan",
      base: "#8a8177",
      procedural: "asteroid",
      credit: "Ilustrasi prosedural Rinoya Academy",
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect"],
    sourceIds: ["nasa-asteroids"],
    reviewStatus: "draft",
  },
  {
    id: "comet-example",
    parentId: "sun",
    nameId: "Contoh komet",
    aliases: ["komet", "comet", "bintang berekor"],
    classification: "Ilustrasi benda kecil",
    subtitle: "Model contoh, bukan komet tertentu",
    definitionSimple:
      "Model contoh benda kaya es dan debu yang dapat membentuk koma dan ekor saat mendekati Matahari.",
    explanationDetailed:
      "Inti komet berupa campuran es dan debu. Saat mendekati Matahari, es menguap membentuk koma (selubung) dan ekor. Ekor komet selalu mengarah menjauhi Matahari karena didorong angin Matahari dan tekanan cahaya — bukan sekadar tertinggal di belakang arah gerak.",
    hasSolidSurface: true,
    radius: q(
      null,
      "km",
      "tidak berlaku — model contoh tanpa ukuran nyata",
      "nasa-comets",
    ),
    keyFacts: [],
    orbitModel: pedOrbit(3.4, 2300, 170, 12),
    spinModel: spin(20, 12),
    texture: {
      representation: "Ilustrasi prosedural inti komet dan ekor",
      base: "#6f6a64",
      procedural: "comet",
      credit: "Ilustrasi prosedural Rinoya Academy",
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect"],
    sourceIds: ["nasa-comets"],
    reviewStatus: "draft",
  },
  {
    id: "milky-way",
    parentId: null,
    nameId: "Bima Sakti",
    aliases: ["milky way", "galaksi", "bima sakti"],
    classification: "Galaksi (model ilustratif)",
    subtitle: "Galaksi tempat tata surya berada",
    definitionSimple: "Galaksi tempat tata surya kita berada.",
    explanationDetailed:
      "Galaksi adalah kumpulan sangat besar bintang, gas, dan debu yang terikat gravitasi. Bima Sakti berbentuk spiral berbatang dengan miliaran bintang. Matahari hanyalah satu bintang di salah satu lengannya, jauh dari pusat galaksi. Kita belum pernah memotret Bima Sakti dari luar — model ini ilustrasi.",
    hasSolidSurface: null,
    radius: q(
      50000,
      "tahun cahaya",
      "perkiraan radius piringan (diameter ~100.000 tahun cahaya)",
      "nasa-galaxies",
      "draft",
      {
        approx: "perkiraan",
      },
    ),
    keyFacts: [
      {
        label: "Diameter piringan",
        qty: q(
          100000,
          "tahun cahaya",
          "perkiraan diameter piringan",
          "nasa-galaxies",
          "draft",
          { approx: "sekitar" },
        ),
        format: "int",
      },
      {
        label: "Jarak Matahari ke pusat",
        qty: q(
          26000,
          "tahun cahaya",
          "perkiraan jarak tata surya ke pusat galaksi",
          "nasa-galaxies",
          "draft",
          { approx: "sekitar" },
        ),
        format: "int",
      },
    ],
    texture: {
      representation: "Ilustrasi struktur galaksi (bukan katalog bintang)",
      base: "#c8d2ff",
      credit: "Ilustrasi prosedural Rinoya Academy",
    },
    childObjectIds: [],
    partIds: [],
    capabilities: ["inspect"],
    sourceIds: ["nasa-galaxies", "nasa-system-galaxy"],
    reviewStatus: "draft",
  },
];

// Bumi: radius batas (km) dari USGS/NASA → fraksi radius 6.371 km.
const R_E = 6371;
const parts: AngkasaPart[] = [
  {
    id: "earth.surface",
    objectId: "earth",
    nameId: "Permukaan",
    definitionSimple: "Daratan dan lautan yang kita lihat dari luar angkasa.",
    explanationDetailed:
      "Peta warna permukaan menunjukkan daratan, gurun, hutan, es, dan lautan. Ini lapisan visual; kerak adalah konsep geologi yang berbeda.",
    representation: "lapisan visual",
    sourceIds: ["nasa-earth"],
    reviewStatus: "draft",
  },
  {
    id: "earth.clouds",
    objectId: "earth",
    nameId: "Awan",
    definitionSimple: "Lapisan awan di atmosfer Bumi.",
    explanationDetailed:
      "Lapisan awan di model ini ilustratif dari satu citra gabungan, bukan data cuaca saat ini.",
    representation: "lapisan visual",
    sourceIds: ["nasa-earth"],
    reviewStatus: "draft",
  },
  {
    id: "earth.atmosphere",
    objectId: "earth",
    nameId: "Atmosfer",
    definitionSimple: "Selubung gas yang menyelimuti Bumi.",
    explanationDetailed:
      "Atmosfer Bumi terdiri dari sekitar 78% nitrogen, 21% oksigen, dan 1% gas lain. Tepinya makin tipis ke atas — batas cahaya biru di model hanyalah efek tampilan, bukan tepi yang tajam.",
    representation: "lapisan visual",
    facts: [
      {
        label: "Nitrogen",
        qty: q(
          78,
          "%",
          "fraksi volume udara kering",
          "nasa-earth",
          "sumber-dicek",
        ),
        format: "int",
      },
    ],
    sourceIds: ["nasa-earth"],
    reviewStatus: "draft",
  },
  {
    id: "earth.crust",
    objectId: "earth",
    nameId: "Kerak",
    definitionSimple: "Lapisan batuan paling luar dan paling tipis.",
    explanationDetailed:
      "Kerak benua rata-rata sekitar 30 km, kerak samudra sekitar 5 km. Di model, kerak diperbesar agar terlihat; aslinya jauh lebih tipis dibanding lapisan lain.",
    outerFrac: 1,
    innerFrac: (R_E - 30) / R_E,
    color: "#8b6b4a",
    representation: "kode warna pendidikan",
    facts: [
      {
        label: "Tebal rata-rata di daratan",
        qty: q(
          30,
          "km",
          "tebal kerak benua rata-rata",
          "nasa-earth",
          "sumber-dicek",
          { approx: "sekitar" },
        ),
        format: "int",
      },
    ],
    sourceIds: ["nasa-earth", "usgs-inside"],
    reviewStatus: "draft",
  },
  {
    id: "earth.mantle",
    objectId: "earth",
    nameId: "Mantel",
    definitionSimple: "Lapisan batuan panas di antara kerak dan inti Bumi.",
    explanationDetailed:
      "Batuan mantel sangat panas tetapi sebagian besar padat. Dalam rentang waktu geologis yang sangat lama, batuan itu dapat berubah bentuk dan mengalir perlahan. Seluruh mantel bukan lautan magma.",
    outerFrac: (R_E - 30) / R_E,
    innerFrac: 3480 / R_E,
    color: "#d9793a",
    representation: "kode warna pendidikan",
    facts: [
      {
        label: "Tebal",
        qty: q(2900, "km", "tebal mantel", "nasa-earth", "sumber-dicek", {
          approx: "sekitar",
        }),
        format: "int",
      },
    ],
    sourceIds: ["nasa-earth", "usgs-mantle"],
    reviewStatus: "draft",
  },
  {
    id: "earth.outer_core",
    objectId: "earth",
    nameId: "Inti luar",
    definitionSimple:
      "Lapisan cair dari besi dan nikel yang mengelilingi inti dalam.",
    explanationDetailed:
      "Inti luar berupa logam cair, terutama besi dan nikel. Gerakan logam cair ini berkaitan dengan terbentuknya medan magnet Bumi.",
    outerFrac: 3480 / R_E,
    innerFrac: 1221 / R_E,
    color: "#e8b53a",
    representation: "kode warna pendidikan",
    facts: [
      {
        label: "Tebal",
        qty: q(2300, "km", "tebal inti luar", "nasa-earth", "sumber-dicek", {
          approx: "sekitar",
        }),
        format: "int",
      },
    ],
    sourceIds: ["nasa-earth", "usgs-inside"],
    reviewStatus: "draft",
  },
  {
    id: "earth.inner_core",
    objectId: "earth",
    nameId: "Inti dalam",
    definitionSimple: "Pusat Bumi berupa bola logam padat yang sangat panas.",
    explanationDetailed:
      "Inti dalam terutama besi dan nikel. Walau suhunya sangat tinggi, tekanan yang amat besar membuatnya tetap padat.",
    outerFrac: 1221 / R_E,
    innerFrac: 0,
    color: "#f4e27a",
    representation: "kode warna pendidikan",
    facts: [
      {
        label: "Radius",
        qty: q(1221, "km", "radius inti dalam", "nasa-earth", "sumber-dicek", {
          approx: "sekitar",
        }),
        format: "int",
      },
    ],
    sourceIds: ["nasa-earth", "usgs-inside"],
    reviewStatus: "draft",
  },
  {
    id: "saturn.rings",
    objectId: "saturn",
    nameId: "Cincin Saturnus",
    definitionSimple:
      "Cincin yang tersusun dari banyak partikel es dan batuan.",
    explanationDetailed:
      "Cincin utama Saturnus sangat lebar tetapi sangat tipis — umumnya hanya puluhan meter tebalnya. Celah gelap Cassini memisahkan cincin A dan B. Cincin bukan piringan padat, melainkan milyaran bongkah yang masing-masing mengorbit Saturnus.",
    representation: "lapisan visual",
    facts: [
      {
        label: "Radius dalam cincin C",
        qty: q(
          74500,
          "km",
          "jarak tepi dalam cincin C dari pusat Saturnus",
          "nasa-saturn",
          "draft",
          { approx: "sekitar" },
        ),
        format: "int",
      },
      {
        label: "Radius luar cincin A",
        qty: q(
          136780,
          "km",
          "jarak tepi luar cincin A dari pusat Saturnus",
          "nasa-saturn",
          "draft",
          { approx: "sekitar" },
        ),
        format: "int",
      },
    ],
    sourceIds: ["nasa-saturn"],
    reviewStatus: "draft",
  },
  {
    id: "saturn.ring_particles",
    objectId: "saturn",
    nameId: "Partikel cincin",
    definitionSimple: "Bongkah es dan batuan yang menyusun cincin.",
    explanationDetailed:
      "Ukurannya beragam dari butiran debu sampai sebesar rumah. Susunan di gambar dekat ini ilustrasi yang diperbesar, bukan posisi partikel sebenarnya.",
    representation: "ilustrasi",
    sourceIds: ["nasa-saturn"],
    reviewStatus: "draft",
  },
  {
    id: "saturn.interior",
    objectId: "saturn",
    nameId: "Struktur dalam (model)",
    definitionSimple: "Model ilmuwan tentang lapisan di dalam Saturnus.",
    explanationDetailed:
      "Tidak ada yang pernah melihat langsung bagian dalam Saturnus. Model ini mengikuti gambaran NASA: inti padat dari logam dan batuan, diselimuti hidrogen logam cair, lalu lapisan hidrogen cair. Batas antarlapisan sebenarnya bertahap, bukan garis tajam, dan ukurannya masih diteliti.",
    representation: "model interpretasi",
    sourceIds: ["nasa-saturn"],
    reviewStatus: "draft",
  },
  {
    id: "saturn.molecular_h",
    objectId: "saturn",
    nameId: "Hidrogen cair",
    definitionSimple: "Lapisan luar yang tebal berisi hidrogen dan helium.",
    explanationDetailed:
      "Makin ke dalam, gas hidrogen berubah bertahap menjadi cair karena tekanan. Tidak ada permukaan tempat gas berhenti dan cairan dimulai.",
    outerFrac: 1,
    innerFrac: 0.55,
    color: "#e8d7a8",
    representation: "model interpretasi",
    sourceIds: ["nasa-saturn"],
    reviewStatus: "draft",
  },
  {
    id: "saturn.metallic_h",
    objectId: "saturn",
    nameId: "Hidrogen logam cair",
    definitionSimple:
      "Hidrogen yang tertekan sangat kuat hingga bersifat seperti logam.",
    explanationDetailed:
      "Pada tekanan ekstrem, hidrogen dapat menghantarkan listrik seperti logam. Lapisan ini diduga berkaitan dengan medan magnet Saturnus.",
    outerFrac: 0.55,
    innerFrac: 0.22,
    color: "#9fb4d8",
    representation: "model interpretasi",
    sourceIds: ["nasa-saturn"],
    reviewStatus: "draft",
  },
  {
    id: "saturn.core",
    objectId: "saturn",
    nameId: "Inti (perkiraan)",
    definitionSimple:
      "Bagian pusat berisi logam dan batuan, ukurannya masih diperkirakan.",
    explanationDetailed:
      "NASA menggambarkan inti padat logam seperti besi dan nikel dikelilingi batuan. Penelitian cincin menunjukkan inti mungkin menyebar (tidak bertepi tajam). Ukuran di model hanya perkiraan.",
    outerFrac: 0.22,
    innerFrac: 0,
    color: "#8a6f5a",
    representation: "model interpretasi",
    sourceIds: ["nasa-saturn"],
    reviewStatus: "draft",
  },
];

const sources = [
  ["nasa-sun", "Sun: Facts", "https://science.nasa.gov/sun/facts/"],
  ["nasa-mercury", "Mercury: Facts", "https://science.nasa.gov/mercury/facts/"],
  ["nasa-venus", "Venus: Facts", "https://science.nasa.gov/venus/venus-facts/"],
  ["nasa-earth", "Earth: Facts", "https://science.nasa.gov/earth/facts/"],
  ["nasa-moon", "Moon: Facts", "https://science.nasa.gov/moon/facts/"],
  ["nasa-mars", "Mars: Facts", "https://science.nasa.gov/mars/facts/"],
  [
    "nasa-jupiter",
    "Jupiter: Facts",
    "https://science.nasa.gov/jupiter/jupiter-facts/",
  ],
  ["nasa-saturn", "Saturn: Facts", "https://science.nasa.gov/saturn/facts/"],
  ["nasa-titan", "Titan", "https://science.nasa.gov/saturn/moons/titan/"],
  ["nasa-uranus", "Uranus: Facts", "https://science.nasa.gov/uranus/facts/"],
  [
    "nasa-neptune",
    "Neptune: Facts",
    "https://science.nasa.gov/neptune/neptune-facts/",
  ],
  [
    "nasa-pluto",
    "Pluto: Facts",
    "https://science.nasa.gov/dwarf-planets/pluto/facts/",
  ],
  ["nasa-planets", "Planets", "https://science.nasa.gov/solar-system/planets/"],
  ["nasa-moons", "Moons", "https://science.nasa.gov/solar-system/moons/"],
  [
    "nasa-asteroids",
    "Asteroids: Facts",
    "https://science.nasa.gov/solar-system/asteroids/facts/",
  ],
  [
    "nasa-comets",
    "Comets: Facts",
    "https://science.nasa.gov/solar-system/comets/facts/",
  ],
  ["nasa-galaxies", "Galaxies", "https://science.nasa.gov/universe/galaxies/"],
  [
    "nasa-system-galaxy",
    "Solar System, Galaxy, Universe: What's the Difference?",
    "https://science.nasa.gov/solar-system/skywatching/night-sky-network/solar-system-galaxy-universe-whats-the-difference/",
  ],
  [
    "nasa-moon-phases",
    "Moon Phases",
    "https://science.nasa.gov/moon/moon-phases/",
  ],
  ["nasa-eclipses", "Eclipses", "https://science.nasa.gov/moon/eclipses/"],
  [
    "nasa-seasons",
    "What Causes the Seasons? (NASA Space Place)",
    "https://spaceplace.nasa.gov/seasons/en/",
  ],
  [
    "usgs-inside",
    "Inside the Earth (USGS)",
    "https://pubs.usgs.gov/gip/dynamic/inside.html",
  ],
  [
    "usgs-mantle",
    "Are tectonic plates floating on magma? (USGS)",
    "https://www.usgs.gov/faqs/are-tectonic-plates-floating-magma",
  ],
  [
    "jpl-approx",
    "Approximate Positions of the Planets (JPL SSD)",
    "https://ssd.jpl.nasa.gov/planets/approx_pos.html",
  ],
].map(([id, title, url]) => ({
  id,
  title,
  url,
  publisher: url.includes("usgs") ? "USGS" : "NASA",
  checkedAt: REVIEWED,
}));

export const MANIFEST: AngkasaManifest = {
  version: "1.0.0",
  reviewedAt: REVIEWED,
  objects,
  parts,
  sources,
  lessons: [
    {
      id: "rotation-revolution",
      title: "Rotasi dan revolusi",
      concept:
        "Rotasi = Bumi berputar pada sumbunya. Revolusi = Bumi bergerak mengelilingi Matahari.",
      misconception: "Gerak kamera bukan putaran planet.",
      sourceIds: ["nasa-earth"],
    },
    {
      id: "day-night",
      title: "Siang dan malam",
      concept:
        "Separuh Bumi yang menghadap Matahari mengalami siang. Karena Bumi berputar, suatu tempat bergantian mengalami siang dan malam.",
      misconception: "Sisi terang tidak mengikuti posisi kamera.",
      sourceIds: ["nasa-earth"],
    },
    {
      id: "moon-phases",
      title: "Fase Bulan",
      concept:
        "Separuh Bulan selalu tersinari Matahari. Yang berubah adalah seberapa banyak sisi terang itu terlihat dari Bumi.",
      misconception: "Fase biasa bukan karena bayangan Bumi.",
      sourceIds: ["nasa-moon-phases"],
    },
    {
      id: "eclipses",
      title: "Gerhana",
      concept:
        "Gerhana terjadi saat Matahari, Bumi, dan Bulan hampir segaris sehingga bayangan satu benda jatuh ke benda lain.",
      misconception:
        "Gerhana tidak terjadi setiap bulan baru atau purnama, karena orbit Bulan miring sekitar 5°.",
      sourceIds: ["nasa-eclipses"],
    },
    {
      id: "seasons",
      title: "Kemiringan sumbu dan musim",
      concept:
        "Sumbu Bumi miring sekitar 23,4° dan arahnya tetap di ruang angkasa. Sepanjang tahun, belahan utara dan selatan bergantian lebih banyak menerima sinar Matahari.",
      misconception:
        "Musim bukan karena Bumi lebih dekat atau lebih jauh dari Matahari.",
      sourceIds: ["nasa-seasons"],
    },
  ],
  quiz: [
    {
      id: "q-biggest",
      prompt: "Tunjuk planet terbesar di tata surya.",
      kind: "object",
      answer: "jupiter",
      explanation:
        "Jupiter adalah planet terbesar; radiusnya sekitar 11 kali radius Bumi.",
    },
    {
      id: "q-rings",
      prompt:
        "Tunjuk planet keenam dari Matahari yang cincinnya paling mencolok.",
      kind: "object",
      answer: "saturn",
      explanation:
        "Saturnus adalah planet keenam; cincinnya tersusun dari banyak partikel es dan batuan.",
    },
    {
      id: "q-tilt",
      prompt: "Tunjuk planet yang sumbunya miring hampir 98°.",
      kind: "object",
      answer: "uranus",
      explanation:
        "Uranus berputar hampir 'rebah' karena kemiringan sumbunya 97,77°.",
    },
    {
      id: "q-pluto",
      prompt: "Pluto termasuk golongan apa?",
      kind: "choice",
      options: ["Planet kesembilan", "Planet katai", "Satelit Neptunus"],
      answer: "Planet katai",
      explanation:
        "Sejak 2006 Pluto digolongkan planet katai. Tata surya punya delapan planet.",
    },
    {
      id: "q-phases",
      prompt: "Mengapa bentuk Bulan tampak berubah-ubah?",
      kind: "choice",
      options: [
        "Bayangan Bumi menutupi Bulan",
        "Bagian terang Bulan yang terlihat dari Bumi berubah",
        "Bulan berubah ukuran",
      ],
      answer: "Bagian terang Bulan yang terlihat dari Bumi berubah",
      explanation:
        "Separuh Bulan selalu tersinari. Sudut Matahari–Bulan–Bumi menentukan berapa bagian terang yang kita lihat. Bayangan Bumi hanya berperan saat gerhana Bulan.",
      lesson: "moon-phases",
    },
    {
      id: "q-seasons",
      prompt: "Apa penyebab utama pergantian musim di Bumi?",
      kind: "choice",
      options: [
        "Bumi kadang dekat, kadang jauh dari Matahari",
        "Sumbu Bumi miring",
        "Matahari kadang lebih panas",
      ],
      answer: "Sumbu Bumi miring",
      explanation:
        "Kemiringan sumbu membuat belahan Bumi bergantian lebih banyak menerima sinar Matahari. Jarak Bumi–Matahari hanya sedikit berubah.",
      lesson: "seasons",
    },
    {
      id: "q-galaxy",
      prompt: "Di mana letak tata surya kita di Bima Sakti?",
      kind: "choice",
      options: [
        "Tepat di pusat galaksi",
        "Di salah satu lengan, jauh dari pusat",
        "Di luar galaksi",
      ],
      answer: "Di salah satu lengan, jauh dari pusat",
      explanation:
        "Matahari berada sekitar 26.000 tahun cahaya dari pusat Bima Sakti. Matahari bukan pusat galaksi.",
    },
  ],
};

export const OBJ = new Map(MANIFEST.objects.map((o) => [o.id, o]));
export const PART = new Map(MANIFEST.parts.map((p) => [p.id, p]));
export const SRC = new Map(MANIFEST.sources.map((s) => [s.id, s]));
export const PLANET_IDS = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
] as const;
export const getObj = (id: string) => {
  const o = OBJ.get(id);
  if (!o) throw new Error(`Objek angkasa tidak dikenal: ${id}`);
  return o;
};
