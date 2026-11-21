# Log 06 — audit ambigu SAINS SD1–SD3

Cakupan: 100 paket (SD1 30, SD2 33, SD3 37) dari SAINS-SD1/2/3.txt, semua soal/ronde/instruksi/label rak ditinjau. Berkas kurikulum: hanya dua catatan (SAINS-SD2 HABITAT.01, SAINS-SD3 TUMBUHAN.01) disesuaikan dengan contoh baru. Validasi skema: 810 paket valid. Audit: ERROR 0, tidak ada WARNING untuk paket sd1–sd3 sains.

## Temuan

| jenis (1–6) | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| 2 | sd1-sains-makan-hewan-peliharaan | i-pepaya (item pepaya → burung) | Pepaya juga wajar untuk kelinci (rak kelinci ada) — dua jawaban masuk akal | diperbaiki: "gabah" 🌾 (makanan burung saja) |
| 2 | sd1-sains-makan-hewan-peternakan | i-kubis (→ ulat) | Daun kubis juga dimakan sapi (rak sapi aktif bersama rak ulat) | diperbaiki: "daun jeruk" 🍃 (makanan ulat) |
| 5 | sd1-sains-makan-hewan-peternakan | i-tulip | Tulip bukan bunga yang dikenal anak Indonesia | diperbaiki: "bunga melati" 🌼 |
| 2 | sd1-sains-ubah-bentuk-taman-bermain | i-pel | "kain pel diperas" bisa dibaca ditekan, bukan dipuntir | diperbaiki: "kain pel diperas dengan diputar" |
| 3 | sd1-sains-dorong-tarik-taman | instruksi | "Itu dorong atau tarik?" tidak menyebut aksi; "itu" kabur | diperbaiki: "… Taruh tiap gerakan ke rak dorong atau tarik." |
| 6 | sd1-sains-gelinding-luncur-putar | instruksi | Menyebut rak "berputar" padahal default binCount 2 (rak itu tidak ada) | diperbaiki: "Taruh ke rak cara geraknya." |
| 6 | sd1-sains-gerak-taman-kota | instruksi | Sama: menyebut 3 rak padahal default 2 | diperbaiki |
| 1/2 | sd1-sains-gerak-taman-kota | i-kaleng | "kaleng bulat tergeletak di papan miring" = diam, tidak bergerak; tak cocok rak mana pun | diperbaiki: "kaleng bulat menuruni papan miring" |
| 2 | sd1-sains-bunyi-dekat-jauh-jalan | kereta-2/3 | "parkiran stasiun" vs "pasar dekat stasiun": jarak tidak pasti, dua urutan mungkin | diperbaiki: peron samping kereta → ujung peron → parkiran → lapangan jauh |
| 2/4 | sd1-sains-bunyi-dekat-jauh-jalan | kucing-2/3/4 | "tengah halaman" vs "teras" tergantung letak pagar | diperbaiki: beberapa langkah dari pagar → ujung jalan → lapangan kampung sebelah |
| 2 | sd1-sains-bunyi-dekat-jauh-jalan | kambing-2 | "halaman belakang" — letak kandang tidak disebut | diperbaiki: "beberapa langkah dari kandang" |
| 2 | sd1-sains-bunyi-makin-jauh-makin-pelan | bel-p2 | "lapangan" vs "gerbang sekolah": tergantung denah | diperbaiki: "beberapa langkah dari bel" |
| 2 | sd1-sains-bunyi-makin-jauh-makin-pelan | ayam-p2/p3 | "teras" vs "ujung kebun" tergantung denah | diperbaiki: beberapa langkah dari kandang → ujung kampung |
| 4 | sd1-sains-bunyi-makin-jauh-makin-pelan | eskrim-p2 | "di depan rumah" — rumah siapa, sejauh apa | diperbaiki: "beberapa langkah dari mobil" |
| 2 | sd1-sains-bunyi-makin-jauh-makin-pelan | drum-p3/p4 | "parkiran" vs "luar pagar" tidak pasti | diperbaiki: ujung lapangan jauh dari panggung → kampung sebelah |
| 2 | sd1-sains-bunyi-makin-jauh-makin-pelan | peluit-2 | Wasit sendiri bisa di tengah lapangan | diperbaiki: "beberapa langkah dari wasit" |
| 2/4 | sd1-sains-bunyi-makin-jauh-makin-pelan | anjing-2, burung-2 | Letak anjing tak disebut; "pagar kebun" vs "seberang jalan" tak pasti | diperbaiki: "beberapa langkah dari anjing/pohon" |
| 4 | sd1-sains-bunyi-makin-jauh-makin-pelan | instruksi | "Susun dari yang…" tanpa menyebut apa yang disusun | diperbaiki: "Susun anak dari yang …" |
| 4 | sd1-sains-butuh-listrik-rumah | instruksi | "Alat ini…" padahal ada banyak kartu | diperbaiki: "Apakah tiap alat … Taruh ke rak butuh listrik atau tanpa listrik." |
| 3 | sd1-sains-butuh-listrik-sekolah | instruksi | "Mana yang butuh listrik?" seolah hanya sebagian dipindah | diperbaiki: taruh tiap alat ke salah satu dari dua rak |
| 4 | sd1-sains-tebak-panas-matahari | t-es, t-jemuran, t-cokelat, t-genangan, t-batu | "Es batu mana…" padahal pilihannya tempat | diperbaiki: "Di mana es batu paling cepat mencair?" dst. |
| 3/6 | sd1-sains-ukur-kubus-temuan-kebun | instruksi | "Sejajarkan … baca ujung satunya" — mesin tidak bisa menggeser benda; dengan offset 1 membaca ujung memberi jawaban salah, bertentangan dengan bantuan "hitung kubus di bawah benda, bukan angka di ujungnya" | diperbaiki: "Hitung kubus yang ada tepat di bawah temuan, dari ujung ke ujung, lalu pilih angkanya." |
| 6 | sd2-sains-penutup-tubuh-kebun-binatang | judul | "Kulit Hewan" padahal yang dipilah penutup tubuh (bulu, sisik) | diperbaiki: "Penutup Tubuh Hewan di Kebun Binatang" |
| 6 | sd2-sains-penutup-tubuh-peternakan | instruksi | "Lihat kulit tiap hewan" — bulu/sisik bukan kulit | diperbaiki: "Lihat penutup tubuh tiap hewan…" |
| 2 | sd2-sains-hewan-tumbuh-besar, sd2-sains-perbaiki-hewan-tumbuh-besar | sapi-kecil | "anak sapi menyusu" vs "anak sapi baru berdiri": anak sapi baru lahir juga menyusu, urutan 1–2 bisa tertukar | diperbaiki: "anak sapi berlari di samping induknya" |
| 3 | sd2-sains-panas-kering-sejuk-lembap | instruksi | "Rasakan tiap tempat" — anak tidak bisa merasakan di layar (EN pun "Imagine") | diperbaiki: "Bayangkan berada di tiap tempat…" |
| 4 | sd2-sains-alami-atau-buatan-dapur | instruksi | "Bahan ini…" kabur | diperbaiki |
| 2 | sd2-sains-sifat-yang-dibutuhkan | i-toples (→ tembus) | Toples kaca juga harus kedap air; rak kedap aktif | diperbaiki: "kaca pembesar" 🔍 |
| 4 | sd2-sains-sifat-yang-dibutuhkan | instruksi | "taruh ke sifat" (bukan rak) | diperbaiki: "taruh ke rak sifat…" |
| 4 | sd2-sains-bahan-baru-atau-bisa-kembali | instruksi | Subjek kabur "bisakah dikembalikan?" | diperbaiki: "Lihat tiap perubahan. Bisakah bahannya kembali seperti semula? …" |
| 4 | sd2-sains-gaya-di-lapangan-olahraga | instruksi | "Gaya ini…" kabur | diperbaiki |
| 2 | sd2-sains-gaya-di-lapangan-olahraga | i-gawang | "bola ditangkap jaring gawang": jaring juga berubah bentuk — dua rak masuk akal | diperbaiki: "menendang bola supaya berbelok" ↪️ |
| 3 | sd2-sains-sumber-cahaya-malam | instruksi | "mana yang membuat cahaya sendiri? Taruh ke raknya" seolah hanya sumber dipindah | diperbaiki: menyebut dua rak |
| 4 | sd2-sains-sumber-cahaya-rumah | instruksi | "Benda ini…" | diperbaiki |
| 4 | sd2-sains-aman-dengan-listrik, sd2-sains-aman-listrik-di-luar | instruksi | "kebiasaan ini" | diperbaiki: "apakah tiap kebiasaan …" |
| 4 | sd2-sains-rawat-atau-rusak-kota | instruksi | "Kegiatan ini" | diperbaiki |
| 1 | sd2-sains-rawat-atau-rusak-kota | i-asap | "mobil berasap hitam" bukan kegiatan manusia | diperbaiki: "memakai mobil yang berasap hitam" |
| 4 | sd2-sains-rawat-atau-rusak-sungai-pantai | instruksi | "kegiatan ini" | diperbaiki |
| 2 | sd3-sains-bagian-tumbuhan-bekerja | pilihan tegak | "Bagian mana yang menopangnya?" dengan pilihan akar — akar juga menopang | diperbaiki: pilihan diganti batang, daun, bunga |
| 3 | sd3-sains-tebak-bibit-kebun-sekolah | instruksi | Hanya pertanyaan, tanpa aksi | diperbaiki: "Tebak dulu: taruh tiap bibit ke rak tetap sehat atau akan layu." |
| 5 | sd3-sains-tebak-bibit-kebun-sekolah | i-pot | Sehat tanpa menyebut air (kartu lain menyebut) | diperbaiki: "…, disiram rutin" |
| 5 | sd3-sains-tebak-tanaman-sehat | i-taman, i-kelas | Sehat tanpa menyebut air, padahal kartu "tidak pernah disiram" = layu | diperbaiki: "…, tanahnya lembap" / "…, disiram secukupnya" |
| 3 | sd3-sains-logam-ditarik-magnet-bengkel, sd3-sains-logam-ditarik-magnet | instruksi | "Dekatkan magnet ke tiap benda" — tidak bisa dilakukan di mekanik pilah | diperbaiki: "Bayangkan magnet didekatkan…"; mekanik dibiarkan (keputusan koordinator), simulasi dekatkan-magnet dicatat sebagai pengembangan |
| 6 | sd3-sains-fosil-atau-bukan | instruksi | Definisi "jejak … di batu" tidak mencakup tulang, cangkang, serangga dalam damar yang dihitung fosil | diperbaiki: "jejak atau sisa makhluk zaman dulu yang membatu" + menyebut dua rak |
| 3 | sd3-sains-cek-tebakan-lab, sd3-sains-hasil-dukung-tebakan | instruksi | Tidak menyebut aksi | diperbaiki: tambah "Sentuh jawabanmu." |
| 6 | sd2-sains-perjalanan-matahari-sehari, sd2-sains-perbaiki-perjalanan-matahari | knob steps=3 | Kartu terakhir (sore) dipotong, padahal instruksi "dari pagi ke sore" | diperbaiki (keputusan koordinator): `"potong": "tengah"` — pagi dan sore selalu tampil; diuji 200 seed, tiap urutan tetap tunggal |
| 2 | sd2-sains-habitat-hewan-dan-tumbuhan | i-penguin (→ kutub) | Pada binCount 5 rak laut ikut aktif; penguin juga hidup di laut | diperbaiki (keputusan koordinator): diganti "serigala kutub" 🐺; catatan kurikulum SAINS-SD2 HABITAT.01 disesuaikan |
| 5 | sd3-sains-bagian-tumbuhan-bekerja, sd3-sains-rak-tugas-bagian-tumbuhan | t-seledri, i-warna | "Batang" seledri secara ilmiah tangkai daun | diperbaiki (keputusan koordinator): contoh diganti bunga krisan putih di air berwarna (warna naik lewat batang — benar secara fakta); pilihan soal kini batang, daun, akar (bunga dibuang karena bunga tempat warna terlihat); catatan kurikulum SAINS-SD3 TUMBUHAN.01 disesuaikan |
| 5 | sd2-sains-hewan-tumbuh-besar | bebek-muda "bulu putih tumbuh" | Asumsi bebek putih | ditolak: urutan tetap jelas |

## Kalimat suara berubah

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd1-sains-butuh-listrik-rumah | instruksi | Alat ini bekerja dengan listrik atau tidak? Taruh ke raknya. | Apakah tiap alat butuh listrik untuk bekerja? Taruh ke rak butuh listrik atau tanpa listrik. |
| sd1-sains-butuh-listrik-sekolah | instruksi | Mana yang butuh listrik di sekolah? Taruh ke raknya. | Taruh tiap alat di sekolah ke rak butuh listrik atau tanpa listrik. |
| sd1-sains-dorong-tarik-taman | instruksi | Lihat gerakan anak di taman. Itu dorong atau tarik? | Lihat gerakan anak di taman. Taruh tiap gerakan ke rak dorong atau tarik. |
| sd1-sains-gelinding-luncur-putar | instruksi | Bagaimana tiap benda bergerak? Taruh ke rak menggelinding, meluncur, atau berputar. | Bagaimana tiap benda bergerak? Taruh ke rak cara geraknya. |
| sd1-sains-gerak-taman-kota | instruksi | Lihat cara tiap benda bergerak. Taruh ke rak menggelinding, meluncur, atau berputar di tempat. | Lihat cara tiap benda bergerak, lalu taruh ke rak cara geraknya. |
| sd1-sains-gerak-taman-kota | i-kaleng | kaleng bulat tergeletak di papan miring | kaleng bulat menuruni papan miring |
| sd1-sains-makan-hewan-peliharaan | i-pepaya | potongan pepaya | gabah |
| sd1-sains-makan-hewan-peternakan | i-kubis | daun kubis | daun jeruk |
| sd1-sains-makan-hewan-peternakan | i-tulip | bunga tulip | bunga melati |
| sd1-sains-tebak-panas-matahari | t-es | Es batu mana yang paling cepat mencair? | Di mana es batu paling cepat mencair? |
| sd1-sains-tebak-panas-matahari | t-jemuran | Baju basah mana yang paling cepat kering? | Di mana baju basah paling cepat kering? |
| sd1-sains-tebak-panas-matahari | t-cokelat | Cokelat mana yang paling cepat lembek? | Di mana cokelat paling cepat lembek? |
| sd1-sains-tebak-panas-matahari | t-genangan | Genangan air hujan mana yang paling cepat hilang? | Di mana genangan air hujan paling cepat hilang? |
| sd1-sains-tebak-panas-matahari | t-batu | Batu mana yang paling hangat saat dipegang siang hari? | Siang hari, batu di mana yang paling hangat saat dipegang? |
| sd1-sains-ubah-bentuk-taman-bermain | i-pel | kain pel diperas | kain pel diperas dengan diputar |
| sd2-sains-alami-atau-buatan-dapur | instruksi | Lihat bahan-bahan di dapur. Bahan ini langsung dari alam atau dibuat manusia? Taruh ke raknya. | Lihat bahan-bahan di dapur. Taruh tiap bahan ke rak alami atau buatan manusia. |
| sd2-sains-aman-dengan-listrik | instruksi | Saat memakai alat listrik di rumah dan saat bermain, kebiasaan ini aman atau berbahaya? Taruh ke raknya. | Saat memakai alat listrik di rumah dan saat bermain, apakah tiap kebiasaan aman atau berbahaya? Taruh ke raknya. |
| sd2-sains-aman-listrik-di-luar | instruksi | Di luar rumah ada kabel, gardu listrik, dan petir. Kebiasaan ini aman atau berbahaya? Taruh ke raknya. | Di luar rumah ada kabel, gardu listrik, dan petir. Apakah tiap kebiasaan aman atau berbahaya? Taruh ke raknya. |
| sd2-sains-bahan-baru-atau-bisa-kembali | instruksi | Setelah berubah, bisakah dikembalikan? Taruh ke raknya. | Lihat tiap perubahan. Bisakah bahannya kembali seperti semula? Taruh ke rak jadi bahan baru atau bisa dikembalikan. |
| sd2-sains-gaya-di-lapangan-olahraga | instruksi | Gaya ini mengubah gerak atau bentuk? Taruh ke raknya. | Lihat tiap kejadian. Gayanya mengubah gerak atau bentuk? Taruh ke raknya. |
| sd2-sains-gaya-di-lapangan-olahraga | i-gawang | bola ditangkap jaring gawang | menendang bola supaya berbelok |
| sd2-sains-habitat-hewan-dan-tumbuhan | i-penguin | penguin kaisar | serigala kutub |
| sd2-sains-panas-kering-sejuk-lembap | instruksi | Rasakan tiap tempat, lalu taruh ke rak panas-kering atau sejuk-lembap. | Bayangkan berada di tiap tempat, lalu taruh ke rak panas-kering atau sejuk-lembap. |
| sd2-sains-penutup-tubuh-kebun-binatang | judul | Kulit Hewan di Kebun Binatang | Penutup Tubuh Hewan di Kebun Binatang |
| sd2-sains-penutup-tubuh-peternakan | instruksi | Lihat kulit tiap hewan, lalu taruh ke rak penutup tubuhnya. | Lihat penutup tubuh tiap hewan, lalu taruh ke raknya. |
| sd2-sains-rawat-atau-rusak-kota | instruksi | Kegiatan ini merawat atau merusak lingkungan? Taruh ke raknya. | Apakah tiap kegiatan merawat atau merusak lingkungan? Taruh ke raknya. |
| sd2-sains-rawat-atau-rusak-kota | i-asap | mobil berasap hitam | memakai mobil yang berasap hitam |
| sd2-sains-rawat-atau-rusak-sungai-pantai | instruksi | Di sungai dan pantai: kegiatan ini merawat atau merusak? Taruh ke raknya. | Di sungai dan pantai, apakah tiap kegiatan merawat atau merusak? Taruh ke raknya. |
| sd2-sains-sifat-yang-dibutuhkan | instruksi | Pikirkan tugas tiap benda, lalu taruh ke sifat yang paling dibutuhkannya. | Pikirkan tugas tiap benda, lalu taruh ke rak sifat yang paling dibutuhkannya. |
| sd2-sains-sifat-yang-dibutuhkan | i-toples | toples kaca | kaca pembesar |
| sd2-sains-sumber-cahaya-malam | instruksi | Di luar malam hari, mana yang membuat cahaya sendiri? Taruh ke raknya. | Di luar malam hari, mana yang membuat cahaya sendiri? Taruh tiap benda ke rak sumber cahaya atau bukan. |
| sd2-sains-sumber-cahaya-rumah | instruksi | Benda ini membuat cahaya sendiri? Taruh ke raknya. | Apakah tiap benda membuat cahaya sendiri? Taruh ke rak sumber cahaya atau bukan. |
| sd3-sains-bagian-tumbuhan-bekerja | t-seledri | Seledri ditaruh di air berwarna merah. Besoknya daunnya kemerahan. Warnanya naik lewat mana? | Bunga krisan putih ditaruh di air berwarna merah. Besoknya kelopaknya kemerahan. Warnanya naik lewat bagian mana? |
| sd3-sains-cek-tebakan-lab | instruksi | Dengarkan tebakan sebelum percobaan dan hasil percobaannya. Apakah hasilnya mendukung tebakan? | Dengarkan tebakan sebelum percobaan dan hasil percobaannya. Apakah hasilnya mendukung tebakan? Sentuh jawabanmu. |
| sd3-sains-fosil-atau-bukan | instruksi | Fosil adalah jejak makhluk zaman dulu di batu. Taruh tiap temuan ke raknya. | Fosil adalah jejak atau sisa makhluk zaman dulu yang membatu. Taruh tiap temuan ke rak fosil atau bukan fosil. |
| sd3-sains-hasil-dukung-tebakan | instruksi | Dengarkan tebakan dan hasilnya. Mendukung atau tidak? | Dengarkan tebakan dan hasilnya. Apakah hasilnya mendukung tebakan? Sentuh jawabanmu. |
| sd3-sains-logam-ditarik-magnet-bengkel | instruksi | Di bengkel ada banyak benda logam. Dekatkan magnet ke tiap benda: ditarik atau tidak? Taruh ke raknya. | Di bengkel ada banyak benda logam. Bayangkan magnet didekatkan ke tiap benda: ditarik atau tidak? Taruh ke raknya. |
| sd3-sains-logam-ditarik-magnet | instruksi | Apakah semua logam ditarik magnet? Dekatkan magnet ke tiap benda, lalu taruh ke rak ditarik atau tidak ditarik. | Apakah semua logam ditarik magnet? Bayangkan magnet didekatkan ke tiap benda, lalu taruh ke rak ditarik atau tidak ditarik. |
| sd3-sains-rak-tugas-bagian-tumbuhan | i-warna | air berwarna naik di seledri | jalan air berwarna menuju kelopak krisan putih |
| sd3-sains-tebak-bibit-kebun-sekolah | instruksi | Tebak dulu: bibit mana yang tetap sehat dan mana yang akan layu? | Tebak dulu: taruh tiap bibit ke rak tetap sehat atau akan layu. |
| sd3-sains-tebak-bibit-kebun-sekolah | i-pot | bibit di pot dekat jendela kelas | bibit di pot dekat jendela kelas, disiram rutin |
| sd3-sains-tebak-tanaman-sehat | i-taman | pot di taman kena cahaya pagi | pot di taman kena cahaya pagi, tanahnya lembap |
| sd3-sains-tebak-tanaman-sehat | i-kelas | pot di kelas terang dan sejuk | pot di kelas terang dan sejuk, disiram secukupnya |
| sd1-sains-ukur-kubus-temuan-kebun | instruksi | Sejajarkan ujung temuan dengan kubus nomor satu, lalu baca ujung satunya. | Hitung kubus yang ada tepat di bawah temuan, dari ujung ke ujung, lalu pilih angkanya. |
| sd1-sains-bunyi-dekat-jauh-jalan | kereta-1 | anak di peron stasiun | anak di peron, di samping kereta |
| sd1-sains-bunyi-dekat-jauh-jalan | kereta-2 | anak di parkiran stasiun | anak di ujung peron |
| sd1-sains-bunyi-dekat-jauh-jalan | kereta-3 | anak di pasar dekat stasiun | anak di parkiran stasiun |
| sd1-sains-bunyi-dekat-jauh-jalan | kambing-2 | anak di halaman belakang | anak beberapa langkah dari kandang |
| sd1-sains-bunyi-dekat-jauh-jalan | kucing-2 | anak di tengah halaman | anak beberapa langkah dari pagar |
| sd1-sains-bunyi-dekat-jauh-jalan | kucing-3 | anak di teras | anak di ujung jalan |
| sd1-sains-bunyi-dekat-jauh-jalan | kucing-4 | anak di ujung jalan | anak di lapangan kampung sebelah |
| sd1-sains-bunyi-makin-jauh-makin-pelan | instruksi | Susun dari yang mendengar paling keras sampai paling pelan. | Susun anak dari yang mendengar paling keras sampai paling pelan. |
| sd1-sains-bunyi-makin-jauh-makin-pelan | bel-p2 | anak di lapangan | anak beberapa langkah dari bel |
| sd1-sains-bunyi-makin-jauh-makin-pelan | ayam-p2 | anak di teras | anak beberapa langkah dari kandang |
| sd1-sains-bunyi-makin-jauh-makin-pelan | ayam-p3 | anak di ujung kebun | anak di ujung kampung |
| sd1-sains-bunyi-makin-jauh-makin-pelan | eskrim-p2 | anak di depan rumah | anak beberapa langkah dari mobil |
| sd1-sains-bunyi-makin-jauh-makin-pelan | drum-p3 | anak di parkiran | anak di ujung lapangan yang jauh dari panggung |
| sd1-sains-bunyi-makin-jauh-makin-pelan | drum-p4 | anak di luar pagar | anak di kampung sebelah |
| sd1-sains-bunyi-makin-jauh-makin-pelan | peluit-2 | anak di tengah lapangan | anak beberapa langkah dari wasit |
| sd1-sains-bunyi-makin-jauh-makin-pelan | anjing-2 | anak di halaman rumah | anak beberapa langkah dari anjing |
| sd1-sains-bunyi-makin-jauh-makin-pelan | burung-2 | anak di pagar kebun | anak beberapa langkah dari pohon |
| sd2-sains-hewan-tumbuh-besar | sapi-kecil | anak sapi menyusu | anak sapi berlari di samping induknya |
| sd2-sains-perbaiki-hewan-tumbuh-besar | sapi-kecil | anak sapi menyusu | anak sapi berlari di samping induknya |

## Butuh keputusan owner

Keempat butir sebelumnya sudah diputuskan koordinator (lihat tabel Temuan):
1. Magnet SD3: mekanik dibiarkan; **pengembangan**: mode simulasi dekatkan-magnet (3Pe.03 menuntut menyelidiki).
2. Penguin: dikeluarkan dari paket habitat, diganti serigala kutub.
3. Seledri: diganti bunga krisan putih.
4. Matahari SD2: `potong: tengah`.

Tidak ada butir terbuka. Catatan audit: ERROR `judul-kembar` di sd4-sains-rantai-makanan-susun (judul EN "Who Eats Whom?" sama dengan sd3-sains-susun-rantai-makanan, yang tidak saya ubah) — milik kelompok SD4.
