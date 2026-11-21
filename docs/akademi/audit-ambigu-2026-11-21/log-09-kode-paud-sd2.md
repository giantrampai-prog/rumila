# Log 09 — audit ambigu KODE PAUD, TK A, TK B, SD 1, SD 2

Cakupan: 98 paket (competencyIds[0] KODE.PAUD/TKA/TKB/SD1/SD2): 50 navigasi, 13 pilah, 14 pola, 4 simulasi, 17 urutkan. Semua judul, instruksi, label langkah, kartu, rak, dan benda sudah ditinjau terhadap kompetensinya dan cara kerja mesin (urutkan.ts: susun = semua permutasi, perbaiki = tukar satu pasang berjarak 1 atau 2, label = gambar tampil sudah urut, potong dari depan; pola.ts perbaiki = satu unsur diganti).
Peta navigasi TIDAK diubah; yang berubah di navigasi hanya teks instruksi (program-panjang-jadi-pendek), jadi semua peta tetap terpecahkan. 
Versi patch dinaikkan di 15 paket yang diubah (12 dari audit awal; alat-kelas-macet, keran-macet-minta-tolong, sd2-kode-masukan-keluaran menyusul dari keputusan koordinator; sd2-kode-perangkat-masuk-tampil naik dua kali). Kurikulum KODE-SD2.json: pernyataan dan catatan PERANGKAT.01 diubah. Validasi skema: 810 paket valid. Audit akhir: ERROR 0, WARNING 0.

## Temuan
| jenis (1–6) | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| 2 | berangkat-sekolah | urutan "Robot ke sekolah" | "pakai seragam" dan "pakai tas" bisa ditukar tanpa salah (keduanya ikut tampil di 3 langkah) | diperbaiki: bangun tidur → pakai seragam → naik sepeda → sampai sekolah |
| 2 | berangkat-sekolah | urutan "Tiba di sekolah" | "salim dengan guru" dan "taruh tas di kelas" bisa ditukar (guru bisa di gerbang atau di kelas) | diperbaiki: salim dengan guru di gerbang → jalan ke kelas → taruh tas di kelas |
| 1/6 | dari-kebun-ke-meja | urutan "Memasak sayur" | instruksi "dari kebun sampai ke meja makan", padahal langkah pertamanya "beli sayur" | diperbaiki: "petik sayur di kebun" (🥬) |
| 2 | perbaiki-urutan-pagi | urutan "Pagi hari" | kalau mesin menukar "rapikan kasur" dan "sarapan", hasilnya tetap masuk akal, jadi anak tidak tahu mana yang salah | diperbaiki: bangun tidur → mandi → pakai seragam → berangkat |
| 2 | perbaiki-urutan-pagi | urutan "Bangun pagi" | "rapikan kasur" dan "mandi" kalau ditukar tetap masuk akal | diperbaiki: langkah ke-4 jadi "kasur sudah rapi" |
| 2/5 | perbaiki-urutan-pagi | urutan "Menyiram tanaman" | "isi gembor" dan "bawa ke kebun" kalau ditukar masuk akal bila kerannya ada di kebun | diperbaiki: buka keran → isi gembor dengan air → siram tanaman → tanaman segar |
| 2 | sd1-kode-algoritma-di-kota | urutan "Menabung di celengan" | "masukkan koin ke celengan" dan "menabung setiap hari" bisa ditukar | diperbaiki: "menabung setiap hari" dibuang, ditambah langkah akhir "beli buku dengan uangnya" |
| 2 | sd1-kode-algoritma-di-kota | urutan "Membuang kotak minuman" | "pipihkan kotaknya" dan "cari tempat sampah" bisa ditukar | diperbaiki: "cari tempat sampah" diganti "buka keran" sebelum "cuci tangan pakai sabun" |
| 2 | sd1-kode-algoritma-sehari-hari | urutan "Membuat teh" | "masukkan kantong teh" dan "tuang air panas" bisa ditukar | diperbaiki: tuang air panas → "celupkan kantong teh" (mencelup butuh air dulu) |
| 2 | sd1-kode-tukar-langkah-taman | urutan "Menerbangkan layang-layang" | "ikat benang"/"tunggu angin" dan "layang-layang naik"/"ulur benang" kalau ditukar masih masuk akal | diperbaiki: ambil → ikat benang → berlari melawan angin → naik → terbang tinggi → gulung benangnya |
| 2 | sd1-kode-tukar-langkah-taman | urutan "Mengisi akuarium baru" | "beri makan ikan" dan "lihat ikan berenang" bisa ditukar | diperbaiki: langkah akhir "ikan memakan pakannya" |
| 2 | sd2-kode-kartu-tugas-kelas | urutan "Membersihkan akuarium" | "beri makan ikan" dan "amati ikan berenang" bisa ditukar (7 kartu) | diperbaiki: "amati ikan memakan pakannya" |
| 2 | sd2-kode-kartu-tugas-kelas | urutan "Merawat luka kecil" | "tempel plester" dan "buang bungkus plester" bisa ditukar | diperbaiki: "buang bungkus" dibuang, ditambah awal "lutut tergores saat bermain" |
| 2 | kue-tiga-tahap | benda i-sarungtangan | "pakai sarung tangan oven" wajar masuk rak siapkan maupun panggang | diperbaiki: "angkat loyang dari oven" (🧤), jelas panggang |
| 3/4 | program-panjang-jadi-pendek | instruksi | "tulis ulang", padahal anak menyusun blok, bukan menulis | diperbaiki: "susun ulang memakai blok ulangi" |
| 3 | sd2-kode-perangkat-masuk-tampil | instruksi | berupa pertanyaan, tidak menyebut apa yang dilakukan anak (menaruh ke kotak) | diperbaiki: "taruh tiap perangkat di kotak memasukkan perintah atau kotak menampilkan hasil" |
| 2 | sd2-kode-tahap-game-mini | benda i-draw-a-map-of-the-level | "gambar peta level" bisa dibaca rancang (di kertas) atau buat (di aplikasi) | diperbaiki: "gambar peta level di kertas" (sama dengan "gambar sketsa tokoh di kertas") |
| 4/6 | pagar-bunga-keliru | benda semanggi, melati | instruksi "satu bunga… ganti dengan bunga yang benar" padahal 🍀 semanggi bukan bunga; label "bunga putih" padahal emoji 🌼 kuning | diperbaiki: 🌹 mawar dan 🌺 kembang sepatu (id dan nada ikut diganti) |
| 3 | alat-kelas-macet, keran-macet-minta-tolong | instruksi | instruksi menyuruh mengetuk alat dan tidak menyebut tombol bantuan, padahal yang dinilai menekan bantuan | diperbaiki (keputusan koordinator): ditambah "Kalau tetap tidak bisa, minta tolong ya." tanpa menyebut letak tombol (18 kata) |
| 4 | sd2-kode-masukan-keluaran, sd2-kode-perangkat-masuk-tampil | rak keluar/tampil, instruksi, judul | "menampilkan hasil" untuk speaker, headphone, earphone, dan printer (suara dan cetakan tidak "ditampilkan") | diperbaiki (keputusan koordinator): rak, instruksi, dan judul jadi "mengeluarkan hasil"; pernyataan (ID dan EN) dan catatan KODE.SD2.PERANGKAT.01 di content/kurikulum/KODE-SD2.json ikut disesuaikan, id kompetensi tetap |
| 2 | sd2-kode-kartu-tugas-kelas | urutan "Merebus telur" | "masukkan telur ke panci air" dan "nyalakan kompor" bisa dibalik | ditolak: ini urutan resep baku (telur dimasukkan sejak air dingin) |
| 2 | sd1-kode-algoritma-sehari-hari | urutan "Mencuci tangan" | "tutup keran" dan "keringkan tangan" bisa dibalik | ditolak: urutan baku yang diajarkan buku SD |
| 2 | sd1-kode-perbaiki-algoritma | urutan "Memotret" | "nyalakan kamera" dan "arahkan ke bunga" kalau ditukar | ditolak: kamera harus menyala dulu supaya bisa membidik |
| 2 | kue-tiga-tahap-urut | tahap siapkan | "cuci tangan" dan "ambil bahan" di tahap yang sama | ditolak: kebiasaan cuci tangan sebelum memegang bahan sudah konsisten di semua 8 urutan |
| 6 | perbaiki-dua-langkah | instruksi | "perbaiki tepat dua blok", padahal mesin juga menerima perbaikan yang lebih hemat | ditolak: tidak menyesatkan anak; jalan yang lebih hemat tetap dinilai benar |

Ditinjau dan dinilai tidak bermasalah: semua 50 paket navigasi (arah "naik/atas" cocok dengan start N dan bintang di atas; perahu ke atas/bawah/kiri cocok), pola lanjut/cipta, pilah ya/tidak, kabel/nirkabel, robot, Carroll, tahap game buah, mode label (cerita-pertama-lalu-terakhir, cerita-urut-peternakan: gambar tampil sudah urut, jadi tidak ada urutan ganda), mana-dulu (pasangan sebab-akibat jelas).

## Kalimat suara berubah
| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| berangkat-sekolah | salim-1 | masuk gerbang sekolah | salim dengan guru di gerbang |
| berangkat-sekolah | salim-2 | salim dengan guru | jalan ke kelas |
| berangkat-sekolah | sekolah-bangun | (baru) | bangun tidur |
| berangkat-sekolah | tas | pakai tas | (dihapus) |
| dari-kebun-ke-meja | beli | beli sayur | (dihapus) |
| dari-kebun-ke-meja | petik | (baru) | petik sayur di kebun |
| perbaiki-urutan-pagi | bangun-mandi | mandi | (dihapus) |
| perbaiki-urutan-pagi | bangun-rapi | (baru) | kasur sudah rapi |
| perbaiki-urutan-pagi | kasur | rapikan kasur | (dihapus) |
| perbaiki-urutan-pagi | pagi-mandi | (baru) | mandi |
| perbaiki-urutan-pagi | pagi-seragam | (baru) | pakai seragam |
| perbaiki-urutan-pagi | sarapan | sarapan | (dihapus) |
| perbaiki-urutan-pagi | siram-1 | isi gembor dengan air | buka keran |
| perbaiki-urutan-pagi | siram-2 | bawa ke kebun | isi gembor dengan air |
| sd1-kode-algoritma-di-kota | celengan-3 | menabung setiap hari | (dihapus) |
| sd1-kode-algoritma-di-kota | celengan-7 | (baru) | beli buku dengan uangnya |
| sd1-kode-algoritma-di-kota | sampah-3 | cari tempat sampah | (dihapus) |
| sd1-kode-algoritma-di-kota | sampah-5 | cuci tangan | cuci tangan pakai sabun |
| sd1-kode-algoritma-di-kota | sampah-7 | (baru) | buka keran |
| sd1-kode-algoritma-sehari-hari | teh-2 | masukkan kantong teh | celupkan kantong teh |
| sd1-kode-tukar-langkah-taman | akuarium-6 | lihat ikan berenang | ikan memakan pakannya |
| sd1-kode-tukar-langkah-taman | layang-3 | tunggu angin bertiup | (dihapus) |
| sd1-kode-tukar-langkah-taman | layang-6 | ulur benang pelan-pelan | layang-layang terbang tinggi |
| sd1-kode-tukar-langkah-taman | layang-7 | (baru) | gulung benangnya |
| sd2-kode-kartu-tugas-kelas | bersih-akuarium-7 | amati ikan berenang | amati ikan memakan pakannya |
| sd2-kode-kartu-tugas-kelas | luka-0 | (baru) | lutut tergores saat bermain |
| sd2-kode-kartu-tugas-kelas | luka-6 | buang bungkus plester | (dihapus) |
| kue-tiga-tahap | i-sarungtangan | pakai sarung tangan oven | angkat loyang dari oven |
| program-panjang-jadi-pendek | instruksi | Program robot ini panjang: tulis ulang dengan blok ulangi supaya muat di rak dan jalannya tetap sama. | Program robot ini panjang: susun ulang memakai blok ulangi supaya muat di rak dan jalannya tetap sama. |
| sd2-kode-tahap-game-mini | i-draw-a-map-of-the-level | gambar peta level | gambar peta level di kertas |
| pagar-bunga-keliru | kembang-sepatu | (baru) | kembang sepatu |
| pagar-bunga-keliru | mawar | (baru) | mawar |
| pagar-bunga-keliru | melati | bunga putih | (dihapus) |
| pagar-bunga-keliru | semanggi | semanggi | (dihapus) |
| alat-kelas-macet | instruksi | Robot mau pakai alat di kelas. Ketuk alatnya supaya menyala. | Robot mau pakai alat di kelas. Ketuk alatnya supaya menyala. Kalau tetap tidak bisa, minta tolong ya. |
| keran-macet-minta-tolong | instruksi | Robot mau pakai alat di rumah. Ketuk alatnya supaya bekerja. | Robot mau pakai alat di rumah. Ketuk alatnya supaya bekerja. Kalau tetap tidak bisa, minta tolong ya. |
| sd2-kode-masukan-keluaran | bin-keluar | untuk menampilkan hasil | untuk mengeluarkan hasil |
| sd2-kode-masukan-keluaran | instruksi | Perangkat ini memasukkan perintah ke komputer atau menampilkan hasilnya? Taruh di kotak yang cocok. | Perangkat ini memasukkan perintah ke komputer atau mengeluarkan hasilnya? Taruh di kotak yang cocok. |
| sd2-kode-perangkat-masuk-tampil | bin-tampil | menampilkan hasil | mengeluarkan hasil |
| sd2-kode-perangkat-masuk-tampil | instruksi | Di toko elektronik ini, perangkat mana yang memasukkan perintah ke komputer dan mana yang menampilkan hasil? | Di toko elektronik ini, taruh tiap perangkat di kotak memasukkan perintah atau kotak mengeluarkan hasil. |
| sd2-kode-perangkat-masuk-tampil | judul | Memasukkan atau Menampilkan? | Memasukkan atau Mengeluarkan? |

## Butuh keputusan owner
Kedua butir sudah diputuskan koordinator dan dikerjakan:
- KODE.PAUD.SEBAB-AKIBAT.02: kalimat minta tolong ditambahkan ke instruksi (opsi b).
- KODE.SD2.PERANGKAT.01: istilahnya jadi "mengeluarkan hasil" di paket dan kurikulum.
Tidak ada lagi yang menunggu keputusan owner.
