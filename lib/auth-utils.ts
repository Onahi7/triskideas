import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export interface AdminUser {
  id: number
  username: string
  email: string | null
  fullName: string | null
  active: boolean
}

/**
 * Verify admin credentials with hashed password
 */
export async function verifyAdminCredentials(
  username: string, 
  password: string
): Promise<AdminUser | null> {
  try {
    const result = await sql`
      SELECT id, username, password_hash, email, full_name, active
      FROM admin_users 
      WHERE username = ${username} AND active = true
      LIMIT 1
    `
    
    if (result.length === 0) {
      return null
    }
    
    const admin = result[0]
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    
    if (!isValidPassword) {
      return null
    }
    
    // Return admin data without password hash
    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      fullName: admin.full_name,
      active: admin.active,
    }
  } catch (error) {
    console.error('Error verifying admin credentials:', error)
    return null
  }
}

/**
 * Create a new admin user with hashed password
 */
export async function createAdminUser(
  username: string,
  password: string,
  email?: string,
  fullName?: string
): Promise<AdminUser | null> {
  try {
    // Check if username already exists
    const existing = await sql`
      SELECT id FROM admin_users WHERE username = ${username} LIMIT 1
    `
    
    if (existing.length > 0) {
      throw new Error('Username already exists')
    }
    
    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    // Insert new admin
    const result = await sql`
      INSERT INTO admin_users (username, password_hash, email, full_name, active)
      VALUES (${username}, ${passwordHash}, ${email || null}, ${fullName || null}, true)
      RETURNING id, username, email, full_name, active
    `
    
    return {
      id: result[0].id,
      username: result[0].username,
      email: result[0].email,
      fullName: result[0].full_name,
      active: result[0].active,
    }
  } catch (error) {
    console.error('Error creating admin user:', error)
    return null
  }
}

/**
 * Update admin password
 */
export async function updateAdminPassword(
  username: string,
  newPassword: string
): Promise<boolean> {
  try {
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)
    
    const result = await sql`
      UPDATE admin_users 
      SET password_hash = ${passwordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE username = ${username} AND active = true
    `
    
    return result.count > 0
  } catch (error) {
    console.error('Error updating admin password:', error)
    return false
  }
}