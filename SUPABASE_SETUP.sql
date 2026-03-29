-- Run this in your Supabase SQL editor

-- Enable RLS
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  plan text default 'basic' check (plan in ('basic','premium')),
  gender text default 'male' check (gender in ('male','female')),
  frequency text default 'F3' check (frequency in ('F3','F4')),
  avatar_config jsonb default null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Add archetype and training_level columns (run this if you already ran the first SQL)
alter table public.profiles add column if not exists archetype text default 'street';
alter table public.profiles add column if not exists training_level text default 'beginner';
alter table public.profiles add column if not exists goal text default 'volume';
