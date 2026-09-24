-- ========================================================================
-- MODELFORGE SUPABASE SCHEMA
-- Execute this script in your Supabase SQL Editor (https://supabase.com)
-- ========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Synced with Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'researcher',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Experiments Table
create table if not exists public.experiments (
  id text primary key,
  user_id uuid references auth.users on delete set null,
  model_id text not null,
  model_name text not null,
  task text not null,
  category text not null,
  input_data jsonb not null default '{}'::jsonb,
  output_data jsonb not null default '{}'::jsonb,
  execution_time_ms integer default 0,
  status text default 'success',
  is_favorite boolean default false,
  tags text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Workflows Table
create table if not exists public.workflows (
  id text primary key,
  user_id uuid references auth.users on delete set null,
  title text not null,
  description text,
  category text,
  nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Workflow Executions Table
create table if not exists public.workflow_executions (
  id uuid default uuid_generate_v4() primary key,
  workflow_id text references public.workflows(id) on delete cascade,
  user_id uuid references auth.users on delete set null,
  total_execution_time_ms integer default 0,
  status text default 'completed',
  step_results jsonb not null default '{}'::jsonb,
  logs jsonb not null default '[]'::jsonb,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.experiments enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_executions enable row level security;

-- Policies
create policy "Allow public read access to experiments" on public.experiments for select using (true);
create policy "Allow authenticated inserts to experiments" on public.experiments for insert with check (true);
create policy "Allow experiment updates" on public.experiments for update using (true);
create policy "Allow experiment deletions" on public.experiments for delete using (true);

create policy "Allow public read access to workflows" on public.workflows for select using (true);
create policy "Allow workflow modifications" on public.workflows for all using (true);
