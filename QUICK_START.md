# Quick Start Guide

## Local Development (5 minutes)

### 1. Clone & Install
\`\`\`bash
git clone <repo>
cd triskideas
npm install
\`\`\`

### 2. Setup Environment
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in .env.local:
- DATABASE_URL: Get from Neon
- NEXT_PUBLIC_CLOUDINARY_*: Get from Cloudinary
- RESEND_API_KEY: Get from Resend

### 3. Run
\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000

### 4. Admin Access
- Go to http://localhost:3000/admin
- Login with credentials in .env.local

## First Steps

1. **Create a Post**
   - Admin → Manage Posts → New Post
   - Write with rich editor
   - Upload image
   - Publish

2. **Create an Event**
   - Admin → Manage Events → New Event
   - Set date and type (free/paid)
   - Publish to notify subscribers

3. **Test Newsletter**
   - Footer → Subscribe email
   - Check confirmation email

## Common Tasks

### Add Subscriber Manually
- Admin → Subscribers (placeholder - use database directly for now)

### Change Admin Password
- Edit ADMIN_PASSWORD in .env.local
- Restart dev server

### Upload Custom Logo
- Replace images in public/
- Update BlogHeader component

### Modify Colors
- Edit Tailwind classes (amber-700, etc.)
- See design tokens in globals.css

## Troubleshooting

**Port 3000 in use?**
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

**Clear cache and restart**
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

**Database connection error?**
- Check DATABASE_URL format
- Verify network access in Neon

## Next Steps

- Customize styling to match brand
- Add more pages (testimonials, gallery)
- Setup email domain verification
- Configure Stripe for paid events
- Deploy to Vercel

For detailed setup, see SETUP.md
