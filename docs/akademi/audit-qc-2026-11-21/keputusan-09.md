# Keputusan putaran 2 — kelompok 09 (KODE PAUD, TK A, TK B, SD 1, SD 2)

Sumber butir: docs/akademi/audit-qc-2026-11-21/perbaikan-09-kode-paud-sd2.md (bagian "Butuh keputusan owner").

## Keputusan yang diambil
| butir | keputusan | perubahan |
|---|---|---|
| ulangi-maju-dan-belok / KODE.TKB.ULANGI.02 (ulangi berisi dua perintah tidak pernah perlu) | Isi dua perintah diganti dari "maju, belok" menjadi **"maju, lompat"** di jalur yang batunya tiap tiga petak. Opsi menambah `kiri` dan mengubah rak sudah diperiksa dan TIDAK menolong: ulangi [maju, kanan/kiri] selalu berputar di kotak 1×1 (bintang selalu terjangkau ≤ 3 blok tanpa ulangi), ulangi [maju, maju] selalu bisa diganti ulangi 2N [maju]. Satu-satunya isi dua perintah yang tidak bisa dipendekkan dengan perintah TK B adalah maju+lompat di atas batu berjarak tetap (lompat sudah dikenal sejak PAUD PERINTAH.02 / TK A KALAU.01). | Paket ditulis ulang (versi 1.0.1): `commands` maju/lompat/ulangi; 26 peta baru (14 peta 2 pasang = jarak 4, 12 peta 3 pasang = jarak 6; arah E/W/N/S, ukuran papan dan posisi awal berbeda); rak 3; knob distance 4→6 step 2 default 4. Judul "Ulangi Maju lalu Lompat", instruksi menyebut isinya. Diverifikasi dengan pemecah terpisah (batas presenter: isi ≤ 2, n 2–6): setiap peta terpecahkan dalam 3 keping HANYA dengan ulangi berisi dua perintah; tanpa itu butuh 4 (jarak 4) atau 6 (jarak 6) keping > rak. Pernyataan kompetensi tetap (inti: memilih berapa kali); catatan KODE.TKB.ULANGI.02 diperbarui (knob isi 1 → 2 perintah maju-lompat, alasan belok dibuang, beda dengan SD 2). Catatan KODE.SD2.ULANGI.01 ditambah pembeda: TK B isi sudah disebut dan selalu maju→lompat; SD 2 anak menemukan sendiri pasangan + urutan lompat→maju + perintah ekor. Id berkas tetap `ulangi-maju-dan-belok` (tidak boleh mengganti nama/berkas). |
| sd1-kode-algoritma-di-kota: "tuang susu" ↔ "masukkan bubuk cokelat" bisa bertukar | Gabung jadi satu kartu, urutan ditulis ulang sampai 6 langkah tunggal | Urutan `susu` → `susu-cokelat`: tuang susu dan bubuk cokelat ke gelas · aduk sampai rata · pasang sedotan · minum susunya · cuci gelasnya · gelas bersih kembali |
| sd1-kode-algoritma-di-kota: 📡 "ambil remot" | Ganti langkah (tanpa remot) | Urutan `tv` → `televisi`: 🔌 colokkan kabel TV · 🔘 tekan tombol daya · TV menyala · pilih saluran · kartun mulai · tertawa |
| sd1-kode-cari-robot-pabrik, sd1-kode-robot-atau-bukan: emoji menampilkan konteks, bukan mesinnya | Ganti item robot dengan mesin yang punya emoji mesinnya sendiri (🦾 🚘 🚈 🚜 🚌 🚇 🚁 🤖) | cari-robot-pabrik: dibuang pemerah susu 🐄, pembersih kolam 🏊, pemetik buah 🍎, pembersih kaca gedung 🏢; ditambah lengan robot pengecat mobil 🦾, kereta tanpa masinis 🚈, robot pengangkut barang di gudang 🤖 (6 robot + 7 bukan). robot-atau-bukan: penyedot debu ⚙️ → robot penyedot debu 🤖; pemotong rumput 🌿 → bus tanpa sopir 🚌; penjelajah Mars 🛰️ → kereta bawah tanah tanpa masinis 🚇; pengantar makanan 🍽️ → robot pengantar makanan 🤖. Catatan KODE.SD1.PERANGKAT.02: contoh "robot pemotong rumput" → "mobil tanpa sopir". |
| kue-tiga-tahap-urut / KODE.TKB.DEKOMPOSISI.02: hanya mengurutkan | Tetap di DEKOMPOSISI.02 (memindah ke TK A URUTAN.01 membuat paket lintas jenjang; mode urutkan tidak punya mode kelompok), tetapi isinya ditulis ulang supaya melatih tahap: setiap kartu bertanda tahapnya ("siapkan: …", "campur: …", "panggang: …"), 3 tahap × 2 langkah, anak menyusun tahap demi tahap lalu langkah di dalam tahap | 10 urutan ditulis ulang (langkah tahap "campur" kini benar-benar langkah mencampur; nastar → kue keju, roti sosis → roti susu); instruksi baru; knob steps dikunci 6 (min=max=6) supaya ketiga tahap selalu tampil. Catatan kompetensi menjelaskan peran paket urutkan vs pilah. |
| berangkat-sekolah: "Membuat teh hangat", "Sarapan roti" di luar tema & kembar | Ganti dengan urutan berangkat sekolah | teh → "Menyeberang jalan" (berhenti di tepi jalan · lihat kiri dan kanan · menyeberang jalan · sampai sekolah); roti → "Tiba di sekolah" (masuk gerbang sekolah · salim dengan guru · taruh tas di kelas) |
| Istilah tetikus/papan ketik | Pakai "mouse" dan "keyboard" (keputusan bersama) | alat-kelas-macet: label id "papan ketik" → "keyboard", "tetikus" → "mouse". Paket lain di kelompok ini sudah memakai mouse/keyboard; tidak ada surel/gim. |
| Urutan kembar PAUD/TK A | Tulis urutan TK A baru | perbaiki-urutan-pagi: sepatu → Awal berwudu (cuci kedua tangan · berkumur · bersihkan hidung · basuh muka); bus → Menyiram tanaman; roti → Doa makan (berdoa sebelum makan · makan sarapan · berdoa sesudah makan); teh → Memberi makan ayam; telur (kembar dengan cerita-pertama-lalu-terakhir) → Menyisir rambut. cerita-pertama-lalu-terakhir: dongeng (identik dengan siang-dan-malam PAUD) → Main balon. Pemindaian ulang: tidak ada lagi urutan identik PAUD↔TK A di paket KODE; sisa tumpang tindih hanya 2 label umum (bangun tidur/mandi, sikat gigi/tidur) di urutan yang panjangnya berbeda. |
| Ikon handuk/pengki | Ganti langkah | sd1-kode-tukar-langkah-taman: "Memandikan anjing" (🧺 handuk; juga kurang pas untuk aplikasi bernuansa Islami) → "Main perosotan" (antre · naiki tangga 🪜 · duduk di puncak · meluncur 🛝 · sampai di bawah · beri giliran). sd2-kode-kartu-tugas-kelas: langkah pengki dibuang, ditambah langkah akhir "lapor ke guru bahwa piket selesai" 🙋 (tetap 7 kartu, urutan tunggal). |
| EN "robot" tanpa artikel | Seragamkan "the robot" di semua paket & pernyataan kompetensi kelompok ini | instruksi EN: batu-di-depan-robot, batu-di-jalan-kebun, belok-menghadap-bintang, berhenti-sebelum-tabrak, lompati-batu-jalur-atas, rak-maju-lurus-atas, sd1-kode-kalau-di-dalam-ulangi, sd1-kode-tebak-petak-ulangi, sd2-kode-program-tepat-5x5, ulangi-tiga-ke-atas, ulangi-maju-dan-belok, kue-tiga-tahap (pilah), perbaiki-urutan-pagi; judul urutan berangkat-sekolah "The robot goes to school". Pernyataan EN 13 kompetensi (KODE.PAUD.PERINTAH.01/.02, PAUD.SEBAB-AKIBAT.02, TKA.NAVIGASI.01/.02, TKB.ULANGI.02, TKB.PROGRAM-5-8.02, TKB.DEBUG-BANYAK.02, SD1.ULANGI.01, SD1.PREDIKSI.01, SD2.PROGRAM.01, SD2.EFISIEN.01, SD2.ULANGI.01). Judul seperti "Robot Boat to the Star", "Robot or Not?" dan frasa "robot commands" dibiarkan (bukan kesalahan). Hanya EN → tidak ada suara berubah. |
| hitung-anak-ayam-kandang vs hitung-kerang-pantai | Dilewati: milik MAT.PAUD.BILANGAN-1-5.01 (kelompok lain) | — |
| pensil-pendek-ke-panjang vs ular-pendek-ke-panjang | Dilewati: milik MAT.TKA.BANDING.02 (kelompok lain) | — |

Semua paket yang diubah dinaikkan versi patch-nya terhadap HEAD (mis. 1.1.1 → 1.1.2).

## Kalimat suara berubah
| paket | kunci | lama | baru |
|---|---|---|---|
| ulangi-maju-dan-belok | judul | Ulangi Maju dan Belok | Ulangi Maju lalu Lompat |
| ulangi-maju-dan-belok | instruksi | Isi blok ulangi dengan dua perintah, lalu pilih berapa kali supaya robot tepat di bintang. | Isi blok ulangi dengan maju lalu lompat, lalu pilih berapa kali supaya robot tepat di bintang. |
| sd1-kode-cari-robot-pabrik | i-pemerah-susu | robot pemerah susu sapi | (dihapus) |
| sd1-kode-cari-robot-pabrik | i-pembersih-kolam | robot pembersih kolam renang | (dihapus) |
| sd1-kode-cari-robot-pabrik | i-pemetik-buah | robot pemetik buah | (dihapus) |
| sd1-kode-cari-robot-pabrik | i-pembersih-jendela | robot pembersih kaca gedung | (dihapus) |
| sd1-kode-cari-robot-pabrik | i-lengan-pengecat | (baru) | lengan robot pengecat mobil |
| sd1-kode-cari-robot-pabrik | i-kereta-otomatis | (baru) | kereta yang berjalan sendiri tanpa masinis |
| sd1-kode-cari-robot-pabrik | i-pengangkut-gudang | (baru) | robot pengangkut barang di gudang |
| sd1-kode-robot-atau-bukan | i-self-driving-vacuum-cleaner | penyedot debu yang jalan sendiri | (dihapus) |
| sd1-kode-robot-atau-bukan | i-self-driving-lawn-mower | pemotong rumput yang jalan sendiri | (dihapus) |
| sd1-kode-robot-atau-bukan | i-mars-rover | kendaraan penjelajah planet Mars | (dihapus) |
| sd1-kode-robot-atau-bukan | i-automatic-restaurant-food-carrier | pengantar makanan otomatis di restoran | (dihapus) |
| sd1-kode-robot-atau-bukan | i-robot-vacuum-cleaner | (baru) | robot penyedot debu yang jalan sendiri |
| sd1-kode-robot-atau-bukan | i-self-driving-bus | (baru) | bus yang menyetir sendiri tanpa sopir |
| sd1-kode-robot-atau-bukan | i-driverless-train | (baru) | kereta bawah tanah tanpa masinis |
| sd1-kode-robot-atau-bukan | i-restaurant-serving-robot | (baru) | robot pengantar makanan di restoran |
| berangkat-sekolah | teh | Membuat teh hangat | (dihapus) |
| berangkat-sekolah | rebus | rebus air | (dihapus) |
| berangkat-sekolah | tuang | tuang ke cangkir | (dihapus) |
| berangkat-sekolah | minum | minum teh | (dihapus) |
| berangkat-sekolah | t-roti | Sarapan roti | (dihapus) |
| berangkat-sekolah | roti-ambil | ambil roti | (dihapus) |
| berangkat-sekolah | roti-oles | oles madu | (dihapus) |
| berangkat-sekolah | roti-makan | makan roti | (dihapus) |
| berangkat-sekolah | t-seberang | (baru) | Menyeberang jalan |
| berangkat-sekolah | seberang-1 | (baru) | berhenti di tepi jalan |
| berangkat-sekolah | seberang-2 | (baru) | lihat kiri dan kanan |
| berangkat-sekolah | seberang-3 | (baru) | menyeberang jalan |
| berangkat-sekolah | seberang-4 | (baru) | sampai sekolah |
| berangkat-sekolah | t-salim | (baru) | Tiba di sekolah |
| berangkat-sekolah | salim-1 | (baru) | masuk gerbang sekolah |
| berangkat-sekolah | salim-2 | (baru) | salim dengan guru |
| berangkat-sekolah | salim-3 | (baru) | taruh tas di kelas |
| perbaiki-urutan-pagi | t-sepatu | Memakai sepatu | (dihapus) |
| perbaiki-urutan-pagi | sepatu-kaus | pakai kaus kaki | (dihapus) |
| perbaiki-urutan-pagi | sepatu-sepatu | pakai sepatu | (dihapus) |
| perbaiki-urutan-pagi | sepatu-jalan | berangkat | (dihapus) |
| perbaiki-urutan-pagi | t-telur | Sarapan telur | (dihapus) |
| perbaiki-urutan-pagi | telur-pecah | pecahkan telur | (dihapus) |
| perbaiki-urutan-pagi | telur-goreng | goreng telur | (dihapus) |
| perbaiki-urutan-pagi | telur-makan | makan telur | (dihapus) |
| perbaiki-urutan-pagi | t-bus | Naik bus | (dihapus) |
| perbaiki-urutan-pagi | bus-keluar | keluar rumah | (dihapus) |
| perbaiki-urutan-pagi | bus-halte | tunggu di halte | (dihapus) |
| perbaiki-urutan-pagi | bus-naik | naik bus | (dihapus) |
| perbaiki-urutan-pagi | bus-tiba | sampai sekolah | (dihapus) |
| perbaiki-urutan-pagi | t-roti | Sarapan roti | (dihapus) |
| perbaiki-urutan-pagi | roti-ambil | ambil roti | (dihapus) |
| perbaiki-urutan-pagi | roti-oles | oles madu | (dihapus) |
| perbaiki-urutan-pagi | roti-makan | makan roti | (dihapus) |
| perbaiki-urutan-pagi | t-teh | Teh hangat | (dihapus) |
| perbaiki-urutan-pagi | teh-rebus | rebus air | (dihapus) |
| perbaiki-urutan-pagi | teh-tuang | tuang ke cangkir | (dihapus) |
| perbaiki-urutan-pagi | teh-minum | minum teh | (dihapus) |
| perbaiki-urutan-pagi | t-wudu | (baru) | Awal berwudu |
| perbaiki-urutan-pagi | wudu-1 | (baru) | cuci kedua tangan |
| perbaiki-urutan-pagi | wudu-2 | (baru) | berkumur |
| perbaiki-urutan-pagi | wudu-3 | (baru) | bersihkan hidung |
| perbaiki-urutan-pagi | wudu-4 | (baru) | basuh muka |
| perbaiki-urutan-pagi | t-siram | (baru) | Menyiram tanaman |
| perbaiki-urutan-pagi | siram-1 | (baru) | isi gembor dengan air |
| perbaiki-urutan-pagi | siram-2 | (baru) | bawa ke kebun |
| perbaiki-urutan-pagi | siram-3 | (baru) | siram tanaman |
| perbaiki-urutan-pagi | siram-4 | (baru) | tanaman segar |
| perbaiki-urutan-pagi | t-doa-makan | (baru) | Doa makan |
| perbaiki-urutan-pagi | doa-makan-1 | (baru) | berdoa sebelum makan |
| perbaiki-urutan-pagi | doa-makan-2 | (baru) | makan sarapan |
| perbaiki-urutan-pagi | doa-makan-3 | (baru) | berdoa sesudah makan |
| perbaiki-urutan-pagi | t-ayam | (baru) | Memberi makan ayam |
| perbaiki-urutan-pagi | ayam-1 | (baru) | ambil jagung |
| perbaiki-urutan-pagi | ayam-2 | (baru) | tabur jagung |
| perbaiki-urutan-pagi | ayam-3 | (baru) | ayam makan jagung |
| perbaiki-urutan-pagi | t-sisir | (baru) | Menyisir rambut |
| perbaiki-urutan-pagi | sisir-1 | (baru) | berdiri di depan cermin |
| perbaiki-urutan-pagi | sisir-2 | (baru) | sisir rambut |
| perbaiki-urutan-pagi | sisir-3 | (baru) | rambut rapi |
| cerita-pertama-lalu-terakhir | t-dongeng | Sebelum tidur | (dihapus) |
| cerita-pertama-lalu-terakhir | dongeng-buku | ambil buku cerita | (dihapus) |
| cerita-pertama-lalu-terakhir | dongeng-baca | dibacakan cerita | (dihapus) |
| cerita-pertama-lalu-terakhir | dongeng-tidur | tertidur | (dihapus) |
| cerita-pertama-lalu-terakhir | t-balon | (baru) | Main balon |
| cerita-pertama-lalu-terakhir | balon-1 | (baru) | tiup balon |
| cerita-pertama-lalu-terakhir | balon-2 | (baru) | ikat ujungnya |
| cerita-pertama-lalu-terakhir | balon-3 | (baru) | main balon bersama |
| sd1-kode-algoritma-di-kota | t-susu | Membuat susu cokelat | (dihapus) |
| sd1-kode-algoritma-di-kota | susu-1 | tuang susu ke gelas | (dihapus) |
| sd1-kode-algoritma-di-kota | susu-2 | masukkan bubuk cokelat | (dihapus) |
| sd1-kode-algoritma-di-kota | susu-3 | aduk sampai rata | (dihapus) |
| sd1-kode-algoritma-di-kota | susu-4 | pasang sedotan | (dihapus) |
| sd1-kode-algoritma-di-kota | susu-5 | minum susunya | (dihapus) |
| sd1-kode-algoritma-di-kota | susu-6 | cuci gelasnya | (dihapus) |
| sd1-kode-algoritma-di-kota | t-tv | Menonton kartun di TV | (dihapus) |
| sd1-kode-algoritma-di-kota | tv-1 | ambil remot | (dihapus) |
| sd1-kode-algoritma-di-kota | tv-2 | tekan tombol daya | (dihapus) |
| sd1-kode-algoritma-di-kota | tv-3 | TV menyala | (dihapus) |
| sd1-kode-algoritma-di-kota | tv-4 | pilih saluran kartun | (dihapus) |
| sd1-kode-algoritma-di-kota | tv-5 | kartun mulai tayang | (dihapus) |
| sd1-kode-algoritma-di-kota | tv-6 | tertawa menonton kartun | (dihapus) |
| sd1-kode-algoritma-di-kota | t-susu-cokelat | (baru) | Membuat susu cokelat |
| sd1-kode-algoritma-di-kota | susu-cokelat-1 | (baru) | tuang susu dan bubuk cokelat ke gelas |
| sd1-kode-algoritma-di-kota | susu-cokelat-2 | (baru) | aduk sampai rata |
| sd1-kode-algoritma-di-kota | susu-cokelat-3 | (baru) | pasang sedotan |
| sd1-kode-algoritma-di-kota | susu-cokelat-4 | (baru) | minum susunya |
| sd1-kode-algoritma-di-kota | susu-cokelat-5 | (baru) | cuci gelasnya |
| sd1-kode-algoritma-di-kota | susu-cokelat-6 | (baru) | gelas bersih kembali |
| sd1-kode-algoritma-di-kota | t-televisi | (baru) | Menonton kartun di TV |
| sd1-kode-algoritma-di-kota | televisi-1 | (baru) | colokkan kabel TV |
| sd1-kode-algoritma-di-kota | televisi-2 | (baru) | tekan tombol daya |
| sd1-kode-algoritma-di-kota | televisi-3 | (baru) | TV menyala |
| sd1-kode-algoritma-di-kota | televisi-4 | (baru) | pilih saluran kartun |
| sd1-kode-algoritma-di-kota | televisi-5 | (baru) | kartun mulai tayang |
| sd1-kode-algoritma-di-kota | televisi-6 | (baru) | tertawa menonton kartun |
| sd1-kode-tukar-langkah-taman | t-anjing | Memandikan anjing | (dihapus) |
| sd1-kode-tukar-langkah-taman | anjing-1 | ajak anjing ke kamar mandi | (dihapus) |
| sd1-kode-tukar-langkah-taman | anjing-2 | basahi bulunya | (dihapus) |
| sd1-kode-tukar-langkah-taman | anjing-3 | gosok dengan sampo | (dihapus) |
| sd1-kode-tukar-langkah-taman | anjing-4 | bilas busanya | (dihapus) |
| sd1-kode-tukar-langkah-taman | anjing-5 | keringkan dengan handuk | (dihapus) |
| sd1-kode-tukar-langkah-taman | anjing-6 | anjing bersih dan wangi | (dihapus) |
| sd1-kode-tukar-langkah-taman | t-perosotan | (baru) | Main perosotan |
| sd1-kode-tukar-langkah-taman | perosotan-1 | (baru) | antre di belakang teman |
| sd1-kode-tukar-langkah-taman | perosotan-2 | (baru) | naiki tangga perosotan |
| sd1-kode-tukar-langkah-taman | perosotan-3 | (baru) | duduk di puncak perosotan |
| sd1-kode-tukar-langkah-taman | perosotan-4 | (baru) | meluncur ke bawah |
| sd1-kode-tukar-langkah-taman | perosotan-5 | (baru) | sampai di bawah |
| sd1-kode-tukar-langkah-taman | perosotan-6 | (baru) | beri giliran ke teman |
| sd2-kode-kartu-tugas-kelas | t-piket | Piket kelas | (dihapus) |
| sd2-kode-kartu-tugas-kelas | piket-1 | naikkan kursi ke atas meja | (dihapus) |
| sd2-kode-kartu-tugas-kelas | piket-2 | sapu lantai | (dihapus) |
| sd2-kode-kartu-tugas-kelas | piket-3 | kumpulkan debu dengan pengki | (dihapus) |
| sd2-kode-kartu-tugas-kelas | piket-4 | buang debu ke tempat sampah | (dihapus) |
| sd2-kode-kartu-tugas-kelas | piket-5 | pel lantai | (dihapus) |
| sd2-kode-kartu-tugas-kelas | piket-6 | tunggu lantai kering | (dihapus) |
| sd2-kode-kartu-tugas-kelas | piket-7 | turunkan kursi lagi | (dihapus) |
| sd2-kode-kartu-tugas-kelas | t-piket-kelas | (baru) | Piket kelas |
| sd2-kode-kartu-tugas-kelas | piket-kelas-1 | (baru) | naikkan kursi ke atas meja |
| sd2-kode-kartu-tugas-kelas | piket-kelas-2 | (baru) | sapu lantai |
| sd2-kode-kartu-tugas-kelas | piket-kelas-3 | (baru) | buang debu ke tempat sampah |
| sd2-kode-kartu-tugas-kelas | piket-kelas-4 | (baru) | pel lantai |
| sd2-kode-kartu-tugas-kelas | piket-kelas-5 | (baru) | tunggu lantai kering |
| sd2-kode-kartu-tugas-kelas | piket-kelas-6 | (baru) | turunkan kursi lagi |
| sd2-kode-kartu-tugas-kelas | piket-kelas-7 | (baru) | lapor ke guru bahwa piket selesai |
| kue-tiga-tahap-urut | instruksi | Susun enam langkah membuat kue dari awal sampai matang. | Tiap langkah punya tahap: siapkan, campur, panggang. Susun tahap demi tahap dari awal sampai matang. |
| kue-tiga-tahap-urut | kue | Membuat kue: siapkan, campur, panggang | (dihapus) |
| kue-tiga-tahap-urut | roti | Membuat roti: siapkan, campur, panggang | (dihapus) |
| kue-tiga-tahap-urut | tepung-telur | ambil tepung dan telur | (dihapus) |
| kue-tiga-tahap-urut | cuci | cuci tangan | (dihapus) |
| kue-tiga-tahap-urut | aduk | aduk adonan | (dihapus) |
| kue-tiga-tahap-urut | tuang | tuang ke loyang | (dihapus) |
| kue-tiga-tahap-urut | oven | masukkan ke oven | (dihapus) |
| kue-tiga-tahap-urut | jadi | kue matang | (dihapus) |
| kue-tiga-tahap-urut | tepung-ragi | ambil tepung dan ragi | (dihapus) |
| kue-tiga-tahap-urut | uleni | uleni adonan | (dihapus) |
| kue-tiga-tahap-urut | bentuk | bentuk roti | (dihapus) |
| kue-tiga-tahap-urut | roti2 | roti matang | (dihapus) |
| kue-tiga-tahap-urut | kering-cuci | cuci tangan | (dihapus) |
| kue-tiga-tahap-urut | kering-mentega | ambil mentega | (dihapus) |
| kue-tiga-tahap-urut | kering-aduk | aduk adonan | (dihapus) |
| kue-tiga-tahap-urut | kering-cetak | cetak bentuk bintang | (dihapus) |
| kue-tiga-tahap-urut | kering-oven | masukkan ke oven | (dihapus) |
| kue-tiga-tahap-urut | kering-jadi | kue kering matang | (dihapus) |
| kue-tiga-tahap-urut | pizza-cuci | cuci tangan | (dihapus) |
| kue-tiga-tahap-urut | pizza-tepung | ambil tepung | (dihapus) |
| kue-tiga-tahap-urut | pizza-uleni | uleni adonan | (dihapus) |
| kue-tiga-tahap-urut | pizza-keju | taburi keju | (dihapus) |
| kue-tiga-tahap-urut | pizza-oven | masukkan ke oven | (dihapus) |
| kue-tiga-tahap-urut | pizza-jadi | pizza matang | (dihapus) |
| kue-tiga-tahap-urut | mangkuk-cuci | cuci tangan | (dihapus) |
| kue-tiga-tahap-urut | mangkuk-telur | ambil telur | (dihapus) |
| kue-tiga-tahap-urut | mangkuk-kocok | kocok adonan | (dihapus) |
| kue-tiga-tahap-urut | mangkuk-tuang | tuang ke cetakan | (dihapus) |
| kue-tiga-tahap-urut | mangkuk-oven | masukkan ke oven | (dihapus) |
| kue-tiga-tahap-urut | mangkuk-jadi | kue mangkuk matang | (dihapus) |
| kue-tiga-tahap-urut | pai-cuci | cuci apel | (dihapus) |
| kue-tiga-tahap-urut | pai-potong | potong apel | (dihapus) |
| kue-tiga-tahap-urut | pai-aduk | aduk adonan | (dihapus) |
| kue-tiga-tahap-urut | pai-tutup | tutup apel dengan adonan | (dihapus) |
| kue-tiga-tahap-urut | pai-oven | masukkan ke oven | (dihapus) |
| kue-tiga-tahap-urut | pai-jadi | pai apel matang | (dihapus) |
| kue-tiga-tahap-urut | bolu-kupas | kupas pisang | (dihapus) |
| kue-tiga-tahap-urut | bolu-lumat | lumatkan pisang | (dihapus) |
| kue-tiga-tahap-urut | bolu-telur | tambah telur | (dihapus) |
| kue-tiga-tahap-urut | bolu-aduk | aduk adonan | (dihapus) |
| kue-tiga-tahap-urut | bolu-oven | masukkan ke oven | (dihapus) |
| kue-tiga-tahap-urut | bolu-jadi | bolu pisang matang | (dihapus) |
| kue-tiga-tahap-urut | roti-cokelat-cuci | cuci tangan | (dihapus) |
| kue-tiga-tahap-urut | roti-cokelat-tepung | ambil tepung | (dihapus) |
| kue-tiga-tahap-urut | roti-cokelat-uleni | uleni adonan | (dihapus) |
| kue-tiga-tahap-urut | roti-cokelat-isi | isi dengan cokelat | (dihapus) |
| kue-tiga-tahap-urut | roti-cokelat-oven | masukkan ke oven | (dihapus) |
| kue-tiga-tahap-urut | roti-cokelat-jadi | roti cokelat matang | (dihapus) |
| kue-tiga-tahap-urut | t-nastar | Membuat nastar: siapkan, campur, panggang | (dihapus) |
| kue-tiga-tahap-urut | nastar-kupas | kupas nanas | (dihapus) |
| kue-tiga-tahap-urut | nastar-selai | masak selai nanas | (dihapus) |
| kue-tiga-tahap-urut | nastar-aduk | aduk adonan | (dihapus) |
| kue-tiga-tahap-urut | nastar-bulat | bulatkan, isi selai | (dihapus) |
| kue-tiga-tahap-urut | nastar-oven | masukkan ke oven | (dihapus) |
| kue-tiga-tahap-urut | nastar-jadi | nastar matang | (dihapus) |
| kue-tiga-tahap-urut | t-roti-sosis | Membuat roti sosis: siapkan, campur, panggang | (dihapus) |
| kue-tiga-tahap-urut | roti-sosis-cuci | cuci tangan | (dihapus) |
| kue-tiga-tahap-urut | roti-sosis-tepung | ambil tepung | (dihapus) |
| kue-tiga-tahap-urut | roti-sosis-uleni | uleni adonan | (dihapus) |
| kue-tiga-tahap-urut | roti-sosis-gulung | gulung dengan sosis | (dihapus) |
| kue-tiga-tahap-urut | roti-sosis-oven | masukkan ke oven | (dihapus) |
| kue-tiga-tahap-urut | roti-sosis-jadi | roti sosis matang | (dihapus) |
| kue-tiga-tahap-urut | t-kue | (baru) | Membuat kue: siapkan, campur, panggang |
| kue-tiga-tahap-urut | kue-1 | (baru) | siapkan: cuci tangan |
| kue-tiga-tahap-urut | kue-2 | (baru) | siapkan: ambil tepung dan telur |
| kue-tiga-tahap-urut | kue-3 | (baru) | campur: aduk tepung dan telur |
| kue-tiga-tahap-urut | kue-4 | (baru) | campur: tuang susu, aduk lagi |
| kue-tiga-tahap-urut | kue-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | kue-6 | (baru) | panggang: kue matang |
| kue-tiga-tahap-urut | t-roti | (baru) | Membuat roti: siapkan, campur, panggang |
| kue-tiga-tahap-urut | roti-1 | (baru) | siapkan: cuci tangan |
| kue-tiga-tahap-urut | roti-2 | (baru) | siapkan: ambil tepung dan ragi |
| kue-tiga-tahap-urut | roti-3 | (baru) | campur: tuang air ke tepung |
| kue-tiga-tahap-urut | roti-4 | (baru) | campur: uleni adonan |
| kue-tiga-tahap-urut | roti-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | roti-6 | (baru) | panggang: roti matang |
| kue-tiga-tahap-urut | kering-1 | (baru) | siapkan: cuci tangan |
| kue-tiga-tahap-urut | kering-2 | (baru) | siapkan: ambil mentega dan tepung |
| kue-tiga-tahap-urut | kering-3 | (baru) | campur: masukkan ke mangkuk |
| kue-tiga-tahap-urut | kering-4 | (baru) | campur: aduk jadi adonan |
| kue-tiga-tahap-urut | kering-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | kering-6 | (baru) | panggang: kue kering matang |
| kue-tiga-tahap-urut | pizza-1 | (baru) | siapkan: cuci tangan |
| kue-tiga-tahap-urut | pizza-2 | (baru) | siapkan: ambil tepung |
| kue-tiga-tahap-urut | pizza-3 | (baru) | campur: campur tepung dengan air |
| kue-tiga-tahap-urut | pizza-4 | (baru) | campur: uleni sampai lembut |
| kue-tiga-tahap-urut | pizza-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | pizza-6 | (baru) | panggang: pizza matang |
| kue-tiga-tahap-urut | mangkuk-1 | (baru) | siapkan: cuci tangan |
| kue-tiga-tahap-urut | mangkuk-2 | (baru) | siapkan: ambil telur dan tepung |
| kue-tiga-tahap-urut | mangkuk-3 | (baru) | campur: kocok telur |
| kue-tiga-tahap-urut | mangkuk-4 | (baru) | campur: tambah tepung, aduk lagi |
| kue-tiga-tahap-urut | mangkuk-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | mangkuk-6 | (baru) | panggang: kue mangkuk matang |
| kue-tiga-tahap-urut | pai-1 | (baru) | siapkan: cuci apel |
| kue-tiga-tahap-urut | pai-2 | (baru) | siapkan: potong apel |
| kue-tiga-tahap-urut | pai-3 | (baru) | campur: aduk tepung dan mentega |
| kue-tiga-tahap-urut | pai-4 | (baru) | campur: masukkan apel ke adonan |
| kue-tiga-tahap-urut | pai-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | pai-6 | (baru) | panggang: pai apel matang |
| kue-tiga-tahap-urut | bolu-1 | (baru) | siapkan: kupas pisang |
| kue-tiga-tahap-urut | bolu-2 | (baru) | siapkan: lumatkan pisang |
| kue-tiga-tahap-urut | bolu-3 | (baru) | campur: tambah telur |
| kue-tiga-tahap-urut | bolu-4 | (baru) | campur: aduk adonan |
| kue-tiga-tahap-urut | bolu-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | bolu-6 | (baru) | panggang: bolu pisang matang |
| kue-tiga-tahap-urut | roti-cokelat-1 | (baru) | siapkan: cuci tangan |
| kue-tiga-tahap-urut | roti-cokelat-2 | (baru) | siapkan: ambil tepung dan cokelat |
| kue-tiga-tahap-urut | roti-cokelat-3 | (baru) | campur: campur cokelat ke tepung |
| kue-tiga-tahap-urut | roti-cokelat-4 | (baru) | campur: uleni adonan |
| kue-tiga-tahap-urut | roti-cokelat-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | roti-cokelat-6 | (baru) | panggang: roti cokelat matang |
| kue-tiga-tahap-urut | t-keju | (baru) | Membuat kue keju: siapkan, campur, panggang |
| kue-tiga-tahap-urut | keju-1 | (baru) | siapkan: cuci tangan |
| kue-tiga-tahap-urut | keju-2 | (baru) | siapkan: parut keju |
| kue-tiga-tahap-urut | keju-3 | (baru) | campur: campur keju dengan tepung |
| kue-tiga-tahap-urut | keju-4 | (baru) | campur: aduk jadi adonan |
| kue-tiga-tahap-urut | keju-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | keju-6 | (baru) | panggang: kue keju matang |
| kue-tiga-tahap-urut | t-roti-susu | (baru) | Membuat roti susu: siapkan, campur, panggang |
| kue-tiga-tahap-urut | roti-susu-1 | (baru) | siapkan: cuci tangan |
| kue-tiga-tahap-urut | roti-susu-2 | (baru) | siapkan: ambil tepung dan ragi |
| kue-tiga-tahap-urut | roti-susu-3 | (baru) | campur: tuang susu ke tepung |
| kue-tiga-tahap-urut | roti-susu-4 | (baru) | campur: uleni adonan |
| kue-tiga-tahap-urut | roti-susu-5 | (baru) | panggang: masukkan ke oven |
| kue-tiga-tahap-urut | roti-susu-6 | (baru) | panggang: roti susu matang |
| alat-kelas-macet | papan-ketik | papan ketik | keyboard |
| alat-kelas-macet | tetikus | tetikus | mouse |

## Butuh fitur baru
| paket | item/urutan | fitur | nilai yang diinginkan |
|---|---|---|---|
| ulangi-maju-dan-belok, ulangi-berapa-kali-lurus (KODE.TKB.ULANGI.02) | semua peta | Mesin `jalankan` berhenti begitu robot menyentuh bintang, jadi angka ulangi yang TERLALU BESAR tetap dinilai benar; bukti kompetensi "tepat di bintang, tidak lewat" belum bisa dinilai | Opsi paket (mis. `ulangiTepat: true`) yang menilai salah bila blok ulangi masih punya putaran tersisa saat robot sampai bintang |
| sd1-kode-robot-atau-bukan | parcel-delivery-drone | Ikon drone (🚁 helikopter dipakai sebagai pengganti) | aset ikon drone |

## Tidak dikerjakan
| butir | alasan |
|---|---|
| hitung-anak-ayam-kandang vs hitung-kerang-pantai | Kompetensi MAT.PAUD.BILANGAN-1-5.01 — kelompok MAT |
| pensil-pendek-ke-panjang vs ular-pendek-ke-panjang | Kompetensi MAT.TKA.BANDING.02 — kelompok MAT |
| "papan ketik" di catatan KODE.SD4.PERANGKAT (KODE-SD4.json) | Di luar kelompok ini (SD 4); sebaiknya diganti "keyboard" oleh kelompok SD 4 |

## Validasi
- `npx tsx packages/schema/src/cli.ts`: semua kurikulum & 810 paket valid.
- `npm run -s akademi:audit`: ERROR 0 (seluruh repo). WARNING 1 (ejaan sd4-kode-masukan-proses-keluaran, bukan kelompok ini). Paket/kompetensi kelompok 09: 0 ERROR, 0 WARNING.
- Peta ulangi-maju-dan-belok dicek pemecah sendiri (isi ulangi ≤ 2, n 2–9): 26/26 terpecahkan dalam 3 keping hanya dengan ulangi [maju, lompat]; tanpa ulangi dua perintah minimal 4 / 6 keping. Tidak ada soal berulang dalam satu sesi menurut audit.
