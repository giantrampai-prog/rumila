# Fitur putaran 2 — kontrak final (21 Nov 2026)

Semua field OPSIONAL. Paket tanpa field baru berperilaku persis sama (diuji: ronde identik untuk seed sama).

## 1. Visual: shape baru + `angka`
Berlaku di semua objek ber-Visual (pilah bins/items, urutkan steps, dagang goods, pola items, simulasi items).

- `shape`: tambah `"belah-ketupat"` | `"koin"` | `"uang"` | `"akar"` (lihat §6) (selain circle, square, triangle, rect, star, berudu).
- `angka`: string 1–8 karakter (mis. `"500"`, `"1.000"`, `"Rp2.000"`; `"Rp10.000"` = 8 karakter masih boleh, `"Rp100.000"` DITOLAK → tulis `"100.000"`).
- `color`: mewarnai bentuk. Bawaan bila kosong: koin → perak `#c9ced6` bila angka < 1000, emas `#f2c230` selain itu; uang → `#7ec8a0`; bentuk lain → `#0786eb` (lama).
- Tampilan: belah-ketupat = rombus tegak (lebih tinggi dari lebar). koin = cakram bertepi + kilau + angka di tengah. uang = lembar mendatar (~1,9× lebar:tinggi), bingkai dalam, tanda air, angka besar, tulisan kecil "RUPIAH". Bentuk lain: angka dilapis di tengah (warna tinta otomatis kontras).
- PENTING: `emoji` tetap MENANG atas `shape` (perilaku lama). Untuk memakai koin/uang, JANGAN isi `emoji`. Di dagang, barang tanpa emoji tapi ber-shape tidak lagi diberi emoji bawaan (perilaku lama, sudah begitu).
- Tanpa emoji & tanpa shape: teks yang digambar `angka ?? label`.

```json
{ "id": "koin-500", "labelKey": "koin500", "bin": "perak", "shape": "koin", "angka": "500" }
{ "id": "koin-1000", "labelKey": "koin1000", "bin": "emas", "shape": "koin", "angka": "1.000" }
{ "id": "uang-2000", "labelKey": "uang2000", "shape": "uang", "angka": "2.000", "color": "#cfd4dc" }
{ "id": "uang-5000", "labelKey": "uang5000", "shape": "uang", "angka": "Rp5.000", "color": "#b5835a" }
{ "id": "ketupat-biru", "labelKey": "ketupat", "shape": "belah-ketupat", "color": "#0786eb" }
{ "id": "ketupat-4", "labelKey": "empat", "shape": "belah-ketupat", "color": "#ff5a6e", "angka": "4" }
```
Warna uang yang dipakai laci dagang (untuk konsistensi): 2.000 `#cfd4dc`, 5.000 `#b5835a`, 10.000 `#9b7bd6`, 20.000 `#7ec8a0`, 50.000 `#6ab0e8`, 100.000 `#e88a8a`.

## 2. urutkan: `potong`
Field level paket: `"potong": "akhir" | "tengah"` (tidak diisi = "akhir" = `steps.slice(0, n)`, n = knob `steps`).
"tengah": bila sequence lebih panjang dari n, langkah pertama & terakhir dipertahankan; dibuang lebih dulu indeks yang paling dekat ke titik tengah ((len−1)/2), seri → indeks lebih kecil dulu. Urutan tetap benar (subsekuens).
Contoh 7 langkah a..g: n=6 → a b c e f g · n=5 → a b e f g · n=4 → a b f g · n=3 → a f g. 6 langkah a..f: n=5 → a b d e f · n=4 → a b e f.
Fungsi diekspor: `potongTengah(steps, n)` di @akademi/mechanics.

```json
{
  "mechanic": "urutkan", "mode": "susun", "potong": "tengah",
  "knobs": { "steps": { "min": 3, "max": 6, "default": 4, "keterangan": "jumlah langkah" } },
  "sequences": [{ "id": "kupu", "titleKey": "judul", "steps": [ "...telur", "...ulat", "...makan", "...kepompong", "...menetas", "...kupu" ] }]
}
```

## 3. dagang bayar/kembalian: `barangIkutHarga`
Field level paket: `"barangIkutHarga": true` (boolean, opsional; tidak diisi/false = perilaku lama).
DIJADIKAN OPT-IN (bukan bawaan) karena bila aktif untuk semua paket, audit memberi 6 ERROR `soal-berulang-satu-sesi`:
bayar-koin-kantin-sekolah (3/10), bayar-koin-warung (3/10), bayar-rupiah-alat-tulis (7/10), bayar-rupiah-toko-roti (7/10),
kasir-kembalian-toko-mainan (2/10), kasir-kembalian-warung (2/10) — di tingkat knob default hanya ada 1 barang ber-price sama,
jadi soal tinggal sebanyak barang cocok (+ pinjaman knob tetangga). Untuk mengaktifkan di paket itu: tambah beberapa barang
ber-price sama per tingkat harga (≥ ~3–4 per tingkat default) lalu set `barangIkutHarga: true`, jalankan audit.

Aturan (hanya bila `barangIkutHarga: true`, mode bayar/kembalian, dan knob `harga` ada):
harga ronde = knob `harga` × 1000 (tetap; satuan knob = ribuan rupiah apa pun priceLabel-nya; `price` barang dalam rupiah).
Lalu bila ada barang dengan `price === harga`, `pesanan = [{ goodId: <acak di antara yang cocok>, qty: 1 }]`; kalau tidak ada,
pesanan acak seperti bawaan. Presenter (ModeBayar/ModeKembalian) hanya menampilkan `ronde.harga`, tidak pernah `price`.

```json
{
  "mechanic": "dagang", "mode": "bayar", "priceLabel": "koin", "barangIkutHarga": true,
  "knobs": { "harga": { "min": 1, "max": 5, "default": 2, "keterangan": "harga dalam koin seribu" } },
  "goods": [
    { "id": "permen", "labelKey": "permen", "price": 1000, "emoji": "🍬" },
    { "id": "kerupuk", "labelKey": "kerupuk", "price": 2000, "emoji": "🍘" },
    { "id": "susu", "labelKey": "susu", "price": 2000, "emoji": "🥛" },
    { "id": "roti", "labelKey": "roti", "price": 2000, "emoji": "🍞" }
  ]
}
```

## 4. Audit: WARNING `harga-barang-tak-cocok`
scripts/akademi-audit.ts: paket dagang bayar/kembalian ber-knob `harga`; untuk tiap tingkat v = min..max (step), h = floor(v)×1000;
tingkat tanpa barang `price === h` dilaporkan (pesan menyebut bila barangIkutHarga belum aktif). Berlaku walau barangIkutHarga tidak aktif.
Temuan saat ini (2): bayar-rupiah-alat-tulis (4000, 5000, 7000, 10000), bayar-rupiah-toko-roti (3000, 6000, 8000, 9000).

## 5. Presenter dagang: rincian harga per barang (bayar & kembalian)
Tidak ada field baru; otomatis menurut aturan `rincianHarga(paket, ronde)` (diekspor dari src/components/akademi/dagang.tsx):
rincian dipakai bila (a) paket TANPA knob `harga`, (b) total qty pesanan ≥ 2, dan (c) Σ qty × price = harga ronde.
Selain itu (pembelian 1 barang, paket TK ber-knob harga, atau harga tak cocok) → tampilan lama dengan total.
Bila rincian aktif:
- balon pembeli: tiap barang = gambar + nama + "N ×" (bila qty > 1) + harga satuan Rp; baris "Total ?" (total disembunyikan);
- total baru terbuka saat Bantuan ditekan atau sesudah dijawab (jawabanBenar: "Total RpX · kembalian RpY");
- VO: kembalian "Ini uang 50.000. Buku 2 kali 23.000 rupiah dan pensil 9.000 rupiah. Jumlahkan harganya. Berapa kembaliannya?";
  bayar "<rincian>. Berapa semuanya? Bayar dengan uang pas." (kalimat dinamis, tidak ada di manifest suara pra-rekam → dibacakan TTS).
- bantuan kembalian "hitung maju" tetap memakai total (bantuan memang membuka total).
Paket terdampak (di disk saat ini): sd3-mat-kembalian-toko-kue (1–2 barang), sd4-mat-kembalian-toko-buku & -toko-mainan (2–3 barang),
sd4-mat-bayar-pas-toko-olahraga (knob itemsMax 1→2; pada tingkat 2 barang total disembunyikan — instruksinya "Lihat total harganya"
sebaiknya diganti mis. "Jumlahkan harga barangnya, lalu bayar dengan uang pas").
Instruksi sd4-mat-kembalian-toko-buku di disk masih "Lihat total harganya" → sebaiknya "Jumlahkan harganya".
Diverifikasi di /dev/akademi?paket=sd3-mat-kembalian-toko-kue (croissant Rp8.000 + kue mangkuk Rp6.000, Total ?).
Catatan: /dev/akademi memakai katalog hasil akademi:index, jadi sd4-toko-buku di peramban masih versi lama (1 barang).
Tes: src/lib/akademi/__tests__/dagang-rincian.test.ts (4 tes). vitest total 24 berkas / 232 tes lulus; tsc & eslint bersih.

## 6. Visual shape `"akar"`
`shape: "akar"` = akar tumbuhan sederhana: pangkal batang hijau kecil, akar tunggang meruncing ke bawah, 8 cabang serabut.
`color` opsional (mewarnai akar; bawaan cokelat `#8a5a2b`). Pengganti 🫚 (jahe) untuk label "akar" di paket bagian tumbuhan.
Ingat: `emoji` menang atas `shape` → hapus `emoji` saat memakai shape akar.
```json
{ "id": "akar", "labelKey": "akar", "bin": "bawah-tanah", "shape": "akar" }
{ "id": "akar-wortel", "labelKey": "akar", "shape": "akar", "color": "#e67e22", "scale": 1.2 }
```
Tes render: benda-render.test.ts ("akar: …"); dicek visual di peramban (HTML statis).

## Berkas diubah
packages/schema/src/paket.ts · packages/mechanics/src/urutkan.ts · packages/mechanics/src/dagang.ts ·
src/components/akademi/benda.tsx (+ visual() di pilah/pola/urutkan/simulasi/dagang meneruskan `angka`) ·
scripts/akademi-audit.ts · scripts/akademi-qc-dump.ts (kolom angka) · vitest.config.ts (esbuild jsx automatic untuk tes render) ·
tes baru: packages/mechanics/test/fitur-putaran2.test.ts, src/lib/akademi/__tests__/benda-render.test.ts, src/lib/akademi/__tests__/dagang-rincian.test.ts

## Verifikasi
tsc bersih (di luar .next) · eslint berkas diubah: 0 error (1 warning lama `teks` di akademi-audit.ts:164) ·
vitest src/lib/akademi packages: 23 berkas / 228 tes lulus · akademi:audit: ERROR 0, WARNING 4 (2 harga-barang-tak-cocok baru).
Render dicek visual di peramban lewat HTML statis (renderToStaticMarkup) — /dev/akademi hanya memuat paket dari katalog
content/ (butuh akademi:index), jadi tidak dipakai paket uji sementara.
