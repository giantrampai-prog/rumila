"use client";

import { useState } from "react";
import { FCard, FDot, PageHead, TxRow, useFT, useMoney } from "@/components/finance/ui";
import { MONTH_LABEL, TODAY, isOut, weekday, type FinColor } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";

// Layar "Kalender" — port isKalender dari prototype Keuangan-Playful / Keuangan-Mobile.
// Grid Senin-dulu, 35 sel (1 Sep 2026 = Selasa → sel pertama kosong).

const HEAD = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default function KalenderPage() {
  const T = useFT();
  const { m } = useMoney();
  const tx = useFinance((s) => s.tx);
  const bills = useFinance((s) => s.bills);
  const [day, setDay] = useState(TODAY);

  const dayTx = tx.filter((t) => t.d === day);
  const dayBills = bills.filter((b) => b.day === day);
  const dayIn = dayTx.filter((t) => t.type === "in").reduce((a, t) => a + t.amt, 0);
  const dayOut = dayTx.filter(isOut).reduce((a, t) => a + t.amt, 0);
  const count = dayTx.length + dayBills.length;
  const billColor = T.play ? "#d99400" : "#8c6b3c";

  const legend: [FinColor, string][] = [
    ["green", "Masuk"],
    ["red", "Keluar"],
    ["gold", "Tagihan"],
  ];

  return (
    <>
      <PageHead title="Kalender" sub={MONTH_LABEL} />

      <div className="grid grid-cols-1 gap-[18px] desk:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] desk:items-start">
        <FCard pad={16} className="flex flex-col gap-2">
          <div className="grid grid-cols-7 text-center" style={{ fontSize: 12, fontWeight: T.bold, color: T.faint }} aria-hidden>
            {HEAD.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1" role="group" aria-label={`Kalender ${MONTH_LABEL}`}>
            {Array.from({ length: 35 }, (_, d) => {
              if (d < 1 || d > 30) return <span key={d} aria-hidden style={{ aspectRatio: "1" }} />;
              const dots: FinColor[] = [];
              if (tx.some((t) => t.d === d && t.type === "in")) dots.push("green");
              if (tx.some((t) => t.d === d && isOut(t))) dots.push("red");
              if (bills.some((b) => b.day === d && !b.paid)) dots.push("gold");
              const on = day === d;
              const today = d === TODAY;
              return (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  aria-pressed={on}
                  aria-label={`${weekday(d)}, ${d} September${today ? " (hari ini)" : ""}`}
                  className="flex flex-col items-center justify-center gap-[3px] transition-colors"
                  style={{
                    aspectRatio: "1",
                    borderRadius: 14,
                    fontFamily: T.body,
                    fontWeight: T.play ? 800 : 600,
                    fontSize: 14,
                    background: on ? T.ink : today ? T.sideOn : "transparent",
                    color: on ? "#fff" : d > TODAY ? T.faint : T.ink,
                  }}
                >
                  <span>{d}</span>
                  <div className="flex gap-[2px]" style={{ height: 6 }}>
                    {dots.map((c) => (
                      <span key={c} style={{ width: 5, height: 5, borderRadius: "50%", background: on ? "#fff" : T.pal[c][1] }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex justify-center gap-3 pt-1" style={{ fontSize: 11, fontWeight: T.play ? 800 : 600, color: T.muted }}>
            {legend.map(([c, label]) => (
              <span key={c} className="flex items-center gap-1">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: c === "gold" ? "#ffbe0b" : T.pal[c][1] }} />
                {label}
              </span>
            ))}
          </div>
        </FCard>

        <FCard pad={0} style={{ padding: "6px 16px" }}>
          <div className="flex flex-wrap items-baseline justify-between gap-2" style={{ padding: "12px 0 4px" }}>
            <h2 style={{ fontWeight: T.bold, fontSize: 15 }}>
              {weekday(day)}, {day} September
            </h2>
            {count > 0 && (
              <span style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>
                {dayIn > 0 && <span style={{ color: T.pos }}>+ {m(dayIn)}</span>}
                {dayIn > 0 && dayOut > 0 && " · "}
                {dayOut > 0 && <span style={{ color: T.neg }}>− {m(dayOut)}</span>}
                {dayIn === 0 && dayOut === 0 && `${count} catatan`}
              </span>
            )}
          </div>
          {dayBills.map((b) => (
            <div key={b.id} className="flex items-center gap-3" style={{ padding: "12px 0", borderBottom: `1.5px solid ${T.subtle}` }}>
              <FDot c={b.c} icon={b.icon} size={40} />
              <div className="min-w-0 flex-1">
                <div className="truncate" style={{ fontWeight: T.play ? 800 : 600, fontSize: 15 }}>
                  {b.name}
                </div>
                <div style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>{b.paid ? "Tagihan · sudah lunas" : "Tagihan · jatuh tempo"}</div>
              </div>
              <div style={{ fontWeight: T.bold, fontSize: 14, color: billColor, whiteSpace: "nowrap" }}>{m(b.amt)}</div>
            </div>
          ))}
          {dayTx.map((t) => (
            <div key={t.id} style={{ borderBottom: `1.5px solid ${T.subtle}` }}>
              <TxRow t={t} withBy />
            </div>
          ))}
          {count === 0 && <div style={{ padding: "14px 0 18px", color: T.muted, fontWeight: T.bold, fontSize: 14 }}>Tidak ada catatan di hari ini.</div>}
        </FCard>
      </div>
    </>
  );
}
