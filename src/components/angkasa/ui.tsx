"use client";

// Komponen dasar panel Jelajah Angkasa — design system Rumila Playful (sama dengan Jelajah Tubuh):
// krem #FFF6E8, kartu putih ber-garis ungu muda, tombol "chunky", oranye = aksi utama, ungu = aktif. Target sentuh ≥44px.

import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { SRC } from "@/lib/angkasa/manifest";
import { fmtValue } from "@/lib/angkasa/sim";
import type { KeyFact } from "@/lib/angkasa/types";

export function Pill({
  children,
  tone = "teal",
}: {
  children: ReactNode;
  tone?: "teal" | "coral" | "navy" | "gray";
}) {
  const t = {
    teal: "bg-[#F1EAFF] text-[#7541D8]",
    coral: "bg-coral-tint text-coral-deep",
    navy: "bg-ink text-white",
    gray: "bg-fill text-ink-2",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${t}`}
    >
      {children}
    </span>
  );
}

export function Tabs<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex border-b border-line"
    >
      {options.map(([id, text]) => {
        const on = id === value;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(id)}
            className={`min-h-11 flex-1 border-b-2 px-2 text-sm font-semibold transition-colors ${on ? "border-teal text-[#7541D8]" : "border-transparent text-ink-3 hover:text-ink"}`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "outline",
  icon,
  disabled,
  className = "",
  pressed,
  title,
}: {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "dark";
  icon?: string;
  disabled?: boolean;
  className?: string;
  pressed?: boolean;
  title?: string;
}) {
  const v = { primary: "primary", outline: "", ghost: "quiet", dark: "dark" }[
    variant
  ];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      title={title}
      aria-label={!children ? title : undefined}
      className={`ak-btn ${v} ${className}`}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
}

/** Baris fakta: nilai + satuan dari data; definisi besaran, sumber, dan status tersedia. */
export function FactRow({ f }: { f: KeyFact }) {
  const [open, setOpen] = useState(false);
  const q = f.qty;
  const src = SRC.get(q.sourceId);
  const value =
    q.value === null
      ? "tidak diketahui"
      : `${q.approx && /^(sekitar|dibulatkan|perkiraan)$/.test(q.approx) ? "± " : ""}${fmtValue(q.value, f.format)}${f.format === "hours-days" ? "" : " " + q.unit}`;
  return (
    <div className="border-b border-line-soft py-2.5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-baseline justify-between gap-3 text-left"
      >
        <span className="text-sm text-ink-3">{f.label}</span>
        <span className="text-right text-sm font-bold text-ink">
          {value}
          <Icon
            name={open ? "expand_less" : "info"}
            size={15}
            className="ml-1 align-[-2px] text-ink-4"
          />
        </span>
      </button>
      {open && (
        <div className="mt-1.5 rounded-lg bg-page px-3 py-2 text-xs leading-relaxed text-ink-2">
          <div>
            <b>Besaran:</b> {q.quantityDefinition}
          </div>
          {q.approx && !/^(sekitar|dibulatkan|perkiraan)$/.test(q.approx) && (
            <div>
              <b>Catatan:</b> {q.approx}
            </div>
          )}
          <div>
            <b>Sumber:</b>{" "}
            {src ? (
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                {src.publisher} — {src.title}
              </a>
            ) : (
              q.sourceId
            )}
            {q.sourceUpdatedAt && <> · data per {q.sourceUpdatedAt}</>}
          </div>
          <div>
            <b>Ditinjau:</b> {q.reviewedAt} · <b>Status:</b>{" "}
            {q.reviewStatus === "sumber-dicek"
              ? "dicocokkan ke sumber"
              : "draf, perlu ditinjau"}
          </div>
        </div>
      )}
    </div>
  );
}

export function SourceList({ ids }: { ids: string[] }) {
  return (
    <details className="group rounded-xl border border-line px-3 py-2">
      <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink-2">
        Sumber materi
        <Icon
          name="expand_more"
          size={20}
          className="transition-transform group-open:rotate-180"
        />
      </summary>
      <ul className="mt-1 space-y-1 pb-1 text-xs">
        {ids.map((id) => {
          const s = SRC.get(id);
          return s ? (
            <li key={id}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#7541D8] underline underline-offset-2"
              >
                {s.publisher}: {s.title}
              </a>{" "}
              <span className="text-ink-4">· dicek {s.checkedAt}</span>
            </li>
          ) : null;
        })}
      </ul>
    </details>
  );
}

/** Dengarkan: suara hanya setelah tindakan pengguna (Web Speech API, bahasa Indonesia). */
export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  useEffect(
    () => () => {
      if (supported) window.speechSynthesis.cancel();
    },
    [supported],
  );
  const speak = (text: string) => {
    if (!supported) return false;
    window.speechSynthesis.cancel();
    if (speaking) {
      setSpeaking(false);
      return true;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
    return true;
  };
  return { speak, speaking, supported };
}

export function Note({
  children,
  icon = "info",
}: {
  children: ReactNode;
  icon?: string;
}) {
  return (
    <p className="flex gap-2 rounded-xl bg-page px-3 py-2.5 text-xs leading-relaxed text-ink-2">
      <Icon name={icon} size={16} className="mt-px shrink-0 text-ink-3" />
      <span>{children}</span>
    </p>
  );
}

/** Slider berlabel (target sentuh besar). */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
  marks,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
  marks?: number[];
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm font-semibold text-ink-2">
        {label}
        <span className="text-ink">
          {Math.round(value)}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-11 w-full accent-[#8B45F5]"
      />
      {marks && (
        <span className="flex justify-between text-[11px] text-ink-4">
          {marks.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChange(m)}
              className="min-h-8 px-1 hover:text-ink"
            >
              {m}
              {suffix}
            </button>
          ))}
        </span>
      )}
    </label>
  );
}
