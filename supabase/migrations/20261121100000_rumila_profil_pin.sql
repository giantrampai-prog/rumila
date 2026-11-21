-- Profil & PIN (21 Nov 2026): avatar karakter, peran anak/dewasa di server (sebelumnya hanya di perangkat),
-- dan jenis PIN (angka / gambar). Tambahan saja, tidak mengubah kolom lama.

alter table public.member add column if not exists avatar text
  check (avatar is null or avatar ~ '^[a-z0-9-]{1,40}$');
alter table public.member add column if not exists peran text
  check (peran is null or peran in ('anak', 'dewasa'));
alter table public.member add column if not exists jenis_pin text not null default 'angka'
  check (jenis_pin in ('angka', 'gambar'));

grant select (avatar, peran, jenis_pin) on public.member to authenticated;
grant insert (avatar, peran, jenis_pin) on public.member to authenticated;
grant update (avatar, peran, jenis_pin) on public.member to authenticated;
