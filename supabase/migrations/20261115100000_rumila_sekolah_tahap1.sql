-- RINOYA Academy · Sekolah Tahap 1: jenjang terkunci + sertifikat diterbitkan server.
--
-- 1. akademi_siswa: jenjang aktif tiap anak disimpan di server. Aplikasi hanya boleh MEMBACA. Perubahan:
--    - akademi_atur_jenjang_awal(): wali memilih jenjang awal, hanya bila anak belum punya catatan belajar
--      (atau belum punya baris siswa sama sekali). Sesudah itu terkunci.
--    - naik jenjang: hanya oleh server penerbit sertifikat (/api/akademi/sertifikat, peran service_role)
--      setelah kelulusan dihitung ulang dari learner_event.
-- 2. akademi_certificate: insert dari aplikasi dicabut (sertifikat hanya terbit lewat server), ditambah nomor urut
--    resmi RA/<tahun>/<jenjang>/<6 digit> dan status sah/dicabut.
-- 3. verify_certificate() mengembalikan nomor + status.

/* ---------------- 1. status siswa ---------------- */

create table public.akademi_siswa (
  member_id uuid primary key references public.member(id) on delete cascade,
  family_id uuid not null references public.family(id) on delete cascade,
  level text not null check (level in ('PAUD','TKA','TKB','SD1','SD2','SD3','SD4','SD5','SD6')),
  semester smallint not null default 1 check (semester between 1 and 2),
  sumber text not null default 'awal' check (sumber in ('awal','migrasi','naik','admin')),
  mulai_at timestamptz not null default now(),
  level_sejak timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index akademi_siswa_family_idx on public.akademi_siswa(family_id);

alter table public.akademi_siswa enable row level security;
create policy akademi_siswa_select on public.akademi_siswa for select to authenticated using (public.is_family_user(family_id));

revoke all on public.akademi_siswa from anon;
revoke all on public.akademi_siswa from authenticated;
grant select on public.akademi_siswa to authenticated;

-- Isi awal dari jenjang yang selama ini tersimpan di game_save (kunci rumila-akademi-<member_id>).
insert into public.akademi_siswa (member_id, family_id, level, sumber)
select m.id, m.family_id, gs.data->>'level', 'migrasi'
from public.game_save gs
join public.member m on m.id::text = substr(gs.key, length('rumila-akademi-') + 1) and m.family_id = gs.family_id
where gs.key like 'rumila-akademi-%'
  and gs.data->>'level' in ('PAUD','TKA','TKB','SD1','SD2','SD3','SD4','SD5','SD6')
on conflict (member_id) do nothing;

-- Wali memilih jenjang awal. Ditolak bila anak sudah punya baris siswa DAN sudah punya catatan belajar.
create or replace function public.akademi_atur_jenjang_awal(p_member uuid, p_level text)
returns public.akademi_siswa
language plpgsql
security definer
set search_path = ''
as $$
declare
  fid uuid;
  ada public.akademi_siswa;
  hasil public.akademi_siswa;
begin
  if p_level not in ('PAUD','TKA','TKB','SD1','SD2','SD3','SD4','SD5','SD6') then
    raise exception 'jenjang_tidak_dikenal' using errcode = '22023';
  end if;
  select m.family_id into fid from public.member m where m.id = p_member;
  if fid is null or not public.is_family_user(fid) then
    raise exception 'tidak_berhak' using errcode = '42501';
  end if;
  select * into ada from public.akademi_siswa s where s.member_id = p_member;
  if ada.member_id is not null then
    if ada.level = p_level then
      return ada;
    end if;
    if ada.sumber = 'naik' or exists (select 1 from public.learner_event e where e.member_id = p_member and e.type = 'attempt') then
      raise exception 'jenjang_terkunci' using errcode = 'P0001';
    end if;
  end if;
  insert into public.akademi_siswa (member_id, family_id, level, sumber)
  values (p_member, fid, p_level, 'awal')
  on conflict (member_id) do update set level = excluded.level, sumber = 'awal', semester = 1, level_sejak = now(), updated_at = now()
  returning * into hasil;
  return hasil;
end;
$$;

revoke all on function public.akademi_atur_jenjang_awal(uuid, text) from public;
grant execute on function public.akademi_atur_jenjang_awal(uuid, text) to authenticated;

/* ---------------- 2. sertifikat: nomor, status, insert hanya server ---------------- */

create sequence public.akademi_certificate_no;

alter table public.akademi_certificate
  add column nomor text unique,
  add column status text not null default 'sah' check (status in ('sah','dicabut')),
  add column dicabut_at timestamptz,
  add column dicabut_alasan text check (dicabut_alasan is null or char_length(dicabut_alasan) <= 200);

create or replace function public.akademi_certificate_isi_nomor()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.nomor is null then
    new.nomor := 'RA/' || to_char(new.issued_at at time zone 'Asia/Jakarta', 'YYYY') || '/' || new.level || '/'
      || lpad(nextval('public.akademi_certificate_no')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger akademi_certificate_nomor before insert on public.akademi_certificate
  for each row execute function public.akademi_certificate_isi_nomor();

-- Sertifikat lama: beri nomor sesuai urutan terbit.
with u as (select id, row_number() over (order by issued_at, id) as rn from public.akademi_certificate where nomor is null)
update public.akademi_certificate c
set nomor = 'RA/' || to_char(c.issued_at at time zone 'Asia/Jakarta', 'YYYY') || '/' || c.level || '/' || lpad(u.rn::text, 6, '0')
from u
where c.id = u.id;
select setval('public.akademi_certificate_no', greatest((select count(*) from public.akademi_certificate), 1), (select count(*) > 0 from public.akademi_certificate));

drop policy if exists akademi_certificate_insert on public.akademi_certificate;
revoke insert on public.akademi_certificate from authenticated;

/* ---------------- 3. verifikasi publik ---------------- */

drop function if exists public.verify_certificate(text);
create function public.verify_certificate(p_code text)
returns table (first_name text, level text, track text, issued_at timestamptz, snapshot jsonb, nomor text, status text)
language sql
security definer
set search_path = public
stable
as $$
  select split_part(btrim(m.name), ' ', 1) as first_name,
         c.level, c.track, c.issued_at, c.snapshot, c.nomor, c.status
  from public.akademi_certificate c
  join public.member m on m.id = c.member_id
  where c.code = upper(btrim(p_code))
  limit 1;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
