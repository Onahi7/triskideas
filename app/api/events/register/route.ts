import { type NextRequest, NextResponse } from "next/server"
import { sendEventRegistrationConfirmation } from "@/lib/email"
import { registerForEvent, getEventBySlug } from "@/lib/db-actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, eventSlug, firstName, lastName, email, paymentStatus } = body

    if (!eventId || !firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save registration to database
    await registerForEvent({
      eventId,
      firstName,
      lastName,
      email,
      paymentStatus: paymentStatus || "pending",
    })

    // Get event details for confirmation email
    let eventTitle = "Event"
    let eventDate = new Date().toLocaleDateString()
    
    if (eventSlug) {
      const event = await getEventBySlug(eventSlug)
      if (event) {
        eventTitle = event.title
        eventDate = new Date(event.startDate).toLocaleDateString()
      }
    }

    // Send confirmation email
    await sendEventRegistrationConfirmation(email, firstName, eventTitle, eventDate)

    return NextResponse.json({ success: true, message: "Registration successful" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register" }, { status: 500 })
  }
}
