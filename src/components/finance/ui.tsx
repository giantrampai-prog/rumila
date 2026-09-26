"use client";

// Komponen dasar modul Finance, ikut tema (Playful = Keuangan-Playful, Modern = Keuangan-Mobile).
// Semua layar Finance WAJIB pakai komponen & token di sini supaya dua tema tetap konsisten.

import type { CSSProperties, ReactNode } from "react";
import { Icon } from "@/components/ui";
import { FM, FP, accName, catInfo, rp, rs, type FinColor, type Tx } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";
import { useRumila } from "@/lib/store";

const BALOO = "var(--ff-baloo), system-ui, sans-serif";
const NUNITO = "var(--ff-nunito), system-ui, sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

export interface FinTokens {
  play: boolean;
  /** latar halaman */
  page: string;
  ink: string;
  ink2: string;
  muted: string;
  faint: string;
  /** latar isian / segmented / chip nonaktif */
  subtle: string;
  /** latar kotak info lembut */
  soft: string;
  line: string;
  pos: string;
  neg: string;
  head: string;
  body: string;
  headWeight: number;
  /** berat teks tebal (Playful 900, Modern 700) */
  bold: number;
  card: CSSProperties;
  primary: CSSProperties;
  sideOn: string;
  hero: string;
  heroShadow: string;
  /** warna aksen tautan / garis bersih (net) */
  accent: string;
  pal: Record<FinColor, [string, string, string]>;
}

const PLAYFUL: FinTokens = {
  play: true,
  page: "#fff8ee",
  ink: "#2b1d4e",
  ink2: "#4a3d66",
  muted: "#8a7a9c",
  faint: "#b3a48f",
  subtle: "#f5f0fa",
  soft: "#fff8ee",
  line: "#f1ecf7",
  pos: "#12904a",
  neg: "#c92a3a",
  head: BALOO,
  body: NUNITO,
  headWeight: 800,
  bold: 900,
  card: { background: "#fff", borderRadius: 24, boxShadow: "0 4px 0 rgba(43,29,78,.06)" },
  primary: { background: "linear-gradient(150deg,#7b6cff,#5b4bff)", color: "#fff", boxShadow: "0 4px 0 #3a2cd1" },
  sideOn: "#efeaff",
  hero: "linear-gradient(150deg,#7b6cff,#5b4bff 55%,#3a2cd1)",
  heroShadow: "0 6px 0 #2a1fa3, 0 18px 36px rgba(91,75,255,.3)",
  accent: "#5b4bff",
  pal: FP,
};

const MODERN: FinTokens = {
  play: false,
  page: "#f5f6f8",
  ink: "#0b0b0c",
  ink2: "#374151",
  muted: "#6b7280",
  faint: "#9ca3af",
  subtle: "#f1f2f4",
  soft: "#f5f6f8",
  line: "#e6e8ec",
  pos: "#2c6b4f",
  neg: "#9a3c35",
  head: INTER,
  body: INTER,
  headWeight: 700,
  bold: 700,
  card: { background: "#fff", borderRadius: 24, border: "1px solid #e6e8ec", boxShadow: "0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.04)" },
  primary: { background: "#ffc42e", color: "#0b0b0c" },
  sideOn: "#fff4d1",
  hero: "radial-gradient(120% 90% at 100% 0%, rgba(255,196,46,.22), transparent 55%), linear-gradient(150deg, #1a1a1a, #050505 70%)",
  heroShadow: "0 20px 40px rgba(16,24,40,.22)",
  accent: "#1a73e8",
  pal: FM,
};

export function useFT(): FinTokens {
  return useRumila((s) => s.theme) === "playful" ? PLAYFUL : MODERN;
}

/** Format nominal yang menghormati mode sembunyi (ikon mata). */
export function useMoney() {
  const hide = useFinance((s) => s.hide);
  return {
    hide,
    m: (n: number) => (hide ? "Rp ••••••" : rp(n)),
    s: (n: number) => (hide ? "Rp •••" : rs(n)),
  };
}

/** Ikon kategori/akun: Playful = gradien + bayangan, Modern = tint lembut + glyph gelap. */
export function FDot({ c, icon, size = 40, children }: { c: FinColor; icon?: string; size?: number; children?: ReactNode }) {
  const T = useFT();
  const [l, m, d] = T.pal[c];
  const style: CSSProperties = T.play
    ? { width: size, height: size, borderRadius: Math.round(size * 0.32), background: `linear-gradient(155deg, ${l}, ${m})`, color: "#fff", boxShadow: `0 3px 0 ${d}` }
    : { width: size, height: size, borderRadius: Math.round(size * 0.3), background: l + "38", color: d };
  return (
    <span aria-hidden className="flex shrink-0 items-center justify-center" style={style}>
      {icon ? <Icon name={icon} size={Math.round(size * 0.55)} /> : children}
    </span>
  );
}

export function FCard({ children, className = "", style, pad = 18 }: { children: ReactNode; className?: string; style?: CSSProperties; pad?: number }) {
  const T = useFT();
  return (
    <div className={className} style={{ ...T.card, padding: pad, ...style }}>
      {children}
    </div>
  );
}

export function FTitle({ children, right, as: As = "h2" }: { children: ReactNode; right?: ReactNode; as?: "h2" | "h3" }) {
  const T = useFT();
  return (
    <div className="flex items-center justify-between gap-2.5">
      <As style={{ fontFamily: T.head, fontSize: 19, fontWeight: T.headWeight, color: T.ink, letterSpacing: T.play ? 0 : "-.01em" }}>{children}</As>
      {right}
    </div>
  );
}

/** Judul halaman Finance + subjudul + aksi kanan. */
export function PageHead({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  const T = useFT();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="min-w-0 flex-1">
        <h1 style={{ fontFamily: T.head, fontSize: T.play ? 28 : 24, fontWeight: T.headWeight, color: T.ink, lineHeight: 1.1, letterSpacing: T.play ? 0 : "-.02em" }}>
          {title}
        </h1>
        {sub && <p style={{ fontSize: 13, fontWeight: T.play ? 800 : 600, color: T.muted, marginTop: 2 }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function FBtn({
  children,
  onClick,
  variant = "primary",
  icon,
  disabled,
  type = "button",
  className = "",
  style,
  title,
}: {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "soft" | "danger";
  icon?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  const T = useFT();
  const base: CSSProperties = { height: 44, borderRadius: 14, padding: children ? "0 16px" : 0, width: children ? undefined : 44, fontFamily: T.body, fontWeight: T.bold, fontSize: 14 };
  const v: Record<string, CSSProperties> = {
    primary: T.primary,
    ghost: { background: "#fff", color: T.ink, border: `1.5px solid ${T.play ? "#e6def0" : "#dfe2e7"}` },
    soft: { background: T.subtle, color: T.ink },
    danger: { background: "transparent", color: T.neg },
  };
  return (
    <button
      type={type}
      title={title}
      aria-label={!children ? title : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap transition-transform active:translate-y-px disabled:opacity-45 ${className}`}
      style={{ ...base, ...v[variant], ...style }}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
}

export function FSeg<V extends string | number>({ value, options, onChange }: { value: V; options: [V, string][]; onChange: (v: V) => void }) {
  const T = useFT();
  return (
    <div role="tablist" className="flex gap-[3px] p-[3px]" style={{ background: T.subtle, borderRadius: 12 }}>
      {options.map(([id, label]) => {
        const on = id === value;
        return (
          <button
            key={String(id)}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(id)}
            className="whitespace-nowrap transition-colors"
            style={{
              borderRadius: 9,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: T.play ? 900 : 600,
              fontFamily: T.body,
              background: on ? "#fff" : "transparent",
              color: on ? T.ink : T.muted,
              boxShadow: on ? (T.play ? "0 2px 0 rgba(43,29,78,.08)" : "0 1px 2px rgba(16,24,40,.08)") : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** Progress bar. pct 0–100+. */
export function FBar({ pct, c, color, height = 10 }: { pct: number; c?: FinColor; color?: string; height?: number }) {
  const T = useFT();
  const fill = color ?? (c ? T.pal[c][1] : T.accent);
  return (
    <div className="overflow-hidden rounded-full" style={{ height, background: T.subtle }}>
      <div className="anim-bar-x h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: fill }} />
    </div>
  );
}

/** Baris transaksi. `viewAcc` = sudut pandang akun (untuk transfer masuk/keluar). */
export function TxRow({ t, viewAcc, withBy }: { t: Tx; viewAcc?: string; withBy?: boolean }) {
  const T = useFT();
  const { m } = useMoney();
  const k = catInfo(t.type, t.cat);
  const date = `${t.d} Sep`;
  let sub: string;
  let amount: string;
  let color: string;
  if (t.type === "tf") {
    const pos = viewAcc && viewAcc === t.to;
    sub = `${accName(t.acc)} → ${accName(t.to)} · ${withBy ? t.by : date}`;
    amount = (viewAcc ? (pos ? "+ " : "− ") : "") + m(t.amt);
    color = viewAcc ? (pos ? T.pos : T.neg) : T.ink;
  } else {
    sub = `${t.cat} · ${accName(t.acc)} · ${withBy ? t.by : date}`;
    amount = (t.type === "in" ? "+ " : "− ") + m(t.amt);
    color = t.type === "in" ? T.pos : T.neg;
  }
  return (
    <div className="flex items-center gap-3 py-2.5">
      <FDot c={k.c} icon={k.icon} size={40} />
      <div className="min-w-0 flex-1">
        <div className="truncate" style={{ fontWeight: T.play ? 800 : 600, fontSize: 15, color: T.ink }}>
          {t.note}
        </div>
        <div className="truncate" style={{ fontSize: 12, fontWeight: T.play ? 800 : 600, color: T.muted }}>
          {sub}
        </div>
      </div>
      <div style={{ fontWeight: T.bold, fontSize: 14, color, whiteSpace: "nowrap" }}>{amount}</div>
    </div>
  );
}

export function FEmpty({ icon = "inbox", children }: { icon?: string; children: ReactNode }) {
  const T = useFT();
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center" style={{ color: T.muted, fontWeight: T.play ? 800 : 500 }}>
      <Icon name={icon} size={36} style={{ color: T.faint }} />
      {children}
    </div>
  );
}

/** Label kecil di atas input form. */
export function FLabel({ children }: { children: ReactNode }) {
  const T = useFT();
  return <span style={{ fontSize: 13, fontWeight: T.play ? 800 : 600, color: T.ink2 }}>{children}</span>;
}

/** Gaya input/select standar (tinggi 48). */
export function useInputStyle(): CSSProperties {
  const T = useFT();
  return {
    height: 48,
    borderRadius: 12,
    border: `1.5px solid ${T.play ? "#e6def0" : "#dfe2e7"}`,
    padding: "0 14px",
    background: "#fff",
    color: T.ink,
    fontFamily: T.body,
    fontWeight: T.play ? 700 : 500,
    fontSize: 15,
    outline: "none",
    width: "100%",
  };
}

/** Modal di tengah layar (desktop) / sheet bawah (mobile). */
export function FModal({ open, onClose, title, children, width = 520 }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; width?: number }) {
  const T = useFT();
  if (!open) return null;
  return (
    <div
      className="anim-fade fixed inset-0 z-[80] flex items-end justify-center desk:items-center desk:p-5"
      style={{ background: T.play ? "rgba(43,29,78,.45)" : "rgba(16,24,40,.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="anim-sheet grid max-h-[94vh] w-full grid-cols-[minmax(0,1fr)] gap-4 overflow-y-auto rounded-t-[28px] bg-white p-5 desk:rounded-[28px] desk:p-6"
        style={{ maxWidth: width, fontFamily: T.body, color: T.ink, boxShadow: "0 30px 80px rgba(16,24,40,.35)" }}
      >
        {title && (
          <div className="flex items-center justify-between gap-3">
            <h2 style={{ fontFamily: T.head, fontSize: 22, fontWeight: T.headWeight }}>{title}</h2>
            <button onClick={onClose} aria-label="Tutup" className="flex size-10 items-center justify-center rounded-xl" style={{ background: T.subtle, color: T.ink }}>
              <Icon name="close" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/** Grid responsif untuk daftar kartu di desktop. */
export const gridCards = "grid grid-cols-1 gap-[18px] desk:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] desk:items-start";
