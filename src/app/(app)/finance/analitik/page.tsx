"use client";

// Analitik — port layar "isAnalitik" dari prototype Keuangan-Playful / Keuangan-Mobile.

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui";
import { FCard, FDot, FSeg, FTitle, PageHead, useFT, useMoney } from "@/components/finance/ui";
import { HIST, MONTH_LABEL, TODAY, catInfo, isOut, totalIn, totalOut, type FinColor } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";
import { useUI } from "@/lib/store";

export default function Page() {
  const T = useFT();
  const { m, s } = useMoney();
  const tx = useFinance((st) => st.tx);
  const showToast = useUI((st) => st.showToast);
  const [range, setRange] = useState<3 | 6>(6);
  const [selIdx, setSelIdx] = useState<number | null>(null);

  const inc = totalIn(tx);
  const exp = totalOut(tx);
  const ratio = inc ? (inc - exp) / inc : 0;

  // HIST (juta rupiah) + bulan berjalan
  const months: [string, number, number][] = [...HIST.slice(HIST.length - (range - 1)), ["Sep", inc / 1e6, exp / 1e6]];
  const aMax = Math.max(1e-6, ...months.flatMap((x) => [x[1], x[2]])) * 1.05;
  const aSel = Math.min(selIdx ?? months.length - 1, months.length - 1);
  const sm = months[aSel];

  const biggest = useMemo(() => [...tx].filter(isOut).sort((a, b) => b.amt - a.amt)[0], [tx]);
  const cats = useMemo(() => {
    const totals = new Map<string, { type: "out" | "sd"; cat: string; v: number }>();
    for (const t of tx) {
      if (t.type !== "out" && t.type !== "sd") continue;
      const k = `${t.type}:${t.cat}`;
      const cur = totals.get(k);
      if (cur) cur.v += t.amt;
      else totals.set(k, { type: t.type, cat: t.cat, v: t.amt });
    }
    return [...totals.values()].sort((a, b) => b.v - a.v);
  }, [tx]);
  const topMax = cats[0]?.v || 1;

  const stats: { label: string; value: string; icon: string; c: FinColor }[] = [
    { label: "Rata-rata keluar/hari", value: s(exp / TODAY), icon: "today", c: "red" },
    { label: "Jumlah transaksi", value: `${tx.length} transaksi`, icon: "receipt_long", c: "indigo" },
    { label: "Pengeluaran terbesar", value: biggest ? biggest.note : "-", icon: "priority_high", c: "orange" },
    { label: "Rasio menabung", value: `${Math.round(ratio * 100)}% dari pemasukan`, icon: "savings", c: "green" },
  ];
  const detail: [string, number, FinColor][] = [
    ["Masuk", sm[1], "green"],
    ["Keluar", sm[2], "red"],
    ["Sisa", sm[1] - sm[2], "indigo"],
  ];
  const small = { fontSize: 12, fontWeight: T.play ? 800 : 600 } as const;

  return (
    <>
      <PageHead title="Analitik" sub="Pola keuangan keluarga kamu" />

      <FCard className="flex flex-col gap-3.5">
        <FTitle
          right={
            <FSeg
              value={range}
              options={[
                [3, "3 bln"],
                [6, "6 bln"],
              ]}
              onChange={(r) => {
                setRange(r);
                setSelIdx(null);
              }}
            />
          }
        >
          Tren bulanan
        </FTitle>
        <div
          role="group"
          aria-label={`Grafik pemasukan dan pengeluaran ${range} bulan terakhir`}
          className="grid h-[170px] gap-1"
          style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0,1fr))` }}
        >
          {months.map(([label, i, o], idx) => {
            const on = idx === aSel;
            const bar = (c: FinColor, v: number, delay: number) => (
              <div
                className="anim-bar"
                style={{
                  width: "34%",
                  maxWidth: 22,
                  height: `${(Math.max(0, v) / aMax) * 100}%`,
                  borderRadius: "6px 6px 3px 3px",
                  background: `linear-gradient(180deg, ${T.pal[c][0]}, ${T.pal[c][1]})`,
                  opacity: on ? 1 : 0.45,
                  animationDelay: `${delay}ms`,
                }}
              />
            );
            return (
              <button
                key={label}
                onClick={() => setSelIdx(idx)}
                aria-pressed={on}
                aria-label={`${label}: masuk ${s(i * 1e6)}, keluar ${s(o * 1e6)}`}
                className="flex h-full flex-col items-center gap-1.5 rounded-xl p-0"
                style={{ background: on ? (T.play ? "rgba(43,29,78,.04)" : "rgba(16,24,40,.04)") : "transparent" }}
              >
                <div className="flex w-full flex-1 items-end justify-center gap-[3px]">
                  {bar("green", i, idx * 50)}
                  {bar("red", o, idx * 50 + 50)}
                </div>
                <div style={{ fontSize: 12, fontWeight: T.bold, color: on ? T.ink : T.faint, height: 18 }}>{label}</div>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3.5" style={{ ...small, color: T.play ? "#6b5d80" : "#4b5563" }}>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: T.pal.green[1] }} />
            Pemasukan
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: T.pal.red[1] }} />
            Pengeluaran
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2" aria-live="polite">
          {detail.map(([label, v, c]) => (
            <div key={label} className="flex min-w-0 flex-col gap-0.5 rounded-[14px] p-2.5" style={{ background: T.pal[c][0] + "26" }}>
              <div style={{ fontSize: 11, fontWeight: T.play ? 800 : 600, color: T.play ? "#6b5d80" : "#4b5563" }}>
                {label} {sm[0]}
              </div>
              <div className="truncate" style={{ fontWeight: T.bold, fontSize: 14 }}>
                {s(v * 1e6)}
              </div>
            </div>
          ))}
        </div>
      </FCard>

      <div className="grid grid-cols-2 gap-3 desk:grid-cols-4">
        {stats.map((x) => (
          <FCard key={x.label} pad={14} className="flex flex-col gap-1.5" style={{ borderRadius: 20 }}>
            <FDot c={x.c} icon={x.icon} size={32} />
            <div style={{ ...small, color: T.muted }}>{x.label}</div>
            <div style={{ fontWeight: T.bold, fontSize: 16, lineHeight: 1.15 }}>{x.value}</div>
          </FCard>
        ))}
      </div>

      <FCard className="flex flex-col gap-3">
        <FTitle>Kategori terbesar</FTitle>
        {cats.length === 0 && <div style={{ fontSize: 14, fontWeight: T.play ? 800 : 600, color: T.muted }}>Belum ada pengeluaran bulan ini.</div>}
        {cats.slice(0, 6).map((x) => {
          const k = catInfo(x.type, x.cat);
          return (
            <div key={`${x.type}:${x.cat}`} className="flex items-center gap-3">
              <FDot c={k.c} icon={k.icon} size={34} />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex justify-between gap-2" style={{ fontSize: 14, fontWeight: T.play ? 800 : 600 }}>
                  <span className="min-w-0 truncate">{x.cat}</span>
                  <span className="whitespace-nowrap" style={{ color: T.play ? "#6b5d80" : "#4b5563" }}>
                    {m(x.v)}
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full"
                  style={{ background: T.subtle }}
                  role="meter"
                  aria-label={`${x.cat}: ${Math.round((x.v / topMax) * 100)}% dari kategori terbesar`}
                  aria-valuenow={Math.round((x.v / topMax) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="anim-bar-x h-full rounded-full" style={{ width: `${(x.v / topMax) * 100}%`, background: `linear-gradient(90deg, ${T.pal[k.c][0]}, ${T.pal[k.c][1]})` }} />
                </div>
              </div>
            </div>
          );
        })}
      </FCard>

      <FCard className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-[14px]" style={{ background: T.ink, color: "#fff" }}>
            <Icon name="description" size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 style={{ fontFamily: T.head, fontSize: 19, fontWeight: T.headWeight, lineHeight: 1.1, letterSpacing: T.play ? 0 : "-.02em" }}>Laporan {MONTH_LABEL}</h2>
            <div style={{ fontSize: 13, fontWeight: T.bold, color: T.muted }}>Ringkasan arus kas, kategori, dan saldo akun</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => showToast("Laporan PDF sedang disiapkan…")}
            className="flex h-12 items-center justify-center gap-1.5 rounded-[14px]"
            style={{ background: T.ink, color: "#fff", fontFamily: T.body, fontWeight: T.bold, fontSize: 14 }}
          >
            <Icon name="download" size={20} />
            Unduh PDF
          </button>
          <button
            onClick={() => showToast("Link laporan disalin")}
            className="flex h-12 items-center justify-center gap-1.5 rounded-[14px]"
            style={{ background: T.subtle, color: T.ink, fontFamily: T.body, fontWeight: T.bold, fontSize: 14 }}
          >
            <Icon name="share" size={20} />
            Bagikan
          </button>
        </div>
      </FCard>
    </>
  );
}
