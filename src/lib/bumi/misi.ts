// Modul "Petualangan ke Dalam Bumi 3D": tur 16 adegan (mengikuti storyboard) + 16 karakter + data game.
// Naskah suara: docs/bumi/ (SATU file suara, jeda ±1 detik antaradegan, lalu timestamp).
// Akurasi: manusia belum pernah menggali lebih dari ±12 km (lubang terdalam, Kola); bagian lebih dalam
// dijelaskan jujur sebagai kapsul khayalan berdasarkan pengetahuan ilmuwan (gelombang gempa & model Bumi).

export type BumiSet = 'permukaan' | 'mulut-gua' | 'tanah' | 'gua-kapur' | 'sungai' | 'fosil' | 'kristal' | 'kerak' | 'moho' | 'mantel-atas' | 'mantel-bawah' | 'inti-luar' | 'inti-dalam' | 'magnet' | 'selesai' | 'ringkasan';

export interface BumiStop {
  id: string;
  title: string;
  label: string;
  /** kedalaman (meter) di awal & akhir adegan */
  depth: [number, number];
  set: BumiSet;
  /** berjalan kaki / perahu / kapsul */
  ride: 'jalan' | 'perahu' | 'kapsul';
  lines: string[];
}

export const TUR_BUMI: BumiStop[] = [
  {
    id: 'persiapan',
    title: 'Persiapan ekspedisi',
    label: 'Di kaki bukit',
    depth: [0, 0],
    set: 'permukaan',
    ride: 'jalan',
    lines: [
      'Halo, penjelajah cilik! Hari ini kita berpetualang ke tempat yang sangat dekat tetapi jarang dilihat, yaitu ke dalam Bumi!',
      'Sebelum berangkat, kita siapkan perlengkapan: helm dengan lampu, senter, tali, peta, dan sarung tangan. Penjelajah gua selalu berhati-hati dan tidak pernah pergi sendirian.',
    ],
  },
  {
    id: 'mulut-gua',
    title: 'Masuk ke mulut gua',
    label: 'Mulut gua',
    depth: [0, 1],
    set: 'mulut-gua',
    ride: 'jalan',
    lines: [
      'Kita masuk lewat mulut gua. Cahaya matahari mulai berkurang, dan udaranya terasa lebih sejuk.',
      'Nyalakan lampu helm, ya. Petualangan ke bawah tanah dimulai!',
    ],
  },
  {
    id: 'lapisan-tanah',
    title: 'Lapisan tanah',
    label: '0 – 2 m',
    depth: [1, 2],
    set: 'tanah',
    ride: 'jalan',
    lines: [
      'Lapisan paling atas disebut tanah. Lihat, ada akar tumbuhan, jamur, semut, dan cacing tanah.',
      'Cacing tanah membuat lorong-lorong kecil sehingga udara dan air bisa masuk ke dalam tanah. Karena itu tanah menjadi gembur dan subur untuk tumbuhan.',
    ],
  },
  {
    id: 'gua-kapur',
    title: 'Gua kapur',
    label: '2 – 50 m',
    depth: [2, 50],
    set: 'gua-kapur',
    ride: 'jalan',
    lines: [
      'Wah, kita sampai di gua batu kapur! Gua ini terbentuk karena air hujan perlahan-lahan melarutkan batu kapur selama ribuan tahun.',
      'Yang menggantung dari atap namanya stalaktit, dan yang tumbuh dari lantai namanya stalagmit. Keduanya tumbuh sangat lambat, kira-kira hanya satu sentimeter dalam seratus tahun.',
      'Ssst, itu kelelawar! Kelelawar tidur di siang hari sambil bergelantungan terbalik.',
    ],
  },
  {
    id: 'sungai-bawah-tanah',
    title: 'Sungai bawah tanah',
    label: '50 – 200 m',
    depth: [50, 200],
    set: 'sungai',
    ride: 'perahu',
    lines: [
      'Di beberapa gua, air mengalir jauh di bawah permukaan menjadi sungai bawah tanah. Kita naik perahu karet, ya!',
      'Lihat salamander gua yang pucat itu. Hewan yang hidup di gua gelap sering berwarna pucat dan matanya sangat kecil, karena di sini tidak ada cahaya.',
    ],
  },
  {
    id: 'batuan-fosil',
    title: 'Lapisan batuan & fosil',
    label: '200 – 1.000 m',
    depth: [200, 1000],
    set: 'fosil',
    ride: 'jalan',
    lines: [
      'Lihat dinding batu yang berlapis-lapis ini. Setiap lapisan terbentuk dari endapan selama waktu yang sangat lama.',
      'Di sini kita menemukan fosil, yaitu jejak atau sisa makhluk hidup purba yang berubah menjadi batu. Itu fosil amonit yang bercangkang melingkar, dan itu trilobit, hewan laut yang hidup jauh sebelum ada dinosaurus!',
    ],
  },
  {
    id: 'kristal',
    title: 'Mineral & kristal',
    label: '1 – 5 km',
    depth: [1000, 5000],
    set: 'kristal',
    ride: 'jalan',
    lines: [
      'Berkilau sekali! Di dalam kerak bumi, mineral dan kristal terbentuk selama jutaan tahun karena panas, tekanan, dan cairan mineral.',
      'Ini kristal kuarsa yang bening, ini ametis yang ungu, dan yang kuning mengilap itu pirit. Pirit sering disebut emas palsu karena warnanya mirip emas.',
    ],
  },
  {
    id: 'kerak-bumi',
    title: 'Kerak bumi',
    label: '5 – 35 km',
    depth: [5000, 30000],
    set: 'kerak',
    ride: 'kapsul',
    lines: [
      'Tahukah kamu? Lubang terdalam yang pernah digali manusia hanya sekitar dua belas kilometer. Lebih dalam dari itu terlalu panas dan tekanannya terlalu besar.',
      'Mulai sekarang kita memakai kapsul penjelajah khayalan. Semua yang kita lihat berikutnya disusun dari pengetahuan para ilmuwan.',
      'Kerak bumi adalah lapisan batuan padat paling luar, tempat benua dan dasar laut berada. Di sinilah kita semua hidup.',
    ],
  },
  {
    id: 'moho',
    title: 'Batas Moho',
    label: '± 35 km',
    depth: [30000, 40000],
    set: 'moho',
    ride: 'kapsul',
    lines: [
      'Di bawah kerak bumi ada sebuah batas yang disebut Moho. Di sinilah kerak berakhir dan mantel bumi dimulai.',
      'Di bawah benua, batas Moho rata-rata sekitar tiga puluh lima kilometer, tetapi di bawah samudra jauh lebih dangkal.',
    ],
  },
  {
    id: 'mantel-atas',
    title: 'Mantel atas',
    label: '35 – 660 km',
    depth: [40000, 660000],
    set: 'mantel-atas',
    ride: 'kapsul',
    lines: [
      'Selamat datang di mantel atas. Batuannya sangat panas, tetapi sebagian besar masih padat.',
      'Batuan ini bergerak sangat pelan, kira-kira secepat kuku kita tumbuh. Gerakan inilah yang menggeser lempeng-lempeng bumi, lalu bisa menimbulkan gempa dan gunung api.',
    ],
  },
  {
    id: 'mantel-bawah',
    title: 'Mantel bawah',
    label: '660 – 2.900 km',
    depth: [660000, 2900000],
    set: 'mantel-bawah',
    ride: 'kapsul',
    lines: [
      'Semakin dalam, tekanan semakin besar dan batuan menjadi sangat padat.',
      'Belum ada yang pernah ke sini. Ilmuwan mempelajari bagian ini dari gelombang gempa yang merambat melewati Bumi, seperti dokter yang memeriksa tubuh kita dengan alat.',
    ],
  },
  {
    id: 'inti-luar',
    title: 'Inti luar',
    label: '2.900 – 5.100 km',
    depth: [2900000, 5100000],
    set: 'inti-luar',
    ride: 'kapsul',
    lines: [
      'Inilah inti luar, lautan logam cair yang sangat panas. Isinya kebanyakan besi dan nikel.',
      'Logam cair ini terus berputar dan mengalir. Gerakannya membantu membuat medan magnet Bumi.',
    ],
  },
  {
    id: 'inti-dalam',
    title: 'Inti dalam',
    label: '5.100 – 6.371 km',
    depth: [5100000, 6371000],
    set: 'inti-dalam',
    ride: 'kapsul',
    lines: [
      'Kita tiba di pusat Bumi, yaitu inti dalam. Suhunya kira-kira sama panasnya dengan permukaan Matahari!',
      'Walau sangat panas, inti dalam berupa bola besi dan nikel yang padat, karena tekanan di sini luar biasa besar.',
    ],
  },
  {
    id: 'medan-magnet',
    title: 'Medan magnet Bumi',
    label: 'Perisai tak terlihat',
    depth: [6371000, 6371000],
    set: 'magnet',
    ride: 'kapsul',
    lines: [
      'Medan magnet Bumi seperti perisai tak terlihat. Perisai ini membelokkan partikel berenergi dari Matahari sehingga kehidupan di Bumi terlindungi.',
      'Medan magnet juga membuat jarum kompas menunjuk ke utara, dan membantu munculnya cahaya aurora yang indah di dekat kutub.',
    ],
  },
  {
    id: 'misi-selesai',
    title: 'Misi selesai',
    label: 'Penemuan kami',
    depth: [6371000, 6371000],
    set: 'selesai',
    ride: 'kapsul',
    lines: [
      'Hore, misi selesai! Kita sudah menjelajah dari tanah di bawah kaki kita sampai ke pusat Bumi.',
      'Setiap lapisan memberi petunjuk tentang cara Bumi bekerja, dan mengingatkan kita untuk menjaga rumah kita bersama.',
    ],
  },
  {
    id: 'ringkasan',
    title: 'Ringkasan lapisan Bumi',
    label: 'Kembali ke permukaan',
    depth: [6371000, 0],
    set: 'ringkasan',
    ride: 'kapsul',
    lines: [
      'Ayo kita ingat lagi: paling atas ada tanah, lalu gua dan batuan, kerak bumi, mantel atas, mantel bawah, inti luar yang cair, dan inti dalam yang padat.',
      'Bumi adalah satu-satunya rumah kita. Mari kita jaga bersama. Sampai jumpa di petualangan berikutnya!',
    ],
  },
];

/** Lapisan Bumi untuk ringkasan & game "Susun Lapisan Bumi" (dari luar ke dalam). */
export const LAPISAN: { id: string; name: string; depth: string; color: string; fact: string }[] = [
  { id: 'kerak', name: 'Kerak bumi', depth: '0 – 35 km', color: '#8a6a4a', fact: 'Lapisan batuan padat paling luar, tempat benua dan dasar laut berada.' },
  { id: 'mantel-atas', name: 'Mantel atas', depth: '35 – 660 km', color: '#d9542c', fact: 'Batuan panas yang bergerak sangat pelan dan menggeser lempeng bumi.' },
  { id: 'mantel-bawah', name: 'Mantel bawah', depth: '660 – 2.900 km', color: '#a8341f', fact: 'Batuan sangat panas dan padat karena tekanan yang besar.' },
  { id: 'inti-luar', name: 'Inti luar', depth: '2.900 – 5.100 km', color: '#ff9a1f', fact: 'Besi dan nikel cair yang mengalir dan membuat medan magnet.' },
  { id: 'inti-dalam', name: 'Inti dalam', depth: '5.100 – 6.371 km', color: '#ffe27a', fact: 'Bola besi dan nikel padat, sepanas permukaan Matahari.' },
];

export interface Karakter {
  id: string;
  name: string;
  img: string;
  stop: string;
  desc: string;
  fact: string;
}

export const KARAKTER: Karakter[] = [
  { id: 'cacing-tanah', name: 'Cacing Tanah', stop: 'lapisan-tanah', desc: 'Hewan tanah yang membuat lorong-lorong kecil.', fact: 'Cacing tanah bernapas lewat kulitnya yang lembap.' },
  { id: 'semut-tanah', name: 'Semut Tanah', stop: 'lapisan-tanah', desc: 'Serangga kecil yang hidup berkelompok di sarang bawah tanah.', fact: 'Semut bisa mengangkat benda yang jauh lebih berat dari tubuhnya.' },
  { id: 'kelelawar-gua', name: 'Kelelawar Gua', stop: 'gua-kapur', desc: 'Satu-satunya mamalia yang benar-benar bisa terbang.', fact: 'Banyak kelelawar menemukan jalan dalam gelap dengan mendengar pantulan suaranya.' },
  { id: 'salamander-gua', name: 'Salamander Gua', stop: 'sungai-bawah-tanah', desc: 'Amfibi pucat yang hidup di air gua yang gelap.', fact: 'Hewan gua sering tidak butuh mata karena selalu gelap.' },
  { id: 'fosil-ammonit', name: 'Fosil Amonit', stop: 'batuan-fosil', desc: 'Sisa hewan laut purba bercangkang melingkar.', fact: 'Amonit punah bersamaan dengan dinosaurus, sekitar 66 juta tahun lalu.' },
  { id: 'trilobit', name: 'Trilobit', stop: 'batuan-fosil', desc: 'Hewan laut purba bertubuh beruas-ruas.', fact: 'Trilobit hidup lebih dari 250 juta tahun lalu, jauh sebelum dinosaurus.' },
  { id: 'stalaktit', name: 'Stalaktit', stop: 'gua-kapur', desc: 'Batu kapur runcing yang menggantung dari atap gua.', fact: 'Stalaktit terbentuk dari tetesan air yang meninggalkan sedikit kapur.' },
  { id: 'stalagmit', name: 'Stalagmit', stop: 'gua-kapur', desc: 'Batu kapur yang tumbuh ke atas dari lantai gua.', fact: 'Bila stalaktit dan stalagmit bertemu, terbentuklah tiang batu.' },
  { id: 'kristal-kuarsa', name: 'Kristal Kuarsa', stop: 'kristal', desc: 'Kristal bening bersisi enam yang sangat keras.', fact: 'Banyak pasir pantai terbuat dari butiran kuarsa.' },
  { id: 'geoda', name: 'Geoda', stop: 'kristal', desc: 'Batu yang di dalamnya berongga dan penuh kristal.', fact: 'Dari luar geoda tampak seperti batu biasa!' },
  { id: 'batu-bara', name: 'Batu Bara', stop: 'batuan-fosil', desc: 'Batuan hitam dari tumbuhan purba yang terkubur jutaan tahun.', fact: 'Batu bara bisa dibakar untuk menghasilkan listrik, tetapi asapnya mencemari udara.' },
  { id: 'obsidian', name: 'Obsidian', stop: 'kristal', desc: 'Kaca alami berwarna hitam mengilap.', fact: 'Obsidian terbentuk saat lava mendingin dengan sangat cepat.' },
  { id: 'lava', name: 'Lava', stop: 'mantel-atas', desc: 'Batuan cair panas yang keluar dari gunung api.', fact: 'Indonesia punya lebih dari seratus gunung api aktif.' },
  { id: 'magma', name: 'Magma', stop: 'mantel-atas', desc: 'Batuan cair yang masih berada di dalam Bumi.', fact: 'Magma yang keluar ke permukaan berganti nama menjadi lava.' },
  { id: 'besi-cair', name: 'Besi Cair', stop: 'inti-luar', desc: 'Logam cair yang mengalir di inti luar Bumi.', fact: 'Aliran besi cair di inti luar membantu membuat medan magnet Bumi.' },
  { id: 'geo-explorer', name: 'Geo Explorer', stop: 'kerak-bumi', desc: 'Kapsul penjelajah khayalan untuk menembus lapisan Bumi.', fact: 'Kapsul ini khayalan — di dunia nyata ilmuwan memakai gelombang gempa untuk "melihat" isi Bumi.' },
].map((k) => ({ ...k, img: `/bumi/ikon/${k.id}.webp` }));

/** Fosil & batuan untuk game "Gali Fosil". */
export const TEMUAN: { id: string; name: string; kind: 'amonit' | 'trilobit' | 'daun' | 'ikan' | 'tulang' | 'geoda'; fact: string }[] = [
  { id: 'amonit', name: 'Fosil Amonit', kind: 'amonit', fact: 'Hewan laut purba bercangkang melingkar yang punah bersama dinosaurus.' },
  { id: 'trilobit', name: 'Fosil Trilobit', kind: 'trilobit', fact: 'Hewan laut beruas-ruas yang hidup lebih dari 250 juta tahun lalu.' },
  { id: 'daun', name: 'Fosil Daun', kind: 'daun', fact: 'Jejak daun purba yang tercetak di batu. Dari fosil daun kita tahu tumbuhan zaman dulu.' },
  { id: 'ikan', name: 'Fosil Ikan', kind: 'ikan', fact: 'Tulang ikan purba yang tertimbun lumpur lalu perlahan berubah menjadi batu.' },
  { id: 'tulang', name: 'Fosil Tulang', kind: 'tulang', fact: 'Tulang hewan purba yang membatu. Ilmuwan menyusunnya seperti teka-teki.' },
  { id: 'geoda', name: 'Geoda', kind: 'geoda', fact: 'Batu biasa di luar, penuh kristal ungu di dalam!' },
];

export interface BumiAudioPart {
  src: string;
  first: number;
  cues: number[];
}

/** Narasi tur: SATU file suara. Kosong = belum ada rekaman (adegan memakai waktu baca, teks tampil kecil). */
export const TUR_BUMI_AUDIO: BumiAudioPart[] = [];

export const bumiDwell = (s: BumiStop) => Math.max(7, s.lines.join(' ').length / 14 + 2);

export const fmtDepth = (m: number) => (m < 1000 ? `${Math.round(m).toLocaleString('id-ID')} m` : `${Math.round(m / 1000).toLocaleString('id-ID')} km`);
