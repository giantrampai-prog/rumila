# Rumila Kids Academy — Slice 1 (yang pertama bisa dimainkan)

Status: rencana, 24 Okt 2026. Tujuan: dalam 4–6 minggu, satu anak bisa main 2 minggu dan walinya melihat kompetensi bergerak di rapor. Tanpa dunia 3D baru, tanpa Studio, tanpa Instagram.

## Lingkup

| Bagian | Isi Slice 1 | Ditunda |
|---|---|---|
| Kurikulum | **Matematika** dan **Coding**, jenjang **PAUD, TK A, TK B** (≈ 6 chip × 15 kompetensi ≈ 90 kompetensi) dengan kode acuan Cambridge Early Years | 6 pelajaran lain, SD |
| Mekanik | **Pilah**, **Urutkan**, **Dagang**, **Navigasi** (2D, sentuh) | 8 mekanik lain, 3D |
| Konten | ≈ 2 paket per kompetensi ≈ 180 paket, dibangkitkan skill `akademi-kurikulum` + `akademi-konten`, ditinjau skill peninjau | cerita/VO, aset 3D |
| Dunia | satu dunia 2D **Kebun & Pasar** (reuse aset buah) sebagai latar aktivitas | 5 dunia 3D |
| Reuse | Coding Agam (Pola, Langkah, Ulangi, Kalau) dipasang `catatBukti`, progres lama diimpor | Jurus, Resto |
| Rekam jejak | `learner_event` append-only, proyeksi `mastery` & `progress`, sinkron offline | sertifikat PDF, pangkat |
| Portal murid | tab **Hari ini** (3 misi adaptif sederhana) dan **Pelajaran** (peta jenjang, hanya 2 pelajaran aktif) | Dunia, Koleksi, Teman |
| Portal wali | **Rapor** (radar 2 pelajaran, daftar kompetensi, bukti terakhir) | sertifikat, rencana, waktu layar, langganan |
| Admin | tidak ada; kurikulum & paket masuk lewat PR di git | Papan Prestasi, Studio |
| Tenant | `tenant(type=family)`, `guardian`, `learner`; RLS | sekolah |

## Urutan kerja

1. `packages/schema` (zod): Competency, StandardRef, ContentPack per mekanik, Activity, GameEvent.
2. `content/kerangka/`: kamus kode Cambridge Early Years & Primary Stage 1 (Maths, Computing) + EYFS, disalin ke repo.
3. Golden set: 5 kompetensi + 5 paket contoh, ditulis bersama PO.
4. Skill `akademi-kurikulum` + `akademi-tinjau-kurikulum` + eval → hasilkan 90 kompetensi, PR.
5. `packages/mechanics`: Pilah, Urutkan, Dagang, Navigasi — logika murni + tes.
6. Skill `akademi-konten` + `akademi-tinjau-konten` + `akademi-uji-simulasi` → 180 paket, PR.
7. `packages/engine` presenter 2D untuk 4 mekanik; dunia Kebun & Pasar.
8. Supabase: tenant, learner, `learner_event`, proyeksi; edge function `project-mastery`; antrean offline.
9. Portal murid: Hari ini + Pelajaran. Portal wali: Rapor.
10. Coding Agam: `catatBukti` + impor progres lama.
11. Uji ke 3–5 anak selama 2 minggu; `akademi-analisis-telemetri` versi awal.

## Definisi selesai

- Anak PAUD menyelesaikan 10 aktivitas berbeda tanpa bantuan membaca.
- Minimal 5 kompetensi berubah status jadi "dikuasai" dari bukti nyata, bukan seed.
- Wali membuka Rapor dan melihat kode acuan Cambridge di tiap kompetensi.
- Event tetap tersimpan saat main offline 10 menit lalu online.
- Proyeksi bisa dihapus dan dibangun ulang dari event tanpa beda hasil.

## Risiko Slice 1

- Instruksi aktivitas untuk anak 3–4 tahun harus audio; VO memakai ElevenLabs dari naskah paket (bagian `akademi-aset` minimal).
- Kualitas 180 paket hasil AI: skill peninjau + uji simulasi wajib ada sebelum uji ke anak.

## Catatan kemajuan

- 24 Okt 2026 — fondasi: `packages/schema` (zod + 12 tes), CLI `akademi:validate`, golden set 5 kompetensi + 5 paket, skill `akademi-kurikulum` dan `akademi-tinjau-kurikulum` (rubrik + 4 kasus eval). Kamus kerangka `content/kerangka`: 117 kode (Cambridge Primary Maths Stage 1–2 lengkap, EYFS lengkap; Cambridge Early Years dan Computing baru sebagian, butuh unduhan dari support site Cambridge). Validator: 0 error, 2 peringatan jujur. Branch `feat/akademi-fondasi`.
