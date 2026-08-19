-- ==============================================================================
-- CINEXUS (සිනෙක්ස්) - Supabase PostgreSQL Database Setup & Realtime Configuration
-- Run this SQL in your Supabase SQL Editor to provision tables, security rules, and realtime.
-- ==============================================================================

-- 1. Create movies table
CREATE TABLE IF NOT EXISTS public.movies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sinhala_title TEXT DEFAULT '',
  original_title TEXT,
  year INTEGER DEFAULT 2024,
  imdb_rating NUMERIC DEFAULT 8.0,
  duration TEXT DEFAULT '2h 00m',
  quality_badge TEXT DEFAULT '1080p WEB-DL',
  poster_url TEXT NOT NULL,
  backdrop_url TEXT DEFAULT '',
  trailer_url TEXT DEFAULT '',
  stream_server1_url TEXT DEFAULT '',
  stream_server2_url TEXT DEFAULT '',
  stream_server3_url TEXT DEFAULT '',
  trailer_embed_url TEXT DEFAULT '',
  sinhala_plot TEXT DEFAULT '',
  english_plot TEXT DEFAULT '',
  genres JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '["English"]'::jsonb,
  language TEXT DEFAULT 'English',
  content_type TEXT DEFAULT 'Sinhala Sub',
  cast_data JSONB DEFAULT '[]'::jsonb,
  director TEXT DEFAULT 'Unknown',
  audio_language TEXT DEFAULT 'English',
  subtitle_source_url TEXT DEFAULT '',
  servers JSONB DEFAULT '[]'::jsonb,
  download_links JSONB DEFAULT '[]'::jsonb,
  has_sinhala_sub BOOLEAN DEFAULT true,
  is_dual_audio BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_tv_series BOOLEAN DEFAULT false,
  seasons_count INTEGER DEFAULT 0,
  episodes_count INTEGER DEFAULT 0,
  episodes JSONB DEFAULT '[]'::jsonb,
  views_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  added_at TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create movie_requests table (with admin_reply system)
CREATE TABLE IF NOT EXISTS public.movie_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_username TEXT DEFAULT '',
  user_email TEXT NOT NULL,
  movie_name TEXT NOT NULL,
  year TEXT DEFAULT '',
  language TEXT DEFAULT 'English',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'PENDING',
  admin_reply TEXT DEFAULT '',
  admin_replied_at TIMESTAMPTZ,
  email_status TEXT DEFAULT 'SENT',
  email_sent_to TEXT DEFAULT '',
  email_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies for movies
DROP POLICY IF EXISTS "Public can read all movies" ON public.movies;
CREATE POLICY "Public can read all movies"
  ON public.movies FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert movies" ON public.movies;
CREATE POLICY "Allow insert movies"
  ON public.movies FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update movies" ON public.movies;
CREATE POLICY "Allow update movies"
  ON public.movies FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow delete movies" ON public.movies;
CREATE POLICY "Allow delete movies"
  ON public.movies FOR DELETE
  USING (true);

-- 6. Row Level Security Policies for movie_requests
DROP POLICY IF EXISTS "Public can read movie requests" ON public.movie_requests;
CREATE POLICY "Public can read movie requests"
  ON public.movie_requests FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can create movie requests" ON public.movie_requests;
CREATE POLICY "Public can create movie requests"
  ON public.movie_requests FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update movie requests" ON public.movie_requests;
CREATE POLICY "Allow update movie requests"
  ON public.movie_requests FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow delete movie requests" ON public.movie_requests;
CREATE POLICY "Allow delete movie requests"
  ON public.movie_requests FOR DELETE
  USING (true);

-- 7. Row Level Security Policies for site_settings
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert/update site settings" ON public.site_settings;
CREATE POLICY "Allow insert/update site settings"
  ON public.site_settings FOR ALL
  USING (true);

-- 8. Add Tables to Supabase Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'movies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.movies;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'movie_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.movie_requests;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'site_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
  END IF;
END $$;
