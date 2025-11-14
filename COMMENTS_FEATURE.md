# Comment System & Newsletter Popup Features

## New Features Added

### 1. **Comment System** 💬
- Users can comment on blog posts
- Nested replies (comments can have replies)
- Comments require approval before appearing
- Automatic newsletter subscription for commenters
- Beautiful comment UI with threaded replies

### 2. **Newsletter Popup** 📧
- Smart popup that appears **twice daily** (every 12 hours)
- Tracks visitor IDs using browser localStorage
- Non-intrusive - shows 3 seconds after page load
- Easy subscribe form
- "Maybe later" option
- Automatic tracking of popup history

### 3. **Admin Comment Management** ⚙️
- New admin page at `/admin/comments`
- View pending comments
- Approve or delete comments
- See commenter name, email, and content
- Badge showing pending comment count

## Database Schema

### Comments Table
```sql
- id: Primary key
- post_id: Reference to blog post
- parent_id: Reference to parent comment (for replies)
- name: Commenter name
- email: Commenter email
- content: Comment text
- approved: Boolean (false by default)
- created_at: Timestamp
```

### Newsletter Popups Table
```sql
- id: Primary key
- visitor_id: Unique visitor identifier
- last_shown: Last time popup was shown
- show_count: Number of times shown
```

## How It Works

### Comment Flow:
1. User visits blog post
2. Fills in name, email, and comment
3. Comment is submitted (not yet visible)
4. Email is automatically added to newsletter subscribers
5. Admin reviews comment in `/admin/comments`
6. Admin approves comment
7. Comment appears on blog post
8. Admin gets an email alert for each new pending comment

### Newsletter Popup Flow:
1. User visits site
2. System checks when popup was last shown
3. If > 12 hours, popup appears after 3 seconds
4. User can subscribe or dismiss
5. Next popup won't show for another 12 hours

## Files Changed/Added

### New Files:
- `lib/comment-actions.ts` - Comment CRUD operations
- `lib/newsletter-popup-actions.ts` - Popup tracking logic
- `components/comment-section.tsx` - Comment UI component
- `components/newsletter-popup.tsx` - Popup modal component
- `app/admin/comments/page.tsx` - Admin comment management
- `scripts/add-comments-migration.sql` - Database migration

### Modified Files:
- `lib/schema.ts` - Added comments and newsletter_popups tables
- `lib/db-actions.ts` - Added comment-related imports
- `app/blog/[slug]/page.tsx` - Added comment section to blog posts
- `components/admin-sidebar.tsx` - Added Comments link

## Setup Instructions

1. **Run the migration:**
   ```bash
   # Connect to your Neon database and run:
   psql <your-database-url> -f scripts/add-comments-migration.sql
   ```

2. **Test Comments:**
   - Visit any blog post
   - Scroll to bottom
   - Fill in comment form
   - Check `/admin/comments` to approve

3. **Test Newsletter Popup:**
   - Visit the homepage
   - Wait 3 seconds for popup
   - Subscribe or dismiss
   - Clear localStorage and revisit to test again

## Features Benefits

✅ **Engagement** - Comments increase user interaction
✅ **Community** - Build a community around your content
✅ **Newsletter Growth** - Auto-capture emails from commenters
✅ **Moderation** - Control what appears on your blog
✅ **Smart Popups** - Not annoying, shows twice daily max
✅ **Data Collection** - Build your email list organically
✅ **Instant Alerts** - Admin email notifications keep moderation fast

## Admin Tasks

**Daily:**
- Review pending comments in `/admin/comments`
- Approve legitimate comments
- Delete spam

**Weekly:**
- Check subscriber growth
- Review comment engagement on posts

## Next Steps (Optional Enhancements)

- Email notifications when new comments arrive
- Comment editing by users
- Comment voting/likes
- Comment threading depth limits
- Spam detection with Akismet
- Emoji reactions
- Social login for comments

## Configuration

- `ADMIN_NOTIFICATION_EMAIL` (optional): Defaults to `triskideas@gmail.com`. Set this env variable to change where moderation alerts are delivered.
