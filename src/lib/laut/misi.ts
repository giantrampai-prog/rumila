// Modul "Petualangan Bawah Laut 3D": naskah tur menyelam (16 adegan, mengikuti storyboard) + katalog biota.
// Naskah suara: docs/laut/naskah-tur-laut.txt (SATU file suara, jeda ±1 detik antaradegan, lalu timestamp).
// Gaya: ceria, menyapa anak ("kita", "kamu"), kalimat pendek; fakta dibulatkan & akurat.
// Catatan akurasi: penyelam rekreasi aman sampai ±40 m — narasi adegan "batas aman" menjelaskannya dengan jujur.

export type LautSet = 'kapal' | 'karang' | 'lamun' | 'dinding' | 'biru' | 'redup' | 'kapal-selam' | 'senja' | 'cahaya' | 'ventilasi' | 'abisal' | 'palung' | 'selesai' | 'ringkasan';

export interface LautStop {
  id: string;
  title: string;
  /** label kedalaman di layar */
  label: string;
  /** kedalaman penjelajah (meter) di awal & akhir adegan */
  depth: [number, number];
  set: LautSet;
  /** kendaraan: menyelam sendiri atau di kapal selam mini */
  ride: 'selam' | 'kapal-selam';
  lines: string[];
}

export const TUR_LAUT: LautStop[] = [
  {
    id: 'persiapan',
    title: 'Persiapan menyelam',
    label: 'Di atas kapal',
    depth: [0, 0],
    set: 'kapal',
    ride: 'selam',
    lines: [
      'Halo, penyelam cilik! Kita berada di atas kapal, di tengah laut Indonesia yang biru. Matahari mulai bersinar.',
      'Sebelum menyelam, kita periksa semua perlengkapan dengan teliti: masker untuk melihat, tabung berisi udara untuk bernapas, dan sirip kaki supaya bisa berenang dengan mudah.',
      'Penyelam tidak pernah menyelam sendirian. Kita selalu ditemani pelatih. Keselamatan nomor satu!',
    ],
  },
  {
    id: 'masuk-laut',
    title: 'Masuk ke laut',
    label: '0 m',
    depth: [0, 4],
    set: 'kapal',
    ride: 'selam',
    lines: [
      'Siap? Kita melangkah lebar dari tepi kapal. Byurr!',
      'Lalu kita turun pelan-pelan. Makin dalam, air makin menekan telinga. Penyelam menyamakan tekanan dengan menutup hidung lalu mengembuskan napas pelan-pelan.',
    ],
  },
  {
    id: 'terumbu-karang',
    title: 'Terumbu karang',
    label: '0 – 10 m',
    depth: [4, 9],
    set: 'karang',
    ride: 'selam',
    lines: [
      'Wah, lihat! Ini terumbu karang, rumah bagi banyak sekali makhluk laut.',
      'Karang memang tampak seperti batu atau tanaman, tetapi sebenarnya karang adalah hewan-hewan kecil yang hidup berkelompok.',
      'Itu ikan badut yang tinggal di anemon, ikan kupu-kupu yang bergaris, ikan blue tang yang biru cerah, dan penyu hijau yang berenang santai.',
      'Indonesia berada di Segitiga Terumbu Karang, salah satu tempat dengan jenis karang terbanyak di dunia!',
    ],
  },
  {
    id: 'padang-lamun',
    title: 'Padang lamun',
    label: '10 – 20 m',
    depth: [9, 16],
    set: 'lamun',
    ride: 'selam',
    lines: [
      'Sekarang kita tiba di padang lamun. Lamun adalah tumbuhan berbunga yang hidup di dalam laut.',
      'Padang lamun menjadi tempat berlindung dan mencari makan. Lihat kuda laut yang berpegangan pada lamun dengan ekornya, dan ikan kakatua yang giginya mirip paruh burung.',
      'Itu ikan lionfish. Siripnya indah, tetapi durinya beracun, jadi jangan disentuh ya. Dan itu ikan pari yang bersembunyi di pasir.',
    ],
  },
  {
    id: 'dinding-karang',
    title: 'Dinding karang',
    label: '20 – 40 m',
    depth: [16, 34],
    set: 'dinding',
    ride: 'selam',
    lines: [
      'Kita turun menyusuri dinding karang yang curam, seperti tebing di dalam laut.',
      'Di sini kita bisa melihat hewan yang lebih besar. Ada rombongan ikan barakuda yang berenang berbaris, dan hiu karang yang sedang berpatroli.',
      'Hiu karang biasanya tidak mengganggu penyelam yang tenang. Kita cukup mengamati dari jauh, ya.',
    ],
  },
  {
    id: 'laut-biru',
    title: 'Laut biru',
    label: '40 – 80 m',
    depth: [34, 70],
    set: 'biru',
    ride: 'selam',
    lines: [
      'Sekarang di sekeliling kita hanya ada laut biru yang luas, seolah tidak ada ujungnya.',
      'Lihat pari manta yang besar itu! Lebar tubuhnya bisa lebih dari empat meter. Ada juga rombongan ikan tuna yang berenang cepat, dan ubur-ubur yang melayang pelan.',
    ],
  },
  {
    id: 'makin-redup',
    title: 'Laut makin redup',
    label: '80 – 200 m',
    depth: [70, 180],
    set: 'redup',
    ride: 'selam',
    lines: [
      'Makin dalam, cahaya matahari makin redup dan warna-warna memudar. Warna merah menghilang paling dulu.',
      'Kita nyalakan senter. Lihat, ada cumi-cumi, dan ubur-ubur yang bercahaya!',
      'Hewan-hewan di sini pandai hidup dengan cahaya yang sangat sedikit.',
    ],
  },
  {
    id: 'batas-aman',
    title: 'Batas aman penyelam',
    label: '± 200 m',
    depth: [180, 200],
    set: 'kapal-selam',
    ride: 'selam',
    lines: [
      'Tahukah kamu? Penyelam sungguhan hanya aman menyelam sampai sekitar empat puluh meter. Di petualangan ini kita sudah turun jauh lebih dalam.',
      'Untuk melanjutkan, kita pindah ke kapal selam mini. Kapal selam ini dibuat sangat kuat untuk menahan tekanan air, lengkap dengan lampu terang dan jendela kaca yang tebal.',
    ],
  },
  {
    id: 'zona-senja',
    title: 'Zona senja',
    label: '200 – 1.000 m',
    depth: [200, 900],
    set: 'senja',
    ride: 'kapal-selam',
    lines: [
      'Kita masuk zona senja. Cahaya matahari yang sampai ke sini tinggal sedikit sekali, dan airnya makin dingin.',
      'Itu ikan lentera, tubuhnya dihiasi titik-titik cahaya. Ada ikan kapak yang tipis dan berkilau perak, dan ikan naga yang bergigi tajam dengan lampu kecil di bawah dagunya.',
      'Banyak hewan di sini naik ke dekat permukaan pada malam hari untuk mencari makan, lalu turun lagi saat siang.',
    ],
  },
  {
    id: 'bioluminesensi',
    title: 'Cahaya di laut gelap',
    label: '1.000 – 2.000 m',
    depth: [900, 1800],
    set: 'cahaya',
    ride: 'kapal-selam',
    lines: [
      'Lebih dari seribu meter di bawah permukaan, cahaya matahari sama sekali tidak ada. Gelap gulita!',
      'Tapi lihat, banyak hewan membuat cahayanya sendiri. Ini namanya bioluminesensi.',
      'Ikan pemancing punya umpan bercahaya di kepalanya untuk memikat mangsa. Ada ubur-ubur sisir yang berkilau pelangi, belut gulper yang mulutnya sangat besar, dan sifonofor yang panjang seperti rangkaian lampu.',
    ],
  },
  {
    id: 'ventilasi',
    title: 'Ventilasi hidrotermal',
    label: '2.000 – 3.000 m',
    depth: [1800, 2600],
    set: 'ventilasi',
    ride: 'kapal-selam',
    lines: [
      'Di dasar laut ada cerobong-cerobong yang menyemburkan air sangat panas dan kaya mineral. Karena semburannya hitam seperti asap, cerobong ini disebut perokok hitam.',
      'Airnya bisa jauh lebih panas daripada air mendidih, tetapi tidak mendidih karena tekanan di sini sangat besar.',
      'Walau tanpa cahaya matahari, ada kehidupan di sini: cacing tabung berujung merah, kepiting, dan udang. Mereka hidup berkat bakteri yang mendapat tenaga dari zat kimia.',
    ],
  },
  {
    id: 'dataran-abisal',
    title: 'Dataran abisal',
    label: '3.000 – 4.000 m',
    depth: [2600, 3800],
    set: 'abisal',
    ride: 'kapal-selam',
    lines: [
      'Kita tiba di dataran abisal, hamparan dasar laut yang sangat luas, dingin, gelap, dan tenang.',
      'Makanan di sini sangat sedikit, jadi hewan-hewannya bergerak lambat untuk menghemat tenaga.',
      'Lihat ikan tripod yang berdiri di atas tiga sirip panjang, teripang laut dalam, dan bintang rapuh yang lengannya lentur.',
    ],
  },
  {
    id: 'palung-laut',
    title: 'Palung laut',
    label: '6.000 m +',
    depth: [3800, 6500],
    set: 'palung',
    ride: 'kapal-selam',
    lines: [
      'Inilah salah satu bagian terdalam di Bumi: palung laut, lebih dari enam ribu meter di bawah permukaan.',
      'Tekanan air di sini ratusan kali lebih besar daripada di permukaan. Airnya sangat dingin, dan tidak ada cahaya matahari sama sekali.',
      'Palung terdalam di dunia, Palung Mariana, dalamnya hampir sebelas ribu meter!',
    ],
  },
  {
    id: 'biota-palung',
    title: 'Biota palung',
    label: '6.000 m +',
    depth: [6500, 6500],
    set: 'palung',
    ride: 'kapal-selam',
    lines: [
      'Meski tampak asing, ternyata ada kehidupan di palung laut.',
      'Ini ikan siput hadal. Tubuhnya lunak dan agak tembus pandang, dan tubuh lunak itu justru membantunya bertahan di bawah tekanan yang sangat besar.',
      'Ada juga amfipoda, hewan kecil mirip udang yang berkerumun mencari makanan, serta teripang yang merayap pelan di dasar.',
    ],
  },
  {
    id: 'misi-selesai',
    title: 'Misi selesai',
    label: '6.000 m +',
    depth: [6500, 6500],
    set: 'selesai',
    ride: 'kapal-selam',
    lines: [
      'Hore, misi selesai! Kita sudah menjelajahi laut dari permukaan sampai palung yang terdalam.',
      'Setiap penemuan membuat kita makin mengenal laut, dan makin tahu kenapa laut perlu dijaga.',
    ],
  },
  {
    id: 'ringkasan',
    title: 'Ringkasan zona laut',
    label: 'Kembali ke permukaan',
    depth: [6500, 0],
    set: 'ringkasan',
    ride: 'kapal-selam',
    lines: [
      'Ayo kita ingat lagi perjalanan kita: terumbu karang dan padang lamun yang terang, laut biru yang luas, zona senja yang redup, laut dalam yang gelap tetapi penuh cahaya hewan, dasar laut yang dingin, sampai palung terdalam.',
      'Semua bagian laut saling terhubung. Laut yang sehat, masa depan yang hebat. Ayo jaga laut dan jangan buang sampah ke laut. Sampai jumpa di petualangan berikutnya!',
    ],
  },
];

/** Tangga zona untuk ringkasan (mengikuti storyboard, dengan istilah yang akurat). */
export const ZONA_LAUT: { depth: string; name: string; note: string }[] = [
  { depth: '0 m', name: 'Permukaan', note: 'Cahaya matahari, awal kehidupan' },
  { depth: '0 – 10 m', name: 'Terumbu karang', note: 'Penuh warna dan kehidupan' },
  { depth: '10 – 20 m', name: 'Padang lamun', note: 'Tempat berlindung dan mencari makan' },
  { depth: '20 – 40 m', name: 'Dinding karang', note: 'Rumah banyak jenis hewan' },
  { depth: '40 – 200 m', name: 'Laut biru', note: 'Laut terbuka yang luas' },
  { depth: '200 – 1.000 m', name: 'Zona senja', note: 'Cahaya tinggal sedikit' },
  { depth: '1.000 – 4.000 m', name: 'Laut dalam', note: 'Gelap, hewan membuat cahaya sendiri' },
  { depth: '2.000 m +', name: 'Ventilasi hidrotermal', note: 'Hidup dari panas & zat kimia bumi' },
  { depth: '3.000 – 6.000 m', name: 'Dataran abisal', note: 'Dasar laut luas dan dingin' },
  { depth: '6.000 m +', name: 'Palung laut', note: 'Bagian terdalam, tekanan ekstrem' },
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
  { id: 'ikan-kakatua', name: 'Ikan Kakatua', stop: 'padang-lamun', desc: 'Ikan berwarna-warni dengan gigi menyatu seperti paruh burung.', fact: 'Ikan kakatua menggerogoti karang mati, dan kotorannya menjadi pasir putih.' },
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

export interface LautAudioPart {
  src: string;
  first: number;
  /** detik mulai tiap adegan (dari timestamp rekaman) */
  cues: number[];
}

/** Narasi tur: SATU file suara. Kosong = belum ada rekaman (adegan memakai waktu baca, teks tampil kecil). */
export const TUR_LAUT_AUDIO: LautAudioPart[] = [
  {
    // Suara "Sulafat" (SuaraKisah), 6:15. Waktu mulai tiap adegan dari timestamp per kata + jeda hening rekaman.
    src: '/laut/voice/tur-01.m4a',
    first: 0,
    cues: [0, 27.95, 43.25, 75, 100.73, 122.23, 141, 160, 181.59, 207, 234, 266.37, 288, 313.27, 334.91, 346.55],
  },
];

/** Lama adegan tanpa rekaman: waktu baca (±14 karakter/detik) + jeda. */
export const lautDwell = (s: LautStop) => Math.max(7, s.lines.join(' ').length / 14 + 2);

/** Kedalaman (m) → ketinggian dunia 3D (dipadatkan: laut dalam tidak perlu digambar 1:1). */
export const depthToY = (d: number) => -10 * Math.pow(Math.max(0, d), 0.6);
export const yToDepth = (y: number) => Math.pow(Math.max(0, -y) / 10, 1 / 0.6);
