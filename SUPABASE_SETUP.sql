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
