# Deployment Guide - TRISKIDEAS Blog Platform

## Pre-Deployment Checklist

- [ ] Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local`
- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Verify all Cloudinary credentials
- [ ] Verify Resend API key and domain
- [ ] Test email sending in staging
- [ ] Backup existing data if migrating
- [ ] Review all environment variables

## Deployment Steps

### 1. Vercel Deployment

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy
\`\`\`

### 2. Environment Variables on Vercel

In your Vercel project settings, add:

\`\`\`
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_PRESET=...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
RESEND_API_KEY=re_...
ADMIN_USERNAME=secure_username
ADMIN_PASSWORD=secure_password
NODE_ENV=production
\`\`\`

### 3. Database Setup

\`\`\`bash
# Connect to your Neon database and run:
# Option 1: Via SQL editor
psql postgresql://[connection-string]
\i scripts/init-db.sql

# Option 2: Via Node script
npm run seed:db
\`\`\`

### 4. Verify Deployment

1. Visit your domain
2. Test blog post creation in admin
3. Send a test email via subscriber signup
4. Test image upload via Cloudinary
5. Create a test event and verify notifications

## Post-Deployment

### Monitoring
- Check Vercel Analytics for performance
- Monitor Resend dashboard for email delivery
- Track database performance in Neon

### Maintenance
- Regular backups of PostgreSQL
- Monitor storage usage (Cloudinary)
- Update dependencies monthly
- Review security logs

### Troubleshooting

**Images not loading**: Check Cloudinary domain settings

**Emails not sending**: Verify Resend domain verification

**Database connection errors**: Check connection string format and IP whitelist

## Scaling

As you grow:
1. Enable database read replicas (Neon)
2. Setup CDN for Cloudinary
3. Implement caching strategy
4. Monitor and optimize queries
5. Consider Redis for sessions

## Security

- Keep dependencies updated
- Use strong admin credentials
- Enable HTTPS (automatic on Vercel)
- Regular security audits
- Monitor access logs
- Use environment variables for secrets

## Rollback Plan

If issues occur:

\`\`\`bash
# Rollback to previous deployment
vercel rollback

# Or redeploy previous commit
git checkout [commit-hash]
vercel deploy
\`\`\`

## Support

Contact support for:
- Vercel: vercel.com/support
- Neon: neon.tech/support
- Resend: resend.com/support
- Cloudinary: cloudinary.com/support
