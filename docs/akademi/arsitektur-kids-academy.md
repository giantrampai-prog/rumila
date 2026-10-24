# Rumila Kids Academy — Usulan Arsitektur

Status: draf diskusi, 24 Okt 2026. Belum ada kode yang berubah.

## 1. Prinsip

1. **Game adalah bukti, bukan soal.** Anak tidak "mengerjakan ujian". Anak main, dan setiap aksi bermakna di dalam game dicatat sebagai *bukti kompetensi* (evidence). Penilaian terjadi diam-diam dari telemetri gameplay (stealth assessment).
2. **Kurikulum dan game dipisah.** Kurikulum = daftar kompetensi "Aku bisa …" per Jalur dan Level. Game = produsen bukti. Satu game bisa membuktikan banyak kompetensi; satu kompetensi bisa dibuktikan oleh beberapa game. Keduanya terhubung lewat tabel pemetaan, bukan hard-code.
3. **Naik level berbasis penguasaan (mastery), bukan waktu.** Kompetensi dianggap *dikuasai* bila terbukti berulang, di konteks berbeda, dan berjarak hari. Bukan sekali benar.
4. **Dunia tidak dikunci.** Semua dunia 3D tetap bebas dimainkan. Level hanya membuka *cerita/misi* baru dan sertifikat. Anak kecil jangan ditolak masuk dunia karena "belum level 3".
5. **Standar internasional sebagai acuan rumusan kompetensi, bukan klaim akreditasi.** Sertifikat Rumila menyebut "mengacu pada" kerangka tertentu dan mencantumkan daftar kompetensi yang terbukti. Tidak mengklaim "Cambridge certified".

## 2. Acuan standar internasional

| Level Rumila | Nama pangkat | Usia ± | Acuan kerangka |
|---|---|---|---|
| L1 | Tunas | 3–4 | Cambridge Early Years 1 / EYFS |
| L2 | Kadet | 4–5 | Cambridge Early Years 2–3 / EYFS |
| L3 | Navigator | 5–6 | Cambridge Primary Stage 1 |
| L4 | Pilot | 6–7 | Cambridge Primary Stage 2 |
| L5 | Kapten | 7–8 | Cambridge Primary Stage 3 |
| L6 | Komandan | 8–9 | Cambridge Primary Stage 4 |

Catatan: untuk matematika bisa disilang dengan Common Core K–3; untuk Bahasa Inggris pakai Pre-A1 Starters / A1 Movers (Cambridge YLE) sebagai rujukan kosakata dan fungsi bahasa. Jalur Karakter & Agama tidak punya acuan internasional; rumuskan sendiri.

## 3. Jalur (Track)

| Jalur | Isi | Modul yang sudah ada |
|---|---|---|
| SAINS | alam, tubuh, laut, bumi, angkasa, fisika sederhana | Jelajah Angkasa, Roket, Jelajah Tubuh, Bawah Laut, Dalam Bumi |
| MATEMATIKA | bilangan, pola, ukur, uang, bentuk, data | Rinoya Resto, Kebun Buah, Ular Tangga |
| LITERASI | huruf, membaca, menyimak, bercerita, Bahasa Inggris | — (kategori edukasi masih planned) |
| KODING & LOGIKA | urutan, perulangan, kondisi, abstraksi, debugging | Coding Agam (5 modul × 10 level × 10) |
| DUNIA & BUDAYA | provinsi, negara, budaya, profesi, kendaraan | — |
| KARAKTER & AGAMA | doa, ibadah, emosi, kebiasaan baik | Doa Harian, Ibadah |

## 4. Model data kurikulum

Definisi kurikulum tinggal **di kode** (TypeScript, seperti pola `catalog.ts` / `education.ts`), diversi lewat git. Database hanya menyimpan **data pembelajar**.

```
Track ─< Level ─< Unit ─< Competency ─< (mapping) >─ Game Action
                                  │
                                  └─< Evidence (per anak)  →  Mastery (dihitung)
Level ─ Capstone (Misi Puncak) ─ Certificate (per anak)
```

### 4.1 Definisi di kode (`src/lib/akademi/`)

```ts
// kurikulum.ts
export interface Competency {
  id: string;            // "MAT.L2.U3.C2" — stabil, jangan diubah
  track: TrackId;
  level: 1|2|3|4|5|6;
  unit: string;          // "Uang & Belanja"
  statement: string;     // "Aku bisa menghitung kembalian sampai Rp10.000"
  ref?: string;          // "Cambridge Primary Maths 2Nm.03" — opsional
  core: boolean;         // wajib untuk naik level, atau pengaya
  mastery: MasteryRule;  // default lihat §5
}

// pemetaan.ts — menghubungkan aksi game → kompetensi
export interface EvidenceMapping {
  toolId: string;        // "game-resto"
  action: string;        // "kasir.kembalian.benar"
  competencyIds: string[];
  weight?: number;       // default 1
}
```

### 4.2 Tabel baru di Supabase

```sql
-- bukti mentah, append-only
create table akademi_evidence (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references family(id) on delete cascade,
  member_id uuid not null references member(id) on delete cascade,
  competency_id text not null,          -- id dari kode
  tool_id text not null,
  action text not null,
  outcome text not null check (outcome in ('success','fail','hint','skip')),
  score numeric,                        -- opsional 0..1
  context jsonb,                        -- level game, seed, waktu reaksi, dsb.
  at timestamptz not null default now()
);
create index on akademi_evidence(member_id, competency_id, at desc);

-- hasil hitung penguasaan (diperbarui oleh fungsi/edge function, bisa dihitung ulang kapan saja)
create table akademi_mastery (
  member_id uuid not null references member(id) on delete cascade,
  competency_id text not null,
  status text not null check (status in ('belum','berkembang','dikuasai')),
  score numeric not null default 0,
  first_at timestamptz, mastered_at timestamptz,
  primary key (member_id, competency_id)
);

-- sertifikat yang sudah terbit
create table akademi_certificate (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references family(id) on delete cascade,
  member_id uuid not null references member(id) on delete cascade,
  track text,                           -- null = sertifikat level penuh
  level smallint not null,
  code text not null unique,            -- 8 karakter, dipakai di QR & URL publik
  snapshot jsonb not null,              -- daftar kompetensi terbukti saat terbit (beku)
  issued_at timestamptz not null default now(),
  pdf_path text
);
```

`activity_log` tetap untuk sesi dan durasi. `game_save` tetap untuk state game. Evidence adalah lapisan baru yang **ditulis dari dalam game** lewat satu helper:

```ts
// src/lib/akademi/bukti.ts
export function catatBukti(action: string, outcome: Outcome, ctx?: Record<string, unknown>)
// → cari mapping berdasarkan toolId aktif + action → insert N baris evidence (satu per kompetensi)
// → antre offline (PWA) seperti game_save, kirim saat online
```

Game tidak perlu tahu id kompetensi. Game cukup bilang "kasir.kembalian.benar". Pemetaan yang menentukan kompetensinya. Ini yang membuat kurikulum bisa direvisi tanpa menyentuh kode game.

## 5. Aturan penguasaan (default)

Kompetensi **dikuasai** bila semuanya terpenuhi:

- ≥ 3 bukti `success`,
- dari ≥ 2 konteks berbeda (dua game berbeda, atau dua level game berbeda),
- tersebar di ≥ 2 hari berbeda,
- rasio success : (success+fail) dalam 10 bukti terakhir ≥ 0,7,
- tidak memakai `hint` pada ≥ 2 bukti terakhir.

**Berkembang** bila ada ≥ 1 success tapi belum memenuhi di atas. Aturan ini bisa dioverride per kompetensi lewat `mastery` di definisinya (misal hafalan doa butuh 5 kali, berjarak minimal 3 hari).

## 6. Naik level dan sertifikat

```
Unit selesai      → Stiker (instan, di dalam game)
Track × Level     → Lencana (semua kompetensi core track itu dikuasai)
Level penuh       → Sertifikat (semua lencana core level itu + Misi Puncak lulus)
```

**Misi Puncak** adalah game, bukan ujian: satu petualangan 10–15 menit yang menggabungkan kompetensi lintas jalur di level itu. Contoh L3: "Ekspedisi ke Pulau Komodo" — berlayar (peta provinsi), beli perbekalan (uang), baca petunjuk (literasi), susun rute (koding), catat satwa (sains).

Sertifikat:
- PDF A4 landscape, nama anak, pangkat, tanggal, daftar kompetensi terbukti, "mengacu pada Cambridge Primary Stage 1", QR → `/sertifikat/<code>` (halaman publik, read-only, hanya menampilkan isi `snapshot`).
- Upacara di app: animasi penyematan pangkat, bisa dibagikan ke WA keluarga.
- Orang tua (admin) bisa mencetak dari dasbor.

## 7. Dasbor orang tua

Halaman `/akademi/<memberId>`:
- Radar 6 jalur (persentase kompetensi dikuasai di level berjalan),
- Daftar kompetensi dengan status belum / berkembang / dikuasai dan bukti terakhir,
- Rekomendasi "mainkan ini" = game yang memetakan ke kompetensi yang masih `belum` (ini mesin rekomendasi paling sederhana dan paling berguna),
- Riwayat lencana dan sertifikat.

## 8. Ide game belajar (bukan soal)

Prinsip desain: **mekanik game = kompetensi**. Kalau mekaniknya bisa diganti kuis tanpa mengubah game, berarti belum benar.

### SAINS
- **Katalog Ekspedisi** (Bawah Laut, sudah 17 bab): anak memotret makhluk, lalu harus *menempatkannya* di buku katalog menurut ciri (sirip/cangkang/tentakel, zona kedalaman). Bukti: klasifikasi. Lanjutan: **Rantai Makanan** — susun siapa makan siapa; salah susun, terumbu memucat pelan-pelan.
- **Pilot Orbit** (Jelajah Angkasa): atur kecepatan kapsul agar mengorbit, bukan jatuh atau lepas. Intuisi gravitasi tanpa satu pun rumus.
- **Dokter Kecil** (Jelajah Tubuh): pasien datang dengan keluhan ("perutku sakit habis makan"), anak menyorot organ yang terlibat, memilih tindakan. Bukti: fungsi organ, kesehatan.
- **Penambang Kristal** (Dalam Bumi): gali lapisan, tiap lapisan punya umur dan jenis batu; alat gali harus sesuai kekerasan batu. Bukti: lapisan bumi, skala waktu, sifat material. (Nyambung dengan dunia tambang emas keluarga.)
- **Bengkel Roket** (Roket): rakit roket dari komponen; massa vs daya dorong menentukan sampai mana. Bukti: ukur, banding, sebab-akibat.

### MATEMATIKA
- **Pasar Buah** (Kebun Buah): timbang, beri harga, layani pembeli, hitung kembalian. Bukti: bilangan, uang, ukur.
- **Petani Pola** (Kebun Buah): tanam bibit dalam baris × kolom sesuai pesanan; panen dihitung. Bukti: perkalian sebagai larik, pola.
- **Rinoya Resto** (sudah ada): tambah mapping saja — porsi (pecahan), harga menu, laba rugi harian.
- **Tangki Bahan Bakar** (Roket): isi 3/4 tangki dengan gelas ukur berbeda. Bukti: pecahan, volume.

### LITERASI
- **Komik Bercabang**: cerita yang jalan ceritanya dipilih anak; pilihan yang masuk akal hanya bisa diambil kalau paham bacaan. Bukti: pemahaman bacaan, kosakata.
- **Mantra Huruf**: tulis huruf dengan jari untuk "membuka" pintu/peti di dunia 3D. Bukti: bentuk huruf, motorik halus.
- **Radio Agam** (menyimak): dengar petunjuk suara, lakukan di dunia. Bukti: menyimak, kosakata Inggris. Bisa pakai Web Speech API untuk anak *mengucapkan* kata agar pintu terbuka (pengenalan suara sederhana, toleransi tinggi).

### KODING & LOGIKA
- Sudah kuat. Tambahkan **Detektif Bug** dan **Studio Animasi** yang sudah di katalog. Mapping ke kompetensi urutan/perulangan/kondisi/fungsi langsung dari `koding-*`.

### DUNIA & BUDAYA
- **Kapal Nusantara**: berlayar antar provinsi, muat barang khas satu daerah, jual di daerah lain (ini juga matematika uang). Tiap pelabuhan: rumah adat, makanan, lagu. Bukti: peta, provinsi, budaya.
- **Paspor Dunia**: stempel paspor dengan menebak bendera dari *petunjuk visual* di bandara (bukan pilihan ganda). 

### KARAKTER & AGAMA
- **Hari Agam**: jalani satu hari — bangun, makan, keluar rumah, naik kendaraan, tidur. Di tiap momen anak memilih doa yang tepat dari rak, lalu *mengucapkan* bersama. Situasional, bukan kuis.
- **Teman Perasaan**: karakter lain menunjukkan ekspresi/situasi, anak memilih respons; dunia bereaksi (teman tersenyum/menjauh). Bukti: mengenal emosi, empati.

### Mekanik lintas jalur yang layak dipakai ulang
simulasi/tycoon · eksplorasi + koleksi · membangun dengan batasan · peran/profesi · cerita bercabang · menelusuri/menggambar · berbicara/menyimak · kooperatif keluarga (Ular Tangga sudah 2–6 pemain; **Misi Keluarga mingguan** satu papan untuk semua anggota).

## 9. Tahapan

**Fase 1 — fondasi (tanpa game baru)**
1. `src/lib/akademi/`: tipe, kurikulum L1–L3 untuk 3 jalur dulu (MATEMATIKA, KODING, SAINS), aturan mastery, helper `catatBukti`.
2. Migrasi `akademi_evidence`, `akademi_mastery`, `akademi_certificate` + RLS mengikuti pola `game_save`.
3. Pasang `catatBukti` di Coding Agam dan Kebun Buah (dua modul paling matang).
4. Dasbor orang tua versi awal: radar + daftar kompetensi + rekomendasi.

**Fase 2 — pangkat & sertifikat**
5. Lencana per track-level, upacara pangkat, PDF sertifikat + halaman publik `/sertifikat/<code>`.
6. Misi Puncak L1 (satu saja, lintas 3 jalur).

**Fase 3 — game baru**
7. Satu game per jalur yang belum punya: Komik Bercabang (LITERASI), Kapal Nusantara (DUNIA), Hari Agam (KARAKTER).
8. Lengkapi kurikulum L4–L6.

## 10. Risiko yang perlu disepakati

- **Volume konten.** 6 jalur × 6 level × ~8 kompetensi = ~290 kompetensi, tiap kompetensi butuh ≥ 2 konteks game. Mulai dari 3 jalur × 3 level supaya ada yang bisa diuji ke anak dalam hitungan minggu.
- **Over-gamification.** Stiker/lencana jangan diberi untuk sekadar membuka app. Hanya untuk bukti kompetensi.
- **Klaim standar.** Kata "mengacu pada", bukan "bersertifikat". Simpan kode acuan (`ref`) per kompetensi supaya bisa dipertanggungjawabkan.
- **Privasi anak.** Halaman sertifikat publik hanya nama depan + pangkat + kompetensi, tanpa foto dan tanpa nama keluarga kecuali orang tua mengizinkan.
