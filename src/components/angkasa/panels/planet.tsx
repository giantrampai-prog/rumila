"use client";

// Panel objek (mode Planet): nama → jenis → definisi → fakta → aksi relevan → penjelasan → sumber.
// Hanya aksi yang punya data/aset yang ditampilkan (kapabilitas per objek).

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { OBJ, PART } from "@/lib/angkasa/manifest";
import { markDone } from "@/lib/angkasa/progress";
import { useAngkasa } from "@/lib/angkasa/state";
import {
  hasVoice,
  playVoice,
  stopVoice,
  usePlayingVoice,
} from "@/lib/angkasa/voice";
import { Btn, FactRow, Note, Pill, SourceList, Tabs, useSpeak } from "../ui";
import { RingInset } from "./structure";

type Tab = "kenali" | "struktur" | "satelit";

export function PlanetPanel() {
  const st = useAngkasa();
  const id = st.selectedId!;
  const o = OBJ.get(id);
  const [tab, setTab] = useState<Tab>("kenali");
  const { speak, speaking, supported } = useSpeak();
  const voice = hasVoice(id);
  const voicePlaying = usePlayingVoice() === id;
  useEffect(() => setTab("kenali"), [id]);

  // Materi objek dianggap selesai setelah dibaca aktif ±8 detik (bukan tiap perubahan kamera).
  useEffect(() => {
    if (!o) return;
    const t = setTimeout(() => markDone(st.memberId, `obj:${o.id}`), 8000);
    return () => clearTimeout(t);
  }, [o, st.memberId]);

  if (!o) return null;
  const part = st.partId ? PART.get(st.partId) : null;
  const caps = o.capabilities;
  const tabs: [Tab, string][] = [["kenali", "Kenali"]];
  if (caps.includes("interior")) tabs.push(["struktur", "Struktur"]);
  if (caps.includes("moons")) tabs.push(["satelit", "Satelit"]);
  const parent =
    o.parentId && o.parentId !== "sun" ? OBJ.get(o.parentId) : null;
  const speakText = `${o.nameId}. ${o.classification}. ${o.definitionSimple} ${o.surfaceNote ?? ""} ${o.explanationDetailed}`;

  const openStructure = () => {
    st.set({
      structureObj: id === "saturn" ? "saturn" : "earth",
      explode: 0,
      isolated: null,
    });
    st.setMode("struktur");
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        {parent && (
          <button
            onClick={() => st.select(parent.id, { mode: "planet" })}
            className="mb-1 flex min-h-8 items-center gap-1 text-xs font-semibold text-ink-3 hover:text-ink"
          >
            <Icon name="arrow_back" size={16} /> {parent.nameId}
          </button>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em] text-ink">
            {o.nameId}
          </h2>
          <Pill
            tone={
              o.classification === "Ilustrasi benda kecil" ? "gray" : "teal"
            }
          >
            {o.classification}
          </Pill>
        </div>
        <p className="mt-1 text-[15px] text-ink-2">{o.subtitle}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">
          {o.definitionSimple}
        </p>
      </div>

      {part && (
        <div className="rounded-2xl border border-coral/40 bg-coral-tint/40 p-3">
          <div className="text-xs font-bold tracking-wide text-coral-deep uppercase">
            Bagian terpilih
          </div>
          <div className="text-base font-bold text-ink">{part.nameId}</div>
          <p className="text-sm text-ink-2">{part.definitionSimple}</p>
          <p className="mt-1 text-xs text-ink-3">{part.explanationDetailed}</p>
          <button
            onClick={() => st.selectPart(null)}
            className="mt-1 min-h-9 text-xs font-semibold text-ink-3 underline"
          >
            Tutup bagian
          </button>
        </div>
      )}

      {tabs.length > 1 && (
        <Tabs
          label="Materi objek"
          value={tab}
          onChange={setTab}
          options={tabs}
        />
      )}

      {tab === "kenali" && (
        <div className="flex flex-col gap-3">
          {st.ringInset && id === "saturn" && <RingInset />}
          <div>
            {o.hasSolidSurface !== null && (
              <div className="flex items-baseline justify-between border-b border-line-soft py-2.5">
                <span className="text-sm text-ink-3">Permukaan padat</span>
                <span className="text-sm font-bold text-ink">
                  {o.hasSolidSurface ? "Ada" : "Tidak ada"}
                </span>
              </div>
            )}
            {o.keyFacts.map((f) => (
              <FactRow key={f.label} f={f} />
            ))}
          </div>
          {o.surfaceNote && <Note icon="landscape">{o.surfaceNote}</Note>}
          {o.confidenceNote && <Note icon="help">{o.confidenceNote}</Note>}
          {o.texture.alt && (
            <div className="rounded-xl border border-line p-2">
              <div className="mb-1.5 px-1 text-xs font-semibold text-ink-3">
                Jenis citra
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    ["awan", "Atmosfer (awan)"],
                    ["radar", "Permukaan (radar)"],
                  ] as const
                ).map(([v, t]) => (
                  <button
                    key={v}
                    aria-pressed={st.venusView === v}
                    onClick={() => st.set({ venusView: v })}
                    className={`min-h-10 rounded-lg text-sm font-semibold ${st.venusView === v ? "bg-ink text-white" : "bg-fill text-ink-2"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Note icon="image">
            <b>Jenis tampilan:</b>{" "}
            {o.id === "venus" && st.venusView === "radar"
              ? "Peta permukaan hasil radar (bukan warna alami)"
              : o.texture.representation}
            . {o.texture.credit}.
          </Note>
        </div>
      )}

      {tab === "struktur" && (
        <div className="flex flex-col gap-3">
          {o.partIds
            .map((p) => PART.get(p)!)
            .filter((p) => p.outerFrac !== undefined)
            .map((p) => (
              <div
                key={p.id}
                className="flex items-start gap-3 rounded-xl border border-line p-3"
              >
                <span
                  className="mt-1 size-3.5 shrink-0 rounded-full"
                  style={{ background: p.color }}
                />
                <div>
                  <div className="text-sm font-bold text-ink">{p.nameId}</div>
                  <div className="text-xs text-ink-2">{p.definitionSimple}</div>
                </div>
              </div>
            ))}
          <Note icon="palette">
            Warna lapisan adalah kode pendidikan, bukan warna asli bahan di
            dalam {o.nameId}.
          </Note>
          {id === "saturn" && (
            <Note icon="help">
              {PART.get("saturn.interior")!.explanationDetailed}
            </Note>
          )}
          <Btn variant="dark" icon="layers" onClick={openStructure}>
            Buka struktur 3D
          </Btn>
        </div>
      )}

      {tab === "satelit" && (
        <div className="flex flex-col gap-2">
          {o.childObjectIds.map((cid) => {
            const c = OBJ.get(cid)!;
            return (
              <button
                key={cid}
                onClick={() => st.select(cid, { mode: "planet" })}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-line p-3 text-left hover:border-ink-4"
              >
                <Icon name="brightness_3" className="text-ink-3" />
                <span className="flex-1">
                  <span className="block text-sm font-bold text-ink">
                    {c.nameId}
                  </span>
                  <span className="text-xs text-ink-3">
                    {c.definitionSimple}
                  </span>
                </span>
                <Icon name="chevron_right" className="text-chev" />
              </button>
            );
          })}
          {o.keyFacts
            .filter((f) => /satelit/i.test(f.label))
            .map((f) => (
              <Note key={f.label} icon="info">
                Model ini hanya menampilkan satelit yang termasuk rilis.{" "}
                {o.nameId} punya {f.qty.value} satelit{" "}
                {f.qty.quantityDefinition}
                {f.qty.sourceUpdatedAt
                  ? ` (data per ${f.qty.sourceUpdatedAt})`
                  : ""}
                .
              </Note>
            ))}
        </div>
      )}

      {/* Aksi relevan */}
      <div className="flex flex-col gap-2">
        {caps.includes("rings") && (
          <Btn
            variant="primary"
            icon="blur_circular"
            onClick={() => {
              st.set({ ringInset: true });
              st.selectPart("saturn.rings");
              setTab("kenali");
              markDone(st.memberId, "part:saturn.rings");
            }}
          >
            Jelajahi cincin
          </Btn>
        )}
        {!caps.includes("rings") && caps.includes("interior") && (
          <Btn variant="primary" icon="layers" onClick={openStructure}>
            Lihat struktur
          </Btn>
        )}
        <div className="grid grid-cols-2 gap-2">
          {caps.includes("rings") && caps.includes("interior") && (
            <Btn icon="layers" onClick={openStructure}>
              Lihat struktur
            </Btn>
          )}
          {caps.includes("compare") && (
            <Btn
              icon="compare_arrows"
              onClick={() => {
                const ids = id === "earth" ? ["earth", "moon"] : ["earth", id];
                st.set({
                  compareIds: [...new Set(ids)],
                  compareKind: "ukuran",
                });
                st.setMode("bandingkan");
              }}
            >
              Bandingkan
            </Btn>
          )}
          {voice ? (
            <Btn
              icon={voicePlaying ? "stop_circle" : "volume_up"}
              onClick={() => (voicePlaying ? stopVoice() : void playVoice(id))}
              pressed={voicePlaying}
            >
              {voicePlaying ? "Berhenti" : "Dengarkan"}
            </Btn>
          ) : (
            supported && (
              <Btn
                icon={speaking ? "stop_circle" : "volume_up"}
                onClick={() => speak(speakText)}
                pressed={speaking}
              >
                {speaking ? "Berhenti" : "Dengarkan"}
              </Btn>
            )
          )}
        </div>
        {voice && (
          <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl bg-[#F4EEFF] px-3 text-sm font-bold text-ink">
            <span className="flex items-center gap-2">
              <Icon
                name="record_voice_over"
                size={20}
                className="text-[#7541D8]"
              />
              Suara edukasi otomatis
            </span>
            <input
              type="checkbox"
              className="size-5 accent-[#8B45F5]"
              checked={st.prefs.autoVoice}
              onChange={(e) => {
                st.setPrefs({ autoVoice: e.target.checked });
                if (!e.target.checked) stopVoice();
              }}
            />
          </label>
        )}
      </div>

      <details className="rounded-xl border border-line px-3 py-2">
        <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink-2">
          Penjelasan lengkap <Icon name="expand_more" size={20} />
        </summary>
        <p className="pb-1 text-sm leading-relaxed text-ink">
          {o.explanationDetailed}
        </p>
      </details>
      <SourceList ids={o.sourceIds} />
    </div>
  );
}
