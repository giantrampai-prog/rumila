-- Rumila Finance: akun, transaksi, budget, goals, tagihan, cicilan (+ dokumen), investasi, aset, utang-piutang.
-- id teks unik per rumah (PK: family_id + id) agar id dari aplikasi tetap stabil.

create table public.fin_account (
  family_id uuid not null references public.family(id) on delete cascade,
  id text not null check (char_length(id) <= 40),
  name text not null check (char_length(name) <= 60),
  short text not null default '' check (char_length(short) <= 8),
  kind text not null check (kind in ('Kas','Bank','E-Wallet','RDN')),
  color text not null,
  init_balance bigint not null default 0,
  keys text[] not null default '{}',
  sort integer not null default 0,
  primary key (family_id, id)
);

create table public.fin_tx (
  family_id uuid not null references public.family(id) on delete cascade,
  id text not null check (char_length(id) <= 60),
  type text not null check (type in ('out','in','tf','sd')),
  category text not null default '' check (char_length(category) <= 40),
  note text not null default '' check (char_length(note) <= 200),
  amount bigint not null check (amount > 0),
  occurred_on date not null default current_date,
  by_name text not null default '' check (char_length(by_name) <= 40),
  account_id text not null,
  to_account_id text,
  created_at timestamptz not null default now(),
  primary key (family_id, id)
);
create index fin_tx_date_idx on public.fin_tx(family_id, occurred_on desc);

create table public.fin_budget (
  family_id uuid not null references public.family(id) on delete cascade,
  category text not null check (char_length(category) <= 40),
  monthly_limit bigint not null check (monthly_limit >= 0),
  primary key (family_id, category)
);

create table public.fin_goal (
  family_id uuid not null references public.family(id) on delete cascade,
  id text not null check (char_length(id) <= 40),
  name text not null check (char_length(name) <= 60),
  icon text not null default 'flag',
  color text not null,
  saved bigint not null default 0 check (saved >= 0),
  target bigint not null check (target > 0),
  step bigint not null default 0 check (step >= 0),
  due text not null default '',
  sort integer not null default 0,
  primary key (family_id, id)
);

create table public.fin_bill (
  family_id uuid not null references public.family(id) on delete cascade,
  id text not null check (char_length(id) <= 40),
  name text not null check (char_length(name) <= 60),
  icon text not null default 'receipt',
  color text not null,
  amount bigint not null check (amount >= 0),
  due_day integer not null,
  due_label text not null default '',
  paid boolean not null default false,
  primary key (family_id, id)
);

create table public.fin_investment (
  family_id uuid not null references public.family(id) on delete cascade,
  id text not null check (char_length(id) <= 40),
  name text not null check (char_length(name) <= 60),
  kind text not null default '',
  icon text not null default 'trending_up',
  color text not null,
  qty numeric not null default 0 check (qty >= 0),
  avg_price numeric not null default 0,
  price numeric not null default 0,
  unit text not null default '',
  step numeric not null default 1,
  primary key (family_id, id)
);

create table public.fin_asset (
  family_id uuid not null references public.family(id) on delete cascade,
  id text not null check (char_length(id) <= 40),
  name text not null check (char_length(name) <= 60),
  icon text not null default 'home',
  color text not null,
  buy_price bigint not null default 0,
  value bigint not null default 0,
  year text not null default '',
  primary key (family_id, id)
);

create table public.fin_debt (
  family_id uuid not null references public.family(id) on delete cascade,
  id text not null check (char_length(id) <= 40),
  kind text not null check (kind in ('utang','piutang')),
  name text not null check (char_length(name) <= 60),
  who text not null default '',
  icon text not null default 'credit_card',
  color text not null,
  total bigint not null check (total >= 0),
  paid bigint not null default 0 check (paid >= 0),
  step bigint not null default 0,
  primary key (family_id, id)
);

create table public.fin_installment (
  family_id uuid not null references public.family(id) on delete cascade,
  id text not null check (char_length(id) <= 40),
  name text not null check (char_length(name) <= 60),
  kind text not null default 'Lainnya',
  lender text not null default '',
  amount bigint not null check (amount >= 0),
  tenor integer not null check (tenor > 0),
  paid integer not null default 0 check (paid >= 0),
  start_month text not null check (start_month ~ '^[0-9]{4}-[0-9]{2}$'),
  due_day integer not null check (due_day between 1 and 31),
  account_id text not null,
  doc_name text,
  doc_size text,
  doc_type text check (doc_type in ('pdf','img','other','demo')),
  doc_path text,
  primary key (family_id, id)
);

-- ---------- RLS: satu kebijakan per rumah untuk semua tabel finance ----------
do $$
declare t text;
begin
  foreach t in array array['fin_account','fin_tx','fin_budget','fin_goal','fin_bill','fin_investment','fin_asset','fin_debt','fin_installment'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_family_user(family_id)) with check (public.is_family_user(family_id))', t || '_family', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- ---------- Storage: dokumen kontrak, privat per rumah (folder pertama = family_id) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 10485760, array['application/pdf','image/png','image/jpeg','image/webp','image/heic'])
on conflict (id) do nothing;

create or replace function public.family_of_path(p text)
returns uuid language plpgsql immutable set search_path = '' as $$
begin
  return (string_to_array(p, '/'))[1]::uuid;
exception when others then
  return null;
end $$;

create policy documents_select on storage.objects for select to authenticated
  using (bucket_id = 'documents' and public.is_family_user(public.family_of_path(name)));
create policy documents_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and public.is_family_user(public.family_of_path(name)));
create policy documents_update on storage.objects for update to authenticated
  using (bucket_id = 'documents' and public.is_family_user(public.family_of_path(name)))
  with check (bucket_id = 'documents' and public.is_family_user(public.family_of_path(name)));
create policy documents_delete on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and public.is_family_user(public.family_of_path(name)));

revoke execute on function public.family_of_path(text) from public, anon;
grant execute on function public.family_of_path(text) to authenticated;
