# Kids Academy — Produksi Kurikulum & Materi Full-AI

Status: usulan, 24 Okt 2026. Menggantikan versi sebelumnya yang masih memakai editor manusia.

## Prinsip

Semua peran produksi dijalankan agen AI (skill Claude Code). Manusia tinggal dua: **Product Owner** (memutuskan) dan **anak pilot** (menguji). Kuncinya bukan satu prompt besar, tapi **rantai skill yang saling mengecek**, dengan penulis dan peninjau selalu agen berbeda, dan setiap keluaran divalidasi skema sebelum lanjut.

```
topik ──▶ [kurikulum] ──▶ [tinjau-kurikulum] ──▶ kompetensi disetujui
                                                     │
          ┌──────────────────────────────────────────┘
          ▼
   [konten ×2 mekanik] ──▶ [tinjau-konten] ──▶ [uji-simulasi] ──▶ paket siap
          │                                                      │
   [cerita & VO] ──▶ [aset] ─────────────────────────────────────┤
                                                                 ▼
                                              uji anak nyata ──▶ [analisis-telemetri] ──▶ publikasi / kembali ke [konten]
```

## Skill yang harus dibangun

| # | Skill | Menggantikan | Masukan → Keluaran | Pengaman |
|---|---|---|---|---|
| 1 | `akademi-kurikulum` | Kepala Kurikulum (penulis) | 1 topik dari `kurikulum.md` → 2–4 `Competency` (statement ID/EN, `depth`, `prereq`, `ref` Cambridge/CEFR/EYFS, `core`) sebagai TS/JSON di `packages/curriculum` | validator skema; cek `prereq` ada dan tidak melingkar; `ref` harus dari daftar kode kerangka yang kita simpan lokal, bukan karangan |
| 2 | `akademi-tinjau-kurikulum` | Kepala Kurikulum (peninjau), guru agama, guru Inggris | kompetensi draf → lulus / revisi dengan alasan | persona berbeda per pelajaran (pedagog usia dini, ustadz, CELTA); agen peninjau **tidak** melihat prompt penulis; rubrik tetap: kelayakan usia, urutan, bisa dibuktikan lewat aksi, tidak bias |
| 3 | `akademi-konten` | Editor Konten | kompetensi + `MechanicId` → `ContentPack` (item, distraktor, string ID/EN, knob default) | zod per mekanik; cek jumlah item minimum; cek kosakata sesuai pita usia (daftar kata per level); cek tidak menyalin teks berhak cipta |
| 4 | `akademi-tinjau-konten` | Editor senior | ContentPack → lulus / revisi | instruksi ≤ 1 kalimat untuk PAUD–TK; jawaban benar tunggal & tidak ambigu; distraktor masuk akal; gambar yang diminta bisa dibuat |
| 5 | `akademi-cerita` | Penulis naskah | world + quest brief → dialog karakter, narasi, naskah VO ID/EN, daftar adegan | panjang kalimat per usia; nama karakter dari kamus tetap; konsistensi dunia |
| 6 | `akademi-aset` | Artist / sound designer | daftar aset dari paket & cerita → prompt gambar/3D, VO ElevenLabs, SFX; unggah ke bucket, isi `AssetRef` hash | gaya visual dari style guide tetap; ukuran & format; cek kelengkapan sebelum publikasi (pipeline glTF & VO yang sudah ada) |
| 7 | `akademi-uji-simulasi` | Playtest awal | ContentPack + mekanik → agen "anak usia N" memainkan logika mekanik murni, laporkan item membingungkan, waktu, salah tafsir | 3 persona per pita usia; dijalankan headless lewat `packages/mechanics` |
| 8 | `akademi-analisis-telemetri` | Analis | event anak nyata → item dengan sukses < 30% / > 95%, waktu reaksi anomali, titik berhenti → tiket revisi otomatis ke skill 3 | ambang di konfigurasi, bukan di prompt |
| 9 | `akademi-mekanik` | Engineer | spesifikasi mekanik → kode `packages/mechanics` + tes + presenter | tes wajib lulus; kontrak `Mechanic<P,S>`; tidak boleh menyentuh kompetensi |
| 10 | `akademi-pipeline` | Manajer produksi | daftar topik → menjalankan skill 1–7 berurutan (Workflow), menahan di titik keputusan PO, mencatat versi | semua langkah idempoten; keluaran ke git, bukan DB; PR per batch topik |

Skill 2 dan 4 adalah yang paling menentukan mutu. Tanpa peninjau terpisah, penulis AI akan selalu menilai karyanya sendiri bagus.

## Fondasi yang harus ada sebelum skill-skill itu berguna

1. **Skema ketat** (`packages/schema`): `Competency`, `ContentPack` per mekanik, `Quest`, `AssetRef`. AI menulis ke skema, bukan ke prosa.
2. **Kamus acuan lokal**: kode kerangka Cambridge Early Years / Primary, Common Core, CEFR, EYFS yang disalin ke repo supaya `ref` bisa divalidasi dan tidak dikarang.
3. **Daftar kosakata per pita usia** ID dan EN (untuk cek keterbacaan otomatis).
4. **Style guide dunia & karakter**: nama, sifat, palet, gaya gambar, suara. Satu berkas, dipakai semua skill.
5. **Golden set**: 5–10 contoh kompetensi dan paket konten yang lo nyatakan "ini standar emas". Semua skill diberi contoh ini; eval membandingkan keluaran baru dengan standar itu.
6. **Eval suite** per skill (pola `claude plugin eval`): kasus uji + rubrik, dijalankan tiap skill diubah. Tanpa ini, perubahan prompt bisa menurunkan mutu tanpa ketahuan.

## Yang tetap dikerjakan manusia (PO)

- Memutuskan di 3 titik: kompetensi disetujui, paket lolos simulasi, publikasi setelah uji anak.
- Menonton anak nyata main, minimal 5 anak per pita usia per bulan. Ini satu-satunya data yang AI tidak bisa hasilkan.
- Merawat golden set dan style guide: kalau selera berubah, ubah di sana, bukan di prompt satu-satu.
- Keputusan sensitif: materi tubuh/pubertas, agama, dan apa pun yang akan dipertanyakan orang tua.

## Skill (kemampuan) yang dibutuhkan PO untuk menjalankan ini

- **Merancang skill & eval**: menulis rubrik, golden set, dan kasus uji. Ini pengganti "merekrut dan melatih editor".
- **Selera pedagogi dasar**: tahu kapan instruksi terlalu panjang untuk anak 4 tahun, kapan lompatan kompetensi terlalu jauh. Didapat dari menonton anak, bukan dari buku.
- **Membaca telemetri**: paham sukses rate, waktu reaksi, titik berhenti; percaya data daripada kesan.
- **Disiplin versi**: semua konten lewat git dan PR; tidak ada edit langsung ke produksi.

## Urutan bangun

1. `packages/schema` + kamus acuan + style guide + golden set (1–2 minggu, bersama Slice 1 teknis).
2. Skill 1 + 2 + eval → pecah PAUD–SD1 Matematika & Coding.
3. Skill 9 → mekanik Pilah, Urutkan, Dagang.
4. Skill 3 + 4 + 7 + eval → paket konten pertama, uji ke anak.
5. Skill 5 + 6 → quest dan aset dunia pertama.
6. Skill 8 + 10 → produksi massal per batch topik.

## Lisensi dan sumber

- Kerangka Cambridge, Common Core, CEFR, EYFS adalah dokumen publik; boleh jadi acuan dan dikutip kodenya, tidak boleh mengklaim afiliasi.
- Semua konten orisinal hasil generasi; aset dari model yang lisensinya mengizinkan komersial.
- `ref` dan versi kerangka dicatat per kompetensi supaya pembaruan kerangka bisa ditinjau.
