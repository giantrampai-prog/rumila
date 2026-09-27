-- Rumila: simpanan progres game per rumah (sinkron antarperangkat).
-- Satu baris per kunci penyimpanan game di perangkat (mis. "rumila-koding-<id anggota>"), isi JSON apa adanya.
-- member_id diisi bila kunci milik satu anggota (ikut terhapus bila anggota dihapus); null = milik rumah.

create table public.game_save (
  family_id uuid not null references public.family(id) on delete cascade,
  key text not null check (char_length(key) between 1 and 120),
  member_id uuid references public.member(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (family_id, key)
);
create index game_save_member_idx on public.game_save(member_id);

alter table public.game_save enable row level security;

create policy game_save_select on public.game_save for select to authenticated using (public.is_family_user(family_id));
create policy game_save_insert on public.game_save for insert to authenticated
  with check (public.is_family_user(family_id)
    and (member_id is null or exists (select 1 from public.member m where m.id = member_id and m.family_id = game_save.family_id)));
create policy game_save_update on public.game_save for update to authenticated
  using (public.is_family_user(family_id))
  with check (public.is_family_user(family_id)
    and (member_id is null or exists (select 1 from public.member m where m.id = member_id and m.family_id = game_save.family_id)));
create policy game_save_delete on public.game_save for delete to authenticated using (public.is_family_user(family_id));

revoke all on public.game_save from anon;
revoke all on public.game_save from authenticated;
grant select, insert, update, delete on public.game_save to authenticated;
