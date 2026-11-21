# Perbaikan 09: KODE PAUD, TK A, TK B, SD1, SD2

Sumber temuan: scratchpad/qc/temuan-09-kode-paud-sd2.md. 41 berkas paket diubah. Versi patch tiap paket naik +0.0.1. Format JSON tetap sama (indent 2, Unicode apa adanya).
Validasi: `packages/schema/src/cli.ts` menyatakan 810 paket konten valid. `akademi:audit` tidak lagi memuat temuan untuk paket-paket ini. Masih ada 9 ERROR `soal-berulang-satu-sesi`, semuanya milik paket agen lain: bayar-koin-*, bayar-rupiah-*, kasir-kembalian-*, ikan-kolam-sisa, kue-piring-sisa, sains-urutkan-matahari-bumi-bulan.

## Diterapkan
| keparahan | paket | apa yang diubah |
|---|---|---|
| KRITIS | cerita-urut-peternakan | Urutan "Menyiapkan jerami" menjadi "Menyiapkan rumput": potong rumput → ikat rumput → sapi makan rumput |
| KRITIS | perbaiki-urutan-pagi | Urutan "Pagi hari": langkah 2 "gosok gigi" diganti 🛏️ "rapikan kasur" (bangun → rapikan kasur → sarapan → berangkat) |
| SEDANG | mana-dulu-alam | Pasangan berputar "malam → pagi" diganti pasangan satu arah 🧊 "es batu" → 💧 "es mencair" (Cerita es) |
| SEDANG | mana-dulu-alam | "Cerita bunga" 🌷 kuncup → 🌺 diganti 🌱 "tunas bunga" → 🌷 "bunga mekar" (temuan keputusan, tetapi aman: hanya emoji dan label) |
| SEDANG | tombol-ajaib-kamar | Alat 🌀 "kipas angin" diganti 📺 "televisi" (temuan keputusan; televisi cocok dengan "alat yang akan menyala") |
| SEDANG | sd1-kode-ya-tidak-listrik | Item 🌀 "kipas angin listrik" dihapus. Kotak "ya" masih berisi 6 item, total 13 item, itemCount maks 10 |
| SEDANG | keran-macet-minta-tolong | Judul "Alat Macet, Minta Tolong" diganti "Alat di Rumah Tidak Bekerja" (EN "The Home Gadget Won't Work") |
| SEDANG | siang-dan-malam | Makan siang: 🧼 cuci tangan → 🍚 makan → ✨ piring kosong → 🧽 cuci piring. Tidur malam: 👕 pakai piyama → 💡 matikan lampu → 😴 tidur → 🌅 bangun pagi |
| SEDANG | dari-kebun-ke-meja | Memasak sayur: 🛒 beli sayur → 🔪 potong → 🍲 masak → 🍽️ sajikan. Cerita wortel: "cuci wortel" diganti 💧 "siram setiap hari" di posisi 2, sehingga tetap 5 langkah dan knob 5 masih punya 2 urutan |
| SEDANG | hujan-dan-pesta-ulang-tahun | Pesta ulang tahun: 🎂 kue datang → 🕯️ pasang lilin → 💨 tiup lilin → 🍰 potong kue → 😋 makan kue |
| SEDANG | cerita-urut-peternakan | Kuda: 🥕 beri wortel → 😋 kuda mengunyah → 🐴 kuda kenyang. Kelinci: 🥬 taruh sayur di kandang → 🐰 kelinci mendekat → 😋 kelinci makan sayur |
| SEDANG | perbaiki-urutan-pagi | Robot mandi: 🧺 "ambil handuk" diganti 👕 "siapkan baju ganti" |
| SEDANG | belok-dua-kali-taman | Judul diganti "Belok Menuju Bintang" (EN "Turn to the Star") |
| SEDANG | program-panjang-jadi-pendek | 3 peta maju-kanan-dua-kali* (opt 3, rak 3, bisa diselesaikan tanpa ulangi) dihapus. Sisa 23 peta lurus dengan rak 2 yang memang membutuhkan ulangi (temuan keputusan, opsi "hapus peta") |
| SEDANG | kue-tiga-tahap | "tuang tepung ke mangkuk" diganti "campur tepung dengan telur". "tuang susu" diganti "aduk susu ke adonan" |
| SEDANG | kue-tiga-tahap-urut | Kue: 🧼 cuci tangan → 🌾 ambil tepung dan telur → … Roti: 🧼 cuci tangan → 🌾 ambil tepung dan ragi → … Emoji ragi 🧂 ikut hilang |
| SEDANG | kue-tiga-tahap-urut | Instruksi diganti "Susun enam langkah membuat kue dari awal sampai matang." Hanya teksnya. Soal pemindahan kompetensi tetap jadi keputusan owner, lihat bawah |
| SEDANG | sd1-kode-kabel-tanpa-kabel | Item 📡 "remote TV" diganti 🚁 "drone mainan" (nirkabel) |
| SEDANG | sd1-kode-sambungan-perangkat | Item "lampu belajar dengan kabel listrik" diganti 🖱️ "mouse dengan kabel ke laptop" |
| SEDANG | sd2-kode-perbaiki-tiga-blok | Peta opt 4–6 dihapus, sisa 7 peta opt 7–8. Ditambah 7 peta cermin (x dicerminkan, E↔W, kiri↔kanan di program), sehingga ada 14 peta dan audit tidak lagi melaporkan soal berulang. Knob panjang 7–8, bawaan 7 (tidak ada peta opt 9) |
| SEDANG | sd2-kode-kartu-tugas-kelas | Merebus telur: 🍲 masukkan telur ke panci air → 🔥 nyalakan kompor → ♨️ tunggu air mendidih → ⏲️ rebus sepuluh menit → 🛑 matikan kompor → 🧊 rendam di air dingin → 🥚 kupas kulit telur. Pasangan telur/air digabung, emoji 🍳 diganti 🥚 |
| SEDANG | sd2-kode-tahap-game-mini | "pilih warna latar" diganti 🗒️ "tulis daftar tokoh yang dibutuhkan" → rancang |
| SEDANG | sd2-kode-carroll-laut-kaki | Item 🐌 "siput kebun" dihapus. Kotak darat-tanpa masih berisi ular dan cacing (temuan keputusan, opsi "hapus") |
| SEDANG | sd2-kode-carroll-roda-mesin | "skuter" diganti "skuter dorong" |
| KECIL | berangkat-sekolah | EN instruksi: "Put the pictures in order to get to school the right way." |
| KECIL | tombol-bengkel-robot | Instruksi: "Coba tiap tombol dulu. Lalu tunjuk alat yang akan bekerja sebelum menekan lagi." |
| KECIL | dari-kebun-ke-meja | Instruksi: "… dari kebun sampai ke meja makan." |
| KECIL | cerita-pertama-lalu-terakhir, cerita-urut-peternakan | Instruksi: "Tempel label pertama, lalu, dan terakhir di bawah gambar[ peternakan]. Setelah itu tekan Ceritakan." |
| KECIL | grid-3x3-dua-belokan | Knob distance diubah ke 5–5, bawaan 5. 4 peta tanpa-tembok dihapus, sisa 12 peta bertembok. EN "the robot" (temuan keputusan) |
| KECIL | grid-3x3-satu-belokan | Hanya peta 3×3 yang dipertahankan (12 dari 23, opt 3/4/5 masih ada). Keterangan knob turns: "jumlah belokan di jalur: 1 → 2". EN "the robot" |
| KECIL | robot-maju-langsung, belok-dua-kali-taman, perbaiki-satu-langkah, ulangi-tiga-ke-kanan, tebak-petak-berikutnya, program-panjang-jadi-pendek, grid-3x3-* | EN instruksi: "robot" diganti "the robot". "so he reaches" diganti "so it reaches" |
| KECIL | ulangi-berapa-kali-lurus | 4 peta lurus-2* (bisa diselesaikan dengan "maju, maju" tanpa ulangi) dihapus. Knob distance min 2 → 3 (temuan keputusan, opsi "keluarkan peta") |
| KECIL | ringkas-program-ulangi, tebak-petak-angkasa, cari-blok-penabrak, bendera-jalan-kota | Instruksi dipendekkan sesuai usulan (ID dan EN) |
| KECIL | grid-4x4-dua-belokan | Judul diganti "Program Sampai Delapan Blok" (EN "Programs of Up to Eight Blocks") |
| KECIL | kue-tiga-tahap | "cupcake matang" diganti "kue mangkuk matang" |
| KECIL | sd1-kode-algoritma-sehari-hari | Mencuci mobil: ☀️ "jemur sampai kering" diganti 🧻 "lap sampai kering" |
| KECIL | sd1-kode-tukar-langkah-taman | 🍚 diganti 🌾 untuk "takar beras". 🧺 diganti 🪣 untuk "bawa ember baju basah" |
| KECIL | sd2-kode-kartu-langkah | ⏻ diganti 🔘 untuk "tekan tombol daya". "kembalikan sebelum tanggalnya" diganti "kembalikan sebelum batas waktu" |
| KECIL | sd2-kode-kartu-tugas-kelas | "tulis alamat di kardus yang sudah tertutup" diganti "tulis alamat di kardus tertutup" (4 kata). Tidak memakai usulan "di atas kardus", supaya langkah ini tetap terkunci setelah "tutup kardus" |
| KECIL | sd2-kode-carroll-roda-mesin | Instruksi "tiap kendaraan" diganti "tiap benda" |
| KECIL | sd2-kode-perangkat-masuk-tampil | 📢 "pengeras suara" diganti 🔊 "speaker komputer" |
| KECIL | sd2-kode-kalau-belok-pantai | Instruksi "Karang …" diganti "Batu karang …" |
| KECIL | sd2-kode-tahap-game-buah | "dobel" diganti "ganda" |

## Kalimat suara berubah (WAJIB lengkap)
| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| belok-dua-kali-taman | judul | Belok Dua Kali | Belok Menuju Bintang |
| bendera-jalan-kota | instruksi | Jalan ke bintang di kota ini berbelok melewati gedung, dan rak cuma muat empat blok: pilih petak bendera, lalu buat program ke bendera dan dari bendera ke bintang. | Rak cuma muat empat blok: pilih petak bendera, lalu buat dua program. |
| cari-blok-penabrak | instruksi | Sebelum menekan jalan, baca programnya dan cari blok yang akan membuat robot menabrak dinding, lalu ganti blok itu supaya robot sampai bintang. | Baca programnya, cari blok yang membuat robot menabrak, lalu ganti. |
| cerita-pertama-lalu-terakhir | instruksi | Tempel label pertama, lalu, dan terakhir di bawah gambar, lalu tekan Ceritakan supaya robot bercerita. | Tempel label pertama, lalu, dan terakhir di bawah gambar. Setelah itu tekan Ceritakan. |
| cerita-urut-peternakan | instruksi | Tempel label pertama, lalu, dan terakhir di bawah gambar peternakan, lalu tekan Ceritakan supaya robot bercerita. | Tempel label pertama, lalu, dan terakhir di bawah gambar peternakan. Setelah itu tekan Ceritakan. |
| cerita-urut-peternakan | kuda-sikat | sikat bulu kuda | (dihapus) |
| cerita-urut-peternakan | kuda-tunggang | naik kuda | (dihapus) |
| cerita-urut-peternakan | t-jerami | Menyiapkan jerami | Menyiapkan rumput |
| cerita-urut-peternakan | jerami-ikat | ikat jadi jerami | ikat rumput |
| cerita-urut-peternakan | jerami-makan | sapi makan jerami | sapi makan rumput |
| cerita-urut-peternakan | kelinci-bersih | bersihkan kandang | (dihapus) |
| cerita-urut-peternakan | kelinci-sayur | beri sayur | (dihapus) |
| cerita-urut-peternakan | kelinci-elus | elus kelinci | (dihapus) |
| cerita-urut-peternakan | kuda-kunyah | (baru) | kuda mengunyah |
| cerita-urut-peternakan | kuda-kenyang | (baru) | kuda kenyang |
| cerita-urut-peternakan | kelinci-taruh | (baru) | taruh sayur di kandang |
| cerita-urut-peternakan | kelinci-dekat | (baru) | kelinci mendekat |
| cerita-urut-peternakan | kelinci-makan | (baru) | kelinci makan sayur |
| dari-kebun-ke-meja | instruksi | Susun gambar supaya ceritanya urut dari menanam sampai memanen. | Susun gambar supaya ceritanya urut dari kebun sampai ke meja makan. |
| dari-kebun-ke-meja | cuci | cuci sayur | (dihapus) |
| dari-kebun-ke-meja | wortel-cuci | cuci wortel | (dihapus) |
| dari-kebun-ke-meja | beli | (baru) | beli sayur |
| dari-kebun-ke-meja | wortel-siram | (baru) | siram setiap hari |
| grid-4x4-dua-belokan | judul | Program Delapan Blok | Program Sampai Delapan Blok |
| hujan-dan-pesta-ulang-tahun | hias | pasang balon | (dihapus) |
| hujan-dan-pesta-ulang-tahun | lilin | (baru) | pasang lilin |
| keran-macet-minta-tolong | judul | Alat Macet, Minta Tolong | Alat di Rumah Tidak Bekerja |
| kue-tiga-tahap-urut | instruksi | Susun enam langkah membuat kue: dua langkah siapkan, dua campur, dua panggang. | Susun enam langkah membuat kue dari awal sampai matang. |
| kue-tiga-tahap-urut | tepung | ambil tepung | (dihapus) |
| kue-tiga-tahap-urut | telur | ambil telur | (dihapus) |
| kue-tiga-tahap-urut | ragi | ambil ragi | (dihapus) |
| kue-tiga-tahap-urut | tepung-telur | (baru) | ambil tepung dan telur |
| kue-tiga-tahap-urut | cuci | (baru) | cuci tangan |
| kue-tiga-tahap-urut | tepung-ragi | (baru) | ambil tepung dan ragi |
| kue-tiga-tahap | tuang | tuang susu | aduk susu ke adonan |
| kue-tiga-tahap | i-tepungmangkuk | tuang tepung ke mangkuk | campur tepung dengan telur |
| kue-tiga-tahap | i-cupcake | cupcake matang | kue mangkuk matang |
| mana-dulu-alam | t_pagi | Cerita pagi | (dihapus) |
| mana-dulu-alam | s_pagi_malam | malam | (dihapus) |
| mana-dulu-alam | s_pagi_pagi | pagi | (dihapus) |
| mana-dulu-alam | s_bunga2_kuncup | kuncup | tunas bunga |
| mana-dulu-alam | t_es | (baru) | Cerita es |
| mana-dulu-alam | s_es_batu | (baru) | es batu |
| mana-dulu-alam | s_es_cair | (baru) | es mencair |
| perbaiki-urutan-pagi | gosok | gosok gigi | (dihapus) |
| perbaiki-urutan-pagi | handuk | ambil handuk | (dihapus) |
| perbaiki-urutan-pagi | kasur | (baru) | rapikan kasur |
| perbaiki-urutan-pagi | baju | (baru) | siapkan baju ganti |
| ringkas-program-ulangi | instruksi | Program robot di taman ini kepanjangan: cari bagian yang berulang, ganti dengan blok ulangi supaya muat di rak dan jalannya tetap sama. | Program ini kepanjangan: ganti bagian yang berulang dengan blok ulangi. |
| sd1-kode-algoritma-sehari-hari | cuci-mobil-4 | jemur sampai kering | lap sampai kering |
| sd1-kode-kabel-tanpa-kabel | i-tv-remote | remote TV | (dihapus) |
| sd1-kode-kabel-tanpa-kabel | i-toy-drone | (baru) | drone mainan |
| sd1-kode-sambungan-perangkat | i-lampu | lampu belajar dengan kabel listrik | (dihapus) |
| sd1-kode-sambungan-perangkat | i-mouse-kabel | (baru) | mouse dengan kabel ke laptop |
| sd1-kode-ya-tidak-listrik | i-electric-fan | kipas angin listrik | (dihapus) |
| sd2-kode-carroll-laut-kaki | i-siput | siput kebun | (dihapus) |
| sd2-kode-carroll-roda-mesin | instruksi | Jawab dua pertanyaan untuk tiap kendaraan: punya roda? pakai mesin? Lalu taruh di kotak yang cocok. | Jawab dua pertanyaan untuk tiap benda: punya roda? pakai mesin? Lalu taruh di kotak yang cocok. |
| sd2-kode-carroll-roda-mesin | i-kick-scooter | skuter | skuter dorong |
| sd2-kode-kalau-belok-pantai | instruksi | Karang di tiga jalur pantai ini pindah-pindah. Susun satu program: ulangi berisi kalau, belok, lalu ulangi berisi kalau lagi. | Batu karang di tiga jalur pantai ini pindah-pindah. Susun satu program: ulangi berisi kalau, belok, lalu ulangi berisi kalau lagi. |
| sd2-kode-kartu-langkah | perpustakaan-7 | kembalikan sebelum tanggalnya | kembalikan sebelum batas waktu |
| sd2-kode-kartu-tugas-kelas | paket-3 | tulis alamat di kardus yang sudah tertutup | tulis alamat di kardus tertutup |
| sd2-kode-kartu-tugas-kelas | telur-rebus-1 | masukkan telur ke panci | masukkan telur ke panci air |
| sd2-kode-kartu-tugas-kelas | telur-rebus-2 | tuang air sampai telur terendam | nyalakan kompor |
| sd2-kode-kartu-tugas-kelas | telur-rebus-3 | nyalakan kompor | tunggu air mendidih |
| sd2-kode-kartu-tugas-kelas | telur-rebus-4 | tunggu air mendidih | rebus sepuluh menit |
| sd2-kode-kartu-tugas-kelas | telur-rebus-5 | rebus sepuluh menit | matikan kompor |
| sd2-kode-kartu-tugas-kelas | telur-rebus-6 | matikan kompor | rendam di air dingin |
| sd2-kode-perangkat-masuk-tampil | i-toa | pengeras suara | (dihapus) |
| sd2-kode-perangkat-masuk-tampil | i-speaker | (baru) | speaker komputer |
| sd2-kode-tahap-game-buah | i-p-dobel | hapus buah yang muncul dobel | hapus buah yang muncul ganda |
| sd2-kode-tahap-game-mini | i-choose-the-background-colors | pilih warna latar | (dihapus) |
| sd2-kode-tahap-game-mini | i-list-the-characters-needed | (baru) | tulis daftar tokoh yang dibutuhkan |
| siang-dan-malam | ambil | ambil piring | (dihapus) |
| siang-dan-malam | sikat | sikat gigi | (dihapus) |
| siang-dan-malam | cuci-piring | (baru) | cuci piring |
| siang-dan-malam | bangun-pagi | (baru) | bangun pagi |
| tebak-petak-angkasa | instruksi | Robot terbang di angkasa mengikuti program. Sebelum tiap blok dijalankan, tunjuk petak tempat robot akan berada, lalu tekan langkah. | Sebelum tiap blok jalan, tunjuk petak tujuan robot, lalu tekan langkah. |
| tombol-ajaib-kamar | kipas | kipas angin | (dihapus) |
| tombol-ajaib-kamar | televisi | (baru) | televisi |
| tombol-bengkel-robot | instruksi | Robot lupa tombol mana untuk apa, coba dulu, lalu tunjuk alat yang akan menyala sebelum menekan lagi. | Coba tiap tombol dulu. Lalu tunjuk alat yang akan bekerja sebelum menekan lagi. |

Catatan: kunci yang hanya berganti emoji atau urutan, dengan teks tetap, tidak dicantumkan (mis. siang-dan-malam "matikan lampu", hujan-dan-pesta "tiup lilin", cerita-urut-peternakan "beri wortel", sd2-kode-kartu-tugas-kelas telur-rebus-7 "kupas kulit telur").

## Ditolak (bukan masalah)
| temuan | alasan |
|---|---|
| sd1-kode-kabel-tanpa-kabel tablet 📲 diganti 📱 | 📱 sudah dipakai item "ponsel" di paket yang sama, jadi dua item akan bergambar sama. 📲 tetap terlihat sebagai gawai layar dan berbeda dari ponsel. Tidak ada emoji tablet, dan skema tidak punya shape ikon buatan sendiri |
| sd1-kode-tukar-langkah-taman 🧺 "keringkan dengan handuk", sd2-kode-kartu-tugas-kelas 🧺 "kumpulkan debu dengan pengki" | Belum dikerjakan. Tidak ada emoji handuk atau pengki, dan Visual.shape hanya circle/square/triangle/rect/star/berudu. Butuh aset ikon, sudah dimasukkan ke keputusan owner |

## Butuh keputusan owner
| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| SEDANG | ulangi-maju-dan-belok / KODE.TKB.ULANGI.02 | Dengan perintah maju+kanan dan isi ulangi maks 2 blok, tidak ada peta yang benar-benar memaksa "ulangi berisi dua perintah". Ulangi[maju,kanan] selalu berputar di kotak 1×1, sehingga tujuannya selalu terjangkau ≤ 3 blok tanpa ulangi. Ulangi[maju,maju] bisa diganti ulangi 2N×[maju]. Mengubah rackSlots ke 2 membuat peta opt 3 mustahil diselesaikan | (a) ubah sasaran paket menjadi "ulangi berisi satu perintah" dan buang klaim "dua perintah"; (b) tambah perintah kiri dan izinkan isi ulangi > 2 (perubahan skema/mesin) untuk peta tangga; (c) pindahkan ke kompetensi lain |
| SEDANG | sd1-kode-algoritma-di-kota / KODE.SD1.ALGORITMA.01 | "tuang susu" dan "masukkan bubuk cokelat" bisa bertukar | Gabung jadi satu kartu, atau ganti urutan "Membuat susu cokelat" |
| SEDANG | sd1-kode-algoritma-di-kota | 📡 "ambil remot". Tidak ada emoji remot | Aset ikon remot, atau ganti langkah |
| SEDANG | sd1-kode-cari-robot-pabrik, sd1-kode-robot-atau-bukan / KODE.SD1.PERANGKAT.02 | Emoji menampilkan konteks (🐄 🍎 🏊 🛰️ …), bukan mesinnya | Aset ikon mesin/robot buatan sendiri |
| SEDANG | kue-tiga-tahap-urut / KODE.TKB.DEKOMPOSISI.02 | Paket hanya mengurutkan, tidak mengelompokkan ke tahap. Teks instruksi sudah dibetulkan | Pindahkan paket ke kompetensi urutan (mis. KODE.TKA.URUTAN.01) atau ganti mode |
| KECIL | berangkat-sekolah / KODE.PAUD.URUTAN.02 | Urutan "Membuat teh hangat" dan "Sarapan roti" di luar tema dan kembar dengan perbaiki-urutan-pagi | Pindahkan ke siang-dan-malam, atau ganti dengan urutan berangkat sekolah |
| KECIL | alat-kelas-macet vs sd1-kode-kabel-tanpa-kabel, sd2-kode-masukan-keluaran | "tetikus/papan ketik" vs "mouse/keyboard" | Pilih satu istilah untuk semua jenjang |
| KECIL | lintas jenjang PAUD/TK A (siang-dan-malam, berangkat-sekolah, cerita-pertama-lalu-terakhir, perbaiki-urutan-pagi) | Urutan identik dipakai ulang | Tulis urutan TK A baru |
| KECIL | sd1-kode-tukar-langkah-taman, sd2-kode-kartu-tugas-kelas | Ikon handuk/pengki tidak ada | Aset ikon, atau ganti langkah |
| KECIL | navigasi TK A/TK B lain di luar daftar laporan (mis. batu-di-depan-robot, berhenti-sebelum-tabrak, lompati-batu-jalur-atas, rak-maju-lurus-atas, ulangi-tiga-ke-atas, ulangi-maju-dan-belok) | EN masih memakai "robot" tanpa artikel. Tidak diubah karena berkas ini tidak disebut di laporan | Seragamkan "the robot" di satu PR terpisah |
