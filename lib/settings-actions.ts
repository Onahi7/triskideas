"use server"

import { db } from "@/lib/db"
import { siteSettings, type SiteSetting } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { requireAdminAuth } from "@/lib/admin-auth"

// Get a setting by key
export async function getSetting(key: string): Promise<string | null> {
  try {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key))
    return result[0]?.value || null
  } catch (error) {
    console.error("Error getting setting:", error)
    return null
  }
}

// Get multiple settings
export async function getSettings(keys: string[]): Promise<Record<string, string | null>> {
  try {
    const result = await db.select().from(siteSettings)
    const settings: Record<string, string | null> = {}
    
    keys.forEach(key => {
      const found = result.find(s => s.key === key)
      settings[key] = found?.value || null
    })
    
    return settings
  } catch (error) {
    console.error("Error getting settings:", error)
    return {}
  }
}

// Get all settings
export async function getAllSettings(): Promise<SiteSetting[]> {
  try {
    return await db.select().from(siteSettings)
  } catch (error) {
    console.error("Error getting all settings:", error)
    // If table doesn't exist, return empty array
    if (error instanceof Error && error.message.includes("does not exist")) {
      console.warn("site_settings table does not exist. Please run initialization.")
      return []
    }
    return []
  }
}

// Update or create a setting
export async function updateSetting(key: string, value: string): Promise<void> {
  await requireAdminAuth()
  try {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key))
    
    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
    } else {
      await db.insert(siteSettings).values({ key, value })
    }
    
    revalidatePath("/")
    revalidatePath("/about")
  } catch (error) {
    console.error("Error updating setting:", error)
    throw error
  }
}

// Update multiple settings at once
export async function updateSettings(settings: Record<string, string>): Promise<void> {
  await requireAdminAuth()
  
  try {
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
            .set({ value, updatedAt: new Date() })
            .where(eq(siteSettings.key, key))
        )
      } else {
        // Queue for insert
        inserts.push({ key, value })
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
    
    revalidatePath("/")
    revalidatePath("/about")
  } catch (error) {
    console.error("Error updating settings:", error)
    throw new Error(`Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
