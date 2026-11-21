// Kebijakan Privasi RINOYA Academy — halaman publik tanpa login (dibutuhkan App Store & Play Store).
// Isi mengikuti data yang benar-benar dikumpulkan aplikasi; perbarui TANGGAL bila isinya berubah.

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — RINOYA Academy",
  description: "Data apa yang dikumpulkan RINOYA Academy, untuk apa, dan bagaimana orang tua mengelola atau menghapusnya.",
};

const TANGGAL = "21 November 2026";
const KONTAK = "kampus@pulaurinoya.com";

function Bagian({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[19px] font-extrabold" style={{ fontFamily: "var(--ff-baloo), system-ui, sans-serif" }}>
        {judul}
      </h2>
      <div className="flex flex-col gap-2 text-[15px] leading-relaxed text-[#33475f]">{children}</div>
    </section>
  );
}

export default function KebijakanPrivasi() {
  return (
    <main className="min-h-screen bg-[#FFF8EE] px-4 py-8 sm:py-12" style={{ fontFamily: "var(--ff-nunito), system-ui, sans-serif", color: "#0b2545" }}>
      <article className="mx-auto flex max-w-[760px] flex-col gap-6 rounded-[28px] bg-white px-5 py-7 shadow-[0_6px_0_rgba(11,37,69,.06)] sm:px-9 sm:py-10">
        <header className="flex flex-col gap-1">
          <p className="text-[13px] font-extrabold tracking-wide text-[#0786eb] uppercase">RINOYA Academy</p>
          <h1 className="text-[30px] leading-tight font-extrabold" style={{ fontFamily: "var(--ff-baloo), system-ui, sans-serif" }}>
            Kebijakan Privasi
          </h1>
          <p className="text-[13px] font-bold text-[#6b7c93]">Berlaku sejak {TANGGAL}</p>
        </header>

        <p className="text-[15px] leading-relaxed text-[#33475f]">
          RINOYA Academy (&quot;kami&quot;) adalah layanan belajar untuk anak usia PAUD sampai SD kelas 6, dikelola oleh Rampai Group. Layanan ini dipakai lewat
          situs <b>kampus.pulaurinoya.com</b> dan aplikasi RINOYA di Android dan iOS. Kebijakan ini menjelaskan data apa yang kami kumpulkan, untuk apa,
          dan bagaimana orang tua atau wali mengelolanya. Kami menyusunnya dengan mengacu pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.
        </p>

        <Bagian judul="1. Akun dibuat oleh orang tua">
          <p>
            Akun RINOYA dibuat dan dikelola oleh orang tua atau wali (akun rumah). Anak tidak membuat akun sendiri; orang tua menambahkan profil anak
            dari Ruang Orang Tua. Dengan membuat profil anak, orang tua menyatakan setuju data anak diproses sesuai kebijakan ini.
          </p>
        </Bagian>

        <Bagian judul="2. Data yang kami kumpulkan">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <b>Akun orang tua:</b> email atau nama pengguna dan kata sandi. Kata sandi disimpan dalam bentuk tersandi (hash), bukan teks asli.
            </li>
            <li>
              <b>Profil keluarga dan anak:</b> nama panggilan, gambar avatar, jenjang belajar, PIN profil, dan tanggal lahir anak bila diisi orang tua
              (dipakai untuk menampilkan umur di rapor dan sertifikat).
            </li>
            <li>
              <b>Progres belajar:</b> kegiatan yang dimainkan, jawaban benar atau salah, lama mengerjakan, bintang, hasil ujian, kompetensi yang dikuasai,
              dan sertifikat. Data ini dipakai untuk menyesuaikan tingkat kesulitan dan menyusun rapor.
            </li>
            <li>
              <b>Langganan dan pembayaran:</b> paket yang dipilih, status masa aktif, dan foto bukti transfer yang diunggah orang tua. Kami tidak
              menyimpan nomor kartu atau data rekening orang tua.
            </li>
            <li>
              <b>Penyimpanan di perangkat:</b> pengaturan seperti musik nyala/mati dan progres sementara disimpan di perangkat (penyimpanan lokal
              peramban) supaya aplikasi tetap lancar saat sinyal lemah.
            </li>
          </ul>
          <p>
            Kami <b>tidak</b> menampilkan iklan, <b>tidak</b> memakai pelacak iklan atau analitik pihak ketiga, <b>tidak</b> meminta lokasi, kamera,
            mikrofon, atau kontak, dan <b>tidak</b> menjual data siapa pun.
          </p>
        </Bagian>

        <Bagian judul="3. Untuk apa data dipakai">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Menjalankan layanan: masuk akun, menyimpan progres, dan menyinkronkan progres antarperangkat.</li>
            <li>Menyesuaikan soal dengan kemampuan anak dan menyusun rapor, ujian, serta sertifikat untuk orang tua.</li>
            <li>Memeriksa pembayaran langganan dan mengaktifkan masa langganan.</li>
            <li>Mengirim email penting kepada orang tua, misalnya tautan atur ulang kata sandi.</li>
            <li>Memperbaiki masalah teknis dan menjaga keamanan layanan.</li>
          </ul>
        </Bagian>

        <Bagian judul="4. Pihak yang membantu kami">
          <p>Data disimpan dan diproses oleh penyedia layanan yang bekerja atas nama kami, hanya untuk keperluan di atas:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <b>Supabase</b>: basis data, login, dan penyimpanan berkas (termasuk bukti transfer di penyimpanan privat).
            </li>
            <li>
              <b>Vercel</b>: hosting situs dan aplikasi.
            </li>
            <li>
              <b>Resend</b>: pengiriman email dari {KONTAK}.
            </li>
          </ul>
          <p>Data dapat disimpan di server di luar Indonesia milik penyedia tersebut, dengan perlindungan keamanan yang setara.</p>
        </Bagian>

        <Bagian judul="5. Keamanan dan lama penyimpanan">
          <p>
            Data dikirim lewat koneksi terenkripsi (HTTPS) dan akses ke data keluarga dibatasi hanya untuk akun keluarga itu. Data disimpan selama akun
            aktif. Bila akun dihapus, data akun, profil anak, dan progres belajar dihapus dalam 30 hari, kecuali catatan pembayaran yang wajib kami
            simpan lebih lama menurut hukum.
          </p>
        </Bagian>

        <Bagian judul="6. Hak orang tua">
          <p>Orang tua atau wali dapat:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>melihat rapor dan progres anak kapan saja di Ruang Orang Tua;</li>
            <li>mengubah nama, avatar, tanggal lahir, atau PIN profil anak, dan menghapus profil anak;</li>
            <li>meminta salinan data, perbaikan data, atau penghapusan seluruh akun beserta data anak.</li>
          </ul>
          <p>
            Untuk meminta salinan atau penghapusan akun, kirim email ke <a className="font-bold text-[#0786eb] underline" href={`mailto:${KONTAK}`}>{KONTAK}</a>{" "}
            dari email akun atau sebutkan nama pengguna akun. Kami memprosesnya paling lambat 30 hari.
          </p>
        </Bagian>

        <Bagian judul="7. Perubahan kebijakan">
          <p>
            Bila kebijakan ini berubah, kami memperbarui tanggal di atas dan, untuk perubahan penting, memberi tahu orang tua lewat aplikasi atau email.
          </p>
        </Bagian>

        <Bagian judul="8. Hubungi kami">
          <p>
            Pertanyaan tentang privasi: <a className="font-bold text-[#0786eb] underline" href={`mailto:${KONTAK}`}>{KONTAK}</a>.
          </p>
        </Bagian>

        <footer className="border-t border-[#f0e4d2] pt-4 text-[13px] font-bold text-[#6b7c93]">
          <Link href="/masuk" className="text-[#0786eb] underline">
            Kembali ke RINOYA Academy
          </Link>
        </footer>
      </article>
    </main>
  );
}
