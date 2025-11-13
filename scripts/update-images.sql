-- Update existing image settings to use new uploaded image
-- Description: Replace hero and about images with IMG-20251113-WA0001.jpg

UPDATE site_settings 
SET value = '/IMG-20251113-WA0001.jpg', updated_at = NOW() 
WHERE key = 'hero_image';

UPDATE site_settings 
SET value = '/IMG-20251113-WA0001.jpg', updated_at = NOW() 
WHERE key = 'about_image';

-- Verify the updates
SELECT key, value FROM site_settings WHERE key IN ('hero_image', 'about_image');