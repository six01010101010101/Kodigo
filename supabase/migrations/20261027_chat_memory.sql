-- Kodigo: Pytho chat history. Owner-only access; realtime enabled for web + mobile sync.

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Conversa com Pytho',
  created_at timestamptz not null default now()
);
create index if not exists idx_chat_sessions_user on public.chat_sessions(user_id, created_at desc);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  sender text not null check (sender in ('user', 'pytho')),
  message text not null check (char_length(message) between 1 and 8000),
  code_snippet text,
  created_at timestamptz not null default now()
);
create index if not exists idx_chat_messages_session on public.chat_messages(session_id, created_at);
create index if not exists idx_chat_messages_user on public.chat_messages(user_id);

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

create policy "sessions own" on public.chat_sessions for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "messages own" on public.chat_messages for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.chat_sessions s where s.id = session_id and s.user_id = (select auth.uid()))
  );

alter publication supabase_realtime add table public.chat_messages;
