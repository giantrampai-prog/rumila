# Kids Academy — Arsitektur Dari Nol

Status: draf diskusi, 24 Okt 2026. Tidak terikat kode rumila yang ada; rumila dipandang sebagai prototipe dunia & aset yang nanti bisa dipindahkan ke arsitektur ini.

## 0. Sepuluh keputusan inti

1. **Graf kompetensi, bukan kursus.** Kurikulum adalah DAG kompetensi dengan prasyarat. Level hanyalah *pita* (band) di atas graf. Anak bisa Level 3 di Matematika dan Level 2 di Literasi sekaligus.
2. **Mekanik = kode, konten = data.** Sekitar 12 mekanik game yang dibangun sekali, dikawinkan dengan ratusan paket konten. Bukan 100 game bespoke.
3. **Rekam jejak belajar event-sourced.** Kejadian (event) adalah sumber kebenaran, append-only. Penguasaan, level, lencana adalah *proyeksi* yang bisa dihitung ulang kapan pun aturan berubah.
4. **Standar internasional sebagai tabel crosswalk.** Satu kompetensi bisa dipetakan ke Cambridge, Common Core, CEFR, EYFS. Laporan bisa dicetak "menurut standar X" tanpa mengubah kurikulum.
5. **Dwibahasa sejak hari pertama.** Setiap string konten punya `id` dan `en`. Itu makna praktis dari "berstandar internasional" di mata orang tua.
6. **Adaptif lewat parameter, bukan level buatan tangan.** Setiap aktivitas punya knob kesulitan (jumlah objek, waktu, distraktor, langkah). Mesin memilih knob berdasarkan zona belajar anak.
7. **Offline-first.** Anak main di HP tanpa sinyal; event diantre dan disinkron. Paket konten di-cache.
8. **Tenant ganda: keluarga dan sekolah.** Model data dari hari pertama mendukung guru dan kelas, meski fase awal cuma keluarga.
9. **Sertifikat tertanda tangan dan terverifikasi publik.** Kode unik, QR, halaman verifikasi, snapshot kompetensi beku.
10. **Studio konten adalah produk kedua, bukan nanti-nanti.** Botol lehernya konten. Studio dengan bantuan AI + review manusia dibangun paralel.

## 1. Lapisan arsitektur

```
┌──────────────────────────────────────────────────────────────┐
│  PENGALAMAN   Dunia & cerita · Quest · Aktivitas · Pangkat   │  ← apa yang anak lihat
├──────────────────────────────────────────────────────────────┤
│  PEDAGOGI     Graf kompetensi · Crosswalk standar · Aturan   │  ← apa yang diukur
│               penguasaan · Pemilih aktivitas (adaptif)       │
├──────────────────────────────────────────────────────────────┤
│  RUNTIME      Mesin mekanik (12) · Engine 2D/3D · Audio ·    │  ← bagaimana dimainkan
│               Input anak · Telemetri                         │
├──────────────────────────────────────────────────────────────┤
│  REKAM JEJAK  Event store → Proyeksi (mastery, progres,      │  ← apa yang tersimpan
│               lencana, sertifikat) → Laporan                 │
├──────────────────────────────────────────────────────────────┤
│  PLATFORM     Identitas & tenant · Konten CDN · Sinkron      │
│               offline · Studio konten · Verifikasi publik    │
└──────────────────────────────────────────────────────────────┘
```

Aturan ketergantungan: lapisan atas boleh tahu lapisan bawah, tidak sebaliknya. Mekanik tidak tahu kompetensi. Kompetensi tidak tahu mekanik. Yang menyambungkan hanya **tag** di paket konten.

## 2. Lapisan pedagogi

### 2.1 Graf kompetensi

```ts
interface Competency {
  id: string;                 // "MAT.NUM.COUNT_TO_20" — semantik, stabil selamanya
  track: 'SAINS'|'MAT'|'LIT'|'KODE'|'DUNIA'|'KARAKTER';
  band: 1|2|3|4|5|6;          // pita level
  statement: { id: string; en: string };   // "Aku bisa menghitung sampai 20"
  prereq: string[];           // id kompetensi lain
  depth: ('kenal'|'pakai'|'cipta')[];      // tingkat yang diminta untuk dikuasai
  core: boolean;              // wajib untuk pangkat
  mastery?: Partial<MasteryRule>;          // override aturan default
}
```

### 2.2 Crosswalk standar

```ts
interface StandardRef { competencyId: string; framework: 'CAMBRIDGE_PRIMARY'|'CAMBRIDGE_EY'|'COMMON_CORE'|'CEFR'|'EYFS'|'KURMER'; code: string; note?: string }
```

Disimpan sebagai data terpisah dari kompetensi. Menambah kerangka baru (misal Kurikulum Merdeka) = menambah baris, bukan mengubah graf.

### 2.3 Aturan penguasaan

Dua tingkat:
- **Default berbasis aturan** (mudah dijelaskan ke orang tua): ≥3 sukses, ≥2 mekanik berbeda, ≥2 hari berbeda, rasio 10 bukti terakhir ≥0,7, tanpa bantuan di 2 bukti terakhir.
- **Opsional Bayesian Knowledge Tracing** per kompetensi untuk pemilih aktivitas (probabilitas tahu, 0–1). Dipakai untuk memilih aktivitas berikutnya, bukan untuk sertifikat. Sertifikat tetap pakai aturan yang bisa dijelaskan.

### 2.4 Pemilih aktivitas (adaptif)

Input: proyeksi mastery anak, graf prasyarat, riwayat 7 hari, durasi sesi target.
Output: 1 aktivitas + nilai knob kesulitan.
Heuristik: pilih kompetensi `berkembang` dengan prasyarat terpenuhi; pilih mekanik yang **belum** dipakai anak untuk kompetensi itu (memaksa variasi konteks); knob ditaruh sedikit di atas rata-rata keberhasilan terakhir (target ~75% sukses). Sisipkan 1 dari 5 aktivitas sebagai *review* kompetensi yang sudah dikuasai (spaced repetition).

## 3. Lapisan runtime: mekanik

Dua belas mekanik yang menutup hampir semua kompetensi usia 3–9. Masing-masing adalah modul murni (logika + tes) dengan presenter 2D/3D terpisah.

| # | Mekanik | Apa yang anak lakukan | Contoh kompetensi |
|---|---|---|---|
| 1 | **Pilah** (sort/classify) | seret objek ke wadah menurut ciri | klasifikasi hewan, warna, bentuk, huruf vokal |
| 2 | **Urutkan** (sequence) | susun kartu/langkah dalam urutan benar | siklus hidup, urutan kegiatan, algoritma |
| 3 | **Bangun** (build w/ constraints) | rakit dari komponen dengan batasan | roket massa vs dorong, bangun datar, kalimat |
| 4 | **Dagang** (trade/economy) | beli, jual, timbang, kembalian | uang, bilangan, ukuran, provinsi |
| 5 | **Navigasi** (navigate) | gerakkan tokoh di grid/peta | arah, koordinat, koding langkah, peta Indonesia |
| 6 | **Simulasi** (tune & observe) | putar knob, lihat akibat | orbit, rantai makanan, campuran warna, resto |
| 7 | **Cerita bercabang** | pilih jalan cerita berdasar bacaan/situasi | pemahaman bacaan, emosi, doa situasional |
| 8 | **Telusur** (trace) | gambar bentuk/huruf dengan jari | huruf, angka, bentuk, motorik halus |
| 9 | **Ucap & dengar** | dengarkan instruksi, ucapkan kata | menyimak, kosakata Inggris, hafalan doa |
| 10 | **Cari & kumpulkan** | temukan objek tersembunyi di dunia, katalogkan | eksplorasi sains, kosakata, pengamatan |
| 11 | **Pola & ritme** | lengkapi pola visual/bunyi, ketuk irama | pola, perulangan, musik |
| 12 | **Rawat** (care sim) | pasien/tanaman/hewan datang; diagnosa & tindakan | tubuh & kesehatan, tumbuhan, empati |

Kontrak mekanik:

```ts
interface Mechanic<P, S> {
  id: MechanicId;
  knobs: KnobSchema;                       // parameter kesulitan yang bisa diatur mesin adaptif
  init(pack: ContentPack, knobs: P, seed: number): S;
  step(state: S, input: KidInput): { state: S; events: GameEvent[] };
  isDone(state: S): Outcome | null;
}
```

Mekanik mengeluarkan `GameEvent` semantik: `{ type: 'attempt', itemId, correct, hintUsed, latencyMs }`. Bukan "klik di x,y".

### 3.1 Aktivitas dan paket konten

```ts
interface Activity {
  id: string;
  mechanic: MechanicId;
  pack: string;                            // id ContentPack
  competencies: { id: string; depth: 'kenal'|'pakai'|'cipta'; weight: number }[];
  knobDefaults: Record<string, number>;
  world?: WorldId;                         // di dunia 3D mana aktivitas ini muncul
  minutes: number;
}

interface ContentPack {
  id: string; version: string;             // semver, dipublikasikan ke CDN
  mechanic: MechanicId;
  locale: { id: Strings; en: Strings };
  items: Item[];                           // objek, kartu, pertanyaan situasi, dsb.
  assets: AssetRef[];                      // glTF, audio, gambar — hash-addressed
}
```

### 3.2 Narasi

```
World (Laut, Angkasa, Bumi, Pasar, Rumah Agam…)
  └─ Quest (cerita 10–15 menit, 3–6 Activity, syarat band)
       └─ Activity
Capstone = Quest khusus lintas track, syarat naik pangkat
```

Dunia dan quest adalah **konten**, bukan kode. Engine dunia 3D satu, dunia berbeda = scene pack berbeda.

## 4. Lapisan rekam jejak (event-sourced)

### 4.1 Event

```sql
create table learner_event (
  id          uuid primary key,              -- dibuat di klien (idempoten saat sinkron ulang)
  tenant_id   uuid not null,
  learner_id  uuid not null,
  session_id  uuid not null,
  activity_id text not null,
  mechanic    text not null,
  type        text not null,                 -- 'activity_start'|'attempt'|'hint'|'activity_end'|'quest_end'
  payload     jsonb not null,                -- itemId, correct, latencyMs, knobs, seed…
  client_at   timestamptz not null,
  server_at   timestamptz not null default now()
);
```
Tidak pernah di-update atau dihapus. Pemetaan aktivitas → kompetensi **tidak** disimpan di event; dilakukan saat proyeksi, sehingga kalau pemetaan direvisi, proyeksi dihitung ulang dan semua anak langsung terkoreksi.

### 4.2 Proyeksi

| Proyeksi | Isi | Dihitung oleh |
|---|---|---|
| `mastery` | per learner × competency: status, p_know, bukti terakhir | fungsi murni di `packages/mastery`, dijalankan edge function per batch event |
| `progress` | per learner × track: band aktif, % core dikuasai | turunan dari mastery |
| `reward` | stiker/lencana/pangkat | turunan dari progress + capstone |
| `certificate` | baris beku (snapshot) + PDF | hanya ditulis sekali, tak pernah dihitung ulang |

Semua proyeksi kecuali `certificate` bisa dihapus dan dibangun ulang dari event. Ini syarat agar kurikulum boleh berevolusi.

### 4.3 Sertifikat

- `code` 10 karakter, URL publik `/verify/<code>`.
- `snapshot` berisi nama depan, pangkat, track, band, daftar kompetensi + kode standar acuan, versi kurikulum, tanggal.
- Ditandatangani (Ed25519) oleh server; tanda tangan ikut di PDF dan halaman verifikasi.
- Tiga jenis: Lencana Track×Band (otomatis), Sertifikat Pangkat (butuh capstone), Rapor Semester (laporan, bukan prestasi).

## 5. Lapisan platform

### 5.1 Identitas & tenant

```
tenant (type: family | school)
  ├─ guardian (akun login: orang tua / guru)      ← punya email, auth
  ├─ learner  (profil anak, tanpa email, PIN/avatar)
  └─ group    (kelas; untuk family = 1 grup implisit)
```
Anak tidak pernah punya akun auth. Semua akses anak lewat sesi perangkat yang dibuka wali. RLS per tenant. Ini sekaligus memenuhi pola COPPA/GDPR-K.

### 5.2 Konten & distribusi

- Paket konten dan aset dipublikasikan ke bucket/CDN sebagai berkas statis beraddress hash (immutable, cache selamanya).
- `manifest.json` per versi kurikulum menunjuk paket mana yang aktif. Klien unduh manifest, lalu paket yang dibutuhkan, simpan di IndexedDB.
- Database **tidak** menyimpan konten. Hanya data learner dan metadata publikasi.

### 5.3 Sinkron offline

Klien menulis event ke antrean lokal (IndexedDB) → kirim batch saat online → server upsert by `id` (idempoten) → proyeksi diperbarui → klien tarik proyeksi terbaru. Konflik tidak ada karena event append-only.

### 5.4 Studio konten

Aplikasi internal terpisah:
- Editor graf kompetensi + crosswalk.
- Editor paket konten per mekanik (form yang mengikuti `KnobSchema` dan skema item mekanik), preview langsung dengan mekanik asli.
- Generator berbantuan AI: dari satu kompetensi → draft item untuk 3 mekanik + terjemahan `en` → antre review.
- Alur: draft → review pedagogi → uji coba (A/B kecil ke tenant internal) → publikasi (bump versi manifest).
- Laporan kesehatan konten: kompetensi yang < 2 mekanik, item dengan tingkat sukses < 30% atau > 95% (terlalu sukar / terlalu mudah).

## 6. Struktur repositori (monorepo)

```
apps/
  kid/        PWA untuk anak (dunia, quest, aktivitas) — Next.js, offline-first
  guardian/   dasbor orang tua & guru (bisa satu app dengan kid, route terpisah)
  studio/     studio konten (internal)
  verify/     halaman verifikasi sertifikat (statis, Cloudflare Worker)
packages/
  curriculum/ skema kompetensi, crosswalk, validator, manifest builder
  mechanics/  12 mekanik: logika murni + tes, tanpa React/Three
  engine/     runtime 2D/3D: scene, kamera, audio, input anak, presenter per mekanik
  mastery/    fungsi murni event → mastery/progress/reward; BKT opsional
  schema/     tipe bersama + zod: ContentPack, Activity, GameEvent
  ui/         komponen & token desain
supabase/
  migrations/ learner_event, proyeksi, tenant, certificate
  functions/  project-mastery, issue-certificate, publish-manifest
content/
  packs/      sumber paket konten (git), dibangun ke CDN oleh CI
  worlds/     scene pack dunia 3D
```

Stack yang gue pilih kalau dari nol: TypeScript end-to-end, Next.js PWA, Three.js untuk dunia (aset glTF yang sudah ada bisa dipakai ulang), Supabase (Postgres + Auth + Storage + Edge Functions), Cloudflare R2/CDN untuk paket konten, Cloudflare Worker untuk verifikasi. Capacitor kalau nanti perlu masuk App Store/Play Store tanpa menulis ulang.

## 7. Hubungan dengan rumila sekarang

- Rumila dulu *family launcher* (doa, ibadah, keluarga, keuangan, kesehatan). Produk baru ini **Rumila Kids Academy**; modul non-akademi keluar dari produk (aplikasi terpisah atau dipensiunkan).
- Yang dipindahkan ke akademi: aset 3D dan scene (Laut, Angkasa, Roket, Tubuh, Buah, Bumi) sebagai `content/worlds`, logika Coding Agam sebagai mekanik Navigasi/Urutkan/Pola, Resto sebagai mekanik Dagang/Simulasi.
- Yang ditinggalkan: pola "satu tool = satu komponen bespoke dengan progres JSON sendiri".

## 8. Urutan bangun (vertical slice dulu)

1. **Slice 1 (4–6 minggu):** `schema` + `curriculum` (MAT band 1–2, 20 kompetensi) + 3 mekanik (Pilah, Urutkan, Dagang) 2D saja + `learner_event` + proyeksi mastery + dasbor wali sederhana. Satu dunia 2D "Pasar". Tujuan: satu anak bisa main 2 minggu dan orang tua lihat kompetensi bergerak.
2. **Slice 2:** adaptif + offline + 3 mekanik lagi (Navigasi, Cerita, Telusur) + LIT & KODE band 1–2.
3. **Slice 3:** lencana, pangkat, capstone, sertifikat + verifikasi.
4. **Slice 4:** engine 3D + migrasi dunia rumila sebagai scene pack + mekanik Simulasi, Cari & kumpulkan, Rawat.
5. **Slice 5:** studio konten + AI draft + tenant sekolah.

Prinsip: tiap slice harus bisa dimainkan anak sungguhan. Jangan bangun 12 mekanik dulu baru cari anak.
