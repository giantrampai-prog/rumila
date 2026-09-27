// Mesin simulasi Rinoya Resto (murni, tanpa grafis, deterministik dengan seed). Mengikuti PRD v1.1:
// kas bebas & komitmen, deposit terpisah, kontrak DP 40%/pelunasan 60%, bahan per batch (FEFO, kedaluwarsa),
// resep → HPP aktual, kapasitas meja/alat/staf membatasi pelayanan, marketing dengan atribusi, kepuasan
// (35% mutu + 25% kecepatan + 20% keramahan + 20% kebersihan), reputasi, laporan harian & temuan.

import {
  CANDIDATES,
  CHANNELS,
  CONTRACTORS,
  DECOR,
  EQUIPMENT,
  GRANT,
  INTERVALS,
  INTERVAL_MIN,
  LOCATIONS,
  MENUS,
  ROLE_NAME,
  STORAGE_CAP,
  TABLE_COST,
  TRAINING_COST,
  TRAIN_ATTR,
  UTILITY,
  VENDORS,
  START_CASH,
  type Ingredient,
  type Menu,
  type Role,
  type Segment,
  type Station,
} from './data';

/* ---------------- RNG ber-seed ---------------- */

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- keadaan ---------------- */

export interface Batch {
  ing: Ingredient;
  qty: number;
  unitCost: number; // koin per unit (bisa pecahan, dicatat ×100 untuk bilangan bulat)
  quality: number;
  expiry: number; // hari terakhir boleh dipakai
}

export interface StaffMember {
  id: string;
  name: string;
  role: Role;
  speed: number;
  accuracy: number;
  friendly: number;
  clean: number;
  wage: number;
  trainedDay: number;
}

export interface PendingPO {
  vendor: string;
  arriveDay: number;
  batches: Batch[];
  cost: number;
}

export interface LedgerEntry {
  day: number;
  type: string;
  amount: number; // + masuk, − keluar
  reason: string;
}

export interface Finding {
  icon: string;
  text: string;
  good?: boolean;
}

export interface DayReport {
  day: number;
  arrivals: number;
  served: number;
  lostQueue: number;
  lostStock: number;
  lostSeat: number;
  grossSales: number;
  discount: number;
  refunds: number;
  netSales: number;
  hpp: number;
  contribution: number;
  waste: number;
  wages: number;
  rent: number;
  utility: number;
  marketing: number;
  training: number;
  result: number;
  cashStart: number;
  cashEnd: number;
  avgWait: number;
  satisfaction: number;
  reputation: number;
  sold: Record<string, number>;
  campaignArrivals: number;
  findings: Finding[];
}

export type Phase = 'plan' | 'build' | 'prep' | 'open' | 'review';

export interface RestoState {
  v: 1;
  seed: number;
  name: string;
  concept: string;
  day: number;
  phase: Phase;
  cash: number;
  deposit: number;
  location: string | null;
  contractor: string | null;
  contractTotal: number;
  contractPaid: number;
  buildLeft: number;
  handed: boolean;
  equipment: string[];
  tables: number;
  decor: string;
  batches: Batch[];
  pending: PendingPO[];
  menu: Record<string, { active: boolean; price: number }>;
  staff: StaffMember[];
  campaign: { day: number; channel: string; discount: number } | null;
  reputation: number;
  ledger: LedgerEntry[];
  reports: DayReport[];
  grantUsed: boolean;
  /** biaya persiapan hari ini (training, marketing) yang belum masuk laporan */
  todayTraining: number;
  /** nilai bahan kedaluwarsa yang dibuang, dilaporkan pada tutup hari berikutnya */
  wasteCarry: number;
}

export function newGame(seed = 1): RestoState {
  const menu: RestoState['menu'] = {};
  for (const m of MENUS) menu[m.id] = { active: false, price: m.price };
  return {
    v: 1,
    seed,
    name: 'Rinoya Resto',
    concept: 'kedai-ramen',
    day: 1,
    phase: 'plan',
    cash: START_CASH,
    deposit: 0,
    location: null,
    contractor: null,
    contractTotal: 0,
    contractPaid: 0,
    buildLeft: 0,
    handed: false,
    equipment: [],
    tables: 0,
    decor: 'polos',
    batches: [],
    pending: [],
    menu,
    staff: [],
    campaign: null,
    reputation: 60,
    ledger: [],
    reports: [],
    grantUsed: false,
    todayTraining: 0,
    wasteCarry: 0,
  };
}

export type Result = { ok: true; msg?: string } | { ok: false; msg: string };
const fail = (msg: string): Result => ({ ok: false, msg });
const ok = (msg?: string): Result => ({ ok: true, msg });

const loc = (s: RestoState) => LOCATIONS.find((l) => l.id === s.location) ?? null;

/** komitmen kontrak yang belum dibayar */
export const commitments = (s: RestoState) => s.contractTotal - s.contractPaid;
/** kas bebas = kas − komitmen (deposit & stok tidak termasuk) */
export const freeCash = (s: RestoState) => s.cash - commitments(s);

export const wagesPerDay = (s: RestoState) => s.staff.reduce((a, m) => a + m.wage, 0);
export const fixedDaily = (s: RestoState) => wagesPerDay(s) + (loc(s)?.rent ?? 0) + UTILITY;

function pay(s: RestoState, amount: number, type: string, reason: string) {
  s.cash -= amount;
  s.ledger.push({ day: s.day, type, amount: -amount, reason });
}
function receive(s: RestoState, amount: number, type: string, reason: string) {
  s.cash += amount;
  s.ledger.push({ day: s.day, type, amount, reason });
}

function spend(s: RestoState, amount: number, type: string, reason: string): Result {
  if (amount > freeCash(s)) return fail(`Uang bebas kurang. Butuh ${amount}, tersedia ${freeCash(s)}.`);
  pay(s, amount, type, reason);
  return ok();
}

/* ---------------- perencanaan & pembangunan ---------------- */

export function chooseLocation(s: RestoState, id: string): Result {
  if (s.location) return fail('Lokasi sudah dipilih untuk kampanye ini.');
  const l = LOCATIONS.find((x) => x.id === id);
  if (!l) return fail('Lokasi tidak ditemukan.');
  if (l.deposit > freeCash(s)) return fail('Uang tidak cukup untuk deposit.');
  s.cash -= l.deposit;
  s.deposit = l.deposit;
  s.ledger.push({ day: s.day, type: 'deposit', amount: -l.deposit, reason: `Deposit sewa ${l.name} (ditahan, bukan biaya)` });
  s.location = id;
  return ok(`Lokasi ${l.name} disewa.`);
}

export function signContract(s: RestoState, id: string): Result {
  if (!s.location) return fail('Pilih lokasi dulu.');
  if (s.contractor) return fail('Kontrak sudah ditandatangani.');
  const c = CONTRACTORS.find((x) => x.id === id);
  if (!c) return fail('Kontraktor tidak ditemukan.');
  if (c.cost > freeCash(s)) return fail('Uang bebas tidak cukup untuk seluruh nilai kontrak.');
  s.contractor = id;
  s.contractTotal = c.cost;
  const dp = Math.round(c.cost * 0.4);
  pay(s, dp, 'kontrak', `DP 40% ${c.name}`);
  s.contractPaid = dp;
  s.buildLeft = c.days;
  s.phase = 'build';
  return ok(`Kontrak ${c.name} disetujui. DP ${dp} dibayar; sisa ${c.cost - dp} menjadi komitmen.`);
}

/** Maju satu hari persiapan: bayar sewa, terima bahan yang dipesan, pembangunan berlanjut. */
export function advanceDay(s: RestoState): Result {
  if (s.phase === 'open') return fail('Restoran sedang buka.');
  const l = loc(s);
  s.day += 1;
  if (l) pay(s, l.rent, 'sewa', `Sewa hari ke-${s.day}`);
  if (s.phase === 'build') {
    s.buildLeft -= 1;
    if (s.buildLeft <= 0) {
      const rest = s.contractTotal - s.contractPaid;
      pay(s, rest, 'kontrak', 'Pelunasan 60% saat serah terima');
      s.contractPaid = s.contractTotal;
      s.handed = true;
      s.phase = 'prep';
    }
  }
  if (s.phase === 'review') s.phase = 'prep';
  receivePOs(s);
  expire(s);
  s.todayTraining = 0;
  return ok();
}

export function buyEquipment(s: RestoState, id: string): Result {
  if (s.equipment.includes(id)) return fail('Alat ini sudah dimiliki.');
  const e = EQUIPMENT.find((x) => x.id === id);
  if (!e) return fail('Alat tidak ditemukan.');
  const r = spend(s, e.cost, 'alat', `Beli ${e.name}`);
  if (r.ok) s.equipment.push(id);
  return r;
}

export function buyTables(s: RestoState, n: number): Result {
  const l = loc(s);
  if (!l) return fail('Pilih lokasi dulu.');
  if ((s.tables + n) * 4 > l.maxSeats) return fail(`Lahan hanya muat ${l.maxSeats} kursi (${l.maxSeats / 4} meja).`);
  const r = spend(s, TABLE_COST * n, 'furnitur', `Beli ${n} meja & kursi`);
  if (r.ok) s.tables += n;
  return r;
}

export function setDecor(s: RestoState, id: string): Result {
  const cur = DECOR.find((d) => d.id === s.decor)!;
  const d = DECOR.find((x) => x.id === id);
  if (!d) return fail('Dekorasi tidak ditemukan.');
  const diff = d.cost - cur.cost;
  if (diff > 0) {
    const r = spend(s, diff, 'dekorasi', `Dekorasi ${d.name}`);
    if (!r.ok) return r;
  }
  s.decor = id;
  return ok();
}

/* ---------------- bahan & menu ---------------- */

export const stockOf = (s: RestoState, ing: Ingredient) => s.batches.reduce((a, b) => a + (b.ing === ing ? b.qty : 0), 0);
export const stockTotal = (s: RestoState) => s.batches.reduce((a, b) => a + b.qty, 0) + s.pending.reduce((a, p) => a + p.batches.reduce((x, b) => x + b.qty, 0), 0);

/** porsi yang bisa dibuat dari stok sekarang */
export function portionsAvailable(s: RestoState, m: Menu) {
  let n = Infinity;
  for (const [ing, q] of Object.entries(m.recipe)) n = Math.min(n, Math.floor(stockOf(s, ing as Ingredient) / (q ?? 1)));
  return n === Infinity ? 0 : n;
}

/** Biaya bahan per porsi memakai harga batch yang ada (FEFO); tanpa stok memakai harga vendor Segar Andal. */
export function portionCost(s: RestoState, m: Menu) {
  let c = 0,
    est = false;
  for (const [ing, q] of Object.entries(m.recipe)) {
    const bs = s.batches.filter((b) => b.ing === ing && b.qty > 0).sort((a, b) => a.expiry - b.expiry);
    if (!bs.length) {
      est = true;
      c += q ?? 0;
    } else c += (q ?? 0) * bs[0].unitCost;
  }
  return { cost: Math.round(c), est };
}

export function placeOrder(s: RestoState, vendorId: string, portions: Record<string, number>): Result {
  if (!s.equipment.includes('kulkas')) return fail('Beli kulkas bahan dulu untuk menyimpan stok.');
  const v = VENDORS.find((x) => x.id === vendorId);
  if (!v) return fail('Vendor tidak ditemukan.');
  const units: Partial<Record<Ingredient, number>> = {};
  for (const [mid, n] of Object.entries(portions)) {
    const m = MENUS.find((x) => x.id === mid);
    if (!m || n <= 0) continue;
    for (const [ing, q] of Object.entries(m.recipe)) units[ing as Ingredient] = (units[ing as Ingredient] ?? 0) + (q ?? 0) * n;
  }
  const qty = Object.values(units).reduce((a, b) => a + (b ?? 0), 0);
  if (!qty) return fail('Belum ada bahan yang dipesan.');
  const cost = Math.round(qty * v.mult);
  if (cost < v.min) return fail(`Belanja minimum ${v.name} adalah ${v.min} koin.`);
  if (stockTotal(s) + qty > STORAGE_CAP) return fail(`Kulkas penuh. Muat ${STORAGE_CAP} unit, sekarang ${stockTotal(s)}.`);
  const r = spend(s, cost, 'bahan', `Belanja bahan ${v.name}`);
  if (!r.ok) return r;
  const arriveDay = v.sameDay ? s.day : s.day + 1;
  const batches: Batch[] = Object.entries(units).map(([ing, q]) => ({ ing: ing as Ingredient, qty: q ?? 0, unitCost: v.mult, quality: v.quality, expiry: arriveDay + v.shelf - 1 }));
  s.pending.push({ vendor: v.id, arriveDay, batches, cost });
  receivePOs(s);
  return ok(v.sameDay ? 'Bahan datang hari ini!' : 'Bahan akan datang besok pagi.');
}

function receivePOs(s: RestoState) {
  const here = s.pending.filter((p) => p.arriveDay <= s.day);
  s.pending = s.pending.filter((p) => p.arriveDay > s.day);
  for (const p of here) s.batches.push(...p.batches.map((b) => ({ ...b })));
}

/** Bahan yang lewat masa pakainya dibuang (dicatat sebagai waste pada laporan hari berikutnya). */
function expire(s: RestoState) {
  for (const b of s.batches) if (b.expiry < s.day && b.qty > 0) s.wasteCarry += Math.round(b.qty * b.unitCost);
  s.batches = s.batches.filter((b) => b.expiry >= s.day && b.qty > 0);
}

/** Ambil bahan satu porsi (FEFO). Kembalikan biaya & mutu rata-rata, atau null bila kurang. */
function consume(s: RestoState, m: Menu): { cost: number; quality: number } | null {
  if (portionsAvailable(s, m) < 1) return null;
  let cost = 0,
    qsum = 0,
    qn = 0;
  for (const [ing, need0] of Object.entries(m.recipe)) {
    let need = need0 ?? 0;
    const bs = s.batches.filter((b) => b.ing === ing && b.qty > 0).sort((a, b) => a.expiry - b.expiry);
    for (const b of bs) {
      const take = Math.min(need, b.qty);
      b.qty -= take;
      need -= take;
      cost += take * b.unitCost;
      qsum += b.quality * take;
      qn += take;
      if (need <= 0) break;
    }
  }
  s.batches = s.batches.filter((b) => b.qty > 0);
  return { cost, quality: qn ? qsum / qn : 70 };
}

export function setMenu(s: RestoState, id: string, patch: Partial<{ active: boolean; price: number }>): Result {
  const m = MENUS.find((x) => x.id === id)!;
  if (patch.active && !stationOwned(s, m)) return fail(`Butuh alat: ${stationName(m.station)}.`);
  if (patch.price !== undefined) patch.price = Math.max(5, Math.round(patch.price));
  s.menu[id] = { ...s.menu[id], ...patch };
  return ok();
}

const STATION_EQ: Record<Station, string> = { goreng: 'goreng', kompor: 'kompor', sushi: 'sushi', minum: 'minum' };
export const stationName = (st: Station) => EQUIPMENT.find((e) => e.id === STATION_EQ[st])!.name;
export const stationOwned = (s: RestoState, m: Menu) => s.equipment.includes(STATION_EQ[m.station]) && (!m.recipe.nasi || s.equipment.includes('ricecooker'));

/* ---------------- tim ---------------- */

export function hire(s: RestoState, candId: string): Result {
  const c = CANDIDATES.find((x) => x.id === candId);
  if (!c) return fail('Kandidat tidak ditemukan.');
  if (s.staff.some((m) => m.id === candId)) return fail('Sudah bekerja di restoranmu.');
  s.staff.push({ ...c, trainedDay: 0 });
  return ok(`${c.name} bergabung sebagai ${ROLE_NAME[c.role]}.`);
}

export function fire(s: RestoState, id: string): Result {
  s.staff = s.staff.filter((m) => m.id !== id);
  return ok();
}

export function train(s: RestoState, id: string): Result {
  const m = s.staff.find((x) => x.id === id);
  if (!m) return fail('Staf tidak ditemukan.');
  if (m.trainedDay === s.day) return fail('Satu staf hanya bisa ikut satu training per hari.');
  const attr = TRAIN_ATTR[m.role];
  if (m[attr] >= 80) return fail('Training dasar sudah maksimal (80).');
  const r = spend(s, TRAINING_COST, 'training', `Training ${m.name}`);
  if (!r.ok) return r;
  m[attr] = Math.min(80, m[attr] + 10);
  m.trainedDay = s.day;
  s.todayTraining += TRAINING_COST;
  return ok(`${m.name} makin terampil! (${attr} +10)`);
}

/* ---------------- marketing ---------------- */

export function setCampaign(s: RestoState, channel: string | null, discount = 0): Result {
  if (!channel) {
    s.campaign = null;
    return ok();
  }
  const c = CHANNELS.find((x) => x.id === channel);
  if (!c) return fail('Kanal tidak ditemukan.');
  if (c.cost > freeCash(s)) return fail('Uang bebas tidak cukup untuk kampanye hari ini.');
  s.campaign = { day: s.day, channel, discount: Math.max(0, Math.min(0.3, discount)) };
  return ok();
}

/* ---------------- checklist buka ---------------- */

export interface Check {
  id: string;
  label: string;
  ok: boolean;
  go: string;
}

/** Minimal porsi per menu aktif agar boleh buka. */
export const MIN_OPEN_PORTIONS = 5;

/** Menu aktif yang stoknya belum cukup untuk buka hari ini. */
export function shortMenus(s: RestoState) {
  return MENUS.filter((m) => s.menu[m.id].active && portionsAvailable(s, m) < MIN_OPEN_PORTIONS);
}

/** Bahan yang sudah dipesan tapi baru datang besok. */
export const hasPendingOrder = (s: RestoState) => s.pending.some((p) => p.arriveDay > s.day);

function stockLabel(s: RestoState, active: Menu[]) {
  const short = active.filter((m) => portionsAvailable(s, m) < MIN_OPEN_PORTIONS);
  if (!short.length) return `Stok bahan cukup untuk menu aktif (min ${MIN_OPEN_PORTIONS} porsi)`;
  const list = short.map((m) => `${m.name} ${portionsAvailable(s, m)}/${MIN_OPEN_PORTIONS}`).join(', ');
  const why = hasPendingOrder(s) ? ' — pesananmu baru datang besok. Pakai vendor Kilat agar datang hari ini, atau matikan menu itu.' : ' — belanja di Bahan (vendor Kilat datang hari ini), atau matikan menu itu.';
  return `Stok kurang: ${list}${why}`;
}

export function checklist(s: RestoState): Check[] {
  const active = MENUS.filter((m) => s.menu[m.id].active);
  const roles: Role[] = ['kasir', 'koki', 'pelayan', 'kebersihan'];
  return [
    { id: 'handed', label: 'Bangunan selesai & diserahkan', ok: s.handed, go: 'bangun' },
    { id: 'kasir', label: 'Ada meja kasir & kulkas bahan', ok: s.equipment.includes('kasir') && s.equipment.includes('kulkas'), go: 'bangun' },
    { id: 'meja', label: 'Minimal 2 meja makan', ok: s.tables >= 2, go: 'bangun' },
    { id: 'menu', label: 'Minimal 2 menu aktif (1 makanan)', ok: active.length >= 2 && active.some((m) => m.id !== 'ocha'), go: 'menu' },
    { id: 'stok', label: stockLabel(s, active), ok: active.length > 0 && active.every((m) => portionsAvailable(s, m) >= MIN_OPEN_PORTIONS), go: 'bahan' },
    { id: 'tim', label: 'Keempat peran terisi', ok: roles.every((r) => s.staff.some((m) => m.role === r)), go: 'tim' },
    { id: 'kas', label: `Uang cadangan ≥ 2× biaya harian (${2 * fixedDaily(s)})`, ok: freeCash(s) >= 2 * fixedDaily(s), go: 'uang' },
  ];
}

export const canOpen = (s: RestoState) => s.phase === 'prep' && checklist(s).every((c) => c.ok);

/** Hibah belajar satu kali per kampanye bila uang menipis (bukan penjualan). */
export function takeGrant(s: RestoState): Result {
  if (s.grantUsed) return fail('Hibah belajar sudah dipakai.');
  receive(s, GRANT, 'hibah', 'Hibah belajar (bukan penjualan)');
  s.grantUsed = true;
  return ok('Hibah belajar 3.000 koin diterima. Gunakan dengan bijak!');
}

/* ---------------- hari buka (simulasi berjalan) ---------------- */

export type GroupState = 'queue' | 'order' | 'seat' | 'wait' | 'eat' | 'leave' | 'gone';

export interface Group {
  id: number;
  seg: Segment;
  size: number;
  campaign: boolean;
  state: GroupState;
  t: number; // menit virtual dalam status sekarang
  patience: number;
  table: number;
  items: { menu: string; done: boolean; station: Station; cost: number; quality: number; price: number }[];
  orderedAt: number;
  servedAt: number;
  satisfaction: number;
  why?: 'antre' | 'stok' | 'kursi';
}

export interface DayRun {
  clock: number; // menit sejak 10.00
  rand: () => number;
  groups: Group[];
  nextId: number;
  spawn: number[]; // menit kedatangan terjadwal
  spawnCampaign: boolean[];
  tables: { dirty: boolean; group: number | null; cleanT: number }[];
  cooks: { id: string; item: [number, number] | null; t: number; need: number }[];
  counterBusy: number | null;
  stats: {
    arrivals: number;
    campaignArrivals: number;
    served: number;
    lostQueue: number;
    lostStock: number;
    lostSeat: number;
    gross: number;
    discount: number;
    refunds: number;
    hpp: number;
    waste: number;
    waitSum: number;
    satSum: number;
    sold: Record<string, number>;
    remake: number;
  };
  cashStart: number;
  events: { t: number; kind: string; text: string }[];
  done: boolean;
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 50);
const f = (x: number) => 100 / (x + 50); // pengali waktu dari atribut kecepatan (50 → 1×)

function priceFit(price: number, base: number) {
  const r = price / base;
  return Math.max(0.6, Math.min(1.2, 1.4 - 0.5 * r));
}

export function openDay(s: RestoState): DayRun | null {
  if (!canOpen(s)) return null;
  s.phase = 'open';
  const l = loc(s)!;
  const R = rng(s.seed * 7919 + s.day * 104729);
  const active = MENUS.filter((m) => s.menu[m.id].active);
  const menuFit = (seg: Segment) => Math.max(0.5, Math.min(1.2, avg(active.map((m) => m.fit[seg])) * (0.8 + 0.1 * Math.min(4, active.length))));
  const pf = avg(active.map((m) => priceFit(s.menu[m.id].price, m.price)));
  const rep = 0.5 + (s.reputation / 100) * 0.7;
  const decor = DECOR.find((d) => d.id === s.decor)!.appeal;
  const ch = s.campaign && s.campaign.day === s.day ? CHANNELS.find((c) => c.id === s.campaign!.channel)! : null;
  const disc = ch ? s.campaign!.discount : 0;
  const spawn: number[] = [],
    spawnC: boolean[] = [];
  for (let i = 0; i < INTERVALS; i++) {
    const segAvg = (Object.keys(l.mix) as Segment[]).reduce((a, g) => a + l.mix[g] * menuFit(g), 0);
    const organic = l.base[i] * segAvg * (pf + disc * 0.6) * rep * decor;
    const segMatch = ch ? (Object.keys(l.mix) as Segment[]).reduce((a, g) => a + l.mix[g] * ch.seg[g], 0) : 0;
    const camp = ch ? (ch.reach / INTERVALS) * segMatch * 0.02 * (1 + disc * 3) : 0;
    for (const [expv, isC] of [
      [organic, false],
      [camp, true],
    ] as const) {
      const n = Math.floor(expv) + (R() < expv - Math.floor(expv) ? 1 : 0);
      for (let k = 0; k < n; k++) {
        spawn.push(i * INTERVAL_MIN + R() * INTERVAL_MIN);
        spawnC.push(isC);
      }
    }
  }
  const order = spawn.map((t, i) => [t, spawnC[i]] as const).sort((a, b) => a[0] - b[0]);
  const cooks = s.staff.filter((m) => m.role === 'koki').map((m) => ({ id: m.id, item: null, t: 0, need: 0 }));
  return {
    clock: 0,
    rand: R,
    groups: [],
    nextId: 1,
    spawn: order.map((o) => o[0]),
    spawnCampaign: order.map((o) => o[1]),
    tables: Array.from({ length: s.tables }, () => ({ dirty: false, group: null, cleanT: 0 })),
    cooks,
    counterBusy: null,
    stats: { arrivals: 0, campaignArrivals: 0, served: 0, lostQueue: 0, lostStock: 0, lostSeat: 0, gross: 0, discount: 0, refunds: 0, hpp: 0, waste: 0, waitSum: 0, satSum: 0, sold: {}, remake: 0 },
    cashStart: s.cash,
    events: [],
    done: false,
  };
}

const CLOSE = INTERVALS * INTERVAL_MIN; // 360 menit

/** Majukan simulasi `dm` menit virtual (dipanggil dengan langkah kecil, mis. 0,1). */
export function stepDay(s: RestoState, run: DayRun, dm: number) {
  if (run.done) return;
  run.clock += dm;
  const R = run.rand;
  const ev = (kind: string, text: string) => {
    run.events.push({ t: run.clock, kind, text });
    if (run.events.length > 40) run.events.shift();
  };
  const staff = (role: Role) => s.staff.filter((m) => m.role === role);
  const kasir = staff('kasir'),
    pelayan = staff('pelayan'),
    bersih = staff('kebersihan');
  const kasirSpeed = avg(kasir.map((m) => m.speed)),
    kasirAcc = avg(kasir.map((m) => m.accuracy));
  const pelSpeed = avg(pelayan.map((m) => m.speed));
  const friendly = avg([...kasir, ...pelayan].map((m) => m.friendly));
  const cleanAttr = avg(bersih.map((m) => m.clean));
  const disc = s.campaign && s.campaign.day === s.day ? s.campaign.discount : 0;

  // kedatangan
  while (run.spawn.length && run.spawn[0] <= run.clock && run.clock < CLOSE) {
    run.spawn.shift();
    const isC = run.spawnCampaign.shift()!;
    const l = loc(s)!;
    const x = R();
    let acc = 0,
      seg: Segment = 'keluarga';
    for (const g of Object.keys(l.mix) as Segment[]) {
      acc += l.mix[g];
      if (x <= acc) {
        seg = g;
        break;
      }
    }
    const size = seg === 'keluarga' ? 2 + Math.floor(R() * 3) : seg === 'pelajar' ? 1 + Math.floor(R() * 3) : 1 + Math.floor(R() * 2);
    run.groups.push({ id: run.nextId++, seg, size: Math.min(4, size), campaign: isC, state: 'queue', t: 0, patience: 20 + R() * 20, table: -1, items: [], orderedAt: 0, servedAt: 0, satisfaction: 0 });
    run.stats.arrivals++;
    if (isC) run.stats.campaignArrivals++;
  }

  // meja kotor dibersihkan
  for (const tb of run.tables)
    if (tb.dirty) {
      tb.cleanT += dm;
      if (tb.cleanT >= 3 * f(cleanAttr)) {
        tb.dirty = false;
        tb.cleanT = 0;
      }
    }

  const active = MENUS.filter((m) => s.menu[m.id].active);
  for (const g of run.groups) {
    g.t += dm;
    if (g.state === 'queue') {
      // di depan antrean & kasir kosong → pesan; kalau tidak ada meja bersih, tetap menunggu
      const head = run.groups.find((x) => x.state === 'queue');
      const freeTable = run.tables.findIndex((tb) => !tb.dirty && tb.group === null);
      if (head === g && run.counterBusy === null && freeTable >= 0 && run.clock < CLOSE + 20) {
        g.state = 'order';
        g.t = 0;
        g.table = freeTable;
        run.tables[freeTable].group = g.id;
        run.counterBusy = g.id;
      } else if (g.t > g.patience) {
        g.state = 'gone';
        g.why = freeTable < 0 ? 'kursi' : 'antre';
        if (g.why === 'kursi') run.stats.lostSeat++;
        else run.stats.lostQueue++;
        ev('pergi', g.why === 'kursi' ? 'Meja penuh, pelanggan pergi.' : 'Antrean terlalu lama, pelanggan pergi.');
      }
    } else if (g.state === 'order') {
      if (g.t >= 1.5 * f(kasirSpeed)) {
        run.counterBusy = null;
        // pilih menu per orang (makanan + kadang minuman)
        for (let p = 0; p < g.size; p++) {
          const foods = active.filter((m) => m.id !== 'ocha');
          const weight = (m: Menu) => m.fit[g.seg] * priceFit(s.menu[m.id].price, m.price);
          const pick = (list: Menu[]) => {
            const tot = list.reduce((a, m) => a + weight(m), 0);
            let x = R() * tot;
            for (const m of list) if ((x -= weight(m)) <= 0) return m;
            return list[list.length - 1];
          };
          const wants: Menu[] = [];
          if (foods.length) wants.push(pick(foods));
          if (active.some((m) => m.id === 'ocha') && R() < 0.55) wants.push(MENUS.find((m) => m.id === 'ocha')!);
          for (const m0 of wants) {
            let m = m0;
            let got = consume(s, m);
            if (!got) {
              const alt = foods.filter((x) => x.id !== m.id && portionsAvailable(s, x) > 0);
              if (m.id !== 'ocha' && alt.length) {
                m = pick(alt);
                got = consume(s, m);
              }
            }
            if (!got) continue;
            const price = s.menu[m.id].price;
            g.items.push({ menu: m.id, done: false, station: m.station, cost: got.cost, quality: got.quality, price });
          }
        }
        if (!g.items.length) {
          run.tables[g.table].group = null;
          g.state = 'gone';
          g.why = 'stok';
          run.stats.lostStock++;
          ev('stok', 'Stok habis — pelanggan tidak jadi pesan.');
          continue;
        }
        // bayar sebelum dimasak
        const gross = g.items.reduce((a, it) => a + it.price, 0);
        const d = Math.round(gross * disc);
        receive(s, gross - d, 'penjualan', `Pesanan meja ${g.table + 1}`);
        run.stats.gross += gross;
        run.stats.discount += d;
        g.orderedAt = run.clock;
        g.state = 'seat';
        g.t = 0;
        ev('bayar', `Pesanan dibayar ${gross - d} koin.`);
        // salah input kasir → satu item dibuat ulang
        if (R() < (100 - kasirAcc) / 400) {
          const it = g.items[0];
          const m = MENUS.find((x) => x.id === it.menu)!;
          const re = consume(s, m);
          if (re) {
            run.stats.waste += Math.round(re.cost);
            run.stats.remake++;
            ev('keliru', `Pesanan keliru — ${m.name} dibuat ulang.`);
          }
        }
      }
    } else if (g.state === 'seat') {
      if (g.t >= 1) {
        g.state = 'wait';
        g.t = 0;
      }
    } else if (g.state === 'wait') {
      if (g.items.every((it) => it.done)) {
        // pelayan mengantar
        if (g.t >= 0.8 * f(pelSpeed) + (pelayan.length ? 0 : 3)) {
          g.state = 'eat';
          g.t = 0;
          g.servedAt = run.clock;
        }
      } else g.t = Math.min(g.t, 0);
    } else if (g.state === 'eat') {
      if (g.t >= 12 + g.size * 2) {
        const waitMin = g.servedAt - g.orderedAt;
        const mutu = avg(g.items.map((it) => it.quality)) * 0.85 + avg(staff('koki').map((m) => m.accuracy)) * 0.15;
        const speed = Math.max(20, Math.min(100, 100 - (waitMin - 10) * 2.7));
        const clean = Math.min(100, cleanAttr + 10);
        g.satisfaction = Math.round(0.35 * mutu + 0.25 * speed + 0.2 * friendly + 0.2 * clean);
        run.stats.served++;
        run.stats.waitSum += waitMin;
        run.stats.satSum += g.satisfaction;
        for (const it of g.items) {
          run.stats.hpp += it.cost;
          run.stats.sold[it.menu] = (run.stats.sold[it.menu] ?? 0) + 1;
        }
        run.tables[g.table].group = null;
        run.tables[g.table].dirty = true;
        g.state = 'leave';
        g.t = 0;
      }
    } else if (g.state === 'leave' && g.t > 1.5) g.state = 'gone';
  }

  // koki: ambil item antrean tertua yang alatnya tersedia (satu alat = satu masakan sekaligus)
  const busySt = new Set<Station>();
  for (const c of run.cooks) {
    const g = c.item ? run.groups.find((x) => x.id === c.item![0]) : null;
    if (g) busySt.add(g.items[c.item![1]].station);
  }
  for (const c of run.cooks) {
    const me = s.staff.find((m) => m.id === c.id)!;
    if (c.item) {
      c.t += dm;
      if (c.t >= c.need) {
        const g = run.groups.find((x) => x.id === c.item![0]);
        if (g) {
          g.items[c.item[1]].done = true;
          busySt.delete(MENUS.find((m) => m.id === g.items[c.item![1]].menu)!.station);
        }
        c.item = null;
      }
      continue;
    }
    outer: for (const g of run.groups) {
      if (g.state !== 'seat' && g.state !== 'wait') continue;
      for (let k = 0; k < g.items.length; k++) {
        const it = g.items[k];
        if (it.done || busySt.has(it.station) || run.cooks.some((o) => o.item && o.item[0] === g.id && o.item[1] === k)) continue;
        const m = MENUS.find((x) => x.id === it.menu)!;
        c.item = [g.id, k];
        c.t = 0;
        c.need = m.cook * f(me.speed);
        busySt.add(it.station);
        break outer;
      }
    }
  }

  run.groups = run.groups.filter((g) => g.state !== 'gone');
  // tutup: tidak ada lagi pelanggan & jam sudah lewat
  if (run.clock >= CLOSE) {
    for (const g of run.groups)
      if (g.state === 'queue') {
        g.state = 'gone';
      }
    const busy = run.groups.some((g) => g.state !== 'gone' && g.state !== 'leave');
    if (!busy || run.clock >= CLOSE + 45) {
      // pesanan dibayar yang belum tersaji → refund
      for (const g of run.groups)
        if (g.state === 'seat' || g.state === 'wait') {
          const back = g.items.reduce((a, it) => a + it.price, 0) - Math.round(g.items.reduce((a, it) => a + it.price, 0) * disc);
          pay(s, back, 'refund', 'Refund pesanan belum tersaji saat tutup');
          run.stats.refunds += back;
          run.stats.waste += Math.round(g.items.reduce((a, it) => a + it.cost, 0));
        }
      run.done = true;
    }
  }
}

/** Tutup hari: bayar biaya harian, susun laporan & temuan, buang bahan kedaluwarsa. */
export function closeDay(s: RestoState, run: DayRun): DayReport {
  const st = run.stats;
  const l = loc(s)!;
  const wages = wagesPerDay(s);
  pay(s, wages, 'upah', 'Upah tim hari ini');
  pay(s, UTILITY, 'utilitas', 'Listrik & air (fiktif)');
  let marketing = 0;
  if (s.campaign && s.campaign.day === s.day) {
    marketing = CHANNELS.find((c) => c.id === s.campaign!.channel)!.cost;
    pay(s, marketing, 'marketing', 'Kampanye hari ini');
  }
  const waste = Math.round(st.waste + s.wasteCarry);
  s.wasteCarry = 0;
  const netSales = st.gross - st.discount - st.refunds;
  const hpp = Math.round(st.hpp);
  const contribution = netSales - hpp;
  const rent = l.rent;
  const training = s.todayTraining;
  const result = contribution - waste - wages - rent - UTILITY - marketing - training;
  const satisfaction = st.served ? Math.round(st.satSum / st.served) : 0;
  if (st.served) s.reputation = Math.round(0.8 * s.reputation + 0.2 * satisfaction);
  const findings: Finding[] = [];
  if (st.lostQueue >= 3) findings.push({ icon: 'hourglass_top', text: `${st.lostQueue} kelompok pergi karena antrean lama. Latih kasir atau kurangi promo dulu.` });
  if (st.lostSeat >= 3) findings.push({ icon: 'table_restaurant', text: `${st.lostSeat} kelompok pergi karena meja penuh. Tambah meja atau percepat pembersihan.` });
  if (st.lostStock >= 1) findings.push({ icon: 'inventory_2', text: `${st.lostStock} kelompok batal karena stok habis. Pesan bahan lebih banyak, atau pakai vendor Kilat saat darurat.` });
  const avgWait = st.served ? st.waitSum / st.served : 0;
  if (avgWait > 18) findings.push({ icon: 'skillet', text: `Makanan rata-rata ${Math.round(avgWait)} menit baru tersaji. Latih koki atau tambah koki/alat.` });
  for (const m of MENUS)
    if (s.menu[m.id].active && s.menu[m.id].price <= portionCost(s, m).cost) findings.push({ icon: 'warning', text: `Harga ${m.name} di bawah biaya bahan — setiap porsi rugi!` });
  if (waste > 200) findings.push({ icon: 'delete', text: `Ada ${waste} koin bahan terbuang. Pesan bahan secukupnya sesuai perkiraan penjualan.` });
  if (result < 0 && netSales > 0) findings.push({ icon: 'trending_down', text: 'Ramai belum tentu untung: biaya hari ini lebih besar dari kontribusi. Cek harga, promo, dan jumlah staf.' });
  if (satisfaction >= 80) findings.push({ icon: 'sentiment_very_satisfied', text: `Pelanggan puas (${satisfaction}/100)! Reputasi naik — mereka mungkin kembali.`, good: true });
  if (result > 0) findings.push({ icon: 'savings', text: `Hasil usaha positif ${result} koin. Hebat!`, good: true });
  const rep: DayReport = {
    day: s.day,
    arrivals: st.arrivals,
    served: st.served,
    lostQueue: st.lostQueue,
    lostStock: st.lostStock,
    lostSeat: st.lostSeat,
    grossSales: st.gross,
    discount: st.discount,
    refunds: st.refunds,
    netSales,
    hpp,
    contribution,
    waste,
    wages,
    rent,
    utility: UTILITY,
    marketing,
    training,
    result,
    cashStart: run.cashStart,
    cashEnd: s.cash,
    avgWait: Math.round(avgWait),
    satisfaction,
    reputation: s.reputation,
    sold: st.sold,
    campaignArrivals: st.campaignArrivals,
    findings: findings.slice(0, 3),
  };
  s.reports.push(rep);
  s.campaign = null;
  s.phase = 'review';
  return rep;
}

/* ---------------- contoh hitungan PRD Bagian 16 (untuk uji) ---------------- */

export function exampleDay() {
  const cashStart = 10000,
    stockStart = 2000;
  const sold = 50,
    price = 80,
    cost = 35;
  const purchase = 1000,
    wages = 600,
    rent = 180,
    util = 120,
    marketing = 100;
  const sales = sold * price;
  const hpp = sold * cost;
  const contribution = sales - hpp;
  const opex = wages + rent + util + marketing;
  const result = contribution - opex;
  const cashEnd = cashStart + sales - purchase - opex;
  const stockEnd = stockStart + purchase - hpp;
  return { sales, hpp, contribution, opex, result, cashEnd, stockEnd, breakEven: Math.ceil(opex / (price - cost)), breakEvenPromo: Math.ceil(opex / (Math.round(price * 0.9) - cost)) };
}
