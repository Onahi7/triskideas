-- Add color theme settings to site_settings table
-- Run this if color settings are not appearing in the admin panel

-- Insert default color theme settings (only if they don't exist)
INSERT INTO site_settings (key, value, created_at, updated_at)
SELECT 'primary_color', '#d97706', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'primary_color');

INSERT INTO site_settings (key, value, created_at, updated_at)
SELECT 'primary_dark_color', '#92400e', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'primary_dark_color');

INSERT INTO site_settings (key, value, created_at, updated_at)
SELECT 'accent_color', '#fed7aa', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'accent_color');

INSERT INTO site_settings (key, value, created_at, updated_at)
SELECT 'background_color', '#fffbeb', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'background_color');

-- Verify the settings were added
SELECT * FROM site_settings WHERE key IN ('primary_color', 'primary_dark_color', 'accent_color', 'background_color');
