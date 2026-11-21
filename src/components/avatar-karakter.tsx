"use client";

// Avatar karakter anak (SVG kode) + pemilih avatar. Latar lingkaran mengikuti warna profil.

import { useState } from "react";
import { Icon } from "@/components/ui";
import { AKSESORI, AVATAR_AWAL, KULIT, RAMBUT, WARNA_HIJAB, WARNA_RAMBUT, bacaAvatar, tulisAvatar, type BentukAvatar } from "@/lib/avatar";
import { PLAY, type ColorKey } from "@/lib/catalog";

const INK = "#0b2545";
const BALOO = "var(--ff-baloo), system-ui, sans-serif";

/** Gambar wajah di viewBox 100 × 100 (tanpa latar). */
export function WajahKarakter({ b, baju }: { b: BentukAvatar; baju: string }) {
  const kulit = KULIT[b.kulit];
  const rambut = WARNA_RAMBUT[b.warna];
  const hijab = WARNA_HIJAB[b.warna];
  const r = b.rambut;
  return (
    <g>
      {/* rambut belakang */}
      {r === 2 && <path d="M25 50 C23 28 37 19 50 19 C63 19 77 28 75 50 L77 82 C70 84 66 80 66 76 L34 76 C34 80 30 84 23 82 Z" fill={rambut} />}
      {r === 4 && <path d="M21 56 C19 29 34 17 50 17 C66 17 81 29 79 56 C79 72 70 82 50 84 C30 82 21 72 21 56 Z" fill={hijab} stroke="#0b2545" strokeOpacity=".18" strokeWidth="1.5" />}
      {r === 3 && (
        <>
          <circle cx="23" cy="42" r="9" fill={rambut} />
          <circle cx="77" cy="42" r="9" fill={rambut} />
          <circle cx="29" cy="40" r="2.6" fill="#ff4fa3" />
          <circle cx="71" cy="40" r="2.6" fill="#ff4fa3" />
        </>
      )}
      {r === 6 && [24, 30, 38, 46, 54, 62, 70, 76].map((x, i) => <circle key={x} cx={x} cy={i === 0 || i === 7 ? 46 : i === 1 || i === 6 ? 34 : 26} r="9" fill={rambut} />)}

      {/* badan & leher */}
      <path d="M16 100 C16 82 31 75 50 75 C69 75 84 82 84 100 Z" fill={r === 4 ? hijab : baju} />
      <rect x="44" y="64" width="12" height="13" rx="4" fill={kulit} />
      {r === 4 && <path d="M30 74 C38 82 62 82 70 74 L74 90 L26 90 Z" fill={hijab} />}

      {/* telinga & wajah */}
      {r !== 4 && (
        <>
          <circle cx="28" cy="52" r="5" fill={kulit} />
          <circle cx="72" cy="52" r="5" fill={kulit} />
        </>
      )}
      <ellipse cx="50" cy="50" rx={r === 4 ? 19 : 22} ry={r === 4 ? 21 : 24} fill={kulit} />

      {/* rambut depan */}
      {(r === 0 || r === 3) && <path d="M27 50 C25 30 38 22 50 22 C63 22 76 30 73 50 C70 40 62 34 50 34 C40 34 31 40 27 50 Z" fill={rambut} />}
      {r === 1 && <path d="M27 48 L27 30 L36 33 L39 20 L47 29 L52 17 L57 29 L64 20 L66 33 L74 30 L73 48 C68 38 60 35 50 35 C40 35 32 38 27 48 Z" fill={rambut} />}
      {r === 2 && <path d="M27 47 C28 30 40 24 50 24 C60 24 72 30 73 47 C64 38 56 35 50 40 C44 35 36 38 27 47 Z" fill={rambut} />}
      {r === 4 && <path d="M30 45 C33 33 41 28 50 28 C59 28 67 33 70 45 C64 38 57 36 50 36 C43 36 36 38 30 45 Z" fill={hijab} />}
      {r === 5 && (
        <>
          <path d="M29 44 C27 34 38 28 50 28 C62 28 73 34 71 44 C66 40 58 38 50 38 C42 38 34 40 29 44 Z" fill={rambut} />
          <path d="M30 37 L31 22 C40 18 60 18 69 22 L70 37 C62 33 38 33 30 37 Z" fill="#1f2937" />
          <path d="M30.5 33 C40 30 60 30 69.5 33" stroke="#fdb724" strokeWidth="1.6" fill="none" />
        </>
      )}
      {r === 6 && <path d="M28 46 C30 34 40 30 50 30 C60 30 70 34 72 46 C64 40 56 38 50 38 C44 38 36 40 28 46 Z" fill={rambut} />}

      {/* wajah */}
      <circle cx="42" cy="52" r="2.8" fill={INK} />
      <circle cx="58" cy="52" r="2.8" fill={INK} />
      <circle cx="43" cy="51" r=".9" fill="#ffffff" />
      <circle cx="59" cy="51" r=".9" fill="#ffffff" />
      <ellipse cx="36" cy="59" rx="4" ry="2.4" fill="#ff8a8a" opacity=".45" />
      <ellipse cx="64" cy="59" rx="4" ry="2.4" fill="#ff8a8a" opacity=".45" />
      <path d="M44 60 Q50 67 56 60 Z" fill="#c92a3a" />

      {/* aksesori */}
      {b.aksesori === 1 && (
        <g fill="#ffffff" fillOpacity=".25" stroke={INK} strokeWidth="1.8">
          <circle cx="42" cy="52" r="6.5" />
          <circle cx="58" cy="52" r="6.5" />
          <path d="M48.5 51.5 Q50 50 51.5 51.5" fill="none" />
        </g>
      )}
      {b.aksesori === 2 && (
        <g fill="#ff4fa3">
          <path d="M60 27 L70 21 L70 33 Z" />
          <path d="M80 27 L70 21 L70 33 Z" />
          <circle cx="70" cy="27" r="2.6" fill="#d12a7c" />
        </g>
      )}
    </g>
  );
}

/** Avatar bulat: karakter di atas lingkaran warna profil. */
export function AvatarKarakter({ id, c, size, flat = false }: { id: string; c: ColorKey; size: number; flat?: boolean }) {
  const b = bacaAvatar(id) ?? AVATAR_AWAL;
  const [l, m, d] = PLAY[c];
  return (
    <span
      aria-hidden
      className="relative flex shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size, background: `linear-gradient(155deg, ${l}, ${m} 70%)`, boxShadow: flat ? undefined : `0 ${Math.max(2, Math.round(size * 0.06))}px 0 ${d}` }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <WajahKarakter b={b} baju={d} />
      </svg>
    </span>
  );
}

function Pilihan<T extends number>({ label, value, options, onChange, render }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void; render: (v: T, on: boolean) => React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1 text-[12px] font-black tracking-[0.08em] text-ink-3 uppercase">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)} className="rounded-[14px] transition-transform active:scale-95" style={{ outline: value === o ? `3px solid ${INK}` : "none", outlineOffset: 2 }}>
            {render(o, value === o)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const idx = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Pemilih avatar: kulit, rambut, warna, aksesori; pratinjau besar di atas. */
export function PilihAvatar({ awal, c, onSimpan, onBatal }: { awal?: string; c: ColorKey; onSimpan: (id: string) => void; onBatal?: () => void }) {
  const [b, setB] = useState<BentukAvatar>(bacaAvatar(awal) ?? AVATAR_AWAL);
  const ubah = (p: Partial<BentukAvatar>) => setB((x) => ({ ...x, ...p }));
  const kecil = (patch: Partial<BentukAvatar>) => (
    <span className="block overflow-hidden rounded-[14px] bg-white">
      <svg viewBox="12 14 76 76" width={52} height={52}>
        <WajahKarakter b={{ ...b, ...patch }} baju={PLAY[c][2]} />
      </svg>
    </span>
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <AvatarKarakter id={tulisAvatar(b)} c={c} size={120} />
      </div>
      <Pilihan label="Rambut" value={b.rambut} options={idx(RAMBUT.length)} onChange={(rambut) => ubah({ rambut })} render={(v) => kecil({ rambut: v })} />
      <Pilihan
        label={b.rambut === 4 ? "Warna hijab" : "Warna rambut"}
        value={b.warna}
        options={idx(WARNA_RAMBUT.length)}
        onChange={(warna) => ubah({ warna })}
        render={(v) => <span className="block size-10 rounded-full border-2 border-white shadow" style={{ background: b.rambut === 4 ? WARNA_HIJAB[v] : WARNA_RAMBUT[v] }} />}
      />
      <Pilihan label="Kulit" value={b.kulit} options={idx(KULIT.length)} onChange={(kulit) => ubah({ kulit })} render={(v) => <span className="block size-10 rounded-full border-2 border-white shadow" style={{ background: KULIT[v] }} />} />
      <Pilihan label="Aksesori" value={b.aksesori} options={idx(AKSESORI.length)} onChange={(aksesori) => ubah({ aksesori })} render={(v) => kecil({ aksesori: v })} />
      <div className="flex gap-2">
        {onBatal && (
          <button type="button" onClick={onBatal} className="h-12 flex-1 rounded-[16px] bg-white text-[15px] font-extrabold text-ink-2 shadow-[0_3px_0_rgba(11,37,69,.1)]">
            Batal
          </button>
        )}
        <button
          type="button"
          onClick={() => onSimpan(tulisAvatar(b))}
          className="inline-flex h-12 flex-[2] items-center justify-center gap-1.5 rounded-[16px] bg-[#0786eb] text-white shadow-[0_4px_0_#0567c2]"
          style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800 }}
        >
          <Icon name="check" size={22} /> Pakai avatar ini
        </button>
      </div>
    </div>
  );
}
