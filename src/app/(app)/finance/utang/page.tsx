"use client";

import { useState } from "react";
import { FBar, FCard, FDot, FEmpty, PageHead, gridCards, useFT, useMoney } from "@/components/finance/ui";
import { rs } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";
import { useUI } from "@/lib/store";

type Tab = "utang" | "piutang";
const TABS: [Tab, string][] = [
  ["utang", "Utang saya"],
  ["piutang", "Piutang"],
];

export default function UtangPage() {
  const T = useFT();
  const { m, s } = useMoney();
  const debts = useFinance((st) => st.debts);
  const payDebt = useFinance((st) => st.payDebt);
  const toast = useUI((st) => st.showToast);
  const [tab, setTab] = useState<Tab>("utang");

  const w2 = T.play ? 800 : 600;
  const sisa = (k: Tab) => debts.filter((d) => d.kind === k).reduce((a, d) => a + d.total - d.paid, 0);
  const list = debts.filter((d) => d.kind === tab);

  return (
    <>
      <PageHead title="Utang & Piutang" sub="Pantau cicilan sampai lunas" />

      <div role="tablist" aria-label="Jenis" className="grid grid-cols-2 gap-1 p-1" style={{ background: T.subtle, borderRadius: 16 }}>
        {TABS.map(([id, label]) => {
          const on = tab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(id)}
              style={{
                height: 44,
                borderRadius: 9,
                fontFamily: T.body,
                fontWeight: T.bold,
                fontSize: 14,
                background: on ? "#fff" : "transparent",
                color: on ? T.ink : T.muted,
                boxShadow: on ? (T.play ? "0 2px 0 rgba(43,29,78,.08)" : "0 1px 2px rgba(16,24,40,.08)") : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <FCard pad={20}>
        <div style={{ fontSize: 13, fontWeight: w2, color: T.muted }}>{tab === "utang" ? "Sisa utang yang harus dibayar" : "Sisa piutang yang belum kembali"}</div>
        <div style={{ fontFamily: T.head, fontSize: 30, fontWeight: T.headWeight, lineHeight: 1.1, letterSpacing: T.play ? 0 : "-.02em" }}>{m(sisa(tab))}</div>
        <div style={{ fontSize: 12, fontWeight: w2, color: T.muted, marginTop: 4 }}>
          {tab === "utang" ? `Piutang yang belum kembali: ${s(sisa("piutang"))}` : `Utang yang masih berjalan: ${s(sisa("utang"))}`}
        </div>
      </FCard>

      {list.length === 0 ? (
        <FEmpty icon="credit_card">{tab === "utang" ? "Tidak ada utang. Mantap!" : "Belum ada piutang yang dicatat."}</FEmpty>
      ) : (
        <div className={gridCards}>
          {list.map((d) => {
            const p = d.total ? d.paid / d.total : 1;
            const done = p >= 1;
            const [l, main] = T.pal[d.c];
            const label = done ? "Lunas ✓" : (d.kind === "utang" ? "Bayar " : "Terima ") + rs(d.step);
            return (
              <FCard key={d.id} pad={16} className="flex flex-col gap-3" style={{ borderRadius: 22 }}>
                <div className="flex items-center gap-3">
                  <FDot c={d.c} icon={d.icon} size={44} />
                  <div className="min-w-0 flex-1">
                    <div style={{ fontWeight: T.bold, fontSize: 15 }}>{d.name}</div>
                    <div style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>{d.who}</div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: 11, fontWeight: w2, color: T.muted }}>Sisa</div>
                    <div style={{ fontWeight: T.bold, fontSize: 15, whiteSpace: "nowrap" }}>{s(d.total - d.paid)}</div>
                  </div>
                </div>
                <FBar pct={p * 100} color={`linear-gradient(90deg, ${l}, ${main})`} />
                <div className="flex items-center justify-between gap-2">
                  <span style={{ fontSize: 12, fontWeight: w2, color: T.play ? "#6b5d80" : "#4b5563" }}>
                    {Math.round(p * 100)}% · {s(d.paid)} dari {s(d.total)}
                  </span>
                  <button
                    onClick={() => {
                      if (done) return;
                      payDebt(d.id, d.step);
                      toast(d.kind === "utang" ? "Pembayaran cicilan dicatat" : "Penerimaan dicatat");
                    }}
                    disabled={done}
                    aria-label={done ? `${d.name} sudah lunas` : `${label} untuk ${d.name}`}
                    className="shrink-0 whitespace-nowrap"
                    style={{
                      height: 40,
                      padding: "0 14px",
                      borderRadius: 12,
                      fontFamily: T.body,
                      fontWeight: T.bold,
                      fontSize: 13,
                      cursor: done ? "default" : "pointer",
                      background: done ? (T.play ? "#e3f9ec" : "#e9f2ec") : main,
                      color: done ? T.pos : "#fff",
                    }}
                  >
                    {label}
                  </button>
                </div>
              </FCard>
            );
          })}
        </div>
      )}
    </>
  );
}
