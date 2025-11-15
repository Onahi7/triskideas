import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminCredentials } from "@/lib/auth-utils"
import { createAdminSession } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ 
        success: false, 
        message: "Username and password are required" 
      }, { status: 400 })
    }

        // Verify credentials using database
    const admin = await verifyAdminCredentials(username, password)

    if (admin) {
      // Create server-side session (this sets the cookie)
      await createAdminSession(admin.username)
      
      return NextResponse.json({ 
        success: true, 
        message: "Login successful",
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName
        }
      })
    }

    return NextResponse.json({ 
      success: false, 
      message: "Invalid username or password" 
    }, { status: 401 })
    
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Authentication failed. Please try again." 
    }, { status: 500 })
  }
}
