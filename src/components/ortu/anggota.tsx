"use client";

// Ruang Orang Tua → Anggota & PIN: daftarkan anak, ganti avatar, buat/ubah/reset PIN (angka atau gambar),
// kunci tablet ini ke satu anak, dan buka pengaturan lengkap (izin menu, jenjang, peran).

import { useEffect, useState, type ReactNode } from "react";
import { ACTIVE_LEVELS, levelMeta, type LevelId } from "@akademi/schema";
import { PilihAvatar } from "@/components/avatar-karakter";
import { BALOO, MemberAvatar } from "@/components/launcher";
import { BuatPin } from "@/components/pin-pad";
import { Icon } from "@/components/ui";
import { levelAnak, setPeranAkademi, useProfilAkademiVersi } from "@/lib/akademi/konten";
import { aturJenjangAwal } from "@/lib/akademi/siswa";
import { PLAY, MEMBER_COLORS, type ColorKey } from "@/lib/catalog";
import { isOrangTua, perangkatAnak, setPerangkatAnak } from "@/lib/profil";
import { tungguSinkron } from "@/lib/supabase/family";
import { useRumila, useUI, type Member } from "@/lib/store";

const INK = "#0b2545";
const KARTU = "rounded-[22px] bg-white shadow-[0_4px_0_rgba(11,37,69,.06)]";
const TOMBOL = "inline-flex h-9 items-center gap-1.5 rounded-full bg-[#e3f1fd] px-3 text-[13px] font-extrabold text-[#0567c2] transition-transform active:scale-95";

/** Jendela di tengah layar, muat di layar kecil (isi bisa digulir). */
function Jendela({ judul, onTutup, children }: { judul: string; onTutup: () => void; children: ReactNode }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onTutup();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onTutup]);
  return (
    <div role="dialog" aria-modal="true" aria-label={judul} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0b2545]/60 p-4" onClick={onTutup}>
      <div className="flex max-h-full w-full max-w-[440px] flex-col overflow-hidden rounded-[28px] bg-[#fff8ee]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-5 pt-4">
          <h2 className="flex-1" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 800, color: INK }}>
            {judul}
          </h2>
          <button onClick={onTutup} aria-label="Tutup" className="flex size-10 items-center justify-center rounded-full bg-white">
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pt-3 pb-5">{children}</div>
      </div>
    </div>
  );
}

function PilihJenisPin({ value, onChange }: { value: "angka" | "gambar"; onChange: (v: "angka" | "gambar") => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(
        [
          ["angka", "PIN angka", "pin", "4 angka · SD"],
          ["gambar", "PIN gambar", "pets", "4 gambar · PAUD–TK"],
        ] as const
      ).map(([id, label, ikon, sub]) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className="flex flex-col items-start gap-1 rounded-[16px] border-2 p-3 text-left"
          style={{ borderColor: value === id ? "#0567c2" : "#f0e4d2", background: value === id ? "#e3f1fd" : "#fff" }}
        >
          <Icon name={ikon} size={24} />
          <span className="text-[14px] font-extrabold">{label}</span>
          <span className="text-[12px] font-bold text-ink-3">{sub}</span>
        </button>
      ))}
    </div>
  );
}

/** Ganti / buat PIN satu anggota; anak boleh memilih PIN angka atau gambar. */
function UbahPin({ m, onSelesai }: { m: Member; onSelesai: () => void }) {
  const updateMember = useRumila((s) => s.updateMember);
  const anak = !isOrangTua(m);
  const [jenis, setJenis] = useState<"angka" | "gambar">(anak ? (m.jenisPin ?? "angka") : "angka");
  const [lanjut, setLanjut] = useState(!anak);
  if (!lanjut)
    return (
      <div className="flex flex-col gap-3">
        <p className="text-[14px] font-bold text-ink-2">Pilih jenis PIN untuk {m.name}.</p>
        <PilihJenisPin value={jenis} onChange={setJenis} />
        <button onClick={() => setLanjut(true)} className="h-12 rounded-[16px] bg-[#0567c2] text-[16px] font-extrabold text-white">
          Lanjut
        </button>
      </div>
    );
  return (
    <BuatPin
      m={{ ...m, jenisPin: jenis }}
      jenis={jenis}
      judul={m.pin ? `PIN baru ${m.name}` : `Buat PIN ${m.name}`}
      onSelesai={() => {
        if (jenis !== (m.jenisPin ?? "angka")) updateMember(m.id, { jenisPin: jenis });
        onSelesai();
      }}
    />
  );
}

/** Daftarkan anak: nama & warna → avatar → jenjang → PIN. */
function DaftarAnak({ onSelesai }: { onSelesai: () => void }) {
  const addMember = useRumila((s) => s.addMember);
  const members = useRumila((s) => s.members);
  const showToast = useUI((s) => s.showToast);
  const [langkah, setLangkah] = useState<"data" | "avatar" | "jenjang" | "pin">("data");
  const [nama, setNama] = useState("");
  const [c, setC] = useState<ColorKey>(MEMBER_COLORS.find((x) => !members.some((m) => m.c === x)) ?? "orange");
  const [jenis, setJenis] = useState<"angka" | "gambar">("angka");
  const [avatar, setAvatar] = useState<string | undefined>();
  const [id, setId] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const baru = members.find((m) => m.id === id);

  if (langkah === "data")
    return (
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (nama.trim()) setLangkah("avatar");
        }}
      >
        <label htmlFor="anak-nama" className="text-[12px] font-black text-ink-2">
          Nama panggilan
        </label>
        <input id="anak-nama" autoFocus value={nama} maxLength={24} onChange={(e) => setNama(e.target.value)} placeholder="mis. Raka" className="h-12 rounded-[14px] border-[1.5px] border-[#7d8da6] bg-white px-3 text-[16px] font-bold" />
        <span className="text-[12px] font-black text-ink-2">Warna profil</span>
        <div className="flex flex-wrap gap-2">
          {MEMBER_COLORS.map((x) => (
            <button key={x} type="button" aria-label={x} aria-pressed={c === x} onClick={() => setC(x)} className="size-10 rounded-full" style={{ background: PLAY[x][1], outline: c === x ? `3px solid ${INK}` : "none", outlineOffset: 2 }} />
          ))}
        </div>
        <span className="text-[12px] font-black text-ink-2">Jenis PIN</span>
        <PilihJenisPin value={jenis} onChange={setJenis} />
        <button disabled={!nama.trim()} className="h-12 rounded-[16px] bg-[#0567c2] text-[16px] font-extrabold text-white disabled:opacity-50">
          Lanjut pilih avatar
        </button>
      </form>
    );

  if (langkah === "avatar")
    return (
      <PilihAvatar
        awal={avatar}
        c={c}
        onBatal={() => setLangkah("data")}
        onSimpan={(a) => {
          setAvatar(a);
          setLangkah("jenjang");
        }}
      />
    );

  if (langkah === "jenjang")
    return (
      <div className="flex flex-col gap-3">
        <p className="text-[14px] font-bold text-ink-2">Jenjang awal {nama.trim()}. Belum yakin? Pilih Tes Penempatan, nanti jenjangnya ditentukan dari hasil tes.</p>
        <div className="grid grid-cols-3 gap-2">
          {ACTIVE_LEVELS.map((l) => (
            <button
              key={l}
              disabled={sibuk}
              onClick={() => void buat(l)}
              className="rounded-[14px] bg-white px-2 py-2.5 text-[13px] font-extrabold shadow-[0_2px_0_rgba(11,37,69,.08)] disabled:opacity-50"
            >
              {levelMeta(l).lokal}
            </button>
          ))}
        </div>
        <button disabled={sibuk} onClick={() => void buat(null)} className="h-12 rounded-[16px] bg-[#fd861d] text-[16px] font-extrabold text-[#0b2545] disabled:opacity-50">
          Tes Penempatan
        </button>
        {sibuk && <p className="text-center text-[13px] font-bold text-ink-3">Menyimpan profil…</p>}
      </div>
    );

  return baru ? <BuatPin m={baru} jenis={jenis} judul={`Buat PIN ${baru.name}`} onSelesai={onSelesai} /> : <p className="text-[14px] font-bold text-ink-3">Menyiapkan profil…</p>;

  async function buat(level: LevelId | null) {
    setSibuk(true);
    const idBaru = addMember(nama.trim(), c, { avatar, peran: "anak", jenisPin: jenis });
    setPeranAkademi(idBaru, "anak");
    await tungguSinkron();
    if (level) {
      const r = await aturJenjangAwal(idBaru, level);
      if (!r.ok) showToast("Jenjang belum tersimpan. Atur lagi lewat tombol Atur.");
    }
    setSibuk(false);
    setId(idBaru);
    setLangkah("pin");
  }
}

function BarisAnggota({ m, onAvatar, onPin }: { m: Member; onAvatar: () => void; onPin: () => void }) {
  const openSheet = useUI((s) => s.openSheet);
  const versi = useProfilAkademiVersi();
  const [level, setLevel] = useState<LevelId>("PAUD");
  const [tablet, setTablet] = useState<string | null>(null);
  useEffect(() => setLevel(levelAnak(m.id)), [m.id, versi]);
  useEffect(() => setTablet(perangkatAnak()), []);
  const ortu = isOrangTua(m);
  const keterangan = [ortu ? (m.admin ? "Orang tua · admin" : "Orang tua") : `Anak · ${levelMeta(level).lokal}`, m.pin ? (m.jenisPin === "gambar" ? "PIN gambar" : "PIN angka") : "Belum ada PIN"].join(" · ");
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-[18px] bg-[#f4f7fb] p-3">
      <button onClick={onAvatar} aria-label={`Ganti avatar ${m.name}`} className="relative transition-transform active:scale-95">
        <MemberAvatar m={m} size={52} theme="playful" />
        <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-white text-[#0567c2] shadow">
          <Icon name="edit" size={14} />
        </span>
      </button>
      <span className="min-w-[150px] flex-1">
        <span className="block truncate text-[15px] font-extrabold">{m.name}</span>
        <span className="block text-[12.5px] font-bold" style={{ color: m.pin ? "#5b6b85" : "#a34a00" }}>
          {keterangan}
        </span>
      </span>
      <span className="flex w-full flex-wrap gap-1.5 md:w-auto">
        <button onClick={onPin} className={TOMBOL}>
          <Icon name="pin" size={18} /> {m.pin ? (ortu ? "Ubah PIN" : "Reset PIN") : "Buat PIN"}
        </button>
        {!ortu && (
          <button
            onClick={() => {
              const baru = tablet === m.id ? null : m.id;
              setPerangkatAnak(baru);
              setTablet(baru);
            }}
            aria-pressed={tablet === m.id}
            className={TOMBOL}
            style={tablet === m.id ? { background: "#0567c2", color: "#fff" } : undefined}
          >
            <Icon name="tablet_android" size={18} /> {tablet === m.id ? "Tablet ini milik " + m.name : "Kunci tablet ini"}
          </button>
        )}
        <button onClick={() => openSheet({ kind: "edit", memberId: m.id })} className={TOMBOL}>
          <Icon name="tune" size={18} /> Atur
        </button>
      </span>
    </li>
  );
}

export function AnggotaRumah() {
  const members = useRumila((s) => s.members);
  const updateMember = useRumila((s) => s.updateMember);
  const showToast = useUI((s) => s.showToast);
  const [jendela, setJendela] = useState<{ kind: "avatar" | "pin"; id: string } | { kind: "daftar" } | null>(null);
  const target = jendela && jendela.kind !== "daftar" ? members.find((m) => m.id === jendela.id) : undefined;
  const ortu = members.filter(isOrangTua);
  const anak = members.filter((m) => !isOrangTua(m));
  const tutup = () => setJendela(null);

  return (
    <div className="flex flex-col gap-4">
      {[
        ["Anak", anak],
        ["Orang tua", ortu],
      ].map(([judul, daftar]) =>
        (daftar as Member[]).length ? (
          <section key={judul as string} className={`${KARTU} flex flex-col gap-3 p-4`}>
            <h2 style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>{judul as string}</h2>
            <ul className="flex flex-col gap-2">
              {(daftar as Member[]).map((m) => (
                <BarisAnggota key={m.id} m={m} onAvatar={() => setJendela({ kind: "avatar", id: m.id })} onPin={() => setJendela({ kind: "pin", id: m.id })} />
              ))}
            </ul>
          </section>
        ) : null,
      )}
      <button
        onClick={() => setJendela({ kind: "daftar" })}
        className="inline-flex h-14 items-center justify-center gap-2 rounded-[20px] bg-[#0786eb] text-white shadow-[0_4px_0_#0567c2] transition-transform active:scale-[.98]"
        style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}
      >
        <Icon name="person_add" size={24} /> Daftarkan anak
      </button>
      <p className="text-[13px] font-bold text-ink-3">PIN anak dipakai di layar &quot;Siapa yang belajar?&quot;. Tablet yang dikunci ke satu anak langsung menampilkan PIN anak itu.</p>

      {jendela?.kind === "daftar" && (
        <Jendela judul="Daftarkan anak" onTutup={tutup}>
          <DaftarAnak
            onSelesai={() => {
              tutup();
              showToast("Anak terdaftar. Sekarang bisa masuk dengan PIN-nya.");
            }}
          />
        </Jendela>
      )}
      {jendela?.kind === "avatar" && target && (
        <Jendela judul={`Avatar ${target.name}`} onTutup={tutup}>
          <PilihAvatar
            awal={target.avatar}
            c={target.c}
            onBatal={tutup}
            onSimpan={(avatar) => {
              updateMember(target.id, { avatar });
              tutup();
            }}
          />
        </Jendela>
      )}
      {jendela?.kind === "pin" && target && (
        <Jendela judul={target.pin ? `PIN ${target.name}` : `Buat PIN ${target.name}`} onTutup={tutup}>
          <UbahPin
            m={target}
            onSelesai={() => {
              tutup();
              showToast(`PIN ${target.name} tersimpan.`);
            }}
          />
        </Jendela>
      )}
    </div>
  );
}
