"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { FBtn, FCard, FEmpty, FLabel, FModal, PageHead, gridCards, useFT, useInputStyle, useMoney } from "@/components/finance/ui";
import { MON, addMonths, rs, type FinColor } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";
import { useUI } from "@/lib/store";

/** Bulan berjalan: September 2026. */
const NOW_IDX = 2026 * 12 + 8;
/** "Jun 2027" → sisa bulan dari Sep 2026 (min 1). */
function monthsTo(due: string) {
  const [mon, y] = due.split(" ");
  const i = MON.indexOf(mon);
  const yr = parseInt(y, 10);
  if (i < 0 || !yr) return 12;
  return Math.max(1, yr * 12 + i - NOW_IDX);
}

const PRESETS: [string, string, FinColor][] = [
  ["Dana Darurat", "shield", "blue"],
  ["Ibadah", "mosque", "green"],
  ["Pendidikan", "school", "purple"],
  ["Liburan", "flight", "orange"],
  ["Rumah", "home", "teal"],
  ["Kendaraan", "directions_car", "red"],
  ["Gadget", "devices", "indigo"],
  ["Hadiah", "redeem", "pink"],
];

const digits = (v: string) => v.replace(/\D/g, "").replace(/^0+/, "").slice(0, 12);
type GoalForm = { name: string; preset: number; target: string; saved: string; step: string; due: string };
const GF0: GoalForm = { name: "", preset: 0, target: "", saved: "", step: "500000", due: "2027-09" };

export default function GoalsPage() {
  const T = useFT();
  const { s } = useMoney();
  const goals = useFinance((st) => st.goals);
  const saveToGoal = useFinance((st) => st.saveToGoal);
  const addGoal = useFinance((st) => st.addGoal);
  const toast = useUI((st) => st.showToast);
  const inputStyle = useInputStyle();
  const [form, setForm] = useState<GoalForm | null>(null);

  const w2 = T.play ? 800 : 600;
  const totalSaved = goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = goals.reduce((a, g) => a + g.target, 0);

  const fTarget = form ? parseInt(form.target || "0", 10) : 0;
  const fSaved = form ? Math.min(parseInt(form.saved || "0", 10), fTarget) : 0;
  const fStep = form ? parseInt(form.step || "0", 10) : 0;
  const fDue = form ? addMonths(form.due || "2027-09", 0) : "";
  const fOk = !!form && !!form.name.trim() && fTarget > 0 && fStep > 0;

  const save = () => {
    if (!form || !fOk) return;
    const [, icon, c] = PRESETS[form.preset];
    addGoal({ name: form.name.trim(), icon, c, saved: fSaved, target: fTarget, step: fStep, due: fDue });
    toast(`Goal ${form.name.trim()} ditambahkan`);
    setForm(null);
  };

  const moneyField = (label: string, key: "target" | "saved" | "step", big?: boolean) =>
    form && (
      <label className="flex min-w-0 flex-col gap-1.5">
        <FLabel>{label}</FLabel>
        <div className="flex items-center gap-2" style={{ ...inputStyle, height: big ? 52 : 48 }}>
          <span style={{ fontWeight: T.bold, color: T.muted }}>Rp</span>
          <input
            value={form[key] ? parseInt(form[key], 10).toLocaleString("id-ID") : ""}
            onChange={(e) => setForm({ ...form, [key]: digits(e.target.value) })}
            inputMode="numeric"
            placeholder="0"
            className="min-w-0 flex-1 bg-transparent outline-none"
            style={{ fontFamily: T.body, fontWeight: big ? T.bold : T.play ? 700 : 500, fontSize: big ? 20 : 15, color: T.ink }}
          />
        </div>
      </label>
    );

  return (
    <>
      <PageHead
        title="Goals"
        sub={goals.length ? `Target finansial keluarga · ${s(totalSaved)} dari ${s(totalTarget)}` : "Target finansial keluarga"}
        right={
          <FBtn icon="add" onClick={() => setForm(GF0)}>
            Goal
          </FBtn>
        }
      />

      {goals.length === 0 ? (
        <FEmpty icon="flag">Belum ada goal. Yuk bikin target pertama keluarga!</FEmpty>
      ) : (
        <div className={gridCards}>
          {goals.map((g) => {
            const p = Math.min(1, g.saved / g.target);
            const [, main] = T.pal[g.c];
            const done = p >= 1;
            const hint = done ? "Target tercapai!" : `Nabung ${s((g.target - g.saved) / monthsTo(g.due))}/bulan biar tepat waktu`;
            return (
              <FCard key={g.id} className="flex flex-col gap-3.5">
                <div className="flex items-center gap-3.5">
                  <div
                    role="img"
                    aria-label={`${Math.round(p * 100)}% tercapai`}
                    className="relative size-[76px] shrink-0 rounded-full"
                    style={{ background: `conic-gradient(${main} ${p * 360}deg, ${T.play ? "#f1ecf7" : "#e6e8ec"} 0deg)`, transition: "background .6s" }}
                  >
                    <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-white">
                      <div style={{ fontWeight: T.bold, fontSize: 17, lineHeight: 1 }}>{Math.round(p * 100)}%</div>
                      <div style={{ fontSize: 10, fontWeight: w2, color: T.muted }}>tercapai</div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Icon name={g.icon} size={20} style={{ color: main }} />
                      <span className="truncate" style={{ fontWeight: T.bold, fontSize: 16 }}>
                        {g.name}
                      </span>
                    </div>
                    <div style={{ fontWeight: T.bold, fontSize: 15, marginTop: 4 }}>
                      {s(g.saved)} <span style={{ color: T.muted }}>/ {s(g.target)}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>
                      Kurang {s(Math.max(0, g.target - g.saved))} · target {g.due}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1" style={{ background: T.soft, borderRadius: 14, padding: "10px 12px", fontSize: 12, fontWeight: w2, color: T.play ? "#6b5d80" : "#4b5563" }}>
                    {hint}
                  </div>
                  <button
                    onClick={() => {
                      saveToGoal(g.id, -g.step);
                      toast(`Tarik ${rs(Math.min(g.step, g.saved))} dari ${g.name}`);
                    }}
                    disabled={g.saved <= 0}
                    aria-label={`Tarik ${rs(g.step)} dari ${g.name}`}
                    title={`Tarik ${rs(g.step)}`}
                    className="flex size-11 shrink-0 items-center justify-center disabled:opacity-40"
                    style={{ borderRadius: 14, background: T.subtle, color: T.ink2 }}
                  >
                    <Icon name="remove" size={20} />
                  </button>
                  <button
                    onClick={() => {
                      saveToGoal(g.id, g.step);
                      toast(`Setor ${rs(g.step)} ke ${g.name}`);
                    }}
                    disabled={done}
                    aria-label={`Setor ${rs(g.step)} ke ${g.name}`}
                    className="shrink-0 whitespace-nowrap disabled:opacity-45"
                    style={{ height: 44, padding: "0 16px", borderRadius: 14, fontFamily: T.body, fontWeight: T.bold, fontSize: 14, background: main, color: "#fff" }}
                  >
                    + {rs(g.step)}
                  </button>
                </div>
              </FCard>
            );
          })}
        </div>
      )}

      <FModal open={!!form} onClose={() => setForm(null)} title="Tambah goal" width={520}>
        {form && (
          <>
            <label className="flex flex-col gap-1.5">
              <FLabel>Nama goal</FLabel>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Misal: DP Rumah" style={inputStyle} autoFocus />
            </label>
            <div className="flex flex-col gap-1.5">
              <FLabel>Ikon</FLabel>
              <div role="radiogroup" aria-label="Ikon goal" className="flex flex-wrap gap-2">
                {PRESETS.map(([label, icon, c], i) => {
                  const on = form.preset === i;
                  const [l, mid, d] = T.pal[c];
                  return (
                    <button
                      key={icon}
                      role="radio"
                      aria-checked={on}
                      aria-label={label}
                      title={label}
                      onClick={() => setForm({ ...form, preset: i })}
                      className="flex size-11 items-center justify-center"
                      style={{
                        borderRadius: 14,
                        background: on ? (T.play ? `linear-gradient(155deg, ${l}, ${mid})` : l + "38") : T.subtle,
                        color: on ? (T.play ? "#fff" : d) : T.muted,
                        boxShadow: on ? `0 0 0 2px ${mid}` : "none",
                      }}
                    >
                      <Icon name={icon} size={22} />
                    </button>
                  );
                })}
              </div>
            </div>
            {moneyField("Target dana", "target", true)}
            <div className="grid grid-cols-2 gap-2.5">
              {moneyField("Sudah terkumpul", "saved")}
              {moneyField("Setoran sekali tap", "step")}
            </div>
            <label className="flex flex-col gap-1.5">
              <FLabel>Target tercapai</FLabel>
              <input type="month" value={form.due} min="2026-10" onChange={(e) => setForm({ ...form, due: e.target.value || "2027-09" })} style={inputStyle} />
            </label>
            <div
              className="grid grid-cols-2 gap-2.5"
              style={{
                background: T.play ? "#fff4d6" : "#fff8e1",
                border: `1px solid ${T.play ? "#ffe08a" : "#ffe7a3"}`,
                borderRadius: 14,
                padding: "12px 14px",
              }}
            >
              {[
                ["Kurang", fTarget ? s(fTarget - fSaved) : "—"],
                ["Nabung per bulan", fTarget ? s((fTarget - fSaved) / monthsTo(fDue)) : "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, fontWeight: w2, color: T.play ? "#8a6a00" : "#6b5b24" }}>{label}</div>
                  <div style={{ fontWeight: T.bold, fontSize: 14 }}>{value}</div>
                </div>
              ))}
            </div>
            <button
              onClick={save}
              disabled={!fOk}
              style={{
                height: 52,
                borderRadius: 14,
                fontFamily: T.body,
                fontWeight: T.bold,
                fontSize: 15,
                cursor: fOk ? "pointer" : "default",
                background: fOk ? T.ink : T.play ? "#f1ecf7" : "#e6e8ec",
                color: fOk ? "#fff" : T.faint,
              }}
            >
              Simpan goal
            </button>
          </>
        )}
      </FModal>
    </>
  );
}
