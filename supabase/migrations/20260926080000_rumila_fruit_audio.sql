-- Narration belongs to the signed-in household, like existing family documents.
-- Child/admin profiles share that household auth identity; UI exposes upload to admins.
-- No public bucket, no modification to document policies, no service key in the browser.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fruit-audio', 'fruit-audio', false, 20971520, array['audio/mpeg','audio/wav','audio/x-wav','audio/mp4'])
on conflict (id) do nothing;

create or replace function public.valid_fruit_audio_path(p text)
returns boolean language sql immutable set search_path = '' as $$
  select p ~ '^[0-9a-fA-F-]{36}/fruits/(pisang|mangga|jeruk|apel|semangka|melon|pepaya|nanas|anggur|stroberi|alpukat|kelapa|durian|rambutan|manggis|salak|duku|lengkeng|jambu-biji|jambu-air|belimbing|sawo|sirsak|nangka|buah-naga|markisa|srikaya|kedondong|jeruk-bali|jeruk-nipis|lemon|pir|kiwi|kurma|delima|kesemek|leci|plum|persik|cempedak|langsat|matoa|blewah|terong-belanda|ceri|cermai|jamblang|jambu-bol)\.(mp3|wav|m4a)$';
$$;
revoke execute on function public.valid_fruit_audio_path(text) from public, anon;
grant execute on function public.valid_fruit_audio_path(text) to authenticated;

create policy fruit_audio_select on storage.objects for select to authenticated
using (bucket_id = 'fruit-audio' and public.is_family_user(public.family_of_path(name)));
create policy fruit_audio_insert on storage.objects for insert to authenticated
with check (bucket_id = 'fruit-audio' and public.valid_fruit_audio_path(name) and public.is_family_user(public.family_of_path(name)));
create policy fruit_audio_update on storage.objects for update to authenticated
using (bucket_id = 'fruit-audio' and public.valid_fruit_audio_path(name) and public.is_family_user(public.family_of_path(name)))
with check (bucket_id = 'fruit-audio' and public.valid_fruit_audio_path(name) and public.is_family_user(public.family_of_path(name)));
-- Audio can be replaced, but there is no general delete permission.
