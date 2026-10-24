# Kamus kode kerangka kurikulum (Rumila Kids Academy, usia 3–7)

Berkas JSON di folder ini adalah kamus kode acuan yang dipakai validator. Setiap
kompetensi Rumila menunjuk `code` dari salah satu berkas ini. Hanya butir dengan
`"verified": true` yang teksnya dibaca langsung dari dokumen resmi (atau salinan
yang jelas mengutip dokumen itu). Butir `"verified": false` disertakan hanya
sebagai petunjuk dan **jangan dipakai validator** sampai dikonfirmasi.

Tanggal riset: 2026-10-24.

| Berkas | Framework | Entri | Terverifikasi | Cakupan |
|---|---|---|---|---|
| `cambridge-primary-maths.json` | `CAMBRIDGE_PRIMARY_MATHS` | 92 | 92 | Lengkap: TWM.01–08 + semua learning objective Stage 1 (39) dan Stage 2 (45) |
| `cambridge-primary-computing.json` | `CAMBRIDGE_PRIMARY_COMPUTING` | 6 | 4 | Sebagian kecil saja (lihat catatan) |
| `cambridge-early-years.json` | `CAMBRIDGE_EY` | 11 | 11 | Hanya contoh resmi: 6 butir Mathematics + 5 butir Understanding the World (Digital technology), EY1–EY3 |
| `eyfs.json` | `EYFS` | 8 | 8 | Lengkap: ELG Number dan ELG Numerical Patterns (2 goal + 6 butir) |

## 1. Cambridge Primary Mathematics (0096) — lengkap

- Sumber: salinan PDF resmi *Cambridge Primary Mathematics 0096 Curriculum
  Framework*, Version 1.1, "Published in September 2020 for first teaching in
  September 2021". Nama berkasnya memakai ID internal Cambridge
  (`..._tcm142-592530.pdf`); cermin publik di
  <https://cmapspublic2.ihmc.us/rid=1X1FVKBN9-26QY3DL-426X/Cambridge%20Primary%20Mathematics%20Curriculum%20Framework%200096_tcm142-592530.pdf>.
  PDF asli di Cambridge Primary support site memerlukan login sekolah.
- Diambil: kode, teks, strand + sub-strand untuk Stage 1 (hlm. 16–17) dan Stage 2
  (hlm. 18–20), serta TWM.01–08 dengan definisi dari tabel hlm. 9.
- Pola kode: `<stage><sub-strand>.<urut>` — Nc Counting and sequences; Nf Fractions,
  decimals, percentages, ratio and proportion; Ni Integers and powers; Nm Money;
  Np Place value, ordering and rounding; Gp Position and transformation; Gg
  Geometrical reasoning, shapes and measurements; Gt Time; Ss Statistics; Sp
  Probability; TWM Thinking and Working Mathematically (berlaku semua stage).
- Penyesuaian teks: sub-butir "o" di dokumen asli digabung jadi satu baris
  dipisah `;` (mis. 1Ni.02, 1Ss.02). Pecahan bertumpuk di 2Nf.05 ditulis `1/4`,
  `1/2`, dst. Selain itu teks verbatim.
- Jumlah 92 dicek otomatis sama dengan jumlah kode unik Stage 1–2 + TWM di PDF.

## 2. Cambridge Primary Computing (0059) — hanya sebagian

- Yang berhasil: 4 kode terverifikasi (`1DC.03`, `1CS.06`, `2CT.06`, `2P.02`)
  dikutip dari halaman Cambridge Community (situs Cambridge International):
  <https://cambridge-community.org.uk/guide-to/cambridge-primary/computing/>.
  Nama lima strand (Computational Thinking, Programming, Managing Data, Networks
  and Digital Communication, Computer Systems) dan pola kode (`1CT.05` = stage,
  kode strand, urut) juga dari sana.
- Dua butir `verified: false` (`1CT.01`, `1CT.02`): teks 1CT.01 terbaca di
  halaman yang sama tetapi tanpa kode; pemasangan kodenya hanya dari cuplikan
  hasil pencarian atas salinan framework. Jangan dipakai sebelum dicek.
- Yang tidak berhasil: PDF framework lengkap (ref. Cambridge `tcm142-635600`,
  terbit Sept 2021) hanya ada di support site (login). Salinan publik di
  pdfcoffee/studocu tidak dapat diakses dari jaringan ini, Scribd membatasi
  akses, dan cambridgeinternational.org sedang maintenance saat riset.
  Sampel penerbit (Hodder LB Stage 1, CUP LB 1 excerpt/frontmatter) tidak memuat
  kode objective.
- Kode pelaporan strand Managing Data (diduga `MD`) **belum terverifikasi**.
- Tindak lanjut: unduh *Curriculum Framework* dan *Progression Grid* 0059 dari
  Cambridge Primary support site dengan akun sekolah, lalu lengkapi berkas ini.

## 3. Cambridge Early Years (EY1–EY3) — hanya contoh resmi

- Sumber: dokumen resmi *Cambridge Early Years Curriculum Samples*
  (© Cambridge University Press & Assessment 2024),
  <https://www.cambridgeinternational.org/Images/729772-cambridge-early-years-to-primary-transition-support-document.pdf>,
  dibaca lewat snapshot Wayback 2025-10-01 karena situs Cambridge sedang
  maintenance.
- Diambil (semua verbatim): Mathematics — `1Mn.04`, `2Mn.04`, `3Mn.03`
  (developing a sense of number: ordinal), `1Ms.06`, `2Ms.09`, `3Ms.09` (shape,
  space and measure: pola); Understanding the world / Digital technology —
  `1UWd.03`, `1UWd.04`, `2UWd.04`, `2UWd.05`, `3UWd.05`.
- Struktur yang terkonfirmasi: EY1 usia 3–4, EY2 usia 4–5, EY3 usia 5–6; area
  Mathematics = developing a sense of number (Mn), handling data, shape, space
  and measure (Ms); Understanding the world = scientific thinking (UWs), digital
  technology (UWd), people, time and place (UWp). Kode handling data (diduga
  `Md`) belum terlihat.
- Yang tidak berhasil: framework lengkap Cambridge Early Years tidak tersedia
  publik (hanya untuk Cambridge Early Years centre). Sampel Learner's Book dan
  Teaching Resource resmi (Images/698038, Images/685841) tidak memuat kode
  learning statement. Jadi berkas ini tidak bisa dipakai untuk memetakan seluruh
  kompetensi matematika EY; hanya butir ordinal, pola, dan etika perangkat digital.

## 4. EYFS (Inggris) — lengkap untuk Mathematics

- Sumber utama: PDF gov.uk *EYFS statutory framework for group and school-based
  providers*, edisi berlaku 1 September 2026
  (<https://assets.publishing.service.gov.uk/media/6a5f8e4fb00f3323bf1a23a1/EYFS_group_and_school_based_from_September_2026.pdf>),
  dari halaman <https://www.gov.uk/government/publications/early-years-foundation-stage-framework--2>.
- Teks ELG Number dan ELG Numerical Patterns dibandingkan baris per baris dengan
  edisi Nov 2024 (dated 11 Oct 2024; salinan DERA/UCL) dan edisi Jan 2024
  (published 8 Dec 2023; salinan City of London FIS): identik. Jadi versi
  2023/2024 yang diminta tercakup.
- Kode: `ELG-MATH-NUMBER` dan `ELG-MATH-PATTERNS` berisi teks goal lengkap;
  `ELG-MATH-NUMBER-01..03` dan `ELG-MATH-PATTERNS-01..03` per butir.

## Format entri

```json
{ "code": "1Nc.01", "stage": "1", "strand": "Number: Counting and sequences",
  "text": "...", "verified": true, "source": "url" }
```

Field tambahan per berkas (`notes`, `strands`, `stages`, dll.) bersifat
informatif. Berkas ini dihasilkan oleh skrip di scratchpad sesi riset; untuk
memperbarui, ganti sumber PDF dan jalankan ulang, atau sunting manual.
