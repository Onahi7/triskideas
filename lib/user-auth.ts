import { db } from "@/lib/db"
import { users, userSessions, type User } from "@/lib/schema"
import { eq, and, gt } from "drizzle-orm"
import bcrypt from "bcryptjs"
import crypto from "node:crypto"

export const USER_SESSION_COOKIE = "triskideas_user_session"
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

export async function registerUser({
  name,
  email,
  password,
  avatarUrl,
}: {
  name: string
  email: string
  password: string
  avatarUrl?: string
}): Promise<{ success: boolean; message: string; user?: Omit<User, "passwordHash"> }> {
  const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()))
  if (existing.length > 0) {
    return { success: false, message: "Email already registered" }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const result = await db
    .insert(users)
    .values({
      name,
      email: email.toLowerCase(),
      passwordHash,
      avatarUrl,
    })
    .returning()

  const safeUser = sanitizeUser(result[0])
  return { success: true, message: "Account created", user: safeUser }
}

export async function authenticateUser({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<{ success: boolean; message: string; user?: Omit<User, "passwordHash"> }> {
  const result = await db.select().from(users).where(eq(users.email, email.toLowerCase()))
  if (result.length === 0) {
    return { success: false, message: "Invalid credentials" }
  }

  const user = result[0]
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return { success: false, message: "Invalid credentials" }
  }

  return { success: true, message: "Authenticated", user: sanitizeUser(user) }
}

export async function createUserSession(userId: number) {
  const token = crypto.randomBytes(32).toString("hex")
  const expiry = new Date(Date.now() + SESSION_DURATION_MS)
  const tokenHash = hashToken(token)

  await db.insert(userSessions).values({
    userId,
    tokenHash,
    expiresAt: expiry,
  })

  return { token, expiresAt: expiry }
}

export async function deleteSessionByToken(token: string) {
  if (!token) return
  await db.delete(userSessions).where(eq(userSessions.tokenHash, hashToken(token)))
}

export async function getUserFromSessionToken(token?: string | null) {
  if (!token) return null
  const hashed = hashToken(token)
  const sessionRecords = await db
    .select()
    .from(userSessions)
    .where(and(eq(userSessions.tokenHash, hashed), gt(userSessions.expiresAt, new Date())))
    .limit(1)

  if (sessionRecords.length === 0) {
    return null
  }

  const userRecords = await db.select().from(users).where(eq(users.id, sessionRecords[0].userId)).limit(1)
  if (userRecords.length === 0) {
    return null
  }

  return sanitizeUser(userRecords[0])
}

export function sanitizeUser(user: User) {
  const { passwordHash, ...rest } = user
  return rest
}
