"use server"

import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { adminUsers, adminSessions } from "@/lib/schema"
import { eq, gt } from "drizzle-orm"
import crypto from "node:crypto"

const ADMIN_SESSION_COOKIE = "triskideas_admin_session"
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

interface AdminSession {
  userId: number
  username: string
  expiresAt: Date
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}

export async function createAdminSession(username: string): Promise<string | null> {
  try {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1)
    
    if (!admin || !admin.active) {
      return null
    }

    const token = crypto.randomBytes(32).toString("hex")
    const hashedToken = hashToken(token)
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

    // Store session in database
    await db.insert(adminSessions).values({
      adminUserId: admin.id,
      tokenHash: hashedToken,
      expiresAt,
    })

    const cookieStore = await cookies()
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    return token
  } catch (error) {
    console.error("Failed to create admin session:", error)
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

    if (!token) {
      return null
    }

    const hashedToken = hashToken(token)
    
    // Get session from database with admin user info
    const [sessionData] = await db
      .select({
        userId: adminSessions.adminUserId,
        username: adminUsers.username,
        expiresAt: adminSessions.expiresAt,
      })
      .from(adminSessions)
      .innerJoin(adminUsers, eq(adminSessions.adminUserId, adminUsers.id))
      .where(eq(adminSessions.tokenHash, hashedToken))
      .limit(1)

    if (!sessionData) {
      return null
    }

    // Check if session has expired
    if (sessionData.expiresAt < new Date()) {
      await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashedToken))
      return null
    }

    return sessionData
  } catch (error) {
    console.error("Failed to get admin session:", error)
    return null
  }
}

export async function deleteAdminSession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

    if (token) {
      const hashedToken = hashToken(token)
      await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashedToken))
    }

    cookieStore.delete(ADMIN_SESSION_COOKIE)
  } catch (error) {
    console.error("Failed to delete admin session:", error)
  }
}

export async function requireAdminAuth(): Promise<AdminSession> {
  const session = await getAdminSession()
  
  if (!session) {
    throw new Error("Unauthorized: Admin authentication required")
  }

  return session
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession()
  return session !== null
}
