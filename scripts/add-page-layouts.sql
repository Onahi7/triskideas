-- Add page_layouts table for visual editor
CREATE TABLE IF NOT EXISTS page_layouts (
  id SERIAL PRIMARY KEY,
  page_name VARCHAR(100) NOT NULL UNIQUE,
  sections JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default homepage layout
INSERT INTO page_layouts (page_name, sections)
VALUES ('homepage', '[]'::jsonb)
ON CONFLICT (page_name) DO NOTHING;

-- Create index on page_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_layouts_page_name ON page_layouts(page_name);

-- Verify
SELECT * FROM page_layouts;
