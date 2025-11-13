# Resend Email Setup Guide for triskideas.com

This guide explains how to set up Resend email service with your custom domain `triskideas.com`.

## Current Status
✅ Resend API key is configured  
✅ Email functions are ready  
❌ Domain verification needed  

## Step-by-Step Domain Setup

### 1. Access Resend Dashboard
1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Login to your Resend account

### 2. Add Your Domain
1. Click **"Add Domain"**
2. Enter your domain: `triskideas.com`
3. Click **"Add Domain"**

### 3. Verify Domain with DNS Records
Resend will provide you with DNS records that you need to add to your domain registrar:

#### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

#### DKIM Records (2 records)
Resend will provide two DKIM records similar to:
```
Type: CNAME  
Name: resend1._domainkey
Value: resend1._domainkey.resend.com

Type: CNAME
Name: resend2._domainkey  
Value: resend2._domainkey.resend.com
```

#### DMARC Record (Optional but recommended)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@triskideas.com
```

### 4. Add DNS Records to Your Domain Provider
Add the provided DNS records to wherever you manage DNS for `triskideas.com`:
- **Namecheap**: Domain List → Manage → Advanced DNS
- **GoDaddy**: DNS Management
- **Cloudflare**: DNS Records
- **Others**: Look for DNS Management section

### 5. Wait for Verification
- DNS propagation can take 24-48 hours
- Check verification status in Resend dashboard
- You'll get a green checkmark when verified

## Email Addresses Available

Once verified, you can send emails from any address on your domain:

### Current Configuration
- `noreply@triskideas.com` - Used for automated emails
- You can also use:
  - `admin@triskideas.com` - For admin communications
  - `hello@triskideas.com` - For general contact
  - `dr.ferdinand@triskideas.com` - Personal emails

## Environment Variables

Your current setup in `.env.local`:
```env
# Email - Resend
RESEND_API_KEY=re_T466pLjZ_Pa5YGiYgqq8KRMK5xnfLYtGb
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Add different FROM addresses
RESEND_FROM_NOREPLY=noreply@triskideas.com
RESEND_FROM_ADMIN=admin@triskideas.com
RESEND_FROM_PERSONAL=dr.ferdinand@triskideas.com
```

## Email Functions Ready

The following email functions are already configured:

1. **New Post Notifications** - `sendNewPostEmail()`
2. **Event Announcements** - `sendEventNotificationEmail()`  
3. **Registration Confirmations** - `sendEventRegistrationConfirmation()`

## Testing Before Domain Verification

While waiting for domain verification, you can test with Resend's default sending domain:

### Temporary Email Testing
```typescript
// In lib/email.tsx, temporarily change from:
from: "noreply@triskideas.com"

// To (for testing only):
from: "onboarding@resend.dev"
```

**⚠️ Remember to change it back after domain verification!**

## Troubleshooting

### Common Issues:

1. **"Domain not verified" error**
   - Check DNS records are added correctly
   - Wait 24-48 hours for DNS propagation
   - Use DNS checker tools to verify records

2. **Emails not sending**
   - Verify API key is correct
   - Check domain verification status
   - Review Resend dashboard logs

3. **Emails going to spam**
   - Ensure DKIM records are set up
   - Add DMARC policy
   - Warm up your domain gradually

### DNS Checker Tools:
- [MXToolbox](https://mxtoolbox.com/spf.aspx)
- [DMARCian](https://dmarcian.com/domain-checker/)
- [Mail-Tester](https://www.mail-tester.com/)

## Production Checklist

Before going live:

- [ ] Domain verified in Resend dashboard
- [ ] All DNS records added and propagated  
- [ ] Test emails sending successfully
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Set up proper error handling and logging
- [ ] Consider email rate limiting
- [ ] Set up monitoring for email deliverability

## Next Steps

1. **Add domain to Resend** (if not done already)
2. **Configure DNS records** with your domain provider
3. **Wait for verification** (up to 48 hours)
4. **Test email sending** once verified
5. **Update production URL** when deploying

## Contact Support

If you encounter issues:
- Resend Support: [support@resend.com](mailto:support@resend.com)
- Resend Documentation: [resend.com/docs](https://resend.com/docs)
- Community: [GitHub Discussions](https://github.com/resendlabs/resend/discussions)