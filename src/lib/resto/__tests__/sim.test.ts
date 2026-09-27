import { describe, expect, it } from 'vitest';
import { MENUS, START_CASH, recipeCost } from '../data';
import * as S from '../sim';

function readyGame(seed = 7) {
  const s = S.newGame(seed);
  S.chooseLocation(s, 'sekolah');
  S.signContract(s, 'standar');
  while (!s.handed) S.advanceDay(s);
  for (const e of ['ricecooker', 'goreng', 'minum', 'kasir', 'kulkas', 'sushi']) expect(S.buyEquipment(s, e).ok).toBe(true);
  expect(S.buyTables(s, 5).ok).toBe(true);
  for (const c of ['c1', 'c3', 'c5', 'c7']) S.hire(s, c);
  S.setMenu(s, 'katsu', { active: true });
  S.setMenu(s, 'onigiri', { active: true });
  S.setMenu(s, 'ocha', { active: true });
  expect(S.placeOrder(s, 'kilat', { katsu: 30, onigiri: 25, ocha: 30 }).ok).toBe(true);
  return s;
}

function playDay(s: S.RestoState) {
  const run = S.openDay(s)!;
  expect(run).not.toBeNull();
  let guard = 0;
  while (!run.done && guard++ < 10000) S.stepDay(s, run, 0.25);
  return S.closeDay(s, run);
}

describe('Rinoya Resto — simulasi', () => {
  it('contoh hitungan PRD Bagian 16 (AC13)', () => {
    const e = S.exampleDay();
    expect(e.result).toBe(1250);
    expect(e.cashEnd).toBe(12000);
    expect(e.stockEnd).toBe(1250);
    expect(e.breakEven).toBe(23);
    expect(e.breakEvenPromo).toBe(28);
  });

  it('resep chicken katsu don = 35 koin bahan per porsi', () => {
    expect(recipeCost(MENUS.find((m) => m.id === 'katsu')!)).toBe(35);
  });

  it('lokasi dua kali → deposit sekali (AC01); belanja melebihi kas bebas ditolak (AC02)', () => {
    const s = S.newGame();
    S.chooseLocation(s, 'kantor');
    const cash = s.cash;
    expect(S.chooseLocation(s, 'kantor').ok).toBe(false);
    expect(s.cash).toBe(cash);
    S.signContract(s, 'cepat');
    s.cash = S.commitments(s) + 100; // hampir semua kas terikat komitmen
    const before = s.cash;
    expect(S.buyEquipment(s, 'goreng').ok).toBe(false);
    expect(s.cash).toBe(before);
  });

  it('satu hari lengkap: kas sesuai buku besar, stok tidak negatif, hasil deterministik', () => {
    const a = readyGame(11);
    expect(S.canOpen(a)).toBe(true);
    const ra = playDay(a);
    expect(ra.served).toBeGreaterThan(0);
    expect(ra.served).toBeLessThanOrEqual(ra.arrivals);
    expect(a.batches.every((b) => b.qty >= 0)).toBe(true);
    const ledgerSum = a.ledger.reduce((x, e) => x + e.amount, 0);
    expect(a.cash).toBe(START_CASH + ledgerSum);
    expect(ra.contribution).toBe(ra.netSales - ra.hpp);
    expect(ra.result).toBe(ra.contribution - ra.waste - ra.wages - ra.rent - ra.utility - ra.marketing - ra.training);
    const b = readyGame(11);
    const rb = playDay(b);
    expect(rb).toEqual(ra);
  });

  it('bahan kedaluwarsa dibuang & dicatat sebagai waste', () => {
    const s = readyGame(3);
    playDay(s);
    S.advanceDay(s);
    expect(S.placeOrder(s, 'hemat', { ramen: 0, katsu: 20 }).ok).toBe(true);
    for (let i = 0; i < 4; i++) S.advanceDay(s);
    expect(s.batches.length).toBe(0);
    expect(s.wasteCarry).toBeGreaterThan(0);
  });
});
