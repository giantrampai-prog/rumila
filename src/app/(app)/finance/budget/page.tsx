"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { FBar, FBtn, FCard, FDot, FEmpty, FLabel, FModal, PageHead, gridCards, useFT, useInputStyle, useMoney } from "@/components/finance/ui";
import { CAT_DEF, TODAY, catInfo, spentBy, type FinColor } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";
import { useUI } from "@/lib/store";

/** Status budget: aman < 80%, hampir 80–99%, lewat ≥ 100%. */
const pctCol = (p: number): FinColor => (p >= 1 ? "red" : p >= 0.8 ? "gold" : "green");
const DAYS_LEFT = 30 - TODAY;

type Form = { cat: string; limit: string; editing: boolean } | null;

export default function BudgetPage() {
  const T = useFT();
  const { m, s } = useMoney();
  const tx = useFinance((st) => st.tx);
  const budget = useFinance((st) => st.budget);
  const setBudget = useFinance((st) => st.setBudget);
  const removeBudget = useFinance((st) => st.removeBudget);
  const toast = useUI((st) => st.showToast);
  const [form, setForm] = useState<Form>(null);
  const inputStyle = useInputStyle();

  const w2 = T.play ? 800 : 600;
  const bud = budget.map(([cat, lim]) => ({ cat, lim, sp: spentBy(tx, cat) }));
  const budTotal = bud.reduce((a, b) => a + b.lim, 0);
  const budUsed = bud.reduce((a, b) => a + b.sp, 0);
  const over = bud.filter((b) => b.sp >= b.lim).length;
  const totP = budTotal ? budUsed / budTotal : 0;
  const totC = T.pal[pctCol(totP)];
  const list = [...bud].sort((a, b) => b.sp / b.lim - a.sp / a.lim);

  const freeCats = CAT_DEF.out.map(([n]) => n).filter((n) => !budget.some(([c]) => c === n));
  const openAdd = () => setForm({ cat: freeCats[0] ?? "", limit: "", editing: false });
  const openEdit = (cat: string, lim: number) => setForm({ cat, limit: String(lim), editing: true });
  const limNum = form ? parseInt(form.limit || "0", 10) : 0;
  const canSave = !!form && !!form.cat && limNum > 0;

  const save = () => {
    if (!form || !canSave) return;
    setBudget(form.cat, limNum);
    toast(form.editing ? `Budget ${form.cat} diperbarui` : `Budget ${form.cat} ditambahkan`);
    setForm(null);
  };
  const remove = () => {
    if (!form) return;
    removeBudget(form.cat);
    toast(`Budget ${form.cat} dihapus`);
    setForm(null);
  };

  return (
    <>
      <PageHead
        title="Budget"
        sub="Batas belanja per kategori · September"
        right={
          <FBtn icon="add" onClick={openAdd} disabled={freeCats.length === 0}>
            Budget
          </FBtn>
        }
      />

      <FCard pad={20} className="flex flex-col gap-2.5">
        <div className="flex items-end justify-between gap-2.5">
          <div>
            <div style={{ fontSize: 13, fontWeight: w2, color: T.muted }}>Sisa budget</div>
            <div style={{ fontFamily: T.head, fontSize: 30, fontWeight: T.headWeight, lineHeight: 1, letterSpacing: T.play ? 0 : "-.02em" }}>{m(budTotal - budUsed)}</div>
          </div>
          <div className="text-right" style={{ fontSize: 13, fontWeight: w2, color: T.muted }}>
            Terpakai {s(budUsed)}
            <br />
            dari {s(budTotal)}
          </div>
        </div>
        <FBar pct={totP * 100} height={14} color={`linear-gradient(90deg, ${totC[0]}, ${totC[1]})`} />
        <div style={{ fontSize: 12, fontWeight: w2, color: T.muted }}>
          {over ? `${over} kategori sudah melewati batas. Sisa ${DAYS_LEFT} hari lagi.` : `Semua kategori masih dalam batas. Sisa ${DAYS_LEFT} hari lagi.`}
        </div>
      </FCard>

      {list.length === 0 ? (
        <FEmpty icon="donut_small">Belum ada budget. Tambahkan lewat tombol “+ Budget”.</FEmpty>
      ) : (
        <div className={gridCards}>
          {list.map((b) => {
            const k = catInfo("out", b.cat);
            const p = b.lim ? b.sp / b.lim : 0;
            const c = T.pal[pctCol(p)];
            const status = p >= 1 ? "Lewat batas" : p >= 0.8 ? "Hampir habis" : "Aman";
            return (
              <FCard key={b.cat} pad={16} className="flex flex-col gap-2.5" style={{ borderRadius: 20 }}>
                <div className="flex items-center gap-3">
                  <FDot c={k.c} icon={k.icon} size={40} />
                  <div className="min-w-0 flex-1">
                    <div style={{ fontWeight: T.bold, fontSize: 15 }}>{b.cat}</div>
                    <div style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>
                      {s(b.sp)} dari {s(b.lim)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: 13, fontWeight: T.bold, color: c[2], whiteSpace: "nowrap" }}>{p >= 1 ? "Lebih " + s(b.sp - b.lim) : "Sisa " + s(b.lim - b.sp)}</div>
                    <div style={{ fontSize: 11, fontWeight: w2, color: T.muted }}>
                      {status} · {Math.round(p * 100)}%
                    </div>
                  </div>
                  <button
                    onClick={() => openEdit(b.cat, b.lim)}
                    aria-label={`Ubah budget ${b.cat}`}
                    title="Ubah batas"
                    className="flex size-9 shrink-0 items-center justify-center rounded-[10px]"
                    style={{ background: T.subtle, color: T.ink2 }}
                  >
                    <Icon name="edit" size={18} />
                  </button>
                </div>
                <FBar pct={p * 100} color={`linear-gradient(90deg, ${c[0]}, ${c[1]})`} />
              </FCard>
            );
          })}
        </div>
      )}

      <FModal open={!!form} onClose={() => setForm(null)} title={form?.editing ? `Budget ${form.cat}` : "Tambah budget"} width={440}>
        {form && (
          <>
            <label className="flex flex-col gap-1.5">
              <FLabel>Kategori</FLabel>
              {form.editing ? (
                <div className="flex items-center gap-2.5" style={{ ...inputStyle, background: T.subtle }}>
                  <Icon name={catInfo("out", form.cat).icon} size={20} />
                  {form.cat}
                </div>
              ) : (
                <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} style={inputStyle}>
                  {freeCats.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              )}
            </label>
            <label className="flex flex-col gap-1.5">
              <FLabel>Batas per bulan</FLabel>
              <div className="flex items-center gap-2" style={{ ...inputStyle, height: 52 }}>
                <span style={{ fontWeight: T.bold, color: T.muted }}>Rp</span>
                <input
                  value={limNum ? limNum.toLocaleString("id-ID") : ""}
                  onChange={(e) => setForm({ ...form, limit: e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 12) })}
                  inputMode="numeric"
                  placeholder="0"
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent outline-none"
                  style={{ fontFamily: T.body, fontWeight: T.bold, fontSize: 20, color: T.ink }}
                />
              </div>
            </label>
            {form.editing && (
              <div style={{ fontSize: 13, fontWeight: w2, color: T.muted }}>
                Terpakai bulan ini: {s(spentBy(tx, form.cat))}
              </div>
            )}
            <div className="flex gap-2">
              {form.editing && (
                <FBtn variant="danger" icon="delete" onClick={remove}>
                  Hapus
                </FBtn>
              )}
              <FBtn onClick={save} disabled={!canSave} className="flex-1" style={{ height: 52 }}>
                Simpan budget
              </FBtn>
            </div>
          </>
        )}
      </FModal>
    </>
  );
}
