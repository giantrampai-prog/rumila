-- RINOYA Academy: foto anak untuk buku sertifikat. Bucket PRIVAT; diunggah orang tua di Ruang Orang Tua (ber-PIN).
-- Path: <family_id>/foto-anak/<member_id>.jpg — hanya pengguna rumah itu yang bisa membaca/mengganti/menghapus.
-- Foto tidak pernah tampil di halaman verifikasi publik.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('foto-anak', 'foto-anak', false, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create or replace function public.valid_foto_anak_path(p text)
returns boolean language sql immutable set search_path = '' as $$
  select p ~ '^[0-9a-fA-F-]{36}/foto-anak/[0-9a-fA-F-]{36}\.jpg$';
$$;
revoke execute on function public.valid_foto_anak_path(text) from public, anon;
grant execute on function public.valid_foto_anak_path(text) to authenticated;

create policy foto_anak_select on storage.objects for select to authenticated
using (bucket_id = 'foto-anak' and public.is_family_user(public.family_of_path(name)));
create policy foto_anak_insert on storage.objects for insert to authenticated
with check (bucket_id = 'foto-anak' and public.valid_foto_anak_path(name) and public.is_family_user(public.family_of_path(name)));
create policy foto_anak_update on storage.objects for update to authenticated
using (bucket_id = 'foto-anak' and public.valid_foto_anak_path(name) and public.is_family_user(public.family_of_path(name)))
with check (bucket_id = 'foto-anak' and public.valid_foto_anak_path(name) and public.is_family_user(public.family_of_path(name)));
create policy foto_anak_delete on storage.objects for delete to authenticated
using (bucket_id = 'foto-anak' and public.is_family_user(public.family_of_path(name)));
