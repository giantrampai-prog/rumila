"use client";

// Jembatan store Finance (useFinance) ⇄ Supabase.
// - loadFinance(fid): isi store dari database. Kalau rumah belum punya data Finance sama sekali,
//   data yang ada di browser diunggah sekali (migrasi dari versi lokal).
// - Sinkronisasi: setiap perubahan koleksi di store di-upsert/hapus ke tabel fin_*.
// - Dokumen kontrak: data URL diunggah ke Storage (bucket "documents", folder = family_id).

import { create } from "zustand";
import {
  DEFAULT_ACCOUNTS,
  dateToDay,
  dayToDate,
  setAccounts,
  setProps,
  type Account,
  type Bill,
  type Debt,
  type DocFile,
  type FinColor,
  type Goal,
  type Installment,
  type Investment,
  type Property,
  type Tx,
} from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";
import { useUI } from "@/lib/store";
import { friendlyError, supabase } from "./client";

export const useFinCloud = create<{ status: "idle" | "loading" | "ready" | "error"; error: string | null }>()(() => ({
  status: "idle",
  error: null,
}));

let paused = false;
let queue: Promise<void> = Promise.resolve();
let familyId: string | null = null;

// Supabase-js belum punya tipe untuk tabel fin_* (belum di-generate) → akses tabel secara dinamis.
type Row = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = (name: string) => (supabase() as any).from(name);

/* ---------------- pemetaan store ⇄ baris tabel ---------------- */

interface Mapper<T> {
  table: string;
  key: (t: T) => string;
  keyCol: string;
  toRow: (t: T, i: number) => Row;
  fromRow: (r: Row) => T;
}

const mAccount: Mapper<Account> = {
  table: "fin_account",
  keyCol: "id",
  key: (a) => a.id,
  toRow: (a, i) => ({ id: a.id, name: a.name, short: a.short, kind: a.kind, color: a.c, init_balance: a.init, keys: a.keys, sort: i }),
  fromRow: (r) => ({
    id: r.id as string,
    name: r.name as string,
    short: r.short as string,
    kind: r.kind as Account["kind"],
    c: r.color as FinColor,
    init: Number(r.init_balance),
    keys: (r.keys as string[]) ?? [],
  }),
};

const mTx: Mapper<Tx> = {
  table: "fin_tx",
  keyCol: "id",
  key: (t) => t.id,
  toRow: (t) => ({
    id: t.id,
    type: t.type,
    category: t.cat,
    note: t.note,
    amount: Math.round(t.amt),
    occurred_on: dayToDate(t.d),
    by_name: t.by,
    account_id: t.acc,
    to_account_id: t.to ?? null,
  }),
  fromRow: (r) => ({
    id: r.id as string,
    type: r.type as Tx["type"],
    cat: r.category as string,
    note: r.note as string,
    amt: Number(r.amount),
    d: dateToDay(r.occurred_on as string),
    by: r.by_name as string,
    acc: r.account_id as string,
    to: (r.to_account_id as string | null) ?? undefined,
  }),
};

type BudgetItem = [string, number];
const mBudget: Mapper<BudgetItem> = {
  table: "fin_budget",
  keyCol: "category",
  key: (b) => b[0],
  toRow: (b) => ({ category: b[0], monthly_limit: Math.round(b[1]) }),
  fromRow: (r) => [r.category as string, Number(r.monthly_limit)],
};

const mGoal: Mapper<Goal> = {
  table: "fin_goal",
  keyCol: "id",
  key: (g) => g.id,
  toRow: (g, i) => ({
    id: g.id,
    name: g.name,
    icon: g.icon,
    color: g.c,
    saved: Math.round(g.saved),
    target: Math.round(g.target),
    step: Math.round(g.step),
    due: g.due,
    sort: i,
  }),
  fromRow: (r) => ({
    id: r.id as string,
    name: r.name as string,
    icon: r.icon as string,
    c: r.color as FinColor,
    saved: Number(r.saved),
    target: Number(r.target),
    step: Number(r.step),
    due: r.due as string,
  }),
};

const mBill: Mapper<Bill> = {
  table: "fin_bill",
  keyCol: "id",
  key: (b) => b.id,
  toRow: (b) => ({
    id: b.id,
    name: b.name,
    icon: b.icon,
    color: b.c,
    amount: Math.round(b.amt),
    due_day: b.day,
    due_label: b.due,
    paid: b.paid,
  }),
  fromRow: (r) => ({
    id: r.id as string,
    name: r.name as string,
    icon: r.icon as string,
    c: r.color as FinColor,
    amt: Number(r.amount),
    day: Number(r.due_day),
    due: r.due_label as string,
    paid: !!r.paid,
  }),
};

const mInv: Mapper<Investment> = {
  table: "fin_investment",
  keyCol: "id",
  key: (v) => v.id,
  toRow: (v) => ({
    id: v.id,
    name: v.name,
    kind: v.kind,
    icon: v.icon,
    color: v.c,
    qty: v.qty,
    avg_price: v.avg,
    price: v.price,
    unit: v.unit,
    step: v.step,
  }),
  fromRow: (r) => ({
    id: r.id as string,
    name: r.name as string,
    kind: r.kind as string,
    icon: r.icon as string,
    c: r.color as FinColor,
    qty: Number(r.qty),
    avg: Number(r.avg_price),
    price: Number(r.price),
    unit: r.unit as string,
    step: Number(r.step),
  }),
};

const mAsset: Mapper<Property> = {
  table: "fin_asset",
  keyCol: "id",
  key: (p) => p.id,
  toRow: (p) => ({
    id: p.id,
    name: p.name,
    icon: p.icon,
    color: p.c,
    buy_price: Math.round(p.buy),
    value: Math.round(p.value),
    year: p.year,
  }),
  fromRow: (r) => ({
    id: r.id as string,
    name: r.name as string,
    icon: r.icon as string,
    c: r.color as FinColor,
    buy: Number(r.buy_price),
    value: Number(r.value),
    year: r.year as string,
  }),
};

const mDebt: Mapper<Debt> = {
  table: "fin_debt",
  keyCol: "id",
  key: (d) => d.id,
  toRow: (d) => ({
    id: d.id,
    kind: d.kind,
    name: d.name,
    who: d.who,
    icon: d.icon,
    color: d.c,
    total: Math.round(d.total),
    paid: Math.round(d.paid),
    step: Math.round(d.step),
  }),
  fromRow: (r) => ({
    id: r.id as string,
    kind: r.kind as Debt["kind"],
    name: r.name as string,
    who: r.who as string,
    icon: r.icon as string,
    c: r.color as FinColor,
    total: Number(r.total),
    paid: Number(r.paid),
    step: Number(r.step),
  }),
};

const mCic: Mapper<Installment> = {
  table: "fin_installment",
  keyCol: "id",
  key: (c) => c.id,
  // Dokumen: hanya metadata + path Storage yang masuk tabel (data URL diunggah terpisah).
  toRow: (c) => ({
    id: c.id,
    name: c.name,
    kind: c.kind,
    lender: c.lender,
    amount: Math.round(c.amt),
    tenor: c.tenor,
    paid: c.paid,
    start_month: c.start,
    due_day: c.due,
    account_id: c.acc,
    doc_name: c.file?.name ?? null,
    doc_size: c.file?.size ?? null,
    doc_type: c.file?.type ?? null,
    doc_path: c.file?.path ?? null,
  }),
  fromRow: (r) => ({
    id: r.id as string,
    name: r.name as string,
    kind: r.kind as string,
    lender: r.lender as string,
    amt: Number(r.amount),
    tenor: Number(r.tenor),
    paid: Number(r.paid),
    start: r.start_month as string,
    due: Number(r.due_day),
    acc: r.account_id as string,
    file: r.doc_name
      ? {
          name: r.doc_name as string,
          size: (r.doc_size as string) ?? "",
          url: null,
          type: (r.doc_type as DocFile["type"]) ?? "other",
          path: (r.doc_path as string) ?? undefined,
        }
      : null,
  }),
};

/* ---------------- antrean tulis ---------------- */

function enqueue(job: () => Promise<void>) {
  queue = queue.then(job).catch((e) => {
    console.error("[rumila] sinkron finance gagal", e);
    useUI.getState().showToast("Data keuangan belum tersimpan ke server. Cek koneksi, ya.");
  });
}

async function check<T extends { error: unknown }>(p: PromiseLike<T>) {
  const r = await p;
  if (r.error) throw r.error;
  return r;
}

/** Upsert yang baru/berubah, hapus yang hilang. */
function syncList<T>(m: Mapper<T>, next: T[], prev: T[], fid: string) {
  if (next === prev) return;
  const prevMap = new Map(prev.map((x, i) => [m.key(x), JSON.stringify(m.toRow(x, i))]));
  const nextKeys = new Set(next.map(m.key));
  const upserts = next.map((x, i) => ({ k: m.key(x), row: m.toRow(x, i) })).filter(({ k, row }) => prevMap.get(k) !== JSON.stringify(row));
  const removed = prev.map(m.key).filter((k) => !nextKeys.has(k));
  if (upserts.length) enqueue(async () => void (await check(table(m.table).upsert(upserts.map((u) => ({ family_id: fid, ...u.row }))))));
  if (removed.length) enqueue(async () => void (await check(table(m.table).delete().eq("family_id", fid).in(m.keyCol, removed))));
}

/* ---------------- dokumen kontrak → Storage ---------------- */

const safeName = (n: string) => n.replace(/[^\w.\-]+/g, "_").slice(-80);

async function dataUrlToBlob(url: string) {
  return (await fetch(url)).blob();
}

const uploading = new Set<string>();

/** Unggah dokumen cicilan yang masih berupa data URL, lalu simpan path-nya di store. */
function uploadPendingDocs(cic: Installment[], fid: string) {
  for (const c of cic) {
    const f = c.file;
    if (!f?.url?.startsWith("data:")) continue;
    const token = c.id + ":" + f.url.length + ":" + f.name;
    if (uploading.has(token)) continue; // sudah antre
    uploading.add(token);
    const path = `${fid}/cicilan/${c.id}/${Date.now()}-${safeName(f.name)}`;
    const dataUrl = f.url;
    enqueue(async () => {
      const blob = await dataUrlToBlob(dataUrl);
      await check(
        supabase()
          .storage.from("documents")
          .upload(path, blob, { contentType: blob.type || undefined, upsert: true }),
      );
      // Hapus file lama bila ada, lalu ganti ke path baru (store → sync baris fin_installment).
      if (f.path) await supabase().storage.from("documents").remove([f.path]);
      uploading.delete(token);
      useFinance.getState().updateCic(c.id, { file: { ...f, url: null, path } });
    });
  }
}

/** Tautan sementara (1 jam) untuk membuka dokumen dari Storage. */
export async function docUrl(path: string): Promise<string> {
  const { data, error } = await supabase().storage.from("documents").createSignedUrl(path, 3600);
  if (error) throw new Error(friendlyError(error));
  return data.signedUrl;
}

/* ---------------- muat & migrasi ---------------- */

function applyToStore(patch: Partial<ReturnType<typeof useFinance.getState>>) {
  paused = true;
  if (patch.accounts) setAccounts(patch.accounts);
  if (patch.props) setProps(patch.props);
  useFinance.setState(patch);
  paused = false;
}

export async function loadFinance(fid: string) {
  familyId = fid;
  useFinCloud.setState({ status: "loading", error: null });
  try {
    if (!useFinance.persist.hasHydrated()) await useFinance.persist.rehydrate();
    const q = (t: string) => table(t).select("*").eq("family_id", fid);
    const [acc, tx, bud, goal, bill, inv, asset, debt, cic] = await Promise.all([
      q("fin_account").order("sort"),
      q("fin_tx").order("occurred_on", { ascending: false }).order("created_at", { ascending: false }),
      q("fin_budget"),
      q("fin_goal").order("sort"),
      q("fin_bill"),
      q("fin_investment"),
      q("fin_asset"),
      q("fin_debt"),
      q("fin_installment"),
    ]);
    for (const r of [acc, tx, bud, goal, bill, inv, asset, debt, cic]) if (r.error) throw r.error;

    const empty = [acc, tx, bud, goal, bill, inv, asset, debt, cic].every((r) => !r.data?.length);
    if (empty) {
      // Migrasi sekali: unggah data Finance yang selama ini tersimpan di browser.
      const s = useFinance.getState();
      const put = async <T>(m: Mapper<T>, list: T[]) => {
        if (list.length) await check(table(m.table).upsert(list.map((x, i) => ({ family_id: fid, ...m.toRow(x, i) }))));
      };
      await put(mAccount, s.accounts?.length ? s.accounts : DEFAULT_ACCOUNTS);
      await put(mTx, s.tx);
      await put(mBudget, s.budget);
      await put(mGoal, s.goals);
      await put(mBill, s.bills);
      await put(mInv, s.inv);
      await put(mAsset, s.props ?? []);
      await put(mDebt, s.debts);
      await put(mCic, s.cic);
      uploadPendingDocs(s.cic, fid);
    } else {
      applyToStore({
        accounts: acc.data!.map(mAccount.fromRow),
        tx: tx.data!.map(mTx.fromRow),
        budget: bud.data!.map(mBudget.fromRow),
        goals: goal.data!.map(mGoal.fromRow),
        bills: bill.data!.map(mBill.fromRow),
        inv: inv.data!.map(mInv.fromRow),
        props: asset.data!.map(mAsset.fromRow),
        debts: debt.data!.map(mDebt.fromRow),
        cic: cic.data!.map(mCic.fromRow),
      });
    }
    useFinCloud.setState({ status: "ready" });
  } catch (e) {
    useFinCloud.setState({ status: "error", error: friendlyError(e) });
  }
}

let started = false;

/** Pasang sekali: dengarkan perubahan store Finance dan tulis ke database. */
export function startFinanceSync() {
  if (started) return;
  started = true;
  useFinance.subscribe((s, p) => {
    const fid = familyId;
    if (paused || !fid || useFinCloud.getState().status !== "ready") return;
    if (s.accounts !== p.accounts) setAccounts(s.accounts);
    if (s.props !== p.props) setProps(s.props);
    syncList(mAccount, s.accounts, p.accounts, fid);
    syncList(mTx, s.tx, p.tx, fid);
    syncList(mBudget, s.budget, p.budget, fid);
    syncList(mGoal, s.goals, p.goals, fid);
    syncList(mBill, s.bills, p.bills, fid);
    syncList(mInv, s.inv, p.inv, fid);
    syncList(mAsset, s.props, p.props, fid);
    syncList(mDebt, s.debts, p.debts, fid);
    if (s.cic !== p.cic) {
      syncList(mCic, s.cic, p.cic, fid);
      uploadPendingDocs(s.cic, fid);
      // File cicilan yang dihapus ikut dibersihkan dari Storage.
      const gone = p.cic.filter((c) => c.file?.path && !s.cic.some((x) => x.id === c.id)).map((c) => c.file!.path!);
      if (gone.length) enqueue(async () => void (await check(supabase().storage.from("documents").remove(gone))));
    }
  });
}

/** Keluar akun: lepas keterikatan ke rumah dan bersihkan cache lokal (supaya tidak bocor ke akun lain). */
export function resetFinanceCloud() {
  familyId = null;
  useFinCloud.setState({ status: "idle", error: null });
  paused = true;
  useFinance.getState().resetFinance();
  setAccounts(useFinance.getState().accounts);
  setProps(useFinance.getState().props);
  paused = false;
}
