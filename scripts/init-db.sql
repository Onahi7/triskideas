-- Create tables for TRISKIDEAS blog and events platform

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  rich_content TEXT,
  image_url TEXT,
  category VARCHAR(100) DEFAULT 'Uncategorized',
  author VARCHAR(255) NOT NULL,
  read_time_minutes INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  seo_description TEXT
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  rich_content TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR(255),
  capacity INTEGER,
  event_type VARCHAR(20) DEFAULT 'free' NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  stripe_transaction_id TEXT,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  content_id INTEGER NOT NULL,
  content_title VARCHAR(255) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Series table
CREATE TABLE IF NOT EXISTS series (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id SERIAL PRIMARY KEY,
  series_id INTEGER NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(series_id, episode_number),
  UNIQUE(series_id, post_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter popups tracking table
CREATE TABLE IF NOT EXISTS newsletter_popups (
  id SERIAL PRIMARY KEY,
  visitor_id VARCHAR(255) NOT NULL UNIQUE,
  last_shown TIMESTAMP NOT NULL,
  show_count INTEGER DEFAULT 0
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(published);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON email_logs(email);
CREATE INDEX IF NOT EXISTS idx_series_slug ON series(slug);
CREATE INDEX IF NOT EXISTS idx_episodes_series_id ON episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_episodes_post_id ON episodes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);
CREATE INDEX IF NOT EXISTS idx_newsletter_popups_visitor_id ON newsletter_popups(visitor_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Insert default site settings
INSERT INTO site_settings (key, value, updated_at) VALUES
  ('hero_image', '/portrait-of-inspiring-doctor-and-artist.jpg', NOW()),
  ('hero_title', 'The Mind''s Fruit', NOW()),
  ('hero_subtitle', 'Ideas That Awaken Your Potential', NOW()),
  ('hero_description', 'Welcome to TRISKIDEAS. I''m Ferdinand Ibu Ogbaji—a medical doctor, artist, and passionate explorer of human potential. Here, we delve into the intersection of medicine, creativity, and personal transformation.', NOW()),
  ('about_image', '/dr-ferdinand-doctor-artist-professional.jpg', NOW()),
  ('about_title', 'About Dr. Ferdinand Ibu Ogbaji', NOW()),
  ('about_content', 'Hello! I''m Ferdinand, and I''m passionate about helping people reach their full potential by unleashing their God-given abilities to make a positive change in our world.

By profession, I''m a medical doctor. As a pursuit, I''m an artist. I love music, art, reading, travelling, thinking, and exploring new things. These diverse interests have shaped my perspective on human potential and creativity.

I''m married to Florence and we reside in Jos, Nigeria, where I continue to practice medicine, create art, and explore the intersection of healing, creativity, and personal transformation.', NOW()),
  ('author_bio', 'Dr. Ferdinand Ibu Ogbaji is a passionate medical doctor, artist, and thinker based in Jos, Nigeria. He is dedicated to helping people unlock their God-given potential and make positive contributions to society. Married to Florence, Ferdinand combines his medical expertise with artistic creativity to explore transformative ideas.', NOW())
ON CONFLICT (key) DO NOTHING;
