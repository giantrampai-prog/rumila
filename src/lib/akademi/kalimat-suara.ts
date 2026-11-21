// Satu sumber kalimat yang DIUCAPKAN Academy dari kode (bukan dari locale paket).
//
// Komponen memakai pembangun di sini untuk teks yang dibacakan, dan scripts/akademi-suara.ts mengimpor modul yang sama
// untuk mengumpulkan daftar rekaman — jadi teks yang diucapkan selalu identik dengan teks yang direkam (MP3 Aoede).
//
// Dua cara menangani kalimat dinamis:
//   (a) kalimat utuh: `kalimatPaket(p)` membangkitkan semua kombinasi yang mungkin dari data paket + rentang knob,
//       mengikuti generator ronde di packages/mechanics (jam, menara, telusur, benda, hewan, tombol, sisa, tukar, …).
//   (b) potongan: kombinasi terlalu banyak (nilai 0–100, pesanan "Aku mau …", rincian harga) → `ucapkanBerurutan`
//       dengan potongan yang semuanya direkam (angka 0–100, ratusan, "ribu", "rupiah", nama barang, frasa sambung).
//
// Modul ini murni (tanpa "use client", tanpa DOM) supaya bisa diimpor skrip Node dan tes vitest.

import { levelIndex, type ContentPack, type PaketDagang, type PaketSimulasi } from "@akademi/schema";

/* ---------------- bilangan ---------------- */

const SATUAN = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];

/** Kata bilangan baku 0–100 ("nol", "sebelas", "dua puluh satu", "seratus"); di luar itu angkanya sebagai teks. */
export function angkaKata(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 100) return String(n);
  if (n < 10) return SATUAN[n];
  if (n === 10) return "sepuluh";
  if (n === 11) return "sebelas";
  if (n < 20) return `${SATUAN[n - 10]} belas`;
  if (n === 100) return "seratus";
  const puluh = Math.floor(n / 10), sisa = n % 10;
  return `${SATUAN[puluh]} puluh${sisa ? ` ${SATUAN[sisa]}` : ""}`;
}

/** Semua potongan angka yang direkam: indeks = bilangannya (angka-<n>.mp3). */
export const ANGKA_KATA: readonly string[] = Array.from({ length: 101 }, (_, n) => angkaKata(n));

/** Potongan ratusan yang direkam: "dua ratus" … "sembilan ratus" (seratus = angka 100). */
export const RATUSAN_KATA: readonly string[] = Array.from({ length: 8 }, (_, i) => `${SATUAN[i + 2]} ratus`);

function ratusanPotongan(m: number): string[] {
  if (m <= 100) return [angkaKata(m)];
  const h = Math.floor(m / 100), r = m % 100;
  const out = [h === 1 ? "seratus" : `${SATUAN[h]} ratus`];
  if (r) out.push(angkaKata(r));
  return out;
}

/** Bilangan 0–999.999 sebagai potongan rekaman, mis. 24300 → ["dua puluh empat", "ribu", "tiga ratus"], 1500 → ["seribu", "lima ratus"]. */
export function bilanganPotongan(n: number): string[] {
  if (!Number.isInteger(n) || n < 0 || n >= 1_000_000) return [String(n)];
  if (n <= 100) return [angkaKata(n)];
  const ribu = Math.floor(n / 1000), sisa = n % 1000;
  const out: string[] = [];
  if (ribu === 1) out.push("seribu");
  else if (ribu > 1) out.push(...ratusanPotongan(ribu), "ribu");
  if (sisa) out.push(...ratusanPotongan(sisa));
  return out;
}

/** 24300 → "24.300" (tampilan & kalimat utuh). */
export function formatRibuan(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* ---------------- kalimat tetap ---------------- */

export const KALIMAT_RUNNER = {
  stiker: "Hebat! Kamu dapat stiker baru.",
  coba: "Bagus, kamu sudah mencoba. Ayo main lagi.",
} as const;

export const KALIMAT_SIMULASI = {
  jamBaca: "Jam berapa sekarang? Pilih kartunya.",
  jamBacaBantu: "Lihat jarum yang pendek. Ia menunjuk angka berapa?",
  timbangan: "Mana yang lebih berat?",
  timbanganBantu: "Lihat papannya. Sisi yang turun ke bawah, itu yang lebih berat.",
  jengkalBantu: "Taruh telapak rapat rapat dari ujung kiri sampai ujung kanan, lalu hitung berapa telapaknya.",
  kubusBantu: "Hitung kubus yang ada tepat di bawah benda, satu per satu.",
  turusCadangan: "Satu per satu lewat. Ketuk barisnya untuk mencatat turus!",
  turusBantu: "Lihat yang sedang lewat, lalu ketuk baris yang sama.",
  taksir: "Kira-kira ada berapa? Geser penandanya.",
  tombolCoba: "Coba dulu: ketuk setiap tombol, lihat alat mana yang menyala.",
  tombolLihat: "Lihat, alat mana yang menyala?",
  tombolBantuCoba: "Ketuk semua tombol satu per satu, lalu lihat alat mana yang menyala.",
  tombolBantuTebak: "Ingat ingat. Waktu kamu coba tadi, tombol ini menyalakan alat yang mana?",
  alatBantuBerat: "Kalau mau tahu berat, pakai timbangan.",
  alatBantuPanjang: "Kalau mau tahu panjang, pakai penggaris.",
  bagi: "Bagi ikan untuk dua kucing sama banyak. Ketuk piring, lalu ketuk ikan.",
  bagiBantu: "Satu untuk kucing kiri, satu untuk kucing kanan, bergantian sampai keranjang kosong.",
  menaraBantu: "Bola itu bulat, jadi menggelinding. Pilih benda yang rata bawahnya.",
  tolong: "Tolong!",
  telusurBantu: "Mulai dari panah nomor satu, lalu ikuti jalurnya pelan pelan sampai ujung.",
} as const;

/** Kata label urutkan (dibacakan saat keping diketuk). */
export const KATA_URUTAN = { pertama: "pertama", lalu: "lalu", terakhir: "terakhir" } as const;
export type KataUrutan = keyof typeof KATA_URUTAN;

export const KALIMAT_URUTKAN = { berhenti: "Lho, ceritanya berhenti di sini." } as const;

/** Frasa sambung (b) yang direkam sebagai potongan. */
export const FRASA = {
  akuMau: "Aku mau",
  ada: "Ada",
  harganya: "Harganya",
  ribu: "ribu",
  koin: "koin",
  dan: "dan",
  kali: "kali",
  rupiah: "rupiah",
  seribu: "seribu",
  iniUang: "Ini uang",
  bayarPas: "Berapa semuanya? Bayar dengan uang pas.",
  jumlahkan: "Jumlahkan harganya. Berapa kembaliannya?",
  nilaiLatihan: "Nilai latihanmu",
  ujianAkhir: "Ujian Akhir selesai. Nilaimu",
  lulus: "Selamat, kamu lulus dengan nilai",
  nilaimu: "Nilaimu",
  ulangi: "Ayo ulangi materinya, lalu coba besok.",
} as const;

/* ---------------- pembangun: simulasi ---------------- */

export const kalimatSimulasi = {
  pukul: (n: number) => `Pukul ${n}`,
  jamPutar: (kegiatan: string, jam: number) => `Robot ${kegiatan} pukul ${jam}. Putar jarum pendeknya!`,
  jamPutarBantu: (jam: number) => `Cari angka ${jam} di jam, lalu ketuk.`,
  jengkal: (benda: string) => `Ukur ${benda} dengan jengkal. Berapa jengkal panjangnya?`,
  kubus: (benda: string) => `Berapa kubus panjang ${benda}?`,
  tombolTebak: (tombol: string) => `Tebak dulu: tombol ${tombol} menyalakan alat mana? Ketuk alatnya.`,
  tombolTekan: (tombol: string) => `Sekarang tekan tombol ${tombol}.`,
  alatTanya: (berat: boolean) => (berat ? "Seberapa berat?" : "Seberapa panjang?"),
  alat: (hewan: string, berat: boolean) => `${hewan} bertanya: ${kalimatSimulasi.alatTanya(berat)} Pilih alat yang tepat.`,
  menara: (tingkat: number) => `Bangun menara ${tingkat} tingkat. Ketuk benda untuk menaruhnya di atas.`,
  telusur: (angka: number, panah: boolean) => `Telusuri angka ${angka} dengan jarimu${panah ? ", ikuti panahnya" : ""}. Itu mantra pembuka peti!`,
};

/* ---------------- pembangun: urutkan ---------------- */

export const kalimatUrutkan = {
  hint: (kata: string) => `Gambar ini yang ${kata}.`,
  cerita: (kata: string, langkah: string) => `${kata}, ${langkah}.`,
};

/* ---------------- pembangun: ujian (b) ---------------- */

export type Ucapan = { teks: string; potongan: string[] };

export const kalimatUjian = {
  latihan: (n: number): Ucapan => ({ teks: `Nilai latihanmu ${n}.`, potongan: [FRASA.nilaiLatihan, angkaKata(n)] }),
  akhir: (n: number): Ucapan => ({ teks: `Ujian Akhir selesai. Nilaimu ${n}.`, potongan: [FRASA.ujianAkhir, angkaKata(n)] }),
  lulus: (n: number): Ucapan => ({ teks: `Selamat, kamu lulus dengan nilai ${n}.`, potongan: [FRASA.lulus, angkaKata(n)] }),
  belum: (n: number): Ucapan => ({ teks: `Nilaimu ${n}. Ayo ulangi materinya, lalu coba besok.`, potongan: [FRASA.nilaimu, angkaKata(n), FRASA.ulangi] }),
};

/* ---------------- pembangun: dagang ---------------- */

export type BarisHarga = { goodId: string; qty: number; price: number };

/** Potongan rincian "Buku 2 kali 23.000 rupiah dan pensil 9.000 rupiah." */
function rincianPotongan(baris: BarisHarga[], nama: (id: string) => string): string[] {
  const out: string[] = [];
  baris.forEach((b, i) => {
    if (i) out.push(FRASA.dan);
    out.push(nama(b.goodId));
    if (b.qty > 1) out.push(angkaKata(b.qty), FRASA.kali);
    out.push(...bilanganPotongan(b.price), FRASA.rupiah);
  });
  return out;
}

function rincianTeks(baris: BarisHarga[], nama: (id: string) => string): string {
  return baris.map((b) => `${nama(b.goodId)} ${b.qty > 1 ? `${b.qty} kali ` : ""}${formatRibuan(b.price)} rupiah`).join(" dan ") + ".";
}

export type TemaSisaKata = "ditangkap" | "dibeli" | "dipetik" | "diambil";
/** Kata kerja sisa per dunia (selain itu "diambil"). */
export const KERJA_SISA: Record<string, TemaSisaKata> = { kolam: "ditangkap", "toko-kue": "dibeli", kebun: "dipetik" };
export const kerjaSisa = (world: string | undefined): TemaSisaKata => KERJA_SISA[world ?? ""] ?? "diambil";

export const kalimatDagang = {
  /** ambil: "Aku mau 3 jeruk dan 2 apel." (b) */
  pesanan: (pesanan: { qty: number; nama: string }[]): Ucapan => {
    const potongan: string[] = [FRASA.akuMau];
    pesanan.forEach((p, i) => {
      if (i) potongan.push(FRASA.dan);
      potongan.push(angkaKata(p.qty), p.nama);
    });
    return { teks: `Aku mau ${pesanan.map((p) => `${p.qty} ${p.nama}`).join(" dan ")}.`, potongan };
  },
  subitasi: (nama: string) => `Aku mau ${nama} sebanyak jariku.`,
  hitung: (nama: string) => `Ada berapa ${nama} di meja? Sentuh satu-satu, lalu pilih angkanya.`,
  /** bayar tanpa rincian (a) */
  hargaKoin: (koin: number) => `Harganya ${koin} koin.`,
  hargaRupiah: (harga: number) => `Harganya ${formatRibuan(harga)} rupiah.`,
  /** bayar dengan rincian (b) */
  bayarRincian: (baris: BarisHarga[], nama: (id: string) => string): Ucapan => ({
    teks: `${rincianTeks(baris, nama)} ${FRASA.bayarPas}`,
    potongan: [...rincianPotongan(baris, nama), FRASA.bayarPas],
  }),
  /** kembalian tanpa rincian (a) */
  kembalian: (dibayar: number, harga: number) => `Ini uang ${formatRibuan(dibayar)}. Harganya ${formatRibuan(harga)}. Berapa kembaliannya?`,
  /** kembalian dengan rincian (b) */
  kembalianRincian: (dibayar: number, baris: BarisHarga[], nama: (id: string) => string): Ucapan => ({
    teks: `Ini uang ${formatRibuan(dibayar)}. ${rincianTeks(baris, nama)} ${FRASA.jumlahkan}`,
    potongan: [FRASA.iniUang, ...bilanganPotongan(dibayar), ...rincianPotongan(baris, nama), FRASA.jumlahkan],
  }),
  tukar: (lembar: number[], dibayar: number) =>
    `Tolong tukar uang ${lembar.map(formatRibuan).join(" dan ")}${lembar.length > 1 ? `, semuanya ${formatRibuan(dibayar)},` : ""} jadi koin seribuan.`,
  lengkapi: (koin: number) => `Harganya ${koin} koin. Aku punya segini. Berapa koin lagi supaya cukup?`,
  /** gabung: kalimat utuh bila kombinasinya sedikit (a), selain itu potongan (b) */
  gabung: (a: number, b: number, nama: string): Ucapan => ({
    teks: `${a} ${nama} dan ${b} ${nama} digabung. Jadi berapa semuanya?`,
    potongan: [angkaKata(a), nama, FRASA.dan, angkaKata(b), kalimatDagang.gabungPenutup(nama)],
  }),
  gabungPenutup: (nama: string) => `${nama} digabung. Jadi berapa semuanya?`,
  /** sisa: kalimat utuh bila kombinasinya sedikit (a), selain itu potongan (b) */
  sisa: (o: OpsiSisa): Ucapan => ({
    teks: o.kolam
      ? `Ada ${o.awal} ${o.benda} di kolam. ${o.diambil} ${o.benda} ditangkap. ${kalimatDagang.sisaPenutup(o)}`
      : `Ada ${o.awal} ${o.benda}. ${o.diambil} ${o.benda} ${o.kerja}. ${kalimatDagang.sisaPenutup(o)}`,
    potongan: [FRASA.ada, angkaKata(o.awal), o.kolam ? `${o.benda} di kolam` : o.benda, angkaKata(o.diambil), `${o.benda} ${o.kolam ? "ditangkap" : o.kerja}`, kalimatDagang.sisaPenutup(o)],
  }),
  sisaPenutup: (o: Pick<OpsiSisa, "kolam" | "benda" | "penanda" | "samaPenanda">) =>
    o.kolam
      ? `Beri makan ${o.benda} yang tersisa, satu ${o.penanda} untuk satu ${o.benda}.`
      : o.samaPenanda
        ? `Taruh ${o.penanda} sebanyak yang tersisa.`
        : `Taruh ${o.penanda} sebanyak ${o.benda} yang tersisa, satu ${o.penanda} untuk satu ${o.benda}.`,
};

type OpsiSisa = { kolam: boolean; awal: number; diambil: number; benda: string; penanda: string; samaPenanda: boolean; kerja: string };

/** Batas kombinasi per paket untuk kalimat utuh (a); di atas ini kalimatnya direkam sebagai potongan (b). */
export const BATAS_KOMBINASI = 150;

/* ---------------- pengumpul untuk skrip ---------------- */

export type KalimatRekam = { teks: string; sumber: string; file?: string };

/** Kalimat tetap + semua potongan (b) yang tidak bergantung paket. */
export function kalimatUmum(): KalimatRekam[] {
  const out: KalimatRekam[] = [];
  for (const t of Object.values(KALIMAT_RUNNER)) out.push({ teks: t, sumber: "runner" });
  for (const t of Object.values(KALIMAT_SIMULASI)) out.push({ teks: t, sumber: "simulasi" });
  for (const t of Object.values(KATA_URUTAN)) {
    out.push({ teks: t, sumber: "urutkan" });
    out.push({ teks: kalimatUrutkan.hint(t), sumber: "urutkan" });
  }
  for (const t of Object.values(KALIMAT_URUTKAN)) out.push({ teks: t, sumber: "urutkan" });
  ANGKA_KATA.forEach((t, n) => out.push({ teks: t, sumber: "angka", file: `angka-${n}.mp3` }));
  RATUSAN_KATA.forEach((t, i) => out.push({ teks: t, sumber: "angka", file: `ratus-${i + 2}.mp3` }));
  for (const t of Object.values(FRASA)) out.push({ teks: t, sumber: "frasa" });
  return out;
}

/** Nilai knob yang mungkin selama permainan: default ± k·step dijepit ke [min, max] knob, lalu ke batas generator. */
export function nilaiKnob(p: ContentPack, nama: string, batas: [number, number], bawaan: number): number[] {
  const k = p.knobs[nama];
  const jepit = (n: number) => Math.min(batas[1], Math.max(batas[0], Math.floor(n)));
  if (!k) return [jepit(bawaan)];
  const step = k.step || 1;
  const out = new Set<number>();
  for (let v = k.default; v >= k.min; v -= step) out.add(jepit(v));
  for (let v = k.default; v <= k.max; v += step) out.add(jepit(v));
  out.add(jepit(k.min));
  out.add(jepit(k.max));
  return [...out].sort((a, b) => a - b);
}

function rentang(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

type ItemSim = PaketSimulasi["items"][number];
/** Sama dengan `bernilai` di packages/mechanics/src/simulasi.ts. */
function bernilai(p: PaketSimulasi, role: ItemSim["role"]): ItemSim[] {
  const a = p.items.filter((i) => i.role === role && typeof i.value === "number");
  if (a.length) return a;
  const b = p.items.filter((i) => typeof i.value === "number");
  return b.length ? b : p.items;
}

function kalimatPaketSimulasi(p: PaketSimulasi, nama: (key: string) => string, tambah: (t: string) => void) {
  switch (p.mode) {
    case "jam-baca": {
      const maks = Math.max(...nilaiKnob(p, "hourMax", [1, 12], 6), 4);
      for (const n of rentang(1, maks)) tambah(kalimatSimulasi.pukul(n));
      return;
    }
    case "jam-putar":
      for (const k of bernilai(p, "kegiatan")) {
        tambah(kalimatSimulasi.jamPutar(nama(k.labelKey), k.value ?? 0));
        tambah(kalimatSimulasi.jamPutarBantu(k.value ?? 0));
      }
      return;
    case "jengkal":
      for (const b of bernilai(p, "benda")) tambah(kalimatSimulasi.jengkal(nama(b.labelKey)));
      return;
    case "kubus":
      for (const b of bernilai(p, "benda")) tambah(kalimatSimulasi.kubus(nama(b.labelKey)));
      return;
    case "tombol":
      for (const b of p.items.filter((i) => i.role === "tombol")) {
        tambah(kalimatSimulasi.tombolTebak(nama(b.labelKey)));
        tambah(kalimatSimulasi.tombolTekan(nama(b.labelKey)));
      }
      return;
    case "alat":
      for (const h of bernilai(p, "hewan")) tambah(kalimatSimulasi.alat(nama(h.labelKey), h.value === 2));
      return;
    case "menara":
      for (const n of nilaiKnob(p, "tinggi", [2, 8], 4)) tambah(kalimatSimulasi.menara(n));
      return;
    case "telusur":
      for (const maks of nilaiKnob(p, "max", [1, 9], 5))
        for (const n of rentang(maks >= 6 ? 0 : 1, maks))
          for (const panah of nilaiKnob(p, "panah", [0, 1], 1)) tambah(kalimatSimulasi.telusur(n, panah === 1));
      return;
  }
}

const KOIN = 1000;

/** Kombinasi lembar mesin tukar, sama dengan generator (packages/mechanics/src/dagang.ts, case "tukar"). */
function kombinasiTukar(p: PaketDagang, hargaKnob: number | undefined): number[][] {
  const denoms = [...p.denominations].sort((a, b) => a - b);
  const pecahan = denoms.filter((d) => d > KOIN);
  const batas = hargaKnob !== undefined ? Math.floor(hargaKnob) * KOIN : p.customerRule.maxTotal;
  const boleh = pecahan.filter((d) => d <= batas);
  const pakai = boleh.length ? boleh : pecahan.length ? [pecahan[0]] : [10000];
  const maksLembar = Math.min(4, Math.max(1, p.customerRule.itemsMax));
  const plafon = Math.max(batas, pakai[0]);
  const urut = [...pakai].sort((a, b) => b - a);
  const out: number[][] = [];
  const susun = (mulai: number, isi: number[], jumlah: number) => {
    if (isi.length) out.push([...isi]);
    if (isi.length === maksLembar) return;
    for (let i = mulai; i < urut.length; i++) if (jumlah + urut[i] <= plafon) susun(i, [...isi, urut[i]], jumlah + urut[i]);
  };
  susun(0, [], 0);
  return out.length ? out : [[pakai[0]]];
}

/** (a) semua kalimat utuh bila ≤ BATAS_KOMBINASI, selain itu (b) potongannya saja. */
function rekamUcapan(semua: Ucapan[], tambah: (t: string) => void, potongan: (t: string) => void) {
  if (semua.length <= BATAS_KOMBINASI) for (const u of semua) tambah(u.teks);
  else for (const u of semua) for (const x of u.potongan) potongan(x);
}

function kalimatPaketDagang(p: PaketDagang, nama: (key: string) => string, tambah: (t: string) => void, potongan: (t: string) => void) {
  const namaGood = (id: string) => { const g = p.goods.find((x) => x.id === id); return g ? nama(g.labelKey) : id; };
  const rule = p.customerRule;
  const knobOpsional = (k: string, batas: [number, number]) => (p.knobs[k] ? nilaiKnob(p, k, batas, p.knobs[k].default) : undefined);
  switch (p.mode) {
    case "ambil":
      // (b) "Aku mau" + angka + nama barang (+ "dan" …): nama barang sudah direkam lewat goods.labelKey
      for (const g of p.goods) potongan(nama(g.labelKey));
      return;
    case "subitasi":
      for (const g of p.goods) tambah(kalimatDagang.subitasi(nama(g.labelKey)));
      return;
    case "hitung":
      for (const g of p.goods) tambah(kalimatDagang.hitung(nama(g.labelKey)));
      return;
    case "bayar":
    case "kembalian": {
      const denoms = [...p.denominations].sort((a, b) => a - b);
      const dibayarDari = (harga: number) => denoms.find((d) => d > harga) ?? Math.ceil((harga + 1) / 10000) * 10000;
      const harga = knobOpsional("harga", [1, Number.MAX_SAFE_INTEGER]);
      if (harga) {
        // paket ber-knob harga: tidak pernah rincian
        for (const n of harga) {
          if (p.mode === "kembalian") tambah(kalimatDagang.kembalian(dibayarDari(n * KOIN), n * KOIN));
          else tambah(p.priceLabel === "koin" ? kalimatDagang.hargaKoin(n) : kalimatDagang.hargaRupiah(n * KOIN));
        }
        return;
      }
      // tanpa knob: pembelian 1 barang → kalimat utuh (a); ≥ 2 barang → rincian (b), potongannya direkam
      for (const g of p.goods) {
        const h = g.price ?? 0;
        if (p.mode === "kembalian") tambah(kalimatDagang.kembalian(dibayarDari(h), h));
        else tambah(p.priceLabel === "koin" ? kalimatDagang.hargaKoin(Math.round(h / KOIN)) : kalimatDagang.hargaRupiah(h));
        // nama barang untuk rincian; angka, ratusan, "ribu", "rupiah" ada di kalimatUmum()
        potongan(nama(g.labelKey));
      }
      return;
    }
    case "tukar": {
      const lihat = new Set<string>();
      for (const h of knobOpsional("harga", [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]) ?? [undefined])
        for (const lembar of kombinasiTukar(p, h)) {
          const t = kalimatDagang.tukar(lembar, lembar.reduce((a, b) => a + b, 0));
          if (!lihat.has(t)) { lihat.add(t); tambah(t); }
        }
      return;
    }
    case "lengkapi":
      for (const n of nilaiKnob(p, "target", [2, Number.MAX_SAFE_INTEGER], rule.target ?? 5)) tambah(kalimatDagang.lengkapi(n));
      return;
    case "gabung": {
      const kombinasi = new Set<string>();
      for (const batasK of nilaiKnob(p, "target", [2, Number.MAX_SAFE_INTEGER], rule.target ?? 10)) {
        const kecil = Math.min(Math.max(1, rule.itemsMin), Math.floor(batasK / 2));
        for (const im of nilaiKnob(p, "itemsMax", [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], rule.itemsMax)) {
          const besar = Math.max(kecil, Math.min(im, batasK - kecil));
          for (const a of rentang(kecil, besar)) for (const b of rentang(kecil, Math.max(kecil, Math.min(besar, batasK - a)))) kombinasi.add(`${a},${b}`);
        }
      }
      const semua = p.goods.flatMap((g) => [...kombinasi].map((k) => { const [a, b] = k.split(",").map(Number); return kalimatDagang.gabung(a, b, nama(g.labelKey)); }));
      rekamUcapan(semua, tambah, potongan);
      return;
    }
    case "sisa": {
      const kolam = p.world === "kolam";
      const kerja = kerjaSisa(p.world);
      const pasangan = p.goods.length === 2 ? [{ benda: p.goods[0].id, penanda: p.goods[1].id }] : p.goods.map((g) => ({ benda: g.id, penanda: g.id }));
      const batasList = p.knobs.maxCount ? nilaiKnob(p, "maxCount", [2, Number.MAX_SAFE_INTEGER], 10)
        : p.knobs.itemsMax ? nilaiKnob(p, "itemsMax", [2, Number.MAX_SAFE_INTEGER], 10)
        : [Math.max(2, rule.target ?? 10)];
      const pengurang = p.knobs.pengurang ? nilaiKnob(p, "pengurang", [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], 1) : undefined;
      const kombinasi = new Set<string>();
      for (const batas of batasList) for (const awal of rentang(2, batas)) {
        const maks = pengurang ? Math.max(...pengurang.map((x) => Math.min(x, awal - 1))) : awal - 1;
        for (const d of rentang(1, Math.max(1, maks))) kombinasi.add(`${awal},${d}`);
      }
      const semua = pasangan.flatMap(({ benda, penanda }) => [...kombinasi].map((k) => {
        const [awal, diambil] = k.split(",").map(Number);
        return kalimatDagang.sisa({ kolam, awal, diambil, benda: namaGood(benda), penanda: namaGood(penanda), samaPenanda: benda === penanda, kerja });
      }));
      rekamUcapan(semua, tambah, potongan);
      return;
    }
  }
}

/**
 * Semua kalimat dinamis yang mungkin diucapkan untuk satu paket (selain locale paket yang dikumpulkan skrip):
 * kalimat utuh (a) dan potongan (b) yang dibutuhkan pembangun di atas. Teks dari locale.id paket.
 */
export function kalimatPaket(p: ContentPack): KalimatRekam[] {
  const out: KalimatRekam[] = [];
  const nama = (key: string) => p.locale.id[key] ?? key;
  const tambah = (t: string) => out.push({ teks: t, sumber: `${p.id}:kode` });
  const potongan = (t: string) => out.push({ teks: t, sumber: `${p.id}:potongan` });
  if (p.mechanic === "simulasi") kalimatPaketSimulasi(p, nama, tambah);
  else if (p.mechanic === "dagang") kalimatPaketDagang(p, nama, tambah, potongan);
  else if (p.mechanic === "urutkan" && p.mode === "label") {
    for (const s of p.sequences) for (const x of s.steps) for (const kata of Object.values(KATA_URUTAN)) tambah(kalimatUrutkan.cerita(kata, nama(x.labelKey)));
  } else if (p.mechanic === "pilah" && p.mode !== "pilih" && levelIndex(p.level) < levelIndex("SD1")) {
    // PAUD–TK: nama kartu dibacakan saat disentuh (pilah.tsx bacaLabel)
    for (const i of p.items) tambah(nama(i.labelKey));
  }
  return out;
}
