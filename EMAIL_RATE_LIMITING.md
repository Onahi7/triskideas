# Rate-Limited Email System Documentation

## Overview

The email system now includes proper rate limiting to comply with Resend's API limits and prevent delivery issues. The system uses a queue-based approach that sends emails in controlled batches with delays.

## Rate Limiting Configuration

```typescript
const RATE_LIMIT = {
  BATCH_SIZE: 2,     // Send 2 emails per batch
  DELAY_MS: 5000,    // 5 seconds between batches
  MAX_RETRIES: 3,    // Maximum retries for failed emails
}
```

## How It Works

### 1. **Email Queue System**
- All bulk emails are added to a queue instead of being sent immediately
- Queue processes emails in batches of 2 with 5-second delays
- Failed emails are automatically retried up to 3 times
- Comprehensive logging for monitoring

### 2. **Single Email Functions** (No Rate Limiting)
These send immediately for individual emails:
- `sendNewPostEmail(email, title, slug)`
- `sendEventNotificationEmail(email, title, slug, type)`  
- `sendEventRegistrationConfirmation(email, firstName, title, date)`
- `sendWelcomeEmail(email, firstName?)`

### 3. **Bulk Email Functions** (Rate Limited)
These use the queue system for bulk sending:
- `sendNewPostToAllSubscribers(emails[], title, slug)`
- `sendEventToAllSubscribers(emails[], title, slug, type)`
- `sendWelcomeEmailsBulk(subscribers[])`

## Usage Examples

### Send New Post to All Subscribers
```typescript
import { sendNewPostToAllSubscribers } from '@/lib/email'

// Get all subscriber emails from database
const subscribers = await getSubscriberEmails()

// Queue emails (returns immediately)
const result = await sendNewPostToAllSubscribers(
  subscribers, 
  "Your Amazing Blog Post", 
  "amazing-blog-post"
)

console.log(`Queued ${result.queued} emails`)
console.log(`Queue status:`, result.status)
```

### Send Event Notification to All Subscribers
```typescript
import { sendEventToAllSubscribers } from '@/lib/email'

const subscribers = await getSubscriberEmails()

const result = await sendEventToAllSubscribers(
  subscribers,
  "Workshop: Unlocking Your Potential",
  "unlock-potential-workshop", 
  "free"
)

console.log(`Queued ${result.queued} emails`)
```

### Send Welcome Emails to New Subscribers
```typescript
import { sendWelcomeEmailsBulk } from '@/lib/email'

const newSubscribers = [
  { email: "user1@example.com", firstName: "John" },
  { email: "user2@example.com", firstName: "Jane" },
  { email: "user3@example.com" }, // No firstName
]

const result = await sendWelcomeEmailsBulk(newSubscribers)
console.log(`Queued ${result.queued} welcome emails`)
```

### Monitor Queue Status
```typescript
import { getEmailQueueStatus } from '@/lib/email'

const status = getEmailQueueStatus()
console.log(`Queue length: ${status.queueLength}`)
console.log(`Processing: ${status.processing}`)
```

## Implementation in Admin Panel

### 1. **When Publishing a New Post**
```typescript
// In your admin post publishing function
async function publishPost(postId: string) {
  // ... publish post logic
  
  // Get all subscribers
  const subscribers = await getSubscriberEmails()
  
  if (subscribers.length > 0) {
    // Queue notification emails
    await sendNewPostToAllSubscribers(
      subscribers,
      post.title,
      post.slug
    )
    
    console.log(`📧 Queued post notifications for ${subscribers.length} subscribers`)
  }
}
```

### 2. **When Creating a New Event**
```typescript
async function publishEvent(eventId: string) {
  // ... publish event logic
  
  const subscribers = await getSubscriberEmails()
  
  if (subscribers.length > 0) {
    await sendEventToAllSubscribers(
      subscribers,
      event.title,
      event.slug,
      event.eventType
    )
    
    console.log(`📧 Queued event notifications for ${subscribers.length} subscribers`)
  }
}
```

### 3. **New Subscriber Welcome**
```typescript
// In newsletter subscription API
async function subscribeToNewsletter(email: string, firstName?: string) {
  // ... save subscriber to database
  
  // Send welcome email (single email, no rate limiting)
  await sendWelcomeEmail(email, firstName)
  
  console.log(`📧 Sent welcome email to ${email}`)
}
```

## Console Output Examples

```
📧 Queuing new post email for 150 subscribers...
📤 Processing batch of 2 emails...
✅ Email sent successfully to user1@example.com
✅ Email sent successfully to user2@example.com
⏳ Waiting 5 seconds before next batch...
📤 Processing batch of 2 emails...
✅ Email sent successfully to user3@example.com
⚠️ Retrying email to user4@example.com (attempt 1)
⏳ Waiting 5 seconds before next batch...
...
✅ Email queue processing completed.
```

## Benefits

### ✅ **Compliance**
- Respects Resend's rate limits
- Reduces risk of account suspension
- Better deliverability rates

### ✅ **Reliability**  
- Automatic retry mechanism
- Error handling and logging
- Queue status monitoring

### ✅ **User Experience**
- Admin actions return immediately  
- Background processing doesn't block UI
- Clear feedback on queue status

### ✅ **Scalability**
- Handles any number of subscribers
- Predictable sending patterns
- Easy to adjust rate limits if needed

## Configuration Options

You can adjust the rate limiting by modifying the `RATE_LIMIT` configuration:

```typescript
// For faster sending (if your Resend plan allows)
const RATE_LIMIT = {
  BATCH_SIZE: 5,     // Send 5 emails per batch
  DELAY_MS: 3000,    // 3 seconds between batches  
  MAX_RETRIES: 2,    // Fewer retries
}

// For very conservative sending
const RATE_LIMIT = {
  BATCH_SIZE: 1,     // Send 1 email per batch
  DELAY_MS: 10000,   // 10 seconds between batches
  MAX_RETRIES: 5,    // More retries
}
```

## Resend Plan Considerations

- **Free Plan**: 100 emails/day, 3 emails/second
- **Pro Plan**: 50,000 emails/month, 10 emails/second  
- **Business Plan**: Higher limits

Our default configuration (2 emails per 5 seconds = ~0.4 emails/second) is very conservative and works well for all plans.

## Monitoring and Debugging

### Queue Status API Endpoint
You could create an API endpoint to monitor the queue:

```typescript
// /api/admin/email-queue-status
export async function GET() {
  const status = getEmailQueueStatus()
  return Response.json(status)
}
```

### Admin Dashboard Integration
Add queue status to your admin dashboard to monitor email sending progress in real-time.

## Error Handling

The system handles various error scenarios:
- **Network failures**: Automatic retries
- **Rate limit hits**: Delays and retries  
- **Invalid emails**: Logged and skipped
- **API errors**: Logged with details

Failed emails after all retries are logged for manual review.