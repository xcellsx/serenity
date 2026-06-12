-- ============================================================
-- Serenity database schema
-- Run this in the Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run (uses "if not exists" / "drop ... if exists").
-- ============================================================

-- 1. Profile (one row per user, including anonymous users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  comfort_word text,
  notifications_enabled boolean default false,
  theme text default 'light',
  reduce_motion boolean default false,
  high_contrast boolean default false,
  created_at timestamptz default now()
);

-- 2. Mood / energy check-ins
create table if not exists public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mood text,                       -- 'happy' | 'neutral' | 'distressed' | ...
  energy int,                      -- 1..4 (low → high)
  note text,
  created_at timestamptz default now()
);
create index if not exists mood_entries_user_created_idx
  on public.mood_entries (user_id, created_at desc);

-- 3. Tasks (the brain-dumped item)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  status text default 'active',    -- 'active' | 'done'
  encouragement text,              -- short calm note from the AI
  created_at timestamptz default now(),
  completed_at timestamptz
);
create index if not exists tasks_user_created_idx
  on public.tasks (user_id, created_at desc);

-- 4. Subtasks (the "debulked" pieces of a task)
create table if not exists public.subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  text text not null,
  done boolean default false,
  position int default 0,
  created_at timestamptz default now()
);
create index if not exists subtasks_task_idx on public.subtasks (task_id, position);

-- ============================================================
-- Row Level Security: every user can only touch their own rows
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.mood_entries enable row level security;
alter table public.tasks        enable row level security;
alter table public.subtasks     enable row level security;

drop policy if exists "own profile"  on public.profiles;
drop policy if exists "own moods"    on public.mood_entries;
drop policy if exists "own tasks"    on public.tasks;
drop policy if exists "own subtasks" on public.subtasks;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own moods" on public.mood_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own subtasks" on public.subtasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Auto-create a profile row whenever a new user is created
-- (works for anonymous sign-ins too)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
