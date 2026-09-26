"use client";

// Panel Bintang & galaksi (PRD §4E; katalog: milky-way, system-galaxy): definisi Bima Sakti, hierarki
// Tata surya → Bintang → Galaksi → Alam semesta, fakta bersumber, dan keterangan ilustrasi.

import { useEffect } from "react";
import { Icon } from "@/components/ui";
import { OBJ } from "@/lib/angkasa/manifest";
import { markDone } from "@/lib/angkasa/progress";
import { useAngkasa } from "@/lib/angkasa/state";
import { Btn, FactRow, Note, Pill, SourceList, useSpeak } from "../ui";

/** Hierarki (bahasa sendiri, merujuk NASA "Solar System, Galaxy, Universe: What's the Difference?"). */
const HIERARCHY = [
  {
    icon: "public",
    title: "Tata surya",
    text: "Matahari beserta semua yang mengelilinginya: delapan planet, satelit, planet katai, asteroid, dan komet.",
  },
  {
    icon: "wb_sunny",
    title: "Bintang (Matahari)",
    text: "Matahari adalah sebuah bintang — bola gas panas yang bersinar sendiri. Bintang lain di langit malam juga seperti matahari, hanya letaknya sangat jauh.",
  },
  {
    icon: "blur_on",
    title: "Galaksi (Bima Sakti)",
    text: "Kumpulan sangat besar bintang, gas, dan debu yang terikat gravitasi. Matahari hanyalah satu dari miliaran bintang di Bima Sakti.",
  },
  {
    icon: "all_inclusive",
    title: "Alam semesta",
    text: "Semua ruang, waktu, materi, dan energi — termasuk miliaran galaksi selain Bima Sakti.",
  },
];

export function GalaxyPanel() {
  const st = useAngkasa();
  const o = OBJ.get("milky-way");
  const { speak, speaking, supported } = useSpeak();

  // Materi dianggap selesai setelah dibaca aktif ±8 detik.
  useEffect(() => {
    const t = setTimeout(() => markDone(st.memberId, "galaksi"), 8000);
    return () => clearTimeout(t);
  }, [st.memberId]);

  if (!o) return null;
  const speakText = `${o.nameId}. ${o.definitionSimple} ${o.explanationDetailed} ${HIERARCHY.map((h) => `${h.title}: ${h.text}`).join(" ")}`;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em] text-ink">
            {o.nameId}
          </h2>
          <Pill tone="gray">{o.classification}</Pill>
        </div>
        <p className="mt-1 text-[15px] text-ink-2">{o.subtitle}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">
          {o.definitionSimple}
        </p>
      </div>

      <Note icon="photo_camera">
        <b>Ilustrasi</b> — kita belum pernah memotret Bima Sakti dari luar.
        Titik-titik di layar bukan bintang nyata; bentuknya digambar dari
        pengetahuan ilmuwan tentang galaksi spiral berbatang.
      </Note>

      <div>
        <h3 className="mb-2 text-sm font-bold text-ink-2">
          Dari tata surya sampai alam semesta
        </h3>
        <ol className="flex flex-col">
          {HIERARCHY.map((h, i) => (
            <li key={h.title} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F1EAFF] text-[#7541D8]">
                  <Icon name={h.icon} size={20} />
                </span>
                {i < HIERARCHY.length - 1 && (
                  <span
                    className="my-1 w-px flex-1 bg-line"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="pb-3">
                <div className="text-sm font-bold text-ink">
                  {i + 1}. {h.title}
                </div>
                <p className="text-sm leading-relaxed text-ink-2">{h.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        {o.keyFacts.map((f) => (
          <FactRow key={f.label} f={f} />
        ))}
      </div>

      <Note icon="location_on">
        Penanda coral menunjukkan <b>perkiraan</b> lokasi tata surya di salah
        satu lengan, jauh dari pusat. Matahari bukan pusat galaksi.
      </Note>

      <div className="grid grid-cols-2 gap-2">
        <Btn
          variant="primary"
          icon="arrow_back"
          className="col-span-2"
          onClick={() => st.select(null, { mode: "tata-surya" })}
        >
          Kembali ke tata surya
        </Btn>
        {supported && (
          <Btn
            icon={speaking ? "stop_circle" : "volume_up"}
            onClick={() => speak(speakText)}
            pressed={speaking}
            className="col-span-2"
          >
            {speaking ? "Berhenti" : "Dengarkan"}
          </Btn>
        )}
      </div>

      <details className="rounded-xl border border-line px-3 py-2">
        <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink-2">
          Penjelasan lengkap <Icon name="expand_more" size={20} />
        </summary>
        <p className="pb-1 text-sm leading-relaxed text-ink">
          {o.explanationDetailed}
        </p>
        <p className="pb-1 text-xs leading-relaxed text-ink-3">
          {o.texture.representation}. {o.texture.credit}.
        </p>
      </details>
      <SourceList ids={o.sourceIds} />
    </div>
  );
}
