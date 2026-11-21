-- RINOYA Academy: kunci akses saat masa coba habis (owner 21 Nov 2026).
-- Saklar `akademi_bayar_atur.kunci_akses` (admin Kampus → Harga & paket). Masa coba dihitung dari tanggal rumah dibuat,
-- tetapi tidak lebih awal dari `mulai_berbayar`: rumah lama yang sudah lewat 7 hari mendapat masa coba penuh sejak
-- langganan mulai berlaku, bukan langsung terkunci. Terkunci = saklar menyala, masa coba lewat, tidak ada langganan
-- aktif. Yang tetap terbuka saat terkunci (diatur di AppShell): Ruang Orang Tua (untuk membayar), rapor, sertifikat,
-- lemari piagam, dan halaman verifikasi publik; alumni SD 6 tidak butuh langganan untuk itu.

alter table public.akademi_bayar_atur add column mulai_berbayar timestamptz;

create or replace function public.akademi_status_langganan(fid uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  with f as (select created_at from public.family where id = fid and public.is_family_user(fid)),
  a as (select trial_hari, kunci_akses, mulai_berbayar from public.akademi_bayar_atur limit 1),
  t as (
    select greatest((select created_at from f), coalesce((select mulai_berbayar from a), '-infinity'::timestamptz))
           + make_interval(days => coalesce((select trial_hari from a), 0)) as sampai
  ),
  b as (
    select paket_id, periode, sampai from public.akademi_bayar
    where family_id = fid and status = 'diterima' and sampai is not null order by sampai desc limit 1
  )
  select case when not exists (select 1 from f) then null else jsonb_build_object(
    'trial_sampai', (select sampai from t),
    'aktif_sampai', (select sampai from b),
    'paket_id', (select paket_id from b),
    'periode', (select periode from b),
    'menunggu', (select count(*) from public.akademi_bayar where family_id = fid and status = 'menunggu'),
    'alumni', to_jsonb(public.akademi_alumni(fid)),
    'kunci_akses', coalesce((select kunci_akses from a), false),
    'terkunci', coalesce((select kunci_akses from a), false)
                and now() > (select sampai from t)
                and not coalesce((select sampai from b) > now(), false)
  ) end;
$$;
