-- RINOYA Academy: aturan ALUMNI SD 6 (owner 21 Nov 2026).
-- Alumni = anak dengan sertifikat jenjang SD6 (track kosong) berstatus sah: sudah lulus Ujian Akhir SD 6, tidak ada
-- jenjang berikutnya. Aturan:
--   1. Rapor, buku sertifikat, dan verifikasi sertifikat alumni GRATIS selamanya. Penguncian akses (bila nanti
--      dipasang lewat akademi_bayar_atur.kunci_akses) wajib memakai public.akademi_alumni() untuk mengecualikannya.
--   2. Alumni tidak dihitung sebagai anak berbayar: tab Langganan memakai daftar `alumni` dari status langganan.
--   3. Sisa masa aktif tidak dikembalikan dan tetap berlaku untuk saudaranya.

create or replace function public.akademi_alumni(fid uuid)
returns uuid[] language sql stable security definer set search_path = '' as $$
  select coalesce(array_agg(distinct c.member_id), '{}')
  from public.akademi_certificate c
  where c.family_id = fid and c.level = 'SD6' and c.track is null and c.status = 'sah'
    and (public.is_family_user(fid) or (select auth.role()) = 'service_role');
$$;
revoke execute on function public.akademi_alumni(uuid) from public, anon;
grant execute on function public.akademi_alumni(uuid) to authenticated;

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
    'menunggu', (select count(*) from public.akademi_bayar where family_id = fid and status = 'menunggu'),
    'alumni', to_jsonb(public.akademi_alumni(fid))
  ) end;
$$;
