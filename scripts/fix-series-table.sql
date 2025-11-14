-- Fix series table to match the schema definition

-- First, check if the series table exists and has the wrong structure
-- Drop the old series table if it exists with the wrong structure
DROP TABLE IF EXISTS episodes;
DROP TABLE IF EXISTS series;

-- Create the correct series table structure
CREATE TABLE IF NOT EXISTS series (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the correct episodes table structure
CREATE TABLE IF NOT EXISTS episodes (
  id SERIAL PRIMARY KEY,
  series_id INTEGER NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  episode_number INTEGER NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  rich_content TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  view_count INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_series_name ON series(name);
CREATE INDEX IF NOT EXISTS idx_series_slug ON series(slug);
CREATE INDEX IF NOT EXISTS idx_series_published ON series(published);
CREATE INDEX IF NOT EXISTS idx_series_featured ON series(featured);
CREATE INDEX IF NOT EXISTS idx_episodes_series_id ON episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_episodes_slug ON episodes(slug);
CREATE INDEX IF NOT EXISTS idx_episodes_published ON episodes(published);
CREATE INDEX IF NOT EXISTS idx_episodes_episode_number ON episodes(episode_number);

-- Insert some sample series data
INSERT INTO series (name, slug, description, featured, published) VALUES
  ('Medical Insights', 'medical-insights', 'Exploring the intersection of medicine and human potential', true, true),
  ('Creative Journey', 'creative-journey', 'Art, music, and creative expression in personal development', false, true),
  ('Life Reflections', 'life-reflections', 'Thoughts on personal growth and transformation', false, false)
ON CONFLICT (name) DO NOTHING;

COMMIT;