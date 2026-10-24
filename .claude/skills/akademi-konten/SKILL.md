---
- **Tanpa nama tokoh** di id, locale, dan world: pakai "robot"/"tokoh"/"pembeli"; validator menolak Agam/Rinoya/Mecca.
name: akademi-konten
description: Menulis paket konten JSON Rumila Kids Academy (content/paket/<mekanik>/<id>.json) untuk kompetensi di content/kurikulum memakai 4 mekanik Slice 1 (pilah, urutkan, dagang, navigasi). Gunakan saat diminta "buat paket untuk kompetensi X", "tambah konteks baru untuk paket Y", atau "lengkapi paket PAUD/TK A/TK B".
---

# akademi-konten — penulis paket konten

Baca dulu, urut: `docs/akademi/slice-1-kontrak.md` §1, `packages/schema/src/paket.ts`, `docs/akademi/mekanik-navigasi.md`, golden `content/golden/paket-*.json`, lalu `statement`+`catatan`+`mechanics` kompetensi sasaran di `content/kurikulum`. Golden set tetap di tempatnya; jangan digandakan. Jangan sentuh `packages/`, `src/`, `content/kurikulum`, `content/golden`.

## Bentuk paket
- `id` slug Indonesia deskriptif (`pasar-buah-6-10`, `lompati-batu-jalur-atas`), unik di seluruh repo. `version` "1.0.0", `rounds` 4–6, `world` slug latar (default `kebun-pasar`).
- `locale.id` dan `locale.en` lengkap untuk `instruksi`, semua `labelKey`, `titleKey`, `promptKey`. Kunci = `[a-zA-Z0-9._-]`, angka pakai `n7`, bukan `7`.
- Instruksi = satu kalimat pendek yang dibacakan ke anak 3–6 tahun, menyebut robot/pembeli bila relevan, langsung menyebut aksi ("sentuh", "taruh", "susun", "tekan").
- Knob minimal satu, semua dengan `keterangan`. Nama yang dihormati mesin: pilah `binCount/itemCount/maxCount`; urutkan `steps`; dagang `itemsMax/kinds/harga/pengurang/flashMs/target`; navigasi `distance/rocks` (knob lain boleh, hanya dokumentasi).
- Visual tanpa aset: emoji benda nyata (🍊🐟🦆🧸); bentuk `shape`+`color`; kelompok `count` (≤20); besar/kecil `scale` (rasio ≥1,5 di PAUD); panjang/pendek `width` (beda ≥20% antar benda seriasi); uang 🪙 koin / 💵 kertas dengan `color` beda per pecahan (500 perak, 1.000 emas, 2.000 abu, 5.000 cokelat, 10.000 ungu).
- Ikuti jebakan di `catatan`: warna → benda beragam bentuk; bentuk → warna diacak; selisih 1 → kelompok sedikit digambar lebih besar; 6 vs 9, 12 vs 21 → rak berurutan; benda dua bentuk (rumah) dihindari di PAUD.

## Per mekanik
- **pilah kelompok**: ≥2 bin, ≥4 item; satu kompetensi = dua konteks (buah vs hewan, pasar vs kebun). Rak angka: bin `labelKey` angka, item `count`. Kartu bertitik PAUD: bin emoji ⚀⚁⚂⚃⚄. Piktogram: bin = kolom jenis.
- **pilah pilih**: satu bin dummy `pilihan`; tiap ronde `promptKey` berupa pertanyaan ("Mana yang merah?"), 2–4 pilihan, tepat satu benar; prompt bergantian (lebih besar/kecil, paling sedikit/banyak).
- **urutkan**: `dulu` = tepat 2 langkah sebab-akibat yang tak bisa dibalik; `susun`/`perbaiki` ≥3 langkah, tanpa dua gambar yang boleh bertukar; seriasi pakai `width`; lanjut hitungan: `titleKey` "Lanjutkan dari N", kartu `n{N+1}`….
- **dagang**: `currency` "IDR"; koin = `denominations [1000]` + `priceLabel koin`; rupiah = `[1000,2000,5000]` + `rupiah`; `goods.price` = harga. `tukar`: goods = lembar yang ditukar (💵, price = nilai). `customerRule` sesuai mode (`flashMs` subitasi/lengkapi, `target` gabung/sisa/lengkapi).
- **navigasi**: x ke kanan, y ke bawah, N = y−1; `w,h ≥ 2` (jalur vertikal pakai w=2). `optimal` = program terpendek dari blok dasar (maju 1 petak, lompat 2 petak, belok 1 blok) — hitung dengan BFS, bukan dikira-kira; lompat di petak kosong sah dan sering memperpendek jalur, jadi `optimal` bisa lebih kecil dari jawaban "satu lompat per batu". Batu hanya bila ada `lompat`/`kalau`; batu tidak berdampingan. PAUD `execMode langsung`; TK A `program`, robot tidak pernah menghadap S; TK B boleh `langkah`+`prediksi`, `debug` (program awal + `fixes`), `semuaGrid` (3 grid per `group`, batu berpindah), `rackSlots` kecil untuk memaksa ulangi/bendera (ulangi = 1 keping + isinya; body ≤2, tanpa bersarang). Program yang menabrak (DEBUG-BANYAK.02) harus tidak melewati bintang sebelum menabrak. 3–5 grid per paket, bervariasi pada `distance`/`rocks`/`turns`.

## Cara kerja efisien
Tulis generator Node kecil di scratchpad (helper `pack()`, `G()`, BFS `optimal`), keluarkan `JSON.stringify(_, null, 2)` ke `content/paket/<mekanik>/`, lalu `npm run -s akademi:validate` sampai 0 error. Validator memeriksa skema, kunci locale dwibahasa, kompetensi ada, dan id unik. Laporkan jumlah per mekanik, kompetensi yang dilewati beserta alasannya, dan keputusan desain yang diragukan.
