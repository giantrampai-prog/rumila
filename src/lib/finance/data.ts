// Data & aturan modul Finance — port dari prototype "Keuangan-Playful" / "Keuangan-Mobile".
// Angka masih demo (bulan berjalan: September 2026). Fase Supabase: tabel account, transaction, budget, goal, bill,
// installment + document, investment, asset, debt (lihat README handoff).

export type FinColor = "green" | "red" | "orange" | "blue" | "purple" | "teal" | "gold" | "pink" | "indigo" | "sky" | "lime" | "brown";
export type TxType = "out" | "in" | "tf" | "sd";

/** Palet Playful [light, main, deep] */
export const FP: Record<FinColor, [string, string, string]> = {
  green: ["#6fe39a", "#1fbf62", "#12904a"],
  red: ["#ff8a8a", "#ff4757", "#c92a3a"],
  orange: ["#ffb347", "#ff7a1a", "#d95a00"],
  blue: ["#7cc0ff", "#2f86ff", "#1a5fd1"],
  purple: ["#c78bff", "#8b45f5", "#6421c9"],
  teal: ["#5ce8d6", "#12b8a6", "#0a8a7c"],
  gold: ["#ffe46b", "#ffbe0b", "#d99400"],
  pink: ["#ffa3cf", "#ff4fa3", "#d12a7c"],
  indigo: ["#9a93ff", "#5b4bff", "#3a2cd1"],
  sky: ["#8fe3ff", "#20b7f0", "#0a88bf"],
  lime: ["#c8f56a", "#86d11a", "#5c9a00"],
  brown: ["#e0b58c", "#b07a4a", "#7f532c"],
};

/** Palet Modern (gaya perbankan) [light, main, deep] */
export const FM: Record<FinColor, [string, string, string]> = {
  green: ["#9cc7b1", "#3f8f6b", "#2c6b4f"],
  red: ["#e3a39c", "#c4554d", "#9a3c35"],
  orange: ["#e9bf94", "#c98345", "#9c6130"],
  blue: ["#a9c4ec", "#1a5fb4", "#0d3f80"],
  purple: ["#c3b1dc", "#7b62a8", "#5a4680"],
  teal: ["#9ccfc9", "#3b8c86", "#2a6762"],
  gold: ["#ffe08a", "#f5b400", "#9a6f00"],
  pink: ["#e6b3c4", "#b5607d", "#8a465d"],
  indigo: ["#b0b3de", "#5a5fa8", "#40447e"],
  sky: ["#a9d3e3", "#3d8aa8", "#2b6680"],
  lime: ["#c9d9a0", "#7f9a45", "#5d7231"],
  brown: ["#d9c3ab", "#8f6e50", "#6b523b"],
};

type CatDef = [string, string, FinColor];

export const CAT_DEF: Record<Exclude<TxType, "tf">, CatDef[]> = {
  out: [
    ["Belanja", "shopping_cart", "orange"],
    ["Makan", "restaurant", "red"],
    ["Dapur", "shopping_basket", "orange"],
    ["Minuman", "local_cafe", "brown"],
    ["Jajan", "icecream", "pink"],
    ["Pulsa & Data", "smartphone", "sky"],
    ["Listrik", "bolt", "gold"],
    ["Air PDAM", "water_drop", "blue"],
    ["Internet", "wifi", "indigo"],
    ["Gas", "local_fire_department", "red"],
    ["Cicilan Rumah", "home", "blue"],
    ["Sewa", "key", "brown"],
    ["Servis Rumah", "handyman", "orange"],
    ["Pendidikan", "school", "purple"],
    ["Buku & ATK", "menu_book", "indigo"],
    ["Les & Kursus", "cast_for_education", "teal"],
    ["Uang Saku", "child_care", "pink"],
    ["Mainan", "toys", "purple"],
    ["Transport", "directions_bus", "sky"],
    ["Bensin", "local_gas_station", "red"],
    ["Kendaraan", "directions_car", "blue"],
    ["Parkir & Tol", "local_parking", "indigo"],
    ["Kesehatan", "medical_services", "red"],
    ["Obat", "medication", "teal"],
    ["Perawatan", "content_cut", "pink"],
    ["Olahraga", "fitness_center", "green"],
    ["Pakaian", "checkroom", "purple"],
    ["Hiburan", "movie", "indigo"],
    ["Liburan", "flight", "sky"],
    ["Langganan", "subscriptions", "red"],
    ["Keluarga", "group", "gold"],
    ["Hadiah", "redeem", "pink"],
    ["Arisan", "diversity_3", "teal"],
    ["Asuransi", "health_and_safety", "green"],
    ["Pajak", "account_balance", "brown"],
    ["Hewan Peliharaan", "pets", "orange"],
    ["Cicilan Lain", "credit_card", "indigo"],
    ["Lainnya", "more_horiz", "brown"],
  ],
  in: [
    ["Gaji", "work", "green"],
    ["Bonus", "star", "gold"],
    ["THR", "celebration", "pink"],
    ["Usaha", "storefront", "teal"],
    ["Freelance", "laptop_mac", "indigo"],
    ["Penjualan", "sell", "orange"],
    ["Investasi", "monitoring", "blue"],
    ["Bagi Hasil", "percent", "lime"],
    ["Hadiah", "redeem", "pink"],
    ["Sewa Masuk", "real_estate_agent", "brown"],
    ["Pengembalian", "undo", "sky"],
    ["Lainnya", "more_horiz", "purple"],
  ],
  sd: [
    ["Sedekah", "volunteer_activism", "teal"],
    ["Infaq", "mosque", "green"],
    ["Zakat", "handshake", "gold"],
    ["Wakaf", "foundation", "brown"],
    ["Qurban", "agriculture", "orange"],
    ["Donasi", "favorite", "pink"],
    ["Santunan Yatim", "child_friendly", "purple"],
    ["Bantu Keluarga", "family_restroom", "blue"],
  ],
};

export function catInfo(type: TxType, cat: string): { icon: string; c: FinColor } {
  if (type === "tf") return { icon: "swap_horiz", c: "indigo" };
  const hit = CAT_DEF[type].find(([n]) => n === cat);
  return hit ? { icon: hit[1], c: hit[2] } : { icon: "more_horiz", c: "brown" };
}

export const TYPES: [TxType, string, FinColor][] = [
  ["out", "Keluar", "red"],
  ["in", "Masuk", "green"],
  ["tf", "Transfer", "indigo"],
  ["sd", "Sedekah", "teal"],
];

export interface Account {
  id: string;
  name: string;
  short: string;
  kind: "Kas" | "Bank" | "E-Wallet" | "RDN";
  c: FinColor;
  init: number;
  keys: string[];
}

/** Akun bawaan (dipakai saat rumah belum punya data). */
export const DEFAULT_ACCOUNTS: Account[] = [
  { id: "kas", name: "Kas Tunai", short: "KAS", kind: "Kas", c: "green", init: 650000, keys: ["kas", "tunai", "cash"] },
  { id: "bca", name: "BCA", short: "BCA", kind: "Bank", c: "blue", init: 6200000, keys: ["bca"] },
  { id: "mandiri", name: "Mandiri", short: "MDR", kind: "Bank", c: "gold", init: 2400000, keys: ["mandiri"] },
  { id: "bsi", name: "BSI", short: "BSI", kind: "Bank", c: "teal", init: 14500000, keys: ["bsi"] },
  { id: "gopay", name: "GoPay", short: "GP", kind: "E-Wallet", c: "sky", init: 400000, keys: ["gopay", "go pay"] },
  { id: "dana", name: "DANA", short: "DN", kind: "E-Wallet", c: "indigo", init: 250000, keys: ["dana"] },
  { id: "rdn", name: "RDN Saham", short: "RDN", kind: "RDN", c: "purple", init: 2500000, keys: ["rdn"] },
];
/**
 * Daftar akun aktif rumah ini. Live binding: diisi ulang dari Supabase lewat setAccounts()
 * (store Finance ikut berubah bersamaan, jadi layar yang memakainya ikut render ulang).
 */
export let ACCOUNTS: Account[] = DEFAULT_ACCOUNTS;
export function setAccounts(list: Account[]) {
  ACCOUNTS = list.length ? list : DEFAULT_ACCOUNTS;
}
export const accName = (id?: string) => ACCOUNTS.find((a) => a.id === id)?.name ?? "—";

/** Transaksi. `d` = tanggal di bulan berjalan (September 2026). */
export interface Tx {
  id: string;
  type: TxType;
  cat: string;
  note: string;
  amt: number;
  d: number;
  by: string;
  acc: string;
  to?: string;
}

export const TX0: Tx[] = (
  [
    ["out", "Makan", "Makan siang kantor", 45000, 26, "Ayah", "gopay"],
    ["out", "Minuman", "Kopi susu", 28000, 26, "Ayah", "gopay"],
    ["in", "Gaji", "Gaji Ayah", 12000000, 25, "Ayah", "bca"],
    ["in", "Gaji", "Gaji Ibu", 5000000, 25, "Ibu", "mandiri"],
    ["out", "Belanja", "Belanja bulanan", 1850000, 24, "Ibu", "mandiri"],
    ["tf", "", "Tarik tunai", 2000000, 23, "Ayah", "bca", "kas"],
    ["out", "Uang Saku", "Uang saku Kakak & Adik", 600000, 22, "Ayah", "kas"],
    ["in", "Penjualan", "Penjualan toko online", 1500000, 20, "Ibu", "gopay"],
    ["out", "Bensin", "Bensin motor", 350000, 20, "Ayah", "kas"],
    ["sd", "Infaq", "Infaq masjid", 500000, 19, "Ayah", "kas"],
    ["out", "Makan", "Sarapan", 30000, 18, "Ayah", "kas"],
    ["out", "Dapur", "Sayur & lauk mingguan", 1350000, 16, "Ibu", "kas"],
    ["out", "Makan", "Makan malam keluarga", 320000, 15, "Ayah", "bca"],
    ["out", "Obat", "Vitamin anak", 340000, 14, "Ibu", "gopay"],
    ["out", "Bensin", "Bensin mobil", 400000, 12, "Ayah", "bca"],
    ["out", "Parkir & Tol", "Tol Jagorawi", 120000, 12, "Ayah", "bca"],
    ["out", "Internet", "Internet rumah", 450000, 10, "Ayah", "bca"],
    ["out", "Listrik", "Token listrik", 850000, 8, "Ayah", "bca"],
    ["out", "Langganan", "Netflix", 65000, 7, "Ayah", "bca"],
    ["out", "Hiburan", "Nonton bioskop", 180000, 6, "Ibu", "dana"],
    ["out", "Pendidikan", "SPP & buku", 2500000, 5, "Ayah", "bca"],
    ["out", "Minuman", "Kopi", 25000, 3, "Ayah", "gopay"],
    ["tf", "", "Setor tabungan", 3000000, 2, "Ayah", "bca", "bsi"],
    ["out", "Cicilan Rumah", "Cicilan KPR", 3000000, 1, "Ayah", "bsi"],
  ] as [TxType, string, string, number, number, string, string, string?][]
).map(([type, cat, note, amt, d, by, acc, to], i) => ({ id: "x" + i, type, cat, note, amt, d, by, acc, to }));

export const TODAY = 26; // 26 September 2026 (Sabtu)
/** Bulan berjalan yang ditampilkan layar Finance. */
export const CUR_YEAR = 2026;
export const CUR_MONTH = 9;
/** d (tanggal di bulan berjalan) → "2026-09-dd" */
export const dayToDate = (d: number) => `${CUR_YEAR}-${String(CUR_MONTH).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
/** "2026-09-dd" → d */
export const dateToDay = (iso: string) => Number(iso.slice(8, 10));
export const MONTH_LABEL = "September 2026";
export const MON = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const WD = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
/** Nama hari untuk tanggal di Sep 2026 (1 Sep 2026 = Selasa). */
export const weekday = (d: number) => WD[(d + 1) % 7];

/** Riwayat 5 bulan sebelumnya (juta rupiah): [bulan, masuk, keluar] */
export const HIST: [string, number, number][] = [
  ["Apr", 17.2, 12.8],
  ["Mei", 17.5, 13.9],
  ["Jun", 18.0, 12.1],
  ["Jul", 17.8, 14.6],
  ["Agu", 21.3, 13.2],
];

export const BUDGET0: [string, number][] = [
  ["Makan", 1500000],
  ["Belanja", 2000000],
  ["Dapur", 2000000],
  ["Bensin", 1000000],
  ["Hiburan", 300000],
  ["Langganan", 150000],
  ["Uang Saku", 800000],
];

export interface Goal {
  id: string;
  name: string;
  icon: string;
  c: FinColor;
  saved: number;
  target: number;
  step: number;
  due: string;
}
export const GOALS0: Goal[] = [
  { id: "darurat", name: "Dana Darurat", icon: "shield", c: "blue", saved: 24000000, target: 40000000, step: 500000, due: "Jun 2027" },
  { id: "umroh", name: "Umroh Sekeluarga", icon: "mosque", c: "green", saved: 18000000, target: 60000000, step: 1000000, due: "Des 2028" },
  {
    id: "kuliah",
    name: "Dana Pendidikan Anak",
    icon: "school",
    c: "purple",
    saved: 9500000,
    target: 50000000,
    step: 500000,
    due: "Jul 2034",
  },
  {
    id: "liburan",
    name: "Liburan Akhir Tahun",
    icon: "flight",
    c: "orange",
    saved: 6200000,
    target: 8000000,
    step: 250000,
    due: "Des 2026",
  },
];

/** Tagihan rutin. `day` = hari jatuh tempo relatif ke 1 Sep (35 = 5 Okt). */
export interface Bill {
  id: string;
  name: string;
  icon: string;
  c: FinColor;
  amt: number;
  day: number;
  due: string;
  paid: boolean;
}
export const BILLS0: Bill[] = [
  { id: "bpjs", name: "BPJS Kesehatan", icon: "health_and_safety", c: "green", amt: 510000, day: 28, due: "28 Sep", paid: false },
  { id: "asuransi", name: "Asuransi Mobil", icon: "directions_car", c: "blue", amt: 420000, day: 30, due: "30 Sep", paid: false },
  { id: "spp", name: "SPP Sekolah", icon: "school", c: "purple", amt: 1250000, day: 35, due: "5 Okt", paid: false },
  { id: "kpr", name: "Cicilan KPR", icon: "home", c: "teal", amt: 3000000, day: 1, due: "1 Sep", paid: true },
  { id: "netflix", name: "Netflix", icon: "subscriptions", c: "red", amt: 65000, day: 7, due: "7 Sep", paid: true },
  { id: "listrik", name: "Listrik PLN", icon: "bolt", c: "gold", amt: 850000, day: 8, due: "8 Sep", paid: true },
  { id: "internet", name: "Internet Rumah", icon: "wifi", c: "indigo", amt: 450000, day: 10, due: "10 Sep", paid: true },
];

export interface Investment {
  id: string;
  name: string;
  kind: string;
  icon: string;
  c: FinColor;
  qty: number;
  avg: number;
  price: number;
  unit: string;
  step: number;
}
export const INV0: Investment[] = [
  {
    id: "emas",
    name: "Emas Antam",
    kind: "Emas",
    icon: "diamond",
    c: "gold",
    qty: 10,
    avg: 1450000,
    price: 1890000,
    unit: "gram",
    step: 1,
  },
  {
    id: "rd",
    name: "RD Pasar Uang",
    kind: "Reksa Dana",
    icon: "pie_chart",
    c: "teal",
    qty: 4850,
    avg: 1030,
    price: 1074,
    unit: "unit",
    step: 500,
  },
  {
    id: "bbca",
    name: "BBCA",
    kind: "Saham",
    icon: "candlestick_chart",
    c: "blue",
    qty: 500,
    avg: 8900,
    price: 9650,
    unit: "lembar",
    step: 100,
  },
  {
    id: "sbn",
    name: "ORI025",
    kind: "SBN",
    icon: "account_balance",
    c: "green",
    qty: 5,
    avg: 1000000,
    price: 1012000,
    unit: "unit",
    step: 1,
  },
  {
    id: "btc",
    name: "Bitcoin",
    kind: "Crypto",
    icon: "currency_bitcoin",
    c: "orange",
    qty: 0.0015,
    avg: 1200000000,
    price: 1140000000,
    unit: "BTC",
    step: 0.0005,
  },
];

export interface Property {
  id: string;
  name: string;
  icon: string;
  c: FinColor;
  buy: number;
  value: number;
  year: string;
}
export const DEFAULT_PROPS: Property[] = [
  { id: "rumah", name: "Rumah Tipe 45", icon: "home", c: "teal", buy: 480000000, value: 650000000, year: "2019" },
  { id: "mobil", name: "Mobil Keluarga", icon: "directions_car", c: "blue", buy: 245000000, value: 185000000, year: "2021" },
  { id: "motor", name: "Motor", icon: "two_wheeler", c: "red", buy: 24000000, value: 14000000, year: "2020" },
  { id: "perhiasan", name: "Perhiasan", icon: "diamond", c: "gold", buy: 12000000, value: 16500000, year: "2018" },
];

/** Aset fisik aktif rumah ini (live binding, diisi dari Supabase lewat setProps()). */
export let PROPS: Property[] = DEFAULT_PROPS;
export function setProps(list: Property[]) {
  PROPS = list;
}

export interface Debt {
  id: string;
  kind: "utang" | "piutang";
  name: string;
  who: string;
  icon: string;
  c: FinColor;
  total: number;
  paid: number;
  step: number;
}
export const DEBTS0: Debt[] = [
  {
    id: "kpr",
    kind: "utang",
    name: "KPR Rumah",
    who: "BSI · 3 jt/bulan",
    icon: "home",
    c: "teal",
    total: 400000000,
    paid: 88000000,
    step: 3000000,
  },
  {
    id: "hp",
    kind: "utang",
    name: "Cicilan HP",
    who: "Kredivo · 600 rb/bulan",
    icon: "smartphone",
    c: "indigo",
    total: 6000000,
    paid: 3600000,
    step: 600000,
  },
  {
    id: "budi",
    kind: "piutang",
    name: "Pinjaman ke Om Budi",
    who: "Janji lunas Des 2026",
    icon: "person",
    c: "orange",
    total: 3000000,
    paid: 1000000,
    step: 500000,
  },
  {
    id: "rina",
    kind: "piutang",
    name: "Patungan arisan",
    who: "Tante Rina",
    icon: "diversity_3",
    c: "pink",
    total: 800000,
    paid: 0,
    step: 400000,
  },
];

export const CIC_KINDS: [string, string, FinColor][] = [
  ["KPR", "home", "teal"],
  ["Kendaraan", "directions_car", "blue"],
  ["Elektronik", "smartphone", "indigo"],
  ["Paylater", "credit_card", "purple"],
  ["Pinjaman Bank", "account_balance", "gold"],
  ["Pinjaman Pribadi", "person", "orange"],
  ["Pendidikan", "school", "green"],
  ["Lainnya", "receipt_long", "brown"],
];

/**
 * Dokumen kontrak. `url` = data URL sementara (baru dipilih, belum terunggah) atau null.
 * `path` = lokasi di Supabase Storage (bucket "documents") setelah terunggah.
 */
export interface DocFile {
  name: string;
  size: string;
  url: string | null;
  type: "pdf" | "img" | "other" | "demo";
  path?: string;
}
export interface Installment {
  id: string;
  name: string;
  kind: string;
  lender: string;
  amt: number;
  tenor: number;
  paid: number;
  start: string;
  due: number;
  acc: string;
  file: DocFile | null;
}
export const CIC0: Installment[] = [
  {
    id: "kpr",
    name: "KPR Rumah",
    kind: "KPR",
    lender: "BSI",
    amt: 3000000,
    tenor: 180,
    paid: 29,
    start: "2024-05",
    due: 1,
    acc: "bsi",
    file: { name: "Akad_KPR_BSI.pdf", size: "2,4 MB", url: null, type: "demo" },
  },
  {
    id: "mobil",
    name: "Kredit Mobil",
    kind: "Kendaraan",
    lender: "Mandiri Utama Finance",
    amt: 4200000,
    tenor: 48,
    paid: 20,
    start: "2024-02",
    due: 15,
    acc: "bca",
    file: { name: "Perjanjian_Kredit_Mobil.pdf", size: "1,1 MB", url: null, type: "demo" },
  },
  {
    id: "hp",
    name: "Cicilan HP",
    kind: "Elektronik",
    lender: "Kredivo",
    amt: 600000,
    tenor: 10,
    paid: 6,
    start: "2026-04",
    due: 20,
    acc: "gopay",
    file: null,
  },
  {
    id: "laptop",
    name: "Laptop Kerja",
    kind: "Paylater",
    lender: "Akulaku",
    amt: 850000,
    tenor: 12,
    paid: 3,
    start: "2026-07",
    due: 28,
    acc: "dana",
    file: null,
  },
];
/** "2024-05" + n bulan → "Okt 2026" */
export const addMonths = (ym: string, n: number) => {
  const [y, m] = ym.split("-").map(Number);
  const t = y * 12 + (m - 1) + n;
  return MON[t % 12] + " " + Math.floor(t / 12);
};

/* ---------------- format ---------------- */

export const rp = (n: number) => (n < 0 ? "−Rp " : "Rp ") + Math.round(Math.abs(n)).toLocaleString("id-ID");
export const rs = (n: number) => {
  const a = Math.abs(n);
  const s = n < 0 ? "−" : "";
  if (a >= 1e9) return s + "Rp " + (a / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " M";
  if (a >= 1e6) return s + "Rp " + (a / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
  if (a >= 1e3) return s + "Rp " + Math.round(a / 1e3) + " rb";
  return rp(n);
};
export const isOut = (t: Tx) => t.type === "out" || t.type === "sd";

/* ---------------- hitungan turunan ---------------- */

export function balances(txs: Tx[]): Record<string, number> {
  const b: Record<string, number> = Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.init]));
  for (const t of txs) {
    if (t.type === "in") b[t.acc] += t.amt;
    else if (t.type === "tf") {
      b[t.acc] -= t.amt;
      if (t.to) b[t.to] += t.amt;
    } else b[t.acc] -= t.amt;
  }
  return b;
}
export const totalIn = (txs: Tx[]) => txs.filter((t) => t.type === "in").reduce((s, t) => s + t.amt, 0);
export const totalOut = (txs: Tx[]) => txs.filter(isOut).reduce((s, t) => s + t.amt, 0);
export const spentBy = (txs: Tx[], cat: string) => txs.filter((t) => t.type === "out" && t.cat === cat).reduce((s, t) => s + t.amt, 0);

/* ---------------- Asisten: teks bebas → transaksi ---------------- */

const KW: Record<Exclude<TxType, "tf">, [string, RegExp][]> = {
  out: [
    ["Makan", /makan|nasi|bakso|sate|mie|ayam|sarapan|siang|malam/],
    ["Minuman", /kopi|teh|boba|minum|starbucks|jus/],
    ["Bensin", /bensin|pertalite|pertamax|bbm/],
    ["Parkir & Tol", /parkir|tol/],
    ["Langganan", /netflix|spotify|youtube|langganan|icloud/],
    ["Listrik", /listrik|pln|token/],
    ["Pulsa & Data", /pulsa|kuota|paket data/],
    ["Belanja", /belanja|indomaret|alfamart|supermarket|shopee|tokopedia/],
    ["Obat", /obat|apotek|vitamin/],
    ["Kesehatan", /dokter|klinik|rumah sakit/],
    ["Transport", /grab|gojek|ojek|taksi|kereta|krl|bus/],
    ["Hiburan", /nonton|bioskop|konser/],
    ["Pendidikan", /sekolah|spp/],
    ["Pakaian", /baju|celana|sepatu/],
  ],
  in: [
    ["Gaji", /gaji/],
    ["Bonus", /bonus/],
    ["THR", /thr/],
    ["Penjualan", /jual/],
    ["Freelance", /freelance|proyek|project/],
  ],
  sd: [
    ["Zakat", /zakat/],
    ["Infaq", /infaq|infak/],
    ["Wakaf", /wakaf/],
    ["Qurban", /qurban/],
    ["Donasi", /donasi/],
    ["Sedekah", /sedekah/],
  ],
};

export const AS_EXAMPLES = [
  "Makan siang 35rb pakai GoPay",
  "Gajian 10 juta masuk BCA",
  "Transfer 500rb dari BCA ke Mandiri",
  "Beli kopi 25rb, bensin 100rb pakai BCA",
  "Infaq Jumat 50rb tunai",
];

/** Pecah kalimat jadi satu/lebih transaksi (tanpa AI — aturan kata kunci, sama seperti prototype). */
export function parseTx(text: string, by: string): Tx[] {
  const accsIn = (s: string) => {
    const l = " " + s.toLowerCase() + " ";
    return ACCOUNTS.map((a) => ({ a, i: Math.min(...a.keys.map((k) => (l.indexOf(k) < 0 ? 1e9 : l.indexOf(k)))) }))
      .filter((x) => x.i < 1e9)
      .sort((x, y) => x.i - y.i)
      .map((x) => x.a);
  };
  const global = accsIn(text);
  const isTf = /transfer|\btf\b|pindah/i.test(text);
  const parts = isTf
    ? [text]
    : text
        .split(/,|;|\n|\sdan\s/i)
        .map((s) => s.trim())
        .filter(Boolean);
  const out: Tx[] = [];
  parts.forEach((p, i) => {
    const l = p.toLowerCase();
    let amt = 0;
    const dotted = l.match(/\d{1,3}(?:\.\d{3})+/);
    if (dotted) amt = parseInt(dotted[0].replace(/\./g, ""), 10);
    else {
      const mm = l.match(/(\d+(?:[.,]\d+)?)\s*(rb|ribu|k|jt|juta)?(?![a-z])/);
      if (mm) {
        let v = parseFloat(mm[1].replace(",", "."));
        const u = mm[2] || "";
        if (/rb|ribu|k/.test(u)) v *= 1e3;
        else if (/jt|juta/.test(u)) v *= 1e6;
        else if (v < 1000) v *= 1e3;
        amt = Math.round(v);
      }
    }
    if (!amt) return;
    let type: TxType = "out";
    if (isTf) type = "tf";
    else if (/sedekah|infaq|infak|zakat|wakaf|donasi|qurban/.test(l)) type = "sd";
    else if (/gaji|gajian|terima|dapat|bonus|thr|jual|masuk/.test(l)) type = "in";
    const own = accsIn(p);
    const acc = type === "tf" ? (global[0] || ACCOUNTS[1]).id : (own[0] || global[0] || ACCOUNTS[0]).id;
    const to = type === "tf" ? (global[1] || ACCOUNTS.find((a) => a.id !== acc)!).id : undefined;
    const hit = type === "tf" ? null : KW[type].find(([, re]) => re.test(l));
    const cat = type === "tf" ? "" : hit ? hit[0] : type === "sd" ? "Sedekah" : "Lainnya";
    let note = p
      .replace(/\d{1,3}(?:\.\d{3})+|\d+(?:[.,]\d+)?\s*(rb|ribu|k|jt|juta)?(?![a-z])/i, "")
      .replace(/\s+/g, " ")
      .trim();
    note = note ? note[0].toUpperCase() + note.slice(1) : cat;
    out.push({ id: "p" + Date.now() + i, type, cat, note, amt, d: TODAY, by, acc, to });
  });
  return out;
}
