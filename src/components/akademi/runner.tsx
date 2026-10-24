"use client";

// Runner aktivitas Academy: paket → ronde demi ronde → presenter mekanik → nilai → catat bukti → layar selesai.
// Knob naik satu step setelah 2 benar beruntun, turun satu step setelah 2 salah beruntun (adaptif sederhana).

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ContentPack } from "@akademi/schema";
import { buatRonde, buatRondeBaru, knobDefaults, kunciRonde, nilai, type Hasil, type Jawaban, type Knobs, type Ronde } from "@akademi/mechanics";
import { Icon } from "@/components/ui";
import { catatEvent } from "@/lib/akademi/jejak";
import { kompetensiUntuk, paketById, useBahasaAnak, type BahasaAnak } from "@/lib/akademi/konten";
import { diamkan, ucapkan } from "@/lib/akademi/suara";
import { sfx } from "@/lib/sfx";
import { useMe } from "@/lib/store";
import { completeTool, useToolSession } from "@/lib/tool-session";
import { uuid } from "@/lib/uuid";
import { PresenterDagang } from "./dagang";
import { LayarAktivitas, UmpanBalik } from "./dunia";
import { BALOO, INK } from "./jenis";
import { PresenterNavigasi } from "./navigasi";
import { PresenterPilah } from "./pilah";
import { PresenterPola } from "./pola";
import { PresenterSimulasi } from "./simulasi";
import { PresenterUrutkan } from "./urutkan";
import "./akademi.css";

const JEDA_UMPAN_BALIK = 1400;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function geserKnob(p: ContentPack, k: Knobs, arah: 1 | -1): Knobs {
  const out: Knobs = { ...k };
  for (const [nama, def] of Object.entries(p.knobs)) {
    const v = (k[nama] ?? def.default) + arah * (def.step ?? 1);
    out[nama] = Math.min(def.max, Math.max(def.min, v));
  }
  return out;
}

export function ActivityRunner({ paketId }: { paketId: string }) {
  const paket = useMemo(() => paketById(paketId), [paketId]);
  // Ronde bergantung seed sesi (acak di klien) → render hanya di klien agar tidak terjadi hydration mismatch.
  const [siap, setSiap] = useState(false);
  useEffect(() => setSiap(true), []);
  if (!siap) return null;
  if (!paket) return <TidakAda />;
  return <Runner paket={paket} />;
}

function TidakAda() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6 text-center" style={{ fontFamily: BALOO, color: INK }}>
      <div>
        <div style={{ fontSize: 56 }}>🧭</div>
        <p className="text-xl font-extrabold">Aktivitas ini belum ada.</p>
      </div>
    </div>
  );
}

function Runner({ paket }: { paket: ContentPack }) {
  const me = useMe();
  const learnerId = me?.id ?? "dev";
  const router = useRouter();
  useToolSession(learnerId, `akademi-${paket.mechanic}`, "edukasi");
  const bahasa = useBahasaAnak(learnerId);
  const lang = bahasa === "en" ? "en-US" : "id-ID";
  const t = useCallback((k: string) => paket.locale[bahasa][k] ?? paket.locale.id[k] ?? paket.locale.en[k] ?? k, [paket, bahasa]);
  const kompetensiIds = useMemo(() => kompetensiUntuk(paket.id).map((c) => c.id), [paket.id]);

  const sessionId = useRef(uuid());
  const [knobs, setKnobs] = useState<Knobs>(() => knobDefaults(paket));
  const [idx, setIdx] = useState(0);
  const [ronde, setRonde] = useState<Ronde>(() => buatRonde(paket, knobDefaults(paket), hash(`${learnerId}|${paket.id}|0|${sessionId.current}`)));
  /** kunci ronde yang sudah keluar di sesi ini, agar soal tidak berulang */
  const riwayat = useRef<string[]>([]);
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [hint, setHint] = useState(false);
  const [skor, setSkor] = useState({ benar: 0, salah: 0, hint: 0 });
  const [beruntun, setBeruntun] = useState({ benar: 0, salah: 0 });
  const [selesai, setSelesai] = useState(false);
  const mulai = useRef(Date.now());
  const mulaiRonde = useRef(Date.now());
  const total = paket.rounds;

  const ucap = useCallback(() => ucapkan(t(paket.instructionKey), lang), [paket.instructionKey, t, lang]);

  const sudahMulai = useRef(false);
  useEffect(() => {
    if (!sudahMulai.current) {
      sudahMulai.current = true; // StrictMode menjalankan efek dua kali di dev; event mulai cukup sekali
      catatEvent({ learnerId, sessionId: sessionId.current, activityId: paket.id, mechanic: paket.mechanic, type: "activity_start", payload: { level: paket.level } });
    }
    const timer = setTimeout(ucap, 400);
    return () => {
      clearTimeout(timer);
      diamkan();
    };
    // sekali per aktivitas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHint = () => {
    setHint(true);
    setSkor((s) => ({ ...s, hint: s.hint + 1 }));
    sfx.pick();
    catatEvent({ learnerId, sessionId: sessionId.current, activityId: paket.id, mechanic: paket.mechanic, type: "hint", payload: { ronde: idx } });
  };

  const onJawab = (j: Jawaban) => {
    if (hasil) return;
    const h = nilai(paket, ronde, j);
    const latencyMs = Date.now() - mulaiRonde.current;
    setHasil(h);
    if (h.benar) sfx.celebrate();
    else sfx.thud();
    catatEvent({
      learnerId, sessionId: sessionId.current, activityId: paket.id, mechanic: paket.mechanic, type: "attempt",
      payload: { itemId: `${paket.id}#${idx}`, correct: h.benar, hintUsed: hint, latencyMs, knobs, competencyIds: kompetensiIds, detail: { mode: (paket as { mode?: string }).mode ?? (paket as { execMode?: string }).execMode, ...h.detail } },
    });
    const skorBaru = { ...skor, benar: skor.benar + (h.benar ? 1 : 0), salah: skor.salah + (h.benar ? 0 : 1) };
    setSkor(skorBaru);
    const b = h.benar ? { benar: beruntun.benar + 1, salah: 0 } : { benar: 0, salah: beruntun.salah + 1 };
    let k = knobs;
    if (b.benar >= 2) { k = geserKnob(paket, knobs, 1); b.benar = 0; }
    if (b.salah >= 2) { k = geserKnob(paket, knobs, -1); b.salah = 0; }
    setBeruntun(b);
    setKnobs(k);
    setTimeout(() => {
      const next = idx + 1;
      if (next >= total) {
        catatEvent({
          learnerId, sessionId: sessionId.current, activityId: paket.id, mechanic: paket.mechanic, type: "activity_end",
          payload: { outcome: "selesai", successCount: skorBaru.benar, failCount: skorBaru.salah, hintCount: skorBaru.hint, durationMs: Date.now() - mulai.current },
        });
        if (skorBaru.benar >= Math.ceil(total * 0.6)) completeTool(learnerId, `akademi-${paket.mechanic}`, "edukasi", paket.id);
        setSelesai(true);
        return;
      }
      setIdx(next);
      setHasil(null);
      setHint(false);
      mulaiRonde.current = Date.now();
      riwayat.current.push(kunciRonde(ronde));
      setRonde(buatRondeBaru(paket, k, hash(`${learnerId}|${paket.id}|${next}|${sessionId.current}`), riwayat.current));
    }, JEDA_UMPAN_BALIK);
  };

  if (selesai) return <LayarSelesai paket={paket} bahasa={bahasa} skor={skor} onLagi={() => router.replace(`/akademi/main/${paket.id}?u=${Date.now()}`)} onKembali={() => router.push("/akademi")} />;

  const props = { paket, ronde, t, onJawab, onHint, hasil } as const;
  return (
    <LayarAktivitas judul={judulPaket(paket, bahasa)} ronde={idx + 1} total={total} instruksi={t(paket.instructionKey)} onUcap={ucap}>
      <div key={idx} className="akademi-fade">
        {paket.mechanic === "pilah" && ronde.mechanic === "pilah" && <PresenterPilah {...props} paket={paket} ronde={ronde.ronde} />}
        {paket.mechanic === "urutkan" && ronde.mechanic === "urutkan" && <PresenterUrutkan {...props} paket={paket} ronde={ronde.ronde} />}
        {paket.mechanic === "dagang" && ronde.mechanic === "dagang" && <PresenterDagang {...props} paket={paket} ronde={ronde.ronde} />}
        {paket.mechanic === "navigasi" && ronde.mechanic === "navigasi" && <PresenterNavigasi {...props} paket={paket} ronde={ronde.ronde} />}
        {paket.mechanic === "pola" && ronde.mechanic === "pola" && <PresenterPola {...props} paket={paket} ronde={ronde.ronde} />}
        {paket.mechanic === "simulasi" && ronde.mechanic === "simulasi" && <PresenterSimulasi {...props} paket={paket} ronde={ronde.ronde} />}
      </div>
      {hasil && <UmpanBalik benar={hasil.benar} />}
    </LayarAktivitas>
  );
}

/** Judul aktivitas: locale[bahasa].judul (default id, cadangan id); cadangan terakhir dari id paket (slug → Kata Kapital) */
export function judulPaket(p: ContentPack, bahasa: BahasaAnak = "id") {
  const judul = p.locale[bahasa]?.judul ?? p.locale.id.judul;
  if (judul) return judul;
  return p.id.split("-").map((s) => (/^\d/.test(s) ? s : s.charAt(0).toUpperCase() + s.slice(1))).join(" ");
}

function LayarSelesai({ paket, bahasa, skor, onLagi, onKembali }: { paket: ContentPack; bahasa: BahasaAnak; skor: { benar: number; salah: number; hint: number }; onLagi: () => void; onKembali: () => void }) {
  const total = skor.benar + skor.salah;
  const bintang = skor.benar >= total ? 3 : skor.benar >= Math.ceil(total * 0.6) ? 2 : skor.benar > 0 ? 1 : 0;
  useEffect(() => {
    if (bintang >= 2) sfx.celebrate();
    ucapkan(bintang >= 2 ? "Hebat! Kamu dapat stiker baru." : "Bagus, kamu sudah mencoba. Ayo main lagi.");
  }, [bintang]);
  return (
    <div className="flex min-h-dvh items-center justify-center p-5" style={{ background: "linear-gradient(180deg,#bfe9ff,#d8f3c4)", fontFamily: BALOO, color: INK }}>
      <div className="akademi-pop w-full max-w-[380px] rounded-[28px] bg-white p-6 text-center shadow-[0_8px_0_rgba(11,37,69,.12)]">
        <div className="flex justify-center gap-1">
          {[1, 2, 3].map((k) => (
            <Icon key={k} name="star" size={54} className={bintang >= k ? "text-[#f2b705]" : "text-[#e2dccd]"} />
          ))}
        </div>
        <div style={{ fontSize: 72, lineHeight: 1 }} className="my-2">{bintang >= 2 ? "🏅" : "🌱"}</div>
        <div style={{ fontSize: 26, fontWeight: 900 }}>{bintang >= 2 ? "Stiker baru!" : "Bagus, sudah mencoba"}</div>
        <p className="mt-1 text-[15px] font-bold opacity-75">
          {skor.benar} dari {total} benar · {judulPaket(paket, bahasa)}
        </p>
        <div className="mt-5 flex gap-2">
          <button onClick={onLagi} className="flex-1 rounded-[16px] bg-[#efe7d6] py-3 text-[16px] font-extrabold active:translate-y-0.5">Main lagi</button>
          <button onClick={onKembali} className="flex-1 rounded-[16px] bg-[#22b573] py-3 text-[16px] font-extrabold text-white shadow-[0_4px_0_#16804f] active:translate-y-0.5">Selesai</button>
        </div>
      </div>
    </div>
  );
}
