"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui";
import { FCard, FEmpty, FTitle, PageHead, TxRow, useFT, useMoney } from "@/components/finance/ui";
import { ACCOUNTS, MONTH_LABEL, balances, type Account } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";
import { useUI } from "@/lib/store";

// Layar "Akun Finansial" — port isAkun dari prototype Keuangan-Playful / Keuangan-Mobile.
// Klik akun = lihat mutasinya (setara txAcc di prototype), ditampilkan di panel samping.

type Sort = "saldo" | "sering";
const KINDS: Account["kind"][] = ["Kas", "Bank", "E-Wallet", "RDN"];
const SORTS: [Sort, string, string][] = [
  ["saldo", "Tertinggi", "sort"],
  ["sering", "Paling sering", "bar_chart"],
];

export default function AkunPage() {
  const T = useFT();
  const { m, s } = useMoney();
  const tx = useFinance((st) => st.tx);
  const showToast = useUI((st) => st.showToast);
  const [sort, setSort] = useState<Sort>("saldo");
  const [sel, setSel] = useState<string | null>(null);

  const bal = useMemo(() => balances(tx), [tx]);
  const totalBal = Object.values(bal).reduce((a, b) => a + b, 0);

  const groups = KINDS.map((kind) => {
    const items = ACCOUNTS.filter((a) => a.kind === kind)
      .map((a) => ({ ...a, bal: bal[a.id], uses: tx.filter((t) => t.acc === a.id || t.to === a.id).length }))
      .sort((a, b) => (sort === "saldo" ? b.bal - a.bal : b.uses - a.uses));
    return { kind, title: kind === "Bank" ? "Akun Bank" : kind, total: items.reduce((x, a) => x + a.bal, 0), items };
  });

  const selAcc = ACCOUNTS.find((a) => a.id === sel);
  const mut = sel ? [...tx].filter((t) => t.acc === sel || t.to === sel).sort((a, b) => b.d - a.d) : [];
  const mutIn = mut.filter((t) => t.type === "in" || (t.type === "tf" && t.to === sel)).reduce((a, t) => a + t.amt, 0);
  const mutOut = mut.filter((t) => !(t.type === "in" || (t.type === "tf" && t.to === sel))).reduce((a, t) => a + t.amt, 0);

  const chip = (on: boolean) => ({
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
      <PageHead
        title="Akun Finansial"
        sub="Kelola sumber keuanganmu"
        right={
          <button
            onClick={() => showToast("Form tambah akun segera hadir")}
            className="flex shrink-0 items-center gap-1"
            style={{ height: 44, padding: "0 14px", borderRadius: 14, background: T.ink, color: "#fff", fontFamily: T.body, fontWeight: T.bold, fontSize: 14 }}
          >
            <Icon name="add" size={20} />
            Akun
          </button>
        }
      />

      <FCard pad={20} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div style={{ fontSize: 13, fontWeight: T.play ? 800 : 600, color: T.muted }}>Total saldo semua akun</div>
          <div style={{ fontFamily: T.head, fontSize: 32, fontWeight: T.headWeight, lineHeight: 1.1, letterSpacing: T.play ? 0 : "-.02em" }}>{m(totalBal)}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: T.play ? 900 : 700, color: T.muted }}>
          {ACCOUNTS.length} akun · {MONTH_LABEL}
        </div>
      </FCard>

      <div className="flex gap-2" role="group" aria-label="Urutkan akun">
        {SORTS.map(([id, label, icon]) => (
          <button key={id} aria-pressed={sort === id} onClick={() => setSort(id)} className="flex shrink-0 items-center gap-1.5" style={chip(sort === id)}>
            <Icon name={icon} size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className={`grid grid-cols-1 gap-[18px] ${selAcc ? "desk:grid-cols-[minmax(0,1fr)_380px] desk:items-start" : ""}`}>
        <div className="flex min-w-0 flex-col gap-[18px]">
          {groups.map((g) => (
            <section key={g.kind} className="flex flex-col gap-2" aria-label={g.title}>
              <div className="flex justify-between px-1" style={{ fontSize: 14, fontWeight: T.bold }}>
                <span>{g.title}</span>
                <span style={{ color: T.muted }}>{s(g.total)}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 desk:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] desk:gap-3">
                {g.items.map((a) => {
                  const on = sel === a.id;
                  const [l, , d] = T.pal[a.c];
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSel(on ? null : a.id)}
                      aria-pressed={on}
                      aria-label={`Lihat mutasi ${a.name}`}
                      className="flex items-center gap-3 text-left"
                      style={{
                        ...T.card,
                        borderRadius: 20,
                        padding: "14px 16px",
                        color: T.ink,
                        fontFamily: "inherit",
                        outline: on ? `2px solid ${T.accent}` : "none",
                        outlineOffset: 0,
                      }}
                    >
                      <div
                        aria-hidden
                        className="flex shrink-0 items-center justify-center"
                        style={{ width: 46, height: 46, borderRadius: 14, background: l + "40", color: d, fontFamily: T.body, fontWeight: T.bold, fontSize: 13, letterSpacing: ".02em" }}
                      >
                        {a.short}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div style={{ fontWeight: T.bold, fontSize: 16 }}>{a.name}</div>
                        <div style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>
                          {a.kind.toUpperCase()} · {a.uses} transaksi
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontSize: 11, fontWeight: T.play ? 800 : 600, color: T.muted }}>Saldo</div>
                        <div style={{ fontWeight: T.bold, fontSize: 15, whiteSpace: "nowrap" }}>{m(a.bal)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {selAcc && (
          <FCard pad={0} className="anim-fade order-first flex flex-col desk:sticky desk:top-6 desk:order-none" style={{ padding: "16px 16px 6px" }}>
            <FTitle
              as="h2"
              right={
                <button onClick={() => setSel(null)} aria-label="Tutup mutasi" className="flex size-9 items-center justify-center rounded-xl" style={{ background: T.subtle, color: T.ink }}>
                  <Icon name="close" size={20} />
                </button>
              }
            >
              Mutasi {selAcc.name}
            </FTitle>
            <div style={{ fontSize: 13, fontWeight: T.play ? 800 : 600, color: T.muted }}>
              Saldo {m(bal[selAcc.id])} · {mut.length} transaksi
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div style={{ background: T.soft, borderRadius: 14, padding: 10 }}>
                <div style={{ fontSize: 11, fontWeight: T.play ? 800 : 600, color: T.muted }}>Masuk</div>
                <div style={{ fontWeight: T.bold, fontSize: 14, color: T.pos }}>+ {m(mutIn)}</div>
              </div>
              <div style={{ background: T.soft, borderRadius: 14, padding: 10 }}>
                <div style={{ fontSize: 11, fontWeight: T.play ? 800 : 600, color: T.muted }}>Keluar</div>
                <div style={{ fontWeight: T.bold, fontSize: 14, color: T.neg }}>− {m(mutOut)}</div>
              </div>
            </div>
            <div className="mt-1">
              {mut.length === 0 ? (
                <FEmpty icon="receipt_long">Belum ada mutasi di akun ini.</FEmpty>
              ) : (
                mut.map((t, i) => (
                  <div key={t.id} style={{ borderBottom: i < mut.length - 1 ? `1.5px solid ${T.subtle}` : "none" }}>
                    <TxRow t={t} viewAcc={selAcc.id} />
                  </div>
                ))
              )}
            </div>
          </FCard>
        )}
      </div>
    </>
  );
}
