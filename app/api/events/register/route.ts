import { type NextRequest, NextResponse } from "next/server"
import { sendEventRegistrationConfirmation } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, firstName, lastName, email, paymentStatus } = body

    if (!eventId || !firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // TODO: Save registration to database using registerForEvent server action
    // TODO: If paid event, process Stripe payment

    // Send confirmation email
    await sendEventRegistrationConfirmation(email, firstName, "Event Title", new Date().toLocaleDateString())

    return NextResponse.json({ success: true, message: "Registration successful" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register" }, { status: 500 })
  }
}
