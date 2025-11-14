"use server"

import { db } from "@/lib/db"
import { comments, subscribers, posts, type InsertComment, type Comment } from "@/lib/schema"
import { eq, and, desc, or, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { randomUUID } from "node:crypto"
import { sendAdminCommentNotification, sendCommentReplyNotification } from "@/lib/email"
import { getUserFromSessionToken } from "@/lib/user-auth"
import { requireAdminAuth } from "@/lib/admin-auth"

const USER_SESSION_COOKIE = "triskideas_user_session"

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
export async function getPostCommentsWithReplies(postId: number, visibilityTokens: string[] = []): Promise<any[]> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(USER_SESSION_COOKIE)?.value || null
  const currentUser = await getUserFromSessionToken(sessionToken)

  const visibilityConditions = [eq(comments.approved, true)]
  if (currentUser) {
    visibilityConditions.push(eq(comments.userId, currentUser.id))
  }

  const tokens = visibilityTokens.filter((token) => Boolean(token))
  if (tokens.length > 0) {
    visibilityConditions.push(inArray(comments.visibilityToken, tokens))
  }

  const visibilityClause = visibilityConditions.length === 1 ? visibilityConditions[0] : or(...visibilityConditions)

  const allComments = await db
    .select()
    .from(comments)
    .where(and(eq(comments.postId, postId), visibilityClause))
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
export async function createComment(
  data: InsertComment,
): Promise<{ success: boolean; message: string; comment?: Comment; visibilityToken?: string }> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(USER_SESSION_COOKIE)?.value || null
    const currentUser = await getUserFromSessionToken(sessionToken)

    const [post] = await db
      .select({ id: posts.id, slug: posts.slug, title: posts.title })
      .from(posts)
      .where(eq(posts.id, data.postId))
      .limit(1)

    if (!post) {
      return {
        success: false,
        message: "Unable to find the selected post.",
      }
    }

    const commenterName = currentUser?.name ?? data.name
    const commenterEmail = currentUser?.email ?? data.email

    if (!commenterName || !commenterEmail) {
      return {
        success: false,
        message: "Please provide a name and email address.",
      }
    }

    // Check if email exists in subscribers, if not add them
    const existingSubscriber = await db.select().from(subscribers).where(eq(subscribers.email, commenterEmail))

    if (existingSubscriber.length === 0) {
      await db.insert(subscribers).values({ email: commenterEmail })
    }

    const visibilityToken = currentUser ? null : randomUUID()

    const insertPayload: InsertComment = {
      postId: data.postId,
      parentId: data.parentId ?? null,
      userId: currentUser?.id ?? null,
      name: commenterName,
      email: commenterEmail,
      website: data.website ?? null,
      content: data.content,
      approved: false,
      notifyOnReplies: data.notifyOnReplies ?? false,
      visibilityToken,
    }

    // Insert comment (not approved by default)
    const [createdComment] = await db.insert(comments).values(insertPayload).returning()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://triskideas.com"
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "triskideas@gmail.com"

    // Send admin notification
    sendAdminCommentNotification({
      adminEmail,
      commenterName,
      commenterEmail,
      commentContent: data.content,
      postTitle: post.title || "New comment",
      postUrl: `${appUrl}/blog/${post.slug}`,
      manageUrl: `${appUrl}/admin/comments`,
    }).catch((error) => {
      console.error("Failed to notify admin about new comment:", error)
    })

    // If this is a reply, notify the parent commenter
    if (data.parentId) {
      const [parentComment] = await db
        .select()
        .from(comments)
        .where(eq(comments.id, data.parentId))
        .limit(1)

      if (parentComment && parentComment.notifyOnReplies && parentComment.email !== commenterEmail) {
        sendCommentReplyNotification({
          recipientEmail: parentComment.email,
          recipientName: parentComment.name,
          replierName: commenterName,
          replyContent: data.content,
          postTitle: post.title || "Blog Post",
          postUrl: `${appUrl}/blog/${post.slug}#comment-${createdComment.id}`,
        }).catch((error) => {
          console.error("Failed to send reply notification:", error)
        })
      }
    }

    revalidatePath(`/blog`, "page")

    return {
      success: true,
      message: "Comment submitted! It will appear after approval.",
      comment: createdComment,
      visibilityToken: visibilityToken ?? undefined,
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
  await requireAdminAuth()
  const result = await db.select().from(comments).orderBy(desc(comments.createdAt))
  return result
}

// Get pending comments (admin)
export async function getPendingComments(): Promise<Comment[]> {
  await requireAdminAuth()
  const result = await db
    .select()
    .from(comments)
    .where(eq(comments.approved, false))
    .orderBy(desc(comments.createdAt))
  return result
}

// Approve comment
export async function approveComment(id: number): Promise<void> {
  await requireAdminAuth()
  await db.update(comments).set({ approved: true }).where(eq(comments.id, id))
  revalidatePath(`/admin/comments`, "page")
}

// Delete comment
export async function deleteComment(id: number): Promise<void> {
  await requireAdminAuth()
  await db.delete(comments).where(eq(comments.id, id))
  revalidatePath(`/admin/comments`, "page")
}

// Get comment count for a post
export async function getCommentCount(postId: number): Promise<number> {
  const result = await db
    .select()
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.approved, true)))
  return result.length
}
