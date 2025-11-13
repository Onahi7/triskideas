"use server"

import { db } from "@/lib/db"
import { comments, subscribers, type InsertComment, type Comment } from "@/lib/schema"
import { eq, and, isNull, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Get all comments for a post (approved only for public)
export async function getPostComments(postId: number): Promise<Comment[]> {
  const result = await db
    .select()
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.approved, true)))
    .orderBy(desc(comments.createdAt))
  return result
}

// Get all comments with replies (nested structure)
export async function getPostCommentsWithReplies(postId: number): Promise<any[]> {
  const allComments = await db
    .select()
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.approved, true)))
    .orderBy(comments.createdAt)

  // Build nested structure
  const commentMap = new Map()
  const rootComments: any[] = []

  allComments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  allComments.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId)
      if (parent) {
        parent.replies.push(commentMap.get(comment.id))
      }
    } else {
      rootComments.push(commentMap.get(comment.id))
    }
  })

  return rootComments
}

// Create a new comment (awaits approval)
export async function createComment(data: InsertComment): Promise<{ success: boolean; message: string }> {
  try {
    // Check if email exists in subscribers, if not add them
    const existingSubscriber = await db.select().from(subscribers).where(eq(subscribers.email, data.email))

    if (existingSubscriber.length === 0) {
      await db.insert(subscribers).values({ email: data.email })
    }

    // Insert comment (not approved by default)
    await db.insert(comments).values({ ...data, approved: false })

    revalidatePath(`/blog/[slug]`)

    return {
      success: true,
      message: "Comment submitted! It will appear after approval.",
    }
  } catch (error) {
    console.error("Failed to create comment:", error)
    return {
      success: false,
      message: "Failed to submit comment. Please try again.",
    }
  }
}

// Get all comments (for admin - includes unapproved)
export async function getAllComments(): Promise<Comment[]> {
  const result = await db.select().from(comments).orderBy(desc(comments.createdAt))
  return result
}

// Get pending comments (admin)
export async function getPendingComments(): Promise<Comment[]> {
  const result = await db
    .select()
    .from(comments)
    .where(eq(comments.approved, false))
    .orderBy(desc(comments.createdAt))
  return result
}

// Approve comment
export async function approveComment(id: number): Promise<void> {
  await db.update(comments).set({ approved: true }).where(eq(comments.id, id))
  revalidatePath(`/admin/comments`)
}

// Delete comment
export async function deleteComment(id: number): Promise<void> {
  await db.delete(comments).where(eq(comments.id, id))
  revalidatePath(`/admin/comments`)
}

// Get comment count for a post
export async function getCommentCount(postId: number): Promise<number> {
  const result = await db
    .select()
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.approved, true)))
  return result.length
}
