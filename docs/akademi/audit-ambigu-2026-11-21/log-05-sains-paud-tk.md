# Log 05 — Sains PAUD, TK A, TK B (audit ambigu)

Cakupan: semua paket di SAINS-PAUD.txt (24 paket), SAINS-TKA.txt (32 paket), SAINS-TKB.txt (36 paket) diperiksa per soal/item/label/instruksi di JSON asli. Mesin pilah mode pilih memakai pilihan soal apa adanya (tanpa tambahan pengecoh), jadi tiap soal dinilai dari daftar pilihannya sendiri. 24 berkas paket diubah (21 di putaran pertama + 3 dari keputusan koordinator) (version patch dinaikkan); berkas kurikulum tidak diubah.
Validasi: `cli.ts` → 810 paket konten valid; `akademi:audit` → ERROR 0, tidak ada WARNING untuk paket kelompok ini (WARNING sains-bekal-sehari-hari-pasar sudah hilang).

## Temuan
| jenis (1–6) | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| 1 | sains-senam-tunjuk-tubuh | t-hidung2 (contoh owner), t-mata2, t-telinga2, t-mulut2, t-kaki2 | Kalimat menceritakan kegiatan indra ("mencium bunga yang harum") lalu menyuruh menunjuk bagian tubuh; kompetensi .01 = menunjuk bagian tubuh saat namanya disebut. Kalimat bisa dibaca sebagai soal indra | diperbaiki: pola "Dina [kegiatan] dengan [bagian]. Tunjuk [bagian]nya!" (mis. "Dina mencium bunga dengan hidung. Tunjuk hidungnya!"); "makan pisang" jadi "menggigit pisang dengan mulut" karena tangan ikut jadi pilihan |
| 3 | sains-senam-tunjuk-tubuh | t-telinga1, t-mulut1, t-tangan1, t-kaki1 | Perintah senam ("Tarik telinga", "Buka mulut", "Lambaikan tangan", "Hentakkan kaki") tidak menyuruh menyentuh gambar | diperbaiki: "Ayo senam! Tunjuk X, lalu …" |
| 1 | sains-bekerja-dulu-di-taman | t-5 | "Menghirup wangi bunga" mengarah ke indra penciuman (hidung), padahal jawabannya paru-paru (jenis yang sama dengan contoh owner) | diperbaiki: "Budi mau menghirup udara segar dalam-dalam." |
| 2 | sains-bekerja-dulu-di-taman | t-3 | Naik tangga perosotan juga memakai otot lengan (berpegangan); lengan ada di pilihan | diperbaiki: lengan dibuang dari pilihan (kaki, paru, otak) |
| 2 | sains-lengkapi-tubuh-boneka | t9 | "Apa yang dipasang di bawah kepala?" padahal kaki juga di bawah kepala; kaki ada di pilihan | diperbaiki: "Bagian tubuh apa yang dipasang tepat di bawah kepala?"; pilihan badan, topi, bola |
| 3 | sains-pasang-bagian-robot | t-badan2, t-tangan2, t-kaki3 | Hanya pernyataan keadaan, tanpa pertanyaan atau perintah | diperbaiki: ditambah "Pasang yang mana?" |
| 2 | sains-keranjang-indra-pasar | i-eskrim, cokelat | Cokelat juga harum (hidung); es krim tanpa petunjuk rasa | diperbaiki: "es krim manis", "cokelat manis" (sama dengan pola paket rumah) |
| 2 | sains-suara-siapa-di-kebun | soal ular | "sssss" mirip dengungan lebah; lebah jadi pengecoh | diperbaiki: pengecoh lebah diganti tikus |
| 4 | sains-siapa-hidup-di-rumah | t-beo2 | "Boneka dan robot mainan mirip hewan": robot tidak mirip hewan | diperbaiki: "mirip makhluk hidup" |
| 5 | sains-siap-keluar-payung-topi | item pantai (emoji) | Emoji 🏖️ bergambar payung pantai, padahal kartunya harus ke "pakai topi" | diperbaiki: emoji 🏝️ |
| 6 | sains-susun-tumbuhan-utuh | instruksi | Instruksi selalu menyebut "lalu bunga", padahal urutan pohon kecil/cemara (dipakai saat knob steps 3) tanpa bunga | diperbaiki: "… lalu bunga bila ada." |
| 4 | sains-susun-tumbuhan-utuh | padi-bulir | Istilah "malai" belum dikenal anak TK A dan tidak cocok dengan instruksi "bunga" | diperbaiki: "bunga padi di pucuk" |
| judul | sains-siklus-ayam | judul | Judul "Telur Jadi Ayam" padahal ada urutan siklus bebek | diperbaiki: "Telur Jadi Ayam dan Bebek" |
| 3 | sains-papan-cuaca-kelas | 12 soal t-* | Soal hanya berupa pernyataan keadaan, tanpa pertanyaan | diperbaiki: ditambah "Cuaca apa?" |
| 3 | sains-simbol-cuaca-jendela | 10 soal t* | Sama: pernyataan tanpa pertanyaan | diperbaiki: ditambah "Cuaca apa?" |
| 4 | sains-kegiatan-sesuai-cuaca | i-kincir | "main lonceng angin" bukan kegiatan yang jelas | diperbaiki: "mendengar lonceng angin berbunyi" |
| judul | sains-mana-organ-tubuh | judul | "Mana Organnya?" padahal tulang dan otot bukan organ | diperbaiki: "Bagian di Dalam Tubuh" |
| 3 | sains-bekal-sehari-hari-pasar | instruksi | Tidak ada kata kerja (WARNING audit) | diperbaiki: "taruh makanan sehari-hari ke piring …" |
| 4 | sains-rawat-tanaman-berbunga | i-cabut | "dicabut setiap hari" kabur (apa yang dicabut?) dan bersanding dengan "rumput liar dicabut" yang masuk rak membantu | diperbaiki: "tanamannya dicabut dari pot" |
| 6 | sains-layu-atau-segar | instruksi | "Lihat tempat tiap tanaman" padahal ada kartu keadaan ("tidak disiram berhari-hari") | diperbaiki: "Lihat tempat dan keadaan tiap tanaman." |
| 2 | sains-habitat-hewan-lain | i-beluga | Paus beluga wajar masuk terumbu karang (laut) pada mode 4 habitat | diperbaiki: "paus beluga di laut es" |
| 2 | sains-rak-bahan-dapur | i-garpu | "garpu makan" bisa plastik | diperbaiki: "garpu besi" |
| 2 | sains-benda-dibuat-dari-apa | item sisir | Sisir rambut wajar dari kayu atau plastik | diperbaiki: diganti "kantong kresek" 🛍️ (id kresek, kunci i-kresek) |
| 2 | sains-pilih-bahan-bangun-rumah | soal t-botol | Botol minum logam juga ringan dan tidak pecah; logam ada di pilihan | diperbaiki: pilihan plastik, kaca, kayu |
| 2 | sains-kegiatan-sesuai-cuaca | bin cerah vs berangin, semua kartu | Saat 3 papan, layang-layang, perahu layar, menjemur wajar di cerah maupun berangin | diperbaiki (keputusan koordinator): tiap kartu menyebut cuacanya: "angin kencang, waktunya main layang-layang", "angin kencang, perahu layar melaju", "angin bertiup, lonceng angin berbunyi", "matahari terik, jemur baju", "hari cerah dan panas, berenang di kolam", "matahari terik, makan es krim di taman", "hujan turun, pakai payung", "hujan deras, berteduh di rumah", "hujan turun, pakai jas hujan" |
| 5 | sains-hasil-percobaan-magnet, sains-percobaan-magnet-gudang | instruksi/items | Kompetensi "setelah mencobanya", tapi hasil percobaan tidak dibacakan (beda dengan paket bak air) | diperbaiki (keputusan koordinator): semua 24 label item memakai pola bak air "… yang tadi ditarik magnet" / "… yang tadi tidak ditarik magnet" (sama dengan label rak); instruksi "Lihat hasil percobaannya, lalu taruh …" |
| 1 | sains-bekal-sehat-pasar (dagang) | barang | Barang hanya buah/sayur; tidak ada permen pengecoh, jadi "bukan permen walau murah" tidak teruji, yang teruji hanya mengambil sejumlah barang | dibiarkan (keputusan koordinator: butuh fitur pengecoh di mesin dagang), dicatat |
| 6 | sains-cerah-mendung-hujan | urutan s-awan + knob steps 3 | Steps 3 memotong "Awan makin tebal" jadi cerah, awan tipis, awan tebal (tanpa hujan), padahal instruksi "lalu hujan". Urutannya tetap benar | diperbaiki (keputusan koordinator): `"potong": "tengah"`. Karena potong tengah membuang langkah ke-2, urutan "Sampai pelangi" (cerah, mendung, hujan, pelangi) akan kehilangan mendung saat steps 3. Maka urutan itu diganti "Angin membawa awan" (cerah, angin membawa awan, awan tebal, hujan), dan keterangan knob disesuaikan. Hasil uji 300 seed: steps 3 selalu cerah, mendung/tebal, hujan (11 urutan); steps 4 = 2 urutan (sama jumlahnya dengan sebelumnya). Pelangi tidak lagi ada di paket ini |
| 3 | sains-lengkapi-tubuh-boneka, sains-pasang-bagian-robot | mekanik | Kompetensi .02 = memasang bagian ke tempatnya pada tubuh; paket memakai pilih (menyentuh satu bagian), bukan menaruh ke posisi | mekanik pilih dibiarkan (keputusan koordinator); semua soal dan instruksi diubah menjadi bahasa memasang: "… Bagian mana yang dipasang di tempat yang kosong?" / "… masih kosong … Bagian mana yang dipasang?"; instruksi "Dengarkan tempat yang kosong, lalu sentuh …" |
| 5 | sains-payung-atau-topi, sains-siap-keluar-payung-topi | soal cerah | Di Indonesia payung juga dipakai saat terik | ditolak: kompetensi menetapkan topi untuk cerah; soal pilih sudah menyebut kegiatan lari/main bola |
| 2 | sains-mana-hewan-halaman | Mana burungnya? | Ayam dan bebek secara ilmiah juga burung | ditolak: jenjang PAUD mengenal nama, gambar 🐦 jelas beda |
| 5 | sains-langit-siang-malam, sains-siang-malam-di-kebun | naik sepeda, berangkat sekolah, menyiram tanaman pagi | Bisa dibaca bergantung waktu | ditolak: petunjuk cukup kuat; pagi termasuk rak matahari |
| 2 | sains-antar-ke-lapisan-laut | soal laut dalam | "gelap/dingin" juga berlaku untuk palung | ditolak: soal mengikuti label rak (laut dalam = gelap dan dingin; palung = paling dalam) |
| 2 | sains-alat-gerak-hewan-pantai | lalat, kupu-kupu | Serangga bersayap juga berkaki | ditolak: aturan alat gerak utama di kompetensi |

## Kalimat suara berubah
(dibuat ulang otomatis dari `git show HEAD:<berkas>`; 108 baris, termasuk kunci yang dihapus/ditambah)
| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sains-bekal-sehari-hari-pasar | instruksi | Robot belanja di pasar: makanan sehari-hari ke piring, jajanan sesekali ke toples. | Robot belanja di pasar: taruh makanan sehari-hari ke piring, jajanan sesekali ke toples. |
| sains-bekerja-dulu-di-taman | t-5 | Budi mau menghirup wangi bunga dalam-dalam. Bagian mana yang bekerja? | Budi mau menghirup udara segar dalam-dalam. Bagian mana yang bekerja? |
| sains-benda-dibuat-dari-apa | i-kresek | (tidak ada) | kantong kresek |
| sains-benda-dibuat-dari-apa | i-sisir | sisir rambut | (dihapus) |
| sains-habitat-hewan-lain | i-beluga | paus beluga | paus beluga di laut es |
| sains-hasil-percobaan-magnet | i-baut | mur dan baut besi | mur dan baut besi yang tadi ditarik magnet |
| sains-hasil-percobaan-magnet | i-boneka | boneka beruang | boneka beruang yang tadi tidak ditarik magnet |
| sains-hasil-percobaan-magnet | i-daun | daun | daun yang tadi tidak ditarik magnet |
| sains-hasil-percobaan-magnet | i-kait | kait besi | kait besi yang tadi ditarik magnet |
| sains-hasil-percobaan-magnet | i-kauskaki | kaus kaki | kaus kaki yang tadi tidak ditarik magnet |
| sains-hasil-percobaan-magnet | i-kayu | potongan kayu | potongan kayu yang tadi tidak ditarik magnet |
| sains-hasil-percobaan-magnet | i-kertas | kertas | kertas yang tadi tidak ditarik magnet |
| sains-hasil-percobaan-magnet | i-klip | klip kertas besi | klip kertas besi yang tadi ditarik magnet |
| sains-hasil-percobaan-magnet | i-krayon | krayon | krayon yang tadi tidak ditarik magnet |
| sains-hasil-percobaan-magnet | i-kunci | kunci besi | kunci besi yang tadi ditarik magnet |
| sains-hasil-percobaan-magnet | i-peniti | peniti | peniti yang tadi ditarik magnet |
| sains-hasil-percobaan-magnet | i-rantai | rantai besi | rantai besi yang tadi ditarik magnet |
| sains-hasil-percobaan-magnet | instruksi | Magnet sudah didekatkan ke tiap benda. Taruh ke rak ditarik magnet atau tidak ditarik. | Magnet sudah didekatkan ke tiap benda. Lihat hasil percobaannya, lalu taruh ke rak ditarik magnet atau tidak ditarik. |
| sains-kegiatan-sesuai-cuaca | i-berteduh | berteduh di rumah | hujan deras, berteduh di rumah |
| sains-kegiatan-sesuai-cuaca | i-eskrim | makan es krim di taman | matahari terik, makan es krim di taman |
| sains-kegiatan-sesuai-cuaca | i-jashujan | pakai jas hujan | hujan turun, pakai jas hujan |
| sains-kegiatan-sesuai-cuaca | i-jemur | menjemur baju | matahari terik, jemur baju |
| sains-kegiatan-sesuai-cuaca | i-kincir | main lonceng angin | angin bertiup, lonceng angin berbunyi |
| sains-kegiatan-sesuai-cuaca | i-layang | main layang-layang | angin kencang, waktunya main layang-layang |
| sains-kegiatan-sesuai-cuaca | i-layar | naik perahu layar | angin kencang, perahu layar melaju |
| sains-kegiatan-sesuai-cuaca | i-payung | pakai payung | hujan turun, pakai payung |
| sains-kegiatan-sesuai-cuaca | i-renang | berenang di kolam | hari cerah dan panas, berenang di kolam |
| sains-keranjang-indra-pasar | cokelat | cokelat | cokelat manis |
| sains-keranjang-indra-pasar | i-eskrim | es krim | es krim manis |
| sains-layu-atau-segar | instruksi | Lihat tempat tiap tanaman. Taruh ke rak akan layu beberapa hari lagi, atau tetap segar. | Lihat tempat dan keadaan tiap tanaman. Taruh ke rak akan layu beberapa hari lagi, atau tetap segar. |
| sains-lengkapi-tubuh-boneka | instruksi | Boneka belum lengkap. Dengarkan, lalu sentuh bagian tubuh yang harus dipasang. | Boneka belum lengkap. Dengarkan tempat yang kosong, lalu sentuh bagian tubuh yang harus dipasang. |
| sains-lengkapi-tubuh-boneka | t1 | Boneka belum punya kepala. Sentuh kepala! | Boneka belum punya kepala. Bagian mana yang dipasang di tempat yang kosong? |
| sains-lengkapi-tubuh-boneka | t10 | Badan dan kaki sudah ada. Apa yang dipasang di kiri dan kanan badan? | Badan dan kaki sudah ada. Bagian mana yang dipasang di kiri dan kanan badan? |
| sains-lengkapi-tubuh-boneka | t2 | Boneka belum punya kaki. Sentuh kaki! | Boneka belum punya kaki. Bagian mana yang dipasang di tempat yang kosong? |
| sains-lengkapi-tubuh-boneka | t3 | Boneka belum punya tangan. Sentuh tangan! | Boneka belum punya tangan. Bagian mana yang dipasang di tempat yang kosong? |
| sains-lengkapi-tubuh-boneka | t4 | Boneka belum punya badan. Sentuh badan! | Boneka belum punya badan. Bagian mana yang dipasang di tempat yang kosong? |
| sains-lengkapi-tubuh-boneka | t5 | Bagian paling atas tubuh, tempat mata dan mulut. Yang mana? | Bagian paling atas boneka masih kosong, tempat mata dan mulut. Bagian mana yang dipasang? |
| sains-lengkapi-tubuh-boneka | t6 | Bagian paling bawah, untuk berdiri dan berjalan. Yang mana? | Bagian paling bawah boneka masih kosong, untuk berdiri dan berjalan. Bagian mana yang dipasang? |
| sains-lengkapi-tubuh-boneka | t7 | Bagian untuk memegang dan melambai. Yang mana? | Boneka belum bisa memegang dan melambai. Bagian mana yang dipasang di tempat yang kosong? |
| sains-lengkapi-tubuh-boneka | t8 | Bagian tengah tubuh, tempat baju dipakai. Yang mana? | Bagian tengah boneka masih kosong, tempat baju dipakai. Bagian mana yang dipasang? |
| sains-lengkapi-tubuh-boneka | t9 | Kepala sudah ada. Apa yang dipasang di bawah kepala? | Kepala sudah ada. Bagian mana yang dipasang di tempat kosong tepat di bawah kepala? |
| sains-mana-organ-tubuh | judul | Mana Organnya? | Bagian di Dalam Tubuh |
| sains-papan-cuaca-kelas | t-angin1 | Tidak hujan, tapi bendera di tiang sekolah berkibar kencang. | Tidak hujan, tapi bendera di tiang sekolah berkibar kencang. Cuaca apa? |
| sains-papan-cuaca-kelas | t-angin2 | Pohon di halaman sekolah bergoyang kencang dan kertas beterbangan. | Pohon di halaman sekolah bergoyang kencang dan kertas beterbangan. Cuaca apa? |
| sains-papan-cuaca-kelas | t-angin3 | Rambut teman-teman berantakan tertiup angin kencang. | Rambut teman-teman berantakan tertiup angin kencang. Cuaca apa? |
| sains-papan-cuaca-kelas | t-cerah1 | Lapangan sekolah terang, langit biru tanpa awan. | Lapangan sekolah terang, langit biru tanpa awan. Cuaca apa? |
| sains-papan-cuaca-kelas | t-cerah2 | Teman-teman menyipitkan mata karena silau matahari. | Teman-teman menyipitkan mata karena silau matahari. Cuaca apa? |
| sains-papan-cuaca-kelas | t-cerah3 | Bayangan tiang bendera terlihat jelas di lapangan. | Bayangan tiang bendera terlihat jelas di lapangan. Cuaca apa? |
| sains-papan-cuaca-kelas | t-cerah4 | Murid-murid memakai topi karena matahari terik. | Murid-murid memakai topi karena matahari terik. Cuaca apa? |
| sains-papan-cuaca-kelas | t-hujan1 | Atap sekolah berbunyi tik-tik-tik dan kaca jendela basah. | Atap sekolah berbunyi tik-tik-tik dan kaca jendela basah. Cuaca apa? |
| sains-papan-cuaca-kelas | t-hujan2 | Lapangan penuh genangan dan air terus jatuh dari langit. | Lapangan penuh genangan dan air terus jatuh dari langit. Cuaca apa? |
| sains-papan-cuaca-kelas | t-hujan3 | Penjaga sekolah berjalan memakai payung dan jas hujan. | Penjaga sekolah berjalan memakai payung dan jas hujan. Cuaca apa? |
| sains-papan-cuaca-kelas | t-mendung1 | Langit di atas sekolah abu-abu, matahari tidak terlihat, tanah masih kering. | Langit di atas sekolah abu-abu, matahari tidak terlihat, tanah masih kering. Cuaca apa? |
| sains-papan-cuaca-kelas | t-mendung2 | Awan tebal dan gelap menutupi langit, tapi belum ada tetes air. | Awan tebal dan gelap menutupi langit, tapi belum ada tetes air. Cuaca apa? |
| sains-pasang-bagian-robot | instruksi | Robot belum lengkap. Dengarkan, lalu sentuh bagian tubuh yang harus dipasang. | Robot belum lengkap. Dengarkan tempat yang kosong, lalu sentuh bagian tubuh yang harus dipasang. |
| sains-pasang-bagian-robot | t-badan1 | Robot belum punya badan. Pasang yang mana? | Robot belum punya badan. Bagian mana yang dipasang di tempat yang kosong? |
| sains-pasang-bagian-robot | t-badan2 | Bagian tengah robot masih kosong, di antara kepala dan kaki. | Bagian tengah robot masih kosong, di antara kepala dan kaki. Bagian mana yang dipasang? |
| sains-pasang-bagian-robot | t-kaki1 | Robot belum punya kaki. Pasang yang mana? | Robot belum punya kaki. Bagian mana yang dipasang di tempat yang kosong? |
| sains-pasang-bagian-robot | t-kaki2 | Robot mau berjalan. Pasang bagian paling bawah. | Robot mau berjalan, tapi bagian paling bawahnya kosong. Bagian mana yang dipasang? |
| sains-pasang-bagian-robot | t-kaki3 | Robot mau melompat, tapi di bawah badannya masih kosong. | Robot mau melompat, tapi di bawah badannya masih kosong. Bagian mana yang dipasang? |
| sains-pasang-bagian-robot | t-kepala1 | Robot belum punya kepala. Pasang yang mana? | Robot belum punya kepala. Bagian mana yang dipasang di tempat yang kosong? |
| sains-pasang-bagian-robot | t-kepala2 | Di atas badan robot masih kosong. Pasang bagian tempat mata dan mulut. | Di atas badan robot masih kosong, tempat mata dan mulut. Bagian mana yang dipasang? |
| sains-pasang-bagian-robot | t-kepala3 | Robot mau melihat dan berbicara. Pasang bagian paling atas. | Robot mau melihat dan berbicara, tapi bagian paling atasnya kosong. Bagian mana yang dipasang? |
| sains-pasang-bagian-robot | t-tangan1 | Robot belum punya tangan. Pasang yang mana? | Robot belum punya tangan. Bagian mana yang dipasang di tempat yang kosong? |
| sains-pasang-bagian-robot | t-tangan2 | Robot mau memegang bola, tapi sisi badannya masih kosong. | Robot mau memegang bola, tapi sisi badannya masih kosong. Bagian mana yang dipasang? |
| sains-pasang-bagian-robot | t-tangan3 | Robot mau melambai. Pasang bagian di kiri dan kanan badan. | Robot mau melambai, tapi kiri dan kanan badannya kosong. Bagian mana yang dipasang? |
| sains-percobaan-magnet-gudang | i-jarum | jarum jahit | jarum jahit yang tadi ditarik magnet |
| sains-percobaan-magnet-gudang | i-kaleng | kaleng besi | kaleng besi yang tadi ditarik magnet |
| sains-percobaan-magnet-gudang | i-kardus | kardus | kardus yang tadi tidak ditarik magnet |
| sains-percobaan-magnet-gudang | i-keranjang | keranjang anyaman | keranjang anyaman yang tadi tidak ditarik magnet |
| sains-percobaan-magnet-gudang | i-kunciinggris | kunci pas besi | kunci pas besi yang tadi ditarik magnet |
| sains-percobaan-magnet-gudang | i-lilin | lilin | lilin yang tadi tidak ditarik magnet |
| sains-percobaan-magnet-gudang | i-obeng | obeng besi | obeng besi yang tadi ditarik magnet |
| sains-percobaan-magnet-gudang | i-palu | palu besi | palu besi yang tadi ditarik magnet |
| sains-percobaan-magnet-gudang | i-rodagigi | roda gigi besi | roda gigi besi yang tadi ditarik magnet |
| sains-percobaan-magnet-gudang | i-sapu | sapu ijuk | sapu ijuk yang tadi tidak ditarik magnet |
| sains-percobaan-magnet-gudang | i-sarungtangan | sarung tangan kain | sarung tangan kain yang tadi tidak ditarik magnet |
| sains-percobaan-magnet-gudang | i-tali | tali | tali yang tadi tidak ditarik magnet |
| sains-percobaan-magnet-gudang | instruksi | Magnet sudah didekatkan ke barang-barang gudang. Taruh ke rak ditarik magnet atau tidak ditarik. | Magnet sudah didekatkan ke barang-barang gudang. Lihat hasil percobaannya, lalu taruh ke rak ditarik magnet atau tidak ditarik. |
| sains-rak-bahan-dapur | i-garpu | garpu makan | garpu besi |
| sains-rawat-tanaman-berbunga | i-cabut | dicabut setiap hari | tanamannya dicabut dari pot |
| sains-senam-tunjuk-tubuh | t-hidung2 | Dina mencium bunga yang harum. Tunjuk hidungnya! | Dina mencium bunga dengan hidung. Tunjuk hidungnya! |
| sains-senam-tunjuk-tubuh | t-kaki1 | Ayo senam! Hentakkan kaki, satu, dua! | Ayo senam! Tunjuk kaki, lalu hentakkan, satu, dua! |
| sains-senam-tunjuk-tubuh | t-kaki2 | Dina menendang bola. Tunjuk kakinya! | Dina menendang bola dengan kaki. Tunjuk kakinya! |
| sains-senam-tunjuk-tubuh | t-mata2 | Dina melihat burung terbang. Tunjuk matanya! | Dina melihat burung dengan mata. Tunjuk matanya! |
| sains-senam-tunjuk-tubuh | t-mulut1 | Ayo senam! Buka mulut lebar-lebar, aaa! | Ayo senam! Tunjuk mulut, lalu buka lebar-lebar, aaa! |
| sains-senam-tunjuk-tubuh | t-mulut2 | Dina makan pisang. Tunjuk mulutnya! | Dina menggigit pisang dengan mulut. Tunjuk mulutnya! |
| sains-senam-tunjuk-tubuh | t-tangan1 | Ayo senam! Lambaikan tangan ke kiri dan ke kanan. | Ayo senam! Tunjuk tangan, lalu lambaikan ke kiri dan ke kanan. |
| sains-senam-tunjuk-tubuh | t-telinga1 | Ayo senam! Tarik telinga pelan-pelan. | Ayo senam! Tunjuk telinga, lalu tarik pelan-pelan. |
| sains-senam-tunjuk-tubuh | t-telinga2 | Dina mendengar musik. Tunjuk telinganya! | Dina mendengar musik dengan telinga. Tunjuk telinganya! |
| sains-siapa-hidup-di-rumah | t-beo2 | Boneka dan robot mainan mirip hewan. Mana yang benar-benar hidup? | Boneka dan robot mainan mirip makhluk hidup. Mana yang benar-benar hidup? |
| sains-simbol-cuaca-jendela | t1 | Dari jendela kamar, langit biru dan matahari bersinar terang. | Dari jendela kamar, langit biru dan matahari bersinar terang. Cuaca apa? |
| sains-simbol-cuaca-jendela | t10 | Kucing berjemur di teras, sinar matahari terang sekali. | Kucing berjemur di teras, sinar matahari terang sekali. Cuaca apa? |
| sains-simbol-cuaca-jendela | t2 | Ibu menjemur baju di halaman yang terang dan panas. | Ibu menjemur baju di halaman yang terang dan panas. Cuaca apa? |
| sains-simbol-cuaca-jendela | t3 | Langit di atas sawah abu-abu penuh awan, tapi belum ada air jatuh. | Langit di atas sawah abu-abu penuh awan, tapi belum ada air jatuh. Cuaca apa? |
| sains-simbol-cuaca-jendela | t4 | Matahari tertutup awan tebal, kebun jadi redup. | Matahari tertutup awan tebal, kebun jadi redup. Cuaca apa? |
| sains-simbol-cuaca-jendela | t5 | Air jatuh dari langit, jalan depan rumah jadi basah. | Air jatuh dari langit, jalan depan rumah jadi basah. Cuaca apa? |
| sains-simbol-cuaca-jendela | t6 | Ayah pulang memakai jas hujan yang basah. | Ayah pulang memakai jas hujan yang basah. Cuaca apa? |
| sains-simbol-cuaca-jendela | t7 | Pohon jambu di halaman bergoyang kencang, jemuran berkibar. | Pohon jambu di halaman bergoyang kencang, jemuran berkibar. Cuaca apa? |
| sains-simbol-cuaca-jendela | t8 | Layang-layang tetangga terbang tinggi sekali. | Layang-layang tetangga terbang tinggi sekali. Cuaca apa? |
| sains-simbol-cuaca-jendela | t9 | Ada tetes air di kaca jendela dan genangan di teras. | Ada tetes air di kaca jendela dan genangan di teras. Cuaca apa? |
| sains-cerah-mendung-hujan | pelangi-angin | (tidak ada) | angin membawa awan |
| sains-cerah-mendung-hujan | pelangi-mendung | awan tebal | awan tebal, langit gelap |
| sains-cerah-mendung-hujan | pelangi-pelangi | pelangi muncul | (dihapus) |
| sains-cerah-mendung-hujan | s-pelangi | Sampai pelangi | Angin membawa awan |
| sains-siklus-ayam | judul | Telur Jadi Ayam | Telur Jadi Ayam dan Bebek |
| sains-susun-tumbuhan-utuh | instruksi | Susun potongan dari bawah tanah ke pucuk: akar, batang, daun, lalu bunga. | Susun potongan dari bawah tanah ke pucuk: akar, batang, daun, lalu bunga bila ada. |
| sains-susun-tumbuhan-utuh | padi-bulir | malai padi di pucuk | bunga padi di pucuk |

## Butuh keputusan owner
Putaran kedua: koordinator sudah memutuskan kelima butir dari putaran pertama (lihat tabel Temuan). Yang tersisa hanya catatan:
| paket/kompetensi | masalah | opsi |
|---|---|---|
| sains-bekal-sehat-pasar / SAINS.TKB.MAKANAN-SEHAT.03 | Tidak ada jajanan pengecoh di barang dagang, jadi "memilih buah/sayur, bukan permen walau murah" tidak teruji | dibiarkan sampai mesin dagang mendukung barang pengecoh; lalu tambah permen/lolipop murah |
| sains-cerah-mendung-hujan / SAINS.PAUD.SIANG-MALAM-CUACA.03 | Catatan kurikulum menyebut knob 4 = "tambah pelangi setelah hujan"; urutan pelangi dilepas karena tidak cocok dengan potong tengah | bila pelangi tetap diinginkan: butuh opsi potong per urutan di mesin, atau paket terpisah 4 langkah tetap |
