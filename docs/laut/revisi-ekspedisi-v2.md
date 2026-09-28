# Jelajah Laut — ekspedisi v2

Revisi 28 September 2026. Tur interaktif: 17 bab, 58 paragraf narasi orisinal. Agam mengajak anak melihat, bertanya, lalu menemukan. Audio lama tidak dipakai untuk naskah baru.

## Referensi dan adaptasi

Referensi pengguna: [Beginilah Perjalanan Menuju Palung Terdalam di Dunia — SISI TERANG](https://www.youtube.com/watch?v=aD855YOR_co). Halaman YouTube menunjukkan 11:25; ekspor transkrip tidak tersedia. Analisis adegan Higgsfield mengidentifikasi pola perjalanan kapal selam, penanda kedalaman, perjumpaan biota, perubahan cahaya dan perbandingan skala. Timestamp analisis tidak cocok dengan durasi pemutar sehingga tidak digunakan sebagai cue atau transkrip verbatim.

Yang diadaptasi: ajakan berangkat → amati lingkungan → pertanyaan → satu penemuan → lanjut. Naskah, aset, UI dan adegan dibuat untuk Rinoya, tanpa menyalin audio, karakter, gambar atau kalimat video. Klaim referensi yang sudah usang atau terlalu menyederhanakan habitat tidak dipindahkan.

## Visual dan interaksi

- Kapal: dek, rel, kaca, tali, fender dan tabung dengan geometri bersih; Agam mempertahankan rig yang ada. GLB kapal lama tetap di arsip, tidak dipakai karena tekstur rekonstruksinya rusak saat dilihat dekat.
- Pulau: kontur halus, pantai dan kartu dedaunan bertekstur dari aset GPT kebun yang sudah ada.
- Dasar laut: dua tekstur GPT baru, karang berwarna alami, cabang digabung untuk mengurangi draw call. Sisik, iris, sirip ikan dan kulit penyu diperinci.
- Air: cahaya dan kabut menurut kedalaman; kaustik, salju laut dan sorot kapal yang memudar.
- Tur: teks narasi, jeda/lanjut, sebelumnya/berikutnya, peta bab, mute, sudut pandang jendela. Peta dan tab tersembunyi menjeda narasi.
- Jelajah bebas: orbit, memilih biota di dok atau mengetuk model 3D.
- Ponsel: kedalaman pada judul menggantikan meter vertikal; kontrol utama tetap tersedia.

Visualisasi edukasi bergaya natural, bukan pemindaian ilmiah atau simulasi kendaraan bersertifikat. Bentuk biota, jarak, waktu, ukuran relatif dan rute dipadatkan. Beberapa habitat dunia dirangkum dalam satu perjalanan virtual. Kinerja perangkat lemah mungkin berbeda dari browser pengujian.

## Acuan fakta

- Penyelam hanya di perairan dangkal, pindah kendaraan pada 16 m sebelum perjalanan laut dalam. Tidak memberikan instruksi praktik menyelam kepada anak.
- Zona cahaya 0–200 m, senja 200–1.000 m, tengah malam 1.000–4.000 m, abisal 4.000–6.000 m, hadal lebih dalam: [NOAA](https://oceanservice.noaa.gov/facts/light_travel.html).
- Kilau pelangi hewan sisir berbeda dari bioluminesensi: [NOAA Ctenophore](https://oceanexplorer.noaa.gov/multimedia/daily-image-media-20211027/), [Bioluminescence](https://oceanexplorer.noaa.gov/ocean-fact/bioluminescence/).
- Ventilasi mengeluarkan cairan kaya mineral, bukan api. Komunitasnya ditopang energi kimia: [NOAA Chemosynthesis](https://pmel.noaa.gov/eoi/nemo/explorer/concepts/chemosynthesis.html).
- Challenger Deep ±10.935 m; panggung ini tidak menampilkan ikan: [NOAA Ocean depth](https://oceanservice.noaa.gov/facts/oceandepth.html).
- Ikan siput direkam pada 8.336 m tahun 2023 di palung dekat Jepang, bukan dasar Mariana: [University of Western Australia](https://www.uwa.edu.au/news/Article/2023/April/Scientists-break-new-record-after-finding-worlds-deepest-fish).

## Naskah dan suara

Paket `public/laut/narasi-v2.zip` berisi 17 file per bab, naskah gabungan, cue-sheet CSV dan petunjuk. Kata-kata aplikasi berasal dari `src/lib/laut/misi.ts`. Setelah mengubahnya, jalankan `node --import tsx scripts/export-sea-narration.ts`.

Rekam satu file per bab, simpan di `public/laut/voice/v2/`, tambahkan src/cues ke `manifest.json` versi 2. Cue harus mengikuti rekaman final, dimulai 0, urut naik dan jumlahnya sama dengan paragraf. Path/cue invalid atau audio lebih pendek dari cue terakhir ditolak. Manifest tidak di-cache agar rekaman baru segera terbaca. Audio gagal beralih ke teks agar tur tetap berjalan.

Rekaman profesional v2 belum dibuat. Aplikasi membacakan naskah dengan suara Indonesia perangkat bila tersedia; kualitas bergantung perangkat. Tanpa itu, teks mengikuti waktu baca. Melanjutkan suara perangkat setelah jeda mengulang paragraf aktif. Audio v1 tetap tersimpan sebagai arsip.

## Aset

`public/laut/realism/seabed-sand.webp` dan `coral-tissue.webp` dibuat memakai tool GPT Image bawaan, menjadi 1024 × 1024 WebP. Prompt lengkap: `public/laut/realism/prompts.json`. Tekstur adalah ilustrasi permukaan, bukan acuan identifikasi spesies.

## Verifikasi

Tes: kontinuitas kedalaman, kendaraan sebelum laut dalam, habitat ikan, batas zona, cue rekaman, paket naskah, jeda, fallback tanpa audio dan callback suara lama. TypeScript, ESLint dan build produksi. Pratinjau `/dev/laut` khusus development; modul berada di `/laut`.

Hasil pemeriksaan akhir: 190 tes dalam 23 file lulus; build produksi 49 halaman dan ESLint modul lulus. Review browser 1280 × 720 dan 390 × 844 mencakup peta bab, jeda/lanjut, POV jendela, Challenger Deep, akhir tur dan ulangi. Tidak ada error/warning browser pada review akhir. Bukti visual lokal: `output/laut/01-kapal.png`, `02-terumbu.png`, dan `mobile-review.png`. Verifikasi ini mencakup build lokal; status publikasi diperiksa terpisah saat deployment.
