# Perbaikan 05: SAINS PAUD, TK A, TK B

Sumber: qc/temuan-05-sains-paud-tk.md. 51 paket diubah, dan versi patch tiap paket naik satu tingkat. Berkas kurikulum dan kode tidak disentuh.
Validasi: `npx tsx packages/schema/src/cli.ts` menghasilkan 810 paket valid. `akademi:audit` tidak melaporkan ERROR untuk paket ini. Sisa ERROR `soal-berulang-satu-sesi` ada di paket MAT/KODE milik agen lain (bayar-koin-*, kasir-kembalian-*, ikan-kolam-sisa, kue-piring-sisa, sd2-kode-perbaiki-tiga-blok).

## Diterapkan
| keparahan | paket | apa yang diubah |
|---|---|---|
| KRITIS | sains-urutkan-matahari-bumi-bulan | Terverifikasi: urutan "Dari paling kecil" berlawanan dengan instruksi "dari paling besar". Urutan `kecil` dihapus, berikut 4 kuncinya. Karena audit soal-berulang menuntut 2 ronde yang berbeda, ditambah urutan `besar-polos` (arah sama, besar ke kecil) dengan gambar 🌞 🌏 🌕 dan label polos "Matahari", "Bumi", "Bulan". Keterangan knob steps disesuaikan. |
| KRITIS | sains-siklus-ayam | Terverifikasi: urutan "Induk ayam" dan "Induk bebek" dimulai dari induk. Keduanya dihapus (tersisa 8 urutan). Instruksi diganti menjadi "Susun gambar sesuai urutan hidupnya, dari yang paling awal." karena beberapa urutan dimulai dari "baru menetas", dan knob steps=3 memotong urutan 4 langkah sebelum tahap dewasa. |
| KRITIS | sains-susun-tumbuhan-utuh | Terverifikasi: mangga dan cemara memakai "ranting" 🌿 di posisi ke-3. Mangga kini akar 🫚 → batang 🪵 → daun 🍃 "daun rimbun" → bunga 🌼 "bunga mangga di pucuk". Langkah ranting cemara dibuang, jadi cemara tinggal 3 langkah: akar → batang → daun jarum. |
| KRITIS | sains-pot-mana-yang-layu | Terverifikasi: soal r4 punya dua pot gelap (kotak, lemari). Pilihan `lemari` diganti `kebun`. Instruksi "sebelum hari berganti" diganti "beberapa hari lagi" (EN "in a few days"). |
| SEDANG | sains-sirip-sayap-kaki | Urutan bins diubah menjadi [sirip, kaki, sayap] sesuai knob. Item `burung` (sayap dan kaki, ambigu) dihapus. Keterangan knob itemCount disesuaikan. |
| SEDANG | sains-rak-sayur-bagian-tumbuhan | Urutan bins diubah menjadi [akar, daun, batang, bunga]. Item `kentang` dihapus karena bertentangan dengan knob "kentang sengaja tidak dipakai" dan labelnya membocorkan jawaban. Kangkung ☘️ diganti 🌿. Rebung 🎍 diganti bentuk segitiga #d7ccc8. |
| SEDANG | sains-siklus-kupu-kupu | Semua kepompong 🛡️ diganti bentuk rect #8d6e63 (scale 1.1, width 0.55) seperti paket saudara. Urutan "Kupu-kupu dan bunga" diubah: langkah "hinggap di bunga" dibuang dan "telur kecil di daun" 🍃 ditambahkan di depan. |
| SEDANG | sains-darat-air-udara-safari | Capung 🪰 (emojinya lalat) diganti item 🐝 "lebah". Judul diganti "Hewan Jauh, Tempat Mana?" (KECIL). |
| SEDANG | sains-hidup-tak-hidup-laut | Emoji botol 🍾 diganti 🧴. |
| SEDANG | sains-tebak-apung-tenggelam | Tutup gabus 🍾 diganti lingkaran #d7a86e scale 0.5. Kelereng 🔮 diganti lingkaran #4fc3f7 scale 0.4 (KECIL). |
| SEDANG | sains-rak-bahan-halaman | Item botolkaca 🍾 diganti 🫙 dengan label "toples kaca". |
| SEDANG | sains-beri-makan-makhluk-hidup | Sekop ⛏️ diganti item 🧤 "sarung tangan kebun" (id `sarungtangan`, bin `tidak`). |
| SEDANG | sains-siang-malam-di-kebun | Siram 🚿 diganti 🪴. Piyama 🥱 diganti 🛌 (KECIL). |
| SEDANG | sains-bekal-sehari-hari-pasar | Tempe 🍢 diganti bentuk rect #e6c27a. |
| SEDANG | sains-isi-piringku | Label bin `nasi` diganti "nasi dan makanan pokok" (EN "rice and staple foods") supaya kentang rebus masuk akal di bin itu. |
| SEDANG | sains-mana-organ-tubuh | Instruksi diganti "Dengarkan nama bagian di dalam tubuh, lalu sentuh gambarnya." karena ada soal tulang dan otot. |
| SEDANG | sains-cari-organ-di-tubuh | Fakta soal 11 dibetulkan: "Paru-paru terisi udara saat kita menarik napas." |
| SEDANG | sains-lapisan-laut | Ikan berlampu dipindah ke bin `dalam`. Item palung baru ditambahkan: 🐟 #eceff1 "ikan siput palung". Hiu diberi label "hiu goblin". Bintang laut ⭐ diganti bentuk star #ff8a65. Paus diberi label "paus sperma yang menyelam dalam" (KECIL). Instruksi dipendekkan menjadi satu kalimat (KECIL). |
| SEDANG | sains-intip-tembus-pandang | Plastik bening 🧊 diganti bentuk rect #e1f5fe. Label selimut 🛏️ diganti "kasur tebal" (KECIL). |
| SEDANG | sains-pilih-bahan-bangun-rumah | Soal kursi diganti "Kursi dari batang pohon yang digergaji. Bahan apa?" supaya hanya kayu yang benar. Empat pilihan tetap, jadi knob min 3 aman. |
| SEDANG | sains-tunjuk-benda-langit | Instruksi diganti "Robot membuka buku gambar angkasa. …", jadi tidak ada lagi teropong atau menunjuk Bumi dari halaman. |
| SEDANG | sains-habitat-hewan-lain | Tujuh item yang kembar dengan sains-antar-ke-habitat diganti: rubah gurun 🦊, landak gurun 🦔, kumbang gurun 🪲 (gurun); paus beluga 🐋, burung hantu salju 🦉, serigala kutub 🐺 (es); macan tutul 🐆 (hutan). Cumi-cumi diberi label "cumi karang" (KECIL). |
| SEDANG | sains-ciri-tubuh-dan-habitat | Contoh "punuk ke gurun" dibuang dari instruksi. Item `lemaktebal` (ambigu antara air dan es) dihapus. |
| SEDANG | sains-layu-atau-segar | Instruksi dipendekkan, dan "sebelum hari berganti" diganti "beberapa hari lagi" (lihat keputusan soal pernyataan kompetensi). |
| SEDANG | sains-benda-dibuat-dari-apa | Hanya bagian yang aman: emoji akuarium 🐠 diganti bentuk rect #b3e5fc, dan instruksi dipendekkan (KECIL). Bin kain/plastik masuk daftar keputusan. |
| KECIL | sains-senam-tunjuk-tubuh | "Pegang hidung" diganti "Tunjuk hidung". |
| KECIL | sains-keranjang-indra-pasar | Instruksi diganti "indra yang memakainya". Kunci `i-balon` (tanpa item) dihapus. Bawang putih diberi label "bau bawang putih". |
| KECIL | sains-keranjang-indra-rumah | Judul diganti "Keranjang Indra" / "Sense Baskets". |
| KECIL | sains-hitung-kaki-peternakan | Judul diganti "Hitung Kaki Hewan". Instruksi tidak lagi menyebut "peternakan". |
| KECIL | sains-siapa-hidup-di-rumah | Soal ikan2: pengecoh `jam` diganti `kunci`. |
| KECIL | sains-suara-siapa-di-kebun | Tanda baca diganti "tokek, tokek?". Gagak 🐦‍⬛ (ZWJ) diganti 🐦 dengan color #212121. |
| KECIL | sains-perbaiki-langit-hujan | Judul urutan diganti "Berangkat sekolah". |
| KECIL | sains-bagian-tumbuhan-di-taman | "mencari madu" diganti "mengisap sari bunga". |
| KECIL | sains-biji-sampai-berbunga | Urutan "Tulip tumbuh" diganti "Kenikir tumbuh" (🌰 → 🌱 → 🌼). Kunci diganti nama menjadi `t-kenikir` dan `kenikir-*`. |
| KECIL | sains-anak-dan-induk | Item kedua diberi kunci label sendiri: "anak ayam kuning" dan "anak kucing belang". |
| KECIL | sains-hewan-air-di-pantai | Instruksi diganti "Ada hewan darat dan hewan air. …". |
| KECIL | sains-kegiatan-sesuai-cuaca | Label kincir 🎐 diganti "main lonceng angin". |
| KECIL | sains-cuaca-begini-main-apa | "puzzle" diganti "puzel". |
| KECIL | sains-percobaan-bak-cuci-dapur | "telur mentah" diganti "telur segar". |
| KECIL | sains-bekerja-dulu-di-taman | Judul diganti "Bagian Mana yang Akan Bekerja?". Instruksi diganti "… yang akan paling bekerja". |
| KECIL | sains-pilah-lapisan-tubuh-kelas | Keterangan knob diganti "sebagian potongan berbeda …". |
| KECIL | sains-piring-sehari-hari | Label keripik 🍟 diganti "kentang goreng". |
| KECIL | sains-lengkapi-piring-dapur | "terong" diganti "terung". |
| KECIL | sains-apa-yang-tanaman-perlu | Label selimut 🛏️ diganti "kasur". |
| KECIL | sains-rawat-tanaman-berbunga | Gulma 🌱 diganti 🌿 dengan color #827717. |
| KECIL | sains-antar-ke-lapisan-laut | Soal amfipoda diganti "Hewan mirip udang berwarna pucat hidup di dasar palung. …". |
| KECIL | sains-rak-bahan-dapur | Label panci 🍳 diganti "wajan". |
| KECIL | sains-lapak-panen-bagian-tumbuhan | Kemangi ☘️ diganti 🌿. |
| KECIL | sains-bisa-dilihat-tembus, sains-senter-bola-dunia, sains-siapa-mengitari-siapa | Instruksi dipendekkan. Soal 8 di siapa-mengitari diganti "Bulan selalu dekat dan mengitari…". |

## Kalimat suara berubah (WAJIB lengkap)
| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| sains-anak-dan-induk | i-anakayam-2 | (baru) | anak ayam kuning |
| sains-anak-dan-induk | i-anakkucing-2 | (baru) | anak kucing belang |
| sains-antar-ke-lapisan-laut | t-10 | Amfipoda raksasa, udang kecil pucat dari dasar palung. Antar ke mana? | Hewan mirip udang berwarna pucat hidup di dasar palung. Antar ke mana? |
| sains-apa-yang-tanaman-perlu | i-selimut | selimut | kasur |
| sains-bagian-tumbuhan-di-taman | t-bunga1 | Lebah mencari madu di bagian yang berwarna-warni. Mana bunganya? | Lebah mengisap sari bunga di bagian yang berwarna-warni. Mana bunganya? |
| sains-bekerja-dulu-di-taman | judul | Bagian Mana Bekerja Dulu? | Bagian Mana yang Akan Bekerja? |
| sains-bekerja-dulu-di-taman | instruksi | Tokoh mau bermain di taman. Dengarkan apa yang akan ia lakukan, lalu sentuh bagian tubuh yang bekerja lebih dulu. | Tokoh mau bermain di taman. Dengarkan apa yang akan ia lakukan, lalu sentuh bagian tubuh yang akan paling bekerja. |
| sains-benda-dibuat-dari-apa | instruksi | Robot membangun barang-barang di halaman. Taruh tiap benda ke bahan yang paling cocok untuknya: kayu, logam, kaca, atau kain. | Taruh tiap benda ke bahan yang paling cocok: kayu, logam, kaca, atau kain. |
| sains-beri-makan-makhluk-hidup | i-sekop | sekop | (dihapus) |
| sains-beri-makan-makhluk-hidup | i-sarungtangan | (baru) | sarung tangan kebun |
| sains-biji-sampai-berbunga | t-tulip | Tulip tumbuh | (dihapus) |
| sains-biji-sampai-berbunga | tulip-biji | biji di tanah | (dihapus) |
| sains-biji-sampai-berbunga | tulip-tunas | tunas kecil | (dihapus) |
| sains-biji-sampai-berbunga | tulip-bunga | berbunga | (dihapus) |
| sains-biji-sampai-berbunga | kenikir-biji | (baru) | biji di tanah |
| sains-biji-sampai-berbunga | kenikir-tunas | (baru) | tunas kecil |
| sains-biji-sampai-berbunga | kenikir-bunga | (baru) | berbunga |
| sains-biji-sampai-berbunga | t-kenikir | (baru) | Kenikir tumbuh |
| sains-bisa-dilihat-tembus | instruksi | Di laboratorium, angkat tiap benda ke depan mata dan coba lihat lewat benda itu. Taruh ke rak tembus pandang atau tidak tembus pandang. | Coba lihat lewat tiap benda. Taruh ke rak tembus pandang atau tidak. |
| sains-cari-organ-di-tubuh | t-11 | Mana paru-parunya? Paru-paru mengisi udara saat kita meniup. | Mana paru-parunya? Paru-paru terisi udara saat kita menarik napas. |
| sains-ciri-tubuh-dan-habitat | instruksi | Taruh kartu ciri tubuh ke tempat hidup yang cocok: bulu tebal ke es, sirip ke air, punuk ke gurun. | Taruh kartu ciri tubuh ke tempat hidup yang cocok: bulu tebal ke es, sirip ke air. |
| sains-ciri-tubuh-dan-habitat | i-lemaktebal | lapisan lemak tebal | (dihapus) |
| sains-cuaca-begini-main-apa | i-puzzle | main puzzle di dalam rumah | main puzel di dalam rumah |
| sains-darat-air-udara-safari | judul | Hewan Besar, Tempat Mana? | Hewan Jauh, Tempat Mana? |
| sains-darat-air-udara-safari | i-capung | capung | (dihapus) |
| sains-darat-air-udara-safari | i-lebah | (baru) | lebah |
| sains-habitat-hewan-lain | i-kalajengking | kalajengking | (dihapus) |
| sains-habitat-hewan-lain | i-ular | ular pasir | (dihapus) |
| sains-habitat-hewan-lain | i-anjinglaut | anjing laut | (dihapus) |
| sains-habitat-hewan-lain | i-cumi | cumi-cumi | cumi karang |
| sains-habitat-hewan-lain | i-untaduapunuk | unta berpunuk dua | (dihapus) |
| sains-habitat-hewan-lain | i-kadal | kadal gurun | (dihapus) |
| sains-habitat-hewan-lain | i-penguin | penguin | (dihapus) |
| sains-habitat-hewan-lain | i-beruangkutub | beruang kutub | (dihapus) |
| sains-habitat-hewan-lain | i-rubahgurun | (baru) | rubah gurun |
| sains-habitat-hewan-lain | i-landakgurun | (baru) | landak gurun |
| sains-habitat-hewan-lain | i-kumbanggurun | (baru) | kumbang gurun |
| sains-habitat-hewan-lain | i-beluga | (baru) | paus beluga |
| sains-habitat-hewan-lain | i-burunghantusalju | (baru) | burung hantu salju |
| sains-habitat-hewan-lain | i-serigalakutub | (baru) | serigala kutub |
| sains-habitat-hewan-lain | i-macantutul | (baru) | macan tutul |
| sains-hewan-air-di-pantai | instruksi | Di pantai ada hewan darat dan hewan air. Dengarkan, lalu sentuh hewan yang hidup di air. | Ada hewan darat dan hewan air. Dengarkan, lalu sentuh hewan yang hidup di air. |
| sains-hitung-kaki-peternakan | judul | Kaki Hewan Peternakan | Hitung Kaki Hewan |
| sains-hitung-kaki-peternakan | instruksi | Lihat kaki hewan peternakan. Taruh ke papan dua kaki atau empat kaki. | Lihat kaki hewannya. Taruh ke papan dua kaki atau empat kaki. |
| sains-intip-tembus-pandang | i-selimut | selimut tebal | kasur tebal |
| sains-isi-piringku | nasi | nasi | nasi dan makanan pokok |
| sains-kegiatan-sesuai-cuaca | i-kincir | main kincir angin | main lonceng angin |
| sains-keranjang-indra-pasar | instruksi | Robot jalan-jalan di pasar: taruh tiap benda ke indra yang dipakainya. | Robot jalan-jalan di pasar: taruh tiap benda ke indra yang memakainya. |
| sains-keranjang-indra-pasar | i-balon | balon warna-warni | (dihapus) |
| sains-keranjang-indra-pasar | bawang | bawang putih | bau bawang putih |
| sains-keranjang-indra-rumah | judul | Keranjang Pancaindra | Keranjang Indra |
| sains-lapisan-laut | instruksi | Laut punya lapisan: terumbu yang dangkal, laut dalam yang gelap, dan palung yang paling dalam. Antar tiap hewan ke rumahnya. | Antar tiap hewan ke rumahnya: terumbu yang dangkal, laut dalam yang gelap, atau palung yang paling dalam. |
| sains-lapisan-laut | i-paus | paus sperma | paus sperma yang menyelam dalam |
| sains-lapisan-laut | i-hiu | hiu | hiu goblin |
| sains-lapisan-laut | i-siputpalung | (baru) | ikan siput palung |
| sains-layu-atau-segar | instruksi | Lihat di mana tiap tanaman berada dan dengarkan keadaannya. Taruh ke rak akan layu atau tetap segar sebelum hari berganti. | Lihat tempat tiap tanaman. Taruh ke rak akan layu beberapa hari lagi, atau tetap segar. |
| sains-lengkapi-piring-dapur | i-terong | terong | terung |
| sains-mana-organ-tubuh | instruksi | Dengarkan nama organ di dalam tubuh, lalu sentuh gambarnya. | Dengarkan nama bagian di dalam tubuh, lalu sentuh gambarnya. |
| sains-perbaiki-langit-hujan | s-sekolah | Pulang sekolah | Berangkat sekolah |
| sains-percobaan-bak-cuci-dapur | i-telur | telur mentah | telur segar |
| sains-pilih-bahan-bangun-rumah | t-kursi | Kursi untuk duduk yang kuat dan nyaman. Bahan apa? | Kursi dari batang pohon yang digergaji. Bahan apa? |
| sains-piring-sehari-hari | i-keripik | keripik | kentang goreng |
| sains-pot-mana-yang-layu | instruksi | Dengarkan di mana tiap pot disimpan, lalu tebak pot yang akan layu sebelum hari berganti. | Dengarkan di mana tiap pot disimpan, lalu tebak pot yang akan layu beberapa hari lagi. |
| sains-rak-bahan-dapur | i-panci | panci | wajan |
| sains-rak-bahan-halaman | i-botolkaca | botol kaca | toples kaca |
| sains-rak-sayur-bagian-tumbuhan | i-kentang | kentang (umbi batang) | (dihapus) |
| sains-senam-tunjuk-tubuh | t-hidung1 | Ayo senam! Pegang hidung, lalu tarik napas. | Ayo senam! Tunjuk hidung, lalu tarik napas. |
| sains-senter-bola-dunia | instruksi | Robot menyorot bola dunia dengan senter seperti Matahari. Sisi yang kena cahaya sedang siang. Dengarkan, lalu sentuh jawabannya. | Senter menyinari bola dunia seperti Matahari. Sisi yang terang sedang siang. Dengarkan, lalu sentuh jawabannya. |
| sains-siapa-mengitari-siapa | instruksi | Kita membuat model tata surya kecil di kelas. Dengarkan pertanyaannya: siapa di tengah, siapa yang mengitari. Lalu sentuh jawabannya. | Dengarkan, lalu sentuh siapa di tengah atau siapa yang mengitari. |
| sains-siapa-mengitari-siapa | t-8 | Bulan selalu dekat dengan… dan mengitarinya. | Bulan selalu dekat dan mengitari… |
| sains-siklus-ayam | instruksi | Susun gambar dari telur, anak ayam, sampai ayam dewasa. | Susun gambar sesuai urutan hidupnya, dari yang paling awal. |
| sains-siklus-ayam | t-induk | Induk ayam | (dihapus) |
| sains-siklus-ayam | induk-induk | induk ayam bertelur | (dihapus) |
| sains-siklus-ayam | induk-telur | telur | (dihapus) |
| sains-siklus-ayam | induk-retak | telur retak, menetas | (dihapus) |
| sains-siklus-ayam | induk-anak | anak ayam | (dihapus) |
| sains-siklus-ayam | t-bebek-induk | Induk bebek | (dihapus) |
| sains-siklus-ayam | bebek-induk-induk | induk bebek bertelur | (dihapus) |
| sains-siklus-ayam | bebek-induk-telur | telur bebek | (dihapus) |
| sains-siklus-ayam | bebek-induk-anak | anak bebek kecil | (dihapus) |
| sains-siklus-kupu-kupu | bunga-bunga | hinggap di bunga | (dihapus) |
| sains-siklus-kupu-kupu | bunga-telur | (baru) | telur kecil di daun |
| sains-sirip-sayap-kaki | i-burung | burung terbang | (dihapus) |
| sains-suara-siapa-di-kebun | t-tokek | Siapa yang berbunyi tokek! tokek!? | Siapa yang berbunyi tokek, tokek? |
| sains-susun-tumbuhan-utuh | mangga-ranting | ranting | (dihapus) |
| sains-susun-tumbuhan-utuh | mangga-daun | daun rimbun di atas | daun rimbun |
| sains-susun-tumbuhan-utuh | cemara-ranting | ranting | (dihapus) |
| sains-susun-tumbuhan-utuh | mangga-bunga | (baru) | bunga mangga di pucuk |
| sains-tunjuk-benda-langit | instruksi | Robot memegang teropong di halaman. Dengarkan nama Matahari, Bumi, atau Bulan, lalu sentuh gambarnya. | Robot membuka buku gambar angkasa. Dengarkan nama Matahari, Bumi, atau Bulan, lalu sentuh gambarnya. |
| sains-urutkan-matahari-bumi-bulan | s-kecil | Dari paling kecil | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | kecil-bulan | Bulan paling kecil | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | kecil-bumi | Bumi | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | kecil-matahari | Matahari paling besar | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | polos-matahari | (baru) | Matahari |
| sains-urutkan-matahari-bumi-bulan | polos-bumi | (baru) | Bumi |
| sains-urutkan-matahari-bumi-bulan | polos-bulan | (baru) | Bulan |

## Ditolak (bukan masalah)
| temuan | alasan |
|---|---|
| SEDANG: stok kecil membuat ronde hanya 3 benda (kandang-dua-empat-kaki, darat-air-udara-kebun/safari, rak-sayur, sirip-sayap-kaki, kegiatan-sesuai-cuaca) | Mesin pilah sudah diperbaiki koordinator. Bila stok di bin aktif kurang dari 2× batas bawah, ronde memakai itemCount penuh (misalnya stok 7 menghasilkan ronde 6). Audit tidak melaporkan `ronde-kurang-item` untuk paket ini, jadi item tidak ditambah. |
| KECIL: sains-biji-sampai-berbunga "Bunga matahari kecil" dobel dengan "Bunga matahari tumbuh" | Pada knob steps bawaan 3, urutan 4 langkah dipotong menjadi biji → tunas → berdaun banyak, sedangkan "Bunga matahari kecil" menampilkan biji → tunas → berbunga. Kartu yang tampil berbeda, dan menghapusnya justru mengurangi urutan yang berakhir di tahap berbunga. |

## Butuh keputusan owner
| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| SEDANG | sains-urutkan-matahari-bumi-bulan (TKB.MATAHARI-BUMI-BULAN.02) | Kompetensi membahas lintasan (Bulan mengitari Bumi, Bumi mengitari Matahari), sedangkan paket mengurutkan ukuran. Label urutan `besar` ("Matahari paling besar") dan instruksi yang menyebut urutannya masih membocorkan jawaban. | Pindahkan paket ke kompetensi ukuran benda langit, atau tulis ulang menjadi urutan lintasan. Bila tetap memakai ukuran: hapus urutan jawaban dari instruksi, dan pakai label polos di semua urutan. |
| SEDANG | sains-rak-sayur-bagian-tumbuhan (TKA.BAGIAN-TUMBUHAN.03) | Kompetensi sudah dipersempit ke akar/daun/buah, tetapi paket masih punya rak batang (tebu, rebung) dan bunga (brokoli, kembang kol), dan tidak punya rak buah. Kentang sudah dihapus. | Ganti rak batang/bunga dengan rak buah (🍅 🥭 🍌), atau pindahkan paket ke jenjang lanjut. |
| SEDANG | sains-anak-dan-induk (TKA.SIKLUS-HIDUP.03) | Kecebong digambar 🐟, dan menurut catatan kompetensi pasangan kecebong–katak dilepas. | Hapus item kecebong dan bin katak, atau ganti visual dengan `shape: "berudu"` (sudah ada di skema) bila pasangan itu tetap dipakai. |
| SEDANG | sains-cuaca-begini-main-apa | Pengecoh "membaca buku di dalam rumah" dan "puzel" masuk akal di cuaca cerah/angin, padahal catatan kompetensi melarangnya. | Ganti pengecoh buku/puzel pada soal cerah dan angin dengan kegiatan hujan, atau ganti item dengan "berteduh di teras". |
| SEDANG | sains-alat-gerak-hewan-pantai | Ada 3 burung (sayap dan kaki) di stok, padahal catatan menyimpan burung untuk ronde lanjut. | Ganti dengan kupu-kupu, lebah, dan kelelawar, atau terima burung lalu ubah catatan. |
| SEDANG | sains-bekal-sehari-hari-pasar, sains-piring-sehari-hari | Bin "kadang-kadang" dan "toples sesekali" hampir sama artinya. | Hapus bin `kadang` (knob binCount maks 2), atau pindahkan isinya ke `toples`. |
| SEDANG | sains-bekal-sehat-pasar (TKB.MAKANAN-SEHAT.03) | Tidak ada jajanan pengecoh, jadi paket hanya melatih hitung jumlah. | Tambah barang pengecoh (permen, lolipop) bila mode dagang mendukung, atau pindahkan paket ke MAT. |
| SEDANG | SAINS.TKB.KEBUTUHAN-TUMBUHAN.03 (kurikulum) | Pernyataan kompetensi masih menyebut layu "sebelum hari berganti". Instruksi paket sudah diganti "beberapa hari lagi". | Ubah pernyataan kompetensi menjadi "beberapa hari lagi". |
| SEDANG | Paket TKA bagian tumbuhan (emoji akar 🫚) | 🫚 adalah jahe (rimpang), bukan akar. | Buat aset atau bentuk akar serabut khusus, lalu terapkan serentak di semua paket. |
| KECIL | sains-payung-atau-topi | Di Indonesia payung lazim dipakai saat terik. | Pertegas prompt menjadi "dipakai di kepala". |
| KECIL | sains-susun-tumbuhan-utuh (urutan padi) | "Bulir padi" adalah buah, bukan bunga, padahal ia menempati posisi bunga. | Beri label "malai padi di pucuk", atau terima apa adanya. |
| KECIL | sains-siklus-ayam, sains-anak-siapa-di-peternakan | Anak bebek memakai 🐤 (anak ayam). | Buat aset anak bebek khusus. |
| KECIL | sains-papan-cuaca-kelas vs sains-simbol-cuaca-jendela; sains-bekal-cuaca-piknik vs sains-lemari-cuaca | Isi dan soal kedua pasangan banyak yang kembar. | Bedakan konteks, dan ganti soal "Hari panas dan gerah…" di salah satu paket. |
| KECIL | TKA.APUNG-TENGGELAM-MAGNET.01 vs .02 | Bukti kedua kompetensi tidak berbeda (sama-sama pilah tanpa percobaan). | Tunggu simulasi bak air, atau tandai paket .01 sebagai latihan. |
| KECIL | sains-benda-dibuat-dari-apa (TKB.BAHAN.03) | Paket memakai bin kain dan tanpa plastik, padahal kompetensi mencakup plastik. Perahu dayung juga bisa dari fiber. | Ganti bin `kain` dengan `plastik` (ember, sedotan, mainan). |
| catatan baru | sains-siklus-kupu-kupu | Urutan "Ulat makan banyak" punya 5 langkah. Knob steps=4 memotong langkah terakhir (kupu-kupu), dan keterangan "3 (tanpa telur)" keliru karena yang terpotong adalah ujung, bukan telur. | Pendekkan urutan itu menjadi 4 langkah, atau perbaiki keterangan knob. |
| catatan baru | sains-siklus-ayam, sains-biji-sampai-berbunga | Knob steps=3 memotong urutan 4 langkah sebelum tahap dewasa atau berbunga, sehingga keterangan knob "3 (telur, anak ayam, ayam)" tidak sesuai. | Naikkan default steps ke 4, atau susun ulang urutan 4 langkah supaya tahap yang terpotong adalah tahap sisipan. |
