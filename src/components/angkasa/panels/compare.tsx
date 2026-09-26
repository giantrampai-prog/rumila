"use client";

// Panel Bandingkan (PRD §4D): pilih 2–4 objek; Ukuran = satu faktor skala untuk diameter (radius rata-rata),
// rasio dihitung dari data; Jarak = jarak rata-rata dari Matahari (AU & km) dengan skala linear/log berlabel.

import { useEffect } from "react";
import { Icon } from "@/components/ui";
import {
  AU_KM,
  COMPARE_IDS,
  COMPARE_MAX,
  COMPARE_MIN,
  asReference,
  distRows,
  fmtAU,
  fmtKm,
  fmtRatio,
  ratioSentence,
  roundSig,
  sizeRows,
  useCompareUi,
} from "@/lib/angkasa/compare";
import { OBJ, PART } from "@/lib/angkasa/manifest";
import { markDone } from "@/lib/angkasa/progress";
import { useAngkasa } from "@/lib/angkasa/state";
import { CompareView } from "../engine/compareView";
import { Btn, Note, Pill, SourceList, Tabs } from "../ui";
import { getEngine } from "../viewer";

/** Perintah kamera ke view Bandingkan yang aktif (perbesar objek / lihat semua). */
function focusView(id: string | null) {
  const v = getEngine()?.getView();
  if (v instanceof CompareView) v.focusOn(id);
}

export function ComparePanel() {
  const st = useAngkasa();
  const rings = useCompareUi((s) => s.rings);
  const setRings = useCompareUi((s) => s.setRings);
  const ids = st.compareIds;
  const kind = st.compareKind;
  const itemId = `bandingkan:${kind}`;

  // Dianggap selesai setelah dipakai aktif ±6 detik pada jenis perbandingan ini (atau saat berinteraksi).
  useEffect(() => {
    const t = setTimeout(() => markDone(st.memberId, itemId), 6000);
    return () => clearTimeout(t);
  }, [st.memberId, itemId]);
  const used = () => markDone(st.memberId, itemId);

  const toggle = (id: string) => {
    st.toggleCompare(id);
    used();
  };

  const sizes = sizeRows(ids);
  const ref = sizes[0];
  const dists = distRows(ids);
  const ringFacts = PART.get("saturn.rings")?.facts ?? [];
  const ringOuter = ringFacts.find((f) => /luar/i.test(f.label))?.qty.value;
  const sourceIds = [
    ...new Set(ids.flatMap((id) => OBJ.get(id)?.sourceIds ?? [])),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em] text-ink">
            Bandingkan
          </h2>
          <Pill
            tone={kind === "jarak" && st.distScale === "log" ? "coral" : "teal"}
          >
            {kind === "ukuran"
              ? "Skala sebenarnya"
              : st.distScale === "log"
                ? "Skala logaritmik"
                : "Skala linear"}
          </Pill>
        </div>
        <p className="mt-1 text-[15px] text-ink-2">
          {kind === "ukuran"
            ? "Seberapa besar benda-benda langit jika disandingkan?"
            : "Seberapa jauh dari Matahari rata-ratanya?"}
        </p>
      </div>

      <Tabs
        label="Jenis perbandingan"
        value={kind}
        onChange={(k) => st.set({ compareKind: k })}
        options={[
          ["ukuran", "Ukuran"],
          ["jarak", "Jarak"],
        ]}
      />

      {/* pilihan objek */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-ink-2">Pilih objek</span>
          <span className="text-xs text-ink-3">
            {ids.length} dipilih · {COMPARE_MIN}–{COMPARE_MAX} objek
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMPARE_IDS.map((id) => {
            const o = OBJ.get(id)!;
            const on = ids.includes(id);
            const disabled = on
              ? ids.length <= COMPARE_MIN
              : ids.length >= COMPARE_MAX;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                disabled={disabled}
                onClick={() => toggle(id)}
                title={
                  disabled
                    ? on
                      ? `Minimal ${COMPARE_MIN} objek`
                      : `Maksimal ${COMPARE_MAX} objek`
                    : undefined
                }
                className={`inline-flex min-h-11 items-center gap-1 rounded-full border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                  on
                    ? "border-teal bg-[#F1EAFF] text-[#7541D8] disabled:opacity-80"
                    : "border-line bg-white text-ink-2 hover:border-ink-4 disabled:opacity-40"
                }`}
              >
                {on && <Icon name="check" size={16} />}
                {o.nameId}
              </button>
            );
          })}
        </div>
        {ids.length >= COMPARE_MAX && (
          <p className="mt-1.5 text-xs text-ink-3">
            Sudah {COMPARE_MAX} objek. Hapus satu untuk menambah yang lain.
          </p>
        )}
      </div>

      {kind === "ukuran" && ref && (
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-sm">
              <caption className="bg-page px-3 py-2 text-left text-xs text-ink-3">
                Diameter = 2 × radius rata-rata · rasio terhadap{" "}
                <b className="text-ink-2">{ref.name}</b>
              </caption>
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink-3">
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Objek
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-right font-semibold"
                  >
                    Diameter
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-right font-semibold"
                  >
                    × {ref.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-b border-line-soft last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="px-3 py-1.5 text-left font-bold text-ink"
                    >
                      <button
                        type="button"
                        onClick={() => focusView(r.id)}
                        className="inline-flex min-h-9 items-center gap-1 text-left hover:text-[#7541D8]"
                        title={`Perbesar ${r.name} di layar`}
                      >
                        {r.name}
                        <Icon name="zoom_in" size={16} className="text-ink-4" />
                      </button>
                    </th>
                    <td className="px-2 py-1.5 text-right text-ink">
                      {fmtKm(r.diameterKm)} km
                    </td>
                    <td className="px-3 py-1.5 text-right font-bold text-ink">
                      {i === 0
                        ? "acuan"
                        : r.ratio === null
                          ? "–"
                          : `${fmtRatio(r.ratio)} ×`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="flex flex-col gap-1 text-[15px] text-ink">
            {sizes.slice(1).map((r) => (
              <li key={r.id} className="flex gap-2">
                <Icon
                  name="straighten"
                  size={18}
                  className="mt-0.5 text-ink-3"
                />
                {ratioSentence(r, ref.name)}
              </li>
            ))}
          </ul>
          {ids.length > 2 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
              Ganti acuan:
              {ids.slice(1).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    st.set({ compareIds: asReference(ids, id) });
                    used();
                  }}
                  className="min-h-9 rounded-full bg-fill px-3 font-semibold text-ink-2 hover:text-ink"
                >
                  {OBJ.get(id)!.nameId}
                </button>
              ))}
            </div>
          )}
          <Btn icon="fit_screen" onClick={() => focusView(null)}>
            Lihat semua
          </Btn>
          <Note icon="straighten">
            <b>Satu skala untuk semua:</b> setiap globe memakai faktor yang sama
            dari radius rata-rata (data NASA). Rasio dihitung dari angka, bukan
            dari ukuran gambar. Jarak antarglobe hanya tata letak, bukan jarak
            di angkasa. Objek kecil bisa tampak seperti titik — tekan namanya
            untuk memperbesar.
          </Note>
          {ids.includes("saturn") && (
            <div className="rounded-xl border border-line p-3">
              <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">
                  Tampilkan cincin Saturnus
                </span>
                <input
                  type="checkbox"
                  checked={rings}
                  onChange={(e) => {
                    setRings(e.target.checked);
                    st.set({}); // segarkan keterangan skala di overlay (dibaca dari view aktif)
                    used();
                  }}
                  className="size-5 accent-[#8B45F5]"
                />
              </label>
              <p className="text-xs leading-relaxed text-ink-2">
                Cincin bukan bagian dari tubuh planet, jadi{" "}
                <b>tidak dihitung</b> dalam diameter Saturnus
                {ringOuter ? (
                  <>
                    {" "}
                    (tepi luar cincin A ± {fmtKm(ringOuter)} km dari pusat
                    Saturnus)
                  </>
                ) : null}
                .
              </p>
            </div>
          )}
        </div>
      )}

      {kind === "jarak" && (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-line p-2">
            <div className="mb-1.5 px-1 text-xs font-semibold text-ink-3">
              Skala sumbu
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  ["linear", "Linear (sebenarnya)"],
                  ["log", "Logaritmik"],
                ] as const
              ).map(([v, t]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={st.distScale === v}
                  onClick={() => {
                    st.set({ distScale: v });
                    used();
                  }}
                  className={`min-h-11 rounded-lg text-sm font-semibold ${st.distScale === v ? "bg-ink text-white" : "bg-fill text-ink-2"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {st.distScale === "log" && (
            <Note icon="warning">
              <b>Skala logaritmik:</b> setiap langkah sumbu mengalikan jarak
              (0,2 · 0,5 · 1 · 2 · 5 · 10 AU …), jadi planet jauh tampak lebih
              rapat daripada aslinya. Pilih Linear untuk melihat jarak
              sebenarnya.
            </Note>
          )}
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-sm">
              <caption className="bg-page px-3 py-2 text-left text-xs text-ink-3">
                Jarak rata-rata dari Matahari (setengah sumbu panjang orbit)
              </caption>
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink-3">
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Objek
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-right font-semibold"
                  >
                    AU
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-right font-semibold"
                  >
                    km (±)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...dists]
                  .sort((a, b) => a.au - b.au)
                  .map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-line-soft last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-3 py-1.5 text-left font-bold text-ink"
                      >
                        <button
                          type="button"
                          onClick={() => focusView(r.id)}
                          className="inline-flex min-h-9 items-center gap-1 text-left hover:text-[#7541D8]"
                          title={`Perbesar penanda ${r.name}`}
                        >
                          {r.name}
                          <Icon
                            name="zoom_in"
                            size={16}
                            className="text-ink-4"
                          />
                        </button>
                        {r.viaParent && (
                          <span className="block text-[11px] font-normal text-ink-3">
                            mengikuti {OBJ.get(r.viaParent)!.nameId}
                          </span>
                        )}
                      </th>
                      <td className="px-2 py-1.5 text-right text-ink">
                        {fmtAU(r.au)}
                      </td>
                      <td className="px-3 py-1.5 text-right text-ink">
                        {fmtKm(roundSig(r.km, 4))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Btn icon="fit_screen" onClick={() => focusView(null)}>
            Lihat semua
          </Btn>
          <Note icon="info">
            1 AU (satuan astronomi) ={" "}
            {new Intl.NumberFormat("id-ID", {
              maximumFractionDigits: 1,
            }).format(AU_KM)}{" "}
            km, kira-kira jarak rata-rata Bumi–Matahari. Angka km dibulatkan ke
            4 angka penting.
          </Note>
          <Note icon="schedule">
            Ini <b>jarak rata-rata dari Matahari</b>, bukan jarak antarplanet
            saat ini. Planet terus bergerak di orbitnya, jadi jarak dua planet
            berubah setiap hari.
            {dists.some((r) => r.viaParent) &&
              " Satelit seperti Bulan dan Titan ikut planet induknya, jadi jaraknya dari Matahari hampir sama."}
          </Note>
          <Note icon="radio_button_checked">
            Penanda di layar diperbesar — bukan ukuran planet. Letak penanda di
            sumbu dihitung dari angka jarak.
          </Note>
        </div>
      )}

      <SourceList ids={sourceIds} />
    </div>
  );
}
