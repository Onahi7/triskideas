-- Migration: Add 7-color professional palette to site_settings
-- Description: Expand color theme from 4 to 7 colors for professional design control

-- Add new color settings (3 new colors: primary_light, text_primary, text_secondary)
INSERT INTO site_settings (key, value, updated_at) VALUES
  ('primary_color', '#d97706', NOW()),
  ('primary_dark_color', '#92400e', NOW()),
  ('primary_light_color', '#fef3c7', NOW()),
  ('accent_color', '#fed7aa', NOW()),
  ('background_color', '#fffbeb', NOW()),
  ('text_primary_color', '#111827', NOW()),
  ('text_secondary_color', '#6b7280', NOW())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Comment: This migration adds 3 new color settings to the existing 4-color system:
-- - primary_light_color: Light backgrounds and subtle highlights
-- - text_primary_color: Main text and headings
-- - text_secondary_color: Descriptions, captions, and meta text
-- 
-- This enables professional-level design customization with preset options:
-- AMBER (warm), BLUE (professional), GREEN (fresh), PURPLE (creative), RED (bold), SLATE (modern), TEAL (ocean)
