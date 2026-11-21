'use client';

// Boarding pass contoh yang "dicetak" keluar dari konter check-in. Saat pertama diterima, anak mengetuk
// Nama, Tujuan, dan Kursi untuk memeriksanya (sesuai langkah "periksa isinya"), lalu menyimpannya.

import { useState } from 'react';
import { Icon } from '@/components/ui';
import { TIKET_CONTOH as T } from '@/lib/umroh';

type Cek = 'nama' | 'tujuan' | 'kursi';
const CEK: { id: Cek; label: string }[] = [
  { id: 'nama', label: 'Nama' },
  { id: 'tujuan', label: 'Tujuan' },
  { id: 'kursi', label: 'Kursi' },
];

export function TiketBesar({ nama, boarding, periksa, onTutup }: { nama: string; boarding: boolean; periksa: boolean; onTutup: () => void }) {
  const [dicek, setDicek] = useState<Set<Cek>>(new Set());
  const cek = (id: Cek) => setDicek((s) => new Set(s).add(id));
  const semua = !periksa || CEK.every((c) => dicek.has(c.id));
  const sorot = (id: Cek) => (periksa ? (dicek.has(id) ? ' umroh-dicek' : ' umroh-perlu') : '');
  const tanggal = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="umroh-tiket-layar" role="dialog" aria-modal="true" aria-label="Boarding pass contoh">
      <div className="umroh-tiket-slot" aria-hidden />
      <div className="umroh-tiket">
        <div className="umroh-tiket-kepala">
          <span className="umroh-tiket-logo"><Icon name="flight_takeoff" size={20} /></span>
          <span><strong>{T.maskapai}</strong><small>Boarding pass · contoh belajar</small></span>
          {boarding && <em className="umroh-tiket-cap">Boarding dibuka</em>}
        </div>
        <div className="umroh-tiket-badan">
          <div className="umroh-tiket-utama">
            <button type="button" className={'umroh-tiket-rute' + sorot('tujuan')} onClick={() => cek('tujuan')} aria-label={`Tujuan: ${T.dari.kota} ke ${T.ke.kota}`}>
              <span><b>{T.dari.kode}</b><small>{T.dari.kota}</small></span>
              <Icon name="flight" size={30} />
              <span className="kanan"><b>{T.ke.kode}</b><small>{T.ke.kota}</small></span>
            </button>
            <div className="umroh-tiket-isi">
              <button type="button" className={'umroh-tiket-medan lebar' + sorot('nama')} onClick={() => cek('nama')}><span className="k">Penumpang</span><span className="v">{nama}</span></button>
              <div className="umroh-tiket-medan"><span className="k">Penerbangan</span><span className="v">{T.penerbangan}</span></div>
              <div className="umroh-tiket-medan"><span className="k">Tanggal</span><span className="v">{tanggal}</span></div>
              <div className="umroh-tiket-medan"><span className="k">Kelas</span><span className="v">{T.kelas}</span></div>
              <div className="umroh-tiket-medan"><span className="k">Boarding</span><span className="v">{T.boarding}</span></div>
              <div className="umroh-tiket-medan"><span className="k">Berangkat</span><span className="v">{T.berangkat}</span></div>
              <div className="umroh-tiket-medan"><span className="k">Gerbang</span><span className="v">{T.gerbang}</span></div>
              <div className="umroh-tiket-medan"><span className="k">Kelompok</span><span className="v">{T.kelompok}</span></div>
            </div>
          </div>
          <button type="button" className={'umroh-tiket-sobek' + sorot('kursi')} onClick={() => cek('kursi')} aria-label={`Kursi ${T.kursi} dekat ${T.posisi}`}>
            <small>Kursi</small><b>{T.kursi}</b><span>{T.posisi}</span>
            <i className="umroh-tiket-kode" aria-hidden />
          </button>
        </div>
        <span className="umroh-tiket-contoh" aria-hidden>CONTOH</span>
      </div>
      {periksa && (
        <div className="umroh-tiket-cek" aria-live="polite">
          <span>{semua ? 'Semua sudah dicek. Simpan bersama paspor.' : 'Ketuk untuk memeriksa:'}</span>
          {CEK.map((c) => <button key={c.id} type="button" onClick={() => cek(c.id)} aria-pressed={dicek.has(c.id)}><Icon name={dicek.has(c.id) ? 'check_circle' : 'radio_button_unchecked'} size={18} />{c.label}</button>)}
        </div>
      )}
      <button type="button" className="umroh-go" disabled={!semua} onClick={onTutup}><Icon name="wallet" size={20} />Simpan bersama paspor</button>
    </div>
  );
}
