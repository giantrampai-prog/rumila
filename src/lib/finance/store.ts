"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BILLS0,
  BUDGET0,
  CIC0,
  DEBTS0,
  DEFAULT_ACCOUNTS,
  DEFAULT_PROPS,
  GOALS0,
  INV0,
  TX0,
  setAccounts,
  setProps,
  type Account,
  type Bill,
  type Debt,
  type Goal,
  type Installment,
  type Investment,
  type Property,
  type Tx,
} from "./data";

// State modul Finance (lokal). Setiap action = satu operasi yang nanti jadi panggilan API/Supabase.

interface FinState {
  accounts: Account[];
  props: Property[];
  tx: Tx[];
  budget: [string, number][];
  goals: Goal[];
  bills: Bill[];
  inv: Investment[];
  debts: Debt[];
  cic: Installment[];
  /** sembunyikan nominal (ikon mata) */
  hide: boolean;

  toggleHide: () => void;
  addTx: (t: Omit<Tx, "id">) => void;
  addTxs: (ts: Omit<Tx, "id">[]) => void;
  removeTx: (id: string) => void;
  setBudget: (cat: string, limit: number) => void;
  removeBudget: (cat: string) => void;
  saveToGoal: (id: string, amt: number) => void;
  addGoal: (g: Omit<Goal, "id">) => void;
  payBill: (id: string, acc: string, by: string) => void;
  tradeInv: (id: string, qtyDelta: number, price?: number) => void;
  setInvPrice: (id: string, price: number) => void;
  payDebt: (id: string, amt: number) => void;
  addCic: (c: Omit<Installment, "id">) => void;
  updateCic: (id: string, patch: Partial<Installment>) => void;
  payCic: (id: string, by: string) => void;
  removeCic: (id: string) => void;
  resetFinance: () => void;
}

const seed = () => ({
  accounts: DEFAULT_ACCOUNTS,
  props: DEFAULT_PROPS,
  tx: TX0,
  budget: BUDGET0,
  goals: GOALS0,
  bills: BILLS0,
  inv: INV0,
  debts: DEBTS0,
  cic: CIC0,
  hide: false,
});
const uid = (p: string) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const useFinance = create<FinState>()(
  persist(
    (set, get) => ({
      ...seed(),
      toggleHide: () => set((s) => ({ hide: !s.hide })),
      addTx: (t) => set((s) => ({ tx: [{ ...t, id: uid("t") }, ...s.tx] })),
      addTxs: (ts) => set((s) => ({ tx: [...ts.map((t) => ({ ...t, id: uid("t") })), ...s.tx] })),
      removeTx: (id) => set((s) => ({ tx: s.tx.filter((t) => t.id !== id) })),
      setBudget: (cat, limit) =>
        set((s) => ({
          budget: s.budget.some(([c]) => c === cat) ? s.budget.map((b) => (b[0] === cat ? [cat, limit] : b)) : [...s.budget, [cat, limit]],
        })),
      removeBudget: (cat) => set((s) => ({ budget: s.budget.filter(([c]) => c !== cat) })),
      saveToGoal: (id, amt) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, saved: Math.max(0, Math.min(g.target, g.saved + amt)) } : g)) })),
      addGoal: (g) => set((s) => ({ goals: [...s.goals, { ...g, id: uid("g") }] })),
      // Bayar tagihan = tandai lunas + catat transaksi keluar.
      payBill: (id, acc, by) => {
        const b = get().bills.find((x) => x.id === id);
        if (!b || b.paid) return;
        const cat =
          b.id === "listrik"
            ? "Listrik"
            : b.id === "internet"
              ? "Internet"
              : b.id === "netflix"
                ? "Langganan"
                : b.id === "spp"
                  ? "Pendidikan"
                  : "Asuransi";
        set((s) => ({
          bills: s.bills.map((x) => (x.id === id ? { ...x, paid: true } : x)),
          tx: [{ id: uid("t"), type: "out", cat, note: b.name, amt: b.amt, d: 26, by, acc }, ...s.tx],
        }));
      },
      tradeInv: (id, qtyDelta, price) =>
        set((s) => ({
          inv: s.inv.map((v) => {
            if (v.id !== id) return v;
            const p = price ?? v.price;
            const qty = Math.max(0, +(v.qty + qtyDelta).toFixed(6));
            const avg = qtyDelta > 0 && qty > 0 ? (v.avg * v.qty + p * qtyDelta) / qty : v.avg;
            return { ...v, qty, avg };
          }),
        })),
      setInvPrice: (id, price) => set((s) => ({ inv: s.inv.map((v) => (v.id === id ? { ...v, price } : v)) })),
      payDebt: (id, amt) =>
        set((s) => ({ debts: s.debts.map((d) => (d.id === id ? { ...d, paid: Math.min(d.total, d.paid + amt) } : d)) })),
      addCic: (c) => set((s) => ({ cic: [...s.cic, { ...c, id: uid("c") }] })),
      updateCic: (id, patch) => set((s) => ({ cic: s.cic.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      // Bayar cicilan bulan ini = tambah 1 bulan terbayar + catat transaksi keluar.
      payCic: (id, by) => {
        const c = get().cic.find((x) => x.id === id);
        if (!c || c.paid >= c.tenor) return;
        set((s) => ({
          cic: s.cic.map((x) => (x.id === id ? { ...x, paid: x.paid + 1 } : x)),
          tx: [
            {
              id: uid("t"),
              type: "out",
              cat: c.kind === "KPR" ? "Cicilan Rumah" : "Cicilan Lain",
              note: c.name,
              amt: c.amt,
              d: 26,
              by,
              acc: c.acc,
            },
            ...s.tx,
          ],
        }));
      },
      removeCic: (id) => set((s) => ({ cic: s.cic.filter((c) => c.id !== id) })),
      resetFinance: () => set(seed()),
    }),
    {
      name: "rumila-fin-v1",
      skipHydration: true,
      // File kontrak yang belum terunggah (data URL) tidak disimpan di browser — kuota localStorage cuma ~5 MB.
      partialize: (s) => ({
        ...s,
        cic: s.cic.map((c) => (c.file?.url?.startsWith("data:") ? { ...c, file: { ...c.file, url: null } } : c)),
      }),
      onRehydrateStorage: () => (s) => {
        if (s) {
          setAccounts(s.accounts ?? DEFAULT_ACCOUNTS);
          setProps(s.props ?? DEFAULT_PROPS);
        }
      },
    },
  ),
);

// ---------- UI Finance (tidak dipersist) ----------

interface FinUI {
  adding: boolean;
  asOpen: boolean;
  openAdd: () => void;
  closeAdd: () => void;
  openAsisten: () => void;
  closeAsisten: () => void;
}

export const useFinUI = create<FinUI>()((set) => ({
  adding: false,
  asOpen: false,
  openAdd: () => set({ adding: true }),
  closeAdd: () => set({ adding: false }),
  openAsisten: () => set({ asOpen: true }),
  closeAsisten: () => set({ asOpen: false }),
}));
