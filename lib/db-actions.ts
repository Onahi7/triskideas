"use server"

import { db } from "@/lib/db"
import {
  posts,
  subscribers,
  categories,
  events,
  eventRegistrations,
  emailLogs,
  series,
  episodes,
  comments,
  newsletterPopups,
  type InsertPost,
  type Post,
  type Event,
  type InsertEvent,
  type InsertEventRegistration,
  type Series,
  type Episode,
  type InsertSeries,
  type InsertEpisode,
  type Comment,
  type InsertComment,
  type InsertNewsletterPopup,
} from "@/lib/schema"
import { eq, desc, ilike, and, isNull, gte } from "drizzle-orm"
import { updateTag } from "next/cache"
import { sendNewPostEmail, sendEventNotificationEmail } from "@/lib/email"

// Re-export types for use in components
export type { Post, Event, Series, Episode, Comment, InsertPost, InsertEvent, InsertSeries, InsertEpisode, InsertComment } from "@/lib/schema"

export async function getAllPosts(category?: string): Promise<Post[]> {
  let query = db.select().from(posts)
  if (category) {
    query = query.where(eq(posts.category, category))
  }
  const result = await query.orderBy(desc(posts.publishedAt))
  return result
}

export async function getPublishedPosts(category?: string): Promise<Post[]> {
  let query = db.select().from(posts).where(eq(posts.published, true))
  if (category) {
    query = query.where(eq(posts.category, category))
  }
  const result = await query.orderBy(desc(posts.publishedAt))
  return result
}

export async function getFeaturedPosts(limit: number = 2): Promise<Post[]> {
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.published, true), eq(posts.featured, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
  return result
}

export async function searchPosts(query: string): Promise<Post[]> {
  const result = await db
    .select()
    .from(posts)
    .where(ilike(posts.title, `%${query}%`))
    .orderBy(desc(posts.publishedAt))
  return result
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await db.select().from(posts).where(eq(posts.slug, slug))
  if (result[0]) {
    await db
      .update(posts)
      .set({ viewCount: result[0].viewCount + 1 })
      .where(eq(posts.id, result[0].id))
  }
  return result[0] || null
}

export async function createPost(data: InsertPost): Promise<Post> {
  const result = await db.insert(posts).values(data).returning()
  updateTag(`posts`)

  if (result[0].published) {
    const allSubscribers = await db.select().from(subscribers)
    for (const subscriber of allSubscribers) {
      await sendNewPostEmail(subscriber.email, result[0].title, result[0].slug)
    }
  }

  return result[0]
}

export async function updatePost(id: number, data: Partial<InsertPost>): Promise<Post> {
  const result = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning()
  updateTag(`posts`)
  return result[0]
}

export async function deletePost(id: number): Promise<void> {
  await db.delete(posts).where(eq(posts.id, id))
  updateTag(`posts`)
}

export async function subscribeEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    await db.insert(subscribers).values({ email })
    updateTag(`subscribers`)
    return { success: true, message: "Successfully subscribed!" }
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique")) {
      return { success: false, message: "Email already subscribed" }
    }
    return { success: false, message: "Failed to subscribe" }
  }
}

export async function getCategories() {
  return await db.select().from(categories).orderBy(categories.name)
}

export async function createCategory(data: any) {
  const result = await db.insert(categories).values(data).returning()
  updateTag(`categories`)
  return result[0]
}

export async function updateCategory(id: number, data: any) {
  const result = await db
    .update(categories)
    .set({ ...data })
    .where(eq(categories.id, id))
    .returning()
  updateTag(`categories`)
  return result[0]
}

export async function deleteCategory(id: number): Promise<void> {
  await db.delete(categories).where(eq(categories.id, id))
  updateTag(`categories`)
}

export async function getAllEvents(): Promise<Event[]> {
  const result = await db.select().from(events).orderBy(desc(events.startDate))
  return result
}

export async function getPublishedEvents(): Promise<Event[]> {
  const result = await db.select().from(events).where(eq(events.published, true)).orderBy(desc(events.startDate))
  return result
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const result = await db.select().from(events).where(eq(events.slug, slug))
  return result[0] || null
}

export async function createEvent(data: InsertEvent): Promise<Event> {
  const result = await db.insert(events).values(data).returning()
  updateTag(`events`)

  if (result[0].published) {
    const allSubscribers = await db.select().from(subscribers)
    for (const subscriber of allSubscribers) {
      await sendEventNotificationEmail(
        subscriber.email,
        result[0].title,
        result[0].slug,
        result[0].eventType as "free" | "paid",
      )
      await db.insert(emailLogs).values({
        email: subscriber.email,
        type: "event",
        contentId: result[0].id,
        contentTitle: result[0].title,
      })
    }
  }

  return result[0]
}

export async function updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event> {
  const result = await db
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning()
  updateTag(`events`)
  return result[0]
}

export async function deleteEvent(id: number): Promise<void> {
  await db.delete(events).where(eq(events.id, id))
  updateTag(`events`)
}

export async function registerForEvent(data: InsertEventRegistration): Promise<InsertEventRegistration> {
  const result = await db.insert(eventRegistrations).values(data).returning()
  updateTag(`registrations`)
  return result[0]
}

export async function getEventRegistrations(eventId: number) {
  return await db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId))
}

export async function getAllSeries(): Promise<Series[]> {
  return await db.select().from(series).orderBy(desc(series.createdAt))
}

export async function getPublishedSeries(): Promise<Series[]> {
  return await db.select().from(series).where(eq(series.published, true)).orderBy(desc(series.createdAt))
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  const result = await db.select().from(series).where(eq(series.slug, slug))
  return result[0] || null
}

export async function createSeries(data: InsertSeries): Promise<Series> {
  const result = await db.insert(series).values(data).returning()
  updateTag(`series`)
  return result[0]
}

export async function updateSeries(id: number, data: Partial<InsertSeries>): Promise<Series> {
  const result = await db
    .update(series)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(series.id, id))
    .returning()
  updateTag(`series`)
  return result[0]
}

export async function deleteSeries(id: number): Promise<void> {
  await db.delete(series).where(eq(series.id, id))
  updateTag(`series`)
}

// Episodes
export async function getEpisodesBySeriesId(seriesId: number): Promise<Episode[]> {
  return await db.select().from(episodes).where(eq(episodes.seriesId, seriesId)).orderBy(episodes.episodeNumber)
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const result = await db.select().from(episodes).where(eq(episodes.slug, slug))
  if (result[0]) {
    await db
      .update(episodes)
      .set({ viewCount: result[0].viewCount + 1 })
      .where(eq(episodes.id, result[0].id))
  }
  return result[0] || null
}

export async function createEpisode(data: InsertEpisode): Promise<Episode> {
  const result = await db.insert(episodes).values(data).returning()
  updateTag(`episodes`)
  return result[0]
}

export async function updateEpisode(id: number, data: Partial<InsertEpisode>): Promise<Episode> {
  const result = await db
    .update(episodes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(episodes.id, id))
    .returning()
  updateTag(`episodes`)
  return result[0]
}

export async function deleteEpisode(id: number): Promise<void> {
  await db.delete(episodes).where(eq(episodes.id, id))
  updateTag(`episodes`)
}
