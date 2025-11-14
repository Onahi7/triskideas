import { NextResponse } from "next/server"
import { neon } from '@neondatabase/serverless'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ 
        error: "DATABASE_URL not configured",
        success: false 
      }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)
    
    // Check if admin_users table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'admin_users'
      );
    `
    
    if (!tableCheck[0].exists) {
      return NextResponse.json({
        error: "admin_users table does not exist. Please run the migration.",
        success: false,
        tableExists: false
      })
    }
    
    // Check if admin user exists
    const adminCheck = await sql`
      SELECT id, username, email, full_name, active 
      FROM admin_users 
      WHERE username = 'admin'
      LIMIT 1
    `
    
    return NextResponse.json({
      success: true,
      tableExists: true,
      adminUserExists: adminCheck.length > 0,
      adminUser: adminCheck[0] || null,
      message: adminCheck.length > 0 
        ? "Admin user found in database" 
        : "Admin user not found. Please run: pnpm run seed:admin"
    })
    
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json({
      error: "Database connection failed",
      details: error instanceof Error ? error.message : "Unknown error",
      success: false
    }, { status: 500 })
  }
}