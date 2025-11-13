-- Add comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add newsletter popup tracking table
CREATE TABLE IF NOT EXISTS newsletter_popups (
  id SERIAL PRIMARY KEY,
  visitor_id VARCHAR(255) NOT NULL UNIQUE,
  last_shown TIMESTAMP NOT NULL,
  show_count INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);
CREATE INDEX IF NOT EXISTS idx_newsletter_popups_visitor_id ON newsletter_popups(visitor_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_popups_last_shown ON newsletter_popups(last_shown);
