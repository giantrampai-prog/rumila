-- RINOYA Academy · Sekolah Tahap 3: hasil ujian (kuis modul, ujian semester, ujian kenaikan, tes penempatan).
-- Satu baris per sesi ujian. Nilai dihitung SERVER (/api/akademi/ujian) dari event attempt sesi itu di learner_event;
-- aplikasi hanya membaca. Ujian Kenaikan yang lulus menjadi syarat penerbitan sertifikat jenjang.

create table public.akademi_ujian (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.family(id) on delete cascade,
  member_id uuid not null references public.member(id) on delete cascade,
  jenis text not null check (jenis in ('kuis','semester','kenaikan','penempatan')),
  level text not null check (level in ('PAUD','TKA','TKB','SD1','SD2','SD3','SD4','SD5','SD6')),
  ruang text not null default '' check (char_length(ruang) <= 80),
  session_id uuid not null unique,
  benar smallint not null check (benar >= 0),
  total smallint not null check (total > 0 and benar <= total),
  nilai smallint not null check (nilai between 0 and 100),
  lulus boolean not null,
  created_at timestamptz not null default now()
);
create index akademi_ujian_member_idx on public.akademi_ujian(member_id, jenis, level);
create index akademi_ujian_family_idx on public.akademi_ujian(family_id);

alter table public.akademi_ujian enable row level security;
create policy akademi_ujian_select on public.akademi_ujian for select to authenticated using (public.is_family_user(family_id));

revoke all on public.akademi_ujian from anon;
revoke all on public.akademi_ujian from authenticated;
grant select on public.akademi_ujian to authenticated;

-- semester siswa ikut tercatat di status siswa (diisi server saat Ujian Semester 1 lulus)
comment on column public.akademi_siswa.semester is 'Semester berjalan; naik ke 2 saat Ujian Semester 1 lulus (diisi /api/akademi/ujian).';

-- Verifikasi publik Sertifikat Semester lewat id sesi Ujian Semester yang lulus (Tahap 4). Hanya nama depan anak,
-- jenjang, semester, nilai, tanggal, dan nilai Kuis Modul terbaik jenjang itu (untuk nilai per pelajaran).
create or replace function public.verify_semester(p_session uuid)
returns table (first_name text, level text, ruang text, nilai smallint, created_at timestamptz, kuis jsonb)
language sql
security definer
set search_path = public
stable
as $$
  select split_part(btrim(m.name), ' ', 1),
         u.level, u.ruang, u.nilai, u.created_at,
         coalesce((
           select jsonb_agg(jsonb_build_object('ruang', k.ruang, 'nilai', k.nilai))
           from (select distinct on (q.ruang) q.ruang, q.nilai from public.akademi_ujian q
                 where q.member_id = u.member_id and q.level = u.level and q.jenis = 'kuis' and q.lulus
                 order by q.ruang, q.nilai desc) k
         ), '[]'::jsonb)
  from public.akademi_ujian u
  join public.member m on m.id = u.member_id
  where u.session_id = p_session and u.jenis = 'semester' and u.lulus
  limit 1;
$$;

revoke all on function public.verify_semester(uuid) from public;
grant execute on function public.verify_semester(uuid) to anon, authenticated;
