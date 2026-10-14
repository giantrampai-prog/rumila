-- Rumila: siap ramai (ribuan pengguna aktif bersamaan).
-- 1) Aturan RLS tabel besar memakai sub-kueri rumah milik akun (dievaluasi SEKALI per kueri) alih-alih
--    memanggil fungsi pengecek untuk SETIAP baris.
-- 2) Indeks untuk kueri yang sering: aktivitas per rumah + tanggal (muat Laporan), pembuat rumah (FK).

create index if not exists activity_family_time_idx on public.activity_log(family_id, started_at);
create index if not exists family_created_by_idx on public.family(created_by);

-- activity_log
drop policy if exists activity_select on public.activity_log;
create policy activity_select on public.activity_log for select to authenticated
  using (family_id in (select fu.family_id from public.family_user fu where fu.user_id = (select auth.uid())));
drop policy if exists activity_update on public.activity_log;
create policy activity_update on public.activity_log for update to authenticated
  using (family_id in (select fu.family_id from public.family_user fu where fu.user_id = (select auth.uid())))
  with check (family_id in (select fu.family_id from public.family_user fu where fu.user_id = (select auth.uid())));

-- member
drop policy if exists member_select on public.member;
create policy member_select on public.member for select to authenticated
  using (family_id in (select fu.family_id from public.family_user fu where fu.user_id = (select auth.uid())));

-- member_permission: lewat anggota milik rumah akun
drop policy if exists perm_select on public.member_permission;
create policy perm_select on public.member_permission for select to authenticated
  using (member_id in (select m.id from public.member m join public.family_user fu on fu.family_id = m.family_id where fu.user_id = (select auth.uid())));

-- game_save
drop policy if exists game_save_select on public.game_save;
create policy game_save_select on public.game_save for select to authenticated
  using (family_id in (select fu.family_id from public.family_user fu where fu.user_id = (select auth.uid())));
drop policy if exists game_save_delete on public.game_save;
create policy game_save_delete on public.game_save for delete to authenticated
  using (family_id in (select fu.family_id from public.family_user fu where fu.user_id = (select auth.uid())));
