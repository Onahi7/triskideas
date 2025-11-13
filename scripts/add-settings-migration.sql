-- Migration: Add site_settings table
-- Description: Store customizable site content (hero images, about content, etc.)

CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Insert default settings
INSERT INTO site_settings (key, value, updated_at) VALUES
  ('hero_image', '/IMG-20251113-WA0001.jpg', NOW()),
  ('hero_title', 'The Mind''s Fruit', NOW()),
  ('hero_subtitle', 'Ideas That Awaken Your Potential', NOW()),
  ('hero_description', 'Welcome to TRISKIDEAS. I''m Ferdinand Ibu Ogbaji—a medical doctor, artist, and passionate explorer of human potential. Here, we delve into the intersection of medicine, creativity, and personal transformation.', NOW()),
  ('about_image', '/IMG-20251113-WA0001.jpg', NOW()),
  ('about_title', 'About Dr. Ferdinand Ibu Ogbaji', NOW()),
  ('about_content', 'Hello! I''m Ferdinand, and I''m passionate about helping people reach their full potential by unleashing their God-given abilities to make a positive change in our world.

By profession, I''m a medical doctor. As a pursuit, I''m an artist. I love music, art, reading, travelling, thinking, and exploring new things. These diverse interests have shaped my perspective on human potential and creativity.

I''m married to Florence and we reside in Jos, Nigeria, where I continue to practice medicine, create art, and explore the intersection of healing, creativity, and personal transformation.', NOW()),
  ('author_bio', 'Dr. Ferdinand Ibu Ogbaji is a passionate medical doctor, artist, and thinker based in Jos, Nigeria. He is dedicated to helping people unlock their God-given potential and make positive contributions to society. Married to Florence, Ferdinand combines his medical expertise with artistic creativity to explore transformative ideas.', NOW())
ON CONFLICT (key) DO NOTHING;
