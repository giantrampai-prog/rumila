// Ekspedisi laut v2. Naskah orisinal, terpisah dari rekaman tur v1.
// Angka kedalaman adalah titik cerita; bukan batas habitat atau panduan menyelam.
export type LautSet = 'kapal' | 'karang' | 'lamun' | 'dinding' | 'biru' | 'redup' | 'kapal-selam' | 'senja' | 'cahaya' | 'ventilasi' | 'abisal' | 'palung' | 'challenger' | 'selesai' | 'ringkasan';
export interface LautStop {
  id: string; title: string; label: string; depth: [number, number]; set: LautSet;
  ride: 'selam' | 'kapal-selam'; discovery: string; prompt: string; lines: string[];
}
export const TUR_LAUT: LautStop[] = [
  {
    "id": "persiapan",
    "title": "Ada dunia di bawah sana",
    "label": "Ekspedisi bersama Agam",
    "depth": [
      0,
      0
    ],
    "set": "kapal",
    "ride": "selam",
    "discovery": "Laut menyimpan banyak dunia",
    "prompt": "Menurutmu, seperti apa dasar laut?",
    "lines": [
      "Hai, teman penjelajah! Aku Agam. Dari atas kapal, laut terlihat seperti hamparan biru. Tapi... apa ya yang bersembunyi di bawahnya?",
      "Hari ini kita akan mengunjungi taman karang, mencari hewan bercahaya, lalu menjelajahi salah satu tempat terdalam di Bumi. Kamu jadi teman pengamatku, ya!",
      "Kita mulai di perairan dangkal bersama pemandu. Masker, tabung udara, dan sirip sudah diperiksa. Untuk laut dalam, kapal selam riset kita sudah menunggu. Ini petualangan virtual; menyelam sungguhan harus bersama pelatih."
    ]
  },
  {
    "id": "masuk-laut",
    "title": "Selamat datang, dunia biru",
    "label": "Turun perlahan",
    "depth": [
      0,
      4
    ],
    "set": "kapal",
    "ride": "selam",
    "discovery": "Cahaya menari di dalam air",
    "prompt": "Temukan kilau matahari di pasir.",
    "lines": [
      "Siap melihat dunia dari sisi yang berbeda? Tiga... dua... satu... byur! Wah, suara di sekitar kita berubah. Gelembung-gelembung kecil naik menuju permukaan.",
      "Lihat ke atas. Matahari seperti menari di permukaan air! Cahayanya menembus ombak, lalu membentuk jaring terang di dasar yang berpasir.",
      "Kita berenang pelan. Cukup melihat, tanpa menyentuh atau mengejar hewan. Semakin tenang kita, semakin banyak yang bisa kita amati."
    ]
  },
  {
    "id": "terumbu-karang",
    "title": "Kota kecil yang hidup",
    "label": "Terumbu karang • 9 m",
    "depth": [
      4,
      9
    ],
    "set": "karang",
    "ride": "selam",
    "discovery": "Karang adalah hewan",
    "prompt": "Cari ikan oranye di dekat anemon.",
    "lines": [
      "Wah, ramai sekali! Ada karang bercabang, karang membulat, dan ikan-ikan kecil yang bergerak bersama. Rasanya seperti memasuki sebuah kota di bawah air.",
      "Tebak, karang itu batu, tumbuhan, atau hewan? Jawabannya... hewan! Banyak karang tersusun dari hewan kecil bernama polip yang hidup berkelompok.",
      "Lihat si oranye bergaris putih. Itu ikan badut, berlindung di antara tentakel anemon. Di dekatnya ada ikan biru berekor kuning. Coba ikuti dengan matamu.",
      "Dan di atas kita, penyu hijau lewat dengan gerakan tenang. Rumah yang indah ini perlu kita jaga. Sirip dan tangan kita jangan sampai merusak karangnya, ya."
    ]
  },
  {
    "id": "padang-lamun",
    "title": "Kebun yang bergoyang",
    "label": "Padang lamun • 16 m",
    "depth": [
      9,
      16
    ],
    "set": "lamun",
    "ride": "selam",
    "discovery": "Lamun adalah tumbuhan berbunga",
    "prompt": "Temukan ekor kuda laut yang melingkar.",
    "lines": [
      "Lihat kebun hijau yang melambai ini. Namanya padang lamun. Meski mirip rumput, lamun adalah tumbuhan berbunga yang hidup terendam di laut.",
      "Ssst... ada penghuni mungil yang bersembunyi. Kepalanya seperti kuda, ekornya melingkar. Betul, kuda laut! Ekornya bisa berpegangan agar tidak mudah terbawa arus.",
      "Di pasir, ada pari yang menyamarkan tubuhnya. Alam punya banyak cara untuk berlindung. Kita bisa menemukannya dengan mengamati bentuk dan gerakannya pelan-pelan."
    ]
  },
  {
    "id": "batas-aman",
    "title": "Naik kapal selam riset",
    "label": "Berganti kendaraan • 16 m",
    "depth": [
      16,
      16
    ],
    "set": "kapal-selam",
    "ride": "kapal-selam",
    "discovery": "Laut dalam memerlukan kendaraan khusus",
    "prompt": "Apa yang melindungi kita dari tekanan air?",
    "lines": [
      "Sebelum melanjutkan lebih dalam, kita berganti kendaraan. Selamat datang di kapal selam riset! Duduk di depan jendela, lalu lihat lampu-lampu kecil di panelnya.",
      "Air menekan benda dari segala arah. Semakin dalam, semakin besar tekanannya. Karena itu, ekspedisi laut dalam memakai kendaraan yang dirancang khusus untuk kedalaman tujuan.",
      "Perjalanan kita merangkum berbagai habitat laut. Jarak dan waktunya dipersingkat, jadi ini bukan rute menyelam sungguhan. Pintu tertutup, lampu siap... ayo lanjut!"
    ]
  },
  {
    "id": "dinding-karang",
    "title": "Di tepi dunia dangkal",
    "label": "Dinding karang • 34 m",
    "depth": [
      16,
      34
    ],
    "set": "dinding",
    "ride": "kapal-selam",
    "discovery": "Habitat berubah bersama kedalaman",
    "prompt": "Perhatikan kawanan yang bergerak bersama.",
    "lines": [
      "Dari jendela kapal, dasar laut mulai menurun seperti tebing. Karang menempel di dindingnya, dan kawanan barakuda melintas beriringan.",
      "Di kejauhan, hiu karang bergerak dengan tenang. Hiu berperan dalam ekosistem laut. Kita mengamatinya dari jarak yang cukup, tanpa memberi makan atau mengganggunya.",
      "Sekarang lihat ke arah biru yang lebih gelap. Setelah dinding ini, ruang terbuka yang luas sudah menanti. Siap bertemu penghuni berikutnya?"
    ]
  },
  {
    "id": "laut-biru",
    "title": "Sayap di lautan",
    "label": "Laut terbuka • 70 m",
    "depth": [
      34,
      70
    ],
    "set": "biru",
    "ride": "kapal-selam",
    "discovery": "Pari manta bergerak dengan siripnya",
    "prompt": "Amati gerakan sirip pari manta.",
    "lines": [
      "Wuuush... seekor pari manta meluncur melewati jendela! Siripnya lebar dan bergerak seperti sayap. Padahal, manta adalah ikan.",
      "Di belakangnya, kawanan tuna melesat bersama. Bentuk tubuh yang ramping membantu mereka bergerak di air. Bandingkan dengan ubur-ubur yang melayang perlahan.",
      "Ada yang cepat, ada yang tenang. Bentuk tubuh dan cara bergerak tiap hewan cocok dengan kehidupannya. Laut bukan hanya tempat tinggal; laut juga penuh cara hidup yang berbeda."
    ]
  },
  {
    "id": "makin-redup",
    "title": "Ke mana perginya warna?",
    "label": "Menjelang zona senja • 180 m",
    "depth": [
      70,
      180
    ],
    "set": "redup",
    "ride": "kapal-selam",
    "discovery": "Air menyerap cahaya secara bertahap",
    "prompt": "Bandingkan warna sebelum dan sesudah lampu menyala.",
    "lines": [
      "Perhatikan jendela kita. Birunya semakin gelap, ya? Air menyerap cahaya matahari sedikit demi sedikit. Cahaya merah terserap lebih cepat daripada cahaya biru.",
      "Benda yang tampak merah di permukaan bisa terlihat gelap di sini. Kita nyalakan lampu kapal... nah, warnanya tampak lagi!",
      "Itu cumi-cumi yang melintas! Kita akan segera melewati dua ratus meter. Setelah ini, sinar matahari tinggal sedikit. Apa yang akan membantu hewan mencari makan?"
    ]
  },
  {
    "id": "zona-senja",
    "title": "Lampu-lampu mungil",
    "label": "Zona senja • 200–1.000 m",
    "depth": [
      180,
      900
    ],
    "set": "senja",
    "ride": "kapal-selam",
    "discovery": "Sebagian hewan menghasilkan cahaya",
    "prompt": "Temukan titik cahaya pada ikan lentera.",
    "lines": [
      "Selamat datang di zona senja. Bukan karena sekarang sore, tetapi karena cahaya matahari di kedalaman ini sangat redup.",
      "Lihat titik-titik terang yang bergerak bersama. Itu ikan lentera. Banyak hewan laut menghasilkan cahaya melalui reaksi kimia di tubuhnya, atau dengan bantuan bakteri.",
      "Cahaya dapat membantu hewan berkomunikasi, mencari makanan, atau menyamarkan diri. Seperti pesan rahasia di tengah gelap!",
      "Sebagian penghuni zona ini naik mendekati permukaan saat malam untuk mencari makan, lalu turun lagi pada siang hari. Laut punya perjalanan hariannya sendiri."
    ]
  },
  {
    "id": "bioluminesensi",
    "title": "Bintang tanpa langit",
    "label": "Zona tengah malam • 1.800 m",
    "depth": [
      900,
      1800
    ],
    "set": "cahaya",
    "ride": "kapal-selam",
    "discovery": "Bioluminesensi berbeda dari pantulan cahaya",
    "prompt": "Cari umpan bercahaya di atas kepala ikan.",
    "lines": [
      "Kita melewati seribu meter. Cahaya matahari sudah tidak sampai ke sini. Tapi tunggu... gelap bukan berarti kosong.",
      "Di depan ada ikan pemancing. Umpan kecil di atas kepalanya bercahaya untuk menarik mangsa. Cahaya yang dibuat makhluk hidup disebut bioluminesensi. Panjang namanya, ajaib kemampuannya!",
      "Dan itu hewan sisir yang berkilau pelangi saat terkena lampu. Kilau pelanginya berasal dari cahaya yang dihamburkan barisan rambut kecilnya. Jadi, tidak semua kilau berarti membuat cahaya sendiri.",
      "Kita lihat dengan tenang. Bentuk mereka mungkin tidak biasa bagi kita, tetapi setiap bentuk membantu mereka hidup di rumah yang gelap ini."
    ]
  },
  {
    "id": "ventilasi",
    "title": "Oasis di dasar laut",
    "label": "Ventilasi hidrotermal • 2.600 m",
    "depth": [
      1800,
      2600
    ],
    "set": "ventilasi",
    "ride": "kapal-selam",
    "discovery": "Kehidupan juga ditopang energi kimia",
    "prompt": "Cari cacing tabung di sekitar cerobong.",
    "lines": [
      "Lihat cerobong batu di depan! Dari dalamnya keluar cairan panas yang kaya mineral. Saat bertemu air laut dingin, mineralnya membentuk gumpalan gelap mirip asap.",
      "Tempat ini disebut ventilasi hidrotermal. Bukan api yang menyala di dalam air, ya. Panas dari dalam Bumi memanaskan cairan yang keluar dari celah dasar laut.",
      "Aneh tapi nyata: di sekitar sini ada kehidupan tanpa mengandalkan cahaya matahari langsung. Mikroba memanfaatkan energi dari zat kimia untuk membuat makanan.",
      "Kumpulan cacing tabung, kepiting, dan udang menjadi bagian dari komunitas ini. Di tengah laut yang gelap, kita menemukan sebuah oasis kehidupan!"
    ]
  },
  {
    "id": "dataran-abisal",
    "title": "Salju yang bukan es",
    "label": "Zona abisal • 4.500 m",
    "depth": [
      2600,
      4500
    ],
    "set": "abisal",
    "ride": "kapal-selam",
    "discovery": "Salju laut membawa bahan organik",
    "prompt": "Perhatikan butiran yang turun perlahan.",
    "lines": [
      "Angka kedalaman sudah melewati empat ribu meter. Di depan kita terbentang dasar laut yang luas dan tenang. Inilah suasana dataran abisal.",
      "Coba lihat butiran kecil yang turun di depan lampu. Seperti salju, ya? Ini salju laut: serpihan bahan organik dan partikel yang tenggelam dari lapisan di atas.",
      "Sebagian serpihan itu menjadi makanan bagi penghuni laut dalam. Jadi, kehidupan dekat permukaan terhubung dengan kehidupan jauh di bawah.",
      "Di dasar, ikan tripod bertumpu pada sirip panjangnya. Teripang merayap pelan, mencari makanan di sedimen. Tak perlu terburu-buru; kita amati bersama."
    ]
  },
  {
    "id": "palung-laut",
    "title": "Gerbang laut terdalam",
    "label": "Zona hadal • 6.500 m",
    "depth": [
      4500,
      6500
    ],
    "set": "palung",
    "ride": "kapal-selam",
    "discovery": "Palung adalah cekungan yang sangat dalam",
    "prompt": "Lihat dinding yang menjulang di sisi kapal.",
    "lines": [
      "Dua dinding gelap muncul di kiri dan kanan. Kita memasuki palung, cekungan panjang yang sangat dalam di dasar laut.",
      "Di bawah enam ribu meter, kita menyebut wilayah ini zona hadal. Tekanannya sangat besar, airnya dingin, dan tidak ada sinar matahari.",
      "Kapal khusus dan robot riset membantu ilmuwan menjelajah tempat seperti ini. Kita mendekat perlahan, supaya sedimen tidak menutupi pandangan. Masih adakah hewan di sini?"
    ]
  },
  {
    "id": "biota-palung",
    "title": "Penghuni yang tangguh",
    "label": "Kehidupan hadal • 6.500 m",
    "depth": [
      6500,
      6500
    ],
    "set": "palung",
    "ride": "kapal-selam",
    "discovery": "Ikan siput mampu hidup di palung tertentu",
    "prompt": "Temukan ikan yang tubuhnya pucat.",
    "lines": [
      "Ada! Lihat ikan pucat yang berenang pelan itu. Ini contoh ikan siput hadal. Mereka memiliki berbagai penyesuaian tubuh untuk hidup di bawah tekanan tinggi.",
      "Pada tahun dua ribu dua puluh tiga, peneliti merekam ikan siput di kedalaman delapan ribu tiga ratus tiga puluh enam meter, di sebuah palung dekat Jepang. Penemuan yang luar biasa!",
      "Tapi itu tidak berarti ikan hidup sampai titik paling dalam. Semakin ke bawah, penghuni yang kita temukan bisa berbeda. Ada amfipoda, hewan kecil mirip udang, yang mencari makanan di dasar."
    ]
  },
  {
    "id": "challenger-deep",
    "title": "Hampir sebelas kilometer",
    "label": "Challenger Deep • ±10.935 m",
    "depth": [
      6500,
      10935
    ],
    "set": "challenger",
    "ride": "kapal-selam",
    "discovery": "Titik laut terdalam yang diketahui",
    "prompt": "Bayangkan hampir sebelas kilometer air di atas kita.",
    "lines": [
      "Lihat meteran kedalaman kita... hampir sebelas ribu meter! Dalam perjalanan virtual ini, kita mengunjungi Challenger Deep di Palung Mariana, Samudra Pasifik.",
      "Kedalamannya sekitar sepuluh ribu sembilan ratus tiga puluh lima meter. Bayangkan hampir sebelas kilometer air berada di atas kapal kita!",
      "Di tempat ini, kita tidak menampilkan ikan. Pengamatan ilmiah menemukan kehidupan seperti mikroba dan hewan tak bertulang belakang di lingkungan laut terdalam.",
      "Sunyi, luas, dan masih menyimpan banyak pertanyaan. Kita sudah sampai sangat jauh, tetapi para ilmuwan terus belajar. Siapa tahu, suatu hari kamu ikut menemukan jawabannya."
    ]
  },
  {
    "id": "misi-selesai",
    "title": "Buku penemuan kita",
    "label": "Ekspedisi selesai",
    "depth": [
      10935,
      10935
    ],
    "set": "selesai",
    "ride": "kapal-selam",
    "discovery": "Setiap kedalaman punya cerita",
    "prompt": "Mana penemuan favoritmu?",
    "lines": [
      "Tos, teman penjelajah! Kita sudah bertemu kota karang, kebun lamun, hewan bercahaya, dan kehidupan di palung laut.",
      "Sekarang pilih penemuan favoritmu. Apakah karang yang ternyata hewan? Ikan yang membawa lampu? Atau makanan yang turun seperti salju?",
      "Kamu boleh mengulang setiap bagian dan mengamati hewannya lebih dekat. Penjelajah yang hebat selalu punya pertanyaan baru."
    ]
  },
  {
    "id": "ringkasan",
    "title": "Bawa rasa ingin tahu pulang",
    "label": "Kembali ke permukaan",
    "depth": [
      10935,
      0
    ],
    "set": "ringkasan",
    "ride": "kapal-selam",
    "discovery": "Laut yang sehat perlu kita jaga",
    "prompt": "Sebutkan satu cara menjaga laut.",
    "lines": [
      "Kita kembali ke cahaya. Ingat perubahan yang tadi kita lihat: terang di dekat permukaan, redup di zona senja, lalu gelap di laut dalam.",
      "Tempat yang berbeda punya penghuni dan cara hidup yang berbeda. Tidak semua hewan ada di semua kedalaman. Itulah yang membuat laut begitu menarik.",
      "Menjaga laut bisa dimulai dari rumah: kurangi sampah, gunakan kembali barang yang masih baik, dan jangan membuang sampah ke sungai atau laut.",
      "Terima kasih sudah menjelajah bersamaku. Aku Agam. Sampai bertemu di penemuan berikutnya!"
    ]
  }
];

export interface Biota {
  id: string;
  name: string;
  /** ikon karakter (dari lembar ikon storyboard) */
  img: string;
  /** adegan tempat biota ini tinggal */
  stop: string;
  desc: string;
  fact: string;
}

/** 16 karakter biota (lembar "Icon Karakter Ikan & Biota Laut"). */
export const BIOTA: Biota[] = [
  { id: 'ikan-badut', name: 'Ikan Badut', stop: 'terumbu-karang', desc: 'Ikan oranye bergaris putih yang tinggal di antara tentakel anemon.', fact: 'Lendir di tubuhnya melindunginya dari sengatan anemon.' },
  { id: 'ikan-kupu-kupu', name: 'Ikan Kupu-kupu', stop: 'terumbu-karang', desc: 'Ikan pipih berwarna cerah dengan garis-garis di tubuhnya.', fact: 'Banyak ikan kupu-kupu punya bintik atau garis gelap yang membingungkan pemangsa.' },
  { id: 'blue-tang', name: 'Ikan Blue Tang', stop: 'terumbu-karang', desc: 'Ikan biru cerah dengan ekor kuning.', fact: 'Di dekat ekornya ada duri tajam seperti pisau kecil untuk membela diri.' },
  { id: 'penyu-hijau', name: 'Penyu Hijau', stop: 'terumbu-karang', desc: 'Penyu besar yang berenang dengan kaki seperti dayung.', fact: 'Namanya penyu hijau karena lemak di tubuhnya berwarna kehijauan, bukan karena cangkangnya.' },
  { id: 'kuda-laut', name: 'Kuda Laut', stop: 'padang-lamun', desc: 'Ikan kecil berkepala mirip kuda yang berenang tegak.', fact: 'Pada kuda laut, sang ayahlah yang mengandung dan melahirkan anak-anaknya.' },
  { id: 'ikan-kakatua', name: 'Ikan Kakatua', stop: 'padang-lamun', desc: 'Ikan berwarna-warni dengan gigi menyatu seperti paruh burung.', fact: 'Sebagian pasir putih berasal dari karang yang digerus ikan kakatua saat mencari makan.' },
  { id: 'lionfish', name: 'Lionfish', stop: 'padang-lamun', desc: 'Ikan bergaris merah-putih dengan sirip panjang seperti surai singa.', fact: 'Duri-duri siripnya beracun, jadi cukup dilihat saja.' },
  { id: 'pari', name: 'Ikan Pari', stop: 'padang-lamun', desc: 'Ikan pipih yang suka bersembunyi di bawah pasir.', fact: 'Mata pari ada di atas kepala, sedangkan mulutnya ada di bawah tubuh.' },
  { id: 'hiu-karang', name: 'Hiu Karang', stop: 'dinding-karang', desc: 'Hiu yang tinggal di sekitar terumbu karang.', fact: 'Hiu terus tumbuh gigi baru seumur hidupnya.' },
  { id: 'barakuda', name: 'Barakuda', stop: 'dinding-karang', desc: 'Ikan panjang keperakan dengan gigi tajam.', fact: 'Barakuda sering berenang bergerombol membentuk pusaran besar.' },
  { id: 'ubur-ubur', name: 'Ubur-ubur', stop: 'makin-redup', desc: 'Hewan lunak berbentuk payung yang melayang di air.', fact: 'Ubur-ubur tidak punya otak, jantung, maupun tulang.' },
  { id: 'cumi-cumi', name: 'Cumi-cumi', stop: 'makin-redup', desc: 'Hewan laut bertentakel yang bisa berenang sangat cepat.', fact: 'Cumi-cumi punya tiga jantung dan darah berwarna biru.' },
  { id: 'ikan-lentera', name: 'Ikan Lentera', stop: 'zona-senja', desc: 'Ikan kecil dengan titik-titik cahaya di tubuhnya.', fact: 'Ikan lentera termasuk ikan yang jumlahnya paling banyak di lautan.' },
  { id: 'ikan-pemancing', name: 'Ikan Pemancing', stop: 'bioluminesensi', desc: 'Ikan laut dalam yang punya umpan bercahaya di kepalanya.', fact: 'Cahaya umpannya dibuat oleh bakteri yang hidup di dalamnya.' },
  { id: 'belut-gulper', name: 'Belut Gulper', stop: 'bioluminesensi', desc: 'Belut laut dalam bermulut sangat besar seperti kantong.', fact: 'Mulutnya bisa membuka lebar untuk menelan mangsa yang cukup besar.' },
  { id: 'ikan-siput-hadal', name: 'Ikan Siput Hadal', stop: 'biota-palung', desc: 'Ikan pucat bertubuh lunak yang hidup di palung laut.', fact: 'Ikan ini pernah terlihat hidup di kedalaman lebih dari delapan ribu meter.' },
].map((b) => ({ ...b, img: `/laut/ikon/${b.id}.webp` }));


export const ZONA_LAUT = [
  {
    "min": 0,
    "max": 200,
    "name": "Zona cahaya",
    "color": "#79dfdc",
    "depth": "0–200 m"
  },
  {
    "min": 200,
    "max": 1000,
    "name": "Zona senja",
    "color": "#2375ad",
    "depth": "200–1.000 m"
  },
  {
    "min": 1000,
    "max": 4000,
    "name": "Zona tengah malam",
    "color": "#173c69",
    "depth": "1.000–4.000 m"
  },
  {
    "min": 4000,
    "max": 6000,
    "name": "Zona abisal",
    "color": "#102642",
    "depth": "4.000–6.000 m"
  },
  {
    "min": 6000,
    "max": 11000,
    "name": "Zona hadal",
    "color": "#071626",
    "depth": "6.000–11.000 m"
  }
];
export function zoneAtDepth(depth: number) { return ZONA_LAUT.find(z => depth < z.max) ?? ZONA_LAUT[ZONA_LAUT.length - 1]; }
export const lautDwell = (s: LautStop) => s.lines.reduce((t, line) => t + lineDuration(line), 0);
export const lineDuration = (line: string) => Math.max(6, line.split(/\s+/).length / 2.05 + 1.3);
export const depthToY = (d: number) => -10 * Math.pow(Math.max(0, d), 0.6);
export const yToDepth = (y: number) => Math.pow(Math.max(0, -y) / 10, 1 / 0.6);
