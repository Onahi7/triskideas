# TRISKIDEAS: The Mind's Fruit

A complete blog and event management platform for Dr. Ferdinand Ibu Ogbaji - built with Next.js, Neon PostgreSQL, Drizzle ORM, TipTap rich editor, Cloudinary, and Resend email.

## Features

### Blog Platform
- Rich content editor with TipTap (formatting, links, images)
- Beautiful, animated frontend with Framer Motion
- Cloudinary image uploads
- SEO optimization (meta descriptions, read time)
- View tracking per article
- Featured articles on homepage

### Event Management
- Create free and paid events
- Rich event descriptions
- Event registration system
- Capacity management
- Event filtering and search

### Newsletter & Email
- Automated email notifications for new posts
- Automated email notifications for new events
- Subscriber management dashboard
- CSV export of subscribers
- Confirmation emails for event registrations

### Admin Dashboard
- Fixed sidebar navigation
- Post management (CRUD)
- Event management (CRUD)
- Subscriber management
- Dashboard statistics

### Security
- Admin authentication
- Secure cookie-based sessions
- Protected API routes
- Environment variable configuration

## Tech Stack

- **Frontend**: Next.js 16, React 19, Framer Motion
- **Editor**: TipTap (rich text editing)
- **Images**: Cloudinary (upload & CDN)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Email**: Resend (transactional emails)
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon)
- Cloudinary account
- Resend account

### Installation

\`\`\`bash
# 1. Clone and install
git clone <repo>
cd triskideas
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Database setup
npm run db:generate
npm run db:migrate

# 4. Development server
npm run dev
\`\`\`

Visit `http://localhost:3000`

**Admin Panel**: `http://localhost:3000/admin`
- Default: `admin` / `admin123` (change in .env.local)

## Configuration

### Environment Variables

\`\`\`
# Database (Neon)
DATABASE_URL=postgresql://...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_PRESET=...

# Email (Resend)
RESEND_API_KEY=re_...

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## Database Schema

### Posts
- id, title, slug, excerpt, content, richContent
- imageUrl, category, author, readTimeMinutes
- featured, published, viewCount, seoDescription
- Timestamps: createdAt, updatedAt, publishedAt

### Events
- id, title, slug, description, richContent
- startDate, endDate, location, capacity
- eventType (free/paid), price
- imageUrl, featured, published
- Timestamps: createdAt, updatedAt

### EventRegistrations
- id, eventId, email, firstName, lastName
- paymentStatus, stripeTransactionId
- Timestamp: registeredAt

### Subscribers
- id, email
- Timestamp: subscribedAt

### EmailLogs
- id, email, type (post/event), contentId, contentTitle
- Timestamp: sentAt

## Core Features

### Blog Management
- **Create posts** with rich TipTap editor
- **Upload images** via Cloudinary
- **Auto-notify subscribers** when published
- **Track views** per article
- **Manage categories** and tags
- **SEO optimization** tools

### Event System
- **Free events** - Open registration
- **Paid events** - Stripe integration ready
- **Event notifications** to all subscribers
- **Registration tracking** and confirmation emails
- **Event search and filtering**

### Subscriber System
- **Newsletter signup** in footer
- **Double opt-in** via email
- **CSV export** of subscriber list
- **Automated emails** for new posts and events

## API Routes

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Events
- `POST /api/events/register` - Register for event

### Admin
- `POST /api/admin/auth` - Admin authentication

## Deployment

### To Vercel

\`\`\`bash
vercel deploy
\`\`\`

Set environment variables in Vercel dashboard.

### Post-Deployment
1. Verify database migrations ran
2. Test email notifications
3. Test image uploads
4. Change admin credentials
5. Update security settings

## Customization

### Change Colors
Edit `app/globals.css` and component classes (amber-700, etc.)

### Change Branding
Update:
- `app/layout.tsx` - Metadata
- `components/blog-header.tsx` - Navigation
- `components/blog-footer.tsx` - Footer content

### Add More Features
- Comments system
- Tags/categories
- Analytics dashboard
- Social sharing
- Reading progress

## Troubleshooting

### Images not uploading
- Verify Cloudinary credentials
- Check upload preset is unsigned
- Clear browser cache

### Emails not sending
- Verify Resend API key
- Check domain in Resend dashboard
- Review email logs

### Database connection
- Verify DATABASE_URL format
- Check Neon network access
- Ensure IP whitelisted

## Support

For issues:
- Check the `/setup` page for setup guide
- Review error messages in console
- Check environment variables
- Verify all services are connected

## License

Built for Dr. Ferdinand Ibu Ogbaji - TRISKIDEAS 2025

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [TipTap](https://tiptap.dev)
- [Cloudinary](https://cloudinary.com)
- [Resend](https://resend.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Framer Motion](https://www.framer.com/motion)
- [shadcn/ui](https://ui.shadcn.com)
\`\`\`
\`\`\`

```tsx file="" isHidden
