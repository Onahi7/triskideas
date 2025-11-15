"use server"

import { db } from "@/lib/db"
import { pageLayouts, type PageLayout, type InsertPageLayout } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export interface PageSection {
  id: string
  type: string
  content: any
  order: number
}

// Get page layout by name
export interface PageLayoutResponse {
  pageName: string
  sections: PageSection[]
  updatedAt?: Date | null
}

export async function getPageLayout(pageName: string): Promise<PageLayoutResponse | null> {
  try {
    const result = await db
      .select()
      .from(pageLayouts)
      .where(eq(pageLayouts.pageName, pageName))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const [layout] = result
    const sections = JSON.parse(layout.sections || "[]") as PageSection[]

    return {
      pageName: layout.pageName,
      sections,
      updatedAt: layout.updatedAt,
    }
  } catch (error) {
    console.error("Error fetching page layout:", error)
    return null
  }
}

// Save page layout
export async function savePageLayout(pageName: string, sections: PageSection[]): Promise<boolean> {
  try {
    const sectionsJson = JSON.stringify(sections)

    // Check if layout exists
    const existing = await db
      .select()
      .from(pageLayouts)
      .where(eq(pageLayouts.pageName, pageName))
      .limit(1)

    if (existing.length > 0) {
      // Update existing
      await db
        .update(pageLayouts)
        .set({
          sections: sectionsJson,
          updatedAt: new Date(),
        })
        .where(eq(pageLayouts.pageName, pageName))
    } else {
      // Insert new
      await db.insert(pageLayouts).values({
        pageName,
        sections: sectionsJson,
      })
    }

    // Revalidate the page
    revalidatePath(`/${pageName === "homepage" ? "" : pageName}`)

    return true
  } catch (error) {
    console.error("Error saving page layout:", error)
    return false
  }
}

// Get all page layouts
export async function getAllPageLayouts(): Promise<PageLayout[]> {
  try {
    const result = await db.select().from(pageLayouts)
    return result
  } catch (error) {
    console.error("Error fetching all page layouts:", error)
    return []
  }
}

// Delete page layout
export async function deletePageLayout(pageName: string): Promise<boolean> {
  try {
    await db.delete(pageLayouts).where(eq(pageLayouts.pageName, pageName))
    revalidatePath(`/${pageName === "homepage" ? "" : pageName}`)
    return true
  } catch (error) {
    console.error("Error deleting page layout:", error)
    return false
  }
}

// Duplicate page layout
export async function duplicatePageLayout(
  sourcePageName: string,
  newPageName: string
): Promise<boolean> {
  try {
    const source = await db
      .select()
      .from(pageLayouts)
      .where(eq(pageLayouts.pageName, sourcePageName))
      .limit(1)

    if (source.length === 0) {
      return false
    }

    await db.insert(pageLayouts).values({
      pageName: newPageName,
      sections: source[0].sections,
    })

    return true
  } catch (error) {
    console.error("Error duplicating page layout:", error)
    return false
  }
}
