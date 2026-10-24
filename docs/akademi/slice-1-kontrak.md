# Slice 1 — Kontrak antar-bagian

Status: dikunci 24 Okt 2026. Semua bagian Slice 1 (mesin mekanik, paket konten, rekam jejak, presenter, portal) mengikuti kontrak ini. Perubahan kontrak = perbarui berkas ini dulu.

## 1. Skema paket (`packages/schema/src/paket.ts`)

Empat mekanik, tiap mekanik punya **mode**:

| Mekanik | Mode | Dipakai untuk |
|---|---|---|
| pilah | `kelompok` (seret item ke bin), `pilih` (sentuh satu pilihan benar dari `pilihan[]`) | warna, bentuk, rak angka, uang, piktogram; lebih banyak / besar / panjang |
| urutkan | `susun`, `perbaiki` (satu pasang tertukar, tukar tepat sekali), `dulu` (2 gambar, sentuh yang lebih dulu) | urutan kegiatan, debug urutan, seriasi panjang, lanjut hitungan |
| dagang | `ambil`, `hitung`, `subitasi`, `bayar`, `kembalian`, `tukar`, `gabung`, `sisa`, `lengkapi` | bilangan 1–20, uang, tambah-kurang |
| navigasi | `execMode` langsung / program / langkah; `debug`; `semuaGrid`; `prediksi`; perintah maju/lompat/kiri/kanan/ulangi/kalau/bendera | semua kompetensi KODE navigasi |

Visual tanpa aset: `emoji`, `color`, `scale`, `count`, `shape`, `width` pada item/bin/step/good. Presenter 2D menggambar dari sini; `assetId` opsional untuk gambar sungguhan nanti.

Semua paket ada di `content/paket/<mekanik>/<id>.json`, lolos `npm run -s akademi:validate` (0 error), `competencyIds` harus ada di `content/kurikulum`.

## 2. Mesin mekanik (`packages/mechanics/src`)

Logika murni. Tipe di `types.ts`. Fungsi yang **wajib ada** (nama pasti):

```ts
// rng.ts
export function rng(seed: number): () => number;           // mulberry32, deterministik
export function acak<T>(arr: T[], r: () => number): T[];  // Fisher–Yates, salinan baru
export function knobDefaults(paket: ContentPack): Knobs;  // default tiap knob

// pilah.ts
export function buatRondePilah(p: PaketPilah, knobs: Knobs, seed: number): RondePilah;
export function nilaiPilah(r: RondePilah, j: JawabanPilah): Hasil;
//   knob yang dihormati: binCount, itemCount, maxCount (bin dengan angka > maxCount disembunyikan)

// urutkan.ts
export function buatRondeUrutkan(p: PaketUrutkan, knobs: Knobs, seed: number): RondeUrutkan;
export function nilaiUrutkan(r: RondeUrutkan, j: JawabanUrutkan): Hasil;
//   knob: steps (jumlah langkah tampil; ambil sequence yang cukup panjang, potong dari depan)
//   detail: { swaps?: number } untuk perbaiki (jumlah pertukaran yang dibutuhkan dari shown → jawaban; benar hanya bila 1)

// dagang.ts
export function buatRondeDagang(p: PaketDagang, knobs: Knobs, seed: number): RondeDagang;
export function nilaiDagang(r: RondeDagang, j: JawabanDagang): Hasil;
//   knob: itemsMax, kinds, maxCount, harga (ribuan), pengurang, dll — nama knob dibaca kalau ada, kalau tidak pakai customerRule
//   bayar: benar bila jumlah uang == harga (payExact) ; kembalian: jumlah == dibayar - harga ; tukar: jumlah koin == dibayar
//   lengkapi: uang yang ditambah == harga - dibayar, detail.latencyMs disimpan; subitasi: detail.latencyMs disimpan
//   hitung: angka == target dan (bila disentuh ada) tiap benda disentuh tepat sekali → detail.disentuhGanda

// navigasi.ts
export function jalankan(grid: NavGrid, program: NavBlock[], opts?: { stopAtFlag?: boolean }): NavRun;
//   semantik docs/akademi/mekanik-navigasi.md: maju 1 petak (dinding/batu/luar grid = tabrak/tersandung, berhenti);
//   lompat 2 petak (petak di depan boleh batu; petak tujuan harus bukan dinding/batu/luar grid, kalau tidak = tabrak);
//   kiri/kanan putar 90°; ulangi n × body; kalau = batu di depan ? lompat : maju; bendera = kind flag (stopAtFlag → outcome bendera)
//   sampai goal di tengah program = outcome "bintang" (berhenti). Program habis belum di goal = "meleset". Program kosong = "kosong".
export function optimal(grid: NavGrid, commands: NavCommand[]): number | null;   // BFS blok dasar (maju/lompat/kiri/kanan), tanpa ulangi
export function hitungBlok(program: NavBlock[]): number;                          // jumlah keping di rak (ulangi = 1 keping + isinya)
export function buatRondeNavigasi(p: PaketNavigasi, knobs: Knobs, seed: number): RondeNavigasi;
//   knob: distance → pilih grid dengan optimal == distance (kalau ada), rocks → grid dengan rocks.length == knob, dll; default: acak
export function nilaiNavigasi(r: RondeNavigasi, j: JawabanNavigasi): Hasil;
//   benar = semua grid outcome "bintang" (langsung: jalankan j.langsung), dan bila debug: edits == fixes, dan bila rackSlots: hitungBlok ≤ rackSlots
//   detail: { outcome, blocks, optimal, efisien: blocks<=optimal, lompat, batu, edits, runs, prediksiBenar, prediksiTotal }

// index.ts
export * from "./types"; export * from "./rng"; dst.
export function buatRonde(p: ContentPack, knobs: Knobs, seed: number): Ronde;   // union diskriminasi lewat p.mechanic
export function nilai(p: ContentPack, r: Ronde, j: Jawaban): Hasil;
```

Tes vitest di `packages/mechanics/test/*.test.ts`, termasuk jalankan() untuk semua kasus di mekanik-navigasi.md (lompat meleset, tersandung, ulangi, kalau 3 jalur, bendera).

## 3. Rekam jejak (`src/lib/akademi/`)

```ts
// jejak.ts — event append-only per anak
export function catatEvent(e: Omit<GameEvent, "id" | "clientAt">): GameEvent;   // simpan ke antrean lokal, jadwalkan kirim
export function eventsAnak(learnerId: string): GameEvent[];                     // dari cache lokal (server + lokal digabung)
export async function tarikEvents(familyId: string, memberIds: string[]): Promise<void>; // dipanggil loadFamily
export function useEvents(learnerId: string): GameEvent[];                      // hook, ikut berubah saat tarik/catat

// mastery.ts — proyeksi murni
export type Status = "belum" | "berkembang" | "dikuasai";
export interface Penguasaan { status: Status; success: number; fail: number; contexts: number; days: number; ratioLast10: number; lastAt?: string; hintTail: number }
export function proyeksi(events: GameEvent[], kompetensi: Competency[]): Record<string, Penguasaan>;
//   konteks = activityId berbeda; hari = tanggal lokal clientAt berbeda; aturan DEFAULT_MASTERY + override c.mastery

// konten.ts — katalog yang dipakai UI
export const KOMPETENSI: Competency[];   // gabungan content/kurikulum/*.json
export const PAKET: ContentPack[];       // gabungan content/paket/**/*.json
export function paketUntuk(competencyId: string): ContentPack[];
export function kompetensiUntuk(paketId: string): Competency[];
//   dihasilkan scripts/akademi-index.ts → src/lib/akademi/katalog.generated.ts (impor JSON langsung, diparse zod saat tes)

// misi.ts — "Hari ini": 3 misi adaptif
export function pilihMisi(learnerId: string, events: GameEvent[], level: LevelId): ContentPack[];
//   urutan: kompetensi "berkembang" yang paling lama tidak dilatih → "belum" yang prasyaratnya sudah "berkembang"/"dikuasai" → review "dikuasai" terlama
```

Supabase: tabel `learner_event` (migration `supabase/migrations/2026102410xxxx_rumila_learner_event.sql`), kolom `id uuid pk, family_id, member_id, session_id, activity_id text, mechanic text, type text, payload jsonb, client_at timestamptz, created_at`. RLS sama pola `game_save`. Insert idempoten (`upsert` onConflict id, ignoreDuplicates). Antrean lokal: `localStorage["rumila-akademi-antrean"]`, kirim saat online & saat `visibilitychange hidden`.

Learner = `member` rumila (id UUID). Level anak: dari `localStorage["rumila-akademi-level-<memberId>"]` default `PAUD`, dipilih wali di Rapor (disinkron via `game_save` dengan kunci `rumila-akademi-<memberId>`).

## 4. Presenter & runner (`src/components/akademi/`)

```ts
interface PresenterProps<R, J> {
  paket: ContentPack; ronde: R; t: (key: string) => string;   // t = locale.id[key] (en menyusul)
  onJawab: (j: J) => void;      // sekali per ronde; runner memanggil nilai() lalu memberi umpan balik
  onHint?: () => void;          // anak minta bantuan (dicatat event hint)
  hasil: Hasil | null;          // null = belum dijawab; terisi = tampilkan umpan balik (benar/salah) lalu runner lanjut ronde berikutnya
}
```

Runner (`ActivityRunner`): muat paket by id → knobs default (naik 1 step tiap 2 ronde benar beruntun, turun 1 step setelah 2 salah) → seed = hash(learnerId, paketId, index) → `buatRonde` → presenter → `nilai` → `catatEvent(attempt)` → ulang `paket.rounds` kali → layar selesai (stiker, `activity_end`). Instruksi dibacakan via `speechSynthesis` id-ID (`ucapkan()` di `src/lib/akademi/suara.ts`), diputar ulang saat tombol speaker ditekan.

Rute: `/akademi` (Hari ini + Pelajaran), `/akademi/pelajaran/[track]`, `/akademi/main/[paketId]`, `/akademi/rapor` (wali). Izin: folder `edukasi`.

## 5. Tambahan 24 Okt 2026: mekanik `pola` dan `simulasi`

Skema di `packages/schema/src/paket.ts` (`PaketPola`, `PaketSimulasi`), tipe ronde/jawaban di `packages/mechanics/src/types.ts` (`RondePola`, `JawabanPola`, `RondeSimulasi`, `JawabanSimulasi`).

```ts
// pola.ts
export function buatRondePola(p: PaketPola, knobs: Knobs, seed: number): RondePola;
//   knob: shown (ulangan penuh yang ditampilkan, default 3), blanks (slot kosong 1–3), distractor (0/1 pengecoh di palette), slots (cipta: 4–9)
//   lanjut: correct = unit diulang `shown` kali + blanks slot; shown = correct dengan `blanks` terakhir = null; palette = unit + pengecoh (acak)
//   perbaiki: correct 8 unsur; wrongIndex (knob posisi: tengah dulu) diganti benda lain; shown lengkap; palette = semua
//   cipta: shown = null × slots; pilih = unitLen; palette = items (≥4)
export function nilaiPola(r: RondePola, j: JawabanPola): Hasil;
//   lanjut: j == correct (detail { salah: indeks[] }) · perbaiki: j == correct && tepat satu posisi berbeda dari shown (detail { diubah })
//   cipta: panjang == shown.length, memakai tepat unitLen benda berbeda, dan j[i] == j[i % unitLen] untuk semua i (periodik), minimal 2 ulangan penuh

// simulasi.ts
export function buatRondeSimulasi(p: PaketSimulasi, knobs: Knobs, seed: number): RondeSimulasi;
//   jam-baca: target = jam acak 1..knob.hourMax (default 6); options = 3–4 jam termasuk target
//   jam-putar: ambil item role kegiatan acak → target = value, correctId = id
//   timbangan: dua item role benda dengan value (berat) berbeda; correctId = yang lebih berat; knob tipuan=1 → pilih pasangan besar-ringan bila ada (scale besar, value kecil)
//   jengkal: item benda dengan value panjang ≤ knob.maxSpans; target = value; snap = knob.snap==1
//   kubus: target = value; offset = knob.offset (0/1)
//   turus: urutan = knob.count hewan acak dari role hewan (knob.kinds jenis); flashMs = knob.gapMs
//   taksir: target = acak 8..knob.max (≤20); flashMs = knob.flashMs; options = [0, 20]
//   tombol: peta acak tombol→alat (knob.pairs 2–3); urutan = tombol yang diuji (semua, diacak)
//   alat: satu hewan role hewan (value 1 = panjang, 2 = berat); correctId = alat ("penggaris-kubus" | "timbangan" dari items role alat)
//   bagi: target = 2/4/6/8 (knob.max) benda
export function nilaiSimulasi(r: RondeSimulasi, j: JawabanSimulasi): Hasil;
//   jam-baca/jam-putar/kubus: angka == target · taksir: |angka − target| ≤ 3 (detail selisih) · timbangan/alat: pilih == correctId
//   jengkal: angka == target dan posisi terurut, |posisi[i+1] − posisi[i] − 1| ≤ 0.2 (tanpa celah/tumpang tindih) dan posisi.length == target; detail { celah, tumpang }
//   turus: turus[id] == jumlah id di urutan untuk tiap jenis · tombol: tebakan[t] == peta[t] untuk semua t di urutan · bagi: kiri == kanan && kiri + kanan == target
```

### Mode pengaya (24 Okt 2026, tanpa mekanik baru)

```ts
// simulasi.ts — tiga mode tambahan di SIMULASI_MODES
//   menara (MAT.TKA.BENTUK-RUANG.02): items role benda ber-value: 1 = bisa ditumpuk (🧊📦📕), 0 = menggelinding (⚽🏀🎾), 2 = tabung 🥫 (bisa bila tegak:
//     penemuan, dihitung bisa). target = knob.tinggi (default 4); items = knob.benda (default 5–6 acak) dijamin ≥ target benda bisa & ≥ 1 bola.
//     Jawaban { tumpukan: string[] } (id dari bawah). Benar bila tumpukan.length == target dan semua value ≠ 0 (tanpa benda ganda);
//     detail { jatuhDi: indeks bola pertama | null, tinggi, target, tabung }.
//   bantuan (KODE.PAUD.SEBAB-AKIBAT.02): items role alat (🚰💡🚪); satu dipilih acak sebagai "macet" → correctId; target = knob.batas (default 5).
//     Jawaban { ketukanSiaSia: number; mintaTolong: boolean }; benar bila mintaTolong && ketukanSiaSia ≤ target; detail { ketukanSiaSia, mintaTolong, batas, macet }.
//     Presenter: tombol "Tolong 🙋" tampil tetap, tidak berkedip, tidak dipandu (tanpa tombol bantu); >batas tetap bisa minta tolong (dicatat belum).
//   telusur (MAT.TKA.BILANGAN-1-10.04): target = angka acak 1..knob.max (≤5); offset = knob.panah (default 1 = panah urutan goresan tampil); snap tak dipakai.
//     Jawaban { angka; cakupan; keluar } dihitung presenter: cakupan = rasio titik sampel jalur (tiap ~6 satuan viewBox 100×140) yang tersentuh dalam
//     toleransi ±25% tinggi angka; keluar = rasio sampel jari di luar toleransi. Benar bila angka == target && cakupan ≥ 0.85 && keluar ≤ 0.25
//     (TELUSUR_CAKUPAN_MIN / TELUSUR_KELUAR_MAX); detail { angka, target, cakupan, keluar, panah }. Hasil benar → peti 🧰 terbuka ✨.

// urutkan.ts — mode `label` (KODE.TKA.URUTAN.02)
export function labelUrutan(n: number): LabelUrutan[];   // ["pertama", "lalu" × (n−2), "terakhir"]
//   buatRondeUrutkan: shown = langkah urut benar (tidak diacak), knob steps 3 → 4 (4 = dua "lalu"); RondeUrutkan.labels = labelUrutan(n).
//   Jawaban { labels: string[] } (ditambahkan ke union JawabanUrutkan). Benar bila sama persis dengan ronde.labels;
//   detail { salah: indeks[], terputusDi: indeks "terakhir" yang dipasang sebelum gambar terakhir | null }.
//   Presenter: palet label = ikon + suara (🥇 pertama, ➡️ lalu, 🏁 terakhir; "lalu" 2 keping bila 4 gambar); tombol "Ceritakan ▶" → narasi
//   `ucapkan` mengikuti label yang dipasang; "terakhir" di gambar ke-2 menghentikan cerita dan gambar sisanya meredup; lalu onJawab({ labels }).
```

`index.ts`: tambah `{ mechanic: "pola"; ronde: RondePola }` dan `{ mechanic: "simulasi"; ronde: RondeSimulasi }` ke `Ronde`, jawaban ke `Jawaban`, cabang di `buatRonde`/`nilai`. Presenter: `src/components/akademi/pola.tsx` (`PresenterPola`) dan `simulasi.tsx` (`PresenterSimulasi`), dipasang runner.
