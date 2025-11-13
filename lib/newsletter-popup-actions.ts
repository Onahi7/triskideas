"use server"

import { db } from "@/lib/db"
import { newsletterPopups, type InsertNewsletterPopup } from "@/lib/schema"
import { eq, gte } from "drizzle-orm"

// Check if popup should be shown (twice daily logic)
export async function shouldShowNewsletterPopup(visitorId: string): Promise<boolean> {
  try {
    const result = await db.select().from(newsletterPopups).where(eq(newsletterPopups.visitorId, visitorId))

    if (result.length === 0) {
      return true // First visit
    }

    const popup = result[0]
    const now = new Date()
    const lastShown = new Date(popup.lastShown)
    const hoursSinceLastShown = (now.getTime() - lastShown.getTime()) / (1000 * 60 * 60)

    // Show popup if it's been at least 12 hours (twice daily)
    return hoursSinceLastShown >= 12
  } catch (error) {
    console.error("Error checking popup status:", error)
    return false
  }
}

// Record popup shown
export async function recordNewsletterPopupShown(visitorId: string): Promise<void> {
  try {
    const existing = await db.select().from(newsletterPopups).where(eq(newsletterPopups.visitorId, visitorId))

    if (existing.length === 0) {
      await db.insert(newsletterPopups).values({
        visitorId,
        lastShown: new Date(),
        showCount: 1,
      })
    } else {
      await db
        .update(newsletterPopups)
        .set({
          lastShown: new Date(),
          showCount: existing[0].showCount + 1,
        })
        .where(eq(newsletterPopups.visitorId, visitorId))
    }
  } catch (error) {
    console.error("Error recording popup:", error)
  }
}
