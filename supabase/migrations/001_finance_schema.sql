-- Finance AI Assistant schema tailored for Clerk-authenticated users
create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id serial primary key,
  user_id text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

alter table public.categories enable row level security;

drop policy if exists "User can view their own categories" on public.categories;
create policy "User can view their own categories"
  on public.categories for select to authenticated
  using ((auth.jwt()->>'sub') = user_id);

drop policy if exists "User can insert their own categories" on public.categories;
create policy "User can insert their own categories"
  on public.categories for insert to authenticated
  with check ((auth.jwt()->>'sub') = user_id);

drop policy if exists "User can update their own categories" on public.categories;
create policy "User can update their own categories"
  on public.categories for update to authenticated
  using ((auth.jwt()->>'sub') = user_id);

drop policy if exists "User can delete their own categories" on public.categories;
create policy "User can delete their own categories"
  on public.categories for delete to authenticated
  using ((auth.jwt()->>'sub') = user_id);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  amount numeric(10, 2) not null,
  type text not null check (type in ('income', 'expense')),
  category_id int references public.categories(id) on delete set null,
  description text,
  transaction_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

drop policy if exists "User can view their own transactions" on public.transactions;
create policy "User can view their own transactions"
  on public.transactions for select to authenticated
  using ((auth.jwt()->>'sub') = user_id);

drop policy if exists "User can insert their own transactions" on public.transactions;
create policy "User can insert their own transactions"
  on public.transactions for insert to authenticated
  with check ((auth.jwt()->>'sub') = user_id);

drop policy if exists "User can update their own transactions" on public.transactions;
create policy "User can update their own transactions"
  on public.transactions for update to authenticated
  using ((auth.jwt()->>'sub') = user_id);

drop policy if exists "User can delete their own transactions" on public.transactions;
create policy "User can delete their own transactions"
  on public.transactions for delete to authenticated
  using ((auth.jwt()->>'sub') = user_id);

create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_date on public.transactions(transaction_date desc);
create index if not exists idx_transactions_category on public.transactions(category_id);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  type text not null,
  current_value numeric(12, 2) not null,
  last_updated timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.assets enable row level security;

drop policy if exists "User can view their own assets" on public.assets;
create policy "User can view their own assets"
  on public.assets for select to authenticated
  using ((auth.jwt()->>'sub') = user_id);

drop policy if exists "User can insert their own assets" on public.assets;
create policy "User can insert their own assets"
  on public.assets for insert to authenticated
  with check ((auth.jwt()->>'sub') = user_id);

drop policy if exists "User can update their own assets" on public.assets;
create policy "User can update their own assets"
  on public.assets for update to authenticated
  using ((auth.jwt()->>'sub') = user_id);

drop policy if exists "User can delete their own assets" on public.assets;
create policy "User can delete their own assets"
  on public.assets for delete to authenticated
  using ((auth.jwt()->>'sub') = user_id);

create index if not exists idx_assets_user_id on public.assets(user_id);
create index if not exists idx_assets_type on public.assets(type);

