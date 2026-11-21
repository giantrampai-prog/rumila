# Perbaikan kode dari audit QC (MAT PAUD–TK)

Tidak ada berkas content/ yang diubah. Hasil akhir: tsc bersih (di luar galat lama .next/types beranda/[folder]), eslint bersih, vitest src/lib/akademi + packages 207/207 lulus, akademi:audit **0 ERROR** (18 WARNING: instruksi-kembar/terlalu-panjang, sudah ada sebelumnya).
Belum dicek visual di peramban.

## 1. benda.tsx: `color` diabaikan bila item punya emoji
- Terbukti: ya. Cabang emoji di `Benda` tidak membaca `v.color`.
- Perubahan: `VisualSpec.latar?: boolean` baru. Kalau emoji + color dan (latar === true, atau emojinya ada di set konteks), emoji digambar di atas petak bulat-sudut berwarna `color`, dengan cincin putih tipis. Emojinya diperkecil 0,78×.
  Set konteks dibuat oleh `LatarWarnaProvider` + `emojiBedaWarna(paket)`: hanya emoji yang dalam satu paket muncul dengan ≥ 2 warna berbeda. Item lain yang punya emoji + color (warna cuma hiasan) tampil seperti dulu.
  Paket yang terdampak (21): celengan-pecahan-uang 🪙, laci-uang-warung 💵, mesin-tukar-koin, tukar-uang-bank-mini, sains-layu-atau-segar, sains-pot-mana-yang-layu, sains-lemari-cuaca, sd2-sains-timbang-batu*, sd3-sains-kelompok-hewan*, sains-perbaiki-tanaman-tumbuh/tumbuhan-utuh, dll. Daftar lengkap bisa dibuat dengan `node scratchpad/beda.cjs`.
- dagang.tsx `visualUang`: semua 💵 diberi `latar: true` (warna per pecahan). Koin < 1000 jadi 🪙 berlatar perak (#cfd4dc); koin 1000 tetap emas tanpa latar.
- Provider dipasang di runner.tsx dan ujian.tsx, mengelilingi presenter.
- Catatan: kebun-bunga-warna dan kotak-mainan-warna tidak terdampak, karena emojinya berbeda-beda. Untuk paket itu warna font emoji tetap masalah isi (keputusan).
- Berkas: src/components/akademi/benda.tsx, dagang.tsx, runner.tsx, ujian.tsx.

## 2. dagang.tsx ModeSisa menulis mati ikan/kolam/pelet
- Terbukti: ya. Paket kue-piring-sisa, sd1-mat-panen-sisa-kebun, dan sd1-mat-sisa-kelereng-20 semuanya tampil sebagai ikan + pelet.
- Perubahan: ModeSisa memakai benda dari `ronde.tersedia` dan penanda dari `ronde.pesanan[0]` (sekarang diisi mesin, lihat 4). Nama dan gambar diambil dari paket (`nama()`/`visual()`).
  Tema per `paket.world`:
  - kolam: adegan lama. Teks dan visual identik untuk ikan-kolam-sisa.
  - toko-kue: "dibeli", tutup piring.
  - kebun: "dipetik", tutup daun.
  - lainnya: "diambil", kotak.
  Jawaban dikirim sebagai `keranjang: { [penanda]: n }`; penilaian tetap memakai total.
- Teks suara (teksUcap Pembeli, dibacakan lewat `ucapkan`):
  - kolam (TIDAK berubah untuk paket ikan): `Ada ${awal} ${benda} di kolam. ${diambil} ${benda} ditangkap. Beri makan ${benda} yang tersisa, satu ${penanda} untuk satu ${benda}.`
  - BARU, penanda beda dari benda: `Ada ${awal} ${benda}. ${diambil} ${benda} ${kerja}. Taruh ${penanda} sebanyak ${benda} yang tersisa, satu ${penanda} untuk satu ${benda}.`
    Contoh: "Ada 6 kue. 2 kue dibeli. Taruh lilin sebanyak kue yang tersisa, satu lilin untuk satu kue." dan "… Taruh kelereng kuning sebanyak kelereng yang tersisa, satu kelereng kuning untuk satu kelereng."
  - BARU, penanda = benda: `Ada ${awal} ${benda}. ${diambil} ${benda} ${kerja}. Taruh ${benda} sebanyak yang tersisa.`
    Contoh: "Ada 9 wortel. 3 wortel dipetik. Taruh wortel sebanyak yang tersisa."
  - kerja ∈ {ditangkap (kolam), dibeli (toko-kue), dipetik (kebun), diambil (lainnya)}.
  - Teks tampil (bukan suara) yang baru: "{ikon} Berapa {benda} tersisa?", "Ketuk untuk menaruh {penanda}", label tombol "Selesai" (non-kolam).
  - Kalimat baru ini belum punya rekaman pra-rekam. Seperti modus lain, kalimatnya bahasa Indonesia; nama barang dari t().
- Berkas: src/components/akademi/dagang.tsx.

## 3. simulasi.ts timbangan: tipuan=0 tetap memunculkan pasangan tipuan
- Terbukti: ya. Kolam pasangan saat tipuan=0 berisi semua pasangan.
- Perubahan:
  - tipuan=0: hanya pasangan biasa. Kalau paket hanya punya pasangan tipuan, jatuh kembali ke semua pasangan.
  - tipuan=1: tetap.
  - Paket tanpa knob tipuan: semua pasangan (perilaku lama).
  - Keempat paket timbangan (jungkat-jungkit-berat, timbangan-pasar-buah, sd2-sains-timbang-batu-koleksi, sd2-sains-timbang-batuan) mendeklarasikan knob ini dengan default 0, jadi keempatnya kini tanpa pasangan tipuan di tingkat awal.
- Tes: pola-simulasi.test.ts "timbangan: tipuan=0 tidak pernah memunculkan pasangan tipuan…".

## 4. dagang.ts
### gabung tidak membaca itemsMax
- Terbukti: ya (a acak 1..batas-1).
- Perubahan: tiap kelompok ∈ [customerRule.itemsMin, knob itemsMax ?? customerRule.itemsMax], dan a + b ≤ target.
  - gabung-bebek-kolam / gabung-keranjang-buah: default 2+2..3+3, naik sampai 6+4.
  - sd1-mat-gabung-* (tanpa knob itemsMax, rule.itemsMax 10): tiap kelompok kini ≤ 10 (dulu bisa 13 + 1). Ini sesuai customerRule.
- Tes: mekanik.test.ts "gabung: tiap kelompok di [itemsMin, itemsMax]…".
### sisa membaca maxCount, bukan itemsMax; benda utama bisa "pelet"
- Terbukti: ya.
- Perubahan:
  - Batas = knob maxCount ?? knob itemsMax ?? rule.target. Paket SD (maxCount) tidak berubah.
  - Batas bawah awal tetap 2, bukan itemsMin 5: [5,7] × pengurang 1–2 hanya 6 soal sehingga audit soal-berulang ERROR. Keputusan isi: kalau mau awal ≥ 5, naikkan default itemsMax atau pengurang di JSON.
  - Paket dengan tepat dua barang = [benda, penanda] (ikan+pelet, kue+lilin, kelereng+kancing "kelereng kuning"). Lainnya: benda diundi, penanda = benda.
  - Mesin mengisi `pesanan = [{goodId: penanda, qty: sisa}]`.
  - Efek: sd1-mat-sisa-kelereng-20 kini selalu kelereng 🔵 dengan penanda kelereng kuning 🟡 (dulu diundi, dan tampil sebagai ikan).
- Tes: mekanik.test.ts "sisa: awal di [2, knob itemsMax|maxCount]; dua barang = benda + penanda".
### bayar/kembalian mengabaikan price barang
- Terbukti: ya, untuk 6 paket TK ber-knob harga (bayar-koin-kantin-sekolah, bayar-koin-warung, bayar-rupiah-alat-tulis, bayar-rupiah-toko-roti, kasir-kembalian-toko-mainan, kasir-kembalian-warung). Paket SD tanpa knob harga sudah memakai price.
- Dicoba: memilih barang yang price = knob (atau terdekat). Akibatnya audit melapor 6 ERROR soal-berulang-satu-sesi: soal unik = jumlah barang di sekitar knob < 10 ronde.
- Keputusan: DIKEMBALIKAN ke perilaku lama (knob harga menang, barang diundi). Komentar di hargaRonde menjelaskan alasannya. Tidak ada perubahan perilaku.
- Pilihan isi:
  - (a) tambah barang per tingkat harga, ≥ 10 kombinasi di sekitar knob;
  - (b) presenter tidak memasangkan gambar barang dengan harga;
  - (c) anggap price di paket ini tidak bermakna.

## Berkas yang diubah
- packages/mechanics/src/dagang.ts, packages/mechanics/src/simulasi.ts
- packages/mechanics/test/mekanik.test.ts, packages/mechanics/test/pola-simulasi.test.ts
- src/components/akademi/benda.tsx, dagang.tsx, runner.tsx, ujian.tsx
- (pilah.ts dan scripts/akademi-audit.ts sudah berubah sebelum saya mulai, bukan oleh saya)
