# QA putaran 3 — SD6 (MAT, SAINS, KODE)

Cakupan: 102 paket level SD6 (MAT 40, SAINS 36, KODE 26). Semua kunci soal pilih MAT dan KODE dihitung ulang (operasi bilangan bulat, kurung, perkiraan, KPK/FPB, uji bagi 3/9, pecahan, persen, rasio, aljabar, suku ke-n, sudut, rata-rata/jangkauan, peluang, fungsi, diagram alir, dan/atau, bagi dua). Semua urutan desimal/pecahan/persen dan penempatan kartu ke rak (pembulatan, kuadran, sederhanakan, setara, kubik/kuadrat, SAINS kelompok) juga dicek. Tidak ada kunci yang salah. Yang diputuskan di audit 2026-11-21 tidak diangkat lagi.

## 1. Temuan

| jenis | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| visual | sd6-sains-racun-di-rantai-makanan | p-r7: tanparacun / tikushilang / elangkenyang | Jawaban benar memakai ✅, pengecoh memakai ❌ dan ❓. Ikon itu membocorkan jawaban | diperbaiki: emoji 🌱 / 🐀 / 🦅 |
| visual | sd6-sains-data-janggal-kelas | pakai (p-r10), pastibenar (p-r11) | ✅ "langsung memakai hasil itu" dan 💯 "satu kali mengukur pasti sudah benar" adalah jawaban salah, tetapi ikonnya berarti "benar" | diperbaiki: 📝 dan 1️⃣ |
| visual | sd6-sains-hasil-janggal | pakaisaja (p-r7) | ✅ dipasang di jawaban salah "pakai saja sebagai jawaban akhir" | diperbaiki: 📝 |
| visual | sd6-sains-racun-rantai-laut | ikanmas | 🐡 (ikan buntal) dipakai untuk label "ikan mas" | diperbaiki: 🐟. Kartu ini tidak pernah satu ronde dengan kartu 🐟 lain |
| visual | sd6-sains-racun-rantai-laut | pecuk | 🐦‍⬛ (Emoji 15, 2022) tampil sebagai 🐦 + ⬛ di Android/iOS lama | diperbaiki: 🐦 |
| visual | sd6-sains-bentuk-dan-apung | foilperahu, perahukelereng (p-r2, p-r4) | Perahu foil yang mengapung bergambar 🥈 (medali). Perahu yang tenggelam justru bergambar 🛶 | diperbaiki: foilperahu 🛶, perahukelereng 🔮 (kelereng) |
| ambigu | sd6-sains-jalur-energi-sawah-perbaiki | instruksi | Instruksi berbunyi "Dua makhluk … tertukar", padahal Matahari ikut ditukar (contoh seed 977: swapped [0,2] matahari↔wereng) | diperbaiki: "Dua kartu …" (EN "Two cards …") |
| ambigu | sd6-kode-alir-menara | instruksi | Instruksi menyuruh "Pilih apa yang tampil di akhir", padahal q4 dan q8 menanyakan berapa kali kotak dijalankan / lift naik | diperbaiki: "Lalu pilih jawaban pertanyaannya." |
| ambigu | sd6-kode-telusur-diagram-alir | instruksi | Instruksi "pilih apa yang tampil", padahal q8 menanyakan berapa kali kotak dijalankan | diperbaiki: "lalu pilih jawaban pertanyaannya." |
| tidak-sesuai | sd6-kode-kerja-tim-kode | s8-5 | Ada kata "tokoh", padahal aturan bahasa memakai "karakter" | diperbaiki: "commit: 'tambah gambar karakter'" (EN sudah "character") |
| ambigu | sd6-sains-racun-di-rantai-makanan | p-r6 | "Di kolam ini ular hanya memakan katak", padahal rantai lain berlatar sawah | ditolak: "ini" merujuk premis di kalimat itu sendiri, jadi soal tetap berdiri sendiri. Pola yang sama ada di p-r12/p-r13 |
| visual | sd6-sains-bentuk-dan-apung | jerukutuh/jerukkupas 🍊🍊, kalengkosong/kalengair 🥫🥫 | Dua pilihan dalam satu ronde bergambar sama | ditolak: disengaja (soal "Jeruknya sama…", "Kalengnya sama…"), label di bawah gambar membedakan (SD6) |
| visual | sd6-sains-racun-rantai-laut | tongkol 🐠 | Emoji ikan tropis dipakai untuk tongkol | ditolak: kecil. Tidak pernah satu ronde dengan ikan lain, label jelas |
| visual | sd6-sains-data-janggal-kelas | wajar 👌 / pastijanggal ⚠️ | Ikon sejalan dengan arti jawaban | ditolak: ikon hanya menggambarkan isi label, bukan simbol "benar/salah" kuis |
| visual | sd6-mat-kubik-bintang-angkasa | "hanya kubik" (scale 1) vs pilihan lain (0,5) | Satu pilihan tampil lebih besar | ditolak: keempat kartu kategori muncul di semua ronde kategori, jadi ukuran tidak membocorkan kunci (skala hasil penyesuaian panjang teks) |
| visual | sd6-sains-jalan-udara-perbaiki | judul "Napas Pendaki yang Tertukar" | Hanya 2 dari 11 urutan bertema pendakian | ditolak: judul tidak dibacakan sebagai soal (sejalan dengan putusan judul bentuk-dan-apung di audit 21-11) |

## 2. Kalimat suara berubah

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd6-sains-jalur-energi-sawah-perbaiki | instruksi | Dua makhluk di jalur energi sawah tertukar tempat. Tukar keduanya supaya urut dari Matahari, produsen, lalu siapa memakan siapa. | Dua kartu di jalur energi sawah tertukar tempat. Tukar keduanya supaya urut dari Matahari, produsen, lalu siapa memakan siapa. |
| sd6-kode-alir-menara | instruksi | Ikuti panah diagram alir dari Mulai: di tiap ◇ jawab ya atau tidak, dan bila panah kembali ke ◇, periksa lagi dengan nilai yang baru. Pilih apa yang tampil di akhir. | Ikuti panah diagram alir dari Mulai: di tiap ◇ jawab ya atau tidak, dan bila panah kembali ke ◇, periksa lagi dengan nilai yang baru. Lalu pilih jawaban pertanyaannya. |
| sd6-kode-telusur-diagram-alir | instruksi | Mulai dari Mulai, ikuti panah, jawab tiap ◇ dengan ya atau tidak sampai Selesai, lalu pilih apa yang tampil. | Mulai dari Mulai, ikuti panah, jawab tiap ◇ dengan ya atau tidak sampai Selesai, lalu pilih jawaban pertanyaannya. |
| sd6-kode-kerja-tim-kode | s8-5 | commit: 'tambah gambar tokoh' | commit: 'tambah gambar karakter' |

Perubahan emoji tidak mengubah teks suara.

## 3. Butuh kode
Tidak ada.

## 4. Keputusan
Tidak ada yang baru. Keputusan lama (`potong: "tengah"` jalur energi) tidak diangkat lagi.

## 5. Versi dinaikkan
racun-di-rantai-makanan 1.1.1→1.1.2 · racun-rantai-laut 1.0.2→1.0.3 · data-janggal-kelas 1.0.2→1.0.3 · hasil-janggal 1.1.0→1.1.1 · bentuk-dan-apung 1.1.1→1.1.2 · kode-alir-menara 1.0.0→1.0.1 · kode-telusur-diagram-alir 1.0.0→1.0.1 · jalur-energi-sawah-perbaiki 1.0.2→1.0.3 · kode-kerja-tim-kode 1.1.2→1.1.3

## 6. Angka
- Paket diperiksa: 102 (MAT 40, SAINS 36, KODE 26)
- Temuan: 16
- Diperbaiki: 10 (di 9 paket)
- Ditolak: 6
- `akademi:validate`: 810 paket valid. `akademi:audit`: ERROR 0, WARNING 0.
