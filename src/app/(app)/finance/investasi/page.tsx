"use client";

import { useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui";
import { FBtn, FCard, FDot, FLabel, FModal, FTitle, PageHead, gridCards, useFT, useInputStyle, useMoney } from "@/components/finance/ui";
import { rp, type Investment } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";
import { useUI } from "@/lib/store";

// Layar "Investasi" — port isInvestasi dari prototype Keuangan-Playful / Keuangan-Mobile.
// Beli/Jual = ubah posisi sebesar `step`; Update = isi harga pasar baru lewat modal.

const fmtQ = (q: number) => (q < 1 ? q.toLocaleString("id-ID", { maximumFractionDigits: 4 }) : q.toLocaleString("id-ID"));
const pct1 = (n: number) => n.toFixed(1).replace(".", ",");

export default function InvestasiPage() {
  const T = useFT();
  const { m, s } = useMoney();
  const inv = useFinance((st) => st.inv);
  const tradeInv = useFinance((st) => st.tradeInv);
  const setInvPrice = useFinance((st) => st.setInvPrice);
  const showToast = useUI((st) => st.showToast);
  const [editing, setEditing] = useState<Investment | null>(null);

  const invVal = inv.reduce((a, v) => a + v.qty * v.price, 0);
  const invModal = inv.reduce((a, v) => a + v.qty * v.avg, 0);
  const up = invVal >= invModal;
  const sign = up ? "+" : "";
  const invPl = `${sign}${invModal ? pct1(((invVal - invModal) / invModal) * 100) : "0"}% · ${sign}${s(invVal - invModal)}`;

  const posC = T.play ? { bg: "#e3f9ec", fg: "#12904a" } : { bg: "#e9f2ec", fg: "#2c6b4f" };
  const negC = T.play ? { bg: "#ffe8ea", fg: "#c92a3a" } : { bg: "#f7eae8", fg: "#9a3c35" };
  const small = T.play ? 800 : 600;

  const actBtn = (bg: string, fg: string): CSSProperties => ({ height: 44, borderRadius: 14, background: bg, color: fg, fontFamily: T.body, fontWeight: T.bold, fontSize: 14 });

  const buy = (v: Investment) => {
    tradeInv(v.id, v.step);
    showToast(`Beli ${fmtQ(v.step)} ${v.unit} ${v.name}`);
  };
  const sell = (v: Investment) => {
    if (v.qty < v.step) return showToast("Posisi tidak cukup");
    tradeInv(v.id, -v.step);
    showToast(`Jual ${fmtQ(v.step)} ${v.unit} ${v.name}`);
  };

  return (
    <>
      <PageHead title="Investasi" sub="Emas, reksa dana, saham, SBN, crypto" />

      <FCard pad={20} className="flex flex-col gap-3">
        <div style={{ fontSize: 13, fontWeight: small, color: T.muted }}>Total investasi</div>
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div style={{ fontFamily: T.head, fontSize: 32, fontWeight: T.headWeight, lineHeight: 1, letterSpacing: T.play ? 0 : "-.02em" }}>{m(invVal)}</div>
          <div style={{ fontWeight: T.bold, fontSize: 14, color: up ? posC.fg : negC.fg, background: up ? posC.bg : negC.bg, padding: "6px 10px", borderRadius: 999 }}>{invPl}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: T.bold, color: T.muted }}>Modal {m(invModal)}</div>
        <div className="flex overflow-hidden rounded-full" style={{ height: 12, gap: 2 }} role="img" aria-label="Alokasi portofolio">
          {inv.map((v) => (
            <div key={v.id} title={v.name} style={{ flex: v.qty * v.price, background: T.pal[v.c][1], minWidth: 4 }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1" style={{ fontSize: 12, fontWeight: small, color: T.muted }}>
          {inv.map((v) => (
            <span key={v.id} className="flex items-center gap-1">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.pal[v.c][1] }} />
              {v.kind} {invVal ? Math.round(((v.qty * v.price) / invVal) * 100) : 0}%
            </span>
          ))}
        </div>
      </FCard>

      <FTitle
        right={
          <button onClick={() => showToast("Riwayat transaksi investasi segera hadir")} className="flex items-center gap-1" style={{ fontSize: 14, fontWeight: T.bold, color: T.accent }}>
            <Icon name="history" size={18} />
            Riwayat
          </button>
        }
      >
        Aset kamu
      </FTitle>

      <div className={gridCards}>
        {inv.map((v) => {
          const val = v.qty * v.price;
          const mod = v.qty * v.avg;
          const pl = val - mod;
          const vup = pl >= 0;
          return (
            <FCard key={v.id} className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <FDot c={v.c} icon={v.icon} size={46} />
                <div className="min-w-0 flex-1">
                  <div style={{ fontWeight: T.bold, fontSize: 16 }}>{v.name}</div>
                  <div style={{ fontSize: 12, fontWeight: small, color: T.muted }}>{v.kind}</div>
                </div>
                <div className="text-right">
                  <div style={{ fontWeight: T.bold, fontSize: 16, whiteSpace: "nowrap" }}>{m(val)}</div>
                  <div style={{ fontSize: 12, fontWeight: T.bold, color: vup ? posC.fg : negC.fg }}>
                    {vup ? "+" : ""}
                    {s(pl)} ({mod ? pct1((pl / mod) * 100) : "0"}%)
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Posisi", `${fmtQ(v.qty)} ${v.unit}`],
                  ["Avg beli", s(v.avg)],
                  ["Pasar", s(v.price)],
                ].map(([k, val2]) => (
                  <div key={k} style={{ background: T.soft, borderRadius: 14, padding: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: small, color: T.muted }}>{k}</div>
                    <div style={{ fontWeight: T.bold, fontSize: 13 }}>{val2}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => buy(v)} aria-label={`Beli ${fmtQ(v.step)} ${v.unit} ${v.name}`} className="flex items-center justify-center gap-1 active:translate-y-px" style={actBtn(posC.bg, posC.fg)}>
                  <Icon name="trending_up" size={18} />
                  Beli
                </button>
                <button onClick={() => sell(v)} aria-label={`Jual ${fmtQ(v.step)} ${v.unit} ${v.name}`} className="flex items-center justify-center gap-1 active:translate-y-px" style={actBtn(negC.bg, negC.fg)}>
                  <Icon name="trending_down" size={18} />
                  Jual
                </button>
                <button onClick={() => setEditing(v)} aria-label={`Update harga ${v.name}`} className="flex items-center justify-center gap-1 active:translate-y-px" style={actBtn(T.subtle, T.ink)}>
                  <Icon name="sync" size={18} />
                  Update
                </button>
              </div>
            </FCard>
          );
        })}
      </div>

      {editing && (
        <PriceModal
          key={editing.id}
          v={editing}
          onClose={() => setEditing(null)}
          onSave={(price) => {
            setInvPrice(editing.id, price);
            showToast(`Harga ${editing.name} diperbarui`);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

function PriceModal({ v, onClose, onSave }: { v: Investment; onClose: () => void; onSave: (price: number) => void }) {
  const T = useFT();
  const input = useInputStyle();
  const [val, setVal] = useState(String(v.price));
  const price = Number(val.replace(/\./g, "").replace(",", "."));
  const ok = Number.isFinite(price) && price > 0;
  const diff = ok ? ((price - v.price) / v.price) * 100 : 0;

  return (
    <FModal open onClose={onClose} title={`Update harga ${v.name}`} width={440}>
      <p style={{ fontSize: 13, fontWeight: T.play ? 800 : 600, color: T.muted }}>
        Harga pasar sekarang {rp(v.price)} per {v.unit}. Masukkan harga terbaru.
      </p>
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (ok) onSave(Math.round(price));
        }}
      >
        <label className="grid gap-1.5">
          <FLabel>Harga per {v.unit} (Rp)</FLabel>
          <input autoFocus inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value)} style={input} />
        </label>
        {ok && Math.abs(diff) >= 0.05 && (
          <div style={{ fontSize: 13, fontWeight: T.bold, color: diff >= 0 ? T.pos : T.neg }}>
            {diff >= 0 ? "▲" : "▼"} {Math.abs(diff).toFixed(1).replace(".", ",")}% dari harga sebelumnya
          </div>
        )}
        <div className="flex justify-end gap-2">
          <FBtn variant="soft" onClick={onClose}>
            Batal
          </FBtn>
          <FBtn type="submit" disabled={!ok}>
            Simpan harga
          </FBtn>
        </div>
      </form>
    </FModal>
  );
}
