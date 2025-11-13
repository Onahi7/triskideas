import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNewPostEmail(email: string, postTitle: string, postSlug: string) {
  try {
    await resend.emails.send({
      from: "noreply@triskideas.com",
      to: email,
      subject: `New Blog Post: ${postTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b45309;">New Blog Post from Dr. Ferdinand Ibu Ogbaji</h2>
          <p>Hello,</p>
          <p>A new blog post has been published: <strong>${postTitle}</strong></p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}" style="background-color: #b45309; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Read the Post
            </a>
          </p>
          <p>Best regards,<br/>Dr. Ferdinand Ibu Ogbaji</p>
        </div>
      `,
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
    await resend.emails.send({
      from: "noreply@triskideas.com",
      to: email,
      subject: `New Event: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b45309;">New Event Announcement</h2>
          <p>Hello,</p>
          <p>A new ${eventType === "paid" ? "paid" : "free"} event has been announced: <strong>${eventTitle}</strong></p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/events/${eventSlug}" style="background-color: #b45309; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Event & Register
            </a>
          </p>
          <p>Best regards,<br/>Dr. Ferdinand Ibu Ogbaji</p>
        </div>
      `,
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
    await resend.emails.send({
      from: "noreply@triskideas.com",
      to: email,
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Registration Confirmed!</h2>
          <p>Hello ${firstName},</p>
          <p>Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>
          <p><strong>Event Date:</strong> ${eventDate}</p>
          <p>We look forward to seeing you there!</p>
          <p>Best regards,<br/>Dr. Ferdinand Ibu Ogbaji</p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Failed to send email:", error)
  }
}
