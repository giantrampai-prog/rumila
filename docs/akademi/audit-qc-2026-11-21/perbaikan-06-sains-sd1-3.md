# Perbaikan QC 06 — SAINS SD1–SD3

Sumber: temuan-06-sains-sd1-3.md. 48 paket diubah, semuanya naik versi patch dari HEAD. Validasi skema: 810 paket valid, 0 error. Audit: tidak ada ERROR/WARNING untuk paket sd1–sd3 sains. Ada 9 ERROR `soal-berulang-satu-sesi` di paket milik agen lain (bayar-koin-*, bayar-rupiah-*, kasir-kembalian-*, ikan-kolam-sisa, kue-piring-sisa, sd2-kode-perbaiki-tiga-blok); paket-paket itu tidak saya sentuh.

## Diterapkan
| keparahan | paket | apa yang diubah |
|---|---|---|
| KRITIS | sd1-sains-butuh-listrik-sekolah | Terbukti: 🧮 itu sempoa. Item kalkulator diganti 🖨️ "printer" (id `printer`, kunci `i-printer`) |
| KRITIS | sd2-sains-timbang-batuan | Terbukti: batu kapur (scale 1.3) lebih ringan dari marmer (1.0), padahal massa jenisnya hampir sama. Kapur scale 1.3 → 0.8. Nilai baru: kerikil 1, kapur 2, apung 3, kali 4, batubara 5, besi 6, marmer 7, granit 8. Pasangan tipuan (apung lawan kali/marmer, batubara lawan besi/marmer) tetap ada |
| SEDANG | sd1-sains-butuh-listrik-sekolah | Item pompa 🚰 diganti 📽️ "proyektor" (id `proyektor`) |
| KECIL | sd1-sains-butuh-listrik-sekolah | peluit 🎵 → 😗 |
| SEDANG | sd1-sains-butuh-listrik-rumah | kulkas 🧊 → shape rect #eceff1 |
| SEDANG | sd1-sains-bunyi-dekat-jauh-jalan | Semua kartu pendengar jadi 🧒. Kartu yang jaraknya kabur atau terhalang dinding ditulis ulang ke posisi luar ruangan (sirene-2/4, kereta-4, terompet-2/3, bakso-2/3/4, pesawat-2/4, kambing-3/4, alarm (judul + 4 kartu), kucing-4). Mengikuti catatan kompetensi bahwa dinding tidak dipakai |
| SEDANG | sd1-sains-gelinding-luncur-putar | gasing 🛞 → 🚲 dengan label "roda sepeda terbalik diputar" |
| KECIL | sd1-sains-gelinding-luncur-putar | label jeruk jadi "jeruk jatuh di lantai miring" |
| SEDANG | sd1-sains-makan-hewan-peliharaan | "cacing kecil" 🪱 → "kutu air" (shape circle #e57373 scale 0.5) |
| SEDANG | sd1-sains-makan-hewan-peternakan | semanggi 🍀 → 🌿 #558b2f "rumput gajah" (kubis dibiarkan) |
| SEDANG | sd1-sains-benda-atau-bahan, sd1-sains-benda-atau-bahan-sekolah | logam 🔩/⚙️ → shape square #90a4ae |
| KECIL | sd1-sains-rak-tujuh-bahan-rumah | label panci jadi "wajan" |
| KECIL | sd1-sains-rak-tujuh-bahan-sekolah | rak 🗄️ → shape rect #a1887f |
| KECIL | sd1-sains-menyerap-air-atau-tidak | kapas ☁️ → shape circle #fafafa; sepatu bot diberi color #ffd600 |
| KECIL | sd1-sains-dorong-tarik-taman | ayunan 🎠 → shape rect #ffb74d |
| SEDANG | sd1-sains-air-atau-daratan-dari-pesawat | kebun teh 🍵 → 🌿 #2e7d32 |
| KECIL | sd1-sains-berbunyi-atau-diam-jalan | tiang 🏮 → rect #bdbdbd (abu-abu, sama dengan kartu diam lain); kentongan 🎋 → rect #a1887f |
| KECIL | sd1-sains-cepat-atau-lambat-hangat | instruksi ditulis ulang (ID+EN) |
| KECIL | sd1-sains-ukur-jengkal-temuan-kebun | label "daun pisang" jadi "sobekan daun pisang" |
| SEDANG | sd2-sains-perjalanan-matahari-sehari, sd2-sains-perbaiki-perjalanan-matahari | `steps.default` 3 → 4; keterangan knob dibetulkan |
| KECIL (keputusan, aman) | sd2-sains-hewan-tumbuh-besar | `steps.default` 3 → 4 supaya tahap dewasa ikut tampil, sesuai instruksi "sampai dewasa" |
| SEDANG | sd2-sains-penutup-tubuh-kebun-binatang | salamander 🦎 → 🐸 #558b2f "katak sawah" (bukan "kodok buduk", karena kulit kodok kering, tidak cocok untuk rak "berkulit lembap") |
| SEDANG | sd2-sains-habitat-hewan-dan-tumbuhan | anjing laut → 🦊 #fafafa "rubah kutub"; penguin → "penguin kaisar"; kalajengking → "kalajengking gurun" (emoji tetap) |
| SEDANG | sd2-sains-habitat-sekitar-rumah | kelabang 🐛 → 🐌 "siput di bawah batu lembap"; lumut dihapus (item + kunci); kumbang → "kumbang yang bersembunyi di bawah batu". Stok sisa 11 item, rak batu masih punya 2 |
| KECIL | sd2-sains-panas-kering-sejuk-lembap | bawahbatu 🪨 → 🟫 #6d4c41 |
| KECIL | sd2-sains-tempat-panas-sejuk-bukit | judul "Panas atau Sejuk di Sekitarku?"; gurun → 🏖️ "pasir pantai siang hari" (🛖 tidak dipakai karena itu gubuk, bukan genting) |
| KECIL | sd2-sains-alami-atau-buatan-dapur | foil 🪙 → rect #e0e0e0 |
| SEDANG (keputusan, aman) | sd2-sains-alami-atau-buatan-dapur | Label benda diganti ke nama bahan supaya cocok dengan instruksi "Bahan ini…": keramik, kaca, busa spons, kertas tisu |
| SEDANG | sd2-sains-sifat-yang-dibutuhkan | selang → 🪢 "tali jemuran"; toples → "toples kaca" (tidak memakai "supaya kuenya terlihat" karena itu membocorkan jawaban) |
| KECIL | sd2-sains-sifat-yang-dibutuhkan | lap dapur 🧻 → rect #ffcc80 |
| KECIL | sd2-sains-penyebab-gerak-taman-bermain | "bola salju pasir" jadi "bola pasir"; kincir akhir 🎡 → 🌀 |
| KECIL | sd2-sains-penyebab-gerak | ayunan akhir 🎠 → rect #ffb74d |
| SEDANG | sd2-sains-rawat-atau-rusak-sungai-pantai | pungut 🛍️ → 🧤 |
| SEDANG | sd2-sains-pola-pengamatan-kebun | Awalan angka (hari/pukul/menit/minggu) dihapus dari 5 urutan (ID+EN); kartu apel c/d diperjelas |
| SEDANG | sd3-sains-kelompok-hewan | salamander 🦎 → 🐸 #5d4037 "kodok" (tetap amfibi) |
| SEDANG | sd3-sains-padat-cair-gas-halaman | bola → 🔮 "kelereng" |
| SEDANG (keputusan, aman) | sd3-sains-padat-cair-gas-dapur | "uap air dari panci" ♨️ → 🫙 "udara di dalam toples kosong", karena uap yang terlihat itu titik air, bukan gas |
| KECIL | sd3-sains-padat-cair-gas-dapur, sd3-sains-larut-atau-tidak | gula 🍚 → shape circle #fafafa scale 0.5 |
| SEDANG | sd3-sains-pisahkan-campuran | Soal paku dan soal jepit: "ayakan" dibuang dari pilihan, jadi tinggal magnet dan kain saring. Kalimat soal tetap. Item ayakan 🥅 → circle #bcaaa4; kain saring 🧻 → square #fafafa |
| SEDANG | sd3-sains-rak-alat-pemisah | paku jadi "manik-manik plastik + mur baja kecil" (ukurannya mirip, jadi tidak bisa diayak); item jepit dihapus. Usulan "tepung + jarum kecil" tidak dipakai karena jarum masih tertahan ayakan. Ikon rak ayakan/saring diganti bentuk seperti di atas |
| SEDANG | sd3-sains-larut-mengendap-lab | label rak "tidak larut, mengendap" jadi "tidak larut" |
| SEDANG | sd3-sains-tembus-cahaya-di-sekolah, sd3-sains-tembus-pandang-cahaya-tidak | tirai/gorden 🪟 → rect #f8bbd0 |
| KECIL | sd3-sains-perbaiki-urutan-bayangan | urutan gelas: emoji ☕, label "cangkir" (EN sudah "cup") |
| SEDANG | sd3-sains-logam-ditarik-magnet | foil 🪙 → rect #e0e0e0 |
| KECIL | sd3-sains-logam-ditarik-magnet | tutup botol ⚙️ → circle #b0bec5 scale 0.6 |
| KECIL | sd3-sains-logam-ditarik-magnet-bengkel | panci → "wajan aluminium" |
| KECIL | sd3-sains-bentuk-bulan-berubah, sd3-sains-perbaiki-bentuk-bulan | judul "tiap malam" jadi "dilihat beberapa malam sekali". t-terang-lanjut/t-tipis-lanjut ("malam demi malam") jadi "menuju purnama"/"setelah purnama" karena masalahnya sama |
| KECIL | sd3-sains-perbaiki-siklus-hidup-kebun | keterangan knob "siklus ayam lengkap"; ayam muda 🐤 → 🐔 scale 0.9 |
| KECIL | sd3-sains-produsen-konsumen-sawah-laut | label eceng gondok jadi "teratai" agar cocok dengan 🪷 |
| KECIL | sd3-sains-hasil-dukung-tebakan | instruksi EN dibetulkan; knob `itemCount` dihapus (knobs `{}`, sama dengan cek-tebakan-lab) |

## Kalimat suara berubah (WAJIB lengkap)
| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| sd1-sains-butuh-listrik-sekolah | i-kalkulator | kalkulator | —(dihapus) |
| sd1-sains-butuh-listrik-sekolah | i-pompa | pompa air | —(dihapus) |
| sd1-sains-butuh-listrik-sekolah | i-printer | —(baru) | printer |
| sd1-sains-butuh-listrik-sekolah | i-proyektor | —(baru) | proyektor |
| sd1-sains-cepat-atau-lambat-hangat | instruksi | Tebak dulu: taruh ke rak cepat hangat-kering-meleleh, atau ke rak lambat. | Tebak dulu: mana yang cepat berubah kena Matahari, mana yang lambat? Taruh ke raknya. |
| sd1-sains-gelinding-luncur-putar | i-gasing | roda sepeda diputar | roda sepeda terbalik diputar |
| sd1-sains-gelinding-luncur-putar | i-jeruk | jeruk menggelinding di lantai | jeruk jatuh di lantai miring |
| sd1-sains-makan-hewan-peliharaan | i-jentik | cacing kecil | kutu air |
| sd1-sains-makan-hewan-peternakan | i-semanggi | daun semanggi | rumput gajah |
| sd1-sains-rak-tujuh-bahan-rumah | i-panci | panci | wajan |
| sd2-sains-alami-atau-buatan-dapur | i-botolkaca | botol kaca | kaca |
| sd2-sains-alami-atau-buatan-dapur | i-keramik | piring keramik | keramik |
| sd2-sains-alami-atau-buatan-dapur | i-spons | spons cuci piring | busa spons |
| sd2-sains-alami-atau-buatan-dapur | i-tisu | tisu | kertas tisu |
| sd2-sains-habitat-hewan-dan-tumbuhan | i-anjinglaut | anjing laut | rubah kutub |
| sd2-sains-habitat-hewan-dan-tumbuhan | i-kalajengking | kalajengking | kalajengking gurun |
| sd2-sains-habitat-hewan-dan-tumbuhan | i-penguin | penguin | penguin kaisar |
| sd2-sains-habitat-sekitar-rumah | i-kelabang | kelabang | siput di bawah batu lembap |
| sd2-sains-habitat-sekitar-rumah | i-kumbang | kumbang tanah | kumbang yang bersembunyi di bawah batu |
| sd2-sains-habitat-sekitar-rumah | i-lumut | lumut | —(dihapus) |
| sd2-sains-penutup-tubuh-kebun-binatang | i-salamander | salamander | katak sawah |
| sd2-sains-sifat-yang-dibutuhkan | i-selang | selang | tali jemuran |
| sd2-sains-sifat-yang-dibutuhkan | i-toples | toples kue | toples kaca |
| sd2-sains-tempat-panas-sejuk-bukit | i-gurun | gurun pasir siang hari | pasir pantai siang hari |
| sd2-sains-tempat-panas-sejuk-bukit | judul | Panas atau Sejuk di Bukit? | Panas atau Sejuk di Sekitarku? |
| sd3-sains-kelompok-hewan | i-salamander | salamander | kodok |
| sd3-sains-larut-mengendap-lab | b-tidak | tidak larut, mengendap | tidak larut |
| sd3-sains-logam-ditarik-magnet-bengkel | i-panci | panci aluminium | wajan aluminium |
| sd3-sains-padat-cair-gas-dapur | i-uap | uap air dari panci | udara di dalam toples kosong |
| sd3-sains-padat-cair-gas-halaman | i-bola | bola | kelereng |
| sd3-sains-produsen-konsumen-sawah-laut | i-eceng | eceng gondok | teratai |
| sd3-sains-rak-alat-pemisah | i-jepit | serbuk kayu + jepit rambut besi | —(dihapus) |
| sd3-sains-rak-alat-pemisah | i-paku | pasir + paku besi | manik-manik plastik + mur baja kecil |
| sd1-sains-ukur-jengkal-temuan-kebun | daunpisang | daun pisang | sobekan daun pisang |
| sd1-sains-bunyi-dekat-jauh-jalan | alarm-1 | anak di tempat tidur samping weker | anak di samping meja teras |
| sd1-sains-bunyi-dekat-jauh-jalan | alarm-2 | anak di pintu kamar | anak di ujung teras |
| sd1-sains-bunyi-dekat-jauh-jalan | alarm-3 | anak di dapur | anak di tengah halaman |
| sd1-sains-bunyi-dekat-jauh-jalan | alarm-4 | anak di kebun belakang rumah | anak di ujung gang |
| sd1-sains-bunyi-dekat-jauh-jalan | bakso-2 | anak di depan pagar rumah | anak beberapa langkah dari gerobak |
| sd1-sains-bunyi-dekat-jauh-jalan | bakso-3 | anak di seberang jalan | anak di ujung gang |
| sd1-sains-bunyi-dekat-jauh-jalan | bakso-4 | anak di kamar paling belakang | anak di lapangan jauh dari gang |
| sd1-sains-bunyi-dekat-jauh-jalan | kambing-3 | anak di dalam rumah | anak di jalan depan rumah |
| sd1-sains-bunyi-dekat-jauh-jalan | kambing-4 | anak di rumah tetangga jauh | anak di sawah jauh dari kandang |
| sd1-sains-bunyi-dekat-jauh-jalan | kereta-4 | anak di sekolah yang jauh | anak di lapangan sekolah yang jauh |
| sd1-sains-bunyi-dekat-jauh-jalan | kucing-4 | anak di ruang tengah rumah | anak di ujung jalan |
| sd1-sains-bunyi-dekat-jauh-jalan | pesawat-2 | anak di ruang tunggu bandara | anak di parkiran bandara |
| sd1-sains-bunyi-dekat-jauh-jalan | pesawat-4 | anak di rumah di kota sebelah | anak di lapangan di kota sebelah |
| sd1-sains-bunyi-dekat-jauh-jalan | sirene-2 | anak di depan toko | anak di trotoar beberapa langkah dari ambulans |
| sd1-sains-bunyi-dekat-jauh-jalan | sirene-4 | anak di dalam rumah di gang belakang | anak di lapangan di kampung sebelah |
| sd1-sains-bunyi-dekat-jauh-jalan | t-alarm | Jam weker berdering di kamar | Jam weker berdering di meja teras |
| sd1-sains-bunyi-dekat-jauh-jalan | terompet-2 | anak di teras rumah | anak di ujung halaman |
| sd1-sains-bunyi-dekat-jauh-jalan | terompet-3 | anak di pagar depan | anak di jalan depan rumah |
| sd2-sains-penyebab-gerak-taman-bermain | gelinding-awal | anak mendorong bola salju pasir | anak mendorong bola pasir |
| sd2-sains-pola-pengamatan-kebun | apel-a | menit 1: daging apel putih | daging apel putih |
| sd2-sains-pola-pengamatan-kebun | apel-b | menit 10: mulai kecokelatan | mulai kecokelatan |
| sd2-sains-pola-pengamatan-kebun | apel-c | menit 30: cokelat | daging apel cokelat |
| sd2-sains-pola-pengamatan-kebun | apel-d | menit 60: cokelat tua | daging apel cokelat tua |
| sd2-sains-pola-pengamatan-kebun | bungamatahari-a | minggu 1: tunas kecil | tunas kecil |
| sd2-sains-pola-pengamatan-kebun | bungamatahari-b | minggu 3: batang setinggi lutut | batang setinggi lutut |
| sd2-sains-pola-pengamatan-kebun | bungamatahari-c | minggu 6: kuncup bunga muncul | kuncup bunga muncul |
| sd2-sains-pola-pengamatan-kebun | bungamatahari-d | minggu 9: bunga mekar lebar | bunga mekar lebar |
| sd2-sains-pola-pengamatan-kebun | gelas-a | hari 1: gelas penuh air | gelas penuh air |
| sd2-sains-pola-pengamatan-kebun | gelas-b | hari 3: air berkurang | air berkurang |
| sd2-sains-pola-pengamatan-kebun | gelas-c | hari 6: air tinggal sedikit | air tinggal sedikit |
| sd2-sains-pola-pengamatan-kebun | gelas-d | hari 9: gelas kering | gelas kering |
| sd2-sains-pola-pengamatan-kebun | jagung-a | hari 1: tanah masih rata | tanah masih rata |
| sd2-sains-pola-pengamatan-kebun | jagung-b | hari 4: tunas kecil muncul | tunas kecil muncul |
| sd2-sains-pola-pengamatan-kebun | jagung-c | hari 8: daun panjang tumbuh | daun panjang tumbuh |
| sd2-sains-pola-pengamatan-kebun | jagung-d | hari 20: batang jagung tinggi | batang jagung tinggi |
| sd2-sains-pola-pengamatan-kebun | jemuran-a | pukul 7: baju basah menetes | baju basah menetes |
| sd2-sains-pola-pengamatan-kebun | jemuran-b | pukul 9: baju masih lembap | baju masih lembap |
| sd2-sains-pola-pengamatan-kebun | jemuran-c | pukul 11: baju hampir kering | baju hampir kering |
| sd2-sains-pola-pengamatan-kebun | jemuran-d | pukul 13: baju kering sekali | baju kering sekali |
| sd3-sains-bentuk-bulan-berubah | s-membesar | Bulan makin terang tiap malam | Bulan makin terang, dilihat beberapa malam sekali |
| sd3-sains-bentuk-bulan-berubah | s-mengecil | Bulan makin tipis tiap malam | Bulan makin tipis, dilihat beberapa malam sekali |
| sd3-sains-bentuk-bulan-berubah | t-terang-lanjut | Bulan makin terang, malam demi malam | Bulan makin terang menuju purnama |
| sd3-sains-bentuk-bulan-berubah | t-tipis-lanjut | Bulan makin tipis, malam demi malam | Bulan makin tipis setelah purnama |
| sd3-sains-perbaiki-bentuk-bulan | s-membesar | Bulan makin terang tiap malam | Bulan makin terang, dilihat beberapa malam sekali |
| sd3-sains-perbaiki-bentuk-bulan | s-mengecil | Bulan makin tipis tiap malam | Bulan makin tipis, dilihat beberapa malam sekali |
| sd3-sains-perbaiki-urutan-bayangan | gelas-p1 | gelas tepat di depan senter | cangkir tepat di depan senter |
| sd3-sains-perbaiki-urutan-bayangan | gelas-p2 | gelas agak dekat senter | cangkir agak dekat senter |
| sd3-sains-perbaiki-urutan-bayangan | gelas-p3 | gelas di tengah | cangkir di tengah |
| sd3-sains-perbaiki-urutan-bayangan | gelas-p4 | gelas dekat layar | cangkir dekat layar |
| sd3-sains-perbaiki-urutan-bayangan | s-gelas | Bayangan gelas | Bayangan cangkir |

## Ditolak (bukan masalah)
| temuan | alasan |
|---|---|
| sd1-sains-makan-hewan-peternakan: ganti label kubis | Opsional. Daun kubis memang makanan khas ulat; setelah semanggi diganti, jawabannya cukup tunggal |
| sd2-sains-penutup-tubuh: usulan "kodok buduk" | Diganti cara lain: kulit kodok kering, tidak cocok untuk rak "berkulit lembap". Dipakai katak sawah |
| sd3-sains-rak-alat-pemisah: usulan "tepung + jarum kecil" / "pasir halus + serbuk besi halus" | Jarum masih bisa disaring ayakan. Usulan kedua nyaris kembar dengan item serbuk yang sudah ada. Diganti manik-manik + mur, dan jepit dihapus |
| sd2-sains-tempat-panas-sejuk-bukit: usulan 🛖 "atap genting" | 🛖 itu gubuk beratap ilalang. Dipakai pasir pantai 🏖️ |

## Butuh keputusan owner
| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| KECIL | sd1-sains-dorong-tarik-rumah / GAYA.01 | 🗄️ dipakai untuk tutup laci dan buka laci (dua rak berbeda); pembedanya cuma label | Biarkan sebagai pasangan sengaja, atau ganti buka laci jadi 🫴 |
| KECIL | sd1-sains-ukur-jengkal-temuan-kebun / PENGAMATAN.01 | Kunci `batangtebu`, `bambu`, `batangpisang` yatim (itemnya sengaja dihapus di commit 40b1f78). Item terpanjang 7 padahal `maxSpans.max` 8 | Tambah lagi item bambu value 8 (cek muat di layar), atau hapus tiga kunci itu dan turunkan `maxSpans.max` ke 7 |
| SEDANG | sd2-sains-hewan-tumbuh-besar & sd2-sains-perbaiki-hewan-tumbuh-besar / TUMBUH-BESAR.01 | `scale` naik terus, jadi soal bisa dijawab hanya dengan seriasi ukuran | Samakan scale tahap 2–3 supaya anak membaca ciri tubuh |
| KECIL | sd2-sains-hitung-kaki-hewan / CIRI-HEWAN.02 | Siput di rak "tanpa kaki", padahal secara biologi punya kaki perut | Ganti dengan belut 🐍 #6d4c41, atau hapus |
| SEDANG | sd2-sains-turus-hewan-tepi-hutan / PENGAMATAN.01 | Kompetensinya tentang serangga, tetapi isi paket mamalia dan burung | Ganti ke serangga tepi hutan (kupu-kupu, lebah, kumbang, jangkrik, semut rangrang), atau ubah pernyataan jadi "hewan" |
| KECIL | sd3-sains-kelompok-hewan-penipu / HEWAN.01 | Kuda laut bergambar 🐠, jadi tidak lagi menipu | rect #ffd54f, atau biarkan |
| SEDANG | sd3-sains-fosil-atau-bukan & sd3-sains-temuan-tepi-sungai / FOSIL.01 | Semua kartu fosil berwarna cokelat batu, jadi bisa dipilah dari warnanya saja | Beri warna cokelat juga ke sebagian kartu bukan fosil, atau hilangkan pewarnaan seragam |
| KECIL | sd3-sains-licin-sampai-kasar & sd3-sains-perbaiki-licin-kasar / GAYA.01 | Benda beroda menggelinding, bukan meluncur; "karpet berbulu" lawan "jalan berkerikil" bisa diperdebatkan | Ganti benda beroda jadi kotak/buku; ganti "jalan berkerikil" jadi "kertas amplas" |
