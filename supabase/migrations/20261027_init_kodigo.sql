-- ========================================================
-- Kodigo Platform - Database Schema & Realtime Setup
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 100,
  hearts INTEGER DEFAULT 5,
  max_hearts INTEGER DEFAULT 5,
  streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  is_pro BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tracks Table
CREATE TABLE IF NOT EXISTS public.tracks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  total_units INTEGER DEFAULT 4,
  badge_color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Units Table
CREATE TABLE IF NOT EXISTS public.units (
  id TEXT PRIMARY KEY,
  track_id TEXT REFERENCES public.tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 20,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 6. User Challenge History Table
CREATE TABLE IF NOT EXISTS public.user_challenge_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_title TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  selected_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI Tutor Conversations Log
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  reply TEXT NOT NULL,
  code_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Realtime publication for dynamic progress updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles, public.user_progress;
