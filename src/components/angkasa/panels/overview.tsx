"use client";

// Panel ringkasan Tata Surya + panel Cek pemahaman (latihan tanpa poin/bintang).

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { MANIFEST, OBJ } from "@/lib/angkasa/manifest";
import { markExercise, useDoneItems } from "@/lib/angkasa/progress";
import { lastObjectOf, useAngkasa } from "@/lib/angkasa/state";
import { beginTour } from "../fullscreen";
import { Btn, Note, Pill } from "../ui";

export function OverviewPanel() {
  const st = useAngkasa();
  const done = useDoneItems(st.memberId);
  const [last, setLast] = useState<string | null>(null);
  useEffect(() => setLast(lastObjectOf(st.memberId)), [st.memberId]);
  const planetsDone = done.filter((d) => d.startsWith("obj:")).length;
  const lessonsDone = done.filter((d) => d.startsWith("lesson:")).length;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em] text-ink">
            Tata Surya
          </h2>
          <Pill tone="gray">Tampilan belajar</Pill>
        </div>
        <p className="mt-1 text-[15px] leading-relaxed text-ink">
          Matahari dan semua benda yang mengelilinginya: delapan planet, planet
          katai, satelit, asteroid, dan komet.
        </p>
      </div>
      <Note icon="straighten">
        Ukuran planet dibesarkan dan jaraknya dirapatkan agar semuanya terlihat.
        Posisi planet ilustratif, bukan posisi di langit hari ini. Untuk skala
        sebenarnya, buka <b>Bandingkan</b>.
      </Note>
      <Btn variant="primary" icon="flight_takeoff" onClick={() => beginTour(0)}>
        Mulai tur terbang
      </Btn>
      {last && OBJ.get(last) && (
        <Btn
          variant="outline"
          icon="play_arrow"
          onClick={() => st.select(last, { mode: "planet" })}
        >
          Lanjutkan ke {OBJ.get(last)!.nameId}
        </Btn>
      )}
      <div className="rounded-2xl border border-line p-3">
        <div className="text-xs font-bold tracking-wide text-ink-4 uppercase">
          Coba ini
        </div>
        <ul className="mt-2 space-y-2 text-sm text-ink-2">
          <li className="flex gap-2">
            <Icon name="touch_app" size={18} className="text-teal" /> Ketuk
            planet atau pilih dari daftar untuk mendekat.
          </li>
          <li className="flex gap-2">
            <Icon name="play_circle" size={18} className="text-teal" /> Tekan
            putar untuk melihat planet mengorbit; atur kecepatannya.
          </li>
          <li className="flex gap-2">
            <Icon name="compare_arrows" size={18} className="text-teal" />{" "}
            Bandingkan ukuran dan jarak dengan skala sebenarnya.
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-page p-3">
          <div className="text-xl font-extrabold text-ink">{planetsDone}</div>
          <div className="text-xs text-ink-3">benda langit dipelajari</div>
        </div>
        <div className="rounded-xl bg-page p-3">
          <div className="text-xl font-extrabold text-ink">
            {lessonsDone}/{MANIFEST.lessons.length}
          </div>
          <div className="text-xs text-ink-3">pelajaran fenomena</div>
        </div>
      </div>
      <p className="text-xs text-ink-4">
        Progres tersimpan untuk profil ini saja.
      </p>
    </div>
  );
}

export function QuizPanel() {
  const st = useAngkasa();
  const done = useDoneItems(st.memberId);
  const q = MANIFEST.quiz[st.quizIndex % MANIFEST.quiz.length];
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => setPicked(null), [q.id]);

  // Jawaban objek: pilih dari scene (event angkasa:pick) atau daftar.
  useEffect(() => {
    if (q.kind !== "object") return;
    const h = (e: Event) =>
      setPicked((e as CustomEvent<string>).detail.split(".")[0]);
    window.addEventListener("angkasa:pick", h);
    return () => window.removeEventListener("angkasa:pick", h);
  }, [q]);

  const correct = picked === q.answer;
  useEffect(() => {
    if (picked && correct) markExercise(st.memberId, `quiz:${q.id}`);
  }, [picked, correct, q.id, st.memberId]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-extrabold text-ink">Cek pemahaman</h2>
          <span className="text-xs font-semibold text-ink-3">
            {(st.quizIndex % MANIFEST.quiz.length) + 1} dari{" "}
            {MANIFEST.quiz.length}
          </span>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed font-semibold text-ink">
          {q.prompt}
        </p>
        {q.kind === "object" && (
          <p className="mt-1 text-xs text-ink-3">
            Ketuk bendanya di tata surya atau pilih dari daftar di bawah.
          </p>
        )}
      </div>
      {q.kind === "choice" ? (
        <div className="flex flex-col gap-2">
          {q.options!.map((opt) => {
            const chosen = picked === opt;
            const tone = picked
              ? opt === q.answer
                ? "border-teal bg-[#F1EAFF]"
                : chosen
                  ? "border-coral bg-coral-tint/60"
                  : "border-line"
              : "border-line hover:border-ink-4";
            return (
              <button
                key={opt}
                onClick={() => setPicked(opt)}
                className={`min-h-12 rounded-xl border px-3 text-left text-sm font-semibold text-ink ${tone}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {[
            "mercury",
            "venus",
            "earth",
            "mars",
            "jupiter",
            "saturn",
            "uranus",
            "neptune",
          ].map((id) => (
            <button
              key={id}
              onClick={() => setPicked(id)}
              className={`min-h-11 rounded-xl border text-sm font-semibold ${picked === id ? (correct ? "border-teal bg-[#F1EAFF]" : "border-coral bg-coral-tint/60") : "border-line"}`}
            >
              {OBJ.get(id)!.nameId}
            </button>
          ))}
        </div>
      )}
      {picked && (
        <div
          role="status"
          className={`rounded-xl p-3 text-sm leading-relaxed ${correct ? "bg-[#F1EAFF] text-[#4B2A99]" : "bg-coral-tint/60 text-ink"}`}
        >
          <b>{correct ? "Tepat." : "Belum tepat."}</b>{" "}
          {correct
            ? q.explanation
            : q.kind === "object"
              ? `Itu ${OBJ.get(picked)?.nameId ?? picked}. ${q.explanation}`
              : q.explanation}
        </div>
      )}
      <div className="flex gap-2">
        <Btn
          className="flex-1"
          icon="refresh"
          onClick={() => setPicked(null)}
          disabled={!picked}
        >
          Coba lagi
        </Btn>
        <Btn
          className="flex-1"
          variant="dark"
          icon="arrow_forward"
          onClick={() => st.set({ quizIndex: st.quizIndex + 1 })}
        >
          Soal berikutnya
        </Btn>
      </div>
      {q.lesson && (
        <Btn
          variant="ghost"
          icon="science"
          onClick={() => {
            st.setLesson(q.lesson!);
            st.setMode("fenomena");
          }}
        >
          Pelajari lewat simulasi
        </Btn>
      )}
      <p className="text-xs text-ink-4">
        {done.filter((d) => d.startsWith("quiz:")).length} soal sudah terjawab
        tepat oleh profil ini. Tidak ada poin atau peringkat — yang penting
        paham.
      </p>
    </div>
  );
}
