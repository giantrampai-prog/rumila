"use client";

import { useMemo, useState } from "react";
import { Avatar, Card, Segmented, Tile } from "@/components/ui";
import { CAT, canonicalToolId, getTool, type ColorKey } from "@/lib/catalog";
import { can, useMe, useRumila } from "@/lib/store";

type Range = "week" | "month";

// Angka KPI & grafik masih demo (sesuai prototype). Nanti dihitung dari activity_log + transactions.
const KPIS: { icon: string; c: ColorKey; label: string; week: string; month: string; delta: string }[] = [
  { icon: "schedule", c: "teal", label: "Waktu belajar", week: "5 j 45 m", month: "19 j 35 m", delta: "▲ 18% dari sebelumnya" },
  { icon: "timer", c: "orange", label: "Waktu layar anak", week: "1 j 32 m/hari", month: "1 j 41 m/hari", delta: "Di bawah batas 2 jam" },
  { icon: "record_voice_over", c: "green", label: "Hafalan", week: "+2 surat", month: "+7 surat", delta: "Kak Raka & Dek Nara" },
  { icon: "account_balance_wallet", c: "gold", label: "Pengeluaran", week: "Rp 2,4 jt", month: "Rp 13,0 jt", delta: "▼ 6% lebih hemat" },
];

const STUDY = {
  week: [
    ["Sen", 35],
    ["Sel", 50],
    ["Rab", 20],
    ["Kam", 65],
    ["Jum", 40],
    ["Sab", 80],
    ["Min", 55],
  ] as [string, number][],
  month: [
    ["M1", 240],
    ["M2", 310],
    ["M3", 280],
    ["M4", 345],
  ] as [string, number][],
};

const KID_NOTES: Record<string, { meta: string; skills: [string, number, ColorKey][] }> = {
  m3: {
    meta: "Paling aktif di Coding",
    skills: [
      ["Coding", 72, "indigo"],
      ["Hafalan Juz 30", 58, "green"],
      ["Matematika", 45, "red"],
    ],
  },
  m4: {
    meta: "Mulai rajin membaca",
    skills: [
      ["Belajar Membaca", 64, "red"],
      ["Doa Harian", 80, "teal"],
      ["Dunia Hewan", 35, "orange"],
    ],
  },
};

export default function Laporan() {
  const me = useMe();
  const members = useRumila((s) => s.members);
  const activity = useRumila((s) => s.activity);
  const [range, setRange] = useState<Range>("week");
  const wk = range === "week";
  const study = STUDY[range];
  const sMax = Math.max(...study.map((s) => s[1]));

  // Anak = User tanpa akses Finance (preset anak).
  const kids = members.filter((m) => !m.admin && !can(m, "finance"));

  const top = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of activity) {
      if (a.event && a.event !== "session") continue;
      const id = canonicalToolId(a.toolId);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return [...counts]
      .map(([id, n]) => ({ t: getTool(id)!, n: n * (wk ? 1 : 4) }))
      .filter((x) => x.t && can(me, x.t.folder))
      .sort((a, b) => b.n - a.n)
      .slice(0, 5);
  }, [activity, me, wk]);

  return (
    <>
      <div className="flex items-end justify-between gap-2.5">
        <div>
          <h1 className="text-[26px] leading-[1.1] font-extrabold tracking-[-0.03em] desk:text-[30px]">Laporan</h1>
          <p className="text-[13px] text-ink-3">Aktivitas keluarga {wk ? "minggu" : "bulan"} ini</p>
        </div>
        <Segmented
          value={range}
          onChange={setRange}
          options={[
            ["week", "Minggu"],
            ["month", "Bulan"],
          ]}
        />
      </div>

      <Card radius={20} className="p-5">
        <h2 className="text-base font-extrabold">Jelajah Tubuh 3D</h2>
        <p className="mt-1 text-xs text-ink-2">Aktivitas belajar yang tercatat · {wk ? "7" : "30"} hari terakhir</p>
        <div className="mt-4 grid gap-3 desk:grid-cols-3">
          {members.filter(m => can(m, "edukasi")).map(member => {
            const logs = activity.filter(a => a.memberId === member.id && a.toolId === "edukasi6" && a.at >= Date.now() - (wk ? 7 : 30) * 86400000);
            const done = new Set(logs.filter(a => a.event === "material_complete").map(a => a.partId)).size;
            const exercises = new Set(logs.filter(a => a.event === "exercise_complete").map(a => a.partId)).size;
            const seconds = logs.reduce((n,a) => n + a.durationSec, 0);
            return <div key={member.id} className="flex items-center gap-3 rounded-xl bg-page p-3"><Avatar c={member.c} name={member.name} size={32}/><div><strong className="text-sm">{member.name}</strong><p className="text-xs text-ink-2">{done} materi · {exercises} latihan · {Math.floor(seconds/60)} menit aktif</p></div></div>;
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 desk:grid-cols-4 desk:gap-4">
        {KPIS.map((k) => (
          <Card key={k.label} radius={20} className="flex flex-col gap-1.5 p-4">
            <Tile c={k.c} icon={k.icon} size={34} radius={0.32} />
            <div className="text-xs font-semibold text-ink-3">{k.label}</div>
            <div className="text-[22px] leading-none font-extrabold tracking-[-0.02em]">{wk ? k.week : k.month}</div>
            <div className="text-[11px] font-semibold" style={{ color: CAT[k.c][2] }}>
              {k.delta}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-5 desk:grid desk:grid-cols-2 desk:items-start desk:gap-5">
        <Card radius={24} className="flex flex-col gap-3.5 p-[18px] desk:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-extrabold">Waktu belajar per {wk ? "hari" : "minggu"}</h2>
            <span className="text-xs text-ink-3">menit</span>
          </div>
          <div
            className="grid h-[130px] items-end gap-2 desk:h-[200px]"
            style={{ gridTemplateColumns: `repeat(${study.length}, minmax(0,1fr))` }}
          >
            {study.map(([d, v], i) => {
              const last = i === study.length - 1;
              return (
                <div key={range + d} className="flex h-full flex-col items-center justify-end gap-1.5">
                  <span className="text-[10px] font-bold text-ink-3">{v}</span>
                  <div
                    className="anim-bar w-full max-w-7 rounded-t-lg rounded-b"
                    style={{
                      height: `${(v / sMax) * 80}%`,
                      minHeight: 4,
                      background: last ? "#52B8A8" : "#DDF3EF",
                      animationDelay: `${i * 40}ms`,
                    }}
                  />
                  <span className={`text-[11px] font-bold ${last ? "text-ink" : "text-ink-4"}`}>{d}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {kids.length > 0 && (
          <Card radius={24} className="flex flex-col gap-3.5 p-[18px] desk:order-last desk:col-span-2 desk:p-6">
            <h2 className="text-base font-extrabold">Progres anak</h2>
            <div className="flex flex-col gap-3.5 desk:grid desk:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] desk:gap-6">
              {kids.map((k) => {
                const note = KID_NOTES[k.id];
                return (
                  <div
                    key={k.id}
                    className="flex flex-col gap-2.5 border-b border-line-soft pb-3 last:border-b-0 last:pb-0 desk:border-b-0 desk:pb-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar c={k.c} name={k.name} size={36} />
                      <div className="flex-1">
                        <div className="text-[15px] font-bold">{k.name}</div>
                        <div className="text-xs text-ink-3">{note?.meta ?? "Belum ada catatan minggu ini"}</div>
                      </div>
                    </div>
                    {note?.skills.map(([name, pct, c]) => (
                      <div key={name} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{name}</span>
                          <span className="text-ink-3">{pct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-fill">
                          <div className="anim-bar-x h-full rounded-full" style={{ width: `${pct}%`, background: CAT[c][1] }} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {top.length > 0 && (
          <Card radius={24} className="flex flex-col gap-3 p-[18px] desk:p-6">
            <h2 className="text-base font-extrabold">Paling sering dipakai</h2>
            {top.map(({ t, n }, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <Tile c={t.c} icon={t.icon} size={36} />
                <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                  <div className="flex justify-between text-[13px] font-bold">
                    <span className="truncate">{t.name}</span>
                    <span className="font-semibold text-ink-3">{n}×</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-fill">
                    <div
                      className="anim-bar-x h-full rounded-full"
                      style={{ width: `${(n / top[0].n) * 100}%`, background: CAT[t.c][1], animationDelay: `${i * 50}ms` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </>
  );
}
