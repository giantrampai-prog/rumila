-- Rumila Akademi: sertifikat jenjang yang sudah terbit (snapshot beku kompetensi saat terbit).
-- Satu sertifikat per anak × jenjang (× track; null = sertifikat jenjang penuh). Kode 8 karakter tanpa 0/O/1/I
-- dipakai di QR & URL publik /sertifikat/<code>. Tidak ada policy update/delete: sertifikat tidak pernah diubah;
-- ikut terhapus bila anggota/rumah dihapus.

create table public.akademi_certificate (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.family(id) on delete cascade,
  member_id uuid not null references public.member(id) on delete cascade,
  level text not null check (char_length(level) <= 8),
  track text null check (track is null or char_length(track) <= 16),
  code text not null unique check (code ~ '^[A-HJ-NP-Z2-9]{8}$'),
  snapshot jsonb not null,
  issued_at timestamptz not null default now()
);
create unique index akademi_certificate_member_level_track_idx on public.akademi_certificate(member_id, level, coalesce(track, ''));
create index akademi_certificate_family_idx on public.akademi_certificate(family_id);

alter table public.akademi_certificate enable row level security;

create policy akademi_certificate_select on public.akademi_certificate for select to authenticated using (public.is_family_user(family_id));
create policy akademi_certificate_insert on public.akademi_certificate for insert to authenticated
  with check (public.is_family_user(family_id)
    and exists (select 1 from public.member m where m.id = member_id and m.family_id = akademi_certificate.family_id));

revoke all on public.akademi_certificate from anon;
revoke all on public.akademi_certificate from authenticated;
grant select, insert on public.akademi_certificate to authenticated;

-- Verifikasi publik lewat kode: hanya kolom non-sensitif (nama depan anak saja, tanpa id/nama keluarga).
-- security definer supaya anon bisa membaca satu baris tanpa membuka tabel; search_path dikunci.
create or replace function public.verify_certificate(p_code text)
returns table (first_name text, level text, track text, issued_at timestamptz, snapshot jsonb)
language sql
security definer
set search_path = public
stable
as $$
  select split_part(btrim(m.name), ' ', 1) as first_name,
         c.level, c.track, c.issued_at, c.snapshot
  from public.akademi_certificate c
  join public.member m on m.id = c.member_id
  where c.code = upper(btrim(p_code))
  limit 1;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
