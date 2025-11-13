# Site Settings Feature

## Overview
Admin can now customize the homepage hero section and about page content through a dedicated Settings page in the admin panel.

## Features

### Customizable Elements

#### Homepage Hero Section
- **Hero Image**: Upload a portrait photo (recommended 500x500px)
- **Title**: Main headline (default: "The Mind's Fruit")
- **Subtitle**: Tagline (default: "Ideas That Awaken Your Potential")
- **Description**: Welcome message and introduction

#### About Page
- **About Image**: Profile photo for the about page
- **About Title**: Page heading (default: "About Dr. Ferdinand Ibu Ogbaji")
- **About Content**: Full biography text (supports multiple paragraphs)
- **Author Bio**: Short bio used in blog post footers

## Implementation

### Database
- New `site_settings` table with key-value structure
- Settings are cached for performance
- Each setting tracks last update timestamp

### Admin Interface
Location: `/admin/settings`

Features:
- Image uploads via Cloudinary modal
- Text inputs for titles and taglines
- Textareas for longer content
- Save button updates all settings at once
- Reset button reloads from database

### Frontend Integration
- Homepage (`/`) fetches hero settings on server
- About page (`/about`) fetches about settings on server
- Client components handle animations with Framer Motion
- Default values if settings not configured

## Setup Instructions

### 1. Run Database Migration
```powershell
# Connect to your Neon database and run:
psql $env:DATABASE_URL -f scripts/add-settings-migration.sql
```

This will:
- Create the `site_settings` table
- Add an index for performance
- Insert default values for all settings

### 2. Upload Images
1. Navigate to `/admin/settings`
2. Click "Choose File" for Hero Image
3. Upload your portrait photo (500x500px recommended)
4. Repeat for About Page Image
5. Click "Save Settings"

### 3. Customize Content
1. Edit the title, subtitle, and description fields
2. Update the About page content with your story
3. Modify the author bio for blog posts
4. Click "Save Settings" to apply changes

## Benefits

### For Admin
- **No Code Required**: Update content through UI
- **Instant Preview**: Changes reflect immediately on homepage
- **Image Management**: Professional upload modal with Cloudinary
- **Version Control**: Track when settings were last updated

### For Visitors
- **Personalized Experience**: Content reflects admin's current focus
- **Professional Appearance**: Custom photos and messaging
- **Fresh Content**: Admin can update seasonal messaging
- **Consistent Branding**: Centralized content management

## Technical Details

### Server Actions
- `getSetting(key)`: Fetch single setting
- `getSettings(keys)`: Fetch multiple settings
- `getAllSettings()`: Get all settings (admin use)
- `updateSetting(key, value)`: Update or create setting
- `updateSettings(settings)`: Batch update

### Caching
- Settings are cached for performance
- Cache is revalidated on update
- Homepage and about page paths revalidated

### Default Values
All settings have fallback defaults if not configured:
- Hero image: `/portrait-of-inspiring-doctor-and-artist.jpg`
- About image: `/dr-ferdinand-doctor-artist-professional.jpg`
- Text content: Professional default copy

## Usage Tips

### Writing Compelling Copy
- **Hero Title**: Keep it short and memorable (3-5 words)
- **Hero Subtitle**: Clarify your value proposition (5-8 words)
- **Hero Description**: 2-3 sentences about your mission
- **About Content**: Tell your story in 3-4 paragraphs

### Image Best Practices
- Use high-quality photos (at least 500x500px)
- Portrait orientation works best for hero section
- Ensure good lighting and professional appearance
- Consider consistent styling between images

### Content Updates
- Update hero description seasonally
- Refresh about content with new achievements
- Keep author bio current with latest projects
- Test changes on mobile and desktop

## Security

- Only authenticated admins can access `/admin/settings`
- Middleware protects settings page
- Image uploads validated by Cloudinary
- SQL injection prevented by Drizzle ORM

## Future Enhancements

Potential additions:
- Rich text editor for about content
- Multiple hero images (carousel)
- Social media links in settings
- Theme color customization
- SEO metadata management
