import { FRUITS, type Fruit } from './catalog';

/** Spoken text only: stage directions live in the recording guide, never in the audio. */
const prompts: Record<string, [string, string]> = {
  pisang: ['Halo, teman kecil! Ada buah melengkung seperti senyuman. Coba tebak… iya, pisang!', 'Sekarang, putar pisangnya pelan-pelan. Bisa ikuti bentuk lengkungnya dengan jarimu di udara?'],
  mangga: ['Ssst… ada aroma harum dari kebun. Wah, kita bertemu mangga!', 'Coba putar mangganya. Bentuknya bulat sempurna atau sedikit memanjang?'],
  jeruk: ['Bulat, cerah, dan punya kejutan di balik kulitnya. Halo, jeruk!', 'Perbesar jeruknya, yuk. Lihat bintik-bintik kecil di kulitnya. Seperti apa menurutmu?'],
  apel: ['Kres, kres! Bayangkan bunyi menggigit buah yang renyah. Ini dia, apel!', 'Yuk, putar apelnya. Temukan lekukan kecil tempat tangkainya berada!'],
  semangka: ['Wah, buah besar bergaris datang berkunjung. Selamat datang, semangka!', 'Putar semangkanya. Coba ikuti satu garis di kulitnya dari ujung ke ujung. Seru, ya!'],
  melon: ['Ada bola buah di kebun kita! Kenalan, yuk, dengan melon.', 'Perbesar melonnya. Pola di kulit model ini mengingatkanmu pada jaring atau garis?'],
  pepaya: ['Petualang buah, siap menemukan kejutan? Hari ini kita bertemu pepaya!', 'Coba putar pepayanya. Mana yang lebih panjang, tinggi buahnya atau lebarnya?'],
  nanas: ['Taraaa! Ada buah memakai mahkota daun. Kenalkan, ini nanas!', 'Putar nanasnya perlahan. Cari mahkotanya, lalu perhatikan pola kulit di bawahnya!'],
  anggur: ['Satu, dua, tiga… wah, buah-buah kecil berkumpul bersama! Ini anggur.', 'Putar gerombol anggurnya. Pilih tiga buah yang bisa kamu lihat. Sudah ketemu?'],
  stroberi: ['Halo, si merah berbintik! Hari ini kita berkenalan dengan stroberi.', 'Perbesar stroberinya. Cari bintik kecil dan kelopak hijau di bagian atas. Ketemu keduanya?'],
  alpukat: ['Hijau di luar, lembut di dalam. Siapa, ya? Ini alpukat!', 'Coba putar alpukatnya. Perhatikan bagian yang lebar dan bagian yang lebih ramping!'],
  kelapa: ['Bayangkan angin berembus di dekat pohon tinggi. Di sana ada kelapa!', 'Putar kelapanya dari segala arah. Bentuknya bulat sempurna atau sedikit memanjang?'],
  durian: ['Wah, buah ini punya baju berduri! Kita kenalan dengan durian, yuk.', 'Putar model duriannya di layar. Lihat durinya dari dekat! Untuk buah sungguhan, biarkan orang dewasa yang membukanya, ya.'],
  rambutan: ['Hihi, buah ini seperti punya rambut! Kenalkan, namanya rambutan.', 'Perbesar rambut-rambut di kulitnya. Lalu putar rambutan ini. Rambutnya ada di satu sisi atau di sekeliling buah?'],
  manggis: ['Ada si ungu dengan topi hijau! Yuk, kenalan dengan manggis.', 'Putar manggisnya pelan-pelan. Cari kelopak hijau yang menempel di bagian atas!'],
  salak: ['Coba lihat! Buah ini memakai baju bersisik. Namanya salak.', 'Perbesar salaknya. Temukan pola sisiknya, lalu cari ujung buah yang meruncing!'],
  duku: ['Hai, petualang buah! Ada buah kecil berkulit kuning kecokelatan. Ini duku.', 'Putar dukunya. Coba bayangkan buah kecil ini di telapak tanganmu. Bentuk apa yang kamu lihat?'],
  lengkeng: ['Tok, tok! Di balik kulit kecil ini ada kejutan. Kenalkan, lengkeng!', 'Putar lengkengnya. Coba sebutkan warna kulit yang terlihat pada model ini!'],
  'jambu-biji': ['Namanya memberi petunjuk tentang isinya. Ini dia, jambu biji!', 'Putar jambu bijinya. Perhatikan bentuk dan kulitnya. Pernah melihat jambu yang bagian dalamnya merah muda?'],
  'jambu-air': ['Ding, dong! Bentuk buah ini mengingatkan kita pada lonceng. Halo, jambu air!', 'Putar jambu airnya. Coba tunjuk bagian yang lebih lebar. Di atas atau di bawah?'],
  belimbing: ['Bintang dari kebun? Wah, menarik! Yuk, kenalan dengan belimbing.', 'Putar belimbing dari ujungnya. Perhatikan rusuk di sekelilingnya. Mirip bintang, ya!'],
  sawo: ['Kulitnya cokelat, rasanya manis saat matang. Kenalkan, sawo!', 'Putar sawonya pelan-pelan. Coba sebutkan benda lain yang juga berwarna cokelat!'],
  sirsak: ['Petualang buah, lihat si hijau yang unik ini! Namanya sirsak.', 'Perbesar sirsaknya. Temukan tonjolan pendek di kulitnya. Lalu lihat bentuknya dari samping!'],
  nangka: ['Wah, ada buah yang bisa tumbuh besar sekali! Kita berkenalan dengan nangka.', 'Putar nangkanya. Perhatikan kulitnya yang penuh tonjolan kecil. Banyak sekali, ya!'],
  'buah-naga': ['Namanya naga, tetapi ini buah, lho! Yuk, temui buah naga.', 'Putar buah naganya. Cari sisik seperti daun yang mencuat dari kulitnya. Warnanya apa?'],
  markisa: ['Ada buah dengan banyak biji berbalut sari buah. Halo, markisa!', 'Putar markisanya. Lihat warna kulit model ini. Ada juga markisa berkulit kuning, lho!'],
  srikaya: ['Wah, kulitnya seperti tersusun dari kepingan kecil! Ini srikaya.', 'Perbesar srikayanya. Amati kepingan di kulitnya, lalu putar untuk melihat sisi yang lain!'],
  kedondong: ['Siapa yang pernah melihat buah dalam rujak? Salah satunya adalah kedondong!', 'Putar kedondongnya. Bentuknya mengingatkanmu pada bola atau telur?'],
  'jeruk-bali': ['Ada anggota keluarga jeruk yang besar! Kenalan dengan jeruk bali, yuk.', 'Putar jeruk balinya. Bayangkan kulit tebal yang melindungi siung-siung di dalamnya!'],
  'jeruk-nipis': ['Kecil-kecil punya aroma khas! Kita bertemu jeruk nipis hari ini.', 'Perbesar jeruk nipisnya. Cari pori kecil di kulitnya, lalu sebutkan warna yang kamu lihat!'],
  lemon: ['Halo, si kuning cerah! Buah yang satu ini bernama lemon.', 'Putar lemonnya. Coba perhatikan kedua ujungnya. Bentuknya sama dengan bola?'],
  pir: ['Buah ini punya banyak bentuk. Ada yang membulat, ada yang berleher ramping. Ini pir!', 'Putar pir pada layar. Cari bagian yang ramping dan bagian yang lebih lebar!'],
  kiwi: ['Di luar cokelat, di dalam penuh warna. Ada kejutan dari buah kiwi!', 'Putar kiwinya. Bayangkan pola biji kecil yang mengelilingi bagian tengah saat buah ini dibelah!'],
  kurma: ['Halo, si kecil lonjong! Hari ini kita berkenalan dengan kurma.', 'Perbesar kurmanya. Cari kerutan pada kulitnya, lalu lihat bentuknya dari samping!'],
  delima: ['Buah ini menyimpan banyak butiran berair. Wah, kenalkan delima!', 'Putar delimanya. Bisa temukan bagian atas yang menyerupai mahkota kecil?'],
  kesemek: ['Warna jingga dan kelopak lebar, buah apakah ini? Kenalkan, kesemek!', 'Putar kesemeknya. Cari kelopak di atasnya, lalu amati bentuk buah yang agak pipih!'],
  leci: ['Ada buah kecil berkulit merah muda. Yuk, menyapa leci!', 'Perbesar lecinya. Kulitnya terlihat licin atau penuh tonjolan kecil?'],
  plum: ['Halo, buah berkulit halus! Mari berkenalan dengan plum.', 'Putar plumnya. Sebutkan warna pada model ini. Plum juga bisa punya warna lain, lho!'],
  persik: ['Bayangkan kulit buah dengan rambut yang sangat halus. Ini persik!', 'Putar persiknya perlahan. Cari alur di salah satu sisi buah. Sudah terlihat?'],
  cempedak: ['Mirip nangka, tetapi punya nama sendiri. Kenalkan, cempedak!', 'Putar cempedaknya. Perhatikan bentuknya yang memanjang dan pola pada kulitnya!'],
  langsat: ['Ada buah kecil yang sering berkumpul dalam satu rangkaian. Halo, langsat!', 'Putar langsatnya. Amati bentuk lonjongnya. Masih ingat buah duku yang lebih membulat?'],
  matoa: ['Petualangan membawa kita mengenal buah khas Papua. Ini dia, matoa!', 'Putar matoanya. Coba sebutkan warna kulit model ini. Matoa dapat punya warna lain juga, lho!'],
  blewah: ['Ada buah harum yang sering masuk ke minuman segar. Namanya blewah!', 'Putar blewahnya. Ikuti alur di kulit buah dengan matamu, dari atas sampai bawah!'],
  'terong-belanda': ['Bentuknya seperti telur, warnanya cerah. Yuk, temui terong belanda!', 'Putar terong belandanya. Perhatikan ujung dan bagian tengahnya. Mana yang lebih lebar?'],
  ceri: ['Dua buah kecil dengan tangkai panjang. Halo, ceri!', 'Putar cerinya. Ikuti tangkai dari buah sampai ke ujung. Panjang sekali dibandingkan buahnya, ya!'],
  cermai: ['Kecil, beralur, dan rasanya asam. Kenalkan, cermai!', 'Perbesar cermainya. Coba ikuti satu alur di kulitnya, lalu putar untuk melihat alur lainnya!'],
  jamblang: ['Ada buah berwarna ungu sangat gelap. Kenalan dengan jamblang, yuk!', 'Putar jamblangnya. Coba cari sisi yang terkena cahaya agar warna ungunya lebih terlihat!'],
  'jambu-bol': ['Masih keluarga jambu, tetapi punya ciri sendiri. Ini jambu bol!', 'Putar jambu bolnya. Perhatikan bentuk dan warnanya. Apa bedanya dengan jambu air yang kamu kenal?'],
};

export function fruitNarration(f: Fruit): string {
  const [hello, play] = prompts[f.id];
  return `${hello} ${f.description} Daging buahnya berwarna ${f.flesh.toLowerCase()}. Rasanya ${f.taste.toLowerCase()}. ${f.seed} ${f.fact} ${play}`;
}
export const NARRATION_INTRO = 'Halo, petualang kecil! Selamat datang di Kebun Buah Rinoya. Di sini, kita akan berkenalan dengan buah-buahan yang beragam. Ada yang bulat, ada yang panjang, ada yang bermahkota, dan ada juga yang berambut! Pilih satu buah, lalu putar modelnya dengan jarimu. Perhatikan bentuk dan warnanya. Kamu juga bisa mendengarkan ceritanya. Siap memulai petualangan? Yuk, pilih buah pertamamu!';
export const NARRATION_OUTRO = 'Hore, hari ini kita sudah berkenalan dengan buah-buahan! Setiap buah punya bentuk, warna, dan ciri yang berbeda. Buah mana yang paling menarik perhatianmu? Ceritakan kepada orang di rumah, ya. Nanti kita bisa kembali untuk bertemu buah yang lain. Sampai jumpa di Kebun Buah Rinoya!';
export const VOICE_DIRECTION = 'Bacakan dalam bahasa Indonesia sebagai pemandu belajar anak usia 4–9 tahun. Suara hangat, ceria, penasaran, dan tersenyum; tetap alami, tidak berteriak, tidak seperti iklan. Tempo santai sekitar 115–130 kata per menit. Beri jeda pendek antar kalimat dan jeda 1–2 detik setelah pertanyaan atau ajakan mengamati. Tekankan nama buah dan ciri uniknya. Jangan membaca instruksi ini, nama berkas, atau judul. Jangan tambahkan musik, efek suara, atau kata di luar naskah. Baca “kres, kres”, “ding, dong”, dan ungkapan serupa dengan lembut sebagai bagian dari narasi, bukan efek keras.';
export const NARRATION_FILES = FRUITS.map(f => ({id:f.id,name:f.name,file:`${f.id}.mp3`,text:fruitNarration(f)}));
