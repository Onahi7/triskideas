# TRISKIDEAS Blog & Events Platform - Setup Guide

## Overview
Complete blog and event management system with automated newsletter notifications, image uploads, and rich content editing.

## Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Cloudinary account for image uploads
- Resend account for email notifications

## Installation

1. **Clone and install dependencies**
\`\`\`bash
npm install
\`\`\`

2. **Setup environment variables**
Copy `.env.example` to `.env.local` and fill in your credentials:

\`\`\`bash
# Database - Get from Neon
DATABASE_URL=postgresql://user:password@host/database

# Cloudinary - Get from dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_PRESET=your_upload_preset

# Email - Get from Resend
RESEND_API_KEY=re_xxxxxxxxx

# Admin credentials - Change in production!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

3. **Setup Neon Database**
- Create a PostgreSQL database on Neon
- Run migrations with Drizzle:
\`\`\`bash
npm run db:generate
npm run db:migrate
\`\`\`

4. **Setup Cloudinary**
- Create account at cloudinary.com
- Get Upload Preset (unsigned)
- Add credentials to .env.local

5. **Setup Resend**
- Create account at resend.com
- Generate API key
- Add to .env.local

## Development

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

### Admin Panel
- URL: `http://localhost:3000/admin`
- Default credentials: `admin` / `admin123` (change in .env.local)

### Features

#### Dashboard
- Overview statistics (posts, events, subscribers, views)
- Quick access to all management features

#### Blog Management
- Create posts with TipTap rich editor
- Upload images via Cloudinary
- Set featured/published status
- Auto-notify subscribers on publish
- SEO metadata per post

#### Event Management
- Create free or paid events
- Rich event descriptions with TipTap editor
- Event image uploads
- Set capacity limits
- Automatic subscriber notifications

#### Event Registration
- Free event registrations
- Paid event registrations (Stripe integration ready)
- Automatic confirmation emails
- Registration tracking

#### Subscriber Management
- View all subscribers
- Export subscriber list as CSV
- Track subscription date
- Manage newsletter preferences

## Database Schema

### Posts Table
- id, title, slug, excerpt, content, richContent
- imageUrl, category, author
- featured, published, publishedAt
- viewCount, seoDescription

### Events Table
- id, title, slug, description, richContent
- startDate, endDate, location, capacity
- eventType (free/paid), price
- featured, published

### EventRegistrations Table
- id, eventId, email, firstName, lastName
- paymentStatus, stripeTransactionId, registeredAt

### Subscribers Table
- id, email, subscribedAt

### EmailLogs Table
- id, email, type (post/event), contentId, contentTitle, sentAt

## Production Deployment

1. **Environment Variables**
   - Update ADMIN_USERNAME and ADMIN_PASSWORD
   - Use production database URL
   - Update NEXT_PUBLIC_APP_URL to your domain

2. **Database Migrations**
\`\`\`bash
npm run db:migrate:prod
\`\`\`

3. **Deploy to Vercel**
\`\`\`bash
vercel deploy
\`\`\`

4. **Post-deployment**
   - Verify all environment variables are set
   - Test email notifications
   - Test image uploads
   - Test event registration flow

## Troubleshooting

### Images not uploading
- Check Cloudinary credentials
- Verify upload preset is unsigned
- Check CORS settings

### Emails not sending
- Verify Resend API key
- Check sender domain in Resend dashboard
- Review email logs for errors

### Database connection issues
- Verify DATABASE_URL format
- Check network access in Neon
- Ensure IP is whitelisted

## Security Notes

- Change admin credentials immediately
- Use strong passwords in production
- Enable HTTPS on production
- Review RLS policies if using Supabase
- Keep dependencies updated

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Resend Email](https://resend.com/docs)
