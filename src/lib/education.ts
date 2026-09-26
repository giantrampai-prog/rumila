import type { ColorKey } from './catalog';

export interface EducationCategory {
  /** Keep existing tool IDs so saved activity still refers to the same subject. */
  id: string;
  name: string;
  icon: string;
  desc: string;
  g: ColorKey;
  topics: string[];
  planned: boolean;
  keywords?: string[];
}

/** Category navigation only. Lessons are built separately, one category at a time. */
export const EDUCATION_CATEGORIES: EducationCategory[] = [
  { id: 'edukasi-profesi', name: 'Profesi', icon: 'work', g: 'orange', desc: 'Kenali pekerjaan dan orang-orang yang membantu kita.', topics: ['Kesehatan', 'Pendidikan', 'Layanan masyarakat', 'Seni & olahraga', 'Teknologi', 'Pertanian & kelautan'], planned: true },
  { id: 'edukasi-kendaraan', name: 'Kendaraan', icon: 'directions_car', g: 'blue', desc: 'Jelajahi kendaraan darat, air, dan udara.', topics: ['Kendaraan darat', 'Kendaraan air', 'Kendaraan udara', 'Kendaraan khusus'], planned: true },
  { id: 'edukasi-buah', name: 'Buah-buahan', icon: 'nutrition', g: 'red', desc: 'Kenali nama, bentuk, warna, dan rasa buah.', topics: ['Buah di sekitar kita', 'Buah Nusantara', 'Bentuk & warna', 'Rasa & bagian buah'], planned: false },
  { id: 'edukasi3', name: 'Hewan', icon: 'pets', g: 'green', desc: 'Temui hewan darat, udara, dan laut.', topics: ['Hewan darat', 'Hewan udara', 'Hewan laut'], keywords: ['Dunia Hewan'], planned: true },
  { id: 'edukasi-negara', name: 'Bendera & Negara', icon: 'flag', g: 'purple', desc: 'Keliling dunia lewat bendera, negara, dan benua.', topics: ['Bendera dunia', 'Negara & ibu kota', 'Benua', 'Tempat terkenal'], planned: true },
  { id: 'edukasi-provinsi', name: 'Provinsi Indonesia', icon: 'map', g: 'teal', desc: 'Jelajahi provinsi dan pulau-pulau di Indonesia.', topics: ['Peta Indonesia', 'Provinsi & ibu kota', 'Pulau-pulau', 'Ciri khas daerah'], planned: true },
  { id: 'edukasi-tumbuhan', name: 'Sayuran & Tumbuhan', icon: 'eco', g: 'lime', desc: 'Kenali sayur, bunga, pohon, dan cara tumbuhnya.', topics: ['Sayur-sayuran', 'Bunga', 'Pohon', 'Bagian tumbuhan', 'Dari biji menjadi tanaman'], planned: true },
  { id: 'edukasi4', name: 'Huruf & Membaca', icon: 'abc', g: 'blue', desc: 'Mulai dari huruf, suku kata, lalu cerita pendek.', topics: ['Huruf A–Z', 'Bunyi huruf', 'Suku kata', 'Kata sederhana', 'Cerita pendek'], keywords: ['Belajar Membaca'], planned: true },
  { id: 'edukasi0', name: 'Angka & Berhitung', icon: 'calculate', g: 'orange', desc: 'Belajar angka, jumlah, pola, dan hitungan sederhana.', topics: ['Mengenal angka', 'Menghitung benda', 'Banyak & sedikit', 'Tambah & kurang', 'Pola & urutan'], keywords: ['Matematika Seru'], planned: true },
  { id: 'edukasi-warna', name: 'Warna & Bentuk', icon: 'category', g: 'pink', desc: 'Bermain dengan warna, bentuk, dan ukuran.', topics: ['Mengenal warna', 'Campuran warna', 'Bentuk datar', 'Bentuk ruang', 'Besar & kecil'], planned: true },
  { id: 'edukasi1', name: 'Bahasa Inggris', icon: 'translate', g: 'indigo', desc: 'Kenali kata dan sapaan sehari-hari dalam bahasa Inggris.', topics: ['Sapaan', 'Angka & warna', 'Keluarga', 'Benda & hewan', 'Percakapan sederhana'], keywords: ['English Fun'], planned: true },
  { id: 'edukasi6', name: 'Tubuh Manusia', icon: 'accessibility_new', g: 'red', desc: 'Buka Jelajah Tubuh 3D dan kenali bagian tubuhmu.', topics: ['Anggota tubuh', 'Pancaindra', 'Organ tubuh', 'Tulang & otot'], keywords: ['Jelajah Tubuh 3D', 'Lab Sains', 'anatomi', 'organ'], planned: false },
  { id: 'edukasi-alam', name: 'Alam & Cuaca', icon: 'partly_cloudy_day', g: 'sky', desc: 'Amati hujan, awan, gunung, sungai, dan laut.', topics: ['Cuaca', 'Air & hujan', 'Gunung & sungai', 'Laut', 'Menjaga lingkungan'], planned: true },
  { id: 'edukasi-waktu', name: 'Waktu & Kalender', icon: 'schedule', g: 'gold', desc: 'Kenali jam, hari, bulan, dan urutan kegiatan.', topics: ['Pagi, siang & malam', 'Membaca jam', 'Hari & minggu', 'Bulan & tahun', 'Urutan kegiatan'], planned: true },
  { id: 'edukasi-sekitar', name: 'Benda & Tempat Sekitar', icon: 'location_city', g: 'teal', desc: 'Jelajahi benda di rumah, sekolah, dan tempat umum.', topics: ['Benda di rumah', 'Perlengkapan sekolah', 'Tempat umum', 'Fungsi benda', 'Aman di sekitar kita'], planned: true },
  { id: 'edukasi-budaya', name: 'Budaya Indonesia', icon: 'diversity_2', g: 'purple', desc: 'Kenali kekayaan budaya dari berbagai daerah.', topics: ['Rumah adat', 'Pakaian adat', 'Tarian daerah', 'Makanan daerah', 'Permainan tradisional'], planned: true },
  { id: 'edukasi-musik', name: 'Musik & Alat Musik', icon: 'music_note', g: 'pink', desc: 'Dengarkan bunyi, kenali alat musik, dan ikuti irama.', topics: ['Bunyi & irama', 'Alat musik petik', 'Alat musik tiup', 'Alat musik pukul', 'Alat musik Nusantara'], planned: true },
  { id: 'edukasi5', name: 'Seni & Menggambar', icon: 'brush', g: 'orange', desc: 'Berkreasi dengan garis, warna, dan berbagai bahan.', topics: ['Garis & pola', 'Menggambar bertahap', 'Mewarnai', 'Lipat kertas', 'Karya dari bahan sekitar'], keywords: ['Menggambar'], planned: true },
  { id: 'edukasi-emosi', name: 'Emosi & Kebiasaan Baik', icon: 'sentiment_satisfied', g: 'green', desc: 'Kenali perasaan, belajar mandiri, dan peduli sesama.', topics: ['Mengenal perasaan', 'Mengungkapkan perasaan', 'Berbagi & bergiliran', 'Merawat diri', 'Kebiasaan sehari-hari'], planned: true },
];
