"use client";

// Tur terbang: teks edukatif di bagian bawah viewer (lower third) + kontrol tur + panel daftar persinggahan.

import { useEffect } from "react";
import { Icon } from "@/components/ui";
import { markDone } from "@/lib/angkasa/progress";
import { useAngkasa } from "@/lib/angkasa/state";
import { TOUR } from "@/lib/angkasa/tour";
import { TOUR_AUDIO } from "@/lib/angkasa/tourVoice";
import { endTour, toggleFull, useIsFull } from "../fullscreen";
import { Btn, Note, Pill } from "../ui";

const LAST = TOUR.length - 1;

/** Narasi suara (opt-in): bacakan kalimat yang sedang tampil. */
function useNarration() {
  const { tourIndex, tourLine, tourNarration, tourPlaying } = useAngkasa();
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (!tourNarration || !tourPlaying) return;
    const stop = TOUR[tourIndex];
    if (!stop || TOUR_AUDIO.length) return; // ada rekaman: suara sintesis tidak dicampur dengan rekaman
    const text = stop.lines[tourLine];
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    u.rate = 1;
    window.speechSynthesis.speak(u);
  }, [tourIndex, tourLine, tourNarration, tourPlaying]);
  useEffect(
    () => () =>
      void (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        window.speechSynthesis.cancel()
      ),
    [],
  );
}

export function TourOverlay() {
  const st = useAngkasa();
  const stop = TOUR[st.tourIndex];
  const line = stop.lines[Math.min(st.tourLine, stop.lines.length - 1)];
  const finished =
    st.tourIndex === LAST &&
    !st.tourPlaying &&
    st.tourLine === stop.lines.length - 1;
  const full = useIsFull();
  useNarration();

  useEffect(() => {
    if (st.tourIndex === LAST) markDone(st.memberId, "tur:tata-surya");
  }, [st.tourIndex, st.memberId]);

  const go = (i: number) =>
    st.set({
      tourIndex: Math.max(0, Math.min(LAST, i)),
      tourLine: 0,
      tourPlaying: true,
    });
  const speechOk = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <>
      {/* atas: rute persinggahan + layar penuh + keluar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 md:p-5">
        <div className="ak-float pointer-events-auto flex min-w-0 items-center gap-2 px-3 py-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A76AF4] to-[#7541D8] text-white">
            <Icon name="flight" size={18} />
          </span>
          <span className="text-sm font-extrabold whitespace-nowrap text-ink">
            Tur terbang
          </span>
          <ol
            className="ml-1 hidden items-center gap-1 md:flex"
            aria-label="Rute tur"
          >
            {TOUR.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => go(i)}
                  aria-label={s.title}
                  title={s.title}
                  aria-current={i === st.tourIndex ? "step" : undefined}
                  className={`block h-3 rounded-full transition-all ${
                    i === st.tourIndex
                      ? "w-8 bg-[#FF7A1A]"
                      : i < st.tourIndex
                        ? "w-3 bg-[#8B45F5]"
                        : "w-3 bg-[#E7DDF7] hover:bg-[#cdb8f3]"
                  }`}
                />
              </li>
            ))}
          </ol>
          <span className="text-xs font-extrabold text-ink-2 md:hidden">
            {st.tourIndex + 1}/{TOUR.length}
          </span>
        </div>
        <div className="ak-float pointer-events-auto flex items-center gap-1 p-1">
          <button
            className="ak-icon-btn"
            aria-label={full ? "Keluar layar penuh" : "Layar penuh"}
            title={full ? "Keluar layar penuh" : "Layar penuh"}
            onClick={() => void toggleFull()}
          >
            <Icon name={full ? "fullscreen_exit" : "fullscreen"} />
          </button>
          <button
            className="ak-icon-btn"
            aria-label="Keluar tur"
            title="Keluar tur"
            onClick={endTour}
          >
            <Icon name="close" />
          </button>
        </div>
      </div>

      {/* bawah: layar edukasi besar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-3 md:p-6">
        <div
          aria-live="polite"
          className="ak-tour-card pointer-events-auto flex w-full max-w-[1180px] flex-col gap-4 p-5 md:p-7 lg:flex-row lg:items-end lg:gap-8"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-extrabold tracking-[.1em] text-[#7851CC] uppercase md:text-[13px]">
              Persinggahan {st.tourIndex + 1} dari {TOUR.length}
              {!st.tourPlaying && !finished && (
                <span className="rounded-full bg-[#FFF0D5] px-2.5 py-0.5 tracking-normal text-[#904200] normal-case">
                  Dijeda
                </span>
              )}
            </div>
            <h2 className="ak-tour-title mt-1">{stop.title}</h2>
            <p
              key={`${st.tourIndex}-${st.tourLine}`}
              className="ak-tour-line ak-tour-text mt-2 md:mt-3"
            >
              {line}
            </p>
            <div className="mt-4 flex gap-1.5" aria-hidden="true">
              {stop.lines.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-full ${i <= st.tourLine ? "bg-[#8B45F5]" : "bg-[#EDE3FA]"}`}
                />
              ))}
            </div>
          </div>
          <div className="ak-toolbar shrink-0 self-center max-sm:w-full max-sm:justify-between lg:self-end">
            <button
              className="ak-tool"
              aria-label="Sebelumnya"
              disabled={st.tourIndex === 0}
              onClick={() => go(st.tourIndex - 1)}
            >
              <Icon name="skip_previous" size={24} />
              Sebelumnya
            </button>
            {finished ? (
              <button
                className="ak-tool is-go"
                aria-label="Ulangi tur"
                onClick={() => go(0)}
              >
                <Icon name="replay" size={24} />
                Ulangi
              </button>
            ) : (
              <button
                className={`ak-tool ${st.tourPlaying ? "is-on" : "is-go"}`}
                aria-label={st.tourPlaying ? "Jeda" : "Lanjut"}
                onClick={() => st.set({ tourPlaying: !st.tourPlaying })}
              >
                <Icon
                  name={st.tourPlaying ? "pause" : "play_arrow"}
                  size={24}
                />
                {st.tourPlaying ? "Jeda" : "Lanjut"}
              </button>
            )}
            <button
              className="ak-tool"
              aria-label="Berikutnya"
              disabled={st.tourIndex === LAST}
              onClick={() => go(st.tourIndex + 1)}
            >
              <Icon name="skip_next" size={24} />
              Berikutnya
            </button>
            {speechOk && (
              <button
                className="ak-tool"
                aria-label="Narasi suara"
                aria-pressed={st.tourNarration}
                onClick={() => st.set({ tourNarration: !st.tourNarration })}
              >
                <Icon
                  name={st.tourNarration ? "volume_up" : "volume_off"}
                  size={24}
                />
                Narasi
              </button>
            )}
          </div>
        </div>
        <p className="rounded-full bg-[#0b1226]/60 px-3 py-0.5 text-center text-[11px] font-bold text-white/85">
          Jarak dirapatkan &amp; perjalanan dipercepat · Geser layar untuk
          menjeda dan melihat sekeliling
        </p>
      </div>
    </>
  );
}

/** Panel kanan saat tur: daftar persinggahan (lompat) + semua teks persinggahan aktif. */
export function TourPanel() {
  const st = useAngkasa();
  const stop = TOUR[st.tourIndex];
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em] text-ink">
            Tur terbang
          </h2>
          <Pill tone="gray">Tampilan belajar</Pill>
        </div>
        <p className="mt-1 text-[15px] leading-relaxed text-ink">
          Terbang dari Matahari sampai komet, seperti melihat lewat jendela
          pesawat antariksa.
        </p>
      </div>
      <div className="rounded-2xl border border-line p-3">
        <div className="text-xs font-bold tracking-wide text-ink-4 uppercase">
          Sedang singgah
        </div>
        <div className="mt-1 text-lg font-extrabold text-ink">{stop.title}</div>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed">
          {stop.lines.map((l, i) => (
            <li
              key={i}
              className={
                i === st.tourLine ? "font-semibold text-ink" : "text-ink-3"
              }
            >
              {l}
            </li>
          ))}
        </ul>
      </div>
      <ol className="flex flex-col gap-0.5" aria-label="Rute tur">
        {TOUR.map((s, i) => {
          const on = i === st.tourIndex;
          return (
            <li key={s.id}>
              <button
                onClick={() =>
                  st.set({ tourIndex: i, tourLine: 0, tourPlaying: true })
                }
                aria-current={on ? "step" : undefined}
                className={`flex min-h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-sm ${on ? "bg-teal/10 font-bold text-ink" : "text-ink-2 hover:bg-fill"}`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    i < st.tourIndex
                      ? "bg-teal text-white"
                      : on
                        ? "bg-coral text-white"
                        : "bg-fill text-ink-3"
                  }`}
                >
                  {i < st.tourIndex ? <Icon name="check" size={14} /> : i + 1}
                </span>
                {s.title}
              </button>
            </li>
          );
        })}
      </ol>
      <Note icon="straighten">
        Selama tur, jarak antarplanet dirapatkan dan perjalanan dipercepat.
        Perjalanan sungguhan ke Neptunus butuh sekitar 12 tahun.
      </Note>
      <Btn variant="outline" icon="close" onClick={endTour}>
        Keluar tur
      </Btn>
    </div>
  );
}
