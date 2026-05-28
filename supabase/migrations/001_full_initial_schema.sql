-- 001_full_initial_schema.sql
-- Consolidated Initial Schema for Connect Four Tatti

-- 1. Enums for type safety
DO $$ BEGIN
    CREATE TYPE game_mode AS ENUM ('local', 'bot', 'online');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE match_status AS ENUM ('playing', 'won', 'draw', 'abandoned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE bot_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table (Must be first for references)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  city TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- 3. Utility Functions & Triggers for Profiles
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = timezone('utc', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Auth Hook for Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, city)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    ''
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = excluded.email,
    display_name = COALESCE(NULLIF(public.profiles.display_name, ''), excluded.display_name);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Matches Table
DROP TABLE IF EXISTS matches CASCADE;
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_mode game_mode NOT NULL DEFAULT 'local',
    player_1_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    player_2_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL for bots
    bot_difficulty bot_difficulty,
    status match_status NOT NULL DEFAULT 'playing',
    winner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    move_count INTEGER NOT NULL DEFAULT 0,
    coach_insight TEXT,
    reward_label TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Leaderboards Table
DROP TABLE IF EXISTS leaderboards CASCADE;
CREATE TABLE leaderboards (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER DEFAULT 1200 NOT NULL,
    matches_played INTEGER DEFAULT 0 NOT NULL,
    wins_bot INTEGER DEFAULT 0 NOT NULL,
    wins_online INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Profiles are readable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile" ON profiles FOR ALL USING (auth.uid() = id);

-- Match Policies
CREATE POLICY "Users can view all matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Users can insert their own matches" ON matches
    FOR INSERT WITH CHECK (
        auth.uid() = player_1_id OR 
        (player_1_id IS NULL AND auth.uid() IS NULL)
    );

-- Leaderboard Policies
CREATE POLICY "Public leaderboard visibility" ON leaderboards FOR SELECT USING (true);
-- No direct INSERT/UPDATE allowed for users to prevent score manipulation. 
-- Updates happen via Security Definer trigger.

-- 7. Leaderboard Update Trigger
CREATE OR REPLACE FUNCTION update_leaderboard_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO leaderboards (user_id, matches_played, wins_bot, wins_online, updated_at)
    VALUES (
        NEW.player_1_id, 
        1, 
        CASE WHEN NEW.game_mode = 'bot' AND NEW.winner_id = NEW.player_1_id THEN 1 ELSE 0 END,
        CASE WHEN NEW.game_mode = 'online' AND NEW.winner_id = NEW.player_1_id THEN 1 ELSE 0 END,
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        matches_played = leaderboards.matches_played + 1,
        wins_bot = leaderboards.wins_bot + (CASE WHEN NEW.game_mode = 'bot' AND NEW.winner_id = NEW.player_1_id THEN 1 ELSE 0 END),
        wins_online = leaderboards.wins_online + (CASE WHEN NEW.game_mode = 'online' AND NEW.winner_id = NEW.player_1_id THEN 1 ELSE 0 END),
        updated_at = now()
    WHERE NEW.player_1_id IS NOT NULL;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_match_completed ON matches;
CREATE TRIGGER on_match_completed
    AFTER INSERT ON matches
    FOR EACH ROW
    WHEN (NEW.status IN ('won', 'draw'))
    EXECUTE FUNCTION update_leaderboard_stats();
