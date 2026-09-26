-- Rumila: rumah (family), akun login, anggota, izin, log aktivitas.
create extension if not exists pgcrypto with schema extensions;

create table public.family (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 60),
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Akun login yang boleh membuka sebuah rumah
create table public.family_user (
  family_id uuid not null references public.family(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (family_id, user_id)
);
create index family_user_user_idx on public.family_user(user_id);

create table public.member (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.family(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 24),
  color_key text not null check (color_key in ('orange','red','pink','purple','indigo','blue','sky','teal','green','lime','gold','space')),
  is_admin boolean not null default false,
  pin_hash text,
  has_pin boolean generated always as (pin_hash is not null) stored,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
create index member_family_idx on public.member(family_id);
-- Tepat satu Admin per rumah
create unique index member_one_admin on public.member(family_id) where is_admin;

create table public.member_permission (
  member_id uuid not null references public.member(id) on delete cascade,
  key text not null check (key in ('game','coding','doa','ibadah','angkasa','edukasi','keluarga','kesehatan','keuangan','laporan','finance')),
  primary key (member_id, key)
);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.family(id) on delete cascade,
  member_id uuid not null references public.member(id) on delete cascade,
  tool_id text not null check (char_length(tool_id) <= 40),
  started_at timestamptz not null default now(),
  duration_sec integer not null default 0 check (duration_sec >= 0),
  progress_pct smallint check (progress_pct between 0 and 100),
  event text check (event in ('session','material_complete','exercise_complete')),
  part_id text check (char_length(part_id) <= 80)
);
create index activity_family_member_idx on public.activity_log(family_id, member_id, started_at desc);
create index activity_member_idx on public.activity_log(member_id);

-- ---------- helper ----------
create or replace function public.is_family_user(fid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.family_user fu where fu.family_id = fid and fu.user_id = (select auth.uid()));
$$;

-- ---------- RLS ----------
alter table public.family enable row level security;
alter table public.family_user enable row level security;
alter table public.member enable row level security;
alter table public.member_permission enable row level security;
alter table public.activity_log enable row level security;

create policy family_select on public.family for select to authenticated using (public.is_family_user(id));
create policy family_update on public.family for update to authenticated using (public.is_family_user(id)) with check (public.is_family_user(id));

create policy family_user_select on public.family_user for select to authenticated using (user_id = (select auth.uid()));

create policy member_select on public.member for select to authenticated using (public.is_family_user(family_id));
create policy member_insert on public.member for insert to authenticated with check (public.is_family_user(family_id) and not is_admin);
create policy member_update on public.member for update to authenticated using (public.is_family_user(family_id)) with check (public.is_family_user(family_id));
create policy member_delete on public.member for delete to authenticated using (public.is_family_user(family_id) and not is_admin);

create policy perm_select on public.member_permission for select to authenticated
  using (exists (select 1 from public.member m where m.id = member_id and public.is_family_user(m.family_id)));
create policy perm_insert on public.member_permission for insert to authenticated
  with check (exists (select 1 from public.member m where m.id = member_id and public.is_family_user(m.family_id)));
create policy perm_delete on public.member_permission for delete to authenticated
  using (exists (select 1 from public.member m where m.id = member_id and public.is_family_user(m.family_id)));

create policy activity_select on public.activity_log for select to authenticated using (public.is_family_user(family_id));
create policy activity_insert on public.activity_log for insert to authenticated
  with check (public.is_family_user(family_id)
    and exists (select 1 from public.member m where m.id = member_id and m.family_id = activity_log.family_id));
create policy activity_update on public.activity_log for update to authenticated
  using (public.is_family_user(family_id)) with check (public.is_family_user(family_id));

-- ---------- hak kolom: pin_hash & is_admin tidak bisa dibaca/diubah langsung dari klien ----------
revoke all on public.family, public.family_user, public.member, public.member_permission, public.activity_log from anon;
revoke all on public.family, public.family_user, public.member, public.member_permission, public.activity_log from authenticated;
grant select on public.family to authenticated;
grant update (name) on public.family to authenticated;
grant select on public.family_user to authenticated;
grant select (id, family_id, name, color_key, is_admin, has_pin, sort, created_at) on public.member to authenticated;
grant insert (id, family_id, name, color_key, sort) on public.member to authenticated;
grant update (name, color_key, sort) on public.member to authenticated;
grant delete on public.member to authenticated;
grant select, insert, delete on public.member_permission to authenticated;
grant select, insert on public.activity_log to authenticated;
grant update (duration_sec, progress_pct) on public.activity_log to authenticated;

-- ---------- RPC ----------
-- Daftar → buat rumah: pembuat otomatis Admin dengan akses penuh.
create or replace function public.create_family(p_family_name text, p_admin_name text, p_color text, p_pin text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := (select auth.uid());
  fid uuid;
  mid uuid;
begin
  if uid is null then raise exception 'Belum masuk akun'; end if;
  if exists (select 1 from public.family_user where user_id = uid) then raise exception 'Akun ini sudah punya rumah'; end if;
  if p_pin is not null and p_pin !~ '^[0-9]{4}$' then raise exception 'PIN harus 4 angka'; end if;
  insert into public.family(name, created_by) values (trim(p_family_name), uid) returning id into fid;
  insert into public.family_user(family_id, user_id) values (fid, uid);
  insert into public.member(family_id, name, color_key, is_admin, pin_hash)
    values (fid, trim(p_admin_name), p_color, true,
            case when p_pin is null then null else extensions.crypt(p_pin, extensions.gen_salt('bf')) end)
    returning id into mid;
  insert into public.member_permission(member_id, key)
    select mid, k from unnest(array['game','coding','doa','ibadah','angkasa','edukasi','keluarga','kesehatan','keuangan','laporan','finance']) k;
  return fid;
end $$;

create or replace function public.verify_member_pin(p_member uuid, p_pin text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.member m
    where m.id = p_member and public.is_family_user(m.family_id)
      and m.pin_hash is not null and m.pin_hash = extensions.crypt(p_pin, m.pin_hash));
$$;

create or replace function public.set_member_pin(p_member uuid, p_pin text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_pin is not null and p_pin !~ '^[0-9]{4}$' then raise exception 'PIN harus 4 angka'; end if;
  update public.member
     set pin_hash = case when p_pin is null then null else extensions.crypt(p_pin, extensions.gen_salt('bf')) end
   where id = p_member and public.is_family_user(family_id);
  if not found then raise exception 'Anggota tidak ditemukan'; end if;
end $$;

-- Pindahkan peran Admin secara atomik (admin lama jadi User).
create or replace function public.make_admin(p_member uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare fid uuid;
begin
  select family_id into fid from public.member where id = p_member;
  if fid is null or not public.is_family_user(fid) then raise exception 'Anggota tidak ditemukan'; end if;
  update public.member set is_admin = false where family_id = fid and is_admin and id <> p_member;
  update public.member set is_admin = true where id = p_member;
end $$;

revoke execute on function public.create_family(text, text, text, text) from public, anon;
revoke execute on function public.verify_member_pin(uuid, text) from public, anon;
revoke execute on function public.set_member_pin(uuid, text) from public, anon;
revoke execute on function public.make_admin(uuid) from public, anon;
revoke execute on function public.is_family_user(uuid) from public, anon;
grant execute on function public.create_family(text, text, text, text) to authenticated;
grant execute on function public.verify_member_pin(uuid, text) to authenticated;
grant execute on function public.set_member_pin(uuid, text) to authenticated;
grant execute on function public.make_admin(uuid) to authenticated;
grant execute on function public.is_family_user(uuid) to authenticated;
