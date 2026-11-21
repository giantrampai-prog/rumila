# Log 07 — SAINS SD4 + SD5 (68 paket ditinjau: 34 SD4, 34 SD5)

Ringkas: 34 temuan · 32 diperbaiki (27 berkas paket, versi patch dinaikkan) · 0 keputusan owner tersisa · 2 ditolak · 36 kalimat suara berubah.
Putaran 2 (keputusan koordinator soal knob steps): lihat bagian "Keputusan koordinator — potong tengah" di bawah.
Validasi: `npx tsx packages/schema/src/cli.ts` → 810 paket valid; `npm run akademi:audit` → ERROR 0, tak ada WARNING untuk paket sd4-sains-*/sd5-sains-*. Putaran 2: 810 paket valid; audit ERROR 0, WARNING 0. Putaran 3: 810 paket valid; audit ERROR 0, WARNING 0.
Kurikulum SAINS-SD4.json / SAINS-SD5.json tidak diubah.

## Temuan
| jenis (1–6) | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| 2/6 | sd4-sains-peta-tulang-tubuh | b-badan | Label rak "badan (dada sampai pinggang)" padahal tulang panggul (kunci: badan) letaknya di bawah pinggang → anak yang membaca label akan menaruhnya di "lengan dan kaki". | diperbaiki: "badan (dada sampai pinggul)" |
| 2/6 | sd4-sains-tulang-di-tempatnya | b-badan | Sama: panggul → badan, tetapi label berhenti di pinggang. | diperbaiki: "badan (dada sampai pinggul)" |
| 3 | sd4-sains-otot-tarik-ulur | instruksi | "Tunjuk … atau katakan apa yang terjadi" — mekanik pilih (sentuh), tidak ada yang dikatakan; ronde "Lengan sedang… ditekuk/diluruskan" tidak tercakup. | diperbaiki: sentuh jawaban: otot yang mengerut, keadaan pasangannya, atau gerak lengannya |
| 6 | sd4-sains-hewan-pantai-rangka | judul | Judul "…Cangkang…" padahal rak berlabel "rangka luar keras" dan isinya kupu-kupu, lebah, belalang (tidak bercangkang). | diperbaiki: "Tulang Belakang, Rangka Luar, atau Lunak?" |
| 3 | sd4-sains-rantai-makanan-perbaiki | instruksi | Hanya "tukar keduanya sekali saja" — tidak menyebut arah urutan yang benar. | diperbaiki: urut lagi mulai dari produsen, lalu pemakannya, dst. |
| 2 | sd4-sains-lebur-dan-beku-pabrik | lem-b | "batang lem dimasukkan" lalu "alat lem menjadi panas" — alat bisa dipanaskan dulu baru lem dimasukkan; dua susunan masuk akal. | diperbaiki: lem-b "batang lem dipanaskan di dalam alat" (harus sesudah dimasukkan) |
| 3 | sd4-sains-perubahan-di-rumah | instruksi | Hanya pertanyaan, tidak menyebut aksi (taruh/pilah). | diperbaiki: "…lalu taruh tiap kartu: …" |
| 3 | sd4-sains-rangkaian-di-rumah | instruksi | "Perkirakan …" tanpa aksi menaruh ke rak. | diperbaiki: "+ lalu taruh ke rak yang cocok" |
| 3 | sd4-sains-baterai-dan-lampu-seri | instruksi | "tebak" tanpa aksi sentuh. | diperbaiki: "sentuh perkiraanmu" |
| 3 | sd4-sains-terang-atau-redup | instruksi | "tebak apa yang terjadi" tanpa aksi sentuh. | diperbaiki: "sentuh perkiraanmu tentang lampunya" |
| 3 | sd4-sains-cahaya-di-kota | instruksi | Hanya pertanyaan "Benda mana…", tanpa aksi. | diperbaiki: "Taruh tiap benda: …?" |
| 3/6 | sd4-sains-putaran-bumi-pantai | instruksi | "jelaskan dengan Bumi yang berputar" — anak tidak menjelaskan, ia menyentuh; banyak ronde (arah bayangan, pagi/sore) bukan penjelasan. | diperbaiki: "sentuh jawaban yang benar. Ingat, yang berputar adalah Bumi." |
| 6 | sd4-sains-uji-adil | instruksi | "sentuh jawaban yang membuat ujinya adil" — ronde "Apa yang diukur?" jawabannya tidak membuat uji adil. | diperbaiki: "sentuh jawaban yang tepat agar ujinya adil" |
| 4 | sd4-sains-uji-adil | p-r2, p-r4, p-r6 | "Uji jenis tanah tadi / pantulan bola tadi / es tadi" — ronde diacak, soal pembukanya belum tentu muncul sebelumnya. | diperbaiki: tiap soal menyebut ulang pertanyaan penyelidikannya |
| 4 | sd4-sains-uji-adil-rumah | p-pesawat-sama/ukur/sama2, p-kain-sama/ukur | "Uji pesawat kertas tadi", "Uji kain penyerap tadi" — rujukan "tadi" pada soal yang belum tentu muncul. | diperbaiki: "Uji pesawat kertas bersayap lebar dan sempit: …", "Uji mencari kain yang paling banyak menyerap air: …" |
| 4 | sd5-sains-tamu-bunga-taman | p-r3, p-r5, p-r11 | "bagian ini", "bagian lengket ini", "bagian di pangkal putik ini" — tak ada gambar yang ditunjuk. | diperbaiki: "satu bagian bunga. Bagian itu adalah…", "bagian bunga yang lengket, yaitu…", "Bagian itu adalah…" |
| 6 | sd5-sains-siklus-tumbuhan-berbunga | instruksi | "dari biji sampai biji baru" padahal knob steps (bawaan 5, dipotong dari depan) berhenti di penyerbukan; biji baru baru tampil di 6–7. | diperbaiki: "Susun … sesuai urutannya, mulai dari biji." (soal knob → keputusan owner) |
| 6 | sd5-sains-siklus-tumbuhan-perbaiki | instruksi | Sama: "supaya urut dari biji sampai biji baru" tidak benar untuk ronde 4–5 tahap. | diperbaiki: "supaya urut sesuai tahap hidupnya, mulai dari biji" |
| 3 | sd5-sains-biji-mana-berkecambah | instruksi | "tebak apa yang terjadi" — tanpa aksi; separuh ronde menanyakan "Apa yang kurang/perlu diubah?". | diperbaiki: "sentuh jawabanmu tentang kecambahnya" |
| 4 | sd5-sains-biji-mana-berkecambah | p-r3 | "kapasnya basah dan hangat" — yang hangat lemarinya; kalimat janggal. | diperbaiki: "kapasnya basah dan lemarinya hangat" |
| 3 | sd5-sains-jalan-makanan-perbaiki | instruksi | Hanya "tukar keduanya sekali saja", tanpa acuan urutan. | diperbaiki: "supaya urut sesuai jalan yang dilewati makanan" |
| 2 | sd5-sains-pemangsa-atau-mangsa | i-kawanan | "berkumpul dalam kawanan besar" (kunci: mangsa) — singa/serigala juga berburu berkawanan; dua rak masuk akal. | diperbaiki: "…kawanan besar agar ada yang berjaga" |
| 6 | sd5-sains-siklus-air-perbaiki | instruksi | Menjanjikan empat tahap "…lalu air mengalir kembali", padahal knob steps bawaan 4 memotong tahap terakhir; beberapa cerita tak punya tahap mengalir. | diperbaiki: "Tukar keduanya supaya urut lagi. Ingat: air menguap dulu, lalu mengembun, baru turun sebagai hujan." |
| 6 | sd5-sains-siklus-air | s-laut (judul urutan) | "Dari laut kembali ke laut" — pada steps 4 (bawaan) langkah "mengalir ke laut" terpotong. | diperbaiki: "Air laut menjadi hujan" |
| 6 | sd5-sains-nama-gaya | instruksi | "sentuh gaya yang paling berperan" — ronde "Gaya apa saja yang bekerja?" (dua gaya) dan "gesekannya jadi… lebih besar" bukan memilih satu gaya. | diperbaiki: "sentuh jawaban yang tepat tentang gaya yang bekerja" |
| 3 | sd5-sains-bunyi-alat-musik-kelas | instruksi | "Tebak bunyinya jadi bagaimana." tanpa aksi. | diperbaiki: "Sentuh perkiraanmu: bunyinya jadi bagaimana?" |
| 6 | sd5-sains-tinggi-nyaring-bunyi | instruksi | "sentuh perubahan yang akan terdengar" — ronde "Semua bunyi dibuat oleh…", "karena…", "Getaran… jadi…" bukan perubahan bunyi. | diperbaiki: "sentuh jawaban yang tepat" |
| 4 | sd5-sains-tinggi-nyaring-bunyi | p-r4 | "Senar yang lebih tebal dan lebih panjang dipetik. Bunyinya jadi…" — tak ada pembanding. | diperbaiki: "Dibanding senar yang tipis dan pendek, senar yang lebih tebal dan lebih panjang bunyinya…" |
| 6 | sd5-sains-siklus-tumbuhan-berbunga / -perbaiki | knobs.steps | Bawaan 5 + potong dari depan → anak tidak pernah melihat "biji baru" pada setelan bawaan, padahal kompetensi menekankan siklus ditutup biji baru. | diperbaiki (putaran 2): `potong: "tengah"`; instruksi dikembalikan ke "dari biji sampai biji baru" |
| 6 | sd5-sains-siklus-air / -perbaiki | knobs.steps | Bawaan 4 + potong dari depan → tahap "air mengalir kembali" (bagian kompetensi) terpotong pada cerita 5 tahap. | diperbaiki (putaran 3): bawaan knobs.steps 4 → 5 di kedua paket |
| 6 | sd4-sains-lebur-dan-beku-pabrik / sd4-sains-mencair-dan-membeku | knobs.steps = 3 | Langkah terakhir terpotong → judul urutan seperti "Cokelat meleleh lalu mengeras", "Mentega meleleh lalu mengeras", "Pecahan kaca dibuat jadi botol", "Membuat cincin emas" tidak cocok isinya. Bawaan 4 aman. | diperbaiki (putaran 2): `potong: "tengah"` |
| 6 | sd4-sains-rantai-makanan-susun / -perbaiki | knobs.steps = 3 | Rantai dipotong dari depan (padi → tikus → ular), padahal instruksi/judul "sampai pemakan puncak". Bawaan 4 aman. | diperbaiki (putaran 3): tetap potong akhir; judul dan instruksi susun tidak lagi menjanjikan "pemakan puncak" |
| 5 | sd5-sains-tumbuhan-bukit-berbunga | instruksi/konteks | "Kamu mendaki bukit" tetapi kartu berisi teratai, tomat, terong — konteks janggal, tetapi tidak mengubah jawaban. | ditolak (tidak ambigu untuk jawaban) |
| 2 | sd5-sains-pemangsa-atau-mangsa | i-telinga | "telinga besar yang bisa diputar" (mangsa) — sebagian pemangsa (karakal, rubah fenek) juga; tetapi ciri ini lazim diajarkan sebagai ciri mangsa dan kartu lain tidak bertabrakan. | ditolak (dicatat; boleh dipertegas "untuk mendengar pemangsa datang" bila owner mau) |

## Kalimat suara berubah
| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd4-sains-baterai-dan-lampu-seri | instruksi | Semua rangkaian ini seri (berderet). Dengarkan perubahannya, lalu tebak lampunya jadi lebih terang, lebih redup, atau padam. | Semua rangkaian ini seri (berderet). Dengarkan perubahannya, lalu sentuh perkiraanmu: lampunya jadi lebih terang, lebih redup, atau padam. |
| sd4-sains-cahaya-di-kota | instruksi | Benda mana yang membuat cahaya sendiri, dan mana yang terlihat karena memantulkan cahaya? Ingat Bulan dan cermin! | Taruh tiap benda: membuat cahaya sendiri, atau terlihat karena memantulkan cahaya? Ingat Bulan dan cermin! |
| sd4-sains-hewan-pantai-rangka | judul | Tulang Belakang, Cangkang, atau Lunak? | Tulang Belakang, Rangka Luar, atau Lunak? |
| sd4-sains-otot-tarik-ulur | instruksi | Dengarkan gerakannya. Tunjuk otot yang mengerut, atau katakan apa yang terjadi pada pasangannya. | Dengarkan gerakannya, lalu sentuh jawabannya: otot yang mengerut, keadaan otot pasangannya, atau gerak lengannya. |
| sd4-sains-perubahan-di-rumah | instruksi | Amati perubahan di rumah. Apakah zatnya hanya berubah wujud, atau terbentuk zat baru lewat reaksi kimia? | Amati perubahan di rumah, lalu taruh tiap kartu: zatnya hanya berubah wujud, atau terbentuk zat baru lewat reaksi kimia? |
| sd4-sains-peta-tulang-tubuh | b-badan | badan (dada sampai pinggang) | badan (dada sampai pinggul) |
| sd4-sains-putaran-bumi-pantai | instruksi | Seharian di pantai. Dengarkan kejadiannya, lalu jelaskan dengan Bumi yang berputar. | Seharian di pantai. Dengarkan kejadiannya, lalu sentuh jawaban yang benar. Ingat, yang berputar adalah Bumi. |
| sd4-sains-rangkaian-di-rumah | instruksi | Baca keadaan rangkaian tiap alat. Perkirakan lampunya menyala atau tidak. | Baca keadaan rangkaian tiap alat. Perkirakan lampunya menyala atau tidak, lalu taruh ke rak yang cocok. |
| sd4-sains-terang-atau-redup | instruksi | Baca perubahan rangkaiannya, lalu tebak apa yang terjadi pada lampu. | Baca perubahan rangkaiannya, lalu sentuh perkiraanmu tentang lampunya. |
| sd4-sains-tulang-di-tempatnya | b-badan | badan (dada sampai pinggang) | badan (dada sampai pinggul) |
| sd4-sains-uji-adil-rumah | p-pesawat-sama | Uji pesawat kertas tadi: apa yang harus dibuat sama? | Uji pesawat kertas bersayap lebar dan sempit: apa yang harus dibuat sama? |
| sd4-sains-uji-adil-rumah | p-pesawat-ukur | Uji pesawat kertas tadi: apa yang diukur? | Uji pesawat kertas bersayap lebar dan sempit: apa yang diukur? |
| sd4-sains-uji-adil-rumah | p-pesawat-sama2 | Uji pesawat kertas tadi: selain jenis kertas, apa lagi yang harus sama? | Uji pesawat kertas bersayap lebar dan sempit: selain jenis kertas, apa lagi yang harus sama? |
| sd4-sains-uji-adil-rumah | p-kain-sama | Uji kain penyerap tadi: apa yang harus dibuat sama? | Uji mencari kain yang paling banyak menyerap air: apa yang harus dibuat sama? |
| sd4-sains-uji-adil-rumah | p-kain-ukur | Uji kain penyerap tadi: apa yang diukur? | Uji mencari kain yang paling banyak menyerap air: apa yang diukur? |
| sd4-sains-uji-adil | instruksi | Baca pertanyaan penyelidikannya, lalu sentuh jawaban yang membuat ujinya adil. | Baca pertanyaan penyelidikannya, lalu sentuh jawaban yang tepat agar ujinya adil. |
| sd4-sains-uji-adil | p-r2 | Uji jenis tanah tadi: apa yang harus dibuat sama untuk semua pot? | Apakah jenis tanah memengaruhi tinggi tanaman kacang? Apa yang harus dibuat sama untuk semua pot? |
| sd4-sains-uji-adil | p-r4 | Uji pantulan bola tadi: apa yang harus dibuat sama? | Apakah bola memantul lebih tinggi di lantai keramik atau di karpet? Apa yang harus dibuat sama? |
| sd4-sains-uji-adil | p-r6 | Uji es tadi: apa yang harus dibuat sama? | Apakah es lebih cepat mencair di tempat terang atau teduh? Apa yang harus dibuat sama? |
| sd5-sains-biji-mana-berkecambah | instruksi | Baca keadaan bijinya, lalu tebak apa yang terjadi setelah beberapa hari. | Baca keadaan bijinya, lalu sentuh jawabanmu tentang kecambahnya. |
| sd5-sains-biji-mana-berkecambah | p-r3 | Biji di lemari gelap, tetapi kapasnya basah dan hangat. Apa yang terjadi? | Biji di lemari gelap, tetapi kapasnya basah dan lemarinya hangat. Apa yang terjadi? |
| sd5-sains-bunyi-alat-musik-kelas | instruksi | Alat musik di kelas diubah sedikit. Tebak bunyinya jadi bagaimana. | Alat musik di kelas diubah sedikit. Sentuh perkiraanmu: bunyinya jadi bagaimana? |
| sd5-sains-nama-gaya | instruksi | Baca kejadiannya, lalu sentuh gaya yang paling berperan. | Baca kejadiannya, lalu sentuh jawaban yang tepat tentang gaya yang bekerja. |
| sd5-sains-pemangsa-atau-mangsa | i-kawanan | berkumpul dalam kawanan besar | berkumpul dalam kawanan besar agar ada yang berjaga |
| sd5-sains-tamu-bunga-taman | p-r3 | Kaki lebah jadi kuning penuh serbuk setelah menyentuh bagian ini. | Kaki lebah jadi kuning penuh serbuk setelah menyentuh satu bagian bunga. Bagian itu adalah… |
| sd5-sains-tamu-bunga-taman | p-r5 | Kupu-kupu membawa serbuk kuning dari bunga lain. Serbuk itu menempel di bagian lengket ini. | Kupu-kupu membawa serbuk kuning dari bunga lain. Serbuk itu menempel di bagian bunga yang lengket, yaitu… |
| sd5-sains-tamu-bunga-taman | p-r11 | Sesudah serbuk sampai di kepala putik, bagian di pangkal putik ini membesar menjadi buah. | Sesudah serbuk sampai di kepala putik, bagian di pangkal putik membesar menjadi buah. Bagian itu adalah… |
| sd5-sains-tinggi-nyaring-bunyi | instruksi | Bayangkan bunyinya, lalu sentuh perubahan yang akan terdengar. | Bayangkan bunyinya, lalu sentuh jawaban yang tepat. |
| sd5-sains-tinggi-nyaring-bunyi | p-r4 | Senar yang lebih tebal dan lebih panjang dipetik. Bunyinya jadi… | Dibanding senar yang tipis dan pendek, senar yang lebih tebal dan lebih panjang bunyinya… |
| sd4-sains-lebur-dan-beku-pabrik | lem-b | alat lem menjadi panas | batang lem dipanaskan di dalam alat |
| sd4-sains-rantai-makanan-perbaiki | instruksi | Dua mata rantai tertukar tempat: tukar keduanya sekali saja. | Dua mata rantai tertukar tempat. Tukar keduanya sekali supaya urut lagi: mulai dari produsen, lalu pemakannya, dan seterusnya. |
| sd4-sains-rantai-makanan-susun | judul | Rantai Makanan sampai Pemakan Puncak | Siapa Dimakan Siapa? |
| sd4-sains-rantai-makanan-susun | instruksi | Susun rantai makanan dari produsen sampai pemakan puncak. | Susun rantai makanan: mulai dari produsen, lalu yang memakannya, dan seterusnya. |
| sd5-sains-jalan-makanan-perbaiki | instruksi | Dua organ tertukar tempat: tukar keduanya sekali saja. | Dua organ tertukar tempat. Tukar keduanya sekali supaya urut sesuai jalan yang dilewati makanan. |
| sd5-sains-siklus-air-perbaiki | instruksi | Dua tahap siklus air tertukar tempat. Tukar keduanya: penguapan, pengembunan, hujan, lalu air mengalir kembali. | Dua tahap siklus air tertukar tempat. Tukar keduanya supaya urut lagi. Ingat: air menguap dulu, lalu mengembun, baru turun sebagai hujan. |
| sd5-sains-siklus-air | s-laut | Dari laut kembali ke laut | Air laut menjadi hujan |

(Instruksi sd5-sains-siklus-tumbuhan-berbunga dan -perbaiki sempat diubah di putaran 1, lalu dikembalikan persis ke teks HEAD di putaran 2, jadi tidak ada kalimat suara yang berubah di sana.)

## Butuh keputusan owner
Tidak ada lagi. Keempat butir knob steps sudah diputuskan koordinator (putaran 2 dan 3).

## Keputusan koordinator — potong tengah (putaran 2)
Dicek dengan menjalankan `potongTengah` (packages/mechanics/src/urutkan.ts) pada tiap urutan untuk setiap nilai knob di bawah maksimum.

| paket | hasil | tindakan |
|---|---|---|
| sd5-sains-siklus-tumbuhan-berbunga (1.1.3), sd5-sains-siklus-tumbuhan-perbaiki (1.0.3) | Setiap ronde mulai dari biji dan berakhir di biji baru. steps 5 (bawaan) masih memuat penyerbukan; steps 4 = biji, kecambah, satu tahap tengah, biji baru (versi bantuan). Pada mode perbaiki tukaran tetap jelas salah, karena tiap tahap punya urutan logis yang tegas. | `"potong": "tengah"` dipasang; keterangan knob diperbarui; instruksi dikembalikan ke "dari biji sampai biji baru" (teks HEAD) |
| sd4-sains-lebur-dan-beku-pabrik (1.0.3), sd4-sains-mencair-dan-membeku (1.1.1) | Pada steps 3 urutan tetap logis dan judul cocok (mis. "Cokelat meleleh lalu mengeras": padat → meleleh → mengeras lagi). | `"potong": "tengah"` dipasang; keterangan knob diperbarui |
| sd5-sains-siklus-air, sd5-sains-siklus-air-perbaiki | Pada steps 4 (bawaan), memotong di tengah membuang tahap pengembunan/awan di hampir semua cerita 5 tahap (mis. "air danau menguap → hujan turun", "air kolam menguap → hujan turun"; "Embun di daun" kehilangan tahap embun terbentuk). Pengembunan adalah inti kompetensi, dan "hujan sebelum awan" adalah jebakan yang dinilai. | TIDAK diterapkan. Usul: naikkan bawaan steps ke 5, atau biarkan potong akhir (judul dan instruksi sudah dibuat benar di putaran 1). |
| sd4-sains-rantai-makanan-susun, sd4-sains-rantai-makanan-perbaiki | Pada steps 3, memotong di tengah menghasilkan rantai yang salah secara sains: "padi → ular → elang", "daun sawi → burung pipit → kucing", "biji pohon → ular pohon → elang", "rumput laut → cumi-cumi → lumba-lumba". Rantai makanan harus bersambung (siapa makan siapa). | TIDAK diterapkan. Potong akhir tetap menghasilkan rantai yang sah (padi → tikus → ular); pemakan terakhir yang tampil adalah puncak rantai yang ditampilkan. Usul: biarkan, atau naikkan min steps ke 4. |

## Putaran 3 — keputusan koordinator
| paket | tindakan |
|---|---|
| sd5-sains-siklus-air (1.2.2), sd5-sains-siklus-air-perbaiki (1.0.1) | knobs.steps.default 4 → 5 (potong akhir tetap). Cerita 5 tahap kini tampil utuh pada setelan bawaan, termasuk "air mengalir kembali". Bawaan 5 hanya memakai cerita 5 tahap (susun 7 cerita, perbaiki 6); audit soal berulang tetap 0 ERROR, jadi tidak perlu menambah cerita. Versi sudah dinaikkan di putaran 1, tidak dinaikkan lagi. |
| sd4-sains-rantai-makanan-susun (1.2.2) | Tetap potong akhir. Judul "Rantai Makanan sampai Pemakan Puncak" → "Siapa Dimakan Siapa?"; EN "Food Chain: Who Eats What?" ("Who Eats Whom?" bentrok judul-kembar dengan sd3-sains-susun-rantai-makanan). Instruksi → "Susun rantai makanan: mulai dari produsen, lalu yang memakannya, dan seterusnya." |
| sd4-sains-rantai-makanan-perbaiki (1.1.2) | Tetap potong akhir. Instruksi putaran 1 ("mulai dari produsen, lalu pemakannya, dan seterusnya") sudah tidak menyebut "puncak"; judul "Rantai yang Tertukar" aman. Tidak ada perubahan baru. |
