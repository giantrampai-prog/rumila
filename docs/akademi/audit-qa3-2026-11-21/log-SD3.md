# QA putaran 3 — SD3 (MAT, SAINS, KODE)

Peninjau: agen SD3. Bahan: `qa3/dump/{MAT,SAINS,KODE}-SD3.txt`, lalu dicek ke JSON asli dan `benda.tsx` (aturan latar warna, kisi `count`, bentuk yang tersedia).
Semua kunci soal pilih dan penempatan rak di 96 paket dihitung ulang (nilai tempat, tambah-kurang menyimpan/meminjam, kotak tersembunyi, bagi, pecahan, pembulatan, Carroll, simetri huruf/kata, sudut jam, keliling/luas). **Tidak ada kunci atau hitungan yang salah.**

## 1. Tabel temuan

| jenis | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| visual | sd3-mat-urut-pecahan | `scale` kartu di urutan | Kartu pecahan satuan digambar makin kecil sesuai nilainya (1/10 dan 1/8 = 0.7, 1/6 = 0.75, lainnya 0.85). Ukuran tulisan membocorkan urutan dan melemahkan jebakan kompetensi ("1/10 dianggap terbesar karena angka 10"). | diperbaiki: semua kartu `scale` 0.85 (sama dengan sd3-mat-pita-pecahan-tertukar) |
| tidak-sesuai | sd3-mat-jadwal-tertukar | s43 | "menggambar tokoh" (aturan: tanpa "tokoh") | diperbaiki: "11.00 menggambar karakter cerita" / EN "draw a story character" |
| visual | sd3-mat-pilih-satuan-ukur | item galon | 💧 dipakai untuk "setetes air" (rak ml) dan "air galon" (rak l): dua kartu tampak sama, jawabannya beda | diperbaiki: galon → 🫙 |
| visual | sd3-mat-pilih-satuan-ukur | i-berat-labu | 🎃 labu Halloween berwajah (owner sudah memutuskan mengganti 🎃 di SD1) | diperbaiki: "berat kelapa" 🥥 (tetap rak kg) |
| visual | sd3-sains-rak-alat-ukur | i-labu | 🎃 sama seperti di atas | diperbaiki: "seberapa berat kelapa?" 🥥 (tetap timbangan) |
| visual | sd3-mat-segi-banyak-beraturan | item ketupat | "belah ketupat" satu-satunya kartu tanpa gambar (teks besar di antara bangun bergambar), padahal `shape: "belah-ketupat"` kini ada | diperbaiki: `shape: "belah-ketupat"`, warna #a78bfa |
| ambigu | sd3-sains-pilih-alat-ukur | t-ulat | "Seberapa panjang ulat di daun ini?" merujuk "ini" padahal tidak ada gambar ulat di layar | diperbaiki: "Seberapa panjang ulat yang merayap di daun?" |
| visual | sd3-sains-perbaiki-siklus-hidup-kebun | kupu-kepompong | 🛡️ (perisai) untuk "kepompong menggantung"; `color` tidak mewarnai emoji | diperbaiki: `shape: "rect"` #a1887f scale 0.7 (seperti kepompong kepik/lebah/kumbang) |
| visual | sd3-sains-perbaiki-siklus-hidup-kebun | semut-kepompong | 🥜 (kacang tanah) untuk "kepompong semut" | diperbaiki: `shape: "rect"` #f5e6c8 scale 0.6 |
| visual | sd3-sains-hidup-pernah-tidak-pernah-rumah | i-ranting | 🥢 (sumpit) untuk "ranting kering" | diperbaiki: 🪵 scale 0.7 (rak tetap "pernah hidup") |
| visual | sd3-sains-hidup-pernah-tidak-pernah-rumah, sd3-sains-padat-cair-gas-halaman, sd3-sains-larut-atau-tidak, sd3-sains-rak-alat-pemisah | item kelereng | 🔮 adalah bola kristal peramal (ungu, berdudukan), bukan kelereng | diperbaiki: 🔵 di keempat paket |
| ambigu | sd3-sains-larut-mengendap-lab | instruksi | Rak larut dijelaskan "hilang dari pandangan", tetapi kopi instan dan pewarna makanan (kunci: larut) membuat air berwarna/gelap, jadi bisa dikira "tetap terlihat" | diperbaiki: "larut (butirannya hilang, walau airnya bisa berwarna) atau tidak larut (butirannya tetap terlihat atau mengendap)" |
| ambigu | sd3-sains-tembus-pandang-cahaya-tidak | instruksi | Instruksi menyebut tiga kategori (jelas, buram, tidak terlihat) padahal `binCount` default 2 (rak tembus cahaya tidak tampil) — pola yang sama diperbaiki di putaran sebelumnya | diperbaiki: "Seberapa jelas benda di baliknya terlihat? Taruh ke rak yang cocok." |
| tidak-sesuai | sd3-sains-perbaiki-rantai-makanan, sd3-sains-susun-rantai-makanan | s-lautlepas | Rumput laut sebagai produsen "laut lepas" (hidup di laut dangkal/pantai). SD4 sejenis sudah diputuskan diperbaiki (putaran 2). | diperbaiki: judul "Rantai makanan di laut dangkal" (isi rantai tetap) |
| visual | sd3-sains-kelompok-hewan-penipu | wadah burung | Ikon wadah burung 🪶 sama persis dengan kartu "burung unta" 🪶 — justru hewan "penipu" (tak bisa terbang) dijawab oleh gambar | diperbaiki: ikon wadah burung → 🐦 |
| visual | sd3-kode-sunting-kartu-percobaan | gunung-1 | 🧺 (keranjang) untuk "siapkan botol kosong di atas nampan" | diperbaiki: 🧴 |
| visual | sd3-sains-kelompok-hewan, -penipu, sd3-sains-fosil-atau-bukan, sd3-sains-temuan-tepi-sungai, sd3-sains-padat-cair-gas-dapur, sd3-sains-hidup-pernah-tidak-pernah-rumah | ikon wadah | Ikon wadah sama dengan emoji salah satu kartunya (🐄 sapi, 🐟 ikan mas/lele, 🦎 kadal/komodo, 🐸 katak, 🐜 semut, 🦴 tulang dinosaurus, 🧊 es batu, 💧 air, 🎈 balon, 🍂 daun kering) | ditolak sebagai perbaikan langsung → Keputusan (sama dengan butir SD4 "emoji wadah sama dengan kartu") |
| visual | sd3-sains-perbaiki-siklus-hidup-air/-kebun | `scale` tahap | Ukuran hewan makin besar per tahap, bisa diurutkan dari ukuran | ditolak: realistis dan label tahap tampil; butir sejenis SD2 sudah ditangani owner terpisah |
| visual | sd3-sains-bayangan-besar-kecil, -perbaiki-urutan-bayangan | emoji | Gambar benda sama dan seukuran di semua kartu | ditolak: disengaja (catatan kompetensi: anak menalar dari posisi, bukan ukuran gambar) |
| ambigu | sd3-sains-licin-sampai-kasar | karpet berbulu vs pasir | urutan bisa diperdebatkan | ditolak: sudah diputuskan di audit sebelumnya |
| ambigu | sd3-sains-pisahkan-campuran | "Paku besi tercampur pasir" | ayakan juga bisa memisahkan | ditolak: ayakan sengaja tidak ada di pilihan soal itu (hanya magnet, saring) |
| ambigu | sd3-kode-daring-luring | i-siaran | siaran langsung bisa lewat antena TV | ditolak: instruksi menyebut kegiatan di ponsel |
| visual | sd3-sains-kelompok-hewan-penipu | belut sawah 🐍 | gambar ular untuk ikan | ditolak: paket "hewan penipu", label tampil, sama dengan opsi audit lalu |
| visual | beberapa (🧴 kotak pensil bening, ⛑️ helm sepeda, 🎋 batang, 🪢 kawat tembaga, 🥛 susu bubuk) | emoji | emoji kurang pas | ditolak: tidak ada emoji yang lebih tepat; label tampil di bawah gambar |
| ambigu | sd3-mat-urut-jadwal-digital | "13.50 makan siang → 13.55 tidur siang" | jeda 5 menit kurang realistis | ditolak: urutan tetap tunggal |

## 2. Kalimat suara berubah

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd3-mat-jadwal-tertukar | s43 | 11.00 menggambar tokoh | 11.00 menggambar karakter cerita |
| sd3-mat-pilih-satuan-ukur | i-berat-labu | berat labu | berat kelapa |
| sd3-sains-rak-alat-ukur | i-labu | seberapa berat labu? | seberapa berat kelapa? |
| sd3-sains-pilih-alat-ukur | t-ulat | Seberapa panjang ulat di daun ini? | Seberapa panjang ulat yang merayap di daun? |
| sd3-sains-larut-mengendap-lab | instruksi | Tiap benda dimasukkan ke segelas air lalu diaduk. Taruh ke rak larut (hilang dari pandangan) atau tidak larut (tetap terlihat atau mengendap). | Tiap benda dimasukkan ke segelas air lalu diaduk. Taruh ke rak larut (butirannya hilang, walau airnya bisa berwarna) atau tidak larut (butirannya tetap terlihat atau mengendap). |
| sd3-sains-tembus-pandang-cahaya-tidak | instruksi | Bayangkan menyinari tiap benda dengan senter. Benda di baliknya terlihat jelas, buram, atau tidak terlihat? Taruh ke raknya. | Bayangkan menyinari tiap benda dengan senter. Seberapa jelas benda di baliknya terlihat? Taruh ke rak yang cocok. |
| sd3-sains-perbaiki-rantai-makanan | s-lautlepas | Rantai makanan di laut lepas | Rantai makanan di laut dangkal |
| sd3-sains-susun-rantai-makanan | s-lautlepas | Rantai makanan di laut lepas | Rantai makanan di laut dangkal |

## 3. Butuh kode
Tidak ada.

## 4. Keputusan
- **Ikon wadah sama dengan emoji kartu** (lihat baris "ditolak → Keputusan"): kelompok hewan (🐄 🐟 🦎 🐸 🐜), fosil (🦴), padat-cair-gas dapur (🧊 💧 🎈), hidup-rumah (🍂). Pilihannya: (a) ganti ikon wadah ke ikon ciri (🍼 menyusui, 🫧 cair, dst.) atau ke hewan yang tidak ada di kartu; (b) biarkan karena kartu-kartu itu memang pengisi yang mudah. Diputuskan bersama butir SD4 yang sama.

## 5. Angka
- Paket diperiksa: **96** (MAT 40, SAINS 36, KODE 20)
- Temuan: **25 baris** (16 diperbaiki, 9 ditolak; 1 dari yang ditolak diteruskan ke Keputusan)
- Berkas paket diubah: **17**, semua versi patch dinaikkan; kalimat suara berubah: **8**
- `akademi:validate`: 810 paket valid · `akademi:audit`: 0 ERROR, 0 WARNING
