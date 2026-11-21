"use client";

// PIN pad anak & orang tua: 4 angka, atau 4 gambar untuk PAUD–TK. Dipakai di layar masuk, Ruang Orang Tua,
// dan saat membuat/mengganti PIN.

import { useEffect, useState } from "react";
import { MemberAvatar } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { GAMBAR_PIN, cekPinProfil } from "@/lib/profil";
import { supabase } from "@/lib/supabase/client";
import { setPin, useCloud } from "@/lib/supabase/family";
import type { Member } from "@/lib/store";

const INK = "#0b2545";
const BALOO = "var(--ff-baloo), system-ui, sans-serif";

function Titik({ n, goyang }: { n: number; goyang: boolean }) {
  return (
    <div className="flex justify-center gap-3.5" style={goyang ? { animation: "shake .4s" } : undefined} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="size-[18px] rounded-full transition-colors" style={{ background: i < n ? "#0786eb" : "#c9d6e6" }} />
      ))}
    </div>
  );
}

/** Papan tombol: angka 0–9, atau 9 gambar (= angka 1–9). */
export function PapanPin({ jenis, onTekan, onHapus, kiri }: { jenis: "angka" | "gambar"; onTekan: (d: string) => void; onHapus: () => void; kiri?: React.ReactNode }) {
  const tombol = "flex h-[60px] items-center justify-center rounded-[18px] bg-white shadow-[0_4px_0_rgba(11,37,69,.1)] transition-transform active:translate-y-0.5 active:scale-95";
  return (
    <div className="grid w-full max-w-[300px] grid-cols-3 gap-2.5">
      {jenis === "gambar"
        ? GAMBAR_PIN.map((g, i) => (
            <button key={g.ikon} type="button" aria-label={g.nama} onClick={() => onTekan(String(i + 1))} className={tombol}>
              <Icon name={g.ikon} size={34} style={{ color: g.warna }} />
            </button>
          ))
        : ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button key={d} type="button" onClick={() => onTekan(d)} className={tombol} style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: INK }}>
              {d}
            </button>
          ))}
      <span className="flex items-center justify-center">{kiri}</span>
      {jenis === "angka" ? (
        <button type="button" onClick={() => onTekan("0")} className={tombol} style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: INK }}>
          0
        </button>
      ) : (
        <span />
      )}
      <button type="button" aria-label="Hapus" onClick={onHapus} className="flex h-[60px] items-center justify-center rounded-[18px] text-[#0567c2] active:scale-95">
        <Icon name="backspace" size={28} />
      </button>
    </div>
  );
}

/** Ketik PIN satu profil; benar → onBenar. Keyboard fisik juga bisa dipakai (angka & Backspace). */
export function MasukPin({ m, judul, onBenar, kiri, onLupa }: { m: Member; judul: string; onBenar: () => void; kiri?: React.ReactNode; onLupa?: () => void }) {
  const [pin, setPinVal] = useState("");
  const [pesan, setPesan] = useState<string | null>(null);
  const [goyang, setGoyang] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const jenis = m.jenisPin ?? "angka";

  useEffect(() => {
    if (pin.length < 4 || sibuk) return;
    setSibuk(true);
    void cekPinProfil(m, pin).then((r) => {
      setSibuk(false);
      if (r.ok) return onBenar();
      setPinVal("");
      setGoyang(true);
      setTimeout(() => setGoyang(false), 420);
      setPesan(
        r.alasan === "terkunci"
          ? `Terlalu banyak salah. Coba lagi ${Math.ceil((r.sisa ?? 0) / 60000)} menit lagi${onLupa ? "" : ", atau minta Ayah atau Ibu membantu"}.`
          : r.alasan === "galat"
            ? "Belum tersambung ke server. Coba lagi."
            : `PIN belum cocok. Sisa ${r.sisa} kali coba.`,
      );
    });
  }, [pin, m, onBenar, onLupa, sibuk]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key) && jenis === "angka") setPinVal((p) => (p.length < 4 ? p + e.key : p));
      if (e.key === "Backspace") setPinVal((p) => p.slice(0, -1));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [jenis]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <MemberAvatar m={m} size={96} theme="playful" />
      <h1 className="text-center" style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: INK, lineHeight: 1.1 }}>
        {judul}
      </h1>
      <Titik n={pin.length} goyang={goyang} />
      <p role="status" className="min-h-[20px] text-center text-[14px] font-bold text-[#a34a00]">
        {sibuk ? "Memeriksa…" : pesan}
      </p>
      <PapanPin jenis={jenis} onTekan={(d) => setPinVal((p) => (p.length < 4 ? p + d : p))} onHapus={() => setPinVal((p) => p.slice(0, -1))} kiri={kiri} />
      {onLupa && (
        <button type="button" onClick={onLupa} className="text-[14px] font-extrabold text-[#0567c2] underline-offset-2 hover:underline">
          Lupa PIN?
        </button>
      )}
    </div>
  );
}

/** Buat atau ganti PIN: ketik dua kali, lalu disimpan ke server. */
export function BuatPin({ m, jenis, judul, onSelesai, kiri }: { m: Member; jenis: "angka" | "gambar"; judul: string; onSelesai: () => void; kiri?: React.ReactNode }) {
  const [pertama, setPertama] = useState<string | null>(null);
  const [pin, setPinVal] = useState("");
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  useEffect(() => {
    if (pin.length < 4 || sibuk) return;
    if (pertama === null) {
      setPertama(pin);
      setPinVal("");
      setPesan(null);
      return;
    }
    if (pin !== pertama) {
      setPertama(null);
      setPinVal("");
      setPesan("PIN kedua berbeda. Ulangi dari awal, ya.");
      return;
    }
    setSibuk(true);
    setPin(m.id, pin)
      .then(onSelesai)
      .catch((e: Error) => {
        setPertama(null);
        setPinVal("");
        setPesan(e.message || "PIN belum tersimpan. Coba lagi.");
      })
      .finally(() => setSibuk(false));
  }, [pin, pertama, m.id, onSelesai, sibuk]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <MemberAvatar m={m} size={88} theme="playful" />
      <h1 className="text-center" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK, lineHeight: 1.1 }}>
        {judul}
      </h1>
      <p className="text-center text-[14px] font-bold text-ink-2">{pertama === null ? `Pilih 4 ${jenis === "gambar" ? "gambar" : "angka"} rahasia.` : "Ketik sekali lagi untuk memastikan."}</p>
      <Titik n={pin.length} goyang={false} />
      <p role="status" className="min-h-[20px] text-center text-[14px] font-bold text-[#a34a00]">
        {sibuk ? "Menyimpan…" : pesan}
      </p>
      <PapanPin jenis={jenis} onTekan={(d) => setPinVal((p) => (p.length < 4 ? p + d : p))} onHapus={() => setPinVal((p) => p.slice(0, -1))} kiri={kiri} />
    </div>
  );
}

/** Lupa PIN orang tua: kata sandi akun rumah membuktikan pemiliknya, lalu PIN baru dibuat. */
export function LupaPin({ m, onSelesai, onBatal }: { m: Member; onSelesai: () => void; onBatal: () => void }) {
  const email = useCloud((s) => s.email);
  const [sandi, setSandi] = useState("");
  const [lolos, setLolos] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const login = email?.endsWith("@rumila.local") ? email.split("@")[0] : email;
  const bisaEmail = !!email && !email.endsWith("@rumila.local");
  const [terkirim, setTerkirim] = useState(false);
  const kirimTautan = async () => {
    if (!email) return;
    setSibuk(true);
    setPesan(null);
    const { error } = await supabase().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/masuk/sandi-baru` });
    setSibuk(false);
    if (error) setPesan(/rate limit|after \d+ seconds/i.test(error.message) ? "Tautan baru saja dikirim. Tunggu sebentar, lalu coba lagi." : "Tautan belum terkirim. Coba lagi.");
    else setTerkirim(true);
  };

  if (lolos) return <BuatPin m={m} jenis={m.jenisPin ?? "angka"} judul={`PIN baru untuk ${m.name}`} onSelesai={onSelesai} kiri={<button type="button" onClick={onBatal} className="text-[14px] font-extrabold text-[#0567c2]">Batal</button>} />;

  return (
    <form
      className="flex w-full max-w-[360px] flex-col gap-3 rounded-[26px] bg-white p-5 shadow-[0_5px_0_rgba(11,37,69,.08)]"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email || !sandi) return;
        setSibuk(true);
        setPesan(null);
        const { error } = await supabase().auth.signInWithPassword({ email, password: sandi });
        setSibuk(false);
        if (error) setPesan("Kata sandi belum cocok.");
        else setLolos(true);
      }}
    >
      <h1 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK, lineHeight: 1.1 }}>Lupa PIN {m.name}</h1>
      <p className="text-[14px] font-bold text-ink-2">
        Ketik kata sandi akun rumah <b>{login}</b> untuk membuat PIN baru.
      </p>
      <label htmlFor="lupa-sandi" className="text-[12px] font-black text-ink-2">
        Kata sandi akun
      </label>
      <input
        id="lupa-sandi"
        type="password"
        autoComplete="current-password"
        value={sandi}
        onChange={(e) => setSandi(e.target.value)}
        className="h-12 rounded-[14px] border-[1.5px] border-[#7d8da6] px-3 text-[16px] font-bold"
      />
      {pesan && <p className="text-[13px] font-bold text-[#c0283a]">{pesan}</p>}
      <button disabled={!sandi || sibuk} className="h-12 rounded-[16px] bg-[#0567c2] text-[16px] font-extrabold text-white disabled:opacity-50">
        {sibuk ? "Memeriksa…" : "Lanjut buat PIN baru"}
      </button>
      <button type="button" onClick={onBatal} className="h-10 text-[14px] font-extrabold text-[#0567c2]">
        Kembali
      </button>
      <p className="text-[12px] font-bold text-ink-3">Kata sandi akun rumah adalah yang dipakai saat pertama kali masuk di perangkat ini.</p>
      {terkirim ? (
        <p role="status" className="rounded-[14px] bg-[#e3f7f3] px-3 py-2 text-[13px] font-bold text-[#0b6b5f]">
          Tautan untuk membuat kata sandi baru sudah dikirim ke <b>{email}</b> dari kampus@pulaurinoya.com. Setelah kata sandi baru tersimpan,
          kembali ke sini dan ketik kata sandi itu.
        </p>
      ) : bisaEmail ? (
        <button type="button" disabled={sibuk} onClick={kirimTautan} className="text-[13px] font-extrabold text-[#0567c2] underline-offset-2 hover:underline disabled:opacity-50">
          Lupa kata sandi juga? Kirim tautan ke {email}
        </button>
      ) : (
        <p className="text-[12px] font-bold text-ink-3">
          Lupa kata sandi juga? Akun nama pengguna tidak punya email, jadi hubungi kampus@pulaurinoya.com.
        </p>
      )}
    </form>
  );
}
