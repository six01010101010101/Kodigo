-- ========================================================
-- Kodigo Platform - Chat Sessions & Conversational Memory
-- ========================================================

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL DEFAULT 'cobaloficial1@gmail.com',
  title TEXT NOT NULL DEFAULT 'Conversa com Pytho IA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'pytho')),
  message TEXT NOT NULL,
  code_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for session synchronization
CREATE POLICY "Public chat_sessions access" ON public.chat_sessions FOR ALL USING (true);
CREATE POLICY "Public chat_messages access" ON public.chat_messages FOR ALL USING (true);

-- Enable Supabase Realtime for instant synchronization between Web and Mobile
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions, public.chat_messages;
