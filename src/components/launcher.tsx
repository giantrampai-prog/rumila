"use client";

// Tampilan website (desktop ≥880px) — acuan: "Family Launcher v2", tema Playful & Modern.

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { ALL_TOOLS, CAT, FOLDERS, PLAY, canonicalToolId, getTool, matchesTool, type ColorKey, type Folder, type PermKey, type Tool } from "@/lib/catalog";
import { greeting } from "@/lib/format";
import { can, useMe, useRumila, useUI, type Member, type Theme } from "@/lib/store";
import { Icon, PlayCtx } from "./ui";
import { EducationTopics } from './education-topics';

const NV = "#1F3044"; // ink Modern
const PI = "#2b1d4e"; // ink Playful
export const PJ = "var(--font-jakarta), system-ui, sans-serif";
export const BALOO = "var(--ff-baloo), system-ui, sans-serif";
export const NUNITO = "var(--ff-nunito), system-ui, sans-serif";

/** Rumila memakai satu tema saja (Playful, untuk anak). */
export function useTheme(): Theme {
  return "playful";
}

/* ---------------- latar halaman ---------------- */

export function LauncherBackdrop() {
  const play = useTheme() === "playful";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {play ? (
        <>
          <div className="absolute -top-[140px] -left-[120px] size-[420px] rounded-full bg-[#ffd23f] opacity-55 blur-[40px]" />
          <div className="absolute top-[120px] -right-[100px] size-[360px] rounded-full bg-[#7ad7ff] opacity-50 blur-[40px]" />
          <div className="absolute -bottom-[220px] left-[35%] size-[420px] rounded-full bg-[#ff8fc7] opacity-40 blur-[50px]" />
        </>
      ) : (
        <>
          <div className="absolute -top-[220px] -left-[200px] size-[560px] rounded-full bg-[#FF7F67] opacity-[.10] blur-[100px]" />
          <div className="absolute -right-[180px] -bottom-[180px] size-[520px] rounded-full bg-[#52B8A8] opacity-[.12] blur-[100px]" />
        </>
      )}
    </div>
  );
}

/* ---------------- ikon alat ---------------- */

export function AppIcon({ t, size, theme }: { t: Tool; size: number; theme: Theme }) {
  if (theme === "modern") {
    const [tint, , deep] = t.planned ? ['#ededf0', '#a0a0aa', '#686873'] : CAT[t.g];
    return (
      <div
        className="relative flex shrink-0 items-center justify-center overflow-hidden"
        style={{ width: size, height: size, borderRadius: Math.round(size * 0.3), background: tint }}
      >
        <div className="pointer-events-none absolute -right-[18%] -bottom-[18%] size-[60%] rounded-full bg-white/55" />
        <span className="ms relative" style={{ fontSize: Math.round(size * 0.46), color: deep }}>
          {t.icon}
        </span>
      </div>
    );
  }
  const [l, m, d] = t.planned ? ['#c9c9d0', '#9999a3', '#73737e'] : PLAY[t.g];
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        background: `linear-gradient(155deg, ${l} 0%, ${m} 55%, ${d} 100%)`,
        boxShadow: `0 ${Math.round(size * 0.06)}px 0 ${d}, 0 ${Math.round(size * 0.14)}px ${Math.round(size * 0.2)}px ${m}55`,
      }}
    >
      <div className="pointer-events-none absolute top-[5%] left-[8%] h-[45%] w-[84%] rounded-full bg-gradient-to-b from-white/55 to-white/0" />
      <span
        className="ms relative text-white"
        style={{ fontSize: Math.round(size * 0.56), filter: `drop-shadow(0 ${Math.max(2, Math.round(size * 0.03))}px 0 ${d})` }}
      >
        {t.icon}
      </span>
    </div>
  );
}

function tagStyle(c: ColorKey, theme: Theme): CSSProperties {
  return theme === "modern"
    ? { fontSize: 12, fontWeight: 600, color: CAT[c][2], background: CAT[c][0], padding: "4px 10px", borderRadius: 999 }
    : {
        fontSize: 12,
        fontWeight: 900,
        color: PLAY[c][2],
        background: PLAY[c][0] + "55",
        padding: "4px 10px",
        borderRadius: 999,
        fontFamily: NUNITO,
      };
}

/* ---------------- avatar anggota ---------------- */

/** Avatar anggota sesuai tema: Modern = lingkaran + ring tint; Playful = gradien glossy + bayangan tebal. */
export function MemberAvatar({ m, size, theme }: { m: Member; size: number; theme: Theme }) {
  const initial = m.name.replace(/^(Kak|Dek|Om|Tante) /, "")[0]?.toUpperCase() ?? "?";
  if (theme === "modern") {
    const [tint, main] = CAT[m.c];
    return (
      <span
        aria-hidden
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: main,
          color: m.c === "gold" ? NV : "#fff",
          fontSize: Math.round(size * 0.4),
          fontWeight: 700,
          boxShadow: `0 0 0 ${Math.round(size * 0.07)}px ${tint}`,
        }}
      >
        {initial}
      </span>
    );
  }
  const [l, mm, d] = PLAY[m.c];
  return (
    <span
      aria-hidden
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(155deg, ${l}, ${mm} 60%, ${d})`,
        fontFamily: BALOO,
        fontSize: Math.round(size * 0.46),
        fontWeight: 800,
        boxShadow: `0 ${Math.round(size * 0.06)}px 0 ${d}, 0 ${Math.round(size * 0.15)}px ${Math.round(size * 0.25)}px ${mm}55`,
      }}
    >
      <span className="absolute top-[6%] left-[10%] h-[42%] w-[80%] rounded-full bg-gradient-to-b from-white/50 to-white/0" />
      <span className="relative">{initial}</span>
    </span>
  );
}

/* ---------------- header ---------------- */

const NAV_BTNS: { href: string; icon: string; label: string; perm?: PermKey }[] = [
  { href: "/laporan", icon: "insights", label: "Laporan", perm: "laporan" },
  { href: "/saya", icon: "manage_accounts", label: "Rumah & anggota" },
];

export function LauncherHeader() {
  const theme = useTheme();
  const play = theme === "playful";
  const me = useMe();
  const members = useRumila((s) => s.members);
  const setTheme = useRumila((s) => s.setTheme);
  const signOut = useRumila((s) => s.signOut);
  const switchMember = useRumila((s) => s.switchMember);
  const router = useRouter();
  const path = usePathname();
  const [hello, setHello] = useState("Halo");
  const [date, setDate] = useState("");
  useEffect(() => {
    setHello(greeting());
    setDate(new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, []);

  const pickMember = (m: Member) => {
    if (m.id === me.id) return;
    if (m.pin) {
      signOut();
      router.replace(`/masuk?id=${m.id}`);
      return;
    }
    switchMember(m.id);
    router.push("/beranda");
  };

  const box = (on = false): CSSProperties =>
    play
      ? {
          width: 48,
          height: 48,
          borderRadius: 16,
          background: on ? "#ff7a1a" : "#fff",
          color: on ? "#fff" : PI,
          boxShadow: on ? "0 4px 0 #d95a00" : "0 4px 0 rgba(43,29,78,.1)",
        }
      : {
          width: 46,
          height: 46,
          borderRadius: 14,
          background: on ? NV : "#fff",
          color: on ? "#fff" : NV,
          border: `1px solid ${on ? NV : "#ece9e3"}`,
        };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <Link
          href="/beranda"
          aria-label="Beranda"
          className="flex size-[60px] shrink-0 items-center justify-center rounded-[18px] bg-white"
          style={{ boxShadow: play ? "0 4px 0 rgba(43,29,78,.1)" : "0 1px 2px rgba(31,48,68,.04), 0 8px 20px rgba(31,48,68,.06)" }}
        >
          <Image src="/brand/rumila-mark.png" alt="Rumila" width={46} height={42} priority />
        </Link>
        <div className="flex flex-col">
          <h1
            className="leading-none"
            style={
              play
                ? { fontFamily: BALOO, fontSize: 32, fontWeight: 800, color: PI, letterSpacing: "-.01em" }
                : { fontSize: 26, fontWeight: 800, color: NV, letterSpacing: "-.025em" }
            }
          >
            {hello}, {me.name}!
          </h1>
          <div
            className="mt-1"
            style={
              play
                ? { fontFamily: NUNITO, fontSize: 15, fontWeight: 700, color: "#8a7a9c" }
                : { fontSize: 14, fontWeight: 500, color: "#7A8494" }
            }
          >
            {date}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {/* Pill anggota: aktif tampil nama, lainnya inisial */}
        <div
          className="flex items-center gap-2 rounded-full bg-white p-1.5"
          style={{ boxShadow: play ? "0 4px 0 rgba(43,29,78,.1)" : "none", border: play ? 0 : "1px solid #ece9e3" }}
          role="group"
          aria-label="Ganti profil"
        >
          {members.map((m) => {
            const on = m.id === me.id;
            const cm = CAT[m.c];
            const cp = PLAY[m.c];
            return (
              <button
                key={m.id}
                onClick={() => pickMember(m)}
                title={m.pin && !on ? `${m.name} · pakai PIN` : m.name}
                aria-pressed={on}
                className="flex items-center gap-2 rounded-full transition-all duration-200"
                style={
                  play
                    ? {
                        padding: on ? "4px 16px 4px 4px" : 4,
                        background: on ? cp[0] + "66" : "transparent",
                        color: cp[2],
                        font: `900 15px ${NUNITO}`,
                      }
                    : { padding: on ? "3px 14px 3px 3px" : 3, background: on ? cm[0] : "transparent", color: NV, font: `600 14px ${PJ}` }
                }
              >
                <span
                  className="flex items-center justify-center rounded-full"
                  style={
                    play
                      ? {
                          width: 40,
                          height: 40,
                          background: `linear-gradient(155deg, ${cp[0]}, ${cp[1]})`,
                          color: "#fff",
                          fontFamily: BALOO,
                          fontSize: 20,
                          fontWeight: 800,
                          boxShadow: `0 3px 0 ${cp[2]}`,
                        }
                      : { width: 36, height: 36, background: cm[1], color: m.c === "gold" ? NV : "#fff", fontSize: 15, fontWeight: 700 }
                  }
                >
                  {m.name.replace(/^(Kak|Dek|Om|Tante) /, "")[0]}
                </span>
                {on && m.name}
              </button>
            );
          })}
        </div>

        <ThemeSwitch theme={theme} onChange={setTheme} />

        {NAV_BTNS.filter((n) => !n.perm || can(me, n.perm)).map((n) => {
          const on = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              title={n.label}
              aria-label={n.label}
              aria-current={on ? "page" : undefined}
              className="flex items-center justify-center transition-transform hover:-translate-y-0.5"
              style={box(on)}
            >
              <Icon name={n.icon} size={play ? 26 : 22} />
            </Link>
          );
        })}
        <button
          onClick={() => {
            signOut();
            router.replace("/masuk");
          }}
          title="Keluar"
          aria-label="Keluar"
          className="flex items-center justify-center transition-transform hover:-translate-y-0.5"
          style={{ ...box(), color: play ? "#c92a3a" : "#B5434A" }}
        >
          <Icon name="logout" size={play ? 26 : 22} />
        </button>
      </div>
    </header>
  );
}

export function ThemeSwitch({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  const play = theme === "playful";
  const opts: [Theme, string, string, string][] = [
    ["playful", "Playful", "toys", "Tema ceria untuk anak"],
    ["modern", "Modern", "auto_awesome", "Tema elegan modern"],
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Tema tampilan"
      className="flex gap-1 rounded-full bg-white p-1"
      style={{ boxShadow: play ? "0 4px 0 rgba(43,29,78,.1)" : "none", border: play ? 0 : "1px solid #ece9e3" }}
    >
      {opts.map(([id, label, icon, title]) => {
        const on = theme === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={on}
            title={title}
            onClick={() => onChange(id)}
            className="flex items-center gap-1.5 rounded-full transition-all duration-200"
            style={
              play
                ? {
                    padding: "9px 14px",
                    font: `800 14px ${NUNITO}`,
                    background: on ? "#ff7a1a" : "transparent",
                    color: on ? "#fff" : "#8a7a9c",
                    boxShadow: on ? "0 3px 0 #d95a00" : "none",
                  }
                : { padding: "8px 14px", font: `600 13px ${PJ}`, background: on ? NV : "transparent", color: on ? "#fff" : "#4F5B6B" }
            }
          >
            <Icon name={icon} size={18} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- search + chip ---------------- */

export function LauncherNav({ active }: { active: string | null }) {
  const theme = useTheme();
  const play = theme === "playful";
  const me = useMe();
  const query = useUI((s) => s.query);
  const setQuery = useUI((s) => s.setQuery);
  const allowed = FOLDERS.filter((f) => can(me, f.id));
  const q = query.trim();

  const chip = (on: boolean, c: ColorKey): CSSProperties =>
    play
      ? {
          borderRadius: 16,
          padding: "11px 18px",
          font: `800 16px ${NUNITO}`,
          background: on ? PLAY[c][1] : "#fff",
          color: on ? "#fff" : PLAY[c][2],
          boxShadow: `0 4px 0 ${on ? PLAY[c][2] : "rgba(43,29,78,.1)"}`,
        }
      : {
          borderRadius: 999,
          padding: "9px 16px",
          font: `600 14px ${PJ}`,
          background: on ? NV : "#fff",
          color: on ? "#fff" : "#3F4A5A",
          border: `1px solid ${on ? NV : "#ece9e3"}`,
        };

  return (
    <>
      <div
        className="flex items-center gap-3.5 bg-white"
        style={
          play
            ? {
                borderRadius: 24,
                padding: "14px 16px 14px 22px",
                border: "3px solid #fff",
                boxShadow: "0 6px 0 rgba(43,29,78,.1), 0 20px 40px rgba(255,120,60,.12)",
              }
            : {
                borderRadius: 20,
                padding: "10px 12px 10px 18px",
                border: "1px solid #ece9e3",
                boxShadow: "0 1px 2px rgba(31,48,68,.04), 0 10px 28px rgba(31,48,68,.05)",
              }
        }
      >
        <Icon name="search" size={play ? 32 : 24} style={{ color: play ? "#ff7a45" : "#7A8494" }} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder="Mau main atau belajar apa hari ini?"
          aria-label="Cari alat"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#b3a48f]"
          style={play ? { fontFamily: NUNITO, fontSize: 22, fontWeight: 700, color: PI } : { fontSize: 17, fontWeight: 500, color: NV }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Hapus pencarian"
            className="flex size-10 items-center justify-center rounded-[14px]"
            style={{ background: play ? "#fff0e4" : "#F3F1ED", color: play ? "#ff7a45" : NV }}
          >
            <Icon name="close" />
          </button>
        )}
      </div>

      <nav aria-label="Kategori" className="flex gap-2.5 overflow-x-auto px-0.5 pt-0.5 pb-2">
        <Link
          href="/beranda"
          onClick={() => setQuery("")}
          className="flex shrink-0 items-center gap-2 whitespace-nowrap transition-transform hover:-translate-y-0.5"
          style={chip(!active && !q, "orange")}
        >
          <Icon name="apps" size={20} />
          Semua
        </Link>
        {allowed.map((f) => (
          <Link
            key={f.id}
            href={`/beranda/${f.id}`}
            onClick={() => setQuery("")}
            aria-current={active === f.id ? "page" : undefined}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap transition-transform hover:-translate-y-0.5"
            style={chip(active === f.id && !q, f.c)}
          >
            <Icon name={f.icon} size={20} />
            {f.name}
          </Link>
        ))}
      </nav>
    </>
  );
}

/* ---------------- kartu alat (folder & hasil cari) ---------------- */

function ToolCard({ t, theme, onOpen, showTag }: { t: Tool; theme: Theme; onOpen: () => void; showTag?: boolean }) {
  const play = theme === "playful";
  return (
    <button
      onClick={onOpen}
      className={`flex flex-col items-center transition-transform duration-200 hover:-translate-y-[5px] ${t.planned ? 'grayscale' : ''}`}
      style={
        play
          ? {
              gap: 16,
              padding: "24px 14px 20px",
              borderRadius: 28,
              background: "#fff",
              boxShadow: `0 6px 0 ${PLAY[t.c][0]}88, 0 14px 30px rgba(43,29,78,.08)`,
            }
          : {
              gap: 14,
              padding: "24px 14px 20px",
              borderRadius: 24,
              background: "#fff",
              border: "1px solid #ece9e3",
              boxShadow: "0 1px 2px rgba(31,48,68,.04), 0 10px 28px rgba(31,48,68,.05)",
            }
      }
    >
      <AppIcon t={t} size={play ? 92 : 80} theme={theme} />
      <span
        className="text-center leading-[1.2] text-balance"
        style={play ? { fontFamily: NUNITO, fontSize: 17, fontWeight: 800, color: PI } : { fontSize: 15, fontWeight: 700, color: NV }}
      >
        {t.name}
      </span>
      {t.folder === 'edukasi' && <span className="text-center text-xs leading-relaxed text-[#686873]">{t.desc}</span>}
      {t.planned && <span className="mt-auto rounded-full bg-[#ededf0] px-3 py-1 text-[11px] font-bold text-[#62626d]">Segera hadir</span>}
      {showTag && <span style={tagStyle(t.c, theme)}>{t.folderName}</span>}
    </button>
  );
}

function useSearchResults() {
  const me = useMe();
  const query = useUI((s) => s.query);
  const q = query.trim().toLowerCase();
  return {
    q: query.trim(),
    results: q ? ALL_TOOLS.filter((a) => can(me, a.folder) && matchesTool(a, q)) : [],
  };
}

function SearchResults({ open }: { open: (t: Tool) => void }) {
  const theme = useTheme();
  const play = theme === "playful";
  const { q, results } = useSearchResults();
  return (
    <>
      <h2 style={play ? { fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: PI } : { fontSize: 20, fontWeight: 800, color: NV }}>
        Ketemu {results.length} hasil
      </h2>
      {results.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-[18px]">
          {results.map((t) => (
            <ToolCard key={t.id} t={t} theme={theme} onOpen={() => open(t)} showTag />
          ))}
        </div>
      ) : (
        <p
          className="py-12 text-center"
          style={play ? { fontFamily: NUNITO, fontSize: 18, fontWeight: 700, color: "#8a7a9c" } : { fontSize: 16, color: "#7A8494" }}
        >
          Yah, belum ada yang cocok dengan “{q}”.
        </p>
      )}
    </>
  );
}

/* ---------------- Beranda ---------------- */

export function LauncherHome({ open }: { open: (t: Tool) => void }) {
  const theme = useTheme();
  const play = theme === "playful";
  const me = useMe();
  const activity = useRumila((s) => s.activity);
  const { q } = useSearchResults();
  const allowed = FOLDERS.filter((f) => can(me, f.id));

  // Favorit = 6 alat paling sering dibuka anggota aktif (dari activity_log).
  const favs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of activity) if (a.memberId === me.id && (!a.event || a.event === "session")) {
      const id = canonicalToolId(a.toolId);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return [...counts]
      .map(([id, n]) => ({ t: getTool(id), n }))
      .filter((x): x is { t: Tool; n: number } => !!x.t && can(me, x.t.folder))
      .sort((a, b) => b.n - a.n)
      .slice(0, 6)
      .map((x) => x.t);
  }, [activity, me]);

  return (
    <>
      <LauncherNav active={null} />
      {q ? (
        <SearchResults open={open} />
      ) : (
        <>
          {favs.length > 0 && (
            <section
              className="bg-white"
              style={
                play
                  ? { borderRadius: 28, padding: "20px 22px 12px", boxShadow: "0 6px 0 rgba(43,29,78,.08)" }
                  : {
                      borderRadius: 28,
                      padding: "20px 22px 12px",
                      border: "1px solid #ece9e3",
                      boxShadow: "0 1px 2px rgba(31,48,68,.04), 0 12px 32px rgba(31,48,68,.05)",
                    }
              }
            >
              <h2
                className="flex items-center gap-2"
                style={
                  play ? { fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: PI } : { fontSize: 18, fontWeight: 800, color: NV }
                }
              >
                <Icon name="star" size={play ? 26 : 22} style={{ color: play ? "#ffb300" : "#FDC23E" }} />
                Favorit {me.name}
              </h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-1">
                {favs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => open(t)}
                    className="flex flex-col items-center gap-2.5 rounded-[20px] px-1 py-3 transition-transform duration-150 hover:-translate-y-1 hover:scale-[1.04]"
                  >
                    <AppIcon t={t} size={play ? 84 : 72} theme={theme} />
                    <span
                      className="text-center leading-[1.2] text-balance"
                      style={
                        play
                          ? { fontFamily: NUNITO, fontSize: 15, fontWeight: 800, color: PI }
                          : { fontSize: 14, fontWeight: 700, color: NV }
                      }
                    >
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
            {allowed.map((f) => (
              <FolderCard key={f.id} f={f} theme={theme} />
            ))}
          </div>
          {allowed.length < FOLDERS.length && (
            <p
              className="text-center text-sm"
              style={{ color: play ? "#8a7a9c" : "#9AA1AC", fontFamily: play ? NUNITO : PJ, fontWeight: play ? 700 : 500 }}
            >
              {FOLDERS.length - allowed.length} menu disembunyikan oleh Admin
            </p>
          )}
        </>
      )}
    </>
  );
}

function FolderCard({ f, theme }: { f: Folder; theme: Theme }) {
  const play = theme === "playful";
  const c = play ? PLAY[f.c] : CAT[f.c];
  return (
    <Link
      href={`/beranda/${f.id}`}
      className="relative flex min-h-[230px] flex-col gap-[18px] overflow-hidden p-[18px] text-left transition-transform duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] hover:-translate-y-1.5 hover:-rotate-1"
      style={
        play
          ? {
              borderRadius: 32,
              background: `linear-gradient(155deg, ${c[0]} 0%, ${c[1]} 60%)`,
              boxShadow: `0 8px 0 ${c[2]}, 0 20px 36px ${c[1]}55`,
            }
          : {
              borderRadius: 28,
              background: "#fff",
              border: "1px solid #ece9e3",
              boxShadow: "0 1px 2px rgba(31,48,68,.04), 0 12px 32px rgba(31,48,68,.05)",
            }
      }
    >
      <div
        aria-hidden
        className="absolute rounded-full"
        style={
          play
            ? { width: 180, height: 180, right: -60, bottom: -70, background: "rgba(255,255,255,.18)" }
            : { width: 170, height: 170, right: -56, bottom: -70, background: c[0] }
        }
      />
      <div className="relative grid w-full grid-cols-3 gap-2">
        {f.items.slice(0, 6).map((a) => (
          <div
            key={a.id}
            className="flex aspect-square items-center justify-center rounded-[14px]"
            style={play ? { background: "#fff", boxShadow: "0 3px 0 rgba(0,0,0,.12)" } : { background: CAT[a.g][0] }}
          >
            <span className="ms" style={{ fontSize: play ? 30 : 24, color: play ? PLAY[a.g][1] : CAT[a.g][2] }}>
              {a.icon}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-auto flex w-full items-end justify-between gap-2">
        <div
          style={
            play
              ? { fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.05, textShadow: "0 2px 0 rgba(0,0,0,.12)" }
              : { fontSize: 18, fontWeight: 800, color: NV, lineHeight: 1.1, letterSpacing: "-.015em" }
          }
        >
          {f.name}
        </div>
        <div
          className="shrink-0 rounded-full px-2.5 py-1"
          style={
            play
              ? { background: "rgba(255,255,255,.95)", color: PI, fontSize: 13, fontWeight: 900, fontFamily: NUNITO }
              : { background: "#fff", color: c[2], fontSize: 12, fontWeight: 700, border: `1px solid ${c[0]}` }
          }
        >
          {f.items.length}
        </div>
      </div>
    </Link>
  );
}

/* ---------------- halaman folder ---------------- */

export function LauncherFolder({ f, open }: { f: Folder; open: (t: Tool) => void }) {
  const theme = useTheme();
  const play = theme === "playful";
  const { q } = useSearchResults();
  const c = play ? PLAY[f.c] : CAT[f.c];

  return (
    <>
      <LauncherNav active={f.id} />
      {q ? (
        <SearchResults open={open} />
      ) : (
        <>
          <div
            className="relative flex flex-wrap items-center gap-5 overflow-hidden px-7 py-6"
            style={
              play
                ? { borderRadius: 32, background: `linear-gradient(135deg, ${c[0]}, ${c[1]} 70%)`, boxShadow: `0 8px 0 ${c[2]}` }
                : { borderRadius: 28, background: `linear-gradient(120deg, ${c[0]} 0%, #fff 78%)`, border: "1px solid #ece9e3" }
            }
          >
            <div
              aria-hidden
              className="absolute rounded-full"
              style={
                play
                  ? { width: 260, height: 260, right: -40, top: -120, background: "rgba(255,255,255,.18)" }
                  : { width: 240, height: 240, right: -60, top: -110, background: c[0], opacity: 0.8 }
              }
            />
            <Link
              href="/beranda"
              aria-label="Kembali ke Beranda"
              className="relative flex shrink-0 items-center justify-center bg-white"
              style={
                play
                  ? { width: 52, height: 52, borderRadius: 18, boxShadow: "0 4px 0 rgba(0,0,0,.15)", color: PI }
                  : { width: 46, height: 46, borderRadius: 14, border: "1px solid #ece9e3", color: NV }
              }
            >
              <Icon name="arrow_back" size={play ? 28 : 24} />
            </Link>
            <div
              className="relative flex shrink-0 items-center justify-center bg-white"
              style={
                play
                  ? { width: 84, height: 84, borderRadius: 26, boxShadow: "0 5px 0 rgba(0,0,0,.15)", transform: "rotate(-6deg)" }
                  : { width: 76, height: 76, borderRadius: 24, border: "1px solid #ece9e3" }
              }
            >
              <span className="ms" style={{ fontSize: play ? 52 : 42, color: play ? c[1] : c[2] }}>
                {f.icon}
              </span>
            </div>
            <div className="relative flex min-w-0 flex-1 flex-col gap-1">
              <h2
                style={
                  play
                    ? {
                        fontFamily: BALOO,
                        fontSize: 40,
                        fontWeight: 800,
                        color: "#fff",
                        lineHeight: 1,
                        textShadow: "0 3px 0 rgba(0,0,0,.12)",
                      }
                    : { fontSize: 32, fontWeight: 800, color: NV, lineHeight: 1.05, letterSpacing: "-.03em" }
                }
              >
                {f.name}
              </h2>
              <p
                className="text-pretty"
                style={play ? { fontFamily: NUNITO, fontSize: 17, fontWeight: 700, color: "#fff" } : { fontSize: 15, color: "#4F5B6B" }}
              >
                {f.desc}
              </p>
            </div>
            <div
              className="relative shrink-0 rounded-full bg-white px-4 py-2"
              style={
                play
                  ? { color: PI, fontWeight: 900, fontSize: 15, fontFamily: NUNITO }
                  : { color: NV, fontWeight: 700, fontSize: 14, border: "1px solid #ece9e3" }
              }
            >
              {f.items.length} {f.id === 'edukasi' ? 'kategori' : 'isi'}
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-[18px]">
            {f.items.map((t) => (
              <ToolCard key={t.id} t={t} theme={theme} onOpen={() => open(t)} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ---------------- modal alat ---------------- */

export function AppModal({ toolId, onClose }: { toolId: string; onClose: () => void }) {
  const theme = useTheme();
  const play = theme === "playful";
  const me = useMe();
  const logOpen = useRumila((s) => s.logOpen);
  const showToast = useUI((s) => s.showToast);
  const t = getTool(toolId);
  if (!t) return null;
  const fc = play ? PLAY[t.c] : CAT[t.c];

  const start = () => {
    logOpen(t.id);
    onClose();
    showToast(`Membuka ${t.name}…`);
  };

  return (
    <div
      onClick={onClose}
      className="anim-fade fixed inset-0 z-[60] flex items-center justify-center p-5"
      style={{
        background: play ? "rgba(43,29,78,.45)" : "rgba(31,48,68,.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.name}
        onClick={(e) => e.stopPropagation()}
        className="anim-sheet mt-[60px] flex w-full max-w-[420px] flex-col items-center gap-3 bg-white text-center"
        style={
          play
            ? { borderRadius: 36, padding: "32px 32px 30px", boxShadow: `0 10px 0 ${fc[1]}, 0 40px 80px rgba(43,29,78,.35)` }
            : { borderRadius: 32, padding: "32px 32px 28px", boxShadow: "0 40px 80px rgba(31,48,68,.25)" }
        }
      >
        <div
          style={{
            marginTop: play ? -84 : -76,
            transform: "rotate(-5deg)",
            ...(play ? {} : { border: "5px solid #fff", borderRadius: 38, boxShadow: "0 14px 34px rgba(31,48,68,.14)" }),
          }}
        >
          <AppIcon t={t} size={play ? 128 : 112} theme={theme} />
        </div>
        <span style={tagStyle(t.c, theme)}>{t.folderName}</span>
        <h2
          style={
            play
              ? { fontFamily: BALOO, fontSize: 32, fontWeight: 800, color: PI, lineHeight: 1.05 }
              : { fontSize: 26, fontWeight: 800, color: NV, letterSpacing: "-.025em" }
          }
        >
          {t.name}
        </h2>
        <p
          className="text-pretty"
          style={
            play
              ? { fontFamily: NUNITO, fontSize: 17, fontWeight: 600, color: "#6b5d80", lineHeight: 1.5 }
              : { fontSize: 15, color: "#4F5B6B", lineHeight: 1.55 }
          }
        >
          {t.desc}{!t.planned && <> Progres {me.name} tersimpan otomatis dan muncul di Laporan.</>}
        </p>
        {t.planned && <EducationTopics tool={t} />}
        <div className="mt-2.5 flex gap-3">
          <button
            autoFocus={t.planned}
            onClick={onClose}
            style={
              play
                ? {
                    borderRadius: 18,
                    padding: "14px 24px",
                    font: `800 17px ${NUNITO}`,
                    background: "#f1ecf7",
                    color: PI,
                    boxShadow: "0 4px 0 #d9d0e6",
                  }
                : {
                    borderRadius: 14,
                    padding: "13px 24px",
                    font: `600 15px ${PJ}`,
                    background: "#fff",
                    color: NV,
                    border: "1px solid #ece9e3",
                  }
            }
          >
            {t.planned ? 'Tutup' : 'Nanti'}
          </button>
          {!t.planned && <button
            autoFocus
            onClick={start}
            style={
              play
                ? {
                    borderRadius: 18,
                    padding: "14px 26px",
                    font: `900 17px ${NUNITO}`,
                    background: fc[1],
                    color: "#fff",
                    boxShadow: `0 4px 0 ${fc[2]}`,
                  }
                : { borderRadius: 14, padding: "13px 24px", font: `700 15px ${PJ}`, background: NV, color: "#fff" }
            }
          >
            Ayo mulai!
          </button>}
        </div>
      </div>
    </div>
  );
}

/** Kerangka halaman website: latar tema + header + konten max 1180px. `overlay` (toast, sheet) ikut tema. */
export function LauncherFrame({ children, overlay }: { children: ReactNode; overlay?: ReactNode }) {
  const play = useTheme() === "playful";
  return (
    <PlayCtx.Provider value={play}>
      <div
        className={`relative min-h-dvh px-6 pt-8 pb-12 ${play ? "bg-dots theme-play" : "bg-page"}`}
        style={{ fontFamily: play ? NUNITO : PJ }}
      >
        <LauncherBackdrop />
        <div className="relative mx-auto flex max-w-[1180px] flex-col gap-[22px]">
          <LauncherHeader />
          {children}
        </div>
        {overlay}
      </div>
    </PlayCtx.Provider>
  );
}
