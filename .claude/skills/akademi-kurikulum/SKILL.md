---
name: akademi-kurikulum
description: Menulis kompetensi "Aku bisa …" Rumila Kids Academy dari satu topik kurikulum (docs/akademi/kurikulum.md) menjadi berkas JSON tervalidasi di content/kurikulum, lengkap dengan kode acuan kerangka (Cambridge, EYFS) dari kamus content/kerangka, prasyarat, dan mekanik pembukti. Gunakan saat diminta "pecah topik X jadi kompetensi", "tulis kompetensi PAUD Matematika", "lengkapi kurikulum TK A Coding", atau saat menambah/merevisi kompetensi apa pun.
---

# akademi-kurikulum — penulis kompetensi

Kamu adalah **penulis** kurikulum. Kamu tidak meninjau karyamu sendiri; peninjau adalah skill terpisah `akademi-tinjau-kurikulum`.

## Masukan

1. Satu atau beberapa **topik** dari `docs/akademi/kurikulum.md` (misal: "PAUD › Matematika › Bilangan 1–5 dan menghitung benda sampai 5").
2. Golden set `content/golden/kompetensi.json` — baca dulu, tiru gayanya.
3. Kamus kerangka `content/kerangka/*.json` — satu-satunya sumber kode `refs`. Jangan mengarang kode.
4. Skema `packages/schema/src/kompetensi.ts` — bentuk keluaran.
5. Kompetensi yang sudah ada di `content/kurikulum/` — untuk prasyarat dan menghindari duplikat.

## Keluaran

Berkas `content/kurikulum/<TRACK>-<LEVEL>.json` (buat atau tambah), bentuk `KurikulumFile`:

```json
{ "versi": "0.1.0", "kompetensi": [ { ...Competency } ] }
```

Satu topik → **2 sampai 4 kompetensi**. Tidak lebih.

- **Tanpa nama tokoh.** Kurikulum bersifat umum: jangan menulis Agam, Rinoya, atau maskot lain di statement/catatan/unit. Pakai "robot", "tokoh", "anak", "pembeli". Validator menolak nama tokoh.

## Langkah

1. Baca golden set dan skema. Baca kamus kerangka yang relevan (MAT → `eyfs.json`, `cambridge-early-years.json`, `cambridge-primary-maths.json`; KODE → `cambridge-primary-computing.json`, `cambridge-early-years.json`).
2. Untuk tiap topik, tulis kompetensi dengan aturan di bawah.
3. Tentukan `prereq` hanya ke kompetensi yang **sudah ada** (di berkas lain atau yang kamu tulis di batch ini). Prasyarat tidak boleh dari level lebih tinggi.
4. Jalankan validator sampai bersih:
   ```bash
   npm run -s akademi:validate
   ```
   `error` harus nol. `warning` boleh ada, tetapi tiap warning harus kamu jelaskan di laporan.
5. Serahkan ke peninjau: panggil skill `akademi-tinjau-kurikulum` dengan jalur berkas. Jangan menilai sendiri.
6. Laporkan: jumlah kompetensi per topik, ref yang dipakai, warning yang tersisa, dan hal yang kamu ragukan untuk diputuskan PO.

## Aturan menulis kompetensi

- **Id**: `TRACK.LEVEL.UNIT.NN`. `UNIT` slug huruf besar dari nama topik (`BILANGAN-1-5`, `URUTAN`). `NN` dua digit berurutan dalam unit.
- **Statement**: satu kalimat, diawali "Aku bisa" / "I can", **aksi yang bisa diamati di game** (menghitung dengan menunjuk, mengambil sebanyak, menyusun, memilah). Bukan "memahami", "mengenal", "mengetahui". Maksimal 140 karakter. Versi `en` adalah terjemahan setara, bukan harfiah.
- **Satu kompetensi, satu kemampuan.** Kalau ada kata "dan" yang menggabung dua kemampuan, pecah.
- **Depth**: PAUD–TK B umumnya `["pakai"]`; `kenal` hanya untuk pengenalan pertama (nama warna, nama angka); `cipta` untuk membuat sendiri (menyusun pola sendiri, membuat program sendiri).
- **Refs**: ambil dari kamus. Bila kamus tidak punya kode yang cocok, biarkan `refs: []` dan tulis di `catatan` kerangka apa yang seharusnya diacu. Lebih baik kosong daripada salah.
- **Core**: `true` untuk kemampuan yang wajib sebelum naik level; `false` untuk pengaya.
- **Mechanics**: 2–3 mekanik yang benar-benar bisa membuktikannya (lihat daftar di `packages/schema/src/jenjang.ts`). Pikirkan: kalau mekanik ini diganti kuis, apakah masih terbukti? Kalau ya, cari mekanik lain.
- **Cara anak menjawab bilangan** (konvensi hasil tinjauan TK B): jawaban jumlah lewat *produksi jumlah* (menaruh/mengambil sebanyak itu), *penanda di strip/garis bilangan*, *memilah ke rak berlabel*, atau *ucap*. Dilarang "memilih dari 3–4 kartu" dan "pertanyaan audio lalu pilih" — itu kuis berbungkus.
- **Kode Stage 2 sebagai pendahulu** boleh dipakai untuk TK B dengan `note` "pendahulu (Stage 2): …" bila Stage 1 tidak punya kode yang cocok.
- **Catatan** wajib: aksi teramati, jebakan umum anak, beda dengan kompetensi tetangga, saran knob.
- **Urutan dalam unit** mengikuti perkembangan: kenal → pakai → cipta; sedikit → banyak; konkret → simbolik.
- Usia: PAUD 3–4, TK A 4–5, TK B 5–6. Jangan menuntut membaca di PAUD–TK A.

## Larangan

- Mengarang kode kerangka atau menulis kode yang tidak ada di kamus.
- Menulis kompetensi yang hanya bisa dibuktikan dengan soal pilihan ganda.
- Mengubah kompetensi yang sudah ada tanpa diminta (id harus stabil; progres anak menunjuk ke id itu).
- Menulis lebih dari 4 kompetensi per topik.
