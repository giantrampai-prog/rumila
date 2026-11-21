# Keputusan 05: SAINS PAUD, TK A, TK B (putaran 2)

Sumber butir: docs/akademi/audit-qc-2026-11-21/perbaikan-05-sains-paud-tk.md, bagian "Butuh keputusan owner" (16 butir).
17 paket diubah (versi patch naik), kurikulum SAINS-TKA.json dan SAINS-TKB.json diubah (pernyataan dan catatan). Tidak ada berkas paket baru atau yang dihapus.
Validasi: `npx tsx packages/schema/src/cli.ts` menghasilkan 810 paket valid dan 0 error kurikulum. `akademi:audit` tidak melaporkan ERROR atau WARNING untuk paket SAINS (ERROR yang tersisa, `mesin-tukar-koin`, milik agen lain).

## Keputusan yang diambil
| butir | keputusan | perubahan |
|---|---|---|
| sains-urutkan-matahari-bumi-bulan (TKB.MATAHARI-BUMI-BULAN.02): isinya ukuran, kompetensinya lintasan | Ditulis ulang menjadi urutan pusat–pengiring | Dua urutan: `tengah` "Dari tengah ke luar" (Matahari → Bumi → Bulan) dan `luar` "Dari luar ke tengah" (Bulan → Bumi → Matahari). Label polos (Matahari/Bumi/Bulan). Instruksi tidak lagi membocorkan jawaban dan arah ditunjukkan judul. Judul paket: "Susun Model Tata Surya". Catatan kompetensi .02: ide urutan ukuran diganti varian pusat–pengiring. |
| sains-siklus-ayam: knob steps=3 memotong tahap dewasa | Diselesaikan lewat isi | Semua urutan kini 3 tahap: "ayam" tanpa telur retak, "bebek-menetas" tanpa anak bebek (telur → menetas → dewasa). Knob steps 3/3/3. rounds 10 → 8 (sama dengan jumlah urutan berbeda). Label `tumbuh-retak`/`bebek-menetas-retak` menjadi "anak ayam/bebek menetas". Tahap telur retak (4 tahap) dicatat di Butuh fitur baru. Catatan TKA.SIKLUS-HIDUP.01 ditambah. |
| sains-biji-sampai-berbunga: knob steps=3 memotong tahap berbunga | Diselesaikan lewat isi | Semua urutan 4 tahap (biji, tunas, berdaun, berbunga), sesuai pernyataan "4 gambar". Tahap berdaun ditambah ke kenikir, mawar, kembang sepatu, merah muda, teratai. Urutan kembar "Bunga kuning" (sama dengan kenikir) dan "Bunga matahari kecil" dihapus, ditambah "Melati tumbuh" (💮). Knob steps 4/4/4, rounds 10 → 9. Versi 3 gambar dicatat di Butuh fitur baru. Catatan TKA.BAGIAN-TUMBUHAN.04 ditambah. |
| sains-siklus-kupu-kupu: urutan 5 langkah terpotong, keterangan knob keliru | Diselesaikan lewat isi | "Ulat makan banyak" menjadi 4 langkah (langkah "ulat kecil" dibuang). Knob steps 4/4/4 dengan keterangan yang benar. Versi bantuan 3 tahap tanpa telur dicatat di Butuh fitur baru. |
| SAINS.TKB.KEBUTUHAN-TUMBUHAN.03: pernyataan masih "sebelum hari berganti" | Diubah | Pernyataan: "Aku bisa menunjuk tanaman yang akan layu beberapa hari lagi, misalnya yang disimpan di tempat gelap" (EN "…will wilt in a few days…"). Catatan menjadi "sebelum animasi beberapa hari berjalan". |
| sains-rak-sayur-bagian-tumbuhan (TKA.BAGIAN-TUMBUHAN.03): rak batang/bunga, tanpa rak buah | Rak batang dan bunga diganti rak buah | Item tebu, rebung, brokoli, kembang kol dihapus. Bin `buah` 🍎 ditambah, dengan item tomat 🍅, terung 🍆, cabai 🌶️, timun 🥒 (sayur buah, cocok untuk "rak sayur"). Instruksi ditambah "tomat ke buah". Knob binCount 2 → 3. |
| sains-anak-dan-induk: kecebong 🐟 | Kecebong dan bin katak dihapus | Sesuai catatan kompetensi (belum ada kompetensi siklus katak). Knob binCount dan itemCount maks 6 → 5. |
| sains-cuaca-begini-main-apa: pengecoh kegiatan di dalam rumah | Item buku dan puzel dihapus | Catatan kompetensi melarang item kegiatan di dalam rumah. Item baru: "berteduh di teras rumah" 🏠, "berjalan memakai payung" ☂️ (keduanya hujan), "menjemur baju" 👕 (cerah). Soal hujan2 kini jawabannya teras, hujan3 payung ("berjalan ke masjid"), cerah4 jemur. Payung tidak dipakai sebagai pengecoh di soal cerah karena di Indonesia payung juga lazim saat terik. |
| sains-alat-gerak-hewan-pantai: 3 burung di stok | Burung diganti | Elang, beo, burung hantu diganti kupu-kupu 🦋, lebah 🐝, kelelawar 🦇. |
| sains-bekal-sehari-hari-pasar, sains-piring-sehari-hari: bin "kadang-kadang" mirip "sesekali" | Bin `kadang` dihapus | Isinya (panekuk, biskuit, roti manis, wafel) dipindah ke toples. Knob binCount 2/2/2. Catatan TKB.MAKANAN-SEHAT.01 diselaraskan. |
| sains-bekal-sehat-pasar (TKB.MAKANAN-SEHAT.03): tanpa jajanan pengecoh | Butuh fitur. Isi tidak diubah | Mode dagang `ambil` memesan dari semua barang, jadi permen yang ditambah akan ikut dipesan. Bukti kompetensi .03 sudah ada di paket pilah sains-murah-belum-tentu-sehat. Lihat Butuh fitur baru. |
| Emoji akar 🫚 (jahe) di paket TKA bagian tumbuhan | Butuh fitur | Tidak ada emoji atau bentuk yang ada yang mirip akar serabut. Lihat Butuh fitur baru. |
| sains-payung-atau-topi: payung lazim saat terik | Soal cerah dipertegas | Keempat soal cerah kini menyebut kegiatan aktif (lari-larian, main bola, kejar-kejaran, main di lapangan), sehingga payung tidak praktis. Soal cerah4 menanyakan "Mana yang dipakai di kepala?". |
| sains-susun-tumbuhan-utuh: "bulir padi" di posisi bunga | Label diganti | "malai padi di pucuk". Keterangan knob steps juga diperbaiki menjadi "3 (akar, batang, daun) → 4 (tambah bunga di pucuk)", sesuai potongan dari ujung. |
| sains-siklus-ayam, sains-anak-siapa-di-peternakan: anak bebek 🐤 | Butuh fitur | Tidak ada emoji anak bebek. `color` pada emoji hanya menjadi latar, jadi tidak membantu. Lihat Butuh fitur baru. |
| sains-papan-cuaca-kelas vs sains-simbol-cuaca-jendela | Konteks dibedakan | simbol-cuaca-jendela kini berkonteks rumah (jendela kamar, jemuran, sawah, teras, tetangga, ayah pulang). Judul: "Cuaca dari Jendela Rumah". Papan-cuaca-kelas tetap berkonteks sekolah. |
| sains-bekal-cuaca-piknik vs sains-lemari-cuaca | Konteks dibedakan | Semua soal piknik kini berlatar piknik atau kemah (padang rumput, danau, kebun teh, tikar, perkemahan). Soal "Hari panas dan gerah…" diganti "Main kejar-kejaran di taman siang hari, badan berkeringat…". lemari-cuaca tidak diubah. |
| TKA.APUNG-TENGGELAM-MAGNET.01 vs .02: bukti tidak berbeda | Paket .01 menjadi "catat hasil" | Di sains-percobaan-bak-cuci-dapur dan sains-hasil-percobaan-bak-air, setiap label membawa hasil percobaan ("apel yang tadi terapung", "sendok logam yang tadi tenggelam"), dan instruksi "Dengarkan hasilnya, lalu taruh…". Jadi .01 melatih mencatat hasil, sedangkan .02 (tebak) tetap menebak tanpa hasil. Catatan TKA.APUNG-TENGGELAM-MAGNET.01 ditambah. Simulasi bak air tetap dicatat di Butuh fitur baru. |
| sains-benda-dibuat-dari-apa (TKB.BAHAN.03): bin kain, tanpa plastik | Bin kain diganti plastik | Item tenda, kaus kaki, layar dihapus. Bin `plastik` 🥤 ditambah, dengan item gagang sikat gigi 🪥, botol sabun cair 🧴, sisir rambut 🪮. Ember sengaja tidak dipakai (bisa plastik atau logam). "perahu dayung" menjadi "perahu kayu" (bukan fiber). |

## Kalimat suara berubah
Dibuat otomatis dengan membandingkan `locale.id` ke `git show HEAD:<berkas>`.

| paket | kunci | lama | baru |
|---|---|---|---|
| sains-urutkan-matahari-bumi-bulan | besar-bulan | Bulan paling kecil | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | besar-bumi | Bumi | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | besar-matahari | Matahari paling besar | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | bulan | (baru) | Bulan |
| sains-urutkan-matahari-bumi-bulan | bumi | (baru) | Bumi |
| sains-urutkan-matahari-bumi-bulan | instruksi | Susun benda langit dari yang paling besar ke paling kecil: Matahari, Bumi, lalu Bulan. | Susun model tata surya kecil: siapa di tengah, siapa mengitari siapa. Ikuti petunjuk di atas gambar. |
| sains-urutkan-matahari-bumi-bulan | judul | Paling Besar ke Paling Kecil di Langit | Susun Model Tata Surya |
| sains-urutkan-matahari-bumi-bulan | matahari | (baru) | Matahari |
| sains-urutkan-matahari-bumi-bulan | polos-bulan | Bulan | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | polos-bumi | Bumi | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | polos-matahari | Matahari | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | s-besar | Dari paling besar | (dihapus) |
| sains-urutkan-matahari-bumi-bulan | s-luar | (baru) | Dari luar ke tengah |
| sains-urutkan-matahari-bumi-bulan | s-tengah | (baru) | Dari tengah ke luar |
| sains-siklus-ayam | ayam-retak | telur retak, menetas | (dihapus) |
| sains-siklus-ayam | bebek-menetas-anak | anak bebek kecil | (dihapus) |
| sains-siklus-ayam | bebek-menetas-retak | telur retak, menetas | anak bebek menetas |
| sains-siklus-ayam | tumbuh-retak | telur retak, menetas | anak ayam menetas |
| sains-biji-sampai-berbunga | kenikir-daun | (baru) | berdaun banyak |
| sains-biji-sampai-berbunga | kuning-biji | biji di tanah | (dihapus) |
| sains-biji-sampai-berbunga | kuning-bunga | berbunga | (dihapus) |
| sains-biji-sampai-berbunga | kuning-tunas | tunas kecil | (dihapus) |
| sains-biji-sampai-berbunga | matahari-biji | biji di tanah | (dihapus) |
| sains-biji-sampai-berbunga | matahari-bunga | berbunga | (dihapus) |
| sains-biji-sampai-berbunga | matahari-tunas | tunas kecil | (dihapus) |
| sains-biji-sampai-berbunga | mawar-daun | (baru) | berdaun banyak |
| sains-biji-sampai-berbunga | melati-biji | (baru) | biji di tanah |
| sains-biji-sampai-berbunga | melati-bunga | (baru) | berbunga putih |
| sains-biji-sampai-berbunga | melati-daun | (baru) | berdaun banyak |
| sains-biji-sampai-berbunga | melati-tunas | (baru) | tunas kecil |
| sains-biji-sampai-berbunga | merahmuda-daun | (baru) | berdaun banyak |
| sains-biji-sampai-berbunga | sepatu-daun | (baru) | berdaun lebat |
| sains-biji-sampai-berbunga | t-kuning | Bunga kuning tumbuh | (dihapus) |
| sains-biji-sampai-berbunga | t-matahari | Bunga matahari kecil | (dihapus) |
| sains-biji-sampai-berbunga | t-melati | (baru) | Melati tumbuh |
| sains-biji-sampai-berbunga | teratai-daun | (baru) | berdaun lebar di air |
| sains-siklus-kupu-kupu | gemuk-ulat | ulat kecil | (dihapus) |
| sains-susun-tumbuhan-utuh | padi-bulir | bulir padi di pucuk | malai padi di pucuk |
| sains-rak-sayur-bagian-tumbuhan | batang | batang | (dihapus) |
| sains-rak-sayur-bagian-tumbuhan | buah | (baru) | buah |
| sains-rak-sayur-bagian-tumbuhan | bunga | bunga | (dihapus) |
| sains-rak-sayur-bagian-tumbuhan | i-brokoli | brokoli | (dihapus) |
| sains-rak-sayur-bagian-tumbuhan | i-cabai | (baru) | cabai |
| sains-rak-sayur-bagian-tumbuhan | i-kembangkol | kembang kol | (dihapus) |
| sains-rak-sayur-bagian-tumbuhan | i-rebung | rebung bambu | (dihapus) |
| sains-rak-sayur-bagian-tumbuhan | i-tebu | tebu | (dihapus) |
| sains-rak-sayur-bagian-tumbuhan | i-terung | (baru) | terung |
| sains-rak-sayur-bagian-tumbuhan | i-timun | (baru) | timun |
| sains-rak-sayur-bagian-tumbuhan | i-tomat | (baru) | tomat |
| sains-rak-sayur-bagian-tumbuhan | instruksi | Taruh tiap sayur ke rak bagian tumbuhan asalnya: wortel ke akar, bayam ke daun. | Taruh tiap sayur ke rak bagian tumbuhan asalnya: wortel ke akar, bayam ke daun, tomat ke buah. |
| sains-anak-dan-induk | i-kecebong | kecebong berekor | (dihapus) |
| sains-anak-dan-induk | katak | katak | (dihapus) |
| sains-cuaca-begini-main-apa | i-buku | membaca buku di dalam rumah | (dihapus) |
| sains-cuaca-begini-main-apa | i-jemur | (baru) | menjemur baju |
| sains-cuaca-begini-main-apa | i-payung | (baru) | berjalan memakai payung |
| sains-cuaca-begini-main-apa | i-puzzle | main puzel di dalam rumah | (dihapus) |
| sains-cuaca-begini-main-apa | i-teras | (baru) | berteduh di teras rumah |
| sains-cuaca-begini-main-apa | t-cerah4 | Siang cerah, jalan di taman kering. Main apa? | Matahari terik dan halaman kering. Apa yang cocok dikerjakan? |
| sains-cuaca-begini-main-apa | t-hujan2 | Hujan dan petir di luar. Kegiatan apa yang cocok? | Hujan dan petir di luar. Apa yang sebaiknya dilakukan? |
| sains-cuaca-begini-main-apa | t-hujan3 | Hujan seharian, semua anak di dalam rumah. Main apa? | Hujan turun saat kita harus berjalan ke masjid. Apa yang dilakukan? |
| sains-alat-gerak-hewan-pantai | i-beo | burung beo | (dihapus) |
| sains-alat-gerak-hewan-pantai | i-burunghantu | burung hantu | (dihapus) |
| sains-alat-gerak-hewan-pantai | i-elang | elang | (dihapus) |
| sains-alat-gerak-hewan-pantai | i-kelelawar | (baru) | kelelawar |
| sains-alat-gerak-hewan-pantai | i-kupu | (baru) | kupu-kupu |
| sains-alat-gerak-hewan-pantai | i-lebah | (baru) | lebah |
| sains-bekal-sehari-hari-pasar | kadang | kadang-kadang | (dihapus) |
| sains-piring-sehari-hari | kadang | kadang-kadang | (dihapus) |
| sains-payung-atau-topi | t-cerah1 | Langit cerah, matahari terik. Mana yang dipakai? | Langit cerah, matahari terik. Robot mau lari-larian. Mana yang dipakai? |
| sains-payung-atau-topi | t-cerah2 | Matahari bersinar terang. Mana yang dipakai? | Matahari bersinar terang. Robot mau main bola. Mana yang dipakai? |
| sains-payung-atau-topi | t-cerah3 | Siang hari panas sekali di lapangan. Mana yang dipakai? | Siang hari panas sekali. Robot mau main kejar-kejaran. Mana yang dipakai? |
| sains-payung-atau-topi | t-cerah4 | Tidak ada awan, matahari bersinar di atas kepala. Mana yang dipakai? | Tidak ada awan, matahari di atas kepala. Robot mau main di lapangan. Mana yang dipakai di kepala? |
| sains-simbol-cuaca-jendela | instruksi | Lihat langit di luar jendela, lalu pasang simbol cuaca yang cocok. | Lihat langit dari jendela rumah, lalu pasang simbol cuaca yang cocok. |
| sains-simbol-cuaca-jendela | judul | Simbol Cuaca di Jendela | Cuaca dari Jendela Rumah |
| sains-simbol-cuaca-jendela | t1 | Langit biru, matahari bersinar terang. | Dari jendela kamar, langit biru dan matahari bersinar terang. |
| sains-simbol-cuaca-jendela | t10 | Panas sekali, semua ingin berteduh dari sinar matahari. | Kucing berjemur di teras, sinar matahari terang sekali. |
| sains-simbol-cuaca-jendela | t2 | Tidak ada awan, bayangan kita terlihat jelas. | Ibu menjemur baju di halaman yang terang dan panas. |
| sains-simbol-cuaca-jendela | t3 | Langit abu-abu penuh awan, tapi belum ada air jatuh. | Langit di atas sawah abu-abu penuh awan, tapi belum ada air jatuh. |
| sains-simbol-cuaca-jendela | t4 | Matahari tertutup awan tebal. | Matahari tertutup awan tebal, kebun jadi redup. |
| sains-simbol-cuaca-jendela | t5 | Air jatuh dari langit, jalan jadi basah. | Air jatuh dari langit, jalan depan rumah jadi basah. |
| sains-simbol-cuaca-jendela | t6 | Orang-orang memakai payung dan jas hujan. | Ayah pulang memakai jas hujan yang basah. |
| sains-simbol-cuaca-jendela | t7 | Daun-daun bergoyang kencang dan topi hampir terbang. | Pohon jambu di halaman bergoyang kencang, jemuran berkibar. |
| sains-simbol-cuaca-jendela | t8 | Layang-layang terbang tinggi, bendera berkibar kencang. | Layang-layang tetangga terbang tinggi sekali. |
| sains-simbol-cuaca-jendela | t9 | Ada genangan air dan tetes air di kaca jendela. | Ada tetes air di kaca jendela dan genangan di teras. |
| sains-bekal-cuaca-piknik | t-dingin | Dingin sekali, tangan kaku. Pakai apa? | Piknik di kebun teh di gunung, tangan kaku kedinginan. Pakai apa? |
| sains-bekal-cuaca-piknik | t-dingin2 | Angin dingin bertiup, leher terasa dingin. Pakai apa? | Angin dingin bertiup di tepi danau, leher terasa dingin. Pakai apa? |
| sains-bekal-cuaca-piknik | t-dingin3 | Badan menggigil kedinginan. Pakai apa? | Piknik sampai sore di gunung, badan menggigil. Pakai apa? |
| sains-bekal-cuaca-piknik | t-dingin4 | Kaki dingin sekali. Pakai apa di kaki? | Malam di perkemahan, kaki dingin sekali. Pakai apa di kaki? |
| sains-bekal-cuaca-piknik | t-hujan | Hujan turun, jalan becek. Pakai apa di kaki? | Jalan setapak ke danau becek karena hujan. Pakai apa di kaki? |
| sains-bekal-cuaca-piknik | t-hujan2 | Gerimis mulai turun. Bawa apa? | Gerimis turun saat kita makan bekal di taman. Bawa apa? |
| sains-bekal-cuaca-piknik | t-panas | Langit cerah, silau sekali. Pakai apa? | Piknik di padang rumput, matahari silau sekali. Pakai apa? |
| sains-bekal-cuaca-piknik | t-panas2 | Hari panas dan gerah. Pakai baju apa? | Main kejar-kejaran di taman siang hari, badan berkeringat. Pakai baju apa? |
| sains-bekal-cuaca-piknik | t-panas3 | Matahari terik, kepala kepanasan. Pakai apa di kepala? | Duduk di tikar di bawah terik matahari, kepala kepanasan. Pakai apa di kepala? |
| sains-benda-dibuat-dari-apa | b-kain | kain | (dihapus) |
| sains-benda-dibuat-dari-apa | b-plastik | (baru) | plastik |
| sains-benda-dibuat-dari-apa | i-botolsabun | (baru) | botol sabun cair |
| sains-benda-dibuat-dari-apa | i-kaoskaki | kaus kaki | (dihapus) |
| sains-benda-dibuat-dari-apa | i-layar | layar perahu | (dihapus) |
| sains-benda-dibuat-dari-apa | i-perahu | perahu dayung | perahu kayu |
| sains-benda-dibuat-dari-apa | i-sikatgigi | (baru) | gagang sikat gigi |
| sains-benda-dibuat-dari-apa | i-sisir | (baru) | sisir rambut |
| sains-benda-dibuat-dari-apa | i-tenda | tenda kemah | (dihapus) |
| sains-benda-dibuat-dari-apa | instruksi | Taruh tiap benda ke bahan yang paling cocok: kayu, logam, kaca, atau kain. | Taruh tiap benda ke bahan yang paling cocok: kayu, logam, kaca, atau plastik. |
| sains-percobaan-bak-cuci-dapur | i-apel | apel | apel yang tadi terapung |
| sains-percobaan-bak-cuci-dapur | i-batu | batu ulekan | batu ulekan yang tadi tenggelam |
| sains-percobaan-bak-cuci-dapur | i-esbatu | es batu | es batu yang tadi terapung |
| sains-percobaan-bak-cuci-dapur | i-garpu | garpu logam | garpu logam yang tadi tenggelam |
| sains-percobaan-bak-cuci-dapur | i-kelapa | kelapa | kelapa yang tadi terapung |
| sains-percobaan-bak-cuci-dapur | i-kentang | kentang | kentang yang tadi tenggelam |
| sains-percobaan-bak-cuci-dapur | i-koin | koin | koin yang tadi tenggelam |
| sains-percobaan-bak-cuci-dapur | i-lemon | lemon | lemon yang tadi terapung |
| sains-percobaan-bak-cuci-dapur | i-pisang | pisang | pisang yang tadi terapung |
| sains-percobaan-bak-cuci-dapur | i-sendok | sendok logam | sendok logam yang tadi tenggelam |
| sains-percobaan-bak-cuci-dapur | i-sumpit | sumpit kayu | sumpit kayu yang tadi terapung |
| sains-percobaan-bak-cuci-dapur | i-telur | telur segar | telur segar yang tadi tenggelam |
| sains-percobaan-bak-cuci-dapur | instruksi | Benda dapur sudah dicoba di bak cuci berisi air. Taruh ke rak terapung atau tenggelam sesuai hasilnya. | Benda dapur sudah dicoba di bak cuci berisi air. Dengarkan hasilnya, lalu taruh ke rak terapung atau tenggelam. |
| sains-hasil-percobaan-bak-air | i-balon | balon | balon yang tadi terapung |
| sains-hasil-percobaan-bak-air | i-botol | botol plastik kosong | botol plastik kosong yang tadi terapung |
| sains-hasil-percobaan-bak-air | i-cincin | cincin logam | cincin logam yang tadi tenggelam |
| sains-hasil-percobaan-bak-air | i-gembok | gembok | gembok yang tadi tenggelam |
| sains-hasil-percobaan-bak-air | i-gunting | gunting | gunting yang tadi tenggelam |
| sains-hasil-percobaan-bak-air | i-jeruk | jeruk | jeruk yang tadi terapung |
| sains-hasil-percobaan-bak-air | i-kapak | palu | palu yang tadi tenggelam |
| sains-hasil-percobaan-bak-air | i-kerang | cangkang kerang | cangkang kerang yang tadi tenggelam |
| sains-hasil-percobaan-bak-air | i-paku | baut besi | baut besi yang tadi tenggelam |
| sains-hasil-percobaan-bak-air | i-pensil | pensil kayu | pensil kayu yang tadi terapung |
| sains-hasil-percobaan-bak-air | i-sandal | sandal karet | sandal karet yang tadi terapung |
| sains-hasil-percobaan-bak-air | i-spons | spons | spons yang tadi terapung |
| sains-hasil-percobaan-bak-air | instruksi | Benda sudah dicoba di bak air. Taruh ke rak terapung atau tenggelam sesuai hasilnya. | Benda sudah dicoba di bak air. Dengarkan hasilnya, lalu taruh ke rak terapung atau tenggelam. |
| kurikulum SAINS-TKB | SAINS.TKB.KEBUTUHAN-TUMBUHAN.03 statement.id | Aku bisa menunjuk tanaman yang akan layu sebelum hari berganti, misalnya yang disimpan di tempat gelap | Aku bisa menunjuk tanaman yang akan layu beberapa hari lagi, misalnya yang disimpan di tempat gelap |

## Butuh fitur baru
| paket | item/urutan | fitur | nilai yang diinginkan |
|---|---|---|---|
| sains-siklus-ayam | urutan ayam, bebek-menetas | `potong: "tengah"` | Kembalikan langkah "telur retak, menetas" 🐣 di tengah (telur → retak → anak → dewasa), lalu knob steps min 3, max 4, default 3. Dengan potong tengah, steps 3 membuang tahap retak, bukan tahap dewasa. |
| sains-biji-sampai-berbunga | semua urutan | `potong: "tengah"` | Knob steps min 3, max 4, default 4. Steps 3 harus membuang tahap "berdaun" (biji → tunas → berbunga). |
| sains-siklus-kupu-kupu | semua urutan | potong dari depan (bukan tengah) | Versi bantuan 3 tahap menurut kompetensi adalah "tanpa telur" (ulat → kepompong → kupu-kupu). `potong: "tengah"` akan membuang ulat atau kepompong, jadi tidak cocok. Perlu opsi seperti `potong: "depan"`, lalu knob steps min 3. |
| sains-siklus-ayam, sains-anak-siapa-di-peternakan | langkah/item anak bebek (🐤) | aset atau bentuk anak bebek | Anak bebek kuning berparuh pipih, beda dari anak ayam 🐤/🐥. |
| sains-susun-tumbuhan-utuh, sains-perbaiki-tumbuhan-utuh, sains-rak-sayur-bagian-tumbuhan, sains-lapak-panen-bagian-tumbuhan, sains-bagian-tumbuhan-di-taman, sains-mana-bagian-tumbuhan | bin/langkah akar (🫚 = jahe) | `shape: "akar"` (akar serabut cokelat) | Ganti serentak semua 🫚 yang berarti akar. Paket SD3 (sd3-sains-bagian-tumbuhan-bekerja, sd3-sains-rak-tugas-bagian-tumbuhan) juga memakainya. |
| sains-bekal-sehat-pasar | goods | barang pengecoh di mode dagang `ambil` (mis. `pengecoh: true`: tampil di lapak, tidak pernah dipesan, dan bila diambil membuat jawaban salah) | Tambah permen 🍬 dan lolipop 🍭 dengan `price` lebih murah dari buah, sesuai jebakan "permen paling murah" di TKB.MAKANAN-SEHAT.03. |
| sains-percobaan-bak-cuci-dapur, sains-hasil-percobaan-bak-air | seluruh paket | simulasi bak air (TKA.APUNG-TENGGELAM-MAGNET.01) | Bila simulasi ada, label "yang tadi terapung/tenggelam" bisa dikembalikan ke nama benda saja karena hasilnya terlihat langsung. |

## Tidak dikerjakan
| butir | alasan |
|---|---|
| sains-bekal-sehat-pasar: tambah jajanan pengecoh | Mustahil tanpa fitur mesin. Di mode `ambil`, semua barang di `goods` bisa dipesan, jadi permen akan muncul sebagai pesanan. Paket juga tidak dipindah ke MAT karena bukti SAINS.TKB.MAKANAN-SEHAT.03 sudah ada di sains-murah-belum-tentu-sehat, dan fiturnya dicatat di atas. |
| Emoji akar 🫚, anak bebek 🐤 | Butuh aset atau bentuk baru, dicatat di Butuh fitur baru. Tidak ada emoji atau bentuk yang ada yang lebih tepat: `berudu`, `rect`, dan `triangle` tidak terbaca sebagai akar. |
