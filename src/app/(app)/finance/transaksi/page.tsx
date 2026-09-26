"use client";

// Transaksi — port layar "isTransaksi" dari prototype Keuangan-Playful / Keuangan-Mobile.

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui";
import { FEmpty, PageHead, TxRow, useFT, useMoney } from "@/components/finance/ui";
import { ACCOUNTS, MONTH_LABEL, accName, isOut, weekday, type Tx, type TxType } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";

const FILTERS: ["all" | TxType, string][] = [
  ["all", "Semua"],
  ["in", "Masuk"],
  ["out", "Keluar"],
  ["tf", "Transfer"],
  ["sd", "Sedekah"],
];

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Transaksi />
    </Suspense>
  );
}

function Transaksi() {
  const T = useFT();
  const { s } = useMoney();
  const tx = useFinance((st) => st.tx);
  const params = useSearchParams();
  const initAcc = params.get("acc");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | TxType>("all");
  const [acc, setAcc] = useState<string>(initAcc && ACCOUNTS.some((a) => a.id === initAcc) ? initAcc : "");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const flt = [...tx]
      .sort((a, b) => b.d - a.d)
      .filter(
        (t) =>
          (filter === "all" || t.type === filter) &&
          (!acc || t.acc === acc || t.to === acc) &&
          (!needle || [t.note, t.cat, accName(t.acc), t.to ? accName(t.to) : ""].join(" ").toLowerCase().includes(needle)),
      );
    const out: { d: number; items: Tx[] }[] = [];
    for (const t of flt) {
      let g = out.find((x) => x.d === t.d);
      if (!g) out.push((g = { d: t.d, items: [] }));
      g.items.push(t);
    }
    return out;
  }, [tx, q, filter, acc]);

  const chip = (on: boolean): CSSProperties => ({
    height: 40,
    borderRadius: 999,
    padding: "0 16px",
    fontFamily: T.body,
    fontWeight: T.play ? 800 : 600,
    fontSize: 14,
    background: on ? T.ink : "#fff",
    color: on ? "#fff" : T.play ? "#6b5d80" : "#4b5563",
  });

  return (
    <>
      <PageHead title="Transaksi" sub={`${MONTH_LABEL} · ${tx.length} transaksi`} />

      <label
        className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5"
        style={T.play ? { boxShadow: "0 3px 0 rgba(43,29,78,.08)" } : { border: "1px solid #e6e8ec" }}
      >
        <Icon name="search" style={{ color: T.faint }} />
        <span className="sr-only">Cari transaksi</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari transaksi, kategori, akun…"
          className="min-w-0 flex-1 bg-transparent py-3.5 outline-none"
          style={{ fontFamily: T.body, fontWeight: T.bold, fontSize: 15, color: T.ink }}
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Hapus pencarian" className="flex size-8 items-center justify-center rounded-lg" style={{ color: T.muted }}>
            <Icon name="close" size={20} />
          </button>
        )}
      </label>

      <div className="-mx-[18px] flex gap-2 overflow-x-auto px-[18px] pb-1 desk:mx-0 desk:flex-wrap desk:px-0" role="toolbar" aria-label="Filter transaksi">
        {FILTERS.map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id} className="shrink-0" style={chip(filter === id)}>
            {label}
          </button>
        ))}
        <label className="relative flex shrink-0 items-center">
          <span className="sr-only">Filter akun</span>
          <select
            value={acc}
            onChange={(e) => setAcc(e.target.value)}
            className="cursor-pointer appearance-none"
            style={{ ...chip(false), paddingRight: 36 }}
          >
            <option value="">Semua akun</option>
            {ACCOUNTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <Icon name="expand_more" size={20} className="pointer-events-none absolute right-2.5" style={{ color: T.muted }} />
        </label>
        {acc && (
          <button
            onClick={() => setAcc("")}
            className="flex shrink-0 items-center gap-1"
            style={{ ...chip(true), padding: "0 10px 0 14px" }}
            aria-label={`Hapus filter akun ${accName(acc)}`}
          >
            {accName(acc)}
            <Icon name="close" size={18} />
          </button>
        )}
      </div>

      {groups.map((g) => {
        const net = g.items.reduce((a, t) => a + (t.type === "in" ? t.amt : isOut(t) ? -t.amt : 0), 0);
        return (
          <section key={g.d} className="flex flex-col gap-1.5" aria-label={`${weekday(g.d)}, ${g.d} September`}>
            <div className="flex justify-between px-1" style={{ fontSize: 13, fontWeight: T.bold, color: T.muted }}>
              <span>
                {weekday(g.d)}, {g.d} Sep
              </span>
              <span style={{ color: net >= 0 ? T.pos : T.neg }}>{(net > 0 ? "+" : "") + s(net)}</span>
            </div>
            <div style={{ ...T.card, borderRadius: 22, padding: "4px 16px" }}>
              {g.items.map((t, i) => (
                <div key={t.id} className="py-0.5" style={{ borderBottom: i < g.items.length - 1 ? `1.5px solid ${T.subtle}` : "none" }}>
                  <TxRow t={t} viewAcc={acc || undefined} withBy />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {groups.length === 0 && <FEmpty icon="search_off">Belum ada transaksi yang cocok.</FEmpty>}
    </>
  );
}
