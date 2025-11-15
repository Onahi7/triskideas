import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/schema"
import { eq, sql } from "drizzle-orm"
import { requireAdminAuth } from "@/lib/admin-auth"

export async function GET() {
  try {
    await requireAdminAuth()
    
    // Try to fetch all settings
    const settings = await db.select().from(siteSettings)
    
    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminAuth()
    
    const body = await request.json()
    const { settings } = body
    
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: "Invalid settings format" },
        { status: 400 }
      )
    }
    
    // Get all existing settings in one query
    const existingSettings = await db.select().from(siteSettings)
    const existingKeys = new Set(existingSettings.map(s => s.key))
    
    // Prepare updates and inserts
    const updates: Promise<any>[] = []
    const inserts: { key: string; value: string }[] = []
    
    for (const [key, value] of Object.entries(settings)) {
      if (existingKeys.has(key)) {
        // Update existing
        updates.push(
          db
            .update(siteSettings)
            .set({ value: String(value), updatedAt: new Date() })
            .where(eq(siteSettings.key, key))
        )
      } else {
        // Queue for insert
        inserts.push({ key, value: String(value) })
      }
    }
    
    // Execute all updates in parallel
    if (updates.length > 0) {
      await Promise.all(updates)
    }
    
    // Batch insert new settings
    if (inserts.length > 0) {
      await db.insert(siteSettings).values(inserts)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
