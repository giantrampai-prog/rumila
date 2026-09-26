"use client";

import { FCard, FDot, PageHead, gridCards, useFT, useMoney } from "@/components/finance/ui";
import { PROPS } from "@/lib/finance/data";

// Layar "Properti & Aset Fisik" — port isProperti dari prototype Keuangan-Playful / Keuangan-Mobile.

export default function PropertiPage() {
  const T = useFT();
  const { m, s } = useMoney();
  const total = PROPS.reduce((a, p) => a + p.value, 0);
  const buy = PROPS.reduce((a, p) => a + p.buy, 0);
  const small = T.play ? 800 : 600;

  return (
    <>
      <PageHead title="Properti & Aset Fisik" sub="Rumah, kendaraan, perhiasan" />

      <FCard pad={20}>
        <div style={{ fontSize: 13, fontWeight: small, color: T.muted }}>Estimasi nilai total</div>
        <div style={{ fontFamily: T.head, fontSize: 32, fontWeight: T.headWeight, lineHeight: 1.1, letterSpacing: T.play ? 0 : "-.02em" }}>{m(total)}</div>
        <div style={{ fontSize: 13, fontWeight: T.bold, color: T.muted }}>Harga beli {m(buy)}</div>
      </FCard>

      <div className={gridCards}>
        {PROPS.map((p) => {
          const ch = (p.value - p.buy) / p.buy;
          const up = ch >= 0;
          return (
            <FCard key={p.name} pad={16} className="flex items-center gap-3" style={{ borderRadius: 20 }}>
              <FDot c={p.c} icon={p.icon} size={46} />
              <div className="min-w-0 flex-1">
                <div style={{ fontWeight: T.bold, fontSize: 16 }}>{p.name}</div>
                <div style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>
                  Beli {s(p.buy)} · {p.year}
                </div>
              </div>
              <div className="text-right">
                <div style={{ fontWeight: T.bold, fontSize: 15, whiteSpace: "nowrap" }}>{s(p.value)}</div>
                <div style={{ fontSize: 12, fontWeight: T.bold, color: up ? T.pos : T.neg }}>
                  {up ? "▲ " : "▼ "}
                  {Math.abs(Math.round(ch * 100))}%
                </div>
              </div>
            </FCard>
          );
        })}
      </div>
    </>
  );
}
