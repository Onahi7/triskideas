import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting configuration for Resend
const RATE_LIMIT = {
  BATCH_SIZE: 2, // Send 2 emails per batch
  DELAY_MS: 5000, // 5 seconds between batches
  MAX_RETRIES: 3, // Maximum retries for failed emails
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Queue for managing bulk email sending
interface EmailQueueItem {
  to: string
  subject: string
  html: string
  retries?: number
}

class EmailQueue {
  private queue: EmailQueueItem[] = []
  private processing = false

  async add(emailData: EmailQueueItem) {
    this.queue.push({ ...emailData, retries: 0 })
    if (!this.processing) {
      this.process()
    }
  }

  async addBulk(emailDataArray: EmailQueueItem[]) {
    this.queue.push(...emailDataArray.map(email => ({ ...email, retries: 0 })))
    if (!this.processing) {
      this.process()
    }
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    console.log(`📧 Starting email queue processing. ${this.queue.length} emails in queue.`)

    while (this.queue.length > 0) {
      // Take a batch of emails
      const batch = this.queue.splice(0, RATE_LIMIT.BATCH_SIZE)
      console.log(`📤 Processing batch of ${batch.length} emails...`)

      // Send batch concurrently
      const results = await Promise.allSettled(
        batch.map(email => this.sendSingleEmail(email))
      )

      // Handle failed emails
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const failedEmail = batch[index]
          if ((failedEmail.retries || 0) < RATE_LIMIT.MAX_RETRIES) {
            failedEmail.retries = (failedEmail.retries || 0) + 1
            console.log(`⚠️ Retrying email to ${failedEmail.to} (attempt ${failedEmail.retries})`)
            this.queue.unshift(failedEmail) // Add back to front of queue
          } else {
            console.error(`❌ Failed to send email to ${failedEmail.to} after ${RATE_LIMIT.MAX_RETRIES} retries`)
          }
        }
      })

      // Wait before next batch (if there are more emails)
      if (this.queue.length > 0) {
        console.log(`⏳ Waiting ${RATE_LIMIT.DELAY_MS/1000} seconds before next batch...`)
        await delay(RATE_LIMIT.DELAY_MS)
      }
    }

    this.processing = false
    console.log(`✅ Email queue processing completed.`)
  }

  private async sendSingleEmail(emailData: EmailQueueItem) {
    try {
      await resend.emails.send({
        from: "noreply@triskideas.com",
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      })
      console.log(`✅ Email sent successfully to ${emailData.to}`)
    } catch (error) {
      console.error(`❌ Failed to send email to ${emailData.to}:`, error)
      throw error
    }
  }

  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing
    }
  }
}

// Global email queue instance
const emailQueue = new EmailQueue()

// Beautiful email template wrapper
const getEmailTemplate = (content: string, previewText?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TRISKIDEAS - The Mind's Fruit</title>
  ${previewText ? `<meta name="description" content="${previewText}">` : ''}
  <!--[if !mso]><!-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  </style>
  <!--<![endif]-->
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
    .header { background: linear-gradient(135deg, #fffbeb 0%, #fed7aa 50%, #f59e0b 100%); padding: 40px 30px; text-align: center; }
    .logo { display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background: #d97706; border-radius: 50%; font-size: 32px; margin-bottom: 20px; box-shadow: 0 8px 20px rgba(217, 119, 6, 0.3); }
    .brand-name { font-size: 28px; font-weight: 700; color: #92400e; margin-bottom: 8px; letter-spacing: -0.025em; }
    .tagline { font-size: 16px; color: #a16207; font-weight: 500; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; color: #374151; margin-bottom: 24px; }
    .main-title { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 20px; line-height: 1.3; }
    .description { font-size: 16px; color: #6b7280; margin-bottom: 32px; line-height: 1.6; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #d97706, #f59e0b); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4); transition: transform 0.2s; }
    .cta-button:hover { transform: translateY(-1px); }
    .divider { height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); margin: 40px 0; }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer-content { color: #6b7280; font-size: 14px; line-height: 1.5; }
    .signature { font-weight: 600; color: #374151; margin-bottom: 8px; }
    .unsubscribe { color: #9ca3af; font-size: 12px; margin-top: 20px; }
    .unsubscribe a { color: #d97706; text-decoration: none; }
    .social-links { margin: 20px 0; }
    .social-link { display: inline-block; margin: 0 8px; padding: 8px; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div style="padding: 20px;">
    <div class="container">
      <div class="header">
        <div class="logo">✨</div>
        <div class="brand-name">TRISKIDEAS</div>
        <div class="tagline">The Mind's Fruit</div>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <div class="footer-content">
          <div class="signature">Dr. Ferdinand Ibu Ogbaji</div>
          <div>Medical Doctor • Artist • Thinker</div>
          <div style="margin: 16px 0; color: #9ca3af;">
            Passionate about helping people unlock their God-given potential<br>
            and make positive contributions to society.
          </div>
          <div class="social-links">
            <a href="#" class="social-link" style="text-decoration: none; color: #6b7280;">🌐 Website</a>
            <a href="#" class="social-link" style="text-decoration: none; color: #6b7280;">📧 Contact</a>
            <a href="#" class="social-link" style="text-decoration: none; color: #6b7280;">📚 About</a>
          </div>
          <div class="unsubscribe">
            <a href="#">Unsubscribe</a> • <a href="#">Update Preferences</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`

export async function sendNewPostEmail(email: string, postTitle: string, postSlug: string) {
  try {
    const content = `
      <div class="greeting">Hello there! 👋</div>
      
      <div class="main-title">New Blog Post: ${postTitle}</div>
      
      <div class="description">
        I'm excited to share my latest thoughts and insights with you. This new post explores ideas that I believe will inspire and challenge you to think differently about your own potential and purpose.
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}" class="cta-button">
          📖 Read the Full Post
        </a>
      </div>
      
      <div style="background: #f8fafc; border-left: 4px solid #d97706; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <div style="font-style: italic; color: #6b7280;">
          "Every blog post is a step in our journey of discovery. I hope this one brings you closer to understanding your own unique gifts and how to share them with the world."
        </div>
      </div>
    `
    
    await resend.emails.send({
      from: "noreply@triskideas.com",
      to: email,
      subject: `✨ New Post: ${postTitle}`,
      html: getEmailTemplate(content, `New blog post from Dr. Ferdinand: ${postTitle}`),
    })
  } catch (error) {
    console.error("Failed to send email:", error)
  }
}

export async function sendEventNotificationEmail(
  email: string,
  eventTitle: string,
  eventSlug: string,
  eventType: "free" | "paid",
) {
  try {
    const isPaid = eventType === "paid"
    const eventEmoji = isPaid ? "🎟️" : "🆓"
    const eventTypeBadge = isPaid ? 
      '<span style="background: #dc2626; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">Paid Event</span>' :
      '<span style="background: #16a34a; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">Free Event</span>'
    
    const content = `
      <div class="greeting">Hello! 🌟</div>
      
      <div style="text-align: center; margin-bottom: 20px;">
        ${eventTypeBadge}
      </div>
      
      <div class="main-title">${eventEmoji} New Event: ${eventTitle}</div>
      
      <div class="description">
        I'm thrilled to invite you to an upcoming ${eventType} event that I've carefully designed to help you grow, learn, and connect with like-minded individuals. This is more than just an event—it's an opportunity for transformation.
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/events/${eventSlug}" class="cta-button">
          🎯 View Event Details & Register
        </a>
      </div>
      
      <div style="background: linear-gradient(135deg, #fef3c7, #fbbf24); padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;">
        <div style="font-weight: 600; color: #92400e; margin-bottom: 8px; font-size: 18px;">
          🚀 Why Attend?
        </div>
        <div style="color: #a16207; line-height: 1.6;">
          Join a community of growth-minded individuals<br>
          Learn practical strategies for personal development<br>
          Connect your purpose with your daily actions
        </div>
      </div>
      
      ${isPaid ? `
      <div style="background: #fee2e2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <div style="color: #dc2626; font-weight: 600; margin-bottom: 8px;">💳 Investment Required</div>
        <div style="color: #7f1d1d; font-size: 14px;">
          This premium event requires payment. Secure your spot early as spaces are limited!
        </div>
      </div>
      ` : `
      <div style="background: #dcfce7; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <div style="color: #16a34a; font-weight: 600; margin-bottom: 8px;">🎉 Completely Free!</div>
        <div style="color: #15803d; font-size: 14px;">
          This event is my gift to the community. Just register to secure your spot!
        </div>
      </div>
      `}
    `
    
    await resend.emails.send({
      from: "noreply@triskideas.com",
      to: email,
      subject: `${eventEmoji} New ${eventType === 'paid' ? 'Premium' : 'Free'} Event: ${eventTitle}`,
      html: getEmailTemplate(content, `New ${eventType} event: ${eventTitle}`),
    })
  } catch (error) {
    console.error("Failed to send email:", error)
  }
}

export async function sendEventRegistrationConfirmation(
  email: string,
  firstName: string,
  eventTitle: string,
  eventDate: string,
) {
  try {
    const content = `
      <div class="greeting">Hello ${firstName}! 🎉</div>
      
      <div style="text-align: center; margin: 24px 0;">
        <div style="background: #16a34a; color: white; display: inline-flex; align-items: center; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 18px;">
          ✅ Registration Confirmed!
        </div>
      </div>
      
      <div class="main-title">You're all set for: ${eventTitle}</div>
      
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 24px; border-radius: 12px; margin: 24px 0;">
        <div style="color: #0c4a6e; font-weight: 600; margin-bottom: 16px; font-size: 18px;">
          📅 Event Details
        </div>
        <div style="color: #075985;">
          <div style="margin-bottom: 8px;"><strong>Event:</strong> ${eventTitle}</div>
          <div style="margin-bottom: 8px;"><strong>Date:</strong> ${eventDate}</div>
          <div><strong>Status:</strong> <span style="color: #16a34a; font-weight: 600;">Confirmed ✅</span></div>
        </div>
      </div>
      
      <div class="description">
        Thank you for registering! I'm genuinely excited to have you join us. This event has been thoughtfully designed to provide you with valuable insights, practical tools, and meaningful connections.
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/events" class="cta-button">
          📋 View All My Events
        </a>
      </div>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">
          💡 What to Expect
        </div>
        <div style="color: #a16207; line-height: 1.6;">
          • Interactive sessions designed for practical application<br>
          • Opportunities to connect with fellow participants<br>
          • Resources and tools you can use immediately<br>
          • A safe space for questions and open discussion
        </div>
      </div>
      
      <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center;">
        <div style="color: #0c4a6e; font-weight: 600; margin-bottom: 8px;">
          📧 Stay Connected
        </div>
        <div style="color: #075985; font-size: 14px;">
          You'll receive a reminder email closer to the event date with all the details you need.
        </div>
      </div>
    `
    
    await resend.emails.send({
      from: "noreply@triskideas.com",
      to: email,
      subject: `🎉 You're registered for ${eventTitle}!`,
      html: getEmailTemplate(content, `Registration confirmed for ${eventTitle} on ${eventDate}`),
    })
  } catch (error) {
    console.error("Failed to send email:", error)
  }
}

export async function sendWelcomeEmail(email: string, firstName?: string) {
  try {
    const content = `
      <div class="greeting">Welcome${firstName ? ` ${firstName}` : ''}! 🌟</div>
      
      <div class="main-title">Thank you for joining The Mind's Fruit community!</div>
      
      <div class="description">
        I'm Dr. Ferdinand Ibu Ogbaji, and I'm thrilled to have you here. As a medical doctor, artist, and passionate thinker, I believe that every person has unique gifts waiting to be discovered and shared with the world.
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/about" class="cta-button">
          🌱 Learn More About My Mission
        </a>
      </div>
      
      <div style="background: linear-gradient(135deg, #fef3c7, #fbbf24); padding: 24px; border-radius: 12px; margin: 24px 0;">
        <div style="font-weight: 600; color: #92400e; margin-bottom: 16px; font-size: 18px; text-align: center;">
          🚀 What You Can Expect
        </div>
        <div style="color: #a16207; line-height: 1.8;">
          📝 <strong>Thoughtful Blog Posts:</strong> Insights on personal development, creativity, and purpose<br>
          🎯 <strong>Exclusive Events:</strong> Workshops and sessions designed for growth<br>
          💡 <strong>Practical Wisdom:</strong> Real-world applications for your daily life<br>
          🤝 <strong>Community:</strong> Connect with like-minded individuals on similar journeys
        </div>
      </div>
      
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <div style="font-style: italic; color: #075985; text-align: center; line-height: 1.6;">
          "My mission is to help people unlock their God-given potential and make positive contributions to society. I believe that when we discover and develop our unique abilities, we not only transform our own lives but also positively impact everyone around us."
        </div>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <div style="margin-bottom: 16px; color: #6b7280;">Start your journey with these resources:</div>
        <div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog" style="display: inline-block; margin: 8px; padding: 12px 20px; background: #f3f4f6; color: #374151; text-decoration: none; border-radius: 8px; font-weight: 500;">📚 Browse Blog Posts</a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/events" style="display: inline-block; margin: 8px; padding: 12px 20px; background: #f3f4f6; color: #374151; text-decoration: none; border-radius: 8px; font-weight: 500;">🎯 View Events</a>
        </div>
      </div>
    `
    
    await resend.emails.send({
      from: "noreply@triskideas.com",
      to: email,
      subject: "🌟 Welcome to The Mind's Fruit - Let's unlock your potential!",
      html: getEmailTemplate(content, "Welcome to TRISKIDEAS - Your journey of growth and discovery begins here!"),
    })
  } catch (error) {
    console.error("Failed to send welcome email:", error)
  }
}

// BULK EMAIL FUNCTIONS WITH RATE LIMITING

/**
 * Send new post notification to all subscribers (rate-limited)
 */
export async function sendNewPostToAllSubscribers(
  subscriberEmails: string[], 
  postTitle: string, 
  postSlug: string
) {
  console.log(`📧 Queuing new post email for ${subscriberEmails.length} subscribers...`)
  
  const content = `
    <div class="greeting">Hello there! 👋</div>
    
    <div class="main-title">New Blog Post: ${postTitle}</div>
    
    <div class="description">
      I'm excited to share my latest thoughts and insights with you. This new post explores ideas that I believe will inspire and challenge you to think differently about your own potential and purpose.
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}" class="cta-button">
        📖 Read the Full Post
      </a>
    </div>
    
    <div style="background: #f8fafc; border-left: 4px solid #d97706; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <div style="font-style: italic; color: #6b7280;">
        "Every blog post is a step in our journey of discovery. I hope this one brings you closer to understanding your own unique gifts and how to share them with the world."
      </div>
    </div>
  `

  const emailsToQueue = subscriberEmails.map(email => ({
    to: email,
    subject: `✨ New Post: ${postTitle}`,
    html: getEmailTemplate(content, `New blog post from Dr. Ferdinand: ${postTitle}`)
  }))

  await emailQueue.addBulk(emailsToQueue)
  
  return {
    queued: subscriberEmails.length,
    status: emailQueue.getQueueStatus()
  }
}

/**
 * Send event notification to all subscribers (rate-limited)
 */
export async function sendEventToAllSubscribers(
  subscriberEmails: string[],
  eventTitle: string,
  eventSlug: string,
  eventType: "free" | "paid"
) {
  console.log(`📧 Queuing event notification for ${subscriberEmails.length} subscribers...`)
  
  const isPaid = eventType === "paid"
  const eventEmoji = isPaid ? "🎟️" : "🆓"
  const eventTypeBadge = isPaid ? 
    '<span style="background: #dc2626; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">Paid Event</span>' :
    '<span style="background: #16a34a; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">Free Event</span>'
  
  const content = `
    <div class="greeting">Hello! 🌟</div>
    
    <div style="text-align: center; margin-bottom: 20px;">
      ${eventTypeBadge}
    </div>
    
    <div class="main-title">${eventEmoji} New Event: ${eventTitle}</div>
    
    <div class="description">
      I'm thrilled to invite you to an upcoming ${eventType} event that I've carefully designed to help you grow, learn, and connect with like-minded individuals. This is more than just an event—it's an opportunity for transformation.
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/events/${eventSlug}" class="cta-button">
        🎯 View Event Details & Register
      </a>
    </div>
    
    <div style="background: linear-gradient(135deg, #fef3c7, #fbbf24); padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;">
      <div style="font-weight: 600; color: #92400e; margin-bottom: 8px; font-size: 18px;">
        🚀 Why Attend?
      </div>
      <div style="color: #a16207; line-height: 1.6;">
        Join a community of growth-minded individuals<br>
        Learn practical strategies for personal development<br>
        Connect your purpose with your daily actions
      </div>
    </div>
    
    ${isPaid ? `
    <div style="background: #fee2e2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <div style="color: #dc2626; font-weight: 600; margin-bottom: 8px;">💳 Investment Required</div>
      <div style="color: #7f1d1d; font-size: 14px;">
        This premium event requires payment. Secure your spot early as spaces are limited!
      </div>
    </div>
    ` : `
    <div style="background: #dcfce7; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <div style="color: #16a34a; font-weight: 600; margin-bottom: 8px;">🎉 Completely Free!</div>
      <div style="color: #15803d; font-size: 14px;">
        This event is my gift to the community. Just register to secure your spot!
      </div>
    </div>
    `}
  `

  const emailsToQueue = subscriberEmails.map(email => ({
    to: email,
    subject: `${eventEmoji} New ${eventType === 'paid' ? 'Premium' : 'Free'} Event: ${eventTitle}`,
    html: getEmailTemplate(content, `New ${eventType} event: ${eventTitle}`)
  }))

  await emailQueue.addBulk(emailsToQueue)
  
  return {
    queued: subscriberEmails.length,
    status: emailQueue.getQueueStatus()
  }
}

/**
 * Send welcome emails to multiple new subscribers (rate-limited)
 */
export async function sendWelcomeEmailsBulk(subscribers: { email: string; firstName?: string }[]) {
  console.log(`📧 Queuing welcome emails for ${subscribers.length} new subscribers...`)
  
  const emailsToQueue = subscribers.map(subscriber => {
    const content = `
      <div class="greeting">Welcome${subscriber.firstName ? ` ${subscriber.firstName}` : ''}! 🌟</div>
      
      <div class="main-title">Thank you for joining The Mind's Fruit community!</div>
      
      <div class="description">
        I'm Dr. Ferdinand Ibu Ogbaji, and I'm thrilled to have you here. As a medical doctor, artist, and passionate thinker, I believe that every person has unique gifts waiting to be discovered and shared with the world.
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/about" class="cta-button">
          🌱 Learn More About My Mission
        </a>
      </div>
      
      <div style="background: linear-gradient(135deg, #fef3c7, #fbbf24); padding: 24px; border-radius: 12px; margin: 24px 0;">
        <div style="font-weight: 600; color: #92400e; margin-bottom: 16px; font-size: 18px; text-align: center;">
          🚀 What You Can Expect
        </div>
        <div style="color: #a16207; line-height: 1.8;">
          📝 <strong>Thoughtful Blog Posts:</strong> Insights on personal development, creativity, and purpose<br>
          🎯 <strong>Exclusive Events:</strong> Workshops and sessions designed for growth<br>
          💡 <strong>Practical Wisdom:</strong> Real-world applications for your daily life<br>
          🤝 <strong>Community:</strong> Connect with like-minded individuals on similar journeys
        </div>
      </div>
      
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <div style="font-style: italic; color: #075985; text-align: center; line-height: 1.6;">
          "My mission is to help people unlock their God-given potential and make positive contributions to society. I believe that when we discover and develop our unique abilities, we not only transform our own lives but also positively impact everyone around us."
        </div>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <div style="margin-bottom: 16px; color: #6b7280;">Start your journey with these resources:</div>
        <div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog" style="display: inline-block; margin: 8px; padding: 12px 20px; background: #f3f4f6; color: #374151; text-decoration: none; border-radius: 8px; font-weight: 500;">📚 Browse Blog Posts</a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/events" style="display: inline-block; margin: 8px; padding: 12px 20px; background: #f3f4f6; color: #374151; text-decoration: none; border-radius: 8px; font-weight: 500;">🎯 View Events</a>
        </div>
      </div>
    `
    
    return {
      to: subscriber.email,
      subject: "🌟 Welcome to The Mind's Fruit - Let's unlock your potential!",
      html: getEmailTemplate(content, "Welcome to TRISKIDEAS - Your journey of growth and discovery begins here!")
    }
  })

  await emailQueue.addBulk(emailsToQueue)
  
  return {
    queued: subscribers.length,
    status: emailQueue.getQueueStatus()
  }
}

/**
 * Get current email queue status
 */
export function getEmailQueueStatus() {
  return emailQueue.getQueueStatus()
}

interface AdminCommentNotification {
  adminEmail?: string
  commenterName: string
  commenterEmail: string
  commentContent: string
  postTitle: string
  postUrl: string
  manageUrl?: string
}

export async function sendAdminCommentNotification({
  adminEmail,
  commenterName,
  commenterEmail,
  commentContent,
  postTitle,
  postUrl,
  manageUrl,
}: AdminCommentNotification) {
  const fallbackAdminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "triskideas@gmail.com"
  const recipient = adminEmail || fallbackAdminEmail
  if (!recipient) {
    console.warn("No admin email configured for comment notifications")
    return
  }

  const safeManageUrl =
    manageUrl || `${process.env.NEXT_PUBLIC_APP_URL || "https://triskideas.com"}/admin/comments`
  const formattedContent = commentContent
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p style="margin-bottom: 12px;">${paragraph}</p>`)
    .join("")

  const content = `
    <div class="greeting">New comment awaiting review 📨</div>
    <div class="main-title">${commenterName} replied on "${postTitle}"</div>

    <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 16px; border-radius: 12px; margin: 24px 0;">
      <div style="font-size: 15px; color: #92400e; line-height: 1.6;">
        ${formattedContent || commentContent}
      </div>
    </div>

    <div class="description">
      <strong>From:</strong> ${commenterName} &lt;${commenterEmail}&gt;<br/>
      <strong>Post:</strong> <a href="${postUrl}" style="color: #d97706; text-decoration: underline;">${postTitle}</a>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${safeManageUrl}" class="cta-button">
        ✅ Moderate Comment
      </a>
    </div>
  `

  try {
    await resend.emails.send({
      from: "noreply@triskideas.com",
      to: recipient,
      subject: `📝 New comment on ${postTitle}`,
      html: getEmailTemplate(content, `New comment from ${commenterName}`),
    })
  } catch (error) {
    console.error("Failed to send admin comment notification:", error)
  }
}
