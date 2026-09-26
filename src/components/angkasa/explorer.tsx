"use client";

// Layout Jelajah Angkasa 3D. Desktop: daftar objek kiri · viewer dominan · panel belajar kanan (gambar konsep).
// Ponsel: viewer penuh lebar, daftar dalam drawer, panel dalam bottom sheet (ringkas/setengah/penuh).

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Avatar, Icon } from "@/components/ui";
import { useRumila, useUI } from "@/lib/store";
import { hasVoice, playVoice, stopVoice } from "@/lib/angkasa/voice";
import {
  beginTour,
  endTour,
  exitFull,
  isFull,
  setFullRoot,
  toggleFull,
  useIsFull,
} from "./fullscreen";
import { MANIFEST, OBJ, PART, PLANET_IDS } from "@/lib/angkasa/manifest";
import { useAngkasaSession, useDoneItems } from "@/lib/angkasa/progress";
import { SPEEDS } from "@/lib/angkasa/sim";
import { useAngkasa, type LessonId, type Mode } from "@/lib/angkasa/state";
import { ComparePanel } from "./panels/compare";
import { GalaxyPanel } from "./panels/galaxy";
import { LessonPanel } from "./panels/lesson";
import { OverviewPanel, QuizPanel } from "./panels/overview";
import { PlanetPanel } from "./panels/planet";
import { StructurePanel } from "./panels/structure";
import { TourOverlay, TourPanel } from "./panels/tour";
import { Btn } from "./ui";
import { getEngine, useScaleNote, Viewer } from "./viewer";
import "./angkasa.css";

/* ---------------- daftar tujuan ---------------- */

function Thumb({ id, size = 28 }: { id: string; size?: number }) {
  const o = OBJ.get(id)!;
  const url = o.texture.lo;
  return (
    <span
      aria-hidden
      className="relative inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: url ? `url(${url}) center/200% 100%` : o.texture.base,
        boxShadow:
          "inset -6px -4px 10px rgba(0,0,0,.45), 0 0 0 1px rgba(31,48,68,.08)",
      }}
    >
      {id === "saturn" && (
        <span className="absolute top-1/2 left-1/2 h-[30%] w-[160%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border-2 border-[#d8c9a2]/80" />
      )}
    </span>
  );
}

function NavItem({
  id,
  onPick,
  active,
  done,
}: {
  id: string;
  onPick: () => void;
  active: boolean;
  done: boolean;
}) {
  const o = OBJ.get(id)!;
  return (
    <button
      onClick={onPick}
      aria-current={active ? "true" : undefined}
      className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-2.5 text-left text-[15px] transition-colors ${active ? "bg-[#F1EAFF] font-bold text-ink" : "text-ink hover:bg-fill"}`}
    >
      <Thumb id={id} />
      <span className="flex-1 truncate">{o.nameId}</span>
      {done && (
        <Icon
          name="check_circle"
          size={16}
          className="text-teal"
          aria-label="sudah dipelajari"
        />
      )}
      {active && <Icon name="chevron_right" size={18} className="text-ink-3" />}
    </button>
  );
}

function SectionLink({
  icon,
  label,
  onClick,
  active,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-2.5 text-left text-[15px] ${active ? "bg-[#F1EAFF] font-bold" : "hover:bg-fill"} text-ink`}
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-fill text-ink-2">
        <Icon name={icon} size={17} />
      </span>
      <span className="flex-1">{label}</span>
      <Icon name="chevron_right" size={18} className="text-chev" />
    </button>
  );
}

function ObjectNav() {
  const st = useAngkasa();
  const done = useDoneItems(st.memberId);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return [];
    const objs = MANIFEST.objects
      .filter((o) =>
        [o.nameId, ...o.aliases, o.classification].some((t) =>
          t.toLowerCase().includes(query),
        ),
      )
      .map((o) => ({
        id: o.id,
        text: o.nameId,
        sub: o.classification,
        part: null as string | null,
      }));
    const parts = MANIFEST.parts
      .filter((p) => p.nameId.toLowerCase().includes(query))
      .map((p) => ({
        id: p.objectId,
        text: p.nameId,
        sub: `Bagian ${OBJ.get(p.objectId)!.nameId}`,
        part: p.id as string | null,
      }));
    const lessons = MANIFEST.lessons
      .filter((l) => l.title.toLowerCase().includes(query))
      .map((l) => ({
        id: l.id,
        text: l.title,
        sub: "Fenomena",
        part: "lesson" as string | null,
      }));
    return [...objs, ...parts, ...lessons];
  }, [query]);

  const pickObject = (id: string, part: string | null = null) => {
    if (id === "milky-way") return st.setMode("galaksi");
    st.select(id, { mode: "planet", part });
  };
  const openLesson = (l: LessonId) => {
    st.setLesson(l);
    st.setMode("fenomena");
    st.set({ drawerOpen: false });
  };
  const isObj = (id: string) => st.mode === "planet" && st.selectedId === id;

  return (
    <nav aria-label="Tujuan jelajah" className="flex h-full flex-col gap-3">
      <h2 className="px-1 text-lg font-extrabold text-ink">Tujuan jelajah</h2>
      <label className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 focus-within:border-ink-4">
        <Icon name="search" size={20} className="text-ink-3" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari benda langit"
          aria-label="Cari benda langit"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="Hapus pencarian"
            className="text-ink-4"
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </label>
      <div className="ak-scroll -mx-1 flex-1 overflow-y-auto px-1">
        {query ? (
          <ul className="space-y-1">
            {results.length === 0 && (
              <li className="px-2 py-3 text-sm text-ink-3">
                Belum ketemu. Coba nama lain, misalnya &ldquo;cincin&rdquo; atau
                &ldquo;mantel&rdquo;.
              </li>
            )}
            {results.map((r) => (
              <li key={r.text + r.sub}>
                <button
                  onClick={() => {
                    setQ("");
                    if (r.part === "lesson")
                      return openLesson(r.id as LessonId);
                    if (r.part && PART.get(r.part)?.outerFrac !== undefined) {
                      st.set({
                        structureObj: r.id === "saturn" ? "saturn" : "earth",
                        explode: 0,
                      });
                      st.select(r.id, { mode: "struktur", part: r.part });
                      return;
                    }
                    pickObject(r.id, r.part);
                  }}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl px-2.5 text-left hover:bg-fill"
                >
                  {OBJ.get(r.id) ? (
                    <Thumb id={r.id} />
                  ) : (
                    <Icon name="science" size={22} className="text-ink-3" />
                  )}
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {r.text}
                    </span>
                    <span className="text-xs text-ink-3">{r.sub}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-0.5">
            <NavItem
              id="sun"
              active={isObj("sun")}
              done={done.includes("obj:sun")}
              onPick={() => pickObject("sun")}
            />
            <div className="px-2.5 pt-2 pb-1 text-[11px] font-bold tracking-[.06em] text-ink-4 uppercase">
              Delapan planet
            </div>
            {PLANET_IDS.map((id) => (
              <NavItem
                key={id}
                id={id}
                active={isObj(id)}
                done={done.includes(`obj:${id}`)}
                onPick={() => pickObject(id)}
              />
            ))}
            <div className="px-2.5 pt-3 pb-1 text-[11px] font-bold tracking-[.06em] text-ink-4 uppercase">
              Satelit
            </div>
            {["moon", "titan"].map((id) => (
              <NavItem
                key={id}
                id={id}
                active={isObj(id)}
                done={done.includes(`obj:${id}`)}
                onPick={() => pickObject(id)}
              />
            ))}
            <div className="px-2.5 pt-3 pb-1 text-[11px] font-bold tracking-[.06em] text-ink-4 uppercase">
              Planet katai &amp; benda kecil
            </div>
            {["pluto", "asteroid-example", "comet-example"].map((id) => (
              <NavItem
                key={id}
                id={id}
                active={isObj(id)}
                done={done.includes(`obj:${id}`)}
                onPick={() => pickObject(id)}
              />
            ))}
            <div className="my-3 border-t border-line" />
            <SectionLink
              icon="flight_takeoff"
              label="Tur terbang"
              active={st.mode === "tur"}
              onClick={() => beginTour(0)}
            />
            <SectionLink
              icon="science"
              label="Fenomena"
              active={st.mode === "fenomena"}
              onClick={() => openLesson(st.lesson)}
            />
            <SectionLink
              icon="auto_awesome"
              label="Bintang & galaksi"
              active={st.mode === "galaksi"}
              onClick={() => st.setMode("galaksi")}
            />
            <SectionLink
              icon="quiz"
              label="Cek pemahaman"
              active={st.mode === "latihan"}
              onClick={() => st.setMode("latihan")}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

/* ---------------- overlay viewport ---------------- */

const MODE_NAME: Record<Mode, string> = {
  "tata-surya": "Tata Surya",
  planet: "Planet",
  bandingkan: "Bandingkan",
  struktur: "Struktur",
  fenomena: "Fenomena",
  galaksi: "Bintang & galaksi",
  latihan: "Cek pemahaman",
  tur: "Tur terbang",
};

function Breadcrumb() {
  const st = useAngkasa();
  const crumbs: { text: string; onClick?: () => void }[] = [
    {
      text: "Tata Surya",
      onClick: () => st.select(null, { mode: "tata-surya" }),
    },
  ];
  const o = st.selectedId ? OBJ.get(st.selectedId) : null;
  if (st.mode === "planet" && o) {
    if (o.parentId && o.parentId !== "sun")
      crumbs.push({
        text: OBJ.get(o.parentId)!.nameId,
        onClick: () => st.select(o.parentId!, { mode: "planet" }),
      });
    crumbs.push({ text: o.nameId });
    if (st.partId)
      crumbs.push({ text: PART.get(st.partId)?.nameId ?? st.partId });
  } else if (st.mode === "struktur") {
    crumbs.push(
      {
        text: OBJ.get(st.structureObj)!.nameId,
        onClick: () => st.select(st.structureObj, { mode: "planet" }),
      },
      { text: "Struktur" },
    );
  } else if (st.mode !== "tata-surya")
    crumbs.push({ text: MODE_NAME[st.mode] });
  return (
    <nav
      aria-label="Lokasi"
      className="ak-float flex flex-wrap items-center gap-1 px-3 py-1 text-[12px] font-bold text-ink-2"
    >
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && (
            <Icon name="chevron_right" size={16} className="text-chev" />
          )}
          {c.onClick && i < crumbs.length - 1 ? (
            <button
              onClick={c.onClick}
              className="min-h-8 hover:text-ink hover:underline"
            >
              {c.text}
            </button>
          ) : (
            <span className="font-extrabold text-ink">{c.text}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function ToolButton({
  icon,
  label,
  onClick,
  active,
  disabled,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      className="ak-tool"
    >
      <Icon name={icon} size={22} />
      {label}
    </button>
  );
}

function zoomBy(f: number) {
  const e = getEngine();
  if (!e) return;
  const c = e.controls;
  const cam = c.object;
  // Kamera ortografis (Bandingkan ukuran): zoom lewat faktor zoom, bukan jarak.
  if ((cam as { isOrthographicCamera?: boolean }).isOrthographicCamera) {
    const oc = cam as unknown as {
      zoom: number;
      updateProjectionMatrix: () => void;
    };
    oc.zoom = Math.min(c.maxZoom, Math.max(c.minZoom, oc.zoom / f));
    oc.updateProjectionMatrix();
    c.update();
    return;
  }
  const dir = cam.position.clone().sub(c.target);
  const len = Math.min(
    c.maxDistance,
    Math.max(c.minDistance, dir.length() * f),
  );
  cam.position.copy(c.target).add(dir.setLength(len));
  c.update();
}

/** Tombol kanan-atas viewport: panel informasi + layar penuh (sama seperti Jelajah Tubuh). */
function StageTools({
  panelOpen,
  onTogglePanel,
}: {
  panelOpen?: boolean;
  onTogglePanel?: () => void;
}) {
  const full = useIsFull();
  return (
    <div className="ak-float pointer-events-auto flex items-center gap-1 p-1">
      {onTogglePanel && (
        <button
          className="ak-icon-btn"
          aria-label={panelOpen ? "Sembunyikan panel" : "Tampilkan panel"}
          aria-pressed={panelOpen}
          title={panelOpen ? "Sembunyikan panel" : "Tampilkan panel"}
          onClick={onTogglePanel}
        >
          <Icon name="info" />
        </button>
      )}
      <button
        className="ak-icon-btn"
        aria-label={full ? "Keluar layar penuh" : "Layar penuh"}
        title={full ? "Keluar layar penuh" : "Layar penuh"}
        onClick={() => void toggleFull()}
      >
        <Icon name={full ? "fullscreen_exit" : "fullscreen"} />
      </button>
    </div>
  );
}

function ViewportOverlay({
  inset,
  panelOpen,
  onTogglePanel,
}: {
  /** ruang yang tertutup panel mengambang (layar penuh) */
  inset?: { left: number; right: number };
  panelOpen?: boolean;
  onTogglePanel?: () => void;
}) {
  const st = useAngkasa();
  const note = useScaleNote();
  const o = st.selectedId ? OBJ.get(st.selectedId) : null;
  const inSolar =
    st.mode === "tata-surya" || st.mode === "planet" || st.mode === "latihan";
  const canStructure = !!o?.capabilities.includes("interior");
  if (st.mode === "tur") return <TourOverlay />;
  const pad = {
    paddingLeft: inset ? inset.left : undefined,
    paddingRight: inset ? inset.right : undefined,
  };

  return (
    <>
      {/* atas */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex flex-col gap-2 p-3 md:p-4"
        style={pad}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            role="tablist"
            aria-label="Mode"
            className="ak-seg pointer-events-auto max-w-full overflow-x-auto"
          >
            {(
              [
                ["tata-surya", "Tata Surya", "sunny"],
                ["planet", "Planet", "public"],
                ["bandingkan", "Bandingkan", "compare_arrows"],
                ["tur", "Tur terbang", "flight_takeoff"],
              ] as [Mode, string, string][]
            ).map(([m, t, icon]) => {
              const on =
                st.mode === m || (m === "planet" && st.mode === "struktur");
              return (
                <button
                  key={m}
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    if (m === "tata-surya")
                      st.select(null, { mode: "tata-surya" });
                    else if (m === "planet")
                      st.select(st.selectedId ?? "saturn", { mode: "planet" });
                    else if (m === "tur") beginTour(0);
                    else st.setMode("bandingkan");
                  }}
                  className="flex items-center gap-1.5"
                >
                  <Icon name={icon} size={18} className="hidden md:inline" />
                  {t}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <span className="ak-float pointer-events-auto hidden px-3 py-2 text-xs font-extrabold whitespace-nowrap text-[#7541D8] 2xl:inline">
              {st.mode === "bandingkan"
                ? st.compareKind === "jarak" && st.distScale === "log"
                  ? "Skala logaritmik"
                  : "Skala sebenarnya"
                : st.mode === "fenomena"
                  ? "Simulasi belajar"
                  : st.mode === "galaksi"
                    ? "Ilustrasi struktur galaksi"
                    : st.mode === "struktur"
                      ? "Model pendidikan"
                      : "Tampilan belajar"}
            </span>
            <StageTools panelOpen={panelOpen} onTogglePanel={onTogglePanel} />
          </div>
        </div>
        <div className="pointer-events-auto self-start">
          <Breadcrumb />
        </div>
      </div>

      {/* status aset / engine */}
      {st.assetErrors.length > 0 && (
        <div
          role="alert"
          className="ak-float absolute top-28 left-1/2 flex -translate-x-1/2 items-center gap-2 px-3 py-2 text-xs font-bold"
        >
          <Icon name="cloud_off" size={18} /> {st.assetErrors.length} tekstur
          gagal dimuat.
          <button
            onClick={() => location.reload()}
            className="ak-btn min-h-8 px-2 py-0 text-xs"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* zoom alternatif */}
      <div
        className="ak-float pointer-events-auto absolute bottom-28 hidden flex-col items-center gap-1 p-1 sm:flex"
        style={{ right: (inset?.right ?? 0) + 16 }}
      >
        {(
          [
            ["add", "Perbesar", 0.8],
            ["remove", "Perkecil", 1.25],
          ] as const
        ).map(([icon, label, f]) => (
          <button
            key={icon}
            onClick={() => zoomBy(f)}
            aria-label={label}
            title={label}
            className="ak-icon-btn"
          >
            <Icon name={icon} />
          </button>
        ))}
      </div>

      {/* bawah */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1.5 p-2 md:p-4"
        style={pad}
      >
        <div className="ak-toolbar pointer-events-auto max-w-full overflow-x-auto">
          {inSolar && (
            <>
              <ToolButton
                icon="360"
                label="Putar"
                active={st.spinOn}
                onClick={() => st.set({ spinOn: !st.spinOn })}
              />
              <ToolButton
                icon="motion_photos_on"
                label="Orbit"
                active={st.orbitOn}
                onClick={() => st.set({ orbitOn: !st.orbitOn })}
              />
              <ToolButton
                icon="layers"
                label="Struktur"
                disabled={!canStructure}
                onClick={() => {
                  st.set({
                    structureObj:
                      st.selectedId === "saturn" ? "saturn" : "earth",
                    explode: 0,
                  });
                  st.setMode("struktur");
                }}
              />
            </>
          )}
          <ToolButton
            icon="restart_alt"
            label="Reset"
            onClick={() => {
              if (st.mode === "fenomena") return st.resetLesson();
              getEngine()?.clock.reset();
              st.set({
                playing: false,
                refocusNonce: st.refocusNonce + 1,
                explode: 0,
                isolated: null,
                ...(st.mode === "struktur" ? { partId: null } : {}),
              });
            }}
          />
          {(inSolar || st.mode === "fenomena") && (
            <>
              <span className="mx-0.5 h-10 w-0.5 shrink-0 rounded bg-[#ede3fa]" />
              <button
                onClick={() => st.set({ playing: !st.playing })}
                aria-pressed={st.playing}
                aria-label={st.playing ? "Jeda simulasi" : "Jalankan simulasi"}
                className={`ak-tool ${st.playing ? "" : "is-go"}`}
              >
                <Icon name={st.playing ? "pause" : "play_arrow"} size={22} />
                {st.playing ? "Jeda" : "Jalankan"}
              </button>
              {inSolar && (
                <select
                  value={st.speed}
                  onChange={(e) => st.set({ speed: Number(e.target.value) })}
                  aria-label="Kecepatan simulasi (hari simulasi per detik nyata)"
                  className="min-h-11 max-w-[110px] shrink-0 rounded-xl border-2 border-[#ede3fa] bg-white px-2 text-xs font-bold text-ink sm:max-w-none"
                >
                  {SPEEDS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
          {/* zoom alternatif di ponsel */}
          <span className="flex shrink-0 sm:hidden">
            <ToolButton
              icon="add"
              label="Perbesar"
              onClick={() => zoomBy(0.8)}
            />
            <ToolButton
              icon="remove"
              label="Perkecil"
              onClick={() => zoomBy(1.25)}
            />
          </span>
        </div>
        <p className="rounded-full bg-[#0b1226]/60 px-3 py-0.5 text-center text-[11px] leading-snug font-bold text-white/85">
          <span className="hidden lg:inline">
            Geser untuk memutar · Cubit/scroll untuk zoom ·{" "}
          </span>
          {note}
        </p>
      </div>
    </>
  );
}

function NoWebGL() {
  const st = useAngkasa();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
      <Icon name="view_in_ar_off" size={44} />
      <p className="max-w-sm font-semibold">
        {st.engineStatus === "context-lost"
          ? "Tampilan 3D berhenti sementara karena kartu grafis sibuk."
          : "Perangkat ini belum mendukung tampilan 3D (WebGL)."}
      </p>
      <p className="max-w-sm text-sm text-white/75">
        Materi, daftar benda langit, dan penjelasan di panel tetap bisa dibaca.
        Tampilan 3D tidak sedang aktif.
      </p>
      <Btn variant="primary" icon="refresh" onClick={() => location.reload()}>
        Coba lagi
      </Btn>
    </div>
  );
}

/* ---------------- panel kanan ---------------- */

function RightPanel() {
  const st = useAngkasa();
  let body: ReactNode;
  if (st.mode === "planet" && st.selectedId) body = <PlanetPanel />;
  else if (st.mode === "bandingkan") body = <ComparePanel />;
  else if (st.mode === "struktur") body = <StructurePanel />;
  else if (st.mode === "fenomena") body = <LessonPanel />;
  else if (st.mode === "galaksi") body = <GalaxyPanel />;
  else if (st.mode === "latihan") body = <QuizPanel />;
  else if (st.mode === "tur") body = <TourPanel />;
  else body = <OverviewPanel />;
  return (
    <div className="flex flex-col gap-4">
      {body}
      {st.mode !== "tata-surya" && (
        <button
          onClick={() => st.select(null, { mode: "tata-surya" })}
          className="flex min-h-11 items-center gap-2 border-t border-line pt-3 text-sm font-semibold text-ink hover:text-teal"
        >
          <Icon name="chevron_left" /> Kembali ke tata surya
        </button>
      )}
    </div>
  );
}

/* ---------------- halaman ---------------- */

function useDesktop() {
  const [d, setD] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setD(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}

function Guide({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(31,48,68,.45)] p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panduan"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">Panduan</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-10 items-center justify-center rounded-xl bg-fill"
          >
            <Icon name="close" />
          </button>
        </div>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
          <li>
            <b>Memutar & zoom:</b> geser untuk memutar pandangan, cubit atau
            scroll untuk zoom, atau pakai tombol + / −.
          </li>
          <li>
            <b>Memilih:</b> ketuk benda langit, atau pilih dari daftar
            &ldquo;Tujuan jelajah&rdquo; (juga lewat keyboard). Menggeser tidak
            memilih.
          </li>
          <li>
            <b>Tampilan belajar:</b> ukuran planet dibesarkan dan jarak
            dirapatkan agar semua terlihat. Skala sebenarnya ada di mode
            Bandingkan.
          </li>
          <li>
            <b>Waktu:</b> tombol putar menjalankan jam simulasi (hari simulasi
            per detik nyata). Jeda membekukan waktu, kamera tetap bisa
            digerakkan. &ldquo;Putar&rdquo; dan &ldquo;Orbit&rdquo;
            menghidupkan/mematikan rotasi dan revolusi secara terpisah.
          </li>
          <li>
            <b>Rotasi diperlambat:</b> putaran planet ditampilkan lebih lambat
            dari aslinya agar bisa diamati; arah dan urutan cepat–lambatnya
            tetap.
          </li>
          <li>
            <b>Posisi:</b> posisi planet ilustratif, bukan posisi di langit hari
            ini.
          </li>
        </ul>
      </div>
    </div>
  );
}

export function Explorer({
  memberId,
  initial,
}: {
  memberId: string;
  initial?: { obj?: string; mode?: Mode };
}) {
  const st = useAngkasa();
  const desktop = useDesktop();
  const [guide, setGuide] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const full = useIsFull();
  const me = useRumila((s) => s.members.find((m) => m.id === memberId));
  const openSheet = useUI((s) => s.openSheet);
  const appRef = useRef<HTMLDivElement>(null);
  useAngkasaSession(memberId);

  useEffect(() => {
    setFullRoot(appRef.current);
    return () => setFullRoot(null);
  }, []);

  useEffect(() => {
    useAngkasa.getState().init(memberId);
    if (initial?.obj && OBJ.get(initial.obj))
      useAngkasa
        .getState()
        .select(initial.obj, { mode: "planet", push: false });
    else if (initial?.mode) useAngkasa.getState().setMode(initial.mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  // Suara edukasi rekaman: diputar otomatis saat objek dibuka di mode Planet, berhenti saat pindah.
  const voiceObj = st.mode === "planet" ? st.selectedId : null;
  useEffect(() => {
    if (voiceObj && st.prefs.autoVoice && hasVoice(voiceObj))
      void playVoice(voiceObj);
    else stopVoice();
  }, [voiceObj, st.prefs.autoVoice]);
  useEffect(() => () => stopVoice(), []);

  // Keyboard: Escape = keluar tur / keluar layar penuh / kembali
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.target instanceof HTMLInputElement) return;
      if (useAngkasa.getState().mode === "tur") return endTour();
      if (isFull()) return void exitFull();
      useAngkasa.getState().back();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const tour = st.mode === "tur";
  // Mode imersif: layar penuh, atau tur terbang (viewer memenuhi ruang, teks edukasi besar).
  const immersive = full || tour;
  const floatPanels = desktop && full && !tour && panelOpen;
  const inset = floatPanels ? { left: 276, right: 396 } : undefined;
  // Pusatkan objek di area yang tidak tertutup panel mengambang, lalu bingkai ulang.
  const insetL = inset?.left ?? 0;
  const insetR = inset?.right ?? 0;
  useEffect(() => {
    const s = useAngkasa.getState();
    s.set({
      frameInset: [insetL, insetR],
      ...(s.mode === "planet" ? { refocusNonce: s.refocusNonce + 1 } : {}),
    });
  }, [insetL, insetR]);

  const viewport = (
    <div
      className={`relative h-full min-h-0 overflow-hidden bg-[#05070f] ${full ? "" : "rounded-[22px]"}`}
    >
      {st.engineStatus === "no-webgl" || st.engineStatus === "context-lost" ? (
        <NoWebGL />
      ) : (
        <Viewer />
      )}
      {st.engineStatus !== "no-webgl" && (
        <ViewportOverlay
          inset={inset}
          panelOpen={desktop ? panelOpen : undefined}
          onTogglePanel={
            desktop && !tour ? () => setPanelOpen(!panelOpen) : undefined
          }
        />
      )}
    </div>
  );

  const header = (
    <header className="ak-header flex min-h-[58px] items-center gap-6 bg-white px-6 max-lg:min-h-[52px] max-lg:gap-3 max-lg:px-3.5">
      <Link
        href="/beranda"
        className="ak-wordmark"
        aria-label="Kembali ke Beranda Rumila"
      >
        RUMILA
      </Link>
      <nav
        aria-label="Navigasi modul"
        className="hidden items-center gap-2 text-[13px] font-bold text-ink-2 sm:flex"
      >
        <Link href="/beranda/angkasa" className="hover:text-ink">
          Angkasa
        </Link>
        <Icon name="chevron_right" size={16} />
        <span className="text-ink">Jelajah Angkasa</span>
      </nav>
      <div className="ml-auto flex items-center gap-1.5">
        {!desktop && !tour && (
          <button
            onClick={() => st.set({ drawerOpen: true })}
            className="ak-btn quiet px-2.5"
          >
            <Icon name="list" /> Tujuan
          </button>
        )}
        <button onClick={() => setGuide(true)} className="ak-btn quiet px-2.5">
          <Icon name="help_outline" />{" "}
          <span className="max-sm:hidden">Panduan</span>
        </button>
        {me && (
          <button
            onClick={() => openSheet({ kind: "members" })}
            aria-label="Ganti profil"
            className="flex min-h-11 items-center gap-2 rounded-full bg-[#F4EEFF] py-1 pr-2.5 pl-1 text-sm font-extrabold text-ink"
          >
            <Avatar name={me.name} c={me.c} size={30} />
            <span className="max-sm:hidden">{me.name}</span>
            <Icon name="expand_more" size={18} />
          </button>
        )}
      </div>
    </header>
  );

  const heading = (
    <div className="ak-heading flex min-h-[78px] items-center justify-between gap-3 px-6 py-2.5 max-lg:min-h-0 max-lg:px-3.5 max-lg:py-2">
      <div className="min-w-0">
        <h1 className="text-[28px] leading-[1.05] font-extrabold text-ink max-lg:text-[22px]">
          Jelajah Angkasa 3D
        </h1>
        <p className="mt-0.5 text-[13px] font-bold text-ink-2 max-lg:text-[11px]">
          Petualangan seru menjelajah tata surya!
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          className="ak-btn soft max-sm:px-3"
          onClick={() => st.setMode("latihan")}
        >
          <Icon name="quiz" size={19} />{" "}
          <span className="max-sm:hidden">Cek pemahaman</span>
        </button>
        <button
          className="ak-btn primary max-sm:px-3"
          onClick={() => beginTour(0)}
        >
          <Icon name="flight_takeoff" size={19} /> Tur terbang
        </button>
      </div>
    </div>
  );

  const shell = (children: ReactNode) => (
    <div
      ref={appRef}
      className={`ak-app theme-play flex h-dvh flex-col ${full ? "is-full" : ""}`}
    >
      {header}
      {!tour && heading}
      {children}
      {guide && <Guide onClose={() => setGuide(false)} />}
    </div>
  );

  if (desktop) {
    if (immersive)
      return shell(
        <div
          className={`relative min-h-0 flex-1 ${full ? "" : "mx-4 mt-3 mb-4"}`}
        >
          <section aria-label="Tampilan 3D" className="absolute inset-0">
            {viewport}
          </section>
          {floatPanels && (
            <>
              <aside className="ak-card ak-scroll absolute top-[84px] bottom-4 left-4 w-[248px] overflow-y-auto p-4 shadow-[0_3px_0_#e7def2]">
                <ObjectNav />
              </aside>
              <aside
                aria-label="Panel belajar"
                className="ak-card ak-scroll absolute top-[84px] right-4 bottom-4 w-[364px] overflow-y-auto p-5 shadow-[0_3px_0_#e7def2]"
              >
                <button
                  onClick={() => setPanelOpen(false)}
                  aria-label="Tutup panel"
                  className="ak-icon-btn float-right -mt-1 -mr-1 ml-2 bg-[#F4EEFF]"
                >
                  <Icon name="close" />
                </button>
                <RightPanel />
              </aside>
            </>
          )}
        </div>,
      );
    return shell(
      <div className="grid min-h-0 flex-1 grid-cols-[240px_minmax(0,1fr)_minmax(320px,360px)] gap-4 px-4 pb-4 xl:grid-cols-[260px_minmax(0,1fr)_380px]">
        <aside className="ak-card min-h-0 p-4">
          <ObjectNav />
        </aside>
        <section aria-label="Tampilan 3D" className="min-h-0">
          {viewport}
        </section>
        <aside
          aria-label="Panel belajar"
          className="ak-card ak-scroll min-h-0 overflow-y-auto p-5"
        >
          <RightPanel />
        </aside>
      </div>,
    );
  }

  // Ponsel / tablet kecil: viewer penuh lebar + bottom sheet + drawer. Saat tur: viewer penuh, tanpa sheet.
  const sheetH = { ringkas: "22dvh", setengah: "46dvh", penuh: "86dvh" }[
    st.sheet
  ];
  return shell(
    <>
      <div className="relative min-h-0 flex-1">
        <div
          className={`absolute inset-0 ${full ? "" : "px-2 pb-2"}`}
          style={{ bottom: immersive || st.sheet === "penuh" ? "0" : sheetH }}
        >
          {viewport}
        </div>
        {!immersive && (
          <section
            aria-label="Panel belajar"
            className="absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[26px] border-2 border-b-0 border-[#ede3fa] bg-white shadow-[0_-10px_30px_rgba(43,29,78,.14)] transition-[height] duration-200"
            style={{
              height: sheetH,
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="flex items-center justify-center gap-1 pt-1.5">
              {(["ringkas", "setengah", "penuh"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => st.set({ sheet: s })}
                  aria-pressed={st.sheet === s}
                  aria-label={`Panel ${s}`}
                  className="flex min-h-9 min-w-11 items-center justify-center"
                >
                  <span
                    className={`h-1.5 rounded-full ${st.sheet === s ? "w-8 bg-[#8B45F5]" : "w-5 bg-line"}`}
                  />
                </button>
              ))}
            </div>
            <div className="ak-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <RightPanel />
            </div>
          </section>
        )}
      </div>
      {st.drawerOpen && (
        <div
          className="fixed inset-0 z-[70] bg-[rgba(43,29,78,.45)]"
          onClick={() => st.set({ drawerOpen: false })}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 left-0 w-[86vw] max-w-[340px] rounded-r-[26px] bg-white p-4"
            role="dialog"
            aria-label="Tujuan jelajah"
          >
            <ObjectNav />
          </div>
        </div>
      )}
    </>,
  );
}
