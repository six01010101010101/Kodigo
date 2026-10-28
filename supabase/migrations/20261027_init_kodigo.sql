-- Kodigo: core schema (profiles, curriculum, progress). RLS enabled on every table.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  xp integer not null default 0 check (xp >= 0),
  gems integer not null default 100 check (gems >= 0),
  hearts integer not null default 5 check (hearts between 0 and 5),
  streak integer not null default 0 check (streak >= 0),
  is_pro boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tracks (
  id text primary key,
  name text not null,
  language text not null,
  icon text not null,
  description text not null,
  position integer not null default 0
);

create table if not exists public.units (
  id text primary key,
  track_id text not null references public.tracks(id) on delete cascade,
  title text not null,
  description text not null,
  position integer not null
);
create index if not exists idx_units_track on public.units(track_id);

create table if not exists public.lessons (
  id text primary key,
  unit_id text not null references public.units(id) on delete cascade,
  title text not null,
  xp_reward integer not null default 20 check (xp_reward >= 0),
  position integer not null
);
create index if not exists idx_lessons_unit on public.lessons(unit_id);

create table if not exists public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index if not exists idx_user_progress_lesson on public.user_progress(lesson_id);

create table if not exists public.user_challenge_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_title text not null,
  is_correct boolean not null,
  selected_answer text not null,
  correct_answer text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_history_user on public.user_challenge_history(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.tracks enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_challenge_history enable row level security;

-- Public read-only curriculum
create policy "curriculum read tracks" on public.tracks for select to anon, authenticated using (true);
create policy "curriculum read units" on public.units for select to anon, authenticated using (true);
create policy "curriculum read lessons" on public.lessons for select to anon, authenticated using (true);

-- Owner-only user data
create policy "profiles select own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles update own" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "progress select own" on public.user_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "progress insert own" on public.user_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "history select own" on public.user_challenge_history for select to authenticated using ((select auth.uid()) = user_id);
create policy "history insert own" on public.user_challenge_history for insert to authenticated with check ((select auth.uid()) = user_id);

-- Clients may only edit cosmetic columns; xp/gems/hearts/streak/is_pro are server-controlled.
revoke update on public.profiles from authenticated, anon;
grant update (username, avatar_url) on public.profiles to authenticated;

-- Auto-create a profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', split_part(new.email, '@', 1)) || '_' || substr(new.id::text, 1, 4),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

alter publication supabase_realtime add table public.profiles, public.user_progress;
