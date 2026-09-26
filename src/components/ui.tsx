"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { CAT, PLAY, type ColorKey } from "@/lib/catalog";
import { initialOf } from "@/lib/format";

export function Icon({
  name,
  size = 22,
  className = "",
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span aria-hidden className={`ms ${className}`} style={{ fontSize: size, ...style }}>
      {name}
    </span>
  );
}

/** true di dalam kerangka website bertema Playful — komponen dasar ikut berganti gaya. */
export const PlayCtx = createContext(false);
export const usePlay = () => useContext(PlayCtx);

/** Tile ikon: bg tint, glyph deep, radius 30–32% ukuran, glyph 50%. Playful: gradien glossy + bayangan tebal. */
export function Tile({ c, icon, size = 44, radius = 0.3 }: { c: ColorKey; icon: string; size?: number; radius?: number }) {
  const play = usePlay();
  if (play) {
    const [l, m, d] = PLAY[c];
    return (
      <span
        aria-hidden
        className="ms relative flex shrink-0 items-center justify-center overflow-hidden text-white"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.32),
          background: `linear-gradient(155deg, ${l}, ${m} 60%, ${d})`,
          boxShadow: `0 ${Math.max(2, Math.round(size * 0.07))}px 0 ${d}`,
          fontSize: Math.round(size * 0.52),
        }}
      >
        {icon}
      </span>
    );
  }
  const [tint, , deep] = CAT[c];
  return (
    <span
      aria-hidden
      className="ms flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * radius),
        background: tint,
        color: deep,
        fontSize: Math.round(size * 0.5),
      }}
    >
      {icon}
    </span>
  );
}

/** Avatar anggota: lingkaran warna main + ring 7% tint. */
export function Avatar({ c, name, size = 46, initial }: { c: ColorKey; name: string; size?: number; initial?: string }) {
  const play = usePlay();
  if (play) {
    const [l, m, d] = PLAY[c];
    return (
      <span
        aria-hidden
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full text-white"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(155deg, ${l}, ${m} 60%, ${d})`,
          fontFamily: "var(--ff-baloo)",
          fontWeight: 800,
          fontSize: Math.round(size * 0.46),
          boxShadow: `0 ${Math.max(2, Math.round(size * 0.06))}px 0 ${d}`,
        }}
      >
        <span className="absolute top-[6%] left-[10%] h-[42%] w-[80%] rounded-full bg-gradient-to-b from-white/50 to-white/0" />
        <span className="relative">{initial ?? initialOf(name)}</span>
      </span>
    );
  }
  const [tint, main] = CAT[c];
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full font-extrabold"
      style={{
        width: size,
        height: size,
        background: main,
        color: c === "gold" ? "#1F3044" : "#fff",
        fontSize: Math.round(size * 0.4),
        boxShadow: `0 0 0 ${Math.round(size * 0.07)}px ${tint}`,
      }}
    >
      {initial ?? initialOf(name)}
    </span>
  );
}

export function RoleBadge({ admin }: { admin: boolean }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${admin ? "bg-ink text-gold" : "bg-fill text-ink-2"}`}>
      {admin ? "Admin" : "User"}
    </span>
  );
}

export function Switch({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className="relative h-6 w-[42px] shrink-0 rounded-full transition-colors duration-200"
      style={{ background: on ? "var(--teal)" : "#dcd8d0" }}
    >
      <span className="absolute top-[3px] size-[18px] rounded-full bg-white transition-[left] duration-200" style={{ left: on ? 21 : 3 }} />
    </span>
  );
}

export function Card({ children, className = "", radius = 22 }: { children: ReactNode; className?: string; radius?: number }) {
  const play = usePlay();
  return (
    <div
      className={`${play ? "" : "border border-line"} bg-surface ${className}`}
      style={{ borderRadius: play ? radius + 4 : radius, boxShadow: play ? "0 5px 0 rgba(43,29,78,.07)" : undefined }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-[17px] font-extrabold tracking-[-0.015em]">{children}</h2>
      {right && <div className="text-xs font-semibold text-ink-4">{right}</div>}
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="flex gap-[3px] rounded-xl bg-fill p-[3px]" data-seg>
      {options.map(([id, label]) => {
        const on = id === value;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(id)}
            className={`rounded-[9px] px-3 py-[7px] text-[13px] font-semibold transition-colors ${on ? "bg-white text-ink shadow-[0_1px_2px_rgba(31,48,68,.1)]" : "text-ink-3"}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export const listRow = "flex w-full items-center gap-3 border-b border-line-soft py-3 text-left last:border-b-0";
