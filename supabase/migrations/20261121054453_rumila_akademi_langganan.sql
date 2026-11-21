-- RINOYA Academy: harga & langganan (SaaS). Harga per KELUARGA (rumah); tiap paket membatasi jumlah anak.
-- Pembayaran sementara MANUAL: transfer ke rekening yang diatur owner di admin Kampus (pulaurinoya.com/admin),
-- orang tua mengirim bukti dari Ruang Orang Tua, owner menerima/menolak. Langganan aktif sampai = `akademi_bayar.sampai`
-- terbaru yang diterima. Masa coba = family.created_at + trial_hari. Akses belum dikunci (lihat `kunci_akses`).
-- Semua perubahan harga/rekening/status hanya lewat service role (admin Kampus); klien hanya membaca & mengirim bukti.

create table public.akademi_paket (
  id text primary key check (id ~ '^[a-z0-9-]{2,30}$'),
  nama text not null check (char_length(trim(nama)) between 1 and 40),
  deskripsi text check (char_length(deskripsi) <= 300),
  maks_anak smallint not null default 1 check (maks_anak between 1 and 20),
  harga_bulan integer check (harga_bulan > 0),
  harga_semester integer check (harga_semester > 0),
  harga_tahun integer check (harga_tahun > 0),
  unggulan boolean not null default false,
  aktif boolean not null default false,
  urut smallint not null default 0,
  diubah_at timestamptz not null default now()
);

-- Satu baris pengaturan: rekening tujuan, masa coba, saklar kunci akses.
create table public.akademi_bayar_atur (
  id boolean primary key default true check (id),
  bank text not null default 'BCA',
  no_rekening text not null default '',
  atas_nama text not null default '',
  trial_hari smallint not null default 7 check (trial_hari between 0 and 90),
  kode_unik boolean not null default true,
  catatan text check (char_length(catatan) <= 400),
  kunci_akses boolean not null default false,
  diubah_at timestamptz not null default now()
);

create table public.akademi_bayar (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.family(id) on delete cascade,
  paket_id text not null references public.akademi_paket(id),
  periode text not null check (periode in ('bulan','semester','tahun')),
  harga integer not null check (harga > 0),
  kode_unik smallint not null default 0 check (kode_unik between 0 and 999),
  jumlah integer not null check (jumlah > 0),
  nama_pengirim text check (char_length(nama_pengirim) <= 60),
  bukti_path text check (char_length(bukti_path) <= 200),
  status text not null default 'menunggu' check (status in ('menunggu','diterima','ditolak','batal')),
  alasan text check (char_length(alasan) <= 300),
  mulai timestamptz,
  sampai timestamptz,
  dibuat_by uuid default auth.uid() references auth.users(id) on delete set null,
  dibuat_at timestamptz not null default now(),
  diperiksa_at timestamptz
);
create index akademi_bayar_family_idx on public.akademi_bayar(family_id, dibuat_at desc);
create index akademi_bayar_status_idx on public.akademi_bayar(status, dibuat_at desc);

alter table public.akademi_paket enable row level security;
alter table public.akademi_bayar_atur enable row level security;
alter table public.akademi_bayar enable row level security;

-- Paket aktif & pengaturan boleh dibaca siapa pun yang masuk (halaman harga). Tulis = service role saja.
create policy akademi_paket_select on public.akademi_paket for select to anon, authenticated using (aktif);
create policy akademi_bayar_atur_select on public.akademi_bayar_atur for select to authenticated using (true);

-- Orang tua: lihat pembayaran rumahnya, kirim pembayaran baru berstatus menunggu, batalkan yang masih menunggu.
create policy akademi_bayar_select on public.akademi_bayar for select to authenticated using (public.is_family_user(family_id));
create policy akademi_bayar_insert on public.akademi_bayar for insert to authenticated
  with check (public.is_family_user(family_id) and status = 'menunggu' and mulai is null and sampai is null and diperiksa_at is null and alasan is null);
create policy akademi_bayar_update on public.akademi_bayar for update to authenticated
  using (public.is_family_user(family_id) and status = 'menunggu')
  with check (public.is_family_user(family_id) and status in ('menunggu','batal') and mulai is null and sampai is null and diperiksa_at is null);

-- Harga & jumlah tidak boleh dikarang klien: dihitung ulang dari paket saat insert/update oleh orang tua.
create or replace function public.akademi_bayar_harga()
returns trigger language plpgsql security definer set search_path = '' as $$
declare p public.akademi_paket;
begin
  if (select auth.role()) = 'service_role' then return new; end if;
  -- Orang tua hanya boleh mengubah status (batal), nama pengirim, dan bukti.
  if tg_op = 'UPDATE' then
    old.status := new.status; old.nama_pengirim := new.nama_pengirim; old.bukti_path := new.bukti_path;
    return old;
  end if;
  select * into p from public.akademi_paket where id = new.paket_id and aktif;
  if not found then raise exception 'paket_tidak_tersedia'; end if;
  new.harga := case new.periode when 'bulan' then p.harga_bulan when 'semester' then p.harga_semester else p.harga_tahun end;
  if new.harga is null then raise exception 'periode_tidak_tersedia'; end if;
  new.jumlah := new.harga + coalesce(new.kode_unik, 0);
  return new;
end $$;
create trigger akademi_bayar_harga before insert or update on public.akademi_bayar
  for each row execute function public.akademi_bayar_harga();

-- Status langganan satu rumah (dipakai Ruang Orang Tua). security definer agar tidak bergantung RLS tabel lain.
create or replace function public.akademi_status_langganan(fid uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  with f as (select created_at from public.family where id = fid and public.is_family_user(fid)),
  a as (select trial_hari from public.akademi_bayar_atur limit 1),
  b as (
    select paket_id, periode, sampai from public.akademi_bayar
    where family_id = fid and status = 'diterima' and sampai is not null order by sampai desc limit 1
  )
  select case when not exists (select 1 from f) then null else jsonb_build_object(
    'trial_sampai', (select created_at from f) + make_interval(days => coalesce((select trial_hari from a), 0)),
    'aktif_sampai', (select sampai from b),
    'paket_id', (select paket_id from b),
    'periode', (select periode from b),
    'menunggu', (select count(*) from public.akademi_bayar where family_id = fid and status = 'menunggu')
  ) end;
$$;
revoke execute on function public.akademi_status_langganan(uuid) from public, anon;
grant execute on function public.akademi_status_langganan(uuid) to authenticated;

-- Bukti transfer: bucket PRIVAT, path <family_id>/bukti/<uuid>.jpg.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('bukti-bayar', 'bukti-bayar', false, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy bukti_bayar_select on storage.objects for select to authenticated
using (bucket_id = 'bukti-bayar' and public.is_family_user(public.family_of_path(name)));
create policy bukti_bayar_insert on storage.objects for insert to authenticated
with check (bucket_id = 'bukti-bayar' and name ~ '^[0-9a-fA-F-]{36}/bukti/[0-9a-fA-F-]{36}\.jpg$' and public.is_family_user(public.family_of_path(name)));

-- Data awal: dua paket NONAKTIF tanpa harga (owner mengisi harga lalu mengaktifkan di admin) + rekening BCA.
insert into public.akademi_paket (id, nama, deskripsi, maks_anak, unggulan, urut) values
  ('satu-anak', 'Satu Anak', 'Semua jenjang PAUD sampai SD 6 untuk satu anak.', 1, false, 1),
  ('keluarga', 'Keluarga', 'Semua jenjang untuk sampai 4 anak dalam satu rumah.', 4, true, 2)
on conflict (id) do nothing;
insert into public.akademi_bayar_atur (id, bank, no_rekening, atas_nama, trial_hari)
values (true, 'BCA', '6560291076', 'DESFIA HARYATI HS', 7)
on conflict (id) do nothing;
