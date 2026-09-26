"use client";

// Panel Fenomena: pilih pelajaran → konsep → salah paham yang dicegah → kontrol terbatas pada konsep →
// penjelasan yang mengikuti keadaan terhitung (lessonPose, sumber yang sama dengan scene) → Reset/Dengarkan → sumber.
// Progres ditandai hanya setelah anak benar-benar menjelajah (bukan saat panel dibuka).

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import {
  ECLIPSE_PRESETS,
  ECLIPSE_TEXT,
  JAKARTA,
  fmtHour,
  lessonPose,
  lessonScaleNote,
  partOfDay,
  type EclipsePreset,
  type LessonPose,
  type LessonTime,
} from "@/lib/angkasa/lessons";
import { MANIFEST } from "@/lib/angkasa/manifest";
import { markDone, useDoneItems } from "@/lib/angkasa/progress";
import {
  useAngkasa,
  type AngkasaState,
  type LessonId,
} from "@/lib/angkasa/state";
import { LessonView } from "../engine/lessonView";
import { Btn, Note, Pill, Slider, SourceList, Tabs, useSpeak } from "../ui";
import { getEngine } from "../viewer";

const ZERO: LessonTime = { orbitSec: 0, spinSec: 0 };
const pct = (k: number) => `${Math.round(k * 100)}%`;
const deg1 = (d: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(d);

/** Waktu lokal pelajaran dibaca dari view aktif (±5×/detik) agar teks mengikuti simulasi yang berjalan. */
function useLessonTime(onSample: (s: AngkasaState, pose: LessonPose) => void) {
  const [time, setTime] = useState<LessonTime>(ZERO);
  const cb = useRef(onSample);
  useEffect(() => {
    cb.current = onSample;
  });
  useEffect(() => {
    const id = setInterval(() => {
      const s = useAngkasa.getState();
      const v = getEngine()?.getView();
      const t =
        v instanceof LessonView && v.lesson() === s.lesson ? v.time() : ZERO;
      setTime((p) =>
        p.orbitSec === t.orbitSec && p.spinSec === t.spinSec ? p : t,
      );
      cb.current(s, lessonPose(s.lesson, s.lessonState, t));
    }, 200);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function LessonPanel() {
  const st = useAngkasa();
  const lesson =
    MANIFEST.lessons.find((l) => l.id === st.lesson) ?? MANIFEST.lessons[0];
  const ls = st.lessonState;
  const { speak, speaking, supported } = useSpeak();
  const done = useDoneItems(st.memberId);

  // Jejak eksplorasi per pelajaran (direset saat pelajaran berganti).
  const seen = useRef({ lesson: "" as string, marks: new Set<string>() });
  const markSeen = (id: string) => seen.current.marks.add(id);
  const time = useLessonTime((s, pose) => {
    const tr = seen.current;
    if (tr.lesson !== s.lesson) {
      tr.lesson = s.lesson;
      tr.marks = new Set();
    }
    const m = tr.marks;
    let explored = false;
    switch (pose.lesson) {
      case "rotation-revolution":
        if (pose.rr.days > 0) m.add("orbit-moved");
        if (pose.rr.turns > 0) m.add("spin-moved");
        explored =
          m.has("toggled") && m.has("orbit-moved") && m.has("spin-moved");
        break;
      case "day-night":
        m.add(pose.marker.isDay ? "day" : "night");
        explored = m.has("day") && m.has("night");
        break;
      case "moon-phases":
        m.add(`phase:${pose.phase.name}`);
        explored = [...m].filter((x) => x.startsWith("phase:")).length >= 4;
        break;
      case "eclipses":
        if (pose.scene.kind !== "tidak")
          m.add(`preset:${s.lessonState.eclipsePreset}`);
        explored = m.has("preset:matahari") && m.has("preset:bulan");
        break;
      case "seasons":
        if (pose.season.subsolarLatDeg > 20) m.add("june");
        if (pose.season.subsolarLatDeg < -20) m.add("december");
        explored = m.has("june") && m.has("december");
        break;
    }
    if (explored && !m.has("done") && s.memberId) {
      m.add("done");
      markDone(s.memberId, `lesson:${s.lesson}`);
    }
  });

  const pose = lessonPose(st.lesson, ls, time);
  const live = liveText(pose);
  const isDone = done.includes(`lesson:${lesson.id}`);
  const pause = () => st.set({ playing: false });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="coral">Simulasi belajar</Pill>
          {isDone && (
            <Pill tone="teal">
              <Icon name="check" size={14} /> Sudah dijelajahi
            </Pill>
          )}
        </div>
        <h2 className="mt-2 text-[26px] leading-tight font-extrabold tracking-[-0.02em] text-ink">
          {lesson.title}
        </h2>
      </div>

      <div
        role="list"
        aria-label="Pilih pelajaran"
        className="grid grid-cols-2 gap-1.5"
      >
        {MANIFEST.lessons.map((l) => {
          const on = l.id === st.lesson;
          return (
            <button
              key={l.id}
              role="listitem"
              aria-current={on}
              onClick={() => st.setLesson(l.id as LessonId)}
              className={`min-h-11 rounded-xl px-3 text-left text-sm font-semibold transition-colors ${on ? "bg-ink text-white" : "bg-fill text-ink-2 hover:text-ink"}`}
            >
              {l.title}
            </button>
          );
        })}
      </div>

      <p className="text-[15px] leading-relaxed text-ink">{lesson.concept}</p>

      <div className="rounded-2xl border border-coral/40 bg-coral-tint/40 p-3">
        <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-coral-deep uppercase">
          <Icon name="lightbulb" size={16} /> Hati-hati salah paham
        </div>
        <p className="mt-1 text-sm text-ink">{lesson.misconception}</p>
      </div>

      {/* Kontrol khusus pelajaran */}
      <div className="flex flex-col gap-3">
        <Controls
          pose={pose}
          onToggle={() => markSeen("toggled")}
          pause={pause}
        />
        <div className="grid grid-cols-2 gap-2">
          <Btn
            variant="dark"
            icon={st.playing ? "pause" : "play_arrow"}
            pressed={st.playing}
            onClick={() => st.set({ playing: !st.playing })}
          >
            {st.playing ? "Jeda" : "Jalankan"}
          </Btn>
          <Btn icon="restart_alt" onClick={() => st.resetLesson()}>
            Reset
          </Btn>
        </div>
      </div>

      {/* Penjelasan mengikuti keadaan yang dihitung */}
      <div
        aria-live="polite"
        className="rounded-2xl border border-teal/40 bg-[#F1EAFF]/50 p-3"
      >
        <div className="text-xs font-bold tracking-wide text-[#7541D8] uppercase">
          Yang terjadi sekarang
        </div>
        <p className="mt-1 text-base font-bold text-ink">{live.headline}</p>
        {live.lines.map((l) => (
          <p key={l} className="mt-1 text-sm leading-relaxed text-ink-2">
            {l}
          </p>
        ))}
      </div>

      {extraNotes(pose).map(([icon, text]) => (
        <Note key={text} icon={icon}>
          {text}
        </Note>
      ))}

      {supported && (
        <Btn
          icon={speaking ? "stop_circle" : "volume_up"}
          pressed={speaking}
          onClick={() =>
            speak(
              `${lesson.title}. ${lesson.concept} ${live.headline}. ${live.lines.join(" ")} ${lesson.misconception}`,
            )
          }
        >
          {speaking ? "Berhenti" : "Dengarkan"}
        </Btn>
      )}

      <Note icon="straighten">
        {lessonScaleNote(lesson.id)}. Posisi awal bersifat ilustrasi, bukan
        posisi langit saat ini.
      </Note>
      <SourceList ids={lesson.sourceIds} />
    </div>
  );
}

/* ---------------- kontrol ---------------- */

function Controls({
  pose,
  onToggle,
  pause,
}: {
  pose: LessonPose;
  onToggle: () => void;
  pause: () => void;
}) {
  const st = useAngkasa();
  const ls = st.lessonState;
  const patch = st.patchLesson;

  switch (pose.lesson) {
    case "rotation-revolution":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Btn
            icon="motion_photos_on"
            pressed={ls.orbitOn}
            variant={ls.orbitOn ? "dark" : "outline"}
            onClick={() => {
              onToggle();
              patch({ orbitOn: !ls.orbitOn });
            }}
          >
            Revolusi {ls.orbitOn ? "hidup" : "mati"}
          </Btn>
          <Btn
            icon="360"
            pressed={ls.spinOn}
            variant={ls.spinOn ? "dark" : "outline"}
            onClick={() => {
              onToggle();
              patch({ spinOn: !ls.spinOn });
            }}
          >
            Rotasi {ls.spinOn ? "hidup" : "mati"}
          </Btn>
        </div>
      );
    case "day-night":
      return st.playing ? (
        <Note icon="pause_circle">
          Jeda simulasi untuk memutar Bumi sendiri dengan slider.
        </Note>
      ) : (
        <Slider
          label="Putar Bumi"
          value={pose.spinDeg}
          min={0}
          max={359}
          onChange={(v) => patch({ earthSpin: v })}
          suffix="°"
        />
      );
    case "moon-phases":
      return (
        <>
          <Slider
            label="Posisi Bulan di orbit"
            value={pose.moonAngleDeg}
            min={0}
            max={359}
            onChange={(v) => {
              pause();
              patch({ moonAngle: v });
            }}
            suffix="°"
            marks={[0, 90, 180, 270]}
          />
          <Tabs
            label="Sudut pandang"
            value={ls.phaseView}
            onChange={(v) => patch({ phaseView: v })}
            options={[
              ["angkasa", "Dari angkasa"],
              ["bumi", "Dari Bumi (besar)"],
            ]}
          />
        </>
      );
    case "eclipses":
      return (
        <>
          <div className="grid grid-cols-1 gap-1.5">
            {(Object.keys(ECLIPSE_PRESETS) as EclipsePreset[]).map((p) => (
              <Btn
                key={p}
                variant={ls.eclipsePreset === p ? "dark" : "outline"}
                pressed={ls.eclipsePreset === p}
                icon={
                  p === "matahari"
                    ? "wb_sunny"
                    : p === "bulan"
                      ? "dark_mode"
                      : "block"
                }
                onClick={() => {
                  pause();
                  patch({
                    eclipsePreset: p,
                    moonAngle: ECLIPSE_PRESETS[p].moonAngle,
                  });
                }}
              >
                {ECLIPSE_PRESETS[p].label}
              </Btn>
            ))}
          </div>
          <Slider
            label="Posisi Bulan di orbit"
            value={pose.moonAngleDeg}
            min={0}
            max={359}
            onChange={(v) => {
              pause();
              patch({ moonAngle: v });
            }}
            suffix="°"
            marks={[0, 90, 180, 270]}
          />
        </>
      );
    case "seasons":
      return (
        <>
          <Slider
            label="Posisi Bumi di orbit"
            value={pose.angleDeg}
            min={0}
            max={359}
            onChange={(v) => {
              pause();
              patch({ earthOrbitAngle: v });
            }}
            suffix="°"
            marks={[0, 90, 180, 270]}
          />
          <div className="grid grid-cols-2 gap-2">
            <Btn
              icon="north"
              onClick={() => {
                pause();
                patch({ earthOrbitAngle: 90 });
              }}
            >
              Juni
            </Btn>
            <Btn
              icon="south"
              onClick={() => {
                pause();
                patch({ earthOrbitAngle: 270 });
              }}
            >
              Desember
            </Btn>
          </div>
        </>
      );
  }
}

/* ---------------- teks yang mengikuti keadaan ---------------- */

function liveText(p: LessonPose): { headline: string; lines: string[] } {
  switch (p.lesson) {
    case "rotation-revolution": {
      const moving = [p.orbitOn && "revolusi", p.spinOn && "rotasi"]
        .filter(Boolean)
        .join(" dan ");
      return {
        headline: moving
          ? `Yang bergerak: ${moving}`
          : "Kedua gerak sedang dimatikan",
        lines: [
          `Hari simulasi ke-${Math.floor(p.rr.days)} · Bumi sudah menempuh ${pct(p.rr.orbitFraction)} satu kali revolusi.`,
          `Rotasi: ${deg1(p.rr.turns)} putaran (diperlambat — sebenarnya satu putaran setiap hari).`,
          "Satu revolusi sebenarnya memakan waktu sekitar 365¼ hari. Sumbu Bumi tetap miring ke arah yang sama selama mengorbit.",
        ],
      };
    }
    case "day-night": {
      const d = p.marker;
      return {
        headline: `${JAKARTA.name}: ${partOfDay(d)}`,
        lines: [
          d.isDay
            ? `${JAKARTA.name} sedang berada di separuh Bumi yang menghadap Matahari.`
            : `${JAKARTA.name} sedang berada di separuh Bumi yang membelakangi Matahari.`,
          `Perkiraan jam Matahari setempat: ${fmtHour(d.solarHour)}.`,
          "Putar kamera ke mana saja: sisi terang tetap menghadap Matahari, karena cahayanya datang dari Matahari, bukan dari kamera.",
        ],
      };
    }
    case "moon-phases": {
      const ph = p.phase;
      return {
        headline: `Fase: ${ph.name} · ${pct(ph.fraction)} tampak terang`,
        lines: [
          `Bulan berada ${Math.round(ph.elongationDeg)}° dari arah Matahari, dilihat dari Bumi.`,
          ph.fraction < 0.03
            ? "Sisi Bulan yang terang membelakangi Bumi, jadi hampir tidak ada bagian terang yang terlihat."
            : ph.fraction > 0.97
              ? "Seluruh sisi terang Bulan menghadap Bumi."
              : `Bagian terang yang terlihat sedang ${ph.waxing ? "bertambah (awal)" : "berkurang (akhir)"}.`,
          "Separuh Bulan yang menghadap Matahari selalu terang — lihat bingkai “Dilihat dari Bumi”.",
        ],
      };
    }
    case "eclipses": {
      const lat = p.realMoonLatDeg;
      const lines = [
        Math.abs(lat) < 0.05
          ? "Bulan tepat berada di bidang orbit Bumi (di simpul)."
          : `Bulan berada ${deg1(Math.abs(lat))}° ${lat > 0 ? "di atas" : "di bawah"} bidang orbit Bumi (sudut sebenarnya).`,
      ];
      const sceneYes = p.scene.kind !== "tidak";
      const realYes = p.real.kind !== "tidak";
      if (sceneYes !== realYes)
        lines.push(
          realYes
            ? "Dengan ukuran dan jarak sebenarnya, gerhana juga terjadi."
            : "Di model ini benda dibesarkan dan jarak dirapatkan, jadi bayangan lebih mudah kena. Di alam, Matahari, Bumi, dan Bulan harus segaris lebih tepat (selisih sekitar 1°).",
        );
      else if (realYes)
        lines.push(
          "Dengan ukuran dan jarak sebenarnya, gerhana ini juga terjadi.",
        );
      return { headline: ECLIPSE_TEXT[p.scene.kind], lines };
    }
    case "seasons": {
      const s = p.season;
      const lat = s.subsolarLatDeg;
      return {
        headline: `Sekitar bulan ${s.month} · sinar paling tegak di ${deg1(Math.abs(lat))}° ${lat >= 0 ? "LU" : "LS"}`,
        lines: [
          s.hemisphere === "utara"
            ? "Belahan utara condong ke Matahari: sinarnya lebih tegak dan siangnya lebih panjang — musim panas di utara, musim dingin di selatan."
            : s.hemisphere === "selatan"
              ? "Belahan selatan condong ke Matahari: sinarnya lebih tegak dan siangnya lebih panjang — musim panas di selatan, musim dingin di utara."
              : "Kedua belahan menerima sinar hampir sama banyak (sekitar ekuinoks).",
          "Arah sumbu Bumi tidak berubah; yang berubah adalah posisi Bumi terhadap Matahari.",
        ],
      };
    }
  }
}

function extraNotes(p: LessonPose): [string, string][] {
  switch (p.lesson) {
    case "rotation-revolution":
      return [
        [
          "360",
          "Rotasi = berputar pada sumbu (siang–malam). Revolusi = mengelilingi Matahari (satu tahun). Matikan salah satu untuk mengamati gerak lainnya.",
        ],
      ];
    case "day-night":
      return [
        [
          "place",
          `Titik oranye menandai contoh lokasi: ${JAKARTA.name} (sekitar 6°LS, 107°BT).`,
        ],
      ];
    case "moon-phases":
      return [
        [
          "info",
          "Bentuk terang Bulan dihitung dari arah cahaya Matahari dan arah pandang dari Bumi. Bayangan Bumi tidak dipakai; bayangan Bumi hanya mengenai Bulan saat gerhana Bulan.",
        ],
      ];
    case "eclipses":
      return [
        [
          "info",
          "Orbit Bulan miring sekitar 5° terhadap orbit Bumi. Bulan baru dan purnama terjadi setiap bulan, tetapi gerhana hanya terjadi bila saat itu Bulan dekat simpul (titik potong kedua orbit). Karena itu gerhana tidak terjadi setiap bulan.",
        ],
        [
          "visibility_off",
          "Jangan pernah menatap Matahari langsung, termasuk saat gerhana. Gunakan kacamata gerhana khusus atau proyeksi lubang jarum.",
        ],
      ];
    case "seasons":
      return [
        [
          "info",
          "Musim bukan karena jarak. Orbit Bumi hampir bulat; Bumi justru paling dekat ke Matahari sekitar awal Januari, saat belahan utara mengalami musim dingin.",
        ],
        [
          "public",
          "Indonesia dekat khatulistiwa, jadi sinar Matahari cukup tegak sepanjang tahun dan tidak ada empat musim. Yang kita alami adalah musim hujan dan musim kemarau, yang dipengaruhi angin muson.",
        ],
      ];
  }
}
