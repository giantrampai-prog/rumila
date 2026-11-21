-- RINOYA Academy: tarif per periode + add-on anak + harga coret (owner 21 Nov 2026: "add-on saja", "tahunan tetap
-- ada", "harga diskon di semua tier biar kesannya murah"). Satu paket dasar untuk 1 anak; tiap anak berikutnya = add-on.
-- Periode: bulan (1), triwulan (3), semester (6), tahun (12). `tarif` per periode:
--   {"harga": 49000, "coret": 79000, "tambah": 25000, "tambah_coret": 39000}
-- harga = harga dasar dibayar, coret = harga normal yang dicoret di layar, tambah = add-on per anak tambahan.
-- Kolom harga_bulan/semester/tahun lama dibuang (belum ada pembayaran saat migrasi ini).

alter table public.akademi_paket add column tarif jsonb not null default '{}'::jsonb;
alter table public.akademi_paket add column label_promo text check (char_length(label_promo) <= 40);
alter table public.akademi_paket drop column harga_bulan, drop column harga_semester, drop column harga_tahun;

alter table public.akademi_bayar drop constraint akademi_bayar_periode_check;
alter table public.akademi_bayar add constraint akademi_bayar_periode_check check (periode in ('bulan','triwulan','semester','tahun'));
alter table public.akademi_bayar add column anak_tambahan smallint not null default 0 check (anak_tambahan between 0 and 19);
alter table public.akademi_bayar add column harga_tambah integer not null default 0 check (harga_tambah >= 0);

-- Harga dasar + add-on × anak tambahan + kode unik, semua dihitung dari paket (klien tidak bisa mengarang).
create or replace function public.akademi_bayar_harga()
returns trigger language plpgsql security definer set search_path = '' as $$
declare p public.akademi_paket; t jsonb; tambah integer;
begin
  if (select auth.role()) = 'service_role' then return new; end if;
  -- Orang tua hanya boleh mengubah status (batal), nama pengirim, dan bukti.
  if tg_op = 'UPDATE' then
    old.status := new.status; old.nama_pengirim := new.nama_pengirim; old.bukti_path := new.bukti_path;
    return old;
  end if;
  select * into p from public.akademi_paket where id = new.paket_id and aktif;
  if not found then raise exception 'paket_tidak_tersedia'; end if;
  t := p.tarif -> new.periode;
  new.harga := nullif(t ->> 'harga', '')::integer;
  if new.harga is null then raise exception 'periode_tidak_tersedia'; end if;
  new.anak_tambahan := coalesce(new.anak_tambahan, 0);
  if 1 + new.anak_tambahan > p.maks_anak then raise exception 'anak_terlalu_banyak'; end if;
  tambah := nullif(t ->> 'tambah', '')::integer;
  if new.anak_tambahan > 0 and tambah is null then raise exception 'addon_tidak_tersedia'; end if;
  new.harga_tambah := coalesce(tambah, 0) * new.anak_tambahan;
  new.jumlah := new.harga + new.harga_tambah + coalesce(new.kode_unik, 0);
  return new;
end $$;

-- Paket dasar tunggal (1 anak + add-on sampai 6 anak). Tetap NONAKTIF; diaktifkan sesudah aplikasi baru terpasang.
delete from public.akademi_paket where id = 'keluarga';
update public.akademi_paket set
  nama = 'Belajar Lengkap',
  deskripsi = 'Semua jenjang PAUD sampai SD 6, ujian, rapor, dan sertifikat. Tambah anak lewat add-on.',
  maks_anak = 6, unggulan = true, label_promo = 'Harga perkenalan',
  tarif = '{
    "bulan":    {"harga": 49000,  "coret": 79000,  "tambah": 25000,  "tambah_coret": 39000},
    "triwulan": {"harga": 129000, "coret": 237000, "tambah": 65000,  "tambah_coret": 117000},
    "semester": {"harga": 239000, "coret": 474000, "tambah": 119000, "tambah_coret": 234000},
    "tahun":    {"harga": 429000, "coret": 948000, "tambah": 219000, "tambah_coret": 468000}
  }'::jsonb,
  diubah_at = now()
where id = 'satu-anak';
