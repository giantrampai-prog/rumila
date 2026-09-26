"use client";

// Beranda Keuangan — port layar "isBeranda" dari prototype Keuangan-Playful / Keuangan-Mobile.

import Link from "next/link";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { useAsisten } from "@/components/finance/modals";
import { FCard, FDot, FSeg, FTitle, TxRow, useFT, useMoney } from "@/components/finance/ui";
import { ACCOUNTS, TODAY, balances, catInfo, isOut, totalIn, totalOut, weekday, type FinColor } from "@/lib/finance/data";
import { useFinance, useFinUI } from "@/lib/finance/store";
import { useMe } from "@/lib/store";

const cell = "grid min-w-0 grid-cols-[minmax(0,1fr)]";

export default function FinanceHome() {
  const T = useFT();
  const me = useMe();
  const hide = useFinance((s) => s.hide);
  const toggleHide = useFinance((s) => s.toggleHide);
  const headBtn: CSSProperties = T.play
    ? { background: "#fff", color: "#6b5d80", boxShadow: "0 3px 0 rgba(43,29,78,.08)" }
    : { background: "#fff", color: "#4b5563", border: "1px solid #e6e8ec" };

  return (
    <>
      <div className="flex items-center gap-2.5">
        <Link href="/beranda" aria-label="Kembali ke Beranda" title="Kembali ke Beranda" className="flex size-11 shrink-0 items-center justify-center rounded-[14px]" style={{ ...headBtn, color: T.ink }}>
          <Icon name="apps" size={24} />
        </Link>
        <div className="min-w-0 flex-1">
          <div style={{ fontSize: 13, fontWeight: T.bold, color: T.muted }}>Sabtu, 26 September 2026</div>
          <h1 className="truncate" style={{ fontFamily: T.head, fontSize: 22, fontWeight: T.headWeight, lineHeight: 1.1, letterSpacing: T.play ? 0 : "-.02em" }}>
            Halo, {me?.name ?? "Kamu"}
          </h1>
        </div>
        <button onClick={toggleHide} aria-label={hide ? "Tampilkan nominal" : "Sembunyikan nominal"} aria-pressed={hide} className="flex size-11 items-center justify-center rounded-[14px]" style={headBtn}>
          <Icon name={hide ? "visibility_off" : "visibility"} />
        </button>
        <Link href="/finance/tagihan" aria-label="Tagihan & notifikasi" className="relative flex size-11 items-center justify-center rounded-[14px]" style={headBtn}>
          <Icon name="notifications" />
          <span className="absolute top-[9px] right-2.5 size-[9px] rounded-full" style={{ background: T.pal.red[1], border: "2px solid #fff" }} />
        </Link>
      </div>

      <div className="flex flex-col gap-[18px] desk:grid desk:grid-cols-2 desk:gap-5 wide:grid-cols-3">
        <div className={`${cell} desk:col-[1/3] desk:row-[1] wide:row-[1/3]`}>
          <Hero />
        </div>
        <div className={`${cell} desk:col-[2] desk:row-[2] wide:col-[3] wide:row-[2]`}>
          <AsistenCard />
        </div>
        <div className={`${cell} desk:col-[1] desk:row-[2] wide:col-[3] wide:row-[1]`}>
          <Health />
        </div>
        <div className={`${cell} desk:col-[1/3] desk:row-[3]`}>
          <DailyCash />
        </div>
        <div className={`${cell} desk:col-[1] desk:row-[4] wide:col-[3] wide:row-[3]`}>
          <Donut />
        </div>
        <div className={`${cell} desk:col-[2] desk:row-[4] wide:col-[3] wide:row-[4]`}>
          <UpcomingBills />
        </div>
        <div className={`${cell} desk:col-[1/3] desk:row-[5] wide:row-[4]`}>
          <Recent />
        </div>
      </div>
    </>
  );
}

function SeeAll({ href, label }: { href: string; label: string }) {
  const T = useFT();
  return (
    <Link href={href} aria-label={label} className="py-2.5" style={{ fontSize: 14, fontWeight: T.play ? 800 : 600, color: T.accent }}>
      Semua
    </Link>
  );
}

/* ---------- saldo ---------- */

function Hero() {
  const T = useFT();
  const { m } = useMoney();
  const tx = useFinance((s) => s.tx);
  const bal = balances(tx);
  const total = Object.values(bal).reduce((a, b) => a + b, 0);
  const stat = (icon: string, color: string, label: string, v: number) => (
    <div className="flex flex-col gap-0.5 rounded-2xl px-3.5 py-3" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)" }}>
      <div className="flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: T.play ? 800 : 600, opacity: 0.9 }}>
        <Icon name={icon} size={16} style={{ color }} />
        {label}
      </div>
      <div className="whitespace-nowrap" style={{ fontWeight: T.bold, fontSize: 16 }}>
        {m(v)}
      </div>
    </div>
  );
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-[28px] p-[22px] text-white" style={{ background: T.hero, boxShadow: T.heroShadow }}>
      <div
        aria-hidden
        className="absolute -top-20 -right-[60px] size-[200px] rounded-full"
        style={T.play ? { background: "rgba(255,255,255,.14)" } : { border: "1px solid rgba(255,196,46,.4)" }}
      />
      <Link href="/finance/akun" className="relative flex flex-col gap-1 text-left text-white" aria-label="Lihat akun finansial">
        <div className="flex items-center gap-1.5" style={{ fontSize: 14, fontWeight: T.play ? 800 : 600, opacity: 0.9 }}>
          Total saldo · {ACCOUNTS.length} akun
          <Icon name="chevron_right" size={18} />
        </div>
        <div style={{ fontFamily: T.head, fontSize: 34, fontWeight: T.headWeight, lineHeight: 1.05, letterSpacing: "-.01em" }}>{m(total)}</div>
      </Link>
      <div className="relative grid grid-cols-2 gap-2.5">
        {stat("south_west", "#9cc7b1", "Pemasukan", totalIn(tx))}
        {stat("north_east", "#e3a39c", "Pengeluaran", totalOut(tx))}
      </div>
    </div>
  );
}

/* ---------- asisten ---------- */

function AsistenCard() {
  const T = useFT();
  const me = useMe();
  const openAsisten = useFinUI((s) => s.openAsisten);
  const scan = useAsisten((s) => s.scan);
  const talk = useAsisten((s) => s.talk);
  const by = me?.name || "Kamu";
  const quick = (bg: string, color: string): CSSProperties => ({ background: bg, color });
  return (
    <FCard className="flex items-center gap-3" style={{ padding: "14px 14px 14px 18px" }}>
      <button onClick={openAsisten} className="flex min-w-0 flex-1 items-center gap-3 text-left" style={{ color: T.ink }}>
        {T.play ? (
          <FDot c="green" icon="auto_awesome" size={40} />
        ) : (
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-[14px]" style={{ background: T.ink, color: "#fff" }}>
            <Icon name="auto_awesome" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block" style={{ fontWeight: T.bold, fontSize: 15 }}>
            Catat cepat pakai Asisten
          </span>
          <span className="block truncate" style={{ fontSize: 13, fontWeight: T.bold, color: T.muted }}>
            Ketik, bicara, atau scan struk…
          </span>
        </span>
      </button>
      <button
        onClick={() => {
          openAsisten();
          scan(by);
        }}
        aria-label="Scan struk"
        title="Scan struk"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={quick(T.subtle, T.play ? "#6b5d80" : "#4b5563")}
      >
        <Icon name="document_scanner" />
      </button>
      <button
        onClick={() => {
          openAsisten();
          talk(by);
        }}
        aria-label="Catat pakai suara"
        title="Catat pakai suara"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={quick(T.play ? "#e3f9ec" : "#e9f2ec", T.pal.green[2])}
      >
        <Icon name="mic" />
      </button>
    </FCard>
  );
}

/* ---------- kesehatan cashflow ---------- */

function Health() {
  const T = useFT();
  const { s } = useMoney();
  const tx = useFinance((st) => st.tx);
  const inc = totalIn(tx);
  const exp = totalOut(tx);
  const ratio = inc ? (inc - exp) / inc : 0;
  const hc: FinColor = ratio >= 0.2 ? "green" : ratio >= 0 ? "gold" : "red";
  const [l, mid, d] = T.pal[hc];
  const label = hc === "green" ? "Sehat" : hc === "gold" ? "Cukup" : "Waspada";
  const icon = hc === "green" ? "sentiment_very_satisfied" : hc === "gold" ? "sentiment_neutral" : "sentiment_dissatisfied";
  const width = Math.max(4, Math.min(100, (ratio * 100) / 0.5));
  return (
    <FCard className="flex items-center gap-3.5">
      <FDot c={hc} icon={icon} size={60} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span style={{ fontSize: 13, fontWeight: T.play ? 800 : 600, color: T.muted }}>Kesehatan cashflow · </span>
            <span style={{ fontSize: 14, fontWeight: T.bold, color: d }}>{label}</span>
          </div>
          <div style={{ fontFamily: T.head, fontSize: 24, fontWeight: T.headWeight, color: d, lineHeight: 1 }}>
            {(ratio >= 0 ? "+" : "") + Math.round(ratio * 100)}%
          </div>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full"
          style={{ background: T.subtle }}
          role="meter"
          aria-label="Rasio surplus terhadap pemasukan"
          aria-valuenow={Math.round(ratio * 100)}
          aria-valuemin={-100}
          aria-valuemax={100}
        >
          <div className="anim-bar-x h-full rounded-full" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${l}, ${mid})` }} />
        </div>
        <div style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>{ratio >= 0 ? `Surplus ${s(inc - exp)} bulan ini` : `Defisit ${s(exp - inc)} bulan ini`}</div>
      </div>
    </FCard>
  );
}

/* ---------- cashflow harian ---------- */

function DailyCash() {
  const T = useFT();
  const { m } = useMoney();
  const tx = useFinance((s) => s.tx);
  const [mode, setMode] = useState<"out" | "in">("out");
  const [hov, setHov] = useState<number | null>(null);
  const [sel, setSel] = useState(TODAY);

  const days = useMemo(
    () =>
      Array.from({ length: TODAY }, (_, i) => {
        const d = i + 1;
        const list = tx.filter((t) => t.d === d && (mode === "out" ? isOut(t) : t.type === "in"));
        return { d, v: list.reduce((a, t) => a + t.amt, 0), n: list.length };
      }),
    [tx, mode],
  );
  const max = Math.max(1, ...days.map((x) => x.v));
  const active = hov ?? sel;
  const ad = days[active - 1];
  const c: FinColor = mode === "out" ? "red" : "green";
  const [l, mid, dk] = T.pal[c];
  const modeLabel = mode === "out" ? "Pengeluaran" : "Pemasukan";

  return (
    <FCard className="flex flex-col gap-3.5">
      <FTitle right={<FSeg value={mode} options={[["out", "Keluar"], ["in", "Masuk"]]} onChange={setMode} />}>Cashflow harian</FTitle>
      <div
        role="group"
        aria-label={`Grafik ${modeLabel.toLowerCase()} harian September`}
        onMouseLeave={() => setHov(null)}
        className="grid h-[130px] items-end gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${TODAY}, minmax(0,1fr))` }}
      >
        {days.map((x) => {
          const on = x.d === active;
          return (
            <button
              key={x.d}
              onMouseEnter={() => setHov(x.d)}
              onFocus={() => setHov(x.d)}
              onBlur={() => setHov(null)}
              onClick={() => {
                setSel(x.d);
                setHov(null);
              }}
              aria-label={`${x.d} September: ${m(x.v)}`}
              aria-pressed={x.d === sel}
              className="flex h-full items-end p-0"
            >
              <div
                className="anim-bar w-full"
                style={{
                  borderRadius: 4,
                  height: x.v ? `${Math.max(6, (x.v / max) * 100)}%` : 4,
                  background: x.v ? (on ? dk : `linear-gradient(180deg, ${l}, ${mid})`) : T.line,
                  outline: on ? `2px solid ${dk}` : "none",
                  outlineOffset: 1,
                  animationDelay: `${x.d * 15}ms`,
                }}
              />
            </button>
          );
        })}
      </div>
      <div aria-hidden className="-mt-1.5 flex justify-between" style={{ fontSize: 11, fontWeight: T.play ? 800 : 600, color: T.faint }}>
        {[1, 5, 10, 15, 20, 26].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2.5 rounded-2xl px-3.5 py-3" style={{ background: T.soft }} aria-live="polite">
        <div>
          <div style={{ fontSize: 12, fontWeight: T.play ? 800 : 600, color: T.muted }}>
            {weekday(ad.d)}, {ad.d} Sep · {modeLabel}
          </div>
          <div style={{ fontWeight: T.bold, fontSize: 17 }}>{m(ad.v)}</div>
        </div>
        <div className="text-right" style={{ fontSize: 12, fontWeight: T.play ? 800 : 600, color: T.muted }}>
          {ad.n ? `${ad.n} transaksi` : "Tidak ada"}
        </div>
      </div>
    </FCard>
  );
}

/* ---------- distribusi pengeluaran ---------- */

function Donut() {
  const T = useFT();
  const { s } = useMoney();
  const tx = useFinance((st) => st.tx);
  const [selK, setSelK] = useState<string | null>(null);

  const exp = totalOut(tx);
  const slices = useMemo(() => {
    const totals = new Map<string, { type: "out" | "sd"; cat: string; v: number }>();
    for (const t of tx) {
      if (t.type !== "out" && t.type !== "sd") continue;
      const k = `${t.type}:${t.cat}`;
      const cur = totals.get(k);
      if (cur) cur.v += t.amt;
      else totals.set(k, { type: t.type, cat: t.cat, v: t.amt });
    }
    const list = [...totals.entries()].sort((a, b) => b[1].v - a[1].v);
    const top = list.slice(0, 5).map(([k, x]) => ({ k, name: x.cat, v: x.v, c: catInfo(x.type, x.cat).c }));
    const rest = list.slice(5).reduce((a, [, x]) => a + x.v, 0);
    return rest ? [...top, { k: "rest", name: "Lainnya", v: rest, c: "brown" as FinColor }] : top;
  }, [tx]);

  let acc = 0;
  const stops = slices.map((x) => {
    const a = acc;
    acc += (x.v / exp) * 100;
    return `${T.pal[x.c][1]} ${a}% ${acc}%`;
  });
  const sel = slices.find((x) => x.k === selK);
  const pct = (v: number) => (exp ? Math.round((v / exp) * 100) : 0) + "%";
  const center = sel ? { label: sel.name, value: s(sel.v), pct: pct(sel.v) } : { label: "Total keluar", value: s(exp), pct: `${slices.length} kategori` };

  return (
    <FCard className="flex flex-col gap-3.5">
      <FTitle>Distribusi pengeluaran</FTitle>
      <div className="flex flex-wrap items-center justify-center gap-[18px]">
        <div
          role="img"
          aria-label={`Diagram donat pengeluaran: ${slices.map((x) => `${x.name} ${pct(x.v)}`).join(", ") || "belum ada data"}`}
          className="anim-fade relative size-[132px] shrink-0 rounded-full"
          style={{ background: stops.length ? `conic-gradient(${stops.join(",")})` : T.subtle }}
        >
          <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-white p-1 text-center">
            <div style={{ fontSize: 11, fontWeight: T.play ? 800 : 600, color: T.muted, lineHeight: 1.1 }}>{center.label}</div>
            <div style={{ fontWeight: T.bold, fontSize: 14, lineHeight: 1.2 }}>{center.value}</div>
            <div style={{ fontSize: 11, fontWeight: T.bold, color: T.ink }}>{center.pct}</div>
          </div>
        </div>
        <div className="flex min-w-[170px] flex-[1_1_170px] flex-col gap-0.5">
          {slices.map((x) => {
            const on = selK === x.k;
            return (
              <button
                key={x.k}
                onClick={() => setSelK(on ? null : x.k)}
                aria-pressed={on}
                className="flex min-h-8 w-full items-center gap-2 rounded-[10px] px-2 py-1.5"
                style={{ fontSize: 13, fontWeight: T.play ? 800 : 600, color: T.ink, background: on ? T.pal[x.c][0] + "44" : "transparent" }}
              >
                <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: T.pal[x.c][1] }} />
                <span className="min-w-0 flex-1 truncate text-left">{x.name}</span>
                <span style={{ color: T.muted }}>{pct(x.v)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </FCard>
  );
}

/* ---------- tagihan & transaksi ---------- */

function UpcomingBills() {
  const T = useFT();
  const { m } = useMoney();
  const bills = useFinance((s) => s.bills);
  const upcoming = bills
    .filter((b) => !b.paid)
    .sort((a, b) => a.day - b.day)
    .slice(0, 2);
  return (
    <FCard className="flex flex-col gap-1.5">
      <FTitle right={<SeeAll href="/finance/tagihan" label="Semua tagihan" />}>Tagihan mendatang</FTitle>
      {upcoming.length === 0 && <Muted>Semua tagihan sudah lunas.</Muted>}
      {upcoming.map((b) => {
        const left = b.day - TODAY;
        const soon = left <= 3;
        return (
          <div key={b.id} className="flex items-center gap-3 py-2">
            <FDot c={b.c} icon={b.icon} size={40} />
            <div className="min-w-0 flex-1">
              <div style={{ fontWeight: T.play ? 800 : 600, fontSize: 15 }}>{b.name}</div>
              <div style={{ fontSize: 12, fontWeight: T.play ? 800 : 600, color: soon ? T.neg : T.muted }}>
                {(left <= 0 ? "Hari ini" : `${left} hari lagi`) + ` · ${b.due}`}
              </div>
            </div>
            <div className="whitespace-nowrap" style={{ fontWeight: T.bold, fontSize: 15 }}>
              {m(b.amt)}
            </div>
          </div>
        );
      })}
    </FCard>
  );
}

function Recent() {
  const T = useFT();
  const tx = useFinance((s) => s.tx);
  const recent = [...tx].sort((a, b) => b.d - a.d).slice(0, 5);
  return (
    <FCard className="flex flex-col">
      <FTitle right={<SeeAll href="/finance/transaksi" label="Semua transaksi" />}>Transaksi terakhir</FTitle>
      {recent.length === 0 && <Muted>Belum ada transaksi.</Muted>}
      {recent.map((t) => (
        <div key={t.id} className="py-0.5" style={{ borderBottom: `1.5px solid ${T.subtle}` }}>
          <TxRow t={t} />
        </div>
      ))}
    </FCard>
  );
}

function Muted({ children }: { children: ReactNode }) {
  const T = useFT();
  return <div style={{ fontSize: 14, fontWeight: T.play ? 800 : 600, color: T.muted, padding: "8px 0" }}>{children}</div>;
}
