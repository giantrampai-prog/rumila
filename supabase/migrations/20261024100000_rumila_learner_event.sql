-- Rumila Akademi: rekam jejak belajar per anak (append-only).
-- Satu baris per event yang dibuat di klien (id UUID dibuat klien, upsert idempoten onConflict id).
-- Tidak ada policy update/delete: event tidak pernah diubah; ikut terhapus bila anggota/rumah dihapus.

create table public.learner_event (
  id uuid primary key,
  family_id uuid not null references public.family(id) on delete cascade,
  member_id uuid not null references public.member(id) on delete cascade,
  session_id uuid not null,
  activity_id text not null check (char_length(activity_id) <= 80),
  mechanic text not null check (char_length(mechanic) <= 20),
  type text not null check (type in ('activity_start','attempt','hint','activity_end','quest_end')),
  payload jsonb not null default '{}',
  client_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index learner_event_member_idx on public.learner_event(member_id, client_at desc);
create index learner_event_family_idx on public.learner_event(family_id);

alter table public.learner_event enable row level security;

create policy learner_event_select on public.learner_event for select to authenticated using (public.is_family_user(family_id));
create policy learner_event_insert on public.learner_event for insert to authenticated
  with check (public.is_family_user(family_id)
    and exists (select 1 from public.member m where m.id = member_id and m.family_id = learner_event.family_id));

revoke all on public.learner_event from anon;
revoke all on public.learner_event from authenticated;
grant select, insert on public.learner_event to authenticated;
