# Log 02 — MAT SD1 + SD2 (audit soal ambigu)

Cakupan: semua 34 paket MAT.SD1 + 42 paket MAT.SD2 (76 paket, 38 kompetensi) diperiksa di JSON asli. 33 paket diubah (versi naik patch). Berkas kurikulum tidak diubah.
Pemeriksaan: `npx tsx packages/schema/src/cli.ts` → 810 paket valid; `akademi:audit` → ERROR 0, WARNING 0 (tidak ada temuan untuk paket sd1-mat/sd2-mat).

Catatan penting (temuan sistemik): presenter `KartuBenda` (src/components/akademi/benda.tsx) di mode pilah (kelompok & pilih) dan urutkan (susun & perbaiki) TIDAK menampilkan label item; teks label hanya tampil bila item tidak punya emoji/bentuk. Jadi kartu angka yang diberi emoji hiasan (🧁 15, 🚃 14, 🏠 34, ⚙️ 76 …) tampil sebagai gambar yang sama tanpa angka — pilihan tidak bisa dibedakan. Diperbaiki di konten dengan membuang emoji hiasan (kartu tampil sebagai teks). Kemungkinan besar pola yang sama ada di kelompok lain.

## Temuan
| jenis (1–6) | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| 2 | sd1-mat-dobel-etalase-kue | items n6–n20 (🧁) | 14 kartu jawaban angka berupa 🧁 tanpa angka terlihat → tiga pilihan tampak sama | diperbaiki: emoji dibuang, kartu tampil angka |
| 2 | sd1-mat-gerbong-urut-0-20 | sequences (🚃) | semua gerbong tampil 🚃 yang sama, nomornya tidak terlihat → tidak bisa diurutkan | diperbaiki: emoji dibuang (70 langkah) |
| 2 | sd2-mat-kardus-puluhan-gudang | items (📦) | pilihan bilangan tampil 📦 sama tanpa angka | diperbaiki: emoji dibuang |
| 2 | sd2-mat-mesin-hitung-pabrik | items (⚙️) | pilihan hasil tampil ⚙️ sama tanpa angka | diperbaiki: emoji dibuang |
| 2 | sd2-mat-bagi-tangkapan-laut | items (🐟) | pilihan hasil bagi tampil 🐟 satu ekor tanpa angka | diperbaiki: emoji dibuang |
| 2 | sd2-mat-bukit-pembulatan | items (⛰️) | pilihan puluhan tampil ⛰️ sama tanpa angka | diperbaiki: emoji dibuang |
| 2 | sd2-mat-jam-dinding-kelas | items (🕰️) | pilihan "35 menit"/"angka 7" tampil 🕰️ sama tanpa teks | diperbaiki: emoji dibuang |
| 2 | sd2-mat-nomor-rumah-urut | sequences (🏠) | semua rumah tampil 🏠 tanpa nomor | diperbaiki: emoji dibuang (60 langkah) |
| 2 | sd2-mat-petak-pecahan-tertukar | sequences (🟩) | semua kartu pecahan tampil 🟩 tanpa ¼/½/¾ | diperbaiki: emoji dibuang (48 langkah) |
| 2 | sd2-mat-carroll-lantai-menara | items (🏢) | nomor lantai tidak terlihat, semua 🏢 sama | diperbaiki: emoji dibuang |
| 4 | sd2-mat-satuan-waktu-tertukar | sequences | kartu hanya emoji (⏱️ detik, ⏳ menit, 🕐 jam, 🌙 bulan …) tanpa teks → anak menebak arti emoji; ⏱️ vs ⏳ kabur | diperbaiki: emoji dibuang, kartu tampil kata satuan |
| 3 | sd1-mat-jalan-loncat-katak | instruksi | bertanya "Batu mana yang diinjaknya?" tanpa perintah memilah ke rak | diperbaiki |
| 3 | sd2-mat-jalan-loncat-lima | instruksi | sama seperti di atas | diperbaiki |
| 6 | sd1-mat-rak-puluhan-satuan | instruksi | "Satu puluhan ditambah satuan" bertentangan dengan kartu 10+10, "2 puluhan", "dua puluh" (rak 20) | diperbaiki: "Puluhan ditambah satuan jadi bilangan berapa? …" |
| 3 | sd1-mat-genap-ganjil-20 | instruksi | "Pilah tiap kartu" tanpa menyebut rak | diperbaiki: "Taruh tiap kartu di rak genap atau ganjil." |
| 3 | sd1-mat-pasangan-ternak-20 | instruksi | "Pasangkan hewan dua-dua" padahal mekanik menyeret kelompok ke rak (anak tidak bisa memasangkan); tidak ada perintah ke rak | diperbaiki: "Bayangkan … Taruh tiap kelompok di raknya." |
| 4 | sd1-mat-rak-kurang-berapa-sepuluh | instruksi | "Tiap kotak … Taruh kotak" — tidak ada kotak; item berupa kartu titik/angka | diperbaiki: "Supaya jadi 10, kurang berapa lagi? Taruh tiap kartu …" |
| 4 | sd2-mat-rak-kurang-berapa-seratus | instruksi | "Tiap celengan harus berisi seratus" — tidak ada celengan di layar | diperbaiki: "Supaya jadi 100, kurang berapa lagi? …" |
| 6 | sd1-mat-pilah-sisi-bangun | b-sisi-lengkung | rak "sisi lengkung" sementara irisan pizza/bulan sabit juga punya sisi lurus | diperbaiki: "ada sisi lengkung" (sejalan paket kota) |
| 5 | sd1-mat-belanja-ringan-berat | judul, instruksi | "belanjaan … mudah diangkat" padahal ada sapi & kambing | diperbaiki: "Timbang Barang di Pasar"; "Bayangkan menimbang tiap barang di pasar …" |
| 2 | sd1-mat-urut-ringan-berat | berat-3, berat-4 | semangka vs sepeda beratnya bisa mirip (semangka besar ±8–10 kg) | diperbaiki: sepeda diganti motor di dua urutan itu |
| 4 | sd1-mat-wadah-halaman-isi | judul | "Siapa Muat Paling Banyak?" — "siapa" untuk benda | diperbaiki: "Mana yang Muat Paling Banyak?" |
| 4 | sd1-mat-jam-setengah-pagi | i-06t00 … i-09t30 | kartu digital "06.30" bernol depan, bertentangan dengan catatan kompetensi (tanpa nol depan; format 24 jam belum diajarkan) dan paket kembarannya ("3.30") | diperbaiki: "6.00", "6.30" … "9.30" |
| 2/5 | sd1-mat-carroll-kuning-bulat | item jeruk 🍊 | jeruk di rak "bukan kuning" — jeruk lazim disebut/berwarna kuning di Indonesia | diperbaiki: diganti tomat 🍅 (id/labelKey i-tomat) |
| 4 | sd1-mat-carroll-kuning-bulat | instruksi | "Benda ini …" rujukan kabur, tanpa kata kerja | diperbaiki: "Tiap benda: … Taruh di kotak …" |
| 6 | sd1-mat-carroll-merah-bulat | b-lain-bulat, b-lain-bersudut, instruksi | label rak "lain · bulat" tidak jelas (lain apa?) | diperbaiki: "bukan merah · bulat/bersudut"; instruksi "merah atau bukan" |
| 6 | sd1-mat-sisa-kelereng-20 | instruksi, g-kelereng | anak menaruh kelereng kuning (penanda) tapi instruksi hanya bilang "kelereng"; benda = kelereng biru | diperbaiki: "kelereng biru" / "Taruh kelereng kuning sebanyak kelereng biru yang masih tersisa." |
| 3 | sd2-mat-bukit-pembulatan | instruksi | tidak ada perintah memilih | diperbaiki: "+ Sentuh puluhan yang benar." |
| 3 | sd2-mat-bulatkan-puluhan | instruksi | tidak ada perintah menaruh; "pulang ke atas" kabur | diperbaiki: "… ke puluhan di atasnya. Taruh tiap kartu di rak puluhannya." |
| 3 | sd2-mat-jam-dinding-kelas | instruksi | tidak ada perintah memilih | diperbaiki: "Sentuh jawaban yang benar." |
| 3 | sd2-mat-huruf-pasir-simetri | instruksi | "Tarik garis" (anak tidak bisa menggambar) dan tanpa perintah memilih | diperbaiki: "Bayangkan garis … Sentuh huruf yang diminta." |
| 3 | sd2-mat-huruf-simetris | instruksi | tanpa perintah menaruh (WARNING audit) | diperbaiki: "… Taruh tiap huruf di raknya." |
| 4 | sd2-mat-carroll-genap-lima-puluh | 4 label rak | simbol "<" dan "≥" belum dikenalkan di SD2 (kompetensi: "kurang dari 50 atau tidak") | diperbaiki: "genap, kurang dari 50" / "genap, 50 atau lebih" dst. |
| 4 | sd2-mat-carroll-lantai-menara | 4 label rak, instruksi | sama; plus "Nomor lantai ini" rujukan kabur | diperbaiki: label kata; "Tiap nomor lantai: …" |
| 3 | sd1-mat-genap-sepuluh-koin | instruksi | "tambahkan kekurangannya" tanpa kata kerja tindakan (WARNING audit) | diperbaiki: "taruh koin yang masih kurang" |
| 3 | sd2-mat-genap-dua-puluh-koin | instruksi | sama | diperbaiki |
| 3 | sd2-mat-bayar-lima-puluh-ribu | instruksi | "Gabungkan" tidak dikenali sebagai tindakan (WARNING audit) | diperbaiki: "Ambil uang kertas dan koin …" |
| 5 | sd2-mat-larik-nampan-kue | items larik (count 6, 8, 10, 12, 15, 20) | mesin menggambar kelompok `count` dalam kisi ceil(√n) kolom: 8→3+3+2, 10→4+4+2, 15→4+4+4+3 (tidak berbentuk larik), 6→2 baris×3 padahal rak 3 × 2, 12→3×4 padahal rak 4 × 3, 20→4×5 padahal rak 5 × 4 → gambar bertentangan dengan rak dan konvensi "a baris, tiap baris b" di instruksi | keputusan owner (butuh kode) |
| — | sd2-mat-larik-kebun | items larik | aman hanya kebetulan (4, 6, 9, 12, 16, 20 tergambar sesuai rak) | dicatat, tidak diubah |
| — | (lainnya) | — | 43 paket lain diperiksa; tidak ada masalah kejelasan (mis. loncat-sepuluh, urutan bulan/hari, pola, segi banyak, dagang bayar/kembalian, gabung, penggaris) | ditolak/tidak perlu |

## Kalimat suara berubah
| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd1-mat-genap-sepuluh-koin | instruksi | Pembeli menunjukkan koinnya sebentar. Harganya sepuluh koin: tambahkan kekurangannya. | Pembeli menunjukkan koinnya sebentar. Harganya sepuluh koin: taruh koin yang masih kurang. |
| sd1-mat-sisa-kelereng-20 | g-kelereng | kelereng | kelereng biru |
| sd1-mat-sisa-kelereng-20 | instruksi | Beberapa kelereng diambil lalu kotak ditutup. Taruh kelereng sebanyak yang masih tersisa. | Beberapa kelereng biru diambil lalu kotak ditutup. Taruh kelereng kuning sebanyak kelereng biru yang masih tersisa. |
| sd2-mat-bayar-lima-puluh-ribu | instruksi | Baca harganya. Gabungkan uang kertas dan koin dari laci sampai jumlahnya pas. | Baca harganya. Ambil uang kertas dan koin dari laci sampai jumlahnya pas. |
| sd2-mat-genap-dua-puluh-koin | instruksi | Pembeli menunjukkan koinnya sebentar. Harganya dua puluh koin: tambahkan kekurangannya. | Pembeli menunjukkan koinnya sebentar. Harganya dua puluh koin: taruh koin yang masih kurang. |
| sd1-mat-carroll-kuning-bulat | i-jeruk | jeruk | (dihapus) |
| sd1-mat-carroll-kuning-bulat | i-tomat | (baru) | tomat |
| sd1-mat-carroll-kuning-bulat | instruksi | Benda ini kuning atau bukan? Bulat atau bersudut? Cari kotak yang cocok untuk dua-duanya. | Tiap benda: kuning atau bukan? Bulat atau bersudut? Taruh di kotak yang cocok untuk dua-duanya. |
| sd1-mat-carroll-merah-bulat | b-lain-bersudut | lain · bersudut | bukan merah · bersudut |
| sd1-mat-carroll-merah-bulat | b-lain-bulat | lain · bulat | bukan merah · bulat |
| sd1-mat-carroll-merah-bulat | instruksi | Lihat dua hal: merah atau warna lain, bulat atau bersudut. Taruh tiap benda di kotak yang cocok dua-duanya. | Lihat dua hal: merah atau bukan, bulat atau bersudut. Taruh tiap benda di kotak yang cocok dua-duanya. |
| sd1-mat-genap-ganjil-20 | instruksi | Genap kalau bisa dipasangkan dua-dua tanpa sisa. Pilah tiap kartu. | Genap kalau bisa dipasangkan dua-dua tanpa sisa. Taruh tiap kartu di rak genap atau ganjil. |
| sd1-mat-jalan-loncat-katak | instruksi | Katak mulai di 4 dan selalu loncat sepuluh. Batu mana yang diinjaknya? | Katak mulai di 4 dan selalu loncat sepuluh. Taruh tiap batu di rak: diinjak katak atau tidak diinjak. |
| sd1-mat-jam-setengah-pagi | i-06t00 | 06.00 | 6.00 |
| sd1-mat-jam-setengah-pagi | i-06t30 | 06.30 | 6.30 |
| sd1-mat-jam-setengah-pagi | i-07t00 | 07.00 | 7.00 |
| sd1-mat-jam-setengah-pagi | i-07t30 | 07.30 | 7.30 |
| sd1-mat-jam-setengah-pagi | i-08t00 | 08.00 | 8.00 |
| sd1-mat-jam-setengah-pagi | i-08t30 | 08.30 | 8.30 |
| sd1-mat-jam-setengah-pagi | i-09t00 | 09.00 | 9.00 |
| sd1-mat-jam-setengah-pagi | i-09t30 | 09.30 | 9.30 |
| sd1-mat-pasangan-ternak-20 | instruksi | Pasangkan hewan dua-dua. Kalau semua dapat pasangan, jumlahnya genap. Kalau ada satu yang sendirian, ganjil. | Bayangkan hewan dipasangkan dua-dua. Semua dapat pasangan berarti genap, ada satu sendirian berarti ganjil. Taruh tiap kelompok di raknya. |
| sd1-mat-pilah-sisi-bangun | b-sisi-lengkung | sisi lengkung | ada sisi lengkung |
| sd1-mat-rak-kurang-berapa-sepuluh | instruksi | Tiap kotak harus berisi sepuluh. Taruh kotak di rak 'kurang berapa'. | Supaya jadi 10, kurang berapa lagi? Taruh tiap kartu di rak 'kurang' yang benar. |
| sd1-mat-rak-puluhan-satuan | instruksi | Satu puluhan ditambah satuan: taruh tiap kartu di rak bilangannya. | Puluhan ditambah satuan jadi bilangan berapa? Taruh tiap kartu di rak bilangannya. |
| sd2-mat-bukit-pembulatan | instruksi | Bilangan seperti bola di lereng bukit: ia menggelinding ke puluhan yang paling dekat. Kalau satuannya 5, ia ke puluhan di atasnya. | Bilangan seperti bola di lereng bukit: menggelinding ke puluhan yang paling dekat. Kalau satuannya 5, ke puluhan di atasnya. Sentuh puluhan yang benar. |
| sd2-mat-bulatkan-puluhan | instruksi | Tiap bilangan pulang ke puluhan yang paling dekat. Kalau satuannya 5, pulang ke atas. | Tiap bilangan pulang ke puluhan yang paling dekat. Kalau satuannya 5, pulang ke puluhan di atasnya. Taruh tiap kartu di rak puluhannya. |
| sd2-mat-carroll-genap-lima-puluh | b-ganjil-50 | ganjil, ≥ 50 | ganjil, 50 atau lebih |
| sd2-mat-carroll-genap-lima-puluh | b-ganjil-kurang-50 | ganjil, < 50 | ganjil, kurang dari 50 |
| sd2-mat-carroll-genap-lima-puluh | b-genap-50 | genap, ≥ 50 | genap, 50 atau lebih |
| sd2-mat-carroll-genap-lima-puluh | b-genap-kurang-50 | genap, < 50 | genap, kurang dari 50 |
| sd2-mat-carroll-lantai-menara | b-ganjil-besar | ganjil, ≥ 50 | ganjil, 50 atau lebih |
| sd2-mat-carroll-lantai-menara | b-ganjil-kecil | ganjil, < 50 | ganjil, kurang dari 50 |
| sd2-mat-carroll-lantai-menara | b-genap-besar | genap, ≥ 50 | genap, 50 atau lebih |
| sd2-mat-carroll-lantai-menara | b-genap-kecil | genap, < 50 | genap, kurang dari 50 |
| sd2-mat-carroll-lantai-menara | instruksi | Nomor lantai ini genap atau ganjil? Di bawah lantai 50 atau tidak? Cari kotak yang cocok untuk dua-duanya. | Tiap nomor lantai: genap atau ganjil? Kurang dari 50 atau tidak? Taruh di kotak yang cocok untuk dua-duanya. |
| sd2-mat-huruf-pasir-simetri | instruksi | Tarik garis lurus di tengah huruf. Kalau dua belahnya sama seperti bayangan di cermin, huruf itu punya garis simetri. | Bayangkan garis lurus di tengah huruf. Kalau dua belahnya sama seperti bayangan di cermin, huruf itu punya garis simetri. Sentuh huruf yang diminta. |
| sd2-mat-huruf-simetris | instruksi | Bayangkan melipat huruf. Kalau kedua sisinya pas bertumpuk, huruf itu punya garis simetri. | Bayangkan melipat huruf. Kalau kedua sisinya pas bertumpuk, huruf itu simetris. Taruh tiap huruf di raknya. |
| sd2-mat-jalan-loncat-lima | instruksi | Katak mulai di 3 dan selalu loncat lima. Batu mana yang diinjaknya? | Katak mulai di 3 dan selalu loncat lima. Taruh tiap batu di rak: diinjak katak atau tidak diinjak. |
| sd2-mat-jam-dinding-kelas | instruksi | Jarum panjang menunjukkan menit. Loncat lima-lima dari angka 12: angka 1 = 5 menit, angka 2 = 10 menit, dan seterusnya. | Jarum panjang menunjukkan menit. Loncat lima-lima dari angka 12: angka 1 = 5 menit, angka 2 = 10 menit. Sentuh jawaban yang benar. |
| sd2-mat-rak-kurang-berapa-seratus | instruksi | Tiap celengan harus berisi seratus. Taruh di rak 'kurang berapa'. | Supaya jadi 100, kurang berapa lagi? Taruh tiap kartu di rak 'kurang' yang benar. |
| sd1-mat-belanja-ringan-berat | instruksi | Mana yang paling mudah diangkat? Susun belanjaan dari yang paling ringan sampai yang paling berat. | Bayangkan menimbang tiap barang di pasar. Susun dari yang paling ringan sampai yang paling berat. |
| sd1-mat-belanja-ringan-berat | judul | Timbang Belanjaan di Pasar | Timbang Barang di Pasar |
| sd1-mat-wadah-halaman-isi | judul | Siapa Muat Paling Banyak? | Mana yang Muat Paling Banyak? |

## Butuh keputusan owner
| paket/kompetensi | masalah | opsi |
|---|---|---|
| sd2-mat-larik-nampan-kue / MAT.SD2.KALI-BAGI.01 | larik digambar sebagai kisi ceil(√n) kolom, jadi 2×4, 2×5, 3×5 tampil tidak rapi dan 3×2, 4×3, 5×4 tampil tertukar baris/kolom; bertentangan dengan rak & instruksi | (a) tambah kolom/baris eksplisit di Visual (`cols`) dan Benda — perbaikan kode, paket tetap; (b) sementara buang kartu larik, sisakan kartu tambah berulang; (c) ganti rak ke larik yang tergambar benar (2×2, 2×3, 3×3, 3×4, 4×4, 4×5) — jadi hampir kembar dengan sd2-mat-larik-kebun |
| semua jenjang/pelajaran (presenter) | `KartuBenda` di pilah & urutkan tidak menampilkan label bila item punya emoji/bentuk; `angka` hanya digambar di atas bentuk, tidak di atas emoji. Kartu angka berhias emoji jadi tidak terbaca | (a) tampilkan label (atau `angka`) di bawah/di atas emoji pada kartu pilah/urutkan; (b) tetap pakai konten tanpa emoji (yang dilakukan di MAT SD1–2); (c) tambah aturan audit: item/langkah ber-emoji sama dengan label berbeda dalam satu paket/urutan = ERROR |
