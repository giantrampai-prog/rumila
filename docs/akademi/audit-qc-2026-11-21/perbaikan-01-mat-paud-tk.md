# Perbaikan 01: MAT PAUD, TK A, TK B

Sumber: temuan-01-mat-paud-tk.md. Hanya JSON paket yang disentuh; berkas kode (mesin/presenter) tidak diubah. Setiap paket yang diubah naik versi patch.

## Diterapkan

| keparahan | paket | apa yang diubah |
|---|---|---|
| SEDANG | kolam-ikan-lebih-banyak | r9 → ikan-hias-1 vs ikan-hias-4 (✓4); r13 → ikan-buntal-4 vs ikan-buntal-1 (✓4). Akibatnya hanya 9 kunci jawaban unik (promptKey+correct; 3 jenis × benar 3/4/5), jadi rounds 10 → 9 agar audit soal-berulang lulus. |
| SEDANG | piring-kue-lebih-banyak | r9 → mangkuk-1 vs mangkuk-4 (✓4); r13 → donat-5 vs donat-2 (✓5). rounds 10 → 9 (alasan sama). |
| SEDANG | hitung-kerang-pantai | barang ⭐ "bintang laut" diganti 🐢 "penyu" (id/labelKey penyu; EN turtles). |
| KECIL | jari-pembeli-kue, bayar-rupiah-toko-roti | label 🧁 "kue cangkir" → "kue mangkuk" (kubus-kue-toko dan piring-kue sudah "kue mangkuk"). |
| KECIL | baju-beruang-besar-kecil | instruksi ID/EN diganti ("sedang bersiap: sentuh barang yang diminta"). |
| KECIL | kebun-buah-besar-kecil | instruksi "dua buah" → "dua benda" (ID/EN). |
| SEDANG | ular-panjang-pendek | instruksi "Dua ular" → "Dua hewan" (ID/EN); item ikan-panjang/ikan-pendek dan soal r3, r8 dihapus beserta kunci locale "ikan". Sisa 10 soal, rounds 10. |
| SEDANG | bentuk-di-rumah | item gantungan (🪝, tidak dipakai soal) dan kunci locale-nya dihapus. |
| KECIL | bentuk-di-rumah | label ⏰ "jam dinding" → "jam weker" (EN alarm clock). |
| KECIL | bentuk-di-taman | instruksi dipendekkan (ID/EN). |
| KECIL | kebun-bunga-warna | instruksi "bunga dan buah" → "benda" (ID/EN). |
| KECIL | mana-bola-warna, kebun-bunga-warna, kotak-mainan-warna | judul EN memakai ejaan "Colour" seperti instruksinya. |
| KECIL | hitung-bunga-taman | instruksi memakai {Barang} (ID/EN) supaya cocok dengan kupu-kupu. |
| SEDANG | telusur-angka-peti-harta | knob max 1–9/def 9 → 5–5/def 5 (angka 1–5 sesuai kompetensi; angka 0 tak lagi ikut). |
| KECIL | telusur-angka-peti-pantai | instruksi tidak lagi menyebut "angka 1 sampai 5" dan "peti kayu" (ID/EN). Label peti-kayu dibiarkan (keputusan). |
| SEDANG | pensil-pendek-ke-panjang, ular-pendek-ke-panjang | instruksi "Susun pensil/ular" → "Susun benda" (ID/EN). |
| SEDANG | jungkat-jungkit-berat | semangka value 8 → 9, batu 9 → 8 (urutan item ikut nilai). Pasangan tipuan balon–batu tetap ada. |
| SEDANG | rak-bentuk-ruang-dapur | item susu (🧃 balok) dan kunci locale-nya dihapus; kubus masih punya es batu dan kado. |
| SEDANG | rak-bentuk-ruang-dapur, rak-bentuk-ruang-mainan | emoji rak bola ⚪ → 🏐. |
| KECIL | menara-balok-bola | instruksi tanpa "empat tingkat" (ID/EN). |
| KECIL | jengkal-benda-kelas | label 🎹 "keyboard musik" → "piano mainan" (EN toy piano). |
| KECIL | celengan-pecahan-uang | judul "Lima Celengan" → "Celengan Uang" (EN Money Piggy Banks). |
| KECIL | laci-uang-warung | instruksi EN "each coin or note" → "each note". |
| SEDANG | bayar-koin-kantin-sekolah | 🍢 "tahu goreng" → "sate" (id sate), 🥟 "bakwan" → "pastel" (id pastel), 🧋 → 🍵 dengan label tetap "teh manis". |
| KECIL | hitung-biji-kebun-11-20 | instruksi memakai {Barang} (ID/EN) dan ditutup "ke jumlahnya". |
| SEDANG | lanjutkan-hitungan-sampai-10 | urutan "Lanjutkan dari 1" dihapus (kunci dari1 dan n2 ikut dihapus). Titik mulai 2–7 sudah terpakai semua, jadi rounds 7 → 6 (= jumlah urutan). |
| KECIL | lanjutkan-hitungan-sampai-20 | instruksi tanpa "sampai dua puluh" (ID/EN). |
| KECIL | lengkapi-koin-lima-kantin | judul "Genap Lima" → "Pas Lima", instruksi "genap lima" → "pas lima". |
| KECIL | lengkapi-koin-lima-pasar | judul "Genap Lima di Pasar" → "Pas Lima di Pasar". |
| SEDANG | bagi-ikan-dua-kucing | knob max 4–12/def 12 → 4–8/def 8. Akibatnya hanya 8 soal unik (2 benda × target 2/4/6/8), jadi rounds 10 → 8. |
| KECIL | bagi-ikan-laut-adil | instruksi tanpa daftar "2, 4, 6, atau 8" (ID/EN). |
| KECIL | tukar-uang-bank-mini | "teller" → "petugas" (ID; EN tetap teller). |
| SEDANG | bayar-rupiah-alat-tulis | barang 🩹 "penghapus" → 📏 "penggaris" (id penggaris, price 2000). |
| KECIL | kasir-kembalian-warung | 🫙 "minyak goreng" → "selai" (id selai; EN jam). |
| KECIL | putar-jarum-kegiatan-hari | "pukul N" dibuang dari 12 label ID dan "at N o'clock" dari label EN. |
| SEDANG | jengkal-meja-dapur | label 🧣 → "syal", 🍽️ → "piring", 🪵 → "kayu bakar", 🍴 → "garpu dan pisau" (EN scarf/plate/firewood; fork and knife tetap). |
| KECIL | jengkal-tali-halaman | label 🧵 "selang air" → "benang" (EN thread). |
| KECIL | penggaris-kubus-meja | label 🪄 "tongkat kayu" → "tongkat sihir" (EN magic wand); instruksi "ujung satunya" → "ujung yang lain". |

## Kalimat suara berubah (WAJIB lengkap)

Catatan: "(tidak ada)" = kunci baru, "(dihapus)" = kunci dihapus. Instruksi hitung-bunga-taman dan hitung-biji-kebun-11-20 sekarang berupa templat {Barang}, jadi rekamannya mengikuti mekanisme templat yang sudah ada (mis. hitung-kerang-pantai).

| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| hitung-kerang-pantai | bintang | bintang laut | (dihapus) |
| hitung-kerang-pantai | penyu | (tidak ada) | penyu |
| jari-pembeli-kue | kuecangkir | kue cangkir | kue mangkuk |
| bayar-rupiah-toko-roti | kuecangkir | kue cangkir | kue mangkuk |
| baju-beruang-besar-kecil | instruksi | Beruang besar dan beruang kecil mau berpakaian: sentuh yang diminta. | Beruang besar dan beruang kecil sedang bersiap: sentuh barang yang diminta. |
| kebun-buah-besar-kecil | instruksi | Di kebun ada dua buah yang sama: sentuh yang lebih besar atau lebih kecil sesuai permintaan. | Di kebun ada dua benda yang sama: sentuh yang lebih besar atau lebih kecil sesuai permintaan. |
| ular-panjang-pendek | instruksi | Dua ular berjemur sejajar: sentuh yang lebih panjang atau lebih pendek sesuai permintaan. | Dua hewan berjemur sejajar: sentuh yang lebih panjang atau lebih pendek sesuai permintaan. |
| ular-panjang-pendek | ikan | ikan | (dihapus) |
| bentuk-di-rumah | gantungan | gantungan baju | (dihapus) |
| bentuk-di-rumah | jam | jam dinding | jam weker |
| bentuk-di-taman | instruksi | Robot sedang piknik di taman. Dengarkan bentuk yang disebut, lalu sentuh benda di dekat robot yang bentuknya itu. | Dengarkan bentuk yang disebut, lalu sentuh benda di taman yang bentuknya sama. |
| kebun-bunga-warna | instruksi | Masukkan tiap bunga dan buah dari kebun ke keranjang yang warnanya sama. | Masukkan tiap benda dari kebun ke keranjang yang warnanya sama. |
| hitung-bunga-taman | instruksi | Bunga di taman tersebar: sentuh satu per satu sambil menghitung, lalu geser penanda ke jumlahnya. | {Barang} di taman tersebar: sentuh satu per satu sambil menghitung, lalu geser penanda ke jumlahnya. |
| telusur-angka-peti-pantai | instruksi | Ada peti kayu terdampar di pantai. Telusuri angka 1 sampai 5 dengan jarimu mengikuti panah supaya petinya terbuka. | Ada peti terdampar di pantai. Telusuri angkanya dengan jarimu mengikuti panah supaya peti terbuka. |
| pensil-pendek-ke-panjang | instruksi | Susun pensil dari yang paling pendek ke yang paling panjang. | Susun benda dari yang paling pendek ke yang paling panjang. |
| ular-pendek-ke-panjang | instruksi | Susun ular dari yang paling pendek ke yang paling panjang. | Susun benda dari yang paling pendek ke yang paling panjang. |
| rak-bentuk-ruang-dapur | susu | kotak susu | (dihapus) |
| menara-balok-bola | instruksi | Bangun menara empat tingkat, ketuk benda yang bisa ditumpuk. | Bangun menara, ketuk benda yang bisa ditumpuk. |
| jengkal-benda-kelas | pianika | keyboard musik | piano mainan |
| celengan-pecahan-uang | judul | Lima Celengan | Celengan Uang |
| bayar-koin-kantin-sekolah | tahu | tahu goreng | (dihapus) |
| bayar-koin-kantin-sekolah | sate | (tidak ada) | sate |
| bayar-koin-kantin-sekolah | bakwan | bakwan | (dihapus) |
| bayar-koin-kantin-sekolah | pastel | (tidak ada) | pastel |
| hitung-biji-kebun-11-20 | instruksi | Biji dan daun berserakan di kebun: sentuh satu per satu sambil menghitung, lalu geser penanda. | {Barang} berserakan di kebun: sentuh satu per satu sambil menghitung, lalu geser penanda ke jumlahnya. |
| lanjutkan-hitungan-sampai-10 | dari1 | Lanjutkan dari 1 | (dihapus) |
| lanjutkan-hitungan-sampai-10 | n2 | 2 | (dihapus) |
| lanjutkan-hitungan-sampai-20 | instruksi | Robot sudah sampai angka ini: susun kartu berikutnya sampai dua puluh. | Robot sudah sampai angka ini: susun kartu angka berikutnya. |
| lengkapi-koin-lima-kantin | judul | Genap Lima di Kantin | Pas Lima di Kantin |
| lengkapi-koin-lima-kantin | instruksi | Teman robot menunjukkan koinnya sekejap: tambahkan koin dari laci supaya genap lima. | Teman robot menunjukkan koinnya sekejap: tambahkan koin dari laci supaya pas lima. |
| lengkapi-koin-lima-pasar | judul | Genap Lima di Pasar | Pas Lima di Pasar |
| bagi-ikan-laut-adil | instruksi | Nelayan pulang membawa 2, 4, 6, atau 8 ikan laut. Bagi semuanya ke dua piring kucing sampai sama banyak. | Nelayan pulang membawa ikan laut. Bagi semuanya ke dua piring kucing sampai sama banyak. |
| tukar-uang-bank-mini | instruksi | Robot jadi teller bank mini: tukar uang kertas pembeli dengan koin seribu yang nilainya sama. | Robot jadi petugas bank mini: tukar uang kertas pembeli dengan koin seribu yang nilainya sama. |
| bayar-rupiah-alat-tulis | penghapus | penghapus | (dihapus) |
| bayar-rupiah-alat-tulis | penggaris | (tidak ada) | penggaris |
| kasir-kembalian-warung | minyak | minyak goreng | (dihapus) |
| kasir-kembalian-warung | selai | (tidak ada) | selai |
| putar-jarum-kegiatan-hari | bangun-tidur | bangun tidur pukul 6 | bangun tidur |
| putar-jarum-kegiatan-hari | berangkat-sekolah | berangkat sekolah pukul 7 | berangkat sekolah |
| putar-jarum-kegiatan-hari | istirahat | istirahat pukul 10 | istirahat |
| putar-jarum-kegiatan-hari | makan-siang | makan siang pukul 12 | makan siang |
| putar-jarum-kegiatan-hari | mandi-sore | mandi sore pukul 4 | mandi sore |
| putar-jarum-kegiatan-hari | tidur-malam | tidur malam pukul 8 | tidur malam |
| putar-jarum-kegiatan-hari | menggambar | menggambar pukul 9 | menggambar |
| putar-jarum-kegiatan-hari | pulang-sekolah | pulang sekolah pukul 11 | pulang sekolah |
| putar-jarum-kegiatan-hari | tidur-siang | tidur siang pukul 1 | tidur siang |
| putar-jarum-kegiatan-hari | membaca-buku | membaca buku pukul 2 | membaca buku |
| putar-jarum-kegiatan-hari | main-sepeda | main sepeda pukul 3 | main sepeda |
| putar-jarum-kegiatan-hari | minum-susu | minum susu pukul 5 | minum susu |
| jengkal-meja-dapur | taplak | taplak meja | syal |
| jengkal-meja-dapur | nampan | nampan | piring |
| jengkal-meja-dapur | talenan | talenan | kayu bakar |
| jengkal-meja-dapur | garpu | sendok garpu | garpu dan pisau |
| jengkal-tali-halaman | selang | selang air | benang |
| penggaris-kubus-meja | penggaris-kayu | tongkat kayu | tongkat sihir |
| penggaris-kubus-meja | instruksi | Sejajarkan ujung benda dengan kubus nomor satu, lalu baca nomor di ujung satunya. | Sejajarkan ujung benda dengan kubus nomor satu, lalu baca nomor di ujung yang lain. |

## Ditolak (bukan masalah)

| temuan | alasan |
|---|---|
| jungkat-jungkit-berat / timbangan-pasar-buah: knob tipuan=0 tetap memakai pasangan tipuan | Ini bug kode di simulasi.ts dan dikerjakan agen kode, bukan isi JSON. Nilai item sudah dicek: balon–batu tetap terdeteksi sebagai pasangan tipuan setelah nilai semangka dan batu ditukar. |
| gabung-bebek-kolam, gabung-keranjang-buah: itemsMax tidak dibaca | Bug mesin dagang.ts (agen kode). |
| ikan-kolam-sisa, kue-piring-sisa: itemsMax tidak dibaca / benda utama acak | Bug mesin dagang.ts (agen kode). |

## Butuh keputusan owner

| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| SEDANG | pensil-/ular-panjang-pendek, pensil-/ular-pendek-ke-panjang | Emoji miring/melingkar (✏️ 🖍️ 🥄 🪥 🖌️ 🐍) dipanjangkan dengan scaleX dan tidak sejajar garis dasar. | Ganti ke emoji mendatar (🚃 🚌 🥖 🪱 🐛 📏) atau aset yang sudah diputar; perlu cek visual. |
| SEDANG | kotak-pos-bentuk / MAT.PAUD.BENTUK-DASAR.01 | Catatan kompetensi minta knob rotasi, tetapi paket tidak punya. | Tambah knob rotasi (butuh dukungan mesin) atau hapus kalimat itu dari catatan kompetensi. |
| SEDANG | bentuk-di-rumah, bentuk-di-taman / MAT.PAUD.BENTUK-DASAR.02 | Benda bangun ruang (bola, jeruk, kado, kardus, dadu) dipakai untuk bangun datar. | Ganti dengan benda datar (piring, koin, roda, jendela, bingkai, wafel, kotak bekal) dan susun ulang soal. |
| SEDANG | mana-bola-warna, mana-topi-warna / MAT.PAUD.WARNA.01 | 6 dari 10 soal menanyakan warna di luar empat warna kompetensi. | Batasi ke 4 warna, atau perluas kompetensi/buat kompetensi pengaya. |
| SEDANG | kebun-bunga-warna, kotak-mainan-warna / MAT.PAUD.WARNA.02 | Kunci warna bergantung pada warna font emoji (color diabaikan). | Tunggu perbaikan presenter (agen kode), lalu cek di perangkat target; atau pakai shape+color. |
| SEDANG | telusur-angka-peti-harta | 🧰 adalah kotak perkakas, bukan peti harta. | Aset peti sendiri, atau label "kotak perkakas" (mengubah cerita). |
| SEDANG | telusur-angka-peti-pantai | 📦 adalah kardus, bukan peti kayu. | Aset peti kayu, atau label "kotak kardus". |
| SEDANG | jengkal-benda-kelas, jengkal-sayur-kebun, jengkal-meja-dapur, jengkal-tali-halaman | Ukuran jengkal tidak konsisten antarpaket dan tidak realistis. | Selaraskan ke jengkal anak ±12–15 cm, satu benda satu nilai di semua paket. |
| KRITIS | celengan-pecahan-uang, laci-uang-warung / MAT.TKA.UANG-KENAL.01 | Pecahan hanya dibedakan warna (diabaikan presenter); 💵 adalah dolar. | Dibiarkan sesuai arahan: agen kode akan menampilkan warna. Tetap disarankan aset rupiah atau angka nominal tercetak. |
| SEDANG | celengan-pecahan-uang | Koin Rp1.000 diberi warna kuning, padahal yang beredar perak. | Warna perak untuk kedua koin, dibedakan dengan ukuran/angka (bergantung pada keputusan aset di atas). |
| SEDANG | bayar-koin-*, bayar-rupiah-*, kasir-kembalian-* | Mesin memakai knob harga, bukan price barang. | Dikerjakan agen kode (lihat catatan audit di bawah). |
| KRITIS | kue-piring-sisa | Presenter ModeSisa menulis mati kolam/ikan/pelet. | Dikerjakan agen kode; bila presenter belum siap, sembunyikan paket. |
| SEDANG | bagi-ikan-laut-adil | Ikan buntal beracun dijadikan makanan kucing. | Ganti dengan ikan lain (mis. ikan kembung 🐟 sudah dipakai tongkol) atau 🦐 udang (judul "Ikan Laut" perlu disesuaikan). |
| SEDANG | mesin-tukar-koin / MAT.TKB.UANG-10RB.01 | Default harga 12 terlalu sulit; arah tukar koin → lembar tidak ada di paket mana pun. | Default harga 5; arah sebaliknya butuh mode/mesin baru. |
| SEDANG | alat-ukur-hewan-laut, klinik-hewan-alat-ukur / MAT.TKB.UKUR-NONSTANDAR.03 | Pertanyaan ditentukan value hewan, jadi pencocokan 1:1. | Acak pertanyaan per ronde (butuh perubahan mesin). |
| SEDANG | turus-hewan-pulang-kandang / MAT.TKB.DATA.01 | 🐷 babi berpotensi sensitif. | Ganti 🐐 kambing atau 🐄 sapi. |

## Hasil validasi

- `npx tsx packages/schema/src/cli.ts`: 810 paket valid, 0 error kurikulum.
- `npm run -s akademi:audit`: tiga ERROR soal-berulang yang muncul akibat perbaikan ini (kolam-ikan, piring-kue, bagi-ikan-dua-kucing) sudah dibereskan dengan menurunkan rounds. Tersisa 8 ERROR `soal-berulang-satu-sesi` di paket dagang (bayar-koin-kantin-sekolah, bayar-koin-warung, bayar-rupiah-alat-tulis, bayar-rupiah-toko-roti, kasir-kembalian-toko-mainan, kasir-kembalian-warung, ikan-kolam-sisa, kue-piring-sisa). ERROR ini baru muncul setelah agen kode mengubah `packages/mechanics/src/dagang.ts` (bayar/kembalian kini memakai price barang, sisa membaca itemsMax), sehingga jumlah soal unik = jumlah barang. Penanganannya (menambah barang atau menurunkan rounds) perlu dikoordinasikan dengan agen kode setelah mesinnya final. Perubahan isi saya di paket-paket itu hanya mengganti nama/emoji barang dan tidak mengubah jumlah barang.
