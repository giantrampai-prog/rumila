# Perbaikan 08 — SAINS SD6 & KODE SD6

Validasi skema: 810 paket valid. `akademi:audit`: ERROR 0, tidak ada peringatan untuk paket sd6-sains/sd6-kode.

## Diterapkan

| keparahan | paket | apa yang diubah |
|---|---|---|
| SEDANG | urutkan/sd6-sains-terbentuknya-fosil-perbaiki (1.0.0 → 1.0.1) | Urutan "Fosil daun pakis": langkah `cetak` dipindah ke depan `batu`; teks cetak menjadi "daun hancur, cetakannya tertinggal di lumpur" (EN sepadan) |
| SEDANG | urutkan/sd6-sains-aliran-darah (1.1.0 → 1.1.1) | knobs.steps.default 4 → 5 (langkah vena ikut tampil) |
| SEDANG | urutkan/sd6-sains-jalan-udara (1.1.0 → 1.1.1) | knobs.steps.default 4 → 5 |
| SEDANG | urutkan/sd6-kode-minta-jawab-api (1.1.0 → 1.1.1) | knobs.steps.default 4 → 5 (langkah "aplikasi menampilkan…" ikut tampil) |
| SEDANG | pilah/sd6-sains-timbang-massa-berat (1.0.0 → 1.0.1) | n5/n50/n500 → 🔢; kurang50 🌙 → 🔽, tepat50 🎯 → ➖, lebih50 🪐 → 🔼 |
| SEDANG | pilah/sd6-sains-pantul-atau-bias (1.0.0 → 1.0.1) | periskop 🔭 → 🚢; "mengkilap" → "mengilap" (i-sendok) |
| SEDANG | pilah/sd6-sains-uji-tanah-halaman (1.0.0 → 1.0.1) | i-tidaklengket → "walau basah, tidak lengket di tangan"; "mengkilap" → "mengilap" (i-licin) |
| SEDANG | pilah/sd6-sains-jenis-tanah (1.0.0 → 1.0.1) | i-kompos → "ada remah daun lapuk yang masih terlihat" |
| SEDANG | pilah/sd6-sains-tanda-reaksi-dapur (1.0.0 → 1.0.1) | Item `roti` diganti item `pisang` (labelKey i-pisang, 🍌, bin warna) "irisan pisang lama-lama menjadi cokelat"; kunci i-roti dihapus |
| SEDANG | pilah/sd6-kode-fungsi-dapur (1.0.0 → 1.0.1) | q3: "Berapa irisan dibuat?" → "Berapa kali pisau mengiris?" (EN "How many cuts are made?") |
| SEDANG | urutkan/sd6-kode-kerja-tim-kode (1.1.0 → 1.1.1) | (temuan berjenis keputusan, tetapi aman) Kata penghubung pengunci urutan pada s2-2, s3-3, s5-3, s8-3, s9-5; s2-6 menjadi "kirim (push), lalu minta teman memeriksa" (EN sepadan) |
| KECIL | pilah/sd6-sains-racun-rantai-laut (1.0.0 → 1.0.1) | ikanbesar 🐋 → 🐟 |
| KECIL | pilah/sd6-sains-massa-dan-berat (1.1.0 → 1.1.1) | kurangkg 🎒 → 🔽; berat ⬇️ → 🏋️ |
| KECIL | pilah/sd6-sains-bentuk-dan-apung (1.1.0 → 1.1.1) | foilpadat 🪨 → shape circle, color #b0bec5, scale 0.6; perahukelereng 🔮 → 🛶 |
| KECIL | pilah/sd6-sains-bisa-kembali-semula (1.0.0 → 1.0.1) | instruksi tanpa "pesta ulang tahun"; embun 🥛 → 🧊; "yoghurt" → "yogurt" (ID & EN) |
| KECIL | pilah/sd6-sains-kuman-di-kelas (1.0.0 → 1.0.1) | botol 🍼 → 🥤 |
| KECIL | pilah/sd6-sains-jenis-batuan (1.0.0 → 1.0.1) | "mengkilap" → "mengilap" (i-obsidian) |
| KECIL | pilah/sd6-sains-batuan-tepi-sungai (1.0.0 → 1.0.1) | "mengkilap" → "mengilap" (i-filit) |
| KECIL | pilah/sd6-sains-data-janggal-kelas (1.0.0 → 1.0.1) | p-r13 tidak lagi merujuk ronde sebelumnya |
| KECIL | urutkan/sd6-sains-terbentuknya-fosil (1.2.0 → 1.2.1) | Urutan "Fosil gigi hiu": sisip langkah `tekan` 📚 "lapisan menumpuk dan menekan jadi batuan sedimen" sesudah `busuk` (kunci baru hiu-tekan) |
| KECIL | urutkan/sd6-sains-jalan-udara-perbaiki (1.0.0 → 1.0.1) | Urutan "Meniup gelembung sabun" langkah 5: 🫧 → 🧼 |
| KECIL | urutkan/sd6-sains-siklus-batuan-perbaiki (1.0.0 → 1.0.1) | Urutan "Gunung api bawah laut" langkah 4: 🔥 → ♨️ |
| KECIL | pilah/sd6-kode-dan-atau (1.0.0 → 1.0.1) | instruksi menambahkan penjelasan 'bukan' (ID & EN) |
| KECIL | pilah/sd6-kode-robot-industri (1.0.0 → 1.0.1) | q7: "…dengan ketepatan sepersekian milimeter" (ID & EN) |

Catatan: tepat50 diberi ➖ sesuai usul. Emoji yang sama juga dipakai item `tetap` di paket itu, tetapi keduanya tidak pernah muncul di ronde yang sama. perahukelereng 🛶 sama dengan perahuplastisin, tetapi keduanya juga tidak pernah muncul di ronde yang sama.

## Kalimat suara berubah (WAJIB lengkap)

| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| sd6-sains-terbentuknya-fosil-perbaiki | pakis-cetak | daun hancur, tetapi cetakannya tertinggal di batu | daun hancur, cetakannya tertinggal di lumpur |
| sd6-sains-terbentuknya-fosil | hiu-tekan | (baru) | lapisan menumpuk dan menekan jadi batuan sedimen |
| sd6-sains-pantul-atau-bias | i-sendok | wajah tampak terbalik di sendok mengkilap | wajah tampak terbalik di sendok mengilap |
| sd6-sains-uji-tanah-halaman | i-tidaklengket | tidak menempel di tangan saat kering | walau basah, tidak lengket di tangan |
| sd6-sains-uji-tanah-halaman | i-licin | permukaannya licin mengkilap saat digosok basah | permukaannya licin mengilap saat digosok basah |
| sd6-sains-jenis-tanah | i-kompos | makin subur setelah ditambah kompos | ada remah daun lapuk yang masih terlihat |
| sd6-sains-tanda-reaksi-dapur | i-roti | roti tawar dipanggang menjadi cokelat | (dihapus) |
| sd6-sains-tanda-reaksi-dapur | i-pisang | (baru) | irisan pisang lama-lama menjadi cokelat |
| sd6-sains-bisa-kembali-semula | instruksi | Di pesta ulang tahun banyak benda berubah. Pilah: bisa kembali seperti semula, atau tidak bisa. | Banyak benda di sekitar kita berubah. Pilah: bisa kembali seperti semula, atau tidak bisa. |
| sd6-sains-bisa-kembali-semula | i-yoghurt | susu berubah menjadi yoghurt | susu berubah menjadi yogurt |
| sd6-sains-jenis-batuan | i-obsidian | obsidian: hitam mengkilap seperti kaca | obsidian: hitam mengilap seperti kaca |
| sd6-sains-batuan-tepi-sungai | i-filit | batu mengkilap seperti kain satin, berasal dari batu sabak (filit) | batu mengilap seperti kain satin, berasal dari batu sabak (filit) |
| sd6-sains-data-janggal-kelas | p-r13 | Hasil kelereng tadi 2,1 detik, 2,0 detik, dan 2,2 detik. Perbedaan kecil seperti ini… | Lama kelereng menggelinding diukur: 2,1 detik, 2,0 detik, dan 2,2 detik. Perbedaan kecil seperti ini… |
| sd6-kode-fungsi-dapur | q3 | def iris(): iris tomat 4 kali. Program: ulangi 3 kali: iris(). Berapa irisan dibuat? | def iris(): iris tomat 4 kali. Program: ulangi 3 kali: iris(). Berapa kali pisau mengiris? |
| sd6-kode-dan-atau | instruksi | 'dan' butuh dua syarat benar, 'atau' cukup satu yang benar: pilih satu-satunya pilihan yang memenuhi syarat. | 'dan' butuh dua syarat benar, 'atau' cukup satu yang benar, 'bukan' membalik syarat: pilih satu-satunya pilihan yang memenuhi syarat. |
| sd6-kode-robot-industri | q7 | Robot memasang baut pada ponsel sampai ukuran sepersekian milimeter. Ini menunjukkan robot… | Robot memasang baut kecil pada ponsel dengan ketepatan sepersekian milimeter. Ini menunjukkan robot… |
| sd6-kode-kerja-tim-kode | s2-2 | ambil versi terbaru (pull) | setelah membaca laporan, ambil versi terbaru (pull) |
| sd6-kode-kerja-tim-kode | s2-6 | minta teman memeriksa | kirim (push), lalu minta teman memeriksa |
| sd6-kode-kerja-tim-kode | s3-3 | jalankan dan uji | setelah membaca, jalankan dan uji |
| sd6-kode-kerja-tim-kode | s5-3 | tulis kode pertama | setelah git init, tulis kode pertama |
| sd6-kode-kerja-tim-kode | s8-3 | tulis kode untuk memanggil gambar | tulis kode untuk memanggil gambar yang sudah disimpan |
| sd6-kode-kerja-tim-kode | s9-5 | buat cabang pertamamu (branch) | setelah program jalan, buat cabang pertamamu (branch) |

## Ditolak (bukan masalah)

| temuan | alasan |
|---|---|
| — | Semua temuan `perbaiki` terbukti saat JSON diperiksa. Tidak ada yang ditolak. |

## Butuh keputusan owner

| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| SEDANG | sd6-sains-terbentuknya-fosil(-perbaiki) / SAINS.SD6.BATUAN.02 | Pasangan "tertimbun" ↔ "bagian lunak membusuk" sah dalam dua urutan (13 urutan). Di mode perbaiki, susunan yang benar bisa dinilai salah. | (a) gabungkan menjadi satu langkah, mis. "tertimbun lumpur; bagian lunak membusuk, cangkang tertinggal"; (b) kecualikan pasangan ini dari pertukaran (perlu perubahan mesin) |
| SEDANG | sd6-sains-aliran-darah(-perbaiki) / SAINS.SD6.SIRKULASI.01 | Pertukaran zat di kapiler (langkah 3↔4) terjadi serentak, jadi urutannya tidak tunggal (9 urutan) | Gabungkan menjadi satu langkah "di kapiler <organ>, oksigen dan sari makanan masuk ke sel, karbon dioksida masuk ke darah", atau larang pertukaran 3–4 |
| SEDANG | sd6-sains-aliran-darah(-perbaiki) / SAINS.SD6.SIRKULASI.01 | 8 dari 11 urutan hanya berganti nama organ, jadi variasinya semu | Ganti 4–5 urutan dengan konteks yang berbeda nyata (ginjal, usus, jantung saat berlari) |
